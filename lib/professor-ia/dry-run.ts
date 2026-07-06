// ============================================================================
// Professor IA — DRY RUN (Fase 8)
// ----------------------------------------------------------------------------
// Prova estrutural (SEM IA): monta o pacote de contexto completo do Professor IA
// a partir do Caso Canônico PAC + Knowledge Graph + um resultado HealthBench
// MOCK, usando os builders reais (context/knowledge/study-plan/conversation).
// NÃO chama OpenAI, NÃO cria endpoint, NÃO cria UI. Só assembla dados.
//
// Observação de execução: os imports de VALOR são relativos (para rodar via
// Node type-stripping no script .mjs). Os imports `type ... from "@/..."` são
// apagados em runtime (type-only).
// ============================================================================

import type { HealthBenchEvaluationResult, HealthBenchCriterionGrade } from "@/lib/healthbench/types";
import type { ProfessorIAContext, StudyPlan, ConversationModel } from "./interfaces";

import { CANONICAL_PAC } from "../../clinical-engine/cases/pac";
import { toLegacyOSCECase } from "../../clinical-engine/helpers/canonical-case-adapter";
import { KNOWLEDGE_BY_ID } from "../../clinical-engine/knowledge/registry";

import { buildProfessorContext } from "./context-builder";
import { buildStudyPlan } from "./study-plan-builder";
import { buildConversationModel } from "./conversation-builder";
import { buildTeachingStrategy, type TeachingDecision } from "./teaching-engine";
import { buildProfessorPersona, type ProfessorPersonaDecision } from "./persona-engine";
import { buildLessonPlan, type LessonPlannerOutput } from "./lesson-planner";
import { PAC_GOLD_STANDARD } from "../../clinical-engine/gold-standard/pac-gold-standard";
import { getTruthLayerSummary } from "../../clinical-engine/gold-standard/gold-standard-engine";
import type { GoldStandardCase } from "../../clinical-engine/gold-standard/types";
import { buildStudentModel, summarizeStudentModel, type StudentModel, type StudentModelSummary } from "./student-model";
import { buildLearningSession, summarizeLearningSession, type LearningSession, type LearningSessionSummary } from "./learning-session";
import { buildProfessorLesson, type ProfessorLesson } from "./professor-lesson";

// ── 1. Mock realista de HealthBench para o PAC ──────────────────────────────
function grade(
  id: string,
  criterion: string,
  met: boolean,
  points: number,
  axis: string,
  opts: { critical?: boolean; type?: "positive" | "negative" } = {}
): HealthBenchCriterionGrade {
  const type = opts.type ?? "positive";
  return {
    rubricItemId: id,
    criterion,
    criteria_met: met,
    explanation: met ? "Cumprido no atendimento." : "Não evidenciado no transcript.",
    points,
    points_awarded: met ? (type === "negative" ? points : points) : 0,
    tags: [axis],
    critical: opts.critical,
    type,
  };
}

export function mockHealthBenchPAC(): HealthBenchEvaluationResult {
  const grades: HealthBenchCriterionGrade[] = [
    grade("g1", "Caracterizou a tosse (seca vs produtiva)", true, 1, "axis:anamnese"),
    grade("g2", "Investigou antecedentes, medicamentos e alergias", false, 1, "axis:anamnese"),
    grade("g3", "Pesquisou sinais de gravidade e impacto funcional", false, 1, "axis:anamnese"),
    grade("g4", "Mediu sinais vitais completos, incluindo SpO₂", true, 1, "axis:exame_fisico"),
    grade("g5", "Auscultou o tórax e identificou crepitações", true, 1, "axis:exame_fisico"),
    grade("g6", "Solicitou radiografia de tórax", true, 1, "axis:exames_complementares"),
    grade("g7", "Solicitou hemograma", true, 1, "axis:exames_complementares"),
    grade("g8", "Formulou hipótese de PAC coerente com os achados", true, 2, "axis:raciocinio_clinico"),
    grade("g9", "Considerou diagnósticos diferenciais", true, 1, "axis:raciocinio_clinico"),
    grade("g10", "Prescreveu antibiótico apropriado COM dose", false, 2, "axis:conduta_seguranca", { critical: true }),
    grade("g11", "Orientou sinais de alarme e retorno em 48–72h", false, 1, "axis:conduta_seguranca"),
    grade("g12", "Apresentou-se e explicou a hipótese em linguagem acessível", false, 1, "axis:comunicacao"),
  ];

  return {
    casoId: 2,
    attemptId: "dryrun_pac_0001",
    score01: 0.588,
    notaFinal: 11.8,
    pontuacaoMaxima: 20,
    passed: false,
    grades,
    competencyScores: {
      "axis:comunicacao": 0.5,
      "axis:anamnese": 0.33,
      "axis:exame_fisico": 0.85,
      "axis:exames_complementares": 1.0,
      "axis:raciocinio_clinico": 1.0,
      "axis:conduta_seguranca": 0.35,
    },
    themeScores: { "theme:respiratorio": 0.61 },
    criticalErrors: [grades[9]], // dose do antibiótico não especificada
    professorFeedback:
      "Nota: 11.8/20 (59% da rubrica).\n\n" +
      "Pontos fortes:\n- Diagnóstico de PAC bem formulado\n- Exames complementares adequados (RX + hemograma)\n- Sinais vitais e ausculta corretos\n\n" +
      "A melhorar:\n- Antibioticoterapia: indicou amoxicilina, mas NÃO especificou a dose\n- Anamnese incompleta (antecedentes/alergias e sinais de gravidade)\n- Faltou orientar sinais de alarme e retorno",
    nextTrainingFocus: ["Conduta", "Anamnese", "Conduta e Segurança"],
    usage: { input_tokens: 0, output_tokens: 0, estimated_cost_usd: 0 },
    disclaimer: "Avaliação educacional simulada (mock de dry run). Não é avaliação real.",
  };
}

// ── 1b. Mock de StudentModel para o PAC (Fase 15) ───────────────────────────
// Aluno com erro recorrente em conduta/antibiótico, anamnese moderada, forte em
// diagnóstico, evolução positiva em exame físico e confiança média.
export function mockStudentModelPAC(): StudentModel {
  return buildStudentModel({
    profile: { nome: "Aluno(a) demo", nivel: "intermediario", semestre: 3, objetivos: ["Melhorar conduta e segurança", "Consolidar anamnese dirigida"] },
    attempts: [
      {
        casoId: 8, titulo: "Insuficiência cardíaca", sistema: "Cardiovascular", nota: 9, data: "2026-05-10", tempoSegundos: 540,
        competencias: [
          { eixo: "comunicacao", score01: 0.5 }, { eixo: "anamnese", score01: 0.5 }, { eixo: "exameFisico", score01: 0.6 },
          { eixo: "examesComplementares", score01: 0.7 }, { eixo: "raciocinioDiagnostico", score01: 0.85 }, { eixo: "condutaSeguranca", score01: 0.3 },
        ],
        errosCriticos: ["Antibiótico prescrito sem dose especificada"], examesFracos: ["ECG"], tags: ["conduta", "cardiovascular"],
      },
      {
        casoId: 3, titulo: "Asma", sistema: "Respiratório", nota: 11, data: "2026-05-24", tempoSegundos: 500,
        competencias: [
          { eixo: "comunicacao", score01: 0.55 }, { eixo: "anamnese", score01: 0.55 }, { eixo: "exameFisico", score01: 0.75 },
          { eixo: "examesComplementares", score01: 0.8 }, { eixo: "raciocinioDiagnostico", score01: 0.9 }, { eixo: "condutaSeguranca", score01: 0.35 },
        ],
        errosCriticos: ["Prescreveu antibiótico sem a dose"], examesFracos: ["Espirometria"], tags: ["conduta", "respiratorio"],
      },
      {
        casoId: 10, titulo: "TEP", sistema: "Respiratório", nota: 13, data: "2026-06-14", tempoSegundos: 470,
        competencias: [
          { eixo: "comunicacao", score01: 0.6 }, { eixo: "anamnese", score01: 0.6 }, { eixo: "exameFisico", score01: 0.82 },
          { eixo: "examesComplementares", score01: 0.85 }, { eixo: "raciocinioDiagnostico", score01: 0.92 }, { eixo: "condutaSeguranca", score01: 0.45 },
        ],
        errosCriticos: ["Não especificou a dose do antibiótico"], examesFracos: ["D-dímero"], tags: ["conduta", "respiratorio"],
      },
    ],
    preferencias: { estilo: "misto", ritmo: "moderado", prefereExemplos: true },
  });
}

// ── 1c. Mock de LearningSession para o PAC (Fase 16) ────────────────────────
// Sessão pós-reprovação: 8 min, energia média, frustração moderada, confiança
// média-baixa, objetivo = corrigir o erro recorrente de antibiótico.
export function mockLearningSessionPAC(studentModel: StudentModel, hb: HealthBenchEvaluationResult): LearningSession {
  return buildLearningSession({
    sessionId: "sess_pac_demo",
    casoId: 2,
    casoTitulo: "Pneumonia Adquirida na Comunidade",
    studentModel,
    healthBench: hb,
    tempoDisponivelMin: 8,
    modoDeclarado: "pos_reprovacao",
    energia: "media",
    frustracao: 0.5,
    confianca: 0.45,
    posReprovacao: true,
    objetivoDeclarado: "Corrigir o erro recorrente de dose do antibiótico com segurança.",
    sinais: [{ chave: "origem", valor: "dry-run", descricao: "Sessão simulada para o dry run." }],
  });
}

// ── 2. Resolução de refs do caso → nós do Knowledge Graph ───────────────────
function resolverIds(ids: string[] | undefined): Array<{ id: string; nome: string; categoria: string }> {
  return (ids ?? [])
    .map((id) => {
      const n = KNOWLEDGE_BY_ID[id];
      return n ? { id, nome: n.nome, categoria: n.categoria } : { id, nome: "(ausente)", categoria: "?" };
    });
}

// ── 3. Resultado do dry run ─────────────────────────────────────────────────
export interface ProfessorIADryRunResult {
  caso: { canonicalId: string; legacyId: number | string; titulo: string };
  diagnostico: string;
  nota: number;
  passou: boolean;
  principaisFalhas: string[];
  pontosFortes: string[];
  recursosCentroClinico: Array<{ dominio: string; titulo: string; href?: string }>;
  sonsRelacionados: Array<{ id: string; nome: string; categoria: string }>;
  imagensRelacionadas: Array<{ id: string; nome: string; categoria: string }>;
  examesRelacionados: Array<{ id: string; nome: string; categoria: string }>;
  fluxosRelacionados: Array<{ id: string; nome: string; categoria: string }>;
  objetivosProfessor: string[];
  perguntasSocraticas: string[];
  planoDeEstudo: StudyPlan;
  teachingStrategy: TeachingDecision;
  personaDecision: ProfessorPersonaDecision;
  lessonPlan: LessonPlannerOutput;
  /** Gabarito perfeito do caso (Fase 12) — fonte de verdade pedagógica. */
  goldStandard: GoldStandardCase;
  /** Resumo das 5 Truth Layers do Gold Standard (Fase 13). */
  truthLayersResumo: ReturnType<typeof getTruthLayerSummary>;
  /** Modelo longitudinal do aluno (Fase 15). */
  studentModel: StudentModel;
  studentSummary: StudentModelSummary;
  /** Estado atual da sessão (Fase 16). */
  learningSession: LearningSession;
  learningSessionSummary: LearningSessionSummary;
  /** Roteiro único do pipeline (Fase 18). */
  professorLesson: ProfessorLesson;
  prompts: ConversationModel["prompts"];
  ordemComposicaoPrompts: ConversationModel["ordemComposicao"];
  riscosAlucinacaoEvitados: string[];
  camposAusentes: string[];
  contextoResumo: {
    conversaMsgs: number;
    exameFisicoEventos: number;
    exames: number;
    recursosConhecimento: number;
    temAvaliacao: boolean;
    temMaterial: boolean;
  };
}

export function buildProfessorIADryRun(): {
  result: ProfessorIADryRunResult;
  context: ProfessorIAContext;
  conversation: ConversationModel;
} {
  const canon = CANONICAL_PAC;
  const casoLegacy = toLegacyOSCECase(canon);
  const hb = mockHealthBenchPAC();
  const studentModel = mockStudentModelPAC();
  const learningSession = mockLearningSessionPAC(studentModel, hb);

  const context = buildProfessorContext({
    mode: "pos_caso",
    caso: casoLegacy,
    chatMessages: [
      { tipo: "estudante", conteudo: "Bom dia, sou o Dr. estudante. O que a senhora está sentindo?" },
      { tipo: "paciente", conteudo: canon.scriptPaciente.aberturaEspontanea },
      { tipo: "estudante", conteudo: "A tosse é seca ou com catarro? Há quanto tempo?" },
      { tipo: "paciente", conteudo: canon.scriptPaciente.respostasDirigidas.tosse },
    ],
    physicalExamEvents: [
      { categoria: "respiratorio", textDigitado: "[Ausculta Pulmonar] LLA — Ausculta pulmonar", resposta: "Crepitações grossas em base esquerda." },
      { categoria: "geral", textDigitado: "Sinais vitais", resposta: "PA 120/80, FC 98, FR 24, T 38.5, SpO2 92%" },
    ],
    examRequests: canon.exames.filter((e) => e.solicitavel).map((e) => ({ nome: e.nome, resultado: e.resultadoEsperado })),
    diagnosisAndPlan: {
      hipotesePrincipal: "Pneumonia adquirida na comunidade",
      diagnosticosDiferenciais: canon.diagnostico.diferenciais.map((d) => d.diagnostico),
      examesIndicados: canon.exames.map((e) => e.nome),
      conduta: canon.conduta.tratamento.join("; "),
    },
    soap: { subjetivo: "Tosse produtiva, febre, dor pleurítica", objetivo: "FR 24, SpO2 92%, crepitações", avaliacao: "PAC", plano: "Amoxicilina" },
    tempoAtendimentoSegundos: 480,
    healthBenchResult: hb,
    estudoFinal: {
      respostaModelo: canon.feedbackEsperado.respostaModelo,
      checklistNotaMaxima: canon.feedbackEsperado.checklistNotaMaxima,
      errosCriticos: canon.feedbackEsperado.errosComuns,
      resumoEspecialista: canon.professorIA.miniAulaSugerida,
      especialidadeReferencia: canon.identificacao.especialidade,
    },
    // Fase 14: Gold Standard PAC (com Truth Layers) como fonte de verdade.
    goldStandard: PAC_GOLD_STANDARD,
    // Fase 15: modelo longitudinal do aluno.
    studentModel,
    // Fase 16: estado atual da sessão.
    learningSession,
  });

  const studyPlan = buildStudyPlan({
    caso: casoLegacy,
    avaliacao: context.avaliacao,
    healthBenchResult: hb,
    checklist: canon.feedbackEsperado.checklistNotaMaxima,
    conhecimento: context.conhecimento,
    goldStandard: PAC_GOLD_STANDARD,
    studentModel,
    learningSession,
  });

  // Camada estratégica pedagógica (Fase 9 + Truth Layers na Fase 14)
  const teachingStrategy = buildTeachingStrategy({
    context,
    studyPlan,
    healthBench: hb,
    caso: canon,
    knowledge: context.conhecimento,
    goldStandard: PAC_GOLD_STANDARD,
  });

  // Persona + controle de sessão (Fase 10)
  const personaDecision = buildProfessorPersona({
    teaching: teachingStrategy,
    context,
    studyPlan,
    caso: canon,
  });

  // Plano de aula + Teaching Actions (Fase 11)
  const lessonPlan = buildLessonPlan({
    context,
    teaching: teachingStrategy,
    persona: personaDecision,
    studyPlan,
    knowledge: context.conhecimento,
    caso: canon,
    goldStandard: PAC_GOLD_STANDARD,
  });

  // Prompts agora consideram teaching + persona + sessão + plano de aula (Fases 10–11)
  const conversation = buildConversationModel(context, {
    teaching: teachingStrategy,
    persona: personaDecision,
    lessonPlan,
  });

  // Falhas e fortes derivados da avaliação
  const principaisFalhas = (context.avaliacao?.competencias ?? [])
    .filter((c) => c.score01 < 0.6)
    .flatMap((c) => c.aMelhorar.slice(0, 2))
    .concat(context.avaliacao?.errosCriticos ?? []);
  const pontosFortes = (context.avaliacao?.competencias ?? [])
    .filter((c) => c.score01 >= 0.8)
    .flatMap((c) => c.acertos.slice(0, 2));

  const camposAusentes: string[] = context.proveniencia.filter((p) => !p.presente).map((p) => p.bloco);
  if (!context.ecg?.visualizado) camposAusentes.push("ecg (não indicado no caso)");

  const riscos = [
    "Prompt 'não inventar medicina': proíbe achados/condutas fora do caso e da base.",
    "Prompt 'apenas base do sistema': ancoragem em caso + HealthBench + material + Centro Clínico.",
    "Prompt de segurança: contexto educacional/simulado; sem prescrição real.",
    "Contexto traz proveniência por bloco (fonte de cada dado), reduzindo especulação.",
  ];

  const result: ProfessorIADryRunResult = {
    caso: { canonicalId: canon.identificacao.canonicalId, legacyId: canon.identificacao.legacyId, titulo: canon.identificacao.titulo },
    diagnostico: canon.identificacao.diagnostico,
    nota: context.avaliacao?.nota ?? hb.notaFinal,
    passou: context.avaliacao?.passed ?? hb.passed,
    principaisFalhas,
    pontosFortes,
    recursosCentroClinico: context.conhecimento.todos.map((r) => ({ dominio: r.domain, titulo: r.titulo, href: r.href })),
    sonsRelacionados: resolverIds(canon.refs?.soundRefs),
    imagensRelacionadas: resolverIds(canon.refs?.imageRefs),
    examesRelacionados: resolverIds(canon.refs?.examRefs),
    fluxosRelacionados: resolverIds(canon.refs?.flowRefs),
    objetivosProfessor: canon.professorObjectives ?? canon.professorIA.pontosParaReforcar,
    perguntasSocraticas: canon.professorIA.perguntasSocraticas,
    planoDeEstudo: studyPlan,
    teachingStrategy,
    personaDecision,
    lessonPlan,
    goldStandard: PAC_GOLD_STANDARD,
    truthLayersResumo: getTruthLayerSummary(PAC_GOLD_STANDARD),
    studentModel,
    studentSummary: summarizeStudentModel(studentModel),
    learningSession,
    learningSessionSummary: summarizeLearningSession(learningSession),
    professorLesson: buildProfessorLesson({
      context, studyPlan, teaching: teachingStrategy, persona: personaDecision, lessonPlan, conversation,
      goldStandard: PAC_GOLD_STANDARD, studentModel, learningSession, notaExibida: context.avaliacao?.nota,
    }),
    prompts: conversation.prompts,
    ordemComposicaoPrompts: conversation.ordemComposicao,
    riscosAlucinacaoEvitados: riscos,
    camposAusentes,
    contextoResumo: {
      conversaMsgs: context.conversa.length,
      exameFisicoEventos: context.exameFisico.length,
      exames: context.exames.length,
      recursosConhecimento: context.conhecimento.todos.length,
      temAvaliacao: !!context.avaliacao,
      temMaterial: !!context.material,
    },
  };

  return { result, context, conversation };
}
