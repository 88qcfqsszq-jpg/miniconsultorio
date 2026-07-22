/**
 * Rubric Adapter — converte a rubrica OSCE existente do caso em HealthBenchRubricItem[].
 *
 * FONTES (prioridade decrescente):
 * 1. PerfilRubricaCaso definitivo (data/rubricas-osce-adulto-pediatrico-ts/…)
 *    → itens caso-específicos por domínio (anamnese, exame, exames, diagnóstico, conduta, segurança)
 * 2. Caso.rubrica_correcao / checklist_osce / erros_criticos (rubrica genérica do caso)
 * 3. DIAGNOSIS_MICROCRITERIA (microcritérios específicos por diagnóstico)
 * 4. CARDS_CONFIG.criteriosMinimos (mínimos genéricos por card — apenas onde faltar cobertura)
 */

import type { Caso } from "@/lib/types";
import { AXIS_TAGS, type HealthBenchRubricItem } from "./types";
import { CARDS_CONFIG, resolverAxisDoCard, ehCriterioComposto } from "./cards-config";
import {
  DIAGNOSIS_MICROCRITERIA,
  identificarDiagnosticoRubrica,
  AXIS_PARA_CAMPO,
  type DiagnosticoRubricaKey,
} from "./diagnosis-microcriteria";
import { carregarPerfilRubrica, converterPerfilParaItens } from "./perfil-rubrica-loader";

/**
 * Eixo PRIMÁRIO do critério (um dos 6 cards, exceto segurança que é tag adicional).
 * Ordem do mais específico para o mais genérico.
 */
function inferirAxisPrimario(texto: string): string {
  const t = (texto || "").toLowerCase();

  if (/comunica|postura|empati|acolhi|rapport|explica.*paciente|confirma.*compreens/.test(t))
    return AXIS_TAGS.comunicacao;

  // Anamnese (perguntar/investigar/história/antecedentes/alergias/fatores de risco…)
  if (
    /anamnese|pergunt|investig|pesquis|question|histori|hda|interrogat|queixa|in[íi]cio|dura[çc][ãa]o|sintomas? associad|antecedent|medicament|alergi|fator(es)? de risco|familiar|exposi[çc]|h[áa]bito/.test(
      t
    )
  )
    return AXIS_TAGS.anamnese;

  // Exames complementares (solicitar exame/laboratório/imagem específicos)
  if (
    /exame.*complementar|solicit.*exame|pedir? exame|hemograma|reticul[óo]cito|bilirrubina|\bldh\b|haptoglobina|coombs|\becg\b|ecocardiograma|ecocardio|\bbnp\b|nt-?probnp|angiotc|d-?d[íi]mero|raio-?\s?x|\brx\b|tomografia|ultrassom|ultrassonografia|gasometria|eletr[óo]lito|fun[çc][ãa]o renal|troponina|\bpcr\b|cultura|urina|imagem|laborat|radiograf/.test(
      t
    )
  )
    return AXIS_TAGS.exames_complementares;

  // Exame físico (manobras, sinais vitais, achados ao exame)
  // Radicais cobrem flexões (palpa/palpou/palpação, ausculta/auscultou) + achados (ictus, B3, turgência).
  if (
    /exame f[íi]sico|inspe[çc]|palpa|palpou|palpac|percuss|auscult|ictus|fr[êe]mito|\bb3\b|\bb4\b|estertor|crepita|turg[êe]ncia jugular|sinais? vitais|frequ[êe]ncia respirat|satura[çc]|spo2|press[ãa]o arterial|frequ[êe]ncia card[íi]aca|temperatura|palidez|icter|edema|perfus|consci[êe]ncia|esfor[çc]o respirat|abdome|membros|dor [àa] palpa[çc]|manobra/.test(
      t
    )
  )
    return AXIS_TAGS.exame_fisico;

  // Conduta (tratamento/prescrição/manejo/encaminhamento/retorno)
  // Radical "prescr" cobre prescri/prescreveu/prescrição; inclui diurético e descongestiva.
  if (
    /condut|tratament|prescr|medica[çc][ãa]o|hidrata|oxig[êe]nio|diur[ée]tic|descongest|broncodilatad|cortic|antibi[óo]tic|analges|orienta[çc][ãa]o terap|\bplano\b|plano terap|acompanh|encaminh|interna|\balta\b|retorno|monitoriza|manejo/.test(
      t
    )
  )
    return AXIS_TAGS.conduta;

  // Raciocínio diagnóstico (hipótese/diferencial/interpretação/reconhecimento de síndrome)
  if (
    /hip[óo]tese|diagn[óo]stic|diferenci|interpreta|correlacion|justific|s[íi]ndrome|integr|racioc[íi]nio|gravidade|classific|reconhec/.test(
      t
    )
  )
    return AXIS_TAGS.raciocinio_clinico;

  return AXIS_TAGS.raciocinio_clinico; // default conservador
}

/** Detecta se o critério também envolve SEGURANÇA (tag adicional, coexiste). */
function temSeguranca(texto: string): boolean {
  const t = (texto || "").toLowerCase();
  return /sinais? de gravidade|sinais? de alarme|instabil|emerg|urg[êe]ncia|\brisco\b|erro cr[íi]tico|alta insegura|reavali|contraindica|alergia antes|grave|piora cl[íi]nica|encaminhamento necess|satura[çc][ãa]o baixa|hipotens|altera[çc][ãa]o de consci[êe]ncia|gravidade|red flag|dor tor[áa]cica grave|dispneia grave|sangramento important/.test(
    t
  );
}

/** Deriva tags de tema a partir do sistema/tema do caso. */
function inferirTheme(caso: Caso): string | null {
  const base = `${caso.sistema ?? ""} ${caso.tema ?? ""} ${caso.categoria ?? ""}`.toLowerCase();
  if (/respir|pulmon|asma|dpoc|pneumon|t[óo]rax|bronqui/.test(base)) return "theme:respiratorio";
  if (/card|cora|sca|iam|angina|insufici[êe]ncia card/.test(base)) return "theme:cardiovascular";
  if (/infec|sepse|tuberc|dengue|hiv/.test(base)) return "theme:infectologia";
  if (/pediatr|lactente|crian|neonat/.test(base)) return "theme:pediatria";
  if (/urg[êe]ncia|emerg|choque|parada/.test(base)) return "theme:urgencia";
  return null;
}

function slug(s: string, fallback: string): string {
  const base = (s || fallback)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || fallback;
}

/**
 * Converte a rubrica oficial do caso para o formato HealthBench.
 * Inclui critérios positivos (rubrica_correcao + checklist + perfil definitivo) e negativos (erros_criticos).
 */
export function adaptarRubricaDoCaso(caso: Caso): HealthBenchRubricItem[] {
  const itens: HealthBenchRubricItem[] = [];
  const theme = inferirTheme(caso);

  // Marcador de faixa etária (desambigua pneumonia adulto x pediátrica).
  const idade = Number((caso as any)?.dados_visiveis_ao_estudante?.idade);
  const marcadorFaixa =
    caso?.tipoPaciente === "pediatrico" || (Number.isFinite(idade) && idade < 14)
      ? "paciente pediatrico crianca"
      : "paciente adulto";

  // 0. PerfilRubricaCaso definitivo — itens caso-específicos por domínio.
  //    Quando disponível, são adicionados PRIMEIRO para que garantirCoberturaMinima
  //    os reconheça como cobertura real e adicione menos genéricos.
  const perfil = carregarPerfilRubrica(caso.id, caso.tipoPaciente);
  if (perfil) {
    const perfilItens = converterPerfilParaItens(perfil);
    // Propaga theme tag para itens do perfil quando aplicável
    if (theme) {
      perfilItens.forEach((it) => { it.tags = [...(it.tags ?? []), theme]; });
    }
    itens.push(...perfilItens);
  }

  // Identificar diagnóstico para rubrica específica (fallback genérico se não houver).
  const diagKey = identificarDiagnosticoRubrica(
    caso?.dados_ocultos_do_sistema?.diagnostico_principal,
    (caso as any)?.diagnosticoCorreto,
    caso?.titulo,
    marcadorFaixa
  );
  console.log("[OSCE DIAG RUBRIC] diagnóstico identificado:", diagKey ?? "(nenhum — fallback genérico)");

  // 1. Rubrica de correção (critérios positivos com pontuação real)
  const rubrica = Array.isArray(caso.rubrica_correcao) ? caso.rubrica_correcao : [];
  rubrica.forEach((r, i) => {
    const criterio = r?.criterio || r?.descricao || `Critério ${i + 1}`;
    const textoCompleto = `${r?.criterio ?? ""} ${r?.descricao ?? ""}`;
    const axis = inferirAxisPrimario(textoCompleto);
    const pontos = Number(r?.pontuacao_maxima ?? r?.peso ?? 0) || 0;
    const tags = [axis];
    if (temSeguranca(textoCompleto) && axis !== AXIS_TAGS.seguranca) tags.push(AXIS_TAGS.seguranca);
    if (theme) tags.push(theme);
    itens.push({
      id: `rubrica-${i}-${slug(criterio, String(i))}`,
      criterion: r?.descricao ? `${criterio} — ${r.descricao}` : criterio,
      points: pontos > 0 ? pontos : 1,
      tags,
      type: "positive",
      sourceRubricId: criterio,
    });
  });

  // 2. Checklist OSCE (itens binários; críticos marcados)
  const checklist = Array.isArray(caso.checklist_osce) ? caso.checklist_osce : [];
  checklist.forEach((c, i) => {
    const item = c?.item || `Item ${i + 1}`;
    const axis = inferirAxisPrimario(item);
    const tags = [axis];
    if (temSeguranca(item) && axis !== AXIS_TAGS.seguranca) {
      tags.push(AXIS_TAGS.seguranca);
    }
    if (c?.critico) tags.push("skill:sinais_de_gravidade");
    if (theme) tags.push(theme);
    itens.push({
      id: `checklist-${i}-${slug(item, String(i))}`,
      criterion: item,
      points: c?.critico ? 2 : 1,
      tags,
      critical: !!c?.critico,
      type: "positive",
      sourceRubricId: item,
    });
  });

  // 3. Erros críticos (critérios NEGATIVOS — pontuam true quando o erro ocorre)
  const erros = Array.isArray(caso.erros_criticos) ? caso.erros_criticos : [];
  erros.forEach((e, i) => {
    const erro = e?.erro || e?.descricao || `Erro crítico ${i + 1}`;
    const penalidade = Math.abs(Number(e?.penalidade ?? 0)) || 2;
    itens.push({
      id: `erro-${i}-${slug(erro, String(i))}`,
      criterion: e?.descricao ? `${erro} — ${e.descricao}` : erro,
      points: -penalidade,
      tags: [AXIS_TAGS.seguranca, "error:alta_insegura"],
      critical: true,
      type: "negative",
      sourceRubricId: erro,
    });
  });

  // 4. COBERTURA MÍNIMA por MICROCRITÉRIOS: apenas completa onde o perfil definitivo
  //    não cobriu (quando há perfil, a maioria dos cards já terá cobertura suficiente).
  garantirCoberturaMinima(itens, diagKey);

  const comSeguranca = itens.filter((it) =>
    it.tags?.includes(AXIS_TAGS.seguranca) || it.tags?.includes(AXIS_TAGS.conduta_seguranca)
  ).length;
  console.log("[HEALTHBENCH RUBRIC] axis refinado", {
    total: itens.length,
    comSeguranca,
  });

  return itens;
}

/** Normaliza texto de critério para deduplicação. */
function normCrit(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Garante que cada card tenha critérios POSITIVOS atômicos suficientes (minimoCobertura).
 * Conta os critérios reais já atribuídos ao card (mesma partição do builder) e completa
 * com microcritérios — priorizando os ESPECÍFICOS do diagnóstico, depois os genéricos.
 * Deduplica por texto normalizado. Não remove nem altera critérios existentes do caso.
 */
function garantirCoberturaMinima(
  itens: HealthBenchRubricItem[],
  diagKey: DiagnosticoRubricaKey | null
): void {
  const rubricaDiag = diagKey ? DIAGNOSIS_MICROCRITERIA[diagKey] : null;
  let totalEspecificos = 0;
  let totalDuplicadosRemovidos = 0;

  for (const card of CARDS_CONFIG) {
    const positivosDoCard = itens.filter(
      (it) =>
        it.type !== "negative" &&
        it.points > 0 &&
        resolverAxisDoCard(it.tags) === card.axis
    );

    // Detecta critérios compostos entre os reais (apenas alerta, não altera).
    for (const it of positivosDoCard) {
      if (ehCriterioComposto(it.criterion)) {
        console.log("[OSCE RUBRIC MICRO] critério composto detectado:", it.criterion);
      }
    }

    // Pool de candidatos: ESPECÍFICOS do diagnóstico primeiro, genéricos depois.
    const campo = AXIS_PARA_CAMPO[card.axis];
    const especificos = rubricaDiag && campo ? rubricaDiag.criteriosPorCard[campo] : [];

    // Dedup do pool (preferindo o que aparece primeiro = específico).
    const vistos = new Set<string>();
    const pool: { texto: string; especifico: boolean }[] = [];
    especificos.forEach((t) => {
      const n = normCrit(t);
      if (!vistos.has(n)) { vistos.add(n); pool.push({ texto: t, especifico: true }); }
    });
    card.criteriosMinimos.forEach((t) => {
      const n = normCrit(t);
      if (vistos.has(n)) { totalDuplicadosRemovidos++; return; }
      vistos.add(n); pool.push({ texto: t, especifico: false });
    });

    const faltam = card.minimoCobertura - positivosDoCard.length;
    if (faltam > 0) {
      const jaPresentes = new Set(positivosDoCard.map((it) => normCrit(it.criterion)));
      let adicionados = 0;
      let especificosAdic = 0;
      for (const cand of pool) {
        if (adicionados >= faltam) break;
        if (jaPresentes.has(normCrit(cand.texto))) { totalDuplicadosRemovidos++; continue; }
        itens.push({
          id: `${cand.especifico ? "esp" : "min"}-${card.axis.replace("axis:", "")}-${adicionados}`,
          criterion: cand.texto,
          points: 1,
          tags: [card.axis],
          type: "positive",
          sourceRubricId: `${cand.especifico ? "especifico" : "minimo"}:${card.nome}`,
        });
        jaPresentes.add(normCrit(cand.texto));
        adicionados++;
        if (cand.especifico) { especificosAdic++; totalEspecificos++; }
      }
      console.log("[OSCE RUBRIC MICRO] cobertura para card:", card.nome, {
        reais: positivosDoCard.length,
        adicionados,
        especificos: especificosAdic,
        totalCobertura: positivosDoCard.length + adicionados,
      });
    } else {
      console.log("[OSCE RUBRIC MICRO] total de critérios por card:", card.nome, positivosDoCard.length);
    }
  }

  if (rubricaDiag) {
    console.log("[OSCE DIAG RUBRIC] rubrica específica aplicada:", diagKey);
    console.log("[OSCE DIAG RUBRIC] critérios específicos adicionados:", totalEspecificos);
    console.log("[OSCE DIAG RUBRIC] critérios duplicados removidos:", totalDuplicadosRemovidos);
  } else {
    console.log("[OSCE DIAG RUBRIC] fallback genérico usado");
  }
}
