"use client";

import { useState } from "react";
import type { DiagnosticoFormulario, FormularioSOAP } from "@/lib/types";

interface FormularioSOAPProps {
  onSubmit: (dados: {
    soap: FormularioSOAP;
    diagnostico: DiagnosticoFormulario;
  }) => void;
  desabilitado?: boolean;
}

export default function FormularioSOAP({
  onSubmit,
  desabilitado = false,
}: FormularioSOAPProps) {
  const [soap, setSOAP] = useState<FormularioSOAP>({
    subjetivo: "",
    objetivo: "",
    avaliacao: "",
    plano: "",
  });

  const [diagnostico, setDiagnostico] = useState<DiagnosticoFormulario>({
    hipotesePrincipal: "",
    diagnosticosDisferenciais: [],
    examesIndicados: [],
    conduta: "",
  });

  const [novoDiferencial, setNovoDiferencial] = useState("");
  const [novoExame, setNovoExame] = useState("");

  const handleAdicionarDiferencial = () => {
    if (novoDiferencial.trim()) {
      setDiagnostico((prev) => ({
        ...prev,
        diagnosticosDisferenciais: [
          ...prev.diagnosticosDisferenciais,
          novoDiferencial,
        ],
      }));
      setNovoDiferencial("");
    }
  };

  const handleRemoverDiferencial = (index: number) => {
    setDiagnostico((prev) => ({
      ...prev,
      diagnosticosDisferenciais: prev.diagnosticosDisferenciais.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleAdicionarExame = () => {
    if (novoExame.trim()) {
      setDiagnostico((prev) => ({
        ...prev,
        examesIndicados: [...prev.examesIndicados, novoExame],
      }));
      setNovoExame("");
    }
  };

  const handleRemoverExame = (index: number) => {
    setDiagnostico((prev) => ({
      ...prev,
      examesIndicados: prev.examesIndicados.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !soap.subjetivo.trim() ||
      !soap.objetivo.trim() ||
      !soap.avaliacao.trim() ||
      !soap.plano.trim() ||
      !diagnostico.hipotesePrincipal.trim()
    ) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    onSubmit({ soap, diagnostico });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4 sm:space-y-6"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Avaliação Clínica</h2>

      {/* SOAP */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          SOAP (Método de Registro)
        </h3>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Subjetivo (O que o paciente relata)
          </label>
          <textarea
            value={soap.subjetivo}
            onChange={(e) =>
              setSOAP((prev) => ({ ...prev, subjetivo: e.target.value }))
            }
            placeholder="Resuma o que o paciente contou sobre seus sintomas..."
            disabled={desabilitado}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Objetivo (O que você observou/mediu)
          </label>
          <textarea
            value={soap.objetivo}
            onChange={(e) =>
              setSOAP((prev) => ({ ...prev, objetivo: e.target.value }))
            }
            placeholder="Sinais vitais, achados do exame físico, dados objetivos..."
            disabled={desabilitado}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Avaliação (Sua interpretação)
          </label>
          <textarea
            value={soap.avaliacao}
            onChange={(e) =>
              setSOAP((prev) => ({ ...prev, avaliacao: e.target.value }))
            }
            placeholder="O que você pensa que está acontecendo com o paciente?"
            disabled={desabilitado}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Plano (Como você vai proceder)
          </label>
          <textarea
            value={soap.plano}
            onChange={(e) =>
              setSOAP((prev) => ({ ...prev, plano: e.target.value }))
            }
            placeholder="Exames a solicitar, tratamento, seguimento..."
            disabled={desabilitado}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
            rows={3}
          />
        </div>
      </div>

      {/* Diagnóstico */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-700">
          Diagnóstico e Conduta
        </h3>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Hipótese Diagnóstica Principal *
          </label>
          <input
            type="text"
            value={diagnostico.hipotesePrincipal}
            onChange={(e) =>
              setDiagnostico((prev) => ({
                ...prev,
                hipotesePrincipal: e.target.value,
              }))
            }
            placeholder="Ex: Síndrome Coronariana Aguda"
            disabled={desabilitado}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Diagnósticos Diferenciais
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={novoDiferencial}
              onChange={(e) => setNovoDiferencial(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdicionarDiferencial();
                }
              }}
              placeholder="Digite um diagnóstico diferencial..."
              disabled={desabilitado}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
            />
            <button
              type="button"
              onClick={handleAdicionarDiferencial}
              disabled={desabilitado}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {diagnostico.diagnosticosDisferenciais.map((diff, idx) => (
              <div
                key={idx}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {diff}
                <button
                  type="button"
                  onClick={() => handleRemoverDiferencial(idx)}
                  disabled={desabilitado}
                  className="text-blue-600 hover:text-blue-800 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Exames Indicados
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={novoExame}
              onChange={(e) => setNovoExame(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdicionarExame();
                }
              }}
              placeholder="Ex: ECG, Troponina, Raio X..."
              disabled={desabilitado}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
            />
            <button
              type="button"
              onClick={handleAdicionarExame}
              disabled={desabilitado}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {diagnostico.examesIndicados.map((exame, idx) => (
              <div
                key={idx}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {exame}
                <button
                  type="button"
                  onClick={() => handleRemoverExame(idx)}
                  disabled={desabilitado}
                  className="text-green-600 hover:text-green-800 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Conduta *
          </label>
          <textarea
            value={diagnostico.conduta}
            onChange={(e) =>
              setDiagnostico((prev) => ({ ...prev, conduta: e.target.value }))
            }
            placeholder="Descreva seu plano de tratamento, encaminhamentos, acompanhamento..."
            disabled={desabilitado}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
            rows={3}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={desabilitado}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg"
      >
        Finalizar Atendimento e Ver Feedback
      </button>
    </form>
  );
}
