"use client";

import { useState } from "react";
import { SinaisVitais, ManobraRealizada } from "@/lib/types";

interface PainelExameFisicoProps {
  sinaisVitaisSolicitados: boolean;
  sinaisVitaisData?: SinaisVitais;
  onSolicitarSinaisVitais: () => void;
  caso: any;
  manobrasSolicitadas: ManobraRealizada[];
  onNovaManobra: (m: ManobraRealizada) => void;
  modoOSCE: boolean;
}

const CATEGORIAS = [
  {
    id: "geral",
    nome: "Geral",
    icone: "👤",
    orientacao: "Digite a manobra de inspeção geral que deseja realizar.",
    exemplos:
      "Ex: avaliar estado geral, nível de consciência, coloração, hidratação...",
  },
  {
    id: "cardiovascular",
    nome: "Cardiovascular",
    icone: "❤️",
    orientacao: "Digite a manobra cardiovascular que deseja realizar.",
    exemplos:
      "Ex: auscultar focos, palpar ictus, avaliar turgência jugular, pulsos...",
  },
  {
    id: "respiratorio",
    nome: "Respiratório",
    icone: "🫁",
    orientacao: "Digite a manobra respiratória que deseja realizar.",
    exemplos:
      "Ex: auscultar pulmões, percutir tórax, avaliar expansibilidade, padrão...",
  },
  {
    id: "abdominal",
    nome: "Abdominal",
    icone: "🫃",
    orientacao: "Digite a manobra abdominal que deseja realizar.",
    exemplos:
      "Ex: inspecionar, auscultar, percutir, palpação superficial ou profunda...",
  },
  {
    id: "membros",
    nome: "Membros",
    icone: "🦵",
    orientacao: "Digite a manobra em membros que deseja realizar.",
    exemplos:
      "Ex: avaliar edema, pulsos, perfusão, cianose, varizes, temperatura...",
  },
];

export default function PainelExameFisico({
  sinaisVitaisSolicitados,
  sinaisVitaisData,
  onSolicitarSinaisVitais,
  caso,
  manobrasSolicitadas,
  onNovaManobra,
  modoOSCE,
}: PainelExameFisicoProps) {
  const [abertaCategoria, setAbertaCategoria] = useState<string | null>("geral");
  const [inputs, setInputs] = useState<Record<string, string>>({
    geral: "",
    cardiovascular: "",
    respiratorio: "",
    abdominal: "",
    membros: "",
  });
  const [loadingCategoria, setLoadingCategoria] = useState<string | null>(null);
  const [erroCategoria, setErroCategoria] = useState<string | null>(null);

  const handleRealizarManobra = async (
    categoria: "geral" | "cardiovascular" | "respiratorio" | "abdominal" | "membros"
  ) => {
    const texto = inputs[categoria].trim();
    if (!texto) return;

    setLoadingCategoria(categoria);
    setErroCategoria(null);

    try {
      // Montar histórico dessa categoria
      const historicoCategoria = manobrasSolicitadas
        .filter((m) => m.categoria === categoria)
        .map((m) => ({
          textDigitado: m.textDigitado,
          resposta: m.resposta,
        }));

      // Chamar API
      const response = await fetch("/api/exame-fisico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          casoId: caso.id,
          categoria,
          comando: texto,
          historico: historicoCategoria,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao processar manobra");
      }

      const data = await response.json();
      const achado = data.achado || "Não foi possível processar esta manobra.";

      const novaManobra: ManobraRealizada = {
        id: `${categoria}-${Date.now()}`,
        categoria,
        textDigitado: texto,
        resposta: achado,
        timestamp: new Date(),
      };

      onNovaManobra(novaManobra);
      setInputs({ ...inputs, [categoria]: "" });
    } catch (error) {
      console.error("Erro ao chamar API de exame físico:", error);
      setErroCategoria(
        "Não foi possível processar esta manobra agora. Tente descrever de outra forma."
      );
    } finally {
      setLoadingCategoria(null);
    }
  };

  const manobrasPorCategoria = manobrasSolicitadas.reduce(
    (acc, m) => {
      if (!acc[m.categoria]) acc[m.categoria] = [];
      acc[m.categoria].push(m);
      return acc;
    },
    {} as Record<string, ManobraRealizada[]>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-5">
      {/* Sinais Vitais */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center text-sm">💚</div>
            <h3 className="font-bold text-slate-800 text-sm">Sinais Vitais</h3>
          </div>
          {sinaisVitaisSolicitados ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ✓ Coletado
            </span>
          ) : (
            <button
              onClick={onSolicitarSinaisVitais}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1.5 px-3.5 rounded-lg text-xs transition-colors active:scale-[0.97]"
            >
              Solicitar
            </button>
          )}
        </div>

        {sinaisVitaisData && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {[
              { label: "PA", value: sinaisVitaisData.pressaoArterial, unit: "" },
              { label: "FC", value: sinaisVitaisData.frequenciaCardiaca, unit: "bpm" },
              { label: "FR", value: sinaisVitaisData.frequenciaRespiratoria, unit: "rpm" },
              { label: "Temp", value: sinaisVitaisData.temperatura, unit: "°C" },
              { label: "SpO₂", value: sinaisVitaisData.saturacaoOxigenio, unit: "%" },
            ].map((sv) => (
              <div key={sv.label} className="bg-emerald-50 border border-emerald-100 rounded-xl p-2.5 text-center">
                <p className="text-xs text-slate-500 mb-0.5">{sv.label}</p>
                <p className="font-bold text-emerald-700 text-sm leading-tight">{sv.value}{sv.unit}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100"></div>

      {/* Exame Físico */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-sm">🔍</div>
          <h3 className="font-bold text-slate-800 text-sm">Exame Físico</h3>
        </div>

        {CATEGORIAS.map((cat) => {
          const isAberta = abertaCategoria === cat.id;
          const nManobras = manobrasPorCategoria[cat.id]?.length ?? 0;
          return (
            <div key={cat.id} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setAbertaCategoria(isAberta ? null : cat.id)}
                className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors text-left"
              >
                <span className="flex items-center gap-2 font-semibold text-slate-700 text-sm">
                  <span>{cat.icone}</span>
                  {cat.nome}
                  {nManobras > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">{nManobras}</span>
                  )}
                </span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${isAberta ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isAberta && (
                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-400">{cat.exemplos}</p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputs[cat.id]}
                      onChange={(e) => setInputs({ ...inputs, [cat.id]: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleRealizarManobra(cat.id as "geral" | "cardiovascular" | "respiratorio" | "abdominal" | "membros");
                      }}
                      placeholder="Descreva a manobra..."
                      className="flex-1 px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400 text-sm"
                    />
                    <button
                      onClick={() => handleRealizarManobra(cat.id as "geral" | "cardiovascular" | "respiratorio" | "abdominal" | "membros")}
                      disabled={loadingCategoria === cat.id || !inputs[cat.id].trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm shrink-0 active:scale-[0.97]"
                    >
                      {loadingCategoria === cat.id ? "..." : "Realizar"}
                    </button>
                  </div>

                  {erroCategoria && loadingCategoria !== cat.id && (
                    <p className="text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">{erroCategoria}</p>
                  )}

                  {nManobras > 0 && (
                    <div className="space-y-2 pt-1">
                      {manobrasPorCategoria[cat.id].map((manobra) => (
                        <div key={manobra.id} className="bg-slate-50 rounded-xl border border-slate-200 p-3">
                          <p className="text-xs text-slate-500 mb-1 font-medium">→ {manobra.textDigitado}</p>
                          <p className="text-sm text-slate-700 leading-relaxed">{manobra.resposta}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
