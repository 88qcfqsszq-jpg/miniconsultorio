/**
 * Grader — avalia UM critério da rubrica por vez usando IA (OpenAI).
 *
 * Reusa o cliente `openai` do projeto e o mesmo modelo do /api/corrigir (gpt-4o-mini),
 * com response_format JSON. Se a IA não estiver disponível, usa fallback heurístico
 * leve (busca textual) — nunca quebra o fluxo.
 */

import { openai } from "@/lib/openai";
import type {
  HealthBenchCriterionGrade,
  HealthBenchRubricItem,
  HealthBenchTranscript,
} from "./types";
import { GRADER_SYSTEM_PROMPT, construirGraderUserPrompt } from "./grader-template";
import { transcriptParaTexto } from "./transcript-normalizer";

const MODELO_GRADER = "gpt-4o-mini";

interface GraderRaw {
  explanation: string;
  criteria_met: boolean;
}

function parseJSONSeguro(raw: string): GraderRaw | null {
  try {
    return JSON.parse(raw);
  } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

/** Fallback heurístico: marca true se o texto-chave do critério aparece no transcript. */
function avaliacaoHeuristica(
  transcript: HealthBenchTranscript,
  item: HealthBenchRubricItem
): GraderRaw {
  const texto = transcriptParaTexto(transcript).toLowerCase();
  const palavras = item.criterion
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 4);
  const encontradas = palavras.filter((w) => texto.includes(w)).length;
  const ratio = palavras.length ? encontradas / palavras.length : 0;
  // Critério positivo: exige boa sobreposição. Negativo: conservador (não assume erro).
  const met = item.type === "negative" ? false : ratio >= 0.5;
  return {
    explanation: `Avaliação heurística (IA indisponível): ${encontradas}/${palavras.length} termos-chave presentes no transcript.`,
    criteria_met: met,
  };
}

export interface GraderUsage {
  input_tokens: number;
  output_tokens: number;
}

export async function avaliarCriterio(
  transcript: HealthBenchTranscript,
  item: HealthBenchRubricItem
): Promise<{ grade: HealthBenchCriterionGrade; usage: GraderUsage }> {
  let raw: GraderRaw | null = null;
  const usage: GraderUsage = { input_tokens: 0, output_tokens: 0 };

  if (openai) {
    try {
      const resp = await openai.chat.completions.create({
        model: MODELO_GRADER,
        messages: [
          { role: "system", content: GRADER_SYSTEM_PROMPT },
          { role: "user", content: construirGraderUserPrompt(transcript, item) },
        ],
        temperature: 0.1,
        response_format: { type: "json_object" } as any,
      });
      raw = parseJSONSeguro(resp.choices?.[0]?.message?.content ?? "");
      usage.input_tokens = resp.usage?.prompt_tokens ?? 0;
      usage.output_tokens = resp.usage?.completion_tokens ?? 0;
    } catch (e) {
      console.error("[HEALTHBENCH GRADER] Falha na IA, usando heurística:", e);
    }
  }

  if (!raw || typeof raw.criteria_met !== "boolean") {
    raw = avaliacaoHeuristica(transcript, item);
  }

  // Pontuação: positivo soma points se cumprido; negativo desconta (points já negativo) se ocorreu.
  let points_awarded = 0;
  if (raw.criteria_met) {
    points_awarded = item.points; // positivo: +points ; negativo: points é negativo => desconta
  }

  const grade: HealthBenchCriterionGrade = {
    rubricItemId: item.id,
    criterion: item.criterion,
    criteria_met: raw.criteria_met,
    explanation: raw.explanation || "Sem explicação.",
    points: item.points,
    points_awarded,
    tags: item.tags,
    critical: item.critical,
    type: item.type,
  };

  console.log("[HEALTHBENCH GRADER]", {
    item: item.id,
    criteria_met: grade.criteria_met,
    points_awarded,
  });

  return { grade, usage };
}

/** Avalia todos os critérios (sequencial para não estourar rate limit do grader). */
export async function avaliarTodosCriterios(
  transcript: HealthBenchTranscript,
  rubric: HealthBenchRubricItem[]
): Promise<{ grades: HealthBenchCriterionGrade[]; usage: GraderUsage }> {
  const grades: HealthBenchCriterionGrade[] = [];
  const usageTotal: GraderUsage = { input_tokens: 0, output_tokens: 0 };

  for (const item of rubric) {
    const { grade, usage } = await avaliarCriterio(transcript, item);
    grades.push(grade);
    usageTotal.input_tokens += usage.input_tokens;
    usageTotal.output_tokens += usage.output_tokens;
  }

  return { grades, usage: usageTotal };
}
