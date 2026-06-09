"use client";

import { useRouter } from "next/navigation";
import { casosOSCE } from "@/data/casos-osce";

export default function FacaOOSCE() {
  const router = useRouter();

  const casosAtivos = casosOSCE.filter((caso) => caso.ativo !== false);

  const iniciarOSCEAleatorio = () => {
    if (casosAtivos.length === 0) return;

    const casoAleatorio = casosAtivos[Math.floor(Math.random() * casosAtivos.length)];
    router.push(`/caso/${casoAleatorio.id}?modo=osce`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🩺</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
            Prova OSCE
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            Simulado com paciente aleatório — sem diagnóstico revelado
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed text-center">
              Você receberá um <strong className="text-blue-700">paciente virtual sem diagnóstico revelado</strong>. Conduza a anamnese, solicite exames, formule hipóteses e registre em SOAP.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: "💬", label: "Anamnese" },
              { icon: "🥼", label: "Exame Físico" },
              { icon: "🧠", label: "Diagnóstico" },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-200">
                <div className="text-2xl mb-1">{item.icon}</div>
                <p className="text-xs font-semibold text-slate-700">{item.label}</p>
              </div>
            ))}
          </div>

          <ul className="space-y-2 mb-6">
            {[
              "Aborde o paciente com empatia e profissionalismo",
              "Perguntas abertas → fechadas e direcionadas",
              "Solicite sinais vitais e exame físico quando indicado",
              "Mantenha diagnósticos diferenciais em mente",
              "Documente tudo claramente no SOAP",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-emerald-500 font-bold mt-0.5 shrink-0">✓</span>
                {tip}
              </li>
            ))}
          </ul>

          <button
            onClick={iniciarOSCEAleatorio}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-sm text-base active:scale-[0.98]"
          >
            Iniciar OSCE Aleatório →
          </button>
          <p className="text-xs text-slate-400 text-center mt-3">
            O diagnóstico só será revelado ao finalizar o atendimento
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="font-semibold text-slate-700 text-sm mb-1">❓ O que esperar</p>
            <p className="text-slate-500 text-xs leading-relaxed">
              Caso clínico real sem conhecimento prévio do diagnóstico. Você deve investigar, raciocinar e documentar como em uma situação real.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="font-semibold text-slate-700 text-sm mb-1">📊 Feedback pós-atendimento</p>
            <p className="text-slate-500 text-xs leading-relaxed">
              Diagnóstico esperado, diferenciais, acertos, pontos de melhoria, comunicação e plano de estudo personalizado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
