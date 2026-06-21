/**
 * Endpoint: POST /api/radiology/corrigir-resposta
 *
 * Corrige resposta do aluno sobre interpretação radiológica
 *
 * Entrada: Resposta aluno + Caso + Imagem + Gabarito
 * Saída: Feedback com nota (0-10) e comentários educacionais
 *
 * Usa OpenAI para avaliar interpretação com rubrica detalhada
 */

import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import {
  prepararCorrecaoResposta,
  type CasoClinicoParcial,
} from "@/lib/radiology/radiologyImageService";
import type {
  ImagemRadiologica,
  GabaritoRadiologico,
  RespostaAlunoImagem,
} from "@/lib/radiology/types";

// ============================================================================
// TIPOS
// ============================================================================

interface RequestBody {
  respostaAluno: RespostaAlunoImagem;
  casoClinico: CasoClinicoParcial;
  imagemSelecionada: ImagemRadiologica;
  gabarito: GabaritoRadiologico;
}

interface ResponseSucesso {
  sucesso: true;
  dados: {
    nota: number;
    confiancaAvaliacao: "baixa" | "media" | "alta";
    pontosFortes: string[];
    erros: string[];
    feedback: string;
    respostaModelo: string;
    rubricaDetalhada: Array<{
      criterio: string;
      peso: number;
      pontosObtidos: number;
      maximos: number;
      observacao?: string;
    }>;
    sugestoesEstudo?: string[];
  };
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
  if (!body.respostaAluno) {
    return {
      valido: false,
      erro: "Resposta do aluno é obrigatória",
      campo: "respostaAluno",
    };
  }

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

  if (!body.gabarito) {
    return {
      valido: false,
      erro: "Gabarito é obrigatório",
      campo: "gabarito",
    };
  }

  if (!body.respostaAluno.descricaoExame) {
    return {
      valido: false,
      erro: "Resposta do aluno deve conter descrição do exame",
      campo: "respostaAluno.descricaoExame",
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
      logRadiology("corrigir-resposta - ERRO", undefined, {
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
      logRadiology("corrigir-resposta - ERRO", casoId, {
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

    logRadiology("corrigir-resposta - INICIADO", casoId, {
      imageId: body.imagemSelecionada.imageId,
      tentativa: body.respostaAluno.tentativa,
    });

    // 4. Verificar OpenAI configurada
    if (!openai) {
      logRadiology("corrigir-resposta - ERRO", casoId, {
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
    const dadosCorrecao = prepararCorrecaoResposta(
      body.respostaAluno,
      body.casoClinico,
      body.imagemSelecionada,
      body.gabarito
    );

    // 6. Chamar OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Você é um professor de radiologia avaliando interpretação de RX. " +
            "Corrija com empatia educacional. " +
            "Responda SEMPRE em JSON válido com nota de 0-10 e feedback detalhado.",
        },
        {
          role: "user",
          content: dadosCorrecao.prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    // 7. Extrair resposta
    const conteudo = response.choices[0].message.content;
    if (!conteudo) {
      throw new Error("OpenAI retornou resposta vazia");
    }

    // 8. Parsear JSON
    let resultadoCorrecao: any;
    try {
      const jsonMatch = conteudo.match(/\{[\s\S]*\}/);
      resultadoCorrecao = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(conteudo);
    } catch (e) {
      logRadiology("corrigir-resposta - ERRO PARSE", casoId, {
        erro: "Falha ao parsear resposta OpenAI",
      });

      return NextResponse.json(
        {
          sucesso: false,
          erro: "Erro ao corrigir resposta",
          detalhes: {
            mensagem: "Falha ao processar resposta da IA",
          },
        } as ResponseErro,
        { status: 500 }
      );
    }

    // 9. Validar nota (0-10)
    const nota = Math.max(
      0,
      Math.min(10, Number(resultadoCorrecao.nota) || 5)
    );

    // 10. Construir rubrica detalhada com pontuação
    const rubricaDetalhada = (resultadoCorrecao.rubricaDetalhada || []).map(
      (item: any) => ({
        criterio: item.criterio || "Critério não especificado",
        peso: Number(item.peso) || 1,
        pontosObtidos: Number(item.pontosObtidos) || 0,
        maximos: Number(item.maximos) || 1,
        observacao: item.observacao,
      })
    );

    logRadiology("corrigir-resposta - SUCESSO", casoId, {
      imageId: body.imagemSelecionada.imageId,
      nota,
      tentativa: body.respostaAluno.tentativa,
    });

    // 11. Retornar feedback
    return NextResponse.json(
      {
        sucesso: true,
        dados: {
          nota,
          confiancaAvaliacao: (
            ["baixa", "media", "alta"].includes(resultadoCorrecao.confiancaAvaliacao)
              ? resultadoCorrecao.confiancaAvaliacao
              : "media"
          ) as "baixa" | "media" | "alta",
          pontosFortes: Array.isArray(resultadoCorrecao.pontosFortes)
            ? resultadoCorrecao.pontosFortes
            : ["Resposta fornecida"],
          erros: Array.isArray(resultadoCorrecao.erros)
            ? resultadoCorrecao.erros
            : [],
          feedback:
            resultadoCorrecao.feedback || "Feedback disponível no gabarito",
          respostaModelo:
            resultadoCorrecao.respostaModelo ||
            "Veja o gabarito para resposta esperada",
          rubricaDetalhada,
          sugestoesEstudo: Array.isArray(resultadoCorrecao.sugestoesEstudo)
            ? resultadoCorrecao.sugestoesEstudo
            : [],
        },
      } as ResponseSucesso,
      { status: 200 }
    );
  } catch (erro) {
    logRadiology("corrigir-resposta - ERRO DESCONHECIDO", casoId, {
      erro: erro instanceof Error ? erro.message : "Erro desconhecido",
    });

    return NextResponse.json(
      {
        sucesso: false,
        erro: "Erro ao corrigir resposta",
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
