/**
 * Endpoint RESILIENTE: GET /api/openi/raw
 *
 * Open-i Resiliente V1 — query primária + fallback queries em cascata,
 * cache de sucesso (por query e por diagnóstico), distinção de tipos de falha
 * e falha amigável quando o upstream está indisponível.
 *
 * Fluxo: query/diagnóstico → plano de busca (primária + fallbacks) → cascata
 *        no Open-i → primeira imagem válida → cache → resposta.
 *
 * Parâmetros:
 * - query: termo de busca em inglês (prioridade; ainda assim resolve fallbacks por alias)
 * - diagnosis / diagnostico: diagnóstico PT-BR
 * - debug: "true" inclui attemptedQueries, upstreamStatus e amostras
 *
 * NÃO troca a fonte (sem NIH/VinDr/TCIA/OHIF). Sem alterar HealthBench, feedback,
 * rubricas, ECG, exame físico, /api/corrigir ou layout principal.
 */

import { NextRequest, NextResponse } from "next/server"
import { verificarOpenIHealth } from "../health/route"

const OPENI_SOURCE = "Open-i / Indiana University Chest X-ray Collection"
const WARNING =
  "Imagem retornada automaticamente pelo Open-i a partir do termo pesquisado. Não validada por curadoria radiológica."

// ============================================================================
// MAPA DE QUERIES COM FALLBACK (TAREFA 1)
// ============================================================================

type OpenIQueryConfig = {
  id: string
  primaryQuery: string
  fallbackQueries: string[]
  aliases: string[]
}

const OPENI_QUERY_CONFIGS: OpenIQueryConfig[] = [
  {
    id: "atelectasia_pos_operatoria",
    primaryQuery: "postoperative atelectasis chest xray",
    fallbackQueries: [
      "atelectasis chest xray",
      "lobar atelectasis chest radiograph",
      "segmental atelectasis chest xray",
      "post operative atelectasis radiograph",
    ],
    aliases: [
      "atelectasia pos-operatoria",
      "atelectasia pos operatoria",
      "atelectasia",
      "postoperative atelectasis",
      "post operative atelectasis",
      "atelectasis",
      "lobar atelectasis",
      "segmental atelectasis",
    ],
  },
  {
    id: "pneumonia",
    primaryQuery: "pneumonia chest xray consolidation",
    fallbackQueries: [
      "lobar pneumonia chest xray",
      "pneumonia chest radiograph",
      "airspace consolidation chest xray",
      "community acquired pneumonia chest xray",
    ],
    aliases: [
      "pneumonia adquirida na comunidade",
      "pneumonia atipica",
      "pneumonia adulto",
      "pneumonia pediatrica",
      "pneumonia",
      "pac",
    ],
  },
  {
    id: "pneumotorax",
    primaryQuery: "pneumothorax chest xray pleural line",
    fallbackQueries: [
      "spontaneous pneumothorax chest xray",
      "pneumothorax radiograph",
      "large pneumothorax chest xray",
      "apical pneumothorax chest xray",
    ],
    aliases: [
      "pneumotorax espontaneo",
      "pneumotorax",
      "spontaneous pneumothorax",
      "pneumothorax",
    ],
  },
  {
    id: "derrame_pleural",
    primaryQuery: "pleural effusion chest xray",
    fallbackQueries: [
      "pleural effusion meniscus sign chest xray",
      "large pleural effusion radiograph",
      "unilateral pleural effusion chest xray",
      "costophrenic angle blunting chest xray",
    ],
    aliases: [
      "derrame pleural",
      "efusao pleural",
      "liquido pleural",
      "pleural effusion",
    ],
  },
  {
    id: "edema_pulmonar",
    primaryQuery: "pulmonary edema chest xray",
    fallbackQueries: [
      "cardiogenic pulmonary edema chest xray",
      "interstitial pulmonary edema chest radiograph",
      "alveolar pulmonary edema chest xray",
      "congestive heart failure chest xray pulmonary edema",
    ],
    aliases: [
      "edema pulmonar",
      "congestao pulmonar",
      "insuficiencia cardiaca com edema pulmonar",
      "insuficiencia cardiaca",
      "icc",
      "pulmonary edema",
    ],
  },
  {
    id: "tuberculose",
    primaryQuery: "pulmonary tuberculosis chest xray",
    fallbackQueries: [
      "tuberculosis chest xray apical cavitation",
      "active pulmonary tuberculosis radiograph",
      "tb chest radiograph",
      "upper lobe tuberculosis chest xray",
    ],
    aliases: [
      "tuberculose pulmonar",
      "tuberculose",
      "tb pulmonar",
      "tb",
      "pulmonary tuberculosis",
    ],
  },
  // Diagnósticos sem fallback dedicado (mantêm comportamento simples)
  {
    id: "asma",
    primaryQuery: "asthma chest xray",
    fallbackQueries: ["bronchial asthma chest radiograph"],
    aliases: ["crise asmatica", "asma", "asthma"],
  },
  {
    id: "dpoc",
    primaryQuery: "emphysema chest xray",
    fallbackQueries: ["copd chest radiograph", "hyperinflation chest xray"],
    aliases: ["dpoc", "doenca pulmonar obstrutiva", "enfisema", "emphysema"],
  },
]

// ============================================================================
// NORMALIZAÇÃO E PLANO DE BUSCA
// ============================================================================

function normalizarPT(texto: string): string {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Tradução simples (fallback) para diagnósticos sem config dedicada.
 * Mantida para não regredir diagnósticos não listados no mapa.
 */
function traduzirDiagnosticoParaOpenI(diagnosis: string): string {
  const n = normalizarPT(diagnosis)
  const mapa: Array<[string, string]> = [
    ["cardiomegalia", "cardiomegaly"],
    ["bronquiolite", "bronchiolitis"],
  ]
  for (const [chave, termo] of mapa) if (n.includes(chave)) return termo
  return n
}

/** Resolve a config (por alias) a partir de query e/ou diagnóstico. */
function resolverConfig(
  queryParam: string | null,
  diagnosisParam: string | null
): OpenIQueryConfig | null {
  const alvo = normalizarPT(`${diagnosisParam ?? ""} ${queryParam ?? ""}`)
  if (!alvo) return null
  // Mais específico primeiro: ordena aliases por comprimento desc dentro da busca
  let melhor: { cfg: OpenIQueryConfig; len: number } | null = null
  for (const cfg of OPENI_QUERY_CONFIGS) {
    for (const alias of cfg.aliases) {
      const a = normalizarPT(alias)
      if (a && alvo.includes(a)) {
        if (!melhor || a.length > melhor.len) melhor = { cfg, len: a.length }
      }
    }
  }
  return melhor?.cfg ?? null
}

/** Monta a lista ordenada de queries a tentar. */
function montarPlano(
  queryParam: string | null,
  diagnosisParam: string | null
): { queries: string[]; configId: string | null; diagnosticoNormalizado: string } {
  const diagnosticoNormalizado = normalizarPT(diagnosisParam ?? queryParam ?? "")
  const cfg = resolverConfig(queryParam, diagnosisParam)
  if (cfg) {
    // query explícita do usuário entra primeiro (se houver), depois primária + fallbacks
    const base = [cfg.primaryQuery, ...cfg.fallbackQueries]
    const queries =
      queryParam && queryParam.trim() && !base.includes(queryParam.trim())
        ? [queryParam.trim(), ...base]
        : base
    return { queries: dedup(queries), configId: cfg.id, diagnosticoNormalizado }
  }
  // Sem config: usa a query explícita ou a tradução simples
  const q = queryParam?.trim() || traduzirDiagnosticoParaOpenI(diagnosisParam ?? "")
  return { queries: q ? [q] : [], configId: null, diagnosticoNormalizado }
}

function dedup(arr: string[]): string[] {
  return Array.from(new Set(arr.filter(Boolean)))
}

// ============================================================================
// CACHE (TAREFA 3) — sucesso por query e por diagnóstico; negativo curto (TTL)
// ============================================================================

interface SuccessCacheEntry {
  imageUrl: string
  imageId: string | null
  query: string
  timestamp: number
}

const cacheSucessoPorQuery = new Map<string, SuccessCacheEntry>()
const cacheSucessoPorDiagnostico = new Map<string, SuccessCacheEntry>()

// Cache NEGATIVO curto por diagnóstico (evita martelar o upstream a cada clique
// quando ele está fora). TTL curto p/ não bloquear quando o Open-i voltar.
const NEGATIVE_TTL_MS = 10 * 60 * 1000 // 10 min
const cacheNegativoPorDiagnostico = new Map<string, number>()

function negativoAtivo(diag: string): boolean {
  if (!diag) return false
  const t = cacheNegativoPorDiagnostico.get(diag)
  if (!t) return false
  if (Date.now() - t > NEGATIVE_TTL_MS) {
    cacheNegativoPorDiagnostico.delete(diag)
    return false
  }
  return true
}

// ============================================================================
// CONSULTA OPEN-I — com status de falha distinto (TAREFA 4)
// ============================================================================

type UpstreamStatus =
  | "ok"
  | "vazio" // JSON válido, lista vazia
  | "sem_imagem" // resultados, mas sem imageUrl válida
  | "http_error"
  | "invalid_response" // HTML/JSON inválido → upstream provavelmente fora
  | "timeout"

interface ResultadoQuery {
  success: boolean
  imageUrl: string | null
  imageId: string | null
  upstreamStatus: UpstreamStatus
  totalBrutos: number
  totalValidos: number
  motivo: string
}

function normalizarUrlOpenI(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.trim() === "") return null
  const valor = raw.trim()
  if (valor.startsWith("https://")) return valor
  if (valor.startsWith("http://")) return valor.replace("http://", "https://")
  if (valor.startsWith("/")) return `https://openi.nlm.nih.gov${valor}`
  return null
}

async function buscarOpenIQuery(
  query: string,
  timeoutMs = 6000
): Promise<ResultadoQuery> {
  const url = new URL("https://openi.nlm.nih.gov/api/search")
  url.searchParams.set("query", query)
  url.searchParams.set("coll", "cxr")
  url.searchParams.set("m", "1")
  url.searchParams.set("n", "5")

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      return base("http_error", `HTTP ${response.status}`)
    }
    const text = await response.text()
    let dados: any
    try {
      dados = JSON.parse(text)
    } catch {
      // Resposta não-JSON (HTML) → upstream provavelmente indisponível
      return base("invalid_response", "Resposta não-JSON (upstream indisponível)")
    }
    const lista = Array.isArray(dados?.list) ? dados.list : []
    if (lista.length === 0) return { ...base("vazio", "Sem resultados"), totalBrutos: 0 }

    const primeiro = lista[0]
    const imageUrl = normalizarUrlOpenI(primeiro?.imgLarge)
    if (!imageUrl) {
      return { ...base("sem_imagem", "Resultados sem imageUrl válida"), totalBrutos: lista.length }
    }
    return {
      success: true,
      imageUrl,
      imageId: primeiro?.uid || primeiro?.uId || null,
      upstreamStatus: "ok",
      totalBrutos: lista.length,
      totalValidos: 1,
      motivo: "ok",
    }
  } catch (e: any) {
    clearTimeout(timeoutId)
    const aborted = e?.name === "AbortError"
    return base(aborted ? "timeout" : "invalid_response", aborted ? "Timeout do upstream" : "Falha de rede")
  }

  function base(status: UpstreamStatus, motivo: string): ResultadoQuery {
    return { success: false, imageUrl: null, imageId: null, upstreamStatus: status, totalBrutos: 0, totalValidos: 0, motivo }
  }
}

const UPSTREAM_FORA: UpstreamStatus[] = ["http_error", "invalid_response", "timeout"]

// ============================================================================
// HANDLER
// ============================================================================

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const queryParam = params.get("query")
  const diagnosisParam = params.get("diagnosis") ?? params.get("diagnostico")
  const debug = params.get("debug") === "true"

  const { queries, configId, diagnosticoNormalizado } = montarPlano(queryParam, diagnosisParam)

  console.log("[OPENI RESILIENT] diagnosticoOriginal:", diagnosisParam ?? queryParam)
  console.log("[OPENI RESILIENT] diagnosticoNormalizado:", diagnosticoNormalizado)
  console.log("[OPENI RESILIENT] queryPrimaria:", queries[0] ?? null)
  console.log("[OPENI RESILIENT] fallbackQueries:", queries.slice(1))

  if (queries.length === 0) {
    return NextResponse.json(
      { success: false, query: null, imageUrl: null, imageId: null, source: OPENI_SOURCE, curadoriaRadiologica: false, message: "Informe ?query= ou ?diagnosis=." },
      { status: 400 }
    )
  }

  // 0. Cache de SUCESSO por diagnóstico (atalho): se este diagnóstico já obteve
  //    imagem antes (por qualquer query), reutiliza sem bater no upstream.
  const cacheDiag = diagnosticoNormalizado ? cacheSucessoPorDiagnostico.get(diagnosticoNormalizado) : undefined
  if (cacheDiag) {
    console.log("[OPENI RESILIENT] cacheHit: diagnóstico", diagnosticoNormalizado, "→", cacheDiag.query)
    return respostaSucesso(cacheDiag.imageUrl, cacheDiag.imageId, cacheDiag.query, true, debug, { configId })
  }

  // 1. Cache negativo curto (upstream estava fora há pouco) — falha amigável sem martelar.
  if (negativoAtivo(diagnosticoNormalizado)) {
    console.warn("[OPENI RESILIENT] upstreamIndisponivel: cache negativo ativo para", diagnosticoNormalizado)
    return respostaFalha(queries[0], debug, { configId, diagnosticoNormalizado, upstreamStatus: "indisponivel", attempted: [] })
  }

  // 1b. Health check do upstream: se em manutenção, não tenta a cascata de queries.
  //     (o cache de sucesso por diagnóstico já foi checado acima e tem prioridade.)
  const health = await verificarOpenIHealth()
  if (health.status === "maintenance") {
    console.warn("[OPENI RESILIENT] upstreamIndisponivel: Open-i em manutenção")
    if (diagnosticoNormalizado) cacheNegativoPorDiagnostico.set(diagnosticoNormalizado, Date.now())
    return respostaFalha(queries[0], debug, {
      configId,
      diagnosticoNormalizado,
      upstreamStatus: "maintenance",
      attempted: [],
    })
  }

  // 2. CASCATA: tenta cada query em ordem.
  const attempted: Array<{ query: string; upstreamStatus: string; totalBrutos: number; totalValidos: number; motivo: string }> = []
  let upstreamForaContador = 0

  for (const query of queries) {
    // 2a. cache de sucesso por query
    const cq = cacheSucessoPorQuery.get(query)
    if (cq) {
      console.log("[OPENI RESILIENT] cacheHit: query", query)
      cacheSucessoPorDiagnostico.set(diagnosticoNormalizado, cq)
      return respostaSucesso(cq.imageUrl, cq.imageId, query, true, debug, { configId, attempted })
    }

    console.log("[OPENI RESILIENT] tentandoQuery:", query)
    const r = await buscarOpenIQuery(query)
    console.log("[OPENI RESILIENT] resultadoQuery:", { query, status: r.upstreamStatus, brutos: r.totalBrutos, validos: r.totalValidos })
    attempted.push({ query, upstreamStatus: r.upstreamStatus, totalBrutos: r.totalBrutos, totalValidos: r.totalValidos, motivo: r.motivo })

    if (r.success && r.imageUrl) {
      const entry: SuccessCacheEntry = { imageUrl: r.imageUrl, imageId: r.imageId, query, timestamp: Date.now() }
      cacheSucessoPorQuery.set(query, entry)
      if (diagnosticoNormalizado) cacheSucessoPorDiagnostico.set(diagnosticoNormalizado, entry)
      cacheNegativoPorDiagnostico.delete(diagnosticoNormalizado)
      console.log("[OPENI RESILIENT] selectedQuery:", query, "→", r.imageUrl)
      return respostaSucesso(r.imageUrl, r.imageId, query, false, debug, { configId, attempted })
    }

    // Se o upstream está claramente FORA, não adianta tentar as demais queries
    // (todas falhariam igual). Aborta cedo para não martelar o upstream.
    if (UPSTREAM_FORA.includes(r.upstreamStatus)) {
      upstreamForaContador++
      if (upstreamForaContador >= 2) {
        console.warn("[OPENI RESILIENT] upstreamIndisponivel: abortando cascata após", upstreamForaContador, "falhas de upstream")
        break
      }
    }
  }

  // 3. Falha final. Se foi por upstream fora, registra cache negativo curto.
  const upstreamFora = attempted.length > 0 && attempted.every((a) => UPSTREAM_FORA.includes(a.upstreamStatus as UpstreamStatus))
  if (upstreamFora && diagnosticoNormalizado) {
    cacheNegativoPorDiagnostico.set(diagnosticoNormalizado, Date.now())
  }
  console.warn("[OPENI RESILIENT] falhaFinal:", { diagnosticoNormalizado, tentadas: attempted.length, upstreamFora })

  return respostaFalha(queries[0], debug, {
    configId,
    diagnosticoNormalizado,
    upstreamStatus: upstreamFora ? "indisponivel" : "sem_imagem",
    attempted,
  })
}

// ----------------------------------------------------------------------------
function respostaSucesso(
  imageUrl: string,
  imageId: string | null,
  query: string,
  fromCache: boolean,
  debug: boolean,
  extra: { configId: string | null; attempted?: any[] }
) {
  return NextResponse.json({
    success: true,
    query,
    queryUsada: query,
    imageUrl,
    imageId,
    source: OPENI_SOURCE,
    curadoriaRadiologica: false,
    warning: WARNING,
    fromCache,
    ...(debug ? { configId: extra.configId, attemptedQueries: extra.attempted ?? [] } : {}),
  })
}

function respostaFalha(
  query: string,
  debug: boolean,
  extra: {
    configId: string | null
    diagnosticoNormalizado: string
    upstreamStatus: string
    attempted: any[]
  }
) {
  return NextResponse.json({
    success: false,
    query,
    imageUrl: null,
    imageId: null,
    source: OPENI_SOURCE,
    curadoriaRadiologica: false,
    message:
      "Não encontramos imagem adequada no Open-i para este diagnóstico. Tente solicitar outro exame ou use curadoria manual/fonte alternativa.",
    ...(debug
      ? {
          configId: extra.configId,
          diagnosticoNormalizado: extra.diagnosticoNormalizado,
          upstreamStatus: extra.upstreamStatus,
          attemptedQueries: extra.attempted,
        }
      : {}),
  })
}
