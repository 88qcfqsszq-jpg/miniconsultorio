"use client";

/**
 * HealthBenchFeedbackPanel — painel de feedback estruturado HealthBench-like.
 * Exibido junto ao feedback OSCE existente (não o substitui).
 */

import React from "react";
import type { HealthBenchEvaluationResult } from "@/lib/healthbench/types";
import { CompetencyScoreCard } from "./CompetencyScoreCard";
import { CriterionGradeCard } from "./CriterionGradeCard";
import { CriticalErrorsBox } from "./CriticalErrorsBox";

interface Props {
  resultado: HealthBenchEvaluationResult;
}

export function HealthBenchFeedbackPanel({ resultado }: Props) {
  const cumpridos = resultado.grades.filter(
    (g) => g.type !== "negative" && g.criteria_met
  );
  const falhos = resultado.grades.filter(
    (g) => g.type !== "negative" && !g.criteria_met
  );

  return (
    <div className="space-y-5">
      {/* Cabeçalho: nota + aprovado/reprovado */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
              Avaliação HealthBench
            </p>
            <p className="text-3xl font-bold text-slate-800 tabular-nums">
              {resultado.notaFinal.toFixed(1)}
              <span className="text-lg text-slate-400">/{resultado.pontuacaoMaxima}</span>
            </p>
            <p className="text-sm text-slate-500">
              {Math.round(resultado.score01 * 100)}% da rubrica
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-bold ${
              resultado.passed
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {resultado.passed ? "Aprovado" : "Não aprovado"}
          </span>
        </div>
      </div>

      {/* Erros críticos */}
      <CriticalErrorsBox criticalErrors={resultado.criticalErrors} />

      {/* Score por competência */}
      <CompetencyScoreCard competencyScores={resultado.competencyScores} />

      {/* Critérios cumpridos */}
      {cumpridos.length > 0 && (
        <div>
          <h3 className="font-bold text-slate-800 mb-2">
            ✅ Critérios cumpridos ({cumpridos.length})
          </h3>
          <div className="space-y-2">
            {cumpridos.map((g) => (
              <CriterionGradeCard key={g.rubricItemId} grade={g} />
            ))}
          </div>
        </div>
      )}

      {/* Critérios falhos */}
      {falhos.length > 0 && (
        <div>
          <h3 className="font-bold text-slate-800 mb-2">
            ❌ Critérios não cumpridos ({falhos.length})
          </h3>
          <div className="space-y-2">
            {falhos.map((g) => (
              <CriterionGradeCard key={g.rubricItemId} grade={g} />
            ))}
          </div>
        </div>
      )}

      {/* Feedback do professor */}
      <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
        <h3 className="font-bold text-blue-900 mb-2">🧑‍🏫 Feedback do professor</h3>
        <p className="text-sm text-blue-900 whitespace-pre-line">
          {resultado.professorFeedback}
        </p>
      </div>

      {/* Plano de melhoria */}
      {resultado.nextTrainingFocus.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-800 mb-2">🎯 Plano de melhoria</h3>
          <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
            {resultado.nextTrainingFocus.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-slate-400 italic">{resultado.disclaimer}</p>
    </div>
  );
}

export default HealthBenchFeedbackPanel;
