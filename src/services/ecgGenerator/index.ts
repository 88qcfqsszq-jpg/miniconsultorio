/**
 * Módulo de Geração de ECG Sintético Didático
 *
 * Biblioteca educacional de padrões ECG para fins de OSCE e ensino.
 * Motor de geração baseado em Gaussianas (inspirado em ECGSYN/PhysioNet,
 * mas implementado como modelo didático, não clinicamente validado).
 *
 * Referências científicas:
 * - McSharry PE, Clifford GD, Tarassenko L, Smith L. A dynamical model for generating
 *   synthetic electrocardiogram signals. IEEE Transactions on Biomedical Engineering.
 *   2003;50(3):289-294.
 * - Goldberger AL, et al. PhysioBank, PhysioToolkit, and PhysioNet: Components of a new
 *   research resource for complex physiologic signals. Circulation. 2000;101(23):e215-e220.
 * - https://physionet.org/content/ecgsyn/1.0.0/
 */

import type { ECGLead } from '@/lib/ecg/types'
import type { ParametrosGeracaoECG, RespostaGeracaoECG } from './types'
import { ecgsynAdapter } from './ecgsynAdapter'
import { getPresetById, normalizePresetId } from './presets'
import { transformarEm12Derivacoes } from './leadTransform'

// ============================================================================
// FUNÇÃO PRINCIPAL
// ============================================================================

/**
 * Gera um ECG sintético baseado em preset ECGSYN
 *
 * Fluxo:
 * 1. Validar preset
 * 2. Gerar sinal base com ECGSYN
 * 3. Aplicar filtros
 * 4. Transformar em 12 derivações
 * 5. Análise de parâmetros
 * 6. Retornar resposta estruturada
 */
export function generateECG(params: ParametrosGeracaoECG): RespostaGeracaoECG {
  // ========================================================================
  // 1. VALIDAÇÃO E OBTENÇÃO DO PRESET
  // ========================================================================

  // Normalizar ID antigo para novo (compatibilidade)
  const normalizedId = normalizePresetId(params.presetId)
  const ecgPreset = getPresetById(normalizedId)

  if (!ecgPreset) {
    throw new Error(`Preset ECG não encontrado: ${params.presetId} (normalizado: ${normalizedId})`)
  }

  // Converter novo preset ECGPreset para parametrosECGSyn (compatibilidade)
  const parametrosECGSyn = {
    frequenciaCardiaca: ecgPreset.heartRate,
    numeroIntervalos: 12,
    frequenciaAmostragem: 250,
    variacaoRR: ecgPreset.rrVariability,
    razaoLFHF: 1.0,
    amplitude: {
      P: ecgPreset.morphology.pAmplitude,
      Q: ecgPreset.morphology.qAmplitude,
      R: ecgPreset.morphology.rAmplitude,
      S: ecgPreset.morphology.sAmplitude,
      T: ecgPreset.morphology.tAmplitude,
    },
    duracao: params.durationSeconds ?? 5,
    ruido: 0,
    agrupoIdade: ecgPreset.ageGroup,
  }

  // Validar eletrodos solicitados
  if (!params.selectedLeads || params.selectedLeads.length === 0) {
    throw new Error('Nenhum eletrodo selecionado')
  }

  // ========================================================================
  // 2. GERAR SINAL BASE (DII SINTÉTICA)
  // ========================================================================

  const sinalBase = ecgsynAdapter.gerarSinalECGSyn(parametrosECGSyn)

  // ========================================================================
  // 3. APLICAR FILTROS
  // ========================================================================

  let sinalProcessado = [...sinalBase.valores]

  // Filtro passa-alta para remover linha de base
  sinalProcessado = ecgsynAdapter.aplicarFiltroPassaAlta(
    sinalProcessado,
    0.5,
    parametrosECGSyn.frequenciaAmostragem
  )

  // Normalizar
  sinalProcessado = ecgsynAdapter.normalizarSinal(sinalProcessado, 1.0)

  // ========================================================================
  // 4. TRANSFORMAR EM 12 DERIVAÇÕES
  // ========================================================================

  const dados12Derivacoes = transformarEm12Derivacoes(sinalProcessado, 60)

  // IMPORTANTE: Manter todas as 12 derivações para renderização completa
  // Os selectedLeads são apenas para validação de eletrodos posicionados
  // A tela deve sempre exibir o ECG completo de 12 derivações

  // ========================================================================
  // 5. ANÁLISE DE PARÂMETROS
  // ========================================================================

  const metricas = ecgsynAdapter.calcularMetricasECG(
    sinalProcessado,
    parametrosECGSyn.frequenciaAmostragem,
    parametrosECGSyn
  )

  // Estimar intervalos PR e QRS
  const intervalosPR = Array(metricas.numeroComplexos)
    .fill(null)
    .map(
      () =>
        100 +
        Math.random() * 60 +
        (parametrosECGSyn.agrupoIdade === 'lactente' ? -20 : 0)
    )

  const duracoesQRS = Array(metricas.numeroComplexos)
    .fill(null)
    .map(
      () =>
        65 +
        Math.random() * 35 +
        (parametrosECGSyn.agrupoIdade === 'lactente' ? -10 : 0)
    )

  // Calcular QTc (Bazett)
  const rrMedio =
    metricas.intervalosRR.length > 0
      ? metricas.intervalosRR.reduce((a, b) => a + b) /
        metricas.intervalosRR.length /
        1000
      : 0.6

  const QTEstimado = 250 + Math.random() * 100
  const QTc = rrMedio > 0 ? QTEstimado / Math.sqrt(rrMedio) : QTEstimado

  // ========================================================================
  // 6. CONSTRUIR RESPOSTA
  // ========================================================================

  const resposta: RespostaGeracaoECG = {
    samplingRate: parametrosECGSyn.frequenciaAmostragem,
    duration: parametrosECGSyn.duracao,
    leads: dados12Derivacoes as {
      [lead in ECGLead]?: number[]
    },

    interpretation: {
      frequenciaCardiaca: metricas.frequenciaCardiaca,
      ritmo: ecgPreset.expectedInterpretation[0] || 'Sinusal',
      eixoMedio: 60,
      intervalosPR,
      duracoesQRS,
      duracaoQTc: Math.round(QTc),
    },

    teachingPoints: ecgPreset.teachingPoints,

    metadata: {
      presetId: normalizedId,
      dataGeracao: new Date(),
      versaoECGSyn: 'Gerador Sintético Didático P-QRS-T (inspirado em PhysioNet ECGSYN)',
      sintético: true,
      avisoEducacional:
        ecgPreset.warning ||
        'Traçado sintético gerado para fins educacionais. Não utilizar para diagnóstico clínico real. Motor didático não é validado clinicamente.',
      referências: [
        'McSharry PE, Clifford GD, Tarassenko L, Smith L. A dynamical model for generating synthetic electrocardiogram signals. IEEE Transactions on Biomedical Engineering. 2003;50(3):289-294.',
        'Goldberger AL, Amaral LAN, Glass L, Hausdorff JM, Ivanov PC, Mark RG, et al. PhysioBank, PhysioToolkit, and PhysioNet: Components of a new research resource for complex physiologic signals. Circulation. 2000;101(23):e215-e220.',
      ],
      fontePrincipal: 'Gerador Didático Inspirado em PhysioNet ECGSYN',
    },
  }

  return resposta
}

// ============================================================================
// EXPORTS
// ============================================================================

export { ParametrosGeracaoECG, RespostaGeracaoECG }
export { obterPresetECG, listarPresetsDisponiveis, listarPresetsPorIdade } from './presets'
export type { PresetECG, ParametrosECGSyn } from './types'
