#!/usr/bin/env tsx
// ============================================================================
// Casos OSCE Dinâmicos — Beta · TESTE PULSE REAL OUTPUT READER (Fase 7)
// ----------------------------------------------------------------------------
// Valida a leitura de saída real do Pulse usando arquivos sintéticos em /tmp.
// Integra com normalizePulseOutputs + pulseVitalsToPatientState do caso asma.
//
// Critérios testados:
//   1. Lê JSON sintético com campos Pulse (com unidade na chave)
//   2. Mapeia OxygenSaturation fracionária → %
//   3. Lê CSV com duas linhas de dados e usa a última
//   4. HeartRate mapeado corretamente do CSV
//   5. RespirationRate mapeado corretamente do CSV
//   6. SpO₂ mapeada corretamente do CSV (fração → %)
//   7. InspiratoryRespiratoryResistance → AirwayResistance
//   8. Aorta-CarbonDioxide-PartialPressure → ArterialCarbonDioxidePressure
//   9. normalizePulseOutputs integra sem erro
//  10. pulseVitalsToPatientState integra (bridge)
//  11. recomputarClinica rodou (clinical.ausculta preenchido)
//  12. JSON sem OxygenSaturation → normalizer aplica fallback 95 (sem erro)
//  13. Arquivo inexistente lança Error com mensagem clara
//  14. Detectedformat "json" para JSON, "csv" para CSV
// ============================================================================

import os from "os";
import fs from "fs";
import path from "path";

import { readPulseOutputFileAsRawOutput } from "../pulse/pulse-real-output-reader";
import { normalizePulseOutputs } from "../pulse/pulse-output-normalizer";
import { pulseVitalsToPatientState } from "../pulse/pulse-medix-bridge";
import { pilotoAsmaGraveAdulto } from "../cases/piloto-asma-grave-adulto";

// ---------------------------------------------------------------------------
// Setup de assert
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;
const failures: string[] = [];

function ok(cond: boolean, label: string): void {
  if (cond) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ FALHOU: ${label}`);
    failed++;
    failures.push(label);
  }
}

function secao(titulo: string): void {
  console.log(`\n── ${titulo} ${"─".repeat(Math.max(0, 60 - titulo.length))}`);
}

// ---------------------------------------------------------------------------
// Arquivos temporários
// ---------------------------------------------------------------------------

const TMP_DIR = path.join(os.tmpdir(), "pulse-reader-test-fase7");
fs.mkdirSync(TMP_DIR, { recursive: true });

const JSON_FILE = path.join(TMP_DIR, "pulse_output_test.json");
const CSV_FILE  = path.join(TMP_DIR, "pulse_output_test.csv");

// JSON sintético com chaves Pulse reais (com unidades)
const jsonData = {
  "HeartRate(1/min)":                          119.5,
  "RespirationRate(1/min)":                     33.2,
  "OxygenSaturation(unitless)":                  0.88,   // fração Pulse → deve virar 88.0%
  "SystolicArterialPressure(mmHg)":            128.0,
  "DiastolicArterialPressure(mmHg)":            80.5,
  "CoreTemperature(degC)":                      37.2,
  "BloodPH(unitless)":                           7.34,
  "Aorta-CarbonDioxide-PartialPressure(mmHg)": 42.1,
  "Aorta-Oxygen-PartialPressure(mmHg)":         61.8,
  "InspiratoryRespiratoryResistance(cmH2O s/L)": 17.5,
};
fs.writeFileSync(JSON_FILE, JSON.stringify(jsonData, null, 2));

// CSV sintético com duas linhas de timestep (deve usar a última)
const csvHeaders = [
  "Time(s)",
  "HeartRate(1/min)",
  "RespirationRate(1/min)",
  "OxygenSaturation(unitless)",
  "SystolicArterialPressure(mmHg)",
  "DiastolicArterialPressure(mmHg)",
  "CoreTemperature(degC)",
  "BloodPH(unitless)",
  "Aorta-CarbonDioxide-PartialPressure(mmHg)",
  "Aorta-Oxygen-PartialPressure(mmHg)",
  "InspiratoryRespiratoryResistance(cmH2O s/L)",
].join(",");

const csvRow1 = "0.00,68.0,16.0,0.990,120.0,75.0,37.0,7.40,40.0,95.0,2.1";   // estado normal (T=0)
const csvRow2 = "30.0,122.0,34.0,0.88,130.0,82.0,37.2,7.34,42.0,62.0,17.5";   // após crise (deve usar esta)
fs.writeFileSync(CSV_FILE, [csvHeaders, csvRow1, csvRow2].join("\n"));

// ---------------------------------------------------------------------------
// Estado base do caso asma
// ---------------------------------------------------------------------------

const estadoInicial = pilotoAsmaGraveAdulto.fisiologia.estadoInicial;

console.log("=".repeat(70));
console.log("TESTE: Pulse Real Output Reader — Fase 7");
console.log("=".repeat(70));

// ---------------------------------------------------------------------------
// Critérios 1–3: JSON
// ---------------------------------------------------------------------------
secao("Critérios 1–3 — Leitura de JSON sintético");
const jsonResult = readPulseOutputFileAsRawOutput(JSON_FILE);

ok(jsonResult.detectedFormat === "json",          "Formato detectado como 'json'");
ok(typeof jsonResult.raw["HeartRate"] === "number" && jsonResult.raw["HeartRate"] === 119.5,
   `HeartRate extraído do JSON (${jsonResult.raw["HeartRate"]})`);
ok(
  typeof jsonResult.raw["OxygenSaturation"] === "number" &&
  Math.abs((jsonResult.raw["OxygenSaturation"] as number) - 88.0) < 0.01,
  `OxygenSaturation fracionária → % (${jsonResult.raw["OxygenSaturation"]}%)`
);

// ---------------------------------------------------------------------------
// Critérios 4–8: CSV
// ---------------------------------------------------------------------------
secao("Critérios 4–8 — Leitura de CSV sintético (2 linhas → última)");
const csvResult = readPulseOutputFileAsRawOutput(CSV_FILE);

ok(csvResult.detectedFormat === "csv",          "Formato detectado como 'csv'");
ok(typeof csvResult.raw["HeartRate"] === "number" && csvResult.raw["HeartRate"] === 122.0,
   `HeartRate da última linha CSV (${csvResult.raw["HeartRate"]})`);
ok(typeof csvResult.raw["RespirationRate"] === "number" && csvResult.raw["RespirationRate"] === 34.0,
   `RespirationRate da última linha CSV (${csvResult.raw["RespirationRate"]})`);
ok(
  typeof csvResult.raw["OxygenSaturation"] === "number" &&
  Math.abs((csvResult.raw["OxygenSaturation"] as number) - 88.0) < 0.01,
  `SpO₂ da última linha CSV convertida para % (${csvResult.raw["OxygenSaturation"]}%)`
);
ok(typeof csvResult.raw["AirwayResistance"] === "number" && csvResult.raw["AirwayResistance"] === 17.5,
   `InspiratoryRespiratoryResistance → AirwayResistance (${csvResult.raw["AirwayResistance"]})`
);
ok(typeof csvResult.raw["ArterialCarbonDioxidePressure"] === "number" && csvResult.raw["ArterialCarbonDioxidePressure"] === 42.0,
   `Aorta-CarbonDioxide-PartialPressure → ArterialCarbonDioxidePressure (${csvResult.raw["ArterialCarbonDioxidePressure"]})`
);

// ---------------------------------------------------------------------------
// Critérios 9–11: Integração com normalizer e bridge
// ---------------------------------------------------------------------------
secao("Critérios 9–11 — Integração normalizer → bridge → recomputarClinica");
const { normalized, warnings: wNorm } = normalizePulseOutputs(csvResult.raw);

ok(typeof normalized.heartRate_bpm === "number" && normalized.heartRate_bpm === 122,
   `normalizer.heartRate_bpm = 122`);
ok(typeof normalized.oxygenSaturation === "number" && normalized.oxygenSaturation === 88,
   `normalizer.oxygenSaturation = 88%`);

const { patientState } = pulseVitalsToPatientState({
  currentState: estadoInicial,
  normalized,
});

ok(
  typeof patientState.clinical.ausculta === "string" && patientState.clinical.ausculta.length > 5,
  `recomputarClinica rodou: ausculta="${patientState.clinical.ausculta.slice(0, 50)}"`
);
ok(
  patientState.vitals.spo2 === 88,
  `patientState.vitals.spo2 = 88% (mapeado corretamente)`
);

// ---------------------------------------------------------------------------
// Critério 12: JSON sem OxygenSaturation → fallback 95
// ---------------------------------------------------------------------------
secao("Critério 12 — JSON sem SpO₂ → normalizer aplica fallback 95");
const jsonSemSpo2 = path.join(TMP_DIR, "pulse_sem_spo2.json");
fs.writeFileSync(jsonSemSpo2, JSON.stringify({ "HeartRate(1/min)": 90, "RespirationRate(1/min)": 18 }));
const resultSemSpo2 = readPulseOutputFileAsRawOutput(jsonSemSpo2);
const { normalized: normSemSpo2 } = normalizePulseOutputs(resultSemSpo2.raw);
ok(normSemSpo2.oxygenSaturation === 95, `SpO₂ ausente → fallback 95% (${normSemSpo2.oxygenSaturation})`);

// ---------------------------------------------------------------------------
// Critério 13: Arquivo inexistente lança Error
// ---------------------------------------------------------------------------
secao("Critério 13 — Arquivo inexistente lança Error");
let errou = false;
let errMsg = "";
try {
  readPulseOutputFileAsRawOutput("/tmp/nao-existe-pulse-output.csv");
} catch (e: unknown) {
  errou = true;
  errMsg = String(e);
}
ok(errou, "Error lançado para arquivo inexistente");
ok(errMsg.includes("não encontrado"), `Mensagem menciona 'não encontrado': "${errMsg.slice(0, 80)}"`);

// ---------------------------------------------------------------------------
// Critério 14: detectedFormat
// ---------------------------------------------------------------------------
secao("Critério 14 — detectedFormat correto");
ok(jsonResult.detectedFormat === "json", "JSON → detectedFormat 'json'");
ok(csvResult.detectedFormat === "csv",  "CSV → detectedFormat 'csv'");

// ---------------------------------------------------------------------------
// Limpeza de arquivos temporários
// ---------------------------------------------------------------------------
try {
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
} catch {
  // silencioso
}

// ---------------------------------------------------------------------------
// Resumo
// ---------------------------------------------------------------------------
console.log("\n" + "=".repeat(70));
if (failed === 0) {
  console.log(`RESUMO: ✅ TODOS os ${passed} critérios passaram.`);
  console.log("Reader pronto para receber output real do Pulse.");
  console.log("=".repeat(70));
  process.exit(0);
} else {
  console.error(`RESUMO: ❌ ${failed} falha(s) de ${passed + failed} critério(s).`);
  failures.forEach((f) => console.error(`  • ${f}`));
  console.log("=".repeat(70));
  process.exit(1);
}
