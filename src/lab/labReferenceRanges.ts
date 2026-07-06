// ============================================================================
// LaboratoryEngine — FAIXAS DE REFERÊNCIA por analito
// ----------------------------------------------------------------------------
// kind: "h" = homeostático (variação ADITIVA em torno da faixa) · "m" = marcador
// (eleva MULTIPLICATIVAMENTE, ex.: PCR/troponina/D-dímero). Didático/genérico.
// ============================================================================

export interface Ref {
  lo: number;
  hi: number;
  un: string;
  dec: number;
  kind: "h" | "m";
  clampMin?: number;
  clampMax?: number;
}

export const REF: Record<string, Ref> = {
  // Função renal
  ureia: { lo: 15, hi: 45, un: "mg/dL", dec: 0, kind: "m", clampMin: 5 },
  creatinina_m: { lo: 0.7, hi: 1.3, un: "mg/dL", dec: 2, kind: "m", clampMin: 0.3 },
  creatinina_f: { lo: 0.6, hi: 1.1, un: "mg/dL", dec: 2, kind: "m", clampMin: 0.3 },

  // Eletrólitos
  sodio: { lo: 135, hi: 145, un: "mEq/L", dec: 0, kind: "h", clampMin: 110, clampMax: 165 },
  potassio: { lo: 3.5, hi: 5.0, un: "mEq/L", dec: 1, kind: "h", clampMin: 1.8, clampMax: 8.5 },
  cloro: { lo: 98, hi: 107, un: "mEq/L", dec: 0, kind: "h", clampMin: 80, clampMax: 125 },
  magnesio: { lo: 1.6, hi: 2.6, un: "mg/dL", dec: 1, kind: "h", clampMin: 0.8, clampMax: 4 },
  calcio: { lo: 8.5, hi: 10.5, un: "mg/dL", dec: 1, kind: "h", clampMin: 5, clampMax: 14 },

  // Marcadores inflamatórios
  pcr: { lo: 0, hi: 5, un: "mg/L", dec: 1, kind: "m" },
  vhs: { lo: 0, hi: 20, un: "mm/h", dec: 0, kind: "m" },
  procalcitonina: { lo: 0, hi: 0.5, un: "ng/mL", dec: 2, kind: "m" },

  // Gasometria arterial
  ph: { lo: 7.35, hi: 7.45, un: "", dec: 2, kind: "h", clampMin: 6.85, clampMax: 7.7 },
  paco2: { lo: 35, hi: 45, un: "mmHg", dec: 0, kind: "h", clampMin: 18, clampMax: 90 },
  pao2: { lo: 80, hi: 100, un: "mmHg", dec: 0, kind: "h", clampMin: 35, clampMax: 130 },
  hco3: { lo: 22, hi: 26, un: "mEq/L", dec: 0, kind: "h", clampMin: 5, clampMax: 40 },
  sato2: { lo: 95, hi: 99, un: "%", dec: 0, kind: "h", clampMin: 60, clampMax: 100 },
  lactato: { lo: 0.5, hi: 2.0, un: "mmol/L", dec: 1, kind: "m", clampMin: 0.3 },
  be: { lo: -3, hi: 3, un: "mEq/L", dec: 0, kind: "h", clampMin: -25, clampMax: 20 },

  // Marcadores cardíacos
  troponina: { lo: 0, hi: 0.04, un: "ng/mL", dec: 3, kind: "m" },
  ckmb: { lo: 0, hi: 5, un: "ng/mL", dec: 1, kind: "m" },
  bnp: { lo: 0, hi: 100, un: "pg/mL", dec: 0, kind: "m" },

  // Função hepática
  ast: { lo: 10, hi: 40, un: "U/L", dec: 0, kind: "m" },
  alt: { lo: 10, hi: 40, un: "U/L", dec: 0, kind: "m" },
  fa: { lo: 40, hi: 120, un: "U/L", dec: 0, kind: "m" },
  ggt: { lo: 10, hi: 60, un: "U/L", dec: 0, kind: "m" },
  bt: { lo: 0.2, hi: 1.2, un: "mg/dL", dec: 1, kind: "m", clampMin: 0.1 },
  bd: { lo: 0.0, hi: 0.3, un: "mg/dL", dec: 1, kind: "m" },
  bi: { lo: 0.2, hi: 0.9, un: "mg/dL", dec: 1, kind: "m" },
  albumina: { lo: 3.5, hi: 5.0, un: "g/dL", dec: 1, kind: "h", clampMin: 1.5, clampMax: 5.5 },

  // Coagulograma
  tp: { lo: 11, hi: 14, un: "s", dec: 1, kind: "h", clampMin: 9, clampMax: 40 },
  inr: { lo: 0.9, hi: 1.2, un: "", dec: 1, kind: "h", clampMin: 0.8, clampMax: 8 },
  ttpa: { lo: 25, hi: 38, un: "s", dec: 0, kind: "h", clampMin: 18, clampMax: 120 },
  fibrinogenio: { lo: 200, hi: 400, un: "mg/dL", dec: 0, kind: "h", clampMin: 40, clampMax: 900 },
  ddimero: { lo: 0, hi: 500, un: "ng/mL", dec: 0, kind: "m" },

  // Urina tipo 1 (parte numérica)
  densidade: { lo: 1.005, hi: 1.03, un: "", dec: 3, kind: "h", clampMin: 1.0, clampMax: 1.045 },
  urina_ph: { lo: 5.0, hi: 7.0, un: "", dec: 1, kind: "h", clampMin: 4.5, clampMax: 8.5 },
};
