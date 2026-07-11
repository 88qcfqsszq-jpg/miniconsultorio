// ============================================================================
// Casos OSCE Dinâmicos — Beta · REGISTRO DE CASOS
// ----------------------------------------------------------------------------
// Fonte única dos casos dinâmicos disponíveis no beta. Adicionar novos casos
// aqui. NÃO se mistura com data/casos-v2 (OSCE principal).
// ============================================================================

import type { DynamicCase } from "../types";
import { pilotoAsmaGraveAdulto } from "./piloto-asma-grave-adulto";
import { pneumotoraxHipertensivoAdulto } from "./pneumotorax-hipertensivo-adulto";

export const DYNAMIC_CASES: DynamicCase[] = [
  pilotoAsmaGraveAdulto,
  pneumotoraxHipertensivoAdulto,
];

export function getDynamicCase(caseId: string): DynamicCase | undefined {
  return DYNAMIC_CASES.find((c) => c.identificacao.caseId === caseId);
}
