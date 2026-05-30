"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ChatPaciente from "@/components/ChatPaciente";
import PainelExameFisico from "@/components/PainelExameFisico";
import FormularioSOAP from "@/components/FormularioSOAP";
import FeedbackOSCE from "@/components/FeedbackOSCE";
import LoadingRelatorio from "@/components/LoadingRelatorio";
import PainelExamesComplementares from "@/components/PainelExamesComplementares";
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

  if (!caso) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-xl text-gray-600">Carregando caso...</p>
        </div>
      </div>
    );
  }

  if (phase === "feedback" && feedback) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <FeedbackOSCE
            feedback={feedback}
            nomePaciente={caso.paciente.nome}
            tempoDecorrido={tempoDecorrido}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Aviso OSCE */}
      {modoOSCE && (
        <div className="bg-indigo-600 text-white p-3 text-center font-semibold">
          🎯 Modo OSCE Aleatório - O diagnóstico será revelado ao finalizar
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          {/* Se NÃO está em modo OSCE, mostrar o título completo */}
          {!modoOSCE && (
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 break-words">{caso.titulo}</h1>
          )}

          {/* Se está em modo OSCE, mostrar apenas "Simulado OSCE" */}
          {modoOSCE && (
            <h1 className="text-2xl md:text-3xl font-bold mb-4">🏥 Simulado OSCE</h1>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-blue-100 text-sm sm:text-base">
                Paciente: <span className="font-semibold">{caso.paciente.nome}</span>
              </p>
              <p className="text-blue-100 text-sm sm:text-base">
                Idade: <span className="font-semibold">{caso.paciente.idade} anos</span>
              </p>
              <p className="text-blue-100 text-sm sm:text-base">
                Sexo: <span className="font-semibold">{caso.paciente.sexo === "M" ? "Masculino" : "Feminino"}</span>
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-blue-100 text-sm sm:text-base">Tempo de atendimento:</p>
              <p className="text-xl sm:text-2xl font-bold">
                {Math.floor(tempoDecorrido / 60)}m {tempoDecorrido % 60}s
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat e Exame Físico (Esquerda/Centro) */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Chat */}
            <div className="min-h-96 sm:min-h-96 md:min-h-[500px] flex flex-col">
              <ChatPaciente
                nomePaciente={caso.paciente.nome}
                casoId={casoId}
                onMensagensChange={setMensagens}
              />
            </div>

            {/* Exame Físico e Sinais */}
            <PainelExameFisico
              sinaisVitaisSolicitados={sinaisVitaisSolicitados}
              sinaisVitaisData={
                sinaisVitaisSolicitados ? caso.sinaisVitaisCorretos : undefined
              }
              onSolicitarSinaisVitais={() =>
                setSinaisVitaisSolicitados(true)
              }
              caso={caso}
              manobrasSolicitadas={manobrasSolicitadas}
              onNovaManobra={handleNovaManobra}
              modoOSCE={modoOSCE}
            />

            {/* Exames Complementares */}
            <PainelExamesComplementares
              casoId={casoId}
              examesSolicitados={examesSolicitados}
              onNovoExame={handleNovoExame}
              desabilitado={phase === "feedback"}
            />
          </div>

          {/* Formulário SOAP (Direita) */}
          <div className="lg:col-span-1">
            <FormularioSOAP onSubmit={handleFinalizarAtendimento} />
          </div>
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
