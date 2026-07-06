/**
 * Endpoint: POST /api/healthbench/evaluate
 *
 * MiniConsultorio HealthBench Engine — avaliação estruturada critério-por-critério.
 * Usa a rubrica OSCE existente do caso como fonte oficial.
 *
 * Entrada (JSON):
 * {
 *   casoId, attemptId?,
 *   chatMessages, eventosDoAtendimento?, physicalExamEvents,
 *   vitalSignsEvents, examRequests, soap, diagnosisAndPlan, mode?
 * }
 *
 * Saída: HealthBenchEvaluationResult
 */

import { NextRequest, NextResponse } from "next/server";
import { casosOSCE } from "@/data/casos-osce";
import { evaluateHealthBenchAttempt } from "@/lib/healthbench/evaluator";
import type { HealthBenchAtendimentoInput } from "@/lib/healthbench/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as HealthBenchAtendimentoInput;

    console.log("[HEALTHBENCH AUDIT] Requisição recebida", {
      casoId: body?.casoId,
      attemptId: body?.attemptId,
      chat: body?.chatMessages?.length ?? 0,
    });

    if (body?.casoId === undefined || body?.casoId === null) {
      return NextResponse.json(
        { error: "casoId é obrigatório." },
        { status: 400 }
      );
    }

    const caso = casosOSCE.find((c) => String(c.id) === String(body.casoId));
    if (!caso) {
      return NextResponse.json(
        { error: `Caso ${body.casoId} não encontrado.` },
        { status: 404 }
      );
    }

    const resultado = await evaluateHealthBenchAttempt(body, caso, {
      pontuacaoMaxima: 20,
    });

    return NextResponse.json(resultado);
  } catch (erro) {
    console.error("[HEALTHBENCH AUDIT] Erro na avaliação:", erro);
    return NextResponse.json(
      {
        error: "Falha ao avaliar atendimento.",
        detalhe: erro instanceof Error ? erro.message : "desconhecido",
      },
      { status: 500 }
    );
  }
}
