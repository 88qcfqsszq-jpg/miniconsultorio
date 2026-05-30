"use client";

import { useState, useCallback } from "react";
import { Caso } from "@/lib/types";

interface PainelGerarCasoProps {
  onCasoGerado: (caso: Caso) => void;
  disabled?: boolean;
}

export default function PainelGerarCaso({
  onCasoGerado,
  disabled = false,
}: PainelGerarCasoProps) {
  const [sistema, setSistema] = useState("Cardiovascular");
  const [dificuldade, setDificuldade] = useState<
    "fácil" | "intermediário" | "difícil"
  >("intermediário");
  const [foco, setFoco] = useState("Diagnóstico diferencial");
  const [modo, setModo] = useState<"treino" | "prova">("treino");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [gerandoCaso, setGerandoCaso] = useState(false);

  const sistemas = [
    "Cardiovascular",
    "Respiratório",
    "Gastrointestinal",
    "Neurológico",
    "Endocrinologia",
    "Infectologia",
  ];

  const focos = [
    "Diagnóstico diferencial",
    "Raciocínio clínico",
    "Abordagem diagnóstica",
    "Manejo terapêutico",
    "Urgência/Emergência",
    "Prevenção e educação",
  ];

  const handleGerarCaso = useCallback(async () => {
    if (!sistema || !dificuldade || !foco) {
      setErro("Selecione todos os campos");
      return;
    }

    setCarregando(true);
    setErro(null);
    setGerandoCaso(true);

    try {
      const response = await fetch("/api/gerar-caso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sistema, dificuldade, foco, modo }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || "Erro ao gerar caso");
      }

      const data = await response.json();
      if (data.caso) {
        onCasoGerado(data.caso);
        setSistema("Cardiovascular");
        setDificuldade("intermediário");
        setFoco("Diagnóstico diferencial");
      } else {
        throw new Error("Caso não foi gerado");
      }
    } catch (error) {
      const mensagem =
        error instanceof Error ? error.message : "Erro desconhecido";
      setErro(mensagem);
      console.error("Erro ao gerar caso:", error);
    } finally {
      setCarregando(false);
      setGerandoCaso(false);
    }
  }, [sistema, dificuldade, foco, modo, onCasoGerado]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg border border-blue-200">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-2">
          🤖 Gerador de Casos IA
        </h2>
        <p className="text-sm text-gray-600">
          Crie novos casos clínicos personalizados com base em seus critérios
        </p>
      </div>

      {/* Formulário */}
      <div className="space-y-4 mb-6">
        {/* Sistema */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🏥 Sistema Afetado
          </label>
          <select
            value={sistema}
            onChange={(e) => setSistema(e.target.value)}
            disabled={disabled || carregando}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {sistemas.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Dificuldade */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📊 Nível de Dificuldade
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(["fácil", "intermediário", "difícil"] as const).map((nivel) => (
              <button
                key={nivel}
                onClick={() => setDificuldade(nivel)}
                disabled={disabled || carregando}
                className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                  dificuldade === nivel
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {nivel === "fácil" ? "⭐ Fácil" : ""}
                {nivel === "intermediário" ? "⭐⭐ Intermediário" : ""}
                {nivel === "difícil" ? "⭐⭐⭐ Difícil" : ""}
              </button>
            ))}
          </div>
        </div>

        {/* Foco */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🎯 Foco Pedagógico
          </label>
          <select
            value={foco}
            onChange={(e) => setFoco(e.target.value)}
            disabled={disabled || carregando}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {focos.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Modo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🎓 Modo de Uso
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(["treino", "prova"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setModo(m)}
                disabled={disabled || carregando}
                className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                  modo === m
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-green-500"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {m === "treino" ? "📚 Treinamento" : ""}
                {m === "prova" ? "✍️ Prova" : ""}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mensagens de Erro */}
      {erro && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-semibold">⚠️ Erro</p>
          <p className="text-sm text-red-600">{erro}</p>
        </div>
      )}

      {/* Botão Gerar */}
      <button
        onClick={handleGerarCaso}
        disabled={disabled || carregando}
        className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition-all ${
          carregando
            ? "bg-blue-400 text-white cursor-wait"
            : disabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
        }`}
      >
        {carregando ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block animate-spin">⚙️</span>
            Gerando caso...
          </span>
        ) : (
          "✨ Gerar Novo Caso"
        )}
      </button>

      {/* Aviso */}
      <p className="mt-4 text-xs text-gray-600 text-center">
        Cada caso é único e gerado por IA.
      </p>
    </div>
  );
}
