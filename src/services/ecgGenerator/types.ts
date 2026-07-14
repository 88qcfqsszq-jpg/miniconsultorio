/**
 * Tipos para o módulo ECGSYN de geração sintética de ECG
 *
 * Implementação em TypeScript baseada em:
 * McSharry PE, Clifford GD, Tarassenko L, Smith L. A dynamical model for generating
 * synthetic electrocardiogram signals. IEEE Transactions on Biomedical Engineering.
 * 2003;50(3):289-294.
 *
 * Referência: https://physionet.org/content/ecgsyn/1.0.0/
 */

import type { ECGLead } from '@/lib/ecg/types'

// ============================================================================
// PARÂMETROS ECGSYN
// ============================================================================

export interface ParametrosECGSyn {
  // Frequência cardíaca e variabilidade
  frequenciaCardiaca: number // bpm (frequência cardíaca média)
  numeroIntervalos: number // número de batimentos a gerar
  frequenciaAmostragem: number // Hz

  // Variabilidade do intervalo RR
  variacaoRR: number // variância do intervalo RR em segundos
  razaoLFHF: number // razão Low Frequency / High Frequency (0.5-2.0)

  // Morfologia P-QRS-T (amplitudes relativas)
  amplitude: {
    P: number // amplitude relativa da onda P (0-1)
    Q: number // amplitude relativa da onda Q (0-1)
    R: number // amplitude relativa da onda R (0-1)
    S: number // amplitude relativa da onda S (0-1)
    T: number // amplitude relativa da onda T (0-1)
  }

  // Características do sinal
  duracao: number // segundos
  ruido: number // nível de ruído (0-1)

  // Metadados clínicos
  agrupoIdade?: 'neonato' | 'lactente' | 'crianca' | 'adolescente' | 'adulto'
  sexo?: 'M' | 'F'
}

// ============================================================================
// SINAL ECGSYN GERADO
// ============================================================================

export interface SinalECGSyn {
  tempo: number[] // array de tempo em segundos
  valores: number[] // valores do sinal em mV
  frequenciaAmostragem: number
  duracao: number
  parametros: ParametrosECGSyn
}

// ============================================================================
// RESPOSTA DE GERAÇÃO DE ECG
// ============================================================================

/**
 * Política que define de onde vem a frequência cardíaca de um preset.
 * - 'estado_clinico': FC herda o estado clínico do paciente (patientHeartRate prevalece).
 * - 'preset': FC é intrínseca ao ritmo/condução (TSV, TV, flutter 2:1, bloqueios avançados);
 *   patientHeartRate é ignorada e um conflito é registrado se divergir.
 * - 'contexto_exame': reservado para FC configurada por contexto (esforço, crise, reavaliação);
 *   ainda NÃO conectado ao runtime — comporta-se como 'preset' nesta etapa.
 */
export type PoliticaFrequenciaECG =
  | 'estado_clinico'
  | 'preset'
  | 'contexto_exame'

export interface Dados12Derivacoes {
  [key: string]: number[] // chave: 'I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1'-'V6'
}

export interface InterpretacaoECG {
  frequenciaCardiaca: number
  ritmo: string
  eixoMedio: number
  intervalosPR: number[]
  duracoesQRS: number[]
  duracaoQTc: number
}

export interface RespostaGeracaoECG {
  // Sinal gerado
  samplingRate: number
  duration: number
  leads: {
    [lead in ECGLead]?: number[]
  }

  // Interpretação
  interpretation: InterpretacaoECG

  // Educação
  teachingPoints: string[]

  // Metadados
  metadata: {
    presetId: string
    dataGeracao: Date
    versaoECGSyn: string // versão do algoritmo
    sintético: boolean
    avisoEducacional: string
    referências: string[]
    fontePrincipal: string // "PhysioNet ECGSYN 1.0.0"

    // Rastreabilidade da frequência cardíaca (Abordagem B).
    // A FC clínica exibida ao aluno é targetHeartRate; measuredHeartRate é a
    // FC detectada no sinal sintético, mantida apenas para auditoria técnica.
    targetHeartRate: number // FC clínica final (frequenciaAplicada) — a exibida
    measuredHeartRate: number // FC medida no traçado sintético (metricas.frequenciaCardiaca)
    heartRateSource: 'patient' | 'preset' // origem da FC aplicada
    heartRatePolicy: PoliticaFrequenciaECG // política que determinou a FC aplicada
    // Presente só quando a patientHeartRate foi ignorada por política 'preset'/'contexto_exame'.
    heartRateConflict?: {
      requested: number // patientHeartRate válida fornecida
      applied: number // FC efetivamente usada (do preset)
      reason: string
    }
  }
}

// ============================================================================
// TIPOS PARA BIBLIOTECA DIDÁTICA DE PRESETS
// ============================================================================

export type AgeGroup = 'neonato' | 'lactente' | 'pre_escolar' | 'escolar' | 'adolescente' | 'adulto'

export type ECGPresetCategory = 'normal' | 'ritmo' | 'isquemia' | 'conducao' | 'sobrecarga' | 'eletrolitos' | 'artefato'

export type AxisProfile = 'normal' | 'rightward' | 'leftward' | 'extreme'

export type TPolarity = 'positive' | 'negative' | 'biphasic'

export type STSegmentPattern = 'normal' | 'elevation' | 'depression'

/**
 * Preset robusto para ECG sintético didático.
 * Organiza parâmetros fisiológicos, morfologia e educação em uma estrutura coerente.
 *
 * Estes presets NÃO são modelos clínicos validados, mas padrões educacionais
 * para fins de ensino, treinamento OSCE e semiologia médica.
 */
export interface ECGPreset {
  // Identidade
  id: string
  label: string
  category: ECGPresetCategory
  ageGroup: AgeGroup
  description: string

  // Parâmetros fisiológicos
  heartRate: number // bpm
  rrVariability: number // proporção de variação RR
  prIntervalMs: number // milissegundos
  qrsDurationMs: number // milissegundos
  qtIntervalMs?: number // milissegundos

  // Eixo e padrão
  axisProfile: AxisProfile

  // Padrão de QRS (pode estar no nível raiz ou em morphology)
  qrsPattern?: string // Ex: "normal", "rsR_prime_V1", "broad_R_lateral"

  // Morfologia P-QRS-T (parâmetros relativos 0-1)
  morphology: {
    pAmplitude: number
    qAmplitude: number
    rAmplitude: number
    sAmplitude: number
    tAmplitude: number
    tPolarity?: TPolarity
    stSegment?: STSegmentPattern
    qrsPattern?: string // Ex: "normal", "rSr'_V1", "broad_R_lateral"
  }

  // Ganhos por derivação (opcional: pode usar defaults)
  leadProfile?: {
    limb?: Record<string, number>
    precordial?: Record<string, {
      rGain: number
      sGain: number
      tGain?: number
      stOffset?: number
    }>
  }

  // Educacional
  expectedInterpretation: string[]
  teachingPoints: string[]
  warning?: string // Ex: "Padrão sintético educacional. Não usar para diagnóstico real."

  // Compatibilidade com sistema antigo
  parametrosECGSyn?: ParametrosECGSyn
  dadosClinicosPadrao?: {
    laudo: string
    observacoesClinicas: string[]
    pontosEnsino: string[]
    derivacoesProeminentes?: ECGLead[]
  }
}

/**
 * Interface anterior mantida para compatibilidade.
 * Novos presets devem usar ECGPreset acima.
 */
export interface PresetECG {
  id: string
  titulo: string
  descricao: string
  grupoIdade?: 'neonato' | 'lactente' | 'crianca' | 'adolescente' | 'adulto'
  parametrosECGSyn: ParametrosECGSyn
  dadosClinicosPadrao: {
    laudo: string
    observacoesClinicas: string[]
    pontosEnsino: string[]
    derivacoesProeminentes?: ECGLead[]
  }
}

// ============================================================================
// CONFIGURAÇÃO DE DERIVAÇÕES
// ============================================================================

export type DerivacaoClinica = 'I' | 'II' | 'III' | 'aVR' | 'aVL' | 'aVF' | 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6'

export interface ConfiguracaoDerivaçao {
  nome: DerivacaoClinica
  tipo: 'bipolar' | 'unipolar' | 'precordial'
  descricao: string
  ganho: number
  offset: number
  inversao: boolean
}

export type TransformacaoDerivacoesConfig = Partial<Record<DerivacaoClinica, ConfiguracaoDerivaçao>>

// ============================================================================
// PARÂMETROS DE GERAÇÃO
// ============================================================================

export interface ParametrosGeracaoECG {
  presetId: string
  ageGroup?: 'neonato' | 'lactente' | 'crianca' | 'adolescente' | 'adulto'
  selectedLeads: ECGLead[]
  durationSeconds?: number
  samplingRate?: number
  /**
   * FC atual do paciente em bpm.
   * Quando válida, é usada pelos presets com política "estado_clinico".
   * Presets cuja frequência é intrínseca ao ritmo podem preservar a FC do preset.
   */
  patientHeartRate?: number
}
