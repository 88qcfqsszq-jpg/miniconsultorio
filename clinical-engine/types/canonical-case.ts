// ============================================================================
// Clinical Engine — TIPOS DO CASO CANÔNICO
// ----------------------------------------------------------------------------
// Modelo OFICIAL e único para descrever um caso clínico de forma completa,
// independente do formato legado (data/casos-osce.ts). É a FONTE que, no futuro,
// alimentará: OSCE (via adapter), HealthBench, Centro Clínico e Professor IA.
//
// Módulo 100% ADITIVO e desacoplado. Ainda NÃO conectado ao sistema.
// Nenhum arquivo existente é alterado.
// ============================================================================

// v1.1.0 (Fase 4): adições 100% RETROCOMPATÍVEIS (todos os campos novos são
// opcionais) — multimodalidade de imagem, categoria de exame, proxy de áudio,
// recursos do Professor IA e referências de conhecimento reutilizável (refs).
// v1.2.0 (Fase 7): enriquecimento pedagógico (teachingRefs, pitfallRefs,
// differentialRefs, clinicalReasoningRefs, professorObjectives, masteryTargets,
// commonMistakes) — todos OPCIONAIS e retrocompatíveis.
export const CANONICAL_CASE_SCHEMA_VERSION = "1.2.0" as const;

// ── 1. Identificação ────────────────────────────────────────────────────────
export interface CanonicalIdentification {
  /** id do caso legado correspondente (para o adapter e rastreabilidade). */
  legacyId: number | string;
  canonicalId: string; // ex.: "pac"
  titulo: string;
  diagnostico: string;
  especialidade: string;
  sistema: string;
  sindromePrincipal: string;
  dificuldade: "basico" | "intermediario" | "avancado";
  tempoEstimadoMin?: number;
  objetivosAprendizagem: string[];
}

// ── 2. Paciente ─────────────────────────────────────────────────────────────
export interface CanonicalPatient {
  nome: string;
  idade: number;
  sexo: "M" | "F";
  tipoPaciente: "adulto" | "pediatrico";
  contexto: string; // profissão, estado civil, situação social breve
  personalidade: string;
  nivelColaboracao: "alta" | "media" | "baixa";
  linguagem: "leiga" | "tecnica" | "mista";
  estadoEmocional: string;
  queixaPrincipal: string;
}

// ── 3. História clínica ─────────────────────────────────────────────────────
export interface CanonicalHistory {
  hda: string;
  antecedentes: string[];
  medicacoes: string[];
  alergias: string[];
  habitos: string[];
  historiaFamiliar: string[];
  historiaSocial: string[];
  fatoresDeRisco: string[];
  redFlags: string[];
}

// ── 4. Script do paciente ───────────────────────────────────────────────────
export interface CanonicalPatientScript {
  aberturaEspontanea: string;
  /** Respostas por tópico quando o aluno pergunta bem (dirigido). */
  respostasDirigidas: Record<string, string>;
  /** Sintomas presentes → resposta afirmativa detalhada. */
  sintomasPresentes: Record<string, string>;
  /** Sintomas ausentes → negação clara. */
  sintomasAusentes: Record<string, string>;
  /** Resposta vaga quando a pergunta é mal formulada/aberta demais. */
  respostaVagaQuandoPerguntaMal: string;
  /** Resposta completa quando a pergunta é bem dirigida. */
  respostaCompletaQuandoPerguntaBem: string;
}

// ── 5. Exame físico ─────────────────────────────────────────────────────────
export interface CanonicalVitalSigns {
  pressaoArterial?: string;
  frequenciaCardiaca?: number;
  frequenciaRespiratoria?: number;
  temperatura?: number;
  saturacaoOxigenio?: number;
  glicemia?: number;
}

export interface CanonicalPhysicalExam {
  sinaisVitais: CanonicalVitalSigns;
  estadoGeral: string;
  respiratorio: string;
  cardiovascular: string;
  abdominal: string;
  achadosPositivos: string[];
  achadosNegativosImportantes: string[];
}

// ── 6. Ausculta (ancorada no soundsCatalog) ─────────────────────────────────
export interface CanonicalAuscultationFinding {
  presente: boolean;
  /** Tipo OFICIAL (linguagem do soundsCatalog / caso). */
  tipoOficial: string;
  localizacao: string;
  /** Arquivo .wav real (nome), quando houver na base HLS-CMDS. */
  arquivo?: string | null;
  audioUrl?: string | null;
  /** Origem/rastreabilidade no soundsCatalog. */
  origemSoundsCatalog?: string;
  /** Se for achado sem áudio na base (ex.: MV abolido). */
  silencioDidatico?: boolean;
  observacao?: string;
  // v1.1.0 (opcionais):
  /** Foco/ponto de ausculta (RUA…LLA / RUSB/Apex…), quando distinto de `localizacao`. */
  foco?: string;
  /** Áudio usado como aproximação (proxy), não o achado real (ex.: atelectasia). */
  proxy?: boolean;
  /** id do som no soundsCatalog (para referência cruzada futura). */
  soundRef?: string;
}

export interface CanonicalAuscultation {
  pulmonar: CanonicalAuscultationFinding;
  cardiaca?: CanonicalAuscultationFinding;
}

// ── 7. Exames complementares (laboratório/imagem/ECG/procedimento/escore) ────
export type CanonicalExamCategory =
  | "laboratorio"
  | "imagem"
  | "ecg"
  | "procedimento"
  | "escore"
  | "outro";

/** Obrigatoriedade do item no OSCE. */
export type CanonicalObligation = "obrigatorio" | "opcional" | "complementar";

export interface CanonicalExam {
  nome: string;
  solicitavel: boolean;
  resultadoEsperado: string;
  justificativa: string;
  interpretacao: string;
  pegadinhas?: string[];
  // v1.1.0 (opcionais):
  /** Categoria do exame (default implícito: laboratório/genérico). */
  categoria?: CanonicalExamCategory;
  /** Se é obrigatório, opcional ou complementar no OSCE. */
  obrigatoriedade?: CanonicalObligation;
  /** id de referência cruzada (Biblioteca de Exames). */
  examRef?: string;
}

// ── 8. Imagens (multimodalidade: RX/TC/USG/RM/Eco/…) ─────────────────────────
export type ImagingModality = "RX" | "TC" | "USG" | "RM" | "Eco" | "Cintilografia" | "Angio-TC" | "Outros";

export interface CanonicalImaging {
  tipo: string; // rótulo humano, ex.: "Radiografia de tórax PA e perfil"
  termoOpenI?: string;
  achadosEsperados: string[];
  interpretacao: string;
  // v1.1.0 (opcionais):
  /** Modalidade estruturada (RX/TC/USG/RM/Eco/Angio-TC/…). */
  modalidade?: ImagingModality;
  /** Região anatômica (ex.: "Tórax", "Abdome"). */
  regiaoAnatomica?: string;
  /** Indicação clínica do exame. */
  indicacao?: string;
  /** Fonte da imagem (ex.: "Open-i / NLM", "curadoria interna"). */
  fonte?: string;
  /** URL opcional de imagem já resolvida. */
  imageUrl?: string;
  pegadinhas?: string[];
  /** Obrigatório/opcional/complementar no OSCE. */
  obrigatoriedade?: CanonicalObligation;
  /** Nível de curadoria/confiança da imagem. */
  curadoria?: "curada" | "automatica" | "pendente";
  nivelConfianca?: number; // 0..1 opcional
  /** id de referência cruzada (Atlas de Imagens). */
  imageRef?: string;
}

// ── 9. ECG ──────────────────────────────────────────────────────────────────
export interface CanonicalECG {
  indicado: boolean;
  achadoEsperado: string; // "normal" ou descrição
  justificativa: string;
}

// ── 10. Diagnóstico ─────────────────────────────────────────────────────────
export interface CanonicalDifferential {
  diagnostico: string;
  porQueNaoE: string;
  achadosQueDescartam: string[];
}

export interface CanonicalDiagnosis {
  principal: string;
  porQueE: string[];
  diferenciais: CanonicalDifferential[];
}

// ── 11. Conduta ─────────────────────────────────────────────────────────────
export interface CanonicalManagement {
  tratamento: string[];
  antibiotico: string;
  criteriosGravidade: string[];
  orientacoes: string[];
  seguimento: string[];
  criteriosInternacao: string[];
  criteriosAlta: string[];
}

// ── 12. Rubrica HealthBench (compatível com o motor atual) ──────────────────
export interface CanonicalRubricCriterion {
  criterio: string;
  descricao: string;
  peso: number;
  pontuacaoMaxima: number;
}
export interface CanonicalChecklistItem {
  item: string;
  critico: boolean;
}
export interface CanonicalCriticalError {
  erro: string;
  descricao: string;
  penalidade: number;
}
export interface CanonicalRubric {
  /** Espelha Caso.rubrica_correcao (compatível com rubric-adapter.ts). */
  rubricaCorrecao: CanonicalRubricCriterion[];
  /** Espelha Caso.checklist_osce. */
  checklistOsce: CanonicalChecklistItem[];
  /** Espelha Caso.erros_criticos (critérios negativos). */
  errosCriticos: CanonicalCriticalError[];
  /** Microcritérios atômicos por eixo (opcional; alimenta cobertura mínima). */
  microcriteriosPorEixo?: Partial<Record<
    "comunicacao" | "anamnese" | "exameFisico" | "examesComplementares" | "raciocinioDiagnostico" | "condutaSeguranca",
    string[]
  >>;
}

// ── 13. Feedback esperado ───────────────────────────────────────────────────
export interface CanonicalExpectedFeedback {
  respostaModelo: string;
  checklistNotaMaxima: string[];
  errosComuns: string[];
  pegadinhas: string[];
  planoDeReforco: string[];
}

// ── 14. Centro Clínico relacionado ──────────────────────────────────────────
export interface CanonicalKnowledgeLink {
  dominio: "semiologia" | "fluxo" | "exame" | "imagem" | "som" | "escore" | "guia";
  titulo: string;
  href?: string;
  ancoras?: string[];
}
export interface CanonicalRelatedKnowledge {
  links: CanonicalKnowledgeLink[];
}

// ── 15. Professor IA ────────────────────────────────────────────────────────
export interface CanonicalProfessorGuidance {
  pontosParaReforcar: string[];
  perguntasSocraticas: string[];
  errosParaExplorar: string[];
  miniAulaSugerida: string;
  planoDeTreinoSugerido: string[];
  // v1.1.0 (opcional): recursos do Centro Clínico relacionados à orientação.
  recursosRelacionados?: CanonicalKnowledgeLink[];
}

// ── Referências de conhecimento reutilizável (v1.1.0) ───────────────────────
// Apenas PONTEIROS por id (o Knowledge Graph NÃO é criado agora). Permitem, no
// futuro, ligar o caso a nós de conhecimento reutilizáveis sem duplicar dados.
export interface CanonicalKnowledgeRefs {
  knowledgeRefs?: string[];
  symptomRefs?: string[];
  examRefs?: string[];
  imageRefs?: string[];
  soundRefs?: string[];
  flowRefs?: string[];
  guidelineRefs?: string[];
}

// ── Enriquecimento pedagógico (v1.2.0 — Fase 7) ──────────────────────────────
// Refs pedagógicas: ids do Knowledge Graph agrupados por eixo de ensino.
export interface CanonicalTeachingRefs {
  semiologia?: string[];
  fluxos?: string[];
  exames?: string[];
  imagens?: string[];
  sons?: string[];
  scores?: string[];
  guidelines?: string[];
}

/** Alvos de domínio por competência (0..1 = fração esperada do peso do card). */
export interface CanonicalMasteryTargets {
  communication?: number;
  history?: number;
  physicalExam?: number;
  diagnosis?: number;
  complementaryExams?: number;
  conduct?: number;
  safety?: number;
  documentation?: number;
}

// ── Caso Canônico completo ──────────────────────────────────────────────────
export interface CanonicalCase {
  schemaVersion: string;
  identificacao: CanonicalIdentification;
  paciente: CanonicalPatient;
  historia: CanonicalHistory;
  scriptPaciente: CanonicalPatientScript;
  exameFisico: CanonicalPhysicalExam;
  ausculta: CanonicalAuscultation;
  exames: CanonicalExam[];
  imagens: CanonicalImaging[];
  ecg: CanonicalECG;
  diagnostico: CanonicalDiagnosis;
  conduta: CanonicalManagement;
  rubrica: CanonicalRubric;
  feedbackEsperado: CanonicalExpectedFeedback;
  conhecimentoRelacionado: CanonicalRelatedKnowledge;
  professorIA: CanonicalProfessorGuidance;
  // v1.1.0 (opcional): referências de conhecimento reutilizável (Knowledge Graph futuro).
  refs?: CanonicalKnowledgeRefs;
  /** Metadados opcionais de autoria/curadoria/versão do caso. */
  meta?: {
    autor?: string;
    curadoria?: "curado" | "rascunho" | "revisao";
    versaoCaso?: string;
    atualizadoEm?: string;
    faixaEtaria?: "adulto" | "pediatrico" | "ambos";
  };
  // ── v1.2.0 (Fase 7): enriquecimento pedagógico (opcionais) ──
  /** Refs pedagógicas por eixo de ensino (ids do Knowledge Graph). */
  teachingRefs?: CanonicalTeachingRefs;
  /** Ids do grafo tocados pelas pegadinhas do caso. */
  pitfallRefs?: string[];
  /** Ids de diagnósticos diferenciais (dx-*) relevantes. */
  differentialRefs?: string[];
  /** Ids-âncora do raciocínio clínico esperado (flow-/score-/dx-*). */
  clinicalReasoningRefs?: string[];
  /** Objetivos que o Professor IA deve reforçar (texto). */
  professorObjectives?: string[];
  /** Alvos de domínio por competência (0..1). */
  masteryTargets?: CanonicalMasteryTargets;
  /** Erros comuns do aluno (texto; não são refs). */
  commonMistakes?: string[];
}
