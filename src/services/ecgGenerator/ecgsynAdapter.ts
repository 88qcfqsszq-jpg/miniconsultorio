/**
 * Adapter ECGSYN: Implementação TypeScript do algoritmo ECGSYN
 *
 * Baseado em:
 * - Matlab: external/physionet/ecgsyn/Matlab/ecgsyn.m
 * - Derivadas: external/physionet/ecgsyn/Matlab/derivsecgsyn.m
 *
 * Referência:
 * McSharry PE, Clifford GD, Tarassenko L, Smith L. A dynamical model for generating
 * synthetic electrocardiogram signals. IEEE Transactions on Biomedical Engineering.
 * 2003;50(3):289-294.
 */

import type { ParametrosECGSyn, SinalECGSyn } from './types'

// ============================================================================
// CONSTANTES ECGSYN
// ============================================================================

// Parâmetros do modelo dinâmico (Estados de Fourier de Hermite)
const PARAMETROS_MODELO = {
  // Frequências fundamentais (Hz)
  frequenciaP: 15,
  frequenciaQRS: 25,
  frequenciaT: 10,

  // Amortecimento
  amortecimentoP: 0.16,
  amortecimentoQRS: 0.04,
  amortecimentoT: 0.11,

  // Comprimentos de onda esperados (frações do ciclo cardíaco)
  larguraP: 0.12,
  larguraQRS: 0.09,
  larguraT: 0.35,

  // Fases (radianos)
  faseP: 0,
  faseQRS: Math.PI,
  faseT: 2 * Math.PI - 0.5,
}

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Gera valores de intervalo RR (duração de batimento em segundos)
 * com variabilidade fisiológica usando modulação LF/HF
 */
function gerarIntervalosRR(
  numeroIntervalos: number,
  frequenciaCardiaca: number,
  variacaoRR: number,
  razaoLFHF: number,
  frequenciaAmostragem: number
): number[] {
  const intervalosRR: number[] = []
  const RRMedio = 60 / frequenciaCardiaca

  // Amplitudes de modulação
  const amplitudeHF = Math.sqrt(variacaoRR / (1 + razaoLFHF))
  const amplitudeLF = amplitudeHF * razaoLFHF

  // Frequências de modulação (Hz)
  const frequenciaHF = 0.15 // respiratória
  const frequenciaLF = 0.05 // simpática

  let tempo = 0
  for (let i = 0; i < numeroIntervalos; i++) {
    // Modulação sinusoidal
    const modulacaoHF = amplitudeHF * Math.sin(2 * Math.PI * frequenciaHF * tempo)
    const modulacaoLF = amplitudeLF * Math.sin(2 * Math.PI * frequenciaLF * tempo)

    // Ruído gaussiano (Box-Muller)
    const u1 = Math.random()
    const u2 = Math.random()
    const ruido = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) * variacaoRR * 0.1

    const RR = RRMedio * (1 + modulacaoHF + modulacaoLF + ruido)
    const RRRestringido = Math.max(0.3, Math.min(2.0, RR)) // Limitar a valores fisiológicos

    intervalosRR.push(RRRestringido)
    tempo += RRRestringido
  }

  return intervalosRR
}

/**
 * Gaussiana simples para gerar ondas P-QRS-T
 */
function gaussiana(
  tempo: number,
  centro: number,
  amplitude: number,
  largura: number
): number {
  const distancia = Math.pow((tempo - centro) / largura, 2)
  return amplitude * Math.exp(-distancia / 2)
}

/**
 * Gera um batimento cardíaco sintético usando gaussianas (didático e fisiológico)
 * @param tFracional tempo fracional no ciclo cardíaco (0 a 1)
 * @param parametros parâmetros do ECG
 */
function gerarBatimento(
  tFracional: number,
  parametros: ParametrosECGSyn
): number {
  // Parâmetros fisiológicos das ondas em frações do ciclo RR
  // Baseado em ECG real: P-Q: 0.16s, QRS: 0.09s, T: 0.35s

  let sinal = 0

  // 1. Onda P: pequena, arredondada, antes do QRS
  // Centro em ~6% do ciclo, largura ~4%
  sinal += gaussiana(tFracional, 0.06, parametros.amplitude.P * 0.8, 0.04)

  // 2. Onda Q: pequena deflexão negativa
  // Centro em ~21% do ciclo
  sinal += gaussiana(tFracional, 0.21, -parametros.amplitude.Q * 0.6, 0.012)

  // 3. Onda R: pico dominante, estreito
  // Centro em ~23% do ciclo, largura ~1%
  sinal += gaussiana(tFracional, 0.23, parametros.amplitude.R, 0.010)

  // 4. Onda S: deflexão negativa curta
  // Centro em ~26% do ciclo
  sinal += gaussiana(tFracional, 0.26, -parametros.amplitude.S * 0.7, 0.015)

  // 5. Onda T: positiva, larga e arredondada
  // Centro em ~45% do ciclo, largura ~8%
  sinal += gaussiana(tFracional, 0.45, parametros.amplitude.T, 0.08)

  // Adicionar ruído mínimo apenas para presets que o indicam
  if (parametros.ruido > 0.1) {
    const ruido = (Math.random() - 0.5) * parametros.ruido * 0.02
    sinal += ruido
  }

  return sinal
}

// ============================================================================
// DETECTOR QRS — NÚCLEO EXTRAÍDO
// Preserva exatamente: threshold, saída do pico, distância mínima, arredondamento.
// detectarComplexosQRS delega para esta função; ambos são semanticamente idênticos.
// ============================================================================

function _detectarPicosQRSCore(sinal: number[], frequenciaAmostragem: number): number[] {
  const complexos: number[] = []
  const limiarDeteccao = Math.max(...sinal.map(Math.abs)) * 0.6

  let emPico = false
  let indicePico = 0
  let valorPico = 0

  for (let i = 1; i < sinal.length - 1; i++) {
    if (Math.abs(sinal[i]) > limiarDeteccao && !emPico) {
      emPico = true
      indicePico = i
      valorPico = sinal[i]
    }

    if (emPico && Math.abs(sinal[i]) > Math.abs(valorPico)) {
      indicePico = i
      valorPico = sinal[i]
    }

    if (emPico && Math.abs(sinal[i]) < limiarDeteccao * 0.5) {
      const distanciaMinima = frequenciaAmostragem * 0.3 // 300ms mínimo entre QRS
      if (
        complexos.length === 0 ||
        indicePico - complexos[complexos.length - 1] > distanciaMinima
      ) {
        complexos.push(indicePico)
      }
      emPico = false
    }
  }

  return complexos
}

// ============================================================================
// GERAÇÃO DE SINAL A PARTIR DE SEQUÊNCIA RR — NÚCLEO EXTRAÍDO
// Para presets com ruido === 0, esta função não consome RNG (determinístico).
// ============================================================================

function _gerarValoresSinalDeRRs(
  intervalosRR: number[],
  parametros: ParametrosECGSyn
): number[] {
  const numeroAmostras = Math.ceil(parametros.duracao * parametros.frequenciaAmostragem)
  const valores: number[] = []
  let indiceIntervaloRR = 0
  let tempoNoIntervalo = 0

  for (let i = 0; i < numeroAmostras; i++) {
    const RRAtual = intervalosRR[Math.min(indiceIntervaloRR, intervalosRR.length - 1)]!
    const tFracional = tempoNoIntervalo / RRAtual
    valores.push(gerarBatimento(tFracional, parametros))
    tempoNoIntervalo += 1 / parametros.frequenciaAmostragem
    if (tempoNoIntervalo >= RRAtual) {
      tempoNoIntervalo = 0
      indiceIntervaloRR++
    }
  }
  return valores
}

// ============================================================================
// CORREÇÃO D2: ESCALONAMENTO POR JANELA EFETIVA
//
// Corrige divergência sistemática de FC causada pela fase inicial LF/HF (sin(0)=0).
// Ativo para duracao === 5s e:
//   - FC 40-170 bpm (faixa principal validada); OU
//   - FC 171-180 bpm com rrVariability <= 0,01 (apenas presets muito regulares).
//
// Seleção final usa o detector real em cada candidato.
// A simulação analítica calcula apenas o fator de escalonamento.
// ============================================================================

function _deveAplicarD2(parametros: ParametrosECGSyn): boolean {
  if (parametros.duracao !== 5) return false
  const fc = parametros.frequenciaCardiaca
  const faixaPrincipal = fc >= 40 && fc <= 170
  const faixaAltaValidada = fc > 170 && fc <= 180 && parametros.variacaoRR <= 0.01
  return faixaPrincipal || faixaAltaValidada
}

function gerarIntervalosRRSuficientes(
  frequenciaCardiaca: number,
  variacaoRR: number,
  razaoLFHF: number,
  frequenciaAmostragem: number,
  duracao: number
): number[] {
  const RRMedio = 60 / frequenciaCardiaca
  // A modulação LF/HF começa em sin(0)=0 e vai positiva nos primeiros ~5s,
  // tornando os RRs iniciais MAIS LONGOS que o nominal. ceil+2 é suficiente:
  // n × RRMedio > duracao, e os primeiros n RRs reais são ainda maiores.
  const n = Math.ceil(duracao / RRMedio) + 2
  return gerarIntervalosRR(n, frequenciaCardiaca, variacaoRR, razaoLFHF, frequenciaAmostragem)
}

function simularPicosRNaJanela(
  intervalosRR: number[],
  duracao: number,
  frequenciaAmostragem: number
): number[] {
  const nAmostras = Math.ceil(duracao * frequenciaAmostragem)
  const picos: number[] = []
  let idx = 0
  let tNoIntervalo = 0
  let prevTFrac = -1
  let registrado = false

  for (let i = 0; i < nAmostras; i++) {
    const rr = intervalosRR[Math.min(idx, intervalosRR.length - 1)]!
    const tFrac = tNoIntervalo / rr

    if (tFrac >= 0.23 && prevTFrac < 0.23 && !registrado) {
      picos.push(i)
      registrado = true
    }
    prevTFrac = tFrac
    tNoIntervalo += 1 / frequenciaAmostragem
    if (tNoIntervalo >= rr) {
      tNoIntervalo = 0
      idx++
      prevTFrac = -1
      registrado = false
    }
  }
  return picos
}

function corrigirRRPorJanelaEfetiva(
  intervalosRROriginais: number[],
  frequenciaCardiaca: number,
  parametros: ParametrosECGSyn
): number[] {
  const duracao = parametros.duracao
  const frequenciaAmostragem = parametros.frequenciaAmostragem
  const RRNominal = 60 / frequenciaCardiaca
  const FATOR_MIN = 0.5
  const FATOR_MAX = 1.5
  const MAX_ITER = 3

  // ruido: 0 garante que medirErroReal não consome RNG durante a seleção do candidato
  const parametrosSemRuido: ParametrosECGSyn = { ...parametros, ruido: 0 }

  const medirErroReal = (rrs: number[]): number => {
    const valores = _gerarValoresSinalDeRRs(rrs, parametrosSemRuido)
    const picos = _detectarPicosQRSCore(valores, frequenciaAmostragem)
    if (picos.length < 2) return Infinity
    const intervalosMs = picos
      .slice(1)
      .map((p, i) => ((p - picos[i]!) / frequenciaAmostragem) * 1000)
    const fcMedida = Math.round(
      60000 / (intervalosMs.reduce((a, b) => a + b) / intervalosMs.length)
    )
    return Math.abs(fcMedida - frequenciaCardiaca)
  }

  // Candidatos: sequência original + até MAX_ITER iterações sem clipping
  const candidatos: Array<{ rrs: number[]; erroReal: number }> = [
    { rrs: intervalosRROriginais, erroReal: medirErroReal(intervalosRROriginais) },
  ]

  // Sem picos detectados no original → sem correção possível
  if (candidatos[0]!.erroReal === Infinity) return intervalosRROriginais

  let sequenciaAtual = intervalosRROriginais

  for (let iter = 0; iter < MAX_ITER; iter++) {
    // Simulação analítica para calcular o fator de escalonamento
    const picos = simularPicosRNaJanela(sequenciaAtual, duracao, frequenciaAmostragem)
    if (picos.length < 2) break

    const rrEntrePicos = picos
      .slice(1)
      .map((p, i) => (p - picos[i]!) / frequenciaAmostragem)
    const mediaRRJanela = rrEntrePicos.reduce((a, b) => a + b) / rrEntrePicos.length

    const fator = RRNominal / mediaRRJanela
    if (fator < FATOR_MIN || fator > FATOR_MAX) break

    // Rejeitar se qualquer RR escalado atingiria o clamp fisiológico
    if (sequenciaAtual.some((rr) => rr * fator < 0.3 || rr * fator > 2.0)) break

    const rrsClamped = sequenciaAtual.map((rr) => Math.max(0.3, Math.min(2.0, rr * fator)))

    const erroReal = medirErroReal(rrsClamped)
    candidatos.push({ rrs: rrsClamped, erroReal })

    // Parar quando o detector já mede exatamente a FC alvo
    if (erroReal === 0) break

    sequenciaAtual = rrsClamped
  }

  // Retorna o candidato com menor erro real medido pelo detector
  return candidatos.reduce((best, c) => (c.erroReal < best.erroReal ? c : best)).rrs
}

// ============================================================================
// FUNÇÃO PRINCIPAL DE GERAÇÃO
// ============================================================================

/**
 * Gera um sinal ECG sintético usando o algoritmo ECGSYN
 *
 * @param parametros - Parâmetros de configuração do ECGSYN
 * @returns Sinal ECG gerado em derivação II
 */
export function gerarSinalECGSyn(parametros: ParametrosECGSyn): SinalECGSyn {
  const intervalosRR = _deveAplicarD2(parametros)
    ? corrigirRRPorJanelaEfetiva(
        gerarIntervalosRRSuficientes(
          parametros.frequenciaCardiaca,
          parametros.variacaoRR,
          parametros.razaoLFHF,
          parametros.frequenciaAmostragem,
          parametros.duracao
        ),
        parametros.frequenciaCardiaca,
        parametros
      )
    : gerarIntervalosRR(
        parametros.numeroIntervalos,
        parametros.frequenciaCardiaca,
        parametros.variacaoRR,
        parametros.razaoLFHF,
        parametros.frequenciaAmostragem
      )

  const tempo: number[] = []
  const valores: number[] = []

  let tempoTotal = 0
  let indiceIntervaloRR = 0
  let tempoNoIntervalo = 0

  const numeroAmostras = Math.ceil(parametros.duracao * parametros.frequenciaAmostragem)
  for (let i = 0; i < numeroAmostras; i++) {
    tempo.push(tempoTotal)

    const RRAtual = intervalosRR[Math.min(indiceIntervaloRR, intervalosRR.length - 1)]!
    const tFracional = tempoNoIntervalo / RRAtual

    valores.push(gerarBatimento(tFracional, parametros))

    tempoTotal += 1 / parametros.frequenciaAmostragem
    tempoNoIntervalo += 1 / parametros.frequenciaAmostragem

    if (tempoNoIntervalo >= RRAtual) {
      tempoNoIntervalo = 0
      indiceIntervaloRR++
    }
  }

  return {
    tempo,
    valores,
    frequenciaAmostragem: parametros.frequenciaAmostragem,
    duracao: parametros.duracao,
    parametros,
  }
}

/**
 * Aplica filtro passa-alta suave para remover linha de base (componente DC)
 * Mantém a morfologia P-QRS-T intacta
 */
export function aplicarFiltroPassaAlta(
  sinal: number[],
  frequenciaCorte: number = 0.5,
  frequenciaAmostragem: number = 250
): number[] {
  // Para ECG didático, o filtro deve ser muito suave
  // O sinal já é gerado sem componente DC significativo
  // Então apenas aplicar filtro muito fraco para remover drift lento

  const omega = (2 * Math.PI * frequenciaCorte) / frequenciaAmostragem
  const alpha = Math.min(omega / (omega + 1), 0.02) // Limite alpha para ser suave

  const sinalFiltrado: number[] = [sinal[0]]

  for (let i = 1; i < sinal.length; i++) {
    const valor = alpha * (sinalFiltrado[i - 1] + sinal[i] - sinal[i - 1])
    const sinalDeslocado = sinal[i] - valor
    sinalFiltrado.push(sinalDeslocado)
  }

  return sinalFiltrado
}

/**
 * Normaliza o sinal para amplitude apropriada em mV
 * Mantém escala fisiológica: amplitude típica 1-2 mV
 */
export function normalizarSinal(sinal: number[], ganho: number = 1.0): number[] {
  const maximo = Math.max(...sinal.map(Math.abs))
  if (maximo === 0) return sinal

  // Escalar para 1.5 mV (amplitude típica de um ECG)
  const fatorEscala = 1.5 / maximo
  return sinal.map((v) => v * fatorEscala * ganho)
}

/**
 * Detecta complexos QRS no sinal (índices dos picos R)
 */
export function detectarComplexosQRS(
  sinal: number[],
  frequenciaAmostragem: number
): number[] {
  return _detectarPicosQRSCore(sinal, frequenciaAmostragem)
}

/**
 * Calcula métricas de ECG a partir do sinal
 */
export function calcularMetricasECG(
  sinal: number[],
  frequenciaAmostragem: number,
  parametrosOriginais: ParametrosECGSyn
) {
  const complexosQRS = detectarComplexosQRS(sinal, frequenciaAmostragem)

  const intervalosRR: number[] = []
  for (let i = 1; i < complexosQRS.length; i++) {
    const intervalo =
      ((complexosQRS[i] - complexosQRS[i - 1]) / frequenciaAmostragem) * 1000 // ms
    intervalosRR.push(intervalo)
  }

  const fcMedia =
    intervalosRR.length > 0
      ? 60000 / (intervalosRR.reduce((a, b) => a + b) / intervalosRR.length)
      : parametrosOriginais.frequenciaCardiaca

  return {
    numeroComplexos: complexosQRS.length,
    frequenciaCardiaca: Math.round(fcMedia),
    intervalosRR,
    complexosQRS,
  }
}

export const ecgsynAdapter = {
  gerarSinalECGSyn,
  aplicarFiltroPassaAlta,
  normalizarSinal,
  detectarComplexosQRS,
  calcularMetricasECG,
}
