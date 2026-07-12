// ============================================================================
// Casos OSCE Dinâmicos — Beta · PULSE REAL OUTPUT READER (Fase 7)
// ----------------------------------------------------------------------------
// Lê um arquivo de saída real do Pulse (gerado após execução local) e converte
// para PulseRawOutput, compatível com o adapter da Fase 6.
//
// Formatos suportados:
//   • JSON: dict flat de campos Pulse (com ou sem unidade na chave).
//   • CSV:  cabeçalho com nomes Pulse, linhas numéricas por timestep.
//           Usa sempre a ÚLTIMA linha válida.
//   • TXT:  equivalente ao CSV (mesmo parser).
//
// O Pulse nativo produz CSV. O Python API pode exportar para JSON.
// O normalizer da Fase 6 aplica fallbacks para campos ausentes — este reader
// apenas extrai o que estiver disponível, sem inventar valores.
// ============================================================================

import fs from "fs";
import path from "path";
import type { PulseRawOutput } from "./pulse-output-normalizer";

export type DetectedFormat = "json" | "csv" | "txt" | "unknown";

// ---------------------------------------------------------------------------
// Mapeamentos de coluna → nome PulseRawOutput canônico
// ---------------------------------------------------------------------------

// Campos simples: strip do sufixo `(unit)` e alias conhecidos
const SIMPLE_ALIAS: Record<string, string> = {
  // Vitais centrais
  HeartRate:               "HeartRate",
  RespirationRate:         "RespirationRate",
  OxygenSaturation:        "OxygenSaturation",
  SystolicArterialPressure:"SystolicArterialPressure",
  DiastolicArterialPressure:"DiastolicArterialPressure",
  CoreTemperature:         "CoreTemperature",
  SkinTemperature:         "BodyTemperature",   // fallback para temp
  BloodPH:                 "BloodPH",
  // Mecânica respiratória
  InspiratoryRespiratoryResistance: "AirwayResistance",
  ExpiratoryRespiratoryResistance:  "AirwayResistance",  // sobreescrito pelo inspiratório se ambos presentes
  RespiratoryMuscleFatigue:         "RespiratoryMusclePressure",
};

// Campos compostos: nome-com-hífen do CSV → nome PulseRawOutput
const COMPARTMENT_MAP: Record<string, string> = {
  // Gases arteriais (Aorta)
  "Aorta-CarbonDioxide-PartialPressure": "ArterialCarbonDioxidePressure",
  "Aorta-Oxygen-PartialPressure":        "ArterialOxygenPressure",
  // Carina (alternativa usada pela translator existente)
  "Carina-CarbonDioxide-PartialPressure": "ArterialCarbonDioxidePressure",
  "Carina-Oxygen-PartialPressure":        "ArterialOxygenPressure",
  // Com barra (formato Python API)
  "Aorta/CarbonDioxide/PartialPressure": "ArterialCarbonDioxidePressure",
  "Aorta/Oxygen/PartialPressure":        "ArterialOxygenPressure",
};

// ---------------------------------------------------------------------------
// API pública
// ---------------------------------------------------------------------------

/**
 * Lê um arquivo de saída Pulse e retorna PulseRawOutput.
 *
 * Exceções: lança Error apenas se o arquivo não existir ou for ilegível.
 * Campos ausentes NO arquivo resultam em undefined no raw (o normalizer aplica fallback).
 */
export function readPulseOutputFileAsRawOutput(filePath: string): {
  raw: PulseRawOutput;
  warnings: string[];
  detectedFormat: DetectedFormat;
} {
  if (!fs.existsSync(filePath)) {
    throw new Error(`[pulse-real-output-reader] Arquivo não encontrado: ${filePath}`);
  }

  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8").trim();
  } catch (e) {
    throw new Error(`[pulse-real-output-reader] Erro ao ler ${filePath}: ${String(e)}`);
  }

  if (!content) {
    throw new Error(`[pulse-real-output-reader] Arquivo vazio: ${filePath}`);
  }

  const ext = path.extname(filePath).toLowerCase();
  const warnings: string[] = [];

  // Detecção de formato
  const looksLikeJson = content.startsWith("{") || content.startsWith("[");
  let detectedFormat: DetectedFormat;

  if (looksLikeJson) {
    detectedFormat = "json";
    const raw = parseJsonOutput(content, warnings);
    return { raw, warnings, detectedFormat };
  }

  if (ext === ".csv" || ext === ".txt" || content.includes(",")) {
    detectedFormat = ext === ".txt" ? "txt" : "csv";
    const raw = parseCsvOutput(content, warnings);
    return { raw, warnings, detectedFormat };
  }

  detectedFormat = "unknown";
  warnings.push(`Formato desconhecido para ${filePath} — tentando parser CSV genérico.`);
  const raw = parseCsvOutput(content, warnings);
  return { raw, warnings, detectedFormat };
}

// ---------------------------------------------------------------------------
// Parsers internos
// ---------------------------------------------------------------------------

/**
 * Parser JSON: aceita dict flat ou array de dict (usa último elemento).
 * Chaves podem ser:
 *   - Nome Pulse puro: "HeartRate"
 *   - Nome com unidade: "HeartRate(1/min)"
 *   - Nome composto: "Aorta-CarbonDioxide-PartialPressure(mmHg)"
 */
function parseJsonOutput(content: string, warnings: string[]): PulseRawOutput {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    throw new Error(`[pulse-real-output-reader] JSON inválido: ${String(e)}`);
  }

  let record: Record<string, unknown>;
  if (Array.isArray(parsed)) {
    // Array de timesteps — usar último
    if (parsed.length === 0) {
      warnings.push("JSON é array vazio — nenhum dado extraído.");
      return {};
    }
    record = parsed[parsed.length - 1] as Record<string, unknown>;
    if (parsed.length > 1) {
      warnings.push(`JSON array com ${parsed.length} timesteps — usando o último.`);
    }
  } else if (typeof parsed === "object" && parsed !== null) {
    record = parsed as Record<string, unknown>;
  } else {
    throw new Error("[pulse-real-output-reader] JSON não é object nem array.");
  }

  const raw: PulseRawOutput = {};
  for (const [key, val] of Object.entries(record)) {
    if (typeof val !== "number") continue;
    const canonical = resolveColumnName(key);
    if (!canonical) {
      continue; // campo não mapeado — silencioso
    }
    raw[canonical] = postProcessValue(canonical, val, warnings);
  }
  return raw;
}

/**
 * Parser CSV/TXT:
 *  - Linha 0: cabeçalhos
 *  - Linhas 1..N: valores numéricos por timestep
 *  - Usa a ÚLTIMA linha com valores válidos
 */
function parseCsvOutput(content: string, warnings: string[]): PulseRawOutput {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    warnings.push("CSV/TXT: menos de 2 linhas — sem dados numéricos.");
    return {};
  }

  const headers = lines[0].split(",").map((h) => h.trim());

  // Encontrar última linha válida (todos campos numéricos ou vazio mas parseable)
  let lastValidLine: string[] | null = null;
  for (let i = lines.length - 1; i >= 1; i--) {
    const cols = lines[i].split(",").map((c) => c.trim());
    if (cols.length === headers.length && cols.some((c) => c !== "" && !isNaN(parseFloat(c)))) {
      lastValidLine = cols;
      break;
    }
  }

  if (!lastValidLine) {
    warnings.push("CSV/TXT: nenhuma linha válida com valores numéricos encontrada.");
    return {};
  }

  if (lines.length > 2) {
    warnings.push(`CSV/TXT: ${lines.length - 1} linhas de dados — usando a última.`);
  }

  const raw: PulseRawOutput = {};
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    const canonical = resolveColumnName(header);
    if (!canonical) continue;
    const numStr = lastValidLine[i];
    const num = parseFloat(numStr);
    if (isNaN(num)) continue;
    raw[canonical] = postProcessValue(canonical, num, warnings);
  }
  return raw;
}

// ---------------------------------------------------------------------------
// Resolução de nomes de coluna
// ---------------------------------------------------------------------------

/**
 * Converte um nome de coluna Pulse (com/sem unidades, com/sem separador) para
 * o nome canônico de PulseRawOutput. Retorna undefined se não reconhecer.
 */
function resolveColumnName(rawKey: string): string | undefined {
  // 1. Chave composta conhecida (verificar antes de strip)
  const noUnit = stripUnit(rawKey);
  if (COMPARTMENT_MAP[noUnit]) return COMPARTMENT_MAP[noUnit];
  if (COMPARTMENT_MAP[rawKey]) return COMPARTMENT_MAP[rawKey];

  // 2. Chave simples conhecida
  if (SIMPLE_ALIAS[noUnit]) return SIMPLE_ALIAS[noUnit];
  if (SIMPLE_ALIAS[rawKey]) return SIMPLE_ALIAS[rawKey];

  // 3. Passthrough: campos que já têm o nome esperado pelo normalizer
  //    (HeartRate, OxygenSaturation, etc. sem alias — já cobertos acima)
  return undefined;
}

/**
 * Remove sufixo de unidade `(unit)` do nome da coluna Pulse.
 * "HeartRate(1/min)" → "HeartRate"
 * "OxygenSaturation(unitless)" → "OxygenSaturation"
 * "Aorta-CarbonDioxide-PartialPressure(mmHg)" → "Aorta-CarbonDioxide-PartialPressure"
 */
function stripUnit(key: string): string {
  const parenIdx = key.indexOf("(");
  return parenIdx >= 0 ? key.slice(0, parenIdx).trim() : key.trim();
}

/**
 * Pós-processamento de valores conhecidos que precisam de conversão de escala.
 * Ex.: OxygenSaturation no Pulse é 0.0–1.0 (fração); o normalizer espera 0–100 (%).
 */
function postProcessValue(
  canonical: string,
  value: number,
  warnings: string[]
): number {
  if (canonical === "OxygenSaturation" && value >= 0 && value <= 1.0) {
    const pct = value * 100;
    warnings.push(
      `OxygenSaturation convertida de fração Pulse (${value.toFixed(3)}) para % (${pct.toFixed(1)}%).`
    );
    return pct;
  }
  return value;
}
