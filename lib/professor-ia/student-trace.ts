// ============================================================================
// Professor IA — STUDENT TRACE ENGINE (Fase 22)
// ----------------------------------------------------------------------------
// Rastro REAL do que o aluno FEZ no atendimento. É a ÚNICA fonte de ELOGIO do
// Professor IA — nunca o Gold Standard nem o HealthBench.
//   ELOGIO  = StudentTrace (o que o aluno fez)
//   GABARITO = Gold Standard (o que deveria ser feito)
//   ERRO    = HealthBench + TraceValidation
// PURO: sem IA, sem banco, sem persistência. Conservador: sem evidência, não elogia.
// ============================================================================

import type { GoldStandardCase } from "../../clinical-engine/gold-standard/types";

export const STUDENT_TRACE_SCHEMA_VERSION = "1.0.0" as const;

export type StudentTraceEventType =
  | "question_asked"
  | "physical_exam_performed"
  | "body_region_clicked"
  | "auscultation_performed"
  | "vital_signs_requested"
  | "exam_requested"
  | "image_opened"
  | "ecg_opened"
  | "soap_filled"
  | "diagnosis_submitted"
  | "differential_submitted"
  | "conduct_submitted"
  | "medication_submitted"
  | "treatment_plan_submitted"
  | "feedback_generated"
  | "time_spent";

export type EvidenceStrength = "strong" | "medium" | "weak";

export interface StudentTraceEvent {
  id: string;
  type: StudentTraceEventType;
  label: string;
  value?: string;
  timestamp?: string;
  source: string;
  evidenceStrength: EvidenceStrength;
  metadata?: Record<string, unknown>;
}

export interface StudentTraceEvidence {
  eventId: string;
  type: StudentTraceEventType;
  strength: EvidenceStrength;
  detalhe: string;
}

export interface StudentTraceStrength {
  texto: string;
  evidence: StudentTraceEvidence;
}

export interface StudentTraceWeakness {
  texto: string;
  motivo: string;
}

export interface StudentTraceOmission {
  item: string;
  descricao: string;
}

export interface StudentTraceCriticalMismatch {
  item: string;
  descricao: string;
}

export interface StudentTraceSummary {
  temEvidencia: boolean;
  acoesComprovadas: string[];
  confirmedStrengths: StudentTraceStrength[];
  omissoes: StudentTraceOmission[];
  inconsistencias: string[];
  examesPedidos: string[];
  examesOmitidos: string[];
  auscultasFeitas: string[];
  auscultasOmitidas: string[];
  condutasPreenchidas: string[];
  condutasAusentes: string[];
  recursosUsados: string[];
  recursosNaoUsados: string[];
  confidence: "alta" | "media" | "baixa";
}

export interface StudentTraceValidationResult {
  completedRequiredItems: string[];
  missingRequiredItems: string[];
  confirmedStrengths: string[];
  confirmedWeaknesses: string[];
  criticalMismatches: StudentTraceCriticalMismatch[];
  /** Frases/ações que NÃO podem ser elogiadas (sem evidência real). */
  forbiddenPraise: string[];
}

export interface StudentTrace {
  schemaVersion: string;
  geradoEm: string;
  events: StudentTraceEvent[];
  totalTempoSegundos?: number;
  temEvidenciaMinima: boolean;
}

// Frase neutra ABSOLUTA quando não há força confirmada (regra da Fase 22).
export const NEUTRAL_OPENING = "Vamos revisar seu atendimento e corrigir o ponto mais importante com segurança.";

// ── Entrada (espelha os dados de atendimento do ProfessorContextInput) ───────
export interface StudentTraceInput {
  chatMessages?: Array<{ tipo?: string; role?: string; conteudo?: string; content?: string; timestamp?: string }>;
  physicalExamEvents?: Array<{ categoria?: string; textDigitado?: string; resposta?: string; local?: string }>;
  auscultas?: Array<{ tipo?: string; local?: string; respostaAluno?: string; arquivo?: string | null }>;
  examRequests?: Array<{ nome?: string; resultado?: string }>;
  imagens?: Array<{ tipo?: string; termoBusca?: string; url?: string }>;
  ecg?: { visualizado?: boolean };
  sinaisVitais?: { solicitado?: boolean; dados?: unknown } | null;
  diagnosisAndPlan?: { hipotesePrincipal?: string; diagnosticosDiferenciais?: string[]; examesIndicados?: string[]; conduta?: string };
  soap?: { subjetivo?: string; objetivo?: string; avaliacao?: string; plano?: string };
  tempoAtendimentoSegundos?: number;
}

let _seq = 0;
function ev(
  type: StudentTraceEventType,
  label: string,
  source: string,
  evidenceStrength: EvidenceStrength,
  value?: string,
  metadata?: Record<string, unknown>
): StudentTraceEvent {
  return { id: `trace-${++_seq}`, type, label, value, source, evidenceStrength, metadata };
}

function ehAusculta(txt: string): boolean {
  return /ausculta|estetosc|crepit|murm[uú]rio|sibil|ronco|frêmito|percuss/i.test(txt);
}
function naoVazio(s?: string): boolean {
  return !!(s && s.trim().length > 0);
}

/** Constrói o rastro real do aluno a partir dos dados do atendimento. Puro. */
export function buildStudentTrace(input: StudentTraceInput): StudentTrace {
  _seq = 0;
  const events: StudentTraceEvent[] = [];

  // 1) Perguntas do aluno (chat).
  for (const m of input.chatMessages ?? []) {
    const tipo = (m.tipo || m.role || "").toLowerCase();
    const ehAluno = /estud|student|aluno|doutor|user/.test(tipo);
    const texto = m.conteudo ?? m.content ?? "";
    if (!ehAluno || !naoVazio(texto)) continue;
    const forte = texto.includes("?");
    events.push(ev("question_asked", texto.slice(0, 80), "chat", forte ? "medium" : "weak", texto, { timestamp: m.timestamp }));
  }

  // 2) Exame físico / regiões / ausculta.
  for (const e of input.physicalExamEvents ?? []) {
    const acao = e.textDigitado ?? "";
    if (!naoVazio(acao)) continue;
    if (ehAusculta(acao) || ehAusculta(e.categoria ?? "")) {
      events.push(ev("auscultation_performed", acao.slice(0, 80), "exame_fisico", "strong", e.resposta, { local: e.local }));
    } else {
      events.push(ev("physical_exam_performed", acao.slice(0, 80), "exame_fisico", "strong", e.resposta));
    }
    if (naoVazio(e.local)) events.push(ev("body_region_clicked", e.local!, "exame_fisico", "strong"));
  }

  // 3) Auscultas explícitas.
  for (const a of input.auscultas ?? []) {
    const label = `Ausculta ${a.tipo ?? ""} ${a.local ?? ""}`.trim();
    events.push(ev("auscultation_performed", label, "ausculta", "strong", a.respostaAluno ?? undefined, { arquivo: a.arquivo }));
  }

  // 4) Sinais vitais.
  if (input.sinaisVitais?.solicitado) events.push(ev("vital_signs_requested", "Sinais vitais solicitados", "sinais_vitais", "strong"));

  // 5) Exames solicitados.
  for (const x of input.examRequests ?? []) {
    if (!naoVazio(x.nome)) continue;
    events.push(ev("exam_requested", x.nome!, "exames", "strong", x.resultado));
  }
  // Exames indicados por escrito (diagnóstico/plano) — evidência média.
  for (const nome of input.diagnosisAndPlan?.examesIndicados ?? []) {
    if (!naoVazio(nome)) continue;
    if (!events.some(( e) => e.type === "exam_requested" && e.label.toLowerCase() === nome.toLowerCase())) {
      events.push(ev("exam_requested", nome, "plano_escrito", "medium"));
    }
  }

  // 6) Imagens / ECG.
  for (const im of input.imagens ?? []) {
    events.push(ev("image_opened", im.tipo ?? im.termoBusca ?? "Imagem aberta", "imagens", "medium", im.url));
  }
  if (input.ecg?.visualizado) events.push(ev("ecg_opened", "ECG visualizado", "ecg", "strong"));

  // 7) SOAP.
  const soap = input.soap ?? {};
  const soapPreenchido = [soap.subjetivo, soap.objetivo, soap.avaliacao, soap.plano].some(naoVazio);
  if (soapPreenchido) events.push(ev("soap_filled", "SOAP preenchido", "soap", "strong"));

  // 8) Diagnóstico / diferenciais / conduta / medicação.
  const dp = input.diagnosisAndPlan ?? {};
  if (naoVazio(dp.hipotesePrincipal)) events.push(ev("diagnosis_submitted", dp.hipotesePrincipal!, "diagnostico", "strong"));
  if ((dp.diagnosticosDiferenciais ?? []).some(naoVazio)) events.push(ev("differential_submitted", (dp.diagnosticosDiferenciais ?? []).join(", "), "diagnostico", "strong"));
  if (naoVazio(dp.conduta)) {
    events.push(ev("conduct_submitted", dp.conduta!.slice(0, 80), "conduta", "strong", dp.conduta));
    events.push(ev("treatment_plan_submitted", dp.conduta!.slice(0, 80), "conduta", "strong"));
    if (/\bmg\b|\bmcg\b|\bg\b|dose|\d+\s?(mg|mcg|ml)|antibi|amoxicilina|azitromicina|ceftriaxona/i.test(dp.conduta!)) {
      const temDose = /\d+\s?(mg|mcg|ml|g)\b|de \d+ em \d+ ?h|\d+x\/dia/i.test(dp.conduta!);
      events.push(ev("medication_submitted", "Medicação prescrita", "conduta", temDose ? "strong" : "medium", dp.conduta, { temDose }));
    }
  }

  // 9) Tempo.
  if (typeof input.tempoAtendimentoSegundos === "number") {
    events.push(ev("time_spent", `${input.tempoAtendimentoSegundos}s`, "tempo", "weak", String(input.tempoAtendimentoSegundos)));
  }

  const acoesReais = events.filter((e) => e.type !== "time_spent" && e.evidenceStrength !== "weak");
  return {
    schemaVersion: STUDENT_TRACE_SCHEMA_VERSION,
    geradoEm: new Date().toISOString(),
    events,
    totalTempoSegundos: input.tempoAtendimentoSegundos,
    temEvidenciaMinima: acoesReais.length > 0,
  };
}

// ── Frases de elogio a partir de eventos reais ───────────────────────────────
function forcaDeEvento(e: StudentTraceEvent): StudentTraceStrength | null {
  const evidence: StudentTraceEvidence = { eventId: e.id, type: e.type, strength: e.evidenceStrength, detalhe: e.label };
  switch (e.type) {
    case "auscultation_performed": return { texto: "Auscultou o tórax", evidence };
    case "exam_requested": return { texto: `Solicitou ${e.label}`, evidence };
    case "vital_signs_requested": return { texto: "Mediu os sinais vitais", evidence };
    case "diagnosis_submitted": return { texto: `Formulou a hipótese diagnóstica (${e.label})`, evidence };
    case "differential_submitted": return { texto: "Considerou diagnósticos diferenciais", evidence };
    case "conduct_submitted": return { texto: "Registrou uma conduta", evidence };
    case "medication_submitted": return { texto: "Prescreveu medicação", evidence };
    case "image_opened": return { texto: `Abriu a imagem (${e.label})`, evidence };
    case "ecg_opened": return { texto: "Analisou o ECG", evidence };
    case "soap_filled": return { texto: "Preencheu o SOAP", evidence };
    case "physical_exam_performed": return { texto: "Realizou exame físico", evidence };
    default: return null;
  }
}

/** Resume o rastro. `confirmedStrengths` vêm SÓ de evidência real (não do gabarito). */
export function summarizeStudentTrace(trace: StudentTrace, goldStandard?: GoldStandardCase): StudentTraceSummary {
  const relevantes = trace.events.filter((e) => e.evidenceStrength === "strong" || e.evidenceStrength === "medium");

  const confirmedStrengthsMap = new Map<string, StudentTraceStrength>();
  for (const e of relevantes) {
    const f = forcaDeEvento(e);
    if (f) confirmedStrengthsMap.set(f.texto, f);
  }
  const confirmedStrengths = [...confirmedStrengthsMap.values()];
  const acoesComprovadas = relevantes.map((e) => e.label);

  const examesPedidos = trace.events.filter((e) => e.type === "exam_requested").map((e) => e.label);
  const auscultasFeitas = trace.events.filter((e) => e.type === "auscultation_performed").map((e) => e.label);
  const condutasPreenchidas = trace.events.filter((e) => e.type === "conduct_submitted" || e.type === "medication_submitted").map((e) => e.label);

  // Omissões contra o gabarito (o que o gabarito exige e não há evidência).
  const has = (t: StudentTraceEventType) => trace.events.some((e) => e.type === t);
  const hasExame = (re: RegExp) => trace.events.some((e) => e.type === "exam_requested" && re.test(e.label));
  const omissoes: StudentTraceOmission[] = [];
  const examesOmitidos: string[] = [];
  const auscultasOmitidas: string[] = [];
  const condutasAusentes: string[] = [];
  if (goldStandard) {
    if (!has("auscultation_performed")) { omissoes.push({ item: "ausculta", descricao: "Ausculta pulmonar não realizada." }); auscultasOmitidas.push("Ausculta pulmonar"); }
    if (!hasExame(/rx|radiograf/i)) { omissoes.push({ item: "rx", descricao: "RX de tórax não solicitado." }); examesOmitidos.push("RX de tórax"); }
    if (!hasExame(/hemograma/i)) { omissoes.push({ item: "hemograma", descricao: "Hemograma não solicitado." }); examesOmitidos.push("Hemograma"); }
    if (!has("vital_signs_requested")) omissoes.push({ item: "sinais_vitais", descricao: "Sinais vitais / SpO₂ não solicitados." });
    if (!has("conduct_submitted") && !has("medication_submitted")) { omissoes.push({ item: "conduta", descricao: "Conduta não registrada." }); condutasAusentes.push("Conduta / antibiótico"); }
  }

  const recursosUsados = [...new Set(trace.events.map((e) => e.type))];
  const inconsistencias: string[] = [];

  const confidence: StudentTraceSummary["confidence"] = !trace.temEvidenciaMinima ? "baixa" : confirmedStrengths.length >= 3 ? "alta" : "media";

  return {
    temEvidencia: trace.temEvidenciaMinima,
    acoesComprovadas,
    confirmedStrengths,
    omissoes,
    inconsistencias,
    examesPedidos,
    examesOmitidos,
    auscultasFeitas,
    auscultasOmitidas,
    condutasPreenchidas,
    condutasAusentes,
    recursosUsados: recursosUsados.map(String),
    recursosNaoUsados: [],
    confidence,
  };
}

// ── Validação contra o Gold Standard + lista de elogios proibidos ────────────
const FORBIDDEN_POR_ITEM: Record<string, string[]> = {
  ausculta: ["auscultou", "identificou crepitações", "ouviu crepitações", "escutou o pulmão", "examinou o tórax", "na ausculta"],
  rx: ["solicitou rx", "pediu radiografia", "solicitou radiografia", "pediu o rx"],
  hemograma: ["solicitou hemograma", "pediu hemograma"],
  sinais_vitais: ["mediu os sinais vitais", "aferiu a saturação", "mediu a spo", "verificou os sinais vitais"],
  diagnostico: ["diagnosticou", "formulou a hipótese", "fechou o diagnóstico"],
  conduta: ["prescreveu", "definiu a conduta", "indicou o antibiótico"],
};

/** Compara o rastro com o gabarito. Produz `forbiddenPraise` (o que NÃO pode ser elogiado). */
export function validateTraceAgainstGoldStandard(trace: StudentTrace, goldStandard: GoldStandardCase): StudentTraceValidationResult {
  const has = (t: StudentTraceEventType) => trace.events.some((e) => e.type === t);
  const hasExame = (re: RegExp) => trace.events.some((e) => e.type === "exam_requested" && re.test(e.label));
  const medComDose = trace.events.some((e) => e.type === "medication_submitted" && e.metadata?.temDose === true);

  const requeridos: Array<{ item: string; label: string; done: boolean }> = [
    { item: "ausculta", label: "Ausculta pulmonar", done: has("auscultation_performed") },
    { item: "rx", label: "RX de tórax", done: hasExame(/rx|radiograf/i) },
    { item: "hemograma", label: "Hemograma", done: hasExame(/hemograma/i) },
    { item: "sinais_vitais", label: "Sinais vitais / SpO₂", done: has("vital_signs_requested") },
    { item: "conduta", label: "Antibiótico com dose", done: medComDose },
    { item: "diagnostico", label: "Hipótese diagnóstica", done: has("diagnosis_submitted") },
  ];

  const completedRequiredItems = requeridos.filter((r) => r.done).map((r) => r.label);
  const missingRequiredItems = requeridos.filter((r) => !r.done).map((r) => r.label);
  const confirmedStrengths = requeridos.filter((r) => r.done).map((r) => r.label);
  const confirmedWeaknesses = requeridos.filter((r) => !r.done).map((r) => `${r.label} não realizado(a)`);

  const criticalMismatches: StudentTraceCriticalMismatch[] = [];
  if (!has("auscultation_performed")) criticalMismatches.push({ item: "ausculta", descricao: "Sem evidência de ausculta — não elogiar achados de ausculta." });
  if (!hasExame(/rx|radiograf/i)) criticalMismatches.push({ item: "rx", descricao: "Sem evidência de RX — não elogiar solicitação de RX." });

  // forbiddenPraise: proibido elogiar AÇÃO sem QUALQUER evidência do evento
  // (independe do gabarito/dose — prescrever sem dose ainda é ter prescrito).
  const evidenciaAcao: Record<string, boolean> = {
    ausculta: has("auscultation_performed"),
    rx: hasExame(/rx|radiograf/i),
    hemograma: hasExame(/hemograma/i),
    sinais_vitais: has("vital_signs_requested"),
    diagnostico: has("diagnosis_submitted"),
    conduta: has("conduct_submitted") || has("medication_submitted"),
  };
  const forbiddenPraise: string[] = [];
  for (const [item, presente] of Object.entries(evidenciaAcao)) {
    if (!presente) forbiddenPraise.push(...(FORBIDDEN_POR_ITEM[item] ?? []));
  }

  return { completedRequiredItems, missingRequiredItems, confirmedStrengths, confirmedWeaknesses, criticalMismatches, forbiddenPraise: [...new Set(forbiddenPraise)] };
}

// ── Guardrail pós-geração (Tarefa 12) ────────────────────────────────────────
export interface GuardrailResult {
  ok: boolean;
  message: string;
  blockedBy?: string;
}

// Marcadores de NEGAÇÃO/CORREÇÃO — se antecedem a frase, NÃO é elogio (é crítica).
const NEGACAO = /(n[ao]o|sem|faltou|falta|deixou de|nunca|deveria|poderia|precisa(va)?|esqueceu|omitiu|nao houve|ausencia de|nao ha|nao foi|nao realizou)\s*$/;

/**
 * Bloqueia/substitui a fala apenas se ela ELOGIAR uma ação sem evidência.
 * Frases NEGADAS ("você não auscultou", "faltou pedir RX") são correções e passam.
 */
export function validateProfessorMessageAgainstTrace(message: string, forbiddenPraise: string[] | undefined): GuardrailResult {
  const texto = (message || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  for (const proibido of forbiddenPraise ?? []) {
    const alvo = proibido.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    if (!alvo) continue;
    let from = 0;
    let idx = texto.indexOf(alvo, from);
    while (idx !== -1) {
      const antes = texto.slice(Math.max(0, idx - 28), idx);
      if (!NEGACAO.test(antes)) {
        // Ocorrência afirmativa (elogio) → bloquear.
        return { ok: false, message: NEUTRAL_OPENING, blockedBy: proibido };
      }
      from = idx + alvo.length;
      idx = texto.indexOf(alvo, from);
    }
  }
  return { ok: true, message };
}
