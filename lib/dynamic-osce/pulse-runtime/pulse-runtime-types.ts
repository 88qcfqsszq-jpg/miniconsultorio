export interface PulsePatientProfile {
  name: string
  sex: 'male' | 'female'
  ageYears: number
  weightKg: number
  heightCm: number
}

export interface CreateSessionPayload {
  patient?: Partial<PulsePatientProfile>
}

export interface AdvanceTimePayload {
  seconds: number
}

export type PulseActionName =
  | 'asthma_attack'
  | 'supplemental_oxygen'
  | 'albuterol_inhaler'

export type PulseCancellableActionName =
  | 'asthma_attack'
  | 'supplemental_oxygen'

export type PulseOxygenDevice =
  | 'nasal_cannula'
  | 'simple_mask'
  | 'non_rebreather_mask'

export interface PulseMeasurement<Unit extends string> {
  value: number
  unit: Unit
}

export interface ApplyConditionPayload {
  condition: string
  parameters?: Record<string, unknown>
}

export interface ApplyAsthmaAttackPayload {
  action: 'asthma_attack'
  severity: number
}

export interface ApplySupplementalOxygenPayload {
  action: 'supplemental_oxygen'
  device: PulseOxygenDevice
  flow: PulseMeasurement<'L/min'>
  volume: PulseMeasurement<'L'>
}

export interface ApplyAlbuterolInhalerPayload {
  action: 'albuterol_inhaler'
  dose: PulseMeasurement<'ug'>
  actuations: number
  nozzleLossFraction?: number
  spacerVolume: PulseMeasurement<'mL'>
}

export type ApplyActionPayload =
  | ApplyAsthmaAttackPayload
  | ApplySupplementalOxygenPayload
  | ApplyAlbuterolInhalerPayload

export interface CancelActionPayload {
  action: PulseCancellableActionName
}

export interface PulseSnapshot {
  sessionId: string
  simulationTimeSeconds: number
  vitals: {
    heartRate?: number
    systolicPressure?: number
    diastolicPressure?: number
    meanArterialPressure?: number
    respiratoryRate?: number
    spo2?: number
    temperatureC?: number
  }
  respiratory: {
    tidalVolumeMl?: number
    minuteVentilationLMin?: number
    airwayResistance?: number
    pao2MmHg?: number
    paco2MmHg?: number
    pH?: number
  }
  unavailableFields: string[]
  warnings: string[]
}

export type PulseEventSource = 'pulse'
export type PulseEventSeverity =
  | 'informational'
  | 'moderate'
  | 'high'
  | 'critical'

export interface PulseEvent {
  id: string
  pulseName: string
  active: boolean
  simulationTimeSeconds: number
  durationSeconds?: number
  category: string
  severity: PulseEventSeverity
  source: PulseEventSource
  recordedAt: string
}

export interface PulseEventsResult {
  sessionId: string
  simulationTimeSeconds: number
  changes: PulseEvent[]
  activeEvents: PulseEvent[]
  ignoredHighFrequencyEventCount: number
}

export interface PulseActionApplicationResult {
  action: PulseActionName
  applied: true
  persistent: boolean
  simulationTimeSeconds: number
  details: Record<string, unknown>
}

export interface PulseActionCancellationResult {
  action: PulseCancellableActionName
  cancelled: true
  simulationTimeSeconds: number
  details: Record<string, unknown>
}

export interface PulseRuntimePing {
  status: 'ready'
  processId: number
  importAvailable: boolean
}

export interface PulseEngineInfo {
  version: string | null
  buildHash: string | null
  pythonPath: string
  pulseRoot: string
  importAvailable: boolean
  importError: string | null
  supportedProtocolVersions: string[]
  activeSessionCount: number
}

export interface CreateSessionResult {
  sessionId: string
  patient: PulsePatientProfile
  snapshot: PulseSnapshot
}

export interface TerminateSessionResult {
  terminated: true
}

export interface ShutdownResult {
  shuttingDown: true
}

export interface PulseRuntimeOperationPayloads {
  PING: undefined
  GET_ENGINE_INFO: undefined
  CREATE_SESSION: CreateSessionPayload | undefined
  APPLY_CONDITION: ApplyConditionPayload
  APPLY_ACTION: ApplyActionPayload
  CANCEL_ACTION: CancelActionPayload
  ADVANCE_TIME: AdvanceTimePayload
  GET_SNAPSHOT: undefined
  GET_EVENTS: undefined
  TERMINATE_SESSION: undefined
  SHUTDOWN: undefined
}

export interface PulseRuntimeOperationResults {
  PING: PulseRuntimePing
  GET_ENGINE_INFO: PulseEngineInfo
  CREATE_SESSION: CreateSessionResult
  APPLY_CONDITION: never
  APPLY_ACTION: PulseActionApplicationResult
  CANCEL_ACTION: PulseActionCancellationResult
  ADVANCE_TIME: PulseSnapshot
  GET_SNAPSHOT: PulseSnapshot
  GET_EVENTS: PulseEventsResult
  TERMINATE_SESSION: TerminateSessionResult
  SHUTDOWN: ShutdownResult
}
