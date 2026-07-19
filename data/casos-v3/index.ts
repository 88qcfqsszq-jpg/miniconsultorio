/**
 * MEDIX PATIENT V3 — Registro isolado de casos nativos V3 (Fase 2B).
 *
 * Responsabilidade única: registrar os CasoV3 nativos disponíveis e localizar
 * um deles por id. NÃO importa nem expõe casos legados (data/casos-v2 não é
 * referenciado aqui). Nenhum fluxo funcional atual consome este arquivo —
 * nenhum wiring foi feito nesta fase.
 *
 * `id` já é `string` em toda a base (Caso legado, CasoOSCEV2 e CasoV3.metadata.id
 * — confirmado antes da autoria); nenhuma normalização adicional é necessária.
 */

import type { CasoV3 } from "@/lib/patient-v3/casoV3.types";
import { casoSCAOuroV3 } from "@/data/casos-v3/001-sca-ouro";

/** Registro isolado — nesta fase contém somente o Caso Ouro SCA. */
const registroCasosV3: ReadonlyMap<string, CasoV3> = new Map([
  [casoSCAOuroV3.metadata.id, casoSCAOuroV3],
]);

/** Localiza um CasoV3 nativo pelo id (mesmo id usado pelo caso legado correspondente). */
export function obterCasoV3PorId(id: string): CasoV3 | null {
  return registroCasosV3.get(id) ?? null;
}
