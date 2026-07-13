"use client";

interface Props {
  titulo: string;
  subtitulo: string;
  badges?: string[];
  breadcrumb?: { label: string; href: string }[];
}

const BADGE_PALETTE: Record<string, { bg: string; color: string }> = {
  "Respiratório":       { bg: "rgba(14,165,233,0.12)", color: "#0369a1" },
  "Fisiologia aplicada":{ bg: "rgba(59,130,246,0.12)", color: "#1d4ed8" },
  "Semiologia":         { bg: "rgba(16,185,129,0.12)", color: "#065f46" },
  "Raciocínio clínico": { bg: "rgba(245,158,11,0.12)", color: "#92400e" },
  "OSCE":               { bg: "rgba(124,58,237,0.12)", color: "#6d28d9" },
  "Base":               { bg: "rgba(100,116,139,0.12)", color: "#334155" },
};

export default function LearnHero({ titulo, subtitulo, badges = [], breadcrumb = [] }: Props) {
  return (
    <header style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {breadcrumb.length > 0 && (
        <nav style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12, color: "#5c6d8a" }}>
          {breadcrumb.map((crumb, i) => (
            <span key={`crumb-${i}`} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <span style={{ opacity: 0.5 }}>›</span>}
              <a
                href={crumb.href}
                style={{
                  color: "#5c6d8a",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.15s",
                }}
                onMouseOver={(e) => ((e.target as HTMLElement).style.color = "#0b1f4d")}
                onMouseOut={(e) => ((e.target as HTMLElement).style.color = "#5c6d8a")}
              >
                {crumb.label}
              </a>
            </span>
          ))}
        </nav>
      )}
      <h1 style={{ margin: 0, fontSize: 32, fontWeight: 850, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
        {titulo}
      </h1>
      <p style={{ margin: 0, fontSize: 16, color: "#5c6d8a", maxWidth: 680, lineHeight: 1.6 }}>
        {subtitulo}
      </p>
      {badges.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
          {badges.map((b, i) => {
            const palette = BADGE_PALETTE[b] ?? { bg: "rgba(120,130,180,0.12)", color: "#334155" };
            return (
              <span
                key={`badge-${i}`}
                style={{
                  padding: "3px 10px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  background: palette.bg,
                  color: palette.color,
                }}
              >
                {b}
              </span>
            );
          })}
        </div>
      )}
    </header>
  );
}
