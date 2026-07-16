/**
 * Presets de Extrassístoles e Taquiarritmias
 *
 * Padrões educacionais para reconhecimento de:
 * - Extrassístoles supraventriculares e ventriculares
 * - Arritmias (fibrilação atrial, flutter, TSV, TV)
 *
 * Fins educacionais apenas. Não são modelos clinicamente validados.
 */

import type { ECGPreset } from '../types'

export const arrhythmiaPresets: Record<string, ECGPreset> = {
  /**
   * Extrassístole Supraventricular Isolada
   *
   * Características:
   * - Batimento precoce isolado
   * - QRS estreito
   * - Onda P diferente ou sobreposta ao traçado
   * - Pausa compensatória incompleta
   *
   * Educação:
   * - QRS estreito = origem supraventricular
   * - Pode ser achado benigno em contexto apropriado
   */
  extrassistole_supraventricular_isolada: {
    id: 'extrassistole_supraventricular_isolada',
    label: 'Extrassístole Supraventricular Isolada',
    category: 'ritmo',
    ageGroup: 'adulto',
    description: 'Batimento precoce isolado com QRS estreito, sugestivo de origem supraventricular.',

    heartRate: 80,
    rrVariability: 0.10,
    prIntervalMs: 160,
    qrsDurationMs: 90,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.12,
      qAmplitude: 0.02,
      rAmplitude: 0.82,
      sAmplitude: 0.30,
      tAmplitude: 0.36,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'Ritmo sinusal com extrassístole supraventricular isolada',
      'Batimento precoce com QRS estreito',
      'Pausa compensatória incompleta',
      'Onda P diferente ou ausente no batimento ectópico',
    ],

    teachingPoints: [
      'QRS estreito sugere origem supraventricular',
      'Procurar onda P diferente antes do QRS precoce',
      'Pausa compensatória incompleta é típica',
      'Pode ser achado benigno em assintomáticos',
      'Avaliar frequência: isolada vs frequentes',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },

  /**
   * Extrassístole Ventricular Isolada
   *
   * Características:
   * - Batimento precoce isolado
   * - QRS largo e bizarro
   * - Sem onda P visível
   * - Pausa compensatória completa
   *
   * Educação:
   * - QRS largo = origem ventricular
   * - Avaliar frequência, sintomas e contexto clínico
   */
  extrassistole_ventricular_isolada: {
    id: 'extrassistole_ventricular_isolada',
    label: 'Extrassístole Ventricular Isolada',
    category: 'ritmo',
    ageGroup: 'adulto',
    description: 'Batimento precoce isolado com QRS largo e bizarro, sugestivo de origem ventricular.',

    heartRate: 80,
    rrVariability: 0.15,
    prIntervalMs: 160,
    qrsDurationMs: 140,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.12,
      qAmplitude: 0.02,
      rAmplitude: 0.80,
      sAmplitude: 0.40,
      tAmplitude: 0.35,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'Ritmo sinusal com extrassístole ventricular isolada',
      'Batimento precoce com QRS largo',
      'Pausa compensatória completa',
      'Sem onda P associada ao batimento ectópico',
      'Compatível com origem ventricular',
    ],

    teachingPoints: [
      'QRS largo sugere origem ventricular',
      'Procurar pausa compensatória completa',
      'Onda P do batimento seguinte pode estar durante T anterior',
      'Avaliar morfologia do QRS ectópico (origem VS, VD, ápex)',
      'Frequência e contexto clínico são importantes',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },

  /**
   * Fibrilação Atrial
   *
   * Características:
   * - Ausência de onda P organizada
   * - Linha de base irregular ("trama fibrilatória")
   * - RR irregularmente irregular
   * - QRS geralmente estreito
   * - Frequência ventricular elevada e irregular
   *
   * Educação:
   * - Diagnóstico pelo ritmo irregularmente irregular
   * - Diferenciar de extrassístoles frequentes
   * - Risco de tromboembolismo
   */
  fibrilacao_atrial: {
    id: 'fibrilacao_atrial',
    label: 'Fibrilação Atrial',
    category: 'ritmo',
    ageGroup: 'adulto',
    description: 'Ritmo irregularmente irregular sem ondas P organizadas, sugestivo de fibrilação atrial.',

    heartRate: 120,
    rrVariability: 0.30,
    prIntervalMs: 0,  // Sem P organizada
    qrsDurationMs: 90,
    

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.0,  // Ausência de P
      qAmplitude: 0.02,
      rAmplitude: 0.78,
      sAmplitude: 0.32,
      tAmplitude: 0.34,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'Fibrilação atrial',
      'Ritmo irregularmente irregular',
      'Ausência de ondas P organizadas',
      'Trama fibrilatória visível na linha de base',
      'Frequência ventricular ~120 bpm (frequência media)',
      'QRS geralmente estreito',
    ],

    teachingPoints: [
      'Ritmo irregularmente irregular é a chave',
      'Procurar ausência de P nítida e organizada',
      'Trama fibrilatória fina (FA rápida) vs grosseira (FA lenta)',
      'RR completamente irregular, sem padrão',
      'Risco de tromboembolismo — anticoagulação indicada',
      'Diferenciar de flutter atrial 2:1 (que é regular)',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },

  /**
   * Flutter Atrial 2:1
   *
   * Características:
   * - Taquicardia regular (QRS regular)
   * - QRS estreito
   * - Ondas F serrilhadas visíveis, principalmente em DII, DIII, aVF
   * - Frequência ventricular próxima de 150 bpm (metade da atrial ~300)
   * - Ondas F entre QRS (geralmente mascaradas)
   *
   * Educação:
   * - Taquicardia regular ~150 bpm lembrar flutter 2:1
   * - Procurar ondas F em derivações inferiores
   */
  flutter_atrial_2_1: {
    id: 'flutter_atrial_2_1',
    label: 'Flutter Atrial 2:1',
    category: 'ritmo',
    ageGroup: 'adulto',
    description: 'Taquicardia regular com condução AV 2:1 de flutter atrial.',

    heartRate: 150,
    rrVariability: 0.01,
    prIntervalMs: 150,  // Relativo à F
    qrsDurationMs: 90,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.08,  // Ondas F reduzidas em amplitude
      qAmplitude: 0.02,
      rAmplitude: 0.78,
      sAmplitude: 0.32,
      tAmplitude: 0.34,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    leadModifiers: {
      II:   { fWaveOverlay: { amplitudeMv: 0.20, frequencyBpm: 300, invert: true  } },
      III:  { fWaveOverlay: { amplitudeMv: 0.18, frequencyBpm: 300, invert: true  } },
      aVF:  { fWaveOverlay: { amplitudeMv: 0.18, frequencyBpm: 300, invert: true  } },
      V1:   { fWaveOverlay: { amplitudeMv: 0.15, frequencyBpm: 300, invert: false } },
    },

    expectedInterpretation: [
      'Flutter atrial com condução 2:1',
      'Taquicardia regular com QRS estreito',
      'Frequência ventricular ~150 bpm',
      'Ondas F serrilhadas visíveis (mainly em DII, DIII, aVF)',
      'Padrão serrilhado característico em derivações inferiores',
    ],

    teachingPoints: [
      'Taquicardia regular ~150 bpm → pensar flutter 2:1',
      'Procurar padrão de ondas F em "dente de serra"',
      'Em DII/DIII/aVF há melhor visualização das F',
      'Frequência atrial ~300 bpm (2:1 = VF ~150)',
      'Diferenciar de TSV (aqui há ondas F distintas)',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },

  /**
   * Taquicardia Supraventricular
   *
   * Características:
   * - Ritmo muito regular
   * - QRS estreito
   * - Frequência elevada (~180 bpm)
   * - Onda P ausente, retrógrada ou incorporada ao QRS/ST
   * - Início abrupto
   *
   * Educação:
   * - Diferenciar de taquicardia sinusal
   * - TSV é mais regular, mais rápida, P menos visível
   * - Origem em AV node (TSVNODAL) ou via acessória (TSVREENTRADA)
   */
  taquicardia_supraventricular: {
    id: 'taquicardia_supraventricular',
    label: 'Taquicardia Supraventricular',
    category: 'ritmo',
    ageGroup: 'adulto',
    description: 'Taquicardia regular com QRS estreito e frequência elevada ~180 bpm.',

    heartRate: 180,
    rrVariability: 0.005,
    prIntervalMs: 0,  // P retrógrada/incorporada
    qrsDurationMs: 80,


    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.02,  // P reduzida/oculta
      qAmplitude: 0.02,
      rAmplitude: 0.78,
      sAmplitude: 0.30,
      tAmplitude: 0.32,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'Taquicardia supraventricular',
      'Taquicardia regular com QRS estreito',
      'Frequência ~180 bpm',
      'Onda P ausente, retrógrada ou incorporada',
      'Início abrupto compatível com TSV',
      'Ritmo muito regular (vs taquicardia sinusal)',
    ],

    teachingPoints: [
      'Ritmo muito regular diferencia de taquicardia sinusal',
      'P ausente ou retrógrada (negativa em DII/DIII/aVF)',
      'QRS estreito indica origem supraventricular',
      'FC mais alta que taquicardia sinusal (típico ~180)',
      'Mecanismo: nodal vs reentrada via AV (TSVN vs TSVRA)',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },

  /**
   * Taquicardia Ventricular Monomórfica
   *
   * Características:
   * - Taquicardia regular
   * - QRS largo (>120 ms)
   * - Morfologia consistente entre complexos
   * - Onda P ausente ou dissociada
   * - Frequência ventricular elevada (~170 bpm)
   *
   * Educação:
   * - Tratar taquicardia de QRS largo como TV até prova em contrário
   * - TV monomórfica = mesma origem cada vez
   * - Prognóstico depende do contexto clínico (cardiopatia?)
   */
  taquicardia_ventricular_monomorfica: {
    id: 'taquicardia_ventricular_monomorfica',
    label: 'Taquicardia Ventricular Monomórfica',
    category: 'ritmo',
    ageGroup: 'adulto',
    description: 'Taquicardia regular com QRS largo e morfologia consistente.',

    heartRate: 170,
    rrVariability: 0.01,
    prIntervalMs: 0,  // Sem P organizada
    qrsDurationMs: 170,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.0,  // P ausente/dissociada
      qAmplitude: 0.02,
      rAmplitude: 0.75,
      sAmplitude: 0.45,
      tAmplitude: 0.35,
      tPolarity: 'positive',
      stSegment: 'normal',
    },

    expectedInterpretation: [
      'Taquicardia ventricular monomórfica',
      'Taquicardia regular com QRS largo',
      'Frequência ~170 bpm',
      'Morfologia do QRS consistente',
      'Onda P ausente ou dissociada',
      'Compatível com origem ventricular',
    ],

    teachingPoints: [
      'Taquicardia de QRS largo = TV até prova contrária',
      'Procurar dissociação AV (P independente de QRS)',
      'Captura ou fusão de batimentos = confirmação de TV',
      'Origem: septo, VD, VE, ápex, base',
      'TV monomórfica = mesma origem repetitiva',
      'Contexto clínico crucial: cardiopatia? IAм? Displasia?',
    ],

    warning: 'Padrão sintético educacional para fins de ensino. Não usar para diagnóstico real.',
  },
}
