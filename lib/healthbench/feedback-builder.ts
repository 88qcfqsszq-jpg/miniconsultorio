/**
 * Feedback Builder — gera o feedback do professor e o plano de melhoria
 * a partir das grades, métricas e erros críticos. Texto determinístico
 * (sem IA extra) para ser barato, rápido e auditável.
 */

import {
  AXIS_LABELS,
  type HealthBenchCriterionGrade,
  DISCLAIMER_EDUCACIONAL,
} from "./types";
import type { MetricsResult } from "./metrics";

function rotuloAxis(tag: string): string {
  return AXIS_LABELS[tag] ?? tag.replace(/^axis:/, "");
}

/** Eixos com menor desempenho viram foco de treino. */
export function construirNextTrainingFocus(metrics: MetricsResult): string[] {
  const eixos = Object.entries(metrics.competencyScores)
    .sort((a, b) => a[1] - b[1])
    .filter(([, score]) => score < 0.8)
    .slice(0, 3)
    .map(([tag]) => rotuloAxis(tag));
  return eixos;
}

export function construirFeedbackProfessor(
  grades: HealthBenchCriterionGrade[],
  metrics: MetricsResult,
  criticalErrors: HealthBenchCriterionGrade[],
  notaFinal: number,
  pontuacaoMaxima: number
): string {
  const linhas: string[] = [];

  linhas.push(
    `Nota: ${notaFinal.toFixed(1)}/${pontuacaoMaxima} (${Math.round(
      metrics.overall_score * 100
    )}% da rubrica).`
  );

  // Pontos fortes
  const fortes = grades
    .filter((g) => g.type !== "negative" && g.criteria_met)
    .slice(0, 4)
    .map((g) => g.criterion);
  if (fortes.length) {
    linhas.push(`\nPontos fortes:\n- ${fortes.join("\n- ")}`);
  }

  // A melhorar
  const fracos = grades
    .filter((g) => g.type !== "negative" && !g.criteria_met)
    .slice(0, 5)
    .map((g) => `${g.criterion} — ${g.explanation}`);
  if (fracos.length) {
    linhas.push(`\nA melhorar:\n- ${fracos.join("\n- ")}`);
  }

  // Erros críticos
  if (criticalErrors.length) {
    linhas.push(
      `\n⚠️ Erros críticos / itens de segurança:\n- ${criticalErrors
        .map((g) => `${g.criterion} — ${g.explanation}`)
        .join("\n- ")}`
    );
  }

  // Foco de treino
  const foco = construirNextTrainingFocus(metrics);
  if (foco.length) {
    linhas.push(`\nFoco de treino sugerido: ${foco.join(", ")}.`);
  }

  linhas.push(`\n${DISCLAIMER_EDUCACIONAL}`);

  return linhas.join("\n");
}
