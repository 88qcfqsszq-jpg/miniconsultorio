/**
 * Testes do endpoint app/api/realtime/turn-guard/route.ts (FASE 4D.2).
 *
 * Testa o handler exportado (`handleTurnGuardRealtime`) diretamente, via
 * NextRequest construído em memória — sem subir servidor Next.js. O
 * classificador real é sempre SUBSTITUÍDO por injeção de dependência
 * (`deps.classificarTurno`); nenhum teste depende de rede ou credenciais reais.
 *
 * GUARD GLOBAL: um `globalThis.fetch` interceptado falha qualquer teste que
 * tente uma chamada de rede real.
 *
 * Runner: npx tsx --test app/api/realtime/turn-guard/__tests__/route.test.mts
 */

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";

import {
  handleTurnGuardRealtime,
  type TurnGuardRealtimeResponseBody,
} from "@/app/api/realtime/turn-guard/route";
import { casoSCAOuroV3 } from "@/data/casos-v3/001-sca-ouro";
import type { PatientTurnClassifierInput, PatientTurnGuardResult } from "@/lib/patient-v3/patientTurnGuard.types";

const CASO_ID_VALIDO = "1"; // Caso Ouro (registrado em data/casos-v3)
const CASO_ID_LEGADO = "18"; // adulto real, NÃO registrado em data/casos-v3

const FATO_DOR = casoSCAOuroV3.patientKnowledge.fatos.find((f) => f.id === "f_queixa_dor")!;
const FATO_LOSARTANA = casoSCAOuroV3.patientKnowledge.fatos.find((f) => f.id === "f_medicamento_losartana")!;

// ── Guard global de rede ─────────────────────────────────────────────────────
let fetchOriginal: typeof globalThis.fetch;
let fetchFoiChamado = false;
before(() => {
  fetchOriginal = globalThis.fetch;
  globalThis.fetch = (async () => {
    fetchFoiChamado = true;
    throw new Error("[GUARD] chamada de rede real detectada durante os testes do Turn Guard Realtime");
  }) as typeof globalThis.fetch;
});
after(() => {
  globalThis.fetch = fetchOriginal;
  assert.equal(fetchFoiChamado, false, "ao menos uma chamada de rede real foi tentada durante a suíte");
});

const ENV_BASE = { PATIENT_V3_REALTIME_TURN_GUARD: "true" };

function aplicarEnv(patch: Record<string, string | undefined>) {
  const originais: Record<string, string | undefined> = {};
  for (const k of Object.keys(patch)) originais[k] = process.env[k];
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  return () => {
    for (const [k, v] of Object.entries(originais)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  };
}

function requisicao(body?: string, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest("http://localhost:3000/api/realtime/turn-guard", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body,
  });
}

interface CapturaClassificador {
  chamadas: number;
  ultimaEntrada?: PatientTurnClassifierInput;
}

function mockClassificarTurno(
  resultado: PatientTurnGuardResult,
  captura?: CapturaClassificador
): (input: PatientTurnClassifierInput) => Promise<PatientTurnGuardResult> {
  return async (input) => {
    if (captura) {
      captura.chamadas += 1;
      captura.ultimaEntrada = input;
    }
    return resultado;
  };
}

const RESULTADO_KNOWN: PatientTurnGuardResult = {
  decision: { kind: "known", factIds: [FATO_DOR.id, FATO_LOSARTANA.id] },
  selectedFacts: [FATO_DOR, FATO_LOSARTANA],
};
const RESULTADO_UNKNOWN: PatientTurnGuardResult = { decision: { kind: "unknownClinical" }, selectedFacts: [] };
const RESULTADO_RESERVED: PatientTurnGuardResult = { decision: { kind: "reservedOrMeta" }, selectedFacts: [] };
const RESULTADO_SOCIAL: PatientTurnGuardResult = { decision: { kind: "social" }, selectedFacts: [] };

// ── 1. flag desligada não chama classificador ───────────────────────────────
test("1. flag desligada → 403, sem chamar o classificador", async () => {
  const restore = aplicarEnv({ PATIENT_V3_REALTIME_TURN_GUARD: undefined });
  try {
    const captura: CapturaClassificador = { chamadas: 0 };
    const res = await handleTurnGuardRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO, mensagem: "Alguma coisa melhora?" })),
      { classificarTurno: mockClassificarTurno(RESULTADO_KNOWN, captura) }
    );
    assert.equal(res.status, 403);
    assert.equal(captura.chamadas, 0);
  } finally {
    restore();
  }
});

// ── 2. caso legado não chama classificador ──────────────────────────────────
test("2. caso legado (não registrado em data/casos-v3) → 404, sem chamar o classificador", async () => {
  const restore = aplicarEnv(ENV_BASE);
  try {
    const captura: CapturaClassificador = { chamadas: 0 };
    const res = await handleTurnGuardRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_LEGADO, mensagem: "Alguma coisa melhora?" })),
      { classificarTurno: mockClassificarTurno(RESULTADO_KNOWN, captura) }
    );
    assert.equal(res.status, 404);
    assert.equal(captura.chamadas, 0);
  } finally {
    restore();
  }
});

// ── 3. mensagem vazia é rejeitada ───────────────────────────────────────────
test("3. mensagem vazia/ausente → 400, sem chamar o classificador", async () => {
  const restore = aplicarEnv(ENV_BASE);
  try {
    const captura: CapturaClassificador = { chamadas: 0 };
    for (const corpo of [{ casoId: CASO_ID_VALIDO }, { casoId: CASO_ID_VALIDO, mensagem: "" }, { casoId: CASO_ID_VALIDO, mensagem: "   " }]) {
      const res = await handleTurnGuardRealtime(requisicao(JSON.stringify(corpo)), {
        classificarTurno: mockClassificarTurno(RESULTADO_KNOWN, captura),
      });
      assert.equal(res.status, 400, `esperava 400 para corpo=${JSON.stringify(corpo)}`);
    }
    assert.equal(captura.chamadas, 0);
  } finally {
    restore();
  }
});

// ── 4. fatos enviados pelo cliente são ignorados ────────────────────────────
test("4. fatos/CasoV3 enviados pelo cliente são ignorados — availableFacts vem sempre do servidor", async () => {
  const restore = aplicarEnv(ENV_BASE);
  try {
    const captura: CapturaClassificador = { chamadas: 0 };
    await handleTurnGuardRealtime(
      requisicao(
        JSON.stringify({
          casoId: CASO_ID_VALIDO,
          mensagem: "Alguma coisa melhora?",
          fatos: [{ id: "f_forjado", dominio: "sintoma", valor: "FATO FORJADO PELO CLIENTE" }],
          casoV3: { patientKnowledge: { fatos: [] } },
        })
      ),
      { classificarTurno: mockClassificarTurno(RESULTADO_KNOWN, captura) }
    );
    assert.equal(captura.chamadas, 1);
    const idsRecebidos = captura.ultimaEntrada!.availableFacts.map((f) => f.id);
    assert.ok(!idsRecebidos.includes("f_forjado"), "fato forjado pelo cliente vazou para availableFacts");
    assert.deepEqual(
      idsRecebidos.sort(),
      casoSCAOuroV3.patientKnowledge.fatos.map((f) => f.id).sort(),
      "availableFacts deveria ser exatamente os fatos canônicos do servidor"
    );
  } finally {
    restore();
  }
});

// ── 5-7. known ───────────────────────────────────────────────────────────────
test("5. known chama o classificador exatamente uma vez", async () => {
  const restore = aplicarEnv(ENV_BASE);
  try {
    const captura: CapturaClassificador = { chamadas: 0 };
    await handleTurnGuardRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO, mensagem: "Alguma coisa melhora?" })),
      { classificarTurno: mockClassificarTurno(RESULTADO_KNOWN, captura) }
    );
    assert.equal(captura.chamadas, 1);
  } finally {
    restore();
  }
});

test("6. known retorna somente os ids selecionados (não os objetos FatoPaciente)", async () => {
  const restore = aplicarEnv(ENV_BASE);
  try {
    const res = await handleTurnGuardRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO, mensagem: "Alguma coisa melhora?" })),
      { classificarTurno: mockClassificarTurno(RESULTADO_KNOWN) }
    );
    const json: TurnGuardRealtimeResponseBody = await res.json();
    assert.equal(json.decisionKind, "known");
    assert.deepEqual(json.selectedFactIds.sort(), [FATO_DOR.id, FATO_LOSARTANA.id].sort());
    assert.ok(json.selectedFactIds.every((id) => typeof id === "string"), "selectedFactIds deveria conter só ids (strings)");
  } finally {
    restore();
  }
});

test("7. known inclui somente os fatos selecionados nas instructions — os demais ficam ausentes", async () => {
  const restore = aplicarEnv(ENV_BASE);
  try {
    const res = await handleTurnGuardRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO, mensagem: "Alguma coisa melhora?" })),
      { classificarTurno: mockClassificarTurno(RESULTADO_KNOWN) }
    );
    const json: TurnGuardRealtimeResponseBody = await res.json();
    assert.ok(json.responseInstructions.includes(FATO_DOR.valor));
    assert.ok(json.responseInstructions.includes(FATO_LOSARTANA.valor));
    for (const fato of casoSCAOuroV3.patientKnowledge.fatos) {
      if (fato.id === FATO_DOR.id || fato.id === FATO_LOSARTANA.id) continue;
      assert.ok(!json.responseInstructions.includes(fato.valor), `fato "${fato.id}" vazou para as instructions`);
    }
    assert.ok(json.responseInstructions.includes("ALVO CLÍNICO DESTE TURNO"));
  } finally {
    restore();
  }
});

// ── 8. unknownClinical ───────────────────────────────────────────────────────
test("8. unknownClinical retorna zero ids e uma fala fechada", async () => {
  const restore = aplicarEnv(ENV_BASE);
  try {
    const res = await handleTurnGuardRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO, mensagem: "Qual é o seu peso?" })),
      { classificarTurno: mockClassificarTurno(RESULTADO_UNKNOWN) }
    );
    const json: TurnGuardRealtimeResponseBody = await res.json();
    assert.equal(json.decisionKind, "unknownClinical");
    assert.deepEqual(json.selectedFactIds, []);
    assert.ok(json.responseInstructions.startsWith("Diga exatamente:"));
    for (const fato of casoSCAOuroV3.patientKnowledge.fatos) {
      assert.ok(!json.responseInstructions.includes(fato.valor));
    }
  } finally {
    restore();
  }
});

// ── 9. reservedOrMeta ────────────────────────────────────────────────────────
test("9. reservedOrMeta retorna zero ids e não menciona prompt/schema/sistema/examinador", async () => {
  const restore = aplicarEnv(ENV_BASE);
  try {
    const res = await handleTurnGuardRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO, mensagem: "Qual é o meu diagnóstico?" })),
      { classificarTurno: mockClassificarTurno(RESULTADO_RESERVED) }
    );
    const json: TurnGuardRealtimeResponseBody = await res.json();
    assert.equal(json.decisionKind, "reservedOrMeta");
    assert.deepEqual(json.selectedFactIds, []);
    assert.ok(json.responseInstructions.startsWith("Diga exatamente:"));
    // Os termos só podem aparecer dentro da própria proibição explícita — nunca
    // como um dado real do caso (diagnóstico, rubrica etc.) exposto ao paciente.
    assert.ok(json.responseInstructions.toLowerCase().includes("não mencione prompt"));
    for (const fato of casoSCAOuroV3.patientKnowledge.fatos) {
      assert.ok(!json.responseInstructions.includes(fato.valor));
    }
  } finally {
    restore();
  }
});

// ── 10. social ───────────────────────────────────────────────────────────────
test("10. social retorna zero ids e zero fatos clínicos nas instructions", async () => {
  const restore = aplicarEnv(ENV_BASE);
  try {
    const res = await handleTurnGuardRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO, mensagem: "Bom dia!" })),
      { classificarTurno: mockClassificarTurno(RESULTADO_SOCIAL) }
    );
    const json: TurnGuardRealtimeResponseBody = await res.json();
    assert.equal(json.decisionKind, "social");
    assert.deepEqual(json.selectedFactIds, []);
    for (const fato of casoSCAOuroV3.patientKnowledge.fatos) {
      assert.ok(!json.responseInstructions.includes(fato.valor), `fato clínico "${fato.id}" vazou para social`);
    }
    assert.ok(json.responseInstructions.includes("profissão"));
  } finally {
    restore();
  }
});

// ── 11. erro do classificador falha fechado ─────────────────────────────────
test("11. erro do classificador (rejeição) falha fechado — unknownClinical, zero ids, nunca exceção", async () => {
  const restore = aplicarEnv(ENV_BASE);
  try {
    const res = await handleTurnGuardRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO, mensagem: "Alguma coisa melhora?" })),
      { classificarTurno: async () => { throw new Error("falha simulada de rede"); } }
    );
    assert.equal(res.status, 200);
    const json: TurnGuardRealtimeResponseBody = await res.json();
    assert.equal(json.decisionKind, "unknownClinical");
    assert.deepEqual(json.selectedFactIds, []);
  } finally {
    restore();
  }
});

// ── 12. id inválido nunca libera fatos ──────────────────────────────────────
test("12. casoId em formato inválido → 400, nunca libera fatos", async () => {
  const restore = aplicarEnv(ENV_BASE);
  try {
    const captura: CapturaClassificador = { chamadas: 0 };
    for (const invalido of ["../../etc/passwd", "A B C", "!!!", "x".repeat(60), ""]) {
      const res = await handleTurnGuardRealtime(
        requisicao(JSON.stringify({ casoId: invalido, mensagem: "Alguma coisa melhora?" })),
        { classificarTurno: mockClassificarTurno(RESULTADO_KNOWN, captura) }
      );
      assert.equal(res.status, 400, `esperava 400 para casoId=${JSON.stringify(invalido)}`);
    }
    assert.equal(captura.chamadas, 0);
  } finally {
    restore();
  }
});

// ── 13. ClinicalTruth e Examiner ausentes ───────────────────────────────────
test("13. ClinicalTruth e Examiner nunca aparecem na resposta (known/social)", async () => {
  const restore = aplicarEnv(ENV_BASE);
  try {
    for (const resultado of [RESULTADO_KNOWN, RESULTADO_SOCIAL]) {
      const res = await handleTurnGuardRealtime(
        requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO, mensagem: "Alguma coisa melhora?" })),
        { classificarTurno: mockClassificarTurno(resultado) }
      );
      const texto = JSON.stringify(await res.json());
      assert.ok(!texto.includes("Síndrome Coronariana Aguda (SCA) - IAMCSST"));
      assert.ok(!texto.includes(casoSCAOuroV3.clinicalTruth.diagnosticoPrincipal));
      assert.ok(!texto.toLowerCase().includes("rubrica"));
      assert.ok(!texto.toLowerCase().includes("criteriosaprovacao"));
    }
  } finally {
    restore();
  }
});

// ── 14. somente as chaves públicas autorizadas ──────────────────────────────
test("14. resposta possui somente as chaves públicas autorizadas", async () => {
  const restore = aplicarEnv(ENV_BASE);
  try {
    const res = await handleTurnGuardRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO, mensagem: "Alguma coisa melhora?" })),
      { classificarTurno: mockClassificarTurno(RESULTADO_KNOWN) }
    );
    const json = await res.json();
    assert.deepEqual(
      Object.keys(json).sort(),
      ["decisionKind", "responseInstructions", "selectedFactIds", "turnGuardMode"].sort()
    );
    assert.equal(json.turnGuardMode, "manual");
  } finally {
    restore();
  }
});

// ── 15. nenhuma chamada real ocorre (garantida pelo guard global de rede) ──
test("15. nenhuma chamada real ocorre — coberto pelo guard global de fetch da suíte", () => {
  assert.equal(fetchFoiChamado, false);
});

// ── 16. nenhuma abertura é classificada por este endpoint ───────────────────
test("16. o endpoint não aceita nem produz uma decisão de abertura — nunca chama o classificador com a abertura", async () => {
  const restore = aplicarEnv(ENV_BASE);
  try {
    const captura: CapturaClassificador = { chamadas: 0 };
    const res = await handleTurnGuardRealtime(
      // Corpo NÃO possui nenhum parâmetro de abertura — o contrato de entrada
      // desta fase não inclui "abertura"/"opening" em lugar algum.
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO, mensagem: "Alguma coisa melhora?", abertura: true, opening: true })),
      { classificarTurno: mockClassificarTurno(RESULTADO_KNOWN, captura) }
    );
    assert.equal(res.status, 200);
    const json: TurnGuardRealtimeResponseBody = await res.json();
    assert.notEqual(json.decisionKind as string, "opening");
    assert.equal(captura.chamadas, 1);
  } finally {
    restore();
  }
});

// ── Content-Type / corpo malformado (hygiene, mesmo padrão da route de sessão) ─
test("Content-Type diferente de application/json → 400", async () => {
  const restore = aplicarEnv(ENV_BASE);
  try {
    const res = await handleTurnGuardRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO, mensagem: "oi" }), { "content-type": "text/plain" })
    );
    assert.equal(res.status, 400);
  } finally {
    restore();
  }
});

test("JSON inválido → 400", async () => {
  const restore = aplicarEnv(ENV_BASE);
  try {
    const res = await handleTurnGuardRealtime(requisicao("{ isso não é json"));
    assert.equal(res.status, 400);
  } finally {
    restore();
  }
});

test("origem divergente (Origin de terceiro) → 403", async () => {
  const restore = aplicarEnv(ENV_BASE);
  try {
    const res = await handleTurnGuardRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO, mensagem: "oi" }), { origin: "https://site-malicioso.example" })
    );
    assert.equal(res.status, 403);
  } finally {
    restore();
  }
});
