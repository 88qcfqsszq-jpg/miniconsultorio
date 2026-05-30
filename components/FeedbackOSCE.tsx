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

  const renderCondicional = (dados: any[]) => {
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
              {renderCondicional(feedback.resumoCaso.achadosChave)}
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
                  {renderCondicional(feedback.comunicacaoMedica.acertos)}
                </div>
                <div className="border-t pt-3">
                  <p className="font-semibold text-yellow-700 mb-2">⚠️ Pontos de Melhoria:</p>
                  {renderCondicional(feedback.comunicacaoMedica.pontosDeMelhoria)}
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
              {renderCondicional(feedback.anamnese.acertos)}
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-red-700 mb-2">✗ Perguntas Esquecidas:</p>
              {renderCondicional(feedback.anamnese.faltouPerguntar)}
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-gray-700 mb-2">⚠️ Perguntas Pouco Úteis:</p>
              {renderCondicional(feedback.anamnese.perguntasPoucoUteis)}
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
              {renderCondicional(feedback.exameFisico.manobrasRealizadas)}
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-green-700 mb-2">✓ Achados Encontrados:</p>
              {renderCondicional(feedback.exameFisico.achadosEncontrados)}
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-red-700 mb-2">✗ Manobras Esquecidas:</p>
              {renderCondicional(feedback.exameFisico.manobrasEsquecidas)}
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
              {renderCondicional(feedback.sinaisVitais.pontosDeAlerta)}
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
              {renderCondicional(feedback.raciocinioDiagnostico.diferenciaisAdequados)}
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-red-700 mb-2">✗ Diferenciais Faltantes:</p>
              {renderCondicional(feedback.raciocinioDiagnostico.diferenciaisFaltantes)}
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
              {renderCondicional(feedback.examesComplementares.adequados)}
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-red-700 mb-2">✗ Exames Faltantes:</p>
              {renderCondicional(feedback.examesComplementares.faltantes)}
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-yellow-700 mb-2">⚠️ Exames Desnecessários:</p>
              {renderCondicional(feedback.examesComplementares.desnecessarios)}
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
              {renderCondicional(feedback.conduta.adequada)}
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-yellow-700 mb-2">⚠️ Condutas Incompletas:</p>
              {renderCondicional(feedback.conduta.incompleta)}
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold text-red-700 mb-2">✗ Erros de Conduta:</p>
              {renderCondicional(feedback.conduta.erros)}
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

  const badgeClassificacao: Record<string, string> = {
    Excelente:   "bg-emerald-100 text-emerald-800 border-emerald-300",
    Bom:         "bg-blue-100 text-blue-800 border-blue-300",
    Regular:     "bg-amber-100 text-amber-800 border-amber-300",
    Insuficiente:"bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div className="space-y-5 animate-slideUp">
      {/* Card da Nota */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Feedback do Atendimento</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {nomePaciente} • {minutos}m {segundos}s
            </p>
          </div>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold border ${badgeClassificacao[feedback.classificacao] ?? "bg-slate-100 text-slate-700 border-slate-300"}`}>
            {feedback.classificacao}
          </span>
        </div>

        <div className={`rounded-xl p-5 border-2 ${getCorClassificacao(feedback.classificacao)} flex flex-col sm:flex-row sm:items-center gap-4`}>
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold opacity-60 uppercase tracking-wider mb-0.5">Nota Final</p>
            <p className="text-5xl sm:text-6xl font-bold leading-none">{feedback.nota.toFixed(1)}</p>
            <p className="text-sm opacity-70 mt-1">{feedback.percentual}%</p>
          </div>
          {feedback.justificativaNota && (
            <p className="text-sm leading-relaxed flex-1 border-t sm:border-t-0 sm:border-l border-current border-opacity-20 sm:pl-4 pt-3 sm:pt-0 opacity-80">
              {feedback.justificativaNota}
            </p>
          )}
        </div>
      </div>

      {/* Seções */}
      <div className="space-y-2">
        {SecoesCards.map((secao) => {
          const isAberta = abertaSecao === secao.id;
          return (
            <div key={secao.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setAbertaSecao(isAberta ? "none" : secao.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2.5 font-semibold text-slate-700 text-sm">
                  <span className="text-base">{secao.icone}</span>
                  {secao.titulo}
                </span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isAberta ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isAberta && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-3">
                  {renderSecao(secao.id)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="flex-1">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors text-sm active:scale-[0.98]">
            Voltar aos Casos
          </button>
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="flex-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold py-3.5 px-4 rounded-xl transition-colors text-sm active:scale-[0.98]"
        >
          Repetir Este Caso
        </button>
      </div>
    </div>
  );
}
