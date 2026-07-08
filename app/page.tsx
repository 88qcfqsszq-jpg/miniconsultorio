import { redirect } from "next/navigation";

// A raiz "/" redireciona para o dashboard landing atual (layout validado).
export default function HomePage() {
  redirect("/dashboard-landing");
}
