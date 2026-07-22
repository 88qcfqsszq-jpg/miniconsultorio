/**
 * Mapeamento de Casos OSCE para Presets ECG Esperados
 *
 * Define qual preset de ECG sintético é apropriado para cada tipo de caso clínico,
 * baseado em tema, diagnóstico e apresentação.
 */

import type { EsperadoExame, EsperadosExames } from '../types'
import { resolveECGPresetByCaseId } from './ecg-case-id-mapping'

/**
 * Mapeamento de temas clínicos para ECG esperados
 *
 * Organizado por: apresentação clínica → prioridade + preset
 */
export const ECG_CASE_MAPPING: Record<string, EsperadoExame> = {
  // ================================================================
  // DOR TORÁCICA / SÍNDROME CORONARIANA AGUDA
  // ================================================================
  'dor_toracica_sca': {
    indicado: true,
    prioridade: 'obrigatório',
    presetId: 'taquicardia_sinusal_adulto',
    interpretacaoEsperada: [
      'Ritmo sinusal',
      'Taquicardia (FC > 100)',
      'QRS estreito',
      'Sem sinais específicos de supra de ST (educacional)',
    ],
    justificativa: 'ECG é exame inicial e mandatório em toda dor torácica. Deve ser realizado nos primeiros 10 minutos.',
    pontosDeEnsino: [
      'ECG é o exame diagnóstico mais importante em dor torácica.',
      'Procurar supradesnivelamento de ST, infradesnivelamento e inversão de T.',
      'Não esperar resultado de troponina para iniciar tratamento se ECG sugere IAM.',
      'Avaliar ritmo, frequência, QRS e segmento ST-T em todas as derivações.',
      'Correlacionar ECG com apresentação clínica (irradiação, timing, duração).',
    ],
    observacoes: 'Este é um preset didático. Casos reais de IAM possuem alterações específicas (não implementadas na Etapa 1/2).',
  },

  'palpitacoes': {
    indicado: true,
    prioridade: 'obrigatório',
    presetId: 'taquicardia_supraventricular',
    interpretacaoEsperada: [
      'Taquicardia',
      'QRS estreito (ou largo, se ventricular)',
      'Ritmo regular ou irregular',
      'Onda P ausente ou retrógrada',
    ],
    justificativa: 'ECG é essencial para caracterizar o ritmo em palpitações e diferencias arritmias.',
    pontosDeEnsino: [
      'ECG durante sintomas é mais informativo que ECG em repouso.',
      'Avaliar se taquicardia é regular (TSV, flutter) ou irregular (FA, ESV frequentes).',
      'QRS estreito sugestiona origem supraventricular.',
      'QRS largo sugestiona origem ventricular (ou condução aberrante).',
      'Procurar sinais de síndrome de pré-excitação se TSV.',
    ],
    observacoes: 'Preset mostra TSV como exemplo; paciente pode ter outras arritmias conforme caso.',
  },

  'sincope': {
    indicado: true,
    prioridade: 'obrigatório',
    presetId: 'bradicardia_sinusal',
    interpretacaoEsperada: [
      'Frequência cardíaca reduzida',
      'QRS normal',
      'Avaliar intervalo PR',
      'Sem alterações agudas',
    ],
    justificativa: 'ECG é investigação inicial para síncope de origem cardiaca (arritmia ou condução).',
    pontosDeEnsino: [
      'Síncope cardiaca é achado grave com risco de morte súbita.',
      'Procurar bloqueios AV (prolongamento de PR, falhas de condução).',
      'Bradicardia extrema (<40 bpm) é fator de risco.',
      'Procurar síndrome de Long QT, Brugada ou hipertrofia ventricular.',
      'Se ECG normal, investigar causa não cardiaca (vasovagal, postural).',
    ],
    observacoes: 'Preset mostra bradicardia; caso com síncope vasovagal seria normal_adulto.',
  },

  'dispneia': {
    indicado: true,
    prioridade: 'recomendado',
    presetId: 'taquicardia_sinusal_adulto',
    interpretacaoEsperada: [
      'Taquicardia',
      'Pode haver alterações rítmicas',
      'Avaliar correlação com hipóxia/cansaço',
    ],
    justificativa: 'ECG ajuda a diferenciar dispneia de origem cardiaca de causa pulmonar.',
    pontosDeEnsino: [
      'Dispneia pode ser de origem cardiaca (descompensação, arritmia) ou pulmonar (asma, pneumonia).',
      'ECG com taquicardia sinusal pura sugere causa pulmonar.',
      'ECG com taquicardia + alterações de ST-T sugere causa cardiaca.',
      'Correlacionar com ausculta (sibilos vs estertores).',
    ],
    observacoes: '',
  },

  'febre_pediatrica': {
    indicado: false,
    prioridade: 'não indicado',
    interpretacaoEsperada: ['ECG não é indicado em febre isolada sem sintomas cardiacos'],
    justificativa: 'Em criança com febre simples, ECG não é exame priorário.',
    pontosDeEnsino: [
      'ECG é indicado em febre se houver: dor torácica, palpitação, síncope, sopro novo, ICC.',
      'Febre por si só causa taquicardia fisiológica que normaliza com tratamento.',
    ],
    observacoes: 'Se o aluno solicitar ECG sem justificativa, feedback sugere educação sobre indicações.',
  },

  'hipertensao': {
    indicado: true,
    prioridade: 'recomendado',
    presetId: 'normal_adulto',
    interpretacaoEsperada: [
      'Procurar sinais de sobrecarga ventricular (futuro na Etapa 3)',
      'Avaliar ritmo regular',
      'QRS normal',
    ],
    justificativa: 'ECG avalia efeitos crônicos de hipertensão (hipertrofia VE) e arritmias associadas.',
    pontosDeEnsino: [
      'HAS pode causar hipertrofia ventricular esquerda (aumento de voltagem em V5/V6, ondas T negativas).',
      'ECG normal não exclui hipertrofia; ecocardiografia é mais sensível.',
      'Procurar bloqueios, sopros, taquiarritmias como complicações.',
    ],
    observacoes: 'Presets de hipertrofia VE estarão em Etapa 3.',
  },

  // ================================================================
  // ARRITIMIAS CONHECIDAS / SEGUIMENTO
  // ================================================================
  'fibrilacao_atrial': {
    indicado: true,
    prioridade: 'obrigatório',
    presetId: 'fibrilacao_atrial',
    interpretacaoEsperada: [
      'Ausência de ondas P organizadas',
      'Ritmo irregularmente irregular',
      'Resposta ventricular variável',
      'Trama fibrilatória',
    ],
    justificativa: 'ECG é diagnóstico em fibrilação atrial e deve ser feito periodicamente para avaliar controle de FC.',
    pontosDeEnsino: [
      'Fibrilação atrial é arritmia mais comum em adultos.',
      'Diagnóstico é pelo ritmo irregularmente irregular.',
      'Risco de tromboembolismo — indicar anticoagulação.',
      'Avaliar resposta ventricular (rápida > 100, bem controlada 60-100, lenta < 60).',
      'ECG também avalia possíveis causas (isquemia, sobrecarga).',
    ],
    observacoes: '',
  },

  // ================================================================
  // CASOS SEM INDICAÇÃO CARDIOVASCULAR
  // ================================================================
  'caso_normal_sem_queixa_cardiaca': {
    indicado: false,
    prioridade: 'não indicado',
    interpretacaoEsperada: ['ECG não é indicado sem queixa ou achado cardiaco'],
    justificativa: 'Triagem com ECG em assintomáticos não é recomendada.',
    pontosDeEnsino: [
      'ECG está indicado em sintomas ou sinais cardiacos, não em rastreamento universal.',
      'Solicitação desnecessária aumenta custos e pode gerar achados incidentais que requerem investigação.',
    ],
    observacoes: 'Se aluno solicita, feedback o orienta sobre indicações corretas.',
  },
}

/**
 * Obtém expectativa de ECG baseada no tema do caso
 *
 * @param tema - Tema clínico do caso (dor_toracica_sca, palpitacoes, etc)
 * @returns Expectativa de ECG ou undefined se não mapeado
 */
export function getECGExpectationForCaseTheme(tema: string): EsperadoExame | undefined {
  // Buscar mapeamento direto
  if (tema in ECG_CASE_MAPPING) {
    return ECG_CASE_MAPPING[tema]
  }

  // Busca por palavra-chave em temas
  const temasLower = tema.toLowerCase()

  // Mapeamento por keyword
  if (temasLower.includes('dor') && temasLower.includes('toracica')) {
    return ECG_CASE_MAPPING['dor_toracica_sca']
  }
  if (temasLower.includes('palpita')) {
    return ECG_CASE_MAPPING['palpitacoes']
  }
  if (temasLower.includes('sincope') || temasLower.includes('desmaio')) {
    return ECG_CASE_MAPPING['sincope']
  }
  if (temasLower.includes('dispneia') || temasLower.includes('falta de ar')) {
    return ECG_CASE_MAPPING['dispneia']
  }
  if (temasLower.includes('febre')) {
    return ECG_CASE_MAPPING['febre_pediatrica']
  }
  if (temasLower.includes('hipertensao')) {
    return ECG_CASE_MAPPING['hipertensao']
  }
  if (temasLower.includes('fibrilacao') || temasLower.includes('fa')) {
    return ECG_CASE_MAPPING['fibrilacao_atrial']
  }

  return undefined
}

/**
 * Obtém preset ECG padrão por faixa etária
 * Usado como fallback se caso não tiver expectativa definida
 *
 * @param ageGroup - Faixa etária (neonato, lactente, escolar, adulto, etc)
 * @returns ID do preset padrão
 */
export function getDefaultECGPresetByAgeGroup(ageGroup?: string): string {
  if (!ageGroup) return 'normal_adulto'

  const ageGroupLower = ageGroup.toLowerCase()

  if (ageGroupLower.includes('neonato')) return 'normal_neonato'
  if (ageGroupLower.includes('lactente')) return 'normal_lactente'
  if (ageGroupLower.includes('pre_escolar') || ageGroupLower.includes('pré')) return 'normal_pre_escolar'
  if (ageGroupLower.includes('escolar')) return 'normal_escolar'
  if (ageGroupLower.includes('adolescente')) return 'normal_adolescente'

  return 'normal_adulto'
}

// ============================================================================
// RESOLVEDOR CENTRAL de ECG por CASO (diagnóstico-aware).
// Prioridade: esperadosExames.ecg → tema mapeado → DIAGNÓSTICO → idade (normal).
// Quando o diagnóstico é cardíaco/relevante mas só há preset normal disponível,
// devolve um laudo CONTEXTUALIZADO (ECG normal não exclui o diagnóstico).
// Evita o antigo comportamento de "normal_lactente" genérico sem contexto.
// ============================================================================

function normalizar(s: unknown): string {
  return String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function presetNormalPorIdade(caso: any): string {
  // 1. faixaEtaria explícita — caminho mais confiável
  const faixa = caso?.paciente?.dadosPediatricos?.faixaEtaria
  if (faixa) return getDefaultECGPresetByAgeGroup(faixa)

  if (caso?.tipoPaciente === 'pediatrico') {
    // 2. idadeMeses (inteiro em meses; usa a granularidade disponível no campo)
    // Faixas em meses: neonato = idadeMeses < 1 (faixa neonatal na granularidade
    // disponível no campo), lactente 1-23 m, pré-escolar 24-71 m (2-5 a),
    // escolar 72-143 m (6-11 a), adolescente ≥144 m.
    const idadeMeses: number | undefined = caso?.paciente?.dadosPediatricos?.idadeMeses
    if (typeof idadeMeses === 'number' && idadeMeses >= 0) {
      if (idadeMeses < 1) return 'normal_neonato'     // faixa neonatal na granularidade disponível
      if (idadeMeses < 24) return 'normal_lactente'   // 1-23 meses
      if (idadeMeses < 72) return 'normal_pre_escolar' // 24-71 meses
      if (idadeMeses < 144) return 'normal_escolar'   // 72-143 meses
      return 'normal_adolescente'
    }
    // 3. paciente.idade em anos — fallback documentado, menos preciso.
    // Neonatal ≈ idadeAnos < 0.083 (< ~1 mês). Unidade: anos decimais.
    if (typeof caso?.paciente?.idade === 'number') {
      const idadeAnos = caso.paciente.idade
      if (idadeAnos < 0.083) return 'normal_neonato'
      if (idadeAnos < 2) return 'normal_lactente'
      if (idadeAnos < 6) return 'normal_pre_escolar'
      if (idadeAnos < 12) return 'normal_escolar'
      return 'normal_adolescente'
    }
  }
  return 'normal_adulto'
}

export interface ECGResolucaoCaso {
  presetId: string
  /** Nota educacional quando o ECG é normal mas não exclui o diagnóstico. */
  laudoContextual?: string
  origem: 'esperado' | 'id' | 'tema' | 'diagnostico' | 'idade'
  /** true quando o preset foi curado/validado especificamente para este caso
   *  (origem 'esperado' ou 'id'); false/undefined quando veio de um nível
   *  genérico (tema/idade) ou de um match textual de diagnóstico não revisado
   *  território a território. */
  clinicallyValidated?: boolean
  /** Preenchido apenas quando a resolução caiu num nível genérico (tema ou
   *  idade), explicando por que não havia preset mais específico. */
  fallbackReason?: string
}

/** Presets patológicos disponíveis mapeados por palavra-chave de diagnóstico.
 *  A ordem importa: a primeira regex que casar define o preset.
 */
const DIAGNOSTICO_PRESET: Array<[RegExp, string]> = [
  [/fibrilacao atrial|flutter atrial|\bfa\b paroxist/, 'fibrilacao_atrial'],
  [/taquicardia supraventricular|\btsv\b|palpitac/, 'taquicardia_supraventricular'],
  [/bradicardia|bloqueio atrioventricular|\bbav\b|bloqueio av/, 'bradicardia_sinusal'],
  // Angina estável / DAC estável / esforço: ECG de repouso basal normal.
  // A FC será fornecida pelos sinais vitais do caso via patientHeartRate.
  // normalizar() já removeu os acentos; as formas abaixo são sem diacríticos.
  // Requer o qualificador "estavel"/"esforco" para NÃO capturar formas instáveis/SCA.
  [/angina est[a-z]*|angina de esfor|dac est[a-z]*|cardiopatia isquemica est[a-z]*|doenca (arterial )?coronarian[a-z]* est[a-z]*/, 'normal_adulto'],
  // SCA aguda, IAM, angina/DAC instável, cardiopatia isquêmica instável:
  // traçado taquicárdico (reação adrenérgica esperada). Sem acento (normalizar()).
  // As formas "instável" devem cair aqui, NUNCA no ECG normal do adulto.
  [/infarto|\biam\b|sindrome coronarian|\bsca\b|angina inst[a-z]*|nstemi|stemi|isquemia miocard|(doenca (arterial )?coronarian[a-z]*|cardiopatia isquemica) inst[a-z]*/, 'taquicardia_sinusal_adulto'],
]

/** Diagnósticos cardíacos em que um ECG normal NÃO exclui a doença. */
const DIAGNOSTICO_CARDIACO_CONTEXTO = /cardiopatia|cianotic|tetralogia|fallot|transposi|\btga\b|congenit.*cardi|cardi.*congenit|sopro|comunicac.*(interventricular|interatrial)|\bciv\b|\bcia\b|persistencia.*ducto|\bpca\b|coarctac|estenose (aortic|mitral|pulmonar)|insuficiencia (mitral|aortic|cardiac)|\bicc\b|pericardite|miocardite|endocardite|valvopatia|hipertrofia|arritmia|prolapso/

/** IDs (combinados com o nível de fallback) já avisados nesta sessão do
 *  processo — evita spam do console a cada re-render do SimuladorECG
 *  (resolveECGPresetForCase roda de novo em todo render do componente). */
const casosJaAvisados = new Set<string>()

/** Loga (só em desenvolvimento, uma única vez por caso+nível) quando o ECG
 *  cai num nível genérico de resolução, para que a lacuna fique visível a
 *  quem está desenvolvendo — nunca ao usuário final (nenhum erro/aviso
 *  técnico é exibido na tela). Não registra nenhum dado clínico do
 *  paciente — só o ID do caso (identificador técnico) e o preset escolhido. */
function logFallbackDev(casoId: unknown, nivel: 'tema' | 'idade', presetId: string): void {
  if (process.env.NODE_ENV === 'production') return
  const chave = `${String(casoId ?? '(sem id)')}:${nivel}`
  if (casosJaAvisados.has(chave)) return
  casosJaAvisados.add(chave)
  // eslint-disable-next-line no-console
  console.warn(
    `[ECG] Caso "${String(casoId ?? '(sem id)')}" sem preset específico (ID/diagnóstico) — ` +
      `resolvido por ${nivel === 'tema' ? 'TEMA genérico' : 'IDADE (fallback normal)'}: "${presetId}". ` +
      `Considere adicionar entrada em lib/ecg/ecg-case-id-mapping.ts se o achado de ECG do caso for específico.`
  )
}

export function resolveECGPresetForCase(caso: any): ECGResolucaoCaso {
  // 1. Expectativa explícita do caso (máxima prioridade). Leitura tipada
  //    (sem propagar `any`): o shape lido é exatamente EsperadosExames.
  const esperado = (caso as { esperadosExames?: EsperadosExames } | null | undefined)
    ?.esperadosExames?.ecg?.presetId
  if (esperado) {
    return { presetId: esperado, origem: 'esperado', clinicallyValidated: true }
  }

  // 2. Mapping por ID do caso — resolução específica quando o achado de ECG
  //    do próprio caso exige um território/padrão que tema/diagnóstico
  //    genéricos não distinguem (ex.: IAM inferior vs. anterosseptal).
  const presetPorId = resolveECGPresetByCaseId(caso?.id)
  if (presetPorId) {
    return { presetId: presetPorId, origem: 'id', clinicallyValidated: true }
  }

  // 3. Diagnóstico do caso (mais específico que tema).
  const diag = normalizar(
    caso?.diagnosticoCorreto ??
      caso?.dados_ocultos_do_sistema?.diagnostico_principal ??
      caso?.diagnostico ??
      caso?.titulo ??
      caso?.categoria
  )
  if (diag) {
    for (const [re, preset] of DIAGNOSTICO_PRESET) {
      if (re.test(diag)) return { presetId: preset, origem: 'diagnostico' }
    }
  }

  // 4. Tema mapeado (genérico — só chega aqui se diagnóstico não resolveu).
  if (caso?.tema) {
    try {
      const exp = getECGExpectationForCaseTheme(caso.tema)
      if (exp?.presetId) {
        logFallbackDev(caso?.id, 'tema', exp.presetId)
        return {
          presetId: exp.presetId,
          origem: 'tema',
          fallbackReason: 'Sem preset específico por ID ou diagnóstico; resolvido por tema genérico do caso.',
        }
      }
    } catch {
      /* ignora e segue para idade */
    }
  }

  // Cardíaco sem preset específico → normal por idade, mas CONTEXTUALIZADO.
  if (diag && DIAGNOSTICO_CARDIACO_CONTEXTO.test(diag)) {
    const presetId = presetNormalPorIdade(caso)
    logFallbackDev(caso?.id, 'idade', presetId)
    return {
      presetId,
      origem: 'diagnostico',
      laudoContextual:
        'ECG sem alterações específicas neste simulador. Um ECG normal NÃO exclui o diagnóstico — ' +
        'correlacionar com ecocardiograma, radiografia e o quadro clínico.',
      fallbackReason: 'Diagnóstico cardíaco sem preset específico; ECG normal não exclui a doença — laudo contextualizado.',
    }
  }

  // 5. Idade (normal padrão) — último nível.
  const presetId = presetNormalPorIdade(caso)
  logFallbackDev(caso?.id, 'idade', presetId)
  return {
    presetId,
    origem: 'idade',
    fallbackReason: 'Sem preset específico por ID, diagnóstico ou tema; resolvido por idade (ECG normal padrão).',
  }
}
