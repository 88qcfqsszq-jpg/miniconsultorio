"use client";

// ============================================================================
// DashboardLanding — página inicial do dashboard médico/acadêmico (isolada)
// ----------------------------------------------------------------------------
// Usa EXCLUSIVAMENTE os assets fornecidos em /public/assets/dashboard/.
// Não gera nem redesenha imagens. Quando um asset ainda não existe, há um
// fallback visual leve (no mesmo estilo) e o código já está pronto para
// receber os arquivos reais depois.
// ============================================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import "./DashboardLanding.css";
import { todosCasosAdultos, todosCasosPediatricos } from "@/data/casos-v2";
import { useUserProfile } from "@/hooks/useUserProfile";
import { displayName, initials } from "@/lib/userProfile";

const ASSET_BASE = "/assets/dashboard";

const METRICS = [
  { label: "Disciplinas ativas", value: "8", delta: "+2 este mês" },
  { label: "Conteúdos estudados", value: "126", delta: "+18 este mês" },
  { label: "Horas de estudo", value: "48h", delta: "+12% vs último mês" },
  { label: "Simulados realizados", value: "5", delta: "+1 este mês" },
  { label: "Média de desempenho", value: "82%", delta: "+8% vs último mês" },
];

function HeaderIcon({ d }: { d: string }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Ícone por especialidade/sistema, usando apenas assets existentes.
function iconePorSistema(sistema: string): { src?: string; dot: string; virus?: boolean } {
  const s = (sistema || "").toLowerCase();
  if (s.includes("cardio") || s.includes("vascular")) return { src: "case-heart.png", dot: "#e74c3c" };
  if (s.includes("respirat") || s.includes("orl") || s.includes("pneumo")) return { src: "case-lung-blue.png", dot: "#3b8bff" };
  if (s.includes("infec")) return { src: "case-virus.png", dot: "#1aa06d", virus: true };
  if (s.includes("hemat")) return { dot: "#c0392b" };
  if (s.includes("endocrin")) return { dot: "#d97706" };
  if (s.includes("nefro") || s.includes("renal")) return { dot: "#0ea5a5" };
  if (s.includes("neuro")) return { dot: "#6366f1" };
  if (s.includes("imuno")) return { dot: "#8e6bd6" };
  return { dot: "#1f7bff" };
}

function CaseIcon({ titulo, sistema }: { titulo: string; sistema: string }) {
  const { src, dot, virus } = iconePorSistema(sistema);
  const [ok, setOk] = useState(true);
  return (
    <div className={`dl-case-ico${virus ? " is-virus" : ""}`}>
      {src && ok ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${ASSET_BASE}/${src}`}
          alt={titulo}
          onError={() => setOk(false)}
          draggable={false}
        />
      ) : (
        <span className="dl-ico-dot" style={{ background: dot }} />
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------
// FreshHeroCarousel — carrossel novo, isolado (1 imagem + 1 bloco de texto por vez)
// ----------------------------------------------------------------------------
const FRESH_HERO_SLIDES = [
  {
    image: "/assets/dashboard/hero-medica-holograma.png",
    eyebrow: "BEM-VINDO(A)",
    titleTop: "Interativo",
    titleBottom: "Tutor Clínico de IA",
    description:
      "Experimente encontros clínicos sem atrito, voz a voz, alimentados por nossa IA avançada.",
    button: "Iniciar A Simulação ↗",
  },
  {
    image: "/assets/dashboard/hero-slide-2.png",
    eyebrow: "PRÁTICA CLÍNICA",
    titleTop: "Casos OSCE",
    titleBottom: "Inteligentes",
    description:
      "Treine raciocínio clínico, anamnese, exame físico e conduta em ambiente seguro.",
    button: "Ver Casos Clínicos ↗",
  },
  {
    image: "/assets/dashboard/hero-slide-3.png",
    eyebrow: "ATENDIMENTO",
    titleTop: "Simule Atendimentos",
    titleBottom: "com a IA",
    description:
      "Pratique entrevistas clínicas realistas com pacientes virtuais e receba feedback inteligente em tempo real.",
    button: "Iniciar Simulação ↗",
  },
];

function FreshHeroCarousel() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slide = FRESH_HERO_SLIDES[index] ?? FRESH_HERO_SLIDES[0];

  useEffect(() => {
    if (isPaused || FRESH_HERO_SLIDES.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % FRESH_HERO_SLIDES.length);
    }, 5000);
    return () => {
      window.clearInterval(timer);
    };
  }, [isPaused]);

  const nextSlide = () => {
    setIndex((current) => (current + 1) % FRESH_HERO_SLIDES.length);
  };
  const prevSlide = () => {
    setIndex((current) => (current === 0 ? FRESH_HERO_SLIDES.length - 1 : current - 1));
  };

  return (
    <section
      className="fresh-hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={slide.image}
        src={slide.image}
        alt=""
        className="fresh-hero-image"
        draggable={false}
        onError={(event) => {
          const img = event.currentTarget;
          if (img.src.includes("hero-medica-holograma.png")) return;
          img.src = "/assets/dashboard/hero-medica-holograma.png";
        }}
      />

      <div className="fresh-hero-overlay" aria-hidden="true" />

      <div key={`fresh-content-${index}`} className="fresh-hero-content">
        <p className="fresh-hero-eyebrow">{slide.eyebrow}</p>
        <h1>
          <span>{slide.titleTop}</span>
          <strong>{slide.titleBottom}</strong>
        </h1>
        <p className="fresh-hero-description">{slide.description}</p>
        <button type="button" className="fresh-hero-cta">
          {slide.button}
        </button>
      </div>

      <button
        type="button"
        className="fresh-hero-arrow fresh-hero-arrow-left"
        aria-label="Slide anterior"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          prevSlide();
        }}
      >
        ‹
      </button>
      <button
        type="button"
        className="fresh-hero-arrow fresh-hero-arrow-right"
        aria-label="Próximo slide"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          nextSlide();
        }}
      >
        ›
      </button>

      <div className="fresh-hero-dots" aria-label="Paginação do hero">
        {FRESH_HERO_SLIDES.map((_, dotIndex) => (
          <button
            key={dotIndex}
            type="button"
            aria-label={`Ir para slide ${dotIndex + 1}`}
            className={dotIndex === index ? "active" : ""}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIndex(dotIndex);
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default function DashboardLanding() {
  const { profile } = useUserProfile();

  // Lista completa da plataforma: adultos + pediátricos ativos, sem hardcode.
  const casosRecomendados = [
    ...todosCasosAdultos
      .filter((c: any) => c.ativo !== false)
      .map((c: any) => ({ id: c.id, titulo: c.titulo, sistema: c.sistema, area: c.sistema })),
    ...todosCasosPediatricos
      .filter((c: any) => c.ativo !== false)
      .map((c: any) => ({
        id: c.id,
        titulo: c.titulo,
        sistema: c.sistema,
        area: `Pediatria · ${c.sistema}`,
      })),
  ];

  return (
    <div className="dashboard-landing">
      {/* Sidebar removida: agora é global (AppShell/AppSidebar). */}

      {/* ===================== BODY ===================== */}
      <div className="dl-body">
        {/* header */}
        <header className="dl-header glass-panel">
          <div className="dl-greet">
            <div className="dl-avatar">
              {profile.avatarDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarDataUrl} alt={displayName(profile)} />
              ) : (
                initials(profile)
              )}
            </div>
            <div>
              <h3>
                Olá, {displayName(profile)} <span className="dl-badge">PRO</span>
              </h3>
              <p>Seja bem-vindo à sua plataforma acadêmica</p>
            </div>
          </div>

          <div className="dl-search">
            <HeaderIcon d="M21 21l-4.3-4.3M11 19a8 8 0 100-16 8 8 0 000 16z" />
            <input placeholder="Buscar conteúdos, casos, disciplinas..." />
          </div>

          <div className="dl-actions">
            <button className="dl-iconbtn" type="button" aria-label="Notificações">
              <HeaderIcon d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" />
            </button>
            <button className="dl-iconbtn" type="button" aria-label="Calendário">
              <HeaderIcon d="M3 9h18M7 3v3m10-3v3M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" />
            </button>
            <button className="dl-iconbtn" type="button" aria-label="Mensagens">
              <HeaderIcon d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </button>
            <a className="dl-iconbtn" href="/meu-perfil" aria-label="Meu Perfil">
              <HeaderIcon d="M20 21a8 8 0 10-16 0M12 11a4 4 0 100-8 4 4 0 000 8z" />
            </a>
          </div>
        </header>

        {/* content: main + right */}
        <div className="dl-content">
          <main className="dl-main">
            {/* HERO — carrossel novo isolado */}
            <FreshHeroCarousel />

            {/* METRIC CARDS */}
            <section className="dl-metrics">
              {METRICS.map((m) => (
                <div key={m.label} className="dl-metric glass-panel">
                  <span className="dl-metric-label">{m.label}</span>
                  <span className="dl-metric-value">{m.value}</span>
                  <span className="dl-metric-delta">{m.delta}</span>
                </div>
              ))}
            </section>
          </main>

          {/* RIGHT PANEL — casos verticalizados com scroll interno */}
          <aside className="dl-right glass-panel">
            <h3>Casos recomendados pela IA</h3>
            <div className="dl-right-cases">
              {casosRecomendados.map((c) => (
                <Link key={c.id} href={`/caso/${c.id}`} className="dl-case">
                  <CaseIcon titulo={c.titulo} sistema={c.sistema} />
                  <div className="dl-case-body">
                    <h5>{c.titulo}</h5>
                    <span>{c.area}</span>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
