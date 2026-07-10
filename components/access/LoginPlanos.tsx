"use client";

// Painel de Login + Planos (reutilizado no modal de bloqueio e em /meu-perfil).
// Login é SIMULADO (localStorage) — sem pagamento/auth real por enquanto.

import { setLoggedIn } from "@/lib/accessControl";

const PLANOS = [
  {
    nome: "Gratuito",
    preco: "R$ 0",
    destaque: false,
    itens: [
      "1 caso clínico liberado (Dor Torácica — SCA)",
      "1 OSCE adulto gratuito",
      "1 OSCE pediátrico gratuito",
      "Sem geração de casos com IA",
    ],
    limitacao: true,
  },
  {
    nome: "Estudante / PRO",
    preco: "em breve",
    destaque: true,
    itens: [
      "Todos os casos clínicos liberados",
      "OSCE adulto e pediátrico ilimitados",
      "Geração de casos com IA",
      "Feedback completo e plano de estudo",
    ],
    limitacao: false,
  },
];

export default function LoginPlanos({ onLoggedIn }: { onLoggedIn?: () => void }) {
  const entrar = () => {
    setLoggedIn(true);
    onLoggedIn?.();
  };

  return (
    <div className="space-y-6">
      {/* Login */}
      <div>
        <h3 className="text-base font-bold text-slate-800">Entre para continuar</h3>
        <p className="mt-0.5 text-sm text-slate-500">Acesse com sua conta ou crie um cadastro.</p>
        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={entrar}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <span className="font-black text-[15px] text-[#4285F4]">G</span> Entrar com Google
          </button>
          <button
            type="button"
            onClick={entrar}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden><path d="M16.4 12.9c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.7.8-3.5 2.1-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.6 1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4 0 0-2.1-.8-2.1-3.1zM14.3 6.3c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2z" /></svg>
            Entrar com Apple
          </button>
          <button
            type="button"
            onClick={entrar}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-105"
          >
            Criar conta / cadastro manual
          </button>
        </div>
      </div>

      {/* Planos */}
      <div>
        <h3 className="text-base font-bold text-slate-800">Planos</h3>
        <div className="mt-3 grid grid-cols-1 gap-3">
          {PLANOS.map((p) => (
            <div
              key={p.nome}
              className={`rounded-2xl border p-4 ${
                p.destaque ? "border-blue-300 bg-blue-50/60 ring-1 ring-blue-200" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-black text-slate-800">{p.nome}</span>
                <span className={`text-sm font-bold ${p.destaque ? "text-blue-700" : "text-slate-500"}`}>{p.preco}</span>
              </div>
              <ul className="mt-2 space-y-1">
                {p.itens.map((it) => (
                  <li key={it} className={`flex items-start gap-2 text-xs ${p.limitacao ? "text-slate-500" : "text-slate-700"}`}>
                    <span className={p.destaque ? "text-blue-600" : "text-slate-400"}>{p.limitacao ? "•" : "✓"}</span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] italic text-slate-400">Pagamento ainda não disponível — o plano PRO chega em breve.</p>
      </div>
    </div>
  );
}
