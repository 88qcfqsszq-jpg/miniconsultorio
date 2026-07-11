// ============================================================================
// Casos OSCE Dinâmicos — Beta · VALIDADOR DE RUBRICA (contrato Fase 2)
// ----------------------------------------------------------------------------
// Coerência estrutural + vínculo com o caso: soma 20, 6 domínios obrigatórios,
// cada domínio com critério, referenciasCaso apontando a campos reais, sem
// pontos negativos, sem domínio zerado, caseId coerente. Puro; não lança.
// ============================================================================

import type { DynamicCase, DynamicRubric } from "../types";
import { DOMINIOS_OBRIGATORIOS } from "../types";
import { referenciaCasoValida } from "../dynamic-case-contract";

export interface ResultadoValidacaoRubrica {
  ok: boolean;
  erros: string[];
}

export function validarDynamicRubric(
  rubrica: DynamicRubric,
  caso?: DynamicCase
): ResultadoValidacaoRubrica {
  const erros: string[] = [];

  if (!rubrica || !Array.isArray(rubrica.dominios) || rubrica.dominios.length === 0) {
    return { ok: false, erros: ["Rubrica sem domínios."] };
  }

  // 6 domínios obrigatórios exatos
  const nomes = rubrica.dominios.map((d) => d.nome);
  for (const obrig of DOMINIOS_OBRIGATORIOS) {
    if (!nomes.includes(obrig)) erros.push(`Domínio obrigatório ausente: "${obrig}".`);
  }

  const idsVistos = new Set<string>();
  let somaDominios = 0;

  for (const dom of rubrica.dominios) {
    somaDominios += dom.pontos;

    if (dom.pontos <= 0) erros.push(`Domínio "${dom.nome}" com pontuação zero ou negativa (${dom.pontos}).`);
    if (!Array.isArray(dom.criterios) || dom.criterios.length === 0) {
      erros.push(`Domínio "${dom.nome}" sem critérios.`);
      continue;
    }

    const somaCriterios = dom.criterios.reduce((s, c) => s + c.pontos, 0);
    if (Math.abs(somaCriterios - dom.pontos) > 0.001) {
      erros.push(`Domínio "${dom.nome}": soma dos critérios (${somaCriterios}) ≠ pontos do domínio (${dom.pontos}).`);
    }

    for (const c of dom.criterios) {
      if (idsVistos.has(c.id)) erros.push(`Id de critério duplicado: ${c.id}.`);
      idsVistos.add(c.id);

      if (c.pontos < 0) erros.push(`Critério "${c.id}" com pontos negativos (${c.pontos}).`);
      if (!Array.isArray(c.referenciasCaso) || c.referenciasCaso.length === 0) {
        erros.push(`Critério "${c.id}" sem referenciasCaso.`);
      } else if (caso) {
        for (const ref of c.referenciasCaso) {
          if (!referenciaCasoValida(caso, ref)) {
            erros.push(`Critério "${c.id}": referenciaCaso inválida ou vazia → "${ref}".`);
          }
        }
      }
    }
  }

  if (rubrica.totalPontos !== 20) erros.push(`totalPontos deve ser 20 (recebido ${rubrica.totalPontos}).`);
  if (Math.abs(somaDominios - 20) > 0.001) erros.push(`Soma dos domínios (${somaDominios}) ≠ 20.`);

  if (caso && rubrica.caseId !== caso.identificacao.caseId) {
    erros.push(`rubrica.caseId (${rubrica.caseId}) ≠ caso.caseId (${caso.identificacao.caseId}).`);
  }

  return { ok: erros.length === 0, erros };
}
