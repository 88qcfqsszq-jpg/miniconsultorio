// ============================================================================
// Professor IA — CONTEXT BUILDER
// ----------------------------------------------------------------------------
// Reúne TODAS as informações de um atendimento num único ProfessorIAContext.
// PURO: não chama IA, não gera respostas, não altera nada. Só monta o objeto.
// ============================================================================

import {
  PROFESSOR_IA_CONTEXT_SCHEMA_VERSION,
  COMPETENCY_LABELS,
  COMPETENCY_WEIGHTS,
  type CompetencyAxis,
  type ProfessorIAMode,
} from "./types";
import type {
  ProfessorIAContext,
  ProfessorContextInput,
  CasoResumo,
  PacienteInfo,
  ConversaMensagem,
  ExameFisicoEvento,
  ExameSolicitado,
  RespostaAluno,
  AvaliacaoHealthBenchResumo,
  CompetenciaResultado,
  MaterialDidatico,
  ReferenciaUtilizada,
  ContextProvenance,
} from "./interfaces";
import type { HealthBenchEvaluationResult } from "@/lib/healthbench/types";
import type { TruthLayersResumo } from "./interfaces";
import type { GoldStandardCase } from "../../clinical-engine/gold-standard/types";
import { summarizeStudentModel } from "./student-model";
import { summarizeLearningSession } from "./learning-session";
import { buildStudentTrace, summarizeStudentTrace, validateTraceAgainstGoldStandard } from "./student-trace";
import { buildKnowledgeMap, inferirTemaClinico } from "./knowledge-builder";

// hb axis (axis:xxx) → eixo do feedback (CompetencyAxis)
const HB_AXIS_PARA_COMPETENCIA: Record<string, CompetencyAxis> = {
  "axis:comunicacao": "comunicacao",
  "axis:anamnese": "anamnese",
  "axis:exame_fisico": "exameFisico",
  "axis:exames_complementares": "examesComplementares",
  "axis:raciocinio_clinico": "raciocinioDiagnostico",
  "axis:conduta": "condutaSeguranca",
  "axis:seguranca": "condutaSeguranca",
  "axis:conduta_seguranca": "condutaSeguranca",
};

const ORDEM_COMPETENCIAS: CompetencyAxis[] = [
  "comunicacao",
  "anamnese",
  "exameFisico",
  "examesComplementares",
  "raciocinioDiagnostico",
  "condutaSeguranca",
];

function competenciaDeGrade(tags: string[] | undefined): CompetencyAxis | null {
  for (const t of tags ?? []) {
    const c = HB_AXIS_PARA_COMPETENCIA[t];
    if (c) return c;
  }
  return null;
}

/** Resume o HealthBenchEvaluationResult no formato do Professor IA. */
export function resumirHealthBench(hb: HealthBenchEvaluationResult): AvaliacaoHealthBenchResumo {
  const acertosPorEixo: Record<CompetencyAxis, string[]> = {
    comunicacao: [], anamnese: [], exameFisico: [], examesComplementares: [], raciocinioDiagnostico: [], condutaSeguranca: [],
  };
  const melhorarPorEixo: Record<CompetencyAxis, string[]> = {
    comunicacao: [], anamnese: [], exameFisico: [], examesComplementares: [], raciocinioDiagnostico: [], condutaSeguranca: [],
  };

  for (const g of hb.grades ?? []) {
    const eixo = competenciaDeGrade(g.tags);
    if (!eixo) continue;
    const negativo = g.type === "negative";
    if (!negativo && g.criteria_met) acertosPorEixo[eixo].push(g.criterion);
    else if (!negativo && !g.criteria_met) melhorarPorEixo[eixo].push(g.criterion);
    else if (negativo && g.criteria_met) melhorarPorEixo[eixo].push(`⚠️ ${g.criterion}`);
  }

  const competencias: CompetenciaResultado[] = ORDEM_COMPETENCIAS.map((axis) => {
    // competencyScores pode vir chaveado por "axis:xxx"; tentamos ambas as formas.
    const score01 =
      buscarScore(hb.competencyScores, axis) ?? 0;
    const pontosMaximos = COMPETENCY_WEIGHTS[axis];
    return {
      axis,
      label: COMPETENCY_LABELS[axis],
      pontosObtidos: Math.round(score01 * pontosMaximos * 10) / 10,
      pontosMaximos,
      score01,
      acertos: acertosPorEixo[axis],
      aMelhorar: melhorarPorEixo[axis],
    };
  });

  return {
    attemptId: hb.attemptId,
    nota: hb.notaFinal,
    pontuacaoMaxima: hb.pontuacaoMaxima,
    score01: hb.score01,
    passed: hb.passed,
    competencias,
    errosCriticos: (hb.criticalErrors ?? []).map((g) => g.criterion),
    focosDeTreino: hb.nextTrainingFocus ?? [],
    justificativaNota: (hb.professorFeedback ?? "").split("\n")[0],
    bruto: hb,
  };
}

function buscarScore(scores: Record<string, number> | undefined, axis: CompetencyAxis): number | undefined {
  if (!scores) return undefined;
  const chaves = [
    axis,
    `axis:${axis}`,
    axis === "exameFisico" ? "axis:exame_fisico" : "",
    axis === "examesComplementares" ? "axis:exames_complementares" : "",
    axis === "raciocinioDiagnostico" ? "axis:raciocinio_clinico" : "",
    axis === "condutaSeguranca" ? "axis:conduta_seguranca" : "",
  ].filter(Boolean);
  for (const k of chaves) {
    if (typeof scores[k] === "number") return scores[k];
  }
  return undefined;
}

/** Resume as 5 Truth Layers de um Gold Standard no formato consumido pelo Professor IA. */
export function resumirTruthLayers(gs: GoldStandardCase): TruthLayersResumo {
  const tl = gs.truthLayers;
  if (!tl) return { presente: false, camadas: [] };
  return {
    presente: true,
    camadas: ["clinical", "educational", "evaluation", "teaching", "resource"],
    clinical: {
      diagnostico: tl.clinical.diagnosticoPrincipal,
      diferenciais: tl.clinical.diferenciais.map((d) => d.diagnostico),
      sinaisDeGravidade: tl.clinical.sinaisDeGravidade,
      condutaIdeal: tl.clinical.condutaClinicaIdeal,
      errosClinicosGraves: tl.clinical.errosClinicosGraves,
    },
    educational: {
      conceitosEssenciais: tl.educational.conceitosEssenciais,
      pegadinhas: tl.educational.pegadinhas,
      pontosDeConfusao: tl.educational.pontosDeConfusao,
      perguntas: tl.educational.perguntasParaRaciocinio,
    },
    evaluation: {
      criteriosObrigatorios: tl.evaluation.criteriosObrigatorios,
      criteriosCriticos: tl.evaluation.criteriosCriticos,
      errosCriticos: tl.evaluation.errosCriticos.map((e) => e.erro),
      eixos: tl.evaluation.eixosHealthBench,
    },
    teaching: {
      objetivos: tl.teaching.objetivosDoProfessor,
      perguntasSocraticas: tl.teaching.perguntasSocraticas,
      miniAulas: tl.teaching.miniAulas,
      miniQuiz: tl.teaching.miniQuiz,
      modoSeErroCritico: tl.teaching.modoSeErroCritico,
      modoSeNotaAlta: tl.teaching.modoSeNotaAlta,
    },
    resource: {
      centroClinico: tl.resource.centroClinico.map((l) => ({ dominio: l.dominio, titulo: l.titulo, href: l.href })),
      sons: tl.resource.sons,
      imagens: tl.resource.imagens,
      exames: tl.resource.exames,
      fluxos: tl.resource.fluxos,
      guidelines: tl.resource.guidelines,
      scores: tl.resource.scores,
      farmacos: tl.resource.farmacos,
      referencias: tl.resource.referencias,
    },
  };
}

function mapConversa(msgs: ProfessorContextInput["chatMessages"]): ConversaMensagem[] {
  return (msgs ?? []).map((m) => {
    const tipo = (m.tipo || m.role || "").toLowerCase();
    const autor: ConversaMensagem["autor"] = tipo.includes("estud") || tipo.includes("student") || tipo.includes("aluno")
      ? "aluno"
      : tipo.includes("pac") || tipo.includes("patient")
        ? "paciente"
        : "sistema";
    return { autor, conteudo: m.conteudo ?? m.content ?? "", timestamp: m.timestamp };
  });
}

function mapExameFisico(evs: ProfessorContextInput["physicalExamEvents"]): ExameFisicoEvento[] {
  return (evs ?? []).map((e) => ({
    categoria: e.categoria,
    acao: e.textDigitado ?? "",
    achado: e.resposta,
    local: e.local,
  }));
}

function mapExames(reqs: ProfessorContextInput["examRequests"]): ExameSolicitado[] {
  return (reqs ?? []).map((e) => ({
    nome: e.nome ?? "",
    resultado: e.resultado,
    interpretadoPeloAluno: e.interpretadoPeloAluno,
  }));
}

function mapCaso(caso: any): CasoResumo {
  return {
    id: caso?.id,
    titulo: caso?.titulo,
    sistema: caso?.sistema,
    tema: caso?.tema,
    categoria: caso?.categoria,
    tema_clinico: inferirTemaClinico(caso?.sistema, caso?.tema, caso?.diagnosticoCorreto, caso?.titulo),
    diagnosticoCorreto:
      caso?.diagnosticoCorreto || caso?.dados_ocultos_do_sistema?.diagnostico_principal,
    diferenciaisEsperados: caso?.dados_ocultos_do_sistema?.diagnosticos_diferenciais,
    objetivoPedagogico: caso?.objetivo_pedagogico,
    subtopicos: caso?.subtopicosOSCE,
  };
}

function mapPaciente(caso: any): PacienteInfo {
  const dv = caso?.dados_visiveis_ao_estudante ?? {};
  return {
    nome: caso?.paciente?.nome ?? dv?.nome,
    idade: Number(dv?.idade) || caso?.paciente?.idade,
    sexo: caso?.sexo ?? caso?.paciente?.sexo ?? dv?.sexo,
    tipoPaciente: caso?.tipoPaciente,
    queixaPrincipal: dv?.queixa_principal ?? caso?.queixaPrincipal,
    dadosVisiveis: dv,
  };
}

/**
 * Monta o ProfessorIAContext completo a partir da entrada crua.
 * Não obrigatório nada além do caso. Campos ausentes viram defaults seguros.
 */
export function buildProfessorContext(input: ProfessorContextInput): ProfessorIAContext {
  const mode: ProfessorIAMode = input.mode ?? "pos_caso";
  const caso = mapCaso(input.caso);
  const paciente = mapPaciente(input.caso);

  const avaliacao = input.healthBenchResult ? resumirHealthBench(input.healthBenchResult) : undefined;

  const material: MaterialDidatico | undefined = input.estudoFinal
    ? {
        respostaModelo: input.estudoFinal.respostaModelo,
        checklistNotaMaxima: input.estudoFinal.checklistNotaMaxima,
        errosCriticosDidaticos: input.estudoFinal.errosCriticos,
        resumoEspecialista: input.estudoFinal.resumoEspecialista,
        especialidadeReferencia: input.estudoFinal.especialidadeReferencia,
        secoes: input.estudoFinal.secoes,
      }
    : undefined;

  const conhecimento = buildKnowledgeMap({
    diagnosisKey: caso.diagnosticoCorreto,
    sistema: caso.sistema,
    tema: caso.tema,
    casoTitulo: caso.titulo,
    temaClinico: caso.tema_clinico,
    // Fase 14: se houver Resource Truth, seus links viram fonte preferencial.
    resourceTruth: input.goldStandard?.truthLayers?.resource,
  });

  // Gold Standard + Truth Layers (Fase 14).
  const goldStandard = input.goldStandard;
  const truthLayers = goldStandard?.truthLayers;
  const truthLayersResumo = goldStandard ? resumirTruthLayers(goldStandard) : undefined;

  // Student Model (Fase 15).
  const studentModel = input.studentModel;
  const studentSummary = studentModel ? summarizeStudentModel(studentModel) : undefined;

  // Learning Session (Fase 16).
  const learningSession = input.learningSession;
  const learningSessionSummary = learningSession ? summarizeLearningSession(learningSession) : undefined;

  // Student Trace (Fase 22) — rastro REAL do aluno. Fonte única de elogio.
  const studentTrace = buildStudentTrace({
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
  const gsForTrace = input.goldStandard;
  const studentTraceSummary = summarizeStudentTrace(studentTrace, gsForTrace);
  const traceValidation = gsForTrace ? validateTraceAgainstGoldStandard(studentTrace, gsForTrace) : undefined;

  const respostaAluno: RespostaAluno = {
    hipotesePrincipal: input.diagnosisAndPlan?.hipotesePrincipal,
    diagnosticosDiferenciais: input.diagnosisAndPlan?.diagnosticosDiferenciais ?? [],
    examesIndicados: input.diagnosisAndPlan?.examesIndicados ?? [],
    conduta: input.diagnosisAndPlan?.conduta,
    soap: input.soap,
  };

  const referencias: ReferenciaUtilizada[] = [];
  (input.imagens ?? []).forEach((im) => {
    if (im.fonte) referencias.push({ fonte: im.fonte, descricao: im.termoBusca, url: im.url });
  });
  if ((input.auscultas ?? []).some((a) => a.arquivo)) {
    referencias.push({ fonte: "HLS-CMDS", descricao: "Áudios de ausculta clínica" });
  }
  referencias.push({ fonte: "Centro Clínico", descricao: "Semiologia, fluxos, exames, imagens e sons" });

  const conversa = mapConversa(input.chatMessages);
  const exameFisico = mapExameFisico(input.physicalExamEvents);
  const exames = mapExames(input.examRequests);

  const proveniencia: ContextProvenance[] = [
    { bloco: "caso", fonte: "caso", presente: !!caso.id },
    { bloco: "conversa", fonte: "atendimento", presente: conversa.length > 0 },
    { bloco: "exameFisico", fonte: "atendimento", presente: exameFisico.length > 0 },
    { bloco: "auscultas", fonte: "atendimento", presente: (input.auscultas ?? []).length > 0 },
    { bloco: "exames", fonte: "atendimento", presente: exames.length > 0 },
    { bloco: "ecg", fonte: "atendimento", presente: !!input.ecg?.visualizado },
    { bloco: "imagens", fonte: "atendimento", presente: (input.imagens ?? []).length > 0 },
    { bloco: "respostaAluno", fonte: "atendimento", presente: !!respostaAluno.hipotesePrincipal },
    { bloco: "avaliacao", fonte: "healthbench", presente: !!avaliacao },
    { bloco: "material", fonte: "estudo_final", presente: !!material },
    { bloco: "conhecimento", fonte: "centro_clinico", presente: conhecimento.todos.length > 0 },
    { bloco: "goldStandard", fonte: "caso", presente: !!goldStandard },
    { bloco: "truthLayers", fonte: "caso", presente: !!truthLayers },
    { bloco: "studentModel", fonte: "atendimento", presente: !!studentModel },
    { bloco: "learningSession", fonte: "atendimento", presente: !!learningSession },
  ];

  return {
    schemaVersion: PROFESSOR_IA_CONTEXT_SCHEMA_VERSION,
    geradoEm: new Date().toISOString(),
    mode,
    alunoId: input.alunoId,
    caso,
    paciente,
    conversa,
    exameFisico,
    auscultas: input.auscultas ?? [],
    exames,
    ecg: input.ecg,
    imagens: input.imagens ?? [],
    sinaisVitais: input.sinaisVitais,
    tempo: input.tempoAtendimentoSegundos != null ? { totalSegundos: input.tempoAtendimentoSegundos } : undefined,
    respostaAluno,
    avaliacao,
    material,
    conhecimento,
    referencias,
    goldStandard,
    truthLayers,
    truthLayersResumo,
    studentModel,
    studentSummary,
    learningSession,
    learningSessionSummary,
    studentTrace,
    studentTraceSummary,
    traceValidation,
    proveniencia,
  };
}
