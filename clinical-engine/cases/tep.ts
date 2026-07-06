// ============================================================================
// Caso Canônico — Tromboembolismo Pulmonar (risco intermediário) — legado id 10
// Rubrica/checklist/erros/sinais vitais migrados 1:1 de data/casos-osce.ts.
// Conteúdo didático adicional = ENRICHMENT (ver relatório da Fase 3).
// ============================================================================

import { CANONICAL_CASE_SCHEMA_VERSION, type CanonicalCase } from "../types/canonical-case";

export const CANONICAL_TEP: CanonicalCase = {
  schemaVersion: CANONICAL_CASE_SCHEMA_VERSION,
  identificacao: {
    legacyId: 10,
    canonicalId: "tep",
    titulo: "Tromboembolismo Pulmonar",
    diagnostico: "Tromboembolismo Pulmonar de Risco Intermediário",
    especialidade: "Pneumologia / Emergência",
    sistema: "Respiratório",
    sindromePrincipal: "Tromboembolia pulmonar aguda",
    dificuldade: "avancado",
    tempoEstimadoMin: 12,
    objetivosAprendizagem: [
      "Reconhecer TEP: dispneia/dor pleurítica súbita + fatores de risco.",
      "Valorizar que a ausculta e o RX podem ser normais.",
      "Solicitar ECG, D-dímero e angio-TC conforme probabilidade.",
      "Iniciar anticoagulação precocemente na suspeita.",
    ],
  },
  paciente: {
    nome: "Helena Gomes", idade: 45, sexo: "F", tipoPaciente: "adulto",
    contexto: "Mulher com dor torácica e dispneia súbitas; possíveis fatores de risco tromboembólico.",
    personalidade: "Assustada com a dor e a falta de ar súbitas.",
    nivelColaboracao: "media", linguagem: "leiga",
    estadoEmocional: "Ansiosa e com dor intensa.",
    queixaPrincipal: "Dor no peito e falta de ar súbita",
  },
  historia: {
    hda: "Início súbito de dor torácica pleurítica (8–9/10) e dispneia, sem febre nem catarro purulento; investigar fatores de risco (imobilização, cirurgia, contraceptivo, TVP).",
    antecedentes: ["Fatores de risco tromboembólico (a investigar)"],
    medicacoes: ["Anticoncepcional (a investigar — enriquecimento)"],
    alergias: [],
    habitos: [],
    historiaFamiliar: [],
    historiaSocial: ["Imobilização/viagem recente (a investigar — enriquecimento)"],
    fatoresDeRisco: ["Imobilização/cirurgia recente", "Uso de contraceptivo", "TVP prévia"],
    redFlags: ["Dispneia/dor súbitas", "Taquicardia FC 115", "SpO₂ 91%", "Taquipneia FR 28"],
  },
  scriptPaciente: {
    aberturaEspontanea: "Doutor, do nada começou uma dor no peito e falta de ar, muito forte.",
    respostasDirigidas: {
      inicio: "Foi súbito, começou de repente.",
      intensidade: "8 a 9, muito incômodo.",
      caracteristica: "Dói mais quando respiro fundo.",
      fatores_risco: "Fiz uma viagem longa / uso anticoncepcional (quando perguntado).",
      perna: "Uma perna estava inchada/dolorida (quando perguntado).",
    },
    sintomasPresentes: { dispneia_subita: "Faltou o ar de repente.", dor_pleuritica: "Piora ao respirar fundo." },
    sintomasAusentes: { febre: "Febre não tive.", catarro_purulento: "Catarro amarelo não.", sibilancia: "Chiado não senti." },
    respostaVagaQuandoPerguntaMal: "Falta o ar… dói o peito.",
    respostaCompletaQuandoPerguntaBem: "A dor no peito e a falta de ar começaram de repente, a dor piora ao respirar fundo; fiz uma viagem longa recentemente e uso anticoncepcional, e notei uma perna inchada.",
  },
  exameFisico: {
    sinaisVitais: { pressaoArterial: "130/85 mmHg", frequenciaCardiaca: 115, frequenciaRespiratoria: 28, temperatura: 37.0, saturacaoOxigenio: 91, glicemia: 120 },
    estadoGeral: "Dispneica, taquicárdica, ansiosa.",
    respiratorio: "Murmúrio vesicular presente bilateralmente, SEM alterações específicas (ausculta frequentemente normal no TEP).",
    cardiovascular: "Taquicardia (FC 115); pode haver hiperfonese de P2 (enriquecimento).",
    abdominal: "Sem alterações relevantes.",
    achadosPositivos: ["Taquicardia", "Taquipneia", "SpO₂ 91%", "Possível TVP em MMII"],
    achadosNegativosImportantes: ["Ausculta pulmonar sem alterações", "Sem febre alta", "Sem consolidação"],
  },
  ausculta: {
    pulmonar: {
      presente: false,
      tipoOficial: "Murmúrio vesicular normal (ausculta pode ser normal no TEP)",
      localizacao: "Bilateral",
      arquivo: "M_N_RUA.wav",
      audioUrl: "/HLS-CMDS/LS/M_N_RUA.wav",
      origemSoundsCatalog: "soundsCatalog — lung 'Normal' (M_N_RUA). Ponto didático: no TEP a ausculta costuma ser normal; o diagnóstico é por imagem.",
      silencioDidatico: false,
    },
  },
  exames: [
    { nome: "Angio-TC de tórax", solicitavel: true, resultadoEsperado: "Falha de enchimento arterial pulmonar (padrão-ouro).", justificativa: "Confirma o TEP.", interpretacao: "Trombo em artéria pulmonar.", pegadinhas: ["Avaliar função renal/contraste", "Não atrasar anticoagulação quando alta probabilidade"] },
    { nome: "D-dímero", solicitavel: true, resultadoEsperado: "Elevado (alta sensibilidade).", justificativa: "Útil quando probabilidade baixa/intermediária para excluir.", interpretacao: "Sensível, pouco específico.", pegadinhas: ["Elevado em muitas condições", "Não use isolado em alta probabilidade"] },
    { nome: "ECG", solicitavel: true, resultadoEsperado: "Taquicardia sinusal; padrão S1Q3T3 pode ocorrer.", justificativa: "Diferencial e sobrecarga direita.", interpretacao: "Sinais de sobrecarga de VD em casos maiores.", pegadinhas: ["ECG normal não exclui TEP"] },
    { nome: "Gasometria/oximetria", solicitavel: true, resultadoEsperado: "Hipoxemia.", justificativa: "Avaliar gravidade/oxigenação.", interpretacao: "Hipoxemia por alteração V/Q.", pegadinhas: [] },
  ],
  imagens: [
    { tipo: "Angio-TC de tórax", imageRef: "img-tc-torax", modalidade: "Angio-TC", regiaoAnatomica: "Tórax", obrigatoriedade: "obrigatorio", termoOpenI: "pulmonary embolism ct", achadosEsperados: ["Falha de enchimento em artéria pulmonar"], interpretacao: "Confirmação de TEP. (enriquecimento — Open-i é coleção de RX; termo pode não retornar imagem)" },
    { tipo: "Radiografia de tórax", termoOpenI: "chest xray normal", achadosEsperados: ["Frequentemente normal"], interpretacao: "RX normal NÃO exclui TEP." },
  ],
  ecg: { indicado: true, achadoEsperado: "Taquicardia sinusal; possível S1Q3T3 / sobrecarga de VD.", justificativa: "Diferencial com SCA e avaliação de sobrecarga direita." },
  diagnostico: {
    principal: "Tromboembolismo Pulmonar de Risco Intermediário",
    porQueE: ["Dispneia e dor pleurítica de início súbito.", "Fatores de risco tromboembólico + taquicardia/hipoxemia.", "Ausculta/RX frequentemente normais, confirmação por angio-TC."],
    diferenciais: [
      { diagnostico: "Infarto agudo do miocárdio", porQueNaoE: "Dor pleurítica (não opressiva típica) e ausência de supra de ST característico; contexto tromboembólico.", achadosQueDescartam: ["Dor ventilatório-dependente", "Fatores de risco de TEP"] },
      { diagnostico: "Pneumonia", porQueNaoE: "Sem febre/consolidação; ausculta normal e início súbito.", achadosQueDescartam: ["Ausência de febre/consolidação"] },
      { diagnostico: "Pericardite", porQueNaoE: "Sem atrito pericárdico nem alterações difusas de ST típicas.", achadosQueDescartam: ["Sem atrito", "Contexto tromboembólico"] },
      { diagnostico: "Síncope de outra causa", porQueNaoE: "Quadro dominante é dispneia/dor pleurítica súbita com hipoxemia.", achadosQueDescartam: ["Hipoxemia + taquicardia"] },
    ],
  },
  conduta: {
    tratamento: ["Oxigenoterapia", "Anticoagulação imediata na suspeita (não atrasar)", "Angio-TC para confirmação", "Considerar trombólise se TEP maciça/instável"],
    antibiotico: "Não indicado.",
    criteriosGravidade: ["Instabilidade hemodinâmica", "Disfunção de VD", "Hipoxemia importante", "Elevação de biomarcadores"],
    orientacoes: ["Explicar a necessidade de anticoagulação", "Investigar fator provocador", "Sinais de alarme"],
    seguimento: ["Duração e tipo de anticoagulação", "Investigação de trombofilia quando indicado", "Acompanhamento"],
    criteriosInternacao: ["TEP de risco intermediário/alto", "Instabilidade", "Necessidade de monitorização"],
    criteriosAlta: ["TEP de baixo risco selecionado com anticoagulação e seguimento (não é o caso aqui)"],
  },
  rubrica: {
    rubricaCorrecao: [
      { criterio: "Reconhecimento de Fatores de Risco", descricao: "Cirurgia, imobilização, contraceptivo", peso: 15, pontuacaoMaxima: 15 },
      { criterio: "Diagnóstico", descricao: "Solicitação de angio-TC apropriada", peso: 25, pontuacaoMaxima: 25 },
      { criterio: "Terapia Anticoagulante", descricao: "Anticoagulação imediata", peso: 30, pontuacaoMaxima: 30 },
    ],
    checklistOsce: [
      { item: "Investigou fatores de risco: cirurgia, edema", critico: true },
      { item: "Mediu SpO2 e gases se possível", critico: true },
      { item: "Solicitou ECG", critico: true },
      { item: "Solicitou D-dímero", critico: true },
      { item: "Solicitou angio-TC de tórax", critico: true },
      { item: "Iniciou anticoagulação", critico: true },
    ],
    errosCriticos: [
      { erro: "Não iniciar anticoagulação suspeitando de TEP", descricao: "Atraso em anticoagulação aumenta mortalidade", penalidade: 2.5 },
      { erro: "Não solicitar angio-TC", descricao: "Angio-TC é padrão-ouro para diagnóstico", penalidade: 2 },
    ],
    microcriteriosPorEixo: {
      anamnese: ["Investigou fatores de risco (imobilização/cirurgia/contraceptivo/TVP)", "Caracterizou dispneia/dor pleurítica súbitas", "Pesquisou sinais de TVP"],
      exameFisico: ["Mediu SpO₂/FR", "Auscultou (reconheceu que pode ser normal)", "Avaliou MMII (TVP)"],
      examesComplementares: ["ECG", "D-dímero conforme probabilidade", "Angio-TC", "Gasometria"],
      raciocinioDiagnostico: ["Formulou TEP", "Estimou probabilidade pré-teste", "Diferenciou de SCA/pneumonia/pericardite"],
      condutaSeguranca: ["Anticoagulação imediata na suspeita", "O₂", "Considerar trombólise se instável", "Não atrasar tratamento pelo exame"],
      comunicacao: ["Acolheu", "Explicou a gravidade e a anticoagulação", "Orientou seguimento"],
    },
  },
  feedbackEsperado: {
    respostaModelo: "Dispneia e dor pleurítica súbitas com taquicardia e hipoxemia, ausculta/RX normais e fatores de risco → suspeita de TEP. Dou O₂, inicio anticoagulação já na suspeita, solicito ECG/D-dímero conforme probabilidade e angio-TC para confirmar; considero trombólise se instabilidade.",
    checklistNotaMaxima: ["Investigou fatores de risco", "Mediu SpO₂/FR", "Solicitou ECG", "Solicitou D-dímero", "Solicitou angio-TC", "Iniciou anticoagulação", "Avaliou gravidade"],
    errosComuns: ["Não anticoagular na suspeita", "Não pedir angio-TC", "Descartar TEP por RX/ausculta normais", "Usar D-dímero em alta probabilidade"],
    pegadinhas: ["Ausculta e RX normais NÃO excluem TEP", "ECG normal não exclui", "Não atrasar anticoagulação pelo exame"],
    planoDeReforco: ["Probabilidade pré-teste (Wells) e uso do D-dímero", "Anticoagulação no TEP", "Diferenciais da dor torácica súbita"],
  },
  conhecimentoRelacionado: {
    links: [
      { dominio: "semiologia", titulo: "Semiologia — Pneumologia / Cardiologia", href: "/centro-clinico/semiologia", ancoras: ["Pneumologia", "Cardiologia"] },
      { dominio: "fluxo", titulo: "Fluxo da Dispneia / Dor Torácica", href: "/centro-clinico/fluxos", ancoras: ["Dispneia", "Dor torácica"] },
      { dominio: "exame", titulo: "Tomografia · ECG", href: "/centro-clinico/exames", ancoras: ["Tomografia", "ECG"] },
      { dominio: "imagem", titulo: "Atlas de Imagens", href: "/centro-clinico/imagens" },
    ],
  },
  professorIA: {
    pontosParaReforcar: ["Ausculta/RX normais NÃO excluem TEP.", "Anticoagular já na suspeita (não atrasar).", "Angio-TC é o padrão-ouro; D-dímero depende da probabilidade."],
    perguntasSocraticas: ["Por que a ausculta normal não te tranquiliza aqui?", "Quando usar D-dímero e quando ir direto à angio-TC?", "Por que anticoagular antes de confirmar?"],
    errosParaExplorar: ["Descartar por RX/ausculta normais", "Não anticoagular na suspeita", "Usar D-dímero em alta probabilidade"],
    miniAulaSugerida: "TEP: dispneia/dor pleurítica súbita + fatores de risco, com ausculta/RX frequentemente normais; estimar probabilidade, D-dímero (baixa/intermediária) ou angio-TC (alta); anticoagular precocemente; trombólise se instável.",
    planoDeTreinoSugerido: ["Fluxo da dispneia", "Probabilidade pré-teste e D-dímero", "Anticoagulação", "Repetir caso de dor torácica/dispneia"],
  },
  // ── refs do Knowledge Graph (Fase 6) — apenas ids existentes ──
  refs: {
    knowledgeRefs: ["dx-tep", "drug-anticoagulante", "score-wells", "proc-oxigenoterapia", "ecg-s1q3t3"],
    symptomRefs: ["sym-dispneia", "sym-dor-toracica", "sym-hemoptise", "sym-sincope"],
    examRefs: ["lab-ddimero", "lab-gasometria", "ecg-s1q3t3", "ecg-taquicardia-sinusal"],
    imageRefs: ["img-tc-torax", "img-rx-torax"],
    soundRefs: [],
    flowRefs: ["flow-dispneia", "flow-dor-toracica"],
    guidelineRefs: ["guide-tep"],
  },
  // ── Enriquecimento pedagógico (Fase 7) ──
  teachingRefs: {
    fluxos: ["flow-dispneia", "flow-dor-toracica"],
    exames: ["lab-ddimero", "ecg-s1q3t3"],
    imagens: ["img-tc-torax", "img-rx-torax"],
    scores: ["score-wells"],
    guidelines: ["guide-tep"],
  },
  differentialRefs: ["dx-sca", "dx-pneumonia"],
  pitfallRefs: ["img-tc-torax", "drug-anticoagulante", "score-wells"],
  clinicalReasoningRefs: ["score-wells", "dx-tep", "flow-dispneia"],
  professorObjectives: [
    "Ausculta/RX normais NÃO excluem TEP.",
    "Anticoagular já na suspeita.",
    "Angio-TC é o padrão-ouro; D-dímero depende da probabilidade.",
  ],
  commonMistakes: ["Descartar por RX/ausculta normais", "Não anticoagular na suspeita", "Não pedir angio-TC", "Usar D-dímero em alta probabilidade"],
  masteryTargets: { communication: 0.75, history: 0.9, physicalExam: 0.8, diagnosis: 0.9, complementaryExams: 0.9, conduct: 0.9, safety: 0.95, documentation: 0.7 },
};

export default CANONICAL_TEP;
