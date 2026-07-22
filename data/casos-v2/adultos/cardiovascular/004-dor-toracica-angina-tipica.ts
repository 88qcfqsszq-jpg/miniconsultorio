import { CasoOSCEV2 } from "@/types/caso-osce-v2";

export const caso004DorToracicaAnginaTipica: CasoOSCEV2 = {
  // ====== CASO 4: SÍNDROME CORONARIANA CRÔNICA — ANGINA ESTÁVEL ======
  id: "4",
  titulo: "Dor Torácica - Angina Típica",
  sistema: "Cardiovascular",
  tema: "Dor Torácica",
  nivel: "intermediario",
  tipo_estacao: "integrada",
  tempo_osce_minutos: 12,
  objetivo_pedagogico:
    "Reconhecer angina estável, investigar fatores de risco cardiovascular, excluir causas agudas perigosas e estabelecer investigação e tratamento adequados.",

  dados_visiveis_ao_estudante: {
    nome_paciente: "João Oliveira",
    idade: 58,
    sexo: "Masculino",
    queixa_principal: "Dor no peito aos esforços",
    historia_breve:
      "Sente aperto no peito quando caminha rápido ou sobe escadas, com alívio em repouso.",
  },

  dados_ocultos_do_sistema: {
    diagnostico_principal: "Angina Estável",
    diagnosticos_diferenciais: [
      "Angina Instável",
      "Infarto Agudo do Miocárdio",
      "Pericardite",
      "Refluxo Gastroesofágico",
      "Espasmo Esofágico",
    ],
    sindromes_associadas: ["Isquemia Miocárdica Transitória"],
  },

  descricaoBreve:
    "Paciente com dor precordial reproduzível ao esforço, de curta duração e com alívio em repouso.",
  categoria: "Síndrome Coronariana Crônica",

  paciente: {
    id: "pac-004",
    nome: "João Oliveira",
    idade: 58,
    sexo: "M",
    queixaPrincipal: "Dor no peito aos esforços",
    historicoDoenca:
      "Sente aperto no peito quando caminha rápido ou sobe escadas, com alívio em repouso.",
    antecedentes: [
      "Hipertensão",
      "Dislipidemia",
      "Histórico familiar positivo para infarto",
    ],
    profissao: "Advogado",
    estado_civil: "Casado",
    alergias: [],
    medicamentos_em_uso: ["Losartana 50 mg", "Atorvastatina 20 mg"],
  },

  respostas_do_paciente: {
    inicial: "Doutor, tô sentindo um aperto no peito quando faço esforço.",
    dor: "Aqui no meio do peito, tipo uma banda apertando.",
    intensidade: "De 6 a 7, bem incômodo.",
    inicio: "Começou umas 3 semanas atrás, quando subo escada.",
    duracao: "Passa em uns 5 minutos quando paro de andar.",
    fatores_piora: "Caminhada rápida, subir escada e estresse emocional.",
    fatores_melhora: "Repouso, ficar sentado tranquilo.",
    suor: "Não, não costumo suar quando acontece.",
    respiracao: "Um pouco, fico cansado.",
  },

  respostaPaciente: {
    inicial: "Doutor, tô sentindo um aperto no peito quando faço esforço.",
    dor: "Aqui no meio do peito, tipo uma banda apertando.",
    intensidade: "De 6 a 7, bem incômodo.",
    inicio: "Começou umas 3 semanas atrás, quando subo escada.",
    duracao: "Passa em uns 5 minutos quando paro de andar.",
    fatores_piora: "Caminhada rápida, subir escada e estresse emocional.",
    fatores_melhora: "Repouso, ficar sentado tranquilo.",
    suor: "Não, não costumo suar quando acontece.",
    respiracao: "Um pouco, fico cansado.",
  },

  // Mantidos por compatibilidade com o modelo atual.
  sinais_vitais: {
    corretos: {
      pressaoArterial: "145/90 mmHg",
      frequenciaCardiaca: 78,
      frequenciaRespiratoria: 16,
      temperatura: 36.8,
      saturacaoOxigenio: 98,
    },
  },

  sinaisVitaisCorretos: {
    pressaoArterial: "145/90 mmHg",
    frequenciaCardiaca: 78,
    frequenciaRespiratoria: 16,
    temperatura: 36.8,
    saturacaoOxigenio: 98,
    glicemia: 100,
  },

  exame_fisico: {
    correto: {
      inspecao:
        "Paciente calmo, sem desconforto aparente no momento, normocolorado e eupneico.",
      palpacao:
        "Ictus cordis não desviado, pulsos periféricos simétricos e amplos.",
      ausculta: "Ritmo cardíaco regular, sem sopros e sem atrito.",
      percussao: "Sem alterações relevantes.",
      observacoes:
        "Exame cardiovascular normal em repouso; história clínica sugestiva de angina estável.",
      regiao: "Precórdio",
      achados_positivos: ["Fatores de risco cardiovascular presentes"],
      achados_negativos: [
        "Dor em repouso",
        "Sopros",
        "Sinais de insuficiência cardíaca",
        "Sinais de hipoperfusão",
      ],
    },
  },

  exameFisicoCorreto: {
    inspecao: "Paciente calmo, sem desconforto aparente.",
    palpacao: "Ictus cordis não desviado, pulsos simétricos.",
    ausculta: "Ritmo cardíaco regular, sem sopros.",
    percussao: "Sem alterações relevantes.",
    observacoes: "Exame cardiovascular normal em repouso.",
  },

  exames_complementares_disponiveis: [
    {
      nome: "ECG em repouso",
      descricao: "ECG de 12 derivações em repouso.",
      resultado: "Ritmo sinusal, FC aproximada de 78 bpm, sem alterações isquêmicas agudas.",
      valor_referencia: "Ritmo sinusal; sem alterações isquêmicas agudas.",
      interpretacao:
        "ECG basal normal não afasta angina estável. A frequência deve acompanhar os sinais vitais atuais do caso.",
    },
    {
      nome: "ECG sob esforço",
      descricao: "Teste ergométrico.",
      resultado: "Infradesnível de ST em V4-V5 associado à dor.",
      valor_referencia: "Sem alterações isquêmicas induzidas pelo esforço.",
      interpretacao: "Teste positivo para isquemia miocárdica induzida pelo esforço.",
    },
    {
      nome: "Troponina I",
      descricao: "Biomarcador cardíaco.",
      resultado: "< 0,04 ng/mL",
      valor_referencia: "< 0,04 ng/mL",
      interpretacao: "Negativa, sem evidência de necrose miocárdica aguda.",
    },
  ],

  hipoteses_diagnosticas_esperadas: [
    {
      diagnostico: "Angina Estável",
      probabilidade: 85,
      criterios_minimos: [
        "Dor precordial desencadeada por esforço",
        "Duração de poucos minutos",
        "Alívio com repouso",
        "Padrão previsível",
        "Isquemia demonstrada sob esforço",
      ],
    },
  ],

  diagnosticos_diferenciais: [
    {
      diagnostico: "Síndrome Coronariana Aguda",
      criterios_exclusao: [
        "Ausência de dor em repouso",
        "Padrão estável há semanas",
        "Troponina negativa",
        "ECG basal sem alteração isquêmica aguda",
      ],
      achados_que_descartam: [
        "Ausência de instabilidade clínica",
        "Ausência de necrose miocárdica",
      ],
    },
    {
      diagnostico: "Refluxo Gastroesofágico",
      criterios_exclusao: ["Dor tipicamente relacionada ao esforço"],
      achados_que_descartam: ["Teste ergométrico positivo para isquemia"],
    },
  ],

  examesIndicados: [
    "ECG basal",
    "Teste ergométrico ou outro teste funcional de isquemia",
    "Troponina quando houver dúvida de apresentação aguda",
    "Perfil lipídico",
    "Glicemia ou hemoglobina glicada",
    "Função renal",
  ],

  conduta_esperada: {
    imediata: [
      "Confirmar ausência de dor em repouso e sinais de instabilidade",
      "Realizar ECG basal",
      "Prescrever nitrato sublingual para crises, se não houver contraindicação",
      "Iniciar ou otimizar tratamento antianginoso conforme perfil clínico",
      "Instituir terapia antiplaquetária quando indicada",
    ],
    curto_prazo: [
      "Estratificar isquemia com teste funcional adequado",
      "Otimizar controle pressórico e tratamento da dislipidemia",
      "Avaliar necessidade de investigação anatômica conforme risco e sintomas",
      "Encaminhar para cardiologia",
    ],
    longo_prazo: [
      "Modificar fatores de risco cardiovascular",
      "Estimular atividade física orientada após estratificação",
      "Reforçar adesão medicamentosa",
      "Manter seguimento cardiológico",
    ],
    encaminhamentos: ["Cardiologia"],
  },

  condutaCorreta:
    "Realizar ECG basal, estratificar isquemia, prescrever nitrato para crises quando indicado, iniciar ou otimizar terapia antianginosa e prevenção cardiovascular, orientar sinais de alarme e encaminhar para cardiologia.",

  criterios_de_gravidade: [
    {
      severidade: "leve",
      sinais: [
        "Dor previsível apenas ao esforço",
        "Alívio rápido com repouso",
        "Ausência de dor em repouso",
        "Sem instabilidade hemodinâmica",
      ],
      descricao: "Angina estável em paciente hemodinamicamente estável.",
      recomendacao:
        "Tratamento ambulatorial com estratificação de risco, investigação de isquemia e seguimento cardiológico.",
    },
  ],

  erros_criticos: [
    {
      erro: "Não reconhecer sinais de possível síndrome coronariana aguda",
      descricao:
        "Dor em repouso, progressiva, prolongada ou associada a instabilidade exige mudança imediata de fluxo.",
      penalidade: 2,
      evitavel: true,
    },
    {
      erro: "Dar alta sem orientar sinais de alarme",
      descricao:
        "O paciente deve saber procurar emergência diante de dor em repouso, piora do padrão, dispneia intensa, síncope ou sintomas persistentes.",
      penalidade: 2,
      evitavel: true,
    },
    {
      erro: "Não estratificar isquemia",
      descricao:
        "ECG em repouso pode ser normal em angina estável; a investigação funcional ou anatômica deve ser definida conforme o risco.",
      penalidade: 1.5,
      evitavel: true,
    },
  ],

  checklist_osce: [
    { item: "Investigou relação da dor com esforço e repouso", realizado: false, critico: true },
    { item: "Investigou duração, progressão e padrão da dor", realizado: false, critico: true },
    { item: "Pesquisou sinais de alarme e instabilidade", realizado: false, critico: true },
    { item: "Mediu sinais vitais completos", realizado: false, critico: true },
    { item: "Realizou ausculta cardíaca e avaliação de perfusão", realizado: false, critico: true },
    { item: "Solicitou ECG basal", realizado: false, critico: true },
    { item: "Indicou estratificação de isquemia", realizado: false, critico: true },
    { item: "Orientou tratamento antianginoso e prevenção cardiovascular", realizado: false, critico: true },
    { item: "Orientou sinais de alarme e seguimento", realizado: false, critico: true },
  ],

  rubrica_correcao: [
    {
      criterio: "Diagnóstico diferencial",
      peso: 20,
      descricao: "Diferenciação entre angina estável e síndrome coronariana aguda.",
      pontuacao_maxima: 20,
    },
    {
      criterio: "Estratificação de risco",
      peso: 20,
      descricao: "Identificação dos fatores de risco e necessidade de investigação de isquemia.",
      pontuacao_maxima: 20,
    },
    {
      criterio: "Terapia",
      peso: 30,
      descricao: "Tratamento antianginoso, prevenção cardiovascular e orientação de segurança.",
      pontuacao_maxima: 30,
    },
  ],

  modelo_soap: {
    subjetivo: {
      secao: "S",
      componentes_obrigatorios: [
        "Relação com esforço",
        "Duração típica",
        "Alívio com repouso",
        "Padrão previsível",
        "Ausência ou presença de dor em repouso",
        "Fatores de risco cardiovascular",
      ],
    },
    objetivo: {
      secao: "O",
      componentes_obrigatorios: [
        "Sinais vitais completos",
        "Exame cardiovascular",
        "Avaliação de perfusão",
        "ECG basal",
        "Estratificação funcional de isquemia",
      ],
    },
    avaliacao: {
      secao: "A",
      componentes_obrigatorios: [
        "Diagnóstico de angina estável",
        "Diferenciação de síndrome coronariana aguda",
        "Classificação de risco",
      ],
    },
    plano: {
      secao: "P",
      componentes_obrigatorios: [
        "Tratamento antianginoso",
        "Nitrato para crises quando indicado",
        "Prevenção cardiovascular",
        "Estratificação de isquemia",
        "Seguimento cardiológico",
        "Orientações de alarme",
      ],
    },
  },

  feedback_modelo: {
    acertos_esperados: [
      "Investigou o padrão típico relacionado ao esforço",
      "Pesquisou sinais de apresentação aguda",
      "Solicitou ECG basal e estratificação de isquemia",
      "Orientou tratamento antianginoso e redução de risco cardiovascular",
      "Orientou sinais de alarme",
    ],
    erros_comuns: [
      "Confundir angina estável com infarto agudo",
      "Tratar ECG basal normal como exclusão de isquemia",
      "Não estratificar o risco",
      "Não orientar procura de emergência diante de mudança do padrão",
    ],
    orientacoes_pedagogicas: [
      "Angina estável apresenta padrão previsível e relação com esforço",
      "ECG em repouso pode ser normal",
      "Taquicardia e alterações de ST induzidas pelo esforço pertencem ao teste de esforço, não ao ECG basal",
      "A conduta deve integrar controle de sintomas, prevenção cardiovascular e estratificação de risco",
    ],
  },

  checklist_oculto_examinador: {
    oQueProfessorQuer:
      "Diferenciar angina estável de síndrome coronariana aguda: padrão previsível relacionado ao esforço, alívio com repouso, ausência de dor em repouso e estabilidade clínica. Reconhecer que ECG basal normal não exclui isquemia. Indicar estratificação, tratamento antianginoso, prevenção cardiovascular, sinais de alarme e seguimento cardiológico.",
    comunicacao: [
      "se apresentou e confirmou a identidade do paciente",
      "explicou avaliação e próximos passos",
      "orientou sinais de alarme de forma objetiva",
    ],
    anamnese: [
      "investigou relação com esforço",
      "perguntou duração e progressão dos episódios",
      "investigou alívio com repouso ou nitrato",
      "pesquisou dor em repouso e sinais de gravidade",
      "perguntou fatores de risco cardiovascular",
    ],
    exame_fisico: [
      "solicitou sinais vitais",
      "realizou ausculta cardíaca",
      "avaliou perfusão",
      "pesquisou sinais de insuficiência cardíaca",
    ],
    exames_complementares: [
      "solicitou ECG em repouso",
      "indicou teste funcional de isquemia",
      "solicitou marcadores cardíacos apenas quando clinicamente apropriado",
    ],
    raciocinio: [
      "reconheceu padrão de angina estável",
      "diferenciou de síndrome coronariana aguda",
      "formulou diagnóstico apropriado",
      "estratificou o risco",
    ],
    conduta: [
      "indicou tratamento antianginoso apropriado",
      "prescreveu nitrato SOS quando indicado",
      "otimizou prevenção cardiovascular",
      "encaminhou para cardiologia",
      "orientou quando procurar emergência",
    ],
    soap: [
      "registrou dor relacionada ao esforço",
      "documentou estabilidade clínica e ECG basal",
      "reconheceu angina estável",
      "planejou investigação de isquemia e seguimento",
    ],
  },

  temaOSCE: "Angina estável / Síndrome Coronariana Crônica",
  subtopicosOSCE: [
    "Angina estável",
    "Dor ao esforço reproduzível",
    "ECG basal normal",
    "Isquemia induzida pelo esforço",
    "Estratificação de risco",
    "Tratamento antianginoso",
    "Prevenção cardiovascular",
  ],
  diagnosticoCorreto: "Angina Estável",

  exames_laboratoriais_detalhados: {
    hemograma: {
      solicitadoPor: ["hemograma", "hemograma completo"],
      disponivel: true,
      prioridade: "rotina",
      interpretacao: "Hemograma sem alterações relevantes.",
      valores: {
        hemacias: "4,80 mi/mm³",
        hemoglobina: "14,2 g/dL",
        hematocrito: "42,0%",
        vcm: "87,5 fL",
        hcm: "29,5 pg",
        chcm: "33,8 g/dL",
        rdw: "13,0%",
        leucocitos: "7.200/mm³",
        neutrofilos: "58%",
        bastonetes: "2%",
        segmentados: "56%",
        linfocitos: "30%",
        monocitos: "8%",
        eosinofilos: "3%",
        basofilos: "1%",
        plaquetas: "250.000/mm³",
        vpm: "9,0 fL",
      },
    },
    funcaoRenal: {
      solicitadoPor: ["ureia", "creatinina", "função renal"],
      disponivel: true,
      prioridade: "rotina",
      interpretacao: "Função renal preservada.",
      valores: {
        ureia: "32 mg/dL",
        creatinina: "0,9 mg/dL",
        etfg: "> 90 mL/min/1,73m²",
      },
    },
    eletrolitos: {
      solicitadoPor: ["sódio", "potássio", "eletrólitos", "ionograma"],
      disponivel: true,
      prioridade: "rotina",
      interpretacao: "Eletrólitos sem alterações relevantes.",
      valores: {
        sodio: "139 mEq/L",
        potassio: "4,2 mEq/L",
        cloro: "102 mEq/L",
        magnesio: "2,0 mg/dL",
        calcio: "9,2 mg/dL",
      },
    },
    marcadoresInflamatorios: {
      solicitadoPor: ["pcr", "vhs", "procalcitonina", "marcadores inflamatórios"],
      disponivel: true,
      prioridade: "opcional",
      interpretacao: "Marcadores inflamatórios sem elevação relevante.",
      valores: {
        pcr: "0,4 mg/dL",
        vhs: "12 mm/h",
        procalcitonina: "0,05 ng/mL",
      },
    },
    gasometria: {
      solicitadoPor: ["gasometria", "gasometria arterial"],
      disponivel: true,
      prioridade: "opcional",
      interpretacao: "Gasometria sem distúrbios ácido-base relevantes.",
      valores: {
        ph: "7,40",
        paco2: "40 mmHg",
        pao2: "92 mmHg",
        hco3: "24 mEq/L",
        satO2: "97%",
        lactato: "1,2 mmol/L",
        be: "0",
      },
    },
    marcadoresCardiacos: {
      solicitadoPor: [
        "troponina",
        "troponina i",
        "troponina seriada",
        "ckmb",
        "marcadores cardíacos",
      ],
      disponivel: true,
      prioridade: "condicional",
      interpretacao: "Marcadores cardíacos sem evidência de necrose miocárdica.",
      valores: {
        troponinaI0h: "< 0,04 ng/mL",
        troponinaI3h: "< 0,04 ng/mL",
        ckmb: "2,1 ng/mL",
        bnp: "62 pg/mL",
      },
    },
    funcaoHepatica: {
      solicitadoPor: ["tgo", "tgp", "bilirrubinas", "função hepática"],
      disponivel: true,
      prioridade: "opcional",
      interpretacao: "Função hepática sem alterações relevantes.",
      valores: {
        tgo: "24 U/L",
        tgp: "28 U/L",
        fa: "88 U/L",
        ggt: "34 U/L",
        bilirrubinaTotal: "0,8 mg/dL",
        bilirrubinaDireta: "0,2 mg/dL",
        bilirrubinaIndireta: "0,6 mg/dL",
        albumina: "4,1 g/dL",
      },
    },
    coagulograma: {
      solicitadoPor: ["tp", "inr", "ttpa", "fibrinogênio", "d-dímero", "coagulograma"],
      disponivel: true,
      prioridade: "opcional",
      interpretacao: "Coagulograma sem alterações relevantes.",
      valores: {
        tp: "12,4 s",
        inr: "1,0",
        ttpa: "31 s",
        fibrinogenio: "320 mg/dL",
        dDimero: "< 500 ng/mL",
      },
    },
    urinaTipo1: {
      solicitadoPor: ["urina tipo 1", "eas", "sumário de urina"],
      disponivel: true,
      prioridade: "opcional",
      interpretacao: "Urina tipo 1 sem alterações relevantes.",
      valores: {
        densidade: "1,020",
        ph: "6,0",
        proteina: "Ausente",
        glicose: "Ausente",
        cetonas: "Ausentes",
        sangueHemoglobina: "Ausente",
        nitrito: "Negativo",
        esteraseLeucocitaria: "Negativa",
        leucocitos: "< 5 p/campo",
        hemacias: "< 3 p/campo",
        bacterias: "Raras",
        cilindros: "Ausentes",
      },
    },
  },

  // ===== CAMPOS V3 =====
  sinaisVitais: {
    entrada: {
      momento: "Consulta em repouso, sem dor atual",
      pressaoArterial: "145/90 mmHg",
      frequenciaCardiaca: 78,
      frequenciaRespiratoria: 16,
      temperatura: 36.8,
      saturacaoOxigenio: 98,
      glicemia: 100,
      interpretacao:
        "Paciente hemodinamicamente estável, com pressão arterial elevada e história compatível com angina estável.",
    },

    evolucao: {
      aposCondutaCorreta_30min: {
        condicoesParaAtivar: [
          "ECG basal realizado e interpretado",
          "Ausência de dor em repouso confirmada",
          "Estratificação inicial de risco realizada",
          "Tratamento antianginoso e prevenção cardiovascular planejados",
          "Seguimento cardiológico organizado",
          "Orientações de alarme fornecidas",
        ],
        pressaoArterial: "140/88 mmHg",
        frequenciaCardiaca: 76,
        frequenciaRespiratoria: 16,
        saturacaoOxigenio: 98,
        interpretacao:
          "Paciente permanece estável e assintomático em repouso, com plano de investigação e seguimento definido.",
      },

      seCondutaInadequadaOuAtrasada: {
        pressaoArterial: "148/92 mmHg",
        frequenciaCardiaca: 82,
        frequenciaRespiratoria: 17,
        saturacaoOxigenio: 98,
        interpretacao:
          "Paciente permanece estável, porém sem estratificação adequada, sem controle otimizado de sintomas e com risco cardiovascular não adequadamente abordado.",
      },
    },

    criteriosParaAltaOuObservacao: {
      altaSeguraSe: [
        "Ausência de dor em repouso",
        "Ausência de sinais de instabilidade",
        "ECG basal sem alteração isquêmica aguda",
        "Síndrome coronariana aguda considerada improvável",
        "Plano de estratificação definido",
        "Tratamento e seguimento organizados",
        "Orientações de alarme fornecidas",
      ],
      manterObservacaoOuInternarSe: [
        "Dor em repouso ou progressiva",
        "Dor persistente",
        "Alteração isquêmica aguda no ECG",
        "Troponina positiva",
        "Instabilidade hemodinâmica",
        "Síncope",
        "Arritmia importante",
        "Alto risco clínico",
      ],
    },
  },

  exames: {
    complementaresDisponiveisOriginais: [
      {
        nome: "ECG em repouso",
        descricao: "ECG de 12 derivações em repouso.",
        resultado: "Ritmo sinusal, FC aproximada de 78 bpm, sem alterações isquêmicas agudas.",
        valor_referencia: "Ritmo sinusal; sem alterações isquêmicas agudas.",
        interpretacao:
          "ECG basal normal não afasta angina estável. A frequência deve acompanhar os sinais vitais atuais do caso.",
      },
      {
        nome: "ECG sob esforço",
        descricao: "Teste ergométrico.",
        resultado: "Infradesnível de ST em V4-V5 associado à dor.",
        valor_referencia: "Sem alterações isquêmicas induzidas pelo esforço.",
        interpretacao: "Teste positivo para isquemia miocárdica induzida pelo esforço.",
      },
      {
        nome: "Troponina I",
        descricao: "Biomarcador cardíaco.",
        resultado: "< 0,04 ng/mL",
        valor_referencia: "< 0,04 ng/mL",
        interpretacao: "Negativa, sem evidência de necrose miocárdica aguda.",
      },
    ],

    laboratoriais: {
      hemograma: {
        solicitadoPor: ["hemograma", "hemograma completo"],
        disponivel: true,
        prioridade: "rotina",
        interpretacao: "Hemograma sem alterações relevantes.",
        valores: {
          hemacias: "4,80 mi/mm³",
          hemoglobina: "14,2 g/dL",
          hematocrito: "42,0%",
          vcm: "87,5 fL",
          hcm: "29,5 pg",
          chcm: "33,8 g/dL",
          rdw: "13,0%",
          leucocitos: "7.200/mm³",
          neutrofilos: "58%",
          bastonetes: "2%",
          segmentados: "56%",
          linfocitos: "30%",
          monocitos: "8%",
          eosinofilos: "3%",
          basofilos: "1%",
          plaquetas: "250.000/mm³",
          vpm: "9,0 fL",
        },
      },
      funcaoRenal: {
        solicitadoPor: ["ureia", "creatinina", "função renal"],
        disponivel: true,
        prioridade: "rotina",
        interpretacao: "Função renal preservada.",
        valores: {
          ureia: "32 mg/dL",
          creatinina: "0,9 mg/dL",
          etfg: "> 90 mL/min/1,73m²",
        },
      },
      eletrolitos: {
        solicitadoPor: ["sódio", "potássio", "eletrólitos", "ionograma"],
        disponivel: true,
        prioridade: "rotina",
        interpretacao: "Eletrólitos sem alterações relevantes.",
        valores: {
          sodio: "139 mEq/L",
          potassio: "4,2 mEq/L",
          cloro: "102 mEq/L",
          magnesio: "2,0 mg/dL",
          calcio: "9,2 mg/dL",
        },
      },
      marcadoresInflamatorios: {
        solicitadoPor: ["pcr", "vhs", "procalcitonina", "marcadores inflamatórios"],
        disponivel: true,
        prioridade: "opcional",
        interpretacao: "Marcadores inflamatórios sem elevação relevante.",
        valores: {
          pcr: "0,4 mg/dL",
          vhs: "12 mm/h",
          procalcitonina: "0,05 ng/mL",
        },
      },
      gasometria: {
        solicitadoPor: ["gasometria", "gasometria arterial"],
        disponivel: true,
        prioridade: "opcional",
        interpretacao: "Gasometria sem distúrbios ácido-base relevantes.",
        valores: {
          ph: "7,40",
          paco2: "40 mmHg",
          pao2: "92 mmHg",
          hco3: "24 mEq/L",
          satO2: "97%",
          lactato: "1,2 mmol/L",
          be: "0",
        },
      },
      marcadoresCardiacos: {
        solicitadoPor: [
          "troponina",
          "troponina i",
          "troponina seriada",
          "ckmb",
          "marcadores cardíacos",
        ],
        disponivel: true,
        prioridade: "condicional",
        interpretacao: "Marcadores cardíacos sem evidência de necrose miocárdica.",
        valores: {
          troponinaI0h: "< 0,04 ng/mL",
          troponinaI3h: "< 0,04 ng/mL",
          ckmb: "2,1 ng/mL",
          bnp: "62 pg/mL",
        },
      },
      funcaoHepatica: {
        solicitadoPor: ["tgo", "tgp", "bilirrubinas", "função hepática"],
        disponivel: true,
        prioridade: "opcional",
        interpretacao: "Função hepática sem alterações relevantes.",
        valores: {
          tgo: "24 U/L",
          tgp: "28 U/L",
          fa: "88 U/L",
          ggt: "34 U/L",
          bilirrubinaTotal: "0,8 mg/dL",
          bilirrubinaDireta: "0,2 mg/dL",
          bilirrubinaIndireta: "0,6 mg/dL",
          albumina: "4,1 g/dL",
        },
      },
      coagulograma: {
        solicitadoPor: ["tp", "inr", "ttpa", "fibrinogênio", "d-dímero", "coagulograma"],
        disponivel: true,
        prioridade: "opcional",
        interpretacao: "Coagulograma sem alterações relevantes.",
        valores: {
          tp: "12,4 s",
          inr: "1,0",
          ttpa: "31 s",
          fibrinogenio: "320 mg/dL",
          dDimero: "< 500 ng/mL",
        },
      },
      urinaTipo1: {
        solicitadoPor: ["urina tipo 1", "eas", "sumário de urina"],
        disponivel: true,
        prioridade: "opcional",
        interpretacao: "Urina tipo 1 sem alterações relevantes.",
        valores: {
          densidade: "1,020",
          ph: "6,0",
          proteina: "Ausente",
          glicose: "Ausente",
          cetonas: "Ausentes",
          sangueHemoglobina: "Ausente",
          nitrito: "Negativo",
          esteraseLeucocitaria: "Negativa",
          leucocitos: "< 5 p/campo",
          hemacias: "< 3 p/campo",
          bacterias: "Raras",
          cilindros: "Ausentes",
        },
      },
    },

    observacaoUsoExames:
      "Os exames devem apoiar o raciocínio. Em caso de dor em repouso, progressão do padrão, instabilidade ou suspeita de síndrome coronariana aguda, o fluxo deve ser imediatamente escalonado.",
  },

  feedbackDetalhado: {
    escala: { total: 20, minimoAprovacao: 17 },
    dominios: [
      {
        nome: "Comunicação e postura",
        pontos: 2,
        criterios: [
          { item: "Apresentou-se, confirmou paciente e manteve postura segura", pontos: 0.5 },
          { item: "Explicou avaliação e conduta em linguagem acessível", pontos: 0.5 },
          { item: "Orientou sinais de alarme e próximos passos", pontos: 0.5 },
          { item: "Confirmou compreensão e adesão ao plano", pontos: 0.5 },
        ],
      },
      {
        nome: "Anamnese dirigida",
        pontos: 3,
        criterios: [
          { item: "Caracterizou dor, início, duração, localização e intensidade", pontos: 0.7 },
          { item: "Investigou relação com esforço e alívio com repouso", pontos: 0.8, critico: true },
          { item: "Investigou antecedentes, medicações e fatores de risco", pontos: 0.7 },
          { item: "Investigou sinais de gravidade e diferenciais perigosos", pontos: 0.8, critico: true },
        ],
      },
      {
        nome: "Exame físico e gravidade",
        pontos: 4,
        criterios: [
          { item: "Solicitou sinais vitais completos e valorizou alterações", pontos: 0.9, critico: true },
          { item: "Realizou exame cardiovascular direcionado", pontos: 1.0 },
          { item: "Avaliou perfusão e sinais de insuficiência cardíaca", pontos: 0.8 },
          { item: "Classificou estabilidade e risco de apresentação aguda", pontos: 1.0, critico: true },
          { item: "Reavaliou quando aplicável", pontos: 0.3 },
        ],
      },
      {
        nome: "Exames complementares",
        pontos: 2,
        criterios: [
          { item: "Solicitou ECG basal", pontos: 0.6, critico: true },
          { item: "Indicou estratificação de isquemia", pontos: 0.6 },
          { item: "Interpretou exames de forma coerente", pontos: 0.5 },
          { item: "Evitou tratar ECG basal normal como exclusão de isquemia", pontos: 0.3 },
        ],
      },
      {
        nome: "Raciocínio diagnóstico",
        pontos: 3,
        criterios: [
          { item: "Formulou diagnóstico principal correto", pontos: 1.0, critico: true },
          { item: "Justificou com história, exame físico e exames", pontos: 0.8 },
          { item: "Considerou síndrome coronariana aguda e outros diferenciais", pontos: 0.7 },
          { item: "Reconheceu necessidade de estratificação de risco", pontos: 0.5 },
        ],
      },
      {
        nome: "Conduta, reavaliação e destino",
        pontos: 6,
        criterios: [
          { item: "Indicou tratamento antianginoso apropriado", pontos: 1.2, critico: true },
          { item: "Orientou nitrato para crise quando indicado", pontos: 0.8 },
          { item: "Otimizou prevenção cardiovascular", pontos: 1.1, critico: true },
          { item: "Planejou investigação e seguimento cardiológico", pontos: 1.0 },
          { item: "Definiu destino seguro conforme estabilidade", pontos: 0.9 },
          { item: "Orientou sinais de alarme e retorno", pontos: 1.0, critico: true },
        ],
      },
    ],

    penalidadesAutomaticas: [
      {
        condicao: "Não reconhecer sinal de possível síndrome coronariana aguda",
        penalidade: 2,
        justificativa: "Mudança do padrão, dor em repouso ou instabilidade alteram imediatamente prioridade e destino.",
      },
      {
        condicao: "Dar alta sem orientar sinais de alarme",
        penalidade: 3,
        justificativa: "A ausência de orientação expõe o paciente a atraso no atendimento diante de piora.",
      },
      {
        condicao: "Considerar ECG basal normal como exclusão de isquemia",
        penalidade: 2,
        justificativa: "O ECG em repouso pode ser normal na angina estável.",
      },
    ],
  },
} as CasoOSCEV2;
