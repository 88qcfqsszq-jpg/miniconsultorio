import { NextRequest, NextResponse } from "next/server";
import { casosV2 } from "@/data/casos-v2";
import { criarPromptPaciente } from "@/lib/prompts";
import { openai } from "@/lib/openai";
import { obterRespostaPaciente } from "@/lib/mockPaciente";

interface RequestBody {
  casoId: string;
  mensagem: string;
  historico?: Array<{
    tipo: "estudante" | "paciente";
    conteudo: string;
  }>;
}

async function obterRespostaOpenAI(
  prompt: string
): Promise<string | null> {
  if (!openai) {
    return null; // Sem chave de API
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error("Erro ao chamar OpenAI:", error);
    return null; // Falha na API, usar fallback
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { casoId, mensagem, historico = [] } = body;

    if (!casoId || !mensagem) {
      return NextResponse.json(
        { resposta: "Desculpe, não consegui processar sua mensagem." },
        { status: 400 }
      );
    }

    // Buscar o caso
    const caso = casosV2.find((c: any) => c.id === casoId) as any;
    if (!caso) {
      return NextResponse.json({
        resposta: "Desculpe, não encontrei o caso solicitado.",
      });
    }

    // Tentar OpenAI primeiro
    const prompt = criarPromptPaciente(caso, historico, mensagem);
    const respostaOpenAI = await obterRespostaOpenAI(prompt);

    if (respostaOpenAI) {
      return NextResponse.json({ resposta: respostaOpenAI });
    }

    // Fallback para mock
    const respostaMock = obterRespostaPaciente(mensagem, caso);
    return NextResponse.json({ resposta: respostaMock });
  } catch (error) {
    console.error("Erro na API chat-paciente:", error);
    // Mesmo em caso de erro, retornar resposta válida
    return NextResponse.json({
      resposta: "Desculpe, estou um pouco cansado. Pode repetir?",
    });
  }
}
