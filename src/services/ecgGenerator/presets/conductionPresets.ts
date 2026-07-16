/**
 * Presets de Distúrbios de Condução AV e de Ramo
 *
 * Padrões educacionais para reconhecimento de:
 * - Bloqueios atrioventriculares (1º, 2º, 3º graus)
 * - Bloqueios de ramo (direito, esquerdo)
 *
 * Fins educacionais apenas. Não são modelos clinicamente validados.
 */

import type { ECGPreset } from '../types'

export const conductionPresets: Record<string, ECGPreset> = {
  /**
   * Bloqueio AV de 1º Grau
   *
   * Características:
   * - PR prolongado (> 200 ms) mas constante
   * - Toda onda P é conduzida
   * - QRS presente após toda P
   * - Ritmo regular
   *
   * Diagnóstico:
   * - PR > 200 ms em adulto
   * - Ritmo sinusal mantido
   * - Sem perda de QRS
   */
  bloqueio_av_primeiro_grau: {
    id: 'bloqueio_av_primeiro_grau',
    label: 'Bloqueio AV de 1º Grau',
    category: 'conducao',
    ageGroup: 'adulto',
    description: 'Intervalo PR prolongado (240 ms) com condução AV mantida.',

    heartRate: 70,
    rrVariability: 0.02,
    prIntervalMs: 240,
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
      'Ritmo sinusal',
      'Intervalo PR prolongado (240 ms)',
      'Toda onda P conduzida',
      'QRS estreito',
      'Compatível com bloqueio AV de 1º grau',
    ],

    teachingPoints: [
      'Diagnóstico feito pelo PR prolongado (> 200 ms)',
      'Não há perda de QRS',
      'Não há pausa',
      'Diferenciar de bloqueios AV de 2º grau',
      'Geralmente benigno em contexto isolado',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },

  /**
   * Bloqueio AV de 2º Grau Mobitz I (Wenckebach)
   *
   * Características:
   * - PR progressivamente maior
   * - Depois ocorre onda P não conduzida
   * - Pausa com P bloqueada
   * - Ciclo reinicia com PR menor
   * - Padrão repetitivo (2:1, 3:2, 4:3, etc)
   *
   * Educação:
   * - Fenômeno de Wenckebach
   * - Geralmente em nó AV
   * - Melhor prognóstico que Mobitz II
   */
  bloqueio_av_mobitz_i: {
    id: 'bloqueio_av_mobitz_i',
    label: 'Bloqueio AV de 2º Grau — Mobitz I',
    category: 'conducao',
    ageGroup: 'adulto',
    description: 'Intervalo PR progressivamente maior antes de onda P não conduzida. Fenômeno de Wenckebach.',

    heartRate: 65,
    rrVariability: 0.05,
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
      'Bloqueio AV de 2º grau Mobitz I',
      'Fenômeno de Wenckebach',
      'PR progressivamente alongado',
      'Onda P periódica não conduzida',
      'Pausa compensatória após P bloqueada',
    ],

    teachingPoints: [
      'PR progressivamente maior até não conduzir',
      'Uma onda P fica sem QRS (bloqueada)',
      'Geralmente origem em nó AV',
      'Prognóstico geralmente benigno',
      'Diferente de Mobitz II (PR não alonga)',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },

  /**
   * Bloqueio AV de 2º Grau Mobitz II
   *
   * Características:
   * - PR constante nos batimentos conduzidos
   * - Queda súbita de QRS
   * - Ondas P bloqueadas sem alongamento prévio
   * - QRS pode ser estreito ou largo
   * - Padrão 2:1, 3:1, ou variável
   *
   * Educação:
   * - Mais grave que Mobitz I
   * - Risco de progressão para BAV total
   * - Geralmente infranodal (His/abaixo)
   */
  bloqueio_av_mobitz_ii: {
    id: 'bloqueio_av_mobitz_ii',
    label: 'Bloqueio AV de 2º Grau — Mobitz II',
    category: 'conducao',
    ageGroup: 'adulto',
    description: 'Intervalo PR constante com queda súbita de QRS. Mais preocupante que Mobitz I.',

    heartRate: 60,
    rrVariability: 0.08,
    prIntervalMs: 160,
    qrsDurationMs: 110,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.13,
      qAmplitude: 0.02,
      rAmplitude: 0.82,
      sAmplitude: 0.32,
      tAmplitude: 0.36,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'Bloqueio AV de 2º grau Mobitz II',
      'PR constante nos batimentos conduzidos',
      'Queda súbita de QRS',
      'Onda P bloqueada sem alongamento prévio',
      'Risco de progressão',
    ],

    teachingPoints: [
      'No Mobitz II, PR não vai alongando',
      'Falha é súbita, não progressiva',
      'Indica lesão infranodal',
      'Maior risco que Mobitz I',
      'Pode requerer marca-passo',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },

  /**
   * Bloqueio AV 2:1
   *
   * Características:
   * - Uma onda P conduzida, uma bloqueada
   * - Padrão alternado repetitivo
   * - Frequência ventricular reduzida (metade da atrial)
   * - Não é possível classificar como Mobitz I ou II apenas pelo padrão
   *
   * Educação:
   * - Exige contexto clínico para classificar
   * - Pode evoluir para BAV total
   */
  bloqueio_av_2_1: {
    id: 'bloqueio_av_2_1',
    label: 'Bloqueio AV 2:1',
    category: 'conducao',
    ageGroup: 'adulto',
    description: 'Bloqueio de 2º grau 2:1 com alternância de P conduzida/bloqueada.',

    heartRate: 45,
    rrVariability: 0.03,
    prIntervalMs: 160,
    qrsDurationMs: 90,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.14,
      qAmplitude: 0.02,
      rAmplitude: 0.82,
      sAmplitude: 0.32,
      tAmplitude: 0.37,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'Bloqueio AV 2:1',
      'Uma onda P conduzida, uma bloqueada',
      'Padrão alternado regular',
      'Frequência ventricular ~45 bpm (metade da atrial)',
      'Tipo (Mobitz I vs II) não pode ser determinado apenas pelo padrão 2:1',
    ],

    teachingPoints: [
      'Padrão 2:1 exige cautela na interpretação',
      'Avaliar QRS e contexto clínico',
      'Comparar com ECG anterior se disponível',
      'Pode mascarar Mobitz II',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },

  /**
   * Bloqueio AV Total (3º Grau)
   *
   * Características:
   * - Ondas P regulares
   * - QRS regulares em frequência diferente de P
   * - Dissociação AV completa
   * - P e QRS "marcham" independentemente
   * - Frequência ventricular lenta
   *
   * Educação:
   * - Achado grave
   * - Requer marca-passo
   * - Ritmo de escape ventricular/juncional
   */
  bloqueio_av_total: {
    id: 'bloqueio_av_total',
    label: 'Bloqueio AV Total',
    category: 'conducao',
    ageGroup: 'adulto',
    description: 'Bloqueio AV de 3º grau com dissociação atrioventricular completa.',

    heartRate: 38,
    rrVariability: 0.02,
    prIntervalMs: 0,  // Sem relação entre P e QRS
    qrsDurationMs: 120,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.14,
      qAmplitude: 0.03,
      rAmplitude: 0.75,
      sAmplitude: 0.35,
      tAmplitude: 0.38,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'Bloqueio AV de 3º grau',
      'Dissociação atrioventricular',
      'Ondas P regulares, QRS regulares mas em frequência diferente',
      'P e QRS marcham independentemente',
      'Frequência ventricular lenta (~38 bpm)',
      'Ritmo de escape (ventricular ou juncional)',
    ],

    teachingPoints: [
      'P e QRS não têm relação temporal',
      'Ondas P aparecem aleatoriamente em relação ao QRS',
      'Frequência ventricular determinada pelo ritmo de escape',
      'Achado potencialmente crítico',
      'Requer marca-passo em maioria dos casos',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },

  /**
   * Bloqueio de Ramo Direito (BRDE)
   *
   * Características:
   * - QRS ≥ 120 ms (alargado)
   * - Padrão rSR' em V1 (ou RSR')
   * - S profunda em DI e V6
   * - Discretas alterações secundárias de ST-T
   *
   * Educação:
   * - Início tardio em V1
   * - BRDE pode ser completo (QRS > 120) ou incompleto (100-119)
   */
  bloqueio_ramo_direito: {
    id: 'bloqueio_ramo_direito',
    label: 'Bloqueio de Ramo Direito',
    category: 'conducao',
    ageGroup: 'adulto',
    description: 'QRS alargado (140 ms) com padrão rSR\' em V1 e S profunda em lateral.',

    heartRate: 75,
    rrVariability: 0.02,
    prIntervalMs: 160,
    qrsDurationMs: 140,
    qrsPattern: 'rsR_prime_V1',

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.12,
      qAmplitude: 0.02,
      rAmplitude: 0.85,
      sAmplitude: 0.35,
      tAmplitude: 0.35,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    leadModifiers: {
      // R' positivo em V1 e V2 (padrão rSR' do BRD). delay/width calibrados para
      // que a duração do QRS medida no sinal caia em 120–160 ms (validado em 100 seeds).
      V1:  { rPrimeWave: { amplitudeMv: 0.28, delayMs: 75, widthMs: 45 } },
      V2:  { rPrimeWave: { amplitudeMv: 0.22, delayMs: 75, widthMs: 45 } },
      // Onda S terminal larga nas derivações laterais (invert=true = deflexão negativa)
      I:   { rPrimeWave: { amplitudeMv: 0.28, delayMs: 75, widthMs: 43, invert: true } },
      aVL: { rPrimeWave: { amplitudeMv: 0.22, delayMs: 75, widthMs: 43, invert: true } },
      V5:  { rPrimeWave: { amplitudeMv: 0.28, delayMs: 75, widthMs: 43, invert: true } },
      V6:  { rPrimeWave: { amplitudeMv: 0.24, delayMs: 75, widthMs: 43, invert: true } },
    },

    expectedInterpretation: [
      'Bloqueio de ramo direito',
      'QRS alargado (≥ 120 ms)',
      'Padrão rSR\' em V1',
      'S profunda em DI e V6',
      'Discretas alterações secundárias de repolarização',
    ],

    teachingPoints: [
      'Procurar padrão rSR\' em V1 (ou RSR\')',
      'Olhar também S em V6 e DI',
      'BRDE completo: QRS > 120 ms',
      'BRDE incompleto: QRS 100-119 ms',
      'Diferenciar de hipertrofia ventricular ou pré-excitação',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },

  /**
   * Bloqueio de Ramo Esquerdo (BRDE)
   *
   * Características:
   * - QRS ≥ 120 ms (alargado)
   * - R ampla/entalhada em DI, aVL, V5, V6
   * - S profunda em V1 (e frequentemente V2-V3)
   * - Alterações secundárias de ST-T (depressão de ST e T invertida)
   *
   * Educação:
   * - Melhor prognóstico que BRDE incompleto
   * - Dificulta análise de isquemia miocárdica
   */
  bloqueio_ramo_esquerdo: {
    id: 'bloqueio_ramo_esquerdo',
    label: 'Bloqueio de Ramo Esquerdo',
    category: 'conducao',
    ageGroup: 'adulto',
    description: 'QRS alargado (150 ms) com R ampla/entalhada em lateral e S profunda em V1.',

    heartRate: 75,
    rrVariability: 0.02,
    prIntervalMs: 160,
    qrsDurationMs: 150,
    qrsPattern: 'broad_R_lateral',

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.12,
      qAmplitude: 0.02,
      rAmplitude: 0.88,
      sAmplitude: 0.40,
      tAmplitude: 0.32,
      tPolarity: 'positive',
      stSegment: 'depression',
    },

    expectedInterpretation: [
      'Bloqueio de ramo esquerdo',
      'QRS alargado (≥ 120 ms)',
      'R ampla/entalhada em DI, aVL, V5, V6',
      'S profunda em V1 e V2',
      'Alterações secundárias de ST-T',
      'Dificulta análise de isquemia',
    ],

    teachingPoints: [
      'BRDE impede análise de IAM típica',
      'Procurar R ampla lateral (DI, aVL, V5, V6)',
      'S muito profunda em V1',
      'Podem haver alterações de ST/T secundárias',
      'Diferenciar de hipertrofia VE ou pré-excitação',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },
}
