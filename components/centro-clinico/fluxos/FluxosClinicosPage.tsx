"use client";

// ============================================================================
// FluxosClinicosPage — "Fluxos Clínicos" (/centro-clinico/fluxos).
// Biblioteca de raciocínio clínico p/ OSCE: fluxogramas em nós conectados,
// hipóteses, sinais de gravidade e pegadinhas por queixa. Segue a estética do
// Centro Clínico / Semiologia. Sidebar e espaçamento vêm do AppShell.
// Botões OSCE reutilizam urlOSCEAleatorio. Conteúdo estático (estudo).
// ============================================================================

import { useRouter } from "next/navigation";
import { urlOSCEAleatorio, type TipoOSCE } from "@/lib/osce/iniciar-osce";
import "./FluxosClinicosPage.css";

function ArrowDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  );
}

type Flow = {
  ico: string;
  nome: string;
  steps: string[];
  hipoteses?: string[];
  grav?: { label: string; itens: string[] };
  pegadinhas?: string[];
};

const FLOWS: Flow[] = [
  {
    ico: "🫀",
    nome: "Dor Torácica",
    steps: ["Dor torácica", "ABCDE", "Sinais vitais", "ECG em até 10 minutos", "Troponina", "Hipóteses", "Conduta inicial"],
    hipoteses: ["IAM", "Pericardite", "TEP", "Dissecção", "Pneumotórax"],
    grav: { label: "Sinais de gravidade", itens: ["Dor em repouso", "Sudorese", "Hipotensão", "Saturação baixa", "Alteração do nível de consciência"] },
    pegadinhas: ["Nunca esquecer o ECG", "Sempre perguntar fatores de risco", "Não dar alta antes de excluir causas graves"],
  },
  {
    ico: "🫁",
    nome: "Dispneia",
    steps: ["ABCDE", "Oxigênio se indicado", "Sinais vitais", "Ausculta", "RX de tórax", "Gasometria quando indicada", "Hipóteses", "Conduta inicial"],
    hipoteses: ["Asma", "DPOC", "Pneumonia", "Edema agudo", "TEP", "Pneumotórax"],
    grav: { label: "Sinais de gravidade", itens: ["Saturação baixa", "Musculatura acessória", "Cianose", "Fala entrecortada", "Rebaixamento de consciência"] },
    pegadinhas: ["Avaliar gravidade antes de perguntas longas", "Saturação normal não exclui doença", "Redução unilateral do murmúrio: pneumotórax ou derrame"],
  },
  {
    ico: "🌡️",
    nome: "Febre",
    steps: ["Estado geral", "Sinais vitais", "Pesquisar foco", "Hemograma", "Culturas quando indicado", "Hipóteses", "Antibioticoterapia quando indicada", "Reavaliação"],
    grav: { label: "Sinais de gravidade", itens: ["Confusão", "Hipotensão", "Petéquias", "Rigidez de nuca", "Sepse"] },
    pegadinhas: ["Febre sem foco: buscar sinais de gravidade", "Perguntar alergias antes do antibiótico", "Culturas não devem atrasar o ATB na sepse"],
  },
  {
    ico: "🩻",
    nome: "Dor abdominal",
    steps: ["ABCDE", "Sinais vitais", "Inspeção", "Ausculta", "Percussão", "Palpação", "Laboratório", "Imagem", "Hipóteses", "Conduta"],
    hipoteses: ["Apendicite", "Colecistite", "Pancreatite", "Perfuração", "Obstrução", "Gestação ectópica"],
    grav: { label: "Sinais de gravidade", itens: ["Abdome em tábua", "Descompressão dolorosa", "Distensão importante", "Hipotensão", "Sinais de peritonite"] },
    pegadinhas: ["Auscultar antes de palpar fundo", "Começar a palpação longe da dor", "Perguntar gravidez quando aplicável"],
  },
  {
    ico: "💫",
    nome: "Síncope",
    steps: ["ABCDE", "Glicemia", "ECG", "História", "Exame físico", "Hipóteses", "Conduta"],
    grav: { label: "Sinais de gravidade", itens: ["Síncope ao esforço", "Palpitações prévias", "História familiar de morte súbita", "ECG alterado", "Trauma associado"] },
    pegadinhas: ["ECG é obrigatório", "Glicemia capilar sempre", "Estratificar risco antes da alta"],
  },
  {
    ico: "🧠",
    nome: "Cefaleia",
    steps: ["Avaliação neurológica", "Red flags", "Fundoscopia quando indicada", "TC quando indicada", "Punção lombar quando indicada", "Conduta"],
    grav: { label: "Red flags", itens: ["Déficit focal", "Febre", "Rigidez de nuca", "Imunossupressão", "Início súbito"] },
    pegadinhas: ["Cefaleia súbita e intensa: pensar em HSA", "Febre + rigidez de nuca: investigar meningite", "Não pedir TC de rotina sem red flags"],
  },
  {
    ico: "🤢",
    nome: "Vômitos / Diarreia",
    steps: ["Estado geral", "Hidratação", "Sinais vitais", "Eletrólitos", "Hipóteses", "Reposição", "Reavaliação"],
    grav: { label: "Sinais de gravidade", itens: ["Desidratação grave", "Hipotensão", "Letargia", "Vômitos incoercíveis", "Sangue nas fezes"] },
    pegadinhas: ["Avaliar o grau de desidratação", "Corrigir eletrólitos", "Reavaliar após a reposição"],
  },
  {
    ico: "🧒",
    nome: "Criança com Febre",
    steps: ["Avaliação ABCDE", "Idade", "Estado geral", "Vacinação", "Foco infeccioso", "Exames quando indicados", "Conduta"],
    grav: { label: "Sinais de gravidade", itens: ["Letargia", "Gemência", "Tiragem", "Convulsão", "Má perfusão"] },
    pegadinhas: ["Considerar idade e peso", "Sinais de gravidade antes do diagnóstico", "Febre em lactente pequeno é alerta"],
  },
];

const HERO_CARDS = ["Reconheça gravidade", "Organize hipóteses", "Escolha os exames certos"];

const PERGUNTAS = [
  "O paciente está grave?",
  "Qual hipótese mata primeiro?",
  "Qual exame muda minha conduta?",
  "O que não posso esquecer?",
  "Minha conduta protege o paciente?",
];

function FlowChart({ flow }: { flow: Flow }) {
  return (
    <div className="flx-flow">
      {flow.steps.map((step, i) => {
        const isHyp = step === "Hipóteses" && !!flow.hipoteses;
        return (
          <div key={`${step}-${i}`} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {isHyp ? (
              <div className="flx-node is-hyp">
                <span className="flx-node-hyp-label">Hipóteses</span>
                <div className="flx-hyp-chips">
                  {flow.hipoteses!.map((h) => <span key={h} className="flx-hyp-chip">{h}</span>)}
                </div>
              </div>
            ) : (
              <div className={`flx-node${i === 0 ? " is-start" : ""}`}>{step}</div>
            )}
            {i < flow.steps.length - 1 && (
              <span className="flx-arrow"><ArrowDown /></span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function FluxosClinicosPage() {
  const router = useRouter();

  const iniciarOSCE = (tipo: TipoOSCE) => {
    const url = urlOSCEAleatorio(tipo);
    if (!url) {
      alert(`Nenhum caso ${tipo} disponível no momento.`);
      return;
    }
    router.push(url);
  };

  return (
    <div className="fluxos-page">
      {/* ===================== HERO ===================== */}
      <section className="flx-hero">
        <span className="flx-hero-badge"><i />FLUXOS CLÍNICOS</span>
        <h1>Fluxos Clínicos</h1>
        <p className="flx-hero-sub">
          Aprenda o raciocínio clínico utilizado nas estações OSCE, organizando rapidamente
          hipóteses, exames e condutas.
        </p>
        <div className="flx-hero-cards">
          {HERO_CARDS.map((c) => (
            <div key={c} className="flx-hero-card"><span aria-hidden>✔</span>{c}</div>
          ))}
        </div>
      </section>

      {/* ===================== FLUXOS ===================== */}
      <section>
        <div className="flx-section-head">
          <p className="flx-eyebrow">Raciocínio</p>
          <h2 className="flx-title">Fluxogramas por queixa</h2>
          <p className="flx-sub">Do primeiro contato à conduta — com sinais de gravidade e pegadinhas de cada fluxo.</p>
        </div>
        <div className="flx-grid">
          {FLOWS.map((flow) => (
            <article key={flow.nome} className="flx-card flx-glass">
              <div className="flx-card-head">
                <span className="flx-card-ico" aria-hidden>{flow.ico}</span>
                <h3>{flow.nome}</h3>
              </div>

              <FlowChart flow={flow} />

              {flow.grav && (
                <div className="flx-block flx-block-grav">
                  <p className="flx-block-label"><span />{flow.grav.label}</p>
                  <ul className="flx-list">
                    {flow.grav.itens.map((g) => <li key={g}>{g}</li>)}
                  </ul>
                </div>
              )}

              {flow.pegadinhas && (
                <div className="flx-block flx-block-trap">
                  <p className="flx-block-label"><span />Pegadinhas de OSCE</p>
                  <ul className="flx-list">
                    {flow.pegadinhas.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* ===================== COMO PENSAR NO OSCE ===================== */}
      <section className="flx-think flx-glass">
        <h2>Como pensar no OSCE</h2>
        <p className="flx-think-sub">As perguntas que você deve fazer a si mesmo em qualquer caso.</p>
        <div className="flx-think-grid">
          {PERGUNTAS.map((q, i) => (
            <div key={q} className="flx-think-q">
              <b>{i + 1}</b>
              <p>{q}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="flx-cta flx-glass">
        <h2>Agora coloque esse raciocínio em prática</h2>
        <p>Treine em uma simulação OSCE com paciente aleatório e feedback estruturado.</p>
        <div className="flx-cta-actions">
          <button type="button" className="flx-btn flx-btn-primary" onClick={() => iniciarOSCE("adulto")}>
            Iniciar OSCE Adulto
          </button>
          <button type="button" className="flx-btn flx-btn-ped" onClick={() => iniciarOSCE("pediatrico")}>
            Iniciar OSCE Pediátrico
          </button>
          <button type="button" className="flx-btn flx-btn-ghost" onClick={() => router.push("/centro-clinico")}>
            Voltar ao Centro Clínico
          </button>
        </div>
      </section>
    </div>
  );
}
