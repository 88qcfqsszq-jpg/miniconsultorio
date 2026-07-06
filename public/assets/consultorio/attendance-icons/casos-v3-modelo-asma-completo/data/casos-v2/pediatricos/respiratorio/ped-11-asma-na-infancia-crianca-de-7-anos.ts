import { CasoPediatricoOSCEV2 } from "@/types/caso-pediatrico-osce-v2";

export const casoPed011AsmaNaInfanciaCriancaDe7: CasoPediatricoOSCEV2 = {
  id: "ped-11",
  codigo: "PED-11",
  versao: "3.0.0",

  titulo: "Asma na Infância - Criança de 7 Anos",
  sistema: "Respiratório",
  tema: "Asma",
  subtema: "Asma intermitente",
  nivel: "iniciante",
  tipo_estacao: "integrada",
  tipoPaciente: "pediatrico",
  tempo_osce_minutos: 12,

  objetivo_pedagogico: "Reconhecer asma em criança, identificar fatores desencadeantes, prescrever tratamento adequado",

  dados_visiveis_ao_estudante: {
    ...{
      nome_paciente: "Pedro",
      idade: 7,
      sexo: "Masculino",
      queixa_principal: "Tosse seca à noite e chiado",
      historia_breve: "Criança com sintomas após correr ou durante infecções respiratórias"
},
    acompanhante: "responsável",
    contexto_atendimento: "Atendimento pediátrico simulado OSCE"
},

  paciente: {
      id: "pac-ped-11",
      nome: "Pedro",
      idade: 7,
      sexo: "M",
      tipoPaciente: "pediatrico",
      queixaPrincipal: "Tosse seca à noite",
      historicoDoenca: "Tosse notuma, chiado ao correr, sintomas pioram com infecções respiratórias",
      antecedentes: ["Rinite alérgica", "História familiar de asma"],
      alergias: ["Acaros"],
      medicamentos_em_uso: [],
      dadosPediatricos: {
        idadeAnos: 7,
        faixaEtaria: "escolar",
        responsavel: {
          nome: "Gabriela",
          parentesco: "mãe"
},
        peso: "24 kg",
        aberturaResponsavel: "Doutor, meu filho tosse à noite e fica com chiado quando corre. Meu marido também tem asma."
}
},

  respostasPaciente: {
      inicial: "Mãe: Ele tosse bastante à noite.",
      chiado: "Mãe: Fica com chiado quando brinca muito ou corre.",
      respiracao: "Mãe: Às vezes sente falta de ar.",
      desencadeantes: "Mãe: Piora quando fica gripado, quando tem poeira ou quando exposto à fumaça.",
      noite: "Mãe: Principalmente à noite, acordamos com ele tossindo."
},

  dados_ocultos_do_sistema: {
    ...{
      diagnostico_principal: "Asma intermitente",
      diagnosticos_diferenciais: ["Bronquiolite", "Corpo estranho", "Refluxo gastroesofágico"],
      sindromes_associadas: ["Asma"]
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
      pressaoArterial: "não aferida",
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
    complementaresOriginais: [
      {
        nome: "Teste do broncodilatador",
        descricao: "Melhora de FEV1 > 12% após broncodilatador",
        resultado: "Positivo - melhora de 20% após salbutamol",
        valor_referencia: "Negativo",
        interpretacao: "Reversibilidade confirmada, asma provável"
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
      gasometria: {
        solicitadoPor: ["gasometria", "gasometria arterial"],
        disponivel: true,
        prioridade: "condicional",
        resultado: "Hipoxemia se crise moderada/grave; pCO2 normal ou alto pode indicar fadiga",
        interpretacao: "Útil em crise grave ou resposta inadequada, sem atrasar tratamento.",
        valores: { ph: "7,41", paco2: "38 mmHg", pao2: "68 mmHg", satO2: "93%" }
},
      hemograma: {
        solicitadoPor: ["hemograma completo"],
        disponivel: true,
        prioridade: "opcional",
        resultado: "Sem leucocitose bacteriana; eosinofilia discreta possível",
        interpretacao: "Não é prioridade se quadro típico e sem sinais infecciosos.",
        valores: { leucocitos: "8.900/mm³", eosinofilos: "6%", plaquetas: "280.000/mm³" }
}
}
},

  prescricaoPediatrica: {
    pesoBase: "24 kg",
    pesoKg: 24,
    medicamentosPermitidos: [
      {
        nome: "Salbutamol inalatório",
        indicacao: "Broncoespasmo/crise asmática",
        dosePorPeso: "conforme idade, dispositivo e protocolo local",
        doseCalculadaParaOCaso: "usar espaçador/nebulização conforme gravidade",
        via: "inalatória",
        intervalo: "doses repetidas na fase aguda conforme protocolo",
        observacao: "Reavaliar resposta clínica e SpO2."
},{
        nome: "Corticosteroide sistêmico",
        indicacao: "Crise asmática moderada a grave",
        dosePorPeso: "calcular por peso e protocolo local",
        doseCalculadaParaOCaso: "calcular usando peso do caso",
        via: "oral ou intravenosa conforme gravidade",
        intervalo: "conforme protocolo local",
        observacao: "Administrar precocemente quando indicado."
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
    principal: "Asma intermitente",
    categoria: "Asma",
    hipotesesOriginais: [
      {
        diagnostico: "Asma intermitente",
        probabilidade: 85,
        criterios_minimos: ["Tosse noturna", "Chiado com exercício", "História familiar", "Dessensibilizadores"]
}
],
    criteriosQueSustentam: [
      "história clínica pediátrica",
      "dados do responsável",
      "sinais vitais por idade",
      "exame físico direcionado",
      "exames complementares quando indicados"
],
    diferenciais: ["Bronquiolite", "Corpo estranho", "Refluxo gastroesofágico"]
},

  condutaEsperada: {
    condutaOriginal: {
      imediata: ["Prescr salbutamol para crises", "Ensino do uso de inalador"],
      curto_prazo: ["Controle ambiental", "Orientação sobre desencadeantes"],
      longo_prazo: ["Considerar corticoide inalado se frequente", "Acompanhamento regular"],
      encaminhamentos: ["Pneumologia pediátrica se necessário"]
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
        sinais: ["Sintomas intermitentes"],
        descricao: "Asma intermitente",
        recomendacao: "Broncodilatador de resgate"
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
        erro: "Não reconhecer asma e prescrever antibiótico",
        descricao: "Asma é doença respiratória, não infecciosa",
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
        componentes_obrigatorios: ["Tosse noturna", "Chiado", "Desencadeantes"]
},
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Exame físico", "Teste de broncodilatador se possível"]
},
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Asma intermitente"]
},
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Salbutamol", "Controle ambiental"]
}
},

  feedbackModelo: {
      acertos_esperados: ["Reconhecimento de asma", "Prescrição de broncodilatador", "Orientação ambiental"],
      erros_comuns: ["Pensar em infecção", "Esquecer broncodilatador", "Não investigar história familiar"],
      orientacoes_pedagogicas: ["Tosse notuma sugere asma", "Chiado com exercício é típico", "Controle ambiental é importante"]
},

  checklistOcultoExaminador: {
      oQueProfessorQuer: "Reconhecimento de asma",
      anamnese: ["investigou adequadamente"],
      raciocinio: ["formulou diagnóstico correto"],
      conduta: ["prescreveu broncodilatador"]
},

  temaOSCE: "Pediatria - Asma",
  subtopicosOSCE: ["Asma", "Tosse notuma", "Desencadeantes"],

  diagnosticoCorreto: "Asma intermitente",
  ativo: true
} as CasoPediatricoOSCEV2;
