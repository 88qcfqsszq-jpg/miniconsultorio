/**
 * Fonte Única de Verdade para Imagem do Paciente
 *
 * Garante que Exame Físico e Simulador ECG usam exatamente a mesma imagem
 *
 * Reutiliza a função existente do módulo pediatria
 */

import { obterImagemPacientePediatrico } from '@/lib/pediatria/imagens'
import type { Caso } from '../types'

export interface PatientImageProfile {
  imageSrc: string
  ageGroup?: string
  source: 'pediatrico' | 'fallback'
}

/**
 * Obtém a imagem exata do paciente que deve ser usada em TODOS os contextos:
 * - Exame Físico Interativo
 * - Simulador ECG
 *
 * Implementação:
 * 1. Para pediátricos: usa obterImagemPacientePediatrico() (fonte real do exame físico)
 * 2. Para adultos: fallback genérico
 *
 * @param caso - Caso clínico (pode ser undefined para simulador isolado)
 * @returns Perfil com imageSrc exato e source para debug
 */
export function getPatientImage(caso?: Caso | null): PatientImageProfile {
  // Não há caso - simulador isolado
  if (!caso) {
    return {
      imageSrc: '/images/boneco/boneco-frente.png',
      ageGroup: 'adulto',
      source: 'fallback',
    }
  }

  // Pediátrico: usar exatamente a mesma função que o exame físico usa
  if (caso.tipoPaciente === 'pediatrico') {
    const faixaEtaria = caso.paciente?.dadosPediatricos?.faixaEtaria
    const imagemPediatrica = obterImagemPacientePediatrico(faixaEtaria)

    // obterImagemPacientePediatrico() retorna crianca-frente.png (menino) para
    // pré-escolar/escolar/adolescente independente do sexo. Para paciente
    // feminino, usar a imagem feminina equivalente já existente no projeto.
    const sexoPediatrico = (
      (caso as any)?.sexo ||
      (caso as any)?.dados_visiveis_ao_estudante?.sexo ||
      caso.paciente?.sexo ||
      ''
    )
      .toString()
      .trim()
      .toLowerCase()

    if (imagemPediatrica === '/images/pediatria/crianca-frente.png' && sexoPediatrico.startsWith('f')) {
      return {
        imageSrc: '/images/pediatria/corpo/escolar-frontal.png',
        ageGroup: faixaEtaria,
        source: 'pediatrico',
      }
    }

    return {
      imageSrc: imagemPediatrica,
      ageGroup: faixaEtaria,
      source: 'pediatrico',
    }
  }

  // Adulto: imagem específica por sexo (feminino usa a paciente realista)
  const sexo = (
    (caso as any)?.sexo ||
    (caso as any)?.dados_visiveis_ao_estudante?.sexo ||
    caso.paciente?.sexo ||
    ''
  )
    .toString()
    .toLowerCase()

  if (sexo.startsWith('f')) {
    return {
      imageSrc: '/images/boneco/feminino-frontal-realista.png',
      ageGroup: 'adulto',
      source: 'fallback',
    }
  }

  return {
    imageSrc: '/images/boneco/boneco-frente.png',
    ageGroup: 'adulto',
    source: 'fallback',
  }
}

/**
 * Obtém o perfil de zonas de eletrodos baseado na imagem e faixa etária
 *
 * Coordena zonas relativas (%) para a imagem específica do paciente
 *
 * @param caso - Caso clínico
 * @returns Nome do perfil para getElectrodeZones()
 */
export function getElectrodeProfileForCase(caso?: Caso | null): string {
  if (!caso) {
    return 'adulto_frontal'
  }

  if (caso.tipoPaciente === 'pediatrico') {
    const faixa = caso.paciente?.dadosPediatricos?.faixaEtaria?.toLowerCase()

    // Neonato e lactente usam a mesma imagem: lactente-frente-crop.png
    if (faixa === 'neonato' || faixa === 'lactente') {
      return 'lactente_frontal'
    }

    // Pré-escolar, escolar, adolescente usam: crianca-frente.png
    if (faixa === 'pre_escolar' || faixa === 'escolar' || faixa === 'adolescente') {
      return 'crianca_frontal'
    }
  }

  // Fallback adulto
  return 'adulto_frontal'
}
