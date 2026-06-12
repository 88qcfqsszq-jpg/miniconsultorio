'use client';

import { useCallback, useState } from 'react';
import {
  REGIOES_PEDIATRICAS,
  RegiaoPediatricaId,
} from '@/lib/pediatria/regioes-exame';
import { obterImagemPacientePediatrico, obterDescricaoFaixaEtaria, obterInfoImagem } from '@/lib/pediatria/imagens';
import { obterCoordenadas, obterAlturaContainer, obterAspectRatioImagem } from '@/lib/pediatria/coordenadas-dinamicas';

interface PacientePediatricoVisualProps {
  faixaEtaria?: string;
  regioSelecionada?: RegiaoPediatricaId;
  onRegioClicada: (regioId: RegiaoPediatricaId) => void;
}

export default function PacientePediatricoVisual({
  faixaEtaria,
  regioSelecionada,
  onRegioClicada,
}: PacientePediatricoVisualProps) {
  const [imagemCarregada, setImagemCarregada] = useState(true);
  const [erroImagem, setErroImagem] = useState(false);

  const imagemPath = obterImagemPacientePediatrico(faixaEtaria);
  const descricaoFaixa = obterDescricaoFaixaEtaria(faixaEtaria);
  const infoImagem = obterInfoImagem(imagemPath);

  const handleImagemCarregada = useCallback(() => {
    setImagemCarregada(true);
    setErroImagem(false);
  }, []);

  const handleErroImagem = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn(`Imagem pediátrica não encontrada: ${imagemPath}`);
    setImagemCarregada(false);
    setErroImagem(true);
  }, [imagemPath]);

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

          {/* SVG overlay com hotspots clicáveis */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ cursor: 'pointer', pointerEvents: 'auto' }}
          >
            {/* Renderizar hotspots para cada região com coordenadas dinâmicas */}
            {REGIOES_PEDIATRICAS.map((regiao) => {
              // Obter coordenadas ajustadas conforme faixa etária
              const coordsAjustadas = obterCoordenadas(regiao.id, faixaEtaria);

              return (
                <g key={regiao.id}>
                  {/* Retângulo clicável */}
                  <rect
                    x={coordsAjustadas.x}
                    y={coordsAjustadas.y}
                    width={coordsAjustadas.width}
                    height={coordsAjustadas.height}
                    fill={
                      regioSelecionada === regiao.id
                        ? 'rgba(59, 130, 246, 0.3)'
                        : 'rgba(100, 116, 139, 0.05)'
                    }
                    stroke={
                      regioSelecionada === regiao.id
                        ? 'rgba(59, 130, 246, 0.8)'
                        : 'rgba(100, 116, 139, 0.2)'
                    }
                    strokeWidth="0.5"
                    className="hover:fill-blue-100 hover:stroke-blue-400 transition-colors"
                    onClick={() => onRegioClicada(regiao.id)}
                    style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                  />

                  {/* Label da região */}
                  {regioSelecionada === regiao.id && (
                    <text
                      x={coordsAjustadas.x + coordsAjustadas.width / 2}
                      y={coordsAjustadas.y + coordsAjustadas.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-bold fill-blue-700 pointer-events-none"
                      fontSize="1.5"
                    >
                      {regiao.label}
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
