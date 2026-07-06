// ============================================================================
// Arquitetura de rubricas por diagnóstico — tipos compartilhados
// ----------------------------------------------------------------------------
// Cada diagnóstico (PAC, SCA, …) implementa uma RubricaDiagnostico que avalia
// o contexto do atendimento e devolve cards específicos. O view-builder
// substitui os cards correspondentes pelos da rubrica e mantém os demais.
// ============================================================================

import type { ContextoConsistencia } from "../feedback-consistency";

export type CategoriaFeedback =
  | "comunicacao"
  | "anamnese"
  | "exameFisico"
  | "examesComplementares"
  | "raciocinioDiagnostico"
  | "condutaSeguranca";

export type ResultadoCriterio = {
  id: string;
  cumprido: boolean;
  pontos: number;
  pontosMax: number;
  acerto?: string;
  melhorar?: string;
  evidencias?: string[];
};

export type ResultadoCardRubrica = {
  card: CategoriaFeedback;
  titulo: string;
  pontos: number;
  pontosMax: number;
  acertos: string[];
  melhorar: string[];
  evidencias?: string[];
  criterios?: ResultadoCriterio[];
};

/**
 * Contexto de avaliação. Reutiliza o ContextoConsistencia já montado pelo
 * view-builder/page.tsx (textos normalizáveis + sinais vitais + diferenciais),
 * que é a fonte real dos dados do atendimento.
 */
export type ContextoAvaliacaoOSCE = ContextoConsistencia;

export type RubricaDiagnostico = {
  diagnosticoId: string;
  nomesAceitos: string[];
  casoIds?: Array<number | string>;
  avaliar: (ctx: ContextoAvaliacaoOSCE) => ResultadoCardRubrica[];
};

/** Nome visual do card (CARDS_CONFIG) → categoria da rubrica. */
export const CATEGORIA_POR_NOME_CARD: Record<string, CategoriaFeedback> = {
  "comunicacao e postura medica": "comunicacao",
  "anamnese dirigida": "anamnese",
  "exame fisico": "exameFisico",
  "exames complementares": "examesComplementares",
  "raciocinio diagnostico": "raciocinioDiagnostico",
  "conduta e seguranca": "condutaSeguranca",
};
