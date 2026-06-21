/**
 * Tipos definitivos do módulo "Análise de Imagem"
 *
 * Este módulo é educacional e focado em RX de tórax via NIH Chest X-ray.
 * Não é diagnóstico clínico. Uso apenas para fins educacionais.
 */

// ============================================================================
// TIPOS FUNDAMENTAIS
// ============================================================================

export type ModalidadeImagem = "RX";
export type RegiaoImagem = "torax";
export type TipoFonte = "NIH Chest X-ray" | "Fixture educacional local" | "Google Cloud Storage";
export type NivelConfianca = "baixa" | "media" | "alta";
export type NivelDificuldade = "facil" | "medio" | "dificil";

// ============================================================================
// MAPEAMENTO NIH
// ============================================================================

/**
 * Rótulo radiológico NIH normalizado
 * Usado para buscar imagens no NIH Chest X-ray
 */
export type RadiologyLabelNIH =
  | "No Finding"
  | "Pneumonia"
  | "Pneumothorax"
  | "Effusion"
  | "Cardiomegaly"
  | "Atelectasis"
  | "Edema"
  | "Nodule"
  | "Mass"
  | "Infiltration"
  | "Consolidation"
  | "Hernia"
  | "Fibrosis"
  | "Pleural Thickening"
  | "Emphysema";

/**
 * Resultado do mapeamento de diagnóstico clínico para rótulo NIH
 */
export interface ResultadoMapeamentoNIH {
  labelNIH: RadiologyLabelNIH;
  confiancaMapeamento: NivelConfianca;
  justificativa: string;
  diagnosticoOriginal: string;
}

// ============================================================================
// IMAGEM RADIOLÓGICA
// ============================================================================

/**
 * Metadados originais do NIH (bruto, sem processamento)
 * Preservado para auditoria e rastreamento
 */
export interface MetadadosOriginaisNIH {
  imageId?: string;
  patientId?: string;
  dicomPath?: string;
  labels?: string[];
  url?: string;
  dataExame?: string;
  idade?: number;
  sexo?: string;
  [key: string]: unknown;
}

/**
 * Definição completa de imagem radiológica
 * Campo opcional no Caso clínico
 */
export interface ImagemRadiologica {
  // Disponibilidade e tipo
  disponivel: boolean;
  modalidade: ModalidadeImagem;
  regiao: RegiaoImagem;

  // Identificação e localização
  imageId: string;
  imageUrl: string;
  labels: RadiologyLabelNIH[];
  diagnosticoRadiologico: string;
  achadoPrincipal: string;

  // Fonte e atribuição (OBRIGATÓRIO)
  fonte: TipoFonte;
  atribuicao: string; // Ex: "NIH Chest X-ray Database | domínio público"

  // Integração e validação
  integracaoReal: boolean; // true = NIH/Google Cloud | false = fixture local
  validadoPorIA: boolean; // OpenAI confirmou coerência
  podeExibirAoAluno: boolean; // true = passou em todas as validações

  // Gabarito e dados educacionais
  gabarito?: GabaritoRadiologico;

  // Metadados originais preservados
  metadadosOriginais?: MetadadosOriginaisNIH;

  // Timestamp de quando foi associada ao caso
  dataAssociacao?: string;
}

// ============================================================================
// GABARITO RADIOLÓGICO
// ============================================================================

/**
 * Gabarito esperado para interpretação radiológica
 * Gerado por OpenAI baseado no caso clínico e imagem
 */
export interface GabaritoRadiologico {
  // Descrição esperada
  descricaoEsperada: string;
  diagnosticoRadiologico: string;
  correlacaoClinica: string;

  // Achados esperados
  principaisAchados: string[];
  achiadosSecundarios?: string[];

  // Pegadinhas comuns
  pegadinhas: string[];

  // Nível de dificuldade esperado
  nivelDificuldade: NivelDificuldade;

  // Rubrica de avaliação
  rubrica: ItemRubricaRadiologia[];
}

/**
 * Item da rubrica de avaliação de interpretação radiológica
 */
export interface ItemRubricaRadiologia {
  criterio: string;
  peso: number; // 0 a 1
  descricao: string;
  exemploBom?: string;
  exemploRuim?: string;
}

// ============================================================================
// RESPOSTA DO ALUNO
// ============================================================================

/**
 * Resposta do aluno ao interpretar uma imagem radiológica
 */
export interface RespostaAlunoImagem {
  casoId: string;
  imageId: string;
  tentativa: number;

  // Resposta estruturada
  descricaoExame: string;
  achadoPrincipal: string;
  hipoteseDiagnostica: string;

  // Timestamp
  dataResposta: string;
  tempoDecorrido?: number; // em segundos
}

// ============================================================================
// FEEDBACK E CORREÇÃO
// ============================================================================

/**
 * Feedback da IA sobre a interpretação radiológica do aluno
 */
export interface FeedbackImagemRadiologica {
  // Avaliação
  nota: number; // 0 a 10
  confiancaAvaliacao: NivelConfianca;

  // Análise estruturada
  pontosFortes: string[];
  erros: string[];
  feedback: string;

  // Resposta do modelo (para referência)
  respostaModelo: string;

  // Rubrica detalhada
  rubricaDetalhada: {
    criterio: string;
    peso: number;
    pontosObtidos: number;
    maximos: number;
    observacao?: string;
  }[];

  // Sugestões
  sugestoesEstudo?: string[];
  recursosComplementares?: string[];

  // Timestamp
  dataFeedback: string;
}

// ============================================================================
// DETECÇÃO E BUSCA
// ============================================================================

/**
 * Resultado da detecção de necessidade de imagem radiológica
 */
export interface ResultadoDeteccaoImagem {
  precisaImagem: boolean;
  confianca: NivelConfianca;
  justificativa: string;

  // Se precisar imagem
  modalidade?: ModalidadeImagem;
  regiao?: RegiaoImagem;
  diagnosticoEsperado?: string;
  achadoEsperado?: string;
  labelNIHSugerido?: RadiologyLabelNIH;
}

/**
 * Parâmetros para busca de imagem radiológica
 */
export interface ParametrosBuscaImagem {
  labelNIH: RadiologyLabelNIH;
  modalidade: ModalidadeImagem;
  regiao: RegiaoImagem;
  faixaEtaria?: string; // Ex: "adulto", "criança", etc.
  viewPosition?: "PA" | "AP"; // Posição anterior/posterior
  excluirMultiplosAchados?: boolean; // true = preferir imagens com 1 achado
}

/**
 * Resultado da busca de imagem radiológica
 */
export interface ResultadoBuscaImagem {
  sucesso: boolean;
  imagem?: ImagemRadiologica;
  motivo?: string; // Se não encontrou ou erro
  requerConfiguracao?: boolean; // true = falta configuração (ex: Google Cloud)
  proximosPassos?: string[]; // Passos para resolver a configuração
  tentativasRestantes?: number;
}

// ============================================================================
// VALIDAÇÃO
// ============================================================================

/**
 * Resultado da validação de coerência entre caso e imagem
 * Feita por OpenAI
 */
export interface ResultadoValidacaoImagem {
  coerente: boolean;
  confianca: NivelConfianca;
  motivo: string;
  achadoEsperado: string;
  achadoEncontrado: string;
  podeExibirAoAluno: boolean;

  // Detalhes de por que foi aceita ou rejeitada
  compatibilidadeClinica?: string;
  compatibilidadeRadiologica?: string;
}

// ============================================================================
// ERRO CONTROLADO DO PROVIDER
// ============================================================================

/**
 * Erro controlado quando provider NIH não está configurado
 * Nunca retorna imagem falsa
 */
export interface ErroProviderNIH {
  sucesso: false;
  motivo: "NIH Chest X-ray ainda não configurado";
  requerConfiguracao: true;
  proximosPassos?: string[];
  variavelFaltante?: string;
  documentacao?: string;
}

// ============================================================================
// SERVIÇO RADIOLÓGICO
// ============================================================================

/**
 * Interface do serviço principal de radiologia
 * Define as operações disponíveis
 */
export interface IRadiologyImageService {
  detectarNecessidadeImagem(
    casoClinico: any // Tipo Caso do projeto
  ): Promise<ResultadoDeteccaoImagem>;

  buscarImagemRadiologica(
    parametros: ParametrosBuscaImagem
  ): Promise<ResultadoBuscaImagem>;

  validarCoerenciaImagemCaso(
    casoClinico: any,
    imagemSelecionada: ImagemRadiologica
  ): Promise<ResultadoValidacaoImagem>;

  gerarGabaritoImagem(
    casoClinico: any,
    imagemSelecionada: ImagemRadiologica
  ): Promise<GabaritoRadiologico>;

  corrigirRespostaImagem(
    respostaAluno: RespostaAlunoImagem,
    casoClinico: any,
    imagemSelecionada: ImagemRadiologica,
    gabarito: GabaritoRadiologico
  ): Promise<FeedbackImagemRadiologica>;
}

// ============================================================================
// PROVIDER NIH
// ============================================================================

/**
 * Interface do provider NIH Chest X-ray
 * Preparado para integração real com Google Cloud / BigQuery
 */
export interface INihProvider {
  buscarImagemNIH(
    parametros: ParametrosBuscaImagem
  ): Promise<ResultadoBuscaImagem | ErroProviderNIH>;

  estaConfigurado(): boolean;
  obterStatusConfiguracao(): string;
}

// ============================================================================
// LOG E AUDITORIA
// ============================================================================

/**
 * Registro de log para auditoria do módulo radiológico
 */
export interface RegistroRadiologiaAuditoria {
  casoId: string;
  timestamp: string;
  evento:
    | "deteccao_solicitada"
    | "busca_solicitada"
    | "validacao_solicitada"
    | "gabarito_gerado"
    | "resposta_recebida"
    | "feedback_gerado";
  detalhe: string;
  sucesso: boolean;
  erro?: string;
}
