/**
 * Presets de Artefatos e Problemas Técnicos
 *
 * Padrões educacionais para reconhecimento de problemas de captura,
 * posicionamento de eletrodos e condições técnicas.
 *
 * Usados para ensinar diagnóstico técnico e troubleshooting em ECG.
 */

import type { ECGPreset } from '../types'

export const artefactPresets: Record<string, ECGPreset> = {
  /**
   * Artefato de Movimento Leve
   *
   * Características:
   * - Oscilação leve da linha de base
   * - QRS ainda identificável
   * - Ruído fino visível
   * - Traçado interpretável com cuidado
   *
   * Causas:
   * - Paciente tremendo (frio, medo, tremor essencial)
   * - Movimento pequeno
   * - Contato eletrodo não ideal
   *
   * Manejo:
   * - Verificar eletrodos
   * - Acalmar paciente
   * - Pode prosseguir se QRS identificável
   */
  artefato_movimento_leve: {
    id: 'artefato_movimento_leve',
    label: 'Artefato de Movimento Leve',
    category: 'artefato',
    ageGroup: 'adulto',
    description: 'Oscilação leve da linha de base. ECG ainda interpretável.',

    heartRate: 75,
    rrVariability: 0.02,
    prIntervalMs: 160,
    qrsDurationMs: 90,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.12,
      qAmplitude: 0.02,
      rAmplitude: 0.80,
      sAmplitude: 0.30,
      tAmplitude: 0.35,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'Ritmo sinusal (apesar de artefato)',
      'Frequência cardíaca ~75 bpm',
      'QRS ainda identificável',
      'Ruído fino visível na linha de base',
      'Onda P pode estar obscurecida',
      'PROBLEMA TÉCNICO: Artefato de movimento leve',
    ],

    teachingPoints: [
      'Ruído fino de oscilação = movimento do paciente',
      'Verificar se eletrodos estão bem aderidos',
      'Pedir ao paciente para relaxar',
      'Verificar se paciente está com frio ou tremendo',
      'Se artefato leve, pode tentar repetir após acalmar',
      'Diferente de tremor muscular (frequência mais alta)',
    ],

    warning: 'Padrão didático de artefato. Se observado clinicamente, investigar causa técnica.',
  },

  /**
   * Artefato de Movimento Intenso
   *
   * Características:
   * - Oscilação intensa da linha de base
   * - QRS difícil de identificar
   * - Traçado praticamente ilegível
   * - RR irregular por artefato (não arritmia)
   *
   * Causas:
   * - Movimento vigoroso do paciente
   * - Eletrodos não aderindo
   * - Paciente em convulsão
   * - Paciente não cooperando
   *
   * Manejo:
   * - REPETIR ECG
   * - Acalmar paciente, sedação se necessário
   * - Verificar todos os eletrodos
   * - Limpeza da pele
   */
  artefato_movimento_intenso: {
    id: 'artefato_movimento_intenso',
    label: 'Artefato de Movimento Intenso',
    category: 'artefato',
    ageGroup: 'adulto',
    description: 'Oscilação intensa da linha de base. Traçado ininterpretável. Repetir ECG.',

    heartRate: 75,  // Base, mas mascarada por artefato
    rrVariability: 0.02,
    prIntervalMs: 160,
    qrsDurationMs: 90,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.12,
      qAmplitude: 0.02,
      rAmplitude: 0.80,
      sAmplitude: 0.30,
      tAmplitude: 0.35,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'TRAÇADO ININTERPRETÁVEL',
      'Artefato de movimento intenso',
      'Possível QRS obscurecido',
      'RR aparentemente irregular (por artefato, não arritmia)',
      'AÇÃO: Repetir ECG',
    ],

    teachingPoints: [
      'Artefato intenso torna ECG ininterpretável',
      'Causas: movimento vigoroso, eletrodos soltos, falta de cooperação',
      'NÃO tentar interpretar = risco de erro diagnóstico',
      'Sempre repetir com técnica melhorada',
      'Acalmar paciente é essencial',
      'Verificar aderência de todos os 10 eletrodos',
      'Limpar pele com álcool antes de recolocar',
    ],

    warning: 'Padrão didático. ECG real com artefato intenso deve ser REPETIDO.',
  },

  /**
   * Troca de Eletrodos RA/LA
   *
   * Características:
   * - DI INVERTIDO (negativo em vez de positivo)
   * - aVR POSITIVO (em vez de negativo)
   * - Padrão de DII, DIII pode estar alterado
   * - Precordiais geralmente normais
   * - Eixo QRS desviado à esquerda
   *
   * Diagnóstico:
   * - Procurar por DI negativo
   * - Confirmar com aVR positivo
   * - Padrão é simétrico/inversão óbvia
   *
   * Manejo:
   * - Reconhecer padrão
   * - Reposicionar eletrodos
   * - Repetir ECG
   *
   * Importância educacional:
   * - Ensina reconhecimento de padrão específico
   * - Evita diagnóstico falso
   */
  troca_eletrodos_ra_la: {
    id: 'troca_eletrodos_ra_la',
    label: 'Troca de Eletrodos RA/LA',
    category: 'artefato',
    ageGroup: 'adulto',
    description: 'Eletrodos de braço direito e esquerdo trocados. Padrão característico em DI/aVR.',

    heartRate: 75,
    rrVariability: 0.02,
    prIntervalMs: 160,
    qrsDurationMs: 90,

    axisProfile: 'leftward',  // Eixo desviado pela troca

    morphology: {
      pAmplitude: 0.12,
      qAmplitude: 0.02,
      rAmplitude: 0.80,
      sAmplitude: 0.30,
      tAmplitude: 0.35,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'DI NEGATIVO/INVERTIDO (achado chave)',
      'aVR POSITIVO (achado chave)',
      'Padrão sugere TROCA DE ELETRODOS RA/LA',
      'Eixo muito desviado à esquerda',
      'Precordiais podem aparecer normais',
      'AÇÃO: Verificar posicionamento de eletrodos',
    ],

    teachingPoints: [
      'Se DI está negativo, SEMPRE pensar em troca RA/LA',
      'aVR positivo é a confirmação (deve ser sempre negativo)',
      'Padrão é muito específico para esta troca',
      'DII e DIII também alterados',
      'Importante reconhecer para evitar diagnóstico falso',
      'Reposicionar e repetir ECG imediatamente',
      'NUNCA interpretar ECG com padrão de troca sem corrigir',
    ],

    warning: 'Padrão didático de erro técnico. Se visto clinicamente, CORRIGIR posicionamento.',
  },
}
