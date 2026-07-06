// ============================================================================
// Caso Canônico — PAC (Pneumonia Adquirida na Comunidade)
// ----------------------------------------------------------------------------
// PRIMEIRO caso canônico do sistema. Migra os dados reais do caso legado id 2
// (data/casos-osce.ts) para o modelo canônico completo (15 blocos), acrescentando
// o material didático e a orientação do Professor IA.
// Fonte de rubrica/checklist/erros: IDÊNTICA ao legado (compatível com HealthBench).
// ============================================================================

import { CANONICAL_CASE_SCHEMA_VERSION, type CanonicalCase } from "../types/canonical-case";

export const CANONICAL_PAC: CanonicalCase = {
  schemaVersion: CANONICAL_CASE_SCHEMA_VERSION,

  // ── 1. Identificação ──
  identificacao: {
    legacyId: 2,
    canonicalId: "pac",
    titulo: "Pneumonia Adquirida na Comunidade",
    diagnostico: "Pneumonia Adquirida na Comunidade (PAC)",
    especialidade: "Pneumologia / Clínica Médica",
    sistema: "Respiratório",
    sindromePrincipal: "Síndrome consolidativa / infecção respiratória baixa",
    dificuldade: "intermediario",
    tempoEstimadoMin: 12,
    objetivosAprendizagem: [
      "Reconhecer a síndrome clínica de PAC (tosse produtiva, febre, dispneia, dor pleurítica).",
      "Realizar exame físico respiratório direcionado e interpretar a ausculta.",
      "Solicitar e interpretar RX de tórax e hemograma.",
      "Estabelecer antibioticoterapia empírica apropriada e avaliar gravidade.",
      "Orientar sinais de alarme e seguimento em 48–72h.",
    ],
  },

  // ── 2. Paciente ──
  paciente: {
    nome: "Ana Santos",
    idade: 38,
    sexo: "F",
    tipoPaciente: "adulto",
    contexto: "Professora, solteira. Filho em idade escolar (fonte de infecções respiratórias).",
    personalidade: "Colaborativa, um pouco ansiosa com a piora dos sintomas.",
    nivelColaboracao: "alta",
    linguagem: "leiga",
    estadoEmocional: "Preocupada e cansada; refere que 'não melhora'.",
    queixaPrincipal: "Tosse com catarro e febre há 5 dias",
  },

  // ── 3. História clínica ──
  historia: {
    hda:
      "Há 5 dias iniciou tosse seca, com piora progressiva e evolução para tosse produtiva com catarro amarelado e viscoso. Febre aferida de 38,5 °C, dor torácica ventilatório-dependente (pleurítica) e dispneia aos esforços (cansaço ao subir escadas).",
    antecedentes: ["Asma na infância", "Fumante passiva (convívio domiciliar)"],
    medicacoes: ["Xarope sintomático caseiro (sem melhora)"],
    alergias: [],
    habitos: ["Fumante passiva", "Sem etilismo relatado"],
    historiaFamiliar: [],
    historiaSocial: ["Professora", "Contato próximo com criança em idade escolar"],
    fatoresDeRisco: ["Exposição a agentes respiratórios (ambiente escolar)", "Tabagismo passivo", "Antecedente de asma"],
    redFlags: ["SpO₂ 92%", "FR 24 ipm", "Dor pleurítica", "Febre persistente há 5 dias"],
  },

  // ── 4. Script do paciente ──
  scriptPaciente: {
    aberturaEspontanea: "Oi doutor/doutora, tô muito ruim, tô com essa tosse que não melhora.",
    respostasDirigidas: {
      tosse: "Sim, uma tosse que solta catarro amarelado, bem viscoso mesmo.",
      inicio: "Começou seco uns 5 dias atrás, agora tá pior.",
      febre: "Sim, acordei com febre. Medi ontem e tava 38.5 graus.",
      respiracao: "Sim, fico cansada ao subir escada.",
      dor: "Sinto uma dor no peito quando respiro fundo.",
      contato: "Meu filho traz essas coisas da escola toda hora.",
      outro_tratamento: "Tomei uns xarope em casa mas não ajudou muito.",
    },
    sintomasPresentes: {
      tosse_produtiva: "É bastante catarro, amarelado.",
      febre: "Tive febre de 38,5 °C.",
      dor_pleuritica: "Dói o peito quando respiro fundo.",
      dispneia: "Fico cansada quando subo escada.",
    },
    sintomasAusentes: {
      sibilancia: "Chiado no peito eu não senti, não.",
      hemoptise: "Sangue no catarro não vi, não.",
      edema_pernas: "Minhas pernas não incharam.",
    },
    respostaVagaQuandoPerguntaMal:
      "Ah, tô ruim… é uma tosse, sabe? Não sei explicar direito.",
    respostaCompletaQuandoPerguntaBem:
      "A tosse começou seca há 5 dias, virou catarro amarelado e viscoso; tive febre de 38,5 °C, dor no peito ao respirar fundo e canso ao subir escada.",
  },

  // ── 5. Exame físico ──
  exameFisico: {
    sinaisVitais: {
      pressaoArterial: "120/80 mmHg",
      frequenciaCardiaca: 98,
      frequenciaRespiratoria: 24,
      temperatura: 38.5,
      saturacaoOxigenio: 92,
      glicemia: 105,
    },
    estadoGeral: "Regular estado geral, febril, lúcida e orientada, hidratada, tosse produtiva evidente, taquipneia leve.",
    respiratorio:
      "Taquipneia leve (FR 24 ipm), expansão simétrica sem uso de musculatura acessória; frêmito toracovocal aumentado em base esquerda; submacicez em base esquerda; estertores crepitantes em base esquerda com murmúrio vesicular presente bilateralmente.",
    cardiovascular: "Bulhas rítmicas, normofonéticas, sem sopros. Taquicardia leve (FC 98).",
    abdominal: "Indolor, sem visceromegalias (sem alterações relevantes ao caso).",
    achadosPositivos: ["Crepitações em base esquerda", "Taquipneia", "Febre", "Tosse produtiva", "Frêmito aumentado", "Submacicez basal"],
    achadosNegativosImportantes: ["Ausência de sibilos", "Ausência de roncos", "Sem edema de MMII", "Sem turgência jugular"],
  },

  // ── 6. Ausculta (soundsCatalog) ──
  ausculta: {
    pulmonar: {
      presente: true,
      tipoOficial: "Crepitações grossas (Coarse Crackles)",
      localizacao: "Base esquerda (LLA) — no fluxo OSCE, base à esquerda; base direita como variação",
      arquivo: "M_CC_LLA.wav",
      audioUrl: "/HLS-CMDS/LS/M_CC_LLA.wav",
      soundRef: "ls-crepitacoes",
      origemSoundsCatalog:
        "lib/clinical-sounds/soundsCatalog.ts — categoria lung, originalType 'Coarse Crackles', csvId M_G_LLA (mappingType translated-code C/G→FC/CC).",
      silencioDidatico: false,
      observacao: "Seleção real via lib/ausculta/pulmonar-case-mapping.ts (padrão 'pneumonia' → coarse_crackles focal na base).",
    },
    cardiaca: {
      presente: false,
      tipoOficial: "Normal (B1/B2)",
      localizacao: "Focos habituais",
      arquivo: null,
      silencioDidatico: false,
      observacao: "Ausculta cardíaca sem alterações relevantes ao caso.",
    },
  },

  // ── 7. Exames ──
  exames: [
    {
      nome: "Radiografia de tórax PA e perfil",
      solicitavel: true,
      resultadoEsperado: "Infiltrado consolidativo no lobo inferior esquerdo.",
      justificativa: "Confirma o foco pulmonar, avalia extensão e busca complicações (derrame).",
      interpretacao: "Compatível com pneumonia bacteriana (consolidação lobar).",
      pegadinhas: ["RX pode ser pouco evidente na fase inicial", "Não confundir consolidação com atelectasia/derrame"],
    },
    {
      nome: "Hemograma completo",
      solicitavel: true,
      resultadoEsperado: "Leucocitose 14.000/mm³ com neutrofilia 87%.",
      justificativa: "Avalia resposta inflamatória/infecciosa e gravidade.",
      interpretacao: "Padrão de infecção bacteriana.",
      pegadinhas: ["Leucócitos normais não excluem infecção grave"],
    },
    {
      nome: "Procalcitonina (opcional)",
      solicitavel: true,
      resultadoEsperado: "Elevada (quando disponível).",
      justificativa: "Auxilia a distinguir etiologia bacteriana e a guiar antibiótico.",
      interpretacao: "Sugere etiologia bacteriana quando elevada.",
      pegadinhas: ["Não substitui a avaliação clínica e o RX"],
    },
  ],

  // ── 8. Imagens ──
  imagens: [
    {
      tipo: "Radiografia de tórax PA e perfil",
      imageRef: "img-rx-torax",
      modalidade: "RX",
      regiaoAnatomica: "Tórax",
      termoOpenI: "pneumonia chest xray consolidation",
      achadosEsperados: ["Consolidação em lobo inferior esquerdo", "Broncograma aéreo", "Possível derrame parapneumônico"],
      interpretacao: "Consolidação alveolar compatível com PAC.",
    },
  ],

  // ── 9. ECG ──
  ecg: {
    indicado: false,
    achadoEsperado: "Não indicado de rotina; se realizado, taquicardia sinusal (FC 98) sem sinais isquêmicos.",
    justificativa: "ECG não é exame-chave para PAC; taquicardia é reativa à febre/infecção.",
  },

  // ── 10. Diagnóstico ──
  diagnostico: {
    principal: "Pneumonia Adquirida na Comunidade (PAC)",
    porQueE: [
      "Tosse produtiva + febre + dor pleurítica + dispneia (síndrome clínica típica).",
      "Crepitações focais + frêmito aumentado + submacicez (síndrome consolidativa).",
      "Infiltrado consolidativo no RX + leucocitose com neutrofilia.",
    ],
    diferenciais: [
      { diagnostico: "Bronquite aguda", porQueNaoE: "Não cursa com consolidação no RX.", achadosQueDescartam: ["Infiltrado em RX", "Submacicez/frêmito aumentado"] },
      { diagnostico: "Exacerbação de asma", porQueNaoE: "Predomínio seria de sibilos expiratórios difusos, não crepitações focais.", achadosQueDescartam: ["Ausência de sibilos", "Consolidação focal"] },
      { diagnostico: "TEP", porQueNaoE: "Sem fator de risco/quadro súbito dominante; há febre e catarro purulento com consolidação.", achadosQueDescartam: ["Febre + escarro purulento", "Consolidação no RX"] },
      { diagnostico: "Insuficiência cardíaca", porQueNaoE: "Crepitações seriam bibasais simétricas com congestão; aqui é focal com febre.", achadosQueDescartam: ["Ausência de turgência jugular/edema", "Febre + neutrofilia"] },
      { diagnostico: "Tuberculose", porQueNaoE: "Quadro agudo (5 dias) e consolidação basal, sem cronicidade/apical.", achadosQueDescartam: ["Evolução aguda", "Localização basal"] },
    ],
  },

  // ── 11. Conduta ──
  conduta: {
    tratamento: [
      "Antibioticoterapia empírica (betalactâmico + macrolídeo).",
      "Hidratação.",
      "Oxigenoterapia se SpO₂ < 92%.",
      "Antitérmico/analgesia sintomática.",
    ],
    antibiotico: "Betalactâmico (ex.: amoxicilina/amoxicilina-clavulanato) + macrolídeo, com dose apropriada.",
    criteriosGravidade: ["Febre 38–39 °C", "SpO₂ 90–94%", "FR > 24 ipm", "Considerar CURB-65 para decisão de local de tratamento"],
    orientacoes: ["Sinais de alarme respiratório (piora da dispneia, febre persistente, escarro com sangue)", "Retorno se agravar", "Adesão ao antibiótico"],
    seguimento: ["Reavaliação clínica em 48–72h", "Seguimento ambulatorial", "Investigar recorrências"],
    criteriosInternacao: ["Instabilidade / SpO₂ persistentemente baixa", "CURB-65 elevado", "Comorbidade descompensada", "Intolerância à via oral"],
    criteriosAlta: ["Estabilidade clínica", "Boa saturação em ar ambiente", "Tolerância à via oral", "Rede de apoio e retorno garantidos"],
  },

  // ── 12. Rubrica HealthBench (IDÊNTICA ao legado) ──
  rubrica: {
    rubricaCorrecao: [
      { criterio: "Diagnóstico Diferencial", descricao: "Considerou diagnósticos alternativos", peso: 20, pontuacaoMaxima: 20 },
      { criterio: "Exames Complementares", descricao: "Seleção apropriada", peso: 20, pontuacaoMaxima: 20 },
      { criterio: "Antibióticoterapia", descricao: "Antibiótico correto e dose apropriada", peso: 30, pontuacaoMaxima: 30 },
    ],
    checklistOsce: [
      { item: "Caracterizou a tosse (seca vs produtiva)", critico: true },
      { item: "Perguntou sobre febre", critico: true },
      { item: "Mediu sinais vitais completos", critico: true },
      { item: "Realizou ausculta pulmonar completa", critico: true },
      { item: "Solicitou radiografia de tórax", critico: true },
      { item: "Prescreveu antibióticos apropriados", critico: true },
    ],
    errosCriticos: [
      { erro: "Não solicitar radiografia de tórax", descricao: "Radiografia é essencial para confirmar diagnóstico", penalidade: 1.5 },
      { erro: "Prescrever antibiótico inapropriado", descricao: "PAC requer cobertura para Streptococcus pneumoniae e Haemophilus", penalidade: 2 },
    ],
    microcriteriosPorEixo: {
      anamnese: ["Caracterizou tosse (seca/produtiva)", "Investigou febre e duração", "Pesquisou dispneia/dor pleurítica", "Investigou contatos/fatores de risco"],
      exameFisico: ["Mediu sinais vitais completos com SpO₂", "Auscultou tórax anterior e posterior", "Pesquisou sinais de consolidação (crepitações/frêmito)", "Avaliou padrão respiratório e esforço"],
      examesComplementares: ["Solicitou RX de tórax", "Solicitou hemograma", "Considerou marcador inflamatório quando disponível"],
      raciocinioDiagnostico: ["Formulou hipótese de PAC coerente com achados", "Considerou diferenciais respiratórios", "Justificou com RX + ausculta + leucograma"],
      condutaSeguranca: ["Antibiótico empírico apropriado", "Avaliou gravidade (SpO₂/FR/CURB-65)", "Orientou sinais de alarme e retorno", "Definiu reavaliação em 48–72h"],
      comunicacao: ["Apresentou-se e acolheu", "Explicou a hipótese em linguagem acessível", "Orientou tratamento/retorno", "Abriu espaço para dúvidas"],
    },
  },

  // ── 13. Feedback esperado ──
  feedbackEsperado: {
    respostaModelo:
      "Diante de tosse produtiva, febre há 5 dias, dor pleurítica e dispneia, com crepitações e submacicez em base esquerda, a hipótese é PAC. Solicito RX de tórax (consolidação) e hemograma (leucocitose com neutrofilia), avalio gravidade (SpO₂ 92%, FR 24 → risco moderado) e inicio antibioticoterapia empírica (betalactâmico + macrolídeo) com hidratação e O₂ se SpO₂ < 92%. Oriento sinais de alarme e reavaliação em 48–72h.",
    checklistNotaMaxima: [
      "Apresentou-se e acolheu a paciente",
      "Caracterizou a tosse e a febre",
      "Investigou dispneia, dor pleurítica e contatos",
      "Mediu sinais vitais completos com SpO₂",
      "Auscultou tórax e identificou crepitações",
      "Solicitou RX de tórax e hemograma",
      "Formulou PAC com diferenciais",
      "Prescreveu antibiótico apropriado com dose",
      "Avaliou gravidade e orientou sinais de alarme + retorno",
    ],
    errosComuns: [
      "Não medir SpO₂",
      "Prescrever antibiótico sem especificar dose",
      "Não solicitar RX de tórax",
      "Fechar diagnóstico sem considerar diferenciais",
      "Não orientar sinais de alarme/retorno",
    ],
    pegadinhas: [
      "RX inicial pode ser pouco evidente",
      "Leucograma normal não exclui infecção",
      "Crepitações basais também ocorrem em congestão — correlacionar com febre/consolidação",
    ],
    planoDeReforco: [
      "Revisar semiologia respiratória (consolidação: frêmito/percussão/ausculta)",
      "Estudar antibioticoterapia empírica da PAC e CURB-65",
      "Praticar interpretação de RX de pneumonia",
    ],
  },

  // ── 14. Centro Clínico relacionado ──
  conhecimentoRelacionado: {
    links: [
      { dominio: "semiologia", titulo: "Semiologia — Pneumologia", href: "/centro-clinico/semiologia", ancoras: ["Pneumologia"] },
      { dominio: "fluxo", titulo: "Fluxo da Dispneia / Febre", href: "/centro-clinico/fluxos", ancoras: ["Dispneia", "Febre"] },
      { dominio: "exame", titulo: "RX de tórax · Hemograma", href: "/centro-clinico/exames", ancoras: ["RX de tórax", "Hemograma"] },
      { dominio: "imagem", titulo: "Pneumonia (RX)", href: "/centro-clinico/imagens", ancoras: ["Pneumonia"] },
      { dominio: "som", titulo: "Crepitações (finas/grossas)", href: "/centro-clinico/sons", ancoras: ["Crepitações grossas"] },
      { dominio: "escore", titulo: "CURB-65 (gravidade da PAC)", ancoras: ["CURB-65"] },
    ],
  },

  // ── 15. Professor IA ──
  professorIA: {
    pontosParaReforcar: [
      "Sempre medir SpO₂ e FR (gravidade da PAC).",
      "Justificar o antibiótico e a dose (não basta 'iniciar antibiótico').",
      "Relacionar ausculta + RX + leucograma ao diagnóstico.",
    ],
    perguntasSocraticas: [
      "Quais achados no exame físico apontam para consolidação, e não broncoespasmo?",
      "Como a SpO₂ e a FR mudam a sua conduta e o local de tratamento?",
      "Por que este quadro é PAC e não asma, IC ou TEP?",
      "Qual antibiótico e por quê? Qual a dose?",
    ],
    errosParaExplorar: [
      "Esquecer SpO₂",
      "Antibiótico sem dose",
      "Não solicitar RX",
      "Fechar diagnóstico sem diferenciais",
    ],
    miniAulaSugerida:
      "PAC: síndrome consolidativa (frêmito↑, submacicez, crepitações focais) confirmada por RX; avaliar gravidade (SpO₂/FR/CURB-65); antibioticoterapia empírica (betalactâmico + macrolídeo) com dose; orientar sinais de alarme e reavaliar em 48–72h.",
    planoDeTreinoSugerido: [
      "Semiologia respiratória (Centro Clínico)",
      "Interpretação de RX de pneumonia (Atlas de Imagens)",
      "Antibioticoterapia da PAC + CURB-65",
      "Repetir um caso OSCE de dispneia/febre",
    ],
  },
  // ── refs do Knowledge Graph (Fase 6) — apenas ids existentes ──
  refs: {
    knowledgeRefs: ["dx-pneumonia", "score-curb65", "drug-amoxicilina", "pf-submacicez", "pf-fremito-aumentado", "ref-open-i", "ref-hls-cmds"],
    symptomRefs: ["sym-tosse", "sym-febre", "sym-dispneia", "sym-dor-toracica"],
    examRefs: ["lab-hemograma"],
    imageRefs: ["img-rx-torax"],
    soundRefs: ["ls-crepitacoes"],
    flowRefs: ["flow-dispneia", "flow-febre"],
    guidelineRefs: ["guide-pneumonia"],
  },
  // ── Enriquecimento pedagógico (Fase 7) — refs = ids do Knowledge Graph ──
  teachingRefs: {
    semiologia: ["pf-submacicez", "pf-fremito-aumentado"],
    fluxos: ["flow-dispneia", "flow-febre"],
    exames: ["lab-hemograma"],
    imagens: ["img-rx-torax"],
    sons: ["ls-crepitacoes"],
    scores: ["score-curb65"],
    guidelines: ["guide-pneumonia"],
  },
  differentialRefs: ["dx-asma", "dx-tep", "dx-ic"],
  pitfallRefs: ["img-rx-torax", "lab-hemograma"],
  clinicalReasoningRefs: ["flow-dispneia", "score-curb65", "dx-pneumonia"],
  professorObjectives: [
    "Sempre medir SpO₂ e FR (gravidade da PAC).",
    "Justificar o antibiótico e a dose.",
    "Relacionar ausculta + RX + leucograma ao diagnóstico.",
  ],
  commonMistakes: [
    "Não medir SpO₂",
    "Prescrever antibiótico sem especificar a dose",
    "Não solicitar RX de tórax",
    "Fechar o diagnóstico sem considerar diferenciais",
    "Não orientar sinais de alarme/retorno",
  ],
  masteryTargets: { communication: 0.8, history: 0.9, physicalExam: 0.85, diagnosis: 0.9, complementaryExams: 0.9, conduct: 0.9, safety: 0.95, documentation: 0.7 },
};

export default CANONICAL_PAC;
