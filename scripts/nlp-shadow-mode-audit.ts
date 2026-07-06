// ============================================================================
// NLP Shadow Mode — runner de AUDITORIA (execução manual; não altera nota)
// ----------------------------------------------------------------------------
// Roda o detector NLP em paralelo a atendimentos (real + sintéticos), compara
// com o que o feedback reconheceu/faltou e classifica inconsistências.
// NÃO é chamado pela aplicação; NÃO toca HealthBench/scoring/rubricas.
//
// Uso: npx tsx scripts/nlp-shadow-mode-audit.ts
// ============================================================================

import * as fs from "fs";
import * as path from "path";
import {
  detectClinicalConcepts,
  detectDiagnosisConcepts,
} from "../lib/nlp/clinical-nlp-normalizer";
import { getDiagnosisNlpPack } from "../lib/nlp/diagnosis-nlp-pack";
import {
  montarTextoAgregado,
  classificarConceito,
  feedbackMencionaConceito,
  type ShadowConceptRow,
  type NlpShadowIssueType,
} from "./nlp-shadow-utils";
import { TUBERCULOSE_REAL_ROBERTO_SANTOS } from "./fixtures/tuberculose-real-roberto-santos";

const norm = (s: string) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// ---- Consultas perfeitas textuais sintéticas (TAREFA 7) -------------------
type ConsultaSintetica = {
  nome: string;
  diagnosisKey: string;
  texto: string;
  conceitosEsperados: string[];
};

const CONSULTAS_PERFEITAS: ConsultaSintetica[] = [
  {
    nome: "Tuberculose pulmonar",
    diagnosisKey: "tuberculose_pulmonar",
    texto:
      "Bom dia, sou o doutor. O senhor confirma o nome? Tem tosse ha mais de 3 semanas, febre a noite, sudorese noturna e perda de peso? Teve contato com alguem com tuberculose? " +
      "Vou auscultar os pulmoes e palpar linfonodos. Vou pedir trm tb, rx de torax e baciloscopia do escarro, alem de cultura de escarro. " +
      "Oriento mascara, etiqueta respiratoria, investigacao dos contatos, notificacao e adesao ao ripe se confirmado.",
    conceitosEsperados: [
      "tosse_cronica", "febre_vespertina_noturna", "sudorese_noturna", "perda_peso", "contato_tb",
      "ausculta_pulmonar", "linfonodos", "trm_tb", "rx_torax", "baciloscopia_escarro",
      "cultura_escarro", "mascara_etiqueta_respiratoria", "investigar_contatos",
      "notificacao_vigilancia", "ripe", "adesao_tratamento",
    ],
  },
  {
    nome: "Pneumonia / PAC",
    diagnosisKey: "pneumonia_pac",
    texto:
      "Paciente com febre, tosse com catarro amarelado e dor para respirar fundo. Vou auscultar torax anterior e posterior, ouvindo crepitacoes. " +
      "Peco raio x do peito e hemograma. Inicio amoxicilina com clavulanato e oriento sinais de piora.",
    conceitosEsperados: [
      "febre", "tosse", "expectoracao", "dor_pleuritica", "ausculta_anterior_posterior",
      "crepitacoes", "rx_torax", "hemograma", "antibiotico_pneumonia",
    ],
  },
  {
    nome: "Insuficiência cardíaca",
    diagnosisKey: "insuficiencia_cardiaca",
    texto:
      "Paciente acorda sufocando de madrugada, dorme com varios travesseiros, pernas inchadas e turgencia jugular. " +
      "Ausculto terceira bulha e crepitacoes. Vou pedir eco, bnp e rx de torax, e iniciar furosemida para a congestao. Oriento restricao de sal.",
    conceitosEsperados: [
      "dispneia_paroxistica_noturna", "ortopneia", "edema_membros_inferiores", "turgencia_jugular",
      "b3", "crepitacoes", "ecocardiograma", "bnp_ntprobnp", "rx_torax", "diuretico_ic", "restricao_sal",
    ],
  },
  {
    nome: "SCA / IAM",
    diagnosisKey: "sca_iam",
    texto:
      "Dor em aperto no peito irradiando para braco esquerdo, com suor frio e nausea. Tem hipertensao e diabetes. " +
      "Vou pedir eletro e enzimas cardiacas. Dou aas, anticoagulacao e nitrato, monitorizo e encaminho para angioplastia.",
    conceitosEsperados: [
      "dor_toracica_isquemica", "irradiacao", "sudorese", "nauseas", "fatores_risco_cardiovascular",
      "ecg", "troponina", "antiagregante_sca", "anticoagulacao", "nitrato", "monitorizacao", "angioplastia",
    ],
  },
  {
    nome: "Asma",
    diagnosisKey: "asma",
    texto:
      "Paciente com chiado no peito, aperto no peito e tosse desencadeados por poeira. Ja usa bombinha. " +
      "Ausculto sibilos, meço a saturacao e inicio salbutamol e corticoide.",
    conceitosEsperados: [
      "sibilancia", "aperto_peito", "tosse", "gatilhos", "uso_broncodilatador", "sibilos",
      "saturacao", "broncodilatador", "corticoide",
    ],
  },
  {
    nome: "DPOC",
    diagnosisKey: "dpoc",
    texto:
      "Paciente fumante com carga tabagica alta, falta de ar que piora, tosse cronica e catarro. " +
      "Ausculto sibilos e roncos. Dou oxigenio, broncodilatador, corticoide e antibiotico.",
    conceitosEsperados: [
      "tabagismo", "carga_tabagica", "dispneia_progressiva", "tosse_cronica", "expectoracao",
      "sibilancia", "roncos", "oxigenio_suporte", "broncodilatador", "corticoide", "antibiotico_dpoc",
    ],
  },
  {
    nome: "TEP",
    diagnosisKey: "tep",
    texto:
      "Falta de ar subita e dor ao respirar apos viagem longa, com a perna inchada. Saturacao baixa e taquicardia. " +
      "Peco d dimero e angio tc, e inicio anticoagulacao.",
    conceitosEsperados: [
      "dispneia_subita", "dor_pleuritica", "fatores_risco_tromboembolico", "tvp", "hipoxemia",
      "taquicardia", "d_dimero", "angio_tc_torax", "anticoagulacao",
    ],
  },
  {
    nome: "Pneumotórax",
    diagnosisKey: "pneumotorax",
    texto:
      "Dor subita no peito e falta de ar subita. Ausculta com murmurio reduzido e percussao timpanica. " +
      "Peco rx de torax e faço drenagem toracica.",
    conceitosEsperados: [
      "dor_pleuritica", "dispneia_subita", "murmurio_reduzido", "hipertimpanismo", "rx_torax",
      "drenagem_toracica",
    ],
  },
  {
    nome: "Dengue",
    diagnosisKey: "dengue",
    texto:
      "Febre, dor no corpo, dor atras dos olhos e manchas vermelhas. Investigo sinais de alarme como dor abdominal intensa e vomitos persistentes. " +
      "Peco hemograma com plaquetas e hematocrito, oriento hidratacao e nao usar ibuprofeno.",
    conceitosEsperados: [
      "febre", "mialgia", "dor_retroorbitaria", "exantema", "sinais_alarme_dengue", "hemograma",
      "plaquetas", "hematocrito", "hidratacao", "evitar_aine",
    ],
  },
  {
    nome: "Anemia hemolítica",
    diagnosisKey: "anemia_hemolitica",
    texto:
      "Paciente com fadiga, palidez, olhos amarelos e urina escura, com baco aumentado. " +
      "Peço reticulocitos, bilirrubinas, ldh, haptoglobina e coombs direto. Inicio corticoide.",
    conceitosEsperados: [
      "fadiga", "palidez", "ictericia", "coluria", "esplenomegalia", "reticulocitos",
      "bilirrubinas", "ldh", "haptoglobina", "coombs", "corticoide_hemolise",
    ],
  },
];

function detectarIds(texto: string, diagnosisKey?: string): Map<string, string> {
  const dets = diagnosisKey
    ? detectDiagnosisConcepts(texto, diagnosisKey)
    : detectClinicalConcepts(texto);
  const m = new Map<string, string>();
  for (const d of dets) if (!m.has(d.conceptId)) m.set(d.conceptId, d.matchedText);
  return m;
}

// ---- Caso real de tuberculose (TAREFAS 6/9) -------------------------------
function auditarTuberculoseReal() {
  const f = TUBERCULOSE_REAL_ROBERTO_SANTOS;
  const textoAgregado = montarTextoAgregado({
    transcript: f.transcript,
    examesSolicitados: f.examesSolicitados,
    diagnosticoInformado: f.diagnosticoInformado,
    conduta: f.conduta,
  });
  const detectados = detectarIds(textoAgregado, f.diagnosisKey);
  const pack = getDiagnosisNlpPack(f.diagnosisKey)!;
  const haystack = norm(textoAgregado);

  const rows: ShadowConceptRow[] = pack.concepts.map((conceptId) => {
    const evidencia = detectados.get(conceptId) ?? "";
    const detectadoNlp = detectados.has(conceptId);
    const reconhecidoFeedback = feedbackMencionaConceito(f.diagnosisKey, conceptId, f.feedbackReconheceu ?? []);
    const faltouNoFeedback = feedbackMencionaConceito(f.diagnosisKey, conceptId, f.feedbackFaltou ?? []);
    const presenteNoPayload = !!evidencia && haystack.includes(norm(evidencia));
    const { issue, observacao } = classificarConceito({
      conceptId, detectadoNlp, evidencia, reconhecidoFeedback, faltouNoFeedback,
      presenteNoPayloadAgregado: presenteNoPayload,
    });
    return {
      conceptId,
      detectadoPeloNlp: detectadoNlp,
      evidencia,
      feedbackReconheceu: reconhecidoFeedback ? "sim" : faltouNoFeedback ? "nao" : "n/a",
      issue,
      observacao,
    };
  });

  return { fixture: f, textoAgregado, rows };
}

function main() {
  // 1) Tuberculose real
  const tb = auditarTuberculoseReal();

  // 2) Consultas perfeitas sintéticas
  const sinteticas = CONSULTAS_PERFEITAS.map((c) => {
    const detectados = detectarIds(c.texto, c.diagnosisKey);
    const esperadosDetectados = c.conceitosEsperados.filter((id) => detectados.has(id));
    const esperadosNaoDetectados = c.conceitosEsperados.filter((id) => !detectados.has(id));
    return {
      nome: c.nome,
      diagnosisKey: c.diagnosisKey,
      totalEsperados: c.conceitosEsperados.length,
      detectados: esperadosDetectados,
      naoDetectados: esperadosNaoDetectados,
      cobertura: `${esperadosDetectados.length}/${c.conceitosEsperados.length}`,
      todosConceitosDetectados: [...detectados.keys()],
    };
  });

  // Agregação de issues
  const issueCount: Record<string, number> = {};
  for (const r of tb.rows) issueCount[r.issue] = (issueCount[r.issue] ?? 0) + 1;

  const out = {
    geradoEm: new Date().toISOString(),
    modo: "shadow (sem integração; não altera nota)",
    tuberculoseReal: {
      casoId: tb.fixture.casoId,
      paciente: tb.fixture.paciente,
      diagnostico: tb.fixture.diagnosticoEsperado,
      conceitosDetectados: tb.rows.filter((r) => r.detectadoPeloNlp).map((r) => r.conceptId),
      conceitosNaoDetectados: tb.rows.filter((r) => !r.detectadoPeloNlp).map((r) => r.conceptId),
      tabela: tb.rows,
      issueCount,
    },
    consultasPerfeitas: sinteticas,
  };

  const docsDir = path.join(process.cwd(), "docs");
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  fs.writeFileSync(path.join(docsDir, "nlp-shadow-results.json"), JSON.stringify(out, null, 2), "utf8");

  // Console
  console.log("=== NLP Shadow Mode — Auditoria ===");
  console.log("Modo:", out.modo);
  console.log("\n[Tuberculose real — Roberto Santos]");
  for (const r of tb.rows) {
    const flag = r.detectadoPeloNlp ? "✔" : "·";
    console.log(`  ${flag} ${r.conceptId.padEnd(30)} | fb:${r.feedbackReconheceu.padEnd(7)} | ${r.issue}`);
  }
  console.log("  issues:", JSON.stringify(issueCount));
  console.log("\n[Consultas perfeitas sintéticas]");
  for (const s of sinteticas) {
    const flag = s.naoDetectados.length === 0 ? "✅" : "🟡";
    console.log(`  ${flag} ${s.nome.padEnd(24)} ${s.cobertura}${s.naoDetectados.length ? "  faltou: " + s.naoDetectados.join(", ") : ""}`);
  }
  console.log("\nJSON salvo em docs/nlp-shadow-results.json");
}

main();
