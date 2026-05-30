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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <h3 className="font-bold text-lg mb-4 text-gray-800">
        💊 Exames Complementares
      </h3>

      {/* Formulário de solicitação */}
      <form onSubmit={solicitarExame} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex: ECG, raio-X de tórax, hemograma, troponina..."
            disabled={carregando || desabilitado}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={carregando || desabilitado || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {carregando ? "Processando..." : "Solicitar"}
          </button>
        </div>

        {erro && (
          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-sm text-red-700">
            ⚠️ {erro}
          </div>
        )}
      </form>

      {/* Histórico de exames */}
      {examesSolicitados.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Exames Solicitados:
          </p>
          {examesSolicitados.map((exame, idx) => (
            <div
              key={idx}
              className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded"
            >
              <p className="text-sm font-semibold text-blue-900 mb-1">
                ✓ {exame.nome}
              </p>
              <p className="text-sm text-gray-700">{exame.resultado}</p>
              <span className="text-xs text-gray-500 mt-1 block">
                {exame.timestamp.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      )}

      {examesSolicitados.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          Nenhum exame solicitado ainda. Solicite exames conforme necessário.
        </p>
      )}
    </div>
  );
}
