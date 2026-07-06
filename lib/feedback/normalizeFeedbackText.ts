// ============================================================================
// Padronização da linguagem do Feedback OSCE (Fase 26)
// ----------------------------------------------------------------------------
// ACERTOS  → passado (o que o aluno REALMENTE fez): "Investigou febre."
// MELHORAR → infinitivo (o que deve fazer na próxima vez): "Solicitar NS1..."
// APENAS normalização textual: NÃO altera nota, pesos, scoring, rubrica ou lógica.
// ============================================================================

export type TipoFeedback = "acerto" | "melhorar";

// Verbos irregulares comuns (3ª pessoa do pretérito ↔ infinitivo).
const IRREG_INF_PARA_PASSADO: Record<string, string> = { fazer: "fez", ver: "viu", ir: "foi", dar: "deu", pedir: "pediu", medir: "mediu", ouvir: "ouviu", conduzir: "conduziu", produzir: "produziu", prevenir: "preveniu" };
const IRREG_PASSADO_PARA_INF: Record<string, string> = { fez: "fazer", viu: "ver", foi: "ir", deu: "dar", pediu: "pedir", mediu: "medir", ouviu: "ouvir", conduziu: "conduzir", produziu: "produzir", preveniu: "prevenir" };

function preservarCaixa(original: string, novo: string): string {
  if (original[0] === original[0]?.toUpperCase()) return novo.charAt(0).toUpperCase() + novo.slice(1);
  return novo;
}

/** Converte a 1ª palavra (verbo) para PASSADO 3ª pessoa, se for um infinitivo. */
function paraPassado(palavra: string): string | null {
  const wl = palavra.toLowerCase();
  if (IRREG_INF_PARA_PASSADO[wl]) return preservarCaixa(palavra, IRREG_INF_PARA_PASSADO[wl]);
  if (wl.endsWith("ar")) return preservarCaixa(palavra, wl.slice(0, -2) + "ou");
  if (wl.endsWith("er")) return preservarCaixa(palavra, wl.slice(0, -2) + "eu");
  if (wl.endsWith("ir")) return preservarCaixa(palavra, wl.slice(0, -2) + "iu");
  return null; // não é infinitivo → não mexe
}

/** Converte a 1ª palavra (verbo) para INFINITIVO, se for um passado 3ª pessoa. */
function paraInfinitivo(palavra: string): string | null {
  const wl = palavra.toLowerCase();
  if (IRREG_PASSADO_PARA_INF[wl]) return preservarCaixa(palavra, IRREG_PASSADO_PARA_INF[wl]);
  if (wl.endsWith("ou")) return preservarCaixa(palavra, wl.slice(0, -2) + "ar");
  if (wl.endsWith("iu")) return preservarCaixa(palavra, wl.slice(0, -2) + "ir");
  if (wl.endsWith("eu")) return preservarCaixa(palavra, wl.slice(0, -2) + "er");
  return null; // não é passado → não mexe
}

// Reescritas específicas de rótulos de rubrica (para "melhorar") — quando o item
// não começa com um verbo simples e ficaria ambíguo.
const REESCRITAS_MELHORAR: Array<[RegExp, string]> = [
  [/teste do la[çc]o.*(execu|corret)|(execu|corret).*teste do la[çc]o/i, "Executar corretamente o teste do laço."],
  [/conduta.*(hidrata|aine|alarme)|hidrata.*sem aine/i, "Orientar hidratação adequada, evitar AINE/AAS e explicar sinais de alarme com retorno imediato."],
];

function garantirPonto(s: string): string {
  const t = s.trim();
  if (!t) return t;
  return /[.!?…]$/.test(t) ? t : t + ".";
}

/**
 * Normaliza um item de feedback conforme o tipo.
 * `acerto` → passado; `melhorar` → infinitivo. Só a 1ª palavra (verbo) é ajustada.
 */
export function normalizeFeedbackText(item: string, tipo: TipoFeedback): string {
  const bruto = String(item ?? "").trim();
  if (!bruto) return bruto;

  if (tipo === "melhorar") {
    for (const [re, texto] of REESCRITAS_MELHORAR) if (re.test(bruto)) return texto;
  }

  const m = bruto.match(/^(\S+)([\s\S]*)$/);
  if (!m) return garantirPonto(bruto);
  const [, primeira, resto] = m;

  let convertida: string | null = null;
  if (tipo === "acerto") convertida = paraPassado(primeira);
  else convertida = paraInfinitivo(primeira);

  const texto = convertida ? convertida + resto : bruto;
  return garantirPonto(texto);
}

/** Normaliza uma lista inteira. */
export function normalizeFeedbackList(itens: string[] | undefined, tipo: TipoFeedback): string[] {
  return (itens ?? []).map((i) => normalizeFeedbackText(i, tipo));
}
