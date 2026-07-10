"use client";

// ============================================================================
// GuiaPage — "Guia OSCE": orientações, modos de estudo, fluxo clínico e
// preparação prática. Segue a estética do DashboardLanding (vidro azul-gelo).
// A sidebar e o espaçamento lateral vêm do AppShell global — aqui só conteúdo.
// Os botões de OSCE reaproveitam a MESMA lógica de /faca-o-osce via
// urlOSCEAleatorio (helper compartilhado). Não contém lógica clínica.
// ============================================================================

import { useRouter } from "next/navigation";
import { useIniciarOsce } from "@/hooks/useIniciarOsce";
import "./GuiaPage.css";

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

const COMO_USAR = [
  { icon: "M4 6h16M4 12h10M4 18h7", titulo: "Escolha do caso", desc: "Selecione um caso por tema, sistema ou dificuldade — ou inicie um OSCE aleatório." },
  { icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z", titulo: "Atendimento com paciente IA", desc: "Conduza a anamnese conversando com o paciente virtual, por texto ou voz." },
  { icon: "M20 21a8 8 0 10-16 0M12 11a4 4 0 100-8 4 4 0 000 8z", titulo: "Exame físico", desc: "Realize manobras por sistema e registre os achados encontrados no paciente." },
  { icon: "M9 2h6M12 2v4m-7 5h14l-1.5 9a2 2 0 01-2 1.7H8.5a2 2 0 01-2-1.7L5 11z", titulo: "Solicitação de exames", desc: "Peça exames complementares e receba resultados contextualizados ao caso." },
  { icon: "M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z", titulo: "Diagnóstico e conduta", desc: "Levante hipóteses, defina o diagnóstico e proponha a conduta adequada." },
  { icon: "M3 12l4 4L21 4M3 20h18", titulo: "Feedback final", desc: "Receba análise por rubrica de anamnese, raciocínio, conduta e comunicação." },
];

const FLUXO = [
  "Apresentação",
  "Anamnese",
  "Exame físico",
  "Hipóteses diagnósticas",
  "Exames complementares",
  "Conduta",
  "Fechamento",
];

const MODOS = [
  { icon: "M5 3l14 9-14 9V3z", titulo: "Treino livre", desc: "Pratique sem tempo, sabendo o diagnóstico antes de começar." },
  { icon: "M12 8v4l3 2M12 3a9 9 0 100 18 9 9 0 000-18z", titulo: "OSCE cronometrado", desc: "Estação com tempo, no formato da prova real da faculdade." },
  { icon: "M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z", titulo: "Revisão por patologia", desc: "Aprofunde-se num tema específico e revise antes das provas." },
  { icon: "M12 3a4 4 0 014 4c0 2-2 3-2 5m-2 4h.01M6.5 9a5.5 5.5 0 0111 0c0 3-2.5 4-2.5 7h-6c0-3-2.5-4-2.5-7z", titulo: "Simulação pediátrica", desc: "Casos pediátricos com exame físico e procedimentos por faixa etária." },
  { icon: "M20 21a8 8 0 10-16 0M12 11a4 4 0 100-8 4 4 0 000 8z", titulo: "Simulação adulto", desc: "Casos adultos completos, do acolhimento ao fechamento." },
  { icon: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11", titulo: "Feedback por rubrica", desc: "Pontuação estruturada por critérios objetivos ao final do caso." },
];

const DICAS = [
  "Fale em voz alta o seu raciocínio",
  "Organize o raciocínio clínico por etapas",
  "Não pule os sinais vitais",
  "Justifique cada exame solicitado",
  "Feche sempre com diagnóstico e conduta",
  "Revise o feedback antes do próximo caso",
];

export default function GuiaPage() {
  const router = useRouter();

  const { iniciarOSCE, accessModal } = useIniciarOsce();

  return (
    <div className="guia-page">
      {/* ===================== HERO ===================== */}
      <section className="g-hero">
        <span className="g-hero-badge">
          <i />
          GUIA OSCE
        </span>
        <h1>Guia OSCE</h1>
        <p>
          Tudo o que você precisa para tirar o máximo do Mini Consultório: orientações de uso,
          modos de estudo, o fluxo clínico ideal e dicas de preparação prática para as suas estações OSCE.
        </p>
      </section>

      {/* ===================== COMO USAR ===================== */}
      <section>
        <div className="g-section-head">
          <p className="g-section-eyebrow">Primeiros passos</p>
          <h2 className="g-section-title">Como usar o Mini Consultório</h2>
          <p className="g-section-sub">Da escolha do caso ao feedback final — o percurso completo de um atendimento.</p>
        </div>
        <div className="g-grid g-grid-3" style={{ marginTop: 16 }}>
          {COMO_USAR.map((c) => (
            <article key={c.titulo} className="g-card g-glass">
              <span className="g-card-ico"><Icon d={c.icon} /></span>
              <h3>{c.titulo}</h3>
              <p>{c.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ===================== FLUXO IDEAL ===================== */}
      <section>
        <div className="g-section-head">
          <p className="g-section-eyebrow">Passo a passo</p>
          <h2 className="g-section-title">Fluxo ideal do OSCE</h2>
          <p className="g-section-sub">Siga esta sequência para não esquecer nenhuma etapa durante a estação.</p>
        </div>
        <div className="g-flow g-glass" style={{ marginTop: 16 }}>
          <div className="g-flow-track">
            {FLUXO.map((etapa, i) => (
              <div key={etapa} className="g-flow-step">
                <div className="g-flow-num">{i + 1}</div>
                <span>{etapa}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== MODOS DE TREINO ===================== */}
      <section>
        <div className="g-section-head">
          <p className="g-section-eyebrow">Como treinar</p>
          <h2 className="g-section-title">Modos de treino</h2>
          <p className="g-section-sub">Escolha o formato que melhor combina com o seu momento de estudo.</p>
        </div>
        <div className="g-grid g-grid-3" style={{ marginTop: 16 }}>
          {MODOS.map((m) => (
            <article key={m.titulo} className="g-card g-glass">
              <span className="g-card-ico"><Icon d={m.icon} /></span>
              <h3>{m.titulo}</h3>
              <p>{m.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ===================== DICAS ===================== */}
      <section>
        <div className="g-section-head">
          <p className="g-section-eyebrow">Alta performance</p>
          <h2 className="g-section-title">Dicas de alta performance</h2>
          <p className="g-section-sub">Pequenos hábitos que fazem diferença na nota da estação.</p>
        </div>
        <div className="g-grid g-grid-2" style={{ marginTop: 16 }}>
          {DICAS.map((d) => (
            <div key={d} className="g-tip g-glass">
              <span className="g-tip-check"><Check /></span>
              <strong>{d}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== CTA FINAL ===================== */}
      <section className="g-cta g-glass">
        <h2>Pronto para praticar?</h2>
        <p>Inicie um caso agora e coloque o guia em prática.</p>
        <div className="g-cta-actions">
          <button type="button" className="g-btn g-btn-primary" onClick={() => iniciarOSCE("adulto")}>
            Iniciar OSCE Adulto
          </button>
          <button type="button" className="g-btn g-btn-ped" onClick={() => iniciarOSCE("pediatrico")}>
            Iniciar OSCE Pediátrico
          </button>
          <button type="button" className="g-btn g-btn-ghost" onClick={() => router.push("/dashboard-landing")}>
            Voltar ao Dashboard
          </button>
        </div>
      </section>
      {accessModal}
    </div>
  );
}
