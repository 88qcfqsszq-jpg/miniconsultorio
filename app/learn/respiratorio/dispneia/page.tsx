import LearnTrailPage from "@/components/medix-learn/LearnTrailPage";
import { loadTrail } from "@/lib/medix-learn/loader";

export default function Page() {
  const trail = loadTrail("respiratorio", "dispneia");
  return <LearnTrailPage trail={trail} systemId="respiratorio" />;
}
