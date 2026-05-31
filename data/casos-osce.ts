import { Caso } from "@/lib/types";

export const casosOSCE: Caso[] = [
  {
    // ====== CASO 1: SCA - SÍNDROME CORONARIANA AGUDA ======
    id: "1",
    titulo: "Dor Torácica - Síndrome Coronariana Aguda",
    sistema: "Cardiovascular",
    tema: "Dor Torácica",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 15,
    objetivo_pedagogico:
      "Reconhecer sinais e sintomas de SCA, solicitar exames diagnósticos apropriados e estabelecer conduta emergencial",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Carlos Silva",
      idade: 52,
      sexo: "Masculino",
      queixa_principal: "Dor no peito há 2 horas",
      historia_breve:
        "Começou de repente enquanto assistia TV, com sudorese e falta de ar",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Síndrome Coronariana Aguda (SCA) - IAMCSST",
      diagnosticos_diferenciais: [
        "Infarto Agudo do Miocárdio (IAM)",
        "Angina Instável",
        "Pericardite Aguda",
        "Embolia Pulmonar",
        "Dissecção de Aorta",
      ],
      sindromes_associadas: ["Síndrome Coronariana Aguda"],
    },

    descricaoBreve:
      "Paciente com dor torácica típica, com irradiação para o braço esquerdo",
    categoria: "SCA",
    paciente: {
      id: "pac-001",
      nome: "Carlos Silva",
      idade: 52,
      sexo: "M",
      queixaPrincipal: "Dor no peito há 2 horas",
      historicoDoenca:
        "Começou de repente enquanto assistia TV, acompanhado de sudorese e falta de ar",
      antecedentes: [
        "Hipertensão",
        "Histórico familiar positivo para infarto",
      ],
      profissao: "Engenheiro",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: ["Losartana 50mg"],
    },

    respostas_do_paciente: {
      inicial: "Oi, tô com uma dor no peito que não passa.",
      dor: "Aqui no meio do peito, bem no centro, às vezes irradia pro braço esquerdo.",
      intensidade: "É muito forte, de 8 a 9, tenho medo do que é.",
      inicio: "Começou umas 2 horas atrás, tava assistindo TV tranquilo.",
      suor: "Sim, tô suado e tremendo, meu pai morreu de infarto.",
      respiracao: "Sim, tenho falta de ar, estou ansioso.",
      tontura: "Um pouco, sim.",
      nausea: "Sinto um enjôo leve.",
    },
    respostaPaciente: {
      inicial: "Oi, tô com uma dor no peito que não passa.",
      dor: "Aqui no meio do peito, bem no centro, às vezes irradia pro braço esquerdo.",
      intensidade: "É muito forte, de 8 a 9, tenho medo do que é.",
      inicio: "Começou umas 2 horas atrás, tava assistindo TV tranquilo.",
      suor: "Sim, tô suado e tremendo, meu pai morreu de infarto.",
      respiracao: "Sim, tenho falta de ar, estou ansioso.",
      tontura: "Um pouco, sim.",
      nausea: "Sinto um enjôo leve.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "160/95 mmHg",
        frequenciaCardiaca: 102,
        frequenciaRespiratoria: 20,
        temperatura: 36.8,
        saturacaoOxigenio: 96,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "160/95 mmHg",
      frequenciaCardiaca: 102,
      frequenciaRespiratoria: 20,
      temperatura: 36.8,
      saturacaoOxigenio: 96,
      glicemia: 110,
    },

    exame_fisico: {
      correto: {
        inspecao:
          "Paciente ansioso, diaforético, em desconforto aparente, palidez facial",
        palpacao: "Leve sensibilidade precordial, sem alterações estruturais",
        ausculta:
          "Ritmo cardíaco acelerado (taquicardia), sem sopros ou arritmias evidentes",
        percussao: "Normal",
        observacoes:
          "Sinais sugestivos de desconforto cardíaco, necessário ECG e troponina imediatamente",
        regiao: "Precórdio",
        achados_positivos: ["Taquicardia", "Diaforese", "Ansiedade"],
        achados_negativos: ["Sopros", "Arritmias"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Paciente ansioso, diaforético, em desconforto aparente",
      palpacao: "Leve sensibilidade precordial, sem alterações",
      ausculta: "Ritmo cardíaco acelerado, sem sopros ou arritmias evidentes",
      percussao: "Normal",
      observacoes:
        "Sinais sugestivos de desconforto cardíaco, necessário ECG e troponina",
    },

    exame_fisico_interativo: {
      geral: {
        estado_geral: "Paciente ansioso, diaforético, em aparente sofrimento, posição antálgica.",
        consciencia: "Lúcido e orientado em tempo e espaço.",
      },
      cardiovascular: {
        inspecao_precordial: "Sem abaulamentos visíveis, diaforese evidente.",
        ausculta_cardiaca: "Bulhas hipofonéticas, ritmo regular, FC 102 bpm, sem sopros audíveis.",
        pulsos: "Pulsos presentes e simétricos bilateralmente, amplitude reduzida.",
        turgencia_jugular: "Sem turgência jugular aparente.",
        edema: "Sem edema de membros inferiores.",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "ECG (Eletrocardiograma)",
        descricao: "12 derivações",
        resultado: "Elevação do segmento ST em D2, D3, aVF",
        valor_referencia: "Segmento ST isoelétrico",
        interpretacao: "Infarto Agudo do Miocárdio Inferior",
      },
      {
        nome: "Troponina I",
        descricao: "Biomarcador cardíaco",
        resultado: "2.8 ng/mL",
        valor_referencia: "<0.04 ng/mL",
        interpretacao: "Elevada - necrose miocárdica confirmada",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Síndrome Coronariana Aguda (SCA)",
        probabilidade: 95,
        criterios_minimos: [
          "Dor precordial típica",
          "Duração >20 minutos",
          "Elevação de troponina",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Pericardite Aguda",
        criterios_exclusao: ["Segmento ST elevado focal"],
        achados_que_descartam: ["Elevação focal de ST"],
      },
    ],
    examesIndicados: [
      "ECG (eletrocardiograma)",
      "Troponina",
      "Angiografia coronariana",
    ],

    conduta_esperada: {
      imediata: [
        "Chamar cardiologia urgentemente",
        "ECG nos primeiros 10 minutos",
        "Monitorização cardíaca",
        "Oxigenioterapia",
        "Aspirina 500mg VO",
      ],
      curto_prazo: [
        "Cateterismo cardíaco",
        "Internação em UCO",
        "Betabloqueador",
      ],
      longo_prazo: ["Reabilitação cardíaca", "Modificação de fatores de risco"],
      encaminhamentos: ["Cardiologia", "Unidade Coronariana"],
    },
    condutaCorreta:
      "Transferência imediata para unidade coronariana, ECG, aspirina, antitrombótico conforme protocolo",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: [
          "Dor precordial intensa",
          "Sudorese profusa",
          "Falta de ar",
          "PAS <90",
        ],
        descricao: "Paciente em risco iminente de morte",
        recomendacao: "Transferência urgente para UTI",
      },
    ],

    erros_criticos: [
      {
        erro: "Não realizar ECG nos primeiros 10 minutos",
        descricao: "ECG é o teste diagnóstico mais importante para SCA",
        penalidade: 2,
        evitavel: true,
      },
      {
        erro: "Não encaminhar para cateterismo cardíaco urgente",
        descricao: "SCA com elevação de ST requer reperfusão urgente",
        penalidade: 2.5,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Investigou duração e características da dor",
        realizado: false,
        critico: true,
      },
      {
        item: "Mediu sinais vitais corretamente",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou ECG nos primeiros 10 minutos",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou troponina",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Coleta de Dados Clínicos",
        peso: 15,
        descricao: "Investigação completa do histórico",
        pontuacao_maxima: 15,
      },
      {
        criterio: "Diagnóstico",
        peso: 25,
        descricao: "Hipótese diagnóstica correta",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Conduta e Tratamento",
        peso: 20,
        descricao: "Plano terapêutico correto",
        pontuacao_maxima: 20,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Caracterização da dor (OLDCARTS)",
          "Fatores de risco cardiovascular",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Sinais vitais completos",
          "Exame cardiovascular",
          "ECG com interpretação",
          "Troponina",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Diagnóstico principal", "Diagnósticos diferenciais"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Terapia antitrombótica",
          "Revascularização miocárdica",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu os sinais de alerta",
        "Solicitou ECG e troponina",
        "Iniciou terapia antitrombótica",
        "Encaminhou para cateterismo",
      ],
      erros_comuns: [
        "Demora excessiva para ECG",
        "Não solicitar troponina",
        "Demora para encaminhamento",
      ],
      orientacoes_pedagogicas: [
        "SCA é uma emergência - ECG nos primeiros 10 minutos",
        "Time is muscle - cada minuto sem reperfusão causa dano miocárdio",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer:
        "Um atendimento ágil e seguro: ECG nos primeiros 10 minutos, reconhecimento dos sinais de gravidade, acionamento imediato de cardiologia e transferência para unidade coronariana. Tempo é músculo - cada minuto sem reperfusão causa dano irreversível.",
      comunicacao: [
        "cumprimentou o paciente e se apresentou",
        "confirmou nome e idade",
        "explicou a importância de agir rapidamente",
        "pediu permissão para examinar",
        "demonstrou calma e segurança apesar da urgência",
      ],
      anamnese: [
        "investigou características da dor (início, duração, irradiação)",
        "investigou fatores de risco (hipertensão, história familiar)",
        "investigou sintomas associados (sudorese, dispneia)",
      ],
      exame_fisico: [
        "solicitou sinais vitais rapidamente",
        "realizou ausculta cardíaca e respiratória",
        "avaliou perfusão e estado geral",
      ],
      exames_complementares: [
        "solicitou ECG nos primeiros 10 minutos",
        "solicitou troponina ou biomarcadores",
        "considerou angiografia coronariana",
      ],
      raciocinio: [
        "reconheceu apresentação compatível com SCA",
        "identificou critério de gravidade (dor intensa, sudorese)",
        "formulou hipótese correta",
      ],
      conduta: [
        "acionou cardiologia urgentemente",
        "preparou transferência para unidade coronariana",
        "reconheceu urgência (time is muscle)",
        "não atrasou transferência para mais investigações",
      ],
      soap: [
        "preencheu adequadamente histórico de dor",
        "registrou sinais vitais e achados físicos",
        "documentou hipótese de SCA",
        "planejou conduta urgente",
      ],
    },

    diagnosticoCorreto: "Síndrome Coronariana Aguda",
  },

  {
    // ====== CASO 2: PNEUMONIA ADQUIRIDA NA COMUNIDADE ======
    id: "2",
    titulo: "Pneumonia Adquirida na Comunidade",
    sistema: "Respiratório",
    tema: "Infecção Respiratória",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico:
      "Diagnosticar pneumonia comunitária e estabelecer tratamento antimicrobiano apropriado",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Ana Santos",
      idade: 38,
      sexo: "Feminino",
      queixa_principal: "Tosse com catarro e febre há 5 dias",
      historia_breve:
        "Começou com tosse seca, piorou progressivamente com catarro amarelado e febre",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Pneumonia Adquirida na Comunidade (PAC)",
      diagnosticos_diferenciais: [
        "Bronquite Aguda",
        "Exacerbação de Asma",
        "Tuberculose",
        "Infecção Viral",
      ],
      sindromes_associadas: ["Síndrome de Resposta Inflamatória Sistêmica"],
    },

    descricaoBreve:
      "Paciente com tosse produtiva, febre e desconforto respiratório",
    categoria: "Pneumonia",
    paciente: {
      id: "pac-002",
      nome: "Ana Santos",
      idade: 38,
      sexo: "F",
      queixaPrincipal: "Tosse com catarro e febre há 5 dias",
      historicoDoenca:
        "Começou com tosse seca, piorou progressivamente com catarro amarelado",
      antecedentes: ["Asma na infância", "Fumante passiva"],
      profissao: "Professora",
      estado_civil: "Solteira",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial:
        "Oi doutor/doutora, tô muito ruim, tô com essa tosse que não melhora.",
      tosse: "Sim, uma tosse que solta catarro amarelado, bem viscoso mesmo.",
      inicio: "Começou seco uns 5 dias atrás, agora tá pior.",
      febre: "Sim, acordei com febre. Medi ontem e tava 38.5 graus.",
      respiracao: "Sim, fico cansada ao subir escada.",
      dor: "Sinto uma dor no peito quando respiro fundo.",
      contato: "Meu filho traz essas coisas da escola toda hora.",
      outro_tratamento: "Tomei uns xarope em casa mas não ajudou muito.",
    },
    respostaPaciente: {
      inicial:
        "Oi doutor/doutora, tô muito ruim, tô com essa tosse que não melhora.",
      tosse: "Sim, uma tosse que solta catarro amarelado, bem viscoso mesmo.",
      inicio: "Começou seco uns 5 dias atrás, agora tá pior.",
      febre: "Sim, acordei com febre. Medi ontem e tava 38.5 graus.",
      respiracao: "Sim, fico cansada ao subir escada.",
      dor: "Sinto uma dor no peito quando respiro fundo.",
      contato: "Meu filho traz essas coisas da escola toda hora.",
      outro_tratamento: "Tomei uns xarope em casa mas não ajudou muito.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "120/80 mmHg",
        frequenciaCardiaca: 98,
        frequenciaRespiratoria: 24,
        temperatura: 38.5,
        saturacaoOxigenio: 92,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "120/80 mmHg",
      frequenciaCardiaca: 98,
      frequenciaRespiratoria: 24,
      temperatura: 38.5,
      saturacaoOxigenio: 92,
      glicemia: 105,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente febril, tosse produtiva evidente, taquipneia leve",
        palpacao: "Expansão torácica simétrica, sem alterações",
        ausculta:
          "Crepitações bibasais, broncovesicular em ambos os pulmões, predomínio à esquerda",
        percussao: "Normal",
        observacoes:
          "Sinais de consolidação pulmonar sugestivos de pneumonia bacteriana",
        regiao: "Pulmões bilateralmente",
        achados_positivos: [
          "Crepitações",
          "Taquipneia",
          "Febre",
          "Tosse produtiva",
        ],
        achados_negativos: ["Sibilos", "Roncos"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Paciente febril, tosse produtiva evidente, taquipneia leve",
      palpacao: "Expansão torácica simétrica, sem alterações",
      ausculta:
        "Crepitações bibasais, broncovesicular em ambos os pulmões, predomínio à esquerda",
      percussao: "Normal",
      observacoes:
        "Sinais de consolidação pulmonar sugestivos de pneumonia bacteriana",
    },

    exame_fisico_interativo: {
      geral: {
        estado_geral: "Paciente em regular estado geral, febril, com tosse produtiva.",
        consciencia: "Lúcido e orientado em tempo e espaço.",
        hidratacao: "Hidratado.",
      },
      respiratorio: {
        inspecao_torax: "Taquipneia leve, expansão simétrica, sem uso de musculatura acessória.",
        padrao_respiratorio: "Frequência respiratória 24 ipm, padrão regular.",
        expansibilidade: "Expansibilidade simétrica bilateralmente.",
        fremito_toracovocal: "Fremito aumentado em base esquerda.",
        percussao: "Submacicez em base esquerda.",
        ausculta_pulmonar: "Estertores crepitantes em base esquerda, murmúrio vesicular presente bilateralmente.",
        egofonia: "Ausente.",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Radiografia de Tórax PA e Perfil",
        descricao: "Avaliação de infiltrados pulmonares",
        resultado: "Infiltrado consolidativo no lobo inferior esquerdo",
        valor_referencia: "Sem infiltrados",
        interpretacao: "Compatível com pneumonia bacteriana",
      },
      {
        nome: "Hemograma Completo",
        descricao: "Série de glóbulos",
        resultado: "Leucocitose 14.000/mm³, neutrofilia 87%",
        valor_referencia: "4.500-11.000/mm³",
        interpretacao: "Infecção bacteriana",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Pneumonia Adquirida na Comunidade (PAC)",
        probabilidade: 90,
        criterios_minimos: [
          "Tosse produtiva",
          "Febre",
          "Crepitações à ausculta",
          "Infiltrado em RX",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Bronquite Aguda",
        criterios_exclusao: ["Infiltrado em Raio X"],
        achados_que_descartam: ["Consolidação pulmonar"],
      },
    ],
    examesIndicados: [
      "Raio X de tórax PA e perfil",
      "Hemograma",
      "Procalcitonina",
    ],

    conduta_esperada: {
      imediata: [
        "Iniciar antibióticoterapia (betalactâmico + macrolídeo)",
        "Hidratação IV",
        "Oxigenioterapia se SpO2 <92%",
      ],
      curto_prazo: [
        "Radiografia de tórax",
        "Monitorização clínica",
        "Avaliação de resposta em 48-72h",
      ],
      longo_prazo: ["Seguimento ambulatorial", "Investigação de recorrências"],
      encaminhamentos: ["Pneumologia se necessário"],
    },
    condutaCorreta:
      "Antibióticoterapia (betalactâmico + macrolídeo), hidratação, oxigenioterapia conforme necessário",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["Febre 38-39°C", "SpO2 90-94%", "FR >24"],
        descricao: "Pneumonia de risco moderado",
        recomendacao: "Antibióticoterapia iniciada, monitorização",
      },
    ],

    erros_criticos: [
      {
        erro: "Não solicitar radiografia de tórax",
        descricao: "Radiografia é essencial para confirmar diagnóstico",
        penalidade: 1.5,
        evitavel: true,
      },
      {
        erro: "Prescrever antibiótico inapropriado",
        descricao: "PAC requer cobertura para Streptococcus pneumoniae e Haemophilus",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Caracterizou a tosse (seca vs produtiva)", realizado: false, critico: true },
      { item: "Perguntou sobre febre", realizado: false, critico: true },
      { item: "Mediu sinais vitais completos", realizado: false, critico: true },
      { item: "Realizou ausculta pulmonar completa", realizado: false, critico: true },
      { item: "Solicitou radiografia de tórax", realizado: false, critico: true },
      { item: "Prescreveu antibióticos apropriados", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Diagnóstico Diferencial",
        peso: 20,
        descricao: "Considerou diagnósticos alternativos",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Exames Complementares",
        peso: 20,
        descricao: "Seleção apropriada",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Antibióticoterapia",
        peso: 30,
        descricao: "Antibiótico correto e dose apropriada",
        pontuacao_maxima: 30,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Características da tosse",
          "Duração dos sintomas",
          "Febre",
          "Contatos com doentes",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Sinais vitais",
          "Ausculta pulmonar",
          "Radiografia de tórax",
          "Hemograma",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Diagnóstico de PAC", "Gravidade"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Antibióticoterapia", "Hidratação", "Seguimento"],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu sinais de consolidação pulmonar",
        "Solicitou radiografia apropriadamente",
        "Prescreveu antibióticos corretos",
      ],
      erros_comuns: [
        "Não considerar diagnóstico diferencial",
        "Prescreveu monoterapia antibiótica",
      ],
      orientacoes_pedagogicas: [
        "PAC clássica: febre, tosse produtiva, crepitações, infiltrado em RX",
        "Sempre solicite radiografia para confirmar diagnóstico",
        "Cobertura empírica deve incluir S. pneumoniae e H. influenzae",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer:
        "Diagnóstico sistemático de pneumonia: anamnese detalhada de sintomas respiratórios, exame físico focado em ausculta, solicitação de radiografia de tórax para confirmação, seleção apropriada de antibióticos empíricos cobrindo pneumococo e Haemophilus.",
      comunicacao: [
        "se apresentou ao paciente",
        "perguntou permissão para examinar",
        "explicou o que estava investigando",
        "mostrou empatia com desconforto respiratório",
      ],
      anamnese: [
        "investigou início e progressão dos sintomas",
        "perguntou sobre tosse (seca vs produtiva)",
        "investigou febre e duração",
        "perguntou sobre fatores de risco",
      ],
      exame_fisico: [
        "solicitou sinais vitais",
        "realizou ausculta pulmonar bilateral",
        "procurou por estertores ou redução do murmúrio",
        "avaliou estado geral",
      ],
      exames_complementares: [
        "solicitou radiografia de tórax",
        "solicitou hemograma ou PCR",
        "considerou culturar escarro se necessário",
      ],
      raciocinio: [
        "integrou anamnese + ausculta + RX para diagnóstico",
        "reconheceu apresentação clínica de PAC",
        "formulou diagnóstico apropriado",
      ],
      conduta: [
        "selecionou cobertura empírica adequada",
        "considerou via de administração (VO vs IV)",
        "planejou seguimento",
        "deu orientações sobre quando piorar",
      ],
      soap: [
        "documentou sintomas respiratórios",
        "registrou achados auscultatórios",
        "formulou diagnóstico baseado em achados",
        "planejou antibioticoterapia",
      ],
    },

    diagnosticoCorreto: "Pneumonia Adquirida na Comunidade",
  },

  {
    // ====== CASO 3: ASMA AGUDA ======
    id: "3",
    titulo: "Asma Aguda",
    sistema: "Respiratório",
    tema: "Dispneia Aguda",
    nivel: "iniciante",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico:
      "Reconhecer crise asmática, avaliar gravidade e estabelecer tratamento broncodilatador",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Roberto Costa",
      idade: 28,
      sexo: "Masculino",
      queixa_principal: "Falta de ar e chiado no peito há 3 horas",
      historia_breve:
        "Asma desde a infância, controlada com inalador quando necessário",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Asma Aguda (Crise Asmática Moderada)",
      diagnosticos_diferenciais: [
        "Anafilaxia",
        "Embolia Pulmonar",
        "Pneumotórax",
        "Edema Pulmonar",
      ],
      sindromes_associadas: ["Obstrução Reversível das Vias Aéreas"],
    },

    descricaoBreve:
      "Paciente com dispneia súbita, chiado no peito e redução do pico de fluxo",
    categoria: "Asma",
    paciente: {
      id: "pac-003",
      nome: "Roberto Costa",
      idade: 28,
      sexo: "M",
      queixaPrincipal: "Falta de ar e chiado no peito há 3 horas",
      historicoDoenca:
        "Asma desde a infância, controlada com inalador quando necessário",
      antecedentes: ["Asma", "Alergias sazonais", "Alergias a ácaros e pó"],
      profissao: "Designer",
      estado_civil: "Solteiro",
      alergias: ["Ácaros", "Pólen"],
      medicamentos_em_uso: ["Salbutamol conforme necessário"],
    },

    respostas_do_paciente: {
      inicial:
        "Doutor/doutora, tô com muita dificuldade pra respirar, é como se tivesse algo apertando meu peito.",
      falta_ar: "Muito! Não consigo pegar ar direito.",
      chiado: "Sim! Tô fazendo aquele barulho chato ao respirar.",
      tosse: "Sim, uma tosse seca mesmo.",
      aperto: "Sim, aperto no peito, tipo uma banda apertando.",
      inicio: "Começou de repente umas 3 horas atrás.",
      gatilho: "Não fiz nada diferente hoje, acordei assim.",
      inalador: "Tenho um inalador em casa mas uso pouquíssimo.",
      alergias: "Sou muito alérgico, principalmente a pó e pólen.",
      estresse: "Sim, tava estressado no trabalho.",
    },
    respostaPaciente: {
      inicial:
        "Doutor/doutora, tô com muita dificuldade pra respirar, é como se tivesse algo apertando meu peito.",
      falta_ar: "Muito! Não consigo pegar ar direito.",
      chiado: "Sim! Tô fazendo aquele barulho chato ao respirar.",
      tosse: "Sim, uma tosse seca mesmo.",
      aperto: "Sim, aperto no peito, tipo uma banda apertando.",
      inicio: "Começou de repente umas 3 horas atrás.",
      gatilho: "Não fiz nada diferente hoje, acordei assim.",
      inalador: "Tenho um inalador em casa mas uso pouquíssimo.",
      alergias: "Sou muito alérgico, principalmente a pó e pólen.",
      estresse: "Sim, tava estressado no trabalho.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "130/85 mmHg",
        frequenciaCardiaca: 110,
        frequenciaRespiratoria: 28,
        temperatura: 36.9,
        saturacaoOxigenio: 88,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "130/85 mmHg",
      frequenciaCardiaca: 110,
      frequenciaRespiratoria: 28,
      temperatura: 36.9,
      saturacaoOxigenio: 88,
      glicemia: 140,
    },

    exame_fisico: {
      correto: {
        inspecao:
          "Paciente em desconforto respiratório, taquipneia, uso de musculatura acessória",
        palpacao: "Expansão torácica reduzida bilateralmente",
        ausculta:
          "Chiado difuso bilateral (wheezing), redução do murmúrio vesicular",
        percussao: "Hiperinsuflação pulmonar",
        observacoes:
          "Crise asmática moderada com redução significativa do fluxo aéreo",
        regiao: "Pulmões bilateralmente",
        achados_positivos: [
          "Wheezing difuso",
          "Taquipneia",
          "Redução do murmúrio",
        ],
        achados_negativos: ["Crepitações", "Sibilos inspiratórios"],
      },
    },
    exameFisicoCorreto: {
      inspecao:
        "Paciente em desconforto respiratório, taquipneia, uso de musculatura acessória",
      palpacao: "Expansão torácica reduzida bilateralmente",
      ausculta:
        "Chiado difuso bilateral (wheezing), redução do murmúrio vesicular",
      percussao: "Hiperinsuflação pulmonar",
      observacoes:
        "Crise asmática moderada com redução significativa do fluxo aéreo",
    },

    exame_fisico_interativo: {
      geral: {
        estado_geral: "Paciente em desconforto respiratório, taquipneico, usando musculatura acessória.",
      },
      respiratorio: {
        inspecao_torax: "Taquipneia (28 ipm), uso de musculatura acessória, retrações intercostais.",
        expansibilidade: "Expansão torácica reduzida bilateralmente.",
        ausculta_pulmonar: "Sibilos difusos bilaterais em expiração, murmúrio vesicular reduzido.",
        musculatura_acessoria: "Presente, uso evidente de músculos acessórios.",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Espirometria",
        descricao: "Função pulmonar",
        resultado: "FEV1 60% do previsto",
        valor_referencia: ">80% do previsto",
        interpretacao: "Obstrução moderada do fluxo aéreo",
      },
      {
        nome: "Gasometria Arterial",
        descricao: "pH, pCO2, pO2",
        resultado: "pH 7.40, pCO2 35, pO2 65 com O2",
        valor_referencia: "pH 7.35-7.45, pCO2 35-45, pO2 >80 com O2",
        interpretacao: "Hipoxemia moderada",
      },
      {
        nome: "Raio X de Tórax",
        descricao: "PA e perfil",
        resultado: "Hiperinsuflação pulmonar, sem pneumotórax",
        valor_referencia: "Normal",
        interpretacao: "Compatível com asma aguda",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Asma Aguda (Crise Asmática)",
        probabilidade: 95,
        criterios_minimos: [
          "Dispneia aguda",
          "Chiado bilateral",
          "Redução do fluxo aéreo",
          "Resposta ao broncodilatador",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Anafilaxia",
        criterios_exclusao: ["Ausência de angioedema", "Sem urticária"],
        achados_que_descartam: ["História alérgica clara", "Sem exposição alérgena recente"],
      },
      {
        diagnostico: "Pneumotórax",
        criterios_exclusao: ["RX normal"],
        achados_que_descartam: ["Ausência de pneumotórax em RX"],
      },
    ],
    examesIndicados: [
      "Espirometria",
      "Gasometria arterial",
      "Raio X de tórax para excluir pneumotórax",
    ],

    conduta_esperada: {
      imediata: [
        "Salbutamol inalado (albuterol)",
        "Corticosteroide sistêmico (prednisona ou metilprednisolona)",
        "Oxigenioterapia para manter SpO2 >94%",
        "Monitorização cardiopulmonar",
      ],
      curto_prazo: [
        "Broncodilatadores seriados a cada 15-20 minutos",
        "Magnesium IV se crise grave",
      ],
      longo_prazo: [
        "Prescrever inalador de manutenção",
        "Avaliação de gatilhos",
        "Acompanhamento pneumológico",
      ],
      encaminhamentos: ["Pneumologia se não responder ao tratamento"],
    },
    condutaCorreta:
      "Salbutamol inalado, corticosteroide sistêmico, oxigenioterapia para manter SpO2 > 94%",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["SpO2 <90%", "FR >30", "Fala apenas palavras isoladas"],
        descricao: "Crise asmática grave com risco de insuficiência respiratória",
        recomendacao: "Internação, terapia agressiva, considernar intubação",
      },
      {
        severidade: "moderada",
        sinais: ["SpO2 90-94%", "FR 20-30", "Chiado difuso"],
        descricao: "Crise asmática moderada",
        recomendacao: "Broncodilatadores, corticosteroide, oxigenioterapia",
      },
    ],

    erros_criticos: [
      {
        erro: "Não usar corticosteroide sistêmico",
        descricao:
          "Corticosteroide é essencial em toda crise asmática, reduz recorrência",
        penalidade: 2,
        evitavel: true,
      },
      {
        erro: "Não avaliar gravidade adequadamente",
        descricao: "Asma grave pode progredir para insuficiência respiratória",
        penalidade: 2.5,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou histórico de asma", realizado: false, critico: true },
      { item: "Perguntou sobre gatilhos", realizado: false, critico: true },
      { item: "Mediu sinais vitais (inclusive SpO2)", realizado: false, critico: true },
      { item: "Realizou ausculta pulmonar completa", realizado: false, critico: true },
      { item: "Avaliou gravidade corretamente", realizado: false, critico: true },
      {
        item: "Prescreveu salbutamol + corticosteroide",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Avaliação de Gravidade",
        peso: 25,
        descricao: "Reconhecimento de sinais de gravidade",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Terapia Broncodilatadora",
        peso: 25,
        descricao: "Salbutamol apropriadamente prescrito",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Corticosteroide Sistêmico",
        peso: 20,
        descricao: "Prescrição apropriada",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Oxigenioterapia",
        peso: 15,
        descricao: "Titulação para SpO2 >94%",
        pontuacao_maxima: 15,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Duração da dispneia",
          "Histórico de asma",
          "Gatilhos identificáveis",
          "Medicações asmáticas em uso",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "SpO2 e sinais vitais",
          "Ausculta pulmonar",
          "Uso de musculatura acessória",
          "Espirometria se possível",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Crise asmática", "Avaliação de gravidade"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Broncodilatadores",
          "Corticosteroide",
          "Oxigenioterapia",
          "Acompanhamento",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu chiado pulmonar",
        "Mediu saturação de oxigênio",
        "Prescreveu broncodilatador",
        "Indicou corticosteroide sistêmico",
      ],
      erros_comuns: [
        "Não usar corticosteroide",
        "Demora para oxigenioterapia",
        "Subestimar gravidade",
      ],
      orientacoes_pedagogicas: [
        "Asma aguda: dispneia, chiado, aperto no peito, tosse",
        "Ausculta: wheezing bilateral, redução do murmúrio",
        "SEMPRE use corticosteroide sistêmico + SABA em crise asmática",
        "Titule oxigenioterapia para SpO2 >94%",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer:
        "Reconhecer crise asmática aguda: história de asma, dispneia, sibilos à ausculta, hipoxemia. Tratamento correto: oxigenioterapia, SABA + corticosteroide sistêmico. Não deixar sair da emergência sem estar melhor.",
      comunicacao: [
        "se apresentou rapidamente (paciente dispneico)",
        "acalmou o paciente",
        "explicou o que está fazendo",
        "transmitiu confiança",
      ],
      anamnese: [
        "investigou história prévia de asma",
        "perguntou sobre gatilhos",
        "investigou início da crise",
        "perguntou sobre medicações em casa",
      ],
      exame_fisico: [
        "solicitou sinais vitais imediatamente",
        "mediu SpO2",
        "ausculta bilateral procurando sibilos",
        "avaliou uso de musculatura acessória",
      ],
      exames_complementares: [
        "solicitou SpO2/gasometria",
        "considerou radiografia para descartar outros diagnósticos",
        "considerou pico de fluxo se possível",
      ],
      raciocinio: [
        "reconheceu dispneia aguda com sibilos = asma",
        "identificou gravidade pela SpO2 e dispneia",
        "formulou diagnóstico apropriado",
      ],
      conduta: [
        "iniciou oxigenioterapia imediatamente",
        "administrou SABA (salbutamol)",
        "administrou corticosteroide sistêmico",
        "monitorou resposta",
      ],
      soap: [
        "registrou história de asma e gatilho",
        "documentou SpO2 baixa e sibilos",
        "reconheceu crise asmática aguda",
        "planejou tratamento emergencial",
      ],
    },

    diagnosticoCorreto: "Asma Aguda",
  },

  {
    // ====== CASO 4: SCA - ANGINA TÍPICA ======
    id: "4",
    titulo: "Dor Torácica - Angina Típica",
    sistema: "Cardiovascular",
    tema: "Dor Torácica",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Reconhecer angina estável, investigar fatores de risco cardiovascular e estabelecer conduta conservadora",

    dados_visiveis_ao_estudante: {
      nome_paciente: "João Oliveira",
      idade: 58,
      sexo: "Masculino",
      queixa_principal: "Dor no peito aos esforços",
      historia_breve: "Sente aperto no peito quando caminha rápido ou sobe escadas, passa em repouso",
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

    descricaoBreve: "Paciente com dor precordial reproduzível ao esforço, alívio com repouso",
    categoria: "SCA",
    paciente: {
      id: "pac-004",
      nome: "João Oliveira",
      idade: 58,
      sexo: "M",
      queixaPrincipal: "Dor no peito aos esforços",
      historicoDoenca: "Sente aperto no peito quando caminha rápido ou sobe escadas, passa em repouso",
      antecedentes: ["Hipertensão", "Dislipidemia", "Histórico familiar positivo para infarto"],
      profissao: "Advogado",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: ["Losartana 50mg", "Atorvastatina 20mg"],
    },

    respostas_do_paciente: {
      inicial: "Doutor, tô sentindo um aperto no peito quando faço esforço.",
      dor: "Aqui no meio do peito, tipo uma banda apertando.",
      intensidade: "De 6 a 7, bem incômodo.",
      inicio: "Começou umas 3 semanas atrás, quando subo escada.",
      duracao: "Passa em uns 5 minutos quando paro de andar.",
      fatores_piora: "Caminhada rápida, subir escada, emocional.",
      fatores_melhora: "Repouso, ficar sentado tranquilo.",
      suor: "Não, não sou de suar.",
      respiracao: "Um pouco, fico cansado.",
    },
    respostaPaciente: {
      inicial: "Doutor, tô sentindo um aperto no peito quando faço esforço.",
      dor: "Aqui no meio do peito, tipo uma banda apertando.",
      intensidade: "De 6 a 7, bem incômodo.",
      inicio: "Começou umas 3 semanas atrás, quando subo escada.",
      duracao: "Passa em uns 5 minutos quando paro de andar.",
      fatores_piora: "Caminhada rápida, subir escada, emocional.",
      fatores_melhora: "Repouso, ficar sentado tranquilo.",
      suor: "Não, não sou de suar.",
      respiracao: "Um pouco, fico cansado.",
    },

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
        inspecao: "Paciente calmo, sem desconforto aparente no momento, normocolorado",
        palpacao: "Ictus cordis não desviado, pulsos simétricos e amplos",
        ausculta: "Ritmo cardíaco regular, sem sopros, sem atrito",
        percussao: "Normal",
        observacoes: "Exame cardiovascular normal no repouso, história muito sugestiva de angina estável",
        regiao: "Precórdio",
        achados_positivos: ["Fatores de risco cardiovascular presentes"],
        achados_negativos: ["Sopros", "Alterações em repouso"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Paciente calmo, sem desconforto aparente",
      palpacao: "Ictus cordis não desviado, pulsos simétricos",
      ausculta: "Ritmo cardíaco regular, sem sopros",
      percussao: "Normal",
      observacoes: "Exame cardiovascular normal no repouso",
    },

    exames_complementares_disponiveis: [
      {
        nome: "ECG em repouso",
        descricao: "12 derivações",
        resultado: "Normal",
        valor_referencia: "Normal",
        interpretacao: "ECG basal normal, não afasta angina estável",
      },
      {
        nome: "ECG sob esforço",
        descricao: "Teste ergométrico",
        resultado: "Infradesnível de ST em V4-V5 com dor",
        valor_referencia: "Normal",
        interpretacao: "Positividade para isquemia miocárdica",
      },
      {
        nome: "Troponina I",
        descricao: "Biomarcador cardíaco",
        resultado: "<0.04 ng/mL",
        valor_referencia: "<0.04 ng/mL",
        interpretacao: "Negativa - sem infarto agudo",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Angina Estável",
        probabilidade: 85,
        criterios_minimos: [
          "Dor precordial ao esforço",
          "Duração 2-10 minutos",
          "Alívio com repouso",
          "ECG com isquemia ao esforço",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Refluxo Gastroesofágico",
        criterios_exclusao: ["Dor ao esforço típica"],
        achados_que_descartam: ["Teste ergométrico positivo para isquemia"],
      },
    ],
    examesIndicados: [
      "ECG basal",
      "Teste ergométrico",
      "Troponina",
      "Perfil lipídico",
    ],

    conduta_esperada: {
      imediata: [
        "Prescrever betabloqueador ou bloqueador de cálcio",
        "Nitroglicerina SL para crises",
        "Asparina 100mg/dia",
      ],
      curto_prazo: [
        "Investigar com teste ergométrico",
        "Considerar cateterismo se esforço limitante",
      ],
      longo_prazo: [
        "Modificação de fatores de risco",
        "Reabilitação cardiovascular",
        "Seguimento cardiológico",
      ],
      encaminhamentos: ["Cardiologia"],
    },
    condutaCorreta: "Prescrever betabloqueador, nitrato para crise, aspirina, modificar fatores de risco",

    criterios_de_gravidade: [
      {
        severidade: "leve",
        sinais: ["Dor ao esforço", "ECG positivo ao esforço"],
        descricao: "Angina estável com esforço significativo",
        recomendacao: "Tratamento conservador com investigação para revascularização",
      },
    ],

    erros_criticos: [
      {
        erro: "Não investigar com teste ergométrico",
        descricao: "ECG em repouso pode ser normal em angina estável",
        penalidade: 1.5,
        evitavel: true,
      },
      {
        erro: "Não prescrever terapia antiagregante",
        descricao: "Aspirina reduz risco de infarto em pacientes com angina",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou relação com esforço e repouso", realizado: false, critico: true },
      { item: "Mediu sinais vitais completos", realizado: false, critico: true },
      { item: "Realizou ausculta cardíaca completa", realizado: false, critico: true },
      { item: "Solicitou ECG basal", realizado: false, critico: true },
      { item: "Indicou teste ergométrico", realizado: false, critico: true },
      { item: "Prescreveu betabloqueador", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Diagnóstico Diferencial",
        peso: 20,
        descricao: "Distinção entre angina estável e instável",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Estratificação de Risco",
        peso: 20,
        descricao: "Identificação correta de fatores de risco",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Terapia",
        peso: 30,
        descricao: "Prescrição de betabloqueador e nitrato",
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
          "Fatores de risco cardiovascular",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Sinais vitais completos",
          "Exame cardiovascular",
          "ECG basal",
          "Teste ergométrico",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "Diagnóstico: Angina estável",
          "Classificação de risco",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Betabloqueador",
          "Nitrato",
          "Aspirina",
          "Modificação de fatores de risco",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Investigou fatores de risco cardiovascular",
        "Solicitou ECG e teste ergométrico",
        "Prescreveu betabloqueador",
        "Indicou nitroglicerina",
      ],
      erros_comuns: [
        "Não usar betabloqueador",
        "Ignorar a relação com esforço",
        "Não encaminhar para cardiologia",
      ],
      orientacoes_pedagogicas: [
        "Angina estável é previsível, relacionada a esforço",
        "ECG em repouso pode ser normal",
        "Teste ergométrico é fundamental para diagnóstico",
        "Betabloqueador é primeira linha de tratamento",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer:
        "Diferenciar angina estável de instável: padrão previsível relacionado a esforço, alívio com repouso/nitroglicerina. ECG em repouso pode ser normal. Solicit teste ergométrico. Iniciar betabloqueador. Encaminhar para cardiologia para teste de isquemia.",
      comunicacao: [
        "se apresentou e tranquilizou o paciente",
        "perguntou detalhes sobre a dor",
        "explicou próximos passos",
      ],
      anamnese: [
        "investigou relação com esforço",
        "perguntou sobre duração dos episódios",
        "investigou alívio com repouso/nitroglicerina",
        "perguntou sobre fatores de risco cardiovascular",
      ],
      exame_fisico: [
        "solicitou sinais vitais",
        "realizou ausculta cardíaca",
        "avaliou perfusão",
      ],
      exames_complementares: [
        "solicitou ECG em repouso",
        "solicitou teste ergométrico",
        "solicitou marcadores cardíacos",
      ],
      raciocinio: [
        "reconheceu padrão de angina estável",
        "diferenciou de infarto (sem troponina elevada)",
        "formulou diagnóstico apropriado",
      ],
      conduta: [
        "iniciou betabloqueador",
        "prescreveu nitroglicerina SOS",
        "encaminhou para cardiologia",
        "instruiu sobre quando procurar emergência",
      ],
      soap: [
        "registrou dor relacionada a esforço",
        "documentou ECG de repouso",
        "reconheceu angina estável",
        "planejou investigação com teste de isquemia",
      ],
    },

    diagnosticoCorreto: "Angina Estável",
  },

  {
    // ====== CASO 5: HAS - HIPERTENSÃO ESTÁGIO 1 ======
    id: "5",
    titulo: "Hipertensão Arterial Sistêmica",
    sistema: "Cardiovascular",
    tema: "Hipertensão",
    nivel: "iniciante",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 10,
    objetivo_pedagogico: "Diagnosticar HAS, avaliar lesões em órgão-alvo e estabelecer terapia anti-hipertensiva",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Maria Santos",
      idade: 52,
      sexo: "Feminino",
      queixa_principal: "Dor de cabeça e fraqueza",
      historia_breve: "Vem sentindo mal-estar há alguns meses, com dor de cabeça recorrente",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Hipertensão Arterial Sistêmica Estágio 1",
      diagnosticos_diferenciais: [
        "HAS Estágio 2",
        "Crise Hipertensiva",
        "Preeclâmpsia",
        "Feocromocitoma",
      ],
      sindromes_associadas: ["Síndrome Metabólica"],
    },

    descricaoBreve: "Paciente com pressão arterial elevada e fatores de risco metabólicos",
    categoria: "HAS",
    paciente: {
      id: "pac-005",
      nome: "Maria Santos",
      idade: 52,
      sexo: "F",
      queixaPrincipal: "Dor de cabeça e fraqueza",
      historicoDoenca: "Mal-estar há alguns meses com dor de cabeça recorrente",
      antecedentes: ["Obesidade", "Diabetes tipo 2", "Dislipidemia"],
      profissao: "Comerciante",
      estado_civil: "Viúva",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Doutora, tô com uma dor de cabeça constante, fico fraca.",
      cefaleia: "Dói aqui em cima, tipo um aperto, o dia inteiro.",
      visao: "Sim, às vezes vejo umas bolinhas na frente dos olhos.",
      tontura: "Bastante, isso me preocupa.",
      zumbido: "Tenho sim, um zumbido chato no ouvido.",
      sangue_nariz: "Não tive não, mas tava com pressão alta no ano passado.",
      alimentacao: "Como bastante sal mesmo, gosto de comida temperada.",
      atividade_fisica: "Trabalho no comércio, fico em pé o tempo todo.",
      peso: "Sempre fui de peso, tem uns anos que não emagreço.",
    },
    respostaPaciente: {
      inicial: "Doutora, tô com uma dor de cabeça constante, fico fraca.",
      cefaleia: "Dói aqui em cima, tipo um aperto, o dia inteiro.",
      visao: "Sim, às vezes vejo umas bolinhas na frente dos olhos.",
      tontura: "Bastante, isso me preocupa.",
      zumbido: "Tenho sim, um zumbido chato no ouvido.",
      sangue_nariz: "Não tive não, mas tava com pressão alta no ano passado.",
      alimentacao: "Como bastante sal mesmo, gosto de comida temperada.",
      atividade_fisica: "Trabalho no comércio, fico em pé o tempo todo.",
      peso: "Sempre fui de peso, tem uns anos que não emagreço.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "160/100 mmHg",
        frequenciaCardiaca: 88,
        frequenciaRespiratoria: 18,
        temperatura: 36.9,
        saturacaoOxigenio: 97,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "160/100 mmHg",
      frequenciaCardiaca: 88,
      frequenciaRespiratoria: 18,
      temperatura: 36.9,
      saturacaoOxigenio: 97,
      glicemia: 115,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente obesa, sem sinais de desconforto agudo, normocolorada",
        palpacao: "Ictus cordis não desviado, pulsos braquial e femoral simétricos",
        ausculta: "Ritmo cardíaco regular, sem sopros, sem B3, sem estertores",
        percussao: "Normal",
        observacoes: "Sem sinais de descompensação cardíaca ou edema periférico",
        regiao: "Precórdio",
        achados_positivos: ["IMC elevado"],
        achados_negativos: ["Edema", "Sopros", "B3"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Paciente obesa, sem sinais de desconforto",
      palpacao: "Ictus cordis não desviado, pulsos simétricos",
      ausculta: "Ritmo cardíaco regular, sem sopros",
      percussao: "Normal",
      observacoes: "Sem sinais de descompensação",
    },

    exames_complementares_disponiveis: [
      {
        nome: "ECG",
        descricao: "12 derivações",
        resultado: "Sem alterações agudas, possível hipertrofia ventricular esquerda",
        valor_referencia: "Normal",
        interpretacao: "Compatível com HAS crônica",
      },
      {
        nome: "Hemograma",
        descricao: "Série de glóbulos",
        resultado: "Normal",
        valor_referencia: "Normal",
        interpretacao: "Sem anemia",
      },
      {
        nome: "Glicemia de jejum",
        descricao: "Metabolismo de glicose",
        resultado: "128 mg/dL",
        valor_referencia: "<100 mg/dL",
        interpretacao: "Elevada, compatível com DM2",
      },
      {
        nome: "Creatinina e Ureia",
        descricao: "Função renal",
        resultado: "Creatinina 1.0 mg/dL, Ureia 35 mg/dL",
        valor_referencia: "Creatinina 0.6-1.2, Ureia 10-50",
        interpretacao: "Normal, sem lesão renal aguda",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Hipertensão Arterial Sistêmica Estágio 1",
        probabilidade: 90,
        criterios_minimos: [
          "PA sistólica 140-159 mmHg",
          "PA diastólica 90-99 mmHg",
          "Sintomas associados",
          "Fatores de risco",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "HAS Secundária",
        criterios_exclusao: ["História típica de HAS primária"],
        achados_que_descartam: ["Ausência de sinais de doença secundária"],
      },
    ],
    examesIndicados: ["ECG", "Hemograma", "Glicemia", "Creatinina", "Perfil lipídico"],

    conduta_esperada: {
      imediata: [
        "Orientar redução de sal (máximo 6g/dia)",
        "Recomendação de perda de peso",
        "Atividade física regular",
      ],
      curto_prazo: [
        "Iniciar terapia anti-hipertensiva: ACE inibidor ou bloqueador de cálcio",
        "Repetir medidas de PA após 4 semanas",
      ],
      longo_prazo: [
        "Monitorização de órgãos-alvo (coração, rim, cérebro)",
        "Controle de fatores de risco associados",
      ],
      encaminhamentos: ["Nutrição para orientação dietética"],
    },
    condutaCorreta:
      "Iniciação de anti-hipertensivo, orientação dietética, atividade física, avaliação de órgãos-alvo",

    criterios_de_gravidade: [
      {
        severidade: "leve",
        sinais: ["PA 160/100", "Sem sintomas agudos"],
        descricao: "HAS estágio 1 sem descompensação",
        recomendacao: "Terapia anti-hipertensiva iniciar por mudanças comportamentais",
      },
    ],

    erros_criticos: [
      {
        erro: "Não solicitar ECG",
        descricao: "ECG pode evidenciar hipertrofia ventricular ou isquemia",
        penalidade: 1,
        evitavel: true,
      },
      {
        erro: "Iniciar múltiplas drogas sem tentar monoterapia",
        descricao: "Sempre iniciar com monoterapia em HAS estágio 1",
        penalidade: 1.5,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou sintomas de alerta (cefaleia, tontura)", realizado: false, critico: true },
      { item: "Mediu PA corretamente bilateralmente", realizado: false, critico: true },
      { item: "Solicitou ECG", realizado: false, critico: true },
      { item: "Solicitou exames renais", realizado: false, critico: true },
      { item: "Orientou redução de sal e perda de peso", realizado: false, critico: true },
      { item: "Prescreveu anti-hipertensivo apropriado", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Avaliação de Órgãos-Alvo",
        peso: 20,
        descricao: "Investigação de lesão em coração e rim",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Orientação Comportamental",
        peso: 20,
        descricao: "Orientação sobre sal, peso e atividade",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Terapia Farmacológica",
        peso: 30,
        descricao: "Seleção correta de anti-hipertensivo",
        pontuacao_maxima: 30,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Cefaleia, tontura, zumbido",
          "Fatores de risco: obesidade, DM2",
          "Hábitos de vida",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Pressão arterial bilateral",
          "Exame cardiovascular",
          "ECG",
          "Exames renais",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["HAS Estágio 1", "Avaliação de órgãos-alvo"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Anti-hipertensivo",
          "Orientação dietética",
          "Atividade física",
          "Seguimento",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Investigou sintomatologia característica",
        "Mediu PA bilateralmente",
        "Solicitou ECG e exames renais",
        "Prescreveu anti-hipertensivo",
        "Orientou modificação de hábitos",
      ],
      erros_comuns: [
        "Prescrever múltiplas drogas imediatamente",
        "Não investigar sintomas de alerta",
        "Não solicitar exames complementares",
      ],
      orientacoes_pedagogicas: [
        "HAS primária é diagnóstico de exclusão",
        "Sempre avalie órgãos-alvo",
        "Monoterapia é primeira linha",
        "Mudanças comportamentais são fundamentais",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer:
        "Avaliação completa de HAS: confirmar diagnóstico com múltiplas aferições, excluir HAS secundária, avaliar órgãos-alvo (coração, rins, cérebro), dar orientações sobre estilo de vida ANTES de medicar, iniciar monoterapia se necessário. Não esquecer orientação não-farmacológica.",
      comunicacao: [
        "explicou o diagnóstico de forma clara",
        "não assustou desnecessariamente",
        "deu orientações sobre prevenção",
        "explicou importância do seguimento",
      ],
      anamnese: [
        "investigou fatores de risco (tabagismo, álcool, stress)",
        "perguntou sobre história familiar",
        "investigou síntomas de lesão de órgão-alvo",
        "perguntou sobre adesão a tratamentos prévios",
      ],
      exame_fisico: [
        "aferiu pressão arterial corretamente",
        "realizou ausculta cardíaca",
        "avaliou presença de edema",
        "pesquisou outros sinais de gravidade",
      ],
      exames_complementares: [
        "solicitou eletrocardiograma",
        "solicitou função renal (creatinina)",
        "solicitou eletrólitos",
        "solicitou perfil lipídico",
      ],
      raciocinio: [
        "reconheceu HAS estágio 1",
        "investigou órgãos-alvo apropriadamente",
        "avaliou risco cardiovascular global",
      ],
      conduta: [
        "orientou mudanças de estilo de vida PRIMEIRO",
        "iniciou monoterapia se indicado",
        "encaminhou para seguimento",
        "instruiu sobre quando procurar emergência",
      ],
      soap: [
        "documentou múltiplas aferições de PA",
        "registrou ausência de sintomas de órgão-alvo neste caso",
        "reconheceu HAS estágio 1",
        "planejou abordagem terapêutica apropriada",
      ],
    },

    diagnosticoCorreto: "Hipertensão Arterial Sistêmica Estágio 1",
  },

  {
    // ====== CASO 6: PNEUMONIA ATÍPICA ======
    id: "6",
    titulo: "Pneumonia Atípica",
    sistema: "Respiratório",
    tema: "Infecção Respiratória",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Diferenciar pneumonia atípica de pneumonia típica e prescrever antibióticoterapia apropriada",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Pedro Costa",
      idade: 35,
      sexo: "Masculino",
      queixa_principal: "Tosse seca persistente há 2 semanas",
      historia_breve: "Tosse seca que piorou progressivamente, febre baixa, mal-estar geral",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Pneumonia Atípica (provavelmente Mycoplasma pneumoniae)",
      diagnosticos_diferenciais: [
        "Bronquite Aguda",
        "Tuberculose",
        "Pneumonia Viral",
        "Refluxo Gastroesofágico com tosse",
      ],
      sindromes_associadas: ["Infecção de Trato Respiratório"],
    },

    descricaoBreve: "Paciente com tosse seca prolongada, febre baixa, infiltrado intersticial em RX",
    categoria: "Pneumonia",
    paciente: {
      id: "pac-006",
      nome: "Pedro Costa",
      idade: 35,
      sexo: "M",
      queixaPrincipal: "Tosse seca persistente há 2 semanas",
      historicoDoenca: "Tosse seca que piorou progressivamente, febre baixa, mal-estar",
      antecedentes: ["Sem antecedentes relevantes"],
      profissao: "Analista de sistemas",
      estado_civil: "Solteiro",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Doutor, tô com essa tosse chata que não melhora.",
      tosse: "É seca mesmo, não sai catarro nenhum.",
      inicio: "Começou umas 2 semanas atrás, tava gripado.",
      febre: "Tenho uma febrinha, nada muito alto, umas 37-38 graus.",
      respiracao: "Um pouco, fico cansado ao caminar.",
      dor_peito: "Sinto um incômodo no peito quando respiro fundo.",
      corpo_dói: "Sim, dói o corpo todo, tipo uma mialgia.",
      outro_sintoma: "Fico fraco, sem energia mesmo.",
      tratamento: "Tomei uns xarope e nada ajuda muito.",
    },
    respostaPaciente: {
      inicial: "Doutor, tô com essa tosse chata que não melhora.",
      tosse: "É seca mesmo, não sai catarro nenhum.",
      inicio: "Começou umas 2 semanas atrás, tava gripado.",
      febre: "Tenho uma febrinha, nada muito alto, umas 37-38 graus.",
      respiracao: "Um pouco, fico cansado ao caminar.",
      dor_peito: "Sinto um incômodo no peito quando respiro fundo.",
      corpo_dói: "Sim, dói o corpo todo, tipo uma mialgia.",
      outro_sintoma: "Fico fraco, sem energia mesmo.",
      tratamento: "Tomei uns xarope e nada ajuda muito.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "125/80 mmHg",
        frequenciaCardiaca: 95,
        frequenciaRespiratoria: 22,
        temperatura: 37.8,
        saturacaoOxigenio: 94,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "125/80 mmHg",
      frequenciaCardiaca: 95,
      frequenciaRespiratoria: 22,
      temperatura: 37.8,
      saturacaoOxigenio: 94,
      glicemia: 125,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente febril, tosse ocasional, sem desconforto respiratório grave",
        palpacao: "Expansão torácica simétrica",
        ausculta: "Murmúrio vesicular presente bilateralmente, ocasional ronco localizado",
        percussao: "Normal",
        observacoes:
          "Ausência de crepitações consolidativas, achados compatíveis com infecção viral/atípica",
        regiao: "Pulmões",
        achados_positivos: ["Febre", "Tosse seca", "Mialgia"],
        achados_negativos: ["Crepitações", "Consolidação"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Paciente febril, tosse ocasional",
      palpacao: "Expansão torácica simétrica",
      ausculta: "Murmúrio vesicular presente, ocasional ronco",
      percussao: "Normal",
      observacoes: "Sem crepitações consolidativas",
    },

    exames_complementares_disponiveis: [
      {
        nome: "Radiografia de Tórax PA e Perfil",
        descricao: "Avaliação pulmonar",
        resultado: "Infiltrado intersticial bilateral, predomínio peri-hilar",
        valor_referencia: "Sem infiltrados",
        interpretacao: "Compatível com pneumonia atípica/viral",
      },
      {
        nome: "Hemograma Completo",
        descricao: "Série de glóbulos",
        resultado: "Leucócitos 9.500/mm³, linfócitos aumentados",
        valor_referencia: "4.500-11.000/mm³",
        interpretacao: "Leve elevação com padrão viral/atípico",
      },
      {
        nome: "PCR (Proteína C Reativa)",
        descricao: "Marcador inflamatório",
        resultado: "Elevada",
        valor_referencia: "<3 mg/dL",
        interpretacao: "Inflamação presente",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Pneumonia Atípica",
        probabilidade: 80,
        criterios_minimos: [
          "Tosse seca persistente",
          "Febre baixa",
          "Infiltrado intersticial em RX",
          "Ausência de consolidação lobar",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Pneumonia Bacteriana Típica",
        criterios_exclusao: ["Ausência de consolidação lobar"],
        achados_que_descartam: ["Infiltrado intersticial, não lobar"],
      },
    ],
    examesIndicados: [
      "Raio X de tórax PA e perfil",
      "Hemograma",
      "PCR",
      "Sorologia para Mycoplasma se disponível",
    ],

    conduta_esperada: {
      imediata: [
        "Prescrever macrolídeo (azitromicina) ou tetraciclina",
        "Orientar repouso",
        "Hidratação adequada",
      ],
      curto_prazo: [
        "Monitorização de sintomas",
        "Avaliação após 1-2 semanas",
        "Raio X de controle se necessário",
      ],
      longo_prazo: ["Seguimento para resolução", "Investigação se não melhorar"],
      encaminhamentos: ["Pneumologia se sintomas persistirem"],
    },
    condutaCorreta:
      "Prescrever macrolídeo (azitromicina), hidratação, repouso, raio X de tórax para investigação",

    criterios_de_gravidade: [
      {
        severidade: "leve",
        sinais: ["Febre <39°C", "SpO2 >94%", "FR 20-24"],
        descricao: "Pneumonia atípica sem sinais de gravidade",
        recomendacao: "Tratamento ambulatorial com seguimento",
      },
    ],

    erros_criticos: [
      {
        erro: "Prescrever betalactâmico (penicilina) para pneumonia atípica",
        descricao: "Mycoplasma é resistente a betalactâmicos, usar macrolídeo",
        penalidade: 2,
        evitavel: true,
      },
      {
        erro: "Não solicitar RX de tórax",
        descricao: "RX é essencial para diferenciar atípica de típica",
        penalidade: 1.5,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Caracterizou a tosse (seca vs produtiva)", realizado: false, critico: true },
      { item: "Perguntou sobre febre", realizado: false, critico: true },
      { item: "Mediu sinais vitais completos", realizado: false, critico: true },
      { item: "Realizou ausculta pulmonar", realizado: false, critico: true },
      { item: "Solicitou radiografia de tórax", realizado: false, critico: true },
      { item: "Prescreveu macrolídeo", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Diagnóstico Diferencial",
        peso: 20,
        descricao: "Diferenciação entre atípica e típica",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Exames Complementares",
        peso: 20,
        descricao: "Interpretação correta de RX intersticial",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Antibióticoterapia",
        peso: 30,
        descricao: "Prescrição de macrolídeo",
        pontuacao_maxima: 30,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Tosse seca prolongada",
          "Febre baixa",
          "Mialgia",
          "Exposição a vírus",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Sinais vitais",
          "Ausculta: sem crepitações",
          "RX: infiltrado intersticial",
          "Hemograma com padrão viral",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Pneumonia atípica", "Sem sinais de gravidade"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Macrolídeo", "Hidratação", "Repouso", "Seguimento"],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu padrão de tosse seca prolongada",
        "Solicitou RX e viu infiltrado intersticial",
        "Prescreveu macrolídeo",
        "Orientou repouso e hidratação",
      ],
      erros_comuns: [
        "Prescrever penicilina",
        "Não diferenciar padrão de RX",
        "Não investigar adequadamente",
      ],
      orientacoes_pedagogicas: [
        "Pneumonia atípica: tosse seca, febre baixa, mialgia",
        "RX: infiltrado intersticial, não lobar",
        "Ausência de crepitações consolidativas",
        "Macrolídeo é a droga de escolha",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer:
        "Reconhecer pneumonia atípica: história com tosse persistente, febre baixa, RX com infiltrado intersticial (não lobar consolidado), ausência de crepitações consolidativas. Prescrever macrolídeo, não penicilina. Investigação apropriada com história e RX.",
      comunicacao: [
        "explicou diferença entre pneumonia típica e atípica",
        "tranquilizou paciente sobre prognóstico",
        "explicou por que RX é importante",
      ],
      anamnese: [
        "investigou duração prolongada da tosse",
        "perguntou sobre natureza da tosse (seca vs produtiva)",
        "investigou febre baixa prolongada",
        "perguntou sobre contatos com doenças",
      ],
      exame_fisico: [
        "solicitou sinais vitais",
        "ausculta pulmonar à procura de crepitações",
        "avaliou padrão respiratório",
      ],
      exames_complementares: [
        "solicitou radiografia de tórax",
        "solicitou hemograma",
        "considerou sorologia se indicado",
      ],
      raciocinio: [
        "integrou história + ausculta + padrão RX",
        "reconheceu padrão de pneumonia atípica",
        "diferenciou de pneumonia bacteriana típica",
      ],
      conduta: [
        "prescreveu macrolídeo apropriadamente",
        "NÃO prescreveu penicilina",
        "deu orientações de seguimento",
      ],
      soap: [
        "documentou tosse seca prolongada",
        "registrou febre baixa",
        "reconheceu padrão intersticial no RX",
        "planejou antibioticoterapia com macrolídeo",
      ],
    },

    diagnosticoCorreto: "Pneumonia Atípica",
  },

  {
    // ====== CASO 7: PERICARDITE AGUDA ======
    id: "7",
    titulo: "Pericardite Aguda",
    sistema: "Cardiovascular",
    tema: "Dor Torácica",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Diagnosticar pericardite aguda e diferenciar de infarto do miocárdio",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Lucas Ferreira",
      idade: 34,
      sexo: "Masculino",
      queixa_principal: "Dor no peito que piora ao respirar",
      historia_breve: "Começou com infecção viral há uma semana, agora com dor ao respirar",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Pericardite Aguda",
      diagnosticos_diferenciais: [
        "Infarto Agudo do Miocárdio",
        "Pleuresia",
        "Pneumonia",
        "Espasmo Esofágico",
      ],
      sindromes_associadas: ["Síndrome pericárdica"],
    },

    descricaoBreve: "Paciente com dor pleurítica, febre, antecedente de infecção viral",
    categoria: "Pericardite",
    paciente: {
      id: "pac-007",
      nome: "Lucas Ferreira",
      idade: 34,
      sexo: "M",
      queixaPrincipal: "Dor no peito que piora ao respirar",
      historicoDoenca: "Infecção viral uma semana atrás, agora com dor ao respirar",
      antecedentes: ["Sem antecedentes relevantes"],
      profissao: "Professor",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Doutor, tenho uma dor no peito que piora quando respiro fundo.",
      dor: "Aqui no meio do peito, tipo uma pontada.",
      intensidade: "7 a 8, bem incômodo.",
      respiracao: "Piora muito quando respiro fundo ou tosse.",
      posicao: "Fico mais confortável sentado e inclinado para frente.",
      febre: "Tive febre há uma semana, agora melhorou.",
      infeccao: "Peguei um resfriado viral há uma semana.",
      duracao: "Começou ontem, contínua.",
      outro: "Fico um pouco cansado.",
    },
    respostaPaciente: {
      inicial: "Doutor, tenho uma dor no peito que piora quando respiro fundo.",
      dor: "Aqui no meio do peito, tipo uma pontada.",
      intensidade: "7 a 8, bem incômodo.",
      respiracao: "Piora muito quando respiro fundo ou tosse.",
      posicao: "Fico mais confortável sentado e inclinado para frente.",
      febre: "Tive febre há uma semana, agora melhorou.",
      infeccao: "Peguei um resfriado viral há uma semana.",
      duracao: "Começou ontem, contínua.",
      outro: "Fico um pouco cansado.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "125/80 mmHg",
        frequenciaCardiaca: 95,
        frequenciaRespiratoria: 20,
        temperatura: 37.5,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "125/80 mmHg",
      frequenciaCardiaca: 95,
      frequenciaRespiratoria: 20,
      temperatura: 37.5,
      saturacaoOxigenio: 98,
      glicemia: 108,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente em desconforto ao respirar fundo, senta inclinado para frente",
        palpacao: "Ictus cordis não desviado, sem alterações palpáveis",
        ausculta: "Atrito pericárdico em foco apical (som de couro novo), ritmo regular",
        percussao: "Normal",
        observacoes: "Achado clássico: atrito pericárdico, piora com respiração profunda",
        regiao: "Precórdio",
        achados_positivos: ["Atrito pericárdico", "Dor pleurítica"],
        achados_negativos: ["Sopros", "B3", "Desvio de ictus"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Paciente em desconforto ao respirar, posição sentada inclinada",
      palpacao: "Ictus cordis não desviado",
      ausculta: "Atrito pericárdico em foco apical",
      percussao: "Normal",
      observacoes: "Achado clássico: atrito pericárdico",
    },

    exames_complementares_disponiveis: [
      {
        nome: "ECG",
        descricao: "12 derivações",
        resultado: "Elevação difusa de ST com concavidade, sem ondas Q patológicas",
        valor_referencia: "Normal",
        interpretacao: "Padrão típico de pericardite aguda",
      },
      {
        nome: "Troponina I",
        descricao: "Biomarcador cardíaco",
        resultado: "<0.04 ng/mL",
        valor_referencia: "<0.04 ng/mL",
        interpretacao: "Negativa - sem infarto",
      },
      {
        nome: "PCR (Proteína C Reativa)",
        descricao: "Marcador inflamatório",
        resultado: "Elevada 8 mg/dL",
        valor_referencia: "<3 mg/dL",
        interpretacao: "Inflamação presente",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Pericardite Aguda",
        probabilidade: 90,
        criterios_minimos: [
          "Dor pleurítica",
          "Antecedente viral",
          "Atrito pericárdico",
          "ECG com ST elevado difuso",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Infarto Agudo do Miocárdio",
        criterios_exclusao: ["Elevação difusa de ST sem ondas Q"],
        achados_que_descartam: ["Troponina negativa", "Atrito pericárdico"],
      },
    ],
    examesIndicados: [
      "ECG seriados",
      "Troponina",
      "PCR",
      "Ecocardiograma para descartar derrame",
    ],

    conduta_esperada: {
      imediata: [
        "Anti-inflamatório: Ibuprofeno ou Indomentacina",
        "Colchicina em alguns casos",
        "Repouso relativo",
      ],
      curto_prazo: ["Ecocardiograma para avaliar derrame", "ECG seriados"],
      longo_prazo: [
        "Seguimento clínico",
        "Investigação de etiologia se persistir",
      ],
      encaminhamentos: ["Cardiologia se complicações"],
    },
    condutaCorreta:
      "Anti-inflamatório (Ibuprofeno), colchicina, repouso, monitorização com ECG seriados",

    criterios_de_gravidade: [
      {
        severidade: "leve",
        sinais: ["Dor ao respirar", "Sem derrame"],
        descricao: "Pericardite aguda sem complicações",
        recomendacao: "Tratamento com AINE e colchicina",
      },
      {
        severidade: "moderada",
        sinais: ["Derrame pericárdico presente"],
        descricao: "Pericardite com efusão",
        recomendacao: "AINE, colchicina, avaliação cardíaca frequente",
      },
    ],

    erros_criticos: [
      {
        erro: "Confundir com infarto e prescrever antiagregante/anticoagulante",
        descricao: "Verificar troponina e padrão de ST antes de iniciar terapia",
        penalidade: 2.5,
        evitavel: true,
      },
      {
        erro: "Não solicitar ECG",
        descricao: "ECG é essencial para diagnóstico diferencial com IAM",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou relação com respiração e posição", realizado: false, critico: true },
      { item: "Perguntou sobre infecção viral prévia", realizado: false, critico: true },
      { item: "Mediu sinais vitais", realizado: false, critico: true },
      { item: "Ausculta: buscou atrito pericárdico", realizado: false, critico: true },
      { item: "Solicitou ECG", realizado: false, critico: true },
      { item: "Solicitou troponina", realizado: false, critico: true },
      { item: "Prescreveu AINE", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Diagnóstico Diferencial",
        peso: 25,
        descricao: "Diferenciação com IAM",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Achados Clínicos",
        peso: 20,
        descricao: "Reconhecimento de atrito e dor pleurítica",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Terapia",
        peso: 25,
        descricao: "Prescrição de AINE e colchicina",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Dor pleurítica",
          "Antecedente viral",
          "Piora com respiração",
          "Melhora com flexão anterior",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Sinais vitais",
          "Atrito pericárdico",
          "ECG com ST elevado difuso",
          "Troponina negativa",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Pericardite aguda", "Sem sinais de tamponamento"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "AINE",
          "Colchicina",
          "Repouso",
          "Ecocardiograma",
          "ECG seriados",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu padrão de dor pleurítica",
        "Investigou infecção viral prévia",
        "Solicitou ECG e troponina",
        "Identificou atrito pericárdico",
        "Prescreveu AINE apropriadamente",
      ],
      erros_comuns: [
        "Confundir com infarto",
        "Prescrever aspirina desnecessariamente",
        "Não investigar derrame",
      ],
      orientacoes_pedagogicas: [
        "Pericardite: dor pleurítica, melhora com flexão anterior",
        "Atrito pericárdico é achado clássico",
        "ECG: ST elevado difuso (não localizado como em IAM)",
        "Troponina geralmente negativa",
        "AINE é terapia de primeira linha",
      ],
    },

    diagnosticoCorreto: "Pericardite Aguda",
  },

  {
    // ====== CASO 8: INSUFICIÊNCIA CARDÍACA ESQUERDA ======
    id: "8",
    titulo: "Insuficiência Cardíaca Esquerda",
    sistema: "Cardiovascular",
    tema: "Insuficiência Cardíaca",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Diagnosticar insuficiência cardíaca sistólica e estabelecer terapia descongestiva",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Fernanda Rocha",
      idade: 67,
      sexo: "Feminino",
      queixa_principal: "Falta de ar ao fazer esforços",
      historia_breve: "Sente falta de ar progressiva ao subir escada, acordando à noite com dificuldade respiratória",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Insuficiência Cardíaca Sistólica (FEVE reduzida)",
      diagnosticos_diferenciais: [
        "Asma",
        "DPOC",
        "Pneumonia",
        "Tromboembolismo Pulmonar",
      ],
      sindromes_associadas: ["Síndrome de congestão pulmonar"],
    },

    descricaoBreve: "Paciente com dispneia ao esforço, ortopneia, crepitações pulmonares",
    categoria: "Insuficiência Cardíaca",
    paciente: {
      id: "pac-008",
      nome: "Fernanda Rocha",
      idade: 67,
      sexo: "F",
      queixaPrincipal: "Falta de ar ao fazer esforços",
      historicoDoenca:
        "Falta de ar progressiva ao subir escada, acordando à noite com dificuldade respiratória",
      antecedentes: ["Hipertensão", "Infarto prévio 5 anos atrás"],
      profissao: "Aposentada",
      estado_civil: "Viúva",
      alergias: [],
      medicamentos_em_uso: ["Losartana 50mg", "Metoprolol 50mg"],
    },

    respostas_do_paciente: {
      inicial: "Doutora, tenho muita falta de ar quando subir escada.",
      dispneia: "Fico muito cansada, antes caminhava mais, agora só consigo andar um pouco.",
      noturna: "Acordo à noite com falta de ar, preciso sentar na cama para respirar.",
      posicao: "Só consigo dormir com vários travesseiros, não consigo ficar deitada.",
      inchaço: "Meus pés incharam, os sapatos não entram.",
      peso: "Aumentei de peso bastante, ganho quilos rápido.",
      cansaco: "Fico muito cansada o tempo todo, nem consigo fazer nada.",
      tosse: "Tenho uma tosse que aparece ao fazer esforço.",
    },
    respostaPaciente: {
      inicial: "Doutora, tenho muita falta de ar quando subir escada.",
      dispneia: "Fico muito cansada, antes caminhava mais, agora só consigo andar um pouco.",
      noturna: "Acordo à noite com falta de ar, preciso sentar na cama para respirar.",
      posicao: "Só consigo dormir com vários travesseiros, não consigo ficar deitada.",
      inchaço: "Meus pés incharam, os sapatos não entram.",
      peso: "Aumentei de peso bastante, ganho quilos rápido.",
      cansaco: "Fico muito cansada o tempo todo, nem consigo fazer nada.",
      tosse: "Tenho uma tosse que aparece ao fazer esforço.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "150/95 mmHg",
        frequenciaCardiaca: 102,
        frequenciaRespiratoria: 28,
        temperatura: 36.8,
        saturacaoOxigenio: 90,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "150/95 mmHg",
      frequenciaCardiaca: 102,
      frequenciaRespiratoria: 28,
      temperatura: 36.8,
      saturacaoOxigenio: 90,
      glicemia: 150,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente taquipneica, com uso de musculatura acessória, palidez ligeira",
        palpacao: "Ictus cordis desviado lateralmente (5º espaço além da linha meioaxilar), frêmito hipercinético",
        ausculta:
          "Taquicardia (110 bpm), sopro sistólico sugestivo de insuficiência mitral funcional, B3 (S3) em ápex, crepitações bibasais",
        percussao: "Macicez em bases (derrame pleural leve)",
        observacoes:
          "Sinais clássicos de IC descompensada: B3, crepitações, desvio de ictus, edema periférico",
        regiao: "Precórdio e pulmões",
        achados_positivos: [
          "B3",
          "Crepitações",
          "Desvio de ictus",
          "Edema periférico",
        ],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Paciente taquipneica, com musculatura acessória",
      palpacao: "Ictus cordis desviado",
      ausculta: "B3, crepitações bibasais, sopro sistólico",
      percussao: "Macicez de bases",
      observacoes: "Sinais de congestão pulmonar e disfunção VE",
    },

    exames_complementares_disponiveis: [
      {
        nome: "ECG",
        descricao: "12 derivações",
        resultado: "Ritmo sinusal, taquicardia, complexo QRS alargado (140ms), onda T negativa em lateral",
        valor_referencia: "Normal",
        interpretacao: "Alterações compatíveis com cardiomiopatia",
      },
      {
        nome: "BNP (B-type Natriuretic Peptide)",
        descricao: "Marcador de insuficiência cardíaca",
        resultado: "850 pg/mL",
        valor_referencia: "<100 pg/mL",
        interpretacao: "Altamente elevado, confirma IC",
      },
      {
        nome: "Ecocardiograma",
        descricao: "Ultrassom cardíaco",
        resultado: "FEVE 28%, acinesia anterior, insuficiência mitral funcional moderada",
        valor_referencia: "FEVE >50%",
        interpretacao: "IC sistólica moderada a grave",
      },
      {
        nome: "Radiografia de Tórax",
        descricao: "PA e perfil",
        resultado: "Cardiomegalia, congestão pulmonar, derrame pleural bilateral leve",
        valor_referencia: "Normal",
        interpretacao: "IC descompensada",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Insuficiência Cardíaca Sistólica",
        probabilidade: 95,
        criterios_minimos: [
          "Dispneia ao esforço e ortopneia",
          "Edema periférico",
          "Crepitações pulmonares",
          "B3",
          "FEVE reduzida",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Asma",
        criterios_exclusao: ["B3 presente"],
        achados_que_descartam: ["Crepitações finas, FEVE reduzida"],
      },
    ],
    examesIndicados: [
      "ECG",
      "Ecocardiograma",
      "BNP",
      "Radiografia de tórax",
      "Hemograma",
      "Função renal",
    ],

    conduta_esperada: {
      imediata: [
        "Diurético intravenoso (Furosemida 40-80mg IV)",
        "Oxigenioterapia",
        "Posição semi-Fowler",
        "Restrição hídrica",
      ],
      curto_prazo: [
        "ACE inibidor ou ARB",
        "Betabloqueador",
        "Repouso no leito inicialmente",
        "Monitorização de eletrólitos",
      ],
      longo_prazo: [
        "Seguimento cardiológico",
        "Reabilitação cardíaca",
        "Considerar ressincronização se QRS >120ms",
      ],
      encaminhamentos: ["Cardiologia", "Insuficiência cardíaca avançada"],
    },
    condutaCorreta:
      "Diurético IV, ACE inibidor, betabloqueador, oxigenio, restrição hídrica, ecocardiograma",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["Ortopneia", "Crepitações", "SpO2 90%"],
        descricao: "IC descompensada com congestão pulmonar",
        recomendacao: "Internação, diurético IV, otimização terapia",
      },
      {
        severidade: "grave",
        sinais: ["SpO2 <90%", "Necessita ventilação", "Choque"],
        descricao: "IC descompensada grave",
        recomendacao: "Internação em UTI, inotrópicos, suporte avançado",
      },
    ],

    erros_criticos: [
      {
        erro: "Não prescrever diurético em IC congestiva",
        descricao: "Diurético é essencial para aliviar congestão",
        penalidade: 2.5,
        evitavel: true,
      },
      {
        erro: "Não solicitar ecocardiograma",
        descricao: "Ecocardiograma confirma diagnóstico e FEVE",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou ortopneia e dispneia noturna", realizado: false, critico: true },
      { item: "Mediu sinais vitais (SpO2, FR)", realizado: false, critico: true },
      { item: "Ausculta: buscou B3 e crepitações", realizado: false, critico: true },
      { item: "Palpou: desvio de ictus", realizado: false, critico: true },
      { item: "Solicitou ECG", realizado: false, critico: true },
      { item: "Solicitou ecocardiograma", realizado: false, critico: true },
      { item: "Prescreveu diurético IV", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de Sinais",
        peso: 20,
        descricao: "B3, crepitações, ortopneia",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Terapia Descongestiva",
        peso: 25,
        descricao: "Prescrição de diurético apropriado",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Avaliação de FEVE",
        peso: 25,
        descricao: "Solicitação e interpretação de ecocardiograma",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Dispneia ao esforço progressiva",
          "Ortopneia",
          "Dispneia paroxística noturna",
          "Edema de MMII",
          "Fatores de risco: HAS, IAM prévio",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Sinais vitais: taquicardia, taquipneia, SpO2 reduzida",
          "Ausculta: B3, crepitações bibasais",
          "Palpação: ictus desviado",
          "Edema periférico",
          "Ecocardiograma: FEVE reduzida",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "IC sistólica com congestão pulmonar",
          "NYHA II-III",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Diurético IV",
          "ACE inibidor",
          "Betabloqueador",
          "Restrição hídrica",
          "Internação e monitorização",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Investigou ortopneia e dispneia noturna",
        "Reconheceu B3 e crepitações",
        "Solicitou ecocardiograma",
        "Iniciou diurético IV",
        "Prescreveu ACE inibidor",
      ],
      erros_comuns: [
        "Confundir com asma",
        "Não prescrever diurético",
        "Não solicitar ecocardiograma",
      ],
      orientacoes_pedagogicas: [
        "IC: dispneia ao esforço + ortopneia + edema",
        "Achados: B3, crepitações, desvio de ictus",
        "Ecocardiograma é essencial para diagnóstico",
        "Diurético + ACE inibidor + betabloqueador",
        "Reabilitação cardíaca é importante",
      ],
    },

    diagnosticoCorreto: "Insuficiência Cardíaca Sistólica",
  },

  {
    // ====== CASO 9: DPOC - DOENÇA PULMONAR OBSTRUTIVA CRÔNICA ======
    id: "9",
    titulo: "DPOC - Exacerbação Aguda",
    sistema: "Respiratório",
    tema: "Dispneia Crônica",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Diagnosticar DPOC em exacerbação e prescrever broncodilatadores e corticosteroide",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Antônio Silva",
      idade: 72,
      sexo: "Masculino",
      queixa_principal: "Falta de ar e tosse com escarro",
      historia_breve: "Tabagista crônico com tosse habitual, piorou nos últimos dias",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "DPOC - Exacerbação Aguda",
      diagnosticos_diferenciais: [
        "Asma",
        "Pneumonia",
        "Insuficiência Cardíaca",
        "TEP",
      ],
      sindromes_associadas: ["Obstrução crônica das vias aéreas"],
    },

    descricaoBreve: "Paciente com tosse crônica produtiva, dispneia progressiva, tabagista",
    categoria: "DPOC",
    paciente: {
      id: "pac-009",
      nome: "Antônio Silva",
      idade: 72,
      sexo: "M",
      queixaPrincipal: "Falta de ar e tosse com escarro",
      historicoDoenca: "Tabagista crônico com tosse habitual, piorou nos últimos dias",
      antecedentes: ["Tabagismo 40 anos (60 maços/ano)", "HAS", "DPOC há 10 anos"],
      profissao: "Aposentado",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: [
        "Salbutamol inalado",
        "Tiotropio",
        "Losartana 50mg",
      ],
    },

    respostas_do_paciente: {
      inicial: "Doutor, tô muito mal, a falta de ar piorou muito.",
      tosse: "Tenho essa tosse toda hora, tá saindo bem amarelado, mais que o de costume.",
      duracao: "Essa tosse tenho faz anos, mas nos últimos dias ficou pior.",
      atividade: "Antes conseguia caminhar um pouco, agora mal consigo ficar em pé.",
      dormir: "Não consigo dormir deitado, tenho que ficar sentado.",
      chiado: "Tenho aquele chiado no peito o tempo todo.",
      fumo: "Fumava 2 maços por dia, parei faz uns anos.",
      ambiente: "Trabalhei em obra por muito tempo, respirava pó o tempo todo.",
    },
    respostaPaciente: {
      inicial: "Doutor, tô muito mal, a falta de ar piorou muito.",
      tosse: "Tenho essa tosse toda hora, tá saindo bem amarelado, mais que o de costume.",
      duracao: "Essa tosse tenho faz anos, mas nos últimos dias ficou pior.",
      atividade: "Antes conseguia caminhar um pouco, agora mal consigo ficar em pé.",
      dormir: "Não consigo dormir deitado, tenho que ficar sentado.",
      chiado: "Tenho aquele chiado no peito o tempo todo.",
      fumo: "Fumava 2 maços por dia, parei faz uns anos.",
      ambiente: "Trabalhei em obra por muito tempo, respirava pó o tempo todo.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "140/85 mmHg",
        frequenciaCardiaca: 105,
        frequenciaRespiratoria: 32,
        temperatura: 37.2,
        saturacaoOxigenio: 85,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "140/85 mmHg",
      frequenciaCardiaca: 105,
      frequenciaRespiratoria: 32,
      temperatura: 37.2,
      saturacaoOxigenio: 85,
      glicemia: 180,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente com tórax em tonel, cianose ligeira, uso acentuado de musculatura acessória",
        palpacao: "Expansão torácica reduzida bilateralmente, frêmito diminuído",
        ausculta:
          "Murmúrio vesicular muito reduzido bilateralmente, sibilos e roncos espalhados",
        percussao: "Hipersonoridade difusa",
        observacoes: "Sinais típicos de DPOC avançada em exacerbação",
        regiao: "Pulmões",
        achados_positivos: [
          "Tórax em tonel",
          "Sibilos",
          "Roncos",
          "Hipersonoridade",
        ],
        achados_negativos: ["Crepitações consolidativas"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Tórax em tonel, cianose ligeira, musculatura acessória ativa",
      palpacao: "Expansão reduzida",
      ausculta: "Murmúrio vesicular reduzido, sibilos e roncos",
      percussao: "Hipersonoridade",
      observacoes: "DPOC avançada",
    },

    exames_complementares_disponiveis: [
      {
        nome: "Radiografia de Tórax PA e Perfil",
        descricao: "Avaliação pulmonar",
        resultado: "Hiperinsuflação pulmonar, aumento do espaço retroesternal, flattening de diafragma",
        valor_referencia: "Normal",
        interpretacao: "DPOC com hiperinsuflação",
      },
      {
        nome: "Hemograma",
        descricao: "Série de glóbulos",
        resultado: "Leucocitose 13.000/mm³, neutrofilia 78%",
        valor_referencia: "4.500-11.000/mm³",
        interpretacao: "Exacerbação infecciosa",
      },
      {
        nome: "Gasometria Arterial",
        descricao: "Avaliação de ventilação",
        resultado: "pH 7.32, pCO2 52, pO2 65 com O2",
        valor_referencia: "pH 7.35-7.45, pCO2 35-45, pO2 >80 com O2",
        interpretacao: "Acidose respiratória leve com hipoxemia",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "DPOC em Exacerbação",
        probabilidade: 90,
        criterios_minimos: [
          "Tosse crônica produtiva",
          "Tabagismo significativo",
          "Dispneia progressiva",
          "Sibilos e roncos",
          "Hipersonoridade",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Asma",
        criterios_exclusao: ["Tabagismo crônico", "Tórax em tonel"],
        achados_que_descartam: ["História de tabagismo, idade"],
      },
    ],
    examesIndicados: [
      "Radiografia de tórax",
      "Hemograma",
      "Gasometria arterial",
      "Espirometria quando estável",
    ],

    conduta_esperada: {
      imediata: [
        "Oxigenioterapia para atingir SpO2 88-92%",
        "Broncodilatadores: salbutamol nebulizado",
        "Corticosteroide sistêmico: prednisona 40-60mg",
      ],
      curto_prazo: [
        "Avaliar necessidade de antibiótico",
        "Monitorização de SpO2 e gasometria",
        "Fisioterapia respiratória",
      ],
      longo_prazo: [
        "Vacinação pneumocócica e influenza",
        "Reabilitação pulmonar",
        "Cessação de tabagismo",
      ],
      encaminhamentos: ["Pneumologia se sintomas persistirem"],
    },
    condutaCorreta:
      "Oxigenioterapia (SpO2 88-92%), salbutamol nebulizado, corticosteroide sistêmico, avaliação de antibiótico",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["SpO2 85-90%", "FR 25-32", "pH 7.30-7.35"],
        descricao: "DPOC em exacerbação moderada",
        recomendacao: "Broncodilatadores, corticosteroide, oxigenio controlado",
      },
      {
        severidade: "grave",
        sinais: ["SpO2 <85%", "FR >35", "Acidose respiratória pH <7.30"],
        descricao: "DPOC em exacerbação grave",
        recomendacao: "Internação, possível ventilação não-invasiva",
      },
    ],

    erros_criticos: [
      {
        erro: "Dar oxigenioterapia sem controle (SpO2 >95%)",
        descricao: "Pode remover o estímulo respiratório hipóxico, causar hipercapnia",
        penalidade: 2.5,
        evitavel: true,
      },
      {
        erro: "Não prescrever corticosteroide sistêmico",
        descricao: "Corticosteroide reduz duração de exacerbação",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou tabagismo e exposição ocupacional", realizado: false, critico: true },
      { item: "Mediu SpO2 e gases arteriais", realizado: false, critico: true },
      { item: "Ausculta: identificou sibilos", realizado: false, critico: true },
      { item: "Solicitou radiografia de tórax", realizado: false, critico: true },
      { item: "Prescreveu broncodilatador nebulizado", realizado: false, critico: true },
      { item: "Prescreveu corticosteroide sistêmico", realizado: false, critico: true },
      { item: "Titulou oxigenio para SpO2 88-92%", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Diagnóstico Diferencial",
        peso: 15,
        descricao: "Diferenciação com asma",
        pontuacao_maxima: 15,
      },
      {
        criterio: "Controle de Oxigenação",
        peso: 25,
        descricao: "Titulação apropriada de SpO2",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Terapia Broncodilatadora",
        peso: 30,
        descricao: "Prescrição de salbutamol e corticosteroide",
        pontuacao_maxima: 30,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Tosse crônica com escarro",
          "Tabagismo prévio significativo",
          "Dispneia progressiva",
          "Dyspnea at rest",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "SpO2 baixa",
          "Taquipneia",
          "Sibilos e roncos",
          "Hipersonoridade",
          "RX: hiperinsuflação",
          "Gasometria: hipoxemia e hipercapnia",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "DPOC em exacerbação",
          "Avaliação de gravidade",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Oxigenioterapia controlada",
          "Broncodilatadores",
          "Corticosteroide sistêmico",
          "Possível antibiótico",
          "Fisioterapia",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Investigou tabagismo",
        "Mediu SpO2 e gases",
        "Prescreveu broncodilatador",
        "Prescreveu corticosteroide",
        "Titulou oxigenio corretamente",
      ],
      erros_comuns: [
        "Não controlar SpO2 (deixar >95%)",
        "Não prescrever corticosteroide",
        "Confundir com asma",
      ],
      orientacoes_pedagogicas: [
        "DPOC: tosse crônica produtiva + tabagismo",
        "Exacerbação: aumento súbito de sintomas",
        "Oxigenio: sempre titular para SpO2 88-92%",
        "Broncodilatadores + corticosteroide são pilares",
        "Gasometria guia intensidade de tratamento",
      ],
    },

    diagnosticoCorreto: "DPOC em Exacerbação",
  },

  {
    // ====== CASO 10: TEP - TROMBOEMBOLISMO PULMONAR ======
    id: "10",
    titulo: "Tromboembolismo Pulmonar",
    sistema: "Respiratório",
    tema: "Dispneia Aguda",
    nivel: "avancado",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 15,
    objetivo_pedagogico: "Reconhecer TEP, estratificar risco e prescrever anticoagulação apropriada",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Helena Gomes",
      idade: 45,
      sexo: "Feminino",
      queixa_principal: "Dor no peito e falta de ar súbita",
      historia_breve: "Operada de joelho há 2 semanas, agora com dispneia súbita e dor pleurítica",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Tromboembolismo Pulmonar de Risco Intermediário",
      diagnosticos_diferenciais: [
        "Infarto Agudo do Miocárdio",
        "Pneumonia",
        "Pericardite",
        "Síncope de outra causa",
      ],
      sindromes_associadas: ["Tromboembolia"],
    },

    descricaoBreve: "Paciente com dispneia súbita, dor pleurítica, antecedente de cirurgia recente",
    categoria: "TEP",
    paciente: {
      id: "pac-010",
      nome: "Helena Gomes",
      idade: 45,
      sexo: "F",
      queixaPrincipal: "Dor no peito e falta de ar súbita",
      historicoDoenca: "Operada de joelho há 2 semanas, agora com dispneia súbita",
      antecedentes: ["Sem HAS", "Sem DM", "Contraceptivo oral"],
      profissao: "Professora",
      estado_civil: "Casada",
      alergias: [],
      medicamentos_em_uso: ["Contraceptivo oral"],
    },

    respostas_do_paciente: {
      inicial: "Doutor, acordei com muita falta de ar, tipo um aperto no peito.",
      inicio: "Foi de repente, estava dormindo tranquilo.",
      dor: "Sinto uma dor que piora quando respiro fundo.",
      intensidade: "8 a 9, muito incômodo.",
      cirurgia: "Fiz uma operação no joelho há 2 semanas, tive que ficar de repouso.",
      perna: "Minha perna ficou inchada e dolorida depois da cirurgia.",
      tosse: "Tenho uma tosse ligeira.",
      hemoptise: "Não, não tenho sangue na tosse não.",
      suor: "Sim, tô suada, com medo.",
    },
    respostaPaciente: {
      inicial: "Doutor, acordei com muita falta de ar, tipo um aperto no peito.",
      inicio: "Foi de repente, estava dormindo tranquilo.",
      dor: "Sinto uma dor que piora quando respiro fundo.",
      intensidade: "8 a 9, muito incômodo.",
      cirurgia: "Fiz uma operação no joelho há 2 semanas, tive que ficar de repouso.",
      perna: "Minha perna ficou inchada e dolorida depois da cirurgia.",
      tosse: "Tenho uma tosse ligeira.",
      hemoptise: "Não, não tenho sangue na tosse não.",
      suor: "Sim, tô suada, com medo.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "130/85 mmHg",
        frequenciaCardiaca: 115,
        frequenciaRespiratoria: 28,
        temperatura: 37.0,
        saturacaoOxigenio: 91,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "130/85 mmHg",
      frequenciaCardiaca: 115,
      frequenciaRespiratoria: 28,
      temperatura: 37.0,
      saturacaoOxigenio: 91,
      glicemia: 120,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente ansiosa, taquipneica, sem cianose no repouso",
        palpacao: "Pulsos simétricos, sem edema em MMSS, edema leve em MID (perna operada)",
        ausculta: "Murmúrio vesicular presente bilateralmente, sem alterações específicas",
        percussao: "Normal",
        observacoes:
          "Sem achados específicos, edema de perna é fator de risco para TEP",
        regiao: "Pulmões e MMII",
        achados_positivos: ["Taquicardia", "Taquipneia", "Edema em perna"],
        achados_negativos: ["Sopros", "Crepitações"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Paciente ansiosa, taquipneica",
      palpacao: "Edema leve em perna operada",
      ausculta: "Murmúrio vesicular presente",
      percussao: "Normal",
      observacoes: "Edema de MMII é fator de risco",
    },

    exames_complementares_disponiveis: [
      {
        nome: "ECG",
        descricao: "12 derivações",
        resultado: "Taquicardia sinusal, padrão S1Q3T3 (onda S em D1, onda Q em D3, onda T negativa em D3)",
        valor_referencia: "Normal",
        interpretacao: "Compatível com TEP",
      },
      {
        nome: "D-dímero",
        descricao: "Marcador de tromboembolia",
        resultado: "850 ng/mL",
        valor_referencia: "<500 ng/mL",
        interpretacao: "Elevado, não exclui TEP em probabilidade alta",
      },
      {
        nome: "Angiografia Pulmonar por TC",
        descricao: "Angio-TC de tórax",
        resultado: "Defeito de enchimento em artéria pulmonar direita (segmentar)",
        valor_referencia: "Normal",
        interpretacao: "TEP confirmado",
      },
      {
        nome: "Troponina",
        descricao: "Biomarcador cardíaco",
        resultado: "0.08 ng/mL",
        valor_referencia: "<0.04 ng/mL",
        interpretacao: "Elevada, indica dano miocárdico",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Tromboembolismo Pulmonar",
        probabilidade: 85,
        criterios_minimos: [
          "Dispneia súbita",
          "Dor pleurítica",
          "Fator de risco: cirurgia recente",
          "ECG: S1Q3T3",
          "Angio-TC positiva",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Infarto Agudo do Miocárdio",
        criterios_exclusao: ["ST elevado focal"],
        achados_que_descartam: ["Padrão de ECG diferente, angio-TC negativa"],
      },
    ],
    examesIndicados: [
      "ECG",
      "D-dímero se probabilidade baixa",
      "Angio-TC de tórax",
      "Troponina",
      "Ecocardiograma",
    ],

    conduta_esperada: {
      imediata: [
        "Oxigenioterapia para manter SpO2 >94%",
        "Anticoagulação: Heparina não fracionada ou enoxaparina IV",
        "Acesso venoso, monitorização",
      ],
      curto_prazo: [
        "Confirmar diagnóstico com angio-TC",
        "Considerar trombolítico se TEP massiva",
        "Transição para warfarina ou anticoagulante direto",
      ],
      longo_prazo: [
        "Anticoagulação por 3 meses",
        "Investigação de tromboembolia recorrente",
        "Profilaxia em futuras cirurgias",
      ],
      encaminhamentos: ["Cirurgia vascular se trombose venosa profunda"],
    },
    condutaCorreta:
      "Oxigenio, anticoagulação imediata, angio-TC para confirmação, considerar trombolítico se massiva",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["SpO2 91-94%", "Taquicardia", "Sem hipotensão"],
        descricao: "TEP de risco intermediário",
        recomendacao: "Anticoagulação, monitorização, angio-TC",
      },
      {
        severidade: "grave",
        sinais: ["SpO2 <90%", "Hipotensão", "Disfunção VD"],
        descricao: "TEP de alto risco (massiva)",
        recomendacao: "Anticoagulação, trombolítico, possível trombectomia",
      },
    ],

    erros_criticos: [
      {
        erro: "Não iniciar anticoagulação suspeitando de TEP",
        descricao: "Atraso em anticoagulação aumenta mortalidade",
        penalidade: 2.5,
        evitavel: true,
      },
      {
        erro: "Não solicitar angio-TC",
        descricao: "Angio-TC é padrão-ouro para diagnóstico",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou fatores de risco: cirurgia, edema", realizado: false, critico: true },
      { item: "Mediu SpO2 e gases se possível", realizado: false, critico: true },
      { item: "Solicitou ECG", realizado: false, critico: true },
      { item: "Solicitou D-dímero", realizado: false, critico: true },
      { item: "Solicitou angio-TC de tórax", realizado: false, critico: true },
      { item: "Iniciou anticoagulação", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de Fatores de Risco",
        peso: 15,
        descricao: "Cirurgia, imobilização, contraceptivo",
        pontuacao_maxima: 15,
      },
      {
        criterio: "Diagnóstico",
        peso: 25,
        descricao: "Solicitação de angio-TC apropriada",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Terapia Anticoagulante",
        peso: 30,
        descricao: "Anticoagulação imediata",
        pontuacao_maxima: 30,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Dispneia súbita",
          "Dor pleurítica",
          "Cirurgia recente",
          "Edema de perna",
          "Contraceptivo oral",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Taquicardia, taquipneia",
          "SpO2 reduzida",
          "ECG: S1Q3T3",
          "D-dímero elevado",
          "Angio-TC: defeito de enchimento",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["TEP de risco intermediário", "Fatores de risco presentes"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Oxigenioterapia",
          "Heparina IV",
          "Angio-TC confirmação",
          "Transição para warfarina",
          "Seguimento prolongado",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Investigou fatores de risco",
        "Solicitou ECG",
        "Solicitou angio-TC",
        "Iniciou anticoagulação",
        "Mediu SpO2",
      ],
      erros_comuns: [
        "Atraso em anticoagulação",
        "Não solicitar angio-TC",
        "Confundir com IAM",
      ],
      orientacoes_pedagogicas: [
        "TEP: dispneia súbita + dor pleurítica",
        "Fatores de risco: cirurgia, imobilização, contraceptivo, malignidade",
        "ECG pode mostrar S1Q3T3 ou apenas taquicardia",
        "Angio-TC é padrão-ouro",
        "Anticoagular ANTES de confirmar se alta suspeita",
      ],
    },

    diagnosticoCorreto: "Tromboembolismo Pulmonar",
  },

  {
    // ====== CASO 11: TUBERCULOSE ======
    id: "11",
    titulo: "Tuberculose Pulmonar",
    sistema: "Respiratório",
    tema: "Infecção Crônica",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Diagnosticar TB pulmonar e prescrever esquema terapêutico apropriado",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Roberto Santos",
      idade: 42,
      sexo: "Masculino",
      queixa_principal: "Tosse há mais de 3 semanas",
      historia_breve: "Tosse produtiva com sangue no escarro, febre à noite, perda de peso",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Tuberculose Pulmonar Ativa",
      diagnosticos_diferenciais: [
        "Pneumonia crônica",
        "Micose pulmonar",
        "Câncer de pulmão",
        "Bronquiectasia",
      ],
      sindromes_associadas: ["Síndrome consumptiva"],
    },

    descricaoBreve: "Paciente com tosse crônica, hemoptise, febre vespertina, perda ponderal",
    categoria: "Tuberculose",
    paciente: {
      id: "pac-011",
      nome: "Roberto Santos",
      idade: 42,
      sexo: "M",
      queixaPrincipal: "Tosse há mais de 3 semanas",
      historicoDoenca:
        "Tosse produtiva com sangue no escarro, febre à noite, perda de peso",
      antecedentes: ["Contato com TB previamente"],
      profissao: "Mecânico",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Doutor, tô tossindo faz umas 3 semanas, não melhora.",
      tosse: "Solta escarro, e às vezes tem sangue no meio.",
      inicio: "Começou faz umas 3 semanas, progressivamente piorou.",
      febre: "Tenho febre mais à noite, à tarde vou ficando quente.",
      suor: "Acordo à noite todo suado, tenho que trocar de roupa.",
      peso: "Emagreci bastante esses meses, ninguém reconhece.",
      apetite: "Perdi o apetite, não tenho vontade de comer.",
      cansaco: "Fico muito fraco, sem ânimo.",
      contato: "Meu irmão teve TB faz uns 2 anos.",
    },
    respostaPaciente: {
      inicial: "Doutor, tô tossindo faz umas 3 semanas, não melhora.",
      tosse: "Solta escarro, e às vezes tem sangue no meio.",
      inicio: "Começou faz umas 3 semanas, progressivamente piorou.",
      febre: "Tenho febre mais à noite, à tarde vou ficando quente.",
      suor: "Acordo à noite todo suado, tenho que trocar de roupa.",
      peso: "Emagreci bastante esses meses, ninguém reconhece.",
      apetite: "Perdi o apetite, não tenho vontade de comer.",
      cansaco: "Fico muito fraco, sem ânimo.",
      contato: "Meu irmão teve TB faz uns 2 anos.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "120/75 mmHg",
        frequenciaCardiaca: 92,
        frequenciaRespiratoria: 22,
        temperatura: 37.8,
        saturacaoOxigenio: 95,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "120/75 mmHg",
      frequenciaCardiaca: 92,
      frequenciaRespiratoria: 22,
      temperatura: 37.8,
      saturacaoOxigenio: 95,
      glicemia: 100,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente emagrecido, pálido, tosse ocasional",
        palpacao: "Expansão torácica simétrica",
        ausculta: "Murmúrio vesicular reduzido em ápice direito, crepitações ocasionais",
        percussao: "Macicez em ápice direito",
        observacoes: "Achados sugestivos de consolidação apical de TB",
        regiao: "Ápice de pulmão direito",
        achados_positivos: ["Crepitações apicais", "Redução de MV apical"],
        achados_negativos: ["Sibilos"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Paciente emagrecido, pálido",
      palpacao: "Expansão simétrica",
      ausculta: "Murmúrio reduzido em ápice direito",
      percussao: "Macicez apical",
      observacoes: "Consolidação apical sugestiva de TB",
    },

    exames_complementares_disponiveis: [
      {
        nome: "Radiografia de Tórax PA e Perfil",
        descricao: "Avaliação pulmonar",
        resultado: "Infiltrado opaco em ápice direito com escavação, consolidação lobar",
        valor_referencia: "Normal",
        interpretacao: "Compatível com TB ativa",
      },
      {
        nome: "Baciloscopia de Escarro (2 amostras)",
        descricao: "Pesquisa de BAAR",
        resultado: "Positiva (BAAR +)",
        valor_referencia: "Negativa",
        interpretacao: "TB ativa, paciente bacilífero",
      },
      {
        nome: "Hemograma",
        descricao: "Série de glóbulos",
        resultado: "Hb 10.5 g/dL (anemia), leucócitos 9.500/mm³",
        valor_referencia: "Hb >12 g/dL, leucócitos 4.500-11.000/mm³",
        interpretacao: "Anemia de doença crônica",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Tuberculose Pulmonar Ativa",
        probabilidade: 95,
        criterios_minimos: [
          "Tosse >3 semanas",
          "Hemoptise",
          "Febre vespertina e sudorese noturna",
          "Perda de peso",
          "RX com infiltrado apical",
          "Baciloscopia positiva",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Pneumonia Crônica",
        criterios_exclusao: ["Baciloscopia positiva"],
        achados_que_descartam: ["BAAR positivo"],
      },
    ],
    examesIndicados: [
      "Radiografia de tórax",
      "Baciloscopia de escarro (2 amostras)",
      "TRM-TB (GeneXpert)",
      "Hemograma",
      "Função hepática e renal",
    ],

    conduta_esperada: {
      imediata: [
        "Prescrever esquema RIPE (Rifampicina, Isoniazida, Pirazinamida, Etambutol)",
        "Fase intensiva por 2 meses",
        "Isolamento respiratório hospitalar se bacilífero",
      ],
      curto_prazo: [
        "Fase de manutenção: Rifampicina + Isoniazida por 4 meses",
        "Avaliação de resposta em 2 meses",
        "Notificação de contatos",
      ],
      longo_prazo: [
        "Esquema total 6 meses",
        "Seguimento mensal",
        "Busca de contatos para quimioprofilaxia",
      ],
      encaminhamentos: [
        "Pneumologia/TB se complicações",
        "Infectologia para coinfecções",
      ],
    },
    condutaCorreta:
      "Esquema RIPE: Rifampicina, Isoniazida, Pirazinamida, Etambutol. Fase intensiva 2 meses + manutenção 4 meses",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["Bacilífero", "Consolidação focal"],
        descricao: "TB ativa com transmissibilidade",
        recomendacao: "Esquema RIPE padrão, isolamento se hospitalar",
      },
    ],

    erros_criticos: [
      {
        erro: "Não solicitar baciloscopia",
        descricao: "Baciloscopia é essencial para confirmação diagnóstica",
        penalidade: 2.5,
        evitavel: true,
      },
      {
        erro: "Prescrever esquema incompleto ou dose errada",
        descricao: "Esquema correto garante cura e evita resistência",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou tosse >3 semanas", realizado: false, critico: true },
      { item: "Perguntou sobre hemoptise, febre vespertina, sudorese", realizado: false, critico: true },
      { item: "Indagou sobre contatos e fatores de risco", realizado: false, critico: true },
      { item: "Mediu sinais vitais", realizado: false, critico: true },
      { item: "Solicitou RX de tórax", realizado: false, critico: true },
      { item: "Solicitou baciloscopia (2 amostras)", realizado: false, critico: true },
      { item: "Prescreveu esquema RIPE", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Diagnóstico Diferencial",
        peso: 15,
        descricao: "Diferenciação com pneumonia crônica",
        pontuacao_maxima: 15,
      },
      {
        criterio: "Investigação Diagnóstica",
        peso: 25,
        descricao: "Baciloscopia apropriada",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Esquema Terapêutico",
        peso: 30,
        descricao: "RIPE com doses e duração corretos",
        pontuacao_maxima: 30,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Tosse >3 semanas",
          "Hemoptise",
          "Febre vespertina",
          "Sudorese noturna",
          "Perda de peso",
          "Contato com TB",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Sinais vitais",
          "Ausculta: redução de MV apical",
          "RX: infiltrado apical",
          "Baciloscopia: BAAR positivo",
          "Hemograma: anemia",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "TB ativa bacilífera",
          "Avaliação de comorbidades",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Esquema RIPE",
          "Isolamento se hospitalar",
          "Notificação de contatos",
          "Seguimento mensal",
          "Busca de contatos",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Investigou sintomas clássicos",
        "Solicitou RX de tórax",
        "Solicitou baciloscopia",
        "Prescreveu RIPE",
        "Abordou contatos e isolamento",
      ],
      erros_comuns: [
        "Não solicitar baciloscopia",
        "Esquema terapêutico incompleto",
        "Não investigar contatos",
      ],
      orientacoes_pedagogicas: [
        "TB: tosse >3 semanas, febre vespertina, sudorese, perda de peso",
        "RX: infiltrado apical com escavação",
        "Baciloscopia é fundamental",
        "Esquema RIPE é padrão-ouro",
        "Duração total: 6 meses (2 intensiva + 4 manutenção)",
      ],
    },

    diagnosticoCorreto: "Tuberculose Pulmonar Ativa",
  },

  {
    // ====== CASO 12: DENGUE GRUPO A ======
    id: "12",
    titulo: "Dengue - Grupo A",
    sistema: "Infeccioso",
    tema: "Arbovirose",
    nivel: "iniciante",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 10,
    objetivo_pedagogico:
      "Diagnosticar dengue clássica, orientar hidratação e monitorar sinais de alerta",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Juliana Silva",
      idade: 29,
      sexo: "Feminino",
      queixa_principal: "Febre alta, dor de cabeça e dor no corpo",
      historia_breve: "Febre alta de início súbito há 2 dias, afebril em alguns períodos",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Dengue Grupo A (clássica)",
      diagnosticos_diferenciais: [
        "Dengue Grupo B",
        "Zika",
        "Chikungunya",
        "Infecção viral inespecífica",
      ],
      sindromes_associadas: ["Síndrome do dengue"],
    },

    descricaoBreve: "Paciente com febre alta bifásica, cefaleia, mialgia, sem sinais de alerta",
    categoria: "Dengue",
    paciente: {
      id: "pac-012",
      nome: "Juliana Silva",
      idade: 29,
      sexo: "F",
      queixaPrincipal: "Febre alta, dor de cabeça e dor no corpo",
      historicoDoenca: "Febre alta de início súbito há 2 dias, afebril em alguns períodos",
      antecedentes: ["Sem antecedentes relevantes"],
      profissao: "Enfermeira",
      estado_civil: "Solteira",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Doutora, tenho febre muito alta, dói tudo no corpo.",
      febre: "Febre altíssima, umas 39-40 graus, aparece e desaparece.",
      cefaleia: "Dor de cabeça intensa, principalmente atrás dos olhos.",
      retroorbitaria: "Isso, dói atrás dos olhos quando move para os lados.",
      mialgia: "Tudo dói, músculos, as costas, as pernas, dói demais.",
      artralgia: "As articulações também doem.",
      exantema: "Apareceu uma manchinha avermelhada no corpo.",
      apetite: "Perdi a vontade de comer.",
      nausea: "Tenho umas náuseas, mas não vomitei.",
      vomito: "Não, não vomitei.",
    },
    respostaPaciente: {
      inicial: "Doutora, tenho febre muito alta, dói tudo no corpo.",
      febre: "Febre altíssima, umas 39-40 graus, aparece e desaparece.",
      cefaleia: "Dor de cabeça intensa, principalmente atrás dos olhos.",
      retroorbitaria: "Isso, dói atrás dos olhos quando move para os lados.",
      mialgia: "Tudo dói, músculos, as costas, as pernas, dói demais.",
      artralgia: "As articulações também doem.",
      exantema: "Apareceu uma manchinha avermelhada no corpo.",
      apetite: "Perdi a vontade de comer.",
      nausea: "Tenho umas náuseas, mas não vomitei.",
      vomito: "Não, não vomitei.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "115/75 mmHg",
        frequenciaCardiaca: 95,
        frequenciaRespiratoria: 18,
        temperatura: 39.8,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "115/75 mmHg",
      frequenciaCardiaca: 95,
      frequenciaRespiratoria: 18,
      temperatura: 39.8,
      saturacaoOxigenio: 98,
      glicemia: 110,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente febril, exantema maculopapular em tronco e membros",
        palpacao: "Sem hepatomegalia, sem edema",
        ausculta: "Normal",
        percussao: "Normal",
        observacoes: "Fase febril clássica de dengue sem complicações",
        regiao: "Pele e órgãos abdominais",
        achados_positivos: ["Febre", "Exantema maculopapular"],
        achados_negativos: ["Hepatomegalia", "Sangramento"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Paciente febril, exantema maculopapular",
      palpacao: "Sem hepatomegalia",
      ausculta: "Normal",
      percussao: "Normal",
      observacoes: "Fase febril clássica",
    },

    exame_fisico_interativo: {
      geral: {
        estado_geral: "Paciente em regular estado geral, febril, com exantema.",
        coloracao: "Exantema maculopapular presente em tronco e membros.",
      },
      abdominal: {
        inspecao: "Abdome normal.",
        palpacao_superficial: "Sem visceromegalias, sem dor à palpação.",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Hemograma Completo",
        descricao: "Série de glóbulos",
        resultado: "Plaquetas 150.000/mm³, leucócitos 3.500/mm³",
        valor_referencia: "Plaquetas >150.000/mm³, leucócitos 4.500-11.000/mm³",
        interpretacao: "Discreta leucopenia e trombocitopenia",
      },
      {
        nome: "Sorologia para Dengue (IgM)",
        descricao: "ELISA",
        resultado: "Positiva (IgM positivo)",
        valor_referencia: "Negativa",
        interpretacao: "Dengue aguda",
      },
      {
        nome: "NS1 Antígeno",
        descricao: "Antígeno não-estrutural",
        resultado: "Positivo",
        valor_referencia: "Negativo",
        interpretacao: "Infecção aguda",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Dengue Grupo A (Clássica)",
        probabilidade: 90,
        criterios_minimos: [
          "Febre alta bifásica",
          "Cefaleia intensa",
          "Dor retroorbitária",
          "Mialgia intensa",
          "Exantema",
          "Soropositividade (IgM ou NS1 positivo)",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Zika ou Chikungunya",
        criterios_exclusao: ["Padrão de sintomas típico de dengue clássica"],
        achados_que_descartam: ["Dor retroorbitária típica"],
      },
    ],
    examesIndicados: [
      "Hemograma",
      "IgM para dengue",
      "NS1 antígeno",
      "Testes de coagulação se necessário",
    ],

    conduta_esperada: {
      imediata: [
        "Hidratação oral abundante (água, soro fisiológico, sucos)",
        "Repouso relativo",
        "Paracetamol ou Dipirona para febre",
      ],
      curto_prazo: [
        "Evitar AINEs (risco de hemorragia)",
        "Monitorização de sinais de alerta",
        "Hemograma seriado se piora",
      ],
      longo_prazo: ["Seguimento até resolução", "Investigação se dengue hemorrágica"],
      encaminhamentos: ["Infectologia se sinais de alerta"],
    },
    condutaCorreta:
      "Hidratação oral abundante, paracetamol/dipirona, evitar AINEs, monitorização de sinais de alerta",

    criterios_de_gravidade: [
      {
        severidade: "leve",
        sinais: ["Sem sangramento", "PA normal", "Sem vômitos"],
        descricao: "Dengue clássica sem complicações",
        recomendacao: "Hidratação oral, analgésicos, follow-up ambulatorial",
      },
    ],

    erros_criticos: [
      {
        erro: "Prescrever AINEs (Ibuprofeno, Diclofenaco)",
        descricao: "AINEs aumentam risco de sangramento em dengue",
        penalidade: 2,
        evitavel: true,
      },
      {
        erro: "Não orientar hidratação adequada",
        descricao: "Desidratação é fator de risco para piora",
        penalidade: 1.5,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou febre, cefaleia, mialgia", realizado: false, critico: true },
      { item: "Perguntou sobre dor retroorbitária", realizado: false, critico: true },
      { item: "Mediu sinais vitais", realizado: false, critico: true },
      { item: "Investigou sinais de alerta", realizado: false, critico: true },
      { item: "Solicitou hemograma", realizado: false, critico: true },
      { item: "Solicitou sorologia (IgM)", realizado: false, critico: true },
      { item: "Orientou hidratação e evitar AINEs", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Diagnóstico Clínico",
        peso: 20,
        descricao: "Reconhecimento de sintomas clássicos",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Avaliação de Sinais de Alerta",
        peso: 20,
        descricao: "Identificação de gravidade",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Orientação Terapêutica",
        peso: 30,
        descricao: "Hidratação, analgésicos apropriados",
        pontuacao_maxima: 30,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Febre alta bifásica",
          "Cefaleia intensa e dor retroorbitária",
          "Mialgia e artralgia",
          "Náuseas",
          "Exantema",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Febre alta (39-40°C)",
          "Exantema maculopapular",
          "Hemograma: leucopenia e trombocitopenia",
          "Sorologia IgM positiva",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Dengue Grupo A (clássica)", "Sem sinais de alerta"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Hidratação oral",
          "Paracetamol",
          "Evitar AINEs",
          "Monitorização de sinais de alerta",
          "Hemograma seriado se necessário",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Investigou padrão clínico de dengue",
        "Solicitou hemograma e sorologia",
        "Orientou hidratação",
        "Não prescreveu AINEs",
        "Monitorização de sinais de alerta",
      ],
      erros_comuns: [
        "Prescrever AINE",
        "Falta de orientação de hidratação",
        "Não investigar sinais de alerta",
      ],
      orientacoes_pedagogicas: [
        "Dengue clássica: febre bifásica, cefaleia, dor retroorbitária, mialgia",
        "Exantema é comum",
        "NUNCA prescreva AINE",
        "Hidratação oral é pilar do tratamento",
        "IgM positivo do 5º dia em diante",
      ],
    },

    diagnosticoCorreto: "Dengue Grupo A",
  },

  {
    // ====== CASO 13: ENDOCARDITE INFECCIOSA ======
    id: "13",
    titulo: "Endocardite Infecciosa",
    sistema: "Cardiovascular",
    tema: "Infecção Cardíaca",
    nivel: "avancado",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 15,
    objetivo_pedagogico: "Diagnosticar endocardite usando critérios de Duke e prescrever antibioticoterapia",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Gustavo Ferreira",
      idade: 48,
      sexo: "Masculino",
      queixa_principal: "Febre prolongada com sopro cardíaco",
      historia_breve: "Febre há 3 semanas após procedimento odontológico, descoberto sopro novo",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Endocardite Infecciosa Subaguda",
      diagnosticos_diferenciais: [
        "Infecção de cateter",
        "Tuberculose",
        "Linfoma",
        "Pneumonia com sepse",
      ],
      sindromes_associadas: ["Bacteremia contínua"],
    },

    descricaoBreve: "Paciente com febre prolongada, novo sopro, esplenomegalia, petéquias",
    categoria: "Endocardite",
    paciente: {
      id: "pac-013",
      nome: "Gustavo Ferreira",
      idade: 48,
      sexo: "M",
      queixaPrincipal: "Febre prolongada com sopro cardíaco",
      historicoDoenca:
        "Febre há 3 semanas após procedimento odontológico, descoberto sopro novo",
      antecedentes: ["Valva aórtica bicúspide"],
      profissao: "Professor universitário",
      estado_civil: "Casado",
      alergias: ["Penicilina (alergia leve)"],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Doutor, tô com febre já faz umas 3 semanas que não passa.",
      febre: "Febre que vem e vai, mais à noite.",
      inicio: "Começou umas 3 semanas atrás, depois que fiz um tratamento de dente.",
      suor: "Acordo à noite todo suado.",
      cansaco: "Estou muito fraco, sem ânimo nenhum.",
      sopro: "Disseram que descobriram um sopro novo no meu coração.",
      ossos: "Tenho dores nas articulações.",
      pele: "Apareceram umas manchinhas vermelhas nas mãos.",
      unhas: "As unhas ficaram estranhas.",
    },
    respostaPaciente: {
      inicial: "Doutor, tô com febre já faz umas 3 semanas que não passa.",
      febre: "Febre que vem e vai, mais à noite.",
      inicio: "Começou umas 3 semanas atrás, depois que fiz um tratamento de dente.",
      suor: "Acordo à noite todo suado.",
      cansaco: "Estou muito fraco, sem ânimo nenhum.",
      sopro: "Disseram que descobriram um sopro novo no meu coração.",
      ossos: "Tenho dores nas articulações.",
      pele: "Apareceram umas manchinhas vermelhas nas mãos.",
      unhas: "As unhas ficaram estranhas.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "135/80 mmHg",
        frequenciaCardiaca: 98,
        frequenciaRespiratoria: 20,
        temperatura: 38.2,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "135/80 mmHg",
      frequenciaCardiaca: 98,
      frequenciaRespiratoria: 20,
      temperatura: 38.2,
      saturacaoOxigenio: 98,
      glicemia: 112,
    },

    exame_fisico: {
      correto: {
        inspecao: "Petéquias em palato duro e palmas, hemorragia em astilha subungueal",
        palpacao: "Esplenomegalia (baço aumentado 2cm), nódulos de Osler em polpas digitais",
        ausculta:
          "Novo sopro sistólico (insuficiência aórtica), estertores pulmonares se embolia",
        percussao: "Normal",
        observacoes: "Critérios maiores: febre, novo sopro, embolia; menores: esplenomegalia",
        regiao: "Coração, baço, pele",
        achados_positivos: [
          "Novo sopro",
          "Petéquias",
          "Esplenomegalia",
          "Nódulos de Osler",
        ],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Petéquias em palmas",
      palpacao: "Esplenomegalia, nódulos de Osler",
      ausculta: "Novo sopro sistólico",
      percussao: "Normal",
      observacoes: "Múltiplos critérios de Duke presentes",
    },

    exame_fisico_interativo: {
      geral: {
        estado_geral: "Paciente em regular estado geral, febril, pálido.",
        coloracao: "Petéquias em palmas e solas dos pés.",
      },
      cardiovascular: {
        ausculta_cardiaca: "Novo sopro sistólico em foco aórtico, rude.",
        pulsos: "Pulsos presentes, porém assimétricos em membros superiores.",
      },
      abdominal: {
        palpacao_profunda: "Esplenomegalia evidente, indolor, borda regular.",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Hemocultura (3 amostras)",
        descricao: "Pesquisa de bacteremia",
        resultado: "Streptococcus viridans positivo",
        valor_referencia: "Negativa",
        interpretacao: "Bacteremia contínua",
      },
      {
        nome: "ECG",
        descricao: "12 derivações",
        resultado: "Sopro, possível bloqueio AV em desenvolvimento",
        valor_referencia: "Normal",
        interpretacao: "Complicação de endocardite",
      },
      {
        nome: "Ecocardiograma Transesofágico",
        descricao: "Ultrassom cardíaco avançado",
        resultado: "Vegetação em valva aórtica, insuficiência aórtica moderada",
        valor_referencia: "Normal",
        interpretacao: "Endocardite confirmada",
      },
      {
        nome: "Hemograma",
        descricao: "Série de glóbulos",
        resultado: "Leucocitose 13.500/mm³, anemia normocítica",
        valor_referencia: "4.500-11.000/mm³",
        interpretacao: "Infecção sistêmica",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Endocardite Infecciosa",
        probabilidade: 95,
        criterios_minimos: [
          "Febre >2 semanas",
          "Novo sopro",
          "Hemocultura positiva",
          "Achados ecocardiográficos",
          "Critérios de Duke: 2 maiores + 1 menor = definitiva",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Febre de Origem Indeterminada",
        criterios_exclusao: ["Novo sopro + hemocultura positiva"],
        achados_que_descartam: ["Ecocardiograma com vegetação"],
      },
    ],
    examesIndicados: [
      "Hemocultura (3 amostras antes de antibiótico)",
      "ECG",
      "Ecocardiograma transtorácico",
      "Ecocardiograma transesofágico",
      "Hemograma, PCR, velocidade de sedimentação",
    ],

    conduta_esperada: {
      imediata: [
        "Coletar 3 hemoculturas antes de antibiótico",
        "Iniciar antibioticoterapia: Cefalosporina 3ª geração + Gentamicina IV",
        "Internação hospitalar",
      ],
      curto_prazo: [
        "Ecocardiograma transesofágico",
        "Avaliação cardíaca frequente",
        "Consulta com cirurgião cardíaco se indicado",
      ],
      longo_prazo: [
        "Antibioticoterapia IV por 4-6 semanas",
        "Possível cirurgia de troca valvar",
        "Seguimento cardiológico",
      ],
      encaminhamentos: [
        "Cardiologia cirúrgica se insuficiência cardíaca",
        "Infectologia",
      ],
    },
    condutaCorreta:
      "Coletar hemoculturas (3), iniciar antibióticos IV (cefalosporina + gentamicina), ecocardiograma transesofágico",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["Novo sopro", "Embolia sem insuficiência cardíaca"],
        descricao: "Endocardite com complicação embólica",
        recomendacao: "Antibiótico IV, ecocardiograma, avaliação cirúrgica",
      },
      {
        severidade: "grave",
        sinais: ["Insuficiência cardíaca", "Bloqueio AV", "Embolia múltipla"],
        descricao: "Endocardite com complicações graves",
        recomendacao: "Internação UTI, cirurgia urgente",
      },
    ],

    erros_criticos: [
      {
        erro: "Iniciar antibiótico sem coletar hemoculturas",
        descricao: "Hemoculturas são essenciais para identificar agente e sensibilidade",
        penalidade: 2.5,
        evitavel: true,
      },
      {
        erro: "Não solicitar ecocardiograma transesofágico",
        descricao: "ETE é mais sensível que ETT para vegetações",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou febre prolongada", realizado: false, critico: true },
      { item: "Perguntou sobre procedimentos dentários/invasivos", realizado: false, critico: true },
      { item: "Procurou novos sopros cardíacos", realizado: false, critico: true },
      { item: "Investigou sinais de embolia (petéquias, Osler)", realizado: false, critico: true },
      { item: "Mediu sinais vitais", realizado: false, critico: true },
      { item: "Coletou 3 hemoculturas", realizado: false, critico: true },
      { item: "Solicitou ECG e ecocardiograma", realizado: false, critico: true },
      { item: "Iniciou antibiótico apropriado", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Diagnóstico Diferencial",
        peso: 15,
        descricao: "Investigação apropriada de febre prolongada",
        pontuacao_maxima: 15,
      },
      {
        criterio: "Achados Clínicos",
        peso: 20,
        descricao: "Reconhecimento de petéquias, sopros, esplenomegalia",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Investigação Diagnóstica",
        peso: 25,
        descricao: "Hemoculturas, ecocardiograma transesofágico",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Febre >2 semanas",
          "Procedimento invasivo prévio",
          "Artralgias",
          "Sudorese noturna",
          "Desconforto geral",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Febre contínua",
          "Novo sopro cardíaco",
          "Petéquias, hemorragia subungueal",
          "Esplenomegalia, nódulos de Osler",
          "Hemocultura positiva",
          "Ecocardiograma com vegetação",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "Endocardite infecciosa",
          "Critérios de Duke: 2 maiores confirmados",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Internação hospitalar",
          "Antibiótico IV (cefalosporina + gentamicina)",
          "Duração 4-6 semanas",
          "Ecocardiograma de seguimento",
          "Avaliação cirúrgica",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Investigou febre prolongada sistematicamente",
        "Procurou novos sopros",
        "Coletou hemoculturas antes de antibiótico",
        "Solicitou ecocardiograma transesofágico",
        "Prescreveu antibioticoterapia apropriada",
      ],
      erros_comuns: [
        "Iniciar antibiótico sem hemoculturas",
        "Não procurar sopros novos",
        "Não investigar sinais de embolia",
      ],
      orientacoes_pedagogicas: [
        "Endocardite: febre >2 semanas + novo sopro + embolia",
        "Critérios de Duke: 2 maiores = definitiva",
        "SEMPRE coletar 3 hemoculturas ANTES de antibiótico",
        "Ecocardiograma transesofágico é mais sensível",
        "Antibiótico IV por 4-6 semanas",
      ],
    },

    diagnosticoCorreto: "Endocardite Infecciosa",
  },

  {
    // ====== CASO 14: ESTENOSE MITRAL ======
    id: "14",
    titulo: "Estenose Mitral",
    sistema: "Cardiovascular",
    tema: "Valvulopatia",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Diagnosticar estenose mitral pelos achados clássicos e ecocardiograma",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Beatriz Oliveira",
      idade: 52,
      sexo: "Feminino",
      queixa_principal: "Falta de ar ao fazer esforço",
      historia_breve: "Dispneia ao esforço progressiva, história de febre reumática na infância",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Estenose Mitral Moderada",
      diagnosticos_diferenciais: [
        "Insuficiência Mitral",
        "Insuficiência Cardíaca",
        "Asma",
        "DPOC",
      ],
      sindromes_associadas: ["Síndrome reumática"],
    },

    descricaoBreve: "Paciente com dispneia ao esforço, sopro diastólico em ruflar, ritmo irregular",
    categoria: "Valvulopatia",
    paciente: {
      id: "pac-014",
      nome: "Beatriz Oliveira",
      idade: 52,
      sexo: "F",
      queixaPrincipal: "Falta de ar ao fazer esforço",
      historicoDoenca:
        "Dispneia ao esforço progressiva, história de febre reumática na infância",
      antecedentes: ["Febre reumática aos 12 anos"],
      profissao: "Dona de casa",
      estado_civil: "Casada",
      alergias: [],
      medicamentos_em_uso: ["Losartana 50mg"],
    },

    respostas_do_paciente: {
      inicial: "Doutora, fico muito cansada quando caminho rápido.",
      esforco: "Não consigo nem subir escada, fico muito sem ar.",
      noite: "Às vezes acordo à noite sem conseguir respirar.",
      tosse: "Tenho uma tosse que piora com esforço.",
      palpitacao: "Às vezes bate acelerado, às vezes irregular.",
      infancia: "Tive febre reumática quando era criança, fui internada.",
      inchaço: "Meus pés incham ao final do dia.",
      dor_peito: "Às vezes sinto um incômodo no peito.",
    },
    respostaPaciente: {
      inicial: "Doutora, fico muito cansada quando caminho rápido.",
      esforco: "Não consigo nem subir escada, fico muito sem ar.",
      noite: "Às vezes acordo à noite sem conseguir respirar.",
      tosse: "Tenho uma tosse que piora com esforço.",
      palpitacao: "Às vezes bate acelerado, às vezes irregular.",
      infancia: "Tive febre reumática quando era criança, fui internada.",
      inchaço: "Meus pés incham ao final do dia.",
      dor_peito: "Às vezes sinto um incômodo no peito.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "130/85 mmHg",
        frequenciaCardiaca: 92,
        frequenciaRespiratoria: 20,
        temperatura: 36.8,
        saturacaoOxigenio: 97,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "130/85 mmHg",
      frequenciaCardiaca: 92,
      frequenciaRespiratoria: 20,
      temperatura: 36.8,
      saturacaoOxigenio: 97,
      glicemia: 135,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente normocolorada, sem cianose no repouso",
        palpacao: "Ictus cordis não desviado, possível frêmito diastólico",
        ausculta:
          "Sopro diastólico em ruflar em foco mitral (ápex), possível estalido de abertura, desdobramento de S2",
        percussao: "Normal",
        observacoes:
          "Achados clássicos de EM: sopro diastólico em ruflar, desdobramento de S2",
        regiao: "Precórdio",
        achados_positivos: [
          "Sopro diastólico em ruflar",
          "Desdobramento de S2",
          "Possível frêmito",
        ],
        achados_negativos: ["Sopro sistólico de regurgitação"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Paciente normocolorada",
      palpacao: "Ictus não desviado",
      ausculta: "Sopro diastólico em ruflar, desdobramento de S2",
      percussao: "Normal",
      observacoes: "Achados clássicos de estenose mitral",
    },

    exame_fisico_interativo: {
      geral: {
        estado_geral: "Paciente em bom estado geral, normocolorada.",
      },
      cardiovascular: {
        inspecao_precordial: "Sem abaulamentos visíveis.",
        ictus: "Ictus cordis não visível, não palpável.",
        ausculta_cardiaca: "Sopro diastólico em ruflar em ápex (foco mitral), desdobramento de S2.",
        pulsos: "Pulsos presentes e simétricos, amplos e rítmicos.",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "ECG",
        descricao: "12 derivações",
        resultado: "Ondas P bifásicas em D2 (P mitrale), possível fibrilação atrial",
        valor_referencia: "Normal",
        interpretacao: "Sobrecarga atrial esquerda",
      },
      {
        nome: "Radiografia de Tórax PA e Perfil",
        descricao: "Avaliação cardiopulmonar",
        resultado: "Silhueta cardíaca com configuração mitral (convexidade esquerda), possível congestão pulmonar",
        valor_referencia: "Normal",
        interpretacao: "Cardiomegalia",
      },
      {
        nome: "Ecocardiograma",
        descricao: "Ultrassom cardíaco",
        resultado: "Valva mitral espessada, gradiente transvalvar 8 mmHg, área valvar 1.5-2.0 cm²",
        valor_referencia: "Área valvar >2.5 cm², gradiente <5 mmHg",
        interpretacao: "Estenose mitral moderada",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Estenose Mitral",
        probabilidade: 90,
        criterios_minimos: [
          "Dispneia ao esforço",
          "Sopro diastólico em ruflar",
          "Desdobramento de S2",
          "Ecocardiograma com área <2.5 cm²",
          "Antecedente de febre reumática",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Insuficiência Mitral",
        criterios_exclusao: ["Sopro sistólico"],
        achados_que_descartam: ["Sopro diastólico, não sistólico"],
      },
    ],
    examesIndicados: [
      "ECG",
      "Radiografia de tórax",
      "Ecocardiograma",
      "Teste ergométrico se necessário",
    ],

    conduta_esperada: {
      imediata: [
        "Diurético se congestão",
        "Restrição de sal e líquido",
        "Betabloqueador para controlar FC",
      ],
      curto_prazo: [
        "Ecocardiograma de seguimento",
        "Profilaxia de endocardite",
        "Avaliar necessidade de valvotomia",
      ],
      longo_prazo: [
        "Cirurgia de comissurotomia ou troca valvar se indicado",
        "Seguimento cardiológico",
      ],
      encaminhamentos: ["Cardiologia cirúrgica para avaliação"],
    },
    condutaCorreta:
      "Diurético se congestão, betabloqueador, ecocardiograma, profilaxia de endocardite, considerar cirurgia",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["Dispneia ao esforço", "Área 1.5-2.0 cm²"],
        descricao: "Estenose mitral moderada",
        recomendacao: "Diurético, betabloqueador, seguimento com eco",
      },
    ],

    erros_criticos: [
      {
        erro: "Confundir sopro diastólico com sistólico",
        descricao: "Diastólico = estenose; sistólico = insuficiência",
        penalidade: 2,
        evitavel: true,
      },
      {
        erro: "Não solicitar ecocardiograma",
        descricao: "Ecocardiograma confirma diagnóstico e gravidade",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou dispneia ao esforço", realizado: false, critico: true },
      { item: "Perguntou sobre febre reumática", realizado: false, critico: true },
      { item: "Mediu sinais vitais", realizado: false, critico: true },
      { item: "Ausculta: identificou sopro diastólico", realizado: false, critico: true },
      { item: "Solicitou ECG", realizado: false, critico: true },
      { item: "Solicitou ecocardiograma", realizado: false, critico: true },
      { item: "Prescreveu diurético e betabloqueador", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Achados Clínicos",
        peso: 20,
        descricao: "Identificação de sopro diastólico em ruflar",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Diagnóstico",
        peso: 25,
        descricao: "Solicitação e interpretação de ecocardiograma",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Terapia",
        peso: 25,
        descricao: "Prescrição de diurético e betabloqueador",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Dispneia ao esforço progressiva",
          "Ortopneia ocasional",
          "Palpitações",
          "Antecedente de febre reumática",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Sinais vitais: FC pode ser irregular",
          "Sopro diastólico em ruflar em ápex",
          "Desdobramento de S2",
          "ECG: P mitrale",
          "Ecocardiograma: área <2.5 cm²",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Estenose mitral moderada", "NYHA II"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Diurético se congestão",
          "Betabloqueador",
          "Profilaxia de endocardite",
          "Avaliação cirúrgica",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Investigou antecedente de febre reumática",
        "Identificou sopro diastólico",
        "Solicitou ecocardiograma",
        "Prescreveu betabloqueador",
        "Indicou profilaxia",
      ],
      erros_comuns: [
        "Confundir com insuficiência mitral",
        "Não solicitar ecocardiograma",
        "Prescrever diurético desnecessariamente",
      ],
      orientacoes_pedagogicas: [
        "Estenose mitral: sopro DIASTÓLICO em ruflar",
        "Febre reumática é etiologia principal em países em desenvolvimento",
        "P mitrale no ECG",
        "Ecocardiograma é padrão-ouro",
        "Betabloqueador controla frequência",
      ],
    },

    diagnosticoCorreto: "Estenose Mitral",
  },
];
