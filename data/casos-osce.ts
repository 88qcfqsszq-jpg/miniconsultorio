import { Caso } from "@/lib/types";
import { casosPediatricos } from "./casos-pediatricos";

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

    
    temaOSCE: "Coronariopatias/SCA",
    subtopicosOSCE: [
      "IAM com supra-ST (IAMCSST)",
      "Troponina elevada",
      "ECG com elevação de ST",
      "Conduta emergencial",
      "Tempo é músculo - reperfusão"
    ],
    diagnosticoCorreto: "Síndrome Coronariana Aguda",

    esperadosExames: {
      ecg: {
        indicado: true,
        prioridade: "obrigatório",
        achadoEsperado: "taquicardia_sinusal_pediatrica",
        interpretacaoEsperada: [
          "taquicardia sinusal",
          "elevação do segmento ST",
          "sem sinais de bloqueio"
        ],
        observacoes: "ECG deve ser feito imediatamente (primeiros 10 minutos)"
      }
    }
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

    
    temaOSCE: "Pneumonia",
    subtopicosOSCE: [
      "Tosse produtiva",
      "Febre >3 dias",
      "Consolidação em RX tórax",
      "Hemograma com leucocitose",
      "Antibióticoterapia empírica"
    ],
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

    
    temaOSCE: "Asma",
    subtopicosOSCE: [
      "Dispneia aguda",
      "Sibilância bilateral",
      "Espirometria com redução de FEV1",
      "Broncodilatador (SABA)",
      "Corticosteroide sistêmico"
    ],
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

    
    temaOSCE: "Coronariopatias/SCA",
    subtopicosOSCE: [
      "Angina estável",
      "Dor ao esforço reproduzível",
      "ECG positivo ao esforço",
      "Teste ergométrico",
      "Betabloqueador de primeira linha"
    ],
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

    
    temaOSCE: "HAS / sinais vitais",
    subtopicosOSCE: [
      "Técnica de medida de PA",
      "HAS estágio 1 (140-159/90-99)",
      "Avaliação de órgãos-alvo (coração, rins)",
      "ECG para HVE",
      "Função renal (creatinina)"
    ],
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

    
    temaOSCE: "Pneumonia",
    subtopicosOSCE: [
      "Pneumonia atípica (Mycoplasma)",
      "Tosse seca prolongada",
      "Infiltrado intersticial em RX",
      "Macrolídeos como primeira linha",
      "Apresentação clínica diferente de PAC típica"
    ],
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

    
    temaOSCE: "Valvopatias",
    subtopicosOSCE: [
      "Pericardite aguda",
      "Dor pleurítica com sopro de atrito",
      "ECG com elevação difusa de ST",
      "Ecocardiograma",
      "Anti-inflamatórios como primeira linha"
    ],
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

    
    temaOSCE: "Insuficiência Cardíaca",
    subtopicosOSCE: [
      "IC sistólica (redução de FEVE)",
      "Congestão pulmonar (ortopneia, dispneia)",
      "B3 (galope)",
      "BNP/NT-proBNP elevado",
      "Ecocardiograma com FEVE reduzida"
    ],
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

    
    temaOSCE: "TVP/TEP/Insuficiência venosa",
    subtopicosOSCE: [
      "Tromboembolismo pulmonar (TEP)",
      "Dispneia súbita",
      "Score de Wells >4",
      "D-dímero elevado",
      "AngioTC pulmonar"
    ],
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

    
    temaOSCE: "Tuberculose",
    subtopicosOSCE: [
      "Tosse > 3 semanas",
      "Febre vespertina",
      "Baciloscopia positiva",
      "Esquema RIPE (rifampicina, isoniazida, pirazinamida, etambutol)",
      "Isolamento respiratório"
    ],
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

    
    temaOSCE: "DPOC",
    subtopicosOSCE: [
      "Tabagismo crônico",
      "Tosse crônica e bronquite",
      "Espirometria com VEF1/CVF <0.7",
      "Broquiodilatadores e corticoides inalados",
      "Exacerbação aguda"
    ],
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

    
    temaOSCE: "Conteúdos transversais",
    subtopicosOSCE: [
      "Dengue - arbovirose",
      "Sintomas sistêmicos (febre, mialgia)",
      "Trombocitopenia",
      "Manejo de febre",
      "Suspeita de síndrome hemorrágica"
    ],
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

    
    temaOSCE: "Conteúdos transversais",
    subtopicosOSCE: [
      "Endocardite infecciosa",
      "Febre prolongada com sopro novo",
      "Critérios de Duke",
      "Hemoculturas antes de antibiótico",
      "Antibiótico prolongado (4-6 semanas)"
    ],
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

    
    temaOSCE: "Valvopatias",
    subtopicosOSCE: [
      "Estenose mitral",
      "Sopro diastólico em ruflar",
      "P mitrale no ECG",
      "Ecocardiograma com área <2.5 cm²",
      "Febre reumática na etiologia"
    ],
    diagnosticoCorreto: "Estenose Mitral",
  },

  {
    // ====== CASO 15: DAOP - Doença Arterial Obstrutiva Periférica ======
    id: "15",
    titulo: "Doença Arterial Obstrutiva Periférica",
    sistema: "Cardiovascular",
    tema: "Claudicação Intermitente",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Diagnosticar DAOP, avaliar grau de isquemia e estabelecer conduta terapêutica",

    dados_visiveis_ao_estudante: {
      nome_paciente: "José Santos",
      idade: 68,
      sexo: "Masculino",
      queixa_principal: "Dor nas pernas ao caminhar",
      historia_breve: "Sente dor nas panturrilhas após caminhar ~100m, melhora com repouso",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Doença Arterial Obstrutiva Periférica Estágio II (Claudicação)",
      diagnosticos_diferenciais: ["Neuropatia diabética", "Insuficiência venosa", "Ciática"],
      sindromes_associadas: ["Síndrome isquêmica de membros inferiores"],
    },

    descricaoBreve: "Paciente com claudicação intermitente, pulsos reduzidos, ITB alterado",
    categoria: "DAOP",
    paciente: {
      id: "pac-015",
      nome: "José Santos",
      idade: 68,
      sexo: "M",
      queixaPrincipal: "Dor nas pernas ao caminhar",
      historicoDoenca: "Claudicação: dor após 100m, melhora em repouso",
      antecedentes: ["Hipertensão", "Diabetes tipo 2", "Ex-tabagista"],
      profissao: "Aposentado",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: ["Metformina 500mg", "Losartana 50mg"],
    },

    respostas_do_paciente: {
      inicial: "Doutor, minha perna dói quando caminho.",
      dor: "Aqui na panturrilha, tipo uma câimbra.",
      distancia: "Uns 100-150 metros.",
      repouso: "Sim, descansando passa.",
      ferida: "Não, mas a pele fica mais escura.",
      tabagismo: "Fumei, parei há 1 ano.",
      diabetes: "Sim, tomo remédio.",
    },
    respostaPaciente: {
      inicial: "Doutor, minha perna dói quando caminho.",
      dor: "Aqui na panturrilha, tipo uma câimbra.",
      distancia: "Uns 100-150 metros.",
      repouso: "Sim, descansando passa.",
      ferida: "Não, mas a pele fica mais escura.",
      tabagismo: "Fumei, parei há 1 ano.",
      diabetes: "Sim, tomo remédio.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "155/95 mmHg",
        frequenciaCardiaca: 82,
        frequenciaRespiratoria: 16,
        temperatura: 36.8,
        saturacaoOxigenio: 96,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "155/95 mmHg",
      frequenciaCardiaca: 82,
      frequenciaRespiratoria: 16,
      temperatura: 36.8,
      saturacaoOxigenio: 96,
      glicemia: 145,
    },

    exame_fisico: {
      correto: {
        inspecao: "Pele dos membros inferiores com aspecto atrófico, cianose leve",
        palpacao: "Pulsos femorais presentes, poplíteos reduzidos, distais ausentes",
        ausculta: "Sopro sobre artérias ilíacas",
        percussao: "Normal",
        observacoes: "Critério: claudicação intermitente + pulsos distais ausentes",
        regiao: "Membros inferiores",
        achados_positivos: ["Claudicação", "Pulsos distais ausentes", "Cianose"],
        achados_negativos: ["Úlcera ou gangrena"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Pele atrófica, cianose leve",
      palpacao: "Pulsos poplíteos reduzidos, distais ausentes",
      ausculta: "Sopro sobre artérias",
      percussao: "Normal",
      observacoes: "DAOP confirmada clinicamente",
    },

    exame_fisico_interativo: {
      membros: {
        pulsos: "Pulsos femorais palpáveis, poplíteos reduzidos, dorsais pedis ausentes bilateralmente",
        perfusao: "Cianose em extremidades",
        cianose: "Presente em dedos",
        temperatura: "Extremidades mais frias",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Índice Tornozelo-Braquial (ITB)",
        descricao: "Razão PA tornozelo/braço",
        resultado: "ITB 0.65 bilateralmente",
        valor_referencia: ">0.9",
        interpretacao: "DAOP moderada",
      },
      {
        nome: "Ultrassom Doppler Membros Inferiores",
        descricao: "Avaliação hemodinâmica",
        resultado: "Estenose >70% em poplítea bilateralmente",
        valor_referencia: "Sem estenose",
        interpretacao: "DAOP confirmada",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Doença Arterial Obstrutiva Periférica Estágio II",
        probabilidade: 95,
        criterios_minimos: ["Claudicação", "Pulsos reduzidos", "ITB <0.9", "Doppler com estenose"],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Neuropatia Diabética",
        criterios_exclusao: ["ITB normal", "Pulsos presentes"],
        achados_que_descartam: ["ITB reduzido"],
      },
    ],
    examesIndicados: ["ITB", "Doppler", "ECG", "Lipidograma"],

    conduta_esperada: {
      imediata: ["Educação sobre tabagismo", "Cuidados com pés"],
      curto_prazo: ["Aspirina 100mg/dia", "Cilostazol 100mg 2x/dia", "Controle HAS e DM"],
      longo_prazo: ["Monitorização com ITB", "Angioplastia se limitante"],
      encaminhamentos: ["Angiologia"],
    },
    condutaCorreta: "Antiagregante, cilostazol, reforço cessação tabágica, controle metabólico, angiologia",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["ITB 0.5-0.9", "Claudicação"],
        descricao: "DAOP moderada",
        recomendacao: "Terapia médica + avaliação vascular",
      },
    ],

    erros_criticos: [
      {
        erro: "Não solicitar ITB",
        descricao: "ITB é teste fundamental não-invasivo",
        penalidade: 1.5,
        evitavel: true,
      },
      {
        erro: "Confundir com neuropatia diabética",
        descricao: "DAOP tem pulsos reduzidos; neuropatia tem pulsos normais",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou padrão de claudicação", realizado: false, critico: true },
      { item: "Palpou pulsos sistematicamente", realizado: false, critico: true },
      { item: "Solicitou ITB", realizado: false, critico: true },
      { item: "Solicitou ultrassom Doppler", realizado: false, critico: true },
      { item: "Prescreveu antiagregante", realizado: false, critico: true },
      { item: "Encaminhou para angiologia", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      { criterio: "Anamnese e Fatores de Risco", peso: 20, descricao: "Investigação de claudicação e tabagismo", pontuacao_maxima: 20 },
      { criterio: "Exame Vascular", peso: 30, descricao: "Palpação de pulsos + ITB", pontuacao_maxima: 30 },
      { criterio: "Diagnóstico", peso: 25, descricao: "Reconhecimento de DAOP", pontuacao_maxima: 25 },
    ],

    modelo_soap: {
      subjetivo: { secao: "S", componentes_obrigatorios: ["Claudicação", "Fatores de risco", "Tabagismo"] },
      objetivo: { secao: "O", componentes_obrigatorios: ["Pulsos", "ITB", "Doppler"] },
      avaliacao: { secao: "A", componentes_obrigatorios: ["DAOP estágio II"] },
      plano: { secao: "P", componentes_obrigatorios: ["Antiagregante", "Cilostazol", "Angiologia"] },
    },

    feedback_modelo: {
      acertos_esperados: ["Investigou padrão de claudicação", "Palpou pulsos", "Solicitou ITB", "Prescreveu antiagregante"],
      erros_comuns: ["Não examinar pulsos", "Confundir com neuropatia", "Não solicitar testes vasculares"],
      orientacoes_pedagogicas: ["DAOP = vascular, não neurológico", "ITB <0.9 confirma DAOP", "Antiagregante é primeira linha"],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer DAOP pela claudicação, examinar pulsos sistematicamente, solicitar ITB/Doppler. Não confundir com neuropatia.",
      comunicacao: ["ouviu descrição de claudicação", "explicou próximos passos"],
      anamnese: ["investigou padrão de claudicação", "perguntou sobre tabagismo", "investigou comorbidades"],
      exame_fisico: ["palpou pulsos bilateralmente", "avaliou temperatura", "procurou sinais de isquemia"],
      exames_complementares: ["solicitou ITB", "solicitou Doppler", "solicitou ECG"],
      raciocinio: ["reconheceu DAOP", "diferenciou de neuropatia"],
      conduta: ["prescreveu antiagregante", "encaminhou para angiologia"],
      soap: ["documentou claudicação", "registrou pulsos reduzidos", "reconheceu DAOP"],
    },

    temaOSCE: "DAOP",
    subtopicosOSCE: ["Claudicação intermitente", "ITB reduzido", "Pulsos periféricos", "Ultrassom Doppler", "Antiagregante"],
    diagnosticoCorreto: "Doença Arterial Obstrutiva Periférica",
  },

  {
    // ====== CASO 16: Derrame Pleural ======
    id: "16",
    titulo: "Derrame Pleural",
    sistema: "Respiratório",
    tema: "Síndrome Pleural",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Diagnosticar derrame pleural e identificar etiologia",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Marina Silva",
      idade: 45,
      sexo: "Feminino",
      queixa_principal: "Falta de ar e dor no peito",
      historia_breve: "Dispneia progressiva há 1 semana, dor pleurítica, ausência de tosse produtiva",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Derrame Pleural (provável insuficiência cardíaca)",
      diagnosticos_diferenciais: ["Pneumonia", "Tuberculose", "Malignidade", "Embolismo pulmonar"],
      sindromes_associadas: ["Síndrome de desconforto respiratório"],
    },

    descricaoBreve: "Paciente com dispneia, redução do murmúrio vesicular unilateral, macicez à percussão",
    categoria: "Derrame Pleural",
    paciente: {
      id: "pac-016",
      nome: "Marina Silva",
      idade: 45,
      sexo: "F",
      queixaPrincipal: "Falta de ar e dor no peito",
      historicoDoenca: "Dispneia progressiva há 1 semana, dor ao respirar",
      antecedentes: ["Insuficiência cardíaca", "Hipertensão"],
      profissao: "Enfermeira",
      estado_civil: "Divorciada",
      alergias: [],
      medicamentos_em_uso: ["Enalapril", "Furosemida"],
    },

    respostas_do_paciente: {
      inicial: "Doutora, tô muito sem ar, começou de repente.",
      respiracao: "Não consigo respirar bem, é muito incômodo.",
      tosse: "Não, não tenho tosse.",
      dor: "Sim, quando respiro fundo dói aqui no peito.",
      inchaço: "Meus pés incham, tomo água demais acho.",
      coracao: "Tenho insuficiência cardíaca diagnosticada.",
    },
    respostaPaciente: {
      inicial: "Doutora, tô muito sem ar, começou de repente.",
      respiracao: "Não consigo respirar bem.",
      tosse: "Não, não tenho tosse.",
      dor: "Dói ao respirar fundo.",
      inchaço: "Pés inchados.",
      coracao: "Tenho insuficiência cardíaca.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "135/85 mmHg",
        frequenciaCardiaca: 104,
        frequenciaRespiratoria: 26,
        temperatura: 36.9,
        saturacaoOxigenio: 88,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "135/85 mmHg",
      frequenciaCardiaca: 104,
      frequenciaRespiratoria: 26,
      temperatura: 36.9,
      saturacaoOxigenio: 88,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente dispneica, taquipneica, ausência de movimentação do hemitórax direito",
        palpacao: "Redução de expansão à direita, frêmito reduzido",
        ausculta: "Redução de murmúrio vesicular à direita, ausência de sons respiratórios na base direita",
        percussao: "Macicez à direita, redução de timpanismo",
        observacoes: "Sinais clássicos de derrame pleural",
        regiao: "Hemitórax direito",
        achados_positivos: ["Macicez à percussão", "Redução de MV", "Taquipneia"],
        achados_negativos: ["Crepitações", "Sibilos"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Assimetria torácica, taquipneia",
      palpacao: "Redução de expansão à direita",
      ausculta: "Redução de murmúrio à base direita",
      percussao: "Macicez à direita",
      observacoes: "Derrame pleural evidente",
    },

    exame_fisico_interativo: {
      respiratorio: {
        inspecao_torax: "Assimetria, taquipneia 26 ipm",
        expansibilidade: "Reduzida à direita",
        fremito_toracovocal: "Reduzido à direita",
        percussao: "Macicez à base direita",
        ausculta_pulmonar: "Murmúrio vesicular reduzido/ausente à base direita",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Radiografia de Tórax PA e Perfil",
        descricao: "Avaliação do derrame",
        resultado: "Opacidade homogênea na base direita com menisco",
        valor_referencia: "Normal",
        interpretacao: "Derrame pleural unilateral",
      },
      {
        nome: "Ultrassom Pleural",
        descricao: "Quantificação do derrame",
        resultado: "Derrame pleural 500-600 mL",
        valor_referencia: "Ausência de derrame",
        interpretacao: "Derrame moderado",
      },
      {
        nome: "BNP",
        descricao: "Marcador de insuficiência cardíaca",
        resultado: "456 pg/mL",
        valor_referencia: "<100 pg/mL",
        interpretacao: "Elevado",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Derrame Pleural por Insuficiência Cardíaca",
        probabilidade: 85,
        criterios_minimos: ["Dispneia", "Redução de MV", "Macicez", "RX com derrame", "BNP elevado"],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Tuberculose Pleural",
        criterios_exclusao: ["BNP elevado", "Sem febre prolongada"],
        achados_que_descartam: ["História cardíaca positiva"],
      },
    ],
    examesIndicados: ["RX Tórax", "Ultrassom", "BNP", "Ecocardiograma"],

    conduta_esperada: {
      imediata: ["Oxigenioterapia", "Posicionamento sentado"],
      curto_prazo: ["Otimizar diurético", "Ecocardiograma", "Considerar toracocentese se compressão"],
      longo_prazo: ["Controle de insuficiência cardíaca", "Seguimento cardiológico"],
      encaminhamentos: ["Cardiologia"],
    },
    condutaCorreta: "Oxigenioterapia, otimizar diurético, ecocardiograma, tratar IC subjacente",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["SpO2 88%", "FR 26"],
        descricao: "Derrame com redução de oxigenação",
        recomendacao: "Oxigenioterapia, considerar toracocentese",
      },
    ],

    erros_criticos: [
      {
        erro: "Não solicitar radiografia de tórax",
        descricao: "RX é fundamental para confirmar derrame",
        penalidade: 1.5,
        evitavel: true,
      },
      {
        erro: "Não investigar etiologia",
        descricao: "Identificar causa é essencial para tratamento",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou duração de sintomas", realizado: false, critico: true },
      { item: "Realizou ausculta completa bilateralmente", realizado: false, critico: true },
      { item: "Percutiu procurando macicez", realizado: false, critico: true },
      { item: "Solicitou radiografia de tórax", realizado: false, critico: true },
      { item: "Investigou etiologia", realizado: false, critico: true },
      { item: "Indicou oxigenioterapia", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      { criterio: "Exame Físico", peso: 25, descricao: "Ausculta e percussão adequadas", pontuacao_maxima: 25 },
      { criterio: "Diagnóstico", peso: 25, descricao: "Solicitação de RX e investigação de etiologia", pontuacao_maxima: 25 },
      { criterio: "Conduta", peso: 20, descricao: "Oxigenioterapia e tratamento de causa", pontuacao_maxima: 20 },
    ],

    modelo_soap: {
      subjetivo: { secao: "S", componentes_obrigatorios: ["Dispneia progressiva", "Dor pleurítica", "História cardíaca"] },
      objetivo: { secao: "O", componentes_obrigatorios: ["SpO2 reduzida", "Redução de MV", "Macicez", "RX com derrame"] },
      avaliacao: { secao: "A", componentes_obrigatorios: ["Derrame pleural", "Provável causa cardíaca"] },
      plano: { secao: "P", componentes_obrigatorios: ["Oxigenioterapia", "Otimizar diurético", "Ecocardiograma"] },
    },

    feedback_modelo: {
      acertos_esperados: ["Reconheceu redução de MV", "Procurou macicez", "Solicitou RX", "Indicou oxigenioterapia"],
      erros_comuns: ["Não auscultar bilateralmente", "Não percutir procurando macicez"],
      orientacoes_pedagogicas: ["Derrame: redução de MV + macicez + opacidade em RX", "Investigar causa (cardíaca, infecciosa, maligna)"],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer derrame pleural clinicamente: redução de MV, macicez, dyspnea. Solicitar RX. Investigar causa. Oxigenioterapia.",
      comunicacao: ["tranquilizou paciente dispneica", "explicou próximos passos"],
      anamnese: ["investigou início e progressão", "perguntou sobre fatores de risco"],
      exame_fisico: ["ausculta bilateral procurando MV reduzido", "percussão procurando macicez"],
      exames_complementares: ["solicitou RX", "solicitou ultrassom/ecocardiograma"],
      raciocinio: ["reconheceu derrame pleural"],
      conduta: ["indicou oxigenioterapia", "investigou etiologia"],
      soap: ["documentou redução de MV + macicez", "reconheceu derrame"],
    },

    temaOSCE: "Síndromes pleurais",
    subtopicosOSCE: ["Derrame pleural", "Redução de murmúrio vesicular", "Macicez à percussão", "RX com opacidade", "Investigação de etiologia"],
    diagnosticoCorreto: "Derrame Pleural",
  },

  {
    // ====== CASO 17: Anemia Ferropriva ======
    id: "17",
    titulo: "Anemia Ferropriva",
    sistema: "Hematológico",
    tema: "Anemias",
    nivel: "iniciante",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Diagnosticar anemia ferropriva e identificar fonte de sangramento",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Lucia Martins",
      idade: 52,
      sexo: "Feminino",
      queixa_principal: "Fraqueza e cansaço",
      historia_breve: "Sentindo fraqueza há 3 meses, cansaço ao realizar tarefas simples",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Anemia Ferropriva (Hemoglobina 8.5 g/dL, ferritina <15 ng/mL)",
      diagnosticos_diferenciais: ["Anemia de doença crônica", "Anemia megaloblástica", "Hipotireoidismo"],
      sindromes_associadas: ["Síndrome de deficiência de ferro"],
    },

    descricaoBreve: "Paciente com palidez, taquicardia, hemoglobina reduzida, indices microcíticos",
    categoria: "Anemia",
    paciente: {
      id: "pac-017",
      nome: "Lucia Martins",
      idade: 52,
      sexo: "F",
      queixaPrincipal: "Fraqueza e cansaço",
      historicoDoenca: "Fraqueza progressiva há 3 meses, cansaço ao subir escada",
      antecedentes: ["Menstruações abundantes", "Sem antecedentes relevantes"],
      profissao: "Secretária",
      estado_civil: "Viúva",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Doutora, tô muito fraca, cansa rápido.",
      cansaco: "Não consigo fazer tarefas simples, fico sem ar subindo escada.",
      tontura: "Sim, tontura ao levantar rápido.",
      sangramento: "Meu ciclo é muito abundante, tenho que trocar absorvente a cada hora.",
      tarry_stool: "Não, não tenho isso não.",
      alimentos: "Raramente como carne.",
    },
    respostaPaciente: {
      inicial: "Doutora, tô muito fraca.",
      cansaco: "Sem ar subindo escada.",
      tontura: "Ao levantar rápido.",
      sangramento: "Menstruação muito abundante.",
      tarry_stool: "Não.",
      alimentos: "Raramente como carne.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "120/75 mmHg",
        frequenciaCardiaca: 108,
        frequenciaRespiratoria: 20,
        temperatura: 36.8,
        saturacaoOxigenio: 97,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "120/75 mmHg",
      frequenciaCardiaca: 108,
      frequenciaRespiratoria: 20,
      temperatura: 36.8,
      saturacaoOxigenio: 97,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente pálida, conjuntivas e palmas claras, sem icterícia",
        palpacao: "Sem hepatoesplenomegalia",
        ausculta: "Sopro sistólico leve (fluxo anêmico)",
        percussao: "Normal",
        observacoes: "Sinais de anemia crônica",
        regiao: "Geral",
        achados_positivos: ["Palidez palmar", "Conjuntivas claras", "Taquicardia"],
        achados_negativos: ["Esplenomegalia", "Icterícia"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Palidez, conjuntivas claras",
      palpacao: "Sem hepatoesplenomegalia",
      ausculta: "Sopro sistólico leve (fluxo)",
      percussao: "Normal",
      observacoes: "Sinais de anemia",
    },

    exame_fisico_interativo: {
      geral: {
        coloracao: "Pálida, conjuntivas e leitos ungueais com redução de coloração",
        estado_geral: "Leve desconforto, cansada",
      },
      cardiovascular: {
        ausculta_cardiaca: "Sopro sistólico leve, frequência cardíaca elevada (compensatória)",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Hemograma Completo",
        descricao: "Série de glóbulos",
        resultado: "Hemoglobina 8.5 g/dL, Hematócrito 28%, VCM 65 fL, HCM 22 pg",
        valor_referencia: "Hb >12 g/dL, VCM 80-100 fL",
        interpretacao: "Anemia microcítica hipocrômica",
      },
      {
        nome: "Ferritina",
        descricao: "Depósito de ferro",
        resultado: "Ferritina 12 ng/mL",
        valor_referencia: ">30 ng/mL",
        interpretacao: "Ferro deficiente",
      },
      {
        nome: "Ferro sérico e TIBC",
        descricao: "Metabolismo de ferro",
        resultado: "Ferro sérico 35 μg/dL, TIBC 450 μg/dL",
        valor_referencia: "Ferro 60-170 μg/dL, TIBC <360",
        interpretacao: "Ferro reduzido, TIBC elevada (deficiência)",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Anemia Ferropriva",
        probabilidade: 95,
        criterios_minimos: ["Hemoglobina <12", "Microcitose", "Ferritina <15", "Menstruações abundantes"],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Anemia de Doença Crônica",
        criterios_exclusao: ["Ferritina normal-elevada"],
        achados_que_descartam: ["Ferritina baixa"],
      },
    ],
    examesIndicados: ["Hemograma", "Ferritina", "Ferro sérico", "TIBC", "Endoscopia se >50 anos"],

    conduta_esperada: {
      imediata: ["Suplementação de ferro oral (sulfato ferroso 325mg)"],
      curto_prazo: ["Investigação de causa de sangramento", "Repetir hemograma após 8 semanas"],
      longo_prazo: ["Acompanhamento de menstruações", "Dieta rica em ferro"],
      encaminhamentos: ["Ginecologia se menorragia persistente", "Gastroenterologia se sangramento GI"],
    },
    condutaCorreta: "Suplementação de ferro, investigação de sangramento, repetir hemograma, encaminhar se necessário",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["Hb 8-10 g/dL", "Taquicardia"],
        descricao: "Anemia ferropriva moderada",
        recomendacao: "Suplementação oral, investigação de fonte",
      },
    ],

    erros_criticos: [
      {
        erro: "Não investigar origem do sangramento",
        descricao: "Mulheres em idade fértil: menstruação; maiores: considerar sangramento GI",
        penalidade: 2,
        evitavel: true,
      },
      {
        erro: "Prescrever ferro IV sem tentar oral",
        descricao: "Ferro oral é primeira linha",
        penalidade: 1.5,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou sintomas de anemia", realizado: false, critico: true },
      { item: "Perguntou sobre menstruações/sangramento", realizado: false, critico: true },
      { item: "Solicitou hemograma", realizado: false, critico: true },
      { item: "Solicitou ferritina", realizado: false, critico: true },
      { item: "Identificou microcitose", realizado: false, critico: true },
      { item: "Prescreveu sulfato ferroso", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      { criterio: "Anamnese", peso: 20, descricao: "Investigação de sangramento", pontuacao_maxima: 20 },
      { criterio: "Exames", peso: 30, descricao: "Hemograma e ferritina", pontuacao_maxima: 30 },
      { criterio: "Diagnóstico", peso: 20, descricao: "Reconhecimento de deficiência de ferro", pontuacao_maxima: 20 },
    ],

    modelo_soap: {
      subjetivo: { secao: "S", componentes_obrigatorios: ["Fraqueza", "Cansaço ao esforço", "Menstruação abundante"] },
      objetivo: { secao: "O", componentes_obrigatorios: ["Palidez", "Hemograma microcítico", "Ferritina <15"] },
      avaliacao: { secao: "A", componentes_obrigatorios: ["Anemia ferropriva"] },
      plano: { secao: "P", componentes_obrigatorios: ["Sulfato ferroso", "Investigação de sangramento"] },
    },

    feedback_modelo: {
      acertos_esperados: ["Investigou menstruações", "Solicitou hemograma", "Identificou microcitose", "Prescreveu ferro"],
      erros_comuns: ["Não investigar origem", "Prescrever ferro IV"],
      orientacoes_pedagogicas: ["Anemia ferropriva: Hb baixa + MCV baixo + ferritina baixa", "Sempre investigue origem"],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer anemia ferropriva: sintomas + palidez + hemograma microcítico + ferritina baixa. Investigar sangramento.",
      comunicacao: ["perguntou sobre ciclo menstrual com empatia"],
      anamnese: ["investigou duração de sintomas", "perguntou sobre menstruações", "perguntou sobre alimentação"],
      exame_fisico: ["avaliou palidez", "ausculta para sopro"],
      exames_complementares: ["solicitou hemograma", "solicitou ferritina"],
      raciocinio: ["reconheceu microcitose = deficiência ferro"],
      conduta: ["prescreveu ferro oral"],
      soap: ["documentou palidez e fraqueza", "reconheceu anemia ferropriva"],
    },

    temaOSCE: "Anemias",
    subtopicosOSCE: ["Anemia ferropriva", "Microcitose e hipocromia", "Ferritina sérica", "Fonte de sangramento", "Suplementação de ferro"],
    diagnosticoCorreto: "Anemia Ferropriva",
  },

  {
    // ====== CASO 18: IAM SEM SUPRA DE ST ======
    id: "18",
    titulo: "Infarto Agudo do Miocárdio sem Supra de ST",
    sistema: "Cardiovascular",
    tema: "Síndrome Coronariana Aguda",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Diagnosticar IAM sem supra de ST, reconhecer risco e estratificar para angiografia",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Marcos Antonio",
      idade: 58,
      sexo: "Masculino",
      queixa_principal: "Dor no peito há 3 horas",
      historia_breve: "Dor opressiva no peito com sudorese, melhorou um pouco em repouso mas persiste",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Infarto Agudo do Miocárdio sem Supra de ST",
      diagnosticos_diferenciais: ["Angina Instável", "Pericardite Aguda", "Embolia Pulmonar"],
      sindromes_associadas: ["Síndrome Coronariana Aguda"],
    },

    descricaoBreve: "Paciente com dor torácica típica, ECG sem supra, troponina elevada indicando necrose miocárdica",
    categoria: "SCA",
    paciente: {
      id: "pac-018",
      nome: "Marcos Antonio",
      idade: 58,
      sexo: "M",
      queixaPrincipal: "Dor no peito há 3 horas",
      historicoDoenca: "Dor começou durante esforço físico leve, alivia com repouso mas não desaparece",
      antecedentes: ["HAS", "Dislipidemia", "Tabagismo ativo"],
      profissao: "Motorista",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: ["Enalapril 10mg"],
    },

    respostas_do_paciente: {
      inicial: "Tô com uma dor no peito que apareceu enquanto eu tava trabalhando",
      dor: "É uma dor de aperto, no meio do peito, às vezes irradia pro braço",
      intensidade: "7 em 10, diminuiu um pouco mas continua",
      inicio: "Começou há umas 3 horas, tava dirigindo",
      suor: "Sim, suei bastante no começo",
      respiracao: "Um pouco de falta de ar, sim",
      nausea: "Sim, sinto um pouco de enjôo",
      alerta: "Tenho medo de estar infartando",
    },
    respostaPaciente: {
      inicial: "Tô com uma dor no peito que apareceu enquanto eu tava trabalhando",
      dor: "É uma dor de aperto, no meio do peito",
      intensidade: "7 em 10",
      inicio: "Começou há umas 3 horas",
      suor: "Sim",
      respiracao: "Um pouco de falta de ar",
      nausea: "Sim",
      alerta: "Tenho medo de estar infartando",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "155/92 mmHg",
        frequenciaCardiaca: 95,
        frequenciaRespiratoria: 18,
        temperatura: 36.8,
        saturacaoOxigenio: 96,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "155/92 mmHg",
      frequenciaCardiaca: 95,
      frequenciaRespiratoria: 18,
      temperatura: 36.8,
      saturacaoOxigenio: 96,
      glicemia: 112,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente ansioso, leve diaforese, aparente desconforto",
        palpacao: "Leve sensibilidade precordial, sem alterações estruturais",
        ausculta: "Taquicardia, ritmo regular, sem sopros audíveis",
        percussao: "Normal",
        observacoes: "Sinais de desconforto coronariano, necessário ECG urgente",
        regiao: "Precórdio",
        achados_positivos: ["Taquicardia", "Leve diaforese"],
        achados_negativos: ["Sopros", "Arritmias"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Ansioso, leve diaforese",
      palpacao: "Sensibilidade precordial leve",
      ausculta: "Taquicardia regular, sem sopros",
      percussao: "Normal",
      observacoes: "Compatível com desconforto coronariano",
    },

    exame_fisico_interativo: {
      geral: {
        estado_geral: "Paciente ansioso, em aparente desconforto, normocor",
        consciencia: "Lúcido e orientado",
      },
      cardiovascular: {
        inspecao_precordial: "Sem abaulamentos, sem cicatrizes visíveis",
        ausculta_cardiaca: "Bulhas normofonéticas, FC 95 bpm, ritmo regular, sem sopros",
        pulsos: "Presentes e simétricos bilateralmente",
        turgencia_jugular: "Sem turgência jugular",
        edema: "Sem edema em membros",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "ECG (Eletrocardiograma)",
        descricao: "12 derivações",
        resultado: "Infradesnivelamento de ST 2-3mm em D2, D3, aVF; inversão de onda T",
        valor_referencia: "Segmento ST isoelétrico",
        interpretacao: "Isquemia inferior, sem supra persistente",
      },
      {
        nome: "Troponina I",
        descricao: "Biomarcador cardíaco",
        resultado: "1.2 ng/mL",
        valor_referencia: "<0.04 ng/mL",
        interpretacao: "Elevada - confirmação de necrose miocárdica",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Infarto Agudo do Miocárdio sem Supra de ST",
        probabilidade: 90,
        criterios_minimos: [
          "Dor torácica típica",
          "Troponina elevada",
          "ECG com infradesnivelamento ou inversão de T",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Angina Instável",
        criterios_exclusao: ["Troponina elevada"],
        achados_que_descartam: ["Marcador cardíaco positivo"],
      },
    ],
    examesIndicados: [
      "ECG seriado",
      "Troponina seriada",
      "Hemograma",
      "Perfil lipídico",
      "Creatinina",
      "Ecocardiograma",
      "Angiografia coronariana",
    ],

    conduta_esperada: {
      imediata: [
        "Monitorização cardíaca contínua",
        "Oxigenioterapia se SpO2 <90%",
        "Acesso venoso",
        "Aspirina 500mg",
        "Clopidogrel ou ticagrelor conforme protocolo",
        "Heparina",
        "Analgesia se necessário",
      ],
      curto_prazo: [
        "Estratificação de risco",
        "Angiografia coronariana diagnóstica",
        "Possível intervenção coronariana percutânea",
        "Internação em UCO",
      ],
      longo_prazo: [
        "Estatina",
        "Betabloqueador",
        "Reabilitação cardíaca",
        "Modificação de fatores de risco",
      ],
      encaminhamentos: ["Cardiologia", "Unidade Coronariana"],
    },
    condutaCorreta: "Monitorização, aspirina, clopidogrel, heparina, angiografia diagnóstica, manejo conforme risco",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: [
          "Troponina elevada",
          "Infradesnivelamento de ST",
          "Taquicardia",
        ],
        descricao: "Infarto estabelecido com risco de complicações",
        recomendacao: "Internação em UCO, angiografia urgente",
      },
    ],

    erros_criticos: [
      {
        erro: "Não solicitar troponina",
        descricao: "Marcador diferencia IAM de angina instável",
        penalidade: 2,
        evitavel: true,
      },
      {
        erro: "Atrasar angiografia coronariana",
        descricao: "Angiografia precoce melhora prognóstico",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Investigou características completas da dor",
        realizado: false,
        critico: true,
      },
      {
        item: "Mediu sinais vitais",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou ECG",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou troponina",
        realizado: false,
        critico: true,
      },
      {
        item: "Iniciou dupla antiagregação",
        realizado: false,
        critico: true,
      },
      {
        item: "Encaminhou para angiografia",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de SCA",
        peso: 25,
        descricao: "Diferenciação de outras causas de dor torácica",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Manejo antitrombótico",
        peso: 20,
        descricao: "Dupla antiagregação e anticoagulação apropriadas",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Estratificação e encaminhamento",
        peso: 20,
        descricao: "Indicação apropriada de angiografia",
        pontuacao_maxima: 20,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Características da dor (OLDCARTS)",
          "Fatores de risco cardiovascular",
          "Sintomas associados",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Sinais vitais",
          "Exame cardiovascular",
          "ECG com interpretação",
          "Troponina",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "IAM sem supra de ST",
          "Diagnósticos diferenciais",
          "Estratificação de risco",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Dupla antiagregação",
          "Anticoagulação",
          "Angiografia coronariana",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu apresentação de SCA",
        "Solicitou ECG e troponina",
        "Iniciou dupla antiagregação",
        "Encaminhou para angiografia coronariana",
        "Estratificou risco apropriadamente",
      ],
      erros_comuns: [
        "Confundir com angina estável",
        "Atrasar troponina",
        "Não considerar angiografia urgente",
      ],
      orientacoes_pedagogicas: [
        "NSTEMI: troponina elevada + ECG sem supra = risco moderado a alto",
        "Angiografia diagnóstica dentro de 24-72h melhora prognóstico",
        "Dupla antiagregação é standard em SCA",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Diagnosticar NSTEMI pelos sinais clínicos, ECG e troponina; iniciar antitrombóticos apropriados; estratificar risco e encaminhar para angiografia",
      comunicacao: [
        "explicou a gravidade da situação",
        "tranquilizou o paciente",
        "explicou necessidade de internação",
      ],
      anamnese: [
        "investigou características da dor",
        "pesquisou fatores de risco",
        "investigou sintomas associados",
      ],
      exame_fisico: [
        "mediu sinais vitais corretamente",
        "realizou ausculta cardíaca e respiratória",
        "avaliou perfusão periférica",
      ],
      exames_complementares: [
        "solicitou ECG urgente",
        "solicitou troponina seriada",
        "considerou ecocardiograma",
      ],
      raciocinio: [
        "reconheceu apresentação compatível com NSTEMI",
        "interpretou ECG corretamente",
        "estratificou risco apropriadamente",
      ],
      conduta: [
        "iniciou dupla antiagregação",
        "prescreveu anticoagulação",
        "encaminhou para angiografia",
      ],
      soap: [
        "documentou características da dor",
        "registrou achados de SCA",
        "planejou manejo apropriado",
      ],
    },

    temaOSCE: "Síndrome Coronariana Aguda",
    subtopicosOSCE: [
      "IAM sem elevação de ST",
      "Troponina elevada",
      "ECG com infradesnivelamento de ST",
      "Dupla antiagregação",
      "Angiografia diagnóstica",
    ],
    diagnosticoCorreto: "Infarto Agudo do Miocárdio sem Supra de ST",
  },

  {
    // ====== CASO 19: ANGINA INSTÁVEL ======
    id: "19",
    titulo: "Angina Instável",
    sistema: "Cardiovascular",
    tema: "Síndrome Coronariana Aguda",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 11,
    objetivo_pedagogico: "Diagnosticar angina instável e reconhecer risco de progressão para infarto",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Fernanda Oliveira",
      idade: 62,
      sexo: "Feminino",
      queixa_principal: "Dor no peito em repouso",
      historia_breve: "Dor torácica típica que começou durante a madrugada, paciente nunca teve antes",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Angina Instável",
      diagnosticos_diferenciais: ["NSTEMI", "Pericardite", "Embolia Pulmonar"],
      sindromes_associadas: ["Síndrome Coronariana Aguda"],
    },

    descricaoBreve: "Paciente com dor torácica em repouso, ECG com alterações dinâmicas, troponina negativa (ao menos inicialmente)",
    categoria: "SCA",
    paciente: {
      id: "pac-019",
      nome: "Fernanda Oliveira",
      idade: 62,
      sexo: "F",
      queixaPrincipal: "Dor no peito em repouso",
      historicoDoenca: "Acordou com dor durante madrugada, paciente com histórico de sopro",
      antecedentes: ["HAS", "Histórico familiar de infarto"],
      profissao: "Enfermeira",
      estado_civil: "Viúva",
      alergias: ["Penicilina"],
      medicamentos_em_uso: ["Losartana 50mg"],
    },

    respostas_do_paciente: {
      inicial: "Acordei com uma dor muito ruim no peito durante a madrugada",
      dor: "Dor de aperto no meio do peito, às vezes irradia pro braço esquerdo",
      intensidade: "7, muito incômodo, não consigo relaxar",
      inicio: "Começou de repente durante o sono",
      suor: "Sim, acordei toda suada",
      respiracao: "Sim, falta de ar",
      repouso: "Melhorou um pouco mas não desapareceu",
      frequencia: "Meu filho comentou que tive dores no peito leves semanas atrás",
    },
    respostaPaciente: {
      inicial: "Acordei com uma dor no peito",
      dor: "Dor de aperto no peito",
      intensidade: "7",
      inicio: "Madrugada",
      suor: "Sim",
      respiracao: "Sim",
      repouso: "Melhorou um pouco",
      frequencia: "Dores semanas atrás",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "160/95 mmHg",
        frequenciaCardiaca: 92,
        frequenciaRespiratoria: 18,
        temperatura: 36.7,
        saturacaoOxigenio: 97,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "160/95 mmHg",
      frequenciaCardiaca: 92,
      frequenciaRespiratoria: 18,
      temperatura: 36.7,
      saturacaoOxigenio: 97,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente ansiosa, palidez discreta, aparente desconforto",
        palpacao: "Sem alterações significativas, sensibilidade leve em precórdio",
        ausculta: "Ritmo regular, FC 92, sem sopros audíveis",
        percussao: "Normal",
        observacoes: "Sinais compatíveis com desconforto isquêmico",
        regiao: "Precórdio",
        achados_positivos: ["Ansiedade", "Palidez"],
        achados_negativos: ["Sopros", "Arritmias"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Ansiosa, palidez discreta",
      palpacao: "Sem alterações relevantes",
      ausculta: "Ritmo regular, sem sopros",
      percussao: "Normal",
      observacoes: "Compatível com isquemia",
    },

    exame_fisico_interativo: {
      geral: {
        estado_geral: "Paciente ansiosa, em desconforto",
        consciencia: "Lúcida e orientada",
      },
      cardiovascular: {
        inspecao_precordial: "Sem alterações visíveis",
        ausculta_cardiaca: "Ritmo regular, FC 92 bpm, sem sopros audíveis",
        pulsos: "Presentes e simétricos",
        turgencia_jugular: "Normal",
        edema: "Ausente",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "ECG (Eletrocardiograma)",
        descricao: "12 derivações",
        resultado: "Inversão de onda T em D2, D3, aVF; segmento ST no nível ou levemente deprimido",
        valor_referencia: "Segmento ST isoelétrico",
        interpretacao: "Isquemia inferolateral sem supra",
      },
      {
        nome: "Troponina I inicial",
        descricao: "Biomarcador cardíaco",
        resultado: "<0.04 ng/mL",
        valor_referencia: "<0.04 ng/mL",
        interpretacao: "Normal (repetir em 3 horas)",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Angina Instável",
        probabilidade: 85,
        criterios_minimos: [
          "Dor isquêmica em repouso",
          "ECG com alterações dinâmicas",
          "Troponina negativa",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "NSTEMI",
        criterios_exclusao: ["Troponina elevada"],
        achados_que_descartam: ["Troponina positiva"],
      },
    ],
    examesIndicados: [
      "ECG seriado",
      "Troponina seriada",
      "Hemograma",
      "Eletrólitos",
      "Creatinina",
      "Ecocardiograma",
      "Angiografia coronariana",
    ],

    conduta_esperada: {
      imediata: [
        "Monitorização cardíaca contínua",
        "Oxigenioterapia se SpO2 <90%",
        "Aspirina 500mg",
        "Clopidogrel ou ticagrelor conforme protocolo",
        "Heparina",
        "Betabloqueador",
        "Nitrato sublingual",
      ],
      curto_prazo: [
        "Internação em UCO",
        "ECG seriado",
        "Troponina seriada em 3-6 horas",
        "Estratificação de risco",
        "Angiografia diagnóstica",
      ],
      longo_prazo: [
        "Estatina",
        "Reabilitação cardíaca",
        "Modificação de fatores de risco",
      ],
      encaminhamentos: ["Cardiologia", "Unidade Coronariana"],
    },
    condutaCorreta: "Internação, monitorização, ECG seriado, troponina seriada, antiagregantes, angiografia diagnóstica",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["Dor em repouso", "ECG com alterações", "Paciente idosa"],
        descricao: "Risco moderado a alto de evolução para IAM",
        recomendacao: "Internação em UCO, investigação urgente",
      },
    ],

    erros_criticos: [
      {
        erro: "Não internar para monitorização",
        descricao: "Risco de progressão para IAM é alto",
        penalidade: 2,
        evitavel: true,
      },
      {
        erro: "Não realizar ECG seriado",
        descricao: "Mudanças dinâmicas ajudam no diagnóstico",
        penalidade: 1.5,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu apresentação de angina instável",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou ECG urgente",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou troponina seriada",
        realizado: false,
        critico: true,
      },
      {
        item: "Decidiu internar para monitorização",
        realizado: false,
        critico: true,
      },
      {
        item: "Iniciou dupla antiagregação",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de SCA sem supra",
        peso: 25,
        descricao: "Diagnóstico diferencial apropriado",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Decisão de internação",
        peso: 25,
        descricao: "Reconhecimento de risco elevado",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Manejo inicial",
        peso: 15,
        descricao: "Antiagregantes e monitorização",
        pontuacao_maxima: 15,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Dor em repouso ou progressiva",
          "Antecedentes de dor leve",
          "Fatores de risco",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Sinais vitais",
          "ECG com alterações dinâmicas",
          "Troponina",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "Angina instável",
          "Risco de progressão",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Internação em UCO",
          "Antiagregação",
          "Monitorização",
          "Angiografia diagnóstica",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu angina instável",
        "Decidiu internar",
        "Solicitou ECG e troponina seriada",
        "Iniciou dupla antiagregação",
      ],
      erros_comuns: [
        "Confundir com gastrite",
        "Liberar para casa",
        "Esperar resultado de troponina para internar",
      ],
      orientacoes_pedagogicas: [
        "Angina instável = dor em repouso ou progressiva = SCA = internação obrigatória",
        "Troponina negativa não exclui angina instável",
        "ECG com alterações dinâmicas aumenta risco",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer angina instável como forma de SCA e indicar internação, ECG seriado e troponina seriada",
      comunicacao: [
        "explicou a gravidade",
        "tranquilizou a paciente",
        "explicou necessidade de internação",
      ],
      anamnese: [
        "investigou características da dor",
        "pesquisou antecedentes de dor",
        "investigou fatores de risco",
      ],
      exame_fisico: [
        "mediu sinais vitais",
        "realizou ausculta cardíaca",
        "avaliou perfusão",
      ],
      exames_complementares: [
        "solicitou ECG urgente",
        "solicitou troponina seriada",
      ],
      raciocinio: [
        "diagnosticou angina instável",
        "reconheceu risco de progressão",
      ],
      conduta: [
        "decidiu internar",
        "iniciou dupla antiagregação",
      ],
      soap: [
        "documentou características de SCA",
        "planejou investigação apropriada",
      ],
    },

    temaOSCE: "Síndrome Coronariana Aguda",
    subtopicosOSCE: [
      "Angina instável",
      "Dor em repouso",
      "ECG com alterações dinâmicas",
      "SCA sem elevação de ST",
      "Risco de progressão",
    ],
    diagnosticoCorreto: "Angina Instável",
  },

  {
    // ====== CASO 20: IAM COM SUPRA DE ST E TROMBÓLISE ======
    id: "20",
    titulo: "Infarto Agudo do Miocárdio com Supra de ST - Necessidade de Trombólise",
    sistema: "Cardiovascular",
    tema: "Síndrome Coronariana Aguda",
    nivel: "avancado",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Reconhecer IAMCSST, avaliar tempo de sintoma, indicar trombólise quando angioplastia indisponível",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Roberto Santos",
      idade: 56,
      sexo: "Masculino",
      queixa_principal: "Dor torácica súbita há 90 minutos",
      historia_breve: "Dor súbita enquanto dormia, sintomas típicos, paciente em região sem angioplastia disponível",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Infarto Agudo do Miocárdio com Supra de ST - Parede Anterior",
      diagnosticos_diferenciais: ["Dissecção aórtica", "Embolia pulmonar", "Pericardite"],
      sindromes_associadas: ["Síndrome Coronariana Aguda"],
    },

    descricaoBreve: "Paciente com dor típica, ECG com supra de ST, troponina ainda pode estar normal inicialmente, necessidade de reperfusão urgente",
    categoria: "SCA",
    paciente: {
      id: "pac-020",
      nome: "Roberto Santos",
      idade: 56,
      sexo: "M",
      queixaPrincipal: "Dor torácica súbita",
      historicoDoenca: "Acordou com dor súbita, está em pequena cidade sem angioplastia 24h",
      antecedentes: ["HAS", "Diabetes tipo 2", "Ex-tabagista"],
      profissao: "Fazendeiro",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: ["Metformina 500mg", "Losartana 50mg"],
    },

    respostas_do_paciente: {
      inicial: "Acordei com uma dor muito forte no peito, nunca senti algo assim",
      dor: "Dor intensa, no meio do peito, irradia pro braço e pescoco",
      intensidade: "9 em 10, pior dor da minha vida",
      inicio: "Começou há uns 90 minutos quando acordei",
      suor: "Sim, suei muito, sigo suado",
      respiracao: "Sim, muita falta de ar",
      nausea: "Sim, vomitei uma vez",
      panico: "Tenho certeza que vou morrer",
    },
    respostaPaciente: {
      inicial: "Acordei com uma dor muito forte no peito",
      dor: "Dor intensa, irradia pro braço",
      intensidade: "9",
      inicio: "90 minutos atrás",
      suor: "Sim",
      respiracao: "Sim, muita",
      nausea: "Sim, vomitei",
      panico: "Tenho certeza que vou morrer",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "170/100 mmHg",
        frequenciaCardiaca: 108,
        frequenciaRespiratoria: 24,
        temperatura: 36.9,
        saturacaoOxigenio: 93,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "170/100 mmHg",
      frequenciaCardiaca: 108,
      frequenciaRespiratoria: 24,
      temperatura: 36.9,
      saturacaoOxigenio: 93,
      glicemia: 145,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente em grande desconforto, diaforese profusa, palidez acentuada, ansiedade severa",
        palpacao: "Sensibilidade precordial importante",
        ausculta: "Taquicardia, possível B3, sem sopros ou arritmias evidentes",
        percussao: "Normal",
        observacoes: "Paciente em risco iminente de morte, necessário reperfusão URGENTE",
        regiao: "Precórdio",
        achados_positivos: ["Taquicardia", "Diaforese profusa", "Palidez acentuada"],
        achados_negativos: ["Sopros", "Arritmias"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Grande desconforto, diaforese profusa, palidez acentuada",
      palpacao: "Sensibilidade precordial",
      ausculta: "Taquicardia sem sopros",
      percussao: "Normal",
      observacoes: "Sinais de infarto extenso, emergência absoluta",
    },

    exame_fisico_interativo: {
      geral: {
        estado_geral: "Paciente em grande desconforto, diaforético, pálido, ansioso",
        consciencia: "Lúcido mas em pânico",
      },
      cardiovascular: {
        inspecao_precordial: "Diaforese evidente, palidez acentuada",
        ausculta_cardiaca: "Bulhas hipofonéticas, FC 108 bpm, ritmo regular, possível B3",
        pulsos: "Presentes mas finos",
        turgencia_jugular: "Leve elevação",
        edema: "Ausente",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "ECG (Eletrocardiograma)",
        descricao: "12 derivações - URGENTE",
        resultado: "Elevação de ST >3mm em V1-V3, depressão recíproca em D2, D3, aVF",
        valor_referencia: "Segmento ST isoelétrico",
        interpretacao: "IAMCSST anterior - Grande onda, indicação para reperfusão imediata",
      },
      {
        nome: "Troponina I",
        descricao: "Biomarcador cardíaco",
        resultado: "0.8 ng/mL ou ainda <0.04 ng/mL se muito precoce",
        valor_referencia: "<0.04 ng/mL",
        interpretacao: "Troponina pode estar em subida se muito precoce",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Infarto Agudo do Miocárdio com Supra de ST",
        probabilidade: 98,
        criterios_minimos: [
          "Dor isquêmica típica com duração >30 min",
          "Elevação de ST >=1mm em 2 derivações contíguas",
          "Necessidade de reperfusão em <120 minutos",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Dissecção aórtica",
        criterios_exclusao: ["ECG com supra localizado"],
        achados_que_descartam: ["Elevação focal de ST"],
      },
    ],
    examesIndicados: [
      "ECG IMEDIATO",
      "Troponina",
      "Hemograma",
      "Creatinina",
      "Eletrólitos",
      "Coagulograma",
    ],

    conduta_esperada: {
      imediata: [
        "Chamar Cardiologia URGENTE",
        "Monitorização cardíaca contínua",
        "Oxigenioterapia para manter SpO2 >94%",
        "Acesso venoso",
        "Aspirina 500mg",
        "Clopidogrel ou ticagrelor conforme protocolo",
        "Heparina",
        "Codeína ou Morfina para dor",
        "Nitroglicerina se PA sistólica >90 mmHg",
        "Avaliar candidatura à trombólise se angioplastia não disponível em <120min",
      ],
      curto_prazo: [
        "Se angioplastia disponível em <120min: transferência emergencial",
        "Se angioplastia >120min: indicar trombólise imediatamente",
        "Internação em UTI/UCO",
        "Monitorização hemodinâmica",
      ],
      longo_prazo: [
        "Revascularização complementar se necessário",
        "Reabilitação cardíaca",
        "Modificação de fatores de risco",
      ],
      encaminhamentos: ["Cardiologia", "Serviço de Hemodinâmica", "UTI/UCO"],
    },
    condutaCorreta: "IAMCSST = EMERGÊNCIA - Reperfusão urgente: angioplastia se <120min, senão trombólise imediata",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: [
          "Elevação de ST extensa",
          "Hipoxemia",
          "Taquicardia",
          "Instabilidade hemodinâmica",
        ],
        descricao: "Paciente em risco iminente de morte, necessário reperfusão URGENTE",
        recomendacao: "Transferência emergencial ou trombólise IMEDIATA",
      },
    ],

    erros_criticos: [
      {
        erro: "Atrasar ECG ou não reconhecer supra de ST",
        descricao: "ECG é essencial para diagnosticar IAMCSST",
        penalidade: 3,
        evitavel: true,
      },
      {
        erro: "Não indicar reperfusão em tempo hábil",
        descricao: "Tempo é crítico - reperfusão em <120min melhora mortalidade",
        penalidade: 3,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Solicitou ECG IMEDIATAMENTE",
        realizado: false,
        critico: true,
      },
      {
        item: "Interpretou ECG corretamente - reconheceu elevação de ST",
        realizado: false,
        critico: true,
      },
      {
        item: "Reconheceu como emergência que requer reperfusão",
        realizado: false,
        critico: true,
      },
      {
        item: "Avaliou tempo de sintoma e disponibilidade de angioplastia",
        realizado: false,
        critico: true,
      },
      {
        item: "Indicou trombólise se angioplastia indisponível em tempo",
        realizado: false,
        critico: true,
      },
      {
        item: "Iniciou antitrombóticos apropriados",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento como emergência",
        peso: 35,
        descricao: "IAMCSST = risco de morte iminente",
        pontuacao_maxima: 35,
      },
      {
        criterio: "Decisão de reperfusão apropriada",
        peso: 30,
        descricao: "Angioplastia ou trombólise em tempo hábil",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Manejo inicial apropriado",
        peso: 15,
        descricao: "Antitrombóticos, analgesia, oxigenioterapia",
        pontuacao_maxima: 15,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Dor isquêmica típica com duração >30 min",
          "Tempo exato do início",
          "Sintomas de alarme",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Sinais vitais com instabilidade",
          "ECG com elevação de ST",
          "Troponina",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "IAMCSST",
          "Avaliação de tempo para reperfusão",
          "Elegibilidade para trombólise",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Reperfusão urgente",
          "Angioplastia ou trombólise conforme disponibilidade",
          "Antitrombóticos",
          "Suporte hemodinâmico",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu IAMCSST",
        "Interpretou ECG corretamente",
        "Indicou reperfusão urgente",
        "Avaliou elegibilidade para trombólise",
        "Iniciou antitrombóticos",
      ],
      erros_comuns: [
        "Atrasar ECG",
        "Não reconhecer urgência",
        "Atrasar indicação de reperfusão",
        "Não estar familiarizado com protocolos de trombólise",
      ],
      orientacoes_pedagogicas: [
        "IAMCSST = EMERGÊNCIA = Reperfusão em <120 minutos salva vidas",
        "Tempo door-to-balloon <90 min, door-to-needle <30 min",
        "Protocolo: angioplastia preferida, trombólise se indisponível em tempo",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer IAMCSST como emergência, indicar reperfusão apropriada (angioplastia ou trombólise) em tempo hábil",
      comunicacao: [
        "demonstrou senso de urgência",
        "tranquilizou o paciente apesar da gravidade",
        "explicou necessidade de procedimento emergencial",
      ],
      anamnese: [
        "perguntou hora exata do início",
        "investigou sintomas de alarme",
        "investigou contraindicações a trombólise",
      ],
      exame_fisico: [
        "reconheceu sinais de choque cardiogênico",
        "avaliou risco de complicações",
      ],
      exames_complementares: [
        "solicitou ECG URGENTE",
        "interpretou corretamente",
        "solicitou troponina e testes laboratoriais",
      ],
      raciocinio: [
        "diagnosticou IAMCSST",
        "reconheceu urgência absoluta",
        "avaliou tempo e disponibilidade para reperfusão",
      ],
      conduta: [
        "indicou reperfusão apropriada",
        "iniciou antitrombóticos",
        "não adiou procedimento",
      ],
      soap: [
        "documentou tempo exato",
        "registrou critérios de IAMCSST",
        "planejou reperfusão",
      ],
    },

    temaOSCE: "Síndrome Coronariana Aguda",
    subtopicosOSCE: [
      "IAMCSST",
      "Elevação de ST",
      "Reperfusão urgente",
      "Trombólise",
      "Door-to-balloon time",
      "Emergência coronariana",
    ],
    diagnosticoCorreto: "Infarto Agudo do Miocárdio com Supra de ST",
  },

  {
    // ====== CASO 21: FIBRILAÇÃO ATRIAL ======
    id: "21",
    titulo: "Fibrilação Atrial Paroxística",
    sistema: "Cardiovascular",
    tema: "Arritmia",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 10,
    objetivo_pedagogico: "Reconhecer fibrilação atrial, avaliar urgência, controlar frequência e considerar anticoagulação",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Valter Pereira",
      idade: 68,
      sexo: "Masculino",
      queixa_principal: "Palpitações e falta de ar",
      historia_breve: "Começou há 2 horas com sensação de batidas aceleradas irregulares, dispneia leve",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Fibrilação Atrial Paroxística com resposta ventricular rápida",
      diagnosticos_diferenciais: ["Taquicardia supraventricular", "Flutter atrial", "Taquicardia sinusal"],
      sindromes_associadas: ["Arritmia supraventricular"],
    },

    descricaoBreve: "Paciente com pulso irregularmente irregular, ECG sem onda P organizada, fibrilação atrial de resposta rápida",
    categoria: "Arritmia",
    paciente: {
      id: "pac-021",
      nome: "Valter Pereira",
      idade: 68,
      sexo: "M",
      queixaPrincipal: "Palpitações",
      historicoDoenca: "Primeiro episódio de palpitações, paciente com HAS há anos",
      antecedentes: ["HAS", "Obesidade", "Ronco"],
      profissao: "Comerciante",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: ["Losartana 50mg", "Sinvastatina 20mg"],
    },

    respostas_do_paciente: {
      inicial: "Tô sentindo meu coração batendo acelerado e irregular",
      palpitacoes: "Sim, sinto como se pulasse batidas, muito desagradável",
      duracao: "Começou há umas 2 horas de repente",
      respiracao: "Sim, um pouco de falta de ar",
      tontura: "Um pouco, tô leve",
      dor_peito: "Não, mas incômodo no peito por causa da taquicardia",
      sincope: "Não, mas tive pavor",
      gatilho: "Não fiz nada diferente, começou do nada",
    },
    respostaPaciente: {
      inicial: "Tô sentindo meu coração acelerado",
      palpitacoes: "Sim, irregular",
      duracao: "2 horas",
      respiracao: "Sim, um pouco",
      tontura: "Um pouco",
      dor_peito: "Não",
      sincope: "Não",
      gatilho: "Do nada",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "145/88 mmHg",
        frequenciaCardiaca: 118,
        frequenciaRespiratoria: 20,
        temperatura: 36.8,
        saturacaoOxigenio: 95,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "145/88 mmHg",
      frequenciaCardiaca: 118,
      frequenciaRespiratoria: 20,
      temperatura: 36.8,
      saturacaoOxigenio: 95,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente ansioso, leve diaforese",
        palpacao: "Pulso irregularmente irregular, amplitude variável, frequência 110-120",
        ausculta: "Ritmo completamente irregular, sem sopros ou murmúrios adicionais",
        percussao: "Normal",
        observacoes: "Achados compatíveis com fibrilação atrial de resposta rápida",
        regiao: "Precórdio",
        achados_positivos: ["Pulso irregularmente irregular"],
        achados_negativos: ["Sopros", "Murmúrios"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Ansioso",
      palpacao: "Pulso irregularmente irregular",
      ausculta: "Ritmo completamente irregular",
      percussao: "Normal",
      observacoes: "Fibrilação atrial evidente",
    },

    exame_fisico_interativo: {
      geral: {
        estado_geral: "Ansioso, leve diaforese",
        consciencia: "Lúcido e orientado",
      },
      cardiovascular: {
        inspecao_precordial: "Sem alterações estruturais",
        ausculta_cardiaca: "Ritmo completamente irregular, FC média 118 bpm, amplitude de bulhas variável, sem sopros",
        pulsos: "Pulso apical >pulso radial (pulso deficitário), movimento irregular",
        turgencia_jugular: "Normal",
        edema: "Ausente",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "ECG (Eletrocardiograma)",
        descricao: "12 derivações",
        resultado: "Ausência de onda P organizada; ondas f de fibrilação em linha de base; ritmo ventricular irregular, FC média 110-120",
        valor_referencia: "Ritmo sinusal regular com onda P",
        interpretacao: "Fibrilação atrial com resposta ventricular rápida",
      },
      {
        nome: "Troponina I",
        descricao: "Biomarcador cardíaco",
        resultado: "<0.04 ng/mL",
        valor_referencia: "<0.04 ng/mL",
        interpretacao: "Normal - sem infarto associado",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Fibrilação Atrial",
        probabilidade: 95,
        criterios_minimos: [
          "Pulso irregularmente irregular",
          "Ausência de onda P no ECG",
          "Ritmo ventricular irregular",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Flutter atrial",
        criterios_exclusao: ["Pulso completamente irregular"],
        achados_que_descartam: ["Ritmo geralmente mais regular"],
      },
    ],
    examesIndicados: [
      "ECG",
      "Troponina",
      "TSH",
      "Eletrólitos",
      "Hemograma",
      "Função renal",
      "Ecocardiograma conforme risco",
    ],

    conduta_esperada: {
      imediata: [
        "Monitorização cardíaca contínua",
        "Acesso venoso",
        "Avaliar estabilidade hemodinâmica",
        "Oxigenioterapia se SpO2 <90%",
        "Controle de frequência com beta-bloqueador IV ou digoxina",
        "Avaliar risco tromboembólico (CHA2DS2-VASc)",
      ],
      curto_prazo: [
        "Internação para monitorização",
        "Estratificação de risco para AVC",
        "Avaliação de causa desencadeante",
        "Possível cardioversão elétrica se instável",
      ],
      longo_prazo: [
        "Anticoagulação conforme risco (CHA2DS2-VASc ≥2 em homens, ≥3 em mulheres)",
        "Controle de frequência crônico",
        "Investigação e tratamento de causa subjacente",
        "Possível ablação se recorrências",
      ],
      encaminhamentos: ["Cardiologia"],
    },
    condutaCorreta: "Controle de frequência com beta-bloqueador, avaliar risco de AVC, iniciar anticoagulação conforme CHA2DS2-VASc",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["FC >120", "Dispneia", "Tontura"],
        descricao: "FA de resposta rápida com sintomas",
        recomendacao: "Controle de frequência urgente, monitorização",
      },
    ],

    erros_criticos: [
      {
        erro: "Não reconhecer fibrilação atrial",
        descricao: "Erro diagnóstico fundamental",
        penalidade: 2,
        evitavel: true,
      },
      {
        erro: "Não anticoagular quando indicado",
        descricao: "Risco altíssimo de AVC",
        penalidade: 3,
        evitavel: true,
      },
      {
        erro: "Não controlar frequência cardíaca",
        descricao: "FC rápida pode precipitar IC",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu fibrilação atrial no exame físico",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou ECG",
        realizado: false,
        critico: true,
      },
      {
        item: "Interpretou ECG corretamente",
        realizado: false,
        critico: true,
      },
      {
        item: "Iniciou controle de frequência",
        realizado: false,
        critico: true,
      },
      {
        item: "Calculou CHA2DS2-VASc para avaliar risco de AVC",
        realizado: false,
        critico: true,
      },
      {
        item: "Indicou anticoagulação apropriadamente",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de FA",
        peso: 25,
        descricao: "Achados clínicos e ECG",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Controle de frequência",
        peso: 20,
        descricao: "Beta-bloqueador ou digoxina apropriados",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Anticoagulação",
        peso: 30,
        descricao: "Avaliação de risco e prescrição apropriada",
        pontuacao_maxima: 30,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Palpitações",
          "Duração do episódio",
          "Sintomas associados",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Pulso irregularmente irregular",
          "ECG com ondas f",
          "Ausência de onda P",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "Fibrilação atrial",
          "CHA2DS2-VASc score",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Controle de frequência",
          "Anticoagulação conforme risco",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu FA no exame físico",
        "Solicitou ECG",
        "Iniciou controle de frequência",
        "Avaliou risco de AVC",
        "Prescreveu anticoagulação",
      ],
      erros_comuns: [
        "Confundir com taquicardia sinusal",
        "Atrasar anticoagulação",
        "Não considerar causas desencadeantes",
      ],
      orientacoes_pedagogicas: [
        "FA: pulso irregularmente irregular + ECG sem onda P = diagnóstico certo",
        "CHA2DS2-VASc ≥2 em homens = anticoagular obrigatoriamente",
        "Controle de frequência com beta-bloqueador ou digoxina",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer FA, iniciar controle de frequência, avaliar risco de AVC e prescrever anticoagulação apropriada",
      comunicacao: [
        "explicou o diagnóstico",
        "tranquilizou o paciente",
        "explicou importância de anticoagulação",
      ],
      anamnese: [
        "investigou duração de sintomas",
        "perguntou sobre antecedentes",
        "investigou fatores de risco para AVC",
      ],
      exame_fisico: [
        "detectou pulso irregularmente irregular",
        "reconheceu FA clinicamente",
      ],
      exames_complementares: [
        "solicitou ECG urgente",
        "interpretou corretamente",
      ],
      raciocinio: [
        "diagnosticou FA",
        "calculou CHA2DS2-VASc",
      ],
      conduta: [
        "iniciou beta-bloqueador",
        "prescreveu anticoagulante apropriado",
      ],
      soap: [
        "documentou palpitações e duração",
        "registrou achados de FA",
        "planejou anticoagulação",
      ],
    },

    temaOSCE: "Arritmias",
    subtopicosOSCE: [
      "Fibrilação atrial",
      "Pulso irregularmente irregular",
      "ECG sem onda P",
      "Controle de frequência",
      "Prevenção de AVC",
      "Anticoagulação",
    ],
    diagnosticoCorreto: "Fibrilação Atrial Paroxística",
  },

  {
    // ====== CASO 22: EMERGÊNCIA HIPERTENSIVA ======
    id: "22",
    titulo: "Emergência Hipertensiva Suspeita",
    sistema: "Cardiovascular",
    tema: "Hipertensão Arterial",
    nivel: "avancado",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Diferenciar urgência de emergência hipertensiva, pesquisar lesão de órgão-alvo, indicar manejo apropriado",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Cláudio Mendez",
      idade: 55,
      sexo: "Masculino",
      queixa_principal: "Pressão muito alta com dor de cabeça intensa",
      historia_breve: "PA muito elevada, cefaleia occipital, visão turva, paciente com HAS não controlada",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Emergência Hipertensiva com Evidência de Lesão de Órgão-Alvo (Encefalopatia Hipertensiva)",
      diagnosticos_diferenciais: ["Urgência hipertensiva", "AVC isquêmico", "Hemorragia intracraniana"],
      sindromes_associadas: ["Hipertensão maligna"],
    },

    descricaoBreve: "Paciente com PA muito elevada (>180/120), sintomas de lesão de órgão-alvo (cefaleia intensa, visão turva), necessário controle urgente",
    categoria: "HTA",
    paciente: {
      id: "pac-022",
      nome: "Cláudio Mendez",
      idade: 55,
      sexo: "M",
      queixaPrincipal: "Pressão muito alta com dor de cabeça",
      historicoDoenca: "HAS há 10 anos, não controla com medicações, não usa anti-hipertensivo há 2 meses",
      antecedentes: ["HAS não controlada", "Tabagismo ativo", "Consumo excessivo de álcool"],
      profissao: "Encanador",
      estado_civil: "Separado",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Tô com uma dor de cabeça que não aguento mais, meu coração tá acelerado",
      cabeca: "Dor pulsante no occipício, pior dor que já tive na cabeça",
      visao: "Tá tudo embaçado, especialmente agora, nunca tive isso",
      nausea: "Sim, sinto muito enjoo, já vomitei duas vezes",
      respiracao: "Sim, tô ofegante",
      consiencia: "Um pouco confuso, tô lento pra pensar",
      stress: "Sim, tive muitos problemas no trabalho essa semana",
      medicacao: "Não tomo nada, parei com os remédios há 2 meses",
    },
    respostaPaciente: {
      inicial: "Dor de cabeça muito intensa e pressão alta",
      cabeca: "Dor pulsante no occipício",
      visao: "Embaçado",
      nausea: "Sim, vomitei",
      respiracao: "Sim",
      conciencia: "Um pouco confuso",
      stress: "Sim",
      medicacao: "Parei há 2 meses",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "210/135 mmHg",
        frequenciaCardiaca: 115,
        frequenciaRespiratoria: 24,
        temperatura: 37.1,
        saturacaoOxigenio: 92,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "210/135 mmHg",
      frequenciaCardiaca: 115,
      frequenciaRespiratoria: 24,
      temperatura: 37.1,
      saturacaoOxigenio: 92,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente ansioso, agitado, palidez, sudorese profusa, tremor fino",
        palpacao: "Pulso forte e acelerado, bounding",
        ausculta: "Taquicardia, sopro cardíaco sistólico, estertores em bases pulmonares bilateralmente",
        percussao: "Normal",
        observacoes: "Sinais de lesão de órgão-alvo: encefalopatia hipertensiva com insuficiência cardíaca aguda",
        regiao: "Geral",
        achados_positivos: ["Taquicardia", "Sopro sistólico", "Estertores", "Agitação"],
        achados_negativos: ["Déficit neurológico focal focinho não examinado"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Agitado, palidez, sudorese profusa",
      palpacao: "Pulso forte e acelerado",
      ausculta: "Taquicardia, sopro sistólico, estertores bibasais",
      percussao: "Normal",
      observacoes: "Sinais de lesão de múltiplos órgãos",
    },

    exame_fisico_interativo: {
      geral: {
        estado_geral: "Paciente agitado, em aparente desconforto, palidez discreta, sudorese profusa",
        consciencia: "Lúcido mas confuso, lentificado",
      },
      cardiovascular: {
        inspecao_precordial: "Sem alterações estruturais",
        ausculta_cardiaca: "Taquicardia FC 115 bpm, som S4 audível, sopro sistólico ejetivo suave em foco aórtico",
        pulsos: "Pulsos fortes e simétricos bilateralmente, amplitude aumentada",
        turgencia_jugular: "Elevada",
        edema: "Ausente em MMII",
      },
      respiratorio: {
        ausculta_pulmonar: "Estertores crepitantes em bases bilateralmente",
        padrao_respiratorio: "Taquipneia 24 ipm",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Pressão Arterial",
        descricao: "Medição cuidadosa",
        resultado: "PA sístólica >180 mmHg, PA diastólica >120 mmHg",
        valor_referencia: "<120/<80 mmHg",
        interpretacao: "Hipertensão severa",
      },
      {
        nome: "ECG (Eletrocardiograma)",
        descricao: "12 derivações",
        resultado: "Hipertrofia ventricular esquerda, possível onda T em T wave inversion em V4-V6",
        valor_referencia: "Normal",
        interpretacao: "Efeitos crônicos de HAS + isquemia",
      },
      {
        nome: "Fundoscopia (se realizada)",
        descricao: "Exame do fundo de olho",
        resultado: "Papiledema, hemorragias em chama, exudatos",
        valor_referencia: "Fundo de olho normal",
        interpretacao: "Retinopatia hipertensiva maligna",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Emergência Hipertensiva com Encefalopatia",
        probabilidade: 90,
        criterios_minimos: [
          "PA >180/120",
          "Cefaleia intensa",
          "Alteração visual",
          "Alteração mental",
          "Insuficiência cardíaca aguda",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "AVC isquêmico",
        criterios_exclusao: ["Papiledema", "Estertores"],
        achados_que_descartam: ["Presença de sinais de lesão de múltiplos órgãos"],
      },
    ],
    examesIndicados: [
      "ECG",
      "Troponina",
      "Creatinina e BUN",
      "Eletrólitos",
      "Hemograma",
      "EAS com microscópio",
      "RX de tórax",
      "TC ou RM de crânio se déficit focal",
      "Fundoscopia",
    ],

    conduta_esperada: {
      imediata: [
        "Encaminhar para emergência/UTI",
        "Monitorização cardíaca e PA contínuas",
        "Acesso venoso",
        "Redução controlada de PA: meta 10-20% na primeira hora",
        "Anti-hipertensivo IV: nitroprussiato, nitroglicerina, labetalol ou esmolol conforme disponibilidade",
        "NÃO fazer redução brusca (risco de AVC)",
        "Oxigenioterapia se SpO2 <90%",
      ],
      curto_prazo: [
        "Investigação de lesão de órgão-alvo",
        "TC/RM de crânio se suspeita de AVC ou hemorragia",
        "Internação em UTI",
        "Avaliação oftalmológica",
      ],
      longo_prazo: [
        "Investigação de causa secundária de HAS",
        "Controle anti-hipertensivo crônico",
        "Educação do paciente",
      ],
      encaminhamentos: ["Emergência", "UTI", "Oftalmologia"],
    },
    condutaCorreta: "Emergência hipertensiva - encaminhar para UTI, redução controlada de PA 10-20% primeira hora, anti-hipertensivo IV, investigar lesão de órgão-alvo",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: [
          "PA >180/120",
          "Cefaleia intensa",
          "Alteração visual",
          "Confusão mental",
          "Insuficiência cardíaca aguda",
        ],
        descricao: "Emergência hipertensiva com lesão de múltiplos órgãos, risco iminente de morte",
        recomendacao: "Hospitalização em UTI, redução controlada de PA, investigação urgente",
      },
    ],

    erros_criticos: [
      {
        erro: "Fazer redução brusca de PA",
        descricao: "Risco de AVC isquêmico por hipoperfusão",
        penalidade: 3,
        evitavel: true,
      },
      {
        erro: "Não reconhecer como emergência",
        descricao: "Lesão de órgão-alvo requer hospitalização urgente",
        penalidade: 2.5,
        evitavel: true,
      },
      {
        erro: "Não investigar lesão de órgão-alvo",
        descricao: "Necessário para guiar tratamento",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Mediu PA corretamente",
        realizado: false,
        critico: true,
      },
      {
        item: "Reconheceu PA >180/120 como emergência",
        realizado: false,
        critico: true,
      },
      {
        item: "Pesquisou sinais de lesão de órgão-alvo (cérebro, coração, rins, olhos)",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou exames apropriados (ECG, creatinina, EAS, RX, fundoscopia)",
        realizado: false,
        critico: true,
      },
      {
        item: "Decidiu encaminhar para emergência/UTI",
        realizado: false,
        critico: true,
      },
      {
        item: "Explicou necessidade de redução controlada de PA",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de emergência",
        peso: 30,
        descricao: "Diferenciação urgência vs emergência",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Avaliação de lesão de órgão-alvo",
        peso: 25,
        descricao: "Exame físico e investigação apropriados",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Decisão de encaminhamento",
        peso: 20,
        descricao: "Indicação apropriada de UTI",
        pontuacao_maxima: 20,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Cefaleia intensa",
          "Sintomas de lesão de órgão-alvo",
          "Não-aderência ao tratamento",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "PA >180/120",
          "Sinais de lesão múltipla",
          "ECG, creatinina, EAS alterados",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "Emergência hipertensiva",
          "Encefalopatia hipertensiva suspeita",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Encaminhamento urgente para UTI",
          "Redução controlada de PA",
          "Investigação de causa",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu PA >180/120 como emergência",
        "Pesquisou sinais de lesão de órgão-alvo",
        "Encaminhou para UTI",
        "Explicou necessidade de redução controlada",
        "Solicitou investigação apropriada",
      ],
      erros_comuns: [
        "Fazer redução brusca de PA",
        "Confundir urgência com emergência",
        "Tentar tratar ambulatorialmente",
      ],
      orientacoes_pedagogicas: [
        "Emergência hipertensiva: PA >180/120 + sintomas de lesão de órgão-alvo = hospitalização urgente",
        "Redução de PA: meta 10-20% primeira hora, depois mais gradual",
        "Nunca reduzir PA em >30% nas primeiras 24h",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Diferenciar urgência de emergência hipertensiva, pesquisar lesão de órgão-alvo, encaminhar para tratamento apropriado",
      comunicacao: [
        "explicou a gravidade",
        "tranquilizou o paciente",
        "explicou necessidade de hospitalização",
      ],
      anamnese: [
        "investigou antecedentes de HAS",
        "perguntou sobre aderência ao tratamento",
        "investigou sintomas de lesão de órgão-alvo",
      ],
      exame_fisico: [
        "mediu PA cuidadosamente",
        "pesquisou neurológico",
        "pesquisou edema pulmonar",
        "avaliou fundo de olho",
      ],
      exames_complementares: [
        "solicitou ECG",
        "solicitou creatinina e eletrólitos",
        "solicitou EAS",
        "solicitou fundoscopia",
      ],
      raciocinio: [
        "diagnosticou emergência hipertensiva",
        "identificou encefalopatia e insuficiência cardíaca",
      ],
      conduta: [
        "encaminhou para UTI",
        "explicou redução controlada de PA",
      ],
      soap: [
        "documentou cefaleia e sintomas",
        "registrou PA e achados de lesão múltipla",
        "planejou investigação urgente",
      ],
    },

    temaOSCE: "Hipertensão Arterial",
    subtopicosOSCE: [
      "Emergência hipertensiva",
      "Encefalopatia hipertensiva",
      "PA >180/120",
      "Lesão de órgão-alvo",
      "Redução controlada de PA",
      "Diferenciação urgência vs emergência",
    ],
    diagnosticoCorreto: "Emergência Hipertensiva com Encefalopatia",
  },

  {
    // ====== CASO 23: INSUFICIÊNCIA MITRAL ======
    id: "23",
    titulo: "Insuficiência Mitral Crônica",
    sistema: "Cardiovascular",
    tema: "Valvopatia",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 10,
    objetivo_pedagogico: "Diagnosticar insuficiência mitral e avaliar gravidade",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Helena Ramos",
      idade: 55,
      sexo: "Feminino",
      queixa_principal: "Falta de ar progressiva",
      historia_breve: "Dispneia aos esforços que piorou nos últimos meses, palpitações ocasionais",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Insuficiência Mitral Crônica Moderada",
      diagnosticos_diferenciais: ["Insuficiência Aórtica", "Estenose Mitral", "Cardiomiopatia"],
      sindromes_associadas: ["Insuficiência Cardíaca"],
    },

    descricaoBreve: "Paciente com sopro holosistólico em ápice irradiado para axila, ictus amplo e deslocado",
    categoria: "Valvopatia",
    paciente: {
      id: "pac-023",
      nome: "Helena Ramos",
      idade: 55,
      sexo: "F",
      queixaPrincipal: "Falta de ar progressiva",
      historicoDoenca: "Dispneia ao esforço que piorou, paciente com febre reumática na infância",
      antecedentes: ["Febre reumática infantil", "HAS"],
      profissao: "Professora",
      estado_civil: "Casada",
      alergias: [],
      medicamentos_em_uso: ["Losartana 50mg"],
    },

    respostas_do_paciente: {
      inicial: "Tô ficando cada vez mais cansada, mal consigo subir escada",
      dispneia: "Sim, ao fazer esforço, agora até em atividades leves",
      palpitacoes: "Sim, ocasionalmente sinto palpitações",
      edema: "Meus pés incharam um pouco",
      historico: "Tive febre reumática quando era menina",
      tosse: "Sim, uma tosse leve especialmente à noite",
      ortopneia: "Às vezes preciso de mais travesseiros",
    },
    respostaPaciente: {
      inicial: "Tô cansada, mal consigo subir escada",
      dispneia: "Sim, ao esforço",
      palpitacoes: "Sim",
      edema: "Sim",
      historico: "Febre reumática na infância",
      tosse: "Sim, à noite",
      ortopneia: "Às vezes",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "130/75 mmHg",
        frequenciaCardiaca: 88,
        frequenciaRespiratoria: 18,
        temperatura: 36.8,
        saturacaoOxigenio: 96,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "130/75 mmHg",
      frequenciaCardiaca: 88,
      frequenciaRespiratoria: 18,
      temperatura: 36.8,
      saturacaoOxigenio: 96,
    },

    exame_fisico: {
      correto: {
        inspecao: "Ictus amplo e deslocado para lateral",
        palpacao: "Frêmito sistólico presente",
        ausculta: "Sopro holosistólico em ápice irradiado para axila, possível B3",
        percussao: "Normal",
        observacoes: "Achados sugestivos de insuficiência mitral com dilatação ventricular",
        regiao: "Precórdio",
        achados_positivos: ["Sopro holosistólico", "Ictus amplo"],
        achados_negativos: ["Sopro de abertura"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Ictus amplo e deslocado",
      palpacao: "Frêmito sistólico",
      ausculta: "Sopro holosistólico em ápice irradiado para axila",
      percussao: "Normal",
      observacoes: "Compatível com IM",
    },

    exame_fisico_interativo: {
      cardiovascular: {
        inspecao_precordial: "Ictus pulsátil amplo, deslocado para axila",
        ausculta_cardiaca: "Sopro holosistólico máximo em ápice, irradiado para axila, possível B3",
        pulsos: "Pulsos presentes e simétricos",
        turgencia_jugular: "Normal",
        edema: "Leve edema em tornozelos",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Ecocardiograma",
        descricao: "Avaliação de válvula mitral",
        resultado: "Dilatação VE leve a moderada, regurgitação mitral moderada, leaflet anterior normal",
        valor_referencia: "Válvulas normais",
        interpretacao: "IM crônica moderada",
      },
      {
        nome: "Radiografia de Tórax",
        descricao: "PA e perfil",
        resultado: "Aumento de silhueta cardíaca leve",
        valor_referencia: "Normal",
        interpretacao: "Cardiomegalia leve",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Insuficiência Mitral Crônica",
        probabilidade: 95,
        criterios_minimos: [
          "Sopro holosistólico ápice-axila",
          "Ictus amplo e deslocado",
          "IM ao ecocardiograma",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Estenose Mitral",
        criterios_exclusao: ["Sopro holosistólico"],
        achados_que_descartam: ["Sopro diastólico"],
      },
    ],
    examesIndicados: [
      "Ecocardiograma",
      "Radiografia de tórax",
      "ECG",
      "Troponina se sintomas de IC",
    ],

    conduta_esperada: {
      imediata: [
        "Monitorização conforme sintomas",
        "Beta-bloqueador ou IECA/BRA conforme tolerância",
      ],
      curto_prazo: [
        "Ecocardiograma para avaliar gravidade",
        "Avaliação de indicação de cirurgia",
      ],
      longo_prazo: [
        "Medicações conforme progressão",
        "Possível plástica ou substituição valvular",
      ],
      encaminhamentos: ["Cardiologia"],
    },
    condutaCorreta: "Ecocardiograma, medicações conforme sintomas, acompanhamento cardiológico, possível cirurgia valvular",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["Dilatação significativa", "Dispneia"],
        descricao: "Possível indicação de cirurgia",
        recomendacao: "Acompanhamento especializado",
      },
    ],

    erros_criticos: [
      {
        erro: "Não solicitar ecocardiograma",
        descricao: "Essencial para avaliar gravidade e indicação de cirurgia",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Detectou sopro holosistólico em ápice",
        realizado: false,
        critico: true,
      },
      {
        item: "Reconheceu irradiação para axila",
        realizado: false,
        critico: true,
      },
      {
        item: "Identificou ictus amplo e deslocado",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou ecocardiograma",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de IM",
        peso: 30,
        descricao: "Achados clínicos e ecocardiografia",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Avaliação de gravidade",
        peso: 20,
        descricao: "Indicação de seguimento ou cirurgia",
        pontuacao_maxima: 20,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Dispneia progressiva",
          "Histórico de febre reumática",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Sopro holosistólico",
          "Ictus amplo",
          "IM ao ecocardiograma",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["IM crônica"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Medicações",
          "Acompanhamento cardiológico",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu IM pelo sopro",
        "Solicitou ecocardiograma",
        "Iniciou medicações apropriadas",
      ],
      erros_comuns: ["Confundir com estenose mitral"],
      orientacoes_pedagogicas: [
        "IM: sopro holosistólico ápice-axila, ictus amplo",
        "EM: sopro diastólico com opening snap",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Diagnosticar IM pelos achados clínicos e confirmar com ecocardiograma",
      comunicacao: ["explicou significado do sopro"],
      anamnese: ["investigou progressão de sintomas"],
      exame_fisico: ["localizou sopro corretamente"],
      exames_complementares: ["solicitou ecocardiograma"],
      raciocinio: ["diagnosticou IM"],
      conduta: ["iniciou medicações apropriadas"],
      soap: ["documentou achados de IM"],
    },

    temaOSCE: "Valvopatias",
    subtopicosOSCE: [
      "Insuficiência mitral",
      "Sopro holosistólico",
      "Ictus amplo",
      "Ecocardiograma com regurgitação",
    ],
    diagnosticoCorreto: "Insuficiência Mitral Crônica",
  },

  {
    // ====== CASO 24: ESTENOSE AÓRTICA ======
    id: "24",
    titulo: "Estenose Aórtica Grave",
    sistema: "Cardiovascular",
    tema: "Valvopatia",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 10,
    objetivo_pedagogico: "Diagnosticar estenose aórtica grave e reconhecer indicação de cirurgia",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Armando Silva",
      idade: 72,
      sexo: "Masculino",
      queixa_principal: "Síncope e falta de ar ao exercício",
      historia_breve: "Episódios de tontura ao fazer esforço, não consegue mais caminhar muito",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Estenose Aórtica Grave",
      diagnosticos_diferenciais: ["Insuficiência Aórtica", "Cardiomiopatia"],
      sindromes_associadas: ["Tríade de Heyde"],
    },

    descricaoBreve: "Paciente com sopro sistólico em foco aórtico, pulso parvus et tardus, área diminuída ao ecocardiograma",
    categoria: "Valvopatia",
    paciente: {
      id: "pac-024",
      nome: "Armando Silva",
      idade: 72,
      sexo: "M",
      queixaPrincipal: "Síncope ao exercício",
      historicoDoenca: "Sopro desde a infância, agora com sintomas",
      antecedentes: ["HAS", "Diabetes tipo 2"],
      profissao: "Aposentado",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: ["Losartana 50mg", "Metformina 500mg"],
    },

    respostas_do_paciente: {
      inicial: "Quando faço esforço, fico tonto e tenho medo de desmaiar",
      sincope: "Sim, já desmaiei duas vezes ao fazer esforço",
      dispneia: "Muita, mal consigo andar 20 metros",
      angina: "Sim, dor no peito ao fazer esforço",
      piora: "Piorou bastante nos últimos 6 meses",
      historico: "Sempre tive um sopro, desde criança",
    },
    respostaPaciente: {
      inicial: "Fico tonto com esforço",
      sincope: "Sim",
      dispneia: "Muita",
      angina: "Sim",
      piora: "Piorou",
      historico: "Sopro desde criança",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "160/50 mmHg",
        frequenciaCardiaca: 68,
        frequenciaRespiratoria: 16,
        temperatura: 36.8,
        saturacaoOxigenio: 96,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "160/50 mmHg",
      frequenciaCardiaca: 68,
      frequenciaRespiratoria: 16,
      temperatura: 36.8,
      saturacaoOxigenio: 96,
    },

    exame_fisico: {
      correto: {
        inspecao: "Pulso carotídeo lento e de pequena amplitude",
        palpacao: "Frêmito sistólico em foco aórtico",
        ausculta: "Sopro sistólico ejetivo longo em foco aórtico irradiado para carótidas",
        percussao: "Normal",
        observacoes: "Pulso parvus et tardus típico",
        regiao: "Precórdio",
        achados_positivos: ["Sopro sistólico ejetivo"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Pulso lento e fraco (parvus et tardus)",
      palpacao: "Frêmito sistólico",
      ausculta: "Sopro sistólico ejetivo em aórtica",
      percussao: "Normal",
      observacoes: "Achados típicos de EA",
    },

    exame_fisico_interativo: {
      cardiovascular: {
        inspecao_precordial: "Pulsos carotídeos com ascensão lenta",
        ausculta_cardiaca: "Sopro sistólico ejetivo longo, máximo em foco aórtico, irradiado para carótidas",
        pulsos: "Pulso carotídeo com ascensão lenta e suave (parvus et tardus)",
        turgencia_jugular: "Normal",
        edema: "Ausente",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Ecocardiograma",
        descricao: "Avaliação de válvula aórtica",
        resultado: "Área de válvula aórtica <0.8 cm², gradiente médio >50 mmHg",
        valor_referencia: "EA normal >1.5 cm²",
        interpretacao: "Estenose aórtica grave",
      },
      {
        nome: "Radiografia de Tórax",
        descricao: "PA e perfil",
        resultado: "Possível calcificação de aorta",
        valor_referencia: "Normal",
        interpretacao: "Degeneração aórtica",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Estenose Aórtica Grave",
        probabilidade: 95,
        criterios_minimos: [
          "Sopro sistólico ejetivo",
          "Pulso parvus et tardus",
          "Tríade: síncope, dispneia, angina",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Estenose Mitral",
        criterios_exclusao: ["Sopro sistólico"],
        achados_que_descartam: ["Pulso normal"],
      },
    ],
    examesIndicados: [
      "Ecocardiograma",
      "Radiografia de tórax",
      "ECG",
      "Avaliação para cirurgia",
    ],

    conduta_esperada: {
      imediata: [
        "Não fazer esforço físico intenso",
        "Encaminhamento para cirurgia valvular",
      ],
      curto_prazo: [
        "Avaliação pré-operatória",
        "Substituição de válvula aórtica",
      ],
      longo_prazo: ["Seguimento cardiológico pós-operatório"],
      encaminhamentos: ["Cardiologia", "Cirurgia cardíaca"],
    },
    condutaCorreta: "Encaminhar para substituição de válvula aórtica urgentemente, evitar esforço físico intenso",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["Síncope", "Dispneia", "Angina"],
        descricao: "Alto risco de morte súbita",
        recomendacao: "Cirurgia urgente",
      },
    ],

    erros_criticos: [
      {
        erro: "Não reconhecer risco de morte súbita",
        descricao: "EA grave pode causar morte súbita com exercício",
        penalidade: 3,
        evitavel: true,
      },
      {
        erro: "Não encaminhar para cirurgia",
        descricao: "Substituição aórtica é tratamento definitivo",
        penalidade: 3,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Detectou sopro sistólico em aórtica",
        realizado: false,
        critico: true,
      },
      {
        item: "Reconheceu pulso parvus et tardus",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou ecocardiograma",
        realizado: false,
        critico: true,
      },
      {
        item: "Encaminhou para cirurgia",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de EA grave",
        peso: 35,
        descricao: "Achados clínicos e ecocardiografia",
        pontuacao_maxima: 35,
      },
      {
        criterio: "Reconhecimento de urgência",
        peso: 25,
        descricao: "Indicação de cirurgia imediata",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Síncope ao esforço",
          "Dispneia",
          "Angina",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Sopro sistólico aórtico",
          "Pulso parvus et tardus",
          "EA grave no eco",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Estenose aórtica grave"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Encaminhar cirurgião",
          "Evitar esforço",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu EA grave",
        "Detectou pulso parvus et tardus",
        "Encaminhou para cirurgia",
      ],
      erros_comuns: ["Achar que é angina coronária"],
      orientacoes_pedagogicas: [
        "EA grave: tríade = síncope + dispneia + angina ao esforço",
        "Pulso parvus et tardus é caracterísitco",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer EA grave e indicar cirurgia urgente",
      comunicacao: ["explicou a gravidade"],
      anamnese: ["investigou síncope e exercício"],
      exame_fisico: ["detectou pulso e sopro"],
      exames_complementares: ["solicitou ecocardiograma"],
      raciocinio: ["diagnosticou EA grave"],
      conduta: ["encaminhou para cirurgia"],
      soap: ["documentou EA grave"],
    },

    temaOSCE: "Valvopatias",
    subtopicosOSCE: [
      "Estenose aórtica",
      "Sopro sistólico ejetivo",
      "Pulso parvus et tardus",
      "Ecocardiograma com área diminuída",
    ],
    diagnosticoCorreto: "Estenose Aórtica Grave",
  },

  {
    // ====== CASO 25: INSUFICIÊNCIA AÓRTICA AGUDA ======
    id: "25",
    titulo: "Insuficiência Aórtica Aguda",
    sistema: "Cardiovascular",
    tema: "Valvopatia",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 11,
    objetivo_pedagogico: "Diagnosticar insuficiência aórtica aguda e reconhecer emergência médica",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Pedro Alves",
      idade: 45,
      sexo: "Masculino",
      queixa_principal: "Falta de ar súbita e palpitações",
      historia_breve: "Começou há poucas horas, febre alguns dias atrás, paciente com uso de drogas IV",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Insuficiência Aórtica Aguda com Endocardite",
      diagnosticos_diferenciais: ["Dissecção aórtica", "Pericardite"],
      sindromes_associadas: ["Endocardite infecciosa"],
    },

    descricaoBreve: "Paciente com sopro diastólico decrescente, pulso amplo, insuficiência cardíaca aguda",
    categoria: "Valvopatia",
    paciente: {
      id: "pac-025",
      nome: "Pedro Alves",
      idade: 45,
      sexo: "M",
      queixaPrincipal: "Falta de ar súbita",
      historicoDoenca: "Febre recente, uso de drogas IV",
      antecedentes: ["Uso de drogas ilícitas IV", "Hepatite C"],
      profissao: "Mecânico",
      estado_civil: "Solteiro",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "De repente fiquei com falta de ar muito ruim",
      dispneia: "Muita, até em repouso",
      palpitacoes: "Sim, coração acelerado",
      febre: "Tive febre alguns dias atrás",
      dor_peito: "Sim, dor que irradia para as costas",
      uso_drogas: "Sim, uso drogas IV esporadicamente",
    },
    respostaPaciente: {
      inicial: "Falta de ar de repente",
      dispneia: "Muita",
      palpitacoes: "Sim",
      febre: "Sim",
      dor_peito: "Sim",
      uso_drogas: "Sim",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "170/40 mmHg",
        frequenciaCardiaca: 115,
        frequenciaRespiratoria: 28,
        temperatura: 38.5,
        saturacaoOxigenio: 90,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "170/40 mmHg",
      frequenciaCardiaca: 115,
      frequenciaRespiratoria: 28,
      temperatura: 38.5,
      saturacaoOxigenio: 90,
    },

    exame_fisico: {
      correto: {
        inspecao: "Pulsos amplos, cabeçada (sinal de Musset)",
        palpacao: "Pulso bounding",
        ausculta: "Sopro diastólico decrescente em borda esternal esquerda, possível sopro sistólico (Austin Flint) em ápice",
        percussao: "Normal",
        observacoes: "Sinais de IA aguda com IC",
        regiao: "Precórdio",
        achados_positivos: ["Sopro diastólico"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Pulsos amplos",
      palpacao: "Pulso bounding",
      ausculta: "Sopro diastólico em aórtica",
      percussao: "Normal",
      observacoes: "Sinais de IA",
    },

    exame_fisico_interativo: {
      cardiovascular: {
        inspecao_precordial: "Pulsos visíveis amplos",
        ausculta_cardiaca: "Sopro diastólico decrescente em borda esternal esquerda, sopro sistólico em ápice",
        pulsos: "Pulso amplo e bounding",
        turgencia_jugular: "Elevada",
        edema: "Possível em MMII",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Ecocardiograma",
        descricao: "Avaliação urgente",
        resultado: "Folheto aórtico danificado, regurgitação aórtica massiva",
        valor_referencia: "Folheto aórtico íntegro",
        interpretacao: "IA aguda severa",
      },
      {
        nome: "Hemocultura",
        descricao: "Isolamento de bactéria",
        resultado: "Positiva para Staphylococcus aureus",
        valor_referencia: "Negativa",
        interpretacao: "Endocardite",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Insuficiência Aórtica Aguda",
        probabilidade: 90,
        criterios_minimos: [
          "Sopro diastólico decrescente",
          "Pulso amplo",
          "IA massiva ao ecocardiograma",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Dissecção aórtica",
        criterios_exclusao: ["Ecocardiograma com vegetação"],
        achados_que_descartam: ["Hemocultura positiva"],
      },
    ],
    examesIndicados: [
      "Ecocardiograma urgente",
      "Hemocultura",
      "Hemograma",
      "Creatinina",
      "Ecocardiograma transesofágico",
    ],

    conduta_esperada: {
      imediata: [
        "Encaminhar para cirurgia urgente",
        "Nitroprussiato para controle de PA",
        "Oxigenioterapia",
      ],
      curto_prazo: [
        "Substituição de válvula aórtica",
        "Antibioticoterapia para endocardite",
      ],
      longo_prazo: ["Seguimento infeccioso e cardíaco"],
      encaminhamentos: ["Cirurgia cardíaca urgente", "Infectologia"],
    },
    condutaCorreta: "Emergência cirúrgica, nitroprussiato, ecocardiograma urgente, hemocultura, substituição valvular",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["Dispneia aguda", "SpO2 baixa", "Insuficiência cardíaca"],
        descricao: "Emergência com risco de morte",
        recomendacao: "Cirurgia urgentíssima",
      },
    ],

    erros_criticos: [
      {
        erro: "Não reconhecer como emergência",
        descricao: "IA aguda pode causar morte rapidamente",
        penalidade: 3,
        evitavel: true,
      },
      {
        erro: "Não encaminhar para cirurgia urgente",
        descricao: "Única esperança de sobrevida",
        penalidade: 3,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Detectou sopro diastólico em aórtica",
        realizado: false,
        critico: true,
      },
      {
        item: "Reconheceu pulso amplo",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou ecocardiograma urgente",
        realizado: false,
        critico: true,
      },
      {
        item: "Encaminhou para cirurgia emergencial",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de emergência",
        peso: 35,
        descricao: "IA aguda é vida em risco",
        pontuacao_maxima: 35,
      },
      {
        criterio: "Manejo apropriado",
        peso: 25,
        descricao: "Cirurgia e antibioticoterapia",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Dispneia aguda",
          "Febre",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Sopro diastólico",
          "Pulso amplo",
          "IA massiva ao ecocardiograma",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Insuficiência aórtica aguda"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Cirurgia urgente",
          "Nitroprussiato",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu IA aguda",
        "Encaminhou para cirurgia urgente",
        "Solicitou ecocardiograma urgente",
      ],
      erros_comuns: ["Achar que é apenas insuficiência cardíaca"],
      orientacoes_pedagogicas: [
        "IA aguda com febre = suspeitar endocardite",
        "Pulso amplo > 50% diferença pressão sistólica-diastólica",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer IA aguda como emergência e encaminhar para cirurgia",
      comunicacao: ["explicou gravidade"],
      anamnese: ["investigou febre e uso de drogas"],
      exame_fisico: ["detectou sinais de IA"],
      exames_complementares: ["pediu ecocardiograma urgente"],
      raciocinio: ["diagnosticou IA aguda"],
      conduta: ["encaminhou cirurgia urgente"],
      soap: ["documentou IA aguda"],
    },

    temaOSCE: "Valvopatias",
    subtopicosOSCE: [
      "Insuficiência aórtica aguda",
      "Sopro diastólico",
      "Pulso amplo",
      "Emergência cirúrgica",
    ],
    diagnosticoCorreto: "Insuficiência Aórtica Aguda",
  },

  {
    // ====== CASO 26: ESTENOSE MITRAL COM FIBRILAÇÃO ATRIAL ======
    id: "26",
    titulo: "Estenose Mitral com Fibrilação Atrial",
    sistema: "Cardiovascular",
    tema: "Valvopatia",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 11,
    objetivo_pedagogico: "Diagnosticar estenose mitral e reconhecer complicação de fibrilação atrial",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Carolina Dias",
      idade: 58,
      sexo: "Feminino",
      queixa_principal: "Palpitações e falta de ar",
      historia_breve: "Histórico de febre reumática, agora com palpitações recentes",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Estenose Mitral com Fibrilação Atrial",
      diagnosticos_diferenciais: ["Insuficiência Mitral", "Insuficiência Cardíaca"],
      sindromes_associadas: ["Valvopatia Reumática"],
    },

    descricaoBreve: "Paciente com sopro diastólico em ápice, ritmo irregularmente irregular, risco de trombo atrial",
    categoria: "Valvopatia",
    paciente: {
      id: "pac-026",
      nome: "Carolina Dias",
      idade: 58,
      sexo: "F",
      queixaPrincipal: "Palpitações",
      historicoDoenca: "Febre reumática aos 15 anos",
      antecedentes: ["Febre reumática"],
      profissao: "Comerciante",
      estado_civil: "Viúva",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Tô com batidas aceleradas no coração",
      palpitacoes: "Sim, irregular",
      dispneia: "Sim, especialmente ao deitar-se",
      tosse: "Sim, costumo acordar tossindo",
      sincope: "Não, mas fico tonta",
      historico: "Tive febre reumática quando era jovem",
    },
    respostaPaciente: {
      inicial: "Palpitações",
      palpitacoes: "Sim, irregular",
      dispneia: "Sim",
      tosse: "Sim",
      sincope: "Não",
      historico: "Febre reumática",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "130/80 mmHg",
        frequenciaCardiaca: 110,
        frequenciaRespiratoria: 20,
        temperatura: 36.8,
        saturacaoOxigenio: 94,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "130/80 mmHg",
      frequenciaCardiaca: 110,
      frequenciaRespiratoria: 20,
      temperatura: 36.8,
      saturacaoOxigenio: 94,
    },

    exame_fisico: {
      correto: {
        inspecao: "Rubor malar bilateral",
        palpacao: "Frêmito diastólico",
        ausculta: "Opening snap seguido de sopro diastólico, ritmo irregularmente irregular",
        percussao: "Normal",
        observacoes: "Sinais de EM com FA",
        regiao: "Precórdio",
        achados_positivos: ["Opening snap", "Sopro diastólico"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Rubor malar",
      palpacao: "Frêmito diastólico",
      ausculta: "Opening snap, sopro diastólico, ritmo irregular",
      percussao: "Normal",
      observacoes: "EM com FA",
    },

    exame_fisico_interativo: {
      cardiovascular: {
        inspecao_precordial: "Sem alterações estruturais",
        ausculta_cardiaca: "Opening snap audível após B2, seguido de sopro diastólico rumbante, ritmo irregularmente irregular",
        pulsos: "Irregulares",
        turgencia_jugular: "Possível elevação",
        edema: "Possível em MMII",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Ecocardiograma",
        descricao: "Avaliação de mitral",
        resultado: "Válvula mitral espessada, área <1.5 cm², FA em ECG",
        valor_referencia: "Normal",
        interpretacao: "EM com FA",
      },
      {
        nome: "ECG",
        descricao: "Eletrocardiograma",
        resultado: "Fibrilação atrial, possível onda P não organizada",
        valor_referencia: "Ritmo sinusal",
        interpretacao: "FA",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Estenose Mitral com FA",
        probabilidade: 95,
        criterios_minimos: [
          "Sopro diastólico + opening snap",
          "Ritmo irregularmente irregular",
          "Área mitral <1.5 cm²",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "IM com FA",
        criterios_exclusao: ["Opening snap"],
        achados_que_descartam: ["Sopro sistólico"],
      },
    ],
    examesIndicados: [
      "Ecocardiograma",
      "ECG",
      "Radiografia de tórax",
      "D-dímero ou ecocardiograma transesofágico para descartar trombo",
    ],

    conduta_esperada: {
      imediata: [
        "Anticoagulação urgente",
        "Controle de frequência com betabloqueador ou digoxina",
      ],
      curto_prazo: [
        "Monitorização",
        "Possível cardioversão",
        "Avaliação para comissurotomia",
      ],
      longo_prazo: [
        "Anticoagulação contínua",
        "Possível comissurotomia percutânea ou plástica valvular",
      ],
      encaminhamentos: ["Cardiologia"],
    },
    condutaCorreta: "Anticoagulação imediata, controle de frequência, ecocardiograma, avaliação para comissurotomia",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["FA de resposta rápida", "Congestão"],
        descricao: "Risco de AVC",
        recomendacao: "Anticoagulação urgente",
      },
    ],

    erros_criticos: [
      {
        erro: "Não anticoagular",
        descricao: "Risco muito alto de AVC",
        penalidade: 3,
        evitavel: true,
      },
      {
        erro: "Não controlar frequência",
        descricao: "Pode precipitar IC",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Detectou opening snap",
        realizado: false,
        critico: true,
      },
      {
        item: "Detectou sopro diastólico",
        realizado: false,
        critico: true,
      },
      {
        item: "Reconheceu ritmo irregularmente irregular",
        realizado: false,
        critico: true,
      },
      {
        item: "Prescreveu anticoagulante",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de EM + FA",
        peso: 30,
        descricao: "Achados auscultatórios e ECG",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Anticoagulação",
        peso: 25,
        descricao: "Prevenção de AVC",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Palpitações",
          "Febre reumática infantil",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Opening snap",
          "Sopro diastólico",
          "Ritmo irregular",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Estenose mitral com FA"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Anticoagulação",
          "Controle de FC",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu EM",
        "Detectou FA",
        "Prescreveu anticoagulante",
        "Controle de frequência",
      ],
      erros_comuns: ["Confundir com IM"],
      orientacoes_pedagogicas: [
        "EM: opening snap + sopro diastólico",
        "FA em EM = SEMPRE anticoagular",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Diagnosticar EM e reconhecer FA como complicação grave",
      comunicacao: ["explicou risco de AVC"],
      anamnese: ["investigou FR"],
      exame_fisico: ["detectou opening snap"],
      exames_complementares: ["pediu eco e ECG"],
      raciocinio: ["diagnosticou EM + FA"],
      conduta: ["anticoagulou apropriadamente"],
      soap: ["documentou EM + FA"],
    },

    temaOSCE: "Valvopatias",
    subtopicosOSCE: [
      "Estenose mitral",
      "Opening snap",
      "Fibrilação atrial",
      "Anticoagulação",
    ],
    diagnosticoCorreto: "Estenose Mitral com Fibrilação Atrial",
  },

  {
    // ====== CASO 27: FEBRE REUMÁTICA AGUDA ======
    id: "27",
    titulo: "Febre Reumática Aguda",
    sistema: "Cardiovascular",
    tema: "Inflamação Cardíaca",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Diagnosticar febre reumática aguda e iniciar tratamento anti-inflamatório",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Mariana Silva",
      idade: 12,
      sexo: "Feminino",
      queixa_principal: "Febre, dor nas articulações e rash",
      historia_breve: "Inflamação articular após infecção de garganta, rash na pele",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Febre Reumática Aguda",
      diagnosticos_diferenciais: ["Artrite reumatoide", "Lúpus", "Endocardite"],
      sindromes_associadas: ["Síndrome de Sydenham"],
    },

    descricaoBreve: "Criança com febre, poliartrite migratória, cardite, erupção evanescente, nódulos subcutâneos",
    categoria: "FR",
    paciente: {
      id: "pac-027",
      nome: "Mariana Silva",
      idade: 12,
      sexo: "F",
      queixaPrincipal: "Febre e dor nas articulações",
      historicoDoenca: "Infecção de garganta 1 mês atrás",
      antecedentes: ["Infecção estreptocócica prévia"],
      profissao: "Estudante",
      estado_civil: "Solteira",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Tô com febre e minhas articulações estão muito doidas",
      articulacoes: "Dor em vários lugares, que muda de local",
      duracao: "Começou há uma semana",
      rash: "Sim, aparecem manchas vermelhas que desaparecem",
      movimentos: "Tô fazendo uns movimentos que não consigo controlar",
      garganta: "Tive inflamação de garganta há um mês",
    },
    respostaPaciente: {
      inicial: "Febre e dor nas articulações",
      articulacoes: "Sim, vários locais",
      duracao: "1 semana",
      rash: "Sim",
      movimentos: "Sim, involuntários",
      garganta: "Sim, há um mês",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "110/70 mmHg",
        frequenciaCardiaca: 108,
        frequenciaRespiratoria: 20,
        temperatura: 39.2,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "110/70 mmHg",
      frequenciaCardiaca: 108,
      frequenciaRespiratoria: 20,
      temperatura: 39.2,
      saturacaoOxigenio: 98,
    },

    exame_fisico: {
      correto: {
        inspecao: "Erupção evanescente, nódulos subcutâneos em cotovelos, movimentos involuntários",
        palpacao: "Joelhos e tornozelos edemaciados e dolorosos",
        ausculta: "Sopro mitral sistólico, atrito pericárdico",
        percussao: "Normal",
        observacoes: "Poliartrite migratória com cardite",
        regiao: "Geral",
        achados_positivos: ["Artrite", "Cardite", "Erupção"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Erupção e movimentos involuntários",
      palpacao: "Articulações edemaciadas",
      ausculta: "Sopro mitral, atrito pericárdico",
      percussao: "Normal",
      observacoes: "Achados de FR",
    },

    exame_fisico_interativo: {
      cardiovascular: {
        ausculta_cardiaca: "Sopro sistólico em ápice, atrito pericárdico presente",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Anti-Estreptolisina O (ASO)",
        descricao: "Marcador de infecção",
        resultado: ">500 UI/mL",
        valor_referencia: "<200",
        interpretacao: "Infecção estreptocócica recente",
      },
      {
        nome: "Ecocardiograma",
        descricao: "Avaliação cardíaca",
        resultado: "Espessamento de mitral, regurgitação leve",
        valor_referencia: "Normal",
        interpretacao: "Cardite reumática",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Febre Reumática Aguda",
        probabilidade: 90,
        criterios_minimos: [
          "Poliartrite migratória",
          "Febre",
          "ASO elevado",
          "Cardite",
          "Erupção evanescente",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Artrite reumatoide juvenil",
        criterios_exclusao: ["ASO elevado"],
        achados_que_descartam: ["Cardite reumática"],
      },
    ],
    examesIndicados: [
      "ASO",
      "Ecocardiograma",
      "Radiografia de tórax",
      "Teste de streptococo",
    ],

    conduta_esperada: {
      imediata: [
        "Penicilina IM para erradicar bactéria",
        "Aspirina em altas doses",
        "Corticoides se cardite",
      ],
      curto_prazo: [
        "Repouso",
        "Monitorização cardíaca",
      ],
      longo_prazo: [
        "Profilaxia com penicilina",
        "Acompanhamento cardiológico",
      ],
      encaminhamentos: ["Cardiologia", "Reumatologia"],
    },
    condutaCorreta: "Penicilina IM, aspirina em altas doses, corticoides se cardite, profilaxia secundária",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["Cardite com murmúrio", "Cardiomegalia"],
        descricao: "Risco de sequela valvular",
        recomendacao: "Uso de corticóide",
      },
    ],

    erros_criticos: [
      {
        erro: "Não prescrever penicilina",
        descricao: "Essencial para erradicar estreptococo",
        penalidade: 2,
        evitavel: true,
      },
      {
        erro: "Não iniciar profilaxia secundária",
        descricao: "Prevenção de recorrência é crítica",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Investigou infecção prévia de garganta",
        realizado: false,
        critico: true,
      },
      {
        item: "Reconheceu poliartrite migratória",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou ASO e ecocardiograma",
        realizado: false,
        critico: true,
      },
      {
        item: "Prescreveu penicilina",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de FR",
        peso: 30,
        descricao: "Critérios de Jones",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Tratamento apropriado",
        peso: 25,
        descricao: "Penicilina e profilaxia",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Poliartrite migratória",
          "Infecção de garganta prévia",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Erupção evanescente",
          "Cardite",
          "ASO elevado",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Febre reumática aguda"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Penicilina IM",
          "Aspirina",
          "Profilaxia",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu FR pelos critérios",
        "Prescreveu penicilina",
        "Iniciou profilaxia",
      ],
      erros_comuns: ["Confundir com artrite reumatoide"],
      orientacoes_pedagogicas: [
        "Critérios maiores de Jones: cardite, poliartrite, coréia, eritema marginado, nódulos",
        "Sempre prescrever profilaxia secundária",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Diagnosticar FR pelos critérios clínicos e iniciar tratamento urgente",
      comunicacao: ["explicou importância de profilaxia"],
      anamnese: ["investigou infecção prévia de garganta"],
      exame_fisico: ["detectou artrite, erupção, cardite"],
      exames_complementares: ["pediu ASO e ecocardiograma"],
      raciocinio: ["diagnosticou FR"],
      conduta: ["prescreveu penicilina e profilaxia"],
      soap: ["documentou FR"],
    },

    temaOSCE: "Febre Reumática",
    subtopicosOSCE: [
      "Febre reumática aguda",
      "Critérios de Jones",
      "Poliartrite migratória",
      "Cardite",
      "Profilaxia secundária",
    ],
    diagnosticoCorreto: "Febre Reumática Aguda",
  },

  {
    // ====== CASO 28: INSUFICIÊNCIA VENOSA CRÔNICA ======
    id: "28",
    titulo: "Insuficiência Venosa Crônica",
    sistema: "Vascular",
    tema: "Vasculopatia Periférica",
    nivel: "iniciante",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 10,
    objetivo_pedagogico: "Diagnosticar insuficiência venosa crônica e orientar manejo conservador",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Conceição Oliveira",
      idade: 58,
      sexo: "Feminino",
      queixa_principal: "Inchaço nas pernas e veias dilatadas",
      historia_breve: "Inchaço progressivo ao longo do dia, varizes visíveis há muitos anos",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Insuficiência Venosa Crônica Classe II-III",
      diagnosticos_diferenciais: ["Linfedema", "Insuficiência cardíaca", "TVP"],
      sindromes_associadas: ["Síndrome Pós-Trombótica"],
    },

    descricaoBreve: "Paciente com varizes, edema depressível, pigmentação, lipodermatosclerose",
    categoria: "Vascular",
    paciente: {
      id: "pac-028",
      nome: "Conceição Oliveira",
      idade: 58,
      sexo: "F",
      queixaPrincipal: "Inchaço nas pernas",
      historicoDoenca: "Edema progressivo, varizes há muitos anos",
      antecedentes: ["Múltiplas gestações", "Obesidade"],
      profissao: "Vendedora",
      estado_civil: "Casada",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Minhas pernas incharam muito, especialmente no final do dia",
      inchaço: "Sim, edema que piora ao longo do dia",
      varizes: "Sim, tenho varizes há muitos anos",
      dor: "Dor e peso nas pernas ao final do dia",
      historico: "Problemas começaram após gestações",
      coceira: "Às vezes fico com coceira nos tornozelos",
    },
    respostaPaciente: {
      inicial: "Inchaço nas pernas",
      inchaço: "Sim, piora ao dia",
      varizes: "Sim",
      dor: "Sim, peso",
      historico: "Após gestações",
      coceira: "Às vezes",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "130/80 mmHg",
        frequenciaCardiaca: 70,
        frequenciaRespiratoria: 16,
        temperatura: 36.8,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "130/80 mmHg",
      frequenciaCardiaca: 70,
      frequenciaRespiratoria: 16,
      temperatura: 36.8,
      saturacaoOxigenio: 98,
    },

    exame_fisico: {
      correto: {
        inspecao: "Varizes visíveis bilateralmente, edema maleolar, hiperpigmentação marrom nos tornozelos",
        palpacao: "Edema com cacifo, endurecimento de pele em tornozelos",
        ausculta: "Normal",
        percussao: "Normal",
        observacoes: "Achados sugestivos de IVC avançada",
        regiao: "Membros inferiores",
        achados_positivos: ["Varizes", "Edema", "Pigmentação"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Varizes, edema, hiperpigmentação",
      palpacao: "Edema com cacifo",
      ausculta: "Normal",
      percussao: "Normal",
      observacoes: "Sinais de IVC",
    },

    exame_fisico_interativo: {
      membros: {
        edema: "Bilateral, maleolar, com cacifo",
        varizes: "Visíveis e palpáveis",
        temperatura: "Normal",
        mobilidade: "Normal",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Ultrassom Venoso Duplex",
        descricao: "Avaliação de fluxo venoso",
        resultado: "Refluxo venoso profundo e superficial",
        valor_referencia: "Sem refluxo",
        interpretacao: "IVC com refluxo bidirecional",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Insuficiência Venosa Crônica",
        probabilidade: 95,
        criterios_minimos: [
          "Varizes",
          "Edema",
          "Hiperpigmentação",
          "Lipodermatosclerose",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Linfedema",
        criterios_exclusao: ["Varizes presentes"],
        achados_que_descartam: ["Fluxo venoso normal"],
      },
    ],
    examesIndicados: ["Ultrassom venoso duplex"],

    conduta_esperada: {
      imediata: [
        "Elevação de membros",
        "Meias de compressão",
      ],
      curto_prazo: [
        "Redução de peso",
        "Atividade física",
      ],
      longo_prazo: [
        "Acompanhamento angiológico",
        "Possível procedimento ablativo",
      ],
      encaminhamentos: ["Angiologia"],
    },
    condutaCorreta: "Meias de compressão, elevação de membros, ultrassom venoso, possível ablação",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["Pigmentação", "Lipodermatosclerose"],
        descricao: "Risco de úlcera venosa",
        recomendacao: "Acompanhamento especializado",
      },
    ],

    erros_criticos: [
      {
        erro: "Não prescrever compressão",
        descricao: "Essencial no manejo da IVC",
        penalidade: 1.5,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Inspecionou varizes",
        realizado: false,
        critico: true,
      },
      {
        item: "Avaliou edema",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou ultrassom venoso",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de IVC",
        peso: 25,
        descricao: "Achados clínicos",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Manejo apropriado",
        peso: 20,
        descricao: "Compressão e seguimento",
        pontuacao_maxima: 20,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Inchaço progressivo",
          "Varizes",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Varizes visíveis",
          "Edema com cacifo",
          "Hiperpigmentação",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["IVC"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Compressão",
          "Ultrassom venoso",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu IVC",
        "Prescreveu compressão",
        "Solicitou ultrassom",
      ],
      erros_comuns: ["Não pesquisar TVP prévia"],
      orientacoes_pedagogicas: [
        "IVC: varizes + edema + pigmentação",
        "Sempre fazer ultrassom para descartar TVP",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Diagnosticar IVC e instituir compressão",
      comunicacao: ["explicou natureza crônica"],
      anamnese: ["investigou piora"],
      exame_fisico: ["detectou varizes e edema"],
      exames_complementares: ["pediu ultrassom"],
      raciocinio: ["diagnosticou IVC"],
      conduta: ["prescreveu compressão"],
      soap: ["documentou IVC"],
    },

    temaOSCE: "Vasculopatia Periférica",
    subtopicosOSCE: [
      "Insuficiência venosa crônica",
      "Varizes",
      "Edema crônico",
      "Lipodermatosclerose",
    ],
    diagnosticoCorreto: "Insuficiência Venosa Crônica",
  },

  {
    // ====== CASO 29: TROMBOSE VENOSA PROFUNDA ======
    id: "29",
    titulo: "Trombose Venosa Profunda",
    sistema: "Vascular",
    tema: "Vasculopatia Periférica",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 11,
    objetivo_pedagogico: "Diagnosticar TVP e iniciar anticoagulação apropriada",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Lucas Martins",
      idade: 42,
      sexo: "Masculino",
      queixa_principal: "Inchaço e dor na perna",
      historia_breve: "Inchaço súbito após cirurgia há 5 dias, dor localizada",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Trombose Venosa Profunda de membro inferior esquerdo",
      diagnosticos_diferenciais: ["Celulite", "Bursite", "Ruptura de Baker"],
      sindromes_associadas: ["Risco de Embolia Pulmonar"],
    },

    descricaoBreve: "Paciente com edema assimétrico, dor, ultrassom com trombo venoso",
    categoria: "Vascular",
    paciente: {
      id: "pac-029",
      nome: "Lucas Martins",
      idade: 42,
      sexo: "M",
      queixaPrincipal: "Inchaço e dor",
      historicoDoenca: "Cirurgia há 5 dias",
      antecedentes: ["Cirurgia ortopédica recente"],
      profissao: "Executivo",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Minha perna inchou muito depois da cirurgia",
      edema: "Sim, comparando está muito maior",
      dor: "Sim, dor na panturrilha",
      duracao: "Começou ontem",
      febre: "Não",
      vermelha: "Não está vermelha, só inchada",
    },
    respostaPaciente: {
      inicial: "Inchaço na perna",
      edema: "Sim",
      dor: "Sim",
      duracao: "Ontem",
      febre: "Não",
      vermelha: "Não",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "130/80 mmHg",
        frequenciaCardiaca: 85,
        frequenciaRespiratoria: 18,
        temperatura: 36.8,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "130/80 mmHg",
      frequenciaCardiaca: 85,
      frequenciaRespiratoria: 18,
      temperatura: 36.8,
      saturacaoOxigenio: 98,
    },

    exame_fisico: {
      correto: {
        inspecao: "Edema assimétrico em MIE, calor local",
        palpacao: "Dor à palpação, empastamento muscular",
        ausculta: "Normal",
        percussao: "Normal",
        observacoes: "Diferença de circunferência >2cm entre membros",
        regiao: "Membros inferiores",
        achados_positivos: ["Edema assimétrico"],
        achados_negativos: ["Eritema"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Edema assimétrico",
      palpacao: "Dor, empastamento",
      ausculta: "Normal",
      percussao: "Normal",
      observacoes: "Sugestivo de TVP",
    },

    exame_fisico_interativo: {
      membros: {
        edema: "Assimétrico grau III",
        pulsos: "Presentes bilateralmente",
        temperatura: "Normal",
        mobilidade: "Normal",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Ultrassom Venoso Duplex",
        descricao: "Avaliação de trombose",
        resultado: "Trombo em veia femoral profunda",
        valor_referencia: "Sem trombo",
        interpretacao: "TVP confirmada",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Trombose Venosa Profunda",
        probabilidade: 90,
        criterios_minimos: [
          "Edema assimétrico",
          "Dor",
          "Trombo no ultrassom",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Celulite",
        criterios_exclusao: ["Trombo no ultrassom"],
        achados_que_descartam: ["Ultrassom normal"],
      },
    ],
    examesIndicados: [
      "Ultrassom venoso duplex urgente",
      "D-dímero",
    ],

    conduta_esperada: {
      imediata: [
        "Anticoagulação imediata",
        "Elevação de membro",
      ],
      curto_prazo: [
        "Iniciar DOAC ou warfarina",
        "Possível trombólise",
      ],
      longo_prazo: [
        "Anticoagulação por 3 meses",
      ],
      encaminhamentos: ["Angiologia"],
    },
    condutaCorreta: "Ultrassom urgente, anticoagulação imediata com HBPM, DOAC ou warfarina",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["TVP extensa", "Risco de TEP"],
        descricao: "Emergência vascular",
        recomendacao: "Anticoagulação urgente",
      },
    ],

    erros_criticos: [
      {
        erro: "Não anticoagular",
        descricao: "Risco de TEP",
        penalidade: 3,
        evitavel: true,
      },
      {
        erro: "Não fazer ultrassom",
        descricao: "Diagnóstico definitivo necessário",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Mediu circunferência de membros",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou ultrassom duplex",
        realizado: false,
        critico: true,
      },
      {
        item: "Iniciou anticoagulação",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de TVP",
        peso: 30,
        descricao: "Achados clínicos e ultrassom",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Anticoagulação",
        peso: 25,
        descricao: "Prevenção de TEP",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Edema súbito",
          "Cirurgia recente",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Edema assimétrico",
          "Trombo no ultrassom",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["TVP"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Anticoagulação",
          "Seguimento",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu TVP",
        "Solicitou ultrassom",
        "Iniciou anticoagulação",
      ],
      erros_comuns: ["Confundir com celulite"],
      orientacoes_pedagogicas: [
        "TVP pós-cirurgia é complicação comum",
        "Sempre fazer ultrassom para confirmar",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Diagnosticar TVP e iniciar anticoagulação",
      comunicacao: ["explicou risco de TEP"],
      anamnese: ["investigou fator de risco"],
      exame_fisico: ["mediu edema"],
      exames_complementares: ["pediu ultrassom"],
      raciocinio: ["diagnosticou TVP"],
      conduta: ["anticoagulou"],
      soap: ["documentou TVP"],
    },

    temaOSCE: "Vasculopatia Periférica",
    subtopicosOSCE: [
      "TVP",
      "Edema assimétrico",
      "Ultrassom com trombo",
      "Anticoagulação",
    ],
    diagnosticoCorreto: "Trombose Venosa Profunda",
  },

  {
    // ====== CASO 30: DOENÇA ARTERIAL OCLUSIVA PERIFÉRICA ======
    id: "30",
    titulo: "Doença Arterial Oclusiva Periférica com Claudicação",
    sistema: "Vascular",
    tema: "Vasculopatia Periférica",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 10,
    objetivo_pedagogico: "Diagnosticar DAOP e calcular risco cardiovascular",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Otávio Gomes",
      idade: 68,
      sexo: "Masculino",
      queixa_principal: "Dor nas pernas ao caminhar",
      historia_breve: "Cansaço nas pernas após caminhar uma quadra, melhora com repouso",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "DAOP com Claudicação Intermitente",
      diagnosticos_diferenciais: ["Bursite", "Trombose venosa", "Claudicação neurógena"],
      sindromes_associadas: ["Aterosclerose generalizada"],
    },

    descricaoBreve: "Paciente com pulsos periféricos diminuídos, sopro femoral, claudicação reproduzível",
    categoria: "Vascular",
    paciente: {
      id: "pac-030",
      nome: "Otávio Gomes",
      idade: 68,
      sexo: "M",
      queixaPrincipal: "Dor ao caminhar",
      historicoDoenca: "Limitação funcional há 1 ano",
      antecedentes: ["Tabagismo", "HAS", "Diabetes"],
      profissao: "Aposentado",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: ["Losartana"],
    },

    respostas_do_paciente: {
      inicial: "Quando caminho, minhas pernas doem",
      dor: "Dor nas panturrilhas",
      distancia: "Consigo caminhar uns 100 metros",
      melhora: "Passa com repouso",
      inicio: "Começou há 1 ano",
      pés_frios: "Sim, meus pés ficam frios",
    },
    respostaPaciente: {
      inicial: "Dor ao caminhar",
      dor: "Panturrilhas",
      distancia: "100 metros",
      melhora: "Com repouso",
      inicio: "1 ano",
      pés_frios: "Sim",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "160/95 mmHg",
        frequenciaCardiaca: 78,
        frequenciaRespiratoria: 16,
        temperatura: 36.8,
        saturacaoOxigenio: 97,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "160/95 mmHg",
      frequenciaCardiaca: 78,
      frequenciaRespiratoria: 16,
      temperatura: 36.8,
      saturacaoOxigenio: 97,
    },

    exame_fisico: {
      correto: {
        inspecao: "Palidez em pés elevados, rubor em pé pendente",
        palpacao: "Pulsos femorais diminuídos, ausência de pulso tibial",
        ausculta: "Sopro femoral bilateral",
        percussao: "Normal",
        observacoes: "Temperatura reduzida em extremidades",
        regiao: "Membros inferiores",
        achados_positivos: ["Pulsos diminuídos", "Sopro"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Palidez em pés elevados",
      palpacao: "Pulsos diminuídos",
      ausculta: "Sopro vascular",
      percussao: "Normal",
      observacoes: "Sinais de DAOP",
    },

    exame_fisico_interativo: {
      membros: {
        pulsos: "Pulso femoral presente, poplíteo ausente",
        perfusao: "Reduzida",
        temperatura: "Pés frios",
        mobilidade: "Normal",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Índice Tornozelo-Braquial",
        descricao: "Relação pressão tornozelo/braço",
        resultado: "0.45",
        valor_referencia: ">0.9",
        interpretacao: "DAOP moderada a grave",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "DAOP com Claudicação",
        probabilidade: 95,
        criterios_minimos: [
          "Claudicação reproduzível",
          "Pulsos diminuídos",
          "ABI baixo",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Claudicação neurógena",
        criterios_exclusao: ["ABI anormal"],
        achados_que_descartam: ["Pulsos normais"],
      },
    ],
    examesIndicados: [
      "Índice tornozelo-braquial",
      "Ultrassom duplex arterial",
    ],

    conduta_esperada: {
      imediata: [
        "Modificação de fatores de risco",
        "Aspirina",
      ],
      curto_prazo: [
        "Reabilitação vascular",
        "Possível angioplastia",
      ],
      longo_prazo: [
        "Acompanhamento angiológico",
        "Controle de risco CV",
      ],
      encaminhamentos: ["Angiologia"],
    },
    condutaCorreta: "ABI, ultrassom duplex, aspirina, modificação de fatores de risco, possível revascularização",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["ABI <0.4", "Claudicação incapacitante"],
        descricao: "Risco de perda de membro",
        recomendacao: "Considerar revascularização",
      },
    ],

    erros_criticos: [
      {
        erro: "Não investigar risco CV",
        descricao: "DAOP indica aterosclerose",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Perguntou sobre claudicação",
        realizado: false,
        critico: true,
      },
      {
        item: "Palpou pulsos",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou ABI",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de DAOP",
        peso: 25,
        descricao: "Achados clínicos",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Avaliação de risco",
        peso: 20,
        descricao: "Investigação CV",
        pontuacao_maxima: 20,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Claudicação a distância definida",
          "Melhora com repouso",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Pulsos diminuídos",
          "ABI reduzido",
          "Sopro",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["DAOP"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Aspirina",
          "Modificação de fatores",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu DAOP",
        "Solicitou ABI",
        "Avaliou risco CV",
      ],
      erros_comuns: ["Achar que é muscular"],
      orientacoes_pedagogicas: [
        "Claudicação: dor ao caminhar que melhora com repouso",
        "DAOP é marker de aterosclerose",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Diagnosticar DAOP e avaliar risco CV",
      comunicacao: ["explicou relação com tabagismo"],
      anamnese: ["investigou distância de claudicação"],
      exame_fisico: ["palpou pulsos"],
      exames_complementares: ["pediu ABI"],
      raciocinio: ["diagnosticou DAOP"],
      conduta: ["prescreveu aspirina"],
      soap: ["documentou DAOP"],
    },

    temaOSCE: "Vasculopatia Periférica",
    subtopicosOSCE: [
      "DAOP",
      "Claudicação intermitente",
      "ABI baixo",
      "Aterosclerose",
    ],
    diagnosticoCorreto: "Doença Arterial Oclusiva Periférica com Claudicação",
  },

  {
    // ====== CASO 31: ASMA AGUDA LEVE-MODERADA ======
    id: "31",
    titulo: "Asma Aguda Leve-Moderada",
    sistema: "Respiratório",
    tema: "Dispneia Aguda",
    nivel: "iniciante",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 10,
    objetivo_pedagogico: "Diagnosticar crise asmática leve-moderada e estabelecer tratamento broncodilatador",

    dados_visiveis_ao_estudante: {
      nome_paciente: "João Silva",
      idade: 28,
      sexo: "Masculino",
      queixa_principal: "Falta de ar e chiado no peito",
      historia_breve: "Asma desde infância, controlada com inalador, agora com crise após exposição a ácaros",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Asma Aguda Leve-Moderada",
      diagnosticos_diferenciais: ["DPOC", "Anafilaxia", "Embolia Pulmonar"],
      sindromes_associadas: ["Obstrução Reversível de Vias Aéreas"],
    },

    descricaoBreve: "Paciente com dispneia, chiado no peito, ausculta com sibilância bilateral",
    categoria: "Asma",
    paciente: {
      id: "pac-031",
      nome: "João Silva",
      idade: 28,
      sexo: "M",
      queixaPrincipal: "Falta de ar e chiado",
      historicoDoenca: "Asma desde infância, bem controlada",
      antecedentes: ["Asma", "Alergias"],
      profissao: "Analista de sistemas",
      estado_civil: "Solteiro",
      alergias: ["Ácaros", "Pólen"],
      medicamentos_em_uso: ["Salbutamol PRN"],
    },

    respostas_do_paciente: {
      inicial: "Tô com muita falta de ar e chiado no peito",
      chiado: "Sim, fazendo aquele barulho chato",
      tosse: "Sim, tosse seca",
      aperto: "Sim, aperto no peito",
      inicio: "Começou de repente há 2 horas",
      gatilho: "Limpei a casa e tive contato com poeira",
      inalador: "Usei o inalador mas não melhorou muito",
    },
    respostaPaciente: {
      inicial: "Falta de ar e chiado",
      chiado: "Sim",
      tosse: "Sim",
      aperto: "Sim",
      inicio: "2 horas",
      gatilho: "Poeira",
      inalador: "Usei mas melhorou pouco",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "130/80 mmHg",
        frequenciaCardiaca: 100,
        frequenciaRespiratoria: 22,
        temperatura: 36.8,
        saturacaoOxigenio: 94,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "130/80 mmHg",
      frequenciaCardiaca: 100,
      frequenciaRespiratoria: 22,
      temperatura: 36.8,
      saturacaoOxigenio: 94,
    },

    exame_fisico: {
      correto: {
        inspecao: "Taquipneia leve, uso de musculatura acessória discreto",
        palpacao: "Expansão simétrica",
        ausculta: "Sibilância bilateral difusa, predomínio expiratório",
        percussao: "Normal",
        observacoes: "Compatível com broncoespasmo",
        regiao: "Pulmões",
        achados_positivos: ["Sibilância", "Taquipneia"],
        achados_negativos: ["Crepitações"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Taquipneia",
      palpacao: "Expansão normal",
      ausculta: "Sibilância bilateral",
      percussao: "Normal",
      observacoes: "Asma aguda",
    },

    exame_fisico_interativo: {
      respiratorio: {
        inspecao_torax: "Taquipneia 22 ipm, expansão simétrica",
        padrao_respiratorio: "Regular",
        expansibilidade: "Simétrica",
        ausculta_pulmonar: "Sibilância bilateral difusa, predominantemente expiratória",
        musculatura_acessoria: "Uso discreto",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Oximetria de Pulso",
        descricao: "Saturação de oxigênio",
        resultado: "94%",
        valor_referencia: ">95%",
        interpretacao: "Hipoxemia leve",
      },
      {
        nome: "Pico de Fluxo",
        descricao: "Peak flow",
        resultado: "70% do predito",
        valor_referencia: ">80%",
        interpretacao: "Redução moderada",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Asma Aguda Leve-Moderada",
        probabilidade: 95,
        criterios_minimos: [
          "Dispneia",
          "Chiado",
          "Sibilância bilateral",
          "Resposta a broncodilatador",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "DPOC",
        criterios_exclusao: ["Juventude", "História de asma"],
        achados_que_descartam: ["Histórico de asma infantil"],
      },
    ],
    examesIndicados: [
      "Oximetria",
      "Peak flow",
      "RX tórax se suspeita de pneumotórax",
    ],

    conduta_esperada: {
      imediata: [
        "Beta-agonista inalado",
        "Oxigenioterapia para manter SpO2 >90%",
        "Corticóide sistêmico",
      ],
      curto_prazo: [
        "Monitorização",
        "Resposta ao tratamento",
      ],
      longo_prazo: [
        "Controle de gatilhos",
        "Plano de ação escrito",
      ],
      encaminhamentos: ["Pneumologia"],
    },
    condutaCorreta: "Beta-agonista inalado, corticóide sistêmico, oxigenioterapia, monitorização",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["FR >20", "SpO2 94%", "Sibilância bilateral"],
        descricao: "Asma leve-moderada",
        recomendacao: "Tratamento ambulatorial com seguimento",
      },
    ],

    erros_criticos: [
      {
        erro: "Não prescrever corticóide",
        descricao: "Essencial no tratamento de asma aguda",
        penalidade: 2,
        evitavel: true,
      },
      {
        erro: "Não monitorizar oxigenação",
        descricao: "Necessário para avaliar resposta",
        penalidade: 1.5,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu crise asmática",
        realizado: false,
        critico: true,
      },
      {
        item: "Avaliou gravidade",
        realizado: false,
        critico: true,
      },
      {
        item: "Prescreveu beta-agonista",
        realizado: false,
        critico: true,
      },
      {
        item: "Prescreveu corticóide",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de asma",
        peso: 25,
        descricao: "Diferenciação",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Tratamento",
        peso: 25,
        descricao: "Beta-agonista e corticóide",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Dispneia aguda",
          "Chiado",
          "Gatilho",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Taquipneia",
          "Sibilância bilateral",
          "SpO2 reduzida",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Asma aguda leve-moderada"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Beta-agonista",
          "Corticóide",
          "Monitorização",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu asma",
        "Prescreveu beta-agonista",
        "Prescreveu corticóide",
        "Monitorizou",
      ],
      erros_comuns: ["Só prescrever beta-agonista"],
      orientacoes_pedagogicas: [
        "Asma aguda = beta-agonista + corticóide sempre",
        "Classificar como leve/moderada/grave para guiar manejo",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Diagnosticar asma e prescrever tratamento adequado",
      comunicacao: ["explicou plano de tratamento"],
      anamnese: ["investigou gatilhos"],
      exame_fisico: ["detectou sibilância"],
      exames_complementares: ["avaliou SpO2"],
      raciocinio: ["diagnosticou asma"],
      conduta: ["prescreveu medicações"],
      soap: ["documentou crise"],
    },

    temaOSCE: "Asma",
    subtopicosOSCE: [
      "Asma aguda",
      "Sibilância bilateral",
      "Beta-agonista",
      "Corticóide sistêmico",
    ],
    diagnosticoCorreto: "Asma Aguda Leve-Moderada",
  },

  {
    // ====== CASO 32: CRISE ASMÁTICA GRAVE ======
    id: "32",
    titulo: "Crise Asmática Grave",
    sistema: "Respiratório",
    tema: "Dispneia Aguda",
    nivel: "avancado",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Reconhecer crise asmática grave como emergência e instituir manejo apropriado",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Marina Costa",
      idade: 35,
      sexo: "Feminino",
      queixa_principal: "Falta de ar muito intensa, chiado intenso",
      historia_breve: "Crise asmática que começou ontem, piorou muito hoje, inaladores não controlaram",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Crise Asmática Grave (Status Asthmaticus)",
      diagnosticos_diferenciais: ["Anafilaxia", "Pneumotórax", "Embolia Pulmonar"],
      sindromes_associadas: ["Insuficiência Respiratória"],
    },

    descricaoBreve: "Paciente em insuficiência respiratória, com fadiga muscular, silêncio auscultório, redução grave de pico de fluxo",
    categoria: "Asma",
    paciente: {
      id: "pac-032",
      nome: "Marina Costa",
      idade: 35,
      sexo: "F",
      queixaPrincipal: "Falta de ar intensa",
      historicoDoenca: "Asma desde infância, crises frequentes",
      antecedentes: ["Asma", "Alergias", "GERD"],
      profissao: "Enfermeira",
      estado_civil: "Solteira",
      alergias: ["Vários"],
      medicamentos_em_uso: ["Salbutamol", "Fluticasona"],
    },

    respostas_do_paciente: {
      inicial: "Não consigo respirar, tô morrendo de falta de ar",
      respiracao: "Muito ruim, tenho que fazer esforço grande",
      chiado: "Não tô mais ouvindo chiado, tá muito pior",
      sentado: "Só consigo respirar sentada ou em pé",
      fadiga: "Estou muito cansada, os pulmões estão doendo",
      inaladores: "Usei vários mas não melhorou",
      confusao: "Tô confusa, tonteada",
    },
    respostaPaciente: {
      inicial: "Não consigo respirar",
      respiracao: "Muito ruim",
      chiado: "Não tô ouvindo",
      sentado: "Sim",
      fadiga: "Muita",
      inaladores: "Não ajudaram",
      confusao: "Sim",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "160/100 mmHg",
        frequenciaCardiaca: 130,
        frequenciaRespiratoria: 32,
        temperatura: 37.2,
        saturacaoOxigenio: 85,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "160/100 mmHg",
      frequenciaCardiaca: 130,
      frequenciaRespiratoria: 32,
      temperatura: 37.2,
      saturacaoOxigenio: 85,
    },

    exame_fisico: {
      correto: {
        inspecao: "Taquipneia severa, uso intenso de musculatura acessória, sudorese profusa, agitação",
        palpacao: "Expansão torácica reduzida, assimétrica",
        ausculta: "Silêncio auscultório bilateral (pulmão silencioso = sinal grave), ausência de sibilos",
        percussao: "Normal",
        observacoes: "Sinais de insuficiência respiratória grave - EMERGÊNCIA",
        regiao: "Pulmões",
        achados_positivos: ["Taquipneia severa"],
        achados_negativos: ["Sibilos"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Taquipneia severa, fadiga",
      palpacao: "Expansão reduzida",
      ausculta: "Silêncio auscultório",
      percussao: "Normal",
      observacoes: "Emergência respiratória",
    },

    exame_fisico_interativo: {
      respiratorio: {
        inspecao_torax: "Taquipneia 32 ipm, expansão torácica muito reduzida",
        padrao_respiratorio: "Rápido e superficial",
        expansibilidade: "Muito reduzida",
        fremito_toracovocal: "Diminuído",
        ausculta_pulmonar: "Silêncio auscultório bilateral (ausência de ruídos respiratórios)",
        musculatura_acessoria: "Uso intenso de esterno-cleidomastoideo e escalenos",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Oximetria de Pulso",
        descricao: "Saturação de oxigênio",
        resultado: "85%",
        valor_referencia: ">95%",
        interpretacao: "Hipoxemia grave",
      },
      {
        nome: "Pico de Fluxo",
        descricao: "Peak flow",
        resultado: "<40% do predito ou não consegue medir",
        valor_referencia: ">80%",
        interpretacao: "Obstrução severa",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Crise Asmática Grave (Status Asthmaticus)",
        probabilidade: 98,
        criterios_minimos: [
          "Dispneia severa em repouso",
          "Silêncio auscultório",
          "SpO2 <90%",
          "Fadiga muscular",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Anafilaxia",
        criterios_exclusao: ["Ausência de urticária, angioedema"],
        achados_que_descartam: ["História compatível com asma"],
      },
    ],
    examesIndicados: [
      "Oximetria urgente",
      "ABG se disponível",
      "RX tórax para descartar pneumotórax",
    ],

    conduta_esperada: {
      imediata: [
        "Encaminhar para emergência/UTI URGENTEMENTE",
        "Oxigenioterapia agressiva (máscara não-reinalante)",
        "Broncodilatador inalado contínuo ou IV",
        "Corticóide IV",
        "Possível intubação",
      ],
      curto_prazo: [
        "Monitorização em UTI",
        "Suporte respiratório",
        "Investigação de causa desencadeante",
      ],
      longo_prazo: [
        "Controle de asma",
        "Plano de ação",
      ],
      encaminhamentos: ["Emergência", "UTI", "Pneumologia"],
    },
    condutaCorreta: "Emergência respiratória - oxigenioterapia agressiva, broncodilatadores, corticóide IV, considerar intubação",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: [
          "SpO2 <90%",
          "Silêncio auscultório",
          "Taquipneia >30",
          "Fadiga muscular",
          "Confusão mental",
        ],
        descricao: "Insuficiência respiratória iminente, risco de parada cardiorrespiratória",
        recomendacao: "Intubação e ventilação mecânica",
      },
    ],

    erros_criticos: [
      {
        erro: "Não reconhecer como emergência",
        descricao: "Silêncio auscultório é sinal ominoso",
        penalidade: 3,
        evitavel: true,
      },
      {
        erro: "Atrasar oxigenioterapia e encaminhamento para UTI",
        descricao: "Paciente pode descompensar rapidamente",
        penalidade: 3,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu asma grave",
        realizado: false,
        critico: true,
      },
      {
        item: "Iniciou oxigenioterapia agressiva",
        realizado: false,
        critico: true,
      },
      {
        item: "Prescreveu broncodilatador",
        realizado: false,
        critico: true,
      },
      {
        item: "Prescreveu corticóide IV",
        realizado: false,
        critico: true,
      },
      {
        item: "Encaminhou para UTI",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de emergência",
        peso: 35,
        descricao: "Silêncio auscultório e hipoxemia",
        pontuacao_maxima: 35,
      },
      {
        criterio: "Manejo apropriado",
        peso: 30,
        descricao: "Oxigenação e encaminhamento",
        pontuacao_maxima: 30,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Dispneia severa",
          "Falha de resposta a inaladores",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Taquipneia 32",
          "SpO2 85%",
          "Silêncio auscultório",
          "Fadiga muscular",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "Status asthmaticus",
          "Insuficiência respiratória iminente",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Oxigenioterapia agressiva",
          "Broncodilatadores IV/contínuo",
          "Corticóide IV",
          "UTI",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu gravidade",
        "Iniciou oxigenioterapia agressiva",
        "Prescreveu medicações IV",
        "Encaminhou UTI",
      ],
      erros_comuns: [
        "Achar que apenas inaladores resolverão",
        "Não reconhecer silêncio auscultório como grave",
      ],
      orientacoes_pedagogicas: [
        "Silêncio auscultório em asma = pulmão muito obstruído = EMERGÊNCIA",
        "Status asthmaticus requer UTI e suporte avançado",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer asma grave como emergência respiratória e instituir manejo apropriado",
      comunicacao: ["explicou gravidade à paciente"],
      anamnese: ["investigou causa desencadeante"],
      exame_fisico: ["reconheceu silêncio auscultório"],
      exames_complementares: ["avaliou SpO2 urgentemente"],
      raciocinio: ["diagnosticou status asthmaticus"],
      conduta: ["iniciou oxigenioterapia agressiva e medicações"],
      soap: ["documentou emergência respiratória"],
    },

    temaOSCE: "Asma",
    subtopicosOSCE: [
      "Asma grave",
      "Status asthmaticus",
      "Silêncio auscultório",
      "Insuficiência respiratória",
      "Emergência",
    ],
    diagnosticoCorreto: "Crise Asmática Grave (Status Asthmaticus)",
  },

  {
    // ====== CASO 33: DPOC ESTÁVEL ======
    id: "33",
    titulo: "DPOC Estável",
    sistema: "Respiratório",
    tema: "Doença Obstrutiva",
    nivel: "iniciante",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 10,
    objetivo_pedagogico: "Diagnosticar DPOC estável e orientar manejo de manutenção",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Gilson Andrade",
      idade: 65,
      sexo: "Masculino",
      queixa_principal: "Tosse crônica e falta de ar",
      historia_breve: "Fumante de 40 anos-maço, tosse diária com catarro, limitação aos esforços",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "DPOC Estável Gold II",
      diagnosticos_diferenciais: ["Asma", "Cardiopatia", "Bronquiectasia"],
      sindromes_associadas: ["Obstrução Crônica de Vias Aéreas"],
    },

    descricaoBreve: "Paciente com tosse crônica, sibilância leve, tórax em tonel, baqueteamento",
    categoria: "DPOC",
    paciente: {
      id: "pac-033",
      nome: "Gilson Andrade",
      idade: 65,
      sexo: "M",
      queixaPrincipal: "Tosse crônica",
      historicoDoenca: "Fumante 40 anos, tosse há 10 anos",
      antecedentes: ["Tabagismo", "DPOC"],
      profissao: "Aposentado",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: ["Salbutamol", "Fluticasona/Salmeterol"],
    },

    respostas_do_paciente: {
      inicial: "Tô com tosse constante, sou fumante há muitos anos",
      tosse: "Sim, diária, com catarro amarelado",
      respiracao: "Fico cansado ao subir escada",
      historico: "Fumava 2 maços por dia, agora fumei menos",
      catarro: "Toss todo dia, principalmente de manhã",
      fumaca: "Piora quando respiro fumaça ou poluição",
    },
    respostaPaciente: {
      inicial: "Tosse crônica",
      tosse: "Sim, diária",
      respiracao: "Cansaço ao esforço",
      historico: "Fumante 40 anos",
      catarro: "Amarelado",
      fumaca: "Piora",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "135/85 mmHg",
        frequenciaCardiaca: 82,
        frequenciaRespiratoria: 18,
        temperatura: 36.8,
        saturacaoOxigenio: 92,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "135/85 mmHg",
      frequenciaCardiaca: 82,
      frequenciaRespiratoria: 18,
      temperatura: 36.8,
      saturacaoOxigenio: 92,
    },

    exame_fisico: {
      correto: {
        inspecao: "Tórax em tonel, leve uso de musculatura acessória, baqueteamento digital",
        palpacao: "Expansão torácica diminuída",
        ausculta: "Murmúrio vesicular reduzido bilateral, sibilos esparsos, roncos",
        percussao: "Hipersonoro",
        observacoes: "Achados típicos de DPOC",
        regiao: "Pulmões",
        achados_positivos: ["MV reduzido", "Sibilos", "Roncos"],
        achados_negativos: ["Crepitações"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Tórax em tonel",
      palpacao: "Expansão reduzida",
      ausculta: "MV reduzido, sibilos, roncos",
      percussao: "Hipersonoro",
      observacoes: "DPOC típica",
    },

    exame_fisico_interativo: {
      respiratorio: {
        inspecao_torax: "Tórax em tonel, diâmetro AP aumentado",
        padrao_respiratorio: "Frequência normal, padrão pursed-lips positive",
        expansibilidade: "Reduzida bilateralmente",
        ausculta_pulmonar: "MV reduzido bilateralmente, sibilos e roncos esparsos",
        musculatura_acessoria: "Leve uso",
      },
      geral: {
        estado_geral: "Baqueteamento digital bilateral",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Espirometria",
        descricao: "Avaliação de função pulmonar",
        resultado: "FEV1 65% do predito, FEV1/FVC 0.62",
        valor_referencia: "FEV1 >80%, FEV1/FVC >0.70",
        interpretacao: "DPOC GOLD II (moderada)",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "DPOC Estável",
        probabilidade: 95,
        criterios_minimos: [
          "Histórico de tabagismo",
          "Tosse crônica",
          "Obstrução em espirometria",
          "Tórax em tonel",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Asma",
        criterios_exclusao: ["História de tabagismo de 40 anos"],
        achados_que_descartam: ["Baqueteamento"],
      },
    ],
    examesIndicados: [
      "Espirometria",
      "RX tórax",
      "TC se suspeita de bronquiectasia",
    ],

    conduta_esperada: {
      imediata: [
        "Cessar tabagismo",
        "Broncodilatadores",
      ],
      curto_prazo: [
        "Espirometria",
        "Vacinação",
      ],
      longo_prazo: [
        "Broncodilatadores contínuos",
        "Reabilitação pulmonar",
      ],
      encaminhamentos: ["Pneumologia"],
    },
    condutaCorreta: "Espirometria, broncodilatadores, cessação de tabagismo, reabilitação pulmonar",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["FEV1 50-79%", "Sintomas ao esforço"],
        descricao: "DPOC moderada",
        recomendacao: "Medicações broncodilatadoras",
      },
    ],

    erros_criticos: [
      {
        erro: "Não solicitar espirometria",
        descricao: "Confirmação diagnóstica necessária",
        penalidade: 1.5,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu DPOC",
        realizado: false,
        critico: true,
      },
      {
        item: "Perguntou sobre tabagismo",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou espirometria",
        realizado: false,
        critico: true,
      },
      {
        item: "Orientou cessação de tabagismo",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de DPOC",
        peso: 25,
        descricao: "Achados clínicos",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Manejo",
        peso: 20,
        descricao: "Medicações e cessação",
        pontuacao_maxima: 20,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Tosse crônica",
          "História de tabagismo",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Tórax em tonel",
          "MV reduzido",
          "Obstrução em espirometria",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["DPOC"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Broncodilatadores",
          "Cessação tabagismo",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu DPOC",
        "Pesquisou tabagismo",
        "Solicitou espirometria",
        "Orientou cessação",
      ],
      erros_comuns: ["Confundir com asma"],
      orientacoes_pedagogicas: [
        "DPOC: tabagismo + tosse crônica + obstrução não reversível",
        "Baqueteamento é sinal de DPOC, não de asma",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Diagnosticar DPOC e orientar sobre fatores de risco",
      comunicacao: ["explicou importância de cessar tabagismo"],
      anamnese: ["investigou tabagismo"],
      exame_fisico: ["detectou tórax em tonel"],
      exames_complementares: ["pediu espirometria"],
      raciocinio: ["diagnosticou DPOC"],
      conduta: ["prescreveu medicações"],
      soap: ["documentou DPOC"],
    },

    temaOSCE: "Doença Obstrutiva",
    subtopicosOSCE: [
      "DPOC",
      "Tabagismo",
      "Tórax em tonel",
      "Obstrução não reversível",
      "Baqueteamento",
    ],
    diagnosticoCorreto: "DPOC Estável",
  },

  {
    // ====== CASO 34: DPOC EXACERBADO ======
    id: "34",
    titulo: "DPOC Exacerbado",
    sistema: "Respiratório",
    tema: "Doença Obstrutiva",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Diagnosticar exacerbação de DPOC e estabelecer terapia apropriada",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Roberto Pereira",
      idade: 62,
      sexo: "Masculino",
      queixa_principal: "Falta de ar e tosse piores, com catarro colorido",
      historia_breve: "Paciente com DPOC conhecida, agora com piora aguda de sintomas",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Exacerbação Aguda de DPOC",
      diagnosticos_diferenciais: ["Pneumonia", "Insuficiência cardíaca", "Pneumotórax"],
      sindromes_associadas: ["Bronquite Aguda"],
    },

    descricaoBreve: "Paciente com aumento de dispneia, tosse com catarro purulento, taquipneia",
    categoria: "DPOC",
    paciente: {
      id: "pac-034",
      nome: "Roberto Pereira",
      idade: 62,
      sexo: "M",
      queixaPrincipal: "Falta de ar piora",
      historicoDoenca: "DPOC há 10 anos",
      antecedentes: ["DPOC", "Tabagismo"],
      profissao: "Aposentado",
      estado_civil: "Viúvo",
      alergias: [],
      medicamentos_em_uso: ["Salbutamol", "Tiotropio"],
    },

    respostas_do_paciente: {
      inicial: "Tô pior que o normal, falta de ar de repente",
      respiracao: "Muito piora, mal consigo andar",
      tosse: "Tosse com catarro verde, mudou de cor",
      febre: "Sim, tô com febre",
      duracao: "Começou há 3 dias",
      gatilho: "Acho que peguei resfriado",
    },
    respostaPaciente: {
      inicial: "Piora de falta de ar",
      respiracao: "Muita piora",
      tosse: "Catarro verde",
      febre: "Sim",
      duracao: "3 dias",
      gatilho: "Resfriado",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "145/90 mmHg",
        frequenciaCardiaca: 105,
        frequenciaRespiratoria: 24,
        temperatura: 38.3,
        saturacaoOxigenio: 88,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "145/90 mmHg",
      frequenciaCardiaca: 105,
      frequenciaRespiratoria: 24,
      temperatura: 38.3,
      saturacaoOxigenio: 88,
    },

    exame_fisico: {
      correto: {
        inspecao: "Taquipneia, uso de musculatura acessória, cianose periférica",
        palpacao: "Expansão reduzida",
        ausculta: "MV reduzido, roncos e sibilos bilaterais",
        percussao: "Hipersonoro",
        observacoes: "Achados de exacerbação de DPOC com infecção",
        regiao: "Pulmões",
        achados_positivos: ["Taquipneia", "Roncos", "Sibilos"],
        achados_negativos: ["Crepitações focalizadas"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Taquipneia, cianose",
      palpacao: "Expansão reduzida",
      ausculta: "MV reduzido, roncos, sibilos",
      percussao: "Hipersonoro",
      observacoes: "Exacerbação DPOC",
    },

    exame_fisico_interativo: {
      respiratorio: {
        inspecao_torax: "Taquipneia 24 ipm, cianose periférica",
        padrao_respiratorio: "Rápido, com lábios cerrados na expiração",
        expansibilidade: "Reduzida",
        ausculta_pulmonar: "MV reduzido bilateralmente, roncos e sibilos",
        musculatura_acessoria: "Uso intenso",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "RX Tórax",
        descricao: "Avaliação de infiltrados",
        resultado: "Hiperinsuflação, sem infiltrado focal",
        valor_referencia: "Normal",
        interpretacao: "Exacerbação de DPOC sem pneumonia",
      },
      {
        nome: "Hemograma",
        descricao: "Leucócitos",
        resultado: "12.000/mm³, neutrofilia",
        valor_referencia: "<11.000",
        interpretacao: "Infecção",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Exacerbação Aguda de DPOC",
        probabilidade: 90,
        criterios_minimos: [
          "Aumento de dispneia",
          "Catarro aumentado/mudança cor",
          "Taquipneia",
          "Hipoxemia",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Pneumonia",
        criterios_exclusao: ["Ausência de consolidação"],
        achados_que_descartam: ["RX sem infiltrado focal"],
      },
    ],
    examesIndicados: [
      "RX de tórax",
      "Hemograma",
      "Gasometria arterial",
      "Culturas se indicado",
    ],

    conduta_esperada: {
      imediata: [
        "Oxigenioterapia",
        "Broncodilatadores",
        "Corticóide sistêmico",
        "Antibiótico se infecção",
      ],
      curto_prazo: [
        "Internação se necessário",
        "Monitorização",
      ],
      longo_prazo: [
        "Otimização de medicações",
        "Reabilitação pulmonar",
      ],
      encaminhamentos: ["Pneumologia", "Emergência"],
    },
    condutaCorreta: "Oxigenioterapia, broncodilatadores, corticóide sistêmico, antibiótico se infecção, possível internação",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["SpO2 <90%", "Taquipneia >24", "Alteração mental"],
        descricao: "Risco de insuficiência respiratória",
        recomendacao: "Internação e monitorização",
      },
    ],

    erros_criticos: [
      {
        erro: "Não oxigenar adequadamente",
        descricao: "Hipoxemia é vida-ameaçadora",
        penalidade: 2,
        evitavel: true,
      },
      {
        erro: "Não prescrever corticóide sistêmico",
        descricao: "Essencial em exacerbação",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu exacerbação de DPOC",
        realizado: false,
        critico: true,
      },
      {
        item: "Iniciou oxigenioterapia",
        realizado: false,
        critico: true,
      },
      {
        item: "Prescreveu broncodilatadores",
        realizado: false,
        critico: true,
      },
      {
        item: "Prescreveu corticóide",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou RX e hemograma",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de exacerbação",
        peso: 25,
        descricao: "Diferenciação de estável",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Manejo da exacerbação",
        peso: 25,
        descricao: "Medicações e oxigenação",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Aumento de dispneia",
          "Catarro mudou de cor",
          "Febre",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Taquipneia",
          "SpO2 reduzida",
          "MV reduzido",
          "RX sem infiltrado focal",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "Exacerbação DPOC",
          "Infecção bacteriana provável",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Oxigenioterapia",
          "Broncodilatadores",
          "Corticóide sistêmico",
          "Antibiótico",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu exacerbação",
        "Iniciou oxigenioterapia",
        "Prescreveu corticóide sistêmico",
        "Solicitou RX e hemograma",
      ],
      erros_comuns: [
        "Diagnosticar como pneumonia",
        "Não prescrever corticóide sistêmico",
      ],
      orientacoes_pedagogicas: [
        "Exacerbação DPOC: aumento de dispneia e mudança de catarro",
        "RX sem infiltrado focal descarta pneumonia",
        "Sempre usar corticóide sistêmico em exacerbação",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Diagnosticar exacerbação e prescrever manejo apropriado",
      comunicacao: ["explicou plano de tratamento"],
      anamnese: ["investigou mudanças agudas"],
      exame_fisico: ["avaliou nível de desconforto"],
      exames_complementares: ["pediu RX e hemograma"],
      raciocinio: ["diagnosticou exacerbação"],
      conduta: ["prescreveu medicações e oxigenioterapia"],
      soap: ["documentou exacerbação"],
    },

    temaOSCE: "Doença Obstrutiva",
    subtopicosOSCE: [
      "Exacerbação DPOC",
      "Aumento de sintomas",
      "Catarro purulento",
      "Corticóide sistêmico",
      "Antibiótico",
    ],
    diagnosticoCorreto: "Exacerbação Aguda de DPOC",
  },

  {
    // ====== CASO 38: DENGUE CLÁSSICA ======
    id: "38",
    titulo: "Dengue Clássica",
    sistema: "Infectologia",
    tema: "Arboviroses",
    nivel: "iniciante",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 10,
    objetivo_pedagogico: "Diagnosticar dengue clássica e orientar manejo de suporte",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Ana Paula Santos",
      idade: 32,
      sexo: "Feminino",
      queixa_principal: "Febre, dor de cabeça e mal-estar",
      historia_breve: "Febre alta há 3 dias, dor retro-orbitária, vive em área com dengue",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Dengue Clássica",
      diagnosticos_diferenciais: ["Influenza", "Chikungunya", "Zika", "Malária"],
      sindromes_associadas: ["Síndrome Febril Viral"],
    },

    descricaoBreve: "Paciente febril em fase aguda com exantema, cefaleia e mialgia sem sinais de alarme",
    categoria: "Arboviroses",
    paciente: {
      id: "pac-038",
      nome: "Ana Paula Santos",
      idade: 32,
      sexo: "F",
      queixaPrincipal: "Febre e dor de cabeça",
      historicoDoenca: "Febre há 3 dias",
      antecedentes: ["Vive em área endêmica de dengue"],
      profissao: "Professora",
      estado_civil: "Casada",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Estou com febre muito alta, dor de cabeça intensa",
      febre: "Sim, aparece de repente, muito alta",
      cefaleia: "Sim, dor de cabeça muito forte",
      retroorbitaria: "Dói muito atrás dos olhos",
      mialgia: "Sim, dor em todo o corpo, especialmente nas costas",
      artralgia: "Sinto dor nas juntas também",
      exantema: "Apareceu umas manchinhas vermelhas ontem",
      nausea: "Tenho náusea e perdi a vontade de comer",
      vomito: "Não vomitei",
    },
    respostaPaciente: {
      inicial: "Febre e dor de cabeça",
      febre: "Sim, alta",
      cefaleia: "Sim, intensa",
      retroorbitaria: "Sim",
      mialgia: "Sim",
      artralgia: "Sim",
      exantema: "Sim, manchinhas",
      nausea: "Sim",
      vomito: "Não",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "120/75 mmHg",
        frequenciaCardiaca: 90,
        frequenciaRespiratoria: 16,
        temperatura: 39.5,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "120/75 mmHg",
      frequenciaCardiaca: 90,
      frequenciaRespiratoria: 16,
      temperatura: 39.5,
      saturacaoOxigenio: 98,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente febril, face avermelhada, exantema maculopapular em tronco",
        palpacao: "Abdome mole, fígado palpável a 2cm",
        ausculta: "MV+, ausência de sopros",
        percussao: "Normal",
        observacoes: "Hepatomegalia discreta sem sinais de alarme",
        regiao: "Geral",
        achados_positivos: ["Febre", "Exantema", "Hepatomegalia"],
        achados_negativos: ["Sangramento", "Edema"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Febril, exantema maculopapular",
      palpacao: "Hepatomegalia 2cm",
      ausculta: "Normal",
      percussao: "Normal",
      observacoes: "Fase febril clássica",
    },

    exame_fisico_interativo: {
      geral: {
        estado_geral: "Paciente mal-estar, febril com exantema",
        coloracao: "Avermelhada com exantema",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Hemograma",
        descricao: "Contagem de células",
        resultado: "Hb 13, Ht 38%, Leucócitos 5.200, Plaquetas 150.000",
        valor_referencia: "Hb 12-16, Plaquetas >150.000",
        interpretacao: "Sem hemoconcentração",
      },
      {
        nome: "Sorologia Dengue IgM",
        descricao: "Anticorpo IgM anti-dengue",
        resultado: "Positivo",
        valor_referencia: "Negativo",
        interpretacao: "Infecção recente por dengue",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Dengue Clássica",
        probabilidade: 90,
        criterios_minimos: [
          "Febre",
          "Cefaleia retro-orbitária",
          "Mialgia",
          "Exantema",
          "Sorologia IgM positiva",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Chikungunya",
        criterios_exclusao: ["Sorologia dengue IgM positiva"],
        achados_que_descartam: ["IgM dengue positivo"],
      },
    ],
    examesIndicados: [
      "Hemograma",
      "Sorologia dengue (IgM/IgG)",
      "Testes rápidos de antígeno NS1",
    ],

    conduta_esperada: {
      imediata: [
        "Repouso",
        "Hidratação oral",
        "Dipirona ou paracetamol",
      ],
      curto_prazo: [
        "Monitorização de sintomas",
        "Retorno se surgir sangramento",
      ],
      longo_prazo: [
        "Educação sobre dengue",
      ],
      encaminhamentos: ["Avaliação de risco"],
    },
    condutaCorreta: "Suporte clínico, hidratação, analgesia, vigilância para sinais de alarme",

    criterios_de_gravidade: [
      {
        severidade: "leve",
        sinais: ["Febre", "Exantema", "Sem sangramento"],
        descricao: "Dengue clássica sem complicações",
        recomendacao: "Manejo ambulatorial com vigilância",
      },
    ],

    erros_criticos: [
      {
        erro: "Prescrever AAS",
        descricao: "AAS aumenta risco de sangramento em dengue",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu dengue",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou sorologia dengue",
        realizado: false,
        critico: true,
      },
      {
        item: "Orientou hidratação",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de dengue",
        peso: 25,
        descricao: "Sintomatologia clássica",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Conduta apropriada",
        peso: 20,
        descricao: "Suporte e vigilância",
        pontuacao_maxima: 20,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Febre alta",
          "Cefaleia retro-orbitária",
          "Mialgia",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Febre",
          "Exantema",
          "Hepatomegalia",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Dengue clássica"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Sorologia dengue",
          "Hidratação",
          "Vigilância",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu dengue",
        "Solicitou sorologia",
        "Prescreveu suporte clínico",
      ],
      erros_comuns: ["Prescrever AAS"],
      orientacoes_pedagogicas: [
        "Dengue: febre + cefaleia retro-orbitária + mialgia + exantema",
        "Nunca use AAS em dengue",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Diagnosticar dengue e orientar manejo seguro",
      comunicacao: ["explicou importância de vigilância"],
      anamnese: ["investigou sintomas clássicos"],
      exame_fisico: ["avaliou hepatomegalia"],
      exames_complementares: ["pediu sorologia"],
      raciocinio: ["diagnosticou dengue"],
      conduta: ["prescreveu suporte"],
      soap: ["documentou dengue"],
    },

    temaOSCE: "Arboviroses",
    subtopicosOSCE: [
      "Dengue",
      "Febre",
      "Cefaleia retro-orbitária",
      "Mialgia",
      "Arboviroses",
    ],
    diagnosticoCorreto: "Dengue Clássica",
  },

  {
    // ====== CASO 39: DENGUE COM SINAIS DE ALARME ======
    id: "39",
    titulo: "Dengue com Sinais de Alarme",
    sistema: "Infectologia",
    tema: "Arboviroses",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Reconhecer sinais de alarme em dengue e encaminhar para hospital",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Carlos Mendes",
      idade: 28,
      sexo: "Masculino",
      queixa_principal: "Febre que baixou, agora vômito e dor abdominal",
      historia_breve: "Dengue confirmada há 3 dias, evoluindo com piora na fase crítica",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Dengue com Sinais de Alarme",
      diagnosticos_diferenciais: ["Dengue hemorrágica", "Sindrome de choque dengue"],
      sindromes_associadas: ["Fase crítica da dengue"],
    },

    descricaoBreve: "Paciente em fase crítica com vômito, dor abdominal, queda de plaquetas e hemoconcentração",
    categoria: "Arboviroses",
    paciente: {
      id: "pac-039",
      nome: "Carlos Mendes",
      idade: 28,
      sexo: "M",
      queixaPrincipal: "Vômito e dor abdominal",
      historicoDoenca: "Dengue confirmada 3 dias atrás",
      antecedentes: ["Dengue confirmada"],
      profissao: "Motorista",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "A febre baixou mas agora piorou, tô vomitando muito",
      febre: "Febre baixou mas voltar a passar mal",
      vomito: "Sim, vômito persistente, já vomitei 5 vezes",
      dor_abdominal: "Dor forte no abdome, principalmente em cima",
      sangramento: "Vejo umas manchinhas avermelhadas, tipo roxo",
      fadiga: "Muito fraco, mal consigo sair do sofá",
      frequencia_urinaria: "Urina muito pouca",
    },
    respostaPaciente: {
      inicial: "Vômito e dor abdominal",
      febre: "Baixou",
      vomito: "Sim, persistente",
      dor_abdominal: "Sim, intensa",
      sangramento: "Manchinhas roxas",
      fadiga: "Muita",
      frequencia_urinaria: "Pouca",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "100/65 mmHg",
        frequenciaCardiaca: 110,
        frequenciaRespiratoria: 18,
        temperatura: 37.2,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "100/65 mmHg",
      frequenciaCardiaca: 110,
      frequenciaRespiratoria: 18,
      temperatura: 37.2,
      saturacaoOxigenio: 98,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente pálido, petéquias, equimoses, hepatomegalia",
        palpacao: "Abdome doloroso difuso, sem rigidez, fígado palpável a 3cm",
        ausculta: "Normal",
        percussao: "Ausência de macicez em flancos",
        observacoes: "Sinais de sangramento e hepatomegalia acentuada",
        regiao: "Geral",
        achados_positivos: ["Petéquias", "Equimoses", "Hepatomegalia"],
        achados_negativos: ["Rigidez abdominal"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Petéquias, equimoses, pálido",
      palpacao: "Hepatomegalia 3cm, abdome doloroso",
      ausculta: "Normal",
      percussao: "Normal",
      observacoes: "Sinais de alarme presentes",
    },

    exame_fisico_interativo: {
      geral: {
        coloracao: "Pálido com petéquias em MMII e equimoses em braço direito",
      },
      abdominal: {
        dor_palpacao: "Dor difusa",
        visceromegalias: "Hepatomegalia grau III",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Hemograma",
        descricao: "Contagem de células",
        resultado: "Hb 16, Ht 48%, Leucócitos 4.200, Plaquetas 75.000",
        valor_referencia: "Plaquetas >150.000",
        interpretacao: "Trombocitopenia com hemoconcentração",
      },
      {
        nome: "Hematócrito",
        descricao: "Mudança no hematócrito",
        resultado: "Aumento de 20% em relação ao basal",
        valor_referencia: "Variação <20%",
        interpretacao: "Hemoconcentração = extravasamento",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Dengue com Sinais de Alarme",
        probabilidade: 95,
        criterios_minimos: [
          "Vômito persistente",
          "Dor abdominal grave",
          "Trombocitopenia",
          "Hemoconcentração",
          "Petéquias",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Apendicite aguda",
        criterios_exclusao: ["História de dengue", "Trombocitopenia"],
        achados_que_descartam: ["Plaquetas baixas"],
      },
    ],
    examesIndicados: [
      "Hemograma com série branca",
      "Hematócrito seriado",
      "Testes de coagulação",
      "Ultrassom abdominal se disponível",
    ],

    conduta_esperada: {
      imediata: [
        "Encaminhar para hospital URGENTEMENTE",
        "Internação",
        "Repouso absoluto",
      ],
      curto_prazo: [
        "Monitorização contínua",
        "Soroterapia se necessário",
        "Observação de sangramentos",
      ],
      longo_prazo: [
        "Monitorização de complicações",
      ],
      encaminhamentos: ["Emergência hospitalar"],
    },
    condutaCorreta: "Internação urgente, monitorização contínua, soroterapia conforme necessário, observação de sangramento",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: [
          "Vômito persistente",
          "Dor abdominal",
          "Trombocitopenia",
          "Hemoconcentração",
        ],
        descricao: "Dengue em fase crítica com risco de choque",
        recomendacao: "Internação e monitorização constante",
      },
    ],

    erros_criticos: [
      {
        erro: "Não encaminhar para hospital",
        descricao: "Risco de progressão para choque",
        penalidade: 3,
        evitavel: true,
      },
      {
        erro: "Prescrever AINE",
        descricao: "Aumenta risco de sangramento",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu sinais de alarme",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou hemograma urgente",
        realizado: false,
        critico: true,
      },
      {
        item: "Encaminhou para hospital",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de sinais de alarme",
        peso: 30,
        descricao: "Risco de choque",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Decisão de encaminhar",
        peso: 25,
        descricao: "Necessidade de internação",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Vômito persistente",
          "Dor abdominal",
          "Poliúria",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Petéquias",
          "Hepatomegalia",
          "Trombocitopenia",
          "Hemoconcentração",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "Dengue com sinais de alarme",
          "Risco de choque",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Internação imediata",
          "Monitorização",
          "Soroterapia conforme necessário",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu sinais de alarme",
        "Solicitou hemograma urgente",
        "Encaminhou para hospital",
      ],
      erros_comuns: ["Achar que é de baixo risco"],
      orientacoes_pedagogicas: [
        "Sinais de alarme dengue: vômito persistente, dor abdominal, sangramento, trombocitopenia",
        "Sempre encaminhar para hospital na fase crítica",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer gravidade e encaminhar rapidamente",
      comunicacao: ["explicou necessidade de internação"],
      anamnese: ["investigou sinais de alarme"],
      exame_fisico: ["detectou petéquias e hepatomegalia"],
      exames_complementares: ["pediu hemograma urgente"],
      raciocinio: ["diagnosticou sinais de alarme"],
      conduta: ["encaminhou para hospital"],
      soap: ["documentou urgência"],
    },

    temaOSCE: "Arboviroses",
    subtopicosOSCE: [
      "Dengue com sinais de alarme",
      "Fase crítica",
      "Trombocitopenia",
      "Hemoconcentração",
      "Emergência",
    ],
    diagnosticoCorreto: "Dengue com Sinais de Alarme",
  },

  {
    // ====== CASO 40: FEBRE AMARELA ======
    id: "40",
    titulo: "Febre Amarela",
    sistema: "Infectologia",
    tema: "Arboviroses",
    nivel: "avancado",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Diagnosticar febre amarela e reconhecer sinais de gravidade",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Roberto Silva",
      idade: 45,
      sexo: "Masculino",
      queixa_principal: "Febre alta, vômito com sangue, dor abdominal intensa",
      historia_breve: "Viajou para Amazônia, febre iniciou 5 dias atrás, piorou muito",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Febre Amarela",
      diagnosticos_diferenciais: ["Dengue grave", "Malária", "Hepatite viral"],
      sindromes_associadas: ["Insuficiência Hepática Fulminante"],
    },

    descricaoBreve: "Paciente com febre bifásica, hematemese, icterícia progressiva, sinais de insuficiência hepática",
    categoria: "Arboviroses",
    paciente: {
      id: "pac-040",
      nome: "Roberto Silva",
      idade: 45,
      sexo: "M",
      queixaPrincipal: "Febre, vômito com sangue",
      historicoDoenca: "Viagem à Amazônia 10 dias atrás",
      antecedentes: ["Viagem a área de febre amarela", "Não vacinado"],
      profissao: "Pesquisador",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Tive febre muito alta, melhorou 1 dia, agora voltou pior",
      febre: "Febre bifásica, voltou com muito calafrio",
      vomito: "Sim, vomitei sangue, muito assustador",
      dor_abdominal: "Dor muito intensa em todo abdome",
      ictericia: "Fiquei amarelado",
      sangramento: "Vômito com sangue, possível melena",
      confusao: "Tô muito confuso, desorientado",
    },
    respostaPaciente: {
      inicial: "Febre bifásica e vômito com sangue",
      febre: "Bifásica",
      vomito: "Sim, com sangue",
      dor_abdominal: "Muito intensa",
      ictericia: "Sim",
      sangramento: "Hematemese",
      confusao: "Sim",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "90/55 mmHg",
        frequenciaCardiaca: 125,
        frequenciaRespiratoria: 20,
        temperatura: 40.2,
        saturacaoOxigenio: 96,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "90/55 mmHg",
      frequenciaCardiaca: 125,
      frequenciaRespiratoria: 20,
      temperatura: 40.2,
      saturacaoOxigenio: 96,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente febril, ictérico, bradicardia relativa, petéquias",
        palpacao: "Hepatomegalia intensa 5cm, baço palpável, abdome rígido",
        ausculta: "Murmúrio vesicular reduzido, sopro hemodinâmico",
        percussao: "Macicez em flancos (ascite)",
        observacoes: "Sinais de insuficiência hepática, coagulação e choque",
        regiao: "Geral",
        achados_positivos: ["Icterícia", "Hepatomegalia", "Petéquias", "Bradicardia relativa"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Ictérico, petéquias, bradicardia relativa",
      palpacao: "Hepatomegalia 5cm, ascite",
      ausculta: "MV reduzido",
      percussao: "Macicez",
      observacoes: "Insuficiência hepática grave",
    },

    exame_fisico_interativo: {
      geral: {
        coloracao: "Ictérico com petéquias múltiplas",
        facies: "Ictérica intensamente",
      },
      abdominal: {
        visceromegalias: "Hepatomegalia grau IV",
        inspecao: "Ascite presente",
        defesa: "Rigidez abdominal presente",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Transaminases",
        descricao: "ALT e AST",
        resultado: "ALT 2800 U/L, AST 3200 U/L",
        valor_referencia: "<40 U/L",
        interpretacao: "Hepatite fulminante",
      },
      {
        nome: "Bilirrubina total",
        descricao: "Bilirrubina",
        resultado: "12 mg/dL",
        valor_referencia: "<1.2 mg/dL",
        interpretacao: "Icterícia grave",
      },
      {
        nome: "INR",
        descricao: "Índice de normalizado internacional",
        resultado: "4.5",
        valor_referencia: "<1.1",
        interpretacao: "Coagulopatia grave",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Febre Amarela",
        probabilidade: 95,
        criterios_minimos: [
          "Viagem a área endêmica",
          "Febre bifásica",
          "Hepatomegalia acentuada",
          "Icterícia progressiva",
          "Hemorrágias",
          "Transaminases muito elevadas",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Hepatite viral fulminante",
        criterios_exclusao: ["Viagem a área de febre amarela"],
        achados_que_descartam: ["Histórico epidemiológico"],
      },
    ],
    examesIndicados: [
      "Sorologia febre amarela (IgM, IgG)",
      "PCR para febre amarela",
      "Hemograma completo",
      "Testes de coagulação",
      "Função hepática seriada",
    ],

    conduta_esperada: {
      imediata: [
        "Encaminhar para CTI/Hospital terciário URGENTEMENTE",
        "Internação em unidade de terapia intensiva",
        "Suporte hemodinâmico",
      ],
      curto_prazo: [
        "Monitorização invasiva",
        "Transfusão se necessário",
        "Manejo de coagulopatia",
      ],
      longo_prazo: [
        "Suporte de órgão",
        "Possível transplante hepático",
      ],
      encaminhamentos: ["CTI", "Hepatologia"],
    },
    condutaCorreta: "CTI urgente, suporte hemodinâmico e respiratório, manejo de coagulopatia, hepatologia urgente",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: [
          "Icterícia",
          "Coagulopatia",
          "Choque",
          "ALT/AST >1000",
        ],
        descricao: "Insuficiência hepática fulminante com risco de morte",
        recomendacao: "CTI e transplante hepático de emergência",
      },
    ],

    erros_criticos: [
      {
        erro: "Não encaminhar para CTI",
        descricao: "Mortalidade >50% sem manejo intensivo",
        penalidade: 3,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu febre amarela",
        realizado: false,
        critico: true,
      },
      {
        item: "Identificou insuficiência hepática",
        realizado: false,
        critico: true,
      },
      {
        item: "Encaminhou para CTI",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de febre amarela",
        peso: 30,
        descricao: "Quadro clínico e epidemiologia",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Urgência e conduta",
        peso: 25,
        descricao: "CTI imediato",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Febre bifásica",
          "Viagem à Amazônia",
          "Hemorrágias",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Icterícia",
          "Hepatomegalia acentuada",
          "Transaminases muito elevadas",
          "Coagulopatia",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "Febre amarela",
          "Insuficiência hepática fulminante",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "CTI urgente",
          "Sorologia febre amarela",
          "Suporte hemodinâmico",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu febre amarela",
        "Identificou insuficiência hepática",
        "Encaminhou para CTI",
      ],
      erros_comuns: ["Confundir com dengue grave"],
      orientacoes_pedagogicas: [
        "Febre amarela: febre bifásica + icterícia progressiva + hepatomegalia",
        "Sempre perguntar sobre viagens a área de risco",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer febre amarela como emergência máxima",
      comunicacao: ["explicou gravidade"],
      anamnese: ["investigou viagens"],
      exame_fisico: ["detectou icterícia e hepatomegalia"],
      exames_complementares: ["pediu sorologias"],
      raciocinio: ["diagnosticou febre amarela"],
      conduta: ["encaminhou CTI"],
      soap: ["documentou emergência"],
    },

    temaOSCE: "Arboviroses",
    subtopicosOSCE: [
      "Febre amarela",
      "Icterícia",
      "Insuficiência hepática",
      "Coagulopatia",
      "Emergência máxima",
    ],
    diagnosticoCorreto: "Febre Amarela",
  },

  {
    // ====== CASO 41: ZIKA COM SÍNDROME GUILLAIN-BARRÉ ======
    id: "41",
    titulo: "Zika com Síndrome de Guillain-Barré",
    sistema: "Infectologia",
    tema: "Arboviroses",
    nivel: "avancado",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Reconhecer complicação neurológica de Zika e instituir manejo apropriado",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Mariana Costa",
      idade: 30,
      sexo: "Feminino",
      queixa_principal: "Fraqueza progressiva das pernas, dificuldade para caminhar",
      historia_breve: "Febre e exantema há 10 dias, agora com fraqueza ascendente",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Zika com Síndrome de Guillain-Barré",
      diagnosticos_diferenciais: ["Paralisia flácida", "Polineuropatia periférica", "Mielite"],
      sindromes_associadas: ["Insuficiência respiratória potencial"],
    },

    descricaoBreve: "Paciente com história de Zika e paralisia flácida ascendente com arreflexia",
    categoria: "Arboviroses",
    paciente: {
      id: "pac-041",
      nome: "Mariana Costa",
      idade: 30,
      sexo: "F",
      queixaPrincipal: "Fraqueza progressiva",
      historicoDoenca: "Zika confirmada 10 dias atrás",
      antecedentes: ["Zika"],
      profissao: "Enfermeira",
      estado_civil: "Grávida",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Tive dengue ou Zika, agora não consigo mais caminhar",
      exantema_anterior: "Sim, tive febre e exantema há 10 dias",
      fraqueza: "Começou pelas pernas, agora subiu para os braços",
      ascensao: "Piora cada dia, sinto que tá subindo",
      dor: "Dor nas costas, formigamento",
      respiracao: "Um pouco de falta de ar ao deitar",
      sensibilidade: "Sinto formigamento nas mãos e pés",
    },
    respostaPaciente: {
      inicial: "Fraqueza progressiva",
      exantema_anterior: "Sim",
      fraqueza: "Ascendente",
      ascensao: "Sim",
      dor: "Sim",
      respiracao: "Leve",
      sensibilidade: "Sim",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "115/75 mmHg",
        frequenciaCardiaca: 85,
        frequenciaRespiratoria: 18,
        temperatura: 36.8,
        saturacaoOxigenio: 96,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "115/75 mmHg",
      frequenciaCardiaca: 85,
      frequenciaRespiratoria: 18,
      temperatura: 36.8,
      saturacaoOxigenio: 96,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente com déficit motor progressivo, fraqueza em MMII > MMSS",
        palpacao: "Tônus muscular reduzido, reflexos ausentes em MMII",
        ausculta: "MV simétrico bilateral",
        percussao: "Normal",
        observacoes: "Paralisia flácida ascendente com arreflexia",
        regiao: "Sistema nervoso periférico",
        achados_positivos: ["Fraqueza proximal e distal", "Arreflexia"],
        achados_negativos: ["Sinal de Babinski negativo"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Fraqueza ascendente",
      palpacao: "Tônus reduzido, arreflexia",
      ausculta: "MV normal",
      percussao: "Normal",
      observacoes: "SGB em evolução",
    },

    exame_fisico_interativo: {
      geral: {
        estado_geral: "Déficit motor progressivo em MMII e MMSS",
        marcha: "Impossível caminhar",
      },
      membros: {
        mobilidade: "Grau 2-3/5 MMII, 4/5 MMSS com arreflexia",
        edema: "Polineuropatia sensitiva simétrica",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Ressonância Magnética Coluna",
        descricao: "Avaliação de medula",
        resultado: "Normal, sem sinais de mielite",
        valor_referencia: "Sem alterações",
        interpretacao: "Descarta mielite",
      },
      {
        nome: "Eletroneuromiografia",
        descricao: "Padrão de desmielinização",
        resultado: "Desmielinização segmentar",
        valor_referencia: "Normal",
        interpretacao: "Compatível com SGB",
      },
      {
        nome: "Sorologia Zika",
        descricao: "IgM anti-Zika",
        resultado: "Positivo",
        valor_referencia: "Negativo",
        interpretacao: "Infecção recente por Zika",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Zika com Síndrome de Guillain-Barré",
        probabilidade: 90,
        criterios_minimos: [
          "História de Zika",
          "Paralisia flácida ascendente",
          "Arreflexia",
          "Desmielinização em ENMG",
          "Sorologia Zika positiva",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Mielite",
        criterios_exclusao: ["RM normal"],
        achados_que_descartam: ["Ressonância magnética normal"],
      },
    ],
    examesIndicados: [
      "Sorologia Zika",
      "RM coluna/cérebro",
      "ENMG",
      "Punção lombar se indicado",
      "Espirometria (avaliar insuficiência respiratória)",
    ],

    conduta_esperada: {
      imediata: [
        "Internação",
        "Monitorização respiratória",
        "Espirometria",
      ],
      curto_prazo: [
        "Imunoglobulina IV ou plasmaférese",
        "Suporte respiratório se necessário",
        "Fisioterapia",
      ],
      longo_prazo: [
        "Reabilitação neurológica",
      ],
      encaminhamentos: ["Neurologia", "Unidade de terapia intensiva"],
    },
    condutaCorreta: "Internação, ENMG urgente, imunoglobulina IV ou plasmaférese, monitorização respiratória",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: [
          "Fraqueza ascendente",
          "Envolvimento respiratório",
          "Arreflexia",
        ],
        descricao: "SGB com risco de insuficiência respiratória",
        recomendacao: "Internação em unidade de terapia intensiva",
      },
    ],

    erros_criticos: [
      {
        erro: "Não investigar insuficiência respiratória",
        descricao: "Risco de necessidade de intubação",
        penalidade: 2,
        evitavel: true,
      },
      {
        erro: "Não solicitar ENMG",
        descricao: "Confirmação diagnóstica necessária",
        penalidade: 1.5,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu complicação neurológica",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou ENMG",
        realizado: false,
        critico: true,
      },
      {
        item: "Avaliou respiração",
        realizado: false,
        critico: true,
      },
      {
        item: "Encaminhou para neurologia",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de SGB",
        peso: 30,
        descricao: "Complicação de Zika",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Urgência e investigação",
        peso: 25,
        descricao: "ENMG e monitorização respiratória",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Zika há 10 dias",
          "Fraqueza ascendente",
          "Dor nas costas",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Paralisia flácida",
          "Arreflexia",
          "Desmielinização em ENMG",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "Zika com SGB",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Internação",
          "ENMG urgente",
          "Imunoglobulina ou plasmaférese",
          "Monitorização respiratória",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu SGB",
        "Solicitou ENMG",
        "Avaliou respiração",
        "Encaminhou neurologia",
      ],
      erros_comuns: ["Confundir com paralisia central"],
      orientacoes_pedagogicas: [
        "SGB: paralisia flácida ascendente + arreflexia",
        "Sempre avaliar respiração em SGB",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer complicação neurológica de Zika",
      comunicacao: ["explicou necessidade de internação"],
      anamnese: ["investigou progressão"],
      exame_fisico: ["testou força e reflexos"],
      exames_complementares: ["pediu ENMG"],
      raciocinio: ["diagnosticou SGB"],
      conduta: ["encaminhou neurologia"],
      soap: ["documentou SGB"],
    },

    temaOSCE: "Arboviroses",
    subtopicosOSCE: [
      "Zika",
      "Síndrome Guillain-Barré",
      "Paralisia flácida",
      "Complicação neurológica",
      "Insuficiência respiratória",
    ],
    diagnosticoCorreto: "Zika com Síndrome de Guillain-Barré",
  },

  {
    // ====== CASO 42: CHIKUNGUNYA ======
    id: "42",
    titulo: "Chikungunya",
    sistema: "Infectologia",
    tema: "Arboviroses",
    nivel: "iniciante",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 10,
    objetivo_pedagogico: "Diagnosticar Chikungunya e diferenciar de Dengue",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Juliana Ferreira",
      idade: 35,
      sexo: "Feminino",
      queixa_principal: "Dor nas articulações muito intensa, febre",
      historia_breve: "Febre há 2 dias com dor articular extremamente intensa, principalmente nas mãos",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Chikungunya",
      diagnosticos_diferenciais: ["Dengue", "Artrite reumatoide", "Lúpus"],
      sindromes_associadas: ["Poliartralgias persistentes"],
    },

    descricaoBreve: "Paciente com febre, exantema e dor articular debilitante, particularmente em pequenas articulações",
    categoria: "Arboviroses",
    paciente: {
      id: "pac-042",
      nome: "Juliana Ferreira",
      idade: 35,
      sexo: "F",
      queixaPrincipal: "Dor articular intensa",
      historicoDoenca: "Febre e dor há 2 dias",
      antecedentes: ["Vive em área com Chikungunya"],
      profissao: "Professora",
      estado_civil: "Solteira",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Tenho febre e uma dor nas articulações que não consigo fazer nada",
      febre: "Sim, febre moderada",
      dor_articular: "Dor muito intensa, principalmente nas mãos, pés, joelhos",
      exantema: "Sim, exantema pequenino",
      edema_articular: "Sim, inchação nas mãos",
      movimento: "Não consigo fazer nada, dói demais ao mexer",
      duracao_esperada: "Há 2 dias",
    },
    respostaPaciente: {
      inicial: "Dor articular intensa e febre",
      febre: "Sim",
      dor_articular: "Muito intensa",
      exantema: "Sim",
      edema_articular: "Sim",
      movimento: "Movimento limitado",
      duracao_esperada: "2 dias",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "120/75 mmHg",
        frequenciaCardiaca: 88,
        frequenciaRespiratoria: 16,
        temperatura: 38.5,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "120/75 mmHg",
      frequenciaCardiaca: 88,
      frequenciaRespiratoria: 16,
      temperatura: 38.5,
      saturacaoOxigenio: 98,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente febril, exantema maculopapular fino, edema em mãos",
        palpacao: "Edema simétrico em articulações de mãos, pés e joelhos, dor importante",
        ausculta: "Normal",
        percussao: "Normal",
        observacoes: "Poliartrite simétrica de pequenas articulações",
        regiao: "Articulações",
        achados_positivos: ["Febre", "Exantema", "Poliartrite", "Edema"],
        achados_negativos: ["Hepatomegalia"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Febril, exantema fino, edema articular",
      palpacao: "Poliartrite simétrica",
      ausculta: "Normal",
      percussao: "Normal",
      observacoes: "Dor articular debilitante",
    },

    exame_fisico_interativo: {
      geral: {
        estado_geral: "Incapacitado pela dor",
        coloracao: "Maculopapular fino",
      },
      membros: {
        edema: "Mãos, pés, joelhos com muita dor",
        mobilidade: "Movimento muito limitado por dor",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Hemograma",
        descricao: "Contagem de células",
        resultado: "Hb 13, Leucócitos 6.500, Plaquetas 180.000",
        valor_referencia: "Plaquetas >150.000",
        interpretacao: "Sem alterações hematológicas",
      },
      {
        nome: "Sorologia Chikungunya IgM",
        descricao: "Anticorpo IgM anti-Chikungunya",
        resultado: "Positivo",
        valor_referencia: "Negativo",
        interpretacao: "Infecção recente por Chikungunya",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Chikungunya",
        probabilidade: 92,
        criterios_minimos: [
          "Febre",
          "Poliartrite simétrica",
          "Dor articular debilitante",
          "Exantema",
          "IgM Chikungunya positivo",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Dengue",
        criterios_exclusao: ["Dor articular tão intensa", "Poliartrite"],
        achados_que_descartam: ["IgM Chikungunya positivo"],
      },
    ],
    examesIndicados: [
      "Sorologia Chikungunya (IgM/IgG)",
      "Hemograma",
      "Se dúvida: sorologia dengue",
    ],

    conduta_esperada: {
      imediata: [
        "Repouso",
        "Analgesia (paracetamol ou ibuprofeno)",
        "Hidratação",
      ],
      curto_prazo: [
        "Fisioterapia se dor persistir",
        "Educação sobre prognóstico",
      ],
      longo_prazo: [
        "Suporte para artralgia crônica",
      ],
      encaminhamentos: ["Acompanhamento clínico"],
    },
    condutaCorreta: "Analgesia, hidratação, repouso, sorologia Chikungunya, educação sobre evolução",

    criterios_de_gravidade: [
      {
        severidade: "leve",
        sinais: ["Febre", "Artrite", "Sem manifestações hemorrágicas"],
        descricao: "Chikungunya sem complicações",
        recomendacao: "Manejo ambulatorial com suporte",
      },
    ],

    erros_criticos: [
      {
        erro: "Não solicitar sorologia Chikungunya",
        descricao: "Confirmação diagnóstica",
        penalidade: 1,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu Chikungunya",
        realizado: false,
        critico: true,
      },
      {
        item: "Diferenciou de Dengue",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou sorologia",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de Chikungunya",
        peso: 25,
        descricao: "Dor articular debilitante",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Diferenciação diagnóstica",
        peso: 20,
        descricao: "Dengue vs Chikungunya",
        pontuacao_maxima: 20,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Febre",
          "Dor articular intensa",
          "Início há 2 dias",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Poliartrite simétrica",
          "Edema articular",
          "Exantema",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Chikungunya"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Sorologia Chikungunya",
          "Analgesia",
          "Repouso",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu Chikungunya",
        "Diferenciou de Dengue",
        "Solicitou sorologia",
      ],
      erros_comuns: ["Achar que é Dengue"],
      orientacoes_pedagogicas: [
        "Chikungunya: dor articular MUITO intensa, incapacitante",
        "Dengue: dor muscular predomina",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer Chikungunya e diferenciar de Dengue",
      comunicacao: ["explicou prognóstico"],
      anamnese: ["investigou intensidade de dor"],
      exame_fisico: ["detectou poliartrite"],
      exames_complementares: ["pediu sorologia"],
      raciocinio: ["diagnosticou Chikungunya"],
      conduta: ["prescreveu analgesia"],
      soap: ["documentou Chikungunya"],
    },

    temaOSCE: "Arboviroses",
    subtopicosOSCE: [
      "Chikungunya",
      "Poliartrite",
      "Artralgia",
      "Febre",
      "Diferenciação",
    ],
    diagnosticoCorreto: "Chikungunya",
  },

  {
    // ====== CASO 43: ANEMIA FERROPRIVA ======
    id: "43",
    titulo: "Anemia Ferropriva",
    sistema: "Hematologia",
    tema: "Anemias",
    nivel: "iniciante",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 10,
    objetivo_pedagogico: "Diagnosticar anemia ferropriva e investigar causa de sangramento",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Sandra Oliveira",
      idade: 42,
      sexo: "Feminino",
      queixa_principal: "Cansaço progressivo e falta de ar",
      historia_breve: "Mulher com menorragia crônica, anemia há meses",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Anemia Ferropriva",
      diagnosticos_diferenciais: ["Anemia de doença crônica", "Deficiência de B12", "Anemia hemolítica"],
      sindromes_associadas: ["Sangramento crônico"],
    },

    descricaoBreve: "Paciente com palidez, taquicardia, anemia microcítica hipocrômica com ferro baixo",
    categoria: "Anemias",
    paciente: {
      id: "pac-043",
      nome: "Sandra Oliveira",
      idade: 42,
      sexo: "F",
      queixaPrincipal: "Cansaço e falta de ar",
      historicoDoenca: "Menorragia há 2 anos",
      antecedentes: ["Menorragia"],
      profissao: "Vendedora",
      estado_civil: "Casada",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Tô muito cansada, sem ar pra fazer as coisas",
      cansaco: "Sim, muito cansaço, não tenho energia",
      respiracao: "Falta de ar ao fazer esforço",
      menstruacao: "Sim, muito intensa, dura muito tempo",
      sangramento_outro: "Não, só a menstruação mesmo",
      alimentacao: "Como bem pouco, não tenho vontade",
      tontura: "Sim, fico tonta às vezes",
    },
    respostaPaciente: {
      inicial: "Cansaço e falta de ar",
      cansaco: "Sim",
      respiracao: "Sim",
      menstruacao: "Muito intensa",
      sangramento_outro: "Não",
      alimentacao: "Pouco apetite",
      tontura: "Sim",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "110/70 mmHg",
        frequenciaCardiaca: 105,
        frequenciaRespiratoria: 18,
        temperatura: 36.8,
        saturacaoOxigenio: 97,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "110/70 mmHg",
      frequenciaCardiaca: 105,
      frequenciaRespiratoria: 18,
      temperatura: 36.8,
      saturacaoOxigenio: 97,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente pálida, mucosas descoradas, unhas quebradiças",
        palpacao: "Sem edema, pulsos amplos",
        ausculta: "Sopro sistólico funcional",
        percussao: "Normal",
        observacoes: "Sinais de anemia crônica",
        regiao: "Geral",
        achados_positivos: ["Palidez", "Taquicardia", "Unhas quebradiças"],
        achados_negativos: ["Esplenomegalia"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Pálida, mucosas descoradas",
      palpacao: "Sem edema",
      ausculta: "Sopro sistólico funcional",
      percussao: "Normal",
      observacoes: "Anemia crônica",
    },

    exame_fisico_interativo: {
      geral: {
        coloracao: "Pálida",
        consciencia: "Alerta",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Hemograma",
        descricao: "Série vermelha",
        resultado: "Hb 8.5 g/dL, VCM 68 fL, HCM 22 pg",
        valor_referencia: "Hb 12-16, VCM 80-100, HCM 27-33",
        interpretacao: "Anemia microcítica hipocrômica",
      },
      {
        nome: "Ferro sérico",
        descricao: "Ferro disponível",
        resultado: "22 mcg/dL",
        valor_referencia: ">60 mcg/dL",
        interpretacao: "Ferro baixo",
      },
      {
        nome: "Ferritina",
        descricao: "Reserva de ferro",
        resultado: "12 ng/mL",
        valor_referencia: ">24 ng/mL",
        interpretacao: "Depleção de ferro",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Anemia Ferropriva",
        probabilidade: 95,
        criterios_minimos: [
          "Anemia microcítica",
          "Ferro baixo",
          "Ferritina baixa",
          "Menorragia",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Anemia de doença crônica",
        criterios_exclusao: ["Ferro baixo, ferritina baixa"],
        achados_que_descartam: ["Ferro sérico elevado"],
      },
    ],
    examesIndicados: [
      "Hemograma completo",
      "Ferro sérico, ferritina, TIBC",
      "Se menorragia: ginecologia",
    ],

    conduta_esperada: {
      imediata: [
        "Suplementação de ferro oral",
        "Orientação dietética",
      ],
      curto_prazo: [
        "Investigar causa de sangramento",
        "Ginecologia se menorragia",
      ],
      longo_prazo: [
        "Controle de menstruação",
      ],
      encaminhamentos: ["Ginecologia"],
    },
    condutaCorreta: "Suplementação de ferro, investigação de sangramento, hemograma de controle em 4-6 semanas",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["Hb 8-10", "Taquicardia", "Dispneia"],
        descricao: "Anemia moderada",
        recomendacao: "Reposição de ferro e investigação",
      },
    ],

    erros_criticos: [
      {
        erro: "Não investigar causa de sangramento",
        descricao: "Essencial para evitar recorrência",
        penalidade: 1.5,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu anemia",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou hemograma",
        realizado: false,
        critico: true,
      },
      {
        item: "Pesquisou ferro",
        realizado: false,
        critico: true,
      },
      {
        item: "Investigou sangramento",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de anemia ferropriva",
        peso: 25,
        descricao: "Achados clínicos e laboratoriais",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Investigação de causa",
        peso: 20,
        descricao: "Identificação de sangramento",
        pontuacao_maxima: 20,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Cansaço",
          "Menorragia",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Palidez",
          "Anemia microcítica",
          "Ferro baixo",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Anemia ferropriva"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Ferro oral",
          "Investigação de sangramento",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu anemia ferropriva",
        "Investigou sangramento",
        "Prescreveu ferro",
      ],
      erros_comuns: ["Só prescrever ferro sem investigar"],
      orientacoes_pedagogicas: [
        "Anemia ferropriva: investigar SEMPRE a causa",
        "Menorragia é causa comum em mulheres",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Diagnosticar anemia e investigar sangramento",
      comunicacao: ["explicou importância de reposição"],
      anamnese: ["investigou menorragia"],
      exame_fisico: ["detectou palidez"],
      exames_complementares: ["pediu hemograma e ferro"],
      raciocinio: ["diagnosticou ferropriva"],
      conduta: ["prescreveu ferro"],
      soap: ["documentou anemia"],
    },

    temaOSCE: "Anemias",
    subtopicosOSCE: [
      "Anemia ferropriva",
      "Microcitose",
      "Hipocromia",
      "Menorragia",
      "Investigação de sangramento",
    ],
    diagnosticoCorreto: "Anemia Ferropriva",
  },

  {
    // ====== CASO 44: ANEMIA HEMOLÍTICA ======
    id: "44",
    titulo: "Anemia Hemolítica",
    sistema: "Hematologia",
    tema: "Anemias",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 11,
    objetivo_pedagogico: "Diagnosticar anemia hemolítica por achados de hemólise",

    dados_visiveis_ao_estudante: {
      nome_paciente: "João Pereira",
      idade: 38,
      sexo: "Masculino",
      queixa_principal: "Cansaço, febre e urina escura",
      historia_breve: "Anemia aguda com icterícia, hemoglobinúria",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Anemia Hemolítica",
      diagnosticos_diferenciais: ["Hepatite", "Insuficiência hepática", "Talassemia"],
      sindromes_associadas: ["Hemólise intravascular"],
    },

    descricaoBreve: "Paciente com icterícia, esplenomegalia, hemoglobina baixa com reticulocitose elevada",
    categoria: "Anemias",
    paciente: {
      id: "pac-044",
      nome: "João Pereira",
      idade: 38,
      sexo: "M",
      queixaPrincipal: "Cansaço e icterícia",
      historicoDoenca: "Sintomas agudos há 3 dias",
      antecedentes: [],
      profissao: "Mecânico",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Ficou tudo amarelado, tô muito cansado",
      ictericia: "Sim, tudo amarelo",
      urina: "Urina muito escura, quase preta",
      febre: "Sim, febre alta",
      dor: "Dor nos flancos",
      cansaco: "Muito cansaço",
      pele_escurecida: "Amarelada muito mesmo",
    },
    respostaPaciente: {
      inicial: "Icterícia e urina escura",
      ictericia: "Sim",
      urina: "Muito escura",
      febre: "Sim",
      dor: "Nos flancos",
      cansaco: "Muita",
      pele_escurecida: "Sim",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "115/75 mmHg",
        frequenciaCardiaca: 100,
        frequenciaRespiratoria: 18,
        temperatura: 38.5,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "115/75 mmHg",
      frequenciaCardiaca: 100,
      frequenciaRespiratoria: 18,
      temperatura: 38.5,
      saturacaoOxigenio: 98,
    },

    exame_fisico: {
      correto: {
        inspecao: "Icterícia com escleras ictéricas, palidez",
        palpacao: "Esplenomegalia palpável",
        ausculta: "MV normal",
        percussao: "Baço aumentado",
        observacoes: "Sinais de hemólise",
        regiao: "Geral",
        achados_positivos: ["Icterícia", "Esplenomegalia", "Palidez"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Ictérico",
      palpacao: "Esplenomegalia",
      ausculta: "Normal",
      percussao: "Baço aumentado",
      observacoes: "Hemólise",
    },

    exame_fisico_interativo: {
      geral: {
        coloracao: "Ictérico",
        consciencia: "Alerta",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Hemograma",
        descricao: "Série vermelha",
        resultado: "Hb 7.5, RET 15%, VCM 90",
        valor_referencia: "RET 0.5-2%",
        interpretacao: "Anemia com reticulocitose",
      },
      {
        nome: "Bilirrubina indireta",
        descricao: "Fração não-conjugada",
        resultado: "6.5 mg/dL",
        valor_referencia: "<0.3 mg/dL",
        interpretacao: "Hiperbilirrubinemia indireta",
      },
      {
        nome: "LDH",
        descricao: "Desidrogenase lática",
        resultado: "850 U/L",
        valor_referencia: "<480 U/L",
        interpretacao: "Hemólise",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Anemia Hemolítica",
        probabilidade: 95,
        criterios_minimos: [
          "Anemia",
          "Reticulocitose elevada",
          "Bilirrubina indireta elevada",
          "LDH elevado",
          "Icterícia",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Hepatite",
        criterios_exclusao: ["Bilirrubina predominantemente indireta"],
        achados_que_descartam: ["TGO/TGP baixas"],
      },
    ],
    examesIndicados: [
      "Hemograma com reticulócitos",
      "Bilirrubina total e frações",
      "LDH, haptoglobina",
      "Teste de Coombs",
    ],

    conduta_esperada: {
      imediata: [
        "Transfusão se Hb <7",
        "Internação",
      ],
      curto_prazo: [
        "Investigação de causa",
        "Possível corticóide",
      ],
      longo_prazo: [
        "Acompanhamento hematológico",
      ],
      encaminhamentos: ["Hematologia"],
    },
    condutaCorreta: "Hemograma com reticulócitos, bilirrubina, Coombs, transfusão se necessário, hematologia",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["Hb <7", "Febre", "Hemoglobinúria"],
        descricao: "Hemólise aguda grave",
        recomendacao: "Internação e transfusão",
      },
    ],

    erros_criticos: [
      {
        erro: "Não solicitar reticulócitos",
        descricao: "Diferencia hemólise de outras anemias",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu hemólise",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou reticulócitos",
        realizado: false,
        critico: true,
      },
      {
        item: "Avaliou bilirrubina",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de hemólise",
        peso: 30,
        descricao: "Achados de hemólise",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Investigação apropriada",
        peso: 20,
        descricao: "Exames de hemólise",
        pontuacao_maxima: 20,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Cansaço",
          "Icterícia aguda",
          "Urina escura",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Icterícia",
          "Esplenomegalia",
          "Bilirrubina elevada",
          "Reticulocitose",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Anemia hemolítica"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Coombs test",
          "Transfusão se necessário",
          "Hematologia",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu hemólise",
        "Solicitou reticulócitos",
        "Pesquisou bilirrubina indireta",
      ],
      erros_comuns: ["Confundir com hepatite"],
      orientacoes_pedagogicas: [
        "Hemólise: bilirrubina indireta + reticulocitose + LDH elevado",
        "Hepatite: bilirrubina direta + TGO/TGP muito elevada",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer hemólise pelos achados",
      comunicacao: ["explicou urgência"],
      anamnese: ["investigou icterícia aguda"],
      exame_fisico: ["detectou esplenomegalia"],
      exames_complementares: ["pediu reticulócitos e bilirrubina"],
      raciocinio: ["diagnosticou hemólise"],
      conduta: ["encaminhou hematologia"],
      soap: ["documentou hemólise"],
    },

    temaOSCE: "Anemias",
    subtopicosOSCE: [
      "Anemia hemolítica",
      "Reticulocitose",
      "Hiperbilirrubinemia indireta",
      "LDH elevado",
      "Esplenomegalia",
    ],
    diagnosticoCorreto: "Anemia Hemolítica",
  },

  {
    // ====== CASO 45: TROMBOCITOPENIA IMUNE ======
    id: "45",
    titulo: "Trombocitopenia Imune",
    sistema: "Hematologia",
    tema: "Coagulopatias",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 10,
    objetivo_pedagogico: "Diagnosticar trombocitopenia imune e orientar manejo",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Marina Silva",
      idade: 29,
      sexo: "Feminino",
      queixa_principal: "Manchas roxas na pele e sangramento nasal",
      historia_breve: "Aparecimento agudo de petéquias há 5 dias",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Púrpura Trombocitopênica Idiopática (Imune)",
      diagnosticos_diferenciais: ["DIC", "Trombocitopenia medicamentosa", "Lúpus"],
      sindromes_associadas: ["Trombocitopenia isolada"],
    },

    descricaoBreve: "Paciente com petéquias, sangramento de mucosas, plaquetas muito baixas",
    categoria: "Coagulopatias",
    paciente: {
      id: "pac-045",
      nome: "Marina Silva",
      idade: 29,
      sexo: "F",
      queixaPrincipal: "Petéquias e sangramento",
      historicoDoenca: "Aparecimento agudo há 5 dias",
      antecedentes: [],
      profissao: "Secretária",
      estado_civil: "Solteira",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Apareceram manchas roxas no corpo todo",
      petequias: "Sim, muito, começou de repente",
      sangramento_nasal: "Sim, sangramento nasal espontâneo",
      sangramentos_outros: "Gengivite, sangramento ao escovar",
      hematomas: "Sim, roxos fácil",
      menstruacao: "Muito pesada agora",
      febre: "Não, sem febre",
    },
    respostaPaciente: {
      inicial: "Petéquias e sangramento",
      petequias: "Sim, difusas",
      sangramento_nasal: "Sim",
      sangramentos_outros: "Gengivite",
      hematomas: "Fácil",
      menstruacao: "Pesada",
      febre: "Não",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "110/70 mmHg",
        frequenciaCardiaca: 78,
        frequenciaRespiratoria: 16,
        temperatura: 36.8,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "110/70 mmHg",
      frequenciaCardiaca: 78,
      frequenciaRespiratoria: 16,
      temperatura: 36.8,
      saturacaoOxigenio: 98,
    },

    exame_fisico: {
      correto: {
        inspecao: "Petéquias e equimoses difusas, sangramento gengival",
        palpacao: "Sem esplenomegalia, pulsos normais",
        ausculta: "Normal",
        percussao: "Normal",
        observacoes: "Trombocitopenia com sangramento",
        regiao: "Geral",
        achados_positivos: ["Petéquias", "Equimoses", "Sangramento gengival"],
        achados_negativos: ["Esplenomegalia"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Petéquias e equimoses",
      palpacao: "Sem esplenomegalia",
      ausculta: "Normal",
      percussao: "Normal",
      observacoes: "Trombocitopenia",
    },

    exame_fisico_interativo: {
      geral: {
        coloracao: "Múltiplas petéquias",
        estado_geral: "Bem, sem febre",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Hemograma",
        descricao: "Contagem de plaquetas",
        resultado: "Plaquetas 15.000/mm³",
        valor_referencia: ">150.000",
        interpretacao: "Trombocitopenia severa",
      },
      {
        nome: "Teste de Coagulação",
        descricao: "TP e TTPa",
        resultado: "Normal",
        valor_referencia: "Normal",
        interpretacao: "Coagulação preservada",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Púrpura Trombocitopênica Idiopática",
        probabilidade: 90,
        criterios_minimos: [
          "Petéquias",
          "Sangramento de mucosas",
          "Plaquetas <50.000",
          "Coagulação normal",
          "Sem esplenomegalia",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "DIC",
        criterios_exclusao: ["Coagulação normal", "Sem febre"],
        achados_que_descartam: ["TTPa normal"],
      },
    ],
    examesIndicados: [
      "Hemograma com série branca",
      "TP, TTPa, fibrinogênio",
      "Teste de fragilidade capilar se indicado",
    ],

    conduta_esperada: {
      imediata: [
        "Corticóide sistêmico",
        "Possível imunoglobulina IV",
      ],
      curto_prazo: [
        "Monitorização de plaquetas",
        "Possível esplenectomia se refratário",
      ],
      longo_prazo: [
        "Acompanhamento hematológico",
      ],
      encaminhamentos: ["Hematologia"],
    },
    condutaCorreta: "Hemograma urgente, corticóide sistêmico, imunoglobulina IV, hematologia urgente",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["Plaquetas <10.000", "Sangramento"],
        descricao: "Risco de hemorragia intracraniana",
        recomendacao: "Internação e tratamento imediato",
      },
    ],

    erros_criticos: [
      {
        erro: "Prescrever AAS",
        descricao: "Aumenta sangramento",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu trombocitopenia",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou hemograma urgente",
        realizado: false,
        critico: true,
      },
      {
        item: "Encaminhou hematologia",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de trombocitopenia",
        peso: 25,
        descricao: "Achados clínicos",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Urgência e encaminhamento",
        peso: 25,
        descricao: "Hematologia imediata",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Petéquias agudas",
          "Sangramento de mucosas",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Petéquias e equimoses",
          "Plaquetas muito baixas",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Púrpura trombocitopênica idiopática"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Hemograma urgente",
          "Corticóide",
          "Hematologia",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu trombocitopenia",
        "Solicitou hemograma urgente",
        "Encaminhou hematologia",
      ],
      erros_comuns: ["Não reconhecer urgência"],
      orientacoes_pedagogicas: [
        "Petéquias + sangramento = trombocitopenia até prova ao contrário",
        "Plaquetas <50.000 = risco de sangramento grave",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer urgência e encaminhar rapidamente",
      comunicacao: ["explicou necessidade de tratamento"],
      anamnese: ["investigou sangramentos"],
      exame_fisico: ["detectou petéquias"],
      exames_complementares: ["pediu hemograma"],
      raciocinio: ["diagnosticou TPI"],
      conduta: ["encaminhou hematologia"],
      soap: ["documentou urgência"],
    },

    temaOSCE: "Coagulopatias",
    subtopicosOSCE: [
      "Púrpura trombocitopênica idiopática",
      "Petéquias",
      "Sangramento de mucosas",
      "Trombocitopenia severa",
      "Emergência",
    ],
    diagnosticoCorreto: "Púrpura Trombocitopênica Idiopática",
  },

  {
    // ====== CASO 46: DÉFICIT DE B12 ======
    id: "46",
    titulo: "Deficiência de Vitamina B12",
    sistema: "Hematologia",
    tema: "Anemias",
    nivel: "iniciante",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 11,
    objetivo_pedagogico: "Diagnosticar deficiência de B12 e investigar causa",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Oswaldo Ferreira",
      idade: 68,
      sexo: "Masculino",
      queixa_principal: "Formigamento nas mãos e pés, dificuldade em caminhar",
      historia_breve: "Vegetariano há muitos anos, cansaço crônico",
  },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Deficiência de Vitamina B12",
      diagnosticos_diferenciais: ["Polineuropatia diabética", "Mielopatia", "Esclerose múltipla"],
      sindromes_associadas: ["Anemia megaloblástica", "Neuropatia periférica"],
    },

    descricaoBreve: "Paciente com anemia macrocítica, neuropatia periférica, B12 baixo",
    categoria: "Anemias",
    paciente: {
      id: "pac-046",
      nome: "Oswaldo Ferreira",
      idade: 68,
      sexo: "M",
      queixaPrincipal: "Formigamento e cansaço",
      historicoDoenca: "Vegetariano há 30 anos",
      antecedentes: ["Vegetarianismo", "Gastrectomia anterior"],
      profissao: "Aposentado",
      estado_civil: "Viúvo",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Meus pés e mãos formigam muito, tenho dificuldade em caminhar",
      formigamento: "Sim, principalmente nos pés",
      fraqueza: "Sim, perna fraca",
      cansaco: "Muito cansaço",
      alimentacao: "Sou vegetariano desde jovem",
      memoria: "Um pouco esquecido",
      equilibrio: "Perdi um pouco do equilíbrio",
    },
    respostaPaciente: {
      inicial: "Formigamento e dificuldade em caminhar",
      formigamento: "Sim, pés",
      fraqueza: "Sim",
      cansaco: "Muito",
      alimentacao: "Vegetariano há anos",
      memoria: "Esquecido",
      equilibrio: "Ruim",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "130/80 mmHg",
        frequenciaCardiaca: 80,
        frequenciaRespiratoria: 16,
        temperatura: 36.8,
        saturacaoOxigenio: 97,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "130/80 mmHg",
      frequenciaCardiaca: 80,
      frequenciaRespiratoria: 16,
      temperatura: 36.8,
      saturacaoOxigenio: 97,
    },

    exame_fisico: {
      correto: {
        inspecao: "Palidez, língua lisa",
        palpacao: "Redução de sensibilidade vibratória e proprioceptiva",
        ausculta: "Normal",
        percussao: "Reflexos tendinosos ausentes em MMII",
        observacoes: "Neuropatia periférica com sinais medulares",
        regiao: "Geral e neurologia",
        achados_positivos: ["Glossite", "Neuropatia", "Ausência de reflexos"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Palidez, língua lisa",
      palpacao: "Sensibilidade reduzida",
      ausculta: "Normal",
      percussao: "Reflexos ausentes",
      observacoes: "Neuropatia",
    },

    exame_fisico_interativo: {
      geral: {
        coloracao: "Pálido",
        consciencia: "Alerta mas com déficit cognitivo leve",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Hemograma",
        descricao: "Série vermelha",
        resultado: "Hb 9, VCM 105, Reticulócitos 0.8%",
        valor_referencia: "VCM 80-100",
        interpretacao: "Anemia macrocítica",
      },
      {
        nome: "Vitamina B12",
        descricao: "Cobalamina sérica",
        resultado: "180 pg/mL",
        valor_referencia: ">200 pg/mL",
        interpretacao: "Deficiência de B12",
      },
      {
        nome: "Ácido fólico",
        descricao: "Folato sérico",
        resultado: "6 ng/mL",
        valor_referencia: ">5.4 ng/mL",
        interpretacao: "Normal",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Deficiência de Vitamina B12",
        probabilidade: 95,
        criterios_minimos: [
          "Anemia macrocítica",
          "Neuropatia periférica",
          "B12 baixo",
          "Dieta vegetariana",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Déficit de ácido fólico",
        criterios_exclusao: ["Ácido fólico normal"],
        achados_que_descartam: ["Folato normal"],
      },
    ],
    examesIndicados: [
      "Hemograma com reticulócitos",
      "Vitamina B12 e folato",
      "Teste de Schilling se disponível",
    ],

    conduta_esperada: {
      imediata: [
        "Vitamina B12 intramuscular",
        "Aconselhamento dietético",
      ],
      curto_prazo: [
        "Reposição mensal de B12",
        "Avaliação neurológica",
      ],
      longo_prazo: [
        "Monitorização contínua",
      ],
      encaminhamentos: ["Hematologia"],
    },
    condutaCorreta: "Hemograma, B12 e folato, B12 intramuscular, seguimento mensal",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["Neuropatia", "Anemia", "Déficit cognitivo"],
        descricao: "B12 com manifestações neurológicas",
        recomendacao: "Reposição imediata para evitar piora",
      },
    ],

    erros_criticos: [
      {
        erro: "Não investigar causa",
        descricao: "Vegetarianismo vs. má absorção",
        penalidade: 1,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu déficit de B12",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou B12 e folato",
        realizado: false,
        critico: true,
      },
      {
        item: "Investigou causa",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de B12",
        peso: 25,
        descricao: "Anemia macrocítica com neuropatia",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Investigação de causa",
        peso: 20,
        descricao: "Dietética vs. má absorção",
        pontuacao_maxima: 20,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Formigamento",
          "Vegetarianismo",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Palidez",
          "Neuropatia",
          "Anemia macrocítica",
          "B12 baixo",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Deficiência de B12"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "B12 intramuscular",
          "Aconselhamento dietético",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu B12",
        "Solicitou B12 e folato",
        "Investigou causa",
      ],
      erros_comuns: ["Confundir com déficit de ácido fólico"],
      orientacoes_pedagogicas: [
        "B12: neuropatia + palidez + macrocitose",
        "Folato: apenas anemia macrocítica",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Diagnosticar B12 e investigar causa",
      comunicacao: ["explicou importância de suplementação"],
      anamnese: ["investigou vegetarianismo"],
      exame_fisico: ["detectou neuropatia"],
      exames_complementares: ["pediu B12 e folato"],
      raciocinio: ["diagnosticou B12"],
      conduta: ["prescreveu B12 IM"],
      soap: ["documentou B12"],
    },

    temaOSCE: "Anemias",
    subtopicosOSCE: [
      "Deficiência de B12",
      "Macrocitose",
      "Neuropatia periférica",
      "Glossite",
      "Vegetarianismo",
    ],
    diagnosticoCorreto: "Deficiência de Vitamina B12",
    ativo: false,    },

  {
    // ====== CASO 47: POLICITEMIA VERA ======
    id: "47",
    titulo: "Policitemia Vera",
    sistema: "Hematologia",
    tema: "Eritropoese",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 11,
    objetivo_pedagogico: "Diagnosticar policitemia vera pelos achados clínicos",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Marcelo Costa",
      idade: 55,
      sexo: "Masculino",
      queixa_principal: "Rubor facial, coceira na pele após banho",
      historia_breve: "Homem com face avermelhada, cianose de extremidades",
  },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Policitemia Vera",
      diagnosticos_diferenciais: ["Policitemia secundária", "Síndrome de Cushing", "Tumor renal"],
      sindromes_associadas: ["Neoplasia mieloproliferativa"],
    },

    descricaoBreve: "Paciente com eritrocitose, rubor plétórico, esplenomegalia, risco tromboembólico",
    categoria: "Mieloproliferação",
    paciente: {
      id: "pac-047",
      nome: "Marcelo Costa",
      idade: 55,
      sexo: "M",
      queixaPrincipal: "Rubor facial e coceira",
      historicoDoenca: "Sintomas progressivos há 1 ano",
      antecedentes: [],
      profissao: "Advogado",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Minha face fica muito vermelha, coço muito o corpo depois do banho",
      rubor: "Sim, rosto muito vermelho",
      coceira: "Muita coceira, principalmente com água quente",
      cianose: "Mãos e pés ficam azulados",
      cefaleia: "Dores de cabeça frequentes",
      tontura: "Tonto às vezes",
      sangramento: "Facilidade para roxear",
    },
    respostaPaciente: {
      inicial: "Rubor e coceira",
      rubor: "Sim",
      coceira: "Muito",
      cianose: "Sim",
      cefaleia: "Frequente",
      tontura: "Sim",
      sangramento: "Fácil",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "150/90 mmHg",
        frequenciaCardiaca: 88,
        frequenciaRespiratoria: 18,
        temperatura: 36.8,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "150/90 mmHg",
      frequenciaCardiaca: 88,
      frequenciaRespiratoria: 18,
      temperatura: 36.8,
      saturacaoOxigenio: 98,
    },

    exame_fisico: {
      correto: {
        inspecao: "Rubor plétórico facial, cianose de extremidades",
        palpacao: "Esplenomegalia palpável",
        ausculta: "Normal",
        percussao: "Baço aumentado",
        observacoes: "Sinais de policitemia",
        regiao: "Geral",
        achados_positivos: ["Rubor plétórico", "Esplenomegalia", "Cianose"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Rubor plétórico",
      palpacao: "Esplenomegalia",
      ausculta: "Normal",
      percussao: "Baço aumentado",
      observacoes: "Policitemia",
    },

    exame_fisico_interativo: {
      geral: {
        coloracao: "Plétora, rubor facial",
        consciencia: "Alerta",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Hemograma",
        descricao: "Série vermelha",
        resultado: "Hb 18.5, Ht 56%, RBC 6.2 × 10⁶",
        valor_referencia: "Hb 13.5-17.5, RBC 4.5-5.9",
        interpretacao: "Eritrocitose",
      },
      {
        nome: "Eritropoetina (EPO)",
        descricao: "Nível sérico",
        resultado: "2.5 mIU/mL",
        valor_referencia: "4-26 mIU/mL",
        interpretacao: "EPO baixa (típico de policitemia vera)",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Policitemia Vera",
        probabilidade: 90,
        criterios_minimos: [
          "Eritrocitose",
          "EPO baixa",
          "Esplenomegalia",
          "Rubor plétórico",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Policitemia secundária",
        criterios_exclusao: ["EPO baixa"],
        achados_que_descartam: ["EPO elevada"],
      },
    ],
    examesIndicados: [
      "Hemograma completo",
      "EPO sérica",
      "Teste JAK2 V617F",
      "Plaquetas e leucócitos",
    ],

    conduta_esperada: {
      imediata: [
        "Flebotomia",
        "Hidratação",
        "Aspirina de baixa dose",
      ],
      curto_prazo: [
        "Controle hematológico",
        "Avaliação de risco tromboembólico",
      ],
      longo_prazo: [
        "Monitorização contínua",
        "Possível citorredutor",
      ],
      encaminhamentos: ["Hematologia"],
    },
    condutaCorreta: "Hemograma, EPO, flebotomia, aspirina, hematologia para acompanhamento",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["Hb >18", "Esplenomegalia", "Risco tromboembólico"],
        descricao: "Policitemia vera confirmada",
        recomendacao: "Acompanhamento hematológico especializado",
      },
    ],

    erros_criticos: [
      {
        erro: "Não solicitar EPO",
        descricao: "Diferencia vera de secundária",
        penalidade: 1.5,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu policitemia",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou hemograma",
        realizado: false,
        critico: true,
      },
      {
        item: "Pesquisou EPO",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de policitemia",
        peso: 25,
        descricao: "Achados clínicos",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Diferenciação de secundária",
        peso: 20,
        descricao: "EPO baixa confirma vera",
        pontuacao_maxima: 20,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Rubor facial",
          "Coceira pós-banho",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Rubor plétórico",
          "Esplenomegalia",
          "Eritrocitose",
          "EPO baixa",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Policitemia vera"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Flebotomia",
          "EPO",
          "JAK2",
          "Hematologia",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu policitemia",
        "Solicitou EPO",
        "Pediu JAK2",
      ],
      erros_comuns: ["Confundir com policitemia secundária"],
      orientacoes_pedagogicas: [
        "Policitemia vera: EPO baixa",
        "Policitemia secundária: EPO elevada",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Diagnosticar policitemia vera",
      comunicacao: ["explicou necessidade de flebotomia"],
      anamnese: ["investigou rubor e coceira"],
      exame_fisico: ["detectou esplenomegalia"],
      exames_complementares: ["pediu EPO e JAK2"],
      raciocinio: ["diagnosticou vera"],
      conduta: ["prescreveu flebotomia"],
      soap: ["documentou policitemia"],
    },

    temaOSCE: "Eritropoese",
    subtopicosOSCE: [
      "Policitemia vera",
      "Eritrocitose",
      "EPO baixa",
      "Rubor plétórico",
      "Esplenomegalia",
    ],
    diagnosticoCorreto: "Policitemia Vera",
    ativo: false,    },

  {
    // ====== CASO 48: MIELOMA MÚLTIPLO ======
    id: "48",
    titulo: "Mieloma Múltiplo",
    sistema: "Hematologia",
    tema: "Neoplasias hematológicas",
    nivel: "avancado",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Diagnosticar mieloma múltiplo por achados clínicos e laboratoriais",

    dados_visiveis_ao_estudante: {
      nome_paciente: "José Antonio Martins",
      idade: 72,
      sexo: "Masculino",
      queixa_principal: "Dor nas costas, anemia, fratura espontânea",
      historia_breve: "Idoso com fratura vertebral sem trauma, cansaço crônico",
  },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Mieloma Múltiplo",
      diagnosticos_diferenciais: ["Osteoporose", "Metástases ósseas", "Paget"],
      sindromes_associadas: ["Insuficiência renal", "Hipercalcemia"],
    },

    descricaoBreve: "Paciente com anemia, hipercalcemia, dor óssea, insuficiência renal",
    categoria: "Neoplasias hematológicas",
    paciente: {
      id: "pac-048",
      nome: "José Antonio Martins",
      idade: 72,
      sexo: "M",
      queixaPrincipal: "Dor nas costas",
      historicoDoenca: "Fratura vertebral há 1 mês",
      antecedentes: ["Fratura espontânea"],
      profissao: "Aposentado",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Dor forte nas costas, tive fratura sem cair",
      dor_costas: "Muito intensa, incapacitante",
      fratura: "Tive fratura de vértebra sem motivo aparente",
      cansaco: "Muito cansaço",
      infeccoes: "Tive infecção respiratória recentemente",
      nausea: "Sim, enjoo e falta de apetite",
      sede: "Muita sede",
    },
    respostaPaciente: {
      inicial: "Dor costas e fratura",
      dor_costas: "Intensa",
      fratura: "Espontânea",
      cansaco: "Muito",
      infeccoes: "Recente",
      nausea: "Sim",
      sede: "Muito",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "125/80 mmHg",
        frequenciaCardiaca: 82,
        frequenciaRespiratoria: 16,
        temperatura: 36.8,
        saturacaoOxigenio: 97,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "125/80 mmHg",
      frequenciaCardiaca: 82,
      frequenciaRespiratoria: 16,
      temperatura: 36.8,
      saturacaoOxigenio: 97,
    },

    exame_fisico: {
      correto: {
        inspecao: "Palidez, postura encurvada",
        palpacao: "Dor à palpação de costelas e coluna",
        ausculta: "Normal",
        percussao: "Normal",
        observacoes: "Dor óssea difusa",
        regiao: "Geral",
        achados_positivos: ["Palidez", "Dor óssea"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Pálido, cifose",
      palpacao: "Dor óssea difusa",
      ausculta: "Normal",
      percussao: "Normal",
      observacoes: "Mieloma",
    },

    exame_fisico_interativo: {
      geral: {
        coloracao: "Pálido",
        postura: "Cifose, dor ao movimento",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Hemograma",
        descricao: "Série vermelha",
        resultado: "Hb 9.5, RBC 4.2 × 10⁶",
        valor_referencia: "Hb 13.5-17.5",
        interpretacao: "Anemia normocítica",
      },
      {
        nome: "Cálcio total",
        descricao: "Cálcio sérico",
        resultado: "11.5 mg/dL",
        valor_referencia: "8.5-10.5 mg/dL",
        interpretacao: "Hipercalcemia",
      },
      {
        nome: "Creatinina",
        descricao: "Função renal",
        resultado: "2.8 mg/dL",
        valor_referencia: "<1.2 mg/dL",
        interpretacao: "Insuficiência renal",
      },
      {
        nome: "Proteína total",
        descricao: "Proteína sérica",
        resultado: "8.5 g/dL",
        valor_referencia: "6.0-8.3 g/dL",
        interpretacao: "Hiperproteinemia",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Mieloma Múltiplo",
        probabilidade: 90,
        criterios_minimos: [
          "Dor óssea difusa",
          "Fratura patológica",
          "Anemia",
          "Insuficiência renal",
          "Hipercalcemia",
          "Hiperproteinemia",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Osteoporose",
        criterios_exclusao: ["Anemia", "Insuficiência renal", "Hipercalcemia"],
        achados_que_descartam: ["Hipercalcemia presente"],
      },
    ],
    examesIndicados: [
      "Hemograma completo",
      "Eletroforese de proteínas",
      "Cadeias leves livres",
      "Biopsia de medula óssea",
      "RX de esqueleto",
    ],

    conduta_esperada: {
      imediata: [
        "Internação",
        "Hidratação agressiva para hipercalcemia",
        "Biopsia de medula óssea",
      ],
      curto_prazo: [
        "Eletroforese de proteínas",
        "Quimioterapia",
      ],
      longo_prazo: [
        "Acompanhamento oncológico",
      ],
      encaminhamentos: ["Hematologia/Oncologia", "Internação"],
    },
    condutaCorreta: "Hemograma, proteínas, cálcio, creatinina, biopsia medula, hematologia/oncologia",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: [
          "Hipercalcemia",
          "Insuficiência renal",
          "Anemia",
          "Dor óssea",
        ],
        descricao: "Mieloma em estágio avançado",
        recomendacao: "Internação e quimioterapia imediata",
      },
    ],

    erros_criticos: [
      {
        erro: "Não investigar hipercalcemia",
        descricao: "Risco de crise hipercalcêmica",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu mieloma",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou eletroforese",
        realizado: false,
        critico: true,
      },
      {
        item: "Avaliou hipercalcemia",
        realizado: false,
        critico: true,
      },
      {
        item: "Encaminhou hematologia",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de mieloma",
        peso: 30,
        descricao: "Achados clínicos e laboratoriais",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Urgência do encaminhamento",
        peso: 25,
        descricao: "Hipercalcemia e insuficiência renal",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Dor óssea difusa",
          "Fratura espontânea",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Anemia",
          "Hipercalcemia",
          "Insuficiência renal",
          "Hiperproteinemia",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Mieloma múltiplo"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Eletroforese",
          "Biopsia medula",
          "Hematologia urgente",
          "Tratamento de hipercalcemia",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu mieloma",
        "Solicitou eletroforese",
        "Avaliou cálcio",
        "Encaminhou hematologia",
      ],
      erros_comuns: ["Diagnosticar como osteoporose"],
      orientacoes_pedagogicas: [
        "Mieloma: dor óssea + anemia + insuficiência renal + hipercalcemia",
        "Sempre pensar em mieloma em idoso com fratura patológica",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer mieloma como urgência oncológica",
      comunicacao: ["explicou gravidade"],
      anamnese: ["investigou dor óssea"],
      exame_fisico: ["detectou dor difusa"],
      exames_complementares: ["pediu proteínas e cálcio"],
      raciocinio: ["diagnosticou mieloma"],
      conduta: ["encaminhou hematologia"],
      soap: ["documentou urgência"],
    },

    temaOSCE: "Neoplasias hematológicas",
    subtopicosOSCE: [
      "Mieloma múltiplo",
      "Dor óssea",
      "Hipercalcemia",
      "Insuficiência renal",
      "Fatura patológica",
    ],
    diagnosticoCorreto: "Mieloma Múltiplo",
    ativo: false,    },

  {
    // ====== CASO 49: LEUCEMIA LINFOBLÁSTICA AGUDA ======
    id: "49",
    titulo: "Leucemia Linfoblástica Aguda",
    sistema: "Hematologia",
    tema: "Neoplasias hematológicas",
    nivel: "avancado",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Reconhecer leucemia aguda por apresentação clínica e laboratorial",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Lucas Souza",
      idade: 8,
      sexo: "Masculino",
      queixa_principal: "Febre, hematomas, sangramento gengival",
      historia_breve: "Criança com sintomas agudos há 2 semanas",
  },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Leucemia Linfoblástica Aguda",
      diagnosticos_diferenciais: ["Leucemia mieloblástica", "Mononucleose infecciosa", "Sepse"],
      sindromes_associadas: ["Pancitopenia", "Coagulopatia"],
    },

    descricaoBreve: "Criança com febre, hematomas, sangramento e blastocitose",
    categoria: "Neoplasias hematológicas",
    paciente: {
      id: "pac-049",
      nome: "Lucas Souza",
      idade: 8,
      sexo: "M",
      queixaPrincipal: "Febre e sangramento",
      historicoDoenca: "Sintomas há 2 semanas",
      antecedentes: [],
      profissao: "Estudante",
      estado_civil: "Solteiro",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Tô com muita febre, sangra quando escovo e tem roxo no corpo",
      febre: "Febre alta, aparece e desaparece",
      petequias: "Sim, muchísimas manchinhas roxas",
      sangramento: "Sangra muito ao escovar os dentes",
      cansaco: "Muito cansado, não quer brincar",
      infeccoes: "Teve vários resfriados seguidos",
      dor: "Dor nos ossos e articulações",
    },
    respostaPaciente: {
      inicial: "Febre e sangramento",
      febre: "Sim",
      petequias: "Muitas",
      sangramento: "Gengival",
      cansaco: "Muito",
      infeccoes: "Várias",
      dor: "Ossos e articulações",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "100/60 mmHg",
        frequenciaCardiaca: 120,
        frequenciaRespiratoria: 24,
        temperatura: 39.2,
        saturacaoOxigenio: 96,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "100/60 mmHg",
      frequenciaCardiaca: 120,
      frequenciaRespiratoria: 24,
      temperatura: 39.2,
      saturacaoOxigenio: 96,
    },

    exame_fisico: {
      correto: {
        inspecao: "Criança febril, pálida, múltiplas petéquias",
        palpacao: "Hepatomegalia e esplenomegalia, linfadenopatia cervical",
        ausculta: "Taquicardia",
        percussao: "Normal",
        observacoes: "Sinais de neoplasia hematológica",
        regiao: "Geral",
        achados_positivos: [
          "Febre",
          "Petéquias",
          "Hepatomegalia",
          "Esplenomegalia",
          "Linfadenopatia",
        ],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Pálida, petéquias",
      palpacao: "Hepatomegalia, esplenomegalia, linfonodos",
      ausculta: "Taquicardia",
      percussao: "Normal",
      observacoes: "Leucemia",
    },

    exame_fisico_interativo: {
      geral: {
        coloracao: "Pálido com petéquias",
        consciencia: "Alerta mas aparentando mal",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Hemograma",
        descricao: "Série branca",
        resultado: "WBC 85.000/mm³, Blastocitos 90%",
        valor_referencia: "WBC <11.000",
        interpretacao: "Leucocitose com blastocitose",
      },
      {
        nome: "Plaquetas",
        descricao: "Contagem de plaquetas",
        resultado: "25.000/mm³",
        valor_referencia: ">150.000",
        interpretacao: "Trombocitopenia severa",
      },
      {
        nome: "Hemoglobina",
        descricao: "Série vermelha",
        resultado: "Hb 7.5 g/dL",
        valor_referencia: "12-15 g/dL",
        interpretacao: "Anemia severa",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Leucemia Linfoblástica Aguda",
        probabilidade: 95,
        criterios_minimos: [
          "Febre",
          "Pancitopenia",
          "Blastocitose",
          "Hepatosplenomegalia",
          "Linfadenopatia",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Mononucleose infecciosa",
        criterios_exclusao: ["Blastocitos 90%"],
        achados_que_descartam: ["Blastocitose severa"],
      },
    ],
    examesIndicados: [
      "Hemograma completo",
      "Biopsia de medula óssea",
      "Testes de coagulação",
      "Citometria de fluxo",
      "Testes genéticos (Philadelphia, translocações)",
    ],

    conduta_esperada: {
      imediata: [
        "Internação em oncologia pediátrica",
        "Biopsia de medula óssea",
        "Quimioterapia imediata",
      ],
      curto_prazo: [
        "Suporte transfusional",
        "Prevenção de tumor lysis syndrome",
      ],
      longo_prazo: [
        "Protocolo de quimioterapia",
      ],
      encaminhamentos: ["Oncologia pediátrica", "Internação imediata"],
    },
    condutaCorreta: "Hemograma urgente, biopsia medula, coagulação, internação oncologia pediátrica",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: [
          "Blastocitose >50%",
          "Pancitopenia",
          "Febre",
          "Coagulopatia",
        ],
        descricao: "Leucemia aguda com risco de morte",
        recomendacao: "Quimioterapia imediata",
      },
    ],

    erros_criticos: [
      {
        erro: "Não reconhecer urgência",
        descricao: "Prognóstico depende de início rápido",
        penalidade: 3,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu leucemia",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou hemograma urgente",
        realizado: false,
        critico: true,
      },
      {
        item: "Encaminhou oncologia pediátrica",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de leucemia",
        peso: 35,
        descricao: "Achados clínicos e blastocitose",
        pontuacao_maxima: 35,
      },
      {
        criterio: "Urgência",
        peso: 30,
        descricao: "Encaminhamento imediato",
        pontuacao_maxima: 30,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Febre",
          "Sangramento",
          "Cansaço",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Petéquias",
          "Hepatosplenomegalia",
          "WBC 85.000",
          "Blastocitos 90%",
          "Plaquetas baixas",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "Leucemia linfoblástica aguda",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Internação imediata",
          "Biopsia medula",
          "Quimioterapia",
          "Oncologia pediátrica",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu leucemia",
        "Solicitou hemograma urgente",
        "Encaminhou oncologia",
      ],
      erros_comuns: ["Achar que é infecção"],
      orientacoes_pedagogicas: [
        "Leucemia: febre + petéquias + blastocitose",
        "Urgência máxima em pediatria",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer leucemia como emergência pediátrica máxima",
      comunicacao: ["explicou urgência aos pais"],
      anamnese: ["investigou sintomas sistêmicos"],
      exame_fisico: ["detectou organomegalias"],
      exames_complementares: ["pediu hemograma"],
      raciocinio: ["diagnosticou leucemia"],
      conduta: ["encaminhou oncologia"],
      soap: ["documentou emergência"],
    },

    temaOSCE: "Neoplasias hematológicas",
    subtopicosOSCE: [
      "Leucemia linfoblástica aguda",
      "Blastocitose",
      "Pancitopenia",
      "Hepatosplenomegalia",
      "Emergência pediátrica",
    ],
    diagnosticoCorreto: "Leucemia Linfoblástica Aguda",
    ativo: false,    },

  {
    // ====== CASO 50: COAGULAÇÃO DISSEMINADA ======
    id: "50",
    titulo: "Coagulação Intravascular Disseminada",
    sistema: "Hematologia",
    tema: "Coagulopatias",
    nivel: "avancado",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Reconhecer CID como emergência com achados clínicos e laboratoriais",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Patricia Rocha",
      idade: 45,
      sexo: "Feminino",
      queixa_principal: "Sangramento difuso, choque, confusão mental",
      historia_breve: "Mulher com sepse evoluindo para choque com coagulopatia",
  },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Coagulação Intravascular Disseminada (CID)",
      diagnosticos_diferenciais: ["Trombocitopenia imune", "Hepatopatia", "Fibrinólise primária"],
      sindromes_associadas: ["Choque séptico", "Insuficiência de múltiplos órgãos"],
    },

    descricaoBreve: "Paciente com sepse, sangramento, plaquetas baixas, INR elevado, fibrinogênio baixo",
    categoria: "Coagulopatias",
    paciente: {
      id: "pac-050",
      nome: "Patricia Rocha",
      idade: 45,
      sexo: "F",
      queixaPrincipal: "Sangramento e choque",
      historicoDoenca: "Infecção há 3 dias, piora aguda",
      antecedentes: ["Sepse"],
      profissao: "Enfermeira",
      estado_civil: "Casada",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Tô sangrando de vários lugares, tô muito mal",
      sangramento: "Sim, vomitando sangue, sangramento nasal, gengivite",
      confusao: "Confusa, desorientada",
      frio: "Muito frio, tremendo",
      respiracao: "Falta de ar",
      pressao: "Tontura, pressão muito baixa",
      infeccao_anterior: "Tive infecção há dias",
    },
    respostaPaciente: {
      inicial: "Sangramento e choque",
      sangramento: "Múltiplos sítios",
      confusao: "Sim",
      frio: "Sim",
      respiracao: "Sim",
      pressao: "Muito baixa",
      infeccao_anterior: "Sim",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "75/45 mmHg",
        frequenciaCardiaca: 135,
        frequenciaRespiratoria: 28,
        temperatura: 40.5,
        saturacaoOxigenio: 92,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "75/45 mmHg",
      frequenciaCardiaca: 135,
      frequenciaRespiratoria: 28,
      temperatura: 40.5,
      saturacaoOxigenio: 92,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente em choque, cianose, petéquias e equimoses extensas, sangramento ativo",
        palpacao: "Extremidades frias, débil, pulsos filiformes",
        ausculta: "Taquicardia, hipotensão",
        percussao: "Normal",
        observacoes: "Sinais de CID com choque",
        regiao: "Geral",
        achados_positivos: [
          "Sangramento difuso",
          "Choque",
          "Petéquias",
          "Equimoses",
          "Cianose",
        ],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Choque, sangramento, petéquias",
      palpacao: "Extremidades frias",
      ausculta: "Taquicardia",
      percussao: "Normal",
      observacoes: "CID com choque séptico",
    },

    exame_fisico_interativo: {
      geral: {
        coloracao: "Cianótico com petéquias",
        consciencia: "Confuso, desorientado",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Plaquetas",
        descricao: "Contagem de plaquetas",
        resultado: "35.000/mm³",
        valor_referencia: ">150.000",
        interpretacao: "Trombocitopenia",
      },
      {
        nome: "Fibrinogênio",
        descricao: "Nível de fibrinogênio",
        resultado: "85 mg/dL",
        valor_referencia: ">200 mg/dL",
        interpretacao: "Hipofibrinogenemia",
      },
      {
        nome: "INR",
        descricao: "Coagulação",
        resultado: "4.2",
        valor_referencia: "<1.1",
        interpretacao: "Coagulopatia severa",
      },
      {
        nome: "D-dímero",
        descricao: "Fibrinólise",
        resultado: ">10.000 ng/mL",
        valor_referencia: "<500 ng/mL",
        interpretacao: "Fibrinólise massiva",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Coagulação Intravascular Disseminada",
        probabilidade: 98,
        criterios_minimos: [
          "Sangramento difuso",
          "Trombocitopenia",
          "Hipofibrinogenemia",
          "INR elevado",
          "D-dímero massivo",
          "Sepse",
          "Choque",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Hepatopatia",
        criterios_exclusao: ["Sepse aguda", "D-dímero extremamente elevado"],
        achados_que_descartam: ["Contexto clínico de sepse"],
      },
    ],
    examesIndicados: [
      "Hemograma com plaquetas",
      "Coagulação (TP, TTPa)",
      "Fibrinogênio",
      "D-dímero",
      "Produtos de degradação de fibrina",
      "Testes de sepse",
    ],

    conduta_esperada: {
      imediata: [
        "CTI",
        "Suporte de choque",
        "Antibióticos de amplo espectro",
      ],
      curto_prazo: [
        "Transfusão de componentes",
        "Tratamento de causa de CID",
      ],
      longo_prazo: [
        "Suporte de órgão",
      ],
      encaminhamentos: ["CTI", "Hematologia", "Infectologia"],
    },
    condutaCorreta: "CTI urgente, suporte hemodinâmico, antibióticos, transfusão de componentes, testes de coagulação",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: [
          "Choque",
          "Sangramento difuso",
          "Coagulopatia severa",
          "Confusão mental",
        ],
        descricao: "CID com risco de morte iminente",
        recomendacao: "CTI com suporte máximo",
      },
    ],

    erros_criticos: [
      {
        erro: "Não encaminhar para CTI",
        descricao: "Risco imediato de morte",
        penalidade: 3,
        evitavel: true,
      },
      {
        erro: "Transfundir plaquetas sem tratar causa",
        descricao: "Consumidas rapidamente",
        penalidade: 1.5,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu CID",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou testes de coagulação",
        realizado: false,
        critico: true,
      },
      {
        item: "Encaminhou CTI",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de CID",
        peso: 35,
        descricao: "Achados clínicos e laboratoriais",
        pontuacao_maxima: 35,
      },
      {
        criterio: "Urgência e conduta",
        peso: 30,
        descricao: "CTI imediato",
        pontuacao_maxima: 30,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Sangramento difuso",
          "Sepse anterior",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Choque",
          "Petéquias",
          "Sangramento ativo",
          "Coagulopatia severa",
          "D-dímero massivo",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "Coagulação intravascular disseminada",
          "Choque séptico",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "CTI imediato",
          "Suporte hemodinâmico",
          "Antibióticos",
          "Transfusão",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu CID",
        "Solicitou testes de coagulação",
        "Encaminhou CTI",
      ],
      erros_comuns: ["Achar que é trombocitopenia imune"],
      orientacoes_pedagogicas: [
        "CID: sangramento + coagulopatia + contexto de sepse/trauma/malignidade",
        "D-dímero é o teste mais sensível",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer CID como emergência máxima",
      comunicacao: ["explicou urgência crítica"],
      anamnese: ["investigou contexto de sepse"],
      exame_fisico: ["detectou sangramento difuso"],
      exames_complementares: ["pediu coagulação"],
      raciocinio: ["diagnosticou CID"],
      conduta: ["encaminhou CTI"],
      soap: ["documentou emergência"],
    },

    temaOSCE: "Coagulopatias",
    subtopicosOSCE: [
      "CID",
      "Sangramento difuso",
      "Coagulopatia",
      "Choque séptico",
      "Emergência máxima",
    ],
    diagnosticoCorreto: "Coagulação Intravascular Disseminada",
    ativo: false,    },

  {
    // ====== CASO 51: HEMOFILIA A ======
    id: "51",
    titulo: "Hemofilia A",
    sistema: "Hematologia",
    tema: "Coagulopatias",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 11,
    objetivo_pedagogico: "Diagnosticar hemofilia por sangramento espontâneo e testes de coagulação",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Rafael Santos",
      idade: 16,
      sexo: "Masculino",
      queixa_principal: "Sangramento articular, hematomas fáceis",
      historia_breve: "Adolescente com sangramento recorrente em joelho",
  },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Hemofilia A",
      diagnosticos_diferenciais: ["Hemofilia B", "Doença de von Willebrand", "Trombocitopenia"],
      sindromes_associadas: ["Hemartrose", "Hemorragia musculoesquelética"],
    },

    descricaoBreve: "Paciente com hemartrose, sangramento espontâneo, TTPa prolongado, dosagem baixa de fator VIII",
    categoria: "Coagulopatias",
    paciente: {
      id: "pac-051",
      nome: "Rafael Santos",
      idade: 16,
      sexo: "M",
      queixaPrincipal: "Sangramento articular",
      historicoDoenca: "Episódios recorrentes de hemartrose",
      antecedentes: ["História familiar de sangramento"],
      profissao: "Estudante",
      estado_civil: "Solteiro",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Meu joelho fica inchado e dói muito por causa de sangramento",
      sangramento_articular: "Sim, principalmente joelho",
      hematomas: "Sim, roxo fácil por qualquer coisa",
      sangramento_nasal: "Sim, às vezes",
      historia_familiar: "Meu avó tinha algo parecido",
      dor_articular: "Muita dor no joelho",
      duracao: "Episódios desde criança",
    },
    respostaPaciente: {
      inicial: "Sangramento articular e hematomas",
      sangramento_articular: "Sim",
      hematomas: "Fácil",
      sangramento_nasal: "Sim",
      historia_familiar: "Sim",
      dor_articular: "Muita",
      duracao: "Desde criança",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "120/75 mmHg",
        frequenciaCardiaca: 80,
        frequenciaRespiratoria: 16,
        temperatura: 36.8,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "120/75 mmHg",
      frequenciaCardiaca: 80,
      frequenciaRespiratoria: 16,
      temperatura: 36.8,
      saturacaoOxigenio: 98,
    },

    exame_fisico: {
      correto: {
        inspecao: "Hematomas em MMII, edema articular em joelho",
        palpacao: "Articulação dolorosa, limitação de movimento",
        ausculta: "Normal",
        percussao: "Normal",
        observacoes: "Hemartrose aguda",
        regiao: "Membros inferiores",
        achados_positivos: ["Hematomas", "Edema articular", "Hemartrose"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Hematomas e edema",
      palpacao: "Hemartrose dolorosa",
      ausculta: "Normal",
      percussao: "Normal",
      observacoes: "Hemofilia",
    },

    exame_fisico_interativo: {
      membros: {
        edema: "Joelho com hemartrose",
        mobilidade: "Muito limitada por dor",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "TP",
        descricao: "Tempo de protrombina",
        resultado: "12 segundos",
        valor_referencia: "11-13.5 segundos",
        interpretacao: "Normal",
      },
      {
        nome: "TTPa",
        descricao: "Tempo de tromboplastina parcial ativada",
        resultado: "52 segundos",
        valor_referencia: "25-35 segundos",
        interpretacao: "Prolongado",
      },
      {
        nome: "Fator VIII",
        descricao: "Atividade de fator VIII",
        resultado: "8%",
        valor_referencia: ">70%",
        interpretacao: "Deficiência severa",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Hemofilia A",
        probabilidade: 95,
        criterios_minimos: [
          "Sangramento articular espontâneo",
          "TTPa prolongado",
          "Fator VIII baixo",
          "História familiar",
          "TP normal",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Hemofilia B",
        criterios_exclusao: ["Fator VIII normal", "Fator IX baixo"],
        achados_que_descartam: ["Fator VIII baixo"],
      },
    ],
    examesIndicados: [
      "TP, TTPa, PT",
      "Dosagem de fator VIII",
      "Se TTPa prolongado: painel de fatores de coagulação",
    ],

    conduta_esperada: {
      imediata: [
        "Repouso e elevação",
        "Reposição de fator VIII",
      ],
      curto_prazo: [
        "Fisioterapia",
        "Educação sobre atividades",
      ],
      longo_prazo: [
        "Acompanhamento hematológico",
        "Inibidor de fibrinólise se indicado",
      ],
      encaminhamentos: ["Hematologia"],
    },
    condutaCorreta: "TTPa e dosagem fator VIII, reposição de fator VIII, repouso, hematologia",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["Hemartrose", "Fator VIII <10%"],
        descricao: "Hemofilia severa com risco de deficiências",
        recomendacao: "Reposição de fator VIII",
      },
    ],

    erros_criticos: [
      {
        erro: "Prescrever AINE",
        descricao: "Aumenta sangramento",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu coagulopatia",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou TTPa",
        realizado: false,
        critico: true,
      },
      {
        item: "Dosou fator VIII",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de hemofilia",
        peso: 25,
        descricao: "Achados clínicos",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Diagnóstico diferencial",
        peso: 20,
        descricao: "Fator VIII vs. IX",
        pontuacao_maxima: 20,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Hemartrose",
          "História familiar",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Edema articular",
          "TTPa prolongado",
          "Fator VIII baixo",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Hemofilia A"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Reposição de fator VIII",
          "Hematologia",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu hemofilia",
        "Solicitou TTPa",
        "Dosou fator VIII",
      ],
      erros_comuns: ["Confundir com hemofilia B"],
      orientacoes_pedagogicas: [
        "Hemofilia A: fator VIII baixo",
        "Hemofilia B: fator IX baixo",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Diagnosticar hemofilia por achados clínicos e laboratoriais",
      comunicacao: ["explicou importância da reposição"],
      anamnese: ["investigou história familiar"],
      exame_fisico: ["detectou hemartrose"],
      exames_complementares: ["pediu TTPa e fator VIII"],
      raciocinio: ["diagnosticou hemofilia A"],
      conduta: ["prescreveu fator VIII"],
      soap: ["documentou hemofilia"],
    },

    temaOSCE: "Coagulopatias",
    subtopicosOSCE: [
      "Hemofilia A",
      "Hemartrose",
      "Fator VIII baixo",
      "TTPa prolongado",
      "Sangramento espontâneo",
    ],
    diagnosticoCorreto: "Hemofilia A",
    ativo: false,    },

  {
    // ====== CASO 52: DEFICIÊNCIA DE VITAMINA K ======
    id: "52",
    titulo: "Deficiência de Vitamina K",
    sistema: "Hematologia",
    tema: "Coagulopatias",
    nivel: "iniciante",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 10,
    objetivo_pedagogico: "Diagnosticar deficiência de vitamina K e institui reposição",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Débora Mendes",
      idade: 70,
      sexo: "Feminino",
      queixa_principal: "Equimoses fáceis, sangramento gengival",
      historia_breve: "Mulher idosa com icterícia e problemas de coagulação",
  },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Deficiência de Vitamina K",
      diagnosticos_diferenciais: ["Hepatopatia", "Overdose de anticoagulante", "DIC"],
      sindromes_associadas: ["Má absorção intestinal"],
    },

    descricaoBreve: "Paciente com sangramento, TP prolongado, TTPa normal, tempo de sangramento normal",
    categoria: "Coagulopatias",
    paciente: {
      id: "pac-052",
      nome: "Débora Mendes",
      idade: 70,
      sexo: "F",
      queixaPrincipal: "Sangramento e equimoses",
      historicoDoenca: "Diarreia crônica há meses",
      antecedentes: ["Diarreia crônica", "Má absorção"],
      profissao: "Aposentada",
      estado_civil: "Viúva",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Tenho roxo fácil e sangramento na gengiva",
      hematomas: "Sim, roxo muito fácil",
      sangramento: "Gengivite, sangramento de pequenos ferimentos",
      fezes: "Fezes soltas há muito tempo",
      ictericia: "Um pouco de amarelão",
      sangramento_GI: "Não notei",
      abdome: "Sem dor, mas diarreia crônica",
    },
    respostaPaciente: {
      inicial: "Hematomas e sangramento",
      hematomas: "Fácil",
      sangramento: "Gengival",
      fezes: "Diarreia crônica",
      ictericia: "Leve",
      sangramento_GI: "Não",
      abdome: "Diarreia",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "120/75 mmHg",
        frequenciaCardiaca: 78,
        frequenciaRespiratoria: 16,
        temperatura: 36.8,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "120/75 mmHg",
      frequenciaCardiaca: 78,
      frequenciaRespiratoria: 16,
      temperatura: 36.8,
      saturacaoOxigenio: 98,
    },

    exame_fisico: {
      correto: {
        inspecao: "Equimoses, icterícia leve, sangramento gengival",
        palpacao: "Sem hepatomegalia, sem esplenomegalia",
        ausculta: "Normal",
        percussao: "Normal",
        observacoes: "Coagulopatia periférica",
        regiao: "Geral",
        achados_positivos: ["Equimoses", "Sangramento gengival", "Icterícia leve"],
        achados_negativos: ["Hepatomegalia"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Equimoses, icterícia",
      palpacao: "Sem hepatomegalia",
      ausculta: "Normal",
      percussao: "Normal",
      observacoes: "Deficiência de K",
    },

    exame_fisico_interativo: {
      geral: {
        coloracao: "Leve icterícia",
        consciencia: "Alerta",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "TP",
        descricao: "Tempo de protrombina",
        resultado: "18 segundos",
        valor_referencia: "11-13.5 segundos",
        interpretacao: "Prolongado",
      },
      {
        nome: "TTPa",
        descricao: "Tempo de tromboplastina parcial ativada",
        resultado: "32 segundos",
        valor_referencia: "25-35 segundos",
        interpretacao: "Normal",
      },
      {
        nome: "INR",
        descricao: "International Normalized Ratio",
        resultado: "1.8",
        valor_referencia: "<1.1",
        interpretacao: "Prolongado",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Deficiência de Vitamina K",
        probabilidade: 90,
        criterios_minimos: [
          "TP prolongado",
          "TTPa normal",
          "INR elevado",
          "Diarreia crônica",
          "Resposta a vitamina K",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Hepatopatia",
        criterios_exclusao: ["Sem hepatomegalia", "TTPa normal"],
        achados_que_descartam: ["Sem liver disease"],
      },
    ],
    examesIndicados: [
      "TP, TTPa, PT",
      "INR",
      "Testes de função hepática se suspeita de hepatopatia",
    ],

    conduta_esperada: {
      imediata: [
        "Vitamina K1 oral ou IV",
        "Investigação de diarreia",
      ],
      curto_prazo: [
        "Repetição de TP em 24-48h",
        "Avaliação de causa de má absorção",
      ],
      longo_prazo: [
        "Suplementação contínua",
      ],
      encaminhamentos: ["Hematologia", "Gastroenterologia"],
    },
    condutaCorreta: "TP/TTPa/INR, vitamina K1 IV, investigação de diarreia, repetir TP 24-48h",

    criterios_de_gravidade: [
      {
        severidade: "leve",
        sinais: ["TP prolongado", "INR <2.5"],
        descricao: "Deficiência moderada de vitamina K",
        recomendacao: "Reposição oral",
      },
    ],

    erros_criticos: [
      {
        erro: "Não investigar diarreia",
        descricao: "Causa de deficiência de K",
        penalidade: 1,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu deficiência de K",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou TP e INR",
        realizado: false,
        critico: true,
      },
      {
        item: "Prescreveu vitamina K",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de deficiência de K",
        peso: 25,
        descricao: "TP prolongado com TTPa normal",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Tratamento apropriado",
        peso: 20,
        descricao: "Vitamina K",
        pontuacao_maxima: 20,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Hematomas",
          "Diarreia crônica",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Equimoses",
          "TP prolongado",
          "INR elevado",
          "TTPa normal",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Deficiência de vitamina K"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Vitamina K1",
          "Investigação de diarreia",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu deficiência de K",
        "Solicitou TP/INR",
        "Prescreveu vitamina K",
      ],
      erros_comuns: ["Confundir com hepatopatia"],
      orientacoes_pedagogicas: [
        "Deficiência K: TP prolongado com TTPa normal",
        "Hepatopatia: TP e TTPa prolongados",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Diagnosticar e repor vitamina K",
      comunicacao: ["explicou causa da diarreia"],
      anamnese: ["investigou diarreia"],
      exame_fisico: ["detectou sangramento"],
      exames_complementares: ["pediu TP/INR"],
      raciocinio: ["diagnosticou deficiência K"],
      conduta: ["prescreveu vitamina K"],
      soap: ["documentou deficiência"],
    },

    temaOSCE: "Coagulopatias",
    subtopicosOSCE: [
      "Deficiência de vitamina K",
      "TP prolongado",
      "INR elevado",
      "Diarreia crônica",
      "Má absorção",
    ],
    diagnosticoCorreto: "Deficiência de Vitamina K",
    ativo: false,    },

  {
    // ====== CASO 53: TALASSEMIA MAIOR ======
    id: "53",
    titulo: "Talassemia Maior",
    sistema: "Hematologia",
    tema: "Anemias hereditárias",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 11,
    objetivo_pedagogico: "Diagnosticar talassemia maior por achados clínicos e laboratoriais",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Antonio Rossi",
      idade: 12,
      sexo: "Masculino",
      queixa_principal: "Cansaço, palidez, deformidades faciais",
      historia_breve: "Criança mediterrânea com anemia crônica desde pequeno",
  },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Talassemia Maior",
      diagnosticos_diferenciais: ["Anemia ferropriva", "Talassemia menor", "Esferocitose hereditária"],
      sindromes_associadas: ["Hemólise crônica", "Sobrecarga de ferro"],
    },

    descricaoBreve: "Criança com anemia macrocítica, hepatomegalia, esplenomegalia, alterações faciais",
    categoria: "Anemias hereditárias",
    paciente: {
      id: "pac-053",
      nome: "Antonio Rossi",
      idade: 12,
      sexo: "M",
      queixaPrincipal: "Cansaço e palidez",
      historicoDoenca: "Anemia desde pequeno",
      antecedentes: ["Origem mediterrânea", "Transfusões regulares"],
      profissao: "Estudante",
      estado_civil: "Solteiro",
      alergias: [],
      medicamentos_em_uso: ["Transfusões"],
    },

    respostas_do_paciente: {
      inicial: "Sou muito cansado, pálido desde pequeno",
      cansaco: "Muito, não aguento esforço",
      facies: "Tenho a cara diferente, abaulada",
      respiracao: "Fico sem ar fácil",
      transfusoes: "Tomo transfusão cada 4-6 semanas",
      barriga: "Barriga inchada por causa do baço",
      crescimento: "Sou pequeno para minha idade",
    },
    respostaPaciente: {
      inicial: "Cansaço e alterações faciais",
      cansaco: "Muito",
      facies: "Deformidade facial",
      respiracao: "Sim",
      transfusoes: "Regulares",
      barriga: "Esplenomegalia",
      crescimento: "Retardo",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "110/70 mmHg",
        frequenciaCardiaca: 95,
        frequenciaRespiratoria: 20,
        temperatura: 36.8,
        saturacaoOxigenio: 96,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "110/70 mmHg",
      frequenciaCardiaca: 95,
      frequenciaRespiratoria: 20,
      temperatura: 36.8,
      saturacaoOxigenio: 96,
    },

    exame_fisico: {
      correto: {
        inspecao: "Criança pálida, alterações faciais (frontal e malar proeminentes), deformidade do palato",
        palpacao: "Hepatomegalia 4cm, esplenomegalia 6cm",
        ausculta: "Sopro sistólico",
        percussao: "Baço aumentado",
        observacoes: "Talassemia maior com alterações ósseas",
        regiao: "Geral",
        achados_positivos: [
          "Palidez",
          "Alterações faciais",
          "Hepatomegalia",
          "Esplenomegalia",
          "Retardo de crescimento",
        ],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Alterações faciais, palidez",
      palpacao: "Hepatomegalia, esplenomegalia",
      ausculta: "Sopro sistólico",
      percussao: "Baço aumentado",
      observacoes: "Talassemia maior",
    },

    exame_fisico_interativo: {
      geral: {
        coloracao: "Muito pálido",
        facies: "Proeminência frontal e malar",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Hemograma",
        descricao: "Série vermelha",
        resultado: "Hb 7.5, VCM 72, RDW elevado",
        valor_referencia: "Hb 12-16, VCM 80-100",
        interpretacao: "Anemia macrocítica com anisocitose",
      },
      {
        nome: "Hemoglobina F",
        descricao: "Hemoglobina fetal",
        resultado: "80%",
        valor_referencia: "<1%",
        interpretacao: "Talassemia maior",
      },
      {
        nome: "Ferritina",
        descricao: "Sobrecarga de ferro",
        resultado: "3500 ng/mL",
        valor_referencia: "<24 ng/mL",
        interpretacao: "Sobrecarga de ferro",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Talassemia Maior",
        probabilidade: 98,
        criterios_minimos: [
          "Anemia macrocítica",
          "Hemoglobina F elevada",
          "Alterações ósseas faciais",
          "Hepatosplenomegalia",
          "Transfusões regulares",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Talassemia menor",
        criterios_exclusao: ["Hemoglobina F 80%"],
        achados_que_descartam: ["HbF normal"],
      },
    ],
    examesIndicados: [
      "Hemograma com RDW",
      "Eletroforese de hemoglobina",
      "Hemoglobina F",
      "Estudo de ferro (ferritina, TIBC)",
      "Ecocardiograma anual",
    ],

    conduta_esperada: {
      imediata: [
        "Continuação de transfusões",
        "Quelação de ferro",
      ],
      curto_prazo: [
        "Monitorização de complicações",
        "Possível transplante de medula",
      ],
      longo_prazo: [
        "Seguimento multidisciplinar",
      ],
      encaminhamentos: ["Hematologia"],
    },
    condutaCorreta: "Hemograma, hemoglobina F, ferritina, quelação de ferro, transplante de medula se indicado",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["Anemia severa", "Sobrecarga de ferro", "Alterações faciais"],
        descricao: "Talassemia maior com complicações",
        recomendacao: "Seguimento hematológico intensivo",
      },
    ],

    erros_criticos: [
      {
        erro: "Não monitorizar sobrecarga de ferro",
        descricao: "Complicação grave e tratável",
        penalidade: 1.5,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu talassemia",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou hemoglobina F",
        realizado: false,
        critico: true,
      },
      {
        item: "Avaliou sobrecarga de ferro",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de talassemia",
        peso: 25,
        descricao: "Achados clínicos e laboratoriais",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Manejo de complicações",
        peso: 20,
        descricao: "Monitorização de ferro",
        pontuacao_maxima: 20,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Cansaço crônico",
          "Alterações faciais",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Anemia severa",
          "Hemoglobina F 80%",
          "Hepatosplenomegalia",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Talassemia maior"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Transfusões regulares",
          "Quelação de ferro",
          "Hematologia",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu talassemia",
        "Solicitou hemoglobina F",
        "Avaliou sobrecarga de ferro",
      ],
      erros_comuns: ["Confundir com anemia ferropriva"],
      orientacoes_pedagogicas: [
        "Talassemia: hemoglobina F elevada",
        "Anemia ferropriva: ferro baixo",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Diagnosticar talassemia e monitorizar complicações",
      comunicacao: ["explicou importância de transfusões"],
      anamnese: ["investigou origem étnica"],
      exame_fisico: ["detectou alterações faciais"],
      exames_complementares: ["pediu hemoglobina F"],
      raciocinio: ["diagnosticou talassemia"],
      conduta: ["monitorizar ferro"],
      soap: ["documentou talassemia"],
    },

    temaOSCE: "Anemias hereditárias",
    subtopicosOSCE: [
      "Talassemia maior",
      "Hemoglobina F elevada",
      "Anemia macrocítica",
      "Sobrecarga de ferro",
      "Alterações ósseas",
    ],
    diagnosticoCorreto: "Talassemia Maior",
    ativo: false,    },

  {
    // ====== CASO 54: DIABETES MELLITUS COM COMPLICAÇÕES VASCULARES ======
    id: "54",
    titulo: "Diabetes Mellitus Tipo 2 com Complicações Vasculares",
    sistema: "Endocrinologia",
    tema: "Casos Integradores",
    nivel: "avancado",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 13,
    objetivo_pedagogico: "Reconhecer diabetes com complicações microvasculares e macrovasculares",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Fernando Oliveira",
      idade: 62,
      sexo: "Masculino",
      queixa_principal: "Cansaço, formigamento nos pés, dificuldade visual",
      historia_breve: "Diabético mal controlado com múltiplas complicações",
  },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Diabetes Mellitus Tipo 2 com Neuropatia e Retinopatia",
      diagnosticos_diferenciais: ["Polineuropatia por outra causa", "Catarata", "Glaucoma"],
      sindromes_associadas: ["Retinopatia diabética", "Nefropatia diabética", "Neuropatia periférica"],
    },

    descricaoBreve: "Paciente diabético com polineuropatia, retinopatia, proteinúria e glicemia descontrolada",
    categoria: "Casos Integradores",
    paciente: {
      id: "pac-054",
      nome: "Fernando Oliveira",
      idade: 62,
      sexo: "M",
      queixaPrincipal: "Cansaço e complicações",
      historicoDoenca: "Diabetes há 15 anos mal controlado",
      antecedentes: ["Diabetes tipo 2", "Hipertensão", "Dislipidemia"],
      profissao: "Vendedor",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: ["Metformina"],
    },

    respostas_do_paciente: {
      inicial: "Tenho diabetes há muito tempo, agora tô com complicações",
      glicemia: "Nunca controlei bem, acima de 200",
      visao: "Visão embaçada, ficou pior",
      formigamento: "Nos pés, principalmente à noite",
      cansaco: "Muito cansaço",
      hipertensao: "Pressão alta também",
      sangue_urina: "Às vezes vejo sangue na urina",
    },
    respostaPaciente: {
      inicial: "Diabetes com complicações",
      glicemia: "Descontrolada",
      visao: "Embaçada",
      formigamento: "Sim",
      cansaco: "Muita",
      hipertensao: "Sim",
      sangue_urina: "Às vezes",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "160/95 mmHg",
        frequenciaCardiaca: 88,
        frequenciaRespiratoria: 18,
        temperatura: 36.8,
        saturacaoOxigenio: 97,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "160/95 mmHg",
      frequenciaCardiaca: 88,
      frequenciaRespiratoria: 18,
      temperatura: 36.8,
      saturacaoOxigenio: 97,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente obeso, úlcera em pé direito",
        palpacao: "Redução de sensibilidade em MMII, pulsos palpáveis",
        ausculta: "Normal",
        percussao: "Reflexos diminuídos em MMII",
        observacoes: "Neuropatia periférica com úlcera diabética",
        regiao: "Geral",
        achados_positivos: ["Neuropatia", "Úlcera", "Obesidade"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Obeso, úlcera em pé",
      palpacao: "Sensibilidade reduzida",
      ausculta: "Normal",
      percussao: "Reflexos diminuídos",
      observacoes: "Neuropatia diabética",
    },

    exame_fisico_interativo: {
      geral: {
        estado_geral: "Sobrepeso/obeso",
        consciencia: "Alerta",
      },
      membros: {
        edema: "Polineuropatia sensitiva simétrica",
        mobilidade: "Grau 2-3/5 MMII, 4/5 MMSS",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Glicemia em jejum",
        descricao: "Glicose sanguínea",
        resultado: "280 mg/dL",
        valor_referencia: "<100 mg/dL",
        interpretacao: "Hiperglicemia severa",
      },
      {
        nome: "HbA1c",
        descricao: "Controle glicêmico",
        resultado: "10.5%",
        valor_referencia: "<5.7%",
        interpretacao: "Controle ruim",
      },
      {
        nome: "Proteinúria",
        descricao: "Proteína em urina",
        resultado: "3+ (proteinúria nefrótica)",
        valor_referencia: "Negativa",
        interpretacao: "Nefropatia diabética avançada",
      },
      {
        nome: "Creatinina",
        descricao: "Função renal",
        resultado: "2.1 mg/dL",
        valor_referencia: "<1.2 mg/dL",
        interpretacao: "Insuficiência renal",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Diabetes Mellitus Tipo 2 com Complicações",
        probabilidade: 98,
        criterios_minimos: [
          "Glicemia elevada",
          "HbA1c >7%",
          "Neuropatia",
          "Proteinúria",
          "Retinopatia",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Polineuropatia por outra causa",
        criterios_exclusao: ["Diabetes confirmado", "Glicemia elevada"],
        achados_que_descartam: ["História de diabetes"],
      },
    ],
    examesIndicados: [
      "Glicemia, HbA1c",
      "Microalbuminúria/proteinúria",
      "Creatinina e TFG",
      "Lipidograma",
      "Retinoscopia",
    ],

    conduta_esperada: {
      imediata: [
        "Insulina se glicemia >250",
        "Controle de pressão arterial",
      ],
      curto_prazo: [
        "Otimização de hipoglicemiantes",
        "Cuidado de ferida",
        "Endocrinologia",
      ],
      longo_prazo: [
        "Prevenção de complicações",
        "Reabilitação vascular",
      ],
      encaminhamentos: ["Endocrinologia", "Oftalmologia", "Angiologia"],
    },
    condutaCorreta: "Insulina, losartana, estatina, controle glicêmico agressivo, múltiplos especialistas",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["Glicemia >250", "Proteinúria nefrótica", "Neuropatia com úlcera"],
        descricao: "Diabetes com complicações severas",
        recomendacao: "Hospitalização e intensificação de tratamento",
      },
    ],

    erros_criticos: [
      {
        erro: "Não investigar complicações vasculares",
        descricao: "Essencial para prognóstico",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu diabetes descompensado",
        realizado: false,
        critico: true,
      },
      {
        item: "Investigou neuropatia",
        realizado: false,
        critico: true,
      },
      {
        item: "Avaliou função renal",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou retinoscopia",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de complicações",
        peso: 30,
        descricao: "Neuropatia, nefropatia, retinopatia",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Conduta multidisciplinar",
        peso: 25,
        descricao: "Encaminhamentos apropriados",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Diabetes mal controlado",
          "Complicações",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Glicemia 280",
          "HbA1c 10.5%",
          "Neuropatia",
          "Proteinúria nefrótica",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "Diabetes tipo 2 com complicações",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Insulina",
          "Pressão arterial",
          "Múltiplos especialistas",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu complicações",
        "Investigou neuropatia",
        "Avaliou renal",
        "Encaminhou oftalmologia",
      ],
      erros_comuns: ["Focar apenas em glicemia"],
      orientacoes_pedagogicas: [
        "Diabetes: sempre investigar complicações",
        "Retinopatia, nefropatia, neuropatia são as 3 principais",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer complicações multissistêmicas",
      comunicacao: ["explicou importância do controle"],
      anamnese: ["investigou complicações"],
      exame_fisico: ["detectou neuropatia"],
      exames_complementares: ["pediu múltiplos exames"],
      raciocinio: ["diagnosticou complicações"],
      conduta: ["prescreveu múltiplos fármacos"],
      soap: ["documentou integradoramente"],
    },

    temaOSCE: "Casos Integradores",
    subtopicosOSCE: [
      "Diabetes descompensado",
      "Neuropatia",
      "Nefropatia",
      "Retinopatia",
      "Complicações vasculares",
    ],
    diagnosticoCorreto: "Diabetes Mellitus Tipo 2 com Complicações Microvasculares e Macrovasculares",
    ativo: false,    },

  {
    // ====== CASO 55: INSUFICIÊNCIA RENAL CRÔNICA COM COMPLICAÇÕES ======
    id: "55",
    titulo: "Insuficiência Renal Crônica Estágio 4",
    sistema: "Nefrologia",
    tema: "Casos Integradores",
    nivel: "avancado",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 13,
    objetivo_pedagogico: "Reconhecer IRC avançada com complicações de hipertensão, anemia e alterações eletrolíticas",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Maria Souza",
      idade: 68,
      sexo: "Feminino",
      queixa_principal: "Fadiga, edema, pressão alta, náusea",
      historia_breve: "Paciente com IRC progressiva há 10 anos",
  },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Insuficiência Renal Crônica Estágio 4",
      diagnosticos_diferenciais: ["Insuficiência renal aguda", "Nefropatia diabética", "Doença renal policística"],
      sindromes_associadas: ["Hipertensão refratária", "Anemia", "Hiperkalemia", "Acidose metabólica"],
    },

    descricaoBreve: "Paciente com TFG 15, edema, hipertensão, palidez, anemia severa",
    categoria: "Casos Integradores",
    paciente: {
      id: "pac-055",
      nome: "Maria Souza",
      idade: 68,
      sexo: "F",
      queixaPrincipal: "Fadiga e edema",
      historicoDoenca: "IRC progressiva há 10 anos",
      antecedentes: ["Hipertensão", "IRC"],
      profissao: "Aposentada",
      estado_civil: "Viúva",
      alergias: [],
      medicamentos_em_uso: ["Losartana", "Furosemida"],
    },

    respostas_do_paciente: {
      inicial: "Muito cansada, corpo inchado, pressão alta",
      fadiga: "Intensa, não consigo fazer nada",
      edema: "Inchação nos pés e pernas",
      pressao: "Pressão sempre alta, difícil controlar",
      nausea: "Enjoo constante",
      respiracao: "Sem fôlego às vezes",
      urina: "Pouca quantidade",
    },
    respostaPaciente: {
      inicial: "Fadiga e edema",
      fadiga: "Muito",
      edema: "Pés e pernas",
      pressao: "Alta",
      nausea: "Sim",
      respiracao: "Sim",
      urina: "Pouca",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "170/100 mmHg",
        frequenciaCardiaca: 92,
        frequenciaRespiratoria: 20,
        temperatura: 36.8,
        saturacaoOxigenio: 96,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "170/100 mmHg",
      frequenciaCardiaca: 92,
      frequenciaRespiratoria: 20,
      temperatura: 36.8,
      saturacaoOxigenio: 96,
    },

    exame_fisico: {
      correto: {
        inspecao: "Palidez, edema em membros inferiores e sacro",
        palpacao: "Edema com cacifo, sem diurese",
        ausculta: "Estertores basais bilaterais",
        percussao: "Normal",
        observacoes: "Sobrecarga volêmica e insuficiência cardíaca direita",
        regiao: "Geral",
        achados_positivos: ["Palidez", "Edema", "Estertores"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Pálida, edema",
      palpacao: "Edema com cacifo",
      ausculta: "Estertores basais",
      percussao: "Normal",
      observacoes: "IRC com congestão",
    },

    exame_fisico_interativo: {
      geral: {
        coloracao: "Pálida, apergaminhada",
        consciencia: "Alerta mas cansada",
      },
      membros: {
        edema: "Bilateral, com cacifo",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Creatinina",
        descricao: "Função renal",
        resultado: "4.5 mg/dL",
        valor_referencia: "<1.2 mg/dL",
        interpretacao: "Insuficiência renal severa",
      },
      {
        nome: "Potássio",
        descricao: "Eletrólito",
        resultado: "6.2 mEq/L",
        valor_referencia: "3.5-5.0 mEq/L",
        interpretacao: "Hiperkalemia",
      },
      {
        nome: "pH",
        descricao: "Acidose",
        resultado: "7.28",
        valor_referencia: ">7.35",
        interpretacao: "Acidose metabólica",
      },
      {
        nome: "Hemoglobina",
        descricao: "Anemia",
        resultado: "7.5 g/dL",
        valor_referencia: ">12 g/dL",
        interpretacao: "Anemia severa de doença crônica",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Insuficiência Renal Crônica Estágio 4",
        probabilidade: 98,
        criterios_minimos: [
          "Creatinina elevada",
          "TFG <30",
          "Anemia",
          "Hiperkalemia",
          "Acidose",
          "Hipertensão refratária",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Insuficiência renal aguda",
        criterios_exclusao: ["História crônica de 10 anos"],
        achados_que_descartam: ["IRC progressiva"],
      },
    ],
    examesIndicados: [
      "Creatinina, TFG",
      "Eletrólitos (K, Na, Cl, CO2)",
      "Hemograma",
      "Fósforo, cálcio",
      "PTH",
      "USG renal",
    ],

    conduta_esperada: {
      imediata: [
        "Controle de potássio",
        "Diálise se TFG <15",
        "Controle de pressão arterial",
      ],
      curto_prazo: [
        "Nefrologia urgente",
        "Preparação para diálise",
      ],
      longo_prazo: [
        "Diálise regular",
        "Transplante se possível",
      ],
      encaminhamentos: ["Nefrologia", "Vascular para fístula"],
    },
    condutaCorreta: "Nefrologia urgente, TFG, eletrólitos, diálise se indicado, controle de K",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["TFG <15", "Hiperkalemia", "Acidose"],
        descricao: "IRC em estágio avançado com complicações",
        recomendacao: "Diálise imediata",
      },
    ],

    erros_criticos: [
      {
        erro: "Não monitorizar potássio",
        descricao: "Risco de arritmia cardíaca",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu IRC avançada",
        realizado: false,
        critico: true,
      },
      {
        item: "Avaliou eletrólitos",
        realizado: false,
        critico: true,
      },
      {
        item: "Investigou anemia",
        realizado: false,
        critico: true,
      },
      {
        item: "Encaminhou nefrologia",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de IRC",
        peso: 30,
        descricao: "Estadiamento e complicações",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Manejo de complicações",
        peso: 25,
        descricao: "Potássio, anemia, pressão",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Fadiga",
          "Edema",
          "Náusea",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Creatinina 4.5",
          "Potássio 6.2",
          "Anemia",
          "Edema",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["IRC estágio 4"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Nefrologia",
          "Diálise",
          "Controle de K",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu IRC",
        "Avaliou eletrólitos",
        "Investigou anemia",
        "Encaminhou nefrologia",
      ],
      erros_comuns: ["Focar apenas em pressão"],
      orientacoes_pedagogicas: [
        "IRC: sempre investigar complicações cardiovasculares e eletrolíticas",
        "Potássio >6 é emergência",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer IRC com complicações multissistêmicas",
      comunicacao: ["explicou urgência de diálise"],
      anamnese: ["investigou sintomas"],
      exame_fisico: ["detectou edema e estertores"],
      exames_complementares: ["pediu eletrólitos"],
      raciocinio: ["diagnosticou IRC"],
      conduta: ["encaminhou nefrologia"],
      soap: ["documentou IRC"],
    },

    temaOSCE: "Casos Integradores",
    subtopicosOSCE: [
      "IRC estágio 4",
      "Hiperkalemia",
      "Anemia",
      "Hipertensão",
      "Complicações sistêmicas",
    ],
    diagnosticoCorreto: "Insuficiência Renal Crônica Estágio 4",
    ativo: false,    },

  {
    // ====== CASO 56: LÚPUS ERITEMATOSO SISTÊMICO ======
    id: "56",
    titulo: "Lúpus Eritematoso Sistêmico com Nefrite",
    sistema: "Imunologia",
    tema: "Casos Integradores",
    nivel: "avancado",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 13,
    objetivo_pedagogico: "Diagnosticar LES por achados clínicos multissistêmicos e laboratoriais",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Carolina Silva",
      idade: 32,
      sexo: "Feminino",
      queixa_principal: "Febre, artrite, edema facial, erupção em rosto",
      historia_breve: "Mulher jovem com sintomas multissistêmicos",
  },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Lúpus Eritematoso Sistêmico com Nefrite Lúpica",
      diagnosticos_diferenciais: ["Artrite reumatoide", "Síndrome de Sjögren", "Esclerodermia"],
      sindromes_associadas: ["Glomerulonefrite lúpica", "Vasculite", "Trombocitopenia"],
    },

    descricaoBreve: "Paciente com rash malar, artrite, nefrite, ANA positivo, anti-DNA elevado",
    categoria: "Casos Integradores",
    paciente: {
      id: "pac-056",
      nome: "Carolina Silva",
      idade: 32,
      sexo: "F",
      queixaPrincipal: "Febre e artrite",
      historicoDoenca: "Sintomas há 2 meses",
      antecedentes: ["Fotossensibilidade"],
      profissao: "Professora",
      estado_civil: "Solteira",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Tenho febre, dor nas articulações e uma erupção no rosto",
      febre: "Febre recorrente",
      artrite: "Dor nas mãos e joelhos",
      rash: "Vermelhidão no rosto em forma de borboleta",
      edema_facial: "Inchaço no rosto",
      fadiga: "Muito cansaço",
      urina: "Urina escura às vezes",
    },
    respostaPaciente: {
      inicial: "Febre e artrite",
      febre: "Sim",
      artrite: "Mãos e joelhos",
      rash: "Malar",
      edema_facial: "Sim",
      fadiga: "Muito",
      urina: "Escura às vezes",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "130/85 mmHg",
        frequenciaCardiaca: 92,
        frequenciaRespiratoria: 18,
        temperatura: 38.5,
        saturacaoOxigenio: 97,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "130/85 mmHg",
      frequenciaCardiaca: 92,
      frequenciaRespiratoria: 18,
      temperatura: 38.5,
      saturacaoOxigenio: 97,
    },

    exame_fisico: {
      correto: {
        inspecao: "Rash malar, edema facial, úlceras orais",
        palpacao: "Articulações das mãos dolorosas, sem deformidade",
        ausculta: "Sopro sistólico",
        percussao: "Normal",
        observacoes: "Sinais de LES sistêmico",
        regiao: "Geral",
        achados_positivos: ["Rash malar", "Artrite", "Úlceras orais"],
        achados_negativos: ["Sem deformidade"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Rash malar",
      palpacao: "Artrite simétrica",
      ausculta: "Sopro sistólico",
      percussao: "Normal",
      observacoes: "LES",
    },

    exame_fisico_interativo: {
      geral: {
        coloracao: "Rash em região malar",
        consciencia: "Alerta",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "ANA",
        descricao: "Anticorpo antinúcleo",
        resultado: "Positivo (padrão homogêneo)",
        valor_referencia: "Negativo",
        interpretacao: "Altamente sugestivo de LES",
      },
      {
        nome: "Anti-DNA dupla fita",
        descricao: "Anticorpo anti-DNA",
        resultado: "1280 IU/mL",
        valor_referencia: "<100 IU/mL",
        interpretacao: "Muito elevado",
      },
      {
        nome: "Complemento C3",
        descricao: "Complemento",
        resultado: "65 mg/dL",
        valor_referencia: ">90 mg/dL",
        interpretacao: "Consumo de complemento",
      },
      {
        nome: "Proteinúria",
        descricao: "Proteína em urina",
        resultado: "2+ (nefrite lúpica)",
        valor_referencia: "Negativa",
        interpretacao: "Envolvimento renal",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Lúpus Eritematoso Sistêmico",
        probabilidade: 95,
        criterios_minimos: [
          "Rash malar",
          "Artrite",
          "ANA positivo",
          "Anti-DNA elevado",
          "Proteinúria",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Artrite reumatoide",
        criterios_exclusao: ["ANA positivo", "Anti-DNA elevado"],
        achados_que_descartam: ["Rash malar"],
      },
    ],
    examesIndicados: [
      "ANA, anti-DNA",
      "Complemento (C3, C4)",
      "CBC, proteínas",
      "Urinálise, proteinúria",
      "Creatinina",
    ],

    conduta_esperada: {
      imediata: [
        "Corticóide sistêmico",
        "AINE se não houver nefrite",
        "Proteção solar",
      ],
      curto_prazo: [
        "Imunossupressor se nefrite",
        "Reumatologia",
      ],
      longo_prazo: [
        "Acompanhamento multidisciplinar",
      ],
      encaminhamentos: ["Reumatologia", "Nefrologia"],
    },
    condutaCorreta: "Corticóide sistêmico, imunossupressor se nefrite, reumatologia, nefrologia",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["Nefrite", "Anti-DNA >500", "Complemento baixo"],
        descricao: "LES com nefrite ativa",
        recomendacao: "Imunossupressão agressiva",
      },
    ],

    erros_criticos: [
      {
        erro: "Não investigar envolvimento renal",
        descricao: "Essencial para prognóstico",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu LES",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou ANA e anti-DNA",
        realizado: false,
        critico: true,
      },
      {
        item: "Investigou nefrite",
        realizado: false,
        critico: true,
      },
      {
        item: "Encaminhou reumatologia",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de LES",
        peso: 30,
        descricao: "Achados clínicos multissistêmicos",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Investigação de órgão-alvo",
        peso: 25,
        descricao: "Nefrite lúpica",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Febre",
          "Artrite",
          "Rash",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Rash malar",
          "ANA positivo",
          "Anti-DNA elevado",
          "Proteinúria",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["LES com nefrite"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Corticóide",
          "Imunossupressor",
          "Reumatologia",
          "Nefrologia",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu LES",
        "Solicitou sorologia",
        "Investigou nefrite",
        "Encaminhou especialistas",
      ],
      erros_comuns: ["Confundir com artrite reumatoide"],
      orientacoes_pedagogicas: [
        "LES: multissistêmico, ANA positivo",
        "AR: artrite erosiva, RF/anti-CCP",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Diagnosticar LES e reconhecer nefrite",
      comunicacao: ["explicou importância de seguimento"],
      anamnese: ["investigou sintomas sistêmicos"],
      exame_fisico: ["detectou rash malar"],
      exames_complementares: ["pediu sorologia"],
      raciocinio: ["diagnosticou LES"],
      conduta: ["prescreveu corticóide"],
      soap: ["documentou LES"],
    },

    temaOSCE: "Casos Integradores",
    subtopicosOSCE: [
      "LES",
      "Rash malar",
      "Nefrite lúpica",
      "ANA/anti-DNA",
      "Doença autoimune",
    ],
    diagnosticoCorreto: "Lúpus Eritematoso Sistêmico com Nefrite Lúpica",
    ativo: false,    },

  {
    // ====== CASO 57: HIV/AIDS COM INFECÇÃO OPORTUNISTA ======
    id: "57",
    titulo: "HIV/AIDS com Pneumocistose",
    sistema: "Infectologia",
    tema: "Casos Integradores",
    nivel: "avancado",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 13,
    objetivo_pedagogico: "Reconhecer AIDS com infecção oportunista e desempenho clinicamente",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Daniel Lima",
      idade: 38,
      sexo: "Masculino",
      queixa_principal: "Falta de ar progressiva, tosse seca, febre",
      historia_breve: "Paciente HIV+ não aderente ao tratamento",
  },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "HIV/AIDS com Pneumonia por Pneumocystis jirovecii",
      diagnosticos_diferenciais: ["Tuberculose", "Criptococose", "Citomegalovírus"],
      sindromes_associadas: ["Imunossupressão severa"],
    },

    descricaoBreve: "Paciente com CD4 <50, dispneia, hipoxemia, infiltrados intersticiais",
    categoria: "Casos Integradores",
    paciente: {
      id: "pac-057",
      nome: "Daniel Lima",
      idade: 38,
      sexo: "M",
      queixaPrincipal: "Dispneia",
      historicoDoenca: "HIV há 10 anos, sem adesão a TARV",
      antecedentes: ["HIV", "Falta de adesão"],
      profissao: "Desempregado",
      estado_civil: "Solteiro",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Não consigo respirar, tenho tosse seca e febre",
      respiracao: "Falta de ar com esforço mínimo",
      tosse: "Tosse seca, persistente",
      febre: "Febre à tarde",
      cansaco: "Muito cansaço",
      perda_peso: "Perdi muito peso",
      hiv: "Tenho HIV mas parei o tratamento",
    },
    respostaPaciente: {
      inicial: "Dispneia e tosse",
      respiracao: "Muito",
      tosse: "Seca",
      febre: "Sim",
      cansaco: "Muita",
      perda_peso: "Sim",
      hiv: "Sem TARV",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "105/65 mmHg",
        frequenciaCardiaca: 110,
        frequenciaRespiratoria: 28,
        temperatura: 38.8,
        saturacaoOxigenio: 88,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "105/65 mmHg",
      frequenciaCardiaca: 110,
      frequenciaRespiratoria: 28,
      temperatura: 38.8,
      saturacaoOxigenio: 88,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente emagrecido, taquipneico, cianose periférica",
        palpacao: "Expansão reduzida",
        ausculta: "MV diminuído bilateral, crepitações finas",
        percussao: "Normal",
        observacoes: "Pneumocystis jirovecii pneumonia",
        regiao: "Pulmões",
        achados_positivos: ["Taquipneia", "Hipoxemia", "Crepitações"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Emagrecido, taquipneico",
      palpacao: "Expansão reduzida",
      ausculta: "MV diminuído, crepitações",
      percussao: "Normal",
      observacoes: "Pneumocystis",
    },

    exame_fisico_interativo: {
      respiratorio: {
        inspecao_torax: "Taquipneia 28, cianose",
        padrao_respiratorio: "Rápido",
        expansibilidade: "Reduzida",
        ausculta_pulmonar: "MV diminuído bilateral com crepitações finas",
        musculatura_acessoria: "Uso discreto",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "CD4",
        descricao: "Contagem de CD4",
        resultado: "28 células/mm³",
        valor_referencia: ">500 células/mm³",
        interpretacao: "AIDS com imunossupressão severa",
      },
      {
        nome: "Carga viral HIV",
        descricao: "Carga viral",
        resultado: ">100.000 cópias/mL",
        valor_referencia: "Indetectável com TARV",
        interpretacao: "Viremia ativa",
      },
      {
        nome: "RX de tórax",
        descricao: "Infiltrados pulmonares",
        resultado: "Infiltrados intersticiais bilaterais",
        valor_referencia: "Normal",
        interpretacao: "Compatível com PCP",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "HIV/AIDS com Pneumocystis jirovecii Pneumonia",
        probabilidade: 95,
        criterios_minimos: [
          "CD4 <50",
          "Dispneia",
          "Crepitações",
          "Infiltrados intersticiais",
          "SpO2 baixa",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Tuberculose",
        criterios_exclusao: ["Infiltrados intersticiais não cavitários"],
        achados_que_descartam: ["RX sem caverna"],
      },
    ],
    examesIndicados: [
      "CD4, carga viral",
      "RX tórax",
      "LDH (marcador de PCP)",
      "Teste de oxigenação com exercício",
      "Esputo induzido ou broncoscopia se suspeita de PCP",
    ],

    conduta_esperada: {
      imediata: [
        "Internação",
        "Oxigenioterapia",
        "TMP-SMX para PCP",
        "TARV iniciador de segunda linha",
      ],
      curto_prazo: [
        "Profilaxia de infecções oportunistas",
        "Recuperação imunológica",
      ],
      longo_prazo: [
        "TARV indefinida",
      ],
      encaminhamentos: ["Infectologia", "Internação"],
    },
    condutaCorreta: "CD4/CV, RX, TMP-SMX, TARV nova, oxigenioterapia, internação, infectologia",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["CD4 <50", "SpO2 <90%", "Pneumocystis"],
        descricao: "AIDS com pneumonia oportunista",
        recomendacao: "Internação e tratamento agressivo",
      },
    ],

    erros_criticos: [
      {
        erro: "Não reconhecer AIDS",
        descricao: "Necessário para diagnóstico e tratamento",
        penalidade: 3,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu AIDS",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou CD4 e carga viral",
        realizado: false,
        critico: true,
      },
      {
        item: "Diagnosticou Pneumocystis",
        realizado: false,
        critico: true,
      },
      {
        item: "Encaminhou infectologia",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de AIDS",
        peso: 30,
        descricao: "CD4 <50",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Diagnóstico de infecção oportunista",
        peso: 25,
        descricao: "Pneumocystis",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Dispneia",
          "HIV sem TARV",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "CD4 28",
          "SpO2 88%",
          "Crepitações",
          "Infiltrados intersticiais",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "AIDS com Pneumocystis",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "TMP-SMX",
          "TARV",
          "Infectologia",
          "Internação",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu AIDS",
        "Solicitou CD4",
        "Diagnosticou Pneumocystis",
        "Encaminhou infectologia",
      ],
      erros_comuns: ["Não pensar em AIDS"],
      orientacoes_pedagogicas: [
        "AIDS: CD4 <200 = risco de PCP",
        "PCP: dispneia + crepitações + infiltrados intersticiais",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer AIDS e infecção oportunista",
      comunicacao: ["explicou importância de TARV"],
      anamnese: ["investigou status HIV"],
      exame_fisico: ["detectou sinais respiratórios"],
      exames_complementares: ["pediu CD4"],
      raciocinio: ["diagnosticou PCP"],
      conduta: ["prescreveu TMP-SMX"],
      soap: ["documentou AIDS"],
    },

    temaOSCE: "Casos Integradores",
    subtopicosOSCE: [
      "HIV/AIDS",
      "CD4 <50",
      "Pneumocystis",
      "Infecção oportunista",
      "Emergência",
    ],
    diagnosticoCorreto: "HIV/AIDS com Pneumonia por Pneumocystis jirovecii",
    ativo: false,    },

  {
    // ====== CASO 58: SÍNDROME METABÓLICA COM INFARTO ======
    id: "58",
    titulo: "Síndrome Metabólica com Infarto Agudo do Miocárdio",
    sistema: "Cardiologia",
    tema: "Casos Integradores",
    nivel: "avancado",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 13,
    objetivo_pedagogico: "Reconhecer síndrome metabólica como fator de risco e diagnosticar IAM",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Ricardo Neves",
      idade: 55,
      sexo: "Masculino",
      queixa_principal: "Dor no peito tipo aperto, sudorese, mal-estar",
      historia_breve: "Homem obeso com síndrome metabólica apresentando IAM",
  },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Infarto Agudo do Miocárdio em Paciente com Síndrome Metabólica",
      diagnosticos_diferenciais: ["Angina instável", "Pericardite", "Embolia pulmonar"],
      sindromes_associadas: ["Síndrome metabólica", "Obesidade", "Hipertensão", "Dislipidemia"],
    },

    descricaoBreve: "Paciente com dor torácica, ST elevado, troponina elevada, circunferência abdominal aumentada",
    categoria: "Casos Integradores",
    paciente: {
      id: "pac-058",
      nome: "Ricardo Neves",
      idade: 55,
      sexo: "M",
      queixaPrincipal: "Dor no peito",
      historicoDoenca: "Obesidade e síndrome metabólica",
      antecedentes: ["Obesidade", "HAS", "Dislipidemia", "Sedentarismo"],
      profissao: "Executivo",
      estado_civil: "Casado",
      alergias: [],
      medicamentos_em_uso: ["Losartana"],
    },

    respostas_do_paciente: {
      inicial: "Tenho dor forte no peito, não consigo respirar",
      dor: "Dor tipo aperto, irradia para braço esquerdo",
      respiracao: "Muito falta de ar",
      sudorese: "Suando muito, frio na espinha",
      nausea: "Enjoo",
      duracao: "Começou há 2 horas",
      antecedentes_dor: "Tinha dor ao esforço antes",
    },
    respostaPaciente: {
      inicial: "Dor torácica súbita",
      dor: "Aperto, irradia braço esquerdo",
      respiracao: "Muita",
      sudorese: "Sim",
      nausea: "Sim",
      duracao: "2 horas",
      antecedentes_dor: "Sim",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "155/95 mmHg",
        frequenciaCardiaca: 115,
        frequenciaRespiratoria: 22,
        temperatura: 36.8,
        saturacaoOxigenio: 94,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "155/95 mmHg",
      frequenciaCardiaca: 115,
      frequenciaRespiratoria: 22,
      temperatura: 36.8,
      saturacaoOxigenio: 94,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente ansioso, obeso, diaforético",
        palpacao: "Ictus deslocado, taquicardia",
        ausculta: "Taquicardia, ritmo irregular ocasional",
        percussao: "Normal",
        observacoes: "Sinais de IAM com insuficiência cardíaca incipiente",
        regiao: "Precórdio e geral",
        achados_positivos: ["Taquicardia", "Ictus deslocado", "Diaforese"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Obeso, diaforético",
      palpacao: "Ictus deslocado",
      ausculta: "Taquicardia",
      percussao: "Normal",
      observacoes: "IAM",
    },

    exame_fisico_interativo: {
      cardiovascular: {
        inspecao_precordial: "Diaforese",
        ausculta_cardiaca: "Taquicardia, B1 e B2 audíveis",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "ECG",
        descricao: "Eletrocardiograma",
        resultado: "ST elevado em V1-V4 (IAM anterior)",
        valor_referencia: "Normal",
        interpretacao: "IAM com supra de ST anterior",
      },
      {
        nome: "Troponina I",
        descricao: "Marcador cardíaco",
        resultado: "2.5 ng/mL",
        valor_referencia: "<0.04 ng/mL",
        interpretacao: "Lesão miocárdica aguda",
      },
      {
        nome: "Glicemia",
        descricao: "Glicose em jejum",
        resultado: "180 mg/dL",
        valor_referencia: "<100 mg/dL",
        interpretacao: "Hiperglicemia",
      },
      {
        nome: "Colesterol total",
        descricao: "Lipídios",
        resultado: "285 mg/dL",
        valor_referencia: "<200 mg/dL",
        interpretacao: "Hipercolesterolemia",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Infarto Agudo do Miocárdio com Supra de ST",
        probabilidade: 98,
        criterios_minimos: [
          "Dor torácica típica",
          "ST elevado no ECG",
          "Troponina elevada",
          "Síndrome metabólica",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Angina instável",
        criterios_exclusao: ["ST elevado"],
        achados_que_descartam: ["ECG com supra"],
      },
    ],
    examesIndicados: [
      "ECG seriado",
      "Troponina seriada",
      "Ecocardiograma",
      "Cateterismo coronariano",
      "Lipidograma, glicemia",
    ],

    conduta_esperada: {
      imediata: [
        "Angioplastia primária",
        "Dupla antiagregação",
        "Anticoagulação",
        "Internação em UCO",
      ],
      curto_prazo: [
        "Rehabilitação cardíaca",
        "Controle de fatores de risco",
      ],
      longo_prazo: [
        "Prevenção secundária",
      ],
      encaminhamentos: ["Cardiologia", "UCO"],
    },
    condutaCorreta: "ECG, troponina, angioplastia primária, dupla antiagregação, anticoagulação, UCO",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["ST elevado", "Troponina elevada", "Choque"],
        descricao: "IAM agudo com risco de morte",
        recomendacao: "Angioplastia primária urgente",
      },
    ],

    erros_criticos: [
      {
        erro: "Atrasar revascularização",
        descricao: "Tempo é músculo",
        penalidade: 3,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu IAM",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou ECG urgente",
        realizado: false,
        critico: true,
      },
      {
        item: "Avaliou troponina",
        realizado: false,
        critico: true,
      },
      {
        item: "Encaminhou cardiologia",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de IAM",
        peso: 35,
        descricao: "Clínica e ECG",
        pontuacao_maxima: 35,
      },
      {
        criterio: "Urgência de revascularização",
        peso: 30,
        descricao: "Angioplastia primária",
        pontuacao_maxima: 30,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Dor torácica típica",
          "Síndrome metabólica",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "ST elevado",
          "Troponina elevada",
          "Taquicardia",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["IAM com supra de ST"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "Angioplastia",
          "Dupla antiagregação",
          "Cardiologia",
          "UCO",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu IAM",
        "Solicitou ECG",
        "Encaminhou cardiologia",
      ],
      erros_comuns: ["Atrasar diagnóstico"],
      orientacoes_pedagogicas: [
        "IAM: dor + ST elevado + troponina",
        "Síndrome metabólica é fator de risco",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer IAM e encaminhar urgentemente",
      comunicacao: ["explicou urgência"],
      anamnese: ["investigou fatores de risco"],
      exame_fisico: ["detectou sinais de insuficiência"],
      exames_complementares: ["pediu ECG"],
      raciocinio: ["diagnosticou IAM"],
      conduta: ["encaminhou cardiologia"],
      soap: ["documentou urgência"],
    },

    temaOSCE: "Casos Integradores",
    subtopicosOSCE: [
      "IAM com supra",
      "Síndrome metabólica",
      "Fatores de risco",
      "Angioplastia",
      "Emergência",
    ],
    diagnosticoCorreto: "Infarto Agudo do Miocárdio com Supra de ST",
    ativo: false,    },

  {
    // ====== CASO 59: SEPSE COM CHOQUE SÉPTICO ======
    id: "59",
    titulo: "Sepse com Choque Séptico por Infecção do Trato Urinário",
    sistema: "Infectologia",
    tema: "Casos Integradores",
    nivel: "avancado",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 13,
    objetivo_pedagogico: "Reconhecer sepse/choque séptico e instituir manejo apropriado",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Beatriz Gomez",
      idade: 78,
      sexo: "Feminino",
      queixa_principal: "Confusão mental, febre, pressão baixa",
      historia_breve: "Idosa com ITU evoluindo para sepse",
  },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Sepse com Choque Séptico por Pielonefrite",
      diagnosticos_diferenciais: ["Choque cardiogênico", "Choque hemorrágico", "AVC"],
      sindromes_associadas: ["Insuficiência de múltiplos órgãos"],
    },

    descricaoBreve: "Paciente com febre, hipotensão, taquicardia, lactato elevado, alteração mental",
    categoria: "Casos Integradores",
    paciente: {
      id: "pac-059",
      nome: "Beatriz Gomez",
      idade: 78,
      sexo: "F",
      queixaPrincipal: "Confusão e choque",
      historicoDoenca: "Sintomas há 2 dias",
      antecedentes: ["Sonda vesical"],
      profissao: "Aposentada",
      estado_civil: "Viúva",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Não consigo ficar orientada, tenho muito frio",
      confusao: "Confusa, não sei o dia",
      febre: "Febre muito alta",
      frio: "Calafrios",
      respiracao: "Respiração rápida",
      pressao: "Fraqueza, tontura",
      urina: "Urina com cheiro estranho e cor escura",
    },
    respostaPaciente: {
      inicial: "Confusão e febre",
      confusao: "Sim, desorientada",
      febre: "Muito alta",
      frio: "Sim",
      respiracao: "Rápida",
      pressao: "Muito baixa",
      urina: "Escura e com cheiro",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "85/52 mmHg",
        frequenciaCardiaca: 128,
        frequenciaRespiratoria: 26,
        temperatura: 40.2,
        saturacaoOxigenio: 94,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "85/52 mmHg",
      frequenciaCardiaca: 128,
      frequenciaRespiratoria: 26,
      temperatura: 40.2,
      saturacaoOxigenio: 94,
    },

    exame_fisico: {
      correto: {
        inspecao: "Paciente confusa, extremidades frias, cianose, pele manchada",
        palpacao: "Pulsos filiformes, tempo de enchimento capilar >2s",
        ausculta: "Taquicardia, taquipneia",
        percussao: "Normal",
        observacoes: "Sinais de choque séptico",
        regiao: "Geral",
        achados_positivos: ["Confusão", "Extremidades frias", "Pulsos finos"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Confusa, extremidades frias",
      palpacao: "Pulsos filiformes",
      ausculta: "Taquicardia",
      percussao: "Normal",
      observacoes: "Choque",
    },

    exame_fisico_interativo: {
      geral: {
        coloracao: "Manchado, cianótico",
        consciencia: "Confuso, desorientado",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Lactato",
        descricao: "Marcador de hipoperfusão",
        resultado: "4.2 mmol/L",
        valor_referencia: "<2 mmol/L",
        interpretacao: "Hipoperfusão tissular",
      },
      {
        nome: "Hemograma",
        descricao: "Leucócitos",
        resultado: "18.500/mm³",
        valor_referencia: "<11.000",
        interpretacao: "Leucocitose",
      },
      {
        nome: "Urinálise",
        descricao: "Análise de urina",
        resultado: "Bacteriúria massiva, piúria",
        valor_referencia: "Negativa",
        interpretacao: "ITU",
      },
      {
        nome: "Hemoculturas",
        descricao: "Culturas de sangue",
        resultado: "Grampositivo em pendência",
        valor_referencia: "Negativa",
        interpretacao: "Bacteremia",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Sepse com Choque Séptico",
        probabilidade: 98,
        criterios_minimos: [
          "Febre/hipotermia",
          "Hipotensão",
          "Alteração mental",
          "Lactato elevado",
          "Foco infeccioso (ITU)",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "AVC",
        criterios_exclusao: ["Febre alta", "Choque"],
        achados_que_descartam: ["Lactato elevado"],
      },
    ],
    examesIndicados: [
      "Lactato, hemoculturas",
      "Hemograma, bioquímica",
      "Urinálise e urocultura",
      "PCR, procalcitonina",
      "SOFA score",
    ],

    conduta_esperada: {
      imediata: [
        "CTI/Emergência",
        "Fluidos IV agressivos",
        "Vasopressores se necessário",
        "Antibióticos de amplo espectro",
      ],
      curto_prazo: [
        "Drenagem de foco (sonda vesical)",
        "Monitorização contínua",
      ],
      longo_prazo: [
        "Suporte de órgão",
      ],
      encaminhamentos: ["CTI", "Infectologia"],
    },
    condutaCorreta: "CTI urgente, fluidos IV rápido, vasopressores, antibióticos amplos, drenagem de foco",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["Hipotensão", "Alteração mental", "Lactato >4"],
        descricao: "Choque séptico com risco de morte",
        recomendacao: "CTI com suporte máximo",
      },
    ],

    erros_criticos: [
      {
        erro: "Atrasar fluidos ou antibióticos",
        descricao: "Cada hora aumenta mortalidade",
        penalidade: 3,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu sepse",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou lactato",
        realizado: false,
        critico: true,
      },
      {
        item: "Encaminhou CTI",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de sepse/choque",
        peso: 35,
        descricao: "SIRS + hipotensão",
        pontuacao_maxima: 35,
      },
      {
        criterio: "Urgência do manejo",
        peso: 30,
        descricao: "CTI e antibióticos precoces",
        pontuacao_maxima: 30,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Febre",
          "Confusão",
          "ITU",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Hipotensão",
          "Taquicardia",
          "Lactato elevado",
          "Bacteriúria",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "Choque séptico por ITU",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "CTI",
          "Fluidos IV",
          "Antibióticos",
          "Vasopressores",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu sepse",
        "Solicitou lactato",
        "Encaminhou CTI",
        "Ordenou antibióticos",
      ],
      erros_comuns: ["Achar que é AVC"],
      orientacoes_pedagogicas: [
        "Sepse: febre + hipotensão + alteração mental",
        "Lactato é marcador de hipoperfusão",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer choque e agir rápido",
      comunicacao: ["explicou urgência crítica"],
      anamnese: ["investigou foco infeccioso"],
      exame_fisico: ["detectou sinais de choque"],
      exames_complementares: ["pediu lactato"],
      raciocinio: ["diagnosticou choque séptico"],
      conduta: ["iniciou fluidos e antibióticos"],
      soap: ["documentou urgência"],
    },

    temaOSCE: "Casos Integradores",
    subtopicosOSCE: [
      "Sepse",
      "Choque séptico",
      "Lactato elevado",
      "SIRS",
      "Emergência máxima",
    ],
    diagnosticoCorreto: "Sepse com Choque Séptico",
    ativo: false,    },

  {
    // ====== CASO 60: CETOACIDOSE DIABÉTICA ======
    id: "60",
    titulo: "Cetoacidose Diabética",
    sistema: "Endocrinologia",
    tema: "Casos Integradores",
    nivel: "avancado",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 13,
    objetivo_pedagogico: "Diagnosticar cetoacidose diabética e manejar emergência metabólica",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Lucas Ferreira",
      idade: 18,
      sexo: "Masculino",
      queixa_principal: "Respiração profunda rápida, náusea, dor abdominal, confusão",
      historia_breve: "Adolescente com diabetes tipo 1 de novo diagnóstico",
  },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Cetoacidose Diabética",
      diagnosticos_diferenciais: ["Gastroenterite", "Sepse", "Meningite"],
      sindromes_associadas: ["Acidose metabólica", "Desidratação"],
    },

    descricaoBreve: "Paciente com respiração de Kussmaul, cetose, glicemia >300, pH <7.3, cetonas positivas",
    categoria: "Casos Integradores",
    paciente: {
      id: "pac-060",
      nome: "Lucas Ferreira",
      idade: 18,
      sexo: "M",
      queixaPrincipal: "Distresse respiratório",
      historicoDoenca: "Sintomas agudos há 12 horas",
      antecedentes: ["Diabetes tipo 1 novo"],
      profissao: "Estudante",
      estado_civil: "Solteiro",
      alergias: [],
      medicamentos_em_uso: [],
    },

    respostas_do_paciente: {
      inicial: "Tenho muita dor na barriga, respiração estranho, muito ruim",
      respiracao: "Respiração muito profunda e rápida",
      nausea: "Muita náusea e vômitos",
      dor_abdominal: "Dor intensa no abdômen",
      confusao: "Confuso, tonteado",
      fadiga: "Muito cansado",
      sede: "Muita sede",
    },
    respostaPaciente: {
      inicial: "Distresse respiratório e dor abdominal",
      respiracao: "Profunda e rápida",
      nausea: "Muita",
      dor_abdominal: "Intensa",
      confusao: "Sim",
      fadiga: "Muita",
      sede: "Muita",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "105/65 mmHg",
        frequenciaCardiaca: 125,
        frequenciaRespiratoria: 32,
        temperatura: 37.5,
        saturacaoOxigenio: 95,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "105/65 mmHg",
      frequenciaCardiaca: 125,
      frequenciaRespiratoria: 32,
      temperatura: 37.5,
      saturacaoOxigenio: 95,
    },

    exame_fisico: {
      correto: {
        inspecao: "Respiração de Kussmaul (profunda e rápida), odor de acetona, desidratação",
        palpacao: "Turgor reduzido, abdômen sensível",
        ausculta: "Taquicardia",
        percussao: "Normal",
        observacoes: "Sinais de cetoacidose diabética",
        regiao: "Geral",
        achados_positivos: [
          "Kussmaul",
          "Odor de acetona",
          "Desidratação",
          "Taquicardia",
        ],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Kussmaul, odor de acetona",
      palpacao: "Desidratação",
      ausculta: "Taquicardia",
      percussao: "Normal",
      observacoes: "CAD",
    },

    exame_fisico_interativo: {
      respiratorio: {
        padrao_respiratorio: "Kussmaul",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Glicemia",
        descricao: "Glicose em jejum",
        resultado: "450 mg/dL",
        valor_referencia: "<100 mg/dL",
        interpretacao: "Hiperglicemia severa",
      },
      {
        nome: "Eletrólitos",
        descricao: "Sódio, potássio",
        resultado: "Na 130, K 5.8",
        valor_referencia: "Na 135-145, K 3.5-5.0",
        interpretacao: "Hiponatremia dilucional e hiperkalemia",
      },
      {
        nome: "pH arterial",
        descricao: "Acidose",
        resultado: "7.18",
        valor_referencia: ">7.35",
        interpretacao: "Acidose severa",
      },
      {
        nome: "HCO3",
        descricao: "Bicarbonato",
        resultado: "8 mEq/L",
        valor_referencia: ">24 mEq/L",
        interpretacao: "Acidose metabólica severa",
      },
      {
        nome: "Cetonas",
        descricao: "Corpos cetônicos",
        resultado: "+++ (grandes quantidades)",
        valor_referencia: "Negativa",
        interpretacao: "Cetose severa",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Cetoacidose Diabética",
        probabilidade: 98,
        criterios_minimos: [
          "Glicemia >250",
          "pH <7.3",
          "HCO3 <18",
          "Cetonas positivas",
          "Respiração de Kussmaul",
        ],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Gastroenterite",
        criterios_exclusao: ["Acidose severa", "Cetonas"],
        achados_que_descartam: ["CAD"],
      },
    ],
    examesIndicados: [
      "Gasometria arterial",
      "Eletrólitos seriados",
      "Glicemia seriada",
      "Cetona sérica ou urinária",
      "Hemograma, função renal",
    ],

    conduta_esperada: {
      imediata: [
        "CTI/Emergência",
        "Insulina IV contínua",
        "Fluidos IV agressivos",
        "Reposição de potássio",
      ],
      curto_prazo: [
        "Monitorização contínua",
        "Correção de eletrólitos",
      ],
      longo_prazo: [
        "Educação diabética",
      ],
      encaminhamentos: ["CTI", "Endocrinologia"],
    },
    condutaCorreta: "CTI urgente, insulina IV, fluidos IV rápido, reposição K, gasometria seriada",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["pH <7.1", "Confusão", "Choque"],
        descricao: "CAD severa com risco de morte",
        recomendacao: "CTI com suporte máximo",
      },
    ],

    erros_criticos: [
      {
        erro: "Não reconhecer CAD",
        descricao: "Emergência com alta mortalidade",
        penalidade: 3,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Reconheceu CAD",
        realizado: false,
        critico: true,
      },
      {
        item: "Solicitou gasometria",
        realizado: false,
        critico: true,
      },
      {
        item: "Encaminhou CTI",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de CAD",
        peso: 35,
        descricao: "Kussmaul + acidose",
        pontuacao_maxima: 35,
      },
      {
        criterio: "Manejo de emergência",
        peso: 30,
        descricao: "Insulina IV e fluidos",
        pontuacao_maxima: 30,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Respiração profunda",
          "Náusea",
          "Dor abdominal",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Kussmaul",
          "Glicemia 450",
          "pH 7.18",
          "Cetonas positivas",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "Cetoacidose diabética",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: [
          "CTI",
          "Insulina IV",
          "Fluidos IV",
          "Gasometria seriada",
        ],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Reconheceu CAD",
        "Solicitou gasometria",
        "Encaminhou CTI",
        "Prescreveu insulina",
      ],
      erros_comuns: ["Achar que é gastroenterite"],
      orientacoes_pedagogicas: [
        "CAD: Kussmaul + acidose + glicemia elevada + cetonas",
        "Emergência com mortalidade 5-10% sem tratamento",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecer CAD como emergência máxima",
      comunicacao: ["explicou urgência crítica"],
      anamnese: ["investigou sintomas"],
      exame_fisico: ["detectou Kussmaul"],
      exames_complementares: ["pediu gasometria"],
      raciocinio: ["diagnosticou CAD"],
      conduta: ["encaminhou CTI"],
      soap: ["documentou urgência"],
    },

    temaOSCE: "Casos Integradores",
    subtopicosOSCE: [
      "Cetoacidose diabética",
      "Acidose metabólica",
      "Respiração Kussmaul",
      "Hiperglicemia",
      "Emergência",
    ],
    diagnosticoCorreto: "Cetoacidose Diabética",
    ativo: false,
  },
  ...casosPediatricos,
];
