// ============================================================================
// Professor IA — TIPOS PRIMITIVOS, ENUMS E UNIÕES
// ----------------------------------------------------------------------------
// Módulo 100% DESACOPLADO. Ainda NÃO utilizado. Não chama IA, não cria endpoint,
// não altera feedback/HealthBench/OSCE/Centro Clínico. Apenas define o
// vocabulário de tipos do futuro Professor IA.
//
// As interfaces compostas ficam em ./interfaces.ts. Este arquivo concentra os
// tipos atômicos reutilizados por todos os builders.
// ============================================================================

/** Identificadores. */
export type CasoId = number | string;
export type AlunoId = string;
export type AttemptId = string;

/** ISO-8601. */
export type Timestamp = string;

/** Valor normalizado 0..1. */
export type Score01 = number;

/** Nota na escala do app (0..20). */
export type Nota20 = number;

/**
 * Modo de interação do Professor IA (para uso futuro).
 * - pos_caso   : revisão logo após finalizar um atendimento (com HealthBench)
 * - pre_caso   : preparação antes de iniciar um caso
 * - tutoria    : tira-dúvidas guiado por um caso/tema
 * - revisao    : revisão de um tema/competência específica
 * - livre      : conversa aberta ancorada na base do sistema
 */
export type ProfessorIAMode = "pos_caso" | "pre_caso" | "tutoria" | "revisao" | "livre";

/** Os 6 eixos/competências oficiais do feedback (espelham CARDS_CONFIG). */
export type CompetencyAxis =
  | "comunicacao"
  | "anamnese"
  | "exameFisico"
  | "examesComplementares"
  | "raciocinioDiagnostico"
  | "condutaSeguranca";

export const COMPETENCY_LABELS: Record<CompetencyAxis, string> = {
  comunicacao: "Comunicação e postura médica",
  anamnese: "Anamnese dirigida",
  exameFisico: "Exame físico",
  examesComplementares: "Exames complementares",
  raciocinioDiagnostico: "Raciocínio diagnóstico",
  condutaSeguranca: "Conduta e Segurança",
};

/** Peso visual oficial de cada eixo (soma 20). Espelha CARDS_CONFIG (somente leitura). */
export const COMPETENCY_WEIGHTS: Record<CompetencyAxis, number> = {
  comunicacao: 2,
  anamnese: 4,
  exameFisico: 3,
  examesComplementares: 2,
  raciocinioDiagnostico: 5,
  condutaSeguranca: 4,
};

/** Domínios de conhecimento do Centro Clínico e afins. */
export type KnowledgeDomain =
  | "semiologia"
  | "fluxo"
  | "exame"
  | "imagem"
  | "som"
  | "escore"
  | "conduta"
  | "guia";

/** Tipo de recurso de conhecimento (para navegação futura). */
export type ResourceType =
  | "pagina"
  | "secao"
  | "fluxograma"
  | "audio"
  | "imagem"
  | "checklist"
  | "referencia";

/** Sistema/tema clínico do caso (usado para relacionar conhecimento). */
export type ClinicalTheme =
  | "respiratorio"
  | "cardiovascular"
  | "abdominal"
  | "neurologico"
  | "infectologia"
  | "hematologia"
  | "pediatria"
  | "urgencia"
  | "outro";

/** Prioridade dentro do plano de estudo. */
export type StudyPriority = 1 | 2 | 3;

/** Papel numa futura conversa (não há chat ainda; apenas o vocabulário). */
export type ConversationRole = "system" | "professor" | "aluno" | "contexto";

/** Origem de cada bloco de dado no contexto (auditoria/proveniência). */
export type DataSource =
  | "caso"
  | "atendimento"
  | "healthbench"
  | "estudo_final"
  | "centro_clinico"
  | "derivado";

/** Severidade de uma lacuna detectada no desempenho. */
export type GapSeverity = "critica" | "importante" | "leve";

/** Versão do schema do contexto (permite evolução sem quebrar consumidores). */
export const PROFESSOR_IA_CONTEXT_SCHEMA_VERSION = "0.1.0" as const;
