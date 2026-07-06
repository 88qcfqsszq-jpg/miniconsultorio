// ============================================================================
// Clinical Knowledge Graph — HELPERS (puros)
// ----------------------------------------------------------------------------
// Consultas sobre o KNOWLEDGE_REGISTRY. Sem banco, sem runtime, sem IA.
// findRelated evita ciclos infinitos com um conjunto `visitados`.
// ============================================================================

import type { KnowledgeCategory, KnowledgeNode, KnowledgeRelations } from "../types/knowledge";
import { KNOWLEDGE_REGISTRY, KNOWLEDGE_BY_ID, KNOWLEDGE_BY_SLUG, KNOWLEDGE_BY_CATEGORY, KNOWLEDGE_BY_TAG } from "../registry";

export function findById(id: string): KnowledgeNode | undefined {
  return KNOWLEDGE_BY_ID[id];
}

export function findBySlug(slug: string): KnowledgeNode | undefined {
  return KNOWLEDGE_BY_SLUG[slug];
}

export function findByCategory(categoria: KnowledgeCategory): KnowledgeNode[] {
  return KNOWLEDGE_BY_CATEGORY[categoria] ?? [];
}

export function findByTag(tag: string): KnowledgeNode[] {
  return KNOWLEDGE_BY_TAG[tag] ?? [];
}

/** Achata todos os ids referenciados por um nó (todas as relações). */
function idsRelacionados(refs: KnowledgeRelations | undefined): string[] {
  if (!refs) return [];
  const out: string[] = [];
  for (const chave of Object.keys(refs) as (keyof KnowledgeRelations)[]) {
    const lista = refs[chave];
    if (Array.isArray(lista)) out.push(...lista);
  }
  return out;
}

/**
 * Nós relacionados a um id. `profundidade` controla a expansão (default 1).
 * Usa `visitados` para NÃO entrar em ciclos.
 */
export function findRelated(id: string, profundidade = 1): KnowledgeNode[] {
  const inicio = findById(id);
  if (!inicio) return [];
  const visitados = new Set<string>([id]);
  const resultado: KnowledgeNode[] = [];
  let fronteira: string[] = idsRelacionados(inicio.refs);

  for (let nivel = 0; nivel < profundidade; nivel++) {
    const proxima: string[] = [];
    for (const rid of fronteira) {
      if (visitados.has(rid)) continue;
      visitados.add(rid);
      const no = findById(rid);
      if (no) {
        resultado.push(no);
        proxima.push(...idsRelacionados(no.refs));
      }
    }
    fronteira = proxima;
    if (fronteira.length === 0) break;
  }
  return resultado;
}

/** Busca textual simples por nome/slug/descrição/tags (case-insensitive). */
export function searchKnowledge(termo: string, opts: { categoria?: KnowledgeCategory; limite?: number } = {}): KnowledgeNode[] {
  const q = (termo || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  if (!q) return [];
  const base = opts.categoria ? findByCategory(opts.categoria) : KNOWLEDGE_REGISTRY;
  const norm = (s: string) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const hits = base.filter((n) => {
    const alvo = [n.nome, n.slug, n.descricao, ...(n.tags ?? [])].map(norm).join(" ");
    return alvo.includes(q);
  });
  return typeof opts.limite === "number" ? hits.slice(0, opts.limite) : hits;
}

/** Verifica integridade: retorna ids referenciados que NÃO existem no registry. */
export function refsQuebradas(): Array<{ from: string; missing: string }> {
  const faltando: Array<{ from: string; missing: string }> = [];
  for (const n of KNOWLEDGE_REGISTRY) {
    for (const rid of idsRelacionados(n.refs)) {
      if (!KNOWLEDGE_BY_ID[rid]) faltando.push({ from: n.id, missing: rid });
    }
  }
  return faltando;
}
