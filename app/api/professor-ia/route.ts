// ============================================================================
// POST /api/professor-ia — Orquestrador generativo controlado (Fase 20)
// ----------------------------------------------------------------------------
// Transforma UM LessonStep (do ProfessorLesson → LessonFlow) em fala natural do
// professor. Funciona apenas com OPENAI_API_KEY; sem chave (ou em erro) devolve o
// fallback estático do próprio step. NÃO altera nota/feedback/HealthBench, NÃO
// salva em banco, NÃO cria memória. try/catch em tudo; nunca quebra a aplicação.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { generateProfessorStepResponse, type CallModel, type OrchestratorInput } from "@/lib/professor-ia/orchestrator";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<OrchestratorInput>;
    if (!body?.lesson) {
      return NextResponse.json({ ok: false, error: "Body inválido: 'lesson' é obrigatório." }, { status: 400 });
    }

    const input: OrchestratorInput = {
      lesson: body.lesson,
      currentStepId: body.currentStepId,
      studentMessage: body.studentMessage,
      history: body.history,
    };

    // Modelo só é injetado se houver chave. Sem chave → callModel undefined → fallback.
    const client = openai;
    const callModel: CallModel | undefined = client
      ? async ({ system, user }) => {
          const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.4,
            max_tokens: 320,
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
          });
          return completion.choices?.[0]?.message?.content ?? "";
        }
      : undefined;

    const result = await generateProfessorStepResponse(input, callModel);

    return NextResponse.json(
      {
        ok: result.ok,
        professorMessage: result.professorMessage,
        currentStepId: result.currentStepId,
        nextStepId: result.nextStepId,
        shouldWaitForStudent: result.shouldWaitForStudent,
        resourcesToShow: result.resourcesToShow,
        safetyNotes: result.safetyNotes,
        experimental: true,
        source: result.source,
        debug: result.debug,
      },
      { status: 200 }
    );
  } catch (e) {
    // Nunca quebrar: fallback duro.
    console.error("Erro no orquestrador Professor IA:", e);
    return NextResponse.json(
      {
        ok: false,
        professorMessage: "Não foi possível gerar a fala do professor agora. Tente novamente mais tarde.",
        shouldWaitForStudent: false,
        resourcesToShow: [],
        safetyNotes: [],
        experimental: true,
        source: "fallback",
      },
      { status: 200 }
    );
  }
}
