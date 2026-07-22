/**
 * Presets de ECG para Isquemia e Infarto do Miocárdio
 *
 * Padrões educacionais de ECG isquêmico para fins de ensino em OSCE e semiologia.
 * Os modificadores morfológicos por derivação (leadModifiers) são aplicados pelo
 * pipeline runtime em index.ts após a transformação em 12 derivações.
 *
 * Referências:
 * - Thygesen K, et al. Fourth Universal Definition of Myocardial Infarction.
 *   Circulation. 2018;138(20):e618-e651.
 * - Sgarbossa EB, et al. Electrocardiographic diagnosis of evolving acute myocardial
 *   infarction. N Engl J Med. 1996;334(8):481-487.
 */

import type { ECGPreset } from '../types'

export const ischemiaPresets: Record<string, ECGPreset> = {
  /**
   * IAM com Supra de ST — Anterosseptal (V1–V3)
   *
   * Padrão clínico:
   * - Padrão compatível com acometimento do território anterosseptal, geralmente
   *   relacionado à Artéria Descendente Anterior
   * - Supra de ST em V1–V3 (≥ 0.1–0.2 mV); V2 tipicamente com maior elevação
   * - Ritmo sinusal mantido (exceto se evolução com arritmia — fora deste preset)
   * - FC varia conforme estado clínico do paciente (política estado_clinico)
   *
   * O que este preset representa:
   * - Fase hiperaguda/aguda de IAM anterosseptal com supradesnivelamento de ST
   * - Q patológica em V1–V3 não renderizada (além do escopo atual do gerador Gaussiano)
   * - Alterações recíprocas inferiores, especialmente em DII, DIII e aVF, não incluídas nesta etapa
   * - tWavePolarity não configurada nesta etapa
   *
   * Política de frequência: estado_clinico
   * - patientHeartRate prevalece quando fornecida (FC do caso clínico)
   * - Fallback: 75 bpm (FC de repouso adulto)
   */
  iam_supra_anterosseptal: {
    id: 'iam_supra_anterosseptal',
    label: 'IAM com Supra de ST — Anterosseptal',
    category: 'isquemia',
    ageGroup: 'adulto',
    description:
      'Infarto anterosseptal com supradesnivelamento de ST em V1–V3. Padrão compatível com acometimento do território anterosseptal. Ritmo sinusal.',

    // Fallback de FC. A política estado_clinico faz patientHeartRate prevalecer.
    heartRate: 75,
    rrVariability: 0.04,
    prIntervalMs: 160,
    qrsDurationMs: 90,
    qtIntervalMs: 400,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.12,
      qAmplitude: 0.03,
      rAmplitude: 0.85,
      sAmplitude: 0.18,
      tAmplitude: 0.35,
      tPolarity: 'positive',
      stSegment: 'elevation', // descrição global; os valores por derivação estão em leadModifiers
    },

    // Modificadores morfológicos por derivação — aplicados em runtime pelo pipeline 3b.
    // V2 recebe a maior elevação (padrão clínico do IAM anterosseptal).
    leadModifiers: {
      V1: { stShift: { tipo: 'elevation', amplitudeMv: 0.30 } },
      V2: { stShift: { tipo: 'elevation', amplitudeMv: 0.35 } },
      V3: { stShift: { tipo: 'elevation', amplitudeMv: 0.30 } },
    },

    expectedInterpretation: [
      'IAM com supra de ST anterosseptal',
      'Ritmo sinusal',
      'Supradesnivelamento de ST em V1–V3',
      'V2 com maior elevação de ST',
    ],

    teachingPoints: [
      'Supradesnivelamento de ST em V1–V3 é padrão compatível com acometimento do território anterosseptal, geralmente relacionado à Artéria Descendente Anterior',
      'Território anterosseptal: septo interventricular e parede anterior do VE',
      'V2 geralmente apresenta a maior elevação no IAM anterosseptal',
      'Ondas Q patológicas em V1–V3 podem surgir durante a evolução e sugerem necrose miocárdica',
      'Alterações recíprocas inferiores (DII, DIII, aVF) podem estar presentes na prática clínica, mas não estão incluídas neste modelo',
      'Diagnóstico de IAMCSST exige contexto clínico (dor, troponina, evolução)',
    ],

    warning:
      'Padrão sintético educacional para fins de ensino em OSCE. Não usar para diagnóstico clínico real.',
  },

  /**
   * IAM com Supra de ST — Inferior (DII, DIII, aVF)
   *
   * Padrão clínico:
   * - Território inferior, geralmente relacionado à Artéria Coronária Direita
   *   (ou circunflexa, em dominância esquerda)
   * - Supra de ST em DII, DIII, aVF (≥ 0.1 mV), com DIII tipicamente ≥ DII
   *   (padrão sugestivo de artéria coronária direita vs. circunflexa)
   * - Alterações recíprocas em DI e aVL (infradesnivelamento de ST)
   * - Ritmo sinusal mantido (exceto se evolução com bloqueio AV — fora deste preset;
   *   IAM inferior tem associação conhecida com bradiarritmias/BAV, não modelado aqui)
   * - FC varia conforme estado clínico do paciente (política estado_clinico)
   *
   * O que este preset representa:
   * - Fase hiperaguda/aguda de IAM inferior com supradesnivelamento de ST
   * - Q patológica em DII/DIII/aVF não renderizada (além do escopo atual do gerador)
   * - tWavePolarity não configurada nesta etapa
   *
   * Política de frequência: estado_clinico
   * - patientHeartRate prevalece quando fornecida (FC do caso clínico)
   * - Fallback: 75 bpm (FC de repouso adulto)
   */
  iam_inferior: {
    id: 'iam_inferior',
    label: 'IAM com Supra de ST — Inferior',
    category: 'isquemia',
    ageGroup: 'adulto',
    description:
      'Infarto inferior com supradesnivelamento de ST em DII, DIII e aVF, e alterações recíprocas em DI e aVL. Padrão compatível com acometimento do território inferior. Ritmo sinusal.',

    // Fallback de FC. A política estado_clinico faz patientHeartRate prevalecer.
    heartRate: 75,
    rrVariability: 0.04,
    prIntervalMs: 160,
    qrsDurationMs: 90,
    qtIntervalMs: 400,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.12,
      qAmplitude: 0.03,
      rAmplitude: 0.85,
      sAmplitude: 0.18,
      tAmplitude: 0.35,
      tPolarity: 'positive',
      stSegment: 'elevation', // descrição global; os valores por derivação estão em leadModifiers
    },

    // Modificadores morfológicos por derivação — aplicados em runtime pelo pipeline 3b.
    // DIII recebe a maior elevação (padrão sugestivo de artéria coronária direita).
    // DI/aVL recebem depressão recíproca (achado clássico de IAM inferior).
    leadModifiers: {
      II:  { stShift: { tipo: 'elevation', amplitudeMv: 0.30 } },
      III: { stShift: { tipo: 'elevation', amplitudeMv: 0.35 } },
      aVF: { stShift: { tipo: 'elevation', amplitudeMv: 0.30 } },
      I:   { stShift: { tipo: 'depression', amplitudeMv: 0.10 } },
      aVL: { stShift: { tipo: 'depression', amplitudeMv: 0.15 } },
    },

    expectedInterpretation: [
      'IAM com supra de ST inferior',
      'Ritmo sinusal',
      'Supradesnivelamento de ST em DII, DIII, aVF',
      'DIII com maior elevação de ST que DII',
      'Infradesnivelamento recíproco em DI e aVL',
    ],

    teachingPoints: [
      'Supradesnivelamento de ST em DII, DIII, aVF é padrão compatível com acometimento do território inferior, geralmente relacionado à Artéria Coronária Direita',
      'DIII com elevação maior que DII sugere artéria coronária direita como vaso culpado (vs. circunflexa quando DII≥DIII)',
      'Infradesnivelamento recíproco em DI e aVL é achado de apoio para IAM inferior (aumenta especificidade)',
      'IAM inferior tem associação conhecida com bradiarritmias e bloqueio AV (envolvimento do nó AV pela artéria coronária direita) — não modelado neste preset',
      'Considerar sempre derivações direitas (V3R-V4R) para rastrear infarto de ventrículo direito associado',
      'Diagnóstico de IAMCSST exige contexto clínico (dor, troponina, evolução)',
    ],

    warning:
      'Padrão sintético educacional para fins de ensino em OSCE. Não usar para diagnóstico clínico real.',
  },

  /**
   * Isquemia Subendocárdica — Infradesnivelamento de ST Inferior (DII, DIII, aVF)
   *
   * Padrão clínico (caso 18 — IAM sem supra de ST):
   * - Infradesnivelamento de ST de 2-3mm (0,20-0,25 mV) em DII, DIII, aVF
   * - Inversão de onda T associada nas mesmas derivações
   * - SEM elevação de ST em nenhuma derivação (distingue de IAMCSST)
   * - Ritmo sinusal
   *
   * Política de frequência: estado_clinico (padrão) — patientHeartRate prevalece.
   */
  isquemia_subendocardica: {
    id: 'isquemia_subendocardica',
    label: 'Isquemia Subendocárdica — Infra de ST Inferior',
    category: 'isquemia',
    ageGroup: 'adulto',
    description:
      'Infradesnivelamento de ST (2-3mm) em DII, DIII e aVF, com inversão de onda T associada. Sem elevação de ST em nenhuma derivação. Ritmo sinusal.',

    heartRate: 75,
    rrVariability: 0.04,
    prIntervalMs: 160,
    qrsDurationMs: 90,
    qtIntervalMs: 400,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.12,
      qAmplitude: 0.02,
      rAmplitude: 0.80,
      sAmplitude: 0.18,
      tAmplitude: 0.30,
      tPolarity: 'negative',
      stSegment: 'depression',
    },

    // Infra-ST 2-3mm (0,20-0,25 mV) + T invertida nas MESMAS derivações do
    // achado textual do caso (D2/D3/aVF = DII/DIII/aVF). Sem nenhuma elevação.
    leadModifiers: {
      II:  { stShift: { tipo: 'depression', amplitudeMv: 0.20 }, tWavePolarity: 'negative' },
      III: { stShift: { tipo: 'depression', amplitudeMv: 0.25 }, tWavePolarity: 'negative' },
      aVF: { stShift: { tipo: 'depression', amplitudeMv: 0.20 }, tWavePolarity: 'negative' },
    },

    expectedInterpretation: [
      'Isquemia subendocárdica inferior (IAM sem supra de ST)',
      'Ritmo sinusal',
      'Infradesnivelamento de ST em DII, DIII, aVF',
      'Inversão de onda T associada nas mesmas derivações',
    ],

    teachingPoints: [
      'Infradesnivelamento de ST (não elevação) é o achado que classifica como "sem supra" (NSTEMI/isquemia subendocárdica)',
      'A ausência de elevação em qualquer derivação é o que diferencia de IAMCSST — não é "menos grave" apenas por não ter supra',
      'Inversão de T acompanhando o infra reforça isquemia ativa',
      'Diagnóstico de IAM sem supra depende de troponina elevada — o ECG por si só não distingue de angina instável',
    ],

    warning:
      'Padrão sintético educacional para fins de ensino em OSCE. Não usar para diagnóstico clínico real.',
  },

  /**
   * Isquemia com Inversão de T predominante (DII, DIII, aVF)
   *
   * Padrão clínico (caso 19 — Angina Instável):
   * - Inversão de onda T em DII, DIII, aVF como achado PRINCIPAL
   * - ST apenas "no nível ou levemente deprimido" (não o infra franco de 2-3mm
   *   do caso 18) — depressão mínima, deliberadamente mais discreta
   * - SEM elevação de ST em nenhuma derivação
   * - Ritmo sinusal
   *
   * Diferença intencional do preset isquemia_subendocardica (caso 18): aqui a
   * depressão de ST é mínima (0,05 mV) — o achado central é a T invertida, não
   * o infradesnivelamento. Presets NÃO compartilhados propositalmente.
   *
   * Política de frequência: estado_clinico (padrão) — patientHeartRate prevalece.
   */
  isquemia_inversao_t: {
    id: 'isquemia_inversao_t',
    label: 'Isquemia — Inversão de T Inferior',
    category: 'isquemia',
    ageGroup: 'adulto',
    description:
      'Inversão de onda T em DII, DIII e aVF como achado predominante, com segmento ST apenas levemente deprimido (não o infra franco de uma isquemia subendocárdica estabelecida). Sem elevação de ST. Ritmo sinusal.',

    heartRate: 75,
    rrVariability: 0.04,
    prIntervalMs: 160,
    qrsDurationMs: 90,
    qtIntervalMs: 400,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.12,
      qAmplitude: 0.02,
      rAmplitude: 0.82,
      sAmplitude: 0.16,
      tAmplitude: 0.28,
      tPolarity: 'negative',
      stSegment: 'depression',
    },

    // T invertida é o achado central; ST só levemente deprimido (0,05 mV —
    // bem menor que os 0,20-0,25 mV de isquemia_subendocardica), refletindo
    // "segmento ST no nível ou levemente deprimido" do texto do caso 19.
    leadModifiers: {
      II:  { stShift: { tipo: 'depression', amplitudeMv: 0.05 }, tWavePolarity: 'negative' },
      III: { stShift: { tipo: 'depression', amplitudeMv: 0.05 }, tWavePolarity: 'negative' },
      aVF: { stShift: { tipo: 'depression', amplitudeMv: 0.05 }, tWavePolarity: 'negative' },
    },

    expectedInterpretation: [
      'Isquemia inferolateral sem supra (Angina Instável)',
      'Ritmo sinusal',
      'Inversão de onda T em DII, DIII, aVF',
      'Segmento ST no nível ou levemente deprimido',
    ],

    teachingPoints: [
      'Inversão de T isolada (sem infra franco de ST) é compatível com isquemia menos estabelecida que a subendocárdica clássica',
      'Angina instável classicamente tem troponina normal — o ECG mostra isquemia sem necrose confirmada',
      'Comparar com isquemia_subendocardica (caso de IAM sem supra): lá o infra-ST é franco (2-3mm); aqui é mínimo e a T invertida domina o quadro',
      'Reavaliação seriada do ECG e da troponina é mandatória em 3-6h',
    ],

    warning:
      'Padrão sintético educacional para fins de ensino em OSCE. Não usar para diagnóstico clínico real.',
  },

  /**
   * IAM com Supra de ST — Anterior extenso (V1–V4)
   *
   * Padrão clínico (caso 58 — IAM em Síndrome Metabólica):
   * - "ST elevado em V1-V4 (IAM anterior)" — território anterior mais extenso
   *   que o anterosseptal clássico (V1-V3)
   * - Sem menção de alteração recíproca no texto do caso — não adicionada
   *   (evita inventar achado não documentado)
   * - Ritmo sinusal, taquicárdico (FC do caso: 115bpm, herdada via patientHeartRate)
   *
   * Caso 20 permanece mapeado para iam_supra_anterosseptal (V1-V3) — este
   * preset NÃO o substitui nem o altera.
   *
   * Política de frequência: estado_clinico (padrão) — patientHeartRate prevalece.
   */
  iam_supra_anterosseptal_v1_v4: {
    id: 'iam_supra_anterosseptal_v1_v4',
    label: 'IAM com Supra de ST — Anterior Extenso (V1–V4)',
    category: 'isquemia',
    ageGroup: 'adulto',
    description:
      'Infarto anterior extenso com supradesnivelamento de ST em V1, V2, V3 e V4. Território anterior mais amplo que o anterosseptal clássico. Ritmo sinusal.',

    heartRate: 75,
    rrVariability: 0.04,
    prIntervalMs: 160,
    qrsDurationMs: 90,
    qtIntervalMs: 400,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.12,
      qAmplitude: 0.03,
      rAmplitude: 0.85,
      sAmplitude: 0.18,
      tAmplitude: 0.35,
      tPolarity: 'positive',
      stSegment: 'elevation',
    },

    // Supra em V1-V4 (vs. V1-V3 do preset anterosseptal clássico) — cobre o
    // achado textual exato do caso 58 ("ST elevado em V1-V4").
    leadModifiers: {
      V1: { stShift: { tipo: 'elevation', amplitudeMv: 0.30 } },
      V2: { stShift: { tipo: 'elevation', amplitudeMv: 0.35 } },
      V3: { stShift: { tipo: 'elevation', amplitudeMv: 0.30 } },
      V4: { stShift: { tipo: 'elevation', amplitudeMv: 0.25 } },
    },

    expectedInterpretation: [
      'IAM com supra de ST anterior extenso',
      'Ritmo sinusal',
      'Supradesnivelamento de ST em V1, V2, V3 e V4',
    ],

    teachingPoints: [
      'Envolvimento de V1-V4 sugere território anterior mais extenso que o anterosseptal isolado (V1-V3), geralmente por oclusão mais proximal da Descendente Anterior',
      'Quanto mais precordiais envolvidas, maior a área de miocárdio em risco',
      'Diagnóstico de IAMCSST exige contexto clínico (dor, troponina, evolução)',
    ],

    warning:
      'Padrão sintético educacional para fins de ensino em OSCE. Não usar para diagnóstico clínico real.',
  },
}
