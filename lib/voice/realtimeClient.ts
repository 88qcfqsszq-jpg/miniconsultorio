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

export interface RealtimeClientOptions {
  /** Elemento de áudio onde a faixa remota será anexada (opcional). */
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
}

export interface RealtimeClient {
  connectRealtime(casoId: string): Promise<void>;
  disconnectRealtime(): Promise<void>;
  getConnectionState(): RealtimeConnectionState;
  getLastError(): string | null;
  getEventLog(): RealtimeSanitizedEvent[];
  onStateChange(cb: (state: RealtimeConnectionState) => void): () => void;
  onEvent(cb: (event: RealtimeSanitizedEvent) => void): () => void;
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
    try {
      pc = criarPeerConnection();
      for (const track of mic.getTracks()) pc.addTrack(track, mic);

      pc.ontrack = (ev: RTCTrackEvent) => {
        if (options.audioElement && ev.streams[0]) {
          options.audioElement.srcObject = ev.streams[0];
        }
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
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      if (!aindaValida()) { try { pc.close(); } catch {} try { mic.getTracks().forEach((t) => t.stop()); } catch {} return; }

      const answerSdp = await conectarWebRTC(secret, offer.sdp ?? "");
      if (!aindaValida()) { try { pc.close(); } catch {} try { mic.getTracks().forEach((t) => t.stop()); } catch {} return; }

      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp } as RTCSessionDescriptionInit);
      if (!aindaValida()) { try { pc.close(); } catch {} try { mic.getTracks().forEach((t) => t.stop()); } catch {} return; }

      // Só agora, com a tentativa ainda válida, comprometemos os recursos ao estado
      // compartilhado (evita que uma tentativa obsoleta sobrescreva uma desconexão já em curso).
      micStream = mic;
      peerConnection = pc;
      dataChannel = dc;
      clientSecretAtual = secret;
      if (obterEstadoAtual() !== "connected") setState("connected");
    } catch (erro) {
      if (!aindaValida()) return;
      lastError = erro instanceof Error ? erro.message : "Falha na negociação WebRTC.";
      try { pc?.close(); } catch { /* best-effort */ }
      try { mic.getTracks().forEach((t) => t.stop()); } catch { /* best-effort */ }
      setState("error");
      return;
    }
  }

  async function limparRecursos(): Promise<void> {
    try { dataChannel?.close(); } catch { /* best-effort */ }
    dataChannel = null;
    try { micStream?.getTracks().forEach((t) => t.stop()); } catch { /* best-effort */ }
    micStream = null;
    try { peerConnection?.close(); } catch { /* best-effort */ }
    peerConnection = null;
    // O segredo nunca foi persistido — apenas liberado da memória aqui.
    clientSecretAtual = null;
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
  };
}
