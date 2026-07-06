"use client";

import React, { useState } from "react";

interface PainelAnaliseImagemProps {
  imageUrl?: string | null;
  carregando?: boolean;
  erro?: string | null;
}

/**
 * Painel simples para análise de imagem radiológica
 * Recebe imageUrl diretamente e renderiza
 */
export const PainelAnaliseImagem: React.FC<PainelAnaliseImagemProps> = ({
  imageUrl,
  carregando = false,
  erro = null,
}) => {
  const [mostrarGabaritoImagem, setMostrarGabaritoImagem] = useState(false);

  // 4️⃣ PainelAnaliseImagem recebe prop imageUrl?
  console.log("[4️⃣ PAINEL RECEBEU]", {
    "imageUrl": imageUrl?.substring(0, 60),
    "carregando": carregando,
    "erro": erro
  });

  // 5️⃣ DOM renderiza <img>?
  if (imageUrl) {
    console.log("[5️⃣ DOM RENDERIZA]", {
      "src": imageUrl.substring(0, 60),
      "vai renderizar": "sim"
    });
  } else {
    console.log("[5️⃣ DOM RENDERIZA]", { "vai renderizar": "não (sem imageUrl)" });
  }

  // Carregando
  if (carregando) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <p className="text-slate-500">Carregando imagem de referência...</p>
      </div>
    );
  }

  // Erro
  if (erro) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <p className="text-slate-700 font-semibold">Erro ao carregar imagem</p>
        <p className="text-slate-500 text-sm mt-2">{erro}</p>
      </div>
    );
  }

  // Sem imagem
  if (!imageUrl) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="space-y-4">
          <p className="text-slate-700 font-semibold">
            Imagem radiológica indisponível
          </p>
          <p className="text-slate-500 text-sm">
            Nenhuma imagem radiológica foi encontrada no Open-i para este diagnóstico.
          </p>
        </div>
      </div>
    );
  }

  // Renderizar imagem
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          Radiografia de tórax — imagem de referência
        </h3>
        <img
          src={imageUrl}
          alt="Radiografia de tórax"
          style={{
            maxWidth: "100%",
            height: "auto",
            maxHeight: "400px",
            borderRadius: "8px",
          }}
        />
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
            Fonte
          </p>
          <p className="text-slate-700">
            Open-i / Indiana University Chest X-ray Collection
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-xs text-blue-800">
            ⓘ <strong>Aviso:</strong> Imagem de referência educacional. Não
            representa exame real do paciente.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 rounded p-3">
          <p className="text-xs text-yellow-900">
            ⚠️ <strong>Sem curadoria radiológica:</strong> Imagem retornada
            automaticamente pelo Open-i. Não foi validada por especialista.
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200">
        <button
          onClick={() => setMostrarGabaritoImagem(!mostrarGabaritoImagem)}
          className="w-full py-2 px-4 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          {mostrarGabaritoImagem ? "Ocultar gabarito" : "Gabarito"}
        </button>
      </div>

      {mostrarGabaritoImagem && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
          <p className="text-xs text-amber-900">
            Gabarito: A análise detalhada está disponível no seu documento de feedback.
          </p>
        </div>
      )}
    </div>
  );
};

export default PainelAnaliseImagem;
