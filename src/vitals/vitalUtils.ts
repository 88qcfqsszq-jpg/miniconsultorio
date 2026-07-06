// ============================================================================
// Reavaliação de Sinais Vitais — UTILITÁRIOS
// ----------------------------------------------------------------------------
// PRNG determinístico, parse dos sinais de entrada e aplicação de tendências.
// ============================================================================

import type { Trend, VitalSet } from "@/src/vitals/vitalTypes";

export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function num(v: unknown, def: number): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : def;
}

/** Extrai os sinais de entrada do caso (sinaisVitaisCorretos), com defaults seguros. */
export function parseInitialVitals(caso: any): VitalSet {
  const sv = caso?.sinaisVitaisCorretos ?? {};
  let paSys = 120, paDia = 78;
  const pa = String(sv.pressaoArterial ?? "").match(/(\d{2,3})\s*\/\s*(\d{2,3})/);
  if (pa) { paSys = Number(pa[1]); paDia = Number(pa[2]); }
  return {
    paSys,
    paDia,
    fc: num(sv.frequenciaCardiaca, 84),
    fr: num(sv.frequenciaRespiratoria, 18),
    temp: num(sv.temperatura, 36.8),
    spo2: num(sv.saturacaoOxigenio, 97),
    dor: num(sv.dor, 2),
    glicemia: sv.glicemia != null ? num(sv.glicemia, 100) : undefined,
  };
}

const INTENSIDADE: Record<Trend, number> = {
  melhora_forte: 1.0, melhora: 0.6, estavel: 0.1, piora: 0.5, piora_forte: 0.9,
};

/**
 * Aplica uma tendência a um sinal, movendo em direção ao "normal" (melhora) ou
 * ao "ruim" (piora), proporcional ao tempo de observação (fator f) + jitter.
 */
export function aplicarTendencia(entrada: number, normal: number, ruim: number, trend: Trend, f: number, rnd: () => number): number {
  const inten = INTENSIDADE[trend];
  const alvo = trend.startsWith("melhora") ? normal : trend === "estavel" ? entrada : ruim;
  const jitter = (rnd() - 0.5) * Math.abs(normal - ruim) * 0.05;
  return entrada + (alvo - entrada) * inten * f + jitter;
}

/** Fator de tempo: mais observação → mais efeito (0.15 a 1). */
export function fatorTempo(elapsedMinutes: number): number {
  return Math.min(1, Math.max(0.15, elapsedMinutes / 120));
}

export function round1(n: number): number { return Math.round(n * 10) / 10; }
export function clamp(n: number, lo: number, hi: number): number { return Math.max(lo, Math.min(hi, n)); }
export function paStr(v: VitalSet): string { return `${Math.round(v.paSys)}/${Math.round(v.paDia)} mmHg`; }
