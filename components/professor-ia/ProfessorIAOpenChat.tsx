// ============================================================================
// Professor IA — CHAT ABERTO (Fase 24)
// ----------------------------------------------------------------------------
// Conversa LIVRE com o Professor IA sobre o atendimento (NÃO controlado por
// LessonFlow, sem etapas, sem botão "Próxima etapa"). Alimentado por atendimento
// + feedback + StudentTrace + Gold Standard + texto do PDF, via
// POST /api/professor-ia/chat. Estado só em memória. Nunca altera nota/feedback.
// ============================================================================

"use client";

import { useRef, useState } from "react";

interface OpenChatPayload {
  caso?: any;
  feedback?: any;
  atendimento?: any;
  pdfText?: string;
}

type Role = "student" | "professor";
interface Msg { id: string; role: Role; content: string; }

let _uid = 0;
const uid = () => `oc-${Date.now()}-${++_uid}`;

const SUGESTOES = [
  "Onde eu errei?",
  "Minha conduta estava correta?",
  "Explique meu raciocínio.",
  "Como eu faria nota máxima?",
  "Me ensine este caso como um professor.",
];

export default function ProfessorIAOpenChat(payload: OpenChatPayload) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = () => requestAnimationFrame(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }));

  async function enviar(texto: string) {
    const pergunta = texto.trim();
    if (!pergunta || isLoading) return;
    setDraft("");
    const nova: Msg = { id: uid(), role: "student", content: pergunta };
    const historico = [...messages, nova];
    setMessages(historico);
    setIsLoading(true);
    scrollToEnd();
    try {
      const resp = await fetch("/api/professor-ia/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caso: payload.caso,
          feedback: payload.feedback,
          atendimento: payload.atendimento,
          pdfText: payload.pdfText,
          messages: historico.map((m) => ({ role: m.role === "student" ? "aluno" : "professor", content: m.content })),
        }),
      });
      const data = await resp.json();
      setMessages((prev) => [...prev, { id: uid(), role: "professor", content: data?.message ?? "Não consegui responder agora." }]);
    } catch {
      setMessages((prev) => [...prev, { id: uid(), role: "professor", content: "Não foi possível falar com o Professor IA agora. Revise seu feedback e a resposta modelo do caso." }]);
    } finally {
      setIsLoading(false);
      scrollToEnd();
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Cabeçalho fixo — única informação técnica exibida */}
      <div className="text-center">
        <h3 className="text-2xl font-black text-slate-900">💬 Professor IA</h3>
        <p className="mt-1 text-sm text-slate-500">Converse livremente sobre o seu atendimento.</p>
      </div>

      {/* Estado inicial: exemplos de perguntas (some após a primeira mensagem) */}
      {messages.length === 0 && (
        <div className="mt-8">
          <p className="text-center text-sm text-slate-400">Pergunte, por exemplo:</p>
          <div className="mx-auto mt-4 flex max-w-md flex-col gap-2">
            {SUGESTOES.map((s) => (
              <button
                key={s}
                onClick={() => enviar(s)}
                disabled={isLoading}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Histórico livre */}
      {messages.length > 0 && (
        <div ref={listRef} className="mt-6 max-h-[28rem] space-y-4 overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className={m.role === "student" ? "flex justify-end" : "flex justify-start"}>
              <div className={m.role === "student" ? "max-w-[85%] rounded-3xl bg-indigo-600 px-4 py-2.5 text-[15px] leading-relaxed text-white" : "max-w-[90%] whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800"}>
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && <p className="text-sm italic text-slate-400">Professor está pensando…</p>}
        </div>
      )}

      {/* Campo de texto */}
      <div className="mt-8 flex items-center gap-2 rounded-full border border-slate-300 bg-white px-2 py-1.5 shadow-sm focus-within:border-indigo-400">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") enviar(draft); }}
          placeholder="Pergunte ao Professor IA..."
          disabled={isLoading}
          className="flex-1 bg-transparent px-3 py-2 text-[15px] outline-none"
        />
        <button
          onClick={() => enviar(draft)}
          disabled={isLoading || !draft.trim()}
          className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-indigo-700 disabled:opacity-40"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
