"use client";

import type { TimelineEvent, TrendDirection } from "@/lib/dynamic-osce/types";

interface Props {
  eventos: TimelineEvent[];
}

const COR_TENDENCIA: Record<TrendDirection, string> = {
  melhora: "#22c55e",
  estabilidade: "#94a3b8",
  piora: "#ef4444",
};

export default function DynamicTimelinePanel({ eventos }: Props) {
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
        Linha do tempo
      </h3>
      {eventos.length === 0 ? (
        <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>Nenhum evento ainda.</p>
      ) : (
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
          {eventos.map((e) => (
            <li key={e.id} style={{ display: "flex", gap: 10 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span
                  aria-hidden
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: e.tipo === "erro-critico" ? "#ef4444" : COR_TENDENCIA[e.tendencia],
                    marginTop: 4,
                  }}
                />
                <span style={{ flex: 1, width: 2, background: "rgba(148,163,184,0.3)" }} />
              </div>
              <div style={{ paddingBottom: 4 }}>
                <div style={{ fontSize: 12, color: "#64748b" }}>{e.tMin} min</div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: e.tipo === "erro-critico" ? "#b91c1c" : "#0b1f4d",
                  }}
                >
                  {e.titulo}
                </div>
                <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.45 }}>{e.detalhe}</div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
