// ============================================================================
// TreatmentResponseEngine — EXTRAÇÃO DE INTERVENÇÕES
// ----------------------------------------------------------------------------
// Converte o texto livre da conduta em uma estrutura padronizada de
// intervenções. Determinístico e puro (apenas leitura de texto). Trata a
// ressalva "evitar AINE/AAS": nesse caso AAS NÃO conta como administrado e o
// risco de AINE/AAS em dengue não é marcado.
// ============================================================================

import type { Interventions } from "@/src/treatment/treatmentTypes";
import { emptyInterventions } from "@/src/treatment/treatmentTypes";
import { KEYWORDS, AVOID_NSAID_RE, NSAID_RE, ASPIRIN_RE } from "@/src/treatment/treatmentKeywords";

function normalize(s: string): string {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function matchAny(text: string, termos: string[]): boolean {
  for (const termo of termos) {
    // termos que já contêm \b ou \\ são regex; os demais são substring simples.
    if (termo.includes("\\")) {
      if (new RegExp(termo).test(text)) return true;
    } else if (text.includes(termo)) {
      return true;
    }
  }
  return false;
}

export function extractInterventions(condutaTexto: string): Interventions {
  const t = normalize(condutaTexto);
  const out = emptyInterventions();
  if (!t.trim()) return out;

  for (const [chave, termos] of Object.entries(KEYWORDS)) {
    if (termos && matchAny(t, termos)) {
      (out as any)[chave] = true;
    }
  }

  // AINE / AAS com ressalva de "evitar".
  const avoid = AVOID_NSAID_RE.test(t);
  const nsaidPresente = NSAID_RE.test(t) || ASPIRIN_RE.test(t);
  out.avoidNsaid = avoid;
  // AAS só conta como administrado se mencionado e NÃO sob ressalva de evitar.
  out.aas = ASPIRIN_RE.test(t) && !avoid;
  // Risco em dengue: AINE/AAS presentes sem a ressalva de evitar.
  out.dangerousNsaidAspirinInDengue = nsaidPresente && !avoid;

  return out;
}
