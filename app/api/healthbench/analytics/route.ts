/**
 * GET /api/healthbench/analytics
 * Analytics inicial agregando as tentativas persistidas.
 *
 * Reaproveita lib/healthbench/analytics.ts (não duplica lógica de agregação).
 * Aceita ?casoId= para filtrar por caso.
 */

import { NextRequest, NextResponse } from "next/server";
import { listAllAttempts, listAttemptsByCase } from "@/lib/healthbench/attempt-store";
import {
  mediaPorCompetencia,
  mediaPorTema,
  errosCriticosRecorrentes,
  evolucaoPorTentativa,
  casosComPiorDesempenho,
} from "@/lib/healthbench/analytics";
import type { HealthBenchAttemptRecord } from "@/lib/healthbench/attempt-schema";
import type { HealthBenchAttemptResult } from "@/lib/healthbench/types";

/** Adapta o record de produto para o shape técnico esperado por analytics.ts. */
function recordParaAttemptResult(r: HealthBenchAttemptRecord): HealthBenchAttemptResult | null {
  const hb = r.healthBenchResult;
  if (!hb) return null;
  return {
    attemptId: r.attemptId,
    casoId: r.casoId,
    createdAt: r.createdAt,
    transcript: r.transcript,
    rubrics: [],
    grades: hb.grades,
    metrics: {
      overall_score: hb.score01,
      competencyScores: hb.competencyScores,
      themeScores: hb.themeScores,
      criticalErrorCount: hb.criticalErrors.length,
    },
    feedback: hb.professorFeedback,
    usage: hb.usage,
  };
}

export async function GET(request: NextRequest) {
  const casoIdParam = request.nextUrl.searchParams.get("casoId");

  const records = casoIdParam ? listAttemptsByCase(casoIdParam) : listAllAttempts();
  const attempts = records
    .map(recordParaAttemptResult)
    .filter((a): a is HealthBenchAttemptResult => a !== null);

  // tentativas por caso
  const tentativasPorCaso: Record<number, number> = {};
  for (const r of records) {
    tentativasPorCaso[r.casoId] = (tentativasPorCaso[r.casoId] ?? 0) + 1;
  }

  console.log("[HEALTHBENCH ANALYTICS]", {
    casoId: casoIdParam ?? "todos",
    tentativas: attempts.length,
  });

  return NextResponse.json({
    totalTentativas: attempts.length,
    mediaPorCompetencia: mediaPorCompetencia(attempts),
    mediaPorTema: mediaPorTema(attempts),
    errosCriticosRecorrentes: errosCriticosRecorrentes(attempts),
    tentativasPorCaso,
    evolucaoPorTentativa: evolucaoPorTentativa(attempts),
    casosComPiorDesempenho: casosComPiorDesempenho(attempts),
  });
}
