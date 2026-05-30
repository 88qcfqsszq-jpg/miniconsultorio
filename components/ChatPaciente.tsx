"use client";

import { useState, useRef, useEffect } from "react";
import { MensagemChat } from "@/lib/types";

interface ChatPacienteProps {
  nomePaciente: string;
  casoId: string;
  onMensagensChange?: (mensagens: MensagemChat[]) => void;
}

type SpeechRecognitionType = any;

export default function ChatPaciente({
  nomePaciente,
  casoId,
  onMensagensChange,
}: ChatPacienteProps) {
  const [mensagens, setMensagens] = useState<MensagemChat[]>([
    {
      id: "1",
      tipo: "paciente",
      conteudo: `Oi doutor/doutora, tudo bem? Meu nome é ${nomePaciente}, tô aqui porque não tô me sentindo bem.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [ouvindo, setOuvindo] = useState(false);
  const [erroVoz, setErroVoz] = useState("");
  const [suportaVoz, setSuportaVoz] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  // Validar suporte a Web Speech API e registrar cleanup
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSuportaVoz(false);
    }

    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  // Notificar mudanças de mensagens
  useEffect(() => {
    onMensagensChange?.(mensagens);
  }, [mensagens, onMensagensChange]);

  // Auto-scroll para a última mensagem (apenas dentro do container do chat)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [mensagens, carregando]);

  const iniciarTranscricao = () => {
    if (ouvindo) {
      recognitionRef.current?.stop();
      setOuvindo(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErroVoz(
        "Seu navegador não oferece suporte à transcrição por voz. Tente usar o Google Chrome ou digite sua pergunta."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("SpeechRecognition iniciou");
      setOuvindo(true);
      setErroVoz("");
    };

    recognition.onresult = (event: any) => {
      let transcriptFinal = "";
      let transcriptParcial = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          transcriptFinal += transcript;
        } else {
          transcriptParcial += transcript;
        }
      }

      const textoReconhecido = (transcriptFinal || transcriptParcial).trim();
      console.log("Resultado de voz:", textoReconhecido);

      if (textoReconhecido) {
        setInput(textoReconhecido);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Erro SpeechRecognition:", event.error);
      const mensagens: Record<string, string> = {
        "not-allowed":
          "Permissão do microfone negada. Libere o microfone nas configurações do navegador.",
        "no-speech":
          "Nenhuma fala foi detectada. Tente novamente falando mais próximo ao microfone.",
        "audio-capture": "Não foi possível acessar o microfone.",
        "network":
          "Erro de rede no reconhecimento de voz. Tente novamente ou use digitação.",
      };
      setErroVoz(
        mensagens[event.error] ??
          "Não foi possível transcrever a fala. Tente novamente ou use digitação."
      );
      setOuvindo(false);
    };

    recognition.onend = () => {
      console.log("SpeechRecognition terminou");
      setOuvindo(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error) {
      console.error("Falha ao iniciar recognition:", error);
      setErroVoz("Erro ao iniciar microfone. Recarregue a página.");
    }
  };

  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const mensagemEstudante = input.trim();

    // Adicionar mensagem do estudante
    const novaMensagemEstudante: MensagemChat = {
      id: Date.now().toString(),
      tipo: "estudante",
      conteudo: mensagemEstudante,
      timestamp: new Date(),
    };

    setMensagens((prev) => [...prev, novaMensagemEstudante]);
    setInput("");
    setCarregando(true);

    try {
      // Preparar histórico para o backend
      const historico = mensagens.map((msg) => ({
        tipo: msg.tipo as "estudante" | "paciente",
        conteudo: msg.conteudo,
      }));

      // Chamar API
      const response = await fetch("/api/chat-paciente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          casoId,
          mensagem: mensagemEstudante,
          historico,
        }),
      });

      const data = await response.json();
      const resposta = data.resposta || "Desculpe, não consegui processar sua pergunta.";

      const novaMensagemPaciente: MensagemChat = {
        id: (Date.now() + 1).toString(),
        tipo: "paciente",
        conteudo: resposta,
        timestamp: new Date(),
      };

      setMensagens((prev) => [...prev, novaMensagemPaciente]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const mensagemErro: MensagemChat = {
        id: (Date.now() + 1).toString(),
        tipo: "paciente",
        conteudo: "Desculpe, estou tendo dificuldades para responder no momento. Tente novamente.",
        timestamp: new Date(),
      };
      setMensagens((prev) => [...prev, mensagemErro]);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold shrink-0">
          {nomePaciente.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-sm leading-tight">{nomePaciente}</p>
          <p className="text-blue-200 text-xs">Paciente Virtual</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-xs text-blue-200">Online</span>
        </div>
      </div>

      {/* Mensagens */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {mensagens.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.tipo === "estudante" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] sm:max-w-[72%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.tipo === "estudante"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-white text-slate-800 rounded-bl-sm shadow-sm border border-slate-200"
              }`}
            >
              <p>{msg.conteudo}</p>
              <span className={`text-xs mt-1 block ${msg.tipo === "estudante" ? "text-blue-200" : "text-slate-400"}`}>
                {msg.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}
        {carregando && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={enviarMensagem} className="border-t border-slate-200 p-3 bg-white">
        {ouvindo && (
          <div className="mb-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Ouvindo... fale agora
          </div>
        )}
        {erroVoz && (
          <div className="mb-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            {erroVoz}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta..."
            disabled={carregando}
            className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 text-slate-900 placeholder-slate-400 text-sm"
          />
          {suportaVoz && (
            <button
              type="button"
              onClick={iniciarTranscricao}
              disabled={carregando}
              title={ouvindo ? "Parar" : "Falar"}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                ouvindo
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              } disabled:opacity-50`}
            >
              🎙️
            </button>
          )}
          <button
            type="submit"
            disabled={carregando || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm shrink-0 active:scale-[0.97]"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
