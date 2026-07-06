// ============================================================================
// Professor IA — STUDY PLAN BUILDER
// ----------------------------------------------------------------------------
// Recebe caso + resultado HealthBench + checklist e produz uma ESTRUTURA de
// plano de estudo priorizado (P1/P2/P3) + recursos relacionados. Sem IA.
// ============================================================================

import type { CompetencyAxis, GapSeverity, StudyPriority } from "./types";
import type {
  StudyPlan,
  StudyPlanItem,
  StudyPlanInput,
  KnowledgeMap,
  KnowledgeResource,
  AvaliacaoHealthBenchResumo,
  CompetenciaResultado,
} from "./interfaces";
import { resumirHealthBench } from "./context-builder";
import { buildKnowledgeMap } from "./knowledge-builder";
import { COMPETENCY_LABELS } from "./types";

// Quais domínios de conhecimento reforçam cada competência.
const COMPETENCIA_PARA_RECURSOS: Record<CompetencyAxis, (k: KnowledgeMap) => KnowledgeResource[]> = {
  comunicacao: (k) => [...k.guias],
  anamnese: (k) => [...k.semiologia, ...k.guias],
  exameFisico: (k) => [...k.semiologia, ...k.sons, ...k.imagens],
  examesComplementares: (k) => [...k.exames, ...k.escores],
  raciocinioDiagnostico: (k) => [...k.fluxos, ...k.escores],
  condutaSeguranca: (k) => [...k.fluxos, ...k.guias],
};

function prioridadeDaCompetencia(score01: number): { prioridade: StudyPriority; severidade: GapSeverity } {
  if (score01 < 0.5) return { prioridade: 1, severidade: "importante" };
  if (score01 < 0.75) return { prioridade: 2, severidade: "leve" };
  return { prioridade: 3, severidade: "leve" };
}

/**
 * Monta o plano de estudo. Aceita `avaliacao` já resumida OU o `healthBenchResult` cru.
 */
export function buildStudyPlan(input: StudyPlanInput): StudyPlan {
  const avaliacao: AvaliacaoHealthBenchResumo | undefined =
    input.avaliacao ?? (input.healthBenchResult ? resumirHealthBench(input.healthBenchResult) : undefined);

  const casoId = (input.caso as any)?.id;
  const truth = input.goldStandard?.truthLayers;
  const sm = input.studentModel;
  const ls = input.learningSession;
  const conhecimento: KnowledgeMap =
    input.conhecimento ??
    buildKnowledgeMap({
      diagnosisKey: (input.caso as any)?.diagnosticoCorreto ?? (input.caso as any)?.dados_ocultos_do_sistema?.diagnostico_principal,
      sistema: (input.caso as any)?.sistema,
      tema: (input.caso as any)?.tema,
      casoTitulo: (input.caso as any)?.titulo,
      temaClinico: (input.caso as any)?.tema_clinico,
      resourceTruth: truth?.resource,
    });

  const itens: StudyPlanItem[] = [];

  // 1) Erros críticos → sempre Prioridade 1 (severidade crítica).
  for (const erro of avaliacao?.errosCriticos ?? []) {
    itens.push({
      prioridade: 1,
      titulo: `Corrigir erro crítico: ${erro}`,
      motivo: "Erro crítico identificado na avaliação — impacta segurança do paciente.",
      severidade: "critica",
      recursos: [...conhecimento.fluxos, ...conhecimento.guias],
    });
  }

  // 2) Competências, ordenadas da mais fraca para a mais forte.
  const competencias: CompetenciaResultado[] = [...(avaliacao?.competencias ?? [])].sort(
    (a, b) => a.score01 - b.score01
  );
  for (const comp of competencias) {
    // Competências dominadas (score alto) não geram item obrigatório.
    if (comp.score01 >= 0.85) continue;
    const { prioridade, severidade } = prioridadeDaCompetencia(comp.score01);
    const recursos = (COMPETENCIA_PARA_RECURSOS[comp.axis]?.(conhecimento) ?? []).slice(0, 4);
    itens.push({
      prioridade,
      competencia: comp.axis,
      titulo: `Reforçar: ${COMPETENCY_LABELS[comp.axis]}`,
      motivo:
        comp.aMelhorar.length > 0
          ? `Pontos a melhorar: ${comp.aMelhorar.slice(0, 2).join("; ")}`
          : `Desempenho ${Math.round(comp.score01 * 100)}% neste eixo.`,
      severidade,
      recursos,
    });
  }

  // 3) Focos de treino do HealthBench sem competência associada → Prioridade 2.
  for (const foco of avaliacao?.focosDeTreino ?? []) {
    const jaCoberto = itens.some((i) => i.titulo.toLowerCase().includes(foco.toLowerCase()));
    if (jaCoberto) continue;
    itens.push({
      prioridade: 2,
      titulo: `Treinar: ${foco}`,
      motivo: "Foco de treino sugerido pela avaliação HealthBench.",
      severidade: "leve",
      recursos: [...conhecimento.fluxos].slice(0, 2),
    });
  }

  // 4) Fase 14: enriquecimento pelo Gold Standard (Evaluation + Teaching Truth).
  if (truth) {
    const jaTem = (t: string) => itens.some((i) => i.titulo.toLowerCase().includes(t.toLowerCase()));

    // 4a) Critérios CRÍTICOS avaliativos ainda não cobertos → Prioridade 1.
    for (const crit of truth.evaluation.criteriosCriticos) {
      if (jaTem(crit)) continue;
      itens.push({
        prioridade: 1,
        titulo: `Garantir critério crítico: ${crit}`,
        motivo: "Critério crítico do gabarito (Evaluation Truth) — derruba muito a nota se ausente.",
        severidade: "critica",
        recursos: [...conhecimento.fluxos, ...conhecimento.guias].slice(0, 3),
      });
    }

    // 4b) Checklist obrigatório do gabarito → Prioridade 2 (consolidar cobertura).
    if (truth.evaluation.criteriosObrigatorios.length) {
      itens.push({
        prioridade: 2,
        titulo: "Cobrir o checklist obrigatório do caso",
        motivo: `Critérios obrigatórios (Evaluation Truth): ${truth.evaluation.criteriosObrigatorios.slice(0, 6).join("; ")}`,
        severidade: "leve",
        recursos: conhecimento.todos.slice(0, 3),
      });
    }

    // 4c) Pontos de ensino do professor (Teaching Truth) → Prioridade 2.
    for (const obj of truth.teaching.objetivosDoProfessor.slice(0, 3)) {
      if (jaTem(obj)) continue;
      itens.push({
        prioridade: 2,
        titulo: `Ponto de ensino: ${obj}`,
        motivo: "Objetivo do professor (Teaching Truth) para consolidar o raciocínio.",
        severidade: "leve",
        recursos: [...conhecimento.semiologia, ...conhecimento.fluxos].slice(0, 2),
      });
    }
  }

  // 5) Fase 15: enriquecimento longitudinal pelo Student Model.
  if (sm) {
    const jaTem = (t: string) => itens.some((i) => i.titulo.toLowerCase().includes(t.toLowerCase()));

    // 5a) Erros RECORRENTES persistentes → Prioridade 1 (acima de erro pontual).
    for (const e of sm.errosRecorrentes.filter((x) => x.persistente)) {
      itens.unshift({
        prioridade: 1,
        competencia: e.eixo,
        titulo: `Erro RECORRENTE (${e.ocorrencias}x): ${e.descricao}`,
        motivo: "Erro persistente no histórico do aluno — prioridade maior que um erro isolado; requer revisão longitudinal.",
        severidade: "critica",
        recursos: [...conhecimento.fluxos, ...conhecimento.guias].slice(0, 3),
      });
    }

    // 5b) Temas repetidamente fracos (sistemas) → sobem de prioridade.
    for (const s of sm.dificuldadePorSistema.filter((x) => x.scoreMedio < 0.6 && x.ocorrencias >= 2)) {
      if (jaTem(s.sistema)) continue;
      itens.push({
        prioridade: 1,
        titulo: `Reforço longitudinal — sistema ${s.sistema}`,
        motivo: `Desempenho baixo repetido (${s.ocorrencias}x, ${Math.round(s.scoreMedio * 100)}%).`,
        severidade: "importante",
        recursos: conhecimento.todos.slice(0, 3),
      });
    }

    // 5c) Revisão longitudinal pendente.
    for (const r of sm.revisaoPendente.slice(0, 3)) {
      if (jaTem(r.tema)) continue;
      itens.push({
        prioridade: r.prioridade,
        competencia: r.eixo,
        titulo: `Revisão longitudinal: ${r.tema}`,
        motivo: r.motivo,
        severidade: r.prioridade === 1 ? "importante" : "leve",
        recursos: [...conhecimento.fluxos, ...conhecimento.guias].slice(0, 2),
      });
    }
  }

  // 6) Fase 16: adaptação ao estado atual da sessão (Learning Session).
  if (ls) {
    let itensAjustados = [...itens];
    if (ls.modo === "pos_reprovacao") {
      itensAjustados.unshift({
        prioridade: 1,
        titulo: "Reconstruir confiança: retomar 1 acerto e corrigir 1 ponto por vez",
        motivo: "Sessão pós-reprovação — priorizar reconstrução de confiança antes de aprofundar.",
        severidade: "importante",
        recursos: conhecimento.guias.slice(0, 2),
      });
    }
    if (ls.modo === "revisao_rapida") {
      itensAjustados.unshift({
        prioridade: 1,
        titulo: "Revisão rápida: erros críticos + pegadinhas",
        motivo: "Modo revisão rápida — focar no que mais derruba a nota.",
        severidade: "importante",
        recursos: [...conhecimento.fluxos, ...conhecimento.guias].slice(0, 2),
      });
    }
    if (ls.modo === "primeiro_contato") {
      itensAjustados.unshift({
        prioridade: 1,
        titulo: "Explicação progressiva do caso (primeiro contato)",
        motivo: "Primeiro contato — construir o raciocínio passo a passo.",
        severidade: "leve",
        recursos: conhecimento.semiologia.slice(0, 2),
      });
    }
    if (ls.modo === "treino_pre_prova") {
      itensAjustados.unshift({
        prioridade: 1,
        titulo: "Treino do checklist contra o relógio",
        motivo: "Treino pré-prova — priorizar cobertura do checklist e gestão de tempo.",
        severidade: "importante",
        recursos: conhecimento.todos.slice(0, 2),
      });
    }
    // Sessão curta ou frustração/energia baixa → reduzir o nº de itens.
    const limite = ls.timeBox.curto ? 3 : ls.constraints.reduzirCargaCognitiva ? 5 : itensAjustados.length;
    // Preserva os de maior prioridade (1 antes de 2 antes de 3).
    itensAjustados = [...itensAjustados].sort((a, b) => a.prioridade - b.prioridade).slice(0, limite);
    // Confiança alta → permite manter/adicionar 1 item de desafio.
    if (ls.confiancaAtual >= 0.75 && !ls.constraints.reduzirCargaCognitiva) {
      itensAjustados.push({
        prioridade: 2,
        titulo: "Desafio adicional (confiança alta)",
        motivo: "Confiança alta na sessão — permitir mais desafio.",
        severidade: "leve",
        recursos: conhecimento.fluxos.slice(0, 1),
      });
    }
    itens.length = 0;
    itens.push(...itensAjustados);
  }

  const prioridade1 = itens.filter((i) => i.prioridade === 1);
  const prioridade2 = itens.filter((i) => i.prioridade === 2);
  const prioridade3 = itens.filter((i) => i.prioridade === 3);

  const notaTruth = truth
    ? ` Baseado no Gold Standard (Truth Layers): ${truth.evaluation.criteriosCriticos.length} critério(s) crítico(s), ${truth.teaching.miniQuiz.length} item(ns) de mini-quiz.`
    : "";
  const notaAluno = sm
    ? ` Histórico do aluno: ${sm.errosRecorrentes.filter((e) => e.persistente).length} erro(s) recorrente(s), evolução ${sm.curvaEvolucao.tendencia.direcao}.`
    : "";
  const notaSessao = ls
    ? ` Sessão atual: modo ${ls.modo}, ${ls.timeBox.tempoDisponivelMin} min, carga ${ls.adaptacao.cargaCognitivaRecomendada}.`
    : "";
  const resumo =
    (itens.length === 0
      ? "Desempenho consistente — sem lacunas prioritárias identificadas. Sugere-se revisão de manutenção."
      : `Plano com ${itens.length} itens: ${prioridade1.length} de prioridade 1, ${prioridade2.length} de prioridade 2, ${prioridade3.length} de prioridade 3.`) + notaTruth + notaAluno + notaSessao;

  return {
    casoId,
    attemptId: avaliacao?.attemptId,
    itens,
    prioridade1,
    prioridade2,
    prioridade3,
    recursosRelacionados: conhecimento.todos,
    resumo,
  };
}
