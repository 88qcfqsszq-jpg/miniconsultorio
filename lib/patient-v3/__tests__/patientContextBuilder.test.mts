/**
 * Testes determinísticos do Patient Context Builder (FASE 1) — sem LLM, sem rede.
 *
 * Runner: npx tsx --test lib/patient-v3/__tests__/patientContextBuilder.test.mts
 *
 * A garantia estrutural principal é a projeção por whitelist: propriedades extras
 * (inclusive clinicalTruth/examiner injetados via cast) nunca atravessam a
 * fronteira. Casts controlados (`as ...`) são usados EXCLUSIVAMENTE nos testes
 * para simular objetos inválidos/ampliados em runtime; os tipos de produção não
 * são afrouxados.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { construirPatientSafeContext } from "@/lib/patient-v3/patientContextBuilder";
import type {
  PatientZoneInput,
  CasoV3,
  PatientSafeContext,
} from "@/lib/patient-v3/casoV3.types";

// ── Fábrica de um PatientZoneInput válido (novo objeto a cada chamada) ────────
function zoneInputValido(): PatientZoneInput {
  return {
    patientKnowledge: {
      identidade: { nome: "Carlos", idade: 52, sexo: "M" },
      interlocutor: "paciente",
      fatos: [
        { id: "f_dor", dominio: "sintoma", valor: "dor no centro do peito" },
        { id: "f_tempo", dominio: "historiaAtual", valor: "começou há cerca de 2 horas" },
        { id: "f_dose", dominio: "medicamento", valor: "Losartana 50 mg", incerto: true },
      ],
    },
    disclosurePolicy: {
      aberturaFactIds: ["f_dor", "f_tempo"],
      regras: [
        { factId: "f_dor", politica: "espontanea" },
        { factId: "f_tempo", politica: "perguntaAberta" },
      ],
    },
    persona: { expansividade: 4, objetividade: 6, letramentoSaude: "medio" },
    sessionStateInicial: { ansiedade: 7, medo: 6, confianca: 4, cooperacao: 8, frustracao: 2 },
  };
}

// ── 1. Entrada válida produz PatientSafeContext válido ───────────────────────
test("1. entrada válida produz PatientSafeContext com as quatro seções", () => {
  const ctx = construirPatientSafeContext(zoneInputValido());
  assert.deepEqual(Object.keys(ctx).sort(), [
    "disclosurePolicy",
    "patientKnowledge",
    "persona",
    "sessionStateInicial",
  ]);
  assert.equal(ctx.patientKnowledge.identidade.nome, "Carlos");
  assert.equal(ctx.patientKnowledge.fatos.length, 3);
});

// ── 2. Ordem dos fatos preservada ────────────────────────────────────────────
test("2. ordem dos fatos é preservada", () => {
  const ctx = construirPatientSafeContext(zoneInputValido());
  assert.deepEqual(ctx.patientKnowledge.fatos.map((f) => f.id), ["f_dor", "f_tempo", "f_dose"]);
});

// ── 3. Ordem de aberturaFactIds preservada ───────────────────────────────────
test("3. ordem de aberturaFactIds é preservada", () => {
  const ctx = construirPatientSafeContext(zoneInputValido());
  assert.deepEqual(ctx.disclosurePolicy.aberturaFactIds, ["f_dor", "f_tempo"]);
});

// ── 4. Ordem das regras preservada ───────────────────────────────────────────
test("4. ordem das regras é preservada", () => {
  const ctx = construirPatientSafeContext(zoneInputValido());
  assert.deepEqual(ctx.disclosurePolicy.regras.map((r) => r.factId), ["f_dor", "f_tempo"]);
});

// ── 5. Input original não é mutado ───────────────────────────────────────────
test("5. o input original não é alterado (sem mutação, sem referência compartilhada)", () => {
  const input = zoneInputValido();
  const copiaProfunda = JSON.parse(JSON.stringify(input));
  const ctx = construirPatientSafeContext(input);
  assert.deepEqual(input, copiaProfunda, "o input não deveria ter sido mutado");
  assert.notEqual(ctx.patientKnowledge.fatos, input.patientKnowledge.fatos, "array de fatos deveria ser novo");
  assert.notEqual(ctx.patientKnowledge.fatos[0], input.patientKnowledge.fatos[0], "cada fato deveria ser novo");
  assert.notEqual(ctx.disclosurePolicy.regras[0], input.disclosurePolicy.regras[0], "cada regra deveria ser nova");
  assert.notEqual(ctx.persona, input.persona, "persona deveria ser nova");
  assert.notEqual(ctx.sessionStateInicial, input.sessionStateInicial, "sessionStateInicial deveria ser novo");
});

// ── 6. Campos adicionais de topo são descartados ─────────────────────────────
test("6. campos adicionais de topo são descartados", () => {
  const input = { ...zoneInputValido(), campoExtra: "não deveria passar" } as unknown as PatientZoneInput;
  const ctx = construirPatientSafeContext(input);
  assert.ok(!("campoExtra" in ctx));
});

// ── 7. clinicalTruth injetado é descartado ───────────────────────────────────
test("7. clinicalTruth injetado artificialmente é descartado", () => {
  const input = {
    ...zoneInputValido(),
    clinicalTruth: { diagnosticoPrincipal: "IAMCSST_SEGREDO" },
  } as unknown as PatientZoneInput;
  const ctx = construirPatientSafeContext(input);
  assert.ok(!("clinicalTruth" in ctx));
  assert.ok(!JSON.stringify(ctx).includes("IAMCSST_SEGREDO"), "diagnóstico não deveria vazar no contexto");
});

// ── 8. examiner injetado é descartado ────────────────────────────────────────
test("8. examiner injetado artificialmente é descartado", () => {
  const input = {
    ...zoneInputValido(),
    examiner: { rubricas: [{ criterio: "RUBRICA_SEGREDO", peso: 1 }] },
  } as unknown as PatientZoneInput;
  const ctx = construirPatientSafeContext(input);
  assert.ok(!("examiner" in ctx));
  assert.ok(!JSON.stringify(ctx).includes("RUBRICA_SEGREDO"), "rubrica não deveria vazar no contexto");
});

// ── 9. Campos adicionais dentro de identidade são descartados ────────────────
test("9. campos adicionais dentro de identidade são descartados", () => {
  const base = zoneInputValido();
  (base.patientKnowledge.identidade as unknown as Record<string, unknown>).cpf = "000.000.000-00";
  const ctx = construirPatientSafeContext(base);
  assert.deepEqual(Object.keys(ctx.patientKnowledge.identidade).sort(), ["idade", "nome", "sexo"]);
});

// ── 10. Campos adicionais dentro de fatos são descartados ────────────────────
test("10. campos adicionais dentro de um fato são descartados", () => {
  const base = zoneInputValido();
  (base.patientKnowledge.fatos[0] as unknown as Record<string, unknown>).origemInterna = "vazamento";
  const ctx = construirPatientSafeContext(base);
  assert.deepEqual(Object.keys(ctx.patientKnowledge.fatos[0]).sort(), ["dominio", "id", "valor"]);
});

// ── 11. factId duplicado gera erro ───────────────────────────────────────────
test("11. FatoPaciente.id duplicado gera erro", () => {
  const base = zoneInputValido();
  base.patientKnowledge.fatos.push({ id: "f_dor", dominio: "sintoma", valor: "repetido" });
  assert.throws(() => construirPatientSafeContext(base), /id duplicado: "f_dor"/);
});

// ── 12. regra referenciando fato inexistente gera erro ───────────────────────
test("12. regra referenciando factId inexistente gera erro", () => {
  const base = zoneInputValido();
  base.disclosurePolicy.regras.push({ factId: "f_inexistente", politica: "perguntaDireta" });
  assert.throws(() => construirPatientSafeContext(base), /factId inexistente: "f_inexistente"/);
});

// ── 13. duas regras para o mesmo factId geram erro ───────────────────────────
test("13. duas regras para o mesmo factId geram erro", () => {
  const base = zoneInputValido();
  base.disclosurePolicy.regras.push({ factId: "f_dor", politica: "perguntaDireta" });
  assert.throws(() => construirPatientSafeContext(base), /Mais de uma RegraRevelacao para o mesmo factId: "f_dor"/);
});

// ── 14. abertura referenciando fato inexistente gera erro ────────────────────
test("14. aberturaFactIds referenciando factId inexistente gera erro", () => {
  const base = zoneInputValido();
  base.disclosurePolicy.aberturaFactIds.push("f_fantasma");
  assert.throws(() => construirPatientSafeContext(base), /aberturaFactIds referencia factId inexistente: "f_fantasma"/);
});

// ── 15. aberturaFactId duplicado gera erro ───────────────────────────────────
test("15. aberturaFactId duplicado gera erro", () => {
  const base = zoneInputValido();
  base.disclosurePolicy.aberturaFactIds.push("f_dor");
  assert.throws(() => construirPatientSafeContext(base), /aberturaFactIds contém id duplicado: "f_dor"/);
});

// ── 16. política inválida em runtime gera erro ───────────────────────────────
test("16. PoliticaRevelacao inválida (runtime) gera erro", () => {
  const base = zoneInputValido();
  (base.disclosurePolicy.regras[0] as unknown as Record<string, unknown>).politica = "aposEmpatia";
  assert.throws(() => construirPatientSafeContext(base), /PoliticaRevelacao inválida/);
});

// ── 17. domínio inválido em runtime gera erro ────────────────────────────────
test("17. DominioFato inválido (runtime) gera erro", () => {
  const base = zoneInputValido();
  (base.patientKnowledge.fatos[0] as unknown as Record<string, unknown>).dominio = "exameLaboratorial";
  assert.throws(() => construirPatientSafeContext(base), /DominioFato inválido/);
});

// ── 18. dimensões fora de 0–10 geram erro ────────────────────────────────────
test("18. dimensão de Persona/SessionState fora de 0–10 gera erro", () => {
  const base1 = zoneInputValido();
  base1.persona.expansividade = 11;
  assert.throws(() => construirPatientSafeContext(base1), /persona\.expansividade/);

  const base2 = zoneInputValido();
  base2.sessionStateInicial.medo = -1;
  assert.throws(() => construirPatientSafeContext(base2), /sessionStateInicial\.medo/);
});

// ── 19. NaN e Infinity geram erro ────────────────────────────────────────────
test("19. NaN e Infinity em dimensões geram erro", () => {
  const baseNaN = zoneInputValido();
  baseNaN.persona.objetividade = Number.NaN;
  assert.throws(() => construirPatientSafeContext(baseNaN), /persona\.objetividade/);

  const baseInf = zoneInputValido();
  baseInf.sessionStateInicial.ansiedade = Number.POSITIVE_INFINITY;
  assert.throws(() => construirPatientSafeContext(baseInf), /sessionStateInicial\.ansiedade/);
});

// ── 20. interlocutor responsavel sem responsavel gera erro ───────────────────
test("20. interlocutor 'responsavel' sem objeto responsavel gera erro", () => {
  const base = zoneInputValido();
  base.patientKnowledge.interlocutor = "responsavel";
  // responsavel ausente de propósito
  assert.throws(() => construirPatientSafeContext(base), /interlocutor "responsavel" exige o objeto responsavel/);
});

// ── 21. interlocutor paciente funciona com ou sem responsavel ────────────────
test("21. interlocutor 'paciente' funciona com e sem responsavel", () => {
  const semResp = zoneInputValido();
  const ctxSem = construirPatientSafeContext(semResp);
  assert.equal(ctxSem.patientKnowledge.interlocutor, "paciente");
  assert.ok(!("responsavel" in ctxSem.patientKnowledge));

  const comResp = zoneInputValido();
  comResp.patientKnowledge.responsavel = { nome: "Ana", parentesco: "esposa" };
  const ctxCom = construirPatientSafeContext(comResp);
  assert.equal(ctxCom.patientKnowledge.interlocutor, "paciente");
  assert.deepEqual(ctxCom.patientKnowledge.responsavel, { nome: "Ana", parentesco: "esposa" });
});

// ── Verificações de tipo (validadas por tsc --noEmit; no-op em runtime) ──────
test("tipo: contrato de zonas (verificado por tsc, no-op em runtime)", () => {
  const pk = zoneInputValido().patientKnowledge;
  const dp = zoneInputValido().disclosurePolicy;
  const persona = zoneInputValido().persona;
  const sessionStateInicial = zoneInputValido().sessionStateInicial;

  const zi: PatientZoneInput = {
    patientKnowledge: pk,
    disclosurePolicy: dp,
    persona,
    sessionStateInicial,
    // @ts-expect-error PatientZoneInput não declara clinicalTruth
    clinicalTruth: {},
  };

  const zi2: PatientZoneInput = {
    patientKnowledge: pk,
    disclosurePolicy: dp,
    persona,
    sessionStateInicial,
    // @ts-expect-error PatientZoneInput não declara examiner
    examiner: {},
  };

  const ctx: PatientSafeContext = {
    patientKnowledge: pk,
    disclosurePolicy: dp,
    persona,
    sessionStateInicial,
    // @ts-expect-error PatientSafeContext não declara metadata
    metadata: {},
  };

  // @ts-expect-error CasoV3 exige clinicalTruth (ausente aqui)
  const casoSemClinicalTruth: CasoV3 = {
    schemaVersion: "3.2",
    metadata: {
      id: "1",
      titulo: "t",
      especialidade: "e",
      nivel: "intermediario",
      tipoEstacao: "integrada",
      duracaoMinutos: 15,
      versaoCaso: "1",
    },
    patientKnowledge: pk,
    disclosurePolicy: dp,
    persona,
    sessionStateInicial,
    examiner: { rubricas: [], checklist: [], errosCriticos: [], feedback: { acertosEsperados: [], errosComuns: [], orientacoesPedagogicas: [] }, criteriosAprovacao: [] },
  };

  // @ts-expect-error CasoV3 exige examiner (ausente aqui)
  const casoSemExaminer: CasoV3 = {
    schemaVersion: "3.2",
    metadata: {
      id: "1",
      titulo: "t",
      especialidade: "e",
      nivel: "intermediario",
      tipoEstacao: "integrada",
      duracaoMinutos: 15,
      versaoCaso: "1",
    },
    clinicalTruth: {
      diagnosticoPrincipal: "d",
      diagnosticosDiferenciais: [],
      cronologiaVerdadeira: "c",
      exameFisicoVerdadeiro: { inspecao: "", palpacao: "", ausculta: "", percussao: "", observacoes: "" },
      sinaisVitais: { pressaoArterial: "", frequenciaCardiaca: 0, frequenciaRespiratoria: 0, temperatura: 0, saturacaoOxigenio: 0 },
      exames: [],
      evolucao: { seCondutaCorreta: "", seCondutaInadequadaOuAtrasada: "" },
      tratamentoCorreto: { imediata: [] },
    },
    patientKnowledge: pk,
    disclosurePolicy: dp,
    persona,
    sessionStateInicial,
  };

  assert.ok(zi && zi2 && ctx && casoSemClinicalTruth && casoSemExaminer);
});
