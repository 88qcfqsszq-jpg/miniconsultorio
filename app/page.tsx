"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-white mb-6">
            🏥 Mini Consultório OSCE
          </h1>
          <p className="text-2xl text-blue-100 max-w-3xl mx-auto">
            Ferramenta de treinamento para simulação clínica estruturada (OSCE) do 3º semestre de Medicina
          </p>
        </div>

        {/* Dois CTAs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* CTA 1: Prova OSCE - DESTAQUE MAIOR */}
          <Link href="/faca-o-osce">
            <div className="bg-white rounded-lg shadow-2xl p-12 hover:shadow-3xl transition-all transform hover:-translate-y-1 cursor-pointer h-full border-t-4 border-indigo-600">
              <div className="flex flex-col items-center text-center">
                <div className="text-7xl mb-6">🎯</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Prova OSCE
                </h2>
                <p className="text-gray-600 mb-8 flex-grow">
                  Receba um paciente aleatório <strong>sem conhecer o diagnóstico</strong>.
                  Conduzir uma anamnese real, solicite exames e formule sua hipótese diagnóstica.
                </p>
                <div className="bg-indigo-100 p-4 rounded-lg w-full mb-6">
                  <p className="text-indigo-900 font-semibold text-sm">
                    ✨ Modo desafiador e realista
                  </p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors w-full text-lg">
                  Iniciar Simulado Aleatório →
                </button>
              </div>
            </div>
          </Link>

          {/* CTA 2: Treinamento */}
          <Link href="/treinamento">
            <div className="bg-white rounded-lg shadow-xl p-12 hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer h-full border-t-4 border-green-600">
              <div className="flex flex-col items-center text-center">
                <div className="text-7xl mb-6">📚</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Treinamento
                </h2>
                <p className="text-gray-600 mb-8 flex-grow">
                  Escolha um caso específico por tema.
                  Ideal para treino direcionado e aprofundamento em diagnósticos específicos.
                </p>
                <div className="bg-green-100 p-4 rounded-lg w-full mb-6">
                  <p className="text-green-900 font-semibold text-sm">
                    📋 Escolha o tema que quer treinar
                  </p>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors w-full text-lg">
                  Ver Casos Disponíveis →
                </button>
              </div>
            </div>
          </Link>
        </div>

        {/* Informações Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-white border border-white/20">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-bold text-lg mb-2">Chat Inteligente</h3>
            <p className="text-blue-100 text-sm">
              Converse naturalmente com o paciente virtual
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-white border border-white/20">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold text-lg mb-2">Feedback Detalhado</h3>
            <p className="text-blue-100 text-sm">
              Receba análise completa do seu desempenho
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-lg p-6 text-white border border-white/20">
            <div className="text-4xl mb-3">🔄</div>
            <h3 className="font-bold text-lg mb-2">Repetição Ilimitada</h3>
            <p className="text-blue-100 text-sm">
              Pratique quantas vezes quiser
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
