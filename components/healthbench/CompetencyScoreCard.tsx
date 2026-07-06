"use client";

import React from "react";
import { AXIS_LABELS } from "@/lib/healthbench/types";

interface Props {
  competencyScores: Record<string, number>;
}

function corBarra(score: number): string {
  if (score >= 0.8) return "bg-emerald-500";
  if (score >= 0.5) return "bg-amber-500";
  return "bg-rose-500";
}

export function CompetencyScoreCard({ competencyScores }: Props) {
  const entradas = Object.entries(competencyScores).sort((a, b) => b[1] - a[1]);
  if (entradas.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span>📊</span> Score por competência
      </h3>
      <div className="space-y-3">
        {entradas.map(([tag, score]) => (
          <div key={tag}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-700">{AXIS_LABELS[tag] ?? tag}</span>
              <span className="font-semibold text-slate-800 tabular-nums">
                {Math.round(score * 100)}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${corBarra(score)}`}
                style={{ width: `${Math.round(score * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompetencyScoreCard;
