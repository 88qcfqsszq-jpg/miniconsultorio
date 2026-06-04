"use client";

import type { FeedbackOSCE } from "@/lib/types";
import Link from "next/link";

interface FeedbackOSCEProps {
  feedback: FeedbackOSCE;
  nomePaciente: string;
  tempoDecorrido: number;
}

const limitar = (items: any[], max: number = 3) => {
  if (!items || items.length === 0) return [];
  return items.slice(0, max);
};

const renderBullets = (items: string[]) => {
  if (!items || items.length === 0) {
    return <p className="text-base text-slate-500 italic">Sem destaque nesta seção</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <li key={idx} className="text-base md:text-lg text-slate-700 leading-relaxed flex gap-3">
          <span className="shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};

const obterIconeClassificacao = (classificacao: string) => {
  if (classificacao === "Aprovado" || classificacao === "Excelente") return "🏆";
  if (classificacao === "Bom") return "✅";
  if (classificacao === "Regular") return "⚠️";
  return "❌";
};

const obterCorClassificacao = (classificacao: string) => {
  if (classificacao === "Aprovado" || classificacao === "Excelente")
    return { bg: "bg-emerald-500/20", border: "border-emerald-400/40", text: "text-emerald-100" };
  if (classificacao === "Bom") return { bg: "bg-blue-500/20", border: "border-blue-400/40", text: "text-blue-100" };
  if (classificacao === "Regular") return { bg: "bg-amber-500/20", border: "border-amber-400/40", text: "text-amber-100" };
  return { bg: "bg-rose-500/20", border: "border-rose-400/40", text: "text-rose-100" };
};

const obterPercentual = (nota: number): number => {
  return Math.round((nota / 20) * 100);
};

export default function FeedbackOSCE({
  feedback,
  nomePaciente,
  tempoDecorrido,
}: FeedbackOSCEProps) {
  const minutos = Math.floor(tempoDecorrido / 60);
  const segundos = tempoDecorrido % 60;
  const percentual = obterPercentual(feedback.nota);
  const icone = obterIconeClassificacao(feedback.classificacao);
  const corClass = obterCorClassificacao(feedback.classificacao);

  const prioridadesMelhoria = [
    ...(feedback.raciocinioDiagnostico?.diferenciaisFaltantes || []),
    ...(feedback.anamnese?.faltouPerguntar || []),
    ...(feedback.exameFisico?.manobrasEsquecidas || []),
    ...(feedback.examesComplementares?.faltantes || []),
    ...(feedback.conduta?.erros || []),
  ].slice(0, 3);

  const sequenciaIdeal = feedback.respostaModeloOSCE
    ? feedback.respostaModeloOSCE.split("\n").filter(l => l.trim()).slice(0, 6)
    : [];

  const planoEstudo = limitar(
    feedback.planoDeEstudo?.map(item => typeof item === "object" ? item : { topico: item, explicacao: "" }) || [],
    5
  );

  return (
    <main className="w-full bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="w-full px-4 py-8 sm:px-6 lg:px-10 xl:px-16">
        <div className="mx-auto w-full max-w-[1600px] space-y-8 animate-slideUp">
          {/* CARD PRINCIPAL ESCURO */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white shadow-2xl p-8 md:p-12 border border-blue-900/40">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-wider text-blue-200 font-semibold">Feedback do Atendimento</p>
              <p className="text-base text-blue-100 mt-1">{nomePaciente} • {minutos}m {segundos}s</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-8 items-center">
              {/* Coluna 1: Nota */}
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-wide text-blue-200 font-semibold">Nota Final</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl md:text-8xl font-black text-white">{feedback.nota.toFixed(1)}</span>
                  <span className="text-2xl md:text-3xl text-blue-200 font-bold">/ 20</span>
                </div>
                <p className="text-lg text-blue-100 font-semibold pt-2">{percentual}% de desempenho</p>
              </div>

              {/* Coluna 2: Diagnóstico */}
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-wide text-blue-200 font-semibold">Diagnóstico Esperado</p>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight text-white">
                  {feedback.resumoCaso?.diagnosticoEsperado}
                </h2>
                {feedback.justificativaNota && (
                  <p className="text-base md:text-lg text-blue-100 leading-relaxed italic pt-4">
                    "{feedback.justificativaNota}"
                  </p>
                )}
              </div>

              {/* Coluna 3: Classificação */}
              <div className="flex flex-col items-center justify-center rounded-3xl bg-white/10 p-8 border border-white/10">
                <div className="text-8xl mb-4 drop-shadow-lg">
                  {icone === "🏆" ? "🏆" : icone}
                </div>
                <div className={`rounded-full ${corClass.bg} px-6 py-3 text-xl font-bold ${corClass.text} border ${corClass.border} text-center`}>
                  {feedback.classificacao}
                </div>
              </div>
            </div>
          </div>

          {/* CARDS DE COMPETÊNCIA */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Desempenho por Competência</h2>
              <p className="text-lg text-slate-500">Veja onde você foi bem e quais pontos priorizar no próximo atendimento.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6">
              {/* 1. Comunicação */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6 shadow-sm min-h-[320px] flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-2xl">💬</div>
                  <h3 className="text-2xl font-bold text-blue-900">Comunicação</h3>
                </div>
                <div className="space-y-5 flex-1">
                  <div>
                    <p className="text-base font-bold text-emerald-700 mb-3">✓ Acertos</p>
                    {renderBullets(limitar(feedback.comunicacaoMedica?.acertos || [], 3))}
                  </div>
                  {(feedback.comunicacaoMedica?.pontosDeMelhoria?.length || 0) > 0 && (
                    <div className="border-t border-blue-200 pt-4">
                      <p className="text-base font-bold text-rose-700 mb-3">⚠️ Melhorar</p>
                      {renderBullets(limitar(feedback.comunicacaoMedica?.pontosDeMelhoria || [], 3))}
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Exame Físico */}
              <div className="bg-violet-50 border-2 border-violet-200 rounded-3xl p-6 shadow-sm min-h-[320px] flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-2xl">🩺</div>
                  <h3 className="text-2xl font-bold text-violet-900">Exame Físico</h3>
                </div>
                <div className="space-y-5 flex-1">
                  <div>
                    <p className="text-base font-bold text-emerald-700 mb-3">✓ Realizadas</p>
                    {renderBullets(limitar(feedback.exameFisico?.manobrasRealizadas || [], 3))}
                  </div>
                  {(feedback.exameFisico?.manobrasEsquecidas?.length || 0) > 0 && (
                    <div className="border-t border-violet-200 pt-4">
                      <p className="text-base font-bold text-rose-700 mb-3">✗ Faltantes</p>
                      {renderBullets(limitar(feedback.exameFisico?.manobrasEsquecidas || [], 3))}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Exames */}
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-6 shadow-sm min-h-[320px] flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">🧪</div>
                  <h3 className="text-2xl font-bold text-emerald-900">Exames</h3>
                </div>
                <div className="space-y-5 flex-1">
                  <div>
                    <p className="text-base font-bold text-emerald-700 mb-3">✓ Adequados</p>
                    {renderBullets(limitar(feedback.examesComplementares?.adequados || [], 3))}
                  </div>
                  {(feedback.examesComplementares?.faltantes?.length || 0) > 0 && (
                    <div className="border-t border-emerald-200 pt-4">
                      <p className="text-base font-bold text-rose-700 mb-3">✗ Faltantes</p>
                      {renderBullets(limitar(feedback.examesComplementares?.faltantes || [], 3))}
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Raciocínio */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 shadow-sm min-h-[320px] flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-2xl">🧠</div>
                  <h3 className="text-2xl font-bold text-amber-900">Raciocínio</h3>
                </div>
                <div className="space-y-5 flex-1">
                  <div>
                    <p className="text-base font-bold text-slate-700 mb-3">Sua Hipótese</p>
                    <p className="text-base md:text-lg text-slate-800 leading-relaxed">{feedback.raciocinioDiagnostico?.hipoteseDoEstudante || "—"}</p>
                  </div>
                  {(feedback.raciocinioDiagnostico?.diferenciaisFaltantes?.length || 0) > 0 && (
                    <div className="border-t border-amber-200 pt-4">
                      <p className="text-base font-bold text-rose-700 mb-3">Diferenciais Faltantes</p>
                      {renderBullets(limitar(feedback.raciocinioDiagnostico?.diferenciaisFaltantes || [], 3))}
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Conduta */}
              <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-6 shadow-sm min-h-[320px] flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-2xl">❤️</div>
                  <h3 className="text-2xl font-bold text-rose-900">Conduta</h3>
                </div>
                <div className="space-y-5 flex-1">
                  <div>
                    <p className="text-base font-bold text-emerald-700 mb-3">✓ Adequadas</p>
                    {renderBullets(limitar(feedback.conduta?.adequada || [], 3))}
                  </div>
                  {(feedback.conduta?.erros?.length || 0) > 0 && (
                    <div className="border-t border-rose-200 pt-4">
                      <p className="text-base font-bold text-rose-700 mb-3">✗ Erros</p>
                      {renderBullets(limitar(feedback.conduta?.erros || [], 3))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CARDS INFERIORES */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {prioridadesMelhoria.length > 0 && (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">⚡ Prioridades de Melhoria</h3>
                <ol className="space-y-4">
                  {prioridadesMelhoria.map((item, idx) => (
                    <li key={idx} className="text-base md:text-lg text-slate-700 flex gap-4 leading-relaxed">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold shrink-0 text-sm">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {sequenciaIdeal.length > 0 && (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">📋 Sequência Ideal</h3>
                <ol className="space-y-4">
                  {sequenciaIdeal.map((item, idx) => (
                    <li key={idx} className="text-base md:text-lg text-slate-700 flex gap-4 leading-relaxed">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold shrink-0 text-sm">
                        {idx + 1}
                      </span>
                      <span>{item.replace(/^\d+\.\s*/, "")}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {planoEstudo.length > 0 && (
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">📚 Próximos Focos</h3>
                <div className="flex flex-wrap gap-3">
                  {planoEstudo.map((item, idx) => {
                    const topico = typeof item === "string" ? item : item.topico;
                    return (
                      <span key={idx} className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-base text-indigo-700 font-medium border border-indigo-200 hover:bg-indigo-100 transition-colors">
                        {topico}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* AÇÕES FINAIS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/" className="flex-1">
              <button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-all text-base md:text-lg active:scale-[0.98] shadow-md">
                ← Voltar aos Casos
              </button>
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-900 font-bold py-4 px-6 rounded-xl transition-all text-base md:text-lg active:scale-[0.98] shadow-md"
            >
              🔄 Repetir Este Caso
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
