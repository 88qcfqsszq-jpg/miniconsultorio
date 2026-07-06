// ============================================================================
// Reavaliação de Sinais Vitais — GERADOR DOS SINAIS DE SAÍDA
// ----------------------------------------------------------------------------
// Determinístico por (caseId + tempo de observação + perfil clínico): mesmo caso
// e mesmo tempo → mesmos sinais de saída. Aplica as tendências do perfil aos
// sinais de entrada, proporcional ao tempo. TODO: integrar com as CONDUTAS
// registradas (interventions) para modular a resposta (ex.: O₂, broncodilatador).
// ============================================================================

import type { GenerateDischargeInput, VitalSet } from "@/src/vitals/vitalTypes";
import { getVitalProfile } from "@/src/vitals/vitalProfiles";
import { aplicarTendencia, clamp, fatorTempo, hashSeed, mulberry32, round1 } from "@/src/vitals/vitalUtils";

export function generateDischargeVitals(input: GenerateDischargeInput): VitalSet {
  const { caso, initialVitals: v, elapsedMinutes } = input;
  const perfil = getVitalProfile(caso);
  const caseId = String(caso?.id ?? caso?.paciente?.id ?? "caso");
  const rnd = mulberry32(hashSeed(`${caseId}|${perfil.key}|${elapsedMinutes}`));
  const f = fatorTempo(elapsedMinutes);

  // Alvos "normal" (melhora) e "ruim" (piora) por sinal.
  const paSysRuim = v.paSys >= 120 ? 205 : 82;
  const paDiaRuim = v.paDia >= 78 ? 125 : 48;

  const out: VitalSet = {
    paSys: clamp(aplicarTendencia(v.paSys, 122, paSysRuim, perfil.pa, f, rnd), 60, 235),
    paDia: clamp(aplicarTendencia(v.paDia, 78, paDiaRuim, perfil.pa, f, rnd), 35, 140),
    fc: clamp(aplicarTendencia(v.fc, 78, 142, perfil.fc, f, rnd), 35, 185),
    fr: clamp(aplicarTendencia(v.fr, 16, 34, perfil.fr, f, rnd), 8, 46),
    temp: clamp(round1(aplicarTendencia(v.temp, 36.8, 39.8, perfil.temp, f, rnd)), 34.5, 41.5),
    spo2: clamp(Math.round(aplicarTendencia(v.spo2, 98, 84, perfil.spo2, f, rnd)), 60, 100),
    dor: clamp(Math.round(aplicarTendencia(v.dor, 1, 9, perfil.dor, f, rnd)), 0, 10),
  };
  out.paSys = Math.round(out.paSys);
  out.paDia = Math.round(out.paDia);
  out.fc = Math.round(out.fc);
  out.fr = Math.round(out.fr);

  if (v.glicemia != null) {
    const glicRuim = v.glicemia >= 140 ? 470 : 48;
    out.glicemia = clamp(Math.round(aplicarTendencia(v.glicemia, 100, glicRuim, perfil.glicemia ?? "estavel", f, rnd)), 40, 600);
  }
  return out;
}
