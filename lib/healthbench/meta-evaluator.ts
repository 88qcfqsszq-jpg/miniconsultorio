/**
 * Meta-Evaluator — controle de qualidade do GRADER (inspirado em healthbench_meta_eval.py).
 *
 * NÃO avalia o aluno. Avalia se o avaliador IA concorda com julgamentos humanos.
 * Aqui ficam apenas os TIPOS e a estrutura — implementação completa é TODO futuro.
 */

import type { HealthBenchCriterionGrade } from "./types";

/** Rótulo humano (médico) para um critério de uma tentativa específica. */
export interface MetaHumanLabel {
  attemptId: string;
  rubricItemId: string;
  /** julgamento humano: o critério foi cumprido? */
  humanCriteriaMet: boolean;
  physicianId?: string;
}

/** Par IA vs humano para um mesmo critério/tentativa. */
export interface MetaComparison {
  attemptId: string;
  rubricItemId: string;
  graderCriteriaMet: boolean;
  humanCriteriaMet: boolean;
  agree: boolean;
}

export interface MetaAgreementResult {
  total: number;
  agreements: number;
  agreementRate: number;
  /** critérios onde IA e humano divergem com frequência */
  potentiallyUnfairCriteria: Array<{ rubricItemId: string; disagreements: number }>;
}

/**
 * Compara grades da IA com rótulos humanos.
 * TODO (futuro):
 *  - coletar múltiplos rótulos humanos por critério (consenso)
 *  - calcular F1 balanceado como no healthbench_meta_eval (precision/recall pos/neg)
 *  - sinalizar critérios injustamente avaliados para revisão da rubrica
 */
export function compararGraderComHumanos(
  grades: HealthBenchCriterionGrade[],
  humanLabels: MetaHumanLabel[]
): MetaAgreementResult {
  const porItem = new Map<string, HealthBenchCriterionGrade>();
  for (const g of grades) porItem.set(g.rubricItemId, g);

  const comparisons: MetaComparison[] = [];
  for (const hl of humanLabels) {
    const g = porItem.get(hl.rubricItemId);
    if (!g) continue;
    comparisons.push({
      attemptId: hl.attemptId,
      rubricItemId: hl.rubricItemId,
      graderCriteriaMet: g.criteria_met,
      humanCriteriaMet: hl.humanCriteriaMet,
      agree: g.criteria_met === hl.humanCriteriaMet,
    });
  }

  const agreements = comparisons.filter((c) => c.agree).length;
  const total = comparisons.length;

  const disagreementsByItem: Record<string, number> = {};
  for (const c of comparisons) {
    if (!c.agree) {
      disagreementsByItem[c.rubricItemId] =
        (disagreementsByItem[c.rubricItemId] ?? 0) + 1;
    }
  }

  return {
    total,
    agreements,
    agreementRate: total > 0 ? agreements / total : 0,
    potentiallyUnfairCriteria: Object.entries(disagreementsByItem)
      .map(([rubricItemId, disagreements]) => ({ rubricItemId, disagreements }))
      .sort((a, b) => b.disagreements - a.disagreements),
  };
}
