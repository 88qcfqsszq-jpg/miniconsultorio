/**
 * Endpoint central: POST /api/osce/finalizar  (Fase 2)
 *
 * Finaliza a tentativa OSCE inteira:
 *  1. valida + carrega o caso
 *  2. monta a tentativa (attempt-builder)
 *  3. avalia com HealthBench (evaluateHealthBenchAttempt) — SOURCE OF TRUTH
 *  4. roda o legado /api/corrigir internamente (best-effort, fallback)
 *  5. persiste o HealthBenchAttemptRecord (attempt-store)
 *  6. retorna objeto unificado
 *
 * Resiliência:
 *  - se o HealthBench falhar mas o legado funcionar → retorna o legado como fallback
 *  - se o legado falhar → retorna HealthBench normalmente
 *  - nunca quebra o fluxo do usuário
 */

import { NextRequest, NextResponse } from "next/server";
import { casosV2 } from "@/data/casos-v2";
import { evaluateHealthBenchAttempt } from "@/lib/healthbench/evaluator";
import { construirSnapshot, snapshotParaAtendimentoInput } from "@/lib/healthbench/attempt-builder";
import { saveAttempt } from "@/lib/healthbench/attempt-store";
import {
  normalizeLegacyCorrectionResult,
  compareLegacyVsHealthBench,
} from "@/lib/healthbench/legacy-adapter";
import type { OSCEAttemptInput, HealthBenchAttemptRecord } from "@/lib/healthbench/attempt-schema";
import type { HealthBenchEvaluationResult } from "@/lib/healthbench/types";

/** Chama o /api/corrigir legado internamente (best-effort). */
async function rodarLegado(
  origin: string,
  input: OSCEAttemptInput
): Promise<any | null> {
  try {
    const dp = input.diagnosisAndPlan ?? {};
    // Fallback defensivo: aceita ambas as nomenclaturas (com e sem "s")
    // para compatibilidade com dados antigos durante a transição.
    const diferenciais = dp.diagnosticosDiferenciais ?? (dp as any).diagnosticosDisferenciais ?? [];
    const payloadLegado = {
      casoId: input.casoId,
      historico: input.chatMessages ?? [],
      exameFisico: (input.physicalExamEvents ?? []).map((m) => ({
        categoria: m.categoria,
        textDigitado: m.textDigitado,
        resposta: m.resposta,
      })),
      sinaisVitaisSolicitados: !!input.vitalSignsEvents?.solicitado,
      sinaisVitaisDoEstudante: input.vitalSignsEvents?.solicitado
        ? input.vitalSignsEvents?.dados
        : undefined,
      hipoteseDiagnostica: dp.hipotesePrincipal,
      diagnosticosDiferenciais: diferenciais,
      examesRealizados: (input.examRequests ?? []).map((e) => ({
        nome: e.nome,
        resultado: e.resultado,
      })),
      examesIndicadosNoFormulario: dp.examesIndicados,
      conduta: dp.conduta,
      soap: input.soap,
      tempoAtendimento: input.tempoAtendimento,
    };

    const resp = await fetch(`${origin}/api/corrigir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadLegado),
    });
    if (!resp.ok) {
      console.warn("[OSCE FINALIZAR] legado retornou", resp.status);
      return null;
    }
    return await resp.json();
  } catch (e) {
    console.warn("[OSCE FINALIZAR] legado falhou:", e);
    return null;
  }
}

export async function POST(request: NextRequest) {
  let input: OSCEAttemptInput;
  try {
    input = (await request.json()) as OSCEAttemptInput;
  } catch {
    return NextResponse.json({ success: false, error: "JSON inválido." }, { status: 400 });
  }

  console.log("[OSCE FINALIZAR] recebido", {
    casoId: input?.casoId,
    chat: input?.chatMessages?.length ?? 0,
  });

  if (input?.casoId === undefined || input?.casoId === null) {
    return NextResponse.json({ success: false, error: "casoId é obrigatório." }, { status: 400 });
  }

  const caso = casosV2.find((c: any) => String(c.id) === String(input.casoId)) as any;
  if (!caso) {
    return NextResponse.json(
      { success: false, error: `Caso ${input.casoId} não encontrado.` },
      { status: 404 }
    );
  }

  // 1. Snapshot da tentativa
  const snapshot = construirSnapshot(input);
  const attemptId = snapshot.attemptId;

  // 2. Avaliação HealthBench (source of truth) + 3. legado em paralelo
  const origin = request.nextUrl.origin;
  const atendimentoInput = snapshotParaAtendimentoInput(input, attemptId);

  const [hbSettled, legacySettled] = await Promise.allSettled([
    evaluateHealthBenchAttempt(atendimentoInput, caso, { pontuacaoMaxima: 20 }),
    rodarLegado(origin, input),
  ]);

  const healthBenchResult: HealthBenchEvaluationResult | undefined =
    hbSettled.status === "fulfilled" ? hbSettled.value : undefined;
  const legacyCorrectionResult =
    legacySettled.status === "fulfilled" ? legacySettled.value : null;

  if (hbSettled.status === "rejected") {
    console.error("[OSCE FINALIZAR] HealthBench falhou:", hbSettled.reason);
  }

  // Se AMBOS falharam, erro real
  if (!healthBenchResult && !legacyCorrectionResult) {
    return NextResponse.json(
      { success: false, error: "Falha ao avaliar atendimento (HealthBench e legado)." },
      { status: 500 }
    );
  }

  // 4. Comparação (quando há ambos)
  const legacyNorm = normalizeLegacyCorrectionResult(legacyCorrectionResult);
  const comparison =
    healthBenchResult && legacyNorm
      ? compareLegacyVsHealthBench(legacyNorm, healthBenchResult)
      : undefined;

  // 5. Persistir o record canônico
  const agora = new Date().toISOString();
  const record: HealthBenchAttemptRecord = {
    attemptId,
    casoId: snapshot.casoId,
    alunoId: snapshot.alunoId,
    startedAt: snapshot.startedAt,
    finishedAt: snapshot.finishedAt,
    mode: snapshot.mode,
    transcript: snapshot.transcript,
    eventosDoAtendimento: snapshot.eventosDoAtendimento,
    soap: snapshot.soap,
    diagnosisAndPlan: snapshot.diagnosisAndPlan,
    healthBenchResult,
    legacyCorrectionResult: legacyCorrectionResult ?? undefined,
    comparison,
    createdAt: agora,
    updatedAt: agora,
  };
  await saveAttempt(record);

  // 6. Resposta unificada
  return NextResponse.json({
    success: true,
    attemptId,
    casoId: snapshot.casoId,
    healthBenchResult,
    legacyCorrectionResult: legacyCorrectionResult ?? undefined,
    comparison,
    sourceOfTruth: healthBenchResult ? "healthbench" : "legacy",
    fallbackAvailable: !!legacyCorrectionResult,
  });
}
