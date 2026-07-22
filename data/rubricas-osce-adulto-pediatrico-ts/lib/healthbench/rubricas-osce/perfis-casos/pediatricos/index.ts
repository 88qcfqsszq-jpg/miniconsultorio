import { ped01Perfil } from './ped-01'
import { ped10Perfil } from './ped-10'
import { ped14Perfil } from './ped-14'
import { ped16Perfil } from './ped-16'
import { ped02Perfil } from './ped-02'
import { ped03Perfil } from './ped-03'
import { ped05Perfil } from './ped-05'
import { ped07Perfil } from './ped-07'
import { ped08Perfil } from './ped-08'
import { ped09Perfil } from './ped-09'
import { ped04Perfil } from './ped-04'
import { ped06Perfil } from './ped-06'
import { ped11Perfil } from './ped-11'
import { ped12Perfil } from './ped-12'
import { ped13Perfil } from './ped-13'
import { ped15Perfil } from './ped-15'
import { caso64Perfil } from './caso-64'

import type { PerfilRubricaCaso } from '../../types'

export const PERFIS_RUBRICA_PEDIATRICOS: PerfilRubricaCaso[] = [
  ped01Perfil,
  ped10Perfil,
  ped14Perfil,
  ped16Perfil,
  ped02Perfil,
  ped03Perfil,
  ped05Perfil,
  ped07Perfil,
  ped08Perfil,
  ped09Perfil,
  ped04Perfil,
  ped06Perfil,
  ped11Perfil,
  ped12Perfil,
  ped13Perfil,
  ped15Perfil,
  caso64Perfil
]

export const PERFIS_RUBRICA_PEDIATRICOS_BY_ID = Object.fromEntries(
  PERFIS_RUBRICA_PEDIATRICOS.map((perfil) => [perfil.caseId, perfil])
) as Record<string, PerfilRubricaCaso>
