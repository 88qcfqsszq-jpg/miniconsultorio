import type {
  ApplyActionPayload,
  PulseEvent,
  PulseEventsResult,
  PulseSnapshot,
} from '../../../pulse-runtime/pulse-runtime-types'

export type GoldAsthmaEvidenceSource = 'pulse' | 'medix-derived' | 'case-fixed'
export type GoldAsthmaSeverity = 'mild' | 'moderate' | 'severe' | 'life-threatening'

export interface GoldAsthmaEvidence {
  id: string
  source: GoldAsthmaEvidenceSource
  path: string
  value: string | number | boolean
  rationale: string
}

export interface GoldAsthmaNarrative {
  priorDiagnosis: string
  usualTreatment: string
  adherence: string
  previousAdmissions: string
  priorIcu: string
  priorIntubation: string
  allergies: string
  smoking: string
  likelyTrigger: string
  crisisDuration: string
  attemptedMeasures: string
  associatedSymptoms: string
  socialContext: string
}

export interface GoldAsthmaCaseConfig {
  id: 'gold-asthma-severe-adult'
  title: 'Crise Asmática Aguda Grave'
  provider: 'pulse'
  validationLevel: 'gold'
  population: 'adult'
  selectedAsthmaSeverity: number | null
  calibrationSeverities: readonly number[]
  patient: {
    name: string
    sex: 'male'
    ageYears: 44
    weightKg: 77
    heightCm: 177
  }
  narrative: GoldAsthmaNarrative
}

export type GoldAsthmaActionStatus = 'applied' | 'cancelled'

export interface GoldAsthmaActionRecord {
  id: string
  action: ApplyActionPayload['action']
  status: GoldAsthmaActionStatus
  simulationTimeSeconds: number
  details: Record<string, unknown>
  recordedAt: string
}

export interface GoldAsthmaPresentation {
  simulationTimeSeconds: number
  severity: GoldAsthmaSeverity
  score: number
  appearance: string
  speech: string
  respiratoryEffort: string
  cyanosis: string
  perfusion: string
  warnings: string[]
  evidence: GoldAsthmaEvidence[]
}

export type GoldAsthmaExamSectionName =
  | 'general'
  | 'respiratory'
  | 'cardiovascular'
  | 'neurologic'
  | 'perfusion'

export interface GoldAsthmaPhysicalFinding {
  id: string
  label: string
  description: string
  source: GoldAsthmaEvidenceSource
  evidence: GoldAsthmaEvidence[]
}

export interface GoldAsthmaPhysicalExam {
  caseId: GoldAsthmaCaseConfig['id']
  sessionId: string
  simulationTimeSeconds: number
  requestedAt: string
  sections: Record<GoldAsthmaExamSectionName, GoldAsthmaPhysicalFinding[]>
}

export type GoldAsthmaTimelineType =
  | 'session-created'
  | 'baseline'
  | 'condition-rejected'
  | 'action-applied'
  | 'action-cancelled'
  | 'time-advanced'
  | 'snapshot'
  | 'event-started'
  | 'event-ended'
  | 'presentation-changed'
  | 'physical-exam-requested'
  | 'session-terminated'
  | 'error'

export interface GoldAsthmaTimelineEntry {
  id: string
  sessionId: string
  simulationTimeSeconds: number
  type: GoldAsthmaTimelineType
  source: GoldAsthmaEvidenceSource
  title: string
  data: Record<string, unknown>
  recordedAt: string
}

export interface GoldAsthmaInterpretationInput {
  snapshot: PulseSnapshot
  snapshotHistory: readonly PulseSnapshot[]
  events: PulseEventsResult
  actions: readonly GoldAsthmaActionRecord[]
  config: GoldAsthmaCaseConfig
}

export interface GoldAsthmaTechnicalState {
  caseId: GoldAsthmaCaseConfig['id']
  sessionId: string
  snapshot: PulseSnapshot
  events: PulseEventsResult
  presentation: GoldAsthmaPresentation
  timeline: GoldAsthmaTimelineEntry[]
}

export interface GoldAsthmaScenarioResult {
  scenario: string
  severity: number
  snapshots: PulseSnapshot[]
  events: PulseEvent[]
  activeEvents: PulseEvent[]
  actions: GoldAsthmaActionRecord[]
  finalPresentation: GoldAsthmaPresentation
  finalExam: GoldAsthmaPhysicalExam
  timeline: GoldAsthmaTimelineEntry[]
}
