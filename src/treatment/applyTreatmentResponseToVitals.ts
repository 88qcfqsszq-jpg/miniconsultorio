// ============================================================================
// TreatmentResponseEngine — MODULAÇÃO FISIOLÓGICA PELA CONDUTA
// ----------------------------------------------------------------------------
// Recebe os sinais de saída BASE (gerados pelo perfil clínico) e ajusta a
// magnitude da melhora conforme a adequação da conduta E o efeito fisiológico
// esperado de cada intervenção (matriz de evolução). Determinístico e puro.
//   adequada  → melhora maior e coerente
//   parcial   → melhora discreta
//   inadequada→ pouca melhora
//   ausente   → quase sem melhora
//   perigosa  → pouca melhora + piora leve/moderada
// Regra clínica importante: antitérmico/antibiótico NÃO normalizam febre alta em
// 2 h; insulina reduz glicemia de forma progressiva (não imediata). Se a febre
// persistir ≥38,5 °C, evaluateDisposition impede alta simples.
// A disposição final continua sendo decidida por evaluateDisposition.
// ============================================================================

import type { VitalSet } from "@/src/vitals/vitalTypes";
import { clamp, fatorTempo, round1 } from "@/src/vitals/vitalUtils";
import type { TreatmentAnalysis } from "@/src/treatment/treatmentTypes";
import { RESPONSE_FACTOR, WORSEN_ON, ADEQUACY_WEIGHT } from "@/src/treatment/treatmentResponseProfiles";

export interface ApplyTreatmentResponseInput {
  caso: any;
  initialVitals: VitalSet;
  baseExitVitals: VitalSet;
  treatmentAnalysis: TreatmentAnalysis;
  elapsedMinutes: number;
}

export function applyTreatmentResponseToVitals(input: ApplyTreatmentResponseInput): VitalSet {
  const { initialVitals: ini, baseExitVitals: base, treatmentAnalysis: an, elapsedMinutes } = input;
  const factor = RESPONSE_FACTOR[an.adequacy];
  const worsen = WORSEN_ON[an.adequacy];
  const wt = ADEQUACY_WEIGHT[an.adequacy]; // peso do efeito das intervenções
  const f = fatorTempo(elapsedMinutes);
  const tempoFrac = Math.min(1, elapsedMinutes / 120); // efeito cresce até 120 min
  const iv = an.interventions;

  // Escala a melhora esperada pelo perfil (delta base − entrada) pelo fator da conduta.
  const scale = (b: number, e: number) => e + (b - e) * factor;

  const out: VitalSet = {
    paSys: scale(base.paSys, ini.paSys),
    paDia: scale(base.paDia, ini.paDia),
    fc: scale(base.fc, ini.fc),
    fr: scale(base.fr, ini.fr),
    temp: scale(base.temp, ini.temp),
    spo2: scale(base.spo2, ini.spo2),
    dor: scale(base.dor, ini.dor),
  };
  if (base.glicemia != null) out.glicemia = scale(base.glicemia, ini.glicemia ?? base.glicemia);

  // ── Matriz de evolução esperada por intervenção (efeito da CONDUTA) ──
  // Todos os efeitos são parciais, escalados pelo tempo (tempoFrac) e pelo peso
  // da adequação (wt), e depois reclampados a limites fisiológicos.
  const g = f * wt;

  // Antitérmico: redução coerente da temperatura conforme o tempo de ação.
  // Conduta adequada + tempo suficiente → a febre cai como esperado (não fica
  // "presa" em 39,x). Ex.: 39,5 → ~38,2 (60 min) → ~37,9 (120 min).
  if (iv.antipyretic && out.temp > 37.2) {
    const frac = Math.min(0.85, wt * (0.4 + 0.4 * tempoFrac));
    out.temp = out.temp - (out.temp - 37.2) * frac;
  }
  // Oxigênio: SpO₂ melhora rápido.
  if (iv.oxygen) out.spo2 += 4 * g;
  // Broncodilatador: FR↓, SpO₂↑, FC↑ discreta (beta-agonista).
  if (iv.bronchodilator) { out.fr -= 3 * g; out.spo2 += 3 * g; out.fc += 2 * g; }
  // Hidratação oral: FC↓ e PA↑ (perfusão) discretas.
  if (iv.oralHydration) { out.fc -= 3 * g; out.paSys += 3 * g; }
  // Hidratação venosa: FC↓ e PA↑ mais marcadas.
  if (iv.ivFluids) { out.fc -= 5 * g; out.paSys += 6 * g; }
  // Analgesia: reduz dor.
  if (iv.analgesic) out.dor -= 3 * g;
  // Nitrato: alívio de dor isquêmica + redução da PA.
  if (iv.nitrate) { out.dor -= 2 * g; out.paSys -= 4 * g; }
  // Insulina: glicemia reduz PROGRESSIVAMENTE (não normaliza de imediato).
  if (iv.insulin && out.glicemia != null && out.glicemia > 180) {
    out.glicemia = out.glicemia - (out.glicemia - 180) * (0.4 * wt * tempoFrac);
  }
  // Glicose (correção de hipoglicemia): glicemia sobe RÁPIDO para faixa segura.
  if (iv.glucose && out.glicemia != null && out.glicemia < 90) {
    out.glicemia = out.glicemia + (90 - out.glicemia) * Math.min(0.9, 0.7 * wt + 0.2);
    out.fc -= 4 * g; // taquicardia adrenérgica da hipoglicemia cede
  }
  // Antibiótico: NÃO normaliza febre/FC em 2 h — sem efeito imediato nos sinais.

  // ── Conduta potencialmente perigosa → piora leve/moderada nos sinais críticos ──
  if (worsen) {
    out.spo2 -= 3 * f;
    out.fr += 3 * f;
    out.fc += 5 * f;
    out.temp += 0.3 * f;
    out.dor += 1 * f;
    out.paSys -= 4 * f;
    if (out.glicemia != null && (ini.glicemia ?? 0) >= 140) out.glicemia += 20 * f;
  }

  // Reclampa e arredonda nos mesmos limites do gerador base.
  return {
    paSys: Math.round(clamp(out.paSys, 60, 235)),
    paDia: Math.round(clamp(out.paDia, 35, 140)),
    fc: Math.round(clamp(out.fc, 35, 185)),
    fr: Math.round(clamp(out.fr, 8, 46)),
    temp: clamp(round1(out.temp), 34.5, 41.5),
    spo2: Math.round(clamp(out.spo2, 60, 100)),
    dor: Math.round(clamp(out.dor, 0, 10)),
    ...(out.glicemia != null ? { glicemia: Math.round(clamp(out.glicemia, 40, 600)) } : {}),
  };
}
