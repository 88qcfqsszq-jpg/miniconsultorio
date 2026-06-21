/**
 * Endpoint: POST /api/radiology/validar-coerencia
 *
 * Valida se uma imagem radiológica é coerente com um caso clínico
 *
 * Entrada: Caso clínico + Imagem radiológica
 * Saída: Validação OpenAI (coerente + confiança + motivo)
 *
 * Usa OpenAI para validar coerência antes de exibir ao aluno
 */

import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import {
  prepararValidacaoCoerencia,
  type CasoClinicoParcial,
} from "@/lib/radiology/radiologyImageService";
import type { ImagemRadiologica } from "@/lib/radiology/types";

// ============================================================================
// TIPOS
// ============================================================================

interface RequestBody {
  casoClinico: CasoClinicoParcial;
  imagemSelecionada: ImagemRadiologica;
}

interface ResponseSucesso {
  sucesso: true;
  dados: {
    coerente: boolean;
    confianca: "baixa" | "media" | "alta";
    motivo: string;
    achadoEsperado: string;
    achadoEncontrado: string;
    compatibilidadeClinica?: string;
    compatibilidadeRadiologica?: string;
    podeExibirAoAluno: boolean;
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
      logRadiology("validar-coerencia - ERRO", undefined, {
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
      logRadiology("validar-coerencia - ERRO", casoId, {
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

    logRadiology("validar-coerencia - INICIADO", casoId, {
      imageId: body.imagemSelecionada.imageId,
    });

    // 4. Verificar OpenAI configurada
    if (!openai) {
      logRadiology("validar-coerencia - ERRO", casoId, {
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
    const dadosValidacao = prepararValidacaoCoerencia(
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
            "Você é um revisor médico especializado em radiologia educacional. " +
            "Valide coerência entre caso clínico e imagem radiológica. " +
            "Responda SEMPRE em JSON válido.",
        },
        {
          role: "user",
          content: dadosValidacao.prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // 7. Extrair resposta
    const conteudo = response.choices[0].message.content;
    if (!conteudo) {
      throw new Error("OpenAI retornou resposta vazia");
    }

    // 8. Parsear JSON
    let resultadoValidacao: any;
    try {
      // Tentar extrair JSON da resposta (pode estar envolvido em markdown)
      const jsonMatch = conteudo.match(/\{[\s\S]*\}/);
      resultadoValidacao = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(conteudo);
    } catch (e) {
      logRadiology("validar-coerencia - ERRO PARSE", casoId, {
        erro: "Falha ao parsear resposta OpenAI",
        resposta: conteudo.substring(0, 200),
      });

      return NextResponse.json(
        {
          sucesso: false,
          erro: "Erro ao validar coerência",
          detalhes: {
            mensagem: "Falha ao processar resposta da IA",
          },
        } as ResponseErro,
        { status: 500 }
      );
    }

    logRadiology("validar-coerencia - SUCESSO", casoId, {
      imageId: body.imagemSelecionada.imageId,
      coerente: resultadoValidacao.coerente,
      confianca: resultadoValidacao.confianca,
    });

    // 9. Retornar resultado
    return NextResponse.json(
      {
        sucesso: true,
        dados: {
          coerente: resultadoValidacao.coerente,
          confianca: resultadoValidacao.confianca || "media",
          motivo: resultadoValidacao.motivo || "Validação concluída",
          achadoEsperado:
            resultadoValidacao.achadoEsperado ||
            "Não especificado",
          achadoEncontrado:
            resultadoValidacao.achadoEncontrado ||
            body.imagemSelecionada.achadoPrincipal,
          compatibilidadeClinica: resultadoValidacao.compatibilidadeClinica,
          compatibilidadeRadiologica: resultadoValidacao.compatibilidadeRadiologica,
          podeExibirAoAluno: resultadoValidacao.podeExibirAoAluno ?? true,
        },
      } as ResponseSucesso,
      { status: 200 }
    );
  } catch (erro) {
    logRadiology("validar-coerencia - ERRO DESCONHECIDO", casoId, {
      erro: erro instanceof Error ? erro.message : "Erro desconhecido",
    });

    return NextResponse.json(
      {
        sucesso: false,
        erro: "Erro ao validar coerência",
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
