// ============================================================================
// Professor IA — LEARNING SESSION MODEL (Fase 16)
// ----------------------------------------------------------------------------
// Estado ATUAL da sessão de aprendizagem. Enquanto o StudentModel responde
// "quem é este aluno ao longo do tempo?", o LearningSession responde
// "como este aluno está NESTA sessão agora?": objetivo, modo, tempo, energia,
// emoção, confiança, frustração e as adaptações recomendadas.
// PURO e determinístico. NÃO chama IA, NÃO acessa banco, NÃO cria login/persistência.
// ============================================================================

import type { CompetencyAxis } from "./types";
import type { StudentModel } from "./student-model";
import type { HealthBenchEvaluationResult } from "@/lib/healthbench/types";

export const LEARNING_SESSION_SCHEMA_VERSION = "1.0.0" as const;

export type LearningSessionMode =
  | "revisao_rapida"
  | "correcao_de_erro"
  | "aprofundamento"
  | "primeiro_contato"
  | "pos_reprovacao"
  | "treino_pre_prova"
  | "estudo_livre"
  | "consolidacao";

export type LearningSessionEnergy = "baixa" | "media" | "alta";
export type LearningSessionEmotion = "calmo" | "ansioso" | "frustrado" | "confiante" | "neutro" | "cansado";

export interface LearningSessionGoal {
  descricao: string;
  eixo?: CompetencyAxis;
  origem: "declarado" | "inferido";
}

export interface LearningSessionTimeBox {
  tempoDisponivelMin: number;
  tempoRestanteEstimadoMin: number;
  curto: boolean; // sessão curta (<= 6 min)
}

export interface LearningSessionContext {
  ehRevisao: boolean;
  ehConteudoNovo: boolean;
  ehPosReprovacao: boolean;
  multiplosErrosRecentes: boolean;
  urgencia: boolean;
}

export interface LearningSessionConstraint {
  reduzirCargaCognitiva: boolean;
  acelerar: boolean;
  aprofundar: boolean;
  fazerMiniQuiz: boolean;
  encerrarCedo: boolean;
  maxPrioridades: number;
}

export interface LearningSessionSignal {
  chave: string;
  valor: string | number | boolean;
  descricao?: string;
}

export interface LearningSessionAdaptation {
  cargaCognitivaRecomendada: "baixa" | "media" | "alta";
  abordagemRecomendada: string;
  ajustes: string[];
}

export interface LearningSession {
  schemaVersion: string;
  sessionId?: string;
  startedAt: string;
  casoId?: string | number;
  casoTitulo?: string;
  objetivo: LearningSessionGoal;
  modo: LearningSessionMode;
  timeBox: LearningSessionTimeBox;
  energia: LearningSessionEnergy;
  emocao: LearningSessionEmotion;
  confiancaAtual: number; // 0..1
  nivelFrustracao: number; // 0..1
  contexto: LearningSessionContext;
  preferenciaMomentanea?: "socratico" | "explicativo" | "diretivo" | "misto";
  constraints: LearningSessionConstraint;
  adaptacao: LearningSessionAdaptation;
  sinais: LearningSessionSignal[];
}

export interface LearningSessionSummary {
  modo: LearningSessionMode;
  objetivo: string;
  tempoDisponivelMin: number;
  estadoEmocional: string;
  confianca: number;
  cargaCognitivaRecomendada: "baixa" | "media" | "alta";
  abordagemRecomendada: string;
  limites: string[];
  alerta?: string;
}

// ── Entrada do builder ───────────────────────────────────────────────────────
export interface LearningSessionInput {
  sessionId?: string;
  casoId?: string | number;
  casoTitulo?: string;
  studentModel?: StudentModel;
  healthBench?: HealthBenchEvaluationResult;
  tempoDisponivelMin?: number;
  objetivoDeclarado?: string;
  modoDeclarado?: LearningSessionMode;
  energia?: LearningSessionEnergy;
  emocao?: LearningSessionEmotion;
  confianca?: number; // 0..1
  frustracao?: number; // 0..1
  posReprovacao?: boolean;
  ehRevisao?: boolean;
  urgencia?: boolean;
  preferenciaMomentanea?: LearningSession["preferenciaMomentanea"];
  sinais?: LearningSessionSignal[];
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

// ── Builder principal ────────────────────────────────────────────────────────
/**
 * Consolida o estado atual da sessão. Puro e determinístico (exceto `startedAt`).
 * Sem banco, sem IA, sem persistência.
 */
export function buildLearningSession(input: LearningSessionInput): LearningSession {
  const sm = input.studentModel;
  const hb = input.healthBench;

  const tempoDisponivelMin = input.tempoDisponivelMin ?? 10;
  const curto = tempoDisponivelMin <= 6;

  const criticalErrors = hb?.criticalErrors?.length ?? 0;
  const reprovado = input.posReprovacao ?? (hb ? hb.passed === false : false);
  const multiplosErrosRecentes = criticalErrors >= 2 || (sm?.errosRecorrentes.some((e) => e.persistente) ?? false);
  const primeiraVez = (sm?.casosRealizados.length ?? 0) === 0;

  // Modo: declarado tem prioridade; senão inferimos.
  let modo: LearningSessionMode;
  if (input.modoDeclarado) modo = input.modoDeclarado;
  else if (reprovado) modo = "pos_reprovacao";
  else if (criticalErrors > 0) modo = "correcao_de_erro";
  else if (input.ehRevisao) modo = "revisao_rapida";
  else if (primeiraVez) modo = "primeiro_contato";
  else modo = "consolidacao";

  // Confiança / frustração / energia / emoção.
  const confiancaAtual = clamp01(input.confianca ?? sm?.confiancaEstimada ?? (hb ? hb.score01 : 0.5));
  const nivelFrustracao = clamp01(
    input.frustracao ?? (reprovado ? 0.6 : multiplosErrosRecentes ? 0.5 : confiancaAtual < 0.4 ? 0.5 : 0.2)
  );
  const energia: LearningSessionEnergy = input.energia ?? (curto ? "media" : "media");
  const emocao: LearningSessionEmotion =
    input.emocao ??
    (nivelFrustracao >= 0.6 ? "frustrado" : nivelFrustracao >= 0.45 ? "ansioso" : confiancaAtual >= 0.7 ? "confiante" : "neutro");

  const contexto: LearningSessionContext = {
    ehRevisao: modo === "revisao_rapida" || !!input.ehRevisao,
    ehConteudoNovo: modo === "primeiro_contato",
    ehPosReprovacao: reprovado,
    multiplosErrosRecentes,
    urgencia: input.urgencia ?? false,
  };

  // Restrições da sessão.
  const reduzirCargaCognitiva = nivelFrustracao >= 0.5 || energia === "baixa" || reprovado;
  const acelerar = curto || modo === "revisao_rapida" || modo === "treino_pre_prova";
  const aprofundar = modo === "aprofundamento" && !curto && confiancaAtual >= 0.6 && nivelFrustracao < 0.4;
  const fazerMiniQuiz = modo === "treino_pre_prova" || (confiancaAtual >= 0.7 && nivelFrustracao < 0.4);
  const encerrarCedo = curto && nivelFrustracao >= 0.6;
  const maxPrioridades = curto ? 1 : reduzirCargaCognitiva ? 2 : 3;

  const constraints: LearningSessionConstraint = {
    reduzirCargaCognitiva, acelerar, aprofundar, fazerMiniQuiz, encerrarCedo, maxPrioridades,
  };

  // Objetivo.
  const objetivo: LearningSessionGoal = input.objetivoDeclarado
    ? { descricao: input.objetivoDeclarado, origem: "declarado", eixo: sm?.errosRecorrentes[0]?.eixo }
    : {
        descricao:
          modo === "pos_reprovacao" ? "Reconstruir a confiança e corrigir o que reprovou."
          : modo === "correcao_de_erro" ? "Corrigir o erro crítico do caso com segurança."
          : modo === "treino_pre_prova" ? "Treinar o checklist do caso contra o relógio."
          : modo === "primeiro_contato" ? "Construir o raciocínio do caso passo a passo."
          : "Consolidar o desempenho no caso.",
        origem: "inferido",
        eixo: sm?.competenciasFracas[0]?.eixo,
      };

  // Adaptação recomendada.
  const cargaCognitivaRecomendada = reduzirCargaCognitiva ? "baixa" : confiancaAtual >= 0.7 ? "alta" : "media";
  const abordagemRecomendada =
    modo === "pos_reprovacao" ? "Acolher, reforçar 1 acerto e corrigir 1 ponto por vez (sem reforçar o fracasso)."
    : modo === "treino_pre_prova" ? "Direta e avaliativa, cronometrada, com foco no checklist."
    : modo === "primeiro_contato" ? "Demonstrativa e socrática, em ritmo mais lento."
    : modo === "revisao_rapida" ? "Breve: erros críticos e pegadinhas."
    : aprofundar ? "Aprofundar com desafio adicional." : "Objetiva e ancorada na base.";

  const ajustes: string[] = [];
  if (reduzirCargaCognitiva) ajustes.push("Reduzir carga cognitiva (menos conceitos por vez).");
  if (acelerar) ajustes.push("Acelerar: ir ao essencial.");
  if (aprofundar) ajustes.push("Aprofundar: propor desafio adicional.");
  if (fazerMiniQuiz) ajustes.push("Incluir mini-quiz de verificação.");
  if (encerrarCedo) ajustes.push("Encerrar cedo se o aluno saturar.");
  if (contexto.ehPosReprovacao) ajustes.push("Começar com reforço positivo; não reforçar o fracasso.");

  const adaptacao: LearningSessionAdaptation = { cargaCognitivaRecomendada, abordagemRecomendada, ajustes };

  const sinais: LearningSessionSignal[] = [
    ...(input.sinais ?? []),
    { chave: "tempoDisponivelMin", valor: tempoDisponivelMin },
    { chave: "confianca", valor: confiancaAtual },
    { chave: "frustracao", valor: nivelFrustracao },
    { chave: "posReprovacao", valor: reprovado },
  ];

  return {
    schemaVersion: LEARNING_SESSION_SCHEMA_VERSION,
    sessionId: input.sessionId,
    startedAt: new Date().toISOString(),
    casoId: input.casoId,
    casoTitulo: input.casoTitulo,
    objetivo,
    modo,
    timeBox: { tempoDisponivelMin, tempoRestanteEstimadoMin: tempoDisponivelMin, curto },
    energia,
    emocao,
    confiancaAtual,
    nivelFrustracao,
    contexto,
    preferenciaMomentanea: input.preferenciaMomentanea,
    constraints,
    adaptacao,
    sinais,
  };
}

// ── Resumo ───────────────────────────────────────────────────────────────────
export function summarizeLearningSession(s: LearningSession): LearningSessionSummary {
  const limites: string[] = [];
  limites.push(`Máx. ${s.constraints.maxPrioridades} prioridade(s).`);
  if (s.constraints.acelerar) limites.push("Sessão acelerada — ir ao essencial.");
  if (s.constraints.reduzirCargaCognitiva) limites.push("Carga cognitiva reduzida.");
  if (s.constraints.encerrarCedo) limites.push("Pode encerrar cedo.");
  if (s.constraints.fazerMiniQuiz) limites.push("Incluir mini-quiz.");

  const alerta =
    s.contexto.ehPosReprovacao ? "Pós-reprovação: acolher e reconstruir confiança; não reforçar o fracasso."
    : s.nivelFrustracao >= 0.6 ? "Frustração alta: ser acolhedor e objetivo."
    : undefined;

  return {
    modo: s.modo,
    objetivo: s.objetivo.descricao,
    tempoDisponivelMin: s.timeBox.tempoDisponivelMin,
    estadoEmocional: `${s.emocao} (frustração ${Math.round(s.nivelFrustracao * 100)}%, energia ${s.energia})`,
    confianca: s.confiancaAtual,
    cargaCognitivaRecomendada: s.adaptacao.cargaCognitivaRecomendada,
    abordagemRecomendada: s.adaptacao.abordagemRecomendada,
    limites,
    alerta,
  };
}
