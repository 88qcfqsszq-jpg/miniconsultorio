import assert from 'node:assert/strict'
import { test } from 'node:test'

import { GoldAsthmaTechnicalService } from '../../lib/dynamic-osce/cases/gold/asthma-severe/technical-service'
import { PulseRuntimeError } from '../../lib/dynamic-osce/pulse-runtime/pulse-runtime-errors'
import { PulseProcessManager } from '../../lib/dynamic-osce/pulse-runtime/pulse-process-manager'

const REAL_INTEGRATION_ENABLED = process.env.MEDIX_PULSE_REAL_INTEGRATION === '1'
const GOLD_ENVIRONMENT = { MEDIX_PULSE_GOLD_ASTHMA_ENABLED: 'true' }

function required(value: number | undefined, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    assert.fail(`${label} must be available and finite from Pulse`)
  }
  return value
}

function isMissingAlbuterolAerosolization(error: unknown): boolean {
  if (!(error instanceof PulseRuntimeError) || error.code !== 'RESOURCE_NOT_FOUND') return false
  const details = error.details as Record<string, unknown> | undefined
  return details?.resource === 'Albuterol' && details.missingSection === 'Aerosolization'
}

async function assertNoActiveSessions(manager: PulseProcessManager): Promise<void> {
  const response = await manager.request('GET_ENGINE_INFO')
  assert.equal(response.ok, true)
  assert.equal(response.data?.activeSessionCount, 0)
}

test('matriz real do Caso Ouro usa um processo persistente e explicita o bloqueio do broncodilatador', {
  skip: !REAL_INTEGRATION_ENABLED,
}, async (context) => {
  const manager = new PulseProcessManager()
  let persistentProcessId: number | undefined

  async function createService(): Promise<GoldAsthmaTechnicalService> {
    const service = await GoldAsthmaTechnicalService.create({
      manager,
      severity: 0.75,
      environment: GOLD_ENVIRONMENT,
    })
    persistentProcessId ??= manager.processId
    assert.equal(manager.processId, persistentProcessId)
    return service
  }

  try {
    await context.test('cenário 1 — progressão sem tratamento', async () => {
      const service = await createService()
      try {
        const baseline = service.getSnapshots()[0]
        await service.applyAsthma()
        const at90 = await service.advanceTime(90)
        const at300 = await service.advanceTime(210)
        const events = await service.collectEvents()

        assert.equal(at90.sessionId, service.sessionId)
        assert.equal(at300.sessionId, service.sessionId)
        assert.ok(
          required(at90.respiratory.airwayResistance, 'airway resistance at 90 s')
            > required(baseline.respiratory.airwayResistance, 'baseline airway resistance') * 5,
        )
        assert.ok(
          required(at90.vitals.spo2, 'SpO2 at 90 s')
            < required(baseline.vitals.spo2, 'baseline SpO2') - 2,
        )
        assert.ok(
          required(at300.respiratory.paco2MmHg, 'PaCO2 at 300 s')
            > required(baseline.respiratory.paco2MmHg, 'baseline PaCO2'),
        )
        assert.ok(events.changes.some((event) => event.pulseName === 'Hypoxia' && event.active))
      } finally {
        await service.terminate()
      }
      await assertNoActiveSessions(manager)
    })

    await context.test('cenário 2 — oxigênio real melhora oxigenação sem corrigir a obstrução', async () => {
      const service = await createService()
      try {
        await service.applyAsthma()
        const crisis = await service.advanceTime(90)
        await service.applyOxygen()
        const oxygen30 = await service.advanceTime(30)
        const oxygen210 = await service.advanceTime(180)
        const events = await service.collectEvents()

        assert.ok(
          required(oxygen30.respiratory.pao2MmHg, 'PaO2 after oxygen')
            > required(crisis.respiratory.pao2MmHg, 'PaO2 before oxygen'),
        )
        assert.ok(
          required(oxygen30.vitals.spo2, 'SpO2 after oxygen')
            > required(crisis.vitals.spo2, 'SpO2 before oxygen'),
        )
        assert.ok(
          required(oxygen210.respiratory.airwayResistance, 'airway resistance after oxygen')
            > 10,
        )
        assert.ok(!events.activeEvents.some((event) => event.pulseName.includes('Hyperoxemia')))
      } finally {
        await service.terminate()
      }
      await assertNoActiveSessions(manager)
    })

    await context.test('cenário 3 — albuterol falha fechado sem aerossolização local', async () => {
      const service = await createService()
      try {
        await service.applyAsthma()
        await service.advanceTime(30)
        await assert.rejects(() => service.applyAlbuterol(), isMissingAlbuterolAerosolization)
        assert.ok(service.getTimeline().some((entry) => entry.type === 'error'))
      } finally {
        await service.terminate()
      }
      await assertNoActiveSessions(manager)
    })

    await context.test('cenário 4 — combinação preserva oxigênio e não simula broncodilatação', async () => {
      const service = await createService()
      try {
        await service.applyAsthma()
        await service.advanceTime(30)
        await service.applyOxygen()
        await assert.rejects(() => service.applyAlbuterol(), isMissingAlbuterolAerosolization)
        assert.deepEqual(
          service.getActions().map((record) => record.action),
          ['asthma_attack', 'supplemental_oxygen'],
        )
      } finally {
        await service.terminate()
      }
      await assertNoActiveSessions(manager)
    })

    await context.test('cenário 5 — tratamento tardio chega ao mesmo bloqueio explícito', async () => {
      const service = await createService()
      try {
        await service.applyAsthma()
        const late = await service.advanceTime(210)
        await service.applyOxygen()
        await assert.rejects(() => service.applyAlbuterol(), isMissingAlbuterolAerosolization)
        assert.ok(required(late.respiratory.airwayResistance, 'late airway resistance') > 10)
      } finally {
        await service.terminate()
      }
      await assertNoActiveSessions(manager)
    })

    await context.test('cenário 6 — lifecycle parcial cancela ações reais na mesma sessão', async () => {
      const service = await createService()
      try {
        const baseline = service.getSnapshots()[0]
        const sessionId = service.sessionId
        await service.applyAsthma()
        await service.advanceTime(30)
        await service.applyOxygen()
        await service.advanceTime(30)
        await assert.rejects(() => service.applyAlbuterol(), isMissingAlbuterolAerosolization)
        await service.cancelAction('supplemental_oxygen')
        await service.cancelAction('asthma_attack')
        const recovered = await service.advanceTime(60)

        assert.ok(service.getSnapshots().every((snapshot) => snapshot.sessionId === sessionId))
        assert.ok(
          required(recovered.respiratory.airwayResistance, 'recovered airway resistance')
            < required(baseline.respiratory.airwayResistance, 'baseline airway resistance') * 1.25,
        )
      } finally {
        await service.terminate()
      }
      await assertNoActiveSessions(manager)
    })

    assert.equal(manager.processId, persistentProcessId)
  } finally {
    await manager.stop()
  }
})
