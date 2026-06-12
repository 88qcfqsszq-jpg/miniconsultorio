'use client';

interface CategoriaFeedbackPediatricoProps {
  titulo: string;
  pontuacao: number;
  maximo: number;
  itensAtingidos?: string[];
  itensPerdidos?: string[];
}

export default function CategoriaFeedbackPediatrico({
  titulo,
  pontuacao,
  maximo,
  itensAtingidos = [],
  itensPerdidos = [],
}: CategoriaFeedbackPediatricoProps) {
  const percentual = (pontuacao / maximo) * 100;
  const statusCor =
    percentual >= 80
      ? 'bg-emerald-50 border-emerald-200'
      : percentual >= 60
        ? 'bg-amber-50 border-amber-200'
        : 'bg-red-50 border-red-200';

  const textoCor =
    percentual >= 80
      ? 'text-emerald-700'
      : percentual >= 60
        ? 'text-amber-700'
        : 'text-red-700';

  return (
    <div className={`${statusCor} border rounded-lg p-4 space-y-3`}>
      {/* Cabeçalho com título e pontuação */}
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-semibold text-slate-800">{titulo}</h4>
        <div className={`text-right shrink-0 ${textoCor}`}>
          <p className="text-sm font-bold">
            {pontuacao.toFixed(1)}/{maximo}
          </p>
          <p className="text-xs font-semibold">{Math.round(percentual)}%</p>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="w-full bg-slate-200 rounded h-2 overflow-hidden">
        <div
          className={`h-full ${
            percentual >= 80
              ? 'bg-emerald-500'
              : percentual >= 60
                ? 'bg-amber-500'
                : 'bg-red-500'
          }`}
          style={{ width: `${Math.min(percentual, 100)}%` }}
        />
      </div>

      {/* Itens atingidos */}
      {itensAtingidos && itensAtingidos.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-emerald-700">✓ Realizado:</p>
          <ul className="text-xs space-y-0.5 ml-3">
            {itensAtingidos.map((item, idx) => (
              <li key={idx} className="text-slate-700">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Itens perdidos */}
      {itensPerdidos && itensPerdidos.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-red-700">✗ A melhorar:</p>
          <ul className="text-xs space-y-0.5 ml-3">
            {itensPerdidos.map((item, idx) => (
              <li key={idx} className="text-slate-700">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
