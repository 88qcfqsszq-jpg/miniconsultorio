/**
 * Legacy Adapter — ponte entre o resultado do /api/corrigir (FeedbackOSCE) e o HealthBench.
 *
 * Permite, durante a transição, comparar nota/feedback antigos vs HealthBench.
 * NÃO altera /api/corrigir.
 */

import type {
  LegacyCorrectionNormalized,
  LegacyVsHealthBenchComparison,
} from "./attempt-schema";
import type { HealthBenchEvaluationResult } from "./types";

/** Normaliza o objeto FeedbackOSCE retornado pelo /api/corrigir. */
export function normalizeLegacyCorrectionResult(
  result: any
): LegacyCorrectionNormalized | null {
  if (!result || typeof result !== "object") return null;

  const nota = Number(result.nota);
  const normalizado: LegacyCorrectionNormalized = {
    nota: Number.isFinite(nota) ? nota : 0,
    pontuacaoMaxima: 20, // escala do Mini Consultório
    classificacao: typeof result.classificacao === "string" ? result.classificacao : undefined,
    errosCriticos: Array.isArray(result.errosCriticos)
      ? result.errosCriticos.filter((e: unknown) => typeof e === "string")
      : [],
    raw: result,
  };

  console.log("[HEALTHBENCH LEGACY ADAPTER] normalizeLegacyCorrectionResult", {
    nota: normalizado.nota,
    classificacao: normalizado.classificacao,
  });

  return normalizado;
}

/** Compara nota legada vs HealthBench. */
export function compareLegacyVsHealthBench(
  legacy: LegacyCorrectionNormalized | null,
  healthbench: HealthBenchEvaluationResult
): LegacyVsHealthBenchComparison {
  const legacyNota = legacy ? legacy.nota : null;
  const healthBenchNota = healthbench.notaFinal;
  const diferenca = legacyNota !== null ? Math.round((healthBenchNota - legacyNota) * 10) / 10 : null;

  const comparison: LegacyVsHealthBenchComparison = {
    legacyNota,
    healthBenchNota,
    diferenca,
    legacyClassificacao: legacy?.classificacao,
    healthBenchPassed: healthbench.passed,
    divergenciaSignificativa: diferenca !== null && Math.abs(diferenca) > 3,
  };

  console.log("[HEALTHBENCH LEGACY ADAPTER] compareLegacyVsHealthBench", {
    legacyNota,
    healthBenchNota,
    diferenca,
    divergente: comparison.divergenciaSignificativa,
  });

  return comparison;
}
