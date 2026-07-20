/**
 * Endpoint de sessão efêmera Realtime (Etapa 3) — SOMENTE emissão de segredo.
 *
 * Não conecta WebRTC, não reproduz áudio, não toca microfone. Prepara as
 * instruções do Paciente Virtual no SERVIDOR (fonte única, lib/prompts.ts +
 * lib/voice) e emite um client secret de curta duração para uma futura conexão
 * Realtime no navegador.
 *
 * Contrato de entrada mínimo — o cliente NUNCA pode enviar instructions, model,
 * voice, voiceId, temperature, tools, diagnóstico ou qualquer configuração
 * livre de sessão. O único campo aceito é `casoId`.
 *
 * Autenticação: este projeto NÃO possui autenticação de usuário no servidor
 * (perfil é local, em localStorage — ver lib/userProfile.ts). Não foi
 * improvisado nenhum sistema de auth aqui. A única proteção aplicada é uma
 * verificação de ORIGEM (best-effort, ver `origemPermitida` abaixo), que NÃO é
 * autenticação — não identifica nem autoriza um usuário específico. Qualquer
 * script executando na mesma origem (inclusive o próprio app) ainda pode
 * chamar este endpoint. Isso é uma LIMITAÇÃO conhecida desta primeira versão.
 *
 * Casos suportados: SOMENTE casos canônicos (resolvidos por casoId em
 * casosV2, no servidor). Casos GERADOS dinamicamente (sessionStorage, sem
 * validação estrutural segura no projeto) NÃO são suportados nesta versão —
 * ver limitação registrada no relatório de entrega.
 */

import { NextRequest, NextResponse } from "next/server";
import { casosV2 } from "@/data/casos-v2";
import { construirInstrucoesRealtime, combinarBaseComMetadadosDeVoz } from "@/lib/voice/realtimeInstructions";
import { decidirSessaoRealtime, type TurnGuardMode } from "@/lib/voice/realtimeTurnGuardConfig";
import {
  createRealtimeClientSecret,
  isRealtimeVoiceEnabled,
  resolverModeloRealtime,
  resolverSessionMaxSeconds,
  RealtimeConfigError,
  type RealtimeClientSecretResult,
  type RealtimeClientSecretParams,
} from "@/lib/voice/createRealtimeClientSecret";
import type { Caso } from "@/lib/types";

// ============================================================================
// CONSTANTES DE VALIDAÇÃO DE ENTRADA
// ============================================================================

/** Tamanho máximo do corpo bruto (bytes/chars) — corpo esperado é minúsculo ({casoId}). */
const MAX_BODY_LENGTH = 2_000;

/** IDs canônicos reais observados: "1".."63", "ped-01".."ped-16" (≤6 chars). Folga generosa. */
const CASO_ID_REGEX = /^[a-z0-9][a-z0-9-]{0,49}$/;
const CASO_ID_MAX_LENGTH = 50;

interface CriarSessaoRealtimeRequestBody {
  casoId?: unknown;
  // Quaisquer outros campos enviados pelo cliente (instructions, model, voice,
  // voiceId, diagnostico, temperature, tools, sessionConfig...) são IGNORADOS —
  // nunca lidos, nunca repassados. Só `casoId` é utilizado.
}

export interface CriarSessaoRealtimeResponseBody {
  clientSecret: string;
  expiresAt: number;
  sessionId?: string;
  profile: {
    voiceId: string;
    speakerRole: "patient" | "caregiver" | "companion";
    ageGroup: "child" | "adolescent" | "adult" | "elderly";
  };
  /**
   * FASE 4D.1 — "disabled" (padrão/casos legados) preserva o fluxo atual
   * exatamente; "manual" (só Caso Ouro, com PATIENT_V3_REALTIME_TURN_GUARD
   * ligada) indica que as instructions enviadas foram reduzidas aos fatos de
   * abertura. Nesta fase o cliente ainda NÃO consome este campo.
   */
  turnGuardMode: TurnGuardMode;
}

/** Dependências injetáveis (produção usa os defaults; testes injetam mocks). */
export interface CriarSessaoRealtimeDeps {
  criarClientSecret: (params: RealtimeClientSecretParams) => Promise<RealtimeClientSecretResult>;
}

function erroSanitizado(mensagem: string, status: number): NextResponse {
  return NextResponse.json({ error: mensagem }, { status });
}

/**
 * Verificação de ORIGEM — best-effort, NÃO é autenticação. Reduz abuso trivial
 * de terceiros embutindo chamadas cross-origin a este endpoint. Ausência de
 * Origin/Referer não bloqueia (melhor esforço); presença com host divergente
 * de TODOS os hosts aceitos é rejeitada.
 *
 * Aceita tanto req.nextUrl.host quanto X-Forwarded-Host: atrás de um proxy
 * reverso (ex.: Render, Vercel), o host público real pode chegar por qualquer
 * um dos dois dependendo de como o runtime resolve a URL da requisição. Aceitar
 * ambos evita bloquear chamadas legítimas da própria aplicação em produção,
 * sem enfraquecer a rejeição de origens realmente cruzadas.
 */
function origemPermitida(req: NextRequest): boolean {
  const hostsAceitos = new Set<string>([req.nextUrl.host]);
  const hostEncaminhado = req.headers.get("x-forwarded-host");
  if (hostEncaminhado) hostsAceitos.add(hostEncaminhado);

  const candidato = req.headers.get("origin") || req.headers.get("referer");
  if (!candidato) return true;
  try {
    return hostsAceitos.has(new URL(candidato).host);
  } catch {
    return false;
  }
}

/** Resolve o caso SOMENTE entre os canônicos (casosV2), por casoId, no servidor. */
function resolverCasoCanonico(casoId: string): Caso | null {
  const encontrado = (casosV2 as unknown as Caso[]).find((c: any) => c?.id === casoId);
  return encontrado ?? null;
}

/**
 * Handler exportável e testável por injeção de dependência (evita chamada real
 * à OpenAI nos testes — nenhum teste automatizado consome créditos).
 */
export async function handleCriarSessaoRealtime(
  req: NextRequest,
  deps: Partial<CriarSessaoRealtimeDeps> = {}
): Promise<NextResponse> {
  const inicio = Date.now();
  const criarClientSecret = deps.criarClientSecret ?? createRealtimeClientSecret;

  // 1. Feature flag — desabilitada por padrão. Nunca afeta o paciente por texto.
  if (!isRealtimeVoiceEnabled()) {
    return erroSanitizado("Recurso de voz não está habilitado.", 403);
  }

  // 2. Verificação de origem (ver nota acima — não é autenticação).
  if (!origemPermitida(req)) {
    return erroSanitizado("Origem da solicitação não permitida.", 403);
  }

  // 3. Content-Type.
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return erroSanitizado("Content-Type deve ser application/json.", 400);
  }

  // 4. Tamanho do corpo (pré-checagem por Content-Length, quando disponível).
  const contentLengthHeader = req.headers.get("content-length");
  if (contentLengthHeader && Number(contentLengthHeader) > MAX_BODY_LENGTH) {
    return erroSanitizado("Corpo da solicitação excede o tamanho máximo.", 400);
  }

  // 5. Corpo: leitura, tamanho real, JSON válido.
  let textoBruto: string;
  try {
    textoBruto = await req.text();
  } catch {
    return erroSanitizado("Corpo da solicitação inválido.", 400);
  }
  if (!textoBruto || textoBruto.length === 0) {
    return erroSanitizado("Corpo da solicitação ausente.", 400);
  }
  if (textoBruto.length > MAX_BODY_LENGTH) {
    return erroSanitizado("Corpo da solicitação excede o tamanho máximo.", 400);
  }
  let corpo: CriarSessaoRealtimeRequestBody;
  try {
    corpo = JSON.parse(textoBruto);
  } catch {
    return erroSanitizado("JSON inválido.", 400);
  }

  // 6. casoId: presente, tipo, tamanho, formato. Nenhum outro campo do corpo é lido.
  const casoId = corpo?.casoId;
  if (typeof casoId !== "string" || casoId.length === 0) {
    return erroSanitizado("casoId é obrigatório.", 400);
  }
  if (casoId.length > CASO_ID_MAX_LENGTH || !CASO_ID_REGEX.test(casoId)) {
    return erroSanitizado("casoId em formato inválido.", 400);
  }

  // 7. Resolver caso — somente canônico, no servidor.
  const caso = resolverCasoCanonico(casoId);
  if (!caso) {
    return erroSanitizado("Caso não encontrado.", 404);
  }

  // 8. Configuração obrigatória do servidor (modelo).
  const modelo = resolverModeloRealtime();
  if (!modelo) {
    console.error("[realtime/session] configuração ausente: OPENAI_REALTIME_MODEL");
    return erroSanitizado("Configuração do servidor indisponível.", 500);
  }

  // 9. Construir instruções + perfil de voz NO SERVIDOR — fonte única, o corpo
  //    do cliente não influencia em NADA este resultado além do casoId.
  //
  // FASE 4D.1 — gate manual reversível: decidirSessaoRealtime(casoId) só
  // retorna "manual" para o Caso Ouro (CasoV3 registrado) com a flag
  // PATIENT_V3_REALTIME_TURN_GUARD ligada; qualquer outro caso, ou a mesma
  // flag desligada, preserva EXATAMENTE o caminho atual (construirInstrucoesRealtime
  // completo, com os 25 fatos). Em "manual", as instructions enviadas contêm
  // SOMENTE os fatos de abertura — classificarTurno NUNCA é chamado aqui, e
  // create_response/interrupt_response (calculados por decidirSessaoRealtime)
  // ainda NÃO são repassados ao provedor nesta fase (ver nota no próprio
  // módulo de configuração).
  const decisaoTurnGuard = decidirSessaoRealtime(casoId);
  const { instructions, voiceProfile } =
    decisaoTurnGuard.turnGuardMode === "manual"
      ? combinarBaseComMetadadosDeVoz(decisaoTurnGuard.instructionsAbertura, caso)
      : construirInstrucoesRealtime(caso);
  const expiresAfterSeconds = resolverSessionMaxSeconds();

  // 10. Emitir segredo efêmero.
  try {
    const resultado = await criarClientSecret({
      instructions,
      model: modelo,
      expiresAfterSeconds,
    });

    console.log(
      `[realtime/session] sucesso casoId=${casoId} duracaoMs=${Date.now() - inicio} sessionId=${resultado.sessionId ?? "n/a"}`
    );

    const resposta: CriarSessaoRealtimeResponseBody = {
      clientSecret: resultado.clientSecret,
      expiresAt: resultado.expiresAt,
      sessionId: resultado.sessionId,
      profile: {
        voiceId: voiceProfile.voiceId,
        speakerRole: voiceProfile.speakerRole,
        ageGroup: voiceProfile.ageGroup,
      },
      turnGuardMode: decisaoTurnGuard.turnGuardMode,
    };
    return NextResponse.json(resposta, { status: 200 });
  } catch (erro) {
    if (erro instanceof RealtimeConfigError) {
      console.error(`[realtime/session] erro de configuração casoId=${casoId} duracaoMs=${Date.now() - inicio}`);
      return erroSanitizado("Configuração do servidor indisponível.", 500);
    }
    console.error(`[realtime/session] falha no provedor casoId=${casoId} duracaoMs=${Date.now() - inicio}`);
    return erroSanitizado("Falha ao iniciar sessão de voz. Tente novamente.", 502);
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return handleCriarSessaoRealtime(req);
}
