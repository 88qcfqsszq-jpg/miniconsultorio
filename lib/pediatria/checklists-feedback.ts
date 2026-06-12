// Checklists de feedback pediátrico específicos por caso

export type CategoriaPediatrica =
  | "comunicacao"
  | "anamnese"
  | "historia_pediatrica"
  | "exame_fisico"
  | "procedimento"
  | "raciocinio"
  | "exames"
  | "conduta_orientacao";

export interface ItemChecklistPediatrico {
  id: string;
  descricao: string;
  categoria: CategoriaPediatrica;
  peso: number;
  obrigatorio?: boolean;
  palavrasChave?: string[];
}

export interface ChecklistPediatrico {
  casoId: string;
  titulo: string;
  descricaoBreve: string;
  faixaEtaria?: string;
  itens: ItemChecklistPediatrico[];
  diagnosticoEsperado: string;
  falaModeloResumida: string;
  pesoPorCategoria: Record<CategoriaPediatrica, number>;
}

// ============================================================================
// CHECKLIST PADRÃO — CATEGORIAS FIXAS
// ============================================================================

export const CATEGORIAS_FEEDBACK_PEDIATRICO: Record<CategoriaPediatrica, { label: string; descricao: string }> = {
  comunicacao: {
    label: "Comunicação Pediátrica",
    descricao: "Abordagem adequada com criança e responsável",
  },
  anamnese: {
    label: "Anamnese da Queixa Atual",
    descricao: "Investigação detalhada da queixa principal",
  },
  historia_pediatrica: {
    label: "História Pediátrica",
    descricao: "Dados essenciais: vacinação, gestação, desenvolvimento",
  },
  exame_fisico: {
    label: "Exame Físico Pediátrico",
    descricao: "Manobras e técnicas pediátricas",
  },
  procedimento: {
    label: "Procedimentos Pediátricos",
    descricao: "Técnicas específicas: PA, FR, perímetro, etc.",
  },
  raciocinio: {
    label: "Raciocínio Clínico",
    descricao: "Hipóteses, diferenciais e gravidade",
  },
  exames: {
    label: "Exames Complementares",
    descricao: "Solicitação apropriada e justificada",
  },
  conduta_orientacao: {
    label: "Conduta e Orientação",
    descricao: "Sinais de alarme, orientação à família, acompanhamento",
  },
};

// Distribuição de peso total 20 pontos
export const PESO_PADRAO_PEDIATRICO: Record<CategoriaPediatrica, number> = {
  comunicacao: 2,
  anamnese: 4,
  historia_pediatrica: 3,
  exame_fisico: 4,
  procedimento: 2,
  raciocinio: 2,
  exames: 2,
  conduta_orientacao: 1,
};

// ============================================================================
// CHECKLISTS ESPECÍFICOS POR CASO
// ============================================================================

export const CHECKLIST_PED_01: ChecklistPediatrico = {
  casoId: "ped-01",
  titulo: "Febre em Criança de 4 Anos",
  descricaoBreve: "Anamnese e exame físico em criança com febre",
  faixaEtaria: "pre_escolar",
  diagnosticoEsperado: "Infecção viral vs bacteriana com febre",
  falaModeloResumida:
    "Em criança pré-escolar com febre há 3 dias, devo investigar sinais de gravidade, vacinação, contato com doentes e estado geral. No exame, avaliaria FR, ausculta pulmonar e abdominal, linfonodos, pele. Solicitaria exames conforme achados clínicos e gravidade.",
  pesoPorCategoria: { ...PESO_PADRAO_PEDIATRICO },
  itens: [
    // Comunicação
    {
      id: "com-apresentacao",
      descricao: "Apresentou-se e explicou objetivo da consulta",
      categoria: "comunicacao",
      peso: 0.25,
      obrigatorio: true,
    },
    {
      id: "com-responsavel",
      descricao: "Dirigiu perguntas ao responsável de forma respeitosa",
      categoria: "comunicacao",
      peso: 0.25,
      obrigatorio: true,
    },
    {
      id: "com-crianca",
      descricao: "Envolveu criança na consulta quando apropriado",
      categoria: "comunicacao",
      peso: 0.25,
    },
    {
      id: "com-linguagem",
      descricao: "Usou linguagem adequada (não técnica demais, não infantil demais)",
      categoria: "comunicacao",
      peso: 0.25,
    },
    {
      id: "com-explicacao",
      descricao: "Explicou procedimentos antes de realizá-los",
      categoria: "comunicacao",
      peso: 0.5,
    },
    {
      id: "com-acolhimento",
      descricao: "Manteve postura acolhedora e tranquilizadora",
      categoria: "comunicacao",
      peso: 0.5,
      obrigatorio: true,
    },

    // Anamnese
    {
      id: "anam-inicio",
      descricao: "Perguntou início e duração da febre",
      categoria: "anamnese",
      peso: 0.5,
      obrigatorio: true,
      palavrasChave: ["quando começou", "há quanto tempo", "dias", "horas"],
    },
    {
      id: "anam-temperatura",
      descricao: "Perguntou temperatura máxima aferida",
      categoria: "anamnese",
      peso: 0.5,
      obrigatorio: true,
      palavrasChave: ["temperatura máxima", "febre mais alta", "quanto marcou"],
    },
    {
      id: "anam-sintomas",
      descricao: "Perguntou sintomas associados (tosse, vômitos, diareia, rash, etc.)",
      categoria: "anamnese",
      peso: 0.75,
      obrigatorio: true,
    },
    {
      id: "anam-alimentacao",
      descricao: "Perguntou aceitação alimentar e de líquidos",
      categoria: "anamnese",
      peso: 0.5,
      obrigatorio: true,
    },
    {
      id: "anam-diurese",
      descricao: "Perguntou diurese e coloração da urina",
      categoria: "anamnese",
      peso: 0.5,
    },
    {
      id: "anam-medicacoes",
      descricao: "Perguntou medicações usadas (incluindo caseiras/naturais)",
      categoria: "anamnese",
      peso: 0.5,
    },
    {
      id: "anam-contato",
      descricao: "Perguntou contato com pessoas doentes",
      categoria: "anamnese",
      peso: 0.5,
    },
    {
      id: "anam-sinais-gravidade",
      descricao: "Investigou sinais de gravidade (convulsão, letargia, cianose, dificuldade respiratória)",
      categoria: "anamnese",
      peso: 0.75,
      obrigatorio: true,
    },

    // História pediátrica
    {
      id: "hist-vacinacao",
      descricao: "Perguntou estado vacinal e se dia de vacinação próximo",
      categoria: "historia_pediatrica",
      peso: 0.75,
      obrigatorio: true,
    },
    {
      id: "hist-gestacao",
      descricao: "Perguntou antecedentes de gestação e parto",
      categoria: "historia_pediatrica",
      peso: 0.5,
    },
    {
      id: "hist-internacoes",
      descricao: "Perguntou internações prévias",
      categoria: "historia_pediatrica",
      peso: 0.5,
    },
    {
      id: "hist-alergias",
      descricao: "Perguntou alergias a medicamentos",
      categoria: "historia_pediatrica",
      peso: 0.5,
      obrigatorio: true,
    },
    {
      id: "hist-medicamentos",
      descricao: "Perguntou medicamentos de uso contínuo",
      categoria: "historia_pediatrica",
      peso: 0.5,
    },
    {
      id: "hist-desenvolvimento",
      descricao: "Perguntou marcos do desenvolvimento",
      categoria: "historia_pediatrica",
      peso: 0.5,
    },
    {
      id: "hist-alimentacao",
      descricao: "Perguntou tipo e adequação da alimentação atual",
      categoria: "historia_pediatrica",
      peso: 0.25,
    },

    // Exame Físico
    {
      id: "exam-estado-geral",
      descricao: "Avaliou estado geral e nível de atividade",
      categoria: "exame_fisico",
      peso: 0.75,
      obrigatorio: true,
    },
    {
      id: "exam-hidratacao",
      descricao: "Avaliou sinais de hidratação",
      categoria: "exame_fisico",
      peso: 0.5,
      obrigatorio: true,
    },
    {
      id: "exam-sinais-vitais",
      descricao: "Solicitou sinais vitais (incluindo FR por 1 minuto e temperatura)",
      categoria: "exame_fisico",
      peso: 0.75,
      obrigatorio: true,
    },
    {
      id: "exam-ausculta-pulmonar",
      descricao: "Realizou ausculta pulmonar bilateral",
      categoria: "exame_fisico",
      peso: 0.75,
      obrigatorio: true,
    },
    {
      id: "exam-ausculta-cardiaca",
      descricao: "Realizou ausculta cardíaca",
      categoria: "exame_fisico",
      peso: 0.5,
    },
    {
      id: "exam-abdome",
      descricao: "Realizou palpação abdominal e pesquisou hepatomegalia/esplenomegalia",
      categoria: "exame_fisico",
      peso: 0.5,
    },
    {
      id: "exam-linfonodos",
      descricao: "Palpou linfonodos cervicais",
      categoria: "exame_fisico",
      peso: 0.5,
    },
    {
      id: "exam-pele",
      descricao: "Avaliou pele/exantema/petéquias/equimoses",
      categoria: "exame_fisico",
      peso: 0.5,
    },

    // Raciocínio clínico
    {
      id: "razao-hipotese",
      descricao: "Citou hipótese diagnóstica principal coerente com caso",
      categoria: "raciocinio",
      peso: 1,
      obrigatorio: true,
    },
    {
      id: "razao-diferenciais",
      descricao: "Mencionou diagnósticos diferenciais plausíveis",
      categoria: "raciocinio",
      peso: 0.75,
    },
    {
      id: "razao-gravidade",
      descricao: "Avaliou gravidade e sinais de alerta adequadamente",
      categoria: "raciocinio",
      peso: 0.5,
      obrigatorio: true,
    },

    // Exames complementares
    {
      id: "exam-solicitacao",
      descricao: "Solicitou exames conforme achados clínicos (não excessivo, não insuficiente)",
      categoria: "exames",
      peso: 1,
    },
    {
      id: "exam-justificativa",
      descricao: "Justificou necessidade de exames",
      categoria: "exames",
      peso: 1,
    },

    // Conduta e orientação
    {
      id: "cond-sinais-alarme",
      descricao: "Orientou sinais de alarme para retorno",
      categoria: "conduta_orientacao",
      peso: 0.75,
      obrigatorio: true,
    },
  ],
};

/**
 * Obter checklist para um caso pediátrico
 *
 * @param casoId - ID do caso
 * @returns Checklist ou undefined se não existir
 */
export function obterChecklistPediatrico(casoId: string): ChecklistPediatrico | undefined {
  return CHECKLISTS_PEDIATRICOS[casoId];
}

/**
 * Obter lista de todos os itens de um checklist
 *
 * @param checklist - Checklist a processar
 * @returns Array de itens ordenados por categoria
 */
export function obterItensOrdenados(checklist: ChecklistPediatrico): ItemChecklistPediatrico[] {
  const ordem: CategoriaPediatrica[] = [
    "comunicacao",
    "anamnese",
    "historia_pediatrica",
    "exame_fisico",
    "procedimento",
    "raciocinio",
    "exames",
    "conduta_orientacao",
  ];

  return checklist.itens.sort(
    (a, b) => ordem.indexOf(a.categoria) - ordem.indexOf(b.categoria)
  );
}

/**
 * Calcular pontuação total baseado em itens atingidos
 *
 * @param checklist - Checklist
 * @param itensAtingidos - Array de IDs de itens atingidos
 * @returns Pontuação total (0-20)
 */
export function calcularPontuacaoPediatrica(
  checklist: ChecklistPediatrico,
  itensAtingidos: string[]
): { total: number; porCategoria: Record<CategoriaPediatrica, number> } {
  const porCategoria: Record<CategoriaPediatrica, number> = {
    comunicacao: 0,
    anamnese: 0,
    historia_pediatrica: 0,
    exame_fisico: 0,
    procedimento: 0,
    raciocinio: 0,
    exames: 0,
    conduta_orientacao: 0,
  };

  let total = 0;

  for (const item of checklist.itens) {
    if (itensAtingidos.includes(item.id)) {
      porCategoria[item.categoria] += item.peso;
      total += item.peso;
    }
  }

  return { total, porCategoria };
}

/**
 * Obter itens perdidos (obrigatórios não atingidos)
 *
 * @param checklist - Checklist
 * @param itensAtingidos - Array de IDs de itens atingidos
 * @returns Array de itens perdidos críticos
 */
export function obterItensPerdidos(
  checklist: ChecklistPediatrico,
  itensAtingidos: string[]
): ItemChecklistPediatrico[] {
  return checklist.itens.filter(
    (item) => item.obrigatorio && !itensAtingidos.includes(item.id)
  );
}

// ============================================================================
// CHECKLISTS ADICIONAIS (PED-02 até PED-16)
// ============================================================================

export const CHECKLIST_PED_02: ChecklistPediatrico = {
  casoId: "ped-02",
  titulo: "Puericultura - Lactente de 8 Meses",
  descricaoBreve: "Avaliação de puericultura com medidas antropométricas",
  faixaEtaria: "lactente",
  diagnosticoEsperado: "Crescimento e desenvolvimento normais",
  falaModeloResumida: "Em lactente de 8 meses, avalio crescimento com peso, comprimento e perímetro cefálico comparando com curvas. Investo na anamnese de desenvolvimento, alimentação complementar, sono, eliminações e vacinação.",
  pesoPorCategoria: { ...PESO_PADRAO_PEDIATRICO },
  itens: [
    { id: "com-acolhimento", descricao: "Acolheu mãe/responsável", categoria: "comunicacao", peso: 1, obrigatorio: true },
    { id: "com-explicacao", descricao: "Explicou objetivo da consulta de puericultura", categoria: "comunicacao", peso: 1 },
    { id: "ana-motivo", descricao: "Perguntou motivo/contexto da consulta", categoria: "anamnese", peso: 0.5, obrigatorio: true },
    { id: "ana-alimentacao", descricao: "Investigou alimentação complementar e ingestão", categoria: "anamnese", peso: 1, obrigatorio: true },
    { id: "ana-sono", descricao: "Perguntou sono e rotina", categoria: "anamnese", peso: 0.5 },
    { id: "ana-eliminacoes", descricao: "Perguntou fezes e urina", categoria: "anamnese", peso: 0.5 },
    { id: "ana-intercorrencias", descricao: "Perguntou intercorrências/doenças recentes", categoria: "anamnese", peso: 1 },
    { id: "hist-vacinacao", descricao: "Investigou estado vacinal", categoria: "historia_pediatrica", peso: 1, obrigatorio: true },
    { id: "hist-gestacao", descricao: "Perguntou gestação/parto", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "hist-desenvolvimento", descricao: "Perguntou marcos de desenvolvimento", categoria: "historia_pediatrica", peso: 1, obrigatorio: true },
    { id: "exam-peso", descricao: "Mediu peso", categoria: "exame_fisico", peso: 1, obrigatorio: true },
    { id: "exam-comprimento", descricao: "Mediu comprimento", categoria: "exame_fisico", peso: 1, obrigatorio: true },
    { id: "exam-pc", descricao: "Mediu perímetro cefálico", categoria: "exame_fisico", peso: 1, obrigatorio: true },
    { id: "exam-estado-geral", descricao: "Avaliou estado geral e hidratação", categoria: "exame_fisico", peso: 1 },
    { id: "proc-comparacao", descricao: "Comparou medidas com curvas de crescimento", categoria: "procedimento", peso: 1, obrigatorio: true },
    { id: "raz-crescimento", descricao: "Avaliou crescimento adequado/desenvolvimento apropriado", categoria: "raciocinio", peso: 2, obrigatorio: true },
    { id: "cond-proxima-consulta", descricao: "Orientou próxima consulta de acompanhamento", categoria: "conduta_orientacao", peso: 1, obrigatorio: true },
  ],
};

export const CHECKLIST_PED_03: ChecklistPediatrico = {
  casoId: "ped-03",
  titulo: "Pressão Arterial Pediátrica - Menina 4 Anos",
  descricaoBreve: "Técnica correta de aferição e interpretação de PA",
  faixaEtaria: "pre_escolar",
  diagnosticoEsperado: "PA elevada para a idade",
  falaModeloResumida: "Em criança de 4 anos, afeço PA com manguito adequado (40% circunferência do braço), em repouso, comparando com percentis de idade, sexo e estatura.",
  pesoPorCategoria: { ...PESO_PADRAO_PEDIATRICO },
  itens: [
    { id: "com-tranquilizacao", descricao: "Tranquilizou criança", categoria: "comunicacao", peso: 1, obrigatorio: true },
    { id: "com-explicacao", descricao: "Explicou procedimento", categoria: "comunicacao", peso: 1 },
    { id: "ana-contexto", descricao: "Perguntou contexto/história anterior de PA", categoria: "anamnese", peso: 0.5 },
    { id: "ana-sintomas", descricao: "Perguntou sintomas associados se PA alterada", categoria: "anamnese", peso: 0.5 },
    { id: "hist-dados", descricao: "Verificou idade, sexo, estatura", categoria: "historia_pediatrica", peso: 1, obrigatorio: true },
    { id: "proc-repouso", descricao: "Garantiu repouso adequado", categoria: "procedimento", peso: 0.5, obrigatorio: true },
    { id: "proc-posicionamento", descricao: "Posicionou braço direito na altura do coração", categoria: "procedimento", peso: 0.5, obrigatorio: true },
    { id: "proc-manguito", descricao: "Usou manguito adequado (40% circunferência, comprimento 80-100%)", categoria: "procedimento", peso: 1, obrigatorio: true },
    { id: "proc-medicao", descricao: "Registrou PAS e PAD", categoria: "procedimento", peso: 0.5, obrigatorio: true },
    { id: "raz-percentil", descricao: "Interpretou PA por percentis idade/sexo/estatura", categoria: "raciocinio", peso: 1.5, obrigatorio: true },
    { id: "raz-classificacao", descricao: "Classificou pelo componente mais elevado", categoria: "raciocinio", peso: 0.5 },
    { id: "cond-acompanhamento", descricao: "Orientou acompanhamento/repetição conforme PA", categoria: "conduta_orientacao", peso: 1, obrigatorio: true },
  ],
};

export const CHECKLIST_PED_04: ChecklistPediatrico = {
  casoId: "ped-04",
  titulo: "Desenvolvimento Normale - Lactente 10 Meses",
  descricaoBreve: "Avaliação de marcos do desenvolvimento normal",
  faixaEtaria: "lactente",
  diagnosticoEsperado: "Desenvolvimento normal para idade",
  falaModeloResumida: "Em lactente de 10 meses, reconheço desenvolvimento normal: senta sem apoio, engatinha, pinça, balbucio. Tranquilizo mãe sobre não andar aos 10 meses ser completamente normal.",
  pesoPorCategoria: { ...PESO_PADRAO_PEDIATRICO },
  itens: [
    { id: "com-acolhimento", descricao: "Acolheu preocupação da mãe", categoria: "comunicacao", peso: 1, obrigatorio: true },
    { id: "com-explicacao", descricao: "Explicou com linguagem simples", categoria: "comunicacao", peso: 1 },
    { id: "ana-marcos-motores", descricao: "Perguntou marcos motores (senta, engatinha)", categoria: "anamnese", peso: 1, obrigatorio: true },
    { id: "ana-linguagem", descricao: "Perguntou linguagem/balbucio", categoria: "anamnese", peso: 0.75 },
    { id: "ana-interacao", descricao: "Perguntou interação social", categoria: "anamnese", peso: 0.75 },
    { id: "ana-alimentacao", descricao: "Perguntou alimentação complementar", categoria: "anamnese", peso: 0.5 },
    { id: "ana-sono", descricao: "Perguntou sono/rotina", categoria: "anamnese", peso: 0.5 },
    { id: "hist-antecedentes", descricao: "Perguntou antecedentes perinatais", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "hist-desenvolvimento-previo", descricao: "Perguntou desenvolvimento até agora", categoria: "historia_pediatrica", peso: 1.25, obrigatorio: true },
    { id: "hist-estimulos", descricao: "Perguntou estímulos no domicílio", categoria: "historia_pediatrica", peso: 1 },
    { id: "exam-sentar", descricao: "Avaliou sentar sem apoio", categoria: "exame_fisico", peso: 1, obrigatorio: true },
    { id: "exam-engatinhar", descricao: "Avaliou engatinhar/locomoção", categoria: "exame_fisico", peso: 0.75 },
    { id: "exam-pinça", descricao: "Avaliou pinça/manipulação", categoria: "exame_fisico", peso: 0.75 },
    { id: "exam-balbucio", descricao: "Avaliou balbucio/linguagem", categoria: "exame_fisico", peso: 0.5 },
    { id: "exam-social", descricao: "Avaliou interação social", categoria: "exame_fisico", peso: 0.5 },
    { id: "raz-normalidade", descricao: "Reconheceu desenvolvimento normal/não andar aos 10 meses normal", categoria: "raciocinio", peso: 2, obrigatorio: true },
    { id: "cond-tranquilizacao", descricao: "Tranquilizou mãe/orientou estimulação", categoria: "conduta_orientacao", peso: 1, obrigatorio: true },
  ],
};

export const CHECKLIST_PED_05: ChecklistPediatrico = {
  casoId: "ped-05",
  titulo: "Insuficiência Cardíaca em Lactente - 4 Meses",
  descricaoBreve: "Reconhecimento de sintomas e investigação de cardiopatia congênita",
  faixaEtaria: "lactente",
  diagnosticoEsperado: "Insuficiência cardíaca / Cardiopatia congênita",
  falaModeloResumida: "Em lactente de 4 meses com fadiga alimentar, sudorese e pausas respiratórias, suspeito cardiopatia congênita com repercussão. Solicito ecocardiograma urgentemente e refiro cardiologia pediátrica.",
  pesoPorCategoria: { ...PESO_PADRAO_PEDIATRICO },
  itens: [
    { id: "com-acolhimento", descricao: "Acolheu preocupação da mãe", categoria: "comunicacao", peso: 1, obrigatorio: true },
    { id: "com-explicacao", descricao: "Explicou avaliação cardiológica", categoria: "comunicacao", peso: 1 },
    { id: "ana-fadiga", descricao: "Perguntou cansaço durante mamadas", categoria: "anamnese", peso: 1, obrigatorio: true },
    { id: "ana-sudorese", descricao: "Perguntou sudorese", categoria: "anamnese", peso: 1, obrigatorio: true },
    { id: "ana-pausas", descricao: "Perguntou pausas para respirar", categoria: "anamnese", peso: 0.75, obrigatorio: true },
    { id: "ana-taquipneia", descricao: "Perguntou taquipneia", categoria: "anamnese", peso: 0.75 },
    { id: "ana-ganho-peso", descricao: "Perguntou ganho de peso inadequado", categoria: "anamnese", peso: 0.75 },
    { id: "hist-perinatais", descricao: "Perguntou antecedentes perinatais", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "hist-antecedentes-card", descricao: "Perguntou cardiopatia na família", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "hist-vacinacao", descricao: "Verificou vacinação", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "exam-fr", descricao: "Avaliou FR por 1 minuto", categoria: "exame_fisico", peso: 0.75, obrigatorio: true },
    { id: "exam-esforço", descricao: "Avaliou esforço respiratório", categoria: "exame_fisico", peso: 0.75 },
    { id: "exam-ausculta-card", descricao: "Auscultou coração e procurou sopro", categoria: "exame_fisico", peso: 1, obrigatorio: true },
    { id: "exam-figado", descricao: "Palpou fígado (hepatomegalia)", categoria: "exame_fisico", peso: 0.75 },
    { id: "exam-perfusao", descricao: "Avaliou perfusão/TEC", categoria: "exame_fisico", peso: 0.75, obrigatorio: true },
    { id: "raz-suspeitou-ic", descricao: "Suspeitou insuficiência cardíaca/cardiopatia", categoria: "raciocinio", peso: 1.5, obrigatorio: true },
    { id: "raz-gravidade", descricao: "Reconheceu sinais de gravidade", categoria: "raciocinio", peso: 1 },
    { id: "exam-solicitou-eco", descricao: "Solicitou ecocardiograma", categoria: "exames", peso: 1, obrigatorio: true },
    { id: "exam-solicitou-outros", descricao: "Solicitou ECG/RX/oximetria", categoria: "exames", peso: 1 },
    { id: "cond-referencia", descricao: "Referiu cardiologia pediátrica/avaliação grave", categoria: "conduta_orientacao", peso: 1, obrigatorio: true },
  ],
};

export const CHECKLIST_PED_06: ChecklistPediatrico = {
  casoId: "ped-06",
  titulo: "Suspeita de Maus-Tratos - Menina 6 Anos",
  descricaoBreve: "Identificação e notificação de suspeita de abuso infantil",
  faixaEtaria: "escolar",
  diagnosticoEsperado: "Suspeita de abuso físico",
  falaModeloResumida: "Diante de história incompatível, equimoses em diferentes estágios e múltiplas regiões, suspeito maus-tratos. Registro detalhadamente, fotografo achados e realizo notificação compulsória ao Conselho Tutelar.",
  pesoPorCategoria: { ...PESO_PADRAO_PEDIATRICO },
  itens: [
    { id: "com-abordagem", descricao: "Abordou de forma cuidadosa e não acusatória", categoria: "comunicacao", peso: 1, obrigatorio: true },
    { id: "com-protecao", descricao: "Priorizou segurança da criança", categoria: "comunicacao", peso: 1, obrigatorio: true },
    { id: "ana-mecanismo", descricao: "Investigou mecanismo de lesão", categoria: "anamnese", peso: 1, obrigatorio: true },
    { id: "ana-incompatibilidade", descricao: "Percebeu inconsistências na história", categoria: "anamnese", peso: 1.5, obrigatorio: true },
    { id: "ana-tempo", descricao: "Perguntou tempo de evolução das lesões", categoria: "anamnese", peso: 0.5 },
    { id: "ana-procura-tardia", descricao: "Investigou procura tardia de atendimento", categoria: "anamnese", peso: 0.5 },
    { id: "hist-antecedentes", descricao: "Perguntou antecedentes/episódios prévios", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "hist-escola", descricao: "Investigou relações na escola/cuidador", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "hist-desenvolvimento", descricao: "Perguntou desenvolvimento/comportamento", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "exam-descreveu", descricao: "Descreveu equimoses detalhadamente", categoria: "exame_fisico", peso: 1, obrigatorio: true },
    { id: "exam-estagios", descricao: "Identificou equimoses em diferentes estágios", categoria: "exame_fisico", peso: 1, obrigatorio: true },
    { id: "exam-multiplas-regioes", descricao: "Avaliou múltiplas regiões corporais", categoria: "exame_fisico", peso: 1, obrigatorio: true },
    { id: "exam-localizacao", descricao: "Registrou localização exata das lesões", categoria: "exame_fisico", peso: 0.75 },
    { id: "raz-suspeitou", descricao: "Suspeitou maus-tratos", categoria: "raciocinio", peso: 2, obrigatorio: true },
    { id: "exam-fotografias", descricao: "Considerou fotografar achados", categoria: "exames", peso: 0.5 },
    { id: "cond-notificacao", descricao: "Realizou notificação compulsória", categoria: "conduta_orientacao", peso: 1, obrigatorio: true },
    { id: "cond-conselho", descricao: "Acionou Conselho Tutelar/rede de proteção", categoria: "conduta_orientacao", peso: 1, obrigatorio: true },
  ],
};

export const CHECKLIST_PED_07: ChecklistPediatrico = {
  casoId: "ped-07",
  titulo: "Cardiopatia Acianótica - Lactente 3 Meses",
  descricaoBreve: "Reconhecimento de cardiopatia congênita acianótica",
  faixaEtaria: "lactente",
  diagnosticoEsperado: "Cardiopatia congênita acianótica",
  falaModeloResumida: "Em lactente de 3 meses com fadiga alimentar, sudorese e ganho ponderal inadequado, suspeito cardiopatia acianótica. Ausculto coração, procuro sopro e solicito ecocardiograma urgente.",
  pesoPorCategoria: { ...PESO_PADRAO_PEDIATRICO },
  itens: [
    { id: "ana-fadiga", descricao: "Perguntou cansaço/fadiga às mamadas", categoria: "anamnese", peso: 1.25, obrigatorio: true },
    { id: "ana-sudorese", descricao: "Perguntou sudorese", categoria: "anamnese", peso: 0.75 },
    { id: "ana-ganho-peso", descricao: "Perguntou ganho ponderal inadequado", categoria: "anamnese", peso: 1, obrigatorio: true },
    { id: "hist-perinatais", descricao: "Perguntou gestação/parto", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "hist-familia", descricao: "Investigou cardiopatia familiar", categoria: "historia_pediatrica", peso: 1 },
    { id: "exam-ausculta", descricao: "Auscultou completamente - procurou sopro", categoria: "exame_fisico", peso: 1.5, obrigatorio: true },
    { id: "exam-hepatomegalia", descricao: "Avaliou fígado (hepatomegalia)", categoria: "exame_fisico", peso: 0.75 },
    { id: "exam-taquipneia", descricao: "Avaliou FR", categoria: "exame_fisico", peso: 0.75 },
    { id: "exam-perfusao", descricao: "Avaliou perfusão", categoria: "exame_fisico", peso: 0.75 },
    { id: "raz-suspeitou", descricao: "Suspeitou cardiopatia com repercussão", categoria: "raciocinio", peso: 1.5, obrigatorio: true },
    { id: "exam-eco", descricao: "Solicitou ecocardiograma", categoria: "exames", peso: 1.5, obrigatorio: true },
    { id: "exam-ecg", descricao: "Solicitou ECG", categoria: "exames", peso: 0.5 },
    { id: "exam-rx", descricao: "Solicitou RX tórax", categoria: "exames", peso: 0.5 },
    { id: "cond-referencia", descricao: "Referiu cardiologia pediátrica", categoria: "conduta_orientacao", peso: 1.5, obrigatorio: true },
  ],
};

export const CHECKLIST_PED_08: ChecklistPediatrico = {
  casoId: "ped-08",
  titulo: "Cardiopatia Cianótica - Lactente 6 Meses",
  descricaoBreve: "Reconhecimento de cianose central em cardiopatia congênita",
  faixaEtaria: "lactente",
  diagnosticoEsperado: "Cardiopatia congênita cianótica",
  falaModeloResumida: "Em lactente com cianose central em lábios/língua, baqueteamento, sopro e baixa saturação, suspeito cardiopatia congênita cianótica grave. Solicito ecocardiograma urgente e refiro centro de cirurgia cardíaca.",
  pesoPorCategoria: { ...PESO_PADRAO_PEDIATRICO },
  itens: [
    { id: "ana-cianose", descricao: "Investigou cianose em diferentes contextos", categoria: "anamnese", peso: 1.25, obrigatorio: true },
    { id: "ana-quando", descricao: "Perguntou quando aparece (repouso/choro/mamada)", categoria: "anamnese", peso: 1 },
    { id: "ana-ganho-peso", descricao: "Perguntou ganho ponderal", categoria: "anamnese", peso: 0.75 },
    { id: "hist-perinatais", descricao: "Perguntou gestação/parto", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "hist-familia", descricao: "Investigou antecedentes cardíacos familiares", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "exam-cianose-central", descricao: "Identificou cianose central em lábios/língua", categoria: "exame_fisico", peso: 1.5, obrigatorio: true },
    { id: "exam-baqueteamento", descricao: "Inspecionou baqueteamento digital", categoria: "exame_fisico", peso: 0.75 },
    { id: "exam-ausculta", descricao: "Auscultou coração - identificou sopro", categoria: "exame_fisico", peso: 1, obrigatorio: true },
    { id: "exam-hepatomegalia", descricao: "Avaliou hepatomegalia", categoria: "exame_fisico", peso: 0.75 },
    { id: "exam-saturacao", descricao: "Verificou saturação reduzida", categoria: "exame_fisico", peso: 1, obrigatorio: true },
    { id: "raz-cianose", descricao: "Reconheceu cianose central como cardiopatia", categoria: "raciocinio", peso: 1.5, obrigatorio: true },
    { id: "raz-gravidade", descricao: "Reconheceu urgência/gravidade", categoria: "raciocinio", peso: 1 },
    { id: "exam-eco-urgente", descricao: "Solicitou ecocardiograma urgentemente", categoria: "exames", peso: 2, obrigatorio: true },
    { id: "cond-cirurgia", descricao: "Referiu centro de cirurgia cardíaca pediátrica", categoria: "conduta_orientacao", peso: 2, obrigatorio: true },
  ],
};

export const CHECKLIST_PED_09: ChecklistPediatrico = {
  casoId: "ped-09",
  titulo: "Pericardite Aguda - Menino 12 Anos",
  descricaoBreve: "Reconhecimento de dor pericárdica",
  faixaEtaria: "escolar",
  diagnosticoEsperado: "Pericardite aguda",
  falaModeloResumida: "Em criança com dor tipo pontada que piora ao respirar e ao deitar, melhora inclinado para frente, após história viral, suspeito pericardite. Ausculto atrito, solicito ECG e ecocardiograma.",
  pesoPorCategoria: { ...PESO_PADRAO_PEDIATRICO },
  itens: [
    { id: "ana-dor-tipo", descricao: "Perguntou tipo de dor (pontada/pleurítica)", categoria: "anamnese", peso: 1, obrigatorio: true },
    { id: "ana-piora", descricao: "Perguntou piora ao respirar/deitar", categoria: "anamnese", peso: 1, obrigatorio: true },
    { id: "ana-melhora", descricao: "Perguntou melhora sentado/inclinado frente", categoria: "anamnese", peso: 1, obrigatorio: true },
    { id: "ana-historia-viral", descricao: "Perguntou história viral recente", categoria: "anamnese", peso: 1 },
    { id: "hist-vacinacao", descricao: "Verificou vacinação", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "hist-antecedentes", descricao: "Perguntou antecedentes relevantes", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "exam-dor", descricao: "Avaliou dor à palpação do precórdio", categoria: "exame_fisico", peso: 0.75 },
    { id: "exam-atrito", descricao: "Ausculta cardíaca - procurou atrito pericárdico", categoria: "exame_fisico", peso: 1.5, obrigatorio: true },
    { id: "exam-outros", descricao: "Ausculta cardíaca completa", categoria: "exame_fisico", peso: 0.75 },
    { id: "raz-pericardite", descricao: "Suspeitou pericardite aguda", categoria: "raciocinio", peso: 1.5, obrigatorio: true },
    { id: "exam-ecg", descricao: "Solicitou ECG", categoria: "exames", peso: 1, obrigatorio: true },
    { id: "exam-eco", descricao: "Solicitou ecocardiograma", categoria: "exames", peso: 1, obrigatorio: true },
    { id: "cond-tratamento", descricao: "Indicou AINE/repouso/acompanhamento", categoria: "conduta_orientacao", peso: 1.5, obrigatorio: true },
  ],
};

export const CHECKLIST_PED_10: ChecklistPediatrico = {
  casoId: "ped-10",
  titulo: "Tuberculose Pulmonar - Criança 7 Anos",
  descricaoBreve: "Reconhecimento de TB ativa em criança",
  faixaEtaria: "escolar",
  diagnosticoEsperado: "Tuberculose pulmonar",
  falaModeloResumida: "Em criança com tosse >4 semanas, febre vespertina, perda de peso e contato domiciliar TB, suspeito TB pulmonar. Solicito RX, PPD, GeneXpert e realizo notificação compulsória.",
  pesoPorCategoria: { ...PESO_PADRAO_PEDIATRICO },
  itens: [
    { id: "ana-tosse", descricao: "Perguntou tosse >4 semanas", categoria: "anamnese", peso: 1.25, obrigatorio: true },
    { id: "ana-febre", descricao: "Perguntou febre vespertina", categoria: "anamnese", peso: 0.75, obrigatorio: true },
    { id: "ana-peso", descricao: "Perguntou perda de peso", categoria: "anamnese", peso: 0.75, obrigatorio: true },
    { id: "ana-inapetencia", descricao: "Perguntou inapetência/cansaço", categoria: "anamnese", peso: 0.5 },
    { id: "ana-contato", descricao: "Investigou contato domiciliar TB", categoria: "anamnese", peso: 1.5, obrigatorio: true },
    { id: "hist-vacinacao", descricao: "Perguntou BCG/vacinação", categoria: "historia_pediatrica", peso: 0.5 },
    { id: "hist-condicoes", descricao: "Perguntou condições de moradia", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "hist-imunocompetencia", descricao: "Perguntou condições de imunidade", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "exam-ausculta", descricao: "Auscultou pulmões - procurou sinais apicais", categoria: "exame_fisico", peso: 1 },
    { id: "exam-ganglios", descricao: "Palpou linfonodos", categoria: "exame_fisico", peso: 0.75 },
    { id: "raz-tb", descricao: "Suspeitou TB pulmonar", categoria: "raciocinio", peso: 1.75, obrigatorio: true },
    { id: "exam-rx", descricao: "Solicitou RX tórax", categoria: "exames", peso: 1, obrigatorio: true },
    { id: "exam-ppd", descricao: "Solicitou PPD ou teste rápido", categoria: "exames", peso: 0.75, obrigatorio: true },
    { id: "exam-genexpert", descricao: "Solicitou GeneXpert/baciloscopia", categoria: "exames", peso: 0.75, obrigatorio: true },
    { id: "cond-notificacao", descricao: "Realizou notificação compulsória", categoria: "conduta_orientacao", peso: 1, obrigatorio: true },
    { id: "cond-investigacao", descricao: "Orientou investigação de contatos", categoria: "conduta_orientacao", peso: 1 },
  ],
};

export const CHECKLIST_PED_11: ChecklistPediatrico = {
  casoId: "ped-11",
  titulo: "Asma na Infância - Criança 7 Anos",
  descricaoBreve: "Reconhecimento e manejo de asma em criança",
  faixaEtaria: "escolar",
  diagnosticoEsperado: "Asma intermitente",
  falaModeloResumida: "Em criança com tosse noturna, chiado após correr e história alérgica, suspeito asma. Prescrevo broncodilatador de resgate, orienzo controle ambiental e considero profilaxia.",
  pesoPorCategoria: { ...PESO_PADRAO_PEDIATRICO },
  itens: [
    { id: "ana-tosse", descricao: "Perguntou tosse noturna", categoria: "anamnese", peso: 1, obrigatorio: true },
    { id: "ana-chiado", descricao: "Perguntou chiado/sibilância", categoria: "anamnese", peso: 1, obrigatorio: true },
    { id: "ana-exercicio", descricao: "Perguntou desencadeantes (exercício/infecção)", categoria: "anamnese", peso: 1, obrigatorio: true },
    { id: "ana-dispneia", descricao: "Perguntou falta de ar", categoria: "anamnese", peso: 0.75 },
    { id: "hist-alergia", descricao: "Perguntou história alérgica/rinite/dermatite", categoria: "historia_pediatrica", peso: 1, obrigatorio: true },
    { id: "hist-familia", descricao: "Investigou asma na família", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "hist-ambiente", descricao: "Perguntou fatores ambientais (poeira, mofo, animais)", categoria: "historia_pediatrica", peso: 1 },
    { id: "exam-ausculta", descricao: "Auscultou pulmões", categoria: "exame_fisico", peso: 1, obrigatorio: true },
    { id: "exam-sibilos", descricao: "Identificou sibilos/achados asmáticos", categoria: "exame_fisico", peso: 0.75 },
    { id: "raz-asma", descricao: "Suspeitou asma intermitente", categoria: "raciocinio", peso: 1.5, obrigatorio: true },
    { id: "exam-espirometria", descricao: "Considerou espirometria com teste broncodilatador", categoria: "exames", peso: 0.75 },
    { id: "cond-salbutamol", descricao: "Prescreveu broncodilatador de resgate", categoria: "conduta_orientacao", peso: 1, obrigatorio: true },
    { id: "cond-controle", descricao: "Orientou controle ambiental", categoria: "conduta_orientacao", peso: 1 },
  ],
};

export const CHECKLIST_PED_12: ChecklistPediatrico = {
  casoId: "ped-12",
  titulo: "Rinossinusite Bacteriana - Criança 9 Anos",
  descricaoBreve: "Reconhecimento de sinusite bacteriana",
  faixaEtaria: "escolar",
  diagnosticoEsperado: "Rinossinusite bacteriana",
  falaModeloResumida: "Em criança com sintomas nasal >10 dias, secreção amarelada e dupla piora, suspeito sinusite bacteriana. Prescrevo antibiótico e orienzo irrigação nasal.",
  pesoPorCategoria: { ...PESO_PADRAO_PEDIATRICO },
  itens: [
    { id: "ana-congestao", descricao: "Perguntou congestão nasal persistente", categoria: "anamnese", peso: 1, obrigatorio: true },
    { id: "ana-duracao", descricao: "Perguntou duração >10 dias", categoria: "anamnese", peso: 1.25, obrigatorio: true },
    { id: "ana-secrecao", descricao: "Perguntou secreção amarelada", categoria: "anamnese", peso: 1 },
    { id: "ana-tosse", descricao: "Perguntou tosse noturna", categoria: "anamnese", peso: 0.75 },
    { id: "ana-dupla", descricao: "Investigou dupla piora", categoria: "anamnese", peso: 1.5, obrigatorio: true },
    { id: "hist-alergias", descricao: "Perguntou alergias nasais", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "hist-recorrencia", descricao: "Perguntou sinusites recorrentes", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "exam-inspecao", descricao: "Inspecionou fossas nasais", categoria: "exame_fisico", peso: 0.75 },
    { id: "exam-seios", descricao: "Avaliou dor à palpação de seios", categoria: "exame_fisico", peso: 0.75 },
    { id: "raz-sinusite", descricao: "Suspeitou sinusite bacteriana", categoria: "raciocinio", peso: 1.5, obrigatorio: true },
    { id: "cond-antibiotico", descricao: "Prescreveu antibiótico apropriado", categoria: "conduta_orientacao", peso: 1.5, obrigatorio: true },
    { id: "cond-irrigacao", descricao: "Orientou irrigação nasal", categoria: "conduta_orientacao", peso: 1 },
  ],
};

export const CHECKLIST_PED_13: ChecklistPediatrico = {
  casoId: "ped-13",
  titulo: "Pneumonia Infantil - Criança 5 Anos",
  descricaoBreve: "Reconhecimento e avaliação de pneumonia",
  faixaEtaria: "pre_escolar",
  diagnosticoEsperado: "Pneumonia adquirida na comunidade",
  falaModeloResumida: "Em criança com febre, tosse, taquipneia e dificuldade respiratória, suspeito pneumonia. Avalio FR por 1 minuto, saturação, tiragens. Solicito RX e prescrevo antibiótico.",
  pesoPorCategoria: { ...PESO_PADRAO_PEDIATRICO },
  itens: [
    { id: "ana-febre", descricao: "Perguntou febre/duração", categoria: "anamnese", peso: 0.75, obrigatorio: true },
    { id: "ana-tosse", descricao: "Perguntou tosse/tipo (seca/produtiva)", categoria: "anamnese", peso: 0.75, obrigatorio: true },
    { id: "ana-respiracao", descricao: "Perguntou dificuldade respiratória/falta de ar", categoria: "anamnese", peso: 1, obrigatorio: true },
    { id: "ana-apetite", descricao: "Perguntou redução de apetite", categoria: "anamnese", peso: 0.5 },
    { id: "hist-vacinacao", descricao: "Perguntou vacinação/pneumococo", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "hist-antecedentes", descricao: "Perguntou antecedentes respiratórios", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "exam-fr", descricao: "Contou FR por 1 minuto - avaliou taquipneia", categoria: "exame_fisico", peso: 1, obrigatorio: true },
    { id: "exam-tiragens", descricao: "Avaliou tiragens/esforço respiratório", categoria: "exame_fisico", peso: 1 },
    { id: "exam-saturacao", descricao: "Verificou saturação de oxigênio", categoria: "exame_fisico", peso: 0.75, obrigatorio: true },
    { id: "exam-ausculta", descricao: "Auscultou pulmões bilateralmente", categoria: "exame_fisico", peso: 1, obrigatorio: true },
    { id: "exam-crepitacoes", descricao: "Identificou crepitações", categoria: "exame_fisico", peso: 0.75, obrigatorio: true },
    { id: "raz-pneumonia", descricao: "Suspeitou pneumonia adquirida comunidade", categoria: "raciocinio", peso: 1.5, obrigatorio: true },
    { id: "raz-gravidade", descricao: "Avaliou gravidade adequadamente", categoria: "raciocinio", peso: 1 },
    { id: "exam-rx", descricao: "Solicitou RX tórax", categoria: "exames", peso: 1, obrigatorio: true },
    { id: "cond-antibiotico", descricao: "Prescreveu antibiótico apropriado", categoria: "conduta_orientacao", peso: 1.5, obrigatorio: true },
    { id: "cond-sinais-alarme", descricao: "Orientou sinais de alarme para retorno", categoria: "conduta_orientacao", peso: 0.75 },
  ],
};

export const CHECKLIST_PED_14: ChecklistPediatrico = {
  casoId: "ped-14",
  titulo: "Linfonodomegalia Cervical - Criança 7 Anos",
  descricaoBreve: "Avaliação de linfonodomegalia",
  faixaEtaria: "escolar",
  diagnosticoEsperado: "Linfonodomegalia cervical reativa",
  falaModeloResumida: "Em criança com linfonodos cervicais pequenos, móveis, indolores e sem hepatoesplenomegalia, suspeito linfonodomegalia reativa. Tranquilizo e faço acompanhamento.",
  pesoPorCategoria: { ...PESO_PADRAO_PEDIATRICO },
  itens: [
    { id: "ana-tempo", descricao: "Perguntou tempo de evolução", categoria: "anamnese", peso: 0.75, obrigatorio: true },
    { id: "ana-infeccao", descricao: "Perguntou infecção recente", categoria: "anamnese", peso: 0.75 },
    { id: "ana-sintomas", descricao: "Perguntou sintomas associados", categoria: "anamnese", peso: 0.75 },
    { id: "hist-contatos", descricao: "Perguntou contatos/exposições", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "exam-palpacao", descricao: "Palpou linfonodos bilateralmente", categoria: "exame_fisico", peso: 1, obrigatorio: true },
    { id: "exam-tamanho", descricao: "Descreveu tamanho do linfonodo", categoria: "exame_fisico", peso: 0.75, obrigatorio: true },
    { id: "exam-consistencia", descricao: "Avaliou consistência (mole/dura)", categoria: "exame_fisico", peso: 0.75 },
    { id: "exam-mobilidade", descricao: "Avaliou mobilidade/aderência", categoria: "exame_fisico", peso: 0.75 },
    { id: "exam-dor", descricao: "Perguntou se há dor à palpação", categoria: "exame_fisico", peso: 0.5 },
    { id: "exam-supraclaviculares", descricao: "Examinou cadeias supraclaviculares", categoria: "exame_fisico", peso: 0.75 },
    { id: "exam-hepatoesplenomegalia", descricao: "Avaliou fígado/baço", categoria: "exame_fisico", peso: 0.75, obrigatorio: true },
    { id: "raz-reativa", descricao: "Reconheceu provavelmente reativa", categoria: "raciocinio", peso: 1.25, obrigatorio: true },
    { id: "cond-tranquilizacao", descricao: "Tranquilizou responsável", categoria: "conduta_orientacao", peso: 1.5, obrigatorio: true },
    { id: "cond-acompanhamento", descricao: "Orientou acompanhamento/retorno", categoria: "conduta_orientacao", peso: 1 },
  ],
};

export const CHECKLIST_PED_15: ChecklistPediatrico = {
  casoId: "ped-15",
  titulo: "Anemia com Sinais de Alerta - Criança 8 Anos",
  descricaoBreve: "Reconhecimento de anemia com sinais de alerta hematológicos",
  faixaEtaria: "escolar",
  diagnosticoEsperado: "Anemia com sinais de alerta hematológico",
  falaModeloResumida: "Em criança com palidez, cansaço e equimoses espontâneas, suspeito anemia com possível comprometimento hematológico. Solicito hemograma urgente e refiro hematologia.",
  pesoPorCategoria: { ...PESO_PADRAO_PEDIATRICO },
  itens: [
    { id: "ana-palidez", descricao: "Perguntou palidez/cansaço", categoria: "anamnese", peso: 1, obrigatorio: true },
    { id: "ana-fadiga", descricao: "Perguntou fadiga/tontura", categoria: "anamnese", peso: 0.75 },
    { id: "ana-equimoses", descricao: "Perguntou equimoses/manchas roxas espontâneas", categoria: "anamnese", peso: 1.5, obrigatorio: true },
    { id: "ana-febre", descricao: "Perguntou febre", categoria: "anamnese", peso: 0.75 },
    { id: "hist-alimentacao", descricao: "Perguntou ingestão de ferro/dieta", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "hist-hemorragia", descricao: "Perguntou sangramentos prévios", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "exam-palidez", descricao: "Inspecionou palidez (mucosas/palmas)", categoria: "exame_fisico", peso: 1, obrigatorio: true },
    { id: "exam-equimoses", descricao: "Avaliou equimoses/petéquias/sangramento", categoria: "exame_fisico", peso: 1.25, obrigatorio: true },
    { id: "exam-linfonodos", descricao: "Palpou linfonodos", categoria: "exame_fisico", peso: 0.75 },
    { id: "exam-hepatoesplenomegalia", descricao: "Avaliou fígado/baço", categoria: "exame_fisico", peso: 0.75 },
    { id: "raz-anemia", descricao: "Reconheceu anemia", categoria: "raciocinio", peso: 1.25, obrigatorio: true },
    { id: "raz-alerta", descricao: "Identificou sinais de alerta (equimoses espontâneas)", categoria: "raciocinio", peso: 1.5, obrigatorio: true },
    { id: "exam-hemograma", descricao: "Solicitou hemograma completo", categoria: "exames", peso: 1.5, obrigatorio: true },
    { id: "exam-reticulocitos", descricao: "Solicitou reticulócitos/metabolismo ferro", categoria: "exames", peso: 0.5 },
    { id: "cond-hematologia", descricao: "Referiu hematologia se sinais graves", categoria: "conduta_orientacao", peso: 1.5, obrigatorio: true },
  ],
};

export const CHECKLIST_PED_16: ChecklistPediatrico = {
  casoId: "ped-16",
  titulo: "Dengue com Teste do Laço - Criança 8 Anos",
  descricaoBreve: "Avaliação de dengue e execução do teste do laço",
  faixaEtaria: "escolar",
  diagnosticoEsperado: "Dengue",
  falaModeloResumida: "Em criança com febre, mialgia, cefaleia e exantema, suspeito dengue. Realizo teste do laço: manguito na pressão média por 3 minutos em criança, avalio plaquetas. Orienzo sinais de alarme.",
  pesoPorCategoria: { ...PESO_PADRAO_PEDIATRICO },
  itens: [
    { id: "ana-febre", descricao: "Perguntou febre/duração", categoria: "anamnese", peso: 1, obrigatorio: true },
    { id: "ana-mialgia", descricao: "Perguntou mialgia/dor no corpo", categoria: "anamnese", peso: 1, obrigatorio: true },
    { id: "ana-cefaleia", descricao: "Perguntou cefaleia/dor retro-orbitária", categoria: "anamnese", peso: 0.75 },
    { id: "ana-exantema", descricao: "Perguntou manchas/exantema", categoria: "anamnese", peso: 1, obrigatorio: true },
    { id: "ana-sinais-alarme", descricao: "Perguntou sinais de alarme (letargia, vômito persistente)", categoria: "anamnese", peso: 1 },
    { id: "hist-viagens", descricao: "Perguntou área endêmica/viagem", categoria: "historia_pediatrica", peso: 0.75 },
    { id: "exam-exantema", descricao: "Inspecionou exantema/distribuição", categoria: "exame_fisico", peso: 0.75, obrigatorio: true },
    { id: "exam-petequias", descricao: "Avaliou petéquias", categoria: "exame_fisico", peso: 0.75 },
    { id: "exam-hidratacao", descricao: "Avaliou hidratação", categoria: "exame_fisico", peso: 0.75, obrigatorio: true },
    { id: "proc-laco", descricao: "Realizou teste do laço corretamente", categoria: "procedimento", peso: 1.5, obrigatorio: true },
    { id: "proc-laco-tecnica", descricao: "Manguito na pressão média, 3 min em criança", categoria: "procedimento", peso: 1, obrigatorio: true },
    { id: "proc-laco-contagem", descricao: "Contou petéquias em 1 polegada²", categoria: "procedimento", peso: 0.5 },
    { id: "raz-dengue", descricao: "Suspeitou dengue", categoria: "raciocinio", peso: 1.5, obrigatorio: true },
    { id: "exam-hemograma", descricao: "Solicitou hemograma/plaquetas", categoria: "exames", peso: 1, obrigatorio: true },
    { id: "exam-ns1", descricao: "Solicitou NS1/sorologia", categoria: "exames", peso: 0.75 },
    { id: "cond-sinais-alarme", descricao: "Orientou sinais de alarme para retorno urgente", categoria: "conduta_orientacao", peso: 1.25, obrigatorio: true },
    { id: "cond-hidratacao", descricao: "Orientou hidratação adequada", categoria: "conduta_orientacao", peso: 0.75 },
  ],
};

// ============================================================================
// MAPA GLOBAL DE CHECKLISTS PEDIÁTRICOS
// ============================================================================

export const CHECKLISTS_PEDIATRICOS: Record<string, ChecklistPediatrico> = {
  "ped-01": CHECKLIST_PED_01,
  "ped-02": CHECKLIST_PED_02,
  "ped-03": CHECKLIST_PED_03,
  "ped-04": CHECKLIST_PED_04,
  "ped-05": CHECKLIST_PED_05,
  "ped-06": CHECKLIST_PED_06,
  "ped-07": CHECKLIST_PED_07,
  "ped-08": CHECKLIST_PED_08,
  "ped-09": CHECKLIST_PED_09,
  "ped-10": CHECKLIST_PED_10,
  "ped-11": CHECKLIST_PED_11,
  "ped-12": CHECKLIST_PED_12,
  "ped-13": CHECKLIST_PED_13,
  "ped-14": CHECKLIST_PED_14,
  "ped-15": CHECKLIST_PED_15,
  "ped-16": CHECKLIST_PED_16,
};
