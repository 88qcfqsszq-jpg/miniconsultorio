'use client';

import { useCallback, useState } from 'react';
import {
  obterRegioesPediatricas,
  RegiaoPediatricaId,
  REGIOES_PEDIATRICAS_LACTENTE,
  REGIOES_PEDIATRICAS_CRIANCA,
} from '@/lib/pediatria/regioes-exame-ajustadas';
import { obterImagemPacientePediatrico, obterDescricaoFaixaEtaria, obterInfoImagem } from '@/lib/pediatria/imagens';

// Debug mode: mudar para true para ver bordas dos hotspots
const DEBUG_HOTSPOTS_PEDIATRIA = false;

// Hotspots invisíveis sobre os boxes textuais do lactente
const LACTENTE_BOX_HOTSPOTS = [
  {
    id: 'cabeca_perimetro',
    label: 'Cabeça / Perímetro Cefálico',
    left: '2.5%',
    top: '8.5%',
    width: '26%',
    height: '10.5%',
  },
  {
    id: 'face_olhos',
    label: 'Olhos / Face',
    left: '74%',
    top: '13%',
    width: '24%',
    height: '8.5%',
  },
  {
    id: 'orofaringe',
    label: 'Orofaringe',
    left: '2.5%',
    top: '23%',
    width: '26%',
    height: '8.5%',
  },
  {
    id: 'pescoco_linfonodos',
    label: 'Pescoço / Linfonodos',
    left: '74.5%',
    top: '26%',
    width: '24%',
    height: '10%',
  },
  {
    id: 'torax_respiratorio',
    label: 'Tórax Respiratório',
    left: '2%',
    top: '38%',
    width: '25%',
    height: '10%',
  },
  {
    id: 'precordio',
    label: 'Precórdio',
    left: '76.5%',
    top: '42%',
    width: '22.5%',
    height: '11%',
  },
  {
    id: 'abdome',
    label: 'Abdome',
    left: '2%',
    top: '54%',
    width: '22%',
    height: '8.5%',
  },
  {
    id: 'figado',
    label: 'Fígado / Hipocôndrio D',
    left: '2%',
    top: '65%',
    width: '22%',
    height: '10%',
  },
  {
    id: 'baco',
    label: 'Baço / Hipocôndrio E',
    left: '77%',
    top: '57%',
    width: '21.5%',
    height: '11%',
  },
  {
    id: 'membros_perfusao',
    label: 'Membros / Perfusão / Pulsos / TEC',
    left: '77%',
    top: '73%',
    width: '22%',
    height: '12%',
  },
];

interface PacientePediatricoVisualAjustadoProps {
  faixaEtaria?: string;
  regioSelecionada?: RegiaoPediatricaId;
  onRegioClicada: (regioId: RegiaoPediatricaId) => void;
  desabilitarHotspots?: boolean; // Desabilitar cliques nos hotspots (para lactente com boxes laterais)
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
        <div className="relative w-full h-full max-w-xs">
          {/* Imagem com tratamento de erro */}
          <img
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
