// ============================================================================
// Clinical NLP Enricher — camada de ENRIQUECIMENTO semântico (auxiliar)
// ----------------------------------------------------------------------------
// Detecta conceitos clínicos no texto do atendimento e produz um bloco textual
// auxiliar para o grader entender abreviações/sinônimos/termos informais.
//
// O NLP NÃO pontua. Este bloco é apenas apoio interpretativo; a decisão de
// pontuar continua sendo do HealthBench/rubrica. Não inventa ausências:
// só descreve o que está literalmente no texto, e descarta termos negados.
// ============================================================================

import {
  detectClinicalConcepts,
  detectDiagnosisConcepts,
  normalizeTextForClinicalNlp,
  type DetectedClinicalConcept,
} from "./clinical-nlp-normalizer";

export type ClinicalNlpEnrichment = {
  originalText: string;
  diagnosisKey?: string;
  detectedConcepts: {
    conceptId: string;
    label: string;
    category: string;
    matchedText: string;
    confidence: number;
    source: "global" | "diagnosis_pack";
    explanation: string;
  }[];
  enrichmentText: string;
};

// TAREFA 3 — explicações humanas por conceito
const CONCEPT_EXPLANATIONS: Record<string, string> = {
  trm_tb: "solicitação de TRM-TB, equivalente a teste rápido molecular para tuberculose",
  febre_vespertina_noturna: "relato ou investigação de febre à noite, equivalente a febre vespertina/noturna",
  contato_tb: "investigação de contato epidemiológico com tuberculose",
  tosse_cronica: "tosse persistente/prolongada, compatível com tosse crônica",
  tosse: "relato de tosse",
  perda_peso: "perda ponderal ou emagrecimento",
  sudorese_noturna: "sudorese noturna",
  hemoptise: "presença de sangue no escarro (hemoptise)",
  rx_torax: "solicitação de radiografia/raio-X de tórax",
  baciloscopia_escarro: "solicitação de baciloscopia/BAAR/exame de escarro",
  cultura_escarro: "solicitação de cultura de escarro",
  mascara_etiqueta_respiratoria: "orientação de máscara, etiqueta respiratória ou redução de transmissão",
  notificacao_vigilancia: "notificação ou encaminhamento à vigilância epidemiológica",
  investigar_contatos: "investigação/rastreio de contatos",
  ripe: "tratamento específico para tuberculose com esquema RIPE",
  adesao_tratamento: "orientação de adesão ao tratamento",
  ausculta_pulmonar: "realização de ausculta pulmonar",
  ausculta_torax_anterior: "realização de ausculta do tórax anterior",
  ausculta_torax_posterior: "realização de ausculta do tórax posterior",
  ausculta_anterior_posterior: "realização de ausculta pulmonar anterior e posterior",
  crepitacoes: "crepitações à ausculta",
  sibilos: "sibilos à ausculta",
  ecg: "solicitação de eletrocardiograma",
  troponina: "solicitação de troponina ou marcador de necrose miocárdica",
  antiagregante_sca: "uso de antiagregante plaquetário, como AAS",
  anticoagulacao: "uso ou indicação de anticoagulação",
  nitrato: "uso de nitrato",
  monitorizacao: "monitorização do paciente",
  diuretico_ic: "uso de diurético, como furosemida, para congestão",
  ortopneia: "falta de ar ao deitar ou necessidade de dormir com travesseiros",
  dispneia_paroxistica_noturna: "episódios de falta de ar noturna com despertar",
  edema_membros_inferiores: "inchaço/edema de membros inferiores",
  turgencia_jugular: "turgência jugular",
  d_dimero: "solicitação de D-dímero",
  angio_tc_torax: "solicitação de angio-TC de tórax",
  evitar_aine: "orientação de evitar anti-inflamatórios (AINE)",
  hidratacao: "orientação de hidratação",
};

function explicar(conceptId: string): string {
  return CONCEPT_EXPLANATIONS[conceptId] ?? "conceito clínico detectado no texto do aluno";
}

// TAREFA 11 — filtro de negação (janela curta antes do termo)
const NEGADORES = [
  "nao", "nega", "negou", "sem", "ausencia de", "nao apresenta", "nao refere",
  "nunca", "ausente",
];

// Negadores que SEGUEM o termo e se ligam a ele ("falta de ar ... negou").
const POS_NEGADORES = ["negou", "nega", "negado", "negados", "negativo", "ausente", "abolido"];

export function isNegatedNearby(normText: string, matchedText: string): boolean {
  const alvo = normalizeTextForClinicalNlp(matchedText);
  if (!alvo) return false;
  const idx = normText.indexOf(alvo);
  if (idx < 0) return false;
  // janela de ~8 palavras ANTES do termo (negadores pré-posicionados)
  const antes = normText.slice(0, idx).split(/\s+/).slice(-8).join(" ");
  const negAntes = NEGADORES.some(
    (n) => new RegExp(`(^|\\s)${n}(\\s|$)`).test(antes) || antes.endsWith(n)
  );
  if (negAntes) return true;
  // janela de ~5 palavras DEPOIS (negadores fortes pós-posicionados)
  const depois = normText.slice(idx + alvo.length).split(/\s+/).slice(0, 5).join(" ");
  return POS_NEGADORES.some((n) => new RegExp(`(^|\\s)${n}(\\s|$)`).test(depois));
}

// TAREFA 10 — dedup: preferir diagnosis_pack; depois maior confiança
function dedup(concepts: DetectedClinicalConcept[]): DetectedClinicalConcept[] {
  const best = new Map<string, DetectedClinicalConcept>();
  for (const c of concepts) {
    const cur = best.get(c.conceptId);
    if (!cur) {
      best.set(c.conceptId, c);
      continue;
    }
    const prefereNovo =
      (c.source === "diagnosis_pack" && cur.source !== "diagnosis_pack") ||
      (c.source === cur.source && c.confidence > cur.confidence);
    if (prefereNovo) best.set(c.conceptId, c);
  }
  return [...best.values()];
}

export function buildClinicalNlpEnrichment(input: {
  text: string;
  diagnosisKey?: string;
  maxConcepts?: number;
}): ClinicalNlpEnrichment {
  const { text, diagnosisKey, maxConcepts = 40 } = input;
  const normText = normalizeTextForClinicalNlp(text);

  const todos = [
    ...detectClinicalConcepts(text),
    ...detectDiagnosisConcepts(text, diagnosisKey),
  ];

  // TAREFA 11 — descartar conceitos negados (não inventar presença a partir de negação)
  const naoNegados = todos.filter((c) => !isNegatedNearby(normText, c.matchedText));

  // TAREFA 10 — dedup
  const unicos = dedup(naoNegados).slice(0, maxConcepts);

  const detectedConcepts = unicos.map((c) => ({
    conceptId: c.conceptId,
    label: c.label,
    category: c.category,
    matchedText: c.matchedText,
    confidence: c.confidence,
    source: c.source,
    explanation: explicar(c.conceptId),
  }));

  const linhas = detectedConcepts.map(
    (c) => `- ${c.conceptId}: o texto contém "${c.matchedText}", interpretado como ${c.explanation}.`
  );

  const enrichmentText = detectedConcepts.length
    ? [
        "[ENRIQUECIMENTO NLP — CONCEITOS CLÍNICOS DETECTADOS]",
        "Este bloco é auxiliar e NÃO substitui a avaliação clínica nem atribui pontos.",
        "Use apenas como apoio para interpretar abreviações, sinônimos e termos informais do aluno.",
        "Não infira itens não realizados a partir deste bloco.",
        ...linhas,
      ].join("\n")
    : "";

  return { originalText: text, diagnosisKey, detectedConcepts, enrichmentText };
}
