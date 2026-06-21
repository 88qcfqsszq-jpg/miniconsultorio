/**
 * RadiologyImageViewer - Componente reutilizável para exibição de imagens radiológicas
 *
 * Funcionalidades:
 * - Exibição de imagens PNG/JPG
 * - Zoom in/out
 * - Ajuste de brilho e contraste
 * - Tela cheia
 * - Tratamento de erros
 * - Estado de carregamento
 * - Aviso educacional obrigatório
 *
 * Não usa OHIF ou DICOM.
 * Sem conectividade de API.
 * TypeScript puro sem 'any'.
 */

"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

// ============================================================================
// TIPOS
// ============================================================================

interface RadiologyImageViewerProps {
  /** URL da imagem radiológica */
  imageUrl: string;

  /** Texto alternativo para a imagem */
  alt?: string;

  /** Fonte da imagem (ex: "NIH Chest X-ray") */
  fonte?: string;

  /** Atribuição/crédito da imagem */
  atribuicao?: string;

  /** Indica se é integração real (true) ou fixture educacional (false) */
  integracaoReal?: boolean;

  /** Callback ao erro de carregamento */
  onErroImagem?: () => void;
}

interface ControlesAjuste {
  zoom: number;
  brilho: number;
  contraste: number;
}

// ============================================================================
// ÍCONES (SVG)
// ============================================================================

const IconeZoomMais = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
    />
  </svg>
);

const IconeZoomMenos = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
    />
  </svg>
);

const IconeReset = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

const IconeTelaCheia = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6v4m12 0h4v-4m0 12h-4v4m-6-4h-4m12-4v4m0-12v-2m0 12v2"
    />
  </svg>
);

const IconeFechaTela = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const IconeErro = () => (
  <svg
    className="w-12 h-12"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const IconeCarregando = () => (
  <svg
    className="w-12 h-12 animate-spin"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
    />
  </svg>
);

// ============================================================================
// CONSTANTES
// ============================================================================

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.1;
const BRILHO_MIN = 50;
const BRILHO_MAX = 150;
const CONTRASTE_MIN = 50;
const CONTRASTE_MAX = 150;

const VALORES_PADRAO: ControlesAjuste = {
  zoom: 1,
  brilho: 100,
  contraste: 100,
};

// ============================================================================
// COMPONENTE
// ============================================================================

export const RadiologyImageViewer: React.FC<RadiologyImageViewerProps> = ({
  imageUrl,
  alt = "Imagem radiológica",
  fonte,
  atribuicao,
  integracaoReal = true,
  onErroImagem,
}) => {
  // Estado
  const [controles, setControles] = useState<ControlesAjuste>(VALORES_PADRAO);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [telaCheia, setTelaCheia] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // ========================================================================
  // HANDLERS: ZOOM
  // ========================================================================

  const aumentarZoom = useCallback(() => {
    setControles((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom + ZOOM_STEP, ZOOM_MAX),
    }));
  }, []);

  const diminuirZoom = useCallback(() => {
    setControles((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom - ZOOM_STEP, ZOOM_MIN),
    }));
  }, []);

  // ========================================================================
  // HANDLERS: BRILHO E CONTRASTE
  // ========================================================================

  const alterarBrilho = useCallback((delta: number) => {
    setControles((prev) => ({
      ...prev,
      brilho: Math.max(
        BRILHO_MIN,
        Math.min(prev.brilho + delta, BRILHO_MAX)
      ),
    }));
  }, []);

  const alterarContraste = useCallback((delta: number) => {
    setControles((prev) => ({
      ...prev,
      contraste: Math.max(
        CONTRASTE_MIN,
        Math.min(prev.contraste + delta, CONTRASTE_MAX)
      ),
    }));
  }, []);

  // ========================================================================
  // HANDLERS: RESET
  // ========================================================================

  const resetarZoom = useCallback(() => {
    setControles((prev) => ({
      ...prev,
      zoom: VALORES_PADRAO.zoom,
    }));
  }, []);

  const resetarBrilhoContraste = useCallback(() => {
    setControles((prev) => ({
      ...prev,
      brilho: VALORES_PADRAO.brilho,
      contraste: VALORES_PADRAO.contraste,
    }));
  }, []);

  const resetarTudo = useCallback(() => {
    setControles(VALORES_PADRAO);
  }, []);

  // ========================================================================
  // HANDLERS: IMAGEM
  // ========================================================================

  const handleImagemCarregada = useCallback(() => {
    setCarregando(false);
    setErro(null);
  }, []);

  const handleErroImagem = useCallback(() => {
    setCarregando(false);
    setErro("Erro ao carregar a imagem radiológica");
    onErroImagem?.();
  }, [onErroImagem]);

  // ========================================================================
  // HANDLERS: TELA CHEIA
  // ========================================================================

  const ativarTelaCheia = useCallback(() => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {
          // Erro ao tentar tela cheia
        });
      }
    }
  }, []);

  const sairTelaCheia = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {
        // Erro ao sair de tela cheia
      });
    }
  }, []);

  // Monitorar mudanças de tela cheia
  useEffect(() => {
    const handleFullscreenChange = () => {
      setTelaCheia(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // ========================================================================
  // ESTILOS DINÂMICOS
  // ========================================================================

  const styleImagemFiltros: React.CSSProperties = {
    filter: `brightness(${controles.brilho}%) contrast(${controles.contraste}%)`,
    transform: `scale(${controles.zoom})`,
    transition: "transform 0.2s ease-out",
  };

  // ========================================================================
  // RENDERIZAÇÃO: ESTADO DE CARREGAMENTO
  // ========================================================================

  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900 rounded-lg p-8">
        <div className="text-blue-400 mb-4">
          <IconeCarregando />
        </div>
        <p className="text-slate-300 text-sm">Carregando imagem radiológica...</p>
      </div>
    );
  }

  // ========================================================================
  // RENDERIZAÇÃO: ESTADO DE ERRO
  // ========================================================================

  if (erro) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900 rounded-lg p-8">
        <div className="text-red-400 mb-4">
          <IconeErro />
        </div>
        <p className="text-red-300 text-sm font-medium mb-2">{erro}</p>
        <p className="text-slate-400 text-xs">
          Verifique se a URL da imagem é válida
        </p>
        {onErroImagem && (
          <button
            onClick={onErroImagem}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            Tentar novamente
          </button>
        )}
      </div>
    );
  }

  // ========================================================================
  // RENDERIZAÇÃO: PRINCIPAL
  // ========================================================================

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-slate-900 rounded-lg overflow-hidden ${
        telaCheia ? "fixed inset-0 z-50" : "h-full"
      }`}
    >
      {/* BARRA DE CONTROLES SUPERIOR */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* CONTROLES ZOOM */}
          <div className="flex items-center gap-2">
            <button
              onClick={diminuirZoom}
              disabled={controles.zoom <= ZOOM_MIN}
              title="Diminuir zoom (Z-)"
              className="p-2 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors text-slate-300 hover:text-white"
            >
              <IconeZoomMenos />
            </button>

            <span className="text-xs text-slate-400 w-12 text-center">
              {Math.round(controles.zoom * 100)}%
            </span>

            <button
              onClick={aumentarZoom}
              disabled={controles.zoom >= ZOOM_MAX}
              title="Aumentar zoom (Z+)"
              className="p-2 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors text-slate-300 hover:text-white"
            >
              <IconeZoomMais />
            </button>

            <button
              onClick={resetarZoom}
              title="Resetar zoom"
              className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-white text-xs ml-2"
            >
              Resetar Zoom
            </button>
          </div>

          {/* SEPARADOR */}
          <div className="hidden sm:block h-6 w-px bg-slate-700" />

          {/* CONTROLES BRILHO/CONTRASTE */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1">
              <label
                htmlFor="brilho"
                className="text-xs text-slate-400"
                title="Ajustar brilho"
              >
                Brilho
              </label>
              <input
                id="brilho"
                type="range"
                min={BRILHO_MIN}
                max={BRILHO_MAX}
                value={controles.brilho}
                onChange={(e) =>
                  setControles((prev) => ({
                    ...prev,
                    brilho: parseInt(e.target.value),
                  }))
                }
                className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-slate-400 w-8 text-right">
                {controles.brilho}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <label
                htmlFor="contraste"
                className="text-xs text-slate-400"
                title="Ajustar contraste"
              >
                Contraste
              </label>
              <input
                id="contraste"
                type="range"
                min={CONTRASTE_MIN}
                max={CONTRASTE_MAX}
                value={controles.contraste}
                onChange={(e) =>
                  setControles((prev) => ({
                    ...prev,
                    contraste: parseInt(e.target.value),
                  }))
                }
                className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-slate-400 w-8 text-right">
                {controles.contraste}
              </span>
            </div>

            <button
              onClick={resetarBrilhoContraste}
              title="Resetar brilho e contraste"
              className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-white text-xs ml-2"
            >
              Resetar
            </button>
          </div>

          {/* BOTÕES DIREITA */}
          <div className="flex items-center gap-2 ml-auto">
            {telaCheia ? (
              <button
                onClick={sairTelaCheia}
                title="Sair de tela cheia"
                className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-white"
              >
                <IconeFechaTela />
              </button>
            ) : (
              <button
                onClick={ativarTelaCheia}
                title="Tela cheia"
                className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-white"
              >
                <IconeTelaCheia />
              </button>
            )}

            <button
              onClick={resetarTudo}
              title="Resetar todos os controles"
              className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-white"
            >
              <IconeReset />
            </button>
          </div>
        </div>

        {/* AVISO EDUCACIONAL */}
        <div className="mt-2 text-xs text-yellow-600 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded px-3 py-2">
          ⚠️ Ferramenta educacional. Não usar para diagnóstico real. Não envie
          exames reais de pacientes.
        </div>
      </div>

      {/* ÁREA DE EXIBIÇÃO DA IMAGEM */}
      <div className="flex-1 overflow-auto bg-black flex items-center justify-center p-4">
        <div
          className="relative cursor-grab active:cursor-grabbing"
          style={{ perspective: "1000px" }}
        >
          {/* IMAGEM COM FILTROS */}
          <img
            ref={imgRef}
            src={imageUrl}
            alt={alt}
            onLoad={handleImagemCarregada}
            onError={handleErroImagem}
            style={styleImagemFiltros}
            className="max-w-full max-h-full select-none"
            draggable={false}
          />

          {/* BADGE DE FIXTURE */}
          {!integracaoReal && (
            <div className="absolute top-2 right-2 bg-blue-900 border border-blue-600 text-blue-200 text-xs rounded px-2 py-1">
              Fixture educacional local
            </div>
          )}
        </div>
      </div>

      {/* RODAPÉ COM INFORMAÇÕES */}
      {(fonte || atribuicao) && (
        <div className="bg-slate-800 border-t border-slate-700 px-4 py-2 text-xs text-slate-400">
          {fonte && <div>Fonte: {fonte}</div>}
          {atribuicao && <div className="mt-1">{atribuicao}</div>}
        </div>
      )}
    </div>
  );
};

export default RadiologyImageViewer;
