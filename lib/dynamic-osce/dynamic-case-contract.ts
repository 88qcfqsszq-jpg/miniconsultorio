// ============================================================================
// Casos OSCE Dinâmicos — Beta · CONTRATO DE CASO (Fase 2)
// ----------------------------------------------------------------------------
// Formato, limites, acessores de UI e resolvedor de caminhos (para as
// referenciasCaso das rubricas). Sem lógica de simulação.
// ============================================================================

import type { DynamicCase, Intervention, InterventionId, PatientState } from "./types";
import { listarIntervencoes } from "./dynamic-intervention-engine";

/** Grupos obrigatórios de topo de um caso dinâmico. */
export const GRUPOS_OBRIGATORIOS_CASO: Array<keyof DynamicCase> = [
  "identificacao",
  "paciente",
  "diagnostico",
  "fisiologia",
  "comunicacao",
  "anamnese",
  "exameFisico",
  "exames",
  "intervencoes",
  "reavaliacao",
  "errosCriticos",
  "simulacao",
  "rubricaId",
];

/** Faixas fisiológicas plausíveis usadas pelos validadores (não clínicas rígidas). */
export const LIMITES_VITAIS = {
  fc: { min: 30, max: 220 },
  fr: { min: 6, max: 70 },
  paSys: { min: 50, max: 260 },
  paDia: { min: 30, max: 160 },
  spo2: { min: 40, max: 100 },
  temp: { min: 30, max: 43 },
} as const;

/** Verifica se um objeto tem a forma mínima de PatientState. */
export function ehPatientState(x: unknown): x is PatientState {
  if (!x || typeof x !== "object") return false;
  const s = x as any;
  return (
    s.vitals &&
    typeof s.vitals.fc === "number" &&
    typeof s.vitals.fr === "number" &&
    typeof s.vitals.spo2 === "number" &&
    s.clinical &&
    typeof s.broncoespasmo === "number" &&
    typeof s.oxigenioSuplementar === "boolean"
  );
}

// ---- Acessores de UI (fonte única = contrato nested) -----------------------

export function checklistComunicacao(caso: DynamicCase): string[] {
  return caso.comunicacao.itensEsperados;
}

export function checklistAnamnese(caso: DynamicCase): string[] {
  return [...caso.anamnese.perguntasObrigatorias, ...caso.anamnese.perguntasImportantes];
}

export function checklistExameFisico(caso: DynamicCase): string[] {
  return caso.exameFisico.manobrasObrigatorias;
}

export function checklistExames(caso: DynamicCase): string[] {
  return [...caso.exames.examesEssenciais, ...caso.exames.examesComplementaresAceitos];
}

/** Intervenções exibidas no runner: essenciais + aceitas + resgate (sem duplicar). */
export function intervencoesDoCaso(caso: DynamicCase): Intervention[] {
  const ids = Array.from(
    new Set<InterventionId>([
      ...caso.intervencoes.intervencoesEssenciais,
      ...caso.intervencoes.intervencoesAceitas,
      ...caso.intervencoes.intervencoesDeResgate,
    ])
  );
  return listarIntervencoes(ids);
}

// ---- Resolvedor de caminho (dot-path) para referenciasCaso -----------------

/**
 * Resolve um caminho "a.b.c" dentro do caso. Retorna o valor ou undefined.
 * Usado pelos validadores para conferir que cada critério da rubrica aponta
 * para um campo REAL e não vazio do caso.
 */
export function resolveCaseField(caso: DynamicCase, path: string): unknown {
  return path.split(".").reduce<any>((acc, seg) => (acc == null ? acc : acc[seg]), caso);
}

/** True se o caminho existir e não estiver vazio (string/array/objeto). */
export function referenciaCasoValida(caso: DynamicCase, path: string): boolean {
  const v = resolveCaseField(caso, path);
  if (v == null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.keys(v).length > 0;
  return true; // number/boolean são considerados presentes
}

/**
 * Contrato resumido (documental) — o que um caso dinâmico promete ao motor:
 * 1. fisiologia.estadoInicial é um PatientState completo e dentro de LIMITES_VITAIS;
 * 2. intervencoes.* referenciam InterventionId conhecidos do motor;
 * 3. rubricaId aponta para uma rubrica registrada em dynamic-rubric-link;
 * 4. simulacao.simulationProvider = 'medix-rule-based' nesta fase (Pulse depois).
 */
export const CONTRATO_CASO_DINAMICO = {
  versao: "beta-2",
  providerPadrao: "medix-rule-based" as const,
  descricao:
    "Caso clínico com evolução fisiológica reagindo a intervenções, avaliado por rubrica dinâmica própria (isolada do OSCE principal), com contrato forte para casos e rubricas.",
};
