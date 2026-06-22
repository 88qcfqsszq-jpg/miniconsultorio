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

import React, { useState, useCallback, useEffect } from "react";
import type { Caso } from "@/lib/types";
import RadiologyImageViewer from "./RadiologyImageViewer";
import type {
  GabaritoRadiologico,
  RespostaAlunoImagem,
  FeedbackImagemRadiologica,
  ImagemRadiologica,
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
  const [imagemOpenI, setImagemOpenI] = useState<ImagemRadiologica | null>(null);
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
  // EFEITO: Buscar imagens do Open-i com filtro de relevância
  // ========================================================================

  // Filtro para validar se a imagem é relevante para o diagnóstico
  const isImageRelevantForDiagnosis = (imagem: ImagemRadiologica, diagnosticoLower: string): boolean => {
    const textosAVerificar = [
      imagem.diagnosticoRadiologico?.toLowerCase() || "",
      imagem.achadoPrincipal?.toLowerCase() || "",
      (imagem.metadadosOriginais?.impression as string)?.toLowerCase() || "",
      (imagem.metadadosOriginais?.caption as string)?.toLowerCase() || "",
      Array.isArray(imagem.metadadosOriginais?.Problems)
        ? (imagem.metadadosOriginais.Problems as string[]).join(" ").toLowerCase()
        : "",
    ].join(" ");

    // Termos a evitar (diagnósticos não-relacionados)
    const termosBloqueados = [
      "pneumoperitoneum",
      "free intraperitoneal air",
      "bowel obstruction",
      "fracture",
      "bone",
    ];

    // Se tem termo bloqueado, rejeitar
    if (termosBloqueados.some(termo => textosAVerificar.includes(termo))) {
      return false;
    }

    // Para pneumonia, buscar termos específicos
    if (diagnosticoLower.includes("pneumonia") || diagnosticoLower.includes("pac")) {
      const termosPositivos = ["pneumonia", "infiltrate", "consolidation", "airspace opacity", "pulmonary"];
      return termosPositivos.some(termo => textosAVerificar.includes(termo));
    }

    // Para outros diagnósticos, aceitar se tem algum match no texto
    return textosAVerificar.length > 0;
  };

  useEffect(() => {
    // Se já tem imagem no caso, não fazer nada
    if (caso.imagemRadiologica) {
      return;
    }

    // Buscar do Open-i
    const buscarImagemOpenI = async () => {
      try {
        setEstadoVisual("carregando-imagem");

        // Obter diagnóstico do caso
        const diagnostico =
          caso.dados_ocultos_do_sistema?.diagnostico_principal ||
          caso.dados_visiveis_ao_estudante?.queixa_principal ||
          "radiografia de tórax"; // Fallback genérico

        const urlApiCall = `/api/exams/references?diagnosis=${encodeURIComponent(diagnostico)}&limit=3`;

        const response = await fetch(urlApiCall);

        if (!response.ok) {
          setEstadoVisual("sem-imagem");
          return;
        }

        const dados = await response.json();

        if (!dados.sucesso || !dados.imagens || dados.imagens.length === 0) {
          setEstadoVisual("sem-imagem");
          return;
        }

        // Filtrar imagens por relevância
        const imagensRelevantes = dados.imagens.filter((img: ImagemRadiologica) =>
          isImageRelevantForDiagnosis(img, diagnostico.toLowerCase())
        );

        // Usar primeira imagem relevante, ou primeira se nenhuma passou no filtro
        const imagem = imagensRelevantes.length > 0 ? imagensRelevantes[0] : dados.imagens[0];

        if (!imagem.imageUrl) {
          setEstadoVisual("sem-imagem");
          return;
        }

        setImagemOpenI(imagem);
        setEstadoVisual("imagem-carregada");
      } catch (erro) {
        setEstadoVisual("sem-imagem");
      }
    };

    buscarImagemOpenI();
  }, [caso]);

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
    if (!imagemParaUsar) return;

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
            imagemSelecionada: imagemParaUsar,
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
            imageId: imagemParaUsar!.imageId,
            tentativa: tentativasEnviadas + 1,
            descricaoExame: resposta.descricaoExame,
            achadoPrincipal: resposta.achadoPrincipal,
            hipoteseDiagnostica: resposta.hipoteseDiagnostica,
            dataResposta: new Date().toISOString(),
          },
          casoClinico: caso,
          imagemSelecionada: imagemParaUsar,
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
            imagemSelecionada: imagemParaUsar,
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

  const imagemParaUsar = caso.imagemRadiologica || imagemOpenI;

  // Se temos imagem Open-i, renderizar
  if (imagemOpenI && imagemOpenI.imageUrl) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <img
          src={imagemOpenI.imageUrl}
          alt="Radiografia"
          style={{
            maxWidth: "100%",
            height: "auto",
            maxHeight: "500px",
            borderRadius: "8px",
            marginBottom: "1rem"
          }}
        />

        <div style={{ fontSize: "12px", color: "#666", marginTop: "1rem", padding: "8px", background: "#f5f5f5", borderRadius: "4px" }}>
          <p><strong>Diagnóstico:</strong> {imagemOpenI.diagnosticoRadiologico}</p>
          <p><strong>Fonte:</strong> {imagemOpenI.fonte}</p>
          <p><strong>Atribuição:</strong> {imagemOpenI.atribuicao}</p>
        </div>
      </div>
    );
  }

  // Fallback quando sem imagem
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
      <p className="text-slate-500 text-sm">
        Imagem radiológica indisponível para este caso.
      </p>
      <p className="text-slate-400 text-xs mt-2">
        Fonte: Open-i / Indiana University Chest X-ray Collection. Imagens usadas para fins educacionais.
      </p>
    </div>
  );
};

export default PainelAnaliseImagem;
