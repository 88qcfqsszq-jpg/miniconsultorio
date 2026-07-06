/**
 * Grader Template — prompt inspirado no HealthBench (GRADER_TEMPLATE).
 *
 * Avalia UM critério por vez. NÃO avalia o caso inteiro.
 * Não mistura paciente IA e avaliador IA: este prompt é só de avaliação.
 */

import type { HealthBenchRubricItem, HealthBenchTranscript } from "./types";
import { transcriptParaTexto } from "./transcript-normalizer";

export const GRADER_SYSTEM_PROMPT = `Você é um avaliador OSCE médico rigoroso e justo.
Analise o transcript completo do atendimento (conversa, ações do aluno e resultados/eventos) e avalie APENAS o critério da rubrica fornecido.

Regras:
- Não avalie o caso inteiro, apenas o critério informado.
- Não dê crédito por ações que o aluno não realizou.
- Use somente evidências presentes no transcript/eventos.
- Se o critério exigir múltiplas ações, marque criteria_met=true apenas se TODAS foram cumpridas.
- Se o critério for NEGATIVO (comportamento indesejado/erro), marque criteria_met=true apenas se o comportamento indesejado de fato ocorreu.
- Considere equivalências clínicas simples e seguras (ex.: "chiado" equivale a "sibilância" em contexto respiratório; "falta de ar" equivale a "dispneia").
- Seja objetivo e breve na explicação.

Retorne SOMENTE um JSON válido no formato:
{"explanation": "string", "criteria_met": true | false}`;

export function construirGraderUserPrompt(
  transcript: HealthBenchTranscript,
  item: HealthBenchRubricItem
): string {
  const tipoTxt =
    item.type === "negative"
      ? "Critério NEGATIVO (marque true apenas se o erro/comportamento indesejado ocorreu)"
      : "Critério POSITIVO (marque true apenas se o aluno cumpriu)";

  return `# Transcript do atendimento
${transcriptParaTexto(transcript)}

# Critério da rubrica a avaliar
${tipoTxt}
Critério: ${item.criterion}

# Instrução
Retorne apenas o JSON {"explanation": "...", "criteria_met": true|false}.`;
}
