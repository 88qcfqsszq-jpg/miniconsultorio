"use client";

import Link from "next/link";
import { Caso } from "@/lib/types";

interface CasoCardProps {
  caso: Caso;
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

export default function CasoCard({ caso }: CasoCardProps) {
  const cfg = CONFIG_SISTEMA[caso.sistema] ?? { icon: "📋", cor: "border-slate-300", badge: "bg-slate-50 text-slate-600" };
  const nivelClass = NIVEL_BADGE[caso.nivel] ?? "bg-slate-50 text-slate-600";
  const nivelLabel = caso.nivel === "iniciante" ? "Iniciante" : caso.nivel === "intermediario" ? "Intermediário" : "Avançado";

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all flex flex-col overflow-hidden border-t-4 ${cfg.cor}`}>
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
        <Link href={`/caso/${caso.id}`}>
          <button className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-2.5 px-4 rounded-xl transition-all text-sm">
            Iniciar Atendimento
          </button>
        </Link>
      </div>
    </div>
  );
}
