"use client";

// ============================================================================
// AppSidebar — sidebar GLOBAL única do app (navegação principal).
// Usada pelo AppShell em todas as páginas internas. Visual idêntico em toda
// parte. Contém:
//   - logo
//   - grupo de 3 botões play (OSCE Adulto / OSCE Pediátrico / Casos)
//   - navegação geral (rotas REAIS existentes; itens sem rota ficam inertes)
//   - card inferior (jornada)
// Não contém lógica clínica nem menus internos de atendimento.
// ============================================================================

import { usePathname, useRouter } from "next/navigation";
import { urlOSCEAleatorio, type TipoOSCE } from "@/lib/osce/iniciar-osce";
import { useUserProfile } from "@/hooks/useUserProfile";
import { displayName, initials } from "@/lib/userProfile";

const ICON_BASE = "/assets/dashboard/sidebar-icons";

// Apenas rotas REAIS existentes recebem href navegável. Itens ainda sem página
// (Guia, Desempenho, Biblioteca, Configurações) ficam inertes (não inventamos rotas).
const NAV_ITEMS: Array<{ key: string; label: string; icon: string; href: string }> = [
  { key: "dashboard", label: "Dashboard", icon: "icon-dashboard.png", href: "/dashboard-landing" },
  { key: "guia", label: "Guia Clínico", icon: "icon-conteudos.png", href: "/guia" },
  { key: "desempenho", label: "Desempenho", icon: "icon-desempenho.png", href: "#" },
  { key: "centro-clinico", label: "Centro Clínico", icon: "icon-biblioteca.png", href: "/centro-clinico" },
  { key: "config", label: "Meu Perfil", icon: "icon-configuracoes.png", href: "/meu-perfil" },
];

function isNavActive(href: string, pathname: string): boolean {
  if (href === "/dashboard-landing") return pathname === "/" || pathname.startsWith("/dashboard-landing");
  if (href === "/faca-o-osce") return pathname.startsWith("/faca-o-osce");
  if (href === "/treinamento") return pathname.startsWith("/treinamento");
  if (href === "/guia") return pathname.startsWith("/guia");
  if (href === "/centro-clinico") return pathname.startsWith("/centro-clinico");
  if (href === "/meu-perfil") return pathname.startsWith("/meu-perfil");
  return false;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 12H3m0 0l4-4m-4 4l4 4M13 4h5a2 2 0 012 2v12a2 2 0 01-2 2h-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Nome da plataforma já definido no projeto (logo alt / package "MEDIX").
const PLATFORM_NAME = "MEDIX";

export default function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() || "";
  const router = useRouter();

  const iniciarOSCE = (tipo: TipoOSCE) => {
    const url = urlOSCEAleatorio(tipo);
    if (!url) {
      alert(`Nenhum caso ${tipo} disponível no momento.`);
      return;
    }
    onNavigate?.();
    router.push(url);
  };

  const irPara = (href: string) => {
    onNavigate?.();
    router.push(href);
  };

  // Logout: usa navegação existente (sem sistema de auth próprio, redireciona à home).
  const sair = () => {
    onNavigate?.();
    router.push("/");
  };

  // Fonte única de perfil (mesma da top bar e de /meu-perfil).
  const { profile } = useUserProfile();
  const nomeExibido = displayName(profile);
  const iniciais = initials(profile);
  const foto = profile.avatarDataUrl;

  return (
    <aside className="app-sidebar" aria-label="Navegação principal">
      <div className="app-sidebar-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/dashboard/logo-medix.png"
          alt="MEDIX"
          draggable={false}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Nome da plataforma — visível só na sidebar expandida */}
        <span className="app-brand-name">{PLATFORM_NAME}</span>
      </div>

      {/* Avatar/foto do usuário (abaixo da logo) + nome (só expandida) */}
      <div className="app-sidebar-user">
        <div className="app-user-avatar" aria-hidden={foto ? undefined : true}>
          {foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={foto} alt={nomeExibido} draggable={false} />
          ) : (
            <span className="app-user-initials">{iniciais}</span>
          )}
        </div>
        <span className="app-user-name">{nomeExibido}</span>
      </div>

      {/* Grupo de 3 botões play (balões) — fundo transparente */}
      <div className="app-play-group" aria-label="Iniciar simulação">
        <button
          type="button"
          className="app-play app-play-adulto"
          onClick={() => iniciarOSCE("adulto")}
          aria-label="OSCE Adulto"
        >
          <span className="app-play-dot"><PlayIcon /></span>
          <span className="app-play-label">OSCE Adulto</span>
        </button>
        <button
          type="button"
          className="app-play app-play-ped"
          onClick={() => iniciarOSCE("pediatrico")}
          aria-label="OSCE Pediátrico"
        >
          <span className="app-play-dot"><PlayIcon /></span>
          <span className="app-play-label">OSCE Pediátrico</span>
        </button>
        <button
          type="button"
          className="app-play app-play-casos"
          onClick={() => irPara("/treinamento")}
          aria-label="Casos e treinamento"
        >
          <span className="app-play-dot"><PlayIcon /></span>
          <span className="app-play-label">Casos</span>
        </button>
      </div>

      <nav className="app-nav">
        {NAV_ITEMS.map((it) => {
          const inerte = it.href === "#";
          return (
            <a
              key={it.key}
              href={it.href}
              className={`app-nav-item${isNavActive(it.href, pathname) ? " active" : ""}`}
              aria-disabled={inerte || undefined}
              onClick={(e) => {
                e.preventDefault();
                if (inerte) return;
                irPara(it.href);
              }}
            >
              <span className="app-nav-icon">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${ICON_BASE}/${it.icon}`}
                  alt=""
                  draggable={false}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                  }}
                />
              </span>
              <span className="app-nav-label">{it.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="app-journey" aria-hidden="true">
        <div className="app-journey-full">
          <h4>Sua jornada</h4>
          <div className="app-journey-level">Nível 12</div>
        </div>
        <div className="app-journey-bar">
          <i />
        </div>
      </div>

      {/* Rodapé: botão Sair (mesmo estilo dos itens de navegação) */}
      <button type="button" className="app-nav-item app-logout" onClick={sair} aria-label="Sair">
        <span className="app-nav-icon app-logout-icon">
          <LogoutIcon />
        </span>
        <span className="app-nav-label">Sair</span>
      </button>
    </aside>
  );
}
