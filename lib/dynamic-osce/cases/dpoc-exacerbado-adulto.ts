// ============================================================================
// Casos OSCE Dinâmicos — Beta · CASO (contrato Fase 2 + mapa Pulse Fase 2.5)
// "DPOC Exacerbado — Adulto"
// ----------------------------------------------------------------------------
// 1 caso = 1 arquivo TS: o caso E a rubrica vivem aqui. Isolado do OSCE
// principal. Compatível com o motor medix-rule-based e mapeado para Pulse
// (não executado nesta fase). Regra clínica central: O₂ alvo 88–92% —
// hiperóxia pode agravar hipercapnia em DPOC: titular O₂ para alvo 88–92%.
// ============================================================================

import type { DynamicCase, DynamicRubric, PatientState } from "../types";
import { recomputarClinica } from "../dynamic-state-engine";

const estadoInicialBase: PatientState = {
  vitals: { fc: 108, fr: 30, paSys: 145, paDia: 85, spo2: 84, temp: 37.8 },
  clinical: {
    estadoGeral: "dispneico, cansado, ansioso, alerta",
    trabalhoRespiratorio: "muito aumentado",
    ausculta: "roncos e sibilos difusos, murmúrio reduzido (tórax em barril)",
    fala: "frases entrecortadas",
    perfusao: "reduzida",
  },
  broncoespasmo: 0,
  oxigenioSuplementar: false,
  corticoideAdministrado: false,
  tempoDecorridoMin: 0,
  // Marcadores DPOC:
  retencaoCO2: 60,
  broncodilatacaoDpoc: 70,
  oxigenioControlado: false,
  hiperoxia: false,
  vniAplicada: false,
  antibioticoAplicado: false,
};

const estadoInicial: PatientState = {
  ...estadoInicialBase,
  clinical: recomputarClinica(estadoInicialBase),
};

export const dpocExacerbadoAdulto: DynamicCase = {
  identificacao: {
    caseId: "dynamic-copd-exacerbation-adult-001",
    titulo: "DPOC Exacerbado — Adulto",
    subtitulo: "Exacerbação grave com retenção de CO₂ — alvo de SpO₂ 88–92%",
    tipo: "adulto",
    especialidade: "Emergência / Respiratório",
    sistema: "Respiratório",
    nivel: "avancado",
    tags: ["dpoc", "exacerbação", "hipercápnia", "vni", "oxigenioterapia controlada"],
    status: "beta",
    objetivoClinico:
      "Reconhecer exacerbação grave de DPOC, ofertar O₂ com alvo 88–92% (evitar hiperóxia), iniciar dupla broncodilatação, corticoide e antibiótico se indicado; considerar VNI.",
  },

  paciente: {
    nome: "Roberto Carvalho",
    idade: 68,
    sexo: "masculino",
    pesoKg: 74,
    faixaEtaria: "adulto",
    contexto:
      "Tabagista de 45 anos-maço, DPOC grave em seguimento ambulatorial, chegou à UPA com piora da dispneia há 2 dias, escarro amarelado e febre baixa.",
    fatoresRisco: [
      "Tabagismo de longa data (45 anos-maço)",
      "DPOC grave (FEV1 < 50% previsto)",
      "Exacerbações prévias com hospitalização",
    ],
    antecedentesRelevantes: [
      "DPOC grave (GOLD III)",
      "Hipertensão arterial sistêmica",
      "Sem diabetes ou cardiopatia isquêmica",
    ],
    medicamentosUso: [
      "Brometo de tiotrópio 18 mcg/dia (inalatório)",
      "Formoterol 12 mcg 2×/dia",
      "Losartana 50 mg/dia",
    ],
    alergias: ["Nega alergias conhecidas"],
  },

  diagnostico: {
    diagnosticoPrincipal: "Exacerbação grave de DPOC",
    diagnosticosAceitos: [
      "Exacerbação grave de DPOC",
      "DPOC exacerbado",
      "Exacerbação aguda de DPOC",
      "Insuficiência respiratória aguda em DPOC",
    ],
    diagnosticosDiferenciaisEsperados: [
      "Pneumonia",
      "Insuficiência cardíaca descompensada",
      "TEP",
      "Pneumotórax",
    ],
    diagnosticosPerigososQueDevemSerExcluidos: [
      "Pneumotórax (pode piorar com VNI sem diagnóstico)",
      "TEP maciço",
      "Insuficiência cardíaca aguda (pode mimetizar DPOC)",
    ],
  },

  fisiologia: {
    estadoInicial,
    estadoEsperadoSemIntervencao:
      "Progressão para insuficiência respiratória grave com narcose hipercápnica; risco de parada respiratória.",
    criteriosMelhora: [
      "SpO₂ 88–92% em O₂ controlado",
      "FR ≤ 24 irpm",
      "Redução do esforço respiratório",
      "Melhora do nível de consciência",
    ],
    criteriosPiora: [
      "SpO₂ < 85% ou > 92% (acima do alvo — risco de hipercapnia progressiva)",
      "FR > 30 irpm",
      "Sonolência ou confusão (narcose por CO₂)",
      "Hipotensão ou taquicardia progressiva",
    ],
    criteriosInstabilidade: [
      "SpO₂ < 88%",
      "FR > 30",
      "Uso intenso de musculatura acessória",
      "Alteração do nível de consciência",
      "PaCO₂ > 55 mmHg com pH < 7,30",
    ],
    criteriosAltaSegura: [
      "SpO₂ 88–92% em O₂ domiciliar ou sem O₂",
      "FR ≤ 20 irpm",
      "Sem uso de musculatura acessória",
      "Antibiótico oral em curso se necessário",
      "Retorno ambulatorial programado",
    ],
    criteriosInternacao: [
      "SpO₂ < 90% refratária",
      "Necessidade de VNI",
      "PaCO₂ elevada com acidose",
      "Comorbidades descompensadas",
    ],
    criteriosUTI: [
      "Falha da VNI",
      "Rebaixamento do nível de consciência",
      "pH < 7,25",
      "Instabilidade hemodinâmica",
    ],
  },

  comunicacao: {
    itensEsperados: [
      "Apresentação e acolhimento ao paciente dispneico",
      "Explicação da conduta e importância do oxigênio controlado",
    ],
  },

  anamnese: {
    perguntasObrigatorias: [
      "Início e piora da dispneia (quando e como começou)",
      "Diagnóstico de DPOC e tabagismo (confirmar história)",
      "Caracterização do escarro (volume, cor, espessura)",
      "Broncodilatador de resgate habitual e resposta",
    ],
    perguntasImportantes: [
      "Febre e sintomas infecciosos concomitantes",
      "Oxigenoterapia domiciliar em uso",
      "Exacerbações prévias e hospitalizações",
      "Medicamentos em uso e aderência",
    ],
    respostasEsperadas: {
      "Início e piora da dispneia (quando e como começou)":
        "Piora progressiva há 2 dias, pior que o habitual.",
      "Caracterização do escarro (volume, cor, espessura)":
        "Escarro amarelado e espesso, volume aumentado.",
      "Broncodilatador de resgate habitual e resposta":
        "Usa tiotrópio e formoterol; salbutamol de resgate com resposta parcial.",
    },
    redFlagsAnamnese: [
      "Exacerbações frequentes (≥ 2 últimos 12 meses)",
      "Internação prévia em UTI por falência respiratória",
      "Uso de O₂ domiciliar",
    ],
  },

  exameFisico: {
    manobrasObrigatorias: [
      "Sinais vitais completos e saturação periférica (SpO₂)",
      "Ausculta pulmonar bilateral (roncos e sibilos)",
      "Avaliação de musculatura acessória e tiragem",
    ],
    achadosEsperados: [
      "Tórax em barril (hiperdistensão)",
      "Sibilos e roncos difusos",
      "Uso de esternocleidomastóideo e escalenos",
      "Cianose perioral",
    ],
    sinaisGravidade: [
      "FR > 30 irpm",
      "Uso intenso de musculatura acessória",
      "Cianose",
      "Alteração do nível de consciência (sonolência)",
    ],
    sinaisAusentesImportantes: [
      "Ausência de crepitações (afasta edema pulmonar isolado)",
      "Sem assimetria na ausculta (afasta pneumotórax)",
    ],
  },

  exames: {
    examesEssenciais: [
      "Gasometria arterial",
      "Oximetria contínua",
    ],
    examesComplementaresAceitos: [
      "Radiografia de tórax",
      "Hemograma e PCR",
      "Eletrólitos e função renal",
      "ECG (para descartar isquemia/cor pulmonale)",
    ],
    examesNaoPrioritarios: [
      "Tomografia de tórax antes de estabilizar",
      "Broncoscopia diagnóstica na fase aguda",
    ],
    interpretacoesEsperadas: {
      "Gasometria arterial":
        "PaCO₂ elevada (> 55 mmHg), pH < 7,35: insuficiência respiratória hipercápnica.",
      "Oximetria contínua": "SpO₂ 84% em ar ambiente — hipoxemia grave.",
      "Radiografia de tórax": "Hiperdistensão pulmonar, diafragmas aplainados.",
    },
    examesQueMudamConduta: ["Gasometria arterial", "Radiografia de tórax"],
  },

  intervencoes: {
    intervencoesEssenciais: ["oxigenio_controlado", "salbutamol", "ipratropio", "corticoide"],
    intervencoesAceitas: [
      "monitorizacao",
      "acesso_venoso",
      "ventilacao_nao_invasiva",
      "antibiotico_se_indicado",
      "internacao",
      "reavaliar",
    ],
    intervencoesContraindicadas: [
      "oxigenio_alto_fluxo_sem_controle",
      "sedativo_sem_indicacao",
      "alta_precoce",
    ],
    intervencoesDeResgate: ["ventilacao_nao_invasiva", "intubacao-uti"],
    respostaEsperadaPorIntervencao: [
      {
        intervencao: "oxigenio_controlado",
        efeitoEsperado: "SpO₂ sobe para 88–92%. Não ultrapassa 92% (teto controlado).",
      },
      {
        intervencao: "oxigenio_alto_fluxo_sem_controle",
        efeitoEsperado: "SpO₂ sobe excessivamente; retenção de CO₂ piora (narcose). ERRO CRÍTICO.",
      },
      {
        intervencao: "salbutamol",
        efeitoEsperado: "Redução do broncoespasmo e da FR; SpO₂ discreta melhora.",
      },
      {
        intervencao: "ipratropio",
        efeitoEsperado: "Broncodilatação adicional ao SABA.",
      },
      {
        intervencao: "corticoide",
        efeitoEsperado: "Controle da exacerbação (efeito não imediato).",
      },
      {
        intervencao: "ventilacao_nao_invasiva",
        efeitoEsperado: "FR cai, SpO₂ melhora, CO₂ reduz gradualmente.",
      },
      {
        intervencao: "antibiotico_se_indicado",
        efeitoEsperado: "Conduta correta se exacerbação infecciosa (sem efeito fisiológico imediato).",
      },
      {
        intervencao: "sedativo_sem_indicacao",
        efeitoEsperado: "Suprime drive respiratório. ERRO CRÍTICO em DPOC com hipercápnia.",
      },
      {
        intervencao: "reavaliar",
        efeitoEsperado: "Com O₂ controlado + broncodilatadores: SpO₂ em alvo, FR melhora.",
      },
    ],
  },

  reavaliacao: {
    tempoReavaliacaoMinutos: 30,
    parametrosReavaliar: [
      "SpO₂ (alvo 88–92%)",
      "FR",
      "Nível de consciência",
      "Gasometria de controle",
      "Resposta ao broncodilatador",
    ],
    respostaAdequada: "SpO₂ 88–92%, FR ≤ 24, melhora do esforço respiratório.",
    respostaInadequada: "SpO₂ < 88% ou > 94%, FR > 28, piora do nível de consciência.",
    proximaCondutaSeMelhora: "Manter internação, monitorização, ajuste do O₂, antibiótico oral.",
    proximaCondutaSePiora: "Iniciar VNI; se falha da VNI, intubação e UTI.",
  },

  errosCriticos: {
    errosCriticosDiagnostico: [
      "Não reconhecer DPOC como causa da hipoxemia",
      "Tratar como asma sem questionar história tabágica",
    ],
    errosCriticosConduta: [
      "Ofertar O₂ de alto fluxo sem controle (hiperóxia pode agravar hipercapnia por mecanismos múltiplos)",
      "Não administrar broncodilatadores",
      "Sedar paciente com hipercápnia sem via aérea garantida",
    ],
    errosCriticosSeguranca: [
      "Alvo de SpO₂ > 94% no DPOC grave",
      "Não monitorar nível de consciência com O₂ suplementar",
    ],
    errosCriticosAlta: [
      "Alta com SpO₂ < 88%",
      "Alta sem tratamento da causa da exacerbação",
    ],
  },

  simulacao: {
    simulationProvider: "medix-rule-based",
    pulseReady: true,
    pulseScenarioId: "data/human/adult/scenarios/patient/COPDExacerbation.json",
    pulseScenarioIsPlaceholder: false,
    pulseAdapterNotes:
      "Mapear retenção de CO₂, drive hipóxico e resposta ao O₂ controlado para parâmetros Pulse.",
    physiologicModelTags: ["respiratory", "hypercapnia", "bronchospasm", "hypoxemia", "gas-exchange"],
    pulseCompatibility: {
      conditionId: "copd-exacerbation-adult",
      compatibility: "strong",
      suggestedSimulationProvider: "hybrid",
      pulseScenarioCandidates: [
        "data/human/adult/scenarios/patient/COPDExacerbation.json",
        "data/human/adult/scenarios/patient/COPDSevereEmphysema.json",
      ],
      requiresMedixOverlay: true,
      pediatricSafetyAdapterRequired: false,
      notes: [
        "COPDExacerbation + O₂ titulado cobrem a fisiologia principal.",
        "Regra clínica crítica (alvo 88–92%) é verificada pela rubrica MEDIX, não pelo Pulse.",
      ],
    },
  },

  rubricaId: "rubrica-dynamic-copd-exacerbation-adult-001",
};

// ============================================================================
// RUBRICA (mesmo arquivo do caso) — total 20, 6 domínios obrigatórios.
// ============================================================================
export const rubricaDynamicCopdExacerbationAdult001: DynamicRubric = {
  rubricaId: "rubrica-dynamic-copd-exacerbation-adult-001",
  caseId: "dynamic-copd-exacerbation-adult-001",
  totalPontos: 20,
  dominios: [
    {
      nome: "Comunicação",
      pontos: 2,
      criterios: [
        {
          id: "dpoc-com-apresentacao",
          descricao: "Apresentou-se e acolheu o paciente dispneico.",
          pontos: 1,
          obrigatorio: false,
          tipoEvidencia: "comunicacao",
          referenciasCaso: ["comunicacao.itensEsperados"],
          aliasesAceitos: ["apresent", "acolh", "tranquiliz"],
        },
        {
          id: "dpoc-com-explicou",
          descricao: "Explicou a conduta e a importância do oxigênio controlado.",
          pontos: 1,
          obrigatorio: false,
          tipoEvidencia: "comunicacao",
          referenciasCaso: ["comunicacao.itensEsperados"],
          aliasesAceitos: ["explic", "orient"],
        },
      ],
    },
    {
      nome: "Anamnese",
      pontos: 4,
      criterios: [
        {
          id: "dpoc-anm-dispneia",
          descricao: "Caracterizou o início e piora da dispneia.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "anamnese",
          referenciasCaso: ["anamnese.perguntasObrigatorias"],
          aliasesAceitos: ["dispneia", "falta de ar", "piora"],
        },
        {
          id: "dpoc-anm-dpoc",
          descricao: "Investigou diagnóstico de DPOC e tabagismo.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "anamnese",
          referenciasCaso: ["anamnese.perguntasObrigatorias"],
          aliasesAceitos: ["dpoc", "tabag", "tabac", "pulmonar obstrutivo"],
        },
        {
          id: "dpoc-anm-escarro",
          descricao: "Investigou caracterização do escarro (cor/volume).",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "anamnese",
          referenciasCaso: ["anamnese.perguntasObrigatorias"],
          aliasesAceitos: ["escarro", "expectoração", "expectoracao", "secreção", "secrecao"],
        },
        {
          id: "dpoc-anm-broncodilatador",
          descricao: "Investigou uso do broncodilatador habitual e resposta.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "anamnese",
          referenciasCaso: ["anamnese.perguntasObrigatorias"],
          aliasesAceitos: ["broncodilatador", "bombinha", "formoterol", "tiotrópio", "tiotrópió"],
        },
      ],
    },
    {
      nome: "Exame físico",
      pontos: 3,
      criterios: [
        {
          id: "dpoc-exf-vitais",
          descricao: "Avaliou sinais vitais completos e saturação (SpO₂).",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "exameFisico",
          referenciasCaso: ["exameFisico.manobrasObrigatorias"],
          aliasesAceitos: ["sinais vitais", "satura", "spo2", "oximetria"],
        },
        {
          id: "dpoc-exf-ausculta",
          descricao: "Realizou ausculta pulmonar bilateral (roncos/sibilos).",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "exameFisico",
          referenciasCaso: ["exameFisico.manobrasObrigatorias", "exameFisico.achadosEsperados"],
          aliasesAceitos: ["ausculta", "roncos", "sibilos", "padrão respiratório", "padrao respiratorio"],
        },
        {
          id: "dpoc-exf-musculatura",
          descricao: "Avaliou musculatura acessória e tiragem intercostal.",
          pontos: 1,
          obrigatorio: false,
          tipoEvidencia: "exameFisico",
          referenciasCaso: ["exameFisico.sinaisGravidade"],
          aliasesAceitos: ["musculatura", "tiragem", "esforço", "esforco", "acessória", "acessoria"],
        },
      ],
    },
    {
      nome: "Exames e monitorização",
      pontos: 3,
      criterios: [
        {
          id: "dpoc-exm-gasometria",
          descricao: "Solicitou gasometria arterial para avaliar PaCO₂ e pH.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "exameComplementar",
          referenciasCaso: ["exames.examesEssenciais"],
          aliasesAceitos: ["gasometria", "gaso", "paco2", "ph arterial"],
        },
        {
          id: "dpoc-exm-monitor",
          descricao: "Monitorou oximetria de pulso continuamente.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "exameComplementar",
          referenciasCaso: ["exames.examesEssenciais"],
          aliasesAceitos: ["oximetria", "saturação", "monitor", "monitoriza"],
        },
        {
          id: "dpoc-exm-alvo-spo2",
          descricao: "Respeitou o alvo de SpO₂ 88–92% (O₂ controlado, sem alto fluxo).",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "seguranca",
          referenciasCaso: ["intervencoes.intervencoesEssenciais", "errosCriticos.errosCriticosConduta"],
          aliasesAceitos: ["alvo 88", "88–92", "oxigênio controlado", "o2 controlado"],
          erroCriticoAssociado: "Hiperóxia por O₂ de alto fluxo sem controle em DPOC",
        },
      ],
    },
    {
      nome: "Raciocínio clínico",
      pontos: 4,
      criterios: [
        {
          id: "dpoc-rac-reconhece",
          descricao: "Reconheceu exacerbação grave de DPOC com insuficiência respiratória hipercápnica.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "diagnostico",
          referenciasCaso: ["diagnostico.diagnosticoPrincipal"],
          aliasesAceitos: ["dpoc grave", "exacerbação", "hipercápn", "insuficiência respiratória"],
        },
        {
          id: "dpoc-rac-alvo-o2",
          descricao: "Identificou o risco de hiperóxia e o alvo de SpO₂ 88–92%.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "interpretacao",
          referenciasCaso: ["errosCriticos.errosCriticosConduta", "fisiologia.criteriosInstabilidade"],
          aliasesAceitos: ["88–92", "alvo", "hiperóxia", "narcose", "co2"],
          penalidadeSeAusente: 2,
          erroCriticoAssociado: "Alvo de SpO₂ > 94% no DPOC grave",
        },
        {
          id: "dpoc-rac-sem-alta",
          descricao: "Não deu alta precoce com paciente hipoxêmico / sem tratamento.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "seguranca",
          referenciasCaso: ["fisiologia.criteriosAltaSegura", "errosCriticos.errosCriticosAlta"],
          aliasesAceitos: ["não dar alta", "internação", "observação"],
          erroCriticoAssociado: "Alta insegura em DPOC",
        },
        {
          id: "dpoc-rac-vni",
          descricao: "Considerou VNI ou escalonamento (internação/UTI).",
          pontos: 1,
          obrigatorio: false,
          tipoEvidencia: "conduta",
          referenciasCaso: ["intervencoes.intervencoesDeResgate", "fisiologia.criteriosUTI"],
          aliasesAceitos: ["vni", "cpap", "bipap", "internação", "uti"],
        },
      ],
    },
    {
      nome: "Conduta e reavaliação",
      pontos: 4,
      criterios: [
        {
          id: "dpoc-cond-o2-controlado",
          descricao: "Administrou O₂ controlado (alvo 88–92%, sem alto fluxo).",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "conduta",
          referenciasCaso: ["intervencoes.intervencoesEssenciais"],
          aliasesAceitos: ["oxigênio controlado", "o2 controlado", "88–92"],
        },
        {
          id: "dpoc-cond-broncodilatadores",
          descricao: "Administrou dupla broncodilatação (SABA + anticolinérgico).",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "conduta",
          referenciasCaso: ["intervencoes.intervencoesEssenciais"],
          aliasesAceitos: ["salbutamol", "ipratrópio", "ipratropio", "broncodilatador"],
        },
        {
          id: "dpoc-cond-corticoide",
          descricao: "Prescreveu corticoide sistêmico.",
          pontos: 1,
          obrigatorio: true,
          tipoEvidencia: "conduta",
          referenciasCaso: ["intervencoes.intervencoesEssenciais"],
          aliasesAceitos: ["corticoide", "prednisona", "metilprednisolona", "hidrocortisona"],
        },
        {
          id: "dpoc-cond-reavaliou",
          descricao: "Reavaliou a resposta com melhora objetiva (SpO₂/FR).",
          pontos: 1,
          obrigatorio: false,
          tipoEvidencia: "reavaliacao",
          referenciasCaso: ["reavaliacao.parametrosReavaliar", "fisiologia.criteriosMelhora"],
          aliasesAceitos: ["reavaliou", "melhora", "reavaliação"],
        },
      ],
    },
  ],
};
