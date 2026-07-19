/**
 * MEDIX PATIENT V3 — Patient Turn Guard V1: tipos e contratos (FASE 3.4B).
 *
 * SOMENTE tipos — nenhuma função de runtime, nenhum classificador, nenhuma
 * chamada externa. Deliberadamente separado do schema clínico congelado
 * (casoV3.types.ts): o Turn Guard é a PRIMEIRA CAMADA ESTRUTURAL DE CONTENÇÃO
 * (reduz o contexto clínico disponível ao gerador por turno), não uma garantia
 * final de mundo fechado — a validação comportamental real continua sendo a
 * prova de que a invenção foi de fato reduzida.
 *
 * Limitações explícitas desta versão:
 * - a seleção de fatos reduz o contexto, mas não impede logicamente que um
 *   modelo generativo invente conteúdo a partir do que recebe;
 * - PatientTurnDecision nunca transporta texto de resposta, diagnóstico,
 *   confiança numérica ou justificativa narrativa do classificador;
 * - a validação determinística (bruto → PatientTurnDecision) é implementada
 *   em microfase posterior; aqui só o contrato é definido;
 * - falhas do classificador (indisponibilidade, timeout, saída inválida, id
 *   inexistente) devem resultar em fallback fechado — nunca em enviar todos
 *   os fatos ao gerador;
 * - este arquivo não altera CasoV3, PatientKnowledge, DisclosurePolicy nem
 *   qualquer bloco do schema V1.2/3.2.
 */

import type { FatoPaciente } from "@/lib/patient-v3/casoV3.types";

// ============================================================================
// 1. IDS NÃO VAZIOS
// ============================================================================

/** Lista de ids não vazia — usada onde o contrato exige ao menos um factId. */
export type NonEmptyFactIds = readonly [string, ...string[]];

/** Lista de fatos selecionados não vazia — usada onde o contrato exige ao menos um FatoPaciente. */
export type NonEmptySelectedFacts = readonly [FatoPaciente, ...FatoPaciente[]];

// ============================================================================
// 2. CATEGORIAS CLASSIFICÁVEIS (sem "opening" — abertura é determinística)
// ============================================================================

export type PatientTurnClassifierKind =
  | "known"
  | "unknownClinical"
  | "reservedOrMeta"
  | "social";

// ============================================================================
// 3. SAÍDA BRUTA DO CLASSIFICADOR (antes de validar)
// ============================================================================

/**
 * Forma esperada da saída externa do classificador, ANTES de qualquer
 * validação. `factIds` é `string[]` deliberadamente solto aqui — pode conter
 * ids inexistentes, vazios ou sobrando; a validação (microfase posterior)
 * decide o que vira PatientTurnDecision e o que vira fallback fechado.
 */
export interface PatientTurnClassifierOutput {
  kind: PatientTurnClassifierKind;
  factIds: string[];
}

// ============================================================================
// 4. DECISÃO VALIDADA — união discriminada
// ============================================================================

/**
 * Decisão já validada. Categorias sem fatos NÃO possuem o campo `factIds`
 * (nem mesmo `[]`) — um objeto como { kind: "social", factIds: [...] } não
 * satisfaz este tipo, tornando esse estado inválido impossível de representar.
 */
export type PatientTurnDecision =
  | { kind: "opening"; factIds: NonEmptyFactIds }
  | { kind: "known"; factIds: NonEmptyFactIds }
  | { kind: "unknownClinical" }
  | { kind: "reservedOrMeta" }
  | { kind: "social" };

// ============================================================================
// 5. HISTÓRICO DO CLASSIFICADOR (contexto conversacional, não fonte de verdade)
// ============================================================================

export type PatientTurnHistoryRole = "estudante" | "paciente";

export interface PatientTurnHistoryItem {
  role: PatientTurnHistoryRole;
  content: string;
}

// ============================================================================
// 6. ENTRADA DO CLASSIFICADOR
// ============================================================================

/**
 * Entrada do classificador de turno. Deliberadamente restrita: só a mensagem
 * atual, histórico recente mínimo e os FatoPaciente disponíveis — nunca
 * PatientKnowledge/Persona/SessionStateInicial/DisclosurePolicy completos, e
 * nunca ClinicalTruth/Examiner/CasoV3. `revealedFactIds` fica de fora desta
 * versão — a necessidade será avaliada após a primeira integração comportamental.
 */
export interface PatientTurnClassifierInput {
  currentMessage: string;
  recentHistory: readonly PatientTurnHistoryItem[];
  availableFacts: readonly FatoPaciente[];
}

// ============================================================================
// 7. ENTRADA DA ABERTURA (determinística, nunca via classificador)
// ============================================================================

export interface PatientTurnOpeningInput {
  openingFactIds: NonEmptyFactIds;
  availableFacts: readonly FatoPaciente[];
}

// ============================================================================
// 8. RESULTADO FECHADO DO GUARD (tipo apenas — sem função de runtime)
// ============================================================================

/**
 * Resultado operacional do Guard: `opening`/`known` exigem ao menos um fato
 * efetivamente selecionado (NonEmptySelectedFacts) — uma decisão não vazia
 * (factIds não vazio) nunca pode coexistir com um resultado de contexto vazio.
 * As três categorias fechadas exigem `selectedFacts: []` (tupla vazia fixa) —
 * nunca os 25 fatos como fallback implícito.
 */
export type PatientTurnGuardResult =
  | {
      decision: Extract<PatientTurnDecision, { kind: "opening" | "known" }>;
      selectedFacts: NonEmptySelectedFacts;
    }
  | {
      decision: Extract<
        PatientTurnDecision,
        { kind: "unknownClinical" | "reservedOrMeta" | "social" }
      >;
      selectedFacts: readonly [];
    };
