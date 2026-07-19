/**
 * Testes determinísticos de tipo (Subfase 2A.2) para os tipos auxiliares da
 * Zona Reservada de lib/patient-v3/casoV3.types.ts — sem LLM, sem rede, sem
 * runtime real (o arquivo de tipos não produz nenhum valor em tempo de
 * execução). As asserções usam `@ts-expect-error` sobre objetos literais,
 * verificadas por `tsc --noEmit`; os `assert.ok(true)` que acompanham cada
 * teste apenas dão ao runner um resultado observável por teste.
 *
 * Runner: npx tsx --test lib/patient-v3/__tests__/casoV3.types.test.mts
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import type {
  CasoV3,
  ClinicalTruth,
  ExameFisicoAchados,
  ExameResultado,
  RubricaItem,
  ChecklistItem,
  ErroCritico,
  FeedbackModelo,
  PatientZoneInput,
  PatientSafeContext,
  Metadata,
  Examiner,
  PatientKnowledge,
  DisclosurePolicy,
  Persona,
  SessionStateInicial,
} from "@/lib/patient-v3/casoV3.types";

// ── Fábricas mínimas reaproveitadas entre os testes ──────────────────────────

function metadataValida(): Metadata {
  return {
    id: "1",
    titulo: "t",
    especialidade: "Cardiovascular",
    nivel: "intermediario",
    tipoEstacao: "integrada",
    duracaoMinutos: 15,
    versaoCaso: "1.0.0",
  };
}

function patientKnowledgeValido(): PatientKnowledge {
  return {
    identidade: { nome: "Carlos", idade: 52, sexo: "M" },
    interlocutor: "paciente",
    fatos: [],
  };
}

function disclosurePolicyValida(): DisclosurePolicy {
  return { aberturaFactIds: [], regras: [] };
}

function personaValida(): Persona {
  return { expansividade: 4, objetividade: 7, letramentoSaude: "medio" };
}

function sessionStateValido(): SessionStateInicial {
  return { ansiedade: 8, medo: 8, confianca: 4, cooperacao: 7, frustracao: 2 };
}

function feedbackSimplesValido(): FeedbackModelo {
  return { acertosEsperados: [], errosComuns: [], orientacoesPedagogicas: [] };
}

function examinerValido(): Examiner {
  return {
    rubricas: [],
    checklist: [],
    errosCriticos: [],
    feedback: feedbackSimplesValido(),
    criteriosAprovacao: [],
  };
}

function exameFisicoValido(): ExameFisicoAchados {
  return { inspecao: "", palpacao: "", ausculta: "", percussao: "", observacoes: "" };
}

function clinicalTruthValido(): ClinicalTruth {
  return {
    diagnosticoPrincipal: "d",
    diagnosticosDiferenciais: [],
    cronologiaVerdadeira: "c",
    exameFisicoVerdadeiro: exameFisicoValido(),
    sinaisVitais: {
      pressaoArterial: "",
      frequenciaCardiaca: 0,
      frequenciaRespiratoria: 0,
      temperatura: 0,
      saturacaoOxigenio: 0,
    },
    exames: [],
    evolucao: { seCondutaCorreta: "", seCondutaInadequadaOuAtrasada: "" },
    tratamentoCorreto: { imediata: [] },
  };
}

function casoV3Valido(): CasoV3 {
  return {
    schemaVersion: "3.2",
    metadata: metadataValida(),
    clinicalTruth: clinicalTruthValido(),
    patientKnowledge: patientKnowledgeValido(),
    disclosurePolicy: disclosurePolicyValida(),
    persona: personaValida(),
    sessionStateInicial: sessionStateValido(),
    examiner: examinerValido(),
  };
}

// ── 1–5. ExameFisicoAchados ───────────────────────────────────────────────

test("1. CasoV3 completo aceita ExameFisicoAchados com resumo achatado", () => {
  const caso = casoV3Valido();
  assert.equal(caso.clinicalTruth.exameFisicoVerdadeiro.inspecao, "");
});

test("2. ExameFisicoAchados aceita porSistema genérico", () => {
  const exame: ExameFisicoAchados = {
    ...exameFisicoValido(),
    porSistema: [{ sistema: "Geral", achados: [{ nome: "estado_geral", valor: "ansioso" }] }],
  };
  assert.equal(exame.porSistema?.[0].sistema, "Geral");
});

test("3. ExameFisicoAchados aceita sistema 'Geral'", () => {
  const exame: ExameFisicoAchados = {
    ...exameFisicoValido(),
    porSistema: [{ sistema: "Geral", achados: [{ nome: "consciencia", valor: "Lúcido e orientado" }] }],
  };
  assert.equal(exame.porSistema?.[0].achados[0].nome, "consciencia");
});

test("4. ExameFisicoAchados aceita sistema 'Cardiovascular'", () => {
  const exame: ExameFisicoAchados = {
    ...exameFisicoValido(),
    porSistema: [
      {
        sistema: "Cardiovascular",
        achados: [
          { nome: "ausculta_cardiaca", valor: "Bulhas hipofonéticas, ritmo regular" },
          { nome: "pulsos", valor: "Presentes e simétricos, amplitude reduzida" },
        ],
      },
    ],
  };
  assert.equal(exame.porSistema?.[0].sistema, "Cardiovascular");
  assert.equal(exame.porSistema?.[0].achados.length, 2);
});

test("5. SecaoExameFisico não exige propriedades fixas por especialidade (qualquer 'sistema' textual serve)", () => {
  const exame: ExameFisicoAchados = {
    ...exameFisicoValido(),
    porSistema: [
      { sistema: "Geral", achados: [] },
      { sistema: "Cardiovascular", achados: [] },
      { sistema: "Neurologico", achados: [] }, // texto livre — nenhum tipo fixo por especialidade
    ],
  };
  assert.equal(exame.porSistema?.length, 3);
});

// ── 6–11. ExameResultado ─────────────────────────────────────────────────

test("6. ExameResultado aceita resultado simples", () => {
  const ex: ExameResultado = { nome: "ECG", resultado: "Elevação de ST em D2/D3/aVF" };
  assert.equal(ex.resultado, "Elevação de ST em D2/D3/aVF");
});

test("7. ExameResultado aceita painel com itens", () => {
  const ex: ExameResultado = {
    nome: "Hemograma",
    itens: [{ nome: "hemoglobina", valor: "14,3 g/dL" }],
  };
  assert.equal(ex.itens?.[0].nome, "hemoglobina");
});

test("8. ExameResultado aceita resultado + itens coexistindo", () => {
  const ex: ExameResultado = {
    nome: "Marcadores cardíacos",
    resultado: "Elevados, compatíveis com necrose miocárdica",
    itens: [
      { nome: "troponinaI", valor: "2,8 ng/mL", referencia: "<0,04 ng/mL" },
      { nome: "ckmb", valor: "32 ng/mL", referencia: "<5 ng/mL" },
    ],
  };
  assert.equal(ex.resultado, "Elevados, compatíveis com necrose miocárdica");
  assert.equal(ex.itens?.length, 2);
});

test("9. interpretacao é opcional em ExameResultado", () => {
  const ex: ExameResultado = { nome: "Urina tipo 1", itens: [{ nome: "ph", valor: "6,0" }] };
  assert.equal(ex.interpretacao, undefined);
});

test("10. painel sem 'resultado' é válido quando possui 'itens'", () => {
  const ex: ExameResultado = { nome: "Coagulograma", itens: [{ nome: "inr", valor: "1,0" }] };
  assert.ok(!("resultado" in ex) || ex.resultado === undefined);
});

test("11. exame sem resultado e sem itens é rejeitado (verificado por tsc)", () => {
  // @ts-expect-error ExameResultado exige ao menos "resultado" ou "itens"
  const invalido: ExameResultado = { nome: "Exame incompleto" };
  assert.ok(invalido);
});

// ── 12–14. RubricaItem / ChecklistItem / ErroCritico ─────────────────────

test("12. RubricaItem aceita pontuacaoMaxima", () => {
  const r: RubricaItem = { criterio: "Diagnóstico", peso: 25, pontuacaoMaxima: 25 };
  assert.equal(r.pontuacaoMaxima, 25);
});

test("13. ChecklistItem aceita categoria", () => {
  const c: ChecklistItem = { item: "Caracterização da dor (OLDCARTS)", categoria: "Subjetivo" };
  assert.equal(c.categoria, "Subjetivo");
});

test("14. ErroCritico aceita evitavel", () => {
  const e: ErroCritico = { erro: "Não realizar ECG nos primeiros 10 minutos", penalidade: 2, evitavel: true };
  assert.equal(e.evitavel, true);
});

// ── 15–19. FeedbackModelo (detalhado + simples) ──────────────────────────

test("15. FeedbackModelo aceita escalaAvaliacao", () => {
  const f: FeedbackModelo = { ...feedbackSimplesValido(), escalaAvaliacao: { total: 20, minimoAprovacao: 17 } };
  assert.equal(f.escalaAvaliacao?.total, 20);
});

test("16. FeedbackModelo aceita dominiosPonderados", () => {
  const f: FeedbackModelo = {
    ...feedbackSimplesValido(),
    dominiosPonderados: [
      {
        nome: "Comunicação e postura",
        pontos: 2,
        criterios: [{ item: "Apresentou-se e confirmou o paciente", pontos: 0.5 }],
      },
    ],
  };
  assert.equal(f.dominiosPonderados?.[0].nome, "Comunicação e postura");
  assert.equal(f.dominiosPonderados?.[0].criterios[0].pontos, 0.5);
});

test("17. FeedbackModelo aceita penalidadesAutomaticas separadas de errosCriticos", () => {
  const f: FeedbackModelo = {
    ...feedbackSimplesValido(),
    penalidadesAutomaticas: [
      { condicao: "Dar alta sem reavaliação objetiva", penalidade: 3, justificativa: "Alta insegura expõe a risco." },
    ],
  };
  const examiner: Examiner = { ...examinerValido(), feedback: f, errosCriticos: [] };
  assert.equal(examiner.feedback.penalidadesAutomaticas?.length, 1);
  assert.equal(examiner.errosCriticos.length, 0, "penalidadesAutomaticas não deveria ser fundida em errosCriticos");
});

test("18. FeedbackModelo aceita modeloSoap estruturado", () => {
  const f: FeedbackModelo = {
    ...feedbackSimplesValido(),
    modeloSoap: {
      subjetivo: { componentesObrigatorios: ["Caracterização da dor (OLDCARTS)"] },
      objetivo: { componentesObrigatorios: ["Sinais vitais completos"] },
      avaliacao: { componentesObrigatorios: ["Diagnóstico principal"] },
      plano: { componentesObrigatorios: ["Terapia antitrombótica"] },
    },
  };
  assert.equal(f.modeloSoap?.subjetivo.componentesObrigatorios[0], "Caracterização da dor (OLDCARTS)");
});

test("19. feedback simples continua válido sem nenhum dos campos detalhados", () => {
  const f: FeedbackModelo = feedbackSimplesValido();
  assert.deepEqual(Object.keys(f).sort(), ["acertosEsperados", "errosComuns", "orientacoesPedagogicas"]);
});

// ── 20–22. Zona do Paciente permanece intocada ───────────────────────────

test("20. PatientZoneInput continua sem campos reservados", () => {
  const zi: PatientZoneInput = {
    patientKnowledge: patientKnowledgeValido(),
    disclosurePolicy: disclosurePolicyValida(),
    persona: personaValida(),
    sessionStateInicial: sessionStateValido(),
    // @ts-expect-error PatientZoneInput não declara clinicalTruth
    clinicalTruth: {},
  };
  assert.ok(zi);
});

test("21. PatientSafeContext continua sem metadata", () => {
  const ctx: PatientSafeContext = {
    patientKnowledge: patientKnowledgeValido(),
    disclosurePolicy: disclosurePolicyValida(),
    persona: personaValida(),
    sessionStateInicial: sessionStateValido(),
    // @ts-expect-error PatientSafeContext não declara metadata
    metadata: {},
  };
  assert.ok(ctx);
});

test("22. CasoV3 continua exigindo clinicalTruth e examiner", () => {
  // @ts-expect-error CasoV3 exige clinicalTruth (ausente aqui)
  const semClinicalTruth: CasoV3 = {
    schemaVersion: "3.2",
    metadata: metadataValida(),
    patientKnowledge: patientKnowledgeValido(),
    disclosurePolicy: disclosurePolicyValida(),
    persona: personaValida(),
    sessionStateInicial: sessionStateValido(),
    examiner: examinerValido(),
  };

  // @ts-expect-error CasoV3 exige examiner (ausente aqui)
  const semExaminer: CasoV3 = {
    schemaVersion: "3.2",
    metadata: metadataValida(),
    clinicalTruth: clinicalTruthValido(),
    patientKnowledge: patientKnowledgeValido(),
    disclosurePolicy: disclosurePolicyValida(),
    persona: personaValida(),
    sessionStateInicial: sessionStateValido(),
  };

  assert.ok(semClinicalTruth && semExaminer);
});
