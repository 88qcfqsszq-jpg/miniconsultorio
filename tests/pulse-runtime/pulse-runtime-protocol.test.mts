import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  createPulseRuntimeRequest,
  createPulseRuntimeRequestId,
  parsePulseRuntimeResponseLine,
  serializePulseRuntimeRequest,
} from '../../lib/dynamic-osce/pulse-runtime/pulse-runtime-protocol'

test('serializa uma requisição JSON Lines versão 1', () => {
  const request = createPulseRuntimeRequest({
    operation: 'ADVANCE_TIME',
    sessionId: 'session-1',
    payload: { seconds: 10 },
    requestId: 'request-1',
  })
  const serialized = serializePulseRuntimeRequest(request)

  assert.ok(serialized.endsWith('\n'))
  assert.deepEqual(JSON.parse(serialized), {
    protocolVersion: '1',
    requestId: 'request-1',
    operation: 'ADVANCE_TIME',
    sessionId: 'session-1',
    payload: { seconds: 10 },
  })
})

test('gera requestIds UUID únicos', () => {
  const first = createPulseRuntimeRequestId()
  const second = createPulseRuntimeRequestId()
  assert.notEqual(first, second)
  assert.match(first, /^[0-9a-f-]{36}$/)
})

test('valida respostas e rejeita stdout inválido', () => {
  const response = parsePulseRuntimeResponseLine(JSON.stringify({
    protocolVersion: '1',
    requestId: 'request-1',
    ok: true,
    data: { status: 'ready' },
    warnings: [],
  }))
  assert.equal(response.ok, true)
  assert.throws(() => parsePulseRuntimeResponseLine('not-json'), /invalid JSON/)
  assert.throws(() => parsePulseRuntimeResponseLine('{}'), /protocol version/)
})
