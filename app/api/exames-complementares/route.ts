import { NextRequest, NextResponse } from "next/server";
import { casosOSCE } from "@/data/casos-osce";
import { criarPromptAgentExames } from "@/lib/prompts";
import { openai } from "@/lib/openai";

interface RequestBody {
  casoId: string;
  exameSolicitado: string;
  historico: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { casoId, exameSolicitado, historico } = body;

    if (!casoId || !exameSolicitado) {
      return NextResponse.json(
        { erro: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const caso = casosOSCE.find((c) => c.id === casoId);
    if (!caso) {
      return NextResponse.json(
        { erro: `Caso com ID ${casoId} não encontrado` },
        { status: 404 }
      );
    }

    const examesDisponiveisTexto = caso.exames_complementares_disponiveis
      .map((e) => `- ${e.nome}: ${e.descricao || "N/A"}`)
      .join("\n");

    const prompt = criarPromptAgentExames(
      caso,
      exameSolicitado,
      historico,
      examesDisponiveisTexto
    );

    let resposta: string | null = null;

    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Você é um agente que interpreta solicitações de exames complementares em OSCE. Retorne apenas a resposta do exame, sem explicações extras.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 500,
        });

        resposta = response.choices[0]?.message?.content || null;
      } catch (error) {
        console.error("Erro ao chamar OpenAI:", error);
        resposta = null;
      }
    }

    // Fallback se API falhar
    if (!resposta) {
      const resultado = processoFallback(
        exameSolicitado,
        caso,
        examesDisponiveisTexto
      );
      return NextResponse.json({ resultado });
    }

    return NextResponse.json({ resultado: resposta });
  } catch (error) {
    console.error("Erro na API exames-complementares:", error);
    return NextResponse.json(
      {
        erro: "Erro ao processar a requisição",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

function processoFallback(
  exameSolicitado: string,
  caso: any,
  examesTexto: string
): string {
  const lower = exameSolicitado.toLowerCase();

  // Palavras-chave comuns para cada exame
  const mapeamento: { [key: string]: string } = {
    "ecg|eletrocardiograma":
      "Ok, ECG solicitado: achados compatíveis com o caso.",
    "raio|radiografia|tórax":
      "Ok, radiografia de tórax solicitada: achados compatíveis com o caso.",
    hemograma: "Ok, hemograma solicitado: valores compatíveis com o caso.",
    "pcr|proteína c reativa":
      "Ok, PCR solicitada: elevada, sugestiva de inflamação.",
    vhs: "Ok, VHS solicitado: elevado.",
    troponina:
      "Ok, troponina solicitada: dentro dos limites da normalidade ou elevada conforme o caso.",
    "ck-mb": "Ok, CK-MB solicitada: compatível com o caso.",
    "bnp|proBNP": "Ok, BNP solicitado: elevado, sugestivo de insuficiência.",
    "função renal|creatinina|ureia":
      "Ok, função renal solicitada: valores compatíveis com o caso.",
    "eletrólitos|sódio|potássio":
      "Ok, eletrólitos solicitados: dentro dos limites normais.",
    gasometria:
      "Ok, gasometria arterial solicitada: compatível com o caso clínico.",
    espirometria:
      "Ok, espirometria solicitada: compatível com o caso respiratório.",
    "baciloscopia|tb|tuberculose":
      "Ok, baciloscopia solicitada: resultado conforme o caso.",
    "ecocardiograma|eco":
      "Ok, ecocardiograma solicitado: achados compatíveis com o caso.",
    "d-dímero":
      "Ok, D-dímero solicitado: compatível com o caso clínico.",
    "angiotomografia|tomografia":
      "Ok, angiotomografia solicitada: achados compatíveis com o caso.",
    "tomografia computadorizada|tc":
      "Ok, tomografia computadorizada solicitada: achados compatíveis.",
    "ressonância|rm": "Ok, ressonância solicitada: compatível com o caso.",
    "ultrassom|ecografia":
      "Ok, ultrassom solicitado: achados compatíveis com o caso.",
    endoscopia: "Ok, endoscopia solicitada: compatível com o caso.",
    colposcopia: "Ok, colposcopia solicitada: compatível com o caso.",
  };

  for (const [palavras, resposta] of Object.entries(mapeamento)) {
    const regex = new RegExp(palavras, "i");
    if (regex.test(lower)) {
      return resposta;
    }
  }

  return "Ok, este exame foi solicitado. Resultado: compatível com o caso clínico. Se precisar de mais detalhes, solicite um exame mais específico.";
}
