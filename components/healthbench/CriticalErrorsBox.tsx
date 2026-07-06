"use client";

import React from "react";
import type { HealthBenchCriterionGrade } from "@/lib/healthbench/types";

interface Props {
  criticalErrors: HealthBenchCriterionGrade[];
}

export function CriticalErrorsBox({ criticalErrors }: Props) {
  if (!criticalErrors || criticalErrors.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm font-semibold text-emerald-800">
          ✅ Nenhum erro crítico identificado.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4">
      <h3 className="font-bold text-rose-800 mb-2 flex items-center gap-2">
        <span>⚠️</span> Erros críticos / segurança
      </h3>
      <ul className="space-y-2">
        {criticalErrors.map((g) => (
          <li key={g.rubricItemId} className="text-sm text-rose-900">
            <span className="font-medium">{g.criterion}</span>
            <span className="block text-xs text-rose-700 mt-0.5">{g.explanation}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CriticalErrorsBox;
