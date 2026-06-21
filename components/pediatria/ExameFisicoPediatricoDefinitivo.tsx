"use client";

import { useState, useCallback, useMemo } from "react";
import { Caso } from "@/lib/types";
import {
  REGIOES_EXAME_PEDIATRICO,
  FAIXAS_ETARIAS_PEDIATRICAS,
  FaixaEtariaPediatrica,
  AchadoExamePediatrico,
  AcaoExamePediatrico,
} from "@/lib/pediatria/exame-fisico-pediatrico-banco";
import {
  gerarAchadoExamePediatrico,
  obterFaixaEtariaDoCaso,
} from "@/lib/pediatria/exame-fisico-pediatrico-adaptador";
import { obterMidiaExamePediatrico } from "@/lib/pediatria/exame-fisico-pediatrico-midias";
import {
  obterImagemAchadoPediatrico,
  type ImagemAchadoPediatrico,
} from "@/lib/pediatria/imagens-achados";

interface Props {
  caso: Caso;
  onRegistrarAchado?: (achado: AchadoExamePediatrico) => void;
  onFechar?: () => void;
}

export default function ExameFisicoPediatricoDefinitivo({
  caso,
  onRegistrarAchado,
  onFechar,
}: Props) {
  const faixaEtaria = useMemo(() => obterFaixaEtariaDoCaso(caso), [caso]);
  const imagemFrontal = FAIXAS_ETARIAS_PEDIATRICAS[faixaEtaria].imagemFrontal;

  const [regiaoSelecionada, setRegiaoSelecionada] = useState<string>(
    REGIOES_EXAME_PEDIATRICO[0].id
  );
  const [achadosRegistrados, setAchadosRegistrados] = useState<
    AchadoExamePediatrico[]
  >([]);
  const [achadoAtual, setAchadoAtual] = useState<AchadoExamePediatrico | null>(
    null
  );
  const [acaoSelecionada, setAcaoSelecionada] = useState<AcaoExamePediatrico | null>(
    null
  );
  const [imagemAchadoSelecionada, setImagemAchadoSelecionada] = useState<ImagemAchadoPediatrico | null>(
    null
  );
  const [imagemAchadoErro, setImagemAchadoErro] = useState(false);

  // Obter regiões e ações da região selecionada
  const regiao = REGIOES_EXAME_PEDIATRICO.find((r) => r.id === regiaoSelecionada);
  const acoesFaixa = useMemo(() => {
    if (!regiao) return [];
    return regiao.acoes.filter((acao) => acao.faixas.includes(faixaEtaria));
  }, [regiao, faixaEtaria]);

  // Obter mídia da ação atual
  const midia = acaoSelecionada ? obterMidiaExamePediatrico(regiaoSelecionada, acaoSelecionada.id) : null;

  // Determinar se deve mostrar coluna Exame Interativo
  const deveMostrarExameInterativo = !!(imagemAchadoSelecionada || midia);

  // Manipulador de clique em ação
  const handleClicarAcao = useCallback(
    (acao: AcaoExamePediatrico) => {
      const achado = gerarAchadoExamePediatrico({
        caso,
        regiaoId: regiaoSelecionada,
        acaoId: acao.id,
      });
      setAchadoAtual(achado);
      setAcaoSelecionada(acao);

      // Buscar imagem do achado se estiver cadastrada
      const imagemAchado = obterImagemAchadoPediatrico(achado.imagemAchadoId);

      if (imagemAchado) {
        setImagemAchadoSelecionada(imagemAchado);
        setImagemAchadoErro(false);
      } else {
        setImagemAchadoSelecionada(null);
        setImagemAchadoErro(false);
      }
    },
    [caso, regiaoSelecionada]
  );

  // Manipulador de registro de achado
  const handleRegistrarAchado = useCallback(() => {
    if (achadoAtual) {
      setAchadosRegistrados((prev) => [...prev, achadoAtual]);
      if (onRegistrarAchado) {
        onRegistrarAchado(achadoAtual);
      }
      setAchadoAtual(null);
    }
  }, [achadoAtual, onRegistrarAchado]);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
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
      <div className="relative w-[90vw] h-[85vh] flex flex-col bg-white/45 backdrop-blur-xl rounded-3xl border border-white/60 overflow-hidden" style={{
        boxShadow: "0 20px 60px rgba(15,23,42,0.12)"
      }}>
        {/* CABEÇALHO AZUL */}
        <div className="flex flex-col bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 border-b border-blue-800/30">
          {/* Linha 1: Título e Faixa etária */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-4 sm:py-5">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">
                Exame Físico Pediátrico Visual
              </h1>
              <p className="text-xs text-blue-100 mt-0.5">
                Avaliação sistematizada da criança
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <span className="text-xs sm:text-sm font-semibold text-white">
                  {FAIXAS_ETARIAS_PEDIATRICAS[faixaEtaria].label}
                </span>
              </div>
              {onFechar && (
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
              )}
            </div>
          </div>

          {/* Linha 2: Botões de regiões */}
          <div className="px-6 sm:px-8 pb-3 flex gap-2 overflow-x-auto scrollbar-hide" style={{
            scrollBehavior: "smooth"
          }}>
            {REGIOES_EXAME_PEDIATRICO.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setRegiaoSelecionada(r.id);
                  setAchadoAtual(null);
                  setImagemAchadoSelecionada(null);
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg border transition-all text-xs font-medium ${
                  regiaoSelecionada === r.id
                    ? "bg-white text-blue-700 border-white shadow-sm"
                    : "bg-white/10 text-white border-white/25 hover:bg-white/20"
                }`}
                title={r.label}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* CORPO PRINCIPAL - 3 OU 4 COLUNAS */}
        <div className="flex-1 grid gap-4 overflow-hidden p-4" style={{
          gridTemplateColumns: deveMostrarExameInterativo
            ? "380px 225px 320px 1fr"
            : "380px 225px 320px"
        }}>
          {/* COLUNA 1: IMAGEM DO PACIENTE */}
          <div className="relative flex items-center justify-center bg-white/35 backdrop-blur-lg rounded-2xl border border-white/60 overflow-hidden" style={{
            boxShadow: "0 8px 24px rgba(15,23,42,0.08)"
          }}>
            <div className="absolute inset-0 flex items-center justify-center p-1.5">
              <img
                src={imagemFrontal}
                alt={`Corpo ${faixaEtaria}`}
                className="max-h-[68vh] w-auto object-contain"
              />
            </div>

            {/* Hotspots overlay */}
            <div className="absolute inset-0 pointer-events-none">
                {REGIOES_EXAME_PEDIATRICO.map((r) => {
                  const hotspot = r.hotspots[faixaEtaria];
                  if (!hotspot) return null;

                  const isSelected = r.id === regiaoSelecionada;

                  // Offset para regiões sobrepostas na face/cabeça
                  const offsetMap: Record<string, { x: number; y: number }> = {
                    cabeca_perimetro: { x: 0, y: -12 },
                    face_olhos: { x: 0, y: 0 },
                    orl_orofaringe: { x: 0, y: 8 },
                    pescoco_linfonodos: { x: 16, y: 12 },
                    estado_geral: { x: -20, y: 16 },
                    desenvolvimento: { x: 20, y: 16 },
                  };

                  const offset = offsetMap[r.id] || { x: 0, y: 0 };

                  return (
                    <button
                      key={r.id}
                      onClick={() => setRegiaoSelecionada(r.id)}
                      aria-label={`Região: ${r.label}`}
                      className="absolute flex items-center justify-center pointer-events-auto cursor-pointer transition-all group"
                      style={{
                        left: `calc(${hotspot.x}% + ${offset.x}px)`,
                        top: `calc(${hotspot.y}% + ${offset.y}px)`,
                        minWidth: "44px",
                        minHeight: "44px",
                        transform: "translate(-50%, -50%)",
                      }}
                      title={r.label}
                    >
                      {/* Marca visual - reduzida para 12-14px */}
                      <div
                        className={`rounded-full transition-all pointer-events-none border border-white shadow-sm ${
                          isSelected
                            ? "bg-blue-600 ring-4 ring-blue-300/40"
                            : "bg-blue-500/70 group-hover:scale-110 group-hover:ring-4 group-hover:ring-blue-200/40"
                        }`}
                        style={{
                          width: "13px",
                          height: "13px",
                        }}
                      />
                    </button>
                  );
                })}
              </div>
          </div>

          {/* COLUNA 2: AÇÕES */}
          <div className="flex flex-col bg-white/45 backdrop-blur-xl rounded-2xl border border-white/60 overflow-hidden" style={{
            boxShadow: "0 8px 24px rgba(15,23,42,0.08)"
          }}>
              <div className="px-4 py-3 bg-white/50 border-b border-white/30">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Ações
                </h3>
                {regiao && (
                  <p className="text-xs text-slate-600 mt-1">{regiao.label}</p>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {acoesFaixa.length > 0 ? (
                  <div className="p-3 space-y-2">
                    {acoesFaixa.map((acao) => (
                      <button
                        key={acao.id}
                        onClick={() => handleClicarAcao(acao)}
                        className="w-full text-left px-3 py-2 bg-white/40 hover:bg-blue-100/60 rounded-lg border border-white/30 transition-all text-xs group"
                      >
                        <div className="font-medium text-slate-800 group-hover:text-blue-900">
                          {acao.label}
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          {acao.metodo}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-xs text-slate-500 italic">
                    Nenhuma ação
                  </div>
                )}
              </div>
            </div>

          {/* COLUNA 3: ACHADOS */}
          <div className="flex flex-col gap-4 overflow-hidden">
            {/* PAINEL ACHADO ATUAL */}
            {achadoAtual ? (
              <div className="flex flex-col bg-gradient-to-b from-green-100/35 to-emerald-100/30 backdrop-blur-xl rounded-2xl border border-green-200/50 overflow-hidden" style={{
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)"
              }}>
                <div className="p-4">
                <h4 className="text-xs font-bold text-green-900 uppercase tracking-wide mb-2">
                  Achado Atual
                </h4>

                  <div className="space-y-2 mb-3 text-xs">
                    <div>
                      <span className="font-semibold text-green-900">Título:</span>
                      <p className="text-slate-800">{achadoAtual.titulo}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-green-900">Desc:</span>
                      <p className="text-slate-800 text-xs leading-relaxed whitespace-normal break-words">
                        {achadoAtual.descricao}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          achadoAtual.normal
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {achadoAtual.normal ? "Normal" : "Alterado"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleRegistrarAchado}
                    className="w-full px-3 py-2 bg-green-500 text-white rounded-lg font-semibold text-xs hover:bg-green-600 transition-all"
                  >
                    ✓ Registrar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col bg-slate-100/30 backdrop-blur-xl rounded-2xl border border-slate-200/40 overflow-hidden" style={{
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)"
              }}>
                <div className="p-4 text-center">
                  <p className="text-xs text-slate-600">
                    Clique em uma ação para ver o achado
                  </p>
                </div>
              </div>
            )}

            {/* PAINEL REGISTRADOS */}
            <div className="flex-1 flex flex-col bg-white/45 backdrop-blur-xl rounded-2xl border border-white/60 overflow-hidden" style={{
              boxShadow: "0 8px 24px rgba(15,23,42,0.08)"
            }}>
              <div className="px-4 py-3 bg-white/50 border-b border-white/30">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Registrados ({achadosRegistrados.length})
                </h4>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                {achadosRegistrados.length > 0 ? (
                  <div className="space-y-3">
                    {achadosRegistrados.map((achado, idx) => {
                      const regiao = REGIOES_EXAME_PEDIATRICO.find((r) => r.id === achado.regiaoId);
                      const acao = regiao?.acoes.find((a) => a.id === achado.acaoId);

                      return (
                        <div
                          key={idx}
                          className="border border-blue-200/50 rounded-lg p-3 bg-blue-50/60 text-xs space-y-2"
                        >
                          {/* Título da ação */}
                          <div className="font-semibold text-slate-900">
                            {acao?.label || achado.titulo}
                          </div>

                          {/* Região */}
                          <div className="text-slate-600 text-xs">
                            {regiao?.label || achado.regiaoId}
                          </div>

                          {/* Descrição completa */}
                          <div className="text-slate-700 text-xs leading-relaxed max-h-24 overflow-y-auto">
                            {achado.descricao}
                          </div>

                          {/* Ação realizada */}
                          {acao?.label && (
                            <div className="text-slate-600 text-xs italic border-t border-blue-200/30 pt-1">
                              Ação: {acao.label}
                            </div>
                          )}

                          {/* Status */}
                          <div className="flex gap-1">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                achado.normal
                                  ? "bg-green-200 text-green-800"
                                  : "bg-red-200 text-red-800"
                              }`}
                            >
                              {achado.normal ? "✓ Normal" : "⚠ Alterado"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 italic text-xs">
                    Nenhum achado registrado
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* COLUNA 4: EXAME INTERATIVO - CONDICIONAL - RENDERIZADO À DIREITA */}
          {deveMostrarExameInterativo && (
          <div className="flex flex-col bg-white/45 backdrop-blur-xl rounded-2xl border border-white/60 overflow-hidden" style={{
            boxShadow: "0 8px 24px rgba(15,23,42,0.08)"
          }}>
            <div className="px-4 py-3 bg-white/50 border-b border-white/30">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Exame Interativo
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-start">
              {acaoSelecionada ? (
                (() => {
                  // Prioridade 1: Imagem do achado
                  if (imagemAchadoSelecionada) {
                    return (
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-semibold text-blue-900">
                            {imagemAchadoSelecionada.titulo}
                          </h4>
                          <button
                            onClick={() => setImagemAchadoSelecionada(null)}
                            className="p-1 hover:bg-blue-100/40 rounded-lg transition-all"
                            title="Fechar imagem"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-slate-600"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>

                        <div className="w-full h-40 bg-slate-100/50 rounded-lg flex items-center justify-center border border-slate-200/50 overflow-hidden">
                          <img
                            src={imagemAchadoSelecionada.src}
                            alt={imagemAchadoSelecionada.alt}
                            className="max-w-full max-h-full object-contain"
                            onError={() => setImagemAchadoErro(true)}
                          />
                        </div>

                        {imagemAchadoErro && (
                          <p className="text-xs text-amber-700 bg-amber-50/50 rounded-lg p-2 border border-amber-200/50">
                            Imagem ainda não disponível. Verifique o arquivo em /public/images/pediatria/achados/
                          </p>
                        )}

                        <p className="text-xs text-slate-700 leading-relaxed">
                          {imagemAchadoSelecionada.descricao}
                        </p>

                        <div className="mt-2 text-xs text-blue-600 font-medium">
                          🖼️ Imagem do achado
                        </div>
                      </div>
                    );
                  }

                  // Prioridade 2: Guia textual
                  const midia = obterMidiaExamePediatrico(regiaoSelecionada, acaoSelecionada.id);
                  if (midia) {
                    return (
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-semibold text-blue-900 mb-2">
                            {midia.titulo}
                          </h4>
                        </div>

                        {midia.src && (
                          <div className="w-full h-40 bg-slate-100/50 rounded-lg flex items-center justify-center border border-slate-200/50">
                            <img
                              src={midia.src}
                              alt={midia.titulo}
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        <p className="text-xs text-slate-700 leading-relaxed">
                          {midia.descricao}
                        </p>

                        {midia.legenda && (
                          <p className="text-xs text-slate-500 italic border-l-2 border-blue-300 pl-2 mt-2">
                            {midia.legenda}
                          </p>
                        )}

                        <div className="mt-2 text-xs text-blue-600 font-medium">
                          {midia.tipo === 'guia' ? '📋 Guia textual' : '🖼️ Mídia visual'}
                        </div>
                      </div>
                    );
                  }

                  // Prioridade 3: Empty state
                  return (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                      <div className="text-3xl opacity-30">📋</div>
                      <div>
                        <p className="text-xs font-medium text-slate-700 mb-1">
                          {acaoSelecionada.label}
                        </p>
                        <p className="text-xs text-slate-500">
                          Nenhuma guia visual disponível para esta ação no momento.
                        </p>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                  <div className="text-4xl opacity-20">👁️</div>
                  <div>
                    <p className="text-xs font-medium text-slate-700 mb-1">
                      Exame Interativo
                    </p>
                    <p className="text-xs text-slate-500">
                      Selecione uma ação para visualizar orientações e guias de exame.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
