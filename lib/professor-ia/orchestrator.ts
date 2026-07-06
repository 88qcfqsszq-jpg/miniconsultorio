// ============================================================================
// Professor IA — ORQUESTRADOR GENERATIVO CONTROLADO (Fase 20)
// ----------------------------------------------------------------------------
// Conecta um modelo generativo ao Professor IA de forma CONTROLADA: o modelo NÃO
// decide o que ensinar, qual erro priorizar, qual conduta é correta, qual recurso
// usar nem a próxima etapa — tudo isso vem do ProfessorLesson → LessonFlow →
// LessonStep. O modelo apenas transforma UM LessonStep em fala natural.
//
// PURO quanto a dependências: NÃO importa a SDK da OpenAI. A chamada real é
// injetada via `callModel` (a rota /api/professor-ia injeta o client). Sem chave
// → fallback estático do próprio step. Nunca lança para fora (try/catch interno).
// ============================================================================

import type { ProfessorLesson } from "./professor-lesson";
import type { LessonStep, LessonStepResource } from "./lesson-step-engine";
import { validateProfessorMessageAgainstTrace } from "./student-trace";

export interface OrchestratorHistoryItem {
  role: "professor" | "aluno";
  content: string;
}

export interface OrchestratorInput {
  lesson: ProfessorLesson;
  currentStepId?: string;
  studentMessage?: string;
  history?: OrchestratorHistoryItem[];
}

export interface OrchestratorResult {
  ok: boolean;
  professorMessage: string;
  currentStepId: string;
  nextStepId?: string;
  shouldWaitForStudent: boolean;
  resourcesToShow: LessonStepResource[];
  safetyNotes: string[];
  source: "model" | "fallback";
  debug?: Record<string, unknown>;
}

/** Contrato do modelo — recebe o prompt controlado, devolve texto curto. */
export type CallModel = (prompt: { system: string; user: string }) => Promise<string>;

/** Localiza o LessonStep atual no LessonFlow (ou o primeiro). */
export function resolveCurrentStep(lesson: ProfessorLesson, currentStepId?: string): LessonStep | null {
  const steps = lesson.lessonFlow?.steps ?? lesson.lessonSteps?.steps ?? [];
  if (steps.length === 0) return null;
  if (currentStepId) return steps.find((s) => s.id === currentStepId) ?? steps[0];
  const firstId = lesson.lessonFlow?.firstStepId;
  return (firstId && steps.find((s) => s.id === firstId)) || steps[0];
}

// ── Prompt controlado (Tarefa 2) ─────────────────────────────────────────────
const PROIBICOES = [
  "NÃO invente diagnóstico, exame ou conduta.",
  "NÃO pule etapas nem antecipe as próximas.",
  "NÃO gere uma aula longa; seja curto e direcionado.",
  "NÃO use nenhum recurso que não esteja listado neste step.",
  "NÃO altere a nota nem recalcule o feedback.",
  "NÃO dê orientação médica real fora do contexto simulado.",
];

/** Monta o prompt (system + user) restrito ao LessonStep atual. Puro. */
export function buildStepPrompt(input: {
  lesson: ProfessorLesson;
  step: LessonStep;
  studentMessage?: string;
  history?: OrchestratorHistoryItem[];
}): { system: string; user: string } {
  const { lesson, step, studentMessage, history } = input;
  const d = lesson.diagnostico;

  const base = lesson.studentBase;
  const system = [
    "Você é o Professor IA do Mini Consultório OSCE — um preceptor clínico para estudantes de medicina.",
    "FONTE DE VERDADE: o Gold Standard e as Truth Layers do caso VENCEM qualquer outra informação. Em conflito, siga o gabarito.",
    "ESCOPO: responda APENAS sobre a etapa (LessonStep) atual fornecida. Não avance, não resuma a aula inteira.",
    `PERSONA: ${d.persona}; modo pedagógico ${d.modoPedagogico}. Ajuste o tom à persona.`,
    "REGRA DE ELOGIO (CRÍTICA): você só pode elogiar ações presentes em StudentTrace/confirmedStrengths. Se não houver evidência, NÃO elogie ações específicas — no máximo reconheça o esforço de forma genérica.",
    "NÃO diga que o aluno auscultou, pediu exame, viu imagem, mediu sinais vitais, prescreveu ou diagnosticou se isso NÃO estiver nas ações comprovadas.",
    "PROIBIÇÕES:",
    ...PROIBICOES.map((p) => `- ${p}`),
    "SAÍDA: um texto curto (1–4 frases), didático, em português, adequado à persona. Ambiente educacional e SIMULADO.",
  ].join("\n");

  const recursos = step.resources.length
    ? step.resources.map((r) => `${r.titulo}${r.href ? ` (${r.href})` : ""}`).join("; ")
    : "(nenhum recurso permitido nesta etapa)";
  const safety = step.safetyRules.length ? step.safetyRules.map((s) => s.regra).join(" | ") : "(sem alertas específicos)";

  const userLinhas = [
    `Caso: ${d.caso} — diagnóstico: ${d.diagnostico}. Prioridade: ${d.prioridadePrincipal}.`,
    d.erroCritico ? `Erro crítico do aluno: ${d.erroCritico}.` : "",
    "",
    "# Rastro real do aluno (StudentTrace) — base do elogio",
    `Ações COMPROVADAS (pode elogiar SÓ estas): ${base?.confirmedStrengths.length ? base.confirmedStrengths.join("; ") : "(nenhuma comprovada — NÃO elogie ação específica)"}`,
    base?.forbiddenPraise.length ? `Elogios PROIBIDOS (sem evidência): ${base.forbiddenPraise.join("; ")}` : "",
    base?.missingRequiredItems.length ? `Itens obrigatórios NÃO realizados: ${base.missingRequiredItems.join("; ")}` : "",
    "",
    `# Etapa atual (execute SÓ esta)`,
    `Tipo: ${step.type} — ${step.title}`,
    `Objetivo da etapa: ${step.goal}`,
    `Instrução: ${step.instructionForLLM}`,
    `Texto de referência (pode reformular, sem inventar): ${step.staticPreviewText}`,
    step.expectedAnswer ? `Resposta esperada (para conferir, não entregue de graça): ${step.expectedAnswer}` : "",
    `Recursos permitidos: ${recursos}`,
    `Regras de segurança: ${safety}`,
    step.expectedStudentAction.requiresInput
      ? `Esta etapa EXIGE resposta do aluno: faça a pergunta e PARE (não explique ainda). Se ele não responder, use: ${step.fallbackIfNoAnswer ?? "ofereça uma dica e reformule."}`
      : "Esta etapa NÃO exige resposta obrigatória do aluno.",
    step.stopCondition ? `Condição de parada: ${step.stopCondition}` : "",
    history?.length ? `\nHistórico curto:\n${history.slice(-4).map((h) => `${h.role === "aluno" ? "Aluno" : "Professor"}: ${h.content}`).join("\n")}` : "",
    studentMessage ? `\nMensagem do aluno agora: "${studentMessage}"` : "",
    "\nGere APENAS a fala do professor para esta etapa.",
  ];

  return { system, user: userLinhas.filter(Boolean).join("\n") };
}

/** Fallback estático (sem modelo): usa o texto de preview do próprio step. */
export function staticFallbackResponse(step: LessonStep): string {
  return step.staticPreviewText || step.goal || "(sem conteúdo para esta etapa)";
}

/**
 * Gera a fala do professor para o LessonStep atual. Controlado pelo LessonFlow.
 * `callModel` opcional: se ausente (ou falhar), devolve o fallback estático.
 * Nunca lança para fora.
 */
export async function generateProfessorStepResponse(input: OrchestratorInput, callModel?: CallModel): Promise<OrchestratorResult> {
  const step = resolveCurrentStep(input.lesson, input.currentStepId);

  if (!step) {
    return {
      ok: false,
      professorMessage: "Este caso ainda não possui um plano de aula estruturado do Professor IA.",
      currentStepId: input.currentStepId ?? "",
      shouldWaitForStudent: false,
      resourcesToShow: [],
      safetyNotes: [],
      source: "fallback",
      debug: { motivo: "sem_lesson_flow" },
    };
  }

  const shouldWaitForStudent = step.expectedStudentAction.requiresInput;
  const resourcesToShow = step.resources;
  const safetyNotes = step.safetyRules.map((s) => s.regra);
  const base = {
    ok: true,
    currentStepId: step.id,
    nextStepId: step.nextStepId,
    shouldWaitForStudent,
    resourcesToShow,
    safetyNotes,
  } as const;

  // Sem modelo → fallback estático.
  if (!callModel) {
    return { ...base, professorMessage: staticFallbackResponse(step), source: "fallback", debug: { motivo: "sem_api_key" } };
  }

  // Com modelo → chamada controlada (try/catch → fallback).
  try {
    const prompt = buildStepPrompt({ lesson: input.lesson, step, studentMessage: input.studentMessage, history: input.history });
    const texto = (await callModel(prompt))?.trim();
    if (!texto) return { ...base, professorMessage: staticFallbackResponse(step), source: "fallback", debug: { motivo: "resposta_vazia" } };

    // Guardrail pós-geração (Fase 22): bloqueia elogio proibido (sem evidência no rastro).
    const guard = validateProfessorMessageAgainstTrace(texto, input.lesson.studentBase?.forbiddenPraise);
    if (!guard.ok) {
      return { ...base, professorMessage: guard.message, source: "fallback", debug: { stepType: step.type, motivo: "guardrail_elogio_proibido", blockedBy: guard.blockedBy } };
    }
    return { ...base, professorMessage: texto, source: "model", debug: { stepType: step.type, promptChars: prompt.system.length + prompt.user.length } };
  } catch (e) {
    return { ...base, professorMessage: staticFallbackResponse(step), source: "fallback", debug: { motivo: "erro_modelo", erro: String(e) } };
  }
}
