import LearnTrailPage from "@/components/medix-learn/LearnTrailPage";
import { loadTrail } from "@/lib/medix-learn/loader";

export default function Page() {
  const trail = loadTrail("semiologia-geral", "comunicacao-clinica");
  return <LearnTrailPage trail={trail} systemId="semiologia-geral" />;
}
