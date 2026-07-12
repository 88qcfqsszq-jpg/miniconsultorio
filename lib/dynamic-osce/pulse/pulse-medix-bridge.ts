// ============================================================================
// Casos OSCE Dinâmicos — Beta · PULSE–MEDIX BRIDGE (Fase 6)
// ----------------------------------------------------------------------------
// Converte PulseNormalizedVitals → PatientState MEDIX.
// NÃO executa Pulse. Usa apenas os dados já normalizados + o motor de regras
// MEDIX para recalcular o texto clínico (recomputarClinica).
// ============================================================================

import type { PatientState } from "../types";
import type { PulseNormalizedVitals } from "./pulse-output-normalizer";
import { recomputarClinica } from "../dynamic-state-engine";

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Converte vitais normalizadas do Pulse para um novo PatientState MEDIX.
 *
 * O currentState serve de base para todos os campos não cobertos pelos vitais
 * Pulse (booleans de intervenção, marcadores de condição, tempoDecorridoMin).
 * Os vitais numéricos são sempre sobrescritos.
 * O `broncoespasmo` é derivado de `bronchodilationLevel` (preferido) ou
 * `airwayResistance` (aproximação); se nenhum estiver disponível, mantém o
 * valor do estado atual.
 */
export function pulseVitalsToPatientState({
  currentState,
  normalized,
}: {
  currentState: PatientState;
  normalized: PulseNormalizedVitals;
}): {
  patientState: PatientState;
  warnings: string[];
  usedFallbacks: string[];
} {
  const warnings: string[] = [];
  const usedFallbacks: string[] = [];

  // --- Vitais essenciais (sempre presentes após normalização) ---------------
  const vitals = {
    fc:    Math.round(normalized.heartRate_bpm),
    fr:    Math.round(normalized.respirationRate_bpm),
    paSys: Math.round(normalized.systolicBloodPressure_mmHg),
    paDia: Math.round(normalized.diastolicBloodPressure_mmHg),
    spo2:  Math.round(normalized.oxygenSaturation),
    temp:  normalized.bodyTemperature_C,
  };

  // --- Broncoespasmo: preferência BronchodilationLevel → AirwayResistance ---
  let broncoespasmo: number;

  if (typeof normalized.bronchodilationLevel === "number") {
    // BronchodilationLevel: 0 = sem broncodilatação (broncoespasmo total),
    //                      100 = broncodilatação plena (sem broncoespasmo).
    broncoespasmo = clamp(Math.round(100 - normalized.bronchodilationLevel), 0, 100);
  } else if (typeof normalized.airwayResistance === "number") {
    // AirwayResistance (cmH₂O·L⁻¹·s⁻¹): normal ~2, asma grave ~15–20.
    // Escalonamento linear simples para 0–100.
    const BASE = 2.0;
    const TETO = 20.0;
    const ratio = (normalized.airwayResistance - BASE) / (TETO - BASE);
    broncoespasmo = clamp(Math.round(ratio * 100), 0, 100);
    warnings.push("broncoespasmo derivado de airwayResistance (aproximação linear 2–20 cmH₂O/L/s)");
  } else {
    broncoespasmo = currentState.broncoespasmo;
    usedFallbacks.push(`broncoespasmo mantido do estado atual (${currentState.broncoespasmo})`);
  }

  // --- Montar novo estado (spread preserva marcadores opcionais) ------------
  const newState: PatientState = {
    ...currentState,
    vitals,
    broncoespasmo,
    // clinical será recalculado abaixo — não herdar texto stale
    clinical: currentState.clinical,
  };

  // Recalcular texto clínico a partir dos novos números
  newState.clinical = recomputarClinica(newState);

  return {
    patientState: newState,
    warnings,
    usedFallbacks,
  };
}
