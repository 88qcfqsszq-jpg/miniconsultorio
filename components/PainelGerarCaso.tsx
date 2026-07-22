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
    <div className="pgc-wrap">
      {/* Cabeçalho */}
      <div className="pgc-header">
        <h2 className="pgc-title">
          🤖 Gerador de Casos IA
        </h2>
        <p className="pgc-subtitle">
          Crie novos casos clínicos personalizados com base em seus critérios
        </p>
      </div>

      {/* Formulário */}
      <div className="pgc-fields">
        {/* Sistema */}
        <div className="pgc-field">
          <label className="pgc-label">
            🏥 Sistema Afetado
          </label>
          <select
            value={sistema}
            onChange={(e) => setSistema(e.target.value)}
            disabled={disabled || carregando}
            className="pgc-select"
          >
            {sistemas.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Dificuldade */}
        <div className="pgc-field">
          <label className="pgc-label">
            📊 Nível de Dificuldade
          </label>
          <div className="pgc-btn-group pgc-btn-group-3">
            {(["fácil", "intermediário", "difícil"] as const).map((nivel) => (
              <button
                key={nivel}
                type="button"
                onClick={() => setDificuldade(nivel)}
                disabled={disabled || carregando}
                className={`pgc-toggle-btn${dificuldade === nivel ? " ativo" : ""}`}
              >
                {nivel === "fácil" ? "⭐ Fácil" : ""}
                {nivel === "intermediário" ? "⭐⭐ Intermediário" : ""}
                {nivel === "difícil" ? "⭐⭐⭐ Difícil" : ""}
              </button>
            ))}
          </div>
        </div>

        {/* Foco */}
        <div className="pgc-field">
          <label className="pgc-label">
            🎯 Foco Pedagógico
          </label>
          <select
            value={foco}
            onChange={(e) => setFoco(e.target.value)}
            disabled={disabled || carregando}
            className="pgc-select"
          >
            {focos.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Modo */}
        <div className="pgc-field">
          <label className="pgc-label">
            🎓 Modo de Uso
          </label>
          <div className="pgc-btn-group pgc-btn-group-2">
            {(["treino", "prova"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setModo(m)}
                disabled={disabled || carregando}
                className={`pgc-toggle-btn${modo === m ? " ativo" : ""}`}
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
        <div className="pgc-erro">
          <p className="pgc-erro-title">⚠️ Erro</p>
          <p className="pgc-erro-msg">{erro}</p>
        </div>
      )}

      {/* Botão Gerar */}
      <button
        type="button"
        onClick={handleGerarCaso}
        disabled={disabled || carregando}
        className={`pgc-gerar-btn${carregando ? " carregando" : ""}${disabled ? " desabilitado" : ""}`}
      >
        {carregando ? (
          <span className="pgc-gerar-loading">
            <span className="pgc-spin">⚙️</span>
            Gerando caso...
          </span>
        ) : (
          "✨ Gerar Novo Caso"
        )}
      </button>

      {/* Aviso */}
      <p className="pgc-footer">
        Cada caso é único e gerado por IA.
      </p>
    </div>
  );
}
