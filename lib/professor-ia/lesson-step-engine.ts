// ============================================================================
// Professor IA — LESSON STEP ENGINE (Fase 19)
// ----------------------------------------------------------------------------
// Quebra o ProfessorLesson (roteiro único) numa SEQUÊNCIA de LessonSteps, para
// que o futuro Chat/voz execute UM PASSO POR VEZ (sem interpretar a aula inteira).
// PURO: NÃO chama IA, NÃO cria endpoint/chat/UI/banco, NÃO inventa recurso nem
// conteúdo clínico fora do ProfessorLesson.
// ============================================================================

import type { ProfessorLesson, ProfessorLessonAction } from "./professor-lesson";
import type { TeachingActionType } from "./lesson-planner";

export const LESSON_STEP_SCHEMA_VERSION = "1.0.0" as const;

export type LessonStepType =
  | "opening"
  | "acknowledge_strength"
  | "calibrate_goal"
  | "reinforce_confidence"
  | "identify_error"
  | "correct_critical_error"
  | "ask_question"
  | "wait_student_answer"
  | "explain_concept"
  | "show_resource"
  | "show_sound"
  | "show_image"
  | "show_exam"
  | "compare_model_answer"
  | "mini_quiz"
  | "summarize"
  | "assign_next_step"
  | "closing";

export type LessonStepStatus = "pending" | "active" | "done" | "skipped";

export interface LessonStepInstruction {
  forLLM: string;
  tone?: string;
}

export interface LessonStepResource {
  dominio: string;
  titulo: string;
  href?: string;
  ref?: string;
}

export interface LessonStepExpectedStudentAction {
  requiresInput: boolean;
  descricao: string;
}

export interface LessonStepTransition {
  nextStepId?: string;
  autoAdvance: boolean;
  stopCondition?: string;
}

export interface LessonStepFeedbackRule {
  regra: string;
}

export interface LessonStep {
  id: string;
  order: number;
  type: LessonStepType;
  title: string;
  goal: string;
  instructionForLLM: string;
  staticPreviewText: string;
  expectedStudentAction: LessonStepExpectedStudentAction;
  expectedAnswer?: string;
  resources: LessonStepResource[];
  safetyRules: LessonStepFeedbackRule[];
  transition: LessonStepTransition;
  nextStepId?: string;
  fallbackIfNoAnswer?: string;
  stopCondition?: string;
  isOptional: boolean;
  isCheckpoint: boolean;
  status: LessonStepStatus;
}

export interface LessonStepExecutionPlan {
  schemaVersion: string;
  lessonId: string;
  titulo: string;
  steps: LessonStep[];
  totalSteps: number;
  estimatedDurationMinutes: number;
  requiresStudentInput: boolean;
  interactiveSteps: number;
  resourceSteps: number;
  checkpoints: number;
  canResume: boolean;
  canSkipOptionalSteps: boolean;
  safetyRules: LessonStepFeedbackRule[];
}

// ── LessonFlow (camada de NAVEGAÇÃO entre ProfessorLesson e LessonStep) ──────
// Arquitetura: ProfessorLesson → LessonFlow → LessonStep.
//   ProfessorLesson = roteiro pedagógico completo.
//   LessonFlow      = ordem, regras de navegação, checkpoints e ramificações.
//   LessonStep      = unidade executável individual.
export interface LessonFlowRule {
  regra: string;
}

export type LessonFlowBranchCondition = "on_correct" | "on_incorrect" | "on_no_answer" | "on_request_explanation";

export interface LessonFlowBranch {
  fromStepId: string;
  condition: LessonFlowBranchCondition;
  targetStepId?: string;
  descricao: string;
}

export interface LessonFlowCheckpoint {
  stepId: string;
  tipo: LessonStepType;
  descricao: string;
}

export interface LessonFlow {
  schemaVersion: string;
  flowId: string;
  lessonId: string;
  titulo: string;
  steps: LessonStep[];
  currentStepId?: string;
  firstStepId?: string;
  finalStepId?: string;
  totalSteps: number;
  estimatedDurationMinutes: number;
  requiresStudentInput: boolean;
  interactiveSteps: number;
  resourceSteps: number;
  checkpoints: LessonFlowCheckpoint[];
  navigationRules: LessonFlowRule[];
  branches: LessonFlowBranch[];
  canResume: boolean;
  canPause: boolean;
  canSkipOptionalSteps: boolean;
  requiresSequentialExecution: boolean;
  safetyRules: LessonStepFeedbackRule[];
}

// ── Mapeamento TeachingActionType → LessonStepType (Tarefa 4) ────────────────
const MAP_TIPO: Record<TeachingActionType, LessonStepType> = {
  acknowledge_strength: "acknowledge_strength",
  correct_critical_error: "correct_critical_error",
  ask_socratic_question: "ask_question",
  wait_for_student_answer: "wait_student_answer",
  explain_concept: "explain_concept",
  show_exam_reference: "show_exam",
  show_sound_reference: "show_sound",
  show_image_reference: "show_image",
  mini_quiz: "mini_quiz",
  summarize_session: "summarize",
  assign_next_step: "assign_next_step",
  reinforce_progress: "reinforce_confidence",
  review_recurring_error: "identify_error",
  compare_with_previous_attempts: "compare_model_answer",
  calibrate_session_goal: "calibrate_goal",
  reduce_cognitive_load: "reinforce_confidence",
  show_related_resource: "show_resource",
  // Demais tipos existentes (mantêm compatibilidade):
  identify_error: "identify_error",
  compare_with_model_answer: "compare_model_answer",
  challenge_student: "ask_question",
  timeboxed_review: "summarize",
  close_session_early: "closing",
  reinforce_confidence: "reinforce_confidence",
};

const OPCIONAIS: Set<TeachingActionType> = new Set(["show_related_resource", "challenge_student", "timeboxed_review"]);
const TITULO: Record<LessonStepType, string> = {
  opening: "Abertura", acknowledge_strength: "Reconhecer acerto", calibrate_goal: "Calibrar objetivo",
  reinforce_confidence: "Reforçar confiança", identify_error: "Apontar lacuna", correct_critical_error: "Corrigir erro crítico",
  ask_question: "Pergunta socrática", wait_student_answer: "Esperar resposta", explain_concept: "Explicar conceito",
  show_resource: "Mostrar recurso", show_sound: "Mostrar som", show_image: "Mostrar imagem", show_exam: "Mostrar exame",
  compare_model_answer: "Comparar com gabarito", mini_quiz: "Mini-quiz", summarize: "Revisão final",
  assign_next_step: "Próximo passo", closing: "Encerramento",
};

const FALLBACK_SEM_RESPOSTA = "Se o aluno não responder, ofereça uma dica curta e reformule a pergunta; NÃO entregue a resposta pronta.";

function instrucaoLLM(type: LessonStepType, descricao: string, pergunta?: string): string {
  switch (type) {
    case "opening": return `Abra a sessão de forma acolhedora e breve; situe o objetivo. Base: ${descricao}`;
    case "acknowledge_strength": return `Reconheça, em 1 frase, o acerto do aluno: ${descricao}. Não liste vários; escolha o mais relevante.`;
    case "calibrate_goal": return `Enuncie o objetivo/limite da sessão em 1 frase: ${descricao}`;
    case "reinforce_confidence": return `Reforce a confiança/reduza a carga: ${descricao}. Tom acolhedor, sem reforçar fracasso.`;
    case "identify_error": return `Aponte a lacuna com respeito (sem humilhar): ${descricao}`;
    case "correct_critical_error": return `Corrija o erro crítico e explique o risco, com prioridade: ${descricao}. Só avance após o aluno reconhecer.`;
    case "ask_question": return `Faça a pergunta socrática e PARE para o aluno responder: "${pergunta ?? descricao}"`;
    case "wait_student_answer": return `Aguarde a resposta do aluno. NÃO explique nem avance sozinho até haver resposta.`;
    case "explain_concept": return `Explique o conceito de forma curta e ancorada na base: ${descricao}`;
    case "show_resource":
    case "show_sound":
    case "show_image":
    case "show_exam": return `Aponte o recurso da base (não invente): ${descricao}`;
    case "compare_model_answer": return `Compare a resposta/histórico do aluno com o gabarito: ${descricao}`;
    case "mini_quiz": return `Aplique 1 item objetivo e PARE para a resposta: "${pergunta ?? descricao}"`;
    case "summarize": return `Resuma os pontos-chave da sessão em poucas linhas: ${descricao}`;
    case "assign_next_step": return `Defina o próximo passo de treino: ${descricao}`;
    case "closing": return `Encerre de forma breve, reforçando 1 aprendizado e o próximo passo: ${descricao}`;
  }
}

function planoVazio(lesson: ProfessorLesson): LessonStepExecutionPlan {
  return {
    schemaVersion: LESSON_STEP_SCHEMA_VERSION,
    lessonId: "lesson-sem-plano",
    titulo: lesson.header.titulo,
    steps: [],
    totalSteps: 0,
    estimatedDurationMinutes: 0,
    requiresStudentInput: false,
    interactiveSteps: 0,
    resourceSteps: 0,
    checkpoints: 0,
    canResume: false,
    canSkipOptionalSteps: false,
    safetyRules: [],
  };
}

/**
 * Converte o ProfessorLesson numa sequência executável de LessonSteps.
 * Puro. Sem gabarito/plano → plano vazio (não quebra).
 */
export function buildLessonStepsFromProfessorLesson(lesson: ProfessorLesson): LessonStepExecutionPlan {
  if (lesson.status !== "ok" || lesson.actions.length === 0) return planoVazio(lesson);

  const safetyRules: LessonStepFeedbackRule[] = lesson.regrasSeguranca.map((r) => ({ regra: r.regra }));

  type Bruto = { type: LessonStepType; action?: ProfessorLessonAction; optional: boolean; texto: string; pergunta?: string };
  const brutos: Bruto[] = [];

  // Abertura (rapport) — usa a opening line estática.
  brutos.push({ type: "opening", optional: false, texto: lesson.openingLine.texto || `Vamos revisar juntos: ${lesson.objetivo.objetivoFinal}` });

  // Mapear cada action.
  for (const a of lesson.actions) {
    const type = MAP_TIPO[a.tipo] ?? "explain_concept";
    brutos.push({ type, action: a, optional: OPCIONAIS.has(a.tipo), texto: a.descricao, pergunta: a.pergunta });
  }

  // Encerramento.
  brutos.push({ type: "closing", optional: false, texto: `Próximo passo: ${lesson.proximoPasso.descricao}` });

  const total = brutos.length;
  const steps: LessonStep[] = brutos.map((b, i) => {
    const id = `step-${i + 1}`;
    const nextStepId = i < total - 1 ? `step-${i + 2}` : undefined;
    const requiresInput = b.type === "wait_student_answer" || b.type === "mini_quiz";
    const isCheckpoint = requiresInput || b.type === "correct_critical_error";

    // Recursos reais do ProfessorLesson (nunca inventados).
    const resources: LessonStepResource[] = [];
    if (b.action?.recursoTitulo) {
      resources.push({ dominio: b.type.replace("show_", ""), titulo: b.action.recursoTitulo, ref: b.action.recursoRef });
    }

    // Resposta esperada (mini-quiz).
    let expectedAnswer: string | undefined;
    if (b.type === "mini_quiz") {
      expectedAnswer = lesson.miniQuiz.find((q) => q.pergunta === b.pergunta)?.resposta ?? lesson.miniQuiz[0]?.resposta;
    }

    // Regras de segurança — anexadas em erro crítico.
    const stepSafety = b.type === "correct_critical_error" ? safetyRules : [];

    const stopCondition =
      b.type === "wait_student_answer" ? "Aguardar a resposta do aluno antes de explicar."
      : b.type === "correct_critical_error" ? "Só avançar após o aluno reconhecer a correção."
      : undefined;

    return {
      id,
      order: i + 1,
      type: b.type,
      title: TITULO[b.type],
      goal: b.type === "opening" ? "Situar o aluno e criar rapport" : b.type === "closing" ? "Encerrar e fixar o próximo passo" : b.texto,
      instructionForLLM: instrucaoLLM(b.type, b.texto, b.pergunta),
      staticPreviewText: b.texto,
      expectedStudentAction: {
        requiresInput,
        descricao: requiresInput ? "O aluno deve responder antes de avançar." : "Nenhuma ação obrigatória do aluno.",
      },
      expectedAnswer,
      resources,
      safetyRules: stepSafety,
      transition: { nextStepId, autoAdvance: !requiresInput, stopCondition },
      nextStepId,
      fallbackIfNoAnswer: requiresInput ? FALLBACK_SEM_RESPOSTA : undefined,
      stopCondition,
      isOptional: b.optional,
      isCheckpoint,
      status: "pending",
    };
  });

  return {
    schemaVersion: LESSON_STEP_SCHEMA_VERSION,
    lessonId: `lesson-${(lesson.diagnostico.caso || "caso").toLowerCase().replace(/\s+/g, "-").slice(0, 24)}`,
    titulo: lesson.header.titulo,
    steps,
    totalSteps: steps.length,
    estimatedDurationMinutes: lesson.diagnostico.duracaoEstimadaMin,
    requiresStudentInput: steps.some((s) => s.expectedStudentAction.requiresInput),
    interactiveSteps: steps.filter((s) => s.expectedStudentAction.requiresInput).length,
    resourceSteps: steps.filter((s) => s.resources.length > 0).length,
    checkpoints: steps.filter((s) => s.isCheckpoint).length,
    canResume: true,
    canSkipOptionalSteps: true,
    safetyRules,
  };
}

/**
 * Constrói o LessonFlow (camada de navegação) a partir do ProfessorLesson.
 * Envolve os LessonSteps com regras de navegação, checkpoints e ramificações
 * (branches) preparadas para o futuro Chat/voz — SEM branching dinâmico real.
 */
export function buildLessonFlowFromProfessorLesson(lesson: ProfessorLesson): LessonFlow {
  const plan = buildLessonStepsFromProfessorLesson(lesson);
  const steps = plan.steps;

  const checkpoints: LessonFlowCheckpoint[] = steps
    .filter((s) => s.isCheckpoint)
    .map((s) => ({ stepId: s.id, tipo: s.type, descricao: s.title }));

  // Ramificações estruturais (preparadas, não executadas ainda).
  const primeiraExplicacao = steps.find((s) => s.type === "explain_concept");
  const branches: LessonFlowBranch[] = [];
  for (const s of steps) {
    if (!s.expectedStudentAction.requiresInput) continue;
    const reforco = steps.find((x) => x.order > s.order && (x.type === "explain_concept" || x.type === "identify_error"));
    branches.push({ fromStepId: s.id, condition: "on_correct", targetStepId: s.nextStepId, descricao: "Se o aluno acertar → próximo step." });
    branches.push({ fromStepId: s.id, condition: "on_incorrect", targetStepId: reforco?.id ?? s.nextStepId, descricao: "Se o aluno errar → step de reforço/explicação." });
    branches.push({ fromStepId: s.id, condition: "on_no_answer", targetStepId: s.id, descricao: "Se não responder → usar fallbackIfNoAnswer e repetir o step." });
    if (primeiraExplicacao) branches.push({ fromStepId: s.id, condition: "on_request_explanation", targetStepId: primeiraExplicacao.id, descricao: "Se pedir explicação → aprofundamento." });
  }

  const navigationRules: LessonFlowRule[] = [
    { regra: "Execução sequencial por padrão (requiresSequentialExecution)." },
    { regra: "Parar em steps que exigem resposta; não avançar sozinho após wait_student_answer." },
    { regra: "Não pular checkpoints; passos opcionais (isOptional) podem ser pulados." },
    { regra: "Sem resposta do aluno → usar fallbackIfNoAnswer do step; não entregar a resposta pronta." },
    { regra: "Usar apenas os recursos anexados ao step; não inventar recurso nem conteúdo clínico." },
  ];

  return {
    schemaVersion: LESSON_STEP_SCHEMA_VERSION,
    flowId: `flow-${plan.lessonId.replace(/^lesson-/, "")}`,
    lessonId: plan.lessonId,
    titulo: plan.titulo,
    steps,
    currentStepId: steps[0]?.id,
    firstStepId: steps[0]?.id,
    finalStepId: steps[steps.length - 1]?.id,
    totalSteps: plan.totalSteps,
    estimatedDurationMinutes: plan.estimatedDurationMinutes,
    requiresStudentInput: plan.requiresStudentInput,
    interactiveSteps: plan.interactiveSteps,
    resourceSteps: plan.resourceSteps,
    checkpoints,
    navigationRules,
    branches,
    canResume: true,
    canPause: true,
    canSkipOptionalSteps: true,
    requiresSequentialExecution: true,
    safetyRules: plan.safetyRules,
  };
}
