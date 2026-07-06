/**
 * Integração Fase 1: Diagnostics Mapping + Open-i Scoring
 *
 * Este arquivo conecta:
 * 1. diagnoses-open-i-mapping.ts (P0: TB + PAC)
 * 2. open-i-score.ts (Função de scoring por metadados)
 * 3. providers/openiCloudProvider.ts (Busca de imagens)
 *
 * Uso:
 * - Detectar qual diagnosisKey usar baseado no diagnóstico clínico
 * - Aplicar scoring automático nas imagens do Open-i
 * - Retornar apenas imagens aprovadas
 */

import {
  resolveDiagnosisKey,
  getDiagnosisConfig,
  radiologyDiagnosisMapping,
} from "./diagnoses-open-i-mapping";
import {
  scoreOpenIImage,
  filterAndRankImages,
  OpenIImageMetadata,
  ScoreResult,
} from "./open-i-score";

/**
 * Resolve e valida um diagnóstico para ter mapeamento P0
 *
 * @param diagnosticoPtBr Diagnóstico em português (do caso clínico)
 * @returns { diagnosisKey, config } ou { error } se não mapped
 */
export function resolveDiagnosisForPhase1(diagnosticoPtBr: string): {
  diagnosisKey: string;
  config: typeof radiologyDiagnosisMapping[string];
} | { error: string } {
  // Tentar resolver
  const diagnosisKey = resolveDiagnosisKey(diagnosticoPtBr);

  if (!diagnosisKey) {
    return {
      error: `Diagnóstico não mapeado em Fase 1: "${diagnosticoPtBr}". Mapeamentos disponíveis: ${Object.keys(radiologyDiagnosisMapping).join(", ")}`,
    };
  }

  const config = getDiagnosisConfig(diagnosisKey);
  if (!config) {
    return {
      error: `Configuração não encontrada para diagnosisKey: ${diagnosisKey}`,
    };
  }

  return { diagnosisKey, config };
}

/**
 * Aplica scoring automático em imagens Open-i
 *
 * @param images Imagens retornadas pelo Open-i (com metadados)
 * @param diagnosticoPtBr Diagnóstico clínico em português
 * @returns { approved, rejected, summary } ou { error }
 */
export function applyPhase1Scoring(
  images: any[], // Qualquer formato de imagem do Open-i
  diagnosticoPtBr: string
): {
  approved: Array<{
    image: any;
    score: ScoreResult;
    expectedFinding: string;
  }>;
  rejected: Array<{
    image: any;
    score: ScoreResult;
    reason: string;
  }>;
  summary: {
    diagnosisKey: string;
    totalImages: number;
    approvedCount: number;
    rejectedCount: number;
    minScore: number;
  };
} | { error: string } {
  // 1. Resolver diagnóstico
  const resolution = resolveDiagnosisForPhase1(diagnosticoPtBr);
  if ("error" in resolution) {
    return { error: resolution.error };
  }

  const { diagnosisKey, config } = resolution;

  // 2. Converter imagens para formato esperado (com metadados)
  const imagensMetadata: OpenIImageMetadata[] = images.map((img) => ({
    id: img.id || img.imageId || img.uId || `unknown-${Math.random()}`,
    impression: img.impression || img.metadadosOriginais?.impression || "",
    findings: img.findings || img.metadadosOriginais?.findings || "",
    problems: img.problems || img.metadadosOriginais?.problems || [],
    meshTerms: img.meshTerms || img.metadadosOriginais?.meshTerms || [],
    caption: img.caption || img.metadadosOriginais?.caption || "",
    title: img.title || img.metadadosOriginais?.title || "",
    abstract: img.abstract || img.metadadosOriginais?.abstract || "",
    // Preservar objeto original para retorno
    _original: img,
  }));

  // 3. Aplicar scoring
  const { approved, rejected } = filterAndRankImages(imagensMetadata, config);

  // 4. Formatar retorno (preservando imagem original)
  const approvedFormatted = approved.map((item) => ({
    image: item._original,
    score: item.score,
    expectedFinding: config.expected_finding_pt_br,
  }));

  const rejectedFormatted = rejected.map((item) => ({
    image: item._original,
    score: item.score,
    reason: item.reason,
  }));

  return {
    approved: approvedFormatted,
    rejected: rejectedFormatted,
    summary: {
      diagnosisKey,
      totalImages: images.length,
      approvedCount: approvedFormatted.length,
      rejectedCount: rejectedFormatted.length,
      minScore: config.min_score,
    },
  };
}

/**
 * Valida se um diagnóstico está mapeado em P0
 *
 * @param diagnosticoPtBr Diagnóstico clínico
 * @returns true se mapeado, false caso contrário
 */
export function isPhase1Mapped(diagnosticoPtBr: string): boolean {
  const result = resolveDiagnosisKey(diagnosticoPtBr);
  return result !== null;
}

/**
 * Lista os diagnósticos mapeados em P0
 *
 * @returns Array de diagnosisKeys disponíveis
 */
export function listPhase1Diagnoses(): Array<{
  diagnosisKey: string;
  aliases_pt: string[];
  aliases_en: string[];
  minScore: number;
}> {
  return Object.entries(radiologyDiagnosisMapping).map(([key, config]) => ({
    diagnosisKey: key,
    aliases_pt: config.aliases_pt,
    aliases_en: config.aliases_en,
    minScore: config.min_score,
  }));
}

/**
 * Exemplo de uso da integração
 */
export function exemploUsoCargaComScoring() {
  // Simulação: imagens retornadas do Open-i
  const imagensOpenI = [
    {
      id: "openi-001",
      impression:
        "Left lower lobe consolidation. Findings consistent with pneumonia.",
      findings: "Consolidation in left lower lobe",
      problems: ["pneumonia", "consolidation"],
      meshTerms: ["pneumonia", "radiography"],
      caption: "Patient with pneumonia",
      title: "CXR: Pneumonia",
      imageUrl: "https://example.com/image1.jpg",
    },
    {
      id: "openi-002",
      impression: "Normal chest radiograph. No acute findings.",
      findings: "No focal abnormalities",
      problems: [],
      meshTerms: ["normal"],
      caption: "Normal study",
      title: "Normal CXR",
      imageUrl: "https://example.com/image2.jpg",
    },
  ];

  // Diagnóstico do caso
  const diagnostico = "Pneumonia adquirida na comunidade";

  // Aplicar scoring
  const result = applyPhase1Scoring(imagensOpenI, diagnostico);

  if ("error" in result) {
    console.log(`Erro: ${result.error}`);
  } else {
    console.log(`Diagnóstico: ${result.summary.diagnosisKey}`);
    console.log(`Aprovadas: ${result.approved.length}`);
    console.log(`Rejeitadas: ${result.rejected.length}`);
    console.log(`Imagens aprovadas:`);
    result.approved.forEach((item) => {
      console.log(
        `  - ${item.image.id} (Score: ${item.score.totalScore})`
      );
    });
  }
}
