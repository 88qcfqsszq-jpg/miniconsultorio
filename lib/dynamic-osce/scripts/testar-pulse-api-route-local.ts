#!/usr/bin/env tsx
// ============================================================================
// Casos OSCE Dinâmicos — Beta · TESTE API ROUTE PULSE (Fase 11)
// ----------------------------------------------------------------------------
// Testa o handler POST /api/pulse/simulate diretamente (sem servidor).
// Usa o Request/Response nativo do Node.js 18+ para simular chamadas HTTP.
//
// Uso:
//   npx tsx lib/dynamic-osce/scripts/testar-pulse-api-route-local.ts
// ============================================================================

import { pilotoAsmaGraveAdulto } from "../cases/piloto-asma-grave-adulto";

// Importar handlers da route diretamente
import { GET, POST } from "../../../app/api/pulse/simulate/route";

// ---------------------------------------------------------------------------
// Utilitários
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

async function postJson(body: unknown): Promise<{ status: number; data: unknown }> {
  const req = new Request("http://localhost/api/pulse/simulate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const res = await POST(req);
  const data = await res.json();
  return { status: res.status, data };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

(async () => {
  console.log("=".repeat(70));
  console.log("FASE 11 — Teste API Route POST /api/pulse/simulate");
  console.log("=".repeat(70));

  // ---- Critério 0 — GET health check -------------------------------------
  secao("Critério 0 — GET /api/pulse/simulate (health check)");
  const getReq = new Request("http://localhost/api/pulse/simulate");
  const getRes = await GET(getReq);
  const getData = (await getRes.json()) as Record<string, unknown>;
  ok(getRes.status === 200, `GET retorna 200 (${getRes.status})`);
  ok(getData.ok === true, `GET retorna ok:true`);
  ok(getData.status === "pulse-local-route-ready", `GET retorna status 'pulse-local-route-ready'`);

  // ---- Critério 1 — payload inválido: conditionId errado -----------------
  secao("Critério 1 — conditionId inválido retorna erro controlado");
  const { status: s1, data: d1 } = await postJson({
    conditionId: "pneumonia-severe-adult",
    severity: 0.75,
    duration_s: 580,
  });
  const r1 = d1 as Record<string, unknown>;
  ok(s1 === 400, `HTTP 400 para conditionId inválido (${s1})`);
  ok(r1.ok === false, "ok:false");
  ok(r1.fallbackRecommended === true, "fallbackRecommended:true");
  ok(typeof r1.error === "string" && (r1.error as string).length > 0, `error preenchido: "${String(r1.error).slice(0, 60)}"`);

  // ---- Critério 2 — payload inválido: body mal-formado -------------------
  secao("Critério 2 — body JSON inválido");
  const badReq = new Request("http://localhost/api/pulse/simulate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{ invalid json {{",
  });
  const badRes = await POST(badReq);
  const badData = (await badRes.json()) as Record<string, unknown>;
  ok(badRes.status === 400, `HTTP 400 para body inválido (${badRes.status})`);
  ok(badData.ok === false, "ok:false para body inválido");

  // ---- Critério 3 — payload válido: asthma-severe-adult ------------------
  secao("Critério 3 — payload válido asthma-severe-adult (pode levar ~25s)");
  console.log("  Chamando POST com conditionId:'asthma-severe-adult', severity:0.75, duration_s:580...");
  const t0 = Date.now();
  const { status: s3, data: d3 } = await postJson({
    conditionId: "asthma-severe-adult",
    severity: 0.75,
    duration_s: 580,
  });
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  const r3 = d3 as Record<string, unknown>;

  console.log(`  Respondeu em ${elapsed}s — status HTTP: ${s3}`);
  console.log(`  ok: ${r3.ok}  provider: ${r3.provider}`);
  if (!r3.ok) {
    console.log(`  error: ${r3.error}`);
    console.log(`  fallbackRecommended: ${r3.fallbackRecommended}`);
  }

  // Aceita ok:true OU fallback controlado
  ok(
    r3.ok === true || (r3.ok === false && r3.fallbackRecommended === true),
    "ok:true OU {ok:false, fallbackRecommended:true}"
  );
  ok(r3.provider === "pulse-local", `provider === 'pulse-local' (${r3.provider})`);

  if (r3.ok === true) {
    // ---- Critério 4 — patientState existe ---------------------------------
    secao("Critérios 4–7 — patientState e vitais (Pulse real rodou)");
    const ps = r3.patientState as Record<string, unknown> | undefined;
    ok(ps !== undefined && typeof ps === "object", "patientState existe na resposta");

    const vitals = ps?.vitals as Record<string, unknown> | undefined;
    const spo2 = vitals?.spo2 as number | undefined;
    ok(
      typeof spo2 === "number" && spo2 >= 80 && spo2 <= 100,
      `vitals.spo2 ∈ [80,100] (${spo2}%)`
    );

    const clinical = ps?.clinical as Record<string, unknown> | undefined;
    ok(
      typeof clinical?.ausculta === "string" && (clinical.ausculta as string).length > 5,
      `ausculta preenchida: "${String(clinical?.ausculta ?? "").slice(0, 50)}"`
    );

    // csvPath não deve vazar no response
    ok(
      !("csvPath" in r3),
      "csvPath local NÃO incluído na resposta HTTP (privacidade)"
    );

    const norm = r3.normalized as Record<string, unknown> | undefined;
    console.log(`\n  Vitais normalizados:`);
    console.log(`    SpO₂: ${norm?.oxygenSaturation}%`);
    console.log(`    FC:   ${norm?.heartRate_bpm} bpm`);
    console.log(`    FR:   ${norm?.respirationRate_bpm} irpm`);
    console.log(`    PAS:  ${norm?.systolicBloodPressure_mmHg} mmHg`);
  } else {
    secao("Critérios 4–7 — Pulse não disponível (fallback)");
    ok(r3.fallbackRecommended === true, "fallbackRecommended:true quando Pulse falha");
    console.log("  ℹ️  Critérios de vitais pulados (Pulse não disponível neste ambiente).");
  }

  // ---- Critério 8 — provider dos casos inalterado ------------------------
  secao("Critério 8 — Provider dos casos não foi alterado");
  ok(
    pilotoAsmaGraveAdulto.simulacao.simulationProvider === "medix-rule-based",
    "pilotoAsmaGraveAdulto.simulacao.simulationProvider === 'medix-rule-based'"
  );

  // ---- Resumo -------------------------------------------------------------
  console.log("\n" + "=".repeat(70));
  if (failedCount === 0) {
    console.log(`RESUMO: ✅ TODOS os ${passedCount} critérios passaram.`);
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
