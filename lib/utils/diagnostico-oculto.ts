import type { Caso } from "@/lib/types";

/**
 * Resolve o diagnóstico oculto real do caso
 * Fonte única de verdade para diagnósticos ocultos
 *
 * Usado INTERNAMENTE apenas para:
 * - Pré-carregamento de imagens
 * - Chamadas ao backend
 * - Seleção de curadoria
 *
 * NUNCA exibido ao aluno (até gabarito/finalização)
 */
export function getDiagnosticoOcultoDoCaso(caso: Caso | null): string {
  if (!caso) return "";

  // Fonte principal: diagnóstico oculto do sistema
  if (caso.dados_ocultos_do_sistema?.diagnostico_principal) {
    return caso.dados_ocultos_do_sistema.diagnostico_principal;
  }

  // Fallback: campo alternativo se existir
  if ((caso as any).diagnosticoFinal) {
    return (caso as any).diagnosticoFinal;
  }

  // Último recurso: vazio (não usar visível ao estudante)
  return "";
}

/**
 * Verifica se o diagnóstico é de patologia pulmonar relevante para RX
 * Retorna true se deve buscar imagens radiológicas
 */
export function ehDiagnosticoPulmonarParaRX(diagnostico: string): boolean {
  const lowerDiag = diagnostico.toLowerCase();

  const patologiasPulmonares = [
    // Infecções
    "pneumonia",
    "pac",
    "pneumonia adquirida",
    "tuberculose",
    "tuberculosis",
    "tb",
    "bronquiolite",
    "atípica",
    "mycoplasma",

    // Obstrutivas
    "asma",
    "crise asmática",
    "broncoespasmo",
    "dpoc",
    "enfisema",
    "doença pulmonar obstrutiva",

    // Vasculares/Mecânicas
    "pneumotórax",
    "pneumotorax",
    "derrame pleural",
    "atelectasia",
    "colapso pulmonar",
    "volume loss",

    // Cardiopulmonares
    "edema pulmonar",
    "insuficiência cardíaca",
    "insuficiencia cardiaca",
    "cardiomegalia",
    "congestão pulmonar",
    "chf",

    // Outros
    "hipertensão pulmonar",
    "aspergiloma",
    "aspergillus",
    "pneumoconiose",
  ];

  return patologiasPulmonares.some((patologia) =>
    lowerDiag.includes(patologia)
  );
}
