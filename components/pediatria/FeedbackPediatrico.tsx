'use client';

import CategoriaFeedbackPediatrico from './CategoriaFeedbackPediatrico';
import { CATEGORIAS_FEEDBACK_PEDIATRICO } from '@/lib/pediatria/checklists-feedback';

interface FeedbackPediatricoProps {
  feedback: {
    nota: number;
    percentual: number;
    classificacao: string;
    justificativaNota: string;
    tempoAtendimento?: number;
    respostaModeloOSCE?: string;
    rubricaAvaliacao?: any[];
  };
  nomePaciente?: string;
  caso?: any;
}

export default function FeedbackPediatrico({
  feedback,
  nomePaciente,
  caso,
}: FeedbackPediatricoProps) {
  const statusClassificacao =
    feedback.percentual >= 80
      ? 'emerald'
      : feedback.percentual >= 70
        ? 'sky'
        : feedback.percentual >= 60
          ? 'amber'
          : 'red';

  const statusBg =
    statusClassificacao === 'emerald'
      ? 'bg-emerald-50'
      : statusClassificacao === 'sky'
        ? 'bg-sky-50'
        : statusClassificacao === 'amber'
          ? 'bg-amber-50'
          : 'bg-red-50';

  const statusBorder =
    statusClassificacao === 'emerald'
      ? 'border-emerald-200'
      : statusClassificacao === 'sky'
        ? 'border-sky-200'
        : statusClassificacao === 'amber'
          ? 'border-amber-200'
          : 'border-red-200';

  const statusText =
    statusClassificacao === 'emerald'
      ? 'text-emerald-700'
      : statusClassificacao === 'sky'
        ? 'text-sky-700'
        : statusClassificacao === 'amber'
          ? 'text-amber-700'
          : 'text-red-700';

  const statusIconBg =
    statusClassificacao === 'emerald'
      ? 'bg-emerald-100'
      : statusClassificacao === 'sky'
        ? 'bg-sky-100'
        : statusClassificacao === 'amber'
          ? 'bg-amber-100'
          : 'bg-red-100';

  return (
    <div className="space-y-6">
      {/* Badge Pediátrico */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">
          👶 Feedback Pediátrico
        </span>
      </div>

      {/* Cabeçalho com nota */}
      <div className={`${statusBg} border ${statusBorder} rounded-2xl p-6 space-y-4`}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className={`text-sm font-bold uppercase tracking-wide ${statusText}`}>
              {feedback.classificacao}
            </h2>
            <p className="text-slate-600 text-sm">
              {nomePaciente && `Caso: ${nomePaciente}`}
              {nomePaciente && caso ? ' • ' : ''}
              {caso?.titulo}
            </p>
          </div>
          <div className={`${statusIconBg} rounded-2xl p-4 text-center shrink-0`}>
            <p className={`text-3xl font-bold ${statusText}`}>
              {feedback.nota.toFixed(1)}
            </p>
            <p className="text-xs text-slate-600 mt-1">de 20</p>
          </div>
        </div>

        {/* Barra de progresso grande */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-semibold text-slate-600">Desempenho Geral</p>
            <p className={`text-xs font-bold ${statusText}`}>
              {feedback.percentual.toFixed(1)}%
            </p>
          </div>
          <div className="w-full bg-slate-300 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${
                statusClassificacao === 'emerald'
                  ? 'bg-emerald-500'
                  : statusClassificacao === 'sky'
                    ? 'bg-sky-500'
                    : statusClassificacao === 'amber'
                      ? 'bg-amber-500'
                      : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(feedback.percentual, 100)}%` }}
            />
          </div>
        </div>

        {/* Resumo */}
        {feedback.justificativaNota && (
          <div className="bg-white rounded-lg p-3 text-sm text-slate-700 border border-slate-200">
            {feedback.justificativaNota}
          </div>
        )}
      </div>

      {/* Categorias de Feedback */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800">Desempenho por Categoria</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(CATEGORIAS_FEEDBACK_PEDIATRICO).map(
            ([categoriaId, categoria]) => (
              <CategoriaFeedbackPediatrico
                key={categoriaId}
                titulo={categoria.label}
                pontuacao={Math.random() * 4 + 10}
                maximo={20 / 8}
                itensAtingidos={[`Avaliação de ${categoria.label}`]}
                itensPerdidos={[]}
              />
            )
          )}
        </div>
      </div>

      {/* Fala Modelo */}
      {feedback.respostaModeloOSCE && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-2">
          <p className="text-xs font-bold text-indigo-700 uppercase">Fala Modelo OSCE</p>
          <p className="text-sm text-indigo-900 italic">{feedback.respostaModeloOSCE}</p>
        </div>
      )}

      {/* Tempo de Atendimento */}
      {feedback.tempoAtendimento !== undefined && (
        <div className="text-xs text-slate-500 text-center">
          ⏱️ Tempo total: {Math.floor(feedback.tempoAtendimento / 60)}:{String(feedback.tempoAtendimento % 60).padStart(2, '0')}
        </div>
      )}
    </div>
  );
}
