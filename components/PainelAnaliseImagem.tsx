/**
 * PainelAnaliseImagem - Componente principal para análise de imagens radiológicas
 *
 * Layout 3 colunas:
 * - Esquerda: Resumo do caso clínico
 * - Centro: RadiologyImageViewer (RX de tórax)
 * - Direita: Campos de resposta do aluno + feedback
 *
 * Estados:
 * - Sem imagem disponível
 * - Carregando
 * - Imagem carregada
 * - Aguardando resposta do aluno
 * - Corrigindo resposta
 * - Feedback disponível
 * - Gabarito revelado
 */

"use client";

import React, { useState, useCallback } from "react";
import type { Caso } from "@/lib/types";
import RadiologyImageViewer from "./RadiologyImageViewer";
import type {
  GabaritoRadiologico,
  RespostaAlunoImagem,
  FeedbackImagemRadiologica,
} from "@/lib/radiology/types";

// ============================================================================
// TIPOS
// ============================================================================

interface PainelAnaliseImagemProps {
  caso: Caso;
  desabilitado?: boolean;
}

interface EstadoResposta {
  descricaoExame: string;
  achadoPrincipal: string;
  hipoteseDiagnostica: string;
  conduta: string;
}

type EstadoVisual =
  | "sem-imagem"
  | "carregando-imagem"
  | "imagem-carregada"
  | "aguardando-resposta"
  | "corrigindo"
  | "feedback-disponivel"
  | "gabarito-revelado"
  | "erro-imagem";

// ============================================================================
// COMPONENTE
// ============================================================================

export const PainelAnaliseImagem: React.FC<PainelAnaliseImagemProps> = ({
  caso,
  desabilitado = false,
}) => {
  // Estados
  const [estadoVisual, setEstadoVisual] = useState<EstadoVisual>(
    caso.imagemRadiologica ? "carregando-imagem" : "sem-imagem"
  );
  const [resposta, setResposta] = useState<EstadoResposta>({
    descricaoExame: "",
    achadoPrincipal: "",
    hipoteseDiagnostica: "",
    conduta: "",
  });
  const [feedback, setFeedback] = useState<FeedbackImagemRadiologica | null>(
    null
  );
  const [gabarito, setGabarito] = useState<GabaritoRadiologico | null>(null);
  const [tentativasEnviadas, setTentativasEnviadas] = useState(0);
  const [gabaritoBuscado, setGabaritoBuscado] = useState(false);

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleMudancaResposta = useCallback(
    (campo: keyof EstadoResposta, valor: string) => {
      setResposta((prev) => ({
        ...prev,
        [campo]: valor,
      }));
    },
    []
  );

  const handleLimparResposta = useCallback(() => {
    setResposta({
      descricaoExame: "",
      achadoPrincipal: "",
      hipoteseDiagnostica: "",
      conduta: "",
    });
    setFeedback(null);
    setTentativasEnviadas(0);
    setGabaritoBuscado(false);
    setEstadoVisual("imagem-carregada");
  }, []);

  const handleEnviarResposta = useCallback(async () => {
    if (!caso.imagemRadiologica) return;

    setEstadoVisual("corrigindo");

    // Gerar gabarito se não tiver
    let gabaritoUsado = gabarito;
    if (!gabaritoUsado && !gabaritoBuscado) {
      try {
        const resGabarito = await fetch("/api/radiology/gerar-gabarito", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            casoClinico: caso,
            imagemSelecionada: caso.imagemRadiologica,
          }),
        });

        if (resGabarito.ok) {
          const dadosGabarito = await resGabarito.json();
          gabaritoUsado = dadosGabarito.dados;
          setGabarito(gabaritoUsado);
        }
      } catch (erro) {
        console.error("Erro ao gerar gabarito:", erro);
      }
      setGabaritoBuscado(true);
    }

    // Enviar resposta para correção
    try {
      const resCorrecao = await fetch("/api/radiology/corrigir-resposta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          respostaAluno: {
            casoId: caso.id,
            imageId: caso.imagemRadiologica.imageId,
            tentativa: tentativasEnviadas + 1,
            descricaoExame: resposta.descricaoExame,
            achadoPrincipal: resposta.achadoPrincipal,
            hipoteseDiagnostica: resposta.hipoteseDiagnostica,
            dataResposta: new Date().toISOString(),
          },
          casoClinico: caso,
          imagemSelecionada: caso.imagemRadiologica,
          gabarito: gabaritoUsado,
        }),
      });

      if (resCorrecao.ok) {
        const dados = await resCorrecao.json();
        setFeedback(dados.dados);
        setTentativasEnviadas((prev) => prev + 1);
        setEstadoVisual("feedback-disponivel");
      } else {
        setEstadoVisual("imagem-carregada");
      }
    } catch (erro) {
      console.error("Erro ao corrigir resposta:", erro);
      setEstadoVisual("imagem-carregada");
    }
  }, [caso, gabarito, gabaritoBuscado, resposta, tentativasEnviadas]);

  const handleRevelarGabarito = useCallback(async () => {
    if (gabarito) {
      setEstadoVisual("gabarito-revelado");
    } else {
      setEstadoVisual("corrigindo");

      try {
        const res = await fetch("/api/radiology/gerar-gabarito", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            casoClinico: caso,
            imagemSelecionada: caso.imagemRadiologica,
          }),
        });

        if (res.ok) {
          const dados = await res.json();
          setGabarito(dados.dados);
          setEstadoVisual("gabarito-revelado");
        } else {
          setEstadoVisual("feedback-disponivel");
        }
      } catch (erro) {
        console.error("Erro ao gerar gabarito:", erro);
        setEstadoVisual("feedback-disponivel");
      }
    }
  }, [gabarito, caso]);

  const handleErroImagem = useCallback(() => {
    setEstadoVisual("erro-imagem");
  }, []);

  const handleImagemCarregada = useCallback(() => {
    setEstadoVisual("imagem-carregada");
  }, []);

  // ========================================================================
  // RENDERIZAÇÃO: SEM IMAGEM
  // ========================================================================

  if (!caso.imagemRadiologica || estadoVisual === "sem-imagem") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <p className="text-slate-500 text-sm">
          Imagem radiológica indisponível para este caso.
        </p>
      </div>
    );
  }

  // ========================================================================
  // RENDERIZAÇÃO: ERRO
  // ========================================================================

  if (estadoVisual === "erro-imagem") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <p className="text-red-600 text-sm font-medium mb-4">
          Erro ao carregar a imagem radiológica
        </p>
        <p className="text-slate-500 text-xs">
          Tente recarregar a página ou contate o administrador.
        </p>
      </div>
    );
  }

  // ========================================================================
  // RENDERIZAÇÃO: LAYOUT PRINCIPAL (3 colunas)
  // ========================================================================

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* COLUNA ESQUERDA: Resumo do Caso */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Paciente
            </p>
            <p className="text-sm font-bold text-slate-800">
              {caso.paciente.nome}
            </p>
            <p className="text-xs text-slate-500">
              {caso.paciente.idade} anos • {caso.paciente.sexo === "M" ? "M" : "F"}
            </p>
          </div>

          <div className="border-t border-slate-200 pt-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Queixa Principal
            </p>
            <p className="text-sm text-slate-700 mt-1">
              {caso.paciente.queixaPrincipal}
            </p>
          </div>

          {caso.sinaisVitaisCorretos && (
            <div className="border-t border-slate-200 pt-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Sinais Vitais
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2 rounded">
                  <p className="text-slate-500">PA</p>
                  <p className="font-bold text-slate-800">
                    {caso.sinaisVitaisCorretos.pressaoArterial}
                  </p>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <p className="text-slate-500">FC</p>
                  <p className="font-bold text-slate-800">
                    {caso.sinaisVitaisCorretos.frequenciaCardiaca}
                  </p>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <p className="text-slate-500">FR</p>
                  <p className="font-bold text-slate-800">
                    {caso.sinaisVitaisCorretos.frequenciaRespiratoria}
                  </p>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <p className="text-slate-500">SpO₂</p>
                  <p className="font-bold text-slate-800">
                    {caso.sinaisVitaisCorretos.saturacaoOxigenio}%
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-slate-200 pt-3">
            <p className="text-xs text-slate-600 italic">
              📋 Interprete o exame de imagem fornecido.
            </p>
          </div>
        </div>
      </div>

      {/* COLUNA CENTRAL: Viewer RX */}
      <div className="lg:h-[600px]">
        <RadiologyImageViewer
          imageUrl={caso.imagemRadiologica.imageUrl}
          alt="Imagem radiológica"
          fonte={caso.imagemRadiologica.fonte}
          atribuicao={caso.imagemRadiologica.atribuicao}
          integracaoReal={caso.imagemRadiologica.integracaoReal}
          onErroImagem={handleErroImagem}
        />
      </div>

      {/* COLUNA DIREITA: Resposta e Feedback */}
      <div className="space-y-4">
        {/* Aviso Educacional */}
        <div className="bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded-lg p-3 text-xs text-yellow-700">
          ⚠️ Ferramenta educacional. Não usar para diagnóstico real.
        </div>

        {/* Campos de Entrada */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Descrição do Exame
            </label>
            <textarea
              value={resposta.descricaoExame}
              onChange={(e) =>
                handleMudancaResposta("descricaoExame", e.target.value)
              }
              disabled={desabilitado || estadoVisual === "corrigindo"}
              placeholder="Descreva o exame (projeção, qualidade, estruturas visíveis...)"
              className="w-full px-3 py-2 rounded border border-slate-300 text-sm resize-none disabled:bg-slate-50 h-16"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Achado Principal
            </label>
            <input
              type="text"
              value={resposta.achadoPrincipal}
              onChange={(e) =>
                handleMudancaResposta("achadoPrincipal", e.target.value)
              }
              disabled={desabilitado || estadoVisual === "corrigindo"}
              placeholder="Qual o achado mais importante?"
              className="w-full px-3 py-2 rounded border border-slate-300 text-sm disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Hipótese Diagnóstica
            </label>
            <input
              type="text"
              value={resposta.hipoteseDiagnostica}
              onChange={(e) =>
                handleMudancaResposta("hipoteseDiagnostica", e.target.value)
              }
              disabled={desabilitado || estadoVisual === "corrigindo"}
              placeholder="Qual o diagnóstico radiológico?"
              className="w-full px-3 py-2 rounded border border-slate-300 text-sm disabled:bg-slate-50"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Conduta / Comentário (opcional)
            </label>
            <textarea
              value={resposta.conduta}
              onChange={(e) => handleMudancaResposta("conduta", e.target.value)}
              disabled={desabilitado || estadoVisual === "corrigindo"}
              placeholder="Algum comentário ou sugestão de conduta?"
              className="w-full px-3 py-2 rounded border border-slate-300 text-sm resize-none disabled:bg-slate-50 h-12"
            />
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-2">
          <button
            onClick={handleEnviarResposta}
            disabled={
              desabilitado ||
              estadoVisual === "corrigindo" ||
              !resposta.achadoPrincipal.trim() ||
              !resposta.hipoteseDiagnostica.trim()
            }
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {estadoVisual === "corrigindo"
              ? "Corrigindo..."
              : "Enviar Interpretação"}
          </button>

          {tentativasEnviadas > 0 && (
            <button
              onClick={handleRevelarGabarito}
              disabled={desabilitado || estadoVisual === "corrigindo"}
              className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Revelar Gabarito
            </button>
          )}
        </div>

        <button
          onClick={handleLimparResposta}
          disabled={desabilitado}
          className="w-full px-4 py-2 text-slate-600 text-sm font-semibold hover:text-slate-900 hover:bg-slate-100 rounded transition-colors disabled:opacity-50"
        >
          Limpar Resposta
        </button>

        {/* Feedback */}
        {feedback && estadoVisual === "feedback-disponivel" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <div>
                <p className="text-xs font-semibold text-blue-700">Avaliação</p>
                <p className="text-2xl font-bold text-blue-900">
                  {feedback.nota}/10
                </p>
              </div>
            </div>

            {feedback.pontosFortes.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1">
                  Pontos Fortes:
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  {feedback.pontosFortes.map((ponto, i) => (
                    <li key={i}>✓ {ponto}</li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.erros.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1">
                  Áreas de Melhoria:
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  {feedback.erros.map((erro, i) => (
                    <li key={i}>• {erro}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-blue-200 pt-2">
              <p className="text-xs text-slate-600">{feedback.feedback}</p>
            </div>

            {feedback.sugestoesEstudo && feedback.sugestoesEstudo.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1">
                  Sugestões de Estudo:
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  {feedback.sugestoesEstudo.map((sugestao, i) => (
                    <li key={i}>📚 {sugestao}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Gabarito */}
        {gabarito && estadoVisual === "gabarito-revelado" && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold text-emerald-900">
              ✓ Gabarito Comentado
            </p>

            <div>
              <p className="text-xs font-semibold text-slate-700 mb-1">
                Descrição Esperada:
              </p>
              <p className="text-xs text-slate-600">
                {gabarito.descricaoEsperada}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 mb-1">
                Diagnóstico Radiológico:
              </p>
              <p className="text-xs text-slate-600">
                {gabarito.diagnosticoRadiologico}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 mb-1">
                Correlação Clínica:
              </p>
              <p className="text-xs text-slate-600">
                {gabarito.correlacaoClinica}
              </p>
            </div>

            {gabarito.principaisAchados.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1">
                  Achados Principais:
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  {gabarito.principaisAchados.map((achado, i) => (
                    <li key={i}>• {achado}</li>
                  ))}
                </ul>
              </div>
            )}

            {gabarito.pegadinhas.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1">
                  Pegadinhas Comuns:
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  {gabarito.pegadinhas.map((pegadinha, i) => (
                    <li key={i}>⚠️ {pegadinha}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PainelAnaliseImagem;
