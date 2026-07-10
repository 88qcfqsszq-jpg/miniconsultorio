"use client";

import { useState, useMemo, useCallback } from "react";
import { ManobraRealizada } from "@/lib/types";
import {
  MAPA_EXAME_ADULTO,
  HOTSPOTS_ADULTO,
  resolverSelecao,
  getDescricaoTecnicaNormal,
  getTipoManobra,
  ORDEM_CAMINHOS,
  type AcaoExameAdulto,
} from "@/lib/adulto/exame-fisico-adulto-mapa";
import { getAchadoPorCaso } from "@/lib/adulto/exame-fisico-adulto-achados-por-caso";
import PulmonaryAuscultationPanel, {
  type AchadoAusculta,
} from "@/components/ausculta/PulmonaryAuscultationPanel";
import CardiacAuscultationPanel, {
  type AchadoAuscultaCardiaca,
} from "@/components/ausculta/CardiacAuscultationPanel";

// Ações de ausculta pulmonar que abrem o painel interativo (em vez de registro direto)
const ACOES_AUSCULTA_PULMONAR = new Set(["auscultar_anterior", "auscultar_posterior"]);
// Ação de ausculta cardíaca (focos) que abre o painel cardíaco interativo
const ACOES_AUSCULTA_CARDIACA = new Set(["auscultar_focos"]);

interface VisualAction {
  label: string;
  caminho: string;
  tipo: string;
  visualAsset?: string;
}

interface ExameFisicoAdultoVisualProps {
  caso: any;
  onAchadoEncontrado: (manobra: ManobraRealizada) => void;
  achadosEncontrados: ManobraRealizada[];
  onFechar: () => void;
}

const PREFIXO_VISUAL = "[Exame Visual]";

function imagemBoneco(caso: any): string {
  const sexo = (
    caso?.sexo ||
    caso?.dados_visiveis_ao_estudante?.sexo ||
    caso?.paciente?.sexo ||
    ""
  )
    .toString()
    .toLowerCase();
  return sexo.startsWith("f")
    ? "/images/boneco/feminino-frontal-realista.png"
    : "/images/boneco/boneco-frente.png";
}

export default function ExameFisicoAdultoVisual({
  caso,
  onAchadoEncontrado,
  achadosEncontrados,
  onFechar,
}: ExameFisicoAdultoVisualProps) {
  const [activeMainTab, setActiveMainTab] = useState<string>(
    MAPA_EXAME_ADULTO[0].id
  );
  const [activeHeadSubtab, setActiveHeadSubtab] = useState<string>("face_cranio");
  const [activeThoraxSubtab, setActiveThoraxSubtab] = useState<string>(
    "cardiovascular"
  );
  const [activeVascularSubtab, setActiveVascularSubtab] = useState<string>(
    "membros_superiores"
  );
  // Última ação clicada, exibida no box VISUALIZAÇÃO
  const [selectedVisualAction, setSelectedVisualAction] =
    useState<VisualAction | null>(null);
  // Ausculta pulmonar interativa ativa no box VISUALIZAÇÃO
  const [auscultaPulmonarAtiva, setAuscultaPulmonarAtiva] = useState(false);
  // Ausculta cardíaca interativa ativa no box VISUALIZAÇÃO
  const [auscultaCardiacaAtiva, setAuscultaCardiacaAtiva] = useState(false);

  // Registra um achado vindo do painel de ausculta pulmonar (mesma cadeia: → HealthBench)
  const registrarAusculta = useCallback(
    (a: AchadoAusculta) => {
      const textDigitado = a.textoRegistro;
      if (achadosEncontrados.some((m) => m.textDigitado === textDigitado)) return;
      const manobra: ManobraRealizada = {
        id: `ausculta-pulmonar-${Date.now()}`,
        categoria: "respiratorio",
        textDigitado,
        resposta: a.resposta,
        timestamp: new Date(),
      };
      onAchadoEncontrado(manobra);
    },
    [achadosEncontrados, onAchadoEncontrado]
  );

  // Registra um achado vindo do painel de ausculta CARDÍACA (mesma cadeia → HealthBench)
  const registrarAuscultaCardiaca = useCallback(
    (a: AchadoAuscultaCardiaca) => {
      const textDigitado = a.textoRegistro;
      if (achadosEncontrados.some((m) => m.textDigitado === textDigitado)) return;
      const manobra: ManobraRealizada = {
        id: `ausculta-cardiaca-${Date.now()}`,
        categoria: "cardiovascular",
        textDigitado,
        resposta: a.resposta,
        timestamp: new Date(),
      };
      onAchadoEncontrado(manobra);
    },
    [achadosEncontrados, onAchadoEncontrado]
  );
  // Achados marcados pelo estudante como alteração (apenas interação visual nesta fase)
  const [achadosAlterados, setAchadosAlterados] = useState<string[]>([]);

  const toggleAchadoAlterado = useCallback((chave: string) => {
    setAchadosAlterados((prev) =>
      prev.includes(chave)
        ? prev.filter((c) => c !== chave)
        : [...prev, chave]
    );
  }, []);

  const aba = useMemo(
    () =>
      MAPA_EXAME_ADULTO.find((x) => x.id === activeMainTab) ??
      MAPA_EXAME_ADULTO[0],
    [activeMainTab]
  );

  // Subaba efetiva conforme a aba principal selecionada
  const subAbaEfetiva =
    activeMainTab === "cabeca"
      ? activeHeadSubtab
      : activeMainTab === "torax"
        ? activeThoraxSubtab
        : activeMainTab === "vascular_membros"
          ? activeVascularSubtab
          : null;

  const { acoes, categoria, caminho } = useMemo(
    () => resolverSelecao(activeMainTab, subAbaEfetiva),
    [activeMainTab, subAbaEfetiva]
  );

  const registrosVisuais = useMemo(
    () =>
      achadosEncontrados.filter((m) =>
        (m.textDigitado || "").startsWith(PREFIXO_VISUAL)
      ),
    [achadosEncontrados]
  );

  const selecionarHotspot = useCallback(
    (mainTab: string, subTab?: string) => {
      setActiveMainTab(mainTab);
      if (subTab) {
        if (mainTab === "cabeca") setActiveHeadSubtab(subTab);
        else if (mainTab === "torax") setActiveThoraxSubtab(subTab);
        else if (mainTab === "vascular_membros") setActiveVascularSubtab(subTab);
      }
    },
    []
  );

  const registrarAcao = useCallback(
    (acao: AcaoExameAdulto) => {
      // VISUALIZAÇÃO sempre reflete a última ação clicada (mesmo se já registrada)
      setSelectedVisualAction({
        label: acao.label,
        caminho,
        tipo: getTipoManobra(acao.label),
        visualAsset: acao.visualAsset,
      });

      const textDigitado = `${PREFIXO_VISUAL} ${caminho} — ${acao.label}`;
      // Evitar duplicar registros idênticos
      const jaExiste = achadosEncontrados.some(
        (m) => m.textDigitado === textDigitado
      );
      if (jaExiste) return;

      // Fase 2: achado depende do caso ativo; fallback no normal genérico
      const resposta =
        getAchadoPorCaso(caso?.id, acao.id) ?? getDescricaoTecnicaNormal(acao.id);

      const manobra: ManobraRealizada = {
        id: `adulto-visual-${Date.now()}`,
        categoria,
        textDigitado,
        resposta,
        timestamp: new Date(),
      };
      onAchadoEncontrado(manobra);
    },
    [caminho, categoria, achadosEncontrados, onAchadoEncontrado, caso]
  );

  // Clique numa ação: ausculta pulmonar abre o painel interativo E registra a
  // ação principal imediatamente (botão fica ✓ no clique, antes de tocar os pontos).
  // O registro reaproveita o mesmo fluxo das demais ações (registrarAcao), que já
  // tica o botão e tem deduplicação. O label ("Auscultar tórax anterior/posterior")
  // preserva o eixo no textDigitado, necessário p/ rubrica de pneumonia/PAC.
  const handleClicarAcao = useCallback(
    (acao: AcaoExameAdulto) => {
      if (ACOES_AUSCULTA_PULMONAR.has(acao.id)) {
        setAuscultaCardiacaAtiva(false);
        setAuscultaPulmonarAtiva(true);
        registrarAcao(acao); // marca ✓ + entra em REGISTROS/manobrasSolicitadas/physicalExamEvents
        return;
      }
      if (ACOES_AUSCULTA_CARDIACA.has(acao.id)) {
        setAuscultaPulmonarAtiva(false);
        setAuscultaCardiacaAtiva(true);
        registrarAcao(acao);
        return;
      }
      setAuscultaPulmonarAtiva(false);
      setAuscultaCardiacaAtiva(false);
      registrarAcao(acao);
    },
    [registrarAcao]
  );

  // Agrupa os registros por caminho (região/subaba), na ordem canônica
  const gruposRegistrados = useMemo(() => {
    const map = new Map<
      string,
      { acao: string; descricao: string; chave: string }[]
    >();
    for (const m of registrosVisuais) {
      const semPrefixo = (m.textDigitado || "").replace(`${PREFIXO_VISUAL} `, "");
      const partes = semPrefixo.split(" — ");
      const cam = partes[0] ?? semPrefixo;
      const acaoLabel = partes[1] ?? "";
      if (!map.has(cam)) map.set(cam, []);
      map.get(cam)!.push({
        acao: acaoLabel,
        descricao: m.resposta || "",
        chave: m.textDigitado || "",
      });
    }
    const ordenados = [...map.entries()].sort(
      (a, b) => ORDEM_CAMINHOS.indexOf(a[0]) - ORDEM_CAMINHOS.indexOf(b[0])
    );
    return ordenados;
  }, [registrosVisuais]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:pl-[120px]">
      {/* Fundo com gradiente radial */}
      <div
        className="absolute inset-0 -z-10 rounded-3xl"
        style={{
          background: `
            radial-gradient(circle at 30% 20%, rgba(147,197,253,0.45), transparent 35%),
            radial-gradient(circle at 70% 30%, rgba(196,181,253,0.35), transparent 35%),
            linear-gradient(135deg, #eef6ff 0%, #f8f7ff 50%, #eefcfb 100%)
          `,
        }}
      />

      {/* Modal principal */}
      <div
        className="relative w-full max-w-[90vw] lg:max-w-[calc(100vw-120px-2rem)] h-[85vh] flex flex-col bg-white/45 backdrop-blur-xl rounded-3xl border border-white/60 overflow-hidden"
        style={{ boxShadow: "0 20px 60px rgba(15,23,42,0.12)" }}
      >
        {/* CABEÇALHO AZUL */}
        <div className="flex flex-col bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 border-b border-blue-800/30">
          {/* Linha 1: Título e badge */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-4 sm:py-5">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">
                Exame Físico Adulto Visual
              </h1>
              <p className="text-xs text-blue-100 mt-0.5">
                Avaliação sistematizada com imagem interativa
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <span className="text-xs sm:text-sm font-semibold text-white">
                  Adulto
                </span>
              </div>
              <button
                onClick={onFechar}
                aria-label="Fechar exame físico"
                className="p-2 hover:bg-white/20 rounded-xl transition-all"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-white"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Linha 2: Abas principais */}
          <div
            className="px-6 sm:px-8 flex gap-2 overflow-x-auto scrollbar-hide"
            style={{ scrollBehavior: "smooth" }}
          >
            {MAPA_EXAME_ADULTO.map((x) => (
              <button
                key={x.id}
                onClick={() => setActiveMainTab(x.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg border transition-all text-xs font-medium ${
                  activeMainTab === x.id
                    ? "bg-white text-blue-700 border-white shadow-sm"
                    : "bg-white/10 text-white border-white/25 hover:bg-white/20"
                }`}
                title={x.label}
              >
                {x.label}
              </button>
            ))}
          </div>

          {/* Linha 3: Subabas (condicional, menores que as abas principais) */}
          {aba.subabas && aba.subabas.length > 0 ? (
            <div className="px-6 sm:px-8 pt-2 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
              {aba.subabas.map((s) => {
                const ativa = subAbaEfetiva === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      if (activeMainTab === "cabeca") setActiveHeadSubtab(s.id);
                      else if (activeMainTab === "torax")
                        setActiveThoraxSubtab(s.id);
                      else setActiveVascularSubtab(s.id);
                    }}
                    className={`whitespace-nowrap px-3 py-1 rounded-md border transition-all text-[11px] font-medium ${
                      ativa
                        ? "bg-sky-100 text-blue-800 border-sky-200"
                        : "bg-white/5 text-blue-50 border-white/20 hover:bg-white/15"
                    }`}
                    title={s.label}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="pb-3" />
          )}
        </div>

        {/* CORPO PRINCIPAL - 3 COLUNAS */}
        <div
          className="flex-1 grid gap-4 overflow-hidden p-4"
          style={{ gridTemplateColumns: "380px 260px 1fr" }}
        >
          {/* COLUNA 1: IMAGEM DO PACIENTE */}
          <div
            className="relative flex items-center justify-center bg-white/35 backdrop-blur-lg rounded-2xl border border-white/60 overflow-hidden"
            style={{ boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagemBoneco(caso)}
                alt="Corpo adulto"
                className="max-h-[68vh] w-auto object-contain"
                draggable={false}
              />
            </div>

            {/* Hotspots overlay (pontos discretos por aba/subaba) */}
            <div className="absolute inset-0 pointer-events-none">
              {HOTSPOTS_ADULTO.map((h) => {
                const isSelected =
                  h.mainTab === activeMainTab &&
                  (!h.subTab || h.subTab === subAbaEfetiva);
                return (
                  <button
                    key={`${h.mainTab}-${h.subTab ?? "main"}`}
                    onClick={() => selecionarHotspot(h.mainTab, h.subTab)}
                    aria-label={`Região: ${h.label}`}
                    className="absolute flex items-center justify-center pointer-events-auto cursor-pointer transition-all group"
                    style={{
                      left: `${h.x}%`,
                      top: `${h.y}%`,
                      minWidth: "44px",
                      minHeight: "44px",
                      transform: "translate(-50%, -50%)",
                    }}
                    title={h.label}
                  >
                    <div
                      className={`rounded-full transition-all pointer-events-none border border-white shadow-sm ${
                        isSelected
                          ? "bg-blue-600 ring-4 ring-blue-300/40"
                          : "bg-blue-500/70 group-hover:scale-110 group-hover:ring-4 group-hover:ring-blue-200/40"
                      }`}
                      style={{ width: "13px", height: "13px" }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* COLUNA 2: AÇÕES */}
          <div
            className="flex flex-col bg-white/45 backdrop-blur-xl rounded-2xl border border-white/60 overflow-hidden"
            style={{ boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}
          >
            <div className="px-4 py-3 bg-white/50 border-b border-white/30">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Ações
              </h3>
              <p className="text-xs text-slate-600 mt-1">{caminho}</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {acoes.length > 0 ? (
                <div className="p-3 space-y-2">
                  {acoes.map((acao) => {
                    const jaRegistrada = achadosEncontrados.some(
                      (m) =>
                        m.textDigitado ===
                        `${PREFIXO_VISUAL} ${caminho} — ${acao.label}`
                    );
                    return (
                      <button
                        key={acao.id}
                        onClick={() => handleClicarAcao(acao)}
                        className={`w-full text-left px-3 py-2 rounded-lg border transition-all text-xs flex items-center justify-between gap-2 ${
                          jaRegistrada
                            ? "bg-blue-50/70 border-blue-200/60 text-blue-900"
                            : "bg-white/40 hover:bg-blue-100/60 border-white/30 text-slate-800"
                        }`}
                      >
                        <span>{acao.label}</span>
                        {jaRegistrada && (
                          <span className="text-blue-600 font-bold shrink-0">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 text-xs text-slate-500 italic">
                  Nenhuma ação
                </div>
              )}
            </div>
          </div>

          {/* COLUNA 3: REGISTROS + VISUALIZAÇÃO (lado a lado) */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4 overflow-hidden">
            {/* REGISTROS */}
            <div
              className="flex flex-col bg-white/45 backdrop-blur-xl rounded-2xl border border-white/60 overflow-hidden"
              style={{ boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}
            >
              <div className="px-4 py-3 bg-white/50 border-b border-white/30">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Registros
                </h4>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {registrosVisuais.length > 0 ? (
                  <div className="space-y-3">
                    {gruposRegistrados.map(([cam, itens]) => (
                      <div key={cam}>
                        <p className="text-xs font-semibold text-blue-800">
                          {cam}:
                        </p>
                        <ul className="mt-1 space-y-0.5">
                          {itens.map((it, i) => {
                            const alterado = achadosAlterados.includes(it.chave);
                            return (
                              <li key={i}>
                                <button
                                  type="button"
                                  onClick={() => toggleAchadoAlterado(it.chave)}
                                  title="Clique para marcar/desmarcar como alteração"
                                  className={`block w-full text-left text-xs leading-relaxed break-words pl-3 -indent-2 cursor-pointer ${
                                    alterado ? "text-red-600" : "text-slate-700"
                                  }`}
                                >
                                  – {it.descricao}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic text-xs">
                    Nenhuma manobra realizada ainda.
                  </p>
                )}
              </div>
            </div>

            {/* VISUALIZAÇÃO */}
            <div
              className="flex flex-col bg-white/45 backdrop-blur-xl rounded-2xl border border-white/60 overflow-hidden"
              style={{ boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}
            >
              <div className="px-4 py-3 bg-white/50 border-b border-white/30">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Visualização
                </h4>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {auscultaCardiacaAtiva ? (
                  <CardiacAuscultationPanel
                    caso={caso}
                    onRegistrarAchado={registrarAuscultaCardiaca}
                    onClose={() => setAuscultaCardiacaAtiva(false)}
                  />
                ) : auscultaPulmonarAtiva ? (
                  <PulmonaryAuscultationPanel
                    caso={caso}
                    onRegistrarAchado={registrarAusculta}
                    onClose={() => setAuscultaPulmonarAtiva(false)}
                  />
                ) : selectedVisualAction ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {selectedVisualAction.label}
                      </p>
                      <p className="text-xs text-blue-800 mt-0.5">
                        {selectedVisualAction.caminho}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Tipo: {selectedVisualAction.tipo}
                      </p>
                    </div>

                    {/* Área de imagem (ou placeholder) */}
                    {selectedVisualAction.visualAsset ? (
                      <div className="w-full rounded-lg border border-slate-200/60 bg-white/50 overflow-hidden flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedVisualAction.visualAsset}
                          alt={selectedVisualAction.label}
                          className="max-w-full max-h-48 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-32 rounded-lg border border-dashed border-slate-300/70 bg-white/40 flex items-center justify-center text-center px-3">
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Imagem específica será exibida nesta área quando o
                          banco visual estiver disponível.
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-slate-600">
                      Visualização da manobra selecionada.
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-500 italic text-xs">
                    Clique em uma ação para visualizar a manobra.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
