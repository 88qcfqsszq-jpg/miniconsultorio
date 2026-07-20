/**
 * Testes de lib/voice/realtimeClient.ts (Etapa 4 — prova técnica WebRTC).
 *
 * Todas as dependências de rede/navegador são MOCKADAS por injeção de
 * dependência (fetchSessao, criarPeerConnection, obterMicrofone, conectarWebRTC)
 * — nenhum teste depende de RTCPeerConnection/getUserMedia reais (indisponíveis
 * em Node) nem de rede real. Um guard global sobre `globalThis.fetch` garante
 * que nenhuma chamada de rede real é tentada durante a suíte (item 17).
 *
 * Runner: npx tsx --test lib/voice/__tests__/realtimeClient.test.mts
 */

import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'

import { criarRealtimeClient, type RealtimeConnectionState } from '@/lib/voice/realtimeClient'

// ── Guard global de rede (nenhuma chamada real à OpenAI) ─────────────────────
let fetchOriginal: typeof globalThis.fetch
let fetchFoiChamado = false
before(() => {
  fetchOriginal = globalThis.fetch
  ;(globalThis as any).fetch = async (...args: any[]) => {
    fetchFoiChamado = true
    throw new Error('[GUARD] chamada de rede real detectada durante os testes do realtimeClient')
  }
})
after(() => {
  globalThis.fetch = fetchOriginal
  assert.equal(fetchFoiChamado, false, 'ao menos uma chamada de rede real foi tentada durante a suíte')
})

// ── Mocks reutilizáveis ───────────────────────────────────────────────────────

const SECRET_FAKE = 'ek_test_fake_secret_NUNCA_deve_vazar'

function respostaFake(status: number, corpo: any): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => corpo,
  } as unknown as Response
}

/** Mock de fetch para /api/realtime/session — sucesso, capturando o corpo enviado. */
function mockFetchSucesso(captura?: { chamadas: Array<{ url: string; body: string }> }) {
  return async (url: string, init?: RequestInit) => {
    captura?.chamadas.push({ url, body: String(init?.body ?? '') })
    return respostaFake(200, {
      clientSecret: SECRET_FAKE,
      expiresAt: 1999999999,
      sessionId: 'sess_teste',
      profile: { voiceId: 'adult-male', speakerRole: 'patient', ageGroup: 'adult' },
    })
  }
}

function mockFetchErro(status: number) {
  return async () => respostaFake(status, { error: 'recurso não habilitado (mensagem sanitizada do servidor)' })
}

/** PeerConnection falsa — expõe ganchos para os testes inspecionarem/simularem eventos. */
function criarFakePeerConnection() {
  const pc: any = {
    connectionState: 'new',
    _tracks: [] as Array<{ track: any; stream: any }>,
    _dataChannels: [] as any[],
    _closed: false,
    addTrack(track: any, stream: any) { this._tracks.push({ track, stream }) },
    createDataChannel(label: string) {
      const dc: any = {
        label,
        onopen: null as null | (() => void),
        onclose: null as null | (() => void),
        onerror: null as null | (() => void),
        onmessage: null as null | ((ev: MessageEvent) => void),
        _closed: false,
        close() { this._closed = true; this.onclose?.() },
      }
      this._dataChannels.push(dc)
      return dc
    },
    async createOffer() { return { type: 'offer', sdp: 'FAKE_OFFER_SDP' } },
    async setLocalDescription(_desc: any) { /* no-op */ },
    _remoteDescription: null as any,
    async setRemoteDescription(desc: any) { this._remoteDescription = desc },
    close() { this._closed = true; this.connectionState = 'closed' },
    onconnectionstatechange: null as null | (() => void),
    ontrack: null as null | ((ev: any) => void),
  }
  return pc
}

/** MediaStream falsa — uma única faixa de áudio "parável". */
function criarFakeMediaStream() {
  const track: any = { kind: 'audio', stopped: false, stop() { this.stopped = true } }
  return { getTracks: () => [track], _track: track }
}

function esperarMicro(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

// ── 1. Estado inicial ──────────────────────────────────────────────────────────
test('1. estado inicial é "idle"', () => {
  const cliente = criarRealtimeClient()
  assert.equal(cliente.getConnectionState(), 'idle')
  assert.equal(cliente.getLastError(), null)
  assert.deepEqual(cliente.getEventLog(), [])
})

// ── 2. Solicitação do segredo ──────────────────────────────────────────────────
test('2. connectRealtime solicita o segredo em /api/realtime/session', async () => {
  const captura = { chamadas: [] as Array<{ url: string; body: string }> }
  const pcFake = criarFakePeerConnection()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso(captura) as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
  })
  await cliente.connectRealtime('1')
  assert.equal(captura.chamadas.length, 1)
  assert.equal(captura.chamadas[0].url, '/api/realtime/session')
})

// ── 3. Falha do endpoint ───────────────────────────────────────────────────────
test('3. falha do endpoint (403) → estado "error", sem mic/peerconnection', async () => {
  let micChamado = false
  let pcCriado = false
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchErro(403) as any,
    criarPeerConnection: () => { pcCriado = true; return criarFakePeerConnection() },
    obterMicrofone: async () => { micChamado = true; return criarFakeMediaStream() as any },
  })
  await cliente.connectRealtime('1')
  assert.equal(cliente.getConnectionState(), 'error')
  assert.ok(cliente.getLastError())
  assert.equal(micChamado, false, 'microfone não deveria ter sido solicitado')
  assert.equal(pcCriado, false, 'peer connection não deveria ter sido criada')
})

// ── 4. Criação da peer connection ─────────────────────────────────────────────
test('4. peer connection é criada exatamente uma vez em conexão bem-sucedida', async () => {
  let vezesCriada = 0
  const pcFake = criarFakePeerConnection()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => { vezesCriada++; return pcFake },
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
  })
  await cliente.connectRealtime('1')
  assert.equal(vezesCriada, 1)
})

// ── 5. Microfone somente após ação explícita (ordem: fetch → mic) ────────────
test('5. microfone é solicitado somente APÓS a resposta do servidor', async () => {
  const ordem: string[] = []
  const pcFake = criarFakePeerConnection()
  const cliente = criarRealtimeClient({
    fetchSessao: (async (...args: any[]) => { ordem.push('fetch'); return mockFetchSucesso()(...(args as [any, any])) }) as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => { ordem.push('mic'); return criarFakeMediaStream() as any },
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
  })
  await cliente.connectRealtime('1')
  assert.deepEqual(ordem, ['fetch', 'mic'])
})

// ── 6. Conexão bem-sucedida com mocks ─────────────────────────────────────────
test('6. conexão bem-sucedida termina em "connected" e registra datachannel.open', async () => {
  const pcFake = criarFakePeerConnection()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
  })
  await cliente.connectRealtime('1')
  // Simula o data channel abrindo (evento real disparado pelo navegador nesse ponto).
  pcFake._dataChannels[0]?.onopen?.()
  assert.equal(cliente.getConnectionState(), 'connected')
  const tipos = cliente.getEventLog().map((e) => e.type)
  assert.ok(tipos.includes('datachannel.open'))
})

// ── 7. Transição correta de estados ───────────────────────────────────────────
test('7. sequência de estados é exatamente requesting_secret → connecting → connected', async () => {
  const sequencia: RealtimeConnectionState[] = []
  const pcFake = criarFakePeerConnection()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
  })
  cliente.onStateChange((s) => sequencia.push(s))
  await cliente.connectRealtime('1')
  assert.deepEqual(sequencia, ['requesting_secret', 'connecting', 'connected'])
})

// ── 8–10. Desconexão fecha tracks / data channel / peer connection ──────────
test('8–10. disconnectRealtime fecha tracks, data channel e peer connection', async () => {
  const pcFake = criarFakePeerConnection()
  const micFake = criarFakeMediaStream()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => micFake as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
  })
  await cliente.connectRealtime('1')
  assert.equal(cliente.getConnectionState(), 'connected')

  await cliente.disconnectRealtime()

  assert.equal(micFake._track.stopped, true, 'faixa de áudio não foi parada')
  assert.equal(pcFake._dataChannels[0]._closed, true, 'data channel não foi fechado')
  assert.equal(pcFake._closed, true, 'peer connection não foi fechada')
  assert.equal(cliente.getConnectionState(), 'disconnected')
})

// ── 11. "Desmontagem" executa cleanup ─────────────────────────────────────────
// Nota: não há teste de render de componente React nesta suíte — nenhuma
// biblioteca de teste de componentes (ex.: @testing-library/react) está
// instalada, e instalar dependências não foi autorizado nesta etapa. O efeito
// de cleanup do componente (RealtimeConnectionTest.tsx) chama exatamente
// disconnectRealtime() no unmount — testado aqui diretamente, no nível do
// cliente, que é a unidade real de comportamento a verificar.
test('11. "desmontagem" (chamada direta de disconnectRealtime, como o useEffect de cleanup faz) libera todos os recursos', async () => {
  const pcFake = criarFakePeerConnection()
  const micFake = criarFakeMediaStream()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => micFake as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
  })
  await cliente.connectRealtime('1')
  await cliente.disconnectRealtime() // idêntico ao que o cleanup do useEffect executa
  assert.equal(pcFake._closed, true)
  assert.equal(micFake._track.stopped, true)
  assert.equal(cliente.getConnectionState(), 'disconnected')
})

// ── 12. Segunda conexão simultânea é bloqueada ───────────────────────────────
test('12. segunda chamada de connectRealtime enquanto a primeira está em andamento é rejeitada', async () => {
  let chamadasFetch = 0
  const pcFake = criarFakePeerConnection()
  const cliente = criarRealtimeClient({
    fetchSessao: (async (...args: any[]) => {
      chamadasFetch++
      await esperarMicro()
      return mockFetchSucesso()(...(args as [any, any]))
    }) as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
  })

  const p1 = cliente.connectRealtime('1') // dispara e já avança síncronamente para "requesting_secret"
  assert.equal(cliente.getConnectionState(), 'requesting_secret')
  await assert.rejects(() => cliente.connectRealtime('1'), /Já existe uma conexão em andamento/)
  await p1
  assert.equal(chamadasFetch, 1, 'apenas UMA chamada de fetch deveria ter ocorrido')
})

// ── 13. Segredo não aparece em logs ou interface ─────────────────────────────
test('13. o client secret nunca aparece em console.* nem na superfície pública', async () => {
  const logsCapturados: string[] = []
  const originais = { log: console.log, error: console.error, warn: console.warn, info: console.info }
  for (const m of ['log', 'error', 'warn', 'info'] as const) {
    ;(console as any)[m] = (...args: any[]) => { logsCapturados.push(args.map(String).join(' ')) }
  }
  try {
    const pcFake = criarFakePeerConnection()
    const cliente = criarRealtimeClient({
      fetchSessao: mockFetchSucesso() as any,
      criarPeerConnection: () => pcFake,
      obterMicrofone: async () => criarFakeMediaStream() as any,
      conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
    })
    await cliente.connectRealtime('1')
    await cliente.disconnectRealtime()

    const textoLogs = logsCapturados.join('\n')
    assert.ok(!textoLogs.includes(SECRET_FAKE), 'o segredo vazou em console.*')

    const superficie = JSON.stringify({
      estado: cliente.getConnectionState(),
      erro: cliente.getLastError(),
      eventos: cliente.getEventLog(),
    })
    assert.ok(!superficie.includes(SECRET_FAKE), 'o segredo vazou na superfície pública do cliente')
  } finally {
    console.log = originais.log; console.error = originais.error
    console.warn = originais.warn; console.info = originais.info
  }
})

// ── 14. Payload enviado contém apenas casoId ─────────────────────────────────
test('14. o corpo enviado a /api/realtime/session contém SOMENTE casoId', async () => {
  const captura = { chamadas: [] as Array<{ url: string; body: string }> }
  const pcFake = criarFakePeerConnection()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso(captura) as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
  })
  await cliente.connectRealtime('42')
  const corpo = JSON.parse(captura.chamadas[0].body)
  assert.deepEqual(Object.keys(corpo), ['casoId'])
  assert.equal(corpo.casoId, '42')
})

// ── 15. Eventos recebidos são sanitizados ────────────────────────────────────
test('15. mensagens do data channel são sanitizadas — só {type, at} chega ao consumidor', async () => {
  const pcFake = criarFakePeerConnection()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
  })
  const eventosRecebidos: any[] = []
  cliente.onEvent((e) => eventosRecebidos.push(e))
  await cliente.connectRealtime('1')

  const payloadMalicioso = JSON.stringify({
    type: 'session.updated',
    session: {
      instructions: 'DIAGNÓSTICO (NÃO REVELE): Síndrome Coronariana Aguda — prompt clínico completo aqui',
    },
  })
  pcFake._dataChannels[0].onmessage?.({ data: payloadMalicioso } as MessageEvent)

  const ultimo = eventosRecebidos[eventosRecebidos.length - 1]
  assert.deepEqual(Object.keys(ultimo).sort(), ['at', 'type'])
  assert.equal(ultimo.type, 'session.updated')

  const logJson = JSON.stringify(cliente.getEventLog())
  assert.ok(!logJson.includes('DIAGNÓSTICO'), 'diagnóstico vazou no log de eventos')
  assert.ok(!logJson.includes('Síndrome Coronariana'), 'texto clínico vazou no log de eventos')
  assert.ok(!logJson.includes('prompt clínico completo'), 'prompt completo vazou no log de eventos')
})

// ── 16. Feature flag desligada bloqueia a PoC (via 403 do endpoint) ──────────
test('16. flag desligada (endpoint retorna 403) → PoC não avança para mic/WebRTC', async () => {
  let micChamado = false
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchErro(403) as any,
    obterMicrofone: async () => { micChamado = true; return criarFakeMediaStream() as any },
  })
  await cliente.connectRealtime('1')
  assert.equal(cliente.getConnectionState(), 'error')
  assert.equal(micChamado, false)
})

// ── Sanitização de transcrição final (Etapa 5) ───────────────────────────────
test('evento de transcrição FINAL do aluno popula "transcript" sanitizado (role/text/itemId)', async () => {
  const pcFake = criarFakePeerConnection()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
  })
  const eventos: any[] = []
  cliente.onEvent((e) => eventos.push(e))
  await cliente.connectRealtime('1')

  pcFake._dataChannels[0].onmessage?.({
    data: JSON.stringify({
      type: 'conversation.item.input_audio_transcription.completed',
      item_id: 'item_aluno_1',
      transcript: 'O que o senhor sente?',
    }),
  } as MessageEvent)

  const ultimo = eventos[eventos.length - 1]
  assert.equal(ultimo.type, 'conversation.item.input_audio_transcription.completed')
  assert.deepEqual(ultimo.transcript, { role: 'estudante', text: 'O que o senhor sente?', itemId: 'item_aluno_1' })
})

test('evento de transcrição FINAL do paciente popula "transcript" sanitizado', async () => {
  const pcFake = criarFakePeerConnection()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
  })
  const eventos: any[] = []
  cliente.onEvent((e) => eventos.push(e))
  await cliente.connectRealtime('1')

  pcFake._dataChannels[0].onmessage?.({
    data: JSON.stringify({
      type: 'response.output_audio_transcript.done',
      item_id: 'item_paciente_1',
      response_id: 'resp_1',
      transcript: 'Estou com dor no peito.',
    }),
  } as MessageEvent)

  const ultimo = eventos[eventos.length - 1]
  assert.equal(ultimo.type, 'response.output_audio_transcript.done')
  assert.deepEqual(ultimo.transcript, { role: 'paciente', text: 'Estou com dor no peito.', itemId: 'item_paciente_1' })
})

test('evento PARCIAL (.delta) NÃO popula "transcript" — só type/at', async () => {
  const pcFake = criarFakePeerConnection()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
  })
  const eventos: any[] = []
  cliente.onEvent((e) => eventos.push(e))
  await cliente.connectRealtime('1')

  for (const tipoParcial of ['conversation.item.input_audio_transcription.delta', 'response.output_audio_transcript.delta']) {
    pcFake._dataChannels[0].onmessage?.({
      data: JSON.stringify({ type: tipoParcial, item_id: 'item_x', delta: 'fragmento parcial' }),
    } as MessageEvent)
    const ultimo = eventos[eventos.length - 1]
    assert.equal(ultimo.type, tipoParcial)
    assert.equal(ultimo.transcript, undefined, `evento parcial "${tipoParcial}" não deveria ter transcript`)
    assert.deepEqual(Object.keys(ultimo).sort(), ['at', 'type'])
  }
})

// ── Contrato exato do endpoint WebRTC (conectarWebRTCPadrao, correção de URL) ─
test('conectarWebRTCPadrao (default real, não mockado): POST em /v1/realtime/calls com contrato exato', async () => {
  const fetchDoGuard = globalThis.fetch // stub de guarda instalado pelo before() do arquivo
  let capturado: { url: string; init: any } | null = null
  ;(globalThis as any).fetch = async (url: string, init: any) => {
    capturado = { url, init }
    return { ok: true, status: 200, text: async () => 'FAKE_ANSWER_SDP_REAL' } as unknown as Response
  }

  const pcFake = criarFakePeerConnection()
  pcFake.createOffer = async () => ({ type: 'offer', sdp: 'FAKE_OFFER_SDP_XYZ' })

  try {
    const cliente = criarRealtimeClient({
      fetchSessao: mockFetchSucesso() as any, // secret = SECRET_FAKE (ver constante no topo)
      criarPeerConnection: () => pcFake,
      obterMicrofone: async () => criarFakeMediaStream() as any,
      // SEM conectarWebRTC — usa o default real (conectarWebRTCPadrao), o alvo desta correção.
    })
    await cliente.connectRealtime('1')

    assert.ok(capturado, 'conectarWebRTCPadrao não chamou fetch')
    const { url, init } = capturado as { url: string; init: any }

    assert.equal(url, 'https://api.openai.com/v1/realtime/calls', 'URL deve ser exatamente /v1/realtime/calls')
    assert.equal(init.method, 'POST')
    assert.equal(init.headers.Authorization, `Bearer ${SECRET_FAKE}`)
    assert.equal(init.headers['Content-Type'], 'application/sdp')
    assert.equal(init.body, 'FAKE_OFFER_SDP_XYZ', 'corpo deve ser exatamente offer.sdp')

    assert.deepEqual(pcFake._remoteDescription, { type: 'answer', sdp: 'FAKE_ANSWER_SDP_REAL' })
    assert.equal(cliente.getConnectionState(), 'connected')
  } finally {
    globalThis.fetch = fetchDoGuard // restaura o guard global para os testes seguintes
  }
})

// ── Itens adicionais de tratamento de erro (checklist da etapa) ──────────────
test('microfone negado → estado "error" com mensagem sanitizada (sem stack/DOMException cru)', async () => {
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    obterMicrofone: async () => { throw new Error('NotAllowedError: Permission denied by system') },
  })
  await cliente.connectRealtime('1')
  assert.equal(cliente.getConnectionState(), 'error')
  assert.ok(cliente.getLastError())
  assert.ok(!String(cliente.getLastError()).includes('NotAllowedError'), 'detalhe técnico do navegador vazou na mensagem')
})

test('falha na negociação SDP → estado "error" e recursos liberados (pc fechada, mic parado)', async () => {
  const pcFake = criarFakePeerConnection()
  const micFake = criarFakeMediaStream()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => micFake as any,
    conectarWebRTC: async () => { throw new Error('Falha na negociação WebRTC (status 500).') },
  })
  await cliente.connectRealtime('1')
  assert.equal(cliente.getConnectionState(), 'error')
  assert.equal(pcFake._closed, true)
  assert.equal(micFake._track.stopped, true)
})

test('peer connection encerrada inesperadamente após conectada → estado "error"', async () => {
  const pcFake = criarFakePeerConnection()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
  })
  await cliente.connectRealtime('1')
  assert.equal(cliente.getConnectionState(), 'connected')

  pcFake.connectionState = 'failed'
  pcFake.onconnectionstatechange?.()

  assert.equal(cliente.getConnectionState(), 'error')
  assert.ok(cliente.getLastError())
})

test('desmontagem DURANTE a conexão (disconnect chamado enquanto connect ainda está em andamento) não corrompe o estado', async () => {
  const controle: { resolver: (() => void) | null } = { resolver: null }
  const fetchControlado = () => new Promise<Response>((resolve) => {
    controle.resolver = () => resolve(respostaFake(200, {
      clientSecret: SECRET_FAKE, expiresAt: 1999999999, sessionId: 's1',
      profile: { voiceId: 'adult-male', speakerRole: 'patient', ageGroup: 'adult' },
    }))
  })
  const pcFake = criarFakePeerConnection()
  let pcCriadaApos = false
  const cliente = criarRealtimeClient({
    fetchSessao: fetchControlado as any,
    criarPeerConnection: () => { pcCriadaApos = true; return pcFake },
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
  })

  const p1 = cliente.connectRealtime('1')
  assert.equal(cliente.getConnectionState(), 'requesting_secret')

  // "Desmonta" enquanto a solicitação do segredo ainda está pendente.
  await cliente.disconnectRealtime()
  assert.equal(cliente.getConnectionState(), 'disconnected')

  // Só agora o fetch da tentativa cancelada resolve — não deve reviver a conexão.
  controle.resolver?.()
  await p1
  await esperarMicro()

  assert.equal(cliente.getConnectionState(), 'disconnected', 'a tentativa obsoleta não deveria ter alterado o estado')
  assert.equal(pcCriadaApos, false, 'a tentativa cancelada não deveria ter criado peer connection')
})

// ── 17. Nenhuma chamada real à OpenAI (garantido pelo guard global no topo) ──
// (assert final no hook after())

// ── Sanidade de tipos/erros: casoId inválido é responsabilidade do endpoint ──
// (o cliente apenas repassa; a validação de formato já é coberta pelos testes do endpoint, Etapa 3)

// ============================================================================
// REPRODUÇÃO DO ÁUDIO REMOTO (correção: pc.ontrack nunca alimentava um sink real)
// ============================================================================

/** "Sink" de áudio falso — expõe contadores/estado para os testes inspecionarem. */
function criarFakeAudioSink() {
  return {
    autoplay: false,
    playsInline: false,
    muted: true,
    volume: 0,
    srcObject: null as any,
    _playChamadas: 0,
    _pauseChamadas: 0,
    _playDeveRejeitar: false,
    play(): Promise<void> {
      this._playChamadas++
      if (this._playDeveRejeitar) {
        return Promise.reject(new Error("NotAllowedError: play() failed because the user didn't interact with the document first."))
      }
      return Promise.resolve()
    },
    pause() { this._pauseChamadas++ },
  }
}

test('áudio 1. pc.ontrack associa event.streams[0] ao srcObject do sink de áudio', async () => {
  const pcFake = criarFakePeerConnection()
  const sinkFake = criarFakeAudioSink()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
    criarElementoAudio: () => sinkFake as any,
  })
  await cliente.connectRealtime('1')

  const streamRemotoFake = { _marca: 'stream-remoto' } as any
  pcFake.ontrack?.({ streams: [streamRemotoFake], track: { kind: 'audio' } } as any)
  await esperarMicro()

  assert.equal(sinkFake.srcObject, streamRemotoFake)
})

test('áudio 2. fallback com event.track quando event.streams[0] está ausente', async () => {
  const pcFake = criarFakePeerConnection()
  const sinkFake = criarFakeAudioSink()
  const streamDeFallback = { _marca: 'stream-via-fallback' } as any
  const trackFake = { kind: 'audio' } as any
  let trackRecebidaNoFallback: any = null
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
    criarElementoAudio: () => sinkFake as any,
    criarMediaStreamDeTrack: (track: any) => { trackRecebidaNoFallback = track; return streamDeFallback },
  })
  await cliente.connectRealtime('1')

  pcFake.ontrack?.({ streams: [], track: trackFake } as any)
  await esperarMicro()

  assert.equal(sinkFake.srcObject, streamDeFallback, 'deveria ter usado o MediaStream construído a partir de event.track')
  assert.equal(trackRecebidaNoFallback, trackFake)
})

test('áudio 3. o sink nunca fica mutado (muted=false)', async () => {
  const pcFake = criarFakePeerConnection()
  const sinkFake = criarFakeAudioSink()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
    criarElementoAudio: () => sinkFake as any,
  })
  await cliente.connectRealtime('1')
  assert.equal(sinkFake.muted, false)
})

test('áudio 4. o volume do sink é definido como 1', async () => {
  const pcFake = criarFakePeerConnection()
  const sinkFake = criarFakeAudioSink()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
    criarElementoAudio: () => sinkFake as any,
  })
  await cliente.connectRealtime('1')
  assert.equal(sinkFake.volume, 1)
})

test('áudio 5. autoplay e playsInline são ativados no sink', async () => {
  const pcFake = criarFakePeerConnection()
  const sinkFake = criarFakeAudioSink()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
    criarElementoAudio: () => sinkFake as any,
  })
  await cliente.connectRealtime('1')
  assert.equal(sinkFake.autoplay, true)
  assert.equal(sinkFake.playsInline, true)
})

test('áudio 6. play() é chamado após o stream remoto ser associado', async () => {
  const pcFake = criarFakePeerConnection()
  const sinkFake = criarFakeAudioSink()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
    criarElementoAudio: () => sinkFake as any,
  })
  await cliente.connectRealtime('1')
  pcFake.ontrack?.({ streams: [{ _marca: 's' }], track: { kind: 'audio' } } as any)
  await esperarMicro()
  assert.equal(sinkFake._playChamadas, 1)
})

test('áudio 7. rejeição de play() (autoplay bloqueado) não derruba a conexão', async () => {
  const pcFake = criarFakePeerConnection()
  const sinkFake = criarFakeAudioSink()
  sinkFake._playDeveRejeitar = true
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
    criarElementoAudio: () => sinkFake as any,
  })
  await cliente.connectRealtime('1')
  pcFake.ontrack?.({ streams: [{ _marca: 's' }], track: { kind: 'audio' } } as any)
  await esperarMicro()
  assert.equal(cliente.getConnectionState(), 'connected', 'a sessão deveria continuar ativa mesmo com autoplay bloqueado')
})

test('áudio 8. bloqueio de autoplay gera um evento sanitizado ("audio.autoplay_blocked")', async () => {
  const pcFake = criarFakePeerConnection()
  const sinkFake = criarFakeAudioSink()
  sinkFake._playDeveRejeitar = true
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
    criarElementoAudio: () => sinkFake as any,
  })
  const eventos: any[] = []
  cliente.onEvent((e) => eventos.push(e))
  await cliente.connectRealtime('1')
  pcFake.ontrack?.({ streams: [{ _marca: 's' }], track: { kind: 'audio' } } as any)
  await esperarMicro()

  const ultimo = eventos[eventos.length - 1]
  assert.equal(ultimo.type, 'audio.autoplay_blocked')
  assert.deepEqual(Object.keys(ultimo).sort(), ['at', 'type'], 'o evento de bloqueio não deveria carregar nenhum dado além de type/at')
})

test('áudio 9. o cleanup (disconnectRealtime) chama pause() no sink de áudio', async () => {
  const pcFake = criarFakePeerConnection()
  const sinkFake = criarFakeAudioSink()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
    criarElementoAudio: () => sinkFake as any,
  })
  await cliente.connectRealtime('1')
  await cliente.disconnectRealtime()
  assert.equal(sinkFake._pauseChamadas, 1)
})

test('áudio 10. o cleanup (disconnectRealtime) remove o srcObject do sink de áudio', async () => {
  const pcFake = criarFakePeerConnection()
  const sinkFake = criarFakeAudioSink()
  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcFake,
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
    criarElementoAudio: () => sinkFake as any,
  })
  await cliente.connectRealtime('1')
  pcFake.ontrack?.({ streams: [{ _marca: 's' }], track: { kind: 'audio' } } as any)
  await esperarMicro()
  assert.notEqual(sinkFake.srcObject, null)

  await cliente.disconnectRealtime()
  assert.equal(sinkFake.srcObject, null)
})

test('áudio 11. a sessão seguinte (mesmo cliente) cria um elemento de áudio novo e limpo (nunca reaproveita o anterior)', async () => {
  const sinksCriados: ReturnType<typeof criarFakeAudioSink>[] = []
  const fabricarSink = () => { const s = criarFakeAudioSink(); sinksCriados.push(s); return s }
  const pcsCriadas = [criarFakePeerConnection(), criarFakePeerConnection()]
  let indicePc = 0

  const cliente = criarRealtimeClient({
    fetchSessao: mockFetchSucesso() as any,
    criarPeerConnection: () => pcsCriadas[indicePc++],
    obterMicrofone: async () => criarFakeMediaStream() as any,
    conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
    criarElementoAudio: fabricarSink,
  })

  // Primeira sessão.
  await cliente.connectRealtime('1')
  pcsCriadas[0].ontrack?.({ streams: [{ _marca: 's1' }], track: { kind: 'audio' } } as any)
  await esperarMicro()
  await cliente.disconnectRealtime()

  assert.equal(sinksCriados.length, 1)
  const primeiroSink = sinksCriados[0]
  assert.equal(primeiroSink.srcObject, null, 'o primeiro sink deveria ter sido limpo ao desconectar')

  // Segunda sessão, no MESMO cliente.
  await cliente.connectRealtime('1')
  pcsCriadas[1].ontrack?.({ streams: [{ _marca: 's2' }], track: { kind: 'audio' } } as any)
  await esperarMicro()

  assert.equal(sinksCriados.length, 2, 'uma segunda sessão deveria criar um segundo sink, nunca reaproveitar o primeiro')
  assert.equal(primeiroSink.srcObject, null, 'o primeiro sink não deveria ser afetado pela segunda sessão')
  assert.equal((sinksCriados[1].srcObject as any)._marca, 's2')
})

test('áudio 12. nenhum áudio, blob ou segredo é persistido (localStorage/sessionStorage) pelo cliente', async () => {
  const temLocalStorage = typeof (globalThis as any).localStorage !== 'undefined'
  const temSessionStorage = typeof (globalThis as any).sessionStorage !== 'undefined'
  const chamadasStorage: string[] = []
  const originalLocalSetItem = temLocalStorage ? (globalThis as any).localStorage.setItem : null
  const originalSessionSetItem = temSessionStorage ? (globalThis as any).sessionStorage.setItem : null
  if (temLocalStorage) {
    ;(globalThis as any).localStorage.setItem = (...args: any[]) => { chamadasStorage.push('local:' + args[0]) }
  }
  if (temSessionStorage) {
    ;(globalThis as any).sessionStorage.setItem = (...args: any[]) => { chamadasStorage.push('session:' + args[0]) }
  }

  try {
    const pcFake = criarFakePeerConnection()
    const sinkFake = criarFakeAudioSink()
    const cliente = criarRealtimeClient({
      fetchSessao: mockFetchSucesso() as any,
      criarPeerConnection: () => pcFake,
      obterMicrofone: async () => criarFakeMediaStream() as any,
      conectarWebRTC: async () => 'FAKE_ANSWER_SDP',
      criarElementoAudio: () => sinkFake as any,
    })
    await cliente.connectRealtime('1')
    pcFake.ontrack?.({ streams: [{ _marca: 's' }], track: { kind: 'audio' } } as any)
    await esperarMicro()
    await cliente.disconnectRealtime()

    assert.deepEqual(chamadasStorage, [], 'nenhuma chamada a localStorage/sessionStorage deveria ter ocorrido')

    const superficie = JSON.stringify({
      estado: cliente.getConnectionState(),
      erro: cliente.getLastError(),
      eventos: cliente.getEventLog(),
    })
    assert.ok(!superficie.includes(SECRET_FAKE), 'o segredo não deveria vazar na superfície pública')
    assert.ok(!superficie.includes('_marca'), 'nenhum dado do stream/áudio deveria vazar na superfície pública')
  } finally {
    if (temLocalStorage) (globalThis as any).localStorage.setItem = originalLocalSetItem
    if (temSessionStorage) (globalThis as any).sessionStorage.setItem = originalSessionSetItem
  }
})
