import LearnTrailPage from "@/components/medix-learn/LearnTrailPage";
import { loadTrail } from "@/lib/medix-learn/loader";

export default function Page() {
  const trail = loadTrail("neurologia", "cefaleia-e-sinais-de-alarme");
  return <LearnTrailPage trail={trail} systemId="neurologia" />;
}
