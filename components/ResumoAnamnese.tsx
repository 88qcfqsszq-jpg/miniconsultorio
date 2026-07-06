"use client";

import { MensagemChat } from "@/lib/types";

interface ResumoAnamneseProps {
  mensagens: MensagemChat[];
}

export default function ResumoAnamnese({ mensagens }: ResumoAnamneseProps) {
  const estudanteMsgs = mensagens.filter((m) => m.tipo === "estudante").length;

  if (estudanteMsgs < 2) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
      <h3 className="font-bold text-slate-800 text-sm">Resumo da Anamnese</h3>

      <div className="space-y-3">
        <div className="border-l-2 border-blue-500 pl-3">
          <p className="text-xs font-semibold text-slate-500 uppercase">Informações Coletadas</p>
          <p className="text-sm text-slate-700 mt-1">
            Os dados serão organizados aqui conforme você progride no atendimento.
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600">
          <p>• Queixa principal</p>
          <p>• Sintomas referidos</p>
          <p>• Início/evolução</p>
          <p>• Fatores de melhora/piora</p>
          <p>• Antecedentes importantes</p>
          <p>• Medicamentos/alergias</p>
          <p>• Hábitos relevantes</p>
        </div>
      </div>
    </div>
  );
}
