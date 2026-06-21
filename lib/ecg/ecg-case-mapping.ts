/**
 * Mapeamento de Casos OSCE para Presets ECG Esperados
 *
 * Define qual preset de ECG sintético é apropriado para cada tipo de caso clínico,
 * baseado em tema, diagnóstico e apresentação.
 */

import type { EsperadoExame } from '../types'

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
