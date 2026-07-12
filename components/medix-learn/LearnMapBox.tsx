interface Props {
  linhas: string[];
  titulo?: string;
}

export default function LearnMapBox({ linhas, titulo = "Mapa dos mecanismos" }: Props) {
  return (
    <div
      style={{
        borderRadius: 16,
        background: "#fff",
        border: "1px solid rgba(120,130,180,0.16)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "12px 18px",
          background: "rgba(241,245,249,0.8)",
          borderBottom: "1px solid rgba(120,130,180,0.12)",
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: "#5c6d8a", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {titulo}
        </span>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "18px 22px",
          fontSize: 13,
          lineHeight: 1.7,
          color: "#1e293b",
          fontFamily: "'Geist Mono', 'SF Mono', Consolas, monospace",
          overflowX: "auto",
          background: "transparent",
          whiteSpace: "pre",
        }}
      >
        {linhas.join("\n")}
      </pre>
    </div>
  );
}
