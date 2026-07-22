/**
 * Clinical pathology mapping. Pulse represents the acute crisis as a patient
 * action, not as an initialization condition.
 */
export const GOLD_ASTHMA_PATHOLOGY = {
  clinicalName: 'Crise asmática aguda grave',
  pulseRepresentation: {
    kind: 'patient-action',
    action: 'asthma_attack',
    scalar: 'SEScalar0To1',
    unit: null,
  },
} as const
