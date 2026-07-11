// ============================================================================
// Casos OSCE Dinâmicos — Beta · PULSE SCENARIO TEMPLATES (Fase 2.5)
// ----------------------------------------------------------------------------
// Templates CONCEITUAIS ligando um caso clínico a um cenário Pulse candidato.
// Não executam nada; orientam a criação de casos sincronizados com o motor.
// ============================================================================

import type { PulseCompatibilityStatus, PulseSuggestedProvider } from "../types";

export interface PulseScenarioTemplate {
  scenarioTemplateId: string;
  label: string;
  compatibility: PulseCompatibilityStatus;
  recommendedProvider: PulseSuggestedProvider;
  initialPhysiology: {
    fc: number;
    fr: number;
    paSys: number;
    paDia: number;
    spo2: number;
    temp: number;
    resumo: string;
  };
  requiredActions: string[];
  dangerousDelays: string[];
  pulseScenarioCandidates: string[];
  medixOverlayRequired: boolean;
  rubricImplications: string[];
}

const P = "data/human/adult/scenarios";

export const PULSE_SCENARIO_TEMPLATES: PulseScenarioTemplate[] = [
  {
    scenarioTemplateId: "asthma-severe-adult",
    label: "Asma grave (adulto)",
    compatibility: "strong",
    recommendedProvider: "hybrid",
    initialPhysiology: { fc: 118, fr: 34, paSys: 135, paDia: 85, spo2: 88, temp: 37.2, resumo: "Broncoespasmo grave, hipoxemia, fala entrecortada." },
    requiredActions: ["oxigenio", "salbutamol", "corticoide"],
    dangerousDelays: ["alta_precoce", "aguardar_exames"],
    pulseScenarioCandidates: [`${P}/patient/AsthmaAttackSevereAcute.json`],
    medixOverlayRequired: true,
    rubricImplications: ["Cobrar reconhecimento de gravidade e escalonamento; alta insegura = erro crítico."],
  },
  {
    scenarioTemplateId: "tension-pneumothorax-adult",
    label: "Pneumotórax hipertensivo (adulto)",
    compatibility: "strong",
    recommendedProvider: "hybrid",
    initialPhysiology: { fc: 130, fr: 32, paSys: 88, paDia: 60, spo2: 84, temp: 36.8, resumo: "Instabilidade, hipoxemia, hipotensão, desvio de traqueia." },
    requiredActions: ["descompressao_toracica", "oxigenio_alto_fluxo", "drenagem_toracica"],
    dangerousDelays: ["aguardar_exames"],
    pulseScenarioCandidates: [`${P}/patient/TensionPneumothoraxClosedVaried.json`],
    medixOverlayRequired: true,
    rubricImplications: ["Cobrar 'não atrasou descompressão'; aguardar RX piora SpO₂/PA = erro crítico salvador."],
  },
  {
    scenarioTemplateId: "copd-exacerbation-adult",
    label: "DPOC exacerbado (adulto)",
    compatibility: "strong",
    recommendedProvider: "hybrid",
    initialPhysiology: { fc: 104, fr: 28, paSys: 140, paDia: 84, spo2: 86, temp: 37.0, resumo: "Retenção de CO₂, sibilos, uso de musculatura acessória." },
    requiredActions: ["oxigenio", "salbutamol", "ipratropio", "corticoide"],
    dangerousDelays: ["oxigenio_alto_fluxo"],
    pulseScenarioCandidates: [`${P}/patient/COPDExacerbation.json`],
    medixOverlayRequired: true,
    rubricImplications: ["Alvo de SpO₂ controlado (88–92%); vigiar narcose por CO₂."],
  },
  {
    scenarioTemplateId: "pneumonia-severe-adult",
    label: "Pneumonia grave (adulto)",
    compatibility: "strong",
    recommendedProvider: "hybrid",
    initialPhysiology: { fc: 112, fr: 30, paSys: 100, paDia: 62, spo2: 89, temp: 38.7, resumo: "Consolidação, hipoxemia, febre." },
    requiredActions: ["oxigenio", "antibiotico", "monitorizacao"],
    dangerousDelays: ["alta_precoce"],
    pulseScenarioCandidates: [`${P}/patient/PneumoniaSevereRightLung.json`],
    medixOverlayRequired: true,
    rubricImplications: ["Antibiótico é conduta correta (efeito não fisiológico imediato no Pulse)."],
  },
  {
    scenarioTemplateId: "hemorrhagic-shock-adult",
    label: "Choque hemorrágico (adulto)",
    compatibility: "strong",
    recommendedProvider: "hybrid",
    initialPhysiology: { fc: 132, fr: 26, paSys: 82, paDia: 54, spo2: 95, temp: 36.4, resumo: "Hipovolemia, taquicardia, hipotensão." },
    requiredActions: ["fluidos_suporte", "transfusao", "monitorizacao"],
    dangerousDelays: ["aguardar_exames"],
    pulseScenarioCandidates: [`${P}/patient/HemorrhageToShock.json`],
    medixOverlayRequired: true,
    rubricImplications: ["Controle de sangramento + reposição; retardo piora MAP/volume."],
  },
  {
    scenarioTemplateId: "respiratory-failure-adult",
    label: "Insuficiência respiratória (adulto)",
    compatibility: "strong",
    recommendedProvider: "hybrid",
    initialPhysiology: { fc: 120, fr: 36, paSys: 110, paDia: 70, spo2: 82, temp: 37.1, resumo: "Fadiga respiratória, hipoxemia refratária." },
    requiredActions: ["oxigenio", "ventilacao_bvm", "intubacao", "ventilacao_mecanica"],
    dangerousDelays: ["aguardar_exames"],
    pulseScenarioCandidates: [`${P}/patient/ARDSExacerbation.json`],
    medixOverlayRequired: true,
    rubricImplications: ["Escalonar suporte ventilatório; reconhecer falência iminente."],
  },
  {
    scenarioTemplateId: "pediatric-bronchiolitis-medix-only",
    label: "Bronquiolite pediátrica (somente MEDIX)",
    compatibility: "not-supported",
    recommendedProvider: "medix-rule-based",
    initialPhysiology: { fc: 160, fr: 60, paSys: 90, paDia: 55, spo2: 89, temp: 37.8, resumo: "Lactente com desconforto respiratório." },
    requiredActions: ["oxigenio", "monitorizacao"],
    dangerousDelays: ["alta_precoce"],
    pulseScenarioCandidates: [],
    medixOverlayRequired: true,
    rubricImplications: ["Sem base pediátrica no Pulse; física por regras MEDIX pediátricas."],
  },
  {
    scenarioTemplateId: "pediatric-cyanotic-heart-disease-medix-only",
    label: "Cardiopatia congênita cianótica (somente MEDIX)",
    compatibility: "not-supported",
    recommendedProvider: "medix-rule-based",
    initialPhysiology: { fc: 150, fr: 45, paSys: 85, paDia: 50, spo2: 80, temp: 36.9, resumo: "Baseline de SpO₂ reduzido; crise hipercianótica." },
    requiredActions: ["oxigenio", "monitorizacao"],
    dangerousDelays: [],
    pulseScenarioCandidates: [],
    medixOverlayRequired: true,
    rubricImplications: ["Nunca direto no Pulse; exige adaptador de segurança pediátrico."],
  },
];

export function getPulseScenarioTemplate(id: string): PulseScenarioTemplate | undefined {
  return PULSE_SCENARIO_TEMPLATES.find((t) => t.scenarioTemplateId === id);
}
