"use client";

import Link from "next/link";
import { Caso } from "@/lib/types";

interface CasoCardProps {
  caso: Caso;
}

export default function CasoCard({ caso }: CasoCardProps) {
  const iconePorCategoria: { [key: string]: string } = {
    SCA: "❤️",
    Pneumonia: "🫁",
    Asma: "💨",
  };

  const icon = iconePorCategoria[caso.categoria] || "📋";

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-500">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">{icon}</span>
            <h3 className="text-xl font-bold text-gray-800">{caso.titulo}</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">{caso.descricaoBreve}</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded p-3 mb-4">
        <p className="text-sm text-gray-700 mb-2">
          <span className="font-semibold">Paciente:</span> {caso.paciente.nome}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Queixa:</span>{" "}
          {caso.paciente.queixaPrincipal}
        </p>
      </div>

      <Link href={`/caso/${caso.id}`}>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
          Iniciar Atendimento
        </button>
      </Link>
    </div>
  );
}
