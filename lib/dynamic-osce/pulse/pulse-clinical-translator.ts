// ============================================================================
// Casos OSCE Dinâmicos — Beta · PULSE CLINICAL TRANSLATOR (Fase 2.5)
// ----------------------------------------------------------------------------
// Funções PURAS (sem chamar Pulse real): traduzem saídas Pulse → estado clínico
// MEDIX, classificam compatibilidade, buscam templates/ações e interpretam
// tendência. Operam apenas sobre objetos TypeScript.
// ============================================================================

import type { PulseCompatibilityStatus, TrendDirection } from "../types";
import { PULSE_OUTPUT_MAP } from "./pulse-output-map";
import { getPulseCapability } from "./pulse-capability-map";
import { getPulseAction } from "./pulse-action-map";
import { getPulseScenarioTemplate, type PulseScenarioTemplate } from "./pulse-scenario-templates";
import type { PulseOutputSnapshot } from "./pulse-adapter.contract";

/** Estado clínico MEDIX parcial produzido a partir de saídas Pulse. */
export interface MedixPhysiologySnapshot {
  frequenciaCardiaca?: number;
  frequenciaRespiratoria?: number;
  pressaoSistolica?: number;
  pressaoDiastolica?: number;
  pressaoArterialMedia?: number;
  saturacaoOxigenio?: number;
  temperatura?: number;
  gasometria?: Record<string, number>;
  [medixField: string]: unknown;
}

/**
 * Converte um snapshot de saídas Pulse (pulseOutputName → valor) para o estado
 * clínico MEDIX, usando o PULSE_OUTPUT_MAP. Campos derivados (derivedByMedix)
 * NÃO são preenchidos aqui — ficam por conta das regras clínicas MEDIX.
 */
export function translatePulseOutputsToMedixState(
  outputs: PulseOutputSnapshot
): MedixPhysiologySnapshot {
  const state: MedixPhysiologySnapshot = {};
  for (const entry of PULSE_OUTPUT_MAP) {
    if (entry.derivedByMedix) continue;
    const val = outputs.values[entry.pulseOutputName];
    if (typeof val !== "number") continue;

    if (entry.medixField.startsWith("gasometria.")) {
      const key = entry.medixField.split(".")[1];
      state.gasometria = { ...(state.gasometria ?? {}), [key]: val };
    } else {
      (state as any)[entry.medixField] = val;
    }
  }
  return state;
}

/** Classifica a compatibilidade Pulse de uma condição (via capability-map). */
export function classifyPulseCompatibility(
  conditionId: string
): PulseCompatibilityStatus | undefined {
  return getPulseCapability(conditionId)?.compatibility;
}

/** Busca um template de cenário conceitual. */
export function getPulseScenarioTemplateById(
  templateId: string
): PulseScenarioTemplate | undefined {
  return getPulseScenarioTemplate(templateId);
}

/** Ação Pulse candidata para uma intervenção MEDIX (string ou undefined). */
export function getPulseActionCandidate(medixActionId: string): string | undefined {
  return getPulseAction(medixActionId)?.pulseActionCandidate;
}

/**
 * Interpreta a tendência entre dois snapshots (melhora/estabilidade/piora),
 * priorizando SpO₂ e FR (respiratório) e, secundariamente, a PA sistólica.
 */
export function interpretDynamicTrend(
  previousState: MedixPhysiologySnapshot,
  nextState: MedixPhysiologySnapshot
): TrendDirection {
  let score = 0;

  const spo2A = previousState.saturacaoOxigenio;
  const spo2B = nextState.saturacaoOxigenio;
  if (typeof spo2A === "number" && typeof spo2B === "number") {
    if (spo2B >= spo2A + 2) score += 1;
    else if (spo2B <= spo2A - 2) score -= 1;
  }

  const frA = previousState.frequenciaRespiratoria;
  const frB = nextState.frequenciaRespiratoria;
  if (typeof frA === "number" && typeof frB === "number") {
    if (frB <= frA - 2) score += 1;
    else if (frB >= frA + 2) score -= 1;
  }

  const paA = previousState.pressaoSistolica;
  const paB = nextState.pressaoSistolica;
  if (typeof paA === "number" && typeof paB === "number") {
    if (paB <= 90 && paB < paA) score -= 1;
  }

  if (score > 0) return "melhora";
  if (score < 0) return "piora";
  return "estabilidade";
}
