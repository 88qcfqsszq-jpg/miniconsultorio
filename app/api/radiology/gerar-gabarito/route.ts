/**
 * Endpoint: POST /api/radiology/gerar-gabarito
 *
 * Gera gabarito radiológico para um caso clínico + imagem
 *
 * Entrada: Caso clínico + Imagem radiológica
 * Saída: Gabarito com descrição esperada, diagnóstico, pegadinhas, etc.
 *
 * Usa OpenAI para gerar gabarito educacional
 */

import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import {
  prepararGeracaoGabarito,
  type CasoClinicoParcial,
} from "@/lib/radiology/radiologyImageService";
import type { ImagemRadiologica, GabaritoRadiologico } from "@/lib/radiology/types";

// ============================================================================
// TIPOS
// ============================================================================

interface RequestBody {
  casoClinico: CasoClinicoParcial;
  imagemSelecionada: ImagemRadiologica;
}

interface ResponseSucesso {
  sucesso: true;
  dados: GabaritoRadiologico;
}

interface ResponseErro {
  sucesso: false;
  erro: string;
  detalhes?: {
    campo?: string;
    mensagem?: string;
  };
}

type Response = ResponseSucesso | ResponseErro;

// ============================================================================
// LOGGING
// ============================================================================

function logRadiology(
  acao: string,
  casoId: string | undefined,
  detalhes?: any
) {
  const timestamp = new Date().toISOString();
  const log = {
    timestamp,
    acao,
    casoId: casoId || "desconhecido",
    ...detalhes,
  };
  console.log("[Radiology API]", JSON.stringify(log));
}

// ============================================================================
// VALIDAÇÃO
// ============================================================================

function validarRequisicao(body: any): {
  valido: boolean;
  erro?: string;
  campo?: string;
} {
  if (!body.casoClinico) {
    return { valido: false, erro: "Caso clínico é obrigatório", campo: "casoClinico" };
  }

  if (!body.casoClinico.id) {
    return { valido: false, erro: "Caso deve ter ID", campo: "casoClinico.id" };
  }

  if (!body.imagemSelecionada) {
    return {
      valido: false,
      erro: "Imagem selecionada é obrigatória",
      campo: "imagemSelecionada",
    };
  }

  if (!body.imagemSelecionada.imageId) {
    return {
      valido: false,
      erro: "Imagem deve ter ID",
      campo: "imagemSelecionada.imageId",
    };
  }

  return { valido: true };
}

// ============================================================================
// HANDLER
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse<Response>> {
  let casoId: string | undefined;

  try {
    // 1. Validar método
    if (request.method !== "POST") {
      return NextResponse.json(
        {
          sucesso: false,
          erro: "Método não permitido. Use POST.",
        } as ResponseErro,
        { status: 405 }
      );
    }

    // 2. Parsear body
    let body: RequestBody;
    try {
      body = await request.json();
    } catch (e) {
      logRadiology("gerar-gabarito - ERRO", undefined, {
        erro: "JSON inválido",
      });

      return NextResponse.json(
        {
          sucesso: false,
          erro: "Body deve ser JSON válido",
          detalhes: {
            campo: "body",
            mensagem: "JSON inválido",
          },
        } as ResponseErro,
        { status: 400 }
      );
    }

    // 3. Validar entrada
    const validacao = validarRequisicao(body);
    if (!validacao.valido) {
      logRadiology("gerar-gabarito - ERRO", casoId, {
        erro: validacao.erro,
        campo: validacao.campo,
      });

      return NextResponse.json(
        {
          sucesso: false,
          erro: validacao.erro || "Validação falhou",
          detalhes: {
            campo: validacao.campo,
            mensagem: validacao.erro,
          },
        } as ResponseErro,
        { status: 400 }
      );
    }

    casoId = body.casoClinico.id;

    logRadiology("gerar-gabarito - INICIADO", casoId, {
      imageId: body.imagemSelecionada.imageId,
    });

    // 4. Verificar OpenAI configurada
    if (!openai) {
      logRadiology("gerar-gabarito - ERRO", casoId, {
        erro: "OpenAI não configurada",
      });

      return NextResponse.json(
        {
          sucesso: false,
          erro: "Serviço OpenAI não configurado",
          detalhes: {
            campo: "openai",
            mensagem: "Variável OPENAI_API_KEY não definida",
          },
        } as ResponseErro,
        { status: 503 }
      );
    }

    // 5. Preparar dados para OpenAI
    const dadosGabarito = prepararGeracaoGabarito(
      body.casoClinico,
      body.imagemSelecionada
    );

    // 6. Chamar OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Você é um professor de radiologia criando material educacional. " +
            "Gere um gabarito detalhado para interpretação radiológica. " +
            "Responda SEMPRE em JSON válido.",
        },
        {
          role: "user",
          content: dadosGabarito.prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // 7. Extrair resposta
    const conteudo = response.choices[0].message.content;
    if (!conteudo) {
      throw new Error("OpenAI retornou resposta vazia");
    }

    // 8. Parsear JSON
    let resultadoGabarito: any;
    try {
      const jsonMatch = conteudo.match(/\{[\s\S]*\}/);
      resultadoGabarito = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(conteudo);
    } catch (e) {
      logRadiology("gerar-gabarito - ERRO PARSE", casoId, {
        erro: "Falha ao parsear resposta OpenAI",
      });

      return NextResponse.json(
        {
          sucesso: false,
          erro: "Erro ao gerar gabarito",
          detalhes: {
            mensagem: "Falha ao processar resposta da IA",
          },
        } as ResponseErro,
        { status: 500 }
      );
    }

    // 9. Construir gabarito estruturado
    const gabarito: GabaritoRadiologico = {
      descricaoEsperada:
        resultadoGabarito.descricaoEsperada || "Descrição não disponível",
      diagnosticoRadiologico:
        resultadoGabarito.diagnosticoRadiologico || "Diagnóstico não especificado",
      correlacaoClinica:
        resultadoGabarito.correlacaoClinica || "Correlação clínica não especificada",
      principaisAchados: Array.isArray(resultadoGabarito.principaisAchados)
        ? resultadoGabarito.principaisAchados
        : ["Achado não especificado"],
      achiadosSecundarios: Array.isArray(resultadoGabarito.achadosSecundarios)
        ? resultadoGabarito.achadosSecundarios
        : [],
      pegadinhas: Array.isArray(resultadoGabarito.pegadinhas)
        ? resultadoGabarito.pegadinhas
        : ["Nenhuma pegadinha identificada"],
      nivelDificuldade: (
        ["facil", "medio", "dificil"].includes(resultadoGabarito.nivelDificuldade)
          ? resultadoGabarito.nivelDificuldade
          : "medio"
      ) as "facil" | "medio" | "dificil",
      rubrica: [
        {
          criterio: "Reconhecimento de RX de tórax",
          peso: 1,
          descricao: "Aluno identificou corretamente o tipo de exame",
        },
        {
          criterio: "Descrição de qualidade/projeção",
          peso: 1,
          descricao: "Aluno descreveu aspectos técnicos da imagem",
        },
        {
          criterio: "Reconhecimento de alteração",
          peso: 2,
          descricao: "Aluno identificou normalidade ou patologia",
        },
        {
          criterio: "Localização do achado",
          peso: 2,
          descricao: "Aluno localizou corretamente a alteração",
        },
        {
          criterio: "Linguagem médica apropriada",
          peso: 2,
          descricao: "Aluno usou terminologia radiológica adequada",
        },
        {
          criterio: "Correlação clínica",
          peso: 1,
          descricao: "Aluno correlacionou achado com caso clínico",
        },
        {
          criterio: "Diagnóstico compatível",
          peso: 1,
          descricao: "Aluno sugeriu diagnóstico apropriado",
        },
        {
          criterio: "Evitar achados imaginários",
          peso: 0.5,
          descricao: "Aluno não inventou achados inexistentes",
        },
      ],
    };

    logRadiology("gerar-gabarito - SUCESSO", casoId, {
      imageId: body.imagemSelecionada.imageId,
      nivelDificuldade: gabarito.nivelDificuldade,
      achadosCount: gabarito.principaisAchados.length,
    });

    // 10. Retornar gabarito
    return NextResponse.json(
      {
        sucesso: true,
        dados: gabarito,
      } as ResponseSucesso,
      { status: 200 }
    );
  } catch (erro) {
    logRadiology("gerar-gabarito - ERRO DESCONHECIDO", casoId, {
      erro: erro instanceof Error ? erro.message : "Erro desconhecido",
    });

    return NextResponse.json(
      {
        sucesso: false,
        erro: "Erro ao gerar gabarito",
        detalhes: {
          mensagem:
            erro instanceof Error
              ? erro.message
              : "Erro desconhecido do servidor",
        },
      } as ResponseErro,
      { status: 500 }
    );
  }
}
