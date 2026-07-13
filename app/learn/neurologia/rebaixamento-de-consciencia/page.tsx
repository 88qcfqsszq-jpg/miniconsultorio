import LearnTrailPage from "@/components/medix-learn/LearnTrailPage";
import { loadTrail } from "@/lib/medix-learn/loader";

export default function Page() {
  const trail = loadTrail("neurologia", "rebaixamento-de-consciencia");
  return <LearnTrailPage trail={trail} systemId="neurologia" />;
}
