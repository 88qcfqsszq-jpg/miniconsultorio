import { redirect } from "next/navigation";
import { LEARN_SYSTEMS } from "@/lib/medix-learn";
import type { LearnSystem } from "@/lib/medix-learn/types";
import LearnShell from "./LearnShell";
import LearnHero from "./LearnHero";
import LearnTrailCard from "./LearnTrailCard";

interface Props {
  systemId: string;
  sistema?: LearnSystem;
}

const SYSTEM_INTROS: Record<string, string> = {
  respiratorio: "a trilha de Hipoxemia é o ponto de entrada ideal. Ela conecta SpO₂, oxigenação e os mecanismos mais frequentes na clínica.",
  cardiovascular: "comece pela trilha de Dor torácica e SCA para entender o raciocínio em urgências cardiovasculares.",
  infectologia: "a trilha de Febre e síndrome infecciosa apresenta o raciocínio básico antes de avançar para sepse e antibióticos.",
  neurologia: "a trilha de Cefaleia e sinais de alarme é a porta de entrada para o sistema neurológico.",
  "gastro-abdome": "comece pela trilha de Dor abdominal para desenvolver o raciocínio sindrômico abdominal.",
  "semiologia-geral": "a trilha de Anamnese estruturada é a base para todas as outras trilhas do sistema.",
  "raciocinio-clinico": "a trilha de Síndromes antes de diagnósticos apresenta o princípio fundamental do raciocínio clínico.",
};

export default function LearnSystemPage({ systemId, sistema: sistemaProp }: Props) {
  const sistema = sistemaProp ?? LEARN_SYSTEMS.find((s) => s.id === systemId);
  if (!sistema) redirect("/learn");

  const intro = SYSTEM_INTROS[systemId] ?? "comece pela primeira trilha do sistema.";

  return (
    <LearnShell>
      <LearnHero
        titulo={sistema.titulo}
        subtitulo={sistema.descricao}
        badges={[sistema.titulo, "Fisiologia aplicada", "Semiologia"]}
        breadcrumb={[
          { label: "MEDIX Learn", href: "/learn" },
          { label: sistema.titulo, href: `/learn/${systemId}` },
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

      <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.14)", fontSize: 13, color: "#5c6d8a", lineHeight: 1.6 }}>
        <strong style={{ color: "#1d4ed8" }}>Por onde começar: </strong>
        {intro}
      </div>
    </LearnShell>
  );
}
