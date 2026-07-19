/**
 * Testes determinísticos do wiring mínimo do Caso Ouro pelo núcleo Patient V3
 * (Fase 3) — sem LLM, sem rede. Cobrem o ÚNICO ponto compartilhado alterado
 * (construirInstrucoesBasePaciente, em lib/prompts.ts) e a paridade byte a
 * byte do caminho legado para um caso de controle não registrado em
 * data/casos-v3.
 *
 * A garantia principal NÃO é busca textual: é a extração explícita de
 * PatientZoneInput + Builder por whitelist + Prompt Base recebendo apenas
 * PatientSafeContext (provada pela igualdade entre o resultado do wiring e a
 * composição explícita no teste 2). As buscas textuais abaixo são auxiliares,
 * usando apenas strings reservadas específicas e exclusivas — nunca termos
 * genéricos como "infarto"/"pai"/"pressão", que aparecem legitimamente no
 * PatientKnowledge (ex.: história familiar).
 *
 * Runner: npx tsx --test lib/patient-v3/__tests__/wiringPacienteV3.test.mts
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { construirInstrucoesBasePaciente, criarPromptPaciente } from "@/lib/prompts";
import { construirInstrucoesRealtime } from "@/lib/voice/realtimeInstructions";
import { casosV2 } from "@/data/casos-v2";
import { casoSCAOuroV3 } from "@/data/casos-v3/001-sca-ouro";
import { obterCasoV3PorId } from "@/data/casos-v3";
import { construirPatientSafeContext } from "@/lib/patient-v3/patientContextBuilder";
import { construirPromptBasePaciente } from "@/lib/patient-v3/promptBasePaciente";
import type { PatientZoneInput } from "@/lib/patient-v3/casoV3.types";
import type { Caso } from "@/lib/types";

// ── Strings reservadas específicas e exclusivas (busca textual AUXILIAR) ────
const DIAGNOSTICO_RESERVADO = "Síndrome Coronariana Aguda (SCA) - IAMCSST";
const DIFERENCIAIS_RESERVADOS = ["Angina Instável", "Pericardite Aguda", "Embolia Pulmonar", "Dissecção de Aorta"];
const TRATAMENTO_EXCLUSIVO = "Aspirina 500mg VO";
const CRITERIO_APROVACAO_EXCLUSIVO = "Nota mínima de 17 em 20 pontos.";
const BLOCO_LEGADO = "DIAGNÓSTICO (NÃO REVELE)";

// ── 1. Localizar o Caso 1 legado pela fonte atual usada pelo app ────────────
const caso1Legado = casosV2.find((c: any) => c.id === "1") as unknown as Caso;
const caso18Legado = casosV2.find((c: any) => c.id === "18") as unknown as Caso;

test("1. o Caso 1 legado é localizável pela fonte atual (casosV2)", () => {
  assert.ok(caso1Legado);
  assert.equal((caso1Legado as any).id, "1");
});

// ── 2. Igualdade entre o wiring e a composição explícita (garantia principal) ─
test("2. construirInstrucoesBasePaciente(Caso 1) é IDÊNTICO à composição explícita PatientZoneInput→Builder→PromptBase", () => {
  const viaWiring = construirInstrucoesBasePaciente(caso1Legado);

  const patientZoneInput: PatientZoneInput = {
    patientKnowledge: casoSCAOuroV3.patientKnowledge,
    disclosurePolicy: casoSCAOuroV3.disclosurePolicy,
    persona: casoSCAOuroV3.persona,
    sessionStateInicial: casoSCAOuroV3.sessionStateInicial,
  };
  const viaComposicaoExplicita = construirPromptBasePaciente(construirPatientSafeContext(patientZoneInput));

  assert.equal(viaWiring, viaComposicaoExplicita);
});

// ── 3. String não vazia ──────────────────────────────────────────────────────
test("3. o resultado V3 é uma string não vazia", () => {
  const texto = construirInstrucoesBasePaciente(caso1Legado);
  assert.equal(typeof texto, "string");
  assert.ok(texto.length > 0);
});

// ── 4–8. Ausência de conteúdo reservado (Zona Reservada) ────────────────────
test("4. o resultado do Caso Ouro não contém o bloco legado 'DIAGNÓSTICO (NÃO REVELE)'", () => {
  const texto = construirInstrucoesBasePaciente(caso1Legado);
  assert.ok(!texto.includes(BLOCO_LEGADO));
});

test("5. o resultado do Caso Ouro não contém o diagnóstico principal reservado exato", () => {
  const texto = construirInstrucoesBasePaciente(caso1Legado);
  assert.ok(!texto.includes(DIAGNOSTICO_RESERVADO));
});

test("6. não contém os quatro diagnósticos diferenciais reservados", () => {
  const texto = construirInstrucoesBasePaciente(caso1Legado);
  for (const diferencial of DIFERENCIAIS_RESERVADOS) {
    assert.ok(!texto.includes(diferencial), `não deveria conter o diferencial reservado "${diferencial}"`);
  }
});

test("7. não contém textos exclusivos de tratamento correto", () => {
  const texto = construirInstrucoesBasePaciente(caso1Legado);
  assert.ok(!texto.includes(TRATAMENTO_EXCLUSIVO));
  assert.ok(!texto.includes("Cateterismo cardíaco"));
});

test("8. não contém rubricas, checklist ou critérios de aprovação", () => {
  const texto = construirInstrucoesBasePaciente(caso1Legado);
  assert.ok(!texto.includes(CRITERIO_APROVACAO_EXCLUSIVO));
  assert.ok(!texto.includes("Coleta de Dados Clínicos")); // critério de rubrica exclusivo
  assert.ok(!texto.includes("Cumprimentou o paciente e se apresentou")); // item de checklist exclusivo
});

// ── 9–11. Conteúdo legítimo da Zona do Paciente ─────────────────────────────
test("9. contém a identidade legítima do paciente", () => {
  const texto = construirInstrucoesBasePaciente(caso1Legado);
  assert.ok(texto.includes("Carlos Silva"));
  assert.ok(texto.includes("52"));
});

test("10. contém os 15 fatos legítimos do PatientKnowledge", () => {
  const texto = construirInstrucoesBasePaciente(caso1Legado);
  for (const fato of casoSCAOuroV3.patientKnowledge.fatos) {
    assert.ok(texto.includes(fato.valor), `deveria conter o valor do fato "${fato.id}"`);
  }
  assert.equal(casoSCAOuroV3.patientKnowledge.fatos.length, 15);
});

test("11. contém a abertura e as políticas de revelação", () => {
  const texto = construirInstrucoesBasePaciente(caso1Legado);
  assert.ok(texto.includes("ABERTURA"));
  assert.ok(texto.includes("POLÍTICAS DE REVELAÇÃO"));
});

// ── 12. criarPromptPaciente continua anexando histórico e mensagem ─────────
test("12. criarPromptPaciente para o Caso Ouro usa a base V3 e continua anexando histórico e nova mensagem", () => {
  const historico = [
    { tipo: "estudante" as const, conteudo: "O que trouxe o senhor aqui?" },
    { tipo: "paciente" as const, conteudo: "Dor no peito, doutor." },
  ];
  const prompt = criarPromptPaciente(caso1Legado, historico, "Há quanto tempo começou?");

  assert.ok(!prompt.includes(BLOCO_LEGADO), "deveria usar a base V3, sem o bloco legado");
  assert.ok(prompt.includes("HISTÓRICO DA CONVERSA"));
  assert.ok(prompt.includes("O que trouxe o senhor aqui?"));
  assert.ok(prompt.includes("NOVA MENSAGEM DO ESTUDANTE"));
  assert.ok(prompt.includes("Há quanto tempo começou?"));
  assert.equal(typeof prompt, "string");
});

// ── 13. construirInstrucoesRealtime usa a mesma base V3 ────────────────────
test("13. construirInstrucoesRealtime para o Caso Ouro usa a base V3 e acrescenta somente metadados de voz já existentes", () => {
  const resultado = construirInstrucoesRealtime(caso1Legado);

  assert.equal(typeof resultado.instructions, "string");
  assert.ok(!resultado.instructions.includes(BLOCO_LEGADO), "voz deveria herdar a base V3, sem o bloco legado");
  assert.ok(!resultado.instructions.includes(DIAGNOSTICO_RESERVADO));
  for (const diferencial of DIFERENCIAIS_RESERVADOS) {
    assert.ok(!resultado.instructions.includes(diferencial));
  }
  assert.ok(!resultado.instructions.includes(CRITERIO_APROVACAO_EXCLUSIVO));
  assert.ok(resultado.instructions.includes("METADADOS DE VOZ"), "metadados de voz próprios devem continuar presentes");
  assert.ok(resultado.voiceProfile, "voiceProfile continua sendo derivado normalmente");
});

// ── 14. Nenhum arquivo de voz precisou ser alterado (confirmação estática) ──
test("14. realtimeInstructions.ts continua delegando a construirInstrucoesBasePaciente sem alterações (nenhum arquivo de voz tocado)", async () => {
  const codigoFonte = await import("node:fs/promises").then((fs) =>
    fs.readFile(new URL("../../voice/realtimeInstructions.ts", import.meta.url), "utf8")
  );
  assert.ok(codigoFonte.includes("construirInstrucoesBasePaciente(caso)"));
  assert.ok(!codigoFonte.includes("casos-v3"), "realtimeInstructions.ts não deveria referenciar o registro V3 diretamente");
});

// ── 15. Caso não registrado continua no caminho legado ──────────────────────
test("15. um caso não registrado em data/casos-v3 continua no caminho legado", () => {
  const texto = construirInstrucoesBasePaciente(caso18Legado);
  assert.ok(texto.includes(BLOCO_LEGADO), "caso 18 (não registrado) deveria continuar usando o corpo legado");
});

// ── 16. Paridade byte a byte do caso de controle (hash capturado ANTES da edição) ─
const CONTROLE_COMPRIMENTO_ANTES = 10271;
const CONTROLE_SHA256_ANTES = "d222aacacab2ddc70881e6b0afa9e3d79da69621f5fb9701df0aee0642638a8d";

test("16. o caso legado de controle (Caso 18) mantém exatamente o hash e comprimento capturados antes da edição", () => {
  const texto = construirInstrucoesBasePaciente(caso18Legado);
  const hash = createHash("sha256").update(texto, "utf8").digest("hex");
  assert.equal(texto.length, CONTROLE_COMPRIMENTO_ANTES, "comprimento deveria ser byte a byte idêntico ao capturado antes da edição");
  assert.equal(hash, CONTROLE_SHA256_ANTES, "SHA-256 deveria ser byte a byte idêntico ao capturado antes da edição");
});

// ── 17. id desconhecido / sem correspondente V3 não aciona o núcleo V3 ─────
test("17. obterCasoV3PorId retorna null para id desconhecido, e o caso correspondente segue o caminho legado", () => {
  assert.equal(obterCasoV3PorId("id-que-nao-existe"), null);
  assert.equal(obterCasoV3PorId("999"), null);

  // Todo caso cujo id não resolve no registro V3 deve seguir o corpo legado —
  // confirmado indiretamente pelo teste 15 (Caso 18) e por qualquer outro
  // caso legado presente em casosV2 além do id "1".
  const outroCasoLegado = casosV2.find((c: any) => c.id === "19") as unknown as Caso;
  if (outroCasoLegado) {
    const texto = construirInstrucoesBasePaciente(outroCasoLegado);
    assert.ok(texto.includes(BLOCO_LEGADO));
  }
});

// ── 18. Nenhuma entrada reservada é passada ao Builder (prova por igualdade) ─
test("18. nenhuma entrada reservada atravessa a fronteira do Builder (mesma prova de igualdade do teste 2)", () => {
  // Se ClinicalTruth/Examiner tivessem sido passados ao Builder de alguma
  // forma no wiring, o resultado divergiria da composição que sabidamente
  // usa SOMENTE PatientZoneInput (Fase 2B) — a igualdade abaixo é a prova.
  const viaWiring = construirInstrucoesBasePaciente(caso1Legado);
  const patientZoneInput: PatientZoneInput = {
    patientKnowledge: casoSCAOuroV3.patientKnowledge,
    disclosurePolicy: casoSCAOuroV3.disclosurePolicy,
    persona: casoSCAOuroV3.persona,
    sessionStateInicial: casoSCAOuroV3.sessionStateInicial,
  };
  const viaComposicaoExplicitaSemZonaReservada = construirPromptBasePaciente(construirPatientSafeContext(patientZoneInput));
  assert.equal(viaWiring, viaComposicaoExplicitaSemZonaReservada);
});
