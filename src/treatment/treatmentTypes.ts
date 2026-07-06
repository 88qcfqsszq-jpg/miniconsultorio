// ============================================================================
// TreatmentResponseEngine — TIPOS
// ----------------------------------------------------------------------------
// Camada que lê a conduta registrada pelo aluno (texto livre), extrai as
// intervenções, avalia a adequação e MODULA a resposta fisiológica dos sinais
// vitais de saída. Educacional: orienta, não substitui o raciocínio clínico.
// ============================================================================

export interface Interventions {
  oxygen: boolean;
  bronchodilator: boolean;
  corticosteroid: boolean;
  antibiotic: boolean;
  antipyretic: boolean;
  analgesic: boolean;
  oralHydration: boolean;
  ivFluids: boolean;
  insulin: boolean;
  glucose: boolean;
  potassium: boolean;
  aas: boolean;
  nitrate: boolean;
  anticoagulation: boolean;
  monitoring: boolean;
  hospitalization: boolean;
  returnPrecautions: boolean;
  avoidNsaid: boolean;
  /** AINE/AAS presentes SEM ressalva de evitar — perigoso em dengue. */
  dangerousNsaidAspirinInDengue: boolean;
}

/** Resposta terapêutica observada (entrada → saída), independente da adequação. */
export type TherapeuticResponse = "boa_resposta" | "resposta_parcial" | "sem_resposta" | "piora_clinica";

export const THERAPEUTIC_RESPONSE_LABEL: Record<TherapeuticResponse, string> = {
  boa_resposta: "Boa resposta terapêutica",
  resposta_parcial: "Resposta parcial",
  sem_resposta: "Sem resposta",
  piora_clinica: "Piora clínica",
};

export type TreatmentAdequacy =
  | "adequada"
  | "parcial"
  | "inadequada"
  | "ausente"
  | "potencialmente_perigosa";

export interface TreatmentAnalysis {
  adequacy: TreatmentAdequacy;
  profileKey: string;
  interventions: Interventions;
  /** Rótulos das intervenções reconhecidas na conduta. */
  recognized: string[];
  /** Rótulos de intervenções esperadas e ausentes (educacional). */
  missing: string[];
  /** Alertas / elementos de risco na conduta. */
  dangers: string[];
  /** Mensagem educativa (não acusatória). */
  message: string;
}

/** Rótulos legíveis das intervenções (pt-BR). */
export const INTERVENTION_LABELS: Record<keyof Interventions, string> = {
  oxygen: "oxigênio suplementar",
  bronchodilator: "broncodilatador",
  corticosteroid: "corticoide",
  antibiotic: "antibiótico",
  antipyretic: "antitérmico",
  analgesic: "analgesia",
  oralHydration: "hidratação oral",
  ivFluids: "hidratação venosa",
  insulin: "insulina",
  glucose: "glicose / correção de hipoglicemia",
  potassium: "reposição de potássio/eletrólitos",
  aas: "AAS",
  nitrate: "nitrato",
  anticoagulation: "anticoagulação",
  monitoring: "monitorização/observação",
  hospitalization: "encaminhamento/internação hospitalar",
  returnPrecautions: "orientação de sinais de alarme/retorno",
  avoidNsaid: "orientação de evitar AINE/AAS",
  dangerousNsaidAspirinInDengue: "AINE/AAS sem ressalva (risco em dengue)",
};

export function emptyInterventions(): Interventions {
  return {
    oxygen: false,
    bronchodilator: false,
    corticosteroid: false,
    antibiotic: false,
    antipyretic: false,
    analgesic: false,
    oralHydration: false,
    ivFluids: false,
    insulin: false,
    glucose: false,
    potassium: false,
    aas: false,
    nitrate: false,
    anticoagulation: false,
    monitoring: false,
    hospitalization: false,
    returnPrecautions: false,
    avoidNsaid: false,
    dangerousNsaidAspirinInDengue: false,
  };
}
