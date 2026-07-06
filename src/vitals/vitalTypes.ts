// ============================================================================
// Reavaliação de Sinais Vitais — TIPOS
// ----------------------------------------------------------------------------
// Sinais de saída/reavaliação gerados de forma determinística a partir do caso,
// dos sinais de entrada, das intervenções e do tempo de observação. Orienta a
// decisão (alta / observação / hospital) — NÃO substitui o raciocínio clínico.
// ============================================================================

export type Trend = "melhora_forte" | "melhora" | "estavel" | "piora" | "piora_forte";

export interface VitalSet {
  paSys: number;
  paDia: number;
  fc: number;
  fr: number;
  temp: number;
  spo2: number;
  dor: number; // 0–10
  glicemia?: number; // mg/dL (quando aplicável)
}

export type Disposition = "alta_segura" | "observacao" | "encaminhamento_hospitalar";

export interface DispositionResult {
  disposition: Disposition;
  stabilityLabel: string;
  reasons: string[];
  warnings: string[];
}

export interface VitalProfile {
  key: string;
  descricao: string;
  // Tendência de cada sinal na reavaliação (com o tempo/observação).
  pa: Trend;
  fc: Trend;
  fr: Trend;
  temp: Trend;
  spo2: Trend;
  dor: Trend;
  glicemia?: Trend;
  // Orientação clínica.
  podeAlta: boolean;
  provavelObservacao: boolean;
  provavelHospital: boolean;
  /** Casos que NUNCA recebem "alta segura" automática, mesmo melhorando. */
  nuncaAltaDireta: boolean;
  nota: string;
}

export interface GenerateDischargeInput {
  caso: any;
  initialVitals: VitalSet;
  interventions?: string[];
  elapsedMinutes: number;
}
