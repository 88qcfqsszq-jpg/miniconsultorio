/**
 * Evaluator — orquestrador principal do MiniConsultorio HealthBench Engine.
 *
 * Fluxo:
 *  payload do atendimento → normaliza transcript → adapta rubrica do caso →
 *  avalia critério por critério (grader IA) → score → métricas → feedback →
 *  persiste tentativa → retorna HealthBenchEvaluationResult.
 */

import type { Caso } from "@/lib/types";
import {
  DISCLAIMER_EDUCACIONAL,
  type HealthBenchAtendimentoInput,
  type HealthBenchAttemptResult,
  type HealthBenchEvaluationResult,
} from "./types";
import { normalizarTranscript } from "./transcript-normalizer";
import { adaptarRubricaDoCaso } from "./rubric-adapter";
import { avaliarTodosCriterios } from "./grader";
import { calcularScore, extrairErrosCriticos } from "./score";
import { calcularMetrics } from "./metrics";
import { construirFeedbackProfessor, construirNextTrainingFocus } from "./feedback-builder";
import { salvarTentativa } from "./result-writer";
import { buildClinicalNlpEnrichment } from "@/lib/nlp/clinical-nlp-enricher";

const CUSTO_POR_1K_INPUT = 0.00015; // gpt-4o-mini (USD aprox.)
const CUSTO_POR_1K_OUTPUT = 0.0006;

// Camada AUXILIAR de NLP: enriquece o transcript com explicações de
// abreviações/sinônimos para o grader. NÃO pontua e NÃO altera rubrica/score.
// Desligável: ENABLE_CLINICAL_NLP_ENRICHMENT=false.
const ENABLE_CLINICAL_NLP_ENRICHMENT =
  process.env.ENABLE_CLINICAL_NLP_ENRICHMENT !== "false";

function gerarAttemptId(casoId: number | string): string {
  return `hb_${casoId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function evaluateHealthBenchAttempt(
  input: HealthBenchAtendimentoInput,
  caso: Caso,
  opts: { pontuacaoMaxima?: number } = {}
): Promise<HealthBenchEvaluationResult> {
  const casoIdNum = Number(caso.id);
  const attemptId = input.attemptId || gerarAttemptId(caso.id);
  const pontuacaoMaxima = opts.pontuacaoMaxima ?? 20;

  console.log("[HEALTHBENCH RESULT] Iniciando avaliação", { casoId: caso.id, attemptId });

  // 1. Normalizar transcript
  const transcript = normalizarTranscript(input);
  console.log("[HEALTHBENCH NORMALIZER]", { mensagens: transcript.length });

  // 1b. Enriquecimento NLP (auxiliar) — anexa bloco explicativo ao FINAL do
  //     transcript, preservando 100% o conteúdo original. Não pontua.
  const transcriptParaGrader = [...transcript];
  if (ENABLE_CLINICAL_NLP_ENRICHMENT) {
    const textoAgregado = transcript.map((m) => m.content).join("\n");
    const diagnosisKey =
      (caso as any)?.dados_ocultos_do_sistema?.diagnostico_principal ||
      (caso as any)?.titulo ||
      undefined;
    const enr = buildClinicalNlpEnrichment({ text: textoAgregado, diagnosisKey });
    if (enr.enrichmentText) {
      transcriptParaGrader.push({ role: "system_event", content: enr.enrichmentText });
    }
    console.log("[NLP ENRICHMENT]", {
      enabled: true,
      concepts: enr.detectedConcepts.length,
      diagnosis: diagnosisKey,
    });
  }

  // 2. Adaptar rubrica oficial do caso
  const rubric = adaptarRubricaDoCaso(caso);
  console.log("[HEALTHBENCH RUBRIC]", { itens: rubric.length });

  // 3. Avaliar critério por critério (com transcript enriquecido)
  const { grades, usage } = await avaliarTodosCriterios(transcriptParaGrader, rubric);

  // 4. Score
  const score = calcularScore(grades, pontuacaoMaxima);

  // 5. Métricas
  const metrics = calcularMetrics(grades, score.score01);

  // 6. Erros críticos + feedback
  const criticalErrors = extrairErrosCriticos(grades);
  const professorFeedback = construirFeedbackProfessor(
    grades,
    metrics,
    criticalErrors,
    score.notaFinal,
    pontuacaoMaxima
  );
  const nextTrainingFocus = construirNextTrainingFocus(metrics);

  const estimated_cost_usd =
    (usage.input_tokens / 1000) * CUSTO_POR_1K_INPUT +
    (usage.output_tokens / 1000) * CUSTO_POR_1K_OUTPUT;

  const resultado: HealthBenchEvaluationResult = {
    casoId: casoIdNum,
    attemptId,
    score01: score.score01,
    notaFinal: score.notaFinal,
    pontuacaoMaxima,
    passed: score.passed,
    grades,
    competencyScores: metrics.competencyScores,
    themeScores: metrics.themeScores,
    criticalErrors,
    professorFeedback,
    nextTrainingFocus,
    usage: {
      input_tokens: usage.input_tokens,
      output_tokens: usage.output_tokens,
      estimated_cost_usd: Number(estimated_cost_usd.toFixed(6)),
    },
    disclaimer: DISCLAIMER_EDUCACIONAL,
  };

  // 7. Persistir tentativa (best-effort)
  const attempt: HealthBenchAttemptResult = {
    attemptId,
    casoId: casoIdNum,
    createdAt: new Date().toISOString(),
    transcript,
    rubrics: rubric,
    grades,
    metrics: {
      overall_score: metrics.overall_score,
      competencyScores: metrics.competencyScores,
      themeScores: metrics.themeScores,
      criticalErrorCount: metrics.criticalErrorCount,
    },
    feedback: professorFeedback,
    usage: resultado.usage,
  };
  await salvarTentativa(attempt);

  console.log("[HEALTHBENCH RESULT] Concluído", {
    attemptId,
    notaFinal: score.notaFinal,
    passed: score.passed,
    criticalErrors: criticalErrors.length,
  });

  return resultado;
}
