// ============================================================================
// Texto do atendimento (Fase 24) — conteúdo textual REAPROVEITADO do PDF.
// ----------------------------------------------------------------------------
// Produz o MESMO conteúdo que o PDF de atendimento contém, em texto puro, para
// alimentar o Chat Aberto do Professor IA como EVIDÊNCIA COMPLEMENTAR (não OCR,
// não parse de binário). Fonte: os mesmos dados de `exportarAtendimentoPDF`.
// ============================================================================

import type { DadosExportacaoAtendimento } from "./exportar-feedback-atendimento";

function fmtTempo(seg: number): string {
  const s = Math.max(0, Math.floor(seg || 0));
  return `${Math.floor(s / 60)}min ${(s % 60).toString().padStart(2, "0")}s`;
}

function linhasDe(items: any[] | undefined, mapear: (x: any) => string): string[] {
  return (Array.isArray(items) ? items : []).map(mapear).filter(Boolean);
}

/** Monta o texto do atendimento (equivalente ao conteúdo do PDF). Puro. */
export function montarTextoAtendimento(dados: DadosExportacaoAtendimento): string {
  const { caso, nomePaciente, tempoAtendimento, feedback, chatMessages, manobrasSolicitadas, examesSolicitados, sinaisVitais, diagnostico, soap } = dados;
  const L: string[] = [];

  L.push("# REGISTRO DO ATENDIMENTO (texto do PDF)");
  L.push(`Caso: ${caso?.titulo ?? caso?.nome ?? "—"}`);
  if (nomePaciente) L.push(`Paciente: ${nomePaciente}`);
  L.push(`Tempo de atendimento: ${fmtTempo(tempoAtendimento)}`);

  if (feedback) {
    L.push("", "## Avaliação");
    if (feedback.nota != null) L.push(`Nota: ${feedback.nota}/20`);
    if (feedback.classificacao) L.push(`Classificação: ${feedback.classificacao}`);
    const comps = feedback.competencias ?? feedback.criterios ?? [];
    for (const c of comps) {
      const nome = c?.nome ?? c?.competencia ?? c?.label;
      const pts = c?.pontos ?? c?.pontosObtidos;
      if (nome) L.push(`- ${nome}${pts != null ? `: ${pts}` : ""}`);
    }
    const erros = feedback.errosCriticos ?? feedback.erros_criticos ?? [];
    if (erros.length) L.push(`Erros críticos: ${erros.map((e: any) => (typeof e === "string" ? e : e?.erro ?? e?.criterion)).filter(Boolean).join("; ")}`);
  }

  const chat = linhasDe(chatMessages, (m) => {
    const autor = (m?.tipo || m?.role || "").toLowerCase();
    const quem = /estud|student|aluno|user|doutor/.test(autor) ? "Aluno" : /pac|patient/.test(autor) ? "Paciente" : "Sistema";
    const txt = m?.conteudo ?? m?.content ?? "";
    return txt ? `${quem}: ${txt}` : "";
  });
  if (chat.length) { L.push("", "## Conversa (anamnese)"); L.push(...chat.slice(0, 40)); }

  const manobras = linhasDe(manobrasSolicitadas, (x) => (typeof x === "string" ? x : x?.texto ?? x?.nome ?? x?.acao ?? ""));
  if (manobras.length) { L.push("", "## Exame físico / manobras"); L.push(...manobras.map((m) => `- ${m}`)); }

  const exames = linhasDe(examesSolicitados, (x) => (typeof x === "string" ? x : x?.nome ?? x?.exame ?? x?.titulo ?? ""));
  if (exames.length) { L.push("", "## Exames solicitados"); L.push(...exames.map((e) => `- ${e}`)); }

  if (sinaisVitais) {
    L.push("", "## Sinais vitais");
    L.push(sinaisVitais.solicitado ? `Solicitados${sinaisVitais.dados ? `: ${typeof sinaisVitais.dados === "string" ? sinaisVitais.dados : JSON.stringify(sinaisVitais.dados)}` : ""}` : "Não solicitados.");
  }

  if (diagnostico) {
    L.push("", "## Diagnóstico e conduta (aluno)");
    const dx = diagnostico.hipotesePrincipal ?? diagnostico.diagnosticoPrincipal ?? diagnostico.principal ?? diagnostico.hipotese;
    if (dx) L.push(`Hipótese: ${dx}`);
    const dif = diagnostico.diagnosticosDiferenciais ?? diagnostico.diferenciais ?? [];
    if (dif.length) L.push(`Diferenciais: ${dif.join(", ")}`);
    if (diagnostico.conduta) L.push(`Conduta: ${diagnostico.conduta}`);
  }

  if (soap) {
    L.push("", "## SOAP");
    if (soap.subjetivo) L.push(`S: ${soap.subjetivo}`);
    if (soap.objetivo) L.push(`O: ${soap.objetivo}`);
    if (soap.avaliacao) L.push(`A: ${soap.avaliacao}`);
    if (soap.plano) L.push(`P: ${soap.plano}`);
  }

  return L.filter((x) => x !== undefined).join("\n");
}
