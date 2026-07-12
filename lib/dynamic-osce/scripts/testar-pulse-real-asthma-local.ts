#!/usr/bin/env tsx
// ============================================================================
// Casos OSCE Dinâmicos — Beta · TESTE PULSE REAL — ASMA GRAVE LOCAL (Fase 8)
// ----------------------------------------------------------------------------
// Integra output real (ou sintético) do Pulse com a pipeline MEDIX completa:
//   readPulseOutputFileAsRawOutput → normalizePulseOutputs
//   → pulseVitalsToPatientState → PatientState → recomputarClinica
//
// Uso:
//   npx tsx lib/dynamic-osce/scripts/testar-pulse-real-asthma-local.ts [OUTPUT_FILE]
//
// Se OUTPUT_FILE não for fornecido, usa um output sintético em /tmp que simula
// o formato real do Pulse CSV (formato nativo gerado pelo engine após compilação).
//
// Quando o Pulse real for executado (Fase 9+), basta passar o CSV gerado:
//   npx tsx .../testar-pulse-real-asthma-local.ts /tmp/pulse_asthma_output.csv
// ============================================================================

import os from "os";
import fs from "fs";
import path from "path";

import { readPulseOutputFileAsRawOutput } from "../pulse/pulse-real-output-reader";
import { normalizePulseOutputs } from "../pulse/pulse-output-normalizer";
import { pulseVitalsToPatientState } from "../pulse/pulse-medix-bridge";
import {
  PULSE_FIXTURE_ASTHMA_BASELINE,
  PULSE_FIXTURE_ASTHMA_AFTER_BRONCHODILATOR,
} from "../pulse/pulse-fixtures-asthma";
import { pilotoAsmaGraveAdulto } from "../cases/piloto-asma-grave-adulto";

// ---------------------------------------------------------------------------
// Argumento: path do output real (ou sintético)
// ---------------------------------------------------------------------------

const argPath = process.argv[2];
let outputFilePath: string;
let usingReal = false;

if (argPath && fs.existsSync(argPath)) {
  outputFilePath = argPath;
  usingReal = true;
  console.log(`\nMODO: Output REAL fornecido via argumento: ${argPath}`);
} else {
  // Gerar CSV sintético em /tmp que representa o formato nativo do Pulse
  const tmpFile = path.join(os.tmpdir(), "pulse_asthma_fase8_sintético.csv");

  // Formato exato do CSV de output Pulse:
  //   Time(s),HeartRate(1/min),RespirationRate(1/min),OxygenSaturation(unitless),...
  const headers = [
    "Time(s)",
    "HeartRate(1/min)",
    "RespirationRate(1/min)",
    "OxygenSaturation(unitless)",         // Pulse: fração 0–1
    "SystolicArterialPressure(mmHg)",
    "DiastolicArterialPressure(mmHg)",
    "CoreTemperature(degC)",
    "BloodPH(unitless)",
    "Aorta-CarbonDioxide-PartialPressure(mmHg)",
    "Aorta-Oxygen-PartialPressure(mmHg)",
    "InspiratoryRespiratoryResistance(cmH2O s/L)",
  ].join(",");

  // Linha 1 (t=0s): estado saudável basal antes da crise
  const row0 = "0.0,68.0,16.0,0.9890,120.0,75.0,37.0,7.400,40.0,95.0,2.10";
  // Linha 2 (t=30s): após crise asmática grave (AsthmaAttackSevereAcute — severidade 0.75)
  const row30 = "30.0,122.0,34.0,0.8800,130.0,82.0,37.2,7.340,42.0,62.0,17.50";
  // Linha 3 (t=580s): após resolução parcial (cenário SevereAcute termina)
  const row580 = "580.0,94.0,22.0,0.9600,124.0,78.0,37.0,7.380,39.0,82.0,5.20";

  fs.writeFileSync(tmpFile, [headers, row0, row30, row580].join("\n"));
  outputFilePath = tmpFile;
  console.log(`\nMODO: Sem output real. Usando CSV sintético em formato Pulse: ${tmpFile}`);
  console.log(
    "       (Pulse não compilado — compile PyPulse via CMake para usar output real)"
  );
}

// ---------------------------------------------------------------------------
// Utilitários de assert
// ---------------------------------------------------------------------------

let passedCount = 0;
let failedCount = 0;
const failures: string[] = [];

function ok(cond: boolean, label: string): void {
  if (cond) {
    console.log(`  ✅ ${label}`);
    passedCount++;
  } else {
    console.error(`  ❌ FALHOU: ${label}`);
    failedCount++;
    failures.push(label);
  }
}

function secao(titulo: string): void {
  console.log(`\n── ${titulo} ${"─".repeat(Math.max(0, 62 - titulo.length))}`);
}

const estadoInicial = pilotoAsmaGraveAdulto.fisiologia.estadoInicial;

console.log("=".repeat(70));
console.log(
  usingReal
    ? "PIPELINE: Output REAL do Pulse → PatientState MEDIX"
    : "PIPELINE: CSV sintético (formato Pulse) → PatientState MEDIX"
);
console.log("=".repeat(70));

// ---------------------------------------------------------------------------
// Validação 1 — Arquivo existe
// ---------------------------------------------------------------------------
secao("Validação 1 — Arquivo de output");
ok(fs.existsSync(outputFilePath), `Arquivo existe: ${outputFilePath}`);

// ---------------------------------------------------------------------------
// Validação 2-5 — Reader
// ---------------------------------------------------------------------------
secao("Validações 2–5 — Leitura do output");
const { raw, warnings: readerWarnings, detectedFormat } = readPulseOutputFileAsRawOutput(outputFilePath);

console.log(`  Formato detectado: ${detectedFormat}`);
ok(
  detectedFormat === "csv" || detectedFormat === "json",
  `Formato reconhecido (${detectedFormat})`
);

// Pelo menos um dos campos essenciais deve ter sido extraído
const temVitais =
  typeof raw["HeartRate"] === "number" ||
  typeof raw["OxygenSaturation"] === "number" ||
  typeof raw["RespirationRate"] === "number";
ok(temVitais, "Pelo menos FC, SpO₂ ou FR extraído do output");

// SpO₂ deve estar em % (não fração)
const spo2Raw = raw["OxygenSaturation"] as number | undefined;
if (spo2Raw !== undefined) {
  ok(spo2Raw > 1.5, `OxygenSaturation convertida para % (${spo2Raw.toFixed(1)}%)`);
}
ok(typeof raw["HeartRate"] === "number", `HeartRate extraído (${raw["HeartRate"]})`);

// Warnings do reader (informativos — não falham)
if (readerWarnings.length > 0) {
  console.log("\n  Warnings do reader:");
  readerWarnings.forEach((w) => console.log(`    ⚠️  ${w}`));
}

// ---------------------------------------------------------------------------
// Validação 6-9 — Normalizer
// ---------------------------------------------------------------------------
secao("Validações 6–9 — normalizePulseOutputs");
const { normalized, warnings: normWarnings, usedFallbacks } = normalizePulseOutputs(raw);

console.log(`  SpO₂=${normalized.oxygenSaturation}%  FC=${normalized.heartRate_bpm} bpm  FR=${normalized.respirationRate_bpm} irpm`);
console.log(`  PA ${normalized.systolicBloodPressure_mmHg}/${normalized.diastolicBloodPressure_mmHg}  Temp=${normalized.bodyTemperature_C}°C`);
if (normalized.bloodPH) console.log(`  pH=${normalized.bloodPH}  CO₂=${normalized.arterialCO2Pressure_mmHg}  O₂=${normalized.arterialO2Pressure_mmHg}`);
if (normalized.airwayResistance) console.log(`  AirwayResistance=${normalized.airwayResistance} cmH₂O/L/s`);

ok(normalized.heartRate_bpm > 0,       `heartRate_bpm > 0 (${normalized.heartRate_bpm})`);
ok(normalized.respirationRate_bpm > 0, `respirationRate_bpm > 0 (${normalized.respirationRate_bpm})`);
ok(normalized.oxygenSaturation > 0 && normalized.oxygenSaturation <= 100, `oxygenSaturation ∈ (0,100] (${normalized.oxygenSaturation}%)`);
ok(normalized.systolicBloodPressure_mmHg > 0, `systolicBP > 0 (${normalized.systolicBloodPressure_mmHg} mmHg)`);

if (usedFallbacks.length > 0) {
  console.log("\n  Fallbacks aplicados:");
  usedFallbacks.forEach((f) => console.log(`    • ${f}`));
}

// ---------------------------------------------------------------------------
// Validação 10-13 — Bridge → PatientState
// ---------------------------------------------------------------------------
secao("Validações 10–13 — pulseVitalsToPatientState");
const { patientState, warnings: bridgeWarnings, usedFallbacks: bridgeFallbacks } =
  pulseVitalsToPatientState({ currentState: estadoInicial, normalized });

console.log("\n  PatientState gerado:");
console.log(`    vitals.spo2  = ${patientState.vitals.spo2}%`);
console.log(`    vitals.fc    = ${patientState.vitals.fc} bpm`);
console.log(`    vitals.fr    = ${patientState.vitals.fr} irpm`);
console.log(`    vitals.paSys = ${patientState.vitals.paSys} mmHg`);
console.log(`    vitals.temp  = ${patientState.vitals.temp.toFixed(1)}°C`);
console.log(`    broncoespasmo= ${patientState.broncoespasmo}`);
console.log(`  \n  clinical.estadoGeral:         "${patientState.clinical.estadoGeral}"`);
console.log(`    clinical.trabalhoResp:        "${patientState.clinical.trabalhoRespiratorio}"`);
console.log(`    clinical.ausculta:            "${patientState.clinical.ausculta}"`);
console.log(`    clinical.fala:                "${patientState.clinical.fala}"`);
console.log(`    clinical.perfusao:            "${patientState.clinical.perfusao}"`);

ok(patientState.vitals.spo2 > 0 && patientState.vitals.spo2 <= 100, `vitals.spo2 válido (${patientState.vitals.spo2}%)`);
ok(patientState.vitals.fc > 0, `vitals.fc válido (${patientState.vitals.fc} bpm)`);
ok(typeof patientState.clinical.ausculta === "string" && patientState.clinical.ausculta.length > 5, "recomputarClinica rodou (ausculta preenchida)");
ok(typeof patientState.clinical.trabalhoRespiratorio === "string", "recomputarClinica rodou (trabalhoRespiratorio preenchido)");

if (bridgeWarnings.length > 0) {
  console.log("\n  Warnings da bridge:");
  bridgeWarnings.forEach((w) => console.log(`    ⚠️  ${w}`));
}

// ---------------------------------------------------------------------------
// Validação 14 — Provider inalterado
// ---------------------------------------------------------------------------
secao("Validação 14 — simulationProvider inalterado");
ok(
  pilotoAsmaGraveAdulto.simulacao.simulationProvider === "medix-rule-based",
  "simulationProvider permanece medix-rule-based"
);

// ---------------------------------------------------------------------------
// Comparação com fixture da Fase 6 (quando há vitais similares)
// ---------------------------------------------------------------------------
secao("Comparação com fixture Fase 6");
const { normalized: normBaseline } = normalizePulseOutputs(PULSE_FIXTURE_ASTHMA_BASELINE);
const { normalized: normBD }       = normalizePulseOutputs(PULSE_FIXTURE_ASTHMA_AFTER_BRONCHODILATOR);

// SpO₂ do output (última linha = estado mais avançado) vs fixture baseline e após-BD
const outputSpo2 = normalized.oxygenSaturation;
const baselineSpo2 = normBaseline.oxygenSaturation;  // 88%
const bdSpo2       = normBD.oxygenSaturation;          // 96%

console.log(`\n  SpO₂ — output Pulse: ${outputSpo2}%`);
console.log(`           fixture baseline: ${baselineSpo2}%`);
console.log(`           fixture após BD:  ${bdSpo2}%`);

if (usingReal) {
  // Com output real, comparação é informativa
  console.log(`  (output real — comparação informativa; pode diferir das fixtures sintéticas)`);
} else {
  // Com sintético, a última linha é o estado pós-resolução parcial (SpO₂ = 96%)
  ok(outputSpo2 >= baselineSpo2, `SpO₂ output ≥ SpO₂ baseline fixture (${outputSpo2}% ≥ ${baselineSpo2}%)`);
}

// ---------------------------------------------------------------------------
// Resumo
// ---------------------------------------------------------------------------
console.log("\n" + "=".repeat(70));
if (failedCount === 0) {
  console.log(`RESUMO: ✅ TODOS os ${passedCount} critérios passaram.`);
  if (usingReal) {
    console.log("Pipeline Pulse real → MEDIX funcionando.");
  } else {
    console.log(
      "Pipeline CSV sintético → MEDIX funcionando. " +
        "Aguardando compilação de PyPulse para output real."
    );
  }
} else {
  console.error(`RESUMO: ❌ ${failedCount} falha(s) de ${passedCount + failedCount}.`);
  failures.forEach((f) => console.error(`  • ${f}`));
}
console.log("=".repeat(70));
process.exit(failedCount === 0 ? 0 : 1);
