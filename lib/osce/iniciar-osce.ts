// ============================================================================
// Helper compartilhado para iniciar um OSCE — replica EXATAMENTE a lógica de
// app/faca-o-osce/page.tsx (iniciarOSCE): filtra casos ativos por tipo, escolhe
// um caso aleatório e monta a URL /caso/<id>?modo=osce&tipo=<tipo>.
// Usado pelas sidebars (Dashboard / Atendimento) para reproduzir o mesmo destino
// dos botões "Iniciar OSCE Adulto/Pediátrico". Não altera a página original.
// ============================================================================

import { casosOSCE } from "@/data/casos-osce";

export type TipoOSCE = "adulto" | "pediatrico";

/** Retorna a URL de um caso OSCE aleatório do tipo pedido, ou null se não houver. */
export function urlOSCEAleatorio(tipoOSCE: TipoOSCE): string | null {
  const casosAtivos = casosOSCE.filter((caso) => caso.ativo !== false);

  const casosFiltrados =
    tipoOSCE === "pediatrico"
      ? casosAtivos.filter(
          (caso) =>
            caso.tipoPaciente === "pediatrico" ||
            caso.paciente?.tipoPaciente === "pediatrico"
        )
      : casosAtivos.filter(
          (caso) =>
            !caso.tipoPaciente ||
            caso.tipoPaciente === "adulto" ||
            !caso.paciente?.tipoPaciente ||
            caso.paciente?.tipoPaciente === "adulto"
        );

  if (casosFiltrados.length === 0) return null;

  const casoAleatorio =
    casosFiltrados[Math.floor(Math.random() * casosFiltrados.length)];
  return `/caso/${casoAleatorio.id}?modo=osce&tipo=${tipoOSCE}`;
}
