"use client";

import Link from "next/link";
import { Caso } from "@/lib/types";

interface CasoCardProps {
  caso: Caso;
  /** Caso bloqueado (free tier): mostra cadeado e não navega. */
  locked?: boolean;
  /** Ação ao clicar num caso bloqueado (abrir login/planos). */
  onLockedClick?: () => void;
  /** Tipo do paciente para a rota (adulto/pediátrico). Se omitido, deriva do caso. */
  tipo?: "adulto" | "pediatrico";
}

const CONFIG_SISTEMA: Record<string, {
  icon: string;
  accentColor: string;
  tagBg: string;
  tagColor: string;
}> = {
  Cardiovascular: { icon: "❤️", accentColor: "#f87171", tagBg: "rgba(254,226,226,0.82)", tagColor: "#b91c1c" },
  Cardiologia:    { icon: "❤️", accentColor: "#f87171", tagBg: "rgba(254,226,226,0.82)", tagColor: "#b91c1c" },
  Respiratório:   { icon: "🫁", accentColor: "#38bdf8", tagBg: "rgba(224,242,254,0.82)", tagColor: "#0369a1" },
  "Respiratório/Infectologia": { icon: "🫁", accentColor: "#38bdf8", tagBg: "rgba(224,242,254,0.82)", tagColor: "#0369a1" },
  "ORL/Respiratório":          { icon: "🫁", accentColor: "#38bdf8", tagBg: "rgba(224,242,254,0.82)", tagColor: "#0369a1" },
  Infectologia:   { icon: "🦠", accentColor: "#fbbf24", tagBg: "rgba(254,243,199,0.82)", tagColor: "#b45309" },
  Hematologia:    { icon: "🩸", accentColor: "#fb7185", tagBg: "rgba(255,228,230,0.82)", tagColor: "#9f1239" },
  Hematológico:   { icon: "🩸", accentColor: "#fb7185", tagBg: "rgba(255,228,230,0.82)", tagColor: "#9f1239" },
  Endocrinologia: { icon: "⚗️", accentColor: "#f59e0b", tagBg: "rgba(255,251,235,0.82)", tagColor: "#92400e" },
  Nefrologia:     { icon: "🫘", accentColor: "#2dd4bf", tagBg: "rgba(204,251,241,0.82)", tagColor: "#0f766e" },
  Neurológico:    { icon: "🧠", accentColor: "#818cf8", tagBg: "rgba(238,242,255,0.82)", tagColor: "#4338ca" },
  Imunologia:     { icon: "🛡️", accentColor: "#a78bfa", tagBg: "rgba(243,232,255,0.82)", tagColor: "#6d28d9" },
  Semiologia:     { icon: "🩺", accentColor: "#a78bfa", tagBg: "rgba(243,232,255,0.82)", tagColor: "#6d28d9" },
  Vascular:       { icon: "🩻", accentColor: "#60a5fa", tagBg: "rgba(219,234,254,0.82)", tagColor: "#1d4ed8" },
  "Geral/Infeccioso":  { icon: "🦠", accentColor: "#fbbf24", tagBg: "rgba(254,243,199,0.82)", tagColor: "#b45309" },
  "Geral/Puericultura":{ icon: "🍼", accentColor: "#34d399", tagBg: "rgba(209,250,229,0.82)", tagColor: "#065f46" },
  "Geral/Proteção":    { icon: "🛡️", accentColor: "#a78bfa", tagBg: "rgba(243,232,255,0.82)", tagColor: "#6d28d9" },
};

const FALLBACK_CFG = {
  icon: "📋",
  accentColor: "#94a3b8",
  tagBg: "rgba(241,245,249,0.82)",
  tagColor: "#475569",
};

const NIVEL_CFG: Record<string, { bg: string; color: string; label: string }> = {
  iniciante:     { bg: "rgba(220,252,231,0.82)", color: "#15803d", label: "Iniciante" },
  intermediario: { bg: "rgba(219,234,254,0.82)", color: "#1d4ed8", label: "Intermediário" },
  avancado:      { bg: "rgba(243,232,255,0.82)", color: "#7c3aed", label: "Avançado" },
};

const FALLBACK_NIVEL = { bg: "rgba(241,245,249,0.82)", color: "#475569", label: "—" };

export default function CasoCard({ caso, locked = false, onLockedClick, tipo }: CasoCardProps) {
  const cfg = CONFIG_SISTEMA[caso.sistema] ?? FALLBACK_CFG;
  const nivelCfg = NIVEL_CFG[caso.nivel] ?? FALLBACK_NIVEL;

  // Tipo do paciente (deriva do caso se não for informado).
  const tipoPaciente: "adulto" | "pediatrico" =
    tipo ?? ((caso as any)?.tipoPaciente === "pediatrico" || (caso as any)?.paciente?.tipoPaciente === "pediatrico" ? "pediatrico" : "adulto");
  const href = `/caso/${caso.id}?modo=treinamento&tipo=${tipoPaciente}`;

  const tipoBg    = tipoPaciente === "pediatrico" ? "rgba(204,251,241,0.82)" : "rgba(241,245,249,0.82)";
  const tipoColor = tipoPaciente === "pediatrico" ? "#0f766e" : "#475569";
  const tipoLabel = tipoPaciente === "pediatrico" ? "Pediátrico" : "Adulto";

  return (
    <div
      className="t-card"
      style={{ borderTop: `4px solid ${cfg.accentColor}` }}
    >
      {locked && (
        <span
          className="t-card-lock"
          aria-label="Conteúdo bloqueado"
          title="Conteúdo bloqueado"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v3m-6 5h12a1 1 0 001-1v-7a1 1 0 00-1-1H6a1 1 0 00-1 1v7a1 1 0 001 1zm9-9V7a4 4 0 10-8 0v3" />
          </svg>
        </span>
      )}

      <div className="t-card-body">
        <div className="t-card-title-row">
          <span className="t-card-icon">{cfg.icon}</span>
          <h3 className="t-card-title">{caso.titulo}</h3>
        </div>

        <div className="t-card-tags">
          <span
            className="t-card-tag"
            style={{ background: cfg.tagBg, color: cfg.tagColor }}
          >
            {caso.sistema}
          </span>
          <span
            className="t-card-tag"
            style={{ background: nivelCfg.bg, color: nivelCfg.color }}
          >
            {nivelCfg.label}
          </span>
          <span
            className="t-card-tag"
            style={{ background: tipoBg, color: tipoColor }}
          >
            {tipoLabel}
          </span>
        </div>

        <div className="t-card-info">
          <p>
            <strong>Paciente:</strong> {caso.paciente.nome}, {caso.paciente.idade} anos
          </p>
          <p style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            <strong>Queixa:</strong> {caso.paciente.queixaPrincipal}
          </p>
        </div>
      </div>

      <div className="t-card-footer">
        {locked ? (
          <button
            type="button"
            onClick={onLockedClick}
            className="t-btn-desbloquear"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v3m-6 5h12a1 1 0 001-1v-7a1 1 0 00-1-1H6a1 1 0 00-1 1v7a1 1 0 001 1zm9-9V7a4 4 0 10-8 0v3" />
            </svg>
            Desbloquear
          </button>
        ) : (
          <Link href={href} className="t-btn-iniciar">
            Iniciar Atendimento
          </Link>
        )}
      </div>
    </div>
  );
}
