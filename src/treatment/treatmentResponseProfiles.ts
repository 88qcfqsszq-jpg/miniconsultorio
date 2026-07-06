// ============================================================================
// TreatmentResponseEngine — PERFIS DE RESPOSTA À CONDUTA
// ----------------------------------------------------------------------------
// Tabelas de modulação por adequação da conduta: quanto da melhora fisiológica
// esperada (gerada pelo perfil clínico) realmente se concretiza, e se há piora
// leve/moderada (conduta potencialmente perigosa). NÃO altera a regra de
// disposição — evaluateDisposition continua soberano (nunca alta simples em
// quadros de alto risco).
// ============================================================================

import type { TreatmentAdequacy, TherapeuticResponse } from "@/src/treatment/treatmentTypes";

/**
 * Fator aplicado à melhora esperada (delta perfil → sinais de saída base).
 * 1.0 = melhora integral esperada; <1 = melhora atenuada; >1 = melhora um
 * pouco maior (conduta ótima). Os sinais são sempre reclampados a limites
 * fisiológicos, então valores >1 não geram absurdos.
 */
export const RESPONSE_FACTOR: Record<TreatmentAdequacy, number> = {
  adequada: 1.1,
  parcial: 0.6,
  inadequada: 0.3,
  ausente: 0.2,
  potencialmente_perigosa: 0.25,
};

/** Peso do efeito das intervenções (matriz) por adequação da conduta. */
export const ADEQUACY_WEIGHT: Record<TreatmentAdequacy, number> = {
  adequada: 1.0,
  parcial: 0.65,
  inadequada: 0.4,
  ausente: 0.0,
  potencialmente_perigosa: 0.3,
};

/**
 * Matriz de evolução esperada por intervenção (documental — os valores efetivos
 * estão em applyTreatmentResponseToVitals). Regras clínicas-chave:
 *  - antitérmico/AINE: reduzem febre PARCIALMENTE (não normalizam febre alta em 2 h);
 *  - antibiótico: NÃO normaliza febre/PCR/leucograma em 2 h;
 *  - insulina: reduz glicemia PROGRESSIVAMENTE (não imediata);
 *  - oxigênio: SpO₂ melhora rápido;
 *  - broncodilatador: FR↓, SpO₂↑, FC↑ discreta;
 *  - hidratação (oral/venosa): FC↓, PA/perfusão↑.
 */
export const INTERVENTION_EFFECTS: Record<string, string> = {
  antipyretic: "temperatura ↓ parcial (não normaliza febre alta em 2 h)",
  oxygen: "SpO₂ ↑ rápido",
  bronchodilator: "FR ↓, SpO₂ ↑, FC ↑ discreta (beta-agonista)",
  oralHydration: "FC ↓, PA ↑ (perfusão)",
  ivFluids: "FC ↓↓, PA ↑↑ (perfusão)",
  analgesic: "dor ↓",
  nitrate: "dor isquêmica ↓, PA ↓",
  insulin: "glicemia ↓ progressiva (não imediata)",
  glucose: "glicemia ↑ rápida para faixa segura (correção de hipoglicemia)",
  antibiotic: "sem normalização de febre/PCR/leucograma em 2 h",
};

/** Conduta perigosa também gera piora leve/moderada (além de pouca melhora). */
export const WORSEN_ON: Record<TreatmentAdequacy, boolean> = {
  adequada: false,
  parcial: false,
  inadequada: false,
  ausente: false,
  potencialmente_perigosa: true,
};

/**
 * Resposta terapêutica DETERMINÍSTICA pela qualidade da conduta (filosofia
 * pedagógica: boa conduta → boa evolução; nunca "não respondeu" com conduta
 * correta). O estado fisiológico coerente é produzido por
 * applyTreatmentResponseToVitals; a DECISÃO de destino continua em
 * evaluateDisposition (algumas doenças permanecem em observação/hospital mesmo
 * com boa resposta).
 *   adequada → boa resposta · parcial → resposta parcial ·
 *   inadequada/ausente → sem resposta · perigosa → piora clínica.
 */
export function classifyTherapeuticResponse(adequacy: TreatmentAdequacy): TherapeuticResponse {
  switch (adequacy) {
    case "adequada": return "boa_resposta";
    case "parcial": return "resposta_parcial";
    case "potencialmente_perigosa": return "piora_clinica";
    default: return "sem_resposta"; // inadequada, ausente
  }
}

/** Mensagem educativa (não acusatória) por adequação. */
export const ADEQUACY_MESSAGE: Record<TreatmentAdequacy, string> = {
  adequada: "Conduta compatível com melhora clínica esperada.",
  parcial: "Conduta parcial: alguns sinais podem permanecer alterados.",
  inadequada: "Conduta insuficiente para estabilização do quadro.",
  ausente: "Nenhuma conduta registrada — evolução baseada apenas na história natural.",
  potencialmente_perigosa: "Há elementos de risco na conduta informada.",
};

/**
 * Ordem de severidade para comparação (maior = pior).
 * Usada quando várias regras concorrem.
 */
export const ADEQUACY_SEVERITY: Record<TreatmentAdequacy, number> = {
  adequada: 0,
  parcial: 1,
  ausente: 2,
  inadequada: 3,
  potencialmente_perigosa: 4,
};
