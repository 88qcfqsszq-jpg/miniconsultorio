// ============================================================================
// Exame Físico Adulto Visual — Fase 2 piloto: achados por CASO ativo
// ----------------------------------------------------------------------------
// Mesma ação + caso diferente = achado diferente. As chaves de ação usam os
// IDs reais de `exame-fisico-adulto-mapa.ts`. `funcaoClinica` está preparado
// para a próxima etapa e NÃO é usado em nota/feedback/HealthBench nesta fase.
// Casos não mapeados caem no achado normal genérico da Fase 1 (fallback).
// ============================================================================

export type FuncaoClinicaExame =
  | "exame_basal"
  | "confirma_hipotese"
  | "avalia_gravidade"
  | "busca_complicacao"
  | "afasta_diferencial"
  | "baixo_rendimento";

export type AchadoExameAdultoPorAcao = {
  texto: string;
  funcaoClinica?: FuncaoClinicaExame[];
};

export type AchadosExameAdultoPorCaso = {
  diagnostico: string;
  achados: Record<string, AchadoExameAdultoPorAcao>;
};

// Caso 15/30 — Doença Arterial Periférica (mesmo conjunto de achados)
const ACHADOS_DAOP: Record<string, AchadoExameAdultoPorAcao> = {
  estado_geral: {
    texto:
      "Paciente em bom estado geral aparente, sem sinais de instabilidade clínica aguda.",
    funcaoClinica: ["exame_basal"],
  },
  perfusao_global: {
    texto: "Perfusão periférica distal reduzida em membros inferiores.",
    funcaoClinica: ["confirma_hipotese", "avalia_gravidade"],
  },
  // Vascular/Membros > Membros inferiores
  inspecionar_mi: {
    texto:
      "Membros inferiores com pele discretamente fria e brilhante, rarefação de pelos e sinais tróficos compatíveis com doença arterial periférica.",
    funcaoClinica: ["confirma_hipotese"],
  },
  temperatura_pes: {
    texto: "Pés frios, com perfusão distal reduzida.",
    funcaoClinica: ["confirma_hipotese", "avalia_gravidade"],
  },
  pulsos_perifericos: {
    texto:
      "Pulsos pediosos e tibiais posteriores diminuídos bilateralmente, mais evidentes distalmente.",
    funcaoClinica: ["confirma_hipotese", "avalia_gravidade"],
  },
  doenca_arterial: {
    texto:
      "Presença de sinais tróficos de doença arterial periférica, com pele fria, brilhante e redução de pelos em membros inferiores.",
    funcaoClinica: ["confirma_hipotese"],
  },
  insuficiencia_venosa: {
    texto:
      "Ausência de dermatite ocre importante, varizes exuberantes ou úlcera venosa típica.",
    funcaoClinica: ["afasta_diferencial"],
  },
  palpar_edema: {
    texto:
      "Ausência de edema com cacifo significativo em membros inferiores.",
    funcaoClinica: ["afasta_diferencial"],
  },
  palpar_panturrilhas: {
    texto:
      "Panturrilhas indolores, sem empastamento ou aumento de temperatura local.",
    funcaoClinica: ["afasta_diferencial"],
  },
  // Vascular/Membros > Membros superiores
  pulsos_radiais: {
    texto: "Pulsos radiais presentes e simétricos.",
    funcaoClinica: ["exame_basal"],
  },
  // Tórax > Cardiovascular
  auscultar_focos: {
    texto: "Bulhas rítmicas, normofonéticas, sem sopros evidentes.",
    funcaoClinica: ["exame_basal"],
  },
};

export const ACHADOS_EXAME_ADULTO_POR_CASO: Record<
  number,
  AchadosExameAdultoPorCaso
> = {
  // ----------------------------------------------------------------------
  1: {
    diagnostico: "Dor Torácica - Síndrome Coronariana Aguda",
    achados: {
      estado_geral: {
        texto:
          "Paciente em regular estado geral, com fácies de desconforto torácico e ansiedade discreta.",
        funcaoClinica: ["exame_basal", "avalia_gravidade"],
      },
      consciencia: {
        texto:
          "Paciente alerta, consciente e orientado, colaborativo durante o exame.",
        funcaoClinica: ["exame_basal"],
      },
      padrao_respiratorio_geral: {
        texto:
          "Paciente eupneico ou discretamente taquipneico, sem sinais importantes de desconforto respiratório.",
        funcaoClinica: ["exame_basal", "avalia_gravidade"],
      },
      coloracao_pele: {
        texto:
          "Pele discretamente pálida, sem cianose central ou icterícia evidente.",
        funcaoClinica: ["avalia_gravidade"],
      },
      perfusao_global: {
        texto:
          "Extremidades perfundidas, tempo de enchimento capilar preservado.",
        funcaoClinica: ["avalia_gravidade"],
      },
      turgencia_jugular: {
        texto: "Ausência de turgência jugular patológica.",
        funcaoClinica: ["busca_complicacao", "afasta_diferencial"],
      },
      inspecionar_precordio: {
        texto: "Precórdio sem abaulamentos ou impulsões visíveis.",
        funcaoClinica: ["exame_basal"],
      },
      palpar_ictus: {
        texto:
          "Ictus cordis palpável em localização habitual, sem desvio evidente.",
        funcaoClinica: ["afasta_diferencial"],
      },
      auscultar_focos: {
        texto: "Bulhas rítmicas, normofonéticas, sem sopros evidentes.",
        funcaoClinica: ["exame_basal", "afasta_diferencial"],
      },
      pesquisar_sopros: {
        texto: "Sem sopros cardíacos audíveis.",
        funcaoClinica: ["afasta_diferencial"],
      },
      atrito_pericardico: {
        texto: "Ausência de atrito pericárdico audível.",
        funcaoClinica: ["afasta_diferencial"],
      },
      auscultar_anterior: {
        texto:
          "Murmúrio vesicular presente bilateralmente, sem sibilos ou crepitações.",
        funcaoClinica: ["afasta_diferencial"],
      },
      auscultar_posterior: {
        texto:
          "Murmúrio vesicular presente bilateralmente, sem ruídos adventícios.",
        funcaoClinica: ["afasta_diferencial", "busca_complicacao"],
      },
      palpar_edema: {
        texto: "Ausência de edema em membros inferiores.",
        funcaoClinica: ["busca_complicacao"],
      },
    },
  },
  // ----------------------------------------------------------------------
  2: {
    diagnostico: "Pneumonia Adquirida na Comunidade",
    achados: {
      estado_geral: {
        texto:
          "Paciente em regular estado geral, com aspecto febril e discretamente prostrado.",
        funcaoClinica: ["exame_basal", "avalia_gravidade"],
      },
      padrao_respiratorio_geral: {
        texto:
          "Paciente taquipneica, com discreto aumento do trabalho respiratório.",
        funcaoClinica: ["avalia_gravidade"],
      },
      coloracao_pele: {
        texto: "Pele normocorada, sem cianose central evidente.",
        funcaoClinica: ["avalia_gravidade"],
      },
      hidratacao_mucosa_oral: {
        texto: "Mucosa oral discretamente seca, compatível com quadro febril.",
        funcaoClinica: ["exame_basal"],
      },
      padrao_respiratorio: {
        texto: "Padrão respiratório taquipneico, sem tiragens importantes.",
        funcaoClinica: ["avalia_gravidade"],
      },
      esforco_respiratorio: {
        texto:
          "Esforço respiratório levemente aumentado, sem uso importante de musculatura acessória.",
        funcaoClinica: ["avalia_gravidade"],
      },
      auscultar_anterior: {
        texto:
          "Murmúrio vesicular presente, com crepitações discretas em hemitórax direito.",
        funcaoClinica: ["confirma_hipotese"],
      },
      expansibilidade_posterior: {
        texto:
          "Expansibilidade torácica discretamente reduzida em base direita.",
        funcaoClinica: ["confirma_hipotese"],
      },
      fremito_toracovocal: {
        texto: "Frêmito toracovocal aumentado em base pulmonar direita.",
        funcaoClinica: ["confirma_hipotese"],
      },
      percutir_posterior: {
        texto: "Macicez discreta à percussão em base pulmonar direita.",
        funcaoClinica: ["confirma_hipotese"],
      },
      auscultar_posterior: {
        texto:
          "Crepitações localizadas em base pulmonar direita, com murmúrio vesicular discretamente reduzido na mesma região.",
        funcaoClinica: ["confirma_hipotese", "avalia_gravidade"],
      },
      turgencia_jugular: {
        texto: "Ausência de turgência jugular patológica.",
        funcaoClinica: ["afasta_diferencial"],
      },
      auscultar_focos: {
        texto: "Bulhas rítmicas, normofonéticas, sem sopros evidentes.",
        funcaoClinica: ["afasta_diferencial"],
      },
    },
  },
  // ----------------------------------------------------------------------
  3: {
    diagnostico: "Asma Aguda",
    achados: {
      estado_geral: {
        texto:
          "Paciente em regular estado geral, ansioso, com desconforto respiratório leve a moderado.",
        funcaoClinica: ["exame_basal", "avalia_gravidade"],
      },
      padrao_respiratorio_geral: {
        texto: "Paciente taquipneico, com fala levemente entrecortada.",
        funcaoClinica: ["avalia_gravidade"],
      },
      coloracao_pele: {
        texto: "Pele normocorada, sem cianose central evidente.",
        funcaoClinica: ["avalia_gravidade"],
      },
      labios: {
        texto: "Lábios sem cianose evidente.",
        funcaoClinica: ["avalia_gravidade"],
      },
      padrao_respiratorio: {
        texto: "Padrão respiratório taquipneico, com expiração prolongada.",
        funcaoClinica: ["confirma_hipotese", "avalia_gravidade"],
      },
      esforco_respiratorio: {
        texto:
          "Uso leve de musculatura acessória, com tiragens intercostais discretas.",
        funcaoClinica: ["avalia_gravidade"],
      },
      expansibilidade_anterior: {
        texto:
          "Expansibilidade torácica preservada, com discreta hiperinsuflação dinâmica.",
        funcaoClinica: ["confirma_hipotese"],
      },
      auscultar_anterior: {
        texto: "Sibilos expiratórios difusos bilateralmente.",
        funcaoClinica: ["confirma_hipotese", "avalia_gravidade"],
      },
      fremito_toracovocal: {
        texto: "Frêmito toracovocal preservado, sem sinais de consolidação.",
        funcaoClinica: ["afasta_diferencial"],
      },
      percutir_posterior: {
        texto: "Som claro pulmonar bilateral, sem macicez.",
        funcaoClinica: ["afasta_diferencial"],
      },
      auscultar_posterior: {
        texto:
          "Sibilos expiratórios difusos bilateralmente, sem crepitações localizadas.",
        funcaoClinica: ["confirma_hipotese", "avalia_gravidade"],
      },
      auscultar_focos: {
        texto: "Bulhas rítmicas, taquicárdicas, sem sopros evidentes.",
        funcaoClinica: ["avalia_gravidade", "afasta_diferencial"],
      },
    },
  },
  // ----------------------------------------------------------------------
  8: {
    diagnostico: "Insuficiência Cardíaca Esquerda",
    achados: {
      estado_geral: {
        texto:
          "Paciente em regular estado geral, com fácies de cansaço e dispneia aos pequenos esforços.",
        funcaoClinica: ["exame_basal", "avalia_gravidade"],
      },
      padrao_respiratorio_geral: {
        texto: "Paciente taquipneica, com dispneia leve em repouso.",
        funcaoClinica: ["avalia_gravidade"],
      },
      coloracao_pele: {
        texto: "Pele normocorada, sem cianose central evidente.",
        funcaoClinica: ["avalia_gravidade"],
      },
      turgencia_jugular: {
        texto: "Turgência jugular discretamente presente a 45 graus.",
        funcaoClinica: ["busca_complicacao", "avalia_gravidade"],
      },
      inspecionar_precordio: {
        texto: "Precórdio sem abaulamentos, com ictus discretamente visível.",
        funcaoClinica: ["confirma_hipotese"],
      },
      palpar_ictus: {
        texto:
          "Ictus cordis desviado lateralmente, sugestivo de aumento de área cardíaca.",
        funcaoClinica: ["confirma_hipotese"],
      },
      auscultar_focos: {
        texto: "Bulhas rítmicas, com presença de terceira bulha.",
        funcaoClinica: ["confirma_hipotese", "avalia_gravidade"],
      },
      pesquisar_sopros: {
        texto: "Sem sopros cardíacos intensos evidentes nesta avaliação.",
        funcaoClinica: ["afasta_diferencial"],
      },
      esforco_respiratorio: {
        texto: "Esforço respiratório discretamente aumentado.",
        funcaoClinica: ["avalia_gravidade"],
      },
      auscultar_anterior: {
        texto:
          "Crepitações discretas em bases pulmonares, mais audíveis posteriormente.",
        funcaoClinica: ["busca_complicacao"],
      },
      expansibilidade_posterior: {
        texto:
          "Expansibilidade torácica preservada, com desconforto respiratório leve.",
        funcaoClinica: ["avalia_gravidade"],
      },
      auscultar_posterior: {
        texto:
          "Crepitações bibasais, mais evidentes em bases pulmonares, compatíveis com congestão pulmonar.",
        funcaoClinica: ["confirma_hipotese", "busca_complicacao", "avalia_gravidade"],
      },
      palpar_edema: {
        texto:
          "Edema bilateral discreto em membros inferiores, com cacifo +/4+.",
        funcaoClinica: ["busca_complicacao", "confirma_hipotese"],
      },
      pulsos_perifericos: {
        texto: "Pulsos periféricos palpáveis, sem assimetria importante.",
        funcaoClinica: ["exame_basal"],
      },
    },
  },
  // ----------------------------------------------------------------------
  15: {
    diagnostico: "Doença Arterial Obstrutiva Periférica",
    achados: ACHADOS_DAOP,
  },
  30: {
    diagnostico: "Doença Arterial Oclusiva Periférica com Claudicação",
    achados: ACHADOS_DAOP,
  },
};

/**
 * Texto do achado para uma ação no caso ativo, ou null se não houver
 * (o componente cai no achado normal genérico da Fase 1).
 */
export function getAchadoPorCaso(
  casoId: number | string | undefined,
  actionId: string
): string | null {
  const id = Number(casoId);
  if (!Number.isFinite(id)) return null;
  return ACHADOS_EXAME_ADULTO_POR_CASO[id]?.achados?.[actionId]?.texto ?? null;
}
