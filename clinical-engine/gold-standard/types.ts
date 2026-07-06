// ============================================================================
// Clinical Engine — GOLD STANDARD (tipos)
// ----------------------------------------------------------------------------
// O "Gold Standard" é o GABARITO PERFEITO de um caso: uma normalização do Caso
// Canônico numa estrutura estável, pensada para ser a FONTE DE VERDADE pedagógica
// de Professor IA, HealthBench, Feedback futuro, resposta modelo, checklist nota
// máxima, plano de estudo e Centro Clínico inteligente.
//
// Módulo 100% ADITIVO e desacoplado. NÃO chama IA, NÃO cria endpoint/UI e NÃO é
// consumido por nenhum runtime ainda.
// ============================================================================

export const GOLD_STANDARD_SCHEMA_VERSION = "1.0.0" as const;

/** Grau de obrigatoriedade de um item no gabarito. */
export type GoldStandardObligation = "obrigatorio" | "recomendado" | "complementar";

/** Eixo de competência (espelha os eixos usados pelo HealthBench/Professor IA). */
export type GoldStandardAxis =
  | "comunicacao"
  | "anamnese"
  | "exameFisico"
  | "examesComplementares"
  | "raciocinioDiagnostico"
  | "condutaSeguranca";

// ── Seção genérica (representação achatada e legível de qualquer área) ───────
export interface GoldStandardSection {
  id: string;
  titulo: string;
  itens: string[];
}

// ── Checklist (itens de nota máxima) ─────────────────────────────────────────
export interface GoldStandardChecklistItem {
  id: string;
  item: string;
  critico: boolean;
  obrigatoriedade: GoldStandardObligation;
  eixo?: GoldStandardAxis;
}

// ── Anamnese ─────────────────────────────────────────────────────────────────
export interface GoldStandardHistory {
  obrigatoria: string[];
  recomendada: string[];
  redFlags: string[];
}

// ── Exame físico ─────────────────────────────────────────────────────────────
export interface GoldStandardPhysicalExam {
  obrigatorio: string[];
  recomendado: string[];
  achadosEsperados: string[];
}

// ── Exames complementares ────────────────────────────────────────────────────
export interface GoldStandardExamRequest {
  nome: string;
  obrigatoriedade: GoldStandardObligation;
  resultadoEsperado: string;
  justificativa: string;
  categoria?: string;
  ref?: string;
}

// ── Diagnóstico + diferenciais ───────────────────────────────────────────────
export interface GoldStandardDifferential {
  diagnostico: string;
  porQueNaoE: string;
  achadosQueDescartam: string[];
}

export interface GoldStandardDiagnosis {
  principal: string;
  porQueE: string[];
  diferenciais: GoldStandardDifferential[];
}

// ── Conduta ideal ────────────────────────────────────────────────────────────
export interface GoldStandardManagement {
  condutaIdeal: string[];
  antibiotico?: string;
  criteriosGravidade: string[];
  orientacoes: string[];
  seguimento: string[];
  criteriosInternacao: string[];
  criteriosAlta: string[];
}

// ── Erros críticos ───────────────────────────────────────────────────────────
export interface GoldStandardCriticalError {
  id: string;
  erro: string;
  descricao: string;
  penalidade: number;
}

// ── Pontos de ensino ─────────────────────────────────────────────────────────
export interface GoldStandardTeachingPoint {
  id: string;
  ponto: string;
  perguntaSocratica?: string;
}

// ── Feedback / resposta modelo ───────────────────────────────────────────────
export interface GoldStandardFeedbackModel {
  respostaModelo: string;
  checklistNotaMaxima: string[];
  pegadinhas: string[];
  errosComuns: string[];
  planoDeReforco: string[];
}

// ── Dicas do Professor IA ────────────────────────────────────────────────────
export interface GoldStandardProfessorHints {
  objetivos: string[];
  perguntasSocraticas: string[];
  pontosParaReforcar: string[];
  errosParaExplorar: string[];
  miniAula: string;
  planoDeTreino: string[];
}

// ── Recursos ligados (Centro Clínico + Knowledge Graph) ──────────────────────
export interface GoldStandardResourceLink {
  dominio: string;
  titulo: string;
  href?: string;
  ancoras?: string[];
}

export interface GoldStandardResources {
  centroClinico: GoldStandardResourceLink[];
  /** ids do Knowledge Graph (dedup) referenciados pelo caso. */
  knowledgeGraph: string[];
}

// ============================================================================
// TRUTH LAYERS (Fase 13) — modularização conceitual do gabarito.
// O Gold Standard deixa de ser só um objeto grande e passa a organizar a verdade
// do caso em 5 camadas escaláveis. Aditivo: `truthLayers?` é opcional no
// GoldStandardCase e não quebra nenhum consumidor existente.
// ============================================================================

/** 1. Clinical Truth — a medicina pura do caso. */
export interface ClinicalTruth {
  diagnosticoPrincipal: string;
  fisiopatologiaEssencial: string;
  diferenciais: GoldStandardDifferential[];
  justificativaDiagnostica: string[];
  achadosClinicosChave: string[];
  sinaisDeGravidade: string[];
  condutaClinicaIdeal: string[];
  tratamento: string[];
  criteriosInternacao: string[];
  criteriosAlta: string[];
  errosClinicosGraves: string[];
}

/** 2. Educational Truth — como o caso deve ser ensinado. */
export interface EducationalTruth {
  objetivosDeAprendizagem: string[];
  conceitosEssenciais: string[];
  sequenciaDidatica: string[];
  pegadinhas: string[];
  errosComuns: string[];
  analogiasPermitidas: string[];
  pontosDeConfusao: string[];
  perguntasParaRaciocinio: string[];
}

/** Item de peso (espelha rubrica de correção). */
export interface EvaluationWeight {
  criterio: string;
  peso: number;
  pontuacaoMaxima: number;
}

/** 3. Evaluation Truth — como o caso deve ser avaliado. */
export interface EvaluationTruth {
  checklistNotaMaxima: GoldStandardChecklistItem[];
  criteriosObrigatorios: string[];
  criteriosCriticos: string[];
  microcriteriosPorEixo: Partial<Record<GoldStandardAxis, string[]>>;
  pesos: EvaluationWeight[];
  errosCriticos: GoldStandardCriticalError[];
  eixosHealthBench: GoldStandardAxis[];
  criteriosQueReprovam: string[];
  objetivosAvaliaveis: string[];
}

/** Item de mini-quiz (pergunta objetiva + resposta). */
export interface TeachingQuizItem {
  pergunta: string;
  resposta: string;
}

/** 4. Teaching Truth — como o Professor IA deve conduzir o ensino. */
export interface TeachingTruth {
  objetivosDoProfessor: string[];
  perguntasSocraticas: string[];
  miniAulas: string[];
  modoSeErroCritico: string;
  modoSeNotaAlta: string;
  feedbackEsperado: string;
  planoDeTreino: string[];
  miniQuiz: TeachingQuizItem[];
  explicacoesCurtas: string[];
  explicacoesAprofundadas: string[];
}

/** 5. Resource Truth — todos os recursos da plataforma ligados ao caso. */
export interface ResourceTruth {
  centroClinico: GoldStandardResourceLink[];
  knowledgeGraph: string[];
  sons: string[];
  imagens: string[];
  exames: string[];
  fluxos: string[];
  guidelines: string[];
  scores: string[];
  farmacos: string[];
  referencias: string[];
}

/** As 5 Truth Layers do Gold Standard. */
export interface GoldStandardTruthLayers {
  clinical: ClinicalTruth;
  educational: EducationalTruth;
  evaluation: EvaluationTruth;
  teaching: TeachingTruth;
  resource: ResourceTruth;
}

// ── Caso Gold Standard completo ──────────────────────────────────────────────
export interface GoldStandardCase {
  schemaVersion: string;
  geradoEm: string;
  geradoDe: {
    canonicalId: string;
    legacyId: number | string;
    titulo: string;
    diagnostico: string;
  };
  objetivosEstacao: string[];
  anamnese: GoldStandardHistory;
  exameFisico: GoldStandardPhysicalExam;
  exames: {
    obrigatorios: GoldStandardExamRequest[];
    complementares: GoldStandardExamRequest[];
  };
  diagnostico: GoldStandardDiagnosis;
  conduta: GoldStandardManagement;
  errosCriticos: GoldStandardCriticalError[];
  checklistNotaMaxima: GoldStandardChecklistItem[];
  pontosDeEnsino: GoldStandardTeachingPoint[];
  feedbackModelo: GoldStandardFeedbackModel;
  professor: GoldStandardProfessorHints;
  recursos: GoldStandardResources;
  /** Representação achatada e legível (uma seção por área) — conveniência. */
  secoes: GoldStandardSection[];
  /** Modularização em 5 camadas de verdade (Fase 13). Opcional p/ retrocompat. */
  truthLayers?: GoldStandardTruthLayers;
}
