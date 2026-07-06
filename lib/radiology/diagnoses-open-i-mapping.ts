/**
 * Mapeamento Global de Diagnósticos → Open-i
 * Fase 1 (P0): Apenas Tuberculose e Pneumonia Adquirida na Comunidade
 *
 * Cada diagnóstico contém:
 * - diagnosisKey: chave interna para identificação
 * - aliases_pt: variações em português
 * - aliases_en: variações em inglês
 * - open_i_queries: queries em ordem de prioridade para Open-i
 * - expected_keywords: termos positivos fortes (+50 pontos)
 * - secondary_keywords: termos positivos secundários (+20 pontos)
 * - excluded_keywords: termos bloqueadores (-100 pontos)
 * - critical_blockers: termos incompatíveis graves (-200 pontos)
 * - min_score: score mínimo para aceitar imagem
 * - accepts_normal_cxr: se radiografia normal é aceitável
 * - expected_finding_pt_br: descrição esperada para gabarito
 */

export interface DiagnosisConfig {
  diagnosisKey: string;
  aliases_pt: string[];
  aliases_en: string[];
  open_i_queries: string[];
  expected_keywords: string[];
  secondary_keywords?: string[];
  excluded_keywords: string[];
  critical_blockers?: string[];
  min_score: number;
  accepts_normal_cxr: boolean;
  expected_finding_pt_br: string;
}

export const radiologyDiagnosisMapping: Record<string, DiagnosisConfig> = {
  // ============================================================================
  // P0-1: PNEUMONIA ADQUIRIDA NA COMUNIDADE (PAC)
  // ============================================================================
  pneumonia: {
    diagnosisKey: "pneumonia",

    aliases_pt: [
      "Pneumonia adquirida na comunidade",
      "PAC",
      "Pneumonia bacteriana",
      "Pneumonia típica",
      "Pneumonia comunitária",
      "Infecção respiratória baixa",
    ],

    aliases_en: [
      "Community-acquired pneumonia",
      "CAP",
      "Bacterial pneumonia",
      "Lobar pneumonia",
      "Pneumonia",
    ],

    open_i_queries: [
      "pneumonia consolidation",
      "community-acquired pneumonia",
      "lobar pneumonia",
      "bacterial pneumonia",
      "pneumonia chest xray",
      "infiltrate pneumonia",
      "lower lobe pneumonia",
      "consolidation infiltrate",
    ],

    // Termos que indicam forte compatibilidade (+50)
    expected_keywords: [
      "pneumonia",
      "consolidation",
      "consolidative",
      "consolidate",
      "infiltrate",
      "infiltrates",
      "airspace opacity",
      "airspace disease",
      "alveolar opacity",
      "opacity",
      "opacities",
      "lower lobe",
      "basilar",
      "focal opacity",
      "lobar",
      "bacterial",
      "streptococcus",
      "pneumococcal",
      "broncograma aéreo",
      "broncogram",
    ],

    // Termos secundários que reforçam (+20)
    secondary_keywords: [
      "fever",
      "febre",
      "cough",
      "tosse",
      "sputum",
      "escarro",
      "productive",
      "produtiva",
      "acute",
      "aguda",
      "fever",
      "respiratory",
      "respiratório",
      "community",
      "comunitária",
      "acute infection",
      "febrile",
      "febril",
      "crackles",
      "crepitações",
    ],

    // Termos que indicam incompatibilidade (-100)
    excluded_keywords: [
      "normal chest",
      "clear lungs",
      "no focal infiltrate",
      "no focal consolidation",
      "no acute cardiopulmonary abnormality",
      "unremarkable",
      "no pneumonia",
      "chronic",
      "intersticial",
      "interstitial",
      "fibrosis",
      "fibroparenquimatosa",
    ],

    // Termos incompatíveis graves (-200)
    critical_blockers: [
      "pneumoperitoneum",
      "free intraperitoneal air",
      "bowel obstruction",
      "fracture",
      "bone",
      "pneumothorax",
    ],

    // Score mínimo para aceitar imagem
    min_score: 50,

    // Pneumonia requer achado visível
    accepts_normal_cxr: false,

    expected_finding_pt_br: `Radiografia de tórax em PA e perfil mostra infiltrado consolidativo, tipicamente em lobo inferior ou superior, sugestivo de pneumonia bacteriana. Padrão alveolar com broncograma aéreo característico. Consolidação lobar ou segmentar compatível com diagnóstico de pneumonia adquirida na comunidade, podendo incluir cobertura para Streptococcus pneumoniae, Haemophilus influenzae e outros patógenos. Presença de sintomas agudos (febre, tosse produtiva, dispneia), taquipneia, hipoxemia e achados de consolidação à ausculta reforçam o diagnóstico.`,
  },

  // ============================================================================
  // P0-2: TUBERCULOSE PULMONAR
  // ============================================================================
  tuberculosis: {
    diagnosisKey: "tuberculosis",

    aliases_pt: [
      "Tuberculose",
      "tuberculose",
      "Tuberculose pulmonar",
      "tuberculose pulmonar",
      "TB",
      "tb",
      "tb pulmonar",
      "Tuberculose ativa",
      "tuberculose ativa",
      "Tuberculose pulmonar ativa",
      "tuberculose pulmonar ativa",
      "BAAR positivo",
      "Infecção tuberculosa",
      "Tosse crônica com suspeita de tuberculose",
      "Cavitação pulmonar",
      "Lesão cavitária",
    ],

    aliases_en: [
      "Pulmonary tuberculosis",
      "TB",
      "Tuberculosis",
      "Tuberculosis chest xray",
      "Active tuberculosis",
      "AFB positive",
      "Acid-fast bacillus",
    ],

    open_i_queries: [
      "tuberculosis chest xray",
      "pulmonary tuberculosis",
      "upper lobe infiltrate",
      "apical infiltrate tuberculosis",
      "cavitary lesion",
      "cavitation tuberculosis",
      "TB infiltrate",
      "tuberculous infection",
      "miliary tuberculosis",
    ],

    // Termos que indicam forte compatibilidade (+50)
    expected_keywords: [
      "tuberculosis",
      "TB",
      "tuberculous",
      "cavitary",
      "cavity",
      "cavitation",
      "cavern",
      "caverna",
      "apical infiltrate",
      "upper lobe infiltrate",
      "upper lobe",
      "apical",
      "infiltrate",
      "infiltrates",
      "opacity",
      "opacities",
      "granulomatous",
      "granuloma",
      "focal consolidation",
      "consolidation",
      "fibroparenquimatosa",
      "fibrosis",
      "fibroparenquimatous",
    ],

    // Termos secundários (+20)
    secondary_keywords: [
      "chronic cough",
      "tosse crônica",
      "fever",
      "febre",
      "vespertina",
      "vespertine",
      "weight loss",
      "perda de peso",
      "night sweats",
      "sudorese noturna",
      "child",
      "criança",
      "pediatric",
      "pediátrico",
      "active disease",
      "doença ativa",
      "chronic infection",
      "infecção crônica",
      "hemoptysis",
      "hemoptise",
      "constitutional symptoms",
      "sintomas constitucionais",
    ],

    // Termos bloqueadores (-100)
    excluded_keywords: [
      "normal chest",
      "clear lungs",
      "no acute cardiopulmonary abnormality",
      "no focal infiltrate",
      "no findings",
      "no abnormality",
      "unremarkable",
      "resolved",
      "healed",
      "old TB",
      "TB antigo",
      "treated",
      "tratado",
      "intersticial",
      "interstitial",
      "pleural effusion",
      "derrame pleural",
    ],

    // Bloqueadores graves (-200)
    critical_blockers: [
      "pneumoperitoneum",
      "free intraperitoneal air",
      "bowel obstruction",
      "fracture",
      "bone",
      "pneumothorax",
      "pneumotórax",
    ],

    // Score mínimo para TB
    min_score: 50,

    // TB requer achado visível
    accepts_normal_cxr: false,

    expected_finding_pt_br: `Radiografia de tórax evidencia infiltrado opaco nos segmentos apicais e posteriores do lobo superior, frequentemente bilateral e assimétrico, com possível cavitação. Padrão fibroparenquimatoso com opacidades, podendo haver disseminação broncogênica com pequenos nódulos dispersos. Hilomegalia (adenomegalia) pode estar presente. Em formas miliar, distribuição difusa de micronódulos. Achados radiológicos em associação com sintomas constitucionais prolongados (febre vespertina, sudorese noturna, perda de peso), tosse persistente, teste tuberculínico positivo e baciloscopia positiva confirmam diagnóstico de tuberculose pulmonar ativa, requerendo tratamento antituberculoso apropriado e investigação de contatos.`,
  },

  // ============================================================================
  // P1-1: ASMA / CRISE ASMÁTICA
  // ============================================================================
  asthma: {
    diagnosisKey: "asthma",
    aliases_pt: [
      "asma",
      "Asma",
      "crise asmática",
      "broncoespasmo",
      "sibilância",
      "chiado no peito",
    ],
    aliases_en: [
      "asthma",
      "asthma attack",
      "acute asthma",
      "reactive airway disease",
      "bronchospasm",
      "wheeze",
    ],
    open_i_queries: [
      "hyperinflation",
      "pulmonary hyperinflation",
      "peribronchial thickening",
      "bronchial wall thickening",
      "reactive airway disease",
      "normal chest xray",
    ],
    expected_keywords: [
      "hyperinflation",
      "hyperinflated",
      "peribronchial thickening",
      "bronchial wall thickening",
      "reactive airway disease",
      "air trapping",
    ],
    secondary_keywords: [
      "clear lungs",
      "no focal infiltrate",
      "no focal consolidation",
      "no acute cardiopulmonary abnormality",
      "normal",
    ],
    excluded_keywords: [
      "pneumonia",
      "consolidation",
      "consolidative",
      "infiltrate",
      "pleural effusion",
      "pneumothorax",
    ],
    critical_blockers: [
      "mass",
      "malignancy",
      "fracture",
      "bone",
    ],
    min_score: 20,
    accepts_normal_cxr: true,
    expected_finding_pt_br: `Radiografia de tórax frequentemente normal em crise asmática; pode haver sinais indiretos de hiperinsuflação pulmonar e/ou espessamento peribrônquico, sem consolidação focal. Achados radiológicos são inespecíficos e podem ser normais, mas o padrão de hiperinsuflação com espessamento peribrônquico pode estar presente em exacerbações.`,
  },

  // ============================================================================
  // P1-2: DPOC / ENFISEMA
  // ============================================================================
  copd_emphysema: {
    diagnosisKey: "copd_emphysema",
    aliases_pt: [
      "DPOC",
      "dpoc",
      "enfisema",
      "Enfisema",
      "doença pulmonar obstrutiva crônica",
      "exacerbação de DPOC",
      "exacerbação de dpoc",
    ],
    aliases_en: [
      "COPD",
      "emphysema",
      "chronic obstructive pulmonary disease",
      "COPD exacerbation",
      "chronic bronchitis",
    ],
    open_i_queries: [
      "emphysema",
      "COPD chest xray",
      "hyperinflation",
      "flattened diaphragm",
      "chronic obstructive pulmonary disease",
    ],
    expected_keywords: [
      "emphysema",
      "COPD",
      "hyperinflation",
      "flattened diaphragm",
      "increased lung volume",
      "air trapping",
      "barrel chest",
    ],
    secondary_keywords: [
      "chronic",
      "smoking",
      "chronic disease",
      "age",
      "elderly",
    ],
    excluded_keywords: [
      "pneumonia",
      "consolidation",
      "infiltrate",
      "pleural effusion",
      "pneumothorax",
      "acute",
    ],
    critical_blockers: [
      "mass",
      "nodule",
      "malignancy",
      "fracture",
      "bone",
    ],
    min_score: 30,
    accepts_normal_cxr: false,
    expected_finding_pt_br: `Radiografia de tórax pode mostrar hiperinsuflação pulmonar, aumento dos volumes pulmonares, retificação diafragmática e sinais compatíveis com DPOC/enfisema, incluindo possível presença de bolhas enfisematosas.`,
  },

  // ============================================================================
  // P1-3: INSUFICIÊNCIA CARDÍACA / EDEMA PULMONAR
  // ============================================================================
  pulmonary_edema_chf: {
    diagnosisKey: "pulmonary_edema_chf",
    aliases_pt: [
      "insuficiência cardíaca",
      "Insuficiência cardíaca",
      "congestão pulmonar",
      "edema pulmonar",
      "edema agudo de pulmão",
      "ICC",
      "icc",
      "insuficiência cardíaca congestiva",
      "congestão",
    ],
    aliases_en: [
      "congestive heart failure",
      "CHF",
      "pulmonary edema",
      "acute decompensated heart failure",
      "acute heart failure",
      "cardiogenic edema",
    ],
    open_i_queries: [
      "pulmonary edema",
      "congestive heart failure chest xray",
      "CHF chest xray",
      "vascular congestion",
      "interstitial edema",
      "cardiomegaly",
    ],
    expected_keywords: [
      "pulmonary edema",
      "vascular congestion",
      "interstitial edema",
      "CHF",
      "congestive heart failure",
      "cardiomegaly",
      "Kerley",
      "bat wing",
      "butterfly pattern",
    ],
    secondary_keywords: [
      "pleural effusion",
      "enlarged cardiac silhouette",
      "cardiomegalia",
      "cardiac silhouette",
    ],
    excluded_keywords: [
      "pneumonia",
      "consolidation",
      "infiltrate",
      "normal",
    ],
    critical_blockers: [
      "pneumothorax",
      "pneumoperitoneum",
      "bowel obstruction",
      "fracture",
      "bone",
      "mass",
    ],
    min_score: 30,
    accepts_normal_cxr: false,
    expected_finding_pt_br: `Radiografia de tórax pode evidenciar cardiomegalia, congestão vascular pulmonar, edema intersticial/alveolar e, por vezes, derrame pleural, compatíveis com congestão pulmonar por insuficiência cardíaca.`,
  },

  // ============================================================================
  // P1-4: CARDIOMEGALIA
  // ============================================================================
  cardiomegaly: {
    diagnosisKey: "cardiomegaly",
    aliases_pt: [
      "cardiomegalia",
      "Cardiomegalia",
      "aumento da área cardíaca",
      "silhueta cardíaca aumentada",
      "aumento cardíaco",
    ],
    aliases_en: [
      "cardiomegaly",
      "Cardiomegaly",
      "enlarged cardiac silhouette",
      "enlarged heart",
      "cardiac enlargement",
      "big heart",
    ],
    open_i_queries: [
      "cardiomegaly",
      "enlarged cardiac silhouette",
      "enlarged heart",
      "cardiac enlargement",
    ],
    expected_keywords: [
      "cardiomegaly",
      "enlarged cardiac silhouette",
      "enlarged heart",
      "cardiac enlargement",
      "cardiothoracic ratio",
      "increased heart size",
    ],
    secondary_keywords: [
      "CHF",
      "vascular congestion",
      "pulmonary edema",
      "cardiac",
    ],
    excluded_keywords: [
      "normal heart size",
      "normal cardiac",
      "no acute cardiopulmonary abnormality",
    ],
    critical_blockers: [
      "pneumothorax",
      "pneumoperitoneum",
      "fracture",
      "bone",
      "mass",
    ],
    min_score: 35,
    accepts_normal_cxr: false,
    expected_finding_pt_br: `Radiografia de tórax pode mostrar aumento da silhueta cardíaca, compatível com cardiomegalia, podendo estar associada a sinais de congestão pulmonar conforme o contexto clínico.`,
  },

  // ============================================================================
  // P1-5: BRONQUIOLITE
  // ============================================================================
  bronchiolitis: {
    diagnosisKey: "bronchiolitis",
    aliases_pt: [
      "bronquiolite",
      "Bronquiolite",
      "bronquiolite viral",
      "lactente chiando",
      "lactente com sibilância",
    ],
    aliases_en: [
      "bronchiolitis",
      "Bronchiolitis",
      "viral bronchiolitis",
      "acute bronchiolitis",
      "RSV bronchiolitis",
      "small airways disease",
    ],
    open_i_queries: [
      "bronchiolitis chest xray",
      "hyperinflation",
      "peribronchial thickening",
      "viral bronchiolitis",
      "small airways disease",
      "perihilar infiltrate",
    ],
    expected_keywords: [
      "bronchiolitis",
      "hyperinflation",
      "peribronchial thickening",
      "bronchial wall thickening",
      "small airways disease",
      "air trapping",
      "perihilar",
    ],
    secondary_keywords: [
      "atelectasis",
      "viral",
      "infant",
      "child",
      "pediatric",
      "criança",
      "lactente",
    ],
    excluded_keywords: [
      "lobar consolidation",
      "consolidation",
      "infiltrate",
      "normal",
    ],
    critical_blockers: [
      "mass",
      "pneumothorax",
      "pleural effusion",
      "fracture",
      "bone",
    ],
    min_score: 20,
    accepts_normal_cxr: true,
    expected_finding_pt_br: `Radiografia de tórax na bronquiolite pode ser normal ou mostrar hiperinsuflação, espessamento peribrônquico/perihilar e pequenas atelectasias, sem consolidação lobar típica. Padrão é de doença de pequenas vias aéreas em lactentes e crianças pequenas.`,
  },

  // ============================================================================
  // P2B-1: DERRAME PLEURAL / PLEURAL EFFUSION
  // ============================================================================
  pleural_effusion: {
    diagnosisKey: "pleural_effusion",

    aliases_pt: [
      "derrame pleural",
      "Derrame pleural",
      "líquido pleural",
      "efusão pleural",
      "derrame pleural direito",
      "derrame pleural esquerdo",
      "derrame pleural bilateral",
      "síndrome pleural",
    ],

    aliases_en: [
      "pleural effusion",
      "Pleural effusion",
      "pleural fluid",
      "right pleural effusion",
      "left pleural effusion",
      "bilateral pleural effusion",
      "serous effusion",
      "pleural syndrome",
    ],

    open_i_queries: [
      "pleural effusion",
      "right pleural effusion",
      "left pleural effusion",
      "bilateral pleural effusion",
      "costophrenic angle blunting",
      "pleural fluid",
      "pleural fluid accumulation",
      "meniscus sign",
    ],

    expected_keywords: [
      "pleural effusion",
      "effusion",
      "pleural fluid",
      "costophrenic angle",
      "blunting",
      "meniscus",
      "layering effusion",
      "opacification",
      "basilar opacity",
    ],

    secondary_keywords: [
      "basilar",
      "lower lobe",
      "opacity",
      "atelectasis",
      "small effusion",
      "bilateral",
      "right sided",
      "left sided",
      "blunted",
    ],

    excluded_keywords: [
      "pneumothorax",
      "pneumoperitoneum",
      "bowel obstruction",
      "fracture",
      "bone",
      "no pleural effusion",
      "clear lungs",
      "no acute cardiopulmonary abnormality",
      "normal chest",
    ],

    critical_blockers: [
      "mass",
      "neoplasm",
      "free air",
      "subphrenic air",
    ],

    min_score: 50,
    accepts_normal_cxr: false,
    expected_finding_pt_br: `Radiografia de tórax pode evidenciar velamento basal, apagamento do seio costofrênico e sinal do menisco, achados compatíveis com derrame pleural.`,
  },

  // ============================================================================
  // P2B-2: ATELECTASIA / ATELECTASIS
  // ============================================================================
  atelectasis: {
    diagnosisKey: "atelectasis",

    aliases_pt: [
      "atelectasia",
      "Atelectasia",
      "atelectasia pulmonar",
      "atelectasia lobar",
      "atelectasia subsegmentar",
      "colapso pulmonar parcial",
      "opacidade linear",
      "atelectasia laminar",
      "collapse pulmonar",
    ],

    aliases_en: [
      "atelectasis",
      "Atelectasis",
      "lobar atelectasis",
      "subsegmental atelectasis",
      "linear atelectasis",
      "plate-like atelectasis",
      "pulmonary collapse",
      "airway obstruction collapse",
    ],

    open_i_queries: [
      "atelectasis",
      "lobar atelectasis",
      "subsegmental atelectasis",
      "linear atelectasis",
      "plate-like atelectasis",
      "volume loss",
      "collapsed lung",
      "discoid atelectasis",
    ],

    expected_keywords: [
      "atelectasis",
      "lobar atelectasis",
      "subsegmental atelectasis",
      "linear atelectasis",
      "plate-like atelectasis",
      "volume loss",
      "collapse",
      "linear opacity",
      "basilar opacity",
    ],

    secondary_keywords: [
      "opacity",
      "discoid atelectasis",
      "low lung volume",
      "elevated hemidiaphragm",
      "shifted",
      "deviator",
      "subsegmental",
      "lobar",
    ],

    excluded_keywords: [
      "pneumothorax",
      "pneumoperitoneum",
      "bowel obstruction",
      "fracture",
      "bone",
      "no atelectasis",
      "clear lungs",
      "no acute cardiopulmonary abnormality",
      "normal chest",
      "consolidation",
    ],

    critical_blockers: [
      "mass",
      "neoplasm",
      "free air",
      "subphrenic air",
    ],

    min_score: 50,
    accepts_normal_cxr: false,
    expected_finding_pt_br: `Radiografia de tórax pode mostrar opacidade linear ou segmentar associada à perda de volume pulmonar, compatível com atelectasia.`,
  },

  // ============================================================================
  // P2B-3: PNEUMOTÓRAX / PNEUMOTHORAX
  // ============================================================================
  pneumothorax: {
    diagnosisKey: "pneumothorax",

    aliases_pt: [
      "pneumotórax",
      "Pneumotórax",
      "pneumotorax",
      "Pneumotorax",
      "pneumotórax espontâneo",
      "pneumotorax espontaneo",
      "colapso pulmonar",
      "pulmão colapsado",
      "dor torácica súbita com dispneia",
      "dor torácica súbita",
    ],

    aliases_en: [
      "pneumothorax",
      "Pneumothorax",
      "spontaneous pneumothorax",
      "apical pneumothorax",
      "right pneumothorax",
      "left pneumothorax",
      "collapsed lung",
      "pleural air",
    ],

    open_i_queries: [
      "pneumothorax",
      "spontaneous pneumothorax",
      "apical pneumothorax",
      "right pneumothorax",
      "left pneumothorax",
      "collapsed lung",
      "pleural line pneumothorax",
      "no lung markings pneumothorax",
      "pneumothorax chest xray",
    ],

    expected_keywords: [
      "pneumothorax",
      "apical pneumothorax",
      "spontaneous pneumothorax",
      "pleural line",
      "collapsed lung",
      "lung collapse",
      "no lung markings",
      "absent lung markings",
      "visceral pleural line",
      "pneumothorax",
    ],

    secondary_keywords: [
      "hyperlucency",
      "apical lucency",
      "peripheral lucency",
      "decreased vascular markings",
      "partial collapse",
      "small pneumothorax",
      "right pneumothorax",
      "left pneumothorax",
      "spontaneous",
    ],

    excluded_keywords: [
      "no pneumothorax",
      "without pneumothorax",
      "no acute cardiopulmonary abnormality",
      "clear lungs",
      "pleural effusion",
      "pneumonia",
      "consolidation",
      "pneumoperitoneum",
      "bowel obstruction",
      "fracture",
      "bone",
      "normal chest",
    ],

    critical_blockers: [
      "mass",
      "neoplasm",
      "free air",
      "subphrenic air",
    ],

    min_score: 50,
    accepts_normal_cxr: false,
    expected_finding_pt_br: `Radiografia de tórax pode mostrar linha pleural visível, ausência de marcas vasculares periféricas e colapso parcial do pulmão, achados compatíveis com pneumotórax.`,
  },

};

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

/**
 * Resolve o diagnosisKey a partir do diagnóstico clínico
 * Busca correspondência em aliases para encontrar a config correta
 */
export function resolveDiagnosisKey(diagnosisPtBr: string): string | null {
  const diagnosisBuscado = diagnosisPtBr.toLowerCase().trim();

  for (const [key, config] of Object.entries(radiologyDiagnosisMapping)) {
    // Verificar em aliases_pt
    if (
      config.aliases_pt.some((alias) => diagnosisBuscado.includes(alias.toLowerCase()))
    ) {
      return key;
    }

    // Verificar em aliases_en (para casos bilíngues)
    if (
      config.aliases_en.some((alias) => diagnosisBuscado.includes(alias.toLowerCase()))
    ) {
      return key;
    }
  }

  return null;
}

/**
 * Obtém a configuração de diagnóstico pela chave
 */
export function getDiagnosisConfig(diagnosisKey: string): DiagnosisConfig | null {
  return radiologyDiagnosisMapping[diagnosisKey] || null;
}

/**
 * Lista todos os diagnosisKeys disponíveis
 */
export function listarDiagnosisKeysDisponiveis(): string[] {
  return Object.keys(radiologyDiagnosisMapping);
}
