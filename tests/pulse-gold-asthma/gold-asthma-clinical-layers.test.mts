import assert from 'node:assert/strict'
import { test } from 'node:test'

import type {
  PulseEventsResult,
  PulseSnapshot,
} from '../../lib/dynamic-osce/pulse-runtime/pulse-runtime-types'
import { GOLD_ASTHMA_CONFIG } from '../../lib/dynamic-osce/cases/gold/asthma-severe/case-config'
import { deriveGoldAsthmaPhysicalExam } from '../../lib/dynamic-osce/cases/gold/asthma-severe/physical-exam'
import { deriveGoldAsthmaPresentation } from '../../lib/dynamic-osce/cases/gold/asthma-severe/presentation'
import type { GoldAsthmaActionRecord } from '../../lib/dynamic-osce/cases/gold/asthma-severe/types'

function snapshot(params: {
  time: number
  spo2: number
  rr: number
  hr: number
  resistance: number
  tidal: number
  ventilation: number
  pao2: number
  paco2: number
  pH: number
}): PulseSnapshot {
  return {
    sessionId: 'session-clinical',
    simulationTimeSeconds: params.time,
    vitals: {
      heartRate: params.hr,
      systolicPressure: 125,
      diastolicPressure: 78,
      meanArterialPressure: 94,
      respiratoryRate: params.rr,
      spo2: params.spo2,
      temperatureC: 37,
    },
    respiratory: {
      airwayResistance: params.resistance,
      tidalVolumeMl: params.tidal,
      minuteVentilationLMin: params.ventilation,
      pao2MmHg: params.pao2,
      paco2MmHg: params.paco2,
      pH: params.pH,
    },
    unavailableFields: [],
    warnings: [],
  }
}

const baseline = snapshot({
  time: 0,
  spo2: 98,
  rr: 16,
  hr: 72,
  resistance: 1.8,
  tidal: 500,
  ventilation: 8,
  pao2: 95,
  paco2: 40,
  pH: 7.4,
})

const asthmaAction: GoldAsthmaActionRecord = {
  id: 'action-1',
  action: 'asthma_attack',
  status: 'applied',
  simulationTimeSeconds: 0,
  details: { severity: 0.75 },
  recordedAt: new Date(0).toISOString(),
}

function events(active: string[] = []): PulseEventsResult {
  return {
    sessionId: 'session-clinical',
    simulationTimeSeconds: 120,
    changes: [],
    activeEvents: active.map((pulseName, index) => ({
      id: `event-${index}`,
      pulseName,
      active: true,
      simulationTimeSeconds: 100,
      durationSeconds: 20,
      category: 'respiratory',
      severity: 'high',
      source: 'pulse',
      recordedAt: new Date(0).toISOString(),
    })),
    ignoredHighFrequencyEventCount: 0,
  }
}

test('apresentação combina oxigenação, mecânica, ventilação, tendência e eventos', () => {
  const previous = snapshot({
    time: 90,
    spo2: 91,
    rr: 30,
    hr: 110,
    resistance: 5,
    tidal: 360,
    ventilation: 6,
    pao2: 65,
    paco2: 45,
    pH: 7.35,
  })
  const current = snapshot({
    time: 120,
    spo2: 84,
    rr: 24,
    hr: 122,
    resistance: 7,
    tidal: 220,
    ventilation: 3.5,
    pao2: 52,
    paco2: 55,
    pH: 7.28,
  })
  const presentation = deriveGoldAsthmaPresentation({
    snapshot: current,
    snapshotHistory: [baseline, previous, current],
    events: events(['Hypoxia', 'Hypercapnia']),
    actions: [asthmaAction],
    config: GOLD_ASTHMA_CONFIG,
  })

  assert.equal(presentation.severity, 'life-threatening')
  assert.ok(presentation.evidence.some((item) => item.id === 'pulse-spo2'))
  assert.ok(presentation.evidence.some((item) => item.id === 'derived-ventilation-ratio'))
  assert.ok(presentation.evidence.some((item) => item.id.startsWith('pulse-event-')))
  assert.ok(presentation.warnings.some((warning) => warning.includes('Redução de sibilos')))
})

test('exame adulto reflete o snapshot do instante solicitado e explicita a origem', () => {
  const severe = snapshot({
    time: 120,
    spo2: 87,
    rr: 32,
    hr: 118,
    resistance: 6,
    tidal: 300,
    ventilation: 5,
    pao2: 58,
    paco2: 48,
    pH: 7.33,
  })
  const severeExam = deriveGoldAsthmaPhysicalExam({
    snapshot: severe,
    snapshotHistory: [baseline, severe],
    events: events(['Hypoxia']),
    actions: [asthmaAction],
    config: GOLD_ASTHMA_CONFIG,
  }, 'session-clinical')
  const improved = snapshot({
    time: 240,
    spo2: 97,
    rr: 18,
    hr: 88,
    resistance: 2,
    tidal: 480,
    ventilation: 7.8,
    pao2: 90,
    paco2: 41,
    pH: 7.39,
  })
  const improvedExam = deriveGoldAsthmaPhysicalExam({
    snapshot: improved,
    snapshotHistory: [baseline, severe, improved],
    events: events(),
    actions: [asthmaAction],
    config: GOLD_ASTHMA_CONFIG,
  }, 'session-clinical')

  assert.equal(severeExam.simulationTimeSeconds, 120)
  assert.equal(improvedExam.simulationTimeSeconds, 240)
  assert.ok(severeExam.sections.respiratory.some((item) => item.id === 'respiratory-tachypnea'))
  assert.ok(severeExam.sections.respiratory.some((item) => item.id === 'respiratory-reduced-air-entry'))
  assert.ok(!improvedExam.sections.respiratory.some((item) => item.id === 'respiratory-tachypnea'))
  for (const section of Object.values(severeExam.sections)) {
    for (const item of section) assert.ok(['pulse', 'medix-derived', 'case-fixed'].includes(item.source))
  }
})
