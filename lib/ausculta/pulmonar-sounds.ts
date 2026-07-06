// ============================================================================
// Ausculta pulmonar — ADAPTADOR sobre a ÚNICA fonte de verdade.
// ----------------------------------------------------------------------------
// Este módulo NÃO tem catálogo próprio. Ele apenas projeta os sons pulmonares
// de lib/clinical-sounds/soundsCatalog.ts (CLINICAL_SOUNDS) no formato usado
// pelo exame físico (LungSoundItem), preservando a API pública histórica
// (tipos, labels, seleção com fallback) para não quebrar o painel/mapeamento.
//
// Fluxo oficial: Caso → achado semiológico → tipo oficial → soundsCatalog → wav.
// Nenhum arquivo .wav é escolhido manualmente aqui.
// ============================================================================

import { CLINICAL_SOUNDS, type ClinicalSound } from "@/lib/clinical-sounds/soundsCatalog";

// Tipos reais (com áudio) + tipos de "silêncio didático" (sem áudio na base).
export type LungSoundType =
  | "normal"
  | "wheezing"
  | "rhonchi"
  | "fine_crackles"
  | "coarse_crackles"
  | "pleural_rub"
  | "mv_reduzido"
  | "mv_abolido";

export type LungAuscultationLocation = "RUA" | "LUA" | "RMA" | "LMA" | "RLA" | "LLA";

export type LungSoundItem = {
  id: string;
  gender: "M" | "F";
  type: LungSoundType;
  typeLabel: string;
  location: LungAuscultationLocation;
  locationLabel: string;
  audioUrl: string;
  // metadados de origem (para o player do OSCE — FASE 5)
  csvId: string;
  audioFile: string;
  sourceCsv: string;
  mappingType: ClinicalSound["mappingType"];
};

// originalType do catálogo (inglês) → tipo interno do exame físico.
const ORIGINAL_TO_TYPE: Record<string, LungSoundType> = {
  "Normal": "normal",
  "Wheezing": "wheezing",
  "Rhonchi": "rhonchi",
  "Fine Crackles": "fine_crackles",
  "Coarse Crackles": "coarse_crackles",
  "Pleural Rub": "pleural_rub",
};

export const LUNG_SOUND_TYPE_LABEL: Record<LungSoundType, string> = {
  normal: "Murmúrio vesicular normal",
  wheezing: "Sibilos",
  rhonchi: "Roncos",
  fine_crackles: "Crepitações finas",
  coarse_crackles: "Crepitações grossas",
  pleural_rub: "Atrito pleural",
  mv_reduzido: "Murmúrio vesicular reduzido",
  mv_abolido: "Murmúrio vesicular abolido",
};

// Tipos sem áudio real na base (silêncio didático — nunca tocam arquivo).
export const LUNG_SILENT_TYPES: ReadonlySet<LungSoundType> = new Set<LungSoundType>([
  "mv_reduzido",
  "mv_abolido",
]);

export const LOCATION_LABEL: Record<LungAuscultationLocation, string> = {
  RUA: "Região superior direita",
  LUA: "Região superior esquerda",
  RMA: "Região média direita",
  LMA: "Região média esquerda",
  RLA: "Base direita",
  LLA: "Base esquerda",
};

export const LOCATION_LABEL_FRASE: Record<LungAuscultationLocation, string> = {
  RUA: "campo superior direito",
  LUA: "campo superior esquerdo",
  RMA: "campo médio direito",
  LMA: "campo médio esquerdo",
  RLA: "base direita",
  LLA: "base esquerda",
};

const LOCS: LungAuscultationLocation[] = ["RUA", "LUA", "RMA", "LMA", "RLA", "LLA"];

// Projeção do catálogo canônico (categoria pulmonar) → LungSoundItem[].
export const LUNG_SOUNDS: LungSoundItem[] = CLINICAL_SOUNDS.filter(
  (s) => s.category === "lung"
).flatMap((s): LungSoundItem[] => {
  const type = ORIGINAL_TO_TYPE[s.originalType];
  if (!type) return [];
  if (!LOCS.includes(s.location as LungAuscultationLocation)) return [];
  return [
    {
      id: s.csvId,
      gender: s.gender,
      type,
      typeLabel: LUNG_SOUND_TYPE_LABEL[type],
      location: s.location as LungAuscultationLocation,
      locationLabel: LOCATION_LABEL[s.location as LungAuscultationLocation],
      audioUrl: s.audioUrl,
      csvId: s.csvId,
      audioFile: s.audioFile,
      sourceCsv: s.sourceCsv,
      mappingType: s.mappingType,
    },
  ];
});

export function obterSomNormalPorLocalizacao(params: {
  localizacao: LungAuscultationLocation;
  sexoPreferido?: "M" | "F";
}): LungSoundItem | null {
  const { localizacao, sexoPreferido } = params;
  if (sexoPreferido) {
    const ex = LUNG_SOUNDS.find(
      (s) => s.type === "normal" && s.location === localizacao && s.gender === sexoPreferido
    );
    if (ex) return ex;
  }
  return (
    LUNG_SOUNDS.find((s) => s.type === "normal" && s.location === localizacao) ??
    LUNG_SOUNDS.find((s) => s.type === "normal") ??
    null
  );
}

// Seleção com fallback. Tipos de SILÊNCIO retornam null (NUNCA caem em normal).
export function selecionarSomPulmonar(params: {
  tipo: LungSoundType;
  localizacao: LungAuscultationLocation;
  sexoPreferido?: "M" | "F";
}): LungSoundItem | null {
  const { tipo, localizacao, sexoPreferido } = params;

  if (LUNG_SILENT_TYPES.has(tipo)) return null;

  if (sexoPreferido) {
    const x = LUNG_SOUNDS.find(
      (s) => s.type === tipo && s.location === localizacao && s.gender === sexoPreferido
    );
    if (x) return x;
  }
  const x2 = LUNG_SOUNDS.find((s) => s.type === tipo && s.location === localizacao);
  if (x2) return x2;
  if (sexoPreferido) {
    const x3 = LUNG_SOUNDS.find((s) => s.type === tipo && s.gender === sexoPreferido);
    if (x3) return x3;
  }
  const x4 = LUNG_SOUNDS.find((s) => s.type === tipo);
  if (x4) return x4;
  return obterSomNormalPorLocalizacao({ localizacao, sexoPreferido });
}

if (typeof console !== "undefined" && LUNG_SOUNDS.length !== 50) {
  console.warn("[AUSCULTA PULMONAR] adaptador com", LUNG_SOUNDS.length, "sons (esperado 50 do catálogo)");
}
