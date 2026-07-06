// ============================================================================
// Registro de rubricas por diagnóstico + seleção e aplicação aos cards
// ============================================================================

import type { CompetenciaAvaliacao } from "@/lib/types";
import {
  normalizar,
  normalizarCard,
  aplicarConsistenciaSinaisVitais,
} from "../feedback-consistency";
import type {
  RubricaDiagnostico,
  ContextoAvaliacaoOSCE,
  ResultadoCardRubrica,
  CategoriaFeedback,
} from "./tipos";
import { CATEGORIA_POR_NOME_CARD } from "./tipos";
import { RUBRICA_PAC } from "./pac";
import { RUBRICA_SCA } from "./sca";
import {
  normalizarExplicacaoCard,
  aplicarConsistenciaGlobalCards,
} from "./consistencia-textual";

export {
  RUBRICA_PAC,
  RUBRICA_SCA,
  normalizarExplicacaoCard,
  aplicarConsistenciaGlobalCards,
  normalizarCard,
};
export type { RubricaDiagnostico, ContextoAvaliacaoOSCE, ResultadoCardRubrica };

const RUBRICAS: RubricaDiagnostico[] = [RUBRICA_PAC, RUBRICA_SCA];

/**
 * Seleciona a rubrica específica pelo diagnóstico esperado (nome) ou casoId.
 * Retorna null se não houver rubrica específica (mantém fluxo genérico).
 */
export function obterRubricaPorDiagnostico(
  diagnosticoEsperado?: string,
  casoId?: string | number
): RubricaDiagnostico | null {
  // 1) Mapeamento direto por casoId
  if (casoId !== undefined && casoId !== null) {
    const idNum = Number(casoId);
    const porCaso = RUBRICAS.find((r) =>
      (r.casoIds ?? []).some((c) => Number(c) === idNum)
    );
    if (porCaso) return porCaso;
  }
  // 2) Por nome do diagnóstico esperado
  const diag = normalizar(diagnosticoEsperado);
  if (!diag) return null;
  return (
    RUBRICAS.find((r) => r.nomesAceitos.some((n) => diag.includes(normalizar(n)))) ??
    null
  );
}

function categoriaDoNomeCard(nome: string): CategoriaFeedback | undefined {
  return CATEGORIA_POR_NOME_CARD[normalizar(nome)];
}

/**
 * Aplica os cards da rubrica específica sobre os cards base (do grader):
 * - card coberto pela rubrica → substitui pontos/acertos/melhorias;
 * - card NÃO coberto → mantém o card do grader, aplicando consistência genérica
 *   (ex.: sinais vitais no Exame físico). Tudo passa por normalizarCard.
 */
export function aplicarRubricaNosCards(
  cardsBase: CompetenciaAvaliacao[],
  rubrica: RubricaDiagnostico,
  ctx: ContextoAvaliacaoOSCE
): { cards: CompetenciaAvaliacao[]; recalibrados: Set<string> } {
  const resultados = rubrica.avaliar(ctx);
  const porCategoria = new Map<CategoriaFeedback, ResultadoCardRubrica>(
    resultados.map((r) => [r.card, r])
  );
  const recalibrados = new Set<string>();

  const cards = cardsBase.map((card) => {
    const cat = categoriaDoNomeCard(card.nome);
    const r = cat ? porCategoria.get(cat) : undefined;

    if (r) {
      recalibrados.add(normalizar(card.nome));
      // Apenas recalibra pontos/acertos/melhorias; a consistência (lógica +
      // textual) é aplicada de forma única por aplicarConsistenciaGlobalCards.
      return {
        ...card,
        pontosObtidos: Math.min(card.pontosMaximos, r.pontos),
        acertos: r.acertos,
        melhorias: r.melhorar,
      };
    }

    // Card não coberto pela rubrica: consistência genérica de sinais vitais
    if (normalizar(card.nome).includes("exame fisico")) {
      return aplicarConsistenciaSinaisVitais(card, ctx);
    }
    return card;
  });

  return { cards, recalibrados };
}
