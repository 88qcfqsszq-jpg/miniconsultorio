"use client";

// ============================================================================
// ImagensClinicasPage — "Atlas Clínico Interativo" (/centro-clinico/imagens).
// Sistema híbrido: Modo Estudo (imagem + explicação guiada) e Modo Treino
// (imagem sem diagnóstico + perguntas + revelar resposta).
// As imagens REUTILIZAM a integração Open-i já existente via a API interna
// GET /api/openi/raw?query=<termo>&diagnosis=<pt> (sem duplicar lógica, sem
// scraping novo). Fallback: placeholder premium quando indisponível.
// Sidebar/espaçamento vêm do AppShell. Botões OSCE via urlOSCEAleatorio.
// ============================================================================

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useIniciarOsce } from "@/hooks/useIniciarOsce";
import "./ImagensClinicasPage.css";

function Alert() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L14.7 3.9a2 2 0 00-3.4 0z" />
    </svg>
  );
}

type Pato = {
  id: string;
  nome: string;
  query: string;
  diagnosis: string;
  completo: boolean;
  quandoSuspeitar?: string[];
  examePrincipal?: string;
  achados: string[];
  naoConfundir?: string[];
  diferenciais?: string[];
  osce?: string;
  explicacao: string;
  pegadinha?: string;
};

const PATOLOGIAS: Pato[] = [
  {
    id: "pneumonia",
    nome: "Pneumonia",
    query: "pneumonia chest xray consolidation",
    diagnosis: "pneumonia",
    completo: true,
    quandoSuspeitar: ["Febre", "Tosse", "Dispneia", "Dor pleurítica", "Crepitações", "Queda de saturação", "Estado geral comprometido"],
    examePrincipal: "RX de tórax, geralmente PA e perfil quando possível.",
    achados: ["Consolidação", "Infiltrado alveolar", "Broncograma aéreo", "Apagamento de silhuetas", "Derrame pleural associado, se houver"],
    naoConfundir: ["Atelectasia", "Edema pulmonar", "Derrame pleural", "Tuberculose, dependendo do padrão e contexto"],
    diferenciais: ["Atelectasia", "Edema pulmonar", "Tuberculose", "Neoplasia"],
    osce: "Justifique o RX como exame para confirmar o foco pulmonar, avaliar a extensão e procurar complicações.",
    explicacao: "Consolidação alveolar com broncograma aéreo em paciente febril e com tosse é o padrão clássico de pneumonia.",
    pegadinha: "Na pneumonia inicial o RX pode ser pouco evidente — correlacione com a clínica e a saturação.",
  },
  {
    id: "pneumotorax",
    nome: "Pneumotórax",
    query: "pneumothorax chest xray pleural line",
    diagnosis: "pneumotorax",
    completo: true,
    quandoSuspeitar: ["Dor torácica súbita", "Dispneia súbita", "Trauma torácico", "Redução unilateral do murmúrio", "Hipertimpanismo"],
    examePrincipal: "RX de tórax em expiração pode evidenciar melhor a linha pleural.",
    achados: ["Linha pleural visível", "Ausência de trama vascular periférica", "Hipertransparência", "Colapso pulmonar", "Desvio de mediastino se hipertensivo"],
    naoConfundir: ["Bolha enfisematosa gigante", "Prega cutânea", "Enfisema subcutâneo"],
    diferenciais: ["Bolha enfisematosa", "DPOC", "Derrame gasoso"],
    osce: "Diante de instabilidade com suspeita de pneumotórax hipertensivo, a conduta precede o exame de imagem.",
    explicacao: "A linha pleural com ausência de trama vascular além dela define o pneumotórax.",
    pegadinha: "Pneumotórax hipertensivo em paciente instável é diagnóstico clínico e não deve aguardar radiografia.",
  },
  {
    id: "derrame",
    nome: "Derrame pleural",
    query: "pleural effusion chest xray",
    diagnosis: "derrame pleural",
    completo: true,
    quandoSuspeitar: ["Dispneia", "Dor pleurítica", "Redução da expansibilidade", "Macicez à percussão", "Redução do murmúrio na base"],
    examePrincipal: "RX de tórax PA e perfil; decúbito lateral ajuda a estimar volume.",
    achados: ["Velamento de base", "Apagamento do seio costofrênico", "Menisco pleural", "Redução da expansibilidade", "Macicez à percussão"],
    naoConfundir: ["Consolidação basal", "Atelectasia", "Elevação de cúpula diafragmática"],
    diferenciais: ["Pneumonia com derrame", "Insuficiência cardíaca", "Neoplasia"],
    osce: "Justifique o RX para confirmar e estimar o volume; avalie necessidade de toracocentese conforme contexto.",
    explicacao: "O apagamento do seio costofrênico com menisco pleural indica líquido no espaço pleural.",
    pegadinha: "Não confunda velamento de base por derrame com consolidação — o menisco e a mobilidade ajudam a diferenciar.",
  },
  {
    id: "cardiomegalia",
    nome: "Cardiomegalia",
    query: "cardiomegaly chest xray",
    diagnosis: "cardiomegalia",
    completo: true,
    quandoSuspeitar: ["Dispneia", "Ortopneia", "Edema", "Sopro", "Suspeita de insuficiência cardíaca"],
    examePrincipal: "RX de tórax PA (o índice cardiotorácico é confiável em PA, não em AP).",
    achados: ["Aumento da silhueta cardíaca", "Índice cardiotorácico aumentado em PA", "Congestão vascular se associada à IC", "Derrame pleural pode coexistir"],
    naoConfundir: ["RX em AP ou má inspiração (aumenta a silhueta)", "Derrame pericárdico", "Massa mediastinal"],
    diferenciais: ["Insuficiência cardíaca", "Derrame pericárdico", "Cardiopatia estrutural"],
    osce: "Justifique o RX para avaliar a silhueta cardíaca e sinais de congestão; complemente com ECG e ecocardiograma.",
    explicacao: "Índice cardiotorácico acima de 0,5 em incidência PA sugere aumento da área cardíaca.",
    pegadinha: "Índice cardiotorácico só é confiável em PA — em AP ou má inspiração a silhueta parece maior.",
  },
  {
    id: "edema",
    nome: "Edema agudo de pulmão",
    query: "pulmonary edema chest xray",
    diagnosis: "edema agudo de pulmao",
    completo: false,
    achados: ["Congestão vascular", "Redistribuição para ápices", "Linhas B de Kerley", "Infiltrado peri-hilar em asa de borboleta", "Derrame pleural"],
    diferenciais: ["Pneumonia bilateral", "SDRA"],
    explicacao: "Congestão com padrão peri-hilar e linhas B de Kerley sugere edema pulmonar cardiogênico.",
    pegadinha: "Correlacione sempre com a clínica de insuficiência cardíaca e os sinais vitais.",
  },
  {
    id: "atelectasia",
    nome: "Atelectasia",
    query: "atelectasis chest xray",
    diagnosis: "atelectasia",
    completo: false,
    achados: ["Redução volumétrica", "Desvio de estruturas para o lado afetado", "Elevação da cúpula diafragmática", "Aumento da opacidade"],
    diferenciais: ["Consolidação", "Derrame pleural"],
    explicacao: "Perda de volume com desvio de estruturas para o lado acometido caracteriza a atelectasia.",
    pegadinha: "Ao contrário do derrame, a atelectasia puxa as estruturas para o lado afetado.",
  },
  {
    id: "fratura",
    nome: "Fratura",
    query: "rib fracture chest xray",
    diagnosis: "fratura",
    completo: false,
    achados: ["Solução de continuidade óssea", "Desalinhamento", "Avaliar pneumotórax/hemotórax associados"],
    diferenciais: ["Contusão", "Lesão de partes moles"],
    explicacao: "Fraturas de arcos costais podem se associar a pneumotórax e contusão pulmonar.",
    pegadinha: "Procure ativamente complicações (pneumotórax/hemotórax) diante de fratura de arco costal.",
  },
  {
    id: "abdome",
    nome: "Abdome agudo",
    query: "abdominal xray bowel obstruction",
    diagnosis: "abdome agudo",
    completo: false,
    achados: ["Distensão de alças", "Níveis hidroaéreos", "Pneumoperitônio (ar livre) na perfuração", "Ausência de gás distal na obstrução"],
    diferenciais: ["Obstrução", "Perfuração", "Íleo paralítico"],
    explicacao: "Níveis hidroaéreos e distensão de alças sugerem obstrução; ar livre sugere perfuração.",
    pegadinha: "Pneumoperitônio é sinal de perfuração e exige conduta cirúrgica urgente.",
  },
];

const QUESTOES = [
  "Que exame é este?",
  "Quais achados você identifica?",
  "Qual a hipótese principal?",
  "Quais os diferenciais?",
  "Qual o próximo passo?",
];

const INTERPRETAR = [
  "Identifique o exame e a incidência.",
  "Verifique a qualidade técnica.",
  "Observe a simetria.",
  "Procure os achados óbvios.",
  "Compare pulmões, coração, mediastino e ossos.",
  "Relacione com o caso clínico.",
  "Diga o que muda na conduta.",
];

const PEGADINHAS = [
  "Diagnóstico por imagem não substitui a avaliação clínica.",
  "RX normal não exclui TEP.",
  "Pneumotórax hipertensivo instável não espera RX.",
  "Imagem de má qualidade pode induzir a erro.",
  "Sempre correlacione com os sinais vitais.",
  "Não descreva apenas “alterado”; diga o achado.",
];

type ImgState = { loading: boolean; imageUrl?: string; source?: string; warning?: string; term?: string; error?: boolean };

export default function ImagensClinicasPage() {
  const router = useRouter();
  const [modo, setModo] = useState<"estudo" | "treino">("estudo");
  const [selId, setSelId] = useState(PATOLOGIAS[0].id);
  const [revelado, setRevelado] = useState(false);
  const [imgs, setImgs] = useState<Record<string, ImgState>>({});
  const buscados = useRef<Set<string>>(new Set());

  const pato = PATOLOGIAS.find((p) => p.id === selId) ?? PATOLOGIAS[0];

  // reseta a resposta do treino ao trocar de patologia ou de modo
  useEffect(() => { setRevelado(false); }, [selId, modo]);

  // busca a imagem via integração Open-i existente (API interna), uma vez por patologia
  useEffect(() => {
    if (buscados.current.has(pato.id)) return;
    buscados.current.add(pato.id);
    setImgs((s) => ({ ...s, [pato.id]: { loading: true } }));
    const url = `/api/openi/raw?query=${encodeURIComponent(pato.query)}&diagnosis=${encodeURIComponent(pato.diagnosis)}`;
    fetch(url)
      .then((r) => r.json())
      .then((j) => {
        if (j?.success && j?.imageUrl) {
          setImgs((s) => ({ ...s, [pato.id]: { loading: false, imageUrl: j.imageUrl, source: j.source, warning: j.warning, term: j.queryUsada || j.query } }));
        } else {
          setImgs((s) => ({ ...s, [pato.id]: { loading: false, error: true, term: pato.query } }));
        }
      })
      .catch(() => {
        setImgs((s) => ({ ...s, [pato.id]: { loading: false, error: true, term: pato.query } }));
      });
  }, [pato.id, pato.query, pato.diagnosis]);

  const { iniciarOSCE, accessModal } = useIniciarOsce();

  const img = imgs[pato.id];

  return (
    <div className="imagens-page">
      {/* ===================== HERO ===================== */}
      <section className="img-hero">
        <span className="img-hero-badge"><i />ATLAS CLÍNICO</span>
        <h1>Atlas Clínico Interativo</h1>
        <p className="img-hero-sub">
          Estude imagens clínicas reais, reconheça achados importantes e treine interpretação
          como em uma estação OSCE.
        </p>
        <div className="img-hero-cards">
          <div className="img-hero-card"><h3>Modo Estudo</h3><p>Veja a imagem com diagnóstico, achados principais e explicação guiada.</p></div>
          <div className="img-hero-card"><h3>Modo Treino</h3><p>Oculte o diagnóstico, interprete a imagem e revele a resposta comentada.</p></div>
          <div className="img-hero-card"><h3>Imagens reais</h3><p>Integração com Open-i / NLM quando disponível, mantendo a atribuição da fonte.</p></div>
        </div>
      </section>

      {/* ===================== CONTROLES ===================== */}
      <section>
        <div className="img-section-head">
          <p className="img-eyebrow">Interativo</p>
          <h2 className="img-title">Escolha uma patologia</h2>
          <p className="img-sub">Alterne entre estudar com o gabarito ou treinar a interpretação às cegas.</p>
        </div>

        <div className="img-modebar img-glass" role="tablist" aria-label="Modo" style={{ marginTop: 16 }}>
          <button type="button" role="tab" aria-selected={modo === "estudo"} className={`img-mode${modo === "estudo" ? " is-active" : ""}`} onClick={() => setModo("estudo")}>
            Modo Estudo
          </button>
          <button type="button" role="tab" aria-selected={modo === "treino"} className={`img-mode${modo === "treino" ? " is-active" : ""}`} onClick={() => setModo("treino")}>
            Modo Treino
          </button>
        </div>

        <div className="img-selector" style={{ marginTop: 14 }}>
          {PATOLOGIAS.map((p) => (
            <button key={p.id} type="button" className={`img-chip${p.id === selId ? " is-active" : ""}`} onClick={() => setSelId(p.id)}>
              {p.nome}
              {!p.completo && <span className="img-chip-soon">• em expansão</span>}
            </button>
          ))}
        </div>

        {/* ===================== PAINEL ===================== */}
        <div className="img-panel img-glass" style={{ marginTop: 16 }}>
          {/* Figura */}
          <figure className="img-figure" style={{ margin: 0 }}>
            <div className="img-frame">
              {img?.loading && <div className="img-spinner" aria-label="Carregando imagem" />}
              {img && !img.loading && img.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img.imageUrl} alt={modo === "estudo" ? pato.nome : "Imagem para interpretação"} draggable={false} />
              )}
              {img && !img.loading && !img.imageUrl && (
                <div className="img-ph">
                  <span className="img-ph-ico" aria-hidden>🩻</span>
                  <p>Imagem dinâmica via Open-i indisponível no momento. Estrutura pronta para reconectar na próxima etapa.</p>
                </div>
              )}
            </div>
            <figcaption className="img-caption">
              <div className="img-cap-term">🔎 {img?.term || pato.query}</div>
              <div className="img-cap-src">{img?.source || "Open-i / NLM"}</div>
              {img?.warning && <div className="img-cap-warn">⚠️ {img.warning}</div>}
            </figcaption>
          </figure>

          {/* Detalhe */}
          <div className="img-detail">
            {modo === "estudo" ? (
              <>
                <span className="img-detail-badge is-estudo">Estudo</span>
                <h2>{pato.nome}</h2>
                {!pato.completo && (
                  <div className="img-note"><strong>Conteúdo em expansão.</strong> Achados essenciais já disponíveis; explicação guiada completa nas próximas atualizações.</div>
                )}
                {pato.quandoSuspeitar && (
                  <div><p className="img-block-label"><span />Quando suspeitar</p>
                    <ul className="img-list">{pato.quandoSuspeitar.map((x) => <li key={x}>{x}</li>)}</ul></div>
                )}
                {pato.examePrincipal && (
                  <div className="img-note"><strong>Exame principal:</strong> {pato.examePrincipal}</div>
                )}
                <div className="img-cols">
                  <div><p className="img-block-label"><span />Achados que procurar</p>
                    <ul className="img-list">{pato.achados.map((x) => <li key={x}>{x}</li>)}</ul></div>
                  {pato.naoConfundir && (
                    <div><p className="img-block-label"><span />O que não confundir</p>
                      <ul className="img-list">{pato.naoConfundir.map((x) => <li key={x}>{x}</li>)}</ul></div>
                  )}
                </div>
                {pato.osce && (
                  <div className="img-note"><strong>No OSCE:</strong> {pato.osce}</div>
                )}
                {pato.pegadinha && (
                  <div className="img-trap"><strong>Pegadinha:</strong> {pato.pegadinha}</div>
                )}
              </>
            ) : (
              <>
                <span className="img-detail-badge is-treino">Treino</span>
                <h2>Imagem para interpretação</h2>
                <p className="img-sub" style={{ margin: 0 }}>Responda mentalmente antes de revelar o gabarito.</p>
                <ol className="img-quiz">
                  {QUESTOES.map((q, i) => (
                    <li key={q}><b>{i + 1}.</b> {q}</li>
                  ))}
                </ol>
                {!revelado ? (
                  <button type="button" className="img-reveal-btn" onClick={() => setRevelado(true)}>
                    Revelar resposta
                  </button>
                ) : (
                  <div className="img-answer">
                    <div><p className="img-block-label"><span />Diagnóstico</p>
                      <h2 style={{ margin: 0 }}>{pato.nome}</h2></div>
                    <div><p className="img-block-label"><span />Achados principais</p>
                      <ul className="img-list">{pato.achados.map((x) => <li key={x}>{x}</li>)}</ul></div>
                    {pato.diferenciais && (
                      <div><p className="img-block-label"><span />Diferenciais</p>
                        <ul className="img-list">{pato.diferenciais.map((x) => <li key={x}>{x}</li>)}</ul></div>
                    )}
                    <div className="img-note">{pato.explicacao}</div>
                    {pato.pegadinha && <div className="img-trap"><strong>Pegadinha OSCE:</strong> {pato.pegadinha}</div>}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===================== COMO INTERPRETAR ===================== */}
      <section className="img-interpret img-glass">
        <h2>Como interpretar uma imagem no OSCE</h2>
        <div className="img-steps">
          {INTERPRETAR.map((s, i) => (
            <div key={s} className="img-step"><b>{i + 1}</b><span>{s}</span></div>
          ))}
        </div>
      </section>

      {/* ===================== PEGADINHAS ===================== */}
      <section>
        <div className="img-section-head">
          <p className="img-eyebrow">Atenção</p>
          <h2 className="img-title">Pegadinhas</h2>
        </div>
        <div className="img-alerts">
          {PEGADINHAS.map((p) => (
            <div key={p} className="img-alert">
              <span className="img-alert-ico"><Alert /></span>
              <strong>{p}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="img-cta img-glass">
        <h2>Agora treine imagem dentro de um caso clínico</h2>
        <p>
          Entre em uma estação OSCE, solicite exames de imagem quando indicado e interprete os
          achados no contexto do paciente.
        </p>
        <div className="img-cta-actions">
          <button type="button" className="img-btn img-btn-primary" onClick={() => iniciarOSCE("adulto")}>
            Iniciar OSCE Adulto
          </button>
          <button type="button" className="img-btn img-btn-ped" onClick={() => iniciarOSCE("pediatrico")}>
            Iniciar OSCE Pediátrico
          </button>
          <button type="button" className="img-btn img-btn-ghost" onClick={() => router.push("/centro-clinico")}>
            Voltar ao Centro Clínico
          </button>
        </div>
      </section>
      {accessModal}
    </div>
  );
}
