// ============================================================================
// Clinical Knowledge Graph — TIPOS (Fase 5)
// ----------------------------------------------------------------------------
// Fundação do conhecimento clínico reutilizável. 100% ADITIVO e DESACOPLADO:
// não importa runtime, não chama IA, não cria endpoint, não conecta a nada.
// Cada nó tem: id, slug, nome, descricao, categoria, tags, refs, version, metadata.
// ============================================================================

export const KNOWLEDGE_SCHEMA_VERSION = "0.1.0" as const;

export type KnowledgeCategory =
  | "symptom"
  | "physical_finding"
  | "lung_sound"
  | "heart_sound"
  | "laboratory"
  | "imaging"
  | "ecg"
  | "procedure"
  | "score"
  | "guideline"
  | "drug"
  | "diagnosis"
  | "flow"
  | "reference";

/**
 * Relações entre nós — SEMPRE por id (nunca objetos aninhados), para evitar
 * ciclos infinitos. Os helpers percorrem com um `visited` set.
 */
export interface KnowledgeRelations {
  relacionadoA?: string[]; // ids genéricos
  sintomas?: string[];
  achados?: string[]; // physical_finding / sons
  exames?: string[];
  imagens?: string[];
  sons?: string[];
  ecg?: string[];
  fluxos?: string[];
  guidelines?: string[];
  diagnosticos?: string[];
  drogas?: string[];
  scores?: string[];
  procedimentos?: string[];
  referencias?: string[];
}

/**
 * Ponteiros para o FUTURO (ETAPA 6): Professor IA / Centro Clínico / Casos
 * Canônicos / HealthBench / Feedback. Declarados, porém NÃO utilizados nesta fase.
 */
export interface KnowledgeFutureRefs {
  professorIA?: string[]; // ids/handles de orientação
  centroClinico?: string[]; // rotas/âncoras (ex.: "/centro-clinico/sons#Crepitações grossas")
  casosCanonicos?: string[]; // canonicalId (ex.: "pac")
  healthbench?: string[]; // eixos/tags (ex.: "axis:exames_complementares")
  feedback?: string[]; // ganchos de feedback inteligente
}

export interface KnowledgeMetadata {
  fonte?: string;
  curadoria?: "curado" | "rascunho" | "revisao";
  autor?: string;
  atualizadoEm?: string;
  faixaEtaria?: "adulto" | "pediatrico" | "ambos";
  futureRefs?: KnowledgeFutureRefs;
}

/** Base comum a TODOS os nós de conhecimento. */
export interface KnowledgeBase {
  id: string; // único, ex.: "ls-crepitacoes"
  slug: string; // ex.: "crepitacoes"
  nome: string;
  descricao: string;
  categoria: KnowledgeCategory;
  tags: string[];
  refs: KnowledgeRelations;
  version: string;
  metadata: KnowledgeMetadata;
}

// ── Tipos específicos ───────────────────────────────────────────────────────

export interface KnowledgeSymptom extends KnowledgeBase {
  categoria: "symptom";
  sistemas: string[]; // ex.: ["respiratorio", "cardiovascular"]
  redFlag?: boolean;
}

export interface KnowledgePhysicalFinding extends KnowledgeBase {
  categoria: "physical_finding";
  sistema: string;
  tecnica?: "inspecao" | "palpacao" | "percussao" | "ausculta" | "geral";
}

export interface KnowledgeSound extends KnowledgeBase {
  categoria: "lung_sound" | "heart_sound";
  tipoOficial: string; // ex.: "Coarse Crackles" / "S3"
  foco?: string; // localização/foco (RUA…LLA / RUSB/Apex…)
  arquivo?: string | null; // nome do .wav no soundsCatalog
  audioUrl?: string | null;
  soundCatalogRef?: string; // csvId / id no soundsCatalog
  silencioDidatico?: boolean;
  proxy?: boolean;
}

export interface KnowledgeExam extends KnowledgeBase {
  categoria: "laboratory";
  tipoExame: "laboratorio";
  valoresReferencia?: string;
  oQueProcurar?: string[];
}

export interface KnowledgeImage extends KnowledgeBase {
  categoria: "imaging";
  modalidade: "RX" | "TC" | "USG" | "RM" | "Eco" | "Angio-TC" | "Cintilografia" | "Outros";
  regiaoAnatomica: string;
  termoOpenI?: string;
  achados: string[];
}

export interface KnowledgeECG extends KnowledgeBase {
  categoria: "ecg";
  padrao: string; // ex.: "Supra de ST", "S1Q3T3"
  achados: string[];
}

export interface KnowledgeProcedure extends KnowledgeBase {
  categoria: "procedure";
  indicacoes: string[];
  passos?: string[];
}

export interface KnowledgeScore extends KnowledgeBase {
  categoria: "score";
  variaveis: string[];
  interpretacao: string;
}

export interface KnowledgeGuideline extends KnowledgeBase {
  categoria: "guideline";
  condicao: string;
  pontosChave: string[];
}

export interface KnowledgeDrug extends KnowledgeBase {
  categoria: "drug";
  classe: string;
  indicacoes: string[];
  observacaoDose?: string;
}

export interface KnowledgeDiagnosis extends KnowledgeBase {
  categoria: "diagnosis";
  sistema: string;
  sindrome?: string;
  criterios: string[];
}

export interface KnowledgeFlow extends KnowledgeBase {
  categoria: "flow";
  queixa: string;
  etapas: string[];
}

export interface KnowledgeReference extends KnowledgeBase {
  categoria: "reference";
  tipoFonte: "diretriz" | "artigo" | "base_interna" | "atlas" | "outro";
  url?: string;
}

/** União discriminada por `categoria`. */
export type KnowledgeNode =
  | KnowledgeSymptom
  | KnowledgePhysicalFinding
  | KnowledgeSound
  | KnowledgeExam
  | KnowledgeImage
  | KnowledgeECG
  | KnowledgeProcedure
  | KnowledgeScore
  | KnowledgeGuideline
  | KnowledgeDrug
  | KnowledgeDiagnosis
  | KnowledgeFlow
  | KnowledgeReference;
