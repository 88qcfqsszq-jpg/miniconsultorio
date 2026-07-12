"use client";

import type { LearnSystem } from "@/lib/medix-learn/types";

interface Props {
  system: LearnSystem;
}

const SYSTEM_ICONS: Record<string, string> = {
  respiratorio:    "🫁",
  cardiovascular:  "🫀",
  infectologia:    "🦠",
  neurologia:      "🧠",
  gastro:          "🫃",
};

export default function LearnSystemCard({ system }: Props) {
  const icon = SYSTEM_ICONS[system.id] ?? "📚";

  const card = (
    <div
      style={{
        padding: "20px 22px",
        borderRadius: 16,
        background: system.disponivel ? "#fff" : "rgba(241,245,249,0.7)",
        border: `1px solid ${system.disponivel ? "rgba(59,130,246,0.22)" : "rgba(120,130,180,0.14)"}`,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        cursor: system.disponivel ? "pointer" : "default",
        transition: "box-shadow 0.15s, border-color 0.15s",
        textDecoration: "none",
        color: "inherit",
        opacity: system.disponivel ? 1 : 0.7,
      }}
      onMouseOver={(e) => {
        if (!system.disponivel) return;
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(59,130,246,0.14)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.45)";
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "";
        (e.currentTarget as HTMLElement).style.borderColor = system.disponivel
          ? "rgba(59,130,246,0.22)"
          : "rgba(120,130,180,0.14)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0b1f4d" }}>
              {system.titulo}
            </h3>
            {!system.disponivel && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: 999,
                  background: "rgba(100,116,139,0.1)",
                  color: "#64748b",
                  letterSpacing: "0.05em",
                }}
              >
                EM BREVE
              </span>
            )}
          </div>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "#5c6d8a", lineHeight: 1.45 }}>
            {system.descricao}
          </p>
        </div>
        {system.disponivel && (
          <span style={{ fontSize: 18, color: "#3b82f6", marginLeft: 4 }}>→</span>
        )}
      </div>
    </div>
  );

  if (system.disponivel) {
    return (
      <a href={system.href} style={{ textDecoration: "none", display: "block" }}>
        {card}
      </a>
    );
  }
  return card;
}
