/**
 * Health check do Open-i: GET /api/openi/health
 *
 * Faz UMA chamada leve ao Open-i e classifica o estado do upstream:
 * online | maintenance | invalid_response | timeout | unknown.
 *
 * Usado por /api/openi/raw para evitar tentar a cascata de queries quando o
 * serviço está em manutenção. Não troca a fonte nem afeta HealthBench/feedback.
 */

import { NextResponse } from "next/server"

export type OpenIHealthStatus =
  | "online"
  | "maintenance"
  | "invalid_response"
  | "timeout"
  | "unknown"

export interface OpenIHealth {
  ok: boolean
  status: OpenIHealthStatus
  contentType: string
  checkedAt: string
  message: string
}

// Cache curto do health para não checar a cada query (TTL 60s).
const HEALTH_TTL_MS = 60 * 1000
let healthCache: { value: OpenIHealth; timestamp: number } | null = null

export async function verificarOpenIHealth(timeoutMs = 6000): Promise<OpenIHealth> {
  if (healthCache && Date.now() - healthCache.timestamp < HEALTH_TTL_MS) {
    return healthCache.value
  }

  const checkedAt = new Date().toISOString()
  const url = "https://openi.nlm.nih.gov/api/search?query=pulmonary%20edema&n=1"
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  let resultado: OpenIHealth
  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
    clearTimeout(timeoutId)

    const contentType = response.headers.get("content-type") || "desconhecido"
    const text = await response.text()
    const lower = text.toLowerCase()
    const maintenance =
      lower.includes("currently under maintenance") ||
      lower.includes("under maintenance") ||
      lower.includes("site is currently")

    if (maintenance) {
      resultado = {
        ok: false,
        status: "maintenance",
        contentType,
        checkedAt,
        message: "Open-i está em manutenção no momento.",
      }
    } else if (!response.ok) {
      resultado = {
        ok: false,
        status: "invalid_response",
        contentType,
        checkedAt,
        message: `Open-i retornou HTTP ${response.status}.`,
      }
    } else {
      // Tenta JSON
      let dados: any = null
      try {
        dados = JSON.parse(text)
      } catch {
        dados = null
      }
      if (dados && Array.isArray(dados.list)) {
        const temImagem = dados.list.length > 0 && typeof dados.list[0]?.imgLarge === "string"
        resultado = {
          ok: true,
          status: "online",
          contentType,
          checkedAt,
          message: temImagem
            ? "Open-i online com imagens disponíveis."
            : "Open-i online (resposta JSON válida).",
        }
      } else {
        // 200 mas não-JSON (HTML inesperado) — provável página de erro/manutenção
        resultado = {
          ok: false,
          status: "invalid_response",
          contentType,
          checkedAt,
          message: "Open-i respondeu em formato inesperado (não-JSON).",
        }
      }
    }
  } catch (e: any) {
    clearTimeout(timeoutId)
    const aborted = e?.name === "AbortError"
    resultado = {
      ok: false,
      status: aborted ? "timeout" : "unknown",
      contentType: "desconhecido",
      checkedAt,
      message: aborted ? "Timeout ao consultar o Open-i." : "Falha desconhecida ao consultar o Open-i.",
    }
  }

  console.log("[OPENI HEALTH] status:", resultado.status)
  console.log("[OPENI HEALTH] contentType:", resultado.contentType)
  console.log("[OPENI HEALTH] maintenanceDetected:", resultado.status === "maintenance")

  healthCache = { value: resultado, timestamp: Date.now() }
  return resultado
}

export async function GET() {
  const health = await verificarOpenIHealth()
  return NextResponse.json(health)
}
