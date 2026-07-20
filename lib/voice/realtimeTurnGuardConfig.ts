/**
 * MEDIX PATIENT V3 — Gate manual reversível do Patient Turn Guard no Realtime
 * (FASE 4D.1).
 *
 * Módulo PURO — sem chamada de rede, sem classificador, sem tool calling. Só
 * DECIDE, a partir da feature flag e do caso, se a sessão Realtime usa o fluxo
 * ATUAL (`turnGuardMode: "disabled"`, intocado) ou o fluxo PROTEGIDO
 * (`turnGuardMode: "manual"`) — e, neste último caso, computa as instructions
 * reduzidas aos fatos de abertura e a configuração de turn-taking desejada
 * (`create_response`/`interrupt_response`, ambos `false`).
 *
 * LIMITAÇÃO DELIBERADA DESTA FASE: a configuração de turn-taking computada
 * aqui NÃO é repassada à chamada real ao provedor — isso exigiria alterar
 * lib/voice/createRealtimeClientSecret.ts, fora da lista de arquivos
 * autorizados nesta microfase. `classificarTurno` NUNCA é chamado aqui; a
 * liberação manual da resposta (após transcrição + Turn Guard) fica para uma
 * fase futura, que também exigirá alterar realtimeClient.ts/useRealtimePaciente.ts.
 */

import { obterCasoV3PorId } from "@/data/casos-v3";
import { criarDecisaoAbertura } from "@/lib/patient-v3/patientTurnGuard";
import { construirPatientSafeContext } from "@/lib/patient-v3/patientContextBuilder";
import { construirPromptBasePaciente } from "@/lib/patient-v3/promptBasePaciente";
import type {
  CasoV3,
  FatoPaciente,
  PatientKnowledge,
  PatientZoneInput,
} from "@/lib/patient-v3/casoV3.types";
import type { NonEmptyFactIds } from "@/lib/patient-v3/patientTurnGuard.types";

export type TurnGuardMode = "disabled" | "manual";

/** `create_response`/`interrupt_response` desejados para a sessão protegida — ambos sempre `false` nesta fase. */
export interface RealtimeTurnDetectionConfig {
  createResponse: false;
  interruptResponse: false;
}

export interface RealtimeSessionPadrao {
  turnGuardMode: "disabled";
}

export interface RealtimeSessionProtegida {
  turnGuardMode: "manual";
  /** Instructions reduzidas exclusivamente aos fatos de abertura (mesma whitelist do texto). */
  instructionsAbertura: string;
  turnDetection: RealtimeTurnDetectionConfig;
}

export type RealtimeSessionDecisao = RealtimeSessionPadrao | RealtimeSessionProtegida;

/**
 * Contrato de instrumentação de latência (FASE 4D.1) — apenas o FORMATO dos
 * timestamps que uma fase futura (com acesso a realtimeClient.ts/hooks)
 * preencherá. Nenhuma medição acontece neste módulo; nenhuma telemetria
 * externa; estes dados nunca são exibidos no chat. A medição principal
 * pretendida é `primeiroAudioPacienteEm - transcricaoFinalEstudanteEm`,
 * comparada entre sessões com a flag ligada e desligada.
 */
export interface RealtimeTurnLatencia {
  transcricaoFinalEstudanteEm?: number;
  liberacaoManualEnviadaEm?: number;
  primeiroAudioPacienteEm?: number;
}

/** Feature flag — desabilitada por padrão (mesma convenção de isRealtimeVoiceEnabled). */
export function isRealtimeTurnGuardEnabled(): boolean {
  return process.env.PATIENT_V3_REALTIME_TURN_GUARD === "true";
}

/** Converte um array (já comprovadamente não vazio) numa tupla NonEmptyFactIds, sem cast. */
function paraFactIdsNaoVazio(ids: readonly string[]): NonEmptyFactIds {
  if (ids.length === 0) {
    throw new Error("[patient-v3] aberturaFactIds do CasoV3 está vazio — dado de caso inválido.");
  }
  const [primeiro, ...resto] = ids;
  return [primeiro, ...resto];
}

/**
 * Constrói um PatientZoneInput REDUZIDO só aos fatos de abertura — mesmo
 * princípio de `construirZoneInputReduzido` em patientTurnText.ts (Fase 4B),
 * reaplicado aqui de forma independente (este módulo não importa
 * patientTurnText.ts, que é específico do chat de texto).
 */
function construirZoneInputAbertura(casoV3: CasoV3): PatientZoneInput {
  const resultado = criarDecisaoAbertura({
    openingFactIds: paraFactIdsNaoVazio(casoV3.disclosurePolicy.aberturaFactIds),
    availableFacts: casoV3.patientKnowledge.fatos,
  });
  const idsSelecionados = new Set(resultado.selectedFacts.map((f) => f.id));

  const fatosAbertura: FatoPaciente[] = [...resultado.selectedFacts];
  const patientKnowledge: PatientKnowledge = {
    identidade: casoV3.patientKnowledge.identidade,
    interlocutor: casoV3.patientKnowledge.interlocutor,
    fatos: fatosAbertura,
  };
  if (casoV3.patientKnowledge.responsavel) {
    patientKnowledge.responsavel = casoV3.patientKnowledge.responsavel;
  }

  return {
    patientKnowledge,
    disclosurePolicy: {
      aberturaFactIds: casoV3.disclosurePolicy.aberturaFactIds.filter((id) => idsSelecionados.has(id)),
      regras: casoV3.disclosurePolicy.regras.filter((r) => idsSelecionados.has(r.factId)),
    },
    persona: casoV3.persona,
    sessionStateInicial: casoV3.sessionStateInicial,
  };
}

/**
 * Decide o modo da sessão Realtime para este caso. Fora do Caso Ouro (sem
 * CasoV3 registrado) ou com a flag desligada, devolve sempre "disabled" — o
 * caminho atual, intocado. ClinicalTruth/Examiner/metadata nunca são lidos.
 */
export function decidirSessaoRealtime(casoId: string): RealtimeSessionDecisao {
  if (!isRealtimeTurnGuardEnabled()) {
    return { turnGuardMode: "disabled" };
  }

  const casoV3 = obterCasoV3PorId(casoId);
  if (!casoV3) {
    return { turnGuardMode: "disabled" };
  }

  const zoneInputAbertura = construirZoneInputAbertura(casoV3);
  const instructionsAbertura = construirPromptBasePaciente(construirPatientSafeContext(zoneInputAbertura));

  return {
    turnGuardMode: "manual",
    instructionsAbertura,
    turnDetection: { createResponse: false, interruptResponse: false },
  };
}
