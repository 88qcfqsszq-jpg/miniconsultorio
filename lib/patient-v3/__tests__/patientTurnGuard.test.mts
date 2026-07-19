/**
 * Testes determinísticos do Patient Turn Guard V1 — validação (FASE 3.4C).
 *
 * Sem LLM, sem rede. Cobrem criarDecisaoAbertura (abertura, sempre lança em
 * violação) e validarSaidaClassificador (saída bruta → resultado fechado,
 * sempre cai em fallback fechado em violação — nunca lança, nunca retorna
 * todos os fatos).
 *
 * Runner: npx tsx --test lib/patient-v3/__tests__/patientTurnGuard.test.mts
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  criarDecisaoAbertura,
  validarSaidaClassificador,
  PatientTurnOpeningValidationError,
} from "@/lib/patient-v3/patientTurnGuard";
import type { FatoPaciente } from "@/lib/patient-v3/casoV3.types";
import type { PatientTurnClassifierOutput } from "@/lib/patient-v3/patientTurnGuard.types";

const FATOS: FatoPaciente[] = [
  { id: "f1", dominio: "sintoma", valor: "valor 1" },
  { id: "f2", dominio: "sintoma", valor: "valor 2" },
  { id: "f3", dominio: "medicamento", valor: "valor 3" },
  { id: "f4", dominio: "habito", valor: "valor 4" },
  { id: "f5", dominio: "habito", valor: "valor 5" },
  { id: "f6", dominio: "habito", valor: "valor 6" },
  { id: "f7", dominio: "preocupacao", valor: "valor 7" },
];

// ── ABERTURA ─────────────────────────────────────────────────────────────

test("1. abertura com um id válido", () => {
  const r = criarDecisaoAbertura({ openingFactIds: ["f1"], availableFacts: FATOS });
  assert.equal(r.decision.kind, "opening");
  assert.deepEqual(r.selectedFacts.map((f) => f.id), ["f1"]);
});

test("2. abertura com múltiplos ids", () => {
  const r = criarDecisaoAbertura({ openingFactIds: ["f1", "f2"], availableFacts: FATOS });
  assert.deepEqual(r.selectedFacts.map((f) => f.id), ["f1", "f2"]);
});

test("3. abertura preserva ordem (não a ordem de availableFacts)", () => {
  const r = criarDecisaoAbertura({ openingFactIds: ["f3", "f1"], availableFacts: FATOS });
  assert.deepEqual(r.selectedFacts.map((f) => f.id), ["f3", "f1"]);
});

test("4. abertura rejeita id inexistente (lança, nunca cai em fallback)", () => {
  assert.throws(
    () => criarDecisaoAbertura({ openingFactIds: ["f_nao_existe"], availableFacts: FATOS }),
    PatientTurnOpeningValidationError
  );
});

test("5. abertura rejeita duplicado (lança, nunca cai em fallback)", () => {
  assert.throws(
    () => criarDecisaoAbertura({ openingFactIds: ["f1", "f1"], availableFacts: FATOS }),
    PatientTurnOpeningValidationError
  );
});

// ── KNOWN ────────────────────────────────────────────────────────────────

test("6. known válido com um id", () => {
  const saida: PatientTurnClassifierOutput = { kind: "known", factIds: ["f1"] };
  const r = validarSaidaClassificador(saida, FATOS);
  assert.equal(r.decision.kind, "known");
  assert.deepEqual(r.selectedFacts.map((f) => f.id), ["f1"]);
});

test("7. known válido com múltiplos ids", () => {
  const saida: PatientTurnClassifierOutput = { kind: "known", factIds: ["f1", "f2", "f3"] };
  const r = validarSaidaClassificador(saida, FATOS);
  assert.deepEqual(r.selectedFacts.map((f) => f.id), ["f1", "f2", "f3"]);
});

test("8. known preserva ordem (não a ordem de availableFacts)", () => {
  const saida: PatientTurnClassifierOutput = { kind: "known", factIds: ["f3", "f1"] };
  const r = validarSaidaClassificador(saida, FATOS);
  assert.deepEqual(r.selectedFacts.map((f) => f.id), ["f3", "f1"]);
});

test("9. known vazio cai em fallback fechado", () => {
  const saida: PatientTurnClassifierOutput = { kind: "known", factIds: [] };
  const r = validarSaidaClassificador(saida, FATOS);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

test("10. known com id inexistente cai em fallback fechado", () => {
  const saida: PatientTurnClassifierOutput = { kind: "known", factIds: ["f1", "f_nao_existe"] };
  const r = validarSaidaClassificador(saida, FATOS);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

test("11. known com duplicado cai em fallback fechado", () => {
  const saida: PatientTurnClassifierOutput = { kind: "known", factIds: ["f1", "f1"] };
  const r = validarSaidaClassificador(saida, FATOS);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

test("12. known com mais de 6 ids cai em fallback fechado", () => {
  const saida: PatientTurnClassifierOutput = {
    kind: "known",
    factIds: ["f1", "f2", "f3", "f4", "f5", "f6", "f7"], // 7 ids, todos existentes
  };
  const r = validarSaidaClassificador(saida, FATOS);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

// ── CATEGORIAS FECHADAS ──────────────────────────────────────────────────

test("13. unknownClinical com [] é válido", () => {
  const saida: PatientTurnClassifierOutput = { kind: "unknownClinical", factIds: [] };
  const r = validarSaidaClassificador(saida, FATOS);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

test("14. reservedOrMeta com [] é válido", () => {
  const saida: PatientTurnClassifierOutput = { kind: "reservedOrMeta", factIds: [] };
  const r = validarSaidaClassificador(saida, FATOS);
  assert.equal(r.decision.kind, "reservedOrMeta");
  assert.equal(r.selectedFacts.length, 0);
});

test("15. social com [] é válido", () => {
  const saida: PatientTurnClassifierOutput = { kind: "social", factIds: [] };
  const r = validarSaidaClassificador(saida, FATOS);
  assert.equal(r.decision.kind, "social");
  assert.equal(r.selectedFacts.length, 0);
});

test("16. categoria fechada com ids cai em fallback fechado", () => {
  const saida: PatientTurnClassifierOutput = { kind: "social", factIds: ["f1"] };
  const r = validarSaidaClassificador(saida, FATOS);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

// ── KIND INVÁLIDO ────────────────────────────────────────────────────────

test("17. kind inválido cai em fallback fechado", () => {
  // Simula uma saída bruta de classificador real (ex.: JSON.parse de resposta
  // do modelo) que não respeita o contrato. `kind` é alargado para `string`
  // explicitamente (mesmo padrão já usado alhures no projeto para comparações
  // de tipo) ANTES do único cast para PatientTurnClassifierOutput — nunca via
  // "unknown"/cast duplo — para exercitar a defesa em runtime que os tipos,
  // por si só, não impedem num valor vindo de fora não confiável.
  const bruta: { kind: string; factIds: string[] } = { kind: "diagnostico", factIds: [] };
  const saidaInvalida = bruta as PatientTurnClassifierOutput;
  const r = validarSaidaClassificador(saidaInvalida, FATOS);
  assert.equal(r.decision.kind, "unknownClinical");
  assert.equal(r.selectedFacts.length, 0);
});

// ── GARANTIAS GERAIS ─────────────────────────────────────────────────────

test("18. nunca retorna todos os fatos disponíveis em falha", () => {
  const casosDeFalha: PatientTurnClassifierOutput[] = [
    { kind: "known", factIds: [] },
    { kind: "known", factIds: ["f_nao_existe"] },
    { kind: "known", factIds: ["f1", "f1"] },
    { kind: "known", factIds: ["f1", "f2", "f3", "f4", "f5", "f6", "f7"] },
    { kind: "social", factIds: ["f1"] },
  ];
  for (const saida of casosDeFalha) {
    const r = validarSaidaClassificador(saida, FATOS);
    assert.ok(r.selectedFacts.length < FATOS.length, `caso "${JSON.stringify(saida)}" não deveria vazar todos os fatos`);
    assert.equal(r.selectedFacts.length, 0);
  }
});

test("19. nunca altera availableFacts (função pura)", () => {
  const antes = JSON.stringify(FATOS);
  criarDecisaoAbertura({ openingFactIds: ["f1", "f2"], availableFacts: FATOS });
  validarSaidaClassificador({ kind: "known", factIds: ["f1"] }, FATOS);
  validarSaidaClassificador({ kind: "known", factIds: ["f_nao_existe"] }, FATOS);
  validarSaidaClassificador({ kind: "social", factIds: ["f1"] }, FATOS);
  assert.equal(JSON.stringify(FATOS), antes);
});

test("20. mesma entrada produz mesmo resultado (determinismo)", () => {
  const inputAbertura = { openingFactIds: ["f1", "f2"] as const, availableFacts: FATOS };
  const a = criarDecisaoAbertura(inputAbertura);
  const b = criarDecisaoAbertura(inputAbertura);
  assert.deepEqual(a, b);

  const saida: PatientTurnClassifierOutput = { kind: "known", factIds: ["f1", "f3"] };
  const c = validarSaidaClassificador(saida, FATOS);
  const d = validarSaidaClassificador(saida, FATOS);
  assert.deepEqual(c, d);
});
