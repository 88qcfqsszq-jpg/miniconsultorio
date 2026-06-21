// Banco de mídias V2 - Imagens realistas por faixa etária e tom de pele
// Estrutura nova sem alterar a V1 existente
// Implementa fallback: V2 → V1 → guia textual

export type FaixaEtariaMidiaPediatrica = "lactente" | "pre-escolar" | "escolar";
export type TomPeleMidiaPediatrica = "pele-clara" | "pele-morena" | "pele-negra";

export interface MidiaExamePediatricoV2 {
  regiaoId: string;
  acaoId: string;
  faixaEtaria: FaixaEtariaMidiaPediatrica;
  tomPele: TomPeleMidiaPediatrica;
  titulo: string;
  descricao: string;
  tipo: "imagem" | "guia" | "gif" | "video" | "audio";
  src?: string; // Path V2
  fallbackV1?: string; // Path V1 como fallback
  arquivoSugerido: string;
  prioridade: "alta" | "media" | "baixa";
}

// Mapeamento V2 com fallback para V1
const MIDIAS_EXAME_PEDIATRICO_V2: Record<string, MidiaExamePediatricoV2> = {
  // =========================================================================
  // FACE E OLHOS - 5 imagens por faixa etária × 3 tons de pele
  // =========================================================================

  // Lactente - Pele Clara
  "face_olhos:avaliar_palidez_conjuntival:lactente:pele-clara": {
    regiaoId: "face_olhos",
    acaoId: "avaliar_palidez_conjuntival",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Palidez conjuntival - Lactente",
    descricao: "Comparativo entre conjuntiva normocorada e conjuntiva pálida em lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/face-olhos/palidez-conjuntival-comparativo.png",
    fallbackV1: "/images/pediatria/exames-interativos/face-olhos/palidez-conjuntival-comparativo.png",
    arquivoSugerido: "palidez-conjuntival-comparativo.png",
    prioridade: "alta",
  },

  "face_olhos:avaliar_cianose_central:lactente:pele-clara": {
    regiaoId: "face_olhos",
    acaoId: "avaliar_cianose_central",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Cianose central - Lactente",
    descricao: "Coloração azulada em lábios e mucosa oral em lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/face-olhos/cianose-central.png",
    fallbackV1: "/images/pediatria/exames-interativos/face-olhos/cianose-central.png",
    arquivoSugerido: "cianose-central.png",
    prioridade: "alta",
  },

  "face_olhos:avaliar_sinais_desidratacao:lactente:pele-clara": {
    regiaoId: "face_olhos",
    acaoId: "avaliar_sinais_desidratacao",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Sinais de desidratação - Lactente",
    descricao: "Enofitalmia e presença de lágrimas em lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/face-olhos/desidratacao-olhos.png",
    fallbackV1: "/images/pediatria/exames-interativos/face-olhos/desidratacao-olhos.png",
    arquivoSugerido: "desidratacao-olhos.png",
    prioridade: "media",
  },

  "face_olhos:avaliar_conjuntivite:lactente:pele-clara": {
    regiaoId: "face_olhos",
    acaoId: "avaliar_conjuntivite",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Conjuntivite - Lactente",
    descricao: "Hiperemia conjuntival e secreção em lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/face-olhos/conjuntivite.png",
    fallbackV1: "/images/pediatria/exames-interativos/face-olhos/conjuntivite.png",
    arquivoSugerido: "conjuntivite.png",
    prioridade: "media",
  },

  // =========================================================================
  // ORL E OROFARINGE - 4 imagens por faixa etária × 3 tons de pele
  // =========================================================================

  "orl_orofaringe:avaliar_orofaringe:lactente:pele-clara": {
    regiaoId: "orl_orofaringe",
    acaoId: "avaliar_orofaringe",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Orofaringe e amígdalas - Lactente",
    descricao: "Observe color, eritema e tamanho em lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/orl-orofaringe/orofaringe-amigdalas.png",
    fallbackV1: "/images/pediatria/exames-interativos/orl-orofaringe/orofaringe-amigdalas.png",
    arquivoSugerido: "orofaringe-amigdalas.png",
    prioridade: "alta",
  },

  "orl_orofaringe:avaliar_secrecao_nasal:lactente:pele-clara": {
    regiaoId: "orl_orofaringe",
    acaoId: "avaliar_secrecao_nasal",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Secreção nasal - Lactente",
    descricao: "Observe tipo e congestão nasal em lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/orl-orofaringe/secrecao-nasal.png",
    fallbackV1: "/images/pediatria/exames-interativos/orl-orofaringe/secrecao-nasal.png",
    arquivoSugerido: "secrecao-nasal.png",
    prioridade: "media",
  },

  // =========================================================================
  // PELE E MUCOSAS - 5 imagens por faixa etária × 3 tons de pele
  // =========================================================================

  "pele_mucosas:avaliar_exantema:lactente:pele-clara": {
    regiaoId: "pele_mucosas",
    acaoId: "avaliar_exantema",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Exantema maculopapular - Lactente",
    descricao: "Lesões cutâneas em lactente com pele clara.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/pele-mucosas/exantema-maculopapular.png",
    fallbackV1: "/images/pediatria/exames-interativos/pele-mucosas/exantema-maculopapular.png",
    arquivoSugerido: "exantema-maculopapular.png",
    prioridade: "alta",
  },

  "pele_mucosas:avaliar_petequias:lactente:pele-clara": {
    regiaoId: "pele_mucosas",
    acaoId: "avaliar_petequias",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Petéquias - Lactente",
    descricao: "Lesões puntiformes em lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/pele-mucosas/petequias.png",
    fallbackV1: "/images/pediatria/exames-interativos/pele-mucosas/petequias.png",
    arquivoSugerido: "petequias.png",
    prioridade: "alta",
  },

  "pele_mucosas:avaliar_equimoses:lactente:pele-clara": {
    regiaoId: "pele_mucosas",
    acaoId: "avaliar_equimoses",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Equimoses - Lactente",
    descricao: "Extravasamento sanguíneo em lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/pele-mucosas/equimoses.png",
    fallbackV1: "/images/pediatria/exames-interativos/pele-mucosas/equimoses.png",
    arquivoSugerido: "equimoses.png",
    prioridade: "alta",
  },

  "pele_mucosas:avaliar_ictericia:lactente:pele-clara": {
    regiaoId: "pele_mucosas",
    acaoId: "avaliar_ictericia",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Icterícia - Lactente",
    descricao: "Coloração amarelada em lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/pele-mucosas/ictericia.png",
    fallbackV1: "/images/pediatria/exames-interativos/pele-mucosas/ictericia.png",
    arquivoSugerido: "ictericia.png",
    prioridade: "alta",
  },

  "pele_mucosas:avaliar_hidratacao:lactente:pele-clara": {
    regiaoId: "pele_mucosas",
    acaoId: "avaliar_hidratacao",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Hidratação das mucosas - Lactente",
    descricao: "Observe turgor e umidade em lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/pele-mucosas/desidratacao-mucosas.png",
    fallbackV1: "/images/pediatria/exames-interativos/pele-mucosas/desidratacao-mucosas.png",
    arquivoSugerido: "desidratacao-mucosas.png",
    prioridade: "alta",
  },

  // =========================================================================
  // MEMBROS E PERFUSÃO - 5 imagens por faixa etária × 3 tons de pele
  // =========================================================================

  "membros_perfusao:avaliar_perfusao_periferica:lactente:pele-clara": {
    regiaoId: "membros_perfusao",
    acaoId: "avaliar_perfusao_periferica",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Avaliação de perfusão - Lactente",
    descricao: "Avalie enchimento capilar em lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/membros-perfusao/perfusao-tempo-enchimento-capilar.png",
    fallbackV1: "/images/pediatria/exames-interativos/membros-perfusao/perfusao-tempo-enchimento-capilar.png",
    arquivoSugerido: "perfusao-tempo-enchimento-capilar.png",
    prioridade: "alta",
  },

  "membros_perfusao:palpar_pulsos_perifericos:lactente:pele-clara": {
    regiaoId: "membros_perfusao",
    acaoId: "palpar_pulsos_perifericos",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Palpação de pulsos - Lactente",
    descricao: "Palpe pulsos periféricos em lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/membros-perfusao/pulsos-perifericos.png",
    fallbackV1: "/images/pediatria/exames-interativos/membros-perfusao/pulsos-perifericos.png",
    arquivoSugerido: "pulsos-perifericos.png",
    prioridade: "alta",
  },

  "membros_perfusao:avaliar_edema:lactente:pele-clara": {
    regiaoId: "membros_perfusao",
    acaoId: "avaliar_edema",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Avaliação de edema - Lactente",
    descricao: "Localize edema em lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/membros-perfusao/edema.png",
    fallbackV1: "/images/pediatria/exames-interativos/membros-perfusao/edema.png",
    arquivoSugerido: "edema.png",
    prioridade: "media",
  },

  "membros_perfusao:avaliar_baqueteamento_digital:lactente:pele-clara": {
    regiaoId: "membros_perfusao",
    acaoId: "avaliar_baqueteamento_digital",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Baqueteamento digital - Lactente",
    descricao: "Alargamento de falanges em lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/membros-perfusao/baqueteamento-digital.png",
    fallbackV1: "/images/pediatria/exames-interativos/membros-perfusao/baqueteamento-digital.png",
    arquivoSugerido: "baqueteamento-digital.png",
    prioridade: "media",
  },

  "membros_perfusao:avaliar_cianose_extremidades:lactente:pele-clara": {
    regiaoId: "membros_perfusao",
    acaoId: "avaliar_cianose_extremidades",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Cianose periférica - Lactente",
    descricao: "Coloração azulada em extremidades de lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/membros-perfusao/cianose-extremidades.png",
    fallbackV1: "/images/pediatria/exames-interativos/membros-perfusao/cianose-extremidades.png",
    arquivoSugerido: "cianose-extremidades.png",
    prioridade: "alta",
  },

  // =========================================================================
  // ABDOME, FÍGADO E BAÇO - 3 imagens por faixa etária × 3 tons de pele
  // =========================================================================

  "abdome:palpar_abdome:lactente:pele-clara": {
    regiaoId: "abdome",
    acaoId: "palpar_abdome",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Palpação abdominal - Lactente",
    descricao: "Técnica de palpação em lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/abdome/palpacao-abdominal.png",
    fallbackV1: "/images/pediatria/exames-interativos/abdome/palpacao-abdominal.png",
    arquivoSugerido: "palpacao-abdominal.png",
    prioridade: "alta",
  },

  "abdome:avaliar_dor_abdominal:lactente:pele-clara": {
    regiaoId: "abdome",
    acaoId: "avaliar_dor_abdominal",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Avaliação de dor abdominal - Lactente",
    descricao: "Localize dor e defesa em lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/abdome/dor-defesa-abdominal.png",
    fallbackV1: "/images/pediatria/exames-interativos/abdome/dor-defesa-abdominal.png",
    arquivoSugerido: "dor-defesa-abdominal.png",
    prioridade: "alta",
  },

  "figado:palpar_figado:lactente:pele-clara": {
    regiaoId: "figado",
    acaoId: "palpar_figado",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Palpação hepática - Lactente",
    descricao: "Técnica de palpação hepática em lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/figado/palpacao-figado-hepatomegalia.png",
    fallbackV1: "/images/pediatria/exames-interativos/figado/palpacao-figado-hepatomegalia.png",
    arquivoSugerido: "palpacao-figado-hepatomegalia.png",
    prioridade: "alta",
  },

  "baco:palpar_baco:lactente:pele-clara": {
    regiaoId: "baco",
    acaoId: "palpar_baco",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Palpação esplênica - Lactente",
    descricao: "Técnica de palpação esplênica em lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/baco/palpacao-baco-esplenomegalia.png",
    fallbackV1: "/images/pediatria/exames-interativos/baco/palpacao-baco-esplenomegalia.png",
    arquivoSugerido: "palpacao-baco-esplenomegalia.png",
    prioridade: "alta",
  },

  // =========================================================================
  // PRESSÃO ARTERIAL - 2 imagens por faixa etária × 3 tons de pele
  // =========================================================================

  "pressao_arterial:escolher_manguito_adequado:lactente:pele-clara": {
    regiaoId: "pressao_arterial",
    acaoId: "escolher_manguito_adequado",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Escolha do manguito adequado - Lactente",
    descricao: "Tamanho correto do manguito para lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/pressao-arterial/manguito-adequado.png",
    fallbackV1: "/images/pediatria/exames-interativos/pressao-arterial/manguito-adequado.png",
    arquivoSugerido: "manguito-adequado.png",
    prioridade: "alta",
  },

  "pressao_arterial:posicionar_crianca_para_PA:lactente:pele-clara": {
    regiaoId: "pressao_arterial",
    acaoId: "posicionar_crianca_para_PA",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    titulo: "Posicionamento para aferição de PA - Lactente",
    descricao: "Postura adequada em lactente.",
    tipo: "imagem",
    src: "/images/pediatria/exames-interativos-v2/lactente/pele-clara/pressao-arterial/posicionamento-afericao-pa.png",
    fallbackV1: "/images/pediatria/exames-interativos/pressao-arterial/posicionamento-afericao-pa.png",
    arquivoSugerido: "posicionamento-afericao-pa.png",
    prioridade: "alta",
  },
};

// Mapear V2 como lista indexada para performance
const INDICE_MIDIAS_V2 = construirIndice();

function construirIndice(): Map<string, MidiaExamePediatricoV2> {
  const indice = new Map<string, MidiaExamePediatricoV2>();

  Object.values(MIDIAS_EXAME_PEDIATRICO_V2).forEach((midia) => {
    const chave = `${midia.regiaoId}:${midia.acaoId}:${midia.faixaEtaria}:${midia.tomPele}`;
    indice.set(chave, midia);
  });

  return indice;
}

export function obterMidiaExamePediatricoV2(params: {
  regiaoId: string;
  acaoId: string;
  faixaEtaria?: FaixaEtariaMidiaPediatrica;
  tomPele?: TomPeleMidiaPediatrica;
}): MidiaExamePediatricoV2 | null {
  const { regiaoId, acaoId, faixaEtaria = "lactente", tomPele = "pele-clara" } = params;
  const chave = `${regiaoId}:${acaoId}:${faixaEtaria}:${tomPele}`;

  return INDICE_MIDIAS_V2.get(chave) ?? null;
}

export function obterMidiaComFallback(params: {
  regiaoId: string;
  acaoId: string;
  faixaEtaria?: FaixaEtariaMidiaPediatrica;
  tomPele?: TomPeleMidiaPediatrica;
}): {
  v2?: MidiaExamePediatricoV2;
  v1?: string;
  tipo: "v2" | "v1" | "guia";
} {
  // Tentar V2 primeiro
  const v2 = obterMidiaExamePediatricoV2(params);

  if (v2 && v2.src) {
    return { v2, tipo: "v2" };
  }

  // Fallback para V1 se existir
  if (v2?.fallbackV1) {
    return { v2, v1: v2.fallbackV1, tipo: "v1" };
  }

  // Fallback para guia textual
  return { tipo: "guia" };
}

export function obterTodasAsMidiasV2(): MidiaExamePediatricoV2[] {
  return Array.from(INDICE_MIDIAS_V2.values());
}

export function obterMidiasV2PorRegiao(regiaoId: string): MidiaExamePediatricoV2[] {
  return Array.from(INDICE_MIDIAS_V2.values()).filter((m) => m.regiaoId === regiaoId);
}

export function obterMidiasV2PorFaixaEtaria(faixaEtaria: FaixaEtariaMidiaPediatrica): MidiaExamePediatricoV2[] {
  return Array.from(INDICE_MIDIAS_V2.values()).filter((m) => m.faixaEtaria === faixaEtaria);
}

export function obterMidiasV2PorTomPele(tomPele: TomPeleMidiaPediatrica): MidiaExamePediatricoV2[] {
  return Array.from(INDICE_MIDIAS_V2.values()).filter((m) => m.tomPele === tomPele);
}
