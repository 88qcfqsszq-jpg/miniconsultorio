/**
 * Testes determinísticos do Prompt Base do Paciente (FASE 1) — sem LLM, sem rede.
 *
 * Runner: npx tsx --test lib/patient-v3/__tests__/promptBasePaciente.test.mts
 *
 * A garantia estrutural principal NÃO é a busca textual: é o Builder por
 * whitelist + a assinatura do Prompt Base (só recebe PatientSafeContext). As
 * asserções abaixo são semânticas e pontuais (sem snapshot gigante).
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { construirPatientSafeContext } from "@/lib/patient-v3/patientContextBuilder";
import { construirPromptBasePaciente } from "@/lib/patient-v3/promptBasePaciente";
import type { PatientZoneInput } from "@/lib/patient-v3/casoV3.types";

function zoneInputValido(): PatientZoneInput {
  return {
    patientKnowledge: {
      identidade: { nome: "Carlos", idade: 52, sexo: "M" },
      interlocutor: "paciente",
      fatos: [
        { id: "f_dor", dominio: "sintoma", valor: "dor no centro do peito" },
        { id: "f_tempo", dominio: "historiaAtual", valor: "começou há cerca de 2 horas" },
        { id: "f_dose", dominio: "medicamento", valor: "Losartana 50 mg", incerto: true },
        { id: "f_sem_regra", dominio: "habito", valor: "não pratica atividade física" },
      ],
    },
    disclosurePolicy: {
      aberturaFactIds: ["f_dor", "f_tempo"],
      regras: [
        { factId: "f_dor", politica: "espontanea" },
        { factId: "f_tempo", politica: "perguntaAberta" },
        { factId: "f_dose", politica: "sensivel" },
        // f_sem_regra intencionalmente sem regra → convenção perguntaDireta
      ],
    },
    persona: { expansividade: 4, objetividade: 6, letramentoSaude: "medio" },
    sessionStateInicial: { ansiedade: 7, medo: 6, confianca: 4, cooperacao: 8, frustracao: 2 },
  };
}

function promptValido(): string {
  return construirPromptBasePaciente(construirPatientSafeContext(zoneInputValido()));
}

// ── 1. Determinismo ──────────────────────────────────────────────────────────
test("1. a mesma entrada produz exatamente a mesma string", () => {
  assert.equal(promptValido(), promptValido());
});

// ── 2. Identidade correta aparece ────────────────────────────────────────────
test("2. identidade correta aparece", () => {
  const p = promptValido();
  assert.ok(p.includes("Carlos"));
  assert.ok(p.includes("52 anos"));
});

// ── 3. Interlocutor correto aparece ──────────────────────────────────────────
test("3. interlocutor 'paciente' → primeira pessoa; 'responsavel' → acompanhante", () => {
  const pPaciente = promptValido();
  assert.ok(pPaciente.includes("primeira pessoa"));

  const zi = zoneInputValido();
  zi.patientKnowledge.interlocutor = "responsavel";
  zi.patientKnowledge.responsavel = { nome: "Ana", parentesco: "esposa" };
  const pResp = construirPromptBasePaciente(construirPatientSafeContext(zi));
  assert.ok(pResp.includes("acompanhante"));
  assert.ok(pResp.includes("Ana"));
});

// ── 4. Persona operacional ───────────────────────────────────────────────────
test("4. Persona aparece de forma operacional", () => {
  const p = promptValido();
  assert.ok(p.includes("Expansividade: 4/10"));
  assert.ok(p.includes("Objetividade: 6/10"));
  assert.ok(p.includes("Letramento em saúde: medio"));
});

// ── 5. SessionStateInicial operacional ───────────────────────────────────────
test("5. SessionStateInicial aparece de forma operacional", () => {
  const p = promptValido();
  assert.ok(p.includes("Ansiedade 7"));
  assert.ok(p.includes("Medo 6"));
  assert.ok(p.includes("Cooperação 8"));
});

// ── 6. Fatos sem transformação em frases decoradas ───────────────────────────
test("6. fatos aparecem como dado neutro (sem frase decorada em 1ª pessoa)", () => {
  const p = promptValido();
  assert.ok(p.includes("dor no centro do peito"));
  assert.ok(p.includes("Losartana 50 mg"));
  // não deve ter reescrito o dado em uma fala pronta:
  assert.ok(!p.includes("Eu sinto uma dor no centro do peito"));
});

// ── 7. aberturaFactIds na ordem correta ──────────────────────────────────────
test("7. aberturaFactIds é representada na ordem correta", () => {
  const p = promptValido();
  assert.ok(p.indexOf("[f_dor]") < p.indexOf("[f_tempo]"));
  assert.ok(p.includes("1. [f_dor]"));
  assert.ok(p.includes("2. [f_tempo]"));
});

// ── 8. As quatro políticas recebem orientação operacional ────────────────────
test("8. as quatro políticas recebem orientação operacional", () => {
  const p = promptValido();
  assert.ok(p.includes("espontânea"));
  assert.ok(p.includes("pergunta aberta"));
  assert.ok(p.includes("pergunta direta"));
  assert.ok(p.includes("sensível"));
});

// ── 9. Fato incerto mantém indicação de incerteza ────────────────────────────
test("9. fato incerto mantém indicação de incerteza", () => {
  const p = promptValido();
  assert.ok(p.includes("incerteza"));
  assert.ok(p.includes("forma vaga"));
});

// ── 10. Fato sem regra recebe a convenção perguntaDireta ─────────────────────
test("10. fato sem regra explícita segue a convenção perguntaDireta", () => {
  const p = promptValido();
  const linha = p.split("\n").find((l) => l.includes("[f_sem_regra]"));
  assert.ok(linha, "linha do fato sem regra deveria existir");
  assert.ok(linha!.includes("perguntaDireta"), "fato sem regra deveria usar perguntaDireta");
});

// ── 11. Improvisação de forma, sem invenção clínica ──────────────────────────
test("11. prompt orienta improvisação de FORMA sem autorizar invenção clínica", () => {
  const p = promptValido();
  assert.ok(p.includes("improvise a FORMA"));
  assert.ok(p.includes("CONTEÚDO CLÍNICO"));
  assert.ok(p.includes("nova dose"), "deve listar invenções clínicas proibidas");
});

// ── 12. Sem instruções específicas de diagnóstico/especialidade ──────────────
test("12. prompt não contém diagnóstico específico nem especialidade", () => {
  const p = promptValido();
  assert.ok(!p.includes("IAMCSST"));
  assert.ok(!p.includes("infarto"));
  assert.ok(!p.includes("Cardiovascular"));
});

// ── 13. Campo reservado injetado antes do Builder não chega ao prompt ────────
test("13. clinicalTruth injetado antes do Builder não aparece no prompt", () => {
  const zi = {
    ...zoneInputValido(),
    clinicalTruth: { diagnosticoPrincipal: "SEGREDO_DIAGNOSTICO_XYZ" },
  } as unknown as PatientZoneInput;
  const p = construirPromptBasePaciente(construirPatientSafeContext(zi));
  assert.ok(!p.includes("SEGREDO_DIAGNOSTICO_XYZ"));
});

// ── 14. Ids internos não devem ser verbalizados ──────────────────────────────
test("14. ids internos são marcados como não verbalizáveis", () => {
  const p = promptValido();
  assert.ok(p.includes("internos"));
  assert.ok(p.includes("NUNCA os diga"));
});

// ── 15. Prompt pequeno e sem JSON bruto ──────────────────────────────────────
test("15. prompt permanece pequeno e não serializa JSON bruto do contexto", () => {
  const p = promptValido();
  assert.ok(!p.includes('"patientKnowledge"'));
  assert.ok(!p.includes('"fatos"'));
  assert.ok(!p.includes('{"'));
  assert.ok(p.length < 6000, `prompt maior que o esperado: ${p.length} chars`);
});
