'use client';

import { useCallback, useState, useEffect } from 'react';
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

  // Debug: confirmar qual imagem está sendo usada no exame físico
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[ExameFisicoPediatrico] Imagem do paciente:', imagemPath)
    }
  }, [imagemPath])

  return (
    <div className="relative w-full h-full bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col">
      {/* Imagem do bebê — centralizada e inteira */}
      <div
        className="relative flex-1 flex items-center justify-center overflow-auto bg-white"
        onDragOver={onDragOver}
        onDrop={onDrop}
        style={{ minHeight: 0 }}
      >
        <div className="relative w-full mx-auto px-0.5">
          {/* Imagem — sem corte, proporcional */}
          <img
            src={imagemPath}
            alt={`Paciente pediátrico - ${descricaoFaixa}`}
            className="w-full h-auto object-contain block mx-auto"
            onLoad={handleImagemCarregada}
            onError={handleErroImagem}
            style={{
              display: imagemCarregada && !erroImagem ? 'block' : 'none',
              maxHeight: 'calc(100vh - 260px)',
            }}
          />

          {/* Fallback visual */}
          {(!imagemCarregada || erroImagem) && (
            <div className="flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-50 border-2 border-dashed border-slate-300 rounded aspect-square">
              <div className="text-center space-y-3 px-4">
                <p className="text-slate-600 text-sm font-semibold">📷 Imagem não carregada</p>
                <p className="text-xs text-slate-500">
                  {infoImagem.nome}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
