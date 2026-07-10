// ============================================================================
// LaboratoryPanel — seção "Exames Laboratoriais" do atendimento
// ----------------------------------------------------------------------------
// UM único botão na sidebar abre este painel, com cards internos para cada
// exame. Ao selecionar, renderiza o laudo correspondente (Hemograma usa o laudo
// dedicado; os demais usam o laudo genérico do LaboratoryEngine). Estado local
// preservado enquanto a aba estiver ativa. Responsivo (desktop/mobile).
// ============================================================================

"use client";

import { useMemo, useState } from "react";
import { LAB_TESTS, generateLabs, resumoLabPanel } from "@/src/lab/LaboratoryEngine";
import LabReport from "@/src/lab/LabReport";
import HemogramaReport from "@/src/components/HemogramaReport";

export default function LaboratoryPanel({
  caso,
  onExamViewed,
}: {
  caso: any;
  // resumo = resultado OBJETIVO do laudo (valores), para o relatório/feedback.
  onExamViewed?: (id: string, label: string, resumo?: string) => void;
}) {
  const [sel, setSel] = useState<string>("hemograma");

  // Determinístico por caso — recomputar não muda os valores.
  const resultados = useMemo(() => generateLabs({ caso }), [caso]);
  const atual = resultados[sel];

  const selecionar = (id: string, label: string) => {
    setSel(id);
    // Fase 27: visualizar o laudo é uma AÇÃO REAL → registra como evidência,
    // agora com o RESULTADO objetivo do exame (não apenas "visualizado").
    onExamViewed?.(id, label, resumoLabPanel(resultados[id]));
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-black text-slate-900">🧪 Exames Laboratoriais</h3>
        <p className="text-sm text-slate-500">Selecione um exame para visualizar o laudo do caso.</p>
      </div>

      {/* Cards / seletor de exames */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {LAB_TESTS.map((t) => {
          const r = resultados[t.id];
          const alterado = r && r.nivel !== "normal";
          const ativo = sel === t.id;
          return (
            <button
              key={t.id}
              onClick={() => selecionar(t.id, t.label)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                ativo ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.iconSrc} alt={t.iconAlt} className="lab-exam-icon h-9 w-9 shrink-0 object-contain sm:h-11 sm:w-11" draggable={false} />
              <span className="flex-1 leading-tight">{t.label}</span>
              {alterado && <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" title="Com alterações" />}
            </button>
          );
        })}
      </div>

      {/* Laudo do exame selecionado */}
      <div>
        {sel === "hemograma" ? (
          <HemogramaReport caso={caso} />
        ) : atual ? (
          <LabReport result={atual} />
        ) : (
          <p className="text-sm text-slate-400">Exame indisponível para este caso.</p>
        )}
      </div>
    </div>
  );
}
