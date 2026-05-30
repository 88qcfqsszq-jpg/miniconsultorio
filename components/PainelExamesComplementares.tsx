"use client";

import { useState } from "react";
import { ExameSolicitado } from "@/lib/types";

interface PainelExamesComplementaresProps {
  casoId: string;
  examesSolicitados: ExameSolicitado[];
  onNovoExame?: (exame: ExameSolicitado) => void;
  desabilitado?: boolean;
}

export default function PainelExamesComplementares({
  casoId,
  examesSolicitados,
  onNovoExame,
  desabilitado = false,
}: PainelExamesComplementaresProps) {
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const solicitarExame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setCarregando(true);
    setErro("");

    try {
      const response = await fetch("/api/exames-complementares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          casoId,
          exameSolicitado: input.trim(),
          historico: examesSolicitados.map((e) => e.nome),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.erro || "Erro ao solicitar exame");
        return;
      }

      const novoExame: ExameSolicitado = {
        nome: input.trim(),
        resultado: data.resultado,
        timestamp: new Date(),
      };

      onNovoExame?.(novoExame);
      setInput("");
    } catch (error) {
      console.error("Erro ao solicitar exame:", error);
      setErro("Erro ao processar solicitação. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-base">🧪</div>
        <h3 className="font-bold text-slate-800">Exames Complementares</h3>
      </div>

      <form onSubmit={solicitarExame} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ECG, hemograma, troponina, raio-X..."
            disabled={carregando || desabilitado}
            className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:bg-slate-100 text-slate-900 placeholder-slate-400 text-sm"
          />
          <button
            type="submit"
            disabled={carregando || desabilitado || !input.trim()}
            className="bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm shrink-0 active:scale-[0.97]"
          >
            {carregando ? "..." : "Solicitar"}
          </button>
        </div>
        {erro && (
          <p className="mt-2 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
            {erro}
          </p>
        )}
      </form>

      {examesSolicitados.length > 0 ? (
        <div className="space-y-2.5">
          {examesSolicitados.map((exame, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl border border-slate-200 p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs font-bold">✓</span>
                  <p className="text-sm font-semibold text-slate-800">{exame.nome}</p>
                </div>
                <span className="text-xs text-slate-400">
                  {exame.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed pl-5">{exame.resultado}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400 text-center py-3">
          Nenhum exame solicitado ainda
        </p>
      )}
    </div>
  );
}
