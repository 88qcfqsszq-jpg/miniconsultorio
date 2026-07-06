import { CasoOSCEV2 } from "@/types/caso-osce-v2";

export const caso002PneumoniaAdquiridaNaComunidade: CasoOSCEV2 = {
// ====== CASO 2: PNEUMONIA ADQUIRIDA NA COMUNIDADE ======
id: "2",
titulo: "Pneumonia Adquirida na Comunidade",
sistema: "Respiratório",
tema: "Infecção Respiratória",
nivel: "intermediario",
tipo_estacao: "integrada",
tempo_osce_minutos: 12,
objetivo_pedagogico:
"Diagnosticar pneumonia comunitária e estabelecer tratamento antimicrobiano apropriado",
dados_visiveis_ao_estudante: {
nome_paciente: "Ana Santos",
idade: 38,
sexo: "Feminino",
queixa_principal: "Tosse com catarro e febre há 5 dias",
historia_breve:
"Começou com tosse seca, piorou progressivamente com catarro amarelado e febre"
},
dados_ocultos_do_sistema: {
diagnostico_principal: "Pneumonia Adquirida na Comunidade (PAC)",
diagnosticos_diferenciais: [
"Bronquite Aguda",
"Exacerbação de Asma",
"Tuberculose",
"Infecção Viral",
],
sindromes_associadas: ["Síndrome de Resposta Inflamatória Sistêmica"],
},
descricaoBreve:
"Paciente com tosse produtiva, febre e desconforto respiratório",
categoria: "Pneumonia",
paciente: {
id: "pac-002",
nome: "Ana Santos",
idade: 38,
sexo: "F",
queixaPrincipal: "Tosse com catarro e febre há 5 dias",
historicoDoenca:
"Começou com tosse seca, piorou progressivamente com catarro amarelado",
antecedentes: ["Asma na infância", "Fumante passiva"],
profissao: "Professora",
estado_civil: "Solteira",
alergias: [],
medicamentos_em_uso: [],
},
respostas_do_paciente: {
inicial:
"Oi doutor/doutora, tô muito ruim, tô com essa tosse que não melhora.",
tosse: "Sim, uma tosse que solta catarro amarelado, bem viscoso mesmo.",
inicio: "Começou seco uns 5 dias atrás, agora tá pior.",
febre: "Sim, acordei com febre. Medi ontem e tava 38.5 graus.",
respiracao: "Sim, fico cansada ao subir escada.",
dor: "Sinto uma dor no peito quando respiro fundo.",
contato: "Meu filho traz essas coisas da escola toda hora.",
outro_tratamento: "Tomei uns xarope em casa mas não ajudou muito.",
},
respostaPaciente: {
inicial:
"Oi doutor/doutora, tô muito ruim, tô com essa tosse que não melhora.",
tosse: "Sim, uma tosse que solta catarro amarelado, bem viscoso mesmo.",
inicio: "Começou seco uns 5 dias atrás, agora tá pior.",
febre: "Sim, acordei com febre. Medi ontem e tava 38.5 graus.",
respiracao: "Sim, fico cansada ao subir escada.",
dor: "Sinto uma dor no peito quando respiro fundo.",
contato: "Meu filho traz essas coisas da escola toda hora.",
outro_tratamento: "Tomei uns xarope em casa mas não ajudou muito.",
},
sinais_vitais: {
corretos: {
pressaoArterial: "120/80 mmHg",
frequenciaCardiaca: 98,
frequenciaRespiratoria: 24,
temperatura: 38.5,
saturacaoOxigenio: 92,
},
},
sinaisVitaisCorretos: {
pressaoArterial: "120/80 mmHg",
frequenciaCardiaca: 98,
frequenciaRespiratoria: 24,
temperatura: 38.5,
saturacaoOxigenio: 92,
glicemia: 105,
},
exame_fisico: {
correto: {
inspecao: "Paciente febril, tosse produtiva evidente, taquipneia leve",
palpacao: "Expansão torácica simétrica, sem alterações",
ausculta:
"Crepitações bibasais, broncovesicular em ambos os pulmões, predomínio à esquerda",
percussao: "Normal",
observacoes:
"Sinais de consolidação pulmonar sugestivos de pneumonia bacteriana",
regiao: "Pulmões bilateralmente",
achados_positivos: [
"Crepitações",
"Taquipneia",
"Febre",
"Tosse produtiva",
],
achados_negativos: ["Sibilos", "Roncos"],
},
},
exameFisicoCorreto: {
inspecao: "Paciente febril, tosse produtiva evidente, taquipneia leve",
palpacao: "Expansão torácica simétrica, sem alterações",
ausculta:
"Crepitações bibasais, broncovesicular em ambos os pulmões, predomínio à esquerda",
percussao: "Normal",
observacoes:
"Sinais de consolidação pulmonar sugestivos de pneumonia bacteriana",
},
exame_fisico_interativo: {
geral: {
estado_geral: "Paciente em regular estado geral, febril, com tosse produtiva.",
consciencia: "Lúcido e orientado em tempo e espaço.",
hidratacao: "Hidratado.",
},
respiratorio: {
inspecao_torax: "Taquipneia leve, expansão simétrica, sem uso de musculatura acessória.",
padrao_respiratorio: "Frequência respiratória 24 ipm, padrão regular.",
expansibilidade: "Expansibilidade simétrica bilateralmente.",
fremito_toracovocal: "Fremito aumentado em base esquerda.",
percussao: "Submacicez em base esquerda.",
ausculta_pulmonar: "Estertores crepitantes em base esquerda, murmúrio vesicular presente bilateralmente.",
egofonia: "Ausente.",
},
},
exames_complementares_disponiveis: [
{
nome: "Radiografia de Tórax PA e Perfil",
descricao: "Avaliação de infiltrados pulmonares",
resultado: "Infiltrado consolidativo no lobo inferior esquerdo",
valor_referencia: "Sem infiltrados",
interpretacao: "Compatível com pneumonia bacteriana",
},
{
nome: "Hemograma Completo",
descricao: "Série de glóbulos",
resultado: "Leucocitose 14.000/mm³, neutrofilia 87%",
valor_referencia: "4.500-11.000/mm³",
interpretacao: "Infecção bacteriana",
},
],
hipoteses_diagnosticas_esperadas: [
{
diagnostico: "Pneumonia Adquirida na Comunidade (PAC)",
probabilidade: 90,
criterios_minimos: [
"Tosse produtiva",
"Febre",
"Crepitações à ausculta",
"Infiltrado em RX",
],
},
],
diagnosticos_diferenciais: [
{
diagnostico: "Bronquite Aguda",
criterios_exclusao: ["Infiltrado em Raio X"],
achados_que_descartam: ["Consolidação pulmonar"],
},
],
examesIndicados: [
"Raio X de tórax PA e perfil",
"Hemograma",
"Procalcitonina",
],
conduta_esperada: {
imediata: [
"Iniciar antibióticoterapia (betalactâmico + macrolídeo)",
"Hidratação IV",
"Oxigenioterapia se SpO2 <92%",
],
curto_prazo: [
"Radiografia de tórax",
"Monitorização clínica",
"Avaliação de resposta em 48-72h",
],
longo_prazo: ["Seguimento ambulatorial", "Investigação de recorrências"],
encaminhamentos: ["Pneumologia se necessário"],
},
condutaCorreta:
"Antibióticoterapia (betalactâmico + macrolídeo), hidratação, oxigenioterapia conforme necessário",
criterios_de_gravidade: [
{
severidade: "moderada",
sinais: ["Febre 38-39°C", "SpO2 90-94%", "FR >24"],
descricao: "Pneumonia de risco moderado",
recomendacao: "Antibióticoterapia iniciada, monitorização",
},
],
erros_criticos: [
{
erro: "Não solicitar radiografia de tórax",
descricao: "Radiografia é essencial para confirmar diagnóstico",
penalidade: 1.5,
evitavel: true,
},
{
erro: "Prescrever antibiótico inapropriado",
descricao: "PAC requer cobertura para Streptococcus pneumoniae e Haemophilus",
penalidade: 2,
evitavel: true,
},
],
checklist_osce: [
{ item: "Caracterizou a tosse (seca vs produtiva)", realizado: false, critico: true },
{ item: "Perguntou sobre febre", realizado: false, critico: true },
{ item: "Mediu sinais vitais completos", realizado: false, critico: true },
{ item: "Realizou ausculta pulmonar completa", realizado: false, critico: true },
{ item: "Solicitou radiografia de tórax", realizado: false, critico: true },
{ item: "Prescreveu antibióticos apropriados", realizado: false, critico: true },
],
rubrica_correcao: [
{
criterio: "Diagnóstico Diferencial",
peso: 20,
descricao: "Considerou diagnósticos alternativos",
pontuacao_maxima: 20,
},
{
criterio: "Exames Complementares",
peso: 20,
descricao: "Seleção apropriada",
pontuacao_maxima: 20,
},
{
criterio: "Antibióticoterapia",
peso: 30,
descricao: "Antibiótico correto e dose apropriada",
pontuacao_maxima: 30,
},
],
modelo_soap: {
subjetivo: {
secao: "S",
componentes_obrigatorios: [
"Características da tosse",
"Duração dos sintomas",
"Febre",
"Contatos com doentes",
],
},
objetivo: {
secao: "O",
componentes_obrigatorios: [
"Sinais vitais",
"Ausculta pulmonar",
"Radiografia de tórax",
"Hemograma",
],
},
avaliacao: {
secao: "A",
componentes_obrigatorios: ["Diagnóstico de PAC", "Gravidade"],
},
plano: {
secao: "P",
componentes_obrigatorios: ["Antibióticoterapia", "Hidratação", "Seguimento"],
},
},
feedback_modelo: {
acertos_esperados: [
"Reconheceu sinais de consolidação pulmonar",
"Solicitou radiografia apropriadamente",
"Prescreveu antibióticos corretos",
],
erros_comuns: [
"Não considerar diagnóstico diferencial",
"Prescreveu monoterapia antibiótica",
],
orientacoes_pedagogicas: [
"PAC clássica: febre, tosse produtiva, crepitações, infiltrado em RX",
"Sempre solicite radiografia para confirmar diagnóstico",
"Cobertura empírica deve incluir S. pneumoniae e H. influenzae",
],
},
checklist_oculto_examinador: {
oQueProfessorQuer:
"Diagnóstico sistemático de pneumonia: anamnese detalhada de sintomas respiratórios, exame físico focado em ausculta, solicitação de radiografia de tórax para confirmação, seleção apropriada de antibióticos empíricos cobrindo pneumococo e Haemophilus.",
comunicacao: [
"se apresentou ao paciente",
"perguntou permissão para examinar",
"explicou o que estava investigando",
"mostrou empatia com desconforto respiratório",
],
anamnese: [
"investigou início e progressão dos sintomas",
"perguntou sobre tosse (seca vs produtiva)",
"investigou febre e duração",
"perguntou sobre fatores de risco",
],
exame_fisico: [
"solicitou sinais vitais",
"realizou ausculta pulmonar bilateral",
"procurou por estertores ou redução do murmúrio",
"avaliou estado geral",
],
exames_complementares: [
"solicitou radiografia de tórax",
"solicitou hemograma ou PCR",
"considerou culturar escarro se necessário",
],
raciocinio: [
"integrou anamnese + ausculta + RX para diagnóstico",
"reconheceu apresentação clínica de PAC",
"formulou diagnóstico apropriado",
],
conduta: [
"selecionou cobertura empírica adequada",
"considerou via de administração (VO vs IV)",
"planejou seguimento",
"deu orientações sobre quando piorar",
],
soap: [
"documentou sintomas respiratórios",
"registrou achados auscultatórios",
"formulou diagnóstico baseado em achados",
"planejou antibioticoterapia",
],
},
temaOSCE: "Pneumonia",
subtopicosOSCE: [
"Tosse produtiva",
"Febre >3 dias",
"Consolidação em RX tórax",
"Hemograma com leucocitose",
"Antibióticoterapia empírica"
],
diagnosticoCorreto: "Pneumonia Adquirida na Comunidade",

  exames_laboratoriais_detalhados: {
    hemograma: {
      solicitadoPor: ["hemograma completo"],
      disponivel: true,
      prioridade: "obrigatorio",
      interpretacao: "Leucocitose com neutrofilia e desvio à esquerda, compatível com infecção bacteriana.",
      valores: {
        hemoglobina: "13,8 g/dL",
        hematocrito: "40,5%",
        leucocitos: "14.000/mm³",
        neutrofilos: "87%",
        bastonetes: "7%",
        segmentados: "80%",
        linfocitos: "8%",
        monocitos: "4%",
        plaquetas: "280.000/mm³",
      },
    },
    funcaoRenal: {
      solicitadoPor: ["ureia", "creatinina", "função renal"],
      disponivel: true,
      prioridade: "rotina",
      interpretacao: "Função renal preservada.",
      valores: {
        ureia: "32 mg/dL",
        creatinina: "0,9 mg/dL",
        etfg: "> 90 mL/min/1,73m²",
      },
    },
    eletrolitos: {
      solicitadoPor: ["sódio", "potássio", "eletrólitos", "ionograma"],
      disponivel: true,
      prioridade: "rotina",
      interpretacao: "Eletrólitos sem alterações relevantes.",
      valores: {
        sodio: "139 mEq/L",
        potassio: "4,2 mEq/L",
        cloro: "102 mEq/L",
        magnesio: "2,0 mg/dL",
        calcio: "9,2 mg/dL",
      },
    },
    marcadoresInflamatorios: {
      solicitadoPor: ["pcr", "vhs", "procalcitonina"],
      disponivel: true,
      prioridade: "importante",
      interpretacao: "Marcadores inflamatórios elevados, favorecendo pneumonia bacteriana.",
      valores: {
        pcr: "16,0 mg/dL",
        vhs: "48 mm/h",
        procalcitonina: "0,9 ng/mL",
      },
    },
    gasometria: {
      solicitadoPor: ["gasometria arterial"],
      disponivel: true,
      prioridade: "importante",
      interpretacao: "Hipoxemia leve por acometimento pulmonar.",
      valores: {
        ph: "7,44",
        paco2: "36 mmHg",
        pao2: "68 mmHg",
        hco3: "24 mEq/L",
        satO2: "93%",
        lactato: "1,4 mmol/L",
        be: "+1",
      },
    },
    marcadoresCardiacos: {
      solicitadoPor: ["troponina", "ckmb", "bnp", "marcadores cardíacos"],
      disponivel: true,
      prioridade: "opcional",
      interpretacao: "Marcadores cardíacos sem evidência de necrose miocárdica.",
      valores: {
        troponina: "<0,04 ng/mL",
        ckmb: "2,0 ng/mL",
        bnp: "48 pg/mL",
      },
    },
    funcaoHepatica: {
      solicitadoPor: ["tgo", "tgp", "bilirrubinas", "função hepática"],
      disponivel: true,
      prioridade: "opcional",
      interpretacao: "Função hepática sem alterações relevantes.",
      valores: {
        tgo: "24 U/L",
        tgp: "28 U/L",
        fa: "88 U/L",
        ggt: "34 U/L",
        bilirrubinaTotal: "0,8 mg/dL",
        bilirrubinaDireta: "0,2 mg/dL",
        bilirrubinaIndireta: "0,6 mg/dL",
        albumina: "4,1 g/dL",
      },
    },
    coagulograma: {
      solicitadoPor: ["tp", "inr", "ttpa", "fibrinogênio", "d-dímero", "coagulograma"],
      disponivel: true,
      prioridade: "opcional",
      interpretacao: "Coagulograma sem alterações relevantes.",
      valores: {
        tp: "12,4 s",
        inr: "1,0",
        ttpa: "31 s",
        fibrinogenio: "320 mg/dL",
        dDimero: "<500 ng/mL",
      },
    },
    urinaTipo1: {
      solicitadoPor: ["urina tipo 1", "eas", "sumário de urina"],
      disponivel: true,
      prioridade: "opcional",
      interpretacao: "Urina tipo 1 sem alterações relevantes.",
      valores: {
        densidade: "1,020",
        ph: "6,0",
        proteina: "Ausente",
        glicose: "Ausente",
        cetonas: "Ausentes",
        sangueHemoglobina: "Ausente",
        nitrito: "Negativo",
        esteraseLeucocitaria: "Negativa",
        leucocitos: "< 5 p/campo",
        hemacias: "< 3 p/campo",
        bacterias: "Raras",
        cilindros: "Ausentes",
      },
    },
  },


  // ===== CAMPOS V3 — MODELO PADRÃO BASEADO NO CASO DE ASMA GRAVE =====
  sinaisVitais: {
    entrada: {
      momento: "Chegada ao atendimento",
      pressaoArterial: "120/80 mmHg",
      frequenciaCardiaca: 98,
      frequenciaRespiratoria: 24,
      temperatura: 38.5,
      saturacaoOxigenio: 92,
      glicemia: 105,
      interpretacao: "Quadro respiratório; monitorar SpO2, esforço respiratório, ausculta e resposta ao tratamento.",
    },
    evolucao: {
      aposCondutaCorreta_60min: {
        condicoesParaAtivar: ["Oxigênio se indicado", "Tratamento respiratório específico", "Monitorização", "Reavaliação de ausculta e SpO2"],
        frequenciaCardiaca: 92,
        frequenciaRespiratoria: 20,
        saturacaoOxigenio: 96,
        interpretacao: "Melhora ou estabilização respiratória após conduta adequada.",
      },
      seCondutaInadequadaOuAtrasada: {
        frequenciaCardiaca: 118,
        frequenciaRespiratoria: 30,
        saturacaoOxigenio: 89,
        interpretacao: "Piora respiratória por atraso em tratar ou escalar cuidado.",
      },
    },
    criteriosParaAltaOuObservacao: {
      altaSeguraSe: ["SpO2 adequada", "Sem esforço respiratório importante", "FR em melhora", "conduta instituída", "retorno orientado"],
      manterObservacaoOuInternarSe: ["hipoxemia", "dispneia persistente", "instabilidade", "falha terapêutica", "risco social ou clínico"],
    },
  },

  exames: {
    complementaresDisponiveisOriginais: [
{
nome: "Radiografia de Tórax PA e Perfil",
descricao: "Avaliação de infiltrados pulmonares",
resultado: "Infiltrado consolidativo no lobo inferior esquerdo",
valor_referencia: "Sem infiltrados",
interpretacao: "Compatível com pneumonia bacteriana",
},
{
nome: "Hemograma Completo",
descricao: "Série de glóbulos",
resultado: "Leucocitose 14.000/mm³, neutrofilia 87%",
valor_referencia: "4.500-11.000/mm³",
interpretacao: "Infecção bacteriana",
},
],
    laboratoriais: {
    hemograma: {
      solicitadoPor: ["hemograma completo"],
      disponivel: true,
      prioridade: "obrigatorio",
      interpretacao: "Leucocitose com neutrofilia e desvio à esquerda, compatível com infecção bacteriana.",
      valores: {
        hemoglobina: "13,8 g/dL",
        hematocrito: "40,5%",
        leucocitos: "14.000/mm³",
        neutrofilos: "87%",
        bastonetes: "7%",
        segmentados: "80%",
        linfocitos: "8%",
        monocitos: "4%",
        plaquetas: "280.000/mm³",
      },
    },
    funcaoRenal: {
      solicitadoPor: ["ureia", "creatinina", "função renal"],
      disponivel: true,
      prioridade: "rotina",
      interpretacao: "Função renal preservada.",
      valores: {
        ureia: "32 mg/dL",
        creatinina: "0,9 mg/dL",
        etfg: "> 90 mL/min/1,73m²",
      },
    },
    eletrolitos: {
      solicitadoPor: ["sódio", "potássio", "eletrólitos", "ionograma"],
      disponivel: true,
      prioridade: "rotina",
      interpretacao: "Eletrólitos sem alterações relevantes.",
      valores: {
        sodio: "139 mEq/L",
        potassio: "4,2 mEq/L",
        cloro: "102 mEq/L",
        magnesio: "2,0 mg/dL",
        calcio: "9,2 mg/dL",
      },
    },
    marcadoresInflamatorios: {
      solicitadoPor: ["pcr", "vhs", "procalcitonina"],
      disponivel: true,
      prioridade: "importante",
      interpretacao: "Marcadores inflamatórios elevados, favorecendo pneumonia bacteriana.",
      valores: {
        pcr: "16,0 mg/dL",
        vhs: "48 mm/h",
        procalcitonina: "0,9 ng/mL",
      },
    },
    gasometria: {
      solicitadoPor: ["gasometria arterial"],
      disponivel: true,
      prioridade: "importante",
      interpretacao: "Hipoxemia leve por acometimento pulmonar.",
      valores: {
        ph: "7,44",
        paco2: "36 mmHg",
        pao2: "68 mmHg",
        hco3: "24 mEq/L",
        satO2: "93%",
        lactato: "1,4 mmol/L",
        be: "+1",
      },
    },
    marcadoresCardiacos: {
      solicitadoPor: ["troponina", "ckmb", "bnp", "marcadores cardíacos"],
      disponivel: true,
      prioridade: "opcional",
      interpretacao: "Marcadores cardíacos sem evidência de necrose miocárdica.",
      valores: {
        troponina: "<0,04 ng/mL",
        ckmb: "2,0 ng/mL",
        bnp: "48 pg/mL",
      },
    },
    funcaoHepatica: {
      solicitadoPor: ["tgo", "tgp", "bilirrubinas", "função hepática"],
      disponivel: true,
      prioridade: "opcional",
      interpretacao: "Função hepática sem alterações relevantes.",
      valores: {
        tgo: "24 U/L",
        tgp: "28 U/L",
        fa: "88 U/L",
        ggt: "34 U/L",
        bilirrubinaTotal: "0,8 mg/dL",
        bilirrubinaDireta: "0,2 mg/dL",
        bilirrubinaIndireta: "0,6 mg/dL",
        albumina: "4,1 g/dL",
      },
    },
    coagulograma: {
      solicitadoPor: ["tp", "inr", "ttpa", "fibrinogênio", "d-dímero", "coagulograma"],
      disponivel: true,
      prioridade: "opcional",
      interpretacao: "Coagulograma sem alterações relevantes.",
      valores: {
        tp: "12,4 s",
        inr: "1,0",
        ttpa: "31 s",
        fibrinogenio: "320 mg/dL",
        dDimero: "<500 ng/mL",
      },
    },
    urinaTipo1: {
      solicitadoPor: ["urina tipo 1", "eas", "sumário de urina"],
      disponivel: true,
      prioridade: "opcional",
      interpretacao: "Urina tipo 1 sem alterações relevantes.",
      valores: {
        densidade: "1,020",
        ph: "6,0",
        proteina: "Ausente",
        glicose: "Ausente",
        cetonas: "Ausentes",
        sangueHemoglobina: "Ausente",
        nitrito: "Negativo",
        esteraseLeucocitaria: "Negativa",
        leucocitos: "< 5 p/campo",
        hemacias: "< 3 p/campo",
        bacterias: "Raras",
        cilindros: "Ausentes",
      },
    },
  },
    observacaoUsoExames: "Exames devem apoiar o raciocínio, mas não atrasar condutas urgentes quando houver instabilidade ou sinal de gravidade.",
  },

  feedbackDetalhado: {
    escala: { total: 20, minimoAprovacao: 17 },
    dominios: [
      { nome: "Comunicação e postura", pontos: 2, criterios: [
        { item: "Apresentou-se, confirmou paciente e manteve postura segura", pontos: 0.5 },
        { item: "Explicou avaliação e conduta em linguagem acessível", pontos: 0.5 },
        { item: "Priorizou segurança sem atrasar medidas urgentes", pontos: 0.5 },
        { item: "Reavaliou e comunicou evolução/próximos passos", pontos: 0.5 },
      ]},
      { nome: "Anamnese dirigida", pontos: 3, criterios: [
        { item: "Caracterizou queixa principal, início, duração e progressão", pontos: 0.7 },
        { item: "Investigou sintomas associados relevantes", pontos: 0.7 },
        { item: "Investigou antecedentes, medicações, alergias e fatores de risco", pontos: 0.7 },
        { item: "Investigou sinais de gravidade e diferenciais perigosos", pontos: 0.9 },
      ]},
      { nome: "Exame físico e gravidade", pontos: 4, criterios: [
        { item: "Solicitou sinais vitais completos e valorizou alterações", pontos: 0.9, critico: true },
        { item: "Realizou exame físico direcionado ao sistema acometido", pontos: 1.0 },
        { item: "Identificou achados positivos e negativos relevantes", pontos: 0.8 },
        { item: "Classificou gravidade e risco de deterioração", pontos: 1.0, critico: true },
        { item: "Reavaliou após intervenção quando aplicável", pontos: 0.3 },
      ]},
      { nome: "Exames complementares", pontos: 2, criterios: [
        { item: "Solicitou exames essenciais sem atrasar tratamento urgente", pontos: 0.7 },
        { item: "Interpretou labs/imagem de forma coerente", pontos: 0.7 },
        { item: "Usou exames para confirmar hipótese e excluir diferenciais graves", pontos: 0.4 },
        { item: "Evitou priorizar exames desnecessários em instabilidade", pontos: 0.2 },
      ]},
      { nome: "Raciocínio diagnóstico", pontos: 3, criterios: [
        { item: "Formulou diagnóstico principal correto", pontos: 1.0, critico: true },
        { item: "Justificou com história, exame físico e exames", pontos: 0.8 },
        { item: "Considerou diferenciais perigosos", pontos: 0.7 },
        { item: "Reconheceu gravidade e necessidade de escalonamento", pontos: 0.5 },
      ]},
      { nome: "Conduta, reavaliação e destino", pontos: 6, criterios: [
        { item: "Iniciou conduta imediata apropriada", pontos: 1.4, critico: true },
        { item: "Indicou tratamento específico correto", pontos: 1.2, critico: true },
        { item: "Monitorizou resposta clínica e sinais vitais", pontos: 0.9 },
        { item: "Escalonou cuidado se resposta inadequada", pontos: 0.9 },
        { item: "Definiu destino seguro", pontos: 0.8 },
        { item: "Orientou retorno/seguimento/prevenção", pontos: 0.8 },
      ]},
    ],
    penalidadesAutomaticas: [
      { condicao: "Não reconhecer sinal de gravidade", penalidade: 2, justificativa: "Sinais de gravidade mudam prioridade e destino." },
      { condicao: "Atrasar conduta urgente para aguardar exame não essencial", penalidade: 2, justificativa: "Estabilização não deve ser atrasada." },
      { condicao: "Dar alta sem reavaliação objetiva", penalidade: 3, justificativa: "Alta insegura expõe a risco de deterioração." },
    ],
  },

} as CasoOSCEV2;
