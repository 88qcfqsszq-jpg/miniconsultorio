/**
 * Endpoint: POST /api/radiology/detectar
 *
 * Detecta se um caso clínico precisa de imagem radiológica
 *
 * Entrada: Caso clínico completo
 * Saída: Detecção de necessidade com modalidade, região e achado esperado
 *
 * Sem sensibilidade de dados: não registra pacientes reais
 */

import { NextRequest, NextResponse } from "next/server";
import {
  detectarNecessidadeImagem,
  type CasoClinicoParcial,
} from "@/lib/radiology/radiologyImageService";

// ============================================================================
// TIPOS
// ============================================================================

interface RequestBody {
  casoClinico: CasoClinicoParcial;
}

interface ResponseSucesso {
  sucesso: true;
  dados: {
    precisaImagem: boolean;
    confianca?: "baixa" | "media" | "alta";
    justificativa: string;
    modalidade?: "RX";
    regiao?: "torax";
    diagnosticoEsperado?: string;
    achadoEsperado?: string;
    labelNIHSugerido?: string;
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

function validarCasoClinico(caso: any): { valido: boolean; erro?: string } {
  if (!caso) {
    return { valido: false, erro: "Caso clínico é obrigatório" };
  }

  if (!caso.id) {
    return { valido: false, erro: "Caso deve ter ID" };
  }

  if (!caso.dados_ocultos_do_sistema) {
    return {
      valido: false,
      erro: "Caso deve ter dados_ocultos_do_sistema",
    };
  }

  if (!caso.dados_ocultos_do_sistema.diagnostico_principal) {
    return {
      valido: false,
      erro: "Caso deve ter diagnóstico_principal",
    };
  }

  if (!caso.paciente || !caso.paciente.idade) {
    return {
      valido: false,
      erro: "Caso deve ter paciente com idade",
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
      logRadiology("detectar - ERRO", undefined, {
        erro: "JSON inválido",
        detalhes: e instanceof Error ? e.message : "Erro desconhecido",
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

    // 3. Validar caso clínico
    const validacao = validarCasoClinico(body.casoClinico);
    if (!validacao.valido) {
      logRadiology("detectar - ERRO", undefined, {
        erro: validacao.erro,
        detalhes: {
          campo: "casoClinico",
          mensagem: validacao.erro,
        },
      });

      return NextResponse.json(
        {
          sucesso: false,
          erro: validacao.erro || "Validação falhou",
          detalhes: {
            campo: "casoClinico",
            mensagem: validacao.erro,
          },
        } as ResponseErro,
        { status: 400 }
      );
    }

    casoId = body.casoClinico.id;

    // 4. Chamar serviço
    logRadiology("detectar - INICIADO", casoId, {
      diagnostico:
        body.casoClinico.dados_ocultos_do_sistema.diagnostico_principal,
    });

    const resultado = await detectarNecessidadeImagem(body.casoClinico);

    // 5. Log de sucesso
    logRadiology("detectar - SUCESSO", casoId, {
      precisaImagem: resultado.precisaImagem,
      confianca: resultado.confianca,
      labelNIH: resultado.labelNIHSugerido,
    });

    // 6. Retornar resposta
    return NextResponse.json(
      {
        sucesso: true,
        dados: resultado,
      } as ResponseSucesso,
      { status: 200 }
    );
  } catch (erro) {
    // Log de erro desconhecido
    logRadiology("detectar - ERRO DESCONHECIDO", casoId, {
      erro: erro instanceof Error ? erro.message : "Erro desconhecido",
      stack: erro instanceof Error ? erro.stack : undefined,
    });

    return NextResponse.json(
      {
        sucesso: false,
        erro: "Erro interno ao detectar necessidade de imagem",
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
