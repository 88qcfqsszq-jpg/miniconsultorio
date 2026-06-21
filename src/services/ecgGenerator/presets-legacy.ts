/**
 * Presets de ECG com parâmetros técnicos para geração ECGSYN
 *
 * Cada preset contém:
 * - Parâmetros técnicos do sinal (frequência, variabilidade, morfologia)
 * - Dados clínicos (laudo, observações, pontos de ensino)
 * - Interpretação esperada
 *
 * Baseado em: https://physionet.org/content/ecgsyn/1.0.0/
 */

import type { PresetECG } from './types'

export const PRESETS_ECG: Record<string, PresetECG> = {
  // ========================================================================
  // ECG PEDIÁTRICO NORMAL
  // ========================================================================

  ecg_pediatrico_normal: {
    id: 'ecg_pediatrico_normal',
    titulo: 'ECG Pediátrico Normal',
    descricao: 'ECG normal de uma criança lactente (3-12 meses)',
    grupoIdade: 'lactente',
    parametrosECGSyn: {
      frequenciaCardiaca: 110,
      numeroIntervalos: 12,
      frequenciaAmostragem: 250,
      variacaoRR: 0.02,
      razaoLFHF: 1.0,
      amplitude: {
        P: 0.15,    // Aumentado de 0.12 para melhor visualização pediátrica
        Q: 0.02,
        R: 0.9,     // Aumentado de 0.8 para lactente (predomínio VD)
        S: 0.25,    // Reduzido de 0.3 para padrão pediátrico
        T: 0.40,    // Aumentado de 0.35 para onda T mais visível
      },
      duracao: 5,
      ruido: 0,
      agrupoIdade: 'lactente',
    },
    dadosClinicosPadrao: {
      laudo:
        'ECG pediátrico normal. Ritmo sinusal regular compatível com idade. Sem alterações de repolarização.',
      observacoesClinicas: [
        'Frequência cardíaca entre 100-160 bpm compatível com idade',
        'Ritmo sinusal regular',
        'Eixo QRS entre +60° e +120°',
      ],
      pontosEnsino: [
        'Frequência cardíaca elevada é normal em lactentes',
        'Onda P pequena e positiva em DII/DIII',
        'Progressão apropriada de R/S em precordiais',
        'Onda T bifásica ou negativa em V1-V2 é normal',
        'QTc normal: ~400-420 ms',
      ],
    },
  },

  // ========================================================================
  // TAQUICARDIA SINUSAL PEDIÁTRICA
  // ========================================================================

  taquicardia_sinusal_pediatrica: {
    id: 'taquicardia_sinusal_pediatrica',
    titulo: 'Taquicardia Sinusal Pediátrica',
    descricao: 'Resposta normal a demandas metabólicas',
    grupoIdade: 'crianca',
    parametrosECGSyn: {
      frequenciaCardiaca: 150,
      numeroIntervalos: 12,
      frequenciaAmostragem: 250,
      variacaoRR: 0.015,
      razaoLFHF: 1.5,
      amplitude: {
        P: 0.12,
        Q: 0.02,
        R: 0.85,
        S: 0.32,
        T: 0.36,
      },
      duracao: 5,
      ruido: 0,
      agrupoIdade: 'crianca',
    },
    dadosClinicosPadrao: {
      laudo:
        'Taquicardia sinusal com ritmo regular. Frequência elevada para idade. Sem alterações estruturais.',
      observacoesClinicas: [
        'Frequência cardíaca: 150 bpm',
        'Intervalo PR normal',
        'QRS normal e estreito',
        'Investigar causa: febre, dor, desidratação',
      ],
      pontosEnsino: [
        'Resposta apropriada a demandas (febre, exercício)',
        'P claramente visível (diferente de TSV)',
        'Intervalo PR constante',
        'Frequência normaliza com repouso',
      ],
    },
  },

  // ========================================================================
  // BRADICARDIA SINUSAL
  // ========================================================================

  bradicardia_sinusal: {
    id: 'bradicardia_sinusal',
    titulo: 'Bradicardia Sinusal',
    descricao: 'Frequência reduzida, comum em atletas',
    grupoIdade: 'crianca',
    parametrosECGSyn: {
      frequenciaCardiaca: 60,
      numeroIntervalos: 6,
      frequenciaAmostragem: 250,
      variacaoRR: 0.08,
      razaoLFHF: 0.5,
      amplitude: {
        P: 0.12,
        Q: 0.02,
        R: 0.75,
        S: 0.25,
        T: 0.30,
      },
      duracao: 5,
      ruido: 0,
      agrupoIdade: 'crianca',
    },
    dadosClinicosPadrao: {
      laudo:
        'Bradicardia sinusal com ritmo regular. Compatível com atleta ou resposta vagal.',
      observacoesClinicas: [
        'Frequência cardíaca: 60 bpm (baixa para idade)',
        'Ritmo sinusal regular',
        'Sem bloqueios AV',
      ],
      pontosEnsino: [
        'Comum em atletas infantis',
        'Resposta parassimpática normal',
        'PR pode estar discretamente prolongado',
        'Ritmo permanece sinusal',
      ],
    },
  },

  // ========================================================================
  // ARRITMIA SINUSAL RESPIRATÓRIA
  // ========================================================================

  arritmia_sinusal_respiratoria: {
    id: 'arritmia_sinusal_respiratoria',
    titulo: 'Arritmia Sinusal Respiratória',
    descricao: 'Variação fisiológica com respiração',
    grupoIdade: 'crianca',
    parametrosECGSyn: {
      frequenciaCardiaca: 100,
      numeroIntervalos: 10,
      frequenciaAmostragem: 250,
      variacaoRR: 0.15,
      razaoLFHF: 0.3,
      amplitude: {
        P: 0.12,
        Q: 0.02,
        R: 0.78,
        S: 0.28,
        T: 0.32,
      },
      duracao: 5,
      ruido: 0,
      agrupoIdade: 'crianca',
    },
    dadosClinicosPadrao: {
      laudo:
        'Arritmia sinusal respiratória. Variação cíclica com respiração. Ritmo fundamentalmente sinusal.',
      observacoesClinicas: [
        'FC varia ritmicamente com respiração',
        'Aumenta com inspiração, diminui com expiração',
        'Intervalo RR varia de forma periódica',
        'Achado fisiológico normal em crianças',
      ],
      pontosEnsino: [
        'NORMAL em crianças',
        'Sinal de saúde cardiovascular',
        'Causada por variação do retorno venoso',
        'Desaparece com apneia',
      ],
    },
  },

  // ========================================================================
  // ECG COM ARTEFATO LEVE
  // ========================================================================

  ecg_com_artefato_leve: {
    id: 'ecg_com_artefato_leve',
    titulo: 'ECG com Artefato Leve',
    descricao: 'ECG normal com artefato de movimento',
    grupoIdade: 'lactente',
    parametrosECGSyn: {
      frequenciaCardiaca: 115,
      numeroIntervalos: 12,
      frequenciaAmostragem: 250,
      variacaoRR: 0.025,
      razaoLFHF: 1.0,
      amplitude: {
        P: 0.12,
        Q: 0.02,
        R: 0.75,
        S: 0.28,
        T: 0.33,
      },
      duracao: 5,
      ruido: 0.3, // Ruído aumentado
      agrupoIdade: 'lactente',
    },
    dadosClinicosPadrao: {
      laudo:
        'ECG com artefato de movimento. Traçado de base normal. Qualidade técnica adequada.',
      observacoesClinicas: [
        'Artefato presente (oscilações de linha de base)',
        'Não interfere com análise de ritmo',
        'Causado por movimento ou eletrodo solto',
      ],
      pontosEnsino: [
        'Artefatos são comuns em ECGs pediátricos',
        'Importante diferenciar de alteração patológica',
        'Artefato tem frequência muito baixa (<1 Hz)',
        'Minimizar com melhor posicionamento',
      ],
    },
  },
}

/**
 * Obter preset por ID
 */
export function obterPresetECG(presetId: string): PresetECG | undefined {
  return PRESETS_ECG[presetId]
}

/**
 * Listar IDs de todos os presets disponíveis
 */
export function listarPresetsDisponiveis(): string[] {
  return Object.keys(PRESETS_ECG)
}

/**
 * Obter lista de presets por grupo de idade
 */
export function listarPresetsPorIdade(
  idade: 'neonato' | 'lactente' | 'crianca' | 'adolescente' | 'adulto'
): PresetECG[] {
  return Object.values(PRESETS_ECG).filter(
    (preset) => preset.grupoIdade === idade
  )
}
