import assert from 'node:assert/strict'
import { test } from 'node:test'

import { GoldAsthmaTimeline } from '../../lib/dynamic-osce/cases/gold/asthma-severe/timeline'

test('timeline deduplica eventos Pulse e preserva origem e tempo fisiológico', () => {
  const timeline = new GoldAsthmaTimeline('session-timeline')
  const event = {
    id: 'pulse-event-1',
    pulseName: 'Hypoxia',
    active: true,
    simulationTimeSeconds: 42.5,
    durationSeconds: 0,
    category: 'respiratory',
    severity: 'high' as const,
    source: 'pulse' as const,
    recordedAt: new Date(0).toISOString(),
  }
  timeline.appendPulseEvents([event, event])
  const entries = timeline.list()

  assert.equal(entries.length, 1)
  assert.equal(entries[0].type, 'event-started')
  assert.equal(entries[0].source, 'pulse')
  assert.equal(entries[0].simulationTimeSeconds, 42.5)
})

test('timeline rejeita tempo fisiológico inválido', () => {
  const timeline = new GoldAsthmaTimeline('session-timeline')
  assert.throws(() => timeline.append({
    simulationTimeSeconds: Number.NaN,
    type: 'error',
    source: 'medix-derived',
    title: 'invalid',
  }), /finite non-negative/)
})
