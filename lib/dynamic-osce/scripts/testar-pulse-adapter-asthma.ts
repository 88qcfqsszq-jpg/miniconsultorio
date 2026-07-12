#!/usr/bin/env tsx
// ============================================================================
// Casos OSCE Dinâmicos — Beta · TESTE PULSE ADAPTER — ASMA GRAVE (Fase 6)
// ----------------------------------------------------------------------------
// Valida a pipeline completa:
//   fixture → normalizePulseOutputs → pulseVitalsToPatientState → PatientState
// usando três snapshots estáticos (baseline, após O₂, após broncodilatador).
//
// Critérios de aceitação (12):
//   1. PULSE_EXECUTION_ENABLED === false
//   2. caseId inválido retorna estado inalterado + warning
//   3. Baseline mapeia SpO₂=88, FC=122, FR=34
//   4. Baseline mapeia broncoespasmo=80 (100 - BronchodilationLevel 20)
//   5. Após O₂: SpO₂ > SpO₂ baseline
//   6. Após O₂: broncoespasmo levemente alterado (100 - 22 = 78)
//   7. Após broncodilatador: SpO₂ ≥ SpO₂ após O₂
//   8. Após broncodilatador: broncoespasmo < broncoespasmo baseline
//   9. Após broncodilatador: FR < FR baseline
//  10. Estado final tem clinical.ausculta preenchido (recomputarClinica rodou)
//  11. Estado final tem clinical.trabalhoRespiratorio preenchido
//  12. simulationProvider do caso piloto é medix-rule-based (provider inalterado)
// ============================================================================

import { PULSE_EXECUTION_ENABLED } from "../pulse/pulse-adapter.contract";
import { applyPulseExperimentalSnapshot } from "../pulse/pulse-experimental-adapter";
import {
  PULSE_FIXTURE_ASTHMA_BASELINE,
  PULSE_FIXTURE_ASTHMA_AFTER_OXYGEN,
  PULSE_FIXTURE_ASTHMA_AFTER_BRONCHODILATOR,
} from "../pulse/pulse-fixtures-asthma";
import { pilotoAsmaGraveAdulto } from "../cases/piloto-asma-grave-adulto";

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
  console.log(`\n── ${titulo} ${"─".repeat(Math.max(0, 60 - titulo.length))}`);
}

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

const CASE_ID = "dynamic-asthma-severe-adult-001";
const estadoInicial = pilotoAsmaGraveAdulto.fisiologia.estadoInicial;

console.log("=".repeat(70));
console.log("TESTE: Pulse Adapter Experimental — Asma Grave (Fase 6)");
console.log("=".repeat(70));

// ---------------------------------------------------------------------------
// Critério 1 — PULSE_EXECUTION_ENABLED === false
// ---------------------------------------------------------------------------
secao("Critério 1 — PULSE_EXECUTION_ENABLED");
ok(PULSE_EXECUTION_ENABLED === false, "PULSE_EXECUTION_ENABLED é false");

// ---------------------------------------------------------------------------
// Critério 2 — caseId inválido retorna estado inalterado + warning
// ---------------------------------------------------------------------------
secao("Critério 2 — caseId inválido");
const resultInvalido = applyPulseExperimentalSnapshot({
  caseId: "nao-existe-001",
  currentState: estadoInicial,
  rawSnapshot: PULSE_FIXTURE_ASTHMA_BASELINE,
});
ok(
  resultInvalido.patientState === estadoInicial,
  "Estado não alterado para caseId inválido"
);
ok(
  resultInvalido.warnings.some((w) => w.includes("nao-existe-001")),
  "Warning menciona o caseId inválido"
);

// ---------------------------------------------------------------------------
// Critérios 3 e 4 — Baseline
// ---------------------------------------------------------------------------
secao("Critérios 3–4 — Snapshot BASELINE");
const resultBaseline = applyPulseExperimentalSnapshot({
  caseId: CASE_ID,
  currentState: estadoInicial,
  rawSnapshot: PULSE_FIXTURE_ASTHMA_BASELINE,
});
const stateBaseline = resultBaseline.patientState;

console.log(`     SpO₂=${stateBaseline.vitals.spo2}%  FC=${stateBaseline.vitals.fc}  FR=${stateBaseline.vitals.fr}  bronco=${stateBaseline.broncoespasmo}`);

ok(stateBaseline.vitals.spo2 === 88,  "Baseline SpO₂ = 88%");
ok(stateBaseline.vitals.fc   === 122, "Baseline FC = 122 bpm");
ok(stateBaseline.vitals.fr   === 34,  "Baseline FR = 34 irpm");
ok(stateBaseline.broncoespasmo === 80, "Baseline broncoespasmo = 80 (100 − 20)");

// ---------------------------------------------------------------------------
// Critérios 5 e 6 — Após O₂
// ---------------------------------------------------------------------------
secao("Critérios 5–6 — Snapshot APÓS OXIGÊNIO");
const resultO2 = applyPulseExperimentalSnapshot({
  caseId: CASE_ID,
  currentState: stateBaseline,
  rawSnapshot: PULSE_FIXTURE_ASTHMA_AFTER_OXYGEN,
});
const stateO2 = resultO2.patientState;

console.log(`     SpO₂=${stateO2.vitals.spo2}%  FC=${stateO2.vitals.fc}  FR=${stateO2.vitals.fr}  bronco=${stateO2.broncoespasmo}`);

ok(
  stateO2.vitals.spo2 > stateBaseline.vitals.spo2,
  `SpO₂ sobe após O₂ (${stateBaseline.vitals.spo2}% → ${stateO2.vitals.spo2}%)`
);
ok(
  stateO2.broncoespasmo === 78,
  `Broncoespasmo = 78 após O₂ (100 − 22)`
);

// ---------------------------------------------------------------------------
// Critérios 7, 8 e 9 — Após broncodilatador
// ---------------------------------------------------------------------------
secao("Critérios 7–9 — Snapshot APÓS BRONCODILATADOR");
const resultBD = applyPulseExperimentalSnapshot({
  caseId: CASE_ID,
  currentState: stateO2,
  rawSnapshot: PULSE_FIXTURE_ASTHMA_AFTER_BRONCHODILATOR,
});
const stateBD = resultBD.patientState;

console.log(`     SpO₂=${stateBD.vitals.spo2}%  FC=${stateBD.vitals.fc}  FR=${stateBD.vitals.fr}  bronco=${stateBD.broncoespasmo}`);

ok(
  stateBD.vitals.spo2 >= stateO2.vitals.spo2,
  `SpO₂ mantém melhora após BD (${stateO2.vitals.spo2}% → ${stateBD.vitals.spo2}%)`
);
ok(
  stateBD.broncoespasmo < stateBaseline.broncoespasmo,
  `Broncoespasmo reduz após BD (${stateBaseline.broncoespasmo} → ${stateBD.broncoespasmo})`
);
ok(
  stateBD.vitals.fr < stateBaseline.vitals.fr,
  `FR reduz após BD (${stateBaseline.vitals.fr} → ${stateBD.vitals.fr} irpm)`
);

// ---------------------------------------------------------------------------
// Critérios 10 e 11 — recomputarClinica rodou
// ---------------------------------------------------------------------------
secao("Critérios 10–11 — Texto clínico recalculado");
ok(
  typeof stateBD.clinical.ausculta === "string" && stateBD.clinical.ausculta.length > 5,
  `clinical.ausculta preenchido: "${stateBD.clinical.ausculta.slice(0, 60)}..."`
);
ok(
  typeof stateBD.clinical.trabalhoRespiratorio === "string" && stateBD.clinical.trabalhoRespiratorio.length > 0,
  `clinical.trabalhoRespiratorio: "${stateBD.clinical.trabalhoRespiratorio}"`
);

// ---------------------------------------------------------------------------
// Critério 12 — provider do caso inalterado
// ---------------------------------------------------------------------------
secao("Critério 12 — simulationProvider inalterado");
ok(
  pilotoAsmaGraveAdulto.simulacao.simulationProvider === "medix-rule-based",
  "simulationProvider permanece medix-rule-based"
);

// ---------------------------------------------------------------------------
// Resumo
// ---------------------------------------------------------------------------

console.log("\n" + "=".repeat(70));
if (failedCount === 0) {
  console.log(`RESUMO: ✅ TODOS os ${passedCount} critérios passaram.`);
  console.log("Pulse adapter experimental validado para o caso de asma grave.");
  console.log("=".repeat(70));
  process.exit(0);
} else {
  console.error(
    `RESUMO: ❌ ${failedCount} falha(s) de ${passedCount + failedCount} critério(s).`
  );
  failures.forEach((f) => console.error(`  • ${f}`));
  console.log("=".repeat(70));
  process.exit(1);
}
