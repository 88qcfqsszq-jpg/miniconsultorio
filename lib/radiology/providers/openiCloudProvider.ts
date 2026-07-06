/**
 * Provider Open-i / Indiana University Chest X-ray Collection
 *
 * Fonte: https://openi.nlm.nih.gov/api/search
 *
 * Características:
 * - API pública (sem autenticação necessária)
 * - Imagens de RX de tórax reais
 * - Licença educacional
 * - Não requer configuração (funciona out-of-the-box)
 *
 * Uso:
 * - Primeira tentativa de provider em nuvem para Exames de Imagem
 * - Fallback seguro caso falhe
 * - Fonte de referência educacional apenas
 *
 * NUNCA usa credenciais, NUNCA retorna dados falsos.
 */

import type {
  ParametrosBuscaImagem,
  ResultadoBuscaImagem,
  ImagemRadiologica,
  ErroProviderNIH,
} from "../types";
import {
  buscarReferenciaCurada,
  listarReferenciassCuradas,
} from "../openiCuratedReferences";

// ============================================================================
// VALIDAÇÃO E NORMALIZAÇÃO DE URLs
// ============================================================================

/**
 * Normalizar URL do Open-i para formato absoluto HTTPS
 * Garante que apenas URLs válidas sejam retornadas
 */
function normalizarOpenIImageUrl(rawUrl: string | null | undefined): string | null {
  // Rejeitar vazio
  if (!rawUrl || typeof rawUrl !== "string") {
    return null;
  }

  const url = rawUrl.trim();

  // Rejeitar vazio
  if (url.length === 0) {
    return null;
  }

  // Se já é URL HTTPS absoluta, manter
  if (url.startsWith("https://")) {
    return url;
  }

  // Se é HTTP (não HTTPS), rejeitar por segurança
  if (url.startsWith("http://")) {
    return null;
  }

  // Se é caminho relativo do Open-i, converter para URL absoluta
  if (url.startsWith("/imgs/")) {
    return `https://openi.nlm.nih.gov${url}`;
  }

  // Qualquer outra coisa: inválido
  return null;
}

// ============================================================================
// MAPEAMENTO: PT-BR → INGLÊS (Open-i)
// ============================================================================

/**
 * Normaliza termos de patologia de PT-BR para inglês (Open-i)
 * Fallback para termo original se não houver mapeamento
 */
function normalizarTermoPatologia(termoPtBr: string): string {
  const mapeamento: Record<string, string> = {
    pneumonia: "pneumonia",
    pneumotórax: "pneumothorax",
    "derrame pleural": "pleural effusion",
    cardiomegalia: "cardiomegaly",
    atelectasia: "atelectasis",
    consolidação: "consolidation",
    consolidacao: "consolidation",
    infiltrado: "infiltrate",
    "edema pulmonar": "pulmonary edema",
    "edema pulmao": "pulmonary edema",
    normal: "normal chest xray",
    "sem achados": "normal",
    "sem alterações": "normal",
    enfisema: "emphysema",
    "espessamento pleural": "pleural thickening",
    hérnia: "hernia",
    fibrose: "fibrosis",
    nódulo: "nodule",
    nodulo: "nodule",
    massa: "mass",
    derrame: "effusion",
    "hipertensão pulmonar": "pulmonary hypertension",
    "tuberculose pulmonar": "tuberculosis",
    "doença pulmonar obstrutiva": "copd",
    asma: "asthma",
    "insuficiência cardíaca": "heart failure",
    "insuficiencia cardiaca": "heart failure",
    pneumoconiose: "pneumoconiosis",
  }

  const termo = termoPtBr.toLowerCase().trim()
  return mapeamento[termo] || termo
}

// ============================================================================
// INTERFACE DA API OPEN-I
// ============================================================================

interface ResultadoOpenI {
  uId: string
  imageId?: string
  uid?: string
  imgLarge?: string
  imgThumb?: string
  imgGrid150?: string
  caption?: string
  problems?: string[]
  impression?: string
  meshTerms?: string[]
  [key: string]: unknown
}

interface RespostaOpenI {
  list?: ResultadoOpenI[]
  error?: string
}

// ============================================================================
// CURADORIA POR DIAGNÓSTICO
// ============================================================================

/**
 * Identifica o tipo de diagnóstico para aplicar curadoria específica
 */
function obterDiagnosticoPrincipal(diagnosticoPtBr: string): string {
  const lowerDiag = diagnosticoPtBr.toLowerCase();

  // ====== PNEUMONIAS E INFECÇÕES PULMONARES ======
  if (
    lowerDiag.includes("pneumonia") ||
    lowerDiag.includes("pac") ||
    lowerDiag.includes("processo inflamatório pulmonar") ||
    lowerDiag.includes("infecção respiratória baixa") ||
    lowerDiag.includes("processo infeccioso pulmonar")
  ) {
    return "pneumonia";
  }

  if (
    lowerDiag.includes("tuberculose") ||
    lowerDiag.includes("tuberculosis") ||
    lowerDiag.includes("tb") ||
    lowerDiag.includes("tuberculose pulmonar")
  ) {
    return "tuberculosis";
  }

  if (
    lowerDiag.includes("bronquiolite") ||
    lowerDiag.includes("bronchiolitis") ||
    lowerDiag.includes("viral bronchiolitis")
  ) {
    return "bronchiolitis";
  }

  if (
    lowerDiag.includes("pneumonia atípica") ||
    lowerDiag.includes("mycoplasma") ||
    lowerDiag.includes("atípica")
  ) {
    return "atypical_pneumonia";
  }

  // ====== PATOLOGIAS OBSTRUTIVAS ======
  if (
    lowerDiag.includes("asma") ||
    lowerDiag.includes("crise asmática") ||
    lowerDiag.includes("broncoespasmo") ||
    lowerDiag.includes("sibilância") ||
    lowerDiag.includes("reactive airway")
  ) {
    return "asthma";
  }

  if (
    lowerDiag.includes("dpoc") ||
    lowerDiag.includes("doença pulmonar obstrutiva") ||
    lowerDiag.includes("enfisema") ||
    lowerDiag.includes("emphysema") ||
    lowerDiag.includes("chronic obstructive")
  ) {
    return "copd";
  }

  // ====== PATOLOGIAS VASCULARES/MECÂNICAS ======
  if (
    lowerDiag.includes("pneumotórax") ||
    lowerDiag.includes("pneumotorax") ||
    lowerDiag.includes("spontaneous pneumothorax") ||
    lowerDiag.includes("collapsed lung")
  ) {
    return "pneumothorax";
  }

  if (
    lowerDiag.includes("derrame pleural") ||
    lowerDiag.includes("pleural effusion") ||
    lowerDiag.includes("efusão pleural")
  ) {
    return "pleural_effusion";
  }

  if (
    lowerDiag.includes("atelectasia") ||
    lowerDiag.includes("atelectasis") ||
    lowerDiag.includes("colapso pulmonar") ||
    lowerDiag.includes("volume loss")
  ) {
    return "atelectasis";
  }

  // ====== PATOLOGIAS CARDIOPULMONARES ======
  if (
    lowerDiag.includes("edema pulmonar") ||
    lowerDiag.includes("pulmonary edema") ||
    lowerDiag.includes("insuficiência cardíaca") ||
    lowerDiag.includes("insuficiencia cardiaca") ||
    lowerDiag.includes("congestive heart failure") ||
    lowerDiag.includes("chf") ||
    lowerDiag.includes("congestão pulmonar")
  ) {
    return "pulmonary_edema_chf";
  }

  if (
    lowerDiag.includes("icc") ||
    lowerDiag.includes("ICC")
  ) {
    return "icc";
  }

  if (
    lowerDiag.includes("cardiomegalia") ||
    lowerDiag.includes("cardiomegaly") ||
    lowerDiag.includes("enlarged cardiac silhouette") ||
    lowerDiag.includes("silhueta cardíaca aumentada")
  ) {
    return "cardiomegaly";
  }

  if (
    lowerDiag.includes("hipertensão pulmonar") ||
    lowerDiag.includes("pulmonary hypertension")
  ) {
    return "pulmonary_hypertension";
  }

  // ====== RADIOGRAFIA NORMAL ======
  if (
    lowerDiag.includes("normal") ||
    lowerDiag.includes("sem achados") ||
    lowerDiag.includes("sem alterações") ||
    lowerDiag.includes("no acute")
  ) {
    return "normal";
  }

  return "other";
}

/**
 * Mapeia diagnóstico PT-BR para termos de busca relevantes em inglês
 * Retorna array de termos para busca no Open-i
 */
function obterTermosBuscaPorDiagnostico(diagnosticoPtBr: string): string[] {
  const diagnosticoKey = obterDiagnosticoPrincipal(diagnosticoPtBr);

  // ====== PNEUMONIAS E INFECÇÕES ======
  if (diagnosticoKey === "pneumonia") {
    return [
      "pneumonia",
      "pulmonary infiltrate",
      "lung consolidation",
      "airspace opacity",
      "lower lobe pneumonia",
    ];
  }

  if (diagnosticoKey === "tuberculosis") {
    return [
      "pulmonary tuberculosis",
      "tuberculosis chest xray",
      "upper lobe infiltrate",
      "cavitary lesion",
      "apical infiltrate",
      "tuberculosis",
      "TB",
    ];
  }

  if (diagnosticoKey === "bronchiolitis") {
    return [
      "bronchiolitis chest xray",
      "hyperinflation",
      "peribronchial thickening",
      "viral bronchiolitis",
    ];
  }

  if (diagnosticoKey === "atypical_pneumonia") {
    return [
      "atypical pneumonia",
      "mycoplasma pneumonia",
      "pneumonia infiltrate",
      "interstitial pneumonia",
    ];
  }

  // ====== PATOLOGIAS OBSTRUTIVAS ======
  if (diagnosticoKey === "asthma") {
    return [
      "hyperinflation",
      "pulmonary hyperinflation",
      "peribronchial thickening",
      "bronchial wall thickening",
      "reactive airway disease",
      "asthma chest xray",
      "normal chest xray",
    ];
  }

  if (diagnosticoKey === "copd") {
    return [
      "emphysema",
      "COPD chest xray",
      "hyperinflation",
      "flattened diaphragm",
      "increased lung volume",
    ];
  }

  // ====== PATOLOGIAS VASCULARES/MECÂNICAS ======
  if (diagnosticoKey === "pneumothorax") {
    return [
      "pneumothorax",
      "apical pneumothorax",
      "spontaneous pneumothorax",
      "pleural line",
      "collapsed lung",
    ];
  }

  if (diagnosticoKey === "pleural_effusion") {
    return [
      "pleural effusion",
      "right pleural effusion",
      "left pleural effusion",
      "costophrenic angle",
    ];
  }

  if (diagnosticoKey === "atelectasis") {
    return [
      "atelectasis",
      "lobar atelectasis",
      "subsegmental atelectasis",
      "volume loss",
      "linear opacity",
    ];
  }

  // ====== PATOLOGIAS CARDIOPULMONARES ======
  if (diagnosticoKey === "pulmonary_edema") {
    return [
      "pulmonary edema",
      "congestive heart failure chest xray",
      "CHF chest xray",
      "vascular congestion",
      "interstitial edema",
    ];
  }

  if (diagnosticoKey === "cardiomegaly") {
    return [
      "cardiomegaly",
      "enlarged cardiac silhouette",
      "congestive heart failure",
      "cardiac enlargement",
    ];
  }

  if (diagnosticoKey === "pulmonary_hypertension") {
    return [
      "pulmonary hypertension",
      "dilated pulmonary artery",
      "prominent pulmonary vessels",
    ];
  }

  // ====== RADIOGRAFIA NORMAL ======
  if (diagnosticoKey === "normal") {
    return [
      "normal chest xray",
      "no acute cardiopulmonary abnormality",
      "clear lungs",
    ];
  }

  // Fallback: usar termo original
  return [normalizarTermoPatologia(diagnosticoPtBr)];
}

/**
 * Verifica se imagem tem termo crítico bloqueado
 */
function temTermoCriticoBloqueado(
  resultado: ResultadoOpenI
): boolean {
  const textosAVerificar = [
    resultado.caption?.toLowerCase() || "",
    resultado.impression?.toLowerCase() || "",
    (resultado.problems || []).join(" ").toLowerCase(),
    (resultado.meshTerms || []).join(" ").toLowerCase(),
  ].join(" ");

  const termosCriticoBloqueados = [
    "pneumoperitoneum",
    "free intraperitoneal air",
    "bowel obstruction",
    "fracture",
    "bone",
  ];

  return termosCriticoBloqueados.some(termo => textosAVerificar.includes(termo));
}

/**
 * Verifica se impression sugere imagem normal ou sem achado
 */
function temImpressionNegativa(resultado: ResultadoOpenI): boolean {
  const impression = (resultado.impression || "").toLowerCase();

  const termosNegativosFortes = [
    "no acute cardiopulmonary abnormality",
    "normal chest",
    "no focal infiltrate",
    "no pneumonia",
    "clear lungs",
    "unremarkable",
    "no significant",
  ];

  return termosNegativosFortes.some(termo => impression.includes(termo));
}

/**
 * Calcula score de relevância com rigor específico por diagnóstico
 */
function calcularScoreRelevancia(
  resultado: ResultadoOpenI,
  termosBuscaEsperados: string[],
  diagnosticoKey: string
): { score: number; termosEncontrados: string[] } {
  const textos = {
    caption: resultado.caption?.toLowerCase() || "",
    impression: resultado.impression?.toLowerCase() || "",
    problems: (resultado.problems || []).join(" ").toLowerCase(),
    meshTerms: (resultado.meshTerms || []).join(" ").toLowerCase(),
  };

  const textosAVerificar = Object.values(textos).join(" ");
  let score = 0;
  const termosEncontrados: string[] = [];

  // ========================================================================
  // PNEUMONIA: Rigoroso - rejeita normal e requer achado claro
  // ========================================================================
  if (diagnosticoKey === "pneumonia") {
    const termosFortes = [
      "pneumonia",
      "infiltrate",
      "infiltrates",
      "consolidation",
      "consolidative",
      "airspace opacity",
      "airspace disease",
      "opacity",
      "opacities",
      "lower lobe opacity",
      "upper lobe opacity",
      "basilar opacity",
      "focal opacity",
    ];

    const termosFracos = ["pulmonary", "chest", "lung", "xray"];

    // Procurar termos fortes
    for (const termo of termosFortes) {
      if (textosAVerificar.includes(termo)) {
        score += 50;
        termosEncontrados.push(termo);
      }
    }

    // Penalizar se só tiver termo fraco
    if (score === 0) {
      const temTermoFraco = termosFracos.some(termo =>
        textosAVerificar.includes(termo)
      );
      if (temTermoFraco) {
        score = -100; // Rejeitar fortemente
      }
    }

    // Descartar se tiver impression negativa
    if (temImpressionNegativa(resultado)) {
      score = -200;
    }

    return { score: Math.max(score, 0), termosEncontrados };
  }

  // ========================================================================
  // ASMA: Flexível - aceita normal, hiperinsuflação ou espessamento
  // ========================================================================
  if (diagnosticoKey === "hyperinflation") {
    const termosPositivos = [
      "hyperinflation",
      "hyperinflated",
      "peribronchial thickening",
      "bronchial wall thickening",
      "reactive airway disease",
      "clear lungs",
      "no focal infiltrate",
      "no focal consolidation",
      "no acute cardiopulmonary abnormality",
      "normal",
    ];

    const termosBloqueados = [
      "pneumonia",
      "consolidation",
      "pleural effusion",
      "pneumothorax",
      "mass",
      "nodule",
      "tuberculosis",
    ];

    // Procurar termos positivos
    for (const termo of termosPositivos) {
      if (textosAVerificar.includes(termo)) {
        score += 40; // Menor peso para asma (aceitamos normal também)
        termosEncontrados.push(termo);
      }
    }

    // Verificar se tem termo bloqueado
    const temBloqueado = termosBloqueados.some(termo =>
      textosAVerificar.includes(termo)
    );
    if (temBloqueado) {
      score = -100; // Rejeitar se tiver achado que não é asma
    }

    // Para asma, aceitar RX normal (diferente de pneumonia)
    if (
      textosAVerificar.includes("normal") ||
      textosAVerificar.includes("unremarkable")
    ) {
      score = Math.max(score, 30); // Garantir score mínimo para normal
    }

    return { score: Math.max(score, 0), termosEncontrados };
  }

  // ========================================================================
  // TUBERCULOSE: Moderadamente rigoroso - busca achados específicos
  // ========================================================================
  if (diagnosticoKey === "tuberculosis") {
    const termosPositivos = [
      "tuberculosis",
      "tuberculosis",
      "cavitary",
      "cavity",
      "cavitation",
      "upper lobe",
      "apical",
      "infiltrate",
      "infiltrates",
      "opacity",
      "opacities",
      "granulomatous",
      "fibrosis",
      "fibroparenquimatosa",
      "tb",
    ];

    const termosBloqueados = [
      "normal chest",
      "clear lungs",
      "no acute cardiopulmonary abnormality",
      "no focal infiltrate",
      "pneumoperitoneum",
      "bowel obstruction",
      "fracture",
      "bone",
    ];

    // Procurar termos positivos
    for (const termo of termosPositivos) {
      if (textosAVerificar.includes(termo)) {
        score += 50;
        termosEncontrados.push(termo);
      }
    }

    // Verificar se tem termo bloqueado
    const temBloqueado = termosBloqueados.some(termo =>
      textosAVerificar.includes(termo)
    );
    if (temBloqueado) {
      score = -100; // Rejeitar se tiver achado que não é TB
    }

    // Para TB, rejeitar se impression for completamente normal
    if (temImpressionNegativa(resultado)) {
      score = -100;
    }

    return { score: Math.max(score, 0), termosEncontrados };
  }

  // ========================================================================
  // BRONQUIOLITE: Aceita hipertensão + espessamento + achados virais
  // ========================================================================
  if (diagnosticoKey === "bronchiolitis") {
    const termosPositivos = [
      "bronchiolitis",
      "hyperinflation",
      "hyperinflated",
      "peribronchial thickening",
      "bronchial wall thickening",
      "viral",
      "atelectasis",
    ];
    const termosBloqueados = [
      "lobar consolidation",
      "mass",
      "pneumothorax",
      "pleural effusion",
    ];

    for (const termo of termosPositivos) {
      if (textosAVerificar.includes(termo)) {
        score += 40;
        termosEncontrados.push(termo);
      }
    }

    const temBloqueado = termosBloqueados.some(termo =>
      textosAVerificar.includes(termo)
    );
    if (temBloqueado) {
      score = -100;
    }

    return { score: Math.max(score, 0), termosEncontrados };
  }

  // ========================================================================
  // DPOC/ENFISEMA: Prioriza hipertensão + diafragma achatado
  // ========================================================================
  if (diagnosticoKey === "copd") {
    const termosPositivos = [
      "emphysema",
      "copd",
      "hyperinflation",
      "hyperinflated",
      "flattened diaphragm",
      "increased lung volume",
      "barrel chest",
    ];
    const termosBloqueados = ["pneumonia", "consolidation", "pleural effusion"];

    for (const termo of termosPositivos) {
      if (textosAVerificar.includes(termo)) {
        score += 45;
        termosEncontrados.push(termo);
      }
    }

    const temBloqueado = termosBloqueados.some(termo =>
      textosAVerificar.includes(termo)
    );
    if (temBloqueado) {
      score = -100;
    }

    return { score: Math.max(score, 0), termosEncontrados };
  }

  // ========================================================================
  // PNEUMOTÓRAX: Requer pleural line ou collapsed lung
  // ========================================================================
  if (diagnosticoKey === "pneumothorax") {
    const termosPositivos = [
      "pneumothorax",
      "pleural line",
      "collapsed lung",
      "no lung markings",
      "apical pneumothorax",
    ];
    const termosBloqueados = ["pneumonia", "consolidation", "pleural effusion"];

    for (const termo of termosPositivos) {
      if (textosAVerificar.includes(termo)) {
        score += 60; // Peso alto: pneumotórax é bem específico
        termosEncontrados.push(termo);
      }
    }

    const temBloqueado = termosBloqueados.some(termo =>
      textosAVerificar.includes(termo)
    );
    if (temBloqueado) {
      score = -100;
    }

    return { score: Math.max(score, 0), termosEncontrados };
  }

  // ========================================================================
  // DERRAME PLEURAL: Requer blunting costophrênico ou menisco
  // ========================================================================
  if (diagnosticoKey === "pleural_effusion") {
    const termosPositivos = [
      "pleural effusion",
      "blunting",
      "costophrenic angle",
      "meniscus",
      "effusion",
      "right pleural",
      "left pleural",
    ];
    const termosBloqueados = ["pneumothorax", "pneumoperitoneum", "bowel obstruction"];

    for (const termo of termosPositivos) {
      if (textosAVerificar.includes(termo)) {
        score += 50;
        termosEncontrados.push(termo);
      }
    }

    const temBloqueado = termosBloqueados.some(termo =>
      textosAVerificar.includes(termo)
    );
    if (temBloqueado) {
      score = -100;
    }

    return { score: Math.max(score, 0), termosEncontrados };
  }

  // ========================================================================
  // ATELECTASIA: Requer volume loss ou linear opacity
  // ========================================================================
  if (diagnosticoKey === "atelectasis") {
    const termosPositivos = [
      "atelectasis",
      "volume loss",
      "collapse",
      "linear opacity",
      "subsegmental",
      "lobar atelectasis",
    ];
    const termosBloqueados = ["pneumoperitoneum", "bowel obstruction"];

    for (const termo of termosPositivos) {
      if (textosAVerificar.includes(termo)) {
        score += 50;
        termosEncontrados.push(termo);
      }
    }

    const temBloqueado = termosBloqueados.some(termo =>
      textosAVerificar.includes(termo)
    );
    if (temBloqueado) {
      score = -100;
    }

    return { score: Math.max(score, 0), termosEncontrados };
  }

  // ========================================================================
  // EDEMA PULMONAR/ICC: Requer padrão intersticial ou cardiomegalia
  // ========================================================================
  if (diagnosticoKey === "pulmonary_edema") {
    const termosPositivos = [
      "pulmonary edema",
      "vascular congestion",
      "interstitial edema",
      "cardiomegaly",
      "chf",
      "congestive heart failure",
      "kerley",
      "alveolar edema",
    ];
    const termosBloqueados = ["pneumothorax", "pneumoperitoneum"];

    for (const termo of termosPositivos) {
      if (textosAVerificar.includes(termo)) {
        score += 45;
        termosEncontrados.push(termo);
      }
    }

    const temBloqueado = termosBloqueados.some(termo =>
      textosAVerificar.includes(termo)
    );
    if (temBloqueado) {
      score = -100;
    }

    return { score: Math.max(score, 0), termosEncontrados };
  }

  // ========================================================================
  // CARDIOMEGALIA: Requer silhueta cardíaca aumentada
  // ========================================================================
  if (diagnosticoKey === "cardiomegaly") {
    const termosPositivos = [
      "cardiomegaly",
      "enlarged cardiac silhouette",
      "cardiac enlargement",
      "chf",
      "congestive heart failure",
      "vascular congestion",
    ];

    for (const termo of termosPositivos) {
      if (textosAVerificar.includes(termo)) {
        score += 50;
        termosEncontrados.push(termo);
      }
    }

    return { score: Math.max(score, 0), termosEncontrados };
  }

  // ========================================================================
  // HIPERTENSÃO PULMONAR: Requer dilatação de artérias pulmonares
  // ========================================================================
  if (diagnosticoKey === "pulmonary_hypertension") {
    const termosPositivos = [
      "pulmonary hypertension",
      "dilated pulmonary artery",
      "prominent pulmonary vessels",
      "right heart strain",
    ];

    for (const termo of termosPositivos) {
      if (textosAVerificar.includes(termo)) {
        score += 50;
        termosEncontrados.push(termo);
      }
    }

    return { score: Math.max(score, 0), termosEncontrados };
  }

  // ========================================================================
  // PNEUMONIA ATÍPICA: Similar à pneumonia mas aceitando padrão intersticial
  // ========================================================================
  if (diagnosticoKey === "atypical_pneumonia") {
    const termosPositivos = [
      "atypical pneumonia",
      "mycoplasma",
      "pneumonia",
      "infiltrate",
      "interstitial",
      "opacity",
      "viral pneumonia",
    ];
    const termosBloqueados = [
      "normal chest",
      "clear lungs",
      "no focal infiltrate",
      "pneumoperitoneum",
    ];

    for (const termo of termosPositivos) {
      if (textosAVerificar.includes(termo)) {
        score += 40;
        termosEncontrados.push(termo);
      }
    }

    const temBloqueado = termosBloqueados.some(termo =>
      textosAVerificar.includes(termo)
    );
    if (temBloqueado) {
      score = -100;
    }

    return { score: Math.max(score, 0), termosEncontrados };
  }

  // ========================================================================
  // OUTROS: Aceitar se tiver algum termo de busca
  // ========================================================================
  for (const termo of termosBuscaEsperados) {
    if (textosAVerificar.includes(termo.toLowerCase())) {
      score += 30;
      termosEncontrados.push(termo);
    }
  }

  return { score: Math.max(score, 0), termosEncontrados };
}

// ============================================================================
// VALIDAÇÃO DE CONFIGURAÇÃO
// ============================================================================

/**
 * Open-i é sempre configurado (API pública, sem credenciais)
 */
function verificarConfiguracaoOpenI(): {
  valido: boolean
  motivo?: string
} {
  // Open-i SEMPRE está disponível (API pública)
  return { valido: true }
}

export function obterStatusConfiguracaoOpenI(): string {
  return "✅ Open-i / Indiana University disponível (API pública)"
}

// ============================================================================
// CONSULTA À API OPEN-I
// ============================================================================

/**
 * Consulta a API Open-i com retry e timeout
 * Sem autenticação necessária
 * Retorna múltiplas imagens para curadoria no backend
 */
async function consultarOpenI(
  termoNormalizado: string,
  maxTentativas: number = 1, // Sem retry - rápido é melhor que perfeito
  timeoutMs: number = 6000   // 6 segundos máximo por query
): Promise<ResultadoOpenI[]> {
  // Montar URL
  const url = new URL("https://openi.nlm.nih.gov/api/search")
  url.searchParams.set("query", termoNormalizado)
  url.searchParams.set("coll", "cxr") // Chest X-ray
  url.searchParams.set("m", "1") // Começa na 1ª imagem
  url.searchParams.set("n", "5") // Reduzir de 15 para 5 (rápido + suficiente para curadoria)

  // Apenas uma tentativa, sem retry
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    const response = await fetch(url.toString(), {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.warn(
        `[Open-i Provider] Resposta HTTP ${response.status} para: ${termoNormalizado}`
      )
      return []
    }

    const dados: RespostaOpenI = await response.json()

    if (!dados.list || !Array.isArray(dados.list)) {
      console.log(`[Open-i Provider] Nenhum resultado para: ${termoNormalizado}`)
      return []
    }

    console.log(
      `[Open-i Provider] ✅ ${dados.list.length} imagem(ns) encontrada(s)`
    )
    return dados.list
  } catch (erro) {
    const mensagem =
      erro instanceof Error ? erro.message : "Erro desconhecido"
    console.warn(
      `[Open-i Provider] Falha na busca: ${mensagem}`
    )
    return []
  }
}

// ============================================================================
// CONVERSÃO: OPEN-I → IMAGEMRADIOLOGICA
// ============================================================================

/**
 * Converte resultado Open-i para formato interno do app
 */
/**
 * Converter referência curada local para ImagemRadiologica
 * Valida imageUrl antes de retornar
 */
function converterReferenciaCuradaParaImagem(
  ref: any,
  diagnosticoOriginal: string
): ImagemRadiologica | null {
  // ✅ VALIDAR imageUrl (OBRIGATÓRIO)
  const imageUrlValidada = normalizarOpenIImageUrl(ref.imageUrl);
  if (!imageUrlValidada) {
    console.warn(
      `[Open-i Provider] ❌ Referência curada descartada: imageUrl inválido - ${ref.imageUrl}`
    );
    return null;
  }

  const imagem: ImagemRadiologica = {
    // Disponibilidade e tipo
    disponivel: true,
    modalidade: "RX",
    regiao: "torax",

    // Identificação
    imageId: ref.imageId,
    imageUrl: imageUrlValidada,
    labels: ["Chest X-ray", diagnosticoOriginal] as any,
    diagnosticoRadiologico: ref.impression,
    achadoPrincipal: ref.impression,

    // Fonte: Open-i (OBRIGATÓRIO PARA FINS EDUCACIONAIS)
    fonte: ref.fonte,
    atribuicao:
      "Fonte: Open-i / Indiana University Chest X-ray Collection. Imagens usadas para fins educacionais. " +
      "Licença CC BY 3.0.",

    // Integração
    integracaoReal: true,
    validadoPorIA: false,
    podeExibirAoAluno: true,

    // Metadados educacionais
    metadadosOriginais: {
      impression: ref.impression,
      expectedFindingPt: ref.expectedFindingPt,
      fonte: ref.fonte,
      origem: "catálogo curado local",
      scoreRelevancia: 100, // Score máximo - já curada
      termosEncontrados: [diagnosticoOriginal],
      motivoSelecao: "Referência curada local para máxima qualidade didática",
    },
  };

  return imagem;
}

function converterParaImagemRadiologica(
  resultado: ResultadoOpenI,
  termoNormalizado: string
): ImagemRadiologica | null {
  // ✅ NORMALIZAR e VALIDAR imageUrl (OBRIGATÓRIO)
  const urlBase = "https://openi.nlm.nih.gov"
  const rawImageUrl = resultado.imgLarge
    ? `${urlBase}${resultado.imgLarge}`
    : null

  const imageUrl = normalizarOpenIImageUrl(rawImageUrl);
  if (!imageUrl) {
    console.warn(
      `[Open-i Provider] ❌ Resultado Open-i descartado: imageUrl inválido - ${resultado.uId}`
    );
    return null;
  }

  const rawThumbnailUrl = resultado.imgThumb
    ? `${urlBase}${resultado.imgThumb}`
    : resultado.imgGrid150
      ? `${urlBase}${resultado.imgGrid150}`
      : null

  const thumbnailUrl = normalizarOpenIImageUrl(rawThumbnailUrl) || imageUrl

  // Extrair problemas/diagnóstico
  const problemas = resultado.problems ?? []
  const diagnostico = resultado.impression ?? termoNormalizado
  const achadoPrincipal =
    problemas.length > 0 ? problemas[0] : "RX de tórax"

  const imagem: ImagemRadiologica = {
    // Disponibilidade e tipo
    disponivel: true,
    modalidade: "RX",
    regiao: "torax",

    // Identificação
    imageId: resultado.uId || resultado.uid || `openi-${Date.now()}`,
    imageUrl: imageUrl,
    labels: problemas.length > 0 ? (problemas as any) : ["Chest X-ray"],
    diagnosticoRadiologico: diagnostico,
    achadoPrincipal: achadoPrincipal,

    // Fonte: Open-i (OBRIGATÓRIO PARA FINS EDUCACIONAIS)
    fonte: "NIH Chest X-ray",
    atribuicao:
      "Fonte: Open-i / Indiana University Chest X-ray Collection. Imagens usadas para fins educacionais. " +
      "Licença CC BY 3.0.",

    // Integração em nuvem confirmada
    integracaoReal: true,
    validadoPorIA: false, // Será validado por OpenAI em próxima etapa
    podeExibirAoAluno: false, // Até ser validado

    // Metadados originais (preservados para auditoria)
    metadadosOriginais: {
      imageId: resultado.uId,
      caption: resultado.caption,
      problems: resultado.problems,
      impression: resultado.impression,
      meshTerms: resultado.meshTerms,
      ...resultado,
    },

    // Timestamp
    dataAssociacao: new Date().toISOString(),
  }

  return imagem
}

// ============================================================================
// BUSCA PRINCIPAL
// ============================================================================

/**
 * Calcula prioridade didática por tipo de achado
 * Para selecionar imagens mais visualmente didáticas
 */
function calcularPrioridadeDidatica(resultado: ResultadoOpenI, diagnosticoKey?: string): number {
  const textosAVerificar = [
    resultado.caption?.toLowerCase() || "",
    resultado.impression?.toLowerCase() || "",
    (resultado.problems || []).join(" ").toLowerCase(),
  ].join(" ");

  let prioridade = 0;

  // ========================================================================
  // PNEUMONIA: Priorizar achados claros (consolidação > infiltrado > opacidade)
  // ========================================================================
  if (diagnosticoKey === "pneumonia") {
    // 1º: Consolidation/consolidative (mais didático)
    if (
      textosAVerificar.includes("consolidation") ||
      textosAVerificar.includes("consolidative")
    ) {
      prioridade = 500;
    }
    // 2º: Infiltrate/infiltrates
    else if (
      textosAVerificar.includes("infiltrate") ||
      textosAVerificar.includes("infiltrates")
    ) {
      prioridade = 400;
    }
    // 3º: Airspace opacity/disease
    else if (
      textosAVerificar.includes("airspace opacity") ||
      textosAVerificar.includes("airspace disease")
    ) {
      prioridade = 300;
    }
    // 4º: Pneumonia
    else if (textosAVerificar.includes("pneumonia")) {
      prioridade = 200;
    }
    // 5º: Opacity isolada
    else if (textosAVerificar.includes("opacity")) {
      prioridade = 100;
    }

    // Bonus por localização específica
    if (textosAVerificar.includes("lower lobe")) {
      prioridade += 50;
    }
    if (textosAVerificar.includes("basilar")) {
      prioridade += 40;
    }

    // Penalidade por sugerir achado mínimo/normal
    const termosMinimos = [
      "small",
      "minimal",
      "trace",
      "subtle",
      "questionable",
      "possible",
    ];
    if (termosMinimos.some(termo => textosAVerificar.includes(termo))) {
      prioridade -= 50;
    }
  }

  // ========================================================================
  // ASMA: Priorizar hiperinsuflação > espessamento > normal
  // ========================================================================
  else if (diagnosticoKey === "hyperinflation") {
    // 1º: Hyperinflation (mais didático para asma)
    if (
      textosAVerificar.includes("hyperinflation") ||
      textosAVerificar.includes("hyperinflated")
    ) {
      prioridade = 500;
    }
    // 2º: Peribronchial/bronchial thickening
    else if (
      textosAVerificar.includes("peribronchial") ||
      textosAVerificar.includes("bronchial wall")
    ) {
      prioridade = 400;
    }
    // 3º: Reactive airway disease
    else if (textosAVerificar.includes("reactive airway")) {
      prioridade = 300;
    }
    // 4º: Normal (aceitável para asma leve)
    else if (textosAVerificar.includes("normal")) {
      prioridade = 150; // Menor prioridade, mas aceitável
    }
  }

  // ========================================================================
  // TUBERCULOSE: Priorizar cavitações > infiltrados > opacidades
  // ========================================================================
  else if (diagnosticoKey === "tuberculosis") {
    // 1º: Cavitary/Cavitation (mais didático para TB)
    if (
      textosAVerificar.includes("cavitary") ||
      textosAVerificar.includes("cavitation") ||
      textosAVerificar.includes("cavity")
    ) {
      prioridade = 500;
    }
    // 2º: Upper lobe infiltrate
    else if (
      textosAVerificar.includes("upper lobe") &&
      (textosAVerificar.includes("infiltrate") ||
        textosAVerificar.includes("opacity"))
    ) {
      prioridade = 400;
    }
    // 3º: Apical infiltrate
    else if (
      textosAVerificar.includes("apical") &&
      (textosAVerificar.includes("infiltrate") ||
        textosAVerificar.includes("opacity"))
    ) {
      prioridade = 400;
    }
    // 4º: Infiltrate/Opacity geral
    else if (
      textosAVerificar.includes("infiltrate") ||
      textosAVerificar.includes("opacity")
    ) {
      prioridade = 300;
    }
    // 5º: Tuberculosis mencionado
    else if (textosAVerificar.includes("tuberculosis")) {
      prioridade = 200;
    }

    // Bonus por granulomas ou achados específicos
    if (textosAVerificar.includes("granulomatous")) {
      prioridade += 50;
    }
    if (textosAVerificar.includes("fibrosis")) {
      prioridade += 30;
    }

    // Penalidade por sugerir achado mínimo/normal
    const termosMinimos = [
      "small",
      "minimal",
      "trace",
      "subtle",
      "questionable",
      "possible",
    ];
    if (termosMinimos.some(termo => textosAVerificar.includes(termo))) {
      prioridade -= 50;
    }
  }

  return Math.max(prioridade, 0);
}

/**
 * Busca e cura múltiplas imagens no Open-i (API pública)
 *
 * Fluxo:
 * 1. Mapear diagnóstico PT-BR para termos de busca EN
 * 2. Consultar API Open-i com múltiplos termos
 * 3. Filtrar por termos críticos bloqueados
 * 4. Rankear por relevância E prioridade didática
 * 5. Retornar até 5 imagens mais relevantes
 */
async function buscarEmOpenI(
  parametros: ParametrosBuscaImagem
): Promise<ImagemRadiologica | null> {
  // Chamada interna que retorna array
  const imagens = await buscarMultiplasImagensEmOpenI(parametros);
  return imagens.length > 0 ? imagens[0] : null;
}

async function buscarMultiplasImagensEmOpenI(
  parametros: ParametrosBuscaImagem
): Promise<ImagemRadiologica[]> {
  try {
    const diagnosticoOriginal = parametros.labelNIH || "normal";
    console.log(
      `[Open-i Provider] Buscando múltiplas imagens para: "${diagnosticoOriginal}"`
    );

    // ✅ 1º PASSO: Procurar no CATÁLOGO CURADO LOCAL (rápido, garantido)
    const diagnosticoKey = obterDiagnosticoPrincipal(diagnosticoOriginal);
    const referenciassCuradas = listarReferenciassCuradas(diagnosticoKey);

    if (referenciassCuradas.length > 0) {
      console.log(
        `[Open-i Provider] ✅ ${referenciassCuradas.length} imagem(ns) encontrada(s) no catálogo curado`
      );

      // Converter referências curadas para ImagemRadiologica (com validação)
      const imagensCuradas = referenciassCuradas
        .map((ref) => converterReferenciaCuradaParaImagem(ref, diagnosticoOriginal))
        .filter((img) => img !== null) as ImagemRadiologica[];

      // Se nenhuma referência passou na validação, tentar busca ao vivo
      if (imagensCuradas.length === 0) {
        console.log(
          `[Open-i Provider] Nenhuma referência curada passou na validação. Tentando Open-i ao vivo...`
        );
        // Continuar para busca ao vivo (vê comentário abaixo)
      } else {
        return imagensCuradas;
      }
    }

    console.log(
      `[Open-i Provider] Nenhuma referência curada. Tentando busca Open-i ao vivo...`
    );

    // ❌ 2º PASSO: Se não houver curado, fazer busca Open-i ao vivo (fallback)
    // 1. Mapear diagnóstico PT-BR para termos de busca EN
    const termosBusca = obterTermosBuscaPorDiagnostico(diagnosticoOriginal);
    console.log(
      `[Open-i Provider] Termos de busca: ${termosBusca.join(", ")}`
    );

    // 2. Consultar API para cada termo EM PARALELO (max 3)
    // Limitar a 3 queries para evitar sobrecarga
    const termosLimitados = termosBusca.slice(0, 3);

    // Para TB e DPOC, usar timeout maior (8s) para compensar busca mais selectiva
    const timeoutMs = (diagnosticoKey === "tuberculosis" || diagnosticoKey === "copd_emphysema") ? 8000 : 6000;

    const promessas = termosLimitados.map((termo) =>
      consultarOpenI(termo, 1, timeoutMs)
    );

    // Usar Promise.allSettled para não bloquear em uma query lenta
    const resultados = await Promise.allSettled(promessas);

    let todosResultados: ResultadoOpenI[] = [];
    resultados.forEach((resultado) => {
      if (resultado.status === "fulfilled" && resultado.value) {
        todosResultados = todosResultados.concat(resultado.value);
      }
      // Se rejeitado, apenas ignorar e continuar
    });

    if (todosResultados.length === 0) {
      console.log(
        `[Open-i Provider] Nenhuma imagem encontrada para: ${diagnosticoOriginal}`
      );
      return [];
    }

    // 3. Filtrar por termos críticos bloqueados
    const resultadosFiltrados = todosResultados.filter(
      (resultado) => !temTermoCriticoBloqueado(resultado)
    );

    if (resultadosFiltrados.length === 0) {
      console.log(
        `[Open-i Provider] Nenhuma imagem válida após filtro crítico`
      );
      return [];
    }

    // 4. Rankear por relevância E prioridade didática
    // (diagnosticoKey já foi obtido no início da função)
    const resultadosRanqueados = resultadosFiltrados
      .map((resultado) => {
        const { score, termosEncontrados } = calcularScoreRelevancia(
          resultado,
          termosBusca,
          diagnosticoKey
        );
        const prioridadeDidatica = calcularPrioridadeDidatica(
          resultado,
          diagnosticoKey
        );
        return {
          resultado,
          score,
          prioridadeDidatica,
          scoreTotal: score + prioridadeDidatica, // Score combinado
          termosEncontrados,
          impression: resultado.impression || "",
        };
      })
      .filter((item) => item.score > 0) // Descartar com score ≤ 0
      .sort((a, b) => b.scoreTotal - a.scoreTotal); // Ordenar por score total

    // 5. Exigir score mínimo específico por diagnóstico
    if (diagnosticoKey === "pneumonia") {
      const imagensBoas = resultadosRanqueados.filter(
        (item) => item.score >= 50
      );
      if (imagensBoas.length === 0) {
        console.log(
          `[Open-i Provider] Nenhuma imagem com score ≥ 50 para pneumonia`
        );
        return [];
      }
      // Usar apenas as boas
      resultadosRanqueados.splice(imagensBoas.length);
      resultadosRanqueados.push(...imagensBoas.reverse());
    } else if (diagnosticoKey === "hyperinflation") {
      // Asma: score mínimo menor (flexível para normal/hiperinsuflação)
      const imagensBoas = resultadosRanqueados.filter(
        (item) => item.score >= 20 // Mais flexível para asma
      );
      if (imagensBoas.length === 0) {
        console.log(
          `[Open-i Provider] Nenhuma imagem com score ≥ 20 para asma`
        );
        return [];
      }
      // Usar apenas as boas
      resultadosRanqueados.splice(imagensBoas.length);
      resultadosRanqueados.push(...imagensBoas.reverse());
    } else if (diagnosticoKey === "tuberculosis") {
      // TB: score mínimo flexível (TB é rara, aceitar imagens compatíveis)
      const imagensBoas = resultadosRanqueados.filter(
        (item) => item.score >= 30 // Mais flexível para TB (imagens raras)
      );
      if (imagensBoas.length === 0) {
        console.log(
          `[Open-i Provider] ⚠️ Nenhuma imagem com score ≥ 30 para tuberculose. Tentando com score ≥ 20...`
        );
        // Fallback: aceitar score mínimo ainda mais baixo
        const imagensMuitoFlexiveis = resultadosRanqueados.filter(
          (item) => item.score > 0
        );
        if (imagensMuitoFlexiveis.length === 0) {
          console.log(
            `[Open-i Provider] Nenhuma imagem de tuberculose encontrada`
          );
          return [];
        }
        resultadosRanqueados.splice(imagensMuitoFlexiveis.length);
        resultadosRanqueados.push(...imagensMuitoFlexiveis.reverse());
      } else {
        // Usar apenas as boas
        resultadosRanqueados.splice(imagensBoas.length);
        resultadosRanqueados.push(...imagensBoas.reverse());
      }
    }

    // 6. Retornar até 5 imagens melhor ranqueadas
    const imagensRetorno = resultadosRanqueados.slice(0, 5);

    if (imagensRetorno.length === 0) {
      console.log(
        `[Open-i Provider] Nenhuma imagem passou na curadoria`
      );
      return [];
    }

    // 7. Converter todas as imagens com metadados (filtrando inválidas)
    const imagensComMetadados = imagensRetorno
      .map((item, indice) => {
        const imagem = converterParaImagemRadiologica(
          item.resultado,
          diagnosticoOriginal
        );

        // ✅ Descartar se imageUrl for inválido (retorna null)
        if (!imagem) {
          return null;
        }

        (imagem.metadadosOriginais as any).scoreRelevancia = item.score;
        (imagem.metadadosOriginais as any).prioridadeDidatica =
          item.prioridadeDidatica;
        (imagem.metadadosOriginais as any).scoreTotal = item.scoreTotal;
        (imagem.metadadosOriginais as any).termosEncontrados =
          item.termosEncontrados;
        (imagem.metadadosOriginais as any).posicaoGaleria = indice + 1;
        (imagem.metadadosOriginais as any).motivoSelecao =
          `Pos ${indice + 1}: Score=${item.score} + Didática=${item.prioridadeDidatica} = ${item.scoreTotal}`;

        return imagem;
      })
      .filter((img) => img !== null) as ImagemRadiologica[];

    console.log(
      `[Open-i Provider] ✅ ${imagensComMetadados.length} imagem(ns) selecionada(s) para galeria`
    );
    imagensComMetadados.forEach((img, i) => {
      console.log(
        `  ${i + 1}. ${img.imageId} (Score: ${(img.metadadosOriginais as any).scoreTotal})`
      );
    });

    return imagensComMetadados;
  } catch (erro) {
    console.error(
      "[Open-i Provider] Erro ao buscar imagens:",
      erro instanceof Error ? erro.message : "Desconhecido"
    );
    return [];
  }
}

// ============================================================================
// FUNÇÃO PRINCIPAL (INTERFACE PÚBLICA)
// ============================================================================

/**
 * Busca imagem no Open-i
 * API pública, funciona sem configuração adicional
 */
export async function buscarImagemOpenI(
  parametros: ParametrosBuscaImagem
): Promise<ResultadoBuscaImagem | ErroProviderNIH> {
  // Validar configuração (Open-i SEMPRE está pronto)
  const configValida = verificarConfiguracaoOpenI()

  if (!configValida.valido) {
    return {
      sucesso: false,
      motivo: `Open-i não disponível: ${configValida.motivo}`,
      requerConfiguracao: true,
    }
  }

  try {
    // Buscar em Open-i (API pública)
    const imagemRadiologica = await buscarEmOpenI(parametros)

    if (!imagemRadiologica) {
      return {
        sucesso: false,
        motivo: `Imagem radiológica indisponível para este caso.`,
      }
    }

    return {
      sucesso: true,
      imagem: imagemRadiologica,
    }
  } catch (erro) {
    console.error(
      "[Open-i Provider] Erro ao buscar imagem:",
      erro instanceof Error ? erro.message : "Desconhecido"
    )

    return {
      sucesso: false,
      motivo: "Imagem radiológica indisponível para este caso.",
    }
  }
}

// ============================================================================
// INTERFACE PÚBLICA (COMPATÍVEL COM NIH PROVIDER)
// ============================================================================

export const openiProvider = {
  buscarImagemOpenI,
  estaConfigurado: () => verificarConfiguracaoOpenI().valido,
  obterStatusConfiguracao: obterStatusConfiguracaoOpenI,
}

export type OpeniProvider = typeof openiProvider

// ============================================================================
// MODO OPEN-I BRUTO (SEM SCORING, SEM FILTERING)
// ============================================================================

/**
 * Busca primeira imagem do Open-i SEM scoring, SEM filtering, SEM fallback.
 * Máxima simplicidade: termo → Open-i → primeira URL válida → retorna.
 *
 * @param termoBusca string em inglês (ex: "pneumonia", "tuberculosis")
 * @returns { imageUrl, imageId } ou null se não encontrou
 */
export async function buscarPrimeiraImagemOpenIBruta(
  termoBusca: string
): Promise<{ imageUrl: string | null; imageId: string | null }> {
  try {
    // 1. Consultar Open-i diretamente (sem cache, sem curadoria)
    const resultados = await consultarOpenI(termoBusca, 1, 6000);

    // 2. Se não achou nada, retornar nulo
    if (!resultados || resultados.length === 0) {
      return { imageUrl: null, imageId: null };
    }

    // 3. Pegar PRIMEIRO resultado
    const primeiroResultado = resultados[0];

    // 4. Extrair imageUrl
    const urlBase = "https://openi.nlm.nih.gov";
    const rawImageUrl = primeiroResultado.imgLarge
      ? `${urlBase}${primeiroResultado.imgLarge}`
      : null;

    // 5. Validar URL (aceitar apenas HTTPS válidas)
    const imageUrl = normalizarOpenIImageUrl(rawImageUrl);

    if (!imageUrl) {
      return { imageUrl: null, imageId: null };
    }

    // 6. Extrair imageId
    const imageId = primeiroResultado.uId || primeiroResultado.uid || null;

    return { imageUrl, imageId };
  } catch (erro) {
    console.error(
      `[Raw Open-i] Erro ao buscar: ${erro instanceof Error ? erro.message : "desconhecido"}`
    );
    return { imageUrl: null, imageId: null };
  }
}

// ============================================================================
// EXPORTS ADICIONAIS PARA FASE 1
// ============================================================================

// Exportar função para buscar múltiplas imagens (usada em applyPhase1Scoring)
export { buscarMultiplasImagensEmOpenI }
