/**
 * Mapeamento de Visual de Paciente para ECG
 *
 * Define qual imagem usar no simulador de ECG baseado no caso clínico
 * Garante consistência com o exame físico interativo
 */

import type { Caso } from '../types'

export interface PatientVisualProfile {
  imageSrc: string  // Path para a imagem
  label: string  // Descrição
  ageGroup: string
  electrodeProfile: string  // Perfil de zonas de eletrodos
}

/**
 * Perfis visuais de paciente por faixa etária
 */
export const PATIENT_VISUAL_PROFILES: Record<string, PatientVisualProfile> = {
  neonato: {
    imageSrc: '/images/boneco/paciente-ecg.png',
    label: 'Neonato',
    ageGroup: 'neonato',
    electrodeProfile: 'infantil_frontal',
  },

  lactente: {
    imageSrc: '/images/pediatria/lactente-frente.png',
    label: 'Lactente',
    ageGroup: 'lactente',
    electrodeProfile: 'lactente_frontal',
  },

  pre_escolar: {
    imageSrc: '/images/pediatria/lactente-frente.png',
    label: 'Pré-escolar',
    ageGroup: 'pre_escolar',
    electrodeProfile: 'infantil_frontal',
  },

  escolar: {
    imageSrc: '/images/pediatria/crianca-frente.png',
    label: 'Escolar',
    ageGroup: 'escolar',
    electrodeProfile: 'infantil_frontal',
  },

  adolescente: {
    imageSrc: '/images/boneco/boneco-frente.png',
    label: 'Adolescente',
    ageGroup: 'adolescente',
    electrodeProfile: 'adulto_frontal',
  },

  adulto: {
    imageSrc: '/images/boneco/boneco-frente.png',
    label: 'Adulto',
    ageGroup: 'adulto',
    electrodeProfile: 'adulto_frontal',
  },

  // Fallback
  default: {
    imageSrc: '/images/boneco/paciente-ecg.png',
    label: 'Paciente',
    ageGroup: 'adulto',
    electrodeProfile: 'adulto_frontal',
  },
}

/**
 * Obtém o perfil visual de paciente apropriado para o caso
 *
 * Prioridade:
 * 1. Se caso tem faixaEtaria definida (pediátrico)
 * 2. Se caso tem idade + tipo de paciente
 * 3. Fallback para adulto
 *
 * @param caso - Caso clínico ativo
 * @returns Perfil visual ou fallback
 */
export function getPatientVisualForCase(caso?: Caso | null): PatientVisualProfile {
  if (!caso) {
    return PATIENT_VISUAL_PROFILES.default
  }

  // 1. Tentar faixa etária pediátrica
  if (caso.paciente?.dadosPediatricos?.faixaEtaria) {
    const faixa = caso.paciente.dadosPediatricos.faixaEtaria.toLowerCase()

    if (faixa.includes('neonato')) return PATIENT_VISUAL_PROFILES.neonato
    if (faixa.includes('lactente')) return PATIENT_VISUAL_PROFILES.lactente
    if (faixa.includes('pre_escolar') || faixa.includes('pré')) return PATIENT_VISUAL_PROFILES.pre_escolar
    if (faixa.includes('escolar')) return PATIENT_VISUAL_PROFILES.escolar
    if (faixa.includes('adolescente')) return PATIENT_VISUAL_PROFILES.adolescente
  }

  // 2. Tentar por tipo de paciente + idade
  if (caso.tipoPaciente === 'pediatrico' && caso.paciente?.idade) {
    const idade = caso.paciente.idade

    if (idade < 0.5) return PATIENT_VISUAL_PROFILES.neonato
    if (idade < 1) return PATIENT_VISUAL_PROFILES.neonato
    if (idade < 3) return PATIENT_VISUAL_PROFILES.lactente
    if (idade < 6) return PATIENT_VISUAL_PROFILES.pre_escolar
    if (idade < 12) return PATIENT_VISUAL_PROFILES.escolar
    return PATIENT_VISUAL_PROFILES.adolescente
  }

  // 3. Fallback para adulto
  return PATIENT_VISUAL_PROFILES.adulto
}

/**
 * Obtém perfil de zonas de eletrodos baseado no tipo de paciente
 *
 * @param electrodeProfile - Nome do perfil (infantil_frontal, adulto_frontal, etc)
 * @returns Zonas de eletrodos para validação
 */
export function getElectrodeZonesForProfile(
  electrodeProfile: string
): Record<string, { xMin: number; xMax: number; yMin: number; yMax: number }> {
  // Zonas percentuais relativas à imagem

  if (electrodeProfile === 'adulto_frontal') {
    return {
      RA: { xMin: 5, xMax: 25, yMin: 5, yMax: 25 }, // Ombro direito
      LA: { xMin: 75, xMax: 95, yMin: 5, yMax: 25 }, // Ombro esquerdo
      RL: { xMin: 10, xMax: 30, yMin: 75, yMax: 95 }, // Coxa direita
      LL: { xMin: 70, xMax: 90, yMin: 75, yMax: 95 }, // Coxa esquerda
      V1: { xMin: 40, xMax: 50, yMin: 30, yMax: 40 }, // 4º EIC septo
      V2: { xMin: 50, xMax: 60, yMin: 30, yMax: 40 }, // 4º EIC esquerdo
      V3: { xMin: 45, xMax: 55, yMin: 35, yMax: 45 }, // Entre V2 e V4
      V4: { xMin: 45, xMax: 55, yMin: 45, yMax: 55 }, // 5º EIC hemiclavicular
      V5: { xMin: 55, xMax: 70, yMin: 45, yMax: 55 }, // Axilar anterior
      V6: { xMin: 65, xMax: 80, yMin: 50, yMax: 60 }, // Axilar média
    }
  }

  if (electrodeProfile === 'infantil_frontal' || electrodeProfile === 'lactente_frontal') {
    return {
      RA: { xMin: 10, xMax: 30, yMin: 10, yMax: 30 }, // Braço direito
      LA: { xMin: 70, xMax: 90, yMin: 10, yMax: 30 }, // Braço esquerdo
      RL: { xMin: 15, xMax: 35, yMin: 70, yMax: 90 }, // Perna direita
      LL: { xMin: 65, xMax: 85, yMin: 70, yMax: 90 }, // Perna esquerda
      V1: { xMin: 42, xMax: 48, yMin: 35, yMax: 42 }, // Septo
      V2: { xMin: 52, xMax: 58, yMin: 35, yMax: 42 }, // Esquerdo
      V3: { xMin: 47, xMax: 53, yMin: 40, yMax: 47 }, // Meio
      V4: { xMin: 47, xMax: 53, yMin: 48, yMax: 55 }, // Ápice
      V5: { xMin: 55, xMax: 65, yMin: 48, yMax: 55 }, // Lateral
      V6: { xMin: 65, xMax: 75, yMin: 50, yMax: 57 }, // Lateral média
    }
  }

  // Fallback para adulto
  return getElectrodeZonesForProfile('adulto_frontal')
}
