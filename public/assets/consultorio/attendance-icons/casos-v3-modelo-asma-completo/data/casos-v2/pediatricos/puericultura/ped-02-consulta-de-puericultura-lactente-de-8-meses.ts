import { CasoPediatricoOSCEV2 } from "@/types/caso-pediatrico-osce-v2";

export const casoPed002ConsultaDePuericulturaLactenteDe8: CasoPediatricoOSCEV2 = {
  id: "ped-02",
  codigo: "PED-02",
  versao: "3.0.0",

  titulo: "Consulta de Puericultura - Lactente de 8 Meses",
  sistema: "Geral/Puericultura",
  tema: "Puericultura",
  subtema: "Crescimento e desenvolvimento normais",
  nivel: "iniciante",
  tipo_estacao: "integrada",
  tipoPaciente: "pediatrico",
  tempo_osce_minutos: 12,

  objetivo_pedagogico: "Avaliar crescimento e desenvolvimento, medir perímetro cefálico, peso, comprimento, investigar alimentação e vacinação",

  dados_visiveis_ao_estudante: {
    ...{
      nome_paciente: "Lucas",
      idade: 0.67,
      sexo: "Masculino",
      queixa_principal: "Consulta de rotina",
      historia_breve: "Mãe traz para avaliação de desenvolvimento"
},
    acompanhante: "responsável",
    contexto_atendimento: "Atendimento pediátrico simulado OSCE"
},

  paciente: {
      id: "pac-ped-02",
      nome: "Lucas",
      idade: 0.67,
      sexo: "M",
      tipoPaciente: "pediatrico",
      queixaPrincipal: "Consulta de rotina de puericultura",
      historicoDoenca: "Lactente bem, sem queixa atual",
      antecedentes: ["Parto vaginal, APGAR 9/10", "Peso ao nascer 3.200g"],
      alergias: [],
      medicamentos_em_uso: [],
      dadosPediatricos: {
        idadeMeses: 8,
        faixaEtaria: "lactente",
        responsavel: {
          nome: "Paula",
          parentesco: "mãe"
},
        peso: "8.2 kg",
        estatura: "70 cm",
        perimetroCefalico: "43.5 cm",
        estadoVacinal: "vacinação em dia",
        gestacaoParto: "a termo, parto vaginal",
        desenvolvimento: "engatinhando, brincando com objetos, balbucio",
        alimentacao: "leite materno + papinhas (6 meses), iniciando alimentos",
        aberturaResponsavel: "Doutora, trouxe meu filho para a consulta de 8 meses. Queria saber como está o crescimento dele."
}
},

  respostasPaciente: {
      inicial: "Mãe: Ele está comendo bem, começou a comer frutas e legumes.",
      desenvolvimento: "Mãe: Ele já engatinha, pega brinquedos e coloca na boca. Balbucia bastante.",
      sono: "Mãe: Dorme bem, umas 10 horas à noite e dorme durante o dia.",
      fezes: "Mãe: Normal, amareladas, umas 2 vezes ao dia.",
      vacinacao: "Mãe: Está tudo em dia, a última foi pentavalente há um mês."
},

  dados_ocultos_do_sistema: {
    ...{
      diagnostico_principal: "Crescimento e desenvolvimento normais",
      diagnosticos_diferenciais: ["Atraso no desenvolvimento", "Insuficiência ponderal"],
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
      pressaoArterial: "não aferida em lactente",
      frequenciaCardiaca: 128,
      frequenciaRespiratoria: 32,
      temperatura: 36.8,
      saturacaoOxigenio: 98,
      peso: 8.2,
      nivelConsciencia: "avaliar responsividade, interação e irritabilidade",
      perfusao: "avaliar tempo de enchimento capilar, extremidades e pulsos",
      hidratacao: "avaliar mucosas, lágrimas, turgor, diurese e aceitação hídrica",
      atividade: "comparar com habitual segundo responsável",
      trabalhoRespiratorio: "avaliar tiragens, batimento de asa nasal, gemência e ausculta quando aplicável"
},
    referenciaPorIdade: {
      faixaEtaria: "lactente",
      frequenciaCardiacaEsperada: "aproximadamente 100-160 bpm, variando com idade, choro, febre e estado clínico",
      frequenciaRespiratoriaEsperada: "aproximadamente 30-50 irpm, variando com idade e contexto",
      pressaoArterial: "interpretar por idade, sexo e comprimento/estatura; aferir quando indicado e com manguito adequado",
      saturacaoOxigenioEsperada: ">= 95% em ar ambiente, salvo cardiopatia cianótica conhecida",
      temperatura: "febre conforme método de aferição e contexto clínico",
      observacao: "Em lactentes, alimentação, perfusão, esforço respiratório e ganho ponderal são marcadores importantes de gravidade."
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

  antropometria: {
    peso: "8.2 kg",
    comprimentoOuEstatura: "70 cm",
    perimetroCefalico: "43.5 cm",
    percentis: {
      pesoParaIdade: "interpretar em curva apropriada",
      estaturaParaIdade: "interpretar em curva apropriada",
      pesoParaEstatura: "interpretar em curva apropriada",
      perimetroCefalicoParaIdade: "interpretar quando aplicável"
},
    interpretacao:
      "Antropometria deve ser interpretada em curva por idade e sexo; peso isolado não é suficiente.",
    errosCriticos: [
      "Não pesar a criança",
      "Não interpretar medidas por idade e sexo",
      "Não avaliar tendência de crescimento quando o caso exige"
]
},

  desenvolvimentoNeuropsicomotor: {
    motorGrosso: {
      esperadoParaIdade: ["avaliar marcos compatíveis com lactente"],
      presenteNoCaso: ["usar relato do responsável e observação direta"],
      sinaisAlarme: ["perda de marcos", "assimetria persistente", "hipotonia importante", "não progressão dos marcos"],
      interpretacao: "Interpretar conforme idade corrigida quando aplicável."
},
    motorFinoAdaptativo: {
      esperadoParaIdade: ["preensão/manipulação adequadas para idade"],
      presenteNoCaso: ["avaliar interação com brinquedos e objetos"],
      sinaisAlarme: ["não usar mãos", "assimetria importante", "perda de habilidade"],
      interpretacao: "Avaliar junto com desenvolvimento global."
},
    linguagem: {
      esperadoParaIdade: ["balbucio, palavras ou frases conforme idade"],
      presenteNoCaso: ["extrair do relato do responsável"],
      sinaisAlarme: ["ausência de resposta a sons", "perda de linguagem", "ausência de interação"],
      interpretacao: "Linguagem deve ser interpretada em conjunto com audição e interação social."
},
    social: {
      esperadoParaIdade: ["interação social compatível com idade"],
      presenteNoCaso: ["observar contato visual, brincadeira e vínculo com responsável"],
      sinaisAlarme: ["perda de interação", "ausência de contato visual persistente", "isolamento extremo"],
      interpretacao: "Domínio social é parte da avaliação pediátrica."
},
    conclusao:
      "Desenvolvimento deve ser avaliado por domínios e comparado com a faixa etária, evitando diagnóstico precipitado sem sinais de alarme."
},

  exameFisicoPediatrico: {
    abordagem: {
      preparo:
        "Observar a criança inicialmente no colo ou junto ao responsável, quando possível, antes de manipular.",
      comunicacao:
        "Explicar ao responsável e usar linguagem adequada à idade da criança."
},
    achadosOriginais: {
      geral: {
        estado_geral: "Lactente ativo e alegre",
        consciencia: "Reativo, interage com mãe",
        hidratacao: "Mucosas úmidas, turgor normal"
}
},
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
    pesoBase: "8.2 kg",
    pesoKg: 8.2,
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
    principal: "Crescimento e desenvolvimento normais",
    categoria: "Puericultura",
    hipotesesOriginais: [
      {
        diagnostico: "Crescimento e desenvolvimento normais",
        probabilidade: 95,
        criterios_minimos: ["Peso percentil 50", "Comprimento percentil 50", "PC percentil 50", "Marcos adequados"]
}
],
    criteriosQueSustentam: [
      "história clínica pediátrica",
      "dados do responsável",
      "sinais vitais por idade",
      "exame físico direcionado",
      "exames complementares quando indicados"
],
    diferenciais: ["Atraso no desenvolvimento", "Insuficiência ponderal"]
},

  condutaEsperada: {
    condutaOriginal: {
      imediata: ["Avaliar crescimento com curvas de crescimento", "Verificar desenvolvimento com marcos", "Revisar cartão de vacinação"],
      curto_prazo: ["Orientar alimentação complementar", "Orientar higiene e prevenção de acidentes"],
      longo_prazo: ["Acompanhamento regular de puericultura"],
      encaminhamentos: []
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
        sinais: ["Lactente normal"],
        descricao: "Seguimento rotineiro",
        recomendacao: "Puericultura a cada 2-3 meses"
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
        erro: "Não medir perímetro cefálico adequadamente",
        descricao: "Medida importante para detecção de anomalias",
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
        nome: "Antropometria, curvas, vacinação e orientação preventiva",
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
        componentes_obrigatorios: ["Alimentação", "Desenvolvimento", "Sono", "Eliminações"]
},
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Peso", "Comprimento", "PC", "Exame físico geral"]
},
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Crescimento adequado", "Desenvolvimento adequado"]
},
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Orientação alimentar", "Próxima consulta"]
}
},

  feedbackModelo: {
      acertos_esperados: ["Mediu antropometria completa", "Comparou com curvas de crescimento", "Avaliou desenvolvimento"],
      erros_comuns: ["Esquecer de medir PC", "Não interpretar adequadamente as curvas"],
      orientacoes_pedagogicas: ["PC importante para detecção de problemas neurológicos"]
},

  checklistOcultoExaminador: {
      oQueProfessorQuer: "Avaliação completa de crescimento e desenvolvimento",
      comunicacao: ["conversou com a mãe de forma empática"],
      anamnese: ["perguntou sobre desenvolvimento"],
      exame_fisico: ["mediu corretamente", "comparou com curvas"],
      exames_complementares: [],
      raciocinio: ["interpretou adequadamente"],
      conduta: ["orientou próximas etapas"],
      soap: ["documentou corretamente"]
},

  temaOSCE: "Pediatria - Puericultura",
  subtopicosOSCE: ["Crescimento", "Desenvolvimento", "Antropometria"],

  diagnosticoCorreto: "Crescimento e desenvolvimento normais",
  ativo: true
} as CasoPediatricoOSCEV2;
