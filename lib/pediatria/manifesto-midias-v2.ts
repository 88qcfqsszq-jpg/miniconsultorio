// Manifesto de imagens realistas V2
// Lista COMPLETA e EXPLÍCITA das 225 imagens esperadas
// Todas as combinações de faixa etária × tom de pele × região × achado
// Status inicial: todas pendentes

export type FaixaEtaria = "lactente" | "pre-escolar" | "escolar";
export type TomPele = "pele-clara" | "pele-morena" | "pele-negra";
export type Regiao =
  | "face-olhos"
  | "orl-orofaringe"
  | "pele-mucosas"
  | "membros-perfusao"
  | "abdome"
  | "figado"
  | "baco"
  | "pressao-arterial";

export type StatusImagem = "pendente" | "em-progresso" | "disponivel" | "revisao";

export interface ManifestoImagemV2 {
  id: string;
  faixaEtaria: FaixaEtaria;
  tomPele: TomPele;
  regiao: Regiao;
  achadoClinico: string;
  tituloExibicao: string;
  nomeArquivo: string;
  caminhoCompleto: string;
  status: StatusImagem;
  descricaoExpectativa: string;
  dataCriacao?: string;
  ultimaAtualizacao?: string;
}

// ============================================================================
// GERADOR: 225 IMAGENS COMPLETAS
// ============================================================================

const FAIXAS_ETARIAS: FaixaEtaria[] = ["lactente", "pre-escolar", "escolar"];
const TONS_PELE: TomPele[] = ["pele-clara", "pele-morena", "pele-negra"];

// Estrutura de regiões com seus achados
const REGIOES_ACHADOS: Record<Regiao, { achado: string; titulo: string; descricao: string }[]> = {
  "face-olhos": [
    {
      achado: "palidez-conjuntival",
      titulo: "Palidez conjuntival",
      descricao: "Comparativo entre conjuntiva normocorada e conjuntiva pálida",
    },
    {
      achado: "cianose-central",
      titulo: "Cianose central",
      descricao: "Coloração azulada em lábios e mucosa oral indicando hipoxemia",
    },
    {
      achado: "desidratacao",
      titulo: "Sinais de desidratação",
      descricao: "Enofitalmia (olhos afundados) e ausência de lágrimas",
    },
    {
      achado: "conjuntivite",
      titulo: "Conjuntivite",
      descricao: "Hiperemia conjuntival com secreção purulenta ou mucosa",
    },
    {
      achado: "ictericia",
      titulo: "Icterícia",
      descricao: "Coloração amarelada de conjuntiva e pele indicando hiperbilirrubinemia",
    },
  ],
  "orl-orofaringe": [
    {
      achado: "orofaringe-amigdalas",
      titulo: "Orofaringe e amígdalas",
      descricao: "Observe color, eritema e tamanho das estruturas",
    },
    {
      achado: "secrecao-nasal",
      titulo: "Secreção nasal",
      descricao: "Observe tipo, quantidade e característica da secreção",
    },
    {
      achado: "manchas-koplik",
      titulo: "Manchas de Koplik",
      descricao: "Manchas características de sarampo na mucosa bucal",
    },
    {
      achado: "congestao-nasal",
      titulo: "Congestão nasal",
      descricao: "Edema de mucosa nasal impedindo passagem aérea",
    },
  ],
  "pele-mucosas": [
    {
      achado: "exantema-maculopapular",
      titulo: "Exantema maculopapular",
      descricao: "Lesões cutâneas maculopapulares distribuídas pela pele",
    },
    {
      achado: "petequias",
      titulo: "Petéquias",
      descricao: "Lesões puntiformes não branqueáveis pela pressão",
    },
    {
      achado: "equimoses",
      titulo: "Equimoses",
      descricao: "Extravasamento sanguíneo subcutâneo com coloração azulada",
    },
    {
      achado: "ictericia-pele",
      titulo: "Icterícia",
      descricao: "Coloração amarelada de pele e mucosas",
    },
    {
      achado: "desidratacao-mucosas",
      titulo: "Desidratação de mucosas",
      descricao: "Mucosas secas, sem brilho, com redução de elasticidade",
    },
  ],
  "membros-perfusao": [
    {
      achado: "perfusao-capilar",
      titulo: "Avaliação de perfusão capilar",
      descricao: "Enchimento capilar lento em extremidades",
    },
    {
      achado: "pulsos-perifericos",
      titulo: "Palpação de pulsos periféricos",
      descricao: "Avaliação de qualidade, frequência e simetria de pulsos",
    },
    {
      achado: "edema",
      titulo: "Edema em membros",
      descricao: "Aumento de volume localizado com depressão à palpação",
    },
    {
      achado: "baqueteamento-digital",
      titulo: "Baqueteamento digital",
      descricao: "Alargamento de falanges distais com aumento de curvatura",
    },
    {
      achado: "cianose-periferica",
      titulo: "Cianose periférica",
      descricao: "Coloração azulada em extremidades",
    },
  ],
  "abdome": [
    {
      achado: "palpacao-abdominal",
      titulo: "Palpação abdominal",
      descricao: "Técnica de palpação superficial e profunda",
    },
    {
      achado: "dor-abdominal",
      titulo: "Dor abdominal à palpação",
      descricao: "Localização e caracterização de dor à palpação",
    },
    {
      achado: "distensao-abdominal",
      titulo: "Distensão abdominal",
      descricao: "Abdome aumentado de volume com pele brilhante",
    },
  ],
  "figado": [
    {
      achado: "palpacao-figado",
      titulo: "Palpação hepática",
      descricao: "Técnica de palpação para avaliação de hepatomegalia",
    },
  ],
  "baco": [
    {
      achado: "palpacao-baco",
      titulo: "Palpação esplênica",
      descricao: "Técnica de palpação para avaliação de esplenomegalia",
    },
  ],
  "pressao-arterial": [
    {
      achado: "manguito-adequado",
      titulo: "Escolha de manguito adequado",
      descricao: "Tamanho correto do manguito para aferição acurada",
    },
  ],
};

// Gerar todas as 225 imagens
const IMAGENS_MANIFESTO: ManifestoImagemV2[] = [];

FAIXAS_ETARIAS.forEach((faixa) => {
  TONS_PELE.forEach((tom) => {
    Object.entries(REGIOES_ACHADOS).forEach(([regiao, achados]) => {
      achados.forEach(({ achado, titulo, descricao }) => {
        const nomeArquivo = `${faixa}-${tom}-${regiao}-${achado}.png`;
        const caminhoCompleto = `/images/pediatria/exames-interativos-v2/${faixa}/${tom}/${regiao}/${nomeArquivo}`;
        const id = `${faixa}-${tom}-${regiao}-${achado}`;

        // Humanizar títulos com faixa etária
        let tituloExibicao = titulo;
        if (faixa === "lactente") {
          tituloExibicao = `${titulo} - Lactente`;
        } else if (faixa === "pre-escolar") {
          tituloExibicao = `${titulo} - Pré-escolar`;
        } else if (faixa === "escolar") {
          tituloExibicao = `${titulo} - Escolar`;
        }

        // Adicionar tom de pele ao título
        if (tom === "pele-morena") {
          tituloExibicao += " (pele morena)";
        } else if (tom === "pele-negra") {
          tituloExibicao += " (pele negra)";
        }

        IMAGENS_MANIFESTO.push({
          id,
          faixaEtaria: faixa,
          tomPele: tom,
          regiao: regiao as Regiao,
          achadoClinico: achado,
          tituloExibicao,
          nomeArquivo,
          caminhoCompleto,
          status: "pendente",
          descricaoExpectativa: descricao,
        });
      });
    });
  });
});

// Índice otimizado para busca O(1)
const INDICE_IMAGENS = construirIndice();

function construirIndice(): Map<string, ManifestoImagemV2> {
  const indice = new Map<string, ManifestoImagemV2>();
  IMAGENS_MANIFESTO.forEach((img) => {
    indice.set(img.id, img);
  });
  return indice;
}

// ============================================================================
// FUNÇÕES DE GERENCIAMENTO DO MANIFESTO
// ============================================================================

export function obterImagemManifesto(id: string): ManifestoImagemV2 | undefined {
  return INDICE_IMAGENS.get(id);
}

export function obterImagensPendentes(): ManifestoImagemV2[] {
  return IMAGENS_MANIFESTO.filter((img) => img.status === "pendente");
}

export function obterImagensDisponiveis(): ManifestoImagemV2[] {
  return IMAGENS_MANIFESTO.filter((img) => img.status === "disponivel");
}

export function obterImagensFaltando(): ManifestoImagemV2[] {
  return obterImagensPendentes();
}

export function contabilizarImagensPorFaixa(): Record<FaixaEtaria, number> {
  return {
    lactente: IMAGENS_MANIFESTO.filter((img) => img.faixaEtaria === "lactente").length,
    "pre-escolar": IMAGENS_MANIFESTO.filter((img) => img.faixaEtaria === "pre-escolar").length,
    escolar: IMAGENS_MANIFESTO.filter((img) => img.faixaEtaria === "escolar").length,
  };
}

export function contabilizarImagensPorTom(): Record<TomPele, number> {
  return {
    "pele-clara": IMAGENS_MANIFESTO.filter((img) => img.tomPele === "pele-clara").length,
    "pele-morena": IMAGENS_MANIFESTO.filter((img) => img.tomPele === "pele-morena").length,
    "pele-negra": IMAGENS_MANIFESTO.filter((img) => img.tomPele === "pele-negra").length,
  };
}

export function contabilizarImagensPorRegiao(): Record<Regiao, number> {
  const regioes: Regiao[] = [
    "face-olhos",
    "orl-orofaringe",
    "pele-mucosas",
    "membros-perfusao",
    "abdome",
    "figado",
    "baco",
    "pressao-arterial",
  ];

  const contagem: Record<string, number> = {};
  regioes.forEach((regiao) => {
    contagem[regiao] = IMAGENS_MANIFESTO.filter((img) => img.regiao === regiao).length;
  });

  return contagem as Record<Regiao, number>;
}

export function obterResumoManifesto() {
  return {
    totalImagens: IMAGENS_MANIFESTO.length,
    pendentes: obterImagensPendentes().length,
    disponiveis: obterImagensDisponiveis().length,
    emProgresso: IMAGENS_MANIFESTO.filter((img) => img.status === "em-progresso").length,
    emRevisao: IMAGENS_MANIFESTO.filter((img) => img.status === "revisao").length,
    porFaixa: contabilizarImagensPorFaixa(),
    porTom: contabilizarImagensPorTom(),
    porRegiao: contabilizarImagensPorRegiao(),
  };
}

export function atualizarStatusImagem(id: string, novoStatus: StatusImagem): void {
  const img = INDICE_IMAGENS.get(id);
  if (img) {
    img.status = novoStatus;
    img.ultimaAtualizacao = new Date().toISOString();
  }
}

export function obterTodasAsImagens(): ManifestoImagemV2[] {
  return IMAGENS_MANIFESTO;
}
