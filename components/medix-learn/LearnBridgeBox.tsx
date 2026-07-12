"use client";

import type { LearnBridge } from "@/lib/medix-learn/types";

interface Props {
  bridge: LearnBridge;
}

export default function LearnBridgeBox({ bridge }: Props) {
  return (
    <div
      style={{
        borderRadius: 14,
        background: bridge.corBg,
        border: `1px solid ${bridge.cor}33`,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", color: bridge.cor, textTransform: "uppercase", marginBottom: 3 }}>
          {bridge.subtitulo}
        </div>
        <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0b1f4d" }}>
          {bridge.titulo}
        </h4>
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#5c6d8a", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
          Casos recomendados
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {bridge.casosRecomendados.map((c) => (
            <span
              key={c}
              style={{
                padding: "3px 9px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                background: `${bridge.cor}18`,
                color: bridge.cor,
                border: `1px solid ${bridge.cor}25`,
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#5c6d8a", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
          Competências treinadas
        </div>
        <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 3 }}>
          {bridge.competencias.map((comp) => (
            <li key={comp} style={{ fontSize: 12, color: "#374151", lineHeight: 1.45 }}>
              {comp}
            </li>
          ))}
        </ul>
      </div>

      <a
        href={bridge.href}
        style={{
          alignSelf: "flex-start",
          padding: "9px 16px",
          borderRadius: 10,
          background: bridge.cor,
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
          textDecoration: "none",
          letterSpacing: "0.02em",
          transition: "opacity 0.15s",
        }}
        onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.88")}
        onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
      >
        Acessar →
      </a>
    </div>
  );
}
