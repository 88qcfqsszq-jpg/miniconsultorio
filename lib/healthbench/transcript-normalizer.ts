/**
 * Transcript Normalizer — transforma TODO o atendimento numa linha do tempo única.
 *
 * Entrada: payload bruto do atendimento (mesmo já coletado no botão Finalizar).
 * Saída: HealthBenchMessage[] (chat + ações + eventos + resposta final).
 */

import type {
  HealthBenchAtendimentoInput,
  HealthBenchMessage,
  HealthBenchTranscript,
} from "./types";

function texto(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v.trim();
  return String(v).trim();
}

/** Converte os sinais vitais (objeto) numa frase legível para o grader. */
function descreverSinaisVitais(dados: Record<string, unknown> | undefined): string {
  if (!dados) return "";
  const partes: string[] = [];
  const mapa: Record<string, string> = {
    pressaoArterial: "PA",
    frequenciaCardiaca: "FC",
    frequenciaRespiratoria: "FR",
    temperatura: "Temp",
    saturacaoO2: "SpO2",
    saturacao: "SpO2",
    glicemia: "Glicemia",
    dor: "Dor",
  };
  for (const [chave, label] of Object.entries(mapa)) {
    const valor = (dados as any)[chave];
    if (valor !== undefined && valor !== null && texto(valor) !== "") {
      partes.push(`${label} ${texto(valor)}`);
    }
  }
  return partes.join(", ");
}

export function normalizarTranscript(
  input: HealthBenchAtendimentoInput
): HealthBenchTranscript {
  const timeline: HealthBenchMessage[] = [];

  // 1. Chat paciente <-> aluno (preserva ordem)
  for (const msg of input.chatMessages ?? []) {
    const conteudo = texto(msg.conteudo ?? msg.content);
    if (!conteudo) continue;
    const tipo = (msg.tipo ?? msg.role ?? "").toLowerCase();
    const role: HealthBenchMessage["role"] =
      tipo === "paciente" || tipo === "patient" ? "patient" : "student";
    timeline.push({ role, content: conteudo });
  }

  // 2. Exame físico solicitado/interativo (ação do aluno + achado objetivo)
  const achadosFisicos = (input.physicalExamEvents ?? [])
    .map((ev) => `${texto(ev.textDigitado) || texto(ev.categoria)}: ${texto(ev.resposta)}`)
    .filter((s) => s.replace(/[:\s]/g, "").length > 0);
  if (achadosFisicos.length) {
    console.log("[OSCE PHYSICAL FINDINGS PAYLOAD] achados enviados ao HealthBench:", achadosFisicos);
  }
  for (const ev of input.physicalExamEvents ?? []) {
    const manobra = texto(ev.textDigitado) || texto(ev.categoria);
    if (manobra) {
      timeline.push({
        role: "student_action",
        content: `Aluno solicitou exame físico: ${manobra}${
          ev.categoria ? ` (${texto(ev.categoria)})` : ""
        }.`,
      });
    }
    const resposta = texto(ev.resposta);
    if (resposta) {
      timeline.push({ role: "system_event", content: `Achado: ${resposta}` });
    }
  }

  // 3. Sinais vitais
  if (input.vitalSignsEvents?.solicitado) {
    const desc = descreverSinaisVitais(input.vitalSignsEvents.dados);
    timeline.push({
      role: "student_action",
      content: "Aluno solicitou sinais vitais.",
    });
    timeline.push({
      role: "system_event",
      content: desc ? `Sinais vitais: ${desc}.` : "Sinais vitais coletados.",
    });
  }

  // 4. Exames complementares
  for (const ex of input.examRequests ?? []) {
    const nome = texto(ex.nome);
    if (!nome) continue;
    timeline.push({
      role: "student_action",
      content: `Aluno solicitou exame complementar: ${nome}.`,
    });
    const resultado = texto(ex.resultado);
    if (resultado) {
      timeline.push({
        role: "system_event",
        content: `Resultado de ${nome}: ${resultado}`,
      });
    }
  }

  // 5. Eventos extras já em formato timeline (opcional)
  for (const ev of input.eventosDoAtendimento ?? []) {
    if (ev && texto(ev.content)) {
      timeline.push({ role: ev.role ?? "system_event", content: texto(ev.content) });
    }
  }

  // 6. Resposta final do aluno (hipótese + diferenciais + exames + conduta + SOAP)
  const dp = input.diagnosisAndPlan ?? {};
  const partesFinais: string[] = [];
  if (texto(dp.hipotesePrincipal)) {
    partesFinais.push(`Hipótese principal: ${texto(dp.hipotesePrincipal)}`);
  }
  if (dp.diagnosticosDiferenciais?.length) {
    partesFinais.push(
      `Diagnósticos diferenciais: ${dp.diagnosticosDiferenciais
        .map(texto)
        .filter(Boolean)
        .join("; ")}`
    );
  }
  if (dp.examesIndicados?.length) {
    partesFinais.push(
      `Exames indicados: ${dp.examesIndicados.map(texto).filter(Boolean).join("; ")}`
    );
  }
  if (texto(dp.conduta)) {
    partesFinais.push(`Conduta: ${texto(dp.conduta)}`);
  }

  const soap = input.soap ?? {};
  const partesSoap: string[] = [];
  if (texto(soap.subjetivo)) partesSoap.push(`S: ${texto(soap.subjetivo)}`);
  if (texto(soap.objetivo)) partesSoap.push(`O: ${texto(soap.objetivo)}`);
  if (texto(soap.avaliacao)) partesSoap.push(`A: ${texto(soap.avaliacao)}`);
  if (texto(soap.plano)) partesSoap.push(`P: ${texto(soap.plano)}`);
  if (partesSoap.length) {
    partesFinais.push(`SOAP — ${partesSoap.join(" | ")}`);
  }

  if (partesFinais.length) {
    timeline.push({
      role: "student_final_answer",
      content: partesFinais.join("\n"),
    });
  }

  return timeline;
}

/** Serializa o transcript para texto usado no prompt do grader. */
export function transcriptParaTexto(transcript: HealthBenchTranscript): string {
  const labels: Record<HealthBenchMessage["role"], string> = {
    patient: "PACIENTE",
    student: "ALUNO",
    student_action: "AÇÃO DO ALUNO",
    student_final_answer: "RESPOSTA FINAL DO ALUNO",
    system_event: "EVENTO/RESULTADO",
  };
  return transcript
    .map((m) => `[${labels[m.role] ?? m.role}] ${m.content}`)
    .join("\n");
}
