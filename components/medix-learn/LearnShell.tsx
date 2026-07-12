import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function LearnShell({ children }: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "32px 28px",
        background:
          "radial-gradient(1100px 500px at 78% -8%, rgba(186,210,255,0.35), transparent 60%), #f3f8ff",
        color: "#0b1f4d",
        fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1024, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        {children}
      </div>
    </div>
  );
}
