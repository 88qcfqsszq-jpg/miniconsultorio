import type { RubricaOSCE, RubricaResolvidaOSCE, TipoPacienteOSCE } from './types'
import { RUBRICA_ADULTO_GENERICA } from './rubrica-adulto-generica'
import { RUBRICA_PEDIATRICA_GENERICA } from './rubrica-pediatrica-generica'
import { PERFIS_RUBRICA_ADULTOS_BY_ID } from './perfis-casos/adultos'
import { PERFIS_RUBRICA_PEDIATRICOS_BY_ID } from './perfis-casos/pediatricos'

export function inferirTipoPacienteOSCE(params: { caseId?: string | number; tipo?: string | null }): TipoPacienteOSCE {
  const tipoNormalizado = String(params.tipo || '').toLowerCase()
  const caseId = String(params.caseId || '')

  if (tipoNormalizado.includes('pedi')) return 'pediatrico'
  if (caseId.startsWith('ped-')) return 'pediatrico'
  if (PERFIS_RUBRICA_PEDIATRICOS_BY_ID[caseId]) return 'pediatrico'
  return 'adulto'
}

export function obterRubricaBaseOSCE(tipo: TipoPacienteOSCE): RubricaOSCE {
  return tipo === 'pediatrico' ? RUBRICA_PEDIATRICA_GENERICA : RUBRICA_ADULTO_GENERICA
}

export function resolverRubricaOSCE(params: { caseId?: string | number; tipo?: string | null }): RubricaResolvidaOSCE {
  const caseId = String(params.caseId || '')
  const tipo = inferirTipoPacienteOSCE(params)
  const rubrica = obterRubricaBaseOSCE(tipo)
  const perfilCaso = tipo === 'pediatrico'
    ? PERFIS_RUBRICA_PEDIATRICOS_BY_ID[caseId]
    : PERFIS_RUBRICA_ADULTOS_BY_ID[caseId]

  return { rubrica, perfilCaso }
}
