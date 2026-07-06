// Módulo GASOMETRIA ARTERIAL — pH, PaCO2, PaO2, HCO3, SatO2, Lactato, BE.
import type { LabContext, LabPanelResult, ClinicalTag, Direcao } from "@/src/lab/labTypes";
import { REF } from "@/src/lab/labReferenceRanges";
import { gen } from "@/src/lab/labUtils";

type Prof = Partial<Record<"ph" | "paco2" | "pao2" | "hco3" | "sato2" | "lactato" | "be", Direcao>> & { obs: string[] };

export const GASO_PROFILES: Partial<Record<ClinicalTag, Prof>> = {
  pneumonia: { pao2: "baixo", sato2: "baixo", obs: ["Hipoxemia — insuficiência respiratória hipoxêmica (pneumonia)."] },
  asma: { pao2: "baixo", sato2: "baixo", paco2: "baixo", ph: "alto", obs: ["Hipoxemia com hipocapnia — hiperventilação na crise. PaCO2 normal/elevada indica gravidade."] },
  dpoc: { pao2: "baixo", sato2: "baixo", paco2: "muito_alto", ph: "baixo", hco3: "alto", obs: ["Acidose respiratória com retenção de CO2 e HCO3 elevado (compensação) — DPOC."] },
  tep: { pao2: "baixo", sato2: "baixo", paco2: "baixo", ph: "alto", obs: ["Hipoxemia com hipocapnia (hiperventilação) — compatível com TEP."] },
  sepse: { ph: "baixo", hco3: "muito_baixo", be: "muito_baixo", lactato: "muito_alto", pao2: "baixo", obs: ["Acidose metabólica com lactato elevado (hipoperfusão) — sepse."] },
  dka: { ph: "muito_baixo", hco3: "muito_baixo", be: "muito_baixo", paco2: "baixo", lactato: "alto", obs: ["Acidose metabólica com ânion-gap (cetoacidose): pH e HCO3 baixos, PaCO2 baixa (compensação respiratória)."] },
  ic: { pao2: "baixo", sato2: "baixo", obs: ["Hipoxemia leve — congestão pulmonar."] },
};

export function generateGasometry(ctx: LabContext): LabPanelResult {
  const p = GASO_PROFILES[ctx.tag] ?? { obs: ["Gasometria dentro dos parâmetros — sem distúrbio ácido-base evidente."] };
  const itens = [
    gen(ctx.rnd, "pH", REF.ph, p.ph ?? "normal"),
    gen(ctx.rnd, "PaCO₂", REF.paco2, p.paco2 ?? "normal"),
    gen(ctx.rnd, "PaO₂", REF.pao2, p.pao2 ?? "normal"),
    gen(ctx.rnd, "HCO₃⁻", REF.hco3, p.hco3 ?? "normal"),
    gen(ctx.rnd, "SatO₂", REF.sato2, p.sato2 ?? "normal"),
    gen(ctx.rnd, "Lactato", REF.lactato, p.lactato ?? "normal"),
    gen(ctx.rnd, "BE (excesso de base)", REF.be, p.be ?? "normal"),
  ];
  const alterado = itens.some((i) => i.flag);
  return { testId: "gasometry", titulo: "Gasometria Arterial", nivel: alterado ? ctx.gravidade : "normal", paciente: ctx.paciente, sections: [{ titulo: "Gasometria Arterial", itens }], observacoes: p.obs };
}
