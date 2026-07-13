import LearnTrailPage from "@/components/medix-learn/LearnTrailPage";
import { loadTrail } from "@/lib/medix-learn/loader";

export default function Page() {
  const trail = loadTrail("semiologia-geral", "dor-como-quinto-sinal");
  return <LearnTrailPage trail={trail} systemId="semiologia-geral" />;
}
