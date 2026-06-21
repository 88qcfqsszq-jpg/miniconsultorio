/**
 * Endpoint: POST /api/radiology/buscar-imagem
 *
 * Busca imagem radiológica para um caso clínico
 *
 * Entrada: Caso clínico + label NIH
 * Saída: Imagem encontrada OU erro controlado
 *
 * Fluxo:
 * 1. Validar entrada
 * 2. Chamar serviço de busca
 * 3. Se NIH não configurado → erro controlado
 * 4. Se fixture em dev → aviso explícito
 * 5. Retornar imagem ou erro
 */

import { NextRequest, NextResponse } from "next/server";
import {
  buscarImagemRadiologica,
  type CasoClinicoParcial,
} from "@/lib/radiology/radiologyImageService";
import { AVISO_FIXTURE } from "@/lib/radiology/fixtures/sampleImages";
import type { ImagemRadiologica } from "@/lib/radiology/types";

// ============================================================================
// TIPOS
// ============================================================================

interface RequestBody {
  casoClinico: CasoClinicoParcial;
  labelNIH: string;
}

interface ResponseSucesso {
  sucesso: true;
  dados: {
    imagem: ImagemRadiologica;
    aviso?: string; // Se usando fixture em dev
  };
}

interface ResponseErro {
  sucesso: false;
  erro: string;
  requerConfiguracao?: boolean;
  detalhes?: {
    campo?: string;
    mensagem?: string;
    variavelFaltante?: string;
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

  if (!body.labelNIH) {
    return { valido: false, erro: "labelNIH é obrigatório", campo: "labelNIH" };
  }

  if (typeof body.labelNIH !== "string") {
    return {
      valido: false,
      erro: "labelNIH deve ser string",
      campo: "labelNIH",
    };
  }

  return { valido: true };
}

// ============================================================================
// HANDLER
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse<Response>> {
  let casoId: string | undefined;
  let labelNIH: string | undefined;

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
      logRadiology("buscar-imagem - ERRO", undefined, {
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
      logRadiology("buscar-imagem - ERRO", casoId, {
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
    labelNIH = body.labelNIH;

    // 4. Chamar serviço
    logRadiology("buscar-imagem - INICIADO", casoId, {
      labelNIH,
    });

    const resultado = await buscarImagemRadiologica(
      body.casoClinico,
      labelNIH
    );

    // 5. Verificar sucesso
    if (!resultado.sucesso) {
      // Verificar se é erro de configuração
      const requerConfiguracao = resultado.motivo?.includes(
        "ainda não configurado"
      );

      logRadiology("buscar-imagem - FALHA", casoId, {
        labelNIH,
        motivo: resultado.motivo,
        requerConfiguracao,
      });

      return NextResponse.json(
        {
          sucesso: false,
          erro: resultado.motivo || "Erro ao buscar imagem",
          requerConfiguracao,
          detalhes: {
            campo: "busca",
            mensagem: resultado.motivo,
            variavelFaltante: requerConfiguracao
              ? "GOOGLE_CLOUD_PROJECT_ID"
              : undefined,
          },
        } as ResponseErro,
        { status: resultado.motivo?.includes("ainda não configurado") ? 503 : 404 }
      );
    }

    // 6. Se imagem é fixture, adicionar aviso explícito
    if (resultado.imagem && !resultado.imagem.integracaoReal) {
      logRadiology("buscar-imagem - SUCESSO (FIXTURE)", casoId, {
        labelNIH,
        imageId: resultado.imagem.imageId,
        aviso: "Usando fixture educacional local",
      });

      return NextResponse.json(
        {
          sucesso: true,
          dados: {
            imagem: resultado.imagem,
            aviso:
              "⚠️ Imagem de fixture educacional local, não NIH real. " +
              AVISO_FIXTURE,
          },
        } as ResponseSucesso,
        { status: 200 }
      );
    }

    // 7. Se imagem real do NIH
    logRadiology("buscar-imagem - SUCESSO (NIH)", casoId, {
      labelNIH,
      imageId: resultado.imagem?.imageId,
    });

    return NextResponse.json(
      {
        sucesso: true,
        dados: {
          imagem: resultado.imagem!,
        },
      } as ResponseSucesso,
      { status: 200 }
    );
  } catch (erro) {
    logRadiology("buscar-imagem - ERRO DESCONHECIDO", casoId, {
      labelNIH,
      erro: erro instanceof Error ? erro.message : "Erro desconhecido",
    });

    return NextResponse.json(
      {
        sucesso: false,
        erro: "Erro interno ao buscar imagem",
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
