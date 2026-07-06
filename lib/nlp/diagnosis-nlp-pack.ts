// ============================================================================
// Diagnosis NLP Packs (ISOLADO — não integrado ao pipeline)
// ----------------------------------------------------------------------------
// Para cada diagnóstico: aliases (formas de nomear o dx), concepts (conceitos
// globais esperados, ver clinical-nlp-dictionary.ts) e caseSpecificSynonyms
// (sinônimos de conceitos específicos do caso, não presentes no dicionário
// global). NÃO altera HealthBench/rubricas/feedback.
// ============================================================================

export type DiagnosisNlpPack = {
  diagnosisKey: string;
  aliases: string[];
  concepts: string[];
  caseSpecificSynonyms: Record<string, string[]>;
};

export const DIAGNOSIS_NLP_PACKS: DiagnosisNlpPack[] = [
  // ----------------------------- TUBERCULOSE (T8) --------------------------
  {
    diagnosisKey: "tuberculose_pulmonar",
    aliases: [
      "tuberculose", "tuberculose pulmonar", "tb", "tb pulmonar", "tbc",
      "tuberculose ativa", "tuberculose pulmonar ativa", "doenca de koch",
    ],
    concepts: [
      "tosse", "tosse_cronica", "febre_vespertina_noturna", "sudorese_noturna", "perda_peso",
      "hemoptise", "contato_tb", "risco_epidemiologico_tb", "imunossupressao_hiv",
      "rx_torax", "trm_tb", "baciloscopia_escarro", "cultura_escarro", "ausculta_pulmonar",
      "linfonodos", "mascara_etiqueta_respiratoria", "notificacao_vigilancia",
      "investigar_contatos", "ripe", "adesao_tratamento",
    ],
    caseSpecificSynonyms: {
      contato_tb: [
        "contato com tuberculose", "alguem com tuberculose", "irmao teve tuberculose",
        "familiar com tuberculose", "mora com alguem com tb", "pessoa proxima com tuberculose",
        "colega com tuberculose", "contato domiciliar",
      ],
      risco_epidemiologico_tb: [
        "presidio", "situacao de rua", "abrigo", "albergue", "moradia coletiva",
        "contato em casa", "hiv", "imunossupressao",
      ],
      imunossupressao_hiv: ["hiv", "imunossupressao", "imunossuprimido", "imunodeprimido", "aids"],
    },
  },

  // ----------------------------- PNEUMONIA/PAC (T9) ------------------------
  {
    diagnosisKey: "pneumonia_pac",
    aliases: [
      "pneumonia", "pneumonia adquirida na comunidade", "pac", "infeccao pulmonar",
      "consolidacao pulmonar",
    ],
    concepts: [
      "febre", "tosse", "expectoracao", "dor_pleuritica", "dispneia", "crepitacoes",
      "ausculta_torax_anterior", "ausculta_torax_posterior", "ausculta_anterior_posterior",
      "rx_torax", "hemograma", "antibiotico_pneumonia", "gravidade_pneumonia", "sinais_alarme",
    ],
    caseSpecificSynonyms: {
      febre: ["febre", "febril", "temperatura alta", "corpo quente"],
      tosse: ["tosse", "tossindo", "tosse seca", "pigarro"],
      expectoracao: [
        "catarro", "escarro", "secrecao", "tosse produtiva", "catarro amarelado",
        "catarro esverdeado",
      ],
      dor_pleuritica: [
        "dor ao respirar", "dor para respirar fundo", "dor pleuritica", "pontada ao inspirar",
        "dor que piora com a respiracao",
      ],
      antibiotico_pneumonia: [
        "antibiotico", "amoxicilina", "amoxicilina com clavulanato", "azitromicina",
        "ceftriaxona", "claritromicina",
      ],
      gravidade_pneumonia: [
        "confusao mental", "saturacao baixa", "pressao baixa", "taquipneia", "fr alta",
        "hipotensao", "hipoxemia",
      ],
      sinais_alarme: ["piora", "falta de ar intensa", "nao melhora", "sinais de gravidade"],
    },
  },

  // ----------------------------- ASMA (T10) --------------------------------
  {
    diagnosisKey: "asma",
    aliases: ["asma", "crise asmatica", "broncoespasmo", "sibilancia"],
    concepts: [
      "dispneia", "sibilancia", "tosse", "aperto_peito", "gatilhos", "uso_broncodilatador",
      "ausculta_pulmonar", "sibilos", "saturacao", "broncodilatador", "corticoide",
      "sinais_gravidade_asma",
    ],
    caseSpecificSynonyms: {
      aperto_peito: ["aperto no peito", "peito fechado", "peito apertado", "opressao toracica"],
      gatilhos: [
        "poeira", "mofo", "fumaca", "exercicio", "frio", "alergia", "pelo de animal",
        "perfume", "infeccao viral",
      ],
      uso_broncodilatador: ["usa bombinha", "ja usa bombinha", "usa salbutamol", "faz nebulizacao"],
      broncodilatador: [
        "salbutamol", "aerolin", "bombinha", "nebulizacao", "beta 2 agonista",
        "broncodilatador inalatorio",
      ],
      corticoide: ["corticoide", "prednisona", "prednisolona", "corticosteroide", "hidrocortisona"],
      saturacao: ["saturacao", "spo2", "oximetria", "saturando"],
      sinais_gravidade_asma: [
        "fala entrecortada", "nao consegue falar", "cianose", "tiragem", "exaustao",
        "saturacao baixa", "uso de musculatura acessoria",
      ],
    },
  },

  // ----------------------------- DPOC (T11) --------------------------------
  {
    diagnosisKey: "dpoc",
    aliases: [
      "dpoc", "doenca pulmonar obstrutiva cronica", "enfisema", "bronquite cronica",
      "exacerbacao dpoc",
    ],
    concepts: [
      "tosse", "tabagismo", "carga_tabagica", "dispneia_progressiva", "tosse_cronica", "expectoracao",
      "sibilancia", "roncos", "ausculta_pulmonar", "oxigenio_suporte", "broncodilatador",
      "corticoide", "antibiotico_dpoc",
    ],
    caseSpecificSynonyms: {
      tabagismo: [
        "fuma", "fumante", "cigarro", "tabaco", "macos-ano", "macos ano", "carga tabagica",
        "parou de fumar", "ex-tabagista",
      ],
      carga_tabagica: ["carga tabagica", "macos ano", "anos-maco", "quantos cigarros por dia"],
      dispneia_progressiva: [
        "falta de ar que piora", "cansaco aos esforcos", "dispneia progressiva",
        "cada vez mais cansado",
      ],
      expectoracao: ["catarro", "escarro", "secrecao", "tosse produtiva"],
      broncodilatador: ["salbutamol", "bombinha", "nebulizacao", "ipratropio", "broncodilatador"],
      corticoide: ["corticoide", "prednisona", "prednisolona"],
      antibiotico_dpoc: ["antibiotico", "amoxicilina com clavulanato", "azitromicina", "levofloxacino"],
    },
  },

  // -------------------- INSUFICIÊNCIA CARDÍACA (T12) -----------------------
  {
    diagnosisKey: "insuficiencia_cardiaca",
    aliases: [
      "insuficiencia cardiaca", "ic", "icc", "insuficiencia cardiaca sistolica",
      "feve reduzida", "coracao fraco", "edema pulmonar cardiogenico",
    ],
    concepts: [
      "dispneia_esforco", "ortopneia", "dispneia_paroxistica_noturna", "edema_membros_inferiores",
      "turgencia_jugular", "crepitacoes", "b3", "ictus_cordis", "ecocardiograma", "bnp_ntprobnp",
      "rx_torax", "diuretico_ic", "oxigenio_suporte", "restricao_sal", "controle_peso",
    ],
    caseSpecificSynonyms: {
      dispneia_esforco: [
        "cansaco aos esforcos", "falta de ar ao caminhar", "cansa ao subir escada",
        "dispneia aos esforcos",
      ],
      b3: ["terceira bulha", "b3", "ritmo de galope", "galope", "bulha extra"],
      restricao_sal: ["reduzir sal", "pouco sal", "restricao de sal", "menos sal"],
      controle_peso: [
        "pesar todo dia", "controlar peso", "ganho de peso rapido", "reduzir sal",
        "restricao de sal",
      ],
    },
  },

  // --------------------------- SCA/IAM/ANGINA (T13) ------------------------
  {
    diagnosisKey: "sca_iam",
    aliases: [
      "sindrome coronariana aguda", "sca", "infarto", "iam", "iamcsst", "iamsst",
      "angina instavel", "dor toracica isquemica",
    ],
    concepts: [
      "dor_toracica_isquemica", "irradiacao", "fatores_risco_cardiovascular", "sudorese",
      "nauseas", "dispneia", "ecg", "troponina", "antiagregante_sca", "anticoagulacao",
      "nitrato", "reperfusao", "angioplastia", "trombolise", "monitorizacao",
    ],
    caseSpecificSynonyms: {
      irradiacao: [
        "irradia para braco", "braco esquerdo", "mandibula", "pescoco", "dor nas costas",
        "epigastrio",
      ],
      fatores_risco_cardiovascular: [
        "hipertensao", "diabetes", "tabagismo", "dislipidemia", "colesterol alto",
        "infarto previo", "historia familiar",
      ],
      sudorese: ["suor frio", "suando muito", "sudorese", "suado"],
      nauseas: ["nausea", "enjoo", "vontade de vomitar", "vomito"],
      nitrato: ["nitrato", "isordil", "nitroglicerina", "dinitrato de isossorbida"],
      reperfusao: [
        "angioplastia", "cateterismo", "hemodinamica", "trombolise", "abrir a arteria",
      ],
      angioplastia: ["angioplastia", "cateterismo", "stent", "hemodinamica"],
      trombolise: ["trombolise", "tromboliticos", "alteplase", "tenecteplase", "estreptoquinase"],
      monitorizacao: ["monitorizar", "monitorizacao", "monitor cardiaco", "observacao em monitor"],
    },
  },

  // ------------------------------- TEP (T14) -------------------------------
  {
    diagnosisKey: "tep",
    aliases: ["tep", "tromboembolismo pulmonar", "embolia pulmonar", "tromboembolia pulmonar"],
    concepts: [
      "dispneia_subita", "dor_pleuritica", "taquicardia", "hipoxemia",
      "fatores_risco_tromboembolico", "tvp", "d_dimero", "angio_tc_torax", "anticoagulacao",
      "instabilidade_hemodinamica",
    ],
    caseSpecificSynonyms: {
      dispneia_subita: ["falta de ar subita", "falta de ar de repente", "dispneia subita", "ar curto de repente"],
      dor_pleuritica: ["dor ao respirar", "dor pleuritica", "pontada ao inspirar"],
      taquicardia: ["coracao acelerado", "taquicardia", "fc alta", "batimento rapido"],
      hipoxemia: ["saturacao baixa", "hipoxemia", "spo2 baixa", "dessaturando"],
      fatores_risco_tromboembolico: [
        "cirurgia recente", "imobilizacao", "viagem longa", "anticoncepcional", "cancer",
        "trombose previa", "gestacao", "puerperio",
      ],
      tvp: [
        "dor na panturrilha", "perna inchada", "edema unilateral", "panturrilha dolorosa",
        "empastamento", "trombose na perna",
      ],
      instabilidade_hemodinamica: ["hipotensao", "pressao baixa", "instavel", "choque"],
    },
  },

  // --------------------------- PNEUMOTÓRAX (T15) ---------------------------
  {
    diagnosisKey: "pneumotorax",
    aliases: ["pneumotorax", "pneumotorax espontaneo", "colapso pulmonar"],
    concepts: [
      "dor_pleuritica", "dispneia_subita", "murmurio_reduzido", "hipertimpanismo", "rx_torax",
      "descompressao", "drenagem_toracica", "sinais_instabilidade",
    ],
    caseSpecificSynonyms: {
      dor_pleuritica: ["dor ao respirar", "dor pleuritica", "dor subita no peito", "pontada ao inspirar"],
      dispneia_subita: ["falta de ar subita", "falta de ar de repente", "dispneia subita"],
      hipertimpanismo: ["hipertimpanismo", "som timpanico", "percussao timpanica"],
      descompressao: ["descompressao", "puncao de alivio", "agulha no torax", "descompressao por agulha"],
      drenagem_toracica: ["dreno de torax", "drenagem toracica", "toracostomia", "drenar torax"],
      sinais_instabilidade: ["hipotensao", "desvio de traqueia", "instabilidade", "pneumotorax hipertensivo"],
    },
  },

  // ------------------------- DERRAME PLEURAL (T16) -------------------------
  {
    diagnosisKey: "derrame_pleural",
    aliases: ["derrame pleural", "efusao pleural", "liquido pleural"],
    concepts: [
      "dispneia", "dor_pleuritica", "murmurio_reduzido", "macicez_percussao", "rx_torax",
      "ultrassom_torax", "toracocentese",
    ],
    caseSpecificSynonyms: {
      dor_pleuritica: ["dor ao respirar", "dor pleuritica", "pontada ao inspirar"],
      macicez_percussao: ["macicez", "som macico", "percussao macica", "submacicez"],
      ultrassom_torax: ["ultrassom de torax", "usg de torax", "ecografia pleural", "ultrassom pleural"],
      toracocentese: [
        "toracocentese", "puncao pleural", "tirar liquido da pleura", "analise do liquido pleural",
      ],
    },
  },

  // ------------------------ ANEMIA HEMOLÍTICA (T17) ------------------------
  {
    diagnosisKey: "anemia_hemolitica",
    aliases: ["anemia hemolitica", "hemolise", "anemia autoimune", "anemia hemolitica autoimune"],
    concepts: [
      "fadiga", "fraqueza", "palidez", "ictericia", "coluria", "esplenomegalia",
      "reticulocitos", "bilirrubinas", "ldh", "haptoglobina", "coombs", "gravidade_anemia",
      "corticoide_hemolise",
    ],
    caseSpecificSynonyms: {
      fadiga: ["cansaco", "fadiga", "sem energia", "cansado o tempo todo"],
      fraqueza: ["fraqueza", "fraco", "moleza", "sem forca"],
      palidez: ["palidez", "palido", "descorado", "branco"],
      ictericia: ["pele amarela", "olhos amarelos", "amarelao", "amarela", "ictericia"],
      coluria: ["urina escura", "urina cor de coca cola", "xixi escuro", "coluria"],
      esplenomegalia: ["baco aumentado", "esplenomegalia", "baco grande", "dor no baco"],
      gravidade_anemia: ["hemoglobina muito baixa", "anemia grave", "necessidade de transfusao"],
      corticoide_hemolise: ["corticoide", "prednisona", "corticosteroide", "imunossupressao para hemolise"],
    },
  },

  // ------------------------ ANEMIA FERROPRIVA (extra) ----------------------
  {
    diagnosisKey: "anemia_ferropriva",
    aliases: ["anemia ferropriva", "anemia por deficiencia de ferro", "ferropenia", "deficiencia de ferro"],
    concepts: ["fadiga", "fraqueza", "palidez", "hemograma", "ferritina", "reposicao_ferro"],
    caseSpecificSynonyms: {
      fadiga: ["cansaco", "fadiga", "sem energia", "cansado o tempo todo"],
      fraqueza: ["fraqueza", "fraco", "moleza", "sem forca"],
      palidez: ["palidez", "palido", "descorado"],
      ferritina: ["ferritina", "ferro serico", "saturacao de transferrina", "cinetica do ferro"],
      reposicao_ferro: ["sulfato ferroso", "reposicao de ferro", "ferro oral", "ferro venoso", "suplemento de ferro"],
      sangramento_cronico: ["sangramento", "menstruacao intensa", "sangue nas fezes", "melena", "perda sanguinea"],
    },
  },

  // ------------------------------- DENGUE (T18) ----------------------------
  {
    diagnosisKey: "dengue",
    aliases: ["dengue", "dengue com alarme", "dengue grave", "febre dengue"],
    concepts: [
      "febre", "mialgia", "dor_retroorbitaria", "exantema", "sangramento",
      "sinais_alarme_dengue", "hidratacao", "hemograma", "plaquetas", "hematocrito",
      "prova_laco", "evitar_aine",
    ],
    caseSpecificSynonyms: {
      febre: ["febre", "febre alta", "corpo quente"],
      mialgia: ["dor no corpo", "dor muscular", "mialgia", "dores pelo corpo"],
      dor_retroorbitaria: ["dor atras dos olhos", "dor retroorbitaria", "dor nos olhos", "dor ao mover os olhos"],
      exantema: ["manchas na pele", "vermelhidao", "exantema", "rash", "manchas vermelhas"],
      sangramento: ["sangramento", "gengiva sangrando", "sangramento de mucosa", "petequias"],
      sinais_alarme_dengue: [
        "dor abdominal intensa", "vomitos persistentes", "sangramento de mucosa", "tontura",
        "queda de pressao", "hipotensao", "sonolencia", "irritabilidade",
        "aumento do hematocrito", "plaquetas baixas",
      ],
      hidratacao: ["hidratacao", "soro", "hidratar", "ingerir liquidos", "hidratacao venosa"],
      plaquetas: ["plaquetas", "plaquetopenia", "plaquetas baixas"],
      hematocrito: ["hematocrito", "hemoconcentracao", "aumento do hematocrito"],
      prova_laco: ["prova do laco", "prova do laco positiva", "teste do torniquete"],
      evitar_aine: [
        "nao tomar ibuprofeno", "evitar anti-inflamatorio", "nao usar aas", "evitar aspirina",
      ],
    },
  },

  // --------------------------- HAS (T7 #10) --------------------------------
  {
    diagnosisKey: "hipertensao_arterial",
    aliases: ["hipertensao", "hipertensao arterial", "has", "pressao alta", "pa elevada"],
    concepts: ["sinais_vitais", "fatores_risco_cardiovascular", "orientar_retorno_sinais_alarme"],
    caseSpecificSynonyms: {
      fatores_risco_cardiovascular: ["diabetes", "tabagismo", "obesidade", "sedentarismo", "historia familiar"],
      lesao_orgao_alvo: ["fundo de olho", "creatinina", "proteinuria", "hipertrofia ventricular", "microalbuminuria"],
      meta_pressorica: ["meta de pressao", "controle pressorico", "reduzir a pressao", "alvo pressorico"],
    },
  },

  // --------------------------- NEUROLÓGICOS (T19) --------------------------
  {
    diagnosisKey: "avc_isquemico",
    aliases: ["avc", "avc isquemico", "acidente vascular cerebral", "derrame", "isquemia cerebral"],
    concepts: ["deficit_neurologico_focal", "tempo_inicio_sintomas", "escala_glasgow", "tc_cranio", "trombolise"],
    caseSpecificSynonyms: {
      deficit_neurologico_focal: [
        "fraqueza de um lado", "boca torta", "fala enrolada", "dificuldade para falar",
        "perda de forca", "dormencia de um lado", "desvio de rima", "alteracao visual subita",
      ],
      tempo_inicio_sintomas: [
        "que horas comecou", "ultima vez bem", "tempo de inicio", "janela terapeutica", "acordou assim",
      ],
      escala_glasgow: ["glasgow", "nivel de consciencia", "rebaixamento", "sonolento", "coma"],
      trombolise: ["trombolise", "alteplase", "trombectomia", "reperfusao cerebral"],
    },
  },
  {
    diagnosisKey: "ait",
    aliases: ["ait", "ataque isquemico transitorio", "isquemia transitoria"],
    concepts: ["deficit_neurologico_focal", "tempo_inicio_sintomas", "tc_cranio"],
    caseSpecificSynonyms: {
      deficit_neurologico_focal: [
        "fraqueza que passou", "fala enrolada transitoria", "dormencia que melhorou",
        "sintoma que regrediu",
      ],
      tempo_inicio_sintomas: ["durou minutos", "melhorou sozinho", "sintoma transitorio"],
    },
  },
  {
    diagnosisKey: "avc_hemorragico",
    aliases: ["avc hemorragico", "hemorragia cerebral", "avc h", "sangramento cerebral"],
    concepts: ["deficit_neurologico_focal", "cefaleia_trovao", "escala_glasgow", "tc_cranio"],
    caseSpecificSynonyms: {
      cefaleia_trovao: ["pior dor da vida", "dor subita", "cefaleia em trovoada", "dor explosiva"],
      deficit_neurologico_focal: ["fraqueza de um lado", "rebaixamento", "vomito em jato"],
    },
  },
  {
    diagnosisKey: "crise_convulsiva",
    aliases: ["crise convulsiva", "convulsao", "epilepsia", "estado de mal epileptico"],
    concepts: ["convulsao", "tempo_inicio_sintomas", "escala_glasgow", "tc_cranio"],
    caseSpecificSynonyms: {
      convulsao: [
        "convulsao", "crise convulsiva", "ataque", "se debateu", "perdeu consciencia e tremeu",
        "mordeu a lingua", "liberou urina",
      ],
    },
  },
  {
    diagnosisKey: "cefaleia_hsa",
    aliases: ["hemorragia subaracnoide", "hsa", "cefaleia grave", "cefaleia em trovoada"],
    concepts: ["cefaleia_trovao", "escala_glasgow", "tc_cranio", "deficit_neurologico_focal"],
    caseSpecificSynonyms: {
      cefaleia_trovao: [
        "pior dor da vida", "dor subita", "cefaleia em trovoada", "dor explosiva",
        "comecou de repente",
      ],
      rigidez_nuca: ["rigidez de nuca", "pescoco duro", "rigidez nucal", "sinal de brudzinski"],
    },
  },
  {
    diagnosisKey: "vertigem",
    aliases: ["vertigem", "sindrome vestibular", "labirintite", "tontura rotatoria"],
    concepts: ["vertigem", "tc_cranio"],
    caseSpecificSynonyms: {
      vertigem: [
        "tontura rotatoria", "tudo rodando", "vertigem", "desequilibrio", "nistagmo",
        "sensacao de girar",
      ],
      sinais_centrais: ["nistagmo vertical", "diplopia", "disartria", "ataxia", "avc posterior"],
    },
  },
  {
    diagnosisKey: "rebaixamento_consciencia",
    aliases: ["rebaixamento de consciencia", "rebaixamento do nivel de consciencia", "coma", "torpor"],
    concepts: ["escala_glasgow", "tc_cranio", "deficit_neurologico_focal"],
    caseSpecificSynonyms: {
      escala_glasgow: ["glasgow", "nivel de consciencia", "rebaixamento", "sonolento", "torporoso", "coma"],
      causas_reversiveis: ["glicemia", "hipoglicemia", "intoxicacao", "naloxona", "tiamina"],
    },
  },

  // ===================== COMPLEMENTAR — 17 casos ===========================
  {
    diagnosisKey: "endocardite_infecciosa",
    aliases: [
      "endocardite", "endocardite infecciosa", "infeccao na valvula", "vegetacao valvar",
    ],
    concepts: [
      "febre_prolongada", "sopro_cardiaco", "fator_risco_endocardite", "hemoculturas",
      "ecocardiograma", "ecocardiograma_transesofagico", "antibiotico_endocardite", "sinais_vitais",
    ],
    caseSpecificSynonyms: {},
  },
  {
    diagnosisKey: "estenose_mitral",
    aliases: [
      "estenose mitral", "valvopatia mitral", "valva mitral estreita", "ruflar diastolico",
      "estalido de abertura",
    ],
    concepts: [
      "dispneia", "ortopneia", "fibrilacao_atrial", "estenose_mitral", "sopro_cardiaco",
      "ecocardiograma", "anticoagulacao_fa", "sinais_vitais",
    ],
    caseSpecificSynonyms: {},
  },
  {
    diagnosisKey: "estenose_mitral_fa",
    aliases: [
      "estenose mitral + fa", "estenose mitral com fibrilacao atrial",
      "valvopatia mitral com fa", "estenose mitral fibrilacao",
    ],
    concepts: [
      "estenose_mitral", "fibrilacao_atrial", "anticoagulacao_fa", "ecocardiograma",
      "dispneia", "sinais_vitais",
    ],
    caseSpecificSynonyms: {},
  },
  {
    diagnosisKey: "emergencia_hipertensiva_loa",
    aliases: [
      "emergencia hipertensiva", "crise hipertensiva com lesao de orgao alvo",
      "crise hipertensiva com loa", "hipertensao com loa",
    ],
    concepts: [
      "pa_muito_elevada", "lesao_orgao_alvo", "dor_toracica", "dispneia",
      "deficit_neurologico_focal", "sinais_vitais", "ecg", "creatinina",
      "reducao_controlada_pa", "orientar_retorno_sinais_alarme",
    ],
    caseSpecificSynonyms: {},
  },
  {
    diagnosisKey: "tvp",
    aliases: ["tvp", "trombose venosa profunda", "trombose na perna", "trombose venosa"],
    concepts: [
      "dor_panturrilha", "edema_unilateral", "risco_tvp", "d_dimero", "usg_doppler_venoso",
      "anticoagulacao", "sinais_vitais", "orientar_retorno_sinais_alarme",
    ],
    caseSpecificSynonyms: {},
  },
  {
    diagnosisKey: "febre_amarela",
    aliases: ["febre amarela", "flavivirose", "febre hemorragica viral"],
    concepts: [
      "febre", "mialgia", "ictericia_hepatite", "sangramento_mucoso", "viagem_area_risco",
      "vacina_febre_amarela", "hemograma", "coagulograma", "funcao_hepatica", "hidratacao",
      "evitar_aine",
    ],
    caseSpecificSynonyms: {
      febre: ["febre", "febre alta", "corpo quente"],
      evitar_aine: ["nao tomar ibuprofeno", "evitar anti-inflamatorio", "nao usar aas", "evitar aspirina"],
    },
  },
  {
    diagnosisKey: "zika_guillain_barre",
    aliases: [
      "zika", "zika virus", "zika + guillain barre", "guillain barre", "sindrome de guillain barre",
    ],
    concepts: [
      "febre", "exantema", "artralgia_intensa", "conjuntivite", "sinais_neurologicos_gbs",
      "sinais_vitais", "exame_neurologico", "encaminhamento_hospitalar",
    ],
    caseSpecificSynonyms: {
      febre: ["febre", "febre baixa", "corpo quente"],
    },
  },
  {
    diagnosisKey: "chikungunya",
    aliases: ["chikungunya", "chicungunha", "chikv", "febre chikungunya"],
    concepts: [
      "febre", "artralgia_intensa", "exantema", "mialgia", "hemograma", "hidratacao",
      "analgesia", "evitar_aine",
    ],
    caseSpecificSynonyms: {
      febre: ["febre", "febre alta", "corpo quente"],
      evitar_aine: ["nao tomar ibuprofeno", "evitar anti-inflamatorio", "nao usar aas", "evitar aspirina"],
    },
  },
  {
    diagnosisKey: "mieloma_multiplo",
    aliases: ["mieloma", "mieloma multiplo", "gamopatia monoclonal"],
    concepts: [
      "dor_ossea", "lesoes_liticas", "anemia", "creatinina", "hipercalcemia",
      "proteinuria_bence_jones", "eletroforese_proteinas", "mielograma", "encaminhamento_hematologia",
    ],
    caseSpecificSynonyms: {},
  },
  {
    diagnosisKey: "cid",
    aliases: [
      "cid", "coagulacao intravascular disseminada", "consumo de fatores", "coagulopatia de consumo",
    ],
    concepts: [
      "sangramento_coagulopatia", "sepse", "tp_ttp_fibrinogenio", "plaquetas", "d_dimero",
      "tratar_causa_base", "suporte_hemoderivados",
    ],
    caseSpecificSynonyms: {},
  },
  {
    diagnosisKey: "hemofilia_a",
    aliases: ["hemofilia", "hemofilia a", "deficiencia de fator viii"],
    concepts: [
      "sangramento_coagulopatia", "hemartrose", "fator_viii", "tp_ttp_fibrinogenio",
      "evitar_trauma", "encaminhamento_hematologia",
    ],
    caseSpecificSynonyms: {},
  },
  {
    diagnosisKey: "talassemia_maior",
    aliases: ["talassemia", "talassemia maior", "beta talassemia", "anemia mediterranea"],
    concepts: [
      "talassemia", "anemia", "esplenomegalia", "ictericia_hepatite", "eletroforese_hemoglobina",
      "transfusao_regular", "quelacao_ferro", "acompanhamento_hematologia",
    ],
    caseSpecificSynonyms: {},
  },
  {
    diagnosisKey: "atelectasia_pos_operatoria",
    aliases: [
      "atelectasia", "atelectasia pos operatoria", "atelectasia basal", "colapso alveolar",
    ],
    concepts: [
      "tosse", "pos_operatorio", "dispneia", "hipoventilacao", "ausculta_pulmonar", "murmurio_reduzido",
      "rx_torax", "fisioterapia_respiratoria", "sinais_vitais",
    ],
    caseSpecificSynonyms: {},
  },
  {
    diagnosisKey: "bronquiolite_viral_aguda",
    aliases: ["bronquiolite", "bronquiolite viral", "bronquiolite viral aguda", "vrs", "lactente chiador"],
    concepts: [
      "tosse", "bronquiolite", "sibilancia", "tiragem", "alimentacao_reduzida", "sinais_vitais",
      "oximetria", "hidratacao", "oxigenio_suporte", "sinais_alarme_pediatria",
    ],
    caseSpecificSynonyms: {
      oximetria: ["oximetria", "saturacao", "spo2", "saturando"],
    },
  },
  {
    diagnosisKey: "pa_elevada_pediatrica",
    aliases: [
      "pa elevada pediatrica", "pressao alta na crianca", "hipertensao pediatrica",
      "pa elevada para idade", "pressao arterial elevada para a idade",
    ],
    concepts: [
      "pa_pediatrica_elevada", "sinais_vitais", "lesao_orgao_alvo", "historia_familiar_has",
      "obesidade", "doenca_renal", "orientacao_medida_pa",
    ],
    caseSpecificSynonyms: {},
  },
  {
    diagnosisKey: "desenvolvimento_normal_pediatrico",
    aliases: [
      "desenvolvimento normal", "desenvolvimento infantil normal", "puericultura",
      "consulta de puericultura", "desenvolvimento normal para a idade",
    ],
    concepts: [
      "desenvolvimento_normal", "marcos_desenvolvimento", "crescimento", "vacinacao",
      "alimentacao", "sono", "seguranca_infantil", "orientacao_responsavel",
    ],
    caseSpecificSynonyms: {},
  },
  {
    diagnosisKey: "rinossinusite_bacteriana",
    aliases: ["rinossinusite", "sinusite bacteriana", "rinossinusite bacteriana", "sinusite"],
    concepts: [
      "rinossinusite", "febre", "secrecao_nasal_purulenta", "dor_facial", "piora_apos_melhora",
      "antibioticoterapia", "sinais_alarme_pediatria",
    ],
    caseSpecificSynonyms: {
      febre: ["febre", "febril", "temperatura alta"],
    },
  },
];

// Índice por diagnosisKey
const PACK_BY_KEY: Record<string, DiagnosisNlpPack> = Object.fromEntries(
  DIAGNOSIS_NLP_PACKS.map((p) => [p.diagnosisKey, p])
);

function norm(s: string): string {
  return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

/** Resolve um pack pela key OU por um texto livre de diagnóstico (via aliases). */
export function getDiagnosisNlpPack(diagnosisKey: string): DiagnosisNlpPack | null {
  if (PACK_BY_KEY[diagnosisKey]) return PACK_BY_KEY[diagnosisKey];
  const t = norm(diagnosisKey);
  for (const p of DIAGNOSIS_NLP_PACKS) {
    if (p.aliases.some((a) => t.includes(norm(a)) || norm(a).includes(t))) return p;
  }
  return null;
}
