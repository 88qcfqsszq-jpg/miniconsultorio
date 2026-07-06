// ============================================================================
// Auditoria de cobertura do Clinical NLP Pack (ISOLADO — não integra pipeline)
// ----------------------------------------------------------------------------
// 1) Roda os testes de detecção obrigatórios (TAREFA 22).
// 2) Mede cobertura: diagnósticos do banco com/sem pacote NLP.
// 3) Gera docs/clinical-nlp-coverage.json (consumido pelo relatório).
//
// Uso: npx tsx scripts/audit-clinical-nlp-coverage.ts
// ============================================================================

import * as fs from "fs";
import * as path from "path";
import { casosOSCE } from "../data/casos-osce";
import {
  CLINICAL_NLP_DICTIONARY,
} from "../lib/nlp/clinical-nlp-dictionary";
import { DIAGNOSIS_NLP_PACKS, getDiagnosisNlpPack } from "../lib/nlp/diagnosis-nlp-pack";
import {
  detectClinicalConcepts,
  detectDiagnosisConcepts,
} from "../lib/nlp/clinical-nlp-normalizer";

type TesteCaso = { frase: string; esperados: string[]; diagnosisKey?: string };

const TESTES: TesteCaso[] = [
  // Tuberculose
  { frase: "vou pedir o trm tb", esperados: ["trm_tb"], diagnosisKey: "tuberculose_pulmonar" },
  { frase: "tem febre a noite?", esperados: ["febre_vespertina_noturna"] },
  { frase: "meu irmao teve tuberculose", esperados: ["contato_tb"], diagnosisKey: "tuberculose_pulmonar" },
  { frase: "tosse ha mais de 3 semanas", esperados: ["tosse_cronica"] },
  { frase: "oriento a usar mascara", esperados: ["mascara_etiqueta_respiratoria"] },
  // IC
  { frase: "acordo sufocando de madrugada", esperados: ["dispneia_paroxistica_noturna"] },
  { frase: "durmo com tres travesseiros", esperados: ["ortopneia"] },
  { frase: "estou com as pernas inchadas", esperados: ["edema_membros_inferiores"] },
  { frase: "vou prescrever furosemida", esperados: ["diuretico_ic"] },
  // SCA
  { frase: "aperto no peito irradiando para braco esquerdo", esperados: ["dor_toracica_isquemica", "irradiacao"], diagnosisKey: "sca_iam" },
  { frase: "pedir um eletro", esperados: ["ecg"] },
  { frase: "solicito enzimas cardiacas", esperados: ["troponina"] },
  { frase: "dar aas agora", esperados: ["antiagregante_sca"] },
  // Pneumonia
  { frase: "tosse com catarro amarelado", esperados: ["expectoracao"], diagnosisKey: "pneumonia_pac" },
  { frase: "auscultei anterior e posterior", esperados: ["ausculta_anterior_posterior"] },
  { frase: "vou pedir um raio x do peito", esperados: ["rx_torax"] },
  // TEP
  { frase: "fez viagem longa e esta com a perna inchada", esperados: ["fatores_risco_tromboembolico", "tvp"], diagnosisKey: "tep" },
  { frase: "solicito angio tc", esperados: ["angio_tc_torax"] },
  // Anemia
  { frase: "olhos amarelos e urina escura", esperados: ["ictericia", "coluria"], diagnosisKey: "anemia_hemolitica" },
  { frase: "pedir coombs direto", esperados: ["coombs"] },
  // Dengue
  { frase: "dor atras dos olhos", esperados: ["dor_retroorbitaria"], diagnosisKey: "dengue" },
  { frase: "oriento nao tomar ibuprofeno", esperados: ["evitar_aine"], diagnosisKey: "dengue" },

  // ---- COMPLEMENTAR (17 casos) ----
  { frase: "febre prolongada e sopro no coracao", esperados: ["febre_prolongada", "sopro_cardiaco"] },
  { frase: "vou coletar hemoculturas e pedir eco transesofagico", esperados: ["hemoculturas", "ecocardiograma_transesofagico"] },
  { frase: "ritmo irregular e ruflar diastolico", esperados: ["fibrilacao_atrial", "estenose_mitral"] },
  { frase: "pa 180/120 com lesao de orgao alvo", esperados: ["pa_muito_elevada", "lesao_orgao_alvo"] },
  { frase: "panturrilha dolorosa e edema unilateral", esperados: ["dor_panturrilha", "edema_unilateral"] },
  { frase: "vou pedir doppler venoso", esperados: ["usg_doppler_venoso"] },
  { frase: "febre, ictericia e sangramento gengival", esperados: ["ictericia_hepatite", "sangramento_mucoso"], diagnosisKey: "febre_amarela" },
  { frase: "nao tomou vacina de febre amarela", esperados: ["vacina_febre_amarela"] },
  { frase: "zika com fraqueza ascendente nas pernas", esperados: ["sinais_neurologicos_gbs"] },
  { frase: "febre e dor intensa nas juntas", esperados: ["artralgia_intensa"], diagnosisKey: "chikungunya" },
  { frase: "dor ossea, anemia e lesoes liticas", esperados: ["dor_ossea", "anemia", "lesoes_liticas"] },
  { frase: "eletroforese de proteinas e mielograma", esperados: ["eletroforese_proteinas", "mielograma"] },
  { frase: "sangramento, plaquetas baixas e fibrinogenio baixo", esperados: ["sangramento_coagulopatia", "plaquetas", "tp_ttp_fibrinogenio"] },
  { frase: "hemartrose e fator viii baixo", esperados: ["hemartrose", "fator_viii"] },
  { frase: "talassemia maior com transfusoes regulares e quelacao de ferro", esperados: ["talassemia", "transfusao_regular", "quelacao_ferro"] },
  { frase: "pos operatorio com hipoventilacao e fisioterapia respiratoria", esperados: ["pos_operatorio", "hipoventilacao", "fisioterapia_respiratoria"] },
  { frase: "lactente chiando com tiragem e mamando menos", esperados: ["bronquiolite", "tiragem", "alimentacao_reduzida"] },
  { frase: "pa acima do percentil 95 para idade", esperados: ["pa_pediatrica_elevada"] },
  { frase: "marcos do desenvolvimento e vacinacao em dia", esperados: ["desenvolvimento_normal", "vacinacao"] },
  { frase: "secrecao nasal purulenta e piora apos melhora", esperados: ["secrecao_nasal_purulenta", "piora_apos_melhora"], diagnosisKey: "rinossinusite_bacteriana" },

  // ---- v3 (gaps de alias do Shadow Mode) ----
  { frase: "sudorese noturna", esperados: ["sudorese_noturna"] },
  { frase: "perdi peso", esperados: ["perda_peso"] },
  { frase: "perda de peso", esperados: ["perda_peso"] },
  { frase: "vou auscultar os pulmoes", esperados: ["ausculta_pulmonar"] },
  { frase: "peco um rx de torax", esperados: ["rx_torax"] },
  { frase: "fazer a investigacao dos contatos", esperados: ["investigar_contatos"] },
  { frase: "preciso fazer a notificacao", esperados: ["notificacao_vigilancia"] },
  { frase: "reforco a adesao ao ripe", esperados: ["adesao_tratamento"] },
  { frase: "monitorizo o paciente", esperados: ["monitorizacao"] },
  { frase: "paciente com tosse seca", esperados: ["tosse"] },
  { frase: "nao usar ibuprofeno", esperados: ["evitar_aine"] },
];

function rodarTestes() {
  const resultados = TESTES.map((t) => {
    const det = t.diagnosisKey
      ? detectDiagnosisConcepts(t.frase, t.diagnosisKey)
      : detectClinicalConcepts(t.frase);
    const ids = new Set(det.map((d) => d.conceptId));
    const faltando = t.esperados.filter((e) => !ids.has(e));
    return { ...t, detectados: [...ids], faltando, passou: faltando.length === 0 };
  });
  return resultados;
}

// Heurística para mapear caso → diagnosisKey de um pack
function mapearCasoParaPack(caso: any): string | null {
  const txt = `${caso?.titulo ?? ""} ${caso?.dados_ocultos_do_sistema?.diagnostico_principal ?? ""}`;
  const pack = getDiagnosisNlpPack(txt);
  return pack?.diagnosisKey ?? null;
}

function main() {
  const testes = rodarTestes();
  const testesOk = testes.filter((t) => t.passou).length;

  // cobertura de diagnósticos
  const cobertura = casosOSCE.map((c: any) => ({
    casoId: String(c.id),
    titulo: c.titulo,
    diagnostico: c?.dados_ocultos_do_sistema?.diagnostico_principal ?? "",
    packKey: mapearCasoParaPack(c),
  }));
  const semPack = cobertura.filter((c) => !c.packKey);
  const comPack = cobertura.filter((c) => c.packKey);

  const out = {
    geradoEm: new Date().toISOString(),
    totaisConceitosGlobais: CLINICAL_NLP_DICTIONARY.length,
    totalSinonimosGlobais: CLINICAL_NLP_DICTIONARY.reduce((a, c) => a + c.synonyms.length, 0),
    totalPacotesDiagnostico: DIAGNOSIS_NLP_PACKS.length,
    diagnosisKeys: DIAGNOSIS_NLP_PACKS.map((p) => p.diagnosisKey),
    casosNoBanco: casosOSCE.length,
    casosComPack: comPack.length,
    casosSemPack: semPack.length,
    testes: {
      total: testes.length,
      ok: testesOk,
      falhas: testes.length - testesOk,
      detalhe: testes,
    },
    casosSemPackLista: semPack,
  };

  const docsDir = path.join(process.cwd(), "docs");
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  fs.writeFileSync(
    path.join(docsDir, "clinical-nlp-coverage.json"),
    JSON.stringify(out, null, 2),
    "utf8"
  );

  console.log("=== Clinical NLP — Auditoria de Cobertura ===");
  console.log("Conceitos globais:", out.totaisConceitosGlobais, "| sinônimos:", out.totalSinonimosGlobais);
  console.log("Pacotes por diagnóstico:", out.totalPacotesDiagnostico);
  console.log("Casos no banco:", out.casosNoBanco, "| com pack:", out.casosComPack, "| sem pack:", out.casosSemPack);
  console.log("Testes de detecção:", testesOk, "/", testes.length, testesOk === testes.length ? "✅" : "❌");
  for (const t of testes.filter((x) => !x.passou)) {
    console.log(`  ❌ "${t.frase}" → faltou: ${t.faltando.join(", ")}`);
  }
  console.log("JSON salvo em docs/clinical-nlp-coverage.json");
}

main();
