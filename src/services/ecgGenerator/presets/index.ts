/**
 * Biblioteca Central de Presets ECG Didáticos
 *
 * Exporte único de todos os presets educacionais organizados por categoria.
 * Funções utilitárias para seleção, busca e compatibilidade com IDs antigos.
 *
 * IMPORTANTE:
 * - Estes são presets educacionais para fins de OSCE e ensino
 * - Não são modelos clinicamente validados
 * - Referências científicas: ECGSYN/PhysioNet (inspiração histórica)
 */

import type { ECGPreset, ECGPresetCategory, AgeGroup } from '../types'
import { normalPresets } from './normalPresets'
import { rhythmPresets } from './rhythmPresets'
import { artefactPresets } from './artefactPresets'
import { conductionPresets } from './conductionPresets'
import { arrhythmiaPresets } from './arrhythmiaPresets'
import { ischemiaPresets } from './ischemiaPresets'

/**
 * EXPORT ÚNICO: Todos os presets da Etapa 1 + Etapa 2 + Etapa 3
 *
 * ETAPA 1 (13 presets):
 * - 6 normais por idade
 * - 4 ritmos
 * - 3 artefatos
 *
 * ETAPA 2 (13 presets):
 * - 7 distúrbios de condução (BAV, bloqueios de ramo)
 * - 6 arritmias (extrassístoles, taquiarritmias)
 *
 * ETAPA 3 (1 preset):
 * - 1 isquemia/infarto (IAM anterosseptal com supra de ST)
 *
 * Total: 27 presets educacionais
 */
export const ALL_ECG_PRESETS: Record<string, ECGPreset> = {
  // Etapa 1
  ...normalPresets,
  ...rhythmPresets,
  ...artefactPresets,
  // Etapa 2
  ...conductionPresets,
  ...arrhythmiaPresets,
  // Etapa 3
  ...ischemiaPresets,
}

/**
 * Mapeamento de IDs antigos para novos IDs de presets
 * Garante compatibilidade com código existente
 */
const LEGACY_ID_MAP: Record<string, string> = {
  ecg_pediatrico_normal: 'normal_lactente',
  taquicardia_sinusal: 'taquicardia_sinusal_pediatrica',
  taquicardia_sinusal_pediatrica: 'taquicardia_sinusal_pediatrica',
  bradicardia_sinusal: 'bradicardia_sinusal',
  arritmia_sinusal_respiratoria: 'arritmia_sinusal_respiratoria_pediatrica',
  arritmia_sinusal_respiratoria_pediatrica: 'arritmia_sinusal_respiratoria_pediatrica',
  ecg_com_artefato_leve: 'artefato_movimento_leve',
  normal_lactente: 'normal_lactente', // Já é novo ID
  normal_adulto: 'normal_adulto',
}

/**
 * Normaliza IDs antigos para novos IDs de presets
 * Se ID antigo for encontrado, converte; senão retorna original
 *
 * @param id - ID do preset (antigo ou novo)
 * @returns ID novo
 */
export function normalizePresetId(id: string): string {
  return LEGACY_ID_MAP[id] || id
}

/**
 * Obtém preset por ID (com normalização de IDs antigos)
 *
 * @param id - ID do preset (antigo ou novo)
 * @returns Preset ou undefined se não encontrado
 */
export function getPresetById(id: string): ECGPreset | undefined {
  const normalizedId = normalizePresetId(id)
  return ALL_ECG_PRESETS[normalizedId]
}

/**
 * Lista todos os presets de uma categoria
 *
 * @param category - Categoria (normal, ritmo, isquemia, etc)
 * @returns Array de presets da categoria
 */
export function getPresetsByCategory(category: ECGPresetCategory): ECGPreset[] {
  return Object.values(ALL_ECG_PRESETS).filter((p) => p.category === category)
}

/**
 * Lista todos os presets de um grupo etário
 *
 * @param ageGroup - Grupo etário (neonato, lactente, etc)
 * @returns Array de presets do grupo
 */
export function getPresetsByAgeGroup(ageGroup: AgeGroup): ECGPreset[] {
  return Object.values(ALL_ECG_PRESETS).filter((p) => p.ageGroup === ageGroup)
}

/**
 * Retorna opções formatadas para select/dropdown do simulador
 * Agrupa por categoria para melhor UX
 *
 * @returns Array de grupos de opções
 */
export function getPresetOptionsForSelect(): Array<{
  label: string
  options: Array<{ value: string; label: string }>
}> {
  const categories: ECGPresetCategory[] = ['normal', 'ritmo', 'isquemia', 'conducao', 'sobrecarga', 'eletrolitos', 'artefato']

  const categoryLabels: Record<ECGPresetCategory, string> = {
    normal: 'Normais por Idade',
    ritmo: 'Ritmos',
    isquemia: 'Isquemia / Infarto',
    conducao: 'Distúrbios de Condução',
    sobrecarga: 'Sobrecargas / Hipertrofias',
    eletrolitos: 'Alterações Eletrolíticas',
    artefato: 'Artefatos e Problemas Técnicos',
  }

  return categories
    .map((category) => {
      const presets = getPresetsByCategory(category)
      if (presets.length === 0) return null

      return {
        label: categoryLabels[category],
        options: presets.map((p) => ({
          value: p.id,
          label: p.label,
        })),
      }
    })
    .filter((g): g is NonNullable<typeof g> => g !== null)
}

/**
 * Retorna lista simples (sem agrupamento) para compatibilidade
 * Ordenada por categoria e nome
 *
 * @returns Array de opções simples
 */
export function getPresetOptionsFlat(): Array<{
  value: string
  label: string
  category: ECGPresetCategory
}> {
  return Object.values(ALL_ECG_PRESETS)
    .sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category)
      return a.label.localeCompare(b.label)
    })
    .map((p) => ({
      value: p.id,
      label: p.label,
      category: p.category,
    }))
}

/**
 * Valida se um preset ID existe (após normalização)
 *
 * @param id - ID do preset
 * @returns true se preset existe
 */
export function isValidPresetId(id: string): boolean {
  const normalized = normalizePresetId(id)
  return normalized in ALL_ECG_PRESETS
}

/**
 * Retorna estatísticas dos presets
 *
 * @returns Objeto com contagens por categoria
 */
export function getPresetsStatistics(): Record<ECGPresetCategory, number> {
  const stats: Partial<Record<ECGPresetCategory, number>> = {}

  Object.values(ALL_ECG_PRESETS).forEach((p) => {
    stats[p.category] = (stats[p.category] || 0) + 1
  })

  return stats as Record<ECGPresetCategory, number>
}

// ============================================================================
// EXPORTS PARA COMPATIBILIDADE COM CÓDIGO ANTIGO
// ============================================================================

/**
 * Export que converte novos presets para formato antigo (PresetECG)
 * Mantém compatibilidade com código existente que depende de PRESETS_ECG
 */
export const PRESETS_ECG_LEGACY = Object.values(ALL_ECG_PRESETS).reduce(
  (acc, preset) => {
    acc[preset.id] = {
      id: preset.id,
      titulo: preset.label,
      descricao: preset.description,
      grupoIdade: preset.ageGroup,
      parametrosECGSyn: {
        frequenciaCardiaca: preset.heartRate,
        numeroIntervalos: 12,
        frequenciaAmostragem: 250,
        variacaoRR: preset.rrVariability,
        razaoLFHF: 1.0,
        amplitude: {
          P: preset.morphology.pAmplitude,
          Q: preset.morphology.qAmplitude,
          R: preset.morphology.rAmplitude,
          S: preset.morphology.sAmplitude,
          T: preset.morphology.tAmplitude,
        },
        duracao: 5,
        ruido: 0,
        agrupoIdade: preset.ageGroup,
      },
      dadosClinicosPadrao: {
        laudo: preset.expectedInterpretation[0] || '',
        observacoesClinicas: preset.expectedInterpretation,
        pontosEnsino: preset.teachingPoints,
      },
    }
    return acc
  },
  {} as Record<string, any>
)

// ============================================================================
// EXPORTS DOS MÓDULOS DE PRESETS (ETAPA 2)
// ============================================================================

export { conductionPresets } from './conductionPresets'
export { arrhythmiaPresets } from './arrhythmiaPresets'

export default ALL_ECG_PRESETS
