/**
 * MEDIX PATIENT V3 — Integração do Patient Turn Guard no chat de TEXTO (FASE 4B).
 *
 * `prepararTurnoPacienteTexto` é o único ponto que decide, por turno, o que o
 * gerador (ou uma resposta direta determinística) recebe:
 *
 * - Caso LEGADO (sem CasoV3 registrado): comportamento 100% intocado — mesmo
 *   `criarPromptPaciente`, nenhuma chamada ao classificador.
 * - Caso V3, primeiro turno (`historico.length === 0`): abertura
 *   DETERMINÍSTICA via `criarDecisaoAbertura` — nunca via classificador.
 * - Caso V3, demais turnos: uma única chamada a `classificarTurno`.
 *   `unknownClinical`/`reservedOrMeta` viram resposta DIRETA (sem chamar o
 *   gerador); `known`/`social` montam um `PatientZoneInput` REDUZIDO (só os
 *   fatos selecionados, ou nenhum, para `social`) antes de gerar.
 *
 * Em nenhum caminho V3 os demais fatos, ClinicalTruth, Examiner ou metadata
 * atravessam para o gerador — a única fronteira é a mesma whitelist do
 * Builder (Fase 1), aplicada aqui a um subconjunto dos fatos do caso.
 */

import type { Caso } from "@/lib/types";
import { criarPromptPaciente, montarPromptPacienteComBase } from "@/lib/prompts";
import { obterCasoV3PorId } from "@/data/casos-v3";
import { construirPatientSafeContext } from "@/lib/patient-v3/patientContextBuilder";
import { construirPromptBasePaciente } from "@/lib/patient-v3/promptBasePaciente";
import { criarDecisaoAbertura } from "@/lib/patient-v3/patientTurnGuard";
import { classificarTurno } from "@/lib/patient-v3/patientTurnClassifier";
import type { CasoV3, FatoPaciente, PatientKnowledge, PatientZoneInput } from "@/lib/patient-v3/casoV3.types";
import type {
  NonEmptyFactIds,
  PatientTurnClassifierInput,
  PatientTurnDecision,
  PatientTurnGuardResult,
} from "@/lib/patient-v3/patientTurnGuard.types";

export type PatientTextTurnResult =
  | {
      kind: "generate";
      prompt: string;
      /** Ausente para o caminho legado (não há decisão de Turn Guard nesse caminho). */
      decision?: PatientTurnDecision;
    }
  | {
      kind: "direct";
      response: string;
      decision: Extract<PatientTurnDecision, { kind: "unknownClinical" | "reservedOrMeta" }>;
    };

type HistoricoChat = Array<{ tipo: "estudante" | "paciente"; conteudo: string }>;

export interface PatientTurnTextInput {
  caso: Caso;
  mensagemAtual: string;
  historico: HistoricoChat;
}

export interface PatientTurnTextDeps {
  classificarTurno: (input: PatientTurnClassifierInput) => Promise<PatientTurnGuardResult>;
}

const DEPS_PADRAO: PatientTurnTextDeps = { classificarTurno };

const FRASES_UNKNOWN_CLINICAL = [
  "Não sei dizer isso com certeza.",
  "Não me lembro desse detalhe agora.",
  "Não consigo informar isso direito.",
] as const;

const FRASES_RESERVED_OR_META = [
  "Isso eu não saberia dizer, isso é com o médico.",
  "Não sei explicar isso, só sei como estou me sentindo.",
  "Não tenho como informar isso.",
] as const;

/** Escolhe uma frase de forma determinística a partir da mensagem — nunca aleatória. */
function escolherFraseDeterministica(mensagem: string, frases: readonly string[]): string {
  let soma = 0;
  for (let i = 0; i < mensagem.length; i++) soma += mensagem.charCodeAt(i);
  return frases[soma % frases.length];
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
 * Constrói um PatientZoneInput REDUZIDO: identidade/interlocutor/responsável/
 * persona/sessionStateInicial originais, mas `patientKnowledge.fatos` contém
 * SOMENTE `selectedFacts` — nunca os demais fatos do caso. `disclosurePolicy`
 * é filtrada para referenciar somente ids presentes em `selectedFacts`
 * (exigido pelo Builder, que rejeita regra/abertura apontando para fato
 * inexistente). Para `social`, chamar com `selectedFacts: []` produz
 * naturalmente zero regras e abertura vazia.
 */
function construirZoneInputReduzido(
  casoV3: CasoV3,
  selectedFacts: readonly FatoPaciente[]
): PatientZoneInput {
  const idsSelecionados = new Set(selectedFacts.map((f) => f.id));

  const patientKnowledge: PatientKnowledge = {
    identidade: casoV3.patientKnowledge.identidade,
    interlocutor: casoV3.patientKnowledge.interlocutor,
    fatos: [...selectedFacts],
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
 * Bloco final, exclusivo do turno "known" (FASE 4C.5) — substitui a antiga
 * DIRETIVA_KNOWN (Fase 4C.3B), que era concatenada à BASE, antes do histórico
 * e da mensagem atual (por isso podia ser dominada por uma leitura ambígua da
 * pergunta mais recente). Este bloco é concatenado DEPOIS da composição
 * completa (base + histórico + mensagem) — é a última informação do prompt —
 * e relista, com id/domínio/valor, exclusivamente os fatos já selecionados
 * pelo Turn Guard, para que esse significado resolvido prevaleça sobre
 * qualquer ambiguidade da mensagem original. NÃO faz parte do Prompt Base
 * global (promptBasePaciente.ts não é alterado).
 */
function construirAlvoClinico(selectedFacts: readonly FatoPaciente[]): string {
  const linhasFatos = selectedFacts
    .map((f) => {
      const incerto = f.incerto ? " incerto:true" : "";
      return `- id:"${f.id}" dominio:"${f.dominio}" valor:"${f.valor}"${incerto}`;
    })
    .join("\n");

  return `
ALVO CLÍNICO DESTE TURNO:
A mensagem atual já foi classificada como referente exclusivamente aos fatos abaixo. Se a mensagem admitir mais de uma interpretação, o significado destes fatos prevalece. Responda diretamente usando esses fatos e não acrescente informações não selecionadas.
${linhasFatos}`;
}

function gerarPromptComFatos(
  casoV3: CasoV3,
  selectedFacts: readonly FatoPaciente[],
  historico: HistoricoChat,
  mensagemAtual: string,
  incluirAlvoClinico: boolean
): string {
  const zoneInputReduzido = construirZoneInputReduzido(casoV3, selectedFacts);
  const baseReduzida = construirPromptBasePaciente(construirPatientSafeContext(zoneInputReduzido));
  const promptComposto = montarPromptPacienteComBase(baseReduzida, historico, mensagemAtual);
  return incluirAlvoClinico ? `${promptComposto}\n${construirAlvoClinico(selectedFacts)}` : promptComposto;
}

/**
 * Decide o que o turno de texto atual precisa: gerar (com uma base completa
 * ou reduzida) ou responder diretamente (sem chamar o gerador). Nunca lança —
 * erros do classificador já caem em fallback fechado dentro dele mesmo
 * (Fase 3.4D); erros de abertura (dado de caso inválido) são a única exceção
 * que propaga, por serem um erro de autoria, não de classificação não confiável.
 */
export async function prepararTurnoPacienteTexto(
  input: PatientTurnTextInput,
  deps: PatientTurnTextDeps = DEPS_PADRAO
): Promise<PatientTextTurnResult> {
  const { caso, mensagemAtual, historico } = input;

  const casoV3 = obterCasoV3PorId(caso.id);
  if (!casoV3) {
    // Caminho legado — intocado, nenhuma chamada ao classificador.
    return { kind: "generate", prompt: criarPromptPaciente(caso, historico, mensagemAtual) };
  }

  if (historico.length === 0) {
    // Primeiro turno — abertura determinística, nunca via classificador.
    const resultado = criarDecisaoAbertura({
      openingFactIds: paraFactIdsNaoVazio(casoV3.disclosurePolicy.aberturaFactIds),
      availableFacts: casoV3.patientKnowledge.fatos,
    });
    const prompt = gerarPromptComFatos(casoV3, resultado.selectedFacts, historico, mensagemAtual, false);
    return { kind: "generate", prompt, decision: resultado.decision };
  }

  // Demais turnos — uma única chamada ao classificador.
  const classifierInput: PatientTurnClassifierInput = {
    currentMessage: mensagemAtual,
    recentHistory: historico.map((h) => ({
      role: h.tipo === "estudante" ? ("estudante" as const) : ("paciente" as const),
      content: h.conteudo,
    })),
    availableFacts: casoV3.patientKnowledge.fatos,
  };
  // A dependência de produção (classificarTurno real) já falha fechado
  // internamente (Fase 3.4D) e nunca lança. Este try/catch é uma segunda
  // camada de defesa contra uma dependência INJETADA que se comporte mal
  // (ex.: em teste) — o resultado é idêntico ao fallback fechado do próprio
  // classificador, nunca uma exceção propagada nem os fatos completos.
  let resultado: PatientTurnGuardResult;
  try {
    resultado = await deps.classificarTurno(classifierInput);
  } catch {
    resultado = { decision: { kind: "unknownClinical" }, selectedFacts: [] };
  }

  if (resultado.decision.kind === "unknownClinical" || resultado.decision.kind === "reservedOrMeta") {
    const frases = resultado.decision.kind === "unknownClinical" ? FRASES_UNKNOWN_CLINICAL : FRASES_RESERVED_OR_META;
    return {
      kind: "direct",
      response: escolherFraseDeterministica(mensagemAtual, frases),
      decision: resultado.decision,
    };
  }

  // known ou social — known carrega selectedFacts não vazio; social é sempre [].
  const ehKnown = resultado.decision.kind === "known";
  const selectedFacts = ehKnown ? resultado.selectedFacts : [];
  const prompt = gerarPromptComFatos(casoV3, selectedFacts, historico, mensagemAtual, ehKnown);
  return { kind: "generate", prompt, decision: resultado.decision };
}
