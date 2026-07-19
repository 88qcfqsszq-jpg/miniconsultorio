/**
 * Testes determinísticos da integração do Patient Turn Guard no chat de texto
 * (FASE 4B) — sem LLM real, sem rede. `classificarTurno` é sempre injetado.
 *
 * Runner: npx tsx --test lib/patient-v3/__tests__/patientTurnText.test.mts
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { prepararTurnoPacienteTexto } from "@/lib/patient-v3/patientTurnText";
import { construirInstrucoesBasePaciente } from "@/lib/prompts";
import { casosV2 } from "@/data/casos-v2";
import { casoSCAOuroV3 } from "@/data/casos-v3/001-sca-ouro";
import type { Caso } from "@/lib/types";
import type { FatoPaciente } from "@/lib/patient-v3/casoV3.types";
import type { PatientTurnGuardResult } from "@/lib/patient-v3/patientTurnGuard.types";

const caso18Legado = casosV2.find((c) => c.id === "18") as Caso;
const casoOuroLegado = casosV2.find((c) => c.id === "1") as Caso;

const FRASES_UNKNOWN_CLINICAL = [
  "Não sei dizer isso com certeza.",
  "Não me lembro desse detalhe agora.",
  "Não consigo informar isso direito.",
];
const FRASES_RESERVED_OR_META = [
  "Isso eu não saberia dizer, isso é com o médico.",
  "Não sei explicar isso, só sei como estou me sentindo.",
  "Não tenho como informar isso.",
];

function fato(id: string): FatoPaciente {
  const f = casoSCAOuroV3.patientKnowledge.fatos.find((x) => x.id === id);
  assert.ok(f, `fato "${id}" deveria existir no Caso Ouro`);
  return f as FatoPaciente;
}

function depsClassificando(resultado: PatientTurnGuardResult) {
  let numeroDeChamadas = 0;
  return {
    deps: {
      classificarTurno: async () => {
        numeroDeChamadas++;
        return resultado;
      },
    },
    getNumeroDeChamadas: () => numeroDeChamadas,
  };
}

// ── 1–3. Caso 18 (legado) permanece 100% intocado ───────────────────────────

test("1. Caso 18 não chama o classificador", async () => {
  const { deps, getNumeroDeChamadas } = depsClassificando({ decision: { kind: "social" }, selectedFacts: [] });
  const historico = [{ tipo: "estudante" as const, conteudo: "O que trouxe o senhor aqui?" }];
  await prepararTurnoPacienteTexto({ caso: caso18Legado, mensagemAtual: "Há quanto tempo?", historico }, deps);
  assert.equal(getNumeroDeChamadas(), 0);
});

test("2. Caso 18 mantém tamanho 10271 na base legada", () => {
  const texto = construirInstrucoesBasePaciente(caso18Legado);
  assert.equal(texto.length, 10271);
});

test("3. Caso 18 mantém o SHA-256 capturado antes da integração", () => {
  const texto = construirInstrucoesBasePaciente(caso18Legado);
  const hash = createHash("sha256").update(texto, "utf8").digest("hex");
  assert.equal(hash, "d222aacacab2ddc70881e6b0afa9e3d79da69621f5fb9701df0aee0642638a8d");
});

test("Caso 18: prepararTurnoPacienteTexto gera exatamente o prompt legado (kind generate, sem decision)", async () => {
  const { deps } = depsClassificando({ decision: { kind: "social" }, selectedFacts: [] });
  const r = await prepararTurnoPacienteTexto({ caso: caso18Legado, mensagemAtual: "x", historico: [] }, deps);
  assert.equal(r.kind, "generate");
  assert.ok(!("decision" in r) || r.decision === undefined);
  if (r.kind === "generate") {
    assert.ok(r.prompt.startsWith(construirInstrucoesBasePaciente(caso18Legado)));
  }
});

// ── 4–6. Abertura do Caso Ouro (primeiro turno) ────────────────────────────

test("4. abertura não chama o classificador", async () => {
  const { deps, getNumeroDeChamadas } = depsClassificando({ decision: { kind: "social" }, selectedFacts: [] });
  await prepararTurnoPacienteTexto(
    { caso: casoOuroLegado, mensagemAtual: "O que trouxe o senhor aqui?", historico: [] },
    deps
  );
  assert.equal(getNumeroDeChamadas(), 0);
});

test("5. abertura recebe somente f_queixa_dor", async () => {
  const { deps } = depsClassificando({ decision: { kind: "social" }, selectedFacts: [] });
  const r = await prepararTurnoPacienteTexto(
    { caso: casoOuroLegado, mensagemAtual: "O que trouxe o senhor aqui?", historico: [] },
    deps
  );
  assert.equal(r.kind, "generate");
  assert.equal(r.decision?.kind, "opening");
  if (r.kind === "generate") {
    assert.ok(r.prompt.includes(fato("f_queixa_dor").valor));
  }
});

test("6. os outros 24 fatos não aparecem no prompt da abertura", async () => {
  const { deps } = depsClassificando({ decision: { kind: "social" }, selectedFacts: [] });
  const r = await prepararTurnoPacienteTexto(
    { caso: casoOuroLegado, mensagemAtual: "O que trouxe o senhor aqui?", historico: [] },
    deps
  );
  assert.equal(r.kind, "generate");
  if (r.kind === "generate") {
    for (const f of casoSCAOuroV3.patientKnowledge.fatos) {
      if (f.id === "f_queixa_dor") continue;
      assert.ok(!r.prompt.includes(f.valor), `fato "${f.id}" não deveria aparecer na abertura`);
    }
  }
});

// ── 7–9. known recebe somente os fatos selecionados ────────────────────────

test("7. known recebe somente os ids selecionados", async () => {
  const { deps } = depsClassificando({
    decision: { kind: "known", factIds: ["f_dor_caracter"] },
    selectedFacts: [fato("f_dor_caracter")],
  });
  const historico = [{ tipo: "estudante" as const, conteudo: "Bom dia." }];
  const r = await prepararTurnoPacienteTexto(
    { caso: casoOuroLegado, mensagemAtual: "Como é essa dor?", historico },
    deps
  );
  assert.equal(r.kind, "generate");
  assert.equal(r.decision?.kind, "known");
  if (r.kind === "generate") {
    assert.ok(r.prompt.includes(fato("f_dor_caracter").valor));
  }
});

test("8. fato não selecionado não aparece", async () => {
  const { deps } = depsClassificando({
    decision: { kind: "known", factIds: ["f_dor_caracter"] },
    selectedFacts: [fato("f_dor_caracter")],
  });
  const historico = [{ tipo: "estudante" as const, conteudo: "Bom dia." }];
  const r = await prepararTurnoPacienteTexto(
    { caso: casoOuroLegado, mensagemAtual: "Como é essa dor?", historico },
    deps
  );
  assert.equal(r.kind, "generate");
  if (r.kind === "generate") {
    assert.ok(!r.prompt.includes(fato("f_habito_tabagismo").valor));
  }
});

test("9. preocupação não recebe história familiar se ela não foi selecionada", async () => {
  const { deps } = depsClassificando({
    decision: { kind: "known", factIds: ["f_preocupacao_quadro"] },
    selectedFacts: [fato("f_preocupacao_quadro")],
  });
  const historico = [{ tipo: "estudante" as const, conteudo: "Bom dia." }];
  const r = await prepararTurnoPacienteTexto(
    { caso: casoOuroLegado, mensagemAtual: "O que mais preocupa o senhor?", historico },
    deps
  );
  assert.equal(r.kind, "generate");
  if (r.kind === "generate") {
    assert.ok(r.prompt.includes(fato("f_preocupacao_quadro").valor));
    assert.ok(!r.prompt.includes(fato("f_historia_familiar_infarto").valor));
  }
});

// ── 10–13. Respostas diretas (unknownClinical / reservedOrMeta) ────────────

test("10. unknownClinical retorna resposta direta", async () => {
  const { deps } = depsClassificando({ decision: { kind: "unknownClinical" }, selectedFacts: [] });
  const historico = [{ tipo: "estudante" as const, conteudo: "Bom dia." }];
  const r = await prepararTurnoPacienteTexto(
    { caso: casoOuroLegado, mensagemAtual: "Tem diabetes?", historico },
    deps
  );
  assert.equal(r.kind, "direct");
  if (r.kind === "direct") {
    assert.ok(FRASES_UNKNOWN_CLINICAL.includes(r.response));
  }
});

test("11. unknownClinical não produz prompt", async () => {
  const { deps } = depsClassificando({ decision: { kind: "unknownClinical" }, selectedFacts: [] });
  const historico = [{ tipo: "estudante" as const, conteudo: "Bom dia." }];
  const r = await prepararTurnoPacienteTexto(
    { caso: casoOuroLegado, mensagemAtual: "Tem diabetes?", historico },
    deps
  );
  assert.ok(!("prompt" in r));
});

test("12. reservedOrMeta retorna resposta direta", async () => {
  const { deps } = depsClassificando({ decision: { kind: "reservedOrMeta" }, selectedFacts: [] });
  const historico = [{ tipo: "estudante" as const, conteudo: "Bom dia." }];
  const r = await prepararTurnoPacienteTexto(
    { caso: casoOuroLegado, mensagemAtual: "Qual é o meu diagnóstico?", historico },
    deps
  );
  assert.equal(r.kind, "direct");
  if (r.kind === "direct") {
    assert.ok(FRASES_RESERVED_OR_META.includes(r.response));
  }
});

test("13. reservedOrMeta não produz prompt", async () => {
  const { deps } = depsClassificando({ decision: { kind: "reservedOrMeta" }, selectedFacts: [] });
  const historico = [{ tipo: "estudante" as const, conteudo: "Bom dia." }];
  const r = await prepararTurnoPacienteTexto(
    { caso: casoOuroLegado, mensagemAtual: "Qual é o meu diagnóstico?", historico },
    deps
  );
  assert.ok(!("prompt" in r));
});

// ── 14. social produz prompt sem fatos clínicos ────────────────────────────

test("14. social produz prompt sem fatos clínicos", async () => {
  const { deps } = depsClassificando({ decision: { kind: "social" }, selectedFacts: [] });
  const historico = [{ tipo: "estudante" as const, conteudo: "Bom dia." }];
  const r = await prepararTurnoPacienteTexto(
    { caso: casoOuroLegado, mensagemAtual: "Para que time torce?", historico },
    deps
  );
  assert.equal(r.kind, "generate");
  if (r.kind === "generate") {
    for (const f of casoSCAOuroV3.patientKnowledge.fatos) {
      assert.ok(!r.prompt.includes(f.valor), `fato "${f.id}" não deveria aparecer numa resposta social`);
    }
  }
});

// ── FASE 4C.3B — diretiva de uso direto do fato, exclusiva de "known" ──────

const MARCADOR_DIRETIVA_KNOWN = "INSTRUÇÃO ESPECÍFICA DESTE TURNO";

test("14a. a diretiva de uso direto do fato aparece em known", async () => {
  const { deps } = depsClassificando({
    decision: { kind: "known", factIds: ["f_dor_caracter"] },
    selectedFacts: [fato("f_dor_caracter")],
  });
  const historico = [{ tipo: "estudante" as const, conteudo: "Bom dia." }];
  const r = await prepararTurnoPacienteTexto(
    { caso: casoOuroLegado, mensagemAtual: "Como é essa dor?", historico },
    deps
  );
  assert.equal(r.kind, "generate");
  if (r.kind === "generate") {
    assert.ok(r.prompt.includes(MARCADOR_DIRETIVA_KNOWN));
  }
});

test("14b. a diretiva não aparece na abertura (opening)", async () => {
  const { deps } = depsClassificando({ decision: { kind: "social" }, selectedFacts: [] });
  const r = await prepararTurnoPacienteTexto(
    { caso: casoOuroLegado, mensagemAtual: "O que trouxe o senhor aqui hoje?", historico: [] },
    deps
  );
  assert.equal(r.kind, "generate");
  assert.equal(r.decision?.kind, "opening");
  if (r.kind === "generate") {
    assert.ok(!r.prompt.includes(MARCADOR_DIRETIVA_KNOWN));
  }
});

test("14c. a diretiva não aparece em social", async () => {
  const { deps } = depsClassificando({ decision: { kind: "social" }, selectedFacts: [] });
  const historico = [{ tipo: "estudante" as const, conteudo: "Bom dia." }];
  const r = await prepararTurnoPacienteTexto(
    { caso: casoOuroLegado, mensagemAtual: "Para que time torce?", historico },
    deps
  );
  assert.equal(r.kind, "generate");
  if (r.kind === "generate") {
    assert.ok(!r.prompt.includes(MARCADOR_DIRETIVA_KNOWN));
  }
});

// ── 15–16. Robustez a dependência malformada ───────────────────────────────

test("15. erro do classificador falha fechado (resposta direta, nunca exceção)", async () => {
  const deps = {
    classificarTurno: async () => {
      throw new Error("falha simulada de rede/parsing");
    },
  };
  const historico = [{ tipo: "estudante" as const, conteudo: "Bom dia." }];
  const r = await prepararTurnoPacienteTexto(
    { caso: casoOuroLegado, mensagemAtual: "x", historico },
    deps
  );
  assert.equal(r.kind, "direct");
  if (r.kind === "direct") {
    assert.equal(r.decision.kind, "unknownClinical");
    assert.ok(FRASES_UNKNOWN_CLINICAL.includes(r.response));
  }
});

test("16. id inválido/fato fabricado nunca libera todos os fatos", async () => {
  const fatoFabricado: FatoPaciente = { id: "f_fabricado_pelo_teste", dominio: "sintoma", valor: "valor fabricado" };
  const { deps } = depsClassificando({
    decision: { kind: "known", factIds: ["f_fabricado_pelo_teste"] },
    selectedFacts: [fatoFabricado],
  });
  const historico = [{ tipo: "estudante" as const, conteudo: "Bom dia." }];
  const r = await prepararTurnoPacienteTexto(
    { caso: casoOuroLegado, mensagemAtual: "x", historico },
    deps
  );
  assert.equal(r.kind, "generate");
  if (r.kind === "generate") {
    assert.ok(r.prompt.includes("valor fabricado"));
    for (const f of casoSCAOuroV3.patientKnowledge.fatos) {
      assert.ok(!r.prompt.includes(f.valor), `fato real "${f.id}" não deveria vazar junto com o fato fabricado`);
    }
  }
});

// ── 17–18. Zona reservada ausente / histórico e mensagem anexados ─────────

test("17. ClinicalTruth e Examiner permanecem ausentes em qualquer geração V3", async () => {
  const { deps } = depsClassificando({
    decision: { kind: "known", factIds: ["f_dor_caracter"] },
    selectedFacts: [fato("f_dor_caracter")],
  });
  const historico = [{ tipo: "estudante" as const, conteudo: "Bom dia." }];
  const r = await prepararTurnoPacienteTexto(
    { caso: casoOuroLegado, mensagemAtual: "Como é essa dor?", historico },
    deps
  );
  assert.equal(r.kind, "generate");
  if (r.kind === "generate") {
    assert.ok(!r.prompt.includes("Síndrome Coronariana Aguda (SCA) - IAMCSST"));
    assert.ok(!r.prompt.includes("Aspirina 500mg VO"));
    assert.ok(!r.prompt.includes("Nota mínima de 17 em 20 pontos."));
  }
});

test("18. texto e histórico continuam anexados ao prompt gerado", async () => {
  const { deps } = depsClassificando({
    decision: { kind: "known", factIds: ["f_dor_caracter"] },
    selectedFacts: [fato("f_dor_caracter")],
  });
  const historico = [
    { tipo: "estudante" as const, conteudo: "Bom dia." },
    { tipo: "paciente" as const, conteudo: "Bom dia, doutor." },
  ];
  const r = await prepararTurnoPacienteTexto(
    { caso: casoOuroLegado, mensagemAtual: "Como é essa dor?", historico },
    deps
  );
  assert.equal(r.kind, "generate");
  if (r.kind === "generate") {
    assert.ok(r.prompt.includes("HISTÓRICO DA CONVERSA"));
    assert.ok(r.prompt.includes("Bom dia."));
    assert.ok(r.prompt.includes("NOVA MENSAGEM DO ESTUDANTE"));
    assert.ok(r.prompt.includes("Como é essa dor?"));
  }
});

// ── 19–20. Determinismo e isolamento de rede ────────────────────────────

test("19. mesma mensagem produz o mesmo fallback (determinístico, sem aleatoriedade)", async () => {
  const { deps: deps1 } = depsClassificando({ decision: { kind: "unknownClinical" }, selectedFacts: [] });
  const { deps: deps2 } = depsClassificando({ decision: { kind: "unknownClinical" }, selectedFacts: [] });
  const historico = [{ tipo: "estudante" as const, conteudo: "Bom dia." }];
  const r1 = await prepararTurnoPacienteTexto({ caso: casoOuroLegado, mensagemAtual: "Tem diabetes?", historico }, deps1);
  const r2 = await prepararTurnoPacienteTexto({ caso: casoOuroLegado, mensagemAtual: "Tem diabetes?", historico }, deps2);
  assert.deepEqual(r1, r2);
});

test("20. nenhuma chamada real ocorre nos testes (dependência sempre injetada e contada)", async () => {
  const { deps, getNumeroDeChamadas } = depsClassificando({
    decision: { kind: "known", factIds: ["f_dor_caracter"] },
    selectedFacts: [fato("f_dor_caracter")],
  });
  const historico = [{ tipo: "estudante" as const, conteudo: "Bom dia." }];
  await prepararTurnoPacienteTexto({ caso: casoOuroLegado, mensagemAtual: "Como é essa dor?", historico }, deps);
  assert.equal(getNumeroDeChamadas(), 1, "deveria ter chamado a dependência injetada exatamente uma vez");
});
