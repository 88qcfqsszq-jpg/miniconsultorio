/**
 * Diagnosis Microcriteria — microcritérios ESPECÍFICOS por diagnóstico.
 *
 * Quando o diagnóstico esperado do caso é reconhecido, estes microcritérios
 * (clinicamente específicos, atômicos) têm prioridade sobre os genéricos do
 * cards-config.ts. Os genéricos seguem como fallback/complemento de cobertura.
 *
 * Cada lista mapeia para um dos 6 cards (eixos). "condutaSeguranca" cobre
 * axis:conduta_seguranca (que consome axis:conduta e axis:seguranca).
 */

export type DiagnosticoRubricaKey =
  | "anemia_hemolitica"
  | "asma"
  | "virose_pediatrica"
  | "dengue_classica"
  | "dengue_grave"
  | "pneumonia_pediatrica"
  | "gastroenterite"
  | "amigdalite_faringite"
  // Lote 2A — cardiopulmonar adulto
  | "sca_iam"
  | "insuficiencia_cardiaca"
  | "dpoc_exacerbado"
  | "pneumonia_adulto"
  | "tep"
  | "pneumotorax"
  // Lote 2B — cardiovascular / torácico avançado
  | "ic_cronica_estavel"
  | "arritmia_fibrilacao_atrial"
  | "estenose_aortica_valvopatia"
  | "pericardite_aguda"
  | "disseccao_aorta"
  | "derrame_pleural"
  // Lote 3 — infectologia / urgência adulto
  | "sepse_choque_septico"
  | "itu_baixa_cistite"
  | "pielonefrite"
  | "meningite"
  | "tuberculose_pulmonar"
  | "endocardite_infecciosa"
  | "celulite_erisipela"
  // Lote 4 — neurologia / urgências neurológicas
  | "avc_isquemico"
  | "ait"
  | "avc_hemorragico"
  | "crise_convulsiva_epilepsia"
  | "cefaleia_hsa"
  | "vertigem_sindrome_vestibular"
  | "rebaixamento_consciencia";

export interface DiagnosisMicrocriteria {
  aliases: string[];
  criteriosPorCard: {
    comunicacao: string[];
    anamnese: string[];
    exameFisico: string[];
    examesComplementares: string[];
    raciocinioDiagnostico: string[];
    condutaSeguranca: string[];
  };
}

export const DIAGNOSIS_MICROCRITERIA: Record<DiagnosticoRubricaKey, DiagnosisMicrocriteria> = {
  anemia_hemolitica: {
    aliases: [
      "anemia hemolitica",
      "anemia hemolitica autoimune",
      "hemolise",
      "hemolitica",
      "aha",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
        "Explicou que os sintomas podem estar relacionados a alteração no sangue ou destruição de hemácias, em linguagem acessível.",
        "Orientou que seriam necessários exames para confirmar a causa da anemia.",
        "Demonstrou acolhimento diante de cansaço, icterícia ou preocupação com a gravidade.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou sintomas de anemia como fadiga, fraqueza, dispneia, palpitações, tontura ou síncope.",
        "Investigou icterícia, urina escura/colúria ou mudança da cor da pele ou olhos.",
        "Investigou febre, infecção recente ou sintomas virais prévios.",
        "Investigou uso recente de medicamentos, antibióticos, antimaláricos, fitoterápicos ou exposição a substâncias.",
        "Investigou antecedentes de doença autoimune, transfusão, doença hematológica ou episódios prévios de anemia ou icterícia.",
        "Investigou história familiar de anemia, esplenectomia, icterícia recorrente ou doenças hereditárias.",
        "Pesquisou sinais de gravidade como dispneia importante, dor torácica, síncope, confusão, hipotensão ou piora rápida.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e estabilidade hemodinâmica.",
        "Avaliou palidez cutâneo-mucosa.",
        "Avaliou icterícia em pele ou escleras.",
        "Avaliou perfusão periférica, estado geral ou nível de consciência.",
        "Pesquisou hepatoesplenomegalia ou dor abdominal quando aplicável.",
        "Procurou sinais de gravidade como taquicardia, hipotensão, dispneia ou prostração importante.",
      ],
      examesComplementares: [
        "Solicitou hemograma completo para confirmar anemia e avaliar índices hematimétricos.",
        "Solicitou contagem de reticulócitos para avaliar resposta medular ou hemólise.",
        "Solicitou bilirrubina total e frações para avaliar hemólise.",
        "Considerou LDH e haptoglobina como marcadores de hemólise.",
        "Considerou Coombs direto quando há suspeita de hemólise autoimune.",
        "Considerou esfregaço de sangue periférico quando aplicável.",
        "Solicitou exames para gravidade ou complicações como função renal ou eletrólitos conforme instabilidade.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu anemia hemolítica como hipótese principal.",
        "Correlacionou anemia com reticulocitose, icterícia, bilirrubina indireta elevada ou marcadores de hemólise.",
        "Diferenciou anemia hemolítica de anemia ferropriva isolada, sangramento agudo ou anemia de doença crônica quando aplicável.",
        "Considerou causas de hemólise como autoimune, medicamentosa, infecciosa, hereditária ou microangiopática conforme contexto.",
        "Avaliou gravidade clínica e risco de complicações.",
        "Reavaliou a hipótese diagnóstica com base nos exames apresentados.",
      ],
      condutaSeguranca: [
        "Propôs investigação etiológica da hemólise.",
        "Avaliou gravidade da anemia ou hemólise antes de definir alta, acompanhamento ou encaminhamento.",
        "Indicou acompanhamento, reavaliação ou encaminhamento conforme gravidade.",
        "Reconheceu necessidade de urgência ou internação se houver instabilidade, anemia grave, síncope, dor torácica ou dispneia importante.",
        "Orientou sinais de alarme como piora da falta de ar, síncope, dor torácica, febre persistente, icterícia intensa, urina muito escura ou prostração.",
        "Evitou encerrar o atendimento sem plano de seguimento ou investigação.",
        "Considerou suporte clínico conforme gravidade como hidratação, monitorização ou avaliação especializada.",
      ],
    },
  },

  asma: {
    aliases: [
      "asma",
      "asma aguda",
      "crise asmatica",
      "exacerbacao asmatica",
      "exacerbacao de asma",
      "broncoespasmo",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
        "Explicou de forma clara que avaliaria a respiração e a gravidade da crise.",
        "Usou linguagem simples para orientar sobre broncodilatador, sinais de piora e retorno.",
        "Demonstrou acolhimento diante de falta de ar, ansiedade ou medo do paciente.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou início, duração e evolução da falta de ar, tosse, chiado ou aperto no peito.",
        "Investigou intensidade da crise e limitação para falar, dormir, caminhar ou realizar atividades.",
        "Investigou uso prévio de broncodilatador, resposta ao medicamento e frequência de uso.",
        "Investigou histórico de asma, crises anteriores, internações, UTI, intubação ou idas à emergência.",
        "Investigou gatilhos como infecção viral, alérgenos, exercício, fumaça, poeira, mofo ou clima.",
        "Investigou uso de medicações de controle, adesão, técnica inalatória ou acesso à bombinha.",
        "Pesquisou sinais de gravidade como sonolência, cianose, exaustão, fala entrecortada ou piora progressiva.",
      ],
      exameFisico: [
        "Avaliou sinais vitais incluindo frequência respiratória, frequência cardíaca e saturação de oxigênio.",
        "Avaliou esforço respiratório, uso de musculatura acessória, tiragens ou capacidade de falar.",
        "Realizou ausculta pulmonar procurando sibilos, redução do murmúrio vesicular ou tórax silencioso.",
        "Avaliou estado geral, nível de consciência, cianose ou sinais de exaustão.",
        "Classificou a gravidade clínica da crise com base nos achados.",
      ],
      examesComplementares: [
        "Reconheceu que o diagnóstico de crise asmática é principalmente clínico.",
        "Solicitou oximetria de pulso ou monitorização da saturação quando pertinente.",
        "Considerou pico de fluxo expiratório quando disponível e aplicável.",
        "Considerou radiografia de tórax apenas se sinais de complicação, diagnóstico alternativo, febre, dor torácica, assimetria auscultatória ou má resposta.",
        "Considerou gasometria em crise grave, exaustão, hipoxemia persistente ou rebaixamento.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu crise asmática ou exacerbação de asma como hipótese principal.",
        "Correlacionou dispneia, sibilância, tosse, aperto torácico e resposta a broncodilatador.",
        "Classificou a gravidade da crise com base em fala, esforço respiratório, saturação, ausculta e estado geral.",
        "Considerou diagnósticos diferenciais como pneumonia, bronquiolite, anafilaxia, corpo estranho, TEP ou insuficiência cardíaca quando aplicável.",
        "Identificou sinais de risco de evolução grave.",
        "Reavaliou a hipótese após resposta inicial ao tratamento.",
      ],
      condutaSeguranca: [
        "Indicou broncodilatador de resgate adequado como salbutamol inalatório ou nebulizado conforme contexto.",
        "Considerou corticosteroide sistêmico em crise moderada ou grave ou sem resposta adequada.",
        "Indicou oxigênio se saturação baixa ou desconforto importante.",
        "Reavaliou a resposta clínica após o tratamento inicial.",
        "Definiu alta, observação, encaminhamento ou internação conforme gravidade e resposta.",
        "Orientou sinais de alarme como piora da falta de ar, fala entrecortada, sonolência, lábios arroxeados ou queda da saturação.",
        "Orientou técnica inalatória, plano de ação ou necessidade de acompanhamento.",
        "Evitou alta insegura em paciente com sinais de gravidade, hipoxemia, exaustão ou má resposta.",
      ],
    },
  },

  virose_pediatrica: {
    aliases: [
      "infeccao viral inespecifica",
      "virose",
      "virose pediatrica",
      "sindrome viral",
      "febre viral",
      "quadro viral inespecifico",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao responsável ou identificou seu papel no atendimento.",
        "Explicou em linguagem simples que o quadro pode ser compatível com infecção viral.",
        "Orientou que a evolução clínica e sinais de alarme guiam a necessidade de retorno.",
        "Demonstrou acolhimento diante da preocupação dos responsáveis.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou início, duração e padrão da febre.",
        "Investigou sintomas associados como tosse, coriza, dor de garganta, vômitos, diarreia, dor abdominal, dor de ouvido ou disúria.",
        "Investigou aceitação alimentar e ingesta hídrica.",
        "Investigou diurese e sinais indiretos de hidratação.",
        "Investigou vacinação, contatos doentes ou exposição recente.",
        "Pesquisou sinais de gravidade como prostração importante, sonolência, dificuldade respiratória, rigidez de nuca, manchas na pele ou piora progressiva.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e estado geral.",
        "Avaliou hidratação, mucosas, lágrimas, perfusão e diurese referida.",
        "Avaliou orofaringe ou ouvido quando a queixa era compatível.",
        "Realizou ausculta pulmonar quando havia sintomas respiratórios.",
        "Avaliou abdome e pele quando aplicável.",
        "Procurou sinais de gravidade ou toxemia.",
      ],
      examesComplementares: [
        "Reconheceu que virose pediátrica pode ser diagnóstico clínico quando não há sinais de alarme.",
        "Solicitou exames apenas se febre persistente, sinais de gravidade, dúvida diagnóstica ou suspeita bacteriana.",
        "Considerou hemograma, urina ou exames direcionados conforme sintomas.",
        "Evitou exames desnecessários em quadro viral leve e bem compensado.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu síndrome febril provavelmente viral quando compatível.",
        "Relacionou febre e sintomas inespecíficos a quadro viral autolimitado.",
        "Considerou diagnósticos diferenciais relevantes em criança febril.",
        "Excluiu sinais clínicos de infecção bacteriana grave.",
        "Reavaliou a hipótese conforme exame físico e evolução.",
      ],
      condutaSeguranca: [
        "Propôs hidratação e medidas de suporte.",
        "Orientou antitérmico conforme peso e necessidade.",
        "Definiu necessidade de reavaliação ou retorno.",
        "Orientou sinais de alarme como piora do estado geral, sonolência, dificuldade respiratória, desidratação, febre persistente, convulsão, manchas na pele ou recusa hídrica.",
        "Evitou antibiótico sem indicação clínica.",
        "Encaminhou se houvesse sinais de gravidade ou instabilidade.",
      ],
    },
  },

  dengue_grave: {
    aliases: [
      "dengue grave",
      "dengue com sinais de alarme",
      "choque por dengue",
      "dengue hemorragica",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Comunicou a gravidade potencial do quadro de forma clara.",
        "Explicou a necessidade de atendimento urgente, observação ou internação.",
        "Orientou responsáveis ou paciente sobre risco e sinais de alarme.",
        "Manteve postura acolhedora.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou dor abdominal intensa, vômitos persistentes, sangramentos, lipotimia, sonolência ou irritabilidade.",
        "Investigou redução de diurese, sede intensa ou sinais de choque.",
        "Investigou dia de doença e queda recente da febre.",
        "Investigou comorbidades, gestação, extremos de idade ou risco social.",
        "Investigou uso de medicamentos que aumentem sangramento.",
      ],
      exameFisico: [
        "Avaliou pressão arterial, pulso, perfusão, enchimento capilar e extremidades.",
        "Avaliou sinais de choque ou instabilidade.",
        "Procurou sangramentos, petéquias, hepatomegalia ou dor abdominal.",
        "Avaliou hidratação, estado neurológico e diurese.",
        "Avaliou sinais respiratórios ou derrames quando suspeitos.",
      ],
      examesComplementares: [
        "Solicitou hemograma seriado com hematócrito e plaquetas.",
        "Solicitou função hepática, função renal, eletrólitos ou coagulograma conforme gravidade.",
        "Considerou imagem para derrames ou ascite se indicado.",
        "Monitorou sinais laboratoriais de choque, sangramento ou disfunção orgânica.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu dengue com sinais de alarme ou dengue grave.",
        "Relacionou sinais clínicos a risco de extravasamento plasmático, choque ou sangramento.",
        "Diferenciou dengue grave de virose simples.",
        "Estratificou risco e necessidade de manejo urgente.",
      ],
      condutaSeguranca: [
        "Indicou encaminhamento urgente, observação ou internação conforme gravidade.",
        "Iniciou hidratação venosa conforme protocolo e estabilidade.",
        "Monitorou sinais vitais, diurese e resposta clínica.",
        "Evitou AINEs ou medicações de risco.",
        "Orientou que o quadro exige acompanhamento próximo e retorno imediato se piora.",
      ],
    },
  },

  dengue_classica: {
    aliases: [
      "dengue",
      "dengue classica",
      "dengue sem sinais de alarme",
      "arbovirose dengue",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Explicou a suspeita de dengue em linguagem acessível.",
        "Orientou a importância de hidratação e observação.",
        "Explicou os sinais de alarme de forma clara.",
        "Confirmou compreensão do paciente ou responsável.",
      ],
      anamnese: [
        "Investigou febre, mialgia, cefaleia, dor retro-orbitária, náuseas, vômitos, exantema ou artralgia.",
        "Investigou o início e o dia de doença.",
        "Investigou sangramentos, dor abdominal, vômitos persistentes, tontura ou prostração.",
        "Investigou comorbidades, gestação, idade de risco ou uso de anticoagulantes ou AINEs.",
        "Investigou hidratação, diurese e exposição epidemiológica.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e estabilidade hemodinâmica.",
        "Avaliou hidratação e perfusão.",
        "Procurou sangramentos, petéquias ou prova do laço quando aplicável.",
        "Avaliou dor abdominal, hepatomegalia ou sinais de alarme.",
        "Avaliou o estado geral.",
      ],
      examesComplementares: [
        "Solicitou hemograma com plaquetas e hematócrito quando indicado.",
        "Considerou NS1, sorologia ou teste conforme dia de doença e disponibilidade.",
        "Avaliou sinais laboratoriais de gravidade ou hemoconcentração.",
        "Solicitou exames adicionais conforme sinais de alarme ou comorbidades.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu dengue provável diante de síndrome febril compatível e contexto epidemiológico.",
        "Diferenciou dengue sem sinais de alarme de dengue com sinais de alarme.",
        "Considerou diferenciais como virose comum, chikungunya, zika, influenza ou sepse.",
        "Relacionou sinais clínicos e laboratoriais à estratificação de risco.",
      ],
      condutaSeguranca: [
        "Indicou hidratação adequada.",
        "Evitou AINEs e orientou analgésico ou antitérmico seguro conforme protocolo local.",
        "Orientou sinais de alarme e retorno imediato.",
        "Definiu acompanhamento ou reavaliação conforme dia de doença e risco.",
        "Encaminhou se sinais de alarme ou gravidade.",
      ],
    },
  },

  pneumonia_pediatrica: {
    aliases: [
      "pneumonia pediatrica",
      "pneumonia infantil",
      "pneumonia comunitaria pediatrica",
      "pneumonia adquirida na comunidade pediatrica",
      "pac pediatrica",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Explicou a suspeita de infecção respiratória ou pneumonia em linguagem acessível.",
        "Orientou os sinais de gravidade respiratória.",
        "Explicou a necessidade de tratamento e reavaliação.",
        "Confirmou compreensão do responsável.",
      ],
      anamnese: [
        "Investigou febre, tosse, taquipneia, dificuldade respiratória, dor torácica ou recusa alimentar.",
        "Investigou a duração e a evolução dos sintomas.",
        "Investigou comorbidades, prematuridade, asma, cardiopatia ou imunossupressão.",
        "Investigou vacinação e contato com doentes.",
        "Pesquisou sinais de gravidade como cianose, gemência, sonolência ou incapacidade de ingerir líquidos.",
      ],
      exameFisico: [
        "Avaliou frequência respiratória e saturação.",
        "Avaliou esforço respiratório, tiragens, batimento de asa nasal ou gemência.",
        "Realizou ausculta pulmonar procurando crepitações, redução de murmúrio ou sibilos.",
        "Avaliou estado geral, hidratação e perfusão.",
        "Avaliou sinais de gravidade.",
      ],
      examesComplementares: [
        "Reconheceu que pneumonia pode ser diagnóstico clínico em muitos casos.",
        "Considerou radiografia de tórax se dúvida diagnóstica, gravidade, hipoxemia, complicação ou falha terapêutica.",
        "Considerou hemograma ou PCR conforme gravidade ou dúvida.",
        "Solicitou oximetria quando indicado.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu pneumonia diante de febre, tosse e sinais respiratórios.",
        "Diferenciou pneumonia de virose de vias aéreas, asma ou bronquiolite.",
        "Classificou gravidade com base em idade, frequência respiratória, saturação, esforço e estado geral.",
        "Considerou complicações se houvesse sinais sugestivos.",
      ],
      condutaSeguranca: [
        "Indicou antibiótico quando pneumonia bacteriana provável ou conforme protocolo.",
        "Indicou medidas de suporte, hidratação e antitérmico.",
        "Encaminhou se hipoxemia, desconforto importante, incapacidade de ingerir líquidos, toxemia ou idade de risco.",
        "Orientou sinais de alarme respiratório.",
        "Definiu reavaliação.",
      ],
    },
  },

  gastroenterite: {
    aliases: [
      "gastroenterite",
      "gastroenterite aguda",
      "diarreia aguda",
      "vomitos e diarreia",
      "desidratacao",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Explicou o provável quadro gastrointestinal e o risco de desidratação.",
        "Orientou a hidratação oral de forma clara.",
        "Explicou os sinais de alarme.",
        "Confirmou compreensão do responsável.",
      ],
      anamnese: [
        "Investigou início, frequência e características da diarreia ou vômitos.",
        "Investigou presença de sangue ou muco nas fezes.",
        "Investigou febre, dor abdominal, aceitação alimentar e de líquidos.",
        "Investigou diurese, sede, prostração e sinais de desidratação.",
        "Investigou contatos, alimentos suspeitos, viagem ou exposição.",
        "Investigou idade, comorbidades e risco.",
      ],
      exameFisico: [
        "Avaliou estado geral e sinais vitais.",
        "Avaliou hidratação: mucosas, lágrimas, olhos fundos, turgor, perfusão e enchimento capilar.",
        "Avaliou o abdome.",
        "Avaliou nível de consciência e diurese referida.",
        "Classificou o grau de desidratação.",
      ],
      examesComplementares: [
        "Reconheceu que gastroenterite leve ou moderada costuma ser diagnóstico clínico.",
        "Solicitou exames se desidratação grave, sangue nas fezes, toxemia, lactente pequeno ou persistência.",
        "Considerou eletrólitos ou função renal em desidratação relevante.",
        "Evitou exames desnecessários em quadro leve.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu gastroenterite aguda ou desidratação conforme o quadro.",
        "Classificou a gravidade da desidratação.",
        "Considerou diferenciais como abdome agudo, infecção urinária, sepse ou intoxicação alimentar quando indicado.",
        "Relacionou vômitos e diarreia à perda hídrica e risco clínico.",
      ],
      condutaSeguranca: [
        "Indicou solução de reidratação oral quando possível.",
        "Indicou hidratação venosa ou encaminhamento se desidratação grave, choque ou incapacidade de ingerir líquidos.",
        "Orientou manutenção da alimentação quando apropriado.",
        "Orientou sinais de alarme e retorno.",
        "Evitou antidiarreicos inadequados em criança.",
      ],
    },
  },

  amigdalite_faringite: {
    aliases: [
      "amigdalite",
      "faringite",
      "amigdalofaringite",
      "faringoamigdalite",
      "tonsilite",
      "odinofagia febril",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Explicou a suspeita de infecção de garganta em linguagem acessível.",
        "Orientou a diferença entre quadro viral e possível bacteriano.",
        "Explicou os sinais de alarme e o retorno.",
        "Confirmou compreensão.",
      ],
      anamnese: [
        "Investigou dor de garganta, febre, odinofagia, tosse, coriza, rouquidão, exantema ou dor abdominal.",
        "Investigou a duração e a evolução.",
        "Investigou contato com pessoas doentes ou estreptococo.",
        "Investigou dificuldade para engolir saliva, trismo, voz abafada ou dispneia.",
        "Investigou alergias medicamentosas.",
      ],
      exameFisico: [
        "Avaliou orofaringe, amígdalas, exsudato, hiperemia e petéquias.",
        "Avaliou linfonodos cervicais.",
        "Avaliou sinais vitais e estado geral.",
        "Procurou sinais de abscesso peritonsilar ou obstrução.",
        "Avaliou hidratação se baixa ingesta.",
      ],
      examesComplementares: [
        "Considerou teste rápido ou cultura para estreptococo quando indicado.",
        "Reconheceu que muitos quadros são virais e não exigem exame.",
        "Solicitou exames apenas se gravidade, dúvida ou complicação.",
        "Evitou antibiótico sem critério.",
      ],
      raciocinioDiagnostico: [
        "Diferenciou faringite viral de possível faringoamigdalite estreptocócica.",
        "Considerou sinais de complicação como abscesso.",
        "Relacionou presença ou ausência de tosse, coriza, exsudato, febre e linfonodos ao raciocínio.",
        "Considerou diagnósticos diferenciais conforme o quadro.",
      ],
      condutaSeguranca: [
        "Indicou analgesia ou antitérmico e hidratação.",
        "Indicou antibiótico apenas quando suspeita bacteriana forte ou teste positivo conforme protocolo.",
        "Orientou sinais de alarme como dificuldade respiratória, salivação, trismo, piora importante ou desidratação.",
        "Definiu retorno ou reavaliação.",
        "Checou alergias antes do antibiótico, se prescrever.",
      ],
    },
  },

  // ========================================================================
  // LOTE 2A — CARDIOPULMONAR ADULTO
  // ========================================================================

  sca_iam: {
    aliases: [
      "iam",
      "infarto",
      "infarto agudo do miocardio",
      "sindrome coronariana aguda",
      "sca",
      "dor toracica coronariana",
      "angina instavel",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
        "Explicou que a dor torácica poderia representar problema cardíaco agudo.",
        "Orientou que seria necessária avaliação urgente com exames cardíacos.",
        "Manteve postura calma e acolhedora diante da dor ou ansiedade do paciente.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou início, duração, localização, intensidade e caráter da dor torácica.",
        "Investigou irradiação para braço, mandíbula, dorso ou epigástrio.",
        "Investigou dispneia, sudorese, náuseas, vômitos, síncope ou palpitações.",
        "Investigou fatores de risco como HAS, diabetes, tabagismo, dislipidemia, obesidade ou história familiar.",
        "Investigou doença coronariana prévia, uso de medicações, alergias e contraindicações.",
        "Pesquisou sinais de gravidade como dor persistente, hipotensão, dispneia importante ou alteração do nível de consciência.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e estabilidade hemodinâmica.",
        "Avaliou perfusão periférica e sinais de choque.",
        "Realizou ausculta cardíaca.",
        "Realizou ausculta pulmonar procurando congestão ou sinais de insuficiência cardíaca.",
        "Avaliou pulsos periféricos e assimetria quando havia suspeita de diferencial vascular.",
        "Avaliou saturação de oxigênio quando indicado.",
      ],
      examesComplementares: [
        "Solicitou ECG precoce.",
        "Solicitou troponina ou marcadores de necrose miocárdica seriados.",
        "Considerou eletrólitos, função renal, hemograma e coagulograma conforme contexto.",
        "Considerou radiografia de tórax se dispneia, congestão ou dúvida diagnóstica.",
        "Indicou monitorização cardíaca conforme risco.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu síndrome coronariana aguda ou IAM como hipótese principal.",
        "Relacionou dor torácica típica e fatores de risco à hipótese coronariana.",
        "Diferenciou IAM com supra, sem supra e angina instável quando aplicável.",
        "Considerou diferenciais graves como dissecção de aorta, TEP, pneumotórax ou pericardite.",
        "Estratificou gravidade e risco cardiovascular.",
      ],
      condutaSeguranca: [
        "Encaminhou para emergência ou monitorização se suspeita de SCA.",
        "Indicou antiagregação conforme protocolo e contraindicações.",
        "Considerou analgesia, nitrato ou oxigênio conforme indicação e contraindicações.",
        "Reconheceu necessidade de reperfusão urgente se IAM com supra.",
        "Checou contraindicações relevantes antes de medicações.",
        "Evitou alta insegura sem investigação cardíaca adequada.",
        "Orientou sinais de alarme e necessidade de atendimento imediato.",
      ],
    },
  },

  insuficiencia_cardiaca: {
    aliases: [
      "insuficiencia cardiaca",
      "icc",
      "insuficiencia cardiaca descompensada",
      "edema agudo de pulmao",
      "congestao pulmonar",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
        "Explicou que os sintomas poderiam estar relacionados a descompensação do coração.",
        "Orientou a necessidade de avaliar congestão, falta de ar e retenção de líquido.",
        "Explicou os sinais de piora de forma acessível.",
        "Manteve postura acolhedora diante da dispneia ou limitação funcional.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou dispneia aos esforços ou redução da tolerância ao exercício.",
        "Investigou ortopneia ou dispneia paroxística noturna.",
        "Investigou edema de membros inferiores.",
        "Investigou ganho de peso recente.",
        "Investigou antecedente de infarto, doença coronariana ou outra cardiopatia.",
        "Investigou adesão medicamentosa, uso de diurético, dieta ou consumo de sal.",
        "Investigou fatores precipitantes como dor torácica, palpitações, síncope ou infecção.",
        "Pesquisou sinais de gravidade como dispneia em repouso, confusão, hipotensão ou oligúria.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e saturação.",
        "Avaliou turgência jugular.",
        "Realizou ausculta pulmonar procurando estertores ou congestão.",
        "Avaliou edema periférico.",
        "Realizou ausculta cardíaca procurando B3, sopros ou ritmo irregular.",
        "Avaliou o ictus cordis, sua localização ou desvio do ictus quando aplicável.",
        "Avaliou perfusão, estado geral e sinais de choque.",
      ],
      examesComplementares: [
        "Solicitou ECG.",
        "Solicitou radiografia de tórax quando indicado.",
        "Considerou BNP ou NT-proBNP quando disponível e útil.",
        "Solicitou função renal e eletrólitos.",
        "Considerou troponina se suspeita de isquemia ou descompensação aguda.",
        "Considerou ecocardiograma para avaliação estrutural ou de função ventricular.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu insuficiência cardíaca ou descompensação como hipótese.",
        "Relacionou dispneia, ortopneia, edema e sinais de congestão ao diagnóstico.",
        "Diferenciou insuficiência cardíaca de DPOC, pneumonia, TEP ou anemia.",
        "Identificou possível fator precipitante da descompensação.",
        "Estratificou gravidade e perfil clínico como congesto, hipoperfundido ou estável.",
      ],
      condutaSeguranca: [
        "Indicou diurético quando havia congestão ou edema.",
        "Propôs terapia descongestiva.",
        "Indicou internação, observação ou encaminhamento se havia sinais de descompensação.",
        "Planejou organizar ou ajustar as medicações em uso conforme estabilidade.",
        "Avaliou ou planejou avaliar sinais vitais antes de encaminhar.",
        "Indicou oxigênio ou suporte ventilatório se hipoxemia ou desconforto importante.",
        "Orientou restrição de sal, adesão medicamentosa ou sinais de alarme.",
        "Definiu plano de reavaliação, monitorização ou seguimento.",
      ],
    },
  },

  dpoc_exacerbado: {
    aliases: [
      "dpoc",
      "exacerbacao dpoc",
      "dpoc exacerbado",
      "exacerbacao de dpoc",
      "doenca pulmonar obstrutiva cronica exacerbada",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Explicou que havia piora de doença respiratória crônica ou broncoespasmo.",
        "Orientou o uso correto de broncodilatadores e medicações.",
        "Explicou os sinais de piora respiratória.",
        "Demonstrou acolhimento diante da falta de ar.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou piora da dispneia em relação ao basal.",
        "Investigou tosse, aumento de escarro ou purulência do escarro.",
        "Investigou duração e possível gatilho como infecção ou exposição a fumaça ou poluentes.",
        "Investigou uso de broncodilatadores, corticoide, oxigênio domiciliar e adesão.",
        "Investigou exacerbações prévias, internação, UTI, ventilação não invasiva ou intubação.",
        "Pesquisou sinais de gravidade como sonolência, confusão, cianose, fala entrecortada ou fadiga respiratória.",
      ],
      exameFisico: [
        "Avaliou frequência respiratória, frequência cardíaca, pressão arterial e saturação.",
        "Avaliou esforço respiratório e uso de musculatura acessória.",
        "Realizou ausculta pulmonar procurando sibilos, roncos ou redução do murmúrio vesicular.",
        "Avaliou cianose, nível de consciência e sinais de exaustão.",
        "Avaliou sinais de cor pulmonale ou edema quando aplicável.",
      ],
      examesComplementares: [
        "Solicitou oximetria ou monitorização da saturação.",
        "Considerou gasometria se crise grave, hipoxemia, sonolência ou suspeita de retenção de CO2.",
        "Considerou radiografia de tórax para excluir pneumonia, pneumotórax ou insuficiência cardíaca.",
        "Considerou hemograma ou marcadores inflamatórios conforme suspeita infecciosa.",
        "Considerou ECG se dor torácica, arritmia, gravidade ou diferencial cardíaco.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu exacerbação de DPOC.",
        "Relacionou piora da dispneia, tosse e escarro ao quadro.",
        "Classificou gravidade com base em saturação, esforço respiratório e estado mental.",
        "Considerou diferenciais como pneumonia, TEP, insuficiência cardíaca, asma e pneumotórax.",
        "Relacionou purulência do escarro ou sinais infecciosos à possível indicação de antibiótico.",
      ],
      condutaSeguranca: [
        "Indicou broncodilatador de curta ação.",
        "Considerou corticosteroide sistêmico.",
        "Considerou antibiótico quando havia aumento de escarro, purulência ou gravidade.",
        "Indicou oxigênio com alvo adequado, evitando hiperóxia.",
        "Reavaliou a resposta clínica após o tratamento inicial.",
        "Encaminhou se hipoxemia, hipercapnia, exaustão, alteração de consciência ou falha terapêutica.",
        "Orientou sinais de alarme e retorno.",
      ],
    },
  },

  pneumonia_adulto: {
    aliases: [
      "pneumonia adulto",
      "pneumonia em adulto",
      "pneumonia comunitaria",
      "pneumonia adquirida na comunidade",
      "pac adulto",
      "pac",
      "infeccao pulmonar",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Explicou a suspeita de infecção pulmonar em linguagem acessível.",
        "Orientou a necessidade de tratamento e reavaliação.",
        "Explicou os sinais de gravidade respiratória.",
        "Manteve postura acolhedora diante de febre, tosse ou falta de ar.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou febre, tosse, expectoração, dispneia, dor torácica pleurítica ou calafrios.",
        "Investigou duração e evolução dos sintomas.",
        "Investigou comorbidades, idade, tabagismo, imunossupressão ou risco de gravidade.",
        "Investigou internação recente, aspiração, uso prévio de antibiótico ou contato com doentes.",
        "Pesquisou sinais de gravidade como confusão, hipotensão, dispneia importante ou prostração.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e saturação.",
        "Realizou ausculta pulmonar procurando crepitações, redução de murmúrio ou sopro tubário.",
        "Avaliou esforço respiratório e estado geral.",
        "Avaliou perfusão e sinais de sepse.",
        "Procurou sinais de derrame pleural ou complicação.",
      ],
      examesComplementares: [
        "Solicitou radiografia de tórax quando indicada.",
        "Solicitou hemograma ou PCR conforme gravidade ou contexto.",
        "Considerou gasometria se hipoxemia ou gravidade.",
        "Considerou culturas se internação, gravidade ou falha terapêutica.",
        "Considerou função renal ou eletrólitos para segurança terapêutica quando necessário.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu pneumonia como hipótese principal.",
        "Relacionou febre, tosse, ausculta e imagem à hipótese.",
        "Avaliou gravidade e necessidade de internação.",
        "Considerou diferenciais como TEP, insuficiência cardíaca, tuberculose ou DPOC.",
        "Identificou sinais de complicação ou sepse.",
      ],
      condutaSeguranca: [
        "Indicou antibiótico conforme gravidade, contexto e protocolo.",
        "Indicou suporte, hidratação e antitérmico ou analgesia quando necessário.",
        "Encaminhou ou internou se hipoxemia, sepse, instabilidade, confusão ou alto risco.",
        "Orientou sinais de alarme respiratório.",
        "Definiu reavaliação ou seguimento.",
      ],
    },
  },

  tep: {
    aliases: [
      "tep",
      "tromboembolismo pulmonar",
      "embolia pulmonar",
      "embolia pulmonar aguda",
      "tromboembolia pulmonar",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Explicou a suspeita de tromboembolismo pulmonar em linguagem acessível.",
        "Orientou que o quadro pode exigir investigação urgente.",
        "Explicou a necessidade de exames e monitorização.",
        "Manteve postura acolhedora diante de dispneia ou dor torácica.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou dispneia súbita, dor torácica pleurítica, hemoptise, síncope ou palpitações.",
        "Investigou fatores de risco como imobilização, cirurgia recente, câncer, trombose prévia, gestação ou anticoncepcional.",
        "Investigou dor ou edema unilateral em membro inferior.",
        "Investigou sinais de instabilidade, hipotensão ou piora rápida.",
        "Investigou diagnósticos diferenciais como SCA, pneumonia, pneumotórax ou ansiedade.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e saturação.",
        "Avaliou sinais de instabilidade hemodinâmica.",
        "Avaliou membros inferiores para sinais de TVP.",
        "Realizou ausculta pulmonar e cardíaca.",
        "Procurou sinais de choque, hipoperfusão ou sobrecarga direita.",
      ],
      examesComplementares: [
        "Aplicou ou considerou probabilidade clínica ou escore para TEP.",
        "Solicitou D-dímero se baixa ou intermediária probabilidade.",
        "Solicitou angioTC de tórax se indicada.",
        "Considerou ECG, troponina, BNP, gasometria ou ecocardiograma conforme gravidade.",
        "Considerou Doppler venoso de membros inferiores se suspeita de TVP.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu TEP como hipótese diagnóstica.",
        "Relacionou sintomas, fatores de risco e sinais clínicos ao TEP.",
        "Estratificou a probabilidade clínica.",
        "Diferenciou TEP de SCA, pneumonia, pneumotórax, asma ou DPOC e insuficiência cardíaca.",
        "Avaliou a gravidade hemodinâmica.",
      ],
      condutaSeguranca: [
        "Encaminhou ou internou se suspeita relevante, hipoxemia ou instabilidade.",
        "Considerou anticoagulação conforme risco, probabilidade e contraindicações.",
        "Reconheceu necessidade de trombólise ou emergência se TEP maciço ou choque.",
        "Monitorou sinais vitais e oxigenação.",
        "Evitou alta insegura sem investigação adequada.",
        "Checou contraindicações à anticoagulação.",
      ],
    },
  },

  pneumotorax: {
    aliases: [
      "pneumotorax",
      "pneumotorax espontaneo",
      "pneumotorax hipertensivo",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Explicou a suspeita de pneumotórax em linguagem acessível.",
        "Orientou a necessidade de avaliação de gravidade e imagem.",
        "Explicou os sinais de piora respiratória.",
        "Manteve postura calma diante de dor torácica ou dispneia.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou dor torácica súbita e dispneia.",
        "Investigou início, lateralidade, intensidade e evolução.",
        "Investigou trauma, esforço, doença pulmonar prévia, tabagismo ou pneumotórax prévio.",
        "Investigou sinais de gravidade como síncope, hipotensão ou dispneia intensa.",
        "Investigou fatores de risco para pneumotórax secundário.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e saturação.",
        "Realizou ausculta comparativa procurando redução do murmúrio vesicular.",
        "Procurou assimetria torácica ou hipertimpanismo quando aplicável.",
        "Avaliou esforço respiratório.",
        "Procurou sinais de pneumotórax hipertensivo como hipotensão, desvio traqueal, turgência jugular ou choque.",
      ],
      examesComplementares: [
        "Solicitou radiografia de tórax se paciente estável.",
        "Considerou ultrassom à beira-leito se disponível.",
        "Não atrasou descompressão se suspeita de pneumotórax hipertensivo.",
        "Considerou tomografia em casos selecionados ou dúvida diagnóstica.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu pneumotórax como hipótese.",
        "Diferenciou pneumotórax simples de pneumotórax hipertensivo.",
        "Relacionou dor súbita, dispneia e redução do murmúrio vesicular à hipótese.",
        "Considerou diferenciais como TEP, SCA, pneumonia ou dor musculoesquelética.",
        "Avaliou gravidade e necessidade de intervenção.",
      ],
      condutaSeguranca: [
        "Indicou oxigênio e monitorização conforme gravidade.",
        "Reconheceu necessidade de descompressão imediata se pneumotórax hipertensivo.",
        "Indicou drenagem torácica se pneumotórax grande, sintomático, secundário ou instável conforme protocolo.",
        "Encaminhou para emergência quando indicado.",
        "Evitou alta insegura em pneumotórax grande, sintomático ou instável.",
        "Orientou sinais de alarme e retorno.",
      ],
    },
  },

  // ========================================================================
  // LOTE 2B — CARDIOVASCULAR / TORÁCICO AVANÇADO
  // ========================================================================

  ic_cronica_estavel: {
    aliases: [
      "insuficiencia cardiaca cronica",
      "ic cronica",
      "ic estavel",
      "acompanhamento insuficiencia cardiaca",
      "insuficiencia cardiaca compensada",
      "insuficiencia cardiaca ambulatorial",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
        "Explicou que a insuficiência cardíaca exige acompanhamento contínuo.",
        "Orientou a importância de adesão medicamentosa e controle de fatores de risco.",
        "Explicou os sinais de piora de forma acessível.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou dispneia aos esforços, ortopneia e dispneia paroxística noturna.",
        "Investigou edema de membros inferiores, ganho de peso e fadiga.",
        "Investigou limitação funcional e classe funcional.",
        "Investigou adesão às medicações e dificuldades de acesso.",
        "Investigou dieta, ingesta de sal, ingesta hídrica e controle de peso.",
        "Investigou comorbidades como HAS, diabetes, doença renal, doença coronariana, arritmias ou valvopatias.",
        "Pesquisou sinais recentes de descompensação como piora da dispneia, edema progressivo, oligúria ou síncope.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e saturação quando indicado.",
        "Avaliou peso atual ou variação ponderal quando disponível.",
        "Avaliou turgência jugular.",
        "Realizou ausculta pulmonar procurando estertores.",
        "Avaliou edema periférico.",
        "Realizou ausculta cardíaca procurando B3, sopros ou ritmo irregular.",
        "Avaliou perfusão periférica e estado geral.",
      ],
      examesComplementares: [
        "Solicitou ou revisou função renal e eletrólitos.",
        "Solicitou ou revisou ECG quando indicado.",
        "Considerou BNP ou NT-proBNP quando havia dúvida diagnóstica ou avaliação de gravidade.",
        "Considerou ecocardiograma para avaliação de fração de ejeção e estrutura cardíaca.",
        "Considerou controle laboratorial conforme as medicações em uso.",
        "Considerou investigação de fator precipitante se havia piora clínica.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu insuficiência cardíaca crônica como condição de seguimento.",
        "Avaliou se o paciente estava compensado ou descompensado.",
        "Relacionou sintomas, exame físico e adesão ao controle clínico.",
        "Identificou fatores de risco ou precipitantes de piora.",
        "Diferenciou insuficiência cardíaca estável de descompensada.",
        "Estratificou risco conforme sintomas, função renal, congestão ou limitação funcional.",
      ],
      condutaSeguranca: [
        "Reforçou a adesão medicamentosa.",
        "Orientou controle de peso, dieta com restrição de sal e acompanhamento regular.",
        "Ajustou ou encaminhou para ajuste terapêutico conforme sintomas e estabilidade.",
        "Orientou sinais de alarme como piora da falta de ar, ganho rápido de peso, edema progressivo, síncope ou dor torácica.",
        "Definiu seguimento ou reavaliação.",
        "Encaminhou se sinais de descompensação, hipoxemia, hipotensão, síncope ou piora importante.",
        "Evitou encerramento sem plano de acompanhamento.",
      ],
    },
  },

  arritmia_fibrilacao_atrial: {
    aliases: [
      "arritmia",
      "arritmias",
      "fibrilacao atrial",
      "fa",
      "flutter atrial",
      "taquiarritmia",
      "palpitacoes",
      "ritmo irregular",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
        "Explicou que palpitações ou ritmo irregular podem representar alteração do ritmo cardíaco.",
        "Orientou a necessidade de ECG ou monitorização para confirmar o ritmo.",
        "Manteve postura calma diante de palpitações, tontura ou ansiedade.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou início, duração, frequência e padrão das palpitações.",
        "Investigou sintomas associados como dor torácica, dispneia, tontura, síncope ou fadiga.",
        "Investigou fatores desencadeantes como cafeína, álcool, drogas, estresse, febre ou exercício.",
        "Investigou doença cardíaca prévia, hipertensão, tireoide, apneia do sono ou valvopatias.",
        "Investigou uso de anticoagulantes, antiarrítmicos, betabloqueadores ou outras medicações.",
        "Investigou história de AVC ou AIT, sangramentos e fatores de risco tromboembólico.",
        "Pesquisou sinais de instabilidade como hipotensão, dor torácica persistente, síncope ou alteração de consciência.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e estabilidade hemodinâmica.",
        "Avaliou a frequência e a regularidade do pulso.",
        "Realizou ausculta cardíaca.",
        "Realizou ausculta pulmonar procurando congestão.",
        "Avaliou perfusão periférica e sinais de choque.",
        "Avaliou sinais de insuficiência cardíaca.",
        "Avaliou sinais de causa secundária quando aplicável, como febre ou tireotoxicose.",
      ],
      examesComplementares: [
        "Solicitou ECG para documentar o ritmo.",
        "Considerou monitorização cardíaca se sintomas recorrentes ou instabilidade.",
        "Solicitou eletrólitos e função renal quando indicado.",
        "Considerou TSH em fibrilação atrial ou suspeita de tireoidopatia.",
        "Considerou troponina se dor torácica ou suspeita isquêmica.",
        "Considerou ecocardiograma para avaliação estrutural quando indicado.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu arritmia ou fibrilação atrial como hipótese.",
        "Diferenciou paciente estável de instável.",
        "Relacionou pulso irregular, ECG e sintomas ao diagnóstico.",
        "Considerou causas reversíveis como distúrbios eletrolíticos, tireotoxicose, infecção, hipóxia ou drogas.",
        "Avaliou risco tromboembólico e risco de sangramento quando aplicável.",
        "Considerou diferenciais como ansiedade, extrassístoles, taquicardia supraventricular, SCA ou TEP.",
      ],
      condutaSeguranca: [
        "Encaminhou para atendimento urgente se instabilidade hemodinâmica.",
        "Considerou controle de frequência ou de ritmo conforme estabilidade e contexto.",
        "Considerou anticoagulação conforme risco tromboembólico e contraindicações.",
        "Corrigiu ou investigou causas reversíveis quando indicadas.",
        "Definiu seguimento cardiológico ou reavaliação.",
        "Orientou sinais de alarme como síncope, dor torácica, falta de ar importante ou déficit neurológico.",
        "Evitou alta insegura em paciente instável ou com sinais de gravidade.",
      ],
    },
  },

  estenose_aortica_valvopatia: {
    aliases: [
      "estenose aortica",
      "valvopatia aortica",
      "valvopatia",
      "sopro sistolico ejetivo",
      "sopro em foco aortico",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
        "Explicou que os sintomas podem estar relacionados a alteração em válvula cardíaca.",
        "Orientou a necessidade de ecocardiograma ou avaliação cardiológica.",
        "Explicou sinais de gravidade como desmaio, dor torácica ou falta de ar.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou dispneia aos esforços.",
        "Investigou dor torácica aos esforços.",
        "Investigou síncope ou pré-síncope.",
        "Investigou palpitações, fadiga ou redução da tolerância ao exercício.",
        "Investigou história de sopro, febre reumática, doença valvar prévia ou idade avançada.",
        "Investigou sinais de insuficiência cardíaca.",
        "Pesquisou piora progressiva ou sintomas em repouso.",
      ],
      exameFisico: [
        "Realizou ausculta cardíaca nos focos valvares.",
        "Identificou ou pesquisou sopro sistólico ejetivo em foco aórtico.",
        "Avaliou irradiação do sopro para carótidas.",
        "Avaliou pulsos periféricos e pulso parvus et tardus quando aplicável.",
        "Avaliou sinais de insuficiência cardíaca.",
        "Avaliou sinais vitais, perfusão e estado geral.",
      ],
      examesComplementares: [
        "Solicitou ecocardiograma para confirmar e graduar a valvopatia.",
        "Solicitou ECG quando indicado.",
        "Considerou radiografia de tórax se dispneia, congestão ou avaliação complementar.",
        "Considerou BNP ou NT-proBNP se dúvida de descompensação.",
        "Considerou avaliação cardiológica especializada.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu estenose aórtica ou valvopatia como hipótese.",
        "Relacionou sopro sistólico ejetivo e sintomas clássicos ao diagnóstico.",
        "Identificou sintomas de alto risco como síncope, angina ou dispneia.",
        "Diferenciou valvopatia de SCA, insuficiência cardíaca, arritmia ou causas pulmonares.",
        "Estratificou gravidade com base em sintomas e exame.",
      ],
      condutaSeguranca: [
        "Encaminhou para cardiologia e ecocardiograma.",
        "Reconheceu urgência se estenose aórtica sintomática com síncope, dor torácica, dispneia importante ou insuficiência cardíaca.",
        "Evitou alta insegura em paciente sintomático grave.",
        "Orientou sinais de alarme e retorno imediato.",
        "Definiu acompanhamento conforme gravidade.",
        "Evitou medicações ou condutas potencialmente inseguras sem avaliação em quadro grave.",
      ],
    },
  },

  pericardite_aguda: {
    aliases: [
      "pericardite",
      "pericardite aguda",
      "dor pericardica",
      "atrito pericardico",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
        "Explicou que a dor poderia estar relacionada a inflamação ao redor do coração.",
        "Orientou a necessidade de exames cardíacos para diferenciar de causas graves.",
        "Explicou os sinais de alarme de forma acessível.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou dor torácica pleurítica ou em pontada.",
        "Investigou piora da dor ao deitar e melhora ao sentar ou inclinar o tronco.",
        "Investigou febre, quadro viral recente ou sintomas sistêmicos.",
        "Investigou dispneia, síncope, hipotensão ou sintomas de tamponamento.",
        "Investigou doença autoimune, neoplasia, uremia, trauma ou IAM recente.",
        "Investigou uso de anticoagulantes e comorbidades.",
        "Pesquisou sinais de alto risco como febre alta, imunossupressão, trauma ou instabilidade.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e estabilidade hemodinâmica.",
        "Realizou ausculta cardíaca procurando atrito pericárdico.",
        "Avaliou turgência jugular.",
        "Avaliou abafamento de bulhas quando aplicável.",
        "Avaliou perfusão e sinais de choque.",
        "Realizou ausculta pulmonar e avaliou sinais de derrame ou congestão.",
      ],
      examesComplementares: [
        "Solicitou ECG.",
        "Solicitou troponina para avaliar miopericardite ou diferencial com SCA.",
        "Solicitou marcadores inflamatórios quando indicado.",
        "Solicitou ecocardiograma se suspeita de derrame pericárdico, tamponamento ou alto risco.",
        "Considerou radiografia de tórax conforme sintomas.",
        "Considerou exames etiológicos conforme contexto.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu pericardite aguda como hipótese.",
        "Relacionou dor posicional ou pleurítica, ECG e atrito pericárdico ao diagnóstico.",
        "Diferenciou pericardite de SCA, TEP, pneumotórax, dissecção e causas musculoesqueléticas.",
        "Identificou sinais de alto risco ou tamponamento.",
        "Avaliou a possibilidade de miopericardite.",
      ],
      condutaSeguranca: [
        "Indicou anti-inflamatório ou colchicina conforme protocolo e contraindicações.",
        "Checou contraindicações a anti-inflamatórios.",
        "Encaminhou ou internou se alto risco, tamponamento, instabilidade, miopericardite ou etiologia grave.",
        "Orientou repouso e acompanhamento.",
        "Orientou sinais de alarme como piora da dor, falta de ar, síncope ou febre persistente.",
        "Evitou alta insegura sem excluir SCA ou sinais de gravidade.",
      ],
    },
  },

  disseccao_aorta: {
    aliases: [
      "disseccao",
      "disseccao de aorta",
      "disseccao aortica",
      "sindrome aortica aguda",
      "dor toracica rasgando",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
        "Explicou que a dor poderia representar condição vascular grave.",
        "Orientou a necessidade de avaliação urgente e exames de imagem.",
        "Manteve postura calma e objetiva diante de potencial emergência.",
        "Confirmou compreensão quando possível.",
      ],
      anamnese: [
        "Investigou dor torácica súbita, intensa, rasgante ou migratória.",
        "Investigou irradiação para dorso, abdome, pescoço ou mandíbula.",
        "Investigou síncope, déficit neurológico, dispneia ou sintomas isquêmicos.",
        "Investigou HAS, doença do tecido conjuntivo, aneurisma, valvopatia aórtica ou história familiar.",
        "Investigou diferença de sintomas entre membros ou dor abdominal e lombar.",
        "Pesquisou instabilidade, choque ou sinais de má perfusão.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e estabilidade hemodinâmica.",
        "Mediu ou comparou pressão arterial e pulsos em membros quando possível.",
        "Avaliou pulsos periféricos e assimetrias.",
        "Realizou ausculta cardíaca procurando sopro de insuficiência aórtica.",
        "Avaliou sinais neurológicos focais.",
        "Avaliou perfusão, sinais de choque ou déficit de órgão.",
      ],
      examesComplementares: [
        "Solicitou angioTC de aorta quando indicado e paciente estável.",
        "Considerou ecocardiograma transesofágico ou imagem alternativa conforme estabilidade.",
        "Solicitou ECG e troponina para diferencial com SCA, sem atrasar a investigação da aorta.",
        "Solicitou função renal, hemograma, coagulograma e tipagem ou prova cruzada quando indicado.",
        "Considerou radiografia de tórax como exame auxiliar, não definitivo.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu dissecção aguda de aorta como hipótese grave.",
        "Relacionou dor súbita, intensa ou migratória e assimetria de pulsos ou pressão ao diagnóstico.",
        "Diferenciou de SCA, TEP, pneumotórax, pericardite e dor musculoesquelética.",
        "Identificou sinais de complicação como tamponamento, AVC, isquemia de membro ou choque.",
        "Estratificou risco e necessidade de manejo emergencial.",
      ],
      condutaSeguranca: [
        "Encaminhou imediatamente para emergência ou monitorização.",
        "Controlou dor e pressão arterial ou frequência conforme protocolo e estabilidade.",
        "Solicitou avaliação vascular, cirúrgica ou cardiológica urgente conforme suspeita.",
        "Evitou anticoagulação ou trombólise indevida antes de excluir dissecção.",
        "Evitou alta insegura ou atraso na imagem definitiva.",
        "Monitorou sinais vitais e perfusão.",
        "Reconheceu necessidade de cirurgia urgente em dissecção tipo A ou instabilidade.",
      ],
    },
  },

  derrame_pleural: {
    aliases: [
      "derrame pleural",
      "efusao pleural",
      "pleurite com derrame",
      "liquido pleural",
      "sindrome pleural",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
        "Explicou que pode haver líquido ao redor do pulmão.",
        "Orientou a necessidade de investigar a causa do derrame.",
        "Explicou os sinais de piora respiratória.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou dispneia, dor pleurítica, tosse, febre ou perda de peso.",
        "Investigou duração e progressão dos sintomas.",
        "Investigou história de pneumonia, tuberculose, câncer, insuficiência cardíaca, doença renal ou hepática.",
        "Investigou tabagismo, exposição, contato com tuberculose ou sintomas constitucionais.",
        "Pesquisou sinais de gravidade como dispneia importante, febre persistente ou perda ponderal importante.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e saturação.",
        "Realizou ausculta pulmonar procurando redução do murmúrio vesicular.",
        "Avaliou macicez à percussão quando aplicável.",
        "Avaliou expansibilidade torácica e frêmito toracovocal quando aplicável.",
        "Avaliou sinais de insuficiência cardíaca, hepatopatia ou infecção.",
        "Avaliou esforço respiratório e estado geral.",
      ],
      examesComplementares: [
        "Solicitou radiografia de tórax ou ultrassom de tórax.",
        "Considerou tomografia se dúvida diagnóstica, suspeita de neoplasia, tuberculose ou complicação.",
        "Considerou toracocentese diagnóstica se derrame novo, moderado ou grande, ou sem causa clara.",
        "Solicitou análise do líquido pleural quando a toracocentese estava indicada.",
        "Investigou etiologia conforme suspeita: infecção, tuberculose, neoplasia, insuficiência cardíaca ou doença renal ou hepática.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu derrame pleural como hipótese.",
        "Relacionou dispneia, dor pleurítica, redução do murmúrio e imagem ao diagnóstico.",
        "Diferenciou causas transudativas e exsudativas quando aplicável.",
        "Considerou causas como pneumonia, tuberculose, neoplasia, insuficiência cardíaca, cirrose ou doença renal.",
        "Avaliou gravidade pelo volume, sintomas e estabilidade.",
      ],
      condutaSeguranca: [
        "Encaminhou se dispneia importante, hipoxemia, instabilidade ou derrame volumoso.",
        "Indicou investigação etiológica.",
        "Considerou toracocentese diagnóstica ou terapêutica conforme indicação.",
        "Tratou ou encaminhou conforme a causa provável.",
        "Orientou sinais de alarme como piora da falta de ar, febre persistente ou dor torácica intensa.",
        "Evitou alta sem investigação em derrame novo significativo.",
        "Definiu seguimento ou reavaliação.",
      ],
    },
  },

  // ========================================================================
  // LOTE 3 — INFECTOLOGIA / URGÊNCIA ADULTO
  // ========================================================================

  sepse_choque_septico: {
    aliases: [
      "sepse",
      "choque septico",
      "sepse grave",
      "sindrome septica",
      "infeccao generalizada",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
        "Explicou que havia suspeita de infecção grave com risco sistêmico.",
        "Orientou a necessidade de avaliação e tratamento urgentes.",
        "Manteve postura objetiva e acolhedora diante da gravidade.",
        "Confirmou compreensão quando possível.",
      ],
      anamnese: [
        "Investigou febre, calafrios, hipotermia ou sinais de infecção recente.",
        "Investigou foco provável de infecção como pulmonar, urinário, abdominal, pele, cateter ou sistema nervoso.",
        "Investigou alteração do estado mental, prostração, tontura, síncope ou piora rápida.",
        "Investigou dispneia, oligúria, dor localizada ou sintomas do foco suspeito.",
        "Investigou comorbidades, imunossupressão, idade avançada, diabetes ou uso de dispositivos.",
        "Investigou uso recente de antibióticos, internação, procedimentos ou infecção prévia.",
        "Pesquisou sinais de choque como hipotensão, extremidades frias, confusão ou redução de diurese.",
      ],
      exameFisico: [
        "Avaliou sinais vitais completos incluindo pressão arterial, frequência cardíaca, frequência respiratória, temperatura e saturação.",
        "Avaliou perfusão periférica, enchimento capilar e extremidades.",
        "Avaliou estado mental e nível de consciência.",
        "Procurou foco infeccioso com exame dirigido.",
        "Avaliou sinais respiratórios, abdominais, urinários, cutâneos ou neurológicos conforme suspeita.",
        "Avaliou sinais de choque ou disfunção orgânica.",
      ],
      examesComplementares: [
        "Solicitou hemograma, função renal, eletrólitos e marcadores de disfunção orgânica conforme contexto.",
        "Solicitou lactato quando suspeita de sepse grave ou hipoperfusão.",
        "Solicitou culturas antes do antibiótico quando possível, sem atrasar o tratamento.",
        "Solicitou exames para identificar o foco infeccioso como urina, radiografia ou imagem conforme clínica.",
        "Considerou gasometria quando havia desconforto respiratório, choque ou gravidade.",
        "Monitorou resposta clínica e laboratorial conforme gravidade.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu sepse como hipótese em infecção com disfunção orgânica ou instabilidade.",
        "Diferenciou infecção localizada de sepse.",
        "Identificou o foco provável da infecção.",
        "Relacionou sinais vitais, perfusão, estado mental e exames à gravidade.",
        "Considerou diagnósticos diferenciais de choque ou instabilidade.",
        "Estratificou risco de choque séptico.",
      ],
      condutaSeguranca: [
        "Encaminhou ou manteve em ambiente de urgência ou monitorização.",
        "Indicou antibiótico precoce conforme foco provável e gravidade.",
        "Indicou reposição volêmica se hipoperfusão ou hipotensão.",
        "Monitorou pressão, diurese, perfusão e resposta ao tratamento.",
        "Reconheceu necessidade de vasopressor ou UTI se choque persistente.",
        "Reavaliou frequentemente o paciente.",
        "Evitou alta insegura ou atraso terapêutico em suspeita de sepse.",
      ],
    },
  },

  itu_baixa_cistite: {
    aliases: [
      "itu",
      "itu baixa",
      "infeccao urinaria",
      "infeccao urinaria baixa",
      "cistite",
      "disuria",
      "sindrome disurica",
      "infeccao do trato urinario baixo",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
        "Explicou a suspeita de infecção urinária baixa em linguagem acessível.",
        "Orientou medidas gerais e a importância de retorno se piora.",
        "Explicou sinais de alarme que sugerem infecção mais alta ou grave.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou disúria, urgência urinária, polaciúria e dor suprapúbica.",
        "Investigou hematúria ou alteração do odor ou aspecto da urina.",
        "Investigou febre, calafrios, dor lombar, náuseas ou vômitos para excluir pielonefrite.",
        "Investigou gestação, diabetes, imunossupressão, doença renal ou uropatia.",
        "Investigou recorrência, uso recente de antibiótico ou internação.",
        "Investigou sintomas ginecológicos ou uretrais quando aplicável.",
        "Pesquisou alergias e contraindicações a antibióticos.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e estado geral.",
        "Avaliou dor suprapúbica quando aplicável.",
        "Avaliou dor lombar ou sinal de Giordano para excluir pielonefrite.",
        "Avaliou sinais de toxemia ou instabilidade.",
        "Considerou exame ginecológico ou urológico se sintomas sugerissem diagnóstico alternativo.",
        "Avaliou hidratação quando indicado.",
      ],
      examesComplementares: [
        "Solicitou urina tipo 1 quando indicado.",
        "Considerou urocultura em casos complicados, recorrentes, gestantes, homens ou falha terapêutica.",
        "Considerou teste de gravidez quando aplicável.",
        "Evitou exames excessivos em cistite simples sem sinais de complicação.",
        "Solicitou exames adicionais se suspeita de pielonefrite ou complicação.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu cistite ou infecção urinária baixa como hipótese.",
        "Diferenciou infecção urinária baixa de pielonefrite.",
        "Identificou fatores de complicação.",
        "Considerou diferenciais como vaginite, uretrite, litíase ou dor pélvica.",
        "Relacionou sintomas urinários baixos à hipótese diagnóstica.",
      ],
      condutaSeguranca: [
        "Indicou antibiótico adequado conforme quadro, risco e protocolo local.",
        "Orientou hidratação e medidas de suporte.",
        "Orientou sinais de alarme como febre, dor lombar, vômitos ou persistência dos sintomas.",
        "Definiu retorno ou reavaliação se falha terapêutica ou recorrência.",
        "Encaminhou se gestação, instabilidade, pielonefrite, imunossupressão ou complicação.",
        "Checou alergias, gestação e contraindicações antes do antibiótico.",
      ],
    },
  },

  pielonefrite: {
    aliases: [
      "pielonefrite",
      "infeccao urinaria alta",
      "itu alta",
      "dor lombar febril",
      "giordano positivo",
      "punho percussao positiva",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
        "Explicou a suspeita de infecção urinária alta ou infecção nos rins.",
        "Orientou que o quadro pode exigir exames, antibiótico e acompanhamento próximo.",
        "Explicou os sinais de gravidade de forma acessível.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou febre, calafrios, dor lombar ou dor em flanco.",
        "Investigou náuseas, vômitos, prostração ou queda do estado geral.",
        "Investigou disúria, urgência urinária, polaciúria ou hematúria.",
        "Investigou gestação, diabetes, imunossupressão, litíase, uropatia ou doença renal.",
        "Investigou recorrência, uso recente de antibiótico ou internação.",
        "Pesquisou sinais de sepse como hipotensão, confusão, taquipneia ou oligúria.",
        "Investigou alergias e contraindicações a antibióticos.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e estado geral.",
        "Avaliou dor lombar ou sinal de Giordano.",
        "Avaliou dor abdominal e sinais de irritação peritoneal quando aplicável.",
        "Avaliou hidratação e perfusão.",
        "Procurou sinais de sepse ou instabilidade.",
        "Avaliou a necessidade de investigação de complicação.",
      ],
      examesComplementares: [
        "Solicitou urina tipo 1.",
        "Solicitou urocultura antes do antibiótico quando possível.",
        "Solicitou hemograma, função renal e eletrólitos conforme gravidade.",
        "Considerou hemoculturas se sepse, internação ou gravidade.",
        "Considerou imagem se suspeita de obstrução, litíase, abscesso, gestação ou má evolução.",
        "Considerou lactato se suspeita de sepse.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu pielonefrite como hipótese.",
        "Diferenciou pielonefrite de cistite simples.",
        "Identificou fatores de complicação ou necessidade de internação.",
        "Considerou diferenciais como litíase, abdome agudo, doença ginecológica ou sepse de outro foco.",
        "Avaliou o risco de sepse.",
      ],
      condutaSeguranca: [
        "Indicou antibiótico adequado e com cobertura para infecção urinária alta.",
        "Encaminhou ou internou se sepse, vômitos persistentes, gestação, obstrução, imunossupressão ou instabilidade.",
        "Orientou hidratação e suporte.",
        "Reavaliou a resposta clínica e a necessidade de ajuste conforme cultura.",
        "Orientou sinais de alarme e retorno.",
        "Checou alergias, função renal, gestação e contraindicações.",
      ],
    },
  },

  meningite: {
    aliases: [
      "meningite",
      "meningite bacteriana",
      "meningite viral",
      "meningoencefalite",
      "rigidez de nuca",
      "sindrome meningea",
      "cefaleia febril com rigidez",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
        "Explicou a suspeita de infecção no sistema nervoso ou meningite.",
        "Orientou a necessidade de avaliação urgente.",
        "Explicou a gravidade potencial e a necessidade de exames ou tratamento imediato.",
        "Manteve postura calma e acolhedora com paciente ou família.",
      ],
      anamnese: [
        "Investigou febre, cefaleia intensa, rigidez de nuca, vômitos ou fotofobia.",
        "Investigou alteração do nível de consciência, confusão, sonolência ou convulsões.",
        "Investigou exantema, petéquias ou sinais de meningococcemia.",
        "Investigou início, evolução e gravidade dos sintomas.",
        "Investigou imunossupressão, idade extrema, vacinação, contato com meningite ou infecção recente.",
        "Investigou uso de antibióticos, alergias e comorbidades.",
        "Pesquisou sinais de hipertensão intracraniana ou déficit neurológico focal.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e estabilidade hemodinâmica.",
        "Avaliou estado mental e nível de consciência.",
        "Avaliou rigidez de nuca e sinais meníngeos quando possível.",
        "Procurou petéquias, púrpura ou exantema.",
        "Realizou exame neurológico básico buscando déficit focal.",
        "Avaliou sinais de sepse, choque ou hipertensão intracraniana.",
      ],
      examesComplementares: [
        "Solicitou hemograma, eletrólitos, função renal e marcadores inflamatórios conforme contexto.",
        "Solicitou hemoculturas antes do antibiótico quando possível, sem atrasar o tratamento.",
        "Indicou punção lombar quando segura e indicada.",
        "Considerou tomografia antes da punção se déficit focal, rebaixamento, papiledema, convulsão recente ou imunossupressão.",
        "Solicitou análise do líquor quando a punção foi realizada.",
        "Considerou lactato ou gasometria se sepse ou gravidade.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu meningite ou meningoencefalite como hipótese grave.",
        "Diferenciou meningite bacteriana, viral e outras causas de cefaleia febril quando possível.",
        "Identificou sinais de gravidade, sepse ou hipertensão intracraniana.",
        "Relacionou febre, cefaleia, rigidez de nuca e alteração mental ao diagnóstico.",
        "Considerou diferenciais como sepse, encefalite, hemorragia subaracnoide ou sinusite complicada.",
      ],
      condutaSeguranca: [
        "Encaminhou para emergência ou internação.",
        "Indicou antibiótico empírico precoce quando suspeita bacteriana.",
        "Considerou antiviral se suspeita de encefalite ou herpes conforme contexto.",
        "Considerou corticoide conforme protocolo quando meningite bacteriana provável.",
        "Não atrasou o antibiótico por exames se havia alta suspeita ou instabilidade.",
        "Monitorou sinais vitais, consciência e risco de sepse.",
        "Orientou isolamento ou profilaxia de contatos quando indicado.",
      ],
    },
  },

  tuberculose_pulmonar: {
    aliases: [
      "tuberculose",
      "tuberculose pulmonar",
      "tb",
      "tb pulmonar",
      "tosse cronica",
      "bacilifero",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
        "Explicou a suspeita de tuberculose de forma clara e sem estigmatizar.",
        "Orientou a necessidade de investigação e cuidados para reduzir transmissão.",
        "Explicou a importância de adesão ao tratamento se confirmado.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou tosse por três semanas ou mais.",
        "Investigou febre vespertina, sudorese noturna, perda de peso ou anorexia.",
        "Investigou hemoptise, dor torácica ou dispneia.",
        "Investigou contato com tuberculose, população vulnerável, privação de liberdade ou moradia coletiva.",
        "Investigou HIV, diabetes, imunossupressão ou uso de corticoide ou imunobiológico.",
        "Investigou tratamento prévio de tuberculose ou abandono terapêutico.",
        "Investigou sintomas em contatos domiciliares.",
      ],
      exameFisico: [
        "Avaliou estado geral, peso ou emagrecimento e sinais vitais.",
        "Realizou ausculta pulmonar.",
        "Procurou linfonodos ou sinais extrapulmonares quando aplicável.",
        "Avaliou sinais de gravidade respiratória.",
        "Avaliou sinais de imunossupressão ou desnutrição quando aplicável.",
        "Avaliou a necessidade de isolamento respiratório.",
      ],
      examesComplementares: [
        "Solicitou teste rápido molecular para tuberculose quando disponível.",
        "Solicitou baciloscopia ou cultura de escarro conforme protocolo.",
        "Solicitou radiografia de tórax.",
        "Solicitou teste de HIV e exames basais conforme protocolo.",
        "Considerou investigação de resistência ou cultura em retratamento, risco ou falha.",
        "Considerou investigação de contatos.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu tuberculose pulmonar como hipótese.",
        "Relacionou tosse crônica, sintomas constitucionais e risco epidemiológico.",
        "Diferenciou tuberculose de pneumonia, DPOC, câncer de pulmão e outras causas de tosse crônica.",
        "Avaliou transmissibilidade e necessidade de notificação.",
        "Identificou fatores de risco para doença grave ou resistência.",
      ],
      condutaSeguranca: [
        "Orientou uso de máscara ou etiqueta respiratória e medidas para reduzir transmissão.",
        "Encaminhou para confirmação diagnóstica e início de tratamento conforme protocolo.",
        "Notificou ou encaminhou para vigilância quando indicado.",
        "Orientou adesão, seguimento e investigação de contatos.",
        "Encaminhou se sinais de gravidade, hemoptise volumosa ou insuficiência respiratória.",
        "Evitou encerrar sem plano de investigação ou seguimento.",
      ],
    },
  },

  endocardite_infecciosa: {
    aliases: [
      "endocardite",
      "endocardite infecciosa",
      "infeccao valvar",
      "vegetacao valvar",
      "febre com sopro",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
        "Explicou a suspeita de infecção no coração ou nas válvulas.",
        "Orientou a necessidade de investigação com exames e possível internação.",
        "Explicou o risco de complicações de forma acessível.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou febre persistente, calafrios, sudorese, perda de peso ou mal-estar.",
        "Investigou valvopatia, prótese valvar, dispositivo cardíaco ou cardiopatia prévia.",
        "Investigou uso de drogas injetáveis, procedimentos invasivos ou bacteremia recente.",
        "Investigou fenômenos embólicos, déficit neurológico, dor lombar ou abdominal.",
        "Investigou antibioticoterapia prévia.",
        "Investigou história de endocardite anterior.",
        "Pesquisou sinais de insuficiência cardíaca, sepse ou embolização.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e estado geral.",
        "Realizou ausculta cardíaca procurando sopro novo ou mudança de sopro.",
        "Procurou petéquias, lesões de Janeway, nódulos de Osler ou hemorragias subungueais quando aplicável.",
        "Avaliou sinais de insuficiência cardíaca.",
        "Avaliou sinais neurológicos ou embólicos.",
        "Procurou o foco infeccioso de origem.",
      ],
      examesComplementares: [
        "Solicitou hemoculturas antes do antibiótico quando possível.",
        "Solicitou ecocardiograma transtorácico ou transesofágico conforme suspeita.",
        "Solicitou hemograma, PCR ou VHS, função renal e urina conforme contexto.",
        "Considerou os critérios de Duke.",
        "Considerou exames de imagem se suspeita de embolização ou complicação.",
        "Monitorou a função renal e a necessidade de ajuste terapêutico.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu endocardite infecciosa como hipótese.",
        "Relacionou febre, fator de risco, sopro e achados sistêmicos ao diagnóstico.",
        "Considerou os critérios de Duke.",
        "Diferenciou endocardite de febre sem foco, sepse de outro foco e doenças inflamatórias.",
        "Avaliou risco de complicações como embolia, insuficiência cardíaca ou abscesso.",
        "Reconheceu a necessidade de investigação hospitalar quando suspeita relevante.",
      ],
      condutaSeguranca: [
        "Encaminhou ou internou para investigação e tratamento.",
        "Coletou culturas antes do antibiótico quando possível, sem atrasar se instável.",
        "Iniciou antibiótico conforme protocolo após culturas quando indicado.",
        "Solicitou avaliação especializada quando necessário.",
        "Monitorou complicações embólicas, insuficiência cardíaca e sepse.",
        "Evitou alta sem investigação em suspeita relevante.",
        "Orientou seguimento e sinais de alarme.",
      ],
    },
  },

  celulite_erisipela: {
    aliases: [
      "celulite",
      "erisipela",
      "infeccao de pele",
      "celulite infecciosa",
      "placa eritematosa",
      "pele vermelha dolorosa",
      "membro inferior vermelho",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
        "Explicou a suspeita de infecção de pele em linguagem acessível.",
        "Orientou a necessidade de tratamento e observação de progressão.",
        "Explicou os sinais de gravidade e o retorno.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou início, evolução, dor, calor, vermelhidão e aumento da área afetada.",
        "Investigou febre, calafrios, mal-estar ou sinais sistêmicos.",
        "Investigou trauma, ferida, picada, micose interdigital, úlcera ou porta de entrada.",
        "Investigou diabetes, imunossupressão, linfedema, insuficiência venosa ou episódios prévios.",
        "Investigou alergias, uso recente de antibióticos e fatores de risco para MRSA quando aplicável.",
        "Pesquisou dor desproporcional, bolhas, necrose, crepitação ou progressão rápida.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e estado geral.",
        "Avaliou extensão, bordas, calor, dor e edema da lesão.",
        "Procurou porta de entrada, feridas, micose ou úlcera.",
        "Avaliou linfangite, linfonodos regionais e edema.",
        "Procurou sinais de abscesso ou coleção.",
        "Procurou sinais de infecção necrosante como dor desproporcional, crepitação, necrose ou bolhas.",
        "Avaliou perfusão e função do membro quando aplicável.",
      ],
      examesComplementares: [
        "Reconheceu que celulite ou erisipela leve pode ser diagnóstico clínico.",
        "Solicitou exames laboratoriais se sinais sistêmicos, imunossupressão, gravidade ou dúvida.",
        "Considerou ultrassom se suspeita de abscesso ou coleção.",
        "Considerou hemoculturas se sepse, imunossupressão ou infecção grave.",
        "Considerou imagem avançada se suspeita de fasciíte necrosante ou infecção profunda.",
        "Evitou exames desnecessários em quadro leve e típico.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu celulite ou erisipela como hipótese.",
        "Diferenciou celulite de abscesso, trombose venosa, dermatite, gota ou fasciíte necrosante.",
        "Identificou a porta de entrada e fatores predisponentes.",
        "Avaliou gravidade e risco de complicação.",
        "Reconheceu sinais de alarme para infecção necrosante ou sepse.",
      ],
      condutaSeguranca: [
        "Indicou antibiótico adequado conforme gravidade, localização e risco.",
        "Indicou analgesia, elevação do membro e cuidados locais quando aplicável.",
        "Encaminhou ou internou se sepse, imunossupressão, falha terapêutica, rápida progressão ou suspeita de necrosante.",
        "Indicou drenagem ou avaliação cirúrgica se abscesso ou necrosante.",
        "Orientou demarcação ou observação da área e retorno se progressão.",
        "Orientou sinais de alarme como febre persistente, piora rápida, dor intensa, bolhas ou necrose.",
        "Checou alergias e contraindicações antes do antibiótico.",
      ],
    },
  },

  // ========================================================================
  // LOTE 4 — NEUROLOGIA / URGÊNCIAS NEUROLÓGICAS
  // ========================================================================

  avc_isquemico: {
    aliases: [
      "avc isquemico",
      "acidente vascular cerebral isquemico",
      "avc agudo",
      "derrame isquemico",
      "deficit neurologico focal",
      "afasia aguda",
      "hemiparesia aguda",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou acompanhante, ou identificou seu papel no atendimento.",
        "Explicou que os sintomas podem representar um AVC ou alteração neurológica aguda.",
        "Orientou que o tempo de início dos sintomas é essencial para o tratamento.",
        "Manteve postura objetiva e acolhedora diante da urgência.",
        "Confirmou informações com acompanhante quando o paciente não podia responder.",
      ],
      anamnese: [
        "Investigou o horário exato do início dos sintomas ou o último momento em que o paciente foi visto bem.",
        "Investigou fraqueza, dormência, assimetria facial, alteração da fala, alteração visual ou dificuldade para caminhar.",
        "Investigou a evolução dos sintomas e se houve melhora parcial ou persistência.",
        "Investigou uso de anticoagulantes, antiagregantes ou medicações relevantes.",
        "Investigou fatores de risco como HAS, diabetes, fibrilação atrial, tabagismo ou AVC prévio.",
        "Investigou glicemia ou condições que simulam AVC quando aplicável.",
        "Pesquisou contraindicações ou fatores de risco para trombólise dentro da janela terapêutica.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e estabilidade clínica.",
        "Avaliou glicemia capilar ou reconheceu a necessidade de excluir hipoglicemia.",
        "Realizou exame neurológico focal dirigido.",
        "Avaliou fala, força, sensibilidade, campo visual, coordenação e marcha quando possível.",
        "Avaliou o nível de consciência.",
        "Considerou escala neurológica como NIHSS ou avaliação estruturada de gravidade.",
        "Avaliou sinais de disfagia ou risco de aspiração quando aplicável.",
      ],
      examesComplementares: [
        "Solicitou tomografia de crânio sem contraste ou neuroimagem urgente.",
        "Solicitou glicemia capilar ou exame para excluir hipoglicemia.",
        "Solicitou ECG para avaliar arritmia ou fonte cardioembólica.",
        "Solicitou exames laboratoriais básicos como hemograma, eletrólitos, função renal e coagulograma quando indicado.",
        "Considerou angioTC ou avaliação vascular se suspeita de grande vaso.",
        "Considerou exames para elegibilidade de trombólise ou trombectomia conforme janela e protocolo.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu AVC isquêmico agudo como hipótese.",
        "Relacionou déficit neurológico focal súbito ao diagnóstico.",
        "Diferenciou AVC isquêmico de AVC hemorrágico pela necessidade de imagem.",
        "Considerou diferenciais como hipoglicemia, crise epiléptica pós-ictal, enxaqueca, tumor ou distúrbio metabólico.",
        "Avaliou a janela terapêutica e a gravidade.",
        "Reconheceu a necessidade de manejo em unidade de AVC ou emergência.",
      ],
      condutaSeguranca: [
        "Encaminhou para emergência, protocolo de AVC ou unidade especializada.",
        "Priorizou neuroimagem urgente.",
        "Considerou trombólise ou trombectomia conforme janela, imagem e contraindicações.",
        "Monitorou sinais vitais, glicemia, nível de consciência e evolução neurológica.",
        "Evitou oferecer via oral antes de avaliar a deglutição.",
        "Controlou a pressão arterial conforme protocolo e contexto.",
        "Evitou atraso diagnóstico ou alta insegura em déficit neurológico agudo.",
      ],
    },
  },

  ait: {
    aliases: [
      "ait",
      "ataque isquemico transitorio",
      "isquemia cerebral transitoria",
      "deficit neurologico transitorio",
      "sintomas neurologicos resolvidos",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou acompanhante, ou identificou seu papel no atendimento.",
        "Explicou que sintomas neurológicos transitórios podem representar alerta para AVC.",
        "Orientou que a melhora dos sintomas não elimina o risco.",
        "Explicou a necessidade de investigação rápida.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou sintomas neurológicos focais transitórios como fraqueza, fala alterada, perda visual ou dormência.",
        "Investigou horário de início, duração e resolução completa dos sintomas.",
        "Investigou recorrência de episódios semelhantes.",
        "Investigou fatores de risco como HAS, diabetes, fibrilação atrial, tabagismo ou AVC prévio.",
        "Investigou uso de anticoagulantes, antiagregantes e adesão medicamentosa.",
        "Investigou sintomas que sugerem diferenciais como crise convulsiva, enxaqueca ou síncope.",
        "Pesquisou sinais persistentes no momento da avaliação.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e pressão arterial.",
        "Realizou exame neurológico mesmo após a resolução dos sintomas.",
        "Avaliou fala, força, sensibilidade, campo visual, coordenação e marcha.",
        "Avaliou ritmo cardíaco ou pulso para suspeita de fibrilação atrial.",
        "Avaliou glicemia capilar ou reconheceu a necessidade de excluir hipoglicemia.",
        "Procurou déficits residuais.",
      ],
      examesComplementares: [
        "Solicitou neuroimagem para excluir lesão aguda ou hemorragia conforme protocolo.",
        "Solicitou avaliação vascular carotídea ou intracraniana quando indicada.",
        "Solicitou ECG e considerou monitorização para arritmias.",
        "Solicitou glicemia e exames laboratoriais básicos.",
        "Considerou avaliação de risco e etiologia cardioembólica.",
        "Considerou investigação de fatores de risco vascular.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu AIT como possibilidade diante de déficit focal resolvido.",
        "Diferenciou AIT de AVC estabelecido.",
        "Reconheceu o alto risco de AVC precoce após AIT.",
        "Considerou diferenciais como enxaqueca, crise epiléptica, hipoglicemia ou síncope.",
        "Estratificou risco e necessidade de avaliação urgente.",
        "Relacionou fatores de risco vascular à hipótese.",
      ],
      condutaSeguranca: [
        "Encaminhou para avaliação urgente ou serviço especializado.",
        "Evitou tranquilizar ou dar alta simples apenas porque os sintomas melhoraram.",
        "Considerou antiagregação ou anticoagulação conforme etiologia, risco e contraindicações.",
        "Orientou sinais de alarme e retorno imediato.",
        "Planejou investigação etiológica e controle de fatores de risco.",
        "Definiu seguimento rápido.",
        "Avaliou a necessidade de internação conforme risco.",
      ],
    },
  },

  avc_hemorragico: {
    aliases: [
      "avc hemorragico",
      "acidente vascular cerebral hemorragico",
      "hemorragia intracraniana",
      "sangramento intracraniano",
      "hemorragia cerebral",
      "hematoma intracerebral",
      "hematoma intraparenquimatoso",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou acompanhante, ou identificou seu papel no atendimento.",
        "Explicou a suspeita de sangramento intracraniano ou AVC hemorrágico.",
        "Orientou a necessidade de avaliação emergencial e neuroimagem.",
        "Manteve postura clara e acolhedora diante da gravidade.",
        "Confirmou informações com acompanhante quando o paciente não podia responder.",
      ],
      anamnese: [
        "Investigou início súbito de déficit neurológico, cefaleia intensa, vômitos ou rebaixamento.",
        "Investigou uso de anticoagulantes, antiagregantes ou distúrbios de coagulação.",
        "Investigou HAS, trauma, drogas, aneurisma, malformação vascular ou sangramento prévio.",
        "Investigou convulsão, alteração do nível de consciência ou piora progressiva.",
        "Investigou o horário de início e a evolução.",
        "Pesquisou sinais de hipertensão intracraniana.",
        "Investigou comorbidades e medicações relevantes.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e estabilidade hemodinâmica.",
        "Avaliou o nível de consciência.",
        "Realizou exame neurológico focal.",
        "Avaliou pupilas e sinais de hipertensão intracraniana quando aplicável.",
        "Avaliou sinais de trauma quando aplicável.",
        "Avaliou glicemia capilar ou causas reversíveis de alteração neurológica.",
        "Monitorou sinais de deterioração neurológica.",
      ],
      examesComplementares: [
        "Solicitou tomografia de crânio sem contraste urgente.",
        "Solicitou coagulograma e plaquetas.",
        "Solicitou glicemia, eletrólitos, função renal e hemograma.",
        "Considerou angioTC ou investigação vascular se suspeita de aneurisma ou malformação.",
        "Considerou ECG e exames de suporte conforme gravidade.",
        "Reavaliou imagem e conduta com neurocirurgia ou neurologia conforme achados.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu AVC hemorrágico ou hemorragia intracraniana como hipótese.",
        "Diferenciou AVC hemorrágico de isquêmico por neuroimagem.",
        "Relacionou rebaixamento, cefaleia intensa, vômitos, hipertensão ou anticoagulação ao risco hemorrágico.",
        "Avaliou gravidade, risco de expansão e hipertensão intracraniana.",
        "Considerou diferenciais como hipoglicemia, tumor, trauma, HSA ou crise epiléptica.",
      ],
      condutaSeguranca: [
        "Encaminhou para emergência, neurologia ou neurocirurgia ou unidade especializada.",
        "Priorizou neuroimagem urgente.",
        "Controlou a pressão arterial conforme protocolo.",
        "Reverteu anticoagulação quando indicada.",
        "Monitorou consciência, pupilas, sinais vitais e deterioração.",
        "Evitou trombólise ou anticoagulação indevida antes de excluir sangramento.",
        "Evitou alta insegura em déficit neurológico ou rebaixamento.",
      ],
    },
  },

  crise_convulsiva_epilepsia: {
    aliases: [
      "crise convulsiva",
      "convulsao",
      "epilepsia",
      "crise epileptica",
      "estado de mal epileptico",
      "pos ictal",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou acompanhante, ou identificou seu papel no atendimento.",
        "Explicou que o episódio pode corresponder a uma crise convulsiva.",
        "Orientou a necessidade de investigar causa, gatilhos e risco de recorrência.",
        "Manteve postura acolhedora diante da ansiedade do paciente ou da família.",
        "Confirmou informações com testemunha quando possível.",
      ],
      anamnese: [
        "Investigou a descrição do episódio, duração, movimentos, perda de consciência e recuperação.",
        "Investigou mordedura de língua, liberação esfincteriana, confusão pós-ictal ou trauma.",
        "Investigou febre, infecção, privação de sono, álcool, drogas ou suspensão de medicação.",
        "Investigou epilepsia prévia, medicações antiepilépticas e adesão.",
        "Investigou se foi o primeiro episódio ou crise conhecida.",
        "Investigou gestação, trauma craniano, cefaleia intensa, déficit focal ou doença neurológica.",
        "Pesquisou sinais de estado de mal epiléptico ou crise recorrente sem recuperação.",
      ],
      exameFisico: [
        "Avaliou via aérea, respiração, circulação e sinais vitais.",
        "Avaliou glicemia capilar.",
        "Avaliou o nível de consciência e o período pós-ictal.",
        "Realizou exame neurológico buscando déficit focal.",
        "Procurou sinais de trauma, mordedura de língua ou lesões.",
        "Avaliou sinais de infecção, meningismo ou intoxicação quando aplicável.",
        "Monitorou a recorrência da crise.",
      ],
      examesComplementares: [
        "Solicitou glicemia capilar ou confirmou a correção de hipoglicemia.",
        "Solicitou eletrólitos e exames laboratoriais conforme contexto.",
        "Considerou neuroimagem se primeiro episódio, trauma, déficit focal, rebaixamento persistente ou suspeita estrutural.",
        "Considerou EEG e seguimento neurológico conforme indicação.",
        "Considerou toxicologia, níveis de antiepilépticos ou investigação infecciosa conforme contexto.",
        "Considerou punção lombar se suspeita de meningite ou encefalite.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu crise convulsiva como hipótese.",
        "Diferenciou crise convulsiva de síncope, pseudocrise, hipoglicemia, AVC ou intoxicação.",
        "Identificou causas provocadas ou reversíveis.",
        "Avaliou risco de recorrência e necessidade de investigação.",
        "Reconheceu estado de mal epiléptico como emergência.",
        "Relacionou achados pós-ictais e o testemunho ao diagnóstico.",
      ],
      condutaSeguranca: [
        "Garantiu a segurança do paciente durante ou após a crise.",
        "Corrigiu hipoglicemia ou distúrbio reversível quando identificado.",
        "Indicou benzodiazepínico se crise prolongada ou recorrente conforme protocolo.",
        "Encaminhou ou internou se primeiro episódio de alto risco, estado de mal, trauma, déficit focal ou gestação.",
        "Orientou não dirigir ou evitar riscos conforme orientação clínica.",
        "Orientou sinais de alarme e retorno.",
        "Definiu seguimento neurológico quando indicado.",
      ],
    },
  },

  cefaleia_hsa: {
    aliases: [
      "cefaleia grave",
      "cefaleia subita",
      "pior dor da vida",
      "hemorragia subaracnoide",
      "hsa",
      "sangramento subaracnoide",
      "thunderclap headache",
      "cefaleia em trovoada",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
        "Explicou que cefaleia súbita ou intensa pode indicar condição grave.",
        "Orientou a necessidade de investigação urgente.",
        "Manteve postura calma e acolhedora diante da dor intensa.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Investigou início súbito ou cefaleia de máxima intensidade no início.",
        "Investigou se foi a pior dor da vida.",
        "Investigou vômitos, rigidez de nuca, síncope, convulsão ou alteração neurológica.",
        "Investigou déficit focal, alteração visual ou rebaixamento.",
        "Investigou esforço, relação sexual, trauma, anticoagulantes ou aneurisma prévio.",
        "Investigou febre, imunossupressão, câncer ou outros sinais de alarme.",
        "Investigou o padrão prévio de cefaleias e a diferença em relação ao habitual.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e pressão arterial.",
        "Avaliou o nível de consciência.",
        "Realizou exame neurológico completo ou dirigido.",
        "Avaliou rigidez de nuca ou sinais meníngeos quando possível.",
        "Avaliou pupilas e sinais de hipertensão intracraniana quando aplicável.",
        "Procurou sinais de trauma ou déficit focal.",
      ],
      examesComplementares: [
        "Solicitou tomografia de crânio sem contraste urgente.",
        "Considerou punção lombar se a TC inicial for negativa e a suspeita persistir, conforme protocolo.",
        "Considerou angioTC ou angiografia se suspeita de aneurisma ou HSA.",
        "Solicitou exames laboratoriais básicos e coagulograma quando indicado.",
        "Considerou ECG ou monitorização conforme gravidade.",
        "Não tratou como cefaleia benigna sem excluir sinais de alarme.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu cefaleia grave ou hemorragia subaracnoide como hipótese.",
        "Relacionou cefaleia súbita, pior dor da vida, rigidez de nuca ou síncope à suspeita.",
        "Diferenciou HSA de enxaqueca, meningite, AVC, dissecção e cefaleia tensional.",
        "Identificou red flags de cefaleia secundária.",
        "Avaliou gravidade e necessidade de investigação emergencial.",
      ],
      condutaSeguranca: [
        "Encaminhou para emergência ou investigação urgente.",
        "Controlou dor e sintomas sem atrasar a investigação.",
        "Monitorou o nível de consciência e os sinais neurológicos.",
        "Solicitou avaliação neurológica ou neurocirúrgica se suspeita confirmada ou alta.",
        "Evitou alta insegura em cefaleia súbita ou com sinais de alarme.",
        "Orientou sinais de alarme e retorno imediato.",
        "Avaliou contraindicações antes da punção lombar quando aplicável.",
      ],
    },
  },

  vertigem_sindrome_vestibular: {
    aliases: [
      "vertigem",
      "tontura rotatoria",
      "sindrome vestibular",
      "labirintite",
      "neuronite vestibular",
      "vertigem posicional",
      "vppb",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao paciente ou identificou seu papel no atendimento.",
        "Explicou que tontura ou vertigem pode ter origem vestibular ou neurológica.",
        "Orientou que sinais de alerta precisam ser avaliados.",
        "Manteve postura acolhedora diante de náuseas, medo ou instabilidade.",
        "Confirmou compreensão ou abriu espaço para dúvidas.",
      ],
      anamnese: [
        "Caracterizou a tontura como vertigem rotatória, desequilíbrio, pré-síncope ou sensação inespecífica.",
        "Investigou início, duração, gatilhos posicionais e recorrência.",
        "Investigou náuseas, vômitos, zumbido, perda auditiva ou plenitude auricular.",
        "Investigou cefaleia, diplopia, disartria, fraqueza, ataxia ou déficit neurológico.",
        "Investigou fatores de risco vascular como HAS, diabetes, tabagismo, fibrilação atrial ou AVC prévio.",
        "Investigou infecção viral recente, trauma ou uso de medicamentos.",
        "Pesquisou incapacidade de deambular ou sinais de vertigem central.",
      ],
      exameFisico: [
        "Avaliou sinais vitais e estado geral.",
        "Realizou exame neurológico dirigido.",
        "Avaliou marcha, coordenação e equilíbrio quando possível.",
        "Avaliou nistagmo.",
        "Considerou manobras vestibulares como Dix-Hallpike quando indicado.",
        "Avaliou sinais auditivos ou otoscopia quando aplicável.",
        "Procurou sinais de AVC posterior ou síndrome vestibular central.",
      ],
      examesComplementares: [
        "Reconheceu que vertigem periférica típica pode ser diagnóstico clínico.",
        "Solicitou neuroimagem se sinais neurológicos, fatores de risco, ataxia grave, nistagmo central ou suspeita de AVC posterior.",
        "Considerou exames laboratoriais se tontura inespecífica, síncope, desidratação ou causa metabólica.",
        "Considerou ECG se pré-síncope, palpitações ou suspeita cardiovascular.",
        "Evitou exames desnecessários em VPPB típica sem sinais de alarme.",
      ],
      raciocinioDiagnostico: [
        "Diferenciou vertigem periférica de vertigem central.",
        "Reconheceu VPPB, neurite vestibular ou labirintopatia quando compatível.",
        "Considerou AVC de circulação posterior diante de sinais de alarme.",
        "Diferenciou vertigem de síncope, hipoglicemia, arritmia ou hipotensão.",
        "Relacionou duração, gatilhos e sintomas auditivos ao diagnóstico.",
        "Avaliou o risco neurológico.",
      ],
      condutaSeguranca: [
        "Indicou manobra de reposicionamento se VPPB compatível.",
        "Indicou tratamento sintomático curto quando apropriado.",
        "Encaminhou para emergência ou neuroimagem se sinais centrais, déficit neurológico, ataxia grave ou alto risco.",
        "Orientou evitar dirigir ou risco de quedas durante os sintomas.",
        "Orientou sinais de alarme como fraqueza, fala enrolada, visão dupla, cefaleia súbita ou piora neurológica.",
        "Definiu retorno ou acompanhamento conforme persistência.",
        "Evitou alta insegura em possível AVC posterior.",
      ],
    },
  },

  rebaixamento_consciencia: {
    aliases: [
      "rebaixamento do nivel de consciencia",
      "rebaixamento de consciencia",
      "coma",
      "confusao mental aguda",
      "delirium agudo",
      "alteracao do nivel de consciencia",
      "sonolencia importante",
    ],
    criteriosPorCard: {
      comunicacao: [
        "Apresentou-se ao acompanhante ou equipe e identificou seu papel no atendimento.",
        "Explicou que a alteração de consciência é um sinal potencialmente grave.",
        "Orientou a necessidade de avaliação imediata das causas reversíveis.",
        "Manteve postura objetiva e acolhedora com familiares ou equipe.",
        "Confirmou informações com acompanhante ou testemunha quando possível.",
      ],
      anamnese: [
        "Investigou início, tempo de evolução e circunstâncias do rebaixamento.",
        "Investigou trauma, convulsão, febre, uso de álcool, drogas ou medicamentos.",
        "Investigou diabetes, hipoglicemia, doença renal ou hepática, AVC, epilepsia ou infecção.",
        "Investigou sintomas prévios como cefaleia, déficit focal, dor torácica, dispneia ou vômitos.",
        "Investigou uso de anticoagulantes, sedativos, opioides ou psicotrópicos.",
        "Investigou sinais de intoxicação ou abstinência.",
        "Obteve informações de familiares, equipe ou prontuário quando o paciente não podia responder.",
      ],
      exameFisico: [
        "Avaliou via aérea, respiração e circulação.",
        "Avaliou sinais vitais e saturação.",
        "Avaliou glicemia capilar imediatamente.",
        "Avaliou a escala de coma de Glasgow ou o nível de consciência.",
        "Avaliou pupilas e sinais neurológicos focais.",
        "Procurou sinais de trauma, meningismo, sepse ou intoxicação.",
        "Avaliou perfusão, hidratação e temperatura.",
      ],
      examesComplementares: [
        "Solicitou glicemia capilar ou confirmou avaliação imediata.",
        "Solicitou exames laboratoriais básicos, eletrólitos, função renal ou hepática e gasometria conforme contexto.",
        "Considerou toxicologia ou níveis de medicações conforme suspeita.",
        "Solicitou neuroimagem se déficit focal, trauma, anticoagulação, cefaleia súbita ou causa neurológica suspeita.",
        "Considerou ECG quando intoxicação, distúrbio metabólico ou causa cardiovascular possível.",
        "Solicitou culturas ou exames infecciosos se febre ou suspeita de sepse.",
      ],
      raciocinioDiagnostico: [
        "Reconheceu rebaixamento de consciência como emergência sindrômica.",
        "Priorizou causas reversíveis como hipoglicemia, hipóxia, intoxicação, sepse ou distúrbio metabólico.",
        "Considerou causas neurológicas como AVC, hemorragia, convulsão pós-ictal ou meningite.",
        "Diferenciou delirium, síncope, intoxicação, pós-ictal e coma estrutural ou metabólico.",
        "Relacionou exame físico e exames iniciais à estratificação de gravidade.",
        "Avaliou o risco de perda de via aérea.",
      ],
      condutaSeguranca: [
        "Garantiu a abordagem ABC e a proteção de via aérea quando necessário.",
        "Corrigiu hipoglicemia, hipóxia ou causa reversível imediata quando identificada.",
        "Monitorou sinais vitais, glicemia, consciência e saturação.",
        "Encaminhou para emergência, sala vermelha ou UTI conforme gravidade.",
        "Solicitou avaliação especializada conforme a causa suspeita.",
        "Evitou alta insegura sem esclarecer a causa do rebaixamento.",
        "Reavaliou a resposta às medidas iniciais.",
      ],
    },
  },
};

/** Normaliza texto para comparação: minúsculas, sem acentos, espaços colapsados. */
function normalizar(texto: string): string {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Posição do alias no alvo (word boundary). -1 se não casar.
 * Evita falsos positivos de siglas curtas (ex.: "ic" dentro de "insuficiencia"). */
function posicaoAlias(alvo: string, alias: string): number {
  const a = normalizar(alias);
  if (!a) return -1;
  const esc = a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = new RegExp(`(?:^|[^a-z0-9])${esc}(?:[^a-z0-9]|$)`).exec(alvo);
  return m ? m.index : -1;
}

/** Marcador pediátrico no texto (para desambiguar pneumonia adulto x pediátrica). */
const MARCADOR_PEDIATRICO = /crianca|lactente|escolar|pediatr|neonat|bebe|recem|pre-escolar|menor de/;

/** Marcadores de descompensação (IC aguda) e de cronicidade/estabilidade (IC ambulatorial). */
const MARCADOR_IC_DESCOMPENSADA = /descompensad|edema agudo|congestao pulmonar|dispneia aguda|descompensacao/;
const MARCADOR_IC_CRONICA = /cronic|estavel|compensad|seguimento|ambulatorial|acompanhamento/;

/** Marcador de ITU alta (pielonefrite): sinais sistêmicos / lombar. */
const MARCADOR_ITU_ALTA = /pielonefrite|itu alta|infeccao urinaria alta|dor lombar|flanco|giordano|punho percussao/;

/** Marcadores para desambiguar AVC isquêmico × hemorrágico × AIT. */
const MARCADOR_AVC_HEMORRAGICO = /hemorrag|hematoma|sangramento intracran/;
const MARCADOR_AIT = /\bait\b|transitori|sintomas neurologicos resolvid/;

/** Vertigem CENTRAL (AVC) vs periférica (vestibular). */
const MARCADOR_VERTIGEM_CENTRAL = /vertigem central|cerebelar|\bavc\b|circulacao posterior/;

/**
 * Identifica a chave de rubrica específica a partir do diagnóstico esperado /
 * título do caso (e marcadores de faixa etária). Retorna null se não houver
 * rubrica mapeada (fallback genérico).
 */
export function identificarDiagnosticoRubrica(
  ...textos: Array<string | undefined | null>
): DiagnosticoRubricaKey | null {
  const alvo = normalizar(textos.filter(Boolean).join(" "));
  if (!alvo) return null;

  // Escolhe o match de MENOR posição no texto: o diagnóstico principal vem primeiro,
  // então "Derrame Pleural (provável insuficiência cardíaca)" → derrame_pleural,
  // não insuficiencia_cardiaca (que aparece depois, como causa).
  let achado: DiagnosticoRubricaKey | null = null;
  let melhorIdx = Infinity;
  for (const [key, rubrica] of Object.entries(DIAGNOSIS_MICROCRITERIA) as Array<
    [DiagnosticoRubricaKey, DiagnosisMicrocriteria]
  >) {
    for (const a of rubrica.aliases) {
      const idx = posicaoAlias(alvo, a);
      if (idx >= 0 && idx < melhorIdx) {
        melhorIdx = idx;
        achado = key;
      }
    }
  }
  if (!achado) return null;

  // Desambiguação pneumonia: adulto x pediátrica independe da ordem dos aliases.
  if (achado === "pneumonia_adulto" || achado === "pneumonia_pediatrica") {
    return MARCADOR_PEDIATRICO.test(alvo) ? "pneumonia_pediatrica" : "pneumonia_adulto";
  }

  // Desambiguação IC: descompensada (aguda) x crônica estável (ambulatorial).
  // Checa descompensação ANTES (pois "compensad" é substring de "descompensad").
  if (achado === "insuficiencia_cardiaca" || achado === "ic_cronica_estavel") {
    if (MARCADOR_IC_DESCOMPENSADA.test(alvo)) return "insuficiencia_cardiaca";
    if (MARCADOR_IC_CRONICA.test(alvo)) return "ic_cronica_estavel";
    return "insuficiencia_cardiaca"; // default mantém o comportamento do Lote 2A
  }

  // Desambiguação ITU: cistite (baixa) sobe para pielonefrite se houver sinais altos.
  if (achado === "itu_baixa_cistite" && MARCADOR_ITU_ALTA.test(alvo)) {
    return "pielonefrite";
  }

  // Desambiguação AVC: isquêmico × hemorrágico × AIT.
  // Respeita o achado já específico (hemorrágico/AIT via menor posição);
  // só reclassifica o isquêmico genérico quando há marcadores claros.
  if (achado === "avc_isquemico" || achado === "avc_hemorragico" || achado === "ait") {
    if (achado === "avc_hemorragico") return "avc_hemorragico";
    if (achado === "ait") return "ait";
    if (MARCADOR_AVC_HEMORRAGICO.test(alvo)) return "avc_hemorragico";
    if (MARCADOR_AIT.test(alvo)) return "ait";
    return "avc_isquemico";
  }

  // Vertigem central (AVC) tem prioridade sobre síndrome vestibular periférica.
  if (achado === "vertigem_sindrome_vestibular" && MARCADOR_VERTIGEM_CENTRAL.test(alvo)) {
    return MARCADOR_AVC_HEMORRAGICO.test(alvo) ? "avc_hemorragico" : "avc_isquemico";
  }
  return achado;
}

/** Mapa eixo (axis) → chave do card em criteriosPorCard. */
export const AXIS_PARA_CAMPO: Record<string, keyof DiagnosisMicrocriteria["criteriosPorCard"]> = {
  "axis:comunicacao": "comunicacao",
  "axis:anamnese": "anamnese",
  "axis:exame_fisico": "exameFisico",
  "axis:exames_complementares": "examesComplementares",
  "axis:raciocinio_clinico": "raciocinioDiagnostico",
  "axis:conduta_seguranca": "condutaSeguranca",
};
