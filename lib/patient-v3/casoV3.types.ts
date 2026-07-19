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
 * Reúso de tipos legados: apenas SinaisVitais (de @/lib/types) é reaproveitado,
 * por corresponder exatamente ao conceito clínico da Zona Reservada. Nenhum
 * tipo legado foi alterado. Os demais tipos clínicos são declarados localmente
 * em forma mínima e camelCase (os equivalentes legados usam snake_case / campos
 * extras que não correspondem ao contrato mínimo V1.2).
 *
 * SUBFASE 2A.2: os tipos auxiliares da Zona Reservada (ClinicalTruth/Examiner)
 * foram enriquecidos para preservar dados reais do Caso Ouro (exame físico por
 * sistema, painéis laboratoriais com múltiplos analitos, pontuação máxima de
 * rubrica, flag de erro evitável, escala/domínios ponderados/penalidades
 * automáticas/modelo SOAP do feedback detalhado) — SEM alterar os sete blocos
 * do schema V1.2 nem os campos diretamente nomeados em CasoV3/Metadata/
 * ClinicalTruth/PatientKnowledge/DisclosurePolicy/Persona/SessionStateInicial/
 * Examiner. A Zona do Paciente (PatientZoneInput/PatientSafeContext) não foi
 * tocada nesta subfase.
 */

import type { SinaisVitais } from "@/lib/types";

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

/**
 * Achado de exame físico por sistema — genérico (não específico a nenhuma
 * especialidade). Representa um par nome/valor observado (ex.: nome:
 * "ausculta_cardiaca", valor: "Bulhas hipofonéticas, ritmo regular...").
 */
export interface AchadoExameFisico {
  nome: string;
  valor: string;
}

/**
 * Seção de achados de um sistema do exame físico. `sistema` é texto livre
 * (ex.: "Geral", "Cardiovascular") — deliberadamente genérico, sem propriedades
 * fixas por especialidade (nenhum campo `cardiovascular`/`respiratorio`/etc.).
 */
export interface SecaoExameFisico {
  sistema: string;
  achados: AchadoExameFisico[];
}

/**
 * Exame físico verdadeiro do caso — tipo V3 LOCAL (não reutiliza mais o
 * ExameFisico legado de @/lib/types, que era achatado e não comportava achados
 * por sistema). Mantém os campos achatados (compatibilidade com o resumo já
 * usado) e acrescenta `porSistema`, genérico, para achados adicionais reais
 * (ex.: exame_fisico_interativo do Caso 1 — geral/cardiovascular).
 */
export interface ExameFisicoAchados {
  inspecao: string;
  palpacao: string;
  ausculta: string;
  percussao: string;
  observacoes: string;
  regiao?: string;
  achadosPositivos?: string[];
  achadosNegativos?: string[];
  porSistema?: SecaoExameFisico[];
}

/** Um analito dentro de um painel laboratorial (ex.: hemoglobina, troponinaI). */
export interface AnalitoExame {
  nome: string;
  /** Valor já formatado como na fonte (ex.: "14,3 g/dL") — nunca separado em número+unidade. */
  valor: string;
  /** Valor de referência do analito, quando existir individualmente (ex.: valoresReferencia). */
  referencia?: string;
}

interface ExameResultadoBase {
  nome: string;
  valorReferencia?: string;
  interpretacao?: string;
}

/**
 * Resultado de um exame complementar (dado do avaliador). `resultado` é usado
 * para um exame simples ou um resumo textual; `itens` é usado para um painel
 * com múltiplos analitos (ex.: hemograma). Os dois podem coexistir; ao menos
 * um dos dois é exigido pela união abaixo.
 */
export type ExameResultado =
  | (ExameResultadoBase & { resultado: string; itens?: AnalitoExame[] })
  | (ExameResultadoBase & { resultado?: never; itens: AnalitoExame[] });

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
  exameFisicoVerdadeiro: ExameFisicoAchados; // tipo V3 local (Subfase 2A.2)
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
  /** Pontuação máxima do critério (ex.: rubrica_correcao[].pontuacao_maxima do legado). */
  pontuacaoMaxima?: number;
}

export interface ChecklistItem {
  item: string;
  critico?: boolean;
  /**
   * Agrupamento opcional e genérico (ex.: "Subjetivo"/"Objetivo"/"Avaliação"/
   * "Plano" para achatar um modelo SOAP, ou "Anamnese"/"Exame físico" para
   * achatar um checklist categorizado). Não é estado de execução.
   */
  categoria?: string;
}

export interface ErroCritico {
  erro: string;
  descricao?: string;
  penalidade: number;
  /** Se o erro era evitável (ex.: erros_criticos[].evitavel do legado). */
  evitavel?: boolean;
}

/** Escala de avaliação (ex.: feedbackDetalhado.escala do legado). */
export interface EscalaAvaliacao {
  total: number;
  minimoAprovacao: number;
}

/** Critério individual dentro de um domínio ponderado do feedback detalhado. */
export interface CriterioPonderado {
  item: string;
  pontos: number;
  critico?: boolean;
}

/** Domínio ponderado do feedback detalhado (ex.: feedbackDetalhado.dominios do legado). */
export interface DominioPonderado {
  nome: string;
  pontos: number;
  criterios: CriterioPonderado[];
}

/**
 * Penalidade automática de escore (ex.: feedbackDetalhado.penalidadesAutomaticas
 * do legado). Representa um conceito distinto de ErroCritico — não é fundida
 * com errosCriticos.
 */
export interface PenalidadeAutomatica {
  condicao: string;
  penalidade: number;
  justificativa: string;
}

/** Seção de um modelo SOAP esperado (ex.: modelo_soap.subjetivo do legado). */
export interface SecaoModeloSoap {
  componentesObrigatorios: string[];
}

/** Modelo SOAP esperado (ex.: modelo_soap do legado). */
export interface ModeloSoap {
  subjetivo: SecaoModeloSoap;
  objetivo: SecaoModeloSoap;
  avaliacao: SecaoModeloSoap;
  plano: SecaoModeloSoap;
}

export interface FeedbackModelo {
  acertosEsperados: string[];
  errosComuns: string[];
  orientacoesPedagogicas: string[];
  /** Feedback detalhado (opcional) — coexiste com os três campos simples acima. */
  escalaAvaliacao?: EscalaAvaliacao;
  dominiosPonderados?: DominioPonderado[];
  penalidadesAutomaticas?: PenalidadeAutomatica[];
  modeloSoap?: ModeloSoap;
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
