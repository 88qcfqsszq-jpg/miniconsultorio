import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { delimiter, join } from 'node:path'
import { test } from 'node:test'

import { PulseRuntimeError } from '../../lib/dynamic-osce/pulse-runtime/pulse-runtime-errors'
import { PulseProcessManager } from '../../lib/dynamic-osce/pulse-runtime/pulse-process-manager'
import type { PulseSnapshot } from '../../lib/dynamic-osce/pulse-runtime/pulse-runtime-types'

const repositoryRoot = process.cwd()
const pulseRoot = join(repositoryRoot, '.reference-local', 'engine-stable')
const pythonExecutable = process.env.MEDIX_PULSE_PYTHON
  ?? '/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/bin/python3.9'
const pythonPath = [
  join(pulseRoot, 'build', 'install', 'lib'),
  join(pulseRoot, 'build', 'install', 'python'),
  join(pulseRoot, 'build', 'install', 'bin'),
].join(delimiter)
const probe = spawnSync(
  pythonExecutable,
  ['-B', '-c', 'import PyPulse; print(PyPulse.__version__)'],
  {
    cwd: join(pulseRoot, 'bin'),
    env: { ...process.env, PYTHONPATH: pythonPath },
    encoding: 'utf8',
  },
)
const integrationAvailable = probe.status === 0
const skipReason = integrationAvailable
  ? false
  : `PyPulse indisponível: ${probe.error?.message ?? probe.stderr.trim() ?? `exit ${String(probe.status)}`}`

function assertFinitePresentFields(snapshot: PulseSnapshot): void {
  for (const [field, value] of Object.entries(snapshot.vitals)) {
    assert.ok(Number.isFinite(value), `vitals.${field} não é finito`)
  }
  for (const [field, value] of Object.entries(snapshot.respiratory)) {
    assert.ok(Number.isFinite(value), `respiratory.${field} não é finito`)
  }
  for (const path of snapshot.unavailableFields) {
    const [section, field] = path.split('.') as ['vitals' | 'respiratory', string]
    assert.equal(
      Object.prototype.hasOwnProperty.call(snapshot[section], field),
      false,
      `${path} foi declarado indisponível mas recebeu valor`,
    )
  }
}

test('fluxo real persistente: create, dois advances, terminate e shutdown', {
  skip: skipReason,
  timeout: 120_000,
}, async () => {
  const manager = new PulseProcessManager({
    config: {
      repositoryRoot,
      pythonExecutable,
      pulseRoot,
      timeoutMs: 60_000,
    },
  })

  try {
    await manager.start()
    const ping = await manager.request('PING')
    const info = await manager.request('GET_ENGINE_INFO')
    assert.equal(ping.data?.status, 'ready')
    assert.equal(info.data?.importAvailable, true)

    const created = await manager.request('CREATE_SESSION')
    assert.ok(created.data)
    const sessionId = created.data.sessionId
    const initial = await manager.request('GET_SNAPSHOT', { sessionId })
    const first = await manager.request('ADVANCE_TIME', {
      sessionId,
      payload: { seconds: 10 },
    })
    const second = await manager.request('ADVANCE_TIME', {
      sessionId,
      payload: { seconds: 10 },
    })

    assert.equal(initial.data?.sessionId, sessionId)
    assert.equal(first.data?.sessionId, sessionId)
    assert.equal(second.data?.sessionId, sessionId)
    assert.ok(first.data && initial.data
      && first.data.simulationTimeSeconds > initial.data.simulationTimeSeconds)
    assert.ok(second.data && first.data
      && second.data.simulationTimeSeconds > first.data.simulationTimeSeconds)
    assertFinitePresentFields(initial.data!)
    assertFinitePresentFields(first.data!)
    assertFinitePresentFields(second.data!)

    await manager.request('TERMINATE_SESSION', { sessionId })
    await assert.rejects(
      manager.request('ADVANCE_TIME', { sessionId, payload: { seconds: 10 } }),
      (error: unknown) => error instanceof PulseRuntimeError
        && ['SESSION_NOT_FOUND', 'SESSION_ALREADY_TERMINATED'].includes(error.code),
    )
  } finally {
    await manager.stop()
  }
})
