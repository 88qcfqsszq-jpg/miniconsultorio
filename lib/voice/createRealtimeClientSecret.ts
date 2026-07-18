/**
 * Emissão de segredo efêmero (client secret) da OpenAI Realtime API (Etapa 3).
 *
 * SERVER-ONLY: este módulo lê a chave OpenAI do servidor e nunca deve ser
 * importado por código cliente ('use client'). Nesta versão do repositório,
 * usar o sentinel `import "server-only"` quebraria a execução dos testes via
 * `tsx --test` (o pacote só é resolvível dentro do bundler do Next.js — fora
 * dele, `import "server-only"` falha com ERR_MODULE_NOT_FOUND). Por isso, a
 * proteção equivalente aqui é um GUARD DE RUNTIME (`typeof window`), que:
 *   - lança erro imediatamente se executado no navegador (defesa em profundidade);
 *   - não afeta a execução em Node/tsx (onde `window` também é undefined),
 *     preservando a testabilidade exigida por esta etapa.
 * Além disso, o arquivo só é importado por app/api/realtime/session/route.ts
 * (um Route Handler, que o Next.js nunca inclui no bundle do navegador).
 *
 * Contrato oficial utilizado (SDK `openai` v6.39.1, client.realtime.clientSecrets.create):
 *   client.realtime.clientSecrets.create({
 *     expires_after: { anchor: "created_at", seconds: <10..7200> },
 *     session: { type: "realtime", model, instructions, ... }
 *   })
 *   → { value: string /* "ek_..." *\/, expires_at: number, session: {...} }
 */

import OpenAI from "openai";

// ============================================================================
// CONFIGURAÇÃO (variáveis server-only, validadas)
// ============================================================================

/** Limites do PROVEDOR para expires_after.seconds (contrato oficial). */
const PROVIDER_EXPIRES_MIN_SECONDS = 10;
const PROVIDER_EXPIRES_MAX_SECONDS = 7200;

/** Default e teto adicional do MEDIX (mais conservador que o teto do provedor, por custo). */
const MEDIX_DEFAULT_MAX_SECONDS = 600; // 10 minutos
const MEDIX_SAFE_CEILING_SECONDS = 1800; // 30 minutos

/** Faixa para o timeout de inatividade — reservado para uso futuro (ver nota abaixo). */
const IDLE_TIMEOUT_MIN_SECONDS = 10;
const IDLE_TIMEOUT_MAX_SECONDS = 300;
const IDLE_TIMEOUT_DEFAULT_SECONDS = 30;

/**
 * Parseia um inteiro de env var; valor ausente ou inválido (não numérico, ≤0)
 * é CORRIGIDO para o default (não rejeita a operação inteira por causa disso).
 * Valor válido é sempre limitado (clamp) a [min, max].
 */
function parseIntEnvComDefault(raw: string | undefined, min: number, max: number, fallback: number): number {
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(max, Math.max(min, n));
}

/** Feature flag — desabilitado por padrão (ausente ou qualquer valor != "true"). */
export function isRealtimeVoiceEnabled(): boolean {
  return process.env.REALTIME_VOICE_ENABLED === "true";
}

/**
 * Modelo Realtime — EXCLUSIVAMENTE de variável de ambiente, sem fallback fixo no
 * código (o cliente jamais pode escolher o modelo). Retorna null se ausente —
 * o endpoint trata isso como erro de configuração do servidor (500).
 */
export function resolverModeloRealtime(): string | null {
  const raw = process.env.OPENAI_REALTIME_MODEL;
  if (!raw || typeof raw !== "string" || raw.trim().length === 0) return null;
  return raw.trim();
}

/** Duração máxima da sessão (segundos), validada e limitada por [10, min(1800,7200)]. */
export function resolverSessionMaxSeconds(): number {
  return parseIntEnvComDefault(
    process.env.REALTIME_SESSION_MAX_SECONDS,
    PROVIDER_EXPIRES_MIN_SECONDS,
    Math.min(MEDIX_SAFE_CEILING_SECONDS, PROVIDER_EXPIRES_MAX_SECONDS),
    MEDIX_DEFAULT_MAX_SECONDS
  );
}

/**
 * Timeout de inatividade (segundos) — validado e limitado, mas RESERVADO: nesta
 * etapa não é enviado ao provedor nem aplicado em lugar algum (não há conexão
 * ainda). Existe para ser consumido por uma etapa futura (encerramento no
 * frontend/conexão WebRTC). Não confundir com a validade real do client secret
 * (expires_at, devolvida pelo provedor) nem com o limite de sessão acima.
 */
export function resolverIdleTimeoutSeconds(): number {
  return parseIntEnvComDefault(
    process.env.REALTIME_IDLE_TIMEOUT_SECONDS,
    IDLE_TIMEOUT_MIN_SECONDS,
    IDLE_TIMEOUT_MAX_SECONDS,
    IDLE_TIMEOUT_DEFAULT_SECONDS
  );
}

/**
 * Resolve a chave OpenAI para Realtime: OPENAI_REALTIME_API_KEY (se definida)
 * com fallback para OPENAI_API_KEY (chave já existente no projeto). Nunca exige
 * uma segunda chave. Retorna null se nenhuma estiver configurada.
 */
export function resolverChaveRealtime(): string | null {
  if (typeof window !== "undefined") {
    throw new Error("resolverChaveRealtime não pode ser chamada no navegador.");
  }
  const chave = process.env.OPENAI_REALTIME_API_KEY || process.env.OPENAI_API_KEY;
  return chave && chave.trim().length > 0 ? chave : null;
}

// ============================================================================
// ERRO DE CONFIGURAÇÃO (distinto de falha do provedor)
// ============================================================================

/**
 * Erro de CONFIGURAÇÃO do servidor (ex.: chave ausente) — o chamador (route.ts)
 * deve mapear para 500 com mensagem genérica. Distinto de uma falha do provedor
 * (rede, OpenAI fora do ar), que deve ser mapeada para 502.
 */
export class RealtimeConfigError extends Error {}

// ============================================================================
// CRIAÇÃO DO SEGREDO EFÊMERO
// ============================================================================

export interface RealtimeClientSecretParams {
  instructions: string;
  model: string;
  expiresAfterSeconds: number;
}

export interface RealtimeClientSecretResult {
  /** Segredo efêmero de curta duração (ex.: "ek_..."), seguro para enviar ao navegador. */
  clientSecret: string;
  /** Expiração REAL informada pelo provedor (segundos desde a época). */
  expiresAt: number;
  sessionId?: string;
}

/**
 * Interface mínima do cliente necessária — permite injeção de um mock nos
 * testes (nenhuma chamada de rede real é necessária para testar este módulo
 * nem o endpoint que o consome).
 */
export interface RealtimeClientSecretsClient {
  realtime: {
    clientSecrets: {
      create(body: unknown): Promise<{ value: string; expires_at: number; session?: { id?: string } }>;
    };
  };
}

/**
 * Cria o segredo efêmero da sessão Realtime.
 *
 * Em produção (sem `client` injetado): resolve a chave server-only e constrói o
 * cliente OpenAI oficial. Em testes: um `client` mockado é injetado, e a função
 * NUNCA toca a chave de ambiente nem a rede.
 *
 * Nota sobre voz: o campo `session.audio.output.voice` é OPCIONAL no contrato
 * oficial (o provedor aplica um padrão quando omitido). Esta etapa
 * INTENCIONALMENTE não envia voz alguma — o catálogo lógico do Medix
 * (lib/voice/voiceCatalog.ts) ainda não foi traduzido para vozes reais do
 * provedor (isso depende de um teste auditivo, fora do escopo desta etapa).
 */
export async function createRealtimeClientSecret(
  params: RealtimeClientSecretParams,
  client?: RealtimeClientSecretsClient
): Promise<RealtimeClientSecretResult> {
  if (typeof window !== "undefined") {
    throw new Error("createRealtimeClientSecret não pode ser chamada no navegador.");
  }

  const cliente = client ?? construirClienteOficial();

  const resposta = await cliente.realtime.clientSecrets.create({
    expires_after: { anchor: "created_at", seconds: params.expiresAfterSeconds },
    session: {
      type: "realtime",
      model: params.model,
      instructions: params.instructions,
    },
  });

  return {
    clientSecret: resposta.value,
    expiresAt: resposta.expires_at,
    sessionId: resposta.session?.id,
  };
}

/** Constrói o cliente OFICIAL da OpenAI usando a chave server-only resolvida. */
function construirClienteOficial(): RealtimeClientSecretsClient {
  const chave = resolverChaveRealtime();
  if (!chave) {
    throw new RealtimeConfigError("Chave OpenAI ausente no servidor.");
  }
  return new OpenAI({ apiKey: chave }) as unknown as RealtimeClientSecretsClient;
}
