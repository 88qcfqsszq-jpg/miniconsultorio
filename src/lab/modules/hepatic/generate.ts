// Módulo FUNÇÃO HEPÁTICA — AST, ALT, FA, GGT, BT, BD, BI, Albumina.
import type { LabContext, LabPanelResult, ClinicalTag, Direcao } from "@/src/lab/labTypes";
import { REF } from "@/src/lab/labReferenceRanges";
import { mkValue, analyteFrom, gen } from "@/src/lab/labUtils";
import { getExameLaboratorialV2, temValoresV2, obterSinonimo, textoIndicaAlteracao } from "@/src/lab/labCaseData";

type Prof = Partial<Record<"ast" | "alt" | "fa" | "ggt" | "bt" | "bd" | "albumina", Direcao>> & { obs: string[] };

export const HEPATIC_PROFILES: Partial<Record<ClinicalTag, Prof>> = {
  hepatite: { ast: "muito_alto", alt: "muito_alto", bt: "alto", bd: "alto", obs: ["Elevação acentuada de transaminases (padrão hepatocelular) — hepatite/lesão hepatocelular."] },
  colestase: { fa: "muito_alto", ggt: "muito_alto", bt: "alto", bd: "muito_alto", obs: ["Elevação de FA/GGT com bilirrubina direta — padrão colestático."] },
  sepse: { ast: "alto", alt: "alto", bt: "alto", albumina: "baixo", obs: ["Alteração hepática e hipoalbuminemia no contexto de sepse."] },
  dengue: { ast: "alto", alt: "alto", obs: ["Elevação de transaminases (AST/ALT) — comum na dengue."] },
  dengue_alarme: { ast: "muito_alto", alt: "alto", bt: "alto", obs: ["Transaminases elevadas — sinal de gravidade na dengue (acometimento hepático)."] },
  febre_amarela: { ast: "muito_alto", alt: "muito_alto", bt: "muito_alto", bd: "alto", obs: ["Hepatite grave com hiperbilirrubinemia — compatível com febre amarela."] },
};

function textoIndicaNormalidade(texto?: string): boolean {
  if (!texto) return false;

  const t = String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return (
    t.includes("sem alteracao") ||
    t.includes("sem alteracoes") ||
    t.includes("sem elevacao") ||
    t.includes("sem evidencia") ||
    t.includes("dentro dos parametros") ||
    t.includes("preservada") ||
    t.includes("preservado") ||
    t.includes("normal")
  );
}

export function generateHepatic(ctx: LabContext): LabPanelResult {
  // PRIORIDADE 1: Usar dados reais do caso V2 se disponível
  const funcaoHepaticaV2 = getExameLaboratorialV2(ctx.caso, "funcaoHepatica");

  if (temValoresV2(funcaoHepaticaV2)) {
    const v = funcaoHepaticaV2.valores;
    const itens: LabContext extends any ? any[] : any[] = [];

    // Mapear campos possíveis, aceitando sinônimos
    const ast = obterSinonimo(v, ["ast", "tgo", "aspartateaminotransferase"]);
    const alt = obterSinonimo(v, ["alt", "tgp", "alanineaminotransferase"]);
    const fa = obterSinonimo(v, ["fa", "fosfataseAlcalina", "fosfatasealcalina"]);
    const ggt = obterSinonimo(v, ["ggt", "gammaglutamiltransferase"]);
    const bt = obterSinonimo(v, ["bt", "bilirrubinaTotal", "bilirrubinatotal"]);
    const bd = obterSinonimo(v, ["bd", "bilirrubinaDireta", "bilirrubinadireta"]);
    const bi = obterSinonimo(v, ["bi", "bilirrubinaIndireta", "bilirrubinaindireta", "bilirrubina_indireta"]);
    const albumina = obterSinonimo(v, ["albumina"]);

    if (ast) itens.push(analyteFrom("AST (TGO)", parseFloat(String(ast).replace(",", ".")), REF.ast));
    if (alt) itens.push(analyteFrom("ALT (TGP)", parseFloat(String(alt).replace(",", ".")), REF.alt));
    if (fa) itens.push(analyteFrom("Fosfatase alcalina", parseFloat(String(fa).replace(",", ".")), REF.fa));
    if (ggt) itens.push(analyteFrom("GGT", parseFloat(String(ggt).replace(",", ".")), REF.ggt));
    if (bt) itens.push(analyteFrom("Bilirrubina total", parseFloat(String(bt).replace(",", ".")), REF.bt));
    if (bd) itens.push(analyteFrom("Bilirrubina direta", parseFloat(String(bd).replace(",", ".")), REF.bd));
    if (bi) itens.push(analyteFrom("Bilirrubina indireta", parseFloat(String(bi).replace(",", ".")), REF.bi));
    if (albumina) itens.push(analyteFrom("Albumina", parseFloat(String(albumina).replace(",", ".")), REF.albumina));

    const alterado =
      itens.some((i: any) => i.flag) ||
      (!textoIndicaNormalidade(funcaoHepaticaV2.interpretacao) && textoIndicaAlteracao(funcaoHepaticaV2.interpretacao));

    return {
      testId: "hepatic",
      titulo: "Função Hepática",
      nivel: alterado ? "grave" : "normal",
      paciente: ctx.paciente,
      sections: [{ titulo: "Função Hepática", itens }],
      observacoes: funcaoHepaticaV2.interpretacao ? [funcaoHepaticaV2.interpretacao] : [],
    };
  }

  // FALLBACK: Usar perfis hardcoded se não houver dados V2
  const p = HEPATIC_PROFILES[ctx.tag] ?? { obs: ["Enzimas e função hepática dentro dos parâmetros."] };
  const bt = mkValue(ctx.rnd, REF.bt, p.bt ?? "normal");
  let bd = mkValue(ctx.rnd, REF.bd, p.bd ?? "normal");
  bd = Math.min(bd, bt * 0.9); // coerência: BD ≤ BT
  const bi = Math.max(bt - bd, 0); // bilirrubina indireta = BT - BD

  const itens = [
    gen(ctx.rnd, "AST (TGO)", REF.ast, p.ast ?? "normal"),
    gen(ctx.rnd, "ALT (TGP)", REF.alt, p.alt ?? "normal"),
    gen(ctx.rnd, "Fosfatase alcalina", REF.fa, p.fa ?? "normal"),
    gen(ctx.rnd, "GGT", REF.ggt, p.ggt ?? "normal"),
    analyteFrom("Bilirrubina total", bt, REF.bt),
    analyteFrom("Bilirrubina direta", bd, REF.bd),
    analyteFrom("Bilirrubina indireta", bi, REF.bd),
    gen(ctx.rnd, "Albumina", REF.albumina, p.albumina ?? "normal"),
  ];

  const alterado = itens.some((i) => i.flag);

  return {
    testId: "hepatic",
    titulo: "Função Hepática",
    nivel: alterado ? ctx.gravidade : "normal",
    paciente: ctx.paciente,
    sections: [{ titulo: "Função Hepática", itens }],
    observacoes: p.obs,
  };
}