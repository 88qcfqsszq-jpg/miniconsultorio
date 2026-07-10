"use client";

// ============================================================================
// CentroClinicoPage — "Centro de Conhecimento Clínico".
// Central de estudo do MEDIX (guia, semiologia, fluxos, exames, imagens, sons,
// checklist, especialidades, casos modelo, erros comuns, Professor IA).
// Segue a estética do Dashboard/Guia. Sidebar e espaçamento vêm do AppShell.
// Conteúdo majoritariamente estático (base p/ evoluir com rotas/dados depois).
// Botões OSCE reutilizam urlOSCEAleatorio (helper compartilhado). Sem lógica clínica.
// ============================================================================

import { useRouter } from "next/navigation";
import { useIniciarOsce } from "@/hooks/useIniciarOsce";
import "./CentroClinicoPage.css";

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function Alert() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L14.7 3.9a2 2 0 00-3.4 0z" />
    </svg>
  );
}
function Sound() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5L6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 010 7M19 5a9 9 0 010 14" />
    </svg>
  );
}

// ---- dados (estáticos por enquanto) --------------------------------------
const NOTA_MAXIMA = [
  { ico: "⏱️", t: "Primeiros 30 segundos", d: "Apresente-se, higienize as mãos, confirme a identificação e explique o atendimento." },
  { ico: "🤝", t: "Comunicação e postura", d: "Empatia, contato visual, linguagem acessível e escuta ativa somam pontos." },
  { ico: "🩺", t: "Anamnese dirigida", d: "Pergunta aberta inicial e depois HDA completa, sem pular antecedentes." },
  { ico: "🔍", t: "Exame físico objetivo", d: "Direcionado à queixa, com manobras corretas e sinais vitais sempre." },
  { ico: "🧠", t: "Hipóteses diagnósticas", d: "Levante diferenciais coerentes e priorize as mais prováveis e graves." },
  { ico: "🧪", t: "Exames bem justificados", d: "Peça o necessário e explique por que cada exame muda a conduta." },
  { ico: "💊", t: "Conduta segura", d: "Trate o mais grave primeiro; defina medidas, doses e reavaliação." },
  { ico: "✅", t: "Fechamento da consulta", d: "Explique o plano ao paciente, tire dúvidas e encerre com empatia." },
];

const SEMIOLOGIA = [
  { ico: "🫀", t: "Cardiologia", tags: ["bulhas", "sopros", "pulsos", "turgência jugular", "edema", "ECG"] },
  { ico: "🫁", t: "Pneumologia", tags: ["inspeção", "expansibilidade", "percussão", "ausculta", "sibilos", "crepitações"] },
  { ico: "🧠", t: "Neurologia", tags: ["nível de consciência", "pares cranianos", "força", "sensibilidade", "reflexos"] },
  { ico: "🩻", t: "Abdome", tags: ["inspeção", "ausculta", "percussão", "palpação", "sinais de irritação"] },
  { ico: "🧒", t: "Pediatria", tags: ["sinais de gravidade", "hidratação", "crescimento", "ausculta", "febre"] },
  { ico: "🦠", t: "Infectologia", tags: ["febre", "foco infeccioso", "sepse", "sinais de alarme"] },
  { ico: "🩸", t: "Hematologia", tags: ["palidez", "petéquias", "linfonodos", "hepatoesplenomegalia"] },
  { ico: "🚨", t: "Urgência e Emergência", tags: ["ABCDE", "dor torácica", "dispneia", "choque", "rebaixamento"] },
];

const FLUXOS = [
  { t: "Dor torácica", s: ["ABCDE", "sinais vitais", "ECG", "troponina", "hipóteses", "conduta"] },
  { t: "Dispneia", s: ["ABCDE", "oximetria", "ausculta", "RX tórax", "gasometria", "conduta"] },
  { t: "Febre", s: ["sinais vitais", "foco infeccioso", "exames dirigidos", "hipóteses", "conduta"] },
  { t: "Dor abdominal", s: ["sinais vitais", "exame do abdome", "labs + imagem", "hipóteses", "conduta"] },
  { t: "Síncope", s: ["ABCDE", "ECG", "glicemia", "avaliar causa", "estratificar risco", "conduta"] },
  { t: "Cefaleia", s: ["sinais de alarme", "exame neuro", "avaliar TC", "hipóteses", "conduta"] },
  { t: "Vômitos / diarreia", s: ["hidratação", "sinais de alarme", "eletrólitos", "hipóteses", "conduta"] },
  { t: "Criança com febre", s: ["sinais de gravidade", "hidratação", "foco", "exames dirigidos", "conduta"] },
];

const EXAMES = [
  { t: "ECG", q: "Dor torácica, síncope, palpitações, dispneia.", p: "Ritmo, FC, supra/infra ST, ondas Q, bloqueios." },
  { t: "RX de tórax", q: "Dispneia, tosse, dor torácica, febre.", p: "Consolidações, derrame, pneumotórax, área cardíaca." },
  { t: "Hemograma", q: "Febre, palidez, sangramento, infecção.", p: "Anemia, leucocitose/penia, plaquetas." },
  { t: "Gasometria", q: "Insuficiência respiratória, choque, distúrbio ácido-base.", p: "pH, pCO₂, HCO₃, lactato, pO₂." },
  { t: "Troponina", q: "Suspeita de síndrome coronariana aguda.", p: "Curva ascendente, valor de referência do laboratório." },
  { t: "Eletrólitos", q: "Vômitos, diarreia, arritmias, alteração de consciência.", p: "Na, K, Ca, Mg — corrigir distúrbios." },
  { t: "Urina tipo I", q: "Disúria, febre sem foco, dor lombar.", p: "Leucócitos, nitrito, hemácias, cilindros." },
  { t: "Ultrassonografia", q: "Dor abdominal, avaliação de vias biliares/rins.", p: "Cálculos, líquido livre, dilatações." },
  { t: "Tomografia", q: "Trauma, AVC, abdome agudo, TEP.", p: "Sangramentos, isquemia, coleções." },
  { t: "Ecocardiograma", q: "Sopro, insuficiência cardíaca, dor torácica.", p: "Função ventricular, valvas, derrame pericárdico." },
];

const IMAGENS = ["Pneumonia", "Pneumotórax", "Derrame pleural", "Cardiomegalia", "Fratura", "Abdome agudo"];

const SONS = [
  { grupo: "Ausculta pulmonar", itens: ["Murmúrio vesicular", "Sibilos", "Roncos", "Crepitações", "Estridor"] },
  { grupo: "Ausculta cardíaca", itens: ["B1 / B2", "B3 / B4", "Sopro sistólico", "Sopro diastólico", "Atrito pericárdico"] },
];

const CHECKLIST = [
  "Apresentar-se", "Higienizar as mãos", "Confirmar identificação", "Explicar o atendimento",
  "Obter consentimento", "Pergunta aberta inicial", "HDA completa", "Antecedentes",
  "Medicamentos", "Alergias", "Hábitos de vida", "Sinais vitais",
  "Exame físico direcionado", "Hipóteses diagnósticas", "Exames complementares", "Conduta",
  "Orientações ao paciente", "Fechamento empático",
];

const ESPECIALIDADES = [
  { ico: "🫀", t: "Cardiologia" }, { ico: "🫁", t: "Pneumologia" }, { ico: "🧒", t: "Pediatria" },
  { ico: "🦠", t: "Infectologia" }, { ico: "🍽️", t: "Gastroenterologia" }, { ico: "🧠", t: "Neurologia" },
  { ico: "🩸", t: "Hematologia" }, { ico: "🩺", t: "Clínica Médica" }, { ico: "🚨", t: "Urgência e Emergência" },
];

const CASOS_MODELO = [
  "Caso modelo: dor torácica",
  "Caso modelo: dispneia",
  "Caso modelo: febre pediátrica",
  "Caso modelo: dor abdominal",
  "Caso modelo: síncope",
];

const ERROS = [
  "Não perguntar alergias",
  "Esquecer medicamentos em uso",
  "Não solicitar sinais vitais",
  "Pular exame físico",
  "Pedir exames sem justificar",
  "Fechar diagnóstico cedo demais",
  "Não explicar a conduta ao paciente",
  "Não registrar SOAP corretamente",
];

export default function CentroClinicoPage() {
  const router = useRouter();

  const { iniciarOSCE, accessModal } = useIniciarOsce();

  return (
    <div className="centro-clinico-page">
      {/* ===================== 1. HERO ===================== */}
      <section className="cc-hero">
        <span className="cc-hero-badge"><i />CENTRO CLÍNICO</span>
        <h1>Centro de Conhecimento Clínico</h1>
        <p className="cc-hero-sub">
          Estude, revise e domine o raciocínio clínico antes, durante e depois das simulações OSCE.
        </p>
        <div className="cc-hero-chips">
          {["Guia OSCE", "Semiologia", "Fluxos clínicos", "Exames", "Casos modelo"].map((c) => (
            <span key={c} className="cc-hero-chip">{c}</span>
          ))}
        </div>
        <div className="cc-hero-actions">
          <button type="button" className="cc-btn cc-btn-light" onClick={() => router.push("/guia")}>
            Começar pelo Guia OSCE
          </button>
          <button type="button" className="cc-btn cc-btn-ghost" onClick={() => iniciarOSCE("adulto")}>
            Iniciar OSCE Adulto
          </button>
        </div>
      </section>

      {/* ===================== 2. NOTA MÁXIMA ===================== */}
      <section>
        <div className="cc-section-head">
          <p className="cc-eyebrow">Preparação</p>
          <h2 className="cc-title">Como tirar nota máxima no OSCE</h2>
          <p className="cc-sub">O que os avaliadores valorizam em cada etapa da estação.</p>
        </div>
        <div className="cc-grid cc-grid-4">
          {NOTA_MAXIMA.map((c) => (
            <article key={c.t} className="cc-card cc-glass">
              <div className="cc-card-top">
                <span className="cc-card-ico" aria-hidden>{c.ico}</span>
                <h3>{c.t}</h3>
              </div>
              <p>{c.d}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ===================== 3. SEMIOLOGIA ===================== */}
      <section>
        <div className="cc-section-head">
          <p className="cc-eyebrow">Biblioteca</p>
          <h2 className="cc-title">Biblioteca de Semiologia</h2>
          <p className="cc-sub">
            Manobras e achados por sistema, com roteiros práticos e pegadinhas de OSCE.{" "}
            <button type="button" className="cc-link" onClick={() => router.push("/centro-clinico/semiologia")}>
              Abrir biblioteca →
            </button>
          </p>
        </div>
        <div className="cc-grid cc-grid-4">
          {SEMIOLOGIA.map((s) => (
            <article
              key={s.t}
              className="cc-card cc-glass is-clickable"
              role="button"
              tabIndex={0}
              onClick={() => router.push("/centro-clinico/semiologia")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push("/centro-clinico/semiologia");
                }
              }}
            >
              <div className="cc-card-top">
                <span className="cc-card-ico" aria-hidden>{s.ico}</span>
                <h3>{s.t}</h3>
              </div>
              <div className="cc-tags">
                {s.tags.map((tag) => <span key={tag} className="cc-tag">{tag}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===================== 4. FLUXOS ===================== */}
      <section>
        <div className="cc-section-head">
          <p className="cc-eyebrow">Raciocínio</p>
          <h2 className="cc-title">Fluxos clínicos</h2>
          <p className="cc-sub">
            Sequências resumidas para as queixas mais frequentes.{" "}
            <button type="button" className="cc-link" onClick={() => router.push("/centro-clinico/fluxos")}>
              Abrir biblioteca →
            </button>
          </p>
        </div>
        <div className="cc-grid cc-grid-2">
          {FLUXOS.map((f) => (
            <article
              key={f.t}
              className="cc-flow-card cc-glass is-clickable"
              role="button"
              tabIndex={0}
              onClick={() => router.push("/centro-clinico/fluxos")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push("/centro-clinico/fluxos");
                }
              }}
            >
              <h3>{f.t}</h3>
              <div className="cc-flow-steps">
                {f.s.map((step, i) => (
                  <span key={step} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <span className="cc-flow-pill">{step}</span>
                    {i < f.s.length - 1 && <span className="cc-flow-arrow" aria-hidden>→</span>}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===================== 5. EXAMES ===================== */}
      <section>
        <div className="cc-section-head">
          <p className="cc-eyebrow">Biblioteca</p>
          <h2 className="cc-title">Biblioteca de Exames</h2>
          <p className="cc-sub">
            Quando pedir, o que procurar e como justificar no OSCE.{" "}
            <button type="button" className="cc-link" onClick={() => router.push("/centro-clinico/exames")}>
              Abrir biblioteca →
            </button>
          </p>
        </div>
        <div className="cc-grid cc-grid-3">
          {EXAMES.map((e) => (
            <article
              key={e.t}
              className="cc-card cc-glass is-clickable"
              role="button"
              tabIndex={0}
              onClick={() => router.push("/centro-clinico/exames")}
              onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") {
                  ev.preventDefault();
                  router.push("/centro-clinico/exames");
                }
              }}
            >
              <div className="cc-card-top">
                <span className="cc-card-ico" aria-hidden>🧪</span>
                <h3>{e.t}</h3>
              </div>
              <p><strong>Quando:</strong> {e.q}</p>
              <p><strong>O que procurar:</strong> {e.p}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ===================== 6. IMAGENS ===================== */}
      <section>
        <div className="cc-section-head">
          <p className="cc-eyebrow">Biblioteca</p>
          <h2 className="cc-title">Biblioteca de Imagens</h2>
          <p className="cc-sub">
            Atlas interativo com modo estudo e modo treino, usando imagens reais do Open-i.{" "}
            <button type="button" className="cc-link" onClick={() => router.push("/centro-clinico/imagens")}>
              Abrir atlas →
            </button>
          </p>
        </div>
        <div className="cc-grid cc-grid-3">
          {IMAGENS.map((i) => (
            <article
              key={i}
              className="cc-card cc-glass is-clickable"
              role="button"
              tabIndex={0}
              onClick={() => router.push("/centro-clinico/imagens")}
              onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") {
                  ev.preventDefault();
                  router.push("/centro-clinico/imagens");
                }
              }}
            >
              <div className="cc-card-top">
                <span className="cc-card-ico" aria-hidden>🖼️</span>
                <h3>{i}</h3>
              </div>
              <p>Estude o achado e treine a interpretação da imagem.</p>
            </article>
          ))}
        </div>
      </section>

      {/* ===================== 7. SONS ===================== */}
      <section>
        <div className="cc-section-head">
          <p className="cc-eyebrow">Biblioteca</p>
          <h2 className="cc-title">Biblioteca de Sons</h2>
          <p className="cc-sub">
            Ausculta pulmonar e cardíaca com áudios reais, em modo estudo e modo treino.{" "}
            <button type="button" className="cc-link" onClick={() => router.push("/centro-clinico/sons")}>
              Abrir biblioteca →
            </button>
          </p>
        </div>
        <div className="cc-grid cc-grid-2">
          {SONS.map((g) => (
            <article
              key={g.grupo}
              className="cc-card cc-glass is-clickable"
              role="button"
              tabIndex={0}
              onClick={() => router.push("/centro-clinico/sons")}
              onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") {
                  ev.preventDefault();
                  router.push("/centro-clinico/sons");
                }
              }}
            >
              <div className="cc-card-top">
                <span className="cc-card-ico" aria-hidden><Sound /></span>
                <h3>{g.grupo}</h3>
              </div>
              <div className="cc-tags" style={{ gap: 8 }}>
                {g.itens.map((it) => (
                  <span key={it} className="cc-tag">{it}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===================== 8. CHECKLIST ===================== */}
      <section>
        <div className="cc-section-head">
          <p className="cc-eyebrow">Estação</p>
          <h2 className="cc-title">Checklist OSCE</h2>
          <p className="cc-sub">Os itens que não podem faltar em um atendimento completo.</p>
        </div>
        <div className="cc-checklist cc-glass">
          <div className="cc-checklist-grid">
            {CHECKLIST.map((item) => (
              <div key={item} className="cc-check">
                <span className="cc-check-box"><Check /></span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== 9. ESPECIALIDADES ===================== */}
      <section>
        <div className="cc-section-head">
          <p className="cc-eyebrow">Trilhas</p>
          <h2 className="cc-title">Guia por especialidade</h2>
          <p className="cc-sub">Trilhas de estudo por área. Conteúdo em construção.</p>
        </div>
        <div className="cc-grid cc-grid-3">
          {ESPECIALIDADES.map((s) => (
            <article key={s.t} className="cc-card cc-glass is-clickable">
              <div className="cc-card-top">
                <span className="cc-card-ico" aria-hidden>{s.ico}</span>
                <h3>{s.t}</h3>
              </div>
              <p>Trilha de estudo com semiologia, fluxos e casos da especialidade.</p>
              <span className="cc-soon">Em construção</span>
            </article>
          ))}
        </div>
      </section>

      {/* ===================== 10. CASOS MODELO ===================== */}
      <section>
        <div className="cc-section-head">
          <p className="cc-eyebrow">Referência</p>
          <h2 className="cc-title">Casos modelo</h2>
          <p className="cc-sub">Estrutura de um atendimento nota 20, do paciente ao feedback.</p>
        </div>
        <div className="cc-grid cc-grid-2">
          {CASOS_MODELO.map((c) => (
            <article key={c} className="cc-card cc-glass is-clickable">
              <div className="cc-card-top">
                <span className="cc-card-ico" aria-hidden>📋</span>
                <h3>{c}</h3>
              </div>
              <div className="cc-tags">
                {["Paciente", "Anamnese ideal", "Exame físico", "Hipóteses", "Exames", "SOAP", "Feedback nota 20"].map((et) => (
                  <span key={et} className="cc-tag">{et}</span>
                ))}
              </div>
              <span className="cc-soon">Em breve</span>
            </article>
          ))}
        </div>
      </section>

      {/* ===================== 11. ERROS COMUNS ===================== */}
      <section>
        <div className="cc-section-head">
          <p className="cc-eyebrow">Atenção</p>
          <h2 className="cc-title">Erros mais comuns</h2>
          <p className="cc-sub">Deslizes que mais custam pontos — evite todos eles.</p>
        </div>
        <div className="cc-grid cc-grid-2">
          {ERROS.map((e) => (
            <div key={e} className="cc-alert">
              <span className="cc-alert-ico"><Alert /></span>
              <strong>{e}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== 12. PROFESSOR IA ===================== */}
      <section className="cc-professor">
        <span className="cc-hero-badge"><i />PROFESSOR IA</span>
        <h2>Treine com o Professor IA</h2>
        <p>
          Responda perguntas como se estivesse diante de um preceptor: diagnóstico diferencial,
          justificativa dos exames, interpretação dos achados e conduta.
        </p>
        <div className="cc-professor-actions">
          <button type="button" className="cc-btn cc-btn-light" onClick={() => router.push("/guia")}>
            Abrir Guia OSCE
          </button>
          <button type="button" className="cc-btn cc-btn-primary" onClick={() => iniciarOSCE("adulto")}>
            Iniciar OSCE Adulto
          </button>
          <button type="button" className="cc-btn cc-btn-ped" onClick={() => iniciarOSCE("pediatrico")}>
            Iniciar OSCE Pediátrico
          </button>
          <button type="button" className="cc-btn cc-btn-soon" disabled aria-label="Professor IA em breve">
            Professor IA · em breve
          </button>
        </div>
      </section>
      {accessModal}
    </div>
  );
}
