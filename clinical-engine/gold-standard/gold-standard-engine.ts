// ============================================================================
// Clinical Engine — GOLD STANDARD ENGINE
// ----------------------------------------------------------------------------
// Transforma um Caso Canônico no seu GABARITO PERFEITO (Gold Standard), de forma
// determinística e pura. NÃO chama IA, NÃO cria endpoint/UI, NÃO é consumido por
// nenhum runtime. Import de tipos do Caso Canônico é `import type` (zero runtime).
// ============================================================================

import type { CanonicalCase, CanonicalExam } from "../types/canonical-case";
import {
  GOLD_STANDARD_SCHEMA_VERSION,
  type GoldStandardAxis,
  type GoldStandardCase,
  type GoldStandardChecklistItem,
  type GoldStandardCriticalError,
  type GoldStandardExamRequest,
  type GoldStandardObligation,
  type GoldStandardSection,
  type GoldStandardTeachingPoint,
  type GoldStandardTruthLayers,
  type ClinicalTruth,
  type EducationalTruth,
  type EvaluationTruth,
  type TeachingTruth,
  type ResourceTruth,
} from "./types";

// ── Utilitários puros ────────────────────────────────────────────────────────
function dedup(xs: string[]): string[] {
  return Array.from(new Set(xs.filter(Boolean)));
}

/** Obrigatoriedade de um exame: usa o campo se existir; senão infere pelo nome. */
function obrigatoriedadeExame(e: CanonicalExam): GoldStandardObligation {
  if (e.obrigatoriedade === "obrigatorio") return "obrigatorio";
  if (e.obrigatoriedade === "opcional") return "recomendado";
  if (e.obrigatoriedade === "complementar") return "complementar";
  return /opcional|complementar|considerar/i.test(e.nome) ? "complementar" : "obrigatorio";
}

function toExamRequest(e: CanonicalExam): GoldStandardExamRequest {
  return {
    nome: e.nome,
    obrigatoriedade: obrigatoriedadeExame(e),
    resultadoEsperado: e.resultadoEsperado,
    justificativa: e.justificativa,
    categoria: e.categoria,
    ref: e.examRef,
  };
}

/**
 * Heurística de criticidade de um item de checklist: verdadeiro quando o item
 * toca uma palavra-chave derivada dos erros críticos/comuns do caso.
 */
function palavrasCriticas(caso: CanonicalCase): string[] {
  const fontes = [
    ...caso.rubrica.errosCriticos.map((x) => x.erro),
    ...caso.feedbackEsperado.errosComuns,
    ...(caso.commonMistakes ?? []),
  ].join(" ").toLowerCase();
  const chaves = ["rx", "radiograf", "antibi", "dose", "spo", "sinais vitais", "saturaç", "gravidade", "alarme"];
  return chaves.filter((k) => fontes.includes(k));
}

function ehCritico(item: string, chaves: string[]): boolean {
  const t = item.toLowerCase();
  return chaves.some((k) => t.includes(k));
}

// ── Função principal ─────────────────────────────────────────────────────────
/**
 * Gera o Gold Standard (gabarito perfeito) a partir de um Caso Canônico.
 * Puro e determinístico: mesma entrada → mesma saída (exceto `geradoEm`).
 */
export function buildGoldStandardFromCanonicalCase(caso: CanonicalCase): GoldStandardCase {
  const micro = caso.rubrica.microcriteriosPorEixo ?? {};

  // Anamnese: obrigatória vem dos microcritérios; recomendada, da história.
  const anamneseObrigatoria = dedup(micro.anamnese ?? []);
  const anamneseRecomendada = dedup([
    ...caso.historia.antecedentes.map((a) => `Investigar antecedente: ${a}`),
    ...caso.historia.medicacoes.map((m) => `Investigar medicação em uso: ${m}`),
    ...(caso.historia.alergias.length ? [`Investigar alergias`] : []),
    ...caso.historia.habitos.map((h) => `Investigar hábito: ${h}`),
    ...caso.historia.fatoresDeRisco.map((f) => `Investigar fator de risco: ${f}`),
  ]);

  // Exame físico: obrigatório dos microcritérios; recomendado/achados do canônico.
  const exameObrigatorio = dedup(micro.exameFisico ?? []);
  const exameRecomendado = dedup([
    caso.exameFisico.cardiovascular ? "Avaliação cardiovascular básica" : "",
    "Avaliar hidratação e perfusão",
    caso.exameFisico.abdominal ? "Exame abdominal dirigido quando pertinente" : "",
  ]);
  const achadosEsperados = dedup([
    ...caso.exameFisico.achadosPositivos,
    ...caso.exameFisico.achadosNegativosImportantes.map((a) => `(esperado ausente) ${a}`),
  ]);

  // Exames: separa obrigatórios de complementares.
  const examRequests = caso.exames.filter((e) => e.solicitavel).map(toExamRequest);
  const examesObrigatorios = examRequests.filter((e) => e.obrigatoriedade === "obrigatorio");
  const examesComplementares = examRequests.filter((e) => e.obrigatoriedade !== "obrigatorio");

  // Erros críticos.
  const errosCriticos: GoldStandardCriticalError[] = caso.rubrica.errosCriticos.map((e, i) => ({
    id: `err-${i + 1}`,
    erro: e.erro,
    descricao: e.descricao,
    penalidade: e.penalidade,
  }));

  // Checklist nota máxima (com heurística de criticidade).
  const chaves = palavrasCriticas(caso);
  const checklistNotaMaxima: GoldStandardChecklistItem[] = caso.feedbackEsperado.checklistNotaMaxima.map((item, i) => ({
    id: `chk-${i + 1}`,
    item,
    critico: ehCritico(item, chaves),
    obrigatoriedade: "obrigatorio",
  }));

  // Pontos de ensino (parear objetivos com perguntas socráticas por índice).
  const objetivosProf = caso.professorObjectives ?? caso.professorIA.pontosParaReforcar;
  const perguntas = caso.professorIA.perguntasSocraticas;
  const pontosDeEnsino: GoldStandardTeachingPoint[] = objetivosProf.map((ponto, i) => ({
    id: `tp-${i + 1}`,
    ponto,
    perguntaSocratica: perguntas[i],
  }));

  // Recursos: Centro Clínico + Knowledge Graph (dedup de todos os refs).
  const knowledgeGraph = dedup([
    ...(caso.refs?.knowledgeRefs ?? []),
    ...(caso.refs?.symptomRefs ?? []),
    ...(caso.refs?.examRefs ?? []),
    ...(caso.refs?.imageRefs ?? []),
    ...(caso.refs?.soundRefs ?? []),
    ...(caso.refs?.flowRefs ?? []),
    ...(caso.refs?.guidelineRefs ?? []),
  ]);

  const gold: GoldStandardCase = {
    schemaVersion: GOLD_STANDARD_SCHEMA_VERSION,
    geradoEm: new Date().toISOString(),
    geradoDe: {
      canonicalId: caso.identificacao.canonicalId,
      legacyId: caso.identificacao.legacyId,
      titulo: caso.identificacao.titulo,
      diagnostico: caso.identificacao.diagnostico,
    },
    objetivosEstacao: dedup(caso.identificacao.objetivosAprendizagem),
    anamnese: {
      obrigatoria: anamneseObrigatoria,
      recomendada: anamneseRecomendada,
      redFlags: dedup(caso.historia.redFlags),
    },
    exameFisico: {
      obrigatorio: exameObrigatorio,
      recomendado: exameRecomendado,
      achadosEsperados,
    },
    exames: { obrigatorios: examesObrigatorios, complementares: examesComplementares },
    diagnostico: {
      principal: caso.diagnostico.principal,
      porQueE: dedup(caso.diagnostico.porQueE),
      diferenciais: caso.diagnostico.diferenciais.map((d) => ({
        diagnostico: d.diagnostico,
        porQueNaoE: d.porQueNaoE,
        achadosQueDescartam: d.achadosQueDescartam,
      })),
    },
    conduta: {
      condutaIdeal: dedup(caso.conduta.tratamento),
      antibiotico: caso.conduta.antibiotico || undefined,
      criteriosGravidade: dedup(caso.conduta.criteriosGravidade),
      orientacoes: dedup(caso.conduta.orientacoes),
      seguimento: dedup(caso.conduta.seguimento),
      criteriosInternacao: dedup(caso.conduta.criteriosInternacao),
      criteriosAlta: dedup(caso.conduta.criteriosAlta),
    },
    errosCriticos,
    checklistNotaMaxima,
    pontosDeEnsino,
    feedbackModelo: {
      respostaModelo: caso.feedbackEsperado.respostaModelo,
      checklistNotaMaxima: dedup(caso.feedbackEsperado.checklistNotaMaxima),
      pegadinhas: dedup(caso.feedbackEsperado.pegadinhas),
      errosComuns: dedup(caso.feedbackEsperado.errosComuns),
      planoDeReforco: dedup(caso.feedbackEsperado.planoDeReforco),
    },
    professor: {
      objetivos: dedup(objetivosProf),
      perguntasSocraticas: dedup(perguntas),
      pontosParaReforcar: dedup(caso.professorIA.pontosParaReforcar),
      errosParaExplorar: dedup(caso.professorIA.errosParaExplorar),
      miniAula: caso.professorIA.miniAulaSugerida,
      planoDeTreino: dedup(caso.professorIA.planoDeTreinoSugerido),
    },
    recursos: {
      centroClinico: caso.conhecimentoRelacionado.links.map((l) => ({
        dominio: l.dominio,
        titulo: l.titulo,
        href: l.href,
        ancoras: l.ancoras,
      })),
      knowledgeGraph,
    },
    secoes: [], // preenchido abaixo
  };

  gold.secoes = montarSecoes(gold);
  gold.truthLayers = buildTruthLayers(gold, caso);
  return gold;
}

// ── Truth Layers (Fase 13): modulariza o gabarito em 5 camadas ──────────────
const AXES: GoldStandardAxis[] = [
  "comunicacao",
  "anamnese",
  "exameFisico",
  "examesComplementares",
  "raciocinioDiagnostico",
  "condutaSeguranca",
];

function refsPorPrefixo(caso: CanonicalCase, prefixo: string): string[] {
  const todos = [
    ...(caso.refs?.knowledgeRefs ?? []),
    ...(caso.refs?.symptomRefs ?? []),
    ...(caso.refs?.examRefs ?? []),
    ...(caso.refs?.imageRefs ?? []),
    ...(caso.refs?.soundRefs ?? []),
    ...(caso.refs?.flowRefs ?? []),
    ...(caso.refs?.guidelineRefs ?? []),
  ];
  return dedup(todos.filter((id) => id.startsWith(prefixo)));
}

/** Deriva as 5 Truth Layers a partir do Gold Standard já montado + o caso canônico. */
export function buildTruthLayers(gs: GoldStandardCase, caso: CanonicalCase): GoldStandardTruthLayers {
  const clinical: ClinicalTruth = {
    diagnosticoPrincipal: gs.diagnostico.principal,
    fisiopatologiaEssencial: caso.identificacao.sindromePrincipal,
    diferenciais: gs.diagnostico.diferenciais,
    justificativaDiagnostica: gs.diagnostico.porQueE,
    achadosClinicosChave: dedup(caso.exameFisico.achadosPositivos),
    sinaisDeGravidade: dedup([...gs.conduta.criteriosGravidade, ...caso.historia.redFlags]),
    condutaClinicaIdeal: gs.conduta.condutaIdeal,
    tratamento: dedup(caso.conduta.tratamento),
    criteriosInternacao: gs.conduta.criteriosInternacao,
    criteriosAlta: gs.conduta.criteriosAlta,
    errosClinicosGraves: gs.errosCriticos.map((e) => e.erro),
  };

  const educational: EducationalTruth = {
    objetivosDeAprendizagem: gs.objetivosEstacao,
    conceitosEssenciais: dedup(caso.professorObjectives ?? caso.professorIA.pontosParaReforcar),
    sequenciaDidatica: [
      "Reconhecer os acertos do aluno",
      "Fechar o raciocínio diagnóstico com os achados-chave",
      "Corrigir lacunas por prioridade clínica",
      "Consolidar conduta e segurança",
    ],
    pegadinhas: gs.feedbackModelo.pegadinhas,
    errosComuns: gs.feedbackModelo.errosComuns,
    analogiasPermitidas: [],
    pontosDeConfusao: gs.feedbackModelo.pegadinhas,
    perguntasParaRaciocinio: gs.professor.perguntasSocraticas,
  };

  const criteriosObrigatorios = gs.checklistNotaMaxima.map((c) => c.item);
  const criteriosCriticos = gs.checklistNotaMaxima.filter((c) => c.critico).map((c) => c.item);
  const micro = caso.rubrica.microcriteriosPorEixo ?? {};
  const evaluation: EvaluationTruth = {
    checklistNotaMaxima: gs.checklistNotaMaxima,
    criteriosObrigatorios,
    criteriosCriticos,
    microcriteriosPorEixo: micro,
    pesos: caso.rubrica.rubricaCorrecao.map((r) => ({
      criterio: r.criterio,
      peso: r.peso,
      pontuacaoMaxima: r.pontuacaoMaxima,
    })),
    errosCriticos: gs.errosCriticos,
    eixosHealthBench: AXES.filter((ax) => (micro[ax]?.length ?? 0) > 0),
    criteriosQueReprovam: gs.errosCriticos.map((e) => e.erro),
    objetivosAvaliaveis: gs.objetivosEstacao,
  };

  const teaching: TeachingTruth = {
    objetivosDoProfessor: gs.professor.objetivos,
    perguntasSocraticas: gs.professor.perguntasSocraticas,
    miniAulas: [caso.professorIA.miniAulaSugerida].filter(Boolean),
    modoSeErroCritico: "reforco_de_erro_critico: corrigir o erro crítico antes de qualquer aula longa; explicar o risco.",
    modoSeNotaAlta: "revisao_rapida: consolidação breve, valorizar acertos e apontar 1 refinamento.",
    feedbackEsperado: gs.feedbackModelo.respostaModelo,
    planoDeTreino: gs.professor.planoDeTreino,
    miniQuiz: [],
    explicacoesCurtas: gs.professor.pontosParaReforcar,
    explicacoesAprofundadas: [caso.professorIA.miniAulaSugerida].filter(Boolean),
  };

  const resource: ResourceTruth = {
    centroClinico: gs.recursos.centroClinico,
    knowledgeGraph: gs.recursos.knowledgeGraph,
    sons: dedup(caso.refs?.soundRefs ?? []),
    imagens: dedup(caso.refs?.imageRefs ?? []),
    exames: dedup(caso.refs?.examRefs ?? []),
    fluxos: dedup(caso.refs?.flowRefs ?? []),
    guidelines: dedup(caso.refs?.guidelineRefs ?? []),
    scores: dedup([...(caso.teachingRefs?.scores ?? []), ...refsPorPrefixo(caso, "score-")]),
    farmacos: refsPorPrefixo(caso, "drug-"),
    referencias: refsPorPrefixo(caso, "ref-"),
  };

  return { clinical, educational, evaluation, teaching, resource };
}

/** Representação achatada (uma seção legível por área) — conveniência. */
export function montarSecoes(gs: GoldStandardCase): GoldStandardSection[] {
  return [
    { id: "objetivos", titulo: "Objetivos da estação", itens: gs.objetivosEstacao },
    { id: "anamnese-obrigatoria", titulo: "Anamnese obrigatória", itens: gs.anamnese.obrigatoria },
    { id: "anamnese-recomendada", titulo: "Anamnese recomendada", itens: gs.anamnese.recomendada },
    { id: "exame-obrigatorio", titulo: "Exame físico obrigatório", itens: gs.exameFisico.obrigatorio },
    { id: "exame-recomendado", titulo: "Exame físico recomendado", itens: gs.exameFisico.recomendado },
    { id: "exames-obrigatorios", titulo: "Exames obrigatórios", itens: gs.exames.obrigatorios.map((e) => e.nome) },
    { id: "exames-complementares", titulo: "Exames complementares", itens: gs.exames.complementares.map((e) => e.nome) },
    { id: "diagnostico", titulo: "Diagnóstico principal", itens: [gs.diagnostico.principal] },
    { id: "diferenciais", titulo: "Diferenciais esperados", itens: gs.diagnostico.diferenciais.map((d) => d.diagnostico) },
    { id: "conduta", titulo: "Conduta ideal", itens: gs.conduta.condutaIdeal },
    { id: "erros-criticos", titulo: "Erros críticos", itens: gs.errosCriticos.map((e) => e.erro) },
    { id: "checklist", titulo: "Checklist nota máxima", itens: gs.checklistNotaMaxima.map((c) => c.item) },
    { id: "pontos-ensino", titulo: "Pontos de ensino", itens: gs.pontosDeEnsino.map((p) => p.ponto) },
  ];
}

// ── Helpers de acesso (puros; operam sobre um GoldStandardCase) ──────────────
export function getGoldStandardChecklist(gs: GoldStandardCase): GoldStandardChecklistItem[] {
  return gs.checklistNotaMaxima;
}

export function getGoldStandardTeachingPoints(gs: GoldStandardCase): GoldStandardTeachingPoint[] {
  return gs.pontosDeEnsino;
}

export function getGoldStandardCriticalErrors(gs: GoldStandardCase): GoldStandardCriticalError[] {
  return gs.errosCriticos;
}

export function getGoldStandardModelAnswer(gs: GoldStandardCase): string {
  return gs.feedbackModelo.respostaModelo;
}

// ── Helpers das Truth Layers (Fase 13) ──────────────────────────────────────
/** Garante as truthLayers: usa as existentes ou deriva na hora (puro). */
function ensureTruthLayers(gs: GoldStandardCase): GoldStandardTruthLayers | undefined {
  return gs.truthLayers;
}

export function getClinicalTruth(gs: GoldStandardCase): ClinicalTruth | undefined {
  return ensureTruthLayers(gs)?.clinical;
}
export function getEducationalTruth(gs: GoldStandardCase): EducationalTruth | undefined {
  return ensureTruthLayers(gs)?.educational;
}
export function getEvaluationTruth(gs: GoldStandardCase): EvaluationTruth | undefined {
  return ensureTruthLayers(gs)?.evaluation;
}
export function getTeachingTruth(gs: GoldStandardCase): TeachingTruth | undefined {
  return ensureTruthLayers(gs)?.teaching;
}
export function getResourceTruth(gs: GoldStandardCase): ResourceTruth | undefined {
  return ensureTruthLayers(gs)?.resource;
}

/** Resumo compacto das 5 camadas (contagens + destaques). */
export function getTruthLayerSummary(gs: GoldStandardCase): {
  presente: boolean;
  clinical: { diagnostico: string; diferenciais: number; sinaisGravidade: number; errosGraves: number };
  educational: { objetivos: number; conceitos: number; pegadinhas: number; perguntas: number };
  evaluation: { checklist: number; criticos: number; eixos: number; errosCriticos: number };
  teaching: { objetivos: number; perguntas: number; miniAulas: number; miniQuiz: number };
  resource: { centroClinico: number; knowledgeGraph: number; sons: number; imagens: number; exames: number; fluxos: number; guidelines: number; scores: number; farmacos: number; referencias: number };
} {
  const tl = gs.truthLayers;
  return {
    presente: !!tl,
    clinical: {
      diagnostico: tl?.clinical.diagnosticoPrincipal ?? "—",
      diferenciais: tl?.clinical.diferenciais.length ?? 0,
      sinaisGravidade: tl?.clinical.sinaisDeGravidade.length ?? 0,
      errosGraves: tl?.clinical.errosClinicosGraves.length ?? 0,
    },
    educational: {
      objetivos: tl?.educational.objetivosDeAprendizagem.length ?? 0,
      conceitos: tl?.educational.conceitosEssenciais.length ?? 0,
      pegadinhas: tl?.educational.pegadinhas.length ?? 0,
      perguntas: tl?.educational.perguntasParaRaciocinio.length ?? 0,
    },
    evaluation: {
      checklist: tl?.evaluation.checklistNotaMaxima.length ?? 0,
      criticos: tl?.evaluation.criteriosCriticos.length ?? 0,
      eixos: tl?.evaluation.eixosHealthBench.length ?? 0,
      errosCriticos: tl?.evaluation.errosCriticos.length ?? 0,
    },
    teaching: {
      objetivos: tl?.teaching.objetivosDoProfessor.length ?? 0,
      perguntas: tl?.teaching.perguntasSocraticas.length ?? 0,
      miniAulas: tl?.teaching.miniAulas.length ?? 0,
      miniQuiz: tl?.teaching.miniQuiz.length ?? 0,
    },
    resource: {
      centroClinico: tl?.resource.centroClinico.length ?? 0,
      knowledgeGraph: tl?.resource.knowledgeGraph.length ?? 0,
      sons: tl?.resource.sons.length ?? 0,
      imagens: tl?.resource.imagens.length ?? 0,
      exames: tl?.resource.exames.length ?? 0,
      fluxos: tl?.resource.fluxos.length ?? 0,
      guidelines: tl?.resource.guidelines.length ?? 0,
      scores: tl?.resource.scores.length ?? 0,
      farmacos: tl?.resource.farmacos.length ?? 0,
      referencias: tl?.resource.referencias.length ?? 0,
    },
  };
}
