"use client";

import { useRouter } from "next/navigation";
import { casosOSCE } from "@/data/casos-osce";

export default function FacaOOSCE() {
  const router = useRouter();

  const iniciarOSCEAleatorio = () => {
    if (casosOSCE.length === 0) return;

    const casoAleatorio = casosOSCE[Math.floor(Math.random() * casosOSCE.length)];
    router.push(`/caso/${casoAleatorio.id}?modo=osce`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-indigo-900 mb-6">
            🎯 Prova OSCE
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-4">
            Teste suas habilidades clínicas em um simulado desafiador
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-lg shadow-2xl p-12 border-t-4 border-indigo-600 mb-12">
          <div className="text-center">
            <div className="text-6xl mb-6">🏥</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Simulado OSCE Aleatório
            </h2>

            <div className="bg-indigo-50 rounded-lg p-8 mb-8 border-l-4 border-indigo-600">
              <p className="text-lg text-gray-700 leading-relaxed">
                Você receberá um <strong>paciente virtual sem diagnóstico revelado</strong>.
                Conduza a anamnese, investigue os sintomas, solicite sinais vitais e exame físico,
                formule suas hipóteses diagnósticas e registre sua avaliação em SOAP.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl mb-2">💬</div>
                <h3 className="font-semibold text-gray-800 mb-2">Anamnese</h3>
                <p className="text-sm text-gray-600">
                  Converse livremente com o paciente virtual
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <div className="text-3xl mb-2">📋</div>
                <h3 className="font-semibold text-gray-800 mb-2">Exame Físico</h3>
                <p className="text-sm text-gray-600">
                  Solicite sinais vitais e achados do exame
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="text-3xl mb-2">🧠</div>
                <h3 className="font-semibold text-gray-800 mb-2">Diagnóstico</h3>
                <p className="text-sm text-gray-600">
                  Formule hipótese e diferenciais, registre SOAP
                </p>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8 text-left">
              <h3 className="font-bold text-green-800 mb-3">💡 Dicas para o OSCE</h3>
              <ul className="text-green-800 space-y-2 text-sm">
                <li>✓ Aborde o paciente com empatia e profissionalismo</li>
                <li>✓ Faça perguntas abertas seguidas de perguntas fechadas direcionadas</li>
                <li>✓ Investigue completamente os sintomas antes de fazer diagnósticos</li>
                <li>✓ Sempre solicite sinais vitais e exame físico quando apropriado</li>
                <li>✓ Mantenha diagnósticos diferenciais em mente</li>
                <li>✓ Documente tudo de forma clara no registro SOAP</li>
              </ul>
            </div>

            <button
              onClick={iniciarOSCEAleatorio}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-lg transition-colors text-lg shadow-lg"
            >
              🚀 Iniciar OSCE Aleatório
            </button>

            <p className="text-sm text-gray-500 mt-6">
              Cada simulado é único. Você pode realizar quantas vezes quiser.
            </p>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-blue-900 mb-3">❓ O que esperar</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Você encontrará um caso clínico real sem conhecimento prévio sobre a doença.
              Seu objetivo é diagnosticar e planejar a conduta baseado na abordagem clínica
              adequada ao 3º semestre de Medicina.
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
            <h3 className="font-bold text-purple-900 mb-3">📊 Feedback</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Ao finalizar, você receberá feedback detalhado com o diagnóstico esperado,
              diferenciais importantes, seus acertos e pontos de melhoria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
