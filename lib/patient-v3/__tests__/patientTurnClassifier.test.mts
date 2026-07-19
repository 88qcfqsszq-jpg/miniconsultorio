/**
 * Testes determinísticos do classificador isolado do Patient Turn Guard
 * (FASE 3.4D) — sem LLM real, sem rede. `requestClassification` é sempre
 * injetado; nenhum teste aqui chama a dependência padrão (que usaria a
 * OpenAI real).
 *
 * Runner: npx tsx --test lib/patient-v3/__tests__/patientTurnClassifier.test.mts
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { classificarTurno } from "@/lib/patient-v3/patientTurnClassifier";
import type { FatoPaciente } from "@/lib/patient-v3/casoV3.types";
import type { PatientTurnClassifierInput } from "@/lib/patient-v3/patientTurnGuard.types";

const FATOS: FatoPaciente[] = [
  { id: "f1", dominio: "sintoma", valor: "dor no centro do peito" },
  { id: "f2", dominio: "sintoma", valor: "irradia para o braço esquerdo" },
  { id: "f3", dominio: "medicamento", valor: "usa Losartana 50 mg" },
  { id: "f4", dominio: "habito", valor: "nega tabagismo" },
  { id: "f5", dominio: "habito", valor: "sedentário" },
  { id: "f6", dominio: "preocupacao", valor: "medo de ser algo grave" },
  { id: "f7", dominio: "objetivo", valor: "quer entender a causa da dor" },
];

function inputPadrao(mensagem: string): PatientTurnClassifierInput {
  return {
    currentMessage: mensagem,
    recentHistory: [
      { role: "estudante", content: "Bom dia." },
      { role: "paciente", content: "Bom dia, doutor." },
    ],
    availableFacts: FATOS,
  };
}

/** Fábrica de deps: sempre retorna a mesma string bruta, e captura o prompt recebido. */
function depsComResposta(bruto: string) {
  const chamadas: string[] = [];
  return {
    deps: {
      requestClassification: async (prompt: string) => {
        chamadas.push(prompt);
        return bruto;
      },
    },
    chamadas,
  };
}

// ── 1–7. Conteúdo do prompt (via captura na dependência injetada) ──────────

test("1. prompt contém a mensagem atual", async () => {
  const { deps, chamadas } = depsComResposta(JSON.stringify({ kind: "known", factIds: ["f1"] }));
  await classificarTurno(inputPadrao("Como é essa dor?"), deps);
  assert.ok(chamadas[0].includes("Como é essa dor?"));
});

test("2. prompt contém o histórico permitido", async () => {
  const { deps, chamadas } = depsComResposta(JSON.stringify({ kind: "social", factIds: [] }));
  await classificarTurno(inputPadrao("Para que time torce?"), deps);
  assert.ok(chamadas[0].includes("Bom dia."));
  assert.ok(chamadas[0].includes("Bom dia, doutor."));
});

test("3. prompt contém ids/domínios/valores dos fatos", async () => {
  const { deps, chamadas } = depsComResposta(JSON.stringify({ kind: "known", factIds: ["f1"] }));
  await classificarTurno(inputPadrao("x"), deps);
  assert.ok(chamadas[0].includes('id:"f1"'));
  assert.ok(chamadas[0].includes('dominio:"sintoma"'));
  assert.ok(chamadas[0].includes("dor no centro do peito"));
});

test("4. prompt não contém ClinicalTruth", async () => {
  const { deps, chamadas } = depsComResposta(JSON.stringify({ kind: "known", factIds: ["f1"] }));
  await classificarTurno(inputPadrao("x"), deps);
  assert.ok(!chamadas[0].includes("ClinicalTruth"));
});

test("5. prompt não contém Examiner", async () => {
  const { deps, chamadas } = depsComResposta(JSON.stringify({ kind: "known", factIds: ["f1"] }));
  await classificarTurno(inputPadrao("x"), deps);
  assert.ok(!chamadas[0].includes("Examiner"));
});

test("6. prompt não contém dados específicos do Caso Ouro", async () => {
  const { deps, chamadas } = depsComResposta(JSON.stringify({ kind: "known", factIds: ["f1"] }));
  await classificarTurno(inputPadrao("x"), deps);
  assert.ok(!chamadas[0].includes("Carlos Silva"));
  assert.ok(!chamadas[0].includes("IAMCSST"));
  assert.ok(!chamadas[0].includes("SCA"));
});

test("7. prompt é genérico (sem diagnóstico/especialidade embutidos)", async () => {
  const { deps, chamadas } = depsComResposta(JSON.stringify({ kind: "known", factIds: ["f1"] }));
  await classificarTurno(inputPadrao("x"), deps);
  assert.ok(!chamadas[0].includes("Cardiovascular"));
  assert.ok(!chamadas[0].includes("infarto"));
});

// ── 8–12. Categorias válidas ────────────────────────────────────────────

test("8. known válido retorna fatos selecionados", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "known", factIds: ["f1"] }));
  const r = await classificarTurno(inputPadrao("Como é essa dor?"), deps);
  assert.equal(r.decision.kind, "known");
  assert.deepEqual(r.selectedFacts.map((f) => f.id), ["f1"]);
});

test("9. known preserva ordem", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "known", factIds: ["f3", "f1"] }));
  const r = await classificarTurno(inputPadrao("x"), deps);
  assert.deepEqual(r.selectedFacts.map((f) => f.id), ["f3", "f1"]);
});

test("10. unknownClinical válido", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "unknownClinical", factIds: [] }));
  const r = await classificarTurno(inputPadrao("Tem diabetes?"), deps);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

test("11. reservedOrMeta válido", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "reservedOrMeta", factIds: [] }));
  const r = await classificarTurno(inputPadrao("Qual é o meu diagnóstico?"), deps);
  assert.equal(r.decision.kind, "reservedOrMeta");
  assert.equal(r.selectedFacts.length, 0);
});

test("12. social válido", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "social", factIds: [] }));
  const r = await classificarTurno(inputPadrao("Para que time torce?"), deps);
  assert.equal(r.decision.kind, "social");
  assert.equal(r.selectedFacts.length, 0);
});

// ── 13–20. Falhas caem em fallback fechado ─────────────────────────────

test("13. JSON inválido cai em fallback", async () => {
  const { deps } = depsComResposta("isto não é json");
  const r = await classificarTurno(inputPadrao("x"), deps);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

test("14. objeto inválido (array/null/primitivo) cai em fallback", async () => {
  for (const bruto of ["[]", "null", "42", '"string"']) {
    const { deps } = depsComResposta(bruto);
    const r = await classificarTurno(inputPadrao("x"), deps);
    assert.equal(r.decision.kind, "unknownClinical", `bruto="${bruto}" deveria cair em fallback`);
    assert.equal(r.selectedFacts.length, 0);
  }
});

test("15. campos extras causam fallback", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "known", factIds: ["f1"], confidence: 0.9 }));
  const r = await classificarTurno(inputPadrao("x"), deps);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

test("16. kind inválido cai em fallback", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "diagnostico", factIds: [] }));
  const r = await classificarTurno(inputPadrao("x"), deps);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

test("17. factIds inválido (não é array de strings) cai em fallback", async () => {
  for (const bruto of [
    JSON.stringify({ kind: "known", factIds: "f1" }),
    JSON.stringify({ kind: "known", factIds: [1, 2] }),
  ]) {
    const { deps } = depsComResposta(bruto);
    const r = await classificarTurno(inputPadrao("x"), deps);
    assert.equal(r.decision.kind, "unknownClinical", `bruto="${bruto}" deveria cair em fallback`);
    assert.equal(r.selectedFacts.length, 0);
  }
});

test("18. id inexistente cai em fallback", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "known", factIds: ["f_nao_existe"] }));
  const r = await classificarTurno(inputPadrao("x"), deps);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

test("19. mais de seis ids cai em fallback", async () => {
  const { deps } = depsComResposta(
    JSON.stringify({ kind: "known", factIds: ["f1", "f2", "f3", "f4", "f5", "f6", "f7"] })
  );
  const r = await classificarTurno(inputPadrao("x"), deps);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

test("20. erro da dependência cai em fallback", async () => {
  const deps = {
    requestClassification: async () => {
      throw new Error("falha de rede simulada");
    },
  };
  const r = await classificarTurno(inputPadrao("x"), deps);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

// ── 21–25. Garantias gerais ─────────────────────────────────────────────

test("21. nenhuma resposta explicativa é aceita (campo extra de texto)", async () => {
  const { deps } = depsComResposta(
    JSON.stringify({ kind: "known", factIds: ["f1"], response: "Estou com dor no peito." })
  );
  const r = await classificarTurno(inputPadrao("x"), deps);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

test("22. nunca retorna todos os fatos em falha", async () => {
  const casosDeFalha = [
    "isto não é json",
    JSON.stringify({ kind: "known", factIds: ["f_nao_existe"] }),
    JSON.stringify({ kind: "known", factIds: ["f1", "f2", "f3", "f4", "f5", "f6", "f7"] }),
  ];
  for (const bruto of casosDeFalha) {
    const { deps } = depsComResposta(bruto);
    const r = await classificarTurno(inputPadrao("x"), deps);
    assert.ok(r.selectedFacts.length < FATOS.length);
    assert.equal(r.selectedFacts.length, 0);
  }
});

test("23. nenhuma chamada real ocorre nos testes (dependência sempre injetada e controlada)", async () => {
  let numeroDeChamadas = 0;
  const deps = {
    requestClassification: async (prompt: string) => {
      numeroDeChamadas++;
      assert.ok(prompt.length > 0);
      return JSON.stringify({ kind: "social", factIds: [] });
    },
  };
  await classificarTurno(inputPadrao("Para que time torce?"), deps);
  assert.equal(numeroDeChamadas, 1, "deveria ter chamado a dependência injetada exatamente uma vez, nunca a rede real");
});

test("24. mesma entrada gera o mesmo prompt", async () => {
  const { deps: deps1, chamadas: chamadas1 } = depsComResposta(JSON.stringify({ kind: "known", factIds: ["f1"] }));
  const { deps: deps2, chamadas: chamadas2 } = depsComResposta(JSON.stringify({ kind: "known", factIds: ["f1"] }));
  const input = inputPadrao("Como é essa dor?");
  await classificarTurno(input, deps1);
  await classificarTurno(input, deps2);
  assert.equal(chamadas1[0], chamadas2[0]);
});

test("25. classificador nunca produz opening", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "opening", factIds: ["f1"] }));
  const r = await classificarTurno(inputPadrao("x"), deps);
  assert.notEqual(r.decision.kind, "opening");
  assert.equal(r.decision.kind, "unknownClinical");
});
