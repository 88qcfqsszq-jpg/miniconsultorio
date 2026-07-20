/**
 * MEDIX PATIENT V3 — Núcleo compartilhado de composição segura por turno
 * (FASE 4D.2).
 *
 * Funções PURAS e determinísticas, extraídas de patientTurnText.ts (Fase 4B)
 * para serem reutilizadas tanto pelo chat de TEXTO quanto pelo futuro endpoint
 * Turn Guard do REALTIME, sem duplicar a representação clínica nem a
 * filtragem de disclosure. Nenhuma função aqui chama rede, React, HTTP ou o
 * classificador — apenas transforma dados já resolvidos (CasoV3 +
 * selectedFacts) em texto ou estruturas seguras.
 *
 * Nenhuma destas funções conhece ClinicalTruth/Examiner/metadata — a mesma
 * fronteira de whitelist do Builder (Fase 1) é a única fonte de verdade.
 */

import { construirPatientSafeContext } from "@/lib/patient-v3/patientContextBuilder";
import { construirPromptBasePaciente } from "@/lib/patient-v3/promptBasePaciente";
import type {
  CasoV3,
  FatoPaciente,
  PatientKnowledge,
  PatientZoneInput,
} from "@/lib/patient-v3/casoV3.types";

// ============================================================================
// 1. CONTEXTO REDUZIDO DO TURNO
// ============================================================================

/**
 * Constrói um PatientZoneInput REDUZIDO: identidade/interlocutor/responsável/
 * persona/sessionStateInicial originais, mas `patientKnowledge.fatos` contém
 * SOMENTE `selectedFacts` — nunca os demais fatos do caso. `disclosurePolicy`
 * é filtrada para referenciar somente ids presentes em `selectedFacts`
 * (exigido pelo Builder, que rejeita regra/abertura apontando para fato
 * inexistente). Para `social`, chamar com `selectedFacts: []` produz
 * naturalmente zero regras e abertura vazia.
 */
export function construirZoneInputReduzido(
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

// ============================================================================
// 2. BASE COM SOMENTE OS FATOS SELECIONADOS (Builder + Prompt Base)
// ============================================================================

/**
 * Aplica o Builder (Fase 1) e o Prompt Base (Fase 1) a um contexto reduzido
 * exclusivamente aos `selectedFacts` deste turno. Nem o Builder nem o Prompt
 * Base global são alterados — esta função só os invoca com um
 * PatientZoneInput reduzido.
 */
export function construirBaseReduzida(casoV3: CasoV3, selectedFacts: readonly FatoPaciente[]): string {
  const zoneInputReduzido = construirZoneInputReduzido(casoV3, selectedFacts);
  return construirPromptBasePaciente(construirPatientSafeContext(zoneInputReduzido));
}

// ============================================================================
// 3. BLOCO "ALVO CLÍNICO" (known)
// ============================================================================

/**
 * Bloco final, exclusivo do turno "known" (FASE 4C.5) — concatenado DEPOIS de
 * toda a composição do turno (é a última informação lida), relistando,
 * com id/domínio/valor, exclusivamente os fatos já selecionados pelo Turn
 * Guard, para que esse significado resolvido prevaleça sobre qualquer
 * ambiguidade da mensagem original.
 */
export function construirAlvoClinico(selectedFacts: readonly FatoPaciente[]): string {
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

// ============================================================================
// 4-5. RESPOSTAS DETERMINÍSTICAS (unknownClinical / reservedOrMeta)
// ============================================================================

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

/** Resposta determinística (nunca aleatória) para decisionKind "unknownClinical". */
export function escolherRespostaUnknownClinical(mensagem: string): string {
  return escolherFraseDeterministica(mensagem, FRASES_UNKNOWN_CLINICAL);
}

/** Resposta determinística (nunca aleatória) para decisionKind "reservedOrMeta". */
export function escolherRespostaReservedOrMeta(mensagem: string): string {
  return escolherFraseDeterministica(mensagem, FRASES_RESERVED_OR_META);
}
