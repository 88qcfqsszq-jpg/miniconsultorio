/**
 * Analytics — base para dashboards futuros (inspirado no healthbench_analysis.ipynb).
 *
 * Funções puras de agregação sobre tentativas persistidas. Não cria dashboard
 * agora; deixa as funções prontas.
 */

import type { HealthBenchAttemptResult } from "./types";

/** Média por competência (axis:*) entre várias tentativas. */
export function mediaPorCompetencia(
  attempts: HealthBenchAttemptResult[]
): Record<string, number> {
  return mediaPorMapa(attempts.map((a) => a.metrics.competencyScores));
}

/** Média por tema (theme:*) entre várias tentativas. */
export function mediaPorTema(
  attempts: HealthBenchAttemptResult[]
): Record<string, number> {
  return mediaPorMapa(attempts.map((a) => a.metrics.themeScores));
}

function mediaPorMapa(mapas: Record<string, number>[]): Record<string, number> {
  const soma: Record<string, number> = {};
  const cont: Record<string, number> = {};
  for (const mapa of mapas) {
    for (const [k, v] of Object.entries(mapa)) {
      soma[k] = (soma[k] ?? 0) + v;
      cont[k] = (cont[k] ?? 0) + 1;
    }
  }
  const out: Record<string, number> = {};
  for (const k of Object.keys(soma)) out[k] = soma[k] / cont[k];
  return out;
}

/** Erros críticos recorrentes (por critério). */
export function errosCriticosRecorrentes(
  attempts: HealthBenchAttemptResult[]
): Array<{ criterion: string; ocorrencias: number }> {
  const contagem: Record<string, number> = {};
  for (const a of attempts) {
    for (const g of a.grades) {
      if (g.type === "negative" && g.criteria_met) {
        contagem[g.criterion] = (contagem[g.criterion] ?? 0) + 1;
      }
    }
  }
  return Object.entries(contagem)
    .map(([criterion, ocorrencias]) => ({ criterion, ocorrencias }))
    .sort((a, b) => b.ocorrencias - a.ocorrencias);
}

/** Evolução da nota (overall_score) por tentativa, em ordem cronológica. */
export function evolucaoPorTentativa(
  attempts: HealthBenchAttemptResult[]
): Array<{ attemptId: string; createdAt: string; overall_score: number }> {
  return [...attempts]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((a) => ({
      attemptId: a.attemptId,
      createdAt: a.createdAt,
      overall_score: a.metrics.overall_score,
    }));
}

/** Casos com pior desempenho médio. */
export function casosComPiorDesempenho(
  attempts: HealthBenchAttemptResult[]
): Array<{ casoId: number; mediaScore: number; tentativas: number }> {
  const soma: Record<number, number> = {};
  const cont: Record<number, number> = {};
  for (const a of attempts) {
    soma[a.casoId] = (soma[a.casoId] ?? 0) + a.metrics.overall_score;
    cont[a.casoId] = (cont[a.casoId] ?? 0) + 1;
  }
  return Object.keys(soma)
    .map((id) => {
      const casoId = Number(id);
      return {
        casoId,
        mediaScore: soma[casoId] / cont[casoId],
        tentativas: cont[casoId],
      };
    })
    .sort((a, b) => a.mediaScore - b.mediaScore);
}
