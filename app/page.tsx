"use client";

import Link from "next/link";

const features = [
  { icon: "💬", label: "Paciente Virtual", desc: "Chat natural com IA treinada para responder como paciente real" },
  { icon: "🩺", label: "Exame Físico", desc: "Manobras interativas por sistema: cardiovascular, respiratório e mais" },
  { icon: "🧪", label: "Exames Complementares", desc: "Solicite ECG, hemograma, troponina e receba resultados contextualizados" },
  { icon: "📊", label: "Feedback por IA", desc: "Análise detalhada de anamnese, raciocínio, conduta e comunicação" },
  { icon: "📚", label: "Plano de Estudo", desc: "Tópicos personalizados com base nos seus erros e lacunas" },
  { icon: "🤖", label: "Casos com IA", desc: "Gere novos casos clínicos únicos por sistema e dificuldade" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Simulação OSCE com IA — 3º Semestre de Medicina
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight tracking-tight">
            Mini Consultório OSCE
          </h1>
          <p className="text-blue-100 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Treine anamnese, exame físico, raciocínio clínico e receba feedback detalhado com IA.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/faca-o-osce">
              <button className="w-full sm:w-auto bg-white text-blue-700 font-bold py-3.5 px-8 rounded-xl hover:bg-blue-50 transition-all shadow-lg text-base">
                Iniciar Prova OSCE
              </button>
            </Link>
            <Link href="/treinamento">
              <button className="w-full sm:w-auto bg-white/15 border border-white/30 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-white/25 transition-all text-base">
                Ver Casos de Treino
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Cards principais */}
      <section className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12">
          <Link href="/faca-o-osce" className="group">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 h-full hover:shadow-md hover:border-blue-200 transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-5">🎯</div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Prova OSCE</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                Paciente aleatório <strong className="text-slate-700">sem diagnóstico revelado</strong>. Anamnese real, exame físico, hipóteses e conduta — igual ao OSCE da faculdade.
              </p>
              <span className="inline-flex items-center gap-1.5 text-blue-600 text-sm font-semibold group-hover:gap-2.5 transition-all">
                Iniciar simulado <span>→</span>
              </span>
            </div>
          </Link>

          <Link href="/treinamento" className="group">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 h-full hover:shadow-md hover:border-emerald-200 transition-all">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl mb-5">📚</div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Treinamento Direcionado</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-5">
                Escolha o tema, sistema ou dificuldade. Ideal para aprofundamento e revisão antes de provas. Você sabe o diagnóstico antes de começar.
              </p>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-semibold group-hover:gap-2.5 transition-all">
                Ver casos disponíveis <span>→</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Features grid */}
        <div className="mb-6">
          <h2 className="text-center text-slate-400 text-xs font-semibold uppercase tracking-widest mb-6">
            O que você pode fazer
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {features.map((f) => (
              <div key={f.label} className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-200 transition-colors">
                <div className="text-2xl mb-2">{f.icon}</div>
                <p className="text-slate-800 font-semibold text-sm mb-1">{f.label}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
