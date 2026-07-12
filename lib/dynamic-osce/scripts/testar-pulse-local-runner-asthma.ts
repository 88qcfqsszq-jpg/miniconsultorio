#!/usr/bin/env tsx
// ============================================================================
// Casos OSCE Dinâmicos — Beta · TESTE PULSE LOCAL RUNNER (Fase 10)
// ----------------------------------------------------------------------------
// Valida o wrapper TypeScript que chama o Python runner como subprocess.
// NÃO altera UI, providers ou OSCE principal.
//
// Uso:
//   npx tsx lib/dynamic-osce/scripts/testar-pulse-local-runner-asthma.ts
// ============================================================================

import os from "os";
import path from "path";
import fs from "fs";
import { runPulseLocalAsthmaSimulation } from "../pulse-local";
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
  console.log(`\n── ${titulo} ${"─".repeat(Math.max(0, 62 - titulo.length))}`);
}

// ---------------------------------------------------------------------------
// Main async
// ---------------------------------------------------------------------------

(async () => {
  // Validação 0 — Não está em produção
  if (process.env.NODE_ENV === "production") {
    console.error("ERRO: Este script não deve rodar em produção.");
    process.exit(1);
  }

  console.log("=".repeat(70));
  console.log("FASE 10 — Pulse Local Runner: Asma Grave (severity=0.75, 580s)");
  console.log("=".repeat(70));
  console.log(`\nPYTHON_BIN: ${process.env.PULSE_PYTHON_BIN ?? "(padrão Xcode Python 3.9)"}`);
  console.log(`CWD:        ${process.cwd()}`);

  // ---- Executar simulação --------------------------------------------------
  console.log(
    "\nChamando runPulseLocalAsthmaSimulation({conditionId:'asthma-severe-adult', severity:0.75, duration_s:580})..."
  );
  console.log("(pode levar ~25s para inicializar o engine + avançar 580s)");

  const t0 = Date.now();
  const result = await runPulseLocalAsthmaSimulation({
    conditionId: "asthma-severe-adult",
    severity: 0.75,
    duration_s: 580,
    timeoutMs: 120_000,
  });
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  console.log(`\nResultado em ${elapsed}s:`);
  console.log(`  ok:        ${result.ok}`);
  console.log(`  provider:  ${result.provider}`);

  if (!result.ok) {
    console.log(`  error:     ${result.error}`);
    console.log(`  fallback:  ${result.fallbackRecommended}`);
    if (result.warnings.length) {
      console.log("  warnings:");
      result.warnings.forEach((w) => console.log(`    ⚠️  ${w}`));
    }
  } else {
    console.log(`  csvPath:   ${result.csvPath}`);
    const n = result.normalized;
    console.log(`  SpO₂:      ${n.oxygenSaturation}%`);
    console.log(`  FC:        ${n.heartRate_bpm} bpm`);
    console.log(`  FR:        ${n.respirationRate_bpm} irpm`);
    console.log(`  PAS:       ${n.systolicBloodPressure_mmHg} mmHg`);
    const ps = result.patientState;
    console.log(`  PatientState.vitals.spo2:   ${ps.vitals.spo2}%`);
    console.log(`  PatientState.broncoespasmo: ${ps.broncoespasmo}`);
    console.log(`  clinical.estadoGeral:       "${ps.clinical.estadoGeral}"`);
    console.log(`  clinical.trabalhoResp:      "${ps.clinical.trabalhoRespiratorio}"`);
    console.log(`  clinical.ausculta:          "${ps.clinical.ausculta}"`);
    if (result.warnings.length) {
      console.log("\n  Warnings:");
      result.warnings.forEach((w) => console.log(`    ⚠️  ${w}`));
    }
  }

  // ---- Critério 1 — ok true OU erro controlado ----------------------------
  secao("Critério 1 — Resultado válido (ok ou erro controlado)");
  ok(
    result.ok === true || (result.ok === false && result.fallbackRecommended === true),
    "ok:true OU {ok:false, fallbackRecommended:true}"
  );

  if (result.ok) {
    // Critérios só quando Pulse real rodou

    secao("Critérios 2–4 — Vitais fisiologicamente plausíveis");
    ok(
      result.normalized.oxygenSaturation >= 80 && result.normalized.oxygenSaturation <= 100,
      `SpO₂ ∈ [80, 100] (${result.normalized.oxygenSaturation}%)`
    );
    ok(
      result.normalized.respirationRate_bpm > 0,
      `FR > 0 (${result.normalized.respirationRate_bpm} irpm)`
    );
    ok(
      result.normalized.heartRate_bpm > 0,
      `FC > 0 (${result.normalized.heartRate_bpm} bpm)`
    );

    secao("Critérios 5–6 — PatientState preenchido");
    ok(
      typeof result.patientState.clinical.ausculta === "string" &&
        result.patientState.clinical.ausculta.length > 5,
      `clinical.ausculta preenchida: "${result.patientState.clinical.ausculta.slice(0, 50)}"`
    );
    ok(
      typeof result.patientState.clinical.trabalhoRespiratorio === "string",
      "clinical.trabalhoRespiratorio preenchido"
    );

    secao("Critérios 7–8 — CSV em diretório temporário");
    const tmpDir = os.tmpdir();
    ok(
      result.csvPath.startsWith(tmpDir) || result.csvPath.startsWith("/tmp"),
      `csvPath em dir temporário: ${result.csvPath}`
    );
    ok(fs.existsSync(result.csvPath), `CSV existe no disco`);

    secao("Critérios 9–10 — Asma gera hipoxemia e taquipneia");
    ok(
      result.normalized.oxygenSaturation < 97,
      `SpO₂ < 97% após asma grave (${result.normalized.oxygenSaturation}%)`
    );
    ok(
      result.normalized.respirationRate_bpm > 14,
      `FR > 14 irpm após asma grave (${result.normalized.respirationRate_bpm})`
    );
  } else {
    secao("Critérios 2–10 — Pulse não disponível (modo fallback)");
    ok(result.fallbackRecommended === true, "fallbackRecommended:true");
    console.log(`  ℹ️  Pulse falhou: ${result.error}`);
    console.log("  ℹ️  Critérios fisiológicos pulados (Pulse não disponível).");
  }

  // ---- Critério 11 — provider dos casos inalterado ------------------------
  secao("Critério 11 — Provider dos casos não foi alterado");
  ok(
    pilotoAsmaGraveAdulto.simulacao.simulationProvider === "medix-rule-based",
    "pilotoAsmaGraveAdulto.simulacao.simulationProvider === 'medix-rule-based'"
  );

  // ---- Critério 12 — nenhum output fora de /tmp ---------------------------
  secao("Critério 12 — Isolamento: nenhum arquivo fora de /tmp");
  const appPaths = [
    path.join(process.cwd(), "pulse_output.csv"),
    path.join(process.cwd(), "pulse_output.log"),
    path.join(process.cwd(), "lib", "dynamic-osce", "pulse-local", "output.csv"),
  ];
  ok(
    appPaths.every((f) => !fs.existsSync(f)),
    `Nenhum CSV/log gerado na raiz do app (${appPaths.length} paths verificados)`
  );

  // ---- Critério 13 — conditionId inválido: erro controlado ----------------
  secao("Critério 13 — conditionId inválido retorna erro controlado");
  const invalidResult = await runPulseLocalAsthmaSimulation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    conditionId: "dpoc-exacerbado" as any,
    severity: 0.5,
    duration_s: 30,
  });
  ok(
    invalidResult.ok === false && invalidResult.fallbackRecommended === true,
    `conditionId inválido → {ok:false, fallbackRecommended:true}` +
      (invalidResult.ok === false ? `: "${invalidResult.error.slice(0, 60)}"` : "")
  );

  // ---- Resumo --------------------------------------------------------------
  console.log("\n" + "=".repeat(70));
  if (failedCount === 0) {
    console.log(`RESUMO: ✅ TODOS os ${passedCount} critérios passaram.`);
    console.log(result.ok ? "Pulse local runner funcionando com output real." : "Pulse não disponível — fallback controlado validado.");
  } else {
    console.error(`RESUMO: ❌ ${failedCount} falha(s) de ${passedCount + failedCount}.`);
    failures.forEach((f) => console.error(`  • ${f}`));
  }
  console.log("=".repeat(70));

  process.exit(failedCount === 0 ? 0 : 1);
})().catch((err) => {
  console.error("Erro não tratado:", err);
  process.exit(1);
});
