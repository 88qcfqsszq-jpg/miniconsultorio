// ============================================================================
// Professor IA — CHAT CONTROLADO (Fase 23)
// ----------------------------------------------------------------------------
// Primeira versão de chat, CONTROLADO pelo LessonFlow. Usa o ProfessorLesson e o
// LessonFlow já existentes + POST /api/professor-ia (1 step por vez). NÃO é chat
// livre: o aluno segue passo a passo; o modelo não escolhe etapa. Sem memória
// persistente, sem banco, sem login, sem streaming/voz. Estado apenas local (RAM).
// Nunca altera nota/feedback/HealthBench/ProfessorLesson.
// ============================================================================

"use client";

import { useMemo, useRef, useState } from "react";
import type { ProfessorLesson } from "@/lib/professor-ia/professor-lesson";
import type { LessonStep } from "@/lib/professor-ia/lesson-step-engine";

type ChatRole = "professor" | "student" | "system";
interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  stepId?: string;
  createdAt: number;
}

const TIPO_LABEL: Record<string, string> = {
  opening: "Abertura", acknowledge_strength: "Reconhecer acerto", calibrate_goal: "Calibrar objetivo",
  reinforce_confidence: "Reforçar confiança", identify_error: "Apontar lacuna", correct_critical_error: "Corrigir erro crítico",
  ask_question: "Pergunta socrática", wait_student_answer: "Esperar resposta", explain_concept: "Explicar conceito",
  show_resource: "Mostrar recurso", show_sound: "Mostrar som", show_image: "Mostrar imagem", show_exam: "Mostrar exame",
  compare_model_answer: "Comparar com gabarito", mini_quiz: "Mini-quiz", summarize: "Revisão final",
  assign_next_step: "Próximo passo", closing: "Encerramento",
};

let _uid = 0;
const uid = () => `msg-${Date.now()}-${++_uid}`;

export default function ProfessorIAChat({ lesson }: { lesson: ProfessorLesson }) {
  const flow = lesson.lessonFlow;
  const steps: LessonStep[] = flow?.steps ?? [];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStepId, setCurrentStepId] = useState<string | undefined>(flow?.firstStepId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [waitingForStudent, setWaitingForStudent] = useState(false);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const stepById = (id?: string) => steps.find((s) => s.id === id);
  const currentStep = stepById(currentStepId);
  const currentIndex = currentStep ? steps.findIndex((s) => s.id === currentStep.id) : -1;

  const historyForApi = useMemo(
    () => messages.filter((m) => m.role !== "system").map((m) => ({ role: m.role === "student" ? ("aluno" as const) : ("professor" as const), content: m.content })),
    [messages]
  );

  // Estado vazio (Tarefa 8).
  if (lesson.status !== "ok" || !flow || steps.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <div className="text-2xl">💬</div>
        <p className="mt-2 text-sm font-semibold text-slate-600">
          Chat do Professor IA indisponível para este caso porque ainda não existe gabarito estruturado.
        </p>
      </div>
    );
  }

  const push = (role: ChatRole, content: string, stepId?: string) =>
    setMessages((prev) => [...prev, { id: uid(), role, content, stepId, createdAt: Date.now() }]);

  const scrollToEnd = () => requestAnimationFrame(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }));

  // Chamada controlada ao endpoint (1 step). Fallback local = staticPreviewText.
  async function chamarStep(stepId: string, studentMessage?: string) {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/professor-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson, currentStepId: stepId, studentMessage, history: historyForApi }),
      });
      const data = await resp.json();
      const msg = data?.professorMessage || stepById(stepId)?.staticPreviewText || "(sem conteúdo)";
      push("professor", msg, data?.currentStepId ?? stepId);
      setWaitingForStudent(!!data?.shouldWaitForStudent);
    } catch {
      // Fallback local: nunca quebra o feedback.
      const step = stepById(stepId);
      push("professor", step?.staticPreviewText ?? "Vamos revisar seu atendimento com calma.", stepId);
      setWaitingForStudent(!!step?.expectedStudentAction?.requiresInput);
      setError("Falha ao gerar a fala — usando texto local.");
    } finally {
      setIsLoading(false);
      scrollToEnd();
    }
  }

  async function iniciarTutoria() {
    if (!flow?.firstStepId) return;
    setHasStarted(true);
    setFinished(false);
    setCompletedStepIds([]);
    setCurrentStepId(flow.firstStepId);
    await chamarStep(flow.firstStepId);
  }

  async function enviarMensagem() {
    const texto = draft.trim();
    if (!texto || !currentStepId || isLoading) return;
    setDraft("");
    push("student", texto, currentStepId);
    await chamarStep(currentStepId, texto);
  }

  async function proximaEtapa() {
    if (!currentStep) return;
    const nextId = currentStep.nextStepId;
    setCompletedStepIds((prev) => (currentStep.id ? [...new Set([...prev, currentStep.id])] : prev));
    if (!nextId) {
      setFinished(true);
      setWaitingForStudent(false);
      push("system", "Sessão finalizada. Revise o próximo passo sugerido.");
      scrollToEnd();
      return;
    }
    setCurrentStepId(nextId);
    await chamarStep(nextId);
  }

  const podeAvancar = hasStarted && !finished && !isLoading && !!currentStep?.nextStepId;
  const mostrarInput = hasStarted && !finished && waitingForStudent;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="flex items-center gap-2 text-base font-black text-slate-900">💬 Chat do Professor IA</h4>
        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-bold text-indigo-700">controlado por LessonFlow</span>
      </div>

      {/* Controle visual do LessonFlow (Tarefa 5) */}
      {hasStarted && currentStep && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              Etapa {currentIndex + 1} de {steps.length}: {currentStep.title}
            </span>
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">{TIPO_LABEL[currentStep.type] ?? currentStep.type}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">{currentStep.goal}</p>
          <div className="mt-1 flex gap-2 text-[10px] font-semibold">
            {currentStep.expectedStudentAction?.requiresInput && <span className="text-amber-700">⏳ exige resposta</span>}
            {currentStep.isCheckpoint && <span className="text-indigo-700">⏸ checkpoint</span>}
          </div>
          {/* Trilha compacta: concluídas · atual · próximas */}
          <div className="mt-2 flex flex-wrap gap-1">
            {steps.map((s, i) => {
              const estado = s.id === currentStep.id ? "atual" : completedStepIds.includes(s.id) || i < currentIndex ? "ok" : "prox";
              const cls = estado === "atual" ? "bg-indigo-600 text-white" : estado === "ok" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400";
              return <span key={s.id} className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${cls}`} title={s.title}>{i + 1}</span>;
            })}
          </div>
          {/* Recursos do step (Tarefa 6) */}
          {currentStep.resources.length > 0 && (
            <div className="mt-2">
              <p className="text-[10px] font-bold text-slate-500">Recurso sugerido nesta etapa</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {currentStep.resources.map((r, i) =>
                  r.href ? (
                    <a key={i} href={r.href} className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-100">{r.dominio}: {r.titulo} ↗</a>
                  ) : (
                    <span key={i} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{r.dominio}: {r.titulo}</span>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Histórico de mensagens */}
      {messages.length > 0 && (
        <div ref={listRef} className="mt-3 max-h-80 space-y-2 overflow-y-auto rounded-xl bg-slate-50 p-3">
          {messages.map((m) => (
            <div key={m.id} className={m.role === "student" ? "flex justify-end" : m.role === "system" ? "flex justify-center" : "flex justify-start"}>
              <div
                className={
                  m.role === "student"
                    ? "max-w-[80%] rounded-2xl bg-indigo-600 px-3 py-2 text-sm text-white"
                    : m.role === "system"
                      ? "rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                      : "max-w-[85%] rounded-2xl bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
                }
              >
                {m.role === "professor" && <span className="mr-1 text-xs font-bold text-indigo-600">👨‍🏫</span>}
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && <p className="text-xs italic text-slate-400">Professor está pensando…</p>}
        </div>
      )}

      {error && <p className="mt-2 text-xs text-amber-600">{error}</p>}

      {/* Ações */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {!hasStarted && (
          <button onClick={iniciarTutoria} disabled={isLoading} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-indigo-700 disabled:opacity-50">
            {isLoading ? "Iniciando…" : "▶ Iniciar tutoria"}
          </button>
        )}
        {podeAvancar && (
          <button onClick={proximaEtapa} disabled={isLoading} className="rounded-xl border-2 border-indigo-300 bg-white px-4 py-2 text-sm font-bold text-indigo-700 transition-all hover:bg-indigo-50 disabled:opacity-50">
            Próxima etapa →
          </button>
        )}
        {finished && <span className="text-sm font-semibold text-emerald-700">✓ Sessão finalizada</span>}
      </div>

      {/* Input do aluno */}
      {mostrarInput && (
        <div className="mt-3 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") enviarMensagem(); }}
            placeholder="Responda ao professor…"
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
          <button onClick={enviarMensagem} disabled={isLoading || !draft.trim()} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-indigo-700 disabled:opacity-50">
            Enviar
          </button>
        </div>
      )}

      <p className="mt-3 text-center text-[11px] font-medium text-slate-400">
        Chat controlado passo a passo pelo LessonFlow · experimental · não altera sua nota nem o feedback.
      </p>
    </div>
  );
}
