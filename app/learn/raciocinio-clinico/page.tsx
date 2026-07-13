import LearnSystemPage from "@/components/medix-learn/LearnSystemPage";
import { RACIOCINIO_CLINICO } from "@/lib/medix-learn/extra-systems";

export const metadata = {
  title: "Raciocínio Clínico — MEDIX Learn",
};

export default function Page() {
  return <LearnSystemPage sistema={RACIOCINIO_CLINICO} systemId="raciocinio-clinico" />;
}
