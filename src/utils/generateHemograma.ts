// ============================================================================
// Motor gerador de HEMOGRAMA COMPLETO (Fase Hemograma)
// ----------------------------------------------------------------------------
// Gera valores realistas e COERENTES a partir do perfil clínico do caso, das
// faixas de referência por idade/sexo e de variação controlada (seed estável por
// caso). Mantém coerência matemática entre índices (Ht/VCM/HCM/CHCM) e entre
// leucócitos totais e diferencial. PURO: sem IA, sem rede. Didático/genérico.
// ============================================================================

import { getHemogramaProfile, type Direcao, type HemogramaProfile } from "@/src/data/hemogramaProfiles";

export interface HemogramaAnalito {
  nome: string;
  valor: string;
  unidade: string;
  ref: string;
  flag: "" | "↑" | "↓";
}
export interface HemogramaResultado {
  perfilKey: string;
  perfilDescricao: string;
  nivel: HemogramaProfile["nivel"];
  paciente: { idade?: number; sexo: "M" | "F" };
  serieVermelha: HemogramaAnalito[];
  serieBranca: HemogramaAnalito[];
  plaquetas: HemogramaAnalito[];
  observacoes: string[];
}

export interface GenerateHemogramaInput {
  caseId?: string | number;
  idade?: number;
  sexo?: string;
  caso?: any;
}

// ── PRNG determinístico (mulberry32) — hemograma estável para o mesmo caso ──
function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normalizarSexo(sexo?: string): "M" | "F" {
  const s = String(sexo ?? "").toLowerCase();
  return s.startsWith("f") ? "F" : "M";
}

type Faixa = [number, number];
interface RefVermelha { hemacias: Faixa; hemoglobina: Faixa; vcm: Faixa; }

function faixaVermelhaPorIdadeSexo(idade: number | undefined, sexo: "M" | "F"): RefVermelha {
  const i = idade ?? 30;
  if (i < 2) return { hemacias: [3.8, 5.2], hemoglobina: [10.5, 13.5], vcm: [72, 84] };
  if (i < 6) return { hemacias: [4.0, 5.2], hemoglobina: [11.5, 13.5], vcm: [75, 87] };
  if (i < 12) return { hemacias: [4.0, 5.4], hemoglobina: [11.5, 15.5], vcm: [77, 95] };
  return sexo === "F"
    ? { hemacias: [4.0, 5.2], hemoglobina: [12.0, 16.0], vcm: [80, 100] }
    : { hemacias: [4.5, 5.9], hemoglobina: [13.5, 17.5], vcm: [80, 100] };
}

// Valor conforme a direção, relativo à faixa [lo,hi].
function valorPorDirecao(rnd: () => number, lo: number, hi: number, dir: Direcao): number {
  const range = hi - lo;
  const u = rnd();
  switch (dir) {
    case "baixo": return lo * (0.78 + 0.14 * u);
    case "muito_baixo": return lo * (0.45 + 0.22 * u);
    case "alto": return hi * (1.05 + 0.18 * u);
    case "muito_alto": return hi * (1.35 + 0.5 * u);
    default: return lo + range * (0.18 + 0.64 * u); // seguro dentro da faixa
  }
}

function flagDe(valor: number, lo: number, hi: number): "" | "↑" | "↓" {
  if (valor > hi) return "↑";
  if (valor < lo) return "↓";
  return "";
}

function fmt(n: number, dec: number): string {
  return n.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function analito(nome: string, valor: number, dec: number, unidade: string, lo: number, hi: number, refDec = dec): HemogramaAnalito {
  return { nome, valor: fmt(valor, dec), unidade, ref: `${fmt(lo, refDec)} – ${fmt(hi, refDec)}`, flag: flagDe(valor, lo, hi) };
}

const fator: Record<Direcao, number> = { normal: 1, baixo: 0.6, muito_baixo: 0.4, alto: 1.6, muito_alto: 2.2 };

/** Gera o hemograma completo para o caso. Determinístico por caseId. */
export function generateHemograma(input: GenerateHemogramaInput): HemogramaResultado {
  const caso = input.caso;
  const perfil = getHemogramaProfile(caso);
  const idade = input.idade ?? caso?.paciente?.idade ?? caso?.dados_visiveis_ao_estudante?.idade;
  const sexo = normalizarSexo(input.sexo ?? caso?.paciente?.sexo ?? caso?.sexo);
  const caseId = String(input.caseId ?? caso?.id ?? caso?.paciente?.id ?? "caso");
  const rnd = mulberry32(hashSeed(`${caseId}|${perfil.key}`));

  const sv = perfil.serieVermelha;
  const sb = perfil.serieBranca;
  const pl = perfil.plaquetas;

  // ── Série vermelha (índices coerentes) ──
  const rv = faixaVermelhaPorIdadeSexo(idade, sexo);
  const hemaciasDir: Direcao = sv.hemacias ?? sv.hematocrito ?? "normal";
  const hbDir: Direcao = sv.hemoglobina ?? sv.hematocrito ?? "normal";
  const vcmDir: Direcao = sv.vcm ?? "normal";
  const rdwDir: Direcao = sv.rdw ?? "normal";

  const hemacias = valorPorDirecao(rnd, rv.hemacias[0], rv.hemacias[1], hemaciasDir);
  const hemoglobina = valorPorDirecao(rnd, rv.hemoglobina[0], rv.hemoglobina[1], hbDir);
  const vcm = valorPorDirecao(rnd, rv.vcm[0], rv.vcm[1], vcmDir);
  const hematocrito = (hemacias * vcm) / 10; // coerência: Ht = hemácias × VCM / 10
  const hcm = (hemoglobina * 10) / hemacias; // Hb×10 / hemácias
  const chcm = (hemoglobina * 100) / hematocrito; // Hb×100 / Ht
  const rdw = valorPorDirecao(rnd, 11.5, 14.5, rdwDir);

  const serieVermelha: HemogramaAnalito[] = [
    analito("Hemácias", hemacias, 2, "milhões/mm³", rv.hemacias[0], rv.hemacias[1]),
    analito("Hemoglobina", hemoglobina, 1, "g/dL", rv.hemoglobina[0], rv.hemoglobina[1]),
    analito("Hematócrito", hematocrito, 1, "%", rv.hemoglobina[0] * 3, rv.hemoglobina[1] * 3),
    analito("VCM", vcm, 1, "fL", rv.vcm[0], rv.vcm[1]),
    analito("HCM", hcm, 1, "pg", 27, 33),
    analito("CHCM", chcm, 1, "g/dL", 32, 36),
    analito("RDW", rdw, 1, "%", 11.5, 14.5),
  ];

  // ── Série branca (total + diferencial coerentes) ──
  const leucoRef: Faixa = idade != null && idade < 12 ? [5000, 14500] : [4000, 11000];
  const leucocitos = Math.round(valorPorDirecao(rnd, leucoRef[0], leucoRef[1], sb.leucocitos ?? "normal") / 100) * 100;

  const criancaPequena = idade != null && idade < 6;
  // percentuais base (segmentados, bastonetes, linfócitos, monócitos, eosinófilos, basófilos)
  const base = criancaPequena
    ? { segmentados: 32, bastonetes: 2, linfocitos: 55, monocitos: 6, eosinofilos: 3, basofilos: 1 }
    : { segmentados: 52, bastonetes: 3, linfocitos: 33, monocitos: 6, eosinofilos: 4, basofilos: 1 };

  const neutroFat = fator[sb.neutrofilos ?? sb.segmentados ?? "normal"];
  const pct = {
    segmentados: base.segmentados * neutroFat * (0.9 + 0.2 * rnd()),
    bastonetes: base.bastonetes * fator[sb.bastonetes ?? sb.neutrofilos ?? "normal"] * (0.9 + 0.2 * rnd()),
    linfocitos: base.linfocitos * fator[sb.linfocitos ?? "normal"] * (0.9 + 0.2 * rnd()),
    monocitos: base.monocitos * fator[sb.monocitos ?? "normal"] * (0.9 + 0.2 * rnd()),
    eosinofilos: base.eosinofilos * fator[sb.eosinofilos ?? "normal"] * (0.9 + 0.2 * rnd()),
    basofilos: base.basofilos * fator[sb.basofilos ?? "normal"] * (0.9 + 0.2 * rnd()),
  };
  const somaPct = Object.values(pct).reduce((a, b) => a + b, 0) || 1;
  const p = Object.fromEntries(Object.entries(pct).map(([k, v]) => [k, (v / somaPct) * 100])) as typeof pct;
  const neutrofilosPct = p.segmentados + p.bastonetes;
  const abs = (frac: number) => Math.round((frac / 100) * leucocitos);

  const serieBranca: HemogramaAnalito[] = [
    analito("Leucócitos", leucocitos, 0, "/mm³", leucoRef[0], leucoRef[1]),
    { nome: "Neutrófilos", valor: `${fmt(neutrofilosPct, 1)}% (${fmt(abs(neutrofilosPct), 0)}/mm³)`, unidade: "", ref: "40 – 70 %", flag: flagDe(neutrofilosPct, 40, 70) },
    { nome: "Bastonetes", valor: `${fmt(p.bastonetes, 1)}% (${fmt(abs(p.bastonetes), 0)}/mm³)`, unidade: "", ref: "0 – 5 %", flag: flagDe(p.bastonetes, 0, 5) },
    { nome: "Segmentados", valor: `${fmt(p.segmentados, 1)}% (${fmt(abs(p.segmentados), 0)}/mm³)`, unidade: "", ref: "40 – 65 %", flag: flagDe(p.segmentados, 40, 65) },
    { nome: "Linfócitos", valor: `${fmt(p.linfocitos, 1)}% (${fmt(abs(p.linfocitos), 0)}/mm³)`, unidade: "", ref: criancaPequena ? "40 – 70 %" : "20 – 45 %", flag: flagDe(p.linfocitos, criancaPequena ? 40 : 20, criancaPequena ? 70 : 45) },
    { nome: "Monócitos", valor: `${fmt(p.monocitos, 1)}% (${fmt(abs(p.monocitos), 0)}/mm³)`, unidade: "", ref: "2 – 10 %", flag: flagDe(p.monocitos, 2, 10) },
    { nome: "Eosinófilos", valor: `${fmt(p.eosinofilos, 1)}% (${fmt(abs(p.eosinofilos), 0)}/mm³)`, unidade: "", ref: "1 – 6 %", flag: flagDe(p.eosinofilos, 1, 6) },
    { nome: "Basófilos", valor: `${fmt(p.basofilos, 1)}% (${fmt(abs(p.basofilos), 0)}/mm³)`, unidade: "", ref: "0 – 2 %", flag: flagDe(p.basofilos, 0, 2) },
  ];

  // ── Plaquetas ──
  const plaquetas = Math.round(valorPorDirecao(rnd, 150000, 450000, pl.plaquetas ?? "normal") / 1000) * 1000;
  const vpm = valorPorDirecao(rnd, 7.5, 11.5, pl.vpm ?? "normal");
  const plaquetocrito = ((plaquetas / 1000) * vpm) / 10000; // %
  const pdw = valorPorDirecao(rnd, 9, 17, pl.pdw ?? "normal");
  const plaquetasSerie: HemogramaAnalito[] = [
    analito("Plaquetas", plaquetas, 0, "/mm³", 150000, 450000),
    analito("VPM", vpm, 1, "fL", 7.5, 11.5),
    analito("Plaquetócrito", plaquetocrito, 2, "%", 0.15, 0.4),
    analito("PDW", pdw, 1, "%", 9, 17),
  ];

  return {
    perfilKey: perfil.key,
    perfilDescricao: perfil.descricao,
    nivel: perfil.nivel,
    paciente: { idade, sexo },
    serieVermelha,
    serieBranca,
    plaquetas: plaquetasSerie,
    observacoes: perfil.observacoes,
  };
}
