/**
 * Testes determinísticos do Caso Ouro SCA nativo V3 (Fase 2B) — sem LLM, sem
 * rede. Cobrem estrutura, fidelidade à fonte legada e a fronteira com o
 * Patient Context Builder (extração explícita da Zona do Paciente).
 *
 * Runner: npx tsx --test lib/patient-v3/__tests__/casoOuroSCA.test.mts
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { casoSCAOuroV3 } from "@/data/casos-v3/001-sca-ouro";
import { construirPatientSafeContext } from "@/lib/patient-v3/patientContextBuilder";
import { construirPromptBasePaciente } from "@/lib/patient-v3/promptBasePaciente";
import type { FatoPaciente, PatientZoneInput } from "@/lib/patient-v3/casoV3.types";

const caso = casoSCAOuroV3;

// ── 1–6. Estrutura geral do CasoV3 ────────────────────────────────────────

test("1. o objeto satisfaz CasoV3 (validado por tsc via 'satisfies' na origem)", () => {
  assert.ok(caso);
});

test("2. schemaVersion é '3.2'", () => {
  assert.equal(caso.schemaVersion, "3.2");
});

test("3. possui exatamente os sete blocos do contrato além de schemaVersion", () => {
  assert.deepEqual(
    Object.keys(caso).sort(),
    [
      "clinicalTruth",
      "disclosurePolicy",
      "examiner",
      "metadata",
      "patientKnowledge",
      "persona",
      "schemaVersion",
      "sessionStateInicial",
    ]
  );
});

test("4. clinicalTruth existe", () => {
  assert.ok(caso.clinicalTruth);
});

test("5. examiner existe", () => {
  assert.ok(caso.examiner);
});

test("6. metadata contém os valores aprovados", () => {
  assert.deepEqual(caso.metadata, {
    id: "1",
    titulo: "Dor Torácica - Síndrome Coronariana Aguda",
    especialidade: "Cardiovascular",
    tema: "Dor Torácica",
    nivel: "intermediario",
    tipoEstacao: "integrada",
    duracaoMinutos: 15,
    versaoCaso: "1.0.0",
  });
});

// ── 7–9. Diferenciais e complicações ──────────────────────────────────────

test("7. lista de diferenciais é exatamente a lista canônica de quatro itens", () => {
  assert.deepEqual(caso.clinicalTruth.diagnosticosDiferenciais, [
    "Angina Instável",
    "Pericardite Aguda",
    "Embolia Pulmonar",
    "Dissecção de Aorta",
  ]);
});

test("8. IAM não reaparece como diferencial", () => {
  assert.ok(!caso.clinicalTruth.diagnosticosDiferenciais.some((d) => d.includes("Infarto Agudo do Miocárdio")));
});

test("9. complicacoes está omitido", () => {
  assert.ok(!("complicacoes" in caso.clinicalTruth));
});

// ── 10–11. Exame físico ───────────────────────────────────────────────────

test("10. exame físico contém resumo achatado e porSistema genérico", () => {
  const ef = caso.clinicalTruth.exameFisicoVerdadeiro;
  assert.equal(typeof ef.inspecao, "string");
  assert.ok(ef.inspecao.length > 0);
  assert.ok(Array.isArray(ef.porSistema));
  assert.ok(ef.porSistema!.length > 0);
});

test("11. sistemas presentes correspondem somente aos sistemas sustentados pela fonte (Geral, Cardiovascular)", () => {
  const sistemas = caso.clinicalTruth.exameFisicoVerdadeiro.porSistema!.map((s) => s.sistema);
  assert.deepEqual(sistemas.sort(), ["Cardiovascular", "Geral"]);
});

// ── 12. Sinais vitais ──────────────────────────────────────────────────────

test("12. sinais vitais correspondem à fonte canônica (sinaisVitaisCorretos)", () => {
  assert.deepEqual(caso.clinicalTruth.sinaisVitais, {
    pressaoArterial: "160/95 mmHg",
    frequenciaCardiaca: 102,
    frequenciaRespiratoria: 20,
    temperatura: 36.8,
    saturacaoOxigenio: 96,
    glicemia: 110,
  });
});

// ── 13–15. Exames laboratoriais e troponina ──────────────────────────────

test("13. todos os 9 painéis laboratoriais da fonte foram preservados", () => {
  assert.equal(caso.clinicalTruth.exames.length, 9);
  const nomes = caso.clinicalTruth.exames.map((e) => e.nome);
  assert.deepEqual(nomes, [
    "Hemograma completo",
    "Função renal",
    "Eletrólitos",
    "Marcadores inflamatórios",
    "Gasometria arterial",
    "Marcadores cardíacos",
    "Função hepática",
    "Coagulograma",
    "Urina tipo 1",
  ]);
});

test("14. cada painel contém o número exato de analitos da fonte", () => {
  const contagemPorNome = new Map(caso.clinicalTruth.exames.map((e) => [e.nome, e.itens?.length ?? 0]));
  assert.equal(contagemPorNome.get("Hemograma completo"), 16);
  assert.equal(contagemPorNome.get("Função renal"), 3);
  assert.equal(contagemPorNome.get("Eletrólitos"), 5);
  assert.equal(contagemPorNome.get("Marcadores inflamatórios"), 3);
  assert.equal(contagemPorNome.get("Gasometria arterial"), 7);
  assert.equal(contagemPorNome.get("Marcadores cardíacos"), 3);
  assert.equal(contagemPorNome.get("Função hepática"), 8);
  assert.equal(contagemPorNome.get("Coagulograma"), 5);
  assert.equal(contagemPorNome.get("Urina tipo 1"), 12);
});

test("15. Troponina I não está duplicada (aparece uma única vez, dentro de Marcadores cardíacos)", () => {
  const ocorrencias = caso.clinicalTruth.exames.flatMap((e) =>
    (e.itens ?? []).filter((it) => it.nome.toLowerCase().includes("troponina"))
  );
  assert.equal(ocorrencias.length, 1);
  const painelComTroponina = caso.clinicalTruth.exames.find((e) => (e.itens ?? []).some((it) => it.nome === "troponinaI"));
  assert.equal(painelComTroponina?.nome, "Marcadores cardíacos");
});

// ── 16. ECG ────────────────────────────────────────────────────────────────

test("16. ECG não contém o resíduo pediátrico", () => {
  const textoEcg = JSON.stringify(caso.clinicalTruth.ecg);
  assert.ok(!textoEcg.includes("pediatrica"));
  assert.equal(caso.clinicalTruth.ecg?.derivacoes, "D2, D3, aVF");
});

// ── 17–18. Evolução e conduta ──────────────────────────────────────────────

test("17. evolução possui os dois caminhos existentes", () => {
  assert.ok(caso.clinicalTruth.evolucao.seCondutaCorreta.length > 0);
  assert.ok(caso.clinicalTruth.evolucao.seCondutaInadequadaOuAtrasada.length > 0);
});

test("18. tratamento correto está completo (imediata/curtoPrazo/longoPrazo/encaminhamentos)", () => {
  const t = caso.clinicalTruth.tratamentoCorreto;
  assert.equal(t.imediata.length, 5);
  assert.equal(t.curtoPrazo?.length, 3);
  assert.equal(t.longoPrazo?.length, 2);
  assert.equal(t.encaminhamentos?.length, 2);
});

// ── 19–22. PatientKnowledge ────────────────────────────────────────────────

test("19. PatientKnowledge possui exatamente 25 fatos", () => {
  assert.equal(caso.patientKnowledge.fatos.length, 25);
});

test("20. ids dos fatos são únicos", () => {
  const ids = caso.patientKnowledge.fatos.map((f) => f.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("21. não existe f_medo_ansiedade", () => {
  assert.ok(!caso.patientKnowledge.fatos.some((f) => f.id === "f_medo_ansiedade"));
});

test("22. nenhum fato contém diagnóstico, interpretação de exame ou conduta reservada", () => {
  const termosProibidos = [
    "IAMCSST",
    "Síndrome Coronariana Aguda",
    "Infarto Agudo do Miocárdio",
    "troponina",
    "necrose miocárdica",
    "elevação do segmento ST",
    "angioplastia",
    "cateterismo",
    "aspirina",
  ];
  for (const f of caso.patientKnowledge.fatos) {
    for (const termo of termosProibidos) {
      assert.ok(
        !f.valor.toLowerCase().includes(termo.toLowerCase()),
        `fato "${f.id}" não deveria conter termo diagnóstico/conduta "${termo}": "${f.valor}"`
      );
    }
  }
});

// ── 23–25. DisclosurePolicy ─────────────────────────────────────────────────

test("23. disclosurePolicy possui exatamente 25 regras", () => {
  assert.equal(caso.disclosurePolicy.regras.length, 25);
});

test("24. não existe política sensivel", () => {
  // Mapeado para string[] deliberadamente: o "satisfies CasoV3" na origem faz o
  // TypeScript estreitar `politica` ao literal union realmente usado no Caso
  // Ouro (sem "sensivel"); alargar para string evita um erro de comparação
  // "sem sobreposição" ao mesmo tempo em que preserva o teste real em runtime.
  const politicas: string[] = caso.disclosurePolicy.regras.map((r) => r.politica);
  assert.ok(!politicas.includes("sensivel"));
});

test("25. aberturaFactIds é exatamente ['f_queixa_dor']", () => {
  assert.deepEqual(caso.disclosurePolicy.aberturaFactIds, ["f_queixa_dor"]);
});

// ── Fase 3.3B — completude editorial (10 fatos novos, 10 regras novas) ──────

function fato(id: string): FatoPaciente {
  // Alargado para FatoPaciente: o "satisfies CasoV3" na origem estreita cada
  // fato ao literal exato usado (sem "incerto" nos que não o declaram); o
  // mesmo padrão do teste 24 (politicas: string[]) é aplicado aqui para
  // permitir checar `.incerto` em runtime sem erro de tipo em tempo de build.
  const fatos: FatoPaciente[] = caso.patientKnowledge.fatos;
  const f = fatos.find((x) => x.id === id);
  assert.ok(f, `fato "${id}" deveria existir`);
  return f!;
}

function regra(factId: string) {
  const r = caso.disclosurePolicy.regras.find((x) => x.factId === factId);
  assert.ok(r, `regra para "${factId}" deveria existir`);
  return r!;
}

test("38. cada um dos 25 fatos possui exatamente uma regra de disclosurePolicy (correspondência 1:1)", () => {
  const idsFatos = caso.patientKnowledge.fatos.map((f) => f.id);
  const factIdsRegras = caso.disclosurePolicy.regras.map((r) => r.factId);
  assert.equal(new Set(factIdsRegras).size, factIdsRegras.length, "não deveria haver regra duplicada para o mesmo fato");
  assert.deepEqual([...idsFatos].sort(), [...factIdsRegras].sort(), "todo fato deveria ter exatamente uma regra correspondente, e vice-versa");
});

test("39. nenhum dos 10 fatos novos participa da abertura", () => {
  const idsNovos = [
    "f_dor_caracter",
    "f_dor_alivio",
    "f_dor_piora",
    "f_medicamento_regime",
    "f_habito_tabagismo",
    "f_habito_alcool",
    "f_habito_outras_substancias",
    "f_habito_atividade_fisica",
    "f_preocupacao_quadro",
    "f_objetivo_consulta",
  ];
  for (const id of idsNovos) {
    assert.ok(!caso.disclosurePolicy.aberturaFactIds.includes(id), `"${id}" não deveria estar em aberturaFactIds`);
  }
  assert.deepEqual(caso.disclosurePolicy.aberturaFactIds, ["f_queixa_dor"]);
});

test("40. f_dor_caracter contém o valor aprovado (pressão/aperto) com política perguntaAberta", () => {
  assert.equal(fato("f_dor_caracter").valor, "Dor descrita como pressão ou aperto.");
  assert.equal(regra("f_dor_caracter").politica, "perguntaAberta");
});

test("41. f_dor_alivio contém o valor aprovado (nada alivia) com política perguntaDireta", () => {
  assert.equal(fato("f_dor_alivio").valor, "Nada alivia a dor.");
  assert.equal(regra("f_dor_alivio").politica, "perguntaDireta");
});

test("42. f_dor_piora contém o valor aprovado (sem fator específico) e não declara movimento/esforço/respiração/palpação/alimentação como piora", () => {
  const f = fato("f_dor_piora");
  assert.equal(f.valor, "Não percebeu fator específico que piore a dor.");
  for (const termo of ["movimento", "esforço", "respiração", "palpação", "alimentação"]) {
    assert.ok(!f.valor.toLowerCase().includes(termo), `f_dor_piora não deveria mencionar "${termo}"`);
  }
  assert.equal(regra("f_dor_piora").politica, "perguntaDireta");
});

test("43. f_medicamento_regime contém frequência, horário e adesão aprovados, sem novo medicamento", () => {
  const f = fato("f_medicamento_regime");
  assert.equal(
    f.valor,
    "Usa a Losartana uma vez ao dia pela manhã e costuma tomá-la regularmente, sem esquecimentos frequentes."
  );
  assert.equal(regra("f_medicamento_regime").politica, "perguntaDireta");
  // f_medicamento_losartana (identificação/dose) permanece intacto e único fato de identificação do medicamento.
  assert.equal(fato("f_medicamento_losartana").valor, "Usa Losartana 50 mg para a pressão.");
});

test("44. f_habito_tabagismo é uma negação explícita, sem carga tabágica", () => {
  const f = fato("f_habito_tabagismo");
  assert.equal(f.valor, "Nega tabagismo atual ou prévio.");
  assert.ok(!/\d/.test(f.valor), "não deveria conter número (carga tabágica)");
  assert.equal(regra("f_habito_tabagismo").politica, "perguntaDireta");
});

test("45. f_habito_alcool contém uso social ocasional, sem dose/frequência/bebida/abuso", () => {
  const f = fato("f_habito_alcool");
  assert.equal(f.valor, "Consome bebida alcoólica ocasionalmente, em situações sociais.");
  assert.ok(!/\d/.test(f.valor), "não deveria conter número de doses");
  assert.equal(regra("f_habito_alcool").politica, "perguntaDireta");
});

test("46. f_habito_outras_substancias nega cocaína e drogas recreativas, sem citar medicamentos prescritos", () => {
  const f = fato("f_habito_outras_substancias");
  assert.equal(f.valor, "Nega uso de cocaína ou outras drogas recreativas.");
  assert.ok(!f.valor.toLowerCase().includes("losartana"));
  assert.equal(regra("f_habito_outras_substancias").politica, "perguntaDireta");
});

test("47. f_habito_atividade_fisica representa sedentarismo, sem IMC/peso/dieta/obesidade", () => {
  const f = fato("f_habito_atividade_fisica");
  assert.equal(f.valor, "É sedentário e não pratica atividade física regularmente.");
  for (const termo of ["imc", "peso", "dieta", "obes"]) {
    assert.ok(!f.valor.toLowerCase().includes(termo), `f_habito_atividade_fisica não deveria mencionar "${termo}"`);
  }
  assert.equal(regra("f_habito_atividade_fisica").politica, "perguntaDireta");
});

test("48. f_preocupacao_quadro contém apenas a preocupação aprovada, sem ligação explícita à morte do pai", () => {
  const f = fato("f_preocupacao_quadro");
  assert.equal(f.valor, "Tem medo de que a dor seja sinal de algo grave.");
  assert.ok(!f.valor.toLowerCase().includes("pai"));
  assert.equal(regra("f_preocupacao_quadro").politica, "perguntaDireta");
  assert.ok(!caso.disclosurePolicy.aberturaFactIds.includes("f_preocupacao_quadro"));
});

test("49. f_objetivo_consulta não menciona diagnóstico nem tratamento específico", () => {
  const f = fato("f_objetivo_consulta");
  assert.equal(f.valor, "Quer entender o que está causando a dor e receber tratamento para melhorar.");
  for (const termo of ["angioplastia", "trombólise", "iamcsst", "síndrome coronariana"]) {
    assert.ok(!f.valor.toLowerCase().includes(termo), `f_objetivo_consulta não deveria mencionar "${termo}"`);
  }
  assert.equal(regra("f_objetivo_consulta").politica, "perguntaDireta");
});

test("50. os 10 fatos novos usam apenas os domínios aprovados (sintoma/medicamento/habito/preocupacao/objetivo)", () => {
  const dominiosPorId: Record<string, string> = {
    f_dor_caracter: "sintoma",
    f_dor_alivio: "sintoma",
    f_dor_piora: "sintoma",
    f_medicamento_regime: "medicamento",
    f_habito_tabagismo: "habito",
    f_habito_alcool: "habito",
    f_habito_outras_substancias: "habito",
    f_habito_atividade_fisica: "habito",
    f_preocupacao_quadro: "preocupacao",
    f_objetivo_consulta: "objetivo",
  };
  for (const [id, dominioEsperado] of Object.entries(dominiosPorId)) {
    assert.equal(fato(id).dominio, dominioEsperado, `"${id}" deveria ter domínio "${dominioEsperado}"`);
  }
});

test("51. nenhum dos 10 fatos novos é incerto (todos são positivos/negativos definidos, não fatos vagos)", () => {
  const idsNovos = [
    "f_dor_caracter",
    "f_dor_alivio",
    "f_dor_piora",
    "f_medicamento_regime",
    "f_habito_tabagismo",
    "f_habito_alcool",
    "f_habito_outras_substancias",
    "f_habito_atividade_fisica",
    "f_preocupacao_quadro",
    "f_objetivo_consulta",
  ];
  for (const id of idsNovos) {
    assert.ok(!fato(id).incerto, `"${id}" não deveria ser incerto`);
  }
});

test("52. os 15 fatos previamente aprovados permanecem com o mesmo valor (nenhuma alteração retroativa)", () => {
  assert.equal(fato("f_queixa_dor").valor, "Dor no peito, iniciada há aproximadamente 2 horas.");
  assert.equal(fato("f_contexto_inicio").valor, "Início súbito, em repouso, enquanto assistia à televisão.");
  assert.equal(fato("f_dor_localizacao").valor, "Dor localizada no centro do peito (região retroesternal).");
  assert.equal(fato("f_dor_irradiacao").valor, "A dor às vezes irradia para o braço esquerdo.");
  assert.equal(fato("f_dor_intensidade").valor, "Intensidade da dor entre 8 e 9 em uma escala de 0 a 10.");
  assert.equal(fato("f_sudorese").valor, "Presença de sudorese (suor intenso) e tremor.");
  assert.equal(fato("f_dispneia").valor, "Falta de ar (dispneia).");
  assert.equal(fato("f_tontura").valor, "Tontura leve.");
  assert.equal(fato("f_nausea").valor, "Náusea leve (enjoo).");
  assert.equal(fato("f_antecedente_hipertensao").valor, "Tem hipertensão arterial (pressão alta).");
  assert.equal(fato("f_historia_familiar_infarto").valor, "O pai faleceu de infarto.");
  assert.equal(fato("f_alergias").valor, "Nega alergias conhecidas.");
  assert.equal(fato("f_contexto_profissao").valor, "Trabalha como engenheiro.");
  assert.equal(fato("f_contexto_estado_civil").valor, "É casado.");
});

// ── 26–27. Persona e SessionStateInicial ───────────────────────────────────

test("26. Persona corresponde aos valores aprovados", () => {
  assert.deepEqual(caso.persona, { expansividade: 4, objetividade: 7, letramentoSaude: "medio" });
});

test("27. SessionStateInicial corresponde aos valores aprovados", () => {
  assert.deepEqual(caso.sessionStateInicial, { ansiedade: 8, medo: 8, confianca: 4, cooperacao: 7, frustracao: 2 });
});

// ── 28–34. Examiner ─────────────────────────────────────────────────────────

test("28. rubricas preservam pontuacaoMaxima", () => {
  assert.deepEqual(
    caso.examiner.rubricas.map((r) => r.pontuacaoMaxima),
    [15, 25, 20]
  );
});

test("29. erros críticos preservam evitavel", () => {
  assert.ok(caso.examiner.errosCriticos.every((e) => e.evitavel === true));
  assert.equal(caso.examiner.errosCriticos.length, 2, "penalidadesAutomaticas não deveria ter sido fundida aqui");
});

test("30. feedback contém escala total 20 e mínimo 17", () => {
  assert.deepEqual(caso.examiner.feedback.escalaAvaliacao, { total: 20, minimoAprovacao: 17 });
});

test("31. feedback contém os domínios ponderados reais (6 domínios somando 20 pontos)", () => {
  const dominios = caso.examiner.feedback.dominiosPonderados!;
  assert.equal(dominios.length, 6);
  const soma = dominios.reduce((acc, d) => acc + d.pontos, 0);
  assert.equal(soma, 20);
});

test("32. feedback contém penalidades automáticas separadas de errosCriticos", () => {
  assert.equal(caso.examiner.feedback.penalidadesAutomaticas?.length, 3);
});

test("33. modelo SOAP permanece estruturado (não achatado no checklist)", () => {
  const soap = caso.examiner.feedback.modeloSoap!;
  assert.equal(soap.subjetivo.componentesObrigatorios.length, 2);
  assert.equal(soap.objetivo.componentesObrigatorios.length, 4);
  assert.equal(soap.avaliacao.componentesObrigatorios.length, 2);
  assert.equal(soap.plano.componentesObrigatorios.length, 2);
  assert.ok(!caso.examiner.checklist.some((c) => c.categoria === "Subjetivo" || c.categoria === "Objetivo"));
});

test("34. criteriosAprovacao corresponde exatamente à lista aprovada", () => {
  assert.deepEqual(caso.examiner.criteriosAprovacao, [
    "Nota mínima de 17 em 20 pontos.",
    "Reconhecimento da gravidade do quadro.",
    "Diagnóstico principal correto.",
    "Conduta imediata apropriada e tratamento específico correto.",
  ]);
});

// ── Checklist: composição e deduplicação (complementar à Seção 34) ────────

test("35. checklist tem 25 itens (todos de checklist_oculto_examinador; nenhum item novo de checklist_osce)", () => {
  assert.equal(caso.examiner.checklist.length, 25);
});

test("36. exatamente 4 itens do checklist carregam critico:true (mesclado dos 4 itens duplicados de checklist_osce)", () => {
  const criticos = caso.examiner.checklist.filter((c) => c.critico === true);
  assert.equal(criticos.length, 4);
});

// ── Fronteira com o Builder — Zona do Paciente extraída explicitamente ────

test("37. extrair PatientZoneInput do CasoV3, construir PatientSafeContext e Prompt Base sem vazar a Zona Reservada", () => {
  // Extração EXPLÍCITA — o caso completo nunca é passado diretamente ao Builder.
  const patientZoneInput: PatientZoneInput = {
    patientKnowledge: caso.patientKnowledge,
    disclosurePolicy: caso.disclosurePolicy,
    persona: caso.persona,
    sessionStateInicial: caso.sessionStateInicial,
  };

  const safeContext = construirPatientSafeContext(patientZoneInput);

  assert.deepEqual(Object.keys(safeContext).sort(), [
    "disclosurePolicy",
    "patientKnowledge",
    "persona",
    "sessionStateInicial",
  ]);
  assert.ok(!("metadata" in safeContext));
  assert.ok(!("clinicalTruth" in safeContext));
  assert.ok(!("examiner" in safeContext));

  const prompt = construirPromptBasePaciente(safeContext);
  assert.equal(typeof prompt, "string");
  assert.ok(prompt.length > 0);

  // Busca textual auxiliar (não é a garantia principal — a garantia é a
  // extração explícita + whitelist acima). Não busca "infarto" de forma
  // genérica, pois a história familiar legítima ("O pai faleceu de infarto.")
  // contém esse termo — busca apenas os termos diagnósticos específicos do caso.
  assert.ok(!prompt.includes("IAMCSST"));
  assert.ok(!prompt.includes("Síndrome Coronariana Aguda"));
  assert.ok(!prompt.includes("necrose miocárdica"));
});
