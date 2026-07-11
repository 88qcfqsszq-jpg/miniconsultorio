"use client";

import type { PatientState, TrendDirection } from "@/lib/dynamic-osce/types";

interface Props {
  estado: PatientState;
  tendencia?: TrendDirection;
}

const CORES_TENDENCIA: Record<TrendDirection, { bg: string; fg: string; label: string }> = {
  melhora: { bg: "rgba(34,197,94,0.14)", fg: "#15803d", label: "▲ Melhora" },
  estabilidade: { bg: "rgba(148,163,184,0.18)", fg: "#475569", label: "＝ Estável" },
  piora: { bg: "rgba(239,68,68,0.14)", fg: "#b91c1c", label: "▼ Piora" },
};

function Vital({ rotulo, valor, alerta }: { rotulo: string; valor: string; alerta?: boolean }) {
  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        background: alerta ? "rgba(239,68,68,0.08)" : "rgba(241,245,249,0.7)",
        border: `1px solid ${alerta ? "rgba(239,68,68,0.25)" : "rgba(148,163,184,0.2)"}`,
      }}
    >
      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{rotulo}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: alerta ? "#b91c1c" : "#0b1f4d" }}>
        {valor}
      </div>
    </div>
  );
}

export default function DynamicPatientStatePanel({ estado, tendencia }: Props) {
  const v = estado.vitals;
  const c = estado.clinical;
  const t = tendencia ? CORES_TENDENCIA[tendencia] : null;

  return (
    <div
      style={{
        padding: 18,
        borderRadius: 16,
        background: "#fff",
        border: "1px solid rgba(120,130,180,0.18)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0b1f4d" }}>
          Estado do paciente
        </h3>
        {t && (
          <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: t.bg, color: t.fg }}>
            {t.label}
          </span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <Vital rotulo="FC (bpm)" valor={String(v.fc)} alerta={v.fc > 130} />
        <Vital rotulo="FR (irpm)" valor={String(v.fr)} alerta={v.fr > 28} />
        <Vital rotulo="PA (mmHg)" valor={`${v.paSys}/${v.paDia}`} />
        <Vital rotulo="SpO₂ (%)" valor={String(v.spo2)} alerta={v.spo2 < 92} />
        <Vital rotulo="Temp (°C)" valor={v.temp.toFixed(1)} />
      </div>

      <dl style={{ margin: 0, display: "grid", gap: 6, fontSize: 13 }}>
        {[
          ["Estado geral", c.estadoGeral],
          ["Trabalho respiratório", c.trabalhoRespiratorio],
          ["Ausculta", c.ausculta],
          ["Fala", c.fala],
          ["Perfusão", c.perfusao],
        ].map(([k, val]) => (
          <div key={k} style={{ display: "flex", gap: 8 }}>
            <dt style={{ color: "#64748b", fontWeight: 600, minWidth: 150 }}>{k}:</dt>
            <dd style={{ margin: 0, color: "#334155" }}>{val}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
