"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CasoCard from "@/components/CasoCard";
import PainelGerarCaso from "@/components/PainelGerarCaso";
import AccessModal from "@/components/access/AccessModal";
import { todosCasosAdultos, todosCasosPediatricos } from "@/data/casos-v2";
import { Caso } from "@/lib/types";
import { useAccess } from "@/hooks/useAccess";
import { isClinicalCaseFree } from "@/lib/accessControl";

export default function Treinamento() {
  const [mostrarGerador, setMostrarGerador] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const router = useRouter();
  const { loggedIn } = useAccess();

  // Lista COMPLETA da plataforma: adultos + pediátricos (sem duplicar).
  const adultosAtivos = todosCasosAdultos.filter((caso: any) => caso.ativo !== false);
  const pediatricosAtivos = todosCasosPediatricos.filter((caso: any) => caso.ativo !== false);
  const casosAtivos: Array<{ caso: any; tipo: "adulto" | "pediatrico" }> = [
    ...adultosAtivos.map((caso: any) => ({ caso, tipo: "adulto" as const })),
    ...pediatricosAtivos.map((caso: any) => ({ caso, tipo: "pediatrico" as const })),
  ];
  const isLocked = (id: string) => !loggedIn && !isClinicalCaseFree(id);

  const onGerarIA = () => {
    if (!loggedIn) {
      setModalAberto(true);
      return;
    }
    setMostrarGerador(true);
  };

  const handleCasoGerado = (caso: Caso) => {
    // Salvar na sessionStorage para acessar na página de caso
    sessionStorage.setItem("casoGerado", JSON.stringify(caso));
    router.push(`/caso/${caso.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
            Treinamento Direcionado
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            Escolha um caso por tema. Você sabe o diagnóstico antes de começar.
          </p>
        </div>

        {/* Gerador de Casos */}
        {mostrarGerador ? (
          <div className="mb-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">✨ Gerar Novo Caso com IA</h2>
              <button
                onClick={() => setMostrarGerador(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <PainelGerarCaso onCasoGerado={handleCasoGerado} />
          </div>
        ) : (
          <div className="mb-8">
            <button
              onClick={onGerarIA}
              className="relative w-full py-3.5 px-6 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-semibold text-sm sm:text-base hover:from-violet-700 hover:to-purple-700 shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
            >
              🤖 Gerar Novo Caso com IA
              {!loggedIn && (
                <svg className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v3m-6 5h12a1 1 0 001-1v-7a1 1 0 00-1-1H6a1 1 0 00-1 1v7a1 1 0 001 1zm9-9V7a4 4 0 10-8 0v3" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Cards de Casos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10">
          {casosAtivos.map(({ caso, tipo }) => (
            <CasoCard
              key={caso.id}
              caso={caso as any}
              tipo={tipo}
              locked={isLocked(caso.id)}
              onLockedClick={() => setModalAberto(true)}
            />
          ))}
        </div>

        <AccessModal
          open={modalAberto}
          onClose={() => setModalAberto(false)}
          onLoggedIn={() => setModalAberto(false)}
          titulo="Conteúdo exclusivo"
          descricao="Este caso faz parte do plano completo. Faça login ou assine para desbloquear."
        />

        {/* Como usar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-5">Como usar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {[
              { n: "1", title: "Escolha um caso", desc: "Selecione o tema ou sistema que quer revisar." },
              { n: "2", title: "Conduza o atendimento", desc: "Anamnese, exame físico e exames complementares." },
              { n: "3", title: "Receba feedback", desc: "Diagnóstico, SOAP, comunicação e plano de estudo." },
            ].map((step) => (
              <div key={step.n} className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0 mt-0.5">{step.n}</div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">{step.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
