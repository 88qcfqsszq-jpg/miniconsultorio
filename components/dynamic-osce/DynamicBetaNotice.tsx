"use client";

// Aviso discreto do módulo beta. Deixa claro que NÃO substitui o OSCE atual.

export default function DynamicBetaNotice() {
  return (
    <div
      role="note"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 12,
        background: "rgba(124, 58, 237, 0.08)",
        border: "1px solid rgba(124, 58, 237, 0.22)",
        color: "#5b21b6",
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      <span
        aria-hidden
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.06em",
          padding: "2px 8px",
          borderRadius: 999,
          background: "#7c3aed",
          color: "#fff",
        }}
      >
        BETA
      </span>
      Área experimental — não substitui os casos OSCE atuais.
    </div>
  );
}
