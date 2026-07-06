// ============================================================================
// Clinical NLP Dictionary — dicionário global de conceitos clínicos
// ----------------------------------------------------------------------------
// ISOLADO: este pacote NÃO está integrado ao HealthBench/rubricas/feedback.
// Serve para reconhecer linguagem natural do aluno (sinônimos, abreviações,
// termos informais, erros de digitação) e mapeá-la a conceitos clínicos
// reutilizáveis por todos os casos. A integração ao pipeline será decidida
// depois, após revisão humana.
// ============================================================================

export type ClinicalNlpCategory =
  | "comunicacao"
  | "anamnese"
  | "exame_fisico"
  | "exames"
  | "raciocinio"
  | "conduta"
  | "seguranca";

export type ClinicalNlpConcept = {
  conceptId: string;
  label: string;
  category: ClinicalNlpCategory;
  synonyms: string[];
  typoVariants?: string[];
  regex?: string[];
  negativePatterns?: string[];
};

export const CLINICAL_NLP_DICTIONARY: ClinicalNlpConcept[] = [
  // -------------------------------------------------------------------------
  // COMUNICAÇÃO (TAREFA 2)
  // -------------------------------------------------------------------------
  {
    conceptId: "apresentacao_medico",
    label: "Apresentação do médico",
    category: "comunicacao",
    synonyms: [
      "me chamo doutor", "sou o doutor", "sou a doutora", "sou dr", "sou dra",
      "eu sou medico", "eu sou medica", "vou te atender", "serei seu medico",
      "serei sua medica", "meu nome e", "pode me chamar de doutor", "aqui e o medico",
    ],
    typoVariants: ["dr", "dra", "doto", "douto", "doutora", "medico", "medica"],
  },
  {
    conceptId: "confirmacao_identidade",
    label: "Confirmação de identidade",
    category: "comunicacao",
    synonyms: [
      "o senhor e", "a senhora e", "seu nome e", "voce se chama", "confirma seu nome",
      "posso confirmar seu nome", "data de nascimento", "idade do senhor", "idade da senhora",
    ],
    regex: ["\\be (roberto|maria|dona|seu) "],
  },
  {
    conceptId: "explicacao_linguagem_acessivel",
    label: "Explicação em linguagem acessível",
    category: "comunicacao",
    synonyms: [
      "vou explicar de forma simples", "isso pode significar", "em palavras simples",
      "de forma mais clara", "o que isso quer dizer", "vou te explicar",
      "isso pode estar relacionado", "precisamos investigar melhor",
      "pode ser uma alteracao", "ainda precisamos confirmar",
    ],
  },
  {
    conceptId: "acolhimento_empatia",
    label: "Acolhimento e empatia",
    category: "comunicacao",
    synonyms: [
      "entendo sua preocupacao", "imagino que esteja assustado", "vamos cuidar disso",
      "voce fez certo em procurar atendimento", "vamos investigar com calma",
      "estou aqui para ajudar", "compreendo", "isso deve estar incomodando",
      "vamos resolver da melhor forma",
    ],
  },
  {
    conceptId: "consentimento_exame",
    label: "Consentimento para exame",
    category: "comunicacao",
    synonyms: [
      "posso examinar", "posso fazer o exame fisico", "vou te examinar tudo bem",
      "com sua permissao", "posso auscultar", "posso palpar", "posso medir seus sinais",
      "posso avaliar",
    ],
  },

  // -------------------------------------------------------------------------
  // SINTOMAS / ANAMNESE (TAREFA 3)
  // -------------------------------------------------------------------------
  {
    conceptId: "tosse_cronica",
    label: "Tosse crônica (> 3 semanas)",
    category: "anamnese",
    synonyms: [
      "tosse ha mais de 3 semanas", "tosse faz semanas", "tosse persistente",
      "tosse que nao melhora", "tosse ha muito tempo", "tosse prolongada",
      "tosse por mais de 15 dias", "tosse ha 21 dias", "tosse cronica",
    ],
    regex: ["tosse h[áa]? ?\\d+ ?(dias|semanas)", "tosse de \\d+ ?(dias|semanas)"],
  },
  {
    conceptId: "febre_vespertina_noturna",
    label: "Febre vespertina/noturna",
    category: "anamnese",
    synonyms: [
      "febre a noite", "febre de noite", "febre no fim do dia", "febre no final do dia",
      "febre vespertina", "febre noturna", "febre no periodo da tarde", "febre ao entardecer",
      "febricula a noite", "febre a tarde",
    ],
    regex: ["febre (a|de|no|ao) ?(noite|tarde|entardecer|fim|final)"],
  },
  {
    conceptId: "sudorese_noturna",
    label: "Sudorese noturna",
    category: "anamnese",
    synonyms: [
      "suor a noite", "suadeira a noite", "acordo suado", "acorda suado",
      "molha a roupa de suor", "suor noturno", "transpiracao noturna", "suores noturnos",
      "sudorese noturna", "sudorese a noite", "suor durante a noite", "transpira muito a noite",
      "transpiracao a noite", "acorda encharcado",
    ],
  },
  {
    conceptId: "perda_peso",
    label: "Perda de peso",
    category: "anamnese",
    synonyms: [
      "perdeu peso", "emagreceu", "emagrecimento", "emagrecendo", "perda ponderal",
      "roupas folgadas", "esta mais magro", "perdeu alguns quilos",
      "perda de peso sem querer", "emagreceu sem dieta",
      "perda de peso", "perdi peso", "perdendo peso", "emagreci", "baixou o peso",
      "perdeu quilos", "perdi alguns quilos",
    ],
  },
  {
    conceptId: "hemoptise",
    label: "Hemoptise",
    category: "anamnese",
    synonyms: [
      "sangue no escarro", "escarro com sangue", "tosse com sangue", "catarro com sangue",
      "cuspiu sangue", "eliminou sangue pela tosse", "raias de sangue", "sangue ao tossir",
    ],
  },
  {
    conceptId: "dispneia",
    label: "Dispneia",
    category: "anamnese",
    synonyms: [
      "falta de ar", "cansaco para respirar", "dificuldade para respirar",
      "respiracao ruim", "ar curto", "folego curto", "cansado para respirar",
      "sufocando", "sem ar",
    ],
  },
  {
    conceptId: "ortopneia",
    label: "Ortopneia",
    category: "anamnese",
    synonyms: [
      "falta de ar ao deitar", "piora deitado", "precisa dormir sentado",
      "usa travesseiros para dormir", "dorme com varios travesseiros", "melhora sentado",
      "nao consegue deitar", "falta de ar na cama", "travesseiros para dormir",
      "com varios travesseiros", "com tres travesseiros", "varios travesseiros",
    ],
    regex: ["\\d+ travesseiros?", "(durmo|dorme|durmir|dormir) com .{0,12}travesseiros?"],
  },
  {
    conceptId: "dispneia_paroxistica_noturna",
    label: "Dispneia paroxística noturna",
    category: "anamnese",
    synonyms: [
      "acorda com falta de ar", "acorda sufocando", "acordo sufocando", "acorda de madrugada sem ar",
      "falta de ar de madrugada", "sufocando de madrugada", "sufocando de noite", "acordo sem ar",
      "precisa sentar para respirar a noite", "crise de falta de ar a noite",
    ],
    regex: ["(acorda|acordo|acordando) .{0,15}(sufocando|sem ar|falta de ar)"],
  },
  {
    conceptId: "dor_toracica",
    label: "Dor torácica",
    category: "anamnese",
    synonyms: [
      "dor no peito", "aperto no peito", "pressao no peito", "peso no peito",
      "queimacao no peito", "dor toracica", "dor retroesternal", "pontada no peito",
      "peito apertado",
    ],
  },
  {
    conceptId: "dor_toracica_isquemica",
    label: "Dor torácica isquêmica",
    category: "anamnese",
    synonyms: [
      "dor em aperto", "dor opressiva", "dor que irradia para braco esquerdo",
      "irradiando para braco esquerdo", "irradiando para braco", "irradia para o braco esquerdo",
      "aperto no peito que irradia", "aperto no peito irradiando",
      "dor para mandibula", "dor para pescoco", "dor ao esforco", "melhora com repouso",
      "dor com suor frio", "dor com nauseas", "dor tipica",
    ],
    regex: ["(aperto|dor|peso|pressao) .{0,20}(irradia|irradiando) .{0,15}(braco|mandibula|pescoco)"],
  },
  {
    conceptId: "sibilancia",
    label: "Sibilância",
    category: "anamnese",
    synonyms: [
      "chiado no peito", "chiadeira", "assobio no peito", "peito chiando", "sibilos",
      "broncoespasmo", "crise de chiado", "wheezing",
    ],
  },
  {
    conceptId: "edema_membros_inferiores",
    label: "Edema de membros inferiores",
    category: "anamnese",
    synonyms: [
      "pernas inchadas", "pe inchado", "pes inchados", "tornozelo inchado",
      "inchaco nas pernas", "edema em pernas", "sapato apertado", "meia marcando",
      "cacifo", "sinal de godet",
    ],
  },
  {
    conceptId: "sincope",
    label: "Síncope",
    category: "anamnese",
    synonyms: [
      "desmaiou", "apagou", "perdeu os sentidos", "perda de consciencia", "teve desmaio",
      "quase desmaiou", "lipotimia", "escureceu a vista",
    ],
  },
  {
    conceptId: "palpitacoes",
    label: "Palpitações",
    category: "anamnese",
    synonyms: [
      "coracao acelerado", "coracao disparado", "palpitacao", "batedeira",
      "coracao batendo forte", "coracao irregular", "batimento estranho",
    ],
  },

  // -------------------------------------------------------------------------
  // EXAMES (TAREFA 4)
  // -------------------------------------------------------------------------
  {
    conceptId: "rx_torax",
    label: "Radiografia de tórax",
    category: "exames",
    synonyms: [
      "rx torax", "raio x torax", "raio-x de torax", "radiografia de torax",
      "radiografia toracica", "chapa do pulmao", "raio x do peito", "rx de peito",
      "chest xray", "chest x-ray",
      "rx de torax", "rx do torax", "raiox de torax", "raiox do torax", "raio x de torax",
      "raio x do torax", "raio-x do torax",
    ],
  },
  {
    conceptId: "trm_tb",
    label: "Teste rápido molecular para TB (TRM-TB)",
    category: "exames",
    synonyms: [
      "trm tb", "trm-tb", "trm tuberculosis", "teste rapido molecular",
      "teste molecular para tuberculose", "teste molecular tb", "xpert mtb/rif", "xpert",
      "gene xpert", "genexpert", "pcr para tuberculose", "teste molecular no escarro",
    ],
    regex: ["trm[ -]?tb", "gene ?xpert"],
  },
  {
    conceptId: "baciloscopia_escarro",
    label: "Baciloscopia de escarro (BAAR)",
    category: "exames",
    synonyms: [
      "baciloscopia", "baciloscopia de escarro", "pesquisa de baar", "baar",
      "baar no escarro", "escarro para baar", "exame de escarro", "duas amostras de escarro",
      "2 amostras de escarro", "bacilos alcool acido resistentes", "bacilo alcool acido resistente",
    ],
  },
  {
    conceptId: "cultura_escarro",
    label: "Cultura de escarro",
    category: "exames",
    synonyms: [
      "cultura de escarro", "cultura para tuberculose", "cultura para micobacteria",
      "cultura de baar", "cultura do escarro",
    ],
  },
  {
    conceptId: "hemograma",
    label: "Hemograma",
    category: "exames",
    synonyms: ["hemograma", "hemograma completo", "sangue completo", "exame de sangue completo"],
  },
  {
    conceptId: "ecg",
    label: "Eletrocardiograma",
    category: "exames",
    synonyms: ["ecg", "eletro", "eletrocardiograma", "eletro do coracao", "tracado cardiaco"],
  },
  {
    conceptId: "troponina",
    label: "Troponina / marcadores de necrose",
    category: "exames",
    synonyms: [
      "troponina", "enzimas cardiacas", "marcador cardiaco",
      "marcadores de necrose miocardica", "ckmb", "ck-mb",
    ],
  },
  {
    conceptId: "ecocardiograma",
    label: "Ecocardiograma",
    category: "exames",
    synonyms: [
      "eco", "ecocardiograma", "ultrassom do coracao", "ultrassonografia cardiaca",
      "avaliacao da fracao de ejecao", "feve", "fracao de ejecao",
    ],
  },
  {
    conceptId: "bnp_ntprobnp",
    label: "BNP / NT-proBNP",
    category: "exames",
    synonyms: [
      "bnp", "nt-probnp", "nt probnp", "peptideo natriuretico",
      "marcador de insuficiencia cardiaca",
    ],
  },
  {
    conceptId: "gasometria",
    label: "Gasometria",
    category: "exames",
    synonyms: [
      "gasometria", "gasometria arterial", "gaso", "gasometria venosa",
      "avaliacao dos gases", "ph arterial",
    ],
  },
  {
    conceptId: "d_dimero",
    label: "D-dímero",
    category: "exames",
    synonyms: ["dimero d", "d-dimero", "d dimero", "d-dimer"],
  },
  {
    conceptId: "angio_tc_torax",
    label: "Angio-TC de tórax",
    category: "exames",
    synonyms: [
      "angiotc", "angio tc", "angiotomografia", "angiotomografia de torax",
      "angiotc de torax", "tc com contraste para tep", "tomografia com contraste pulmonar",
    ],
  },
  {
    conceptId: "tc_cranio",
    label: "TC de crânio",
    category: "exames",
    synonyms: [
      "tc de cranio", "tc cranio", "tomografia de cranio", "tomografia da cabeca",
      "tomografia cerebral", "ct head",
    ],
  },
  {
    conceptId: "bilirrubinas",
    label: "Bilirrubinas",
    category: "exames",
    synonyms: [
      "bilirrubina", "bilirrubinas", "bilirrubina direta", "bilirrubina indireta",
      "fracoes de bilirrubina",
    ],
  },
  {
    conceptId: "reticulocitos",
    label: "Reticulócitos",
    category: "exames",
    synonyms: ["reticulocitos", "contagem de reticulocitos", "reticulocitos no sangue"],
  },
  {
    conceptId: "ldh",
    label: "LDH / DHL",
    category: "exames",
    synonyms: ["ldh", "dhl", "desidrogenase latica", "lactato desidrogenase"],
  },
  {
    conceptId: "haptoglobina",
    label: "Haptoglobina",
    category: "exames",
    synonyms: ["haptoglobina"],
  },
  {
    conceptId: "coombs",
    label: "Teste de Coombs",
    category: "exames",
    synonyms: [
      "coombs", "teste de coombs", "coombs direto", "coombs indireto",
      "teste antiglobulina direta",
    ],
  },

  // -------------------------------------------------------------------------
  // EXAME FÍSICO (TAREFA 5)
  // -------------------------------------------------------------------------
  {
    conceptId: "sinais_vitais",
    label: "Sinais vitais",
    category: "exame_fisico",
    synonyms: [
      "sinais vitais", "medir pressao", "medir pa", "medir frequencia cardiaca", "medir fc",
      "medir frequencia respiratoria", "medir fr", "medir temperatura", "medir saturacao",
      "medir spo2", "oximetria", "glicemia capilar", "sinais completos",
    ],
  },
  {
    conceptId: "ausculta_pulmonar",
    label: "Ausculta pulmonar",
    category: "exame_fisico",
    synonyms: [
      "auscultar pulmao", "auscultar pulmoes", "auscultar torax", "ausculta pulmonar",
      "ouvir o pulmao", "ouvir os pulmoes", "auscultar campos pulmonares", "auscultar bases",
      "auscultar apices", "ausculta respiratoria",
      "auscultar os pulmoes", "ouvir os pulmoes", "escutar os pulmoes", "examinar os pulmoes",
    ],
  },
  {
    conceptId: "ausculta_torax_anterior",
    label: "Ausculta torácica anterior",
    category: "exame_fisico",
    synonyms: [
      "auscultar torax anterior", "ausculta anterior", "auscultar campos anteriores",
      "ausculta pulmonar anterior", "auscultou torax anterior", "campos anteriores",
    ],
  },
  {
    conceptId: "ausculta_torax_posterior",
    label: "Ausculta torácica posterior",
    category: "exame_fisico",
    synonyms: [
      "auscultar torax posterior", "ausculta posterior", "auscultar campos posteriores",
      "ausculta pulmonar posterior", "auscultou torax posterior", "campos posteriores",
      "bases posteriores", "dorso pulmonar",
    ],
  },
  {
    conceptId: "ausculta_anterior_posterior",
    label: "Ausculta torácica anterior e posterior",
    category: "exame_fisico",
    synonyms: [
      "ausculta anterior e posterior", "auscultar anterior e posterior",
      "ausculta pulmonar anterior e posterior", "auscultar campos anteriores e posteriores",
      "auscultei anterior e posterior", "auscultou anterior e posterior",
      "auscultar torax anterior e posterior",
    ],
  },
  {
    conceptId: "crepitacoes",
    label: "Crepitações",
    category: "exame_fisico",
    synonyms: [
      "crepitacoes", "estertores", "estertores crepitantes", "estertores finos",
      "crepitacoes finas", "crepitacoes grossas", "crackles", "fine crackles", "coarse crackles",
    ],
  },
  {
    conceptId: "sibilos",
    label: "Sibilos",
    category: "exame_fisico",
    synonyms: ["sibilos", "sibilancia", "chiado", "chiado no peito", "wheezing", "broncoespasmo"],
  },
  {
    conceptId: "roncos",
    label: "Roncos",
    category: "exame_fisico",
    synonyms: ["roncos", "rhonchi", "secrecao", "ruidos de secrecao"],
  },
  {
    conceptId: "murmurio_reduzido",
    label: "Murmúrio vesicular reduzido/abolido",
    category: "exame_fisico",
    synonyms: [
      "murmurio reduzido", "murmurio vesicular reduzido", "murmurio abolido",
      "ausencia de murmurio", "mv diminuido", "mv abolido", "murmurio vesicular abolido",
    ],
  },
  {
    conceptId: "linfonodos",
    label: "Linfonodos",
    category: "exame_fisico",
    synonyms: [
      "linfonodos", "ganglios", "inguas", "adenomegalias", "linfonodomegalias",
      "cadeias cervicais", "axilares", "supraclaviculares",
    ],
  },
  {
    conceptId: "ictus_cordis",
    label: "Ictus cordis",
    category: "exame_fisico",
    synonyms: [
      "ictus", "ictus cordis", "palpou ictus", "localizacao do ictus", "desvio do ictus",
      "ictus desviado", "impulso apical",
    ],
  },
  {
    conceptId: "turgencia_jugular",
    label: "Turgência jugular",
    category: "exame_fisico",
    synonyms: [
      "turgencia jugular", "estase jugular", "jugular ingurgitada",
      "ingurgitamento jugular", "pressao venosa jugular", "pvj",
    ],
  },
  {
    conceptId: "edema_mmii",
    label: "Edema de MMII (exame)",
    category: "exame_fisico",
    synonyms: [
      "edema de membros inferiores", "edema mmii", "inchaco nas pernas", "pernas inchadas",
      "edema com cacifo", "sinal de godet", "edema maleolar",
    ],
  },

  // -------------------------------------------------------------------------
  // CONDUTA E SEGURANÇA (TAREFA 6)
  // -------------------------------------------------------------------------
  {
    conceptId: "orientar_retorno_sinais_alarme",
    label: "Orientar retorno / sinais de alarme",
    category: "seguranca",
    synonyms: [
      "voltar se piorar", "retornar se piorar", "procurar emergencia",
      "procurar pronto atendimento", "sinais de alarme", "piora da falta de ar",
      "piora do quadro", "retorno imediato", "se piorar procure",
    ],
  },
  {
    conceptId: "mascara_etiqueta_respiratoria",
    label: "Máscara / etiqueta respiratória",
    category: "seguranca",
    synonyms: [
      "usar mascara", "mascara cirurgica", "etiqueta respiratoria", "cobrir a boca ao tossir",
      "evitar transmitir", "evitar contaminar outras pessoas", "reduzir transmissao",
      "isolamento respiratorio", "isolamento", "ventilacao do ambiente",
    ],
  },
  {
    conceptId: "notificacao_vigilancia",
    label: "Notificação / vigilância epidemiológica",
    category: "seguranca",
    synonyms: [
      "notificar", "notificacao compulsoria", "vigilancia epidemiologica",
      "encaminhar para vigilancia", "comunicar vigilancia", "ficha de notificacao", "sinan",
      "notificacao", "notificar caso", "notificar a tuberculose", "notificar a dengue",
      "notificar para vigilancia",
    ],
  },
  {
    conceptId: "investigar_contatos",
    label: "Investigar contatos",
    category: "seguranca",
    synonyms: [
      "investigar contatos", "avaliar contatos", "examinar familiares", "rastrear contatos",
      "contatos domiciliares", "quem mora com voce", "familiares precisam avaliar",
      "pessoas da casa", "contact tracing",
      "investigacao dos contatos", "avaliacao dos contatos", "examinar contatos",
      "avaliar pessoas da casa", "investigar familiares", "rastrear familiares",
    ],
  },
  {
    conceptId: "ripe",
    label: "Esquema RIPE",
    category: "conduta",
    synonyms: [
      "ripe", "rifampicina isoniazida pirazinamida etambutol", "rifampicina", "isoniazida",
      "pirazinamida", "etambutol", "esquema basico", "esquema para tuberculose",
      "tratamento da tuberculose por 6 meses", "fase intensiva", "fase de manutencao",
    ],
  },
  {
    conceptId: "adesao_tratamento",
    label: "Adesão ao tratamento",
    category: "conduta",
    synonyms: [
      "tomar todos os remedios", "nao abandonar tratamento", "completar tratamento",
      "adesao ao tratamento", "tomar certinho", "seguir ate o final",
      "nao parar quando melhorar", "importancia de completar",
      "adesao ao ripe", "adesao ao tratamento da tb", "nao abandonar o ripe",
      "nao parar o ripe", "tomar ripe ate o fim",
    ],
  },
  {
    conceptId: "diuretico_ic",
    label: "Diurético / terapia descongestiva",
    category: "conduta",
    synonyms: [
      "diuretico", "furosemida", "terapia descongestiva", "tirar liquido",
      "reduzir congestao", "controlar edema", "tratar congestao",
    ],
  },
  {
    conceptId: "oxigenio_suporte",
    label: "Oxigênio / suporte ventilatório",
    category: "conduta",
    synonyms: [
      "oxigenio", "suporte ventilatorio", "cateter nasal", "mascara de oxigenio",
      "ventilacao nao invasiva", "vni",
    ],
  },
  {
    conceptId: "antiagregante_sca",
    label: "Antiagregante (SCA)",
    category: "conduta",
    synonyms: [
      "aas", "aspirina", "acido acetilsalicilico", "antiagregante", "dupla antiagregacao",
      "clopidogrel", "ticagrelor",
    ],
  },
  {
    conceptId: "anticoagulacao",
    label: "Anticoagulação",
    category: "conduta",
    synonyms: [
      "anticoagular", "anticoagulacao", "heparina", "enoxaparina", "anticoagulante",
      "anticoagulacao plena",
    ],
  },

  // -------------------------------------------------------------------------
  // COMPLEMENTAR — 17 casos sem cobertura (cardiologia/valvopatias/endocardite)
  // -------------------------------------------------------------------------
  {
    conceptId: "febre_prolongada",
    label: "Febre prolongada",
    category: "anamnese",
    synonyms: [
      "febre ha dias", "febre prolongada", "febre persistente", "febre que nao passa",
      "febre recorrente", "febre arrastada", "febre ha semanas",
    ],
  },
  {
    conceptId: "sopro_cardiaco",
    label: "Sopro cardíaco",
    category: "exame_fisico",
    synonyms: [
      "sopro", "sopro cardiaco", "sopro no coracao", "sopro sistolico", "sopro diastolico",
      "ausculta com sopro", "murmur", "heart murmur",
    ],
  },
  {
    conceptId: "fator_risco_endocardite",
    label: "Fator de risco para endocardite",
    category: "anamnese",
    synonyms: [
      "protese valvar", "valvula artificial", "valvopatia previa", "uso de droga injetavel",
      "droga venosa", "hemodialise", "cateter venoso", "procedimento dentario",
      "extracao dentaria", "infeccao recente",
    ],
  },
  {
    conceptId: "hemoculturas",
    label: "Hemoculturas",
    category: "exames",
    synonyms: [
      "hemocultura", "hemoculturas", "cultura de sangue", "culturas de sangue",
      "coletar hemoculturas", "duas hemoculturas", "tres hemoculturas", "2 hemoculturas",
      "3 hemoculturas",
    ],
  },
  {
    conceptId: "ecocardiograma_transesofagico",
    label: "Ecocardiograma transesofágico",
    category: "exames",
    synonyms: [
      "eco transesofagico", "ecocardiograma transesofagico", "ete", "ecotee",
      "transesophageal echo",
    ],
  },
  {
    conceptId: "antibiotico_endocardite",
    label: "Antibioticoterapia para endocardite",
    category: "conduta",
    synonyms: [
      "antibioticoterapia endocardite", "antibiotico para endocardite", "vancomicina",
      "ceftriaxona", "gentamicina", "terapia empirica", "antibiotico intravenoso",
    ],
  },
  {
    conceptId: "estenose_mitral",
    label: "Estenose mitral",
    category: "raciocinio",
    synonyms: [
      "estenose mitral", "valva mitral estreita", "valvula mitral estreita",
      "sopro diastolico mitral", "ruflar diastolico", "estalido de abertura", "opening snap",
    ],
  },
  {
    conceptId: "fibrilacao_atrial",
    label: "Fibrilação atrial",
    category: "raciocinio",
    synonyms: [
      "fibrilacao atrial", "fa", "ritmo irregular", "arritmia irregular", "pulso irregular",
      "irregularmente irregular",
    ],
  },
  {
    conceptId: "anticoagulacao_fa",
    label: "Anticoagulação na FA",
    category: "conduta",
    synonyms: [
      "anticoagular pela fa", "anticoagulacao na fa", "varfarina", "warfarin", "doac",
      "anticoagulante oral", "prevencao de embolia",
    ],
  },

  // Emergência hipertensiva
  {
    conceptId: "lesao_orgao_alvo",
    label: "Lesão de órgão-alvo",
    category: "raciocinio",
    synonyms: [
      "lesao de orgao alvo", "loa", "dano em orgao alvo", "lesao aguda",
      "acometimento neurologico", "dor toracica", "alteracao renal", "edema agudo de pulmao",
      "eap", "encefalopatia hipertensiva",
    ],
  },
  {
    conceptId: "pa_muito_elevada",
    label: "PA muito elevada",
    category: "exame_fisico",
    synonyms: [
      "pressao muito alta", "pressao 180 por 120", "pa 180/120", "pa muito elevada",
      "hipertensao grave", "crise hipertensiva",
    ],
  },
  {
    conceptId: "reducao_controlada_pa",
    label: "Redução controlada da PA",
    category: "conduta",
    synonyms: [
      "reduzir pressao gradualmente", "reducao controlada da pa", "nao baixar rapido demais",
      "nitroprussiato", "labetalol", "medicacao intravenosa", "anti-hipertensivo venoso",
    ],
  },
  {
    conceptId: "creatinina",
    label: "Função renal / creatinina",
    category: "exames",
    synonyms: ["creatinina", "funcao renal", "ureia", "injuria renal"],
  },

  // TVP
  {
    conceptId: "dor_panturrilha",
    label: "Dor em panturrilha",
    category: "anamnese",
    synonyms: [
      "dor na panturrilha", "panturrilha dolorosa", "dor na batata da perna", "dor na perna",
      "dor unilateral na perna",
    ],
  },
  {
    conceptId: "edema_unilateral",
    label: "Edema unilateral",
    category: "exame_fisico",
    synonyms: [
      "perna inchada de um lado", "edema unilateral", "uma perna inchada", "inchaco unilateral",
      "panturrilha inchada", "assimetria de pernas",
    ],
  },
  {
    conceptId: "risco_tvp",
    label: "Fator de risco para TVP",
    category: "anamnese",
    synonyms: [
      "cirurgia recente", "imobilizacao", "viagem longa", "acamado", "anticoncepcional",
      "cancer", "trombose previa", "gestacao", "puerperio",
    ],
  },
  {
    conceptId: "usg_doppler_venoso",
    label: "USG Doppler venoso",
    category: "exames",
    synonyms: [
      "doppler venoso", "ultrassom doppler", "ultrassonografia venosa", "usg doppler",
      "duplex scan", "doppler de membros inferiores", "doppler da perna",
    ],
  },

  // Arboviroses
  {
    conceptId: "ictericia_hepatite",
    label: "Icterícia / hepatite",
    category: "anamnese",
    synonyms: [
      "ictericia", "olhos amarelos", "pele amarela", "amarelao", "hepatite", "figado inflamado",
    ],
  },
  {
    conceptId: "sangramento_mucoso",
    label: "Sangramento mucoso",
    category: "anamnese",
    synonyms: [
      "sangramento", "sangramento no nariz", "epistaxe", "gengiva sangrando",
      "sangramento gengival", "manchas roxas", "petequias", "equimoses", "sangramento de mucosa",
    ],
  },
  {
    conceptId: "dor_retroorbitaria",
    label: "Dor retro-orbitária",
    category: "anamnese",
    synonyms: [
      "dor atras dos olhos", "dor no fundo dos olhos", "dor ocular", "dor ao mexer os olhos",
    ],
  },
  {
    conceptId: "artralgia_intensa",
    label: "Artralgia intensa",
    category: "anamnese",
    synonyms: [
      "dor nas juntas", "dor intensa nas juntas", "dor forte nas juntas", "dor articular",
      "artralgia", "dor nas articulacoes", "juntas inchadas", "dor forte nas maos",
      "dor forte nos pes", "poliartralgia",
    ],
    regex: ["dor .{0,12}(nas juntas|articular|nas articulacoes)"],
  },
  {
    conceptId: "exantema",
    label: "Exantema",
    category: "anamnese",
    synonyms: [
      "manchas vermelhas", "rash", "exantema", "pele vermelha", "placas vermelhas",
      "pintinhas vermelhas", "vermelhidao na pele",
    ],
  },
  {
    conceptId: "viagem_area_risco",
    label: "Viagem a área de risco",
    category: "anamnese",
    synonyms: [
      "viagem recente", "area de mata", "zona rural", "regiao endemica", "contato com mosquito",
      "picada de mosquito", "surto na regiao",
    ],
  },
  {
    conceptId: "vacina_febre_amarela",
    label: "Vacina de febre amarela",
    category: "anamnese",
    synonyms: [
      "vacina febre amarela", "vacinado para febre amarela", "nao tomou vacina", "cartao vacinal",
      "vacina atrasada",
    ],
  },
  {
    conceptId: "sinais_neurologicos_gbs",
    label: "Sinais neurológicos (Guillain-Barré)",
    category: "anamnese",
    synonyms: [
      "fraqueza nas pernas", "fraqueza ascendente", "formigamento", "dormencia",
      "perda de reflexos", "arreflexia", "dificuldade para andar", "paralisia", "guillain barre",
    ],
  },

  // Hematologia
  {
    conceptId: "dor_ossea",
    label: "Dor óssea",
    category: "anamnese",
    synonyms: [
      "dor ossea", "dor nos ossos", "dor lombar", "dor nas costas",
      "dor persistente nos ossos", "dor no esqueleto",
    ],
  },
  {
    conceptId: "lesoes_liticas",
    label: "Lesões líticas",
    category: "exames",
    synonyms: [
      "lesoes liticas", "lesao litica", "raio x com lesoes osseas", "lesoes osseas",
      "fratura patologica",
    ],
  },
  {
    conceptId: "proteinuria_bence_jones",
    label: "Proteinúria de Bence-Jones",
    category: "exames",
    synonyms: [
      "bence jones", "proteina de bence jones", "proteinuria", "eletroforese de proteinas",
      "imunofixacao",
    ],
  },
  {
    conceptId: "mielograma",
    label: "Mielograma / medula óssea",
    category: "exames",
    synonyms: ["mielograma", "aspirado de medula", "biopsia de medula", "medula ossea"],
  },
  {
    conceptId: "sangramento_coagulopatia",
    label: "Sangramento por coagulopatia",
    category: "anamnese",
    synonyms: [
      "sangramento", "sangramento facil", "sangra facil", "hematomas", "roxos pelo corpo",
      "equimoses", "petequias", "sangramento prolongado", "sangramento apos procedimento",
    ],
  },
  {
    conceptId: "tp_ttp_fibrinogenio",
    label: "Coagulograma (TP/TTP/fibrinogênio)",
    category: "exames",
    synonyms: [
      "tp", "ttp", "ttpa", "inr", "fibrinogenio", "coagulograma", "tempos de coagulacao",
    ],
  },
  {
    conceptId: "fator_viii",
    label: "Fator VIII",
    category: "exames",
    synonyms: [
      "fator oito", "fator viii", "fator 8", "dosagem do fator viii", "reposicao de fator viii",
    ],
  },
  {
    conceptId: "talassemia",
    label: "Talassemia",
    category: "raciocinio",
    synonyms: [
      "talassemia", "talassemia maior", "anemia mediterranea", "anemia microcitica",
      "hemoglobinopatia", "eletroforese de hemoglobina",
    ],
  },
  {
    conceptId: "transfusao_regular",
    label: "Transfusão regular",
    category: "conduta",
    synonyms: [
      "transfusao", "transfusoes regulares", "concentrado de hemacias", "terapia transfusional",
    ],
  },
  {
    conceptId: "quelacao_ferro",
    label: "Quelação de ferro",
    category: "conduta",
    synonyms: [
      "quelacao de ferro", "quelante de ferro", "deferasirox", "deferoxamina",
      "sobrecarga de ferro", "ferritina alta",
    ],
  },

  // Atelectasia / Bronquiolite / Pediatria
  {
    conceptId: "pos_operatorio",
    label: "Pós-operatório",
    category: "anamnese",
    synonyms: [
      "pos operatorio", "pos cirurgia", "depois da cirurgia", "cirurgia recente",
      "operou recentemente",
    ],
  },
  {
    conceptId: "hipoventilacao",
    label: "Hipoventilação",
    category: "exame_fisico",
    synonyms: [
      "respira pouco", "hipoventilacao", "respiracao superficial", "nao expande bem",
      "pouca ventilacao",
    ],
  },
  {
    conceptId: "fisioterapia_respiratoria",
    label: "Fisioterapia respiratória",
    category: "conduta",
    synonyms: [
      "fisioterapia respiratoria", "exercicios respiratorios", "inspirometria de incentivo",
      "incentivo respiratorio", "deambulacao precoce", "levantar da cama",
    ],
  },
  {
    conceptId: "bronquiolite",
    label: "Bronquiolite",
    category: "raciocinio",
    synonyms: [
      "bronquiolite", "bronquiolite viral", "lactente chiador", "lactente chiando",
      "bebe chiando", "chiado no bebe", "vrs", "virus sincicial respiratorio",
    ],
    regex: ["lactente .{0,8}chian"],
  },
  {
    conceptId: "tiragem",
    label: "Tiragem / esforço respiratório",
    category: "exame_fisico",
    synonyms: [
      "tiragem", "retracao", "puxando a costela", "afundando costela", "batimento de asa nasal",
      "esforco respiratorio",
    ],
  },
  {
    conceptId: "alimentacao_reduzida",
    label: "Alimentação reduzida (lactente)",
    category: "anamnese",
    synonyms: [
      "mamando menos", "mama pouco", "nao mama", "aceita pouco liquido", "recusa alimentar",
      "pouca ingesta",
    ],
  },
  {
    conceptId: "desenvolvimento_normal",
    label: "Desenvolvimento normal",
    category: "anamnese",
    synonyms: [
      "desenvolvimento normal", "marcos do desenvolvimento", "senta", "engatinha", "anda",
      "fala palavras", "sorri", "interage", "crescimento adequado", "desenvolvimento adequado",
    ],
  },
  {
    conceptId: "pa_pediatrica_elevada",
    label: "PA elevada (pediátrica)",
    category: "exame_fisico",
    synonyms: [
      "pressao alta na crianca", "pa elevada para idade", "hipertensao pediatrica",
      "percentil de pressao", "p95", "acima do percentil",
    ],
  },
  {
    conceptId: "rinossinusite",
    label: "Rinossinusite",
    category: "raciocinio",
    synonyms: [
      "rinossinusite", "sinusite", "secrecao nasal purulenta", "nariz entupido", "dor facial",
      "dor na face", "piora apos melhora", "febre e coriza prolongada",
    ],
  },

  // Conceitos auxiliares referenciados por pacotes (sinônimos enxutos)
  {
    conceptId: "mialgia",
    label: "Mialgia",
    category: "anamnese",
    synonyms: ["dor no corpo", "dor muscular", "mialgia", "dores pelo corpo"],
  },
  {
    conceptId: "coagulograma",
    label: "Coagulograma",
    category: "exames",
    synonyms: ["coagulograma", "tp", "ttp", "inr", "tempos de coagulacao"],
  },
  {
    conceptId: "funcao_hepatica",
    label: "Função hepática",
    category: "exames",
    synonyms: ["funcao hepatica", "transaminases", "tgo", "tgp", "ast", "alt", "enzimas hepaticas"],
  },
  {
    conceptId: "hidratacao",
    label: "Hidratação",
    category: "conduta",
    synonyms: ["hidratacao", "soro", "hidratar", "ingerir liquidos", "hidratacao venosa"],
  },
  {
    conceptId: "conjuntivite",
    label: "Conjuntivite (Zika)",
    category: "anamnese",
    synonyms: ["conjuntivite", "olhos vermelhos", "hiperemia conjuntival", "olho vermelho"],
  },
  {
    conceptId: "exame_neurologico",
    label: "Exame neurológico",
    category: "exame_fisico",
    synonyms: [
      "exame neurologico", "avaliar reflexos", "avaliar forca", "pesquisar reflexos",
      "avaliacao neurologica", "reflexos tendinosos",
    ],
  },
  {
    conceptId: "encaminhamento_hospitalar",
    label: "Encaminhamento hospitalar",
    category: "conduta",
    synonyms: [
      "encaminhar ao hospital", "internacao", "encaminhamento hospitalar", "referenciar",
      "encaminhar para emergencia",
    ],
  },
  {
    conceptId: "analgesia",
    label: "Analgesia",
    category: "conduta",
    synonyms: ["analgesia", "analgesico", "dipirona", "paracetamol", "controle da dor"],
  },
  {
    conceptId: "anemia",
    label: "Anemia",
    category: "raciocinio",
    synonyms: ["anemia", "hemoglobina baixa", "hb baixa", "palidez", "anemico"],
  },
  {
    conceptId: "hipercalcemia",
    label: "Hipercalcemia",
    category: "exames",
    synonyms: ["hipercalcemia", "calcio alto", "calcio elevado", "calcemia elevada"],
  },
  {
    conceptId: "eletroforese_proteinas",
    label: "Eletroforese de proteínas",
    category: "exames",
    synonyms: ["eletroforese de proteinas", "eletroforese proteica", "pico monoclonal", "imunofixacao"],
  },
  {
    conceptId: "encaminhamento_hematologia",
    label: "Encaminhamento à hematologia",
    category: "conduta",
    synonyms: ["encaminhar para hematologia", "encaminhamento hematologia", "avaliacao do hematologista"],
  },
  {
    conceptId: "sepse",
    label: "Sepse",
    category: "raciocinio",
    synonyms: ["sepse", "septico", "infeccao grave", "choque septico", "foco infeccioso"],
  },
  {
    conceptId: "plaquetas",
    label: "Plaquetas",
    category: "exames",
    synonyms: ["plaquetas", "plaquetopenia", "plaquetas baixas", "contagem de plaquetas"],
  },
  {
    conceptId: "tratar_causa_base",
    label: "Tratar causa de base",
    category: "conduta",
    synonyms: ["tratar a causa", "tratar causa base", "controlar o foco", "tratar a doenca de base"],
  },
  {
    conceptId: "suporte_hemoderivados",
    label: "Suporte com hemoderivados",
    category: "conduta",
    synonyms: [
      "hemoderivados", "plasma fresco", "concentrado de plaquetas", "crioprecipitado",
      "transfusao de plaquetas",
    ],
  },
  {
    conceptId: "hemartrose",
    label: "Hemartrose",
    category: "anamnese",
    synonyms: ["hemartrose", "sangramento na articulacao", "joelho inchado de sangue", "sangue na junta"],
  },
  {
    conceptId: "evitar_trauma",
    label: "Evitar trauma / IM",
    category: "conduta",
    synonyms: ["evitar trauma", "evitar injecao intramuscular", "evitar im", "evitar atividades de risco"],
  },
  {
    conceptId: "esplenomegalia",
    label: "Esplenomegalia",
    category: "exame_fisico",
    synonyms: ["esplenomegalia", "baco aumentado", "baco grande", "baco palpavel"],
  },
  {
    conceptId: "eletroforese_hemoglobina",
    label: "Eletroforese de hemoglobina",
    category: "exames",
    synonyms: ["eletroforese de hemoglobina", "eletroforese da hb", "perfil de hemoglobina"],
  },
  {
    conceptId: "acompanhamento_hematologia",
    label: "Acompanhamento hematológico",
    category: "conduta",
    synonyms: ["acompanhamento hematologico", "seguimento com hematologista", "acompanhamento regular"],
  },
  {
    conceptId: "sinais_alarme_pediatria",
    label: "Sinais de alarme pediátricos",
    category: "seguranca",
    synonyms: [
      "sinais de alarme", "gemencia", "cianose", "recusa alimentar", "sonolencia",
      "prostracao", "saturacao baixa", "tiragem importante",
    ],
  },
  {
    conceptId: "historia_familiar_has",
    label: "História familiar de HAS",
    category: "anamnese",
    synonyms: ["historia familiar de hipertensao", "pais hipertensos", "familia com pressao alta"],
  },
  {
    conceptId: "obesidade",
    label: "Obesidade",
    category: "anamnese",
    synonyms: ["obesidade", "sobrepeso", "imc elevado", "excesso de peso"],
  },
  {
    conceptId: "doenca_renal",
    label: "Doença renal",
    category: "raciocinio",
    synonyms: ["doenca renal", "problema nos rins", "nefropatia", "doenca renal cronica"],
  },
  {
    conceptId: "orientacao_medida_pa",
    label: "Orientação de medida da PA",
    category: "conduta",
    synonyms: [
      "medir pressao com manguito adequado", "tabela de percentil", "medida correta da pressao",
      "manguito apropriado",
    ],
  },
  {
    conceptId: "marcos_desenvolvimento",
    label: "Marcos do desenvolvimento",
    category: "anamnese",
    synonyms: ["marcos do desenvolvimento", "marcos motores", "desenvolvimento neuropsicomotor", "dnpm"],
  },
  {
    conceptId: "crescimento",
    label: "Crescimento",
    category: "anamnese",
    synonyms: ["crescimento", "curva de crescimento", "peso e altura", "percentil de crescimento", "ganho de peso"],
  },
  {
    conceptId: "vacinacao",
    label: "Vacinação",
    category: "conduta",
    synonyms: ["vacinacao", "vacinas em dia", "calendario vacinal", "cartao de vacina", "vacinas atualizadas"],
  },
  {
    conceptId: "alimentacao",
    label: "Alimentação",
    category: "anamnese",
    synonyms: ["alimentacao", "aleitamento", "introducao alimentar", "amamentacao", "dieta da crianca"],
  },
  {
    conceptId: "sono",
    label: "Sono",
    category: "anamnese",
    synonyms: ["sono", "qualidade do sono", "rotina de sono", "como dorme"],
  },
  {
    conceptId: "seguranca_infantil",
    label: "Segurança infantil",
    category: "seguranca",
    synonyms: [
      "seguranca infantil", "prevencao de acidentes", "cadeirinha", "tela nas janelas",
      "evitar quedas", "guardar produtos de limpeza",
    ],
  },
  {
    conceptId: "orientacao_responsavel",
    label: "Orientação ao responsável",
    category: "comunicacao",
    synonyms: ["orientar os pais", "orientacao ao responsavel", "orientar a mae", "orientar o cuidador"],
  },
  {
    conceptId: "secrecao_nasal_purulenta",
    label: "Secreção nasal purulenta",
    category: "anamnese",
    synonyms: ["secrecao nasal purulenta", "coriza purulenta", "secrecao amarelada no nariz", "catarro no nariz"],
  },
  {
    conceptId: "dor_facial",
    label: "Dor facial",
    category: "anamnese",
    synonyms: ["dor facial", "dor na face", "dor nos seios da face", "dor ao abaixar a cabeca"],
  },
  {
    conceptId: "piora_apos_melhora",
    label: "Piora após melhora",
    category: "anamnese",
    synonyms: ["piora apos melhora", "melhorou e piorou", "dupla piora", "recaida apos melhora"],
  },
  {
    conceptId: "antibioticoterapia",
    label: "Antibioticoterapia",
    category: "conduta",
    synonyms: ["antibiotico", "antibioticoterapia", "amoxicilina", "amoxicilina com clavulanato"],
  },

  // -------------------------------------------------------------------------
  // v3 — conceitos globais novos (gaps do Shadow Mode)
  // -------------------------------------------------------------------------
  {
    conceptId: "tosse",
    label: "Tosse",
    category: "anamnese",
    synonyms: [
      "tosse", "tossindo", "tossir", "tosse seca", "tosse produtiva", "tosse com catarro",
      "pigarro", "crise de tosse", "tosse persistente", "tosse piora a noite",
    ],
    typoVariants: ["toce", "tossi", "tossse"],
  },
  {
    conceptId: "monitorizacao",
    label: "Monitorização",
    category: "conduta",
    synonyms: [
      "monitorizacao", "monitorizo", "monitorizar", "monitorar", "monitoramento",
      "monitor cardiaco", "deixar monitorizado", "manter monitorizado",
    ],
  },
  {
    conceptId: "evitar_aine",
    label: "Evitar AINE",
    category: "conduta",
    synonyms: [
      "nao usar ibuprofeno", "nao tomar ibuprofeno", "evitar ibuprofeno", "nao usar aas",
      "evitar aspirina", "nao usar antiinflamatorio", "nao usar anti-inflamatorio",
      "evitar antiinflamatorio", "evitar anti-inflamatorio",
    ],
  },
];

// Índice rápido por conceptId
export const CLINICAL_NLP_BY_ID: Record<string, ClinicalNlpConcept> =
  Object.fromEntries(CLINICAL_NLP_DICTIONARY.map((c) => [c.conceptId, c]));
