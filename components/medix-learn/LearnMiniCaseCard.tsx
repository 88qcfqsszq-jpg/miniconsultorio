import type { LearnMiniCase } from "@/lib/medix-learn/types";

interface Props {
  miniCase: LearnMiniCase;
}

export default function LearnMiniCaseCard({ miniCase }: Props) {
  return (
    <div
      style={{
        borderRadius: 16,
        background: "#fff",
        border: `1px solid ${miniCase.accentColor}33`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 18px",
          background: miniCase.accentBg,
          borderBottom: `1px solid ${miniCase.accentColor}22`,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.07em",
            color: miniCase.accentColor,
            textTransform: "uppercase",
          }}
        >
          Mini-caso
        </span>
        <h4 style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 800, color: "#0b1f4d" }}>
          {miniCase.titulo}
        </h4>
      </div>

      {/* Body */}
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {/* Cenário */}
        <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6, fontStyle: "italic" }}>
          {miniCase.cenario}
        </p>

        {/* Dados chave */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {miniCase.dadosChave.map((d, i) => (
            <span
              key={`${miniCase.id}-dado-${i}`}
              style={{
                padding: "4px 9px",
                borderRadius: 8,
                background: miniCase.accentBg,
                border: `1px solid ${miniCase.accentColor}22`,
                fontSize: 11,
                color: "#0b1f4d",
              }}
            >
              <span style={{ fontWeight: 700, color: miniCase.accentColor }}>{d.label}: </span>
              {d.valor}
            </span>
          ))}
        </div>

        {/* Mecanismo */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#5c6d8a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
            Mecanismo principal
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#1e293b", lineHeight: 1.5, fontFamily: "inherit" }}>
            {miniCase.mecanismo}
          </p>
        </div>

        {/* Pergunta + Resposta */}
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 10,
            background: "rgba(241,245,249,0.8)",
            border: "1px solid rgba(120,130,180,0.14)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#5c6d8a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
              Pergunta central
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#0b1f4d", fontWeight: 600, lineHeight: 1.5 }}>
              {miniCase.perguntaCentral}
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#065f46", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
              Resposta esperada
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.55 }}>
              {miniCase.respostaEsperada}
            </p>
          </div>
        </div>

        {/* Erro comum */}
        <div
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.16)",
            fontSize: 12,
            color: "#b91c1c",
            lineHeight: 1.45,
          }}
        >
          <span style={{ fontWeight: 700 }}>Erro comum: </span>
          {miniCase.erroComum}
        </div>

        {/* Ponte OSCE */}
        <div
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            background: "rgba(124,58,237,0.05)",
            border: "1px solid rgba(124,58,237,0.14)",
            fontSize: 12,
            color: "#6d28d9",
            lineHeight: 1.45,
          }}
        >
          <span style={{ fontWeight: 700 }}>No OSCE: </span>
          {miniCase.ponteOSCE}
        </div>
      </div>
    </div>
  );
}
