"use client";

/**
 * OpenIRawImagePanel — componente LIMPO e independente.
 *
 * Depende SOMENTE de: imageUrl, loading, error, query, source.
 *
 * SEM: caso, caso.imagemRadiologica, imagensCandidatas, imagemSelecionada,
 *      imagemParaUsar, fallback, scoring, estado complexo, retry, cache.
 */

import React from "react";

export type OpenIRawImagePanelProps = {
  imageUrl: string | null;
  loading?: boolean;
  error?: string | null;
  query?: string | null;
  source?: string | null;
};

const FONTE_PADRAO = "Open-i / Indiana University Chest X-ray Collection";

export function OpenIRawImagePanel({
  imageUrl,
  loading = false,
  error = null,
  query = null,
  source = null,
}: OpenIRawImagePanelProps) {
  // 1. Carregando (apenas se ainda não há imagem)
  if (loading && !imageUrl) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <p className="text-slate-500">Carregando imagem radiológica…</p>
      </div>
    );
  }

  // 2. Imagem válida tem PRIORIDADE — erro antigo nunca esconde imagem válida
  if (!imageUrl && error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <p className="text-slate-700 font-semibold">
          Não encontramos imagem adequada no Open-i para este diagnóstico. Tente
          solicitar outro exame ou use curadoria manual/fonte alternativa.
        </p>
      </div>
    );
  }

  // 3. Sem imagem (e sem erro explícito)
  if (!imageUrl) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-2">
        <p className="text-slate-700 font-semibold">
          Imagem radiológica indisponível
        </p>
        <p className="text-slate-500 text-sm">
          Nenhuma imagem radiológica foi encontrada no Open-i para este diagnóstico.
        </p>
        <p className="text-slate-400 text-xs">
          Você pode consultar um atlas radiológico externo para complementar o aprendizado.
        </p>
      </div>
    );
  }

  // 4. Imagem disponível (imageUrl presente → renderiza SEMPRE)
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
      <h3 className="text-sm font-semibold text-slate-800">
        Radiografia de tórax — imagem de referência
      </h3>

      <img
        data-testid="openi-raw-image"
        src={imageUrl}
        alt="Radiografia de tórax"
        className="w-full max-h-[420px] object-contain rounded-lg border border-slate-100 bg-slate-50"
      />

      {/* Aviso de ausência de curadoria */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
        <p className="text-xs text-yellow-900">
          ⚠️ <strong>Sem curadoria radiológica:</strong> imagem retornada
          automaticamente pelo Open-i a partir do termo pesquisado. Não validada
          por curadoria radiológica.
        </p>
      </div>

      {/* Fonte e termo */}
      <div className="text-xs text-slate-500 space-y-1">
        <p>Fonte: {source || FONTE_PADRAO}</p>
        {query && <p className="text-slate-400">Termo pesquisado: {query}</p>}
      </div>
    </div>
  );
}

export default OpenIRawImagePanel;
