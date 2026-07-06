// ============================================================================
// LaboratoryEngine — UTILITÁRIOS compartilhados
// ----------------------------------------------------------------------------
// PRNG determinístico, geração de valor por direção (aditivo/multiplicativo),
// formatação e montagem de analitos. Reutilizado por todos os módulos.
// ============================================================================

import type { Direcao, LabAnalyte, Sexo } from "@/src/lab/labTypes";
import type { Ref } from "@/src/lab/labReferenceRanges";

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

export function normalizarSexo(sexo?: string): Sexo {
  return String(sexo ?? "").toLowerCase().startsWith("f") ? "F" : "M";
}

export function fmt(n: number, dec: number): string {
  return n.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

/** Valor numérico conforme a direção. Homeostático=aditivo; marcador=multiplicativo. */
export function mkValue(rnd: () => number, ref: Ref, dir: Direcao): number {
  const u = rnd();
  let v: number;
  if (ref.kind === "m") {
    if (dir === "alto") v = ref.hi * (2 + 4 * u);
    else if (dir === "muito_alto") v = ref.hi * (8 + 30 * u);
    else if (dir === "baixo") v = ref.lo + (ref.hi - ref.lo) * 0.3 * u;
    else v = ref.lo + (ref.hi - ref.lo) * (0.15 + 0.5 * u);
  } else {
    const r = ref.hi - ref.lo;
    if (dir === "baixo") v = ref.lo - r * (0.2 + 0.4 * u);
    else if (dir === "muito_baixo") v = ref.lo - r * (0.8 + 1.0 * u);
    else if (dir === "alto") v = ref.hi + r * (0.2 + 0.4 * u);
    else if (dir === "muito_alto") v = ref.hi + r * (0.8 + 1.7 * u);
    else v = ref.lo + r * (0.2 + 0.6 * u);
  }
  if (ref.clampMin != null) v = Math.max(ref.clampMin, v);
  if (ref.clampMax != null) v = Math.min(ref.clampMax, v);
  return v;
}

export function flagDe(valor: number, lo: number, hi: number): "" | "↑" | "↓" {
  if (valor > hi) return "↑";
  if (valor < lo) return "↓";
  return "";
}

/** Monta um analito a partir de um valor numérico e sua Ref. */
export function analyteFrom(nome: string, valor: number, ref: Ref, refTexto?: string): LabAnalyte {
  return {
    nome,
    valor: fmt(valor, ref.dec),
    unidade: ref.un,
    ref: refTexto ?? `${fmt(ref.lo, ref.dec)} – ${fmt(ref.hi, ref.dec)}`,
    flag: flagDe(valor, ref.lo, ref.hi),
  };
}

/** Gera valor + analito numa direção. */
export function gen(rnd: () => number, nome: string, ref: Ref, dir: Direcao = "normal", refTexto?: string): LabAnalyte {
  return analyteFrom(nome, mkValue(rnd, ref, dir), ref, refTexto);
}

/** Analito qualitativo (urina, morfologia). */
export function qualitativo(nome: string, valor: string, referencia: string, alterado = false): LabAnalyte {
  return { nome, valor, unidade: "", ref: referencia, flag: alterado ? "↑" : "" };
}
