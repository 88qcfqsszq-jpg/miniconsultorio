"use client";
// ============================================================================
// PulseLocalExperimentPanel — Fase 11
// ----------------------------------------------------------------------------
// Painel experimental discreto que chama POST /api/pulse/simulate e exibe
// os vitais reais do Pulse local. Aparece APENAS no caso de Asma Grave beta.
// NÃO altera provider dos casos. NÃO aplica PatientState no fluxo principal.
// NÃO altera UI global. É apenas visualização comparativa.
// ============================================================================

import { useState } from "react";

interface NormalizedVitals {
  heartRate_bpm?: number;
  respirationRate_bpm?: number;
  oxygenSaturation?: number;
  systolicBloodPressure_mmHg?: number;
  diastolicBloodPressure_mmHg?: number;
}

interface ClinicalStatus {
  estadoGeral?: string;
  trabalhoRespiratorio?: string;
  ausculta?: string;
  fala?: string;
}

interface PatientStateFragment {
  vitals?: { spo2?: number; fc?: number; fr?: number; paSys?: number; paDia?: number };
  clinical?: ClinicalStatus;
  broncoespasmo?: number;
}

interface SimulateResponse {
  ok: boolean;
  provider?: string;
  fallbackRecommended?: boolean;
  error?: string;
  warnings?: string[];
  patientState?: PatientStateFragment;
  normalized?: NormalizedVitals;
  duration_s?: number;
  severity?: number;
}

type Status = "idle" | "loading" | "success" | "error";

interface Props {
  conditionId: "asthma-severe-adult";
  severity?: number;
  duration_s?: number;
}

export default function PulseLocalExperimentPanel({
  conditionId,
  severity = 0.75,
  duration_s = 580,
}: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<SimulateResponse | null>(null);

  async function handleRun() {
    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch("/api/pulse/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conditionId, severity, duration_s }),
      });
      const data = (await res.json()) as SimulateResponse;
      setResult(data);
      setStatus(data.ok ? "success" : "error");
    } catch (err) {
      setResult({
        ok: false,
        error: err instanceof Error ? err.message : "Erro de rede ao chamar /api/pulse/simulate",
        warnings: [],
      });
      setStatus("error");
    }
  }

  return (
    <div
      style={{
        marginTop: 4,
        padding: "14px 16px",
        borderRadius: 14,
        border: "1px dashed rgba(124,58,237,0.3)",
        background: "rgba(245,243,255,0.6)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* Cabeçalho */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#7c3aed",
            textTransform: "uppercase",
            background: "rgba(124,58,237,0.1)",
            padding: "2px 7px",
            borderRadius: 6,
          }}
        >
          Experimental
        </span>
        <span style={{ fontSize: 12, color: "#5c6d8a", fontWeight: 500 }}>
          Pulse Engine local · Asma Grave · severity={severity} · {duration_s}s
        </span>
      </div>

      {/* Botão */}
      {status === "idle" || status === "error" || status === "success" ? (
        <button
          type="button"
          onClick={handleRun}
          style={{
            alignSelf: "flex-start",
            padding: "7px 14px",
            borderRadius: 10,
            border: "1px solid rgba(124,58,237,0.4)",
            background: status === "success" ? "rgba(124,58,237,0.08)" : "#fff",
            color: "#6d28d9",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {status === "success" ? "↺ Rodar novamente" : "Rodar Pulse local experimental"}
        </button>
      ) : null}

      {/* Loading */}
      {status === "loading" && (
        <div style={{ fontSize: 12, color: "#7c3aed", fontWeight: 600 }}>
          ⏳ Rodando Pulse local... pode levar até 30s
        </div>
      )}

      {/* Sucesso */}
      {status === "success" && result?.ok && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: "12px 14px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(124,58,237,0.2)",
          }}
        >
          <strong style={{ fontSize: 12, color: "#4c1d95" }}>Resultado Pulse local</strong>

          {/* Vitais normalizados */}
          {result.normalized && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: 6,
              }}
            >
              {[
                { label: "SpO₂", value: result.normalized.oxygenSaturation?.toFixed(1), unit: "%" },
                { label: "FC", value: result.normalized.heartRate_bpm?.toFixed(0), unit: "bpm" },
                { label: "FR", value: result.normalized.respirationRate_bpm?.toFixed(0), unit: "irpm" },
                {
                  label: "PA",
                  value:
                    result.normalized.systolicBloodPressure_mmHg && result.normalized.diastolicBloodPressure_mmHg
                      ? `${Math.round(result.normalized.systolicBloodPressure_mmHg)}/${Math.round(result.normalized.diastolicBloodPressure_mmHg)}`
                      : undefined,
                  unit: "mmHg",
                },
              ]
                .filter((v) => v.value !== undefined)
                .map(({ label, value, unit }) => (
                  <div
                    key={label}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      background: "rgba(124,58,237,0.06)",
                      border: "1px solid rgba(124,58,237,0.12)",
                    }}
                  >
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase" }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#1e1b4b" }}>
                      {value}
                      <span style={{ fontSize: 10, fontWeight: 400, color: "#7c3aed", marginLeft: 2 }}>{unit}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Clínica */}
          {result.patientState?.clinical && (
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {result.patientState.clinical.ausculta && (
                <div style={{ fontSize: 11, color: "#374151" }}>
                  <span style={{ fontWeight: 700, color: "#4c1d95" }}>Ausculta: </span>
                  {result.patientState.clinical.ausculta}
                </div>
              )}
              {result.patientState.clinical.trabalhoRespiratorio && (
                <div style={{ fontSize: 11, color: "#374151" }}>
                  <span style={{ fontWeight: 700, color: "#4c1d95" }}>Trabalho resp.: </span>
                  {result.patientState.clinical.trabalhoRespiratorio}
                </div>
              )}
            </div>
          )}

          {/* Warnings */}
          {result.warnings && result.warnings.length > 0 && (
            <div style={{ fontSize: 10, color: "#92400e", marginTop: 2 }}>
              {result.warnings.map((w, i) => (
                <div key={i}>⚠ {w}</div>
              ))}
            </div>
          )}

          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
            provider: {result.provider} · Este resultado NÃO altera o fluxo MEDIX principal.
          </div>
        </div>
      )}

      {/* Erro */}
      {status === "error" && (
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#b91c1c" }}>
            Pulse local indisponível. Fluxo MEDIX rule-based preservado.
          </div>
          {result?.error && (
            <div style={{ fontSize: 11, color: "#dc2626", marginTop: 4 }}>{result.error}</div>
          )}
          {result?.warnings && result.warnings.length > 0 && (
            <div style={{ fontSize: 10, color: "#92400e", marginTop: 4 }}>
              {result.warnings.map((w, i) => (
                <div key={i}>⚠ {w}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
