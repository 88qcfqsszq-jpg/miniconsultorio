"use client";

import { useEffect, useState } from "react";

interface LoadingRelatorioProps {
  isVisible: boolean;
  percentual: number;
  mensagem: string;
}

export default function LoadingRelatorio({
  isVisible,
  percentual,
  mensagem,
}: LoadingRelatorioProps) {
  const [displayPercentual, setDisplayPercentual] = useState(0);

  useEffect(() => {
    if (displayPercentual < percentual) {
      const timer = setTimeout(() => {
        setDisplayPercentual((prev) => Math.min(prev + 1, percentual));
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [displayPercentual, percentual]);

  if (!isVisible) return null;

  const percentualFormatado = Math.round(Math.min(100, Math.max(0, displayPercentual)));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full mx-4">
        {/* Spinner */}
        <div className="flex justify-center mb-8">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"
              style={{ animationDuration: "2s" }}
            ></div>
          </div>
        </div>

        {/* Título */}
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
          Gerando relatório
        </h2>

        {/* Subtítulo */}
        <p className="text-center text-sm text-gray-600 mb-8">
          A IA está analisando sua anamnese, exame físico, raciocínio clínico,
          conduta e SOAP
        </p>

        {/* Barra de Progresso */}
        <div className="mb-6">
          <div className="bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${displayPercentual}%` }}
            ></div>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="text-sm font-semibold text-blue-600">
              {percentualFormatado}%
            </p>
            {displayPercentual === 100 && (
              <p className="text-xs text-green-600 font-medium">✓ Concluído</p>
            )}
          </div>
        </div>

        {/* Mensagem da Etapa */}
        <div className="mb-6 min-h-12 flex items-center justify-center">
          <p className="text-center text-sm text-gray-700 font-medium">
            {mensagem}
          </p>
        </div>

        {/* Aviso */}
        {displayPercentual < 100 && (
          <p className="text-center text-xs text-gray-500">
            ⏱️ Isso pode levar alguns segundos
          </p>
        )}

        {/* Pontos de animação */}
        {displayPercentual < 100 && (
          <div className="flex justify-center gap-1.5 mt-4">
            <div
              className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
