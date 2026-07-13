import LearnTrailPage from "@/components/medix-learn/LearnTrailPage";
import { loadTrail } from "@/lib/medix-learn/loader";

export default function Page() {
  const trail = loadTrail("infectologia", "antimicrobianos-basicos");
  return <LearnTrailPage trail={trail} systemId="infectologia" />;
}
