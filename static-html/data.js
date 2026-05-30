// Dados dos casos OSCE para versão estática
const CASOS = [
  {
    id: 1,
    tema: "Cardiovascular",
    titulo: "Dor Torácica - Síndrome Coronariana Aguda",
    paciente: { nome: "Carlos Silva", idade: 52, sexo: "M" },
    queixa: "Dor no peito há 2 horas",
    diagnosticoCorreto: "Síndrome Coronariana Aguda (SCA) - IAMCSST",
    sinaisVitais: { pa: "160/95 mmHg", fc: 102, fr: 18, satO2: "98%" },
    achados: {
      geral: "Paciente ansioso, diaforético, em aparente sofrimento, posição antálgica.",
      cardiovascular: "Bulhas cardíacas hipofonéticas, ritmo regular, FC 102 bpm, sem sopros audíveis.",
      respiratorio: "Murmúrio vesicular presente bilateralmente, sem estertores.",
      abdominal: "Abdome mole, depressível, sem massas palpáveis.",
      membros: "Pulsos periféricos presentes e simétricos, extremidades quentes e bem perfundidas."
    }
  },
  {
    id: 2,
    tema: "Respiratório",
    titulo: "Pneumonia Adquirida na Comunidade",
    paciente: { nome: "Ana Santos", idade: 35, sexo: "F" },
    queixa: "Tosse com catarro e febre há 5 dias",
    diagnosticoCorreto: "Pneumonia Adquirida na Comunidade (PAC)",
    sinaisVitais: { pa: "120/80 mmHg", fc: 95, fr: 22, satO2: "94%" },
    achados: {
      geral: "Paciente febril, lúcida, orientada, discretamente cansada.",
      cardiovascular: "Sem alterações ausculta cardíaca, pulsos presentes e simétricos.",
      respiratorio: "Estertores crepitantes em base esquerda, murmúrio vesicular diminuído à esquerda.",
      abdominal: "Abdome mole, depressível, sem alterações.",
      membros: "Sem alterações, extremidades bem perfundidas."
    }
  },
  {
    id: 3,
    tema: "Respiratório",
    titulo: "Asma Aguda",
    paciente: { nome: "Roberto Costa", idade: 28, sexo: "M" },
    queixa: "Falta de ar e chiado no peito há 3 horas",
    diagnosticoCorreto: "Asma Aguda - Crise de Broncospasmo",
    sinaisVitais: { pa: "130/85 mmHg", fc: 110, fr: 28, satO2: "92%" },
    achados: {
      geral: "Paciente ansioso, em sofrimento, respiração acelerada.",
      cardiovascular: "Frequência cardíaca aumentada, sem alterações ausculta.",
      respiratorio: "Sibilos difusos bilaterais expiratórios, prolongamento da fase expiratória.",
      abdominal: "Sem alterações.",
      membros: "Sem alterações, cianose de extremidades discreta."
    }
  },
  {
    id: 4,
    tema: "Cardiovascular",
    titulo: "Hipertensão Arterial Sistêmica",
    paciente: { nome: "Maria Santos", idade: 58, sexo: "F" },
    queixa: "Dor de cabeça e fraqueza",
    diagnosticoCorreto: "Hipertensão Arterial Sistêmica (HAS)",
    sinaisVitais: { pa: "180/110 mmHg", fc: 88, fr: 16, satO2: "99%" },
    achados: {
      geral: "Paciente orientada, queixa de cefaleia, levemente agitada.",
      cardiovascular: "Bulhas cardíacas normofonéticas, ritmo regular, sem sopros.",
      respiratorio: "Murmúrio vesicular presente bilateralmente, sem alterações.",
      abdominal: "Abdome mole, depressível, sem massas.",
      membros: "Pulsos carotídeos palpáveis, sem assimetria."
    }
  },
  {
    id: 5,
    tema: "Respiratório",
    titulo: "Pneumonia Atípica",
    paciente: { nome: "Pedro Costa", idade: 32, sexo: "M" },
    queixa: "Tosse seca persistente há 2 semanas",
    diagnosticoCorreto: "Pneumonia Atípica",
    sinaisVitais: { pa: "118/76 mmHg", fc: 88, fr: 18, satO2: "96%" },
    achados: {
      geral: "Paciente lúcido, orientado, sem aparente sofrimento.",
      cardiovascular: "Sem alterações, pulsos normais.",
      respiratorio: "Ausculta com crepitações finas em base direita, murmúrio diminuído.",
      abdominal: "Sem alterações.",
      membros: "Sem alterações."
    }
  }
];

// Respostas mockadas para manobras de exame físico
const RESPOSTAS_MANOBRAS = {
  geral: {
    palavras: ["estado geral", "consciência", "aparência", "cor", "pele", "hidratação"],
    resposta: "Ok, você avaliou o estado geral do paciente."
  },
  cardiovascular: {
    palavras: ["ausculta", "coração", "bulhas", "pulsos", "turgência", "edema", "ictus", "sopro"],
    resposta: "Ok, você realizou manobra cardiovascular."
  },
  respiratorio: {
    palavras: ["ausculta", "pulmão", "respiração", "percussão", "tórax", "expansão", "estertores", "sibilos"],
    resposta: "Ok, você realizou exame respiratório."
  },
  abdominal: {
    palavras: ["ausculta", "abdome", "palpação", "percussão", "inspecção", "sons", "dor"],
    resposta: "Ok, você realizou exame abdominal."
  },
  membros: {
    palavras: ["edema", "pulsos", "extremidades", "perfusão", "cianose", "temperatura", "simetria"],
    resposta: "Ok, você avaliou os membros."
  }
};

// Respostas mockadas do chat do paciente
const RESPOSTAS_CHAT = {
  sintomas: "Começou de repente enquanto eu estava em repouso. A dor é forte e contínua.",
  historico: "Não tenho doenças prévias, mas meu pai teve infarto aos 60 anos.",
  duracao: "Já faz 2 horas que começou a dor.",
  irradiacao: "A dor irradia para o braço esquerdo e pescoço.",
  medicacoes: "Não tomo medicações regularmente.",
  alergias: "Não tenho alergias conhecidas.",
  default: "Entendo. Pode me examinar, por favor. Estou muito preocupado."
};

// Feedback mockado
function gerarFeedbackMockado(caso, dados) {
  return {
    nota: 6.5,
    percentual: 65,
    classificacao: "Regular",
    justificativaNota: "O estudante realizou uma abordagem adequada, mas deixou passar algumas manobras essenciais do exame físico.",
    resumoCaso: {
      diagnosticoEsperado: caso.diagnosticoCorreto,
      sindromePrincipal: caso.titulo.split(" - ")[1] || caso.titulo,
      achadosChave: Object.values(caso.achados).slice(0, 3),
      raciocinioEsperado: "Análise sistemática da apresentação clínica e achados físicos."
    },
    acertos: [
      "Realizou anamnese direcionada",
      "Solicitou sinais vitais",
      "Conduziu exame físico parcial",
      "Apresentou hipótese diagnóstica coerente"
    ],
    erros: [
      "Faltou uma investigação mais profunda sobre fatores de risco",
      "Exame físico incompleto",
      "Não explorou completamente os sintomas associados"
    ],
    manobrasRealizadas: dados.manobrasRealizadas || [],
    manobrasEsquecidas: ["ausculta cardíaca completa", "pesquisa de edema"],
    feedback: "Bom trabalho! Sua abordagem foi sistemática. Para melhorar, explore mais profundamente os sintomas e realize manobras mais detalhadas."
  };
}

// Plano de estudo mockado
function gerarPlanoEstudo(caso) {
  const planos = {
    "Cardiovascular": [
      {
        topico: "Revisar sinais e sintomas de dor torácica",
        explicacao: "Dor torácica é um sintoma que pode ter várias causas. Estude como diferenciarem dor de origem cardíaca, pleural, musculoesquelética e gastrointestinal pela qualidade, irradiação, fatores de piora/melhora e fatores de risco associados."
      },
      {
        topico: "Aprofundar ausculta cardíaca e pesquisa de sinais de gravidade",
        explicacao: "A ausculta cardíaca é fundamental no exame do paciente com suspeita de doença cardíaca. Revise como identificar taquicardia, ritmos irregulares, sopros e terceira bulha. Esses achados ajudam no raciocínio diagnóstico."
      },
      {
        topico: "Estudar critérios diagnósticos e diferenciais em dor torácica",
        explicacao: "Várias condições causam dor torácica (SCA, embolia pulmonar, pneumotórax, esofagite, pericardite). Estude os critérios que ajudam a diferenciar cada uma, com foco em quanto mais rápido se estabelece o diagnóstico, melhor para o paciente."
      },
      {
        topico: "Praticar interpretação de sinais vitais em urgência",
        explicacao: "Em pacientes com possível doença aguda, sinais vitais alterados (PA elevada, FC acelerada, FR aumentada) são pistas importantes. Aprenda a reconhecê-los e ajuste sua conduta com base neles."
      }
    ],
    "Respiratório": [
      {
        topico: "Aprofundar em ausculta pulmonar",
        explicacao: "Murmúrios vesiculares diminuídos, estertores crepitantes, sibilos e roncos são achados clínicos importantes. Estude o padrão e localização de cada um para ajudar no diagnóstico diferencial de doenças respiratórias."
      },
      {
        topico: "Revisar diferenças entre pneumonia típica e atípica",
        explicacao: "Pneumonia bacteriana (típica) costuma ter início mais abrupto, febre alta, tosse com escarro purulento. Pneumonia atípica (vírus, Mycoplasma) tem quadro mais leve, tosse seca, febre baixa. Conheça essas diferenças para seu raciocínio diagnóstico."
      },
      {
        topico: "Estudar achados de consolidação pulmonar no exame físico",
        explicacao: "Consolidação (como em pneumonia) causa padrão previsível: redução da expansibilidade, aumento do FTV, submacicez/macicez à percussão e estertores à ausculta. Estude como procurar por esses achados sistematicamente."
      },
      {
        topico: "Aprender a investigar sintomas respiratórios de forma estruturada",
        explicacao: "Na anamnese respiratória, investigue: início, duração, frequência, tipo de tosse, presença de escarro, cor e consistência, febre, dispneia, dor torácica e fatores de risco (tabagismo, contato com doentes). Essas perguntas direcionam o diagnóstico."
      }
    ],
    "Abdome": [
      {
        topico: "Revisar sequência correta do exame abdominal",
        explicacao: "A ordem correta é: inspeção, ausculta, percussão, palpação. Lembre que ausculta vem antes de palpação (palpação pode alterar ruídos). Estude cada passo e o que procurar em cada um."
      },
      {
        topico: "Aprofundar sinais de peritonite e abdome agudo",
        explicacao: "Defesa muscular, descompressão brusca positiva, abdome endurecido e dor à palpação profunda são sinais de peritonite. Esses achados mudam a urgência do atendimento. Saiba reconhecê-los."
      },
      {
        topico: "Estudar pesquisa de visceromegalias",
        explicacao: "Fígado, baço e rins aumentados (hepatomegalia, esplenomegalia) são importantes de detectar. Aprenda a técnica de palpação correta e as dimensões esperadas em cada órgão."
      }
    ]
  };

  const temaPlano = planos[caso.tema] || [
    {
      topico: "Revisar apresentação clínica do caso",
      explicacao: "Estude como o paciente se apresenta, quais são os sintomas principais e como eles evoluem. Isso ajuda no raciocínio diagnóstico."
    },
    {
      topico: "Aprofundar no diagnóstico diferencial",
      explicacao: "Nem sempre a primeira hipótese é a correta. Pratique levantar alternativas diagnósticas e pensar em critérios que as confirmem ou excluam."
    },
    {
      topico: "Estudar conduta e investigação complementar",
      explicacao: "Após a hipótese diagnóstica, estudar quais exames são realmente necessários, em qual ordem, e como interpretar os resultados para sua conduta."
    }
  ];

  return temaPlano;
}
