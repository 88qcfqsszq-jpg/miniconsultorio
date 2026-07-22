import { GOLD_ASTHMA_CALIBRATION_SEVERITIES } from './actions'
import { GOLD_ASTHMA_NARRATIVE, GOLD_ASTHMA_PATIENT } from './patient'
import type { GoldAsthmaCaseConfig } from './types'

export const GOLD_ASTHMA_CONFIG: GoldAsthmaCaseConfig = {
  id: 'gold-asthma-severe-adult',
  title: 'Crise Asmática Aguda Grave',
  provider: 'pulse',
  validationLevel: 'gold',
  population: 'adult',
  // Selected after the real 0.30/0.55/0.75/0.85/0.90 calibration on 2026-07-19.
  selectedAsthmaSeverity: 0.75,
  calibrationSeverities: GOLD_ASTHMA_CALIBRATION_SEVERITIES,
  patient: GOLD_ASTHMA_PATIENT,
  narrative: GOLD_ASTHMA_NARRATIVE,
}
