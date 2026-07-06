import { CasoPediatricoOSCEV2 } from "@/types/caso-pediatrico-osce-v2";

export const casoPed001FebreEmCriancaDe4Anos: CasoPediatricoOSCEV2 = {
  id: "ped-01",
  codigo: "PED-01",
  versao: "3.0.0",

  titulo: "Febre em Criança de 4 Anos",
  sistema: "Geral/Infeccioso",
  tema: "Febre na Infância",
  subtema: "Infecção Viral Inespecífica",
  nivel: "iniciante",
  tipo_estacao: "integrada",
  tipoPaciente: "pediatrico",
  tempo_osce_minutos: 12,

  objetivo_pedagogico: "Realizar anamnese pediátrica adequada, investigar fonte de infecção, avaliar sinais de gravidade em criança febril",

  dados_visiveis_ao_estudante: {
    ...{
      nome_paciente: "Sofia",
      idade: 4,
      sexo: "Feminino",
      queixa_principal: "Febre há 3 dias",
      historia_breve: "Mãe relata febre e redução do apetite"
},
    acompanhante: "responsável",
    contexto_atendimento: "Atendimento pediátrico simulado OSCE"
},

  paciente: {
      id: "pac-ped-01",
      nome: "Sofia",
      idade: 4,
      sexo: "F",
      tipoPaciente: "pediatrico",
      queixaPrincipal: "Febre há 3 dias",
      historicoDoenca:
        "Iniciou com febre alta, acompanhada de redução do apetite e comportamento mais apático",
      antecedentes: ["Vacinação em dia", "Sem internações anteriores"],
      alergias: [],
      medicamentos_em_uso: [],
      dadosPediatricos: {
        idadeAnos: 4,
        faixaEtaria: "pre_escolar",
        responsavel: {
          nome: "Camila",
          parentesco: "mãe"
},
        peso: "16 kg",
        estadoVacinal: "atualizado",
        gestacaoParto: "nascida a termo, parto normal",
        desenvolvimento: "adequado para a idade",
        alimentacao: "reduzida por causa da febre",
        aberturaResponsavel:
          "Doutora, a Sofia acordou com febre alta. Tive que dar dipirona, mas continua com febre."
}
},

  respostasPaciente: {
      inicial:
        "Mãe: Ela acordou com febre ontem, já faz 3 dias. Estou preocupada.",
      febre:
        "Mãe: Medí a temperatura esta manhã, estava 38,8. Dei dipirona e esforcei com água morna.",
      apetite:
        "Mãe: Não quer comer nada. Aceita água e suco, mas muito pouco.",
      tosse:
        "Mãe: Não, não tem tosse. Ela só reclama que está cansada e quer ficar deitada.",
      vomito:
        "Mãe: Não vomitou. A urina está normal também.",
      contato:
        "Mãe: Sim, a prima dela ficou doente a semana passada com gripe.",
      vacinacao:
        "Mãe: Está tudo em dia. A última vacina foi a tríplice viral há 2 meses."
},

  dados_ocultos_do_sistema: {
    ...{
      diagnostico_principal: "Infecção Viral Inespecífica",
      diagnosticos_diferenciais: [
        "Infecção do Trato Urinário",
        "Otite Média Aguda",
        "Faringite",
        "Pneumonia Bacteriana"
],
      sindromes_associadas: ["Síndrome febril"]
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
      pressaoArterial: "100/65 mmHg",
      frequenciaCardiaca: 118,
      frequenciaRespiratoria: 28,
      temperatura: 38.8,
      saturacaoOxigenio: 97,
      peso: 16,
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
          "Avaliação de sinais de gravidade",
          "Busca de foco infeccioso",
          "Orientação de hidratação",
          "Antitérmico conforme peso quando indicado",
          "Sinais de alarme explicados ao responsável"
],
        estadoGeral: "mais ativa, aceita líquidos",
        temperatura: 37.6,
        saturacaoOxigenio: 98,
        interpretacao: "Melhora clínica após controle térmico e hidratação oral, sem sinais de gravidade no momento."
},
      seNaoOrientarSinaisAlarme: {
        risco: "Responsável pode não retornar diante de piora, desidratação, dificuldade respiratória ou prostração."
},
      sePrescreverAntibioticoSemFoco: {
        risco: "Uso desnecessário de antibiótico em quadro sem foco bacteriano provável."
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
    achadosOriginais: {
      geral: {
        estado_geral: "Criança apática, com febre",
        consciencia: "Lúcida, mas sonolenta",
        hidratacao: "Mucosas úmidas, turgor da pele normal",
        coloracao: "Palidez leve"
},
      respiratorio: {
        padrao_respiratorio: "Taquipneico para a idade",
        ausculta_pulmonar: "MV presente bilateralmente"
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
    complementaresOriginais: [
      {
        nome: "Hemograma",
        descricao: "Contagem de células sanguíneas",
        resultado: "Leucócitos 9.500/L, predomínio de linfócitos",
        valor_referencia: "5.000-15.000/L",
        interpretacao: "Padrão linfocítico sugestivo de infecção viral"
},
      {
        nome: "Urocultura",
        descricao: "Cultura de urina",
        resultado: "Negativa",
        valor_referencia: "Sem crescimento",
        interpretacao: "Exclui infecção urinária"
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
    pesoBase: "16 kg",
    pesoKg: 16,
    medicamentosPermitidos: [
      {
        nome: "Antitérmico/analgésico conforme protocolo local",
        indicacao: "Febre ou desconforto",
        dosePorPeso: "calcular por peso e protocolo institucional",
        doseCalculadaParaOCaso: "calcular usando peso do caso",
        via: "oral, se aceitando via oral",
        intervalo: "conforme medicamento e protocolo local",
        observacao: "Evitar superdosagem e orientar responsável."
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
    principal: "Infecção Viral Inespecífica",
    categoria: "Febre na Infância",
    hipotesesOriginais: [
      {
        diagnostico: "Infecção Viral Inespecífica",
        probabilidade: 70,
        criterios_minimos: ["Febre", "Padrão linfocítico", "Contato com doente"]
}
],
    criteriosQueSustentam: [
      "história clínica pediátrica",
      "dados do responsável",
      "sinais vitais por idade",
      "exame físico direcionado",
      "exames complementares quando indicados"
],
    diferenciais: [
        "Infecção do Trato Urinário",
        "Otite Média Aguda",
        "Faringite",
        "Pneumonia Bacteriana"
]
},

  condutaEsperada: {
    condutaOriginal: {
      imediata: [
        "Investigar foco de infecção",
        "Avaliar sinais de gravidade",
        "Prescrever antitérmico",
        "Orientar hidratação"
],
      curto_prazo: [
        "Monitorar temperatura",
        "Reavaliação em 48-72h",
        "Orientações aos pais"
],
      longo_prazo: ["Seguimento ambulatorial"],
      encaminhamentos: ["Pediatria geral"]
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
        sinais: ["Febre moderada", "Criança ativa"],
        descricao: "Monitorar",
        recomendacao: "Acompanhamento ambulatorial"
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
        erro:
          "Não investigar fonte de infecção (otite, garganta, urina, pulmão)",
        descricao: "Essencial para diagnóstico em criança febril",
        penalidade: 1.5,
        evitavel: true
},
      {
        erro: "Não avaliar sinais de desidratação",
        descricao:
          "Criança febril tem risco de desidratação, especialmente com redução de ingestão",
        penalidade: 1.5,
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
        componentes_obrigatorios: [
          "Duração e padrão da febre",
          "Sintomas associados",
          "Vacinação",
          "Contato com doentes"
]
},
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Sinais vitais adequados para idade",
          "Avaliação de hidratação",
          "Busca de foco",
          "Hemograma"
]
},
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "Febre de origem investigada",
          "Exclusão de gravidade"
]
},
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Antitérmico", "Hidratação", "Seguimento"]
}
},

  feedbackModelo: {
      acertos_esperados: [
        "Investigou foco sistemático",
        "Avaliou desidratação",
        "Prescreveu antitérmico",
        "Orientou pais sobre quando retornar"
],
      erros_comuns: [
        "Exame rápido sem procurar foco",
        "Não avaliar vacinação",
        "Prescrever antibiótico sem foco"
],
      orientacoes_pedagogicas: [
        "Febre é proteção - importante buscar causa",
        "Criança com vacinação em dia tem risco menor de graves",
        "Desidratação é complicação importante"
]
},

  checklistOcultoExaminador: {
      oQueProfessorQuer:
        "Anamnese pediátrica completa, exame físico sistemático procurando foco, orientações aos pais",
      comunicacao: [
        "conversou com a mãe de forma empática",
        "explicou o que estava procurando"
],
      anamnese: [
        "perguntou sobre padrão de febre",
        "investigou sintomas associados",
        "verificou vacinação"
],
      exame_fisico: ["examinou garganta", "avaliou tímpanos", "palpou abdome"],
      exames_complementares: ["pediu hemograma se indicado"],
      raciocinio: ["formulou hipóteses apropriadas"],
      conduta: ["orientou hidratação e acompanhamento"],
      soap: ["documentou corretamente"]
},

  temaOSCE: "Pediatria - Febre na Infância",
  subtopicosOSCE: ["Febre na infância", "Anamnese pediátrica", "Desidratação"],

  diagnosticoCorreto: "Infecção Viral Inespecífica",
  ativo: true
} as CasoPediatricoOSCEV2;
