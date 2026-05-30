"use client";

import { useEffect, useState } from "react";

interface LoadingFeedbackProps {
  isVisible: boolean;
}

const MENSAGENS = [
  "Analisando anamnese...",
  "Avaliando exame físico...",
  "Processando sinais vitais...",
  "Comparando com diagnóstico esperado...",
  "Verificando exames complementares...",
  "Analisando conduta clínica...",
  "Estruturando feedback SOAP...",
  "Identificando pontos críticos...",
  "Compilando plano de estudo...",
  "Finalizando relatório...",
];

export default function LoadingFeedback({ isVisible }: LoadingFeedbackProps) {
  const [percentual, setPercentual] = useState(0);
  const [indiceMsg, setIndiceMsg] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setPercentual(0);
      setIndiceMsg(0);
      return;
    }

    // Simulação de progresso com incrementos aleatórios
    const interval = setInterval(() => {
      setPercentual((prev) => {
        if (prev >= 95) return prev; // Não ultrapassar 95% até o feedback chegar
        const incremento = Math.random() * 12 + 3; // Entre 3% e 15%
        return Math.min(prev + incremento, 95);
      });

      // Mudar mensagem a cada 10% aproximadamente
      setIndiceMsg((prev) => {
        if (prev < MENSAGENS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-12 max-w-md w-full mx-4">
        {/* Ícone de processamento */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center animate-spin">
            <div className="w-14 h-14 rounded-full bg-white"></div>
          </div>
        </div>

        {/* Título */}
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
          Gerando Relatório
        </h2>

        {/* Mensagem dinâmica */}
        <p className="text-center text-gray-600 text-sm mb-6 h-6">
          {MENSAGENS[indiceMsg]}
        </p>

        {/* Barra de progresso */}
        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${percentual}%` }}
            ></div>
          </div>
        </div>

        {/* Percentual */}
        <p className="text-center text-3xl font-bold text-blue-600 mb-2">
          {Math.round(percentual)}%
        </p>

        {/* Texto informativo */}
        <p className="text-center text-xs text-gray-500">
          Analisando seu desempenho clínico...
        </p>

        {/* Ponto de espera */}
        <div className="flex justify-center gap-1 mt-6">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );
}
