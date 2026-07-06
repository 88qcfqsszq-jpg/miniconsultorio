"use client";

// ============================================================================
// AuscultaSoundMeta — metadados discretos do som (FASE 5).
// Informação de TREINAMENTO para o aluno (não é mostrada ao paciente):
// Tipo · Local · Arquivo · Origem · Correspondência. Reutilizado pelos painéis
// pulmonar e cardíaco. Não decide arquivo — apenas exibe o que recebeu.
// ============================================================================

export default function AuscultaSoundMeta({
  tipo,
  local,
  arquivo,
  origem,
  correspondencia,
  avisoProxy,
}: {
  tipo: string;
  local: string;
  arquivo: string | null;
  origem: string;
  correspondencia: string;
  avisoProxy?: string;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-white/70 px-2.5 py-2 text-[11px] leading-relaxed text-slate-600">
      <p className="font-bold text-slate-700 uppercase tracking-wide text-[10px] mb-1">
        Referência (treino)
      </p>
      <dl className="grid grid-cols-[86px_1fr] gap-x-2 gap-y-0.5">
        <dt className="text-slate-400">Tipo</dt>
        <dd className="font-semibold text-slate-700">{tipo}</dd>
        <dt className="text-slate-400">Local</dt>
        <dd>{local}</dd>
        <dt className="text-slate-400">Arquivo</dt>
        <dd className="font-mono">{arquivo ?? "—"}</dd>
        <dt className="text-slate-400">Origem</dt>
        <dd>{origem}</dd>
        <dt className="text-slate-400">Correspondência</dt>
        <dd className={arquivo ? "text-emerald-700 font-semibold" : "text-amber-700 font-semibold"}>
          {correspondencia}
        </dd>
      </dl>
      {avisoProxy && <p className="mt-1.5 text-amber-700">{avisoProxy}</p>}
    </div>
  );
}
