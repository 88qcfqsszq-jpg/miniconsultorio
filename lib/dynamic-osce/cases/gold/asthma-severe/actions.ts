import type {
  ApplyAlbuterolInhalerPayload,
  ApplyAsthmaAttackPayload,
  ApplySupplementalOxygenPayload,
} from '../../../pulse-runtime/pulse-runtime-types'

export const GOLD_ASTHMA_CALIBRATION_SEVERITIES = [0.3, 0.55, 0.75, 0.85, 0.9] as const

export function asthmaAttackAction(severity: number): ApplyAsthmaAttackPayload {
  return { action: 'asthma_attack', severity }
}

export const GOLD_ASTHMA_OXYGEN_ACTION: ApplySupplementalOxygenPayload = {
  action: 'supplemental_oxygen',
  device: 'nasal_cannula',
  flow: { value: 1, unit: 'L/min' },
  volume: { value: 1000, unit: 'L' },
}

export const GOLD_ASTHMA_ALBUTEROL_ACTION: ApplyAlbuterolInhalerPayload = {
  action: 'albuterol_inhaler',
  dose: { value: 90, unit: 'ug' },
  actuations: 1,
  nozzleLossFraction: 0.04,
  spacerVolume: { value: 500, unit: 'mL' },
}
