/**
 * Mapeamento de PRESET DE ECG por ID DE CASO (resolução específica).
 *
 * Prioridade mais alta que tema/diagnóstico genérico — usado quando o achado
 * de ECG do caso (campo `resultado`/`interpretacao` em `exames[]`) exige um
 * território/padrão específico que o mapeamento genérico por tema não
 * consegue distinguir (ex.: dois casos com tema "Dor Torácica" mas infartos
 * de paredes diferentes).
 *
 * Cada entrada documenta a EVIDÊNCIA (achado textual do próprio caso) que
 * sustenta o preset escolhido. Não adivinhar: casos sem achado de ECG claro
 * o suficiente para um preset específico ficam DE FORA deste mapa de
 * propósito, e caem no nível seguinte (diagnóstico → tema → idade).
 *
 * IMPORTANTE (regra de segurança por idade): nunca mapear um caso adulto
 * para um preset com `ageGroup !== 'adulto'`, nem um caso pediátrico para
 * um preset adulto. Ex.: o preset `pericardite_aguda_pediatrica` (sistema
 * legado) só é usado para o caso pediátrico ped-09 — NÃO para o caso adulto
 * "7" (Pericardite Aguda), que fica sem preset específico até existir uma
 * versão adulta.
 */

export const ECG_PRESET_BY_CASE_ID: Record<string, string> = {
  // ── Caso 1 — SCA/IAMCSST ────────────────────────────────────────────────
  // Evidência (001-…ts:130-132): "Elevação do segmento ST em D2, D3, aVF" →
  // "Infarto Agudo do Miocárdio Inferior". Território INFERIOR, não
  // anterosseptal — usa o preset criado nesta rodada (FASE 3).
  "1": "iam_inferior",

  // ── Caso 20 — IAMCSST anterior, necessidade de trombólise ──────────────
  // Evidência (020-…ts:113-115): "Elevação de ST >3mm em V1-V3, depressão
  // recíproca em D2,D3,aVF" → "IAMCSST anterior". Território ANTEROSSEPTAL
  // — corresponde exatamente ao preset existente.
  "20": "iam_supra_anterosseptal",

  // ── Caso 58 — IAM em síndrome metabólica ────────────────────────────────
  // Evidência (058-…ts:103-105): "ST elevado em V1-V4 (IAM anterior)".
  // Território anterior; preset existente (V1-V3) é a melhor aproximação
  // disponível — V4 não é modelado pelo gerador atual (gap documentado).
  "58": "iam_supra_anterosseptal",

  // ── ped-09 — Pericardite aguda, menino de 12 anos ───────────────────────
  // Único preset de pericardite disponível está no sistema legado
  // (lib/ecg/padroesECG.ts) e é rotulado para faixa pediátrica — coerente
  // com a idade real do caso (12 anos). NÃO usar em casos adultos.
  "ped-09": "pericardite_aguda_pediatrica",
};

/**
 * Resolve o preset mapeado especificamente para o ID do caso, se existir.
 * Retorna `undefined` quando não há entrada — o chamador deve seguir para o
 * próximo nível de resolução (diagnóstico → tema → idade).
 */
export function resolveECGPresetByCaseId(casoId: unknown): string | undefined {
  const id = String(casoId ?? "").trim();
  if (!id) return undefined;
  return ECG_PRESET_BY_CASE_ID[id];
}
