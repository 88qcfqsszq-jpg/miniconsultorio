import type { PulseProcessManager } from '../../../pulse-runtime/pulse-process-manager'
import { PulseSessionClient } from '../../../pulse-runtime/pulse-session-client'
import type {
  ApplyAlbuterolInhalerPayload,
  ApplySupplementalOxygenPayload,
  PulseCancellableActionName,
  PulseEventsResult,
  PulseSnapshot,
} from '../../../pulse-runtime/pulse-runtime-types'
import {
  GOLD_ASTHMA_ALBUTEROL_ACTION,
  GOLD_ASTHMA_OXYGEN_ACTION,
  asthmaAttackAction,
} from './actions'
import { GOLD_ASTHMA_CONFIG } from './case-config'
import { newPulseEventChanges } from './events'
import { deriveGoldAsthmaPhysicalExam } from './physical-exam'
import {
  deriveGoldAsthmaPresentation,
  goldAsthmaPresentationSignature,
} from './presentation'
import { GoldAsthmaTimeline } from './timeline'
import type {
  GoldAsthmaActionRecord,
  GoldAsthmaCaseConfig,
  GoldAsthmaPhysicalExam,
  GoldAsthmaPresentation,
  GoldAsthmaTechnicalState,
  GoldAsthmaTimelineEntry,
} from './types'

export const GOLD_ASTHMA_FEATURE_FLAG = 'MEDIX_PULSE_GOLD_ASTHMA_ENABLED'

export class GoldAsthmaFeatureDisabledError extends Error {
  readonly code = 'GOLD_ASTHMA_FEATURE_DISABLED'

  constructor() {
    super(`${GOLD_ASTHMA_FEATURE_FLAG}=true is required before any Pulse session is created.`)
    this.name = 'GoldAsthmaFeatureDisabledError'
  }
}

export function assertGoldAsthmaFeatureEnabled(
  environment: Record<string, string | undefined> = process.env,
): void {
  if (environment[GOLD_ASTHMA_FEATURE_FLAG] !== 'true') {
    throw new GoldAsthmaFeatureDisabledError()
  }
}

interface CreateGoldAsthmaServiceOptions {
  manager: PulseProcessManager
  severity?: number
  config?: GoldAsthmaCaseConfig
  environment?: Record<string, string | undefined>
}

function emptyEvents(sessionId: string, simulationTimeSeconds: number): PulseEventsResult {
  return {
    sessionId,
    simulationTimeSeconds,
    changes: [],
    activeEvents: [],
    ignoredHighFrequencyEventCount: 0,
  }
}

function validateSeverity(value: number | null | undefined): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0 || value > 1) {
    throw new Error('A calibrated asthma severity greater than 0 and no more than 1 is required.')
  }
  return value
}

export class GoldAsthmaTechnicalService {
  readonly sessionId: string
  readonly severity: number
  readonly config: GoldAsthmaCaseConfig
  private readonly client: PulseSessionClient
  private readonly timeline: GoldAsthmaTimeline
  private snapshots: PulseSnapshot[]
  private actions: GoldAsthmaActionRecord[] = []
  private events: PulseEventsResult
  private seenEventIds = new Set<string>()
  private lastPresentationSignature: string | null = null
  private actionSequence = 0
  private terminated = false

  private constructor(params: {
    client: PulseSessionClient
    severity: number
    config: GoldAsthmaCaseConfig
    initialSnapshot: PulseSnapshot
    initialEvents: PulseEventsResult
  }) {
    this.client = params.client
    this.sessionId = params.client.sessionId
    this.severity = params.severity
    this.config = params.config
    this.snapshots = [params.initialSnapshot]
    this.events = params.initialEvents
    this.timeline = new GoldAsthmaTimeline(this.sessionId)
    this.timeline.append({
      simulationTimeSeconds: params.initialSnapshot.simulationTimeSeconds,
      type: 'session-created',
      source: 'pulse',
      title: 'Sessão Pulse criada',
      data: { caseId: this.config.id, patient: this.config.patient },
    })
    this.timeline.append({
      simulationTimeSeconds: params.initialSnapshot.simulationTimeSeconds,
      type: 'baseline',
      source: 'pulse',
      title: 'Baseline fisiológico coletado',
      data: { snapshot: params.initialSnapshot },
    })
    this.recordPresentationIfChanged()
  }

  static async create(options: CreateGoldAsthmaServiceOptions): Promise<GoldAsthmaTechnicalService> {
    assertGoldAsthmaFeatureEnabled(options.environment)
    const config = options.config ?? GOLD_ASTHMA_CONFIG
    const severity = validateSeverity(options.severity ?? config.selectedAsthmaSeverity)
    const { client, snapshot } = await PulseSessionClient.create(
      { patient: config.patient },
      options.manager,
    )
    try {
      const events = await client.getEvents()
      return new GoldAsthmaTechnicalService({
        client,
        severity,
        config,
        initialSnapshot: snapshot,
        initialEvents: events,
      })
    } catch (error) {
      await client.terminate().catch(() => undefined)
      throw error
    }
  }

  private interpretationInput() {
    return {
      snapshot: this.snapshots[this.snapshots.length - 1],
      snapshotHistory: this.snapshots,
      events: this.events,
      actions: this.actions,
      config: this.config,
    }
  }

  private recordError(error: unknown): void {
    const current = this.snapshots[this.snapshots.length - 1]
    this.timeline.append({
      simulationTimeSeconds: current.simulationTimeSeconds,
      type: 'error',
      source: 'medix-derived',
      title: 'Falha na operação técnica do Caso Ouro',
      data: {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : 'Unknown failure',
      },
    })
  }

  private recordAction(
    action: GoldAsthmaActionRecord['action'],
    status: GoldAsthmaActionRecord['status'],
    simulationTimeSeconds: number,
    details: Record<string, unknown>,
  ): GoldAsthmaActionRecord {
    this.actionSequence += 1
    const record: GoldAsthmaActionRecord = {
      id: `${this.sessionId}:action:${this.actionSequence}`,
      action,
      status,
      simulationTimeSeconds,
      details: { ...details },
      recordedAt: new Date().toISOString(),
    }
    this.actions.push(record)
    this.timeline.append({
      simulationTimeSeconds,
      type: status === 'applied' ? 'action-applied' : 'action-cancelled',
      source: 'pulse',
      title: `${action} ${status === 'applied' ? 'aplicada' : 'cancelada'}`,
      data: { actionRecordId: record.id, ...details },
    })
    return record
  }

  private recordPresentationIfChanged(): GoldAsthmaPresentation {
    const presentation = deriveGoldAsthmaPresentation(this.interpretationInput())
    const signature = goldAsthmaPresentationSignature(presentation)
    if (signature !== this.lastPresentationSignature) {
      this.lastPresentationSignature = signature
      this.timeline.append({
        simulationTimeSeconds: presentation.simulationTimeSeconds,
        type: 'presentation-changed',
        source: 'medix-derived',
        title: `Apresentação clínica: ${presentation.severity}`,
        data: {
          severity: presentation.severity,
          score: presentation.score,
          warnings: presentation.warnings,
        },
        dedupeKey: `presentation:${presentation.simulationTimeSeconds}:${signature}`,
      })
    }
    return presentation
  }

  async applyAsthma(severity = this.severity): Promise<GoldAsthmaActionRecord> {
    try {
      const payload = asthmaAttackAction(validateSeverity(severity))
      const result = await this.client.applyAction(payload)
      return this.recordAction(
        payload.action,
        'applied',
        result.simulationTimeSeconds,
        { payload, pulseResult: result.details },
      )
    } catch (error) {
      this.recordError(error)
      throw error
    }
  }

  async applyOxygen(
    payload: ApplySupplementalOxygenPayload = GOLD_ASTHMA_OXYGEN_ACTION,
  ): Promise<GoldAsthmaActionRecord> {
    try {
      const result = await this.client.applyAction(payload)
      return this.recordAction(
        payload.action,
        'applied',
        result.simulationTimeSeconds,
        { payload, pulseResult: result.details },
      )
    } catch (error) {
      this.recordError(error)
      throw error
    }
  }

  async applyAlbuterol(
    payload: ApplyAlbuterolInhalerPayload = GOLD_ASTHMA_ALBUTEROL_ACTION,
  ): Promise<GoldAsthmaActionRecord> {
    try {
      const result = await this.client.applyAction(payload)
      return this.recordAction(
        payload.action,
        'applied',
        result.simulationTimeSeconds,
        { payload, pulseResult: result.details },
      )
    } catch (error) {
      this.recordError(error)
      throw error
    }
  }

  async cancelAction(action: PulseCancellableActionName): Promise<GoldAsthmaActionRecord> {
    try {
      const result = await this.client.cancelAction({ action })
      return this.recordAction(
        action,
        'cancelled',
        result.simulationTimeSeconds,
        { pulseResult: result.details },
      )
    } catch (error) {
      this.recordError(error)
      throw error
    }
  }

  async advanceTime(seconds: number): Promise<PulseSnapshot> {
    try {
      const before = this.snapshots[this.snapshots.length - 1].simulationTimeSeconds
      const snapshot = await this.client.advanceTime(seconds)
      this.snapshots.push(snapshot)
      this.timeline.append({
        simulationTimeSeconds: snapshot.simulationTimeSeconds,
        type: 'time-advanced',
        source: 'pulse',
        title: `Tempo fisiológico avançado em ${seconds} s`,
        data: { from: before, to: snapshot.simulationTimeSeconds, seconds },
      })
      this.timeline.append({
        simulationTimeSeconds: snapshot.simulationTimeSeconds,
        type: 'snapshot',
        source: 'pulse',
        title: 'Snapshot fisiológico coletado',
        data: { snapshot },
        dedupeKey: `snapshot:${snapshot.simulationTimeSeconds}`,
      })
      await this.collectEvents()
      this.recordPresentationIfChanged()
      return snapshot
    } catch (error) {
      this.recordError(error)
      throw error
    }
  }

  async getSnapshot(): Promise<PulseSnapshot> {
    try {
      return await this.client.getSnapshot()
    } catch (error) {
      this.recordError(error)
      throw error
    }
  }

  async collectEvents(): Promise<PulseEventsResult> {
    try {
      const result = await this.client.getEvents()
      const newChanges = newPulseEventChanges(result, this.seenEventIds)
      for (const event of newChanges) this.seenEventIds.add(event.id)
      this.timeline.appendPulseEvents(newChanges)
      this.events = result
      return result
    } catch (error) {
      this.recordError(error)
      throw error
    }
  }

  getPresentation(): GoldAsthmaPresentation {
    return this.recordPresentationIfChanged()
  }

  requestPhysicalExam(): GoldAsthmaPhysicalExam {
    const exam = deriveGoldAsthmaPhysicalExam(this.interpretationInput(), this.sessionId)
    this.timeline.append({
      simulationTimeSeconds: exam.simulationTimeSeconds,
      type: 'physical-exam-requested',
      source: 'medix-derived',
      title: 'Exame físico adulto solicitado',
      data: {
        findingCount: Object.values(exam.sections).reduce((sum, values) => sum + values.length, 0),
      },
    })
    return exam
  }

  getSnapshots(): PulseSnapshot[] {
    return this.snapshots.map((snapshot) => ({
      ...snapshot,
      vitals: { ...snapshot.vitals },
      respiratory: { ...snapshot.respiratory },
      unavailableFields: [...snapshot.unavailableFields],
      warnings: [...snapshot.warnings],
    }))
  }

  getActions(): GoldAsthmaActionRecord[] {
    return this.actions.map((action) => ({ ...action, details: { ...action.details } }))
  }

  getTimeline(): GoldAsthmaTimelineEntry[] {
    return this.timeline.list()
  }

  getState(): GoldAsthmaTechnicalState {
    return {
      caseId: this.config.id,
      sessionId: this.sessionId,
      snapshot: this.snapshots[this.snapshots.length - 1],
      events: this.events,
      presentation: this.getPresentation(),
      timeline: this.getTimeline(),
    }
  }

  async terminate(): Promise<void> {
    if (this.terminated) return
    const currentTime = this.snapshots[this.snapshots.length - 1].simulationTimeSeconds
    this.timeline.append({
      simulationTimeSeconds: currentTime,
      type: 'session-terminated',
      source: 'pulse',
      title: 'Sessão Pulse encerrada',
      data: {},
    })
    try {
      await this.client.terminate()
      this.terminated = true
    } catch (error) {
      this.recordError(error)
      throw error
    }
  }
}

export function makeUninitializedEvents(
  sessionId: string,
  simulationTimeSeconds: number,
): PulseEventsResult {
  return emptyEvents(sessionId, simulationTimeSeconds)
}
