// ============================================================================
// Teste do Clinical NLP Enricher (isolado) — TB real + checagens de segurança
// Uso: npx tsx scripts/test-nlp-enrichment.ts
// ============================================================================

import * as fs from "fs";
import * as path from "path";
import { buildClinicalNlpEnrichment } from "../lib/nlp/clinical-nlp-enricher";
import { montarTextoAgregado } from "./nlp-shadow-utils";
import { TUBERCULOSE_REAL_ROBERTO_SANTOS } from "./fixtures/tuberculose-real-roberto-santos";

const DEVE_CONTER = ["trm_tb", "febre_vespertina_noturna", "contato_tb", "perda_peso", "tosse_cronica"];
const NAO_DEVE_CONTER = [
  "ripe", "mascara_etiqueta_respiratoria", "rx_torax", "baciloscopia_escarro",
  "cultura_escarro", "notificacao_vigilancia", "ausculta_pulmonar", "linfonodos",
];

// Teste de negação
const TEXTO_NEGACAO =
  "Perguntei se tinha falta de ar e ele negou. Nao tem dor no peito. Nao pediu rx.";

function main() {
  const f = TUBERCULOSE_REAL_ROBERTO_SANTOS;
  const texto = montarTextoAgregado({
    transcript: f.transcript,
    examesSolicitados: f.examesSolicitados,
    diagnosticoInformado: f.diagnosticoInformado,
    conduta: f.conduta,
  });

  const enr = buildClinicalNlpEnrichment({ text: texto, diagnosisKey: f.diagnosisKey });
  const ids = new Set(enr.detectedConcepts.map((c) => c.conceptId));

  const faltando = DEVE_CONTER.filter((c) => !ids.has(c));
  const intrusos = NAO_DEVE_CONTER.filter((c) => ids.has(c));

  // negação
  const negEnr = buildClinicalNlpEnrichment({ text: TEXTO_NEGACAO });
  const negIds = new Set(negEnr.detectedConcepts.map((c) => c.conceptId));
  const dispneiaNegada = !negIds.has("dispneia");
  const dorNegada = !negIds.has("dor_toracica");

  console.log("=== Enricher — TB real (Roberto Santos) ===");
  console.log("Conceitos detectados:", [...ids].join(", "));
  console.log("Deve conter — faltando:", faltando.length ? faltando.join(", ") : "(nenhum) ✅");
  console.log("Não deve conter — intrusos:", intrusos.length ? intrusos.join(", ") + " ❌" : "(nenhum) ✅");
  console.log("\n--- Bloco de enriquecimento gerado ---");
  console.log(enr.enrichmentText);
  console.log("\n=== Filtro de negação ===");
  console.log("'negou falta de ar' NÃO vira dispneia:", dispneiaNegada ? "✅" : "❌");
  console.log("'nao tem dor no peito' NÃO vira dor_toracica:", dorNegada ? "✅" : "❌");

  const ok = faltando.length === 0 && intrusos.length === 0 && dispneiaNegada && dorNegada;
  console.log("\nRESULTADO:", ok ? "✅ PASSOU" : "❌ FALHOU");

  const out = {
    geradoEm: new Date().toISOString(),
    tbReal: {
      detectados: [...ids],
      deveConterFaltando: faltando,
      naoDeveConterIntrusos: intrusos,
      enrichmentText: enr.enrichmentText,
    },
    negacao: { dispneiaNegada, dorNegada },
    passou: ok,
  };
  const docsDir = path.join(process.cwd(), "docs");
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  fs.writeFileSync(path.join(docsDir, "nlp-enrichment-test-results.json"), JSON.stringify(out, null, 2), "utf8");
  console.log("JSON salvo em docs/nlp-enrichment-test-results.json");
}

main();
