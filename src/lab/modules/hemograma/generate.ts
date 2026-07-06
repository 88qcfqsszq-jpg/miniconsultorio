// Módulo HEMOGRAMA — encapsula o gerador existente (src/utils/generateHemograma)
// na arquitetura do LaboratoryEngine, SEM alterar o funcionamento atual.
import type { LabContext, LabPanelResult } from "@/src/lab/labTypes";
import { generateHemograma } from "@/src/utils/generateHemograma";

export function generateHemogramaPanel(ctx: LabContext): LabPanelResult {
  const h = generateHemograma({ caso: ctx.caso });
  return {
    testId: "hemograma",
    titulo: "Hemograma Completo",
    nivel: h.nivel,
    paciente: ctx.paciente,
    sections: [
      { titulo: "Série Vermelha (Eritrograma)", itens: h.serieVermelha },
      { titulo: "Série Branca (Leucograma)", itens: h.serieBranca },
      { titulo: "Plaquetas (Plaquetograma)", itens: h.plaquetas },
    ],
    observacoes: h.observacoes,
  };
}
