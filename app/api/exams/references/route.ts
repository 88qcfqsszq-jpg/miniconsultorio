/**
 * Endpoint: GET /api/exams/references
 *
 * Busca imagens radiológicas de referência por diagnóstico
 * Usa Open-i/NLM como fonte + Fase 1 (Scoring por Metadados para TB e PAC)
 *
 * Parâmetros:
 * - diagnosis: string (PT-BR ou inglês)
 * - limit: number (padrão 5)
 * - debug: boolean (padrão false - mostra scores e termos)
 *
 * Exemplo:
 * GET /api/exams/references?diagnosis=tuberculose&limit=3
 * GET /api/exams/references?diagnosis=pneumonia&limit=3&debug=true
 *
 * Resposta (Fase 1 - TB/PAC):
 * {
 *   "sucesso": true,
 *   "imagens": [
 *     {
 *       "imageId": "...",
 *       "imageUrl": "...",
 *       "diagnosisKey": "tuberculosis",
 *       "queryUsada": "tuberculosis chest xray",
 *       "scoreRelevancia": 150,
 *       "termosEncontrados": ["tuberculosis", "cavitary", "upper lobe"],
 *       "impression": "...",
 *       "achadoPrincipal": "...",
 *       "expectedFinding": "..."
 *     }
 *   ],
 *   "fase": "1 (Scoring por Metadados)",
 *   "fonte": "Open-i / Indiana University",
 *   "mensagem": "3 imagens aprovadas por scoring"
 * }
 *
 * Resposta (Fluxo Legado - outros diagnósticos):
 * {
 *   "sucesso": true,
 *   "imagens": [{ ImagemRadiologica }, ...],
 *   "fase": "Legado",
 *   "fonte": "Open-i / Indiana University",
 *   "mensagem": "1 imagem encontrada"
 * }
 */

import { NextRequest, NextResponse } from "next/server"
import { openiProvider, buscarMultiplasImagensEmOpenI, buscarPrimeiraImagemOpenIBruta } from "@/lib/radiology/providers/openiCloudProvider"
import {
  applyPhase1Scoring,
  isPhase1Mapped,
  resolveDiagnosisForPhase1,
} from "@/lib/radiology/phase1-integration"
import type { ParametrosBuscaImagem } from "@/lib/radiology/types"

export async function GET(request: NextRequest) {
  try {
    // 1. Extrair parâmetros
    const diagnosis = request.nextUrl.searchParams.get("diagnosis")
    const limitStr = request.nextUrl.searchParams.get("limit") || "5"
    const debugStr = request.nextUrl.searchParams.get("debug")
    const modeStr = request.nextUrl.searchParams.get("mode")
    const limit = Math.min(Math.max(parseInt(limitStr, 10) || 5, 1), 10) // 1-10
    const debug = debugStr === "true"
    const mode = modeStr || "automatic"

    if (!diagnosis || diagnosis.trim().length === 0) {
      return NextResponse.json(
        {
          sucesso: false,
          motivo: "Parâmetro 'diagnosis' é obrigatório",
          mensagem: "Forneça um diagnóstico válido",
        },
        { status: 400 }
      )
    }

    console.log(
      `[API References] Buscando imagens para: ${diagnosis} (limite: ${limit}, mode: ${mode})`
    )

    // 2. MODO OPEN-I BRUTO: Sem curadoria, sem scoring
    if (mode === "openi_raw") {
      return await handleOpeniRawRequest(diagnosis, limit)
    }

    // 3. MODO AUTOMÁTICO: Verificar se diagnóstico está mapeado em Fase 1
    const isPhase1 = isPhase1Mapped(diagnosis)

    if (isPhase1) {
      console.log(
        `[API References] ✅ Diagnóstico MAPEADO em Fase 1: ${diagnosis}`
      )
      return await handlePhase1Request(diagnosis, limit, debug)
    }

    // 3. Se não está em P0, usar fluxo legado
    console.log(
      `[API References] ⚠️ Diagnóstico NÃO mapeado em Fase 1, usando fluxo legado: ${diagnosis}`
    )
    return await handleLegacyRequest(diagnosis, limit)
  } catch (erro) {
    console.error(
      "[API References] Erro ao buscar imagens:",
      erro instanceof Error ? erro.message : "Desconhecido"
    )

    return NextResponse.json(
      {
        sucesso: false,
        motivo: "Erro ao buscar imagens radiológicas",
        mensagem:
          erro instanceof Error ? erro.message : "Erro desconhecido",
      },
      { status: 500 }
    )
  }
}

// ============================================================================
// FASE 1: Scoring por Metadados (TB + PAC)
// ============================================================================

async function handlePhase1Request(
  diagnosis: string,
  limit: number,
  debug: boolean
) {
  try {
    // 1. Resolver diagnóstico para obter config
    const resolution = resolveDiagnosisForPhase1(diagnosis)
    if ("error" in resolution) {
      console.warn(`[API References Phase1] ${resolution.error}`)
      return NextResponse.json(
        {
          sucesso: false,
          motivo: resolution.error,
          mensagem: "Diagnóstico não suportado em Fase 1",
          fase: "1 (Scoring por Metadados)",
        },
        { status: 400 }
      )
    }

    const { diagnosisKey, config } = resolution
    console.log(
      `[API References Phase1] DiagnosisKey: ${diagnosisKey}, Min Score: ${config.min_score}`
    )

    // 2. Buscar múltiplas imagens no Open-i
    const parametros: ParametrosBuscaImagem = {
      labelNIH: diagnosis as any,
      modalidade: "RX",
      regiao: "torax",
    }

    // Usar a função que retorna múltiplas imagens
    const imagensCandidatas = await buscarMultiplasImagensEmOpenI(parametros)

    if (!imagensCandidatas || imagensCandidatas.length === 0) {
      console.log(
        `[API References Phase1] Nenhuma imagem candidata encontrada para: ${diagnosis}`
      )
      return NextResponse.json(
        {
          sucesso: false,
          motivo: "Nenhuma imagem encontrada no Open-i para este diagnóstico",
          mensagem: "Nenhuma imagem disponível",
          diagnosisKey,
          fase: "1 (Scoring por Metadados)",
        },
        { status: 404 }
      )
    }

    console.log(
      `[API References Phase1] ${imagensCandidatas.length} candidata(s) encontrada(s)`
    )

    // 3. Aplicar scoring
    const scoringResult = applyPhase1Scoring(imagensCandidatas, diagnosis)

    if ("error" in scoringResult) {
      console.warn(`[API References Phase1] ${scoringResult.error}`)
      return NextResponse.json(
        {
          sucesso: false,
          motivo: scoringResult.error,
          mensagem: "Erro ao processar diagnóstico",
          fase: "1 (Scoring por Metadados)",
        },
        { status: 500 }
      )
    }

    // 4. Selecionar as melhores (approved)
    const approved = scoringResult.approved.slice(0, limit)

    if (approved.length === 0) {
      console.log(
        `[API References Phase1] Nenhuma imagem aprovada por scoring para: ${diagnosis}`
      )
      console.log(
        `[API References Phase1] Rejeitadas: ${scoringResult.summary.rejectedCount}, Min Score: ${scoringResult.summary.minScore}`
      )
      return NextResponse.json(
        {
          sucesso: false,
          motivo: "Nenhuma imagem atendeu ao critério de scoring",
          mensagem: "Nenhuma imagem compatível encontrada",
          diagnosisKey: scoringResult.summary.diagnosisKey,
          minScore: scoringResult.summary.minScore,
          candidatas: scoringResult.summary.totalImages,
          rejeitadas: scoringResult.summary.rejectedCount,
          fase: "1 (Scoring por Metadados)",
        },
        { status: 404 }
      )
    }

    // 5. Formatar resposta
    // ✅ FILTRAR OBRIGATORIAMENTE: apenas imagens com imageUrl válida
    const imagensRetorno = approved
      .map((item) => {
        const imagem = item.image
        const metadadosOriginais = (imagem.metadadosOriginais as any) || {}

        const response = {
          imageId: imagem.imageId,
          imageUrl: imagem.imageUrl,
          diagnosisKey: scoringResult.summary.diagnosisKey,
          queryUsada: metadadosOriginais.queryUsada || config.open_i_queries[0],
          achadoPrincipal: imagem.achadoPrincipal,
          impression: metadadosOriginais.impression,
          fonte: imagem.fonte,
          atribuicao: imagem.atribuicao,
          expectedFinding: config.expected_finding_pt_br,
        } as any

        // Adicionar score/termos apenas se debug=true
        if (debug) {
          response.scoreRelevancia = metadadosOriginais.scoreRelevancia || item.score.totalScore
          response.termosEncontrados =
            metadadosOriginais.termosEncontrados ||
            item.score.termsFound.strongPositive
          response.scoreBreakdown = debug ? item.score.scoreBreakdown : undefined
        }

        return response
      })
      // ✅ Filtrar imagens sem URL válida (não deveria chegar aqui, mas é seguro)
      .filter((img) => img?.imageUrl && img.imageUrl.startsWith("https://openi.nlm.nih.gov/imgs/"))

    console.log(
      `[API References Phase1] ✅ ${imagensRetorno.length} imagem(ns) aprovada(s) retornada(s)`
    )

    return NextResponse.json(
      {
        sucesso: true,
        imagens: imagensRetorno,
        diagnosisKey: scoringResult.summary.diagnosisKey,
        fase: "1 (Scoring por Metadados)",
        fonte: "Open-i / Indiana University Chest X-ray Collection",
        mensagem: `${imagensRetorno.length} imagem(s) aprovada(s) por scoring`,
        resumoScoring: debug
          ? {
              totalCandidatas: scoringResult.summary.totalImages,
              aprovadas: scoringResult.summary.approvedCount,
              rejeitadas: scoringResult.summary.rejectedCount,
              minScore: scoringResult.summary.minScore,
            }
          : undefined,
        notaEducacional:
          "Fonte: Open-i / Indiana University Chest X-ray Collection. " +
          "Imagens usadas para fins educacionais. Licença CC BY 3.0.",
      },
      { status: 200 }
    )
  } catch (erro) {
    console.error(
      "[API References Phase1] Erro ao processar Fase 1:",
      erro instanceof Error ? erro.message : "Desconhecido"
    )

    return NextResponse.json(
      {
        sucesso: false,
        motivo: "Erro ao processar scoring",
        mensagem: erro instanceof Error ? erro.message : "Erro desconhecido",
        fase: "1 (Scoring por Metadados)",
      },
      { status: 500 }
    )
  }
}

// ============================================================================
// FLUXO LEGADO: Para diagnósticos não mapeados em P0
// ============================================================================

// ============================================================================
// MODO OPEN-I BRUTO: Sem curadoria, sem scoring, sem metadados artificiais
// ============================================================================

async function handleOpeniRawRequest(diagnosisPtBr: string, limit: number) {
  try {
    // 🔴 MÁXIMA SIMPLICIDADE: Traduzir → Buscar com função bruta → Retornar primeira imagem

    const translationMap: Record<string, string> = {
      pneumonia: "pneumonia",
      pac: "pneumonia",
      tuberculose: "tuberculosis",
      tb: "tuberculosis",
      asma: "asthma",  // Testado: retorna 1 resultado ✅
      dpoc: "emphysema",  // Testado: retorna 1 resultado ✅
      "insuficiência cardíaca": "heart failure",
      icc: "heart failure",
      "edema pulmonar": "pulmonary edema",
      cardiomegalia: "cardiomegaly",
      "derrame pleural": "pleural effusion",  // Testado: retorna 5 resultados ✅
      efusão: "pleural effusion",
      pneumotórax: "pneumothoraces",  // Testado: retorna 5 resultados ✅
      pneumotorax: "pneumothoraces",  // Testado: retorna 5 resultados ✅
      atelectasia: "atelectases",  // Testado: retorna 1 resultado ✅
      bronquiolite: "bronchiolitis",  // Nenhum termo Open-i encontrado
    }

    const diagnosisPtBrLower = diagnosisPtBr.toLowerCase().trim()
    const queryEnglish = translationMap[diagnosisPtBrLower] || diagnosisPtBr

    console.log(`[Raw] Buscando "${diagnosisPtBr}" → "${queryEnglish}"`)

    // ✅ Usar função bruta (sem scoring, sem filtering, sem fallback)
    const { imageUrl, imageId } = await buscarPrimeiraImagemOpenIBruta(queryEnglish)

    // Se achou imagem, retornar
    if (imageUrl) {
      console.log(`[Raw] ✅ Encontrou para "${diagnosisPtBr}"`)

      return NextResponse.json({
        sucesso: true,
        mode: "openi_raw",
        diagnosis: diagnosisPtBr,
        queryUsada: queryEnglish,
        imageUrl: imageUrl,
        imagens: [
          {
            imageUrl: imageUrl,
            imageId: imageId || "unknown",
            fonte: "Open-i",
            curadoriaRadiologica: false,
          },
        ],
      })
    }

    // Sem imagem
    console.log(`[Raw] ❌ Sem imagem para "${diagnosisPtBr}"`)

    return NextResponse.json({
      sucesso: false,
      mode: "openi_raw",
      diagnosis: diagnosisPtBr,
      queryUsada: queryEnglish,
      imageUrl: null,
      imagens: [],
    })
  } catch (erro) {
    console.error(`[Raw] Erro: ${erro instanceof Error ? erro.message : "desconhecido"}`)

    return NextResponse.json({
      sucesso: false,
      mode: "openi_raw",
      imageUrl: null,
      imagens: [],
    }, { status: 500 })
  }
}

// ============================================================================
// FLUXO LEGADO: Para diagnósticos não mapeados em P0
// ============================================================================

async function handleLegacyRequest(diagnosis: string, limit: number) {
  try {
    // Preparar parâmetros para busca
    const parametros: ParametrosBuscaImagem = {
      labelNIH: diagnosis as any,
      modalidade: "RX",
      regiao: "torax",
    }

    // Chamar provider Open-i (fluxo legado retorna 1 imagem)
    const resultado = await openiProvider.buscarImagemOpenI(parametros)

    // Retornar resultado
    // ✅ Validar que imagem tem URL válida
    if (
      resultado.sucesso &&
      resultado.imagem &&
      resultado.imagem.imageUrl &&
      resultado.imagem.imageUrl.startsWith("http")
    ) {
      console.log(
        `[API References Legacy] ✅ Imagem encontrada para: ${diagnosis}`
      )

      return NextResponse.json(
        {
          sucesso: true,
          imagens: [resultado.imagem], // Retorna como array para consistência
          fase: "Legado",
          fonte: "Open-i / Indiana University Chest X-ray Collection",
          mensagem: "1 imagem encontrada",
          notaEducacional:
            "Fonte: Open-i / Indiana University Chest X-ray Collection. " +
            "Imagens usadas para fins educacionais. Licença CC BY 3.0.",
        },
        { status: 200 }
      )
    }

    // Nenhuma imagem encontrada
    console.log(`[API References Legacy] ❌ Nenhuma imagem para: ${diagnosis}`)

    return NextResponse.json(
      {
        sucesso: false,
        motivo:
          "Imagem radiológica indisponível para este diagnóstico.",
        mensagem: "Nenhuma imagem encontrada",
        diagnosticoSolicitado: diagnosis,
        fase: "Legado",
      },
      { status: 404 }
    )
  } catch (erro) {
    console.error(
      "[API References Legacy] Erro ao buscar imagens:",
      erro instanceof Error ? erro.message : "Desconhecido"
    )

    return NextResponse.json(
      {
        sucesso: false,
        motivo: "Erro ao buscar imagens radiológicas",
        mensagem: erro instanceof Error ? erro.message : "Erro desconhecido",
      },
      { status: 500 }
    )
  }
}
