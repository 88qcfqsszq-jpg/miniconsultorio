/**
 * Teste permanente de regressão — Bloqueio de Ramo Direito (BRD).
 *
 * Mede o SINAL GERADO por generateECG (não os valores declarativos do preset) e
 * garante que a morfologia do BRD permaneça clinicamente válida:
 *   - duração real do QRS em V1/V2 entre 120 e 160 ms;
 *   - onda R' terminal mensurável em V1/V2;
 *   - onda S terminal larga (deflexão negativa) em I/aVL/V5/V6;
 *   - FC preservada (75 ±2 bpm);
 *   - ausência de clipping (saturação de pico);
 *   - ausência de NaN/Infinity;
 *   - derivações de controle (sem modificador) inalteradas.
 *
 * A duração do QRS é medida por SUBTRAÇÃO PAREADA: reconstrói-se a base sem
 * leadModifiers com a mesma seed e mede-se do onset real do QRS até a borda
 * terminal do componente R' (= final − base), sem caminhar até a onda T.
 *
 * Runner (sem dependência adicional; tsx é resolvido por npx):
 *   npx tsx --test src/services/ecgGenerator/__tests__/brd-qrs-duration.test.mts
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { generateECG } from '../index'
import { ecgsynAdapter } from '../ecgsynAdapter'
import { transformarEm12Derivacoes } from '../leadTransform'
import { getPresetById } from '../presets/index'
import type { ECGLead } from '@/lib/ecg/types'

const FS = 250
const N_SEEDS = 100
const LEADS: ECGLead[] = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6']
const CONTROLES: ECGLead[] = ['III', 'aVF', 'V3', 'V4', 'aVR'] // sem rPrimeWave no preset BRD

// ── RNG determinística (mulberry32) ──────────────────────────────────────────
function patchRng(seed: number): () => void {
  let s = seed >>> 0
  const rng = (): number => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const orig = Math.random
  Math.random = rng
  return () => { Math.random = orig }
}

const preset = getPresetById('bloqueio_ramo_direito')!
const morph = preset.morphology

/** Reconstrói as 12 derivações da base SEM leadModifiers (mesma seed). */
function reconstruirBase(): Record<string, number[]> {
  const p = {
    frequenciaCardiaca: 75, numeroIntervalos: 12, frequenciaAmostragem: FS,
    variacaoRR: preset.rrVariability, razaoLFHF: 1.0,
    amplitude: {
      P: morph.pAmplitude, Q: morph.qAmplitude, R: morph.rAmplitude,
      S: morph.sAmplitude, T: morph.tAmplitude,
    },
    duracao: 5, ruido: 0, agrupoIdade: 'adulto' as const,
  }
  const sb = ecgsynAdapter.gerarSinalECGSyn(p)
  let proc = [...sb.valores]
  proc = ecgsynAdapter.aplicarFiltroPassaAlta(proc, 0.5, FS)
  proc = ecgsynAdapter.normalizarSinal(proc, 1.0)
  return transformarEm12Derivacoes(proc, 60)
}

function detectarR(s: number[]): number[] {
  const lim = Math.max(...s.map(Math.abs)) * 0.6
  const c: number[] = []
  let emPico = false, idx = 0, val = 0
  for (let i = 1; i < s.length - 1; i++) {
    if (Math.abs(s[i]) > lim && !emPico) { emPico = true; idx = i; val = s[i] }
    if (emPico && Math.abs(s[i]) > Math.abs(val)) { idx = i; val = s[i] }
    if (emPico && Math.abs(s[i]) < lim * 0.5) {
      if (c.length === 0 || idx - c[c.length - 1] > FS * 0.3) c.push(idx)
      emPico = false
    }
  }
  return c
}

function mediana(a: number[]): number {
  if (!a.length) return NaN
  const o = [...a].sort((x, y) => x - y)
  const i = Math.floor(o.length / 2)
  return o.length % 2 ? o[i] : (o[i - 1] + o[i]) / 2
}

/** Duração do QRS de um batimento (ms) por subtração pareada; não alcança a onda T. */
function qrsDuracao(fin: number[], base: number[], r: number, rr: number): number | null {
  const bi = Math.round(r - 0.12 * rr), bf = Math.round(r - 0.06 * rr)
  if (bi < 0 || bf >= fin.length || bf <= bi) return null
  const baseln = mediana(fin.slice(bi, bf + 1))
  const thr = Math.max(0.05, 0.10 * Math.abs(fin[r] - baseln))

  let onset = r
  const li = Math.max(0, Math.round(r - 0.15 * rr))
  for (let k = r; k >= li; k--) { if (Math.abs(fin[k] - baseln) < thr) { onset = k; break } onset = k }

  let offBase = r
  const ls = Math.min(fin.length - 1, Math.round(r + 0.35 * rr))
  for (let k = r; k <= ls; k++) {
    if (Math.abs(base[k] - baseln) < thr) {
      let sust = true
      for (let j = k; j < Math.min(k + 6, base.length); j++) { if (Math.abs(base[j] - baseln) >= thr) { sust = false; break } }
      if (sust) { offBase = k; break }
    }
    offBase = k
  }

  const comp = fin.map((v, i) => v - base[i])
  let offRp = r
  const js = Math.min(fin.length - 1, r + Math.round(0.20 * rr))
  for (let k = r; k <= js; k++) { if (Math.abs(comp[k]) > 0.05) offRp = k }

  return (Math.max(offBase, offRp) - onset) / FS * 1000
}

function temClipping(s: number[]): boolean {
  const max = Math.max(...s), min = Math.min(...s)
  let rMax = 0, rMin = 0
  for (let i = 0; i < s.length; i++) {
    if (Math.abs(s[i] - max) < 1e-9) { rMax++; if (rMax >= 3) return true } else rMax = 0
    if (min < -1e-3 && Math.abs(s[i] - min) < 1e-9) { rMin++; if (rMin >= 3) return true } else rMin = 0
  }
  return false
}
const temNaN = (s: number[]): boolean => s.some((v) => !Number.isFinite(v))

// ── Coleta de métricas em 100 seeds (uma vez; asserts abaixo) ────────────────
interface Agg { qV1: number[]; qV2: number[]; qI: number[]; qAVL: number[]; qV5: number[]; qV6: number[]
  rpV1: number[]; rpV2: number[]; sI: number[]; sAVL: number[]; sV5: number[]; sV6: number[]
  fc: number[]; clip: number; nan: number; ctrl: number }

const agg: Agg = { qV1: [], qV2: [], qI: [], qAVL: [], qV5: [], qV6: [], rpV1: [], rpV2: [], sI: [], sAVL: [], sV5: [], sV6: [], fc: [], clip: 0, nan: 0, ctrl: 0 }
const rr = FS * 60 / 75

for (let seed = 1; seed <= N_SEEDS; seed++) {
  const r1 = patchRng(seed)
  const resp = generateECG({ presetId: 'bloqueio_ramo_direito', selectedLeads: LEADS, durationSeconds: 5 })
  r1()
  const r2 = patchRng(seed)
  const base = reconstruirBase()
  r2()

  const fin: Record<string, number[]> = {}
  for (const d of LEADS) fin[d] = resp.leads[d] as number[]

  if (LEADS.some((d) => temNaN(fin[d]))) agg.nan++
  if (LEADS.some((d) => temClipping(fin[d]))) agg.clip++
  for (const cc of CONTROLES) {
    let dif = 0
    for (let i = 0; i < fin[cc].length; i++) dif = Math.max(dif, Math.abs(fin[cc][i] - base[cc][i]))
    if (dif > 1e-9) { agg.ctrl++; break }
  }

  agg.fc.push(resp.metadata.measuredHeartRate)

  const rPeaks = detectarR(base['II'])
  const internos = rPeaks.filter((r) => r - 0.15 * rr >= 0 && r + 0.30 * rr < base['II'].length)

  const colQrs = (d: string, acc: number[]) => {
    const xs: number[] = []
    for (const r of internos) { const v = qrsDuracao(fin[d], base[d], r, rr); if (v !== null) xs.push(v) }
    if (xs.length) acc.push(mediana(xs))
  }
  colQrs('V1', agg.qV1); colQrs('V2', agg.qV2); colQrs('I', agg.qI); colQrs('aVL', agg.qAVL); colQrs('V5', agg.qV5); colQrs('V6', agg.qV6)

  const ampPos = (d: string): number => {
    const xs: number[] = []
    for (const r of internos) { const i0 = r + Math.round(40 / 1000 * FS), i1 = r + Math.round(100 / 1000 * FS); if (i1 < fin[d].length) xs.push(Math.max(...fin[d].slice(i0, i1 + 1))) }
    return mediana(xs)
  }
  const deltaNeg = (d: string): number => {
    const xs: number[] = []
    for (const r of internos) { const i0 = r + Math.round(40 / 1000 * FS), i1 = r + Math.round(100 / 1000 * FS); if (i1 < fin[d].length) { let mn = 0; for (let k = i0; k <= i1; k++) mn = Math.min(mn, fin[d][k] - base[d][k]); xs.push(mn) } }
    return mediana(xs)
  }
  agg.rpV1.push(ampPos('V1')); agg.rpV2.push(ampPos('V2'))
  agg.sI.push(deltaNeg('I')); agg.sAVL.push(deltaNeg('aVL')); agg.sV5.push(deltaNeg('V5')); agg.sV6.push(deltaNeg('V6'))
}

// ── Asserções ────────────────────────────────────────────────────────────────
test('QRS medido em V1 fica em 120–160 ms em todas as 100 seeds', () => {
  assert.ok(Math.min(...agg.qV1) >= 120, `min QRS V1 = ${Math.min(...agg.qV1)} ms (< 120)`)
  assert.ok(Math.max(...agg.qV1) <= 160, `max QRS V1 = ${Math.max(...agg.qV1)} ms (> 160)`)
})

test('QRS medido em V2 fica em 120–160 ms em todas as 100 seeds', () => {
  assert.ok(Math.min(...agg.qV2) >= 120, `min QRS V2 = ${Math.min(...agg.qV2)} ms (< 120)`)
  assert.ok(Math.max(...agg.qV2) <= 160, `max QRS V2 = ${Math.max(...agg.qV2)} ms (> 160)`)
})

test('QRS lateral (I/aVL/V5/V6) coerente com BRD (≥120 e ≤160 ms)', () => {
  for (const [nome, arr] of [['I', agg.qI], ['aVL', agg.qAVL], ['V5', agg.qV5], ['V6', agg.qV6]] as const) {
    assert.ok(mediana(arr) >= 120 && mediana(arr) <= 160, `QRS ${nome} mediano = ${mediana(arr)} ms fora de [120,160]`)
  }
})

test("R' terminal mensurável em V1 e V2", () => {
  assert.ok(mediana(agg.rpV1) > 0.05, `R' V1 = ${mediana(agg.rpV1).toFixed(3)} mV (≤ 0.05)`)
  assert.ok(mediana(agg.rpV2) > 0.03, `R' V2 = ${mediana(agg.rpV2).toFixed(3)} mV (≤ 0.03)`)
})

test('S terminal larga (deflexão negativa) em I/aVL/V5/V6', () => {
  for (const [nome, arr] of [['I', agg.sI], ['aVL', agg.sAVL], ['V5', agg.sV5], ['V6', agg.sV6]] as const) {
    assert.ok(mediana(arr) < -0.05, `S ${nome} = ${mediana(arr).toFixed(3)} mV (≥ -0.05)`)
  }
})

test('FC preservada em 75 ±2 bpm em todas as seeds', () => {
  assert.ok(agg.fc.every((f) => Math.abs(f - 75) <= 2), `FC fora de 75±2: min=${Math.min(...agg.fc)} max=${Math.max(...agg.fc)}`)
})

test('ausência de clipping (saturação de pico)', () => {
  assert.equal(agg.clip, 0, `${agg.clip} seeds com clipping`)
})

test('ausência de NaN/Infinity', () => {
  assert.equal(agg.nan, 0, `${agg.nan} seeds com NaN/Infinity`)
})

test('derivações de controle inalteradas (sem modificador indevido)', () => {
  assert.equal(agg.ctrl, 0, `${agg.ctrl} seeds com derivação de controle alterada`)
})
