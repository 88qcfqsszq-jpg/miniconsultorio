import type { LearnSection } from "@/lib/medix-learn/types";

interface Props {
  section: LearnSection;
  index: number;
}

export default function LearnSectionCard({ section, index }: Props) {
  return (
    <div
      style={{
        padding: "20px 22px",
        borderRadius: 16,
        background: "#fff",
        border: "1px solid rgba(120,130,180,0.16)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "rgba(59,130,246,0.1)",
            color: "#1d4ed8",
            fontSize: 11,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {index + 1}
        </span>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0b1f4d" }}>
          {section.titulo}
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {section.paragrafos.map((p, i) => (
          <p key={i} style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.65 }}>
            {p}
          </p>
        ))}
      </div>

      {section.items && section.items.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
          {section.items.map((item, i) => (
            <li key={i} style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
              {item}
            </li>
          ))}
        </ul>
      )}

      {section.destaque && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            background: "rgba(59,130,246,0.06)",
            border: "1px solid rgba(59,130,246,0.18)",
            fontSize: 13,
            color: "#1e40af",
            fontWeight: 600,
            lineHeight: 1.5,
          }}
        >
          {section.destaque}
        </div>
      )}
    </div>
  );
}
