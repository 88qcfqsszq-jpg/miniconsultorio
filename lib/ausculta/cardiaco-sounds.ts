// ============================================================================
// Ausculta cardíaca — ADAPTADOR sobre a ÚNICA fonte de verdade (soundsCatalog).
// Projeta os sons cardíacos (categoria "heart") no formato do exame físico.
// Sem catálogo próprio; nenhum .wav escolhido manualmente.
// ============================================================================

import { CLINICAL_SOUNDS, type ClinicalSound } from "@/lib/clinical-sounds/soundsCatalog";

export type HeartSoundType =
  | "normal"
  | "early_systolic_murmur"
  | "mid_systolic_murmur"
  | "late_systolic_murmur"
  | "late_diastolic_murmur"
  | "s3"
  | "s4"
  | "atrial_fibrillation"
  | "tachycardia"
  | "av_block"
  | "pericardial_rub"; // sem áudio na base (silêncio didático)

export type HeartFocus = "RUSB" | "LUSB" | "LLSB" | "Apex" | "RC" | "LC";

export type HeartSoundItem = {
  id: string;
  gender: "M" | "F";
  type: HeartSoundType;
  typeLabel: string;
  focus: HeartFocus;
  focusLabel: string;
  audioUrl: string;
  csvId: string;
  audioFile: string;
  sourceCsv: string;
  mappingType: ClinicalSound["mappingType"];
};

const ORIGINAL_TO_TYPE: Record<string, HeartSoundType> = {
  "Normal": "normal",
  "Early Systolic Murmur": "early_systolic_murmur",
  "Mid Systolic Murmur": "mid_systolic_murmur",
  "Late Systolic Murmur": "late_systolic_murmur",
  "Late Diastolic Murmur": "late_diastolic_murmur",
  "S3": "s3",
  "S4": "s4",
  "Atrial Fibrillation": "atrial_fibrillation",
  "Tachycardia": "tachycardia",
  "AV Block": "av_block",
};

export const HEART_SOUND_TYPE_LABEL: Record<HeartSoundType, string> = {
  normal: "Bulhas normais (B1/B2)",
  early_systolic_murmur: "Sopro protossistólico",
  mid_systolic_murmur: "Sopro mesossistólico",
  late_systolic_murmur: "Sopro sistólico tardio",
  late_diastolic_murmur: "Sopro diastólico",
  s3: "B3 (terceira bulha)",
  s4: "B4 (quarta bulha)",
  atrial_fibrillation: "Fibrilação atrial",
  tachycardia: "Taquicardia",
  av_block: "Bloqueio AV",
  pericardial_rub: "Atrito pericárdico",
};

export const HEART_SILENT_TYPES: ReadonlySet<HeartSoundType> = new Set<HeartSoundType>([
  "pericardial_rub",
]);

export const FOCUS_LABEL: Record<HeartFocus, string> = {
  RUSB: "Foco aórtico",
  LUSB: "Foco pulmonar",
  LLSB: "Foco tricúspide",
  Apex: "Foco mitral (ápice)",
  RC: "Carótida direita",
  LC: "Carótida esquerda",
};

// O catálogo (HS.csv) usa "Apex" na coluna Location; alguns arquivos usam "A".
function normFocus(loc: string): HeartFocus | null {
  if (loc === "A") return "Apex";
  if (["RUSB", "LUSB", "LLSB", "Apex", "RC", "LC"].includes(loc)) return loc as HeartFocus;
  return null;
}

export const HEART_SOUNDS: HeartSoundItem[] = CLINICAL_SOUNDS.filter(
  (s) => s.category === "heart"
).flatMap((s): HeartSoundItem[] => {
  const type = ORIGINAL_TO_TYPE[s.originalType];
  const focus = normFocus(s.location);
  if (!type || !focus) return [];
  return [
    {
      id: s.csvId,
      gender: s.gender,
      type,
      typeLabel: HEART_SOUND_TYPE_LABEL[type],
      focus,
      focusLabel: FOCUS_LABEL[focus],
      audioUrl: s.audioUrl,
      csvId: s.csvId,
      audioFile: s.audioFile,
      sourceCsv: s.sourceCsv,
      mappingType: s.mappingType,
    },
  ];
});

// Seleção com fallback. Tipos de SILÊNCIO retornam null (nunca caem em normal).
export function selecionarSomCardiaco(params: {
  tipo: HeartSoundType;
  foco: HeartFocus;
  sexoPreferido?: "M" | "F";
}): HeartSoundItem | null {
  const { tipo, foco, sexoPreferido } = params;
  if (HEART_SILENT_TYPES.has(tipo)) return null;

  if (sexoPreferido) {
    const x = HEART_SOUNDS.find((s) => s.type === tipo && s.focus === foco && s.gender === sexoPreferido);
    if (x) return x;
  }
  const x2 = HEART_SOUNDS.find((s) => s.type === tipo && s.focus === foco);
  if (x2) return x2;
  if (sexoPreferido) {
    const x3 = HEART_SOUNDS.find((s) => s.type === tipo && s.gender === sexoPreferido);
    if (x3) return x3;
  }
  const x4 = HEART_SOUNDS.find((s) => s.type === tipo);
  if (x4) return x4;
  // fallback final: normal no mesmo foco (só para tipos com áudio ausente pontual)
  return (
    HEART_SOUNDS.find((s) => s.type === "normal" && s.focus === foco) ??
    HEART_SOUNDS.find((s) => s.type === "normal") ??
    null
  );
}

if (typeof console !== "undefined" && HEART_SOUNDS.length !== 50) {
  console.warn("[AUSCULTA CARDÍACA] adaptador com", HEART_SOUNDS.length, "sons (esperado 50 do catálogo)");
}
