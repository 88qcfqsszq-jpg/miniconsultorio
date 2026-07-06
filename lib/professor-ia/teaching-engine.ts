// ============================================================================
// Professor IA — TEACHING STRATEGY ENGINE (Fase 9)
// ----------------------------------------------------------------------------
// Camada PEDAGÓGICA (pura) entre o HealthBench e o futuro Professor IA. Decide:
// o que ensinar primeiro, a prioridade, a estratégia, o modo, os recursos, as
// perguntas e o tom. NÃO chama IA, NÃO acessa banco/endpoint, NÃO usa React.
// ============================================================================

import { COMPETENCY_LABELS, type CompetencyAxis } from "./types";
import type { ProfessorIAContext, StudyPlan, KnowledgeMap, KnowledgeResource } from "./interfaces";
import type { HealthBenchEvaluationResult } from "@/lib/healthbench/types";
import type { CanonicalCase } from "../../clinical-engine/types/canonical-case";
import type { GoldStandardCase } from "../../clinical-engine/gold-standard/types";

// ── Vocabulário pedagógico ──────────────────────────────────────────────────
export type TeachingMode =
  | "socratico"
  | "demonstrativo"
  | "diretivo"
  | "avaliador"
  | "revisao_rapida"
  | "reforco_de_erro_critico";

export type TeachingStrategyKey =
  | "reforco_erro_critico"
  | "conduta_segura"
  | "investigacao_dirigida"
  | "diferenciais"
  | "semiologia"
  | "justificativa_de_exames"
  | "fala_medica_clara"
  | "revisao_de_manutencao";

export interface TeachingStrategy {
  key: TeachingStrategyKey;
  titulo: string;
  modo: TeachingMode;
  descricao: string;
  miniAula: string;
}

export interface TeachingPriority {
  chave: string;
  eixo?: CompetencyAxis | "erro_critico";
  titulo: string;
  estrategia: TeachingStrategyKey;
  modo: TeachingMode;
  motivo: string;
  severidade: "critica" | "alta" | "media";
  recursos: Array<{ titulo: string; href?: string }>;
}

export interface TeachingObjective {
  texto: string;
  eixo?: CompetencyAxis | "erro_critico";
}

export interface TeachingIntervention {
  modo: TeachingMode;
  foco: string;
  acao: string;
  recursos?: Array<{ titulo: string; href?: string }>;
  perguntas?: string[];
}

export interface TeachingRoadmap {
  titulo: string;
  passos: Array<{ ordem: number; modo: TeachingMode; foco: string; acao: string }>;
}

/** Controle de sessão básico (a Persona Engine produz a versão completa). */
export interface TeachingSession {
  estimatedDurationMinutes: number;
  maxQuestions: number;
  maxConcepts: number;
  reviewAtEnd: boolean;
  generateMiniQuiz: boolean;
}

export interface TeachingDecision {
  prioridadePrincipal: TeachingPriority;
  prioridadesSecundarias: TeachingPriority[];
  modoPedagogico: TeachingMode;
  teachingSession: TeachingSession;
  objetivos: TeachingObjective[];
  recursos: Array<{ titulo: string; href?: string }>;
  perguntasSocraticas: string[];
  miniAulas: string[];
  errosParaExplorar: string[];
  errosParaIgnorarAgora: string[];
  planoTresPassos: string[];
  roadmap: TeachingRoadmap;
  alertaSeguranca?: string;
  // Fase 14 (opcionais): prioridades avaliativas vindas da Evaluation Truth.
  criteriosObrigatorios?: string[];
  criteriosCriticos?: string[];
  /** Origem das perguntas/mini-aulas: "gold_standard" quando Truth Layers presentes. */
  fonteDidatica?: "gold_standard" | "caso";
  // Fase 15 (opcionais): sinais longitudinais do Student Model.
  errosRecorrentesDetectados?: string[];
  ajustePorHistorico?: string;
  reforcoPositivo?: boolean;
  erroAtualEhRepeticao?: boolean;
  // Fase 16 (opcionais): adaptação ao estado atual da sessão.
  ajustePorSessao?: string;
  maxPrioridadesSessao?: number;
}

export interface TeachingInput {
  context: ProfessorIAContext;
  studyPlan: StudyPlan;
  healthBench: HealthBenchEvaluationResult;
  caso: CanonicalCase;
  knowledge: KnowledgeMap;
  /** Gold Standard do caso (Fase 14) — Teaching/Evaluation Truth como fonte de verdade. */
  goldStandard?: GoldStandardCase;
}

// ── Catálogo de estratégias por eixo ────────────────────────────────────────
const STRATEGY_BY_AXIS: Record<CompetencyAxis, TeachingStrategy> = {
  comunicacao: { key: "fala_medica_clara", titulo: "Fala médica clara", modo: "demonstrativo", descricao: "Ensinar comunicação clara, acolhimento e explicação da hipótese.", miniAula: "Comunicação clínica: acolher, explicar em linguagem acessível e confirmar entendimento." },
  anamnese: { key: "investigacao_dirigida", titulo: "Investigação dirigida", modo: "socratico", descricao: "Ensinar a investigar de forma dirigida, sem perguntas genéricas.", miniAula: "Anamnese dirigida: caracterizar a queixa, antecedentes/alergias e sinais de gravidade." },
  exameFisico: { key: "semiologia", titulo: "Semiologia direcionada", modo: "demonstrativo", descricao: "Ensinar manobras e achados do sistema envolvido.", miniAula: "Semiologia direcionada ao sistema: inspeção, palpação, percussão e ausculta relevantes." },
  examesComplementares: { key: "justificativa_de_exames", titulo: "Justificativa dos exames", modo: "socratico", descricao: "Ensinar a pedir o exame que muda a conduta e justificá-lo.", miniAula: "Exames: cada solicitação deve responder a uma pergunta clínica." },
  raciocinioDiagnostico: { key: "diferenciais", titulo: "Hipóteses e diferenciais", modo: "demonstrativo", descricao: "Ensinar a construir hipóteses e diferenciais coerentes.", miniAula: "Raciocínio: correlacionar sintomas + exame + exames e considerar diferenciais." },
  condutaSeguranca: { key: "conduta_segura", titulo: "Conduta segura", modo: "diretivo", descricao: "Ensinar conduta segura, gravidade e sinais de alarme.", miniAula: "Conduta segura: tratar o grave primeiro, doses corretas e orientar sinais de alarme/retorno." },
};

const ORDEM_EIXOS: CompetencyAxis[] = [
  "comunicacao", "anamnese", "exameFisico", "examesComplementares", "raciocinioDiagnostico", "condutaSeguranca",
];

// Recursos do Knowledge/Centro Clínico por eixo.
function recursosDoEixo(eixo: CompetencyAxis, k: KnowledgeMap): KnowledgeResource[] {
  switch (eixo) {
    case "comunicacao": return [...k.guias];
    case "anamnese": return [...k.semiologia, ...k.guias];
    case "exameFisico": return [...k.semiologia, ...k.sons, ...k.imagens];
    case "examesComplementares": return [...k.exames, ...k.escores];
    case "raciocinioDiagnostico": return [...k.fluxos, ...k.escores];
    case "condutaSeguranca": return [...k.fluxos, ...k.guias];
  }
}

function toRecLink(r: KnowledgeResource): { titulo: string; href?: string } {
  return { titulo: r.titulo, href: r.href };
}

/** Peso de severidade (0..~1.2). Conduta/Segurança recebe bônus (regra: insegura > dx incompleto). */
function pesoSeveridade(eixo: CompetencyAxis, score01: number): number {
  const base = 1 - Math.max(0, Math.min(1, score01));
  const bonusSeguranca = eixo === "condutaSeguranca" ? 0.15 : 0;
  return base + bonusSeguranca;
}

function severidadeLabel(score01: number): "alta" | "media" {
  return score01 < 0.5 ? "alta" : "media";
}

/**
 * Decisão pedagógica principal. Pura, determinística.
 */
export function buildTeachingStrategy(input: TeachingInput): TeachingDecision {
  const { context, caso, knowledge, healthBench } = input;
  const truth = input.goldStandard?.truthLayers;
  const competencias = context.avaliacao?.competencias ?? [];
  const nota = context.avaliacao?.nota ?? healthBench.notaFinal;
  const temErroCritico = (context.avaliacao?.errosCriticos?.length ?? 0) > 0 || (healthBench.criticalErrors?.length ?? 0) > 0;
  const errosCriticos = context.avaliacao?.errosCriticos ?? (healthBench.criticalErrors ?? []).map((g) => g.criterion);

  // Ranking de eixos por severidade (0.85+ = dominado, ignora).
  const ranking = competencias
    .filter((c) => c.score01 < 0.85)
    .map((c) => ({ c, peso: pesoSeveridade(c.axis, c.score01) }))
    .sort((a, b) => b.peso - a.peso);

  const muitosGaps = ranking.filter((r) => r.c.score01 < 0.6).length >= 4;

  // Constrói prioridades por eixo.
  const prioridadesEixo: TeachingPriority[] = ranking.map(({ c }) => {
    const strat = STRATEGY_BY_AXIS[c.axis];
    return {
      chave: strat.key,
      eixo: c.axis,
      titulo: strat.titulo,
      estrategia: strat.key,
      modo: strat.modo,
      motivo: c.aMelhorar.length ? c.aMelhorar.slice(0, 2).join("; ") : `Desempenho ${Math.round(c.score01 * 100)}% neste eixo.`,
      severidade: severidadeLabel(c.score01),
      recursos: recursosDoEixo(c.axis, knowledge).slice(0, 3).map(toRecLink),
    };
  });

  // Prioridade 1: erro crítico sempre vem primeiro.
  const prioridadeErroCritico: TeachingPriority | null = temErroCritico
    ? {
        chave: "reforco_erro_critico",
        eixo: "erro_critico",
        titulo: "Corrigir erro crítico",
        estrategia: "reforco_erro_critico",
        modo: "reforco_de_erro_critico",
        motivo: errosCriticos.slice(0, 2).join("; ") || "Erro crítico identificado.",
        severidade: "critica",
        recursos: [...knowledge.fluxos, ...knowledge.guias].slice(0, 3).map(toRecLink),
      }
    : null;

  // Monta lista final (máx. 3 prioridades — não ensinar tudo de uma vez).
  // Fase 16: a sessão pode reduzir esse máximo (tempo curto / carga reduzida).
  const ls = context.learningSession;
  const maxFoco = ls ? Math.max(1, Math.min(3, ls.constraints.maxPrioridades)) : 3;
  const todas = [prioridadeErroCritico, ...prioridadesEixo].filter(Boolean) as TeachingPriority[];
  const foco = todas.slice(0, maxFoco);
  const prioridadePrincipal =
    foco[0] ?? {
      chave: "revisao_de_manutencao",
      titulo: "Revisão de manutenção",
      estrategia: "revisao_de_manutencao",
      modo: "revisao_rapida",
      motivo: "Desempenho consistente — sem lacunas prioritárias.",
      severidade: "media",
      recursos: knowledge.guias.slice(0, 2).map(toRecLink),
    };
  const prioridadesSecundarias = foco.slice(1);

  // Modo pedagógico global.
  let modoPedagogico: TeachingMode;
  if (temErroCritico) modoPedagogico = "reforco_de_erro_critico";
  else if (nota >= 17 && foco.length === 0) modoPedagogico = "revisao_rapida";
  else if (muitosGaps) modoPedagogico = "diretivo";
  else modoPedagogico = prioridadePrincipal.modo;

  // Fase 15: ajuste pelo histórico do aluno (Student Model).
  const sm = context.studentModel;
  const errosRecorrentesDetectados: string[] = [];
  let ajustePorHistorico: string | undefined;
  let reforcoPositivo = false;
  let erroAtualEhRepeticao = false;
  if (sm) {
    // Um erro atual é repetição se casa com um erro recorrente do histórico.
    const persistentes = sm.errosRecorrentes.filter((e) => e.persistente);
    for (const e of persistentes) {
      const casa = errosCriticos.some((ec) => ec.toLowerCase().includes(e.descricao.toLowerCase().slice(0, 12))) ||
        e.eixo === prioridadePrincipal.eixo;
      if (casa) { errosRecorrentesDetectados.push(`${e.descricao} (${e.ocorrencias}x)`); erroAtualEhRepeticao = true; }
    }
    const trend = sm.curvaEvolucao.tendencia.direcao;
    const erroRecorrenteSeguranca = persistentes.some((e) => e.eixo === "condutaSeguranca");
    if (erroAtualEhRepeticao && (erroRecorrenteSeguranca || temErroCritico)) {
      modoPedagogico = "diretivo";
      ajustePorHistorico = "Erro recorrente de segurança → modo mais DIRETIVO (não é a primeira vez).";
    } else if (trend === "piorando") {
      modoPedagogico = "diretivo";
      ajustePorHistorico = "Queda de desempenho no histórico → revisão guiada (diretivo).";
    } else if (trend === "melhorando") {
      reforcoPositivo = true;
      ajustePorHistorico = "Evolução positiva → manter e reforçar os ganhos (reforço positivo).";
    } else if (!erroAtualEhRepeticao && modoPedagogico !== "reforco_de_erro_critico") {
      ajustePorHistorico = "Erro novo (sem histórico) → abordagem mais socrática.";
      if (modoPedagogico === "diretivo") modoPedagogico = "socratico";
    }
  }

  // Fase 16: ajuste do modo pelo estado atual da sessão.
  let ajustePorSessao: string | undefined;
  if (ls) {
    if (ls.modo === "pos_reprovacao") {
      reforcoPositivo = true;
      ajustePorSessao = "Pós-reprovação → começar com reforço positivo antes de corrigir.";
    } else if (ls.modo === "treino_pre_prova") {
      if (!temErroCritico) modoPedagogico = "avaliador";
      ajustePorSessao = "Treino pré-prova → modo avaliador/diretivo, cronometrado.";
    } else if (ls.modo === "primeiro_contato") {
      if (!temErroCritico) modoPedagogico = "demonstrativo";
      ajustePorSessao = "Primeiro contato → modo demonstrativo/socrático, ritmo mais lento.";
    } else if (ls.constraints.reduzirCargaCognitiva && !temErroCritico) {
      ajustePorSessao = "Energia/frustração → não ensinar tudo; reduzir a carga cognitiva.";
    }
  }

  // Objetivos da sessão (das prioridades de foco + objetivos do caso).
  const objetivosCaso = caso.professorObjectives ?? caso.professorIA.pontosParaReforcar;
  const objetivos: TeachingObjective[] = [
    ...foco.map((p) => ({ texto: p.titulo + (p.eixo && p.eixo !== "erro_critico" ? ` (${COMPETENCY_LABELS[p.eixo]})` : ""), eixo: p.eixo })),
    ...objetivosCaso.slice(0, 2).map((t) => ({ texto: t })),
  ].slice(0, 5);

  // Recursos agregados (dedup por href/título).
  const recursosMap = new Map<string, { titulo: string; href?: string }>();
  for (const p of foco) for (const r of p.recursos) recursosMap.set(r.href || r.titulo, r);
  const recursos = [...recursosMap.values()];

  // Perguntas socráticas e mini-aulas — Truth Layers têm prioridade (Fase 14).
  const perguntasSocraticas = (
    truth?.teaching.perguntasSocraticas?.length
      ? truth.teaching.perguntasSocraticas
      : caso.professorIA.perguntasSocraticas
  ).slice(0, 4);
  const miniAulas = [
    ...(truth?.teaching.miniAulas ?? []),
    ...foco.filter((p) => p.eixo && p.eixo !== "erro_critico").map((p) => STRATEGY_BY_AXIS[p.eixo as CompetencyAxis].miniAula),
    caso.professorIA.miniAulaSugerida,
  ].slice(0, 4);

  // Erros a explorar (foco) × a ignorar por agora (além do top 3).
  // Com Truth Layers, os critérios críticos avaliativos entram primeiro.
  const errosParaExplorar = [
    ...(truth?.evaluation.criteriosCriticos ?? []),
    ...errosCriticos,
    ...foco.filter((p) => p.eixo !== "erro_critico").map((p) => p.motivo),
  ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 5);
  // Eixos com lacuna que NÃO entraram no foco (adiar — não ensinar tudo de uma vez).
  const focoEixos = new Set(foco.map((p) => p.eixo));
  const errosParaIgnorarAgora = prioridadesEixo
    .filter((p) => !focoEixos.has(p.eixo))
    .map((p) => `${p.titulo}: ${p.motivo}`);

  // Plano em 3 passos.
  const planoTresPassos = [
    "1) Reconhecer o que o aluno fez bem (âncora positiva) — " + (context.avaliacao?.competencias.filter((c) => c.score01 >= 0.8).map((c) => c.label).join(", ") || "pontos fortes do atendimento"),
    `2) Atacar a prioridade 1 em modo ${prioridadePrincipal.modo}: ${prioridadePrincipal.titulo} — ${prioridadePrincipal.motivo}`,
    prioridadesSecundarias[0]
      ? `3) Avançar para: ${prioridadesSecundarias[0].titulo} (modo ${prioridadesSecundarias[0].modo}) e consolidar com uma pergunta socrática`
      : "3) Consolidar com uma pergunta socrática e indicar 1 recurso do Centro Clínico",
  ];

  const roadmap: TeachingRoadmap = {
    titulo: `Sessão de ensino — ${caso.identificacao.titulo}`,
    passos: [
      { ordem: 1, modo: "avaliador", foco: "Reconhecimento", acao: "Reconhecer acertos e situar a nota." },
      { ordem: 2, modo: prioridadePrincipal.modo, foco: prioridadePrincipal.titulo, acao: prioridadePrincipal.motivo },
      { ordem: 3, modo: prioridadesSecundarias[0]?.modo ?? "socratico", foco: prioridadesSecundarias[0]?.titulo ?? "Consolidação", acao: "Aprofundar e verificar compreensão." },
    ],
  };

  const alertaSeguranca = temErroCritico
    ? `⚠️ ERRO CRÍTICO DE SEGURANÇA — prioridade máxima: ${errosCriticos.slice(0, 2).join("; ")}`
    : undefined;

  // Controle de sessão básico (subset). A Persona Engine refina.
  const teachingSession: TeachingSession = temErroCritico
    ? { estimatedDurationMinutes: 6, maxQuestions: 3, maxConcepts: Math.max(1, foco.length), reviewAtEnd: true, generateMiniQuiz: false }
    : modoPedagogico === "revisao_rapida"
      ? { estimatedDurationMinutes: 4, maxQuestions: 2, maxConcepts: 2, reviewAtEnd: false, generateMiniQuiz: false }
      : { estimatedDurationMinutes: 10, maxQuestions: 4, maxConcepts: Math.max(1, foco.length), reviewAtEnd: true, generateMiniQuiz: modoPedagogico === "socratico" };

  return {
    prioridadePrincipal,
    prioridadesSecundarias,
    modoPedagogico,
    teachingSession,
    objetivos,
    recursos,
    perguntasSocraticas,
    miniAulas,
    errosParaExplorar,
    errosParaIgnorarAgora,
    planoTresPassos,
    roadmap,
    alertaSeguranca,
    criteriosObrigatorios: truth?.evaluation.criteriosObrigatorios,
    criteriosCriticos: truth?.evaluation.criteriosCriticos,
    fonteDidatica: truth ? "gold_standard" : "caso",
    errosRecorrentesDetectados: errosRecorrentesDetectados.length ? errosRecorrentesDetectados : undefined,
    ajustePorHistorico,
    reforcoPositivo: sm || ls ? reforcoPositivo : undefined,
    erroAtualEhRepeticao: sm ? erroAtualEhRepeticao : undefined,
    ajustePorSessao,
    maxPrioridadesSessao: ls ? maxFoco : undefined,
  };
}
