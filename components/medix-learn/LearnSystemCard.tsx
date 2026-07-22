import type { LearnSystem } from "@/lib/medix-learn/types";

interface Props {
  system: LearnSystem;
}

// Emojis por sistema (mesmos do original, com o mapeamento corrigido: a chave
// agora casa com o id real — "gastro-abdome" — e Semiologia/Raciocínio ganham
// um emoji próprio em vez de cair no fallback 📚).
const SYSTEM_ICONS: Record<string, string> = {
  "respiratorio":       "🫁",
  "cardiovascular":     "🫀",
  "infectologia":       "🦠",
  "neurologia":         "🧠",
  "gastro-abdome":      "🫃",
  "semiologia-geral":   "🩺",
  "raciocinio-clinico": "🧩",
};

function ArrowIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function LearnSystemCard({ system }: Props) {
  const icon = SYSTEM_ICONS[system.id] ?? "📚";

  const card = (
    <div className={`ml-card${system.disponivel ? "" : " ml-card-off"}`}>
      <span className="ml-ico">{icon}</span>
      <div className="ml-body">
        <div className="ml-title-row">
          <h3>{system.titulo}</h3>
          {!system.disponivel && <span className="ml-soon">EM BREVE</span>}
        </div>
        <p>{system.descricao}</p>
      </div>
      {system.disponivel && (
        <span className="ml-arrow"><ArrowIcon /></span>
      )}
    </div>
  );

  if (system.disponivel) {
    return (
      <a href={system.href} className="ml-card-link">
        {card}
      </a>
    );
  }
  return card;
}
