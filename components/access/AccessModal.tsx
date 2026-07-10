"use client";

// Modal exibido ao tentar acessar conteúdo bloqueado (login + planos).

import LoginPlanos from "@/components/access/LoginPlanos";

export default function AccessModal({
  open,
  onClose,
  onLoggedIn,
  titulo = "Conteúdo exclusivo",
  descricao = "Faça login ou assine para desbloquear este conteúdo.",
}: {
  open: boolean;
  onClose: () => void;
  onLoggedIn?: () => void;
  titulo?: string;
  descricao?: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{titulo}</h2>
            <p className="mt-0.5 text-sm text-slate-500">{descricao}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <LoginPlanos onLoggedIn={onLoggedIn} />
      </div>
    </div>
  );
}
