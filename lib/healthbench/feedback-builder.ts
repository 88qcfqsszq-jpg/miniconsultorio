/**
 * Feedback Builder — gera o feedback do professor e o plano de melhoria
 * a partir das grades, métricas e erros críticos. Texto determinístico
 * (sem IA extra) para ser barato, rápido e auditável.
 *
 * Inclui sugestões de revisão via MEDIX Learn quando detecta lacunas
 * em temas específicos a partir das tags de theme:* e axis:* das grades.
 */

import {
  AXIS_LABELS,
  type HealthBenchCriterionGrade,
  DISCLAIMER_EDUCACIONAL,
} from "./types";
import type { MetricsResult } from "./metrics";

function rotuloAxis(tag: string): string {
  return AXIS_LABELS[tag] ?? tag.replace(/^axis:/, "");
}

// ── MEDIX Learn — mapa de tema/eixo → link de revisão ───────────────────────
// Usado apenas para sugestões no feedback. Não altera MEDIX Learn.
const MEDIX_LEARN_LINKS: Array<{
  pattern: RegExp;
  topico: string;
  path: string;
}> = [
  { pattern: /sepse|choque.s[ée]ptico|septic/, topico: "Sepse e choque séptico", path: "/learn/infectologia/sepse-e-choque-septico" },
  { pattern: /pneumon|pac\b|pneumonia adquirida/, topico: "Pneumonia (PAC)", path: "/learn/respiratorio/dispneia" },
  { pattern: /dispneia|falta de ar|dificuldade respirat/, topico: "Dispneia", path: "/learn/respiratorio/dispneia" },
  { pattern: /hipoxemia|satura[çc][ãa]o|spo2/, topico: "Hipoxemia", path: "/learn/respiratorio/hipoxemia" },
  { pattern: /sinais vitais|press[ãa]o arterial|frequ[êe]ncia card|frequ[êe]ncia respirat|temperatura/, topico: "Sinais vitais e gravidade", path: "/learn/semiologia-geral/sinais-vitais-e-gravidade" },
  { pattern: /racioc[íi]nio|s[íi]ndrome|diagn[óo]stico difer|antes de diagnostico/, topico: "Síndromes antes de diagnósticos", path: "/learn/raciocinio-clinico/sindromes-antes-de-diagnosticos" },
  { pattern: /avc|acidente vascular|d[ée]ficit focal|hemiparesia|afasia/, topico: "AVC e déficit focal", path: "/learn/neurologia/avc-e-deficit-focal" },
  { pattern: /exame neurol[óo]gico|neurolog|glasgow|pupilas|reflex/, topico: "Exame neurológico essencial", path: "/learn/neurologia/exame-neurologico-essencial" },
  { pattern: /rebaixamento|consci[êe]ncia|coma|estupor|delirium/, topico: "Rebaixamento de consciência", path: "/learn/neurologia/rebaixamento-de-consciencia" },
  { pattern: /abdome agudo|dor abdominal aguda|apendicite|peritonite|abdome/, topico: "Abdome agudo", path: "/learn/gastro-abdome/abdome-agudo" },
  { pattern: /meningite|meningoencefalite|rigidez de nuca|kernig|brudzinski/, topico: "Meningite e sinais meníngeos", path: "/learn/infectologia/meningite-e-sinais-meningeos" },
];

/** Detecta links MEDIX Learn relevantes a partir do texto dos critérios não cumpridos. */
function sugerirLinksLearn(grades: HealthBenchCriterionGrade[]): string[] {
  const fracoTexto = grades
    .filter((g) => g.type !== "negative" && !g.criteria_met)
    .map((g) => `${g.criterion} ${g.explanation ?? ""}`.toLowerCase())
    .join(" ");

  if (!fracoTexto) return [];

  const links: string[] = [];
  const vistos = new Set<string>();

  for (const { pattern, topico, path } of MEDIX_LEARN_LINKS) {
    if (pattern.test(fracoTexto) && !vistos.has(path)) {
      vistos.add(path);
      links.push(`${topico} → ${path}`);
      if (links.length >= 3) break;
    }
  }

  return links;
}

/** Eixos com menor desempenho viram foco de treino. */
export function construirNextTrainingFocus(metrics: MetricsResult): string[] {
  const eixos = Object.entries(metrics.competencyScores)
    .sort((a, b) => a[1] - b[1])
    .filter(([, score]) => score < 0.8)
    .slice(0, 3)
    .map(([tag]) => rotuloAxis(tag));
  return eixos;
}

export function construirFeedbackProfessor(
  grades: HealthBenchCriterionGrade[],
  metrics: MetricsResult,
  criticalErrors: HealthBenchCriterionGrade[],
  notaFinal: number,
  pontuacaoMaxima: number
): string {
  const linhas: string[] = [];

  linhas.push(
    `Nota: ${notaFinal.toFixed(1)}/${pontuacaoMaxima} (${Math.round(
      metrics.overall_score * 100
    )}% da rubrica).`
  );

  // Pontos fortes (até 4, prefer from certified perfil items if available)
  const fortes = grades
    .filter((g) => g.type !== "negative" && g.criteria_met)
    .slice(0, 4)
    .map((g) => g.criterion);
  if (fortes.length) {
    linhas.push(`\nPontos fortes:\n- ${fortes.join("\n- ")}`);
  }

  // A melhorar — com explicação contextual do grader
  const fracos = grades
    .filter((g) => g.type !== "negative" && !g.criteria_met)
    .slice(0, 5);
  if (fracos.length) {
    const textoFracos = fracos
      .map((g) => {
        const base = g.criterion;
        // Usa a explicação do grader IA quando disponível e substantiva
        const expl = (g.explanation ?? "").trim();
        const explicacaoUtil =
          expl && expl.length > 20 && !/avalia[çc][ãa]o heur[íi]stica/i.test(expl);
        return explicacaoUtil ? `${base} — ${expl}` : base;
      })
      .join("\n- ");
    linhas.push(`\nA melhorar:\n- ${textoFracos}`);
  }

  // Erros críticos
  if (criticalErrors.length) {
    linhas.push(
      `\n⚠️ Erros críticos / itens de segurança:\n- ${criticalErrors
        .map((g) => `${g.criterion} — ${g.explanation}`)
        .join("\n- ")}`
    );
  }

  // Foco de treino
  const foco = construirNextTrainingFocus(metrics);
  if (foco.length) {
    linhas.push(`\nFoco de treino sugerido: ${foco.join(", ")}.`);
  }

  // Sugestões MEDIX Learn
  const learnLinks = sugerirLinksLearn(grades);
  if (learnLinks.length) {
    linhas.push(`\nRevisão sugerida no MEDIX Learn:\n- ${learnLinks.join("\n- ")}`);
  }

  linhas.push(`\n${DISCLAIMER_EDUCACIONAL}`);

  return linhas.join("\n");
}
