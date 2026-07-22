// Tipos para o simulador de ECG 12 derivações

export type ECGLead = 'I' | 'II' | 'III' | 'aVR' | 'aVL' | 'aVF' | 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'RA' | 'LA' | 'RL' | 'LL'

export interface ECGLeadPosition {
  lead: ECGLead
  x: number // percentual da largura
  y: number // percentual da altura
  isPlaced: boolean
}

export interface ECGPlacementResult {
  eletrodosCorretos: ECGLead[]
  eletrodosAusentes: ECGLead[]
  eletrodosProximos: ECGLead[]
  eletrodosMalPosicionados: ECGLead[]
  percentualAcerto: number
  exameTecnicamenteAdequado: boolean
  mensagensTecnicas: string[]
  temInversaoMembros: boolean
  temPosicionamentoAltoV1V2: boolean
  temTrocaOuDesordemPrecordiais: boolean
}

export interface ECGAchado {
  derivacao: string
  achado: string
}

export interface ECGPattern {
  id: string
  titulo: string
  frequenciaCardiaca: number
  ritmo: string
  eixo: string
  pr: string
  qrs: string
  qtc: string
  achados: ECGAchado[]
  laudo: string
  derivacoesComSupra: string[]
  derivacoesComInfra: string[]
  derivacoesComInversaoT: string[]
  derivacoesComQPatologica: string[]
  observacoesClinicas: string[]
  imagem?: string
}

export interface ECGData {
  patternId: string
  eletrodos: ECGLeadPosition[]
  validacao: ECGPlacementResult
  pattern: ECGPattern
  timestamp: Date
}

export interface ECGZone {
  lead: ECGLead
  x: { min: number; max: number }
  y: { min: number; max: number }
  descricao: string
  tolerancia: number
}

// ============================================================================
// CONTRATO UNIFICADO DE ECG POR CASO
// Etapa 2 — apenas tipos. Não conectado ao runtime.
// Migração dos casos e integração ao resolvedor: fase futura.
// ============================================================================

/** De onde vem a FC para o traçado e a interpretação. */
export type FonteFrequencia =
  | 'estado_atual'    // sinaisVitais.frequenciaCardiaca do caso naquele momento
  | 'entrada'         // FC aferida na chegada (sinaisVitaisCorretos)
  | 'especifica'      // valor numérico explícito em frequenciaEspecifica

/** Contexto clínico em que o ECG é realizado. */
export type ContextoECG =
  | 'repouso'
  | 'durante_sintomas'
  | 'esforco'
  | 'pos_intervencao'

/**
 * Especificação de ECG esperado para um contexto clínico de um caso.
 * Desacopla morfologia (preset) de FC (fonte dinâmica).
 */
export interface ECGEsperado {
  indicado: boolean
  contexto: ContextoECG
  /** ID do preset morfológico (forma do traçado: P-QRS-T, ST, onda). */
  presetMorfologicoId: string
  /** Como resolver a FC para geração e interpretação. */
  fonteFrequencia: FonteFrequencia
  /** FC em bpm — obrigatório quando fonteFrequencia === 'especifica'. */
  frequenciaEspecifica?: number
  /** Texto de ritmo esperado para validação e laudo (ex.: "Ritmo sinusal, FC 78 bpm"). */
  ritmoEsperado?: string
  /** Laudo completo esperado para comparação e exportação PDF. */
  laudoEsperado?: string
}

/**
 * Conjunto de ECGs esperados para os diferentes momentos clínicos de um caso.
 * Futura substituição da estrutura esperadosExames.ecg.
 */
export interface ECGsDoCaso {
  repouso?: ECGEsperado
  duranteSintomas?: ECGEsperado
  esforco?: ECGEsperado
  posIntervencao?: ECGEsperado
}
