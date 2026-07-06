import { CasoPediatricoOSCEV2 } from "@/types/caso-pediatrico-osce-v2";

export const casoPed003AvaliacaoDePressaoArterialMeninaDe: CasoPediatricoOSCEV2 = {
  id: "ped-03",
  codigo: "PED-03",
  versao: "3.0.0",

  titulo: "Avaliação de Pressão Arterial - Menina de 4 Anos",
  sistema: "Cardiovascular",
  tema: "Hipertensão em Pediatria",
  subtema: "Pressão arterial elevada para a idade",
  nivel: "iniciante",
  tipo_estacao: "integrada",
  tipoPaciente: "pediatrico",
  tempo_osce_minutos: 10,

  objetivo_pedagogico: "Técnica correta de medida de PA em criança, interpretação por idade/sexo/estatura",

  dados_visiveis_ao_estudante: {
    ...{
      nome_paciente: "Ana",
      idade: 4,
      sexo: "Feminino",
      queixa_principal: "Consulta de rotina",
      historia_breve: "Mãe relata PA elevada na avaliação anterior"
},
    acompanhante: "responsável",
    contexto_atendimento: "Atendimento pediátrico simulado OSCE"
},

  paciente: {
      id: "pac-ped-03",
      nome: "Ana",
      idade: 4,
      sexo: "F",
      tipoPaciente: "pediatrico",
      queixaPrincipal: "Avaliação de pressão arterial",
      historicoDoenca: "PA elevada em avaliação anterior",
      antecedentes: [],
      alergias: [],
      medicamentos_em_uso: [],
      dadosPediatricos: {
        idadeAnos: 4,
        faixaEtaria: "pre_escolar",
        responsavel: {
          nome: "Fernanda",
          parentesco: "mãe"
},
        peso: "17 kg",
        estatura: "102 cm",
        estadoVacinal: "em dia",
        aberturaResponsavel: "Doutora, a pressão da Ana estava alta na consulta anterior. Gostaria que avaliasse novamente com cuidado."
}
},

  respostasPaciente: {
      inicial: "Mãe: Ela está bem, sem queixa.",
      sintomas: "Mãe: Não tem nada, só a pressão que preocupou."
},

  dados_ocultos_do_sistema: {
    ...{
      diagnostico_principal: "Pressão arterial elevada para a idade",
      diagnosticos_diferenciais: ["Hipertensão primária", "Hipertensão secundária"],
      sindromes_associadas: []
},
    criterios_que_sustentam_diagnostico: [
      "Dados da anamnese pediátrica",
      "Interpretação por faixa etária",
      "Achados do exame físico",
      "Sinais vitais interpretados pela idade",
      "Exames complementares quando indicados"
],
    objetivoDoExaminador:
      "Avaliar se o estudante conduz o caso pediátrico com segurança, considerando responsável, idade, peso, vacinação, desenvolvimento, sinais de gravidade, exames racionais, dose por peso e orientação familiar.",
    perolas_clinicas: [
      "Pediatria exige interpretação por idade, peso e contexto familiar.",
      "O responsável é parte central da anamnese e da segurança após a consulta.",
      "Sinais de gravidade, hidratação, perfusão e atividade da criança devem ser avaliados ativamente.",
      "Quando há prescrição, a dose deve ser calculada por peso."
]
},

  sinaisVitaisPediatricos: {
    entrada: {
      momento: "Chegada ao atendimento",
      pressaoArterial: "108/70 mmHg",
      frequenciaCardiaca: 96,
      frequenciaRespiratoria: 24,
      temperatura: 36.8,
      saturacaoOxigenio: 98,
      peso: undefined,
      nivelConsciencia: "avaliar responsividade, interação e irritabilidade",
      perfusao: "avaliar tempo de enchimento capilar, extremidades e pulsos",
      hidratacao: "avaliar mucosas, lágrimas, turgor, diurese e aceitação hídrica",
      atividade: "comparar com habitual segundo responsável",
      trabalhoRespiratorio: "avaliar tiragens, batimento de asa nasal, gemência e ausculta quando aplicável"
},
    referenciaPorIdade: {
      faixaEtaria: "pré-escolar",
      frequenciaCardiacaEsperada: "aproximadamente 80-120 bpm em repouso, podendo subir com febre, choro e dor",
      frequenciaRespiratoriaEsperada: "aproximadamente 20-30 irpm",
      pressaoArterial: "interpretar por idade, sexo e estatura; usar manguito adequado",
      saturacaoOxigenioEsperada: ">= 95% em ar ambiente",
      temperatura: "febre quando >= 37,8-38,0 °C conforme método de aferição",
      observacao: "Estado geral, hidratação, perfusão e interação com responsável são essenciais."
},
    interpretacaoInicial:
      "Interpretar sinais vitais pela faixa etária, considerando febre, choro, dor, ansiedade, hipoxemia, perfusão, hidratação e estado geral.",
    evolucao: {
      aposCondutaCorreta: {
        condicoesParaAtivar: [
          "Avaliação pediátrica completa",
          "Interpretação por idade",
          "Orientação do responsável",
          "Plano de seguimento definido"
],
        respostaResponsavel: "responsável compreende avaliação, sinais de alerta e próximo acompanhamento",
        interpretacao: "Caso eletivo/ambulatorial com foco em avaliação longitudinal, não em estabilização aguda."
},
      seCondutaInadequadaOuAtrasada: {
        risco: "Perda de oportunidade de identificar alteração de crescimento, desenvolvimento, pressão arterial ou orientação familiar."
}
},
    criteriosAltaOuSeguimento: {
      altaSeguraSe: [
        "Bom estado geral",
        "Perfusão preservada",
        "Sem desconforto respiratório importante",
        "SpO2 adequada para idade/contexto",
        "Hidratação adequada ou plano seguro",
        "Responsável compreende sinais de alarme",
        "Possibilidade de retorno se piora"
],
      observarOuInvestigarMaisSe: [
        "Prostração importante",
        "Recusa persistente de líquidos",
        "Sinais de desidratação",
        "Sinais respiratórios",
        "Dor persistente ou piora clínica",
        "Dúvida diagnóstica relevante",
        "Responsável inseguro ou dificuldade de retorno"
],
      encaminharUrgenciaSe: [
        "Alteração do nível de consciência",
        "Má perfusão ou choque",
        "Hipoxemia",
        "Desconforto respiratório importante",
        "Convulsão",
        "Sinais de risco iminente"
]
}
},

  antropometria: undefined,

  desenvolvimentoNeuropsicomotor: undefined,

  exameFisicoPediatrico: {
    abordagem: {
      preparo:
        "Observar a criança inicialmente no colo ou junto ao responsável, quando possível, antes de manipular.",
      comunicacao:
        "Explicar ao responsável e usar linguagem adequada à idade da criança."
},
    achadosOriginais: {},
    impressaoGeral: {
      estadoGeral: "avaliar atividade, interação, choro, consolabilidade e toxemia",
      hidratacao: "avaliar mucosas, lágrimas, turgor e diurese",
      perfusao: "avaliar TEC, pulsos e extremidades",
      coloracao: "avaliar palidez, cianose, icterícia, petéquias ou púrpura"
},
    pele: {
      avaliacao: "procurar exantema, petéquias, púrpura, lesões traumáticas ou sinais de infecção"
},
    cabecaPescoco: {
      avaliacao: "avaliar orofaringe, otoscopia quando indicada, linfonodos, fontanela em lactentes e rigidez de nuca quando aplicável"
},
    respiratorio: {
      avaliacao: "avaliar FR por idade, esforço respiratório, tiragens, ausculta e saturação"
},
    cardiovascular: {
      avaliacao: "avaliar perfusão, pulsos, ausculta, sopros e sinais de insuficiência cardíaca quando aplicável"
},
    abdomen: {
      avaliacao: "avaliar dor, distensão, visceromegalias, massas e sinais de irritação peritoneal"
},
    neurologico: {
      avaliacao: "avaliar consciência, irritabilidade, sinais meníngeos, força/tônus e marcos quando aplicável"
},
    achadosChave: [
      "interpretar achados de acordo com idade",
      "procurar sinais de gravidade",
      "correlacionar exame físico com queixa e hipótese principal"
],
    achadosNegativosImportantes: [
      "ausência de sinais de choque",
      "ausência de desconforto respiratório grave",
      "ausência de alteração importante do nível de consciência",
      "ausência de desidratação grave, salvo se descrito no caso"
]
},

  exames: {
    logicaDeSolicitacao:
      "Em pediatria, exames dependem de idade, estado geral, sinais de gravidade, hipótese diagnóstica, vacinação, exame físico, possibilidade de retorno e se o resultado muda conduta.",
    complementaresOriginais: [],
    beiraLeito: {
      oximetria: {
        solicitadoPor: ["oximetria", "saturação", "SpO2"],
        disponivel: true,
        prioridade: "importante",
        resultado: "Conforme sinais vitais do caso",
        interpretacao: "Útil para detectar hipoxemia e classificar gravidade."
},
      glicemiaCapilar: {
        solicitadoPor: ["glicemia", "glicemia capilar"],
        disponivel: true,
        prioridade: "condicional",
        resultado: "Normal se criança sem alteração de consciência ou baixa ingesta importante",
        interpretacao: "Usar se prostração importante, lactente pequeno, baixa ingesta ou alteração de consciência."
}
},
    laboratoriais: {
      hemograma: {
        solicitadoPor: ["hemograma", "hemograma completo"],
        disponivel: true,
        prioridade: "condicional",
        resultado: "Interpretar conforme idade e contexto clínico",
        interpretacao: "Exame deve ser solicitado quando muda conduta ou ajuda na classificação de gravidade.",
        valores: { hemoglobina: "12,4 g/dL", leucocitos: "9.500/mm³", plaquetas: "285.000/mm³" }
}
}
},

  prescricaoPediatrica: {
    pesoBase: "17 kg",
    pesoKg: 17,
    medicamentosPermitidos: [
      {
        nome: "Não há prescrição medicamentosa obrigatória inicial",
        indicacao: "Caso centrado em avaliação, orientação, investigação ou encaminhamento",
        dosePorPeso: "não aplicável",
        doseCalculadaParaOCaso: "não aplicável",
        via: "não aplicável",
        intervalo: "não aplicável",
        observacao: "Se analgesia/antitérmico for necessário, calcular sempre pelo peso."
}
    ],
    medicamentosContraindicadosOuEvitar: [
      
    ],
    errosDeDoseCriticos: ["Prescrever dose de adulto", "Não calcular dose pelo peso", "Não explicar intervalo e dose máxima quando aplicável"]
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
      "sopro"
],
    sinaisDeCardiopatiaCianotica: [
      "cianose central",
      "saturação baixa persistente",
      "baqueteamento",
      "piora com choro ou mamada"
],
    examesChave: ["oximetria", "ECG", "raio x de tórax", "ecocardiograma"],
    condutaSegura: [
      "avaliar gravidade",
      "suporte se desconforto respiratório ou hipoxemia",
      "acionar cardiologia pediátrica quando indicado",
      "considerar internação se congestão, cianose importante ou baixo ganho ponderal"
],
    criteriosInternacao: [
      "hipoxemia",
      "sinais de insuficiência cardíaca",
      "baixo ganho ponderal importante",
      "má perfusão",
      "desconforto respiratório"
]
},

  diagnostico: {
    principal: "Pressão arterial elevada para a idade",
    categoria: "Hipertensão em Pediatria",
    hipotesesOriginais: [
      {
        diagnostico: "Pressão arterial elevada",
        probabilidade: 80,
        criterios_minimos: ["PA sistólica > percentil 95 para idade/sexo/estatura"]
}
],
    criteriosQueSustentam: [
      "história clínica pediátrica",
      "dados do responsável",
      "sinais vitais por idade",
      "exame físico direcionado",
      "exames complementares quando indicados"
],
    diferenciais: ["Hipertensão primária", "Hipertensão secundária"]
},

  condutaEsperada: {
    condutaOriginal: {
      imediata: ["Medir PA em repouso", "Usar manguito adequado (40% da circunferência", "Comparar com tabelas de percentil"],
      curto_prazo: ["Orientar acompanhamento"],
      longo_prazo: ["Monitoramento regular de PA"],
      encaminhamentos: ["Cardiologia pediátrica se PA persistentemente elevada"]
},
    imediata: [
      "avaliar gravidade e estabilidade",
      "corrigir problemas urgentes",
      "conduzir hipótese principal",
      "usar dose por peso quando houver prescrição",
      "orientar responsável"
],
    examesQuandoIndicados: [
      "solicitar apenas exames que mudem conduta ou classifiquem gravidade",
      "interpretar resultados pela idade e contexto"
],
    orientacoesResponsavel: [
      "explicar diagnóstico provável e incertezas",
      "orientar sinais de alarme",
      "explicar medicações e doses quando houver",
      "definir retorno ou seguimento"
],
    destino:
      "definir alta, observação, internação, encaminhamento especializado ou rede de proteção conforme gravidade e segurança",
    evitar: [
      "usar dose de adulto",
      "ignorar sinais de gravidade",
      "dar alta sem orientação clara",
      "prescrever antibiótico/medicação sem indicação"
]
},

  criteriosGravidadePediatricos: {
    classificacaoInicial: "interpretar conforme idade, estado geral e dados do caso",
    criteriosOriginais: [
      {
        severidade: "leve",
        sinais: ["PA elevada uma vez"],
        descricao: "Pode ser por ansiedade",
        recomendacao: "Repetir medida"
}
],
    sinaisPresentesNoCaso: [
      "usar dados do caso para classificar risco"
],
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
      "piora progressiva do estado geral"
],
    sinaisDeRiscoIminente: [
      "choque",
      "hipoxemia",
      "alteração do nível de consciência",
      "desconforto respiratório importante",
      "cianose central",
      "desidratação grave"
],
    recomendacao:
      "Classificar gravidade, decidir observação/encaminhamento e orientar retorno de forma segura."
},

  errosCriticos: [
      {
        erro: "Usar manguito inadequado",
        descricao: "Manguito incorreto gera medidas falsas",
        penalidade: 2,
        evitavel: true
}
],

  feedbackDetalhado: {
    escala: {
      total: 20,
      minimoAprovacao: 17
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
          { item: "Checou compreensão do responsável", pontos: 0.3 }
]
},
      {
        nome: "Anamnese pediátrica dirigida",
        pontos: 3,
        criterios: [
          { item: "Caracterizou queixa, início, duração e evolução", pontos: 0.6 },
          { item: "Investigou sintomas associados por sistemas", pontos: 0.6 },
          { item: "Investigou ingesta, diurese, evacuações, sono/atividade e hidratação", pontos: 0.6, critico: true },
          { item: "Verificou vacinação, antecedentes, alergias, medicamentos e contexto familiar", pontos: 0.6 },
          { item: "Investigou sinais de gravidade e diferenciais perigosos", pontos: 0.6, critico: true }
]
},
      {
        nome: "Interpretação por faixa etária e exame físico",
        pontos: 4,
        criterios: [
          { item: "Interpretou sinais vitais pela idade", pontos: 0.8, critico: true },
          { item: "Avaliou estado geral, consciência, perfusão e hidratação", pontos: 0.8, critico: true },
          { item: "Realizou exame físico direcionado e completo para a hipótese", pontos: 1.0 },
          { item: "Identificou achados negativos importantes", pontos: 0.6 },
          { item: "Classificou gravidade e necessidade de observação/encaminhamento", pontos: 0.8, critico: true }
]
},
      {
        nome: "Crescimento/desenvolvimento/vacinação quando aplicável",
        pontos: 3,
        criterios: [
          { item: "Aplicou estrutura pediátrica específica do caso", pontos: 1.0, critico: true },
          { item: "Usou peso, idade, vacinação/desenvolvimento ou segurança conforme o cenário", pontos: 0.8 },
          { item: "Reconheceu sinais de alerta próprios da pediatria", pontos: 0.7 },
          { item: "Evitou condutas adultocêntricas ou genéricas", pontos: 0.5 }
]
},
      {
        nome: "Exames complementares racionais",
        pontos: 2,
        criterios: [
          { item: "Solicitou exames que mudam conduta", pontos: 0.5 },
          { item: "Evitou exames indiscriminados em criança estável", pontos: 0.4 },
          { item: "Interpretou resultados conforme idade e contexto", pontos: 0.6 },
          { item: "Não atrasou conduta urgente por exame não essencial", pontos: 0.5, critico: true }
]
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
          { item: "Evitou condutas potencialmente danosas", pontos: 0.5 }
]
}
],
    penalidadesAutomaticas: [
      {
        condicao: "Não avaliou sinais de gravidade",
        penalidade: 3,
        justificativa: "Em pediatria, gravidade pode ser sutil e deve ser buscada ativamente."
},
      {
        condicao: "Não orientou sinais de alarme ao responsável",
        penalidade: 3,
        justificativa: "A segurança após a consulta depende da compreensão do responsável."
},
      {
        condicao: "Prescreveu medicamento sem calcular por peso quando aplicável",
        penalidade: 3,
        justificativa: "Dose pediátrica inadequada pode causar falha terapêutica ou toxicidade."
},
      {
        condicao: "Ignorou dados próprios da idade, vacinação, crescimento ou desenvolvimento",
        penalidade: 2,
        justificativa: "Pediatria exige interpretação por faixa etária e contexto."
}
]
},

  modeloSOAP: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: ["Queixa atual", "Sintomas de alerta"]
},
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["PA com técnica adequada", "Medidas em repouso"]
},
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["PA comparada com percentil"]
},
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Acompanhamento", "Investigação se necessária"]
}
},

  feedbackModelo: {
      acertos_esperados: ["Técnica correta de medida", "Interpretação adequada dos percentis"],
      erros_comuns: ["Manguito inadequado", "Criança ansiosa", "Não comparar com tabelas"],
      orientacoes_pedagogicas: ["PA varia com idade, sexo e estatura", "Importante usar tabelas apropriadas"]
},

  checklistOcultoExaminador: {
      oQueProfessorQuer: "Técnica correta e interpretação adequada",
      comunicacao: ["acalmou a criança"],
      exame_fisico: ["técnica adequada", "comparação correta"]
},

  temaOSCE: "Pediatria - Hipertensão em Pediatria",
  subtopicosOSCE: ["PA em pediatria", "Técnica", "Percentis"],

  diagnosticoCorreto: "Pressão arterial elevada para a idade",
  ativo: true
} as CasoPediatricoOSCEV2;
