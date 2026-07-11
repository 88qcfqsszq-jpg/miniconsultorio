// ============================================================================
// Casos OSCE Dinâmicos — Beta · PULSE OUTPUT MAP (Fase 2.5)
// ----------------------------------------------------------------------------
// Mapeia saídas fisiológicas do Pulse (nomes reais de DataRequest do
// engine-stable) para o estado clínico MEDIX. Quando não há saída direta, o
// campo é derivado por regras MEDIX (derivedByMedix=true).
// ============================================================================

export interface PulseOutputEntry {
  pulseOutputName: string;
  medixField: string;
  unit: string;
  normalRangeAdult: [number, number] | null;
  pediatricCaution: string;
  derivedByMedix: boolean;
  interpretationRules: string[];
}

export const PULSE_OUTPUT_MAP: PulseOutputEntry[] = [
  {
    pulseOutputName: "HeartRate",
    medixField: "frequenciaCardiaca",
    unit: "bpm",
    normalRangeAdult: [60, 100],
    pediatricCaution: "Faixas variam muito por idade — não usar faixa adulta.",
    derivedByMedix: false,
    interpretationRules: ["> 120 = taquicardia importante", "< 50 = bradicardia"],
  },
  {
    pulseOutputName: "RespirationRate",
    medixField: "frequenciaRespiratoria",
    unit: "irpm",
    normalRangeAdult: [12, 20],
    pediatricCaution: "Neonato/lactente têm FR basal maior.",
    derivedByMedix: false,
    interpretationRules: ["> 30 = taquipneia importante", "< 8 = risco de falência ventilatória"],
  },
  {
    pulseOutputName: "SystolicArterialPressure",
    medixField: "pressaoSistolica",
    unit: "mmHg",
    normalRangeAdult: [100, 140],
    pediatricCaution: "Usar percentis por idade/altura.",
    derivedByMedix: false,
    interpretationRules: ["< 90 = instabilidade/choque"],
  },
  {
    pulseOutputName: "DiastolicArterialPressure",
    medixField: "pressaoDiastolica",
    unit: "mmHg",
    normalRangeAdult: [60, 90],
    pediatricCaution: "Usar percentis por idade/altura.",
    derivedByMedix: false,
    interpretationRules: ["Compor com sistólica e MAP."],
  },
  {
    pulseOutputName: "MeanArterialPressure",
    medixField: "pressaoArterialMedia",
    unit: "mmHg",
    normalRangeAdult: [70, 105],
    pediatricCaution: "Alvo de MAP varia por idade.",
    derivedByMedix: false,
    interpretationRules: ["< 65 = hipoperfusão"],
  },
  {
    pulseOutputName: "OxygenSaturation",
    medixField: "saturacaoOxigenio",
    unit: "%",
    normalRangeAdult: [95, 100],
    pediatricCaution: "Cardiopatia cianótica tem baseline menor.",
    derivedByMedix: false,
    interpretationRules: ["< 90 = hipoxemia", "< 85 = hipoxemia grave"],
  },
  {
    pulseOutputName: "CoreTemperature",
    medixField: "temperatura",
    unit: "°C",
    normalRangeAdult: [36, 37.5],
    pediatricCaution: "Risco de hipotermia maior em neonato.",
    derivedByMedix: false,
    interpretationRules: ["> 38 = febre", "< 35 = hipotermia"],
  },
  {
    pulseOutputName: "BloodPH",
    medixField: "gasometria.pH",
    unit: "",
    normalRangeAdult: [7.35, 7.45],
    pediatricCaution: "Faixa semelhante; contexto muda.",
    derivedByMedix: false,
    interpretationRules: ["< 7.35 = acidose", "> 7.45 = alcalose"],
  },
  {
    // Sem output arterial direto: aproximar por compartimento Aorta/CO2/PartialPressure.
    pulseOutputName: "Aorta/CarbonDioxide/PartialPressure",
    medixField: "gasometria.pCO2",
    unit: "mmHg",
    normalRangeAdult: [35, 45],
    pediatricCaution: "Interpretar com o quadro respiratório.",
    derivedByMedix: false,
    interpretationRules: ["Subindo + fadiga = falência ventilatória possível"],
  },
  {
    pulseOutputName: "Aorta/Oxygen/PartialPressure",
    medixField: "gasometria.pO2",
    unit: "mmHg",
    normalRangeAdult: [80, 100],
    pediatricCaution: "Contexto de cardiopatia altera baseline.",
    derivedByMedix: false,
    interpretationRules: ["< 60 = insuficiência respiratória hipoxêmica"],
  },
  {
    // Não há output direto simples nos DataRequests padrão → derivar em MEDIX.
    pulseOutputName: "Bicarbonate",
    medixField: "gasometria.HCO3",
    unit: "mEq/L",
    normalRangeAdult: [22, 26],
    pediatricCaution: "—",
    derivedByMedix: true,
    interpretationRules: ["Derivar de pH/PaCO₂ ou estimar em MEDIX."],
  },
  {
    pulseOutputName: "Lactate",
    medixField: "gasometria.lactato",
    unit: "mmol/L",
    normalRangeAdult: [0.5, 2],
    pediatricCaution: "—",
    derivedByMedix: true,
    interpretationRules: ["> 2 = hipoperfusão; se indisponível, derivar por regra MEDIX."],
  },
  {
    pulseOutputName: "HorowitzIndex",
    medixField: "oxigenacao.pafi",
    unit: "mmHg",
    normalRangeAdult: [400, 500],
    pediatricCaution: "—",
    derivedByMedix: false,
    interpretationRules: ["< 300 = lesão pulmonar; < 200 = ARDS grave"],
  },
  {
    pulseOutputName: "(sem output direto)",
    medixField: "nivelConsciencia",
    unit: "",
    normalRangeAdult: null,
    pediatricCaution: "Escala pediátrica própria.",
    derivedByMedix: true,
    interpretationRules: ["Derivar em MEDIX a partir de SpO₂/perfusão/tendência."],
  },
  {
    pulseOutputName: "InspiratoryRespiratoryResistance",
    medixField: "trabalhoRespiratorio",
    unit: "cmH2O/L/s",
    normalRangeAdult: null,
    pediatricCaution: "—",
    derivedByMedix: true,
    interpretationRules: ["Alta resistência → maior trabalho respiratório (derivar rótulo em MEDIX)."],
  },
  {
    pulseOutputName: "(derivado)",
    medixField: "perfusao",
    unit: "",
    normalRangeAdult: null,
    pediatricCaution: "—",
    derivedByMedix: true,
    interpretationRules: ["Derivar de MAP/CardiacOutput/enchimento capilar."],
  },
];

/** Campos vitais centrais que qualquer caso Pulse-ready deve cobrir. */
export const VITAIS_CENTRAIS_MEDIX = [
  "frequenciaCardiaca",
  "frequenciaRespiratoria",
  "pressaoSistolica",
  "saturacaoOxigenio",
] as const;

/** Busca o mapeamento por nome de output do Pulse. */
export function getPulseOutput(pulseOutputName: string): PulseOutputEntry | undefined {
  return PULSE_OUTPUT_MAP.find((e) => e.pulseOutputName === pulseOutputName);
}

/** Todos os medixFields cobertos pelo mapa. */
export function medixFieldsCobertos(): string[] {
  return PULSE_OUTPUT_MAP.map((e) => e.medixField);
}
