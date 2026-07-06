import type { ECGLead } from "./ecg/types";

export interface FonteExamePainel {
  interpretacao: string;
  dados: Record<string, string>;
}

export interface FonteExamesLaboratoriais {
  hemograma?: FonteExamePainel;
  funcao_renal?: FonteExamePainel;
  eletrolitos?: FonteExamePainel;
  marcadores_inflamatorios?: FonteExamePainel;
  gasometria?: FonteExamePainel;
  marcadores_cardiacos?: FonteExamePainel;
  funcao_hepatica?: FonteExamePainel;
  coagulograma?: FonteExamePainel;
  urina_tipo_1?: FonteExamePainel;
}

export interface DadosPediatricos {
  idadeMeses?: number;
  idadeAnos?: number;
  faixaEtaria: "neonato" | "lactente" | "pre_escolar" | "escolar" | "adolescente";
  responsavel: {
    nome: string;
    parentesco: "mãe" | "pai" | "avó" | "responsável";
  };
  peso?: string;
  estatura?: string;
  perimetroCefalico?: string;
  estadoVacinal?: string;
  gestacaoParto?: string;
  desenvolvimento?: string;
  alimentacao?: string;
  aberturaResponsavel?: string;
}

export interface Paciente {
  id: string;
  nome: string;
  idade: number;
  sexo: "M" | "F";
  queixaPrincipal: string;
  historicoDoenca: string;
  antecedentes: string[];
  profissao?: string;
  estado_civil?: string;
  alergias?: string[];
  medicamentos_em_uso?: string[];
  tipoPaciente?: "adulto" | "pediatrico";
  dadosPediatricos?: DadosPediatricos;
}

export interface SinaisVitais {
  pressaoArterial: string;
  frequenciaCardiaca: number;
  frequenciaRespiratoria: number;
  temperatura: number;
  saturacaoOxigenio: number;
  glicemia?: number;
  peso?: number;
  altura?: number;
  imc?: number;
}

export interface ExameFisico {
  inspecao: string;
  palpacao: string;
  ausculta: string;
  percussao: string;
  observacoes: string;
  regiao?: string;
  achados_positivos?: string[];
  achados_negativos?: string[];
}

export interface ExameComplementar {
  nome: string;
  descricao?: string;
  resultado?: string;
  valor_referencia?: string;
  unidade?: string;
  interpretacao?: string;
}

export interface ExameSolicitado {
  nome: string;
  resultado: string;
  timestamp: Date;
}

export interface ChecklistOSCE {
  item: string;
  realizado: boolean;
  critico?: boolean;
}

export interface ChecklistOcultoExaminador {
  comunicacao?: string[];
  anamnese?: string[];
  exame_fisico?: string[];
  exames_complementares?: string[];
  raciocinio?: string[];
  conduta?: string[];
  soap?: string[];
  oQueProfessorQuer?: string;
}

export interface ComunicacaoMedica {
  acertos: string[];
  pontosDeMelhoria: string[];
  comentario: string;
  exemplosDeFrasesMelhores?: string[];
}

export interface RubricaAvaliacao {
  criterio: string;
  peso: number;
  descricao: string;
  pontuacao_maxima: number;
}

export interface CompetenciaAvaliacao {
  nome: string;
  pontosObtidos: number;
  pontosMaximos: number;
  acertos: string[];
  melhorias: string[];
  evidencias?: string[];
}

export interface ModeloSOAPItem {
  secao: "S" | "O" | "A" | "P";
  componentes_obrigatorios: string[];
  componentes_desejados?: string[];
}

export interface ErrosCriticos {
  erro: string;
  descricao: string;
  penalidade: number;
  evitavel?: boolean;
}

export interface CriterioGravidade {
  severidade: "leve" | "moderada" | "grave";
  sinais: string[];
  descricao: string;
  recomendacao: string;
}

export interface MensagemChat {
  id: string;
  tipo: "estudante" | "paciente";
  conteudo: string;
  timestamp: Date;
}

export interface RespostaExameFisico {
  solicitado: boolean;
  dados?: ExameFisico;
}

export interface RespostaSinaisVitais {
  solicitado: boolean;
  dados?: SinaisVitais;
}

export interface FormularioSOAP {
  subjetivo: string;
  objetivo: string;
  avaliacao: string;
  plano: string;
}

export interface DiagnosticoFormulario {
  hipotesePrincipal: string;
  diagnosticosDisferenciais: string[];
  examesIndicados: string[];
  conduta: string;
}

export interface ObjetivosCumpridos {
  comunicacao: string[];
  anamnese: string[];
  exameFisico: string[];
  examesComplementares: string[];
  raciocinioDiagnostico: string[];
  conduta: string[];
}

export interface FeedbackOSCE {
  nota: number;
  percentual: number;
  classificacao: "Excelente" | "Bom" | "Regular" | "Insuficiente";
  justificativaNota: string;
  tempoAtendimento: number;

  rubricaAvaliacao?: CompetenciaAvaliacao[];
  objetivosCumpridos?: ObjetivosCumpridos;

  resumoCaso: {
    diagnosticoEsperado: string;
    diagnosticoInformado?: string;
    sindromePrincipal: string;
    achadosChave: string[];
    raciocinioEsperado: string;
  };

  anamnese: {
    acertos: string[];
    faltouPerguntar: string[];
    perguntasPoucoUteis: string[];
    comentario: string;
  };

  exameFisico: {
    manobrasRealizadas: string[];
    achadosEncontrados: string[];
    manobrasEsquecidas: string[];
    comentario: string;
  };

  sinaisVitais: {
    interpretacao: string;
    pontosDeAlerta: string[];
  };

  raciocinioDiagnostico: {
    hipoteseDoEstudante: string;
    diagnosticoEsperado: string;
    avaliacao: string;
    diferenciaisAdequados: string[];
    diferenciaisFaltantes: string[];
    comentario: string;
  };

  examesComplementares: {
    adequados: string[];
    faltantes: string[];
    desnecessarios: string[];
    comentario: string;
  };

  conduta: {
    adequada: string[];
    incompleta: string[];
    erros: string[];
    condutaModelo: string;
  };

  soap: {
    subjetivo: string;
    objetivo: string;
    avaliacao: string;
    plano: string;
    comentarioGeral: string;
  };

  errosCriticos: string[];
  respostaModeloOSCE: string;
  planoDeEstudo: (string | { topico: string; explicacao: string })[];

  checklistExaminador?: {
    oQueProfessorQuer?: string;
    itensCumpridos: string[];
    itensNaoCumpridos: string[];
    comentario: string;
  };

  comunicacaoMedica?: ComunicacaoMedica;
}

export interface Caso {
  // Identificação e metadados
  id: string;
  titulo: string;
  sistema: string;
  tema: string;
  nivel: "iniciante" | "intermediario" | "avancado";
  tipo_estacao: "entrevista" | "exame_fisico" | "procedimento" | "integrada";
  tempo_osce_minutos: number;
  objetivo_pedagogico: string;
  tipoPaciente?: "adulto" | "pediatrico";

  // Dados visíveis ao estudante
  dados_visiveis_ao_estudante: {
    nome_paciente: string;
    idade: number;
    sexo: string;
    queixa_principal: string;
    historia_breve: string;
  };

  // Dados ocultos do sistema
  dados_ocultos_do_sistema: {
    diagnostico_principal: string;
    diagnosticos_diferenciais: string[];
    sindromes_associadas?: string[];
  };

  // Dados do paciente (compatibilidade)
  descricaoBreve: string;
  categoria: "SCA" | "Pneumonia" | "Asma" | string;
  paciente: Paciente;

  // Respostas do paciente virtual
  respostas_do_paciente: {
    [chave: string]: string;
  };
  respostaPaciente?: {
    [chave: string]: string;
  };

  // Sinais vitais
  sinais_vitais: {
    corretos: SinaisVitais;
    variacoes?: {
      [chave: string]: SinaisVitais;
    };
  };
  sinaisVitaisCorretos?: SinaisVitais;

  // Exame físico
  exame_fisico: {
    correto: ExameFisico;
    por_regiao?: {
      [regiao: string]: ExameFisico;
    };
  };
  exameFisicoCorreto?: ExameFisico;

  // Exames complementares
  exames_complementares_disponiveis: ExameComplementar[];

  // Hipóteses diagnósticas esperadas
  hipoteses_diagnosticas_esperadas: {
    diagnostico: string;
    probabilidade: number;
    criterios_minimos: string[];
  }[];

  // Diagnósticos diferenciais
  diagnosticos_diferenciais: {
    diagnostico: string;
    criterios_exclusao: string[];
    achados_que_descartam: string[];
  }[];
  examesIndicados?: string[];

  // Conduta esperada
  conduta_esperada: {
    imediata: string[];
    curto_prazo: string[];
    longo_prazo?: string[];
    encaminhamentos?: string[];
  };
  condutaCorreta?: string;

  // Critérios de gravidade
  criterios_de_gravidade: CriterioGravidade[];

  // Erros críticos
  erros_criticos: ErrosCriticos[];

  // Checklist OSCE
  checklist_osce: ChecklistOSCE[];

  // Rúbrica de correção
  rubrica_correcao: RubricaAvaliacao[];

  // Modelo SOAP esperado
  modelo_soap: {
    subjetivo: ModeloSOAPItem;
    objetivo: ModeloSOAPItem;
    avaliacao: ModeloSOAPItem;
    plano: ModeloSOAPItem;
  };

  // Feedback modelo
  feedback_modelo: {
    acertos_esperados: string[];
    erros_comuns: string[];
    orientacoes_pedagogicas: string[];
    recursos_complementares?: string[];
  };

  // Compatibilidade com sistema anterior
  feedbackPadrao?: Omit<FeedbackOSCE, "tempoAtendimento">;
  diagnosticoCorreto?: string;

  // Exame físico interativo (novo)
  exame_fisico_interativo?: ExameFisicoInterativo;

  // Checklist oculto do examinador
  checklist_oculto_examinador?: ChecklistOcultoExaminador;

  // Auditoria OSCE - Temas e subtópicos
  temaOSCE?: string;
  subtopicosOSCE?: string[];

  // ECG 12 derivações
  ecg?: {
    indicado?: boolean;
    padrao?: string;
    observacao?: string;
  };

  // Imagem radiológica (opcional)
  imagemRadiologica?: {
    disponivel: boolean;
    modalidade: "RX";
    regiao: "torax";
    imageId: string;
    imageUrl: string;
    labels: string[];
    diagnosticoRadiologico: string;
    achadoPrincipal: string;
    fonte: string;
    atribuicao: string;
    integracaoReal: boolean;
    validadoPorIA: boolean;
    podeExibirAoAluno: boolean;
    gabarito?: any;
    metadadosOriginais?: any;
  };

  // Status de ativação
  ativo?: boolean;

  // Exames esperados para este caso clínico
  esperadosExames?: EsperadosExames;

  // ECG gerado durante o atendimento (runtime)
  ecgGerado?: ECGGerado;

  // Fonte de exames laboratoriais (legado)
  fonte_exames_laboratoriais?: FonteExamesLaboratoriais;
}

export interface ExameFisicoInterativo {
  geral?: {
    estado_geral?: string;
    consciencia?: string;
    hidratacao?: string;
    coloracao?: string;
    facies?: string;
    postura?: string;
    marcha?: string;
  };
  cardiovascular?: {
    inspecao_precordial?: string;
    ictus?: string;
    fremitos?: string;
    ausculta_cardiaca?: string;
    pulsos?: string;
    perfusao?: string;
    turgencia_jugular?: string;
    refluxo_hepatojugular?: string;
    edema?: string;
  };
  respiratorio?: {
    inspecao_torax?: string;
    padrao_respiratorio?: string;
    expansibilidade?: string;
    fremito_toracovocal?: string;
    percussao?: string;
    ausculta_pulmonar?: string;
    broncofonia?: string;
    egofonia?: string;
    musculatura_acessoria?: string;
  };
  abdominal?: {
    inspecao?: string;
    ausculta?: string;
    percussao?: string;
    palpacao_superficial?: string;
    palpacao_profunda?: string;
    dor_palpacao?: string;
    visceromegalias?: string;
    defesa?: string;
  };
  membros?: {
    edema?: string;
    pulsos?: string;
    perfusao?: string;
    cianose?: string;
    varizes?: string;
    panturrilha?: string;
    temperatura?: string;
    mobilidade?: string;
  };
}

export interface ManobraRealizada {
  id: string;
  categoria: "geral" | "cardiovascular" | "respiratorio" | "abdominal" | "membros";
  textDigitado: string;
  resposta: string;
  timestamp: Date;
}

// ============================================================================
// TIPOS PARA INTEGRAÇÃO DO ECGSYN COMO EXAME COMPLEMENTAR
// ============================================================================

export interface InterpretacaoECG {
  frequenciaCardiaca: number;
  ritmo: string;
  eixoMedio: number;
  intervalosPR: number[];
  duracoesQRS: number[];
  duracaoQTc: number;
}

export interface MetadadosECG {
  presetId: string;
  dataGeracao: Date;
  versaoECGSyn: string;
  sintético: boolean;
  avisoEducacional: string;
  referências: string[];
  fontePrincipal: string;
}

export interface ECGGerado {
  tipo: "ECG";
  nome: string;
  dataHora: string;
  presetId: string;
  padraoSelecionado: string;
  selectedLeads: ECGLead[];
  resultado: any; // RespostaGeracaoECG do módulo ECGSYN
  interpretacao: InterpretacaoECG;
  pontosEnsino: string[];
  aviso: string;
  metadata?: MetadadosECG;
}

export interface EsperadoExame {
  indicado: boolean;
  prioridade: "obrigatório" | "recomendado" | "opcional" | "não indicado";
  achadoEsperado?: string;
  interpretacaoEsperada?: string[];
  observacoes?: string;
  // Novo para ECG
  presetId?: string;
  justificativa?: string;
  pontosDeEnsino?: string[];
}

export interface EsperadosExames {
  ecg?: EsperadoExame;
  // Futuro: ultrassom, radiografia, ressonância, etc
}
