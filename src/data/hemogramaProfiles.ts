// ============================================================================
// Perfis laboratoriais de HEMOGRAMA por padrão clínico (Fase Hemograma)
// ----------------------------------------------------------------------------
// Mapeia o caso clínico ativo → um perfil hematológico (direções por analito +
// nível de alteração + observações). O motor (generateHemograma.ts) usa este
// perfil para gerar valores realistas. PURO: sem IA, sem rede, sem banco.
// Não usa marcas de laboratório reais; padrões didáticos e genéricos.
// ============================================================================

export type Direcao = "normal" | "baixo" | "muito_baixo" | "alto" | "muito_alto";
export type NivelAlteracao = "normal" | "leve" | "moderado" | "grave";

export type AnalitoVermelho = "hemacias" | "hemoglobina" | "hematocrito" | "vcm" | "hcm" | "chcm" | "rdw";
export type AnalitoBranco = "leucocitos" | "neutrofilos" | "bastonetes" | "segmentados" | "linfocitos" | "monocitos" | "eosinofilos" | "basofilos";
export type AnalitoPlaqueta = "plaquetas" | "vpm" | "plaquetocrito" | "pdw";

export interface HemogramaProfile {
  key: string;
  descricao: string;
  nivel: NivelAlteracao;
  serieVermelha: Partial<Record<AnalitoVermelho, Direcao>>;
  serieBranca: Partial<Record<AnalitoBranco, Direcao>>;
  plaquetas: Partial<Record<AnalitoPlaqueta, Direcao>>;
  observacoes: string[];
}

// ── Catálogo de perfis ───────────────────────────────────────────────────────
export const HEMOGRAMA_PROFILES: Record<string, HemogramaProfile> = {
  hemograma_normal_ou_inespecifico: {
    key: "hemograma_normal_ou_inespecifico",
    descricao: "Sem padrão hematológico específico para este caso.",
    nivel: "normal",
    serieVermelha: {}, serieBranca: {}, plaquetas: {},
    observacoes: ["Séries sem alterações relevantes ao quadro. Correlacionar com a clínica."],
  },

  infeccao_bacteriana: {
    key: "infeccao_bacteriana",
    descricao: "Infecção bacteriana (leucocitose com neutrofilia e desvio à esquerda).",
    nivel: "moderado",
    serieVermelha: { hemoglobina: "baixo" },
    serieBranca: { leucocitos: "alto", neutrofilos: "alto", segmentados: "alto", bastonetes: "alto", linfocitos: "baixo" },
    plaquetas: {},
    observacoes: ["Leucocitose com neutrofilia e desvio à esquerda (bastonetes aumentados).", "Padrão sugestivo de processo infeccioso/inflamatório bacteriano."],
  },

  sepse_grave: {
    key: "sepse_grave",
    descricao: "Sepse / choque séptico (grande leucocitose ou leucopenia, plaquetopenia).",
    nivel: "grave",
    serieVermelha: { hemoglobina: "baixo" },
    serieBranca: { leucocitos: "muito_alto", neutrofilos: "alto", bastonetes: "muito_alto", linfocitos: "baixo" },
    plaquetas: { plaquetas: "baixo" },
    observacoes: ["Leucocitose acentuada com intenso desvio à esquerda.", "Plaquetopenia — atentar para coagulopatia de consumo.", "Correlacionar com sinais de gravidade/sepse."],
  },

  virose_inespecifica: {
    key: "virose_inespecifica",
    descricao: "Virose inespecífica (leucopenia com linfocitose relativa).",
    nivel: "leve",
    serieVermelha: {},
    serieBranca: { leucocitos: "baixo", neutrofilos: "baixo", linfocitos: "alto", monocitos: "alto" },
    plaquetas: {},
    observacoes: ["Leucopenia com linfocitose relativa — padrão viral inespecífico."],
  },

  dengue: {
    key: "dengue",
    descricao: "Dengue (leucopenia + plaquetopenia; hemoconcentração se alarme).",
    nivel: "moderado",
    serieVermelha: {},
    serieBranca: { leucocitos: "baixo", neutrofilos: "baixo", linfocitos: "alto" },
    plaquetas: { plaquetas: "baixo" },
    observacoes: ["Leucopenia com plaquetopenia — compatível com arbovirose (dengue).", "Monitorar plaquetas e hematócrito seriados."],
  },

  dengue_alarme: {
    key: "dengue_alarme",
    descricao: "Dengue com sinais de alarme (plaquetopenia acentuada + hemoconcentração).",
    nivel: "grave",
    serieVermelha: { hematocrito: "alto", hemoglobina: "alto" },
    serieBranca: { leucocitos: "baixo", linfocitos: "alto" },
    plaquetas: { plaquetas: "muito_baixo" },
    observacoes: ["Plaquetopenia acentuada com hemoconcentração (hematócrito elevado).", "Sinal de extravasamento plasmático — vigilância intensiva."],
  },

  anemia_ferropriva: {
    key: "anemia_ferropriva",
    descricao: "Anemia ferropriva (microcítica hipocrômica, RDW elevado).",
    nivel: "moderado",
    serieVermelha: { hemoglobina: "baixo", hematocrito: "baixo", vcm: "baixo", hcm: "baixo", chcm: "baixo", rdw: "alto" },
    serieBranca: {},
    plaquetas: { plaquetas: "alto" },
    observacoes: ["Anemia microcítica e hipocrômica com anisocitose (RDW elevado).", "Padrão sugestivo de carência de ferro — correlacionar com cinética do ferro."],
  },

  anemia_hemolitica: {
    key: "anemia_hemolitica",
    descricao: "Anemia hemolítica (normocítica, RDW elevado, reticulocitose).",
    nivel: "moderado",
    serieVermelha: { hemoglobina: "baixo", hematocrito: "baixo", rdw: "alto", vcm: "alto" },
    serieBranca: {},
    plaquetas: {},
    observacoes: ["Anemia com anisocitose e macrocitose discreta — sugestivo de resposta reticulocitária (hemólise).", "Correlacionar com bilirrubina, LDH e reticulócitos."],
  },

  anemia_megaloblastica: {
    key: "anemia_megaloblastica",
    descricao: "Anemia megaloblástica (macrocítica, B12/folato).",
    nivel: "moderado",
    serieVermelha: { hemoglobina: "baixo", hematocrito: "baixo", vcm: "muito_alto", hcm: "alto", rdw: "alto" },
    serieBranca: { leucocitos: "baixo", neutrofilos: "baixo" },
    plaquetas: { plaquetas: "baixo" },
    observacoes: ["Anemia macrocítica com anisocitose — sugestivo de deficiência de B12/folato.", "Pode haver neutrófilos hipersegmentados e citopenias leves."],
  },

  talassemia: {
    key: "talassemia",
    descricao: "Talassemia (microcitose intensa com hemácias preservadas/altas).",
    nivel: "moderado",
    serieVermelha: { hemoglobina: "baixo", vcm: "muito_baixo", hcm: "baixo", hemacias: "alto", rdw: "normal" },
    serieBranca: {},
    plaquetas: {},
    observacoes: ["Microcitose acentuada com contagem de hemácias preservada ou elevada.", "Sugestivo de talassemia — correlacionar com eletroforese de hemoglobina."],
  },

  anemia_doenca_cronica: {
    key: "anemia_doenca_cronica",
    descricao: "Anemia de doença crônica/renal (normocítica normocrômica leve).",
    nivel: "leve",
    serieVermelha: { hemoglobina: "baixo", hematocrito: "baixo" },
    serieBranca: {},
    plaquetas: {},
    observacoes: ["Anemia normocítica normocrômica leve — padrão de doença crônica/renal."],
  },

  leucemia_aguda: {
    key: "leucemia_aguda",
    descricao: "Leucemia aguda (anemia + plaquetopenia; leucócitos alterados/blastos).",
    nivel: "grave",
    serieVermelha: { hemoglobina: "muito_baixo", hematocrito: "baixo" },
    serieBranca: { leucocitos: "muito_alto", linfocitos: "alto", neutrofilos: "baixo" },
    plaquetas: { plaquetas: "muito_baixo" },
    observacoes: ["Anemia e plaquetopenia com leucometria alterada — atenção a células blásticas.", "IMPRESCINDÍVEL avaliação de esfregaço/mielograma. Encaminhamento hematológico urgente."],
  },

  trombocitopenia_imune: {
    key: "trombocitopenia_imune",
    descricao: "Púrpura trombocitopênica imune (plaquetopenia isolada).",
    nivel: "moderado",
    serieVermelha: {},
    serieBranca: {},
    plaquetas: { plaquetas: "muito_baixo", vpm: "alto" },
    observacoes: ["Plaquetopenia isolada com séries vermelha e branca preservadas.", "Compatível com destruição periférica (PTI) — correlacionar clinicamente."],
  },

  civd: {
    key: "civd",
    descricao: "Coagulação intravascular disseminada (plaquetopenia + esquizócitos).",
    nivel: "grave",
    serieVermelha: { hemoglobina: "baixo" },
    serieBranca: { leucocitos: "alto" },
    plaquetas: { plaquetas: "muito_baixo" },
    observacoes: ["Plaquetopenia com anemia — pesquisar esquizócitos (hemólise microangiopática).", "Correlacionar com coagulograma (TP/TTPa/fibrinogênio/D-dímero)."],
  },

  policitemia: {
    key: "policitemia",
    descricao: "Policitemia (hemácias/Hb/Ht elevados).",
    nivel: "moderado",
    serieVermelha: { hemacias: "alto", hemoglobina: "alto", hematocrito: "muito_alto" },
    serieBranca: { leucocitos: "alto" },
    plaquetas: { plaquetas: "alto" },
    observacoes: ["Eritrocitose com hematócrito elevado — investigar policitemia (primária/secundária)."],
  },

  eosinofilia_alergica: {
    key: "eosinofilia_alergica",
    descricao: "Padrão alérgico (eosinofilia).",
    nivel: "leve",
    serieVermelha: {},
    serieBranca: { eosinofilos: "alto" },
    plaquetas: {},
    observacoes: ["Eosinofilia — compatível com atopia/quadro alérgico ou parasitose."],
  },

  cronico_pulmonar_hipoxia: {
    key: "cronico_pulmonar_hipoxia",
    descricao: "Doença pulmonar crônica com hipóxia (poliglobulia secundária discreta).",
    nivel: "leve",
    serieVermelha: { hemoglobina: "alto", hematocrito: "alto" },
    serieBranca: {},
    plaquetas: {},
    observacoes: ["Discreta poliglobulia secundária à hipoxemia crônica."],
  },

  tuberculose: {
    key: "tuberculose",
    descricao: "Tuberculose (anemia leve de doença crônica, monocitose).",
    nivel: "leve",
    serieVermelha: { hemoglobina: "baixo" },
    serieBranca: { monocitos: "alto", linfocitos: "alto" },
    plaquetas: {},
    observacoes: ["Anemia leve de doença crônica com monocitose relativa — inespecífico, correlacionar."],
  },

  estresse_leucocitose_leve: {
    key: "estresse_leucocitose_leve",
    descricao: "Reação de estresse (leucocitose discreta) — ex.: SCA/IAM/TEP.",
    nivel: "leve",
    serieVermelha: {},
    serieBranca: { leucocitos: "alto", neutrofilos: "alto" },
    plaquetas: {},
    observacoes: ["Leucocitose discreta reacional — inespecífica ao evento agudo."],
  },

  citopenias_autoimunes: {
    key: "citopenias_autoimunes",
    descricao: "Citopenias imunes (LES/HIV): anemia + linfopenia + plaquetopenia.",
    nivel: "moderado",
    serieVermelha: { hemoglobina: "baixo", hematocrito: "baixo" },
    serieBranca: { leucocitos: "baixo", linfocitos: "baixo" },
    plaquetas: { plaquetas: "baixo" },
    observacoes: ["Bicitopenia/pancitopenia leve — compatível com processo autoimune/imunossupressão."],
  },
};

// ── Resolver: caso clínico → perfil ─────────────────────────────────────────
function norm(s: unknown): string {
  return String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/**
 * Resolve o perfil de hemograma a partir do caso ativo. Casa por diagnóstico/
 * categoria/título (mais específico primeiro). Sem match → inespecífico (TODO).
 */
export function resolveHemogramaProfileKey(caso: any): string {
  const texto = norm([
    caso?.diagnosticoCorreto,
    caso?.categoria,
    caso?.titulo,
    caso?.dados_ocultos_do_sistema?.diagnostico_principal,
  ].filter(Boolean).join(" | "));

  // Regras ordenadas (específicas antes das genéricas).
  const regras: Array<[RegExp, string]> = [
    [/sepse|choque septico|septico/, "sepse_grave"],
    [/leucemia|linfoblastica|mieloide aguda|blast/, "leucemia_aguda"],
    [/dengue.*(alarme|grave|hemorrag)|(alarme|grave).*dengue/, "dengue_alarme"],
    [/dengue|chikungunya|\bzika\b|febre amarela|arbovirose/, "dengue"],
    [/coagulacao intravascular|\bcivd\b|\bcid\b(?!.*diab)/, "civd"],
    [/purpura trombocitopenica|trombocitopenia imune|\bpti\b/, "trombocitopenia_imune"],
    [/talassemia/, "talassemia"],
    [/megaloblastica|vitamina b12|b12|folato/, "anemia_megaloblastica"],
    [/hemolitica|hemolise/, "anemia_hemolitica"],
    [/ferropriva|ferropenica|deficiencia de ferro/, "anemia_ferropriva"],
    [/policitemia|eritrocitose/, "policitemia"],
    [/mieloma/, "citopenias_autoimunes"],
    [/lupus|\bles\b|hiv|aids|pneumocist/, "citopenias_autoimunes"],
    [/insuficiencia renal|renal cronica|\birc\b|nefrite/, "anemia_doenca_cronica"],
    [/tuberculose/, "tuberculose"],
    [/pneumonia|endocardite|rinossinusite|infeccao bacteriana|pielonefrite|itu|celulite|meningite bacteriana/, "infeccao_bacteriana"],
    [/asma|atopia|alerg|rinite|bronquiolite/, "eosinofilia_alergica"],
    [/dpoc|enfisema|bronquite cronica/, "cronico_pulmonar_hipoxia"],
    [/viral inespecifica|infeccao viral|virose|viral/, "virose_inespecifica"],
    [/anemia/, "anemia_ferropriva"],
    [/sindrome coronariana|infarto|\biam\b|angina|\btep\b|tromboembol|\bsca\b/, "estresse_leucocitose_leve"],
  ];
  for (const [re, key] of regras) if (re.test(texto)) return key;

  // TODO: caso sem padrão hematológico claro — revisar manualmente se precisar de
  // um perfil dedicado (ex.: valvopatias, arritmias, HAS, puericultura, imagem).
  return "hemograma_normal_ou_inespecifico";
}

export function getHemogramaProfile(caso: any): HemogramaProfile {
  const key = resolveHemogramaProfileKey(caso);
  return HEMOGRAMA_PROFILES[key] ?? HEMOGRAMA_PROFILES.hemograma_normal_ou_inespecifico;
}
