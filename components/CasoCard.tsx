"use client";

import Link from "next/link";
import { Caso } from "@/lib/types";

interface CasoCardProps {
  caso: Caso;
  /** Caso bloqueado (free tier): mostra cadeado e não navega. */
  locked?: boolean;
  /** Ação ao clicar num caso bloqueado (abrir login/planos). */
  onLockedClick?: () => void;
  /** Tipo do paciente para a rota (adulto/pediátrico). Se omitido, deriva do caso. */
  tipo?: "adulto" | "pediatrico";
}

const CONFIG_SISTEMA: Record<string, { icon: string; cor: string; badge: string }> = {
  Cardiovascular: { icon: "❤️", cor: "border-rose-400", badge: "bg-rose-50 text-rose-700" },
  Respiratório:   { icon: "🫁", cor: "border-sky-400",  badge: "bg-sky-50 text-sky-700" },
  Infectologia:   { icon: "🦠", cor: "border-amber-400", badge: "bg-amber-50 text-amber-700" },
  Semiologia:     { icon: "🩺", cor: "border-violet-400", badge: "bg-violet-50 text-violet-700" },
};

const NIVEL_BADGE: Record<string, string> = {
  iniciante:    "bg-emerald-50 text-emerald-700",
  intermediario: "bg-blue-50 text-blue-700",
  avancado:     "bg-purple-50 text-purple-700",
};

export default function CasoCard({ caso, locked = false, onLockedClick, tipo }: CasoCardProps) {
  const cfg = CONFIG_SISTEMA[caso.sistema] ?? { icon: "📋", cor: "border-slate-300", badge: "bg-slate-50 text-slate-600" };
  const nivelClass = NIVEL_BADGE[caso.nivel] ?? "bg-slate-50 text-slate-600";
  const nivelLabel = caso.nivel === "iniciante" ? "Iniciante" : caso.nivel === "intermediario" ? "Intermediário" : "Avançado";

  // Tipo do paciente (deriva do caso se não for informado).
  const tipoPaciente: "adulto" | "pediatrico" =
    tipo ?? ((caso as any)?.tipoPaciente === "pediatrico" || (caso as any)?.paciente?.tipoPaciente === "pediatrico" ? "pediatrico" : "adulto");
  const href = `/caso/${caso.id}?modo=treinamento&tipo=${tipoPaciente}`;

  return (
    <div className={`relative bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all flex flex-col overflow-hidden border-t-4 ${cfg.cor}`}>
      {locked && (
        <span
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 shadow-sm"
          aria-label="Conteúdo bloqueado"
          title="Conteúdo bloqueado"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v3m-6 5h12a1 1 0 001-1v-7a1 1 0 00-1-1H6a1 1 0 00-1 1v7a1 1 0 001 1zm9-9V7a4 4 0 10-8 0v3" />
          </svg>
        </span>
      )}
      <div className="p-5 flex-1">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl shrink-0 mt-0.5">{cfg.icon}</span>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-snug line-clamp-2">{caso.titulo}</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>{caso.sistema}</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${nivelClass}`}>{nivelLabel}</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tipoPaciente === "pediatrico" ? "bg-teal-50 text-teal-700" : "bg-slate-100 text-slate-600"}`}>
            {tipoPaciente === "pediatrico" ? "Pediátrico" : "Adulto"}
          </span>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 space-y-1 border border-slate-100">
          <p className="text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Paciente:</span> {caso.paciente.nome}, {caso.paciente.idade} anos
          </p>
          <p className="text-xs text-slate-600 line-clamp-2">
            <span className="font-semibold text-slate-700">Queixa:</span> {caso.paciente.queixaPrincipal}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5">
        {locked ? (
          <button
            type="button"
            onClick={onLockedClick}
            className="w-full bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-600 font-semibold py-2.5 px-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v3m-6 5h12a1 1 0 001-1v-7a1 1 0 00-1-1H6a1 1 0 00-1 1v7a1 1 0 001 1zm9-9V7a4 4 0 10-8 0v3" />
            </svg>
            Desbloquear
          </button>
        ) : (
          <Link href={href}>
            <button className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-2.5 px-4 rounded-xl transition-all text-sm">
              Iniciar Atendimento
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
