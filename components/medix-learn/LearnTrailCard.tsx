"use client";

import type { LearnTrailItem } from "@/lib/medix-learn/types";

interface Props {
  trail: LearnTrailItem;
}

export default function LearnTrailCard({ trail }: Props) {
  const card = (
    <div
      style={{
        padding: "18px 20px",
        borderRadius: 14,
        background: trail.disponivel ? "#fff" : "rgba(241,245,249,0.7)",
        border: `1px solid ${trail.disponivel ? "rgba(59,130,246,0.20)" : "rgba(120,130,180,0.12)"}`,
        display: "flex",
        alignItems: "center",
        gap: 14,
        cursor: trail.disponivel ? "pointer" : "default",
        transition: "box-shadow 0.15s, border-color 0.15s",
        textDecoration: "none",
        color: "inherit",
        opacity: trail.disponivel ? 1 : 0.65,
      }}
      onMouseOver={(e) => {
        if (!trail.disponivel) return;
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 18px rgba(59,130,246,0.13)";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.4)";
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "";
        (e.currentTarget as HTMLElement).style.borderColor = trail.disponivel
          ? "rgba(59,130,246,0.20)"
          : "rgba(120,130,180,0.12)";
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#0b1f4d" }}>{trail.titulo}</span>
          {!trail.disponivel && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "1px 6px",
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
        <p style={{ margin: 0, fontSize: 12, color: "#5c6d8a", lineHeight: 1.4 }}>
          {trail.descricao}
        </p>
      </div>
      {trail.disponivel && (
        <span style={{ fontSize: 16, color: "#3b82f6" }}>→</span>
      )}
    </div>
  );

  if (trail.disponivel) {
    return (
      <a href={trail.href} style={{ textDecoration: "none", display: "block" }}>
        {card}
      </a>
    );
  }
  return card;
}
