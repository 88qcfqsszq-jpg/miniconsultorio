/**
 * MEDIX PATIENT V3 — Tipos do contrato do caso (schema V1.2 CONGELADO).
 *
 * FASE 0 da migração: SOMENTE tipos. Este arquivo não produz nenhum código de
 * runtime — não há funções, constantes, validadores, schemas nem dados. Ele
 * apenas fixa, em TypeScript, o contrato congelado do CasoV3 e os dois tipos
 * internos derivados usados pelas fases seguintes (PatientZoneInput e
 * PatientSafeContext).
 *
 * Fronteira de zonas (propriedade do dado):
 *  - Zona do Paciente: patientKnowledge, disclosurePolicy, persona,
 *    sessionStateInicial — a única parte que futuramente alimenta o núcleo do
 *    paciente (via PatientZoneInput → Builder → PatientSafeContext → Prompt Base).
 *  - Zona Reservada: clinicalTruth, examiner — exigidas pelo contrato do CasoV3,
 *    porém NUNCA extraídas para a Zona do Paciente. metadata é neutra.
 *
 * Reúso de tipos legados: apenas SinaisVitais e ExameFisico (de @/lib/types) são
 * reaproveitados por corresponderem exatamente aos conceitos clínicos da Zona
 * Reservada. Nenhum tipo legado foi alterado. Os demais tipos clínicos são
 * declarados localmente em forma mínima e camelCase (os equivalentes legados
 * usam snake_case / campos extras que não correspondem ao contrato mínimo V1.2).
 */

import type { SinaisVitais, ExameFisico } from "@/lib/types";

// ============================================================================
// METADATA (neutra)
// ============================================================================

export interface Metadata {
  id: string;
  titulo: string;
  especialidade: string;
  tema?: string;
  nivel: "iniciante" | "intermediario" | "avancado";
  tipoEstacao: "entrevista" | "exame_fisico" | "procedimento" | "integrada";
  duracaoMinutos: number;
  versaoCaso: string;
}

// ============================================================================
// ZONA RESERVADA — estruturas clínicas auxiliares (nunca chegam ao paciente)
// ============================================================================

/** Resultado de um exame complementar, com sua interpretação (dado do avaliador). */
export interface ExameResultado {
  nome: string;
  resultado: string;
  valorReferencia?: string;
  interpretacao: string;
}

/** ECG verdadeiro do caso — padrão e interpretação (dado do avaliador). */
export interface EcgVerdadeiro {
  padrao: string;
  derivacoes?: string;
  interpretacao: string;
}

/** Evolução clínica esperada conforme a conduta (dado do avaliador). */
export interface EvolucaoClinica {
  seCondutaCorreta: string;
  seCondutaInadequadaOuAtrasada: string;
}

/** Conduta correta esperada (dado do avaliador). */
export interface CondutaEsperada {
  imediata: string[];
  curtoPrazo?: string[];
  longoPrazo?: string[];
  encaminhamentos?: string[];
}

export interface ClinicalTruth {
  diagnosticoPrincipal: string;
  diagnosticosDiferenciais: string[];
  /**
   * Linha do tempo clínica CANÔNICA — reservada à simulação e à avaliação.
   * NÃO é a percepção do paciente e não deve ser copiada literalmente para
   * patientKnowledge.fatos (diferenças de percepção/memória/linguagem pertencem
   * ao paciente; diagnóstico e interpretações pertencem somente aqui).
   */
  cronologiaVerdadeira: string;
  exameFisicoVerdadeiro: ExameFisico; // reúso legado (corresponde ao conceito)
  sinaisVitais: SinaisVitais;         // reúso legado (corresponde ao conceito)
  exames: ExameResultado[];
  ecg?: EcgVerdadeiro;
  evolucao: EvolucaoClinica;
  complicacoes?: string[];
  tratamentoCorreto: CondutaEsperada;
}

// ============================================================================
// ZONA RESERVADA — Examiner (nunca chega ao paciente)
// ============================================================================

export interface RubricaItem {
  criterio: string;
  peso: number;
  descricao?: string;
}

export interface ChecklistItem {
  item: string;
  critico?: boolean;
}

export interface ErroCritico {
  erro: string;
  descricao?: string;
  penalidade: number;
}

export interface FeedbackModelo {
  acertosEsperados: string[];
  errosComuns: string[];
  orientacoesPedagogicas: string[];
}

export interface Examiner {
  rubricas: RubricaItem[];
  checklist: ChecklistItem[];
  errosCriticos: ErroCritico[];
  feedback: FeedbackModelo;
  criteriosAprovacao: string[];
}

// ============================================================================
// ZONA DO PACIENTE — Patient Knowledge
// ============================================================================

/** Quem responde durante a simulação. NÃO implica faixa etária. */
export type Interlocutor = "paciente" | "responsavel";

export interface Responsavel {
  nome: string;
  parentesco: string;
}

/** Identidade descreve o PACIENTE (não o responsável). */
export interface Identidade {
  nome: string;
  idade: number;
  sexo: "M" | "F";
}

export type DominioFato =
  | "historiaAtual"
  | "sintoma"
  | "antecedente"
  | "medicamento"
  | "alergia"
  | "habito"
  | "familia"
  | "contextoSocial"
  | "preocupacao"
  | "objetivo";

export interface FatoPaciente {
  /** Estável e único; é a chave referenciada pela Disclosure Policy. */
  id: string;
  dominio: DominioFato;
  /** O DADO em termos neutros — nunca uma frase pronta em 1ª pessoa. */
  valor: string;
  /** true ⇒ o paciente sabe vagamente ("não lembro direito"). */
  incerto?: boolean;
}

export interface PatientKnowledge {
  identidade: Identidade;
  interlocutor: Interlocutor;
  responsavel?: Responsavel;
  fatos: FatoPaciente[];
}

// ============================================================================
// ZONA DO PACIENTE — Disclosure Policy
// ============================================================================

export type PoliticaRevelacao =
  | "espontanea"
  | "perguntaAberta"
  | "perguntaDireta"
  | "sensivel";

export interface RegraRevelacao {
  /** Referencia FatoPaciente.id. */
  factId: string;
  politica: PoliticaRevelacao;
}

export interface DisclosurePolicy {
  /**
   * Fatos que compõem a abertura da estação, na ordem conceitual do array.
   * Referenciam FatoPaciente.id. Controlam apenas o início; o texto final é
   * gerado naturalmente (nenhuma frase pronta é armazenada).
   */
  aberturaFactIds: string[];
  regras: RegraRevelacao[];
}

// ============================================================================
// ZONA DO PACIENTE — Persona (imutável) e Session State inicial
// ============================================================================

export interface Persona {
  /** 0–10 (lacônico ↔ falante). Validação de faixa é responsabilidade futura do Builder/testes. */
  expansividade: number;
  /** 0–10 (divaga ↔ direto). */
  objetividade: number;
  letramentoSaude: "baixo" | "medio" | "alto";
}

/** Valores INICIAIS das dimensões afetivas (0–10 cada). Só o ponto de partida. */
export interface SessionStateInicial {
  ansiedade: number;
  medo: number;
  confianca: number;
  cooperacao: number;
  frustracao: number;
}

// ============================================================================
// CASO V3 (schema congelado V1.2)
// ============================================================================

export interface CasoV3 {
  schemaVersion: "3.2";
  metadata: Metadata;
  clinicalTruth: ClinicalTruth; // zona reservada
  patientKnowledge: PatientKnowledge; // zona do paciente
  disclosurePolicy: DisclosurePolicy; // zona do paciente
  persona: Persona; // zona do paciente
  sessionStateInicial: SessionStateInicial; // zona do paciente
  examiner: Examiner; // zona reservada
}

// ============================================================================
// TIPOS INTERNOS DERIVADOS (não fazem parte do schema persistido)
// ============================================================================

/**
 * Única entrada futura permitida ao Patient Context Builder. Por construção do
 * Pick, NÃO contém clinicalTruth, examiner nem metadata — a Zona Reservada
 * nunca atravessa esta fronteira.
 */
export type PatientZoneInput = Pick<
  CasoV3,
  "patientKnowledge" | "disclosurePolicy" | "persona" | "sessionStateInicial"
>;

/**
 * Saída futura do Builder: estrutura interna derivada contendo EXCLUSIVAMENTE a
 * Zona do Paciente. Sem clinicalTruth, examiner, metadata, diagnóstico,
 * diferenciais, exames interpretados, tratamento, rubricas, checklist, histórico,
 * mensagem atual, estado dinâmico ou "fatos autorizados por turno". Não é um
 * PatientRuntimeContext.
 */
export interface PatientSafeContext {
  patientKnowledge: PatientKnowledge;
  disclosurePolicy: DisclosurePolicy;
  persona: Persona;
  sessionStateInicial: SessionStateInicial;
}
