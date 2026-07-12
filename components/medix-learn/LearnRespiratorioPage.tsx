import { LEARN_SYSTEMS } from "@/lib/medix-learn";
import LearnShell from "./LearnShell";
import LearnHero from "./LearnHero";
import LearnTrailCard from "./LearnTrailCard";

export default function LearnRespiratorioPage() {
  const sistema = LEARN_SYSTEMS.find((s) => s.id === "respiratorio")!;

  return (
    <LearnShell>
      <LearnHero
        titulo="Respiratório"
        subtitulo="Aprenda a conectar fisiologia respiratória, semiologia e raciocínio clínico."
        badges={["Respiratório", "Fisiologia aplicada", "Semiologia"]}
        breadcrumb={[
          { label: "MEDIX Learn", href: "/learn" },
          { label: "Respiratório", href: "/learn/respiratorio" },
        ]}
      />

      <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#334155", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Trilhas
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sistema.trilhas.map((trilha) => (
            <LearnTrailCard key={trilha.id} trail={trilha} />
          ))}
        </div>
      </section>

      <div
        style={{
          padding: "14px 18px",
          borderRadius: 12,
          background: "rgba(59,130,246,0.05)",
          border: "1px solid rgba(59,130,246,0.14)",
          fontSize: 13,
          color: "#5c6d8a",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "#1d4ed8" }}>Por onde começar:</strong>
        {" "}a trilha de Hipoxemia é o ponto de entrada ideal para o sistema respiratório.
        Ela conecta SpO₂, oxigenação, ventilação e os mecanismos mais frequentes na prática clínica.
      </div>
    </LearnShell>
  );
}
