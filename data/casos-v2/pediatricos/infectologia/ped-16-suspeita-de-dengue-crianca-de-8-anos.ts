import { CasoPediatricoOSCEV2 } from "@/types/caso-pediatrico-osce-v2";

export const casoPed016SuspeitaDeDengueCriancaDe8: CasoPediatricoOSCEV2 = {
  id: "ped-16",
  codigo: "PED-16",
  versao: "3.0.0",

  titulo: "Suspeita de Dengue - Criança de 8 Anos",
  sistema: "Infectologia",
  tema: "Arboviroses",
  subtema: "Dengue",
  nivel: "intermediario",
  tipo_estacao: "integrada",
  tipoPaciente: "pediatrico",
  tempo_osce_minutos: 12,

  objetivo_pedagogico: "Reconhecer dengue, realizar teste do laço, avaliar sinais de alarme, orientar acompanhamento",

  dados_visiveis_ao_estudante: {
    ...{
      nome_paciente: "Danilo",
      idade: 8,
      sexo: "Masculino",
      queixa_principal: "Febre, dor no corpo e manchas na pele",
      historia_breve: "Criança com síndrome febril viral em área de dengue"
},
    acompanhante: "responsável",
    contexto_atendimento: "Atendimento pediátrico simulado OSCE"
},

  paciente: {
      id: "pac-ped-16",
      nome: "Danilo",
      idade: 8,
      sexo: "M",
      tipoPaciente: "pediatrico",
      queixaPrincipal: "Febre, dor no corpo e manchas",
      historicoDoenca: "Febre, myalgias intensas, cefaleia, manchas na pele",
      antecedentes: [],
      alergias: [],
      medicamentos_em_uso: [],
      dadosPediatricos: {
        idadeAnos: 8,
        faixaEtaria: "escolar",
        responsavel: {
          nome: "Denise",
          parentesco: "mãe"
},
        peso: "26 kg",
        aberturaResponsavel: "Doutor, meu filho está com febre alta, dor no corpo inteiro, e apareceu umas manchas vermelhas."
}
},

  respostasPaciente: {
      inicial: "Mãe: Ele acordou com febre alta.",
      febre: "Mãe: A febre chegou a 39 graus.",
      dor: "Mãe: Ele está reclamando de dor no corpo todo, dor de cabeça, dor atrás dos olhos.",
      manchas: "Mãe: Apareceu umas manchas vermelhas, principalmente no braço.",
      outros: "Mãe: Está bem fraco mesmo."
},

  dados_ocultos_do_sistema: {
    ...{
      diagnostico_principal: "Dengue (suspeita clínica)",
      diagnosticos_diferenciais: ["Influenza", "Sarampo", "Outras arboviroses"],
      sindromes_associadas: ["Dengue"]
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
      frequenciaCardiaca: 104,
      frequenciaRespiratoria: 22,
      temperatura: 38.6,
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
          "Classificação de risco",
          "Avaliação de sinais de alarme",
          "Hidratação por peso",
          "Evitar AINE/AAS",
          "Orientar retorno imediato se sinais de alarme"
],
        interpretacao: "Conduta correta depende de classificação clínica e hidratação adequada por peso."
},
      seCondutaInadequadaOuAtrasada: {
        risco: "Pode perder sinais de alarme e evolução para gravidade."
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
        nome: "NS1 (Antígeno Não-Estrutural 1)",
        descricao: "Detecção de dengue",
        resultado: "Positivo",
        valor_referencia: "Negativo",
        interpretacao: "Dengue confirmada (fase aguda)"
},
      {
        nome: "Hemograma",
        descricao: "Contagem de células",
        resultado: "Leucócitos 3.200/L, plaquetas 95.000/L",
        valor_referencia: "Leucócitos 5.000-12.000/L, plaquetas > 150.000/L",
        interpretacao: "Leucopenia e trombocitopenia compatíveis com dengue"
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
        solicitadoPor: ["hemograma", "hematócrito", "plaquetas"],
        disponivel: true,
        prioridade: "obrigatorio",
        resultado: "Leucopenia discreta, plaquetas em queda e hematócrito a acompanhar",
        interpretacao: "Ajuda a classificar risco e acompanhar evolução em suspeita de dengue.",
        valores: { leucocitos: "3.600/mm³", plaquetas: "118.000/mm³", hematocrito: "42%" }
},
      funcaoHepatica: {
        solicitadoPor: ["TGO", "TGP"],
        disponivel: true,
        prioridade: "importante",
        resultado: "Transaminases discretamente elevadas",
        interpretacao: "Pode ocorrer em dengue; monitorar conforme gravidade.",
        valores: { tgo: "72 U/L", tgp: "58 U/L" }
}
}
},

  prescricaoPediatrica: {
    pesoBase: "26 kg",
    pesoKg: 26,
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
      {
        nome: "AAS, ibuprofeno e anti-inflamatórios",
        motivo: "Aumentam risco de sangramento em suspeita de dengue."
}
    ],
    errosDeDoseCriticos: ["Prescrever dose de adulto", "Não calcular dose pelo peso", "Não explicar intervalo e dose máxima quando aplicável"]
},

  protecaoInfantil: { aplicavel: false },

  arbovirosePediatrica: {
    aplicavel: true,
    suspeita: "Dengue",
    sinaisAlarme: [
      "dor abdominal intensa",
      "vômitos persistentes",
      "sangramento",
      "letargia ou irritabilidade",
      "hipotensão",
      "hepatomegalia",
      "aumento de hematócrito com queda de plaquetas"
],
    testeDoLaco: {
      indicado: true,
      resultado: "positivo ou conforme dado do caso",
      interpretacao: "Apoia suspeita de dengue, mas não substitui avaliação de gravidade."
},
    hidratacaoPorPeso: {
      classificacao: "definir grupo clínico conforme sinais de alarme e hidratação",
      via: "oral_ou_venosa",
      calculo: "calcular por peso e classificação clínica",
      observacao: "Orientar retorno imediato se sinais de alarme."
},
    evitar: ["AAS", "ibuprofeno", "anti-inflamatórios"]
},

  cardiologiaPediatrica: { aplicavel: false },

  diagnostico: {
    principal: "Dengue",
    categoria: "Arboviroses",
    hipotesesOriginais: [
      {
        diagnostico: "Dengue (suspeita clínica)",
        probabilidade: 85,
        criterios_minimos: ["Febre", "Myalgias intensas", "Cefaleia", "Exantema", "Teste do laço positivo"]
}
],
    criteriosQueSustentam: [
      "história clínica pediátrica",
      "dados do responsável",
      "sinais vitais por idade",
      "exame físico direcionado",
      "exames complementares quando indicados"
],
    diferenciais: ["Influenza", "Sarampo", "Outras arboviroses"]
},

  condutaEsperada: {
    condutaOriginal: {
      imediata: ["Avaliar sinais de alarme", "Hidratação adequada"],
      curto_prazo: ["Evitar AINE (usar apenas paracetamol)", "Acompanhamento com hemograma"],
      longo_prazo: ["Acompanhamento até normalização de plaquetas"],
      encaminhamentos: ["Hospitalização se sinais de gravidade"]
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
        sinais: ["Dengue sem sinais de alarme"],
        descricao: "Acompanhamento ambulatorial",
        recomendacao: "Hidratação e paracetamol"
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
        erro: "Prescrever AINE",
        descricao: "Contraindicado em dengue por risco de sangramento",
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
        nome: "Classificação de risco, hidratação por peso e sinais de alarme",
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
        componentes_obrigatorios: ["Febre", "Myalgias", "Cefaleia", "Exantema"]
},
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Teste do laço", "Hemograma", "NS1"]
},
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Dengue provável"]
},
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Hidratação", "Paracetamol", "Acompanhamento", "Sinais de alarme"]
}
},

  feedbackModelo: {
      acertos_esperados: ["Reconhecimento de dengue", "Teste do laço realizado", "Orientação apropriada sobre AINE"],
      erros_comuns: ["Prescrever AINE", "Não realizar teste do laço", "Não pesquisar sinais de alarme"],
      orientacoes_pedagogicas: ["Teste do laço é útil em dengue", "AINE é contraindicado", "Sinais de alarme devem ser monitorados"]
},

  checklistOcultoExaminador: {
      oQueProfessorQuer: "Reconhecimento de dengue e conduta apropriada",
      exame_fisico: ["realizou teste do laço"],
      conduta: ["evitou AINE", "orientou sinais de alarme"]
},

  temaOSCE: "Pediatria - Arboviroses",
  subtopicosOSCE: ["Dengue", "Teste do laço", "Sinais de alarme"],

  diagnosticoCorreto: "Dengue",
  ativo: true
} as CasoPediatricoOSCEV2;
