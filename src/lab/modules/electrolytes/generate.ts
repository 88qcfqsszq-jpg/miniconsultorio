// Módulo ELETRÓLITOS — Sódio, Potássio, Cloro, Magnésio, Cálcio.
import type { LabContext, LabPanelResult, ClinicalTag, Direcao } from "@/src/lab/labTypes";
import { REF } from "@/src/lab/labReferenceRanges";
import { gen } from "@/src/lab/labUtils";

type Prof = { sodio?: Direcao; potassio?: Direcao; cloro?: Direcao; magnesio?: Direcao; calcio?: Direcao; obs: string[] };

export const ELECTRO_PROFILES: Partial<Record<ClinicalTag, Prof>> = {
  dka: { sodio: "baixo", potassio: "alto", obs: ["Hiponatremia (pseudo-hiponatremia por hiperglicemia) e potássio no limite/elevado — atenção ao K com a insulinoterapia."] },
  desidratacao: { potassio: "baixo", cloro: "baixo", magnesio: "baixo", obs: ["Hipopotassemia e hipocloremia — compatível com perdas (vômitos/desidratação)."] },
  irc: { potassio: "alto", calcio: "baixo", obs: ["Hipercalemia e hipocalcemia — distúrbios da doença renal crônica."] },
  sepse: { sodio: "baixo", magnesio: "baixo", obs: ["Distúrbios eletrolíticos leves no contexto de sepse."] },
  ic: { sodio: "baixo", potassio: "baixo", obs: ["Hiponatremia e hipopotassemia — frequentes na IC/uso de diuréticos."] },
};

export function generateElectrolytes(ctx: LabContext): LabPanelResult {
  const p = ELECTRO_PROFILES[ctx.tag] ?? { obs: ["Eletrólitos dentro dos parâmetros de referência."] };
  const itens = [
    gen(ctx.rnd, "Sódio (Na⁺)", REF.sodio, p.sodio ?? "normal"),
    gen(ctx.rnd, "Potássio (K⁺)", REF.potassio, p.potassio ?? "normal"),
    gen(ctx.rnd, "Cloro (Cl⁻)", REF.cloro, p.cloro ?? "normal"),
    gen(ctx.rnd, "Magnésio", REF.magnesio, p.magnesio ?? "normal"),
    gen(ctx.rnd, "Cálcio total", REF.calcio, p.calcio ?? "normal"),
  ];
  const alterado = itens.some((i) => i.flag);
  return { testId: "electrolytes", titulo: "Eletrólitos", nivel: alterado ? ctx.gravidade : "normal", paciente: ctx.paciente, sections: [{ titulo: "Eletrólitos", itens }], observacoes: p.obs };
}
