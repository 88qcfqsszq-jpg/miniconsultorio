// Módulo MARCADORES INFLAMATÓRIOS — PCR, VHS, Procalcitonina.
import type { LabContext, LabPanelResult, ClinicalTag, Direcao } from "@/src/lab/labTypes";
import { REF } from "@/src/lab/labReferenceRanges";
import { gen, analyteFrom } from "@/src/lab/labUtils";
import { getExameLaboratorialV2, temValoresV2, obterSinonimo } from "@/src/lab/labCaseData";

type Prof = { pcr?: Direcao; vhs?: Direcao; procalcitonina?: Direcao; obs: string[] };

export const INFLAM_PROFILES: Partial<Record<ClinicalTag, Prof>> = {
  pneumonia: { pcr: "muito_alto", vhs: "alto", procalcitonina: "alto", obs: ["PCR e procalcitonina elevadas — padrão de infecção bacteriana."] },
  sepse: { pcr: "muito_alto", vhs: "alto", procalcitonina: "muito_alto", obs: ["Procalcitonina acentuadamente elevada — sugestivo de sepse bacteriana."] },
  pielonefrite: { pcr: "muito_alto", vhs: "alto", procalcitonina: "alto", obs: ["Marcadores inflamatórios elevados — infecção bacteriana (pielonefrite)."] },
  virose: { pcr: "alto", obs: ["PCR discretamente elevada com procalcitonina normal — mais compatível com quadro viral."] },
  dengue: { pcr: "alto", obs: ["Elevação discreta de PCR com procalcitonina normal — padrão viral (arbovirose)."] },
  dengue_alarme: { pcr: "alto", obs: ["PCR discreta e procalcitonina normal — vigilância pelo risco de gravidade da dengue."] },
  tuberculose: { pcr: "alto", vhs: "muito_alto", obs: ["VHS muito elevada — inflamação crônica (tuberculose/doença granulomatosa)."] },
  les_hiv: { pcr: "alto", vhs: "muito_alto", obs: ["VHS elevada — atividade inflamatória crônica/autoimune."] },
};

export function generateInflammation(ctx: LabContext): LabPanelResult {
  // PRIORIDADE 1: Usar dados reais do caso V2 se disponível
  const marcadoresV2 = getExameLaboratorialV2(ctx.caso, "marcadoresInflamatorios");
  if (temValoresV2(marcadoresV2)) {
    const v = marcadoresV2.valores;
    const itens: any[] = [];

    const pcr = obterSinonimo(v, ["pcr", "ProteínaCReativa"]);
    const vhs = obterSinonimo(v, ["vhs", "VHS"]);
    const procalcitonina = obterSinonimo(v, ["procalcitonina"]);

    if (pcr) itens.push(analyteFrom("PCR", parseFloat(String(pcr).replace(",", ".")), REF.pcr));
    if (vhs) itens.push(analyteFrom("VHS", parseFloat(String(vhs).replace(",", ".")), REF.vhs));
    if (procalcitonina) itens.push(analyteFrom("Procalcitonina", parseFloat(String(procalcitonina).replace(",", ".")), REF.procalcitonina));

    const alterado = itens.some((i: any) => i.flag);

    return {
      testId: "inflammation",
      titulo: "Marcadores Inflamatórios",
      nivel: alterado ? "grave" : "normal",
      paciente: ctx.paciente,
      sections: [{ titulo: "Marcadores Inflamatórios", itens }],
      observacoes: marcadoresV2.interpretacao ? [marcadoresV2.interpretacao] : [],
    };
  }

  // FALLBACK: Usar perfis hardcoded se não houver dados V2
  const p = INFLAM_PROFILES[ctx.tag] ?? { obs: ["Marcadores inflamatórios dentro dos parâmetros."] };
  const itens = [
    gen(ctx.rnd, "PCR", REF.pcr, p.pcr ?? "normal"),
    gen(ctx.rnd, "VHS", REF.vhs, p.vhs ?? "normal"),
    gen(ctx.rnd, "Procalcitonina", REF.procalcitonina, p.procalcitonina ?? "normal"),
  ];
  const alterado = itens.some((i) => i.flag);
  return { testId: "inflammation", titulo: "Marcadores Inflamatórios", nivel: alterado ? ctx.gravidade : "normal", paciente: ctx.paciente, sections: [{ titulo: "Marcadores Inflamatórios", itens }], observacoes: p.obs };
}
