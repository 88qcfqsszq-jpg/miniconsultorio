// ============================================================================
// Casos OSCE Dinâmicos — Beta · PULSE CAPABILITY MAP (Fase 2.5)
// ----------------------------------------------------------------------------
// Mapa DECLARATIVO do que o Pulse Physiology Engine (engine-stable) suporta
// para os nossos casos. NÃO executa C++, NÃO chama binário. É só conhecimento
// derivado do RELATORIO-MAPEAMENTO-ENGINE-STABLE e da inspeção dos cenários
// reais em data/human/adult/scenarios.
// ============================================================================

import type {
  PulseCompatibilityStatus,
  PulseSuggestedProvider,
} from "../types";

export interface PulseCapabilityEntry {
  conditionId: string;
  label: string;
  compatibility: PulseCompatibilityStatus;
  rationale: string;
  requiresMedixOverlay: boolean;
  pediatricSafetyAdapterRequired: boolean;
  suggestedSimulationProvider: PulseSuggestedProvider;
  /** Caminhos de cenário reais no engine-stable (referência, não execução). */
  pulseScenarioCandidates: string[];
  recommendedForBeta: boolean;
}

const P = "data/human/adult/scenarios";

export const PULSE_CAPABILITY_MAP: PulseCapabilityEntry[] = [
  // ---- STRONG -------------------------------------------------------------
  {
    conditionId: "asthma-severe-adult",
    label: "Asma aguda grave (adulto)",
    compatibility: "strong",
    rationale: "AsthmaAttack + Albuterol/InhalerConfiguration com saídas de resistência, broncodilatação e SpO₂.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "hybrid",
    pulseScenarioCandidates: [
      `${P}/patient/AsthmaAttackSevereAcute.json`,
      `${P}/patient/AsthmaAttackLifeThreateningAcute.json`,
    ],
    recommendedForBeta: true,
  },
  {
    conditionId: "tension-pneumothorax-adult",
    label: "Pneumotórax hipertensivo (adulto)",
    compatibility: "strong",
    rationale: "TensionPneumothorax + NeedleDecompression; atraso piora SpO₂/PA de forma demonstrável.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "hybrid",
    pulseScenarioCandidates: [
      `${P}/patient/TensionPneumothoraxClosedVaried.json`,
      `${P}/patient/TensionPneumothoraxOpenVaried.json`,
      `${P}/patient/TensionPneumothoraxBilateral.json`,
    ],
    recommendedForBeta: true,
  },
  {
    conditionId: "copd-exacerbation-adult",
    label: "DPOC exacerbado (adulto)",
    compatibility: "strong",
    rationale: "COPDExacerbation + SupplementalOxygen; resistência/complacência e retenção de CO₂.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "hybrid",
    pulseScenarioCandidates: [
      `${P}/patient/COPDExacerbation.json`,
      `${P}/patient/COPDSevereEmphysema.json`,
    ],
    recommendedForBeta: true,
  },
  {
    conditionId: "pneumonia-severe-adult",
    label: "Pneumonia grave / insuficiência respiratória (adulto)",
    compatibility: "strong",
    rationale: "PneumoniaExacerbation + O₂/ventilação; Horowitz/PaO₂-FiO₂, shunt, V/Q.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "hybrid",
    pulseScenarioCandidates: [
      `${P}/patient/PneumoniaSevereRightLung.json`,
      `${P}/patient/PneumoniaSevereLeftLobe.json`,
    ],
    recommendedForBeta: true,
  },
  {
    conditionId: "ards-adult",
    label: "ARDS / insuficiência respiratória grave (adulto)",
    compatibility: "strong",
    rationale: "ARDSExacerbation + MechanicalVentilator/ECMO; PEEP, complacência, PaO₂/FiO₂.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "hybrid",
    pulseScenarioCandidates: [
      `${P}/patient/ARDSExacerbation.json`,
      `${P}/patient/ARDSModerateBothLungs.json`,
    ],
    recommendedForBeta: false, // forte, porém mais complexo (ventilação)
  },
  {
    conditionId: "hemorrhagic-shock-adult",
    label: "Hemorragia / choque hipovolêmico (adulto)",
    compatibility: "strong",
    rationale: "Hemorrhage + fluidos/transfusão; volume, débito cardíaco, MAP, perda total.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "hybrid",
    pulseScenarioCandidates: [
      `${P}/patient/HemorrhageToShock.json`,
      `${P}/patient/HemorrhageClass3PackedRBC.json`,
    ],
    recommendedForBeta: true,
  },
  {
    conditionId: "ventilation-oxygen-support",
    label: "Ventilação / oxigênio / BVM (suporte)",
    compatibility: "strong",
    rationale: "SupplementalOxygen, BagValveMask, MechanicalVentilator como equipamentos suportados.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "hybrid",
    pulseScenarioCandidates: [
      `${P}/equipment/`,
    ],
    recommendedForBeta: false,
  },
  {
    conditionId: "acls-arrhythmia-adult",
    label: "ACLS / ritmos / parada (adulto)",
    compatibility: "strong",
    rationale: "Arrhythmia + ChestCompression; útil para ritmo/parada, exige UI própria de ACLS.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "hybrid",
    pulseScenarioCandidates: [
      `${P}/acls/`,
    ],
    recommendedForBeta: false,
  },

  // ---- MEDIUM -------------------------------------------------------------
  {
    conditionId: "pe-with-repercussion",
    label: "TEP com repercussão",
    compatibility: "medium",
    rationale: "Repercussão hemodinâmica/respiratória aproximável, mas sem ação específica de TEP.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "hybrid",
    pulseScenarioCandidates: [],
    recommendedForBeta: false,
  },
  {
    conditionId: "sepsis-septic-shock",
    label: "Sepse / choque séptico",
    compatibility: "medium",
    rationale: "Sepsis existe como condição; cenário menos rico — precisa overlay clínico MEDIX.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "hybrid",
    pulseScenarioCandidates: [`${P}/patient/Sepsis.json`],
    recommendedForBeta: false,
  },
  {
    conditionId: "dehydration-hypovolemia",
    label: "Desidratação / hipovolemia",
    compatibility: "medium",
    rationale: "Condições de hidratação e consumo de fluidos; volume/pressão/FC respondem.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "hybrid",
    pulseScenarioCandidates: [`${P}/nutrition/`],
    recommendedForBeta: false,
  },
  {
    conditionId: "respiratory-failure-nonspecific",
    label: "Insuficiência respiratória inespecífica",
    compatibility: "medium",
    rationale: "Obstrução/broncoconstrição/fadiga disponíveis; precisa amarração clínica MEDIX.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "hybrid",
    pulseScenarioCandidates: [`${P}/miscellaneous/`],
    recommendedForBeta: false,
  },

  // ---- WEAK ---------------------------------------------------------------
  {
    conditionId: "sca-iam-full-osce",
    label: "SCA / IAM como OSCE completo",
    compatibility: "weak",
    rationale: "Pulse não modela toda a lógica diagnóstica/terapêutica da SCA; usar rule-based.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "medix-rule-based",
    pulseScenarioCandidates: [],
    recommendedForBeta: false,
  },
  {
    conditionId: "chronic-valvular-disease",
    label: "Valvopatias crônicas",
    compatibility: "weak",
    rationale: "Sem modelagem valvar específica adequada a OSCE.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "medix-rule-based",
    pulseScenarioCandidates: [],
    recommendedForBeta: false,
  },
  {
    conditionId: "chronic-heart-failure",
    label: "Insuficiência cardíaca crônica",
    compatibility: "weak",
    rationale: "Só se limitada a vitais e resposta hemodinâmica simples; rubrica clínica em MEDIX.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "medix-rule-based",
    pulseScenarioCandidates: [],
    recommendedForBeta: false,
  },
  {
    conditionId: "pediatric-congenital-heart-overlay",
    label: "Cardiopatia congênita pediátrica (apenas com overlay)",
    compatibility: "weak",
    rationale: "Sem base pediátrica no engine; apenas overlay MEDIX + adaptador de segurança.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: true,
    suggestedSimulationProvider: "medix-rule-based",
    pulseScenarioCandidates: [],
    recommendedForBeta: false,
  },

  // ---- NOT-SUPPORTED ------------------------------------------------------
  {
    conditionId: "pediatric-without-safety-adapter",
    label: "Pediatria sem adaptador de segurança",
    compatibility: "not-supported",
    rationale: "Não há base pediátrica equivalente no engine-stable; exige adaptador validado.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: true,
    suggestedSimulationProvider: "medix-rule-based",
    pulseScenarioCandidates: [],
    recommendedForBeta: false,
  },
  {
    conditionId: "pediatric-cyanotic-congenital-direct",
    label: "Cardiopatia congênita cianótica pediátrica direta",
    compatibility: "not-supported",
    rationale: "Fora do escopo do engine adulto; nunca direto no Pulse.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: true,
    suggestedSimulationProvider: "medix-rule-based",
    pulseScenarioCandidates: [],
    recommendedForBeta: false,
  },
  {
    conditionId: "arboviruses-dengue",
    label: "Dengue / arboviroses (zika, chikungunya, febre amarela)",
    compatibility: "not-supported",
    rationale: "Sem modelo infeccioso específico; manter rule-based por regras clínicas.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "medix-rule-based",
    pulseScenarioCandidates: [],
    recommendedForBeta: false,
  },
  {
    conditionId: "rheumatic-fever",
    label: "Febre reumática",
    compatibility: "not-supported",
    rationale: "Sem modelagem específica; caso clínico por regras.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "medix-rule-based",
    pulseScenarioCandidates: [],
    recommendedForBeta: false,
  },
  {
    conditionId: "iron-deficiency-anemia-full-sim",
    label: "Anemia ferropriva (simulação fisiológica completa)",
    compatibility: "not-supported",
    rationale: "Anemia30 existe mas não substitui caso hematológico completo.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "medix-rule-based",
    pulseScenarioCandidates: [],
    recommendedForBeta: false,
  },
  {
    conditionId: "immune-thrombocytopenia-itp",
    label: "Trombocitopenia imune (ITP)",
    compatibility: "not-supported",
    rationale: "Sem modelagem hematológica adequada.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "medix-rule-based",
    pulseScenarioCandidates: [],
    recommendedForBeta: false,
  },
  {
    conditionId: "puericultura",
    label: "Puericultura",
    compatibility: "not-supported",
    rationale: "Predominantemente desenvolvimento/orientação; não é fisiologia aguda.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: true,
    suggestedSimulationProvider: "medix-rule-based",
    pulseScenarioCandidates: [],
    recommendedForBeta: false,
  },
  {
    conditionId: "maus-tratos",
    label: "Maus-tratos",
    compatibility: "not-supported",
    rationale: "Caso social/comunicacional/proteção; não é simulação fisiológica.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "medix-rule-based",
    pulseScenarioCandidates: [],
    recommendedForBeta: false,
  },
  {
    conditionId: "communicational-social-cases",
    label: "Casos predominantemente comunicacionais/sociais",
    compatibility: "not-supported",
    rationale: "Avaliação é comunicação/ética; Pulse não agrega.",
    requiresMedixOverlay: true,
    pediatricSafetyAdapterRequired: false,
    suggestedSimulationProvider: "medix-rule-based",
    pulseScenarioCandidates: [],
    recommendedForBeta: false,
  },
];

/** Busca uma entrada de capacidade por conditionId. */
export function getPulseCapability(conditionId: string): PulseCapabilityEntry | undefined {
  return PULSE_CAPABILITY_MAP.find((e) => e.conditionId === conditionId);
}
