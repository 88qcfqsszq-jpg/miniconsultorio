/**
 * MiniConsultorio HealthBench Engine — Tipos centrais
 *
 * Inspirado no OpenAI HealthBench (healthbench_eval.py / types.py), adaptado
 * para o fluxo OSCE do Mini Consultório.
 *
 * Princípios:
 * - A rubrica OSCE existente (Caso.rubrica_correcao + checklist_osce + erros_criticos)
 *   é a FONTE OFICIAL. Aqui apenas a convertemos para um formato HealthBench-like.
 * - Avaliação critério-por-critério (um grader por item).
 * - Score = pontos cumpridos / pontos positivos possíveis (negativos descontam).
 */

// ============================================================================
// TRANSCRIPT (linha do tempo única do atendimento)
// ============================================================================

export type HealthBenchRole =
  | "patient" // fala do paciente simulado
  | "student" // fala/pergunta do aluno
  | "student_action" // ação do aluno (ex.: solicitou ausculta)
  | "student_final_answer" // hipótese/diagnóstico/conduta/SOAP
  | "system_event"; // resultado objetivo (sinais vitais, achados, exames)

export interface HealthBenchMessage {
  role: HealthBenchRole;
  content: string;
}

export type HealthBenchTranscript = HealthBenchMessage[];

// ============================================================================
// RUBRICA (formato HealthBench-like)
// ============================================================================

export type HealthBenchRubricType = "positive" | "negative";

export interface HealthBenchRubricItem {
  id: string;
  criterion: string;
  points: number;
  tags: string[];
  critical?: boolean;
  type?: HealthBenchRubricType;
  /** id/critério da rubrica OSCE original que deu origem a este item */
  sourceRubricId?: string;
}

// ============================================================================
// GRADE (resultado da avaliação de UM critério)
// ============================================================================

export interface HealthBenchCriterionGrade {
  rubricItemId: string;
  criterion: string;
  criteria_met: boolean;
  explanation: string;
  points: number;
  points_awarded: number;
  tags: string[];
  critical?: boolean;
  type?: HealthBenchRubricType;
}

// ============================================================================
// ENTRADA / SAÍDA DA AVALIAÇÃO
// ============================================================================

/** Payload bruto do atendimento, igual ao já coletado no botão Finalizar. */
export interface HealthBenchAtendimentoInput {
  casoId: number | string;
  attemptId?: string;
  chatMessages?: Array<{ tipo?: string; role?: string; conteudo?: string; content?: string }>;
  physicalExamEvents?: Array<{ categoria?: string; textDigitado?: string; resposta?: string }>;
  vitalSignsEvents?: { solicitado?: boolean; dados?: Record<string, unknown> } | null;
  examRequests?: Array<{ nome?: string; resultado?: string }>;
  diagnosisAndPlan?: {
    hipotesePrincipal?: string;
    diagnosticosDiferenciais?: string[];
    examesIndicados?: string[];
    conduta?: string;
  };
  soap?: { subjetivo?: string; objetivo?: string; avaliacao?: string; plano?: string };
  /** eventos genéricos adicionais já em formato de timeline (opcional) */
  eventosDoAtendimento?: HealthBenchMessage[];
  mode?: "treinamento" | "prova" | string;
  tempoAtendimento?: number;
}

export interface HealthBenchEvaluationInput {
  casoId: number;
  attemptId?: string;
  transcript: HealthBenchTranscript;
  rubric: HealthBenchRubricItem[];
  /** escala máxima do app (Mini Consultório usa 20) */
  pontuacaoMaxima?: number;
  mode?: string;
}

export interface HealthBenchCompetencyScore {
  axis: string;
  label: string;
  pointsAwarded: number;
  pointsPossible: number;
  score01: number;
}

export interface HealthBenchEvaluationResult {
  casoId: number;
  attemptId?: string;
  score01: number;
  notaFinal: number;
  pontuacaoMaxima: number;
  passed: boolean;
  grades: HealthBenchCriterionGrade[];
  competencyScores: Record<string, number>;
  themeScores: Record<string, number>;
  criticalErrors: HealthBenchCriterionGrade[];
  professorFeedback: string;
  nextTrainingFocus: string[];
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    estimated_cost_usd?: number;
  };
  /** marca que é avaliação educacional simulada */
  disclaimer: string;
}

/** Registro persistível de uma tentativa (estilo _allresults). */
export interface HealthBenchAttemptResult {
  attemptId: string;
  casoId: number;
  createdAt: string;
  transcript: HealthBenchTranscript;
  rubrics: HealthBenchRubricItem[];
  grades: HealthBenchCriterionGrade[];
  metrics: {
    overall_score: number;
    competencyScores: Record<string, number>;
    themeScores: Record<string, number>;
    criticalErrorCount: number;
  };
  feedback: string;
  usage?: HealthBenchEvaluationResult["usage"];
}

// ============================================================================
// TAGS PADRÃO
// ============================================================================

export const AXIS_TAGS = {
  anamnese: "axis:anamnese",
  comunicacao: "axis:comunicacao",
  exame_fisico: "axis:exame_fisico",
  exames_complementares: "axis:exames_complementares",
  raciocinio_clinico: "axis:raciocinio_clinico",
  conduta: "axis:conduta",
  seguranca: "axis:seguranca",
  conduta_seguranca: "axis:conduta_seguranca",
} as const;

export const AXIS_LABELS: Record<string, string> = {
  "axis:anamnese": "Anamnese",
  "axis:comunicacao": "Comunicação",
  "axis:exame_fisico": "Exame físico",
  "axis:exames_complementares": "Exames complementares",
  "axis:raciocinio_clinico": "Raciocínio clínico",
  "axis:conduta": "Conduta",
  "axis:seguranca": "Segurança",
  "axis:conduta_seguranca": "Conduta e Segurança",
};

export const DISCLAIMER_EDUCACIONAL =
  "Avaliação educacional gerada por simulação OSCE. Não constitui orientação médica real nem se aplica a pacientes reais.";
