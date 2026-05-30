import { casosOSCE } from "@/data/casos-osce";
import { criarPromptExameFisico } from "@/lib/prompts";
import { openai } from "@/lib/openai";
import { interpretarManobraExameFisico } from "@/lib/interpretarManobraExameFisico";

interface RequestBody {
  casoId: string;
  categoria: "geral" | "cardiovascular" | "respiratorio" | "abdominal" | "membros";
  comando: string;
  historico: Array<{ textDigitado: string; resposta: string }>;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { casoId, categoria, comando, historico } = body;

    if (!casoId || !categoria || !comando) {
      return Response.json(
        { erro: "Parâmetros obrigatórios faltando" },
        { status: 400 }
      );
    }

    const caso = casosOSCE.find((c) => c.id === casoId);
    if (!caso) {
      return Response.json({ erro: "Caso não encontrado" }, { status: 404 });
    }

    // Tentar com OpenAI primeiro
    if (openai) {
      try {
        const prompt = criarPromptExameFisico(caso, categoria, comando, historico || []);

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Você é um agente de simulação clínica que interpreta manobras de exame físico. Responda com precisão médica, começando sempre com 'Ok, você...'",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 200,
        });

        const achado = response.choices[0]?.message?.content?.trim();

        if (achado) {
          return Response.json({ achado });
        }
      } catch (apiError) {
        console.error("Erro ao chamar OpenAI:", apiError);
        // Fallback para função local
      }
    }

    // Fallback local se a API falhar
    const resultado = interpretarManobraExameFisico(caso, categoria, comando);
    return Response.json({ achado: resultado.resposta });
  } catch (error) {
    console.error("Erro em /api/exame-fisico:", error);
    return Response.json(
      { erro: "Erro ao processar manobra" },
      { status: 500 }
    );
  }
}
