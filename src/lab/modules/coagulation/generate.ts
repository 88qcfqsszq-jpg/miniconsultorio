// Módulo COAGULOGRAMA — TP, INR, TTPa, Fibrinogênio, D-dímero.
import type { LabContext, LabPanelResult, ClinicalTag, Direcao } from "@/src/lab/labTypes";
import { REF } from "@/src/lab/labReferenceRanges";
import { gen, analyteFrom } from "@/src/lab/labUtils";
import { getExameLaboratorialV2, temValoresV2, obterSinonimo } from "@/src/lab/labCaseData";

type Prof = Partial<Record<"tp" | "inr" | "ttpa" | "fibrinogenio" | "ddimero", Direcao>> & { obs: string[] };

export const COAG_PROFILES: Partial<Record<ClinicalTag, Prof>> = {
  civd: { tp: "alto", inr: "alto", ttpa: "alto", fibrinogenio: "muito_baixo", ddimero: "muito_alto", obs: ["Prolongamento de TP/TTPa, consumo de fibrinogênio e D-dímero muito elevado — coagulação intravascular disseminada."] },
  hepatite: { tp: "alto", inr: "alto", fibrinogenio: "baixo", obs: ["Prolongamento de TP/INR — redução da síntese de fatores (hepatopatia)."] },
  tep: { ddimero: "muito_alto", obs: ["D-dímero acentuadamente elevado — alta sensibilidade para TEP (baixa especificidade)."] },
  sepse: { tp: "alto", inr: "alto", ddimero: "muito_alto", fibrinogenio: "baixo", obs: ["Coagulopatia de consumo incipiente — vigiar evolução para CIVD."] },
  dengue_alarme: { ttpa: "alto", ddimero: "alto", obs: ["Alargamento discreto de TTPa e D-dímero elevado — atenção ao risco hemorrágico."] },
};

export function generateCoagulation(ctx: LabContext): LabPanelResult {
  // PRIORIDADE 1: Usar dados reais do caso V2 se disponível
  const coagulogramaV2 = getExameLaboratorialV2(ctx.caso, "coagulograma");
  if (temValoresV2(coagulogramaV2)) {
    const v = coagulogramaV2.valores;
    const itens: any[] = [];

    const tp = obterSinonimo(v, ["tp", "tempoProtrombina"]);
    const inr = obterSinonimo(v, ["inr"]);
    const ttpa = obterSinonimo(v, ["ttpa", "ttp"]);
    const fibrinogenio = obterSinonimo(v, ["fibrinogenio", "fibrinogênio"]);
    const ddimero = obterSinonimo(v, ["ddimero", "dDimero", "d-dimero"]);

    if (tp) itens.push(analyteFrom("TP (tempo de protrombina)", parseFloat(String(tp).replace(",", ".")), REF.tp));
    if (inr) itens.push(analyteFrom("INR", parseFloat(String(inr).replace(",", ".")), REF.inr));
    if (ttpa) itens.push(analyteFrom("TTPa", parseFloat(String(ttpa).replace(",", ".")), REF.ttpa));
    if (fibrinogenio) itens.push(analyteFrom("Fibrinogênio", parseFloat(String(fibrinogenio).replace(",", ".")), REF.fibrinogenio));
    if (ddimero) itens.push(analyteFrom("D-dímero", parseFloat(String(ddimero).replace(",", ".")), REF.ddimero));

    const alterado = itens.some((i: any) => i.flag);

    return {
      testId: "coagulation",
      titulo: "Coagulograma",
      nivel: alterado ? "grave" : "normal",
      paciente: ctx.paciente,
      sections: [{ titulo: "Coagulograma", itens }],
      observacoes: coagulogramaV2.interpretacao ? [coagulogramaV2.interpretacao] : [],
    };
  }

  // FALLBACK: Usar perfis hardcoded se não houver dados V2
  const p = COAG_PROFILES[ctx.tag] ?? { obs: ["Coagulograma dentro dos parâmetros de referência."] };
  const itens = [
    gen(ctx.rnd, "TP (tempo de protrombina)", REF.tp, p.tp ?? "normal"),
    gen(ctx.rnd, "INR", REF.inr, p.inr ?? "normal"),
    gen(ctx.rnd, "TTPa", REF.ttpa, p.ttpa ?? "normal"),
    gen(ctx.rnd, "Fibrinogênio", REF.fibrinogenio, p.fibrinogenio ?? "normal"),
    gen(ctx.rnd, "D-dímero", REF.ddimero, p.ddimero ?? "normal"),
  ];
  const alterado = itens.some((i) => i.flag);
  return { testId: "coagulation", titulo: "Coagulograma", nivel: alterado ? ctx.gravidade : "normal", paciente: ctx.paciente, sections: [{ titulo: "Coagulograma", itens }], observacoes: p.obs };
}
