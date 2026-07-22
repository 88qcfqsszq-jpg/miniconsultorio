import type { PulseEvent } from '../../../pulse-runtime'
import type {
  GoldAsthmaEvidenceSource,
  GoldAsthmaTimelineEntry,
  GoldAsthmaTimelineType,
} from './types'

interface AppendTimelineEntry {
  simulationTimeSeconds: number
  type: GoldAsthmaTimelineType
  source: GoldAsthmaEvidenceSource
  title: string
  data?: Record<string, unknown>
  dedupeKey?: string
}

export class GoldAsthmaTimeline {
  readonly sessionId: string
  private entries: GoldAsthmaTimelineEntry[] = []
  private dedupeKeys = new Set<string>()
  private sequence = 0

  constructor(sessionId: string) {
    this.sessionId = sessionId
  }

  append(input: AppendTimelineEntry): GoldAsthmaTimelineEntry | undefined {
    if (!Number.isFinite(input.simulationTimeSeconds) || input.simulationTimeSeconds < 0) {
      throw new Error('Timeline physiological time must be a finite non-negative number.')
    }
    if (input.dedupeKey && this.dedupeKeys.has(input.dedupeKey)) return undefined
    if (input.dedupeKey) this.dedupeKeys.add(input.dedupeKey)
    this.sequence += 1
    const entry: GoldAsthmaTimelineEntry = {
      id: `${this.sessionId}:timeline:${this.sequence}`,
      sessionId: this.sessionId,
      simulationTimeSeconds: input.simulationTimeSeconds,
      type: input.type,
      source: input.source,
      title: input.title,
      data: { ...(input.data ?? {}) },
      recordedAt: new Date().toISOString(),
    }
    this.entries.push(entry)
    return entry
  }

  appendPulseEvents(events: readonly PulseEvent[]): void {
    for (const event of events) {
      this.append({
        simulationTimeSeconds: event.simulationTimeSeconds,
        type: event.active ? 'event-started' : 'event-ended',
        source: 'pulse',
        title: `${event.pulseName} ${event.active ? 'iniciado' : 'encerrado'}`,
        data: {
          pulseEventId: event.id,
          category: event.category,
          severity: event.severity,
        },
        dedupeKey: `pulse-event:${event.id}`,
      })
    }
  }

  list(): GoldAsthmaTimelineEntry[] {
    return this.entries.map((entry) => ({ ...entry, data: { ...entry.data } }))
  }
}
