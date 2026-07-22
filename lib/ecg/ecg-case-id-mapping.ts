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
  // MICROETAPA ECG-2: preset dedicado V1-V4 criado (antes usava o
  // anterosseptal V1-V3 como aproximação). Caso 20 permanece em V1-V3.
  "58": "iam_supra_anterosseptal_v1_v4",

  // ── ped-09 — Pericardite aguda, menino de 12 anos ───────────────────────
  // CORREÇÃO (achada durante a MICROETAPA ECG-2, ao testar generateECG() de
  // ponta a ponta, não só a resolução): a entrada anterior apontava para
  // "pericardite_aguda_pediatrica", um ID que só existe no sistema LEGADO
  // (lib/ecg/padroesECG.ts) e não está em ALL_ECG_PRESETS nem em
  // LEGACY_ID_MAP (src/services/ecgGenerator/presets/index.ts) — generateECG()
  // lança `Preset ECG não encontrado` ao tentar gerar o traçado real (erro
  // confirmado em runtime, não hipotético). Revertido para o fallback seguro
  // por idade (normal_escolar/adolescente) até existir uma versão de
  // pericardite pediátrica no sistema NOVO de presets (fora do escopo desta
  // rodada, que cobre só os casos 7/8/18/19/58 — registrado como pendência).
  // "ped-09": preset pediátrico de pericardite ainda não existe no sistema novo.

  // ── Caso 7 — Pericardite Aguda (adulto) — MICROETAPA ECG-2 ─────────────
  // Evidência (007-…ts:107,109): "Elevação difusa de ST com concavidade,
  // sem ondas Q patológicas" → "Padrão típico de pericardite aguda".
  // Preset adulto dedicado (categoria própria 'inflamatoria', não reutiliza
  // pericardite_aguda_pediatrica). Depressão de PR não modelada (limitação
  // documentada no próprio preset — gerador não suporta prShift por derivação).
  "7": "pericardite_aguda_adulto",

  // ── Caso 18 — IAM sem supra de ST — MICROETAPA ECG-2 ────────────────────
  // Evidência (018-…ts:113,115): "Infradesnivelamento de ST 2-3mm em D2, D3,
  // aVF; inversão de onda T" → "Isquemia inferior, sem supra persistente".
  "18": "isquemia_subendocardica",

  // ── Caso 19 — Angina Instável — MICROETAPA ECG-2 ────────────────────────
  // Evidência (019-…ts:112,114): "Inversão de onda T em D2, D3, aVF;
  // segmento ST no nível ou levemente deprimido" → "Isquemia inferolateral
  // sem supra". Preset PRÓPRIO, não reaproveita isquemia_subendocardica do
  // caso 18 (achado central diferente: T invertida domina, ST só mínimo).
  "19": "isquemia_inversao_t",

  // ── Caso 8 — NÃO MAPEADO (bloqueado por limitação do gerador) ──────────
  // Evidência (008-…ts:113): "Ritmo sinusal, taquicardia, complexo QRS
  // alargado (140ms), onda T negativa em lateral" → sugere Bloqueio de Ramo
  // Esquerdo. NÃO mapeado: `qrsDurationMs` do preset não é lido em nenhum
  // lugar do pipeline de síntese (confirmado por grep em
  // src/services/ecgGenerator/index.ts — só heartRate/rrVariability/
  // morphology/ageGroup são usados) — ou seja, o campo é puro metadado, sem
  // efeito no traçado renderizado. Sem alargamento real do QRS, um preset de
  // "BRE" não seria visualmente reconhecível como bloqueio de ramo (só
  // amplitudes diferentes, mesma largura). Mapear aqui seria fabricar um
  // achado central que o gerador não consegue mostrar. Caso 8 permanece no
  // fallback existente (diagnóstico→idade, normal_adulto contextualizado).
  // Capacidade a adicionar ao gerador: consumir `qrsDurationMs` (ou um novo
  // campo por-derivação `qrsWidthMs`) no pipeline ECGSyn para alargar de
  // fato o complexo QRS renderizado.
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
