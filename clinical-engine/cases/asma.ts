// ============================================================================
// Caso Canônico — Asma Aguda (Crise Asmática Moderada) — legado id 3
// Dados clínicos/rubrica/checklist/erros migrados 1:1 de data/casos-osce.ts.
// Conteúdo didático (script vago×completo, por-que-não-é, feedback, professor,
// links) é ENRICHMENT — ver docs/RELATORIO-CASOS-CANONICOS-FASE3.md.
// ============================================================================

import { CANONICAL_CASE_SCHEMA_VERSION, type CanonicalCase } from "../types/canonical-case";

export const CANONICAL_ASMA: CanonicalCase = {
  schemaVersion: CANONICAL_CASE_SCHEMA_VERSION,
  identificacao: {
    legacyId: 3,
    canonicalId: "asma",
    titulo: "Asma Aguda",
    diagnostico: "Asma Aguda (Crise Asmática Moderada)",
    especialidade: "Pneumologia / Emergência",
    sistema: "Respiratório",
    sindromePrincipal: "Obstrução reversível das vias aéreas (broncoespasmo)",
    dificuldade: "basico",
    tempoEstimadoMin: 12,
    objetivosAprendizagem: [
      "Reconhecer crise asmática e classificar gravidade (SpO₂, fala, esforço).",
      "Realizar ausculta e identificar sibilos expiratórios.",
      "Instituir broncodilatador + corticosteroide sistêmico + O₂ titulado.",
      "Investigar gatilhos e história de asma.",
    ],
  },
  paciente: {
    nome: "Roberto Costa", idade: 28, sexo: "M", tipoPaciente: "adulto",
    contexto: "Adulto jovem com história de asma; crise após exposição a gatilho.",
    personalidade: "Ansioso, dispneico, fala entrecortada.",
    nivelColaboracao: "media", linguagem: "leiga",
    estadoEmocional: "Assustado com a falta de ar.",
    queixaPrincipal: "Falta de ar e chiado no peito há 3 horas",
  },
  historia: {
    hda: "Há 3 horas iniciou dispneia progressiva com chiado no peito, aperto torácico e tosse seca, após exposição a gatilho. Refere crises prévias de asma.",
    antecedentes: ["Asma (crises prévias)"],
    medicacoes: ["Broncodilatador de resgate (uso irregular)"],
    alergias: [],
    habitos: ["Exposição a alérgenos/gatilhos ambientais"],
    historiaFamiliar: ["Atopia familiar (enriquecimento)"],
    historiaSocial: [],
    fatoresDeRisco: ["Asma prévia", "Exposição a gatilho", "Má adesão à medicação de controle"],
    redFlags: ["SpO₂ 88%", "FR 28 ipm", "Taquicardia FC 110", "Fala entrecortada"],
  },
  scriptPaciente: {
    aberturaEspontanea: "Doutor, não consigo respirar direito, tá chiando muito o peito.",
    respostasDirigidas: {
      inicio: "Começou há umas 3 horas e foi piorando.",
      chiado: "Sim, chio bastante quando solto o ar.",
      gatilho: "Acho que foi poeira / mudança de tempo.",
      asma_previa: "Sim, tenho asma desde criança, já tive crises assim.",
      medicacao: "Uso a bombinha, mas confesso que esqueço bastante.",
    },
    sintomasPresentes: {
      dispneia: "Falta muito o ar, principalmente pra soltar.",
      sibilancia: "O chiado é forte.",
      aperto_toracico: "Sinto um aperto no peito.",
    },
    sintomasAusentes: {
      febre: "Febre eu não tive, não.",
      dor_pleuritica: "Dor pra respirar fundo não, é mais o aperto.",
      catarro_purulento: "Não tô com catarro amarelo.",
    },
    respostaVagaQuandoPerguntaMal: "Tô sem ar… não sei, tá ruim.",
    respostaCompletaQuandoPerguntaBem: "Há 3 horas comecei a chiar e ficar sem ar, com aperto no peito, depois de exposição a poeira; já tive crises de asma antes e uso a bombinha irregularmente.",
  },
  exameFisico: {
    sinaisVitais: { pressaoArterial: "130/85 mmHg", frequenciaCardiaca: 110, frequenciaRespiratoria: 28, temperatura: 36.9, saturacaoOxigenio: 88, glicemia: 140 },
    estadoGeral: "Dispneico, ansioso, fala entrecortada, uso discreto de musculatura acessória.",
    respiratorio: "Taquipneia (FR 28), expansibilidade reduzida bilateralmente, tempo expiratório prolongado; sibilos expiratórios difusos à ausculta.",
    cardiovascular: "Taquicardia (FC 110), bulhas normofonéticas, sem sopros.",
    abdominal: "Sem alterações relevantes.",
    achadosPositivos: ["Sibilos expiratórios difusos", "Taquipneia", "Expiração prolongada", "SpO₂ 88%"],
    achadosNegativosImportantes: ["Ausência de crepitações", "Sem febre", "Sem consolidação"],
  },
  ausculta: {
    pulmonar: {
      presente: true,
      tipoOficial: "Sibilos (Wheezing) — difusos, expiratórios",
      localizacao: "Difuso bilateral",
      arquivo: "M_W_RUA.wav",
      audioUrl: "/HLS-CMDS/LS/M_W_RUA.wav",
      soundRef: "ls-sibilos",
      origemSoundsCatalog: "soundsCatalog — lung, originalType 'Wheezing' (csvId M_W_RUA, exact).",
      silencioDidatico: false,
    },
  },
  exames: [
    { nome: "Oximetria de pulso", solicitavel: true, resultadoEsperado: "SpO₂ 88%.", justificativa: "Classificar gravidade e guiar O₂.", interpretacao: "Hipoxemia — crise moderada/grave.", pegadinhas: ["SpO₂ normal não exclui crise em curso"] },
    { nome: "Pico de fluxo expiratório (Peak Flow)", solicitavel: true, resultadoEsperado: "Reduzido.", justificativa: "Objetiva a obstrução e a resposta ao tratamento.", interpretacao: "Obstrução ao fluxo aéreo.", pegadinhas: ["Depende do esforço do paciente"] },
    { nome: "Radiografia de tórax (se dúvida)", solicitavel: true, resultadoEsperado: "Frequentemente normal ou hiperinsuflação.", justificativa: "Excluir complicações (pneumotórax) ou diagnóstico alternativo.", interpretacao: "Sem consolidação.", pegadinhas: ["Não é rotina na crise típica"] },
  ],
  imagens: [
    { tipo: "Radiografia de tórax (opcional)", imageRef: "img-rx-torax", modalidade: "RX", regiaoAnatomica: "Tórax", obrigatoriedade: "opcional", termoOpenI: "hyperinflation chest xray", achadosEsperados: ["Hiperinsuflação", "Sem consolidação"], interpretacao: "Geralmente normal; afasta complicações. (enriquecimento)" },
  ],
  ecg: { indicado: false, achadoEsperado: "Taquicardia sinusal (FC 110), sem isquemia.", justificativa: "ECG não é chave; taquicardia reflete a crise/β-agonista." },
  diagnostico: {
    principal: "Asma Aguda (Crise Asmática Moderada)",
    porQueE: ["Dispneia + sibilância expiratória difusa de início agudo.", "História de asma e resposta a gatilho.", "Obstrução reversível (sibilos, expiração prolongada)."],
    diferenciais: [
      { diagnostico: "Anafilaxia", porQueNaoE: "Sem exposição alergênica sistêmica/urticária/angioedema/hipotensão.", achadosQueDescartam: ["Ausência de urticária/angioedema", "PA estável"] },
      { diagnostico: "Embolia pulmonar (TEP)", porQueNaoE: "Ausência de fator de risco e de dor pleurítica súbita dominante; há sibilância típica.", achadosQueDescartam: ["Sibilos difusos reversíveis"] },
      { diagnostico: "Pneumotórax", porQueNaoE: "Ausculta com sibilos difusos, não abolição unilateral do MV.", achadosQueDescartam: ["MV presente bilateral", "Sibilos difusos"] },
      { diagnostico: "Edema pulmonar", porQueNaoE: "Sem crepitações bibasais nem contexto cardíaco/congestão.", achadosQueDescartam: ["Ausência de crepitações", "Sem turgência jugular"] },
    ],
  },
  conduta: {
    tratamento: ["Salbutamol inalado (β2-agonista) seriado", "Corticosteroide sistêmico", "Oxigenoterapia titulada para SpO₂ > 94%", "Reavaliar resposta"],
    antibiotico: "Não indicado (crise asmática não infecciosa).",
    criteriosGravidade: ["SpO₂ < 90%", "Fala entrecortada", "Uso de musculatura acessória", "FR elevada", "Pico de fluxo muito reduzido"],
    orientacoes: ["Técnica inalatória", "Adesão à medicação de controle", "Evitar gatilhos", "Sinais de alarme para retorno"],
    seguimento: ["Reavaliação após broncodilatador", "Plano de controle ambulatorial da asma"],
    criteriosInternacao: ["Resposta insuficiente ao tratamento", "Hipoxemia persistente", "Sinais de exaustão respiratória"],
    criteriosAlta: ["Melhora clínica e da SpO₂", "Pico de fluxo recuperado", "Plano de controle e retorno definidos"],
  },
  rubrica: {
    rubricaCorrecao: [
      { criterio: "Avaliação de Gravidade", descricao: "Reconhecimento de sinais de gravidade", peso: 25, pontuacaoMaxima: 25 },
      { criterio: "Terapia Broncodilatadora", descricao: "Salbutamol apropriadamente prescrito", peso: 25, pontuacaoMaxima: 25 },
      { criterio: "Corticosteroide Sistêmico", descricao: "Prescrição apropriada", peso: 20, pontuacaoMaxima: 20 },
      { criterio: "Oxigenioterapia", descricao: "Titulação para SpO2 >94%", peso: 15, pontuacaoMaxima: 15 },
    ],
    checklistOsce: [
      { item: "Investigou histórico de asma", critico: true },
      { item: "Perguntou sobre gatilhos", critico: true },
      { item: "Mediu sinais vitais (inclusive SpO2)", critico: true },
      { item: "Realizou ausculta pulmonar completa", critico: true },
      { item: "Avaliou gravidade corretamente", critico: true },
      { item: "Prescreveu salbutamol + corticosteroide", critico: true },
    ],
    errosCriticos: [
      { erro: "Não usar corticosteroide sistêmico", descricao: "Corticosteroide é essencial na crise asmática moderada/grave.", penalidade: 2 },
      { erro: "Não avaliar gravidade adequadamente", descricao: "Asma grave pode progredir para insuficiência respiratória", penalidade: 2.5 },
    ],
    microcriteriosPorEixo: {
      anamnese: ["Investigou história de asma", "Pesquisou gatilhos", "Caracterizou dispneia/sibilância", "Avaliou adesão à medicação"],
      exameFisico: ["Mediu SpO₂ e FR", "Auscultou e identificou sibilos", "Avaliou esforço respiratório/fala", "Pesquisou sinais de gravidade"],
      examesComplementares: ["Oximetria", "Pico de fluxo quando possível"],
      raciocinioDiagnostico: ["Formulou crise asmática", "Classificou gravidade", "Considerou diferenciais (anafilaxia, TEP, pneumotórax)"],
      condutaSeguranca: ["β2-agonista seriado", "Corticosteroide sistêmico", "O₂ titulado", "Reavaliação e sinais de alarme"],
      comunicacao: ["Acolheu o paciente ansioso", "Explicou a conduta", "Orientou técnica inalatória e retorno"],
    },
  },
  feedbackEsperado: {
    respostaModelo: "Crise asmática moderada (SpO₂ 88%, sibilos difusos, FR 28). Inicio salbutamol inalado seriado, corticosteroide sistêmico e O₂ titulado para SpO₂ > 94%, reavalio a resposta e oriento adesão/gatilhos e sinais de alarme.",
    checklistNotaMaxima: ["Investigou asma e gatilhos", "Mediu SpO₂/FR", "Identificou sibilos", "Classificou gravidade", "Prescreveu β2-agonista + corticosteroide", "Titulou O₂", "Orientou retorno"],
    errosComuns: ["Omitir corticosteroide", "Não medir SpO₂", "Não classificar gravidade", "Confundir com pneumonia"],
    pegadinhas: ["SpO₂ pode cair após piora silenciosa", "'Tórax silencioso' é sinal de gravidade, não de melhora"],
    planoDeReforco: ["Semiologia respiratória (sibilos)", "Classificação de gravidade da crise", "Farmacologia do broncodilatador e corticoide"],
  },
  conhecimentoRelacionado: {
    links: [
      { dominio: "semiologia", titulo: "Semiologia — Pneumologia", href: "/centro-clinico/semiologia", ancoras: ["Pneumologia"] },
      { dominio: "fluxo", titulo: "Fluxo da Dispneia", href: "/centro-clinico/fluxos", ancoras: ["Dispneia"] },
      { dominio: "exame", titulo: "Gasometria · Saturação", href: "/centro-clinico/exames", ancoras: ["Gasometria"] },
      { dominio: "som", titulo: "Sibilos", href: "/centro-clinico/sons", ancoras: ["Sibilos"] },
      { dominio: "imagem", titulo: "RX de tórax", href: "/centro-clinico/imagens" },
    ],
  },
  professorIA: {
    pontosParaReforcar: ["Corticosteroide sistêmico é obrigatório na crise moderada/grave.", "SpO₂ e fala classificam a gravidade.", "Sibilos = broncoespasmo, não consolidação."],
    perguntasSocraticas: ["Como você classifica a gravidade desta crise?", "Por que corticosteroide além do broncodilatador?", "Como diferenciar de anafilaxia e TEP?"],
    errosParaExplorar: ["Esquecer corticosteroide", "Não medir SpO₂", "Confundir sibilos com crepitações"],
    miniAulaSugerida: "Crise asmática: sibilância expiratória difusa + hipoxemia; tratar com β2-agonista seriado, corticosteroide sistêmico e O₂ titulado; reavaliar; 'tórax silencioso' é gravidade.",
    planoDeTreinoSugerido: ["Sons — sibilos", "Fluxo da dispneia", "Farmacologia da asma", "Repetir caso de dispneia aguda"],
  },
  // ── refs do Knowledge Graph (Fase 6) — apenas ids existentes ──
  refs: {
    knowledgeRefs: ["dx-asma", "drug-salbutamol", "drug-corticosteroide", "proc-oxigenoterapia", "proc-nebulizacao", "pf-taquipneia"],
    symptomRefs: ["sym-dispneia"],
    examRefs: [],
    imageRefs: ["img-rx-torax"],
    soundRefs: ["ls-sibilos"],
    flowRefs: ["flow-dispneia"],
    guidelineRefs: ["guide-asma"],
  },
  // ── Enriquecimento pedagógico (Fase 7) ──
  teachingRefs: {
    semiologia: ["pf-taquipneia"],
    fluxos: ["flow-dispneia"],
    imagens: ["img-rx-torax"],
    sons: ["ls-sibilos"],
    guidelines: ["guide-asma"],
  },
  differentialRefs: ["dx-tep", "dx-edema-pulmonar"],
  pitfallRefs: ["drug-corticosteroide"],
  clinicalReasoningRefs: ["flow-dispneia", "dx-asma"],
  professorObjectives: [
    "Corticosteroide sistêmico é obrigatório na crise moderada/grave.",
    "SpO₂ e fala classificam a gravidade.",
    "Sibilos = broncoespasmo, não consolidação.",
  ],
  commonMistakes: ["Esquecer o corticosteroide", "Não medir SpO₂", "Não classificar a gravidade", "Confundir com pneumonia"],
  masteryTargets: { communication: 0.8, history: 0.85, physicalExam: 0.85, diagnosis: 0.85, complementaryExams: 0.7, conduct: 0.9, safety: 0.9, documentation: 0.7 },
};

export default CANONICAL_ASMA;
