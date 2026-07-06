// lib/types.ts

export interface FonteExamePainel {
  interpretacao: string;
  dados: Record<string, string>;
}

export interface FonteExamesLaboratoriais {
  hemograma?: FonteExamePainel;
  funcao_renal?: FonteExamePainel;
  eletrolitos?: FonteExamePainel;
  marcadores_inflamatorios?: FonteExamePainel;
  gasometria?: FonteExamePainel;
  marcadores_cardiacos?: FonteExamePainel;
  funcao_hepatica?: FonteExamePainel;
  coagulograma?: FonteExamePainel;
  urina_tipo_1?: FonteExamePainel;
}

export interface Caso {
  id: string;
  titulo: string;
  descricao: string;
  exames_complementares_disponiveis?: string[];
  fonte_exames_laboratoriais?: FonteExamesLaboratoriais;
  // ... other properties
}



// data/casos-osce.ts

import { Caso, FonteExamesLaboratoriais } from "@/lib/types";

const LABS_BASE_NORMAL: FonteExamesLaboratoriais = {
  hemograma: {
    interpretacao: "Hemograma sem alterações relevantes.",
    dados: {
      hemacias: "4,80 mi/mm³",
      hemoglobina: "14,2 g/dL",
      hematocrito: "42,0%",
      vcm: "87,5 fL",
      hcm: "29,5 pg",
      chcm: "33,8 g/dL",
      rdw: "13,0%",
      leucocitos: "7.200/mm³",
      neutrofilos: "58%",
      bastonetes: "2%",
      segmentados: "56%",
      linfocitos: "30%",
      monocitos: "8%",
      eosinofilos: "3%",
      basofilos: "1%",
      plaquetas: "250.000/mm³",
      vpm: "9,0 fL",
      plaquetocrito: "0,22%",
      pdw: "12,0%",
    },
  },
  funcao_renal: {
    interpretacao: "Função renal preservada.",
    dados: {
      ureia: "32 mg/dL",
      creatinina: "0,9 mg/dL",
      etfg: "> 90 mL/min/1,73m²",
    },
  },
  eletrolitos: {
    interpretacao: "Eletrólitos sem alterações relevantes.",
    dados: {
      sodio: "139 mEq/L",
      potassio: "4,2 mEq/L",
      cloro: "102 mEq/L",
      magnesio: "2,0 mg/dL",
      calcio: "9,2 mg/dL",
    },
  },
  marcadores_inflamatorios: {
    interpretacao: "Marcadores inflamatórios sem elevação relevante.",
    dados: {
      pcr: "0,4 mg/dL",
      vhs: "12 mm/h",
      procalcitonina: "0,05 ng/mL",
    },
  },
  gasometria: {
    interpretacao: "Gasometria sem distúrbios ácido-base relevantes.",
    dados: {
      ph: "7,40",
      paco2: "40 mmHg",
      pao2: "92 mmHg",
      hco3: "24 mEq/L",
      satO2: "97%",
      lactato: "1,2 mmol/L",
      be: "0",
    },
  },
  marcadores_cardiacos: {
    interpretacao: "Marcadores cardíacos sem evidência de necrose miocárdica.",
    dados: {
      troponina: "<0,04 ng/mL",
      ckmb: "2,0 ng/mL",
      bnp: "48 pg/mL",
    },
  },
  funcao_hepatica: {
    interpretacao: "Função hepática sem alterações relevantes.",
    dados: {
      tgo: "24 U/L",
      tgp: "28 U/L",
      fa: "88 U/L",
      ggt: "34 U/L",
      bilirrubina_total: "0,8 mg/dL",
      bilirrubina_direta: "0,2 mg/dL",
      albumina: "4,1 g/dL",
    },
  },
  coagulograma: {
    interpretacao: "Coagulograma sem alterações relevantes.",
    dados: {
      tp: "12,4 s",
      inr: "1,0",
      ttpa: "31 s",
      fibrinogenio: "320 mg/dL",
      d_dimero: "<500 ng/mL",
    },
  },
  urina_tipo_1: {
    interpretacao: "Urina tipo 1 sem alterações relevantes.",
    dados: {
      densidade: "1,020",
      ph: "6,0",
      proteina: "Ausente",
      glicose: "Ausente",
      cetonas: "Ausentes",
      sangue_hemoglobina: "Ausente",
      nitrito: "Negativo",
      esterase_leucocitaria: "Negativa",
      leucocitos: "< 5 p/campo",
      hemacias: "< 3 p/campo",
      bacterias: "Raras",
      cilindros: "Ausentes",
    },
  },
};

// Then, inside each case object, after exames_complementares_disponiveis, add:

// CASO 1: SCA - SÍNDROME CORONARIANA AGUDA
  fonte_exames_laboratoriais: {
    ...LABS_BASE_NORMAL,
    hemograma: {
      interpretacao: "Hemograma com discreta leucocitose de estresse, sem anemia ou plaquetopenia.",
      dados: {
        ...LABS_BASE_NORMAL.hemograma!.dados,
        leucocitos: "11.800/mm³",
        neutrofilos: "72%",
        segmentados: "68%",
        bastonetes: "4%",
        linfocitos: "18%",
        monocitos: "7%",
        eosinofilos: "2%",
        basofilos: "1%",
      },
    },
    marcadores_cardiacos: {
      interpretacao: "Marcadores compatíveis com necrose miocárdica aguda.",
      dados: {
        troponina: "2,8 ng/mL",
        ckmb: "32 ng/mL",
        bnp: "96 pg/mL",
      },
    },
    coagulograma: {
      interpretacao: "Coagulograma basal sem alterações significativas.",
      dados: {
        ...LABS_BASE_NORMAL.coagulograma!.dados,
        d_dimero: "620 ng/mL",
      },
    },
  },

// CASO 2: PNEUMONIA ADQUIRIDA NA COMUNIDADE
  fonte_exames_laboratoriais: {
    ...LABS_BASE_NORMAL,
    hemograma: {
      interpretacao: "Leucocitose com neutrofilia, compatível com infecção bacteriana.",
      dados: {
        ...LABS_BASE_NORMAL.hemograma!.dados,
        leucocitos: "14.000/mm³",
        neutrofilos: "87%",
        segmentados: "80%",
        bastonetes: "7%",
        linfocitos: "8%",
        monocitos: "4%",
        eosinofilos: "1%",
        basofilos: "0%",
      },
    },
    marcadores_inflamatorios: {
      interpretacao: "Marcadores inflamatórios elevados.",
      dados: {
        pcr: "16,0 mg/dL",
        vhs: "48 mm/h",
        procalcitonina: "0,9 ng/mL",
      },
    },
    gasometria: {
      interpretacao: "Hipoxemia leve por acometimento pulmonar.",
      dados: {
        ph: "7,44",
        paco2: "36 mmHg",
        pao2: "68 mmHg",
        hco3: "24 mEq/L",
        satO2: "93%",
        lactato: "1,4 mmol/L",
        be: "+1",
      },
    },
  },

// CASO 3: ASMA AGUDA
  fonte_exames_laboratoriais: {
    ...LABS_BASE_NORMAL,
    hemograma: {
      interpretacao: "Hemograma sem infecção bacteriana, com discreta eosinofilia.",
      dados: {
        ...LABS_BASE_NORMAL.hemograma!.dados,
        leucocitos: "8.600/mm³",
        eosinofilos: "6%",
        neutrofilos: "55%",
        linfocitos: "29%",
      },
    },
    gasometria: {
      interpretacao: "Alcalose respiratória com hipoxemia leve, compatível com crise asmática.",
      dados: {
        ph: "7,47",
        paco2: "31 mmHg",
        pao2: "72 mmHg",
        hco3: "22 mEq/L",
        satO2: "94%",
        lactato: "1,3 mmol/L",
        be: "-1",
      },
    },
  },

// CASO 4: SCA - ANGINA TÍPICA
  fonte_exames_laboratoriais: {
    ...LABS_BASE_NORMAL,
    marcadores_cardiacos: {
      interpretacao: "Marcadores cardíacos sem evidência de necrose miocárdica.",
      dados: {
        troponina: "<0,04 ng/mL",
        ckmb: "2,1 ng/mL",
        bnp: "62 pg/mL",
      },
    },
  },

// CASO 5: HAS - HIPERTENSÃO ESTÁGIO 1
  fonte_exames_laboratoriais: {
    ...LABS_BASE_NORMAL,
    funcao_renal: {
      interpretacao: "Função renal preservada, sem lesão de órgão-alvo laboratorial no momento.",
      dados: {
        ureia: "34 mg/dL",
        creatinina: "1,0 mg/dL",
        etfg: "88 mL/min/1,73m²",
      },
    },
    urina_tipo_1: {
      interpretacao: "Urina tipo 1 sem proteinúria significativa.",
      dados: {
        ...LABS_BASE_NORMAL.urina_tipo_1!.dados,
        proteina: "Traços",
      },
    },
  },

// CASO 6: PNEUMONIA ATÍPICA
  fonte_exames_laboratoriais: {
    ...LABS_BASE_NORMAL,
    hemograma: {
      interpretacao: "Leucograma discretamente alterado, compatível com pneumonia atípica.",
      dados: {
        ...LABS_BASE_NORMAL.hemograma!.dados,
        leucocitos: "10.200/mm³",
        neutrofilos: "68%",
        linfocitos: "20%",
        monocitos: "9%",
      },
    },
    marcadores_inflamatorios: {
      interpretacao: "Inflamação moderada.",
      dados: {
        pcr: "7,8 mg/dL",
        vhs: "36 mm/h",
        procalcitonina: "0,18 ng/mL",
      },
    },
  },

// CASO 7: PERICARDITE AGUDA
  fonte_exames_laboratoriais: {
    ...LABS_BASE_NORMAL,
    marcadores_inflamatorios: {
      interpretacao: "Inflamação sistêmica presente, compatível com pericardite aguda.",
      dados: {
        pcr: "9,5 mg/dL",
        vhs: "42 mm/h",
        procalcitonina: "0,10 ng/mL",
      },
    },
    marcadores_cardiacos: {
      interpretacao: "Troponina sem elevação importante.",
      dados: {
        troponina: "0,05 ng/mL",
        ckmb: "3,0 ng/mL",
        bnp: "58 pg/mL",
      },
    },
  },

// CASO 8: INSUFICIÊNCIA CARDÍACA ESQUERDA
  fonte_exames_laboratoriais: {
    ...LABS_BASE_NORMAL,
    funcao_renal: {
      interpretacao: "Azotemia discreta em contexto congestivo.",
      dados: {
        ureia: "52 mg/dL",
        creatinina: "1,3 mg/dL",
        etfg: "58 mL/min/1,73m²",
      },
    },
    marcadores_cardiacos: {
      interpretacao: "BNP elevado, compatível com insuficiência cardíaca descompensada.",
      dados: {
        troponina: "0,04 ng/mL",
        ckmb: "2,5 ng/mL",
        bnp: "980 pg/mL",
      },
    },
  },

// CASO 9: DPOC - DOENÇA PULMONAR OBSTRUTIVA CRÔNICA
  fonte_exames_laboratoriais: {
    ...LABS_BASE_NORMAL,
    hemograma: {
      interpretacao: "Poliglobulia discreta e leucocitose leve, compatíveis com DPOC exacerbado.",
      dados: {
        ...LABS_BASE_NORMAL.hemograma!.dados,
        hemacias: "5,60 mi/mm³",
        hemoglobina: "16,8 g/dL",
        hematocrito: "50,5%",
        leucocitos: "11.200/mm³",
      },
    },
    gasometria: {
      interpretacao: "Retenção de CO2 com hipoxemia.",
      dados: {
        ph: "7,33",
        paco2: "58 mmHg",
        pao2: "60 mmHg",
        hco3: "29 mEq/L",
        satO2: "89%",
        lactato: "1,5 mmol/L",
        be: "+3",
      },
    },
  },

// CASO 10: TEP - TROMBOEMBOLISMO PULMONAR
  fonte_exames_laboratoriais: {
    ...LABS_BASE_NORMAL,
    gasometria: {
      interpretacao: "Hipoxemia com alcalose respiratória, compatível com TEP.",
      dados: {
        ph: "7,48",
        paco2: "30 mmHg",
        pao2: "64 mmHg",
        hco3: "22 mEq/L",
        satO2: "91%",
        lactato: "2,1 mmol/L",
        be: "-1",
      },
    },
    coagulograma: {
      interpretacao: "D-dímero elevado.",
      dados: {
        tp: "12,8 s",
        inr: "1,0",
        ttpa: "30 s",
        fibrinogenio: "380 mg/dL",
        d_dimero: "> 4.000 ng/mL",
      },
    },
  },

// CASO 11: TUBERCULOSE
  fonte_exames_laboratoriais: {
    ...LABS_BASE_NORMAL,
    hemograma: {
      interpretacao: "Anemia discreta de doença crônica com inflamação persistente.",
      dados: {
        ...LABS_BASE_NORMAL.hemograma!.dados,
        hemoglobina: "11,6 g/dL",
        hematocrito: "35,0%",
        leucocitos: "9.400/mm³",
        monocitos: "11%",
        plaquetas: "420.000/mm³",
      },
    },
    marcadores_inflamatorios: {
      interpretacao: "Marcadores inflamatórios persistentemente elevados.",
      dados: {
        pcr: "8,4 mg/dL",
        vhs: "72 mm/h",
        procalcitonina: "0,12 ng/mL",
      },
    },
  },

// CASO 12: DENGUE GRUPO A
  fonte_exames_laboratoriais: {
    ...LABS_BASE_NORMAL,
    hemograma: {
      interpretacao: "Leucopenia e plaquetopenia leves, compatíveis com dengue sem sinais de alarme.",
      dados: {
        ...LABS_BASE_NORMAL.hemograma!.dados,
        leucocitos: "3.200/mm³",
        neutrofilos: "42%",
        linfocitos: "46%",
        plaquetas: "128.000/mm³",
        hematocrito: "44,8%",
      },
    },
    funcao_hepatica: {
      interpretacao: "Transaminases discretamente elevadas.",
      dados: {
        tgo: "68 U/L",
        tgp: "52 U/L",
        fa: "90 U/L",
        ggt: "36 U/L",
        bilirrubina_total: "0,9 mg/dL",
        bilirrubina_direta: "0,2 mg/dL",
        albumina: "4,0 g/dL",
      },
    },
    coagulograma: {
      interpretacao: "Sem coagulopatia relevante neste momento.",
      dados: {
        ...LABS_BASE_NORMAL.coagulograma!.dados,
        d_dimero: "780 ng/mL",
      },
    },
  },

// CASO 13: ENDOCARDITE INFECCIOSA
  fonte_exames_laboratoriais: {
    ...LABS_BASE_NORMAL,
    hemograma: {
      interpretacao: "Leucocitose com anemia inflamatória discreta.",
      dados: {
        ...LABS_BASE_NORMAL.hemograma!.dados,
        hemoglobina: "10,8 g/dL",
        hematocrito: "33,2%",
        leucocitos: "15.600/mm³",
        neutrofilos: "84%",
        bastonetes: "6%",
        linfocitos: "7%",
        plaquetas: "410.000/mm³",
      },
    },
    marcadores_inflamatorios: {
      interpretacao: "Inflamação/infeção sistêmica importante.",
      dados: {
        pcr: "19,0 mg/dL",
        vhs: "88 mm/h",
        procalcitonina: "1,3 ng/mL",
      },
    },
    urina_tipo_1: {
      interpretacao: "Micro-hematúria discreta.",
      dados: {
        ...LABS_BASE_NORMAL.urina_tipo_1!.dados,
        sangue_hemoglobina: "+",
        hemacias: "8-10 p/campo",
      },
    },
  },

// CASO 14: ESTENOSE MITRAL
  fonte_exames_laboratoriais: {
    ...LABS_BASE_NORMAL,
    marcadores_cardiacos: {
      interpretacao: "BNP discretamente elevado por sobrecarga crônica.",
      dados: {
        troponina: "<0,04 ng/mL",
        ckmb: "2,2 ng/mL",
        bnp: "180 pg/mL",
      },
    },
  },

// If present, for CASO 15: DAOP
  fonte_exames_laboratoriais: {
    ...LABS_BASE_NORMAL,
    hemograma: {
      interpretacao: "Hemograma sem alterações relevantes para DAOP estável.",
      dados: {
        ...LABS_BASE_NORMAL.hemograma!.dados,
      },
    },
    coagulograma: {
      interpretacao: "Sem alteração de coagulação basal relevante.",
      dados: {
        ...LABS_BASE_NORMAL.coagulograma!.dados,
        d_dimero: "540 ng/mL",
      },
    },
  },

// For CASO 16: DERRAME PLEURAL
  fonte_exames_laboratoriais: {
    ...LABS_BASE_NORMAL,
    hemograma: {
      interpretacao: "Hemograma sem infecção bacteriana exuberante; correlacionar com etiologia do derrame.",
      dados: {
        ...LABS_BASE_NORMAL.hemograma!.dados,
        leucocitos: "9.800/mm³",
      },
    },
    marcadores_inflamatorios: {
      interpretacao: "Marcadores inflamatórios discretamente elevados.",
      dados: {
        pcr: "3,2 mg/dL",
        vhs: "28 mm/h",
        procalcitonina: "0,08 ng/mL",
      },
    },
  },

// For CASO 17: ANEMIA FERROPRIVA
  fonte_exames_laboratoriais: {
    ...LABS_BASE_NORMAL,
    hemograma: {
      interpretacao: "Anemia microcítica e hipocrômica, compatível com anemia ferropriva.",
      dados: {
        ...LABS_BASE_NORMAL.hemograma!.dados,
        hemacias: "3,72 mi/mm³",
        hemoglobina: "8,9 g/dL",
        hematocrito: "29,4%",
        vcm: "68,0 fL",
        hcm: "22,0 pg",
        chcm: "31,0 g/dL",
        rdw: "18,6%",
        plaquetas: "430.000/mm³",
      },
    },
    marcadores_inflamatorios: {
      interpretacao: "Sem inflamação sistêmica relevante.",
      dados: {
        pcr: "0,3 mg/dL",
        vhs: "18 mm/h",
        procalcitonina: "0,04 ng/mL",
      },
    },
    urina_tipo_1: {
      interpretacao: "Urina tipo 1 sem alterações relevantes.",
      dados: {
        ...LABS_BASE_NORMAL.urina_tipo_1!.dados,
      },
    },
  },
