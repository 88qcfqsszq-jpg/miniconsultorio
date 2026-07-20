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
 *
 * SUBFASE 4D.1.1 — quando `params.turnDetection` é fornecido (hoje, só pelo
 * gate manual do Realtime, ver lib/voice/realtimeTurnGuardConfig.ts), a sessão
 * enviada ao provedor ganha `session.audio.input.turn_detection =
 * {type:"server_vad", create_response, interrupt_response}`.
 *
 * FASE 4E — sem `turnDetection` (fluxo direto/automático, hoje o único em
 * produção — Turn Guard desligado), a sessão passa a enviar um VAD explícito,
 * sem interromper a resposta em andamento, mais redução de ruído para
 * microfone integrado (far_field). O modo manual do Turn Guard (`turnDetection`
 * presente) não é alterado por esta fase.
 *
 * FASE 4F — o VAD do fluxo direto passou de `server_vad` (baseado só em
 * volume, sujeito a disparar com pigarro/ruído curto) para `semantic_vad`
 * (ver VAD_DIRETO_PADRAO abaixo) — usa um modelo de turn detection para
 * estimar se a fala realmente terminou, não apenas o volume/silêncio.
 */

import OpenAI from "openai";
import type { RealtimeTurnDetectionConfig } from "@/lib/voice/realtimeTurnGuardConfig";

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
  /**
   * SUBFASE 4D.1.1 — quando presente (só no gate manual do Realtime, Caso
   * Ouro + flag ligada), é repassado ao SDK como
   * `session.audio.input.turn_detection = {type:"server_vad", create_response,
   * interrupt_response}`. Quando ausente (fluxo direto/automático, FASE 4E),
   * é usado o VAD explícito padrão do fluxo direto (VAD_DIRETO_PADRAO).
   */
  turnDetection?: RealtimeTurnDetectionConfig;
}

// ============================================================================
// TIPAGEM OFICIAL DO SDK — derivada por indexed access de
// OpenAI.Realtime.ClientSecretCreateParams (o único tipo de request reexportado
// publicamente pelo pacote para este endpoint), sem importar caminhos internos
// não reexportados e sem nenhum `any`/cast.
// ============================================================================

type RealtimeSessionParamsOficial = NonNullable<OpenAI.Realtime.ClientSecretCreateParams["session"]>;
type RealtimeSessionRealtimeOficial = Extract<RealtimeSessionParamsOficial, { type: "realtime" }>;
type RealtimeAudioParamsOficial = NonNullable<RealtimeSessionRealtimeOficial["audio"]>;
type RealtimeAudioInputParamsOficial = NonNullable<RealtimeAudioParamsOficial["input"]>;
type RealtimeTurnDetectionParamsOficial = NonNullable<RealtimeAudioInputParamsOficial["turn_detection"]>;
type RealtimeServerVadParamsOficial = Extract<RealtimeTurnDetectionParamsOficial, { type: "server_vad" }>;
type RealtimeSemanticVadParamsOficial = Extract<RealtimeTurnDetectionParamsOficial, { type: "semantic_vad" }>;
type RealtimeNoiseReductionParamsOficial = NonNullable<RealtimeAudioInputParamsOficial["noise_reduction"]>;

/** Constrói `session.audio.input.turn_detection`, usando exclusivamente a tipagem oficial do SDK. */
function construirServerVadOficial(turnDetection: RealtimeTurnDetectionConfig): RealtimeServerVadParamsOficial {
  return {
    type: "server_vad",
    create_response: turnDetection.createResponse,
    interrupt_response: turnDetection.interruptResponse,
  };
}

/**
 * FASE 4F — VAD explícito do fluxo DIRETO/automático (Turn Guard desligado):
 * `semantic_vad` com `eagerness:"auto"` — usa um modelo de turn detection
 * (não apenas volume/silêncio) para estimar se a fala realmente terminou,
 * reduzindo a ativação por pigarro/ruído curto que o `server_vad` (Fase 4E)
 * ainda disparava. `interrupt_response:false` para que ruído não corte a
 * resposta do paciente em andamento; `create_response:true` preserva a
 * resposta automática (baixa latência). `threshold`/`prefix_padding_ms`/
 * `silence_duration_ms` não existem no contrato de `semantic_vad` (são
 * exclusivos de `server_vad`) — omitidos aqui, nunca enviados.
 */
const VAD_DIRETO_PADRAO: RealtimeSemanticVadParamsOficial = {
  type: "semantic_vad",
  eagerness: "auto",
  create_response: true,
  interrupt_response: false,
};

/** FASE 4E — redução de ruído compatível com microfone integrado de Mac/iPad. */
const NOISE_REDUCTION_DIRETO_PADRAO: RealtimeNoiseReductionParamsOficial = {
  type: "far_field",
};

/**
 * Constrói o objeto `session` oficial. Com `turnDetection` (gate manual do
 * Turn Guard, inalterado nesta fase): só `turn_detection`, sem
 * `noise_reduction`. Sem `turnDetection` (fluxo direto/automático, FASE 4E):
 * VAD explícito + redução de ruído padrão do fluxo direto.
 */
function construirSessaoOficial(params: RealtimeClientSecretParams): RealtimeSessionRealtimeOficial {
  const sessaoBase: RealtimeSessionRealtimeOficial = {
    type: "realtime",
    model: params.model,
    instructions: params.instructions,
  };

  if (params.turnDetection) {
    return {
      ...sessaoBase,
      audio: {
        input: {
          turn_detection: construirServerVadOficial(params.turnDetection),
        },
      },
    };
  }

  return {
    ...sessaoBase,
    audio: {
      input: {
        turn_detection: VAD_DIRETO_PADRAO,
        noise_reduction: NOISE_REDUCTION_DIRETO_PADRAO,
      },
    },
  };
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

  const corpoRequisicao: OpenAI.Realtime.ClientSecretCreateParams = {
    expires_after: { anchor: "created_at", seconds: params.expiresAfterSeconds },
    session: construirSessaoOficial(params),
  };
  const resposta = await cliente.realtime.clientSecrets.create(corpoRequisicao);

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
