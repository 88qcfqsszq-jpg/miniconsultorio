// Módulo FUNÇÃO HEPÁTICA — AST, ALT, FA, GGT, BT, BD, Albumina.
import type { LabContext, LabPanelResult, ClinicalTag, Direcao } from "@/src/lab/labTypes";
import { REF } from "@/src/lab/labReferenceRanges";
import { mkValue, analyteFrom, gen } from "@/src/lab/labUtils";

type Prof = Partial<Record<"ast" | "alt" | "fa" | "ggt" | "bt" | "bd" | "albumina", Direcao>> & { obs: string[] };

export const HEPATIC_PROFILES: Partial<Record<ClinicalTag, Prof>> = {
  hepatite: { ast: "muito_alto", alt: "muito_alto", bt: "alto", bd: "alto", obs: ["Elevação acentuada de transaminases (padrão hepatocelular) — hepatite/lesão hepatocelular."] },
  colestase: { fa: "muito_alto", ggt: "muito_alto", bt: "alto", bd: "muito_alto", obs: ["Elevação de FA/GGT com bilirrubina direta — padrão colestático."] },
  sepse: { ast: "alto", alt: "alto", bt: "alto", albumina: "baixo", obs: ["Alteração hepática e hipoalbuminemia no contexto de sepse."] },
  dengue: { ast: "alto", alt: "alto", obs: ["Elevação de transaminases (AST/ALT) — comum na dengue."] },
  dengue_alarme: { ast: "muito_alto", alt: "alto", bt: "alto", obs: ["Transaminases elevadas — sinal de gravidade na dengue (acometimento hepático)."] },
  febre_amarela: { ast: "muito_alto", alt: "muito_alto", bt: "muito_alto", bd: "alto", obs: ["Hepatite grave com hiperbilirrubinemia — compatível com febre amarela."] },
};

export function generateHepatic(ctx: LabContext): LabPanelResult {
  const p = HEPATIC_PROFILES[ctx.tag] ?? { obs: ["Enzimas e função hepática dentro dos parâmetros."] };
  const bt = mkValue(ctx.rnd, REF.bt, p.bt ?? "normal");
  let bd = mkValue(ctx.rnd, REF.bd, p.bd ?? "normal");
  bd = Math.min(bd, bt * 0.9); // coerência: BD ≤ BT
  const itens = [
    gen(ctx.rnd, "AST (TGO)", REF.ast, p.ast ?? "normal"),
    gen(ctx.rnd, "ALT (TGP)", REF.alt, p.alt ?? "normal"),
    gen(ctx.rnd, "Fosfatase alcalina", REF.fa, p.fa ?? "normal"),
    gen(ctx.rnd, "GGT", REF.ggt, p.ggt ?? "normal"),
    analyteFrom("Bilirrubina total", bt, REF.bt),
    analyteFrom("Bilirrubina direta", bd, REF.bd),
    gen(ctx.rnd, "Albumina", REF.albumina, p.albumina ?? "normal"),
  ];
  const alterado = itens.some((i) => i.flag);
  return { testId: "hepatic", titulo: "Função Hepática", nivel: alterado ? ctx.gravidade : "normal", paciente: ctx.paciente, sections: [{ titulo: "Função Hepática", itens }], observacoes: p.obs };
}
