import { CasoPediatricoOSCEV2 } from "@/types/caso-pediatrico-osce-v2";

export const casoPed009PericarditeAgudaMeninoDe12Anos: CasoPediatricoOSCEV2 = {
  id: "ped-09",
  codigo: "PED-09",
  versao: "3.0.0",

  titulo: "Pericardite Aguda - Menino de 12 Anos",
  sistema: "Cardiovascular",
  tema: "Pericardite",
  subtema: "Pericardite aguda",
  nivel: "intermediario",
  tipo_estacao: "integrada",
  tipoPaciente: "pediatrico",
  tempo_osce_minutos: 12,

  objetivo_pedagogico: "Reconhecer dor pericárdica, atrito pericárdico, solicitar ecocardiograma, investigar etiologia",

  dados_visiveis_ao_estudante: {
    ...{
      nome_paciente: "Mateus",
      idade: 12,
      sexo: "Masculino",
      queixa_principal: "Dor no peito há 2 dias",
      historia_breve: "Criança com história de infecção viral recente"
},
    acompanhante: "responsável",
    contexto_atendimento: "Atendimento pediátrico simulado OSCE"
},

  paciente: {
      id: "pac-ped-09",
      nome: "Mateus",
      idade: 12,
      sexo: "M",
      tipoPaciente: "pediatrico",
      queixaPrincipal: "Dor no peito",
      historicoDoenca: "Começou após quadro gripal, dor tipo pontada que piora ao respirar",
      antecedentes: ["Gripe 2 semanas atrás"],
      alergias: [],
      medicamentos_em_uso: [],
      dadosPediatricos: {
        idadeAnos: 12,
        faixaEtaria: "escolar",
        responsavel: {
          nome: "Marta",
          parentesco: "mãe"
},
        peso: "45 kg",
        aberturaResponsavel: "Doutor, meu filho está com dor no peito há 2 dias. Tive medo que fosse algo grave no coração."
}
},

  respostasPaciente: {
      inicial: "Mãe: Ele acordou com dor no peito.",
      dor: "Criança: Dói quando respiro fundo. Também dói quando deito.",
      intensidade: "Criança: É dor forte, de 7 a 8.",
      inicio: "Mãe: Começou de repente há 2 dias, depois que tinha tido gripe.",
      posicao: "Criança: Melhora um pouco quando sento inclinado para frente."
},

  dados_ocultos_do_sistema: {
    ...{
      diagnostico_principal: "Pericardite aguda idiopática/pós-viral",
      diagnosticos_diferenciais: ["Dor musculoesquelética", "Infarto miocárdico", "Embolia pulmonar"],
      sindromes_associadas: ["Pericardite"]
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
      pressaoArterial: "108/68 mmHg",
      frequenciaCardiaca: 102,
      frequenciaRespiratoria: 22,
      temperatura: 37.2,
      saturacaoOxigenio: 98,
      peso: undefined,
      nivelConsciencia: "avaliar responsividade, interação e irritabilidade",
      perfusao: "avaliar tempo de enchimento capilar, extremidades e pulsos",
      hidratacao: "avaliar mucosas, lágrimas, turgor, diurese e aceitação hídrica",
      atividade: "comparar com habitual segundo responsável",
      trabalhoRespiratorio: "avaliar tiragens, batimento de asa nasal, gemência e ausculta quando aplicável"
},
    referenciaPorIdade: {
      faixaEtaria: "adolescente",
      frequenciaCardiacaEsperada: "aproximadamente 60-100 bpm em repouso",
      frequenciaRespiratoriaEsperada: "aproximadamente 12-20 irpm",
      pressaoArterial: "interpretar por idade/estatura quando aplicável e contexto clínico",
      saturacaoOxigenioEsperada: ">= 95% em ar ambiente",
      temperatura: "febre conforme método de aferição e contexto clínico",
      observacao: "Considerar autonomia progressiva, privacidade e escuta do paciente além do responsável."
},
    interpretacaoInicial:
      "Interpretar sinais vitais pela faixa etária, considerando febre, choro, dor, ansiedade, hipoxemia, perfusão, hidratação e estado geral.",
    evolucao: {
      aposCondutaCorreta_60min: {
        condicoesParaAtivar: [
          "Reconhecimento de gravidade cardiológica",
          "Oximetria e monitorização",
          "ECG/RX/Ecocardiograma quando indicado",
          "Cardiologia pediátrica acionada"
],
        interpretacao: "Paciente estabilizado para investigação e decisão de internação/encaminhamento especializado."
},
      seCondutaInadequadaOuAtrasada: {
        risco: "Pode haver piora de insuficiência cardíaca, hipoxemia, baixo débito ou perda de janela diagnóstica."
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
        nome: "ECG",
        descricao: "Eletrocardiograma",
        resultado: "Elevação difusa do segmento ST com depressão de PR",
        valor_referencia: "Normal",
        interpretacao: "Padrão típico de pericardite"
},
      {
        nome: "Ecocardiograma",
        descricao: "Ultrassom cardíaco",
        resultado: "Pequeno derrame pericárdico",
        valor_referencia: "Sem derrame",
        interpretacao: "Confirmação de pericardite"
},
      {
        nome: "PCR",
        descricao: "Proteína C Reativa",
        resultado: "18 mg/L (elevada)",
        valor_referencia: "<3 mg/L",
        interpretacao: "Inflamação ativa"
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
    pesoBase: "45 kg",
    pesoKg: 45,
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
    principal: "Pericardite aguda",
    categoria: "Pericardite",
    hipotesesOriginais: [
      {
        diagnostico: "Pericardite aguda",
        probabilidade: 90,
        criterios_minimos: ["Dor tipo pontada", "Piora ao respirar", "Melhora inclinado", "Atrito pericárdico", "ECG com elevação ST"]
}
],
    criteriosQueSustentam: [
      "história clínica pediátrica",
      "dados do responsável",
      "sinais vitais por idade",
      "exame físico direcionado",
      "exames complementares quando indicados"
],
    diferenciais: ["Dor musculoesquelética", "Infarto miocárdico", "Embolia pulmonar"]
},

  condutaEsperada: {
    condutaOriginal: {
      imediata: ["Repouso relativo", "AINE (ibuprofeno) se sem contraindicações"],
      curto_prazo: ["Investigar etiologia", "Monitoramento de complicações"],
      longo_prazo: ["Seguimento clínico", "Investigar recorrência"],
      encaminhamentos: ["Cardiologia se derrame significativo"]
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
        sinais: ["Derrame pequeno"],
        descricao: "Tratamento clínico",
        recomendacao: "AINE e repouso"
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
        erro: "Não reconhecer atrito pericárdico",
        descricao: "Sinal patognomônico de pericardite",
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
        componentes_obrigatorios: ["Dor tipo pontada", "Piora ao respirar", "História viral"]
},
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Atrito pericárdico", "ECG", "Ecocardiograma"]
},
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Pericardite aguda"]
},
      plano: {
        secao: "P",
        componentes_obrigatorios: ["AINE", "Repouso", "Seguimento"]
}
},

  feedbackModelo: {
      acertos_esperados: ["Reconhecimento de atrito", "ECG e eco solicitados", "Diagnóstico correto"],
      erros_comuns: ["Pensar em IAM", "Não ouvir atrito", "Não solicitar exames"],
      orientacoes_pedagogicas: ["Atrito é patognomônico", "Dor que melhora inclinado é típica", "ECG mostra padrão característico"]
},

  checklistOcultoExaminador: {
      oQueProfessorQuer: "Reconhecimento de pericardite",
      anamnese: ["caracterizou dor adequadamente"],
      exame_fisico: ["ouviu atrito"],
      exames_complementares: ["ECG e eco solicitados"]
},

  temaOSCE: "Pediatria - Pericardite",
  subtopicosOSCE: ["Pericardite", "Atrito", "Dor pericárdica"],

  diagnosticoCorreto: "Pericardite aguda",
  ativo: true
} as CasoPediatricoOSCEV2;
