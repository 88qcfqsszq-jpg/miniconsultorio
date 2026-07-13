import LearnTrailPage from "@/components/medix-learn/LearnTrailPage";
import { loadTrail } from "@/lib/medix-learn/loader";

export default function Page() {
  const trail = loadTrail("cardiovascular", "dor-toracica-e-sindrome-coronariana");
  return <LearnTrailPage trail={trail} systemId="cardiovascular" />;
}
