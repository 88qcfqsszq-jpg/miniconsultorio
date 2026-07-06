import { CasoPediatricoOSCEV2 } from "@/types/caso-pediatrico-osce-v2";

export const casoPed013PneumoniaAdquiridaNaComunidadeCriancaDe: CasoPediatricoOSCEV2 = {
  id: "ped-13",
  codigo: "PED-13",
  versao: "3.0.0",

  titulo: "Pneumonia Adquirida na Comunidade - Criança de 5 Anos",
  sistema: "Respiratório",
  tema: "Pneumonia",
  subtema: "Pneumonia adquirida na comunidade",
  nivel: "intermediario",
  tipo_estacao: "integrada",
  tipoPaciente: "pediatrico",
  tempo_osce_minutos: 15,

  objetivo_pedagogico: "Reconhecer pneumonia, avaliar gravidade, solicitar RX e exames, prescrever antibiótico",

  dados_visiveis_ao_estudante: {
    ...{
      nome_paciente: "Ricardo",
      idade: 5,
      sexo: "Masculino",
      queixa_principal: "Febre, tosse e dificuldade respiratória",
      historia_breve: "Criança com sintomas respiratórios há 4 dias"
},
    acompanhante: "responsável",
    contexto_atendimento: "Atendimento pediátrico simulado OSCE"
},

  paciente: {
      id: "pac-ped-13",
      nome: "Ricardo",
      idade: 5,
      sexo: "M",
      tipoPaciente: "pediatrico",
      queixaPrincipal: "Febre, tosse e dificuldade respiratória",
      historicoDoenca: "Iniciou com febre, tosse seca que ficou produtiva, dificuldade respiratória progressiva",
      antecedentes: [],
      alergias: [],
      medicamentos_em_uso: [],
      dadosPediatricos: {
        idadeAnos: 5,
        faixaEtaria: "pre_escolar",
        responsavel: {
          nome: "Renata",
          parentesco: "mãe"
},
        peso: "18 kg",
        aberturaResponsavel: "Doutor, meu filho ficou com febre alta e agora está respirando rápido e tossindo bastante."
}
},

  respostasPaciente: {
      inicial: "Mãe: Ele acordou com febre há 4 dias.",
      febre: "Mãe: Tem febre alta, chegou a 39,5 graus.",
      tosse: "Mãe: Tosse bastante, tem catarro que ele não consegue expelir direito.",
      respiracao: "Mãe: Está respirando rápido e com dificuldade.",
      apetite: "Mãe: Não quer comer quase nada."
},

  dados_ocultos_do_sistema: {
    ...{
      diagnostico_principal: "Pneumonia adquirida na comunidade",
      diagnosticos_diferenciais: ["Bronquiolite", "Asma exacerbada"],
      sindromes_associadas: ["Pneumonia"]
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
      frequenciaCardiaca: 124,
      frequenciaRespiratoria: 48,
      temperatura: 39.2,
      saturacaoOxigenio: 91,
      peso: 18,
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
        resultado: "Infiltrado consolidativo em base direita",
        valor_referencia: "Normal",
        interpretacao: "Pneumonia confirmada"
},
      {
        nome: "Hemograma",
        descricao: "Contagem de células",
        resultado: "Leucócitos 14.500/L, predomínio de neutrófilos",
        valor_referencia: "5.000-15.000/L",
        interpretacao: "Inflamação presente"
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
        prioridade: "importante",
        resultado: "Leucocitose com neutrofilia",
        interpretacao: "Apoia etiologia bacteriana no contexto clínico.",
        valores: { leucocitos: "15.800/mm³", neutrofilos: "82%", bastonetes: "6%", plaquetas: "330.000/mm³" }
},
      marcadoresInflamatorios: {
        solicitadoPor: ["PCR", "procalcitonina"],
        disponivel: true,
        prioridade: "condicional",
        resultado: "PCR elevada",
        interpretacao: "Pode auxiliar em gravidade e seguimento, não substitui avaliação clínica.",
        valores: { pcr: "12 mg/dL", procalcitonina: "0,8 ng/mL" }
}
}
},

  prescricaoPediatrica: {
    pesoBase: "18 kg",
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
    principal: "Pneumonia adquirida na comunidade",
    categoria: "Pneumonia",
    hipotesesOriginais: [
      {
        diagnostico: "Pneumonia adquirida na comunidade",
        probabilidade: 90,
        criterios_minimos: ["Febre", "Tosse", "Taquipneia", "Crepitações", "Consolidação em RX"]
}
],
    criteriosQueSustentam: [
      "história clínica pediátrica",
      "dados do responsável",
      "sinais vitais por idade",
      "exame físico direcionado",
      "exames complementares quando indicados"
],
    diferenciais: ["Bronquiolite", "Asma exacerbada"]
},

  condutaEsperada: {
    condutaOriginal: {
      imediata: ["Prescrever antibiótico (amoxicilina ou ceftriaxona)"],
      curto_prazo: ["Monitorar resposta ao antibiótico", "Orientar sinais de alarme"],
      longo_prazo: ["Acompanhamento"],
      encaminhamentos: ["Hospitalização se grave"]
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
        sinais: ["Taquipneia importante", "SatO2 91%"],
        descricao: "Pneumonia moderada",
        recomendacao: "Antibiótico oral com acompanhamento"
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
        erro: "Não reconhecer pneumonia e prescrever antitérmico apenas",
        descricao: "Necessário antibiótico",
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
        componentes_obrigatorios: ["Febre", "Tosse", "Dificuldade respiratória"]
},
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["FR, taquipneia", "Ausculta com crepitações", "RX com consolidação"]
},
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Pneumonia adquirida na comunidade"]
},
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Antibiótico", "Seguimento"]
}
},

  feedbackModelo: {
      acertos_esperados: ["Reconhecimento de pneumonia", "RX solicitado", "Antibiótico prescrito"],
      erros_comuns: ["Pensar em viral", "Não solicitar RX", "Não prescrever antibiótico"],
      orientacoes_pedagogicas: ["Taquipneia é sinal importante", "Crepitações indicam consolidação", "RX confirma diagnóstico"]
},

  checklistOcultoExaminador: {
      oQueProfessorQuer: "Reconhecimento de pneumonia",
      anamnese: ["investigou adequadamente"],
      exame_fisico: ["contou FR corretamente", "ausculta completa"],
      exames_complementares: ["RX solicitado"],
      conduta: ["antibiótico prescrito"]
},

  temaOSCE: "Pediatria - Pneumonia",
  subtopicosOSCE: ["Pneumonia", "Taquipneia", "Crepitações"],

  diagnosticoCorreto: "Pneumonia adquirida na comunidade",
  ativo: true
} as CasoPediatricoOSCEV2;
