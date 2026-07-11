// Rota /casos-dinamicos — Casos OSCE Dinâmicos (Beta).
// Módulo paralelo e isolado; não altera o fluxo OSCE principal.
// Mesmo padrão de /guia: página server + componente client dedicado.
import DynamicCasesBetaPage from "@/components/dynamic-osce/DynamicCasesBetaPage";

export const metadata = {
  title: "Casos OSCE Dinâmicos — Beta — MEDIX",
};

export default function CasosDinamicos() {
  return <DynamicCasesBetaPage />;
}
