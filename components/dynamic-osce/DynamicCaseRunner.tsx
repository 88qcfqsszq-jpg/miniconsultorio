"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  DynamicCase,
  DynamicFeedbackResult,
  InterventionId,
  ItemSequencia,
  PatientState,
  TimelineEvent,
  TrendDirection,
} from "@/lib/dynamic-osce/types";
import { avaliarAtrasoTerapiaSalvadora } from "@/lib/dynamic-osce/dynamic-therapeutic-delay-evaluator";
import { applyIntervention, eventoInicial } from "@/lib/dynamic-osce/dynamic-state-engine";
import { gerarFeedbackDinamico } from "@/lib/dynamic-osce/dynamic-feedback-engine";
import { linkRubrica } from "@/lib/dynamic-osce/dynamic-rubric-link";
import {
  checklistComunicacao,
  checklistAnamnese,
  checklistExameFisico,
  checklistExames,
  intervencoesDoCaso,
} from "@/lib/dynamic-osce/dynamic-case-contract";
import DynamicPatientStatePanel from "./DynamicPatientStatePanel";
import DynamicInterventionsPanel from "./DynamicInterventionsPanel";
import DynamicTimelinePanel from "./DynamicTimelinePanel";
import PulseLocalExperimentPanel from "./PulseLocalExperimentPanel";

const ASTHMA_CASE_ID = "dynamic-asthma-severe-adult-001";

interface Props {
  caso: DynamicCase;
  onSair: () => void;
}

// Passo de tempo simulado por ação (minutos).
const PASSO_MIN: Partial<Record<InterventionId, number>> = { reavaliar: 5 };
const PASSO_PADRAO = 3;

function Checklist({
  titulo,
  itens,
  selecionados,
  onToggle,
  disabled,
}: {
  titulo: string;
  itens: string[];
  selecionados: string[];
  onToggle: (item: string) => void;
  disabled?: boolean;
}) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 16,
        background: "#fff",
        border: "1px solid rgba(120,130,180,0.18)",
      }}
    >
      <h3 style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 800, color: "#0b1f4d" }}>{titulo}</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {itens.map((it) => {
          const on = selecionados.includes(it);
          return (
            <button
              key={it}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(it)}
              style={{
                padding: "6px 11px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                cursor: disabled ? "not-allowed" : "pointer",
                border: `1px solid ${on ? "rgba(124,58,237,0.5)" : "rgba(120,130,180,0.25)"}`,
                background: on ? "rgba(124,58,237,0.12)" : "#fff",
                color: on ? "#6d28d9" : "#475569",
              }}
            >
              {on ? "✓ " : ""}
              {it}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DynamicCaseRunner({ caso, onSair }: Props) {
  const estadoInicial = caso.fisiologia.estadoInicial;
  const [estado, setEstado] = useState<PatientState>(estadoInicial);
  const [eventos, setEventos] = useState<TimelineEvent[]>(() => [eventoInicial(estadoInicial)]);
  const [tempo, setTempo] = useState(0);
  const [ultimaTendencia, setUltimaTendencia] = useState<TrendDirection | undefined>();
  const [intervencoesAplicadas, setIntervencoesAplicadas] = useState<InterventionId[]>([]);
  const [erroCritico, setErroCritico] = useState(false);

  const [comunicacaoItens, setComunicacaoItens] = useState<string[]>([]);
  const [anamneseItens, setAnamneseItens] = useState<string[]>([]);
  const [exameItens, setExameItens] = useState<string[]>([]);
  const [examesSolicitados, setExamesSolicitados] = useState<string[]>([]);

  const [feedback, setFeedback] = useState<DynamicFeedbackResult | null>(null);
  const finalizado = feedback !== null;

  const casoExigeDescompressao = caso.intervencoes.intervencoesEssenciais.includes("descompressao_toracica");
  // Sequência unificada (intervenções + exames) mantida em ordem de clique.
  const [sequenciaUnificada, setSequenciaUnificada] = useState<ItemSequencia[]>([]);

  // Responsividade sem CSS global: empilha as colunas em telas estreitas.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const rubrica = useMemo(() => linkRubrica(caso.rubricaId), [caso.rubricaId]);

  function toggle(lista: string[], set: (v: string[]) => void, item: string) {
    set(lista.includes(item) ? lista.filter((x) => x !== item) : [...lista, item]);
  }

  function aplicarIntervencao(id: InterventionId) {
    if (finalizado) return;
    const t = tempo + (PASSO_MIN[id] ?? PASSO_PADRAO);
    const r = applyIntervention(estado, id, t);
    setEstado(r.novoEstado);
    setEventos((prev) => [...prev, ...r.eventos]);
    setTempo(t);
    setUltimaTendencia(r.tendencia);
    setIntervencoesAplicadas((prev) => [...prev, id]);
    setSequenciaUnificada((prev) => [...prev, { tipo: "intervencao" as const, id }]);
    if (r.erroCritico) setErroCritico(true);
  }

  function solicitarExame(nome: string) {
    if (finalizado) return;
    if (!examesSolicitados.includes(nome)) {
      const ehEssencial = caso.exames.examesEssenciais.includes(nome);
      // Alerta imediato quando exame não essencial é pedido antes da descompressão.
      const descompressaoJaFeita = sequenciaUnificada.some(
        (item) => item.tipo === "intervencao" && item.id === "descompressao_toracica"
      );
      const alertaPrioridade = casoExigeDescompressao && !descompressaoJaFeita && !ehEssencial;

      setSequenciaUnificada((prev) => [...prev, { tipo: "exame" as const, nome }]);
      setExamesSolicitados((prev) => [...prev, nome]);
      const t = tempo + 2;
      setTempo(t);
      setEventos((prev) => [
        ...prev,
        {
          id: `exame-${t}-${nome}`,
          tMin: t,
          titulo: `Exame solicitado: ${nome}`,
          detalhe: alertaPrioridade
            ? "⚠️ Exame solicitado antes da intervenção salvadora — aceitável apenas se não atrasar a descompressão."
            : "Resultado incorporado à monitorização.",
          tendencia: alertaPrioridade ? "piora" : "estabilidade",
          tipo: "exame",
        },
      ]);
    }
  }

  function finalizar() {
    if (!rubrica) return;
    const atraso = casoExigeDescompressao
      ? avaliarAtrasoTerapiaSalvadora({
          sequencia: sequenciaUnificada,
          intervencaoSalvadora: "descompressao_toracica",
          examesEssenciais: caso.exames.examesEssenciais,
          examesCriticosAntesDoSalvador: ["radiografia"],
          intervencoesDeAtraso: ["aguardar_exames", "solicitar_rx_torax"],
          limiteToleravel: 2,
        })
      : undefined;
    const resultado = gerarFeedbackDinamico(rubrica, {
      comunicacaoItens,
      anamneseItens,
      exameItens,
      examesSolicitados,
      intervencoesAplicadas,
      estadoInicial,
      estadoFinal: estado,
      eventos,
      erroCriticoRegistrado: erroCritico || (atraso?.deveGerarErroCritico ?? false),
      atrasoTerapiaSalvadora: atraso,
    });
    setEventos((prev) => [
      ...prev,
      {
        id: `fim-${tempo}`,
        tMin: tempo,
        titulo: "Beta finalizado",
        detalhe: `Nota da rubrica dinâmica: ${resultado.nota}/${resultado.total}.`,
        tendencia: "estabilidade",
        tipo: "fim",
      },
    ]);
    setFeedback(resultado);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Cabeçalho do runner */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <button
            type="button"
            onClick={onSair}
            style={{
              padding: "6px 12px",
              borderRadius: 10,
              border: "1px solid rgba(120,130,180,0.3)",
              background: "#fff",
              color: "#475569",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              marginBottom: 8,
            }}
          >
            ← Voltar à lista
          </button>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0b1f4d" }}>{caso.identificacao.titulo}</h2>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "#5c6d8a" }}>
            {caso.identificacao.especialidade} · {caso.diagnostico.diagnosticoPrincipal} · motor: {caso.simulacao.simulationProvider}
          </p>
        </div>
        {!finalizado && (
          <button
            type="button"
            onClick={finalizar}
            style={{
              padding: "11px 18px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(120deg, #7c3aed, #4f46e5)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Finalizar Beta
          </button>
        )}
      </div>

      {/* Grid principal: estado + interações | timeline */}
      <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "minmax(0, 1fr) minmax(0, 320px)", gap: 16, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <DynamicPatientStatePanel estado={estado} tendencia={ultimaTendencia} />

          {caso.identificacao.caseId === ASTHMA_CASE_ID && (
            <PulseLocalExperimentPanel conditionId="asthma-severe-adult" severity={0.75} duration_s={580} />
          )}

          {!finalizado && (
            <>
              <Checklist
                titulo="Comunicação (auto-registro)"
                itens={checklistComunicacao(caso)}
                selecionados={comunicacaoItens}
                onToggle={(i) => toggle(comunicacaoItens, setComunicacaoItens, i)}
              />
              <Checklist
                titulo="Anamnese (auto-registro)"
                itens={checklistAnamnese(caso)}
                selecionados={anamneseItens}
                onToggle={(i) => toggle(anamneseItens, setAnamneseItens, i)}
              />
              <Checklist
                titulo="Exame físico (auto-registro)"
                itens={checklistExameFisico(caso)}
                selecionados={exameItens}
                onToggle={(i) => toggle(exameItens, setExameItens, i)}
              />
              <Checklist
                titulo="Exames complementares (solicitar)"
                itens={checklistExames(caso)}
                selecionados={examesSolicitados}
                onToggle={(i) => solicitarExame(i)}
              />
              <DynamicInterventionsPanel
                intervencoes={intervencoesDoCaso(caso)}
                onAplicar={aplicarIntervencao}
              />
            </>
          )}

          {finalizado && feedback && <FeedbackView feedback={feedback} />}
        </div>

        <DynamicTimelinePanel eventos={eventos} />
      </div>
    </div>
  );
}

function FeedbackView({ feedback }: { feedback: DynamicFeedbackResult }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          padding: 18,
          borderRadius: 16,
          background: "linear-gradient(145deg, rgba(124,58,237,0.10), rgba(79,70,229,0.06))",
          border: "1px solid rgba(124,58,237,0.22)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontSize: 30, fontWeight: 800, color: "#5b21b6" }}>
            {feedback.nota}
            <span style={{ fontSize: 16, color: "#7c3aed" }}>/{feedback.total}</span>
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#6d28d9" }}>{feedback.classificacao}</span>
        </div>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#7c3aed" }}>
          Feedback da rubrica dinâmica piloto (beta) — independente do feedback OSCE principal.
        </p>
      </div>

      {feedback.errosCriticos.length > 0 && (
        <div style={{ padding: 14, borderRadius: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
          <strong style={{ color: "#b91c1c", fontSize: 13 }}>Erro crítico</strong>
          <ul style={{ margin: "6px 0 0", paddingLeft: 18, color: "#dc2626", fontSize: 12 }}>
            {feedback.errosCriticos.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {feedback.dominios.map((d) => (
        <div key={d.nome} style={{ padding: 14, borderRadius: 12, background: "#fff", border: "1px solid rgba(120,130,180,0.18)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <strong style={{ fontSize: 13, color: "#0b1f4d" }}>{d.nome}</strong>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#6d28d9" }}>
              {d.obtido}/{d.maximo}
            </span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 3 }}>
            {d.itens.map((it) => (
              <li key={it.descricao} style={{ fontSize: 12, color: it.cumprido ? "#15803d" : "#94a3b8" }}>
                {it.cumprido ? "✓" : "○"} {it.descricao}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
