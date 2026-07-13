import LearnSystemPage from "@/components/medix-learn/LearnSystemPage";
import { SEMIOLOGIA_GERAL } from "@/lib/medix-learn/extra-systems";

export const metadata = {
  title: "Semiologia Geral — MEDIX Learn",
};

export default function Page() {
  return <LearnSystemPage sistema={SEMIOLOGIA_GERAL} systemId="semiologia-geral" />;
}
