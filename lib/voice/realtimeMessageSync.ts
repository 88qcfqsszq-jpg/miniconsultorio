/**
 * Sincronização entre a sessão Realtime (voz) e o histórico textual (Etapa 5).
 *
 * Camada PURA e independente de React/DOM/rede — recebe transcrições finais já
 * sanitizadas (emitidas por lib/voice/realtimeClient.ts) e as converte para o
 * MESMO formato usado hoje em mensagens[] (MensagemChat, lib/types.ts), com
 * deduplicação, ordem cronológica e IDs estáveis.
 *
 * NÃO importa realtimeClient.ts (desacoplado de propósito — testável sozinho,
 * e reutilizável por qualquer fonte de transcrição futura). NÃO importa React.
 * NÃO envia nada a /api/chat-paciente. NÃO persiste áudio nem clientSecret.
 *
 * Papéis: "estudante" (mesmo tipo já usado para a fala do aluno no modo texto)
 * e "paciente" (mesmo tipo já usado para a resposta do paciente no modo texto)
 * — reaproveita EXATAMENTE os literais de MensagemChat.tipo, sem tradução.
 */

export type PapelMensagemSincronizada = "estudante" | "paciente";

/** Mesma forma de lib/types.ts#MensagemChat — reaproveitada, não redefinida. */
export interface MensagemChatSincronizada {
  id: string;
  tipo: PapelMensagemSincronizada;
  conteudo: string;
  timestamp: Date;
}

/**
 * Transcrição FINAL recebida (já sanitizada por realtimeClient.ts — nunca inclui
 * prompt, diagnóstico, clientSecret ou qualquer outro campo do payload bruto).
 */
export interface TranscricaoFinalRecebida {
  role: PapelMensagemSincronizada;
  text: string;
  /** ID estável do provedor (item_id). Pode faltar em eventos malformados. */
  itemId?: string | null;
}

export interface RealtimeMessageSync {
  /**
   * Processa uma transcrição final. Retorna a mensagem adicionada, ou `null`
   * quando o evento é inválido (papel desconhecido, texto vazio) ou duplicado
   * (mesma transcrição já processada) — em ambos os casos o histórico existente
   * permanece intacto (nada é removido).
   */
  receberTranscricaoFinal(evento: TranscricaoFinalRecebida): MensagemChatSincronizada | null;
  /** Histórico atual, na ordem cronológica de chegada (cópia defensiva). */
  getMensagens(): MensagemChatSincronizada[];
  /**
   * Semeia o sincronizador com um histórico já existente (ex.: mensagens
   * digitadas antes de trocar para o modo voz), preservando-o integralmente.
   * Novas transcrições são apenas ACRESCENTADAS após o que já existia.
   */
  seedMensagens(mensagensExistentes: MensagemChatSincronizada[]): void;
  /** Limpa por completo o histórico e as chaves de deduplicação. */
  reset(): void;
}

// ============================================================================
// CHAVE DE DEDUPLICAÇÃO E ID ESTÁVEL (determinísticos — nunca aleatórios)
// ============================================================================

/** Hash FNV-1a de 32 bits — determinístico, sem dependência de crypto. */
function hashDeterministico(texto: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    hash ^= texto.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/**
 * Chave de deduplicação: prioriza (papel + item_id do provedor), a fonte mais
 * confiável de identidade de um turno de conversa. Na ausência de item_id
 * (evento malformado ou omitido), cai para uma chave determinística derivada
 * de (papel + texto) — nunca "sem chave", nunca aleatória.
 */
function gerarChaveDedup(role: PapelMensagemSincronizada, itemId: string | null | undefined, texto: string): string {
  const idLimpo = typeof itemId === "string" ? itemId.trim() : "";
  if (idLimpo.length > 0) return `${role}:item:${idLimpo}`;
  return `${role}:hash:${hashDeterministico(texto)}`;
}

/** ID da mensagem — função pura da chave de deduplicação (mesma entrada → mesmo ID sempre). */
function gerarIdMensagem(chaveDedup: string): string {
  return `voz-${hashDeterministico(chaveDedup)}`;
}

// ============================================================================
// FÁBRICA
// ============================================================================

export function criarRealtimeMessageSync(): RealtimeMessageSync {
  let mensagens: MensagemChatSincronizada[] = [];
  const chavesVistas = new Set<string>();

  function receberTranscricaoFinal(evento: TranscricaoFinalRecebida): MensagemChatSincronizada | null {
    if (!evento || (evento.role !== "estudante" && evento.role !== "paciente")) {
      return null; // papel inválido/desconhecido — evento ignorado
    }
    const texto = typeof evento.text === "string" ? evento.text.trim() : "";
    if (texto.length === 0) {
      return null; // texto vazio/ausente (ex.: transcrição incompleta) — ignorado
    }

    const chave = gerarChaveDedup(evento.role, evento.itemId, texto);
    if (chavesVistas.has(chave)) {
      return null; // duplicata (mesmo item_id ou mesmo conteúdo já processado)
    }
    chavesVistas.add(chave);

    // Reaproveita EXATAMENTE os campos/tipos de MensagemChat — sem campos extras
    // (nenhum item_id, role bruto, metadado do provedor ou segredo é incluído).
    const mensagem: MensagemChatSincronizada = {
      id: gerarIdMensagem(chave),
      tipo: evento.role,
      conteudo: texto,
      timestamp: new Date(),
    };
    mensagens.push(mensagem);
    return mensagem;
  }

  function getMensagens(): MensagemChatSincronizada[] {
    return [...mensagens];
  }

  function seedMensagens(mensagensExistentes: MensagemChatSincronizada[]): void {
    mensagens = Array.isArray(mensagensExistentes) ? [...mensagensExistentes] : [];
    // Deliberado: NÃO populamos chavesVistas a partir do histórico semeado —
    // mensagens digitadas não carregam item_id do provedor, e deduplicação só
    // se aplica entre transcrições de voz recebidas por ESTE sincronizador.
  }

  function reset(): void {
    mensagens = [];
    chavesVistas.clear();
  }

  return { receberTranscricaoFinal, getMensagens, seedMensagens, reset };
}
