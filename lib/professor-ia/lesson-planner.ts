// ============================================================================
// Professor IA — LESSON PLANNER + TEACHING ACTIONS (Fase 11)
// ----------------------------------------------------------------------------
// Camada entre Persona Engine e Conversation Builder. Decide a ORDEM da sessão
// e transforma a estratégia em PASSOS EXECUTÁVEIS (Teaching Actions), respeitando
// os limites da sessão (maxQuestions/maxConcepts/stop/quiz/review). Pura; sem IA.
// ============================================================================

import type { ProfessorIAContext, StudyPlan, KnowledgeMap, KnowledgeResource } from "./interfaces";
import type { TeachingDecision } from "./teaching-engine";
import type { ProfessorPersonaDecision } from "./persona-engine";
import type { CanonicalCase } from "../../clinical-engine/types/canonical-case";
import type { GoldStandardCase } from "../../clinical-engine/gold-standard/types";

export type TeachingActionType =
  | "acknowledge_strength"
  | "identify_error"
  | "ask_socratic_question"
  | "wait_for_student_answer"
  | "explain_concept"
  | "show_related_resource"
  | "show_sound_reference"
  | "show_image_reference"
  | "show_exam_reference"
  | "compare_with_model_answer"
  | "correct_critical_error"
  | "mini_quiz"
  | "summarize_session"
  | "assign_next_step"
  // Fase 15 — ações longitudinais (Student Model):
  | "compare_with_previous_attempts"
  | "review_recurring_error"
  | "reinforce_progress"
  // Fase 16 — ações de sessão (Learning Session):
  | "calibrate_session_goal"
  | "reduce_cognitive_load"
  | "reinforce_confidence"
  | "timeboxed_review"
  | "challenge_student"
  | "close_session_early";

export type LessonPhase = "abertura" | "correcao_critica" | "desenvolvimento" | "pratica" | "fechamento";

export interface TeachingAction {
  tipo: TeachingActionType;
  descricao: string;
  pergunta?: string;
  recursoRef?: string; // href/id do recurso, quando aplicável
  recursoTitulo?: string;
  checkpoint?: boolean; // ponto de verificação (espera resposta / quiz / correção crítica)
}

export interface LessonStep {
  ordem: number;
  fase: LessonPhase;
  action: TeachingAction;
}

export interface LessonPlan {
  titulo: string;
  objetivoFinal: string;
  steps: LessonStep[];
  duracaoEstimadaMin: number;
  conceitosIncluidos: string[];
  perguntasIncluidas: string[];
  recursosUsados: Array<{ titulo: string; href?: string }>;
  checkpoints: string[];
}

export interface LessonPlannerInput {
  context: ProfessorIAContext;
  teaching: TeachingDecision;
  persona: ProfessorPersonaDecision;
  studyPlan: StudyPlan;
  knowledge: KnowledgeMap;
  caso: CanonicalCase;
  /** Gold Standard do caso (Fase 14) — Resource/Teaching/Evaluation Truth para actions específicas. */
  goldStandard?: GoldStandardCase;
}

export interface LessonPlannerOutput {
  lessonPlan: LessonPlan;
  actions: TeachingAction[];
  duracaoEstimadaMin: number;
  conceitosIncluidos: string[];
  perguntasIncluidas: string[];
  recursosUsados: Array<{ titulo: string; href?: string }>;
  checkpoints: string[];
  objetivoFinal: string;
}

function toRec(r: KnowledgeResource | undefined): { titulo: string; href?: string } | undefined {
  return r ? { titulo: r.titulo, href: r.href } : undefined;
}

/**
 * Monta o plano de aula (ordem + ações executáveis). Puro, determinístico.
 */
export function buildLessonPlan(input: LessonPlannerInput): LessonPlannerOutput {
  const { context, teaching, persona, knowledge, caso } = input;
  const sc = persona.sessionConfig;
  const truth = input.goldStandard?.truthLayers;
  const sm = context.studentModel; // Fase 15: perfil longitudinal (opcional)
  const ls = context.learningSession; // Fase 16: estado da sessão (opcional)
  const temErroCritico = !!teaching.alertaSeguranca || teaching.modoPedagogico === "reforco_de_erro_critico";
  // O ALVO da correção é o erro real do aluno (HealthBench). As Truth Layers
  // informam COMO ensinar (perguntas, mini-quiz) e QUAIS recursos usar.
  const errosCriticos = context.avaliacao?.errosCriticos ?? [];
  const perguntasFonte = truth?.teaching.perguntasSocraticas?.length
    ? truth.teaching.perguntasSocraticas
    : caso.professorIA.perguntasSocraticas;

  const steps: LessonStep[] = [];
  const conceitosIncluidos: string[] = [];
  const perguntasIncluidas: string[] = [];
  const recursosUsados: Array<{ titulo: string; href?: string }> = [];
  const checkpoints: string[] = [];

  let questionsUsed = 0;
  let conceptsUsed = 0;
  let ordem = 0;

  const push = (fase: LessonPhase, action: TeachingAction) => {
    steps.push({ ordem: ++ordem, fase, action });
    if (action.checkpoint) checkpoints.push(action.descricao);
    if (action.recursoTitulo) recursosUsados.push({ titulo: action.recursoTitulo, href: action.recursoRef });
  };
  const addQuestion = (fase: LessonPhase, pergunta: string): boolean => {
    if (questionsUsed >= sc.maxQuestions) return false;
    push(fase, { tipo: "ask_socratic_question", descricao: `Pergunta socrática: ${pergunta}`, pergunta });
    push(fase, { tipo: "wait_for_student_answer", descricao: "Aguardar a resposta do aluno antes de explicar.", checkpoint: true });
    perguntasIncluidas.push(pergunta);
    questionsUsed++;
    return true;
  };
  const addConcept = (fase: LessonPhase, titulo: string, desc: string): boolean => {
    if (conceptsUsed >= sc.maxConcepts) return false;
    push(fase, { tipo: "explain_concept", descricao: `Explicar: ${desc}` });
    conceitosIncluidos.push(titulo);
    conceptsUsed++;
    return true;
  };
  const jaUsado = (rec: { titulo: string; href?: string }) =>
    recursosUsados.some((x) => (x.href || x.titulo) === (rec.href || rec.titulo));
  const addResourceOnce = (fase: LessonPhase, tipo: TeachingActionType, r: KnowledgeResource | undefined, rotulo: string) => {
    const rec = toRec(r);
    if (!rec || jaUsado(rec)) return;
    push(fase, { tipo, descricao: `${rotulo}: ${rec.titulo}`, recursoRef: rec.href, recursoTitulo: rec.titulo });
  };

  // ── 0. Calibrar o objetivo da sessão (Fase 16) ──
  if (ls) {
    push("abertura", { tipo: "calibrate_session_goal", descricao: `Calibrar o objetivo da sessão: ${ls.objetivo.descricao} (modo ${ls.modo}, ${ls.timeBox.tempoDisponivelMin} min).` });
  }

  // ── 1. Abertura: reconhecer 1 acerto COMPROVADO (Fase 22) ──
  // ELOGIO = somente StudentTrace. Sem força confirmada → nenhum elogio específico
  // (a abertura neutra fica a cargo do opening step / openingLine).
  const forcasConfirmadas = context.studentTraceSummary?.confirmedStrengths ?? [];
  if (forcasConfirmadas.length > 0) {
    push("abertura", { tipo: "acknowledge_strength", descricao: `Reconhecer o acerto comprovado: ${forcasConfirmadas[0].texto}` });
  }
  // Omissões obrigatórias (do rastro vs. gabarito) viram lacunas explícitas.
  for (const faltou of (context.traceValidation?.missingRequiredItems ?? []).slice(0, 2)) {
    push("abertura", { tipo: "identify_error", descricao: `Apontar omissão comprovada: ${faltou} não realizado(a) neste atendimento.` });
  }

  // ── 1a. Ajustes de sessão (Fase 16): reforço de confiança e carga cognitiva ──
  if (ls?.contexto.ehPosReprovacao) {
    push("abertura", { tipo: "reinforce_confidence", descricao: "Reforçar a confiança: retomar 1 acerto e enquadrar o erro como aprendizado (não reforçar o fracasso)." });
  }
  if (ls?.constraints.reduzirCargaCognitiva) {
    push("abertura", { tipo: "reduce_cognitive_load", descricao: "Reduzir a carga cognitiva: 1 ponto por vez, linguagem simples, sem sobrecarregar." });
  }

  // ── 1b. Reforço positivo se há evolução no histórico (Fase 15) ──
  if (sm && sm.curvaEvolucao.tendencia.direcao === "melhorando") {
    push("abertura", { tipo: "reinforce_progress", descricao: `Reforçar a evolução: ${sm.curvaEvolucao.tendencia.descricao}` });
  }

  // ── 1c. Revisão de erro recorrente (Fase 15) ──
  const erroRecorrente = sm?.errosRecorrentes.find((e) => e.persistente);
  if (sm && erroRecorrente && (teaching.erroAtualEhRepeticao ?? true)) {
    push("correcao_critica", {
      tipo: "review_recurring_error",
      descricao: `Revisar erro RECORRENTE (${erroRecorrente.ocorrencias}x): ${erroRecorrente.descricao} — não é a primeira vez.`,
      checkpoint: true,
    });
  }

  // ── 2. Correção crítica (SEMPRE antes de qualquer aula longa) ──
  if (temErroCritico && errosCriticos.length > 0) {
    const erro = errosCriticos[0];
    push("correcao_critica", { tipo: "correct_critical_error", descricao: `Corrigir o erro crítico e explicar o risco: ${erro}`, checkpoint: true });
    if (sc.requireStudentAnswerBeforeExplanation) {
      const perg = perguntasFonte.find((q) => /dose|antibi|antimicrob/i.test(q)) || `Como corrigir: ${erro}?`;
      addQuestion("correcao_critica", perg);
    }
    addConcept("correcao_critica", "Segurança / erro crítico", `a importância de ${erro.toLowerCase()} e o risco à segurança do paciente`);
    addResourceOnce("correcao_critica", "show_exam_reference", knowledge.exames[0], "Exame de referência");
    addResourceOnce("correcao_critica", "show_sound_reference", knowledge.sons[0], "Som de referência");
  }

  // ── 3. Desenvolvimento (respeitando stopAfterCriticalCorrection) ──
  const podeDesenvolver = !(sc.stopAfterCriticalCorrection && temErroCritico);
  if (podeDesenvolver) {
    const prioridades = [teaching.prioridadePrincipal, ...teaching.prioridadesSecundarias]
      .filter((p) => p.eixo !== "erro_critico")
      .slice(0, 3);
    for (const p of prioridades) {
      if (conceptsUsed >= sc.maxConcepts) break;
      push("desenvolvimento", { tipo: "identify_error", descricao: `Apontar a lacuna: ${p.titulo} — ${p.motivo}` });
      if (sc.requireStudentAnswerBeforeExplanation) {
        const q = perguntasFonte[perguntasIncluidas.length] || `Sobre ${p.titulo.toLowerCase()}, o que faltou?`;
        addQuestion("desenvolvimento", q);
      }
      addConcept("desenvolvimento", p.titulo, `${p.titulo} — ${p.motivo}`);
      const rec = p.recursos[0];
      if (rec && !jaUsado(rec)) {
        push("desenvolvimento", { tipo: "show_related_resource", descricao: `Recurso relacionado: ${rec.titulo}`, recursoRef: rec.href, recursoTitulo: rec.titulo });
      }
    }
    // Referências específicas se existirem no contexto e ainda não usadas.
    addResourceOnce("desenvolvimento", "show_image_reference", knowledge.imagens[0], "Imagem de referência");
    if (!temErroCritico) addResourceOnce("desenvolvimento", "show_sound_reference", knowledge.sons[0], "Som de referência");
    // Comparação com o gabarito (só no desenvolvimento; pulada em stop após crítico).
    if (context.material?.respostaModelo) {
      const criterios = truth?.evaluation.criteriosObrigatorios?.length
        ? ` Conferir contra o checklist nota máxima (${truth.evaluation.criteriosObrigatorios.length} critérios obrigatórios).`
        : "";
      push("pratica", { tipo: "compare_with_model_answer", descricao: `Comparar a resposta do aluno com a resposta modelo do caso.${criterios}` });
    }
  }

  // ── 4. Prática ──
  // Revisão cronometrada em treino pré-prova (Fase 16).
  if (ls?.modo === "treino_pre_prova") {
    push("pratica", { tipo: "timeboxed_review", descricao: `Revisão cronometrada do checklist (${ls.timeBox.tempoDisponivelMin} min).`, checkpoint: true });
  }
  if (sc.generateMiniQuiz) {
    // Truth Layers fornecem a pergunta objetiva do mini-quiz (Teaching Truth).
    const quiz = truth?.teaching.miniQuiz?.[0];
    const descQuiz = quiz ? `Mini-quiz (Teaching Truth): ${quiz.pergunta}` : "Mini-quiz de verificação (1 item objetivo).";
    push("pratica", { tipo: "mini_quiz", descricao: descQuiz, pergunta: quiz?.pergunta, checkpoint: true });
  }
  // Desafio adicional quando a sessão indica confiança alta / aprofundar (Fase 16).
  if (ls && (ls.constraints.aprofundar || (ls.confiancaAtual >= 0.75 && !ls.constraints.reduzirCargaCognitiva))) {
    push("pratica", { tipo: "challenge_student", descricao: "Propor um desafio adicional (variação do caso) para estender o raciocínio." });
  }

  // ── 5. Fechamento ──
  if (sc.reviewAtEnd) {
    push("fechamento", { tipo: "summarize_session", descricao: "Resumir os pontos-chave da sessão." });
  }
  // Comparação longitudinal com tentativas anteriores (Fase 15).
  if (sm && sm.casosRealizados.length > 0) {
    push("fechamento", {
      tipo: "compare_with_previous_attempts",
      descricao: `Comparar com o histórico (${sm.casosRealizados.length} caso(s); nota média ${sm.curvaEvolucao.notaMedia}/20, ${sm.curvaEvolucao.tendencia.direcao}).`,
    });
  }
  const proximo = teaching.prioridadesSecundarias[0]?.titulo || context.avaliacao?.focosDeTreino?.[0] || "revisar o tema no Centro Clínico";
  push("fechamento", { tipo: "assign_next_step", descricao: `Definir o próximo passo de treino: ${proximo}` });
  // Encerrar cedo se a sessão indicar (tempo curto + saturação) — Fase 16.
  if (ls?.constraints.encerrarCedo) {
    push("fechamento", { tipo: "close_session_early", descricao: "Encerrar a sessão cedo: consolidar 1 aprendizado e evitar sobrecarga." });
  }

  const objetivoFinal = temErroCritico
    ? `Corrigir com segurança: ${errosCriticos[0] ?? "o erro crítico"} e consolidar a conduta correta.`
    : `Elevar o desempenho em ${teaching.prioridadePrincipal.titulo.toLowerCase()} com raciocínio ancorado na base.`;

  const actions = steps.map((s) => s.action);
  const lessonPlan: LessonPlan = {
    titulo: `Plano de aula — ${caso.identificacao.titulo}`,
    objetivoFinal,
    steps,
    duracaoEstimadaMin: sc.estimatedDurationMinutes,
    conceitosIncluidos,
    perguntasIncluidas,
    recursosUsados,
    checkpoints,
  };

  return {
    lessonPlan,
    actions,
    duracaoEstimadaMin: sc.estimatedDurationMinutes,
    conceitosIncluidos,
    perguntasIncluidas,
    recursosUsados,
    checkpoints,
    objetivoFinal,
  };
}
