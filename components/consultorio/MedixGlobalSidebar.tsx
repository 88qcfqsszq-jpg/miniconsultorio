"use client";

// ============================================================================
// MedixGlobalSidebar — sidebar global MEDIX (navegação).
// Itens "Simular Adulto/Pediatria" reproduzem a MESMA ação dos botões da
// página /faca-o-osce (caso OSCE aleatório do tipo → /caso/<id>?modo=osce&tipo).
// Não contém lógica clínica.
// ============================================================================

import { useRouter } from "next/navigation";
import { urlOSCEAleatorio, type TipoOSCE } from "@/lib/osce/iniciar-osce";

const ICON_BASE = "/assets/dashboard/sidebar-icons";

const ITENS: Array<{
  key: string;
  label: string;
  icon: string;
  href?: string;
  tipo?: TipoOSCE;
}> = [
  { key: "dashboard", label: "Dashboard", icon: "icon-dashboard.png", href: "/dashboard-landing" },
  { key: "simular-adulto", label: "Simular Adulto", icon: "icon-simulacao.png", tipo: "adulto" },
  { key: "simular-pediatria", label: "Simular Pediatria", icon: "icon-simulacao-pediatria.png", tipo: "pediatrico" },
  { key: "guia-clinico", label: "Guia Clínico", icon: "icon-conteudos.png", href: "#" },
  { key: "casos", label: "Casos", icon: "icon-casos-clinicos.png", href: "/treinamento" },
  { key: "desempenho", label: "Desempenho", icon: "icon-desempenho.png", href: "#" },
  { key: "biblioteca", label: "Biblioteca", icon: "icon-biblioteca.png", href: "#" },
  { key: "configuracoes", label: "Configurações", icon: "icon-configuracoes.png", href: "#" },
];

export default function MedixGlobalSidebar() {
  const router = useRouter();

  const iniciarOSCE = (tipo: TipoOSCE) => {
    const url = urlOSCEAleatorio(tipo);
    if (!url) {
      alert(`Nenhum caso ${tipo} disponível no momento.`);
      return;
    }
    router.push(url);
  };

  return (
    <aside className="medix-gsb" aria-label="Menu MEDIX">
      <div className="medix-gsb-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/dashboard/logo-medix.png" alt="MEDIX" draggable={false} />
      </div>

      <nav className="medix-gsb-nav">
        {ITENS.map((it) => {
          const inner = (
            <>
              <span className="medix-gsb-icon">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${ICON_BASE}/${it.icon}`} alt="" draggable={false} />
              </span>
              <span className="medix-gsb-label">{it.label}</span>
            </>
          );
          if (it.tipo) {
            return (
              <button
                key={it.key}
                type="button"
                className="medix-gsb-item"
                aria-label={it.label}
                onClick={() => iniciarOSCE(it.tipo as TipoOSCE)}
              >
                {inner}
              </button>
            );
          }
          return (
            <a key={it.key} href={it.href} className="medix-gsb-item" aria-label={it.label}>
              {inner}
            </a>
          );
        })}
      </nav>

      <div className="medix-gsb-journey" aria-hidden="true">
        <span className="lvl">N12</span>
        <span className="bar">
          <i />
        </span>
      </div>
    </aside>
  );
}
