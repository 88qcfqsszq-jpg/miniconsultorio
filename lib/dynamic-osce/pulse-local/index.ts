// ============================================================================
// Casos OSCE Dinâmicos — Beta · PULSE LOCAL (Fase 10)
// ----------------------------------------------------------------------------
// Exportações públicas do módulo pulse-local.
// Uso: import { runPulseLocalAsthmaSimulation } from "../pulse-local"
// ============================================================================

export { runPulseLocalAsthmaSimulation } from "./pulse-local-runner";
export type {
  PulseLocalRunParams,
  PulseLocalRunResult,
  PulseLocalRunSuccess,
  PulseLocalRunFailure,
} from "./pulse-local-runner";
