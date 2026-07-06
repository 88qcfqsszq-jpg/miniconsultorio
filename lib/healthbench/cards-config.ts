/**
 * Cards Config — FONTE ÚNICA de configuração dos 6 cards do Feedback do Atendimento.
 *
 * Usada por:
 * - feedback-view-builder.ts (montar/particionar os cards + nota = soma)
 * - rubric-adapter.ts (garantir microcritérios positivos mínimos por card)
 *
 * Total dos pesos = 20. NÃO há 7º card.
 * "Conduta e Segurança" é eixo próprio (axis:conduta_seguranca) e consome critérios
 * com axis:conduta, axis:seguranca e/ou axis:conduta_seguranca.
 *
 * MICROCRITÉRIOS: cada critério mínimo é ATÔMICO (uma única ação avaliável), permitindo
 * pontuação parcial real (ex.: cumpriu 3 de 5 → 60% do peso do card).
 */

export interface CardConfig {
  /** Nome exibido na UI (deve casar com o componente FeedbackOSCE). */
  nome: string;
  /** Eixo identificador do card. */
  axis: string;
  /** Peso visual na nota de 20 pontos. */
  pesoVisual: number;
  /** Tags de grade que pertencem a este card. */
  matchTags: string[];
  /** Microcritérios positivos mínimos (atômicos). Usados para garantir cobertura. */
  criteriosMinimos: string[];
  /** Nº mínimo de critérios positivos que o card deve ter antes da avaliação. */
  minimoCobertura: number;
}

export const CARDS_CONFIG: CardConfig[] = [
  {
    nome: "Comunicação e postura médica",
    axis: "axis:comunicacao",
    pesoVisual: 2,
    matchTags: ["axis:comunicacao"],
    minimoCobertura: 4,
    criteriosMinimos: [
      "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
      "Confirmou a identidade do paciente ou o contexto do atendimento.",
      "Explicou o que faria durante o atendimento em linguagem clara.",
      "Usou linguagem compreensível e adequada ao paciente.",
      "Demonstrou acolhimento, escuta ativa ou empatia diante das preocupações do paciente.",
      "Confirmou compreensão ou abriu espaço para dúvidas ao final.",
    ],
  },
  {
    nome: "Anamnese dirigida",
    axis: "axis:anamnese",
    pesoVisual: 4,
    matchTags: ["axis:anamnese"],
    minimoCobertura: 4,
    criteriosMinimos: [
      "Investigou a queixa principal e caracterizou início, duração ou evolução.",
      "Pesquisou sintomas associados relevantes ao diagnóstico esperado.",
      "Investigou antecedentes pessoais, doenças prévias ou história familiar relevante.",
      "Investigou medicamentos em uso, alergias, exposições ou fatores de risco aplicáveis.",
      "Pesquisou sinais de gravidade relacionados ao caso.",
      "Investigou impacto funcional ou intensidade dos sintomas quando aplicável.",
    ],
  },
  {
    nome: "Exame físico",
    axis: "axis:exame_fisico",
    pesoVisual: 3,
    matchTags: ["axis:exame_fisico"],
    minimoCobertura: 4,
    criteriosMinimos: [
      "Avaliou sinais vitais ou estabilidade clínica.",
      "Realizou exame físico direcionado ao sistema envolvido.",
      "Pesquisou sinais físicos relevantes ao diagnóstico esperado.",
      "Procurou sinais de gravidade no exame físico.",
      "Avaliou perfusão, estado geral ou nível de consciência quando aplicável.",
    ],
  },
  {
    nome: "Exames complementares",
    axis: "axis:exames_complementares",
    pesoVisual: 2,
    matchTags: ["axis:exames_complementares"],
    minimoCobertura: 3,
    criteriosMinimos: [
      "Solicitou exame inicial essencial para confirmar ou caracterizar o quadro.",
      "Solicitou exame específico relacionado ao diagnóstico esperado.",
      "Solicitou exames para avaliar gravidade, complicações ou diagnósticos diferenciais.",
      "Considerou investigação etiológica quando aplicável.",
    ],
  },
  {
    nome: "Raciocínio diagnóstico",
    axis: "axis:raciocinio_clinico",
    pesoVisual: 5,
    matchTags: ["axis:raciocinio_clinico"],
    minimoCobertura: 4,
    criteriosMinimos: [
      "Formulou hipótese diagnóstica principal coerente com os achados.",
      "Relacionou sintomas, exame físico e exames complementares à hipótese principal.",
      "Considerou diagnósticos diferenciais relevantes.",
      "Identificou gravidade, síndrome clínica ou necessidade de investigação adicional.",
      "Evitou hipótese incompatível com os dados principais do caso.",
      "Reavaliou a hipótese após novas informações quando aplicável.",
    ],
  },
  {
    nome: "Conduta e Segurança",
    axis: "axis:conduta_seguranca",
    pesoVisual: 4,
    matchTags: ["axis:conduta_seguranca", "axis:conduta", "axis:seguranca"],
    minimoCobertura: 5,
    criteriosMinimos: [
      "Propôs conduta inicial compatível com diagnóstico e gravidade.",
      "Avaliou gravidade ou estabilidade clínica antes de encerrar.",
      "Definiu necessidade de acompanhamento, reavaliação ou encaminhamento.",
      "Orientou sinais de alarme e retorno.",
      "Evitou alta insegura ou conduta incompatível com a gravidade.",
      "Checou alergias, contraindicações ou riscos relevantes antes de prescrever, quando aplicável.",
      "Indicou urgência, internação ou encaminhamento quando havia critério clínico.",
    ],
  },
];

/** Ordem de prioridade para atribuir cada critério a UM único card (sem duplicidade). */
export const CARD_PRIORIDADE: string[] = [
  "axis:conduta_seguranca",
  "axis:exames_complementares",
  "axis:exame_fisico",
  "axis:anamnese",
  "axis:comunicacao",
  "axis:raciocinio_clinico",
];

/** Resolve o card (axis) ao qual um conjunto de tags pertence, por prioridade. */
export function resolverAxisDoCard(tags: string[] | undefined): string {
  const t = tags ?? [];
  for (const axisCard of CARD_PRIORIDADE) {
    const card = CARDS_CONFIG.find((c) => c.axis === axisCard);
    if (card && card.matchTags.some((mt) => t.includes(mt))) {
      return card.axis;
    }
  }
  return "axis:raciocinio_clinico"; // default conservador
}

/**
 * Detecta critério COMPOSTO (várias ações obrigatórias na mesma frase):
 * múltiplos "e" ligando ações ou listas longas separadas por vírgula.
 * "ou" é permitido (ações equivalentes).
 */
export function ehCriterioComposto(texto: string): boolean {
  const t = (texto || "").toLowerCase();
  // 3+ vírgulas seguidas de ações sem "ou" sugerem lista de ações obrigatórias
  const virgulas = (t.match(/,/g) || []).length;
  // " e " ligando ações (2+ ocorrências) sem "ou" no meio
  const conjuncoesE = (t.match(/\be\b/g) || []).length;
  const temOu = /\bou\b/.test(t);
  if (virgulas >= 3 && !temOu) return true;
  if (conjuncoesE >= 2 && !temOu) return true;
  return false;
}
