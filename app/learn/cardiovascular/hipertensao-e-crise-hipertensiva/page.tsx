import LearnTrailPage from "@/components/medix-learn/LearnTrailPage";
import { loadTrail } from "@/lib/medix-learn/loader";

export default function Page() {
  const trail = loadTrail("cardiovascular", "hipertensao-e-crise-hipertensiva");
  return <LearnTrailPage trail={trail} systemId="cardiovascular" />;
}
