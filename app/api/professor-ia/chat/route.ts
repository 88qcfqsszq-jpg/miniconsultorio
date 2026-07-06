// ============================================================================
// POST /api/professor-ia/chat — Chat ABERTO do Professor IA (Fase 24)
// ----------------------------------------------------------------------------
// Conversa LIVRE (não controlada por LessonFlow), alimentada por atendimento +
// feedback/HealthBench + StudentTrace + Gold Standard/Truth Layers + texto do PDF.
// Só com OPENAI_API_KEY; sem chave → fallback estático. NÃO altera nota/feedback/
// HealthBench, NÃO salva em banco, NÃO cria memória. try/catch em tudo.
// ============================================================================

import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { buildProfessorOpenChatContext, type BuildOpenChatContextInput } from "@/lib/professor-ia/open-chat-context";
import { validateProfessorMessageAgainstTrace } from "@/lib/professor-ia/student-trace";

interface ChatBody extends BuildOpenChatContextInput {
  atendimentoId?: string;
  messages?: Array<{ role?: string; content?: string }>;
}

const SYSTEM_RULES = [
  "Você é o Professor IA do Mini Consultório OSCE — um preceptor clínico conversando com o estudante sobre o ATENDIMENTO que ele acabou de fazer.",
  "Converse de forma NATURAL e livre, como um professor real — responda às perguntas do aluno. NÃO é uma aula em etapas.",
  "PRIORIDADE DAS FONTES: 1) dados estruturados do atendimento; 2) StudentTrace (o que o aluno fez); 3) Gold Standard/Truth Layers (o certo); 4) texto do PDF (complementar).",
  "ELOGIO: só elogie ações presentes nas 'Ações COMPROVADAS' (StudentTrace). Se não houver evidência, NÃO elogie ação específica — seja neutro. NUNCA diga que o aluno auscultou, pediu exame, viu imagem, prescreveu ou diagnosticou se isso não estiver comprovado.",
  "CORREÇÃO: use o Gold Standard para dizer o que deveria ter sido feito. Em conflito clínico, o Gold Standard vence. Em conflito entre PDF e dados estruturados, os dados estruturados vencem.",
  "NÃO invente ação que o aluno não fez. NÃO altere a nota. NÃO recalcule o feedback. NÃO substitua a avaliação. Ambiente educacional e SIMULADO.",
  "Se o aluno perguntar algo fora do caso, responda brevemente e traga de volta ao atendimento.",
  "Explique de forma didática e clínica, em português, com respostas de tamanho razoável (não excessivas).",
].join("\n");

const FALLBACK_MSG =
  "O chat do Professor IA precisa de uma configuração de IA ativa para responder livremente. Enquanto isso, revise seu feedback, a resposta modelo do caso e os pontos a melhorar.";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatBody;
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    const ctx = buildProfessorOpenChatContext({
      caso: body.caso,
      feedback: body.feedback,
      atendimento: body.atendimento,
      goldStandard: body.goldStandard,
      pdfText: body.pdfText,
    });

    const client = openai;
    if (!client) {
      return NextResponse.json({ ok: true, message: FALLBACK_MSG, sourcesUsed: ctx.sourcesUsed, warnings: [...ctx.warnings, "OPENAI_API_KEY ausente — resposta em modo fallback."], source: "fallback" }, { status: 200 });
    }

    const chatMessages = [
      { role: "system" as const, content: `${SYSTEM_RULES}\n\n${ctx.systemContext}` },
      ...messages.map((m) => {
        const r = (m.role || "").toLowerCase();
        const role = /aluno|student|user/.test(r) ? ("user" as const) : ("assistant" as const);
        return { role, content: m.content ?? "" };
      }),
    ];

    let texto = "";
    try {
      const completion = await client.chat.completions.create({ model: "gpt-4o-mini", temperature: 0.4, max_tokens: 500, messages: chatMessages });
      texto = completion.choices?.[0]?.message?.content?.trim() ?? "";
    } catch (e) {
      return NextResponse.json({ ok: true, message: FALLBACK_MSG, sourcesUsed: ctx.sourcesUsed, warnings: [...ctx.warnings, "Falha ao chamar o modelo — fallback."], source: "fallback", debug: { erro: String(e) } }, { status: 200 });
    }

    if (!texto) {
      return NextResponse.json({ ok: true, message: FALLBACK_MSG, sourcesUsed: ctx.sourcesUsed, warnings: [...ctx.warnings, "Resposta vazia — fallback."], source: "fallback" }, { status: 200 });
    }

    // Guardrail (Fase 22): bloqueia elogio sem evidência real.
    const guard = validateProfessorMessageAgainstTrace(texto, ctx.forbiddenPraise);
    const warnings = [...ctx.warnings];
    let message = texto;
    if (!guard.ok) {
      message = "Prefiro não afirmar isso sem evidência do seu atendimento. Pelos registros, vamos focar no que realmente aconteceu e no que faltou.";
      warnings.push(`Guardrail: elogio sem evidência bloqueado (${guard.blockedBy}).`);
    }

    return NextResponse.json({ ok: true, message, sourcesUsed: ctx.sourcesUsed, warnings, source: guard.ok ? "model" : "guardrail" }, { status: 200 });
  } catch (e) {
    console.error("Erro no chat aberto do Professor IA:", e);
    return NextResponse.json({ ok: false, message: FALLBACK_MSG, sourcesUsed: [], warnings: ["Erro inesperado."], source: "fallback" }, { status: 200 });
  }
}
