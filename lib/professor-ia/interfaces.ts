// ============================================================================
// Professor IA — INTERFACES COMPOSTAS (contexto, conhecimento, plano, conversa)
// ----------------------------------------------------------------------------
// Módulo desacoplado, não utilizado ainda. Importa tipos EXISTENTES apenas como
// `type` (zero acoplamento de runtime; nada é modificado nos módulos originais).
// ============================================================================

import type {
  CasoId,
  AlunoId,
  AttemptId,
  Timestamp,
  Score01,
  Nota20,
  ProfessorIAMode,
  CompetencyAxis,
  KnowledgeDomain,
  ResourceType,
  ClinicalTheme,
  StudyPriority,
  GapSeverity,
  DataSource,
} from "./types";

// Tipos existentes reaproveitados (somente leitura, import type).
import type { HealthBenchEvaluationResult } from "@/lib/healthbench/types";
// Gold Standard + Truth Layers (Fase 14) — somente leitura (import type).
import type { GoldStandardCase, GoldStandardTruthLayers } from "../../clinical-engine/gold-standard/types";
// Student Model (Fase 15) — perfil longitudinal do aluno (import type).
import type { StudentModel, StudentModelSummary } from "./student-model";
// Learning Session (Fase 16) — estado atual da sessão (import type).
import type { LearningSession, LearningSessionSummary } from "./learning-session";
// Student Trace (Fase 22) — rastro real do aluno (import type).
import type { StudentTrace, StudentTraceSummary, StudentTraceValidationResult } from "./student-trace";

// ============================================================================
// 1. DADOS DO CASO / PACIENTE
// ============================================================================

export interface PacienteInfo {
  nome?: string;
  idade?: number;
  sexo?: "M" | "F" | string;
  tipoPaciente?: "adulto" | "pediatrico" | string;
  queixaPrincipal?: string;
  dadosVisiveis?: Record<string, unknown>;
}

export interface CasoResumo {
  id: CasoId;
  titulo?: string;
  sistema?: string;
  tema?: string;
  categoria?: string;
  tema_clinico?: ClinicalTheme;
  /** Diagnóstico correto do caso (fonte da verdade pedagógica). */
  diagnosticoCorreto?: string;
  /** Diferenciais esperados pelo gabarito do caso. */
  diferenciaisEsperados?: string[];
  objetivoPedagogico?: string;
  subtopicos?: string[];
}

// ============================================================================
// 2. TIMELINE DO ATENDIMENTO (o que o aluno fez)
// ============================================================================

export interface ConversaMensagem {
  autor: "aluno" | "paciente" | "sistema";
  conteudo: string;
  timestamp?: Timestamp;
}

export interface ExameFisicoEvento {
  categoria?: string;
  /** Texto registrado (ex.: "[Ausculta Pulmonar] RLA — Ausculta pulmonar"). */
  acao: string;
  /** Achado/resposta objetiva devolvida ao aluno. */
  achado?: string;
  /** Local anatômico / hotspot clicado, quando aplicável. */
  local?: string;
  timestamp?: Timestamp;
}

export interface AuscultaRealizada {
  tipo: "pulmonar" | "cardiaca";
  /** Foco/ponto auscultado (RUA…LLA ou RUSB/Apex…). */
  local: string;
  /** Tipo de som esperado (do caso), ex.: "coarse_crackles" / "late_diastolic_murmur". */
  somEsperado?: string;
  /** Arquivo tocado ou null (silêncio didático). */
  arquivo?: string | null;
  /** Interpretação registrada pelo aluno, se houver. */
  respostaAluno?: string;
}

export interface ExameSolicitado {
  nome: string;
  resultado?: string;
  interpretadoPeloAluno?: boolean;
}

export interface ECGVisualizado {
  visualizado: boolean;
  laudoEsperado?: string;
  ritmo?: string;
  achados?: string[];
}

export interface ImagemAberta {
  tipo?: string; // ex.: radiografia, tomografia
  termoBusca?: string;
  url?: string;
  fonte?: string; // ex.: Open-i / NLM
  interpretadaPeloAluno?: boolean;
}

export interface SinaisVitaisRegistro {
  solicitado: boolean;
  dados?: Record<string, unknown> | null;
}

export interface TempoAtendimento {
  totalSegundos: number;
  inicio?: Timestamp;
  fim?: Timestamp;
}

// ============================================================================
// 3. RESPOSTA DO ALUNO (SOAP / diagnóstico / conduta)
// ============================================================================

export interface SOAPAluno {
  subjetivo?: string;
  objetivo?: string;
  avaliacao?: string;
  plano?: string;
}

export interface RespostaAluno {
  hipotesePrincipal?: string;
  diagnosticosDiferenciais?: string[];
  examesIndicados?: string[];
  conduta?: string;
  soap?: SOAPAluno;
}

// ============================================================================
// 4. AVALIAÇÃO (espelho do que o HealthBench produziu — somente leitura)
// ============================================================================

export interface CompetenciaResultado {
  axis: CompetencyAxis;
  label: string;
  pontosObtidos: number;
  pontosMaximos: number;
  score01: Score01;
  acertos: string[];
  aMelhorar: string[];
}

export interface AvaliacaoHealthBenchResumo {
  attemptId?: AttemptId;
  nota: Nota20;
  pontuacaoMaxima: number;
  score01: Score01;
  passed: boolean;
  classificacao?: string;
  competencias: CompetenciaResultado[];
  errosCriticos: string[];
  focosDeTreino: string[]; // nextTrainingFocus
  justificativaNota?: string;
  /** Resultado bruto do HealthBench, se o consumidor quiser inspecionar. */
  bruto?: HealthBenchEvaluationResult;
}

// ============================================================================
// 5. MATERIAL DIDÁTICO (resposta modelo / checklist / mini-aula)
//    (fonte real hoje: /api/estudo-final-caso)
// ============================================================================

export interface MaterialDidatico {
  respostaModelo?: string;
  checklistNotaMaxima?: string[];
  errosCriticosDidaticos?: string[];
  resumoEspecialista?: string;
  especialidadeReferencia?: string;
  secoes?: Array<{ titulo: string; conteudo: string }>;
}

// ============================================================================
// 6. CONHECIMENTO RELACIONADO (Centro Clínico + bibliotecas)
// ============================================================================

export interface KnowledgeResource {
  id: string;
  domain: KnowledgeDomain;
  tipo: ResourceType;
  titulo: string;
  /** Rota interna do Centro Clínico (ex.: /centro-clinico/semiologia). */
  href?: string;
  /** Termos/âncoras para localizar dentro da página (ex.: "Cardiologia"). */
  ancoras?: string[];
  descricao?: string;
}

export interface KnowledgeMap {
  diagnosisKey?: string;
  tema?: ClinicalTheme;
  semiologia: KnowledgeResource[];
  fluxos: KnowledgeResource[];
  exames: KnowledgeResource[];
  imagens: KnowledgeResource[];
  sons: KnowledgeResource[];
  escores: KnowledgeResource[];
  guias: KnowledgeResource[];
  /** Lista achatada de todos os recursos (conveniência). */
  todos: KnowledgeResource[];
}

// ============================================================================
// 7. PLANO DE ESTUDO ESTRUTURADO
// ============================================================================

export interface StudyPlanItem {
  prioridade: StudyPriority;
  competencia?: CompetencyAxis;
  titulo: string;
  motivo: string; // por que caiu nesta prioridade (baseado no HealthBench)
  severidade: GapSeverity;
  recursos: KnowledgeResource[];
}

export interface StudyPlan {
  casoId: CasoId;
  attemptId?: AttemptId;
  itens: StudyPlanItem[];
  prioridade1: StudyPlanItem[];
  prioridade2: StudyPlanItem[];
  prioridade3: StudyPlanItem[];
  recursosRelacionados: KnowledgeResource[];
  resumo: string;
}

// ============================================================================
// 7.5 GOLD STANDARD + TRUTH LAYERS (Fase 14) — resumos consumidos pelo Professor IA
// ============================================================================

export interface ClinicalTruthSummary {
  diagnostico: string;
  diferenciais: string[];
  sinaisDeGravidade: string[];
  condutaIdeal: string[];
  errosClinicosGraves: string[];
}
export interface EducationalTruthSummary {
  conceitosEssenciais: string[];
  pegadinhas: string[];
  pontosDeConfusao: string[];
  perguntas: string[];
}
export interface EvaluationTruthSummary {
  criteriosObrigatorios: string[];
  criteriosCriticos: string[];
  errosCriticos: string[];
  eixos: string[];
}
export interface TeachingTruthSummary {
  objetivos: string[];
  perguntasSocraticas: string[];
  miniAulas: string[];
  miniQuiz: Array<{ pergunta: string; resposta: string }>;
  modoSeErroCritico: string;
  modoSeNotaAlta: string;
}
export interface ResourceTruthSummary {
  centroClinico: Array<{ dominio: string; titulo: string; href?: string }>;
  sons: string[];
  imagens: string[];
  exames: string[];
  fluxos: string[];
  guidelines: string[];
  scores: string[];
  farmacos: string[];
  referencias: string[];
}

/** Resumo compacto das 5 Truth Layers para o Professor IA. */
export interface TruthLayersResumo {
  presente: boolean;
  camadas: string[];
  clinical?: ClinicalTruthSummary;
  educational?: EducationalTruthSummary;
  evaluation?: EvaluationTruthSummary;
  teaching?: TeachingTruthSummary;
  resource?: ResourceTruthSummary;
}

// ============================================================================
// 8. CONTEXTO COMPLETO DO PROFESSOR IA
// ============================================================================

export interface ReferenciaUtilizada {
  fonte: string; // ex.: "Open-i / NLM", "HLS-CMDS", "Centro Clínico"
  descricao?: string;
  url?: string;
}

/** Proveniência de cada bloco (para auditoria e transparência). */
export interface ContextProvenance {
  bloco: string;
  fonte: DataSource;
  presente: boolean;
}

/**
 * OBJETO CENTRAL. Reúne TUDO que o Professor IA poderá usar. Montado por
 * context-builder.ts. Nenhum campo aciona IA; é só dados.
 */
export interface ProfessorIAContext {
  schemaVersion: string;
  geradoEm: Timestamp;
  mode: ProfessorIAMode;

  alunoId?: AlunoId;
  caso: CasoResumo;
  paciente: PacienteInfo;

  // Timeline do atendimento
  conversa: ConversaMensagem[];
  exameFisico: ExameFisicoEvento[];
  auscultas: AuscultaRealizada[];
  exames: ExameSolicitado[];
  ecg?: ECGVisualizado;
  imagens: ImagemAberta[];
  sinaisVitais?: SinaisVitaisRegistro;
  tempo?: TempoAtendimento;

  // Resposta do aluno
  respostaAluno: RespostaAluno;

  // Avaliação e material didático
  avaliacao?: AvaliacaoHealthBenchResumo;
  material?: MaterialDidatico;

  // Conhecimento relacionado e referências
  conhecimento: KnowledgeMap;
  referencias: ReferenciaUtilizada[];

  // Plano de estudo (opcional; pode ser montado à parte)
  planoDeEstudo?: StudyPlan;

  // Gold Standard + Truth Layers (Fase 14) — fonte de verdade pedagógica (opcional).
  goldStandard?: GoldStandardCase;
  truthLayers?: GoldStandardTruthLayers;
  truthLayersResumo?: TruthLayersResumo;

  // Student Model (Fase 15) — perfil longitudinal do aluno (opcional).
  studentModel?: StudentModel;
  studentSummary?: StudentModelSummary;

  // Learning Session (Fase 16) — estado atual da sessão (opcional).
  learningSession?: LearningSession;
  learningSessionSummary?: LearningSessionSummary;

  // Student Trace (Fase 22) — rastro REAL do aluno (fonte única de elogio).
  studentTrace?: StudentTrace;
  studentTraceSummary?: StudentTraceSummary;
  traceValidation?: StudentTraceValidationResult;

  // Auditoria de proveniência
  proveniencia: ContextProvenance[];
}

// ============================================================================
// 9. MODELO DE CONVERSA (apenas prompts; SEM IA, SEM endpoint)
// ============================================================================

export interface ProfessorPrompts {
  system: string;
  contexto: string;
  caso: string;
  professor: string;
  seguranca: string;
  naoInventarMedicina: string;
  apenasBaseDoSistema: string;
  /** Verdade do caso (Gold Standard + Truth Layers) — Fase 14, opcional. */
  verdade?: string;
  /** Perfil longitudinal do aluno (Student Model) — Fase 15, opcional. */
  aluno?: string;
  /** Estado atual da sessão (Learning Session) — Fase 16, opcional. */
  sessao?: string;
  /** Condução da sessão (persona + estratégia + limites) — Fase 10, opcional. */
  conducao?: string;
}

export interface ConversationModel {
  mode: ProfessorIAMode;
  prompts: ProfessorPrompts;
  /** Ordem sugerida de composição das mensagens (para uso futuro). */
  ordemComposicao: Array<keyof ProfessorPrompts>;
  /** Metadados úteis (modelo sugerido, limites) — não executa nada. */
  sugestao: {
    modeloSugerido: string;
    temperaturaSugerida: number;
    maxTokensSugerido: number;
  };
}

// ============================================================================
// 10. ENTRADAS DOS BUILDERS
// ============================================================================

/** Entrada crua do context-builder — tolerante e opcional (nada obrigatório além do caso). */
export interface ProfessorContextInput {
  mode?: ProfessorIAMode;
  alunoId?: AlunoId;

  /** Caso (aceita o objeto Caso do app ou um subconjunto). */
  caso: any;

  chatMessages?: Array<{ tipo?: string; role?: string; conteudo?: string; content?: string; timestamp?: string }>;
  physicalExamEvents?: Array<{ categoria?: string; textDigitado?: string; resposta?: string; local?: string }>;
  auscultas?: AuscultaRealizada[];
  examRequests?: Array<{ nome?: string; resultado?: string; interpretadoPeloAluno?: boolean }>;
  ecg?: ECGVisualizado;
  imagens?: ImagemAberta[];
  sinaisVitais?: SinaisVitaisRegistro;
  tempoAtendimentoSegundos?: number;

  diagnosisAndPlan?: {
    hipotesePrincipal?: string;
    diagnosticosDiferenciais?: string[];
    examesIndicados?: string[];
    conduta?: string;
  };
  soap?: SOAPAluno;

  /** Gold Standard do caso (Fase 14) — se disponível, vira fonte de verdade pedagógica. */
  goldStandard?: GoldStandardCase;

  /** Modelo longitudinal do aluno (Fase 15) — se disponível, personaliza o ensino. */
  studentModel?: StudentModel;

  /** Estado atual da sessão (Fase 16) — se disponível, adapta a condução ao momento. */
  learningSession?: LearningSession;

  /** Resultado do HealthBench (se já avaliado). */
  healthBenchResult?: HealthBenchEvaluationResult;
  /** Material do /api/estudo-final-caso (se já buscado). */
  estudoFinal?: {
    respostaModelo?: string;
    checklistNotaMaxima?: string[];
    errosCriticos?: string[];
    resumoEspecialista?: string;
    especialidadeReferencia?: string;
    secoes?: Array<{ titulo: string; conteudo: string }>;
  };
}

export interface StudyPlanInput {
  caso: CasoResumo | any;
  avaliacao?: AvaliacaoHealthBenchResumo;
  healthBenchResult?: HealthBenchEvaluationResult;
  checklist?: string[];
  conhecimento?: KnowledgeMap;
  /** Gold Standard do caso (Fase 14) — prioriza Evaluation/Teaching Truth quando presente. */
  goldStandard?: GoldStandardCase;
  /** Modelo do aluno (Fase 15) — prioriza erros recorrentes e revisão longitudinal. */
  studentModel?: StudentModel;
  /** Estado da sessão (Fase 16) — adapta o plano ao momento (tempo, modo, frustração). */
  learningSession?: LearningSession;
}
