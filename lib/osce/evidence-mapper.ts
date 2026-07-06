// ============================================================================
// Evidence Mapper (Fase 27)
// ----------------------------------------------------------------------------
// Converte AÇÕES REAIS do aluno (exames clicados/visualizados, exame físico do
// log, sinais vitais) em EVIDÊNCIAS avaliáveis pelo HealthBench/feedback.
// - Expande exames AGRUPADOS (Hemograma → hemoglobina/hematócrito/leucograma/
//   plaquetas…); Marcadores inflamatórios → PCR/VHS/procalcitonina; etc.
// - Lê o log de manobras e gera evidências ("avaliou hidratação", "avaliou
//   abdome", "realizou ausculta"…).
// PURO: sem IA, sem rede. NÃO inventa exame não clicado; NÃO conta tokens
// inválidos (ex.: "por") como exame.
// ============================================================================

function norm(s: unknown): string {
  return String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

// ── Grupos de exames laboratoriais → analitos/sinônimos reconhecíveis ───────
interface GrupoExame {
  gatilho: RegExp;
  evidencias: string[];
}
const GRUPOS_EXAME: GrupoExame[] = [
  { gatilho: /hemograma|leucograma|serie (vermelha|branca)|eritrograma|plaquetograma/, evidencias: ["hemograma", "hemoglobina", "hematocrito", "leucocitos", "leucograma", "plaquetas", "hemoconcentracao", "serie vermelha", "serie branca"] },
  { gatilho: /marcador.*inflamat|\bpcr\b|proteina c reativa|\bvhs\b|procalciton|hemossedimenta/, evidencias: ["marcadores inflamatorios", "pcr", "proteina c reativa", "vhs", "procalcitonina"] },
  { gatilho: /coagulograma|coagulacao|\btap\b|\btp\b|\binr\b|\bttpa\b|protrombina|tromboplastina|d-?dimero/, evidencias: ["coagulograma", "tap", "tp", "inr", "ttpa", "tempo de protrombina", "d-dimero"] },
  { gatilho: /\burina\b|\beas\b|urina tipo|sumario de urina|parcial de urina|urina 1/, evidencias: ["urina", "eas", "urina tipo 1", "sumario de urina"] },
  { gatilho: /gasometria|gaso arterial/, evidencias: ["gasometria", "ph", "paco2", "pao2", "bicarbonato", "hco3", "lactato", "excesso de base"] },
  { gatilho: /marcador.*cardiac|troponina|ck-?mb|\bbnp\b|probnp/, evidencias: ["marcadores cardiacos", "troponina", "ck-mb", "nt-probnp"] },
  { gatilho: /funcao hepatica|hepatograma|transaminase|\bast\b|\balt\b|\btgo\b|\btgp\b|bilirrubina|fosfatase alcalina|\bggt\b|albumina/, evidencias: ["funcao hepatica", "ast", "tgo", "alt", "tgp", "fosfatase alcalina", "ggt", "bilirrubina", "albumina"] },
  { gatilho: /funcao renal|\bureia\b|creatinina|filtracao glomerular|\btfg\b/, evidencias: ["funcao renal", "ureia", "creatinina", "tfg"] },
  { gatilho: /eletrolit|\bsodio\b|\bpotassio\b|\bcloro\b|magnesio|\bcalcio\b/, evidencias: ["eletrolitos", "sodio", "potassio", "cloro", "magnesio", "calcio"] },
];

/** Expande um exame (nome/resultado) nas suas evidências reconhecíveis. */
export function expandExamName(nome: string, resultado?: string): string[] {
  const base = norm(`${nome} ${resultado ?? ""}`);
  if (!base) return [];
  const out = new Set<string>([norm(nome)]);
  for (const g of GRUPOS_EXAME) if (g.gatilho.test(base)) g.evidencias.forEach((e) => out.add(e));
  return [...out].filter(Boolean);
}

// ── Exame físico: log/manobras → evidências ─────────────────────────────────
const EXAME_FISICO_REGRAS: Array<[RegExp, string]> = [
  [/estado geral|aspecto geral|nivel de consciencia|glasgow/, "avaliou estado geral"],
  [/hidrata|mucosa|turgor|desidrat|sede/, "avaliou hidratação"],
  [/perfus|enchimento capilar|extremidade|pulso periferico|tempo de enchimento/, "avaliou perfusão"],
  [/abdom|abdominal|blumberg|descompress/, "avaliou abdome"],
  [/hepatomegalia|figado|hepatimetria|esplenomegalia|visceromegalia/, "pesquisou hepatomegalia/visceromegalia"],
  [/petequi|sangrament|equimose|prova do la[çc]o|teste do la[çc]o|hemorrag/, "pesquisou sangramentos/petéquias"],
  [/ausculta.*(pulmo|torax|respirat)|murmurio|crepit|sibil|estertor|ausculta pulmonar/, "realizou ausculta pulmonar"],
  [/ausculta.*card|bulhas|sopro|precordio|ausculta cardiaca/, "realizou ausculta cardíaca"],
  [/cardiovascular|precordio|bulhas|ictus/, "realizou exame cardiovascular"],
  [/membros|extremidades|edema|panturrilha/, "avaliou membros/extremidades"],
];

export interface ManobraLog { categoria?: string; textDigitado?: string; resposta?: string; local?: string }

/** Converte o log de manobras em evidências de exame físico (deduplicadas). */
export function mapPhysicalExamEvidence(manobras: ManobraLog[] | undefined): { evidencias: string[]; textos: string[] } {
  const ev = new Set<string>();
  const textos: string[] = [];
  for (const m of manobras ?? []) {
    const t = norm(`${m.categoria ?? ""} ${m.textDigitado ?? ""} ${m.resposta ?? ""} ${m.local ?? ""}`);
    if (!t || t.length < 3) continue;
    textos.push(`${m.textDigitado ?? ""} ${m.resposta ?? ""}`.trim());
    for (const [re, evid] of EXAME_FISICO_REGRAS) if (re.test(t)) ev.add(evid);
  }
  return { evidencias: [...ev], textos: textos.filter(Boolean) };
}

// ── Guardas de validade ─────────────────────────────────────────────────────
const STOPWORDS = new Set(["por", "de", "da", "do", "com", "sem", "e", "ou", "a", "o", "os", "as", "para", "que", "em", "no", "na"]);

/** Um token só é exame válido se não for stopword e tiver conteúdo mínimo. */
export function isValidExamToken(s: string): boolean {
  const t = norm(s);
  return t.length >= 3 && !STOPWORDS.has(t);
}

export interface EvidenceInput {
  examRequests?: Array<{ nome?: string; resultado?: string }>;
  labsVisualizados?: string[];
  physicalExamEvents?: ManobraLog[];
  examesIndicadosTexto?: string[];
  sinaisVitaisSolicitados?: boolean;
}

export interface EvidenceOutput {
  examEvidences: string[]; // exames + analitos reconhecidos
  physicalEvidences: string[]; // evidências do exame físico
  vitalEvidences: string[]; // PA/FC/FR/temp/SpO2 se solicitados
  examesTextoExpandido: string; // para injetar no examesTexto do feedback
  achadosTextoExpandido: string; // para injetar no achadosTexto
}

/** Mapa central: ações reais → evidências avaliáveis. */
export function mapEvidences(input: EvidenceInput): EvidenceOutput {
  const examEv = new Set<string>();

  for (const e of input.examRequests ?? []) {
    if (!isValidExamToken(e.nome ?? "")) continue;
    expandExamName(e.nome ?? "", e.resultado).forEach((x) => examEv.add(x));
  }
  for (const l of input.labsVisualizados ?? []) {
    if (!isValidExamToken(l)) continue;
    expandExamName(l).forEach((x) => examEv.add(x));
  }
  // Texto livre "exames indicados" — só tokens válidos e reconhecíveis.
  for (const linha of input.examesIndicadosTexto ?? []) {
    for (const tok of String(linha ?? "").split(/[,;.\n/]+/)) {
      if (isValidExamToken(tok)) expandExamName(tok).forEach((x) => examEv.add(x));
    }
  }

  const pe = mapPhysicalExamEvidence(input.physicalExamEvents);
  const vitalEvidences = input.sinaisVitaisSolicitados
    ? ["sinais vitais", "pressao arterial", "frequencia cardiaca", "frequencia respiratoria", "temperatura", "saturacao de oxigenio", "spo2"]
    : [];

  const examEvidences = [...examEv];
  return {
    examEvidences,
    physicalEvidences: pe.evidencias,
    vitalEvidences,
    examesTextoExpandido: examEvidences.join(" "),
    achadosTextoExpandido: [...pe.textos, ...pe.evidencias, ...examEvidences].join(" "),
  };
}
