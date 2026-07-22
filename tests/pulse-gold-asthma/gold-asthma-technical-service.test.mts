import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { test } from 'node:test'

import { PulseProcessManager } from '../../lib/dynamic-osce/pulse-runtime/pulse-process-manager'
import {
  GoldAsthmaFeatureDisabledError,
  GoldAsthmaTechnicalService,
  assertGoldAsthmaFeatureEnabled,
} from '../../lib/dynamic-osce/cases/gold/asthma-severe/technical-service'

test('feature flag falha fechada antes de qualquer sessão', () => {
  assert.throws(
    () => assertGoldAsthmaFeatureEnabled({}),
    (error: unknown) => error instanceof GoldAsthmaFeatureDisabledError,
  )
  assert.doesNotThrow(() => assertGoldAsthmaFeatureEnabled({
    MEDIX_PULSE_GOLD_ASTHMA_ENABLED: 'true',
  }))
  assert.throws(() => assertGoldAsthmaFeatureEnabled({
    MEDIX_PULSE_GOLD_ASTHMA_ENABLED: 'TRUE',
  }))
})

test('serviço sem feature flag não inicia o gerenciador nem cria sessão', async () => {
  const manager = new PulseProcessManager()
  try {
    await assert.rejects(
      GoldAsthmaTechnicalService.create({
        manager,
        severity: 0.75,
        environment: {},
      }),
      (error: unknown) => error instanceof GoldAsthmaFeatureDisabledError,
    )
    assert.equal(manager.state, 'idle')
    assert.equal(manager.processId, undefined)
  } finally {
    await manager.stop()
  }
})

test('serviço técnico usa a mesma sessão para crise, avanços, tratamentos, eventos e exame', async () => {
  const repositoryRoot = process.cwd()
  const manager = new PulseProcessManager({
    config: {
      repositoryRoot,
      pythonExecutable: '/usr/bin/python3',
      pulseRoot: repositoryRoot,
      runtimeScript: resolve(repositoryRoot, 'tests/pulse-runtime/fixtures/fake-pulse-runtime.py'),
      workingDirectory: repositoryRoot,
      pythonPath: process.env.PYTHONPATH ?? '',
      timeoutMs: 2_000,
    },
  })
  try {
    const service = await GoldAsthmaTechnicalService.create({
      manager,
      severity: 0.75,
      environment: { MEDIX_PULSE_GOLD_ASTHMA_ENABLED: 'true' },
    })
    const sessionId = service.sessionId
    await service.applyAsthma()
    await service.advanceTime(30)
    await service.applyOxygen()
    await service.applyAlbuterol()
    await service.advanceTime(60)
    const events = await service.collectEvents()
    const exam = service.requestPhysicalExam()
    await service.cancelAction('supplemental_oxygen')
    await service.cancelAction('asthma_attack')
    await service.terminate()

    assert.equal(events.sessionId, sessionId)
    assert.equal(exam.sessionId, sessionId)
    assert.ok(service.getSnapshots().every((snapshot) => snapshot.sessionId === sessionId))
    assert.deepEqual(
      service.getActions().map((action) => [action.action, action.status]),
      [
        ['asthma_attack', 'applied'],
        ['supplemental_oxygen', 'applied'],
        ['albuterol_inhaler', 'applied'],
        ['supplemental_oxygen', 'cancelled'],
        ['asthma_attack', 'cancelled'],
      ],
    )
    assert.ok(service.getTimeline().some((entry) => entry.type === 'physical-exam-requested'))
    assert.ok(service.getTimeline().some((entry) => entry.type === 'session-terminated'))
  } finally {
    await manager.stop()
  }
})
