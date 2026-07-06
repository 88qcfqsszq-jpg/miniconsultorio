"use client";

// ============================================================================
// AppShell — casca GLOBAL do app: sidebar fixa à esquerda + área de conteúdo.
// Renderiza uma ÚNICA AppSidebar para todas as páginas internas (via children).
// No mobile a sidebar vira drawer off-canvas, acionado por um botão flutuante.
// Não contém lógica de negócio; apenas layout.
// ============================================================================

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AppSidebar from "./AppSidebar";
import "./AppShell.css";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Fecha o drawer ao trocar de rota (evita ficar aberto após navegar no mobile).
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className={`app-shell${menuOpen ? " app-shell-menu-open" : ""}`}>
      <button
        type="button"
        className="app-menu-toggle"
        aria-label="Abrir menu de navegação"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div
        className="app-sidebar-backdrop"
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
      />

      <AppSidebar onNavigate={() => setMenuOpen(false)} />

      <main className="app-main">{children}</main>
    </div>
  );
}
