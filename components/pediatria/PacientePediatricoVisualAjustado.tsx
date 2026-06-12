'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import {
  obterRegioesPediatricas,
  RegiaoPediatricaId,
  REGIOES_PEDIATRICAS_LACTENTE,
  REGIOES_PEDIATRICAS_CRIANCA,
} from '@/lib/pediatria/regioes-exame-ajustadas';
import { obterImagemPacientePediatrico, obterDescricaoFaixaEtaria, obterInfoImagem } from '@/lib/pediatria/imagens';

// Debug mode: mudar para true para ver bordas dos hotspots
const DEBUG_HOTSPOTS_PEDIATRIA = false;

// Modo de calibração: ativa overlay para capturar coordenadas reais da imagem
const DEBUG_HOTSPOT_CALIBRATION = true;

// ✅ NOVA LISTA DE CALIBRAÇÃO (13 hotspots — do zero, sem dados antigos)
const calibrationTargets = [
  { id: 'cabeca', label: 'Cabeça / Perímetro Cefálico' },
  { id: 'olhos_face', label: 'Olhos / Face' },
  { id: 'orofaringe', label: 'Orofaringe' },
  { id: 'pescoco_linfonodos', label: 'Pescoço / Linfonodos' },
  { id: 'torax_respiratorio', label: 'Tórax Respiratório' },
  { id: 'precordio', label: 'Precórdio' },
  { id: 'abdome', label: 'Abdome' },
  { id: 'figado', label: 'Fígado / Hipocôndrio D' },
  { id: 'baco', label: 'Baço / Hipocôndrio E' },
  { id: 'membros_perfusao', label: 'Membros / Perfusão / Pulsos / TEC' },
  { id: 'pele_mucosas', label: 'Pele / Mucosas' },
  { id: 'desenvolvimento_interacao', label: 'Desenvolvimento / Interação' },
  { id: 'estado_geral', label: 'Estado Geral' },
];

interface CalibrationResult {
  id: string;
  label: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

// ✅ ARRAY VAZIO — SEM DADOS ANTIGOS
// Será preenchido apenas durante a calibração sequencial
const LACTENTE_BOX_HOTSPOTS: Array<{
  id: string;
  label: string;
  left: string | number;
  top: string | number;
  width: string | number;
  height: string | number;
}> = [];

interface PacientePediatricoVisualAjustadoProps {
  faixaEtaria?: string;
  regioSelecionada?: RegiaoPediatricaId;
  onRegioClicada: (regioId: RegiaoPediatricaId) => void;
  desabilitarHotspots?: boolean; // Desabilitar cliques nos hotspots (para lactente com boxes laterais)
}

interface CalibracaoClique {
  x: number;
  y: number;
  clientX: number;
  clientY: number;
}

export default function PacientePediatricoVisualAjustado({
  faixaEtaria,
  regioSelecionada,
  onRegioClicada,
  desabilitarHotspots = false,
}: PacientePediatricoVisualAjustadoProps) {
  const [imagemCarregada, setImagemCarregada] = useState(true);
  const [erroImagem, setErroImagem] = useState(false);
  const [regioEmHover, setRegioEmHover] = useState<RegiaoPediatricaId | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Estado para calibração sequencial de hotspots
  const [currentCalibrationIndex, setCurrentCalibrationIndex] = useState(0);
  const [calibrationClicks, setCalibrationClicks] = useState<CalibracaoClique[]>([]);
  const [calibrationResults, setCalibrationResults] = useState<CalibrationResult[]>([]);
  const [calibrationError, setCalibrationError] = useState<string | null>(null);

  const imagemPath = obterImagemPacientePediatrico(faixaEtaria);
  const descricaoFaixa = obterDescricaoFaixaEtaria(faixaEtaria);
  const infoImagem = obterInfoImagem(imagemPath);
  const regioes = obterRegioesPediatricas(faixaEtaria);

  const handleImagemCarregada = useCallback(() => {
    setImagemCarregada(true);
    setErroImagem(false);
  }, []);

  const handleErroImagem = useCallback(() => {
    console.warn(`Imagem pediátrica não encontrada: ${imagemPath}`);
    setImagemCarregada(false);
    setErroImagem(true);
  }, [imagemPath]);

  // Handler de calibração sequencial
  const handleCalibrationClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!DEBUG_HOTSPOT_CALIBRATION || !imageRef.current) return;
    if (currentCalibrationIndex >= calibrationTargets.length) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newClick: CalibracaoClique = { x, y, clientX: event.clientX, clientY: event.clientY };
    const currentClicks = [...calibrationClicks, newClick];

    console.log(`🔵 ${calibrationTargets[currentCalibrationIndex].label} - Clique ${currentClicks.length}: x=${x.toFixed(1)}, y=${y.toFixed(1)} (px)`);

    if (currentClicks.length === 2) {
      // Calcular coordenadas percentuais
      const x1 = currentClicks[0].x;
      const y1 = currentClicks[0].y;
      const x2 = currentClicks[1].x;
      const y2 = currentClicks[1].y;

      const leftPx = Math.min(x1, x2);
      const topPx = Math.min(y1, y2);
      const widthPx = Math.abs(x2 - x1);
      const heightPx = Math.abs(y2 - y1);

      const leftPercent = (leftPx / rect.width) * 100;
      const topPercent = (topPx / rect.height) * 100;
      const widthPercent = (widthPx / rect.width) * 100;
      const heightPercent = (heightPx / rect.height) * 100;

      // Validar tamanho (impede calibração da imagem inteira)
      if (widthPercent > 40 || heightPercent > 20) {
        setCalibrationError('⚠️ Área muito grande! Clique apenas nos cantos do box textual.');
        console.warn('❌ Área rejeitada: W=%.1f%% H=%.1f%% (máx: 40%% x 20%%)', widthPercent, heightPercent);
        setCalibrationClicks([]);
        return;
      }

      setCalibrationError(null);

      // Salvar resultado
      const target = calibrationTargets[currentCalibrationIndex];
      const result: CalibrationResult = {
        id: target.id,
        label: target.label,
        left: parseFloat(leftPercent.toFixed(1)),
        top: parseFloat(topPercent.toFixed(1)),
        width: parseFloat(widthPercent.toFixed(1)),
        height: parseFloat(heightPercent.toFixed(1)),
      };

      const newResults = [...calibrationResults, result];
      setCalibrationResults(newResults);

      console.log('%c✅ HOTSPOT CALIBRADO', 'background: #10b981; color: white; padding: 5px; border-radius: 3px; font-weight: bold;');
      console.log(JSON.stringify(result, null, 2));

      // Resetar cliques e avançar para próximo hotspot
      setCalibrationClicks([]);
      setCurrentCalibrationIndex(currentCalibrationIndex + 1);
    } else {
      setCalibrationClicks(currentClicks);
    }
  }, [currentCalibrationIndex, calibrationClicks, calibrationResults]);

  // Refazer hotspot atual
  const handleRetakeCurrentHotspot = useCallback(() => {
    setCalibrationClicks([]);
    setCalibrationError(null);
    console.log(`🔄 Refazendo: ${calibrationTargets[currentCalibrationIndex].label}`);
  }, [currentCalibrationIndex]);

  // Voltar para hotspot anterior
  const handlePreviousHotspot = useCallback(() => {
    if (currentCalibrationIndex === 0) return;
    const newResults = [...calibrationResults];
    newResults.pop();
    setCalibrationResults(newResults);
    setCalibrationClicks([]);
    setCalibrationError(null);
    setCurrentCalibrationIndex(currentCalibrationIndex - 1);
    console.log(`⬅️ Voltando para: ${calibrationTargets[currentCalibrationIndex - 1].label}`);
  }, [currentCalibrationIndex, calibrationResults]);

  // Copiar array final para clipboard
  const handleCopyFinalArray = useCallback(() => {
    if (calibrationResults.length === 0) return;

    const arrayStr = `const lactenteHotspots = ${JSON.stringify(calibrationResults, null, 2)};`;
    navigator.clipboard.writeText(arrayStr);
    console.log('%c📋 Array copiado para clipboard!', 'background: #3b82f6; color: white; padding: 5px; border-radius: 3px; font-weight: bold;');
    console.log(arrayStr);
  }, [calibrationResults]);

  // Limpar TODOS os hotspots e recomeçar do zero
  const handleClearAllCalibration = useCallback(() => {
    setCurrentCalibrationIndex(0);
    setCalibrationClicks([]);
    setCalibrationResults([]);
    setCalibrationError(null);
    console.log('%c🔄 CALIBRAÇÃO COMPLETA RESETADA!', 'background: #ef4444; color: white; padding: 5px; border-radius: 3px; font-weight: bold;');
    console.log('Começando do zero: ' + calibrationTargets[0].label);
  }, []);

  // Detectar tecla ESC para limpar cliques atuais
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && DEBUG_HOTSPOT_CALIBRATION && calibrationClicks.length > 0) {
        setCalibrationClicks([]);
        setCalibrationError(null);
        console.log('🔄 Cliques atuais limpos.');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [calibrationClicks]);

  // Ordenar regiões por zIndex para renderização correta
  const regioesOrdenadas = [...regioes].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="relative w-full h-full bg-slate-50 rounded-lg border border-slate-200 overflow-hidden flex flex-col">
      {/* Cabeçalho com faixa etária */}
      <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs text-slate-600">
        <span className="font-semibold">{descricaoFaixa}</span>
        {erroImagem && (
          <span className="ml-2 text-orange-600">
            ⚠️ Imagem não encontrada: <code className="text-xs">{infoImagem.nome}</code>
          </span>
        )}
        {DEBUG_HOTSPOTS_PEDIATRIA && (
          <span className="ml-2 text-red-600 font-mono text-xs">
            [DEBUG: Hotspots Visíveis]
          </span>
        )}
      </div>

      {/* Contêiner de imagem com hotspots */}
      <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden">
        {/* Imagem do paciente pediátrico */}
        <div className="relative w-full h-full max-w-xs" onClick={handleCalibrationClick}>
          {/* Imagem com tratamento de erro */}
          <img
            ref={imageRef}
            src={imagemPath}
            alt={`Paciente pediátrico - ${descricaoFaixa}`}
            className="w-full h-full object-contain"
            onLoad={handleImagemCarregada}
            onError={handleErroImagem}
            style={{ display: imagemCarregada && !erroImagem ? 'block' : 'none' }}
          />

          {/* Fallback visual se imagem não carregar */}
          {(!imagemCarregada || erroImagem) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-50 border-2 border-dashed border-slate-300 rounded">
              <div className="text-center space-y-3 px-4">
                <p className="text-slate-600 text-sm font-semibold">📷 Imagem não carregada</p>
                <p className="text-xs text-slate-500">
                  Arquivo esperado:<br />
                  <code className="text-xs font-mono bg-slate-200 px-2 py-1 rounded">
                    {infoImagem.nome}
                  </code>
                </p>
                <p className="text-xs text-slate-400">Os hotspots continuam funcionando</p>
              </div>
            </div>
          )}

          {/* Overlay de calibração sequencial */}
          {DEBUG_HOTSPOT_CALIBRATION && imagemCarregada && !erroImagem && (
            <div className="absolute inset-0 bg-black/5 cursor-crosshair flex flex-col">
              {/* Header com progresso */}
              <div className="bg-white/98 px-4 py-3 border-b border-slate-200 shadow-sm z-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-blue-700">
                    🎯 Calibração de Hotspots
                  </div>
                  <div className="text-sm font-mono text-slate-600">
                    {currentCalibrationIndex}/{calibrationTargets.length}
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${(currentCalibrationIndex / calibrationTargets.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Conteúdo central */}
              <div className="flex-1 flex items-center justify-center">
                {currentCalibrationIndex < calibrationTargets.length ? (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/98 px-6 py-4 rounded-lg shadow-lg z-50 text-center max-w-sm">
                    <div className="text-lg font-bold text-slate-800 mb-2">
                      {calibrationTargets[currentCalibrationIndex].label}
                    </div>
                    <div className="text-sm text-slate-600 mb-3">
                      {calibrationClicks.length === 0 && 'Clique no canto SUPERIOR ESQUERDO do box textual'}
                      {calibrationClicks.length === 1 && (
                        <span className="text-blue-600 font-medium">
                          ✓ Primeiro clique OK. Agora clique no canto INFERIOR DIREITO
                        </span>
                      )}
                    </div>
                    {calibrationError && (
                      <div className="text-xs bg-red-50 text-red-700 px-3 py-2 rounded mb-3 border border-red-200">
                        {calibrationError}
                      </div>
                    )}
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetakeCurrentHotspot();
                        }}
                        className="px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded font-medium"
                      >
                        ↻ Refazer atual
                      </button>
                      {currentCalibrationIndex > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviousHotspot();
                          }}
                          className="px-3 py-1.5 text-xs bg-slate-500 hover:bg-slate-600 text-white rounded font-medium"
                        >
                          ⬅ Anterior
                        </button>
                      )}
                      {calibrationResults.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('⚠️ Tem certeza? Isso vai limpar TODOS os hotspots e recomeçar do zero.')) {
                              handleClearAllCalibration();
                            }
                          }}
                          className="px-3 py-1.5 text-xs bg-red-500 hover:bg-red-600 text-white rounded font-medium"
                        >
                          🗑 Limpar tudo
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-50 px-6 py-4 rounded-lg shadow-lg z-50 text-center max-w-sm border-2 border-green-400">
                    <div className="text-2xl mb-2">🎉</div>
                    <div className="text-lg font-bold text-green-800 mb-2">
                      Calibração Completa!
                    </div>
                    <div className="text-sm text-green-700 mb-4">
                      {calibrationResults.length} hotspots calibrados com sucesso
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyFinalArray();
                      }}
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium text-sm mb-2"
                    >
                      📋 Copiar Array (Clipboard)
                    </button>
                    <div className="text-xs text-green-600 mt-2 mb-3">
                      Array também está disponível no Console do DevTools (F12)
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('⚠️ Recalibrar tudo? Isso vai apagar o progresso e recomeçar do primeiro hotspot.')) {
                          handleClearAllCalibration();
                        }
                      }}
                      className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium text-sm"
                    >
                      🗑 Recalibrar tudo
                    </button>
                  </div>
                )}
              </div>

              {/* Retângulos já calibrados (verde) */}
              {calibrationResults.map((result) => (
                <div
                  key={result.id}
                  className="absolute border-2 border-green-500 bg-green-500/5 pointer-events-none"
                  style={{
                    left: `${result.left}%`,
                    top: `${result.top}%`,
                    width: `${result.width}%`,
                    height: `${result.height}%`,
                  }}
                ></div>
              ))}

              {/* Retângulo em marcação (amarelo) */}
              {calibrationClicks.length === 2 && currentCalibrationIndex < calibrationTargets.length && (
                <div
                  className="absolute border-2 border-amber-500 bg-amber-500/10 pointer-events-none"
                  style={{
                    left: `${(Math.min(calibrationClicks[0].x, calibrationClicks[1].x) / (imageRef.current?.getBoundingClientRect().width || 1)) * 100}%`,
                    top: `${(Math.min(calibrationClicks[0].y, calibrationClicks[1].y) / (imageRef.current?.getBoundingClientRect().height || 1)) * 100}%`,
                    width: `${(Math.abs(calibrationClicks[1].x - calibrationClicks[0].x) / (imageRef.current?.getBoundingClientRect().width || 1)) * 100}%`,
                    height: `${(Math.abs(calibrationClicks[1].y - calibrationClicks[0].y) / (imageRef.current?.getBoundingClientRect().height || 1)) * 100}%`,
                  }}
                ></div>
              )}

              {/* Marcadores dos cliques (bolinhas) */}
              {calibrationClicks.map((clique, idx) => {
                if (!imageRef.current) return null;
                const rect = imageRef.current.getBoundingClientRect();
                const percentLeft = (clique.x / rect.width) * 100;
                const percentTop = (clique.y / rect.height) * 100;

                return (
                  <div
                    key={idx}
                    className="absolute w-4 h-4 border-2 border-amber-500 rounded-full pointer-events-none z-40"
                    style={{
                      left: `${percentLeft}%`,
                      top: `${percentTop}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="absolute inset-1 bg-amber-500 rounded-full animate-pulse"></div>
                  </div>
                );
              })}

              {/* Info footer */}
              <div className="bg-white/98 px-4 py-2 border-t border-slate-200 text-xs text-slate-600 text-center z-50">
                {calibrationClicks.length > 0 && 'ESC limpa os cliques atuais'}
                {calibrationClicks.length === 0 && 'Clique para começar'}
              </div>
            </div>
          )}

          {/* Hotspots invisíveis sobre boxes textuais do lactente */}
          {(faixaEtaria === 'lactente' || faixaEtaria === 'neonato') && (
            <>
              {LACTENTE_BOX_HOTSPOTS.map((hotspot) => (
                <button
                  key={hotspot.id}
                  className={`absolute z-20 cursor-pointer rounded-xl transition-all ${
                    DEBUG_HOTSPOTS_PEDIATRIA
                      ? 'bg-red-500/20 hover:bg-red-500/30'
                      : 'bg-transparent hover:bg-blue-500/10'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  style={{
                    left: hotspot.left,
                    top: hotspot.top,
                    width: hotspot.width,
                    height: hotspot.height,
                  }}
                  onClick={() => onRegioClicada(hotspot.id as RegiaoPediatricaId)}
                  aria-label={hotspot.label}
                  title={hotspot.label}
                />
              ))}
            </>
          )}

          {/* SVG overlay com hotspots clicáveis */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ cursor: desabilitarHotspots ? 'default' : 'pointer', pointerEvents: desabilitarHotspots ? 'none' : 'auto' }}
          >
            {/* Renderizar hotspots ordenados por zIndex */}
            {regioesOrdenadas.map((regiao) => {
              const isSelected = regioSelecionada === regiao.id;
              const isHover = regioEmHover === regiao.id;

              return (
                <g
                  key={regiao.id}
                  onMouseEnter={() => setRegioEmHover(regiao.id as RegiaoPediatricaId)}
                  onMouseLeave={() => setRegioEmHover(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Retângulo clicável com estilos dinâmicos */}
                  <rect
                    x={regiao.coordenadas.x}
                    y={regiao.coordenadas.y}
                    width={regiao.coordenadas.width}
                    height={regiao.coordenadas.height}
                    fill={
                      DEBUG_HOTSPOTS_PEDIATRIA
                        ? 'rgba(59, 130, 246, 0.1)'
                        : isSelected
                          ? 'rgba(59, 130, 246, 0.3)'
                          : isHover
                            ? 'rgba(59, 130, 246, 0.15)'
                            : 'rgba(100, 116, 139, 0.02)'
                    }
                    stroke={
                      DEBUG_HOTSPOTS_PEDIATRIA
                        ? 'rgba(239, 68, 68, 0.8)'
                        : isSelected
                          ? 'rgba(59, 130, 246, 1)'
                          : isHover
                            ? 'rgba(59, 130, 246, 0.6)'
                            : 'rgba(100, 116, 139, 0.1)'
                    }
                    strokeWidth={DEBUG_HOTSPOTS_PEDIATRIA ? '0.8' : isSelected ? '1' : '0.3'}
                    className="transition-all"
                    onClick={() => onRegioClicada(regiao.id as RegiaoPediatricaId)}
                    style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                  />

                  {/* Label da região (visível em debug ou selecionada) */}
                  {(DEBUG_HOTSPOTS_PEDIATRIA || isSelected) && (
                    <text
                      x={regiao.coordenadas.x + regiao.coordenadas.width / 2}
                      y={regiao.coordenadas.y + regiao.coordenadas.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-bold pointer-events-none select-none"
                      fontSize={DEBUG_HOTSPOTS_PEDIATRIA ? '1.5' : '1.2'}
                      fill={DEBUG_HOTSPOTS_PEDIATRIA ? 'rgba(239, 68, 68, 0.9)' : 'rgba(59, 130, 246, 0.9)'}
                    >
                      {DEBUG_HOTSPOTS_PEDIATRIA ? `${regiao.id} (z:${regiao.zIndex})` : regiao.label.split(' ')[0]}
                    </text>
                  )}

                  {/* Coordenadas em debug */}
                  {DEBUG_HOTSPOTS_PEDIATRIA && (
                    <text
                      x={regiao.coordenadas.x + regiao.coordenadas.width / 2}
                      y={regiao.coordenadas.y + regiao.coordenadas.height / 2 + 3}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="pointer-events-none select-none"
                      fontSize="0.8"
                      fill="rgba(239, 68, 68, 0.7)"
                      fontFamily="monospace"
                    >
                      {`x:${regiao.coordenadas.x} y:${regiao.coordenadas.y}`}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Info/Dica */}
      <div className="px-4 py-2 bg-sky-50 border-t border-sky-200 text-xs text-sky-700">
        💡 Clique nas regiões do corpo para avaliar
      </div>
    </div>
  );
}
