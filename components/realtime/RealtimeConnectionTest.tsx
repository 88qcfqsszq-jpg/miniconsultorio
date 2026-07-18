"use client";

/**
 * Página técnica isolada — PROVA TÉCNICA de conexão Realtime via WebRTC (Etapa 4).
 *
 * Componente FINO: toda a lógica de conexão vive em lib/voice/realtimeClient.ts
 * (framework-agnostic, testável via node:test). Este componente apenas instancia
 * o cliente, conecta a UI aos seus callbacks e garante o cleanup ao desmontar.
 *
 * NÃO integra com ChatPaciente, NÃO sincroniza com mensagens[], NÃO persiste
 * transcrição, NÃO altera avaliação/rubricas/casos clínicos.
 */

import { useEffect, useRef, useState } from "react";
import {
  criarRealtimeClient,
  type RealtimeClient,
  type RealtimeConnectionState,
  type RealtimeSanitizedEvent,
} from "@/lib/voice/realtimeClient";

const CASO_ID_PADRAO = "1";

export default function RealtimeConnectionTest() {
  const [casoId, setCasoId] = useState(CASO_ID_PADRAO);
  const [estado, setEstado] = useState<RealtimeConnectionState>("idle");
  const [eventos, setEventos] = useState<RealtimeSanitizedEvent[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clienteRef = useRef<RealtimeClient | null>(null);

  // Instancia o cliente uma única vez, ligado ao elemento de áudio desta página.
  useEffect(() => {
    const cliente = criarRealtimeClient({ audioElement: audioRef.current });
    clienteRef.current = cliente;

    const unsubEstado = cliente.onStateChange((novoEstado) => {
      setEstado(novoEstado);
      if (novoEstado === "error") setErro(cliente.getLastError());
      if (novoEstado === "connecting" || novoEstado === "requesting_secret") setErro(null);
    });
    const unsubEvento = cliente.onEvent(() => {
      setEventos(cliente.getEventLog());
    });

    // Cleanup ao desmontar: encerra a conexão por completo (tracks, data channel,
    // peer connection) — nunca deixa recursos de mídia/rede ativos após sair da página.
    return () => {
      unsubEstado();
      unsubEvento();
      void cliente.disconnectRealtime();
    };
  }, []);

  const conectar = () => {
    setErro(null);
    void clienteRef.current?.connectRealtime(casoId);
  };
  const desconectar = () => {
    void clienteRef.current?.disconnectRealtime();
  };

  const emConexao = estado === "requesting_secret" || estado === "connecting";
  const conectado = estado === "connected";
  const podeConectar = estado === "idle" || estado === "disconnected" || estado === "error";

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Prova técnica — Conexão Realtime (WebRTC)</h1>
        <p className="text-sm text-slate-500 mt-1">
          Página técnica isolada. Não faz parte do atendimento OSCE. Não persiste transcrição.
        </p>
      </div>

      <div className="border border-slate-200 rounded-lg p-4 space-y-3">
        <label className="block text-sm font-semibold text-slate-700">
          casoId (canônico)
          <input
            type="text"
            value={casoId}
            onChange={(e) => setCasoId(e.target.value)}
            disabled={!podeConectar}
            className="mt-1 w-full border border-slate-300 rounded px-3 py-2 text-sm"
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={conectar}
            disabled={!podeConectar}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Conectar
          </button>
          <button
            type="button"
            onClick={desconectar}
            disabled={estado === "idle" || estado === "disconnected"}
            className="px-4 py-2 bg-slate-200 text-slate-800 rounded disabled:opacity-50"
          >
            Desconectar
          </button>
          <span className="text-sm font-mono text-slate-600">
            estado: <strong>{estado}</strong>
            {emConexao && " …"}
          </span>
        </div>

        {erro && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
            {erro}
          </div>
        )}
      </div>

      {/* Áudio remoto — controlado, criado apenas nesta página técnica. */}
      <audio ref={audioRef} autoPlay className="w-full" />

      <div className="border border-slate-200 rounded-lg p-4">
        <h2 className="text-sm font-semibold text-slate-700 mb-2">
          Eventos sanitizados ({eventos.length})
        </h2>
        <ul className="text-xs font-mono text-slate-600 space-y-1 max-h-64 overflow-y-auto">
          {eventos.map((ev, i) => (
            <li key={i}>
              {new Date(ev.at).toLocaleTimeString()} — {ev.type}
            </li>
          ))}
          {eventos.length === 0 && <li className="text-slate-400">Nenhum evento ainda.</li>}
        </ul>
      </div>

      {conectado && (
        <p className="text-xs text-slate-400">
          Conectado. O microfone está ativo — fale para testar a sessão.
        </p>
      )}
    </div>
  );
}
