import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { test } from 'node:test'

import { PulseRuntimeError } from '../../lib/dynamic-osce/pulse-runtime/pulse-runtime-errors'
import { PulseProcessManager } from '../../lib/dynamic-osce/pulse-runtime/pulse-process-manager'
import { PulseSessionClient } from '../../lib/dynamic-osce/pulse-runtime/pulse-session-client'

test('cliente mantém sessionId em snapshot, dois avanços e término', async () => {
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
    const { client, snapshot: initial } = await PulseSessionClient.create(undefined, manager)
    const fetched = await client.getSnapshot()
    const first = await client.advanceTime(10)
    const asthma = await client.applyAction({ action: 'asthma_attack', severity: 0.75 })
    const oxygen = await client.applyAction({
      action: 'supplemental_oxygen',
      device: 'non_rebreather_mask',
      flow: { value: 10, unit: 'L/min' },
      volume: { value: 1000, unit: 'L' },
    })
    const events = await client.getEvents()
    const cancelled = await client.cancelAction({ action: 'supplemental_oxygen' })
    const second = await client.advanceTime(10)

    assert.equal(initial.sessionId, client.sessionId)
    assert.equal(fetched.sessionId, client.sessionId)
    assert.equal(first.sessionId, client.sessionId)
    assert.equal(second.sessionId, client.sessionId)
    assert.equal(first.simulationTimeSeconds, 10)
    assert.equal(second.simulationTimeSeconds, 20)
    assert.equal(asthma.action, 'asthma_attack')
    assert.equal(oxygen.action, 'supplemental_oxygen')
    assert.equal(events.sessionId, client.sessionId)
    assert.equal(cancelled.action, 'supplemental_oxygen')
    await assert.rejects(
      client.applyCondition({ condition: 'asthma_attack' }),
      (error: unknown) => error instanceof PulseRuntimeError
        && error.code === 'UNSUPPORTED_CONDITION',
    )

    await client.terminate()
    await assert.rejects(
      client.advanceTime(10),
      (error: unknown) => error instanceof PulseRuntimeError
        && error.code === 'SESSION_ALREADY_TERMINATED',
    )
  } finally {
    await manager.stop()
  }
})
