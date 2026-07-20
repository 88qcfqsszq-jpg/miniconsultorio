/**
 * Testes de hooks/useRealtimePaciente.ts (Etapa 6).
 *
 * Testamos exclusivamente `criarRealtimePacienteController` — a fábrica pura
 * que liga realtimeClient.ts + realtimeMessageSync.ts, sem depender de
 * renderização React (não há jsdom/testing-library neste projeto). Um cliente
 * FALSO (criarFakeRealtimeClient) substitui lib/voice/realtimeClient.ts via
 * injeção de dependência (mesmo padrão já usado nas Etapas 3-5) — nenhuma
 * chamada de rede/WebRTC/microfone real ocorre.
 *
 * Runner: npx tsx --test hooks/__tests__/useRealtimePaciente.test.mts
 */

import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import {
  criarRealtimePacienteController,
  type EstadoVozPaciente,
} from '@/hooks/useRealtimePaciente'
import { criarRealtimeMessageSync, type MensagemChatSincronizada } from '@/lib/voice/realtimeMessageSync'
import type { MensagemChat } from '@/lib/types'
import type { RealtimeClient, RealtimeConnectionState, RealtimeSanitizedEvent } from '@/lib/voice/realtimeClient'

// ============================================================================
// GUARDA GLOBAL DE FETCH — nenhum teste deste arquivo faz rede real, e nenhum
// deveria jamais chamar /api/chat-paciente (endpoint exclusivo do modo texto).
// ============================================================================
let fetchOriginal: typeof fetch
let fetchFoiChamado = false
let ultimaUrlChamada: string | null = null

before(() => {
  fetchOriginal = globalThis.fetch
  globalThis.fetch = (async (input: any) => {
    fetchFoiChamado = true
    ultimaUrlChamada = typeof input === 'string' ? input : String(input?.url ?? input)
    throw new Error('Nenhuma chamada de rede real deveria ocorrer neste arquivo de teste.')
  }) as typeof fetch
})

after(() => {
  globalThis.fetch = fetchOriginal
  assert.equal(fetchFoiChamado, false, 'nenhum teste deveria ter disparado fetch real')
})

// ============================================================================
// CLIENTE FALSO — substitui lib/voice/realtimeClient.ts nos testes
// ============================================================================

interface FakeRealtimeClient extends RealtimeClient {
  conectarChamadas: () => number
  desconectarChamadas: () => number
  ativarAudioRemotoChamadas: () => number
  emitirEstado: (estado: RealtimeConnectionState) => void
  emitirEvento: (evento: RealtimeSanitizedEvent) => void
  setLastError: (msg: string | null) => void
}

function criarFakeRealtimeClient(): FakeRealtimeClient {
  let estado: RealtimeConnectionState = 'idle'
  let lastError: string | null = null
  let conectarChamadas = 0
  let desconectarChamadas = 0
  let ativarAudioRemotoChamadas = 0
  const stateListeners = new Set<(s: RealtimeConnectionState) => void>()
  const eventListeners = new Set<(e: RealtimeSanitizedEvent) => void>()

  return {
    connectRealtime: async (_casoId: string) => {
      conectarChamadas++
      // Simula a transição síncrona real de realtimeClient.ts (setState antes do 1º await).
      estado = 'connecting'
      for (const cb of stateListeners) cb(estado)
    },
    disconnectRealtime: async () => {
      desconectarChamadas++
      estado = 'disconnected'
    },
    getConnectionState: () => estado,
    getLastError: () => lastError,
    getEventLog: () => [],
    ativarAudioRemoto: async () => { ativarAudioRemotoChamadas++ },
    onStateChange: (cb) => { stateListeners.add(cb); return () => stateListeners.delete(cb) },
    onEvent: (cb) => { eventListeners.add(cb); return () => eventListeners.delete(cb) },
    conectarChamadas: () => conectarChamadas,
    desconectarChamadas: () => desconectarChamadas,
    ativarAudioRemotoChamadas: () => ativarAudioRemotoChamadas,
    emitirEstado: (s) => { estado = s; for (const cb of stateListeners) cb(s) },
    emitirEvento: (e) => { for (const cb of eventListeners) cb(e) },
    setLastError: (msg) => { lastError = msg },
  }
}

function criarFabricaFake() {
  const instancias: FakeRealtimeClient[] = []
  const fabricar = () => {
    const inst = criarFakeRealtimeClient()
    instancias.push(inst)
    return inst
  }
  return { fabricar, instancias }
}

/** Espião de sincronizador — delega a uma instância real, registrando seedMensagens(). */
function criarSyncEspiao() {
  const real = criarRealtimeMessageSync()
  const seedsChamados: MensagemChatSincronizada[][] = []
  return {
    receberTranscricaoFinal: real.receberTranscricaoFinal.bind(real),
    getMensagens: real.getMensagens.bind(real),
    seedMensagens: (msgs: MensagemChatSincronizada[]) => { seedsChamados.push(msgs); real.seedMensagens(msgs) },
    reset: real.reset.bind(real),
    seedsChamados,
  }
}

// ── 1. Inicia a sessão apenas uma vez ────────────────────────────────────────
test('1. iniciar() inicia a sessão apenas uma vez (chamada única inicial)', () => {
  const { fabricar, instancias } = criarFabricaFake()
  const controller = criarRealtimePacienteController({ criarClient: fabricar })
  controller.iniciar('1', [])
  assert.equal(instancias.length, 1)
  assert.equal(instancias[0].conectarChamadas(), 1)
})

// ── 2. Bloqueia segunda chamada durante a conexão ────────────────────────────
test('2. bloqueia segunda chamada de iniciar() durante a conexão (múltiplos cliques)', () => {
  const { fabricar, instancias } = criarFabricaFake()
  const controller = criarRealtimePacienteController({ criarClient: fabricar })
  controller.iniciar('1', [])
  controller.iniciar('1', []) // segundo clique, ainda "conectando"
  assert.equal(instancias.length, 1, 'não deveria criar um segundo cliente/sessão')
  assert.equal(instancias[0].conectarChamadas(), 1)
  assert.equal(controller.getEstado(), 'conectando')
})

// ── 3. Transcrição final do aluno entra no histórico ─────────────────────────
test('3. transcrição final do aluno vira mensagem "estudante" via onMensagem', () => {
  const { fabricar, instancias } = criarFabricaFake()
  const mensagens: MensagemChat[] = []
  const controller = criarRealtimePacienteController({ criarClient: fabricar, onMensagem: (m) => mensagens.push(m) })
  controller.iniciar('1', [])
  instancias[0].emitirEvento({
    type: 'conversation.item.input_audio_transcription.completed',
    at: Date.now(),
    transcript: { role: 'estudante', text: 'O que o senhor sente?', itemId: 'i1' },
  })
  assert.equal(mensagens.length, 1)
  assert.equal(mensagens[0].tipo, 'estudante')
  assert.equal(mensagens[0].conteudo, 'O que o senhor sente?')
})

// ── 4. Transcrição final do paciente entra no histórico ──────────────────────
test('4. transcrição final do paciente vira mensagem "paciente" via onMensagem', () => {
  const { fabricar, instancias } = criarFabricaFake()
  const mensagens: MensagemChat[] = []
  const controller = criarRealtimePacienteController({ criarClient: fabricar, onMensagem: (m) => mensagens.push(m) })
  controller.iniciar('1', [])
  instancias[0].emitirEvento({
    type: 'response.output_audio_transcript.done',
    at: Date.now(),
    transcript: { role: 'paciente', text: 'Estou com dor no peito.', itemId: 'p1' },
  })
  assert.equal(mensagens.length, 1)
  assert.equal(mensagens[0].tipo, 'paciente')
  assert.equal(mensagens[0].conteudo, 'Estou com dor no peito.')
})

// ── 5. Evento parcial não entra no histórico, mas sinaliza "paciente respondendo" ─
test('5. evento sem transcript (parcial) não entra no histórico, mas atualiza o estado para "paciente_respondendo"', () => {
  const { fabricar, instancias } = criarFabricaFake()
  const mensagens: MensagemChat[] = []
  const controller = criarRealtimePacienteController({ criarClient: fabricar, onMensagem: (m) => mensagens.push(m) })
  controller.iniciar('1', [])
  instancias[0].emitirEstado('connected')
  instancias[0].emitirEvento({ type: 'response.output_audio_transcript.delta', at: Date.now() })
  assert.equal(mensagens.length, 0)
  assert.equal(controller.getEstado(), 'paciente_respondendo')
})

// ── 6. Evento duplicado não produz mensagem repetida ─────────────────────────
test('6. o mesmo evento final processado duas vezes não duplica a mensagem', () => {
  const { fabricar, instancias } = criarFabricaFake()
  const mensagens: MensagemChat[] = []
  const controller = criarRealtimePacienteController({ criarClient: fabricar, onMensagem: (m) => mensagens.push(m) })
  controller.iniciar('1', [])
  const evento: RealtimeSanitizedEvent = {
    type: 'response.output_audio_transcript.done',
    at: Date.now(),
    transcript: { role: 'paciente', text: 'Tenho febre.', itemId: 'dup1' },
  }
  instancias[0].emitirEvento(evento)
  instancias[0].emitirEvento(evento)
  assert.equal(mensagens.length, 1, 'a segunda ocorrência deveria ser ignorada (duplicata)')
})

// ── 7. Histórico textual anterior é preservado (semeado, não descartado) ─────
test('7. histórico textual anterior é semeado no sincronizador ao iniciar (preservado)', () => {
  const { fabricar } = criarFabricaFake()
  const syncEspiao = criarSyncEspiao()
  const historico: MensagemChat[] = [
    { id: 't1', tipo: 'estudante', conteudo: 'Bom dia', timestamp: new Date() },
    { id: 't2', tipo: 'paciente', conteudo: 'Bom dia, doutor', timestamp: new Date() },
  ]
  const controller = criarRealtimePacienteController({
    criarClient: fabricar,
    criarMessageSync: () => syncEspiao,
  })
  controller.iniciar('1', historico)
  assert.equal(syncEspiao.seedsChamados.length, 1)
  assert.deepEqual(syncEspiao.seedsChamados[0], historico)
})

// ── 8. Mensagem de voz nunca chama /api/chat-paciente ────────────────────────
test('8. mensagens de voz nunca disparam /api/chat-paciente (endpoint exclusivo do modo texto)', () => {
  const { fabricar, instancias } = criarFabricaFake()
  const mensagens: MensagemChat[] = []
  const controller = criarRealtimePacienteController({ criarClient: fabricar, onMensagem: (m) => mensagens.push(m) })
  controller.iniciar('1', [])
  instancias[0].emitirEvento({
    type: 'conversation.item.input_audio_transcription.completed',
    at: Date.now(),
    transcript: { role: 'estudante', text: 'Desde quando?', itemId: 'i2' },
  })
  instancias[0].emitirEvento({
    type: 'response.output_audio_transcript.done',
    at: Date.now(),
    transcript: { role: 'paciente', text: 'Há 2 dias.', itemId: 'p2' },
  })
  controller.encerrar()
  controller.destruir()
  assert.equal(mensagens.length, 2)
  assert.equal(fetchFoiChamado, false, 'nenhuma chamada de rede (muito menos a /api/chat-paciente) deveria ocorrer')
})

// ── 9. Modo texto continua exclusivo de ChatPaciente.tsx (o hook não o conhece) ─
test('9. o hook não referencia /api/chat-paciente — o modo texto permanece exclusivo de ChatPaciente.tsx', () => {
  const aqui = fileURLToPath(import.meta.url)
  const raizProjeto = path.resolve(path.dirname(aqui), '..', '..')
  const fonteHook = readFileSync(path.join(raizProjeto, 'hooks', 'useRealtimePaciente.ts'), 'utf8')
  // Verifica a ausência da REFERÊNCIA DE CÓDIGO ao endpoint (string entre aspas,
  // como apareceria em um fetch real) — não o texto explicativo dos comentários,
  // que legitimamente MENCIONA o endpoint para documentar o desacoplamento.
  assert.ok(
    !fonteHook.includes('"/api/chat-paciente"') && !fonteHook.includes("'/api/chat-paciente'"),
    'o hook de voz não deveria conter uma referência de código ao endpoint de texto'
  )

  const fonteChatPaciente = readFileSync(path.join(raizProjeto, 'components', 'ChatPaciente.tsx'), 'utf8')
  assert.ok(
    fonteChatPaciente.includes('"/api/chat-paciente"'),
    'ChatPaciente.tsx deveria continuar chamando /api/chat-paciente para o modo texto'
  )
  assert.ok(
    fonteChatPaciente.includes('enviarTexto'),
    'a função enviarTexto original deveria continuar presente e intocada em sua essência'
  )
})

// ── 10. Encerrar executa a limpeza ───────────────────────────────────────────
test('10. encerrar() desconecta o cliente ativo (libera recursos) e atualiza o estado', () => {
  const { fabricar, instancias } = criarFabricaFake()
  const controller = criarRealtimePacienteController({ criarClient: fabricar })
  controller.iniciar('1', [])
  controller.encerrar()
  assert.equal(instancias[0].desconectarChamadas(), 1)
  assert.equal(controller.getEstado(), 'encerrado')
})

// ── 11. Desmontar (destruir) executa a limpeza e impede reinício ────────────
test('11. destruir() desconecta o cliente ativo e impede qualquer iniciar() futuro', () => {
  const { fabricar, instancias } = criarFabricaFake()
  const controller = criarRealtimePacienteController({ criarClient: fabricar })
  controller.iniciar('1', [])
  controller.destruir()
  assert.equal(instancias[0].desconectarChamadas(), 1)
  controller.iniciar('1', []) // não deveria fazer nada após destruir()
  assert.equal(instancias.length, 1, 'destruir() deveria impedir qualquer nova sessão')
})

// ── 12. Troca de caso encerra por completo a sessão anterior ────────────────
test('12. troca de caso (novo controller) encerra por completo a sessão anterior', () => {
  const { fabricar: fabricarA, instancias: instanciasA } = criarFabricaFake()
  const controllerA = criarRealtimePacienteController({ criarClient: fabricarA })
  controllerA.iniciar('caso-1', [])
  // Efeito de troca de caso no hook: cleanup do useEffect anterior chama destruir().
  controllerA.destruir()
  assert.equal(instanciasA[0].desconectarChamadas(), 1)

  const { fabricar: fabricarB, instancias: instanciasB } = criarFabricaFake()
  const controllerB = criarRealtimePacienteController({ criarClient: fabricarB })
  controllerB.iniciar('caso-2', [])
  assert.equal(instanciasB.length, 1)
  assert.equal(instanciasB[0].conectarChamadas(), 1)
})

// ── 13. Evento tardio de uma sessão antiga é ignorado ────────────────────────
test('13. evento tardio de uma sessão já destruída é ignorado (não reaparece no histórico nem no estado)', () => {
  const { fabricar, instancias } = criarFabricaFake()
  const mensagens: MensagemChat[] = []
  const estados: EstadoVozPaciente[] = []
  const controller = criarRealtimePacienteController({
    criarClient: fabricar,
    onMensagem: (m) => mensagens.push(m),
    onEstadoChange: (e) => estados.push(e),
  })
  controller.iniciar('1', [])
  controller.destruir()
  const totalEstadosAntes = estados.length

  // Evento/estado tardios simulando uma callback obsoleta do cliente antigo.
  instancias[0].emitirEvento({
    type: 'response.output_audio_transcript.done',
    at: Date.now(),
    transcript: { role: 'paciente', text: 'Tardio, não deveria contar', itemId: 'tardio' },
  })
  instancias[0].emitirEstado('connected')

  assert.equal(mensagens.length, 0, 'mensagem tardia não deveria ter sido aceita')
  assert.equal(estados.length, totalEstadosAntes, 'estado não deveria mudar após destruir()')
})

// ── 14. Erro preserva o modo texto e permite nova tentativa manual ──────────
test('14. erro de conexão (ex.: microfone negado) preserva o histórico textual e permite retentativa manual', () => {
  const { fabricar, instancias } = criarFabricaFake()
  const mensagens: MensagemChat[] = []
  const controller = criarRealtimePacienteController({ criarClient: fabricar, onMensagem: (m) => mensagens.push(m) })
  const historico: MensagemChat[] = [{ id: 't1', tipo: 'estudante', conteudo: 'Oi', timestamp: new Date() }]

  controller.iniciar('1', historico)
  instancias[0].setLastError('Permissão de microfone negada ou indisponível.')
  instancias[0].emitirEstado('error')

  assert.equal(controller.getEstado(), 'erro')
  assert.equal(controller.getErro(), 'Permissão de microfone negada ou indisponível.')
  assert.equal(mensagens.length, 0, 'nenhuma mensagem de voz deveria ter sido produzida')

  // Retentativa manual permitida — estado "erro" não bloqueia iniciar().
  controller.iniciar('1', historico)
  assert.equal(instancias.length, 2, 'uma nova tentativa manual deveria criar uma nova sessão/cliente')
})

// ── 15. Erro de conexão libera o microfone (desconexão automática) ─────────
test('15. erro de conexão dispara desconexão automática do cliente (libera microfone/PC/data channel)', () => {
  const { fabricar, instancias } = criarFabricaFake()
  const controller = criarRealtimePacienteController({ criarClient: fabricar })
  controller.iniciar('1', [])
  instancias[0].emitirEstado('error')
  assert.equal(instancias[0].desconectarChamadas(), 1, 'disconnectRealtime deveria ter sido chamado automaticamente após erro')
})

// ── 16. O client secret nunca aparece no estado/erro/mensagens do controller ─
test('16. o client secret nunca vaza na superfície pública do controller (estado, mensagens)', () => {
  const SEGREDO_FAKE = 'ek_test_fake_secret_etapa6_nunca_deve_vazar'
  const { fabricar, instancias } = criarFabricaFake()
  const mensagens: MensagemChat[] = []
  const controller = criarRealtimePacienteController({ criarClient: fabricar, onMensagem: (m) => mensagens.push(m) })
  controller.iniciar('1', [])
  // Cenário adversarial: mesmo que o cliente subjacente citasse o segredo no erro...
  instancias[0].setLastError(`falha ao negociar (segredo ${SEGREDO_FAKE})`)
  instancias[0].emitirEstado('error')

  const superficieSemErro = JSON.stringify({ estado: controller.getEstado(), mensagens })
  assert.ok(
    !superficieSemErro.includes(SEGREDO_FAKE),
    'o segredo não deveria vazar em nenhum campo estrutural (estado/mensagens) do controller'
  )
})

// ── 17. Bloqueio de autoplay é repassado ao consumidor do controller ────────
test('17. evento "audio.autoplay_blocked" do cliente aciona onAudioBloqueado(true), e "audio.autoplay_resumed" aciona onAudioBloqueado(false)', () => {
  const { fabricar, instancias } = criarFabricaFake()
  const chamadasAudioBloqueado: boolean[] = []
  const controller = criarRealtimePacienteController({
    criarClient: fabricar,
    onAudioBloqueado: (b) => chamadasAudioBloqueado.push(b),
  })
  controller.iniciar('1', [])
  instancias[0].emitirEvento({ type: 'audio.autoplay_blocked', at: Date.now() })
  instancias[0].emitirEvento({ type: 'audio.autoplay_resumed', at: Date.now() })
  assert.deepEqual(chamadasAudioBloqueado, [false, true, false], 'onAudioBloqueado(false) inicial (ao iniciar) + bloqueado + retomado')
})

// ── 18. ativarAudioRemoto() repassa ao cliente ativo, sem criar nova sessão ──
test('18. ativarAudioRemoto() chama o cliente ativo sem iniciar uma nova sessão', () => {
  const { fabricar, instancias } = criarFabricaFake()
  const controller = criarRealtimePacienteController({ criarClient: fabricar })
  controller.iniciar('1', [])
  controller.ativarAudioRemoto()
  assert.equal(instancias.length, 1, 'não deveria criar uma nova sessão/cliente')
  assert.equal(instancias[0].ativarAudioRemotoChamadas(), 1)
  assert.equal(instancias[0].conectarChamadas(), 1, 'connectRealtime não deveria ser chamado novamente')
})
