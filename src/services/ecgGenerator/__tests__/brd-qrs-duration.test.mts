/**
 * Teste permanente de regressão — Bloqueio de Ramo Direito (BRD).
 *
 * Mede o SINAL GERADO por generateECG (não os valores declarativos do preset) e
 * garante que a morfologia do BRD permaneça clinicamente válida em TODAS as
 * frequências clínicas que o preset pode assumir. O preset bloqueio_ramo_direito
 * usa política `estado_clinico`, então herda patientHeartRate; por isso o teste
 * varre 60, 75, 102, 120 e 150 bpm.
 *
 * Para cada FC:
 *   - metadata.targetHeartRate == patientHeartRate solicitada;
 *   - metadata.measuredHeartRate dentro de tolerância D2;
 *   - duração real do QRS em V1/V2 entre 120 e 160 ms;
 *   - QRS lateral (I/aVL/V5/V6) ≤ 160 ms;
 *   - onda R' terminal mensurável em V1/V2;
 *   - onda S terminal larga (deflexão negativa) em I/aVL/V5/V6;
 *   - ausência de fusão do QRS com a onda T;
 *   - ausência de clipping (saturação de pico);
 *   - ausência de NaN/Infinity;
 *   - derivações de controle (sem modificador) inalteradas.
 *
 * A duração do QRS é medida por SUBTRAÇÃO PAREADA: reconstrói-se a base sem
 * leadModifiers com a mesma seed e mede-se do onset real do QRS até a borda
 * terminal do componente R' (= final − base), em janela ABSOLUTA (o R' tem tempo
 * fixo em ms), sem caminhar até a onda T.
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
const LEADS: ECGLead[] = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6']
const CONTROLES: ECGLead[] = ['III', 'aVF', 'V3', 'V4', 'aVR'] // sem rPrimeWave no preset BRD

// Frequências clínicas testadas (o preset herda patientHeartRate) e nº de seeds.
const FREQUENCIAS: Array<{ fc: number; seeds: number }> = [
  { fc: 60, seeds: 30 },
  { fc: 75, seeds: 100 },
  { fc: 102, seeds: 30 },
  { fc: 120, seeds: 30 },
  { fc: 150, seeds: 30 },
]

// Tolerância da FC medida vs alvo, compatível com a correção D2 (janela de 5 s).
const TOL_FC_MEDIDA = 3

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

/** Reconstrói as 12 derivações da base SEM leadModifiers na FC dada (mesma seed). */
function reconstruirBase(fc: number): Record<string, number[]> {
  const p = {
    frequenciaCardiaca: fc, numeroIntervalos: 12, frequenciaAmostragem: FS,
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

/**
 * Duração do QRS de um batimento (ms) por subtração pareada.
 *
 * onset  = andando para trás de R até o primeiro retorno ao baseline PR.
 * offset = borda terminal do componente R' (= final − base). Nos leads do BRD o R'
 *          é sempre a última deflexão do QRS (a onda S base termina antes), então
 *          o R' define o fim do QRS. O componente pareado cancela a onda T (idêntica
 *          em final e base), de modo que a borda é limpa mesmo em taquicardia, quando
 *          a T se aproxima do QRS — evitando a contaminação que um detector de
 *          "retorno ao baseline" sofreria em FC alta.
 *
 * A janela de busca do R' é ABSOLUTA (o R' tem tempo fixo em ms), limitada a 40% do
 * RR para nunca alcançar o próximo batimento.
 */
function qrsDuracao(fin: number[], base: number[], r: number, rr: number): number | null {
  const bi = Math.round(r - 0.12 * rr), bf = Math.round(r - 0.06 * rr)
  if (bi < 0 || bf >= fin.length || bf <= bi) return null
  const baseln = mediana(fin.slice(bi, bf + 1))
  const thr = Math.max(0.05, 0.10 * Math.abs(fin[r] - baseln))

  let onset = r
  const li = Math.max(0, Math.round(r - 0.15 * rr))
  for (let k = r; k >= li; k--) { if (Math.abs(fin[k] - baseln) < thr) { onset = k; break } onset = k }

  const comp = fin.map((v, i) => v - base[i])
  let offRp = r
  const js = Math.min(fin.length - 1, r + Math.min(Math.round(0.16 * FS), Math.round(0.40 * rr)))
  for (let k = r; k <= js; k++) { if (Math.abs(comp[k]) > 0.05) offRp = k }
  if (offRp === r) return null // sem R' detectado neste lead/batimento

  return (offRp - onset) / FS * 1000
}

/** Fusão QRS↔T: exige um vale (dip) entre o fim do R' e a subida da T. */
function fusaoComT(fin: number[], r: number, rr: number): boolean {
  const i0 = r + Math.round(0.10 * rr), i1 = r + Math.round(0.30 * rr)
  if (i1 >= fin.length) return false
  const seg = fin.slice(i0, i1)
  return (Math.max(...seg) - Math.min(...seg)) < 0.03
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

// ── Coleta de métricas para uma FC ───────────────────────────────────────────
interface Metricas {
  fc: number; seeds: number
  qV1: number[]; qV2: number[]; qI: number[]; qAVL: number[]; qV5: number[]; qV6: number[]
  rpV1: number[]; rpV2: number[]; sI: number[]; sAVL: number[]; sV5: number[]; sV6: number[]
  target: number[]; measured: number[]
  clip: number; nan: number; ctrl: number; fus: number
}

function coletar(fcAlvo: number, nSeeds: number): Metricas {
  const m: Metricas = {
    fc: fcAlvo, seeds: nSeeds,
    qV1: [], qV2: [], qI: [], qAVL: [], qV5: [], qV6: [],
    rpV1: [], rpV2: [], sI: [], sAVL: [], sV5: [], sV6: [],
    target: [], measured: [], clip: 0, nan: 0, ctrl: 0, fus: 0,
  }
  const rr = FS * 60 / fcAlvo

  for (let seed = 1; seed <= nSeeds; seed++) {
    const r1 = patchRng(seed)
    const resp = generateECG({ presetId: 'bloqueio_ramo_direito', selectedLeads: LEADS, durationSeconds: 5, patientHeartRate: fcAlvo })
    r1()
    const r2 = patchRng(seed)
    const base = reconstruirBase(fcAlvo)
    r2()

    const fin: Record<string, number[]> = {}
    for (const d of LEADS) fin[d] = resp.leads[d] as number[]

    m.target.push(resp.metadata.targetHeartRate)
    m.measured.push(resp.metadata.measuredHeartRate)

    if (LEADS.some((d) => temNaN(fin[d]))) m.nan++
    if (LEADS.some((d) => temClipping(fin[d]))) m.clip++
    for (const cc of CONTROLES) {
      let dif = 0
      for (let i = 0; i < fin[cc].length; i++) dif = Math.max(dif, Math.abs(fin[cc][i] - base[cc][i]))
      if (dif > 1e-9) { m.ctrl++; break }
    }

    const rPeaks = detectarR(base['II'])
    const internos = rPeaks.filter((r) => r - 0.15 * rr >= 0 && r + 0.30 * rr < base['II'].length)

    const colQrs = (d: string, acc: number[]) => {
      const xs: number[] = []
      for (const r of internos) { const v = qrsDuracao(fin[d], base[d], r, rr); if (v !== null) xs.push(v) }
      if (xs.length) acc.push(mediana(xs))
    }
    colQrs('V1', m.qV1); colQrs('V2', m.qV2); colQrs('I', m.qI); colQrs('aVL', m.qAVL); colQrs('V5', m.qV5); colQrs('V6', m.qV6)

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
    m.rpV1.push(ampPos('V1')); m.rpV2.push(ampPos('V2'))
    m.sI.push(deltaNeg('I')); m.sAVL.push(deltaNeg('aVL')); m.sV5.push(deltaNeg('V5')); m.sV6.push(deltaNeg('V6'))

    for (const r of internos) { if (fusaoComT(fin['V1'], r, rr)) { m.fus++; break } }
  }
  return m
}

// Coleta uma vez por FC (asserts abaixo consultam o mapa).
const M = new Map<number, Metricas>()
for (const { fc, seeds } of FREQUENCIAS) M.set(fc, coletar(fc, seeds))

// ── Asserções por frequência ─────────────────────────────────────────────────
for (const { fc } of FREQUENCIAS) {
  const m = M.get(fc)!

  test(`FC ${fc}: targetHeartRate == patientHeartRate solicitada`, () => {
    assert.ok(m.target.every((t) => t === fc), `targetHeartRate divergente: ${[...new Set(m.target)]}`)
  })

  test(`FC ${fc}: measuredHeartRate dentro de ±${TOL_FC_MEDIDA} bpm (D2)`, () => {
    const fora = m.measured.filter((v) => Math.abs(v - fc) > TOL_FC_MEDIDA)
    assert.equal(fora.length, 0, `measuredHeartRate fora de ±${TOL_FC_MEDIDA}: min=${Math.min(...m.measured)} max=${Math.max(...m.measured)}`)
  })

  test(`FC ${fc}: QRS V1 em 120–160 ms (todas as seeds)`, () => {
    assert.ok(Math.min(...m.qV1) >= 120, `min QRS V1 = ${Math.min(...m.qV1)} ms`)
    assert.ok(Math.max(...m.qV1) <= 160, `max QRS V1 = ${Math.max(...m.qV1)} ms`)
  })

  test(`FC ${fc}: QRS V2 em 120–160 ms (todas as seeds)`, () => {
    assert.ok(Math.min(...m.qV2) >= 120, `min QRS V2 = ${Math.min(...m.qV2)} ms`)
    assert.ok(Math.max(...m.qV2) <= 160, `max QRS V2 = ${Math.max(...m.qV2)} ms`)
  })

  test(`FC ${fc}: QRS lateral (I/aVL/V5/V6) ≤ 160 ms`, () => {
    for (const [nome, arr] of [['I', m.qI], ['aVL', m.qAVL], ['V5', m.qV5], ['V6', m.qV6]] as const) {
      assert.ok(Math.max(...arr) <= 160, `QRS ${nome} máx = ${Math.max(...arr)} ms (> 160)`)
      assert.ok(mediana(arr) >= 120, `QRS ${nome} mediano = ${mediana(arr)} ms (< 120)`)
    }
  })

  test(`FC ${fc}: R' terminal mensurável em V1 e V2`, () => {
    assert.ok(mediana(m.rpV1) > 0.05, `R' V1 = ${mediana(m.rpV1).toFixed(3)} mV`)
    assert.ok(mediana(m.rpV2) > 0.03, `R' V2 = ${mediana(m.rpV2).toFixed(3)} mV`)
  })

  test(`FC ${fc}: S terminal larga em I/aVL/V5/V6`, () => {
    for (const [nome, arr] of [['I', m.sI], ['aVL', m.sAVL], ['V5', m.sV5], ['V6', m.sV6]] as const) {
      assert.ok(mediana(arr) < -0.05, `S ${nome} = ${mediana(arr).toFixed(3)} mV`)
    }
  })

  test(`FC ${fc}: ausência de fusão do QRS com a onda T`, () => {
    assert.equal(m.fus, 0, `${m.fus} seeds com fusão QRS-T`)
  })

  test(`FC ${fc}: ausência de clipping`, () => {
    assert.equal(m.clip, 0, `${m.clip} seeds com clipping`)
  })

  test(`FC ${fc}: ausência de NaN/Infinity`, () => {
    assert.equal(m.nan, 0, `${m.nan} seeds com NaN/Infinity`)
  })

  test(`FC ${fc}: derivações de controle inalteradas`, () => {
    assert.equal(m.ctrl, 0, `${m.ctrl} seeds com derivação de controle alterada`)
  })
}
