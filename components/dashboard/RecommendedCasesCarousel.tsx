"use client";

// ============================================================================
// RecommendedCasesCarousel — barra/carrossel horizontal de casos no Dashboard
// ----------------------------------------------------------------------------
// Usa a fonte global de casos (data/casos-v2) — adultos + pediátricos ativos —
// sem duplicar dados. Ícones apenas dos assets existentes em
// /public/assets/dashboard; especialidades sem asset usam o dot colorido.
// Estilos em DashboardLanding.css, escopados sob .dashboard-landing.
// ============================================================================

import { useRef, useState } from "react";
import Link from "next/link";
import { todosCasosAdultos, todosCasosPediatricos } from "@/data/casos-v2";

const ASSET_BASE = "/assets/dashboard";

/** Ícone por especialidade/sistema. `src` só quando o asset existe. */
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

/** Ícone do card com fallback (dot colorido) se o asset falhar/não existir. */
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

export default function RecommendedCasesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Lista COMPLETA da plataforma (mesma fonte do Treinamento): adultos +
  // pediátricos, apenas ativos, sem duplicar dados.
  const casos: Array<{ id: string; titulo: string; sistema: string; area: string }> = [
    ...todosCasosAdultos
      .filter((c: any) => c.ativo !== false)
      .map((c: any) => ({ id: c.id, titulo: c.titulo, sistema: c.sistema, area: c.sistema })),
    ...todosCasosPediatricos
      .filter((c: any) => c.ativo !== false)
      .map((c: any) => ({ id: c.id, titulo: c.titulo, sistema: c.sistema, area: `Pediatria · ${c.sistema}` })),
  ];

  const atualizarNav = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const rolar = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <section className="dl-cases-carousel glass-panel">
      <div className="dl-cases-carousel-head">
        <h3>Casos recomendados pela IA</h3>
        <div className="dl-cases-carousel-nav">
          <button
            type="button"
            className="dl-cases-carousel-btn"
            aria-label="Casos anteriores"
            disabled={!canPrev}
            onClick={() => rolar(-1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="dl-cases-carousel-btn"
            aria-label="Próximos casos"
            disabled={!canNext}
            onClick={() => rolar(1)}
          >
            ›
          </button>
        </div>
      </div>

      <div className="dl-cases-track" ref={trackRef} onScroll={atualizarNav}>
        {casos.map((c) => (
          <Link key={c.id} href={`/caso/${c.id}`} className="dl-case">
            <CaseIcon titulo={c.titulo} sistema={c.sistema} />
            <div className="dl-case-body">
              <h5>{c.titulo}</h5>
              <span>{c.area}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
