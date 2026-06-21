// Atlas visual de imagens educativas para achados do exame físico pediátrico
// Cada imagem corresponde a achados clínicos específicos

export type ImagemAchadoPediatrico = {
  id: string;
  titulo: string;
  descricao: string;
  src: string;
  alt: string;
  tipo: "close_up" | "comparativo" | "diagrama" | "ilustracao" | "manequim";
  tags: string[];
  prioridade?: number;
};

export const IMAGENS_ACHADOS_PEDIATRICOS: Record<string, ImagemAchadoPediatrico> = {
  "cianose-central": {
    id: "cianose-central",
    titulo: "Cianose central",
    descricao: "Coloração azulada discreta em lábios e mucosa oral, sugestiva de hipoxemia.",
    src: "/images/pediatria/achados/cianose-central.png",
    alt: "Ilustração anatômica infantil de cianose central em região perioral",
    tipo: "close_up",
    tags: ["cianose", "hipoxemia", "cardiologia", "pele", "mucosas"],
    prioridade: 1,
  },

  "palidez-conjuntival-comparativo": {
    id: "palidez-conjuntival-comparativo",
    titulo: "Palidez conjuntival",
    descricao: "Comparativo entre conjuntiva normocorada e conjuntiva pálida.",
    src: "/images/pediatria/achados/palidez-conjuntival-comparativo.png",
    alt: "Comparativo anatômico infantil entre conjuntiva normocorada e palidez conjuntival",
    tipo: "comparativo",
    tags: ["palidez", "anemia", "conjuntiva", "olhos", "hipoperfusão"],
    prioridade: 1,
  },

  "exantema-maculopapular": {
    id: "exantema-maculopapular",
    titulo: "Exantema maculopapular",
    descricao: "Lesões cutâneas pequenas, róseo-avermelhadas, planas e discretamente elevadas.",
    src: "/images/pediatria/achados/exantema-maculopapular.png",
    alt: "Ilustração anatômica infantil de exantema maculopapular em pele clara",
    tipo: "close_up",
    tags: ["exantema", "pele", "rash", "viroses", "dengue"],
    prioridade: 1,
  },

  "exantema-maculopapular-pele-negra": {
    id: "exantema-maculopapular-pele-negra",
    titulo: "Exantema maculopapular em pele negra",
    descricao: "Exantema em pele negra com alteração de tonalidade mais sutil, castanho-avermelhada ou violácea.",
    src: "/images/pediatria/achados/exantema-maculopapular-pele-negra.png",
    alt: "Ilustração anatômica infantil de exantema maculopapular em pele negra",
    tipo: "close_up",
    tags: ["exantema", "pele negra", "rash", "viroses", "dengue"],
    prioridade: 2,
  },

  "petequias": {
    id: "petequias",
    titulo: "Petéquias",
    descricao: "Pequenas lesões puntiformes vermelho-arroxeadas, planas e bem delimitadas.",
    src: "/images/pediatria/achados/petequias.png",
    alt: "Ilustração anatômica infantil de petéquias em pequena área de pele",
    tipo: "close_up",
    tags: ["petequias", "pele", "dengue", "sangramento", "exantema"],
    prioridade: 1,
  },

  "ausculta-cardiaca-focos": {
    id: "ausculta-cardiaca-focos",
    titulo: "Focos de ausculta cardíaca",
    descricao: "Diagrama dos principais focos de ausculta cardíaca pediátrica.",
    src: "/images/pediatria/achados/ausculta-cardiaca-focos.png",
    alt: "Diagrama anatômico infantil dos focos de ausculta cardíaca",
    tipo: "diagrama",
    tags: ["ausculta", "cardiologia", "precórdio", "sopro", "bulhas"],
    prioridade: 1,
  },
};

/**
 * Obtém uma imagem de achado pelo ID
 * Retorna null se não encontrada para permitir fallback gracioso
 */
export function obterImagemAchadoPediatrico(id?: string | null): ImagemAchadoPediatrico | null {
  if (!id) return null;
  return IMAGENS_ACHADOS_PEDIATRICOS[id] ?? null;
}

/**
 * Verifica se uma imagem existe no mapeamento
 * Útil para validações antes de tentar renderizar
 */
export function existeImagemAchado(id?: string | null): boolean {
  if (!id) return false;
  return id in IMAGENS_ACHADOS_PEDIATRICOS;
}

/**
 * Retorna todas as imagens cadastradas (útil para debug/admin)
 */
export function obterTodasImagensAchados(): ImagemAchadoPediatrico[] {
  return Object.values(IMAGENS_ACHADOS_PEDIATRICOS).sort((a, b) => (b.prioridade ?? 0) - (a.prioridade ?? 0));
}
