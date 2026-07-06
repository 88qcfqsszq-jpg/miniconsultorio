// ============================================================================
// LaboratoryEngine — TIPOS (arquitetura escalável de exames laboratoriais)
// ----------------------------------------------------------------------------
// Estrutura padronizada usada por todos os módulos (hemograma, renal, etc.).
// PURO: sem IA, sem rede, sem banco. Determinístico por caseId.
// ============================================================================

export type Direcao = "normal" | "baixo" | "muito_baixo" | "alto" | "muito_alto";
export type NivelAlteracao = "normal" | "leve" | "moderado" | "grave";
export type Sexo = "M" | "F";

/** Tag clínica única do caso — dirige TODOS os painéis (coerência). */
export type ClinicalTag =
  | "normal"
  | "pneumonia"
  | "sepse"
  | "virose"
  | "dengue"
  | "dengue_alarme"
  | "febre_amarela"
  | "tuberculose"
  | "iam_sca"
  | "ic"
  | "tep"
  | "pericardite"
  | "dpoc"
  | "asma"
  | "anemia"
  | "irc"
  | "dka"
  | "itu"
  | "pielonefrite"
  | "hepatite"
  | "colestase"
  | "civd"
  | "pti"
  | "policitemia"
  | "les_hiv"
  | "desidratacao";

export interface LabAnalyte {
  nome: string;
  valor: string;
  unidade: string;
  ref: string;
  flag: "" | "↑" | "↓";
}

export interface LabSection {
  titulo: string;
  itens: LabAnalyte[];
}

export interface LabPanelResult {
  testId: string;
  titulo: string;
  nivel: NivelAlteracao;
  paciente: { idade?: number; sexo: Sexo; nome?: string };
  sections: LabSection[];
  observacoes: string[];
}

/** Contexto compartilhado passado a cada gerador de painel. */
export interface LabContext {
  caso: any;
  caseId: string;
  idade?: number;
  sexo: Sexo;
  tag: ClinicalTag;
  gravidade: NivelAlteracao;
  rnd: () => number;
  paciente: { idade?: number; sexo: Sexo; nome?: string };
}
