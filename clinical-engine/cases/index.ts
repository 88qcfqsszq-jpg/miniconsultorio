// ============================================================================
// Clinical Engine — Registro dos Casos Canônicos
// ----------------------------------------------------------------------------
// Barrel + registro por id legado / canonicalId. Ainda NÃO conectado ao fluxo
// real (nada importa daqui em produção). Puro, aditivo.
// ============================================================================

import type { CanonicalCase } from "../types/canonical-case";
import { CANONICAL_PAC } from "./pac";
import { CANONICAL_ASMA } from "./asma";
import { CANONICAL_DPOC } from "./dpoc";
import { CANONICAL_INSUFICIENCIA_CARDIACA } from "./insuficiencia-cardiaca";
import { CANONICAL_SINDROME_CORONARIANA } from "./sindrome-coronariana";
import { CANONICAL_TEP } from "./tep";

export {
  CANONICAL_PAC,
  CANONICAL_ASMA,
  CANONICAL_DPOC,
  CANONICAL_INSUFICIENCIA_CARDIACA,
  CANONICAL_SINDROME_CORONARIANA,
  CANONICAL_TEP,
};

/** Todos os casos canônicos disponíveis. */
export const CANONICAL_CASES: CanonicalCase[] = [
  CANONICAL_PAC,
  CANONICAL_ASMA,
  CANONICAL_DPOC,
  CANONICAL_INSUFICIENCIA_CARDIACA,
  CANONICAL_SINDROME_CORONARIANA,
  CANONICAL_TEP,
];

/** Índice por canonicalId (ex.: "pac"). */
export const CANONICAL_BY_ID: Record<string, CanonicalCase> = Object.fromEntries(
  CANONICAL_CASES.map((c) => [c.identificacao.canonicalId, c])
);

/** Índice por id do caso legado (ex.: 2). */
export const CANONICAL_BY_LEGACY_ID: Record<string, CanonicalCase> = Object.fromEntries(
  CANONICAL_CASES.map((c) => [String(c.identificacao.legacyId), c])
);

/** Busca um caso canônico pelo id legado. */
export function obterCanonicalPorLegacyId(id: number | string): CanonicalCase | undefined {
  return CANONICAL_BY_LEGACY_ID[String(id)];
}
