import { CasoPediatricoOSCEV2 } from "@/types/caso-pediatrico-osce-v2";

export const casoPed015AnemiaComSinaisDeAlertaCrianca: CasoPediatricoOSCEV2 = {
  id: "ped-15",
  codigo: "PED-15",
  versao: "3.0.0",

  titulo: "Anemia com Sinais de Alerta - Criança de 8 Anos",
  sistema: "Hematológico",
  tema: "Anemia",
  subtema: "Anemia com sinais de alerta hematológico",
  nivel: "intermediario",
  tipo_estacao: "integrada",
  tipoPaciente: "pediatrico",
  tempo_osce_minutos: 12,

  objetivo_pedagogico: "Reconhecer anemia, investigar causa, identificar sinais de alerta para doença hematológica",

  dados_visiveis_ao_estudante: {
    ...{
      nome_paciente: "Amber",
      idade: 8,
      sexo: "Feminino",
      queixa_principal: "Cansaço, palidez e equimoses",
      historia_breve: "Criança com palidez progressiva e manchas roxas"
},
    acompanhante: "responsável",
    contexto_atendimento: "Atendimento pediátrico simulado OSCE"
},

  paciente: {
      id: "pac-ped-15",
      nome: "Amber",
      idade: 8,
      sexo: "F",
      tipoPaciente: "pediatrico",
      queixaPrincipal: "Cansaço e palidez",
      historicoDoenca: "Palidez progressiva, cansaço, equimoses recentes",
      antecedentes: [],
      alergias: [],
      medicamentos_em_uso: [],
      dadosPediatricos: {
        idadeAnos: 8,
        faixaEtaria: "escolar",
        responsavel: {
          nome: "Andrea",
          parentesco: "mãe"
},
        peso: "24 kg",
        aberturaResponsavel: "Doutor, minha filha está muito cansada, pálida, e apareceu uns roxos no corpo sem ela ter batido."
}
},

  respostasPaciente: {
      inicial: "Mãe: Ela está muito cansada e pálida.",
      cansaco: "Mãe: Reclama de cansaço ao subir escadas, tontura.",
      equimoses: "Mãe: Apareceram umas manchas roxas no corpo sem ela ter batido.",
      febre: "Mãe: Não tem febre.",
      outros: "Mãe: Às vezes ela reclama de dor nos ossos."
},

  dados_ocultos_do_sistema: {
    ...{
      diagnostico_principal: "Anemia + possível trombocitopenia (síndrome hematológica)",
      diagnosticos_diferenciais: ["Anemiaferropriva isolada", "Leucemia"],
      sindromes_associadas: ["Síndrome anêmica", "Possível ITP ou síndrome hematológica"]
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
      frequenciaCardiaca: 108,
      frequenciaRespiratoria: 22,
      temperatura: 36.8,
      saturacaoOxigenio: 97,
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
      aposCondutaCorreta: {
        condicoesParaAtivar: [
          "Avaliação pediátrica completa",
          "Conduta coerente com gravidade",
          "Orientação ao responsável",
          "Reavaliação ou seguimento definido"
],
        interpretacao: "Paciente com plano seguro e responsável orientado."
},
      seCondutaInadequadaOuAtrasada: {
        risco: "Risco de perda diagnóstica ou orientação familiar insuficiente."
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
        nome: "Hemograma",
        descricao: "Contagem de células",
        resultado: "Hemoglobina 7.2 g/dL, plaquetas 45.000/L, WBC 4.500/L",
        valor_referencia: "Hb 12-16 g/dL, plaquetas 150.000-400.000/L, WBC 5.000-12.000/L",
        interpretacao: "Anemia moderada com trombocitopenia"
},
      {
        nome: "Ferro sérico e ferritina",
        descricao: "Metabolismo de ferro",
        resultado: "Ferritina 22 ng/mL, ferro 35 g/dL",
        valor_referencia: "Ferritina > 30 ng/mL, ferro > 60 g/dL",
        interpretacao: "Sugestivo de anemia ferropriva"
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
        solicitadoPor: ["hemograma completo"],
        disponivel: true,
        prioridade: "obrigatorio",
        resultado: "Anemia a caracterizar conforme índices hematimétricos",
        interpretacao: "Hemograma é exame-chave para classificar anemia e sinais de alerta.",
        valores: { hemoglobina: "8,5 g/dL", hematocrito: "27%", vcm: "70 fL", rdw: "18%", plaquetas: "420.000/mm³" }
},
      perfilFerro: {
        solicitadoPor: ["ferritina", "ferro sérico", "transferrina"],
        disponivel: true,
        prioridade: "importante",
        resultado: "Ferritina baixa se anemia ferropriva",
        interpretacao: "Usar para confirmar deficiência de ferro quando compatível.",
        valores: { ferritina: "8 ng/mL", ferroSerico: "25 µg/dL", saturacaoTransferrina: "6%" }
}
}
},

  prescricaoPediatrica: {
    pesoBase: "24 kg",
    pesoKg: 24,
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

  cardiologiaPediatrica: { aplicavel: false },

  diagnostico: {
    principal: "Anemia com sinais de alerta hematológico",
    categoria: "Anemia",
    hipotesesOriginais: [
      {
        diagnostico: "Anemia ferropriva com suspeita de trombocitopenia",
        probabilidade: 80,
        criterios_minimos: ["Palidez", "Fadiga", "Equimoses espontâneas", "Hemoglobina baixa", "Plaquetas baixas"]
}
],
    criteriosQueSustentam: [
      "história clínica pediátrica",
      "dados do responsável",
      "sinais vitais por idade",
      "exame físico direcionado",
      "exames complementares quando indicados"
],
    diferenciais: ["Anemiaferropriva isolada", "Leucemia"]
},

  condutaEsperada: {
    condutaOriginal: {
      imediata: ["Solicitar hemograma urgente", "Avaliar gravidade"],
      curto_prazo: ["Suplementação de ferro se indicado", "Investigação de sangramento"],
      longo_prazo: ["Acompanhamento hematológico"],
      encaminhamentos: ["Hematologia pediátrica"]
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
        severidade: "moderada",
        sinais: ["Anemia moderada com trombocitopenia"],
        descricao: "Síndrome hematológica",
        recomendacao: "Investigação e acompanhamento hematológico"
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
        erro: "Não reconhecer sinais de alerta (equimoses espontâneas)",
        descricao: "Indicativo de doença mais grave que anemia simples",
        penalidade: 2.5,
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
        componentes_obrigatorios: ["Cansaço", "Palidez", "Equimoses"]
},
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Palidez", "Equimoses", "Hemograma", "Ferro"]
},
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Anemia com sinais de alerta hematológico"]
},
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Hematologia pediátrica"]
}
},

  feedbackModelo: {
      acertos_esperados: ["Reconhecimento de sinais de alerta", "Exames apropriados", "Referência hematológica"],
      erros_comuns: ["Pensar apenas em anemia ferropriva", "Não investigar equimoses", "Não referir apropriadamente"],
      orientacoes_pedagogicas: ["Equimoses espontâneas são sinal de alerta", "Trombocitopenia pode acompanhar anemia", "Hematologia deve avaliar"]
},

  checklistOcultoExaminador: {
      oQueProfessorQuer: "Reconhecimento de sinais de alerta",
      exame_fisico: ["reconheceu sinais de alerta"],
      exames_complementares: ["hemograma solicitado"],
      conduta: ["referiu apropriadamente"]
},

  temaOSCE: "Pediatria - Anemia",
  subtopicosOSCE: ["Anemia", "Sinais de alerta", "Equimoses"],

  diagnosticoCorreto: "Anemia com sinais de alerta hematológico",
  ativo: true
} as CasoPediatricoOSCEV2;
