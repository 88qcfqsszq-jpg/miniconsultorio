// ============================================================================
// Casos OSCE Dinâmicos — Beta · TIPOS CENTRAIS (Contrato Fase 2)
// ----------------------------------------------------------------------------
// Módulo PARALELO e ISOLADO. Não importa nem depende de data/casos-v2,
// lib/healthbench, feedback OSCE principal, exames, ECG ou dashboard.
// Contrato forte para casos e rubricas dinâmicas, compatível com o motor
// medix-rule-based agora e preparado para um Pulse Adapter futuro.
// ============================================================================

/** Provedor de simulação. Nesta fase só existe o motor de regras próprio. */
export type SimulationProvider = "medix-rule-based" | "pulse";

/** Tendência clínica após uma transição de estado. */
export type TrendDirection = "melhora" | "estabilidade" | "piora";

// ---- Estado fisiológico ----------------------------------------------------

export interface VitalSigns {
  fc: number; // bpm
  fr: number; // irpm
  paSys: number; // mmHg
  paDia: number; // mmHg
  spo2: number; // %
  temp: number; // °C
}

export interface ClinicalStatus {
  estadoGeral: string;
  trabalhoRespiratorio: string;
  ausculta: string;
  fala: string;
  perfusao: string;
}

export interface PatientState {
  vitals: VitalSigns;
  clinical: ClinicalStatus;
  /** Marcador interno do motor (0 = sem broncoespasmo, 100 = máximo). */
  broncoespasmo: number;
  oxigenioSuplementar: boolean;
  corticoideAdministrado: boolean;
  tempoDecorridoMin: number;
  // ---- Marcadores opcionais (pneumotórax hipertensivo — Fase 3) ----------
  /** Tensão intratorácica (0 = sem tensão, 100 = máxima). Só em pneumotórax. */
  tensaoPneumotorax?: number;
  descomprimido?: boolean;
  drenado?: boolean;
  acessoVenoso?: boolean;
  dorControlada?: boolean;
}

// ---- Intervenções ----------------------------------------------------------

export type InterventionId =
  | "oxigenio"
  | "salbutamol"
  | "ipratropio"
  | "corticoide"
  | "sulfato-magnesio"
  | "reavaliar"
  | "internacao"
  | "intubacao-uti"
  | "alta"
  // Fase 3 — emergência torácica / suporte
  | "oxigenio_alto_fluxo"
  | "descompressao_toracica"
  | "drenagem_toracica"
  | "monitorizacao"
  | "acesso_venoso"
  | "fluidos_suporte"
  | "analgesia"
  | "solicitar_rx_torax"
  | "solicitar_usg_torax"
  | "aguardar_exames"
  | "alta_precoce";

export type InterventionCategory =
  | "suporte"
  | "medicacao"
  | "monitorizacao"
  | "decisao"
  | "procedimento";

export interface Intervention {
  id: InterventionId;
  label: string;
  descricao: string;
  categoria: InterventionCategory;
}

// ---- Linha do tempo / transição de estado ----------------------------------

export type TimelineEventType =
  | "inicio"
  | "intervencao"
  | "evolucao"
  | "exame"
  | "erro-critico"
  | "fim";

export interface TimelineEvent {
  id: string;
  tMin: number;
  titulo: string;
  detalhe: string;
  tendencia: TrendDirection;
  tipo: TimelineEventType;
}

export interface StateTransitionResult {
  novoEstado: PatientState;
  mensagem: string;
  eventos: TimelineEvent[];
  tendencia: TrendDirection;
  erroCritico?: string;
}

// ============================================================================
// CONTRATO DO CASO DINÂMICO (Fase 2) — grupos obrigatórios
// ============================================================================

export type CaseStatus = "beta" | "validado" | "experimental";
export type CaseNivel = "iniciante" | "intermediario" | "avancado";
export type Sexo = "masculino" | "feminino";

/** 1. Identificação */
export interface CaseIdentificacao {
  caseId: string;
  titulo: string;
  subtitulo?: string;
  tipo: "adulto" | "pediatrico";
  especialidade: string;
  sistema: string;
  nivel: CaseNivel;
  tags: string[];
  status: CaseStatus;
  /** Objetivo pedagógico curto (usado na UI). */
  objetivoClinico: string;
}

/** 2. Paciente */
export interface CasePaciente {
  nome: string;
  idade: number;
  sexo: Sexo;
  pesoKg?: number;
  faixaEtaria: string;
  contexto: string;
  fatoresRisco: string[];
  antecedentesRelevantes: string[];
  medicamentosUso: string[];
  alergias: string[];
}

/** 3. Diagnóstico */
export interface CaseDiagnostico {
  diagnosticoPrincipal: string;
  diagnosticosAceitos: string[];
  diagnosticosDiferenciaisEsperados: string[];
  diagnosticosPerigososQueDevemSerExcluidos: string[];
}

/** 4. Estado fisiológico */
export interface CaseFisiologia {
  estadoInicial: PatientState;
  estadoEsperadoSemIntervencao: string;
  criteriosMelhora: string[];
  criteriosPiora: string[];
  criteriosInstabilidade: string[];
  criteriosAltaSegura: string[];
  criteriosInternacao: string[];
  criteriosUTI: string[];
}

/** Comunicação esperada (evidências do domínio de comunicação da rubrica). */
export interface CaseComunicacao {
  itensEsperados: string[];
}

/** 5. Anamnese esperada */
export interface CaseAnamnese {
  perguntasObrigatorias: string[];
  perguntasImportantes: string[];
  respostasEsperadas: Record<string, string>;
  redFlagsAnamnese: string[];
}

/** 6. Exame físico */
export interface CaseExameFisico {
  manobrasObrigatorias: string[];
  achadosEsperados: string[];
  sinaisGravidade: string[];
  sinaisAusentesImportantes: string[];
}

/** 7. Exames complementares */
export interface CaseExames {
  examesEssenciais: string[];
  examesComplementaresAceitos: string[];
  examesNaoPrioritarios: string[];
  interpretacoesEsperadas: Record<string, string>;
  examesQueMudamConduta: string[];
}

export interface RespostaEsperadaIntervencao {
  intervencao: InterventionId;
  efeitoEsperado: string;
}

/** 8. Intervenções */
export interface CaseIntervencoes {
  intervencoesEssenciais: InterventionId[];
  intervencoesAceitas: InterventionId[];
  intervencoesContraindicadas: InterventionId[];
  intervencoesDeResgate: InterventionId[];
  respostaEsperadaPorIntervencao: RespostaEsperadaIntervencao[];
}

/** 9. Reavaliação */
export interface CaseReavaliacao {
  tempoReavaliacaoMinutos: number;
  parametrosReavaliar: string[];
  respostaAdequada: string;
  respostaInadequada: string;
  proximaCondutaSeMelhora: string;
  proximaCondutaSePiora: string;
}

/** 10. Erros críticos */
export interface CaseErrosCriticos {
  errosCriticosDiagnostico: string[];
  errosCriticosConduta: string[];
  errosCriticosSeguranca: string[];
  errosCriticosAlta: string[];
}

/** Status de compatibilidade de um caso com o Pulse Physiology Engine. */
export type PulseCompatibilityStatus = "strong" | "medium" | "weak" | "not-supported";

/** Provedor sugerido para o caso considerando o mapeamento Pulse. */
export type PulseSuggestedProvider = "medix-rule-based" | "pulse" | "hybrid";

/** Declaração de compatibilidade Pulse no próprio caso (contrato Fase 2.5). */
export interface PulseCompatibilityDeclaration {
  conditionId: string;
  compatibility: PulseCompatibilityStatus;
  suggestedSimulationProvider: PulseSuggestedProvider;
  pulseScenarioCandidates: string[];
  requiresMedixOverlay: boolean;
  pediatricSafetyAdapterRequired: boolean;
  notes: string[];
}

/** 11. Simulação */
export interface CaseSimulacao {
  simulationProvider: SimulationProvider;
  pulseReady: boolean;
  pulseScenarioId?: string;
  /** Marca explícita quando pulseScenarioId ainda é um placeholder. */
  pulseScenarioIsPlaceholder?: boolean;
  pulseAdapterNotes?: string;
  pediatricSafetyAdapterRequired?: boolean;
  physiologicModelTags: string[];
  /** Declaração de compatibilidade com o Pulse (ver lib/dynamic-osce/pulse). */
  pulseCompatibility?: PulseCompatibilityDeclaration;
}

/** Caso dinâmico completo. */
export interface DynamicCase {
  identificacao: CaseIdentificacao;
  paciente: CasePaciente;
  diagnostico: CaseDiagnostico;
  fisiologia: CaseFisiologia;
  comunicacao: CaseComunicacao;
  anamnese: CaseAnamnese;
  exameFisico: CaseExameFisico;
  exames: CaseExames;
  intervencoes: CaseIntervencoes;
  reavaliacao: CaseReavaliacao;
  errosCriticos: CaseErrosCriticos;
  simulacao: CaseSimulacao;
  /** 12. Rubrica vinculada (ver dynamic-rubric-link). */
  rubricaId: string;
}

// ============================================================================
// CONTRATO DA RUBRICA DINÂMICA (Fase 2)
// ============================================================================

export type TipoEvidencia =
  | "comunicacao"
  | "anamnese"
  | "exameFisico"
  | "exameComplementar"
  | "interpretacao"
  | "diagnostico"
  | "conduta"
  | "reavaliacao"
  | "seguranca";

export interface DynamicRubricCriterion {
  id: string;
  descricao: string;
  pontos: number;
  obrigatorio: boolean;
  tipoEvidencia: TipoEvidencia;
  /** Caminhos (dot-path) para campos do caso que sustentam o critério. */
  referenciasCaso: string[];
  aliasesAceitos: string[];
  penalidadeSeAusente?: number;
  erroCriticoAssociado?: string;
}

export interface DynamicRubricDomain {
  nome: string;
  pontos: number;
  criterios: DynamicRubricCriterion[];
}

export interface DynamicRubric {
  rubricaId: string;
  caseId: string;
  totalPontos: 20;
  dominios: DynamicRubricDomain[];
}

/** Nomes canônicos dos 6 domínios obrigatórios (na ordem). */
export const DOMINIOS_OBRIGATORIOS = [
  "Comunicação",
  "Anamnese",
  "Exame físico",
  "Exames e monitorização",
  "Raciocínio clínico",
  "Conduta e reavaliação",
] as const;

// ---- Sequência unificada e avaliação de atraso terapêutico -----------------

/** Item da sequência unificada de ações do aluno (intervenção OU exame). */
export type ItemSequencia =
  | { tipo: "intervencao"; id: InterventionId }
  | { tipo: "exame"; nome: string };

/** Classificação da sequência em relação ao atraso antes da intervenção salvadora. */
export type ClassificacaoAtraso =
  | "sem-atraso"
  | "alerta-leve"
  | "atraso-relevante"
  | "erro-critico";

/** Resultado da avaliação contextual de atraso terapêutico. */
export interface AvaliacaoAtrasoTerapeutico {
  classificacao: ClassificacaoAtraso;
  motivo: string;
  devePontuarNaoAtrasou: boolean;
  deveGerarErroCritico: boolean;
  alertas: string[];
}

// ---- Contexto e resultado do feedback --------------------------------------

export interface RubricEvalContext {
  comunicacaoItens: string[];
  anamneseItens: string[];
  exameItens: string[];
  examesSolicitados: string[];
  intervencoesAplicadas: InterventionId[];
  estadoInicial: PatientState;
  estadoFinal: PatientState;
  eventos: TimelineEvent[];
  erroCriticoRegistrado: boolean;
  /** Avaliação contextual do atraso antes da intervenção salvadora (ex.: descompressão). */
  atrasoTerapiaSalvadora?: AvaliacaoAtrasoTerapeutico;
}

export interface DynamicFeedbackCriterion {
  descricao: string;
  pontos: number;
  cumprido: boolean;
}

export interface DynamicFeedbackDomain {
  nome: string;
  obtido: number;
  maximo: number;
  itens: DynamicFeedbackCriterion[];
}

export interface DynamicFeedbackResult {
  nota: number;
  total: number;
  classificacao: "Insuficiente" | "Regular" | "Bom" | "Excelente";
  dominios: DynamicFeedbackDomain[];
  acertos: string[];
  melhorias: string[];
  errosCriticos: string[];
}
