/**
 * Testes do endpoint app/api/realtime/session/route.ts (Etapa 3).
 *
 * Testa o handler exportado (`handleCriarSessaoRealtime`) diretamente, via
 * NextRequest construído em memória — sem subir servidor Next.js. A chamada
 * real à OpenAI é sempre SUBSTITUÍDA por injeção de dependência
 * (`deps.criarClientSecret`); nenhum teste depende de rede ou credenciais reais.
 *
 * GUARD GLOBAL: um `globalThis.fetch` interceptado falha qualquer teste que
 * tente uma chamada de rede real — prova concreta de que nenhum crédito é
 * consumido nesta suíte (item 12 da entrega).
 *
 * Runner: npx tsx --test app/api/realtime/session/__tests__/route.test.mts
 */

import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'

import { handleCriarSessaoRealtime } from '@/app/api/realtime/session/route'
import { RealtimeConfigError } from '@/lib/voice/createRealtimeClientSecret'
import { casosV2 } from '@/data/casos-v2'

const CASO_ID_VALIDO = '1' // canônico real (adulto) — ver auditoria da Etapa 3
const CASO_ID_INEXISTENTE = '999999'

// ── Guard global de rede (item 12) ───────────────────────────────────────────
let fetchOriginal: typeof globalThis.fetch
let fetchFoiChamado = false
before(() => {
  fetchOriginal = globalThis.fetch
  ;(globalThis as any).fetch = async (...args: any[]) => {
    fetchFoiChamado = true
    throw new Error('[GUARD] chamada de rede real detectada durante os testes do endpoint Realtime')
  }
})
after(() => {
  globalThis.fetch = fetchOriginal
  assert.equal(fetchFoiChamado, false, 'ao menos uma chamada de rede real foi tentada durante a suíte')
})

// ── Ambiente base (flag ligada + modelo configurado) para os testes "felizes" ─
const ENV_BASE = {
  REALTIME_VOICE_ENABLED: 'true',
  OPENAI_REALTIME_MODEL: 'gpt-realtime-teste',
  REALTIME_SESSION_MAX_SECONDS: '300',
}

function aplicarEnv(patch: Record<string, string | undefined>) {
  const originais: Record<string, string | undefined> = {}
  for (const k of Object.keys(patch)) originais[k] = process.env[k]
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) delete process.env[k]
    else process.env[k] = v
  }
  return () => {
    for (const [k, v] of Object.entries(originais)) {
      if (v === undefined) delete process.env[k]
      else process.env[k] = v
    }
  }
}

function requisicao(body?: string, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest('http://localhost:3000/api/realtime/session', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body,
  })
}

/** Mock padrão de criarClientSecret — captura os parâmetros recebidos. */
function mockClientSecret(captura?: { params?: any }) {
  return async (params: any) => {
    if (captura) captura.params = params
    return { clientSecret: 'ek_test_mock_abc', expiresAt: 1999999999, sessionId: 'sess_mock_teste' }
  }
}

// ── 1. Feature flag desligada ─────────────────────────────────────────────────
test('1. feature flag desligada → 403, sem chamar criarClientSecret', async () => {
  const restore = aplicarEnv({ REALTIME_VOICE_ENABLED: undefined })
  try {
    let chamado = false
    const res = await handleCriarSessaoRealtime(requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO })), {
      criarClientSecret: async (p) => { chamado = true; return mockClientSecret()(p) },
    })
    assert.equal(res.status, 403)
    assert.equal(chamado, false)
  } finally { restore() }
})

// ── 2. Corpo ausente ───────────────────────────────────────────────────────────
test('2. corpo ausente → 400', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    const res = await handleCriarSessaoRealtime(requisicao(undefined))
    assert.equal(res.status, 400)
  } finally { restore() }
})

// ── 3. JSON inválido ───────────────────────────────────────────────────────────
test('3. JSON inválido → 400', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    const res = await handleCriarSessaoRealtime(requisicao('{ isso não é json'))
    assert.equal(res.status, 400)
  } finally { restore() }
})

// ── 4. casoId ausente ──────────────────────────────────────────────────────────
test('4. casoId ausente → 400', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    const res = await handleCriarSessaoRealtime(requisicao(JSON.stringify({})))
    assert.equal(res.status, 400)
  } finally { restore() }
})

// ── 5. casoId inválido (formato/tamanho) ─────────────────────────────────────
test('5. casoId em formato inválido → 400', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    for (const invalido of ['../../etc/passwd', 'A B C', '!!!', 'x'.repeat(60), '', 123 as any]) {
      const res = await handleCriarSessaoRealtime(requisicao(JSON.stringify({ casoId: invalido })))
      assert.equal(res.status, 400, `esperava 400 para casoId=${JSON.stringify(invalido)}`)
    }
  } finally { restore() }
})

// ── 6. Caso inexistente ────────────────────────────────────────────────────────
test('6. caso inexistente (formato válido, não encontrado) → 404', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    const res = await handleCriarSessaoRealtime(requisicao(JSON.stringify({ casoId: CASO_ID_INEXISTENTE })))
    assert.equal(res.status, 404)
  } finally { restore() }
})

// ── 7. Caso canônico válido → 200 ─────────────────────────────────────────────
test('7. caso canônico válido → 200 com client secret mockado', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    const res = await handleCriarSessaoRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO })),
      { criarClientSecret: mockClientSecret() }
    )
    assert.equal(res.status, 200)
    const json = await res.json()
    assert.equal(json.clientSecret, 'ek_test_mock_abc')
  } finally { restore() }
})

// ── 8. Instruções construídas no servidor ────────────────────────────────────
test('8. instruções são construídas no servidor a partir do caso (não do corpo)', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    const captura: { params?: any } = {}
    await handleCriarSessaoRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO })),
      { criarClientSecret: mockClientSecret(captura) }
    )
    assert.ok(captura.params?.instructions?.length > 500, 'instructions ausente ou curta demais')
    assert.ok(captura.params.instructions.includes('DIAGNÓSTICO (NÃO REVELE)'), 'instructions não contém a seção clínica esperada')
  } finally { restore() }
})

// ── 9. VoiceProfile derivado no servidor ─────────────────────────────────────
test('9. VoiceProfile é derivado no servidor e refletido na resposta', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    const res = await handleCriarSessaoRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO })),
      { criarClientSecret: mockClientSecret() }
    )
    const json = await res.json()
    assert.ok(json.profile?.voiceId, 'profile.voiceId ausente')
    assert.ok(json.profile?.speakerRole, 'profile.speakerRole ausente')
    assert.ok(json.profile?.ageGroup, 'profile.ageGroup ausente')
  } finally { restore() }
})

// ── 10–13. Cliente não pode sobrescrever instructions/model/voice/diagnóstico ─
test('10. cliente NÃO consegue sobrescrever instructions', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    const captura: { params?: any } = {}
    await handleCriarSessaoRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO, instructions: 'INSTRUCOES_FORJADAS_PELO_CLIENTE' })),
      { criarClientSecret: mockClientSecret(captura) }
    )
    assert.ok(!captura.params.instructions.includes('INSTRUCOES_FORJADAS_PELO_CLIENTE'), 'o cliente conseguiu injetar instructions')
  } finally { restore() }
})

test('11. cliente NÃO consegue sobrescrever model', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    const captura: { params?: any } = {}
    await handleCriarSessaoRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO, model: 'modelo-forjado-pelo-cliente' })),
      { criarClientSecret: mockClientSecret(captura) }
    )
    assert.equal(captura.params.model, 'gpt-realtime-teste', 'o cliente conseguiu escolher o modelo')
  } finally { restore() }
})

test('12. cliente NÃO consegue sobrescrever voice', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    const captura: { params?: any } = {}
    await handleCriarSessaoRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO, voice: 'nova', voiceId: 'adult-female-forjado' })),
      { criarClientSecret: mockClientSecret(captura) }
    )
    // Nenhum campo "voice"/"voiceId" do corpo chega aos parâmetros passados ao criador do secret.
    assert.equal(captura.params.voice, undefined, 'o campo voice do cliente vazou para os parâmetros')
    assert.equal(captura.params.voiceId, undefined, 'o campo voiceId do cliente vazou para os parâmetros')
  } finally { restore() }
})

test('13. cliente NÃO consegue sobrescrever diagnóstico', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    const captura: { params?: any } = {}
    await handleCriarSessaoRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO, diagnostico: 'DIAGNOSTICO_FORJADO_PELO_CLIENTE' })),
      { criarClientSecret: mockClientSecret(captura) }
    )
    assert.ok(!captura.params.instructions.includes('DIAGNOSTICO_FORJADO_PELO_CLIENTE'), 'diagnóstico forjado vazou para instructions')
    assert.ok(captura.params.instructions.includes('DIAGNÓSTICO (NÃO REVELE)'), 'a seção real de diagnóstico oculto deveria continuar presente')
  } finally { restore() }
})

// ── 14–15. Chave/prompt nunca aparecem na resposta ───────────────────────────
test('14. chave permanente nunca aparece na resposta', async () => {
  const restoreEnv = aplicarEnv({ ...ENV_BASE, OPENAI_API_KEY: 'sk-chave-secreta-de-teste-NUNCA-deve-vazar' })
  try {
    const res = await handleCriarSessaoRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO })),
      { criarClientSecret: mockClientSecret() }
    )
    const textoResposta = JSON.stringify(await res.json())
    assert.ok(!textoResposta.includes('sk-chave-secreta-de-teste'), 'a chave vazou na resposta HTTP')
  } finally { restoreEnv() }
})

test('15. prompt clínico completo nunca aparece na resposta', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    const res = await handleCriarSessaoRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO })),
      { criarClientSecret: mockClientSecret() }
    )
    const textoResposta = JSON.stringify(await res.json())
    assert.ok(!textoResposta.includes('DIAGNÓSTICO'), 'o prompt clínico vazou na resposta HTTP')
    assert.ok(!textoResposta.includes('RESPOSTAS PRÉ-PREPARADAS'), 'respostas pré-preparadas vazaram na resposta HTTP')
    // A resposta deve conter SOMENTE as chaves esperadas.
    const json = JSON.parse(textoResposta)
    const chaves = Object.keys(json).sort()
    assert.deepEqual(chaves, ['clientSecret', 'expiresAt', 'profile', 'sessionId'].sort())
  } finally { restore() }
})

// ── 16. Erro do provedor é sanitizado ─────────────────────────────────────────
test('16. erro do provedor é sanitizado (502, sem detalhes internos)', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    const res = await handleCriarSessaoRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO })),
      { criarClientSecret: async () => { throw new Error('stack trace sensível contendo sk-alguma-chave-interna') } }
    )
    assert.equal(res.status, 502)
    const texto = JSON.stringify(await res.json())
    assert.ok(!texto.includes('sk-alguma-chave-interna'), 'detalhe sensível do erro vazou na resposta')
    assert.ok(!texto.toLowerCase().includes('stack'), 'stack trace vazou na resposta')
  } finally { restore() }
})

// ── 17. Ausência de chave/config gera erro controlado ────────────────────────
test('17a. modelo ausente no servidor → 500, sem chamar criarClientSecret', async () => {
  const restore = aplicarEnv({ REALTIME_VOICE_ENABLED: 'true', OPENAI_REALTIME_MODEL: undefined })
  try {
    let chamado = false
    const res = await handleCriarSessaoRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO })),
      { criarClientSecret: async (p) => { chamado = true; return mockClientSecret()(p) } }
    )
    assert.equal(res.status, 500)
    assert.equal(chamado, false, 'não deveria ter chamado criarClientSecret sem modelo configurado')
  } finally { restore() }
})

test('17b. RealtimeConfigError (ex.: chave ausente) → 500 sanitizado', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    const res = await handleCriarSessaoRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO })),
      { criarClientSecret: async () => { throw new RealtimeConfigError('Chave OpenAI ausente no servidor.') } }
    )
    assert.equal(res.status, 500)
    const texto = JSON.stringify(await res.json())
    assert.ok(!texto.includes('Chave OpenAI'), 'detalhe de configuração vazou na resposta')
  } finally { restore() }
})

// ── 18. Resposta de sucesso usa somente o client secret efêmero ─────────────
test('18. resposta de sucesso contém somente o client secret efêmero (não chave permanente)', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    const res = await handleCriarSessaoRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO })),
      { criarClientSecret: mockClientSecret() }
    )
    const json = await res.json()
    assert.equal(json.clientSecret, 'ek_test_mock_abc')
    assert.equal(json.expiresAt, 1999999999)
    assert.equal(json.sessionId, 'sess_mock_teste')
  } finally { restore() }
})

// ── 19. Os 76 casos continuam resolvíveis pelo endpoint ──────────────────────
test('19. todos os IDs canônicos exportados são resolvidos pelo endpoint (200, instructions válidas)', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    const CASOS = casosV2 as unknown as Array<{ id: string }>
    assert.ok(CASOS.length >= 70, `esperado ≥70 casos, encontrado ${CASOS.length}`)
    for (const c of CASOS) {
      const captura: { params?: any } = {}
      const res = await handleCriarSessaoRealtime(
        requisicao(JSON.stringify({ casoId: c.id })),
        { criarClientSecret: mockClientSecret(captura) }
      )
      assert.equal(res.status, 200, `[${c.id}] esperava 200`)
      assert.ok(captura.params?.instructions?.length > 500, `[${c.id}] instructions inválida`)
    }
  } finally { restore() }
})

// ── Verificação de origem (best-effort) ──────────────────────────────────────
test('origem divergente (Origin de terceiro) → 403', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    const res = await handleCriarSessaoRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO }), { origin: 'https://site-malicioso.example' })
    )
    assert.equal(res.status, 403)
  } finally { restore() }
})

test('origem que bate com X-Forwarded-Host (cenário de proxy reverso, ex.: Render) → 200, não bloqueia chamada legítima', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    // Simula um proxy reverso onde o host público real chega via X-Forwarded-Host,
    // divergente do host que a URL construída no teste usa (localhost:3000).
    const res = await handleCriarSessaoRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO }), {
        origin: 'https://mniconsultorio.onrender.com',
        'x-forwarded-host': 'mniconsultorio.onrender.com',
      }),
      { criarClientSecret: mockClientSecret() }
    )
    assert.equal(res.status, 200, 'chamada legítima atrás de proxy não deveria ser bloqueada')
  } finally { restore() }
})

test('Content-Type diferente de application/json → 400', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    const res = await handleCriarSessaoRealtime(
      requisicao(JSON.stringify({ casoId: CASO_ID_VALIDO }), { 'content-type': 'text/plain' })
    )
    assert.equal(res.status, 400)
  } finally { restore() }
})

test('corpo maior que o limite máximo → 400', async () => {
  const restore = aplicarEnv(ENV_BASE)
  try {
    const corpoEnorme = JSON.stringify({ casoId: CASO_ID_VALIDO, lixo: 'x'.repeat(5000) })
    const res = await handleCriarSessaoRealtime(requisicao(corpoEnorme))
    assert.equal(res.status, 400)
  } finally { restore() }
})
