"use client";

// ============================================================================
// ExamesPage — "Biblioteca de Exames" (/centro-clinico/exames).
// Quando pedir, o que procurar, como justificar e pegadinhas dos principais
// exames em OSCE. Segue a estética do Centro Clínico / Semiologia / Fluxos.
// Sidebar e espaçamento vêm do AppShell. Botões OSCE via urlOSCEAleatorio.
// Conteúdo estático (estudo).
// ============================================================================

import { useRouter } from "next/navigation";
import { useIniciarOsce } from "@/hooks/useIniciarOsce";
import "./ExamesPage.css";

function Alert() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L14.7 3.9a2 2 0 00-3.4 0z" />
    </svg>
  );
}

const HERO_CARDS = [
  { t: "Quando pedir", d: "Solicite exames que mudam conduta, confirmam hipóteses importantes ou avaliam gravidade." },
  { t: "Como justificar", d: "No OSCE, não basta pedir o exame: explique o motivo e o achado esperado." },
  { t: "O que procurar", d: "Interprete o resultado de forma direcionada ao problema clínico do paciente." },
];

const REGRA_OURO = [
  { k: "ECG", q: "Há isquemia, arritmia ou sobrecarga?" },
  { k: "RX tórax", q: "Há consolidação, pneumotórax, congestão ou derrame?" },
  { k: "Hemograma", q: "Há anemia, leucocitose, plaquetopenia ou sinais indiretos de infecção?" },
  { k: "Gasometria", q: "Há hipoxemia, retenção de CO₂ ou distúrbio ácido-base?" },
  { k: "Troponina", q: "Há lesão miocárdica?" },
  { k: "Eletrólitos", q: "Há distúrbio que explique sintomas ou aumente risco?" },
];

type Exame = {
  ico: string;
  nome: string;
  quando: string[];
  procurar: string[];
  justificar: string;
  pegadinhas: string[];
};

const EXAMES: Exame[] = [
  {
    ico: "🫀", nome: "ECG",
    quando: ["Dor torácica", "Palpitações", "Síncope", "Dispneia súbita", "Suspeita de arritmia", "Suspeita de síndrome coronariana aguda", "Distúrbios eletrolíticos relevantes"],
    procurar: ["Supra ou infra de ST", "Alterações de onda T", "Arritmias", "Bloqueios", "Sinais de sobrecarga", "Hiper/hipopotassemia"],
    justificar: "Solicito ECG para avaliar isquemia, arritmias e alterações de condução que possam explicar o quadro.",
    pegadinhas: ["Em dor torácica, o ECG deve ser precoce", "ECG normal não exclui infarto", "Sempre correlacionar com clínica e troponina"],
  },
  {
    ico: "🫁", nome: "RX de tórax",
    quando: ["Dispneia", "Tosse com febre", "Dor torácica pleurítica", "Suspeita de pneumonia", "Suspeita de pneumotórax", "Suspeita de derrame pleural", "Congestão pulmonar", "Trauma torácico"],
    procurar: ["Consolidação", "Hiperinsuflação", "Pneumotórax", "Derrame pleural", "Cardiomegalia", "Congestão vascular", "Desvio de mediastino", "Atelectasia"],
    justificar: "Solicito RX de tórax para investigar alterações pulmonares ou cardíacas compatíveis com a queixa respiratória.",
    pegadinhas: ["RX normal não exclui TEP", "Pneumotórax hipertensivo é clínico: não aguardar RX se instável", "Na pneumonia inicial, o RX pode ser pouco evidente"],
  },
  {
    ico: "🩸", nome: "Hemograma",
    quando: ["Febre", "Suspeita de infecção", "Palidez", "Sangramentos", "Fadiga", "Suspeita de anemia", "Suspeita de leucemia", "Avaliação em quadros sistêmicos"],
    procurar: ["Hemoglobina", "Leucócitos", "Neutrofilia", "Linfocitose", "Plaquetas", "Pancitopenia", "Eosinofilia", "Desvio à esquerda"],
    justificar: "Solicito hemograma para avaliar anemia, resposta inflamatória/infecciosa, plaquetas e possíveis alterações hematológicas.",
    pegadinhas: ["Leucócitos normais não excluem infecção grave", "Plaquetopenia com febre pode indicar gravidade", "Pancitopenia exige investigação"],
  },
  {
    ico: "💨", nome: "Gasometria",
    quando: ["Dispneia importante", "Saturação baixa", "Rebaixamento do nível de consciência", "Insuficiência respiratória", "DPOC descompensado", "Choque", "Acidose metabólica", "Sepse grave"],
    procurar: ["pH", "PaO₂", "PaCO₂", "HCO₃", "Lactato (se disponível)", "Hipoxemia", "Retenção de CO₂", "Acidose ou alcalose"],
    justificar: "Solicito gasometria para avaliar oxigenação, ventilação e distúrbios ácido-base.",
    pegadinhas: ["A saturação não mostra o CO₂", "O paciente com DPOC pode reter CO₂", "Lactato elevado sugere hipoperfusão, mas precisa de contexto"],
  },
  {
    ico: "❤️", nome: "Troponina",
    quando: ["Dor torácica suspeita", "Dispneia com suspeita cardíaca", "ECG alterado", "Suspeita de síndrome coronariana aguda", "Paciente de risco com sintomas equivalentes"],
    procurar: ["Elevação", "Curva de elevação/queda", "Associação com ECG e clínica"],
    justificar: "Solicito troponina para investigar lesão miocárdica no contexto de suspeita de síndrome coronariana aguda.",
    pegadinhas: ["Troponina isolada não define tudo", "Pode elevar em outras condições graves", "Repetir conforme o tempo de sintomas"],
  },
  {
    ico: "🧫", nome: "Eletrólitos e função renal",
    quando: ["Vômitos", "Diarreia", "Desidratação", "Arritmias", "Fraqueza", "Confusão", "Uso de diuréticos", "Insuficiência renal", "Antes de medicações/contraste"],
    procurar: ["Sódio", "Potássio", "Ureia", "Creatinina", "Magnésio (se disponível)", "Hiponatremia", "Hiperpotassemia", "Lesão renal aguda"],
    justificar: "Solicito eletrólitos e função renal para avaliar distúrbios hidroeletrolíticos, risco de arritmia e segurança terapêutica.",
    pegadinhas: ["Hiperpotassemia pode alterar o ECG", "A função renal muda dose e escolha de medicações", "A desidratação pode alterar ureia/creatinina"],
  },
  {
    ico: "🧪", nome: "Urina tipo I",
    quando: ["Disúria", "Febre sem foco", "Dor lombar", "Dor abdominal baixa", "Suspeita de ITU", "Gestante com sintomas urinários", "Criança com febre sem foco quando indicado"],
    procurar: ["Leucócitos", "Nitrito", "Hemácias", "Proteinúria", "Densidade", "Cilindros (se disponíveis)"],
    justificar: "Solicito urina tipo I para investigar infecção urinária, hematúria ou alterações renais.",
    pegadinhas: ["Nitrito negativo não exclui ITU", "Contaminação da amostra é comum", "Na pielonefrite, avaliar estado geral e sinais sistêmicos"],
  },
  {
    ico: "🔊", nome: "Ultrassonografia",
    quando: ["Dor abdominal", "Suspeita biliar", "Suspeita renal", "Gestação", "Avaliação de líquido livre", "Massa abdominal", "Dor pélvica", "Avaliação pediátrica quando indicada"],
    procurar: ["Colelitíase", "Dilatação de vias biliares", "Hidronefrose", "Líquido livre", "Gestação tópica/ectópica", "Alterações hepatoesplênicas"],
    justificar: "Solicito ultrassonografia por ser exame não invasivo e útil para investigar causas abdominais, pélvicas ou urinárias conforme a hipótese.",
    pegadinhas: ["O resultado depende do operador", "Obesidade e gás intestinal podem limitar", "Na instabilidade, a conduta pode preceder o exame definitivo"],
  },
  {
    ico: "🩻", nome: "Tomografia",
    quando: ["Trauma", "Cefaleia com sinais de alarme", "Déficit neurológico", "Suspeita de AVC", "Dor abdominal com gravidade", "Suspeita de TEP (protocolo)", "Complicações infecciosas", "Falha diagnóstica inicial"],
    procurar: ["Sangramento", "Isquemia", "Massa", "Perfuração", "Obstrução", "Abscesso", "Tromboembolismo (angio-TC)", "Complicações"],
    justificar: "Solicito tomografia para avaliar causas graves ou complicações não bem definidas no exame físico ou nos exames iniciais.",
    pegadinhas: ["Nem toda cefaleia precisa de TC", "Avaliar contraste, função renal e alergias", "Paciente instável pode precisar estabilização antes"],
  },
  {
    ico: "📈", nome: "Ecocardiograma",
    quando: ["Suspeita de insuficiência cardíaca", "Sopro novo", "Suspeita de valvopatia", "Suspeita de endocardite", "Dor torácica com suspeita estrutural", "Dispneia de causa cardíaca", "Avaliar fração de ejeção", "Derrame pericárdico"],
    procurar: ["Fração de ejeção", "Alterações segmentares", "Valvopatias", "Vegetações", "Derrame pericárdico", "Hipertensão pulmonar", "Dilatação de câmaras"],
    justificar: "Solicito ecocardiograma para avaliar função cardíaca, valvas, câmaras e possíveis alterações estruturais relacionadas ao quadro.",
    pegadinhas: ["O eco não substitui ECG/troponina na dor torácica aguda", "Endocardite depende de contexto clínico e hemoculturas", "Derrame pericárdico grave pode exigir conduta imediata"],
  },
];

const SINDROMES = [
  { ico: "🫀", nome: "Dor torácica", exames: ["ECG", "Troponina", "RX tórax", "Hemograma e eletrólitos conforme contexto"] },
  { ico: "🫁", nome: "Dispneia", exames: ["Saturação", "RX tórax", "Gasometria se grave", "ECG", "Hemograma conforme suspeita"] },
  { ico: "🌡️", nome: "Febre", exames: ["Hemograma", "PCR/procalcitonina se disponível", "Urina tipo I", "RX tórax se sintomas respiratórios", "Culturas se sepse"] },
  { ico: "🩻", nome: "Dor abdominal", exames: ["Hemograma", "Eletrólitos", "Função renal", "Urina tipo I", "Beta-hCG quando aplicável", "USG ou TC conforme hipótese"] },
  { ico: "💫", nome: "Síncope", exames: ["Glicemia", "ECG", "Eletrólitos", "Hemograma conforme contexto"] },
  { ico: "🧠", nome: "Cefaleia com red flags", exames: ["TC de crânio", "Hemograma se febre", "Punção lombar quando indicada"] },
  { ico: "🧒", nome: "Pediatria febril", exames: ["Exames conforme idade, estado geral e foco", "Urina tipo I em febre sem foco", "Hemograma/culturas se gravidade"] },
];

const PEGADINHAS_GERAIS = [
  "Pedir exame sem hipótese",
  "Esquecer sinais vitais antes dos exames",
  "Atrasar conduta em paciente instável",
  "Ignorar alergias, função renal ou contraste",
  "Usar exame normal para descartar doença grave sem contexto",
  "Não interpretar o resultado",
  "Não explicar ao paciente por que solicita o exame",
  "Pedir muitos exames sem prioridade clínica",
];

function Bloco({ label, itens, warn }: { label: string; itens: string[]; warn?: boolean }) {
  return (
    <div>
      <p className="ex-block-label"><span style={warn ? { background: "#e0a12a" } : undefined} />{label}</p>
      <ul className="ex-list">
        {itens.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}

export default function ExamesPage() {
  const router = useRouter();

  const { iniciarOSCE, accessModal } = useIniciarOsce();

  return (
    <div className="exames-page">
      {/* ===================== HERO ===================== */}
      <section className="ex-hero">
        <span className="ex-hero-badge"><i />EXAMES</span>
        <h1>Biblioteca de Exames</h1>
        <p className="ex-hero-sub">
          Aprenda quando solicitar, como justificar e o que procurar nos principais exames usados
          em estações OSCE.
        </p>
        <div className="ex-hero-cards">
          {HERO_CARDS.map((c) => (
            <div key={c.t} className="ex-hero-card">
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== SEÇÃO 1 — REGRA DE OURO ===================== */}
      <section>
        <div className="ex-section-head">
          <p className="ex-eyebrow">Princípio</p>
          <h2 className="ex-title">Regra de ouro para pedir exames no OSCE</h2>
        </div>
        <div className="ex-gold ex-glass">
          <p className="ex-gold-quote">“Todo exame deve responder a uma pergunta clínica.”</p>
          <div className="ex-gold-grid">
            {REGRA_OURO.map((r) => (
              <div key={r.k} className="ex-gold-item">
                <b>{r.k}</b>
                <span>{r.q}</span>
              </div>
            ))}
          </div>
          <div className="ex-gold-alert">
            <span aria-hidden>⚠️</span>
            <p>
              Pedir muitos exames sem justificativa pode perder ponto. Priorize exames coerentes
              com a hipótese e a gravidade.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== SEÇÃO 2 — CARDS DE EXAMES ===================== */}
      <section>
        <div className="ex-section-head">
          <p className="ex-eyebrow">Referência</p>
          <h2 className="ex-title">Exames essenciais</h2>
          <p className="ex-sub">Quando pedir, o que procurar, como justificar e as pegadinhas de cada exame.</p>
        </div>
        <div className="ex-grid">
          {EXAMES.map((e) => (
            <article key={e.nome} className="ex-card ex-glass">
              <div className="ex-card-head">
                <span className="ex-card-ico" aria-hidden>{e.ico}</span>
                <h3>{e.nome}</h3>
              </div>
              <div className="ex-card-cols">
                <Bloco label="Quando pedir" itens={e.quando} />
                <Bloco label="O que procurar" itens={e.procurar} />
              </div>
              <div className="ex-justify">
                <p className="ex-block-label"><span />Como justificar</p>
                <p>“{e.justificar}”</p>
              </div>
              <div className="ex-traps">
                <Bloco label="Pegadinhas" itens={e.pegadinhas} warn />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===================== SEÇÃO 3 — POR SÍNDROME ===================== */}
      <section>
        <div className="ex-section-head">
          <p className="ex-eyebrow">Atalho</p>
          <h2 className="ex-title">Exames por síndrome</h2>
          <p className="ex-sub">O pacote inicial mais coerente para cada apresentação.</p>
        </div>
        <div className="ex-syn-grid">
          {SINDROMES.map((s) => (
            <article key={s.nome} className="ex-syn-card ex-glass">
              <h3><span aria-hidden>{s.ico}</span>{s.nome}</h3>
              <div className="ex-syn-tags">
                {s.exames.map((ex) => <span key={ex} className="ex-syn-tag">{ex}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===================== SEÇÃO 4 — PEGADINHAS GERAIS ===================== */}
      <section>
        <div className="ex-section-head">
          <p className="ex-eyebrow">Atenção</p>
          <h2 className="ex-title">Pegadinhas gerais</h2>
          <p className="ex-sub">Os erros que mais custam pontos na hora de solicitar exames.</p>
        </div>
        <div className="ex-alerts">
          {PEGADINHAS_GERAIS.map((p) => (
            <div key={p} className="ex-alert">
              <span className="ex-alert-ico"><Alert /></span>
              <strong>{p}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="ex-cta ex-glass">
        <h2>Agora use os exames para decidir conduta</h2>
        <p>
          Treine uma estação OSCE e pratique a escolha dos exames certos, justificando cada
          solicitação com raciocínio clínico.
        </p>
        <div className="ex-cta-actions">
          <button type="button" className="ex-btn ex-btn-primary" onClick={() => iniciarOSCE("adulto")}>
            Iniciar OSCE Adulto
          </button>
          <button type="button" className="ex-btn ex-btn-ped" onClick={() => iniciarOSCE("pediatrico")}>
            Iniciar OSCE Pediátrico
          </button>
          <button type="button" className="ex-btn ex-btn-ghost" onClick={() => router.push("/centro-clinico")}>
            Voltar ao Centro Clínico
          </button>
        </div>
      </section>
      {accessModal}
    </div>
  );
}
