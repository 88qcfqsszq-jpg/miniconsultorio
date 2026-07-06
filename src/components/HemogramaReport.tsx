// ============================================================================
// HemogramaReport — laudo visual de HEMOGRAMA COMPLETO (Fase Hemograma)
// ----------------------------------------------------------------------------
// Renderiza um laudo profissional e limpo em português, gerado dinamicamente
// conforme o caso clínico ativo. Laboratório FICTÍCIO; não copia laboratórios
// reais. Componente de apresentação — sem IA, sem rede, sem efeitos colaterais.
// ============================================================================

import { generateHemograma, type HemogramaAnalito, type HemogramaResultado } from "@/src/utils/generateHemograma";

const NIVEL_STYLE: Record<HemogramaResultado["nivel"], { label: string; cls: string }> = {
  normal: { label: "Sem alterações relevantes", cls: "bg-emerald-100 text-emerald-700" },
  leve: { label: "Alteração leve", cls: "bg-amber-100 text-amber-700" },
  moderado: { label: "Alteração moderada", cls: "bg-orange-100 text-orange-700" },
  grave: { label: "Alteração importante", cls: "bg-red-100 text-red-700" },
};

function Linha({ a }: { a: HemogramaAnalito }) {
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

function Secao({ titulo, itens }: { titulo: string; itens: HemogramaAnalito[] }) {
  return (
    <div className="mt-5">
      <h4 className="mb-1 border-b-2 border-slate-800 pb-1 text-xs font-black uppercase tracking-wide text-slate-800">{titulo}</h4>
      <table className="w-full">
        <thead>
          <tr className="text-left text-[10px] font-bold uppercase text-slate-400">
            <th className="py-1 pr-2">Exame</th>
            <th className="py-1 pr-2">Resultado</th>
            <th className="py-1 pr-2">Unidade</th>
            <th className="py-1">Valor de referência</th>
          </tr>
        </thead>
        <tbody>{itens.map((a) => <Linha key={a.nome} a={a} />)}</tbody>
      </table>
    </div>
  );
}

export default function HemogramaReport({ caso }: { caso: any }) {
  const hemo = generateHemograma({ caso });
  const nome = caso?.paciente?.nome ?? caso?.dados_visiveis_ao_estudante?.nome ?? "Paciente";
  const idade = hemo.paciente.idade != null ? `${hemo.paciente.idade} anos` : "—";
  const sexo = hemo.paciente.sexo === "F" ? "Feminino" : "Masculino";
  const nivel = NIVEL_STYLE[hemo.nivel];
  const dataColeta = new Date().toLocaleDateString("pt-BR");
  const protocolo = `HM-${String(caso?.id ?? "000").toString().padStart(4, "0")}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Cabeçalho do laboratório (fictício) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-lg text-white">🩸</div>
          <div>
            <p className="text-base font-black text-slate-900">Laboratório Escola Mini Consultório</p>
            <p className="text-[11px] text-slate-400">Análises Clínicas · uso educacional/simulado</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${nivel.cls}`}>{nivel.label}</span>
      </div>

      {/* Dados do paciente e da coleta */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 px-5 py-4 text-xs sm:grid-cols-4">
        <div><span className="text-slate-400">Paciente</span><p className="font-semibold text-slate-700">{nome}</p></div>
        <div><span className="text-slate-400">Idade</span><p className="font-semibold text-slate-700">{idade}</p></div>
        <div><span className="text-slate-400">Sexo</span><p className="font-semibold text-slate-700">{sexo}</p></div>
        <div><span className="text-slate-400">Protocolo</span><p className="font-semibold text-slate-700">{protocolo}</p></div>
        <div><span className="text-slate-400">Coleta</span><p className="font-semibold text-slate-700">{dataColeta}</p></div>
        <div><span className="text-slate-400">Material</span><p className="font-semibold text-slate-700">Sangue total (EDTA)</p></div>
        <div className="col-span-2"><span className="text-slate-400">Método</span><p className="font-semibold text-slate-700">Automação hematológica + morfologia</p></div>
      </div>

      {/* Título do exame */}
      <div className="px-5">
        <h3 className="rounded-lg bg-slate-800 py-2 text-center text-sm font-black uppercase tracking-widest text-white">Hemograma Completo</h3>
      </div>

      {/* Séries */}
      <div className="px-5 pb-2">
        <Secao titulo="Série Vermelha (Eritrograma)" itens={hemo.serieVermelha} />
        <Secao titulo="Série Branca (Leucograma)" itens={hemo.serieBranca} />
        <Secao titulo="Plaquetas (Plaquetograma)" itens={hemo.plaquetas} />
      </div>

      {/* Legenda das setas */}
      <div className="px-5 pb-2 text-[11px] text-slate-400">
        <span className="text-red-600 font-bold">↑</span> acima da referência ·{" "}
        <span className="text-blue-600 font-bold">↓</span> abaixo da referência
      </div>

      {/* Observações automáticas */}
      {hemo.observacoes.length > 0 && (
        <div className="mx-5 mb-4 rounded-xl bg-slate-50 p-4">
          <p className="mb-1 text-xs font-black uppercase tracking-wide text-slate-500">Observações</p>
          <ul className="list-disc space-y-1 pl-5">
            {hemo.observacoes.map((o, i) => <li key={i} className="text-xs text-slate-600">{o}</li>)}
          </ul>
        </div>
      )}

      {/* Nota final */}
      <div className="border-t border-slate-200 px-5 py-3">
        <p className="text-center text-[11px] italic text-slate-500">
          Resultados laboratoriais devem ser interpretados conforme o quadro clínico.
        </p>
      </div>
    </div>
  );
}
