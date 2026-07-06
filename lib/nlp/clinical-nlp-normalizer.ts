// ============================================================================
// Clinical NLP Normalizer & Detector (ISOLADO — não integrado ao pipeline)
// ----------------------------------------------------------------------------
// Normaliza o texto do aluno e detecta conceitos clínicos do dicionário global
// e dos pacotes por diagnóstico. NÃO altera HealthBench/rubricas/feedback.
// ============================================================================

import {
  CLINICAL_NLP_DICTIONARY,
  type ClinicalNlpConcept,
} from "./clinical-nlp-dictionary";
import { getDiagnosisNlpPack } from "./diagnosis-nlp-pack";

export type DetectedClinicalConcept = {
  conceptId: string;
  label: string;
  matchedText: string;
  category: string;
  confidence: number;
  source: "global" | "diagnosis_pack";
};

// ---------------------------------------------------------------------------
// Normalização
// ---------------------------------------------------------------------------
export function normalizeTextForClinicalNlp(text: string): string {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // acentos
    .replace(/[^\w\s\/-]/g, " ") // pontuação excessiva (mantém / e -)
    .replace(/[-_]/g, " ") // hífen/underscore → espaço (trm-tb == trm tb)
    .replace(/\s+/g, " ")
    .trim();
}

// Tolerância simples de plural: "pernas" casa "perna", "sibilos" casa "sibilo".
function pluralTolerante(needle: string): RegExp {
  const esc = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // permite 's' opcional ao fim de cada palavra
  const flex = esc.replace(/(\w)\b/g, "$1s?");
  return new RegExp(`(?:^|\\b)${flex}(?:\\b|$)`);
}

function tentarMatch(
  hay: string,
  termo: string
): { matched: boolean; matchedText: string } {
  const n = normalizeTextForClinicalNlp(termo);
  if (!n) return { matched: false, matchedText: "" };
  // match por limite de palavra (evita "fa" casar dentro de "falta")
  const esc = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (new RegExp(`(?:^|[^\\wÀ-ÿ])${esc}(?:[^\\wÀ-ÿ]|$)`).test(hay)) {
    return { matched: true, matchedText: n };
  }
  // plural/singular simples
  const re = pluralTolerante(n);
  if (re.test(hay)) return { matched: true, matchedText: n };
  return { matched: false, matchedText: "" };
}

function detectarNoConceito(
  hay: string,
  concept: Pick<ClinicalNlpConcept, "conceptId" | "label" | "category" | "synonyms" | "typoVariants" | "regex" | "negativePatterns">,
  source: "global" | "diagnosis_pack"
): DetectedClinicalConcept | null {
  // padrões negativos invalidam a detecção
  if (concept.negativePatterns) {
    for (const np of concept.negativePatterns) {
      if (hay.includes(normalizeTextForClinicalNlp(np))) return null;
    }
  }
  // 1) sinônimos (confiança alta)
  for (const syn of concept.synonyms ?? []) {
    const r = tentarMatch(hay, syn);
    if (r.matched) {
      return {
        conceptId: concept.conceptId,
        label: concept.label,
        matchedText: r.matchedText,
        category: concept.category,
        confidence: 0.9,
        source,
      };
    }
  }
  // 2) regex (confiança média)
  for (const rx of concept.regex ?? []) {
    try {
      const re = new RegExp(rx, "i");
      const m = hay.match(re);
      if (m) {
        return {
          conceptId: concept.conceptId,
          label: concept.label,
          matchedText: m[0],
          category: concept.category,
          confidence: 0.8,
          source,
        };
      }
    } catch {
      /* regex inválida é ignorada */
    }
  }
  // 3) typos (confiança menor; exige token isolado p/ evitar ruído)
  for (const typo of concept.typoVariants ?? []) {
    const n = normalizeTextForClinicalNlp(typo);
    if (!n) continue;
    const re = new RegExp(`(?:^|\\s)${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\s|$)`);
    if (re.test(hay)) {
      return {
        conceptId: concept.conceptId,
        label: concept.label,
        matchedText: n,
        category: concept.category,
        confidence: 0.6,
        source,
      };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Detecção global
// ---------------------------------------------------------------------------
export function detectClinicalConcepts(text: string): DetectedClinicalConcept[] {
  const hay = normalizeTextForClinicalNlp(text);
  const out: DetectedClinicalConcept[] = [];
  for (const concept of CLINICAL_NLP_DICTIONARY) {
    const d = detectarNoConceito(hay, concept, "global");
    if (d) out.push(d);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Detecção com pacote por diagnóstico (global + caseSpecificSynonyms do pack)
// ---------------------------------------------------------------------------
export function detectDiagnosisConcepts(
  text: string,
  diagnosisKey?: string
): DetectedClinicalConcept[] {
  const hay = normalizeTextForClinicalNlp(text);
  const encontrados = new Map<string, DetectedClinicalConcept>();

  // base global
  for (const d of detectClinicalConcepts(text)) encontrados.set(d.conceptId, d);

  if (diagnosisKey) {
    const pack = getDiagnosisNlpPack(diagnosisKey);
    if (pack) {
      for (const [conceptId, synonyms] of Object.entries(pack.caseSpecificSynonyms)) {
        if (encontrados.has(conceptId)) continue;
        const d = detectarNoConceito(
          hay,
          {
            conceptId,
            label: conceptId,
            category: "raciocinio",
            synonyms,
          },
          "diagnosis_pack"
        );
        if (d) encontrados.set(conceptId, d);
      }
    }
  }
  return Array.from(encontrados.values());
}
