/**
 * Feedback View Builder — monta o ViewModel que o componente FeedbackOSCE já consome,
 * usando EXCLUSIVAMENTE o healthBenchResult como fonte.
 *
 * NÃO é um adaptador "para legado": é o ViewModel da UI existente (mesmo formato de
 * props que o componente espera), preenchido com dados HealthBench. Mantém a tela
 * visualmente idêntica e troca apenas a fonte avaliativa.
 *
 * Nada técnico (axis:, score01, criteria_met, comparison, sourceOfTruth) vaza para a UI.
 */

import type { Caso, FeedbackOSCE, CompetenciaAvaliacao } from "@/lib/types";
import type { HealthBenchEvaluationResult } from "./types";
import { CARDS_CONFIG, resolverAxisDoCard } from "./cards-config";
import { normalizeFeedbackList } from "@/lib/feedback/normalizeFeedbackText";
import {
  aplicarConsistenciaCards,
  type ContextoConsistencia,
} from "./feedback-consistency";
import {
  obterRubricaPorDiagnostico,
  aplicarRubricaNosCards,
  aplicarConsistenciaGlobalCards,
  normalizarCard,
} from "./rubricas-diagnosticos";

/**
 * Classificação textual baseada EXCLUSIVAMENTE na nota visual (soma dos 6 cards).
 * Não usa notaFinal bruto, score01, passed nem nota legada.
 * 20→Excelente, 17→Excelente, 16.9→Bom, 15→Bom, 14.9→Regular, 12→Regular, 11.9→Insuficiente.
 */
export function classificarNota(nota: number): FeedbackOSCE["classificacao"] {
  if (nota >= 17) return "Excelente";
  if (nota >= 15) return "Bom";
  if (nota >= 12) return "Regular";
  return "Insuficiente";
}

/** Resumo curto para o header, derivado do feedback do professor (sem números brutos). */
function resumoCurto(hb: HealthBenchEvaluationResult): string {
  const linhas = (hb.professorFeedback || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    // remove a linha "Nota: X/20..." (já aparece como número grande no header) e o disclaimer
    .filter((l) => !/^nota:/i.test(l))
    .filter((l) => !/avaliação educacional gerada/i.test(l));
  const texto = linhas.join(" ");
  return texto.length > 320 ? texto.slice(0, 317) + "…" : texto;
}

/**
 * Resolve o ÚNICO card ao qual um critério pertence (evita contagem dupla).
 * Prioridade: segurança/conduta → Conduta e Segurança; depois eixos clínicos.
 * Monta as 6 competências (cards) a partir das grades HB, com PARTIÇÃO ÚNICA:
 * cada critério é atribuído a exatamente um card (resolverAxisDoCard de CARDS_CONFIG).
 *
 * Por card:
 * - pontosMaximos = peso visual oficial (CARDS_CONFIG: 2/4/3/2/5/4)
 * - scoreCard = (pontos positivos cumpridos − penalidades) / pontos positivos possíveis, clamp 0..1
 * - pontosObtidos = scoreCard × peso
 * - acertos = positivos cumpridos
 * - melhorias = positivos não cumpridos + erros críticos negativos cometidos
 * - evidencias = explicações do grader (texto humano)
 *
 * A NOTA VISUAL do header é a soma destes pontosObtidos (ver construir...).
 */
function montarRubrica(
  hb: HealthBenchEvaluationResult
): CompetenciaAvaliacao[] {
  // 1. Particionar cada grade em um único card (por axis do card)
  const grupos = new Map<string, typeof hb.grades>();
  for (const { axis } of CARDS_CONFIG) grupos.set(axis, []);
  for (const g of hb.grades) {
    const axisCard = resolverAxisDoCard(g.tags ?? []);
    (grupos.get(axisCard) ?? grupos.get("axis:raciocinio_clinico"))!.push(g);
  }

  // 2. Calcular cada card a partir do seu grupo exclusivo
  return CARDS_CONFIG.map(({ nome, axis, pesoVisual: peso }) => {
    const gradesDoCard = grupos.get(axis) ?? [];

    const positivos = gradesDoCard.filter((g) => g.points > 0);
    const pontosPositivosPossiveis = positivos.reduce((acc, g) => acc + g.points, 0);
    const pontosPositivosCumpridos = positivos
      .filter((g) => g.criteria_met === true)
      .reduce((acc, g) => acc + g.points, 0);
    const penalidades = gradesDoCard
      .filter((g) => (g.type === "negative" || g.points < 0) && g.criteria_met === true)
      .reduce((acc, g) => acc + Math.abs(g.points), 0);

    // O QUE FOI RECONHECIDO = apenas critérios POSITIVOS cumpridos (mesma base do cálculo).
    const acertos = positivos
      .filter((g) => g.criteria_met === true)
      .map((g) => g.criterion);
    // O QUE FALTOU = positivos não cumpridos + erros críticos negativos COMETIDOS (penalidade).
    const positivosFalhos = positivos
      .filter((g) => g.criteria_met === false)
      .map((g) => g.criterion);
    const errosCriticosCometidos = gradesDoCard
      .filter((g) => (g.type === "negative" || g.points < 0) && g.criteria_met === true)
      .map((g) => g.criterion);
    const melhorias = [...positivosFalhos, ...errosCriticosCometidos];

    let scoreCard =
      pontosPositivosPossiveis > 0
        ? (pontosPositivosCumpridos - penalidades) / pontosPositivosPossiveis
        : 0;
    scoreCard = Math.max(0, Math.min(1, scoreCard));
    let pontosObtidos = Math.round(scoreCard * peso * 10) / 10;

    // ── CONSISTÊNCIA preliminar: card com acertos não fica 0/peso sem causa ──
    // (A normalização final em aplicarConsistenciaCards reforça esta regra.)
    if (pontosObtidos === 0 && acertos.length > 0) {
      const temPenalidade = errosCriticosCometidos.length > 0;
      if (!temPenalidade) {
        pontosObtidos = 0.1;
      }
      // Se há penalidade crítica, ela já consta em "melhorias" (exibida explicitamente).
    }

    const nCumpridos = acertos.length;
    console.log("[FEEDBACK HB CARD] score parcial por microcritérios:", nome, {
      cumpridos: nCumpridos,
      possiveis: positivos.length,
      pontos: `${pontosObtidos}/${peso}`,
      penalidadesCriticas: errosCriticosCometidos.length,
    });
    if (pontosPositivosPossiveis === 0) {
      console.log("[FEEDBACK HB CARD] sem critérios aplicáveis para:", nome);
    }

    const evidencias = gradesDoCard
      .map((g) => (g.explanation || "").trim())
      .filter((e) => e.length > 0 && !/heurística/i.test(e));

    return {
      nome,
      pontosObtidos,
      pontosMaximos: peso,
      // Fase 26: padronização da linguagem (acertos=passado; melhorar=infinitivo).
      // Apenas texto — não altera pontuação/scoring/rubrica.
      acertos: normalizeFeedbackList(acertos, "acerto"),
      melhorias: normalizeFeedbackList(melhorias, "melhorar"),
      evidencias,
    };
  });
}

/**
 * Constrói o objeto FeedbackOSCE (ViewModel da UI atual) a partir do healthBenchResult.
 * O componente FeedbackOSCE permanece intocado; só recebe dados HealthBench.
 */
export function construirFeedbackViewDeHealthBench(
  hb: HealthBenchEvaluationResult,
  caso: Caso,
  ctx: {
    diagnosticoInformado?: string;
    tempoAtendimento?: number;
    sinaisVitais?: { solicitado?: boolean; dados?: Record<string, any> | null };
    condutaTexto?: string;
    examesTexto?: string;
    anamneseTexto?: string;
    correlacaoTexto?: string;
    achadosTexto?: string;
    diferenciaisInformados?: string[];
    vitalSignsReassessment?: {
      realizado?: boolean;
      minutos?: number;
      exitVitals?: Record<string, unknown>;
      therapeuticResponse?: string;
      therapeuticResponseLabel?: string;
      disposition?: string;
      stabilityLabel?: string;
    } | null;
  } = {}
): FeedbackOSCE {
  const diagnosticoEsperadoCalc =
    caso?.dados_ocultos_do_sistema?.diagnostico_principal || "";

  // 1. Cards a partir do grader; 2. camada de consistência (sinais vitais,
  //    radiografia PAC, recalibração da Conduta PAC, dedup/contradições).
  const ctxConsistencia: ContextoConsistencia = {
    sinaisVitais: ctx.sinaisVitais,
    condutaTexto: ctx.condutaTexto,
    examesTexto: ctx.examesTexto,
    anamneseTexto: ctx.anamneseTexto,
    correlacaoTexto: ctx.correlacaoTexto,
    vitalSignsReassessment: ctx.vitalSignsReassessment,
    achadosTexto: ctx.achadosTexto,
    diferenciaisInformados: ctx.diferenciaisInformados,
    diagnosticoEsperado: diagnosticoEsperadoCalc,
    tituloCaso: caso?.titulo,
  };
  // Seleciona rubrica específica do diagnóstico (PAC, SCA, …). Se houver, ela
  // recalibra os cards cobertos; senão, usa a camada de consistência genérica.
  const rubricaEspecifica = obterRubricaPorDiagnostico(
    diagnosticoEsperadoCalc,
    caso?.id
  );
  const cardsBase = montarRubrica(hb);

  // Caminho A (rubrica específica) e Caminho B (genérico) convergem para a
  // MESMA camada global de consistência: aplicarConsistenciaGlobalCards.
  let cardsPreConsistencia: typeof cardsBase;
  let recalibrados: Set<string>;
  if (rubricaEspecifica) {
    const r = aplicarRubricaNosCards(cardsBase, rubricaEspecifica, ctxConsistencia);
    cardsPreConsistencia = r.cards;
    recalibrados = r.recalibrados;
    console.log("[FEEDBACK HB RUBRICA] rubrica específica aplicada:", rubricaEspecifica.diagnosticoId);
  } else {
    cardsPreConsistencia = aplicarConsistenciaCards(cardsBase, ctxConsistencia);
    recalibrados = new Set();
  }

  // CAMADA GLOBAL DE CONSISTÊNCIA (única, para todos os casos, com ou sem rubrica)
  const rubricaAvaliacao = aplicarConsistenciaGlobalCards(
    cardsPreConsistencia,
    ctxConsistencia,
    recalibrados,
    normalizarCard
  );

  // ✅ NOTA VISUAL OFICIAL = soma ponderada dos 6 cards visíveis (rubrica pedagógica).
  // O HealthBench é a fonte dos critérios; notaFinal fica como dado técnico/auditoria.
  const somaCards = rubricaAvaliacao.reduce((s, c) => s + Number(c.pontosObtidos || 0), 0);
  const nota = Math.max(0, Math.min(20, Math.round(somaCards * 10) / 10));

  // 🔍 AUDITORIA da matemática (logs de desenvolvimento)
  console.log("[FEEDBACK HB AUDIT] notaFinal HealthBench bruto:", hb.notaFinal);
  console.log("[FEEDBACK HB AUDIT] score01 HealthBench:", hb.score01);
  console.log(
    "[FEEDBACK HB AUDIT] cards calculados:",
    rubricaAvaliacao.map((c) => ({ nome: c.nome, obt: c.pontosObtidos, max: c.pontosMaximos }))
  );
  console.log("[FEEDBACK HB AUDIT] soma dos cards:", Math.round(somaCards * 10) / 10);
  console.log("[FEEDBACK HB AUDIT] nota visual enviada ao FeedbackOSCE:", nota);
  console.log(
    "[FEEDBACK HB AUDIT] divergência HB bruto vs nota visual:",
    Math.round((hb.notaFinal - nota) * 10) / 10
  );

  // Assert de consistência: nota visual deve ser igual à soma dos cards (salvo clamp).
  if (Math.abs(somaCards - nota) > 0.05 && somaCards >= 0 && somaCards <= 20) {
    console.warn("[FEEDBACK HB SCORE] divergência nota/cards", {
      nota,
      somaCards: Math.round(somaCards * 10) / 10,
    });
  }

  const diagnosticoEsperado =
    caso?.dados_ocultos_do_sistema?.diagnostico_principal || "Não informado";

  // Classificação textual derivada SOMENTE da nota visual (soma dos 6 cards).
  const classificacao = classificarNota(nota);
  console.log("[FEEDBACK HB CLASSIFICACAO]", { notaVisual: nota, classificacao });

  const view = {
    nota,
    percentual: Math.round((nota / 20) * 100),
    classificacao,
    justificativaNota: resumoCurto(hb),
    tempoAtendimento: ctx.tempoAtendimento ?? 0,

    rubricaAvaliacao,

    resumoCaso: {
      diagnosticoEsperado,
      diagnosticoInformado: ctx.diagnosticoInformado || diagnosticoEsperado,
      sindromePrincipal: "",
      achadosChave: [],
      raciocinioEsperado: "",
    },

    errosCriticos: (hb.criticalErrors || []).map((g) => g.criterion),

    // Campos restantes da interface não são lidos pela UI principal; ficam vazios.
    anamnese: { acertos: [], faltouPerguntar: [], perguntasPoucoUteis: [], comentario: "" },
    exameFisico: { manobrasRealizadas: [], achadosEncontrados: [], manobrasEsquecidas: [], comentario: "" },
    sinaisVitais: { interpretacao: "", pontosDeAlerta: [] },
    raciocinioDiagnostico: {
      hipoteseDoEstudante: ctx.diagnosticoInformado || "",
      diagnosticoEsperado,
      avaliacao: "",
      diferenciaisAdequados: [],
      diferenciaisFaltantes: [],
      comentario: "",
    },
    examesComplementares: { adequados: [], faltantes: [], desnecessarios: [], comentario: "" },
    conduta: { adequada: [], incompleta: [], erros: [], condutaModelo: "" },
    soap: { subjetivo: "", objetivo: "", avaliacao: "", plano: "", comentarioGeral: "" },
    respostaModeloOSCE: "",
    planoDeEstudo: hb.nextTrainingFocus ?? [],
  } as unknown as FeedbackOSCE;

  return view;
}
