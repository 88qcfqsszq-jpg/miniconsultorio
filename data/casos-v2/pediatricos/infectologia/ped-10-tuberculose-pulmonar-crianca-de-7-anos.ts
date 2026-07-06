import { CasoPediatricoOSCEV2 } from "@/types/caso-pediatrico-osce-v2";

export const casoPed010TuberculosePulmonarCriancaDe7Anos: CasoPediatricoOSCEV2 = {
  id: "ped-10",
  codigo: "PED-10",
  versao: "3.0.0",

  titulo: "Tuberculose Pulmonar - Criança de 7 Anos",
  sistema: "Respiratório/Infectologia",
  tema: "Tuberculose",
  subtema: "Tuberculose pulmonar",
  nivel: "intermediario",
  tipo_estacao: "integrada",
  tipoPaciente: "pediatrico",
  tempo_osce_minutos: 15,

  objetivo_pedagogico: "Reconhecer TB em criança, investigar contato, solicitar exames, realizar notificação compulsória",

  dados_visiveis_ao_estudante: {
    ...{
      nome_paciente: "Clara",
      idade: 7,
      sexo: "Feminino",
      queixa_principal: "Tosse há 6 semanas",
      historia_breve: "Criança com tosse persistente e perda de peso"
},
    acompanhante: "responsável",
    contexto_atendimento: "Atendimento pediátrico simulado OSCE"
},

  paciente: {
      id: "pac-ped-10",
      nome: "Clara",
      idade: 7,
      sexo: "F",
      tipoPaciente: "pediatrico",
      queixaPrincipal: "Tosse há 6 semanas",
      historicoDoenca: "Tosse persistente, febre vespertina, perda de apetite, perda de peso",
      antecedentes: ["Avó tem TB"],
      alergias: [],
      medicamentos_em_uso: [],
      dadosPediatricos: {
        idadeAnos: 7,
        faixaEtaria: "escolar",
        responsavel: {
          nome: "Eliana",
          parentesco: "mãe"
},
        peso: "18 kg (abaixo do esperado)",
        estadoVacinal: "BCG recebida",
        aberturaResponsavel: "Doutora, minha filha tem tosse há bastante tempo e emagreceu. Minha sogra tem tuberculose e ela morava conosco."
}
},

  respostasPaciente: {
      inicial: "Mãe: Ela está com tosse há 6 semanas pelo menos.",
      tosse: "Mãe: Tosse principalmente à noite, piora quando está deitada.",
      febre: "Mãe: Tem febre à noite, depois que o sol se põe.",
      peso: "Mãe: Emagreceu, ela não quer comer quase nada.",
      contato: "Mãe: Minha sogra tem tuberculose e ficou um tempo conosco."
},

  dados_ocultos_do_sistema: {
    ...{
      diagnostico_principal: "Tuberculose pulmonar ativa",
      diagnosticos_diferenciais: ["Pneumonia", "Asma", "Corpo estranho"],
      sindromes_associadas: ["TB pulmonar"]
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

  sinaisVitais: {
    entrada: {
      momento: "Chegada ao atendimento",
      pressaoArterial: "não aferida",
      frequenciaCardiaca: 102,
      frequenciaRespiratoria: 26,
      temperatura: 37.6,
      saturacaoOxigenio: 96,
      peso: 18,
      nivelConsciencia: "avaliar responsividade, interação e irritabilidade",
      perfusao: "avaliar tempo de enchimento capilar, extremidades e pulsos",
      hidratacao: "avaliar mucosas, lágrimas, turgor, diurese e aceitação hídrica",
      atividade: "comparar com habitual segundo responsável",
      trabalhoRespiratorio: "avaliar tiragens, batimento de asa nasal, gemência e ausculta quando aplicável"
},
    referenciaPorIdade: {
      faixaEtaria: "escolar",
      frequenciaCardiacaEsperada: "aproximadamente 70-110 bpm em repouso, variando com febre, dor, ansiedade e gravidade",
      frequenciaRespiratoriaEsperada: "aproximadamente 18-25 irpm",
      pressaoArterial: "interpretar por idade, sexo e estatura; usar manguito adequado",
      saturacaoOxigenioEsperada: ">= 95% em ar ambiente",
      temperatura: "febre conforme método de aferição e contexto clínico",
      observacao: "A criança pode colaborar mais com anamnese e exame, mas responsável continua sendo fonte importante."
},
    interpretacaoInicial:
      "Interpretar sinais vitais pela faixa etária, considerando febre, choro, dor, ansiedade, hipoxemia, perfusão, hidratação e estado geral.",
    evolucao: {
      aposCondutaCorreta_60min: {
        condicoesParaAtivar: [
          "Avaliação respiratória completa",
          "Oximetria",
          "Tratamento específico quando indicado",
          "Reavaliação de esforço respiratório e SpO2",
          "Destino seguro definido"
],
        saturacaoOxigenio: "melhorada ou estável conforme quadro",
        interpretacao: "Resposta deve ser avaliada por FR, SpO2, esforço respiratório, ausculta e estado geral."
},
      seCondutaInadequadaOuAtrasada: {
        risco: "Pode ocorrer piora respiratória, hipoxemia ou atraso de tratamento apropriado."
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

  exameFisico: {
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
    complementaresOriginais: [
      {
        nome: "RX Tórax",
        descricao: "Radiografia do tórax",
        resultado: "Infiltrado apical direito com caverna",
        valor_referencia: "Normal",
        interpretacao: "TB pulmonar ativa"
},
      {
        nome: "PPD (Teste da Tuberculina)",
        descricao: "Teste intradérmico",
        resultado: "Enduração 22mm (positivo)",
        valor_referencia: "<5mm",
        interpretacao: "Tuberculina positiva, infecção TB confirmada"
},
      {
        nome: "GeneXpert MTB/RIF",
        descricao: "PCR rápido",
        resultado: "Positivo para MTB, rifampicina sensível",
        valor_referencia: "Negativo",
        interpretacao: "TB ativa confirmada"
}
],
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
    pesoBase: "18 kg (abaixo do esperado)",
    pesoKg: 18,
    medicamentosPermitidos: [
      {
        nome: "Antimicrobiano quando indicado",
        indicacao: "Infecção bacteriana provável/confirmada conforme caso",
        dosePorPeso: "calcular por peso e protocolo local",
        doseCalculadaParaOCaso: "calcular usando peso do caso",
        via: "oral ou intravenosa conforme gravidade",
        intervalo: "conforme fármaco escolhido",
        observacao: "Escolher antibiótico conforme foco, idade, gravidade e protocolo local."
}
    ],
    medicamentosContraindicadosOuEvitar: [
      
    ],
    errosDeDoseCriticos: ["Prescrever dose de adulto", "Não calcular dose pelo peso", "Não explicar intervalo e dose máxima quando aplicável"]
},

  protecaoInfantil: { aplicavel: false },

  arbovirosePediatrica: { aplicavel: false },

  cardiologiaPediatrica: { aplicavel: false },

  diagnostico: {
    principal: "Tuberculose pulmonar",
    categoria: "Tuberculose",
    hipotesesOriginais: [
      {
        diagnostico: "Tuberculose pulmonar ativa",
        probabilidade: 90,
        criterios_minimos: ["Tosse > 4 semanas", "Febre vespertina", "Perda de peso", "Contato", "Achados apicais", "RX com infiltrado"]
}
],
    criteriosQueSustentam: [
      "história clínica pediátrica",
      "dados do responsável",
      "sinais vitais por idade",
      "exame físico direcionado",
      "exames complementares quando indicados"
],
    diferenciais: ["Pneumonia", "Asma", "Corpo estranho"]
},

  condutaEsperada: {
    condutaOriginal: {
      imediata: ["Isolamento respiratório", "Notificação compulsória", "Solicitar exames"],
      curto_prazo: ["Iniciar terapia antiTB conforme protocolo", "Investigação de contatos"],
      longo_prazo: ["Terapia por 6 meses", "Seguimento para cura"],
      encaminhamentos: ["Pneumologia pediátrica ou infectologia", "Vigilância sanitária"]
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
        severidade: "grave",
        sinais: ["Caverna", "Contato domiciliar"],
        descricao: "TB ativa com transmissão",
        recomendacao: "Tratamento urgente e investigação de contatos"
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
        erro: "Não realizar notificação compulsória",
        descricao: "Obrigatoriedade legal",
        penalidade: 3,
        evitavel: false
},
      {
        erro: "Não investigar contatos domiciliares",
        descricao: "Essencial para controle de TB",
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
        componentes_obrigatorios: ["Tosse > 4 semanas", "Febre vespertina", "Perda de peso", "Contato com TB"]
},
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Ausculta apical", "RX tórax", "GeneXpert"]
},
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Tuberculose pulmonar ativa"]
},
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Notificação", "Tratamento", "Investigação de contatos"]
}
},

  feedbackModelo: {
      acertos_esperados: ["Reconhecimento de TB", "Exames apropriados", "Notificação realizada", "Investigação de contatos"],
      erros_comuns: ["Pensar em pneumonia", "Esquecer notificação", "Não investigar contatos"],
      orientacoes_pedagogicas: ["Tosse > 4 semanas sugere TB", "Notificação é obrigatória", "Contatos devem ser investigados"]
},

  checklistOcultoExaminador: {
      oQueProfessorQuer: "Reconhecimento de TB e ação apropriada",
      anamnese: ["investigou TB adequadamente"],
      exame_fisico: ["ausculta apical"],
      exames_complementares: ["RX e GeneXpert solicitados"],
      conduta: ["notificou corretamente", "investigou contatos"]
},

  temaOSCE: "Pediatria - Tuberculose",
  subtopicosOSCE: ["Tuberculose", "Tosse crônica", "Notificação"],

  diagnosticoCorreto: "Tuberculose pulmonar",
  ativo: true
} as CasoPediatricoOSCEV2;
