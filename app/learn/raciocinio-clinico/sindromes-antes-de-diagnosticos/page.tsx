import LearnTrailPage from "@/components/medix-learn/LearnTrailPage";
import { loadTrail } from "@/lib/medix-learn/loader";

export default function Page() {
  const trail = loadTrail("raciocinio-clinico", "sindromes-antes-de-diagnosticos");
  return <LearnTrailPage trail={trail} systemId="raciocinio-clinico" />;
}
