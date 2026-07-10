"use client";

import type { FeedbackOSCE } from "@/lib/types";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { exportarAtendimentoPDF } from "@/lib/pdf/exportar-feedback-atendimento";
import { montarTextoAtendimento } from "@/lib/pdf/texto-atendimento";
// ProfessorIAPreview (diagnóstico/plano/recursos/base/preview) permanece no código,
// mas NÃO é mais renderizado na UI (Fase 25 — apenas chat limpo).
import ProfessorIAOpenChat from "@/components/professor-ia/ProfessorIAOpenChat";
import { buildProfessorIAPreview } from "@/lib/professor-ia/preview-builder";

interface FeedbackOSCEProps {
  feedback: FeedbackOSCE;
  nomePaciente: string;
  tempoDecorrido: number;
  caso?: any;
  // Dados brutos do atendimento (auditoria/PDF) — opcionais, não quebram chamadas existentes
  chatMessages?: any[];
  manobrasSolicitadas?: any[];
  examesSolicitados?: any[];
  sinaisVitais?: { solicitado?: boolean; dados?: any };
  vitalSignsReassessment?: {
    realizado?: boolean;
    minutos?: number;
    exitVitals?: Record<string, unknown>;
    therapeuticResponseLabel?: string;
    disposition?: string;
    stabilityLabel?: string;
  } | null;
  diagnostico?: any;
  soap?: any;
}

const limitar = (items: any[], max: number = 2) => {
  if (!items || items.length === 0) return [];
  return items.slice(0, max);
};

function sugestaoRecuperarPontos(competencia: string): string {
  const nome = competencia.toLowerCase();

  if (nome.includes("comunicação")) {
    return "Apresente-se, confirme a identidade do paciente, explique o atendimento, peça consentimento e mantenha linguagem acolhedora.";
  }

  if (nome.includes("anamnese")) {
    return "Explore início, duração, evolução, sintomas associados, fatores de risco, antecedentes, medicamentos, alergias e sinais de gravidade.";
  }

  if (nome.includes("exame físico")) {
    return "Realize sinais vitais e exame físico direcionado ao caso, incluindo inspeção, palpação, percussão e ausculta quando aplicável.";
  }

  if (nome.includes("exames")) {
    return "Solicite exames essenciais para confirmar a hipótese principal, avaliar gravidade e excluir diagnósticos diferenciais importantes.";
  }

  if (nome.includes("raciocínio")) {
    return "Declare o diagnóstico principal, justifique com achados do caso e cite diagnósticos diferenciais plausíveis.";
  }

  if (nome.includes("conduta")) {
    return "Antes de finalizar, confirme estabilidade clínica, reavalie resposta à conduta, revise riscos, oriente sinais de alarme e indique encaminhamento ou retorno quando necessário.";
  }

  return "Revise os objetivos da estação e compare sua resposta com a sequência ideal do caso.";
}

function ListaDetalheRubrica({
  titulo,
  itens,
  fallback,
}: {
  titulo: string;
  itens?: string[];
  fallback: string;
}) {
  const lista = Array.isArray(itens) ? itens.filter(Boolean) : [];

  return (
    <div className="space-y-2">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">
        {titulo}
      </p>

      {lista.length > 0 ? (
        <ul className="space-y-1 text-sm font-medium text-slate-700">
          {lista.map((item, index) => (
            <li key={index} className="leading-relaxed">
              • {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">{fallback}</p>
      )}
    </div>
  );
}

export default function FeedbackOSCE({
  feedback,
  nomePaciente,
  tempoDecorrido,
  caso,
  chatMessages,
  manobrasSolicitadas,
  vitalSignsReassessment,
  examesSolicitados,
  sinaisVitais,
  diagnostico,
  soap,
}: FeedbackOSCEProps) {
  const minutos = Math.floor(tempoDecorrido / 60);
  const segundos = tempoDecorrido % 60;
  const notaMaxima = (caso as any)?.feedbackDetalhado?.escala?.total ?? 20;
  const percentual = Math.round((feedback.nota / notaMaxima) * 100);
  const [trofeuFailed, setTrofeuFailed] = useState(false);
  const [exportandoPDF, setExportandoPDF] = useState(false);
  const [erroPDF, setErroPDF] = useState(false);

  const handleExportarPDF = () => {
    setErroPDF(false);
    setExportandoPDF(true);
    try {
      exportarAtendimentoPDF({
        caso,
        nomePaciente,
        tempoAtendimento: tempoDecorrido,
        feedback,
        chatMessages,
        manobrasSolicitadas,
        examesSolicitados,
        sinaisVitais,
        vitalSignsReassessment,
        diagnostico,
        soap,
      });
    } catch (e) {
      console.error("Erro ao exportar PDF do atendimento:", e);
      setErroPDF(true);
    } finally {
      setExportandoPDF(false);
    }
  };
  const [rubricaAberta, setRubricaAberta] = useState<string | null>(null);
  const [estudoExpandido, setEstudoExpandido] = useState(false);
  const [estudoFinal, setEstudoFinal] = useState<any | null>(null);
  const [carregandoEstudoFinal, setCarregandoEstudoFinal] = useState(false);
  const [erroEstudoFinal, setErroEstudoFinal] = useState<string | null>(null);

  const isAprovado = feedback.nota >= 17;

  // Professor IA — preview estrutural (Fase 17). Puro, sem IA/endpoint/banco.
  // Fase 22: mapeia os dados REAIS do atendimento → StudentTrace (fonte única de elogio).
  // Mapeamento defensivo: o que não existir vira ausência de evidência (comportamento conservador).
  const professorPreview = useMemo(() => {
    try {
      const examRequests = (Array.isArray(examesSolicitados) ? examesSolicitados : []).map((x: any) =>
        typeof x === "string" ? { nome: x } : { nome: x?.nome ?? x?.exame ?? x?.titulo ?? String(x?.label ?? ""), resultado: x?.resultado }
      );
      const physicalExamEvents = (Array.isArray(manobrasSolicitadas) ? manobrasSolicitadas : []).map((x: any) =>
        typeof x === "string"
          ? { textDigitado: x }
          : { textDigitado: x?.texto ?? x?.textDigitado ?? x?.nome ?? x?.acao ?? String(x?.label ?? ""), resposta: x?.resposta ?? x?.resultado, local: x?.local }
      );
      const dx: any = diagnostico ?? {};
      const diagnosisAndPlan = {
        hipotesePrincipal: dx.hipotesePrincipal ?? dx.diagnosticoPrincipal ?? dx.principal ?? dx.hipotese,
        diagnosticosDiferenciais: dx.diagnosticosDiferenciais ?? dx.diferenciais ?? [],
        examesIndicados: dx.examesIndicados ?? [],
        conduta: dx.conduta ?? (soap as any)?.plano,
      };
      const sv: any = sinaisVitais ?? {};
      return buildProfessorIAPreview({
        caso,
        notaReal: feedback?.nota,
        estudoFinal: estudoFinal ?? undefined,
        chatMessages: Array.isArray(chatMessages) ? chatMessages : undefined,
        physicalExamEvents,
        examRequests,
        sinaisVitais: { solicitado: !!(sv.solicitado ?? sv.dados), dados: sv.dados },
        diagnosisAndPlan,
        soap: soap ?? undefined,
        tempoAtendimentoSegundos: tempoDecorrido,
      });
    } catch (e) {
      console.error("Falha ao montar o preview do Professor IA:", e);
      return null;
    }
  }, [caso, feedback?.nota, estudoFinal, chatMessages, manobrasSolicitadas, examesSolicitados, sinaisVitais, diagnostico, soap, tempoDecorrido]);

  // Fase 24: dados do atendimento para o Chat Aberto (mapeamento defensivo) + texto do PDF.
  const professorAtendimento = useMemo(() => {
    const examRequests = (Array.isArray(examesSolicitados) ? examesSolicitados : []).map((x: any) =>
      typeof x === "string" ? { nome: x } : { nome: x?.nome ?? x?.exame ?? x?.titulo ?? String(x?.label ?? "") }
    );
    const physicalExamEvents = (Array.isArray(manobrasSolicitadas) ? manobrasSolicitadas : []).map((x: any) =>
      typeof x === "string" ? { textDigitado: x } : { textDigitado: x?.texto ?? x?.textDigitado ?? x?.nome ?? x?.acao ?? String(x?.label ?? ""), resposta: x?.resposta ?? x?.resultado, local: x?.local }
    );
    const dx: any = diagnostico ?? {};
    const sv: any = sinaisVitais ?? {};
    return {
      chatMessages: Array.isArray(chatMessages) ? chatMessages : [],
      physicalExamEvents,
      examRequests,
      sinaisVitais: { solicitado: !!(sv.solicitado ?? sv.dados), dados: sv.dados },
      diagnosisAndPlan: {
        hipotesePrincipal: dx.hipotesePrincipal ?? dx.diagnosticoPrincipal ?? dx.principal ?? dx.hipotese,
        diagnosticosDiferenciais: dx.diagnosticosDiferenciais ?? dx.diferenciais ?? [],
        examesIndicados: dx.examesIndicados ?? [],
        conduta: dx.conduta ?? (soap as any)?.plano,
      },
      soap: soap ?? undefined,
      tempoAtendimentoSegundos: tempoDecorrido,
    };
  }, [chatMessages, manobrasSolicitadas, examesSolicitados, sinaisVitais, diagnostico, soap, tempoDecorrido]);

  const professorPdfText = useMemo(() => {
    try {
      return montarTextoAtendimento({ caso, nomePaciente, tempoAtendimento: tempoDecorrido, feedback, chatMessages, manobrasSolicitadas, examesSolicitados, sinaisVitais, diagnostico, soap });
    } catch {
      return undefined;
    }
  }, [caso, nomePaciente, tempoDecorrido, feedback, chatMessages, manobrasSolicitadas, examesSolicitados, sinaisVitais, diagnostico, soap]);

  useEffect(() => {
    async function carregarEstudoFinal() {
      try {
        setCarregandoEstudoFinal(true);
        setErroEstudoFinal(null);

        const response = await fetch("/api/estudo-final-caso", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            caso,
            feedback,
            rubricaAvaliacao: feedback?.rubricaAvaliacao,
            diagnosticoEsperado: feedback?.resumoCaso?.diagnosticoEsperado,
            diagnosticoInformado: feedback?.resumoCaso?.diagnosticoEsperado,
          }),
        });

        if (!response.ok) {
          throw new Error("Erro ao gerar estudo final do caso");
        }

        const data = await response.json();
        setEstudoFinal(data);
      } catch (error) {
        console.error("Erro ao carregar estudo final:", error);
        setErroEstudoFinal("Não foi possível gerar o estudo final individualizado agora.");
      } finally {
        setCarregandoEstudoFinal(false);
      }
    }

    if (feedback) {
      carregarEstudoFinal();
    }
  }, [feedback, caso]);

  // Assets dos cards
  const assetsCards = [
    { src: "/images/feedback/jaleco.png", alt: "Comunicação" },
    { src: "/images/feedback/checklist.png", alt: "Anamnese" },
    { src: "/images/feedback/estetoscopio.png", alt: "Exame físico" },
    { src: "/images/feedback/microscopio.png", alt: "Exames" },
    { src: "/images/feedback/simbolo-medicina.png", alt: "Raciocínio" },
    { src: "/images/feedback/checklist.png", alt: "Conduta" },
  ];

  // Cores para cada competência
  const competenciasCores = [
    { cor: "blue", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-900", asset: assetsCards[0] },
    { cor: "cyan", bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-900", asset: assetsCards[1] },
    { cor: "violet", bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-900", asset: assetsCards[2] },
    { cor: "emerald", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-900", asset: assetsCards[3] },
    { cor: "amber", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-900", asset: assetsCards[4] },
    { cor: "rose", bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-900", asset: assetsCards[5] },
  ];

  const obterCorTexto = (cor: string) => {
    const cores: Record<string, string> = {
      blue: "text-blue-700",
      cyan: "text-cyan-700",
      violet: "text-violet-700",
      emerald: "text-emerald-700",
      amber: "text-amber-700",
      rose: "text-rose-700",
    };
    return cores[cor] || "text-blue-700";
  };

  const obterCorFundo = (cor: string) => {
    const cores: Record<string, string> = {
      blue: "bg-blue-200",
      cyan: "bg-cyan-200",
      violet: "bg-violet-200",
      emerald: "bg-emerald-200",
      amber: "bg-amber-200",
      rose: "bg-rose-200",
    };
    return cores[cor] || "bg-blue-200";
  };

  return (
    <main className="w-full min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
      <div className="w-full max-w-none space-y-6">
        {/* CARD PRINCIPAL AZUL */}
        <section className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-8 py-10 text-white shadow-xl border border-blue-900/40">
          {/* BOTÃO EXPORTAR PDF (secundário, canto superior direito) */}
          <div className="absolute right-6 top-6 z-10 flex flex-col items-end gap-1">
            <button
              type="button"
              onClick={handleExportarPDF}
              disabled={exportandoPDF}
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-50 backdrop-blur-sm transition-colors hover:bg-white/20 disabled:opacity-60"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {exportandoPDF ? "Gerando PDF…" : "Exportar PDF do Atendimento"}
            </button>
            {erroPDF && (
              <span className="text-xs text-rose-300">
                Não foi possível gerar o PDF. Tente novamente.
              </span>
            )}
          </div>

          {/* TÍTULO */}
          <div className="mb-10 pr-0 sm:pr-64">
            <h1 className="text-4xl md:text-5xl font-black text-white">
              Feedback do Atendimento
            </h1>
            <p className="mt-3 text-base md:text-lg text-blue-100">
              {nomePaciente} • {minutos}m {segundos}s
            </p>
          </div>

          {/* GRID: 4 ÁREAS */}
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[260px_220px_minmax(0,1fr)_300px] xl:items-center">
            {/* ÁREA 1: NOTA */}
            <div className="flex flex-col justify-center">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-200">
                Nota final
              </p>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-7xl font-black leading-none text-white">
                  {feedback.nota.toFixed(1)}
                </span>
                <span className="mb-2 text-3xl font-bold text-blue-200">
                  /20
                </span>
              </div>

              <div className="mt-5 inline-flex w-fit rounded-full bg-emerald-500 px-5 py-2 text-lg font-black text-white shadow-lg">
                {percentual}% de desempenho
              </div>
            </div>

            {/* ÁREA 2: GRÁFICO CIRCULAR */}
            <div className="flex items-center justify-center">
              <div className="relative h-40 w-40">
                <svg viewBox="0 0 120 120" className="h-40 w-40">
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="14"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={`${(percentual / 100) * 301} 301`}
                    transform="rotate(-90 60 60)"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">
                    {percentual}%
                  </span>
                  <span className="text-sm font-semibold text-blue-200">
                    Desempenho
                  </span>
                </div>
              </div>
            </div>

            {/* ÁREA 3: DIAGNÓSTICO */}
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-200">
                Diagnóstico esperado
              </p>

              <h2 className="mt-3 text-4xl font-black leading-tight text-white xl:text-5xl break-words whitespace-normal">
                {feedback.resumoCaso?.diagnosticoEsperado || "Diagnóstico não informado"}
              </h2>

              <p className="mt-5 text-sm font-bold uppercase tracking-[0.25em] text-blue-200">
                Diagnóstico informado
              </p>

              <p className="mt-2 text-lg font-semibold leading-relaxed text-blue-100 break-words whitespace-normal">
                {feedback.resumoCaso?.diagnosticoInformado || feedback.resumoCaso?.diagnosticoEsperado || "Não informado"}
              </p>

              {feedback.justificativaNota && (
                <div className="mt-5 rounded-2xl bg-blue-900/50 px-5 py-4 text-base font-medium leading-relaxed text-blue-50">
                  {feedback.justificativaNota}
                </div>
              )}
            </div>

            {/* ÁREA 4: TROFÉU */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex h-48 w-full items-center justify-center">
                {!trofeuFailed && (
                  <img
                    src="/images/feedback/estetoscopio.png"
                    alt="Troféu de aprovação"
                    className="h-80 w-80 md:h-88 md:w-88 object-contain drop-shadow-xl"
                    onError={() => setTrofeuFailed(true)}
                  />
                )}
                {trofeuFailed && (
                  <div className="text-8xl drop-shadow-xl">🏆</div>
                )}
              </div>

              {isAprovado && (
                <>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 pointer-events-none">
                    <img
                      src="/images/feedback/confetes.gif"
                      alt="Confetes"
                      className="h-40 w-96 object-contain"
                    />
                  </div>
                  <div className="mt-4 inline-flex items-center gap-3 rounded-full bg-emerald-500 px-8 py-4 text-3xl font-black text-white shadow-lg">
                    <span>✓</span>
                    <span>{feedback.classificacao || "Aprovado"}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* DESEMPENHO POR COMPETÊNCIA */}
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900">Desempenho por Competência</h2>
            <p className="mt-2 text-base text-slate-600">Veja onde você foi bem e quais pontos priorizar no próximo atendimento.</p>
            {feedback.rubricaAvaliacao && feedback.rubricaAvaliacao.length > 0 && (
              <p className="mt-1 text-sm text-slate-500">
                Distribuição por competência: {Math.round(feedback.rubricaAvaliacao.reduce((total, item) => total + Number(item.pontosObtidos || 0), 0) * 10) / 10}/{feedback.rubricaAvaliacao.reduce((total, item) => total + Number(item.pontosMaximos || 0), 0)}
              </p>
            )}
          </div>

          {feedback.rubricaAvaliacao && feedback.rubricaAvaliacao.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
              {feedback.rubricaAvaliacao.map((competencia, idx) => {
                const cores = competenciasCores[idx] || competenciasCores[0];
                const percentualComp = Math.round((competencia.pontosObtidos / competencia.pontosMaximos) * 100);
                const estaAberta = rubricaAberta === competencia.nome;

                return (
                  <div key={idx} className={`relative ${cores.bg} rounded-3xl border ${cores.border} p-6 shadow-sm min-h-[260px] overflow-hidden`}>
                    <div className="absolute bottom-2 right-3 opacity-30 pointer-events-none">
                      <img
                        src={cores.asset.src}
                        alt={cores.asset.alt}
                        className="h-32 w-32 object-contain"
                      />
                    </div>

                    {estaAberta ? (
                      // JANELA FLUTUANTE DE RUBRICA
                      <div className="absolute inset-0 z-30 max-h-[420px] overflow-y-auto rounded-3xl border p-5 shadow-2xl backdrop-blur-md md:max-h-[520px] bg-white/95">
                        {/* CABEÇALHO DA JANELA */}
                        <div className="relative z-10 flex items-start justify-between gap-3 pb-4 border-b border-slate-200 mb-4">
                          <div>
                            <h4 className={`text-lg font-black ${cores.text}`}>
                              {competencia.nome}
                            </h4>
                            <p className="mt-1 text-xs font-medium text-slate-600">
                              Peso na nota: {competencia.pontosMaximos} pontos
                            </p>
                          </div>

                          <button
                            type="button"
                            aria-label="Fechar detalhes da rubrica"
                            onClick={() => setRubricaAberta(null)}
                            className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-slate-600 shadow-sm hover:bg-white transition-colors shrink-0"
                          >
                            ✕
                          </button>
                        </div>

                        {/* BARRA DE PROGRESSO */}
                        <div className="relative z-10 mb-5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-slate-700">
                              {competencia.pontosObtidos}/{competencia.pontosMaximos} pontos
                            </span>
                            <span className="text-xs text-slate-500">{percentualComp}%</span>
                          </div>
                          <div className="h-3 rounded-full bg-white/60 overflow-hidden">
                            <div
                              className={`h-3 rounded-full transition-all ${obterCorFundo(cores.cor)}`}
                              style={{ width: `${percentualComp}%` }}
                            />
                          </div>
                        </div>

                        {/* CONTEÚDO DA RUBRICA */}
                        <div className="relative z-10 space-y-5">
                          <ListaDetalheRubrica
                            titulo="O que foi reconhecido"
                            itens={competencia.acertos}
                            fallback="Nenhum acerto específico foi registrado pela avaliação."
                          />

                          <ListaDetalheRubrica
                            titulo="O que faltou para fechar a pontuação"
                            itens={competencia.melhorias}
                            fallback={
                              competencia.pontosObtidos >= competencia.pontosMaximos
                                ? "Nenhuma pendência identificada."
                                : "Revise os critérios não pontuados desta competência."
                            }
                          />

                          <ListaDetalheRubrica
                            titulo="Evidências usadas pela avaliação"
                            itens={competencia.evidencias}
                            fallback="Nenhuma evidência textual registrada."
                          />

                          {/* SUGESTÃO DE RECUPERAÇÃO */}
                          <div className="space-y-2 rounded-lg bg-slate-100/80 p-3">
                            <p className="text-xs font-black uppercase tracking-wide text-slate-600">
                              Como recuperar esses pontos
                            </p>
                            <p className="text-sm font-medium text-slate-700 leading-relaxed">
                              {competencia.pontosObtidos >= competencia.pontosMaximos
                                ? "Competência completa neste atendimento — mantenha o padrão."
                                : competencia.melhorias && competencia.melhorias.length > 0
                                  ? competencia.melhorias.join(" ")
                                  : sugestaoRecuperarPontos(competencia.nome)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // VISTA RESUMIDA DO CARD
                      <>
                        {/* CABEÇALHO */}
                        <div className="relative z-20 flex items-start justify-between gap-3 mb-4">
                          <h3 className={`text-lg font-black leading-tight ${cores.text}`}>
                            {competencia.nome}
                          </h3>

                          <button
                            type="button"
                            aria-label={`Ver detalhes da rubrica de ${competencia.nome}`}
                            onClick={() =>
                              setRubricaAberta(
                                rubricaAberta === competencia.nome ? null : competencia.nome
                              )
                            }
                            className="relative z-20 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/80 text-xs font-black text-slate-800 shadow-md transition hover:scale-105 hover:bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
                          >
                            <span>{competencia.pontosObtidos}</span>
                            <span className="mx-0.5 text-slate-400">/</span>
                            <span>{competencia.pontosMaximos}</span>
                          </button>
                        </div>

                        {/* BARRA DE PROGRESSO */}
                        <div className="h-2 rounded-full bg-white/80 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all ${obterCorFundo(cores.cor)}`}
                            style={{ width: `${percentualComp}%` }}
                          />
                        </div>

                        {/* ACERTOS */}
                        {competencia.acertos.length > 0 && (
                          <div>
                            <p className={`mt-5 text-sm font-black ${cores.text}`}>Acertos</p>
                            <ul className="mt-2 space-y-1 text-sm leading-relaxed text-slate-700">
                              {limitar(competencia.acertos, 2).map((item, i) => (
                                <li key={i}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* MELHORIAS */}
                        {competencia.melhorias.length > 0 && (
                          <div>
                            <p className={`mt-4 text-sm font-black ${obterCorTexto(cores.cor)}`}>Melhorar</p>
                            <ul className="mt-2 space-y-1 text-sm leading-relaxed text-slate-700">
                              {limitar(competencia.melhorias, 2).map((item, i) => (
                                <li key={i}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* ESTUDO FINAL DO CASO */}
        <section className={`relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/40 to-blue-50/40 p-6 shadow-sm md:p-8 transition-all ${
          estudoExpandido ? "" : "min-h-[260px]"
        } ${estudoExpandido ? "" : "max-h-[260px]"}`}>
          <img
            src="/images/feedback/consultorio.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute bottom-4 right-4 h-44 w-44 object-contain opacity-10"
            onError={() => {}}
          />

          <div className={`relative z-10 ${estudoExpandido ? "" : "overflow-hidden"}`}>
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">
                Estudo final do caso
              </p>

              <div className="flex items-start justify-between gap-3 mt-2">
                <h2 className="text-3xl font-black text-slate-950">
                  {estudoFinal?.titulo || "Como conduzir este caso na prática"}
                </h2>

                <button
                  type="button"
                  aria-label={estudoExpandido ? "Colapsar estudo" : "Expandir estudo"}
                  onClick={() => setEstudoExpandido(!estudoExpandido)}
                  className="relative z-20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-300 bg-white/80 text-sm font-black text-emerald-700 shadow-md transition hover:scale-105 hover:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  {estudoExpandido ? "−" : "+"}
                </button>
              </div>

              <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
                {estudoFinal?.subtitulo || "Resumo técnico estruturado para revisar a condução ideal deste atendimento e transformar as falhas da simulação em plano de estudo."}
              </p>

              {estudoFinal?.especialidadeReferencia && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-100/70 px-3 py-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-emerald-800">
                    Especialista:
                  </span>
                  <span className="text-sm font-semibold text-emerald-900">
                    {estudoFinal.especialidadeReferencia}
                  </span>
                </div>
              )}

              {estudoFinal?.resumoEspecialista && (
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700 italic">
                  {estudoFinal.resumoEspecialista}
                </p>
              )}
            </div>

            {carregandoEstudoFinal && (
              <div className="text-center py-8">
                <p className="text-sm text-slate-600">Gerando estudo final individualizado do caso...</p>
              </div>
            )}

            {erroEstudoFinal && !estudoFinal && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
                <p className="text-sm text-amber-800">{erroEstudoFinal}</p>
              </div>
            )}

            {estudoFinal?.secoes && (
              <div className="space-y-4">
                {estudoFinal.secoes.map((secao: any, index: number) => (
                  <article
                    key={index}
                    className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur-sm md:p-5"
                  >
                    <h3 className="text-base font-black text-slate-900 md:text-lg">
                      {secao.titulo}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-700 md:text-base md:leading-8">
                      {secao.texto}
                    </p>

                    {secao.oQueRastrear && secao.oQueRastrear.length > 0 && (
                      <div className="mt-3 rounded-xl bg-blue-50/70 p-3 border border-blue-100">
                        <p className="text-xs font-black uppercase tracking-wide text-blue-700 mb-2">
                          🔍 O que rastrear
                        </p>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {secao.oQueRastrear.map((item: string, i: number) => (
                            <li key={i} className="leading-relaxed">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {secao.pontosOSCE && secao.pontosOSCE.length > 0 && (
                      <div className="mt-3 rounded-xl bg-emerald-50/70 p-3 border border-emerald-100">
                        <p className="text-xs font-black uppercase tracking-wide text-emerald-700 mb-2">
                          ✓ Pontos que contam no OSCE
                        </p>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {secao.pontosOSCE.map((item: string, i: number) => (
                            <li key={i} className="leading-relaxed">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {secao.errosComuns && secao.errosComuns.length > 0 && (
                      <div className="mt-3 rounded-xl bg-rose-50/70 p-3 border border-rose-100">
                        <p className="text-xs font-black uppercase tracking-wide text-rose-700 mb-2">
                          ⚠ Erros comuns que reduzem a nota
                        </p>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {secao.errosComuns.map((item: string, i: number) => (
                            <li key={i} className="leading-relaxed">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}

            {estudoFinal?.checklistNotaMaxima && estudoFinal.checklistNotaMaxima.length > 0 && (
              <div className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur-sm md:p-5">
                <h3 className="text-base font-black text-slate-900 md:text-lg mb-3">
                  ✅ Checklist para nota máxima (20/20)
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  {estudoFinal.checklistNotaMaxima.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold shrink-0">☐</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {estudoFinal?.respostaModelo && (
              <div className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur-sm md:p-5">
                <h3 className="text-base font-black text-slate-900 md:text-lg mb-3">
                  🎯 Resposta modelo para o aluno
                </h3>
                <p className="text-sm leading-7 text-slate-700 md:text-base md:leading-8 whitespace-pre-wrap">
                  {estudoFinal.respostaModelo}
                </p>
              </div>
            )}

            {estudoFinal?.errosCriticos && estudoFinal.errosCriticos.length > 0 && (
              <div className="rounded-2xl border border-white/70 bg-rose-50/75 p-4 shadow-sm backdrop-blur-sm md:p-5">
                <h3 className="text-base font-black text-rose-900 md:text-lg mb-3">
                  🚫 Erros críticos neste caso
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  {estudoFinal.errosCriticos.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold shrink-0">✗</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* PROFESSOR IA (Fase 25): UI simplificada — apenas o chat aberto.
            Toda a infraestrutura (ProfessorLesson/StudentTrace/GoldStandard/Truth
            Layers/guardrails) continua sendo montada em segundo plano; só não é
            mais renderizada. */}
        {professorPreview && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <ProfessorIAOpenChat
              caso={caso}
              feedback={feedback}
              atendimento={professorAtendimento}
              pdfText={professorPdfText}
            />
          </section>
        )}

        {/* BOTÕES FINAIS */}
        <div className="flex gap-4 pt-6">
          <Link href="/" className="flex-1">
            <button className="w-full rounded-2xl border-2 border-slate-300 bg-white px-6 py-4 text-base font-black text-slate-900 transition-all hover:bg-slate-50 active:scale-[0.98]">
              ← Voltar ao início
            </button>
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 rounded-2xl bg-blue-600 px-6 py-4 text-base font-black text-white transition-all hover:bg-blue-700 active:scale-[0.98] shadow-lg"
          >
            🔄 Tentar novamente
          </button>
        </div>
      </div>
    </main>
  );
}
