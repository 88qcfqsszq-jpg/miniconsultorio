/**
 * MEDIX PATIENT V3 — Caso Ouro (Fase 2B): Dor Torácica / Síndrome Coronariana
 * Aguda (SCA — IAMCSST), representação CasoV3 completa e nativa.
 *
 * Fonte primária ÚNICA: data/casos-v2/adultos/cardiovascular/001-dor-toracica-
 * sindrome-coronariana-aguda.ts (Caso 1 legado). Nenhum outro caso foi usado
 * para preencher lacunas. Nenhum dado clínico ausente na fonte foi inventado —
 * onde a fonte não sustentava um valor (caráter da dor, fatores de melhora/
 * piora, dose/horário/adesão do medicamento, hábitos, objetivo da consulta),
 * o dado simplesmente não foi criado.
 *
 * Este arquivo é autoral e estático — não importa nem espalha o objeto legado
 * em runtime. É uma representação própria e explícita do mesmo caso clínico,
 * coexistindo temporariamente com o Caso 1 legado (que continua intocado e
 * continua servindo todos os módulos atuais: exame físico, sinais vitais,
 * exames, ECG, feedback, rubricas, interface do caso).
 *
 * Normalizações registradas (decisões já aprovadas nas Fases 2A/2A.1/2A.2):
 * - diagnosticosDiferenciais NÃO repete "Infarto Agudo do Miocárdio (IAM)"
 *   como diferencial, pois o diagnóstico principal já é IAMCSST (inconsistência
 *   da fonte, normalizada por decisão humana).
 * - sinaisVitais usa sinaisVitaisCorretos (inclui glicemia) como fonte canônica.
 * - exames preserva os 9 painéis de exames_laboratoriais_detalhados; a
 *   Troponina I aparece SOMENTE dentro do painel "Marcadores cardíacos"
 *   (nunca como entrada isolada), evitando duplicação com
 *   exames_complementares_disponiveis.
 * - ecg ignora completamente o resíduo "taquicardia_sinusal_pediatrica" de
 *   esperadosExames.ecg.achadoEsperado (incompatível — resíduo pediátrico
 *   num caso adulto).
 * - checklist usa checklist_oculto_examinador (25 itens, 7 categorias) como
 *   fonte canônica; os 4 itens de checklist_osce são semanticamente
 *   duplicados (mesmos conceitos, redação diferente) e NÃO foram incluídos
 *   como entradas novas — seus flags `critico: true` foram mesclados aos
 *   itens correspondentes de checklist_oculto_examinador (ver relatório da
 *   entrega para o mapeamento exato).
 * - feedback.orientacoesPedagogicas NÃO inclui checklist_oculto_examinador.
 *   oQueProfessorQuer, por duplicar substancialmente o conteúdo já presente
 *   em feedback_modelo.orientacoes_pedagogicas (ECG em 10 min + "tempo é
 *   músculo").
 * - complicacoes é omitido (sem fonte sustentável); criterios_de_gravidade do
 *   legado NÃO foi transformado em complicações.
 */

import type { CasoV3 } from "@/lib/patient-v3/casoV3.types";

export const casoSCAOuroV3 = {
  schemaVersion: "3.2",

  metadata: {
    id: "1",
    titulo: "Dor Torácica - Síndrome Coronariana Aguda",
    especialidade: "Cardiovascular",
    tema: "Dor Torácica",
    nivel: "intermediario",
    tipoEstacao: "integrada",
    duracaoMinutos: 15,
    versaoCaso: "1.0.0",
  },

  // ==========================================================================
  // ZONA RESERVADA — ClinicalTruth (nunca ao paciente)
  // ==========================================================================
  clinicalTruth: {
    diagnosticoPrincipal: "Síndrome Coronariana Aguda (SCA) - IAMCSST",
    diagnosticosDiferenciais: [
      "Angina Instável",
      "Pericardite Aguda",
      "Embolia Pulmonar",
      "Dissecção de Aorta",
    ],
    cronologiaVerdadeira:
      "Dor torácica de início súbito, cerca de 2 horas antes do atendimento, em repouso, enquanto o paciente assistia à televisão; sudorese e dispneia presentes desde o início do quadro.",

    exameFisicoVerdadeiro: {
      // Resumo achatado — fonte: exame_fisico.correto (versão mais completa
      // compatível com o formato achatado, escolhida na Fase 2A/2A.1).
      inspecao: "Paciente ansioso, diaforético, em desconforto aparente, palidez facial",
      palpacao: "Leve sensibilidade precordial, sem alterações estruturais",
      ausculta: "Ritmo cardíaco acelerado (taquicardia), sem sopros ou arritmias evidentes",
      percussao: "Normal",
      observacoes: "Sinais sugestivos de desconforto cardíaco, necessário ECG e troponina imediatamente",
      regiao: "Precórdio",
      achadosPositivos: ["Taquicardia", "Diaforese", "Ansiedade"],
      achadosNegativos: ["Sopros", "Arritmias"],
      // Granularidade adicional real — fonte: exame_fisico_interativo (somente
      // os dois sistemas com dado real no Caso 1; nenhum sistema vazio criado).
      porSistema: [
        {
          sistema: "Geral",
          achados: [
            { nome: "estado_geral", valor: "Paciente ansioso, diaforético, em aparente sofrimento, posição antálgica." },
            { nome: "consciencia", valor: "Lúcido e orientado em tempo e espaço." },
          ],
        },
        {
          sistema: "Cardiovascular",
          achados: [
            { nome: "inspecao_precordial", valor: "Sem abaulamentos visíveis, diaforese evidente." },
            { nome: "ausculta_cardiaca", valor: "Bulhas hipofonéticas, ritmo regular, FC 102 bpm, sem sopros audíveis." },
            { nome: "pulsos", valor: "Pulsos presentes e simétricos bilateralmente, amplitude reduzida." },
            { nome: "turgencia_jugular", valor: "Sem turgência jugular aparente." },
            { nome: "edema", valor: "Sem edema de membros inferiores." },
          ],
        },
      ],
    },

    // Fonte canônica: sinaisVitaisCorretos (inclui glicemia; valores idênticos
    // a sinais_vitais.corretos e a sinaisVitais.entrada, todos equivalentes).
    sinaisVitais: {
      pressaoArterial: "160/95 mmHg",
      frequenciaCardiaca: 102,
      frequenciaRespiratoria: 20,
      temperatura: 36.8,
      saturacaoOxigenio: 96,
      glicemia: 110,
    },

    // 9 painéis reais de exames_laboratoriais_detalhados. Troponina I aparece
    // SOMENTE no painel "Marcadores cardíacos" (nunca isolada).
    exames: [
      {
        nome: "Hemograma completo",
        interpretacao: "Discreta leucocitose de estresse, sem anemia ou plaquetopenia.",
        itens: [
          { nome: "hemacias", valor: "4,82 mi/mm³" },
          { nome: "hemoglobina", valor: "14,3 g/dL" },
          { nome: "hematocrito", valor: "42,1%" },
          { nome: "vcm", valor: "87,3 fL" },
          { nome: "hcm", valor: "29,7 pg" },
          { nome: "chcm", valor: "34,0 g/dL" },
          { nome: "rdw", valor: "13,1%" },
          { nome: "leucocitos", valor: "11.800/mm³" },
          { nome: "neutrofilos", valor: "72%" },
          { nome: "bastonetes", valor: "4%" },
          { nome: "segmentados", valor: "68%" },
          { nome: "linfocitos", valor: "18%" },
          { nome: "monocitos", valor: "7%" },
          { nome: "eosinofilos", valor: "2%" },
          { nome: "basofilos", valor: "1%" },
          { nome: "plaquetas", valor: "252.000/mm³" },
        ],
      },
      {
        nome: "Função renal",
        interpretacao: "Função renal preservada.",
        itens: [
          { nome: "ureia", valor: "32 mg/dL" },
          { nome: "creatinina", valor: "0,9 mg/dL" },
          { nome: "etfg", valor: "> 90 mL/min/1,73m²" },
        ],
      },
      {
        nome: "Eletrólitos",
        interpretacao: "Eletrólitos sem alterações relevantes.",
        itens: [
          { nome: "sodio", valor: "139 mEq/L" },
          { nome: "potassio", valor: "4,2 mEq/L" },
          { nome: "cloro", valor: "102 mEq/L" },
          { nome: "magnesio", valor: "2,0 mg/dL" },
          { nome: "calcio", valor: "9,2 mg/dL" },
        ],
      },
      {
        nome: "Marcadores inflamatórios",
        interpretacao: "Marcadores inflamatórios sem elevação relevante.",
        itens: [
          { nome: "pcr", valor: "0,4 mg/dL" },
          { nome: "vhs", valor: "12 mm/h" },
          { nome: "procalcitonina", valor: "0,05 ng/mL" },
        ],
      },
      {
        nome: "Gasometria arterial",
        interpretacao: "Gasometria sem distúrbios ácido-base relevantes.",
        itens: [
          { nome: "ph", valor: "7,40" },
          { nome: "paco2", valor: "40 mmHg" },
          { nome: "pao2", valor: "92 mmHg" },
          { nome: "hco3", valor: "24 mEq/L" },
          { nome: "satO2", valor: "97%" },
          { nome: "lactato", valor: "1,2 mmol/L" },
          { nome: "be", valor: "0" },
        ],
      },
      {
        nome: "Marcadores cardíacos",
        interpretacao: "Troponina e CK-MB elevadas, compatíveis com necrose miocárdica aguda.",
        itens: [
          { nome: "troponinaI", valor: "2,8 ng/mL", referencia: "<0,04 ng/mL" },
          { nome: "ckmb", valor: "32 ng/mL", referencia: "<5 ng/mL" },
          { nome: "bnp", valor: "96 pg/mL", referencia: "<100 pg/mL" },
        ],
      },
      {
        nome: "Função hepática",
        interpretacao: "Função hepática sem alterações relevantes.",
        itens: [
          { nome: "tgo", valor: "24 U/L" },
          { nome: "tgp", valor: "28 U/L" },
          { nome: "fa", valor: "88 U/L" },
          { nome: "ggt", valor: "34 U/L" },
          { nome: "bilirrubinaTotal", valor: "0,8 mg/dL" },
          { nome: "bilirrubinaDireta", valor: "0,2 mg/dL" },
          { nome: "bilirrubinaIndireta", valor: "0,6 mg/dL" },
          { nome: "albumina", valor: "4,1 g/dL" },
        ],
      },
      {
        nome: "Coagulograma",
        interpretacao: "Coagulograma basal sem contraindicação laboratorial evidente para estratégia antitrombótica.",
        itens: [
          { nome: "tp", valor: "12,4 s" },
          { nome: "inr", valor: "1,0" },
          { nome: "ttpa", valor: "31 s" },
          { nome: "fibrinogenio", valor: "320 mg/dL" },
          { nome: "dDimero", valor: "620 ng/mL" },
        ],
      },
      {
        nome: "Urina tipo 1",
        interpretacao: "Urina tipo 1 sem alterações relevantes.",
        itens: [
          { nome: "densidade", valor: "1,020" },
          { nome: "ph", valor: "6,0" },
          { nome: "proteina", valor: "Ausente" },
          { nome: "glicose", valor: "Ausente" },
          { nome: "cetonas", valor: "Ausentes" },
          { nome: "sangueHemoglobina", valor: "Ausente" },
          { nome: "nitrito", valor: "Negativo" },
          { nome: "esteraseLeucocitaria", valor: "Negativa" },
          { nome: "leucocitos", valor: "< 5 p/campo" },
          { nome: "hemacias", valor: "< 3 p/campo" },
          { nome: "bacterias", valor: "Raras" },
          { nome: "cilindros", valor: "Ausentes" },
        ],
      },
    ],

    // Fonte: exames_complementares_disponiveis[0] (ECG). Resíduo pediátrico de
    // esperadosExames.ecg.achadoEsperado ("taquicardia_sinusal_pediatrica")
    // ignorado por completo — incompatível com um caso adulto.
    ecg: {
      padrao: "Elevação do segmento ST",
      derivacoes: "D2, D3, aVF",
      interpretacao: "Infarto Agudo do Miocárdio Inferior",
    },

    evolucao: {
      seCondutaCorreta:
        "Após ~30 minutos com monitorização, ECG priorizado, exames cardíacos e conduta antitrombótica/reperfusão quando indicada: PA 130/82 mmHg, FC 88 bpm, FR 18 irpm, SatO2 96% — maior estabilidade clínica.",
      seCondutaInadequadaOuAtrasada:
        "Persistência ou piora por atraso no reconhecimento/manejo do risco cardiovascular: PA 95/65 mmHg, FC 118 bpm, FR 24 irpm, SatO2 92%.",
    },

    // complicacoes: omitido — sem fonte sustentável (ver Fase 2A/2A.1).

    tratamentoCorreto: {
      imediata: [
        "Chamar cardiologia urgentemente",
        "ECG nos primeiros 10 minutos",
        "Monitorização cardíaca",
        "Oxigenioterapia",
        "Aspirina 500mg VO",
      ],
      curtoPrazo: ["Cateterismo cardíaco", "Internação em UCO", "Betabloqueador"],
      longoPrazo: ["Reabilitação cardíaca", "Modificação de fatores de risco"],
      encaminhamentos: ["Cardiologia", "Unidade Coronariana"],
    },
  },

  // ==========================================================================
  // ZONA DO PACIENTE — PatientKnowledge (15 fatos aprovados)
  // ==========================================================================
  patientKnowledge: {
    identidade: { nome: "Carlos Silva", idade: 52, sexo: "M" },
    interlocutor: "paciente",
    fatos: [
      { id: "f_queixa_dor", dominio: "historiaAtual", valor: "Dor no peito, iniciada há aproximadamente 2 horas." },
      { id: "f_contexto_inicio", dominio: "historiaAtual", valor: "Início súbito, em repouso, enquanto assistia à televisão." },
      { id: "f_dor_localizacao", dominio: "sintoma", valor: "Dor localizada no centro do peito (região retroesternal)." },
      { id: "f_dor_irradiacao", dominio: "sintoma", valor: "A dor às vezes irradia para o braço esquerdo." },
      { id: "f_dor_intensidade", dominio: "sintoma", valor: "Intensidade da dor entre 8 e 9 em uma escala de 0 a 10." },
      { id: "f_sudorese", dominio: "sintoma", valor: "Presença de sudorese (suor intenso) e tremor." },
      { id: "f_dispneia", dominio: "sintoma", valor: "Falta de ar (dispneia)." },
      { id: "f_tontura", dominio: "sintoma", valor: "Tontura leve." },
      { id: "f_nausea", dominio: "sintoma", valor: "Náusea leve (enjoo)." },
      { id: "f_antecedente_hipertensao", dominio: "antecedente", valor: "Tem hipertensão arterial (pressão alta)." },
      { id: "f_historia_familiar_infarto", dominio: "familia", valor: "O pai faleceu de infarto." },
      { id: "f_medicamento_losartana", dominio: "medicamento", valor: "Usa Losartana 50 mg para a pressão." },
      { id: "f_alergias", dominio: "alergia", valor: "Nega alergias conhecidas." },
      { id: "f_contexto_profissao", dominio: "contextoSocial", valor: "Trabalha como engenheiro." },
      { id: "f_contexto_estado_civil", dominio: "contextoSocial", valor: "É casado." },
    ],
  },

  // ==========================================================================
  // ZONA DO PACIENTE — DisclosurePolicy (15 regras, uma por fato)
  // ==========================================================================
  disclosurePolicy: {
    aberturaFactIds: ["f_queixa_dor"],
    regras: [
      { factId: "f_queixa_dor", politica: "espontanea" },
      { factId: "f_contexto_inicio", politica: "perguntaAberta" },
      { factId: "f_dor_localizacao", politica: "perguntaAberta" },
      { factId: "f_dor_irradiacao", politica: "perguntaDireta" },
      { factId: "f_dor_intensidade", politica: "perguntaDireta" },
      { factId: "f_sudorese", politica: "perguntaAberta" },
      { factId: "f_dispneia", politica: "perguntaAberta" },
      { factId: "f_tontura", politica: "perguntaDireta" },
      { factId: "f_nausea", politica: "perguntaDireta" },
      { factId: "f_antecedente_hipertensao", politica: "perguntaDireta" },
      { factId: "f_historia_familiar_infarto", politica: "perguntaDireta" },
      { factId: "f_medicamento_losartana", politica: "perguntaDireta" },
      { factId: "f_alergias", politica: "perguntaDireta" },
      { factId: "f_contexto_profissao", politica: "perguntaDireta" },
      { factId: "f_contexto_estado_civil", politica: "perguntaDireta" },
    ],
  },

  // ==========================================================================
  // ZONA DO PACIENTE — Persona (imutável)
  // ==========================================================================
  persona: {
    expansividade: 4,
    objetividade: 7,
    letramentoSaude: "medio",
  },

  // ==========================================================================
  // ZONA DO PACIENTE — SessionStateInicial
  // ==========================================================================
  sessionStateInicial: {
    ansiedade: 8,
    medo: 8,
    confianca: 4,
    cooperacao: 7,
    frustracao: 2,
  },

  // ==========================================================================
  // ZONA RESERVADA — Examiner (nunca ao paciente)
  // ==========================================================================
  examiner: {
    // Fonte: rubrica_correcao (3 itens, valores preservados sem recálculo).
    rubricas: [
      { criterio: "Coleta de Dados Clínicos", peso: 15, descricao: "Investigação completa do histórico", pontuacaoMaxima: 15 },
      { criterio: "Diagnóstico", peso: 25, descricao: "Hipótese diagnóstica correta", pontuacaoMaxima: 25 },
      { criterio: "Conduta e Tratamento", peso: 20, descricao: "Plano terapêutico correto", pontuacaoMaxima: 20 },
    ],

    // Fonte canônica: checklist_oculto_examinador (25 itens, 7 categorias).
    // Os 4 itens de checklist_osce são semanticamente duplicados e NÃO foram
    // incluídos como entradas novas — seus flags `critico: true` foram
    // mesclados aos itens correspondentes abaixo (marcados com comentário).
    checklist: [
      { item: "Cumprimentou o paciente e se apresentou", categoria: "Comunicação" },
      { item: "Confirmou nome e idade", categoria: "Comunicação" },
      { item: "Explicou a importância de agir rapidamente", categoria: "Comunicação" },
      { item: "Pediu permissão para examinar", categoria: "Comunicação" },
      { item: "Demonstrou calma e segurança apesar da urgência", categoria: "Comunicação" },

      // critico:true mesclado de checklist_osce[0] "Investigou duração e características da dor"
      { item: "Investigou características da dor (início, duração, irradiação)", categoria: "Anamnese", critico: true },
      { item: "Investigou fatores de risco (hipertensão, história familiar)", categoria: "Anamnese" },
      { item: "Investigou sintomas associados (sudorese, dispneia)", categoria: "Anamnese" },

      // critico:true mesclado de checklist_osce[1] "Mediu sinais vitais corretamente"
      { item: "Solicitou sinais vitais rapidamente", categoria: "Exame físico", critico: true },
      { item: "Realizou ausculta cardíaca e respiratória", categoria: "Exame físico" },
      { item: "Avaliou perfusão e estado geral", categoria: "Exame físico" },

      // critico:true mesclado de checklist_osce[2] "Solicitou ECG nos primeiros 10 minutos"
      { item: "Solicitou ECG nos primeiros 10 minutos", categoria: "Exames complementares", critico: true },
      // critico:true mesclado de checklist_osce[3] "Solicitou troponina"
      { item: "Solicitou troponina ou biomarcadores", categoria: "Exames complementares", critico: true },
      { item: "Considerou angiografia coronariana", categoria: "Exames complementares" },

      { item: "Reconheceu apresentação compatível com SCA", categoria: "Raciocínio" },
      { item: "Identificou critério de gravidade (dor intensa, sudorese)", categoria: "Raciocínio" },
      { item: "Formulou hipótese correta", categoria: "Raciocínio" },

      { item: "Acionou cardiologia urgentemente", categoria: "Conduta" },
      { item: "Preparou transferência para unidade coronariana", categoria: "Conduta" },
      { item: "Reconheceu urgência (time is muscle)", categoria: "Conduta" },
      { item: "Não atrasou transferência para mais investigações", categoria: "Conduta" },

      { item: "Preencheu adequadamente histórico de dor", categoria: "SOAP" },
      { item: "Registrou sinais vitais e achados físicos", categoria: "SOAP" },
      { item: "Documentou hipótese de SCA", categoria: "SOAP" },
      { item: "Planejou conduta urgente", categoria: "SOAP" },
    ],

    // Fonte: erros_criticos (2 itens).
    errosCriticos: [
      { erro: "Não realizar ECG nos primeiros 10 minutos", descricao: "ECG é o teste diagnóstico mais importante para SCA", penalidade: 2, evitavel: true },
      { erro: "Não encaminhar para cateterismo cardíaco urgente", descricao: "SCA com elevação de ST requer reperfusão urgente", penalidade: 2.5, evitavel: true },
    ],

    feedback: {
      // Fonte: feedback_modelo.
      acertosEsperados: [
        "Reconheceu os sinais de alerta",
        "Solicitou ECG e troponina",
        "Iniciou terapia antitrombótica",
        "Encaminhou para cateterismo",
      ],
      errosComuns: [
        "Demora excessiva para ECG",
        "Não solicitar troponina",
        "Demora para encaminhamento",
      ],
      orientacoesPedagogicas: [
        "SCA é uma emergência - ECG nos primeiros 10 minutos",
        "Time is muscle - cada minuto sem reperfusão causa dano miocárdio",
      ],

      // Fonte: feedbackDetalhado.escala.
      escalaAvaliacao: { total: 20, minimoAprovacao: 17 },

      // Fonte: feedbackDetalhado.dominios (6 domínios, soma = 20 = escala.total).
      dominiosPonderados: [
        {
          nome: "Comunicação e postura",
          pontos: 2,
          criterios: [
            { item: "Apresentou-se, confirmou paciente e manteve postura segura", pontos: 0.5 },
            { item: "Explicou avaliação e conduta em linguagem acessível", pontos: 0.5 },
            { item: "Priorizou segurança sem atrasar medidas urgentes", pontos: 0.5 },
            { item: "Reavaliou e comunicou evolução/próximos passos", pontos: 0.5 },
          ],
        },
        {
          nome: "Anamnese dirigida",
          pontos: 3,
          criterios: [
            { item: "Caracterizou queixa principal, início, duração e progressão", pontos: 0.7 },
            { item: "Investigou sintomas associados relevantes", pontos: 0.7 },
            { item: "Investigou antecedentes, medicações, alergias e fatores de risco", pontos: 0.7 },
            { item: "Investigou sinais de gravidade e diferenciais perigosos", pontos: 0.9 },
          ],
        },
        {
          nome: "Exame físico e gravidade",
          pontos: 4,
          criterios: [
            { item: "Solicitou sinais vitais completos e valorizou alterações", pontos: 0.9, critico: true },
            { item: "Realizou exame físico direcionado ao sistema acometido", pontos: 1.0 },
            { item: "Identificou achados positivos e negativos relevantes", pontos: 0.8 },
            { item: "Classificou gravidade e risco de deterioração", pontos: 1.0, critico: true },
            { item: "Reavaliou após intervenção quando aplicável", pontos: 0.3 },
          ],
        },
        {
          nome: "Exames complementares",
          pontos: 2,
          criterios: [
            { item: "Solicitou exames essenciais sem atrasar tratamento urgente", pontos: 0.7 },
            { item: "Interpretou labs/imagem de forma coerente", pontos: 0.7 },
            { item: "Usou exames para confirmar hipótese e excluir diferenciais graves", pontos: 0.4 },
            { item: "Evitou priorizar exames desnecessários em instabilidade", pontos: 0.2 },
          ],
        },
        {
          nome: "Raciocínio diagnóstico",
          pontos: 3,
          criterios: [
            { item: "Formulou diagnóstico principal correto", pontos: 1.0, critico: true },
            { item: "Justificou com história, exame físico e exames", pontos: 0.8 },
            { item: "Considerou diferenciais perigosos", pontos: 0.7 },
            { item: "Reconheceu gravidade e necessidade de escalonamento", pontos: 0.5 },
          ],
        },
        {
          nome: "Conduta, reavaliação e destino",
          pontos: 6,
          criterios: [
            { item: "Iniciou conduta imediata apropriada", pontos: 1.4, critico: true },
            { item: "Indicou tratamento específico correto", pontos: 1.2, critico: true },
            { item: "Monitorizou resposta clínica e sinais vitais", pontos: 0.9 },
            { item: "Escalonou cuidado se resposta inadequada", pontos: 0.9 },
            { item: "Definiu destino seguro", pontos: 0.8 },
            { item: "Orientou retorno/seguimento/prevenção", pontos: 0.8 },
          ],
        },
      ],

      // Fonte: feedbackDetalhado.penalidadesAutomaticas (conceito distinto de
      // errosCriticos — não fundido nesse array).
      penalidadesAutomaticas: [
        { condicao: "Não reconhecer sinal de gravidade", penalidade: 2, justificativa: "Sinais de gravidade mudam prioridade e destino." },
        { condicao: "Atrasar conduta urgente para aguardar exame não essencial", penalidade: 2, justificativa: "Estabilização não deve ser atrasada." },
        { condicao: "Dar alta sem reavaliação objetiva", penalidade: 3, justificativa: "Alta insegura expõe a risco de deterioração." },
      ],

      // Fonte: modelo_soap (estruturado; não achatado dentro do checklist).
      modeloSoap: {
        subjetivo: { componentesObrigatorios: ["Caracterização da dor (OLDCARTS)", "Fatores de risco cardiovascular"] },
        objetivo: { componentesObrigatorios: ["Sinais vitais completos", "Exame cardiovascular", "ECG com interpretação", "Troponina"] },
        avaliacao: { componentesObrigatorios: ["Diagnóstico principal", "Diagnósticos diferenciais"] },
        plano: { componentesObrigatorios: ["Terapia antitrombótica", "Revascularização miocárdica"] },
      },
    },

    // Normalização aprovada (síntese autoral, não cópia literal de nenhum campo).
    criteriosAprovacao: [
      "Nota mínima de 17 em 20 pontos.",
      "Reconhecimento da gravidade do quadro.",
      "Diagnóstico principal correto.",
      "Conduta imediata apropriada e tratamento específico correto.",
    ],
  },
} satisfies CasoV3;
