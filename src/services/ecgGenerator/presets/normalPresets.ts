/**
 * Presets de ECG NORMAL por faixa etária
 *
 * Gerador didático P-QRS-T para fins educacionais em OSCE e semiologia.
 * Baseado em parâmetros fisiológicos referenciais, não é modelo clinicamente validado.
 *
 * Referências:
 * - McSharry PE, et al. IEEE Transactions on Biomedical Engineering. 2003;50(3):289-294.
 * - Goldberger AL, et al. Circulation. 2000;101(23):e215-e220.
 */

import type { ECGPreset } from '../types'

export const normalPresets: Record<string, ECGPreset> = {
  /**
   * ECG Normal — Neonato (0-1 mês)
   *
   * Características fisiológicas:
   * - FC alta (120–160 bpm)
   * - Eixo muito à direita (130-180°)
   * - V1 com R bastante proeminente (padrão RD)
   * - V6 com R menor que padrão adulto
   * - T pode ser variável, mas mantém positivo para evitar confusão inicial
   *
   * Pontos de ensino:
   * - ECG neonatal tem frequência cardíaca alta fisiológica
   * - Predomínio de QRS à direita é normal nesta idade
   * - Eixo mais à direita não é patológico
   * - Não interpretar como ECG adulto
   */
  normal_neonato: {
    id: 'normal_neonato',
    label: 'ECG Normal — Neonato',
    category: 'normal',
    ageGroup: 'neonato',
    description: 'Recém-nascido (0-1 mês). Frequência cardíaca alta fisiológica, eixo à direita.',

    heartRate: 135,
    rrVariability: 0.08,
    prIntervalMs: 80,
    qrsDurationMs: 50,

    axisProfile: 'rightward',

    morphology: {
      pAmplitude: 0.12,
      qAmplitude: 0.02,
      rAmplitude: 0.95,  // Maior que lactente (predomínio VD)
      sAmplitude: 0.20,
      tAmplitude: 0.42,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'Ritmo sinusal',
      'Frequência cardíaca 120–160 bpm',
      'Eixo QRS 130–180°',
      'PR < 100 ms',
      'QRS estreito',
      'Repolarização normal',
    ],

    teachingPoints: [
      'ECG neonatal apresenta frequência muito mais alta que adulto',
      'Predomínio ventricular direito é fisiológico nesta idade',
      'Eixo à direita não representa patologia',
      'Progressão V1→V6 ainda não é típica de padrão adulto',
      'Compare sempre com parâmetros de idade, não com adulto',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },

  /**
   * ECG Normal — Lactente (1-12 meses)
   *
   * Características:
   * - FC alta fisiológica (100–160 bpm, típico 110–130)
   * - Eixo mais à direita (60–120°)
   * - V1 com R relativamente evidente (lactente tem predomínio VD)
   * - DII positivo
   * - aVR negativo
   * - Progressão precordial gradual (não padrão adulto)
   *
   * Pontos:
   * - Normal para faixa etária
   * - QRS estreito
   * - Ritmo sinusal regular
   */
  normal_lactente: {
    id: 'normal_lactente',
    label: 'ECG Normal — Lactente',
    category: 'normal',
    ageGroup: 'lactente',
    description: 'Lactente (1-12 meses). Frequência cardíaca 110–130 bpm, eixo à direita.',

    heartRate: 120,
    rrVariability: 0.04,
    prIntervalMs: 100,
    qrsDurationMs: 60,

    axisProfile: 'rightward',

    morphology: {
      pAmplitude: 0.15,
      qAmplitude: 0.02,
      rAmplitude: 0.90,  // Predomínio VD lactente
      sAmplitude: 0.25,
      tAmplitude: 0.40,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'Ritmo sinusal',
      'Frequência cardíaca 110–130 bpm',
      'PR normal para idade',
      'QRS estreito',
      'Eixo normal a direita',
      'Repolarização normal',
    ],

    teachingPoints: [
      'FC > 100 é normal e fisiológica em lactente',
      'aVR deve ser predominantemente negativo',
      'DII é a melhor derivação para ritmo',
      'V1 pode ter R relativamente maior (predomínio VD)',
      'Progressão V1→V6 é gradual, não abrupta como adulto',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },

  /**
   * ECG Normal — Pré-escolar (1-6 anos)
   *
   * Características:
   * - FC alta mas menor que lactente (95–140 bpm, típico 100–110)
   * - Eixo normal (45–90°)
   * - Transição entre padrão lactente e escolar
   * - V1 menos dominante que lactente
   * - V5/V6 começam a se parecer mais com adulto
   *
   * Pontos:
   * - Idade de transição
   * - Ainda com eixo relativamente à direita
   */
  normal_pre_escolar: {
    id: 'normal_pre_escolar',
    label: 'ECG Normal — Pré-escolar',
    category: 'normal',
    ageGroup: 'pre_escolar',
    description: 'Pré-escolar (1-6 anos). Frequência cardíaca 100–110 bpm, eixo em transição.',

    heartRate: 105,
    rrVariability: 0.035,
    prIntervalMs: 110,
    qrsDurationMs: 65,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.14,
      qAmplitude: 0.02,
      rAmplitude: 0.85,  // Reduzindo de lactente
      sAmplitude: 0.27,
      tAmplitude: 0.38,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'Ritmo sinusal',
      'Frequência cardíaca 100–110 bpm',
      'PR normal',
      'QRS estreito',
      'Eixo normal a ligeiramente à direita',
      'Repolarização normal',
    ],

    teachingPoints: [
      'Transição entre padrão pediátrico (lactente) e escolar',
      'FC ainda > 100 bpm é normal para idade',
      'V1 menos dominante que em lactente',
      'Eixo pode estar ainda um pouco à direita',
      'Padrão de repolarização começa a se estabilizar',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },

  /**
   * ECG Normal — Escolar (6-12 anos)
   *
   * Criança de 7-8 anos: padrão de transição entre pediátrico e adulto.
   *
   * Características:
   * - FC: 85–95 bpm (típico 90)
   * - PR: 120 ms (condução AV normal para idade)
   * - QRS: 70 ms (condução ventricular rápida, pediátrica)
   * - QTc: 400–420 ms (encurtado vs adulto 440-460)
   * - Eixo: Normal (0–90°)
   * - DI: Positivo
   * - DII: Positivo
   * - aVR: Predominantemente NEGATIVO (oposto ao resto)
   * - V1: R pequena < S (R 0.3-0.4)
   * - V5/V6: R predominante (R > S)
   *
   * Progressão normal V1→V6:
   * - Transição em V3-V4
   * - Sem exagero de amplitude (pediátrico)
   */
  normal_escolar: {
    id: 'normal_escolar',
    label: 'ECG Normal — Escolar (7-8 anos)',
    category: 'normal',
    ageGroup: 'escolar',
    description: 'Escolar (7 anos). FC 85–100 bpm, PR 120ms, QRS 70ms, QTc 410ms. Padrão de transição para adulto.',

    heartRate: 92,
    rrVariability: 0.03,
    prIntervalMs: 120,
    qrsDurationMs: 70,
    qtIntervalMs: 410,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.13,
      qAmplitude: 0.02,
      rAmplitude: 0.78,
      sAmplitude: 0.30,
      tAmplitude: 0.35,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'Ritmo sinusal',
      'Frequência cardíaca 90 bpm',
      'PR 120 ms (normal para idade)',
      'QRS 70 ms (estreito, pediátrico)',
      'Eixo QRS 45–60° (normal)',
      'QTc 410 ms (encurtado vs adulto)',
      'Ondas P visíveis, positivas em DII',
      'aVR predominantemente negativo',
      'Repolarização normal, T positiva em DI/DII/aVL/V2–V6',
      'Progressão R/S normal V1→V6',
    ],

    teachingPoints: [
      'Criança de 7 anos tem FC ~90 bpm (normal escolar)',
      'QRS estreito (70 ms) = não há bloqueio de ramo',
      'QTc encurtado (410 ms) vs adulto (440-460 ms) — normal para idade',
      'aVR DEVE ser negativo (oposto a DI/DII/aVF)',
      'Se aVR ficar positivo → suspeitar troca RA/LA',
      'Progressão V1→V6 gradual, sem exagero de amplitude',
      'V1 com R < S; V4-V5 são pontos de transição',
      'PR em torno de 120 ms é típico (não prolongado)',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },

  /**
   * ECG Normal — Adolescente (12-18 anos)
   *
   * Características:
   * - FC semelhante a adulto jovem (60–100 bpm, típico 70–80)
   * - Eixo normal (0–90°)
   * - Padrão precordial típico de adulto
   * - Progressão R/S normal
   * - Repolarização normal
   *
   * Pontos:
   * - Praticamente adulto em termos de ECG
   * - Pode ainda ter algumas variações por desenvolvimento
   */
  normal_adolescente: {
    id: 'normal_adolescente',
    label: 'ECG Normal — Adolescente',
    category: 'normal',
    ageGroup: 'adolescente',
    description: 'Adolescente (12-18 anos). Frequência cardíaca 70–80 bpm, padrão adulto.',

    heartRate: 75,
    rrVariability: 0.025,
    prIntervalMs: 140,
    qrsDurationMs: 80,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.13,
      qAmplitude: 0.02,
      rAmplitude: 0.82,
      sAmplitude: 0.30,
      tAmplitude: 0.35,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'Ritmo sinusal',
      'Frequência cardíaca 70–80 bpm',
      'PR normal',
      'QRS estreito',
      'Eixo normal',
      'Repolarização normal',
    ],

    teachingPoints: [
      'ECG de adolescente é essencialmente igual a adulto',
      'Progressão R/S em V1→V6 é típica de padrão adulto',
      'Usar critérios de adulto para interpretação',
      'Ainda considerar desenvolvimento físico (crescimento espiralar)',
      'Alguns traços pediátricos podem perseguir até final da adolescência',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },

  /**
   * ECG Normal — Adulto
   *
   * Características:
   * - FC normal (60–100 bpm, típico 70–80)
   * - Eixo normal (0–90°)
   * - Progressão R/S típica V1→V6
   * - Repolarização normal
   * - PR, QRS, QTc dentro de limites normais
   *
   * Referência padrão para comparação.
   */
  normal_adulto: {
    id: 'normal_adulto',
    label: 'ECG Normal — Adulto',
    category: 'normal',
    ageGroup: 'adulto',
    description: 'Adulto (> 18 anos). Frequência cardíaca 70–80 bpm, padrão de referência.',

    heartRate: 75,
    rrVariability: 0.02,
    prIntervalMs: 160,
    qrsDurationMs: 90,
    qtIntervalMs: 420,

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
      'Ritmo sinusal',
      'Frequência cardíaca 60–100 bpm',
      'PR 120–200 ms',
      'QRS < 120 ms',
      'Eixo QRS 0–90°',
      'Segmento ST isoelétrico',
      'Onda T positiva (exceto aVR, V1)',
      'QTc < 450 ms',
    ],

    teachingPoints: [
      'ECG normal em adulto é padrão de referência',
      'FC 60–100 bpm é considerado normal',
      'Comparar sempre novos ECGs com normal prévio quando disponível',
      'Lembrar de interpretar no contexto clínico',
      'Nem toda anormalidade no ECG é patológica (variantes)',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },
}
