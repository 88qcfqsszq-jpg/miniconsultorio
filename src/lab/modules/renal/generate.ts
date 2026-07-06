// Módulo RENAL — perfis + gerador. Analitos: Ureia, Creatinina, TFG estimada.
import type { LabContext, LabPanelResult, ClinicalTag, Direcao } from "@/src/lab/labTypes";
import { REF } from "@/src/lab/labReferenceRanges";
import { mkValue, analyteFrom, fmt } from "@/src/lab/labUtils";

type Prof = { ureia?: Direcao; creatinina?: Direcao; obs: string[] };

export const RENAL_PROFILES: Partial<Record<ClinicalTag, Prof>> = {
  desidratacao: { ureia: "muito_alto", creatinina: "alto", obs: ["Elevação de ureia desproporcional à creatinina — padrão pré-renal (desidratação)."] },
  dka: { ureia: "alto", creatinina: "alto", obs: ["Azotemia pré-renal por desidratação (cetoacidose)."] },
  irc: { ureia: "alto", creatinina: "muito_alto", obs: ["Redução importante da TFG estimada — compatível com doença renal crônica."] },
  sepse: { ureia: "alto", creatinina: "alto", obs: ["Elevação de escórias nitrogenadas — disfunção renal aguda no contexto de sepse."] },
  pielonefrite: { obs: ["Função renal preservada — reavaliar se houver sinais de gravidade."] },
};

export function generateRenal(ctx: LabContext): LabPanelResult {
  const p = RENAL_PROFILES[ctx.tag] ?? { obs: ["Ureia e creatinina dentro dos parâmetros — função renal preservada."] };
  const creatRef = ctx.sexo === "F" ? REF.creatinina_f : REF.creatinina_m;
  const ureia = mkValue(ctx.rnd, REF.ureia, p.ureia ?? "normal");
  const creat = mkValue(ctx.rnd, creatRef, p.creatinina ?? "normal");
  const idade = ctx.idade ?? 40;
  const etfg = 175 * Math.pow(creat, -1.154) * Math.pow(idade, -0.203) * (ctx.sexo === "F" ? 0.742 : 1);
  const ureiaA = analyteFrom("Ureia", ureia, REF.ureia);
  const creatA = analyteFrom("Creatinina", creat, creatRef);
  // TFG informativa: só sinaliza ↓ quando clinicamente relevante (< 60).
  const tfgA = { nome: "TFG estimada (MDRD)", valor: fmt(Math.max(4, etfg), 0), unidade: "mL/min/1,73m²", ref: "≥ 60", flag: (etfg < 60 ? "↓" : "") as "" | "↓" };
  const itens = [ureiaA, creatA, tfgA];
  // Nível pelo que é medido (ureia/creatinina), não só pela TFG derivada.
  const alterado = !!ureiaA.flag || !!creatA.flag || etfg < 60;
  return { testId: "renal", titulo: "Função Renal", nivel: alterado ? ctx.gravidade : "normal", paciente: ctx.paciente, sections: [{ titulo: "Função Renal", itens }], observacoes: p.obs };
}
