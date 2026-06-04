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

const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg width="128" height="128" className="transform -rotate-90">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-900">{percentage}%</p>
          <p className="text-xs text-slate-500">Desempenho</p>
        </div>
      </div>
    </div>
  );
};

const Confetes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-pulse"
          style={{
            left: `${50 + Math.cos((i / 12) * Math.PI * 2) * 60}px`,
            top: `${50 + Math.sin((i / 12) * Math.PI * 2) * 60}px`,
            animation: `float ${2 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
        >
          <div
            className="w-3 h-3 rounded-sm"
            style={{
              backgroundColor: [
                "#fbbf24",
                "#60a5fa",
                "#34d399",
                "#f87171",
                "#c084fc",
              ][i % 5],
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-20px) rotate(180deg); opacity: 0.7; }
        }
      `}</style>
    </div>
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
      <div className="mx-auto max-w-7xl space-y-8">
        {/* CARD PRINCIPAL */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 text-white shadow-2xl p-8 md:p-10 border border-blue-700/30">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Feedback do Atendimento</h1>
          <div className="flex items-center gap-2 text-blue-100 text-sm mb-8">
            <span>👤 {nomePaciente}</span>
            <span>•</span>
            <span>⏱️ {minutos}m {segundos}s</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Coluna 1: Nota */}
            <div>
              <p className="text-blue-200 text-sm font-semibold uppercase tracking-wide mb-4">Nota Final</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-6xl font-black text-white">{feedback.nota.toFixed(1)}</span>
                <span className="text-2xl text-blue-200">/20</span>
              </div>
              <div className="inline-block bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {percentual}% de desempenho
              </div>
            </div>

            {/* Coluna 2: Gráfico + Diagnóstico */}
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <CircularProgress percentage={percentual} />
                <div className="flex-1">
                  <p className="text-blue-200 text-xs font-semibold uppercase mb-2">Diagnóstico Esperado</p>
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight text-white mb-3">
                    {feedback.resumoCaso?.diagnosticoEsperado}
                  </h2>
                  <p className="text-sm text-blue-100 mb-3">
                    <span className="font-semibold">Diagnóstico informado:</span> {feedback.resumoCaso?.diagnosticoEsperado}
                  </p>
                  {feedback.justificativaNota && (
                    <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3 text-sm text-blue-100">
                      💡 {feedback.justificativaNota}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Coluna 3: Troféu */}
            <div className="flex flex-col items-center justify-center relative">
              <Confetes />
              <div className="text-8xl mb-4 animate-bounce" style={{ animationDuration: "2s" }}>🏆</div>
              {isAprovado && (
                <div className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2">
                  <span>✓</span>
                  <span>{feedback.classificacao}</span>
                </div>
              )}
            </div>
          </div>
        </div>

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
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
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
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
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
