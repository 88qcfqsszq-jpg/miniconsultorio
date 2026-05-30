"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CasoCard from "@/components/CasoCard";
import PainelGerarCaso from "@/components/PainelGerarCaso";
import { casosOSCE } from "@/data/casos-osce";
import { Caso } from "@/lib/types";

export default function Treinamento() {
  const [mostrarGerador, setMostrarGerador] = useState(false);
  const router = useRouter();

  const handleCasoGerado = (caso: Caso) => {
    // Salvar na sessionStorage para acessar na página de caso
    sessionStorage.setItem("casoGerado", JSON.stringify(caso));
    router.push(`/caso/${caso.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            📚 Treinamento Direcionado
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pratique casos específicos por tema. Ideal para aprofundamento em sistemas e diagnósticos específicos.
          </p>
        </div>

        {/* Seção de Gerador de Casos */}
        {mostrarGerador && (
          <div className="mb-12 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">✨ Criar Novo Caso</h2>
              <button
                onClick={() => setMostrarGerador(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            <PainelGerarCaso onCasoGerado={handleCasoGerado} />
          </div>
        )}

        {/* Botão para mostrar gerador */}
        {!mostrarGerador && (
          <div className="mb-12">
            <button
              onClick={() => setMostrarGerador(true)}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all"
            >
              🤖 Gerar Novo Caso com IA
            </button>
          </div>
        )}

        {/* Cards de Casos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {casosOSCE.map((caso) => (
            <CasoCard key={caso.id} caso={caso} />
          ))}
        </div>

        {/* Instruções */}
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Como Usar o Treinamento
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-3xl mb-3">1️⃣</div>
              <h3 className="font-bold text-gray-800 mb-2">Escolha um Tema</h3>
              <p className="text-gray-600">
                Selecione um caso clínico específico de um tema que deseja treinar.
                Você verá o diagnóstico e sistema antes de começar.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-3xl mb-3">2️⃣</div>
              <h3 className="font-bold text-gray-800 mb-2">Realize a Anamnese</h3>
              <p className="text-gray-600">
                Converse com o paciente virtual, faça perguntas sobre seus sintomas e solicite sinais vitais e exame físico.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-3xl mb-3">3️⃣</div>
              <h3 className="font-bold text-gray-800 mb-2">Registre sua Avaliação</h3>
              <p className="text-gray-600">
                Preencha o formulário SOAP, estabeleça seus diagnósticos e conduta. Finalize e receba feedback.
              </p>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-6">
            <h3 className="font-bold text-green-800 mb-2">💡 Dicas Importantes</h3>
            <ul className="text-green-800 space-y-2">
              <li>✓ Use o conhecimento prévio do tema para focar sua investigação</li>
              <li>✓ Aborde o paciente com empatia e profissionalismo</li>
              <li>✓ Investigue completamente os sintomas antes de fazer diagnósticos</li>
              <li>✓ Solicite exames e sinais vitais conforme necessário</li>
              <li>✓ Mantenha diagnósticos diferenciais em mente</li>
              <li>✓ Documente tudo de forma clara no registro SOAP</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
