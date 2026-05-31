"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ChatPaciente from "@/components/ChatPaciente";
import PainelExameFisico from "@/components/PainelExameFisico";
import FormularioSOAP from "@/components/FormularioSOAP";
import FeedbackOSCE from "@/components/FeedbackOSCE";
import LoadingRelatorio from "@/components/LoadingRelatorio";
import PainelExamesComplementares from "@/components/PainelExamesComplementares";
import ResumoAnamnese from "@/components/ResumoAnamnese";
import { casosOSCE } from "@/data/casos-osce";
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

  const exameFisicoSolicitado = manobrasSolicitadas.length > 0;

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

  const calcularNota = useCallback(
    (soap: FormularioSOAPType, diagnostico: DiagnosticoFormulario): number => {
      let nota = 6; // Base

      if (!caso) return nota;

      // Avaliação do Subjetivo
      if (
        soap.subjetivo
          .toLowerCase()
          .includes("dor") ||
        soap.subjetivo.toLowerCase().includes("início")
      ) {
        nota += 0.5;
      }

      // Avaliação do Objetivo
      if (sinaisVitaisSolicitados && exameFisicoSolicitado) {
        nota += 1;
      }

      // Avaliação da Hipótese Diagnóstica
      const diagCorreto = caso.diagnosticoCorreto || caso.dados_ocultos_do_sistema.diagnostico_principal;
      if (
        diagnostico.hipotesePrincipal.toLowerCase() ===
        diagCorreto.toLowerCase()
      ) {
        nota += 2;
      } else if (
        diagnostico.diagnosticosDisferenciais
          .join(" ")
          .toLowerCase()
          .includes(diagCorreto.toLowerCase())
      ) {
        nota += 1;
      }

      // Avaliação dos Exames
      const examesIndicados = caso.examesIndicados || [];
      const examesCorretos = examesIndicados.filter((exame) =>
        diagnostico.examesIndicados
          .join(" ")
          .toLowerCase()
          .includes(exame.toLowerCase())
      );
      nota += examesCorretos.length * 0.5;

      // Avaliação da Conduta
      if (
        soap.plano.length > 50 &&
        diagnostico.conduta.length > 50
      ) {
        nota += 1;
      }

      return Math.min(nota, 10);
    },
    [caso, sinaisVitaisSolicitados, manobrasSolicitadas]
  );

  const gerarFeedback = useCallback(
    (soap: FormularioSOAPType, diagnostico: DiagnosticoFormulario) => {
      const nota = calcularNota(soap, diagnostico);

      const acertos: string[] = [];
      const erros: string[] = [];

      if (!caso) return { nota: 0, acertos, erros, orientacaoDidata: "", tempoAtendimento: 0 };

      // Verificar acertos
      if (sinaisVitaisSolicitados) {
        acertos.push("Solicitou sinais vitais");
      } else {
        erros.push("Não solicitou sinais vitais");
      }

      if (exameFisicoSolicitado) {
        acertos.push("Solicitou exame físico");
      } else {
        erros.push("Não solicitou exame físico");
      }

      if (
        diagnostico.hipotesePrincipal.toLowerCase() ===
        (caso.diagnosticoCorreto || caso.dados_ocultos_do_sistema.diagnostico_principal).toLowerCase()
      ) {
        acertos.push(
          `Diagnóstico correto: ${caso.diagnosticoCorreto || caso.dados_ocultos_do_sistema.diagnostico_principal}`
        );
      } else {
        erros.push(
          `Diagnóstico esperado: ${caso.diagnosticoCorreto || caso.dados_ocultos_do_sistema.diagnostico_principal}`
        );
      }

      if (diagnostico.examesIndicados.length > 0) {
        acertos.push("Indicou exames complementares");
      }

      if (diagnostico.conduta.length > 50) {
        acertos.push("Plano de conduta detalhado");
      } else {
        erros.push("Plano de conduta incompleto ou muito breve");
      }

      const feedbackPadrao: FeedbackOSCEType = {
        nota,
        percentual: Math.round(nota * 10),
        classificacao: nota >= 9 ? "Excelente" : nota >= 7 ? "Bom" : nota >= 5 ? "Regular" : "Insuficiente",
        justificativaNota: "Aguardando avaliação detalhada...",
        tempoAtendimento: tempoDecorrido,
        resumoCaso: { diagnosticoEsperado: "", sindromePrincipal: "", achadosChave: [], raciocinioEsperado: "" },
        anamnese: { acertos, faltouPerguntar: [], perguntasPoucoUteis: [], comentario: "" },
        exameFisico: { manobrasRealizadas: [], achadosEncontrados: [], manobrasEsquecidas: [], comentario: "" },
        sinaisVitais: { interpretacao: "", pontosDeAlerta: [] },
        raciocinioDiagnostico: { hipoteseDoEstudante: "", diagnosticoEsperado: "", avaliacao: "", diferenciaisAdequados: [], diferenciaisFaltantes: [], comentario: "" },
        examesComplementares: { adequados: [], faltantes: [], desnecessarios: [], comentario: "" },
        conduta: { adequada: [], incompleta: [], erros: [], condutaModelo: "" },
        soap: { subjetivo: "", objetivo: "", avaliacao: "", plano: "", comentarioGeral: "" },
        errosCriticos: [],
        respostaModeloOSCE: "",
        planoDeEstudo: [],
      };

      return feedbackPadrao;
    },
    [caso, sinaisVitaisSolicitados, manobrasSolicitadas, tempoDecorrido, calcularNota]
  );

  const handleFinalizarAtendimento = async (dados: {
    soap: FormularioSOAPType;
    diagnostico: DiagnosticoFormulario;
  }) => {
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
          hipoteseDiagnostica: dados.diagnostico.hipotesePrincipal,
          diagnosticosDiferenciais: dados.diagnostico.diagnosticosDisferenciais,
          examesSolicitados: dados.diagnostico.examesIndicados,
          conduta: dados.diagnostico.conduta,
          soap: dados.soap,
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
        console.error("Erro ao obter feedback:", response.status);
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

  const [abaAtiva, setAbaAtiva] = useState<"paciente" | "exame" | "exames" | "soap">("paciente");
  const [menuAtivo, setMenuAtivo] = useState<"paciente" | "exame" | "exames" | "soap" | "finalizar">("paciente");

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
        <div className="max-w-4xl mx-auto px-4">
          <FeedbackOSCE
            feedback={feedback}
            nomePaciente={caso.paciente.nome}
            tempoDecorrido={tempoDecorrido}
          />
        </div>
      </div>
    );
  }

  const abas = [
    { id: "paciente" as const, label: "Paciente", icon: "💬" },
    { id: "exame" as const, label: "Exame", icon: "🥼" },
    { id: "exames" as const, label: "Exames", icon: "🧪" },
    { id: "soap" as const, label: "SOAP", icon: "📝" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
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
                  { id: "finalizar" as const, label: "Finalizar", icon: "✅" },
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
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-emerald-50 p-2 rounded text-center">
                    <p className="text-slate-500">PA</p>
                    <p className="font-bold text-emerald-700">{caso.sinaisVitaisCorretos.pressaoArterial}</p>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded text-center">
                    <p className="text-slate-500">FC</p>
                    <p className="font-bold text-emerald-700">{caso.sinaisVitaisCorretos.frequenciaCardiaca} bpm</p>
                  </div>
                </div>
              )}
            </div>

            {/* Exames Complementares Lateral */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Exames Complementares</p>
              <p className="text-xs text-slate-500 mb-3">Solicite conforme sua hipótese clínica.</p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Ex: ECG, hemograma..."
                  disabled={phase === "feedback"}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:bg-slate-100"
                />
                <button
                  disabled={phase === "feedback"}
                  className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors"
                >
                  Solicitar
                </button>
              </div>
            </div>
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
                sinaisVitaisSolicitados={sinaisVitaisSolicitados}
                sinaisVitaisData={sinaisVitaisSolicitados ? caso.sinaisVitaisCorretos : undefined}
                onSolicitarSinaisVitais={() => setSinaisVitaisSolicitados(true)}
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

            {menuAtivo === "finalizar" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-800 mb-2">Antes de finalizar:</p>
                <p className="text-xs text-slate-600 mb-4">Revise a Avaliação Clínica na coluna direita e clique no botão verde para finalizar.</p>
              </div>
            )}
          </div>

          {/* Coluna 3: Painel Direito Fixo (Avaliação Clínica) */}
          <div className="min-w-0">
            <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              <FormularioSOAP onSubmit={handleFinalizarAtendimento} desabilitado={phase === "feedback"} />
            </div>
          </div>
        </div>

        {/* Layout Mobile: abas */}
        <div className="lg:hidden">
          {abaAtiva === "paciente" && (
            <div className="h-[calc(100dvh-200px)] min-h-80 flex flex-col">
              <ChatPaciente nomePaciente={caso.paciente.nome} casoId={casoId} onMensagensChange={setMensagens} />
            </div>
          )}
          {abaAtiva === "exame" && (
            <PainelExameFisico
              sinaisVitaisSolicitados={sinaisVitaisSolicitados}
              sinaisVitaisData={sinaisVitaisSolicitados ? caso.sinaisVitaisCorretos : undefined}
              onSolicitarSinaisVitais={() => setSinaisVitaisSolicitados(true)}
              caso={caso}
              manobrasSolicitadas={manobrasSolicitadas}
              onNovaManobra={handleNovaManobra}
              modoOSCE={modoOSCE}
            />
          )}
          {abaAtiva === "exames" && (
            <PainelExamesComplementares
              casoId={casoId}
              examesSolicitados={examesSolicitados}
              onNovoExame={handleNovoExame}
              desabilitado={phase === "feedback"}
            />
          )}
          {abaAtiva === "soap" && (
            <FormularioSOAP onSubmit={handleFinalizarAtendimento} />
          )}
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
