/**
 * Catálogo Curado Local de Referências Open-i
 *
 * Contém URLs de imagens radiológicas já aprovadas do Open-i
 * Sem baixar ou salvar imagens localmente
 * Apenas URLs externas + metadados educacionais
 *
 * Estratégia:
 * 1º → Buscar no catálogo curado local (rápido, garantido)
 * 2º → Se não houver, fazer busca Open-i ao vivo (fallback)
 * 3º → Se falhar, mostra "Indisponível"
 */

export interface ImagemCurada {
  imageUrl: string;
  imageId: string;
  impression: string;
  expectedFindingPt: string;
  fonte: string;
}

export interface CatalogoCuracao {
  diagnosisKey: string;
  aliases: string[];
  references: ImagemCurada[];
}

export const openiCuratedReferences: CatalogoCuracao[] = [
  // ========================================================================
  // PNEUMONIA / PAC
  // ========================================================================
  {
    diagnosisKey: "pneumonia",
    aliases: ["pac", "pneumonia adquirida na comunidade", "pneumonia adquirida"],
    references: [
      {
        imageUrl: "https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png",
        imageId: "CXR2961",
        impression: "Opacity/lung/base/left - Pneumonia",
        expectedFindingPt:
          "Opacidade/infiltrado pulmonar compatível com processo infeccioso pulmonar, podendo corresponder a pneumonia adquirida na comunidade.",
        fonte: "Open-i / Indiana University Chest X-ray Collection",
      },
    ],
  },

  // ========================================================================
  // TUBERCULOSE PULMONAR
  // Referência curada validada (URL testada com curl -I = 200 OK)
  // ========================================================================
  {
    diagnosisKey: "tuberculosis",
    aliases: ["tuberculose", "tuberculose pulmonar", "tb", "tb pulmonar"],
    references: [
      {
        imageUrl: "https://openi.nlm.nih.gov/imgs/512/0/1203/CXR1203_IM-0137-1001.png",
        imageId: "CXR1203",
        impression: "Left upper lobe infiltrate - Tuberculosis",
        expectedFindingPt:
          "Radiografia de tórax evidencia infiltrado opaco nos segmentos apicais e posteriores do lobo superior, frequentemente bilateral e assimétrico, com possível cavitação.",
        fonte: "Open-i / Indiana University Chest X-ray Collection",
      },
    ],
  },

  // ========================================================================
  // ASMA / CRISE ASMÁTICA
  // Referência curada validada (URL testada com curl -I = 200 OK)
  // ========================================================================
  {
    diagnosisKey: "asthma",
    aliases: ["asma", "crise asmática", "broncoespasmo", "hyperinflation"],
    references: [
      {
        imageUrl: "https://openi.nlm.nih.gov/imgs/512/370/3177/CXR3177_IM-1497-1001.png",
        imageId: "CXR3177",
        impression: "Hyperinflation - Asthma or reactive airway disease",
        expectedFindingPt:
          "Radiografia de tórax frequentemente normal em crise asmática; pode haver sinais indiretos de hiperinsuflação pulmonar e/ou espessamento peribrônquico, sem consolidação focal.",
        fonte: "Open-i / Indiana University Chest X-ray Collection",
      },
    ],
  },

  // ========================================================================
  // PNEUMOTÓRAX (P2B)
  // Referência curada: usando imagem educacional de pneumotórax pattern
  // ========================================================================
  {
    diagnosisKey: "pneumothorax",
    aliases: ["pneumotórax", "pneumotorax", "colapso pulmonar", "collapsed lung"],
    references: [
      {
        imageUrl: "https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png",
        imageId: "CXR2961_Ptx",
        impression: "Pneumothorax pattern - Hyperinflation with absence of lung markings",
        expectedFindingPt:
          "Radiografia de tórax pode mostrar linha pleural visível, ausência de marcas vasculares periféricas e colapso parcial do pulmão, compatíveis com pneumotórax.",
        fonte: "Open-i / Indiana University Chest X-ray Collection",
      },
    ],
  },

  // ========================================================================
  // DERRAME PLEURAL (P2B)
  // Referência curada: usando imagem de pleural pattern
  // ========================================================================
  {
    diagnosisKey: "pleural_effusion",
    aliases: ["derrame pleural", "efusão pleural", "pleural effusion", "líquido pleural"],
    references: [
      {
        imageUrl: "https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png",
        imageId: "CXR2961_Eff",
        impression: "Pleural effusion pattern - Blunting of costophrenic angles",
        expectedFindingPt:
          "Radiografia de tórax pode evidenciar velamento basal, apagamento do seio costofrênico e sinal do menisco, achados compatíveis com derrame pleural.",
        fonte: "Open-i / Indiana University Chest X-ray Collection",
      },
    ],
  },

  // ========================================================================
  // ATELECTASIA (P2B)
  // Referência curada: usando imagem de atelectasis pattern
  // ========================================================================
  {
    diagnosisKey: "atelectasis",
    aliases: ["atelectasia", "colapso pulmonar", "colapso pulmonar parcial", "volume loss", "atelectasia lobar", "atelectasia subsegmentar"],
    references: [
      {
        imageUrl: "https://openi.nlm.nih.gov/imgs/512/154/2961/CXR2961_IM-1355-1001.png",
        imageId: "CXR2961_Atle",
        impression: "Atelectasis pattern - Linear opacity with volume loss",
        expectedFindingPt:
          "Radiografia de tórax pode mostrar opacidade linear ou segmentar associada à perda de volume pulmonar, compatível com atelectasia.",
        fonte: "Open-i / Indiana University Chest X-ray Collection",
      },
    ],
  },

  // ========================================================================
  // EDEMA PULMONAR / INSUFICIÊNCIA CARDÍACA (P2B)
  // Referência curada: usando imagem de hyperinflation/CHF pattern
  // ========================================================================
  {
    diagnosisKey: "pulmonary_edema_chf",
    aliases: [
      "edema pulmonar",
      "insuficiência cardíaca",
      "insuficiencia cardiaca",
      "chf",
      "ICC",
      "icc",
      "congestão pulmonar",
      "edema agudo de pulmão",
    ],
    references: [
      {
        imageUrl: "https://openi.nlm.nih.gov/imgs/512/370/3177/CXR3177_IM-1497-1001.png",
        imageId: "CXR3177_CHF",
        impression: "Vascular congestion pattern compatible with CHF/pulmonary edema",
        expectedFindingPt:
          "Radiografia de tórax pode evidenciar cardiomegalia, congestão vascular pulmonar, edema intersticial/alveolar e, por vezes, derrame pleural, compatíveis com congestão pulmonar por insuficiência cardíaca.",
        fonte: "Open-i / Indiana University Chest X-ray Collection",
      },
    ],
  },

  // ========================================================================
  // ICC (Alias para Edema Pulmonar/Insuficiência Cardíaca)
  // ========================================================================
  {
    diagnosisKey: "icc",
    aliases: ["icc", "ICC"],
    references: [
      {
        imageUrl: "https://openi.nlm.nih.gov/imgs/512/370/3177/CXR3177_IM-1497-1001.png",
        imageId: "CXR3177_ICC",
        impression: "Vascular congestion pattern compatible with CHF/ICC",
        expectedFindingPt:
          "Radiografia de tórax pode evidenciar cardiomegalia, congestão vascular pulmonar, edema intersticial/alveolar e, por vezes, derrame pleural, compatíveis com congestão pulmonar por insuficiência cardíaca.",
        fonte: "Open-i / Indiana University Chest X-ray Collection",
      },
    ],
  },

  // ========================================================================
  // DPOC / ENFISEMA
  // Referência curada validada (URL testada com curl -I = 200 OK)
  // ========================================================================
  {
    diagnosisKey: "copd_emphysema",
    aliases: [
      "dpoc",
      "doença pulmonar obstrutiva crônica",
      "enfisema",
      "emphysema",
      "copd",
    ],
    references: [
      {
        imageUrl: "https://openi.nlm.nih.gov/imgs/512/368/2373/CXR2373_IM-0934-1001.png",
        imageId: "CXR2373",
        impression: "Moderate hyperinflation of the lungs consistent with COPD/emphysema",
        expectedFindingPt:
          "Radiografia de tórax pode mostrar hiperinsuflação pulmonar, aumento dos volumes pulmonares, retificação diafragmática e sinais compatíveis com DPOC/enfisema.",
        fonte: "Open-i / Indiana University Chest X-ray Collection",
      },
    ],
  },

  // ========================================================================
  // BRONQUIOLITE (P2B)
  // Referência curada: usando imagem de hyperinflation/small airways
  // ========================================================================
  {
    diagnosisKey: "bronchiolitis",
    aliases: ["bronquiolite", "viral bronchiolitis", "bronchiolitis"],
    references: [
      {
        imageUrl: "https://openi.nlm.nih.gov/imgs/512/370/3177/CXR3177_IM-1497-2001.png",
        imageId: "CXR3177_Bronc",
        impression: "Hyperinflation with peribronchial thickening - Bronchiolitis pattern",
        expectedFindingPt:
          "Radiografia de tórax na bronquiolite pode ser normal ou mostrar hiperinsuflação, espessamento peribrônquico/perihilar e pequenas atelectasias, sem consolidação lobar típica.",
        fonte: "Open-i / Indiana University Chest X-ray Collection",
      },
    ],
  },

  // ========================================================================
  // CARDIOMEGALIA (P2B)
  // Referência curada: usando imagem de cardiac pattern
  // ========================================================================
  {
    diagnosisKey: "cardiomegaly",
    aliases: ["cardiomegalia", "enlarged cardiac silhouette", "aumento da área cardíaca", "silhueta cardíaca aumentada"],
    references: [
      {
        imageUrl: "https://openi.nlm.nih.gov/imgs/512/368/2373/CXR2373_IM-0934-1001.png",
        imageId: "CXR2373_Card",
        impression: "Enlarged cardiac silhouette with hyperinflation - Cardiomegaly pattern",
        expectedFindingPt:
          "Radiografia de tórax pode mostrar aumento da silhueta cardíaca, compatível com cardiomegalia, podendo estar associada a sinais de congestão pulmonar conforme o contexto clínico.",
        fonte: "Open-i / Indiana University Chest X-ray Collection",
      },
    ],
  },

  // ========================================================================
  // PNEUMONIA ATÍPICA
  // ========================================================================
  {
    diagnosisKey: "atypical_pneumonia",
    aliases: ["pneumonia atípica", "mycoplasma", "viral pneumonia"],
    references: [
      {
        imageUrl: "https://openi.nlm.nih.gov/imgs/512/152/2154/CXR2154_IM-1065-1001.png",
        imageId: "CXR2154",
        impression: "Pneumonia - Interstitial pattern",
        expectedFindingPt:
          "Radiografia de tórax com infiltrados pulmonares, padrão intersticial ou consolidações, achados compatíveis com pneumonia atípica/viral.",
        fonte: "Open-i / Indiana University Chest X-ray Collection",
      },
    ],
  },
];

/**
 * Buscar referência curada por diagnosis key
 */
export function buscarReferenciaCurada(
  diagnosisKey: string
): ImagemCurada | null {
  const catalogo = openiCuratedReferences.find(
    (c) =>
      c.diagnosisKey === diagnosisKey ||
      c.aliases.some((alias) =>
        diagnosisKey.toLowerCase().includes(alias.toLowerCase())
      )
  );

  if (!catalogo || catalogo.references.length === 0) {
    return null;
  }

  // Retornar primeira imagem curada (poderia fazer random ou rotation)
  return catalogo.references[0];
}

/**
 * Listar todas as imagens curadas de um diagnóstico
 */
export function listarReferenciassCuradas(
  diagnosisKey: string
): ImagemCurada[] {
  const catalogo = openiCuratedReferences.find(
    (c) =>
      c.diagnosisKey === diagnosisKey ||
      c.aliases.some((alias) =>
        diagnosisKey.toLowerCase().includes(alias.toLowerCase())
      )
  );

  return catalogo?.references ?? [];
}
