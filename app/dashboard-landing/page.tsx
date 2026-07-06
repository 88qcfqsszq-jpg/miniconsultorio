// Rota isolada de pré-visualização do novo dashboard.
// Acessível em /dashboard-landing — NÃO substitui a página principal (app/page.tsx).
import DashboardLanding from "@/components/dashboard/DashboardLanding";

export const metadata = {
  title: "Dashboard — MEDIX",
};

export default function DashboardLandingPage() {
  return <DashboardLanding />;
}
