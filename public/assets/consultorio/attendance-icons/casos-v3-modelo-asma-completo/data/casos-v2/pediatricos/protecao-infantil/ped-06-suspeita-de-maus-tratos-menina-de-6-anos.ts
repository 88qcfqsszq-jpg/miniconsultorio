import { CasoPediatricoOSCEV2 } from "@/types/caso-pediatrico-osce-v2";

export const casoPed006SuspeitaDeMausTratosMeninaDe: CasoPediatricoOSCEV2 = {
  id: "ped-06",
  codigo: "PED-06",
  versao: "3.0.0",

  titulo: "Suspeita de Maus-Tratos - Menina de 6 Anos",
  sistema: "Geral/Proteção",
  tema: "Proteção da Criança",
  subtema: "Suspeita de abuso físico",
  nivel: "intermediario",
  tipo_estacao: "integrada",
  tipoPaciente: "pediatrico",
  tempo_osce_minutos: 15,

  objetivo_pedagogico: "Reconhecer sinais de abuso infantil, registrar adequadamente, notificação compulsória, acionamento da rede de proteção",

  dados_visiveis_ao_estudante: {
    ...{
      nome_paciente: "Luísa",
      idade: 6,
      sexo: "Feminino",
      queixa_principal: "Dor no braço",
      historia_breve: "Responsável refere queda de bicicleta"
},
    acompanhante: "responsável",
    contexto_atendimento: "Atendimento pediátrico simulado OSCE"
},

  paciente: {
      id: "pac-ped-06",
      nome: "Luísa",
      idade: 6,
      sexo: "F",
      tipoPaciente: "pediatrico",
      queixaPrincipal: "Dor no braço",
      historicoDoenca: "Responsável refere queda de bicicleta 3 dias atrás",
      antecedentes: [],
      alergias: [],
      medicamentos_em_uso: [],
      dadosPediatricos: {
        idadeAnos: 6,
        faixaEtaria: "escolar",
        responsavel: {
          nome: "Jorge",
          parentesco: "responsável"
},
        peso: "20 kg",
        aberturaResponsavel: "A Luísa caiu da bicicleta alguns dias atrás. Ela doeu no braço."
}
},

  respostasPaciente: {
      inicial: "Padrasto: Ela caiu de bicicleta.",
      como_caiu: "Padrasto: Perdeu o equilíbrio e caiu."
},

  dados_ocultos_do_sistema: {
    ...{
      diagnostico_principal: "Suspeita de abuso físico",
      diagnosticos_diferenciais: ["Fratura por trauma acidental"],
      sindromes_associadas: ["Síndrome do abuso infantil"]
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
      frequenciaCardiaca: 92,
      frequenciaRespiratoria: 20,
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
      aposCondutaCorreta: {
        condicoesParaAtivar: [
          "Lesões avaliadas e tratadas",
          "Registro objetivo realizado",
          "Equipe multiprofissional acionada",
          "Notificação compulsória realizada",
          "Rede de proteção acionada"
],
        seguranca: "criança não recebe alta sem plano de proteção",
        interpretacao: "Conduta correta prioriza segurança, documentação e rede de proteção."
},
      seCondutaInadequadaOuAtrasada: {
        risco: "Criança pode retornar para ambiente inseguro; risco médico, social e legal."
}
},
    criteriosAltaOuSeguimento: {
      altaSeguraSe: ["não se aplica sem avaliação de segurança e rede de proteção"],
      observarOuInvestigarMaisSe: ["história incompatível", "lesões suspeitas", "criança em risco"],
      encaminharUrgenciaSe: ["risco imediato à segurança", "lesão grave", "necessidade de proteção imediata"]
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
        nome: "Radiografia de antebraço",
        descricao: "RX do antebraço",
        resultado: "Fratura de rádio e ulna",
        valor_referencia: "Sem alterações",
        interpretacao: "Fratura presente"
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
    pesoBase: "20 kg",
    pesoKg: 20,
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

  protecaoInfantil: {
    aplicavel: true,
    nivelSuspeita: "alto",
    historiaIncompativel: true,
    lesoesIncompativeisComRelato: true,
    lesoesEmDiferentesEstagios: true,
    condutaSegura: [
      "Atender lesões agudas e dor",
      "Registrar achados de forma objetiva e detalhada",
      "Não confrontar diretamente possível agressor",
      "Garantir segurança da criança",
      "Acionar equipe multiprofissional",
      "Realizar notificação compulsória",
      "Acionar rede de proteção"
],
    comunicacaoSegura: [
      "Falar com cuidado",
      "Evitar acusações diretas",
      "Não prometer sigilo absoluto quando há risco à criança",
      "Preservar a criança e reduzir exposição"
],
    notificacao: [
      "Notificação compulsória conforme legislação e fluxo local",
      "Conselho Tutelar/rede de proteção conforme contexto"
],
    redeProtecao: ["Conselho Tutelar", "Serviço social", "CREAS/CRAS quando aplicável", "Equipe multiprofissional"],
    errosCriticos: [
      "Dar alta sem garantir proteção",
      "Não notificar",
      "Confrontar responsável de forma insegura",
      "Não documentar lesões"
]
},

  arbovirosePediatrica: { aplicavel: false },

  cardiologiaPediatrica: { aplicavel: false },

  diagnostico: {
    principal: "Suspeita de abuso físico",
    categoria: "Proteção da Criança",
    hipotesesOriginais: [
      {
        diagnostico: "Suspeita de abuso físico",
        probabilidade: 90,
        criterios_minimos: ["Equimoses em diferentes estágios", "Petéquias cervicais", "História incompatível", "Comportamento retraído"]
}
],
    criteriosQueSustentam: [
      "história clínica pediátrica",
      "dados do responsável",
      "sinais vitais por idade",
      "exame físico direcionado",
      "exames complementares quando indicados"
],
    diferenciais: ["Fratura por trauma acidental"]
},

  condutaEsperada: {
    condutaOriginal: {
      imediata: ["Registrar achados detalhadamente", "Fotografar lesões", "Investigar história com cuidado", "Avaliação multiprofissional"],
      curto_prazo: ["Notificação compulsória ao conselho tutelar", "Denúncia à polícia se indicado"],
      longo_prazo: ["Acompanhamento pela rede de proteção"],
      encaminhamentos: ["Conselho Tutelar", "CREAS", "Polícia"]
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
        sinais: ["Sinais de abuso físico", "Negligência"],
        descricao: "Criança em risco",
        recomendacao: "Notificação imediata e proteção"
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
        erro: "Confrontar responsável durante consulta",
        descricao: "Pode colocar criança em risco",
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
        nome: "Segurança, documentação, notificação e rede de proteção",
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
        componentes_obrigatorios: ["História do trauma", "Investigação cuidadosa"]
},
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Exame físico completo", "Documentação de lesões"]
},
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Suspeita de abuso"]
},
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Notificação compulsória", "Acionamento de rede"]
}
},

  feedbackModelo: {
      acertos_esperados: ["Reconhecimento de abuso", "Notificação realizada", "Proteção da criança"],
      erros_comuns: ["Não investigar história", "Não notificar", "Confrontar responsável"],
      orientacoes_pedagogicas: ["Abuso é problema médico e legal", "Notificação é obrigatória", "Proteção é prioridade"]
},

  checklistOcultoExaminador: {
      oQueProfessorQuer: "Reconhecimento de abuso e ação apropriada",
      comunicacao: ["foi cuidadoso com criança"],
      exame_fisico: ["exame completo"],
      raciocinio: ["formulou suspeita apropriada"],
      conduta: ["notificou corretamente"]
},

  temaOSCE: "Pediatria - Proteção da Criança",
  subtopicosOSCE: ["Abuso infantil", "Notificação", "Proteção"],

  diagnosticoCorreto: "Suspeita de abuso físico",
  ativo: true
} as CasoPediatricoOSCEV2;
