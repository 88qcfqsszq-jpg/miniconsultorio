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
}
