"use client";

import { useState } from "react";
import { SinaisVitais, ManobraRealizada } from "@/lib/types";

interface PainelExameFisicoProps {
  sinaisVitaisSolicitados: boolean;
  sinaisVitaisData?: SinaisVitais;
  onSolicitarSinaisVitais: () => void;
  caso: any;
  manobrasSolicitadas: ManobraRealizada[];
  onNovaManobra: (m: ManobraRealizada) => void;
  modoOSCE: boolean;
}

const CATEGORIAS = [
  {
    id: "geral",
    nome: "Geral",
    icone: "👤",
    orientacao: "Digite a manobra de inspeção geral que deseja realizar.",
    exemplos:
      "Ex: avaliar estado geral, nível de consciência, coloração, hidratação...",
  },
  {
    id: "cardiovascular",
    nome: "Cardiovascular",
    icone: "❤️",
    orientacao: "Digite a manobra cardiovascular que deseja realizar.",
    exemplos:
      "Ex: auscultar focos, palpar ictus, avaliar turgência jugular, pulsos...",
  },
  {
    id: "respiratorio",
    nome: "Respiratório",
    icone: "🫁",
    orientacao: "Digite a manobra respiratória que deseja realizar.",
    exemplos:
      "Ex: auscultar pulmões, percutir tórax, avaliar expansibilidade, padrão...",
  },
  {
    id: "abdominal",
    nome: "Abdominal",
    icone: "🫃",
    orientacao: "Digite a manobra abdominal que deseja realizar.",
    exemplos:
      "Ex: inspecionar, auscultar, percutir, palpação superficial ou profunda...",
  },
  {
    id: "membros",
    nome: "Membros",
    icone: "🦵",
    orientacao: "Digite a manobra em membros que deseja realizar.",
    exemplos:
      "Ex: avaliar edema, pulsos, perfusão, cianose, varizes, temperatura...",
  },
];

export default function PainelExameFisico({
  sinaisVitaisSolicitados,
  sinaisVitaisData,
  onSolicitarSinaisVitais,
  caso,
  manobrasSolicitadas,
  onNovaManobra,
  modoOSCE,
}: PainelExameFisicoProps) {
  const [abertaCategoria, setAbertaCategoria] = useState<string | null>("geral");
  const [inputs, setInputs] = useState<Record<string, string>>({
    geral: "",
    cardiovascular: "",
    respiratorio: "",
    abdominal: "",
    membros: "",
  });
  const [loadingCategoria, setLoadingCategoria] = useState<string | null>(null);
  const [erroCategoria, setErroCategoria] = useState<string | null>(null);

  const handleRealizarManobra = async (
    categoria: "geral" | "cardiovascular" | "respiratorio" | "abdominal" | "membros"
  ) => {
    const texto = inputs[categoria].trim();
    if (!texto) return;

    setLoadingCategoria(categoria);
    setErroCategoria(null);

    try {
      // Montar histórico dessa categoria
      const historicoCategoria = manobrasSolicitadas
        .filter((m) => m.categoria === categoria)
        .map((m) => ({
          textDigitado: m.textDigitado,
          resposta: m.resposta,
        }));

      // Chamar API
      const response = await fetch("/api/exame-fisico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          casoId: caso.id,
          categoria,
          comando: texto,
          historico: historicoCategoria,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao processar manobra");
      }

      const data = await response.json();
      const achado = data.achado || "Não foi possível processar esta manobra.";

      const novaManobra: ManobraRealizada = {
        id: `${categoria}-${Date.now()}`,
        categoria,
        textDigitado: texto,
        resposta: achado,
        timestamp: new Date(),
      };

      onNovaManobra(novaManobra);
      setInputs({ ...inputs, [categoria]: "" });
    } catch (error) {
      console.error("Erro ao chamar API de exame físico:", error);
      setErroCategoria(
        "Não foi possível processar esta manobra agora. Tente descrever de outra forma."
      );
    } finally {
      setLoadingCategoria(null);
    }
  };

  const manobrasPorCategoria = manobrasSolicitadas.reduce(
    (acc, m) => {
      if (!acc[m.categoria]) acc[m.categoria] = [];
      acc[m.categoria].push(m);
      return acc;
    },
    {} as Record<string, ManobraRealizada[]>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      {/* Sinais Vitais */}
      <div className="border-l-4 border-green-500 pl-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">Sinais Vitais</h3>
          {sinaisVitaisSolicitados ? (
            <span className="text-green-600 font-semibold">✓ Solicitado</span>
          ) : (
            <button
              onClick={onSolicitarSinaisVitais}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded text-sm transition-colors"
            >
              Solicitar
            </button>
          )}
        </div>

        {sinaisVitaisData && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            <div className="bg-green-50 p-2 rounded text-sm">
              <p className="text-xs text-gray-600">PA</p>
              <p className="font-semibold text-green-700">
                {sinaisVitaisData.pressaoArterial}
              </p>
            </div>
            <div className="bg-green-50 p-2 rounded text-sm">
              <p className="text-xs text-gray-600">FC</p>
              <p className="font-semibold text-green-700">
                {sinaisVitaisData.frequenciaCardiaca} bpm
              </p>
            </div>
            <div className="bg-green-50 p-2 rounded text-sm">
              <p className="text-xs text-gray-600">FR</p>
              <p className="font-semibold text-green-700">
                {sinaisVitaisData.frequenciaRespiratoria} rpm
              </p>
            </div>
            <div className="bg-green-50 p-2 rounded text-sm">
              <p className="text-xs text-gray-600">Temp</p>
              <p className="font-semibold text-green-700">
                {sinaisVitaisData.temperatura}°C
              </p>
            </div>
            <div className="bg-green-50 p-2 rounded text-sm">
              <p className="text-xs text-gray-600">SpO₂</p>
              <p className="font-semibold text-green-700">
                {sinaisVitaisData.saturacaoOxigenio}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Divisor */}
      <div className="border-t-2 my-4"></div>

      {/* Cards de Exame Físico */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Exame Físico</h3>

        {CATEGORIAS.map((cat) => (
          <div key={cat.id} className="border rounded-lg overflow-hidden">
            {/* Header do Card */}
            <button
              onClick={() =>
                setAbertaCategoria(
                  abertaCategoria === cat.id ? null : cat.id
                )
              }
              className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 flex items-center justify-between font-semibold text-gray-800"
            >
              <span>
                {cat.icone} {cat.nome}
              </span>
              <span className="text-sm">
                {abertaCategoria === cat.id ? "▼" : "▶"}
              </span>
            </button>

            {/* Conteúdo do Card */}
            {abertaCategoria === cat.id && (
              <div className="p-4 bg-white space-y-4">
                {/* Orientação */}
                <div>
                  <p className="text-sm text-gray-700 font-semibold mb-2">
                    {cat.orientacao}
                  </p>
                  <p className="text-xs text-gray-500">{cat.exemplos}</p>
                </div>

                {/* Input + Botão */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputs[cat.id]}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        [cat.id]: e.target.value,
                      })
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleRealizarManobra(
                          cat.id as
                            | "geral"
                            | "cardiovascular"
                            | "respiratorio"
                            | "abdominal"
                            | "membros"
                        );
                      }
                    }}
                    placeholder="Digite aqui e pressione Enter ou clique em Realizar"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  />
                  <button
                    onClick={() =>
                      handleRealizarManobra(
                        cat.id as
                          | "geral"
                          | "cardiovascular"
                          | "respiratorio"
                          | "abdominal"
                          | "membros"
                      )
                    }
                    disabled={loadingCategoria === cat.id}
                    className={`font-semibold py-2 px-4 rounded-lg transition-colors whitespace-nowrap ${
                      loadingCategoria === cat.id
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {loadingCategoria === cat.id ? "Carregando..." : "Realizar"}
                  </button>
                </div>

                {/* Mensagem de Erro */}
                {erroCategoria && loadingCategoria === cat.id === false && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded text-red-700 text-sm">
                    ⚠️ {erroCategoria}
                  </div>
                )}

                {/* Histórico da Categoria */}
                {manobrasPorCategoria[cat.id]?.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm font-semibold text-gray-800 mb-3">
                      Histórico ({manobrasPorCategoria[cat.id].length}):
                    </p>
                    <div className="space-y-3">
                      {manobrasPorCategoria[cat.id].map((manobra) => (
                        <div
                          key={manobra.id}
                          className="bg-purple-50 p-3 rounded border-l-4 border-purple-500"
                        >
                          <p className="text-xs text-gray-600 mb-1">
                            <span className="font-semibold">Manobra:</span>{" "}
                            {manobra.textDigitado}
                          </p>
                          <p className="text-sm text-gray-800">
                            {manobra.resposta}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {manobrasPorCategoria[cat.id]?.length === 0 && (
                  <p className="text-sm text-gray-500 italic text-center py-4">
                    Nenhuma manobra realizada nesta categoria ainda
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
