// ============================================================================
// LaboratoryEngine — LAUDO GENÉRICO (componente único p/ todos os painéis)
// ----------------------------------------------------------------------------
// Renderiza qualquer LabPanelResult no mesmo padrão visual do Hemograma:
// laboratório fictício, dados do paciente/coleta, título, tabela por seção com
// setas ↑↓, observações e nota educacional. Sem IA, sem rede.
// ============================================================================

import type { LabAnalyte, LabPanelResult, NivelAlteracao } from "@/src/lab/labTypes";

const NIVEL_STYLE: Record<NivelAlteracao, { label: string; cls: string }> = {
  normal: { label: "Sem alterações relevantes", cls: "bg-emerald-100 text-emerald-700" },
  leve: { label: "Alteração leve", cls: "bg-amber-100 text-amber-700" },
  moderado: { label: "Alteração moderada", cls: "bg-orange-100 text-orange-700" },
  grave: { label: "Alteração importante", cls: "bg-red-100 text-red-700" },
};

function Linha({ a }: { a: LabAnalyte }) {
  const cor = a.flag === "↑" ? "text-red-600" : a.flag === "↓" ? "text-blue-600" : "text-slate-800";
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="py-2 pr-2 text-sm text-slate-700">{a.nome}</td>
      <td className={`py-2 pr-2 text-sm font-bold tabular-nums ${cor}`}>
        {a.valor}
        {a.flag && <span className="ml-1">{a.flag}</span>}
      </td>
      <td className="py-2 pr-2 text-xs text-slate-500">{a.unidade}</td>
      <td className="py-2 text-xs text-slate-500 tabular-nums">{a.ref}</td>
    </tr>
  );
}

export default function LabReport({ result }: { result: LabPanelResult }) {
  const nivel = NIVEL_STYLE[result.nivel];
  const idade = result.paciente.idade != null ? `${result.paciente.idade} anos` : "—";
  const sexo = result.paciente.sexo === "F" ? "Feminino" : "Masculino";
  const dataColeta = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg text-white">🧪</div>
          <div>
            <p className="text-base font-black text-slate-900">Laboratório Escola Mini Consultório</p>
            <p className="text-[11px] text-slate-400">Análises Clínicas · uso educacional/simulado</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${nivel.cls}`}>{nivel.label}</span>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-1 px-5 py-4 text-xs sm:grid-cols-4">
        <div><span className="text-slate-400">Paciente</span><p className="font-semibold text-slate-700">{result.paciente.nome ?? "Paciente"}</p></div>
        <div><span className="text-slate-400">Idade</span><p className="font-semibold text-slate-700">{idade}</p></div>
        <div><span className="text-slate-400">Sexo</span><p className="font-semibold text-slate-700">{sexo}</p></div>
        <div><span className="text-slate-400">Coleta</span><p className="font-semibold text-slate-700">{dataColeta}</p></div>
      </div>

      <div className="px-5">
        <h3 className="rounded-lg bg-slate-800 py-2 text-center text-sm font-black uppercase tracking-widest text-white">{result.titulo}</h3>
      </div>

      <div className="px-5 pb-2">
        {result.sections.map((sec) => (
          <div key={sec.titulo} className="mt-5">
            <h4 className="mb-1 border-b-2 border-slate-800 pb-1 text-xs font-black uppercase tracking-wide text-slate-800">{sec.titulo}</h4>
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] font-bold uppercase text-slate-400">
                  <th className="py-1 pr-2">Exame</th>
                  <th className="py-1 pr-2">Resultado</th>
                  <th className="py-1 pr-2">Unidade</th>
                  <th className="py-1">Referência</th>
                </tr>
              </thead>
              <tbody>{sec.itens.map((a) => <Linha key={a.nome} a={a} />)}</tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="px-5 pb-2 text-[11px] text-slate-400">
        <span className="font-bold text-red-600">↑</span> acima da referência ·{" "}
        <span className="font-bold text-blue-600">↓</span> abaixo da referência
      </div>

      {result.observacoes.length > 0 && (
        <div className="mx-5 mb-4 rounded-xl bg-slate-50 p-4">
          <p className="mb-1 text-xs font-black uppercase tracking-wide text-slate-500">Observações</p>
          <ul className="list-disc space-y-1 pl-5">
            {result.observacoes.map((o, i) => <li key={i} className="text-xs text-slate-600">{o}</li>)}
          </ul>
        </div>
      )}

      <div className="border-t border-slate-200 px-5 py-3">
        <p className="text-center text-[11px] italic text-slate-500">Resultados laboratoriais devem ser interpretados conforme o quadro clínico.</p>
      </div>
    </div>
  );
}
