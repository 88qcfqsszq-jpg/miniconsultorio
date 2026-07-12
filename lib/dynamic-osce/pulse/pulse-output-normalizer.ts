// ============================================================================
// Casos OSCE Dinâmicos — Beta · PULSE OUTPUT NORMALIZER (Fase 6)
// ----------------------------------------------------------------------------
// Normaliza saídas brutas do Pulse (nomes reais do engine) para um contrato
// interno com nomes canônicos e garantias de preenchimento. NÃO executa Pulse.
// Entrada: PulseRawOutput (dict key → valor).
// Saída : PulseNormalizedVitals (campos tipados + fallbacks para ausentes).
// ============================================================================

/**
 * Saída bruta do Pulse: dict de nome-de-campo → valor (como vem do engine).
 * Aceita number (maioria), string (qualitativo) e boolean.
 */
export type PulseRawOutput = Record<string, number | string | boolean | undefined>;

/**
 * Vitais normalizados com nomes canônicos MEDIX-friendly.
 * Campos essenciais são sempre preenchidos (por fallback se ausentes).
 * Campos opcionais ficam undefined quando não fornecidos pelo Pulse.
 */
export interface PulseNormalizedVitals {
  // Essenciais (garantidos — fallback se ausentes)
  heartRate_bpm: number;
  respirationRate_bpm: number;
  oxygenSaturation: number;
  systolicBloodPressure_mmHg: number;
  diastolicBloodPressure_mmHg: number;
  bodyTemperature_C: number;

  // Gasometria (opcionais)
  bloodPH?: number;
  arterialCO2Pressure_mmHg?: number;
  arterialO2Pressure_mmHg?: number;

  // Mecânica respiratória (opcionais)
  bronchodilationLevel?: number;
  airwayResistance?: number;
  respiratoryMusclePressure?: number;

  // Metadado
  timestampSec?: number;
}

// Mapeamento: nome Pulse → campo normalizado.
const PULSE_TO_NORMALIZED: Record<string, keyof PulseNormalizedVitals> = {
  HeartRate:                     "heartRate_bpm",
  RespirationRate:               "respirationRate_bpm",
  OxygenSaturation:              "oxygenSaturation",
  SystolicArterialPressure:      "systolicBloodPressure_mmHg",
  DiastolicArterialPressure:     "diastolicBloodPressure_mmHg",
  BodyTemperature:               "bodyTemperature_C",
  CoreTemperature:               "bodyTemperature_C",          // alias
  BloodPH:                       "bloodPH",
  ArterialCarbonDioxidePressure: "arterialCO2Pressure_mmHg",
  ArterialOxygenPressure:        "arterialO2Pressure_mmHg",
  BronchodilationLevel:          "bronchodilationLevel",
  AirwayResistance:              "airwayResistance",
  RespiratoryMusclePressure:     "respiratoryMusclePressure",
  TimestampSec:                  "timestampSec",
};

// Fallbacks seguros para campos essenciais (adulto adulto saudável em repouso).
const FALLBACKS_ESSENCIAIS: Required<Pick<
  PulseNormalizedVitals,
  | "heartRate_bpm"
  | "respirationRate_bpm"
  | "oxygenSaturation"
  | "systolicBloodPressure_mmHg"
  | "diastolicBloodPressure_mmHg"
  | "bodyTemperature_C"
>> = {
  heartRate_bpm:               80,
  respirationRate_bpm:         16,
  oxygenSaturation:            95,
  systolicBloodPressure_mmHg: 120,
  diastolicBloodPressure_mmHg: 75,
  bodyTemperature_C:           37.0,
};

/**
 * Normaliza um output bruto do Pulse para PulseNormalizedVitals.
 * Campos essenciais ausentes recebem fallback seguro; o chamador é notificado
 * via `usedFallbacks` e `warnings` para rastreabilidade.
 */
export function normalizePulseOutputs(raw: PulseRawOutput): {
  normalized: PulseNormalizedVitals;
  warnings: string[];
  usedFallbacks: string[];
} {
  const warnings: string[] = [];
  const usedFallbacks: string[] = [];
  const partial: Partial<PulseNormalizedVitals> = {};

  // 1. Mapear todos os campos numéricos reconhecidos.
  for (const [pulseKey, normalizedKey] of Object.entries(PULSE_TO_NORMALIZED)) {
    const val = raw[pulseKey];
    if (typeof val === "number") {
      (partial as Record<string, number>)[normalizedKey] = val;
    }
    // Valores string/boolean são ignorados (qualitativos — não afetam o estado fisiológico).
  }

  // 2. Aplicar fallbacks para campos essenciais ausentes.
  for (const [key, fallback] of Object.entries(FALLBACKS_ESSENCIAIS) as [
    keyof typeof FALLBACKS_ESSENCIAIS,
    number,
  ][]) {
    if (partial[key] === undefined) {
      (partial as Record<string, number>)[key] = fallback;
      usedFallbacks.push(`${key} → ${fallback} (fallback padrão adulto)`);
      warnings.push(
        `Campo essencial '${key}' ausente no output Pulse — usando fallback ${fallback}.`
      );
    }
  }

  return {
    normalized: partial as PulseNormalizedVitals,
    warnings,
    usedFallbacks,
  };
}
