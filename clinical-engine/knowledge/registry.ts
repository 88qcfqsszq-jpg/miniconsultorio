// ============================================================================
// Clinical Knowledge Graph — REGISTRY (Fase 5)
// ----------------------------------------------------------------------------
// Fonte única que agrega TODOS os nós de conhecimento + índices (por id, slug,
// categoria, tag). Puro, sem runtime, sem IA. Não conecta a nada.
// ============================================================================

import type { KnowledgeCategory, KnowledgeNode } from "./types/knowledge";

import { SYMPTOMS } from "./symptoms";
import { PHYSICAL_FINDINGS } from "./physical-exam";
import { LUNG_SOUNDS } from "./lung-sounds";
import { HEART_SOUNDS } from "./heart-sounds";
import { LABORATORY } from "./laboratory";
import { IMAGING } from "./imaging";
import { ECG_NODES } from "./ecg";
import { PROCEDURES } from "./procedures";
import { SCORES } from "./scores";
import { GUIDELINES } from "./guidelines";
import { DRUGS } from "./drugs";
import { DIAGNOSES } from "./diagnoses";
import { FLOWS } from "./flows";
import { REFERENCES } from "./references";

/** Todos os nós do grafo de conhecimento. */
export const KNOWLEDGE_REGISTRY: KnowledgeNode[] = [
  ...SYMPTOMS,
  ...PHYSICAL_FINDINGS,
  ...LUNG_SOUNDS,
  ...HEART_SOUNDS,
  ...LABORATORY,
  ...IMAGING,
  ...ECG_NODES,
  ...PROCEDURES,
  ...SCORES,
  ...GUIDELINES,
  ...DRUGS,
  ...DIAGNOSES,
  ...FLOWS,
  ...REFERENCES,
];

/** Índice por id (único). */
export const KNOWLEDGE_BY_ID: Record<string, KnowledgeNode> = Object.fromEntries(
  KNOWLEDGE_REGISTRY.map((n) => [n.id, n])
);

/** Índice por slug (pode haver colisão entre categorias — mantém o primeiro). */
export const KNOWLEDGE_BY_SLUG: Record<string, KnowledgeNode> = KNOWLEDGE_REGISTRY.reduce(
  (acc, n) => {
    if (!(n.slug in acc)) acc[n.slug] = n;
    return acc;
  },
  {} as Record<string, KnowledgeNode>
);

/** Índice por categoria. */
export const KNOWLEDGE_BY_CATEGORY: Record<KnowledgeCategory, KnowledgeNode[]> =
  KNOWLEDGE_REGISTRY.reduce((acc, n) => {
    (acc[n.categoria] ||= []).push(n);
    return acc;
  }, {} as Record<KnowledgeCategory, KnowledgeNode[]>);

/** Índice por tag. */
export const KNOWLEDGE_BY_TAG: Record<string, KnowledgeNode[]> = KNOWLEDGE_REGISTRY.reduce(
  (acc, n) => {
    for (const t of n.tags ?? []) (acc[t] ||= []).push(n);
    return acc;
  },
  {} as Record<string, KnowledgeNode[]>
);

/** Estatística simples (auditoria). */
export const KNOWLEDGE_STATS = {
  total: KNOWLEDGE_REGISTRY.length,
  porCategoria: Object.fromEntries(
    (Object.keys(KNOWLEDGE_BY_CATEGORY) as KnowledgeCategory[]).map((c) => [c, KNOWLEDGE_BY_CATEGORY[c].length])
  ),
};
