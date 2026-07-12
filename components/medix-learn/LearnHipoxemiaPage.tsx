import { trilhaHipoxemia } from "@/lib/medix-learn";
import LearnShell from "./LearnShell";
import LearnHero from "./LearnHero";
import LearnSectionCard from "./LearnSectionCard";
import LearnMiniCaseCard from "./LearnMiniCaseCard";
import LearnActiveQuestionCard from "./LearnActiveQuestionCard";
import LearnMapBox from "./LearnMapBox";
import LearnBridgeBox from "./LearnBridgeBox";

const trilha = trilhaHipoxemia;

function SectionTitle({ children }: { children: string }) {
  return (
    <h2
      style={{
        margin: 0,
        fontSize: 14,
        fontWeight: 800,
        color: "#334155",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {children}
    </h2>
  );
}

function Divider() {
  return (
    <hr style={{ border: "none", borderTop: "1px solid rgba(120,130,180,0.14)", margin: 0 }} />
  );
}

export default function LearnHipoxemiaPage() {
  return (
    <LearnShell>
      {/* Hero */}
      <LearnHero
        titulo={trilha.titulo}
        subtitulo={trilha.subtitulo}
        badges={trilha.badges}
        breadcrumb={[
          { label: "MEDIX Learn", href: "/learn" },
          { label: "Respiratório", href: "/learn/respiratorio" },
          { label: "Hipoxemia", href: "/learn/respiratorio/hipoxemia" },
        ]}
      />

      {/* Público-alvo */}
      <div
        style={{
          padding: "10px 16px",
          borderRadius: 10,
          background: "rgba(241,245,249,0.9)",
          border: "1px solid rgba(120,130,180,0.14)",
          fontSize: 12,
          color: "#5c6d8a",
        }}
      >
        <span style={{ fontWeight: 700, color: "#0b1f4d" }}>Público-alvo: </span>
        {trilha.publicoAlvo}
      </div>

      {/* Objetivos */}
      <div
        style={{
          padding: "18px 20px",
          borderRadius: 14,
          background: "#fff",
          border: "1px solid rgba(120,130,180,0.16)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <SectionTitle>Objetivos da trilha</SectionTitle>
        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 5 }}>
          {trilha.objetivos.map((obj) => (
            <li key={obj} style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
              {obj}
            </li>
          ))}
        </ul>
      </div>

      <Divider />

      {/* Seções de conteúdo */}
      <SectionTitle>Conteúdo</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {trilha.secoes.map((sec, i) => (
          <LearnSectionCard key={sec.id} section={sec} index={i} />
        ))}
      </div>

      <Divider />

      {/* Mini-casos */}
      <SectionTitle>Mini-casos clínicos</SectionTitle>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        {trilha.miniCasos.map((mc) => (
          <LearnMiniCaseCard key={mc.id} miniCase={mc} />
        ))}
      </div>

      <Divider />

      {/* Questões ativas */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <SectionTitle>Questões ativas</SectionTitle>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#5c6d8a" }}>
            Clique para revelar a resposta esperada.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {trilha.questoesAtivas.map((q, i) => (
            <LearnActiveQuestionCard key={q.id} question={q} index={i} />
          ))}
        </div>
      </div>

      <Divider />

      {/* Mapa final */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <SectionTitle>Mapa final</SectionTitle>
        <LearnMapBox linhas={trilha.mapaLinhas} />
      </div>

      <Divider />

      {/* Ponte para OSCE */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <SectionTitle>Ponte para o OSCE</SectionTitle>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#5c6d8a" }}>
            Aplique o que aprendeu na prática simulada.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 14,
          }}
        >
          {trilha.pontes.map((ponte) => (
            <LearnBridgeBox key={ponte.modulo} bridge={ponte} />
          ))}
        </div>
      </div>
    </LearnShell>
  );
}
