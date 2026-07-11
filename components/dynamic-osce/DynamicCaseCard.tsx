"use client";

import type { DynamicCase } from "@/lib/dynamic-osce/types";

interface Props {
  caso: DynamicCase;
  onIniciar: (caseId: string) => void;
}

export default function DynamicCaseCard({ caso, onIniciar }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: 20,
        borderRadius: 18,
        background: "#fff",
        border: "1px solid rgba(120, 130, 180, 0.18)",
        boxShadow: "0 6px 20px rgba(80, 70, 170, 0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: 999,
            background: "rgba(56, 189, 248, 0.16)",
            color: "#0369a1",
          }}
        >
          {caso.identificacao.especialidade}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: 999,
            background: "rgba(148, 163, 184, 0.18)",
            color: "#475569",
          }}
        >
          {caso.identificacao.tipo === "adulto" ? "Adulto" : "Pediátrico"}
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: 999,
            background: "rgba(124, 58, 237, 0.14)",
            color: "#6d28d9",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {caso.identificacao.status}
        </span>
      </div>

      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0b1f4d" }}>
        {caso.identificacao.titulo}
      </h3>
      <p style={{ margin: 0, fontSize: 13, color: "#5c6d8a", lineHeight: 1.5 }}>
        {caso.identificacao.objetivoClinico}
      </p>

      <div style={{ fontSize: 12, color: "#64748b" }}>
        Diagnóstico: <strong style={{ color: "#334155" }}>{caso.diagnostico.diagnosticoPrincipal}</strong>
      </div>

      <button
        type="button"
        onClick={() => onIniciar(caso.identificacao.caseId)}
        style={{
          marginTop: 6,
          padding: "11px 16px",
          borderRadius: 12,
          border: "none",
          background: "linear-gradient(120deg, #7c3aed 0%, #6d28d9 55%, #4f46e5 100%)",
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Iniciar caso dinâmico
      </button>
    </div>
  );
}
