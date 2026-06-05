"use client";

import type { FeedbackOSCE } from "@/lib/types";
import Link from "next/link";

interface FeedbackOSCEProps {
  feedback: FeedbackOSCE;
  nomePaciente: string;
  tempoDecorrido: number;
}

const limitar = (items: any[], max: number = 2) => {
  if (!items || items.length === 0) return [];
  return items.slice(0, max);
};

const renderBullets = (items: string[], cor: "emerald" | "blue" | "purple" | "amber" | "rose") => {
  if (!items || items.length === 0) {
    return <p className="text-sm text-slate-500 italic">Sem destaque</p>;
  }
  const colorClass = {
    emerald: "text-emerald-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
  }[cor];
  return (
    <ul className="space-y-1">
      {items.map((item, idx) => (
        <li key={idx} className={`text-sm ${colorClass} flex gap-2`}>
          <span className="font-bold">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

export default function FeedbackOSCE({
  feedback,
  nomePaciente,
  tempoDecorrido,
}: FeedbackOSCEProps) {
  const minutos = Math.floor(tempoDecorrido / 60);
  const segundos = tempoDecorrido % 60;
  const percentual = Math.round((feedback.nota / 20) * 100);

  const prioridadesMelhoria = [
    ...(feedback.raciocinioDiagnostico?.diferenciaisFaltantes || []),
    ...(feedback.anamnese?.faltouPerguntar || []),
    ...(feedback.exameFisico?.manobrasEsquecidas || []),
    ...(feedback.examesComplementares?.faltantes || []),
    ...(feedback.conduta?.erros || []),
  ].slice(0, 3);

  const sequenciaIdeal = feedback.respostaModeloOSCE
    ? feedback.respostaModeloOSCE.split("\n").filter(l => l.trim()).slice(0, 5)
    : [];

  const planoEstudo = limitar(
    feedback.planoDeEstudo?.map(item => typeof item === "object" ? item : { topico: item, explicacao: "" }) || [],
    4
  );

  const isAprovado = feedback.nota >= 17;

  return (
    <main className="w-full bg-slate-50 min-h-screen p-4 md:p-8">
      <div className="w-full max-w-none space-y-8">
        {/* CARD PRINCIPAL */}
        <section className="w-full rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white shadow-xl border border-blue-900/40 p-8 md:p-10 xl:p-12">

          {/* TÍTULO */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white">
              Feedback do Atendimento
            </h1>
            <p className="mt-2 text-base md:text-lg text-blue-100">
              {nomePaciente} • {minutos}m {segundos}s
            </p>
          </div>

          {/* GRID: 3 COLUNAS - Nota | Diagnóstico | Troféu */}
          <div className="grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)_280px] gap-10 items-stretch">

            {/* COLUNA 1: NOTA FINAL */}
            <div className="rounded-3xl bg-white/10 border border-white/10 p-6 flex flex-col justify-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
                Nota final
              </p>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-6xl md:text-7xl font-black leading-none">
                  {feedback.nota.toFixed(1)}
                </span>
                <span className="mb-2 text-2xl font-bold text-blue-200">
                  /20
                </span>
              </div>

              <div className="mt-5 inline-flex w-fit rounded-full bg-emerald-500 px-5 py-2 text-lg font-bold text-white">
                {percentual}% de desempenho
              </div>
            </div>

            {/* COLUNA 2: DIAGNÓSTICO - A MAIOR */}
            <div className="min-w-0 rounded-3xl bg-white/10 border border-white/10 p-6 md:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
                Diagnóstico esperado
              </p>

              <p className="mt-3 text-3xl md:text-4xl xl:text-5xl font-black leading-tight text-white break-words whitespace-normal">
                {feedback.resumoCaso?.diagnosticoEsperado || "Diagnóstico não informado"}
              </p>

              <div className="mt-6">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
                  Diagnóstico informado
                </p>
                <p className="mt-2 text-lg md:text-xl font-semibold leading-relaxed text-blue-100 break-words whitespace-normal">
                  {feedback.resumoCaso?.diagnosticoEsperado || "Não informado"}
                </p>
              </div>

              {feedback.justificativaNota && (
                <div className="mt-6 rounded-2xl bg-slate-950/30 border border-white/10 px-5 py-4">
                  <p className="text-base md:text-lg leading-relaxed text-blue-50 whitespace-normal">
                    💡 {feedback.justificativaNota}
                  </p>
                </div>
              )}
            </div>

            {/* COLUNA 3: ESTETOSCÓPIO/CLASSIFICAÇÃO */}
            <div className="rounded-3xl bg-white/10 border border-white/10 p-6 flex flex-col items-center justify-center text-center">
              <div className="text-7xl md:text-8xl leading-none animate-bounce" style={{ animationDuration: "2s", filter: "drop-shadow(0 0 20px #fbbf24) drop-shadow(0 0 40px #f59e0b)" }}>
                🩺
              </div>

              {isAprovado && (
                <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-emerald-500 px-6 py-3 text-2xl font-black text-white shadow-lg">
                  <span>✓</span>
                  <span>{feedback.classificacao || "Aprovado"}</span>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* SEÇÃO: DESEMPENHO POR COMPETÊNCIA */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="text-3xl">🎯</div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Desempenho por Competência</h2>
              <p className="text-slate-600 text-sm">Veja onde você foi bem e quais pontos priorizar no próximo atendimento.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Comunicação */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-blue-900">Comunicação</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold text-emerald-600 mb-2">Acertos</p>
                  {renderBullets(limitar(feedback.comunicacaoMedica?.acertos || [], 2), "emerald")}
                </div>
                {(feedback.comunicacaoMedica?.pontosDeMelhoria?.length || 0) > 0 && (
                  <div className="border-t pt-3">
                    <p className="text-sm font-bold text-blue-600 mb-2">Melhorar</p>
                    {renderBullets(limitar(feedback.comunicacaoMedica?.pontosDeMelhoria || [], 2), "blue")}
                  </div>
                )}
              </div>
            </div>

            {/* Exame Físico */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-purple-900">Exame Físico</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold text-emerald-600 mb-2">Acertos</p>
                  {renderBullets(limitar(feedback.exameFisico?.manobrasRealizadas || [], 2), "emerald")}
                </div>
                {(feedback.exameFisico?.manobrasEsquecidas?.length || 0) > 0 && (
                  <div className="border-t pt-3">
                    <p className="text-sm font-bold text-purple-600 mb-2">Melhorar</p>
                    {renderBullets(limitar(feedback.exameFisico?.manobrasEsquecidas || [], 2), "purple")}
                  </div>
                )}
              </div>
            </div>

            {/* Exames */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-lg">
                  🩻
                </div>
                <h3 className="text-lg font-bold text-emerald-900">Exames</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold text-emerald-600 mb-2">Acertos</p>
                  {renderBullets(limitar(feedback.examesComplementares?.adequados || [], 2), "emerald")}
                </div>
                {(feedback.examesComplementares?.faltantes?.length || 0) > 0 && (
                  <div className="border-t pt-3">
                    <p className="text-sm font-bold text-emerald-600 mb-2">Melhorar</p>
                    {renderBullets(limitar(feedback.examesComplementares?.faltantes || [], 2), "emerald")}
                  </div>
                )}
              </div>
            </div>

            {/* Raciocínio */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-lg">
                  🧠
                </div>
                <h3 className="text-lg font-bold text-amber-900">Raciocínio</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold text-emerald-600 mb-2">Acertos</p>
                  {feedback.raciocinioDiagnostico?.hipoteseDoEstudante ? (
                    <p className="text-sm text-slate-700">{feedback.raciocinioDiagnostico.hipoteseDoEstudante}</p>
                  ) : (
                    <p className="text-sm text-slate-500">—</p>
                  )}
                </div>
                {(feedback.raciocinioDiagnostico?.diferenciaisFaltantes?.length || 0) > 0 && (
                  <div className="border-t pt-3">
                    <p className="text-sm font-bold text-amber-600 mb-2">Melhorar</p>
                    {renderBullets(limitar(feedback.raciocinioDiagnostico?.diferenciaisFaltantes || [], 2), "amber")}
                  </div>
                )}
              </div>
            </div>

            {/* Conduta */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-rose-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-rose-900">Conduta</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-bold text-emerald-600 mb-2">Acertos</p>
                  {renderBullets(limitar(feedback.conduta?.adequada || [], 2), "emerald")}
                </div>
                {(feedback.conduta?.erros?.length || 0) > 0 && (
                  <div className="border-t pt-3">
                    <p className="text-sm font-bold text-rose-600 mb-2">Melhorar</p>
                    {renderBullets(limitar(feedback.conduta?.erros || [], 2), "rose")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CARDS INFERIORES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {prioridadesMelhoria.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⭐</span>
                <h3 className="text-xl font-bold text-slate-900">Prioridades de melhoria</h3>
              </div>
              <ol className="space-y-3">
                {prioridadesMelhoria.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-700 flex gap-3">
                    <span className="font-bold text-amber-600">{idx + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {sequenciaIdeal.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Sequência ideal neste caso</h3>
              </div>
              <ol className="space-y-3">
                {sequenciaIdeal.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-700 flex gap-3">
                    <span className="font-bold text-blue-600">{idx + 1}</span>
                    <span>{item.replace(/^\d+\.\s*/, "")}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {planoEstudo.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📚</span>
                <h3 className="text-xl font-bold text-slate-900">Próximos focos de estudo</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {planoEstudo.map((item, idx) => {
                  const topico = typeof item === "string" ? item : item.topico;
                  return (
                    <span key={idx} className="inline-block bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium border border-emerald-200">
                      {topico}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* AÇÕES FINAIS */}
        <div className="flex gap-4 pt-4">
          <Link href="/" className="flex-1">
            <button className="w-full bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-900 font-bold py-3 px-6 rounded-xl transition-all text-base active:scale-[0.98]">
              ← Voltar ao início
            </button>
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all text-base active:scale-[0.98]"
          >
            🔄 Tentar novo caso
          </button>
        </div>
      </div>
    </main>
  );
}
