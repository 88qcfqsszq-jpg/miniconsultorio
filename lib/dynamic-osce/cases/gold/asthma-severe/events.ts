import type { PulseEvent, PulseEventsResult } from '../../../pulse-runtime'

const HIGH_RISK_PULSE_EVENTS = new Set([
  'BrainOxygenDeficit',
  'CardiacArrest',
  'CardiovascularCollapse',
  'CriticalBrainOxygenDeficit',
  'Hypercapnia',
  'Hypoxia',
  'IrreversibleState',
  'MaximumPulmonaryVentilationRate',
  'RespiratoryAcidosis',
])

export function activePulseEventNames(events: PulseEventsResult): Set<string> {
  return new Set(events.activeEvents.map((event) => event.pulseName))
}

export function hasHighRiskPulseEvent(events: PulseEventsResult): boolean {
  return events.activeEvents.some((event) => HIGH_RISK_PULSE_EVENTS.has(event.pulseName))
}

export function newPulseEventChanges(
  events: PulseEventsResult,
  seenIds: ReadonlySet<string>,
): PulseEvent[] {
  return events.changes.filter((event) => !seenIds.has(event.id))
}
