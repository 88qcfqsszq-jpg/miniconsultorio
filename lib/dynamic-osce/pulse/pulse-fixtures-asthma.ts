// ============================================================================
// Casos OSCE Dinâmicos — Beta · PULSE FIXTURES — ASMA GRAVE (Fase 6)
// ----------------------------------------------------------------------------
// Snapshots estáticos de outputs Pulse para o caso piloto de asma grave.
// Representam três momentos fisiológicos: estado basal grave, após oxigênio
// e após broncodilatador. NENHUM dado aqui vem de execução real do Pulse.
// ============================================================================

import type { PulseRawOutput } from "./pulse-output-normalizer";

/**
 * Snapshot 0: estado basal de crise asmática grave.
 * Equivale ao estadoInicial do caso (broncoespasmo máximo, hipoxemia marcada).
 * BronchodilationLevel=20 (broncoespasmo grave); AirwayResistance="alto" (qualitativo,
 * não mapeado como número — BronchodilationLevel é o campo efetivo).
 */
export const PULSE_FIXTURE_ASTHMA_BASELINE: PulseRawOutput = {
  HeartRate:                    122,
  RespirationRate:               34,
  OxygenSaturation:              88,
  SystolicArterialPressure:     130,
  DiastolicArterialPressure:     82,
  BodyTemperature:             37.2,
  BloodPH:                     7.34,
  ArterialCarbonDioxidePressure: 42,
  ArterialOxygenPressure:        62,
  BronchodilationLevel:          20,   // 20 → broncoespasmo 80
  AirwayResistance:             "alto", // qualitativo; BronchodilationLevel prevalece
};

/**
 * Snapshot 1: após administração de oxigênio suplementar (sem broncodilatador).
 * SpO₂ sobe; FR melhora levemente; broncoespasmo inalterado (BronchodilationLevel=22).
 */
export const PULSE_FIXTURE_ASTHMA_AFTER_OXYGEN: PulseRawOutput = {
  HeartRate:                    118,
  RespirationRate:               31,
  OxygenSaturation:              93,
  SystolicArterialPressure:     128,
  DiastolicArterialPressure:     80,
  BodyTemperature:             37.2,
  BloodPH:                     7.35,
  ArterialCarbonDioxidePressure: 41,
  ArterialOxygenPressure:        75,
  BronchodilationLevel:          22,   // 22 → broncoespasmo 78
};

/**
 * Snapshot 2: após broncodilatador (salbutamol + ipratrópio).
 * Melhora significativa: SpO₂ ≥ 96%, FR normaliza, broncoespasmo residual.
 * BronchodilationLevel=65 → broncoespasmo=35 (melhora substancial).
 */
export const PULSE_FIXTURE_ASTHMA_AFTER_BRONCHODILATOR: PulseRawOutput = {
  HeartRate:                    110,
  RespirationRate:               24,
  OxygenSaturation:              96,
  SystolicArterialPressure:     126,
  DiastolicArterialPressure:     78,
  BodyTemperature:             37.1,
  BloodPH:                     7.38,
  ArterialCarbonDioxidePressure: 38,
  ArterialOxygenPressure:        88,
  BronchodilationLevel:          65,   // 65 → broncoespasmo 35
};
