"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./treinamento.css";
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
    <div className="treinamento-page">
      {/* ========== HERO ========== */}
      <section className="t-hero">
        <span className="t-hero-badge">
          <i />
          TREINAMENTO DIRECIONADO
        </span>
        <h1>Treinamento<br />Direcionado</h1>
        <p>Escolha um caso por tema. Você sabe o diagnóstico antes de começar.</p>
        <div className="t-hero-stats">
          <div className="t-hero-stat">
            <strong>{casosAtivos.length}</strong>
            <span>Casos disponíveis</span>
          </div>
          <div className="t-hero-stat">
            <strong>Adulto + Ped.</strong>
            <span>Faixas atendidas</span>
          </div>
          <div className="t-hero-stat">
            <strong>IA</strong>
            <span>Geração de casos</span>
          </div>
        </div>
      </section>

      {/* ========== GERADOR DE CASOS ========== */}
      {mostrarGerador ? (
        <div className="t-gerador-wrap">
          <div className="t-gerador-head">
            <h2>✨ Gerar Novo Caso com IA</h2>
            <button
              type="button"
              className="t-gerador-close"
              onClick={() => setMostrarGerador(false)}
              aria-label="Fechar gerador"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <PainelGerarCaso onCasoGerado={handleCasoGerado} />
        </div>
      ) : (
        <button type="button" className="t-btn-ia" onClick={onGerarIA}>
          🤖 Gerar Novo Caso com IA
          {!loggedIn && (
            <svg
              className="t-btn-ia-lock"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11v3m-6 5h12a1 1 0 001-1v-7a1 1 0 00-1-1H6a1 1 0 00-1 1v7a1 1 0 001 1zm9-9V7a4 4 0 10-8 0v3"
              />
            </svg>
          )}
        </button>
      )}

      {/* ========== GRID DE CARDS ========== */}
      <div className="t-cards-grid">
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

      {/* ========== COMO USAR ========== */}
      <div className="t-como-usar t-glass">
        <h2>Como usar</h2>
        <div className="t-como-usar-steps">
          {[
            { n: "1", title: "Escolha um caso", desc: "Selecione o tema ou sistema que quer revisar." },
            { n: "2", title: "Conduza o atendimento", desc: "Anamnese, exame físico e exames complementares." },
            { n: "3", title: "Receba feedback", desc: "Diagnóstico, SOAP, comunicação e plano de estudo." },
          ].map((step) => (
            <div key={step.n} className="t-step">
              <div className="t-step-num">{step.n}</div>
              <div>
                <p className="t-step-title">{step.title}</p>
                <p className="t-step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
