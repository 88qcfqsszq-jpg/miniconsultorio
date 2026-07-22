// Dashboard principal da plataforma. app/page.tsx ("/") redireciona para cá.
import DashboardLanding from "@/components/dashboard/DashboardLanding";

export const metadata = {
  title: "Dashboard — MEDIX",
};

export default function DashboardLandingPage() {
  return <DashboardLanding />;
}
