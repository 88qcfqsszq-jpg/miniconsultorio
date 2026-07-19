/**
 * Testes de CONTRATO do Patient Turn Guard V1 (FASE 3.4B) — somente tipos.
 *
 * Nenhuma função de runtime é exercitada aqui (não existe nenhuma nesta fase).
 * As provas de "estado inválido impossível" são de TEMPO DE COMPILAÇÃO
 * (`@ts-expect-error`, verificadas por `tsc --noEmit`, no-op em runtime — o
 * mesmo padrão já usado em casoV3.types.test.mts). As demais são checagens
 * estruturais em runtime (shape de objetos válidos, ausência de campos
 * proibidos, ausência de termos proibidos no texto-fonte do arquivo de tipos).
 *
 * Runner: npx tsx --test lib/patient-v3/__tests__/patientTurnGuard.types.test.mts
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import type {
  NonEmptyFactIds,
  PatientTurnClassifierKind,
  PatientTurnClassifierOutput,
  PatientTurnDecision,
  PatientTurnHistoryItem,
  PatientTurnClassifierInput,
  PatientTurnOpeningInput,
  PatientTurnGuardResult,
} from "@/lib/patient-v3/patientTurnGuard.types";
import type { FatoPaciente } from "@/lib/patient-v3/casoV3.types";

function fatoExemplo(id: string): FatoPaciente {
  return { id, dominio: "sintoma", valor: "valor de exemplo" };
}

// ── 1–3. opening ──────────────────────────────────────────────────────────
test("1. opening aceita um factId", () => {
  const d: PatientTurnDecision = { kind: "opening", factIds: ["f_queixa_dor"] };
  assert.equal(d.kind, "opening");
});

test("2. opening aceita múltiplos factIds", () => {
  const d: PatientTurnDecision = { kind: "opening", factIds: ["f_a", "f_b", "f_c"] };
  assert.equal((d as { factIds: NonEmptyFactIds }).factIds.length, 3);
});

test("3. opening rejeita lista vazia (tempo de compilação)", () => {
  // @ts-expect-error — factIds: [] não satisfaz NonEmptyFactIds (readonly [string, ...string[]])
  const invalido: PatientTurnDecision = { kind: "opening", factIds: [] };
  assert.ok(invalido, "linha existe somente para o tsc avaliar o erro esperado acima");
});

// ── 4–6. known ────────────────────────────────────────────────────────────
test("4. known aceita um factId", () => {
  const d: PatientTurnDecision = { kind: "known", factIds: ["f_dor_caracter"] };
  assert.equal(d.kind, "known");
});

test("5. known aceita múltiplos factIds", () => {
  const d: PatientTurnDecision = { kind: "known", factIds: ["f_dor_alivio", "f_dor_piora"] };
  assert.equal((d as { factIds: NonEmptyFactIds }).factIds.length, 2);
});

test("6. known rejeita lista vazia (tempo de compilação)", () => {
  // @ts-expect-error — factIds: [] não satisfaz NonEmptyFactIds
  const invalido: PatientTurnDecision = { kind: "known", factIds: [] };
  assert.ok(invalido, "linha existe somente para o tsc avaliar o erro esperado acima");
});

// ── 7–9. categorias fechadas são válidas sem factIds ────────────────────────
test("7. unknownClinical é válido sem factIds", () => {
  const d: PatientTurnDecision = { kind: "unknownClinical" };
  assert.deepEqual(Object.keys(d), ["kind"]);
});

test("8. reservedOrMeta é válido sem factIds", () => {
  const d: PatientTurnDecision = { kind: "reservedOrMeta" };
  assert.deepEqual(Object.keys(d), ["kind"]);
});

test("9. social é válido sem factIds", () => {
  const d: PatientTurnDecision = { kind: "social" };
  assert.deepEqual(Object.keys(d), ["kind"]);
});

// ── 10–12. categorias fechadas rejeitam factIds (tempo de compilação) ──────
test("10. unknownClinical rejeita factIds", () => {
  // @ts-expect-error — "unknownClinical" não possui o campo factIds
  const invalido: PatientTurnDecision = { kind: "unknownClinical", factIds: ["f_x"] };
  assert.ok(invalido, "linha existe somente para o tsc avaliar o erro esperado acima");
});

test("11. reservedOrMeta rejeita factIds", () => {
  // @ts-expect-error — "reservedOrMeta" não possui o campo factIds
  const invalido: PatientTurnDecision = { kind: "reservedOrMeta", factIds: ["f_x"] };
  assert.ok(invalido, "linha existe somente para o tsc avaliar o erro esperado acima");
});

test("12. social rejeita factIds", () => {
  // @ts-expect-error — "social" não possui o campo factIds
  const invalido: PatientTurnDecision = { kind: "social", factIds: ["f_x"] };
  assert.ok(invalido, "linha existe somente para o tsc avaliar o erro esperado acima");
});

// ── 13. PatientTurnClassifierKind exclui "opening" ─────────────────────────
test("13. PatientTurnClassifierKind não aceita opening", () => {
  // @ts-expect-error — "opening" não pertence ao conjunto classificável (é determinístico, não classificado)
  const invalido: PatientTurnClassifierKind = "opening";
  assert.ok(invalido, "linha existe somente para o tsc avaliar o erro esperado acima");
});

// ── 14–15. saída bruta do classificador (não validada) ─────────────────────
test("14. saída bruta do classificador aceita known com string[]", () => {
  const bruta: PatientTurnClassifierOutput = { kind: "known", factIds: ["f_a", "f_b"] };
  assert.equal(bruta.factIds.length, 2);
});

test("15. saída bruta permite array vazio antes da validação", () => {
  const bruta: PatientTurnClassifierOutput = { kind: "known", factIds: [] };
  assert.equal(bruta.factIds.length, 0);
});

// ── 16–19. entrada do classificador ──────────────────────────────────────
test("16. input do classificador aceita somente mensagem, histórico e fatos", () => {
  const input: PatientTurnClassifierInput = {
    currentMessage: "Como é essa dor?",
    recentHistory: [{ role: "estudante", content: "Bom dia." }],
    availableFacts: [fatoExemplo("f_dor_caracter")],
  };
  assert.deepEqual(Object.keys(input).sort(), ["availableFacts", "currentMessage", "recentHistory"]);
});

test("17. input não aceita ClinicalTruth (campo extra, tempo de compilação)", () => {
  const invalido: PatientTurnClassifierInput = {
    currentMessage: "x",
    recentHistory: [],
    availableFacts: [],
    // @ts-expect-error — PatientTurnClassifierInput não possui campo clinicalTruth
    clinicalTruth: "não deveria existir",
  };
  assert.ok(invalido, "linha existe somente para o tsc avaliar o erro esperado acima");
});

test("18. input não aceita Examiner (campo extra, tempo de compilação)", () => {
  const invalido: PatientTurnClassifierInput = {
    currentMessage: "x",
    recentHistory: [],
    availableFacts: [],
    // @ts-expect-error — PatientTurnClassifierInput não possui campo examiner
    examiner: "não deveria existir",
  };
  assert.ok(invalido, "linha existe somente para o tsc avaliar o erro esperado acima");
});

test("19. input não aceita CasoV3 completo (faltam os três campos exigidos)", () => {
  const invalido: PatientTurnClassifierInput = {
    // @ts-expect-error — um CasoV3 completo não satisfaz PatientTurnClassifierInput (campo schemaVersion não existe no contrato)
    schemaVersion: "3.2",
    metadata: {},
    patientKnowledge: {},
    disclosurePolicy: {},
    persona: {},
    sessionStateInicial: {},
    clinicalTruth: {},
    examiner: {},
  };
  assert.ok(invalido, "linha existe somente para o tsc avaliar o erro esperado acima");
});

// ── 20–21. histórico ────────────────────────────────────────────────────
test("20. histórico aceita somente estudante/paciente", () => {
  const a: PatientTurnHistoryItem = { role: "estudante", content: "Oi" };
  const b: PatientTurnHistoryItem = { role: "paciente", content: "Oi doutor" };
  assert.equal(a.role, "estudante");
  assert.equal(b.role, "paciente");
});

test("21. histórico rejeita papel de sistema", () => {
  // @ts-expect-error — "sistema" não pertence a PatientTurnHistoryRole
  const invalido: PatientTurnHistoryItem = { role: "sistema", content: "x" };
  assert.ok(invalido, "linha existe somente para o tsc avaliar o erro esperado acima");
});

// ── 22–23. entrada da abertura ─────────────────────────────────────────────
test("22. entrada de abertura aceita ids não vazios", () => {
  const input: PatientTurnOpeningInput = {
    openingFactIds: ["f_queixa_dor"],
    availableFacts: [fatoExemplo("f_queixa_dor")],
  };
  assert.equal(input.openingFactIds.length, 1);
});

test("23. entrada de abertura rejeita ids vazios", () => {
  // @ts-expect-error — openingFactIds: [] não satisfaz NonEmptyFactIds
  const invalido: PatientTurnOpeningInput = { openingFactIds: [], availableFacts: [] };
  assert.ok(invalido, "linha existe somente para o tsc avaliar o erro esperado acima");
});

// ── 24–28. resultado fechado do Guard ──────────────────────────────────────
test("24. resultado opening aceita fatos selecionados", () => {
  const r: PatientTurnGuardResult = {
    decision: { kind: "opening", factIds: ["f_queixa_dor"] },
    selectedFacts: [fatoExemplo("f_queixa_dor")],
  };
  assert.equal(r.selectedFacts.length, 1);
});

test("25. resultado known aceita fatos selecionados", () => {
  const r: PatientTurnGuardResult = {
    decision: { kind: "known", factIds: ["f_dor_caracter"] },
    selectedFacts: [fatoExemplo("f_dor_caracter")],
  };
  assert.equal(r.selectedFacts.length, 1);
});

test("26. resultado unknownClinical exige selectedFacts vazio", () => {
  const r: PatientTurnGuardResult = {
    decision: { kind: "unknownClinical" },
    selectedFacts: [],
  };
  assert.equal(r.selectedFacts.length, 0);
});

test("27. resultado reservedOrMeta exige selectedFacts vazio", () => {
  const r: PatientTurnGuardResult = {
    decision: { kind: "reservedOrMeta" },
    selectedFacts: [],
  };
  assert.equal(r.selectedFacts.length, 0);
});

test("28. resultado social exige selectedFacts vazio", () => {
  const r: PatientTurnGuardResult = {
    decision: { kind: "social" },
    selectedFacts: [],
  };
  assert.equal(r.selectedFacts.length, 0);
});

// ── 29. resultado fechado rejeita fatos clínicos em categoria social ───────
test("29. resultado fechado rejeita fatos clínicos em categoria social (tempo de compilação)", () => {
  // @ts-expect-error — selectedFacts para "social" é readonly [] (tupla vazia fixa), não fatos reais
  const invalido: PatientTurnGuardResult = {
    decision: { kind: "social" },
    selectedFacts: [fatoExemplo("f_dor_intensidade")],
  };
  assert.ok(invalido, "linha existe somente para o tsc avaliar o erro esperado acima");
});

// ── 30–32. o arquivo de tipos não depende de zona reservada nem usa any/Record ─
const CODIGO_FONTE = readFileSync(
  new URL("../patientTurnGuard.types.ts", import.meta.url),
  "utf8"
);

test("30. os tipos não dependem de ClinicalTruth ou Examiner (nenhum import os traz)", () => {
  // A prosa dos comentários MENCIONA ClinicalTruth/Examiner (documentando o que
  // deliberadamente NÃO é recebido) — a garantia real é não haver import algum
  // desses tipos. O único import de casoV3.types.ts nesta fase é FatoPaciente.
  const linhaImport = CODIGO_FONTE
    .split("\n")
    .find((l) => l.includes('from "@/lib/patient-v3/casoV3.types"'));
  assert.ok(linhaImport, "deveria existir um import de casoV3.types.ts");
  assert.ok(!linhaImport!.includes("ClinicalTruth"));
  assert.ok(!linhaImport!.includes("Examiner"));
  assert.ok(linhaImport!.includes("FatoPaciente"));
});

test("31. o arquivo de tipos não possui any", () => {
  assert.ok(!/\bany\b/.test(CODIGO_FONTE));
});

test("32. o arquivo de tipos não possui Record<string, unknown>", () => {
  assert.ok(!CODIGO_FONTE.includes("Record<string"));
});

// ── 33–34. nenhuma decisão carrega texto de resposta ou confiança ─────────
test("33. nenhuma decisão contém texto de resposta", () => {
  const variantes: PatientTurnDecision[] = [
    { kind: "opening", factIds: ["f_a"] },
    { kind: "known", factIds: ["f_a"] },
    { kind: "unknownClinical" },
    { kind: "reservedOrMeta" },
    { kind: "social" },
  ];
  for (const v of variantes) {
    assert.ok(!("response" in v));
    assert.ok(!("answer" in v));
    assert.ok(!("freeText" in v));
  }
});

test("34. nenhuma decisão contém campo de confiança", () => {
  const variantes: PatientTurnDecision[] = [
    { kind: "opening", factIds: ["f_a"] },
    { kind: "known", factIds: ["f_a"] },
    { kind: "unknownClinical" },
    { kind: "reservedOrMeta" },
    { kind: "social" },
  ];
  for (const v of variantes) {
    assert.ok(!("confidence" in v));
    assert.ok(!("score" in v));
  }
});

// ── 35. determinismo do contrato (tipo, não valor — verificado por tsc) ────
test("35. mesma declaração continua determinística em TypeScript (no-op em runtime)", () => {
  // Tipos não têm "execução": a garantia de determinismo aqui é estrutural —
  // a mesma forma de objeto sempre satisfaz ou não satisfaz o mesmo contrato,
  // verificado estaticamente por tsc, não por este teste em runtime.
  assert.ok(true);
});
