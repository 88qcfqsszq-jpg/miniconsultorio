// ============================================================================
// Professor IA — KNOWLEDGE BUILDER
// ----------------------------------------------------------------------------
// Descobre, de forma DETERMINÍSTICA (sem IA), quais conhecimentos do Centro
// Clínico e bibliotecas são relevantes para um caso/diagnóstico. Apenas
// estrutura referências (com href para rotas reais já existentes). Não gera
// texto, não chama IA, não modifica o Centro Clínico.
// ============================================================================

import type { ClinicalTheme, KnowledgeDomain, ResourceType } from "./types";
import type { KnowledgeMap, KnowledgeResource } from "./interfaces";
import type { ResourceTruth } from "../../clinical-engine/gold-standard/types";

function norm(s: string | undefined | null): string {
  return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

function res(
  id: string,
  domain: KnowledgeDomain,
  tipo: ResourceType,
  titulo: string,
  href?: string,
  ancoras?: string[],
  descricao?: string
): KnowledgeResource {
  return { id, domain, tipo, titulo, href, ancoras, descricao };
}

// ---------------------------------------------------------------------------
// Recursos-base do Centro Clínico (rotas reais existentes).
// ---------------------------------------------------------------------------
const R = {
  semiologiaPagina: res("semio-pagina", "semiologia", "pagina", "Biblioteca de Semiologia", "/centro-clinico/semiologia"),
  fluxosPagina: res("fluxos-pagina", "fluxo", "pagina", "Fluxos Clínicos", "/centro-clinico/fluxos"),
  examesPagina: res("exames-pagina", "exame", "pagina", "Biblioteca de Exames", "/centro-clinico/exames"),
  imagensPagina: res("imagens-pagina", "imagem", "pagina", "Atlas Clínico de Imagens", "/centro-clinico/imagens"),
  sonsPagina: res("sons-pagina", "som", "pagina", "Biblioteca de Sons Clínicos", "/centro-clinico/sons"),
  guiaPagina: res("guia-pagina", "guia", "pagina", "Guia OSCE", "/guia"),
};

// ---------------------------------------------------------------------------
// Índice por TEMA clínico → recursos relacionados (semiologia/fluxo/exame/…).
// Estático e auditável. Ampliável sem tocar em nenhum outro módulo.
// ---------------------------------------------------------------------------
type ThemeKnowledge = Partial<Record<KnowledgeDomain, KnowledgeResource[]>>;

const THEME_INDEX: Record<ClinicalTheme, ThemeKnowledge> = {
  respiratorio: {
    semiologia: [res("semio-pneumo", "semiologia", "secao", "Semiologia — Pneumologia", "/centro-clinico/semiologia", ["Pneumologia"])],
    fluxo: [res("fluxo-dispneia", "fluxo", "fluxograma", "Fluxo da Dispneia", "/centro-clinico/fluxos", ["Dispneia"])],
    exame: [
      res("exame-rx", "exame", "secao", "RX de tórax", "/centro-clinico/exames", ["RX de tórax"]),
      res("exame-gaso", "exame", "secao", "Gasometria", "/centro-clinico/exames", ["Gasometria"]),
      res("exame-hemograma", "exame", "secao", "Hemograma", "/centro-clinico/exames", ["Hemograma"]),
    ],
    imagem: [res("img-pneumonia", "imagem", "imagem", "Pneumonia (RX)", "/centro-clinico/imagens", ["Pneumonia"])],
    som: [
      res("som-crepitacoes", "som", "audio", "Crepitações (finas/grossas)", "/centro-clinico/sons", ["Crepitações finas", "Crepitações grossas"]),
      res("som-sibilos", "som", "audio", "Sibilos", "/centro-clinico/sons", ["Sibilos"]),
    ],
    escore: [res("escore-curb65", "escore", "referencia", "CURB-65 (gravidade da pneumonia)", undefined, ["CURB-65"], "Escore de gravidade para pneumonia adquirida na comunidade.")],
  },
  cardiovascular: {
    semiologia: [res("semio-cardio", "semiologia", "secao", "Semiologia — Cardiologia", "/centro-clinico/semiologia", ["Cardiologia"])],
    fluxo: [
      res("fluxo-dortoracica", "fluxo", "fluxograma", "Fluxo da Dor Torácica", "/centro-clinico/fluxos", ["Dor torácica"]),
      res("fluxo-sincope", "fluxo", "fluxograma", "Fluxo da Síncope", "/centro-clinico/fluxos", ["Síncope"]),
    ],
    exame: [
      res("exame-ecg", "exame", "secao", "ECG", "/centro-clinico/exames", ["ECG"]),
      res("exame-troponina", "exame", "secao", "Troponina", "/centro-clinico/exames", ["Troponina"]),
      res("exame-eco", "exame", "secao", "Ecocardiograma", "/centro-clinico/exames", ["Ecocardiograma"]),
    ],
    imagem: [res("img-cardiomegalia", "imagem", "imagem", "Cardiomegalia (RX)", "/centro-clinico/imagens", ["Cardiomegalia"])],
    som: [
      res("som-sopros", "som", "audio", "Sopros sistólico/diastólico", "/centro-clinico/sons", ["Sopro sistólico", "Sopro diastólico"]),
      res("som-b3b4", "som", "audio", "B3 / B4", "/centro-clinico/sons", ["B3", "B4"]),
    ],
  },
  abdominal: {
    semiologia: [res("semio-abdome", "semiologia", "secao", "Semiologia — Abdome", "/centro-clinico/semiologia", ["Abdome"])],
    fluxo: [res("fluxo-abdome", "fluxo", "fluxograma", "Fluxo da Dor Abdominal", "/centro-clinico/fluxos", ["Dor abdominal"])],
    exame: [
      res("exame-usg", "exame", "secao", "Ultrassonografia", "/centro-clinico/exames", ["Ultrassonografia"]),
      res("exame-tc", "exame", "secao", "Tomografia", "/centro-clinico/exames", ["Tomografia"]),
    ],
  },
  neurologico: {
    semiologia: [res("semio-neuro", "semiologia", "secao", "Semiologia — Neurologia", "/centro-clinico/semiologia", ["Neurologia"])],
    fluxo: [res("fluxo-cefaleia", "fluxo", "fluxograma", "Fluxo da Cefaleia", "/centro-clinico/fluxos", ["Cefaleia"])],
    exame: [res("exame-tc-cranio", "exame", "secao", "Tomografia de crânio", "/centro-clinico/exames", ["Tomografia"])],
  },
  infectologia: {
    semiologia: [res("semio-infecto", "semiologia", "secao", "Semiologia — Infectologia", "/centro-clinico/semiologia", ["Infectologia"])],
    fluxo: [res("fluxo-febre", "fluxo", "fluxograma", "Fluxo da Febre", "/centro-clinico/fluxos", ["Febre"])],
    exame: [
      res("exame-hemograma-inf", "exame", "secao", "Hemograma", "/centro-clinico/exames", ["Hemograma"]),
      res("exame-urina", "exame", "secao", "Urina tipo I", "/centro-clinico/exames", ["Urina tipo I"]),
    ],
  },
  hematologia: {
    semiologia: [res("semio-hemato", "semiologia", "secao", "Semiologia — Hematologia", "/centro-clinico/semiologia", ["Hematologia"])],
    exame: [res("exame-hemograma-h", "exame", "secao", "Hemograma", "/centro-clinico/exames", ["Hemograma"])],
  },
  pediatria: {
    semiologia: [res("semio-ped", "semiologia", "secao", "Semiologia — Pediatria", "/centro-clinico/semiologia", ["Pediatria"])],
    fluxo: [res("fluxo-crianca-febre", "fluxo", "fluxograma", "Fluxo da Criança com Febre", "/centro-clinico/fluxos", ["Criança com Febre"])],
  },
  urgencia: {
    semiologia: [res("semio-urg", "semiologia", "secao", "Semiologia — Urgência e Emergência", "/centro-clinico/semiologia", ["Urgência e Emergência"])],
    escore: [res("escore-abcde", "escore", "referencia", "ABCDE (abordagem inicial)", undefined, ["ABCDE"])],
  },
  outro: {},
};

/** Deriva o tema clínico a partir de textos do caso (sistema/tema/diagnóstico/título). */
export function inferirTemaClinico(...textos: (string | undefined)[]): ClinicalTheme {
  const t = norm(textos.filter(Boolean).join(" "));
  if (/respir|pulmon|pneumon|asma|dpoc|dispneia|torax|bronqui|tuberc|pneumotorax|derrame pleural/.test(t)) return "respiratorio";
  if (/card|cora|sca|iam|angina|insuficiencia card|arritmia|fibrilacao|sopro|estenose|endocardite|pericardite|dor toracica|sincope/.test(t)) return "cardiovascular";
  if (/abdom|apendicite|colecistite|pancreatite|obstrucao|gastro|hepat/.test(t)) return "abdominal";
  if (/neuro|avc|cefaleia|convuls|meningite|deficit|coma/.test(t)) return "neurologico";
  if (/infec|sepse|febre|dengue|hiv|meningite|itu|celulite/.test(t)) return "infectologia";
  if (/anemia|leucemia|linfoma|plaqueta|sangrament|hemato/.test(t)) return "hematologia";
  if (/pediatr|lactente|crianca|neonat|recem-nascido/.test(t)) return "pediatria";
  if (/urgenc|emerg|choque|parada|trauma|politraumat/.test(t)) return "urgencia";
  return "outro";
}

/**
 * Constrói o mapa de conhecimento relevante para um caso/diagnóstico.
 * 100% determinístico. Não chama IA.
 */
// Mapeia o domínio dos links do Centro Clínico (Resource Truth) → domínio do KnowledgeMap.
const DOMINIO_TRUTH_PARA_KM: Record<string, KnowledgeDomain> = {
  semiologia: "semiologia",
  fluxo: "fluxo",
  exame: "exame",
  imagem: "imagem",
  som: "som",
  escore: "escore",
  guia: "guia",
};

/** Converte os links do Centro Clínico da Resource Truth em KnowledgeResource por domínio. */
function recursosDaResourceTruth(rt: ResourceTruth): Partial<Record<KnowledgeDomain, KnowledgeResource[]>> {
  const out: Partial<Record<KnowledgeDomain, KnowledgeResource[]>> = {};
  rt.centroClinico.forEach((l, i) => {
    const dom = DOMINIO_TRUTH_PARA_KM[l.dominio];
    if (!dom) return;
    const r = res(`truth-${l.dominio}-${i}`, dom, "secao", l.titulo, l.href, l.ancoras);
    (out[dom] ??= []).push(r);
  });
  return out;
}

export function buildKnowledgeMap(input: {
  diagnosisKey?: string;
  sistema?: string;
  tema?: string;
  casoTitulo?: string;
  temaClinico?: ClinicalTheme;
  /** Fase 14: se presente, os links do Centro Clínico da Resource Truth entram primeiro (preferenciais). */
  resourceTruth?: ResourceTruth;
}): KnowledgeMap {
  const tema =
    input.temaClinico ??
    inferirTemaClinico(input.diagnosisKey, input.sistema, input.tema, input.casoTitulo);

  const idx = THEME_INDEX[tema] ?? {};
  // Recursos preferenciais vindos da Resource Truth (entram primeiro em cada domínio).
  const pref = input.resourceTruth ? recursosDaResourceTruth(input.resourceTruth) : {};

  const semiologia = [...(pref.semiologia ?? []), ...(idx.semiologia ?? []), R.semiologiaPagina];
  const fluxos = [...(pref.fluxo ?? []), ...(idx.fluxo ?? []), R.fluxosPagina];
  const exames = [...(pref.exame ?? []), ...(idx.exame ?? []), R.examesPagina];
  const imagens = [...(pref.imagem ?? []), ...(idx.imagem ?? []), R.imagensPagina];
  const sons = [...(pref.som ?? []), ...(idx.som ?? []), R.sonsPagina];
  const escores = [...(pref.escore ?? []), ...(idx.escore ?? [])];
  const guias = [...(pref.guia ?? []), R.guiaPagina];

  const todos = dedupPorId([
    ...semiologia,
    ...fluxos,
    ...exames,
    ...imagens,
    ...sons,
    ...escores,
    ...guias,
  ]);

  return {
    diagnosisKey: input.diagnosisKey,
    tema,
    semiologia: dedupPorId(semiologia),
    fluxos: dedupPorId(fluxos),
    exames: dedupPorId(exames),
    imagens: dedupPorId(imagens),
    sons: dedupPorId(sons),
    escores: dedupPorId(escores),
    guias: dedupPorId(guias),
    todos,
  };
}

function dedupPorId(arr: KnowledgeResource[]): KnowledgeResource[] {
  const vistos = new Set<string>();
  const out: KnowledgeResource[] = [];
  for (const r of arr) {
    if (vistos.has(r.id)) continue;
    vistos.add(r.id);
    out.push(r);
  }
  return out;
}
