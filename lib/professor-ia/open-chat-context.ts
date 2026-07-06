// ============================================================================
// Professor IA — OPEN CHAT CONTEXT (Fase 24)
// ----------------------------------------------------------------------------
// Monta o contexto do CHAT ABERTO (conversa livre) do Professor IA a partir de:
//  1) dados estruturados do atendimento; 2) feedback/HealthBench; 3) StudentTrace;
//  4) Gold Standard/Truth Layers; 5) texto do PDF (complementar).
// PURO: sem IA/endpoint/banco. O ELOGIO continua vindo SÓ do StudentTrace.
// Regras de conflito: PDF < dados estruturados; conflito clínico → Gold Standard vence.
// ============================================================================

import { buildStudentTrace, summarizeStudentTrace, validateTraceAgainstGoldStandard, type StudentTraceInput } from "./student-trace";
import { PAC_GOLD_STANDARD } from "../../clinical-engine/gold-standard/pac-gold-standard";
import type { GoldStandardCase } from "../../clinical-engine/gold-standard/types";

export interface OpenChatFeedbackLike {
  nota?: number;
  classificacao?: string;
  competencias?: Array<{ nome?: string; competencia?: string; label?: string; pontos?: number; pontosObtidos?: number; aMelhorar?: string[] }>;
  errosCriticos?: any[];
  pontosAMelhorar?: string[];
}

export interface BuildOpenChatContextInput {
  caso?: any;
  feedback?: OpenChatFeedbackLike | any;
  atendimento?: StudentTraceInput & {
    diagnosisAndPlan?: { hipotesePrincipal?: string; diagnosticosDiferenciais?: string[]; conduta?: string; examesIndicados?: string[] };
    examRequests?: Array<{ nome?: string }>;
    soap?: { subjetivo?: string; objetivo?: string; avaliacao?: string; plano?: string };
  };
  goldStandard?: GoldStandardCase;
  pdfText?: string;
}

export interface OpenChatContext {
  systemContext: string;
  sourcesUsed: string[];
  warnings: string[];
  forbiddenPraise: string[];
  confirmedStrengths: string[];
}

function ehPAC(caso: any): boolean {
  const id = caso?.id ?? caso?.legacyId;
  if (id === 2 || id === "2") return true;
  const t = `${caso?.titulo ?? ""} ${caso?.diagnosticoCorreto ?? ""}`.toLowerCase();
  return /pneumonia|\bpac\b/.test(t);
}

/** Monta o contexto do chat aberto. Puro; StudentTrace = fonte única de elogio. */
export function buildProfessorOpenChatContext(input: BuildOpenChatContextInput): OpenChatContext {
  const sourcesUsed: string[] = [];
  const warnings: string[] = [];
  const at = input.atendimento ?? {};

  const goldStandard = input.goldStandard ?? (ehPAC(input.caso) ? PAC_GOLD_STANDARD : undefined);
  if (goldStandard) sourcesUsed.push("gold_standard");
  else warnings.push("Sem gabarito estruturado para este caso — correções clínicas ficam limitadas.");

  // StudentTrace (rastro real) — fonte única de elogio.
  const trace = buildStudentTrace(at);
  const traceSummary = summarizeStudentTrace(trace, goldStandard);
  const traceValidation = goldStandard ? validateTraceAgainstGoldStandard(trace, goldStandard) : undefined;
  if (trace.temEvidenciaMinima) sourcesUsed.push("student_trace");

  const fb = (input.feedback ?? {}) as OpenChatFeedbackLike;
  if (fb && (fb.nota != null || (fb.competencias?.length ?? 0) > 0)) sourcesUsed.push("feedback_healthbench");
  if (input.pdfText) sourcesUsed.push("pdf");

  const tl = goldStandard?.truthLayers;
  const linhas: string[] = ["# CONTEXTO DO ATENDIMENTO (para o Professor IA)"];

  // Diagnóstico esperado × informado.
  linhas.push(
    `Caso: ${goldStandard?.geradoDe.titulo ?? input.caso?.titulo ?? "—"}`,
    `Diagnóstico ESPERADO (gabarito): ${goldStandard?.diagnostico.principal ?? "—"}`,
    `Diagnóstico INFORMADO pelo aluno: ${at.diagnosisAndPlan?.hipotesePrincipal ?? "não informado"}`
  );

  // Nota + competências + erros + pontos a melhorar (feedback).
  if (fb.nota != null) linhas.push(`Nota: ${fb.nota}/20${fb.classificacao ? ` (${fb.classificacao})` : ""}`);
  const comps = (fb.competencias ?? []).map((c) => `${c.nome ?? c.competencia ?? c.label}${(c.pontos ?? c.pontosObtidos) != null ? `: ${c.pontos ?? c.pontosObtidos}` : ""}`).filter(Boolean);
  if (comps.length) linhas.push(`Competências: ${comps.join(" · ")}`);
  const erros = (fb.errosCriticos ?? []).map((e: any) => (typeof e === "string" ? e : e?.erro ?? e?.criterion)).filter(Boolean);
  if (erros.length) linhas.push(`Erros críticos (avaliação): ${erros.join("; ")}`);
  if (fb.pontosAMelhorar?.length) linhas.push(`Pontos a melhorar: ${fb.pontosAMelhorar.join("; ")}`);

  // StudentTrace — o que o aluno REALMENTE fez.
  linhas.push("", "## Rastro REAL do aluno (StudentTrace) — base do elogio");
  linhas.push(`Ações COMPROVADAS (só estas podem ser elogiadas): ${traceSummary.confirmedStrengths.length ? traceSummary.confirmedStrengths.map((s) => s.texto).join("; ") : "(nenhuma — NÃO elogie ação específica)"}`);
  if (traceSummary.omissoes.length) linhas.push(`Omissões: ${traceSummary.omissoes.map((o) => o.descricao).join("; ")}`);
  if (traceValidation?.forbiddenPraise.length) linhas.push(`Elogios PROIBIDOS (sem evidência): ${traceValidation.forbiddenPraise.join("; ")}`);
  if (traceSummary.examesPedidos.length) linhas.push(`Exames que o aluno pediu: ${traceSummary.examesPedidos.join(", ")}`);
  if (at.soap) linhas.push(`SOAP preenchido: ${[at.soap.subjetivo && "S", at.soap.objetivo && "O", at.soap.avaliacao && "A", at.soap.plano && "P"].filter(Boolean).join("")}`);
  if (at.diagnosisAndPlan?.conduta) linhas.push(`Conduta escrita pelo aluno: ${at.diagnosisAndPlan.conduta}`);

  // Gold Standard (gabarito) + Truth Layers.
  if (goldStandard) {
    linhas.push("", "## Gabarito (Gold Standard) — o que DEVERIA ser feito");
    linhas.push(`Conduta ideal: ${goldStandard.conduta.condutaIdeal.join("; ")}`);
    linhas.push(`Checklist obrigatório: ${(goldStandard.feedbackModelo.checklistNotaMaxima ?? []).slice(0, 8).join("; ")}`);
    if (tl?.clinical.sinaisDeGravidade.length) linhas.push(`Sinais de gravidade: ${tl.clinical.sinaisDeGravidade.join("; ")}`);
    if (tl?.educational.pegadinhas.length) linhas.push(`Pegadinhas: ${tl.educational.pegadinhas.join("; ")}`);
    linhas.push(`Resposta modelo: ${goldStandard.feedbackModelo.respostaModelo}`);
  }

  // PDF (complementar).
  if (input.pdfText) {
    linhas.push("", "## Texto do atendimento (PDF) — evidência COMPLEMENTAR", input.pdfText.slice(0, 4000));
  }

  return {
    systemContext: linhas.filter(Boolean).join("\n"),
    sourcesUsed,
    warnings,
    forbiddenPraise: traceValidation?.forbiddenPraise ?? [],
    confirmedStrengths: traceSummary.confirmedStrengths.map((s) => s.texto),
  };
}
