"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ChatPaciente from "@/components/ChatPaciente";
import { ConsultorioMedixBodyClass } from "@/components/consultorio/ConsultorioMedixBodyClass";
import "./consultorio-medix.css";
import ExameFisicoAdultoVisual from "@/components/ExameFisicoAdultoVisual";
import ExameFisicoPediatrico from "@/components/pediatria/ExameFisicoPediatrico";
import FormularioSOAP from "@/components/FormularioSOAP";
import PainelDiagnostico from "@/components/PainelDiagnostico";
import FeedbackOSCE from "@/components/FeedbackOSCE";
import LoadingRelatorio from "@/components/LoadingRelatorio";
import PainelExamesComplementares from "@/components/PainelExamesComplementares";
import SimuladorECG, { type ECGSimuladorState } from "@/components/SimuladorECG";
import OpenIRawImagePanel from "@/components/OpenIRawImagePanel";
import LaboratoryPanel from "@/src/components/LaboratoryPanel";
import VitalsReassessment from "@/src/components/VitalsReassessment";
import { mapEvidences, expandExamName } from "@/lib/osce/evidence-mapper";
import { construirFeedbackViewDeHealthBench } from "@/lib/healthbench/feedback-view-builder";
import { casosV2 } from "@/data/casos-v2";
import { event } from "@/lib/analytics";
import { getDiagnosticoOcultoDoCaso } from "@/lib/utils/diagnostico-oculto";
import { markFreeOsceUsedOnFinish } from "@/lib/accessControl";
import {
  getAttendanceProgress,
  saveAttendanceProgress,
  clearAttendanceProgress,
  type AttendanceSnapshot,
} from "@/lib/attendanceProgress";
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
  // Fase 27: laudos laboratoriais REALMENTE visualizados (aba Exames Laboratoriais).
  const [labsVisualizados, setLabsVisualizados] = useState<string[]>([]);
  // Auditoria: resultado OBJETIVO por exame visualizado (para relatório/feedback).
  const [labsResultados, setLabsResultados] = useState<Record<string, string>>({});
  const registrarLabVisualizado = (_id: string, label: string, resumo?: string) => {
    setLabsVisualizados((prev) => (prev.includes(label) ? prev : [...prev, label]));
    if (resumo) setLabsResultados((prev) => ({ ...prev, [label]: resumo }));
  };
  // Reavaliação de sinais vitais: tempo de observação escolhido (persiste entre abas).
  const [vitalsReavaliadoMin, setVitalsReavaliadoMin] = useState<number | null>(null);
  const [vitalsReavaliacao, setVitalsReavaliacao] = useState<{
    minutos: number;
    exitVitals: Record<string, unknown>;
    therapeuticResponse: string;
    therapeuticResponseLabel: string;
    disposition?: string;
    stabilityLabel?: string;
  } | null>(null);
  const handleReavaliar = (min: number, saida?: { exitVitals: any; therapeuticResponse: string; therapeuticResponseLabel: string; disposition?: string; stabilityLabel?: string }) => {
    setVitalsReavaliadoMin(min);
    if (saida) {
      setVitalsReavaliacao({
        minutos: min,
        exitVitals: saida.exitVitals as Record<string, unknown>,
        therapeuticResponse: saida.therapeuticResponse,
        therapeuticResponseLabel: saida.therapeuticResponseLabel,
        disposition: saida.disposition,
        stabilityLabel: saida.stabilityLabel,
      });
    }
  };
  const [ecgGerado, setEcgGerado] = useState<any>(null);
  const [ecgSimuladorState, setEcgSimuladorState] = useState<ECGSimuladorState | null>(null);
  const [feedback, setFeedback] = useState<FeedbackOSCEType | null>(null);
  const [mensagens, setMensagens] = useState<MensagemChat[]>([]);
  const [gerandoFeedback, setGerandoFeedback] = useState(false);
  const [progressoFeedback, setProgressoFeedback] = useState(0);
  const [mensagemLoading, setMensagemLoading] = useState("");
  const [erroFeedback, setErroFeedback] = useState<string | null>(null);
  const [imagensCandidatasPrecarregadas, setImagensCandidatasPrecarregadas] = useState<any[]>([]);
  const [carregandoImagemRadiologica, setCarregandoImagemRadiologica] = useState(false);
  const [erroImagemRadiologica, setErroImagemRadiologica] = useState(false);
  const [imageUrlRadiologica, setImageUrlRadiologica] = useState<string | null>(null);

  // 🟢 NOVO FLUXO LIMPO — Open-i Raw (/api/openi/raw + OpenIRawImagePanel)
  const [openIImageUrl, setOpenIImageUrl] = useState<string | null>(null);
  const [openIQuery, setOpenIQuery] = useState<string | null>(null);
  const [openILoading, setOpenILoading] = useState(false);
  const [openIError, setOpenIError] = useState<string | null>(null);
  const apiConcluídaRef = useRef(false);
  const feedbackRecebidoRef = useRef<FeedbackOSCEType | null>(null);
  const abortControllerImagemRef = useRef<AbortController | null>(null);
  const diagnosticoPrecarregadoRef = useRef<string>("");
  const imagensPrecarregadasCacheRef = useRef<Map<string, any[]>>(new Map());
  const timeoutImagemRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleECGGerado = useCallback((ecgGeradoData: any) => {
    // Armazenar ECG gerado
    setEcgGerado(ecgGeradoData);
    // Adicionar também a examesSolicitados para aparecer na aba de exames
    setExamesSolicitados(prev => [...prev, {
      nome: ecgGeradoData.nome,
      resultado: JSON.stringify({
        interpretacao: ecgGeradoData.interpretacao,
        presetId: ecgGeradoData.presetId,
        selectedLeads: ecgGeradoData.selectedLeads,
      }),
      timestamp: new Date(),
    }]);
  }, []);

  // Snapshot de progresso restaurado — usado para semear os componentes
  // controlados (chat, diagnóstico, SOAP) na primeira montagem.
  const progressoRestauradoRef = useRef<AttendanceSnapshot | null>(null);
  const progressoHidratadoRef = useRef(false);

  // Restaura o progresso salvo do atendimento (se houver) para retomar de onde parou.
  const restaurarProgresso = () => {
    const snap = getAttendanceProgress(casoId);
    // Sempre reflete o progresso do caso ATUAL (ou nenhum) — nunca deixa
    // resquício do snapshot de um caso anterior quando o novo caso não tem
    // progresso salvo (evita vazar mensagens/estado antigos para o chat).
    progressoRestauradoRef.current = snap;
    if (!snap) return;
    if (snap.mensagens) setMensagens(snap.mensagens);
    if (snap.manobras) setManobrasSolicitadas(snap.manobras);
    if (snap.exames) setExamesSolicitados(snap.exames);
    if (snap.labs) setLabsVisualizados(snap.labs);
    if (typeof snap.sinaisVitaisSolicitados === "boolean") setSinaisVitaisSolicitados(snap.sinaisVitaisSolicitados);
    if (snap.vitalsReavaliadoMin !== undefined) setVitalsReavaliadoMin(snap.vitalsReavaliadoMin);
    if (snap.vitalsReavaliacao) setVitalsReavaliacao(snap.vitalsReavaliacao);
    if (snap.ecgGerado) setEcgGerado(snap.ecgGerado);
    if (snap.ecgSimuladorState) setEcgSimuladorState(snap.ecgSimuladorState);
    if (snap.tempoInicio) setTempoInicio(snap.tempoInicio);
  };

  // Carregar caso
  useEffect(() => {
    // O chat pertence exclusivamente ao caso atual: zera o histórico de
    // imediato a cada troca de casoId (restaurarProgresso() abaixo repõe as
    // mensagens salvas do NOVO caso, se houver).
    setMensagens([]);

    // 1. Verificar sessionStorage primeiro (para casos gerados)
    try {
      const casoGerado = sessionStorage.getItem("casoGerado");
      if (casoGerado) {
        const caso = JSON.parse(casoGerado);
        if (caso.id === casoId) {
          setCaso(caso);
          setTempoInicio(Date.now());
          restaurarProgresso();
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
    const casoEncontrado = casosV2.find((c) => c.id === casoId);
    if (casoEncontrado) {
      setCaso(casoEncontrado as any);
      setTempoInicio(Date.now());
      restaurarProgresso();
      event("iniciou_caso", {
        caso_id: casoEncontrado.id,
        caso_titulo: casoEncontrado.titulo,
        modo: "prova",
      });
    }
  }, [casoId]);

  // Free tier: o caso gratuito só é CONSUMIDO ao finalizar (feedback gerado).
  // Ao finalizar, também limpamos o progresso salvo (atendimento concluído).
  useEffect(() => {
    if (phase === "feedback") {
      markFreeOsceUsedOnFinish(casoId);
      clearAttendanceProgress(casoId);
    }
  }, [phase, casoId]);

  // Timer do atendimento
  useEffect(() => {
    if (phase === "anamnese") {
      const interval = setInterval(() => {
        setTempoDecorrido(Math.floor((Date.now() - tempoInicio) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase, tempoInicio]);

  // Pré-carregamento de imagens radiológicas em background
  useEffect(() => {
    if (!caso) return;

    // Usar diagnóstico OCULTO real do caso (nunca exibido ao aluno)
    const diagnostico = getDiagnosticoOcultoDoCaso(caso);

    if (!diagnostico) return;

    // Verificar se já está em cache
    const cacheKey = `${caso.id}_${diagnostico}`;
    if (imagensPrecarregadasCacheRef.current.has(cacheKey)) {
      const imagensCached = imagensPrecarregadasCacheRef.current.get(cacheKey);
      setImagensCandidatasPrecarregadas(imagensCached || []);
      setCarregandoImagemRadiologica(false);
      setErroImagemRadiologica(false);
      return;
    }

    // Se já está carregando para este diagnóstico, não fazer de novo
    if (diagnosticoPrecarregadoRef.current === cacheKey) {
      return;
    }

    diagnosticoPrecarregadoRef.current = cacheKey;

    // Cancelar busca anterior se existir
    if (abortControllerImagemRef.current) {
      abortControllerImagemRef.current.abort();
    }
    if (timeoutImagemRef.current) {
      clearTimeout(timeoutImagemRef.current);
    }

    // Criar novo controller para esta busca
    const controller = new AbortController();
    abortControllerImagemRef.current = controller;

    // TIMEOUT DE SEGURANÇA: 8 segundos máximo
    const timeout = setTimeout(() => {
      controller.abort();
      setCarregandoImagemRadiologica(false);
      setErroImagemRadiologica(true);
      // Armazenar em cache como vazio temporariamente (5 min) para não repetir busca travada
      imagensPrecarregadasCacheRef.current.set(cacheKey, []);
    }, 8000);
    timeoutImagemRef.current = timeout;

    // Buscar imagens em background
    setCarregandoImagemRadiologica(true);
    setErroImagemRadiologica(false);

    const buscarImagensBackground = async () => {
      try {
        // 🔴 SIMPLES: Buscar com mode=openi_raw e pegar apenas imageUrl
        const url = `/api/exams/references?diagnosis=${encodeURIComponent(diagnostico)}&mode=openi_raw`;

        const response = await fetch(url, {
          signal: controller.signal,
          cache: "no-store"
        });

        if (!response.ok) {
          setImagensCandidatasPrecarregadas([]);
          imagensPrecarregadasCacheRef.current.set(cacheKey, []);
          return;
        }

        const dados = await response.json();

        // 1️⃣ API retorna imageUrl?
        console.log("[1️⃣ API]", {
          "sucesso": dados?.sucesso,
          "imageUrl": dados?.imageUrl?.substring(0, 60),
          "imagens[0].imageUrl": dados?.imagens?.[0]?.imageUrl?.substring(0, 60)
        });

        // 2️⃣ Extrair imageUrl diretamente
        const imageUrl = dados?.imageUrl || dados?.imagens?.[0]?.imageUrl || null;
        console.log("[2️⃣ EXTRAÇÃO]", { imageUrl: imageUrl?.substring(0, 60) });

        // 3️⃣ Setar o estado simples
        console.log("[3️⃣ ANTES DE setState]", { imageUrl: imageUrl?.substring(0, 60) });
        setImageUrlRadiologica(imageUrl);
        console.log("[3️⃣ APÓS setState]", { imageUrlRadiologica: imageUrl?.substring(0, 60) });

        setErroImagemRadiologica(false);
      } catch (erro) {
        if (erro instanceof Error && erro.name === "AbortError") {
          // Busca foi cancelada (timeout ou cleanup), não fazer nada
          return;
        }
        setImagensCandidatasPrecarregadas([]);
        imagensPrecarregadasCacheRef.current.set(cacheKey, []);
        setErroImagemRadiologica(true);
      } finally {
        setCarregandoImagemRadiologica(false);
        if (timeoutImagemRef.current) {
          clearTimeout(timeoutImagemRef.current);
          timeoutImagemRef.current = null;
        }
      }
    };

    buscarImagensBackground();

    // Cleanup: cancelar busca ao desmontar ou se caso mudar
    return () => {
      if (abortControllerImagemRef.current === controller) {
        controller.abort();
      }
      if (timeoutImagemRef.current) {
        clearTimeout(timeoutImagemRef.current);
      }
    };
  }, [caso]);

  // 🟢 NOVO FLUXO LIMPO — Buscar imagem via /api/openi/raw ao trocar de caso
  useEffect(() => {
    if (!caso) return;

    // 1. Limpar SEMPRE a imagem anterior (nunca persiste entre casos)
    setOpenIImageUrl(null);
    setOpenIQuery(null);
    setOpenIError(null);
    setOpenILoading(true);

    // 2. Diagnóstico oculto do caso (campo: dados_ocultos_do_sistema.diagnostico_principal)
    const diagnostico = getDiagnosticoOcultoDoCaso(caso);

    if (!diagnostico) {
      setOpenILoading(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        const resp = await fetch(
          `/api/openi/raw?diagnosis=${encodeURIComponent(diagnostico)}`,
          { cache: "no-store", signal: controller.signal }
        );
        const data = await resp.json();

        const url = data?.imageUrl ?? null;
        setOpenIQuery(data?.query ?? null);

        if (url) {
          // Sucesso com imagem: imagem válida + erro SEMPRE limpo
          setOpenIImageUrl(url);
          setOpenIError(null);
        } else {
          // Resposta sem imagem
          setOpenIImageUrl(null);
          setOpenIError("Imagem indisponível");
        }
        setOpenILoading(false);

        console.log("[OPENI FRONT STATE]", {
          casoId: caso.id,
          query: data?.query ?? null,
          imageUrl: url,
          loading: false,
          error: url ? null : "Imagem indisponível",
        });
      } catch (erro) {
        if (erro instanceof Error && erro.name === "AbortError") return;
        setOpenIImageUrl(null);
        setOpenIError("Falha ao consultar o Open-i.");
        setOpenILoading(false);
      }
    })();

    return () => controller.abort();
  }, [caso]);

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

    // 🟢 FASE 2: caminho central /api/osce/finalizar (HealthBench = source of truth,
    // legado embutido). Se falhar, cai no fluxo antigo /api/corrigir abaixo (fallback).
    try {
      const respOsce = await fetch("/api/osce/finalizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          casoId: caso?.id,
          chatMessages: mensagens,
          physicalExamEvents: [
            ...manobrasSolicitadas.map((m) => ({
              categoria: m.categoria,
              textDigitado: m.textDigitado,
              resposta: m.resposta,
            })),
            // Fase 27: evidências reconhecidas do exame físico (log real → tokens avaliáveis).
            ...(() => {
              const ev = mapEvidences({ physicalExamEvents: manobrasSolicitadas.map((m) => ({ categoria: m.categoria, textDigitado: m.textDigitado, resposta: m.resposta })) }).physicalEvidences;
              return ev.length ? [{ categoria: "exame_fisico", textDigitado: ev.join("; "), resposta: "" }] : [];
            })(),
          ],
          vitalSignsEvents: {
            solicitado: sinaisVitaisSolicitados,
            dados: sinaisVitaisSolicitados ? caso?.sinaisVitaisCorretos : undefined,
          },
          // Fase 27: examRequests com expansão de exames agrupados + labs realmente visualizados.
          examRequests: [
            ...examesSolicitados.map((e) => ({ nome: e.nome, resultado: `${e.resultado ?? ""} ${expandExamName(e.nome, e.resultado).join(" ")}`.trim() })),
            ...labsVisualizados.map((l) => ({ nome: l, resultado: labsResultados[l] || `laudo laboratorial visualizado ${expandExamName(l).join(" ")}` })),
          ],
          diagnosisAndPlan: {
            hipotesePrincipal: diagnostico.hipotesePrincipal,
            diagnosticosDiferenciais: diagnostico.diagnosticosDiferenciais,
            examesIndicados: diagnostico.examesIndicados,
            conduta: diagnostico.conduta,
          },
          soap: soap,
          vitalSignsReassessment: vitalsReavaliacao
            ? { realizado: true, ...vitalsReavaliacao }
            : undefined,
          tempoAtendimento: tempoDecorrido,
          mode: modoOSCE ? "exam" : "training",
        }),
      });

      if (respOsce.ok) {
        const data = await respOsce.json();
        const hb = data?.healthBenchResult ?? null;

        // 🟢 HealthBench é a ÚNICA fonte visual do feedback principal quando existir.
        if (hb && caso) {
          console.log("[FEEDBACK HB DATA] healthBenchResult recebido");
          const falasAluno = mensagens
            .filter((m) => m.tipo === "estudante")
            .map((m) => m.conteudo)
            .join(" . ");
          const condutaTexto = [
            diagnostico.conduta,
            soap.plano,
            soap.avaliacao,
            falasAluno,
          ]
            .filter(Boolean)
            .join(" . ");
          // Radiografia visualizada pela aba "Exames de Imagem" (Open-i) conta como RX
          const imagemVisualizada = openIImageUrl
            ? `exame de imagem visualizado radiografia de torax ${openIQuery ?? ""} ${openIImageUrl}`
            : "";
          // Fase 27: Evidence Mapper — reconhece exames clicados/agrupados + exame físico do log.
          const evidencias = mapEvidences({
            examRequests: examesSolicitados.map((e) => ({ nome: e.nome, resultado: e.resultado })),
            labsVisualizados,
            physicalExamEvents: manobrasSolicitadas.map((m) => ({ categoria: m.categoria, textDigitado: m.textDigitado, resposta: m.resposta })),
            examesIndicadosTexto: diagnostico.examesIndicados ?? [],
            sinaisVitaisSolicitados,
          });
          const examesTexto = [
            ...examesSolicitados.map((e) => `${e.nome} ${e.resultado ?? ""}`),
            ...(diagnostico.examesIndicados ?? []),
            imagemVisualizada,
            evidencias.examesTextoExpandido, // exames agrupados + labs visualizados
          ]
            .filter(Boolean)
            .join(" ");

          // Transcrição completa (anamnese) e correlações verbalizadas pelo aluno
          const transcricaoTexto = mensagens
            .map((m) => m.conteudo)
            .filter(Boolean)
            .join(" . ");
          const correlacaoTexto = [
            falasAluno,
            diagnostico.hipotesePrincipal,
            (diagnostico.diagnosticosDiferenciais ?? []).join(" "),
            soap.avaliacao,
            soap.objetivo,
          ]
            .filter(Boolean)
            .join(" . ");
          const achadosTexto = [
            ...manobrasSolicitadas.map((m) => `${m.textDigitado ?? ""} ${m.resposta ?? ""}`),
            ...examesSolicitados.map((e) => `${e.nome} ${e.resultado ?? ""}`),
            evidencias.achadosTextoExpandido, // exame físico do log + exames reconhecidos
          ]
            .filter(Boolean)
            .join(" ");

          const feedbackView = construirFeedbackViewDeHealthBench(hb, caso, {
            diagnosticoInformado: diagnostico.hipotesePrincipal,
            tempoAtendimento: tempoDecorrido,
            sinaisVitais: {
              solicitado: sinaisVitaisSolicitados,
              dados: sinaisVitaisSolicitados ? caso?.sinaisVitaisCorretos : undefined,
            },
            condutaTexto,
            examesTexto,
            anamneseTexto: transcricaoTexto,
            correlacaoTexto,
            achadosTexto,
            diferenciaisInformados: diagnostico.diagnosticosDiferenciais ?? [],
            vitalSignsReassessment: vitalsReavaliacao
              ? { realizado: true, ...vitalsReavaliacao }
              : undefined,
          });
          console.log("[FEEDBACK HB DATA] cards montados por competência:", feedbackView.rubricaAvaliacao?.length);
          console.log("[FEEDBACK HB DATA] feedback principal usando HealthBench");
          console.log("[FEEDBACK HB CLEANUP] sem painel paralelo e sem duas notas");

          apiConcluídaRef.current = true;
          await new Promise((r) => setTimeout(r, 400));
          event("finalizou_caso", { caso_id: caso?.id, caso_titulo: caso?.titulo, modo: modoOSCE ? "prova" : "treinamento" });
          event("abriu_feedback", { caso_id: caso?.id, caso_titulo: caso?.titulo, nota: feedbackView.nota });
          // legacyCorrectionResult é IGNORADO visualmente (fallback técnico silencioso)
          setFeedback(feedbackView);
          setPhase("feedback");
          clearInterval(intervaloProgresso);
          setProgressoFeedback(100);
          return;
        }
      }
    } catch (e) {
      console.warn("[FEEDBACK HB FALLBACK] HealthBench indisponível, usando correção legada:", e);
    }

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
          diagnosticosDiferenciais: diagnostico.diagnosticosDiferenciais,
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

        // Fallback legado: feedback do /api/corrigir alimenta a tela
        // (só chega aqui se /api/osce/finalizar / HealthBench falhar).
        console.log("[FEEDBACK HB FALLBACK] fallback legado acionado");
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

  const [abaAtiva, setAbaAtiva] = useState<"paciente" | "exame" | "imagemRadiologica" | "exames" | "laboratorio" | "sinaisVitais" | "ecg">("paciente");

  // 🔍 LOG: Monitorar mudanças de aba
  useEffect(() => {
    console.log("[ABA]", abaAtiva);
  }, [abaAtiva]);
  const [menuAtivo, setMenuAtivo] = useState<"paciente" | "exame" | "imagemRadiologica" | "exames" | "laboratorio" | "sinaisVitais" | "ecg">("paciente");

  // Exame Físico Visual do adulto (modal, padrão pediátrico)
  const [modalExameAdultoAberto, setModalExameAdultoAberto] = useState(false);
  const isAdulto = caso?.tipoPaciente !== "pediatrico";

  // Abrir Exame Físico: adulto → modal visual direto; pediátrico → fluxo inline atual
  const abrirExameFisico = (origem: "menu" | "aba") => {
    if (isAdulto) {
      setModalExameAdultoAberto(true);
    } else if (origem === "menu") {
      setMenuAtivo("exame");
    } else {
      setAbaAtiva("exame");
    }
  };

  // Registra achado do exame visual adulto e confirma envio ao payload/HealthBench
  const handleAchadoExameAdulto = (m: ManobraRealizada) => {
    handleNovaManobra(m);
    console.log(
      "[OSCE ADULT PHYSICAL EXAM PAYLOAD] achados adultos enviados:",
      `${m.textDigitado}: ${m.resposta}`
    );
  };
  const [soap, setSOAP] = useState<FormularioSOAPType>({
    subjetivo: "",
    objetivo: "",
    avaliacao: "",
    plano: "",
  });
  const [diagnostico, setDiagnostico] = useState<DiagnosticoFormulario>({
    hipotesePrincipal: "",
    diagnosticosDiferenciais: [],
    examesIndicados: [],
    conduta: "",
  });

  // Persistência do progresso do atendimento (durante a anamnese), para retomar
  // de onde parou ao voltar. Pula a 1ª execução (antes de a restauração refletir
  // no estado) para não sobrescrever o progresso salvo com valores vazios.
  useEffect(() => {
    if (!caso || phase !== "anamnese") return;
    if (!progressoHidratadoRef.current) {
      progressoHidratadoRef.current = true;
      return;
    }
    saveAttendanceProgress(casoId, {
      mensagens,
      manobras: manobrasSolicitadas,
      exames: examesSolicitados,
      labs: labsVisualizados,
      sinaisVitaisSolicitados,
      vitalsReavaliadoMin,
      vitalsReavaliacao,
      ecgGerado,
      ecgSimuladorState,
      soap,
      diagnostico,
      tempoInicio,
    });
  }, [
    caso,
    phase,
    casoId,
    mensagens,
    manobrasSolicitadas,
    examesSolicitados,
    labsVisualizados,
    sinaisVitaisSolicitados,
    vitalsReavaliadoMin,
    vitalsReavaliacao,
    ecgGerado,
    ecgSimuladorState,
    soap,
    diagnostico,
    tempoInicio,
  ]);

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
          {/* Feedback do Atendimento — alimentado diretamente pelo HealthBench
              (quando /api/osce/finalizar retorna healthBenchResult). Sem painel paralelo. */}
          <FeedbackOSCE
            feedback={feedback}
            nomePaciente={caso.paciente.nome}
            tempoDecorrido={tempoDecorrido}
            caso={caso}
            chatMessages={mensagens}
            manobrasSolicitadas={manobrasSolicitadas}
            examesSolicitados={[
              ...examesSolicitados,
              // Fase 27: laudos laboratoriais visualizados entram como evidência real
              // (StudentTrace, PDF e Professor IA passam a reconhecê-los).
              ...labsVisualizados.map((l) => ({ nome: l, resultado: labsResultados[l] || "laudo laboratorial visualizado" })),
            ]}
            sinaisVitais={{
              solicitado: sinaisVitaisSolicitados,
              dados: sinaisVitaisSolicitados ? caso?.sinaisVitaisCorretos : undefined,
            }}
            vitalSignsReassessment={vitalsReavaliacao ? { realizado: true, ...vitalsReavaliacao } : null}
            diagnostico={diagnostico}
            soap={soap}
          />
        </div>
      </div>
    );
  }

  // Conduta CONSOLIDADA lida pelo TreatmentResponseEngine na aba Sinais Vitais.
  // Fontes somadas (nenhuma substitui a outra): conduta do diagnóstico, plano e
  // avaliação do SOAP e o HISTÓRICO COMPLETO do chat (mensagens do médico e do
  // paciente). Assim, intervenções ditas no chat ("vou administrar dipirona 1g",
  // "faço nebulização com salbutamol") também são reconhecidas.
  // Somente leitura: não altera scoring, feedback, SOAP, diagnóstico nem o chat.
  const chatCondutaTexto = mensagens.map((m) => m.conteudo).filter(Boolean).join(". ");
  const condutaTexto = [diagnostico.conduta, soap.plano, soap.avaliacao, chatCondutaTexto]
    .filter(Boolean)
    .join(". ");
  const condutaFontes = {
    conduta: diagnostico.conduta || "",
    plano: soap.plano || "",
    avaliacao: soap.avaliacao || "",
    chatMensagens: mensagens.length,
  };

  const abas = [
    { id: "paciente" as const, label: "Paciente", icon: "💬" },
    { id: "sinaisVitais" as const, label: "Sinais Vitais", icon: "📊" },
    { id: "exame" as const, label: "Exame", icon: "🥼" },
    { id: "imagemRadiologica" as const, label: "Exames de Imagem", icon: "🖼️" },
    { id: "exames" as const, label: "Solicitar Exames", icon: "🧪" },
    { id: "laboratorio" as const, label: "Exames Laboratoriais", icon: "🧬" },
    { id: "ecg" as const, label: "ECG", icon: "📈" },
  ];

  return (
    <div className="min-h-screen consultorio-medix">
      {/* Mantém a classe no body para os overrides visuais desta rota */}
      <ConsultorioMedixBodyClass />

      {/* A sidebar é global (AppShell/AppSidebar) — não renderiza sidebar local aqui. */}

      {/* Topbar MEDIX antiga (saudação + busca + ícones) removida desta tela.
          A navegação global permanece na sidebar esquerda (AppShell). */}

      {/* Faixas antigas (banner "Modo OSCE" e header "Simulado OSCE / Tempo")
          removidas do layout MEDIX — o cronômetro (tempoDecorrido) e a lógica
          do modo OSCE seguem ativos internamente para payload/finalização. */}

      {/* Abas — visível apenas em mobile */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide max-w-7xl mx-auto">
          {abas.map((aba) => (
            <button
              key={aba.id}
              onClick={() =>
                aba.id === "exame"
                  ? abrirExameFisico("aba")
                  : aba.id === "ecg"
                    ? setMenuAtivo("ecg") // ECG é modal (fixed inset-0); reutiliza o gate do desktop
                    : setAbaAtiva(aba.id)
              }
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
        {/* Layout Desktop/iPad: 2 colunas (Central larga + Diagnóstico à direita).
            Menu Atendimento virou barra horizontal no topo da coluna central;
            SOAP não é renderizado nesta organização (componente preservado). */}
        <div className="consultorio-medix-grid hidden lg:grid lg:grid-cols-[minmax(0,1fr)_320px] gap-4 items-start">
          {/* Coluna esquerda/central: barra Atendimento + chat + painéis */}
          <div className="min-w-0 space-y-4 consultorio-medix-center medix-center-has-panel">
            {/* Barra Atendimento horizontal (mesmos botões/ícones/labels) */}
            <nav className="attendance-bar" aria-label="Atendimento">
              <div className="attendance-bar-list">
                {[
                  { id: "paciente" as const, label: "Paciente", icon: "icon-paciente.png" },
                  { id: "sinaisVitais" as const, label: "Sinais Vitais", icon: "icon-sinais-vitais.png" },
                  { id: "exame" as const, label: "Exame Físico", icon: "icon-exame-fisico.png" },
                  { id: "imagemRadiologica" as const, label: "Exames de Imagem", icon: "icon-exames-imagem.png" },
                  { id: "exames" as const, label: "Solicitar Exames", icon: "icon-exames.png" },
                  { id: "laboratorio" as const, label: "Exames Laboratoriais", icon: "exames-laboratoriais.png" },
                  { id: "ecg" as const, label: "ECG", icon: "icon-ecg.png" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      item.id === "exame"
                        ? abrirExameFisico("menu")
                        : setMenuAtivo(item.id)
                    }
                    className={`attendance-item${menuAtivo === item.id ? " active" : ""}`}
                  >
                    <span className="attendance-item-ico">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/assets/consultorio/attendance-icons/${item.icon}`}
                        alt=""
                        draggable={false}
                      />
                    </span>
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>

            {/* Chat */}
            <div className="flex flex-col medix-chat-slot">
              <ChatPaciente key={casoId} nomePaciente={caso.paciente.nome} casoId={casoId} caso={caso} onMensagensChange={setMensagens} mensagensIniciais={progressoRestauradoRef.current?.mensagens} />
            </div>

            {/* Conteúdo Dinâmico (Exames Solicitados / painéis) — abaixo do chat */}
            <div className="medix-internal-panel-slot">
            {/* Aba Paciente: apenas o chat (Resumo da Anamnese removido da UI) */}

            {menuAtivo === "exame" && caso.tipoPaciente === "pediatrico" && (
              <ExameFisicoPediatrico
                caso={caso}
                onAchadoEncontrado={handleNovaManobra}
                achadosEncontrados={manobrasSolicitadas}
                onFechar={() => setMenuAtivo("paciente")}
              />
            )}

            {menuAtivo === "imagemRadiologica" && (
              <OpenIRawImagePanel
                imageUrl={openIImageUrl}
                loading={openILoading}
                error={openIError}
                query={openIQuery}
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

            {menuAtivo === "laboratorio" && <LaboratoryPanel caso={caso} onExamViewed={registrarLabVisualizado} />}

            {menuAtivo === "sinaisVitais" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  <h3 className="font-bold text-slate-800">Sinais Vitais</h3>
                </div>
                <VitalsReassessment
                  caso={caso}
                  condutaTexto={condutaTexto}
                  debugSources={condutaFontes}
                  sinaisSolicitados={sinaisVitaisSolicitados}
                  onSolicitarEntrada={() => setSinaisVitaisSolicitados(true)}
                  reavaliadoMin={vitalsReavaliadoMin}
                  onReavaliar={handleReavaliar}
                  desabilitado={phase === "feedback"}
                />
              </div>
            )}

            </div>
          </div>

          {/* Coluna direita: Diagnóstico e Conduta (lateral inteira, do topo) */}
          <div className="min-w-0">
            <div className="sticky top-6 max-h-[calc(100vh-90px)] overflow-y-auto medix-diagnosis-col">
              <PainelDiagnostico
                onSubmit={handleFinalizarAtendimento}
                onChange={setDiagnostico}
                desabilitado={phase === "feedback"}
                caso={caso}
                valorInicial={progressoRestauradoRef.current?.diagnostico}
                soapSlot={
                  <FormularioSOAP
                    onChange={setSOAP}
                    desabilitado={phase === "feedback"}
                    caso={caso}
                    as="div"
                    valorInicial={progressoRestauradoRef.current?.soap}
                  />
                }
              />
            </div>
          </div>
        </div>

        {/* Layout Mobile: abas dinâmicas */}
        <div className="lg:hidden space-y-4">
          <div className={abaAtiva === "paciente" ? "block" : "hidden"}>
            {/* Bloco informativo pediátrico removido da tela do aluno (ver desktop). */}
            <div className="h-[calc(100dvh-200px)] min-h-80 flex flex-col">
              <ChatPaciente key={casoId} nomePaciente={caso.paciente.nome} casoId={casoId} caso={caso} onMensagensChange={setMensagens} mensagensIniciais={progressoRestauradoRef.current?.mensagens} />
            </div>
          </div>
          <div className={abaAtiva === "exame" ? "block" : "hidden"}>
            {caso.tipoPaciente === "pediatrico" ? (
              <ExameFisicoPediatrico
                caso={caso}
                onAchadoEncontrado={handleNovaManobra}
                achadosEncontrados={manobrasSolicitadas}
                onFechar={() => setAbaAtiva("paciente")}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 text-center text-sm text-slate-600">
                <p className="mb-3">Exame físico visual do paciente adulto.</p>
                <button
                  onClick={() => setModalExameAdultoAberto(true)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-white rounded-xl font-semibold text-sm"
                >
                  🩺 Abrir Exame Físico Visual
                </button>
              </div>
            )}
          </div>
          <div className={abaAtiva === "imagemRadiologica" ? "block" : "hidden"}>
            <OpenIRawImagePanel
              imageUrl={openIImageUrl}
              loading={openILoading}
              error={openIError}
              query={openIQuery}
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
          <div className={abaAtiva === "laboratorio" ? "block" : "hidden"}>
            <LaboratoryPanel caso={caso} onExamViewed={registrarLabVisualizado} />
          </div>
          <div className={abaAtiva === "sinaisVitais" ? "block" : "hidden"}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                <h3 className="font-bold text-slate-800">Sinais Vitais</h3>
              </div>
              <VitalsReassessment
                caso={caso}
                condutaTexto={condutaTexto}
                debugSources={condutaFontes}
                sinaisSolicitados={sinaisVitaisSolicitados}
                onSolicitarEntrada={() => setSinaisVitaisSolicitados(true)}
                reavaliadoMin={vitalsReavaliadoMin}
                onReavaliar={setVitalsReavaliadoMin}
                desabilitado={phase === "feedback"}
              />
            </div>
          </div>

          {/* Blocos fixos no mobile (abaixo das abas dinâmicas) */}
          <FormularioSOAP onSubmit={handleFinalizarAtendimento} onChange={setSOAP} desabilitado={phase === "feedback"} caso={caso} valorInicial={progressoRestauradoRef.current?.soap} />
          <PainelDiagnostico
            onSubmit={handleFinalizarAtendimento}
            onChange={setDiagnostico}
            desabilitado={phase === "feedback"}
            caso={caso}
            valorInicial={progressoRestauradoRef.current?.diagnostico}
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

      {/* Modal Exame Físico Visual do adulto (padrão pediátrico) */}
      {modalExameAdultoAberto && isAdulto && (
        <ExameFisicoAdultoVisual
          caso={caso}
          achadosEncontrados={manobrasSolicitadas}
          onAchadoEncontrado={handleAchadoExameAdulto}
          onFechar={() => setModalExameAdultoAberto(false)}
        />
      )}

      {/* Simulador de ECG — modal fixo (fixed inset-0), montado no nível superior para
          funcionar em qualquer viewport (desktop e tablet/mobile). Gate único menuAtivo. */}
      {menuAtivo === "ecg" && (
        <SimuladorECG
          padrao={caso?.ecg?.padrao}
          caso={caso}
          onClose={() => setMenuAtivo("paciente")}
          onECGGerado={handleECGGerado}
          initialState={ecgSimuladorState}
          onStateChange={setEcgSimuladorState}
        />
      )}
    </div>
  );
}

export default CasoPageContent;
