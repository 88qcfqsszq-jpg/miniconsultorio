/**
 * Módulo de Geração de ECG Sintético Didático
 *
 * Biblioteca educacional de padrões ECG para fins de OSCE e ensino.
 * Motor de geração baseado em Gaussianas (inspirado em ECGSYN/PhysioNet,
 * mas implementado como modelo didático, não clinicamente validado).
 *
 * Referências científicas:
 * - McSharry PE, Clifford GD, Tarassenko L, Smith L. A dynamical model for generating
 *   synthetic electrocardiogram signals. IEEE Transactions on Biomedical Engineering.
 *   2003;50(3):289-294.
 * - Goldberger AL, et al. PhysioBank, PhysioToolkit, and PhysioNet: Components of a new
 *   research resource for complex physiologic signals. Circulation. 2000;101(23):e215-e220.
 * - https://physionet.org/content/ecgsyn/1.0.0/
 */

import type { ECGLead } from '@/lib/ecg/types'
import type { ParametrosGeracaoECG, RespostaGeracaoECG, PoliticaFrequenciaECG } from './types'
import { ecgsynAdapter } from './ecgsynAdapter'
import { getPresetById, normalizePresetId } from './presets'
import { transformarEm12Derivacoes } from './leadTransform'
import { aplicarModificadoresPorDerivacao } from './leadModifiers'

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Presets sinusais adultos cuja NOMENCLATURA depende da frequência cardíaca.
 * Apenas para estes o nome do ritmo é derivado inteiramente da FC clínica.
 * NÃO inclui presets pediátricos (limiares 60/100 são adultos), arritmias,
 * bloqueios, extrassístoles, arritmia sinusal respiratória ou artefatos —
 * todos preservam o rótulo próprio do preset.
 */
const PRESETS_SINUSAIS_FC_DEPENDENTE_ADULTO: ReadonlySet<string> = new Set([
  'normal_adulto',
  'taquicardia_sinusal_adulto',
  'bradicardia_sinusal',
])

/**
 * Deriva o nome do ritmo a partir da FC clínica para presets sinusais adultos.
 * Limiares adultos (inclusivos em 60 e 100 como ritmo sinusal):
 *   FC < 60  → "Bradicardia sinusal"
 *   60 ≤ FC ≤ 100 → "Ritmo sinusal"
 *   FC > 100 → "Taquicardia sinusal"
 * Para qualquer outro preset, mantém o rótulo próprio (rotuloBase).
 */
function classificarRitmoSinusalAdulto(presetId: string, fcClinica: number, rotuloBase: string): string {
  if (!PRESETS_SINUSAIS_FC_DEPENDENTE_ADULTO.has(presetId)) return rotuloBase
  if (fcClinica < 60) return 'Bradicardia sinusal'
  if (fcClinica > 100) return 'Taquicardia sinusal'
  return 'Ritmo sinusal'
}

/**
 * Política de frequência por preset. Presets NÃO listados usam 'estado_clinico'
 * (default seguro = comportamento herdado do estado clínico do paciente).
 * Os 7 presets abaixo têm a FC/relação de condução como parte da própria
 * definição do ritmo — patientHeartRate é ignorada para eles.
 */
const POLITICA_FREQUENCIA_POR_PRESET: Partial<Record<string, PoliticaFrequenciaECG>> = {
  taquicardia_supraventricular: 'preset',
  taquicardia_ventricular_monomorfica: 'preset',
  flutter_atrial_2_1: 'preset',
  bloqueio_av_2_1: 'preset',
  bloqueio_av_mobitz_i: 'preset',
  bloqueio_av_mobitz_ii: 'preset',
  bloqueio_av_total: 'preset',
}

function getPoliticaFrequencia(presetId: string): PoliticaFrequenciaECG {
  return POLITICA_FREQUENCIA_POR_PRESET[presetId] ?? 'estado_clinico'
}

interface ResolucaoFrequencia {
  frequenciaAplicada: number
  heartRateSource: 'patient' | 'preset'
  politica: PoliticaFrequenciaECG
  conflito?: { requested: number; applied: number; reason: string }
}

/**
 * Resolvedor central da frequência clínica, respeitando a política do preset.
 * - 'estado_clinico': patientHeartRate válida prevalece; senão, preset.heartRate.
 * - 'preset' / 'contexto_exame': sempre preset.heartRate; se patientHeartRate válida
 *   e diferente, registra conflito (não bloqueante). 'contexto_exame' ainda não tem
 *   suporte contextual conectado ao runtime, portanto se comporta como 'preset'.
 */
function resolverFrequencia(
  presetId: string,
  presetHeartRate: number,
  patientHeartRate: number | undefined,
): ResolucaoFrequencia {
  const politica = getPoliticaFrequencia(presetId)
  const patientValida =
    Number.isFinite(patientHeartRate) && (patientHeartRate as number) > 0

  if (politica === 'estado_clinico') {
    if (patientValida) {
      return { frequenciaAplicada: patientHeartRate as number, heartRateSource: 'patient', politica }
    }
    return { frequenciaAplicada: presetHeartRate, heartRateSource: 'preset', politica }
  }

  // 'preset' ou 'contexto_exame': FC intrínseca ao preset.
  const resolucao: ResolucaoFrequencia = {
    frequenciaAplicada: presetHeartRate,
    heartRateSource: 'preset',
    politica,
  }
  if (patientValida && (patientHeartRate as number) !== presetHeartRate) {
    resolucao.conflito = {
      requested: patientHeartRate as number,
      applied: presetHeartRate,
      reason:
        politica === 'contexto_exame'
          ? 'FC do preset preservada: suporte a frequência contextual ainda não conectado ao runtime.'
          : 'FC do preset preservada: a frequência/relação de condução faz parte da definição deste ritmo.',
    }
  }
  return resolucao
}

function mapearGrupoIdade(ageGroup: string): "neonato" | "lactente" | "adolescente" | "adulto" | "crianca" | undefined {
  const mapas: Record<string, "neonato" | "lactente" | "adolescente" | "adulto" | "crianca" | undefined> = {
    neonato: "neonato",
    lactente: "lactente",
    pre_escolar: "crianca",
    escolar: "crianca",
    adolescente: "adolescente",
    crianca: "crianca",
    adulto: "adulto",
  };
  return mapas[ageGroup] || "adulto";
}

// ============================================================================
// FUNÇÃO PRINCIPAL
// ============================================================================

/**
 * Gera um ECG sintético baseado em preset ECGSYN
 *
 * Fluxo:
 * 1. Validar preset
 * 2. Gerar sinal base com ECGSYN
 * 3. Aplicar filtros
 * 4. Transformar em 12 derivações
 * 5. Análise de parâmetros
 * 6. Retornar resposta estruturada
 */
export function generateECG(params: ParametrosGeracaoECG): RespostaGeracaoECG {
  // ========================================================================
  // 1. VALIDAÇÃO E OBTENÇÃO DO PRESET
  // ========================================================================

  // Normalizar ID antigo para novo (compatibilidade)
  const normalizedId = normalizePresetId(params.presetId)
  const ecgPreset = getPresetById(normalizedId)

  if (!ecgPreset) {
    throw new Error(`Preset ECG não encontrado: ${params.presetId} (normalizado: ${normalizedId})`)
  }

  // FC resolvida pela POLÍTICA do preset (não universal). Esta é a única FC
  // clínica — usada para gerar o traçado, exibir ao aluno e classificar o ritmo.
  // A FC medida no sinal fica só em metadata (rastreabilidade).
  const resolucaoFC = resolverFrequencia(
    normalizedId,
    ecgPreset.heartRate,
    params.patientHeartRate,
  )
  const frequenciaResolvida = resolucaoFC.frequenciaAplicada

  // Converter novo preset ECGPreset para parametrosECGSyn (compatibilidade)
  const parametrosECGSyn = {
    frequenciaCardiaca: frequenciaResolvida,
    numeroIntervalos: 12,
    frequenciaAmostragem: 250,
    variacaoRR: ecgPreset.rrVariability,
    razaoLFHF: 1.0,
    amplitude: {
      P: ecgPreset.morphology.pAmplitude,
      Q: ecgPreset.morphology.qAmplitude,
      R: ecgPreset.morphology.rAmplitude,
      S: ecgPreset.morphology.sAmplitude,
      T: ecgPreset.morphology.tAmplitude,
    },
    duracao: params.durationSeconds ?? 5,
    ruido: 0,
    agrupoIdade: mapearGrupoIdade(ecgPreset.ageGroup),
  }

  // Validar eletrodos solicitados
  if (!params.selectedLeads || params.selectedLeads.length === 0) {
    throw new Error('Nenhum eletrodo selecionado')
  }

  // ========================================================================
  // 2. GERAR SINAL BASE (DII SINTÉTICA)
  // ========================================================================

  const sinalBase = ecgsynAdapter.gerarSinalECGSyn(parametrosECGSyn)

  // ========================================================================
  // 3. APLICAR FILTROS
  // ========================================================================

  let sinalProcessado = [...sinalBase.valores]

  // Filtro passa-alta para remover linha de base
  sinalProcessado = ecgsynAdapter.aplicarFiltroPassaAlta(
    sinalProcessado,
    0.5,
    parametrosECGSyn.frequenciaAmostragem
  )

  // Normalizar
  sinalProcessado = ecgsynAdapter.normalizarSinal(sinalProcessado, 1.0)

  // ========================================================================
  // 4. TRANSFORMAR EM 12 DERIVAÇÕES
  // ========================================================================

  const dados12Derivacoes = transformarEm12Derivacoes(sinalProcessado, 60)

  // Aplicar modificadores morfológicos por derivação (após a transformação em 12
  // derivações, NUNCA no sinal base). Sem leadModifiers, retorna as derivações
  // inalteradas (mesma referência) — comportamento anterior preservado.
  const resultadoModificadores = aplicarModificadoresPorDerivacao(
    dados12Derivacoes,
    ecgPreset.leadModifiers,
    parametrosECGSyn.frequenciaAmostragem,
  )
  const leadsFinais = resultadoModificadores.leads

  // IMPORTANTE: Manter todas as 12 derivações para renderização completa
  // Os selectedLeads são apenas para validação de eletrodos posicionados
  // A tela deve sempre exibir o ECG completo de 12 derivações

  // ========================================================================
  // 5. ANÁLISE DE PARÂMETROS
  // ========================================================================

  const metricas = ecgsynAdapter.calcularMetricasECG(
    sinalProcessado,
    parametrosECGSyn.frequenciaAmostragem,
    parametrosECGSyn
  )

  // Estimar intervalos PR e QRS
  const intervalosPR = Array(metricas.numeroComplexos)
    .fill(null)
    .map(
      () =>
        100 +
        Math.random() * 60 +
        (parametrosECGSyn.agrupoIdade === 'lactente' ? -20 : 0)
    )

  const duracoesQRS = Array(metricas.numeroComplexos)
    .fill(null)
    .map(
      () =>
        65 +
        Math.random() * 35 +
        (parametrosECGSyn.agrupoIdade === 'lactente' ? -10 : 0)
    )

  // Calcular QTc (Bazett)
  const rrMedio =
    metricas.intervalosRR.length > 0
      ? metricas.intervalosRR.reduce((a, b) => a + b) /
        metricas.intervalosRR.length /
        1000
      : 0.6

  const QTEstimado = 250 + Math.random() * 100
  const QTc = rrMedio > 0 ? QTEstimado / Math.sqrt(rrMedio) : QTEstimado

  // ========================================================================
  // 6. CONSTRUIR RESPOSTA
  // ========================================================================

  const resposta: RespostaGeracaoECG = {
    samplingRate: parametrosECGSyn.frequenciaAmostragem,
    duration: parametrosECGSyn.duracao,
    leads: leadsFinais as {
      [lead in ECGLead]?: number[]
    },

    interpretation: {
      // FC clínica (frequenciaResolvida), não a medida no sinal sintético.
      frequenciaCardiaca: frequenciaResolvida,
      ritmo: classificarRitmoSinusalAdulto(
        normalizedId,
        frequenciaResolvida,
        ecgPreset.expectedInterpretation[0] || 'Sinusal',
      ),
      eixoMedio: 60,
      intervalosPR,
      duracoesQRS,
      duracaoQTc: Math.round(QTc),
    },

    teachingPoints: ecgPreset.teachingPoints,

    metadata: {
      presetId: normalizedId,
      dataGeracao: new Date(),
      versaoECGSyn: 'Gerador Sintético Didático P-QRS-T (inspirado em PhysioNet ECGSYN)',
      sintético: true,
      avisoEducacional:
        ecgPreset.warning ||
        'Traçado sintético gerado para fins educacionais. Não utilizar para diagnóstico clínico real. Motor didático não é validado clinicamente.',
      referências: [
        'McSharry PE, Clifford GD, Tarassenko L, Smith L. A dynamical model for generating synthetic electrocardiogram signals. IEEE Transactions on Biomedical Engineering. 2003;50(3):289-294.',
        'Goldberger AL, Amaral LAN, Glass L, Hausdorff JM, Ivanov PC, Mark RG, et al. PhysioBank, PhysioToolkit, and PhysioNet: Components of a new research resource for complex physiologic signals. Circulation. 2000;101(23):e215-e220.',
      ],
      fontePrincipal: 'Gerador Didático Inspirado em PhysioNet ECGSYN',

      // Rastreabilidade da FC (Abordagem B): target é a FC clínica exibida;
      // measured é a FC detectada no sinal sintético (só auditoria técnica).
      targetHeartRate: frequenciaResolvida,
      measuredHeartRate: metricas.frequenciaCardiaca,
      heartRateSource: resolucaoFC.heartRateSource,
      heartRatePolicy: resolucaoFC.politica,
      ...(resolucaoFC.conflito ? { heartRateConflict: resolucaoFC.conflito } : {}),
    },
  }

  return resposta
}

// ============================================================================
// EXPORTS
// ============================================================================

export { ParametrosGeracaoECG, RespostaGeracaoECG }
export { getPresetById, normalizePresetId } from './presets'
export type { PresetECG, ParametrosECGSyn } from './types'
