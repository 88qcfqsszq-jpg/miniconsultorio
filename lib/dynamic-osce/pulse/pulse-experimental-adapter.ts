// ============================================================================
// Casos OSCE Dinâmicos — Beta · PULSE EXPERIMENTAL ADAPTER (Fase 6)
// ----------------------------------------------------------------------------
// Ponto de entrada único para aplicar um snapshot Pulse (fixture estática) ao
// PatientState MEDIX. Piloto: apenas o caso de asma grave.
//
// GARANTIAS DESTA FASE:
//   • PULSE_EXECUTION_ENABLED === false (verificado em runtime)
//   • Nenhuma rede, nenhum processo externo, nenhuma dependência nova
//   • Provider de execução permanece medix-rule-based
//   • caseId fora da lista de suportados retorna estado inalterado + warning
// ============================================================================

import type { PatientState } from "../types";
import type { PulseRawOutput } from "./pulse-output-normalizer";
import { normalizePulseOutputs } from "./pulse-output-normalizer";
import { pulseVitalsToPatientState } from "./pulse-medix-bridge";
import { PULSE_EXECUTION_ENABLED } from "./pulse-adapter.contract";

/**
 * Casos que passaram pela validação manual de fixtures nesta fase experimental.
 * Não adicione um caseId aqui sem ter uma fixture correspondente validada.
 */
const CASOS_SUPORTADOS_EXPERIMENTAL = [
  "dynamic-asthma-severe-adult-001",
] as const;

export type CasoExperimentalSuportado =
  (typeof CASOS_SUPORTADOS_EXPERIMENTAL)[number];

export interface PulseExperimentalResult {
  patientState: PatientState;
  /** Sempre "pulse-fixture" nesta fase. Facilita rastreabilidade no log. */
  source: "pulse-fixture";
  warnings: string[];
  usedFallbacks: string[];
}

/**
 * Aplica um snapshot Pulse (como fixture estática) ao estado atual do paciente.
 *
 * Fluxo:
 *   rawSnapshot → normalizePulseOutputs → PulseNormalizedVitals
 *              → pulseVitalsToPatientState → PatientState + recomputarClinica
 *
 * Se `caseId` não estiver na lista de suportados, retorna o `currentState`
 * inalterado e adiciona um warning — nunca lança exceção por caseId inválido.
 */
export function applyPulseExperimentalSnapshot({
  caseId,
  currentState,
  rawSnapshot,
}: {
  caseId: string;
  currentState: PatientState;
  rawSnapshot: PulseRawOutput;
}): PulseExperimentalResult {
  // Invariante de segurança: nunca deve rodar com Pulse real.
  if (PULSE_EXECUTION_ENABLED) {
    throw new Error(
      "[pulse-experimental-adapter] PULSE_EXECUTION_ENABLED deve ser false nesta fase."
    );
  }

  const warnings: string[] = [];
  const usedFallbacks: string[] = [];

  if (!(CASOS_SUPORTADOS_EXPERIMENTAL as readonly string[]).includes(caseId)) {
    warnings.push(
      `caseId '${caseId}' não está na lista de casos suportados nesta fase experimental.` +
        " Estado do paciente não foi alterado."
    );
    return { patientState: currentState, source: "pulse-fixture", warnings, usedFallbacks };
  }

  // Passo 1: normalizar output bruto
  const { normalized, warnings: wNorm, usedFallbacks: fbNorm } =
    normalizePulseOutputs(rawSnapshot);
  warnings.push(...wNorm);
  usedFallbacks.push(...fbNorm);

  // Passo 2: converter para PatientState
  const { patientState, warnings: wBridge, usedFallbacks: fbBridge } =
    pulseVitalsToPatientState({ currentState, normalized });
  warnings.push(...wBridge);
  usedFallbacks.push(...fbBridge);

  return { patientState, source: "pulse-fixture", warnings, usedFallbacks };
}
