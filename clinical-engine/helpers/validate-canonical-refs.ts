// ============================================================================
// Clinical Engine — Validador de referências dos Casos Canônicos ↔ Knowledge Graph
// ----------------------------------------------------------------------------
// Percorre todos os casos canônicos e verifica se cada id em `refs.*` e nos
// campos de bloco (examRef/imageRef/soundRef) existe no KNOWLEDGE_REGISTRY.
// Puro, sem runtime, sem IA. Não conecta a nada.
// ============================================================================

import type { CanonicalCase, CanonicalKnowledgeRefs } from "../types/canonical-case";
import { CANONICAL_CASES } from "../cases";
import { KNOWLEDGE_BY_ID } from "../knowledge/registry";

export interface RefQuebrada {
  casoId: number | string;
  canonicalId: string;
  origem: string; // ex.: "refs.symptomRefs", "ausculta.pulmonar.soundRef"
  id: string;
}

export interface ValidacaoCaso {
  canonicalId: string;
  legacyId: number | string;
  totalRefs: number;
  refsQuebradas: RefQuebrada[];
  temGuideline: boolean;
  temFlow: boolean;
  temSoundRef: boolean;
  auscultaPatologica: boolean;
  conectado100: boolean;
}

export interface ResultadoValidacao {
  casos: ValidacaoCaso[];
  refsQuebradas: RefQuebrada[];
  casosSemRefs: string[];
  diagnosticosSemGuideline: string[];
  casosSemFlow: string[];
  casosSemSoundComAuscultaPatologica: string[];
  totalCasos: number;
  conectados100: number;
  ok: boolean;
}

function coletarRefsTopo(refs: CanonicalKnowledgeRefs | undefined): Array<{ origem: string; id: string }> {
  const out: Array<{ origem: string; id: string }> = [];
  if (!refs) return out;
  const chaves = Object.keys(refs) as (keyof CanonicalKnowledgeRefs)[];
  for (const k of chaves) {
    const lista = refs[k];
    if (Array.isArray(lista)) for (const id of lista) out.push({ origem: `refs.${k}`, id });
  }
  return out;
}

function coletarRefsBloco(caso: CanonicalCase): Array<{ origem: string; id: string }> {
  const out: Array<{ origem: string; id: string }> = [];
  caso.exames?.forEach((e, i) => { if (e.examRef) out.push({ origem: `exames[${i}].examRef`, id: e.examRef }); });
  caso.imagens?.forEach((im, i) => { if (im.imageRef) out.push({ origem: `imagens[${i}].imageRef`, id: im.imageRef }); });
  if (caso.ausculta?.pulmonar?.soundRef) out.push({ origem: "ausculta.pulmonar.soundRef", id: caso.ausculta.pulmonar.soundRef });
  if (caso.ausculta?.cardiaca?.soundRef) out.push({ origem: "ausculta.cardiaca.soundRef", id: caso.ausculta.cardiaca.soundRef });
  return out;
}

/** Refs pedagógicas (Fase 7): teachingRefs.* + pitfall/differential/clinicalReasoning. */
function coletarRefsPedagogicas(caso: CanonicalCase): Array<{ origem: string; id: string }> {
  const out: Array<{ origem: string; id: string }> = [];
  const t = caso.teachingRefs;
  if (t) {
    for (const k of Object.keys(t) as (keyof NonNullable<CanonicalCase["teachingRefs"]>)[]) {
      const lista = t[k];
      if (Array.isArray(lista)) for (const id of lista) out.push({ origem: `teachingRefs.${k}`, id });
    }
  }
  for (const id of caso.pitfallRefs ?? []) out.push({ origem: "pitfallRefs", id });
  for (const id of caso.differentialRefs ?? []) out.push({ origem: "differentialRefs", id });
  for (const id of caso.clinicalReasoningRefs ?? []) out.push({ origem: "clinicalReasoningRefs", id });
  return out;
}

export function validarCasoCanonical(caso: CanonicalCase): ValidacaoCaso {
  const topo = coletarRefsTopo(caso.refs);
  const bloco = coletarRefsBloco(caso);
  const pedagogicas = coletarRefsPedagogicas(caso);
  const todas = [...topo, ...bloco, ...pedagogicas];

  const quebradas: RefQuebrada[] = todas
    .filter((r) => !KNOWLEDGE_BY_ID[r.id])
    .map((r) => ({ casoId: caso.identificacao.legacyId, canonicalId: caso.identificacao.canonicalId, origem: r.origem, id: r.id }));

  const temGuideline = (caso.refs?.guidelineRefs?.length ?? 0) > 0;
  const temFlow = (caso.refs?.flowRefs?.length ?? 0) > 0;
  const temSoundRef =
    (caso.refs?.soundRefs?.length ?? 0) > 0 ||
    !!caso.ausculta?.pulmonar?.soundRef ||
    !!caso.ausculta?.cardiaca?.soundRef;
  const auscultaPatologica = !!caso.ausculta?.pulmonar?.presente || !!caso.ausculta?.cardiaca?.presente;

  const conectado100 =
    quebradas.length === 0 && todas.length > 0 && temGuideline && temFlow &&
    (!auscultaPatologica || temSoundRef);

  return {
    canonicalId: caso.identificacao.canonicalId,
    legacyId: caso.identificacao.legacyId,
    totalRefs: todas.length,
    refsQuebradas: quebradas,
    temGuideline,
    temFlow,
    temSoundRef,
    auscultaPatologica,
    conectado100,
  };
}

export function validarCanonicalRefs(casos: CanonicalCase[] = CANONICAL_CASES): ResultadoValidacao {
  const resultados = casos.map(validarCasoCanonical);
  const refsQuebradas = resultados.flatMap((r) => r.refsQuebradas);
  const casosSemRefs = resultados.filter((r) => r.totalRefs === 0).map((r) => r.canonicalId);
  const diagnosticosSemGuideline = resultados.filter((r) => !r.temGuideline).map((r) => r.canonicalId);
  const casosSemFlow = resultados.filter((r) => !r.temFlow).map((r) => r.canonicalId);
  const casosSemSoundComAuscultaPatologica = resultados
    .filter((r) => r.auscultaPatologica && !r.temSoundRef)
    .map((r) => r.canonicalId);
  const conectados100 = resultados.filter((r) => r.conectado100).length;

  return {
    casos: resultados,
    refsQuebradas,
    casosSemRefs,
    diagnosticosSemGuideline,
    casosSemFlow,
    casosSemSoundComAuscultaPatologica,
    totalCasos: resultados.length,
    conectados100,
    ok: refsQuebradas.length === 0,
  };
}
