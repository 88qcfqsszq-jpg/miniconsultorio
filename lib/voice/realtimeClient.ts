/**
 * Cliente Realtime — PROVA TÉCNICA de conexão WebRTC (Etapa 4).
 *
 * Camada isolada, sem React/DOM de página — apenas WebRTC/Fetch do navegador.
 * Não integra com ChatPaciente, não sincroniza com mensagens[], não persiste
 * transcrição. Usada apenas pela página técnica /realtime-test.
 *
 * Fluxo: connectRealtime(casoId) → POST /api/realtime/session (SOMENTE casoId)
 * → client secret efêmero (mantido apenas em memória, nunca logado/persistido)
 * → RTCPeerConnection + data channel "oai-events" → oferta/resposta SDP → conectado.
 *
 * CONTRATO DE CONEXÃO WEBRTC COM A OPENAI: este ambiente não tem acesso à
 * internet para reconfirmar a documentação vigente no momento da implementação.
 * O contrato usado (POST do SDP-offer para o endpoint Realtime com
 * `Authorization: Bearer <clientSecret>` e `Content-Type: application/sdp`,
 * recebendo o SDP-answer no corpo da resposta) é o formato estável e amplamente
 * documentado historicamente para conexões WebRTC com client secrets efêmeros.
 * Está ISOLADO em uma única função (`conectarWebRTCPadrao`) — se a OpenAI tiver
 * migrado o endpoint/contrato, ajuste SOMENTE essa função.
 *
 * O modelo NUNCA é enviado pelo navegador: já está associado ao client secret
 * no servidor (Etapa 3), então a conexão WebRTC usa somente o secret como Bearer.
 */

// ============================================================================
// TIPOS
// ============================================================================

export type RealtimeConnectionState =
  | "idle"
  | "requesting_secret"
  | "connecting"
  | "connected"
  | "disconnecting"
  | "disconnected"
  | "error";

/**
 * Evento sanitizado — SOMENTE o tipo do evento e o instante. Nunca conteúdo,
 * EXCETO o campo opcional `transcript` (Etapa 5), presente unicamente nos dois
 * eventos de TRANSCRIÇÃO FINAL (aluno ou paciente) — nunca em transcrições
 * parciais (`.delta`) nem em qualquer outro tipo de evento (session.updated,
 * error etc.), que continuam expondo somente {type, at}.
 */
export interface RealtimeSanitizedEvent {
  type: string;
  at: number;
  transcript?: {
    role: "estudante" | "paciente";
    text: string;
    itemId: string;
  };
}

/** Tipos de evento de transcrição FINAL (ver contrato oficial no SDK `openai`). */
const TIPO_TRANSCRICAO_ALUNO = "conversation.item.input_audio_transcription.completed";
const TIPO_TRANSCRICAO_PACIENTE = "response.output_audio_transcript.done";
/** Evento parcial da fala do paciente — usado aqui só para medir "1º evento da resposta" (latência local). */
const TIPO_RESPOSTA_PACIENTE_PARCIAL = "response.output_audio_transcript.delta";

// ============================================================================
// FASE 4D.3 — GATE MANUAL (turnGuardMode:"manual") conectado ao cliente
// ============================================================================

/**
 * Espelha `TurnGuardMode` de lib/voice/realtimeTurnGuardConfig.ts (não
 * importado aqui para não acoplar este módulo cliente a um módulo server-only
 * — o valor chega apenas como string no corpo JSON de /api/realtime/session).
 */
export type RealtimeTurnGuardMode = "disabled" | "manual";

interface HistoricoItemManual {
  role: "estudante" | "paciente";
  content: string;
}

/**
 * Instructions fixas para fala não inteligível OU falha fechada do endpoint —
 * o mesmo texto em ambos os casos, por design (o aluno não deve perceber
 * diferença entre "não entendi o som" e "o Turn Guard falhou").
 */
const INSTRUCTIONS_NAO_ENTENDI =
  'Diga exatamente: Desculpe, não entendi. Pode repetir a pergunta?\nNão acrescente nenhuma outra informação.';

/** Timeout padrão da chamada a /api/realtime/turn-guard — configurável só para testes (ver RealtimeClientOptions). */
const TURN_GUARD_TIMEOUT_MS_PADRAO = 6000;

/** Máximo de itens de histórico local enviados como `recentHistory` — curto e seguro, nunca a conversa inteira. */
const HISTORICO_MANUAL_MAX_ITENS = 12;

/**
 * Termos que, sozinhos, indicam anotação de ruído/interjeição não linguística
 * (o próprio provedor de transcrição às vezes emite esses tokens para áudio
 * sem fala real: pigarro, tosse, respiração, silêncio, música de fundo...).
 */
const INTERJEICOES_NAO_LINGUISTICAS = new Set([
  "hmm", "hum", "humm", "ah", "ahn", "hã", "uh", "uhm", "eh", "ééé", "oh", "ihh", "hmpf",
]);

/**
 * Decide se uma transcrição final representa uma fala inteligível (pergunta
 * real) ou apenas ruído/som isolado/interjeição/anotação — função PURA, sem
 * rede, exportada para teste direto.
 */
export function ehFalaInteligivel(transcript: string): boolean {
  const normalizado = transcript.trim();
  if (!normalizado) return false;
  // Anotações de ruído entre parênteses/colchetes, ex.: "(tosse)", "[ruído]".
  if (/^[([].*[)\]]$/.test(normalizado)) return false;
  const somenteLetras = normalizado.toLowerCase().replace(/[^\p{L}]/gu, "");
  if (somenteLetras.length < 2) return false; // só pontuação/símbolos ou uma única letra
  const palavras = normalizado.toLowerCase().split(/\s+/).filter(Boolean);
  if (palavras.length === 1) {
    const palavraLimpa = palavras[0].replace(/[^\p{L}]/gu, "");
    if (INTERJEICOES_NAO_LINGUISTICAS.has(palavraLimpa)) return false;
  }
  return true;
}

interface RespostaTurnGuard {
  responseInstructions: string;
}

function ehRespostaTurnGuardValida(valor: unknown): valor is RespostaTurnGuard {
  return (
    !!valor &&
    typeof valor === "object" &&
    typeof (valor as Record<string, unknown>).responseInstructions === "string"
  );
}

interface ResponseCreateClientEvent {
  type: "response.create";
  response?: { instructions: string };
}

/** Envia `response.create` pelo data channel — nunca lança (best-effort, canal pode já estar fechado). */
function enviarResponseCreate(dc: RTCDataChannel, instructions?: string): void {
  const evento: ResponseCreateClientEvent =
    instructions !== undefined ? { type: "response.create", response: { instructions } } : { type: "response.create" };
  try {
    dc.send(JSON.stringify(evento));
  } catch {
    /* canal já fechado — best-effort */
  }
}

/**
 * Superfície mínima de um "elemento de áudio" usada pelo cliente para reprodução
 * remota — um HTMLAudioElement real satisfaz esta interface. Definida à parte
 * (em vez de usar o tipo DOM diretamente) para permitir injeção de um objeto
 * falso nos testes, já que não há jsdom/HTMLAudioElement disponível em node:test.
 */
export interface RealtimeAudioSink {
  autoplay: boolean;
  playsInline?: boolean;
  muted: boolean;
  volume: number;
  srcObject: MediaStream | null;
  play(): Promise<void>;
  pause(): void;
}

export interface RealtimeClientOptions {
  /**
   * Elemento de áudio explícito onde a faixa remota será anexada (opcional).
   * Quando omitido, o cliente cria o seu próprio elemento EM MEMÓRIA (nunca
   * inserido na árvore do DOM) — ver `criarElementoAudioPadrao`.
   */
  audioElement?: HTMLAudioElement | null;
  /** Máximo de eventos mantidos no histórico visual (default 50). */
  maxEventLog?: number;

  // Dependências injetáveis — produção usa os defaults reais; testes injetam mocks
  // (nenhuma chamada de rede real é necessária para testar este módulo).
  fetchSessao?: typeof fetch;
  criarPeerConnection?: () => RTCPeerConnection;
  obterMicrofone?: () => Promise<MediaStream>;
  /** POST do SDP-offer ao provedor; retorna o SDP-answer (texto). */
  conectarWebRTC?: (clientSecret: string, offerSdp: string) => Promise<string>;
  /** Fábrica do "sink" de áudio remoto — testes injetam um objeto falso. */
  criarElementoAudio?: () => RealtimeAudioSink;
  /** Constrói um MediaStream a partir de uma track solta (fallback de `ontrack` sem `event.streams[0]`). */
  criarMediaStreamDeTrack?: (track: MediaStreamTrack) => MediaStream;
  /** POST a /api/realtime/turn-guard (modo manual) — testes injetam um mock; nunca chamado em turnGuardMode:"disabled". */
  fetchTurnGuard?: typeof fetch;
  /** Timeout (ms) da chamada a /api/realtime/turn-guard — configurável só para tornar os testes determinísticos e rápidos. */
  turnGuardTimeoutMs?: number;
}

export interface RealtimeClient {
  connectRealtime(casoId: string): Promise<void>;
  disconnectRealtime(): Promise<void>;
  getConnectionState(): RealtimeConnectionState;
  getLastError(): string | null;
  getEventLog(): RealtimeSanitizedEvent[];
  onStateChange(cb: (state: RealtimeConnectionState) => void): () => void;
  onEvent(cb: (event: RealtimeSanitizedEvent) => void): () => void;
  /**
   * Tenta (re)iniciar a reprodução do áudio remoto já anexado, SEM criar uma
   * nova sessão — usado quando o navegador (tipicamente Safari) bloqueou o
   * autoplay. No-op seguro se não houver sessão ativa.
   */
  ativarAudioRemoto(): Promise<void>;
}

// ============================================================================
// CONEXÃO WEBRTC PADRÃO (isolada — ver nota de contrato no topo do arquivo)
// ============================================================================

const OPENAI_REALTIME_WEBRTC_URL = "https://api.openai.com/v1/realtime/calls";

async function conectarWebRTCPadrao(clientSecret: string, offerSdp: string): Promise<string> {
  const resposta = await fetch(OPENAI_REALTIME_WEBRTC_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clientSecret}`,
      "Content-Type": "application/sdp",
    },
    body: offerSdp,
  });
  if (!resposta.ok) {
    throw new Error(`Falha na negociação WebRTC (status ${resposta.status}).`);
  }
  return await resposta.text();
}

/**
 * Cria o elemento de áudio padrão para reprodução remota — EM MEMÓRIA, nunca
 * inserido no DOM (sem `document.body.appendChild`). Uma referência é mantida
 * viva na closure de `criarRealtimeClient` durante toda a sessão para evitar
 * que o Safari colete o elemento (o que interromperia a reprodução).
 */
function criarElementoAudioPadrao(): RealtimeAudioSink {
  // Ambiente sem suporte a áudio de navegador (ex.: SSR, node:test sem DOM) —
  // devolve um "sink" inofensivo em vez de lançar. Em produção (navegador real,
  // dentro de connectRealtime() disparado por clique do usuário) `Audio` sempre existe.
  if (typeof Audio === "undefined") {
    return {
      autoplay: true,
      playsInline: true,
      muted: false,
      volume: 1,
      srcObject: null,
      play: async () => {},
      pause: () => {},
    };
  }
  const el = new Audio();
  el.autoplay = true;
  (el as unknown as { playsInline?: boolean }).playsInline = true;
  el.muted = false;
  el.volume = 1;
  return el as unknown as RealtimeAudioSink;
}

function criarMediaStreamDeTrackPadrao(track: MediaStreamTrack): MediaStream {
  return new MediaStream([track]);
}

/**
 * Sanitiza uma mensagem do data channel: extrai SOMENTE `type` para qualquer
 * evento, e ADICIONALMENTE `transcript` (texto + item_id do provedor) apenas
 * para os dois eventos de transcrição FINAL — nunca para `.delta` (parcial)
 * nem para nenhum outro tipo. Nenhum outro campo do payload bruto (instructions,
 * diagnóstico, session config, usage, logprobs...) é repassado em hipótese alguma.
 */
function sanitizarEventoDataChannel(raw: unknown): Pick<RealtimeSanitizedEvent, "type" | "transcript"> {
  if (!raw || typeof raw !== "object") return { type: "unknown" };
  const obj = raw as Record<string, unknown>;
  const tipo = typeof obj.type === "string" ? obj.type : "unknown";

  const ehTranscricaoAluno = tipo === TIPO_TRANSCRICAO_ALUNO;
  const ehTranscricaoPaciente = tipo === TIPO_TRANSCRICAO_PACIENTE;
  if (ehTranscricaoAluno || ehTranscricaoPaciente) {
    const texto = typeof obj.transcript === "string" ? obj.transcript : "";
    const itemId = typeof obj.item_id === "string" ? obj.item_id : "";
    if (texto.trim().length > 0) {
      return {
        type: tipo,
        transcript: { role: ehTranscricaoAluno ? "estudante" : "paciente", text: texto, itemId },
      };
    }
  }
  return { type: tipo };
}

// ============================================================================
// FÁBRICA DO CLIENTE
// ============================================================================

export function criarRealtimeClient(options: RealtimeClientOptions = {}): RealtimeClient {
  const maxEventLog = options.maxEventLog ?? 50;
  const fetchSessao = options.fetchSessao ?? fetch;
  const criarPeerConnection =
    options.criarPeerConnection ?? (() => new RTCPeerConnection());
  const obterMicrofone =
    options.obterMicrofone ??
    (() => navigator.mediaDevices.getUserMedia({ audio: true, video: false }));
  const conectarWebRTC = options.conectarWebRTC ?? conectarWebRTCPadrao;
  const criarElementoAudio = options.criarElementoAudio ?? criarElementoAudioPadrao;
  const criarMediaStreamDeTrack = options.criarMediaStreamDeTrack ?? criarMediaStreamDeTrackPadrao;
  const fetchTurnGuard = options.fetchTurnGuard ?? fetch;
  const turnGuardTimeoutMs = options.turnGuardTimeoutMs ?? TURN_GUARD_TIMEOUT_MS_PADRAO;

  let state: RealtimeConnectionState = "idle";
  let lastError: string | null = null;
  let eventLog: RealtimeSanitizedEvent[] = [];
  const stateListeners = new Set<(s: RealtimeConnectionState) => void>();
  const eventListeners = new Set<(e: RealtimeSanitizedEvent) => void>();

  // Recursos da sessão ativa — SOMENTE em memória; nunca persistidos (localStorage/
  // sessionStorage/URL/logs). Liberados por completo ao desconectar.
  let peerConnection: RTCPeerConnection | null = null;
  let dataChannel: RTCDataChannel | null = null;
  let micStream: MediaStream | null = null;
  let clientSecretAtual: string | null = null;
  // Elemento de áudio da sessão ativa — nunca grava/persiste áudio, apenas
  // reproduz a faixa remota ao vivo. Um elemento novo por sessão (nunca reutilizado
  // entre chamadas de connectRealtime, mesmo dentro do mesmo cliente).
  let elementoAudioAtual: RealtimeAudioSink | null = null;

  // Contador de tentativa — permite abortar com segurança um connectRealtime()
  // em andamento quando disconnectRealtime() é chamado (ex.: desmontagem durante
  // a conexão), sem corromper o estado compartilhado com uma tentativa obsoleta.
  let tentativaAtual = 0;

  function setState(novo: RealtimeConnectionState): void {
    state = novo;
    for (const cb of stateListeners) cb(novo);
  }
  // Getter com tipo largo — evita que o narrowing do TS sobre a guarda inicial de
  // connectRealtime (state !== "idle" && ...) persista incorretamente após as
  // várias chamadas a setState() ao longo da função (mutação indireta via closure).
  function obterEstadoAtual(): RealtimeConnectionState {
    return state;
  }

  /** Para a reprodução e solta a referência ao MediaStream — nunca lança. */
  function pararElementoAudio(el: RealtimeAudioSink | null | undefined): void {
    if (!el) return;
    try { el.pause(); } catch { /* best-effort */ }
    try { el.srcObject = null; } catch { /* best-effort */ }
  }

  function emitirEvento(tipo: string, transcript?: RealtimeSanitizedEvent["transcript"]): void {
    const evento: RealtimeSanitizedEvent = {
      type: tipo,
      at: Date.now(),
      ...(transcript ? { transcript } : {}),
    };
    eventLog.push(evento);
    if (eventLog.length > maxEventLog) eventLog.shift();
    for (const cb of eventListeners) cb(evento);
  }

  async function connectRealtime(casoId: string): Promise<void> {
    if (state !== "idle" && state !== "disconnected" && state !== "error") {
      throw new Error("Já existe uma conexão em andamento.");
    }
    const minhaTentativa = ++tentativaAtual;
    const aindaValida = () => minhaTentativa === tentativaAtual;

    // Estado do GATE MANUAL (Fase 4D.3) — escopado a ESTA tentativa/sessão
    // (nunca sobrevive a uma reconexão). Em turnGuardMode:"disabled" (o único
    // caminho em produção hoje), nenhuma destas variáveis é lida — o fluxo
    // direto/automático permanece byte a byte como antes desta fase.
    let turnGuardMode: RealtimeTurnGuardMode = "disabled";
    const historicoManual: HistoricoItemManual[] = [];
    const itemsProcessados = new Set<string>();
    let respostaEmAndamento = false;
    let primeiroTurnoInteligivelConcluido = false;
    let tsTranscricaoFinal: number | null = null;
    let tsResponseCreateEnviado: number | null = null;
    let tsPrimeiroEventoResposta: number | null = null;

    /** Latência local do turno atual — só console.debug, nunca UI, nunca telemetria externa. */
    function registrarLatenciaLocal(): void {
      if (tsTranscricaoFinal === null || tsResponseCreateEnviado === null || tsPrimeiroEventoResposta === null) return;
      console.debug("[realtimeClient] latência do turno manual (ms):", {
        transcricaoParaResponseCreate: tsResponseCreateEnviado - tsTranscricaoFinal,
        responseCreateParaPrimeiroEvento: tsPrimeiroEventoResposta - tsResponseCreateEnviado,
      });
    }

    /** POST /api/realtime/turn-guard com timeout — nunca lança; retorna null em qualquer falha (falha fechada). */
    async function solicitarInstructionsTurnGuard(mensagem: string): Promise<string | null> {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), turnGuardTimeoutMs);
      try {
        const resposta = await fetchTurnGuard("/api/realtime/turn-guard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            casoId,
            mensagem,
            recentHistory: historicoManual.slice(-HISTORICO_MANUAL_MAX_ITENS),
          }),
          signal: controller.signal,
        });
        if (!resposta.ok) return null;
        const json: unknown = await resposta.json();
        if (!ehRespostaTurnGuardValida(json)) return null;
        return json.responseInstructions;
      } catch {
        return null;
      } finally {
        clearTimeout(timeoutId);
      }
    }

    /** Dispara `response.create` e marca o início do turno (bloqueia turnos simultâneos até a resposta concluir). */
    function dispararResponseCreate(dc: RTCDataChannel, instructions?: string): void {
      respostaEmAndamento = true;
      tsResponseCreateEnviado = Date.now();
      tsPrimeiroEventoResposta = null;
      enviarResponseCreate(dc, instructions);
    }

    /** Decide e dispara a resposta para um turno já validado como não duplicado/não simultâneo. */
    async function tratarTurnoManual(transcript: string, dc: RTCDataChannel): Promise<void> {
      if (!aindaValida()) return;

      if (!ehFalaInteligivel(transcript)) {
        // Item 2 (SOM/FALA NÃO INTELIGÍVEL): nunca chama o endpoint.
        dispararResponseCreate(dc, INSTRUCTIONS_NAO_ENTENDI);
        return;
      }

      if (!primeiroTurnoInteligivelConcluido) {
        // PRIMEIRO TURNO INTELIGÍVEL: nunca chama o endpoint; usa as
        // instructions de abertura já configuradas na sessão (sem override).
        primeiroTurnoInteligivelConcluido = true;
        dispararResponseCreate(dc);
        return;
      }

      // TURNOS INTELIGÍVEIS SEGUINTES: consulta o Turn Guard já construído.
      const instructions = await solicitarInstructionsTurnGuard(transcript);
      if (!aindaValida()) return;
      dispararResponseCreate(dc, instructions ?? INSTRUCTIONS_NAO_ENTENDI);
    }

    /** Processa cada evento do data channel relevante ao gate manual (chamado somente quando turnGuardMode:"manual"). */
    function processarEventoManual(payload: unknown, dc: RTCDataChannel): void {
      if (!payload || typeof payload !== "object") return;
      const obj = payload as Record<string, unknown>;
      const tipo = typeof obj.type === "string" ? obj.type : "";

      if (tipo === TIPO_RESPOSTA_PACIENTE_PARCIAL) {
        if (respostaEmAndamento && tsPrimeiroEventoResposta === null) {
          tsPrimeiroEventoResposta = Date.now();
          registrarLatenciaLocal();
        }
        return;
      }

      if (tipo === TIPO_TRANSCRICAO_PACIENTE) {
        const textoPaciente = typeof obj.transcript === "string" ? obj.transcript : "";
        if (textoPaciente.trim()) historicoManual.push({ role: "paciente", content: textoPaciente });
        respostaEmAndamento = false;
        return;
      }

      if (tipo === "response.done" || tipo === "error") {
        respostaEmAndamento = false;
        return;
      }

      if (tipo !== TIPO_TRANSCRICAO_ALUNO) return;

      const itemId = typeof obj.item_id === "string" ? obj.item_id : "";
      const transcript = typeof obj.transcript === "string" ? obj.transcript : "";
      if (!itemId || itemsProcessados.has(itemId)) return; // item 10: evento duplicado do mesmo item
      itemsProcessados.add(itemId);

      if (respostaEmAndamento) return; // item 11: duas respostas simultâneas — este turno é ignorado

      tsTranscricaoFinal = Date.now();
      historicoManual.push({ role: "estudante", content: transcript });
      void tratarTurnoManual(transcript, dc);
    }

    lastError = null;
    setState("requesting_secret");

    // 1) Solicitar o segredo efêmero — payload contém SOMENTE casoId.
    let secret: string;
    try {
      const resposta = await fetchSessao("/api/realtime/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ casoId }),
      });
      if (!aindaValida()) return;
      if (!resposta.ok) {
        throw new Error(`Não foi possível iniciar a sessão (status ${resposta.status}).`);
      }
      const json = await resposta.json();
      if (!aindaValida()) return;
      if (!json || typeof json.clientSecret !== "string" || json.clientSecret.length === 0) {
        throw new Error("Resposta do servidor não contém segredo válido.");
      }
      secret = json.clientSecret;
      turnGuardMode = json.turnGuardMode === "manual" ? "manual" : "disabled";
    } catch (erro) {
      if (!aindaValida()) return;
      lastError = erro instanceof Error ? erro.message : "Falha ao solicitar sessão.";
      setState("error");
      return;
    }

    setState("connecting");

    // 2) Microfone — solicitado somente agora (após a resposta do servidor),
    //    dentro da mesma cadeia iniciada pelo clique explícito do usuário.
    let mic: MediaStream;
    try {
      mic = await obterMicrofone();
      if (!aindaValida()) {
        try { mic.getTracks().forEach((t) => t.stop()); } catch { /* best-effort */ }
        return;
      }
    } catch {
      if (!aindaValida()) return;
      lastError = "Permissão de microfone negada ou indisponível.";
      setState("error");
      return;
    }

    // 3) RTCPeerConnection + data channel + negociação SDP.
    let pc: RTCPeerConnection | undefined;
    // Elemento de áudio desta tentativa — criado cedo (antes da negociação SDP)
    // porque `ontrack` pode disparar assim que `setRemoteDescription` processa a
    // resposta, mesmo antes do ponto de "commit" dos demais recursos abaixo.
    let elementoAudio: RealtimeAudioSink | undefined;
    try {
      pc = criarPeerConnection();
      for (const track of mic.getTracks()) pc.addTrack(track, mic);

      elementoAudio = options.audioElement
        ? (options.audioElement as unknown as RealtimeAudioSink)
        : criarElementoAudio();
      elementoAudio.autoplay = true;
      elementoAudio.muted = false;
      elementoAudio.volume = 1;
      if ("playsInline" in elementoAudio) elementoAudio.playsInline = true;

      pc.ontrack = (ev: RTCTrackEvent) => {
        if (!aindaValida() || !elementoAudio) return;
        const track = ev.track;
        const streamRemoto = ev.streams && ev.streams[0] ? ev.streams[0] : (track ? criarMediaStreamDeTrack(track) : null);
        if (!streamRemoto) return;
        elementoAudio.srcObject = streamRemoto;
        elementoAudio
          .play()
          .then(() => {
            if (aindaValida()) emitirEvento("audio.autoplay_resumed");
          })
          .catch(() => {
            // Bloqueio de autoplay (tipicamente Safari) — a sessão continua ativa
            // (data channel/transcrição seguem funcionando); apenas sinalizamos o
            // bloqueio de forma sanitizada para a UI oferecer uma retentativa manual.
            if (aindaValida()) emitirEvento("audio.autoplay_blocked");
          });
      };

      pc.onconnectionstatechange = () => {
        if (!pc || !aindaValida()) return;
        const cs = pc.connectionState;
        if (cs === "connected") {
          setState("connected");
        } else if (cs === "failed" || cs === "closed") {
          if (obterEstadoAtual() !== "disconnecting" && obterEstadoAtual() !== "disconnected") {
            lastError = "Conexão encerrada inesperadamente.";
            setState("error");
          }
        }
      };

      const dc = pc.createDataChannel("oai-events");
      dc.onopen = () => { if (aindaValida()) emitirEvento("datachannel.open"); };
      dc.onclose = () => { if (aindaValida()) emitirEvento("datachannel.close"); };
      dc.onerror = () => { if (aindaValida()) emitirEvento("datachannel.error"); };
      dc.onmessage = (ev: MessageEvent) => {
        if (!aindaValida()) return;
        let payload: unknown = null;
        try { payload = JSON.parse(ev.data); } catch { payload = null; }
        const sanitizado = sanitizarEventoDataChannel(payload);
        emitirEvento(sanitizado.type, sanitizado.transcript);

        // Fase 4D.3 — gate manual: só processa quando turnGuardMode:"manual"
        // (fluxo direto continua sem nenhum processamento adicional aqui).
        if (turnGuardMode === "manual") {
          processarEventoManual(payload, dc);
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      if (!aindaValida()) { try { pc.close(); } catch {} try { mic.getTracks().forEach((t) => t.stop()); } catch {} pararElementoAudio(elementoAudio); return; }

      const answerSdp = await conectarWebRTC(secret, offer.sdp ?? "");
      if (!aindaValida()) { try { pc.close(); } catch {} try { mic.getTracks().forEach((t) => t.stop()); } catch {} pararElementoAudio(elementoAudio); return; }

      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp } as RTCSessionDescriptionInit);
      if (!aindaValida()) { try { pc.close(); } catch {} try { mic.getTracks().forEach((t) => t.stop()); } catch {} pararElementoAudio(elementoAudio); return; }

      // Só agora, com a tentativa ainda válida, comprometemos os recursos ao estado
      // compartilhado (evita que uma tentativa obsoleta sobrescreva uma desconexão já em curso).
      micStream = mic;
      peerConnection = pc;
      dataChannel = dc;
      clientSecretAtual = secret;
      elementoAudioAtual = elementoAudio;
      if (obterEstadoAtual() !== "connected") setState("connected");
    } catch (erro) {
      if (!aindaValida()) return;
      lastError = erro instanceof Error ? erro.message : "Falha na negociação WebRTC.";
      try { pc?.close(); } catch { /* best-effort */ }
      try { mic.getTracks().forEach((t) => t.stop()); } catch { /* best-effort */ }
      pararElementoAudio(elementoAudio);
      setState("error");
      return;
    }
  }

  async function limparRecursos(): Promise<void> {
    try { dataChannel?.close(); } catch { /* best-effort */ }
    dataChannel = null;
    try { micStream?.getTracks().forEach((t) => t.stop()); } catch { /* best-effort */ }
    micStream = null;
    if (peerConnection) { try { peerConnection.ontrack = null; } catch { /* best-effort */ } }
    try { peerConnection?.close(); } catch { /* best-effort */ }
    peerConnection = null;
    pararElementoAudio(elementoAudioAtual);
    elementoAudioAtual = null;
    // O segredo nunca foi persistido — apenas liberado da memória aqui.
    clientSecretAtual = null;
  }

  async function ativarAudioRemoto(): Promise<void> {
    if (!elementoAudioAtual) return;
    try {
      await elementoAudioAtual.play();
      emitirEvento("audio.autoplay_resumed");
    } catch {
      emitirEvento("audio.autoplay_blocked");
    }
  }

  async function disconnectRealtime(): Promise<void> {
    // Invalida qualquer connectRealtime() em andamento (ex.: desmontagem durante a conexão).
    tentativaAtual++;
    if (state === "idle" || state === "disconnected") return; // idempotente
    setState("disconnecting");
    await limparRecursos();
    emitirEvento("connection.closed");
    setState("disconnected");
  }

  return {
    connectRealtime,
    disconnectRealtime,
    getConnectionState: () => state,
    getLastError: () => lastError,
    getEventLog: () => [...eventLog],
    onStateChange: (cb) => { stateListeners.add(cb); return () => stateListeners.delete(cb); },
    onEvent: (cb) => { eventListeners.add(cb); return () => eventListeners.delete(cb); },
    ativarAudioRemoto,
  };
}
