// ============================================================================
// Casos OSCE Dinâmicos — Beta · PULSE ADAPTER CONTRACT (Fase 2.5)
// ----------------------------------------------------------------------------
// CONTRATO (só TypeScript) do futuro adaptador Pulse. NÃO implementa C++, NÃO
// usa child_process, NÃO acessa filesystem para binário. Serve para os casos
// nascerem prontos para um adaptador que rodará como serviço isolado.
// ============================================================================

/** Interruptor global — nesta fase o Pulse NUNCA é executado. */
export const PULSE_EXECUTION_ENABLED = false as const;

export type PulseAdapterStatus =
  | "uninitialized"
  | "ready"
  | "running"
  | "terminated"
  | "error";

export interface PulseAdapterError {
  code: string;
  message: string;
  recoverable: boolean;
}

/** Sessão de um cenário Pulse em execução (no serviço futuro). */
export interface PulseScenarioSession {
  sessionId: string;
  scenarioTemplateId: string;
  pulseScenarioFile: string;
  status: PulseAdapterStatus;
  startedAtMin: number;
  currentTimeMin: number;
}

/** Pedido de ação para o Pulse, derivado de uma intervenção MEDIX. */
export interface PulseActionRequest {
  medixActionId: string;
  /** Ação Pulse candidata (nome do engine) resolvida pelo action-map. */
  pulseActionCandidate: string;
  params?: Record<string, number | string | boolean>;
  atTimeMin: number;
}

/** Fotografia de saídas do Pulse (pulseOutputName → valor numérico). */
export interface PulseOutputSnapshot {
  atTimeMin: number;
  values: Record<string, number>;
}

/**
 * Contrato do adaptador real (a ser implementado num serviço isolado — Python/CLI
 * ou microserviço — nunca importado direto no bundle do Next).
 */
export interface PulseAdapter {
  initializeScenario(
    scenarioTemplateId: string,
    opts?: { patientFile?: string }
  ): Promise<PulseScenarioSession>;

  applyAction(
    session: PulseScenarioSession,
    request: PulseActionRequest
  ): Promise<PulseOutputSnapshot>;

  advanceTime(
    session: PulseScenarioSession,
    seconds: number
  ): Promise<PulseOutputSnapshot>;

  getOutputs(session: PulseScenarioSession): Promise<PulseOutputSnapshot>;

  terminateScenario(session: PulseScenarioSession): Promise<void>;
}

/**
 * Stub explícito: qualquer tentativa de usar o adaptador nesta fase deve falhar
 * de forma clara (o Pulse ainda não está integrado).
 */
export function getPulseAdapterOrThrow(): never {
  throw new Error(
    "[dynamic-osce/pulse] Pulse adapter não implementado nesta fase (2.5). " +
      "PULSE_EXECUTION_ENABLED=false. Use o motor medix-rule-based."
  );
}
