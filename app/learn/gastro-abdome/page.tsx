import LearnSystemPage from "@/components/medix-learn/LearnSystemPage";
import { GASTRO_ABDOME } from "@/lib/medix-learn/extra-systems";

export const metadata = {
  title: "Gastro/Abdome — MEDIX Learn",
};

export default function Page() {
  return <LearnSystemPage sistema={GASTRO_ABDOME} systemId="gastro-abdome" />;
}
