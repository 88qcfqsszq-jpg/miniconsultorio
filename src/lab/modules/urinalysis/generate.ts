// Módulo URINA TIPO 1 (EAS) — físico-químico + sedimento.
import type { LabContext, LabPanelResult, ClinicalTag, LabAnalyte, Direcao } from "@/src/lab/labTypes";
import { REF } from "@/src/lab/labReferenceRanges";
import { gen, qualitativo } from "@/src/lab/labUtils";

interface UProf {
  densidade?: Direcao;
  proteina?: string; glicose?: string; cetonicos?: string; sangue?: string;
  nitrito?: string; esterase?: string; leucocitos?: string; hemacias?: string;
  bacterias?: string; cilindros?: string;
  altera?: string[]; // campos qualitativos alterados
  obs: string[];
}

export const URINE_PROFILES: Partial<Record<ClinicalTag, UProf>> = {
  itu: { nitrito: "Positivo", esterase: "Positiva", leucocitos: "Numerosos (piúria)", bacterias: "Numerosas", altera: ["nitrito", "esterase", "leucocitos", "bacterias"], obs: ["Piúria com nitrito/esterase positivos e bacteriúria — compatível com infecção urinária."] },
  pielonefrite: { nitrito: "Positivo", esterase: "Positiva", leucocitos: "Numerosos (piúria)", bacterias: "Numerosas", proteina: "Traços", cilindros: "Cilindros leucocitários", altera: ["nitrito", "esterase", "leucocitos", "bacterias", "proteina", "cilindros"], obs: ["Piúria com cilindros leucocitários — sugere acometimento renal (pielonefrite)."] },
  desidratacao: { densidade: "alto", obs: ["Urina concentrada (densidade elevada) — desidratação."] },
  dka: { densidade: "alto", glicose: "Presente (++++)", cetonicos: "Presentes (+++)", altera: ["glicose", "cetonicos"], obs: ["Glicosúria e cetonúria intensas — compatível com cetoacidose diabética."] },
  irc: { densidade: "baixo", proteina: "Positiva (++)", hemacias: "Presentes", cilindros: "Cilindros granulosos", altera: ["proteina", "hemacias", "cilindros"], obs: ["Proteinúria com cilindros e isostenúria (densidade baixa) — nefropatia."] },
};

export function generateUrinalysis(ctx: LabContext): LabPanelResult {
  const p = URINE_PROFILES[ctx.tag] ?? { obs: ["Urina tipo 1 sem alterações relevantes."] };
  const alt = (campo: string) => (p.altera ?? []).includes(campo);
  const fisicoQuimico: LabAnalyte[] = [
    gen(ctx.rnd, "Densidade", REF.densidade, p.densidade ?? "normal"),
    gen(ctx.rnd, "pH urinário", REF.urina_ph, "normal"),
    qualitativo("Proteína", p.proteina ?? "Ausente", "Ausente", alt("proteina")),
    qualitativo("Glicose", p.glicose ?? "Ausente", "Ausente", alt("glicose")),
    qualitativo("Corpos cetônicos", p.cetonicos ?? "Ausentes", "Ausentes", alt("cetonicos")),
    qualitativo("Sangue/Hemoglobina", p.sangue ?? "Ausente", "Ausente", alt("sangue")),
    qualitativo("Nitrito", p.nitrito ?? "Negativo", "Negativo", alt("nitrito")),
    qualitativo("Esterase leucocitária", p.esterase ?? "Negativa", "Negativa", alt("esterase")),
  ];
  const sedimento: LabAnalyte[] = [
    qualitativo("Leucócitos", p.leucocitos ?? "< 5 p/campo", "< 5 p/campo", alt("leucocitos")),
    qualitativo("Hemácias", p.hemacias ?? "< 3 p/campo", "< 3 p/campo", alt("hemacias")),
    qualitativo("Bactérias", p.bacterias ?? "Raras", "Raras/Ausentes", alt("bacterias")),
    qualitativo("Cilindros", p.cilindros ?? "Ausentes", "Ausentes", alt("cilindros")),
  ];
  const alterado = [...fisicoQuimico, ...sedimento].some((i) => i.flag);
  return {
    testId: "urinalysis", titulo: "Urina Tipo 1 (EAS)", nivel: alterado ? ctx.gravidade : "normal", paciente: ctx.paciente,
    sections: [{ titulo: "Físico-químico", itens: fisicoQuimico }, { titulo: "Sedimentoscopia", itens: sedimento }],
    observacoes: p.obs,
  };
}
