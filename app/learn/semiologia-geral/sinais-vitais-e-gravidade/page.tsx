import LearnTrailPage from "@/components/medix-learn/LearnTrailPage";
import { loadTrail } from "@/lib/medix-learn/loader";

export default function Page() {
  const trail = loadTrail("semiologia-geral", "sinais-vitais-e-gravidade");
  return <LearnTrailPage trail={trail} systemId="semiologia-geral" />;
}
