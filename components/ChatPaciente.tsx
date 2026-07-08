"use client";

import { useState, useRef, useEffect } from "react";
import { MensagemChat, Caso } from "@/lib/types";

interface ChatPacienteProps {
  nomePaciente: string;
  casoId: string;
  caso?: Caso; // Opcional: caso completo para contexto pediátrico
  onMensagensChange?: (mensagens: MensagemChat[]) => void;
}

type SpeechRecognitionType = any;

export default function ChatPaciente({
  nomePaciente,
  casoId,
  caso,
  onMensagensChange,
}: ChatPacienteProps) {
  // Chat começa vazio - médico deve iniciar a conversa
  // Não há mensagem inicial do paciente para evitar spoiler de sintomas
  const [mensagens, setMensagens] = useState<MensagemChat[]>([]);

  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [ouvindo, setOuvindo] = useState(false);
  const [erroVoz, setErroVoz] = useState("");
  const [suportaVoz, setSuportaVoz] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  // Refs sempre atualizados p/ evitar closures obsoletas (ex.: reconhecimento de voz)
  const mensagensRef = useRef<MensagemChat[]>([]);
  const carregandoRef = useRef(false);
  const enviarTextoRef = useRef<(texto: string) => void>(() => {});
  useEffect(() => {
    mensagensRef.current = mensagens;
  }, [mensagens]);
  useEffect(() => {
    carregandoRef.current = carregando;
  }, [carregando]);

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

      const finalLimpo = transcriptFinal.trim();
      const parcialLimpo = transcriptParcial.trim();
      console.log("Resultado de voz:", finalLimpo || parcialLimpo);

      if (finalLimpo) {
        // resultado final → envia direto e limpa o campo (sem deixar texto sobrando)
        enviarTextoRef.current(finalLimpo);
      } else if (parcialLimpo) {
        // preview ao vivo enquanto ainda está reconhecendo
        setInput(parcialLimpo);
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

  // Núcleo de envio: aceita o texto (digitado ou transcrito por voz).
  // Limpa o campo ANTES do await para evitar reenvio acidental da mesma mensagem.
  const enviarTexto = async (textoBruto: string) => {
    const mensagemEstudante = (textoBruto || "").trim();
    if (!mensagemEstudante || carregandoRef.current) return;

    // limpar imediatamente o campo (texto já salvo em mensagemEstudante)
    setInput("");

    // Adicionar mensagem do estudante
    const novaMensagemEstudante: MensagemChat = {
      id: Date.now().toString(),
      tipo: "estudante",
      conteudo: mensagemEstudante,
      timestamp: new Date(),
    };

    // Atualizar estado localmente (usa ref p/ histórico sempre atualizado)
    const mensagensAtualizadas = [...mensagensRef.current, novaMensagemEstudante];
    setMensagens(mensagensAtualizadas);
    carregandoRef.current = true;
    setCarregando(true);

    try {
      // Preparar histórico para o backend (inclui a mensagem do estudante)
      const historico = mensagensAtualizadas.map((msg) => ({
        tipo: msg.tipo as "estudante" | "paciente",
        conteudo: msg.conteudo,
      }));

      // Chamar API
      const response = await fetch("/api/chat-paciente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          casoId,
          // Envia o caso ativo (o componente já o recebe como prop). Necessário
          // para casos GERADOS, cujo id não existe em casosV2 no servidor.
          caso,
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
      carregandoRef.current = false;
      setCarregando(false);
    }
  };

  // Mantém o ref apontando para a versão mais recente (usado pela voz)
  enviarTextoRef.current = enviarTexto;

  // Handler do formulário (envio por digitação)
  const enviarMensagem = (e: React.FormEvent) => {
    e.preventDefault();
    enviarTexto(input);
  };

  const sexoLabel =
    caso?.paciente?.sexo === "M" ? "masculino" : caso?.paciente?.sexo === "F" ? "feminino" : "";
  const subtituloPaciente = caso?.paciente
    ? `Paciente Virtual · ${caso.paciente.idade} anos · Sexo ${sexoLabel}`.trim()
    : "Paciente Virtual";

  return (
    <section className="medix-chat-card">
      {/* Barra superior do paciente */}
      <header className="medix-chat-header">
        <div className="medix-patient-avatar-placeholder">{nomePaciente.charAt(0)}</div>
        <div className="medix-patient-info">
          <h2>{nomePaciente}</h2>
          <p>{subtituloPaciente}</p>
        </div>
        <div className="medix-online-status">
          <span></span>
          Online
        </div>
      </header>

      {/* Mensagens */}
      <div ref={messagesContainerRef} className="medix-chat-messages">
        {mensagens.map((msg) => (
          <div
            key={msg.id}
            className={`medix-message ${msg.tipo === "estudante" ? "student" : "patient"}`}
          >
            <p>{msg.conteudo}</p>
            <span className="medix-message-time">
              {msg.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
        {carregando && (
          <div className="medix-message patient medix-typing">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={enviarMensagem}>
        {ouvindo && (
          <div className="mx-[22px] mt-3 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Ouvindo... fale agora
          </div>
        )}
        {erroVoz && (
          <div className="mx-[22px] mt-3 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            {erroVoz}
          </div>
        )}
        <div className="medix-chat-input-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta..."
            disabled={carregando}
          />
          {suportaVoz && (
            <button
              type="button"
              onClick={iniciarTranscricao}
              disabled={carregando}
              title={ouvindo ? "Parar" : "Falar"}
              className={`medix-mic-button ${ouvindo ? "medix-mic-active" : ""}`}
            >
              🎙️
            </button>
          )}
          <button
            type="submit"
            disabled={carregando || !input.trim()}
            className="medix-send-button"
          >
            Enviar
          </button>
        </div>
      </form>
    </section>
  );
}
