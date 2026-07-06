// ============================================================================
// Professor IA — PREVIEW BUILDER (Fases 17–18)
// ----------------------------------------------------------------------------
// Monta o pipeline pedagógico e devolve o ROTEIRO ÚNICO (ProfessorLesson) para o
// Feedback OSCE. NÃO monta mais dados de render manualmente: apenas roda os
// builders e chama buildProfessorLesson. PURO: sem IA/endpoint/banco. Sem Gold
// Standard do caso → ProfessorLesson com status "sem_gabarito" (fallback elegante).
// ============================================================================

import type { HealthBenchEvaluationResult } from "@/lib/healthbench/types";
import { buildProfessorContext } from "./context-builder";
import { buildStudyPlan } from "./study-plan-builder";
import { buildTeachingStrategy } from "./teaching-engine";
import { buildProfessorPersona } from "./persona-engine";
import { buildLessonPlan } from "./lesson-planner";
import { buildConversationModel } from "./conversation-builder";
import { buildStudentModel } from "./student-model";
import { buildLearningSession } from "./learning-session";
import { buildProfessorLesson, type ProfessorLesson, PROFESSOR_LESSON_SCHEMA_VERSION } from "./professor-lesson";
import { PAC_GOLD_STANDARD } from "../../clinical-engine/gold-standard/pac-gold-standard";
import { CANONICAL_PAC } from "../../clinical-engine/cases/pac";
import type { CanonicalCase } from "../../clinical-engine/types/canonical-case";
import type { GoldStandardCase } from "../../clinical-engine/gold-standard/types";

const HEADER = {
  titulo: "Professor IA",
  subtitulo: "Sessão de tutoria personalizada baseada no seu desempenho",
  aviso: "Prévia estrutural — o chat generativo será ativado em fase futura.",
};

// Mocks LEVES (auto-contidos) — sem arrastar o dry-run/knowledge registry.
function mockHealthBenchLeve(nota = 11.8): HealthBenchEvaluationResult {
  const crit = { rubricItemId: "g10", criterion: "Prescreveu antibiótico apropriado COM dose", criteria_met: false, explanation: "", points: 2, points_awarded: 0, tags: ["axis:conduta_seguranca"], critical: true, type: "positive" as const };
  return {
    casoId: 2, attemptId: "preview", score01: nota / 20, notaFinal: nota, pontuacaoMaxima: 20, passed: nota >= 12,
    grades: [
      { rubricItemId: "g5", criterion: "Auscultou o tórax e identificou crepitações", criteria_met: true, explanation: "", points: 1, points_awarded: 1, tags: ["axis:exame_fisico"], type: "positive" },
      { rubricItemId: "g6", criterion: "Solicitou radiografia de tórax", criteria_met: true, explanation: "", points: 1, points_awarded: 1, tags: ["axis:exames_complementares"], type: "positive" },
      crit,
    ],
    competencyScores: { "axis:comunicacao": 0.5, "axis:anamnese": 0.33, "axis:exame_fisico": 0.85, "axis:exames_complementares": 1.0, "axis:raciocinio_clinico": 1.0, "axis:conduta_seguranca": 0.35 },
    themeScores: {}, criticalErrors: [crit],
    professorFeedback: "", nextTrainingFocus: ["Conduta"],
    usage: { input_tokens: 0, output_tokens: 0, estimated_cost_usd: 0 }, disclaimer: "Prévia estrutural.",
  } as HealthBenchEvaluationResult;
}

function mockStudentModelLeve() {
  return buildStudentModel({
    profile: { nivel: "intermediario", semestre: 3 },
    attempts: [
      { casoId: 8, sistema: "Cardiovascular", nota: 9, data: "2026-05-10", competencias: [{ eixo: "condutaSeguranca", score01: 0.3 }, { eixo: "raciocinioDiagnostico", score01: 0.85 }], errosCriticos: ["Antibiótico sem dose"] },
      { casoId: 3, sistema: "Respiratório", nota: 11, data: "2026-05-24", competencias: [{ eixo: "condutaSeguranca", score01: 0.35 }, { eixo: "exameFisico", score01: 0.75 }], errosCriticos: ["Prescreveu antibiótico sem a dose"] },
      { casoId: 10, sistema: "Respiratório", nota: 13, data: "2026-06-14", competencias: [{ eixo: "condutaSeguranca", score01: 0.45 }, { eixo: "exameFisico", score01: 0.82 }], errosCriticos: ["Não especificou a dose do antibiótico"] },
    ],
  });
}

export interface ProfessorIAPreviewInput {
  caso: any;
  notaReal?: number;
  healthBenchResult?: HealthBenchEvaluationResult;
  estudoFinal?: {
    respostaModelo?: string;
    checklistNotaMaxima?: string[];
    errosCriticos?: string[];
    resumoEspecialista?: string;
    especialidadeReferencia?: string;
    secoes?: Array<{ titulo: string; conteudo: string }>;
  };
  goldStandard?: GoldStandardCase;
  // Fase 22: dados REAIS do atendimento (para o StudentTrace). Ausentes → conservador.
  chatMessages?: any[];
  physicalExamEvents?: any[];
  auscultas?: any[];
  examRequests?: any[];
  imagens?: any[];
  ecg?: any;
  sinaisVitais?: any;
  diagnosisAndPlan?: { hipotesePrincipal?: string; diagnosticosDiferenciais?: string[]; examesIndicados?: string[]; conduta?: string };
  soap?: any;
  tempoAtendimentoSegundos?: number;
}

/** Detecta se o caso é o PAC (id 2 ou diagnóstico/título de pneumonia). */
function ehPAC(caso: any): boolean {
  const id = caso?.id ?? caso?.legacyId ?? caso?.identificacao?.legacyId;
  if (id === 2 || id === "2") return true;
  const txt = `${caso?.titulo ?? ""} ${caso?.diagnosticoCorreto ?? ""} ${caso?.dados_ocultos_do_sistema?.diagnostico_principal ?? ""}`.toLowerCase();
  return /pneumonia|\bpac\b/.test(txt);
}

/**
 * Monta o ProfessorLesson do caso (ou fallback elegante). Puro (sem IA/endpoint/banco).
 */
export function buildProfessorIAPreview(input: ProfessorIAPreviewInput): ProfessorLesson {
  const isPac = ehPAC(input.caso);
  const goldStandard = input.goldStandard ?? (isPac ? PAC_GOLD_STANDARD : undefined);
  const canonicalCase: CanonicalCase | undefined = isPac ? CANONICAL_PAC : undefined;

  // Sem gabarito → fallback (ProfessorLesson status "sem_gabarito").
  if (!goldStandard || !canonicalCase) {
    return {
      schemaVersion: PROFESSOR_LESSON_SCHEMA_VERSION,
      status: "sem_gabarito",
      motivo: "Professor IA ainda não possui gabarito estruturado para este caso.",
      header: HEADER,
      diagnostico: { caso: input.caso?.titulo ?? "—", diagnostico: "—", prioridadePrincipal: "—", persona: "—", modoPedagogico: "—", duracaoEstimadaMin: 0 },
      objetivo: { objetivoFinal: "", objetivos: [] },
      openingLine: { texto: "", origem: "estatico_do_plano" },
      actions: [], recursos: [], perguntasSocraticas: [], miniQuiz: [],
      respostasEsperadas: { checklistNotaMaxima: [] }, pegadinhas: [], regrasSeguranca: [],
      promptPlan: { ordem: [], prompts: [], totalChars: 0 }, proximoPasso: { descricao: "" },
    };
  }

  const hb = input.healthBenchResult ?? mockHealthBenchLeve(input.notaReal);
  const studentModel = mockStudentModelLeve();
  const learningSession = buildLearningSession({
    casoId: input.caso?.id, studentModel, healthBench: hb,
    tempoDisponivelMin: 8, modoDeclarado: "pos_reprovacao", energia: "media",
    frustracao: 0.5, confianca: 0.45, posReprovacao: true,
    objetivoDeclarado: "Corrigir o erro recorrente de dose do antibiótico com segurança.",
  });

  const context = buildProfessorContext({
    mode: "pos_caso", caso: input.caso, healthBenchResult: hb, estudoFinal: input.estudoFinal,
    goldStandard, studentModel, learningSession,
    // Fase 22: dados reais → StudentTrace real (fonte única de elogio).
    chatMessages: input.chatMessages,
    physicalExamEvents: input.physicalExamEvents,
    auscultas: input.auscultas,
    examRequests: input.examRequests,
    imagens: input.imagens,
    ecg: input.ecg,
    sinaisVitais: input.sinaisVitais,
    diagnosisAndPlan: input.diagnosisAndPlan,
    soap: input.soap,
    tempoAtendimentoSegundos: input.tempoAtendimentoSegundos,
  });

  const studyPlan = buildStudyPlan({ caso: input.caso, avaliacao: context.avaliacao, conhecimento: context.conhecimento, goldStandard, studentModel, learningSession });
  const teaching = buildTeachingStrategy({ context, studyPlan, healthBench: hb, caso: canonicalCase, knowledge: context.conhecimento, goldStandard });
  const persona = buildProfessorPersona({ teaching, context, studyPlan, caso: canonicalCase });
  const lessonPlan = buildLessonPlan({ context, teaching, persona, studyPlan, knowledge: context.conhecimento, caso: canonicalCase, goldStandard });
  const conversation = buildConversationModel(context, { teaching, persona, lessonPlan });

  return buildProfessorLesson({
    context, studyPlan, teaching, persona, lessonPlan, conversation,
    goldStandard, studentModel, learningSession,
    notaExibida: input.notaReal ?? context.avaliacao?.nota ?? hb.notaFinal,
    header: HEADER,
  });
}
