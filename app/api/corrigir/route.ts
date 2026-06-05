import { NextRequest, NextResponse } from "next/server";
import { casosOSCE } from "@/data/casos-osce";
import { criarPromptExaminador } from "@/lib/prompts";
import { openai } from "@/lib/openai";
import { FeedbackOSCE } from "@/lib/types";
import { verificarDiagnosticoCompativel } from "@/lib/diagnosticoHelper";

interface RequestBody {
  casoId: string;
  historico?: Array<{
    tipo: "estudante" | "paciente";
    conteudo: string;
  }>;
  exameFisico?: Array<{
    categoria: string;
    textDigitado: string;
    resposta: string;
  }>;
  sinaisVitaisSolicitados: boolean;
  sinaisVitaisDoEstudante?: any;
  hipoteseDiagnostica: string;
  diagnosticosDiferenciais: string[];
  examesSolicitados: string[];
  conduta: string;
  soap: {
    subjetivo: string;
    objetivo: string;
    avaliacao: string;
    plano: string;
  };
  tempoAtendimento: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const {
      casoId,
      historico = [],
      exameFisico = [],
      sinaisVitaisSolicitados = false,
      sinaisVitaisDoEstudante,
      hipoteseDiagnostica,
      diagnosticosDiferenciais,
      examesSolicitados,
      conduta,
      soap,
      tempoAtendimento = 0,
    } = body;

    if (
      !casoId ||
      !hipoteseDiagnostica ||
      !diagnosticosDiferenciais ||
      !examesSolicitados ||
      !conduta ||
      !soap
    ) {
      return NextResponse.json(
        { erro: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Buscar o caso
    const caso = casosOSCE.find((c) => c.id === casoId);
    if (!caso) {
      return NextResponse.json(
        { erro: `Caso com ID ${casoId} não encontrado` },
        { status: 404 }
      );
    }

    // Criar prompt para o examinador
    const prompt = criarPromptExaminador(
      caso,
      historico,
      exameFisico,
      sinaisVitaisSolicitados,
      sinaisVitaisDoEstudante,
      hipoteseDiagnostica,
      diagnosticosDiferenciais,
      examesSolicitados,
      conduta,
      soap,
      tempoAtendimento
    );

    // Chamar OpenAI
    let respostaRaw: string | null = null;

    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Você é um professor de medicina avaliando desempenho em OSCE. Retorne sempre JSON válido.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.5,
          max_tokens: 2000,
        });

        respostaRaw = response.choices[0]?.message?.content || null;
      } catch (error) {
        console.error("Erro ao chamar OpenAI:", error);
        respostaRaw = null;
      }
    }

    // Se OpenAI falhou, retornar feedback padrão
    if (!respostaRaw) {
      const feedbackPadrao: FeedbackOSCE = {
        nota: 12,
        percentual: 60,
        classificacao: "Regular",
        justificativaNota: "Avaliação padrão. Configure OPENAI_API_KEY para feedback detalhado.",
        tempoAtendimento,
        resumoCaso: {
          diagnosticoEsperado: caso.dados_ocultos_do_sistema.diagnostico_principal,
          sindromePrincipal: "Não disponível",
          achadosChave: [],
          raciocinioEsperado: "Não disponível",
        },
        anamnese: {
          acertos: [],
          faltouPerguntar: [],
          perguntasPoucoUteis: [],
          comentario: "Feedback detalhado indisponível. Configure a API.",
        },
        exameFisico: {
          manobrasRealizadas: exameFisico.map((m) => m.textDigitado),
          achadosEncontrados: [],
          manobrasEsquecidas: [],
          comentario: "Não foi possível analisar detalhadamente.",
        },
        sinaisVitais: {
          interpretacao: sinaisVitaisSolicitados ? "Sinais vitais solicitados." : "Sinais vitais não solicitados.",
          pontosDeAlerta: [],
        },
        raciocinioDiagnostico: {
          hipoteseDoEstudante: hipoteseDiagnostica,
          diagnosticoEsperado: caso.dados_ocultos_do_sistema.diagnostico_principal,
          avaliacao: "Não foi possível analisar.",
          diferenciaisAdequados: diagnosticosDiferenciais,
          diferenciaisFaltantes: [],
          comentario: "Análise detalhada indisponível.",
        },
        examesComplementares: {
          adequados: examesSolicitados,
          faltantes: [],
          desnecessarios: [],
          comentario: "Não foi possível analisar.",
        },
        conduta: {
          adequada: conduta.length > 30 ? ["Conduta registrada"] : [],
          incompleta: conduta.length <= 30 ? ["Conduta muito breve"] : [],
          erros: [],
          condutaModelo: "",
        },
        soap: {
          subjetivo: soap.subjetivo.slice(0, 50),
          objetivo: soap.objetivo.slice(0, 50),
          avaliacao: soap.avaliacao.slice(0, 50),
          plano: soap.plano.slice(0, 50),
          comentarioGeral: "Configure OpenAI para análise SOAP detalhada.",
        },
        errosCriticos: [],
        respostaModeloOSCE: "Configure a chave de API para obter resposta modelo.",
        planoDeEstudo: [],
      };
      return NextResponse.json(feedbackPadrao);
    }

    // Tentar fazer parse do JSON
    let feedback: FeedbackOSCE;
    try {
      feedback = JSON.parse(respostaRaw);

      // Adicionar tempoAtendimento se não estiver na resposta
      if (!feedback.tempoAtendimento) {
        feedback.tempoAtendimento = tempoAtendimento;
      }

      // Normalizar escala: se nota ≤ 10, assumir escala 0-10 e converter para 0-20
      if (feedback.nota <= 10) {
        feedback.nota = feedback.nota * 2;
      }

      // Garantir que nota nunca exceda 20
      feedback.nota = Math.min(feedback.nota, 20);

      // Recalcular percentual baseado em escala 0-20
      feedback.percentual = Math.round((feedback.nota / 20) * 100);

      // Ajustar classificação baseada na escala 0-20
      if (feedback.nota >= 17) {
        feedback.classificacao = "Excelente";
      } else if (feedback.nota >= 16) {
        feedback.classificacao = "Bom";
      } else if (feedback.nota >= 12) {
        feedback.classificacao = "Regular";
      } else {
        feedback.classificacao = "Insuficiente";
      }
    } catch (parseError) {
      console.error("Erro ao fazer parse da resposta OpenAI:", respostaRaw);

      const feedbackPadrao: FeedbackOSCE = {
        nota: 12,
        percentual: 60,
        classificacao: "Regular",
        justificativaNota: "Erro ao processar feedback detalhado.",
        tempoAtendimento,
        resumoCaso: {
          diagnosticoEsperado: caso.dados_ocultos_do_sistema.diagnostico_principal,
          sindromePrincipal: "",
          achadosChave: [],
          raciocinioEsperado: "",
        },
        anamnese: { acertos: [], faltouPerguntar: [], perguntasPoucoUteis: [], comentario: "Erro no processamento." },
        exameFisico: { manobrasRealizadas: [], achadosEncontrados: [], manobrasEsquecidas: [], comentario: "Erro." },
        sinaisVitais: { interpretacao: "", pontosDeAlerta: [] },
        raciocinioDiagnostico: {
          hipoteseDoEstudante: hipoteseDiagnostica,
          diagnosticoEsperado: caso.dados_ocultos_do_sistema.diagnostico_principal,
          avaliacao: "",
          diferenciaisAdequados: [],
          diferenciaisFaltantes: [],
          comentario: "Erro no processamento.",
        },
        examesComplementares: { adequados: [], faltantes: [], desnecessarios: [], comentario: "Erro." },
        conduta: { adequada: [], incompleta: [], erros: [], condutaModelo: "" },
        soap: { subjetivo: "", objetivo: "", avaliacao: "", plano: "", comentarioGeral: "Erro." },
        errosCriticos: [],
        respostaModeloOSCE: "",
        planoDeEstudo: [],
      };
      return NextResponse.json(feedbackPadrao);
    }

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Erro na API corrigir:", error);
    return NextResponse.json(
      {
        erro: "Erro ao processar a requisição",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
