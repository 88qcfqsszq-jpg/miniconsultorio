/**
 * Metrics — agrega scores por eixo (axis), tema (theme) e skill.
 * Inspirado em healthbench_eval (tag-level scoring) sem copiar literalmente.
 */

import type { HealthBenchCriterionGrade } from "./types";

/** Score por grupo de tags com um dado prefixo (ex.: "axis:"). */
function scorePorPrefixo(
  grades: HealthBenchCriterionGrade[],
  prefixo: string
): Record<string, number> {
  const possiveis: Record<string, number> = {};
  const obtidos: Record<string, number> = {};

  for (const g of grades) {
    for (const tag of g.tags) {
      if (!tag.startsWith(prefixo)) continue;
      if (g.points > 0) {
        possiveis[tag] = (possiveis[tag] ?? 0) + g.points;
        if (g.criteria_met) obtidos[tag] = (obtidos[tag] ?? 0) + g.points_awarded;
        else obtidos[tag] = obtidos[tag] ?? 0;
      }
    }
  }

  const resultado: Record<string, number> = {};
  for (const tag of Object.keys(possiveis)) {
    const max = possiveis[tag];
    resultado[tag] = max > 0 ? Math.min(1, Math.max(0, (obtidos[tag] ?? 0) / max)) : 0;
  }
  return resultado;
}

export interface MetricsResult {
  overall_score: number;
  competencyScores: Record<string, number>; // axis:*
  themeScores: Record<string, number>; // theme:*
  skillScores: Record<string, number>; // skill:*
  criteriosCumpridos: number;
  criteriosFalhos: number;
  criticalErrorCount: number;
}

export function calcularMetrics(
  grades: HealthBenchCriterionGrade[],
  overall_score: number
): MetricsResult {
  const criteriosCumpridos = grades.filter(
    (g) => g.type !== "negative" && g.criteria_met
  ).length;
  const criteriosFalhos = grades.filter(
    (g) => g.type !== "negative" && !g.criteria_met
  ).length;
  const criticalErrorCount = grades.filter(
    (g) => g.type === "negative" && g.criteria_met
  ).length;

  return {
    overall_score,
    competencyScores: scorePorPrefixo(grades, "axis:"),
    themeScores: scorePorPrefixo(grades, "theme:"),
    skillScores: scorePorPrefixo(grades, "skill:"),
    criteriosCumpridos,
    criteriosFalhos,
    criticalErrorCount,
  };
}
