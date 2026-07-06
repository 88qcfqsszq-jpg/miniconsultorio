// ============================================================================
// Exportação em PDF do Atendimento OSCE — relatório auditável
// ----------------------------------------------------------------------------
// Gera um PDF (jsPDF) com todo o registro do atendimento para auditoria:
// dados do caso, avaliação, desempenho por competência, anamnese, exame físico,
// exames, sinais vitais, diagnóstico, conduta, SOAP e log de eventos.
// NÃO altera nota, HealthBench, cards ou qualquer lógica de avaliação.
// ============================================================================

import { jsPDF } from "jspdf";

export interface DadosExportacaoAtendimento {
  caso: any;
  nomePaciente: string;
  tempoAtendimento: number; // segundos
  feedback: any;
  chatMessages?: any[];
  manobrasSolicitadas?: any[];
  examesSolicitados?: any[];
  sinaisVitais?: { solicitado?: boolean; dados?: any };
  diagnostico?: any;
  soap?: any;
}

const NAO_REGISTRADO = "Não registrado durante o atendimento.";

function slug(s: string): string {
  return (s || "")
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function fmtTempo(seg: number): string {
  const s = Math.max(0, Math.floor(seg || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}min ${r.toString().padStart(2, "0")}s`;
}

export function exportarAtendimentoPDF(dados: DadosExportacaoAtendimento): void {
  const {
    caso,
    nomePaciente,
    tempoAtendimento,
    feedback,
    chatMessages = [],
    manobrasSolicitadas = [],
    examesSolicitados = [],
    sinaisVitais,
    diagnostico,
    soap,
  } = dados;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const MARGIN = 15;
  const PAGE_W = 210;
  const PAGE_H = 297;
  const MAX_W = PAGE_W - MARGIN * 2;
  const BOTTOM = PAGE_H - 18;
  let y = MARGIN;

  const dataExport = new Date();
  const dataStr = dataExport.toLocaleString("pt-BR");

  function ensure(space: number) {
    if (y + space > BOTTOM) {
      doc.addPage();
      y = MARGIN;
    }
  }

  function tituloPrincipal(texto: string) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(30, 58, 138);
    doc.text(texto, MARGIN, y);
    y += 7;
  }

  function secao(texto: string) {
    ensure(14);
    y += 2;
    doc.setDrawColor(203, 213, 225);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 64, 175);
    doc.text(texto, MARGIN, y);
    y += 6;
    doc.setTextColor(15, 23, 42);
  }

  function sub(texto: string) {
    ensure(8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text(texto, MARGIN, y);
    y += 5;
    doc.setTextColor(15, 23, 42);
  }

  function paragrafo(texto: string, opts?: { indent?: number; size?: number }) {
    const indent = opts?.indent ?? 0;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(opts?.size ?? 10);
    doc.setTextColor(30, 41, 59);
    const linhas = doc.splitTextToSize(texto || "", MAX_W - indent);
    for (const linha of linhas) {
      ensure(5.2);
      doc.text(linha, MARGIN + indent, y);
      y += 5;
    }
  }

  function item(texto: string, marcador = "•") {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const linhas = doc.splitTextToSize(texto || "", MAX_W - 6);
    linhas.forEach((linha: string, i: number) => {
      ensure(5.2);
      doc.text(i === 0 ? `${marcador} ${linha}` : `   ${linha}`, MARGIN + 2, y);
      y += 5;
    });
  }

  function listaOuFallback(itens: any[] | undefined, marcador = "•") {
    const arr = Array.isArray(itens) ? itens.filter(Boolean) : [];
    if (arr.length === 0) {
      paragrafo(NAO_REGISTRADO, { indent: 2 });
      return;
    }
    arr.forEach((it) =>
      item(typeof it === "string" ? it : JSON.stringify(it), marcador)
    );
  }

  function espaco(n = 2) {
    y += n;
  }

  // ---------------------------------------------------------------- CABEÇALHO
  tituloPrincipal("Relatório do Atendimento OSCE");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("Registro auditável da simulação clínica", MARGIN, y);
  y += 6;

  const dxEsperado =
    feedback?.resumoCaso?.diagnosticoEsperado ||
    caso?.diagnostico_correto ||
    caso?.titulo ||
    NAO_REGISTRADO;
  const dxInformado =
    feedback?.resumoCaso?.diagnosticoInformado ||
    diagnostico?.hipotesePrincipal ||
    NAO_REGISTRADO;
  const nota = typeof feedback?.nota === "number" ? feedback.nota : null;
  const percentual =
    typeof feedback?.percentual === "number"
      ? feedback.percentual
      : nota != null
        ? Math.round((nota / 20) * 100)
        : null;

  espaco(2);
  doc.setTextColor(15, 23, 42);
  const dadosCab: [string, string][] = [
    ["Caso", caso?.titulo || NAO_REGISTRADO],
    ["Paciente simulado", nomePaciente || caso?.paciente?.nome || NAO_REGISTRADO],
    [
      "Idade / sexo",
      `${caso?.paciente?.idade ?? caso?.idade ?? "—"}${
        caso?.sexo || caso?.paciente?.sexo
          ? " / " + (caso?.sexo || caso?.paciente?.sexo)
          : ""
      }`,
    ],
    ["Tempo de atendimento", fmtTempo(tempoAtendimento)],
    ["Data/hora da exportação", dataStr],
    ["Diagnóstico esperado", dxEsperado],
    ["Diagnóstico informado", dxInformado],
    ["Nota final", nota != null ? `${nota}/20` : NAO_REGISTRADO],
    ["Desempenho", percentual != null ? `${percentual}%` : NAO_REGISTRADO],
  ];
  doc.setFontSize(10);
  for (const [k, v] of dadosCab) {
    ensure(5.4);
    doc.setFont("helvetica", "bold");
    doc.text(`${k}:`, MARGIN, y);
    doc.setFont("helvetica", "normal");
    const linhas = doc.splitTextToSize(v, MAX_W - 55);
    doc.text(linhas, MARGIN + 52, y);
    y += 5 * linhas.length;
  }

  // ------------------------------------------------------- RESUMO AVALIAÇÃO
  secao("1. Resumo da avaliação");
  paragrafo(
    `Nota final: ${nota != null ? nota + "/20" : NAO_REGISTRADO}   |   Desempenho: ${
      percentual != null ? percentual + "%" : "—"
    }   |   Classificação: ${feedback?.classificacao || "—"}`
  );
  espaco(1);
  sub("Feedback geral");
  paragrafo(feedback?.justificativaNota || NAO_REGISTRADO, { indent: 2 });

  const comps: any[] = Array.isArray(feedback?.rubricaAvaliacao)
    ? feedback.rubricaAvaliacao
    : [];
  const pontosFortes = comps.flatMap((c) => c?.acertos ?? []).slice(0, 6);
  const pontosMelhorar = comps.flatMap((c) => c?.melhorias ?? []).slice(0, 6);
  espaco(1);
  sub("Pontos fortes");
  listaOuFallback(pontosFortes, "+");
  espaco(1);
  sub("Pontos a melhorar");
  listaOuFallback(pontosMelhorar, "-");

  // ------------------------------------------- DESEMPENHO POR COMPETÊNCIA
  secao("2. Desempenho por competência");
  if (comps.length === 0) {
    paragrafo(NAO_REGISTRADO, { indent: 2 });
  } else {
    comps.forEach((c) => {
      ensure(10);
      sub(
        `${c?.nome || "Competência"} — ${c?.pontosObtidos ?? 0}/${
          c?.pontosMaximos ?? "—"
        }`
      );
      paragrafo("Acertos:", { indent: 2 });
      listaOuFallback(c?.acertos, "•");
      paragrafo("Melhorar:", { indent: 2 });
      listaOuFallback(c?.melhorias, "•");
      espaco(2);
    });
  }

  // ----------------------------------------------- TRANSCRIÇÃO ANAMNESE
  secao("3. Transcrição da anamnese");
  if (!Array.isArray(chatMessages) || chatMessages.length === 0) {
    paragrafo(NAO_REGISTRADO, { indent: 2 });
  } else {
    chatMessages.forEach((m: any) => {
      const quem = m?.tipo === "paciente" ? "Paciente" : "Aluno";
      sub(`${quem}:`);
      paragrafo(`"${m?.conteudo ?? ""}"`, { indent: 2 });
      espaco(1);
    });
  }

  // --------------------------------------------- EXAME FÍSICO REALIZADO
  secao("4. Exame físico realizado");
  if (!Array.isArray(manobrasSolicitadas) || manobrasSolicitadas.length === 0) {
    paragrafo(NAO_REGISTRADO, { indent: 2 });
  } else {
    // Agrupa por região: "[Exame Visual] <caminho> — <ação>" → caminho; senão categoria
    const grupos = new Map<string, string[]>();
    for (const m of manobrasSolicitadas) {
      const txt = (m?.textDigitado || "").toString();
      let regiao = m?.categoria || "Geral";
      if (txt.startsWith("[Exame Visual]")) {
        const semPref = txt.replace("[Exame Visual] ", "");
        regiao = semPref.split(" — ")[0] || regiao;
      }
      const linha = `${m?.resposta || txt || ""}`.trim();
      if (!grupos.has(regiao)) grupos.set(regiao, []);
      grupos.get(regiao)!.push(linha);
    }
    for (const [regiao, itens] of grupos) {
      sub(regiao);
      itens.forEach((it) => item(it, "•"));
      espaco(1);
    }
  }

  // ------------------------------------------ EXAMES COMPLEMENTARES
  secao("5. Exames complementares solicitados");
  if (!Array.isArray(examesSolicitados) || examesSolicitados.length === 0) {
    paragrafo(NAO_REGISTRADO, { indent: 2 });
  } else {
    examesSolicitados.forEach((e: any) => {
      const nome = e?.nome || "Exame";
      const res = e?.resultado ? ` — Resultado: ${e.resultado}` : "";
      item(`${nome}${res}`, "•");
    });
  }

  // ----------------------------------------------------- SINAIS VITAIS
  secao("6. Sinais vitais");
  const sv = sinaisVitais?.dados;
  if (!sinaisVitais?.solicitado || !sv) {
    paragrafo(NAO_REGISTRADO, { indent: 2 });
  } else {
    const campos: [string, any][] = [
      ["PA", sv.pressaoArterial],
      ["FC", sv.frequenciaCardiaca],
      ["FR", sv.frequenciaRespiratoria],
      ["Temperatura", sv.temperatura != null ? `${sv.temperatura}°C` : null],
      ["SpO₂", sv.saturacaoOxigenio != null ? `${sv.saturacaoOxigenio}%` : null],
      ["Glicemia", sv.glicemia != null ? `${sv.glicemia} mg/dL` : null],
      ["Dor", sv.dor ?? sv.escalaDor],
    ];
    campos
      .filter(([, v]) => v != null && v !== "")
      .forEach(([k, v]) => item(`${k}: ${v}`, "•"));
  }

  // ------------------------------------------ DIAGNÓSTICO E RACIOCÍNIO
  secao("7. Diagnóstico e raciocínio");
  sub("Hipótese principal informada");
  paragrafo(diagnostico?.hipotesePrincipal || NAO_REGISTRADO, { indent: 2 });
  sub("Diagnósticos diferenciais informados");
  listaOuFallback(diagnostico?.diagnosticosDisferenciais, "•");
  sub("Exames indicados (formulário)");
  listaOuFallback(diagnostico?.examesIndicados, "•");
  sub("Avaliação / raciocínio (feedback)");
  paragrafo(
    feedback?.raciocinioDiagnostico?.avaliacao ||
      feedback?.raciocinioDiagnostico?.comentario ||
      soap?.avaliacao ||
      NAO_REGISTRADO,
    { indent: 2 }
  );

  // ----------------------------------------------- CONDUTA E SEGURANÇA
  secao("8. Conduta e segurança");
  sub("Conduta registrada pelo aluno");
  paragrafo(diagnostico?.conduta || soap?.plano || NAO_REGISTRADO, { indent: 2 });
  sub("Conduta adequada (feedback)");
  listaOuFallback(feedback?.conduta?.adequada, "•");
  sub("Conduta incompleta / pendências (feedback)");
  listaOuFallback(feedback?.conduta?.incompleta, "•");

  // ------------------------------------------------------------- SOAP
  secao("9. SOAP / avaliação clínica escrita");
  sub("Subjetivo");
  paragrafo(soap?.subjetivo || NAO_REGISTRADO, { indent: 2 });
  sub("Objetivo");
  paragrafo(soap?.objetivo || NAO_REGISTRADO, { indent: 2 });
  sub("Avaliação");
  paragrafo(soap?.avaliacao || NAO_REGISTRADO, { indent: 2 });
  sub("Plano");
  paragrafo(soap?.plano || NAO_REGISTRADO, { indent: 2 });

  // -------------------------------------------- LOG DE EVENTOS (cronológico)
  secao("10. Log de eventos do atendimento");
  type Evt = { t: number; texto: string };
  const eventos: Evt[] = [];
  const ts = (x: any) => {
    const d = x?.timestamp ? new Date(x.timestamp).getTime() : NaN;
    return Number.isFinite(d) ? d : 0;
  };
  (chatMessages || []).forEach((m: any) =>
    eventos.push({
      t: ts(m),
      texto: `${m?.tipo === "paciente" ? "Paciente respondeu" : "Aluno perguntou"}: "${
        m?.conteudo ?? ""
      }"`,
    })
  );
  (manobrasSolicitadas || []).forEach((m: any) =>
    eventos.push({
      t: ts(m),
      texto: `Exame físico — ${(m?.textDigitado || "").replace(
        "[Exame Visual] ",
        ""
      )}: ${m?.resposta ?? ""}`,
    })
  );
  (examesSolicitados || []).forEach((e: any) =>
    eventos.push({ t: 0, texto: `Exame solicitado: ${e?.nome ?? ""}` })
  );
  if (diagnostico?.hipotesePrincipal)
    eventos.push({
      t: Number.MAX_SAFE_INTEGER - 2,
      texto: `Diagnóstico informado: ${diagnostico.hipotesePrincipal}`,
    });
  if (diagnostico?.conduta)
    eventos.push({
      t: Number.MAX_SAFE_INTEGER - 1,
      texto: `Conduta registrada: ${diagnostico.conduta}`,
    });
  eventos.push({
    t: Number.MAX_SAFE_INTEGER,
    texto: "Atendimento finalizado.",
  });

  const comTimestamp = eventos.filter((e) => e.t > 0);
  comTimestamp.sort((a, b) => a.t - b.t);
  const semTimestamp = eventos.filter((e) => e.t === 0);
  const ordenados = [...semTimestamp, ...comTimestamp];

  if (ordenados.length === 0) {
    paragrafo(NAO_REGISTRADO, { indent: 2 });
  } else {
    ordenados.forEach((e) => item(e.texto, "›"));
  }

  // -------------------------------------------------------- RODAPÉ (todas as páginas)
  const totalPaginas = doc.getNumberOfPages();
  for (let p = 1; p <= totalPaginas; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Exportado em ${dataStr}`, MARGIN, PAGE_H - 8);
    doc.text(
      `Página ${p} de ${totalPaginas}`,
      PAGE_W - MARGIN,
      PAGE_H - 8,
      { align: "right" }
    );
  }

  const nomeArq = `atendimento-osce-${slug(nomePaciente || "paciente")}-${slug(
    dxEsperado
  )}-${dataExport.toISOString().slice(0, 10)}.pdf`;
  doc.save(nomeArq);
}
