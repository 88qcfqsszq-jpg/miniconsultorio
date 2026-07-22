"use client";

// ============================================================================
// GuiaPage — "Guia OSCE" (layout aprovado em guiatest.png):
// hero panorâmico, jornada em célula única, timeline conectada, modos de
// treino, bloco duplo (dicas + recursos) e CTA final em barra horizontal.
// A sidebar e o espaçamento lateral vêm do AppShell global — aqui só conteúdo.
// Os 3 CTAs reaproveitam a MESMA lógica de início de OSCE (useIniciarOsce).
// ============================================================================

import { useRouter } from "next/navigation";
import { useIniciarOsce } from "@/hooks/useIniciarOsce";
import "./GuiaPage.css";

// Atributos width/height explícitos são obrigatórios: sem eles, o Safari do
// iPad (WebKit) infla o SVG para preencher o container flex/grid em vez de
// respeitar o CSS. No desktop o CSS (`svg { width: Npx }`) tem prioridade
// sobre o atributo de apresentação, então o tamanho segue igual ao aprovado.
function Icon({ d }: { d: string }) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
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
  { icon: "M20 21a8 8 0 10-16 0M12 11a4 4 0 100-8 4 4 0 000 8z", label: "Apresentação" },
  { icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z", label: "Anamnese" },
  { icon: "M20 21a8 8 0 10-16 0M12 11a4 4 0 100-8 4 4 0 000 8z", label: "Exame físico" },
  { icon: "M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z", label: "Hipóteses diagnósticas" },
  { icon: "M9 2h6M12 2v4m-7 5h14l-1.5 9a2 2 0 01-2 1.7H8.5a2 2 0 01-2-1.7L5 11z", label: "Exames complementares" },
  { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2", label: "Conduta" },
  { icon: "M5 21V4m0 0h13l-2.5 4L18 12H5", label: "Fechamento" },
];

const MODOS = [
  { icon: "M5 3l14 9-14 9V3z", titulo: "Treino livre", desc: "Pratique sem tempo, sabendo o diagnóstico antes de começar.", badge: "Mais usado" },
  { icon: "M12 8v4l3 2M12 3a9 9 0 100 18 9 9 0 000-18z", titulo: "OSCE cronometrado", desc: "Estação com tempo, no formato da prova real da faculdade.", badge: "Recomendado" },
  { icon: "M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5z", titulo: "Revisão por patologia", desc: "Aprofunde-se num tema específico e revise antes das provas.", badge: "Novo" },
  { icon: "M12 3a4 4 0 014 4c0 2-2 3-2 5m-2 4h.01M6.5 9a5.5 5.5 0 0111 0c0 3-2.5 4-2.5 7h-6c0-3-2.5-4-2.5-7z", titulo: "Simulação pediátrica", desc: "Casos pediátricos com exame físico e procedimentos por faixa etária." },
  { icon: "M20 21a8 8 0 10-16 0M12 11a4 4 0 100-8 4 4 0 000 8z", titulo: "Simulação adulto", desc: "Casos adultos completos, do acolhimento ao fechamento." },
  { icon: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11", titulo: "Feedback por rubrica", desc: "Pontuação estruturada por critérios objetivos ao final do caso.", badge: "Avançado" },
];

type CategoriaDica = "boa-pratica" | "estrategia" | "alerta";

const DICAS: Array<{ texto: string; categoria: CategoriaDica }> = [
  { texto: "Fale em voz alta o seu raciocínio", categoria: "boa-pratica" },
  { texto: "Justifique cada exame solicitado", categoria: "boa-pratica" },
  { texto: "Organize o raciocínio clínico por etapas", categoria: "estrategia" },
  { texto: "Feche sempre com diagnóstico e conduta", categoria: "estrategia" },
  { texto: "Não pule os sinais vitais", categoria: "alerta" },
  { texto: "Revise o feedback antes do próximo caso", categoria: "alerta" },
];

function DicaIcon({ categoria }: { categoria: CategoriaDica }) {
  if (categoria === "boa-pratica") {
    return (
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20 6L9 17l-5-5" />
      </svg>
    );
  }
  if (categoria === "estrategia") {
    return <Icon d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0012 2z" />;
  }
  return <Icon d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />;
}

const ENCONTRA = [
  { icon: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z", titulo: "Paciente virtual com IA", desc: "Interaja com pacientes realistas em diferentes contextos clínicos." },
  { icon: "M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 11a7 7 0 01-14 0M12 18v4M8 22h8", titulo: "Conversa por voz e texto", desc: "Escolha como interagir: voz natural ou digitação guiada." },
  { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-5 8l2 2 4-4", titulo: "Feedback estruturado por rubricas", desc: "Receba avaliação detalhada por competências clínicas." },
  { icon: "M3 17l6-6 4 4 8-8M21 7h-6v6", titulo: "Casos clínicos progressivos", desc: "Treine casos organizados por dificuldade e sistema." },
];

function badgeClass(badge: string) {
  if (badge === "Mais usado") return "g-tag-blue";
  if (badge === "Recomendado") return "g-tag-green";
  if (badge === "Novo") return "g-tag-pink";
  return "g-tag-amber";
}

export default function GuiaPage() {
  const router = useRouter();
  const { iniciarOSCE, accessModal } = useIniciarOsce();

  return (
    <div className="guia-page">
      {/* ===================== HERO ===================== */}
      <section className="g-hero">
        <div className="g-hero-content">
          <span className="g-badge">
            <i />
            GUIA OSCE
          </span>
          <h1>Guia OSCE</h1>
          <p>
            Tudo o que você precisa para tirar o máximo do Mini Consultório: orientações de uso,
            modos de estudo, o fluxo clínico ideal e dicas de preparação prática para as suas estações OSCE.
          </p>
        </div>
        <div className="g-hero-art" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/guia/hero-guia-final.webp" alt="" draggable={false} />
        </div>
      </section>

      {/* ===================== COMO USAR (jornada em célula única) ===================== */}
      <section>
        <p className="g-heading">Como usar o Mini Consultório</p>
        <div className="g-journey">
          {COMO_USAR.map((c, i) => (
            <div key={c.titulo} className="g-jit">
              <div className="g-jmk">
                <span className="g-jico"><Icon d={c.icon} /></span>
                <span className="g-jnum">{i + 1}</span>
              </div>
              <h3>{c.titulo}</h3>
              <p>{c.desc}</p>
              {i < COMO_USAR.length - 1 && <span className="g-jarrow" aria-hidden="true">›</span>}
            </div>
          ))}
        </div>
      </section>

      {/* ===================== FLUXO IDEAL (timeline) ===================== */}
      <section>
        <p className="g-heading">Fluxo ideal do OSCE</p>
        <div className="g-timeline">
          <div className="g-track">
            {FLUXO.map((etapa, i) => (
              <div key={etapa.label} className="g-step">
                <div className="g-dot">{i + 1}</div>
                <span className="g-slabel">
                  <Icon d={etapa.icon} />
                  {etapa.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== MODOS DE TREINO ===================== */}
      <section>
        <p className="g-heading">Modos de treino</p>
        <div className="g-modes">
          {MODOS.map((m) => (
            <article key={m.titulo} className="g-mode">
              <div className="g-mrow">
                <span className="g-mico"><Icon d={m.icon} /></span>
                <h3>{m.titulo}</h3>
                {m.badge && <span className={`g-tag ${badgeClass(m.badge)}`}>{m.badge}</span>}
              </div>
              <p>{m.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ===================== BLOCO DUPLO ===================== */}
      <section className="g-dual">
        <div>
          <p className="g-heading">Dicas de alta performance</p>
          <div className="g-tips">
            {DICAS.map((d) => (
              <div key={d.texto} className={`g-tip g-tip-${d.categoria}`}>
                <span className="g-tico"><DicaIcon categoria={d.categoria} /></span>
                <span>{d.texto}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="g-heading">O que você encontra no MEDIX</p>
          <div className="g-encontra">
            {ENCONTRA.map((e) => (
              <article key={e.titulo} className="g-ecard">
                <span className="g-eico"><Icon d={e.icon} /></span>
                <h3>{e.titulo}</h3>
                <p>{e.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA FINAL ===================== */}
      <section className="g-cta">
        <div className="g-cta-ill" aria-hidden="true">
          <Icon d="M20 21a8 8 0 10-16 0M12 11a4 4 0 100-8 4 4 0 000 8z" />
        </div>
        <div className="g-cta-txt">
          <h2>Você já conhece o fluxo. Agora é hora de praticar.</h2>
          <p>Treine com pacientes virtuais, tome decisões clínicas e receba feedback estruturado ao final de cada caso.</p>
        </div>
        <div className="g-cta-act">
          <button type="button" className="g-btn g-btn-pri" onClick={() => iniciarOSCE("adulto")}>
            <PlayIcon />
            Iniciar OSCE Adulto
          </button>
          <button type="button" className="g-btn g-btn-ped" onClick={() => iniciarOSCE("pediatrico")}>
            <PlayIcon />
            Iniciar OSCE Pediátrico
          </button>
          <button type="button" className="g-btn g-btn-gho" onClick={() => router.push("/dashboard-landing")}>
            <Icon d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
            Voltar ao Dashboard
          </button>
        </div>
      </section>
      {accessModal}
    </div>
  );
}
