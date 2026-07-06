// ============================================================================
// Professor IA — PROFESSOR LESSON (Fase 18)
// ----------------------------------------------------------------------------
// Roteiro ÚNICO e reutilizável, resultado final do pipeline pedagógico. Serve
// AO MESMO objeto o Preview (hoje) e o futuro Chat/voz/aula guiada/plano de
// estudo. PURO: NÃO chama IA, NÃO cria endpoint/chat/UI/banco. Apenas normaliza
// o que os builders já produziram numa estrutura estável para renderização.
// ============================================================================

import type { ProfessorIAContext, StudyPlan, ConversationModel } from "./interfaces";
import type { TeachingDecision } from "./teaching-engine";
import type { ProfessorPersonaDecision } from "./persona-engine";
import type { LessonPlannerOutput, TeachingActionType } from "./lesson-planner";
import type { GoldStandardCase } from "../../clinical-engine/gold-standard/types";
import type { StudentModel } from "./student-model";
import type { LearningSession } from "./learning-session";
import { buildLessonStepsFromProfessorLesson, buildLessonFlowFromProfessorLesson, type LessonStepExecutionPlan, type LessonFlow } from "./lesson-step-engine";
import { NEUTRAL_OPENING } from "./student-trace";

export const PROFESSOR_LESSON_SCHEMA_VERSION = "1.0.0" as const;

export type ProfessorLessonStatus = "ok" | "sem_gabarito" | "sem_plano";

// Rótulos legíveis (PT) para cada Teaching Action.
const ACTION_LABEL: Record<TeachingActionType, string> = {
  acknowledge_strength: "Reconhecer acerto",
  identify_error: "Apontar lacuna",
  ask_socratic_question: "Pergunta socrática",
  wait_for_student_answer: "Esperar resposta",
  explain_concept: "Explicar conceito",
  show_related_resource: "Mostrar recurso",
  show_sound_reference: "Mostrar som",
  show_image_reference: "Mostrar imagem",
  show_exam_reference: "Mostrar exame",
  compare_with_model_answer: "Comparar com gabarito",
  correct_critical_error: "Corrigir erro crítico",
  mini_quiz: "Mini-quiz",
  summarize_session: "Revisão final",
  assign_next_step: "Próximo passo",
  compare_with_previous_attempts: "Comparar com histórico",
  review_recurring_error: "Revisar erro recorrente",
  reinforce_progress: "Reforçar evolução",
  calibrate_session_goal: "Calibrar objetivo da sessão",
  reduce_cognitive_load: "Reduzir carga cognitiva",
  reinforce_confidence: "Reforçar confiança",
  timeboxed_review: "Revisão cronometrada",
  challenge_student: "Desafio adicional",
  close_session_early: "Encerrar cedo",
};

// ── Tipos do roteiro ─────────────────────────────────────────────────────────
export interface ProfessorLessonHeader {
  titulo: string;
  subtitulo: string;
  aviso: string;
}

export interface ProfessorLessonDiagnosis {
  caso: string;
  diagnostico: string;
  nota?: number;
  prioridadePrincipal: string;
  erroCritico?: string;
  persona: string;
  modoPedagogico: string;
  duracaoEstimadaMin: number;
  modoSessao?: string;
}

export interface ProfessorLessonObjective {
  objetivoFinal: string;
  objetivos: string[];
}

export interface ProfessorLessonAction {
  ordem: number;
  tipo: TeachingActionType;
  rotulo: string;
  descricao: string;
  pergunta?: string;
  recursoTitulo?: string;
  recursoRef?: string;
  checkpoint?: boolean;
}

export interface ProfessorLessonResource {
  dominio: "som" | "imagem" | "exame" | "fluxo" | "centro_clinico";
  titulo: string;
  href?: string;
  ref?: string;
}

export interface ProfessorLessonPromptPlan {
  ordem: string[];
  prompts: string[];
  totalChars: number;
}

export interface ProfessorLessonOpeningLine {
  texto: string;
  origem: "estatico_do_plano";
}

export interface ProfessorLessonMiniQuiz {
  pergunta: string;
  resposta?: string;
}

export interface ProfessorLessonExpectedAnswer {
  respostaModelo?: string;
  checklistNotaMaxima: string[];
}

export interface ProfessorLessonSafetyRule {
  regra: string;
}

export interface ProfessorLessonNextStep {
  descricao: string;
}

export interface ProfessorLesson {
  schemaVersion: string;
  status: ProfessorLessonStatus;
  motivo?: string;
  header: ProfessorLessonHeader;
  diagnostico: ProfessorLessonDiagnosis;
  objetivo: ProfessorLessonObjective;
  openingLine: ProfessorLessonOpeningLine;
  actions: ProfessorLessonAction[];
  recursos: ProfessorLessonResource[];
  perguntasSocraticas: string[];
  miniQuiz: ProfessorLessonMiniQuiz[];
  respostasEsperadas: ProfessorLessonExpectedAnswer;
  pegadinhas: string[];
  regrasSeguranca: ProfessorLessonSafetyRule[];
  promptPlan: ProfessorLessonPromptPlan;
  proximoPasso: ProfessorLessonNextStep;
  // Fase 19 (opcionais): execução granular. Arquitetura ProfessorLesson → LessonFlow → LessonStep.
  lessonSteps?: LessonStepExecutionPlan;
  lessonFlow?: LessonFlow;
  // Fase 22: base do rastro real do aluno (fonte única de elogio + guardrail).
  studentBase?: ProfessorLessonStudentBase;
}

export interface ProfessorLessonStudentBase {
  temEvidencia: boolean;
  confidence: "alta" | "media" | "baixa";
  /** Elogios PERMITIDOS (ações comprovadas no StudentTrace). */
  confirmedStrengths: string[];
  /** Elogios PROIBIDOS (sem evidência real) — usados pelo guardrail. */
  forbiddenPraise: string[];
  /** Itens obrigatórios do gabarito não comprovados no rastro. */
  missingRequiredItems: string[];
  omissions: string[];
}

// ── Entrada do builder ───────────────────────────────────────────────────────
export interface BuildProfessorLessonInput {
  context: ProfessorIAContext;
  studyPlan?: StudyPlan;
  teaching?: TeachingDecision;
  persona?: ProfessorPersonaDecision;
  lessonPlan?: LessonPlannerOutput;
  conversation?: ConversationModel;
  goldStandard?: GoldStandardCase;
  studentModel?: StudentModel;
  learningSession?: LearningSession;
  notaExibida?: number;
  header?: Partial<ProfessorLessonHeader>;
}

const HEADER_PADRAO: ProfessorLessonHeader = {
  titulo: "Professor IA",
  subtitulo: "Sessão de tutoria personalizada baseada no seu desempenho",
  aviso: "Prévia estrutural — o chat generativo será ativado em fase futura.",
};

function limparPrefixo(txt: string | undefined, prefixo: RegExp): string {
  return (txt ?? "").replace(prefixo, "").trim();
}

function lessonVazia(status: ProfessorLessonStatus, motivo: string, header: ProfessorLessonHeader, caso: string): ProfessorLesson {
  return {
    schemaVersion: PROFESSOR_LESSON_SCHEMA_VERSION,
    status,
    motivo,
    header,
    diagnostico: { caso, diagnostico: "—", prioridadePrincipal: "—", persona: "—", modoPedagogico: "—", duracaoEstimadaMin: 0 },
    objetivo: { objetivoFinal: "", objetivos: [] },
    openingLine: { texto: "", origem: "estatico_do_plano" },
    actions: [],
    recursos: [],
    perguntasSocraticas: [],
    miniQuiz: [],
    respostasEsperadas: { checklistNotaMaxima: [] },
    pegadinhas: [],
    regrasSeguranca: [],
    promptPlan: { ordem: [], prompts: [], totalChars: 0 },
    proximoPasso: { descricao: "" },
  };
}

/**
 * Monta o roteiro único (ProfessorLesson) a partir da saída do pipeline.
 * Puro. Fallback elegante quando faltam gabarito ou plano.
 */
export function buildProfessorLesson(input: BuildProfessorLessonInput): ProfessorLesson {
  const header: ProfessorLessonHeader = { ...HEADER_PADRAO, ...input.header };
  const casoTitulo = input.goldStandard?.geradoDe.titulo ?? input.context.caso?.titulo ?? "—";

  if (!input.goldStandard) {
    return lessonVazia("sem_gabarito", "Professor IA ainda não possui gabarito estruturado para este caso.", header, casoTitulo);
  }
  if (!input.teaching || !input.persona || !input.lessonPlan) {
    return lessonVazia("sem_plano", "Não foi possível montar o plano da aula para este caso.", header, casoTitulo);
  }

  const { context, teaching, persona, lessonPlan, conversation, goldStandard, learningSession } = input;
  const tl = goldStandard.truthLayers;
  const erroCritico = context.avaliacao?.errosCriticos?.[0];

  // Opening line — Fase 22: ELOGIO só a partir de forças COMPROVADAS (StudentTrace).
  // Sem evidência → abertura NEUTRA (nunca elogiar ação que o aluno não fez).
  const forcasConfirmadas = (context.studentTraceSummary?.confirmedStrengths ?? []).map((s) => s.texto);
  const corrige = limparPrefixo(lessonPlan.actions.find((a) => a.tipo === "correct_critical_error")?.descricao, /^Corrigir o erro crítico e explicar o risco:\s*/i);
  let openingTexto: string;
  if (forcasConfirmadas.length > 0) {
    openingTexto = corrige
      ? `Você foi bem em: ${forcasConfirmadas[0]}. Agora vamos corrigir um ponto crítico: ${corrige.toLowerCase()}.`
      : `Você foi bem em: ${forcasConfirmadas[0]}. Vamos consolidar o raciocínio e refinar a conduta.`;
  } else {
    openingTexto = NEUTRAL_OPENING;
  }

  // Recursos normalizados.
  const recursos: ProfessorLessonResource[] = [];
  (tl?.resource.sons ?? []).forEach((r) => recursos.push({ dominio: "som", titulo: r, ref: r }));
  (tl?.resource.imagens ?? []).forEach((r) => recursos.push({ dominio: "imagem", titulo: r, ref: r }));
  (tl?.resource.exames ?? []).forEach((r) => recursos.push({ dominio: "exame", titulo: r, ref: r }));
  (tl?.resource.fluxos ?? []).forEach((r) => recursos.push({ dominio: "fluxo", titulo: r, ref: r }));
  (tl?.resource.centroClinico ?? []).forEach((l) => recursos.push({ dominio: "centro_clinico", titulo: l.titulo, href: l.href }));

  // Mini-quiz e respostas esperadas.
  const miniQuiz: ProfessorLessonMiniQuiz[] = (tl?.teaching.miniQuiz ?? []).map((q) => ({ pergunta: q.pergunta, resposta: q.resposta }));
  const respostasEsperadas: ProfessorLessonExpectedAnswer = {
    respostaModelo: context.material?.respostaModelo ?? goldStandard.feedbackModelo.respostaModelo,
    checklistNotaMaxima: goldStandard.feedbackModelo.checklistNotaMaxima ?? [],
  };

  // Regras de segurança (não generativas).
  const regrasSeguranca: ProfessorLessonSafetyRule[] = [
    { regra: "Ambiente educacional e simulado — sem prescrição para uso real." },
    { regra: "Priorizar segurança do paciente, sinais de gravidade e red flags." },
  ];
  if (teaching.alertaSeguranca) regrasSeguranca.unshift({ regra: teaching.alertaSeguranca });

  // Prompt plan (metadado do que o futuro Chat enviaria — não é enviado a nada).
  const promptPlan: ProfessorLessonPromptPlan = {
    ordem: (conversation?.ordemComposicao ?? []).map(String),
    prompts: conversation ? Object.keys(conversation.prompts) : [],
    totalChars: conversation ? Object.values(conversation.prompts).join("").length : 0,
  };

  const proximo =
    limparPrefixo(lessonPlan.actions.find((a) => a.tipo === "assign_next_step")?.descricao, /^Definir o próximo passo de treino:\s*/i) ||
    teaching.prioridadesSecundarias[0]?.titulo ||
    "revisar o tema no Centro Clínico";

  const lesson: ProfessorLesson = {
    schemaVersion: PROFESSOR_LESSON_SCHEMA_VERSION,
    status: "ok",
    header,
    diagnostico: {
      caso: casoTitulo,
      diagnostico: goldStandard.diagnostico.principal,
      nota: input.notaExibida ?? context.avaliacao?.nota,
      prioridadePrincipal: teaching.prioridadePrincipal.titulo,
      erroCritico,
      persona: persona.persona.nome,
      modoPedagogico: teaching.modoPedagogico,
      duracaoEstimadaMin: persona.sessionConfig.estimatedDurationMinutes,
      modoSessao: learningSession?.modo,
    },
    objetivo: {
      objetivoFinal: lessonPlan.objetivoFinal,
      objetivos: teaching.objetivos.map((o) => o.texto),
    },
    openingLine: { texto: openingTexto, origem: "estatico_do_plano" },
    actions: lessonPlan.actions.map((a, i) => ({
      ordem: i + 1,
      tipo: a.tipo,
      rotulo: ACTION_LABEL[a.tipo] ?? a.tipo,
      descricao: a.descricao,
      pergunta: a.pergunta,
      recursoTitulo: a.recursoTitulo,
      recursoRef: a.recursoRef,
      checkpoint: a.checkpoint,
    })),
    recursos,
    perguntasSocraticas: teaching.perguntasSocraticas,
    miniQuiz,
    respostasEsperadas,
    pegadinhas: tl?.educational.pegadinhas ?? goldStandard.feedbackModelo.pegadinhas ?? [],
    regrasSeguranca,
    promptPlan,
    proximoPasso: { descricao: proximo },
  };

  // Fase 22: base do rastro real (elogios permitidos/proibidos + omissões).
  const sts = context.studentTraceSummary;
  const tv = context.traceValidation;
  lesson.studentBase = {
    temEvidencia: sts?.temEvidencia ?? false,
    confidence: sts?.confidence ?? "baixa",
    confirmedStrengths: forcasConfirmadas,
    forbiddenPraise: tv?.forbiddenPraise ?? [],
    missingRequiredItems: tv?.missingRequiredItems ?? [],
    omissions: (sts?.omissoes ?? []).map((o) => o.descricao),
  };

  // Fase 19: execução granular — ProfessorLesson → LessonFlow → LessonStep.
  lesson.lessonSteps = buildLessonStepsFromProfessorLesson(lesson);
  lesson.lessonFlow = buildLessonFlowFromProfessorLesson(lesson);
  return lesson;
}
