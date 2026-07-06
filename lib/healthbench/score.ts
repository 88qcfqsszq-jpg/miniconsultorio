/**
 * Score — cálculo inspirado no HealthBench (calculate_score).
 *
 * max_possible_score = soma dos points > 0
 * achieved_score     = soma dos points_awarded (positivos somam, negativos descontam)
 * score01            = clamp(achieved / max_possible, 0, 1)
 * notaFinal          = score01 * pontuacaoMaxima (padrão 20 no Mini Consultório)
 */

import type { HealthBenchCriterionGrade } from "./types";

export interface ScoreResult {
  score01: number;
  achievedScore: number;
  maxPossibleScore: number;
  notaFinal: number;
  pontuacaoMaxima: number;
  passed: boolean;
}

export function calcularScore(
  grades: HealthBenchCriterionGrade[],
  pontuacaoMaxima = 20,
  /** limiar de aprovação na escala do app (default 17/20, alinhado ao FeedbackOSCE) */
  limiarAprovacao = 17
): ScoreResult {
  const maxPossibleScore = grades
    .filter((g) => g.points > 0)
    .reduce((acc, g) => acc + g.points, 0);

  const achievedScoreRaw = grades.reduce((acc, g) => acc + g.points_awarded, 0);
  // achieved não pode ser negativo para fins de score normalizado
  const achievedScore = Math.max(0, achievedScoreRaw);

  const score01 =
    maxPossibleScore > 0 ? Math.min(1, Math.max(0, achievedScore / maxPossibleScore)) : 0;

  const notaFinal = Math.round(score01 * pontuacaoMaxima * 10) / 10;
  const passed = notaFinal >= limiarAprovacao && !temErroCriticoCometido(grades);

  console.log("[HEALTHBENCH SCORE]", {
    achievedScore: achievedScoreRaw,
    maxPossibleScore,
    score01: Number(score01.toFixed(3)),
    notaFinal,
    passed,
  });

  return {
    score01,
    achievedScore: achievedScoreRaw,
    maxPossibleScore,
    notaFinal,
    pontuacaoMaxima,
    passed,
  };
}

/** Erro crítico cometido = grade negativo/crítico com criteria_met=true. */
export function temErroCriticoCometido(grades: HealthBenchCriterionGrade[]): boolean {
  return grades.some((g) => g.critical && g.type === "negative" && g.criteria_met);
}

export function extrairErrosCriticos(
  grades: HealthBenchCriterionGrade[]
): HealthBenchCriterionGrade[] {
  // Erros cometidos (negativos true) + itens críticos positivos NÃO cumpridos.
  return grades.filter(
    (g) =>
      (g.type === "negative" && g.criteria_met) ||
      (g.critical && g.type !== "negative" && !g.criteria_met)
  );
}
