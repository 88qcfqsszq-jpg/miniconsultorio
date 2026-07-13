import LearnTrailPage from "@/components/medix-learn/LearnTrailPage";
import { loadTrail } from "@/lib/medix-learn/loader";

export default function Page() {
  const trail = loadTrail("raciocinio-clinico", "exames-que-mudam-conduta");
  return <LearnTrailPage trail={trail} systemId="raciocinio-clinico" />;
}
