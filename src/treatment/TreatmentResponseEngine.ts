// ============================================================================
// TreatmentResponseEngine — ORQUESTRADOR
// ----------------------------------------------------------------------------
// Fluxo completo (determinístico por caseId + tempo + texto da conduta + perfil):
//   conduta (texto) → extractInterventions → analyzeTreatment
//   → generateDischargeVitals (base) → applyTreatmentResponseToVitals
//   → evaluateDisposition → alta / observação / hospital.
// Não recria o gerador (Opção 2 do escopo): gera a base e depois modula.
// Se não houver conduta, cai em fallback "ausente" (resposta conservadora).
// ============================================================================

import type { VitalSet, DispositionResult } from "@/src/vitals/vitalTypes";
import { generateDischargeVitals } from "@/src/vitals/generateDischargeVitals";
import { evaluateDisposition } from "@/src/vitals/evaluateDisposition";
import { extractInterventions } from "@/src/treatment/extractInterventions";
import { analyzeTreatment } from "@/src/treatment/analyzeTreatment";
import { applyTreatmentResponseToVitals } from "@/src/treatment/applyTreatmentResponseToVitals";
import { classifyTherapeuticResponse } from "@/src/treatment/treatmentResponseProfiles";
import type { Interventions, TreatmentAnalysis, TherapeuticResponse } from "@/src/treatment/treatmentTypes";
import { THERAPEUTIC_RESPONSE_LABEL } from "@/src/treatment/treatmentTypes";

export interface TreatmentResponseInput {
  caso: any;
  condutaTexto: string;
  initialVitals: VitalSet;
  elapsedMinutes: number;
}

export interface TreatmentResponseResult {
  interventions: Interventions;
  analysis: TreatmentAnalysis;
  baseExitVitals: VitalSet;
  exitVitals: VitalSet;
  disposition: DispositionResult;
  /** Resposta terapêutica observada (entrada → saída). */
  therapeuticResponse: TherapeuticResponse;
  therapeuticResponseLabel: string;
  /** true quando não havia conduta registrada (fallback conservador). */
  condutaAusente: boolean;
}

export function runTreatmentResponse({ caso, condutaTexto, initialVitals, elapsedMinutes }: TreatmentResponseInput): TreatmentResponseResult {
  const texto = String(condutaTexto ?? "").trim();
  const condutaAusente = texto.length === 0;

  // 1. Texto livre → intervenções padronizadas.
  const interventions = extractInterventions(texto);
  // 2. Adequação da conduta ao quadro.
  const analysis = analyzeTreatment({ caso, interventions, initialVitals, elapsedMinutes });
  // 3. Sinais de saída BASE (perfil clínico), sem recriar o gerador.
  const baseExitVitals = generateDischargeVitals({ caso, initialVitals, elapsedMinutes });
  // 4. Modula a resposta fisiológica conforme a adequação.
  const exitVitals = applyTreatmentResponseToVitals({ caso, initialVitals, baseExitVitals, treatmentAnalysis: analysis, elapsedMinutes });
  // 5. Disposição (regra de segurança "nunca alta simples" prevalece aqui).
  //    Passa o contexto da conduta/tempo para calibração clínica (ex.: febre
  //    persistente apesar de antitérmico → resposta insuficiente).
  const disposition = evaluateDisposition({
    caso,
    exitVitals,
    context: {
      elapsedMinutes,
      antipyretic: interventions.antipyretic,
      treatmentAdequacy: analysis.adequacy,
    },
  });

  // 5c. Resposta terapêutica DETERMINÍSTICA pela qualidade da conduta
  // (adequada → boa · parcial → parcial · inadequada/ausente → sem · perigosa → piora).
  const therapeuticResponse: TherapeuticResponse = classifyTherapeuticResponse(analysis.adequacy);

  // 5b. Regra de segurança da camada de conduta: uma conduta potencialmente
  // perigosa não deve resultar em alta simples, mesmo que os sinais permaneçam
  // em faixa aceitável (ex.: AINE/AAS na dengue). Eleva para observação.
  if (analysis.adequacy === "potencialmente_perigosa" && disposition.disposition === "alta_segura") {
    disposition.disposition = "observacao";
    disposition.stabilityLabel = "Parcialmente estável — manter em observação";
    disposition.reasons.unshift("A conduta informada contém elementos de risco — reavaliar antes de considerar alta.");
  }

  return {
    interventions,
    analysis,
    baseExitVitals,
    exitVitals,
    disposition,
    therapeuticResponse,
    therapeuticResponseLabel: THERAPEUTIC_RESPONSE_LABEL[therapeuticResponse],
    condutaAusente,
  };
}
