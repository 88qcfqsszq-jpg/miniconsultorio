/**
 * Perfil Rubrica Loader — carrega PerfilRubricaCaso das rubricas definitivas
 * e converte para HealthBenchRubricItem[].
 *
 * Fonte: data/rubricas-osce-adulto-pediatrico-ts/lib/healthbench/rubricas-osce/perfis-casos/
 *   adultos/  — 60 casos adultos (IDs numéricos como string: "1", "2", …)
 *   pediatricos/ — 17 casos pediátricos (IDs: "ped-01" … "ped-16", "caso-64")
 *
 * Conversão de domínios → axis:
 *   focoAnamnese[]       → axis:anamnese       (1 pt cada)
 *   focoExameFisico[]    → axis:exame_fisico    (1 pt cada)
 *   examesEssenciais[]   → axis:exames_complementares (1 pt)
 *   focoDiagnostico[]    → axis:raciocinio_clinico (1 pt)
 *   condutasEssenciais[] → axis:conduta         (1 pt)
 *   criteriosCriticos[]  → axis:seguranca, critical:true (2 pt)
 *   seguranca[]          → axis:seguranca       (1 pt)
 *
 * Quando não há perfil para o caso → retorna null (fallback ao comportamento anterior).
 */

import { PERFIS_RUBRICA_ADULTOS_BY_ID } from "@/data/rubricas-osce-adulto-pediatrico-ts/lib/healthbench/rubricas-osce/perfis-casos/adultos";
import { PERFIS_RUBRICA_PEDIATRICOS_BY_ID } from "@/data/rubricas-osce-adulto-pediatrico-ts/lib/healthbench/rubricas-osce/perfis-casos/pediatricos";
import type { PerfilRubricaCaso } from "@/data/rubricas-osce-adulto-pediatrico-ts/lib/healthbench/rubricas-osce/types";
import { AXIS_TAGS, type HealthBenchRubricItem } from "./types";

function slug(s: string, fallback: string): string {
  return (
    (s || fallback)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || fallback
  );
}

/** Carrega o PerfilRubricaCaso pelo ID e tipo do caso. Retorna null se não houver perfil. */
export function carregarPerfilRubrica(
  caseId: string | number,
  tipoPaciente?: string | null
): PerfilRubricaCaso | null {
  const id = String(caseId);
  const isPed =
    tipoPaciente === "pediatrico" ||
    id.startsWith("ped-") ||
    !!PERFIS_RUBRICA_PEDIATRICOS_BY_ID[id];

  const perfil = isPed
    ? PERFIS_RUBRICA_PEDIATRICOS_BY_ID[id] ?? null
    : PERFIS_RUBRICA_ADULTOS_BY_ID[id] ?? null;

  if (perfil) {
    console.log("[PERFIL RUBRICA] carregado:", perfil.caseId, perfil.titulo);
  } else {
    console.log("[PERFIL RUBRICA] não encontrado para caseId:", id, "→ usando fallback genérico");
  }

  return perfil ?? null;
}

/** Converte PerfilRubricaCaso em HealthBenchRubricItem[] para o rubric-adapter. */
export function converterPerfilParaItens(
  perfil: PerfilRubricaCaso
): HealthBenchRubricItem[] {
  const itens: HealthBenchRubricItem[] = [];
  const prefix = `perfil-${perfil.caseId}`;

  // 1. Comunicação (implicit: não há campo específico no perfil, mas garantirCoberturaMinima cobre)

  // 2. Anamnese
  perfil.focoAnamnese.forEach((texto, i) => {
    if (!texto?.trim()) return;
    itens.push({
      id: `${prefix}-ana-${i}-${slug(texto, String(i))}`,
      criterion: texto,
      points: 1,
      tags: [AXIS_TAGS.anamnese],
      type: "positive",
      sourceRubricId: "perfil:focoAnamnese",
    });
  });

  // 3. Exame físico
  perfil.focoExameFisico.forEach((texto, i) => {
    if (!texto?.trim()) return;
    itens.push({
      id: `${prefix}-fis-${i}-${slug(texto, String(i))}`,
      criterion: texto,
      points: 1,
      tags: [AXIS_TAGS.exame_fisico],
      type: "positive",
      sourceRubricId: "perfil:focoExameFisico",
    });
  });

  // 4. Exames complementares essenciais
  perfil.examesEssenciais.forEach((texto, i) => {
    if (!texto?.trim()) return;
    itens.push({
      id: `${prefix}-exa-${i}-${slug(texto, String(i))}`,
      criterion: `Solicitar ou avaliar: ${texto}`,
      points: 1,
      tags: [AXIS_TAGS.exames_complementares],
      type: "positive",
      sourceRubricId: "perfil:examesEssenciais",
    });
  });

  // 5. Foco diagnóstico
  perfil.focoDiagnostico.forEach((texto, i) => {
    if (!texto?.trim()) return;
    itens.push({
      id: `${prefix}-rac-${i}-${slug(texto, String(i))}`,
      criterion: texto,
      points: 1,
      tags: [AXIS_TAGS.raciocinio_clinico],
      type: "positive",
      sourceRubricId: "perfil:focoDiagnostico",
    });
  });

  // 6. Condutas essenciais
  perfil.condutasEssenciais.forEach((texto, i) => {
    if (!texto?.trim()) return;
    itens.push({
      id: `${prefix}-con-${i}-${slug(texto, String(i))}`,
      criterion: texto,
      points: 1,
      tags: [AXIS_TAGS.conduta],
      type: "positive",
      sourceRubricId: "perfil:condutasEssenciais",
    });
  });

  // 7. Critérios críticos (positivos obrigatórios, peso maior, marcados como critical)
  perfil.criteriosCriticos.forEach((texto, i) => {
    if (!texto?.trim()) return;
    itens.push({
      id: `${prefix}-crit-${i}-${slug(texto, String(i))}`,
      criterion: texto,
      points: 2,
      tags: [AXIS_TAGS.seguranca, "skill:criterio_critico"],
      critical: true,
      type: "positive",
      sourceRubricId: "perfil:criteriosCriticos",
    });
  });

  // 8. Segurança
  perfil.seguranca.forEach((texto, i) => {
    if (!texto?.trim()) return;
    itens.push({
      id: `${prefix}-seg-${i}-${slug(texto, String(i))}`,
      criterion: texto,
      points: 1,
      tags: [AXIS_TAGS.seguranca],
      type: "positive",
      sourceRubricId: "perfil:seguranca",
    });
  });

  console.log("[PERFIL RUBRICA] itens convertidos:", itens.length, {
    anamnese: perfil.focoAnamnese.length,
    exameFisico: perfil.focoExameFisico.length,
    exames: perfil.examesEssenciais.length,
    diagnostico: perfil.focoDiagnostico.length,
    conduta: perfil.condutasEssenciais.length,
    criticos: perfil.criteriosCriticos.length,
    seguranca: perfil.seguranca.length,
  });

  return itens;
}
