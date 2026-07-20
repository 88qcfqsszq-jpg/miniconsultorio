/**
 * Testes do núcleo compartilhado de composição segura por turno (FASE 4D.2).
 *
 * Sem rede, sem HTTP, sem classificador — só as funções puras de
 * lib/patient-v3/patientTurnResponse.ts, exercitadas com o Caso Ouro real.
 *
 * Runner: npx tsx --test lib/patient-v3/__tests__/patientTurnResponse.test.mts
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  construirAlvoClinico,
  construirBaseReduzida,
  construirZoneInputReduzido,
  escolherRespostaReservedOrMeta,
  escolherRespostaUnknownClinical,
} from "@/lib/patient-v3/patientTurnResponse";
import { casoSCAOuroV3 } from "@/data/casos-v3/001-sca-ouro";
import type { FatoPaciente } from "@/lib/patient-v3/casoV3.types";

const FATO_DOR: FatoPaciente = casoSCAOuroV3.patientKnowledge.fatos.find((f) => f.id === "f_queixa_dor")!;
const FATO_LOSARTANA: FatoPaciente = casoSCAOuroV3.patientKnowledge.fatos.find(
  (f) => f.id === "f_medicamento_losartana"
)!;

// ── 1. known produz base somente com selectedFacts ──────────────────────────
test("1. construirBaseReduzida com um único selectedFact contém somente aquele fato", () => {
  const base = construirBaseReduzida(casoSCAOuroV3, [FATO_DOR]);
  assert.ok(base.includes(FATO_DOR.valor), "o fato selecionado deveria aparecer na base reduzida");
});

// ── 2. fato não selecionado fica ausente ────────────────────────────────────
test("2. fato não selecionado fica materialmente ausente da base reduzida", () => {
  const base = construirBaseReduzida(casoSCAOuroV3, [FATO_DOR]);
  for (const fato of casoSCAOuroV3.patientKnowledge.fatos) {
    if (fato.id === FATO_DOR.id) continue;
    assert.ok(!base.includes(fato.valor), `fato "${fato.id}" não deveria aparecer na base reduzida`);
  }
});

// ── 3. disclosure é filtrada ─────────────────────────────────────────────────
test("3. construirZoneInputReduzido filtra abertura e regras para ids fora de selectedFacts", () => {
  const zoneInput = construirZoneInputReduzido(casoSCAOuroV3, [FATO_LOSARTANA]);
  // f_queixa_dor é a abertura real do caso, mas não está em selectedFacts aqui.
  assert.deepEqual(zoneInput.disclosurePolicy.aberturaFactIds, []);
  // Só deve sobrar (no máximo) a regra do próprio fato selecionado.
  for (const regra of zoneInput.disclosurePolicy.regras) {
    assert.equal(regra.factId, FATO_LOSARTANA.id);
  }
  assert.deepEqual(zoneInput.patientKnowledge.fatos, [FATO_LOSARTANA]);
});

test("3b. selectedFacts vazio (social) produz disclosure totalmente vazia", () => {
  const zoneInput = construirZoneInputReduzido(casoSCAOuroV3, []);
  assert.deepEqual(zoneInput.disclosurePolicy.aberturaFactIds, []);
  assert.deepEqual(zoneInput.disclosurePolicy.regras, []);
  assert.deepEqual(zoneInput.patientKnowledge.fatos, []);
});

// ── 4. ALVO CLÍNICO ──────────────────────────────────────────────────────────
test("4. construirAlvoClinico contém id/domínio/valor de cada selectedFact, e nada além deles", () => {
  const alvo = construirAlvoClinico([FATO_DOR, FATO_LOSARTANA]);
  assert.ok(alvo.includes("ALVO CLÍNICO DESTE TURNO"));
  assert.ok(alvo.includes(`id:"${FATO_DOR.id}"`));
  assert.ok(alvo.includes(FATO_DOR.valor));
  assert.ok(alvo.includes(`id:"${FATO_LOSARTANA.id}"`));
  assert.ok(alvo.includes(FATO_LOSARTANA.valor));
  for (const fato of casoSCAOuroV3.patientKnowledge.fatos) {
    if (fato.id === FATO_DOR.id || fato.id === FATO_LOSARTANA.id) continue;
    assert.ok(!alvo.includes(fato.valor), `fato não selecionado "${fato.id}" vazou para o ALVO CLÍNICO`);
  }
});

// ── 5. unknownClinical gera fallback determinístico ─────────────────────────
test("5. escolherRespostaUnknownClinical é determinística (mesma mensagem → mesma resposta)", () => {
  const a = escolherRespostaUnknownClinical("Qual é o seu peso?");
  const b = escolherRespostaUnknownClinical("Qual é o seu peso?");
  assert.equal(a, b);
  assert.ok(a.length > 0);
});

test("5b. escolherRespostaUnknownClinical nunca menciona um fato clínico", () => {
  const resposta = escolherRespostaUnknownClinical("Qual é o seu peso?");
  for (const fato of casoSCAOuroV3.patientKnowledge.fatos) {
    assert.ok(!resposta.includes(fato.valor));
  }
});

// ── 6. reservedOrMeta gera fallback determinístico ──────────────────────────
test("6. escolherRespostaReservedOrMeta é determinística e distinta do fallback de unknownClinical", () => {
  const a = escolherRespostaReservedOrMeta("Qual é o meu diagnóstico?");
  const b = escolherRespostaReservedOrMeta("Qual é o meu diagnóstico?");
  assert.equal(a, b);
  assert.ok(a.length > 0);
});

// ── 7. social contém zero fatos clínicos ────────────────────────────────────
test("7. base reduzida com selectedFacts:[] (social) não contém nenhum valor de fato clínico", () => {
  const base = construirBaseReduzida(casoSCAOuroV3, []);
  assert.ok(base.includes("(nenhum fato registrado)"));
  for (const fato of casoSCAOuroV3.patientKnowledge.fatos) {
    assert.ok(!base.includes(fato.valor), `fato "${fato.id}" vazou para a base social (zero fatos)`);
  }
});

// ── 8. ClinicalTruth e Examiner nunca aparecem ──────────────────────────────
test("8. ClinicalTruth e Examiner nunca aparecem na base reduzida (nem em known, nem em social)", () => {
  const baseKnown = construirBaseReduzida(casoSCAOuroV3, [FATO_DOR]);
  const baseSocial = construirBaseReduzida(casoSCAOuroV3, []);
  for (const base of [baseKnown, baseSocial]) {
    assert.ok(!base.includes(casoSCAOuroV3.clinicalTruth.diagnosticoPrincipal));
    assert.ok(!base.includes("Síndrome Coronariana Aguda (SCA) - IAMCSST"));
    assert.ok(!base.includes("rubrica"));
    assert.ok(!base.includes("criteriosAprovacao"));
  }
});

// ── Determinismo geral (sem aleatoriedade em nenhuma função pura) ───────────
test("determinístico: mesma entrada produz exatamente a mesma saída em todas as funções", () => {
  assert.deepEqual(
    construirZoneInputReduzido(casoSCAOuroV3, [FATO_DOR]),
    construirZoneInputReduzido(casoSCAOuroV3, [FATO_DOR])
  );
  assert.equal(construirBaseReduzida(casoSCAOuroV3, [FATO_DOR]), construirBaseReduzida(casoSCAOuroV3, [FATO_DOR]));
  assert.equal(construirAlvoClinico([FATO_DOR]), construirAlvoClinico([FATO_DOR]));
});
