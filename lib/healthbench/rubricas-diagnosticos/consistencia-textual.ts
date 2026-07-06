// ============================================================================
// Consistência TEXTUAL dos cards de feedback
// ----------------------------------------------------------------------------
// Garante que evidências/textos não contradigam os acertos, que cards abaixo
// do máximo sempre listem o que faltou, e que evidências sejam curtas/coerentes.
// Não altera pontuação (apenas a camada explicativa).
// ============================================================================

import type { CompetenciaAvaliacao } from "@/lib/types";
import { normalizar } from "../feedback-consistency";
import type { ContextoAvaliacaoOSCE } from "./tipos";
import { detectarRXTorax, detectarSinaisVitaisCompletos } from "./utils-deteccao";

/**
 * Remove evidências negativas que contradizem um acerto do card (ou o contexto).
 * Cobre os 4 casos recorrentes: SpO₂/sinais vitais, RX, tosse/escarro e diferenciais.
 */
export function removerEvidenciasContraditorias(
  evidencias: string[],
  acertos: string[],
  ctx: ContextoAvaliacaoOSCE
): string[] {
  const ac = normalizar(acertos.join(" | "));
  const temSV = /sinais vitais|satura|spo2|oximetria/.test(ac) || detectarSinaisVitaisCompletos(ctx);
  const temRX = /radiografia|raio ?-?x|\brx\b|imagem/.test(ac) || detectarRXTorax(ctx);
  const temTosse = /tosse|escarro|expectora|catarro/.test(ac);
  const temDif = /diferencial|alternativ/.test(ac);

  return (evidencias ?? []).filter((ev) => {
    const e = normalizar(ev);
    const negativa = /\bnao\b|\bsem\b|ausencia|nao h[áa]|deixou de|faltou|essencial/.test(e);
    if (!negativa) return true;

    if (temSV && /satura|spo2|oximetria|sinais vitais/.test(e)) return false;
    if (temRX && /radiografia|raio ?-?x|\brx\b/.test(e)) return false;
    if (temTosse && /tosse|escarro|expectora|catarro/.test(e)) return false;
    if (temDif && /diferencial|diagnostic.* alternativ|alternativ/.test(e)) return false;
    return true;
  });
}

/**
 * Normaliza a camada explicativa de um card já calculado.
 * - remove evidências contraditórias;
 * - cards recalibrados pela rubrica usam os próprios acertos como evidências
 *   (curtas, positivas, coerentes com a pontuação);
 * - card abaixo do máximo nunca fica sem "o que faltou".
 */
export function normalizarExplicacaoCard(
  card: CompetenciaAvaliacao,
  ctx: ContextoAvaliacaoOSCE,
  recalibrado: boolean
): CompetenciaAvaliacao {
  // 1. Evidências
  let evidencias = removerEvidenciasContraditorias(
    card.evidencias ?? [],
    card.acertos ?? [],
    ctx
  );
  // Cards recalibrados: evidências = acertos (fonte coerente com a pontuação)
  if (recalibrado) {
    evidencias = (card.acertos ?? []).slice();
  }

  // 2. "O que faltou":
  //    - completo (pontos >= máximo) → marca explicitamente sem pendência;
  //    - incompleto sem melhoria específica → frase NÃO-genérica de revisão (3.1),
  //      nunca o texto proibido "Completar os critérios restantes...".
  let melhorias = card.melhorias ?? [];
  if (card.pontosObtidos >= card.pontosMaximos) {
    melhorias = ["Nenhuma pendência identificada."];
  } else if (melhorias.length === 0) {
    console.warn(
      "[FEEDBACK CONSISTENCY] card abaixo do máximo sem critério faltante:",
      card.nome
    );
    melhorias = [
      "Revisar os critérios objetivos ainda não cumpridos desta competência.",
    ];
  }

  return { ...card, evidencias, melhorias };
}

/**
 * CAMADA GLOBAL DE CONSISTÊNCIA — ponto único aplicado a TODOS os cards,
 * com ou sem rubrica específica. Combina:
 *  - normalização lógica (dedup, acerto×melhorar, clamp, piso) via `normalizarFn`;
 *  - normalização textual (evidências, "o que faltou") via `normalizarExplicacaoCard`.
 *
 * @param cards        cards já calculados (grader ou rubrica)
 * @param ctx          contexto do atendimento
 * @param recalibrados nomes (normalizados) dos cards recalibrados por rubrica específica
 * @param normalizarFn função de normalização lógica (injetada p/ evitar dependência circular)
 */
export function aplicarConsistenciaGlobalCards(
  cards: CompetenciaAvaliacao[],
  ctx: ContextoAvaliacaoOSCE,
  recalibrados: Set<string>,
  normalizarFn: (c: CompetenciaAvaliacao) => CompetenciaAvaliacao
): CompetenciaAvaliacao[] {
  return cards.map((card) => {
    const logico = normalizarFn(card);
    const foiRecalibrado = recalibrados.has(normalizar(card.nome));
    return normalizarExplicacaoCard(logico, ctx, foiRecalibrado);
  });
}
