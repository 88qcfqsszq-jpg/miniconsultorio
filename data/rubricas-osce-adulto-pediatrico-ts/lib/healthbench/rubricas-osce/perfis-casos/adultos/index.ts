import { caso1Perfil } from './caso-1'
import { caso4Perfil } from './caso-4'
import { caso5Perfil } from './caso-5'
import { caso7Perfil } from './caso-7'
import { caso8Perfil } from './caso-8'
import { caso13Perfil } from './caso-13'
import { caso14Perfil } from './caso-14'
import { caso15Perfil } from './caso-15'
import { caso18Perfil } from './caso-18'
import { caso19Perfil } from './caso-19'
import { caso20Perfil } from './caso-20'
import { caso21Perfil } from './caso-21'
import { caso22Perfil } from './caso-22'
import { caso23Perfil } from './caso-23'
import { caso24Perfil } from './caso-24'
import { caso25Perfil } from './caso-25'
import { caso26Perfil } from './caso-26'
import { caso27Perfil } from './caso-27'
import { caso58Perfil } from './caso-58'
import { caso61Perfil } from './caso-61'
import { caso2Perfil } from './caso-2'
import { caso3Perfil } from './caso-3'
import { caso6Perfil } from './caso-6'
import { caso9Perfil } from './caso-9'
import { caso10Perfil } from './caso-10'
import { caso11Perfil } from './caso-11'
import { caso16Perfil } from './caso-16'
import { caso31Perfil } from './caso-31'
import { caso32Perfil } from './caso-32'
import { caso33Perfil } from './caso-33'
import { caso34Perfil } from './caso-34'
import { caso62Perfil } from './caso-62'
import { caso63Perfil } from './caso-63'
import { caso12Perfil } from './caso-12'
import { caso38Perfil } from './caso-38'
import { caso39Perfil } from './caso-39'
import { caso40Perfil } from './caso-40'
import { caso41Perfil } from './caso-41'
import { caso42Perfil } from './caso-42'
import { caso57Perfil } from './caso-57'
import { caso59Perfil } from './caso-59'
import { caso17Perfil } from './caso-17'
import { caso43Perfil } from './caso-43'
import { caso44Perfil } from './caso-44'
import { caso45Perfil } from './caso-45'
import { caso46Perfil } from './caso-46'
import { caso47Perfil } from './caso-47'
import { caso48Perfil } from './caso-48'
import { caso49Perfil } from './caso-49'
import { caso50Perfil } from './caso-50'
import { caso51Perfil } from './caso-51'
import { caso52Perfil } from './caso-52'
import { caso53Perfil } from './caso-53'
import { caso28Perfil } from './caso-28'
import { caso29Perfil } from './caso-29'
import { caso30Perfil } from './caso-30'
import { caso54Perfil } from './caso-54'
import { caso60Perfil } from './caso-60'
import { caso55Perfil } from './caso-55'
import { caso56Perfil } from './caso-56'

import type { PerfilRubricaCaso } from '../../types'

export const PERFIS_RUBRICA_ADULTOS: PerfilRubricaCaso[] = [
  caso1Perfil,
  caso4Perfil,
  caso5Perfil,
  caso7Perfil,
  caso8Perfil,
  caso13Perfil,
  caso14Perfil,
  caso15Perfil,
  caso18Perfil,
  caso19Perfil,
  caso20Perfil,
  caso21Perfil,
  caso22Perfil,
  caso23Perfil,
  caso24Perfil,
  caso25Perfil,
  caso26Perfil,
  caso27Perfil,
  caso58Perfil,
  caso61Perfil,
  caso2Perfil,
  caso3Perfil,
  caso6Perfil,
  caso9Perfil,
  caso10Perfil,
  caso11Perfil,
  caso16Perfil,
  caso31Perfil,
  caso32Perfil,
  caso33Perfil,
  caso34Perfil,
  caso62Perfil,
  caso63Perfil,
  caso12Perfil,
  caso38Perfil,
  caso39Perfil,
  caso40Perfil,
  caso41Perfil,
  caso42Perfil,
  caso57Perfil,
  caso59Perfil,
  caso17Perfil,
  caso43Perfil,
  caso44Perfil,
  caso45Perfil,
  caso46Perfil,
  caso47Perfil,
  caso48Perfil,
  caso49Perfil,
  caso50Perfil,
  caso51Perfil,
  caso52Perfil,
  caso53Perfil,
  caso28Perfil,
  caso29Perfil,
  caso30Perfil,
  caso54Perfil,
  caso60Perfil,
  caso55Perfil,
  caso56Perfil
]

export const PERFIS_RUBRICA_ADULTOS_BY_ID = Object.fromEntries(
  PERFIS_RUBRICA_ADULTOS.map((perfil) => [perfil.caseId, perfil])
) as Record<string, PerfilRubricaCaso>
