// ============================================================================
// NLP Shadow Mode — utilitários de AUDITORIA (não altera nota/rubrica)
// ----------------------------------------------------------------------------
// Mapa conceito NLP ↔ pistas textuais de critério de feedback (apenas para
// comparação shadow), montagem de texto agregado e classificação de
// inconsistências. NÃO integra HealthBench/scoring.
// ============================================================================

export type NlpShadowIssueType =
  | "nlp_detected_feedback_missed"
  | "feedback_detected_nlp_missed"
  | "both_detected"
  | "both_missed"
  | "possible_alias_gap"
  | "possible_payload_gap"
  | "possible_rubric_gap"
  | "possible_event_gap";

// Mapa inicial (apenas auditoria) — NÃO usado para scoring.
export const NLP_TO_FEEDBACK_CRITERIA_HINTS: Record<
  string,
  Record<string, string[]>
> = {
  tuberculose_pulmonar: {
    trm_tb: ["teste rapido molecular", "trm", "xpert", "gene xpert"],
    contato_tb: ["contato", "risco epidemiologico", "fator de risco"],
    febre_vespertina_noturna: ["febre vespertina", "febre noturna", "febre"],
    perda_peso: ["perda de peso", "emagrecimento", "sintomas constitucionais"],
    tosse_cronica: ["tosse persistente", "tosse cronica", "tosse >3 semanas", "tosse"],
    mascara_etiqueta_respiratoria: ["mascara", "etiqueta respiratoria", "reduzir transmissao"],
    ripe: ["ripe", "rifampicina", "isoniazida", "pirazinamida", "etambutol"],
    notificacao_vigilancia: ["notificacao", "vigilancia", "sinan"],
    baciloscopia_escarro: ["baciloscopia", "baar", "escarro"],
    rx_torax: ["rx de torax", "radiografia de torax", "raio x"],
    hemograma: ["hemograma"],
    cultura_escarro: ["cultura de escarro", "cultura"],
    investigar_contatos: ["investigar contatos", "avaliar contatos", "rastrear contatos"],
    adesao_tratamento: ["adesao", "completar tratamento", "nao abandonar"],
  },
};

export type ShadowInput = {
  transcript?: string;
  exameFisico?: string;
  examesSolicitados?: string;
  sinaisVitais?: string;
  diagnosticoInformado?: string;
  conduta?: string;
  soap?: string;
  registrosExameFisico?: string;
  physicalExamEvents?: string;
};

// TAREFA 1 — texto agregado de todas as fontes do atendimento
export function montarTextoAgregado(input: ShadowInput): string {
  const partes = [
    input.transcript,
    input.exameFisico,
    input.registrosExameFisico,
    input.physicalExamEvents,
    input.examesSolicitados,
    input.sinaisVitais,
    input.diagnosticoInformado,
    input.conduta,
    input.soap,
  ].filter(Boolean);
  return partes.join("\n");
}

function normalizar(s: string): string {
  return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/**
 * Decide se um critério reconhecido/faltante do feedback corresponde a um
 * conceito NLP, via NLP_TO_FEEDBACK_CRITERIA_HINTS. Apenas heurística de
 * auditoria — não pontua nada.
 */
export function feedbackMencionaConceito(
  diagnosisKey: string,
  conceptId: string,
  textosFeedback: string[]
): boolean {
  const hints = NLP_TO_FEEDBACK_CRITERIA_HINTS[diagnosisKey]?.[conceptId];
  if (!hints || !textosFeedback?.length) return false;
  const blob = normalizar(textosFeedback.join(" | "));
  return hints.some((h) => blob.includes(normalizar(h)));
}

export type ShadowConceptRow = {
  conceptId: string;
  detectadoPeloNlp: boolean;
  evidencia: string;
  feedbackReconheceu: "sim" | "nao" | "parcial" | "n/a";
  issue: NlpShadowIssueType;
  observacao: string;
};

// TAREFA 4 — classificação da inconsistência por conceito
export function classificarConceito(params: {
  conceptId: string;
  detectadoNlp: boolean;
  evidencia: string;
  reconhecidoFeedback: boolean;
  faltouNoFeedback: boolean;
  presenteNoPayloadAgregado: boolean;
}): { issue: NlpShadowIssueType; observacao: string } {
  const { detectadoNlp, reconhecidoFeedback, faltouNoFeedback, presenteNoPayloadAgregado } = params;

  if (detectadoNlp && reconhecidoFeedback) {
    return { issue: "both_detected", observacao: "ok — NLP e feedback concordam" };
  }
  if (detectadoNlp && faltouNoFeedback) {
    // NLP viu algo que o feedback marcou como ausente
    if (presenteNoPayloadAgregado) {
      return {
        issue: "nlp_detected_feedback_missed",
        observacao:
          "NLP detectou no texto, mas feedback marcou como faltou — possível alias/payload gap no grader",
      };
    }
    return {
      issue: "possible_payload_gap",
      observacao: "conceito detectado pelo NLP fora do payload avaliado",
    };
  }
  if (detectadoNlp && !reconhecidoFeedback) {
    return {
      issue: "nlp_detected_feedback_missed",
      observacao: "NLP detectou; feedback não confirmou — revisar reconhecimento no grader",
    };
  }
  if (!detectadoNlp && reconhecidoFeedback) {
    return {
      issue: "feedback_detected_nlp_missed",
      observacao: "feedback reconheceu, mas NLP não detectou — ampliar sinônimos do pacote",
    };
  }
  if (!detectadoNlp && faltouNoFeedback) {
    return { issue: "both_missed", observacao: "ausência real — não há evidência no texto" };
  }
  return { issue: "both_missed", observacao: "sem evidência / sem critério" };
}
