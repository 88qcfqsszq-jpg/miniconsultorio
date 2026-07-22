import { LEARN_SYSTEMS } from "@/lib/medix-learn";
import LearnShell from "./LearnShell";
import LearnHero from "./LearnHero";
import LearnSystemCard from "./LearnSystemCard";
import "./MedixLearn.css";

export default function LearnHomePage() {
  return (
    <LearnShell>
      <div className="medix-learn">
        <LearnHero
          titulo="MEDIX Learn"
          subtitulo="Aprenda base, semiologia e raciocínio clínico antes de treinar no OSCE."
          badges={["Base", "Semiologia", "Raciocínio clínico", "OSCE"]}
        />

        <section>
          <div className="ml-sec-head">
            <h2>Sistemas</h2>
            <span>Comece pelo Respiratório</span>
          </div>
          <div className="ml-grid">
            {LEARN_SYSTEMS.map((sys) => (
              <LearnSystemCard key={sys.id} system={sys} />
            ))}
          </div>
        </section>

        <div className="ml-bridge">
          <span className="ml-bridge-ico" aria-hidden="true">
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.5 4A3.5 3.5 0 006 7.5 3 3 0 004 10a3 3 0 001 5.5 3.5 3.5 0 004.5 3.3V4z" />
              <path d="M14.5 4A3.5 3.5 0 0118 7.5 3 3 0 0120 10a3 3 0 01-1 5.5 3.5 3.5 0 01-4.5 3.3V4z" />
            </svg>
          </span>
          <p>
            <strong>Como funciona o MEDIX Learn:</strong>{" "}
            cada trilha conecta fisiologia, semiologia e raciocínio clínico através de microaulas,
            mini-casos e questões ativas. Ao final, uma ponte leva você diretamente para treinar o
            atendimento no OSCE.
          </p>
        </div>
      </div>
    </LearnShell>
  );
}
