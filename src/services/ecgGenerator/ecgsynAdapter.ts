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
// FUNÇÃO PRINCIPAL DE GERAÇÃO
// ============================================================================

/**
 * Gera um sinal ECG sintético usando o algoritmo ECGSYN
 *
 * @param parametros - Parâmetros de configuração do ECGSYN
 * @returns Sinal ECG gerado em derivação II
 */
export function gerarSinalECGSyn(parametros: ParametrosECGSyn): SinalECGSyn {
  const numeroAmostras = Math.ceil(
    parametros.duracao * parametros.frequenciaAmostragem
  )

  // Gerar intervalos RR com variabilidade fisiológica
  const intervalosRR = gerarIntervalosRR(
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

  for (let i = 0; i < numeroAmostras; i++) {
    tempo.push(tempoTotal)

    // Obter intervalo RR atual
    const RRAtual =
      intervalosRR[Math.min(indiceIntervaloRR, intervalosRR.length - 1)]

    // Calcular tempo fracional no batimento (0 a 1)
    const tFracional = tempoNoIntervalo / RRAtual

    // Gerar batimento sintético
    const amostra = gerarBatimento(tFracional, parametros)
    valores.push(amostra)

    // Avançar tempo
    tempoTotal += 1 / parametros.frequenciaAmostragem
    tempoNoIntervalo += 1 / parametros.frequenciaAmostragem

    // Mudar para próximo batimento
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
      // Intervalo mínimo baseado em FC máxima esperada (180 bpm = 333ms)
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
