"use client";

import React from "react";
import type { HealthBenchCriterionGrade } from "@/lib/healthbench/types";

interface Props {
  grade: HealthBenchCriterionGrade;
}

export function CriterionGradeCard({ grade }: Props) {
  const isNegativo = grade.type === "negative";
  // Para positivos: verde se cumprido. Para negativos: vermelho se ocorreu (criteria_met).
  const ok = isNegativo ? !grade.criteria_met : grade.criteria_met;

  const borda = grade.critical
    ? "border-rose-300"
    : ok
    ? "border-emerald-200"
    : "border-amber-200";
  const bg = grade.critical && grade.criteria_met && isNegativo ? "bg-rose-50" : "bg-white";

  return (
    <div className={`rounded-xl border ${borda} ${bg} p-3`}>
      <div className="flex items-start gap-2">
        <span className="text-lg leading-none mt-0.5">
          {ok ? "✅" : isNegativo ? "⛔" : "❌"}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-slate-800">{grade.criterion}</p>
            {grade.critical && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                Crítico
              </span>
            )}
            {isNegativo && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                Negativo
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">{grade.explanation}</p>
        </div>
        <span className="text-xs font-semibold text-slate-600 tabular-nums shrink-0">
          {grade.points_awarded > 0 ? "+" : ""}
          {grade.points_awarded}/{grade.points > 0 ? grade.points : grade.points}
        </span>
      </div>
    </div>
  );
}

export default CriterionGradeCard;
