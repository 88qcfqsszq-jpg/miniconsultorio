import { LEARN_SYSTEMS } from "@/lib/medix-learn";
import LearnShell from "./LearnShell";
import LearnHero from "./LearnHero";
import LearnSystemCard from "./LearnSystemCard";

export default function LearnHomePage() {
  return (
    <LearnShell>
      <LearnHero
        titulo="MEDIX Learn"
        subtitulo="Aprenda base, semiologia e raciocínio clínico antes de treinar no OSCE."
        badges={["Base", "Semiologia", "Raciocínio clínico", "OSCE"]}
      />

      <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#334155", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Sistemas
          </h2>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>
            Comece pelo Respiratório
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {LEARN_SYSTEMS.map((sys) => (
            <LearnSystemCard key={sys.id} system={sys} />
          ))}
        </div>
      </section>

      <div
        style={{
          padding: "16px 20px",
          borderRadius: 14,
          background: "rgba(124,58,237,0.05)",
          border: "1px solid rgba(124,58,237,0.14)",
          fontSize: 13,
          color: "#5c6d8a",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "#6d28d9" }}>Como funciona o MEDIX Learn:</strong>
        {" "}cada trilha conecta fisiologia, semiologia e raciocínio clínico através de microaulas, mini-casos e questões ativas.
        Ao final, uma ponte leva você diretamente para treinar o atendimento no OSCE.
      </div>
    </LearnShell>
  );
}
