/**
 * Sistema de Scoring por Metadados Open-i
 * Fase 1: Seleção de imagens baseada 100% em metadados
 *
 * Não há curadoria visual. Decisão é feita unicamente com:
 * - impression (impressão diagnóstica)
 * - findings (achados descritos)
 * - problems (problemas identificados)
 * - meshTerms (termos MeSH da NIH)
 * - caption (legenda)
 * - title (título)
 * - abstract (resumo, se disponível)
 *
 * Regra de Score:
 * - +50 por termo positivo forte
 * - +20 por termo positivo secundário
 * - -100 por termo bloqueador
 * - -200 por termo incompatível grave
 * - Rejeitar se score final < min_score da patologia
 */

import { DiagnosisConfig } from "./diagnoses-open-i-mapping";

/**
 * Resultado da API Open-i (formato simplificado)
 * Contém apenas os campos necessários para scoring
 */
export interface OpenIImageMetadata {
  id: string;
  impression?: string;
  findings?: string;
  problems?: string[];
  meshTerms?: string[];
  caption?: string;
  title?: string;
  abstract?: string;
  [key: string]: any;
}

/**
 * Resultado do scoring de uma imagem
 */
export interface ScoreResult {
  imageId: string;
  totalScore: number;
  scoreBreakdown: {
    strongPositive: number; // +50 each
    secondaryPositive: number; // +20 each
    blocker: number; // -100 each
    criticalBlocker: number; // -200 each
  };
  termsFound: {
    strongPositive: string[];
    secondaryPositive: string[];
    blockers: string[];
    criticalBlockers: string[];
  };
  isRejected: boolean;
  rejectionReason?: string;
}

/**
 * Concatena todos os metadados textuais de uma imagem
 * Para busca case-insensitive
 */
function concatenateMetadata(image: OpenIImageMetadata): string {
  const parts = [
    image.impression || "",
    image.findings || "",
    (image.problems || []).join(" "),
    (image.meshTerms || []).join(" "),
    image.caption || "",
    image.title || "",
    image.abstract || "",
  ];

  return parts.join(" ").toLowerCase();
}

/**
 * Pontua uma imagem contra uma configuração de diagnóstico
 *
 * @param image Metadados da imagem Open-i
 * @param diagnosisConfig Configuração do diagnóstico (TB, PAC, etc)
 * @returns Resultado detalhado do scoring
 */
export function scoreOpenIImage(
  image: OpenIImageMetadata,
  diagnosisConfig: DiagnosisConfig
): ScoreResult {
  const fullText = concatenateMetadata(image);

  let score = 0;
  const scoreBreakdown = {
    strongPositive: 0,
    secondaryPositive: 0,
    blocker: 0,
    criticalBlocker: 0,
  };

  const termsFound = {
    strongPositive: [] as string[],
    secondaryPositive: [] as string[],
    blockers: [] as string[],
    criticalBlockers: [] as string[],
  };

  // ========================================================================
  // ETAPA 1: Termos positivos fortes (+50 cada)
  // ========================================================================
  for (const term of diagnosisConfig.expected_keywords) {
    if (fullText.includes(term.toLowerCase())) {
      score += 50;
      scoreBreakdown.strongPositive += 50;
      termsFound.strongPositive.push(term);
    }
  }

  // ========================================================================
  // ETAPA 2: Termos positivos secundários (+20 cada)
  // ========================================================================
  if (diagnosisConfig.secondary_keywords) {
    for (const term of diagnosisConfig.secondary_keywords) {
      if (fullText.includes(term.toLowerCase())) {
        score += 20;
        scoreBreakdown.secondaryPositive += 20;
        termsFound.secondaryPositive.push(term);
      }
    }
  }

  // ========================================================================
  // ETAPA 3: Termos bloqueadores (-100 cada)
  // ========================================================================
  for (const term of diagnosisConfig.excluded_keywords) {
    if (fullText.includes(term.toLowerCase())) {
      score -= 100;
      scoreBreakdown.blocker -= 100;
      termsFound.blockers.push(term);
    }
  }

  // ========================================================================
  // ETAPA 4: Termos incompatíveis graves (-200 cada)
  // ========================================================================
  if (diagnosisConfig.critical_blockers) {
    for (const term of diagnosisConfig.critical_blockers) {
      if (fullText.includes(term.toLowerCase())) {
        score -= 200;
        scoreBreakdown.criticalBlocker -= 200;
        termsFound.criticalBlockers.push(term);
      }
    }
  }

  // ========================================================================
  // ETAPA 5: Validação final
  // ========================================================================
  const isRejected = score < diagnosisConfig.min_score;

  // Se foi rejeitada por score, determinar motivo
  let rejectionReason: string | undefined;
  if (isRejected) {
    if (termsFound.criticalBlockers.length > 0) {
      rejectionReason = `Contém termo incompatível: ${termsFound.criticalBlockers[0]}`;
    } else if (termsFound.blockers.length > 0) {
      rejectionReason = `Score baixo (${score} < ${diagnosisConfig.min_score}). Bloqueadores: ${termsFound.blockers.join(", ")}`;
    } else {
      rejectionReason = `Score insuficiente: ${score} < ${diagnosisConfig.min_score}. Nenhum termo forte encontrado.`;
    }
  }

  return {
    imageId: image.id,
    totalScore: Math.max(score, 0), // Não permitir scores negativos
    scoreBreakdown,
    termsFound,
    isRejected,
    rejectionReason,
  };
}

/**
 * Filtra e rankeia múltiplas imagens contra uma configuração
 *
 * @param images Array de imagens Open-i
 * @param diagnosisConfig Configuração do diagnóstico
 * @returns Array de imagens aprovadas, ordenado por score (maior primeiro)
 */
export function filterAndRankImages(
  images: OpenIImageMetadata[],
  diagnosisConfig: DiagnosisConfig
): {
  approved: Array<OpenIImageMetadata & { score: ScoreResult }>;
  rejected: Array<OpenIImageMetadata & { score: ScoreResult; reason: string }>;
} {
  const scored = images.map((image) => ({
    image,
    score: scoreOpenIImage(image, diagnosisConfig),
  }));

  const approved = scored
    .filter((item) => !item.score.isRejected)
    .sort((a, b) => b.score.totalScore - a.score.totalScore)
    .map((item) => ({
      ...item.image,
      score: item.score,
    }));

  const rejected = scored
    .filter((item) => item.score.isRejected)
    .map((item) => ({
      ...item.image,
      score: item.score,
      reason: item.score.rejectionReason || "Score insuficiente",
    }));

  return { approved, rejected };
}

