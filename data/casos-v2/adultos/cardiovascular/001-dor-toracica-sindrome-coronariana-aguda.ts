import { CasoOSCEV2 } from "@/types/caso-osce-v2";

export const caso001DorToracicaSindromeCoronarianaAguda: CasoOSCEV2 = {
// ====== CASO 1: SCA - SÍNDROME CORONARIANA AGUDA ======
id: "1",
titulo: "Dor Torácica - Síndrome Coronariana Aguda",
sistema: "Cardiovascular",
tema: "Dor Torácica",
nivel: "intermediario",
tipo_estacao: "integrada",
tempo_osce_minutos: 15,
objetivo_pedagogico:
"Reconhecer sinais e sintomas de SCA, solicitar exames diagnósticos apropriados e estabelecer conduta emergencial",
dados_visiveis_ao_estudante: {
nome_paciente: "Carlos Silva",
idade: 52,
sexo: "Masculino",
queixa_principal: "Dor no peito há 2 horas",
historia_breve:
"Começou de repente enquanto assistia TV, com sudorese e falta de ar"
},
dados_ocultos_do_sistema: {
diagnostico_principal: "Síndrome Coronariana Aguda (SCA) - IAMCSST",
diagnosticos_diferenciais: [
"Infarto Agudo do Miocárdio (IAM)",
"Angina Instável",
"Pericardite Aguda",
"Embolia Pulmonar",
"Dissecção de Aorta",
],
sindromes_associadas: ["Síndrome Coronariana Aguda"],
},
descricaoBreve:
"Paciente com dor torácica típica, com irradiação para o braço esquerdo",
categoria: "SCA",
paciente: {
id: "pac-001",
nome: "Carlos Silva",
idade: 52,
sexo: "M",
queixaPrincipal: "Dor no peito há 2 horas",
historicoDoenca:
"Começou de repente enquanto assistia TV, acompanhado de sudorese e falta de ar",
antecedentes: [
"Hipertensão",
"Histórico familiar positivo para infarto",
],
profissao: "Engenheiro",
estado_civil: "Casado",
alergias: [],
medicamentos_em_uso: ["Losartana 50mg"],
},
respostas_do_paciente: {
inicial: "Tudo bem, Dr? Tô com uma dor no peito que não passa.",
dor: "Aqui no meio do peito, bem no centro, às vezes irradia pro braço esquerdo.",
intensidade: "É muito forte, de 8 a 9, tenho medo do que é.",
inicio: "Começou umas 2 horas atrás, tava assistindo TV tranquilo.",
suor: "Sim, tô suado e tremendo, meu pai morreu de infarto.",
respiracao: "Sim, tenho falta de ar, estou ansioso.",
tontura: "Um pouco, sim.",
nausea: "Sinto um enjôo leve.",
},
respostaPaciente: {
inicial: "Oi, tô com uma dor no peito que não passa.",
dor: "Aqui no meio do peito, bem no centro, às vezes irradia pro braço esquerdo.",
intensidade: "É muito forte, de 8 a 9, tenho medo do que é.",
inicio: "Começou umas 2 horas atrás, tava assistindo TV tranquilo.",
suor: "Sim, tô suado e tremendo, meu pai morreu de infarto.",
respiracao: "Sim, tenho falta de ar, estou ansioso.",
tontura: "Um pouco, sim.",
nausea: "Sinto um enjôo leve.",
},
sinais_vitais: {
corretos: {
pressaoArterial: "160/95 mmHg",
frequenciaCardiaca: 102,
frequenciaRespiratoria: 20,
temperatura: 36.8,
saturacaoOxigenio: 96,
},
},
sinaisVitaisCorretos: {
pressaoArterial: "160/95 mmHg",
frequenciaCardiaca: 102,
frequenciaRespiratoria: 20,
temperatura: 36.8,
saturacaoOxigenio: 96,
glicemia: 110,
},
exame_fisico: {
correto: {
inspecao:
"Paciente ansioso, diaforético, em desconforto aparente, palidez facial",
palpacao: "Leve sensibilidade precordial, sem alterações estruturais",
ausculta:
"Ritmo cardíaco acelerado (taquicardia), sem sopros ou arritmias evidentes",
percussao: "Normal",
observacoes:
"Sinais sugestivos de desconforto cardíaco, necessário ECG e troponina imediatamente",
regiao: "Precórdio",
achados_positivos: ["Taquicardia", "Diaforese", "Ansiedade"],
achados_negativos: ["Sopros", "Arritmias"],
},
},
exameFisicoCorreto: {
inspecao: "Paciente ansioso, diaforético, em desconforto aparente",
palpacao: "Leve sensibilidade precordial, sem alterações",
ausculta: "Ritmo cardíaco acelerado, sem sopros ou arritmias evidentes",
percussao: "Normal",
observacoes:
"Sinais sugestivos de desconforto cardíaco, necessário ECG e troponina",
},
exame_fisico_interativo: {
geral: {
estado_geral: "Paciente ansioso, diaforético, em aparente sofrimento, posição antálgica.",
consciencia: "Lúcido e orientado em tempo e espaço.",
},
cardiovascular: {
inspecao_precordial: "Sem abaulamentos visíveis, diaforese evidente.",
ausculta_cardiaca: "Bulhas hipofonéticas, ritmo regular, FC 102 bpm, sem sopros audíveis.",
pulsos: "Pulsos presentes e simétricos bilateralmente, amplitude reduzida.",
turgencia_jugular: "Sem turgência jugular aparente.",
edema: "Sem edema de membros inferiores.",
},
},
exames_complementares_disponiveis: [
{
nome: "ECG (Eletrocardiograma)",
descricao: "12 derivações",
resultado: "Elevação do segmento ST em D2, D3, aVF",
valor_referencia: "Segmento ST isoelétrico",
interpretacao: "Infarto Agudo do Miocárdio Inferior",
},
{
nome: "Troponina I",
descricao: "Biomarcador cardíaco",
resultado: "2.8 ng/mL",
valor_referencia: "<0.04 ng/mL",
interpretacao: "Elevada - necrose miocárdica confirmada",
},
],
hipoteses_diagnosticas_esperadas: [
{
diagnostico: "Síndrome Coronariana Aguda (SCA)",
probabilidade: 95,
criterios_minimos: [
"Dor precordial típica",
"Duração >20 minutos",
"Elevação de troponina",
],
},
],
diagnosticos_diferenciais: [
{
diagnostico: "Pericardite Aguda",
criterios_exclusao: ["Segmento ST elevado focal"],
achados_que_descartam: ["Elevação focal de ST"],
},
],
examesIndicados: [
"ECG (eletrocardiograma)",
"Troponina",
"Angiografia coronariana",
],
conduta_esperada: {
imediata: [
"Chamar cardiologia urgentemente",
"ECG nos primeiros 10 minutos",
"Monitorização cardíaca",
"Oxigenioterapia",
"Aspirina 500mg VO",
],
curto_prazo: [
"Cateterismo cardíaco",
"Internação em UCO",
"Betabloqueador",
],
longo_prazo: ["Reabilitação cardíaca", "Modificação de fatores de risco"],
encaminhamentos: ["Cardiologia", "Unidade Coronariana"],
},
condutaCorreta:
"Transferência imediata para unidade coronariana, ECG, aspirina, antitrombótico conforme protocolo",
criterios_de_gravidade: [
{
severidade: "grave",
sinais: [
"Dor precordial intensa",
"Sudorese profusa",
"Falta de ar",
"PAS <90",
],
descricao: "Paciente em risco iminente de morte",
recomendacao: "Transferência urgente para UTI",
},
],
erros_criticos: [
{
erro: "Não realizar ECG nos primeiros 10 minutos",
descricao: "ECG é o teste diagnóstico mais importante para SCA",
penalidade: 2,
evitavel: true,
},
{
erro: "Não encaminhar para cateterismo cardíaco urgente",
descricao: "SCA com elevação de ST requer reperfusão urgente",
penalidade: 2.5,
evitavel: true,
},
],
checklist_osce: [
{
item: "Investigou duração e características da dor",
realizado: false,
critico: true,
},
{
item: "Mediu sinais vitais corretamente",
realizado: false,
critico: true,
},
{
item: "Solicitou ECG nos primeiros 10 minutos",
realizado: false,
critico: true,
},
{
item: "Solicitou troponina",
realizado: false,
critico: true,
},
],
rubrica_correcao: [
{
criterio: "Coleta de Dados Clínicos",
peso: 15,
descricao: "Investigação completa do histórico",
pontuacao_maxima: 15,
},
{
criterio: "Diagnóstico",
peso: 25,
descricao: "Hipótese diagnóstica correta",
pontuacao_maxima: 25,
},
{
criterio: "Conduta e Tratamento",
peso: 20,
descricao: "Plano terapêutico correto",
pontuacao_maxima: 20,
},
],
modelo_soap: {
subjetivo: {
secao: "S",
componentes_obrigatorios: [
"Caracterização da dor (OLDCARTS)",
"Fatores de risco cardiovascular",
],
},
objetivo: {
secao: "O",
componentes_obrigatorios: [
"Sinais vitais completos",
"Exame cardiovascular",
"ECG com interpretação",
"Troponina",
],
},
avaliacao: {
secao: "A",
componentes_obrigatorios: ["Diagnóstico principal", "Diagnósticos diferenciais"],
},
plano: {
secao: "P",
componentes_obrigatorios: [
"Terapia antitrombótica",
"Revascularização miocárdica",
],
},
},
feedback_modelo: {
acertos_esperados: [
"Reconheceu os sinais de alerta",
"Solicitou ECG e troponina",
"Iniciou terapia antitrombótica",
"Encaminhou para cateterismo",
],
erros_comuns: [
"Demora excessiva para ECG",
"Não solicitar troponina",
"Demora para encaminhamento",
],
orientacoes_pedagogicas: [
"SCA é uma emergência - ECG nos primeiros 10 minutos",
"Time is muscle - cada minuto sem reperfusão causa dano miocárdio",
],
},
checklist_oculto_examinador: {
oQueProfessorQuer:
"Um atendimento ágil e seguro: ECG nos primeiros 10 minutos, reconhecimento dos sinais de gravidade, acionamento imediato de cardiologia e transferência para unidade coronariana. Tempo é músculo - cada minuto sem reperfusão causa dano irreversível.",
comunicacao: [
"cumprimentou o paciente e se apresentou",
"confirmou nome e idade",
"explicou a importância de agir rapidamente",
"pediu permissão para examinar",
"demonstrou calma e segurança apesar da urgência",
],
anamnese: [
"investigou características da dor (início, duração, irradiação)",
"investigou fatores de risco (hipertensão, história familiar)",
"investigou sintomas associados (sudorese, dispneia)",
],
exame_fisico: [
"solicitou sinais vitais rapidamente",
"realizou ausculta cardíaca e respiratória",
"avaliou perfusão e estado geral",
],
exames_complementares: [
"solicitou ECG nos primeiros 10 minutos",
"solicitou troponina ou biomarcadores",
"considerou angiografia coronariana",
],
raciocinio: [
"reconheceu apresentação compatível com SCA",
"identificou critério de gravidade (dor intensa, sudorese)",
"formulou hipótese correta",
],
conduta: [
"acionou cardiologia urgentemente",
"preparou transferência para unidade coronariana",
"reconheceu urgência (time is muscle)",
"não atrasou transferência para mais investigações",
],
soap: [
"preencheu adequadamente histórico de dor",
"registrou sinais vitais e achados físicos",
"documentou hipótese de SCA",
"planejou conduta urgente",
],
},
temaOSCE: "Coronariopatias/SCA",
subtopicosOSCE: [
"IAM com supra-ST (IAMCSST)",
"Troponina elevada",
"ECG com elevação de ST",
"Conduta emergencial",
"Tempo é músculo - reperfusão"
],
diagnosticoCorreto: "Síndrome Coronariana Aguda",
esperadosExames: {
ecg: {
indicado: true,
prioridade: "obrigatório",
achadoEsperado: "taquicardia_sinusal_pediatrica",
interpretacaoEsperada: [
"taquicardia sinusal",
"elevação do segmento ST",
"sem sinais de bloqueio"
],
observacoes: "ECG deve ser feito imediatamente (primeiros 10 minutos)"
}
},

  exames_laboratoriais_detalhados: {
    hemograma: {
      solicitadoPor: ["hemograma completo"],
      disponivel: true,
      prioridade: "complementar",
      interpretacao: "Discreta leucocitose de estresse, sem anemia ou plaquetopenia.",
      valores: {
        hemacias: "4,82 mi/mm³",
        hemoglobina: "14,3 g/dL",
        hematocrito: "42,1%",
        vcm: "87,3 fL",
        hcm: "29,7 pg",
        chcm: "34,0 g/dL",
        rdw: "13,1%",
        leucocitos: "11.800/mm³",
        neutrofilos: "72%",
        bastonetes: "4%",
        segmentados: "68%",
        linfocitos: "18%",
        monocitos: "7%",
        eosinofilos: "2%",
        basofilos: "1%",
        plaquetas: "252.000/mm³",
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
      solicitadoPor: ["pcr", "vhs", "procalcitonina", "marcadores inflamatórios"],
      disponivel: true,
      prioridade: "opcional",
      interpretacao: "Marcadores inflamatórios sem elevação relevante.",
      valores: {
        pcr: "0,4 mg/dL",
        vhs: "12 mm/h",
        procalcitonina: "0,05 ng/mL",
      },
    },
    gasometria: {
      solicitadoPor: ["gasometria", "gasometria arterial"],
      disponivel: true,
      prioridade: "opcional",
      interpretacao: "Gasometria sem distúrbios ácido-base relevantes.",
      valores: {
        ph: "7,40",
        paco2: "40 mmHg",
        pao2: "92 mmHg",
        hco3: "24 mEq/L",
        satO2: "97%",
        lactato: "1,2 mmol/L",
        be: "0",
      },
    },
    marcadoresCardiacos: {
      solicitadoPor: ["troponina", "ckmb", "bnp"],
      disponivel: true,
      prioridade: "obrigatorio",
      interpretacao: "Troponina e CK-MB elevadas, compatíveis com necrose miocárdica aguda.",
      valores: {
        troponinaI: "2,8 ng/mL",
        ckmb: "32 ng/mL",
        bnp: "96 pg/mL",
      },
      valoresReferencia: {
        troponinaI: "<0,04 ng/mL",
        ckmb: "<5 ng/mL",
        bnp: "<100 pg/mL",
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
      solicitadoPor: ["coagulograma", "tp", "inr", "ttpa", "d-dímero"],
      disponivel: true,
      prioridade: "importante",
      interpretacao: "Coagulograma basal sem contraindicação laboratorial evidente para estratégia antitrombótica.",
      valores: {
        tp: "12,4 s",
        inr: "1,0",
        ttpa: "31 s",
        fibrinogenio: "320 mg/dL",
        dDimero: "620 ng/mL",
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
      pressaoArterial: "160/95 mmHg",
      frequenciaCardiaca: 102,
      frequenciaRespiratoria: 20,
      temperatura: 36.8,
      saturacaoOxigenio: 96,
      glicemia: 110,
      interpretacao: "Risco cardiovascular; monitorar dor, perfusão, ECG, troponina e estabilidade hemodinâmica.",
    },
    evolucao: {
      aposCondutaCorreta_30min: {
        condicoesParaAtivar: ["Monitorização", "ECG priorizado", "Exames cardíacos", "Conduta antitrombótica/reperfusão quando indicada", "Acionamento de especialista se necessário"],
        pressaoArterial: "130/82 mmHg",
        frequenciaCardiaca: 88,
        frequenciaRespiratoria: 18,
        saturacaoOxigenio: 96,
        interpretacao: "Paciente com fluxo de cuidado ativado e maior estabilidade clínica.",
      },
      seCondutaInadequadaOuAtrasada: {
        pressaoArterial: "95/65 mmHg",
        frequenciaCardiaca: 118,
        frequenciaRespiratoria: 24,
        saturacaoOxigenio: 92,
        interpretacao: "Persistência ou piora por atraso no reconhecimento e manejo do risco cardiovascular.",
      },
    },
    criteriosParaAltaOuObservacao: {
      altaSeguraSe: ["Diagnóstico grave excluído", "Dor controlada", "ECG/labs interpretados", "Baixo risco documentado", "Plano de seguimento"],
      manterObservacaoOuInternarSe: ["Dor persistente", "ECG alterado", "troponina positiva", "instabilidade", "alto risco clínico"],
    },
  },

  exames: {
    complementaresDisponiveisOriginais: [
{
nome: "ECG (Eletrocardiograma)",
descricao: "12 derivações",
resultado: "Elevação do segmento ST em D2, D3, aVF",
valor_referencia: "Segmento ST isoelétrico",
interpretacao: "Infarto Agudo do Miocárdio Inferior",
},
{
nome: "Troponina I",
descricao: "Biomarcador cardíaco",
resultado: "2.8 ng/mL",
valor_referencia: "<0.04 ng/mL",
interpretacao: "Elevada - necrose miocárdica confirmada",
},
],
    laboratoriais: {
    hemograma: {
      solicitadoPor: ["hemograma completo"],
      disponivel: true,
      prioridade: "complementar",
      interpretacao: "Discreta leucocitose de estresse, sem anemia ou plaquetopenia.",
      valores: {
        hemacias: "4,82 mi/mm³",
        hemoglobina: "14,3 g/dL",
        hematocrito: "42,1%",
        vcm: "87,3 fL",
        hcm: "29,7 pg",
        chcm: "34,0 g/dL",
        rdw: "13,1%",
        leucocitos: "11.800/mm³",
        neutrofilos: "72%",
        bastonetes: "4%",
        segmentados: "68%",
        linfocitos: "18%",
        monocitos: "7%",
        eosinofilos: "2%",
        basofilos: "1%",
        plaquetas: "252.000/mm³",
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
      solicitadoPor: ["pcr", "vhs", "procalcitonina", "marcadores inflamatórios"],
      disponivel: true,
      prioridade: "opcional",
      interpretacao: "Marcadores inflamatórios sem elevação relevante.",
      valores: {
        pcr: "0,4 mg/dL",
        vhs: "12 mm/h",
        procalcitonina: "0,05 ng/mL",
      },
    },
    gasometria: {
      solicitadoPor: ["gasometria", "gasometria arterial"],
      disponivel: true,
      prioridade: "opcional",
      interpretacao: "Gasometria sem distúrbios ácido-base relevantes.",
      valores: {
        ph: "7,40",
        paco2: "40 mmHg",
        pao2: "92 mmHg",
        hco3: "24 mEq/L",
        satO2: "97%",
        lactato: "1,2 mmol/L",
        be: "0",
      },
    },
    marcadoresCardiacos: {
      solicitadoPor: ["troponina", "ckmb", "bnp"],
      disponivel: true,
      prioridade: "obrigatorio",
      interpretacao: "Troponina e CK-MB elevadas, compatíveis com necrose miocárdica aguda.",
      valores: {
        troponinaI: "2,8 ng/mL",
        ckmb: "32 ng/mL",
        bnp: "96 pg/mL",
      },
      valoresReferencia: {
        troponinaI: "<0,04 ng/mL",
        ckmb: "<5 ng/mL",
        bnp: "<100 pg/mL",
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
      solicitadoPor: ["coagulograma", "tp", "inr", "ttpa", "d-dímero"],
      disponivel: true,
      prioridade: "importante",
      interpretacao: "Coagulograma basal sem contraindicação laboratorial evidente para estratégia antitrombótica.",
      valores: {
        tp: "12,4 s",
        inr: "1,0",
        ttpa: "31 s",
        fibrinogenio: "320 mg/dL",
        dDimero: "620 ng/mL",
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
