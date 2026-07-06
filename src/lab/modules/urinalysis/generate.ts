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
  // PRIORIDADE 1: Usar dados reais do caso V2 se disponível
  const urinaCasoV2 = ctx.caso?.exames?.laboratoriais?.urinaTipo1;

  if (urinaCasoV2 && urinaCasoV2.valores) {
    // Mapear valores do caso para LabAnalyte
    const valores = urinaCasoV2.valores;
    const fisicoQuimico: LabAnalyte[] = [];
    const sedimento: LabAnalyte[] = [];

    // Físico-químico
    if (valores.cor) {
  const corTexto = String(valores.cor).toLowerCase();
  const corAlterada =
    !corTexto.includes("amarela") &&
    !corTexto.includes("clara") &&
    !corTexto.includes("normal");

  fisicoQuimico.push(qualitativo("Cor", valores.cor, "Amarela clara", corAlterada));
}
    if (valores.densidade) {
  const densidadeNum = Number(String(valores.densidade).replace(",", "."));
  const densidadeAlterada = !Number.isNaN(densidadeNum) && (densidadeNum < 1.005 || densidadeNum > 1.030);

  fisicoQuimico.push(qualitativo("Densidade", valores.densidade, "1,005-1,030", densidadeAlterada));
}
    if (valores.ph) {
  const phNum = Number(String(valores.ph).replace(",", "."));
  const phAlterado = !Number.isNaN(phNum) && (phNum < 4.5 || phNum > 8.0);

  fisicoQuimico.push(qualitativo("pH urinário", valores.ph, "4,5-8,0", phAlterado));
}
    if (valores.proteina) {
      fisicoQuimico.push(qualitativo("Proteína", valores.proteina, "Ausente", valores.proteina !== "Ausente" && !valores.proteina?.includes("aços")));
    }
    if (valores.glicose) {
      fisicoQuimico.push(qualitativo("Glicose", valores.glicose, "Ausente", valores.glicose !== "Ausente"));
    }
    if (valores.cetonicos) {
      fisicoQuimico.push(qualitativo("Corpos cetônicos", valores.cetonicos, "Ausentes", valores.cetonicos !== "Ausentes"));
    }
    if (valores.sangueHemoglobina) {
      fisicoQuimico.push(qualitativo("Sangue/Hemoglobina", valores.sangueHemoglobina, "Ausente", valores.sangueHemoglobina !== "Ausente"));
    }
    if (valores.nitrito) {
      fisicoQuimico.push(qualitativo("Nitrito", valores.nitrito, "Negativo", valores.nitrito !== "Negativo"));
    }
    if (valores.esterase) {
      fisicoQuimico.push(qualitativo("Esterase leucocitária", valores.esterase, "Negativa", valores.esterase !== "Negativa"));
    }

    // Sedimento
    if (valores.leucocitos) {
      sedimento.push(qualitativo("Leucócitos", valores.leucocitos, "< 5 p/campo", !valores.leucocitos?.includes("<")));
    }
    if (valores.hemacias) {
  const hemaciasTexto = String(valores.hemacias).toLowerCase();
  const hemaciasAlteradas =
    !hemaciasTexto.includes("0-2") &&
    !hemaciasTexto.includes("0 a 2") &&
    !hemaciasTexto.includes("< 3") &&
    !hemaciasTexto.includes("<3") &&
    !hemaciasTexto.includes("ausente") &&
    !hemaciasTexto.includes("ausentes");

  sedimento.push(qualitativo("Hemácias", valores.hemacias, "< 3 p/campo", hemaciasAlteradas));
}
    if (valores.bacterias) {
      sedimento.push(qualitativo("Bactérias", valores.bacterias, "Raras", valores.bacterias !== "Raras" && valores.bacterias !== "Ausentes"));
    }
    if (valores.cilindros) {
      sedimento.push(qualitativo("Cilindros", valores.cilindros, "Ausentes", valores.cilindros !== "Ausentes"));
    }
    if (valores.urobilinogenio) {
      sedimento.push(qualitativo("Urobilinogênio", valores.urobilinogenio, "Normal", valores.urobilinogenio !== "Normal" && !valores.urobilinogenio?.toLowerCase()?.includes("normal")));
    }

    const alterado = [...fisicoQuimico, ...sedimento].some((i) => i.flag);
    const observacoes = urinaCasoV2.interpretacao ? [urinaCasoV2.interpretacao] : [];

    return {
      testId: "urinalysis",
      titulo: "Urina Tipo 1 (EAS)",
      nivel: alterado ? "grave" : "normal",
      paciente: ctx.paciente,
      sections: [
        { titulo: "Físico-químico", itens: fisicoQuimico },
        { titulo: "Sedimentoscopia", itens: sedimento },
      ],
      observacoes,
    };
  }

  // FALLBACK: Usar perfis hardcoded se não houver dados V2
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
