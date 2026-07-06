// ============================================================================
// Professor IA — PREVIEW (Fases 17–20)
// ----------------------------------------------------------------------------
// Componente do Feedback OSCE. Renderiza um ProfessorLesson (roteiro único do
// pipeline). Fase 20: botão EXPERIMENTAL que chama /api/professor-ia para gerar
// a fala do PRIMEIRO LessonStep (ou fallback estático se não houver API key).
// Não é chat: uma única fala. try/catch — nunca quebra o Feedback.
// ============================================================================

"use client";

import { useState } from "react";
import type { ProfessorLesson } from "@/lib/professor-ia/professor-lesson";

const MODO_LABEL: Record<string, string> = {
  socratico: "Socrático",
  demonstrativo: "Demonstrativo",
  diretivo: "Diretivo",
  avaliador: "Avaliador",
  revisao_rapida: "Revisão rápida",
  reforco_de_erro_critico: "Reforço de erro crítico",
};

function Chip({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "blue" | "amber" | "red" | "green" }) {
  const tones: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-700",
    green: "bg-emerald-100 text-emerald-700",
  };
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${tones[tone]}`}>{children}</span>;
}

function BaseLista({ titulo, itens, vazio, tone }: { titulo: string; itens: string[]; vazio: string; tone: "green" | "amber" | "red" | "slate" }) {
  const cor: Record<string, string> = { green: "text-emerald-700", amber: "text-amber-700", red: "text-red-700", slate: "text-slate-600" };
  return (
    <div>
      <p className={`mb-1 text-xs font-bold ${cor[tone]}`}>{titulo}</p>
      {itens.length === 0 ? (
        <p className="text-xs text-slate-400">{vazio}</p>
      ) : (
        <ul className="space-y-0.5">
          {itens.map((it, i) => (
            <li key={i} className="text-xs text-slate-600">{it}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RecursoLista({ titulo, itens }: { titulo: string; itens: string[] }) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold text-slate-500">{titulo}</p>
      {itens.length === 0 ? (
        <p className="text-xs text-slate-300">—</p>
      ) : (
        <ul className="space-y-0.5">
          {itens.map((it, i) => (
            <li key={i} className="text-xs text-slate-600">{it}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ProfessorIAPreview({ lesson }: { lesson: ProfessorLesson }) {
  if (lesson.status !== "ok") {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <div className="text-3xl">👨‍🏫</div>
        <p className="mt-2 text-sm font-semibold text-slate-600">{lesson.motivo}</p>
        <p className="mt-1 text-xs text-slate-400">{lesson.header.aviso}</p>
      </div>
    );
  }

  const d = lesson.diagnostico;
  const porDominio = (dom: ProfessorLesson["recursos"][number]["dominio"]) => lesson.recursos.filter((r) => r.dominio === dom).map((r) => r.titulo);
  const centroClinico = lesson.recursos.filter((r) => r.dominio === "centro_clinico");

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h3 className="flex items-center gap-2 text-xl font-black text-slate-900">👨‍🏫 {lesson.header.titulo}</h3>
        <p className="text-sm text-slate-500">{lesson.header.subtitulo}</p>
      </div>

      {/* Diagnóstico da sessão */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-500">Diagnóstico da sessão</h4>
        <div className="flex flex-wrap gap-2">
          <Chip tone="blue">Caso: {d.caso}</Chip>
          {typeof d.nota === "number" && <Chip tone="slate">Nota: {d.nota}/20</Chip>}
          <Chip tone="amber">Prioridade: {d.prioridadePrincipal}</Chip>
          <Chip tone="slate">Modo: {MODO_LABEL[d.modoPedagogico] ?? d.modoPedagogico}</Chip>
          <Chip tone="green">Persona: {d.persona}</Chip>
          <Chip tone="slate">~{d.duracaoEstimadaMin} min</Chip>
          {d.modoSessao && <Chip tone="slate">Sessão: {d.modoSessao}</Chip>}
        </div>
        {d.erroCritico && (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">⚠️ Erro crítico: {d.erroCritico}</p>
        )}
      </div>

      {/* Plano da aula */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-500">Plano da aula</h4>
        <ol className="space-y-2">
          {lesson.actions.map((p) => (
            <li key={p.ordem} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">{p.ordem}</span>
              <div>
                <span className="text-sm font-bold text-slate-800">{p.rotulo}</span>
                <p className="text-xs text-slate-500">{p.descricao}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Recursos recomendados */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h4 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-500">Recursos recomendados</h4>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <RecursoLista titulo="🔊 Sons" itens={porDominio("som")} />
          <RecursoLista titulo="🖼️ Imagens" itens={porDominio("imagem")} />
          <RecursoLista titulo="🧪 Exames" itens={porDominio("exame")} />
          <RecursoLista titulo="🔀 Fluxos" itens={porDominio("fluxo")} />
        </div>
        {centroClinico.length > 0 && (
          <div className="mt-3">
            <p className="mb-1 text-xs font-bold text-slate-500">Centro Clínico</p>
            <div className="flex flex-wrap gap-2">
              {centroClinico.map((r, i) =>
                r.href ? (
                  <a key={i} href={r.href} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100">
                    {r.titulo} ↗
                  </a>
                ) : (
                  <span key={i} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{r.titulo}</span>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Base do Professor IA (Fase 22) — auditoria do porquê da fala */}
      {lesson.studentBase && (
        <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <summary className="cursor-pointer text-sm font-black text-slate-600">
            🔎 Base do Professor IA {lesson.studentBase.temEvidencia ? "" : "(sem evidência real — modo conservador)"}
          </summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <BaseLista titulo="✅ Ações comprovadas (elogios permitidos)" itens={lesson.studentBase.confirmedStrengths} vazio="Nenhuma ação comprovada." tone="green" />
            <BaseLista titulo="⚠️ Omissões importantes" itens={lesson.studentBase.missingRequiredItems} vazio="—" tone="amber" />
            <BaseLista titulo="🚫 Elogios proibidos (sem evidência)" itens={lesson.studentBase.forbiddenPraise} vazio="—" tone="red" />
            <BaseLista titulo="Confiança do rastro" itens={[String(lesson.studentBase.confidence)]} vazio="—" tone="slate" />
          </div>
        </details>
      )}

      {/* O que o professor diria primeiro */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <h4 className="mb-2 text-sm font-black uppercase tracking-wide text-blue-600">O que o professor diria primeiro</h4>
        <p className="text-sm italic text-slate-700">“{lesson.openingLine.texto}”</p>
      </div>

      {/* Fala generativa experimental (Fase 20) — 1 etapa, sem chat */}
      <FalaGenerativaExperimental lesson={lesson} />

      {/* Fase 24: o Chat Controlado (LessonFlow) foi substituído pelo Chat Aberto,
          renderizado no FeedbackOSCE (que possui os dados do atendimento/PDF). */}

      {/* Aviso */}
      <p className="text-center text-xs font-medium text-slate-400">{lesson.header.aviso}</p>
    </div>
  );
}

function FalaGenerativaExperimental({ lesson }: { lesson: ProfessorLesson }) {
  const [carregando, setCarregando] = useState(false);
  const [fala, setFala] = useState<string | null>(null);
  const [fonte, setFonte] = useState<"model" | "fallback" | null>(null);
  const [erro, setErro] = useState(false);

  const firstStepId = lesson.lessonFlow?.firstStepId;

  const gerar = async () => {
    setCarregando(true);
    setErro(false);
    try {
      const resp = await fetch("/api/professor-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson, currentStepId: firstStepId }),
      });
      const data = await resp.json();
      setFala(data?.professorMessage ?? null);
      setFonte(data?.source ?? null);
      if (!data?.professorMessage) setErro(true);
    } catch {
      // Fallback duro: usa o texto estático do primeiro step (sem quebrar nada).
      const step = lesson.lessonFlow?.steps?.[0];
      setFala(step?.staticPreviewText ?? lesson.openingLine.texto);
      setFonte("fallback");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-black uppercase tracking-wide text-amber-700">Fala generativa (experimental)</h4>
        <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-800">modo experimental</span>
      </div>
      <button
        onClick={gerar}
        disabled={carregando || !firstStepId}
        className="mt-3 rounded-xl bg-amber-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-amber-700 disabled:opacity-50"
      >
        {carregando ? "Gerando…" : "Gerar fala do Professor para esta etapa"}
      </button>
      {fala && (
        <div className="mt-4 rounded-xl bg-white p-4">
          <p className="text-sm text-slate-700">{fala}</p>
          <p className="mt-2 text-[11px] font-medium text-slate-400">
            {fonte === "model" ? "Gerado por modelo (experimental)." : "Fallback estático (sem API key ou indisponível)."}
          </p>
        </div>
      )}
      {erro && !fala && <p className="mt-2 text-xs text-red-600">Não foi possível gerar a fala agora.</p>}
    </div>
  );
}
