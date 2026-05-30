"use client";

import type { FeedbackOSCE } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";

interface FeedbackOSCEProps {
  feedback: FeedbackOSCE;
  nomePaciente: string;
  tempoDecorrido: number;
}

const SecoesCards = [
  { id: "resumo", icone: "📋", titulo: "Resumo do Caso" },
  { id: "comunicacao", icone: "💬", titulo: "Comunicação Médica" },
  { id: "anamnese", icone: "🎤", titulo: "Anamnese" },
  { id: "exameFisico", icone: "🔍", titulo: "Exame Físico" },
  { id: "sinaisVitais", icone: "📊", titulo: "Sinais Vitais" },
  { id: "diagnostico", icone: "🧠", titulo: "Raciocínio Diagnóstico" },
  { id: "exames", icone: "🧪", titulo: "Exames Complementares" },
  { id: "conduta", icone: "⚕️", titulo: "Conduta" },
  { id: "soap", icone: "📝", titulo: "SOAP" },
  { id: "checklist", icone: "✅", titulo: "Checklist do Examinador" },
  { id: "erros", icone: "⚠️", titulo: "Erros Críticos" },
  { id: "modelo", icone: "✨", titulo: "Resposta Modelo OSCE" },
  { id: "estudo", icone: "📚", titulo: "Plano de Estudo" },
];

export default function FeedbackOSCE({
  feedback,
  nomePaciente,
  tempoDecorrido,
}: FeedbackOSCEProps) {
  const [abertaSecao, setAbertaSecao] = useState<string>("nota");
  const [apertosPlano, setApertosPlano] = useState<Set<number>>(new Set());

  const minutos = Math.floor(tempoDecorrido / 60);
  const segundos = tempoDecorrido % 60;

  const getCorClassificacao = (classificacao: string) => {
    switch (classificacao) {
      case "Excelente":
        return "bg-green-100 text-green-800 border-green-500";
      case "Bom":
        return "bg-blue-100 text-blue-800 border-blue-500";
      case "Regular":
        return "bg-yellow-100 text-yellow-800 border-yellow-500";
      case "Insuficiente":
        return "bg-red-100 text-red-800 border-red-500";
      default:
        return "bg-gray-100 text-gray-800 border-gray-500";
    }
  };

  const renderCondicional = (dados: any[], label: string) => {
    if (!dados || dados.length === 0) {
      return <p className="text-sm text-gray-500 italic">Não houve registro suficiente para avaliar este item.</p>;
    }
    return (
      <div className="space-y-1">
        {dados.map((item, idx) => (
          <p key={idx} className="text-sm text-gray-700">
            • {item}
          </p>
        ))}
      </div>
    );
  };

  const renderSecao = (id: string) => {
    switch (id) {
      case "resumo":
        return (
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-gray-700 mb-1">Diagnóstico Esperado:</p>
              <p className="text-gray-600">{feedback.resumoCaso.diagnosticoEsperado}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-1">Síndrome Principal:</p>
              <p className="text-gray-600">{feedback.resumoCaso.sindromePrincipal}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-2">Achados-Chave:</p>
              {renderCondicional(feedback.resumoCaso.achadosChave, "achados")}
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-1">Raciocínio Esperado:</p>
              <p className="text-gray-600">{feedback.resumoCaso.raciocinioEsperado}</p>
            </div>
          </div>
        );

      case "comunicacao":
        return (
          <div className="space-y-3">
            {feedback.comunicacaoMedica ? (
              <>
                <div>
                  <p className="font-semibold text-green-700 mb-2">✓ Acertos em Comunicação:</p>
                  {renderCondicional(feedback.comunicacaoMedica.acertos, "acertos")}
                </div>
                <div className="border-t pt-3">
                  <p className="font-semibold text-yellow-700 mb-2">⚠️ Pontos de Melhoria:</p>
                  {renderCondicional(feedback.comunicacaoMedica.pontosDeMelhoria, "melhoria")}
                </div>
                <div className="border-t pt-3 bg-blue-50 p-3 rounded">
                  <p className="font-semibold text-gray-700 mb-1">Comentário:</p>
                  <p className="text-gray-600 text-sm">{feedback.comunicacaoMedica.comentario}</p>
                </div>
                {feedback.comunicacaoMedica.exemplosDeFrasesMelhores &&
                  feedback.comunicacaoMedica.exemplosDeFrasesMelhores.length > 0 && (
                    <div className="border-t pt-3 bg-green-50 p-3 rounded">
                      <p className="font-semibold text-green-700 mb-2">💡 Exemplos de Frases Melhores:</p>
                      <div className="space-y-2">
                        {feedback.comunicacaoMedica.exemplosDeFrasesMelhores.map((frase, idx) => (
                          <p key={idx} className="text-sm text-green-800 italic">
                            &ldquo;{frase}&rdquo;
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
              </>
            ) : (
              <p className="text-sm text-gray-500 italic">Avaliação de comunicação não disponível.</p>
            )}
          </div>
        );

      case "anamnese":
        return (
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-green-700 mb-2">✓ Acertos:</p>
              {renderCondicional(feedback.anamnese.acertos, "acertos")}
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-red-700 mb-2">✗ Perguntas Esquecidas:</p>
              {renderCondicional(feedback.anamnese.faltouPerguntar, "faltou")}
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-gray-700 mb-2">⚠️ Perguntas Pouco Úteis:</p>
              {renderCondicional(feedback.anamnese.perguntasPoucoUteis, "pouco úteis")}
            </div>
            <div className="border-t pt-3 bg-blue-50 p-3 rounded">
              <p className="font-semibold text-gray-700 mb-1">Comentário:</p>
              <p className="text-gray-600 text-sm">{feedback.anamnese.comentario}</p>
            </div>
          </div>
        );

      case "exameFisico":
        return (
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-green-700 mb-2">✓ Manobras Realizadas:</p>
              {renderCondicional(feedback.exameFisico.manobrasRealizadas, "realizadas")}
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-green-700 mb-2">✓ Achados Encontrados:</p>
              {renderCondicional(feedback.exameFisico.achadosEncontrados, "achados")}
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-red-700 mb-2">✗ Manobras Esquecidas:</p>
              {renderCondicional(feedback.exameFisico.manobrasEsquecidas, "esquecidas")}
            </div>
            <div className="border-t pt-3 bg-blue-50 p-3 rounded">
              <p className="font-semibold text-gray-700 mb-1">Comentário:</p>
              <p className="text-gray-600 text-sm">{feedback.exameFisico.comentario}</p>
            </div>
          </div>
        );

      case "sinaisVitais":
        return (
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded">
              <p className="font-semibold text-gray-700 mb-1">Interpretação:</p>
              <p className="text-gray-600 text-sm">{feedback.sinaisVitais.interpretacao}</p>
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-red-700 mb-2">⚠️ Pontos de Alerta:</p>
              {renderCondicional(feedback.sinaisVitais.pontosDeAlerta, "alertas")}
            </div>
          </div>
        );

      case "diagnostico":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded">
                <p className="font-semibold text-sm text-gray-700">Hipótese do Estudante:</p>
                <p className="text-sm text-gray-600 mt-1">{feedback.raciocinioDiagnostico.hipoteseDoEstudante}</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="font-semibold text-sm text-gray-700">Diagnóstico Esperado:</p>
                <p className="text-sm text-gray-600 mt-1">{feedback.raciocinioDiagnostico.diagnosticoEsperado}</p>
              </div>
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-gray-700 mb-1">Avaliação:</p>
              <p className="text-gray-600 text-sm">{feedback.raciocinioDiagnostico.avaliacao}</p>
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-green-700 mb-2">✓ Diferenciais Adequados:</p>
              {renderCondicional(feedback.raciocinioDiagnostico.diferenciaisAdequados, "adequados")}
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-red-700 mb-2">✗ Diferenciais Faltantes:</p>
              {renderCondicional(feedback.raciocinioDiagnostico.diferenciaisFaltantes, "faltantes")}
            </div>
            <div className="border-t pt-3 bg-blue-50 p-3 rounded">
              <p className="font-semibold text-gray-700 mb-1">Comentário:</p>
              <p className="text-gray-600 text-sm">{feedback.raciocinioDiagnostico.comentario}</p>
            </div>
          </div>
        );

      case "exames":
        return (
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-green-700 mb-2">✓ Exames Adequados:</p>
              {renderCondicional(feedback.examesComplementares.adequados, "adequados")}
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-red-700 mb-2">✗ Exames Faltantes:</p>
              {renderCondicional(feedback.examesComplementares.faltantes, "faltantes")}
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-yellow-700 mb-2">⚠️ Exames Desnecessários:</p>
              {renderCondicional(feedback.examesComplementares.desnecessarios, "desnecessários")}
            </div>
            <div className="border-t pt-3 bg-blue-50 p-3 rounded">
              <p className="font-semibold text-gray-700 mb-1">Comentário:</p>
              <p className="text-gray-600 text-sm">{feedback.examesComplementares.comentario}</p>
            </div>
          </div>
        );

      case "conduta":
        return (
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-green-700 mb-2">✓ Condutas Adequadas:</p>
              {renderCondicional(feedback.conduta.adequada, "adequada")}
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-yellow-700 mb-2">⚠️ Condutas Incompletas:</p>
              {renderCondicional(feedback.conduta.incompleta, "incompleta")}
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-red-700 mb-2">✗ Erros de Conduta:</p>
              {renderCondicional(feedback.conduta.erros, "erros")}
            </div>
            <div className="border-t pt-3 bg-green-50 p-3 rounded">
              <p className="font-semibold text-gray-700 mb-1">Conduta Modelo:</p>
              <p className="text-gray-600 text-sm">{feedback.conduta.condutaModelo}</p>
            </div>
          </div>
        );

      case "soap":
        return (
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded">
              <p className="font-semibold text-gray-700 mb-1">S (Subjetivo):</p>
              <p className="text-gray-600 text-sm">{feedback.soap.subjetivo || "(não preenchido)"}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="font-semibold text-gray-700 mb-1">O (Objetivo):</p>
              <p className="text-gray-600 text-sm">{feedback.soap.objetivo || "(não preenchido)"}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="font-semibold text-gray-700 mb-1">A (Avaliação):</p>
              <p className="text-gray-600 text-sm">{feedback.soap.avaliacao || "(não preenchido)"}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="font-semibold text-gray-700 mb-1">P (Plano):</p>
              <p className="text-gray-600 text-sm">{feedback.soap.plano || "(não preenchido)"}</p>
            </div>
            <div className="border-t pt-3 bg-yellow-50 p-3 rounded">
              <p className="font-semibold text-gray-700 mb-1">Comentário Geral:</p>
              <p className="text-gray-600 text-sm">{feedback.soap.comentarioGeral}</p>
            </div>
          </div>
        );

      case "erros":
        return (
          <div>
            {feedback.errosCriticos.length > 0 ? (
              <div className="space-y-2">
                {feedback.errosCriticos.map((erro, idx) => (
                  <div key={idx} className="bg-red-50 p-3 rounded border-l-4 border-red-500">
                    <p className="text-sm text-red-800">⚠️ {erro}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-green-700">✓ Nenhum erro crítico identificado!</p>
            )}
          </div>
        );

      case "modelo":
        return (
          <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
            <p className="font-semibold text-gray-700 mb-2">Resposta Modelo:</p>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {feedback.respostaModeloOSCE}
            </p>
          </div>
        );

      case "checklist":
        return (
          <div>
            {feedback.checklistExaminador ? (
              <div className="space-y-4">
                {feedback.checklistExaminador.oQueProfessorQuer && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                    <p className="font-semibold text-amber-900 mb-2">👨‍🏫 O que o Professor Quer:</p>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      "{feedback.checklistExaminador.oQueProfessorQuer}"
                    </p>
                  </div>
                )}

                {feedback.checklistExaminador.itensCumpridos.length > 0 && (
                  <div>
                    <p className="font-semibold text-green-700 mb-2">
                      ✓ Itens Cumpridos ({feedback.checklistExaminador.itensCumpridos.length})
                    </p>
                    <div className="space-y-1">
                      {feedback.checklistExaminador.itensCumpridos.map((item, idx) => (
                        <p key={idx} className="text-sm text-green-700">
                          ✓ {item}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {feedback.checklistExaminador.itensNaoCumpridos.length > 0 && (
                  <div>
                    <p className="font-semibold text-red-700 mb-2">
                      ✗ Itens NÃO Cumpridos ({feedback.checklistExaminador.itensNaoCumpridos.length})
                    </p>
                    <div className="space-y-1">
                      {feedback.checklistExaminador.itensNaoCumpridos.map((item, idx) => (
                        <p key={idx} className="text-sm text-red-700">
                          ✗ {item}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {feedback.checklistExaminador.comentario && (
                  <div className="bg-blue-50 p-3 rounded border-t pt-3">
                    <p className="font-semibold text-gray-700 mb-1">📌 Comentário:</p>
                    <p className="text-sm text-gray-600">{feedback.checklistExaminador.comentario}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Checklist não disponível para este caso.</p>
            )}
          </div>
        );

      case "estudo":
        return (
          <div>
            {feedback.planoDeEstudo.length > 0 ? (
              <div className="space-y-2">
                {feedback.planoDeEstudo.map((item, idx) => {
                  // Normalizar item: pode ser string ou objeto
                  const isObject = typeof item === "object" && item !== null;
                  const topico = isObject ? (item as any).topico : item;
                  const explicacao = isObject ? (item as any).explicacao : "";
                  const isAberto = apertosPlano.has(idx);

                  return (
                    <div
                      key={idx}
                      className="bg-purple-50 border-l-4 border-purple-500 rounded overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          const novo = new Set(apertosPlano);
                          if (novo.has(idx)) {
                            novo.delete(idx);
                          } else {
                            novo.add(idx);
                          }
                          setApertosPlano(novo);
                        }}
                        className="w-full text-left p-3 hover:bg-purple-100 transition-colors flex justify-between items-center"
                      >
                        <span className="text-sm font-semibold text-purple-900">
                          {idx + 1}. {topico}
                        </span>
                        <span className="text-purple-600 text-lg">
                          {isAberto ? "▼" : "▶"}
                        </span>
                      </button>

                      {isAberto && explicacao && (
                        <div className="bg-white px-3 pb-3 pt-0 border-t border-purple-200">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {explicacao}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Plano de estudo não disponível.</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-8 space-y-4 sm:space-y-6">
      {/* Header com Nota */}
      <div className="border-b pb-4 sm:pb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Feedback do Atendimento</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Paciente: <span className="font-semibold">{nomePaciente}</span> • Tempo:{" "}
          <span className="font-semibold">
            {minutos}m {segundos}s
          </span>
        </p>
      </div>

      {/* Nota Principal */}
      <div
        className={`rounded-lg p-6 sm:p-8 text-center border-2 ${getCorClassificacao(
          feedback.classificacao
        )}`}
      >
        <p className="text-xs sm:text-sm font-semibold opacity-75 mb-2">SUA NOTA</p>
        <p className="text-5xl sm:text-6xl font-bold mb-2">{feedback.nota.toFixed(1)}</p>
        <p className="text-base sm:text-lg font-bold mb-3">{feedback.classificacao}</p>
        <p className="text-sm">{feedback.percentual}%</p>
        <p className="text-xs sm:text-sm mt-3 leading-relaxed">{feedback.justificativaNota}</p>
      </div>

      {/* Seções do Feedback */}
      <div className="space-y-3">
        {SecoesCards.map((secao) => (
          <div key={secao.id} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setAbertaSecao(abertaSecao === secao.id ? "none" : secao.id)}
              className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 flex items-center justify-between font-semibold text-gray-800"
            >
              <span>
                {secao.icone} {secao.titulo}
              </span>
              <span className="text-sm">{abertaSecao === secao.id ? "▼" : "▶"}</span>
            </button>
            {abertaSecao === secao.id && (
              <div className="p-6 bg-white space-y-3">
                {renderSecao(secao.id)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
        <Link href="/" className="flex-1">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            Voltar aos Casos
          </button>
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Repetir Este Caso
        </button>
      </div>
    </div>
  );
}
