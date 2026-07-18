/**
 * Testes de lib/voice/createRealtimeClientSecret.ts (Etapa 3).
 *
 * Nenhuma chamada real à OpenAI é feita. Quando um `client` é injetado, a
 * função nunca constrói o cliente oficial nem toca a rede. No teste sem
 * cliente injetado (para provar o erro de configuração), um guard sobre
 * `globalThis.fetch` FALHA o teste caso qualquer chamada de rede seja tentada
 * — prova concreta de que nenhum crédito é consumido.
 *
 * Runner: npx tsx --test lib/voice/__tests__/createRealtimeClientSecret.test.mts
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  createRealtimeClientSecret,
  isRealtimeVoiceEnabled,
  resolverModeloRealtime,
  resolverSessionMaxSeconds,
  resolverIdleTimeoutSeconds,
  resolverChaveRealtime,
  RealtimeConfigError,
  type RealtimeClientSecretsClient,
} from '@/lib/voice/createRealtimeClientSecret'

/** Salva/restaura um conjunto de env vars ao redor de um teste. */
function comEnv(patch: Record<string, string | undefined>, fn: () => void | Promise<void>) {
  const originais: Record<string, string | undefined> = {}
  for (const k of Object.keys(patch)) originais[k] = process.env[k]
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) delete process.env[k]
    else process.env[k] = v
  }
  return (async () => {
    try {
      await fn()
    } finally {
      for (const [k, v] of Object.entries(originais)) {
        if (v === undefined) delete process.env[k]
        else process.env[k] = v
      }
    }
  })()
}

// ── Feature flag ──────────────────────────────────────────────────────────────
test('isRealtimeVoiceEnabled: true somente para "true" exato', async () => {
  await comEnv({ REALTIME_VOICE_ENABLED: 'true' }, () => assert.equal(isRealtimeVoiceEnabled(), true))
  await comEnv({ REALTIME_VOICE_ENABLED: 'false' }, () => assert.equal(isRealtimeVoiceEnabled(), false))
  await comEnv({ REALTIME_VOICE_ENABLED: undefined }, () => assert.equal(isRealtimeVoiceEnabled(), false))
  await comEnv({ REALTIME_VOICE_ENABLED: 'TRUE' }, () => assert.equal(isRealtimeVoiceEnabled(), false))
})

// ── Modelo ───────────────────────────────────────────────────────────────────
test('resolverModeloRealtime: null quando ausente; string trimada quando presente', async () => {
  await comEnv({ OPENAI_REALTIME_MODEL: undefined }, () => assert.equal(resolverModeloRealtime(), null))
  await comEnv({ OPENAI_REALTIME_MODEL: '  gpt-realtime  ' }, () => assert.equal(resolverModeloRealtime(), 'gpt-realtime'))
  await comEnv({ OPENAI_REALTIME_MODEL: '' }, () => assert.equal(resolverModeloRealtime(), null))
})

// ── Duração da sessão ────────────────────────────────────────────────────────
test('resolverSessionMaxSeconds: default, clamp e correção de valor inválido', async () => {
  await comEnv({ REALTIME_SESSION_MAX_SECONDS: undefined }, () => assert.equal(resolverSessionMaxSeconds(), 600))
  await comEnv({ REALTIME_SESSION_MAX_SECONDS: '120' }, () => assert.equal(resolverSessionMaxSeconds(), 120))
  await comEnv({ REALTIME_SESSION_MAX_SECONDS: '99999' }, () => assert.equal(resolverSessionMaxSeconds(), 1800)) // clamp ao teto Medix
  await comEnv({ REALTIME_SESSION_MAX_SECONDS: '1' }, () => assert.equal(resolverSessionMaxSeconds(), 10)) // clamp ao mínimo do provedor
  await comEnv({ REALTIME_SESSION_MAX_SECONDS: 'abc' }, () => assert.equal(resolverSessionMaxSeconds(), 600)) // correção → default
  await comEnv({ REALTIME_SESSION_MAX_SECONDS: '-5' }, () => assert.equal(resolverSessionMaxSeconds(), 600)) // correção → default
})

// ── Idle timeout (reservado) ─────────────────────────────────────────────────
test('resolverIdleTimeoutSeconds: default e clamp (reservado, não enviado ao provedor)', async () => {
  await comEnv({ REALTIME_IDLE_TIMEOUT_SECONDS: undefined }, () => assert.equal(resolverIdleTimeoutSeconds(), 30))
  await comEnv({ REALTIME_IDLE_TIMEOUT_SECONDS: '9999' }, () => assert.equal(resolverIdleTimeoutSeconds(), 300))
  await comEnv({ REALTIME_IDLE_TIMEOUT_SECONDS: '0' }, () => assert.equal(resolverIdleTimeoutSeconds(), 30))
})

// ── Resolução de chave ───────────────────────────────────────────────────────
test('resolverChaveRealtime: prioriza OPENAI_REALTIME_API_KEY sobre OPENAI_API_KEY', async () => {
  await comEnv({ OPENAI_REALTIME_API_KEY: 'chave-realtime-fake', OPENAI_API_KEY: 'chave-principal-fake' }, () => {
    assert.equal(resolverChaveRealtime(), 'chave-realtime-fake')
  })
})
test('resolverChaveRealtime: cai para OPENAI_API_KEY quando a dedicada está ausente', async () => {
  await comEnv({ OPENAI_REALTIME_API_KEY: undefined, OPENAI_API_KEY: 'chave-principal-fake' }, () => {
    assert.equal(resolverChaveRealtime(), 'chave-principal-fake')
  })
})
test('resolverChaveRealtime: null quando nenhuma chave está configurada', async () => {
  await comEnv({ OPENAI_REALTIME_API_KEY: undefined, OPENAI_API_KEY: undefined }, () => {
    assert.equal(resolverChaveRealtime(), null)
  })
})

// ── Criação do client secret (mockada — sem rede) ───────────────────────────
test('createRealtimeClientSecret com client injetado: nunca toca env nem rede', async () => {
  let corpoRecebido: any = null
  const mock: RealtimeClientSecretsClient = {
    realtime: {
      clientSecrets: {
        create: async (body: unknown) => {
          corpoRecebido = body
          return { value: 'ek_test_mock_123', expires_at: 1234567890, session: { id: 'sess_mock_1' } }
        },
      },
    },
  }
  const resultado = await createRealtimeClientSecret(
    { instructions: 'instruções de teste', model: 'gpt-realtime-teste', expiresAfterSeconds: 300 },
    mock
  )
  assert.equal(resultado.clientSecret, 'ek_test_mock_123')
  assert.equal(resultado.expiresAt, 1234567890)
  assert.equal(resultado.sessionId, 'sess_mock_1')
  assert.ok(corpoRecebido, 'o mock não foi chamado')
  assert.equal((corpoRecebido as any).session.instructions, 'instruções de teste')
  assert.equal((corpoRecebido as any).session.model, 'gpt-realtime-teste')
  assert.equal((corpoRecebido as any).expires_after.seconds, 300)
  assert.equal((corpoRecebido as any).session.type, 'realtime')
})

test('createRealtimeClientSecret SEM client e SEM chave: RealtimeConfigError, ANTES de qualquer rede', async () => {
  const fetchOriginal = globalThis.fetch
  let fetchChamado = false
  ;(globalThis as any).fetch = async (...args: any[]) => {
    fetchChamado = true
    throw new Error('rede não deveria ser chamada neste teste')
  }
  try {
    await comEnv({ OPENAI_REALTIME_API_KEY: undefined, OPENAI_API_KEY: undefined }, async () => {
      await assert.rejects(
        () => createRealtimeClientSecret({ instructions: 'x', model: 'gpt-realtime', expiresAfterSeconds: 60 }),
        RealtimeConfigError
      )
    })
    assert.equal(fetchChamado, false, 'uma chamada de rede foi tentada')
  } finally {
    globalThis.fetch = fetchOriginal
  }
})
