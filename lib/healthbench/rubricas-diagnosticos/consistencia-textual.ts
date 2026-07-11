// ============================================================================
// Consistência TEXTUAL dos cards de feedback
// ----------------------------------------------------------------------------
// Garante que evidências/textos não contradigam os acertos, que cards abaixo
// do máximo sempre listem o que faltou, e que evidências sejam curtas/coerentes.
// Não altera pontuação (apenas a camada explicativa).
// ============================================================================

import type { CompetenciaAvaliacao } from "@/lib/types";
import {
  normalizar,
  aplicarConsistenciaReavaliacao,
  aplicarConsistenciaCondutas,
  RX_PENDENCIA_GENERICA,
} from "../feedback-consistency";
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
 * - cards recalibrados pela rubrica usam os próprios acertos como evidências;
 * - filtra pendências genéricas não-acionáveis;
 * - recalcula pontosObtidos quando melhorias vazia e há acertos reconhecidos;
 * - nunca adiciona fallback genérico ("Revisar critérios...").
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
  if (recalibrado) {
    evidencias = (card.acertos ?? []).slice();
  }

  // 2. Filtrar pendências genéricas/não-específicas (podem vir de qualquer fonte)
  let melhorias = (card.melhorias ?? []).filter(
    (m) => !RX_PENDENCIA_GENERICA.test(normalizar(m))
  );

  // 3. Recalcular pontuação quando melhorias fica vazia mas card tem acertos reconhecidos.
  //    Regra: sem pendência específica identificada → aluno demonstrou todos os critérios
  //    avaliados → pontuação sobe para o máximo do card.
  //    Não é aumento artificial: é coerência entre o texto (sem gaps) e a nota.
  let pontosObtidos = card.pontosObtidos;
  const acertosCount = (card.acertos ?? []).length;
  if (melhorias.length === 0 && acertosCount > 0 && pontosObtidos < card.pontosMaximos) {
    pontosObtidos = card.pontosMaximos;
  }

  // 4. Determinar melhorias finais
  if (pontosObtidos >= card.pontosMaximos) {
    melhorias = ["Nenhuma pendência identificada."];
  }
  // Se ainda há melhorias específicas: exibi-las sem fallback (o texto IS the feedback)

  return {
    ...card,
    pontosObtidos: Math.round(pontosObtidos * 10) / 10,
    evidencias,
    melhorias,
  };
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
    let c = normalizarFn(card);
    // Camada global: reavaliação em todos os cards (possui guardas internas por eixo
    // — reconhece corretamente melhora de SpO₂/FR e destino clínico no card certo).
    c = aplicarConsistenciaReavaliacao(c, ctx);
    // Conduta: só pode atuar no card "Conduta e Segurança". Sem esta guarda, o acerto
    // "Indicou hospitalização, observação ou encaminhamento…" vazava para Anamnese e
    // outros cards. A função não tem guarda interna de card, então filtramos aqui.
    if (/conduta/.test(normalizar(card.nome))) {
      c = aplicarConsistenciaCondutas(c, ctx);
    }
    const foiRecalibrado = recalibrados.has(normalizar(card.nome));
    return normalizarExplicacaoCard(c, ctx, foiRecalibrado);
  });
}
