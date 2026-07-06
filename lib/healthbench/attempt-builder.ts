/**
 * Attempt Builder — monta o payload oficial da tentativa OSCE a partir dos
 * dados brutos do frontend. Centraliza a lógica para que o frontend NÃO precise
 * montar estruturas HealthBench manualmente.
 *
 * Reaproveita o normalizarTranscript() existente (não duplica lógica de timeline).
 */

import {
  normalizarModo,
  type OSCEAttemptEvent,
  type OSCEAttemptInput,
  type OSCEAttemptSnapshot,
} from "./attempt-schema";
import { normalizarTranscript } from "./transcript-normalizer";
import type { HealthBenchAtendimentoInput, HealthBenchMessage } from "./types";

function gerarAttemptId(casoId: number | string): string {
  return `hb_${casoId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function texto(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

/**
 * Converte os canais extras (imagem/ECG) em mensagens de contexto para o transcript.
 * Esses canais não são pontuados diretamente ainda, mas dão contexto ao grader.
 */
function eventosExtrasParaTranscript(input: OSCEAttemptInput): HealthBenchMessage[] {
  const extras: HealthBenchMessage[] = [];

  for (const ev of input.imageExamEvents ?? []) {
    const desc = texto(ev.descricao) || texto(ev.tipo) || "exame de imagem";
    extras.push({
      role: "student_action",
      content: `Aluno consultou exame de imagem: ${desc}.`,
    });
    const resultado = texto(ev.resultado);
    if (resultado) {
      extras.push({ role: "system_event", content: `Imagem — ${resultado}` });
    }
  }

  for (const ev of input.ecgEvents ?? []) {
    const desc = texto(ev.descricao) || texto(ev.tipo) || "ECG";
    extras.push({ role: "student_action", content: `Aluno solicitou ECG: ${desc}.` });
    const laudo = texto(ev.laudo);
    if (laudo) {
      extras.push({ role: "system_event", content: `ECG — ${laudo}` });
    }
  }

  return extras;
}

/** Lista de eventos brutos (auditável) para persistência. */
function montarEventos(input: OSCEAttemptInput): OSCEAttemptEvent[] {
  const eventos: OSCEAttemptEvent[] = [];

  for (const m of input.chatMessages ?? []) {
    eventos.push({
      kind: "chat",
      role: (m.tipo ?? m.role) === "paciente" ? "patient" : "student",
      content: texto(m.conteudo ?? m.content),
    });
  }
  for (const e of input.physicalExamEvents ?? []) {
    eventos.push({
      kind: "physical_exam",
      label: texto(e.categoria),
      content: `${texto(e.textDigitado)} → ${texto(e.resposta)}`,
    });
  }
  if (input.vitalSignsEvents?.solicitado) {
    eventos.push({ kind: "vital_signs", raw: input.vitalSignsEvents.dados });
  }
  for (const e of input.examRequests ?? []) {
    eventos.push({ kind: "exam_request", label: texto(e.nome), content: texto(e.resultado) });
  }
  for (const e of input.imageExamEvents ?? []) {
    eventos.push({ kind: "image_exam", label: texto(e.tipo), content: texto(e.resultado) });
  }
  for (const e of input.ecgEvents ?? []) {
    eventos.push({ kind: "ecg", label: texto(e.tipo), content: texto(e.laudo) });
  }
  if (input.diagnosisAndPlan) {
    eventos.push({
      kind: "final_answer",
      content: texto(input.diagnosisAndPlan.hipotesePrincipal),
      raw: input.diagnosisAndPlan,
    });
  }

  return eventos;
}

/**
 * Constrói o snapshot da tentativa (transcript + eventos + metadados).
 */
export function construirSnapshot(input: OSCEAttemptInput): OSCEAttemptSnapshot {
  const attemptId = input.attemptId || gerarAttemptId(input.casoId);
  const mode = normalizarModo(input.mode);
  const agora = new Date().toISOString();

  // Transcript principal (chat + exame + vitais + exames + final) via função existente,
  // somando os eventos extras (imagem/ECG) como contexto.
  const baseInput: HealthBenchAtendimentoInput = {
    casoId: input.casoId,
    attemptId,
    chatMessages: input.chatMessages,
    physicalExamEvents: input.physicalExamEvents,
    vitalSignsEvents: input.vitalSignsEvents,
    examRequests: input.examRequests,
    diagnosisAndPlan: input.diagnosisAndPlan,
    soap: input.soap,
    eventosDoAtendimento: eventosExtrasParaTranscript(input),
    mode: input.mode,
    tempoAtendimento: input.tempoAtendimento,
  };

  const transcript = normalizarTranscript(baseInput);

  const snapshot: OSCEAttemptSnapshot = {
    casoId: Number(input.casoId),
    attemptId,
    alunoId: input.alunoId,
    mode,
    startedAt: input.startedAt || agora,
    finishedAt: agora,
    tempoAtendimento: input.tempoAtendimento,
    transcript,
    eventosDoAtendimento: montarEventos(input),
    soap: input.soap,
    diagnosisAndPlan: input.diagnosisAndPlan,
  };

  console.log("[HEALTHBENCH ATTEMPT BUILDER]", {
    attemptId,
    casoId: snapshot.casoId,
    mode,
    transcript: transcript.length,
    eventos: snapshot.eventosDoAtendimento.length,
  });

  return snapshot;
}

/**
 * Constrói o input técnico para evaluateHealthBenchAttempt a partir do snapshot.
 * (O evaluator aceita o payload bruto; aqui garantimos consistência do attemptId.)
 */
export function snapshotParaAtendimentoInput(
  input: OSCEAttemptInput,
  attemptId: string
): HealthBenchAtendimentoInput {
  return {
    casoId: input.casoId,
    attemptId,
    chatMessages: input.chatMessages,
    physicalExamEvents: input.physicalExamEvents,
    vitalSignsEvents: input.vitalSignsEvents,
    examRequests: input.examRequests,
    diagnosisAndPlan: input.diagnosisAndPlan,
    soap: input.soap,
    eventosDoAtendimento: eventosExtrasParaTranscript(input),
    mode: input.mode,
    tempoAtendimento: input.tempoAtendimento,
  };
}
