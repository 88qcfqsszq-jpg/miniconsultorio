// ============================================================================
// Caso Canônico — DPOC em Exacerbação Aguda — legado id 9
// Rubrica/checklist/erros/sinais vitais migrados 1:1 de data/casos-osce.ts.
// Conteúdo didático adicional = ENRICHMENT (ver relatório da Fase 3).
// ============================================================================

import { CANONICAL_CASE_SCHEMA_VERSION, type CanonicalCase } from "../types/canonical-case";

export const CANONICAL_DPOC: CanonicalCase = {
  schemaVersion: CANONICAL_CASE_SCHEMA_VERSION,
  identificacao: {
    legacyId: 9,
    canonicalId: "dpoc",
    titulo: "DPOC - Exacerbação Aguda",
    diagnostico: "DPOC - Exacerbação Aguda",
    especialidade: "Pneumologia / Emergência",
    sistema: "Respiratório",
    sindromePrincipal: "Obstrução crônica das vias aéreas exacerbada",
    dificuldade: "intermediario",
    tempoEstimadoMin: 12,
    objetivosAprendizagem: [
      "Reconhecer exacerbação de DPOC e diferenciar de asma.",
      "Titular oxigênio com alvo de SpO₂ 88–92% (risco de hipercapnia).",
      "Prescrever broncodilatador nebulizado + corticosteroide sistêmico.",
      "Investigar tabagismo/exposição ocupacional.",
    ],
  },
  paciente: {
    nome: "Antônio Silva", idade: 72, sexo: "M", tipoPaciente: "adulto",
    contexto: "Idoso tabagista de longa data, dispneia progressiva com limitação funcional.",
    personalidade: "Cansado, respostas curtas pela dispneia.",
    nivelColaboracao: "media", linguagem: "leiga",
    estadoEmocional: "Desanimado com a piora ('mal consigo ficar em pé').",
    queixaPrincipal: "Falta de ar e tosse com escarro",
  },
  historia: {
    hda: "Piora da dispneia habitual nos últimos dias, com aumento da tosse e escarro (mudança de volume/aspecto). Limitação funcional marcante ('antes caminhava um pouco, agora mal fico de pé').",
    antecedentes: ["DPOC", "Tabagismo de longa data"],
    medicacoes: ["Broncodilatador de manutenção (enriquecimento)"],
    alergias: [],
    habitos: ["Tabagismo (carga tabágica alta)"],
    historiaFamiliar: [],
    historiaSocial: ["Possível exposição ocupacional"],
    fatoresDeRisco: ["Tabagismo", "DPOC prévio", "Infecção respiratória como gatilho"],
    redFlags: ["SpO₂ 85%", "FR 32 ipm", "Uso de musculatura acessória (enriquecimento)"],
  },
  scriptPaciente: {
    aberturaEspontanea: "Doutor, tô sem ar e com muito catarro, piorou bastante.",
    respostasDirigidas: {
      inicio: "Vem piorando faz uns dias.",
      escarro: "Tá saindo mais catarro, mais grosso.",
      tabagismo: "Fumei a vida toda, parei há pouco tempo.",
      atividade: "Antes conseguia caminhar um pouco, agora mal consigo ficar em pé.",
      febre: "Febre alta não tive, não.",
    },
    sintomasPresentes: { dispneia: "Falta muito o ar.", tosse_produtiva: "Bastante catarro." },
    sintomasAusentes: { dor_toracica_pleuritica: "Dor no peito pra respirar não.", edema_subito: "Não notei inchaço novo de repente." },
    respostaVagaQuandoPerguntaMal: "Tô ruim do pulmão… cansado.",
    respostaCompletaQuandoPerguntaBem: "Minha falta de ar piorou nos últimos dias, com mais catarro e mais grosso; sou tabagista de longa data e agora mal consigo ficar de pé.",
  },
  exameFisico: {
    sinaisVitais: { pressaoArterial: "140/85 mmHg", frequenciaCardiaca: 105, frequenciaRespiratoria: 32, temperatura: 37.2, saturacaoOxigenio: 85, glicemia: 180 },
    estadoGeral: "Dispneico, taquipneico, uso de musculatura acessória, expiração prolongada.",
    respiratorio: "Sibilos e roncos difusos, tempo expiratório prolongado, murmúrio globalmente reduzido; sem consolidação franca.",
    cardiovascular: "Taquicardia (FC 105), bulhas normofonéticas.",
    abdominal: "Sem alterações relevantes.",
    achadosPositivos: ["Sibilos difusos", "Roncos", "Expiração prolongada", "SpO₂ 85%"],
    achadosNegativosImportantes: ["Sem crepitações focais de consolidação", "Sem febre alta"],
  },
  ausculta: {
    pulmonar: {
      presente: true,
      tipoOficial: "Sibilos (Wheezing) + Roncos (Rhonchi) difusos",
      localizacao: "Difuso; roncos em campos médios",
      arquivo: "M_W_RUA.wav",
      audioUrl: "/HLS-CMDS/LS/M_W_RUA.wav",
      soundRef: "ls-sibilos",
      origemSoundsCatalog: "soundsCatalog — lung 'Wheezing' (M_W_RUA) e 'Rhonchi' (M_R_LUA). Padrão 'dpoc' em pulmonar-case-mapping = wheezing + rhonchi.",
      silencioDidatico: false,
      observacao: "Roncos: M_R_LUA.wav (/HLS-CMDS/LS/M_R_LUA.wav).",
    },
  },
  exames: [
    { nome: "Gasometria arterial", solicitavel: true, resultadoEsperado: "Hipoxemia; avaliar retenção de CO₂/acidose.", justificativa: "Detectar hipercapnia e insuficiência respiratória.", interpretacao: "Guiar O₂ e ventilação.", pegadinhas: ["A SpO₂ não mostra o CO₂", "DPOC pode reter CO₂"] },
    { nome: "Radiografia de tórax", solicitavel: true, resultadoEsperado: "Hiperinsuflação; excluir pneumonia/pneumotórax.", justificativa: "Buscar complicações/diagnóstico alternativo.", interpretacao: "Sem consolidação franca.", pegadinhas: ["Pneumonia pode coexistir"] },
    { nome: "Hemograma", solicitavel: true, resultadoEsperado: "Pode haver leucocitose se infecção.", justificativa: "Avaliar componente infeccioso.", interpretacao: "Auxilia decisão de antibiótico.", pegadinhas: [] },
  ],
  imagens: [
    { tipo: "Radiografia de tórax", imageRef: "img-rx-torax", modalidade: "RX", regiaoAnatomica: "Tórax", termoOpenI: "hyperinflation chest xray", achadosEsperados: ["Hiperinsuflação", "Retificação diafragmática"], interpretacao: "Sem consolidação; padrão de DPOC. (enriquecimento)" },
  ],
  ecg: { indicado: true, achadoEsperado: "Taquicardia sinusal; pode haver sinais de sobrecarga direita (cor pulmonale).", justificativa: "Avaliar repercussão cardíaca e arritmias." },
  diagnostico: {
    principal: "DPOC em Exacerbação Aguda",
    porQueE: ["Dispneia piorada + aumento de tosse/escarro em tabagista de longa data.", "Sibilos e roncos difusos com expiração prolongada.", "Hipoxemia com risco de hipercapnia."],
    diferenciais: [
      { diagnostico: "Asma", porQueNaoE: "Idade avançada e tabagismo com obstrução crônica pouco reversível; asma é mais reversível e mais jovem.", achadosQueDescartam: ["Carga tabágica alta", "Obstrução crônica"] },
      { diagnostico: "Pneumonia", porQueNaoE: "Ausência de consolidação focal/febre alta dominante (pode coexistir).", achadosQueDescartam: ["Sem crepitações focais de consolidação"] },
      { diagnostico: "Insuficiência cardíaca", porQueNaoE: "Predomínio de sibilos/roncos, não crepitações bibasais com congestão.", achadosQueDescartam: ["Sem turgência/edema dominantes"] },
      { diagnostico: "TEP", porQueNaoE: "Sem quadro súbito com dor pleurítica dominante e fator de risco.", achadosQueDescartam: ["Sibilância difusa típica de DPOC"] },
    ],
  },
  conduta: {
    tratamento: ["Oxigenoterapia titulada (alvo SpO₂ 88–92%)", "Salbutamol/ipratrópio nebulizado", "Corticosteroide sistêmico", "Antibiótico se sinais de infecção bacteriana", "Considerar VNI se insuficiência ventilatória"],
    antibiotico: "Considerar se aumento de purulência/volume do escarro ou sinais de infecção.",
    criteriosGravidade: ["SpO₂ muito baixa", "Hipercapnia/acidose", "Uso de musculatura acessória", "Alteração de consciência"],
    orientacoes: ["Cessação do tabagismo", "Adesão à manutenção", "Vacinação", "Sinais de alarme"],
    seguimento: ["Reavaliação da gasometria/clínica", "Ajuste da manutenção", "Reabilitação pulmonar"],
    criteriosInternacao: ["Hipoxemia/hipercapnia persistente", "Falha da terapia inicial", "Comorbidade descompensada", "Necessidade de VNI"],
    criteriosAlta: ["Estabilidade clínica e gasométrica", "SpO₂ adequada no alvo", "Plano de manutenção e retorno"],
  },
  rubrica: {
    rubricaCorrecao: [
      { criterio: "Diagnóstico Diferencial", descricao: "Diferenciação com asma", peso: 15, pontuacaoMaxima: 15 },
      { criterio: "Controle de Oxigenação", descricao: "Titulação apropriada de SpO2", peso: 25, pontuacaoMaxima: 25 },
      { criterio: "Terapia Broncodilatadora", descricao: "Prescrição de salbutamol e corticosteroide", peso: 30, pontuacaoMaxima: 30 },
    ],
    checklistOsce: [
      { item: "Investigou tabagismo e exposição ocupacional", critico: true },
      { item: "Mediu SpO2 e gases arteriais", critico: true },
      { item: "Ausculta: identificou sibilos", critico: true },
      { item: "Solicitou radiografia de tórax", critico: true },
      { item: "Prescreveu broncodilatador nebulizado", critico: true },
      { item: "Prescreveu corticosteroide sistêmico", critico: true },
      { item: "Titulou oxigenio para SpO2 88-92%", critico: true },
    ],
    errosCriticos: [
      { erro: "Dar oxigenioterapia sem controle (SpO2 >95%)", descricao: "Pode remover o estímulo respiratório hipóxico, causar hipercapnia", penalidade: 2.5 },
      { erro: "Não prescrever corticosteroide sistêmico", descricao: "Corticosteroide reduz duração de exacerbação", penalidade: 2 },
    ],
    microcriteriosPorEixo: {
      anamnese: ["Investigou tabagismo/exposição", "Caracterizou piora da dispneia", "Avaliou escarro (volume/purulência)"],
      exameFisico: ["Mediu SpO₂ e FR", "Auscultou e identificou sibilos/roncos", "Avaliou esforço respiratório"],
      examesComplementares: ["Gasometria", "RX de tórax", "Hemograma se infecção"],
      raciocinioDiagnostico: ["Formulou exacerbação de DPOC", "Diferenciou de asma", "Considerou pneumonia/IC/TEP"],
      condutaSeguranca: ["O₂ titulado 88–92%", "Broncodilatador nebulizado", "Corticosteroide sistêmico", "Antibiótico se indicado", "VNI se necessário"],
      comunicacao: ["Acolheu", "Explicou conduta", "Orientou cessação do tabagismo e retorno"],
    },
  },
  feedbackEsperado: {
    respostaModelo: "Exacerbação de DPOC (tabagista, piora da dispneia + escarro, SpO₂ 85%, sibilos/roncos). Titulo O₂ para SpO₂ 88–92%, nebulizo broncodilatador, dou corticosteroide sistêmico, considero antibiótico se purulência e avalio gasometria/VNI. Oriento cessação do tabagismo e retorno.",
    checklistNotaMaxima: ["Investigou tabagismo", "Mediu SpO₂/gasometria", "Identificou sibilos/roncos", "Solicitou RX", "Broncodilatador + corticosteroide", "Titulou O₂ 88–92%", "Orientou retorno"],
    errosComuns: ["O₂ sem controle (hipercapnia)", "Omitir corticosteroide", "Confundir com asma sem justificar", "Não avaliar gasometria"],
    pegadinhas: ["Alvo de SpO₂ é 88–92% (não normalizar)", "SpO₂ não mostra CO₂", "Pneumonia pode coexistir"],
    planoDeReforco: ["Titulação de O₂ na DPOC", "Diferença asma × DPOC", "Interpretação de gasometria"],
  },
  conhecimentoRelacionado: {
    links: [
      { dominio: "semiologia", titulo: "Semiologia — Pneumologia", href: "/centro-clinico/semiologia", ancoras: ["Pneumologia"] },
      { dominio: "fluxo", titulo: "Fluxo da Dispneia", href: "/centro-clinico/fluxos", ancoras: ["Dispneia"] },
      { dominio: "exame", titulo: "Gasometria · RX de tórax", href: "/centro-clinico/exames", ancoras: ["Gasometria", "RX de tórax"] },
      { dominio: "som", titulo: "Sibilos · Roncos", href: "/centro-clinico/sons", ancoras: ["Sibilos", "Roncos"] },
      { dominio: "imagem", titulo: "RX de tórax", href: "/centro-clinico/imagens" },
    ],
  },
  professorIA: {
    pontosParaReforcar: ["Alvo de SpO₂ 88–92% (risco de hipercapnia).", "Corticosteroide sistêmico reduz duração.", "Diferenciar de asma (idade/tabagismo/reversibilidade)."],
    perguntasSocraticas: ["Por que não normalizar a SpO₂ neste paciente?", "Como diferenciar DPOC de asma?", "Quando indicar antibiótico e VNI?"],
    errosParaExplorar: ["O₂ sem controle", "Esquecer corticosteroide", "Ignorar gasometria"],
    miniAulaSugerida: "Exacerbação de DPOC: dispneia + escarro em tabagista; O₂ titulado 88–92%, broncodilatador nebulizado, corticosteroide sistêmico, antibiótico se purulência, VNI se acidose; evitar hiperóxia.",
    planoDeTreinoSugerido: ["Gasometria", "Sons — sibilos/roncos", "Manejo da DPOC", "Repetir caso de dispneia"],
  },
  // ── refs do Knowledge Graph (Fase 6) — apenas ids existentes ──
  refs: {
    knowledgeRefs: ["dx-dpoc", "drug-salbutamol", "drug-corticosteroide", "proc-oxigenoterapia", "proc-nebulizacao", "proc-intubacao", "pf-taquipneia"],
    symptomRefs: ["sym-dispneia", "sym-tosse"],
    examRefs: ["lab-gasometria", "lab-hemograma"],
    imageRefs: ["img-rx-torax"],
    soundRefs: ["ls-sibilos", "ls-roncos"],
    flowRefs: ["flow-dispneia"],
    guidelineRefs: ["guide-dpoc"],
  },
  // ── Enriquecimento pedagógico (Fase 7) ──
  teachingRefs: {
    semiologia: ["pf-taquipneia"],
    fluxos: ["flow-dispneia"],
    exames: ["lab-gasometria"],
    imagens: ["img-rx-torax"],
    sons: ["ls-sibilos", "ls-roncos"],
    guidelines: ["guide-dpoc"],
  },
  differentialRefs: ["dx-asma", "dx-pneumonia", "dx-ic", "dx-tep"],
  pitfallRefs: ["proc-oxigenoterapia", "drug-corticosteroide", "lab-gasometria"],
  clinicalReasoningRefs: ["flow-dispneia", "dx-dpoc"],
  professorObjectives: [
    "Alvo de SpO₂ 88–92% (risco de hipercapnia).",
    "Corticosteroide sistêmico reduz a duração.",
    "Diferenciar de asma (idade/tabagismo/reversibilidade).",
  ],
  commonMistakes: ["O₂ sem controle (hipercapnia)", "Omitir corticosteroide", "Confundir com asma sem justificar", "Não avaliar gasometria"],
  masteryTargets: { communication: 0.75, history: 0.85, physicalExam: 0.85, diagnosis: 0.85, complementaryExams: 0.85, conduct: 0.9, safety: 0.95, documentation: 0.7 },
};

export default CANONICAL_DPOC;
