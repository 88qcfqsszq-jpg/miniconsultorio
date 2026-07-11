// ============================================================================
// Casos OSCE Dinâmicos — Beta · MOTOR DE FEEDBACK (rubrica dinâmica piloto)
// ----------------------------------------------------------------------------
// Avalia a rubrica dinâmica a partir do log da simulação (intervenções, exames,
// auto-registro de comunicação/anamnese/exame) e do estado inicial x final.
// ISOLADO: não usa o feedback OSCE principal nem HealthBench.
// ============================================================================

import type {
  DynamicFeedbackResult,
  DynamicFeedbackDomain,
  DynamicRubric,
  InterventionId,
  RubricEvalContext,
} from "./types";

function inclui(lista: string[], termo: string): boolean {
  const t = termo.toLowerCase();
  return lista.some((x) => x.toLowerCase().includes(t));
}

function tem(intervencoes: InterventionId[], id: InterventionId): boolean {
  return intervencoes.includes(id);
}

/** Registro de predicados por id de critério. Cada um decide se foi cumprido. */
const PREDICADOS: Record<string, (ctx: RubricEvalContext) => boolean> = {
  // Comunicação
  "com-apresentacao": (c) => inclui(c.comunicacaoItens, "apresent") || inclui(c.comunicacaoItens, "tranquiliz"),
  "com-explicou": (c) => inclui(c.comunicacaoItens, "explic"),

  // Anamnese
  "anm-inicio": (c) => inclui(c.anamneseItens, "início") || inclui(c.anamneseItens, "inicio") || inclui(c.anamneseItens, "chiado"),
  "anm-broncodilatador": (c) => inclui(c.anamneseItens, "broncodilatador"),
  "anm-internacoes": (c) => inclui(c.anamneseItens, "interna") || inclui(c.anamneseItens, "intuba"),
  "anm-gatilhos": (c) => inclui(c.anamneseItens, "gatilho") || inclui(c.anamneseItens, "alergi") || inclui(c.anamneseItens, "febre"),

  // Exame físico
  "exf-vitais": (c) => inclui(c.exameItens, "sinais vitais") || inclui(c.exameItens, "satura"),
  "exf-ausculta": (c) => inclui(c.exameItens, "ausculta") || inclui(c.exameItens, "padrão respiratório") || inclui(c.exameItens, "padrao respiratorio"),
  "exf-esforco": (c) => inclui(c.exameItens, "musculatura") || inclui(c.exameItens, "fala") || inclui(c.exameItens, "esforço") || inclui(c.exameItens, "esforco"),

  // Exames e monitorização
  "exm-oximetria": (c) => inclui(c.examesSolicitados, "oximetria") || tem(c.intervencoesAplicadas, "oxigenio"),
  "exm-gasometria": (c) => inclui(c.examesSolicitados, "gasometria"),
  "exm-reavaliacao": (c) => tem(c.intervencoesAplicadas, "reavaliar"),

  // Raciocínio clínico
  "rac-reconhece": (c) =>
    tem(c.intervencoesAplicadas, "oxigenio") && tem(c.intervencoesAplicadas, "salbutamol"),
  "rac-gravidade": (c) =>
    (inclui(c.exameItens, "satura") || inclui(c.exameItens, "sinais vitais")) &&
    (inclui(c.exameItens, "fala") || inclui(c.exameItens, "musculatura")),
  "rac-sem-alta": (c) => !c.erroCriticoRegistrado,
  "rac-escalona": (c) =>
    tem(c.intervencoesAplicadas, "ipratropio") ||
    tem(c.intervencoesAplicadas, "sulfato-magnesio") ||
    tem(c.intervencoesAplicadas, "internacao") ||
    tem(c.intervencoesAplicadas, "intubacao-uti"),

  // Conduta e reavaliação
  "cond-oxigenio": (c) => tem(c.intervencoesAplicadas, "oxigenio"),
  "cond-saba": (c) => tem(c.intervencoesAplicadas, "salbutamol"),
  "cond-corticoide": (c) => tem(c.intervencoesAplicadas, "corticoide"),
  "cond-reavaliou": (c) =>
    tem(c.intervencoesAplicadas, "reavaliar") &&
    c.estadoFinal.vitals.spo2 > c.estadoInicial.vitals.spo2,

  // ---- Pneumotórax hipertensivo (pn-*) ------------------------------------
  "pn-com-apresentacao": (c) => inclui(c.comunicacaoItens, "apresent") || inclui(c.comunicacaoItens, "tranquiliz"),
  "pn-com-explicou": (c) => inclui(c.comunicacaoItens, "explic"),

  "pn-anm-dor-subita": (c) => inclui(c.anamneseItens, "dor") || inclui(c.anamneseItens, "súbita") || inclui(c.anamneseItens, "subita"),
  "pn-anm-dispneia": (c) => inclui(c.anamneseItens, "dispneia") || inclui(c.anamneseItens, "falta de ar"),
  "pn-anm-trauma": (c) => inclui(c.anamneseItens, "trauma") || inclui(c.anamneseItens, "procedimento"),
  "pn-anm-lateralidade": (c) => inclui(c.anamneseItens, "lateralidade") || inclui(c.anamneseItens, "piora"),

  "pn-exf-vitais": (c) => inclui(c.exameItens, "sinais vitais") || inclui(c.exameItens, "satura") || inclui(c.exameItens, "pressão") || inclui(c.exameItens, "pressao"),
  "pn-exf-ausculta-percussao": (c) => inclui(c.exameItens, "ausculta") || inclui(c.exameItens, "percuss"),
  "pn-exf-jugular-traqueia": (c) => inclui(c.exameItens, "jugular") || inclui(c.exameItens, "traqueia") || inclui(c.exameItens, "perfus"),

  "pn-exm-oximetria": (c) => inclui(c.examesSolicitados, "oximetria") || tem(c.intervencoesAplicadas, "oxigenio_alto_fluxo") || tem(c.intervencoesAplicadas, "monitorizacao"),
  "pn-exm-monitor": (c) => inclui(c.examesSolicitados, "monitor") || tem(c.intervencoesAplicadas, "monitorizacao") || tem(c.intervencoesAplicadas, "reavaliar"),
  "pn-exm-nao-atrasou": (c) => !c.erroCriticoRegistrado && tem(c.intervencoesAplicadas, "descompressao_toracica"),

  "pn-rac-reconhece": (c) => tem(c.intervencoesAplicadas, "descompressao_toracica"),
  "pn-rac-gravidade": (c) =>
    (inclui(c.exameItens, "satura") || inclui(c.exameItens, "pressão") || inclui(c.exameItens, "pressao")) &&
    (inclui(c.exameItens, "jugular") || inclui(c.exameItens, "traqueia") || inclui(c.exameItens, "perfus")),
  "pn-rac-diferenciais": (c) => inclui(c.exameItens, "cardiovascular"),
  "pn-rac-sem-alta": (c) => !tem(c.intervencoesAplicadas, "alta_precoce") && !tem(c.intervencoesAplicadas, "alta"),

  "pn-cond-oxigenio": (c) => tem(c.intervencoesAplicadas, "oxigenio_alto_fluxo"),
  "pn-cond-descompressao": (c) => tem(c.intervencoesAplicadas, "descompressao_toracica"),
  "pn-cond-drenagem": (c) => tem(c.intervencoesAplicadas, "drenagem_toracica"),
  "pn-cond-reavaliou": (c) =>
    tem(c.intervencoesAplicadas, "reavaliar") &&
    c.estadoFinal.vitals.spo2 > c.estadoInicial.vitals.spo2,
};

function classificar(nota: number, total: number): DynamicFeedbackResult["classificacao"] {
  const pct = total > 0 ? nota / total : 0;
  if (pct >= 0.85) return "Excelente";
  if (pct >= 0.7) return "Bom";
  if (pct >= 0.5) return "Regular";
  return "Insuficiente";
}

/** Gera o feedback simples a partir da rubrica dinâmica e do contexto. */
export function gerarFeedbackDinamico(
  rubrica: DynamicRubric,
  ctx: RubricEvalContext
): DynamicFeedbackResult {
  const dominios: DynamicFeedbackDomain[] = [];
  const acertos: string[] = [];
  const melhorias: string[] = [];
  let notaTotal = 0;

  for (const dom of rubrica.dominios) {
    let obtido = 0;
    const itens = dom.criterios.map((cri) => {
      const pred = PREDICADOS[cri.id];
      const cumprido = pred ? pred(ctx) : false;
      if (cumprido) {
        obtido += cri.pontos;
        acertos.push(cri.descricao);
      } else {
        melhorias.push(cri.descricao);
      }
      return { descricao: cri.descricao, pontos: cri.pontos, cumprido };
    });
    obtido = Math.round(obtido * 10) / 10;
    notaTotal += obtido;
    dominios.push({ nome: dom.nome, obtido, maximo: dom.pontos, itens });
  }

  notaTotal = Math.round(notaTotal * 10) / 10;

  const errosCriticos: string[] = [];
  if (ctx.erroCriticoRegistrado) {
    errosCriticos.push(
      "Alta insegura: paciente com hipoxemia e/ou esforço respiratório mantidos."
    );
  }

  return {
    nota: notaTotal,
    total: rubrica.totalPontos,
    classificacao: classificar(notaTotal, rubrica.totalPontos),
    dominios,
    acertos,
    melhorias,
    errosCriticos,
  };
}
