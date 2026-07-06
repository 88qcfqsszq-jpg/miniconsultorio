// ============================================================================
// Caso Canônico — Síndrome Coronariana Aguda (IAMCSST) — legado id 1
// Rubrica/checklist/erros/sinais vitais migrados 1:1 de data/casos-osce.ts.
// Conteúdo didático adicional = ENRICHMENT (ver relatório da Fase 3).
// ============================================================================

import { CANONICAL_CASE_SCHEMA_VERSION, type CanonicalCase } from "../types/canonical-case";

export const CANONICAL_SINDROME_CORONARIANA: CanonicalCase = {
  schemaVersion: CANONICAL_CASE_SCHEMA_VERSION,
  identificacao: {
    legacyId: 1,
    canonicalId: "sindrome-coronariana",
    titulo: "Dor Torácica - Síndrome Coronariana Aguda",
    diagnostico: "Síndrome Coronariana Aguda (SCA) - IAMCSST",
    especialidade: "Cardiologia / Emergência",
    sistema: "Cardiovascular",
    sindromePrincipal: "Isquemia miocárdica aguda com supra de ST",
    dificuldade: "avancado",
    tempoEstimadoMin: 12,
    objetivosAprendizagem: [
      "Reconhecer dor torácica de padrão isquêmico e estratificar risco.",
      "Solicitar ECG nos primeiros 10 minutos e troponina.",
      "Iniciar terapia (AAS/antitrombótico) e acionar reperfusão urgente.",
      "Diferenciar de pericardite, TEP e dissecção de aorta.",
    ],
  },
  paciente: {
    nome: "Carlos Silva", idade: 52, sexo: "M", tipoPaciente: "adulto",
    contexto: "Homem de meia-idade com dor torácica intensa aguda; fatores de risco cardiovascular.",
    personalidade: "Assustado, dor intensa, temeroso.",
    nivelColaboracao: "media", linguagem: "leiga",
    estadoEmocional: "Muito ansioso ('tenho medo do que é').",
    queixaPrincipal: "Dor no peito há 2 horas",
  },
  historia: {
    hda: "Dor torácica há 2 horas, intensa (8–9/10), opressiva, possivelmente irradiada, com sudorese e sensação de gravidade. Início e características de padrão isquêmico.",
    antecedentes: ["Fatores de risco cardiovascular (enriquecimento)"],
    medicacoes: [],
    alergias: [],
    habitos: ["Tabagismo/sedentarismo (enriquecimento)"],
    historiaFamiliar: ["Doença coronariana familiar (enriquecimento)"],
    historiaSocial: [],
    fatoresDeRisco: ["Idade/sexo", "Fatores de risco cardiovascular"],
    redFlags: ["Dor torácica intensa em repouso", "Sudorese", "Sensação de morte iminente"],
  },
  scriptPaciente: {
    aberturaEspontanea: "Doutor, tô com uma dor muito forte no peito, tenho medo do que é.",
    respostasDirigidas: {
      inicio: "Começou há umas 2 horas.",
      intensidade: "É muito forte, de 8 a 9, tenho medo do que é.",
      caracteristica: "É um aperto, uma pressão no peito.",
      irradiacao: "Vai um pouco pro braço/mandíbula.",
      sudorese: "Tô suando frio.",
    },
    sintomasPresentes: { dor_opressiva: "Um aperto forte.", sudorese: "Suor frio.", dispneia: "Um pouco de falta de ar." },
    sintomasAusentes: { febre: "Febre não.", tosse: "Tosse não.", dor_pleuritica_posicional: "Não muda muito com a posição." },
    respostaVagaQuandoPerguntaMal: "Dói o peito… muito.",
    respostaCompletaQuandoPerguntaBem: "Há 2 horas comecei com um aperto muito forte no peito (8–9/10), com irradiação para braço/mandíbula, suor frio e um pouco de falta de ar.",
  },
  exameFisico: {
    sinaisVitais: { pressaoArterial: "160/95 mmHg", frequenciaCardiaca: 102, frequenciaRespiratoria: 20, temperatura: 36.8, saturacaoOxigenio: 96, glicemia: 110 },
    estadoGeral: "Ansioso, sudorese, fácies de dor.",
    respiratorio: "Murmúrio vesicular presente bilateralmente, sem crepitações.",
    cardiovascular: "Bulhas hipofonéticas, ritmo regular, FC 102, sem sopros audíveis; PA elevada.",
    abdominal: "Sem alterações relevantes.",
    achadosPositivos: ["Sudorese", "Dor torácica em repouso", "PA elevada"],
    achadosNegativosImportantes: ["Sem sopros", "Sem crepitações", "Sem atrito pericárdico"],
  },
  ausculta: {
    pulmonar: { presente: false, tipoOficial: "Murmúrio vesicular normal", localizacao: "Bilateral", arquivo: null, silencioDidatico: false, observacao: "Sem alterações pulmonares." },
    cardiaca: {
      presente: false,
      tipoOficial: "Bulhas normais / hipofonéticas, sem sopros",
      localizacao: "Focos habituais",
      arquivo: "M_N_RUSB.wav",
      audioUrl: "/HLS-CMDS/HS/M_N_RUSB.wav",
      origemSoundsCatalog: "soundsCatalog — heart 'Normal' (M_N_RUSB). O achado decisivo é o ECG, não a ausculta.",
      silencioDidatico: false,
    },
  },
  exames: [
    { nome: "ECG (primeiros 10 minutos)", solicitavel: true, resultadoEsperado: "Supradesnivelamento de ST (IAMCSST).", justificativa: "Teste diagnóstico mais importante da SCA; define reperfusão.", interpretacao: "IAM com supra de ST.", pegadinhas: ["ECG inicial pode ser não diagnóstico — repetir", "Comparar com prévios"] },
    { nome: "Troponina", solicitavel: true, resultadoEsperado: "Elevada / curva ascendente.", justificativa: "Confirma lesão miocárdica.", interpretacao: "Necrose miocárdica.", pegadinhas: ["Não atrasar reperfusão aguardando troponina no IAMCSST"] },
    { nome: "Radiografia de tórax", solicitavel: true, resultadoEsperado: "Geralmente normal; afastar dissecção/congestão.", justificativa: "Diferencial e complicações.", interpretacao: "Auxilia diferenciais.", pegadinhas: [] },
  ],
  imagens: [
    { tipo: "Radiografia de tórax (diferencial)", imageRef: "img-rx-torax", modalidade: "RX", regiaoAnatomica: "Tórax", obrigatoriedade: "complementar", termoOpenI: "chest xray normal", achadosEsperados: ["Geralmente sem alterações agudas"], interpretacao: "Ajuda a afastar dissecção/congestão. (enriquecimento)" },
  ],
  ecg: { indicado: true, achadoEsperado: "Supradesnivelamento de ST (IAMCSST) — achado-chave.", justificativa: "Define diagnóstico e indicação de reperfusão urgente." },
  diagnostico: {
    principal: "Síndrome Coronariana Aguda (SCA) - IAMCSST",
    porQueE: ["Dor torácica opressiva em repouso, intensa, com sudorese.", "ECG com supradesnivelamento de ST.", "Troponina elevada (lesão miocárdica)."],
    diferenciais: [
      { diagnostico: "Angina instável", porQueNaoE: "Aqui há supra de ST e elevação de troponina (infarto, não apenas isquemia).", achadosQueDescartam: ["Supra de ST", "Troponina elevada"] },
      { diagnostico: "Pericardite aguda", porQueNaoE: "Dor pericardítica varia com posição/respiração e há atrito; padrão de ST difuso é diferente.", achadosQueDescartam: ["Sem atrito pericárdico", "Padrão de ST localizado"] },
      { diagnostico: "Embolia pulmonar (TEP)", porQueNaoE: "Sem quadro súbito de dispneia com fator de risco tromboembólico dominante.", achadosQueDescartam: ["ECG com supra de ST"] },
      { diagnostico: "Dissecção de aorta", porQueNaoE: "Dor tipicamente lancinante/migratória com assimetria de pulsos; padrão diferente.", achadosQueDescartam: ["Supra de ST + troponina"] },
    ],
  },
  conduta: {
    tratamento: ["ECG imediato + monitorização", "AAS (aspirina)", "Antitrombótico conforme protocolo", "Analgesia/nitrato se indicado", "Reperfusão urgente (cateterismo/trombolítico)"],
    antibiotico: "Não indicado.",
    criteriosGravidade: ["Instabilidade hemodinâmica", "Arritmias", "Insuficiência cardíaca (Killip)", "Choque cardiogênico"],
    orientacoes: ["Explicar gravidade e necessidade de transferência", "Controle de fatores de risco (após fase aguda)"],
    seguimento: ["Unidade coronariana", "Reperfusão e cuidados pós-IAM", "Reabilitação cardíaca"],
    criteriosInternacao: ["Todo IAMCSST → internação em unidade coronariana / reperfusão urgente"],
    criteriosAlta: ["Não se aplica na fase aguda (transferência imediata)"],
  },
  rubrica: {
    rubricaCorrecao: [
      { criterio: "Coleta de Dados Clínicos", descricao: "Investigação completa do histórico", peso: 15, pontuacaoMaxima: 15 },
      { criterio: "Diagnóstico", descricao: "Hipótese diagnóstica correta", peso: 25, pontuacaoMaxima: 25 },
      { criterio: "Conduta e Tratamento", descricao: "Plano terapêutico correto", peso: 20, pontuacaoMaxima: 20 },
    ],
    checklistOsce: [
      { item: "Investigou duração e características da dor", critico: true },
      { item: "Mediu sinais vitais corretamente", critico: true },
      { item: "Solicitou ECG nos primeiros 10 minutos", critico: true },
      { item: "Solicitou troponina", critico: true },
    ],
    errosCriticos: [
      { erro: "Não realizar ECG nos primeiros 10 minutos", descricao: "ECG é o teste diagnóstico mais importante para SCA", penalidade: 2 },
      { erro: "Não encaminhar para cateterismo cardíaco urgente", descricao: "SCA com elevação de ST requer reperfusão urgente", penalidade: 2.5 },
    ],
    microcriteriosPorEixo: {
      anamnese: ["Caracterizou a dor (início/tipo/irradiação)", "Pesquisou fatores de risco cardiovascular", "Investigou sintomas associados (sudorese/dispneia)"],
      exameFisico: ["Mediu sinais vitais", "Auscultou coração e pulmões", "Avaliou estabilidade hemodinâmica"],
      examesComplementares: ["ECG em ≤10 min", "Troponina", "RX para diferenciais"],
      raciocinioDiagnostico: ["Formulou SCA/IAMCSST", "Interpretou supra de ST", "Considerou diferenciais (pericardite/TEP/dissecção)"],
      condutaSeguranca: ["AAS/antitrombótico", "Analgesia/nitrato se indicado", "Reperfusão urgente", "Monitorização/transferência"],
      comunicacao: ["Acolheu o paciente ansioso", "Explicou a gravidade", "Comunicou a necessidade de transferência"],
    },
  },
  feedbackEsperado: {
    respostaModelo: "Dor torácica opressiva em repouso com sudorese → suspeita de SCA. ECG imediato (≤10 min) mostra supra de ST (IAMCSST); solicito troponina, dou AAS + antitrombótico, monitorizo e aciono reperfusão urgente (cateterismo/trombolítico). Comunico a gravidade e transfiro.",
    checklistNotaMaxima: ["Caracterizou a dor", "Mediu sinais vitais", "ECG em ≤10 min", "Solicitou troponina", "Interpretou supra de ST", "AAS + antitrombótico", "Acionou reperfusão urgente"],
    errosComuns: ["Atrasar o ECG", "Não acionar reperfusão", "Aguardar troponina para agir", "Não dar AAS"],
    pegadinhas: ["ECG inicial pode ser não diagnóstico — repetir", "No IAMCSST não esperar troponina para reperfundir"],
    planoDeReforco: ["Interpretação de ECG (supra de ST)", "Protocolo de SCA/IAM", "Diferenciais da dor torácica"],
  },
  conhecimentoRelacionado: {
    links: [
      { dominio: "semiologia", titulo: "Semiologia — Cardiologia", href: "/centro-clinico/semiologia", ancoras: ["Cardiologia"] },
      { dominio: "fluxo", titulo: "Fluxo da Dor Torácica", href: "/centro-clinico/fluxos", ancoras: ["Dor torácica"] },
      { dominio: "exame", titulo: "ECG · Troponina", href: "/centro-clinico/exames", ancoras: ["ECG", "Troponina"] },
      { dominio: "imagem", titulo: "RX de tórax", href: "/centro-clinico/imagens" },
      { dominio: "escore", titulo: "Estratificação de risco (dor torácica)", ancoras: ["ABCDE"] },
    ],
  },
  professorIA: {
    pontosParaReforcar: ["ECG em ≤10 minutos é obrigatório.", "No IAMCSST, reperfusão urgente — não esperar troponina.", "AAS precoce."],
    perguntasSocraticas: ["Qual o exame que muda tudo aqui e em quanto tempo?", "Por que não esperar a troponina no supra de ST?", "Como diferenciar de pericardite e dissecção?"],
    errosParaExplorar: ["Atrasar ECG", "Não reperfundir", "Não dar AAS"],
    miniAulaSugerida: "SCA/IAMCSST: dor opressiva + supra de ST → AAS + antitrombótico + reperfusão urgente (cateterismo/trombolítico); ECG em ≤10 min; não aguardar troponina para agir.",
    planoDeTreinoSugerido: ["Interpretação de ECG", "Fluxo da dor torácica", "Protocolo de IAM", "Repetir caso de dor torácica"],
  },
  // ── refs do Knowledge Graph (Fase 6) — apenas ids existentes ──
  refs: {
    knowledgeRefs: ["dx-sca", "drug-aas", "drug-anticoagulante", "score-killip", "hs-b4"],
    symptomRefs: ["sym-dor-toracica"],
    examRefs: ["ecg-supra-st", "lab-troponina"],
    imageRefs: ["img-rx-torax"],
    soundRefs: [],
    flowRefs: ["flow-dor-toracica"],
    guidelineRefs: ["guide-sca"],
  },
  // ── Enriquecimento pedagógico (Fase 7) ──
  teachingRefs: {
    fluxos: ["flow-dor-toracica"],
    exames: ["ecg-supra-st", "lab-troponina"],
    imagens: ["img-rx-torax"],
    sons: ["hs-b4"],
    scores: ["score-killip"],
    guidelines: ["guide-sca"],
  },
  differentialRefs: ["dx-tep"],
  pitfallRefs: ["ecg-supra-st", "lab-troponina"],
  clinicalReasoningRefs: ["flow-dor-toracica", "dx-sca", "ecg-supra-st"],
  professorObjectives: [
    "ECG em ≤10 minutos é obrigatório.",
    "No IAMCSST, reperfusão urgente — não esperar troponina.",
    "AAS precoce.",
  ],
  commonMistakes: ["Atrasar o ECG", "Não acionar reperfusão", "Aguardar troponina para agir", "Não dar AAS"],
  masteryTargets: { communication: 0.75, history: 0.85, physicalExam: 0.7, diagnosis: 0.95, complementaryExams: 0.95, conduct: 0.95, safety: 0.95, documentation: 0.7 },
};

export default CANONICAL_SINDROME_CORONARIANA;
