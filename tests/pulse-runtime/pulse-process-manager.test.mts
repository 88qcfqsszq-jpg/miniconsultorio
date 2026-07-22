import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { test } from 'node:test'

import { PulseRuntimeError } from '../../lib/dynamic-osce/pulse-runtime/pulse-runtime-errors'
import {
  PulseProcessManager,
  disposePulseProcessManager,
  getPulseProcessManager,
} from '../../lib/dynamic-osce/pulse-runtime/pulse-process-manager'

const repositoryRoot = process.cwd()
const fixture = resolve(repositoryRoot, 'tests/pulse-runtime/fixtures/fake-pulse-runtime.py')

function createManager(params: {
  mode?: string
  target?: string
  timeoutMs?: number
} = {}): PulseProcessManager {
  return new PulseProcessManager({
    config: {
      repositoryRoot,
      pythonExecutable: '/usr/bin/python3',
      pulseRoot: repositoryRoot,
      runtimeScript: fixture,
      workingDirectory: repositoryRoot,
      pythonPath: process.env.PYTHONPATH ?? '',
      timeoutMs: params.timeoutMs ?? 2_000,
    },
    environment: {
      FAKE_PULSE_MODE: params.mode ?? 'normal',
      FAKE_PULSE_TARGET_OPERATION: params.target ?? 'GET_ENGINE_INFO',
    },
  })
}

async function processExists(pid: number): Promise<boolean> {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      process.kill(pid, 0)
    } catch {
      return false
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 20))
  }
  return true
}

test('inicia, confirma readiness, captura stderr e correlaciona respostas', async () => {
  const manager = createManager()
  try {
    await manager.start()
    assert.equal(manager.state, 'ready')
    assert.ok(manager.processId)
    assert.ok(manager.getRecentStderr().some((line) => line.includes('fake Pulse runtime started')))

    const [ping, info] = await Promise.all([
      manager.request('PING'),
      manager.request('GET_ENGINE_INFO'),
    ])
    assert.equal(ping.data?.status, 'ready')
    assert.equal(info.data?.version, 'fake-1')
    assert.notEqual(ping.requestId, info.requestId)
  } finally {
    await manager.stop()
  }
})

test('erro de spawn é estruturado e não cria processo utilizável', async () => {
  const manager = new PulseProcessManager({
    config: {
      repositoryRoot,
      pythonExecutable: 'medix-python-that-does-not-exist',
      pulseRoot: repositoryRoot,
      runtimeScript: fixture,
      workingDirectory: repositoryRoot,
      pythonPath: '',
      timeoutMs: 500,
    },
  })
  try {
    await assert.rejects(
      manager.start(),
      (error: unknown) => error instanceof PulseRuntimeError
        && error.code === 'PROCESS_SPAWN_FAILED',
    )
    assert.equal(manager.state, 'failed')
    assert.equal(manager.processId, undefined)
  } finally {
    await manager.stop()
  }
})

test('timeout rejeita todas as promises pendentes e encerra o processo', async () => {
  const manager = createManager({ mode: 'hang', timeoutMs: 120 })
  await manager.start()
  const pid = manager.processId
  assert.ok(pid)

  const results = await Promise.allSettled([
    manager.request('GET_ENGINE_INFO'),
    manager.request('PING'),
  ])
  assert.equal(results[0].status, 'rejected')
  assert.equal(results[1].status, 'rejected')
  assert.ok(results.every((result) =>
    result.status === 'rejected' && result.reason instanceof PulseRuntimeError))
  assert.equal(manager.state, 'failed')
  await manager.stop()
  assert.equal(await processExists(pid), false)
})

test('linha inválida em stdout é falha fatal de protocolo', async () => {
  const manager = createManager({ mode: 'invalid_stdout' })
  try {
    await manager.start()
    await assert.rejects(
      manager.request('GET_ENGINE_INFO'),
      (error: unknown) => error instanceof PulseRuntimeError && error.code === 'INVALID_STDOUT',
    )
    assert.equal(manager.state, 'failed')
  } finally {
    await manager.stop()
  }
})

test('queda inesperada rejeita a requisição pendente', async () => {
  const manager = createManager({ mode: 'exit' })
  try {
    await manager.start()
    await assert.rejects(
      manager.request('GET_ENGINE_INFO'),
      (error: unknown) => error instanceof PulseRuntimeError && error.code === 'PROCESS_EXITED',
    )
  } finally {
    await manager.stop()
  }
})

test('shutdown gracioso não deixa o processo observavelmente ativo', async () => {
  const manager = createManager()
  await manager.start()
  const pid = manager.processId
  assert.ok(pid)
  await manager.stop()
  assert.equal(manager.state, 'stopped')
  assert.equal(await processExists(pid), false)
})

test('singleton globalThis reutiliza um único manager no processo Node', async () => {
  const options = {
    config: {
      repositoryRoot,
      pythonExecutable: '/usr/bin/python3',
      pulseRoot: repositoryRoot,
      runtimeScript: fixture,
      workingDirectory: repositoryRoot,
      pythonPath: process.env.PYTHONPATH ?? '',
      timeoutMs: 2_000,
    },
  }
  const first = getPulseProcessManager(options)
  const second = getPulseProcessManager(options)
  assert.equal(first, second)
  try {
    await first.start()
    assert.equal(second.processId, first.processId)
  } finally {
    await disposePulseProcessManager()
  }
})
