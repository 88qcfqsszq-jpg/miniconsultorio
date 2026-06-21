/**
 * Presets de Ritmos Sinusais e Variações Fisiológicas
 *
 * Padrões educacionais de ritmos cardíacos normais e suas variações.
 * Para fins de ensino em OSCE e semiologia médica.
 */

import type { ECGPreset } from '../types'

export const rhythmPresets: Record<string, ECGPreset> = {
  /**
   * Taquicardia Sinusal Pediátrica
   *
   * Características:
   * - FC elevada (140–160 bpm)
   * - Onda P normal e visível antes de cada QRS
   * - QRS estreito
   * - RR regular
   * - Eixo normal
   *
   * Etiologias fisiológicas:
   * - Febre
   * - Dor, choro
   * - Desidratação
   * - Resposta adrenérgica (esforço, medo)
   * - Anemia
   *
   * Pontos educacionais:
   * - Taquicardia sinusal é resposta fisiológica a demandas
   * - Onda P sempre visível
   * - QRS estreito (não confundir com taquicardia ventricular)
   */
  taquicardia_sinusal_pediatrica: {
    id: 'taquicardia_sinusal_pediatrica',
    label: 'Taquicardia Sinusal Pediátrica',
    category: 'ritmo',
    ageGroup: 'lactente',
    description: 'Resposta fisiológica a demandas: febre, dor, desidratação. FC 140–160 bpm.',

    heartRate: 150,
    rrVariability: 0.02,
    prIntervalMs: 95,
    qrsDurationMs: 60,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.14,
      qAmplitude: 0.02,
      rAmplitude: 0.88,
      sAmplitude: 0.24,
      tAmplitude: 0.39,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'Ritmo sinusal taquicárdico',
      'Frequência cardíaca 140–160 bpm',
      'Onda P visível antes de cada QRS',
      'PR normal',
      'QRS estreito',
      'Repolarização normal',
      'Sem ondas ectópicas',
    ],

    teachingPoints: [
      'Taquicardia sinusal é resposta NORMAL a demandas metabólicas',
      'Investigar causa: febre? Dor? Desidratação? Anemia?',
      'Onda P deve estar SEMPRE visível',
      'QRS deve ser ESTREITO (< 120 ms)',
      'Se não houver P visível ou QRS largo, pensar em outro ritmo',
      'Desaparece quando demanda resolve (diferente de arritmia)',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },

  /**
   * Taquicardia Sinusal em Adulto
   *
   * Características:
   * - FC elevada (110–140 bpm)
   * - Onda P visível
   * - QRS estreito
   * - RR regular
   * - PR pode estar ligeiramente encurtado
   *
   * Etiologias:
   * - Febre
   * - Hipotireoidismo
   * - Anemia
   * - Hipovolemia
   * - Resposta ao exercício
   * - Taquicardia inadequada
   */
  taquicardia_sinusal_adulto: {
    id: 'taquicardia_sinusal_adulto',
    label: 'Taquicardia Sinusal — Adulto',
    category: 'ritmo',
    ageGroup: 'adulto',
    description: 'Resposta a demandas metabólicas em adulto. FC 110–140 bpm.',

    heartRate: 120,
    rrVariability: 0.015,
    prIntervalMs: 150,
    qrsDurationMs: 90,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.13,
      qAmplitude: 0.02,
      rAmplitude: 0.82,
      sAmplitude: 0.29,
      tAmplitude: 0.36,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'Ritmo sinusal taquicárdico',
      'Frequência cardíaca 110–140 bpm',
      'Onda P visível e positiva em DII',
      'PR normal',
      'QRS estreito',
      'Eixo normal',
      'Repolarização normal',
    ],

    teachingPoints: [
      'Taquicardia sinusal é resposta fisiológica apropriada',
      'Procurar causa: febre, anemia, hipovolemia, exercício',
      'FC > 100 bpm em repouso pode ser inadequada',
      'Diferente de taquicardia supraventricular paroxística (não tem início súbito)',
      'Resolução espontânea quando demanda cessa',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },

  /**
   * Bradicardia Sinusal
   *
   * Características:
   * - FC baixa (40–60 bpm)
   * - Onda P visível e normal
   * - PR e QRS normais
   * - RR regular
   * - Repolarização normal
   *
   * Etiologias:
   * - Fisiológica em atletas
   * - Hipotireoidismo
   * - Hipotermia
   * - Aumentada PIC
   * - Bradicardia vagal (repouso, sono)
   * - Medicações (beta-bloqueadores, digitálicos)
   *
   * Pontos:
   * - Deve-se sempre ter P visível
   * - Se não houver P, pensar em bloqueio
   */
  bradicardia_sinusal: {
    id: 'bradicardia_sinusal',
    label: 'Bradicardia Sinusal',
    category: 'ritmo',
    ageGroup: 'adulto',
    description: 'FC reduzida (40–60 bpm). Fisiológica em atletas ou patológica conforme contexto.',

    heartRate: 55,
    rrVariability: 0.05,
    prIntervalMs: 160,
    qrsDurationMs: 90,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.13,
      qAmplitude: 0.02,
      rAmplitude: 0.80,
      sAmplitude: 0.30,
      tAmplitude: 0.35,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'Ritmo sinusal bradicárdico',
      'Frequência cardíaca 40–60 bpm',
      'Onda P visível e normal',
      'PR normal',
      'QRS estreito',
      'Repolarização normal',
      'RR bem espaçado',
    ],

    teachingPoints: [
      'Bradicardia sinusal pode ser fisiológica (atleta, sono) ou patológica',
      'Sempre verificar contexto clínico',
      'Onda P deve estar SEMPRE visível',
      'Diferenciar de bloqueio AV (onde P não conduz)',
      'Em repouso < 50 bpm em não-atleta pode ser preocupante',
      'Investigar medicações (beta-bloqueador, digitálicos)',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },

  /**
   * Arritmia Sinusal Respiratória Pediátrica
   *
   * Características:
   * - Variação de FC com respiração (↑ inspiração, ↓ expiração)
   * - Onda P sempre visível
   * - QRS estreito
   * - RR varia, mas com padrão regular
   * - Muito comum em crianças
   *
   * Fisiopatologia:
   * - Modulação vagal pela respiração
   * - Normal em faixa etária pediátrica
   * - Desaparece em frequências muito altas
   *
   * Pontos:
   * - Benigna
   * - Frequente em crianças saudáveis
   * - Diferente de arritmia patológica
   */
  arritmia_sinusal_respiratoria_pediatrica: {
    id: 'arritmia_sinusal_respiratoria_pediatrica',
    label: 'Arritmia Sinusal Respiratória Pediátrica',
    category: 'ritmo',
    ageGroup: 'escolar',
    description: 'Variação fisiológica de FC com respiração. Benigna e frequente em crianças.',

    heartRate: 95,
    rrVariability: 0.14,  // Variação maior que normal
    prIntervalMs: 120,
    qrsDurationMs: 70,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.13,
      qAmplitude: 0.02,
      rAmplitude: 0.80,
      sAmplitude: 0.28,
      tAmplitude: 0.36,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'Ritmo sinusal com variação respiratória',
      'Frequência cardíaca varia com respiração',
      'Onda P sempre visível',
      'QRS estreito',
      'RR varia mas segue padrão respiratório',
      'Repolarização normal',
      'SEM ondas ectópicas',
    ],

    teachingPoints: [
      'Arritmia sinusal respiratória é NORMAL em crianças e adolescentes',
      'Rara em adultos, mas pode ocorrer',
      'Resultado de modulação vagal normal pela respiração',
      'Diferente de arritmia patológica (sem padrão claro)',
      'Se pausas > 2-3 segundos, investigar bradicardia',
      'Desaparece com aumento da FC (exercício, febre)',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },
}
