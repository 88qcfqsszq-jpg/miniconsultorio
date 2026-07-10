import { CasoPediatricoOSCEV2 } from "@/types/caso-pediatrico-osce-v2";

export const casoPed008CardiopatiaCongenitaCianoticaLactenteDe6: CasoPediatricoOSCEV2 = {
  id: "ped-08",
  codigo: "PED-08",
  versao: "3.0.0",

  titulo: "Cardiopatia Congênita Cianótica - Lactente de 6 Meses",
  sistema: "Cardiovascular",
  tema: "Cardiopatia Congênita",
  subtema: "Cardiopatia congênita cianótica",
  nivel: "intermediario",
  tipo_estacao: "integrada",
  tipoPaciente: "pediatrico",
  tempo_osce_minutos: 15,

  objetivo_pedagogico: "Reconhecer cianose central, cardiopatia cianótica, investigação urgente",

  dados_visiveis_ao_estudante: {
    nome_paciente: "Artur",
    idade: 0.5,
    sexo: "Masculino",
    queixa_principal: "Fica roxo ao chorar e mamar",
    historia_breve: "Lactente com episódios de cianose desde primeiras semanas",
    acompanhante: "responsável",
    contexto_atendimento: "Atendimento pediátrico simulado OSCE",
  },

  paciente: {
    id: "pac-ped-08",
    nome: "Artur",
    idade: 0.5,
    sexo: "M",
    tipoPaciente: "pediatrico",
    queixaPrincipal: "Cianose durante choro e esforço",
    historicoDoenca: "Cianose presente desde primeiras semanas, piora com atividade",
    antecedentes: ["Parto a termo"],
    alergias: [],
    medicamentos_em_uso: [],
    dadosPediatricos: {
      idadeMeses: 6,
      faixaEtaria: "lactente",
      responsavel: {
        nome: "Daniela",
        parentesco: "mãe",
      },
      peso: "5.8 kg",
      aberturaResponsavel:
        "Doutora, meu filho fica roxo quando chora ou tenta mamar. Estou muito preocupada.",
    },
  },

  respostasPaciente: {
    inicial: "Mãe: Ele fica roxo, principalmente quando chora ou se exercita.",
    quando: "Mãe: Desde os primeiros meses da vida. Piora quando ele fica agitado.",
    cansaco: "Mãe: Fica cansado facilmente, não consegue brincar por muito tempo.",
  },

  dados_ocultos_do_sistema: {
    diagnostico_principal:
      "Cardiopatia congênita cianótica (possivelmente Tetralogia de Fallot ou TGA)",
    diagnosticos_diferenciais: ["Doença pulmonar", "Sepse"],
    sindromes_associadas: ["Cianose central"],
    criterios_que_sustentam_diagnostico: [
      "Dados da anamnese pediátrica",
      "Interpretação por faixa etária",
      "Achados do exame físico",
      "Sinais vitais interpretados pela idade",
      "Exames complementares quando indicados",
    ],
    objetivoDoExaminador:
      "Avaliar se o estudante conduz o caso pediátrico com segurança, considerando responsável, idade, peso, vacinação, desenvolvimento, sinais de gravidade, exames racionais, dose por peso e orientação familiar.",
    perolas_clinicas: [
      "Pediatria exige interpretação por idade, peso e contexto familiar.",
      "O responsável é parte central da anamnese e da segurança após a consulta.",
      "Sinais de gravidade, hidratação, perfusão e atividade da criança devem ser avaliados ativamente.",
      "Quando há prescrição, a dose deve ser calculada por peso.",
    ],
  },

  sinaisVitais: {
    entrada: {
      momento: "Chegada ao atendimento",
      pressaoArterial: "não aferida",
      frequenciaCardiaca: 134,
      frequenciaRespiratoria: 36,
      temperatura: 36.8,
      saturacaoOxigenio: 82,
      peso: 5.8,
      nivelConsciencia: "avaliar responsividade, interação e irritabilidade",
      perfusao: "avaliar tempo de enchimento capilar, extremidades e pulsos",
      hidratacao: "avaliar mucosas, lágrimas, turgor, diurese e aceitação hídrica",
      atividade: "comparar com habitual segundo responsável",
      trabalhoRespiratorio:
        "avaliar tiragens, batimento de asa nasal, gemência e ausculta quando aplicável",
    },
    referenciaPorIdade: {
      faixaEtaria: "lactente",
      frequenciaCardiacaEsperada:
        "aproximadamente 100-160 bpm, variando com idade, choro, febre e estado clínico",
      frequenciaRespiratoriaEsperada:
        "aproximadamente 30-50 irpm, variando com idade e contexto",
      pressaoArterial:
        "interpretar por idade, sexo e comprimento/estatura; aferir quando indicado e com manguito adequado",
      saturacaoOxigenioEsperada:
        ">= 95% em ar ambiente, salvo cardiopatia cianótica conhecida",
      temperatura: "febre conforme método de aferição e contexto clínico",
      observacao:
        "Em lactentes, alimentação, perfusão, esforço respiratório e ganho ponderal são marcadores importantes de gravidade.",
    },
    interpretacaoInicial:
      "Interpretar sinais vitais pela faixa etária, considerando febre, choro, dor, ansiedade, hipoxemia, perfusão, hidratação e estado geral.",
    evolucao: {
      aposCondutaCorreta_60min: {
        condicoesParaAtivar: [
          "Reconhecimento de gravidade cardiológica",
          "Oximetria e monitorização",
          "ECG/RX/Ecocardiograma quando indicado",
          "Cardiologia pediátrica acionada",
        ],
        interpretacao:
          "Paciente estabilizado para investigação e decisão de internação/encaminhamento especializado.",
      },
      seCondutaInadequadaOuAtrasada: {
        risco:
          "Pode haver piora de insuficiência cardíaca, hipoxemia, baixo débito ou perda de janela diagnóstica.",
      },
    },
    criteriosAltaOuSeguimento: {
      altaSeguraSe: [
        "Bom estado geral",
        "Perfusão preservada",
        "Sem desconforto respiratório importante",
        "SpO2 adequada para idade/contexto",
        "Hidratação adequada ou plano seguro",
        "Responsável compreende sinais de alarme",
        "Possibilidade de retorno se piora",
      ],
      observarOuInvestigarMaisSe: [
        "Prostração importante",
        "Recusa persistente de líquidos",
        "Sinais de desidratação",
        "Sinais respiratórios",
        "Dor persistente ou piora clínica",
        "Dúvida diagnóstica relevante",
        "Responsável inseguro ou dificuldade de retorno",
      ],
      encaminharUrgenciaSe: [
        "Alteração do nível de consciência",
        "Má perfusão ou choque",
        "Hipoxemia",
        "Desconforto respiratório importante",
        "Convulsão",
        "Sinais de risco iminente",
      ],
    },
  },

  antropometria: {
    peso: "5.8 kg",
    comprimentoOuEstatura: "não informado",
    perimetroCefalico: "avaliar conforme idade e indicação",
    percentis: {
      pesoParaIdade: "interpretar em curva apropriada",
      estaturaParaIdade: "interpretar em curva apropriada",
      pesoParaEstatura: "interpretar em curva apropriada",
      perimetroCefalicoParaIdade: "interpretar quando aplicável",
    },
    interpretacao:
      "Antropometria deve ser interpretada em curva por idade e sexo; peso isolado não é suficiente.",
    errosCriticos: [
      "Não pesar a criança",
      "Não interpretar medidas por idade e sexo",
      "Não avaliar tendência de crescimento quando o caso exige",
    ],
  },

  desenvolvimentoNeuropsicomotor: {
    motorGrosso: {
      esperadoParaIdade: ["avaliar marcos compatíveis com lactente"],
      presenteNoCaso: ["usar relato do responsável e observação direta"],
      sinaisAlarme: [
        "perda de marcos",
        "assimetria persistente",
        "hipotonia importante",
        "não progressão dos marcos",
      ],
      interpretacao: "Interpretar conforme idade corrigida quando aplicável.",
    },
    motorFinoAdaptativo: {
      esperadoParaIdade: ["preensão/manipulação adequadas para idade"],
      presenteNoCaso: ["avaliar interação com brinquedos e objetos"],
      sinaisAlarme: ["não usar mãos", "assimetria importante", "perda de habilidade"],
      interpretacao: "Avaliar junto com desenvolvimento global.",
    },
    linguagem: {
      esperadoParaIdade: ["balbucio, palavras ou frases conforme idade"],
      presenteNoCaso: ["extrair do relato do responsável"],
      sinaisAlarme: [
        "ausência de resposta a sons",
        "perda de linguagem",
        "ausência de interação",
      ],
      interpretacao:
        "Linguagem deve ser interpretada em conjunto com audição e interação social.",
    },
    social: {
      esperadoParaIdade: ["interação social compatível com idade"],
      presenteNoCaso: ["observar contato visual, brincadeira e vínculo com responsável"],
      sinaisAlarme: [
        "perda de interação",
        "ausência de contato visual persistente",
        "isolamento extremo",
      ],
      interpretacao: "Domínio social é parte da avaliação pediátrica.",
    },
    conclusao:
      "Desenvolvimento deve ser avaliado por domínios e comparado com a faixa etária, evitando diagnóstico precipitado sem sinais de alarme.",
  },

  exameFisico: {
    abordagem: {
      preparo:
        "Observar a criança inicialmente no colo ou junto ao responsável, quando possível, antes de manipular.",
      comunicacao:
        "Explicar ao responsável e usar linguagem adequada à idade da criança.",
    },
    achadosOriginais: {
      geral: {
        coloracao: "Cianose central em lábios e língua",
      },
    },
    impressaoGeral: {
      estadoGeral: "avaliar atividade, interação, choro, consolabilidade e toxemia",
      hidratacao: "avaliar mucosas, lágrimas, turgor e diurese",
      perfusao: "avaliar TEC, pulsos e extremidades",
      coloracao: "avaliar palidez, cianose, icterícia, petéquias ou púrpura",
    },
    pele: {
      avaliacao:
        "procurar exantema, petéquias, púrpura, lesões traumáticas ou sinais de infecção",
    },
    cabecaPescoco: {
      avaliacao:
        "avaliar orofaringe, otoscopia quando indicada, linfonodos, fontanela em lactentes e rigidez de nuca quando aplicável",
    },
    respiratorio: {
      avaliacao:
        "avaliar FR por idade, esforço respiratório, tiragens, ausculta e saturação",
    },
    cardiovascular: {
      avaliacao:
        "avaliar perfusão, pulsos, ausculta, sopros e sinais de insuficiência cardíaca quando aplicável",
    },
    abdomen: {
      avaliacao:
        "avaliar dor, distensão, visceromegalias, massas e sinais de irritação peritoneal",
    },
    neurologico: {
      avaliacao:
        "avaliar consciência, irritabilidade, sinais meníngeos, força/tônus e marcos quando aplicável",
    },
    achadosChave: [
      "interpretar achados de acordo com idade",
      "procurar sinais de gravidade",
      "correlacionar exame físico com queixa e hipótese principal",
    ],
    achadosNegativosImportantes: [
      "ausência de sinais de choque",
      "ausência de desconforto respiratório grave",
      "ausência de alteração importante do nível de consciência",
      "ausência de desidratação grave, salvo se descrito no caso",
    ],
  },

  exames: {
    logicaDeSolicitacao:
      "Em pediatria, exames dependem de idade, estado geral, sinais de gravidade, hipótese diagnóstica, vacinação, exame físico, possibilidade de retorno e se o resultado muda conduta.",

    complementaresOriginais: [
      {
        nome: "Ecocardiograma",
        descricao: "Ultrassom cardíaco",
        resultado:
          "Tetralogia de Fallot com comunicação interventricular e obstrução de via de saída RV",
        valor_referencia: "Sem alterações",
        interpretacao: "Cardiopatia cianótica com anatomia de TOF",
      },
      {
        nome: "RX Tórax",
        descricao: "Radiografia torácica",
        resultado: "Coração em bota, redução de vascularização pulmonar",
        valor_referencia: "Normal",
        interpretacao: "Padrão radiológico compatível com TOF",
      },
    ],

    beiraLeito: {
      oximetria: {
        solicitadoPor: ["oximetria", "saturação", "SpO2", "saturação de oxigênio"],
        disponivel: true,
        prioridade: "importante",
        resultado: "SpO2 82% em ar ambiente",
        interpretacao:
          "Hipoxemia importante para a idade, compatível com cardiopatia congênita cianótica. Saturação reduzida persistente exige investigação e avaliação cardiológica urgente.",
      },
      glicemiaCapilar: {
        solicitadoPor: ["glicemia", "glicemia capilar", "dextro"],
        disponivel: true,
        prioridade: "condicional",
        resultado: "Glicemia capilar 86 mg/dL",
        interpretacao:
          "Glicemia dentro da faixa esperada. Útil se houver prostração, baixa ingesta, alteração de consciência ou lactente pequeno.",
      },
    },

    laboratoriais: {
      hemograma: {
        solicitadoPor: ["hemograma", "hemograma completo"],
        disponivel: true,
        prioridade: "condicional",
        resultado: "Hemograma sem alterações hematológicas relevantes no momento.",
        interpretacao:
          "Hemograma não confirma nem exclui cardiopatia congênita cianótica. Em cianose crônica pode haver tendência à policitemia, mas neste lactente os valores estão dentro da faixa esperada.",
        valores: {
          hemoglobina: "12,4 g/dL",
          hematocrito: "37%",
          leucocitos: "9.500/mm³",
          neutrofilos: "3.800/mm³",
          linfocitos: "4.900/mm³",
          plaquetas: "285.000/mm³",
        },
      },

      gasometria: {
        solicitadoPor: [
          "gasometria",
          "gasometria arterial",
          "gasometria venosa",
          "pH",
          "pO2",
          "pCO2",
          "lactato",
          "saturação",
          "saturacao",
          "SatO2",
          "SpO2",
        ],
        disponivel: true,
        prioridade: "importante",
        resultado: "Gasometria compatível com hipoxemia importante.",
        interpretacao:
          "pO2 e saturação reduzidas. Ausência de acidose grave e lactato normal sugerem que, apesar da hipoxemia, não há evidência laboratorial de choque no momento.",
        valores: {
          pH: "7,39",
          pCO2: "34 mmHg",
          pO2: "38 mmHg",
          bicarbonato: "22 mEq/L",
          saturacaoO2: "78%",
          lactato: "1,4 mmol/L",
        },
      },
    },
  },

  prescricaoPediatrica: {
    pesoBase: "5.8 kg",
    pesoKg: 5.8,
    medicamentosPermitidos: [
      {
        nome: "Não há prescrição medicamentosa obrigatória inicial",
        indicacao: "Caso centrado em avaliação, orientação, investigação ou encaminhamento",
        dosePorPeso: "não aplicável",
        doseCalculadaParaOCaso: "não aplicável",
        via: "não aplicável",
        intervalo: "não aplicável",
        observacao: "Se analgesia/antitérmico for necessário, calcular sempre pelo peso.",
      },
    ],
    medicamentosContraindicadosOuEvitar: [],
    errosDeDoseCriticos: [
      "Prescrever dose de adulto",
      "Não calcular dose pelo peso",
      "Não explicar intervalo e dose máxima quando aplicável",
    ],
  },

  protecaoInfantil: { aplicavel: false },

  arbovirosePediatrica: { aplicavel: false },

  cardiologiaPediatrica: {
    aplicavel: true,
    sinaisDeInsuficienciaCardiacaLactente: [
      "cansaço às mamadas",
      "sudorese cefálica",
      "pausas para respirar",
      "baixo ganho ponderal",
      "taquipneia",
      "hepatomegalia",
      "sopro",
    ],
    sinaisDeCardiopatiaCianotica: [
      "cianose central",
      "saturação baixa persistente",
      "baqueteamento",
      "piora com choro ou mamada",
    ],
    examesChave: ["oximetria", "ECG", "raio x de tórax", "ecocardiograma"],
    condutaSegura: [
      "avaliar gravidade",
      "suporte se desconforto respiratório ou hipoxemia",
      "acionar cardiologia pediátrica quando indicado",
      "considerar internação se congestão, cianose importante ou baixo ganho ponderal",
    ],
    criteriosInternacao: [
      "hipoxemia",
      "sinais de insuficiência cardíaca",
      "baixo ganho ponderal importante",
      "má perfusão",
      "desconforto respiratório",
    ],
  },

  diagnostico: {
    principal: "Cardiopatia congênita cianótica",
    categoria: "Cardiopatia Congênita",
    hipotesesOriginais: [
      {
        diagnostico: "Cardiopatia congênita cianótica",
        probabilidade: 95,
        criterios_minimos: [
          "Cianose central",
          "Baqueteamento",
          "Saturação reduzida",
          "Sopro",
        ],
      },
    ],
    criteriosQueSustentam: [
      "história clínica pediátrica",
      "dados do responsável",
      "sinais vitais por idade",
      "exame físico direcionado",
      "exames complementares quando indicados",
    ],
    diferenciais: ["Doença pulmonar", "Sepse"],
  },

  condutaEsperada: {
    condutaOriginal: {
      imediata: [
        "Reconhecer urgência",
        "Oxigenio se necessário",
        "Referência cardiologia pediátrica imediata",
      ],
      curto_prazo: ["Avaliação para cirurgia"],
      longo_prazo: ["Acompanhamento cardiológico regular", "Cirurgia reparadora"],
      encaminhamentos: ["Cardiologia pediátrica urgente", "Possível cirurgia"],
    },
    imediata: [
      "avaliar gravidade e estabilidade",
      "corrigir problemas urgentes",
      "conduzir hipótese principal",
      "usar dose por peso quando houver prescrição",
      "orientar responsável",
    ],
    examesQuandoIndicados: [
      "solicitar apenas exames que mudem conduta ou classifiquem gravidade",
      "interpretar resultados pela idade e contexto",
    ],
    orientacoesResponsavel: [
      "explicar diagnóstico provável e incertezas",
      "orientar sinais de alarme",
      "explicar medicações e doses quando houver",
      "definir retorno ou seguimento",
    ],
    destino:
      "definir alta, observação, internação, encaminhamento especializado ou rede de proteção conforme gravidade e segurança",
    evitar: [
      "usar dose de adulto",
      "ignorar sinais de gravidade",
      "dar alta sem orientação clara",
      "prescrever antibiótico/medicação sem indicação",
    ],
  },

  criteriosGravidadePediatricos: {
    classificacaoInicial: "interpretar conforme idade, estado geral e dados do caso",
    criteriosOriginais: [
      {
        severidade: "grave",
        sinais: ["Cianose central", "Saturação < 85%"],
        descricao: "Cardiopatia cianótica complexa",
        recomendacao: "Encaminhamento urgente a centro de cirurgia cardíaca pediátrica",
      },
    ],
    sinaisPresentesNoCaso: ["usar dados do caso para classificar risco"],
    sinaisDeAlarmeParaRetorno: [
      "sonolência excessiva ou confusão",
      "irritabilidade inconsolável",
      "má perfusão",
      "dificuldade respiratória",
      "saturação baixa",
      "recusa persistente de líquidos",
      "redução importante da diurese",
      "convulsão",
      "manchas roxas ou petéquias",
      "piora progressiva do estado geral",
    ],
    sinaisDeRiscoIminente: [
      "choque",
      "hipoxemia",
      "alteração do nível de consciência",
      "desconforto respiratório importante",
      "cianose central",
      "desidratação grave",
    ],
    recomendacao:
      "Classificar gravidade, decidir observação/encaminhamento e orientar retorno de forma segura.",
  },

  errosCriticos: [
    {
      erro: "Não reconhecer cianose como sinal de cardiopatia",
      descricao: "Cianose central exige investigação urgente",
      penalidade: 3,
      evitavel: true,
    },
  ],

  feedbackDetalhado: {
    escala: {
      total: 20,
      minimoAprovacao: 17,
    },
    dominios: [
      {
        nome: "Comunicação pediátrica",
        pontos: 2,
        criterios: [
          { item: "Acolheu o responsável e a criança", pontos: 0.4 },
          { item: "Usou linguagem adequada à idade", pontos: 0.4 },
          { item: "Explicou avaliação e conduta ao responsável", pontos: 0.4 },
          { item: "Orientou sinais de alarme de forma clara", pontos: 0.5, critico: true },
          { item: "Checou compreensão do responsável", pontos: 0.3 },
        ],
      },
      {
        nome: "Anamnese pediátrica dirigida",
        pontos: 3,
        criterios: [
          { item: "Caracterizou queixa, início, duração e evolução", pontos: 0.6 },
          { item: "Investigou sintomas associados por sistemas", pontos: 0.6 },
          {
            item: "Investigou ingesta, diurese, evacuações, sono/atividade e hidratação",
            pontos: 0.6,
            critico: true,
          },
          {
            item: "Verificou vacinação, antecedentes, alergias, medicamentos e contexto familiar",
            pontos: 0.6,
          },
          { item: "Investigou sinais de gravidade e diferenciais perigosos", pontos: 0.6, critico: true },
        ],
      },
      {
        nome: "Interpretação por faixa etária e exame físico",
        pontos: 4,
        criterios: [
          { item: "Interpretou sinais vitais pela idade", pontos: 0.8, critico: true },
          { item: "Avaliou estado geral, consciência, perfusão e hidratação", pontos: 0.8, critico: true },
          { item: "Realizou exame físico direcionado e completo para a hipótese", pontos: 1.0 },
          { item: "Identificou achados negativos importantes", pontos: 0.6 },
          { item: "Classificou gravidade e necessidade de observação/encaminhamento", pontos: 0.8, critico: true },
        ],
      },
      {
        nome: "Sinais cardiológicos pediátricos e encaminhamento",
        pontos: 3,
        criterios: [
          { item: "Aplicou estrutura pediátrica específica do caso", pontos: 1.0, critico: true },
          { item: "Usou peso, idade, vacinação/desenvolvimento ou segurança conforme o cenário", pontos: 0.8 },
          { item: "Reconheceu sinais de alerta próprios da pediatria", pontos: 0.7 },
          { item: "Evitou condutas adultocêntricas ou genéricas", pontos: 0.5 },
        ],
      },
      {
        nome: "Exames complementares racionais",
        pontos: 2,
        criterios: [
          { item: "Solicitou exames que mudam conduta", pontos: 0.5 },
          { item: "Evitou exames indiscriminados em criança estável", pontos: 0.4 },
          { item: "Interpretou resultados conforme idade e contexto", pontos: 0.6 },
          { item: "Não atrasou conduta urgente por exame não essencial", pontos: 0.5, critico: true },
        ],
      },
      {
        nome: "Conduta, dose por peso e segurança",
        pontos: 6,
        criterios: [
          { item: "Definiu conduta imediata correta para gravidade", pontos: 1.2, critico: true },
          { item: "Considerou dose por peso quando houve medicação", pontos: 0.9, critico: true },
          { item: "Monitorou ou reavaliou resposta quando aplicável", pontos: 0.8 },
          { item: "Definiu destino seguro", pontos: 0.9, critico: true },
          { item: "Orientou responsável sobre cuidados domiciliares e retorno", pontos: 1.0, critico: true },
          { item: "Planejou seguimento/encaminhamento apropriado", pontos: 0.7 },
          { item: "Evitou condutas potencialmente danosas", pontos: 0.5 },
        ],
      },
    ],
    penalidadesAutomaticas: [
      {
        condicao: "Não avaliou sinais de gravidade",
        penalidade: 3,
        justificativa:
          "Em pediatria, gravidade pode ser sutil e deve ser buscada ativamente.",
      },
      {
        condicao: "Não orientou sinais de alarme ao responsável",
        penalidade: 3,
        justificativa:
          "A segurança após a consulta depende da compreensão do responsável.",
      },
      {
        condicao: "Prescreveu medicamento sem calcular por peso quando aplicável",
        penalidade: 3,
        justificativa:
          "Dose pediátrica inadequada pode causar falha terapêutica ou toxicidade.",
      },
      {
        condicao: "Ignorou dados próprios da idade, vacinação, crescimento ou desenvolvimento",
        penalidade: 2,
        justificativa:
          "Pediatria exige interpretação por faixa etária e contexto.",
      },
    ],
  },

  modeloSOAP: {
    subjetivo: {
      secao: "S",
      componentes_obrigatorios: ["Cianose desde nascimento", "Piora com esforço"],
    },
    objetivo: {
      secao: "O",
      componentes_obrigatorios: ["Cianose central", "Saturação reduzida", "Ecocardiograma"],
    },
    avaliacao: {
      secao: "A",
      componentes_obrigatorios: ["Cardiopatia congênita cianótica"],
    },
    plano: {
      secao: "P",
      componentes_obrigatorios: ["Referência cardiologia urgente", "Cirurgia"],
    },
  },

  feedbackModelo: {
    acertos_esperados: [
      "Reconhecimento imediato",
      "Ecocardiograma urgente",
      "Referência apropriada",
    ],
    erros_comuns: ["Atraso no diagnóstico", "Não reconhecer urgência"],
    orientacoes_pedagogicas: [
      "Cianose central é urgência",
      "Ecocardiograma é diagnóstico",
      "Cirurgia é salvadora",
    ],
  },

  checklistOcultoExaminador: {
    oQueProfessorQuer: "Reconhecimento rápido e ação urgente",
    exame_fisico: ["reconheceu cianose"],
    raciocinio: ["formulou diagnóstico correto"],
    conduta: ["referiu adequadamente"],
  },

  temaOSCE: "Pediatria - Cardiopatia Congênita",
  subtopicosOSCE: ["Cianose", "Cardiopatia", "Urgência"],

  diagnosticoCorreto: "Cardiopatia congênita cianótica",
  ativo: true,
} as CasoPediatricoOSCEV2;