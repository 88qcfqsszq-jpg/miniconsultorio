/**
 * MEDIX PATIENT V3 — Patient Turn Guard V1: validação determinística (FASE 3.4C).
 *
 * Funções PURAS, síncronas, sem OpenAI e sem rede. Não classificam nada — a
 * categoria/ids já chegam prontos (da aplicação, para abertura; de um futuro
 * classificador, para os demais turnos). Este arquivo só garante que o
 * resultado final nunca escapa do contrato fechado de patientTurnGuard.types.ts.
 *
 * Abertura: qualquer violação LANÇA PatientTurnOpeningValidationError — nunca
 * cai em fallback (um fallback silencioso ali equivaleria a uma abertura
 * vazia/quebrada, e a abertura é determinística, não uma saída de classificador
 * não confiável).
 *
 * Saída do classificador: qualquer violação cai em fallback FECHADO
 * ({ kind: "unknownClinical" }, selectedFacts: []) — nunca lança, nunca
 * retorna os fatos disponíveis como fallback implícito.
 */

import type { FatoPaciente } from "@/lib/patient-v3/casoV3.types";
import type {
  NonEmptyFactIds,
  NonEmptySelectedFacts,
  PatientTurnClassifierOutput,
  PatientTurnGuardResult,
  PatientTurnOpeningInput,
} from "@/lib/patient-v3/patientTurnGuard.types";

/** Erro de validação exclusivo da abertura — nunca é capturado internamente aqui. */
export class PatientTurnOpeningValidationError extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "PatientTurnOpeningValidationError";
  }
}

const KINDS_VALIDOS = ["known", "unknownClinical", "reservedOrMeta", "social"] as const;

const MAXIMO_IDS_KNOWN = 6;

const RESULTADO_FALLBACK_FECHADO: PatientTurnGuardResult = {
  decision: { kind: "unknownClinical" },
  selectedFacts: [],
};

function construirMapaFatos(availableFacts: readonly FatoPaciente[]): Map<string, FatoPaciente> {
  const mapa = new Map<string, FatoPaciente>();
  for (const fato of availableFacts) mapa.set(fato.id, fato);
  return mapa;
}

function temIdsDuplicados(ids: readonly string[]): boolean {
  return new Set(ids).size !== ids.length;
}

/** Converte um array (já comprovadamente não vazio) numa tupla NonEmptyFactIds, sem cast. */
function paraFactIdsNaoVazio(ids: readonly string[]): NonEmptyFactIds {
  const [primeiro, ...resto] = ids;
  return [primeiro, ...resto];
}

/** Converte um array (já comprovadamente não vazio) numa tupla NonEmptySelectedFacts, sem cast. */
function paraFatosNaoVazio(fatos: readonly FatoPaciente[]): NonEmptySelectedFacts {
  const [primeiro, ...resto] = fatos;
  return [primeiro, ...resto];
}

/**
 * Constrói a decisão determinística de abertura. openingFactIds já é
 * NonEmptyFactIds pelo contrato de entrada — ainda assim, duplicatas e
 * existência em availableFacts são validadas em runtime (a garantia de tipo
 * não impede um chamador de montar a lista incorretamente).
 */
export function criarDecisaoAbertura(input: PatientTurnOpeningInput): PatientTurnGuardResult {
  const { openingFactIds, availableFacts } = input;

  if (openingFactIds.length === 0) {
    throw new PatientTurnOpeningValidationError("openingFactIds não pode ser vazio.");
  }
  if (temIdsDuplicados(openingFactIds)) {
    throw new PatientTurnOpeningValidationError("openingFactIds contém id duplicado.");
  }

  const mapaFatos = construirMapaFatos(availableFacts);
  const fatosSelecionados: FatoPaciente[] = [];
  for (const id of openingFactIds) {
    const fato = mapaFatos.get(id);
    if (!fato) {
      throw new PatientTurnOpeningValidationError(`openingFactIds referencia id inexistente: "${id}".`);
    }
    fatosSelecionados.push(fato);
  }

  return {
    decision: { kind: "opening", factIds: paraFactIdsNaoVazio(openingFactIds) },
    selectedFacts: paraFatosNaoVazio(fatosSelecionados),
  };
}

/**
 * Valida a saída BRUTA do classificador e devolve sempre um resultado
 * fechado. Qualquer violação (kind inválido, factIds fora de regra, id
 * inexistente) cai em fallback fechado — nunca lança, nunca retorna
 * availableFacts inteiro.
 */
export function validarSaidaClassificador(
  output: PatientTurnClassifierOutput,
  availableFacts: readonly FatoPaciente[]
): PatientTurnGuardResult {
  if (!KINDS_VALIDOS.includes(output.kind)) {
    return RESULTADO_FALLBACK_FECHADO;
  }

  if (output.kind !== "known") {
    if (output.factIds.length > 0) {
      return RESULTADO_FALLBACK_FECHADO;
    }
    return { decision: { kind: output.kind }, selectedFacts: [] };
  }

  const { factIds } = output;
  if (factIds.length === 0 || factIds.length > MAXIMO_IDS_KNOWN || temIdsDuplicados(factIds)) {
    return RESULTADO_FALLBACK_FECHADO;
  }

  const mapaFatos = construirMapaFatos(availableFacts);
  const fatosSelecionados: FatoPaciente[] = [];
  for (const id of factIds) {
    const fato = mapaFatos.get(id);
    if (!fato) {
      return RESULTADO_FALLBACK_FECHADO;
    }
    fatosSelecionados.push(fato);
  }

  return {
    decision: { kind: "known", factIds: paraFactIdsNaoVazio(factIds) },
    selectedFacts: paraFatosNaoVazio(fatosSelecionados),
  };
}
