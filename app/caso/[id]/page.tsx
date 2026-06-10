"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ChatPaciente from "@/components/ChatPaciente";
import PainelExameFisico from "@/components/PainelExameFisico";
import FormularioSOAP from "@/components/FormularioSOAP";
import PainelDiagnostico from "@/components/PainelDiagnostico";
import FeedbackOSCE from "@/components/FeedbackOSCE";
import LoadingRelatorio from "@/components/LoadingRelatorio";
import PainelExamesComplementares from "@/components/PainelExamesComplementares";
import ResumoAnamnese from "@/components/ResumoAnamnese";
import SimuladorECG from "@/components/SimuladorECG";
import { casosOSCE } from "@/data/casos-osce";
import { event } from "@/lib/analytics";
import type {
  Caso,
  MensagemChat,
  DiagnosticoFormulario,
  FormularioSOAP as FormularioSOAPType,
  FeedbackOSCE as FeedbackOSCEType,
  ManobraRealizada,
  ExameSolicitado,
} from "@/lib/types";

type AtendimentoPhase = "anamnese" | "feedback";

function CasoPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const casoId = params.id as string;
  const modoOSCE = searchParams.get("modo") === "osce";

  const [caso, setCaso] = useState<Caso | null>(null);
  const [phase, setPhase] = useState<AtendimentoPhase>("anamnese");
  const [tempoInicio, setTempoInicio] = useState<number>(Date.now());
  const [tempoDecorrido, setTempoDecorrido] = useState<number>(0);
  const [sinaisVitaisSolicitados, setSinaisVitaisSolicitados] =
    useState(false);
  const [manobrasSolicitadas, setManobrasSolicitadas] = useState<ManobraRealizada[]>([]);
  const [examesSolicitados, setExamesSolicitados] = useState<ExameSolicitado[]>([]);
  const [feedback, setFeedback] = useState<FeedbackOSCEType | null>(null);
  const [mensagens, setMensagens] = useState<MensagemChat[]>([]);
  const [gerandoFeedback, setGerandoFeedback] = useState(false);
  const [progressoFeedback, setProgressoFeedback] = useState(0);
  const [mensagemLoading, setMensagemLoading] = useState("");
  const [erroFeedback, setErroFeedback] = useState<string | null>(null);
  const apiConcluídaRef = useRef(false);
  const feedbackRecebidoRef = useRef<FeedbackOSCEType | null>(null);

  const getMensagemLoading = (percentual: number): string => {
    if (percentual < 16) return "Iniciando análise do atendimento...";
    if (percentual < 31) return "Organizando histórico da anamnese...";
    if (percentual < 46) return "Analisando sinais vitais e exame físico...";
    if (percentual < 61) return "Avaliando raciocínio diagnóstico...";
    if (percentual < 76) return "Revisando conduta e SOAP...";
    if (percentual < 91) return "Gerando feedback didático personalizado...";
    if (percentual < 100) return "Finalizando relatório OSCE...";
    return "Relatório concluído!";
  };

  const handleNovaManobra = useCallback((manobra: ManobraRealizada) => {
    setManobrasSolicitadas(prev => [...prev, manobra]);
  }, []);

  const handleNovoExame = useCallback((exame: ExameSolicitado) => {
    setExamesSolicitados(prev => [...prev, exame]);
  }, []);

  // Carregar caso
  useEffect(() => {
    // 1. Verificar sessionStorage primeiro (para casos gerados)
    try {
      const casoGerado = sessionStorage.getItem("casoGerado");
      if (casoGerado) {
        const caso = JSON.parse(casoGerado);
        if (caso.id === casoId) {
          setCaso(caso);
          setTempoInicio(Date.now());
          event("iniciou_caso", {
            caso_id: caso.id,
            caso_titulo: caso.titulo,
            modo: "treinamento",
          });
          sessionStorage.removeItem("casoGerado");
          return;
        }
      }
    } catch (e) {
      console.error("Erro ao carregar caso gerado:", e);
    }

    // 2. Se não achou em sessionStorage, procurar em casos estáticos
    const casoEncontrado = casosOSCE.find((c) => c.id === casoId);
    if (casoEncontrado) {
      setCaso(casoEncontrado);
      setTempoInicio(Date.now());
      event("iniciou_caso", {
        caso_id: casoEncontrado.id,
        caso_titulo: casoEncontrado.titulo,
        modo: "prova",
      });
    }
  }, [casoId]);

  // Timer do atendimento
  useEffect(() => {
    if (phase === "anamnese") {
      const interval = setInterval(() => {
        setTempoDecorrido(Math.floor((Date.now() - tempoInicio) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase, tempoInicio]);

  // Atualizar mensagem de loading baseado no progresso
  useEffect(() => {
    setMensagemLoading(getMensagemLoading(progressoFeedback));
  }, [progressoFeedback]);

  const handleFinalizarAtendimento = async () => {
    // Inicializar loading
    setGerandoFeedback(true);
    setProgressoFeedback(0);
    setErroFeedback(null);
    apiConcluídaRef.current = false;
    feedbackRecebidoRef.current = null;

    // Iniciar progresso simulado
    let progresoAtual = 0;
    const intervaloProgresso = setInterval(() => {
      setProgressoFeedback((prev) => {
        if (apiConcluídaRef.current) {
          // Se API respondeu, levar até 100%
          if (prev < 100) {
            const incremento = Math.max(5, 100 - prev) * 0.3;
            return Math.min(prev + incremento, 100);
          }
          return 100;
        } else {
          // Progresso normal até 95%
          if (prev < 95) {
            const incremento = Math.random() * 8 + 2;
            return Math.min(prev + incremento, 95);
          }
          return 95;
        }
      });
    }, 300);

    try {
      const response = await fetch("/api/corrigir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          casoId: caso?.id,
          historico: mensagens,
          exameFisico: manobrasSolicitadas.map((m) => ({
            categoria: m.categoria,
            textDigitado: m.textDigitado,
            resposta: m.resposta,
          })),
          sinaisVitaisSolicitados,
          sinaisVitaisDoEstudante: sinaisVitaisSolicitados ? caso?.sinaisVitaisCorretos : undefined,
          hipoteseDiagnostica: diagnostico.hipotesePrincipal,
          diagnosticosDiferenciais: diagnostico.diagnosticosDisferenciais,
          examesRealizados: examesSolicitados.map(e => ({
            nome: e.nome,
            resultado: e.resultado
          })),
          examesIndicadosNoFormulario: diagnostico.examesIndicados,
          conduta: diagnostico.conduta,
          soap: soap,
          tempoAtendimento: tempoDecorrido,
        }),
      });

      if (response.ok) {
        const feedbackDetalhado = await response.json();
        feedbackRecebidoRef.current = feedbackDetalhado;
        apiConcluídaRef.current = true;

        // Aguardar progresso chegar a 100%
        await new Promise<void>((resolve) => {
          const checkProgresso = setInterval(() => {
            setProgressoFeedback((prev) => {
              if (prev >= 100) {
                clearInterval(checkProgresso);
                resolve();
                return 100;
              }
              return prev;
            });
          }, 50);
        });

        // Pequena pausa para efeito visual
        await new Promise((resolve) => setTimeout(resolve, 400));

        // Disparar eventos de conclusão
        event("finalizou_caso", {
          caso_id: caso?.id,
          caso_titulo: caso?.titulo,
          modo: modoOSCE ? "prova" : "treinamento",
        });

        event("abriu_feedback", {
          caso_id: caso?.id,
          caso_titulo: caso?.titulo,
          nota: feedbackDetalhado?.nota,
        });

        // Mostrar feedback
        setFeedback(feedbackDetalhado);
        setPhase("feedback");
      } else {
        clearInterval(intervaloProgresso);
        setErroFeedback(
          "Não foi possível gerar o relatório agora. Verifique sua conexão ou tente novamente."
        );
        setGerandoFeedback(false);
        setProgressoFeedback(0);
        console.error("Erro ao obter feedback:", response?.status || "unknown error");
      }
    } catch (error) {
      clearInterval(intervaloProgresso);
      setErroFeedback(
        "Não foi possível gerar o relatório agora. Verifique sua conexão ou tente novamente."
      );
      setGerandoFeedback(false);
      setProgressoFeedback(0);
      console.error("Erro ao obter feedback detalhado:", error);
    }
  };

  const [abaAtiva, setAbaAtiva] = useState<"paciente" | "exame" | "exames" | "sinaisVitais" | "ecg">("paciente");
  const [menuAtivo, setMenuAtivo] = useState<"paciente" | "exame" | "exames" | "sinaisVitais" | "ecg">("paciente");
  const [soap, setSOAP] = useState<FormularioSOAPType>({
    subjetivo: "",
    objetivo: "",
    avaliacao: "",
    plano: "",
  });
  const [diagnostico, setDiagnostico] = useState<DiagnosticoFormulario>({
    hipotesePrincipal: "",
    diagnosticosDisferenciais: [],
    examesIndicados: [],
    conduta: "",
  });

  if (!caso) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 text-sm">Carregando caso...</p>
        </div>
      </div>
    );
  }

  if (phase === "feedback" && feedback) {
    return (
      <div className="min-h-screen bg-slate-50 py-6 sm:py-10">
        <div className="w-full px-4">
          <FeedbackOSCE
            feedback={feedback}
            nomePaciente={caso.paciente.nome}
            tempoDecorrido={tempoDecorrido}
            caso={caso}
          />
        </div>
      </div>
    );
  }

  const abas = [
    { id: "paciente" as const, label: "Paciente", icon: "💬" },
    { id: "exame" as const, label: "Exame", icon: "🥼" },
    { id: "exames" as const, label: "Exames", icon: "🧪" },
    { id: "sinaisVitais" as const, label: "Sinais Vitais", icon: "📊" },
    { id: "ecg" as const, label: "ECG", icon: "📈" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Aviso OSCE */}
      {modoOSCE && (
        <div className="bg-blue-700 text-white py-2 px-4 text-center text-xs font-semibold">
          🎯 Modo OSCE — Diagnóstico revelado ao finalizar
        </div>
      )}

      {/* Header compacto */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-bold text-slate-800 text-sm truncate">
              {modoOSCE ? "Simulado OSCE" : caso.titulo}
            </p>
            <p className="text-slate-500 text-xs">
              {caso.paciente.nome} • {caso.paciente.idade} anos • {caso.paciente.sexo === "M" ? "M" : "F"}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-slate-400">Tempo</p>
            <p className="font-bold text-slate-700 tabular-nums text-sm">
              {Math.floor(tempoDecorrido / 60).toString().padStart(2, "0")}:{(tempoDecorrido % 60).toString().padStart(2, "0")}
            </p>
          </div>
        </div>
      </div>

      {/* Abas — visível apenas em mobile */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide max-w-7xl mx-auto">
          {abas.map((aba) => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`flex items-center gap-1.5 px-3 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                abaAtiva === aba.id
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <span>{aba.icon}</span>
              {aba.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Layout Desktop: 3 colunas proporcionais (Sidebar + Centro + Painel Direito) */}
        <div className="hidden lg:grid lg:grid-cols-[280px_minmax(0,1fr)_360px] gap-6">
          {/* Coluna 1: Sidebar Esquerda */}
          <div className="space-y-4">
            {/* Menu Atendimento */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Atendimento</p>
              <div className="space-y-2">
                {[
                  { id: "paciente" as const, label: "Paciente", icon: "💬" },
                  { id: "exame" as const, label: "Exame Físico", icon: "🥼" },
                  { id: "exames" as const, label: "Exames", icon: "🧪" },
                  { id: "sinaisVitais" as const, label: "Sinais Vitais", icon: "📊" },
                  { id: "ecg" as const, label: "ECG", icon: "📈" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setMenuAtivo(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      menuAtivo === item.id
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sinais Vitais */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Sinais Vitais</p>
              <button
                onClick={() => setSinaisVitaisSolicitados(true)}
                disabled={sinaisVitaisSolicitados || phase === "feedback"}
                className={`w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  sinaisVitaisSolicitados
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {sinaisVitaisSolicitados ? "✓ Coletado" : "Solicitar"}
              </button>
              {sinaisVitaisSolicitados && caso.sinaisVitaisCorretos && (
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-emerald-50 p-2 rounded text-center">
                    <p className="text-slate-500">PA</p>
                    <p className="font-bold text-emerald-700">{caso.sinaisVitaisCorretos.pressaoArterial}</p>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded text-center">
                    <p className="text-slate-500">FC</p>
                    <p className="font-bold text-emerald-700">{caso.sinaisVitaisCorretos.frequenciaCardiaca}</p>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded text-center">
                    <p className="text-slate-500">FR</p>
                    <p className="font-bold text-emerald-700">{caso.sinaisVitaisCorretos.frequenciaRespiratoria}</p>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded text-center">
                    <p className="text-slate-500">Temp</p>
                    <p className="font-bold text-emerald-700">{caso.sinaisVitaisCorretos.temperatura}°C</p>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded text-center">
                    <p className="text-slate-500">SpO₂</p>
                    <p className="font-bold text-emerald-700">{caso.sinaisVitaisCorretos.saturacaoOxigenio}%</p>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded text-center">
                    <p className="text-slate-500">Glicose</p>
                    <p className="font-bold text-emerald-700">{caso.sinaisVitaisCorretos.glicemia ? `${caso.sinaisVitaisCorretos.glicemia} mg/dL` : "—"}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Diagnóstico e Conduta */}
            <PainelDiagnostico
              onSubmit={handleFinalizarAtendimento}
              onChange={setDiagnostico}
              desabilitado={phase === "feedback"}
            />
          </div>

          {/* Coluna 2: Conteúdo Central */}
          <div className="min-w-0 space-y-4">
            {/* Chat */}
            <div className="h-[420px] flex flex-col">
              <ChatPaciente nomePaciente={caso.paciente.nome} casoId={casoId} onMensagensChange={setMensagens} />
            </div>

            {/* Conteúdo Dinâmico baseado no Menu */}
            {menuAtivo === "paciente" && <ResumoAnamnese mensagens={mensagens} />}

            {menuAtivo === "exame" && (
              <PainelExameFisico
                caso={caso}
                manobrasSolicitadas={manobrasSolicitadas}
                onNovaManobra={handleNovaManobra}
                modoOSCE={modoOSCE}
              />
            )}

            {menuAtivo === "exames" && (
              <PainelExamesComplementares
                casoId={casoId}
                examesSolicitados={examesSolicitados}
                onNovoExame={handleNovoExame}
                desabilitado={phase === "feedback"}
              />
            )}

            {menuAtivo === "sinaisVitais" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  <h3 className="font-bold text-slate-800">Sinais Vitais</h3>
                </div>
                <button
                  onClick={() => setSinaisVitaisSolicitados(true)}
                  disabled={sinaisVitaisSolicitados || phase === "feedback"}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    sinaisVitaisSolicitados
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-blue-600 hover:bg-blue-700 text-white border border-blue-600"
                  }`}
                >
                  {sinaisVitaisSolicitados ? "✓ Coletado" : "Solicitar Sinais Vitais"}
                </button>
                {sinaisVitaisSolicitados && caso.sinaisVitaisCorretos && (
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="bg-emerald-50 p-3 rounded text-center">
                      <p className="text-slate-600 font-semibold">PA</p>
                      <p className="font-bold text-emerald-700 mt-1">{caso.sinaisVitaisCorretos.pressaoArterial}</p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded text-center">
                      <p className="text-slate-600 font-semibold">FC</p>
                      <p className="font-bold text-emerald-700 mt-1">{caso.sinaisVitaisCorretos.frequenciaCardiaca}</p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded text-center">
                      <p className="text-slate-600 font-semibold">FR</p>
                      <p className="font-bold text-emerald-700 mt-1">{caso.sinaisVitaisCorretos.frequenciaRespiratoria}</p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded text-center">
                      <p className="text-slate-600 font-semibold">Temp</p>
                      <p className="font-bold text-emerald-700 mt-1">{caso.sinaisVitaisCorretos.temperatura}°C</p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded text-center">
                      <p className="text-slate-600 font-semibold">SpO₂</p>
                      <p className="font-bold text-emerald-700 mt-1">{caso.sinaisVitaisCorretos.saturacaoOxigenio}%</p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded text-center">
                      <p className="text-slate-600 font-semibold">Glicose</p>
                      <p className="font-bold text-emerald-700 mt-1">{caso.sinaisVitaisCorretos.glicemia ? `${caso.sinaisVitaisCorretos.glicemia} mg/dL` : "—"}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {menuAtivo === "ecg" && <SimuladorECG padrao={caso?.ecg?.padrao} onClose={() => setMenuAtivo("paciente")} />}
          </div>

          {/* Coluna 3: Painel Direito Fixo (Avaliação Clínica) */}
          <div className="min-w-0">
            <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              <FormularioSOAP onSubmit={handleFinalizarAtendimento} onChange={setSOAP} desabilitado={phase === "feedback"} />
            </div>
          </div>
        </div>

        {/* Layout Mobile: abas dinâmicas */}
        <div className="lg:hidden space-y-4">
          <div className={abaAtiva === "paciente" ? "block" : "hidden"}>
            <div className="h-[calc(100dvh-200px)] min-h-80 flex flex-col">
              <ChatPaciente nomePaciente={caso.paciente.nome} casoId={casoId} onMensagensChange={setMensagens} />
            </div>
          </div>
          <div className={abaAtiva === "exame" ? "block" : "hidden"}>
            <PainelExameFisico
              caso={caso}
              manobrasSolicitadas={manobrasSolicitadas}
              onNovaManobra={handleNovaManobra}
              modoOSCE={modoOSCE}
            />
          </div>
          <div className={abaAtiva === "exames" ? "block" : "hidden"}>
            <PainelExamesComplementares
              casoId={casoId}
              examesSolicitados={examesSolicitados}
              onNovoExame={handleNovoExame}
              desabilitado={phase === "feedback"}
            />
          </div>
          <div className={abaAtiva === "sinaisVitais" ? "block" : "hidden"}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                <h3 className="font-bold text-slate-800">Sinais Vitais</h3>
              </div>
              <button
                onClick={() => setSinaisVitaisSolicitados(true)}
                disabled={sinaisVitaisSolicitados || phase === "feedback"}
                className={`w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  sinaisVitaisSolicitados
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-blue-600 hover:bg-blue-700 text-white border border-blue-600"
                }`}
              >
                {sinaisVitaisSolicitados ? "✓ Coletado" : "Solicitar Sinais Vitais"}
              </button>
              {sinaisVitaisSolicitados && caso.sinaisVitaisCorretos && (
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-emerald-50 p-3 rounded text-center">
                    <p className="text-slate-600 font-semibold">PA</p>
                    <p className="font-bold text-emerald-700 mt-1">{caso.sinaisVitaisCorretos.pressaoArterial}</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded text-center">
                    <p className="text-slate-600 font-semibold">FC</p>
                    <p className="font-bold text-emerald-700 mt-1">{caso.sinaisVitaisCorretos.frequenciaCardiaca}</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded text-center">
                    <p className="text-slate-600 font-semibold">FR</p>
                    <p className="font-bold text-emerald-700 mt-1">{caso.sinaisVitaisCorretos.frequenciaRespiratoria}</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded text-center">
                    <p className="text-slate-600 font-semibold">Temp</p>
                    <p className="font-bold text-emerald-700 mt-1">{caso.sinaisVitaisCorretos.temperatura}°C</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded text-center">
                    <p className="text-slate-600 font-semibold">SpO₂</p>
                    <p className="font-bold text-emerald-700 mt-1">{caso.sinaisVitaisCorretos.saturacaoOxigenio}%</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded text-center">
                    <p className="text-slate-600 font-semibold">Glicose</p>
                    <p className="font-bold text-emerald-700 mt-1">{caso.sinaisVitaisCorretos.glicemia ? `${caso.sinaisVitaisCorretos.glicemia} mg/dL` : "—"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Blocos fixos no mobile (abaixo das abas dinâmicas) */}
          <FormularioSOAP onSubmit={handleFinalizarAtendimento} onChange={setSOAP} desabilitado={phase === "feedback"} />
          <PainelDiagnostico
            onSubmit={handleFinalizarAtendimento}
            onChange={setDiagnostico}
            desabilitado={phase === "feedback"}
          />
        </div>
      </div>

      {/* Loading Relatório Modal */}
      <LoadingRelatorio
        isVisible={gerandoFeedback}
        percentual={progressoFeedback}
        mensagem={mensagemLoading}
      />

      {/* Card de Erro */}
      {erroFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
            </div>
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
              Erro ao gerar relatório
            </h2>
            <p className="text-center text-gray-600 mb-8">{erroFeedback}</p>
            <button
              onClick={() => {
                setErroFeedback(null);
                setPhase("anamnese");
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CasoPageContent;
