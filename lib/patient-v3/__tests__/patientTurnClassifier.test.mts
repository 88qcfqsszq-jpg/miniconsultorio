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

import {
  classificarTurno,
  ehExplicitamenteSocial,
  construirSchemaClassificador,
} from "@/lib/patient-v3/patientTurnClassifier";
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

// ── FASE 4C.1 — "social" passa a ser categoria excepcional ─────────────────

test("26. peso retornado como social pelo modelo vira unknownClinical", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "social", factIds: [] }));
  const r = await classificarTurno(inputPadrao("Qual é seu peso?"), deps);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

test("27. alimentação retornada como social vira unknownClinical", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "social", factIds: [] }));
  const r = await classificarTurno(inputPadrao("Como é sua alimentação?"), deps);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

test("28. cirurgia retornada como social vira unknownClinical", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "social", factIds: [] }));
  const r = await classificarTurno(inputPadrao("Já fez alguma cirurgia?"), deps);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

test("29. diabetes retornado como social vira unknownClinical", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "social", factIds: [] }));
  const r = await classificarTurno(inputPadrao("Tem diabetes?"), deps);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

test("30. medicamento retornado como social vira unknownClinical", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "social", factIds: [] }));
  const r = await classificarTurno(inputPadrao("Toma algum outro remédio?"), deps);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

test("31. 'Vai para algum lugar?' retornada como social vira unknownClinical (nunca geração livre)", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "social", factIds: [] }));
  const r = await classificarTurno(inputPadrao("Vai para algum lugar?"), deps);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

test("32. 'Conte melhor...' retornada como social vira unknownClinical (nunca reservedOrMeta nem social)", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "social", factIds: [] }));
  const r = await classificarTurno(inputPadrao("Conte melhor o que está sentindo."), deps);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.notEqual(r.decision.kind, "reservedOrMeta");
  assert.notEqual(r.decision.kind, "social");
});

test("33. cumprimento social permanece social", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "social", factIds: [] }));
  const r = await classificarTurno(inputPadrao("Bom dia! Como o senhor está?"), deps);
  assert.equal(r.decision.kind, "social");
});

test("34. time de futebol permanece social", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "social", factIds: [] }));
  const r = await classificarTurno(inputPadrao("Para que time o senhor torce?"), deps);
  assert.equal(r.decision.kind, "social");
});

test("35. agradecimento permanece social", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "social", factIds: [] }));
  const r = await classificarTurno(inputPadrao("Muito obrigado, doutor."), deps);
  assert.equal(r.decision.kind, "social");
});

test("36. comentário cotidiano permanece social", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "social", factIds: [] }));
  const r = await classificarTurno(inputPadrao("Está calor hoje, não é?"), deps);
  assert.equal(r.decision.kind, "social");
});

test("37. zero fatos em todo fallback gerado pela regra de segurança", async () => {
  const perguntasClinicas = [
    "Qual é seu peso?",
    "Como é sua alimentação?",
    "Já fez cirurgia?",
    "Tem diabetes?",
    "Toma outro remédio?",
    "Vai para algum lugar?",
  ];
  for (const pergunta of perguntasClinicas) {
    const { deps } = depsComResposta(JSON.stringify({ kind: "social", factIds: [] }));
    const r = await classificarTurno(inputPadrao(pergunta), deps);
    assert.equal(r.selectedFacts.length, 0, `"${pergunta}" não deveria ter fatos`);
  }
});

// ── 38. ehExplicitamenteSocial (função pura, testada diretamente) ──────────
test("38. ehExplicitamenteSocial reconhece somente conversa claramente social", () => {
  assert.equal(ehExplicitamenteSocial("Bom dia."), true);
  assert.equal(ehExplicitamenteSocial("Para que time torce?"), true);
  assert.equal(ehExplicitamenteSocial("Muito obrigado, doutor."), true);
  assert.equal(ehExplicitamenteSocial("Está calor hoje, não é?"), true);

  assert.equal(ehExplicitamenteSocial("Qual é seu peso?"), false);
  assert.equal(ehExplicitamenteSocial("Como é sua alimentação?"), false);
  assert.equal(ehExplicitamenteSocial("Já fez cirurgia?"), false);
  assert.equal(ehExplicitamenteSocial("Tem diabetes?"), false);
  assert.equal(ehExplicitamenteSocial("Toma algum medicamento?"), false);
  assert.equal(ehExplicitamenteSocial("Vai para algum lugar?"), false);
  assert.equal(ehExplicitamenteSocial("Conte melhor o que está sentindo."), false);
});

// ── FASE 4C.3A — saída fechada do classificador (Structured Outputs) ──────

test("39. o schema contém exclusivamente os ids fornecidos", () => {
  const schema = construirSchemaClassificador(FATOS);
  const enumFactIds = schema.json_schema.schema.properties.factIds.items.enum;
  assert.deepEqual([...enumFactIds].sort(), FATOS.map((f) => f.id).sort());
});

test("40. id inventado não pode ser aceito (não está no enum do schema)", () => {
  const schema = construirSchemaClassificador(FATOS);
  const enumFactIds = schema.json_schema.schema.properties.factIds.items.enum;
  assert.ok(!enumFactIds.includes("f_dor_queixa_dor"));
  assert.ok(!enumFactIds.includes("id_qualquer_inventado"));
});

test("41. ids de outro caso não podem ser aceitos (não estão no enum deste turno)", () => {
  const fatoDeOutroCaso: FatoPaciente = { id: "f_de_outro_caso_totalmente_diferente", dominio: "sintoma", valor: "x" };
  const schema = construirSchemaClassificador(FATOS);
  const enumFactIds = schema.json_schema.schema.properties.factIds.items.enum;
  assert.ok(!enumFactIds.includes(fatoDeOutroCaso.id));
});

test("42. schema proíbe campos extras (additionalProperties: false)", () => {
  const schema = construirSchemaClassificador(FATOS);
  assert.equal(schema.json_schema.schema.additionalProperties, false);
});

test("43. schema limita factIds a no máximo 6 itens quando há fatos disponíveis", () => {
  const schema = construirSchemaClassificador(FATOS);
  assert.equal(schema.json_schema.schema.properties.factIds.maxItems, 6);
});

test("44. schema com zero fatos disponíveis fixa factIds a array vazio (maxItems 0)", () => {
  const schema = construirSchemaClassificador([]);
  assert.equal(schema.json_schema.schema.properties.factIds.maxItems, 0);
  assert.deepEqual(schema.json_schema.schema.properties.factIds.items.enum, []);
});

test("45. known válido continua funcionando (mesmo comportamento de sempre)", async () => {
  const saida = JSON.stringify({ kind: "known", factIds: ["f1", "f2"] });
  const { deps } = depsComResposta(saida);
  const r = await classificarTurno(inputPadrao("x"), deps);
  assert.equal(r.decision.kind, "known");
  assert.deepEqual(r.selectedFacts.map((f) => f.id), ["f1", "f2"]);
});

test("46. categorias fechadas continuam aceitando somente factIds vazio", async () => {
  for (const kind of ["unknownClinical", "reservedOrMeta", "social"] as const) {
    const { deps } = depsComResposta(JSON.stringify({ kind, factIds: [] }));
    const mensagem = kind === "social" ? "Bom dia." : "x";
    const r = await classificarTurno(inputPadrao(mensagem), deps);
    assert.equal(r.decision.kind, kind);
    assert.equal(r.selectedFacts.length, 0);
  }
});

test("47. fallback fechado continua intacto para id inexistente vindo da dependência", async () => {
  const { deps } = depsComResposta(JSON.stringify({ kind: "known", factIds: ["f_dor_queixa_dor"] }));
  const r = await classificarTurno(inputPadrao("x"), deps);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});
