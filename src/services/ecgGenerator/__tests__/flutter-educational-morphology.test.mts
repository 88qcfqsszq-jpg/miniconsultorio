/**
 * Teste permanente de regressão — morfologia educacional do Flutter Atrial 2:1.
 *
 * Mede o SINAL GERADO por generateECG (não apenas lê o preset). Garante que as
 * ondas F sejam claramente reconhecíveis e clinicamente coerentes:
 *   - frequência atrial ≈ 300 bpm, ventricular ≈ 150 bpm, razão ≈ 2:1;
 *   - atividade atrial contínua (≈ 2 ondas F por intervalo RR);
 *   - polaridade negativa em II/III/aVF e positiva em V1;
 *   - razão F/QRS em DII na faixa educacional aprovada (≈ 0,13–0,20);
 *   - overlay aplicado UMA única vez; sem clipping; sem NaN/Infinity;
 *   - derivações sem modificador inalteradas;
 *   - Normal/BRD/IAM não recebem fWaveOverlay em DII;
 *   - regeneração (outra seed) preserva as métricas.
 *
 * A onda F é isolada por SUBTRAÇÃO PAREADA (final − base reconstruída sem
 * leadModifiers, mesma seed) e caracterizada por DFT.
 *
 * Coerência DII curta ↔ tira longa: por ser característica do componente React,
 * é verificada estaticamente (ambos recebem ecgData.leads.II em ECGTrace.tsx).
 *
 * Runner: npx tsx --test src/services/ecgGenerator/__tests__/flutter-educational-morphology.test.mts
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

import { generateECG } from '../index'
import { ecgsynAdapter } from '../ecgsynAdapter'
import { transformarEm12Derivacoes } from '../leadTransform'
import { getPresetById } from '../presets/index'
import type { ECGLead } from '@/lib/ecg/types'
import type { ECGPreset } from '../types'

const FS = 250
const N_SEEDS = 100
const LEADS: ECGLead[] = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6']
// Derivações do preset Flutter SEM fWaveOverlay (devem ficar idênticas à base).
const FLUTTER_CONTROLES: ECGLead[] = ['I', 'aVR', 'V2', 'V3', 'V4', 'V5', 'V6']
// Faixa educacional de F/QRS em DII.
const FQRS_MIN = 0.13
const FQRS_MAX = 0.20

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

/** Reconstrói as 12 derivações da base SEM leadModifiers (mesma seed). */
function reconstruirBase(preset: ECGPreset, fc: number): Record<string, number[]> {
  const m = preset.morphology
  const p = {
    frequenciaCardiaca: fc, numeroIntervalos: 12, frequenciaAmostragem: FS,
    variacaoRR: preset.rrVariability, razaoLFHF: 1.0,
    amplitude: { P: m.pAmplitude, Q: m.qAmplitude, R: m.rAmplitude, S: m.sAmplitude, T: m.tAmplitude },
    duracao: 5, ruido: 0, agrupoIdade: 'adulto' as const,
  }
  const sb = ecgsynAdapter.gerarSinalECGSyn(p)
  let proc = [...sb.valores]
  proc = ecgsynAdapter.aplicarFiltroPassaAlta(proc, 0.5, FS)
  proc = ecgsynAdapter.normalizarSinal(proc, 1.0)
  return transformarEm12Derivacoes(proc, 60)
}

const maxAbs = (a: number[]): number => Math.max(...a.map(Math.abs))
const mediana = (a: number[]): number => { const o = [...a].sort((x, y) => x - y); const i = Math.floor(o.length / 2); return o.length % 2 ? o[i] : (o[i - 1] + o[i]) / 2 }
const temNaN = (s: number[]): boolean => s.some((v) => !Number.isFinite(v))

function temClipping(s: number[]): boolean {
  const mx = Math.max(...s), mn = Math.min(...s)
  let rM = 0, rm = 0
  for (let i = 0; i < s.length; i++) {
    if (Math.abs(s[i] - mx) < 1e-9) { rM++; if (rM >= 3) return true } else rM = 0
    if (mn < -1e-3 && Math.abs(s[i] - mn) < 1e-9) { rm++; if (rm >= 3) return true } else rm = 0
  }
  return false
}

function dft(sig: number[], fHz: number): number {
  const w = 2 * Math.PI * fHz / FS
  let re = 0, im = 0
  for (let n = 0; n < sig.length; n++) { re += sig[n] * Math.cos(w * n); im -= sig[n] * Math.sin(w * n) }
  return Math.sqrt(re * re + im * im) / sig.length
}
function freqPicoBpm(sig: number[]): number {
  let bf = 0, bm = -1
  for (let f = 1; f <= 8; f += 0.05) { const mg = dft(sig, f); if (mg > bm) { bm = mg; bf = f } }
  return bf * 60
}
function detR(s: number[]): number[] {
  const l = maxAbs(s) * 0.6
  const c: number[] = []
  let e = false, idx = 0, v = 0
  for (let i = 1; i < s.length - 1; i++) {
    if (Math.abs(s[i]) > l && !e) { e = true; idx = i; v = s[i] }
    if (e && Math.abs(s[i]) > Math.abs(v)) { idx = i; v = s[i] }
    if (e && Math.abs(s[i]) < l * 0.5) { if (c.length === 0 || idx - c[c.length - 1] > FS * 0.3) c.push(idx); e = false }
  }
  return c
}
function corr(a: number[], b: number[]): number {
  const ma = a.reduce((x, y) => x + y, 0) / a.length, mb = b.reduce((x, y) => x + y, 0) / b.length
  let n = 0, da = 0, db = 0
  for (let i = 0; i < a.length; i++) { n += (a[i] - ma) * (b[i] - mb); da += (a[i] - ma) ** 2; db += (b[i] - mb) ** 2 }
  return n / Math.sqrt(da * db)
}

const flutter = getPresetById('flutter_atrial_2_1')!

// ── Coleta em 100 seeds (Flutter) ────────────────────────────────────────────
interface Agg {
  fcAtrial: number[]; fcVent: number[]; razaoAV: number[]; fqDII: number[]
  corrIIV1: number[]; corrIIIII: number[]; ampOverlayDII: number[]
  fPorRR: number[]; janContinuas: number[]; picoDIImax: number[]
  clip: number; nan: number; ctrl: number; dup: number
}
const A: Agg = { fcAtrial: [], fcVent: [], razaoAV: [], fqDII: [], corrIIV1: [], corrIIIII: [], ampOverlayDII: [], fPorRR: [], janContinuas: [], picoDIImax: [], clip: 0, nan: 0, ctrl: 0, dup: 0 }
const AMP_DII_CONFIG = flutter.leadModifiers!['II']!.fWaveOverlay!.amplitudeMv

for (let seed = 1; seed <= N_SEEDS; seed++) {
  const r1 = patchRng(seed)
  const resp = generateECG({ presetId: 'flutter_atrial_2_1', selectedLeads: LEADS, durationSeconds: 5, samplingRate: 250 })
  r1()
  const r2 = patchRng(seed)
  const base = reconstruirBase(flutter, 150)
  r2()

  const fin: Record<string, number[]> = {}
  for (const d of LEADS) fin[d] = resp.leads[d] as number[]

  if (LEADS.some((d) => temNaN(fin[d]))) A.nan++
  if (LEADS.some((d) => temClipping(fin[d]))) A.clip++
  for (const cc of FLUTTER_CONTROLES) {
    let dif = 0
    for (let i = 0; i < fin[cc].length; i++) dif = Math.max(dif, Math.abs(fin[cc][i] - base[cc][i]))
    if (dif > 1e-9) { A.ctrl++; break }
  }

  const ovII = fin['II'].map((v, i) => v - base['II'][i])
  const ovIII = fin['III'].map((v, i) => v - base['III'][i])
  const ovV1 = fin['V1'].map((v, i) => v - base['V1'][i])

  // Overlay aplicado uma única vez: amplitude medida ≈ configurada (não o dobro).
  if (Math.abs(maxAbs(ovII) - AMP_DII_CONFIG) > 0.02) A.dup++
  A.ampOverlayDII.push(maxAbs(ovII))

  A.fcAtrial.push(freqPicoBpm(ovII))
  A.fqDII.push(maxAbs(ovII) / maxAbs(fin['II']))
  A.corrIIV1.push(corr(ovII, ovV1))
  A.corrIIIII.push(corr(ovII, ovIII))
  A.picoDIImax.push(Math.max(...fin['II']))

  const rPeaks = detR(base['II'])
  const rrs = rPeaks.slice(1).map((p, i) => (p - rPeaks[i]) / FS)
  const fcV = 60 / (rrs.reduce((a, c) => a + c, 0) / rrs.length)
  A.fcVent.push(fcV)
  A.razaoAV.push(freqPicoBpm(ovII) / fcV)
  // Ondas F por RR = razão frequência atrial/ventricular.
  A.fPorRR.push(freqPicoBpm(ovII) / fcV)

  // Continuidade: todas as janelas de 0,2 s (1 período F) têm atividade.
  let ja = 0, jt = 0
  for (let st = 0; st + 50 <= ovII.length; st += 50) { const seg = ovII.slice(st, st + 50); if (Math.max(...seg) - Math.min(...seg) > 0.05) ja++; jt++ }
  A.janContinuas.push(ja === jt ? 1 : 0)
}

// ── Asserções (Flutter) ──────────────────────────────────────────────────────
test('Flutter: frequência atrial ≈ 300 bpm (285–315) em todas as seeds', () => {
  assert.ok(A.fcAtrial.every((f) => f >= 285 && f <= 315), `atrial fora: min=${Math.min(...A.fcAtrial).toFixed(0)} max=${Math.max(...A.fcAtrial).toFixed(0)}`)
})
test('Flutter: frequência ventricular ≈ 150 bpm (147–153)', () => {
  assert.ok(A.fcVent.every((f) => f >= 147 && f <= 153), `ventricular fora: min=${Math.min(...A.fcVent).toFixed(1)} max=${Math.max(...A.fcVent).toFixed(1)}`)
})
test('Flutter: razão atrial/ventricular ≈ 2:1 (1,9–2,1)', () => {
  assert.ok(A.razaoAV.every((r) => r >= 1.9 && r <= 2.1), `razão fora: min=${Math.min(...A.razaoAV).toFixed(2)} max=${Math.max(...A.razaoAV).toFixed(2)}`)
})
test('Flutter: ≈ 2 ondas F por intervalo RR', () => {
  const m = mediana(A.fPorRR)
  assert.ok(m >= 1.9 && m <= 2.1, `F por RR mediano = ${m.toFixed(2)}`)
})
test('Flutter: atividade atrial contínua (sem isoelétrica prolongada)', () => {
  assert.ok(A.janContinuas.every((v) => v === 1), `${A.janContinuas.filter((v) => v === 0).length} seeds com janela sem atividade F`)
})
test('Flutter: polaridade — II negativa/oposta a V1 (positiva)', () => {
  assert.ok(mediana(A.corrIIV1) < -0.9, `corr(II,V1) mediana = ${mediana(A.corrIIV1).toFixed(2)} (esperado < -0.9)`)
})
test('Flutter: polaridade — II e III mesma orientação (ambas inferiores negativas)', () => {
  assert.ok(mediana(A.corrIIIII) > 0.9, `corr(II,III) mediana = ${mediana(A.corrIIIII).toFixed(2)} (esperado > 0.9)`)
})
test('Flutter: razão F/QRS em DII na faixa educacional (0,13–0,20)', () => {
  const m = mediana(A.fqDII)
  assert.ok(m >= FQRS_MIN && m <= FQRS_MAX, `F/QRS DII mediano = ${m.toFixed(3)} fora de [${FQRS_MIN}, ${FQRS_MAX}]`)
})
test('Flutter: ondas F não dominam o QRS (pico DII < 2,5 mV)', () => {
  assert.ok(Math.max(...A.picoDIImax) < 2.5, `pico DII máx = ${Math.max(...A.picoDIImax).toFixed(2)} mV`)
})
test('Flutter: overlay aplicado UMA única vez (amplitude ≈ configurada)', () => {
  assert.equal(A.dup, 0, `${A.dup} seeds com amplitude de overlay divergente da configurada (${AMP_DII_CONFIG} mV)`)
})
test('Flutter: ausência de clipping', () => { assert.equal(A.clip, 0, `${A.clip} seeds com clipping`) })
test('Flutter: ausência de NaN/Infinity', () => { assert.equal(A.nan, 0, `${A.nan} seeds com NaN/Infinity`) })
test('Flutter: derivações sem modificador (I/aVR/V2–V6) inalteradas', () => {
  assert.equal(A.ctrl, 0, `${A.ctrl} seeds com derivação de controle alterada`)
})

// ── Ausência de fWaveOverlay em Normal/BRD/IAM (medido no sinal) ──────────────
function componenteAtrial5Hz(presetId: string, fc: number): number {
  const preset = getPresetById(presetId)!
  const restore = patchRng(1)
  const resp = generateECG({ presetId, selectedLeads: LEADS, durationSeconds: 5, samplingRate: 250 })
  restore()
  const r2 = patchRng(1)
  const base = reconstruirBase(preset, fc)
  r2()
  const ov = (resp.leads['II'] as number[]).map((v, i) => v - base['II'][i])
  return maxAbs(ov) // desvio da DII vs base sem modificadores
}
test('Normal adulto: DII sem onda F (sem componente atrial 5 Hz)', () => {
  const amp = componenteAtrial5Hz('normal_adulto', 75)
  assert.ok(amp < 0.02, `desvio DII vs base = ${amp.toFixed(4)} mV (esperado ~0, sem overlay)`)
})
test('BRD: DII sem onda F (não recebe fWaveOverlay)', () => {
  const amp = componenteAtrial5Hz('bloqueio_ramo_direito', 75)
  assert.ok(amp < 0.02, `desvio DII vs base = ${amp.toFixed(4)} mV`)
})
test('IAM anterosseptal: DII sem onda F (não recebe fWaveOverlay)', () => {
  const amp = componenteAtrial5Hz('iam_supra_anterosseptal', 75)
  assert.ok(amp < 0.02, `desvio DII vs base = ${amp.toFixed(4)} mV`)
})

// ── Regeneração preserva métricas (outra seed) ───────────────────────────────
test('Flutter: regeneração (seed distinta) preserva atrial/ventricular/razão', () => {
  const restore = patchRng(4242)
  const resp = generateECG({ presetId: 'flutter_atrial_2_1', selectedLeads: LEADS, durationSeconds: 5, samplingRate: 250 })
  restore()
  const r2 = patchRng(4242)
  const base = reconstruirBase(flutter, 150)
  r2()
  const ovII = (resp.leads['II'] as number[]).map((v, i) => v - base['II'][i])
  const fA = freqPicoBpm(ovII)
  const rPeaks = detR(base['II'])
  const rrs = rPeaks.slice(1).map((p, i) => (p - rPeaks[i]) / FS)
  const fcV = 60 / (rrs.reduce((a, c) => a + c, 0) / rrs.length)
  assert.ok(fA >= 285 && fA <= 315, `atrial regen = ${fA.toFixed(0)}`)
  assert.ok(fcV >= 147 && fcV <= 153, `ventricular regen = ${fcV.toFixed(1)}`)
  assert.ok(fA / fcV >= 1.9 && fA / fcV <= 2.1, `razão regen = ${(fA / fcV).toFixed(2)}`)
})

// ── Coerência DII curta ↔ tira longa (verificação estática do componente) ─────
test('ECGTrace: DII curta (grid) e tira longa recebem ecgData.leads.II', () => {
  const here = dirname(fileURLToPath(import.meta.url))
  const src = readFileSync(resolve(here, '../../../../components/ECGTrace.tsx'), 'utf8')
  // Tira longa consome ecgData.leads.II.
  assert.ok(/EcgRhythmStrip\s+dados=\{ecgData\.leads\.II\}/.test(src), 'tira longa não usa ecgData.leads.II')
  // Grid renderiza II a partir de ecgData.leads[lead] (mesma fonte).
  assert.ok(/ecgData\.leads\[lead\]/.test(src), 'grid não usa ecgData.leads[lead]')
  assert.ok(/\['II',\s*'aVL',\s*'V2',\s*'V5'\]/.test(src), 'II não está na grade de derivações curtas')
})
