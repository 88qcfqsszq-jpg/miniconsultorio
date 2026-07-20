/**
 * Integração de voz (Realtime) ao chat do Paciente Virtual (Etapa 6).
 *
 * Duas camadas, deliberadamente separadas:
 *
 * 1. `criarRealtimePacienteController` — fábrica PURA (sem React), que liga
 *    `lib/voice/realtimeClient.ts` (conexão WebRTC) a
 *    `lib/voice/realtimeMessageSync.ts` (dedup + conversão para o formato de
 *    mensagens[]). Testável inteiramente via `node:test`, com fábricas falsas
 *    injetadas (mesmo padrão de DI já usado nas Etapas 3-5).
 *
 * 2. `useRealtimePaciente` — hook fino que apenas instancia o controller por
 *    caso (uma sessão nova a cada troca de `casoId`), expõe seu estado via
 *    useState e garante `destruir()` no cleanup do efeito (troca de caso OU
 *    desmontagem — ambas passam pelo mesmo cleanup).
 *
 * O hook NUNCA chama /api/chat-paciente (esse é o fluxo textual existente em
 * ChatPaciente.tsx, que este arquivo não lê nem modifica). O hook também NUNCA
 * lê, armazena ou expõe `clientSecret` — ele não tem conhecimento desse campo,
 * apenas consome a interface já sanitizada de `realtimeClient.ts`.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MensagemChat } from "@/lib/types";
import {
  criarRealtimeClient,
  type RealtimeClient,
  type RealtimeClientOptions,
  type RealtimeConnectionState,
  type RealtimeSanitizedEvent,
} from "@/lib/voice/realtimeClient";
import {
  criarRealtimeMessageSync,
  type RealtimeMessageSync,
  type MensagemChatSincronizada,
} from "@/lib/voice/realtimeMessageSync";

// ============================================================================
// ESTADO DE VOZ (rótulos curtos para a UI)
// ============================================================================

export type EstadoVozPaciente =
  | "inativo"
  | "conectando"
  | "ouvindo"
  | "paciente_respondendo"
  | "encerrando"
  | "encerrado"
  | "erro";

/**
 * Eventos de transcrição do PACIENTE (parcial/final) já são expostos por
 * realtimeClient.ts via {type, at, transcript?} para TODO evento — inclusive
 * os que não carregam transcript. Usamos apenas o `type` (nunca conteúdo) para
 * inferir se o paciente está "falando" no momento, sem exigir nenhuma mudança
 * na Etapa 4/5 (o campo já é público).
 */
const TIPO_RESPOSTA_PACIENTE_PARCIAL = "response.output_audio_transcript.delta";
const TIPO_RESPOSTA_PACIENTE_FINAL = "response.output_audio_transcript.done";

/**
 * Emitidos por realtimeClient.ts quando o navegador (tipicamente Safari) bloqueia
 * ou libera a reprodução automática do áudio remoto — nunca carregam dados além
 * de {type, at} (mesmo contrato sanitizado dos demais eventos).
 */
const TIPO_AUDIO_BLOQUEADO = "audio.autoplay_blocked";
const TIPO_AUDIO_RETOMADO = "audio.autoplay_resumed";

function mapearEstado(base: RealtimeConnectionState, pacienteRespondendo: boolean): EstadoVozPaciente {
  switch (base) {
    case "idle":
      return "inativo";
    case "requesting_secret":
    case "connecting":
      return "conectando";
    case "connected":
      return pacienteRespondendo ? "paciente_respondendo" : "ouvindo";
    case "disconnecting":
      return "encerrando";
    case "disconnected":
      return "encerrado";
    case "error":
      return "erro";
    default:
      return "inativo";
  }
}

/** Estados em que uma nova chamada a `iniciar()` deve ser ignorada (sessão já em curso). */
function sessaoEmCurso(estado: EstadoVozPaciente): boolean {
  return estado === "conectando" || estado === "ouvindo" || estado === "paciente_respondendo";
}

// ============================================================================
// CONTROLLER — camada pura, sem React (testável via node:test)
// ============================================================================

export interface RealtimePacienteControllerOptions {
  onMensagem?: (mensagem: MensagemChat) => void;
  onEstadoChange?: (estado: EstadoVozPaciente) => void;
  onErro?: (mensagem: string | null) => void;
  /** Chamado quando o navegador bloqueia (true) ou libera (false) o autoplay do áudio remoto. */
  onAudioBloqueado?: (bloqueado: boolean) => void;
  /** Injeção para testes — produção usa os defaults reais (sem rede/DOM fake). */
  criarClient?: (options?: RealtimeClientOptions) => RealtimeClient;
  criarMessageSync?: () => RealtimeMessageSync;
}

export interface RealtimePacienteController {
  /** Inicia uma nova sessão de voz. No-op se já houver uma sessão em curso. */
  iniciar(casoId: string, mensagensExistentes: MensagemChat[]): void;
  /** Encerra a sessão atual (idempotente) — libera microfone/PC/data channel. */
  encerrar(): void;
  /** Encerra e impede qualquer reinício futuro deste controller (uso: desmontagem). */
  destruir(): void;
  /** Tenta retomar o áudio remoto bloqueado — sem criar nova sessão. No-op se não houver sessão ativa. */
  ativarAudioRemoto(): void;
  getEstado(): EstadoVozPaciente;
  getErro(): string | null;
}

export function criarRealtimePacienteController(
  options: RealtimePacienteControllerOptions = {}
): RealtimePacienteController {
  const fabricarClient = options.criarClient ?? criarRealtimeClient;
  const fabricarSync = options.criarMessageSync ?? criarRealtimeMessageSync;

  // Contador de sessão — cada iniciar() cria uma sessão nova; callbacks de uma
  // sessão antiga (cliente/realtimeClient obsoleto) são ignorados por esta
  // guarda, mesmo que disparem após encerrar()/destruir()/nova iniciar().
  let sessaoAtual = 0;
  let clienteAtivo: RealtimeClient | null = null;
  let estado: EstadoVozPaciente = "inativo";
  let erro: string | null = null;
  let destruida = false;

  function notificarEstado(novo: EstadoVozPaciente): void {
    if (destruida) return;
    estado = novo;
    options.onEstadoChange?.(novo);
  }

  function notificarErro(msg: string | null): void {
    if (destruida) return;
    erro = msg;
    options.onErro?.(msg);
  }

  /** Invalida a sessão ativa (se houver) e desconecta o cliente subjacente. */
  function encerrarSessaoInterna(): void {
    sessaoAtual++;
    const cliente = clienteAtivo;
    clienteAtivo = null;
    if (cliente) {
      void cliente.disconnectRealtime();
    }
  }

  function iniciar(casoId: string, mensagensExistentes: MensagemChat[]): void {
    if (destruida) return;
    // Bloqueia segunda sessão simultânea e múltiplos cliques durante a conexão.
    if (sessaoEmCurso(estado)) return;

    const minhaSessao = ++sessaoAtual;
    const aindaValida = () => minhaSessao === sessaoAtual && !destruida;

    let pacienteRespondendo = false;

    const sync = fabricarSync();
    sync.seedMensagens(mensagensExistentes as MensagemChatSincronizada[]);

    const client = fabricarClient();
    clienteAtivo = client;
    notificarErro(null);
    options.onAudioBloqueado?.(false);

    client.onStateChange((novoEstadoBase) => {
      if (!aindaValida()) return;
      if (novoEstadoBase === "error") {
        notificarErro(client.getLastError());
        // Garantia extra de liberação total de recursos (idempotente — a
        // limpeza interna de realtimeClient.ts já roda em seu próprio catch).
        void client.disconnectRealtime();
      }
      notificarEstado(mapearEstado(novoEstadoBase, pacienteRespondendo));
    });

    client.onEvent((evento: RealtimeSanitizedEvent) => {
      if (!aindaValida()) return;

      if (evento.type === TIPO_RESPOSTA_PACIENTE_PARCIAL) {
        pacienteRespondendo = true;
        notificarEstado(mapearEstado(client.getConnectionState(), pacienteRespondendo));
      } else if (evento.type === TIPO_RESPOSTA_PACIENTE_FINAL) {
        pacienteRespondendo = false;
        notificarEstado(mapearEstado(client.getConnectionState(), pacienteRespondendo));
      }

      if (evento.transcript) {
        const nova = sync.receberTranscricaoFinal({
          role: evento.transcript.role,
          text: evento.transcript.text,
          itemId: evento.transcript.itemId,
        });
        if (nova) options.onMensagem?.(nova as MensagemChat);
      }

      if (evento.type === TIPO_AUDIO_BLOQUEADO) {
        options.onAudioBloqueado?.(true);
      } else if (evento.type === TIPO_AUDIO_RETOMADO) {
        options.onAudioBloqueado?.(false);
      }
    });

    void client.connectRealtime(casoId);
  }

  function encerrar(): void {
    if (destruida) return;
    encerrarSessaoInterna();
    notificarEstado("encerrado");
  }

  function destruir(): void {
    if (destruida) return;
    encerrarSessaoInterna();
    destruida = true;
  }

  /** Retoma o áudio remoto bloqueado, sem criar nova sessão nem novo clientSecret. */
  function ativarAudioRemoto(): void {
    if (destruida) return;
    void clienteAtivo?.ativarAudioRemoto();
  }

  return {
    iniciar,
    encerrar,
    destruir,
    ativarAudioRemoto,
    getEstado: () => estado,
    getErro: () => erro,
  };
}

// ============================================================================
// HOOK REACT — camada fina, apenas consome o controller
// ============================================================================

export interface UseRealtimePacienteParams {
  casoId: string;
  /** Chamado para cada nova mensagem de voz (aluno ou paciente) — apenas acréscimo. */
  onNovaMensagemVoz: (mensagem: MensagemChat) => void;
}

export interface UseRealtimePacienteResultado {
  estadoVoz: EstadoVozPaciente;
  erroVoz: string | null;
  /** true quando o navegador (tipicamente Safari) bloqueou o autoplay do áudio remoto. */
  audioBloqueado: boolean;
  /** Inicia a sessão de voz, semeando com o histórico textual atual (sem apagá-lo). */
  iniciarVoz: (mensagensAtuais: MensagemChat[]) => void;
  encerrarVoz: () => void;
  /** Tenta retomar o áudio remoto bloqueado — não cria nova sessão nem novo clientSecret. */
  ativarAudioRemoto: () => void;
}

export function useRealtimePaciente({
  casoId,
  onNovaMensagemVoz,
}: UseRealtimePacienteParams): UseRealtimePacienteResultado {
  const [estadoVoz, setEstadoVoz] = useState<EstadoVozPaciente>("inativo");
  const [erroVoz, setErroVoz] = useState<string | null>(null);
  const [audioBloqueado, setAudioBloqueado] = useState(false);
  const controllerRef = useRef<RealtimePacienteController | null>(null);
  const onNovaMensagemVozRef = useRef(onNovaMensagemVoz);
  onNovaMensagemVozRef.current = onNovaMensagemVoz;

  // Um controller novo por caso — troca de caso encerra por completo a sessão
  // anterior (cleanup roda ANTES do próximo efeito) e desmontagem faz o mesmo.
  useEffect(() => {
    const controller = criarRealtimePacienteController({
      onMensagem: (msg) => onNovaMensagemVozRef.current(msg),
      onEstadoChange: setEstadoVoz,
      onErro: setErroVoz,
      onAudioBloqueado: setAudioBloqueado,
    });
    controllerRef.current = controller;
    setEstadoVoz("inativo");
    setErroVoz(null);
    setAudioBloqueado(false);

    return () => {
      controller.destruir();
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, [casoId]);

  const iniciarVoz = useCallback(
    (mensagensAtuais: MensagemChat[]) => {
      controllerRef.current?.iniciar(casoId, mensagensAtuais);
    },
    [casoId]
  );

  const encerrarVoz = useCallback(() => {
    controllerRef.current?.encerrar();
  }, []);

  const ativarAudioRemoto = useCallback(() => {
    controllerRef.current?.ativarAudioRemoto();
  }, []);

  return { estadoVoz, erroVoz, audioBloqueado, iniciarVoz, encerrarVoz, ativarAudioRemoto };
}
