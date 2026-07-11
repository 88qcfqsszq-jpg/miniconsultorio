"use client";

import type { Intervention, InterventionId } from "@/lib/dynamic-osce/types";

interface Props {
  intervencoes: Intervention[];
  onAplicar: (id: InterventionId) => void;
  disabled?: boolean;
}

const COR_CATEGORIA: Record<string, string> = {
  suporte: "#0369a1",
  medicacao: "#6d28d9",
  monitorizacao: "#0f766e",
  decisao: "#b45309",
};

export default function DynamicInterventionsPanel({ intervencoes, onAplicar, disabled }: Props) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 16,
        background: "#fff",
        border: "1px solid rgba(120,130,180,0.18)",
      }}
    >
      <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 800, color: "#0b1f4d" }}>
        Intervenções
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
        {intervencoes.map((iv) => (
          <button
            key={iv.id}
            type="button"
            disabled={disabled}
            onClick={() => onAplicar(iv.id)}
            title={iv.descricao}
            style={{
              textAlign: "left",
              padding: "10px 12px",
              borderRadius: 12,
              border: `1px solid ${disabled ? "rgba(148,163,184,0.25)" : "rgba(120,130,180,0.25)"}`,
              background: disabled ? "rgba(241,245,249,0.6)" : "#fff",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0b1f4d" }}>{iv.label}</div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: COR_CATEGORIA[iv.categoria] ?? "#64748b",
              }}
            >
              {iv.categoria}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
