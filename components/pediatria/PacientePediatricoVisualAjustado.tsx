'use client';

import { useCallback, useState } from 'react';
import { obterImagemPacientePediatrico, obterDescricaoFaixaEtaria, obterInfoImagem } from '@/lib/pediatria/imagens';

interface PacientePediatricoVisualAjustadoProps {
  faixaEtaria?: string;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export default function PacientePediatricoVisualAjustado({
  faixaEtaria,
  onDragOver,
  onDrop,
}: PacientePediatricoVisualAjustadoProps) {
  const [imagemCarregada, setImagemCarregada] = useState(true);
  const [erroImagem, setErroImagem] = useState(false);

  const imagemPath = obterImagemPacientePediatrico(faixaEtaria);
  const descricaoFaixa = obterDescricaoFaixaEtaria(faixaEtaria);
  const infoImagem = obterInfoImagem(imagemPath);

  const handleImagemCarregada = useCallback(() => {
    setImagemCarregada(true);
    setErroImagem(false);
  }, []);

  const handleErroImagem = useCallback(() => {
    console.warn(`Imagem pediátrica não encontrada: ${imagemPath}`);
    setImagemCarregada(false);
    setErroImagem(true);
  }, [imagemPath]);

  return (
    <div className="relative w-full h-full bg-slate-50 rounded-lg border border-slate-200 overflow-hidden flex flex-col">
      {/* Header com faixa etária */}
      <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs text-slate-600">
        <span className="font-semibold">{descricaoFaixa}</span>
        {erroImagem && (
          <span className="ml-2 text-orange-600">
            ⚠️ Imagem não encontrada: <code className="text-xs">{infoImagem.nome}</code>
          </span>
        )}
      </div>

      {/* Contêiner de imagem — centralizado e livre */}
      <div className="relative flex-1 flex items-center justify-center p-8 overflow-auto" onDragOver={onDragOver} onDrop={onDrop}>
        <div className="relative w-full h-full max-w-7xl flex items-center justify-center">
          {/* Imagem do paciente pediátrico — LIMPA, SEM HOTSPOTS */}
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
                <p className="text-xs text-slate-400">Arraste as regiões sobre o corpo</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info/Dica */}
      <div className="px-4 py-2 bg-sky-50 border-t border-sky-200 text-xs text-sky-700">
        💡 Arraste as regiões para o local correto do corpo
      </div>
    </div>
  );
}
