import { Caso } from "@/lib/types";

export const casosPediatricos: Caso[] = [
  {
    // ====== CASO PED-01: FEBRE EM CRIANÇA DE 4 ANOS ======
    id: "ped-01",
    titulo: "Febre em Criança de 4 Anos",
    sistema: "Geral/Infeccioso",
    tema: "Febre na Infância",
    nivel: "iniciante",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico:
      "Realizar anamnese pediátrica adequada, investigar fonte de infecção, avaliar sinais de gravidade em criança febril",
    tipoPaciente: "pediatrico",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Sofia",
      idade: 4,
      sexo: "Feminino",
      queixa_principal: "Febre há 3 dias",
      historia_breve: "Mãe relata febre e redução do apetite",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Infecção Viral Inespecífica",
      diagnosticos_diferenciais: [
        "Infecção do Trato Urinário",
        "Otite Média Aguda",
        "Faringite",
        "Pneumonia Bacteriana",
      ],
      sindromes_associadas: ["Síndrome febril"],
    },

    descricaoBreve:
      "Criança com febre há 3 dias, apetite reduzido, mãe como responsável principal",
    categoria: "Infeccioso",
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
          parentesco: "mãe",
        },
        peso: "16 kg",
        estadoVacinal: "atualizado",
        gestacaoParto: "nascida a termo, parto normal",
        desenvolvimento: "adequado para a idade",
        alimentacao: "reduzida por causa da febre",
        aberturaResponsavel:
          "Doutora, a Sofia acordou com febre alta. Tive que dar dipirona, mas continua com febre.",
      },
    },

    respostas_do_paciente: {
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
        "Mãe: Está tudo em dia. A última vacina foi a tríplice viral há 2 meses.",
    },
    respostaPaciente: {
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
        "Mãe: Está tudo em dia. A última vacina foi a tríplice viral há 2 meses.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "100/65 mmHg",
        frequenciaCardiaca: 118,
        frequenciaRespiratoria: 28,
        temperatura: 38.8,
        saturacaoOxigenio: 97,
        peso: 16,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "100/65 mmHg",
      frequenciaCardiaca: 118,
      frequenciaRespiratoria: 28,
      temperatura: 38.8,
      saturacaoOxigenio: 97,
      peso: 16,
    },

    exame_fisico: {
      correto: {
        inspecao:
          "Criança apática, mucosas úmidas, sem sinais de desidratação moderada",
        palpacao: "Linfonodos cervicais sem aumento significativo",
        ausculta:
          "Murmúrio vesicular presente bilateralmente, sem roncos ou sibilos",
        percussao: "Normal",
        observacoes:
          "Exame geral sem focos infecciosos óbvios. Avaliar tímpanos e garganta",
        achados_positivos: ["Febre", "Apatia relativa"],
        achados_negativos: ["Tosse", "Dispneia", "Exantema"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Criança apática, mucosas úmidas",
      palpacao: "Linfonodos cervicais sem aumento significativo",
      ausculta: "MV bilateralmente presente",
      percussao: "Normal",
      observacoes: "Sem foco aparente de infecção",
    },

    exame_fisico_interativo: {
      geral: {
        estado_geral: "Criança apática, com febre",
        consciencia: "Lúcida, mas sonolenta",
        hidratacao: "Mucosas úmidas, turgor da pele normal",
        coloracao: "Palidez leve",
      },
      respiratorio: {
        padrao_respiratorio: "Taquipneico para a idade",
        ausculta_pulmonar: "MV presente bilateralmente",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Hemograma",
        descricao: "Contagem de células sanguíneas",
        resultado: "Leucócitos 9.500/μL, predomínio de linfócitos",
        valor_referencia: "5.000-15.000/μL",
        interpretacao: "Padrão linfocítico sugestivo de infecção viral",
      },
      {
        nome: "Urocultura",
        descricao: "Cultura de urina",
        resultado: "Negativa",
        valor_referencia: "Sem crescimento",
        interpretacao: "Exclui infecção urinária",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Infecção Viral Inespecífica",
        probabilidade: 70,
        criterios_minimos: ["Febre", "Padrão linfocítico", "Contato com doente"],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Infecção do Trato Urinário",
        criterios_exclusao: ["Urocultura negativa"],
        achados_que_descartam: ["Urocultura negativa", "Sem disúria"],
      },
    ],
    examesIndicados: ["Hemograma", "Urocultura", "PCR se persistência"],

    conduta_esperada: {
      imediata: [
        "Investigar foco de infecção",
        "Avaliar sinais de gravidade",
        "Prescrever antitérmico",
        "Orientar hidratação",
      ],
      curto_prazo: [
        "Monitorar temperatura",
        "Reavaliação em 48-72h",
        "Orientações aos pais",
      ],
      longo_prazo: ["Seguimento ambulatorial"],
      encaminhamentos: ["Pediatria geral"],
    },
    condutaCorreta:
      "Anamnese completa pediátrica, exame físico direcionado, orientações de hidratação e conforto, reavaliar em 48-72h",

    criterios_de_gravidade: [
      {
        severidade: "leve",
        sinais: ["Febre moderada", "Criança ativa"],
        descricao: "Monitorar",
        recomendacao: "Acompanhamento ambulatorial",
      },
    ],

    erros_criticos: [
      {
        erro:
          "Não investigar fonte de infecção (otite, garganta, urina, pulmão)",
        descricao: "Essencial para diagnóstico em criança febril",
        penalidade: 1.5,
        evitavel: true,
      },
      {
        erro: "Não avaliar sinais de desidratação",
        descricao:
          "Criança febril tem risco de desidratação, especialmente com redução de ingestão",
        penalidade: 1.5,
        evitavel: true,
      },
    ],

    checklist_osce: [
      {
        item: "Investigou início, duração e padrão da febre",
        realizado: false,
        critico: true,
      },
      {
        item: "Perguntou sobre sintomas associados",
        realizado: false,
        critico: true,
      },
      {
        item: "Investigou vacinação",
        realizado: false,
        critico: false,
      },
      {
        item: "Avaliou hidratação",
        realizado: false,
        critico: true,
      },
      {
        item: "Examinou foco de infecção",
        realizado: false,
        critico: true,
      },
    ],

    rubrica_correcao: [
      {
        criterio: "Anamnese Pediátrica",
        peso: 20,
        descricao: "Perguntas apropriadas para criança febril",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Exame Físico",
        peso: 20,
        descricao: "Busca sistemática de foco de infecção",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Investigação",
        peso: 15,
        descricao: "Exames apropriados",
        pontuacao_maxima: 15,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: [
          "Duração e padrão da febre",
          "Sintomas associados",
          "Vacinação",
          "Contato com doentes",
        ],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: [
          "Sinais vitais adequados para idade",
          "Avaliação de hidratação",
          "Busca de foco",
          "Hemograma",
        ],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: [
          "Febre de origem investigada",
          "Exclusão de gravidade",
        ],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Antitérmico", "Hidratação", "Seguimento"],
      },
    },

    feedback_modelo: {
      acertos_esperados: [
        "Investigou foco sistemático",
        "Avaliou desidratação",
        "Prescreveu antitérmico",
        "Orientou pais sobre quando retornar",
      ],
      erros_comuns: [
        "Exame rápido sem procurar foco",
        "Não avaliar vacinação",
        "Prescrever antibiótico sem foco",
      ],
      orientacoes_pedagogicas: [
        "Febre é proteção - importante buscar causa",
        "Criança com vacinação em dia tem risco menor de graves",
        "Desidratação é complicação importante",
      ],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer:
        "Anamnese pediátrica completa, exame físico sistemático procurando foco, orientações aos pais",
      comunicacao: [
        "conversou com a mãe de forma empática",
        "explicou o que estava procurando",
      ],
      anamnese: [
        "perguntou sobre padrão de febre",
        "investigou sintomas associados",
        "verificou vacinação",
      ],
      exame_fisico: ["examinou garganta", "avaliou tímpanos", "palpou abdome"],
      exames_complementares: ["pediu hemograma se indicado"],
      raciocinio: ["formulou hipóteses apropriadas"],
      conduta: ["orientou hidratação e acompanhamento"],
      soap: ["documentou corretamente"],
    },

    temaOSCE: "Pediatria - Febre",
    subtopicosOSCE: ["Febre na infância", "Anamnese pediátrica", "Desidratação"],
    diagnosticoCorreto: "Infecção Viral Inespecífica",
    ativo: true,
  },

  // ====== CASO PED-02: PUERICULTURA E ANTROPOMETRIA EM LACTENTE ======
  {
    id: "ped-02",
    titulo: "Consulta de Puericultura - Lactente de 8 Meses",
    sistema: "Geral/Puericultura",
    tema: "Puericultura",
    nivel: "iniciante",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Avaliar crescimento e desenvolvimento, medir perímetro cefálico, peso, comprimento, investigar alimentação e vacinação",
    tipoPaciente: "pediatrico",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Lucas",
      idade: 0.67,
      sexo: "Masculino",
      queixa_principal: "Consulta de rotina",
      historia_breve: "Mãe traz para avaliação de desenvolvimento",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Crescimento e desenvolvimento normais",
      diagnosticos_diferenciais: ["Atraso no desenvolvimento", "Insuficiência ponderal"],
      sindromes_associadas: [],
    },

    descricaoBreve: "Lactente de 8 meses em consulta de puericultura regular",
    categoria: "Puericultura",
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
          parentesco: "mãe",
        },
        peso: "8.2 kg",
        estatura: "70 cm",
        perimetroCefalico: "43.5 cm",
        estadoVacinal: "vacinação em dia",
        gestacaoParto: "a termo, parto vaginal",
        desenvolvimento: "engatinhando, brincando com objetos, balbucio",
        alimentacao: "leite materno + papinhas (6 meses), iniciando alimentos",
        aberturaResponsavel: "Doutora, trouxe meu filho para a consulta de 8 meses. Queria saber como está o crescimento dele.",
      },
    },

    respostas_do_paciente: {
      inicial: "Mãe: Ele está comendo bem, começou a comer frutas e legumes.",
      desenvolvimento: "Mãe: Ele já engatinha, pega brinquedos e coloca na boca. Balbucia bastante.",
      sono: "Mãe: Dorme bem, umas 10 horas à noite e dorme durante o dia.",
      fezes: "Mãe: Normal, amareladas, umas 2 vezes ao dia.",
      vacinacao: "Mãe: Está tudo em dia, a última foi pentavalente há um mês.",
    },
    respostaPaciente: {
      inicial: "Mãe: Ele está comendo bem, começou a comer frutas e legumes.",
      desenvolvimento: "Mãe: Ele já engatinha, pega brinquedos e coloca na boca. Balbucia bastante.",
      sono: "Mãe: Dorme bem, umas 10 horas à noite e dorme durante o dia.",
      fezes: "Mãe: Normal, amareladas, umas 2 vezes ao dia.",
      vacinacao: "Mãe: Está tudo em dia, a última foi pentavalente há um mês.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "não aferida",
        frequenciaCardiaca: 128,
        frequenciaRespiratoria: 32,
        temperatura: 36.8,
        saturacaoOxigenio: 98,
        peso: 8.2,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "não aferida em lactente",
      frequenciaCardiaca: 128,
      frequenciaRespiratoria: 32,
      temperatura: 36.8,
      saturacaoOxigenio: 98,
      peso: 8.2,
    },

    exame_fisico: {
      correto: {
        inspecao: "Lactente ativo, alegre, bem nutrido",
        palpacao: "Fontanela anterior pequena, adequada para idade",
        ausculta: "Ausculta cardíaca e pulmonar sem alterações",
        percussao: "Normal",
        observacoes: "Exame geral normal, sem sinais de alarme",
        achados_positivos: ["Desenvolvimento adequado"],
        achados_negativos: ["Sinais de desnutrição", "Sinais de alergia"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Lactente ativo, bem nutrido, alegre",
      palpacao: "Fontanela anterior pequena, adequada",
      ausculta: "Sem alterações cardiopulmonares",
      percussao: "Normal",
      observacoes: "Desenvolvimento normal para idade",
    },

    exame_fisico_interativo: {
      geral: {
        estado_geral: "Lactente ativo e alegre",
        consciencia: "Reativo, interage com mãe",
        hidratacao: "Mucosas úmidas, turgor normal",
      },
    },

    exames_complementares_disponiveis: [],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Crescimento e desenvolvimento normais",
        probabilidade: 95,
        criterios_minimos: ["Peso percentil 50", "Comprimento percentil 50", "PC percentil 50", "Marcos adequados"],
      },
    ],

    diagnosticos_diferenciais: [],
    examesIndicados: [],

    conduta_esperada: {
      imediata: ["Avaliar crescimento com curvas de crescimento", "Verificar desenvolvimento com marcos", "Revisar cartão de vacinação"],
      curto_prazo: ["Orientar alimentação complementar", "Orientar higiene e prevenção de acidentes"],
      longo_prazo: ["Acompanhamento regular de puericultura"],
      encaminhamentos: [],
    },
    condutaCorreta: "Medir peso, comprimento e perímetro cefálico, comparar com curvas de crescimento, avaliar desenvolvimento, revisar vacinação, orientar alimentação",

    criterios_de_gravidade: [
      {
        severidade: "leve",
        sinais: ["Lactente normal"],
        descricao: "Seguimento rotineiro",
        recomendacao: "Puericultura a cada 2-3 meses",
      },
    ],

    erros_criticos: [
      {
        erro: "Não medir perímetro cefálico adequadamente",
        descricao: "Medida importante para detecção de anomalias",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Mediu peso", realizado: false, critico: true },
      { item: "Mediu comprimento", realizado: false, critico: true },
      { item: "Mediu perímetro cefálico", realizado: false, critico: true },
      { item: "Avaliou desenvolvimento", realizado: false, critico: true },
      { item: "Revisou vacinação", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Antropometria",
        peso: 30,
        descricao: "Medidas corretas e comparação com curvas",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Desenvolvimento",
        peso: 25,
        descricao: "Avaliação adequada de marcos",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Vacinação e Alimentação",
        peso: 20,
        descricao: "Revisão e orientações",
        pontuacao_maxima: 20,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: ["Alimentação", "Desenvolvimento", "Sono", "Eliminações"],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Peso", "Comprimento", "PC", "Exame físico geral"],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Crescimento adequado", "Desenvolvimento adequado"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Orientação alimentar", "Próxima consulta"],
      },
    },

    feedback_modelo: {
      acertos_esperados: ["Mediu antropometria completa", "Comparou com curvas de crescimento", "Avaliou desenvolvimento"],
      erros_comuns: ["Esquecer de medir PC", "Não interpretar adequadamente as curvas"],
      orientacoes_pedagogicas: ["PC importante para detecção de problemas neurológicos"],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Avaliação completa de crescimento e desenvolvimento",
      comunicacao: ["conversou com a mãe de forma empática"],
      anamnese: ["perguntou sobre desenvolvimento"],
      exame_fisico: ["mediu corretamente", "comparou com curvas"],
      exames_complementares: [],
      raciocinio: ["interpretou adequadamente"],
      conduta: ["orientou próximas etapas"],
      soap: ["documentou corretamente"],
    },

    temaOSCE: "Pediatria - Puericultura",
    subtopicosOSCE: ["Crescimento", "Desenvolvimento", "Antropometria"],
    diagnosticoCorreto: "Crescimento e desenvolvimento normais",
    ativo: true,
  },

  // ====== CASO PED-03: PRESSÃO ARTERIAL PEDIÁTRICA ======
  {
    id: "ped-03",
    titulo: "Avaliação de Pressão Arterial - Menina de 4 Anos",
    sistema: "Cardiovascular",
    tema: "Hipertensão em Pediatria",
    nivel: "iniciante",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 10,
    objetivo_pedagogico: "Técnica correta de medida de PA em criança, interpretação por idade/sexo/estatura",
    tipoPaciente: "pediatrico",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Ana",
      idade: 4,
      sexo: "Feminino",
      queixa_principal: "Consulta de rotina",
      historia_breve: "Mãe relata PA elevada na avaliação anterior",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Pressão arterial elevada para a idade",
      diagnosticos_diferenciais: ["Hipertensão primária", "Hipertensão secundária"],
      sindromes_associadas: [],
    },

    descricaoBreve: "Criança de 4 anos com avaliação de PA elevada",
    categoria: "Cardiovascular",
    paciente: {
      id: "pac-ped-03",
      nome: "Ana",
      idade: 4,
      sexo: "F",
      tipoPaciente: "pediatrico",
      queixaPrincipal: "Avaliação de pressão arterial",
      historicoDoenca: "PA elevada em avaliação anterior",
      antecedentes: [],
      alergias: [],
      medicamentos_em_uso: [],
      dadosPediatricos: {
        idadeAnos: 4,
        faixaEtaria: "pre_escolar",
        responsavel: {
          nome: "Fernanda",
          parentesco: "mãe",
        },
        peso: "17 kg",
        estatura: "102 cm",
        estadoVacinal: "em dia",
        aberturaResponsavel: "Doutora, a pressão da Ana estava alta na consulta anterior. Gostaria que avaliasse novamente com cuidado.",
      },
    },

    respostas_do_paciente: {
      inicial: "Mãe: Ela está bem, sem queixa.",
      sintomas: "Mãe: Não tem nada, só a pressão que preocupou.",
    },
    respostaPaciente: {
      inicial: "Mãe: Ela está bem, sem queixa.",
      sintomas: "Mãe: Não tem nada, só a pressão que preocupou.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "108/70 mmHg",
        frequenciaCardiaca: 96,
        frequenciaRespiratoria: 24,
        temperatura: 36.8,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "108/70 mmHg",
      frequenciaCardiaca: 96,
      frequenciaRespiratoria: 24,
      temperatura: 36.8,
      saturacaoOxigenio: 98,
    },

    exame_fisico: {
      correto: {
        inspecao: "Criança calma e cooperativa",
        palpacao: "Sem alterações",
        ausculta: "Sem sopros ou alterações cardíacas",
        percussao: "Normal",
        observacoes: "Exame cardiovascular normal",
        achados_positivos: [],
        achados_negativos: ["Sopros", "Arritmias"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Criança calma, cooperativa",
      ausculta: "Sem alterações cardíacas",
      observacoes: "PA elevada em relação ao percentil esperado para idade",
      palpacao: "Normal",
      percussao: "Normal",
    },

    exame_fisico_interativo: {},

    exames_complementares_disponiveis: [],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Pressão arterial elevada",
        probabilidade: 80,
        criterios_minimos: ["PA sistólica > percentil 95 para idade/sexo/estatura"],
      },
    ],

    diagnosticos_diferenciais: [],
    examesIndicados: ["ECG se confirmado", "Ultrassom renal se hipertensão sustentada"],

    conduta_esperada: {
      imediata: ["Medir PA em repouso", "Usar manguito adequado (40% da circunferência", "Comparar com tabelas de percentil"],
      curto_prazo: ["Orientar acompanhamento"],
      longo_prazo: ["Monitoramento regular de PA"],
      encaminhamentos: ["Cardiologia pediátrica se PA persistentemente elevada"],
    },
    condutaCorreta: "Medir PA com técnica adequada, usar manguito correto, comparar com percentis para idade/sexo/estatura, investigar causa se persistente",

    criterios_de_gravidade: [
      {
        severidade: "leve",
        sinais: ["PA elevada uma vez"],
        descricao: "Pode ser por ansiedade",
        recomendacao: "Repetir medida",
      },
    ],

    erros_criticos: [
      {
        erro: "Usar manguito inadequado",
        descricao: "Manguito incorreto gera medidas falsas",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Criança em repouso adequado", realizado: false, critico: true },
      { item: "Manguito adequado para idade", realizado: false, critico: true },
      { item: "Braço na altura do coração", realizado: false, critico: true },
      { item: "Comparou com tabelas de percentil", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Técnica de medida",
        peso: 40,
        descricao: "Procedimento correto",
        pontuacao_maxima: 40,
      },
      {
        criterio: "Interpretação",
        peso: 30,
        descricao: "Comparação com percentis",
        pontuacao_maxima: 30,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: ["Queixa atual", "Sintomas de alerta"],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["PA com técnica adequada", "Medidas em repouso"],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["PA comparada com percentil"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Acompanhamento", "Investigação se necessária"],
      },
    },

    feedback_modelo: {
      acertos_esperados: ["Técnica correta de medida", "Interpretação adequada dos percentis"],
      erros_comuns: ["Manguito inadequado", "Criança ansiosa", "Não comparar com tabelas"],
      orientacoes_pedagogicas: ["PA varia com idade, sexo e estatura", "Importante usar tabelas apropriadas"],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Técnica correta e interpretação adequada",
      comunicacao: ["acalmou a criança"],
      exame_fisico: ["técnica adequada", "comparação correta"],
    },

    temaOSCE: "Pediatria - Hipertensão",
    subtopicosOSCE: ["PA em pediatria", "Técnica", "Percentis"],
    diagnosticoCorreto: "Pressão arterial elevada para a idade",
    ativo: true,
  },

  // ====== CASO PED-04: DESENVOLVIMENTO NORMAL - 10 MESES ======
  {
    id: "ped-04",
    titulo: "Avaliação de Desenvolvimento - Lactente de 10 Meses",
    sistema: "Neurológico",
    tema: "Desenvolvimento",
    nivel: "iniciante",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Avaliar marcos do desenvolvimento, tranquilizar responsável sobre desenvolvimento normal",
    tipoPaciente: "pediatrico",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Gabriel",
      idade: 0.83,
      sexo: "Masculino",
      queixa_principal: "Mãe preocupada porque ainda não anda",
      historia_breve: "Mãe traz lactente por preocupação com atraso motora",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Desenvolvimento normal para a idade",
      diagnosticos_diferenciais: ["Atraso no desenvolvimento"],
      sindromes_associadas: [],
    },

    descricaoBreve: "Lactente de 10 meses com desenvolvimento dentro dos limites da normalidade",
    categoria: "Neurológico",
    paciente: {
      id: "pac-ped-04",
      nome: "Gabriel",
      idade: 0.83,
      sexo: "M",
      tipoPaciente: "pediatrico",
      queixaPrincipal: "Preocupação com desenvolvimento",
      historicoDoenca: "Mãe refere que criança ainda não anda aos 10 meses",
      antecedentes: ["Parto a termo"],
      alergias: [],
      medicamentos_em_uso: [],
      dadosPediatricos: {
        idadeMeses: 10,
        faixaEtaria: "lactente",
        responsavel: {
          nome: "Beatriz",
          parentesco: "mãe",
        },
        peso: "9.5 kg",
        estatura: "73 cm",
        desenvolvimento: "senta sem apoio, engatinha bem, pega e larga objetos, brinca de esconde-esconde",
        alimentacao: "leite materno + alimentos variados",
        aberturaResponsavel: "Doutora, estou preocupada porque o Gabriel ainda não anda. Meu primo andava com 9 meses.",
      },
    },

    respostas_do_paciente: {
      inicial: "Mãe: Ele senta sozinho, engatinha rápido, mas não anda ainda.",
      brincadeiras: "Mãe: Ele brinca, puxa o sofá para se levantar, mas solta e cai.",
      linguagem: "Mãe: Fala 'papá' e 'mamá', entende quando chamamos.",
      pinça: "Mãe: Pega pequenas coisas com dois dedos, coloca na boca.",
    },
    respostaPaciente: {
      inicial: "Mãe: Ele senta sozinho, engatinha rápido, mas não anda ainda.",
      brincadeiras: "Mãe: Ele brinca, puxa o sofá para se levantar, mas solta e cai.",
      linguagem: "Mãe: Fala 'papá' e 'mamá', entende quando chamamos.",
      pinça: "Mãe: Pega pequenas coisas com dois dedos, coloca na boca.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "não aferida",
        frequenciaCardiaca: 125,
        frequenciaRespiratoria: 30,
        temperatura: 36.8,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "não aferida",
      frequenciaCardiaca: 125,
      frequenciaRespiratoria: 30,
      temperatura: 36.8,
      saturacaoOxigenio: 98,
    },

    exame_fisico: {
      correto: {
        inspecao: "Lactente ativo, brinca adequadamente",
        palpacao: "Sem alterações",
        ausculta: "Normal",
        percussao: "Normal",
        observacoes: "Exame neurológico normal, desenvolvimento adequado",
        achados_positivos: ["Marcos adequados para idade"],
        achados_negativos: ["Sinais de alarme"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Lactente ativo, brincando",
      observacoes: "Desenvolvimento motor, cognitivo e social dentro dos limites normais para 10 meses",
      palpacao: "Normal",
      percussao: "Normal",
      ausculta: "Normal",
    },

    exame_fisico_interativo: {},

    exames_complementares_disponiveis: [],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Desenvolvimento normal",
        probabilidade: 95,
        criterios_minimos: ["Senta sem apoio", "Engatinha", "Pinça primitiva", "Linguagem apropriada"],
      },
    ],

    diagnosticos_diferenciais: [],
    examesIndicados: [],

    conduta_esperada: {
      imediata: ["Tranquilizar mãe", "Explicar que andar entre 12-15 meses é normal", "Valorizar marcos já alcançados"],
      curto_prazo: ["Orientar prevenção de acidentes"],
      longo_prazo: ["Acompanhamento regular"],
      encaminhamentos: [],
    },
    condutaCorreta: "Avaliar marcos, tranquilizar responsável, explicar que andar aos 12-15 meses é normal, incentivar estimulação",

    criterios_de_gravidade: [
      {
        severidade: "leve",
        sinais: ["Desenvolvimento normal"],
        descricao: "Sem preocupação",
        recomendacao: "Acompanhamento de rotina",
      },
    ],

    erros_criticos: [
      {
        erro: "Não reconhecer marcos normais e aumentar ansiedade dos pais",
        descricao: "Responsáveis precisam ser tranquilizados com informações adequadas",
        penalidade: 1.5,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou marcos motores", realizado: false, critico: true },
      { item: "Investigou linguagem", realizado: false, critico: true },
      { item: "Investigou aspecto cognitivo", realizado: false, critico: true },
      { item: "Tranquilizou mãe adequadamente", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Avaliação do desenvolvimento",
        peso: 30,
        descricao: "Investigação completa de marcos",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Comunicação com pais",
        peso: 40,
        descricao: "Tranquilização apropriada",
        pontuacao_maxima: 40,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: ["Preocupação dos pais", "Marcos já alcançados"],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Avaliação dos marcos", "Exame neurológico"],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Desenvolvimento dentro da normalidade"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Tranquilização", "Orientações de prevenção"],
      },
    },

    feedback_modelo: {
      acertos_esperados: ["Avaliação completa", "Tranquilização apropriada", "Explicação sobre variabilidade normal"],
      erros_comuns: ["Diagnóstico prematuro de atraso", "Não tranquilizar os pais"],
      orientacoes_pedagogicas: ["Andar aos 12-15 meses é completamente normal", "Importância de tranquilizar responsáveis"],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Avaliação completa e tranquilização apropriada",
      comunicacao: ["foi empático", "tranquilizou a mãe"],
      exame_fisico: ["avaliou completamente"],
    },

    temaOSCE: "Pediatria - Desenvolvimento",
    subtopicosOSCE: ["Marcos", "Desenvolvimento normal", "Ansiedade parental"],
    diagnosticoCorreto: "Desenvolvimento normal para idade",
    ativo: true,
  },

  // ====== CASO PED-05: INSUFICIÊNCIA CARDÍACA EM LACTENTE ======
  {
    id: "ped-05",
    titulo: "Insuficiência Cardíaca em Lactente - 4 Meses",
    sistema: "Cardiovascular",
    tema: "Cardiopatia Congênita",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 15,
    objetivo_pedagogico: "Reconhecer sinais de insuficiência cardíaca, solicitar ecocardiograma, estabelecer diagnóstico de cardiopatia congênita",
    tipoPaciente: "pediatrico",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Matheus",
      idade: 0.33,
      sexo: "Masculino",
      queixa_principal: "Cansaço às mamadas",
      historia_breve: "Mãe refere que lactente cansa rapidamente para mamar e sua bastante",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Insuficiência cardíaca secundária a cardiopatia congênita (PCA ou CIV)",
      diagnosticos_diferenciais: ["Pneumonia", "Infecção urinária"],
      sindromes_associadas: ["Insuficiência cardíaca"],
    },

    descricaoBreve: "Lactente de 4 meses com sinais de insuficiência cardíaca",
    categoria: "Cardiovascular",
    paciente: {
      id: "pac-ped-05",
      nome: "Matheus",
      idade: 0.33,
      sexo: "M",
      tipoPaciente: "pediatrico",
      queixaPrincipal: "Cansaço às mamadas",
      historicoDoenca: "Desde o primeiro mês notou-se cansaço ao mamar, sudorese na cabeça, ganho ponderal lento",
      antecedentes: ["Parto a termo", "Peso ao nascer 3.000g"],
      alergias: [],
      medicamentos_em_uso: [],
      dadosPediatricos: {
        idadeMeses: 4,
        faixaEtaria: "lactente",
        responsavel: {
          nome: "Rafaela",
          parentesco: "mãe",
        },
        peso: "4.8 kg",
        desenvolvimento: "adequado para idade",
        alimentacao: "leite materno, cansaço ao mamar",
        aberturaResponsavel: "Doutora, o Matheus fica muito cansado quando amamenta. Sua muito e para várias vezes para respirar. Ele também emagreceu.",
      },
    },

    respostas_do_paciente: {
      inicial: "Mãe: Ele cansa muito rapido, não consegue mamar direito.",
      sudorese: "Mãe: Sim, sua bastante na cabeça quando tenta mamar. Até a roupa fica molhada.",
      pausas: "Mãe: Sim, para várias vezes para respirar durante a mamada.",
      ganho_peso: "Mãe: Ganhou pouco peso este mês. Estava com 5 kg e agora voltou para 4.8 kg.",
      respiracao: "Mãe: Às vezes respira rápido mesmo dormindo.",
    },
    respostaPaciente: {
      inicial: "Mãe: Ele cansa muito rápido, não consegue mamar direito.",
      sudorese: "Mãe: Sim, sua bastante na cabeça quando tenta mamar. Até a roupa fica molhada.",
      pausas: "Mãe: Sim, para várias vezes para respirar durante a mamada.",
      ganho_peso: "Mãe: Ganhou pouco peso este mês. Estava com 5 kg e agora voltou para 4.8 kg.",
      respiracao: "Mãe: Às vezes respira rápido mesmo dormindo.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "não aferida",
        frequenciaCardiaca: 158,
        frequenciaRespiratoria: 58,
        temperatura: 36.8,
        saturacaoOxigenio: 92,
        peso: 4.8,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "não aferida",
      frequenciaCardiaca: 158,
      frequenciaRespiratoria: 58,
      temperatura: 36.8,
      saturacaoOxigenio: 92,
      peso: 4.8,
    },

    exame_fisico: {
      correto: {
        inspecao: "Lactente com taquipneia, taquicardia, baixo ganho ponderal",
        palpacao: "Fígado palpável a 4 cm do rebordo costal, pulso amplo",
        ausculta: "Sopro sistólico audível, ausculta pulmonar com crepitações finas bibasais",
        percussao: "Normal",
        observacoes: "Sinais de insuficiência cardíaca com congestão pulmonar",
        achados_positivos: ["Taquicardia", "Taquipneia", "Hepatomegalia", "Sopro", "Crepitações"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Lactente taquipneico, taquicárdico",
      palpacao: "Fígado aumentado, pulsos amplos",
      ausculta: "Sopro sistólico, crepitações em bases",
      observacoes: "Sinais de IC com congestão pulmonar",
      percussao: "Normal",
    },

    exame_fisico_interativo: {
      cardiovascular: {
        ausculta_cardiaca: "Sopro sistólico holossistólico ou ejeção, bulhas hipofonéticas",
        pulsos: "Amplitude aumentada, tempo de enchimento capilar aumentado",
      },
      respiratorio: {
        padrao_respiratorio: "Taquipneia, esforço respiratório",
        ausculta_pulmonar: "Crepitações finas em bases",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Ecocardiograma",
        descricao: "Ultrassom do coração",
        resultado: "PCA (Persistência do Ducto Arterioso) com fluxo esquerda-direita significativo",
        valor_referencia: "Sem alterações",
        interpretacao: "Cardiopatia congênita com shunt esquerda-direita",
      },
      {
        nome: "RX de Tórax",
        descricao: "Radiografia do tórax",
        resultado: "Cardiomegalia leve, congestão pulmonar",
        valor_referencia: "Normal",
        interpretacao: "Congestão pulmonar por insuficiência cardíaca",
      },
      {
        nome: "ECG",
        descricao: "Eletrocardiograma",
        resultado: "Sinais de sobrecarga ventricular esquerda",
        valor_referencia: "Normal",
        interpretacao: "Compatível com cardiopatia",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Insuficiência cardíaca em cardiopatia congênita",
        probabilidade: 85,
        criterios_minimos: ["Fadiga alimentar", "Sudorese", "Ganho ponderal lento", "Hepatomegalia", "Sopro", "Taquipneia"],
      },
    ],

    diagnosticos_diferenciais: [
      {
        diagnostico: "Pneumonia",
        criterios_exclusao: ["Ecocardiograma mostra cardiopatia"],
      
        achados_que_descartam: [],},
    ],
    examesIndicados: ["Ecocardiograma", "RX tórax", "ECG", "Oximetria contínua"],

    conduta_esperada: {
      imediata: ["Avaliar gravidade", "Iniciar suporte ventilatório se necessário", "Consultar cardiologia pediátrica"],
      curto_prazo: ["Diuréticos se congestão", "Inotropos se mal perfundido"],
      longo_prazo: ["Acompanhamento cardiológico regular", "Consideração para cirurgia se necessário"],
      encaminhamentos: ["Cardiologia pediátrica urgente"],
    },
    condutaCorreta: "Reconhecer sinais de IC, solicitar ecocardiograma urgentemente, referir para cardiologia pediátrica",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["Taquipneia importante", "Cianose", "Má perfusão"],
        descricao: "Insuficiência cardíaca descompensada",
        recomendacao: "Hospitalização imediata",
      },
    ],

    erros_criticos: [
      {
        erro: "Não solicitar ecocardiograma",
        descricao: "Essencial para diagnóstico de cardiopatia congênita",
        penalidade: 3,
        evitavel: true,
      },
      {
        erro: "Não reconhecer hepatomegalia",
        descricao: "Sinal importante de congestão",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou fadiga alimentar", realizado: false, critico: true },
      { item: "Investigou sudorese", realizado: false, critico: true },
      { item: "Avaliou ganho ponderal", realizado: false, critico: true },
      { item: "Ausculta cardíaca e pulmonar", realizado: false, critico: true },
      { item: "Palpou fígado", realizado: false, critico: true },
      { item: "Solicitou ecocardiograma", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Anamnese e Exame Físico",
        peso: 30,
        descricao: "Reconhecimento dos sinais de IC",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Investigação",
        peso: 40,
        descricao: "Solicitação apropriada de exames",
        pontuacao_maxima: 40,
      },
      {
        criterio: "Conduta",
        peso: 30,
        descricao: "Referência apropriada",
        pontuacao_maxima: 30,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: ["Fadiga alimentar", "Sudorese", "Ganho ponderal lento"],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Sinais vitais", "Ausculta cardíaca", "Palpação hepática", "Ausculta pulmonar"],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Insuficiência cardíaca em cardiopatia congênita"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Ecocardiograma", "Referência cardiologia pediátrica"],
      },
    },

    feedback_modelo: {
      acertos_esperados: ["Reconheceu sinais de IC", "Solicitou ecocardiograma", "Referiu para especialista"],
      erros_comuns: ["Não auscultar bem", "Pensar em pneumonia primeiro", "Não solicitar eco"],
      orientacoes_pedagogicas: ["Fadiga alimentar em lactente pode ser IC", "Hepatomegalia é congestão", "Ecocardiograma é padrão ouro"],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecimento de IC e solicitação apropriada de exames",
      comunicacao: ["foi empático com a mãe"],
      anamnese: ["investigou sintomas cardiovasculares"],
      exame_fisico: ["ausculta completa", "palpação hepática"],
      exames_complementares: ["ecocardiograma solicitado"],
      raciocinio: ["formulou hipótese apropriada"],
      conduta: ["referiu apropriadamente"],
    },

    temaOSCE: "Pediatria - Cardiopatia",
    subtopicosOSCE: ["IC", "Cardiopatia congênita", "Fadiga alimentar"],
    diagnosticoCorreto: "Insuficiência cardíaca por cardiopatia congênita",
    ativo: true,
  },

  // ====== CASO PED-06: MAUS-TRATOS NA INFÂNCIA ======
  {
    id: "ped-06",
    titulo: "Suspeita de Maus-Tratos - Menina de 6 Anos",
    sistema: "Geral/Proteção",
    tema: "Proteção da Criança",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 15,
    objetivo_pedagogico: "Reconhecer sinais de abuso infantil, registrar adequadamente, notificação compulsória, acionamento da rede de proteção",
    tipoPaciente: "pediatrico",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Luísa",
      idade: 6,
      sexo: "Feminino",
      queixa_principal: "Dor no braço",
      historia_breve: "Responsável refere queda de bicicleta",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Suspeita de abuso físico",
      diagnosticos_diferenciais: ["Fratura por trauma acidental"],
      sindromes_associadas: ["Síndrome do abuso infantil"],
    },

    descricaoBreve: "Criança de 6 anos com achados sugestivos de abuso físico",
    categoria: "Proteção",
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
          parentesco: "responsável",
        },
        peso: "20 kg",
        aberturaResponsavel: "A Luísa caiu da bicicleta alguns dias atrás. Ela doeu no braço.",
      },
    },

    respostas_do_paciente: {
      inicial: "Padrasto: Ela caiu de bicicleta.",
      como_caiu: "Padrasto: Perdeu o equilíbrio e caiu.",
    },
    respostaPaciente: {
      inicial: "Padrasto: Ela caiu de bicicleta.",
      como_caiu: "Padrasto: Perdeu o equilíbrio e caiu.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "não aferida",
        frequenciaCardiaca: 92,
        frequenciaRespiratoria: 20,
        temperatura: 36.8,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "não aferida",
      frequenciaCardiaca: 92,
      frequenciaRespiratoria: 20,
      temperatura: 36.8,
      saturacaoOxigenio: 98,
    },

    exame_fisico: {
      correto: {
        inspecao: "Equimoses em diferentes estágios no braço e antebraço, petéquias em pescoço, ausência de capacete ou proteções",
        palpacao: "Fratura de rádio e ulna, dor intensa, deformidade",
        ausculta: "Normal",
        percussao: "Normal",
        observacoes: "Achados sugestivos de abuso. Equimoses em diferentes estágios, lesões em múltiplas regiões, história incompatível",
        achados_positivos: ["Fratura", "Equimoses múltiplas", "Petéquias", "Comportamento retraído"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Equimoses múltiplas, em diferentes estágios, petéquias cervicais",
      palpacao: "Fratura de antebraço, dor",
      observacoes: "Achados sugestivos de trauma não acidental",
      percussao: "Normal",
      ausculta: "Normal",
    },

    exame_fisico_interativo: {},

    exames_complementares_disponiveis: [
      {
        nome: "Radiografia de antebraço",
        descricao: "RX do antebraço",
        resultado: "Fratura de rádio e ulna",
        valor_referencia: "Sem alterações",
        interpretacao: "Fratura presente",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Suspeita de abuso físico",
        probabilidade: 90,
        criterios_minimos: ["Equimoses em diferentes estágios", "Petéquias cervicais", "História incompatível", "Comportamento retraído"],
      },
    ],

    diagnosticos_diferenciais: [],
    examesIndicados: ["Radiografias", "TC se indicado", "Avaliação oftalmológica", "Avaliação odontológica"],

    conduta_esperada: {
      imediata: ["Registrar achados detalhadamente", "Fotografar lesões", "Investigar história com cuidado", "Avaliação multiprofissional"],
      curto_prazo: ["Notificação compulsória ao conselho tutelar", "Denúncia à polícia se indicado"],
      longo_prazo: ["Acompanhamento pela rede de proteção"],
      encaminhamentos: ["Conselho Tutelar", "CREAS", "Polícia"],
    },
    condutaCorreta: "Registrar achados, fotografar lesões, notificação compulsória, acionamento da rede de proteção, não confrontar responsável",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["Sinais de abuso físico", "Negligência"],
        descricao: "Criança em risco",
        recomendacao: "Notificação imediata e proteção",
      },
    ],

    erros_criticos: [
      {
        erro: "Não realizar notificação compulsória",
        descricao: "Obrigatoriedade legal",
        penalidade: 3,
        evitavel: false,
      },
      {
        erro: "Confrontar responsável durante consulta",
        descricao: "Pode colocar criança em risco",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou história cuidadosamente", realizado: false, critico: true },
      { item: "Inspecionou completamente a criança", realizado: false, critico: true },
      { item: "Documentou achados detalhadamente", realizado: false, critico: true },
      { item: "Realizou notificação compulsória", realizado: false, critico: true },
      { item: "Acionou rede de proteção", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento de sinais de abuso",
        peso: 35,
        descricao: "Identificação apropriada",
        pontuacao_maxima: 35,
      },
      {
        criterio: "Documentação",
        peso: 30,
        descricao: "Registro detalhado",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Conduta apropriada",
        peso: 35,
        descricao: "Notificação e proteção",
        pontuacao_maxima: 35,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: ["História do trauma", "Investigação cuidadosa"],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Exame físico completo", "Documentação de lesões"],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Suspeita de abuso"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Notificação compulsória", "Acionamento de rede"],
      },
    },

    feedback_modelo: {
      acertos_esperados: ["Reconhecimento de abuso", "Notificação realizada", "Proteção da criança"],
      erros_comuns: ["Não investigar história", "Não notificar", "Confrontar responsável"],
      orientacoes_pedagogicas: ["Abuso é problema médico e legal", "Notificação é obrigatória", "Proteção é prioridade"],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecimento de abuso e ação apropriada",
      comunicacao: ["foi cuidadoso com criança"],
      exame_fisico: ["exame completo"],
      raciocinio: ["formulou suspeita apropriada"],
      conduta: ["notificou corretamente"],
    },

    temaOSCE: "Pediatria - Proteção",
    subtopicosOSCE: ["Abuso infantil", "Notificação", "Proteção"],
    diagnosticoCorreto: "Suspeita de abuso físico",
    ativo: true,
  },

  // ====== CASO PED-07: CARDIOPATIA CONGÊNITA ACIANÓTICA ======
  {
    id: "ped-07",
    titulo: "Cardiopatia Congênita Acianótica - Lactente de 3 Meses",
    sistema: "Cardiovascular",
    tema: "Cardiopatia Congênita",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 15,
    objetivo_pedagogico: "Reconhecer sopro, investigar cardiopatia congênita acianótica, solicitar exames complementares",
    tipoPaciente: "pediatrico",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Felipe",
      idade: 0.25,
      sexo: "Masculino",
      queixa_principal: "Cansaço às mamadas e baixo ganho ponderal",
      historia_breve: "Lactente com piora após primeiras semanas de vida",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Cardiopatia congênita acianótica com repercussão hemodinâmica (CIV ou PCA)",
      diagnosticos_diferenciais: ["Pneumonia", "Infecção"],
      sindromes_associadas: ["Insuficiência cardíaca"],
    },

    descricaoBreve: "Lactente de 3 meses com sintomas de cardiopatia congênita acianótica",
    categoria: "Cardiovascular",
    paciente: {
      id: "pac-ped-07",
      nome: "Felipe",
      idade: 0.25,
      sexo: "M",
      tipoPaciente: "pediatrico",
      queixaPrincipal: "Cansaço às mamadas",
      historicoDoenca: "Começou após primeiras semanas com fadiga progressiva",
      antecedentes: ["Parto a termo"],
      alergias: [],
      medicamentos_em_uso: [],
      dadosPediatricos: {
        idadeMeses: 3,
        faixaEtaria: "lactente",
        responsavel: {
          nome: "Cintia",
          parentesco: "mãe",
        },
        peso: "4.2 kg",
        aberturaResponsavel: "Doutora, o Felipe cansa muito ao mamar. Ele não consegue terminar de mamar sem desistir.",
      },
    },

    respostas_do_paciente: {
      inicial: "Mãe: Ele começa a mamar mas não aguenta terminar.",
      peso: "Mãe: Ganhou pouco peso. Nasceu com 3kg e agora tem 4,2kg com 3 meses.",
      respiracao: "Mãe: Respira rápido, principalmente quando tenta mamar.",
    },
    respostaPaciente: {
      inicial: "Mãe: Ele começa a mamar mas não aguenta terminar.",
      peso: "Mãe: Ganhou pouco peso. Nasceu com 3kg e agora tem 4,2kg com 3 meses.",
      respiracao: "Mãe: Respira rápido, principalmente quando tenta mamar.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "não aferida",
        frequenciaCardiaca: 156,
        frequenciaRespiratoria: 54,
        temperatura: 36.8,
        saturacaoOxigenio: 96,
        peso: 4.2,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "não aferida",
      frequenciaCardiaca: 156,
      frequenciaRespiratoria: 54,
      temperatura: 36.8,
      saturacaoOxigenio: 96,
      peso: 4.2,
    },

    exame_fisico: {
      correto: {
        inspecao: "Lactente taquicárdico, taquipneico, ganho ponderal inadequado",
        palpacao: "Fígado palpável a 3 cm, pulsos amplos, pulso ampl",
        ausculta: "Sopro sistólico ou contínuo (PCA) ou holosistólico (CIV), hiperfonese de P2, crepitações finas em bases",
        percussao: "Normal",
        observacoes: "Sinais de cardiopatia com repercussão",
        achados_positivos: ["Taquicardia", "Taquipneia", "Sopro", "Hepatomegalia", "Crepitações"],
        achados_negativos: ["Cianose"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Taquicárdico, taquipneico",
      palpacao: "Fígado aumentado, pulsos amplos",
      ausculta: "Sopro sistólico/contínuo, crepitações",
      observacoes: "Cardiopatia acianótica com congestão",
      percussao: "Normal",
    },

    exame_fisico_interativo: {},

    exames_complementares_disponiveis: [
      {
        nome: "Ecocardiograma",
        descricao: "Ultrassom cardíaco",
        resultado: "CIV (Comunicação Interventricular) de 6mm com shunt esquerda-direita significativo",
        valor_referencia: "Sem alterações",
        interpretacao: "Cardiopatia congênita acianótica",
      },
      {
        nome: "RX Tórax",
        descricao: "Radiografia torácica",
        resultado: "Cardiomegalia moderada, congestão pulmonar",
        valor_referencia: "Normal",
        interpretacao: "Congestão por IC",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Cardiopatia congênita acianótica com IC",
        probabilidade: 85,
        criterios_minimos: ["Fadiga alimentar", "Ganho ponderal inadequado", "Sopro", "Hepatomegalia", "Taquipneia"],
      },
    ],

    diagnosticos_diferenciais: [],
    examesIndicados: ["Ecocardiograma", "RX tórax", "ECG"],

    conduta_esperada: {
      imediata: ["Avaliar gravidade", "Referência cardiologia pediátrica"],
      curto_prazo: ["Possível diurético se congestão importante"],
      longo_prazo: ["Acompanhamento cardiológico", "Consideração para cirurgia"],
      encaminhamentos: ["Cardiologia pediátrica"],
    },
    condutaCorreta: "Reconhecer sopro, solicitar ecocardiograma, referir para cardiologia pediátrica",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["Sintomas de IC"],
        descricao: "Necessário acompanhamento especializado",
        recomendacao: "Referência urgente a cardiologia",
      },
    ],

    erros_criticos: [
      {
        erro: "Não reconhecer o sopro",
        descricao: "Sinal crucial para diagnóstico",
        penalidade: 2.5,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Ausculta cardíaca completa", realizado: false, critico: true },
      { item: "Identificou sopro", realizado: false, critico: true },
      { item: "Solicitou ecocardiograma", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Ausculta",
        peso: 35,
        descricao: "Identificação do sopro",
        pontuacao_maxima: 35,
      },
      {
        criterio: "Investigação",
        peso: 40,
        descricao: "Ecocardiograma",
        pontuacao_maxima: 40,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: ["Fadiga alimentar", "Ganho ponderal inadequado"],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Ausculta cardíaca", "Ecocardiograma"],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Cardiopatia congênita acianótica"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Cardiologia pediátrica"],
      },
    },

    feedback_modelo: {
      acertos_esperados: ["Ausculta adequada", "Ecocardiograma solicitado", "Referência apropriada"],
      erros_comuns: ["Não ouvir sopro", "Não solicitar eco"],
      orientacoes_pedagogicas: ["Sopro deve ser investigado", "Ecocardiograma é essencial"],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecimento de cardiopatia",
      exame_fisico: ["ausculta completa"],
      exames_complementares: ["ecocardiograma solicitado"],
    },

    temaOSCE: "Pediatria - Cardiopatia",
    subtopicosOSCE: ["Cardiopatia acianótica", "Sopro", "IC"],
    diagnosticoCorreto: "Cardiopatia congênita acianótica",
    ativo: true,
  },

  // ====== CASO PED-08: CARDIOPATIA CIANÓTICA ======
  {
    id: "ped-08",
    titulo: "Cardiopatia Congênita Cianótica - Lactente de 6 Meses",
    sistema: "Cardiovascular",
    tema: "Cardiopatia Congênita",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 15,
    objetivo_pedagogico: "Reconhecer cianose central, cardiopatia cianótica, investigação urgente",
    tipoPaciente: "pediatrico",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Artur",
      idade: 0.5,
      sexo: "Masculino",
      queixa_principal: "Fica roxo ao chorar e mamar",
      historia_breve: "Lactente com episódios de cianose desde primeiras semanas",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Cardiopatia congênita cianótica (possivelmente Tetralogia de Fallot ou TGA)",
      diagnosticos_diferenciais: ["Doença pulmonar", "Sepse"],
      sindromes_associadas: ["Cianose central"],
    },

    descricaoBreve: "Lactente de 6 meses com cianose central e cardiopatia cianótica",
    categoria: "Cardiovascular",
    paciente: {
      id: "pac-ped-08",
      nome: "Artur",
      idade: 0.5,
      sexo: "M",
      tipoPaciente: "pediatrico",
      queixaPrincipal: "Cianose durante choro e esforço",
      historicoDoenca: "Cianose presente desde primeiras semanas, piora com atividade",
      antecedentes: ["Parto a termo"],
      alergias: [],
      medicamentos_em_uso: [],
      dadosPediatricos: {
        idadeMeses: 6,
        faixaEtaria: "lactente",
        responsavel: {
          nome: "Daniela",
          parentesco: "mãe",
        },
        peso: "5.8 kg",
        aberturaResponsavel: "Doutora, meu filho fica roxo quando chora ou tenta mamar. Estou muito preocupada.",
      },
    },

    respostas_do_paciente: {
      inicial: "Mãe: Ele fica roxo, principalmente quando chora ou se exercita.",
      quando: "Mãe: Desde os primeiros meses da vida. Piora quando ele fica agitado.",
      cansaco: "Mãe: Fica cansado facilmente, não consegue brincar por muito tempo.",
    },
    respostaPaciente: {
      inicial: "Mãe: Ele fica roxo, principalmente quando chora ou se exercita.",
      quando: "Mãe: Desde os primeiros meses da vida. Piora quando ele fica agitado.",
      cansaco: "Mãe: Fica cansado facilmente, não consegue brincar por muito tempo.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "não aferida",
        frequenciaCardiaca: 134,
        frequenciaRespiratoria: 36,
        temperatura: 36.8,
        saturacaoOxigenio: 82,
        peso: 5.8,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "não aferida",
      frequenciaCardiaca: 134,
      frequenciaRespiratoria: 36,
      temperatura: 36.8,
      saturacaoOxigenio: 82,
      peso: 5.8,
    },

    exame_fisico: {
      correto: {
        inspecao: "Lactente com cianose central evidente em lábios e língua, baqueteamento digital, ganho ponderal inadequado",
        palpacao: "Sopro sistólico, pulsos normais ou assimétricos",
        ausculta: "Sopro sistólico ejeção, P2 diminuído",
        percussao: "Normal",
        observacoes: "Sinais claros de cardiopatia cianótica",
        achados_positivos: ["Cianose central", "Baqueteamento", "Sopro", "Saturação baixa"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Cianose central em lábios e língua, baqueteamento",
      ausculta: "Sopro sistólico",
      observacoes: "Cardiopatia cianótica evidente",
      palpacao: "Normal",
      percussao: "Normal",
    },

    exame_fisico_interativo: {
      geral: {
        coloracao: "Cianose central em lábios e língua",
      },
    },

    exames_complementares_disponiveis: [
      {
        nome: "Ecocardiograma",
        descricao: "Ultrassom cardíaco",
        resultado: "Tetralogia de Fallot com comunicação interventricular e obstrução de via de saída RV",
        valor_referencia: "Sem alterações",
        interpretacao: "Cardiopatia cianótica com anatomia de TOF",
      },
      {
        nome: "RX Tórax",
        descricao: "Radiografia torácica",
        resultado: "Coração em bota, redução de vascularização pulmonar",
        valor_referencia: "Normal",
        interpretacao: "Padrão radiológico compatível com TOF",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Cardiopatia congênita cianótica",
        probabilidade: 95,
        criterios_minimos: ["Cianose central", "Baqueteamento", "Saturação reduzida", "Sopro"],
      },
    ],

    diagnosticos_diferenciais: [],
    examesIndicados: ["Ecocardiograma urgente", "RX tórax", "ECG", "Oximetria contínua"],

    conduta_esperada: {
      imediata: ["Reconhecer urgência", "Oxigenio se necessário", "Referência cardiologia pediátrica imediata"],
      curto_prazo: ["Avaliação para cirurgia"],
      longo_prazo: ["Acompanhamento cardiológico regular", "Cirurgia reparadora"],
      encaminhamentos: ["Cardiologia pediátrica urgente", "Possível cirurgia"],
    },
    condutaCorreta: "Reconhecer cianose, solicitar ecocardiograma urgentemente, referir para cardiologia pediátrica e cirurgia",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["Cianose central", "Saturação < 85%"],
        descricao: "Cardiopatia cianótica complexa",
        recomendacao: "Encaminhamento urgente a centro de cirurgia cardíaca pediátrica",
      },
    ],

    erros_criticos: [
      {
        erro: "Não reconhecer cianose como sinal de cardiopatia",
        descricao: "Cianose central exige investigação urgente",
        penalidade: 3,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Reconheceu cianose central", realizado: false, critico: true },
      { item: "Solicitou ecocardiograma urgente", realizado: false, critico: true },
      { item: "Referiu para cardiologia pediátrica", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Reconhecimento",
        peso: 40,
        descricao: "Identificação de cianose",
        pontuacao_maxima: 40,
      },
      {
        criterio: "Urgência",
        peso: 60,
        descricao: "Referência apropriada",
        pontuacao_maxima: 60,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: ["Cianose desde nascimento", "Piora com esforço"],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Cianose central", "Saturação reduzida", "Ecocardiograma"],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Cardiopatia congênita cianótica"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Referência cardiologia urgente", "Cirurgia"],
      },
    },

    feedback_modelo: {
      acertos_esperados: ["Reconhecimento imediato", "Ecocardiograma urgente", "Referência apropriada"],
      erros_comuns: ["Atraso no diagnóstico", "Não reconhecer urgência"],
      orientacoes_pedagogicas: ["Cianose central é urgência", "Ecocardiograma é diagnóstico", "Cirurgia é salvadora"],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecimento rápido e ação urgente",
      exame_fisico: ["reconheceu cianose"],
      raciocinio: ["formulou diagnóstico correto"],
      conduta: ["referiu adequadamente"],
    },

    temaOSCE: "Pediatria - Cardiopatia Cianótica",
    subtopicosOSCE: ["Cianose", "Cardiopatia", "Urgência"],
    diagnosticoCorreto: "Cardiopatia congênita cianótica",
    ativo: true,
  },

  // ====== CASO PED-09: PERICARDITE PEDIÁTRICA ======
  {
    id: "ped-09",
    titulo: "Pericardite Aguda - Menino de 12 Anos",
    sistema: "Cardiovascular",
    tema: "Pericardite",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Reconhecer dor pericárdica, atrito pericárdico, solicitar ecocardiograma, investigar etiologia",
    tipoPaciente: "pediatrico",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Mateus",
      idade: 12,
      sexo: "Masculino",
      queixa_principal: "Dor no peito há 2 dias",
      historia_breve: "Criança com história de infecção viral recente",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Pericardite aguda idiopática/pós-viral",
      diagnosticos_diferenciais: ["Dor musculoesquelética", "Infarto miocárdico", "Embolia pulmonar"],
      sindromes_associadas: ["Pericardite"],
    },

    descricaoBreve: "Menino de 12 anos com pericardite aguda",
    categoria: "Cardiovascular",
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
          parentesco: "mãe",
        },
        peso: "45 kg",
        aberturaResponsavel: "Doutor, meu filho está com dor no peito há 2 dias. Tive medo que fosse algo grave no coração.",
      },
    },

    respostas_do_paciente: {
      inicial: "Mãe: Ele acordou com dor no peito.",
      dor: "Criança: Dói quando respiro fundo. Também dói quando deito.",
      intensidade: "Criança: É dor forte, de 7 a 8.",
      inicio: "Mãe: Começou de repente há 2 dias, depois que tinha tido gripe.",
      posicao: "Criança: Melhora um pouco quando sento inclinado para frente.",
    },
    respostaPaciente: {
      inicial: "Mãe: Ele acordou com dor no peito.",
      dor: "Criança: Dói quando respiro fundo. Também dói quando deito.",
      intensidade: "Criança: É dor forte, de 7 a 8.",
      inicio: "Mãe: Começou de repente há 2 dias, depois que tinha tido gripe.",
      posicao: "Criança: Melhora um pouco quando sento inclinado para frente.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "108/68 mmHg",
        frequenciaCardiaca: 102,
        frequenciaRespiratoria: 22,
        temperatura: 37.2,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "108/68 mmHg",
      frequenciaCardiaca: 102,
      frequenciaRespiratoria: 22,
      temperatura: 37.2,
      saturacaoOxigenio: 98,
    },

    exame_fisico: {
      correto: {
        inspecao: "Criança alert, sem desconforto em repouso",
        palpacao: "Dor à palpação do precórdio",
        ausculta: "Atrito pericárdico audível (som de couro atritado) de duas ou três componentes",
        percussao: "Normal",
        observacoes: "Atrito pericárdico é patognomônico de pericardite",
        achados_positivos: ["Atrito pericárdico"],
        achados_negativos: ["Sopros", "Arritmias"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Sem desconforto em repouso",
      ausculta: "Atrito pericárdico presente",
      observacoes: "Pericardite aguda confirmada ao exame",
      palpacao: "Normal",
      percussao: "Normal",
    },

    exame_fisico_interativo: {},

    exames_complementares_disponiveis: [
      {
        nome: "ECG",
        descricao: "Eletrocardiograma",
        resultado: "Elevação difusa do segmento ST com depressão de PR",
        valor_referencia: "Normal",
        interpretacao: "Padrão típico de pericardite",
      },
      {
        nome: "Ecocardiograma",
        descricao: "Ultrassom cardíaco",
        resultado: "Pequeno derrame pericárdico",
        valor_referencia: "Sem derrame",
        interpretacao: "Confirmação de pericardite",
      },
      {
        nome: "PCR",
        descricao: "Proteína C Reativa",
        resultado: "18 mg/L (elevada)",
        valor_referencia: "<3 mg/L",
        interpretacao: "Inflamação ativa",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Pericardite aguda",
        probabilidade: 90,
        criterios_minimos: ["Dor tipo pontada", "Piora ao respirar", "Melhora inclinado", "Atrito pericárdico", "ECG com elevação ST"],
      },
    ],

    diagnosticos_diferenciais: [],
    examesIndicados: ["ECG", "Ecocardiograma", "PCR/VHS", "Troponina"],

    conduta_esperada: {
      imediata: ["Repouso relativo", "AINE (ibuprofeno) se sem contraindicações"],
      curto_prazo: ["Investigar etiologia", "Monitoramento de complicações"],
      longo_prazo: ["Seguimento clínico", "Investigar recorrência"],
      encaminhamentos: ["Cardiologia se derrame significativo"],
    },
    condutaCorreta: "Reconhecer pericardite, solicitar ECG e ecocardiograma, prescrever AINE, monitorar complicações",

    criterios_de_gravidade: [
      {
        severidade: "leve",
        sinais: ["Derrame pequeno"],
        descricao: "Tratamento clínico",
        recomendacao: "AINE e repouso",
      },
    ],

    erros_criticos: [
      {
        erro: "Não reconhecer atrito pericárdico",
        descricao: "Sinal patognomônico de pericardite",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou história de infecção recente", realizado: false, critico: true },
      { item: "Caracterizou a dor (posição, respiração)", realizado: false, critico: true },
      { item: "Ausculta cardíaca procurando atrito", realizado: false, critico: true },
      { item: "Solicitou ECG", realizado: false, critico: true },
      { item: "Solicitou ecocardiograma", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Anamnese",
        peso: 25,
        descricao: "Caracterização da dor",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Exame físico",
        peso: 30,
        descricao: "Reconhecimento de atrito",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Investigação",
        peso: 45,
        descricao: "Exames apropriados",
        pontuacao_maxima: 45,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: ["Dor tipo pontada", "Piora ao respirar", "História viral"],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Atrito pericárdico", "ECG", "Ecocardiograma"],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Pericardite aguda"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: ["AINE", "Repouso", "Seguimento"],
      },
    },

    feedback_modelo: {
      acertos_esperados: ["Reconhecimento de atrito", "ECG e eco solicitados", "Diagnóstico correto"],
      erros_comuns: ["Pensar em IAM", "Não ouvir atrito", "Não solicitar exames"],
      orientacoes_pedagogicas: ["Atrito é patognomônico", "Dor que melhora inclinado é típica", "ECG mostra padrão característico"],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecimento de pericardite",
      anamnese: ["caracterizou dor adequadamente"],
      exame_fisico: ["ouviu atrito"],
      exames_complementares: ["ECG e eco solicitados"],
    },

    temaOSCE: "Pediatria - Pericardite",
    subtopicosOSCE: ["Pericardite", "Atrito", "Dor pericárdica"],
    diagnosticoCorreto: "Pericardite aguda",
    ativo: true,
  },

  // ====== CASO PED-10: TUBERCULOSE PULMONAR ======
  {
    id: "ped-10",
    titulo: "Tuberculose Pulmonar - Criança de 7 Anos",
    sistema: "Respiratório/Infectologia",
    tema: "Tuberculose",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 15,
    objetivo_pedagogico: "Reconhecer TB em criança, investigar contato, solicitar exames, realizar notificação compulsória",
    tipoPaciente: "pediatrico",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Clara",
      idade: 7,
      sexo: "Feminino",
      queixa_principal: "Tosse há 6 semanas",
      historia_breve: "Criança com tosse persistente e perda de peso",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Tuberculose pulmonar ativa",
      diagnosticos_diferenciais: ["Pneumonia", "Asma", "Corpo estranho"],
      sindromes_associadas: ["TB pulmonar"],
    },

    descricaoBreve: "Criança de 7 anos com tuberculose pulmonar",
    categoria: "Infectologia",
    paciente: {
      id: "pac-ped-10",
      nome: "Clara",
      idade: 7,
      sexo: "F",
      tipoPaciente: "pediatrico",
      queixaPrincipal: "Tosse há 6 semanas",
      historicoDoenca: "Tosse persistente, febre vespertina, perda de apetite, perda de peso",
      antecedentes: ["Avó tem TB"],
      alergias: [],
      medicamentos_em_uso: [],
      dadosPediatricos: {
        idadeAnos: 7,
        faixaEtaria: "escolar",
        responsavel: {
          nome: "Eliana",
          parentesco: "mãe",
        },
        peso: "18 kg (abaixo do esperado)",
        estadoVacinal: "BCG recebida",
        aberturaResponsavel: "Doutora, minha filha tem tosse há bastante tempo e emagreceu. Minha sogra tem tuberculose e ela morava conosco.",
      },
    },

    respostas_do_paciente: {
      inicial: "Mãe: Ela está com tosse há 6 semanas pelo menos.",
      tosse: "Mãe: Tosse principalmente à noite, piora quando está deitada.",
      febre: "Mãe: Tem febre à noite, depois que o sol se põe.",
      peso: "Mãe: Emagreceu, ela não quer comer quase nada.",
      contato: "Mãe: Minha sogra tem tuberculose e ficou um tempo conosco.",
    },
    respostaPaciente: {
      inicial: "Mãe: Ela está com tosse há 6 semanas pelo menos.",
      tosse: "Mãe: Tosse principalmente à noite, piora quando está deitada.",
      febre: "Mãe: Tem febre à noite, depois que o sol se põe.",
      peso: "Mãe: Emagreceu, ela não quer comer quase nada.",
      contato: "Mãe: Minha sogra tem tuberculose e ficou um tempo conosco.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "98/62 mmHg",
        frequenciaCardiaca: 102,
        frequenciaRespiratoria: 26,
        temperatura: 37.6,
        saturacaoOxigenio: 96,
        peso: 18,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "não aferida",
      frequenciaCardiaca: 102,
      frequenciaRespiratoria: 26,
      temperatura: 37.6,
      saturacaoOxigenio: 96,
      peso: 18,
    },

    exame_fisico: {
      correto: {
        inspecao: "Criança magra, emagrecida, palidez",
        palpacao: "Linfonodos cervicais palpáveis, pequenos, móveis",
        ausculta: "MV reduzido em ápice direito posterior, crepitações finas apicais",
        percussao: "Submacicez em ápice direito",
        observacoes: "Sinais sugestivos de TB pulmonar apical",
        achados_positivos: ["MV reduzido apical", "Crepitações apicais", "Submacicez"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Criança emagrecida",
      palpacao: "Linfonodos cervicais",
      ausculta: "MV reduzido em ápice direito, crepitações apicais",
      percussao: "Submacicez apical direita",
      observacoes: "TB pulmonar apical sugestivo",
    },

    exame_fisico_interativo: {},

    exames_complementares_disponiveis: [
      {
        nome: "RX Tórax",
        descricao: "Radiografia do tórax",
        resultado: "Infiltrado apical direito com caverna",
        valor_referencia: "Normal",
        interpretacao: "TB pulmonar ativa",
      },
      {
        nome: "PPD (Teste da Tuberculina)",
        descricao: "Teste intradérmico",
        resultado: "Enduração 22mm (positivo)",
        valor_referencia: "<5mm",
        interpretacao: "Tuberculina positiva, infecção TB confirmada",
      },
      {
        nome: "GeneXpert MTB/RIF",
        descricao: "PCR rápido",
        resultado: "Positivo para MTB, rifampicina sensível",
        valor_referencia: "Negativo",
        interpretacao: "TB ativa confirmada",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Tuberculose pulmonar ativa",
        probabilidade: 90,
        criterios_minimos: ["Tosse > 4 semanas", "Febre vespertina", "Perda de peso", "Contato", "Achados apicais", "RX com infiltrado"],
      },
    ],

    diagnosticos_diferenciais: [],
    examesIndicados: ["RX tórax", "PPD", "GeneXpert MTB/RIF ou baciloscopia", "Hemograma"],

    conduta_esperada: {
      imediata: ["Isolamento respiratório", "Notificação compulsória", "Solicitar exames"],
      curto_prazo: ["Iniciar terapia antiTB conforme protocolo", "Investigação de contatos"],
      longo_prazo: ["Terapia por 6 meses", "Seguimento para cura"],
      encaminhamentos: ["Pneumologia pediátrica ou infectologia", "Vigilância sanitária"],
    },
    condutaCorreta: "Reconhecer TB, solicitar RX e GeneXpert, realizar notificação compulsória, investigar contatos, iniciar tratamento",

    criterios_de_gravidade: [
      {
        severidade: "grave",
        sinais: ["Caverna", "Contato domiciliar"],
        descricao: "TB ativa com transmissão",
        recomendacao: "Tratamento urgente e investigação de contatos",
      },
    ],

    erros_criticos: [
      {
        erro: "Não realizar notificação compulsória",
        descricao: "Obrigatoriedade legal",
        penalidade: 3,
        evitavel: false,
      },
      {
        erro: "Não investigar contatos domiciliares",
        descricao: "Essencial para controle de TB",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou tosse > 4 semanas", realizado: false, critico: true },
      { item: "Investigou febre vespertina", realizado: false, critico: true },
      { item: "Investigou contato com TB", realizado: false, critico: true },
      { item: "Solicitou RX tórax", realizado: false, critico: true },
      { item: "Solicitou GeneXpert/baciloscopia", realizado: false, critico: true },
      { item: "Realizou notificação compulsória", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Anamnese",
        peso: 25,
        descricao: "Investigação de TB",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Exame físico",
        peso: 20,
        descricao: "Sinais apicais",
        pontuacao_maxima: 20,
      },
      {
        criterio: "Investigação",
        peso: 30,
        descricao: "Exames apropriados",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Conduta",
        peso: 25,
        descricao: "Notificação e tratamento",
        pontuacao_maxima: 25,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: ["Tosse > 4 semanas", "Febre vespertina", "Perda de peso", "Contato com TB"],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Ausculta apical", "RX tórax", "GeneXpert"],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Tuberculose pulmonar ativa"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Notificação", "Tratamento", "Investigação de contatos"],
      },
    },

    feedback_modelo: {
      acertos_esperados: ["Reconhecimento de TB", "Exames apropriados", "Notificação realizada", "Investigação de contatos"],
      erros_comuns: ["Pensar em pneumonia", "Esquecer notificação", "Não investigar contatos"],
      orientacoes_pedagogicas: ["Tosse > 4 semanas sugere TB", "Notificação é obrigatória", "Contatos devem ser investigados"],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecimento de TB e ação apropriada",
      anamnese: ["investigou TB adequadamente"],
      exame_fisico: ["ausculta apical"],
      exames_complementares: ["RX e GeneXpert solicitados"],
      conduta: ["notificou corretamente", "investigou contatos"],
    },

    temaOSCE: "Pediatria - TB",
    subtopicosOSCE: ["Tuberculose", "Tosse crônica", "Notificação"],
    diagnosticoCorreto: "Tuberculose pulmonar",
    ativo: true,
  },

  // ====== CASO PED-11: ASMA NA INFÂNCIA ======
  {
    id: "ped-11",
    titulo: "Asma na Infância - Criança de 7 Anos",
    sistema: "Respiratório",
    tema: "Asma",
    nivel: "iniciante",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Reconhecer asma em criança, identificar fatores desencadeantes, prescrever tratamento adequado",
    tipoPaciente: "pediatrico",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Pedro",
      idade: 7,
      sexo: "Masculino",
      queixa_principal: "Tosse seca à noite e chiado",
      historia_breve: "Criança com sintomas após correr ou durante infecções respiratórias",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Asma intermitente",
      diagnosticos_diferenciais: ["Bronquiolite", "Corpo estranho", "Refluxo gastroesofágico"],
      sindromes_associadas: ["Asma"],
    },

    descricaoBreve: "Criança de 7 anos com asma intermitente",
    categoria: "Respiratório",
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
          parentesco: "mãe",
        },
        peso: "24 kg",
        aberturaResponsavel: "Doutor, meu filho tosse à noite e fica com chiado quando corre. Meu marido também tem asma.",
      },
    },

    respostas_do_paciente: {
      inicial: "Mãe: Ele tosse bastante à noite.",
      chiado: "Mãe: Fica com chiado quando brinca muito ou corre.",
      respiracao: "Mãe: Às vezes sente falta de ar.",
      desencadeantes: "Mãe: Piora quando fica gripado, quando tem poeira ou quando exposto à fumaça.",
      noite: "Mãe: Principalmente à noite, acordamos com ele tossindo.",
    },
    respostaPaciente: {
      inicial: "Mãe: Ele tosse bastante à noite.",
      chiado: "Mãe: Fica com chiado quando brinca muito ou corre.",
      respiracao: "Mãe: Às vezes sente falta de ar.",
      desencadeantes: "Mãe: Piora quando fica gripado, quando tem poeira ou quando exposto à fumaça.",
      noite: "Mãe: Principalmente à noite, acordamos com ele tossindo.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "102/64 mmHg",
        frequenciaCardiaca: 96,
        frequenciaRespiratoria: 24,
        temperatura: 36.8,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "não aferida",
      frequenciaCardiaca: 96,
      frequenciaRespiratoria: 24,
      temperatura: 36.8,
      saturacaoOxigenio: 98,
    },

    exame_fisico: {
      correto: {
        inspecao: "Criança bem, sem desconforto em repouso",
        palpacao: "Sem alterações",
        ausculta: "Murmúrio vesicular simétrico, sem sibilos no momento (criança em repouso)",
        percussao: "Normal",
        observacoes: "Exame normal em repouso, mas história é sugestiva de asma",
        achados_positivos: [],
        achados_negativos: ["Sibilos no repouso", "Tiragens"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Criança bem",
      ausculta: "Normal no repouso, história sugere asma",
      observacoes: "Asma intermitente, exame normal entre crises",
      palpacao: "Normal",
      percussao: "Normal",
    },

    exame_fisico_interativo: {},

    exames_complementares_disponiveis: [
      {
        nome: "Teste do broncodilatador",
        descricao: "Melhora de FEV1 > 12% após broncodilatador",
        resultado: "Positivo - melhora de 20% após salbutamol",
        valor_referencia: "Negativo",
        interpretacao: "Reversibilidade confirmada, asma provável",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Asma intermitente",
        probabilidade: 85,
        criterios_minimos: ["Tosse noturna", "Chiado com exercício", "História familiar", "Dessensibilizadores"],
      },
    ],

    diagnosticos_diferenciais: [],
    examesIndicados: ["Espirometria com teste de broncodilatador se possível"],

    conduta_esperada: {
      imediata: ["Prescr salbutamol para crises", "Ensino do uso de inalador"],
      curto_prazo: ["Controle ambiental", "Orientação sobre desencadeantes"],
      longo_prazo: ["Considerar corticoide inalado se frequente", "Acompanhamento regular"],
      encaminhamentos: ["Pneumologia pediátrica se necessário"],
    },
    condutaCorreta: "Reconhecer asma, prescrever salbutamol, orientar controle ambiental, considerar profilaxia",

    criterios_de_gravidade: [
      {
        severidade: "leve",
        sinais: ["Sintomas intermitentes"],
        descricao: "Asma intermitente",
        recomendacao: "Broncodilatador de resgate",
      },
    ],

    erros_criticos: [
      {
        erro: "Não reconhecer asma e prescrever antibiótico",
        descricao: "Asma é doença respiratória, não infecciosa",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou tosse notuma", realizado: false, critico: true },
      { item: "Investigou chiado com exercício", realizado: false, critico: true },
      { item: "Investigou desencadeantes", realizado: false, critico: true },
      { item: "Investigou história familiar", realizado: false, critico: true },
      { item: "Prescreveu broncodilatador", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Anamnese",
        peso: 30,
        descricao: "Investigação de asma",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Conduta",
        peso: 40,
        descricao: "Prescrição apropriada",
        pontuacao_maxima: 40,
      },
      {
        criterio: "Orientação",
        peso: 30,
        descricao: "Educação do paciente",
        pontuacao_maxima: 30,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: ["Tosse noturna", "Chiado", "Desencadeantes"],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Exame físico", "Teste de broncodilatador se possível"],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Asma intermitente"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Salbutamol", "Controle ambiental"],
      },
    },

    feedback_modelo: {
      acertos_esperados: ["Reconhecimento de asma", "Prescrição de broncodilatador", "Orientação ambiental"],
      erros_comuns: ["Pensar em infecção", "Esquecer broncodilatador", "Não investigar história familiar"],
      orientacoes_pedagogicas: ["Tosse notuma sugere asma", "Chiado com exercício é típico", "Controle ambiental é importante"],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecimento de asma",
      anamnese: ["investigou adequadamente"],
      raciocinio: ["formulou diagnóstico correto"],
      conduta: ["prescreveu broncodilatador"],
    },

    temaOSCE: "Pediatria - Asma",
    subtopicosOSCE: ["Asma", "Tosse notuma", "Desencadeantes"],
    diagnosticoCorreto: "Asma intermitente",
    ativo: true,
  },

  // ====== CASO PED-12: RINOSSINUSITE BACTERIANA ======
  {
    id: "ped-12",
    titulo: "Rinossinusite Bacteriana - Criança de 9 Anos",
    sistema: "ORL/Respiratório",
    tema: "Infecção de Vias Aéreas",
    nivel: "iniciante",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 10,
    objetivo_pedagogico: "Reconhecer rinossinusite bacteriana, critério de dupla piora, prescrever antibiótico quando indicado",
    tipoPaciente: "pediatrico",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Iago",
      idade: 9,
      sexo: "Masculino",
      queixa_principal: "Congestão nasal persistente",
      historia_breve: "Criança com sintomas de sinusite após gripe",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Rinossinusite bacteriana",
      diagnosticos_diferenciais: ["Rinite viral", "Rinite alérgica"],
      sindromes_associadas: ["Rinossinusite"],
    },

    descricaoBreve: "Criança de 9 anos com rinossinusite bacteriana",
    categoria: "ORL",
    paciente: {
      id: "pac-ped-12",
      nome: "Iago",
      idade: 9,
      sexo: "M",
      tipoPaciente: "pediatrico",
      queixaPrincipal: "Congestão nasal",
      historicoDoenca: "Gripe seguida de piora com secreção amarelada, tosse noturna",
      antecedentes: [],
      alergias: [],
      medicamentos_em_uso: [],
      dadosPediatricos: {
        idadeAnos: 9,
        faixaEtaria: "escolar",
        responsavel: {
          nome: "Isabela",
          parentesco: "mãe",
        },
        peso: "28 kg",
        aberturaResponsavel: "Doutor, meu filho teve gripe e agora tem a nariz entupido com secreção amarela. Está durando muito tempo.",
      },
    },

    respostas_do_paciente: {
      inicial: "Mãe: Ele está com congestão nasal há mais de 10 dias.",
      secrecao: "Mãe: Tem secreção amarelada saindo pelo nariz.",
      tosse: "Mãe: Tem tosse à noite, principalmente quando deita.",
      melhora_piora: "Mãe: Melhorou um pouco no meio da semana mas piorou de novo.",
    },
    respostaPaciente: {
      inicial: "Mãe: Ele está com congestão nasal há mais de 10 dias.",
      secrecao: "Mãe: Tem secreção amarelada saindo pelo nariz.",
      tosse: "Mãe: Tem tosse à noite, principalmente quando deita.",
      melhora_piora: "Mãe: Melhorou um pouco no meio da semana mas piorou de novo.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "não aferida",
        frequenciaCardiaca: 88,
        frequenciaRespiratoria: 20,
        temperatura: 36.8,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "não aferida",
      frequenciaCardiaca: 88,
      frequenciaRespiratoria: 20,
      temperatura: 36.8,
      saturacaoOxigenio: 98,
    },

    exame_fisico: {
      correto: {
        inspecao: "Congestão nasal, secreção nasal amarelada, ausência de febre",
        palpacao: "Sem dor à percussão de seios da face",
        ausculta: "Normal",
        percussao: "Normal",
        observacoes: "Sinais de rinossinusite bacteriana",
        achados_positivos: ["Congestão nasal", "Secreção amarelada"],
        achados_negativos: ["Febre"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Congestão e secreção amarelada",
      observacoes: "Rinossinusite sugestiva",
      palpacao: "Normal",
      percussao: "Normal",
      ausculta: "Normal",
    },

    exame_fisico_interativo: {},

    exames_complementares_disponiveis: [],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Rinossinusite bacteriana",
        probabilidade: 80,
        criterios_minimos: ["Sintomas > 10 dias", "Secreção amarelada", "Dupla piora"],
      },
    ],

    diagnosticos_diferenciais: [],
    examesIndicados: [],

    conduta_esperada: {
      imediata: ["Prescrever antibiótico (amoxicilina-clavulanato)"],
      curto_prazo: ["Orientar irrigação nasal", "Descongestionante nasal"],
      longo_prazo: ["Acompanhamento"],
      encaminhamentos: ["ORL se não responder"],
    },
    condutaCorreta: "Reconhecer rinossinusite, prescrever antibiótico, orientar irrigação nasal",

    criterios_de_gravidade: [
      {
        severidade: "leve",
        sinais: ["Sinusite não complicada"],
        descricao: "Tratamento ambulatorial",
        recomendacao: "Antibiótico oral",
      },
    ],

    erros_criticos: [],

    checklist_osce: [
      { item: "Investigou duração dos sintomas", realizado: false, critico: true },
      { item: "Investigou características da secreção", realizado: false, critico: true },
      { item: "Reconheceu dupla piora", realizado: false, critico: true },
      { item: "Prescreveu antibiótico", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Anamnese",
        peso: 30,
        descricao: "Investigação adequada",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Conduta",
        peso: 40,
        descricao: "Prescrição apropriada",
        pontuacao_maxima: 40,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: ["Congestão nasal > 10 dias", "Secreção amarelada"],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Exame nasal"],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Rinossinusite bacteriana"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Antibiótico", "Irrigação nasal"],
      },
    },

    feedback_modelo: {
      acertos_esperados: ["Reconhecimento de sinusite", "Prescrição de antibiótico"],
      erros_comuns: ["Pensar que é só viral", "Não prescrever antibiótico"],
      orientacoes_pedagogicas: ["Dupla piora sugere sinusite bacteriana", "Secreção amarelada indicador"],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecimento de sinusite",
      anamnese: ["investigou adequadamente"],
      conduta: ["prescreveu antibiótico"],
    },

    temaOSCE: "Pediatria - ORL",
    subtopicosOSCE: ["Rinossinusite", "Dupla piora", "Antibiótico"],
    diagnosticoCorreto: "Rinossinusite bacteriana",
    ativo: true,
  },

  // ====== CASO PED-13: PNEUMONIA INFANTIL ======
  {
    id: "ped-13",
    titulo: "Pneumonia Adquirida na Comunidade - Criança de 5 Anos",
    sistema: "Respiratório",
    tema: "Pneumonia",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 15,
    objetivo_pedagogico: "Reconhecer pneumonia, avaliar gravidade, solicitar RX e exames, prescrever antibiótico",
    tipoPaciente: "pediatrico",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Ricardo",
      idade: 5,
      sexo: "Masculino",
      queixa_principal: "Febre, tosse e dificuldade respiratória",
      historia_breve: "Criança com sintomas respiratórios há 4 dias",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Pneumonia adquirida na comunidade",
      diagnosticos_diferenciais: ["Bronquiolite", "Asma exacerbada"],
      sindromes_associadas: ["Pneumonia"],
    },

    descricaoBreve: "Criança de 5 anos com pneumonia adquirida na comunidade",
    categoria: "Respiratório",
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
          parentesco: "mãe",
        },
        peso: "18 kg",
        aberturaResponsavel: "Doutor, meu filho ficou com febre alta e agora está respirando rápido e tossindo bastante.",
      },
    },

    respostas_do_paciente: {
      inicial: "Mãe: Ele acordou com febre há 4 dias.",
      febre: "Mãe: Tem febre alta, chegou a 39,5 graus.",
      tosse: "Mãe: Tosse bastante, tem catarro que ele não consegue expelir direito.",
      respiracao: "Mãe: Está respirando rápido e com dificuldade.",
      apetite: "Mãe: Não quer comer quase nada.",
    },
    respostaPaciente: {
      inicial: "Mãe: Ele acordou com febre há 4 dias.",
      febre: "Mãe: Tem febre alta, chegou a 39,5 graus.",
      tosse: "Mãe: Tosse bastante, tem catarro que ele não consegue expelir direito.",
      respiracao: "Mãe: Está respirando rápido e com dificuldade.",
      apetite: "Mãe: Não quer comer quase nada.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "96/60 mmHg",
        frequenciaCardiaca: 124,
        frequenciaRespiratoria: 48,
        temperatura: 39.2,
        saturacaoOxigenio: 91,
        peso: 18,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "não aferida",
      frequenciaCardiaca: 124,
      frequenciaRespiratoria: 48,
      temperatura: 39.2,
      saturacaoOxigenio: 91,
      peso: 18,
    },

    exame_fisico: {
      correto: {
        inspecao: "Criança febril, com dificuldade respiratória moderada, tiragem subcostal",
        palpacao: "FTV aumentado em base direita",
        ausculta: "Crepitações em base direita, MV reduzido",
        percussao: "Submacicez em base direita",
        observacoes: "Sinais de consolidação pulmonar em base direita",
        achados_positivos: ["Febre", "Taquipneia", "Tiragem", "Crepitações", "Redução MV"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Criança febril, taquipneica, com tiragem",
      ausculta: "Crepitações em base direita, MV reduzido",
      percussao: "Submacicez base direita",
      observacoes: "Pneumonia de base direita confirmada",
      palpacao: "Normal",
    },

    exame_fisico_interativo: {},

    exames_complementares_disponiveis: [
      {
        nome: "RX Tórax",
        descricao: "Radiografia do tórax",
        resultado: "Infiltrado consolidativo em base direita",
        valor_referencia: "Normal",
        interpretacao: "Pneumonia confirmada",
      },
      {
        nome: "Hemograma",
        descricao: "Contagem de células",
        resultado: "Leucócitos 14.500/μL, predomínio de neutrófilos",
        valor_referencia: "5.000-15.000/μL",
        interpretacao: "Inflamação presente",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Pneumonia adquirida na comunidade",
        probabilidade: 90,
        criterios_minimos: ["Febre", "Tosse", "Taquipneia", "Crepitações", "Consolidação em RX"],
      },
    ],

    diagnosticos_diferenciais: [],
    examesIndicados: ["RX tórax", "Hemograma se grave"],

    conduta_esperada: {
      imediata: ["Prescrever antibiótico (amoxicilina ou ceftriaxona)"],
      curto_prazo: ["Monitorar resposta ao antibiótico", "Orientar sinais de alarme"],
      longo_prazo: ["Acompanhamento"],
      encaminhamentos: ["Hospitalização se grave"],
    },
    condutaCorreta: "Reconhecer pneumonia, solicitar RX, prescrever antibiótico apropriado, orientar sinais de alarme",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["Taquipneia importante", "SatO2 91%"],
        descricao: "Pneumonia moderada",
        recomendacao: "Antibiótico oral com acompanhamento",
      },
    ],

    erros_criticos: [
      {
        erro: "Não reconhecer pneumonia e prescrever antitérmico apenas",
        descricao: "Necessário antibiótico",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou febre, tosse e dificuldade respiratória", realizado: false, critico: true },
      { item: "Contou FR adequadamente", realizado: false, critico: true },
      { item: "Investigou tiragem", realizado: false, critico: true },
      { item: "Auscultou pulmões bilateralmente", realizado: false, critico: true },
      { item: "Solicitou RX tórax", realizado: false, critico: true },
      { item: "Prescreveu antibiótico", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Anamnese e Exame",
        peso: 30,
        descricao: "Reconhecimento de pneumonia",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Investigação",
        peso: 30,
        descricao: "RX apropriado",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Conduta",
        peso: 40,
        descricao: "Antibiótico apropriado",
        pontuacao_maxima: 40,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: ["Febre", "Tosse", "Dificuldade respiratória"],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["FR, taquipneia", "Ausculta com crepitações", "RX com consolidação"],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Pneumonia adquirida na comunidade"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Antibiótico", "Seguimento"],
      },
    },

    feedback_modelo: {
      acertos_esperados: ["Reconhecimento de pneumonia", "RX solicitado", "Antibiótico prescrito"],
      erros_comuns: ["Pensar em viral", "Não solicitar RX", "Não prescrever antibiótico"],
      orientacoes_pedagogicas: ["Taquipneia é sinal importante", "Crepitações indicam consolidação", "RX confirma diagnóstico"],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecimento de pneumonia",
      anamnese: ["investigou adequadamente"],
      exame_fisico: ["contou FR corretamente", "ausculta completa"],
      exames_complementares: ["RX solicitado"],
      conduta: ["antibiótico prescrito"],
    },

    temaOSCE: "Pediatria - Pneumonia",
    subtopicosOSCE: ["Pneumonia", "Taquipneia", "Crepitações"],
    diagnosticoCorreto: "Pneumonia adquirida na comunidade",
    ativo: true,
  },

  // ====== CASO PED-14: LINFONODOMEGALIA CERVICAL ======
  {
    id: "ped-14",
    titulo: "Linfonodomegalia Cervical - Criança de 7 Anos",
    sistema: "Hematológico",
    tema: "Linfonodos",
    nivel: "iniciante",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 10,
    objetivo_pedagogico: "Palpar linfonodos adequadamente, diferenciar reativo de patológico, solicitar exames se indicado",
    tipoPaciente: "pediatrico",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Stella",
      idade: 7,
      sexo: "Feminino",
      queixa_principal: "Ínguas no pescoço",
      historia_breve: "Criança com linfonodos cervicais palpáveis há 2 semanas",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Linfonodomegalia cervical reativa",
      diagnosticos_diferenciais: ["Linfoma", "Tuberculose"],
      sindromes_associadas: [],
    },

    descricaoBreve: "Criança de 7 anos com linfonodomegalia cervical",
    categoria: "Hematológico",
    paciente: {
      id: "pac-ped-14",
      nome: "Stella",
      idade: 7,
      sexo: "F",
      tipoPaciente: "pediatrico",
      queixaPrincipal: "Ínguas no pescoço",
      historicoDoenca: "Linfonodos cervicais aumentados há 2 semanas",
      antecedentes: [],
      alergias: [],
      medicamentos_em_uso: [],
      dadosPediatricos: {
        idadeAnos: 7,
        faixaEtaria: "escolar",
        responsavel: {
          nome: "Silvia",
          parentesco: "mãe",
        },
        peso: "22 kg",
        aberturaResponsavel: "Doutor, percebi que minha filha tem uns caroços no pescoço. Estou preocupada.",
      },
    },

    respostas_do_paciente: {
      inicial: "Mãe: Ela tem uns caroços aqui no pescoço.",
      crescimento: "Mãe: Não cresceu muito, está há 2 semanas assim.",
      dor: "Mãe: Não dói.",
      febre: "Mãe: Não tem febre.",
    },
    respostaPaciente: {
      inicial: "Mãe: Ela tem uns caroços aqui no pescoço.",
      crescimento: "Mãe: Não cresceu muito, está há 2 semanas assim.",
      dor: "Mãe: Não dói.",
      febre: "Mãe: Não tem febre.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "não aferida",
        frequenciaCardiaca: 88,
        frequenciaRespiratoria: 20,
        temperatura: 36.8,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "não aferida",
      frequenciaCardiaca: 88,
      frequenciaRespiratoria: 20,
      temperatura: 36.8,
      saturacaoOxigenio: 98,
    },

    exame_fisico: {
      correto: {
        inspecao: "Linfonodos cervicais bilaterais pequenos (< 1cm), móveis, sem aderência",
        palpacao: "Linfonodos palpáveis, tamanho pequeno a moderado, consistência mole, móveis, não aderentes, indolores",
        ausculta: "Normal",
        percussao: "Normal",
        observacoes: "Linfonodomegalia cervical reativa, sem sinais de malignidade",
        achados_positivos: ["Linfonodos palpáveis"],
        achados_negativos: ["Hepatomegalia", "Esplenomegalia", "Supraclaviculares"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Linfonodos cervicais bilaterais",
      palpacao: "Tamanho pequeno, móveis, indolores, consistência mole",
      observacoes: "Linfonodomegalia reativa",
      percussao: "Normal",
      ausculta: "Normal",
    },

    exame_fisico_interativo: {},

    exames_complementares_disponiveis: [],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Linfonodomegalia cervical reativa",
        probabilidade: 85,
        criterios_minimos: ["Tamanho pequeno", "Móveis", "Indolores", "Ausência de febre", "Sem hepato-esplenomegalia"],
      },
    ],

    diagnosticos_diferenciais: [],
    examesIndicados: [],

    conduta_esperada: {
      imediata: ["Tranquilizar responsável", "Observação clínica"],
      curto_prazo: [],
      longo_prazo: ["Seguimento clínico regular"],
      encaminhamentos: ["Oncologia se critérios de alarme"],
    },
    condutaCorreta: "Palpar adequadamente, tranquilizar responsável sobre linfonodomegalia reativa",

    criterios_de_gravidade: [
      {
        severidade: "leve",
        sinais: ["Linfonodos pequenos, móveis"],
        descricao: "Linfonodomegalia reativa",
        recomendacao: "Observação clínica",
      },
    ],

    erros_criticos: [],

    checklist_osce: [
      { item: "Palpou linfonodos bilateralmente", realizado: false, critico: true },
      { item: "Descreveu tamanho, consistência, mobilidade", realizado: false, critico: true },
      { item: "Examinou áreas supraclaviculares", realizado: false, critico: true },
      { item: "Examinou fígado e baço", realizado: false, critico: true },
      { item: "Tranquilizou responsável", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Técnica de palpação",
        peso: 40,
        descricao: "Exame adequado",
        pontuacao_maxima: 40,
      },
      {
        criterio: "Comunicação",
        peso: 40,
        descricao: "Tranquilização apropriada",
        pontuacao_maxima: 40,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: ["Queixa de caroços", "Duração"],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Palpação de linfonodos", "Características"],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Linfonodomegalia cervical reativa"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Observação", "Tranquilização"],
      },
    },

    feedback_modelo: {
      acertos_esperados: ["Técnica adequada", "Caracterização completa", "Tranquilização"],
      erros_comuns: ["Exame incompleto", "Não tranquilizar", "Solicitar exames desnecessários"],
      orientacoes_pedagogicas: ["Linfonodomegalia pequena é usualmente reativa", "Características ajudam diferenciar"],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Exame adequado e tranquilização",
      exame_fisico: ["palpação bilateral"],
      comunicacao: ["tranquilizou mãe"],
    },

    temaOSCE: "Pediatria - Hematologia",
    subtopicosOSCE: ["Linfonodos", "Palpação", "Características"],
    diagnosticoCorreto: "Linfonodomegalia cervical reativa",
    ativo: true,
  },

  // ====== CASO PED-15: ANEMIA E ALERTA HEMATOLÓGICO ======
  {
    id: "ped-15",
    titulo: "Anemia com Sinais de Alerta - Criança de 8 Anos",
    sistema: "Hematológico",
    tema: "Anemia",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Reconhecer anemia, investigar causa, identificar sinais de alerta para doença hematológica",
    tipoPaciente: "pediatrico",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Amber",
      idade: 8,
      sexo: "Feminino",
      queixa_principal: "Cansaço, palidez e equimoses",
      historia_breve: "Criança com palidez progressiva e manchas roxas",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Anemia + possível trombocitopenia (síndrome hematológica)",
      diagnosticos_diferenciais: ["Anemiaferropriva isolada", "Leucemia"],
      sindromes_associadas: ["Síndrome anêmica", "Possível ITP ou síndrome hematológica"],
    },

    descricaoBreve: "Criança de 8 anos com anemia e sinais de alerta hematológicos",
    categoria: "Hematológico",
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
          parentesco: "mãe",
        },
        peso: "24 kg",
        aberturaResponsavel: "Doutor, minha filha está muito cansada, pálida, e apareceu uns roxos no corpo sem ela ter batido.",
      },
    },

    respostas_do_paciente: {
      inicial: "Mãe: Ela está muito cansada e pálida.",
      cansaco: "Mãe: Reclama de cansaço ao subir escadas, tontura.",
      equimoses: "Mãe: Apareceram umas manchas roxas no corpo sem ela ter batido.",
      febre: "Mãe: Não tem febre.",
      outros: "Mãe: Às vezes ela reclama de dor nos ossos.",
    },
    respostaPaciente: {
      inicial: "Mãe: Ela está muito cansada e pálida.",
      cansaco: "Mãe: Reclama de cansaço ao subir escadas, tontura.",
      equimoses: "Mãe: Apareceram umas manchas roxas no corpo sem ela ter batido.",
      febre: "Mãe: Não tem febre.",
      outros: "Mãe: Às vezes ela reclama de dor nos ossos.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "não aferida",
        frequenciaCardiaca: 108,
        frequenciaRespiratoria: 22,
        temperatura: 36.8,
        saturacaoOxigenio: 97,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "não aferida",
      frequenciaCardiaca: 108,
      frequenciaRespiratoria: 22,
      temperatura: 36.8,
      saturacaoOxigenio: 97,
    },

    exame_fisico: {
      correto: {
        inspecao: "Palidez de mucosas e conjuntivas, equimoses em membros, ausência de icterícia ou hepatoesplenomegalia aparente",
        palpacao: "Linfonodos: alguns pequenos cervicais; palpação abdominal sem hepatomegalia ou esplenomegalia",
        ausculta: "Sopro sistólico funcional (por anemia)",
        percussao: "Normal",
        observacoes: "Anemia confirmada com sinais de alerta (equimoses)",
        achados_positivos: ["Palidez", "Equimoses", "Taquicardia"],
        achados_negativos: ["Febre", "Hepato-esplenomegalia"],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Palidez de mucosas, equimoses",
      ausculta: "Sopro sistólico por anemia",
      palpacao: "Sem hepato-esplenomegalia",
      observacoes: "Anemia com sinais de alerta",
      percussao: "Normal",
    },

    exame_fisico_interativo: {},

    exames_complementares_disponiveis: [
      {
        nome: "Hemograma",
        descricao: "Contagem de células",
        resultado: "Hemoglobina 7.2 g/dL, plaquetas 45.000/μL, WBC 4.500/μL",
        valor_referencia: "Hb 12-16 g/dL, plaquetas 150.000-400.000/μL, WBC 5.000-12.000/μL",
        interpretacao: "Anemia moderada com trombocitopenia",
      },
      {
        nome: "Ferro sérico e ferritina",
        descricao: "Metabolismo de ferro",
        resultado: "Ferritina 22 ng/mL, ferro 35 μg/dL",
        valor_referencia: "Ferritina > 30 ng/mL, ferro > 60 μg/dL",
        interpretacao: "Sugestivo de anemia ferropriva",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Anemia ferropriva com suspeita de trombocitopenia",
        probabilidade: 80,
        criterios_minimos: ["Palidez", "Fadiga", "Equimoses espontâneas", "Hemoglobina baixa", "Plaquetas baixas"],
      },
    ],

    diagnosticos_diferenciais: [],
    examesIndicados: ["Hemograma completo", "Metabolismo de ferro", "Possivelmente biópsia de medula se citopenias mantidas"],

    conduta_esperada: {
      imediata: ["Solicitar hemograma urgente", "Avaliar gravidade"],
      curto_prazo: ["Suplementação de ferro se indicado", "Investigação de sangramento"],
      longo_prazo: ["Acompanhamento hematológico"],
      encaminhamentos: ["Hematologia pediátrica"],
    },
    condutaCorreta: "Reconhecer sinais de alerta, solicitar hemograma urgente, investigar etiologia, referir para hematologia",

    criterios_de_gravidade: [
      {
        severidade: "moderada",
        sinais: ["Anemia moderada com trombocitopenia"],
        descricao: "Síndrome hematológica",
        recomendacao: "Investigação e acompanhamento hematológico",
      },
    ],

    erros_criticos: [
      {
        erro: "Não reconhecer sinais de alerta (equimoses espontâneas)",
        descricao: "Indicativo de doença mais grave que anemia simples",
        penalidade: 2.5,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou cansaço e palidez", realizado: false, critico: true },
      { item: "Investigou equimoses", realizado: false, critico: true },
      { item: "Solicitou hemograma completo", realizado: false, critico: true },
      { item: "Solicitou estudos de ferro", realizado: false, critico: true },
      { item: "Reconheceu sinais de alerta", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Anamnese e Exame",
        peso: 30,
        descricao: "Reconhecimento de sinais",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Investigação",
        peso: 40,
        descricao: "Exames apropriados",
        pontuacao_maxima: 40,
      },
      {
        criterio: "Conduta",
        peso: 30,
        descricao: "Referência hematológica",
        pontuacao_maxima: 30,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: ["Cansaço", "Palidez", "Equimoses"],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Palidez", "Equimoses", "Hemograma", "Ferro"],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Anemia com sinais de alerta hematológico"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Hematologia pediátrica"],
      },
    },

    feedback_modelo: {
      acertos_esperados: ["Reconhecimento de sinais de alerta", "Exames apropriados", "Referência hematológica"],
      erros_comuns: ["Pensar apenas em anemia ferropriva", "Não investigar equimoses", "Não referir apropriadamente"],
      orientacoes_pedagogicas: ["Equimoses espontâneas são sinal de alerta", "Trombocitopenia pode acompanhar anemia", "Hematologia deve avaliar"],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecimento de sinais de alerta",
      exame_fisico: ["reconheceu sinais de alerta"],
      exames_complementares: ["hemograma solicitado"],
      conduta: ["referiu apropriadamente"],
    },

    temaOSCE: "Pediatria - Hematologia",
    subtopicosOSCE: ["Anemia", "Sinais de alerta", "Equimoses"],
    diagnosticoCorreto: "Anemia com sinais de alerta hematológico",
    ativo: true,
  },

  // ====== CASO PED-16: DENGUE COM TESTE DO LAÇO ======
  {
    id: "ped-16",
    titulo: "Suspeita de Dengue - Criança de 8 Anos",
    sistema: "Infectologia",
    tema: "Arboviroses",
    nivel: "intermediario",
    tipo_estacao: "integrada",
    tempo_osce_minutos: 12,
    objetivo_pedagogico: "Reconhecer dengue, realizar teste do laço, avaliar sinais de alarme, orientar acompanhamento",
    tipoPaciente: "pediatrico",

    dados_visiveis_ao_estudante: {
      nome_paciente: "Danilo",
      idade: 8,
      sexo: "Masculino",
      queixa_principal: "Febre, dor no corpo e manchas na pele",
      historia_breve: "Criança com síndrome febril viral em área de dengue",
    },

    dados_ocultos_do_sistema: {
      diagnostico_principal: "Dengue (suspeita clínica)",
      diagnosticos_diferenciais: ["Influenza", "Sarampo", "Outras arboviroses"],
      sindromes_associadas: ["Dengue"],
    },

    descricaoBreve: "Criança de 8 anos com suspeita de dengue",
    categoria: "Infectologia",
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
          parentesco: "mãe",
        },
        peso: "26 kg",
        aberturaResponsavel: "Doutor, meu filho está com febre alta, dor no corpo inteiro, e apareceu umas manchas vermelhas.",
      },
    },

    respostas_do_paciente: {
      inicial: "Mãe: Ele acordou com febre alta.",
      febre: "Mãe: A febre chegou a 39 graus.",
      dor: "Mãe: Ele está reclamando de dor no corpo todo, dor de cabeça, dor atrás dos olhos.",
      manchas: "Mãe: Apareceu umas manchas vermelhas, principalmente no braço.",
      outros: "Mãe: Está bem fraco mesmo.",
    },
    respostaPaciente: {
      inicial: "Mãe: Ele acordou com febre alta.",
      febre: "Mãe: A febre chegou a 39 graus.",
      dor: "Mãe: Ele está reclamando de dor no corpo todo, dor de cabeça, dor atrás dos olhos.",
      manchas: "Mãe: Apareceu umas manchas vermelhas, principalmente no braço.",
      outros: "Mãe: Está bem fraco mesmo.",
    },

    sinais_vitais: {
      corretos: {
        pressaoArterial: "98/60 mmHg",
        frequenciaCardiaca: 104,
        frequenciaRespiratoria: 22,
        temperatura: 38.6,
        saturacaoOxigenio: 98,
      },
    },
    sinaisVitaisCorretos: {
      pressaoArterial: "não aferida",
      frequenciaCardiaca: 104,
      frequenciaRespiratoria: 22,
      temperatura: 38.6,
      saturacaoOxigenio: 98,
    },

    exame_fisico: {
      correto: {
        inspecao: "Criança febril, prostrada, exantema maculopapular em tronco e membros",
        palpacao: "Ligadura do braço por 3 minutos: > 10 petéquias em 1 polegada quadrada (teste do laço positivo)",
        ausculta: "Normal",
        percussao: "Normal",
        observacoes: "Sinais clínicos compatíveis com dengue, teste do laço positivo",
        achados_positivos: ["Febre", "Exantema", "Teste do laço positivo"],
        achados_negativos: [],
      },
    },
    exameFisicoCorreto: {
      inspecao: "Criança febril, exantema maculopapular",
      palpacao: "Teste do laço: positivo (>10 petéquias em 1 polegada²)",
      observacoes: "Dengue provável",
      percussao: "Normal",
      ausculta: "Normal",
    },

    exame_fisico_interativo: {},

    exames_complementares_disponiveis: [
      {
        nome: "NS1 (Antígeno Não-Estrutural 1)",
        descricao: "Detecção de dengue",
        resultado: "Positivo",
        valor_referencia: "Negativo",
        interpretacao: "Dengue confirmada (fase aguda)",
      },
      {
        nome: "Hemograma",
        descricao: "Contagem de células",
        resultado: "Leucócitos 3.200/μL, plaquetas 95.000/μL",
        valor_referencia: "Leucócitos 5.000-12.000/μL, plaquetas > 150.000/μL",
        interpretacao: "Leucopenia e trombocitopenia compatíveis com dengue",
      },
    ],

    hipoteses_diagnosticas_esperadas: [
      {
        diagnostico: "Dengue (suspeita clínica)",
        probabilidade: 85,
        criterios_minimos: ["Febre", "Myalgias intensas", "Cefaleia", "Exantema", "Teste do laço positivo"],
      },
    ],

    diagnosticos_diferenciais: [],
    examesIndicados: ["NS1", "Hemograma", "Sorologias (IgM/IgG) após 5 dias"],

    conduta_esperada: {
      imediata: ["Avaliar sinais de alarme", "Hidratação adequada"],
      curto_prazo: ["Evitar AINE (usar apenas paracetamol)", "Acompanhamento com hemograma"],
      longo_prazo: ["Acompanhamento até normalização de plaquetas"],
      encaminhamentos: ["Hospitalização se sinais de gravidade"],
    },
    condutaCorreta: "Reconhecer dengue, realizar teste do laço, orientar hidratação, evitar AINE, acompanhamento regular",

    criterios_de_gravidade: [
      {
        severidade: "leve",
        sinais: ["Dengue sem sinais de alarme"],
        descricao: "Acompanhamento ambulatorial",
        recomendacao: "Hidratação e paracetamol",
      },
    ],

    erros_criticos: [
      {
        erro: "Prescrever AINE",
        descricao: "Contraindicado em dengue por risco de sangramento",
        penalidade: 2,
        evitavel: true,
      },
    ],

    checklist_osce: [
      { item: "Investigou febre, myalgias e cefaleia", realizado: false, critico: true },
      { item: "Investigou exantema", realizado: false, critico: true },
      { item: "Realizou teste do laço", realizado: false, critico: true },
      { item: "Solicitou NS1 e hemograma", realizado: false, critico: true },
      { item: "Orientou sobre sinais de alarme", realizado: false, critico: true },
    ],

    rubrica_correcao: [
      {
        criterio: "Anamnese e Exame",
        peso: 30,
        descricao: "Reconhecimento de dengue",
        pontuacao_maxima: 30,
      },
      {
        criterio: "Teste do Laço",
        peso: 25,
        descricao: "Execução correta",
        pontuacao_maxima: 25,
      },
      {
        criterio: "Conduta",
        peso: 45,
        descricao: "Hidratação, sem AINE, sinais de alarme",
        pontuacao_maxima: 45,
      },
    ],

    modelo_soap: {
      subjetivo: {
        secao: "S",
        componentes_obrigatorios: ["Febre", "Myalgias", "Cefaleia", "Exantema"],
      },
      objetivo: {
        secao: "O",
        componentes_obrigatorios: ["Teste do laço", "Hemograma", "NS1"],
      },
      avaliacao: {
        secao: "A",
        componentes_obrigatorios: ["Dengue provável"],
      },
      plano: {
        secao: "P",
        componentes_obrigatorios: ["Hidratação", "Paracetamol", "Acompanhamento", "Sinais de alarme"],
      },
    },

    feedback_modelo: {
      acertos_esperados: ["Reconhecimento de dengue", "Teste do laço realizado", "Orientação apropriada sobre AINE"],
      erros_comuns: ["Prescrever AINE", "Não realizar teste do laço", "Não pesquisar sinais de alarme"],
      orientacoes_pedagogicas: ["Teste do laço é útil em dengue", "AINE é contraindicado", "Sinais de alarme devem ser monitorados"],
    },

    checklist_oculto_examinador: {
      oQueProfessorQuer: "Reconhecimento de dengue e conduta apropriada",
      exame_fisico: ["realizou teste do laço"],
      conduta: ["evitou AINE", "orientou sinais de alarme"],
    },

    temaOSCE: "Pediatria - Arboviroses",
    subtopicosOSCE: ["Dengue", "Teste do laço", "Sinais de alarme"],
    diagnosticoCorreto: "Dengue",
    ativo: true,
  },
];
