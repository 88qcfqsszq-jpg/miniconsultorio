/**
 * Attempt Schema — formato OFICIAL de uma tentativa OSCE (Fase 2).
 *
 * Centraliza a representação de uma tentativa completa, compatível com HealthBench.
 * O HealthBenchAttemptRecord é o objeto canônico persistido por /api/osce/finalizar.
 *
 * Reaproveita os tipos já existentes em ./types (não duplica).
 */

import type {
  HealthBenchMessage,
  HealthBenchTranscript,
  HealthBenchEvaluationResult,
} from "./types";

export type OSCEMode = "training" | "exam";

/** Evento bruto vindo do frontend (clique/ação/resultado). */
export interface OSCEAttemptEvent {
  kind:
    | "chat"
    | "physical_exam"
    | "vital_signs"
    | "exam_request"
    | "image_exam"
    | "ecg"
    | "final_answer";
  role?: HealthBenchMessage["role"];
  label?: string;
  content?: string;
  raw?: unknown;
  timestamp?: string;
}

/** SOAP estruturado. */
export interface OSCEAttemptSoap {
  subjetivo?: string;
  objetivo?: string;
  avaliacao?: string;
  plano?: string;
}

/** Hipótese / diagnóstico / conduta. */
export interface OSCEAttemptDiagnosisAndPlan {
  hipotesePrincipal?: string;
  diagnosticosDiferenciais?: string[];
  examesIndicados?: string[];
  conduta?: string;
}

/**
 * Entrada bruta do frontend ao finalizar (payload do /api/osce/finalizar).
 * Inclui canais que o HealthBench ainda não pontua diretamente (imagem/ecg),
 * mas que entram no transcript como contexto.
 */
export interface OSCEAttemptInput {
  casoId: number | string;
  attemptId?: string;
  alunoId?: string;
  mode?: OSCEMode | "treinamento" | "prova" | string;
  startedAt?: string;
  tempoAtendimento?: number;

  chatMessages?: Array<{ tipo?: string; role?: string; conteudo?: string; content?: string }>;
  physicalExamEvents?: Array<{ categoria?: string; textDigitado?: string; resposta?: string }>;
  vitalSignsEvents?: { solicitado?: boolean; dados?: Record<string, unknown> } | null;
  examRequests?: Array<{ nome?: string; resultado?: string }>;
  imageExamEvents?: Array<{ tipo?: string; descricao?: string; resultado?: string; imageUrl?: string }>;
  ecgEvents?: Array<{ tipo?: string; descricao?: string; laudo?: string }>;
  soap?: OSCEAttemptSoap;
  diagnosisAndPlan?: OSCEAttemptDiagnosisAndPlan;
}

/** Snapshot consolidado do atendimento (intermediário, pré-avaliação). */
export interface OSCEAttemptSnapshot {
  casoId: number;
  attemptId: string;
  alunoId?: string;
  mode: OSCEMode;
  startedAt: string;
  finishedAt: string;
  tempoAtendimento?: number;
  transcript: HealthBenchTranscript;
  eventosDoAtendimento: OSCEAttemptEvent[];
  soap?: OSCEAttemptSoap;
  diagnosisAndPlan?: OSCEAttemptDiagnosisAndPlan;
}

/** Payload final pronto para avaliação + persistência. */
export interface OSCEAttemptFinalPayload extends OSCEAttemptSnapshot {
  healthBenchResult?: HealthBenchEvaluationResult;
  legacyCorrectionResult?: unknown;
}

/** Resultado normalizado do legado para comparação. */
export interface LegacyCorrectionNormalized {
  nota: number;
  pontuacaoMaxima: number;
  classificacao?: string;
  errosCriticos?: string[];
  raw?: unknown;
}

export interface LegacyVsHealthBenchComparison {
  legacyNota: number | null;
  healthBenchNota: number;
  diferenca: number | null;
  legacyClassificacao?: string;
  healthBenchPassed: boolean;
  divergenciaSignificativa: boolean; // |diferença| > 3 pontos
}

/** Objeto canônico persistido de uma tentativa OSCE. */
export interface HealthBenchAttemptRecord {
  attemptId: string;
  casoId: number;
  alunoId?: string;
  startedAt: string;
  finishedAt: string;
  mode: OSCEMode;
  transcript: HealthBenchTranscript;
  eventosDoAtendimento: OSCEAttemptEvent[];
  soap?: OSCEAttemptSoap;
  diagnosisAndPlan?: OSCEAttemptDiagnosisAndPlan;
  healthBenchResult?: HealthBenchEvaluationResult;
  legacyCorrectionResult?: unknown;
  comparison?: LegacyVsHealthBenchComparison;
  createdAt: string;
  updatedAt: string;
}

/** Normaliza o modo recebido para o enum interno. */
export function normalizarModo(mode?: string): OSCEMode {
  if (!mode) return "training";
  const m = mode.toLowerCase();
  if (m === "exam" || m === "prova" || m === "osce") return "exam";
  return "training";
}
