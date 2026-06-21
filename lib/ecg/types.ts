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
