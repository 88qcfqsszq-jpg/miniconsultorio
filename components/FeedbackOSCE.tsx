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
    return <p className="text-sm md:text-base text-slate-500">Sem destaque nesta seção</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <li key={idx} className="text-base md:text-lg text-slate-700 leading-relaxed">
          • {item}
        </li>
      ))}
    </ul>
  );
};

const obterBadge = (classificacao: string) => {
  const config: Record<string, { bg: string; border: string; text: string; cor: string }> = {
    "Aprovado": { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-900", cor: "text-emerald-700" },
    "Excelente": { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-900", cor: "text-emerald-700" },
    "Bom": { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-900", cor: "text-blue-700" },
    "Regular": { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-900", cor: "text-amber-700" },
    "Insuficiente": { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-900", cor: "text-rose-700" },
  };
  return config[classificacao] || config["Regular"];
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
  const badge = obterBadge(feedback.classificacao);

  // Prioridades de melhoria (máximo 3 itens)
  const prioridadesMelhoria = [
    ...(feedback.raciocinioDiagnostico?.diferenciaisFaltantes || []),
    ...(feedback.anamnese?.faltouPerguntar || []),
    ...(feedback.exameFisico?.manobrasEsquecidas || []),
    ...(feedback.examesComplementares?.faltantes || []),
    ...(feedback.conduta?.erros || []),
  ].slice(0, 3);

  // Sequência ideal esperada
  const sequenciaIdeal = feedback.respostaModeloOSCE
    ? feedback.respostaModeloOSCE.split("\n").filter(l => l.trim()).slice(0, 6)
    : [];

  // Plano de estudo (máximo 5)
  const planoEstudo = limitar(
    feedback.planoDeEstudo?.map(item => typeof item === "object" ? item : { topico: item, explicacao: "" }) || [],
    5
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 animate-slideUp py-4">
        {/* ===== CARD PRINCIPAL DE RESULTADO ===== */}
        <div className={`rounded-3xl shadow-lg border-2 p-8 md:p-12 ${badge.bg} ${badge.border}`}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Feedback do Atendimento</h1>
              <p className="text-slate-600 text-sm md:text-base font-medium">
                {nomePaciente} • {minutos}m {segundos}s
              </p>
            </div>
            <div className={`px-5 py-3 rounded-full text-base font-bold border shrink-0 ${badge.bg} ${badge.border} ${badge.text}`}>
              {feedback.classificacao}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
            {/* Coluna Esquerda - Nota */}
            <div>
              <p className="text-slate-600 text-xs md:text-sm font-bold uppercase tracking-wide mb-4">Nota Final</p>
              <div className="flex items-baseline gap-2 md:gap-3">
                <span className={`text-7xl md:text-8xl font-bold ${badge.cor}`}>{feedback.nota.toFixed(1)}</span>
                <span className="text-2xl md:text-3xl font-bold text-slate-600">/ 20</span>
              </div>
              <p className="text-slate-600 text-base md:text-lg font-semibold mt-4">{percentual}% de desempenho</p>
            </div>

            {/* Coluna Direita - Diagnóstico */}
            <div>
              <p className="text-slate-600 text-xs md:text-sm font-bold uppercase tracking-wide mb-4">Diagnóstico Esperado</p>
              <p className="text-2xl md:text-4xl font-bold text-slate-900 leading-snug mb-6">
                {feedback.resumoCaso?.diagnosticoEsperado}
              </p>

              {/* Resumo em uma frase */}
              {feedback.justificativaNota && (
                <div className="pt-6 border-t-2 border-opacity-30">
                  <p className="text-base md:text-lg leading-relaxed text-slate-800 italic">"{feedback.justificativaNota}"</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== CARDS DE COMPETÊNCIA ===== */}
        <div>
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Desempenho por Competência</h2>
            <p className="text-base md:text-lg text-slate-500">Veja onde você foi bem e quais pontos priorizar no próximo atendimento.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* 1. Comunicação */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 md:p-7 shadow-sm min-h-[300px]">
              <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-4">💬 Comunicação</h3>
              <div className="space-y-5">
                <div>
                  <p className="text-base md:text-lg font-semibold text-emerald-700 mb-3">✓ Acertos:</p>
                  {renderBullets(limitar(feedback.comunicacaoMedica?.acertos || [], 2))}
                </div>
                {(feedback.comunicacaoMedica?.pontosDeMelhoria?.length || 0) > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-base md:text-lg font-semibold text-amber-700 mb-3">⚠️ Melhorar:</p>
                    {renderBullets(limitar(feedback.comunicacaoMedica?.pontosDeMelhoria || [], 2))}
                  </div>
                )}
              </div>
            </div>

            {/* 2. Exame Físico */}
            <div className="bg-violet-50 border-2 border-violet-200 rounded-2xl p-6 md:p-7 shadow-sm min-h-[300px]">
              <h3 className="text-xl md:text-2xl font-bold text-violet-900 mb-4">🔍 Exame Físico</h3>
              <div className="space-y-5">
                <div>
                  <p className="text-base md:text-lg font-semibold text-emerald-700 mb-3">✓ Realizadas:</p>
                  {renderBullets(limitar(feedback.exameFisico?.manobrasRealizadas || [], 2))}
                </div>
                {(feedback.exameFisico?.manobrasEsquecidas?.length || 0) > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-base md:text-lg font-semibold text-rose-700 mb-3">✗ Faltantes:</p>
                    {renderBullets(limitar(feedback.exameFisico?.manobrasEsquecidas || [], 2))}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Exames Complementares */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 md:p-7 shadow-sm min-h-[300px]">
              <h3 className="text-xl md:text-2xl font-bold text-emerald-900 mb-4">🧪 Exames</h3>
              <div className="space-y-5">
                <div>
                  <p className="text-base md:text-lg font-semibold text-emerald-700 mb-3">✓ Adequados:</p>
                  {renderBullets(limitar(feedback.examesComplementares?.adequados || [], 2))}
                </div>
                {(feedback.examesComplementares?.faltantes?.length || 0) > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-base md:text-lg font-semibold text-rose-700 mb-3">✗ Faltantes:</p>
                    {renderBullets(limitar(feedback.examesComplementares?.faltantes || [], 2))}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Raciocínio Diagnóstico */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 md:p-7 shadow-sm min-h-[300px]">
              <h3 className="text-xl md:text-2xl font-bold text-amber-900 mb-4">🧠 Raciocínio</h3>
              <div className="space-y-5">
                <div>
                  <p className="text-base md:text-lg font-semibold text-slate-700 mb-3">Sua hipótese:</p>
                  <p className="text-base md:text-lg text-slate-800 leading-relaxed">{feedback.raciocinioDiagnostico?.hipoteseDoEstudante}</p>
                </div>
                {(feedback.raciocinioDiagnostico?.diferenciaisFaltantes?.length || 0) > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-base md:text-lg font-semibold text-rose-700 mb-3">Diferenciais faltantes:</p>
                    {renderBullets(limitar(feedback.raciocinioDiagnostico?.diferenciaisFaltantes || [], 2))}
                  </div>
                )}
              </div>
            </div>

            {/* 5. Conduta */}
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-6 md:p-7 shadow-sm min-h-[300px]">
              <h3 className="text-xl md:text-2xl font-bold text-rose-900 mb-4">⚕️ Conduta</h3>
              <div className="space-y-5">
                <div>
                  <p className="text-base md:text-lg font-semibold text-emerald-700 mb-3">✓ Adequadas:</p>
                  {renderBullets(limitar(feedback.conduta?.adequada || [], 2))}
                </div>
                {(feedback.conduta?.erros?.length || 0) > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-base md:text-lg font-semibold text-rose-700 mb-3">✗ Erros:</p>
                    {renderBullets(limitar(feedback.conduta?.erros || [], 2))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== PRIORIDADES DE MELHORIA ===== */}
        {prioridadesMelhoria.length > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-2xl p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-5">⚡ Prioridades de Melhoria</h2>
            <ol className="space-y-3">
              {prioridadesMelhoria.map((item, idx) => (
                <li key={idx} className="text-base md:text-lg text-amber-900 flex gap-4">
                  <span className="font-bold text-amber-700 shrink-0">{idx + 1}.</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* ===== SEQUÊNCIA IDEAL ===== */}
        {sequenciaIdeal.length > 0 && (
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-6">📋 Sequência Ideal do Atendimento</h2>
            <div className="space-y-3">
              {sequenciaIdeal.map((linha, idx) => (
                <div key={idx} className="flex gap-4 text-base md:text-lg">
                  <span className="font-bold text-indigo-700 shrink-0 w-8">{idx + 1}.</span>
                  <span className="text-slate-800 leading-relaxed">{linha.replace(/^\d+\.\s*/, "")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== PLANO DE ESTUDO ===== */}
        {planoEstudo.length > 0 && (
          <div className="bg-white border-2 border-indigo-200 rounded-2xl p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-6">📚 Próximos Focos de Estudo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {planoEstudo.map((item, idx) => {
                const topico = typeof item === "string" ? item : item.topico;
                return (
                  <div key={idx} className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-5">
                    <p className="text-base md:text-lg font-semibold text-indigo-900 mb-2">{topico}</p>
                    {item.explicacao && (
                      <p className="text-sm md:text-base text-indigo-700 leading-relaxed">{item.explicacao}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== AÇÕES FINAIS ===== */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Link href="/" className="flex-1">
            <button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-colors text-base md:text-lg active:scale-[0.98]">
              ← Voltar aos Casos
            </button>
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-900 font-bold py-4 px-6 rounded-xl transition-colors text-base md:text-lg active:scale-[0.98]"
          >
            🔄 Repetir Este Caso
          </button>
        </div>
      </div>
    </div>
  );
}
