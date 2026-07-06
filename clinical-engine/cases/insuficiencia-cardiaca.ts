// ============================================================================
// Caso Canônico — Insuficiência Cardíaca Sistólica (FEVE reduzida) — legado id 8
// Rubrica/checklist/erros/sinais vitais migrados 1:1 de data/casos-osce.ts.
// Conteúdo didático adicional = ENRICHMENT (ver relatório da Fase 3).
// ============================================================================

import { CANONICAL_CASE_SCHEMA_VERSION, type CanonicalCase } from "../types/canonical-case";

export const CANONICAL_INSUFICIENCIA_CARDIACA: CanonicalCase = {
  schemaVersion: CANONICAL_CASE_SCHEMA_VERSION,
  identificacao: {
    legacyId: 8,
    canonicalId: "insuficiencia-cardiaca",
    titulo: "Insuficiência Cardíaca Esquerda",
    diagnostico: "Insuficiência Cardíaca Sistólica (FEVE reduzida)",
    especialidade: "Cardiologia",
    sistema: "Cardiovascular",
    sindromePrincipal: "Síndrome de congestão pulmonar / IC descompensada",
    dificuldade: "intermediario",
    tempoEstimadoMin: 12,
    objetivosAprendizagem: [
      "Reconhecer sinais de congestão (dispneia de esforço, ortopneia, DPN, B3, crepitações).",
      "Confirmar disfunção sistólica com ecocardiograma (FEVE).",
      "Instituir terapia descongestiva (diurético) e otimização.",
      "Auscultar B3 e crepitações bibasais.",
    ],
  },
  paciente: {
    nome: "Fernanda Rocha", idade: 67, sexo: "F", tipoPaciente: "adulto",
    contexto: "Idosa com dispneia progressiva aos esforços e ganho de peso recente.",
    personalidade: "Colaborativa, cansada aos esforços.",
    nivelColaboracao: "alta", linguagem: "leiga",
    estadoEmocional: "Preocupada com a piora do cansaço.",
    queixaPrincipal: "Falta de ar ao fazer esforços",
  },
  historia: {
    hda: "Dispneia progressiva aos esforços, ortopneia e dispneia paroxística noturna, com ganho de peso recente ('ganho quilos rápido') e edema de membros inferiores.",
    antecedentes: ["Hipertensão (enriquecimento)", "Cardiopatia prévia (enriquecimento)"],
    medicacoes: ["Anti-hipertensivos (enriquecimento)"],
    alergias: [],
    habitos: [],
    historiaFamiliar: [],
    historiaSocial: [],
    fatoresDeRisco: ["Hipertensão", "Idade avançada", "Cardiopatia"],
    redFlags: ["SpO₂ 90%", "FR 28", "Ortopneia/DPN", "Ganho de peso rápido"],
  },
  scriptPaciente: {
    aberturaEspontanea: "Doutora, tô cansada demais, qualquer esforço me deixa sem ar.",
    respostasDirigidas: {
      esforco: "Canso pra fazer as coisas, subir escada é difícil.",
      ortopneia: "Preciso de vários travesseiros pra dormir, senão fico sem ar deitada.",
      dpn: "Às vezes acordo no meio da noite sufocando.",
      peso: "Aumentei de peso bastante, ganho quilos rápido.",
      edema: "Minhas pernas estão inchadas.",
    },
    sintomasPresentes: { dispneia_esforco: "Canso a qualquer esforço.", ortopneia: "Não durmo deitada.", edema_mmii: "Pernas inchadas." },
    sintomasAusentes: { febre: "Febre não tive.", dor_pleuritica: "Dor pra respirar não.", tosse_purulenta: "Catarro amarelo não." },
    respostaVagaQuandoPerguntaMal: "Tô cansada… sem ar.",
    respostaCompletaQuandoPerguntaBem: "Minha falta de ar aos esforços piorou, durmo com vários travesseiros, acordo sufocando à noite, ganhei peso rápido e minhas pernas estão inchadas.",
  },
  exameFisico: {
    sinaisVitais: { pressaoArterial: "150/95 mmHg", frequenciaCardiaca: 102, frequenciaRespiratoria: 28, temperatura: 36.8, saturacaoOxigenio: 90, glicemia: 150 },
    estadoGeral: "Dispneica aos esforços, sinais de congestão.",
    respiratorio: "Crepitações bibasais (congestão), murmúrio presente; taquipneia.",
    cardiovascular: "B3 (galope), sopro sistólico, ictus desviado, turgência jugular; taquicardia (FC 102).",
    abdominal: "Pode haver hepatomegalia congestiva (enriquecimento).",
    achadosPositivos: ["B3", "Crepitações bibasais", "Sopro sistólico", "Turgência jugular", "Edema de MMII", "Ictus desviado"],
    achadosNegativosImportantes: ["Sem febre", "Sem consolidação focal"],
  },
  ausculta: {
    pulmonar: {
      presente: true,
      tipoOficial: "Crepitações finas bibasais (congestão)",
      localizacao: "Bases bilaterais (RLA/LLA)",
      arquivo: "M_FC_RLA.wav",
      audioUrl: "/HLS-CMDS/LS/M_FC_RLA.wav",
      soundRef: "ls-crepitacoes",
      origemSoundsCatalog: "soundsCatalog — lung 'Fine Crackles' (csvId M_C_RLA → M_FC_RLA, translated-code). Padrão 'edema/IC' = fine_crackles bibasal.",
      silencioDidatico: false,
    },
    cardiaca: {
      presente: true,
      tipoOficial: "B3 (terceira bulha / galope)",
      localizacao: "Foco mitral / tricúspide (Apex/LLSB)",
      arquivo: "F_S3_A.wav",
      audioUrl: "/HLS-CMDS/HS/F_S3_A.wav",
      soundRef: "hs-b3",
      origemSoundsCatalog: "soundsCatalog — heart 'S3' (F_S3_A). Ausculta cardíaca do caso (cardiaco-case-mapping) = s3 no foco mitral.",
      silencioDidatico: false,
      observacao: "Também há sopro sistólico associado (regurgitação funcional).",
    },
  },
  exames: [
    { nome: "Ecocardiograma", solicitavel: true, resultadoEsperado: "FEVE reduzida (disfunção sistólica).", justificativa: "Confirma o diagnóstico e quantifica a FEVE.", interpretacao: "IC com fração de ejeção reduzida.", pegadinhas: ["Não atrasar a descongestão aguardando o eco"] },
    { nome: "ECG", solicitavel: true, resultadoEsperado: "Sobrecarga/alterações de câmara; afastar isquemia/arritmia.", justificativa: "Buscar etiologia e complicações.", interpretacao: "Auxilia etiologia.", pegadinhas: [] },
    { nome: "BNP/NT-proBNP", solicitavel: true, resultadoEsperado: "Elevado.", justificativa: "Apoia diagnóstico de IC.", interpretacao: "Congestão/estiramento miocárdico.", pegadinhas: ["Pode elevar em outras condições"] },
    { nome: "Radiografia de tórax", solicitavel: true, resultadoEsperado: "Cardiomegalia + congestão vascular ± derrame.", justificativa: "Avaliar congestão.", interpretacao: "Padrão de congestão.", pegadinhas: [] },
  ],
  imagens: [
    { tipo: "Radiografia de tórax", imageRef: "img-rx-torax", modalidade: "RX", regiaoAnatomica: "Tórax", termoOpenI: "cardiomegaly chest xray", achadosEsperados: ["Cardiomegalia", "Congestão vascular", "Possível derrame pleural"], interpretacao: "Congestão de IC. (enriquecimento)" },
  ],
  ecg: { indicado: true, achadoEsperado: "Taquicardia; sinais de sobrecarga de câmara; afastar isquemia.", justificativa: "Etiologia e complicações da IC." },
  diagnostico: {
    principal: "Insuficiência Cardíaca Sistólica (FEVE reduzida)",
    porQueE: ["Dispneia de esforço + ortopneia + DPN (congestão).", "B3, crepitações bibasais, turgência jugular e edema.", "Confirmação de FEVE reduzida ao ecocardiograma."],
    diferenciais: [
      { diagnostico: "Asma", porQueNaoE: "Predomínio seria de sibilos reversíveis, não crepitações bibasais com congestão sistêmica.", achadosQueDescartam: ["B3/turgência jugular", "Crepitações bibasais"] },
      { diagnostico: "DPOC", porQueNaoE: "Sibilância crônica de tabagista, sem sinais de congestão sistêmica.", achadosQueDescartam: ["Turgência/edema/B3"] },
      { diagnostico: "Pneumonia", porQueNaoE: "Sem febre/consolidação focal; achados são de congestão bilateral.", achadosQueDescartam: ["Ausência de febre", "Crepitações simétricas de congestão"] },
      { diagnostico: "TEP", porQueNaoE: "Sem início súbito com dor pleurítica e fator de risco dominante.", achadosQueDescartam: ["Quadro subagudo de congestão"] },
    ],
  },
  conduta: {
    tratamento: ["Diurético IV (terapia descongestiva)", "IECA/BRA", "Betabloqueador (após compensar)", "Oxigênio se hipoxemia", "Restrição hídrica/sódio"],
    antibiotico: "Não indicado (não é infeccioso).",
    criteriosGravidade: ["Hipoxemia", "Congestão importante", "Baixo débito/hipotensão", "Necessidade de suporte"],
    orientacoes: ["Restrição de sal/líquidos", "Pesagem diária", "Adesão medicamentosa", "Sinais de descompensação"],
    seguimento: ["Ecocardiograma para FEVE", "Otimização de terapia da IC", "Acompanhamento cardiológico"],
    criteriosInternacao: ["Congestão/hipoxemia significativa", "Baixo débito", "Comorbidade descompensada"],
    criteriosAlta: ["Compensação da congestão", "SpO₂ adequada", "Terapia otimizada e retorno definidos"],
  },
  rubrica: {
    rubricaCorrecao: [
      { criterio: "Reconhecimento de Sinais", descricao: "B3, crepitações, ortopneia", peso: 20, pontuacaoMaxima: 20 },
      { criterio: "Terapia Descongestiva", descricao: "Prescrição de diurético apropriado", peso: 25, pontuacaoMaxima: 25 },
      { criterio: "Avaliação de FEVE", descricao: "Solicitação e interpretação de ecocardiograma", peso: 25, pontuacaoMaxima: 25 },
    ],
    checklistOsce: [
      { item: "Investigou ortopneia e dispneia noturna", critico: true },
      { item: "Mediu sinais vitais (SpO2, FR)", critico: true },
      { item: "Ausculta: buscou B3 e crepitações", critico: true },
      { item: "Palpou: desvio de ictus", critico: true },
      { item: "Solicitou ECG", critico: true },
      { item: "Solicitou ecocardiograma", critico: true },
      { item: "Prescreveu diurético IV", critico: true },
    ],
    errosCriticos: [
      { erro: "Não prescrever diurético em IC congestiva", descricao: "Diurético é essencial para aliviar congestão", penalidade: 2.5 },
      { erro: "Não solicitar ecocardiograma", descricao: "Ecocardiograma confirma diagnóstico e FEVE", penalidade: 2 },
    ],
    microcriteriosPorEixo: {
      anamnese: ["Investigou ortopneia/DPN", "Pesquisou ganho de peso/edema", "Caracterizou dispneia de esforço"],
      exameFisico: ["Mediu SpO₂/FR", "Buscou B3 e crepitações", "Pesquisou turgência jugular/edema", "Avaliou ictus"],
      examesComplementares: ["Solicitou ECG", "Solicitou ecocardiograma", "Considerou BNP/RX"],
      raciocinioDiagnostico: ["Formulou IC congestiva", "Correlacionou congestão + FEVE", "Considerou diferenciais respiratórios"],
      condutaSeguranca: ["Diurético IV", "IECA/BB conforme fase", "O₂ se hipoxemia", "Orientou sinais de descompensação"],
      comunicacao: ["Acolheu", "Explicou congestão e tratamento", "Orientou dieta/pesagem/retorno"],
    },
  },
  feedbackEsperado: {
    respostaModelo: "IC sistólica descompensada (ortopneia, DPN, B3, crepitações bibasais, turgência, edema; SpO₂ 90%). Inicio diurético IV, otimizo IECA/BB, dou O₂ se necessário, solicito ECG e ecocardiograma (FEVE) e oriento restrição hídrica/sódio, pesagem diária e sinais de descompensação.",
    checklistNotaMaxima: ["Investigou ortopneia/DPN", "Mediu SpO₂/FR", "Auscultou B3 e crepitações", "Avaliou ictus/turgência", "Solicitou ECG e eco", "Prescreveu diurético IV", "Orientou dieta/retorno"],
    errosComuns: ["Não prescrever diurético", "Não pedir ecocardiograma", "Confundir com pneumonia/asma", "Não valorizar B3"],
    pegadinhas: ["Crepitações bibasais também ocorrem em pneumonia — correlacionar com congestão sistêmica", "B3 é marcador de sobrecarga de volume"],
    planoDeReforco: ["Semiologia cardiovascular (B3, turgência)", "Terapia da IC descompensada", "Interpretação do ecocardiograma"],
  },
  conhecimentoRelacionado: {
    links: [
      { dominio: "semiologia", titulo: "Semiologia — Cardiologia", href: "/centro-clinico/semiologia", ancoras: ["Cardiologia"] },
      { dominio: "fluxo", titulo: "Fluxo da Dispneia", href: "/centro-clinico/fluxos", ancoras: ["Dispneia"] },
      { dominio: "exame", titulo: "ECG · Ecocardiograma", href: "/centro-clinico/exames", ancoras: ["ECG", "Ecocardiograma"] },
      { dominio: "som", titulo: "B3 · Crepitações", href: "/centro-clinico/sons", ancoras: ["B3", "Crepitações finas"] },
      { dominio: "imagem", titulo: "Cardiomegalia (RX)", href: "/centro-clinico/imagens", ancoras: ["Cardiomegalia"] },
    ],
  },
  professorIA: {
    pontosParaReforcar: ["Diurético é essencial na congestão.", "B3 + crepitações bibasais + turgência = congestão.", "Ecocardiograma confirma FEVE."],
    perguntasSocraticas: ["Quais achados diferenciam congestão cardíaca de pneumonia?", "Por que a B3 importa aqui?", "O que muda a conduta conforme a FEVE?"],
    errosParaExplorar: ["Não dar diurético", "Não pedir eco", "Ignorar B3/turgência"],
    miniAulaSugerida: "IC descongestiva: ortopneia/DPN + B3 + crepitações bibasais + turgência/edema; diurético IV, IECA/BB, O₂ se hipoxemia; confirmar FEVE ao eco; orientar dieta/pesagem.",
    planoDeTreinoSugerido: ["Sons — B3 e crepitações", "Semiologia cardiovascular", "Manejo da IC", "Repetir caso de dispneia"],
  },
  // ── refs do Knowledge Graph (Fase 6) — apenas ids existentes ──
  refs: {
    knowledgeRefs: ["dx-ic", "dx-edema-pulmonar", "drug-diuretico", "proc-oxigenoterapia", "pf-turgencia-jugular", "pf-edema-mmii", "score-killip"],
    symptomRefs: ["sym-dispneia"],
    examRefs: ["ecg-taquicardia-sinusal"],
    imageRefs: ["img-rx-torax"],
    soundRefs: ["ls-crepitacoes", "hs-b3"],
    flowRefs: ["flow-dispneia"],
    guidelineRefs: ["guide-ic"],
  },
  // ── Enriquecimento pedagógico (Fase 7) ──
  teachingRefs: {
    semiologia: ["pf-turgencia-jugular", "pf-edema-mmii"],
    fluxos: ["flow-dispneia"],
    exames: ["ecg-taquicardia-sinusal"],
    imagens: ["img-rx-torax"],
    sons: ["ls-crepitacoes", "hs-b3"],
    scores: ["score-killip"],
    guidelines: ["guide-ic"],
  },
  differentialRefs: ["dx-asma", "dx-dpoc", "dx-pneumonia", "dx-tep"],
  pitfallRefs: ["drug-diuretico", "hs-b3"],
  clinicalReasoningRefs: ["dx-ic", "dx-edema-pulmonar", "flow-dispneia"],
  professorObjectives: [
    "Diurético é essencial na congestão.",
    "B3 + crepitações bibasais + turgência = congestão.",
    "Ecocardiograma confirma a FEVE.",
  ],
  commonMistakes: ["Não prescrever diurético", "Não solicitar ecocardiograma", "Confundir com pneumonia/asma", "Não valorizar a B3"],
  masteryTargets: { communication: 0.8, history: 0.9, physicalExam: 0.9, diagnosis: 0.9, complementaryExams: 0.85, conduct: 0.9, safety: 0.9, documentation: 0.7 },
};

export default CANONICAL_INSUFICIENCIA_CARDIACA;
