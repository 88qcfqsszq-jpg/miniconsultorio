// ============================================================================
// VitalsReassessment — Reavaliação / Sinais Vitais de Saída (aba Sinais Vitais)
// ----------------------------------------------------------------------------
// Dois botões internos:
//   1) "Sinais vitais de entrada"      → coleta/exibe os sinais iniciais.
//   2) "Sinais vitais de saída / Reavaliação" → abre a reavaliação: escolhe o
//      tempo, LÊ A CONDUTA registrada (condutaTexto), aplica o
//      TreatmentResponseEngine (extractInterventions → analyzeTreatment →
//      generateDischargeVitals → applyTreatmentResponseToVitals →
//      evaluateDisposition) e mostra saída + estabilidade.
// Determinístico por caso+tempo+conduta+perfil. Não altera nota/feedback/SOAP
// nem os demais módulos. Orienta, não substitui o raciocínio clínico.
// ============================================================================

"use client";

import { useState } from "react";
import { parseInitialVitals, paStr } from "@/src/vitals/vitalUtils";
import type { VitalSet } from "@/src/vitals/vitalTypes";
import { runTreatmentResponse } from "@/src/treatment/TreatmentResponseEngine";

const TEMPOS = [15, 30, 60, 120];

export interface ReavaliacaoSaida {
  exitVitals: VitalSet;
  therapeuticResponse: string;
  therapeuticResponseLabel: string;
  disposition?: string;
  stabilityLabel?: string;
}

const STATUS_STYLE: Record<string, { cls: string; icon: string }> = {
  alta_segura: { cls: "border-emerald-300 bg-emerald-50 text-emerald-800", icon: "✅" },
  observacao: { cls: "border-amber-300 bg-amber-50 text-amber-800", icon: "🕒" },
  encaminhamento_hospitalar: { cls: "border-red-300 bg-red-50 text-red-800", icon: "🏥" },
};

const ADEQUACY_STYLE: Record<string, string> = {
  adequada: "border-emerald-200 bg-emerald-50 text-emerald-700",
  parcial: "border-amber-200 bg-amber-50 text-amber-700",
  inadequada: "border-orange-200 bg-orange-50 text-orange-700",
  ausente: "border-slate-200 bg-slate-50 text-slate-600",
  potencialmente_perigosa: "border-red-200 bg-red-50 text-red-700",
};

const RESPONSE_STYLE: Record<string, { cls: string; icon: string }> = {
  boa_resposta: { cls: "border-emerald-300 bg-emerald-50 text-emerald-800", icon: "📈" },
  resposta_parcial: { cls: "border-amber-300 bg-amber-50 text-amber-800", icon: "➖" },
  sem_resposta: { cls: "border-slate-300 bg-slate-50 text-slate-700", icon: "⏸️" },
  piora_clinica: { cls: "border-red-300 bg-red-50 text-red-800", icon: "📉" },
};

function seta(saida: number, entrada: number): string {
  if (saida > entrada + 0.05) return "▲";
  if (saida < entrada - 0.05) return "▼";
  return "";
}

function Celula({ rotulo, valor, extra }: { rotulo: string; valor: string; extra?: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2.5 text-center">
      <p className="text-[11px] font-semibold text-slate-500">{rotulo}</p>
      <p className="mt-1 text-sm font-bold text-slate-800">
        {valor}
        {extra && <span className="ml-1 text-xs text-slate-500">{extra}</span>}
      </p>
    </div>
  );
}

function GradeVitais({ v, ref }: { v: VitalSet; ref?: VitalSet }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      <Celula rotulo="PA" valor={paStr(v).replace(" mmHg", "")} extra={ref ? seta(v.paSys, ref.paSys) : undefined} />
      <Celula rotulo="FC" valor={`${v.fc}`} extra={ref ? seta(v.fc, ref.fc) : undefined} />
      <Celula rotulo="FR" valor={`${v.fr}`} extra={ref ? seta(v.fr, ref.fr) : undefined} />
      <Celula rotulo="Temp" valor={`${v.temp.toFixed(1)}°`} extra={ref ? seta(v.temp, ref.temp) : undefined} />
      <Celula rotulo="SpO₂" valor={`${v.spo2}%`} extra={ref ? seta(v.spo2, ref.spo2) : undefined} />
      {v.glicemia != null ? (
        <Celula rotulo="Glicose" valor={`${v.glicemia}`} extra={ref ? seta(v.glicemia, ref.glicemia ?? v.glicemia) : undefined} />
      ) : (
        <Celula rotulo="Dor" valor={`${v.dor}/10`} extra={ref ? seta(v.dor, ref.dor) : undefined} />
      )}
    </div>
  );
}

interface DebugSources {
  conduta: string;
  plano: string;
  avaliacao: string;
  chatMensagens: number;
}

export default function VitalsReassessment({
  caso,
  condutaTexto = "",
  debugSources,
  sinaisSolicitados = false,
  onSolicitarEntrada,
  reavaliadoMin,
  onReavaliar,
  desabilitado = false,
}: {
  caso: any;
  condutaTexto?: string;
  debugSources?: DebugSources;
  sinaisSolicitados?: boolean;
  onSolicitarEntrada?: () => void;
  reavaliadoMin: number | null;
  onReavaliar: (min: number, saida?: ReavaliacaoSaida) => void;
  desabilitado?: boolean;
}) {
  const [tempo, setTempo] = useState<number>(reavaliadoMin ?? 30);
  const [mostrarSaida, setMostrarSaida] = useState<boolean>(reavaliadoMin != null);

  const entrada: VitalSet = parseInitialVitals(caso);
  const resultado = reavaliadoMin != null
    ? runTreatmentResponse({ caso, condutaTexto, initialVitals: entrada, elapsedMinutes: reavaliadoMin })
    : null;
  const disp = resultado?.disposition ?? null;
  const st = disp ? STATUS_STYLE[disp.disposition] : null;

  // TAREFA 8 — logs temporários no clique "Reavaliar sinais vitais".
  function handleReavaliar() {
    const r = runTreatmentResponse({ caso, condutaTexto, initialVitals: entrada, elapsedMinutes: tempo });
    /* eslint-disable no-console */
    console.groupCollapsed("[REAVALIAÇÃO — conduta consolidada]");
    console.log("Fontes usadas:", {
      "diagnostico.conduta": debugSources?.conduta || "(vazio)",
      "soap.plano": debugSources?.plano || "(vazio)",
      "soap.avaliacao": debugSources?.avaliacao || "(vazio)",
      "chat (mensagens analisadas)": debugSources?.chatMensagens ?? 0,
    });
    console.log("Texto consolidado enviado ao extractInterventions:", condutaTexto || "(vazio)");
    console.log("Mensagens do chat analisadas:", debugSources?.chatMensagens ?? 0);
    console.log("Intervenções reconhecidas:", r.analysis.recognized);
    console.log("Adequação da conduta:", r.analysis.adequacy);
    console.log("Resposta terapêutica:", r.therapeuticResponse, "→", r.therapeuticResponseLabel);
    console.groupEnd();
    /* eslint-enable no-console */
    onReavaliar(tempo, {
      exitVitals: r.exitVitals,
      therapeuticResponse: r.therapeuticResponse,
      therapeuticResponseLabel: r.therapeuticResponseLabel,
      disposition: r.disposition?.disposition,
      stabilityLabel: r.disposition?.stabilityLabel,
    });
  }

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h4 className="flex items-center gap-2 text-sm font-black text-slate-800">🩺 Sinais Vitais &amp; Reavaliação</h4>

      {/* Dois botões internos */}
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          onClick={() => onSolicitarEntrada?.()}
          disabled={sinaisSolicitados || desabilitado}
          className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${
            sinaisSolicitados
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {sinaisSolicitados ? "✓ Sinais vitais de entrada" : "Sinais vitais de entrada"}
        </button>
        <button
          onClick={() => setMostrarSaida((v) => !v)}
          className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition-all ${
            mostrarSaida
              ? "border-indigo-300 bg-indigo-50 text-indigo-700"
              : "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          🔁 Sinais vitais de saída / Reavaliação
        </button>
      </div>

      {/* Entrada (após coletar) */}
      {sinaisSolicitados && (
        <div className="mt-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">Sinais Vitais de Entrada</p>
          <GradeVitais v={entrada} />
        </div>
      )}

      {/* Área de reavaliação */}
      {mostrarSaida && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">Tempo de observação</p>
          <div className="flex flex-wrap items-center gap-2">
            {TEMPOS.map((t) => (
              <button
                key={t}
                onClick={() => setTempo(t)}
                className={`rounded-full border px-3 py-1 text-xs font-bold transition-all ${
                  tempo === t ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t} min
              </button>
            ))}
            <button
              onClick={handleReavaliar}
              disabled={desabilitado}
              className="ml-auto rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
            >
              {reavaliadoMin != null ? "🔁 Reavaliar novamente" : "Reavaliar sinais vitais"}
            </button>
          </div>

          {resultado && disp && st && (
            <div className="mt-4 space-y-3">
              {/* Leitura da conduta */}
              <div className={`rounded-xl border p-3 ${ADEQUACY_STYLE[resultado.analysis.adequacy]}`}>
                <p className="text-sm font-black">{resultado.analysis.message}</p>
                {resultado.analysis.recognized.length > 0 && (
                  <p className="mt-1 text-xs">
                    <span className="font-semibold">Intervenções reconhecidas:</span> {resultado.analysis.recognized.join(", ")}.
                  </p>
                )}
                <p className="mt-1 text-[11px] italic opacity-80">
                  Fontes analisadas: conduta, SOAP e chat{debugSources ? ` (${debugSources.chatMensagens} msg)` : ""}.
                </p>
                {resultado.condutaAusente && (
                  <p className="mt-1 text-xs italic">Nenhuma conduta registrada — evolução conservadora (história natural).</p>
                )}
                {resultado.analysis.dangers.length > 0 && (
                  <p className="mt-1 text-xs font-semibold">⚠️ {resultado.analysis.dangers.join(" ")}</p>
                )}
              </div>

              {/* Sinais de saída */}
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Sinais Vitais de Saída · após {reavaliadoMin} min
                </p>
                <GradeVitais v={resultado.exitVitals} ref={entrada} />
              </div>

              {/* Status de resposta terapêutica (antes da decisão final) */}
              {RESPONSE_STYLE[resultado.therapeuticResponse] && (
                <div className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-black ${RESPONSE_STYLE[resultado.therapeuticResponse].cls}`}>
                  {RESPONSE_STYLE[resultado.therapeuticResponse].icon} Resposta terapêutica: {resultado.therapeuticResponseLabel}
                </div>
              )}

              {/* Estabilidade / recomendação final */}
              <div className={`rounded-xl border p-3 ${st.cls}`}>
                <p className="flex items-center gap-2 text-sm font-black">
                  {st.icon} {disp.stabilityLabel}
                </p>
                {disp.reasons.length > 0 && (
                  <ul className="mt-2 list-disc space-y-0.5 pl-5">
                    {disp.reasons.map((r, i) => (
                      <li key={i} className="text-xs">{r}</li>
                    ))}
                  </ul>
                )}
                {disp.warnings.length > 0 && (
                  <p className="mt-2 text-xs font-semibold">⚠️ {disp.warnings.join(" ")}</p>
                )}
              </div>

              <p className="text-[11px] italic text-slate-400">
                Reavaliação educacional — a resposta depende da conduta registrada. Orienta a decisão, não substitui o raciocínio clínico.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
