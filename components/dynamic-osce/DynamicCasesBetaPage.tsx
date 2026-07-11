"use client";

import { useState } from "react";
import { DYNAMIC_CASES, getDynamicCase } from "@/lib/dynamic-osce/cases";
import DynamicBetaNotice from "./DynamicBetaNotice";
import DynamicCaseCard from "./DynamicCaseCard";
import DynamicCaseRunner from "./DynamicCaseRunner";

export default function DynamicCasesBetaPage() {
  const [casoAtivoId, setCasoAtivoId] = useState<string | null>(null);
  const casoAtivo = casoAtivoId ? getDynamicCase(casoAtivoId) : undefined;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 28,
        background:
          "radial-gradient(1200px 600px at 82% -10%, rgba(192,200,255,0.4), transparent 60%), #f3f8ff",
        color: "#0b1f4d",
        fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
        {!casoAtivo ? (
          <>
            <header style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <h1 style={{ margin: 0, fontSize: 30, fontWeight: 850, letterSpacing: "-0.02em" }}>
                Casos OSCE Dinâmicos
              </h1>
              <p style={{ margin: 0, fontSize: 15, color: "#5c6d8a", maxWidth: 640, lineHeight: 1.55 }}>
                Área beta para casos clínicos com evolução fisiológica, intervenções e reavaliação.
              </p>
              <DynamicBetaNotice />
            </header>

            <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#334155" }}>
                Casos piloto
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: 16,
                }}
              >
                {DYNAMIC_CASES.map((c) => (
                  <DynamicCaseCard key={c.identificacao.caseId} caso={c} onIniciar={setCasoAtivoId} />
                ))}
              </div>
            </section>
          </>
        ) : (
          <DynamicCaseRunner caso={casoAtivo} onSair={() => setCasoAtivoId(null)} />
        )}
      </div>
    </div>
  );
}
