/**
 * Transformação do sinal ECG em 12 derivações
 *
 * Baseado em:
 * - Einthoven (bipolar): I, II, III
 * - Augmented (unipolar): aVR, aVL, aVF
 * - Precordial (unipolar): V1-V6
 */

import type { ECGLead } from '@/lib/ecg/types'
import type { Dados12Derivacoes, ConfiguracaoDerivaçao, DerivacaoClinica } from './types'

// ============================================================================
// CONFIGURAÇÕES DE TRANSFORMAÇÃO POR DERIVAÇÃO
// ============================================================================

export const CONFIG_DERIVACOES: Record<DerivacaoClinica, ConfiguracaoDerivaçao> = {
  I: {
    nome: 'I',
    tipo: 'bipolar',
    descricao: 'Lateral esquerda (LA - RA)',
    ganho: 1.0,
    offset: 0,
    inversao: false,
  },

  II: {
    nome: 'II',
    tipo: 'bipolar',
    descricao: 'Inferior (LL - RA)',
    ganho: 1.0,
    offset: 0,
    inversao: false,
  },

  III: {
    nome: 'III',
    tipo: 'bipolar',
    descricao: 'Inferior (LL - LA)',
    ganho: 1.0,
    offset: 0,
    inversao: false,
  },

  aVR: {
    nome: 'aVR',
    tipo: 'unipolar',
    descricao: 'Septo (RA aumentado)',
    ganho: 1.0,  // Reduzido de 1.5 para evitar amplificação excessiva
    offset: 0,
    inversao: true,  // Mantém inversão para ser negativo
  },

  aVL: {
    nome: 'aVL',
    tipo: 'unipolar',
    descricao: 'Lateral (LA aumentado)',
    ganho: 0.8,  // Reduzido de 1.5 para padrão pediátrico
    offset: 0,
    inversao: false,
  },

  aVF: {
    nome: 'aVF',
    tipo: 'unipolar',
    descricao: 'Inferior (LL aumentado)',
    ganho: 1.0,  // Reduzido de 1.5 para padrão pediátrico
    offset: 0,
    inversao: false,
  },

  V1: {
    nome: 'V1',
    tipo: 'precordial',
    descricao: '4º espaço intercostal direito',
    ganho: 1.0,
    offset: 0,
    inversao: false,
  },

  V2: {
    nome: 'V2',
    tipo: 'precordial',
    descricao: '4º espaço intercostal esquerdo',
    ganho: 1.1,
    offset: 0.1,
    inversao: false,
  },

  V3: {
    nome: 'V3',
    tipo: 'precordial',
    descricao: 'Entre V2 e V4',
    ganho: 1.2,
    offset: 0.2,
    inversao: false,
  },

  V4: {
    nome: 'V4',
    tipo: 'precordial',
    descricao: '5º espaço intercostal (ápex)',
    ganho: 1.4,
    offset: 0.3,
    inversao: false,
  },

  V5: {
    nome: 'V5',
    tipo: 'precordial',
    descricao: 'Linha axilar anterior',
    ganho: 1.3,
    offset: 0.2,
    inversao: false,
  },

  V6: {
    nome: 'V6',
    tipo: 'precordial',
    descricao: 'Linha axilar média',
    ganho: 1.1,
    offset: 0,
    inversao: false,
  },
}

// ============================================================================
// FUNÇÕES DE TRANSFORMAÇÃO
// ============================================================================

function obterPotenciaisFundamentais(
  sinalDII: number[],
  eixoMedio: number = 60
): { RA: number[]; LA: number[]; LL: number[] } {
  const eixoRad = (eixoMedio * Math.PI) / 180

  const sinalLA = sinalDII.map((v) => v * Math.cos(eixoRad))
  const sinalLL = sinalDII.map((v) => v * Math.sin(eixoRad))
  const sinalRA = sinalDII.map((v) => -v * 0.5)

  return { RA: sinalRA, LA: sinalLA, LL: sinalLL }
}

function gerarDerivacoesBipolares(potenciais: {
  RA: number[]
  LA: number[]
  LL: number[]
}): { I: number[]; II: number[]; III: number[] } {
  const comprimento = potenciais.RA.length
  const I = Array(comprimento)
  const II = Array(comprimento)
  const III = Array(comprimento)

  for (let i = 0; i < comprimento; i++) {
    I[i] = potenciais.LA[i] - potenciais.RA[i]
    II[i] = potenciais.LL[i] - potenciais.RA[i]
    III[i] = potenciais.LL[i] - potenciais.LA[i]
  }

  return { I, II, III }
}

function gerarDerivacõesAugmentadas(potenciais: {
  RA: number[]
  LA: number[]
  LL: number[]
}): { aVR: number[]; aVL: number[]; aVF: number[] } {
  const comprimento = potenciais.RA.length
  const aVR = Array(comprimento)
  const aVL = Array(comprimento)
  const aVF = Array(comprimento)

  for (let i = 0; i < comprimento; i++) {
    const mediaLA_LL = (potenciais.LA[i] + potenciais.LL[i]) / 2
    const mediaRA_LL = (potenciais.RA[i] + potenciais.LL[i]) / 2
    const mediaRA_LA = (potenciais.RA[i] + potenciais.LA[i]) / 2

    aVR[i] = (potenciais.RA[i] - mediaLA_LL) * 1.5
    aVL[i] = (potenciais.LA[i] - mediaRA_LL) * 1.5
    aVF[i] = (potenciais.LL[i] - mediaRA_LA) * 1.5
  }

  return { aVR, aVL, aVF }
}

function gerarDerivacoesPrecordiais(
  sinalDII: number[],
  eixoMedio: number = 60
): {
  V1: number[]
  V2: number[]
  V3: number[]
  V4: number[]
  V5: number[]
  V6: number[]
} {
  // Progressão pediátrica (lactente): predomínio VD persiste, progressão mais suave
  // V1: R mais evidente em lactente (0.5), S presente (-0.6)
  // V2: R crescente (0.6), S presente (-0.5)
  // V3: Transição gradual (0.65), S reduzido (-0.35)
  // V4: R dominante mas não exagerado (0.75), S pequeno (-0.2)
  // V5: R bem presente (0.8), S mínimo (-0.1)
  // V6: R progressivo moderado (0.7), S quase ausente (0)

  const precordiais: { [key: string]: number[] } = {}

  // Progressão personalizada para QRS pediátrico
  for (let v = 1; v <= 6; v++) {
    let ganhoR = 0
    let ganhoS = 0

    if (v === 1) {
      // Lactente: R mais proeminente que no adulto, S ainda significativo
      ganhoR = 0.5  // Aumentado de 0.3 para representar predomínio VD pediátrico
      ganhoS = -0.6 // S presente mas menos dominante
    } else if (v === 2) {
      ganhoR = 0.6  // R crescente gradualmente
      ganhoS = -0.5
    } else if (v === 3) {
      // Zona de transição
      ganhoR = 0.65
      ganhoS = -0.35
    } else if (v === 4) {
      // Pico de R pediátrico (menos exagerado que adulto)
      ganhoR = 0.75  // Reduzido de 1.0 para padrão pediátrico
      ganhoS = -0.2
    } else if (v === 5) {
      ganhoR = 0.8   // Reduzido de 1.1 para padrão pediátrico
      ganhoS = -0.1
    } else {
      // v === 6: Lateral
      ganhoR = 0.7   // Reduzido de 0.95, diferente de V5 para evitar monotonia
      ganhoS = 0
    }

    // Criar derivação com progressão R/S
    // Simplificação: usar metade do sinal para onda R, metade para S
    precordiais[`V${v}`] = sinalDII.map((val) => {
      // Valores positivos = R, negativos = S
      if (val >= 0) {
        return val * ganhoR
      } else {
        return val * ganhoS
      }
    })
  }

  return precordiais as {
    V1: number[]
    V2: number[]
    V3: number[]
    V4: number[]
    V5: number[]
    V6: number[]
  }
}

function aplicarConfiguracao(
  sinal: number[],
  config: ConfiguracaoDerivaçao
): number[] {
  return sinal.map((v) => {
    let valor = v * config.ganho + config.offset
    if (config.inversao) {
      valor = -valor
    }
    return valor
  })
}

// ============================================================================
// FUNÇÕES PÚBLICAS
// ============================================================================

export function transformarEm12Derivacoes(
  sinalDII: number[],
  eixoMedio: number = 60
): Dados12Derivacoes {
  const potenciais = obterPotenciaisFundamentais(sinalDII, eixoMedio)
  const bipolares = gerarDerivacoesBipolares(potenciais)
  const aumentadas = gerarDerivacõesAugmentadas(potenciais)
  const precordiais = gerarDerivacoesPrecordiais(sinalDII, eixoMedio)

  const resultado: Dados12Derivacoes = {}

  resultado['I'] = aplicarConfiguracao(bipolares.I, CONFIG_DERIVACOES.I)
  resultado['II'] = aplicarConfiguracao(bipolares.II, CONFIG_DERIVACOES.II)
  resultado['III'] = aplicarConfiguracao(bipolares.III, CONFIG_DERIVACOES.III)

  resultado['aVR'] = aplicarConfiguracao(aumentadas.aVR, CONFIG_DERIVACOES.aVR)
  resultado['aVL'] = aplicarConfiguracao(aumentadas.aVL, CONFIG_DERIVACOES.aVL)
  resultado['aVF'] = aplicarConfiguracao(aumentadas.aVF, CONFIG_DERIVACOES.aVF)

  resultado['V1'] = aplicarConfiguracao(precordiais.V1, CONFIG_DERIVACOES.V1)
  resultado['V2'] = aplicarConfiguracao(precordiais.V2, CONFIG_DERIVACOES.V2)
  resultado['V3'] = aplicarConfiguracao(precordiais.V3, CONFIG_DERIVACOES.V3)
  resultado['V4'] = aplicarConfiguracao(precordiais.V4, CONFIG_DERIVACOES.V4)
  resultado['V5'] = aplicarConfiguracao(precordiais.V5, CONFIG_DERIVACOES.V5)
  resultado['V6'] = aplicarConfiguracao(precordiais.V6, CONFIG_DERIVACOES.V6)

  return resultado
}

export function filtrarDerivacoesSolicitadas(
  dados12Derivacoes: Dados12Derivacoes,
  derivacoesSolicitadas: ECGLead[]
): Partial<Dados12Derivacoes> {
  const resultado: Partial<Dados12Derivacoes> = {}

  for (const lead of derivacoesSolicitadas) {
    if (lead in dados12Derivacoes) {
      resultado[lead] = dados12Derivacoes[lead as keyof Dados12Derivacoes]
    }
  }

  return resultado
}

export const leadTransform = {
  transformarEm12Derivacoes,
  filtrarDerivacoesSolicitadas,
}
