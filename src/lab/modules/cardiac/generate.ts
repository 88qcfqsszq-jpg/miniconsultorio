// Módulo MARCADORES CARDÍACOS — Troponina, CK-MB, BNP.
import type { LabContext, LabPanelResult, ClinicalTag, Direcao } from "@/src/lab/labTypes";
import { REF } from "@/src/lab/labReferenceRanges";
import { gen, analyteFrom } from "@/src/lab/labUtils";
import { getExameLaboratorialV2, temValoresV2, obterSinonimo } from "@/src/lab/labCaseData";

type Prof = { troponina?: Direcao; ckmb?: Direcao; bnp?: Direcao; obs: string[] };

export const CARDIAC_PROFILES: Partial<Record<ClinicalTag, Prof>> = {
  iam_sca: { troponina: "muito_alto", ckmb: "alto", bnp: "alto", obs: ["Troponina e CK-MB elevadas — necrose miocárdica (SCA/IAM). Correlacionar com curva e ECG."] },
  ic: { bnp: "muito_alto", troponina: "alto", obs: ["BNP acentuadamente elevado — sobrecarga/insuficiência cardíaca."] },
  tep: { troponina: "alto", bnp: "alto", obs: ["Discreta elevação de troponina/BNP — sobrecarga de ventrículo direito (TEP)."] },
  pericardite: { troponina: "alto", obs: ["Elevação discreta de troponina — possível miopericardite. Curva enzimática arrastada, não em pico."] },
};

export function generateCardiac(ctx: LabContext): LabPanelResult {
  // PRIORIDADE 1: Usar dados reais do caso V2 se disponível
  const marcadoresV2 = getExameLaboratorialV2(ctx.caso, "marcadoresCardiacos");
  if (temValoresV2(marcadoresV2)) {
    const v = marcadoresV2.valores;
    const itens: any[] = [];

    const troponina = obterSinonimo(v, ["troponina", "troponinaI", "troponinaT"]);
    const ckmb = obterSinonimo(v, ["ckmb", "ckMb"]);
    const bnp = obterSinonimo(v, ["bnp", "ntprobnp", "ntProBnp"]);

    if (troponina) itens.push(analyteFrom("Troponina", parseFloat(String(troponina).replace(",", ".")), REF.troponina));
    if (ckmb) itens.push(analyteFrom("CK-MB", parseFloat(String(ckmb).replace(",", ".")), REF.ckmb));
    if (bnp) itens.push(analyteFrom("NT-proBNP", parseFloat(String(bnp).replace(",", ".")), REF.bnp));

    const alterado = itens.some((i: any) => i.flag);

    return {
      testId: "cardiac",
      titulo: "Marcadores Cardíacos",
      nivel: alterado ? "grave" : "normal",
      paciente: ctx.paciente,
      sections: [{ titulo: "Marcadores Cardíacos", itens }],
      observacoes: marcadoresV2.interpretacao ? [marcadoresV2.interpretacao] : [],
    };
  }

  // FALLBACK: Usar perfis hardcoded se não houver dados V2
  const p = CARDIAC_PROFILES[ctx.tag] ?? { obs: ["Marcadores cardíacos dentro dos parâmetros — não sugere lesão miocárdica aguda."] };
  const itens = [
    gen(ctx.rnd, "Troponina", REF.troponina, p.troponina ?? "normal"),
    gen(ctx.rnd, "CK-MB", REF.ckmb, p.ckmb ?? "normal"),
    gen(ctx.rnd, "NT-proBNP", REF.bnp, p.bnp ?? "normal"),
  ];
  const alterado = itens.some((i) => i.flag);
  return { testId: "cardiac", titulo: "Marcadores Cardíacos", nivel: alterado ? ctx.gravidade : "normal", paciente: ctx.paciente, sections: [{ titulo: "Marcadores Cardíacos", itens }], observacoes: p.obs };
}
