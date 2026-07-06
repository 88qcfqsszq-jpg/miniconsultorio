// ============================================================================
// Exame Físico Adulto Visual — mapa de abas, subabas, ações e achados
// ----------------------------------------------------------------------------
// Estrutura clínica OSCE: abas principais → (subabas) → ações → achados
// possíveis. Ao clicar numa ação o aluno escolhe um achado, que é registrado
// no formato padronizado "[Exame Visual] <caminho> — <Ação>: <achado>".
// Esta etapa é apenas reorganização visual + padronização; não altera
// HealthBench, nota, feedback, casos ou ECG.
// ============================================================================

export type CategoriaExameAdulto =
  | "geral"
  | "cardiovascular"
  | "respiratorio"
  | "abdominal"
  | "membros";

export interface AcaoExameAdulto {
  id: string;
  label: string;
  achadosPossiveis: string[];
  // Imagem opcional da manobra (Fase Visual futura). Ausente nesta etapa.
  visualAsset?: string;
}

/**
 * Infere o tipo da manobra pelo verbo do label (para o box de visualização).
 */
export function getTipoManobra(label: string): string {
  const t = (label || "").toLowerCase();
  if (t.includes("inspecionar")) return "Inspeção";
  if (t.includes("palpar")) return "Palpação";
  if (t.includes("auscultar")) return "Ausculta";
  if (t.includes("percutir")) return "Percussão";
  if (t.includes("pesquisar")) return "Sinal clínico";
  if (t.includes("avaliar")) return "Avaliação clínica";
  return "Manobra clínica";
}

export interface SubAbaExameAdulto {
  id: string;
  label: string;
  categoria: CategoriaExameAdulto;
  acoes: AcaoExameAdulto[];
}

export interface AbaExameAdulto {
  id: string;
  label: string;
  categoria: CategoriaExameAdulto;
  acoes?: AcaoExameAdulto[];
  subabas?: SubAbaExameAdulto[];
}

// Hotspot na imagem do corpo: ao clicar, seleciona aba (e subaba quando houver).
export interface HotspotAdulto {
  x: number; // % do container
  y: number;
  label: string;
  mainTab: string;
  subTab?: string;
}

const a = (
  id: string,
  label: string,
  achadosPossiveis: string[]
): AcaoExameAdulto => ({ id, label, achadosPossiveis });

export const MAPA_EXAME_ADULTO: AbaExameAdulto[] = [
  {
    id: "geral",
    label: "Geral",
    categoria: "geral",
    acoes: [
      a("estado_geral", "Inspecionar estado geral", [
        "Bom estado geral",
        "Regular estado geral",
        "Mau estado geral",
        "Fácies de dor",
        "Paciente ansioso",
        "Paciente prostrado",
        "Paciente sudorético",
      ]),
      a("consciencia", "Avaliar nível de consciência e orientação", [
        "Alerta e orientado",
        "Sonolento",
        "Confuso",
        "Rebaixamento leve do nível de consciência",
      ]),
      a("padrao_respiratorio_geral", "Avaliar padrão respiratório geral", [
        "Eupneico",
        "Taquipneico",
        "Dispneico em repouso",
        "Uso de musculatura acessória",
        "Fala entrecortada",
      ]),
      a("coloracao_pele", "Avaliar coloração geral da pele", [
        "Corado",
        "Palidez cutânea",
        "Cianose central",
        "Icterícia cutânea",
        "Pele fria e pegajosa",
      ]),
      a("hidratacao", "Avaliar hidratação", [
        "Hidratado",
        "Mucosas discretamente secas",
        "Desidratação leve/moderada",
        "Sinais de hipoperfusão",
      ]),
      a("perfusao_global", "Avaliar perfusão periférica global", [
        "Extremidades bem perfundidas",
        "Tempo de enchimento capilar aumentado",
        "Extremidades frias",
        "Pele marmórea",
      ]),
    ],
  },
  {
    id: "cabeca",
    label: "Cabeça",
    categoria: "geral",
    subabas: [
      {
        id: "face_cranio",
        label: "Face/Crânio",
        categoria: "geral",
        acoes: [
          a("facies", "Inspecionar fácies", [
            "Fácies sem alterações",
            "Fácies de dor",
            "Fácies de cansaço",
            "Fácies ansiosa",
            "Fácies toxemiada",
          ]),
          a("simetria_facial", "Inspecionar simetria facial", []),
          a("cranio_couro", "Inspecionar crânio e couro cabeludo", []),
          a("seios_face", "Palpar seios da face", []),
          a("dor_facial", "Avaliar dor facial", []),
        ],
      },
      {
        id: "olhos",
        label: "Olhos",
        categoria: "geral",
        acoes: [
          a("conjuntivas", "Inspecionar conjuntivas", [
            "Conjuntivas coradas",
            "Palidez conjuntival leve",
            "Palidez conjuntival moderada/importante",
          ]),
          a("escleras", "Inspecionar escleras", [
            "Escleras anictéricas",
            "Icterícia escleral discreta",
            "Icterícia escleral evidente",
          ]),
          a("pupilas", "Inspecionar pupilas", []),
          a("reflexo_fotomotor", "Avaliar reflexo fotomotor", []),
          a("movimentos_oculares", "Avaliar movimentos oculares", []),
          a("edema_palpebral", "Inspecionar edema palpebral", []),
        ],
      },
      {
        id: "boca_orofaringe",
        label: "Boca/Orofaringe",
        categoria: "geral",
        acoes: [
          a("labios", "Inspecionar lábios", []),
          a("mucosa_oral", "Inspecionar mucosa oral", []),
          a("lingua", "Inspecionar língua", []),
          a("gengivas", "Inspecionar gengivas", []),
          a("palato", "Inspecionar palato", []),
          a("orofaringe", "Inspecionar orofaringe", [
            "Orofaringe sem alterações",
            "Hiperemia de orofaringe",
            "Exsudato amigdaliano",
            "Petéquias em palato",
            "Sangramento gengival discreto",
          ]),
          a("amigdalas", "Inspecionar amígdalas", []),
          a("sangramento_oral", "Pesquisar sangramento oral", []),
          a("hidratacao_mucosa_oral", "Avaliar hidratação de mucosa oral", []),
        ],
      },
      {
        id: "ouvidos",
        label: "Ouvidos",
        categoria: "geral",
        acoes: [
          a("pavilhao_auricular", "Inspecionar pavilhão auricular", []),
          a("conduto_auditivo", "Inspecionar conduto auditivo externo", []),
          a("dor_tracao_pavilhao", "Avaliar dor à tração do pavilhão auricular", []),
          a("dor_tragus", "Avaliar dor à pressão do tragus", []),
          a("otorreia", "Pesquisar otorreia", []),
          a("acuidade_auditiva", "Avaliar acuidade auditiva grosseira", []),
        ],
      },
    ],
  },
  {
    id: "pescoco",
    label: "Pescoço",
    categoria: "geral",
    acoes: [
      a("turgencia_jugular", "Inspecionar turgência jugular", [
        "Sem turgência jugular",
        "Turgência jugular discreta",
        "Turgência jugular evidente a 45 graus",
        "Pulso venoso jugular visível",
      ]),
      a("linfonodos_cervicais", "Palpar linfonodos cervicais", [
        "Sem linfonodomegalias",
        "Linfonodos cervicais pequenos e móveis",
        "Linfonodomegalia cervical dolorosa",
        "Linfonodomegalia endurecida/persistente",
      ]),
      a("pulsos_carotideos", "Avaliar pulsos carotídeos", [
        "Pulsos carotídeos simétricos",
        "Pulso carotídeo diminuído",
        "Pulso carotídeo amplo",
        "Pulso parvus et tardus",
      ]),
      a("ausculta_carotidas", "Auscultar carótidas", [
        "Sem sopros carotídeos",
        "Sopro carotídeo presente",
      ]),
      a("tireoide", "Palpar tireoide", [
        "Tireoide não aumentada",
        "Bócio palpável",
        "Nódulo tireoidiano palpável",
      ]),
    ],
  },
  {
    id: "torax",
    label: "Tórax",
    categoria: "respiratorio",
    subabas: [
      {
        id: "cardiovascular",
        label: "Cardiovascular",
        categoria: "cardiovascular",
        acoes: [
          a("inspecionar_precordio", "Inspecionar precórdio", [
            "Precórdio sem abaulamentos",
            "Ictus visível",
            "Impulsões precordiais",
            "Cicatriz cirúrgica torácica",
          ]),
          a("palpar_ictus", "Palpar ictus cordis", [
            "Ictus não visível e palpável em localização habitual",
            "Ictus desviado lateralmente",
            "Ictus propulsivo/hiperdinâmico",
            "Ictus difuso",
          ]),
          a("palpar_fremitos", "Palpar frêmitos cardíacos", [
            "Sem frêmitos",
            "Frêmito sistólico em foco aórtico",
            "Frêmito em foco mitral",
          ]),
          a("auscultar_focos", "Auscultar focos cardíacos", [
            "Bulhas normofonéticas",
            "Bulhas hipofonéticas",
            "B1 hiperfonética",
            "B2 reduzida",
            "B3 presente",
            "B4 presente",
            "Ritmo regular",
            "Ritmo irregular",
          ]),
          a("pesquisar_sopros", "Pesquisar sopros", [
            "Sem sopros",
            "Sopro sistólico ejetivo em foco aórtico",
            "Sopro sistólico irradiado para carótidas",
            "Sopro holossistólico em foco mitral",
            "Sopro diastólico em ruflar mitral",
            "Sopro diastólico aspirativo em borda esternal esquerda",
          ]),
          a("atrito_pericardico", "Pesquisar atrito pericárdico", [
            "Ausência de atrito",
            "Atrito pericárdico audível",
          ]),
        ],
      },
      {
        id: "respiratorio_anterior",
        label: "Respiratório Anterior",
        categoria: "respiratorio",
        acoes: [
          a("padrao_respiratorio", "Inspecionar padrão respiratório", [
            "Eupneia",
            "Taquipneia",
            "Respiração superficial",
            "Fala entrecortada",
            "Postura em tripé",
          ]),
          a("esforco_respiratorio", "Avaliar esforço respiratório", [
            "Sem esforço respiratório",
            "Tiragens intercostais leves",
            "Tiragens importantes",
            "Uso de musculatura acessória",
            "Batimento de asa nasal leve",
            "Batimento de asa nasal evidente",
          ]),
          a("expansibilidade_anterior", "Avaliar expansibilidade torácica anterior", [
            "Expansibilidade preservada",
            "Expansibilidade reduzida bilateral",
            "Expansibilidade reduzida unilateral",
          ]),
          a("auscultar_anterior", "Auscultar tórax anterior", [
            "Murmúrio vesicular presente bilateralmente",
            "Murmúrio vesicular reduzido",
            "Sibilos difusos",
            "Roncos",
            "Crepitações",
            "Ausculta globalmente silenciosa",
          ]),
        ],
      },
      {
        id: "respiratorio_posterior",
        label: "Respiratório Posterior",
        categoria: "respiratorio",
        acoes: [
          a("inspecionar_posterior", "Inspecionar tórax posterior", [
            "Sem deformidades",
            "Uso de musculatura acessória posterior",
            "Assimetria da expansibilidade",
            "Cifose aumentada",
          ]),
          a("expansibilidade_posterior", "Avaliar expansibilidade posterior", [
            "Expansibilidade preservada",
            "Expansibilidade reduzida em base direita",
            "Expansibilidade reduzida em base esquerda",
            "Expansibilidade reduzida bilateral",
          ]),
          a("fremito_toracovocal", "Palpar frêmito toracovocal", [
            "Frêmito toracovocal preservado",
            "Frêmito aumentado em foco de consolidação",
            "Frêmito reduzido em base pulmonar",
            "Frêmito reduzido difusamente",
          ]),
          a("percutir_posterior", "Percutir tórax posterior", [
            "Som claro pulmonar",
            "Macicez localizada",
            "Macicez em base",
            "Hipersonoridade difusa",
          ]),
          a("auscultar_posterior", "Auscultar tórax posterior", [
            "Murmúrio vesicular preservado",
            "Murmúrio vesicular reduzido em base",
            "Crepitações localizadas",
            "Crepitações bibasais",
            "Sibilos difusos",
            "Roncos",
            "Sopro tubário",
            "Atrito pleural",
          ]),
        ],
      },
    ],
  },
  {
    id: "abdome",
    label: "Abdome",
    categoria: "abdominal",
    acoes: [
      a("inspecionar_abdome", "Inspecionar abdome", [
        "Abdome plano",
        "Abdome globoso",
        "Abdome distendido",
        "Circulação colateral",
        "Equimoses",
        "Petéquias",
      ]),
      a("ruidos_hidroaereos", "Auscultar ruídos hidroaéreos", [
        "Ruídos hidroaéreos presentes",
        "Ruídos aumentados",
        "Ruídos reduzidos",
        "Ruídos ausentes",
      ]),
      a("sopros_abdominais", "Auscultar sopros abdominais", [
        "Sem sopros",
        "Sopro abdominal presente",
      ]),
      a("percutir_abdome", "Percutir abdome", [
        "Timpanismo fisiológico",
        "Macicez em flancos",
        "Dor à percussão",
        "Sinais sugestivos de ascite",
      ]),
      a("palpar_superficial", "Palpar superficialmente", [
        "Abdome indolor",
        "Dor localizada",
        "Defesa voluntária",
        "Defesa involuntária",
      ]),
      a("palpar_profundo", "Palpar profundamente", [
        "Sem massas",
        "Dor profunda",
        "Massa palpável",
        "Hepatomegalia",
        "Esplenomegalia",
      ]),
      a("blumberg", "Pesquisar Blumberg", [
        "Blumberg negativo",
        "Blumberg positivo",
      ]),
      a("murphy", "Pesquisar Murphy", ["Murphy negativo", "Murphy positivo"]),
      a("hepatomegalia", "Pesquisar hepatomegalia", [
        "Fígado não palpável",
        "Borda hepática palpável",
        "Hepatomegalia dolorosa",
      ]),
      a("esplenomegalia", "Pesquisar esplenomegalia", [
        "Baço não palpável",
        "Esplenomegalia",
      ]),
      a("ascite", "Pesquisar ascite", [
        "Sem sinais de ascite",
        "Macicez móvel",
        "Sinal do piparote positivo",
      ]),
    ],
  },
  {
    id: "vascular_membros",
    label: "Vascular/Membros",
    categoria: "membros",
    subabas: [
      {
        id: "membros_superiores",
        label: "Membros superiores",
        categoria: "membros",
        acoes: [
          a("inspecionar_maos", "Inspecionar mãos e unhas", [
            "Sem alterações",
            "Palidez palmar",
            "Cianose periférica",
            "Baqueteamento digital",
            "Hemorragias subungueais",
            "Lesões de Janeway",
            "Nódulos de Osler",
          ]),
          a("tec_superior", "Avaliar tempo de enchimento capilar", [
            "Enchimento capilar normal",
            "Enchimento capilar lentificado",
          ]),
          a("pulsos_radiais", "Palpar pulsos radiais", [
            "Pulsos radiais presentes e simétricos",
            "Pulso irregular",
            "Pulsos diminuídos",
            "Pulsos assimétricos",
          ]),
          a("temperatura_ms", "Avaliar temperatura das extremidades superiores", [
            "Extremidades aquecidas",
            "Extremidades frias",
          ]),
          a("sinais_articulares", "Procurar sinais articulares", [
            "Sem artrite",
            "Artralgia referida",
            "Artrite migratória",
            "Edema articular",
          ]),
        ],
      },
      {
        id: "membros_inferiores",
        label: "Membros inferiores",
        categoria: "membros",
        acoes: [
          a("inspecionar_mi", "Inspecionar membros inferiores", [
            "Sem alterações",
            "Edema unilateral",
            "Edema bilateral",
            "Assimetria de panturrilhas",
            "Varizes",
            "Dermatite ocre",
            "Úlcera venosa",
            "Pele pálida/fria",
            "Cianose distal",
          ]),
          a("palpar_edema", "Palpar edema", [
            "Sem edema",
            "Edema com cacifo +/4+",
            "Edema com cacifo ++/4+",
            "Edema importante",
            "Edema unilateral doloroso",
          ]),
          a("palpar_panturrilhas", "Palpar panturrilhas", [
            "Panturrilhas indolores",
            "Dor à palpação de panturrilha",
            "Empastamento de panturrilha",
            "Aumento de temperatura local",
          ]),
          a("pulsos_perifericos", "Avaliar pulsos periféricos", [
            "Pulsos presentes e simétricos",
            "Pulsos femorais presentes",
            "Pulsos poplíteos presentes",
            "Pulsos pediosos diminuídos",
            "Pulsos tibiais posteriores diminuídos",
            "Pulsos ausentes distalmente",
            "Pulsos assimétricos",
          ]),
          a("temperatura_pes", "Avaliar temperatura e perfusão dos pés", [
            "Pés aquecidos e bem perfundidos",
            "Pé frio",
            "Palidez distal",
            "Tempo de enchimento capilar aumentado",
          ]),
          a("insuficiencia_venosa", "Pesquisar sinais de insuficiência venosa", [
            "Varizes superficiais",
            "Edema vespertino",
            "Dermatite ocre",
            "Lipodermatoesclerose",
            "Úlcera maleolar medial",
          ]),
          a("doenca_arterial", "Pesquisar sinais de doença arterial periférica", [
            "Pele fria e brilhante",
            "Redução de pelos",
            "Pulsos diminuídos",
            "Palidez à elevação",
            "Rubor pendente",
          ]),
        ],
      },
    ],
  },
];

// Hotspots na imagem frontal do corpo (coordenadas % aproximadas; ajustáveis).
// Clicar seleciona a aba principal e, quando aplicável, a subaba.
export const HOTSPOTS_ADULTO: HotspotAdulto[] = [
  { x: 50, y: 7, label: "Cabeça / Face", mainTab: "cabeca", subTab: "face_cranio" },
  { x: 50, y: 11, label: "Olhos", mainTab: "cabeca", subTab: "olhos" },
  { x: 50, y: 18, label: "Pescoço", mainTab: "pescoco" },
  { x: 50, y: 30, label: "Precórdio", mainTab: "torax", subTab: "cardiovascular" },
  { x: 38, y: 35, label: "Tórax anterior", mainTab: "torax", subTab: "respiratorio_anterior" },
  { x: 62, y: 35, label: "Tórax posterior", mainTab: "torax", subTab: "respiratorio_posterior" },
  { x: 50, y: 46, label: "Abdome", mainTab: "abdome" },
  { x: 24, y: 52, label: "Membros superiores", mainTab: "vascular_membros", subTab: "membros_superiores" },
  { x: 50, y: 76, label: "Membros inferiores", mainTab: "vascular_membros", subTab: "membros_inferiores" },
];

// Descrições técnicas NORMAIS por ação (Fase 1). Na Fase 2 serão substituídas
// por achados dependentes do caso ativo.
const DESCRICAO_NORMAL: Record<string, string> = {
  // GERAL
  estado_geral: "Paciente em bom estado geral aparente.",
  consciencia: "Paciente alerta, consciente e orientado.",
  padrao_respiratorio_geral:
    "Padrão respiratório eupneico, sem sinais de desconforto respiratório evidente.",
  coloracao_pele: "Pele normocorada, sem cianose ou icterícia evidente.",
  hidratacao: "Paciente clinicamente hidratado.",
  perfusao_global:
    "Extremidades bem perfundidas, sem sinais evidentes de hipoperfusão.",
  // CABEÇA > FACE/CRÂNIO
  facies: "Fácies atípica, sem sinais de dor intensa ou toxemia.",
  simetria_facial: "Face simétrica, sem desvios aparentes.",
  cranio_couro: "Crânio e couro cabeludo sem alterações aparentes.",
  seios_face: "Seios da face indolores à palpação.",
  dor_facial: "Ausência de dor facial evidente.",
  // CABEÇA > OLHOS
  conjuntivas: "Conjuntivas normocoradas.",
  escleras: "Escleras anictéricas.",
  pupilas: "Pupilas isocóricas e fotorreagentes.",
  reflexo_fotomotor: "Reflexo fotomotor direto e consensual preservados.",
  movimentos_oculares: "Movimentos oculares extrínsecos preservados.",
  edema_palpebral: "Ausência de edema palpebral.",
  // CABEÇA > BOCA/OROFARINGE
  labios: "Lábios sem cianose, sem lesões aparentes.",
  mucosa_oral: "Mucosa oral úmida e normocorada.",
  lingua: "Língua sem alterações grosseiras.",
  gengivas: "Gengivas sem sangramento ativo.",
  palato: "Palato sem petéquias ou lesões aparentes.",
  orofaringe:
    "Orofaringe sem hiperemia importante, exsudato ou lesões aparentes.",
  amigdalas: "Amígdalas sem hipertrofia importante ou exsudato.",
  sangramento_oral: "Ausência de sangramento oral ativo.",
  hidratacao_mucosa_oral:
    "Mucosa oral úmida, sem sinais evidentes de desidratação.",
  // CABEÇA > OUVIDOS
  pavilhao_auricular:
    "Pavilhão auricular sem deformidades, hiperemia ou lesões aparentes.",
  conduto_auditivo:
    "Conduto auditivo externo sem secreção ou obstrução evidente.",
  dor_tracao_pavilhao: "Ausência de dor à tração do pavilhão auricular.",
  dor_tragus: "Ausência de dor à pressão do tragus.",
  otorreia: "Ausência de otorreia.",
  acuidade_auditiva: "Acuidade auditiva grosseiramente preservada.",
  // PESCOÇO
  turgencia_jugular: "Ausência de turgência jugular patológica.",
  linfonodos_cervicais: "Ausência de linfonodomegalias cervicais palpáveis.",
  pulsos_carotideos: "Pulsos carotídeos palpáveis e simétricos.",
  ausculta_carotidas: "Ausência de sopros carotídeos.",
  tireoide: "Tireoide sem aumento palpável evidente.",
  // TÓRAX > CARDIOVASCULAR
  inspecionar_precordio: "Precórdio sem abaulamentos ou impulsões visíveis.",
  palpar_ictus: "Ictus cordis em localização habitual, sem desvio evidente.",
  palpar_fremitos: "Ausência de frêmitos cardíacos palpáveis.",
  auscultar_focos: "Bulhas rítmicas, normofonéticas, sem sopros evidentes.",
  pesquisar_sopros: "Sem sopros cardíacos audíveis.",
  atrito_pericardico: "Ausência de atrito pericárdico audível.",
  // TÓRAX > RESPIRATÓRIO ANTERIOR
  padrao_respiratorio: "Padrão respiratório sem alterações evidentes.",
  esforco_respiratorio:
    "Sem tiragens, batimento de asa nasal ou uso evidente de musculatura acessória.",
  expansibilidade_anterior:
    "Expansibilidade torácica anterior preservada e simétrica.",
  auscultar_anterior:
    "Murmúrio vesicular presente bilateralmente, sem ruídos adventícios.",
  // TÓRAX > RESPIRATÓRIO POSTERIOR
  inspecionar_posterior:
    "Tórax posterior sem deformidades ou assimetrias evidentes.",
  expansibilidade_posterior:
    "Expansibilidade torácica posterior preservada e simétrica.",
  fremito_toracovocal: "Frêmito toracovocal preservado e simétrico.",
  percutir_posterior: "Som claro pulmonar bilateral à percussão.",
  auscultar_posterior:
    "Murmúrio vesicular presente bilateralmente, sem crepitações, sibilos ou roncos.",
  // ABDOME
  inspecionar_abdome:
    "Abdome plano ou discretamente globoso, sem distensão importante.",
  ruidos_hidroaereos: "Ruídos hidroaéreos presentes.",
  sopros_abdominais: "Ausência de sopros abdominais.",
  percutir_abdome: "Percussão abdominal sem macicez patológica evidente.",
  palpar_superficial: "Abdome indolor à palpação superficial, sem defesa.",
  palpar_profundo:
    "Abdome sem massas palpáveis ou dor profunda evidente.",
  blumberg: "Sinal de Blumberg negativo.",
  murphy: "Sinal de Murphy negativo.",
  hepatomegalia: "Fígado não palpável ou sem hepatomegalia evidente.",
  esplenomegalia: "Baço não palpável.",
  ascite: "Sem sinais clínicos evidentes de ascite.",
  // VASCULAR/MEMBROS > MEMBROS SUPERIORES
  inspecionar_maos:
    "Mãos e unhas sem cianose, baqueteamento ou lesões aparentes.",
  tec_superior: "Tempo de enchimento capilar preservado.",
  pulsos_radiais: "Pulsos radiais presentes e simétricos.",
  temperatura_ms: "Extremidades superiores aquecidas e bem perfundidas.",
  sinais_articulares: "Ausência de artrite ou edema articular evidente.",
  // VASCULAR/MEMBROS > MEMBROS INFERIORES
  inspecionar_mi: "Membros inferiores sem alterações visíveis importantes.",
  palpar_edema: "Ausência de edema com cacifo em membros inferiores.",
  palpar_panturrilhas: "Panturrilhas indolores, sem empastamento evidente.",
  pulsos_perifericos: "Pulsos periféricos palpáveis e simétricos.",
  temperatura_pes: "Pés aquecidos e bem perfundidos.",
  insuficiencia_venosa:
    "Sem varizes importantes, dermatite ocre ou úlcera venosa aparente.",
  doenca_arterial:
    "Sem sinais tróficos evidentes de doença arterial periférica.",
};

/**
 * Texto técnico NORMAL para uma ação (Fase 1). Fallback genérico se não mapeada.
 */
export function getDescricaoTecnicaNormal(actionId: string): string {
  return (
    DESCRICAO_NORMAL[actionId] ||
    "Manobra realizada, sem alteração clínica evidente nesta etapa."
  );
}

// Ordem canônica dos caminhos (para agrupar/exibir os achados registrados).
export const ORDEM_CAMINHOS: string[] = [
  "Geral",
  "Cabeça > Face/Crânio",
  "Cabeça > Olhos",
  "Cabeça > Boca/Orofaringe",
  "Cabeça > Ouvidos",
  "Pescoço",
  "Tórax > Cardiovascular",
  "Tórax > Respiratório Anterior",
  "Tórax > Respiratório Posterior",
  "Abdome",
  "Vascular/Membros > Membros superiores",
  "Vascular/Membros > Membros inferiores",
];

// Resolve a lista de ações + categoria + rótulo do caminho para a seleção atual.
export function resolverSelecao(
  abaId: string,
  subAbaId: string | null
): {
  acoes: AcaoExameAdulto[];
  categoria: CategoriaExameAdulto;
  caminho: string;
} {
  const aba = MAPA_EXAME_ADULTO.find((x) => x.id === abaId) ?? MAPA_EXAME_ADULTO[0];
  if (aba.subabas && aba.subabas.length > 0) {
    const sub =
      aba.subabas.find((s) => s.id === subAbaId) ?? aba.subabas[0];
    return {
      acoes: sub.acoes,
      categoria: sub.categoria,
      caminho: `${aba.label} > ${sub.label}`,
    };
  }
  return {
    acoes: aba.acoes ?? [],
    categoria: aba.categoria,
    caminho: aba.label,
  };
}
