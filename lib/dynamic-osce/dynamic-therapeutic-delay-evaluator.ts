// ============================================================================
// Casos OSCE Dinâmicos — Beta · AVALIADOR DE ATRASO TERAPÊUTICO (Fase 3.4)
// ----------------------------------------------------------------------------
// Função PURA que classifica se houve atraso terapêutico relevante antes da
// intervenção salvadora (ex.: descompressão torácica no pneumotórax hipertensivo).
// Não chama IA, não acessa rede, não tem efeitos colaterais.
// ============================================================================

import type { AvaliacaoAtrasoTerapeutico, ItemSequencia } from "./types";

export interface AvaliarAtrasoInput {
  sequencia: ItemSequencia[];
  /** ID da intervenção que, quando realizada, encerra o período de risco de atraso. */
  intervencaoSalvadora: string;
  /** Nomes exatos dos exames que NÃO contam como atraso (oximetria, monitor, PA). */
  examesEssenciais: string[];
  /**
   * Substrings (case-insensitive) de nomes de exames que, se pedidos antes da
   * salvadora, indicam atraso relevante independente do count (ex: "radiografia").
   */
  examesCriticosAntesDoSalvador: string[];
  /** IDs de intervenção que, aplicadas antes da salvadora, geram erro crítico. */
  intervencoesDeAtraso: string[];
  /** Máximo de exames não essenciais toleráveis antes da salvadora para "alerta-leve". */
  limiteToleravel: number;
}

export function avaliarAtrasoTerapiaSalvadora(
  input: AvaliarAtrasoInput
): AvaliacaoAtrasoTerapeutico {
  const {
    sequencia,
    intervencaoSalvadora,
    examesEssenciais,
    examesCriticosAntesDoSalvador,
    intervencoesDeAtraso,
    limiteToleravel,
  } = input;

  const alertas: string[] = [];

  // 1. Localizar a intervenção salvadora na sequência.
  const idxSalvadora = sequencia.findIndex(
    (item) => item.tipo === "intervencao" && item.id === intervencaoSalvadora
  );

  if (idxSalvadora < 0) {
    return {
      classificacao: "erro-critico",
      motivo: `Intervenção salvadora (${intervencaoSalvadora}) não foi realizada.`,
      devePontuarNaoAtrasou: false,
      deveGerarErroCritico: true,
      alertas: [`${intervencaoSalvadora} não foi realizada — ausência de conduta salvadora.`],
    };
  }

  // 2. Isolar tudo que veio ANTES da salvadora.
  const antes = sequencia.slice(0, idxSalvadora);

  // 3. Verificar se alguma intervenção de atraso foi aplicada antes da salvadora.
  const intervAtraso = antes.find(
    (item) =>
      item.tipo === "intervencao" && intervencoesDeAtraso.includes(item.id as string)
  );
  if (intervAtraso && intervAtraso.tipo === "intervencao") {
    return {
      classificacao: "erro-critico",
      motivo: `Intervenção de atraso ("${intervAtraso.id}") aplicada antes da intervenção salvadora.`,
      devePontuarNaoAtrasou: false,
      deveGerarErroCritico: true,
      alertas: [
        `"${intervAtraso.id}" aplicada antes de "${intervencaoSalvadora}": atraso terapêutico crítico.`,
      ],
    };
  }

  // 4. Exames não essenciais solicitados antes da salvadora.
  const naoEssenciaisAntes = antes.filter(
    (item): item is { tipo: "exame"; nome: string } =>
      item.tipo === "exame" &&
      !examesEssenciais.some((e) =>
        item.nome.toLowerCase().includes(e.toLowerCase())
      )
  );

  // 5. Exames com substrato crítico (ex.: radiografia antes da descompressão em instável).
  const criticosEncontrados = naoEssenciaisAntes.filter((item) =>
    examesCriticosAntesDoSalvador.some((padrao) =>
      item.nome.toLowerCase().includes(padrao.toLowerCase())
    )
  );

  if (criticosEncontrados.length > 0) {
    const nomes = criticosEncontrados.map((i) => i.nome).join(", ");
    alertas.push(
      `Exame(s) que indicam priorização diagnóstica inadequada antes da descompressão: ${nomes}.`
    );
    return {
      classificacao: "atraso-relevante",
      motivo: `Exame(s) crítico(s) pedido(s) antes da intervenção salvadora: ${nomes}.`,
      devePontuarNaoAtrasou: false,
      deveGerarErroCritico: false,
      alertas,
    };
  }

  // 6. Avaliar count de não essenciais restantes.
  const qtd = naoEssenciaisAntes.length;

  if (qtd === 0) {
    return {
      classificacao: "sem-atraso",
      motivo:
        "Somente monitorização/suporte antes da intervenção salvadora — conduta adequada.",
      devePontuarNaoAtrasou: true,
      deveGerarErroCritico: false,
      alertas: [],
    };
  }

  const nomesNaoEss = naoEssenciaisAntes.map((i) => i.nome).join(", ");

  if (qtd <= limiteToleravel) {
    alertas.push(
      `Exame(s) solicitado(s) antes da descompressão — aceitável apenas se não atrasar a intervenção salvadora: ${nomesNaoEss}.`
    );
    return {
      classificacao: "alerta-leve",
      motivo: `${qtd} exame(s) não essencial(is) antes da salvadora (limite tolerável: ${limiteToleravel}).`,
      devePontuarNaoAtrasou: true,
      deveGerarErroCritico: false,
      alertas,
    };
  }

  // qtd > limiteToleravel → atraso relevante.
  alertas.push(
    `${qtd} exames não essenciais antes da descompressão — priorização diagnóstica excessiva antes da terapia salvadora. Exames: ${nomesNaoEss}.`
  );
  return {
    classificacao: "atraso-relevante",
    motivo: `${qtd} exames não essenciais antes da salvadora (limite tolerável: ${limiteToleravel}).`,
    devePontuarNaoAtrasou: false,
    deveGerarErroCritico: false,
    alertas,
  };
}
