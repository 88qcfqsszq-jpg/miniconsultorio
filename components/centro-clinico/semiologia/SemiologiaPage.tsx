"use client";

// ============================================================================
// SemiologiaPage — "Biblioteca de Semiologia" (/centro-clinico/semiologia).
// Roteiros práticos de exame físico, sinais que mudam conduta e pegadinhas de
// OSCE. Segue a estética do Centro Clínico. Sidebar/espaçamento vêm do AppShell.
// Conteúdo estático (estudo). Botões OSCE reutilizam urlOSCEAleatorio.
// ============================================================================

import { useRouter } from "next/navigation";
import { useIniciarOsce } from "@/hooks/useIniciarOsce";
import "./SemiologiaPage.css";

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

const HERO_CARDS = [
  { t: "Exame físico dirigido", d: "Aprenda a escolher o exame certo conforme a queixa principal, sem fazer uma avaliação genérica e improdutiva." },
  { t: "Sinais que mudam conduta", d: "Reconheça achados que indicam gravidade, urgência, descompensação clínica ou necessidade de investigação imediata." },
  { t: "Pegadinhas de OSCE", d: "Evite perder pontos por esquecer apresentação, consentimento, sinais vitais, exame direcionado ou explicação ao paciente." },
];

const ROTEIRO = [
  {
    t: "Preparação",
    itens: ["Higienizar as mãos", "Apresentar-se", "Confirmar identificação do paciente", "Explicar o que será feito", "Solicitar consentimento", "Garantir privacidade"],
    trap: "Não iniciar exame físico sem consentimento explícito.",
  },
  {
    t: "Avaliação geral",
    itens: ["Estado geral", "Nível de consciência", "Fala e conforto respiratório", "Cor da pele e mucosas", "Hidratação", "Sinais de dor ou sofrimento", "Postura no leito"],
    trap: "Em OSCE, a aparência geral pode valer tanto quanto uma manobra específica.",
  },
  {
    t: "Sinais vitais",
    itens: ["Pressão arterial", "Frequência cardíaca", "Frequência respiratória", "Temperatura", "Saturação de oxigênio", "Glicemia capilar quando indicado", "Dor como quinto sinal vital"],
    trap: "Não interpretar um caso grave sem checar sinais vitais.",
  },
  {
    t: "Inspeção",
    itens: ["Observar antes de tocar", "Simetria", "Deformidades", "Lesões", "Cicatrizes", "Edema", "Cianose", "Uso de musculatura acessória", "Movimentos anormais"],
    trap: "A inspeção começa quando o paciente entra na sala.",
  },
  {
    t: "Palpação",
    itens: ["Temperatura local", "Dor", "Massas", "Pulsos", "Edema", "Expansibilidade", "Frêmitos quando indicado"],
    trap: "Avisar antes de tocar em regiões dolorosas.",
  },
  {
    t: "Percussão",
    itens: ["Usar quando muda conduta", "Tórax: macicez, hipertimpanismo", "Abdome: timpanismo, macicez, ascite", "Comparar lados"],
    trap: "Percussão sem objetivo vira perda de tempo.",
  },
  {
    t: "Ausculta",
    itens: ["Ambiente silencioso", "Comparar lados", "Identificar sons normais e adventícios", "No abdome, auscultar antes de palpar profundamente", "No cardio, avaliar focos e irradiação"],
    trap: "Não dizer apenas “ausculta normal”; descrever o que foi avaliado.",
  },
  {
    t: "Fechamento",
    itens: ["Informar que o exame terminou", "Agradecer", "Deixar o paciente confortável", "Higienizar as mãos", "Explicar próximos passos"],
    trap: "Encerramento empático também pontua.",
  },
];

const SISTEMAS = [
  {
    ico: "🫀",
    nome: "Cardiologia",
    avaliar: ["Estado geral e dispneia", "Pressão arterial e frequência cardíaca", "Pulsos periféricos", "Perfusão capilar", "Turgência jugular", "Ictus cordis", "Bulhas cardíacas", "Sopros", "Edema periférico", "Sinais de congestão pulmonar"],
    sinais: ["Turgência jugular elevada", "B3 em insuficiência cardíaca", "Sopro sistólico ou diastólico", "Edema de membros inferiores", "Extremidades frias", "Pulso irregular", "Dor torácica com sudorese ou dispneia"],
    pegadinhas: ["Em dor torácica, sempre pedir sinais vitais e ECG", "Não esquecer alergias antes de propor medicações", "Na suspeita de IC, examinar pulmões e membros inferiores", "Sopro não é diagnóstico sozinho: foco, intensidade, irradiação e manobras"],
    roteiro: "Inspeção geral → sinais vitais → pulsos → turgência jugular → ictus → ausculta nos focos aórtico, pulmonar, tricúspide e mitral → pulmões → edema periférico.",
  },
  {
    ico: "🫁",
    nome: "Pneumologia",
    avaliar: ["Frequência respiratória", "Saturação de oxigênio", "Uso de musculatura acessória", "Tiragens", "Expansibilidade torácica", "Frêmito toracovocal", "Percussão", "Murmúrio vesicular", "Ruídos adventícios"],
    sinais: ["Sibilos", "Crepitações", "Roncos", "Estridor", "Redução assimétrica do murmúrio vesicular", "Hipertimpanismo", "Macicez", "Cianose", "Fala entrecortada", "Saturação baixa"],
    pegadinhas: ["Dispneia exige avaliar gravidade antes de perguntas longas", "Saturação normal não exclui doença", "Redução unilateral do murmúrio: pneumotórax, derrame ou atelectasia", "Crepitações basais: congestão ou pneumonia, conforme o contexto"],
    roteiro: "Avaliação geral → FR/SatO₂ → inspeção do tórax → expansibilidade → frêmito → percussão comparativa → ausculta comparativa anterior e posterior.",
  },
  {
    ico: "🧠",
    nome: "Neurologia",
    avaliar: ["Nível de consciência", "Orientação", "Fala", "Pupilas", "Pares cranianos", "Força", "Sensibilidade", "Reflexos", "Coordenação", "Marcha", "Sinais meníngeos quando indicado"],
    sinais: ["Rebaixamento do nível de consciência", "Assimetria de força", "Desvio de rima", "Alteração pupilar", "Rigidez de nuca", "Convulsão", "Ataxia", "Afasia", "Confusão aguda"],
    pegadinhas: ["Déficit focal súbito: pensar em AVC até prova em contrário", "Sempre registrar o início dos sintomas na suspeita aguda", "Rastreio dirigido, mas nunca esquecer força, fala e pupilas na urgência", "Glicemia capilar é obrigatória em alteração de consciência"],
    roteiro: "Consciência/orientação → fala → pupilas → pares cranianos básicos → força segmentar → sensibilidade → coordenação → marcha se seguro.",
  },
  {
    ico: "🩻",
    nome: "Abdome",
    avaliar: ["Dor", "Distensão", "Cicatrizes", "Hérnias", "Ruídos hidroaéreos", "Defesa", "Rigidez", "Dor à descompressão", "Massas", "Hepatomegalia", "Esplenomegalia", "Sinais de ascite"],
    sinais: ["Abdome em tábua", "Dor à descompressão brusca", "Defesa involuntária", "Distensão importante", "Icterícia", "Vômitos persistentes", "Sangramento digestivo", "Sinais de desidratação"],
    pegadinhas: ["Auscultar antes da palpação profunda", "Começar a palpação longe da dor", "Sinais de peritonite mudam a conduta", "Em dor abdominal, perguntar gravidez quando aplicável", "Não esquecer exame geral e hidratação"],
    roteiro: "Inspeção → ausculta → percussão → palpação superficial → palpação profunda → sinais específicos conforme hipótese → avaliação de hidratação.",
  },
  {
    ico: "🧒",
    nome: "Pediatria",
    avaliar: ["Aparência geral", "Interação com o cuidador", "Choro, irritabilidade ou letargia", "Hidratação", "Perfusão", "Frequência respiratória", "Tiragens", "Febre", "Peso", "Estado nutricional", "Fontanela em lactentes", "Pele e mucosas"],
    sinais: ["Letargia", "Gemência", "Tiragem", "Cianose", "Recusa alimentar", "Sinais de desidratação", "Extremidades frias", "Enchimento capilar aumentado", "Febre em lactente pequeno", "Convulsão"],
    pegadinhas: ["Sempre considerar idade, peso e relato do responsável", "Não avaliar a criança como um adulto pequeno", "Sinais de gravidade vêm antes do diagnóstico final", "Dose de medicação depende do peso", "Perguntar vacinação e diurese pode ser decisivo"],
    roteiro: "Observar no colo → aparência, respiração e circulação → sinais vitais por idade → hidratação → exame dirigido → orientar o cuidador.",
  },
  {
    ico: "🦠",
    nome: "Infectologia",
    avaliar: ["Febre", "Estado geral", "Sinais de toxemia", "Pele e mucosas", "Linfonodos", "Rigidez de nuca", "Foco respiratório", "Foco urinário", "Foco abdominal", "Exposição epidemiológica", "Vacinação", "Viagens", "Contatos doentes"],
    sinais: ["Febre persistente", "Petéquias ou púrpura", "Rigidez de nuca", "Hipotensão", "Taquicardia desproporcional", "Confusão", "Extremidades frias", "Sinais de desidratação", "Icterícia", "Dispneia"],
    pegadinhas: ["Febre sem foco exige busca ativa de sinais de gravidade", "Petéquias com febre são alerta", "Sempre perguntar alergias antes de antibiótico", "Culturas antes do ATB, mas sem atrasar tratamento na sepse", "Contexto epidemiológico muda a hipótese"],
    roteiro: "Estado geral → sinais vitais → pele/mucosas → linfonodos → rigidez de nuca → respiratório → abdome → geniturinário quando indicado → epidemiologia.",
  },
  {
    ico: "🩸",
    nome: "Hematologia",
    avaliar: ["Palidez", "Icterícia", "Petéquias", "Equimoses", "Sangramentos", "Linfonodos", "Hepatomegalia", "Esplenomegalia", "Dor óssea", "Fadiga", "Febre", "Perda de peso"],
    sinais: ["Palidez intensa", "Sangramento espontâneo", "Petéquias difusas", "Linfonodomegalias generalizadas", "Hepatoesplenomegalia", "Febre persistente", "Perda ponderal", "Dor óssea", "Taquicardia na anemia"],
    pegadinhas: ["Hemograma é central, mas o exame físico orienta a gravidade", "Petéquias não somem à digitopressão", "Descrever linfonodo: local, tamanho, consistência, mobilidade e dor", "Anemia sintomática exige avaliação cardiovascular", "Febre + neutropenia é urgência"],
    roteiro: "Estado geral → pele e mucosas → sinais vitais → linfonodos → abdome (fígado/baço) → sangramentos → avaliação funcional.",
  },
  {
    ico: "🚨",
    nome: "Urgência e Emergência",
    avaliar: ["Via aérea", "Respiração", "Circulação", "Déficit neurológico", "Exposição", "Sinais vitais", "Perfusão", "Saturação", "Glicemia", "Dor", "Risco imediato de morte"],
    sinais: ["Rebaixamento de consciência", "Saturação baixa", "Hipotensão", "Taquicardia importante", "Bradicardia sintomática", "Extremidades frias", "Dor torácica", "Dispneia grave", "Sangramento ativo", "Convulsão", "Sinais de choque"],
    pegadinhas: ["Use ABCDE antes de uma história longa", "Não deixar o instável esperando investigação completa", "Oxigênio, monitorização e acesso venoso podem ser condutas iniciais", "Glicemia capilar em alteração de consciência", "Reavaliar após cada intervenção"],
    roteiro: "ABCDE → sinais vitais → monitorização → acesso venoso quando indicado → hipóteses ameaçadoras à vida → exames urgentes → conduta inicial → reavaliação.",
  },
];

const CHECKLIST = [
  "Higienizei as mãos?", "Apresentei-me?", "Confirmei identificação?", "Pedi consentimento?",
  "Avaliei sinais vitais?", "Fiz exame direcionado à queixa?", "Procurei sinais de gravidade?",
  "Expliquei o que estava fazendo?", "Organizei hipóteses?", "Justifiquei exames?",
  "Orientei o paciente?", "Finalizei com empatia?",
];

function Bloco({ label, itens, warn, cols = false }: { label: string; itens: string[]; warn?: boolean; cols?: boolean }) {
  return (
    <div>
      <p className="sem-block-label">
        <span className={`sem-block-dot${warn ? " is-warn" : ""}`} />
        {label}
      </p>
      <ul className={`sem-list${cols ? "" : " sem-list-1"}`}>
        {itens.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}

export default function SemiologiaPage() {
  const router = useRouter();

  const { iniciarOSCE, accessModal } = useIniciarOsce();

  return (
    <div className="semiologia-page">
      {/* ===================== HERO ===================== */}
      <section className="sem-hero">
        <span className="sem-hero-badge"><i />SEMIOLOGIA</span>
        <h1>Biblioteca de Semiologia</h1>
        <p className="sem-hero-sub">
          Roteiros práticos de exame físico, sinais importantes e pegadinhas para dominar o OSCE.
        </p>
        <div className="sem-hero-cards">
          {HERO_CARDS.map((c) => (
            <div key={c.t} className="sem-hero-card">
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== SEÇÃO 1 — ROTEIRO UNIVERSAL ===================== */}
      <section>
        <div className="sem-section-head">
          <p className="sem-eyebrow">Base</p>
          <h2 className="sem-title">Roteiro universal do exame físico</h2>
          <p className="sem-sub">A sequência que serve para qualquer caso — com a pegadinha de cada etapa.</p>
        </div>
        <div className="sem-steps">
          {ROTEIRO.map((step, i) => (
            <article key={step.t} className="sem-step sem-glass">
              <div className="sem-step-head">
                <span className="sem-step-num">{i + 1}</span>
                <h3>{step.t}</h3>
              </div>
              <ul className="sem-list">
                {step.itens.map((it) => <li key={it}>{it}</li>)}
              </ul>
              <div className="sem-trap">
                <span className="sem-trap-ico" aria-hidden>⚠️</span>
                <span><strong>Pegadinha:</strong> {step.trap}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===================== SEÇÃO 2 — POR SISTEMA ===================== */}
      <section>
        <div className="sem-section-head">
          <p className="sem-eyebrow">Aprofundamento</p>
          <h2 className="sem-title">Semiologia por sistema</h2>
          <p className="sem-sub">O que avaliar, sinais que importam, pegadinhas e um roteiro prático para cada sistema.</p>
        </div>
        <div className="sem-sys-grid">
          {SISTEMAS.map((s) => (
            <article key={s.nome} className="sem-sys-card sem-glass">
              <div className="sem-sys-head">
                <span className="sem-sys-ico" aria-hidden>{s.ico}</span>
                <h3>{s.nome}</h3>
              </div>
              <div className="sem-sys-cols">
                <Bloco label="O que avaliar" itens={s.avaliar} />
                <Bloco label="Sinais importantes" itens={s.sinais} warn />
              </div>
              <div className="sem-block-traps">
                <Bloco label="Pegadinhas de OSCE" itens={s.pegadinhas} warn />
              </div>
              <div className="sem-routine">
                <p className="sem-block-label"><span className="sem-block-dot" />Roteiro prático</p>
                <p>{s.roteiro}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===================== SEÇÃO 3 — CHECKLIST ===================== */}
      <section>
        <div className="sem-section-head">
          <p className="sem-eyebrow">Antes de finalizar</p>
          <h2 className="sem-title">Checklist de ouro</h2>
          <p className="sem-sub">Passe por todos estes itens antes de encerrar a estação.</p>
        </div>
        <div className="sem-checklist sem-glass">
          <div className="sem-checklist-grid">
            {CHECKLIST.map((item) => (
              <div key={item} className="sem-check">
                <span className="sem-check-box"><Check /></span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SEÇÃO 4 — CTA ===================== */}
      <section className="sem-cta sem-glass">
        <h2>Agora aplique a semiologia em um caso real</h2>
        <p>
          Depois de revisar o exame físico, treine em uma simulação OSCE com paciente aleatório
          e feedback estruturado.
        </p>
        <div className="sem-cta-actions">
          <button type="button" className="sem-btn sem-btn-primary" onClick={() => iniciarOSCE("adulto")}>
            Iniciar OSCE Adulto
          </button>
          <button type="button" className="sem-btn sem-btn-ped" onClick={() => iniciarOSCE("pediatrico")}>
            Iniciar OSCE Pediátrico
          </button>
          <button type="button" className="sem-btn sem-btn-ghost" onClick={() => router.push("/centro-clinico")}>
            Voltar ao Centro Clínico
          </button>
        </div>
      </section>
      {accessModal}
    </div>
  );
}
