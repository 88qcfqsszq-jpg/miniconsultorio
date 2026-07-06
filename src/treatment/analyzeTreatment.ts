// ============================================================================
// TreatmentResponseEngine — ANÁLISE DA ADEQUAÇÃO DA CONDUTA
// ----------------------------------------------------------------------------
// Classifica a conduta do aluno (intervenções extraídas) para o quadro clínico
// do caso em: adequada | parcial | inadequada | ausente | potencialmente_perigosa.
// Puro e determinístico. Considera caso/diagnóstico/gravidade (perfil), sinais
// iniciais e as intervenções. NÃO altera scoring/feedback — é só para modular a
// resposta fisiológica e orientar o aluno. Não usa linguagem acusatória.
// ============================================================================

import type { Interventions, TreatmentAdequacy, TreatmentAnalysis } from "@/src/treatment/treatmentTypes";
import { INTERVENTION_LABELS } from "@/src/treatment/treatmentTypes";
import { ADEQUACY_MESSAGE } from "@/src/treatment/treatmentResponseProfiles";
import { resolveVitalProfileKey } from "@/src/vitals/vitalProfiles";
import type { VitalSet } from "@/src/vitals/vitalTypes";

export interface AnalyzeTreatmentInput {
  caso: any;
  interventions: Interventions;
  initialVitals: VitalSet;
  elapsedMinutes: number;
}

type IKey = keyof Interventions;

const THERAPEUTIC_KEYS: IKey[] = [
  "oxygen", "bronchodilator", "corticosteroid", "antibiotic", "antipyretic",
  "analgesic", "oralHydration", "ivFluids", "insulin", "glucose", "potassium", "aas",
  "nitrate", "anticoagulation", "monitoring", "hospitalization", "returnPrecautions", "avoidNsaid",
];

interface Rule {
  required: IKey[];
  partialAny: IKey[];
  danger: boolean;
  dangerLabel?: string;
}

/** Regras por perfil clínico. `required` conta para "adequada"; conforme sinais. */
function ruleFor(profileKey: string, iv: Interventions, v: VitalSet): Rule {
  const hypoxemic = v.spo2 < 94;
  const dengueDanger = iv.dangerousNsaidAspirinInDengue;
  const R = (required: IKey[], partialAny: IKey[] = [], danger = false, dangerLabel?: string): Rule => ({ required, partialAny, danger, dangerLabel });

  switch (profileKey) {
    case "asma_leve_moderada":
      return R([...(hypoxemic ? ["oxygen" as IKey] : []), "bronchodilator", "corticosteroid"], ["oxygen"]);
    case "asma_grave":
      return R(["bronchodilator", "corticosteroid", "oxygen"], ["hospitalization", "monitoring"]);
    case "dpoc_exacerbado":
      return R(["bronchodilator", "corticosteroid", ...(hypoxemic ? ["oxygen" as IKey] : [])], ["antibiotic", "hospitalization", "monitoring"]);
    case "pneumonia_leve":
      return R(["antibiotic"], ["antipyretic", "analgesic", "oralHydration", "returnPrecautions"]);
    case "pneumonia_grave":
      return R(["antibiotic", ...(hypoxemic ? ["oxygen" as IKey] : [])], ["hospitalization", "monitoring"]);
    case "sepse":
      return R(["antibiotic", "ivFluids"], ["hospitalization", "monitoring"]);
    case "dengue_sem_alarme":
      return R(["oralHydration", "avoidNsaid", "returnPrecautions"], ["monitoring"], dengueDanger, "AINE/AAS sem ressalva — risco de sangramento na dengue.");
    case "dengue_com_alarme":
      return R(["ivFluids", "avoidNsaid"], ["hospitalization", "monitoring", "oralHydration"], dengueDanger, "AINE/AAS sem ressalva — risco de sangramento na dengue com alarme.");
    case "iam_sca":
      return R(["hospitalization", "aas", "monitoring"], ["nitrate"]);
    case "insuficiencia_cardiaca":
      return R(["hospitalization", ...(hypoxemic ? ["oxygen" as IKey] : [])], ["monitoring"]);
    case "tep":
      return R(["hospitalization", ...(hypoxemic ? ["oxygen" as IKey] : [])], ["anticoagulation", "monitoring"]);
    case "crise_hipertensiva":
      return R(["monitoring"], ["hospitalization", "returnPrecautions"]);
    case "emergencia_hipertensiva":
      return R(["hospitalization", "monitoring"], ["nitrate", "analgesic"]);
    case "cetoacidose":
      return R(["ivFluids", "insulin"], ["potassium", "hospitalization", "monitoring"]);
    case "hipoglicemia":
      return R(["glucose"], ["oralHydration", "monitoring", "returnPrecautions"]);
    case "choque":
      return R(["hospitalization", "ivFluids"], ["oxygen", "monitoring", "antibiotic"]);
    case "hemorragia":
      return R(["hospitalization"], ["ivFluids", "monitoring"]);
    case "desidratacao":
      return R(["oralHydration"], ["ivFluids", "returnPrecautions", "monitoring"]);
    case "febre_virose":
      return R(["antipyretic", "returnPrecautions"], ["oralHydration", "analgesic"]);
    case "dor_aguda_sem_instabilidade":
      return R(["analgesic"], ["returnPrecautions", "monitoring"]);
    default: // normal_inespecifico
      return R([], ["returnPrecautions", "monitoring", "antipyretic", "analgesic", "oralHydration"]);
  }
}

export function analyzeTreatment({ caso, interventions: iv, initialVitals }: AnalyzeTreatmentInput): TreatmentAnalysis {
  const profileKey = resolveVitalProfileKey(caso);
  const rule = ruleFor(profileKey, iv, initialVitals);

  const hasAny = THERAPEUTIC_KEYS.some((k) => iv[k]);
  const requiredPresent = rule.required.filter((k) => iv[k]);
  const partialPresent = rule.partialAny.some((k) => iv[k]);
  const missingKeys = rule.required.filter((k) => !iv[k]);

  let adequacy: TreatmentAdequacy;
  if (rule.danger) {
    adequacy = "potencialmente_perigosa";
  } else if (!hasAny) {
    adequacy = "ausente";
  } else if (rule.required.length > 0 && requiredPresent.length === rule.required.length) {
    adequacy = "adequada";
  } else if (rule.required.length === 0 && (partialPresent || hasAny)) {
    // perfis de baixo risco sem "required": qualquer conduta pertinente basta.
    adequacy = partialPresent ? "adequada" : "parcial";
  } else if (requiredPresent.length > 0 || partialPresent) {
    adequacy = "parcial";
  } else {
    adequacy = "inadequada";
  }

  const recognized = THERAPEUTIC_KEYS.filter((k) => iv[k]).map((k) => INTERVENTION_LABELS[k]);
  const missing = missingKeys.map((k) => INTERVENTION_LABELS[k]);
  const dangers: string[] = [];
  if (rule.danger && rule.dangerLabel) dangers.push(rule.dangerLabel);

  return {
    adequacy,
    profileKey,
    interventions: iv,
    recognized,
    missing,
    dangers,
    message: ADEQUACY_MESSAGE[adequacy],
  };
}
