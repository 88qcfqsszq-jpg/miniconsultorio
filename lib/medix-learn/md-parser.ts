import type {
  LearnTrailData,
  LearnSection,
  LearnMiniCase,
  LearnQuestion,
  LearnBridge,
} from "./types";

const MINI_CASE_STYLES = [
  { accentColor: "#92400e", accentBg: "rgba(245,158,11,0.08)" },
  { accentColor: "#065f46", accentBg: "rgba(16,185,129,0.08)" },
  { accentColor: "#1d4ed8", accentBg: "rgba(59,130,246,0.08)" },
  { accentColor: "#b91c1c", accentBg: "rgba(239,68,68,0.08)" },
];

function cleanText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .trim();
}

function parseSections(lines: string[]): LearnSection[] {
  const SECTION_MAP: Array<{ num: number; id: string }> = [
    { num: 1, id: "microaula" },
    { num: 2, id: "fisiologia" },
    { num: 3, id: "semiologia" },
    { num: 4, id: "raciocinio" },
  ];

  return SECTION_MAP.flatMap(({ num, id }) => {
    const startRe = new RegExp(`^# ${num}\\.`);
    const startIdx = lines.findIndex((l) => startRe.test(l));
    if (startIdx < 0) return [];

    const sectionLines: string[] = [];
    for (let i = startIdx + 1; i < lines.length; i++) {
      if (/^# \d+\./.test(lines[i])) break;
      sectionLines.push(lines[i]);
    }

    const titleMatch = lines[startIdx].match(/^# \d+\.\s+(.+)/);
    const titulo = titleMatch
      ? titleMatch[1].replace(/\s*—.*$/, "").trim()
      : id;

    const paragrafos: string[] = [];
    const items: string[] = [];
    let destaque: string | undefined;
    let inCode = false;
    const codeLines: string[] = [];

    for (const l of sectionLines) {
      if (l.startsWith("```")) {
        if (inCode) {
          const first = codeLines.find((c) => c.trim());
          if (first) destaque = first.trim();
          codeLines.length = 0;
          inCode = false;
        } else {
          inCode = true;
        }
        continue;
      }
      if (inCode) { codeLines.push(l); continue; }
      if (l.startsWith("#") || l.trim() === "---") continue;

      const trimmed = l.trim();
      if (!trimmed) continue;

      const bulletMatch = trimmed.match(/^[-*]\s+(.+)/);
      if (bulletMatch) {
        items.push(cleanText(bulletMatch[1]));
        continue;
      }
      if (!trimmed.startsWith("- [")) {
        const cleaned = cleanText(trimmed);
        if (cleaned.length > 3) paragrafos.push(cleaned);
      }
    }

    return [{ id, titulo, paragrafos, items: items.length > 0 ? items : undefined, destaque }] as LearnSection[];
  });
}

type MiniCaseBuilder = Partial<Omit<LearnMiniCase, "dadosChave">> & {
  _dadosItems?: string[];
};

function parseMiniCases(lines: string[]): LearnMiniCase[] {
  const sec5Start = lines.findIndex((l) => /^# 5\. Mini-casos/.test(l));
  const sec6Start = lines.findIndex((l) => /^# 6\./.test(l));
  if (sec5Start < 0) return [];

  const miniCasoLines = lines.slice(sec5Start, sec6Start >= 0 ? sec6Start : undefined);

  const cases: LearnMiniCase[] = [];
  let subsection = "";
  let subLines: string[] = [];
  let currentMC: MiniCaseBuilder | null = null;

  const flushSub = (mc: MiniCaseBuilder) => {
    if (!subsection) return;
    const text = subLines
      .filter((l) => !l.startsWith("```") && l.trim() !== "---")
      .join(" ")
      .trim();

    switch (subsection) {
      case "cenario": mc.cenario = cleanText(text); break;
      case "mecanismo": {
        const first = subLines.find((l) => l.trim() && !l.startsWith("```") && !l.trim().startsWith("---"));
        mc.mecanismo = first ? cleanText(first.trim()) : cleanText(text);
        break;
      }
      case "achados":
        mc._dadosItems = subLines
          .filter((l) => l.match(/^[-*]\s+/))
          .map((l) => cleanText(l.replace(/^[-*]\s+/, "").trim()));
        break;
      case "pergunta": mc.perguntaCentral = cleanText(text); break;
      case "resposta": mc.respostaEsperada = cleanText(text); break;
      case "erro": mc.erroComum = cleanText(text); break;
      case "ponte": mc.ponteOSCE = cleanText(text); break;
    }
    subsection = "";
    subLines = [];
  };

  const pushCase = (mc: MiniCaseBuilder) => {
    const style = MINI_CASE_STYLES[cases.length % MINI_CASE_STYLES.length];
    cases.push({
      id: `mc-${cases.length + 1}`,
      titulo: mc.titulo || "",
      cenario: mc.cenario || "",
      dadosChave: (mc._dadosItems || []).map((v) => ({ label: "→", valor: v })),
      mecanismo: mc.mecanismo || "",
      perguntaCentral: mc.perguntaCentral || "",
      respostaEsperada: mc.respostaEsperada || "",
      erroComum: mc.erroComum || "",
      ponteOSCE: mc.ponteOSCE || "",
      accentColor: style.accentColor,
      accentBg: style.accentBg,
    });
  };

  for (const l of miniCasoLines) {
    const caseMatch = l.match(/^## Mini-caso \d+\s*(?:—\s*(.+))?$/);
    if (caseMatch) {
      if (currentMC) { flushSub(currentMC); pushCase(currentMC); }
      currentMC = { titulo: (caseMatch[1] || "").trim() };
      subsection = "";
      subLines = [];
      continue;
    }
    if (!currentMC) continue;
    if (l.match(/^### Cenário/i))             { flushSub(currentMC); subsection = "cenario"; continue; }
    if (l.match(/^### Mecanismo principal/i)) { flushSub(currentMC); subsection = "mecanismo"; continue; }
    if (l.match(/^### Achados-chave/i))       { flushSub(currentMC); subsection = "achados"; continue; }
    if (l.match(/^### Pergunta central/i))    { flushSub(currentMC); subsection = "pergunta"; continue; }
    if (l.match(/^### Resposta esperada/i))   { flushSub(currentMC); subsection = "resposta"; continue; }
    if (l.match(/^### Erro comum/i))          { flushSub(currentMC); subsection = "erro"; continue; }
    if (l.match(/^### Ponte para OSCE/i))     { flushSub(currentMC); subsection = "ponte"; continue; }
    subLines.push(l);
  }
  if (currentMC) { flushSub(currentMC); pushCase(currentMC); }

  return cases;
}

function parseQuestions(lines: string[]): LearnQuestion[] {
  const sec6Start = lines.findIndex((l) => /^# 6\. Questões ativas/.test(l));
  const sec7Start = lines.findIndex((l) => /^# 7\./.test(l));
  if (sec6Start < 0) return [];

  const qLines = lines.slice(sec6Start, sec7Start >= 0 ? sec7Start : undefined);
  const questions: LearnQuestion[] = [];
  let currentQ: Partial<LearnQuestion> | null = null;

  for (const l of qLines) {
    const qMatch = l.match(/^## Questão ativa (\d+)/);
    if (qMatch) {
      if (currentQ?.pergunta) questions.push(currentQ as LearnQuestion);
      currentQ = { id: `q${qMatch[1]}` };
      continue;
    }
    if (!currentQ) continue;
    const pm = l.match(/^\*\*Pergunta:\*\*\s*(.+)/);
    if (pm) { currentQ.pergunta = pm[1].trim(); continue; }
    const rm = l.match(/^\*\*Resposta esperada:\*\*\s*(.+)/);
    if (rm) { currentQ.resposta = rm[1].trim(); continue; }
  }
  if (currentQ?.pergunta) questions.push(currentQ as LearnQuestion);

  return questions;
}

function parseMapa(lines: string[]): string[] {
  const sec7Start = lines.findIndex((l) => /^# 7\. Mapa final/.test(l));
  const sec8Start = lines.findIndex((l) => /^# 8\./.test(l));
  if (sec7Start < 0) return [];

  const mapaLines = lines.slice(sec7Start, sec8Start >= 0 ? sec8Start : undefined);
  const result: string[] = [];
  let inCode = false;

  for (const l of mapaLines) {
    if (l.startsWith("```")) { inCode = !inCode; continue; }
    if (inCode) result.push(l);
  }
  return result;
}

function parseBridges(lines: string[], trailTitulo: string): LearnBridge[] {
  const DEFAULT: LearnBridge[] = [
    {
      modulo: "ciclo-basico",
      titulo: "MEDIX OSCE Ciclo Básico",
      subtitulo: "Treinar o atendimento",
      casosRecomendados: [trailTitulo],
      competencias: ["Anamnese dirigida", "Exame físico", "Conduta inicial"],
      href: "/faca-o-osce",
      cor: "#6d28d9",
      corBg: "rgba(124,58,237,0.07)",
    },
    {
      modulo: "clinico",
      titulo: "MEDIX OSCE Clínico",
      subtitulo: "Simular a evolução",
      casosRecomendados: [trailTitulo],
      competencias: ["Evolução temporal", "Resposta a intervenção", "Reavaliação"],
      href: "/casos-dinamicos",
      cor: "#0369a1",
      corBg: "rgba(14,165,233,0.07)",
    },
  ];

  const sec8Start = lines.findIndex((l) => /^# 8\. Ponte para OSCE/.test(l));
  if (sec8Start < 0) return DEFAULT;

  const ponteLines = lines.slice(sec8Start);
  const basicoIdx = ponteLines.findIndex((l) => l.includes("MEDIX OSCE Ciclo Básico"));
  const clinicoIdx = ponteLines.findIndex((l) => l.includes("MEDIX OSCE Clínico"));

  const extractItems = (from: number, endBound: number): string[] => {
    const result: string[] = [];
    for (let i = from + 1; i < Math.min(endBound, ponteLines.length); i++) {
      const m = ponteLines[i].match(/^[-*]\s+(.+)/);
      if (m) result.push(m[1].trim());
      else if (ponteLines[i].startsWith("##") || ponteLines[i].startsWith("# ")) break;
    }
    return result;
  };

  const basicoItems = basicoIdx >= 0 ? extractItems(basicoIdx, clinicoIdx >= 0 ? clinicoIdx : ponteLines.length) : [];
  const clinicoItems = clinicoIdx >= 0 ? extractItems(clinicoIdx, ponteLines.length) : [];

  return [
    {
      modulo: "ciclo-basico",
      titulo: "MEDIX OSCE Ciclo Básico",
      subtitulo: "Treinar o atendimento",
      casosRecomendados: [trailTitulo],
      competencias: basicoItems.length > 0 ? basicoItems : DEFAULT[0].competencias,
      href: "/faca-o-osce",
      cor: "#6d28d9",
      corBg: "rgba(124,58,237,0.07)",
    },
    {
      modulo: "clinico",
      titulo: "MEDIX OSCE Clínico",
      subtitulo: "Simular a evolução",
      casosRecomendados: [trailTitulo],
      competencias: clinicoItems.length > 0 ? clinicoItems : DEFAULT[1].competencias,
      href: "/casos-dinamicos",
      cor: "#0369a1",
      corBg: "rgba(14,165,233,0.07)",
    },
  ];
}

export function parseMdTrail(
  content: string,
  systemId: string,
  trailId: string,
  systemBadge: string
): LearnTrailData {
  const lines = content.split("\n");

  const titleLine = lines.find((l) => l.startsWith("# Trilha "));
  const rawTitle = titleLine
    ? (titleLine.split("—").at(-1) ?? titleLine.replace(/^# Trilha\s*/, ""))
    : trailId;
  const titulo = rawTitle.trim();

  const objIdx = lines.findIndex((l) => l.match(/## Objetivo da trilha/));
  let subtitulo = "";
  if (objIdx >= 0) {
    for (let i = objIdx + 1; i < Math.min(objIdx + 10, lines.length); i++) {
      const t = lines[i].trim();
      if (t && !t.startsWith("#") && !t.startsWith("-") && !t.startsWith("`") && t !== "---") {
        subtitulo = t;
        break;
      }
    }
  }

  const compIdx = lines.findIndex((l) => l.match(/Competências ao final/));
  const competencias: string[] = [];
  if (compIdx >= 0) {
    for (let i = compIdx + 2; i < Math.min(compIdx + 15, lines.length); i++) {
      const m = lines[i].match(/^\d+\.\s+(.+)/);
      if (m) competencias.push(cleanText(m[1]));
      else if (lines[i].startsWith("#") || lines[i].trim() === "---") break;
    }
  }

  return {
    id: trailId,
    titulo,
    subtitulo,
    publicoAlvo: "Ciclo básico e início do ciclo clínico.",
    badges: [systemBadge, "Fisiologia aplicada", "Semiologia", "Raciocínio clínico"],
    objetivos: competencias,
    competencias,
    secoes: parseSections(lines),
    miniCasos: parseMiniCases(lines),
    questoesAtivas: parseQuestions(lines),
    mapaLinhas: parseMapa(lines),
    pontes: parseBridges(lines, titulo),
  };
}
