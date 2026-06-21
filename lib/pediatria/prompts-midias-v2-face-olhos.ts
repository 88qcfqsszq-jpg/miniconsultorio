// Prompts para geração de imagens realistas - Região Face/Olhos V2
// 45 imagens: 5 achados × 3 tons × 3 faixas
// Para uso com sistemas de geração de imagem (DALL-E, Midjourney, etc.)

export interface PromptGeracaoImagemV2 {
  id: string; // ID do manifesto
  faixaEtaria: "lactente" | "pre-escolar" | "escolar";
  tomPele: "pele-clara" | "pele-morena" | "pele-negra";
  regiao: "face-olhos";
  achadoClinico: string;
  nomeArquivo: string;
  caminhoCompleto: string;
  promptDetalhado: string;
  observacoesValidacao: string[];
  dificuldadeEstimada: "baixa" | "media" | "alta";
}

// ============================================================================
// DADOS DE REFERÊNCIA - TONALIDADES DE PELE
// ============================================================================

const DESCRICOES_PELE = {
  "pele-clara": "tom de pele caucasiano/claro (Fitzpatrick tipo I-II)",
  "pele-morena": "tom de pele mulato/moreno (Fitzpatrick tipo III-IV)",
  "pele-negra": "tom de pele negro/afrodescendente (Fitzpatrick tipo V-VI)",
};

const DESCRICOES_FAIXA = {
  lactente: "bebê com aparência até 2 anos, feições infantis suaves, ainda com proporções de lactente",
  "pre-escolar": "criança pequena com 2-6 anos, face mais definida, expressão lúcida e atenta",
  escolar: "criança maior com 6+ anos, feições mais pronunciadas, face mais proporcionada ao tamanho da cabeça",
};

// ============================================================================
// GERADOR DE PROMPTS - 45 IMAGENS FACE/OLHOS
// ============================================================================

const PROMPTS_FACE_OLHOS: PromptGeracaoImagemV2[] = [
  // =========================================================================
  // PALIDEZ CONJUNTIVAL - 9 imagens (3 tons × 3 faixas)
  // =========================================================================

  {
    id: "lactente-pele-clara-face-olhos-palidez-conjuntival",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    regiao: "face-olhos",
    achadoClinico: "palidez-conjuntival",
    nomeArquivo: "lactente-pele-clara-face-olhos-palidez-conjuntival.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/lactente/pele-clara/face-olhos/lactente-pele-clara-face-olhos-palidez-conjuntival.png",
    promptDetalhado: `Fotografia clínica realista de um bebê com ${DESCRICOES_FAIXA.lactente} e ${DESCRICOES_PELE["pele-clara"]}.
      Vista frontal e closeup com discreta eversão da pálpebra inferior direita, revelando conjuntiva inferior hipocorada/pálida em comparação com a cor normal.
      A conjuntiva normal deve ser levemente avermelhada; a conjuntiva do lactente nesta imagem deve mostrar palidez sutil, consistente com anemia.
      Olho esquerdo normal para comparação. Rosto relaxado, expressão neutra. Fundo branco/neutro. Iluminação profissional clara.
      Resolução 2048x1536px mínimo. Estilo: fotografia médica clínica, sem dramatização, sem edição artística, naturalista.
      Adequado para material educacional de semiologia pediátrica.`,
    observacoesValidacao: [
      "Conjuntiva pálida deve ser evidente mas não exagerada",
      "Comparação com olho oposto é essencial para diagnóstico visual",
      "Sem edema, sem lacrimejamento excessivo",
      "Bebê com aparência saudável geral, apenas achado de palidez conjuntival",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "lactente-pele-morena-face-olhos-palidez-conjuntival",
    faixaEtaria: "lactente",
    tomPele: "pele-morena",
    regiao: "face-olhos",
    achadoClinico: "palidez-conjuntival",
    nomeArquivo: "lactente-pele-morena-face-olhos-palidez-conjuntival.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/lactente/pele-morena/face-olhos/lactente-pele-morena-face-olhos-palidez-conjuntival.png",
    promptDetalhado: `Fotografia clínica de um bebê com ${DESCRICOES_FAIXA.lactente} e ${DESCRICOES_PELE["pele-morena"]}.
      Vista frontal com eversão discreta da pálpebra inferior, mostrando conjuntiva inferior claramente mais pálida que a esperado para essa etnia.
      Em pele morena, a conjuntiva normal tende a ser ligeiramente mais escura; aqui deve ser notoriamente mais clara/pálida, indicando anemia.
      Olho esquerdo sem achados para comparação de normalidade. Expressão neutra, rosto relaxado.
      Fundo branco/limpo. Iluminação profissional. Fotografia médica realista, sem elementos decorativos.`,
    observacoesValidacao: [
      "Palidez conjuntival deve ser perceptível mesmo em pele morena",
      "Contraste entre os dois olhos é diagnosticamente importante",
      "Tom de pele do rosto deve ser uniforme, moreno/mulato",
      "Sem sinais de mal-estar geral",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "lactente-pele-negra-face-olhos-palidez-conjuntival",
    faixaEtaria: "lactente",
    tomPele: "pele-negra",
    regiao: "face-olhos",
    achadoClinico: "palidez-conjuntival",
    nomeArquivo: "lactente-pele-negra-face-olhos-palidez-conjuntival.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/lactente/pele-negra/face-olhos/lactente-pele-negra-face-olhos-palidez-conjuntival.png",
    promptDetalhado: `Fotografia clínica de um bebê afrodescendente com ${DESCRICOES_FAIXA.lactente} e ${DESCRICOES_PELE["pele-negra"]}.
      Close-up frontal com eversão suave da pálpebra inferior, evidenciando palidez conjuntival clara.
      Em crianças com pele negra, a palidez conjuntival é ainda mais um achado importante, pois pode ser sutil; aqui deve estar evidente para fins didáticos.
      Olho direito normal para referência. Iluminação que ressalte claramente o achado. Sem dramatização.
      Fundo branco. Registro fotográfico clínico profissional, adequado para ensino de semiologia.`,
    observacoesValidacao: [
      "Palidez conjuntival visível e diagnosticável em pele negra",
      "Fotografia deve permitir comparação entre os dois olhos",
      "Tom de pele uniforme e naturalmente negro",
      "Sem elementos que distrajam do achado clínico",
    ],
    dificuldadeEstimada: "alta",
  },

  {
    id: "pre-escolar-pele-clara-face-olhos-palidez-conjuntival",
    faixaEtaria: "pre-escolar",
    tomPele: "pele-clara",
    regiao: "face-olhos",
    achadoClinico: "palidez-conjuntival",
    nomeArquivo: "pre-escolar-pele-clara-face-olhos-palidez-conjuntival.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/pre-escolar/pele-clara/face-olhos/pre-escolar-pele-clara-face-olhos-palidez-conjuntival.png",
    promptDetalhado: `Fotografia clínica de uma criança pré-escolar com ${DESCRICOES_FAIXA["pre-escolar"]} e ${DESCRICOES_PELE["pele-clara"]}.
      Vista frontal com eversão discreta da pálpebra inferior, mostrando palidez conjuntival característica.
      Criança sentada, colaboradora, olhando para frente com expressão neutra/cooperativa.
      Olho contralateral normal para comparação diagnóstica. Iluminação adequada para visualizar o achado.
      Fundo branco simples. Fotografia médica realista, sem elementos cênicos, apropriada para material educacional pediátrico.`,
    observacoesValidacao: [
      "Criança entre 2-6 anos, com face mais definida que lactente",
      "Palidez conjuntival deve estar clara",
      "Comparação entre os dois lados é essencial",
      "Criança sem sinais de sofrimento ou incômodo",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "pre-escolar-pele-morena-face-olhos-palidez-conjuntival",
    faixaEtaria: "pre-escolar",
    tomPele: "pele-morena",
    regiao: "face-olhos",
    achadoClinico: "palidez-conjuntival",
    nomeArquivo: "pre-escolar-pele-morena-face-olhos-palidez-conjuntival.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/pre-escolar/pele-morena/face-olhos/pre-escolar-pele-morena-face-olhos-palidez-conjuntival.png",
    promptDetalhado: `Fotografia clínica de uma criança pré-escolar com ${DESCRICOES_FAIXA["pre-escolar"]} e ${DESCRICOES_PELE["pele-morena"]}.
      Close-up frontal mostrando eversão da pálpebra inferior com palidez conjuntival evidente.
      Criança colaboradora, rosto voltado para frente, expressão calma.
      Contraste entre olho afetado (pálido) e olho saudável (normal). Fundo neutro.
      Qualidade clínica profissional, sem edição artística. Adequado para ensino de semiotécnica pediátrica.`,
    observacoesValidacao: [
      "Tom de pele morena uniforme",
      "Palidez conjuntival visível mesmo em pele não-branca",
      "Face corresponde a 2-6 anos de idade",
      "Diagnóstico visual claro do achado",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "pre-escolar-pele-negra-face-olhos-palidez-conjuntival",
    faixaEtaria: "pre-escolar",
    tomPele: "pele-negra",
    regiao: "face-olhos",
    achadoClinico: "palidez-conjuntival",
    nomeArquivo: "pre-escolar-pele-negra-face-olhos-palidez-conjuntival.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/pre-escolar/pele-negra/face-olhos/pre-escolar-pele-negra-face-olhos-palidez-conjuntival.png",
    promptDetalhado: `Fotografia clínica de uma criança afrodescendente pré-escolar com ${DESCRICOES_FAIXA["pre-escolar"]} e ${DESCRICOES_PELE["pele-negra"]}.
      Close-up frontal com eversão suave da pálpebra inferior, evidenciando palidez conjuntival.
      Criança sentada, cooperando com o exame, expressão neutra. Olho oposto normal para comparação.
      Iluminação que ressalte o achado. Fundo branco limpo. Fotografia médica clínica, didática.`,
    observacoesValidacao: [
      "Palidez conjuntival clara em pele negra (achado de maior importância clínica)",
      "Face jovem com características de 2-6 anos",
      "Comparação bilateral nítida",
      "Sem dramatização, aparência saudável geral",
    ],
    dificuldadeEstimada: "alta",
  },

  {
    id: "escolar-pele-clara-face-olhos-palidez-conjuntival",
    faixaEtaria: "escolar",
    tomPele: "pele-clara",
    regiao: "face-olhos",
    achadoClinico: "palidez-conjuntival",
    nomeArquivo: "escolar-pele-clara-face-olhos-palidez-conjuntival.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/escolar/pele-clara/face-olhos/escolar-pele-clara-face-olhos-palidez-conjuntival.png",
    promptDetalhado: `Fotografia clínica de uma criança escolar com ${DESCRICOES_FAIXA.escolar} e ${DESCRICOES_PELE["pele-clara"]}.
      Vista frontal com eversão da pálpebra inferior, revelando palidez conjuntival.
      Criança maior (6+ anos), colaboradora, expressão neutra. Rosto bem visualizado.
      Olho contralateral normal. Iluminação profissional. Fundo branco. Fotografia médica didática.`,
    observacoesValidacao: [
      "Criança com idade escolar (6+ anos)",
      "Face mais proporcional ao tamanho da cabeça que em lactentes",
      "Palidez conjuntival claramente visível",
      "Bilateral para comparação diagnóstica",
    ],
    dificuldadeEstimada: "baixa",
  },

  {
    id: "escolar-pele-morena-face-olhos-palidez-conjuntival",
    faixaEtaria: "escolar",
    tomPele: "pele-morena",
    regiao: "face-olhos",
    achadoClinico: "palidez-conjuntival",
    nomeArquivo: "escolar-pele-morena-face-olhos-palidez-conjuntival.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/escolar/pele-morena/face-olhos/escolar-pele-morena-face-olhos-palidez-conjuntival.png",
    promptDetalhado: `Fotografia clínica de uma criança escolar com ${DESCRICOES_FAIXA.escolar} e ${DESCRICOES_PELE["pele-morena"]}.
      Close-up frontal mostrando eversão da pálpebra inferior com palidez conjuntival evidente.
      Criança maior, colaboradora. Tom de pele moreno uniforme. Expressão calma.
      Olho oposto normal para referência. Fundo neutro. Qualidade profissional.`,
    observacoesValidacao: [
      "Criança com 6+ anos",
      "Pele morena/mulata uniforme",
      "Palidez conjuntival diagnosticável",
      "Comparação entre olhos clara",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "escolar-pele-negra-face-olhos-palidez-conjuntival",
    faixaEtaria: "escolar",
    tomPele: "pele-negra",
    regiao: "face-olhos",
    achadoClinico: "palidez-conjuntival",
    nomeArquivo: "escolar-pele-negra-face-olhos-palidez-conjuntival.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/escolar/pele-negra/face-olhos/escolar-pele-negra-face-olhos-palidez-conjuntival.png",
    promptDetalhado: `Fotografia clínica de uma criança escolar afrodescendente com ${DESCRICOES_FAIXA.escolar} e ${DESCRICOES_PELE["pele-negra"]}.
      Vista frontal com eversão da pálpebra inferior, mostrando palidez conjuntival.
      Criança cooperadora, rosto bem visualizado, expressão neutra. Olho oposto saudável.
      Iluminação adequada. Fundo branco. Fotografia médica educacional.`,
    observacoesValidacao: [
      "Criança afrodescendente com 6+ anos",
      "Palidez conjuntival bem documentada visualmente",
      "Bilateral para comparação",
      "Sem elementos de dramatização",
    ],
    dificuldadeEstimada: "media",
  },

  // =========================================================================
  // CIANOSE CENTRAL - 9 imagens (3 tons × 3 faixas)
  // =========================================================================

  {
    id: "lactente-pele-clara-face-olhos-cianose-central",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    regiao: "face-olhos",
    achadoClinico: "cianose-central",
    nomeArquivo: "lactente-pele-clara-face-olhos-cianose-central.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/lactente/pele-clara/face-olhos/lactente-pele-clara-face-olhos-cianose-central.png",
    promptDetalhado: `Fotografia clínica realista de um bebê com ${DESCRICOES_FAIXA.lactente} e ${DESCRICOES_PELE["pele-clara"]}.
      Close-up da região perioral mostrando discreta coloração azulada/violácea em lábios e região perioral, consistente com cianose central.
      A coloração deve ser sutil e realista, não exagerada ou caricatural. Bebê com expressão calma, sem distresse respiratório dramático.
      Apenas leve desconforto compatível com hipoxemia crônica leve. Fundo branco/neutro.
      Iluminação profissional que ressalte o matiz azulado. Fotografia médica didática, adequada para ensino de semiologia pediátrica.`,
    observacoesValidacao: [
      "Coloração azulada/violácea clara em lábios e pele perioral",
      "Sem dramatização, sem distresse respiratório exagerado",
      "Bebê com expressão tranquila",
      "Sem demais sinais de cianose periférica, apenas central",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "lactente-pele-morena-face-olhos-cianose-central",
    faixaEtaria: "lactente",
    tomPele: "pele-morena",
    regiao: "face-olhos",
    achadoClinico: "cianose-central",
    nomeArquivo: "lactente-pele-morena-face-olhos-cianose-central.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/lactente/pele-morena/face-olhos/lactente-pele-morena-face-olhos-cianose-central.png",
    promptDetalhado: `Fotografia clínica de um bebê com ${DESCRICOES_FAIXA.lactente} e ${DESCRICOES_PELE["pele-morena"]}.
      Close-up perioral mostrando coloração azulada em lábios e mucosa perioral.
      Em pele morena, a cianose é menos óbvia visualmente; aqui deve estar clara para fins didáticos.
      Bebê relaxado, expressão neutra, sem sinais de mal-estar geral. Fundo branco.
      Iluminação que destaque o matiz azulado característico. Fotografia médica realista.`,
    observacoesValidacao: [
      "Cianose detectável em pele morena (importante para inclusão racial em material educativo)",
      "Coloração azulada em lábios e mucosa",
      "Bebê sem sinais de gravidade",
      "Fundo limpo e neutro",
    ],
    dificuldadeEstimada: "alta",
  },

  {
    id: "lactente-pele-negra-face-olhos-cianose-central",
    faixaEtaria: "lactente",
    tomPele: "pele-negra",
    regiao: "face-olhos",
    achadoClinico: "cianose-central",
    nomeArquivo: "lactente-pele-negra-face-olhos-cianose-central.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/lactente/pele-negra/face-olhos/lactente-pele-negra-face-olhos-cianose-central.png",
    promptDetalhado: `Fotografia clínica de um bebê afrodescendente com ${DESCRICOES_FAIXA.lactente} e ${DESCRICOES_PELE["pele-negra"]}.
      Close-up focado em lábios e mucosa perioral, evidenciando coloração azulada/arroxeada consistente com cianose central.
      Em pele negra, a cianose pode ser muito sutil; deve estar clara e diagnosticável nesta imagem.
      Bebê com expressão calma. Iluminação profissional destacando o achado. Fundo branco. Fotografia médica educacional.`,
    observacoesValidacao: [
      "Cianose central clara mesmo em pele negra",
      "Achado diagnosticamente importante em pele com melanina elevada",
      "Bebê em bom estado geral apesar do achado",
      "Fotografia médica sem dramatização",
    ],
    dificuldadeEstimada: "alta",
  },

  {
    id: "pre-escolar-pele-clara-face-olhos-cianose-central",
    faixaEtaria: "pre-escolar",
    tomPele: "pele-clara",
    regiao: "face-olhos",
    achadoClinico: "cianose-central",
    nomeArquivo: "pre-escolar-pele-clara-face-olhos-cianose-central.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/pre-escolar/pele-clara/face-olhos/pre-escolar-pele-clara-face-olhos-cianose-central.png",
    promptDetalhado: `Fotografia clínica de uma criança pré-escolar com ${DESCRICOES_FAIXA["pre-escolar"]} e ${DESCRICOES_PELE["pele-clara"]}.
      Close-up perioral mostrando discreta coloração azulada em lábios e região perioral.
      Criança sentada, cooperadora, expressão neutra sem dramatização. Leve desconforto compatível com hipoxemia crônica.
      Fundo branco. Iluminação que ressalte o matiz azulado. Fotografia médica realista.`,
    observacoesValidacao: [
      "Cianose central visível em lábios",
      "Criança 2-6 anos com face mais definida que lactente",
      "Expressão tranquila, sem sofrimento dramático",
      "Sem sinais periféricos exagerados",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "pre-escolar-pele-morena-face-olhos-cianose-central",
    faixaEtaria: "pre-escolar",
    tomPele: "pele-morena",
    regiao: "face-olhos",
    achadoClinico: "cianose-central",
    nomeArquivo: "pre-escolar-pele-morena-face-olhos-cianose-central.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/pre-escolar/pele-morena/face-olhos/pre-escolar-pele-morena-face-olhos-cianose-central.png",
    promptDetalhado: `Fotografia clínica de uma criança pré-escolar com ${DESCRICOES_FAIXA["pre-escolar"]} e ${DESCRICOES_PELE["pele-morena"]}.
      Close-up perioral destacando coloração azulada em lábios e mucosa. Criança colaboradora, rosto bem visualizado.
      Expressão neutra, sem dramatização. Tom de pele moreno uniforme. Fundo branco.
      Iluminação profissional. Fotografia médica didática.`,
    observacoesValidacao: [
      "Cianose detectável em pele morena",
      "Criança pré-escolar com 2-6 anos",
      "Coloration azulada clara em lábios",
      "Material educativo apropriado",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "pre-escolar-pele-negra-face-olhos-cianose-central",
    faixaEtaria: "pre-escolar",
    tomPele: "pele-negra",
    regiao: "face-olhos",
    achadoClinico: "cianose-central",
    nomeArquivo: "pre-escolar-pele-negra-face-olhos-cianose-central.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/pre-escolar/pele-negra/face-olhos/pre-escolar-pele-negra-face-olhos-cianose-central.png",
    promptDetalhado: `Fotografia clínica de uma criança afrodescendente pré-escolar com ${DESCRICOES_FAIXA["pre-escolar"]} e ${DESCRICOES_PELE["pele-negra"]}.
      Close-up perioral mostrando coloração azulada/violácea em lábios e mucosa. Criança cooperadora.
      Expressão calma. Iluminação destacando o achado. Fundo branco. Fotografia médica realista.`,
    observacoesValidacao: [
      "Cianose central clara em pele negra",
      "Criança com 2-6 anos",
      "Coloração azulada bem documentada visualmente",
      "Sem exagero de dramatização",
    ],
    dificuldadeEstimada: "alta",
  },

  {
    id: "escolar-pele-clara-face-olhos-cianose-central",
    faixaEtaria: "escolar",
    tomPele: "pele-clara",
    regiao: "face-olhos",
    achadoClinico: "cianose-central",
    nomeArquivo: "escolar-pele-clara-face-olhos-cianose-central.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/escolar/pele-clara/face-olhos/escolar-pele-clara-face-olhos-cianose-central.png",
    promptDetalhado: `Fotografia clínica de uma criança escolar com ${DESCRICOES_FAIXA.escolar} e ${DESCRICOES_PELE["pele-clara"]}.
      Close-up perioral mostrando discreta coloração azulada em lábios. Criança colaboradora, expressão neutra.
      Fundo branco. Iluminação profissional. Fotografia médica didática.`,
    observacoesValidacao: [
      "Cianose central em lábios visível",
      "Criança 6+ anos com face proporcionada",
      "Expressão tranquila",
      "Fundo limpo",
    ],
    dificuldadeEstimada: "baixa",
  },

  {
    id: "escolar-pele-morena-face-olhos-cianose-central",
    faixaEtaria: "escolar",
    tomPele: "pele-morena",
    regiao: "face-olhos",
    achadoClinico: "cianose-central",
    nomeArquivo: "escolar-pele-morena-face-olhos-cianose-central.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/escolar/pele-morena/face-olhos/escolar-pele-morena-face-olhos-cianose-central.png",
    promptDetalhado: `Fotografia clínica de uma criança escolar com ${DESCRICOES_FAIXA.escolar} e ${DESCRICOES_PELE["pele-morena"]}.
      Close-up perioral mostrando coloração azulada em lábios e mucosa. Criança maior, cooperadora.
      Fundo branco. Iluminação adequada. Fotografia médica.`,
    observacoesValidacao: [
      "Cianose em pele morena clara",
      "Criança escolar (6+ anos)",
      "Coloração azulada bem documentada",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "escolar-pele-negra-face-olhos-cianose-central",
    faixaEtaria: "escolar",
    tomPele: "pele-negra",
    regiao: "face-olhos",
    achadoClinico: "cianose-central",
    nomeArquivo: "escolar-pele-negra-face-olhos-cianose-central.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/escolar/pele-negra/face-olhos/escolar-pele-negra-face-olhos-cianose-central.png",
    promptDetalhado: `Fotografia clínica de uma criança escolar afrodescendente com ${DESCRICOES_FAIXA.escolar} e ${DESCRICOES_PELE["pele-negra"]}.
      Close-up perioral destacando coloração azulada em lábios e mucosa. Criança cooperadora, rosto bem visualizado.
      Fundo branco. Iluminação profissional. Fotografia médica educacional.`,
    observacoesValidacao: [
      "Cianose central em pele negra diagnosticável",
      "Criança 6+ anos",
      "Coloração bem documentada",
      "Fotografia médica realista",
    ],
    dificuldadeEstimada: "media",
  },

  // =========================================================================
  // DESIDRATAÇÃO - 9 imagens (3 tons × 3 faixas)
  // =========================================================================

  {
    id: "lactente-pele-clara-face-olhos-desidratacao",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    regiao: "face-olhos",
    achadoClinico: "desidratacao",
    nomeArquivo: "lactente-pele-clara-face-olhos-desidratacao.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/lactente/pele-clara/face-olhos/lactente-pele-clara-face-olhos-desidratacao.png",
    promptDetalhado: `Fotografia clínica de um bebê com ${DESCRICOES_FAIXA.lactente} e ${DESCRICOES_PELE["pele-clara"]} apresentando sinais de desidratação.
      Vista frontal mostrando olhos discretamente encovados (enofitalmia), lábios ressecados, mucosa bucal seca e aparente leve abatimento facial.
      Aspecto não deve ser de desidratação grave ou em choque, mas moderada. Bebê com expressão abatida porém estável.
      Fundo branco. Iluminação natural. Fotografia médica realista, sem exagero de dramatização.`,
    observacoesValidacao: [
      "Enofitalmia discreta visível",
      "Lábios ressecados sem sangramento",
      "Aparência abatida leve a moderada",
      "Sem sinais de choque ou distresse grave",
      "Bebê sem edema facial",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "lactente-pele-morena-face-olhos-desidratacao",
    faixaEtaria: "lactente",
    tomPele: "pele-morena",
    regiao: "face-olhos",
    achadoClinico: "desidratacao",
    nomeArquivo: "lactente-pele-morena-face-olhos-desidratacao.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/lactente/pele-morena/face-olhos/lactente-pele-morena-face-olhos-desidratacao.png",
    promptDetalhado: `Fotografia clínica de um bebê com ${DESCRICOES_FAIXA.lactente} e ${DESCRICOES_PELE["pele-morena"]} com sinais de desidratação.
      Vista frontal mostrando enofitalmia, lábios ressecados, leve abatimento. Tom de pele moreno uniforme porém com aspecto desidratado.
      Bebê com expressão abatida mas estável. Fundo branco. Fotografia médica realista.`,
    observacoesValidacao: [
      "Enofitalmia perceptível em pele morena",
      "Ressecamento de lábios e mucosa",
      "Aparência desidratada moderada",
      "Pele morena com aspecto normal (sem palidez exagerada)",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "lactente-pele-negra-face-olhos-desidratacao",
    faixaEtaria: "lactente",
    tomPele: "pele-negra",
    regiao: "face-olhos",
    achadoClinico: "desidratacao",
    nomeArquivo: "lactente-pele-negra-face-olhos-desidratacao.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/lactente/pele-negra/face-olhos/lactente-pele-negra-face-olhos-desidratacao.png",
    promptDetalhado: `Fotografia clínica de um bebê afrodescendente com ${DESCRICOES_FAIXA.lactente} e ${DESCRICOES_PELE["pele-negra"]} apresentando desidratação.
      Vista frontal mostrando enofitalmia discreta, lábios ressecados, aspecto abatido. Pele negra sem edema.
      Expressão de cansaço leve. Fundo branco. Fotografia médica educacional.`,
    observacoesValidacao: [
      "Enofitalmia visível em pele negra",
      "Lábios ressecados com aspecto desidratado",
      "Bebê abatido mas sem gravidade extrema",
      "Fotografia médica realista",
    ],
    dificuldadeEstimada: "alta",
  },

  {
    id: "pre-escolar-pele-clara-face-olhos-desidratacao",
    faixaEtaria: "pre-escolar",
    tomPele: "pele-clara",
    regiao: "face-olhos",
    achadoClinico: "desidratacao",
    nomeArquivo: "pre-escolar-pele-clara-face-olhos-desidratacao.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/pre-escolar/pele-clara/face-olhos/pre-escolar-pele-clara-face-olhos-desidratacao.png",
    promptDetalhado: `Fotografia clínica de uma criança pré-escolar com ${DESCRICOES_FAIXA["pre-escolar"]} e ${DESCRICOES_PELE["pele-clara"]} com desidratação.
      Vista frontal mostrando enofitalmia, lábios ressecados, face abatida. Criança sentada, cooperadora, expressão de cansaço.
      Fundo branco. Iluminação profissional. Fotografia médica didática.`,
    observacoesValidacao: [
      "Enofitalmia visível",
      "Ressecamento de lábios e mucosa",
      "Criança 2-6 anos com face mais definida",
      "Aparência desidratada moderada",
      "Sem sinais de choque",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "pre-escolar-pele-morena-face-olhos-desidratacao",
    faixaEtaria: "pre-escolar",
    tomPele: "pele-morena",
    regiao: "face-olhos",
    achadoClinico: "desidratacao",
    nomeArquivo: "pre-escolar-pele-morena-face-olhos-desidratacao.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/pre-escolar/pele-morena/face-olhos/pre-escolar-pele-morena-face-olhos-desidratacao.png",
    promptDetalhado: `Fotografia clínica de uma criança pré-escolar com ${DESCRICOES_FAIXA["pre-escolar"]} e ${DESCRICOES_PELE["pele-morena"]} com desidratação.
      Vista frontal mostrando enofitalmia, lábios ressecados, leve abatimento. Criança cooperadora.
      Fundo branco. Fotografia médica realista.`,
    observacoesValidacao: [
      "Enofitalmia perceptível",
      "Ressecamento e aspecto desidratado",
      "Criança pré-escolar",
      "Pele morena uniforme",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "pre-escolar-pele-negra-face-olhos-desidratacao",
    faixaEtaria: "pre-escolar",
    tomPele: "pele-negra",
    regiao: "face-olhos",
    achadoClinico: "desidratacao",
    nomeArquivo: "pre-escolar-pele-negra-face-olhos-desidratacao.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/pre-escolar/pele-negra/face-olhos/pre-escolar-pele-negra-face-olhos-desidratacao.png",
    promptDetalhado: `Fotografia clínica de uma criança afrodescendente pré-escolar com ${DESCRICOES_FAIXA["pre-escolar"]} e ${DESCRICOES_PELE["pele-negra"]} com desidratação.
      Vista frontal mostrando enofitalmia, lábios ressecados, aparência abatida. Criança cooperadora, expressão de cansaço.
      Fundo branco. Fotografia médica educacional.`,
    observacoesValidacao: [
      "Enofitalmia visível",
      "Lábios e mucosa ressecados",
      "Criança 2-6 anos",
      "Aparência desidratada clara",
    ],
    dificuldadeEstimada: "alta",
  },

  {
    id: "escolar-pele-clara-face-olhos-desidratacao",
    faixaEtaria: "escolar",
    tomPele: "pele-clara",
    regiao: "face-olhos",
    achadoClinico: "desidratacao",
    nomeArquivo: "escolar-pele-clara-face-olhos-desidratacao.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/escolar/pele-clara/face-olhos/escolar-pele-clara-face-olhos-desidratacao.png",
    promptDetalhado: `Fotografia clínica de uma criança escolar com ${DESCRICOES_FAIXA.escolar} e ${DESCRICOES_PELE["pele-clara"]} com desidratação.
      Vista frontal mostrando enofitalmia, lábios ressecados, face abatida. Criança maior, cooperadora.
      Fundo branco. Fotografia médica.`,
    observacoesValidacao: [
      "Enofitalmia visível",
      "Ressecamento claro",
      "Criança 6+ anos",
      "Aparência desidratada moderada",
    ],
    dificuldadeEstimada: "baixa",
  },

  {
    id: "escolar-pele-morena-face-olhos-desidratacao",
    faixaEtaria: "escolar",
    tomPele: "pele-morena",
    regiao: "face-olhos",
    achadoClinico: "desidratacao",
    nomeArquivo: "escolar-pele-morena-face-olhos-desidratacao.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/escolar/pele-morena/face-olhos/escolar-pele-morena-face-olhos-desidratacao.png",
    promptDetalhado: `Fotografia clínica de uma criança escolar com ${DESCRICOES_FAIXA.escolar} e ${DESCRICOES_PELE["pele-morena"]} com desidratação.
      Vista frontal mostrando enofitalmia, lábios ressecados, leve abatimento. Criança cooperadora.
      Fundo branco. Fotografia médica.`,
    observacoesValidacao: [
      "Enofitalmia perceptível",
      "Ressecamento de lábios",
      "Criança escolar",
      "Pele morena",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "escolar-pele-negra-face-olhos-desidratacao",
    faixaEtaria: "escolar",
    tomPele: "pele-negra",
    regiao: "face-olhos",
    achadoClinico: "desidratacao",
    nomeArquivo: "escolar-pele-negra-face-olhos-desidratacao.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/escolar/pele-negra/face-olhos/escolar-pele-negra-face-olhos-desidratacao.png",
    promptDetalhado: `Fotografia clínica de uma criança escolar afrodescendente com ${DESCRICOES_FAIXA.escolar} e ${DESCRICOES_PELE["pele-negra"]} com desidratação.
      Vista frontal mostrando enofitalmia, lábios ressecados, aparência abatida. Criança colaboradora.
      Fundo branco. Fotografia médica educacional.`,
    observacoesValidacao: [
      "Enofitalmia visível",
      "Lábios ressecados",
      "Criança 6+ anos",
      "Aparência desidratada clara",
    ],
    dificuldadeEstimada: "media",
  },

  // =========================================================================
  // CONJUNTIVITE - 9 imagens (3 tons × 3 faixas)
  // =========================================================================

  {
    id: "lactente-pele-clara-face-olhos-conjuntivite",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    regiao: "face-olhos",
    achadoClinico: "conjuntivite",
    nomeArquivo: "lactente-pele-clara-face-olhos-conjuntivite.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/lactente/pele-clara/face-olhos/lactente-pele-clara-face-olhos-conjuntivite.png",
    promptDetalhado: `Fotografia clínica de um bebê com ${DESCRICOES_FAIXA.lactente} e ${DESCRICOES_PELE["pele-clara"]} com conjuntivite.
      Vista frontal mostrando hiperemia conjuntival discreta a moderada, olhos levemente avermelhados, possível secreção clara ou leve mucosa.
      Sem edema palpebral excessivo. Olho pode estar parcialmente fechado por desconforto. Bebê sem distresse extremo.
      Fundo branco. Iluminação que ressalte o aspecto avermelhado. Fotografia médica realista.`,
    observacoesValidacao: [
      "Hiperemia conjuntival visível",
      "Olhos avermelhados",
      "Sem edema intenso",
      "Possível secreção leve",
      "Bebê sem distresse grave",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "lactente-pele-morena-face-olhos-conjuntivite",
    faixaEtaria: "lactente",
    tomPele: "pele-morena",
    regiao: "face-olhos",
    achadoClinico: "conjuntivite",
    nomeArquivo: "lactente-pele-morena-face-olhos-conjuntivite.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/lactente/pele-morena/face-olhos/lactente-pele-morena-face-olhos-conjuntivite.png",
    promptDetalhado: `Fotografia clínica de um bebê com ${DESCRICOES_FAIXA.lactente} e ${DESCRICOES_PELE["pele-morena"]} com conjuntivite.
      Vista frontal mostrando olhos avermelhados com hiperemia conjuntival visível. Possível secreção leve.
      Bebê cooperativo ou discretamente incomodado. Fundo branco. Fotografia médica realista.`,
    observacoesValidacao: [
      "Hiperemia conjuntival clara",
      "Olhos avermelhados",
      "Secreção possível",
      "Bebê sem gravidade",
      "Pele morena uniforme",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "lactente-pele-negra-face-olhos-conjuntivite",
    faixaEtaria: "lactente",
    tomPele: "pele-negra",
    regiao: "face-olhos",
    achadoClinico: "conjuntivite",
    nomeArquivo: "lactente-pele-negra-face-olhos-conjuntivite.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/lactente/pele-negra/face-olhos/lactente-pele-negra-face-olhos-conjuntivite.png",
    promptDetalhado: `Fotografia clínica de um bebê afrodescendente com ${DESCRICOES_FAIXA.lactente} e ${DESCRICOES_PELE["pele-negra"]} com conjuntivite.
      Vista frontal mostrando hiperemia conjuntival, olhos levemente avermelhados, possível secreção.
      Bebê cooperativo. Fundo branco. Fotografia médica educacional.`,
    observacoesValidacao: [
      "Hiperemia visível em pele negra",
      "Olhos com aspecto inflamado",
      "Sem edema palpebral grave",
      "Bebê em bom estado geral",
    ],
    dificuldadeEstimada: "alta",
  },

  {
    id: "pre-escolar-pele-clara-face-olhos-conjuntivite",
    faixaEtaria: "pre-escolar",
    tomPele: "pele-clara",
    regiao: "face-olhos",
    achadoClinico: "conjuntivite",
    nomeArquivo: "pre-escolar-pele-clara-face-olhos-conjuntivite.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/pre-escolar/pele-clara/face-olhos/pre-escolar-pele-clara-face-olhos-conjuntivite.png",
    promptDetalhado: `Fotografia clínica de uma criança pré-escolar com ${DESCRICOES_FAIXA["pre-escolar"]} e ${DESCRICOES_PELE["pele-clara"]} com conjuntivite.
      Vista frontal mostrando olhos avermelhados, hiperemia conjuntival visível, possível secreção.
      Criança cooperadora, expressão de leve incômodo. Fundo branco. Fotografia médica.`,
    observacoesValidacao: [
      "Hiperemia conjuntival clara",
      "Olhos avermelhados",
      "Criança 2-6 anos",
      "Sem edema excessivo",
      "Criança sem gravidade",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "pre-escolar-pele-morena-face-olhos-conjuntivite",
    faixaEtaria: "pre-escolar",
    tomPele: "pele-morena",
    regiao: "face-olhos",
    achadoClinico: "conjuntivite",
    nomeArquivo: "pre-escolar-pele-morena-face-olhos-conjuntivite.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/pre-escolar/pele-morena/face-olhos/pre-escolar-pele-morena-face-olhos-conjuntivite.png",
    promptDetalhado: `Fotografia clínica de uma criança pré-escolar com ${DESCRICOES_FAIXA["pre-escolar"]} e ${DESCRICOES_PELE["pele-morena"]} com conjuntivite.
      Vista frontal mostrando olhos avermelhados, hiperemia conjuntival. Criança cooperadora.
      Fundo branco. Fotografia médica realista.`,
    observacoesValidacao: [
      "Hiperemia visível",
      "Olhos avermelhados",
      "Criança pré-escolar",
      "Pele morena uniforme",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "pre-escolar-pele-negra-face-olhos-conjuntivite",
    faixaEtaria: "pre-escolar",
    tomPele: "pele-negra",
    regiao: "face-olhos",
    achadoClinico: "conjuntivite",
    nomeArquivo: "pre-escolar-pele-negra-face-olhos-conjuntivite.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/pre-escolar/pele-negra/face-olhos/pre-escolar-pele-negra-face-olhos-conjuntivite.png",
    promptDetalhado: `Fotografia clínica de uma criança afrodescendente pré-escolar com ${DESCRICOES_FAIXA["pre-escolar"]} e ${DESCRICOES_PELE["pele-negra"]} com conjuntivite.
      Vista frontal mostrando hiperemia conjuntival, olhos avermelhados, possível secreção. Criança cooperadora.
      Fundo branco. Fotografia médica educacional.`,
    observacoesValidacao: [
      "Hiperemia conjuntival clara",
      "Olhos avermelhados",
      "Criança 2-6 anos",
      "Sem edema palpebral grave",
    ],
    dificuldadeEstimada: "alta",
  },

  {
    id: "escolar-pele-clara-face-olhos-conjuntivite",
    faixaEtaria: "escolar",
    tomPele: "pele-clara",
    regiao: "face-olhos",
    achadoClinico: "conjuntivite",
    nomeArquivo: "escolar-pele-clara-face-olhos-conjuntivite.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/escolar/pele-clara/face-olhos/escolar-pele-clara-face-olhos-conjuntivite.png",
    promptDetalhado: `Fotografia clínica de uma criança escolar com ${DESCRICOES_FAIXA.escolar} e ${DESCRICOES_PELE["pele-clara"]} com conjuntivite.
      Vista frontal mostrando olhos avermelhados, hiperemia conjuntival. Criança cooperadora.
      Fundo branco. Fotografia médica.`,
    observacoesValidacao: [
      "Hiperemia visível",
      "Olhos avermelhados",
      "Criança 6+ anos",
      "Sem edema intenso",
    ],
    dificuldadeEstimada: "baixa",
  },

  {
    id: "escolar-pele-morena-face-olhos-conjuntivite",
    faixaEtaria: "escolar",
    tomPele: "pele-morena",
    regiao: "face-olhos",
    achadoClinico: "conjuntivite",
    nomeArquivo: "escolar-pele-morena-face-olhos-conjuntivite.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/escolar/pele-morena/face-olhos/escolar-pele-morena-face-olhos-conjuntivite.png",
    promptDetalhado: `Fotografia clínica de uma criança escolar com ${DESCRICOES_FAIXA.escolar} e ${DESCRICOES_PELE["pele-morena"]} com conjuntivite.
      Vista frontal mostrando olhos avermelhados, hiperemia conjuntival. Criança colaboradora.
      Fundo branco. Fotografia médica.`,
    observacoesValidacao: [
      "Hiperemia clara",
      "Olhos avermelhados",
      "Criança escolar",
      "Pele morena",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "escolar-pele-negra-face-olhos-conjuntivite",
    faixaEtaria: "escolar",
    tomPele: "pele-negra",
    regiao: "face-olhos",
    achadoClinico: "conjuntivite",
    nomeArquivo: "escolar-pele-negra-face-olhos-conjuntivite.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/escolar/pele-negra/face-olhos/escolar-pele-negra-face-olhos-conjuntivite.png",
    promptDetalhado: `Fotografia clínica de uma criança escolar afrodescendente com ${DESCRICOES_FAIXA.escolar} e ${DESCRICOES_PELE["pele-negra"]} com conjuntivite.
      Vista frontal mostrando hiperemia conjuntival, olhos avermelhados. Criança colaboradora.
      Fundo branco. Fotografia médica educacional.`,
    observacoesValidacao: [
      "Hiperemia visível",
      "Olhos avermelhados",
      "Criança 6+ anos",
      "Fotografia clara e diagnóstica",
    ],
    dificuldadeEstimada: "media",
  },

  // =========================================================================
  // ICTERÍCIA - 9 imagens (3 tons × 3 faixas)
  // =========================================================================

  {
    id: "lactente-pele-clara-face-olhos-ictericia",
    faixaEtaria: "lactente",
    tomPele: "pele-clara",
    regiao: "face-olhos",
    achadoClinico: "ictericia",
    nomeArquivo: "lactente-pele-clara-face-olhos-ictericia.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/lactente/pele-clara/face-olhos/lactente-pele-clara-face-olhos-ictericia.png",
    promptDetalhado: `Fotografia clínica de um bebê com ${DESCRICOES_FAIXA.lactente} e ${DESCRICOES_PELE["pele-clara"]} com icterícia.
      Vista frontal e close-up mostrando coloração amarelada sutil a moderada em escleras (conjuntiva) e pele facial.
      A icterícia não deve ser extremamente intensa (risco de kernicterus) nem muito leve. Aparência clinicamente relevante para fins diagnósticos.
      Bebê alerta, sem sinais de encefalopatia bilirrubínica. Fundo branco. Iluminação que ressalte a tonalidade amarelada.
      Fotografia médica realista.`,
    observacoesValidacao: [
      "Coloração amarelada clara em escleras",
      "Pele facial com matiz amarelo",
      "Icterícia moderada (não extrema, não mínima)",
      "Bebê alerta e bem",
      "Sem sinais de comprometimento neurológico",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "lactente-pele-morena-face-olhos-ictericia",
    faixaEtaria: "lactente",
    tomPele: "pele-morena",
    regiao: "face-olhos",
    achadoClinico: "ictericia",
    nomeArquivo: "lactente-pele-morena-face-olhos-ictericia.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/lactente/pele-morena/face-olhos/lactente-pele-morena-face-olhos-ictericia.png",
    promptDetalhado: `Fotografia clínica de um bebê com ${DESCRICOES_FAIXA.lactente} e ${DESCRICOES_PELE["pele-morena"]} com icterícia.
      Vista frontal mostrando escleras amareladas e pele com matiz amarelado mesmo em tom moreno. Icterícia deve ser clara e diagnosticável.
      Bebê alerta. Em pele morena, a icterícia pode ser sutil; deve estar evidente aqui. Fundo branco.
      Iluminação natural ou profissional. Fotografia médica educacional.`,
    observacoesValidacao: [
      "Icterícia detectável em pele morena",
      "Escleras amareladas",
      "Pele com aspecto amarelado moderado",
      "Bebê bem geral",
      "Sem sinais de doença hemolítica grave",
    ],
    dificuldadeEstimada: "alta",
  },

  {
    id: "lactente-pele-negra-face-olhos-ictericia",
    faixaEtaria: "lactente",
    tomPele: "pele-negra",
    regiao: "face-olhos",
    achadoClinico: "ictericia",
    nomeArquivo: "lactente-pele-negra-face-olhos-ictericia.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/lactente/pele-negra/face-olhos/lactente-pele-negra-face-olhos-ictericia.png",
    promptDetalhado: `Fotografia clínica de um bebê afrodescendente com ${DESCRICOES_FAIXA.lactente} e ${DESCRICOES_PELE["pele-negra"]} com icterícia.
      Vista frontal close-up mostrando escleras amareladas (aspecto diagnóstico em pele negra) e pele facial com coloração amarela.
      Em pele negra, icterícia na esclera é o achado mais importante. Bebê alerta, sem comprometimento neurológico.
      Fundo branco. Iluminação clara. Fotografia médica realista e educacional.`,
    observacoesValidacao: [
      "Icterícia em pele negra (foco em escleras)",
      "Escleras claramente amareladas",
      "Pele com matiz amarelo",
      "Bebê alerta e bem",
      "Fotografia diagnóstica clara",
    ],
    dificuldadeEstimada: "alta",
  },

  {
    id: "pre-escolar-pele-clara-face-olhos-ictericia",
    faixaEtaria: "pre-escolar",
    tomPele: "pele-clara",
    regiao: "face-olhos",
    achadoClinico: "ictericia",
    nomeArquivo: "pre-escolar-pele-clara-face-olhos-ictericia.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/pre-escolar/pele-clara/face-olhos/pre-escolar-pele-clara-face-olhos-ictericia.png",
    promptDetalhado: `Fotografia clínica de uma criança pré-escolar com ${DESCRICOES_FAIXA["pre-escolar"]} e ${DESCRICOES_PELE["pele-clara"]} com icterícia.
      Vista frontal mostrando escleras amareladas, pele facial com coloração amarela. Criança alerta, cooperadora.
      Icterícia moderada, clinicamente relevante. Fundo branco. Fotografia médica.`,
    observacoesValidacao: [
      "Escleras amareladas",
      "Pele com matiz amarelo",
      "Criança 2-6 anos",
      "Criança alerta e bem",
      "Icterícia evidente",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "pre-escolar-pele-morena-face-olhos-ictericia",
    faixaEtaria: "pre-escolar",
    tomPele: "pele-morena",
    regiao: "face-olhos",
    achadoClinico: "ictericia",
    nomeArquivo: "pre-escolar-pele-morena-face-olhos-ictericia.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/pre-escolar/pele-morena/face-olhos/pre-escolar-pele-morena-face-olhos-ictericia.png",
    promptDetalhado: `Fotografia clínica de uma criança pré-escolar com ${DESCRICOES_FAIXA["pre-escolar"]} e ${DESCRICOES_PELE["pele-morena"]} com icterícia.
      Vista frontal mostrando escleras amareladas e pele com coloração amarela. Criança cooperadora.
      Icterícia deve ser clara. Fondo branco. Fotografia médica.`,
    observacoesValidacao: [
      "Icterícia diagnosticável em pele morena",
      "Escleras amareladas",
      "Pele com aspecto amarelado",
      "Criança pré-escolar",
      "Criança bem",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "pre-escolar-pele-negra-face-olhos-ictericia",
    faixaEtaria: "pre-escolar",
    tomPele: "pele-negra",
    regiao: "face-olhos",
    achadoClinico: "ictericia",
    nomeArquivo: "pre-escolar-pele-negra-face-olhos-ictericia.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/pre-escolar/pele-negra/face-olhos/pre-escolar-pele-negra-face-olhos-ictericia.png",
    promptDetalhado: `Fotografia clínica de uma criança afrodescendente pré-escolar com ${DESCRICOES_FAIXA["pre-escolar"]} e ${DESCRICOES_PELE["pele-negra"]} com icterícia.
      Vista frontal mostrando escleras amareladas (achado-chave) e pele com coloração amarela. Criança alerta e cooperadora.
      Fundo branco. Fotografia médica educacional.`,
    observacoesValidacao: [
      "Escleras amareladas (diagnóstico em pele negra)",
      "Pele com matiz amarelo",
      "Criança 2-6 anos",
      "Criança alerta e bem",
      "Icterícia clara",
    ],
    dificuldadeEstimada: "alta",
  },

  {
    id: "escolar-pele-clara-face-olhos-ictericia",
    faixaEtaria: "escolar",
    tomPele: "pele-clara",
    regiao: "face-olhos",
    achadoClinico: "ictericia",
    nomeArquivo: "escolar-pele-clara-face-olhos-ictericia.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/escolar/pele-clara/face-olhos/escolar-pele-clara-face-olhos-ictericia.png",
    promptDetalhado: `Fotografia clínica de uma criança escolar com ${DESCRICOES_FAIXA.escolar} e ${DESCRICOES_PELE["pele-clara"]} com icterícia.
      Vista frontal mostrando escleras amareladas, pele facial com coloração amarela. Criança maior, alerta.
      Fundo branco. Fotografia médica.`,
    observacoesValidacao: [
      "Escleras amareladas",
      "Pele com matiz amarelo",
      "Criança 6+ anos",
      "Criança bem",
      "Icterícia evidente",
    ],
    dificuldadeEstimada: "baixa",
  },

  {
    id: "escolar-pele-morena-face-olhos-ictericia",
    faixaEtaria: "escolar",
    tomPele: "pele-morena",
    regiao: "face-olhos",
    achadoClinico: "ictericia",
    nomeArquivo: "escolar-pele-morena-face-olhos-ictericia.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/escolar/pele-morena/face-olhos/escolar-pele-morena-face-olhos-ictericia.png",
    promptDetalhado: `Fotografia clínica de uma criança escolar com ${DESCRICOES_FAIXA.escolar} e ${DESCRICOES_PELE["pele-morena"]} com icterícia.
      Vista frontal mostrando escleras amareladas e pele com coloração amarela. Criança colaboradora.
      Fundo branco. Fotografia médica.`,
    observacoesValidacao: [
      "Icterícia diagnosticável em pele morena",
      "Escleras amareladas",
      "Pele com aspecto amarelado",
      "Criança escolar",
      "Criança bem",
    ],
    dificuldadeEstimada: "media",
  },

  {
    id: "escolar-pele-negra-face-olhos-ictericia",
    faixaEtaria: "escolar",
    tomPele: "pele-negra",
    regiao: "face-olhos",
    achadoClinico: "ictericia",
    nomeArquivo: "escolar-pele-negra-face-olhos-ictericia.png",
    caminhoCompleto:
      "/images/pediatria/exames-interativos-v2/escolar/pele-negra/face-olhos/escolar-pele-negra-face-olhos-ictericia.png",
    promptDetalhado: `Fotografia clínica de uma criança escolar afrodescendente com ${DESCRICOES_FAIXA.escolar} e ${DESCRICOES_PELE["pele-negra"]} com icterícia.
      Vista frontal mostrando escleras amareladas e pele com coloração amarela. Criança alerta e colaboradora.
      Fundo branco. Fotografia médica educacional.`,
    observacoesValidacao: [
      "Escleras amareladas (achado diagnóstico)",
      "Pele com matiz amarelo",
      "Criança 6+ anos",
      "Criança alerta",
      "Icterícia clara",
    ],
    dificuldadeEstimada: "media",
  },
];

// ============================================================================
// ÍNDICE E FUNÇÕES DE ACESSO
// ============================================================================

export function obterPromptsFaceOlhos(): PromptGeracaoImagemV2[] {
  return PROMPTS_FACE_OLHOS;
}

export function obterPromptPorId(id: string): PromptGeracaoImagemV2 | undefined {
  return PROMPTS_FACE_OLHOS.find((p) => p.id === id);
}

export function obterPromptsPorAchado(achado: string): PromptGeracaoImagemV2[] {
  return PROMPTS_FACE_OLHOS.filter((p) => p.achadoClinico === achado);
}

export function obterPromptsPorFaixa(faixa: string): PromptGeracaoImagemV2[] {
  return PROMPTS_FACE_OLHOS.filter((p) => p.faixaEtaria === faixa);
}

export function obterPromptsPorTom(tom: string): PromptGeracaoImagemV2[] {
  return PROMPTS_FACE_OLHOS.filter((p) => p.tomPele === tom);
}

export function obterResumoPrompts() {
  const achados = new Set(PROMPTS_FACE_OLHOS.map((p) => p.achadoClinico));
  const faixas = new Set(PROMPTS_FACE_OLHOS.map((p) => p.faixaEtaria));
  const tons = new Set(PROMPTS_FACE_OLHOS.map((p) => p.tomPele));

  const dificuldades = {
    baixa: PROMPTS_FACE_OLHOS.filter((p) => p.dificuldadeEstimada === "baixa").length,
    media: PROMPTS_FACE_OLHOS.filter((p) => p.dificuldadeEstimada === "media").length,
    alta: PROMPTS_FACE_OLHOS.filter((p) => p.dificuldadeEstimada === "alta").length,
  };

  return {
    totalPrompts: PROMPTS_FACE_OLHOS.length,
    achados: {
      lista: Array.from(achados),
      total: achados.size,
      contagem: Object.fromEntries(
        Array.from(achados).map((a) => [a, PROMPTS_FACE_OLHOS.filter((p) => p.achadoClinico === a).length])
      ),
    },
    faixas: {
      lista: Array.from(faixas),
      total: faixas.size,
      contagem: Object.fromEntries(
        Array.from(faixas).map((f) => [f, PROMPTS_FACE_OLHOS.filter((p) => p.faixaEtaria === f).length])
      ),
    },
    tons: {
      lista: Array.from(tons),
      total: tons.size,
      contagem: Object.fromEntries(Array.from(tons).map((t) => [t, PROMPTS_FACE_OLHOS.filter((p) => p.tomPele === t).length])),
    },
    dificuldades,
  };
}
