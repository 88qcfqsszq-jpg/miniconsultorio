// Rota /centro-clinico/exames — Biblioteca de Exames. Usa a sidebar global (AppShell).
import ExamesPage from "@/components/centro-clinico/exames/ExamesPage";

export const metadata = {
  title: "Biblioteca de Exames — MEDIX",
};

export default function Exames() {
  return <ExamesPage />;
}
