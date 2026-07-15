/**
 * Modificadores morfológicos por derivação (Commit 3b — infraestrutura runtime).
 *
 * Aplica desvio do segmento ST em derivações específicas SEM tocar no sinal base
 * global e SEM mutar os arrays recebidos. Executa apenas quando o preset possui
 * `leadModifiers`; caso contrário, devolve as derivações inalteradas (mesma
 * referência), preservando integralmente o comportamento anterior.
 *
 * Pipeline esperado (em index.ts):
 *   ECGSYN base → transformarEm12Derivacoes → aplicarModificadoresPorDerivacao
 *   → (medição/auditoria) → interpretação/resposta → renderização
 *
 * Nota de contrato: a auditoria é RETORNADA por esta função. Não é anexada a
 * RespostaGeracaoECG.metadata porque o tipo atual da metadata é um objeto literal
 * fechado (sem índice) e estendê-lo exigiria editar types.ts — proibido no 3b.
 * A fiação com a metadata fica para uma etapa que possa alterar types.ts.
 */

import type { Dados12Derivacoes, ModificadoresPorDerivacao, DerivacaoClinica } from './types'
import { detectarComplexosQRS } from './ecgsynAdapter'

// ============================================================================
// TIPOS DE RETORNO (locais ao 3b — não tocam em types.ts)
// ============================================================================

export interface MedicaoST {
  measuredAmplitudeMv?: number
  beatCount: number
}

export interface LeadModifierMeasurement {
  expectedType: 'elevation' | 'depression'
  expectedAmplitudeMv: number
  /** Desnível de ST medido no sinal ORIGINAL (antes do modificador). */
  baselineMeasurementMv?: number
  /** Desnível de ST medido no sinal MODIFICADO (depois do modificador). */
  finalMeasurementMv?: number
  /** Delta aplicado = final − baseline. Robusto a desnível pré-existente. */
  appliedDeltaMv?: number
  beatCount: number
}

export interface LeadModifierAudit {
  applied: boolean
  modifiedLeads: string[]
  measurements: Record<string, LeadModifierMeasurement>
  warnings: string[]
}

export interface ResultadoModificadoresDerivacao {
  leads: Dados12Derivacoes
  audit: LeadModifierAudit
}

// ============================================================================
// CONSTANTES DA JANELA ST
// ============================================================================

/** Derivação de referência para detectar os picos R (R positiva estável). */
const DERIVACAO_REFERENCIA: DerivacaoClinica = 'II'
/** Ponto J aproximado após o pico R, em fração do RR local. */
const FRACAO_PONTO_J = 0.06
/**
 * Fim da janela de modificação: pico da onda T, empiricamente R+0.22·RR no
 * modelo gerarBatimento (centro gaussiana T = fase 0.45, pico R = fase 0.23;
 * diferença = 0.22). Validado nas três frequências auditadas (60/108/150 bpm).
 * Em u=1 (pico da T) o envelope vale 0 — a T natural absorve a transição.
 */
const FRACAO_FIM_ST    = 0.22
/**
 * Perfil de elevação de ST em quatro fases:
 *
 *   PRE_RAMPA_MS   : duração da pré-rampa antes do J, em ms.
 *                    Converte para 2–3 amostras @ 250 Hz.
 *                    Elimina o degrau abrupto no ponto J.
 *   J_FLOOR        : nível do envelope no ponto J (u=0), como fração de 1.0.
 *                    Mantém o J claramente elevado sem quina excessiva.
 *   FRACAO_ACOMOD  : fração da janela positiva para subida J_FLOOR → 1.0.
 *   FRACAO_PLATO_FIM: fração até onde o platô permanece em 1.0.
 *   Fase D (fade)  : descida cossenoidal de 1.0 a 0.0 até o pico da T.
 */
const PRE_RAMPA_MS     = 10     // 10 ms → 3 amostras @ 250 Hz (clamped [2,3])
const J_FLOOR          = 0.55   // 55% da amplitude em J (~0.19 mV em V2@0.35 mV); max Δ pré-rampa = 0.096 mV ≤ 0.10 mV
const FRACAO_ACOMOD    = 0.12   // Fase B: J_FLOOR→1.0 em 12% da janela positiva
const FRACAO_PLATO_FIM = 0.38   // Fase C: platô em 1.0 até 38% da janela positiva
/**
 * Ponto de medição adaptativo: fração da janela positiva J→pico_T.
 * U=0.25 fica no centro da Fase C (platô, envelope=1.0) para FC 60–200 bpm @ 250 Hz.
 * Substitui medição fixa em J+40ms, que saía do platô em taquicardias (FC ≥ ~120 bpm).
 */
const MEDICAO_FRACAO_JANELA = 0.25
/**
 * Janela de baseline no segmento PR (isoelétrico, APÓS a onda P e ANTES da Q),
 * em fração do RR local. Validada empiricamente no sinal ECGSYN real: a fase
 * ~0,15–0,19 do ciclo é isoelétrica (~0,001–0,03 mV). NÃO usar R−0,20…R−0,12:
 * nesse modelo essa faixa cai sobre a própria onda P (fase ~0,03–0,11).
 */
const FRACAO_BASELINE_INICIO = 0.08 // R − 0,08·RR (fase ~0,15)
const FRACAO_BASELINE_FIM = 0.045 // R − 0,045·RR (fase ~0,185)

// ============================================================================
// FUNÇÕES AUXILIARES (puras)
// ============================================================================

/** RR local em amostras para o batimento i (usa o vizinho quando na borda). */
function rrLocalAmostras(rPeaks: number[], i: number): number {
  if (rPeaks.length < 2) return 0
  if (i < rPeaks.length - 1) return rPeaks[i + 1] - rPeaks[i]
  return rPeaks[i] - rPeaks[i - 1]
}

/** Mediana de uma lista de números finitos (retorna undefined se vazia). */
function mediana(valores: number[]): number | undefined {
  const finitos = valores.filter((v) => Number.isFinite(v))
  if (finitos.length === 0) return undefined
  const ord = [...finitos].sort((a, b) => a - b)
  const meio = Math.floor(ord.length / 2)
  return ord.length % 2 !== 0 ? ord[meio] : (ord[meio - 1] + ord[meio]) / 2
}

/** Número de amostras da pré-rampa para a taxa de amostragem dada. */
function nPreRampa(samplingRate: number): number {
  return Math.min(3, Math.max(2, Math.round(PRE_RAMPA_MS / 1000 * samplingRate)))
}

/**
 * Envelope ST — parte positiva, u ∈ [0, 1] (ponto J ao pico da T):
 *
 *   u=0 (J) → J_FLOOR  (pré-rampa garante continuidade; sem degrau)
 *   Fase B [0, ACOMOD):      J_FLOOR → 1.0 (meio-coseno ascendente)
 *   Fase C [ACOMOD, PLATO]:  platô em 1.0 — ST plano e reconhecível
 *   Fase D (PLATO, 1):       1.0 → 0 (cossenoidal; o modificador decresce
 *                            durante a subida da T e chega a 0 no pico)
 *   u ≥ 1 → 0  (após pico T: descida da T e TP inalterados)
 */
function envelopeSTPos(u: number): number {
  if (u <= 0) return J_FLOOR
  if (u >= 1) return 0
  // Fase B: J_FLOOR → 1.0
  if (u < FRACAO_ACOMOD)
    return J_FLOOR + (1.0 - J_FLOOR) * 0.5 * (1 - Math.cos(Math.PI * u / FRACAO_ACOMOD))
  // Fase C: platô
  if (u <= FRACAO_PLATO_FIM)
    return 1.0
  // Fase D: descida cossenoidal até 0 no pico da T
  const t = (u - FRACAO_PLATO_FIM) / (1.0 - FRACAO_PLATO_FIM)
  return 0.5 * (1.0 + Math.cos(Math.PI * t))
}

/** Deriva a derivação de referência (DII) ou a primeira derivação válida disponível. */
function obterDerivacaoReferencia(leads: Dados12Derivacoes): number[] | undefined {
  const ref = leads[DERIVACAO_REFERENCIA]
  if (Array.isArray(ref) && ref.length > 0) return ref
  for (const chave of Object.keys(leads)) {
    const arr = leads[chave]
    if (Array.isArray(arr) && arr.length > 0) return arr
  }
  return undefined
}

/**
 * Aplica o desvio de ST em UMA derivação, retornando um NOVO array (sem mutar).
 *
 * Janela de modificação por batimento:
 *   Fase A (pré-rampa): [jIdx − N_PRE, jIdx)  — N_PRE=2–3 amostras, 0→J_FLOOR
 *   Fases B-D (pos):    [jIdx, fimIdx]          — J_FLOOR→platô→0 no pico T
 *
 * P e maior parte do QRS ficam intactos. Apenas o terminal da onda S
 * (N_PRE amostras) e o segmento ST-T são modificados.
 */
function aplicarSTEmDerivacao(
  arr: number[],
  rPeaks: number[],
  tipo: 'elevation' | 'depression',
  amplitudeMv: number,
  samplingRate: number
): number[] {
  const saida = arr.slice()
  const sinal = tipo === 'depression' ? -1 : 1
  const N_PRE = nPreRampa(samplingRate)

  for (let i = 0; i < rPeaks.length; i++) {
    const r = rPeaks[i]
    const rr = rrLocalAmostras(rPeaks, i)
    if (!(rr > 0)) continue

    const jIdx  = Math.round(r + FRACAO_PONTO_J * rr)
    const fimIdx = Math.round(r + FRACAO_FIM_ST * rr)
    if (fimIdx <= jIdx) continue

    const winLen = fimIdx - jIdx

    // Fase A — pré-rampa: 0 → J_FLOOR (meio-coseno); nunca atinge o pico R.
    const preStart = Math.max(r + 1, jIdx - N_PRE)
    const actualNPre = jIdx - preStart
    for (let k = preStart; k < jIdx; k++) {
      const uPre = (k - preStart) / actualNPre  // [0, 1)
      const envPre = J_FLOOR * 0.5 * (1 - Math.cos(Math.PI * uPre))
      saida[Math.min(k, saida.length - 1)] += sinal * amplitudeMv * envPre
    }

    // Fases B-D — parte positiva: J_FLOOR → platô → 0 no pico T.
    const inicio = Math.max(0, jIdx)
    const fim = Math.min(saida.length - 1, fimIdx)
    for (let k = inicio; k <= fim; k++) {
      const u = (k - jIdx) / winLen
      saida[k] += sinal * amplitudeMv * envelopeSTPos(u)
    }
  }

  return saida
}

// ============================================================================
// MEDIÇÃO DE ST (auditoria — não substitui o contrato do preset)
// ============================================================================

/**
 * Mede o desnível médio de ST (mediana entre batimentos) de uma derivação.
 * Baseline = trecho PR (pré-QRS); ponto de medição = J + 40 ms. Ignora batimentos
 * de borda cujos índices caiam fora do array. Nunca usa o pico R como baseline.
 */
export function medirDesnivelST(
  lead: number[],
  rPeaks: number[],
  samplingRate: number
): MedicaoST {
  const desvios: number[] = []

  for (let i = 0; i < rPeaks.length; i++) {
    const r = rPeaks[i]
    const rr = rrLocalAmostras(rPeaks, i)
    if (!(rr > 0)) continue

    const jIdx   = Math.round(r + FRACAO_PONTO_J * rr)
    const fimIdx = Math.round(r + FRACAO_FIM_ST * rr)
    const winLen = fimIdx - jIdx
    if (winLen <= 0) continue
    // Centro do platô (Fase C): u=0.25 → envelope=1.0 para FC 60–200 bpm @ 250 Hz.
    const offsetMedicao = Math.max(1, Math.round(MEDICAO_FRACAO_JANELA * winLen))
    const medIdx = jIdx + offsetMedicao
    // Baseline = mediana de uma janela isoelétrica no PR (após P, antes de Q).
    const baseInicio = Math.round(r - FRACAO_BASELINE_INICIO * rr)
    const baseFim = Math.round(r - FRACAO_BASELINE_FIM * rr)

    // Bordas incompletas: pular batimentos cujos índices saiam do array.
    if (baseInicio < 0 || medIdx >= lead.length || baseFim <= baseInicio) continue

    const baseline = mediana(lead.slice(baseInicio, baseFim + 1))
    const st = lead[medIdx]
    if (baseline === undefined || !Number.isFinite(st)) continue

    desvios.push(st - baseline)
  }

  const medianaDesvio = mediana(desvios)
  return { measuredAmplitudeMv: medianaDesvio, beatCount: desvios.length }
}

// ============================================================================
// FUNÇÃO PRINCIPAL
// ============================================================================

/**
 * Aplica os modificadores morfológicos por derivação sobre as 12 derivações já
 * transformadas. Função pura: não muta a entrada; copia apenas as derivações
 * efetivamente modificadas e preserva as demais (mesma referência).
 *
 * Comportamento sem modificadores: devolve `leads` inalterado (mesma referência),
 * `applied: false`, sem custo de cópia.
 */
export function aplicarModificadoresPorDerivacao(
  leads: Dados12Derivacoes,
  modifiers: ModificadoresPorDerivacao | undefined,
  samplingRate: number
): ResultadoModificadoresDerivacao {
  const warnings: string[] = []

  const entradas = modifiers ? Object.entries(modifiers) : []

  // tWavePolarity NÃO é implementado no 3b — registrar sem fingir aplicação.
  for (const [leadName, mod] of entradas) {
    if (mod?.tWavePolarity) {
      warnings.push(
        `tWavePolarity em ${leadName} ainda não aplicado (Commit 3b implementa somente stShift).`
      )
    }
  }

  const ativos = entradas.filter(([, mod]) => mod?.stShift)
  if (ativos.length === 0) {
    return {
      leads,
      audit: { applied: false, modifiedLeads: [], measurements: {}, warnings },
    }
  }

  const referencia = obterDerivacaoReferencia(leads)
  const rPeaks = referencia ? detectarComplexosQRS(referencia, samplingRate) : []
  if (rPeaks.length < 2) {
    warnings.push(
      'Picos R insuficientes na derivação de referência; modificadores de ST não aplicados.'
    )
    return {
      leads,
      audit: { applied: false, modifiedLeads: [], measurements: {}, warnings },
    }
  }

  const novasLeads: Dados12Derivacoes = { ...leads }
  const measurements: Record<string, LeadModifierMeasurement> = {}
  const modifiedLeads: string[] = []

  for (const [leadName, mod] of ativos) {
    const arr = leads[leadName]
    if (!Array.isArray(arr) || arr.length === 0) {
      warnings.push(`Derivação ${leadName} ausente ou vazia; modificador ignorado.`)
      continue
    }

    const st = mod!.stShift!
    if (!Number.isFinite(st.amplitudeMv) || st.amplitudeMv <= 0) {
      warnings.push(
        `amplitudeMv inválida (${st.amplitudeMv}) em ${leadName}; modificador ignorado.`
      )
      continue
    }

    const modificada = aplicarSTEmDerivacao(arr, rPeaks, st.tipo, st.amplitudeMv, samplingRate)
    novasLeads[leadName] = modificada
    modifiedLeads.push(leadName)

    // Delta = desnível medido no modificado − desnível medido no original.
    // Cancela qualquer desnível pré-existente do sinal, isolando o efeito aplicado.
    const medOriginal = medirDesnivelST(arr, rPeaks, samplingRate)
    const medFinal = medirDesnivelST(modificada, rPeaks, samplingRate)
    const baselineMv = medOriginal.measuredAmplitudeMv
    const finalMv = medFinal.measuredAmplitudeMv
    const deltaMv =
      baselineMv !== undefined && finalMv !== undefined ? finalMv - baselineMv : undefined
    measurements[leadName] = {
      expectedType: st.tipo,
      expectedAmplitudeMv: st.amplitudeMv,
      baselineMeasurementMv: baselineMv,
      finalMeasurementMv: finalMv,
      appliedDeltaMv: deltaMv,
      beatCount: medFinal.beatCount,
    }
  }

  const applied = modifiedLeads.length > 0
  return {
    leads: applied ? novasLeads : leads,
    audit: { applied, modifiedLeads, measurements, warnings },
  }
}
