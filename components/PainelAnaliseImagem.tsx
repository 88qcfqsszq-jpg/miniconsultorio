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
  // PROTEÇÃO: Bloquear apenas termos críticos não-relacionados
  // ========================================================================

  const hasCriticalBlockTerm = (imagem: ImagemRadiologica): boolean => {
    const textosAVerificar = [
      imagem.diagnosticoRadiologico?.toLowerCase() || "",
      imagem.achadoPrincipal?.toLowerCase() || "",
      (imagem.metadadosOriginais?.impression as string)?.toLowerCase() || "",
      (imagem.metadadosOriginais?.caption as string)?.toLowerCase() || "",
      Array.isArray(imagem.metadadosOriginais?.Problems)
        ? (imagem.metadadosOriginais.Problems as string[]).join(" ").toLowerCase()
        : "",
    ].join(" ");

    // Apenas bloquear termos CRÍTICOS não-relacionados
    const termosCriticoBloqueados = [
      "pneumoperitoneum",
      "free intraperitoneal air",
      "bowel obstruction",
    ];

    return termosCriticoBloqueados.some(termo => textosAVerificar.includes(termo));
  };

  useEffect(() => {
    // Se já tem imagem no caso, não fazer nada
    if (caso.imagemRadiologica) {
      return;
    }

    // Buscar do Open-i (TEMPORÁRIO: busca fixa por "pneumonia" sem filtro)
    const buscarImagemOpenI = async () => {
      try {
        setEstadoVisual("carregando-imagem");

        // TEMPORÁRIO: Usar "pneumonia" fixo para testes visuais
        const urlApiCall = `/api/exams/references?diagnosis=pneumonia&limit=3`;

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

        // TEMPORÁRIO: Usar primeira imagem, bloqueando apenas termos críticos
        let imagemSelecionada: ImagemRadiologica | null = null;

        for (const img of dados.imagens) {
          if (!hasCriticalBlockTerm(img)) {
            imagemSelecionada = img;
            break;
          }
        }

        if (!imagemSelecionada || !imagemSelecionada.imageUrl) {
          setEstadoVisual("sem-imagem");
          return;
        }

        setImagemOpenI(imagemSelecionada);
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

  // Se temos imagem, renderizar simples
  if (imagemOpenI && imagemOpenI.imageUrl) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <img
          src={imagemOpenI.imageUrl}
          alt="Chest X-ray Open-i"
          style={{
            maxWidth: "100%",
            height: "auto",
            maxHeight: "500px",
            borderRadius: "8px",
            marginBottom: "1rem"
          }}
        />
        <p style={{ fontSize: "12px", color: "#666", marginTop: "1rem" }}>
          {imagemOpenI.diagnosticoRadiologico}
        </p>
        <p style={{ fontSize: "11px", color: "#999", marginTop: "0.5rem" }}>
          Fonte: Open-i / Indiana University Chest X-ray Collection
        </p>
      </div>
    );
  }

  // Fallback
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
      <p className="text-slate-500 text-sm">
        Imagem radiológica indisponível para este caso.
      </p>
    </div>
  );
};

export default PainelAnaliseImagem;
