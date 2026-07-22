/**
 * Presets de ECG para condições inflamatórias (pericardite, miocardite).
 *
 * Padrões educacionais para fins de ensino em OSCE e semiologia. Categoria
 * separada de 'isquemia' propositalmente: pericardite é um diferencial
 * clássico de IAM, e agrupá-la sob "Isquemia/Infarto" no seletor confundiria
 * exatamente a distinção que o preset deveria ensinar.
 *
 * Referências:
 * - Imazio M, et al. 2015 ESC Guidelines for the diagnosis and management of
 *   pericardial diseases. Eur Heart J. 2015;36(42):2921-2964.
 */

import type { ECGPreset } from '../types'

export const inflammatoryPresets: Record<string, ECGPreset> = {
  /**
   * Pericardite Aguda (Adulto)
   *
   * Padrão clínico:
   * - Elevação de ST DIFUSA e côncava, sem distribuição territorial de
   *   nenhuma artéria coronária (diferencial-chave vs. IAM)
   * - Depressão recíproca em aVR (achado clássico de apoio)
   * - Ritmo sinusal mantido
   *
   * Limitação conhecida deste preset (documentada, não fabricada):
   * - Depressão do segmento PR (outro achado clássico de pericardite) NÃO é
   *   modelada — o gerador não possui modificador de PR por derivação
   *   (ModificadorDerivacaoECG só suporta stShift, tWavePolarity,
   *   fWaveOverlay, rPrimeWave). Necessário adicionar um novo campo tipo
   *   `prShift` ao gerador para reproduzir esse achado.
   *
   * Política de frequência: estado_clinico (padrão — não listado em
   * POLITICA_FREQUENCIA_POR_PRESET) — patientHeartRate prevalece.
   */
  pericardite_aguda_adulto: {
    id: 'pericardite_aguda_adulto',
    label: 'Pericardite Aguda (Adulto)',
    category: 'inflamatoria',
    ageGroup: 'adulto',
    description:
      'Elevação difusa e côncava do segmento ST, sem distribuição territorial, com depressão recíproca em aVR. Ritmo sinusal. Padrão típico de pericardite aguda.',

    // Fallback de FC. Política estado_clinico faz patientHeartRate prevalecer.
    heartRate: 80,
    rrVariability: 0.04,
    prIntervalMs: 160,
    qrsDurationMs: 90,
    qtIntervalMs: 400,

    axisProfile: 'normal',

    morphology: {
      pAmplitude: 0.12,
      qAmplitude: 0.02,
      rAmplitude: 0.80,
      sAmplitude: 0.15,
      tAmplitude: 0.35,
      tPolarity: 'positive',
      stSegment: 'elevation', // descrição global; valores reais por derivação em leadModifiers
    },

    // Elevação difusa (baixa amplitude, côncava — mais discreta que o supra
    // territorial de um IAM) em derivações de MÚLTIPLOS territórios ao mesmo
    // tempo — é exatamente essa falta de territorialidade que diferencia de
    // IAM. aVR recebe depressão recíproca (achado clássico de apoio).
    leadModifiers: {
      I:   { stShift: { tipo: 'elevation', amplitudeMv: 0.15 } },
      II:  { stShift: { tipo: 'elevation', amplitudeMv: 0.15 } },
      III: { stShift: { tipo: 'elevation', amplitudeMv: 0.15 } },
      aVF: { stShift: { tipo: 'elevation', amplitudeMv: 0.15 } },
      V2:  { stShift: { tipo: 'elevation', amplitudeMv: 0.15 } },
      V3:  { stShift: { tipo: 'elevation', amplitudeMv: 0.15 } },
      V4:  { stShift: { tipo: 'elevation', amplitudeMv: 0.15 } },
      V5:  { stShift: { tipo: 'elevation', amplitudeMv: 0.15 } },
      V6:  { stShift: { tipo: 'elevation', amplitudeMv: 0.15 } },
      aVR: { stShift: { tipo: 'depression', amplitudeMv: 0.10 } },
    },

    expectedInterpretation: [
      'Pericardite aguda',
      'Ritmo sinusal',
      'Elevação difusa e côncava de ST, sem distribuição territorial',
      'Depressão recíproca em aVR',
    ],

    teachingPoints: [
      'Elevação de ST DIFUSA (múltiplos territórios simultaneamente) é o principal diferencial contra IAM, cuja elevação segue um território coronariano único',
      'Concavidade do ST (vs. convexidade/"lápide" do IAM) reforça o diagnóstico',
      'Depressão recíproca em aVR é achado clássico de apoio',
      'Depressão do segmento PR também é clássica de pericardite, mas não é modelada neste simulador (limitação técnica documentada)',
      'Troponina pode estar discretamente elevada por acometimento miopericárdico, sem significar IAM',
      'Diagnóstico exige contexto clínico (dor pleurítica, atrito pericárdico, ecocardiograma)',
    ],

    warning:
      'Padrão sintético educacional para fins de ensino em OSCE. Não usar para diagnóstico clínico real. Depressão de PR não modelada nesta versão do simulador.',
  },
}
