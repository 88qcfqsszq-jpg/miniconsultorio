// Procedimentos pediátricos específicos para exame do lactente
// Medidas, avaliações e procedimentos clínicos padronizados

export type ProcedimentoId =
  | "perimetro_cefalico"
  | "frequencia_respiratoria"
  | "tempo_enchimento_capilar"
  | "frequencia_cardiaca"
  | "saturacao_pre_ductal"
  | "saturacao_pos_ductal"
  | "comparar_saturacoes"
  | "pressao_arterial"
  | "peso"
  | "comprimento"
  | "curva_crescimento"
  | "desenvolvimento_neuropsicomotor";

export interface ProcedimentoLactente {
  id: ProcedimentoId;
  label: string;
  descricao_tecnica: string;
  achado: string;
}

export interface AchadoProcedimento {
  id: string;
  titulo: string;
  descricao: string;
  procedimentoId: ProcedimentoId;
}

// Procedimentos globais (mesmos para todos os casos)
export const PROCEDIMENTOS_LACTENTE: Record<ProcedimentoId, ProcedimentoLactente> = {
  perimetro_cefalico: {
    id: "perimetro_cefalico",
    label: "Medir perímetro cefálico",
    descricao_tecnica: "Medida com fita métrica posicionada acima das sobrancelhas e sobre a maior proeminência occipital",
    achado: "Perímetro cefálico aferido"
  },
  frequencia_respiratoria: {
    id: "frequencia_respiratoria",
    label: "Contar FR por 1 minuto",
    descricao_tecnica: "Contagem de movimentos respiratórios durante 1 minuto completo, com criança em repouso",
    achado: "Frequência respiratória aferida"
  },
  tempo_enchimento_capilar: {
    id: "tempo_enchimento_capilar",
    label: "Medir TEC",
    descricao_tecnica: "Pressão em leito ungueal e medida do tempo até reperfusão",
    achado: "Tempo de enchimento capilar avaliado"
  },
  frequencia_cardiaca: {
    id: "frequencia_cardiaca",
    label: "Aferir frequência cardíaca",
    descricao_tecnica: "Palpação de pulso ou ausculta durante repouso relativo",
    achado: "Frequência cardíaca aferida"
  },
  saturacao_pre_ductal: {
    id: "saturacao_pre_ductal",
    label: "Aferir saturação pré-ductal",
    descricao_tecnica: "Oximetria em membro superior direito (pré-ductal)",
    achado: "Saturação pré-ductal medida"
  },
  saturacao_pos_ductal: {
    id: "saturacao_pos_ductal",
    label: "Aferir saturação pós-ductal",
    descricao_tecnica: "Oximetria em membro inferior (pós-ductal)",
    achado: "Saturação pós-ductal medida"
  },
  comparar_saturacoes: {
    id: "comparar_saturacoes",
    label: "Comparar pré e pós-ductal",
    descricao_tecnica: "Avaliação da diferença entre saturações pré e pós-ductais",
    achado: "Saturações comparadas"
  },
  pressao_arterial: {
    id: "pressao_arterial",
    label: "Aferir PA pediátrica",
    descricao_tecnica: "Aferição com manguito apropriado ao braço, em repouso relativo",
    achado: "Pressão arterial aferida"
  },
  peso: {
    id: "peso",
    label: "Avaliar peso",
    descricao_tecnica: "Pesagem em balança apropriada",
    achado: "Peso aferido"
  },
  comprimento: {
    id: "comprimento",
    label: "Avaliar comprimento",
    descricao_tecnica: "Medida de comprimento em superfície adequada",
    achado: "Comprimento aferido"
  },
  curva_crescimento: {
    id: "curva_crescimento",
    label: "Avaliar curva de crescimento",
    descricao_tecnica: "Plotagem de dados antropométricos em curva de crescimento",
    achado: "Crescimento avaliado"
  },
  desenvolvimento_neuropsicomotor: {
    id: "desenvolvimento_neuropsicomotor",
    label: "Avaliar DNPM",
    descricao_tecnica: "Observação dirigida de marcos do desenvolvimento neuropsicomotor",
    achado: "DNPM avaliado"
  }
};

// Achados customizados por caso
export function obterAchadoProcedimento(
  casoId: string,
  procedimentoId: ProcedimentoId
): AchadoProcedimento | null {
  const achadosPorCasoProcedimento: Record<string, Record<ProcedimentoId, AchadoProcedimento>> = {
    // ===== PED-02: PUERICULTURA NORMAL =====
    "ped-02": {
      perimetro_cefalico: {
        id: "ped-02-proc-pc",
        titulo: "Perímetro Cefálico",
        descricao: "PC aferido: 43 cm, com fita métrica posicionada acima das sobrancelhas e sobre a maior proeminência occipital, compatível com avaliação antropométrica de rotina.",
        procedimentoId: "perimetro_cefalico"
      },
      frequencia_respiratoria: {
        id: "ped-02-proc-fr",
        titulo: "Frequência Respiratória",
        descricao: "FR: 34 irpm, contada durante 1 minuto em repouso, sem elevação evidente para a idade no contexto clínico.",
        procedimentoId: "frequencia_respiratoria"
      },
      tempo_enchimento_capilar: {
        id: "ped-02-proc-tec",
        titulo: "Tempo de Enchimento Capilar",
        descricao: "TEC < 2 segundos, com perfusão periférica preservada.",
        procedimentoId: "tempo_enchimento_capilar"
      },
      frequencia_cardiaca: {
        id: "ped-02-proc-fc",
        titulo: "Frequência Cardíaca",
        descricao: "FC: 122 bpm, aferida em repouso, sem alteração grosseira observada para o contexto clínico.",
        procedimentoId: "frequencia_cardiaca"
      },
      saturacao_pre_ductal: {
        id: "ped-02-proc-sat-pre",
        titulo: "Saturação Pré-ductal",
        descricao: "SatO₂ pré-ductal: 98% em membro superior direito, sem redução evidente no contexto clínico.",
        procedimentoId: "saturacao_pre_ductal"
      },
      saturacao_pos_ductal: {
        id: "ped-02-proc-sat-pos",
        titulo: "Saturação Pós-ductal",
        descricao: "SatO₂ pós-ductal: 98% em membro inferior, sem diferença clinicamente evidente em relação à avaliação geral.",
        procedimentoId: "saturacao_pos_ductal"
      },
      comparar_saturacoes: {
        id: "ped-02-proc-comp-sat",
        titulo: "Comparação de Saturações",
        descricao: "Pré 98% / pós 98%, diferença 0%, sem diferença significativa observada no contexto clínico.",
        procedimentoId: "comparar_saturacoes"
      },
      pressao_arterial: {
        id: "ped-02-proc-pa",
        titulo: "Pressão Arterial",
        descricao: "PA: 88/54 mmHg, aferida com manguito adequado, sem alteração grosseira no contexto da consulta de rotina.",
        procedimentoId: "pressao_arterial"
      },
      peso: {
        id: "ped-02-proc-peso",
        titulo: "Peso",
        descricao: "Peso: 7,8 kg, aferido em balança apropriada, dado utilizado para avaliação antropométrica de rotina.",
        procedimentoId: "peso"
      },
      comprimento: {
        id: "ped-02-proc-comp",
        titulo: "Comprimento",
        descricao: "Comprimento: 67 cm, aferido em superfície adequada, compondo avaliação antropométrica de rotina.",
        procedimentoId: "comprimento"
      },
      curva_crescimento: {
        id: "ped-02-proc-curva",
        titulo: "Curva de Crescimento",
        descricao: "Peso, comprimento e perímetro cefálico registrados para plotagem em curva de crescimento, sem interpretação automática de percentil.",
        procedimentoId: "curva_crescimento"
      },
      desenvolvimento_neuropsicomotor: {
        id: "ped-02-proc-dnpm",
        titulo: "Desenvolvimento Neuropsicomotor",
        descricao: "DNPM observado durante consulta de rotina, sem atraso grosseiro evidente no exame atual.",
        procedimentoId: "desenvolvimento_neuropsicomotor"
      }
    },

    // ===== PED-04: DESENVOLVIMENTO / 10 MESES =====
    "ped-04": {
      perimetro_cefalico: {
        id: "ped-04-proc-pc",
        titulo: "Perímetro Cefálico",
        descricao: "PC aferido: 45 cm, adequadamente, associado à avaliação do crescimento e desenvolvimento.",
        procedimentoId: "perimetro_cefalico"
      },
      frequencia_respiratoria: {
        id: "ped-04-proc-fr",
        titulo: "Frequência Respiratória",
        descricao: "FR: 30 irpm, contada por 1 minuto durante repouso, sem sinais de desconforto respiratório.",
        procedimentoId: "frequencia_respiratoria"
      },
      tempo_enchimento_capilar: {
        id: "ped-04-proc-tec",
        titulo: "Tempo de Enchimento Capilar",
        descricao: "TEC < 2 segundos, com extremidades aquecidas.",
        procedimentoId: "tempo_enchimento_capilar"
      },
      frequencia_cardiaca: {
        id: "ped-04-proc-fc",
        titulo: "Frequência Cardíaca",
        descricao: "FC: 118 bpm, aferida durante avaliação, com lactente ativo e responsivo.",
        procedimentoId: "frequencia_cardiaca"
      },
      saturacao_pre_ductal: {
        id: "ped-04-proc-sat-pre",
        titulo: "Saturação Pré-ductal",
        descricao: "SatO₂ pré-ductal: 98% em membro superior direito.",
        procedimentoId: "saturacao_pre_ductal"
      },
      saturacao_pos_ductal: {
        id: "ped-04-proc-sat-pos",
        titulo: "Saturação Pós-ductal",
        descricao: "SatO₂ pós-ductal: 98% em membro inferior.",
        procedimentoId: "saturacao_pos_ductal"
      },
      comparar_saturacoes: {
        id: "ped-04-proc-comp-sat",
        titulo: "Comparação de Saturações",
        descricao: "Pré 98% / pós 98%, diferença 0%, sem diferença significativa.",
        procedimentoId: "comparar_saturacoes"
      },
      pressao_arterial: {
        id: "ped-04-proc-pa",
        titulo: "Pressão Arterial",
        descricao: "PA: 90/56 mmHg, aferida com técnica adequada durante avaliação clínica.",
        procedimentoId: "pressao_arterial"
      },
      peso: {
        id: "ped-04-proc-peso",
        titulo: "Peso",
        descricao: "Peso: 9,2 kg, aferido e considerado dentro da avaliação global de crescimento e desenvolvimento.",
        procedimentoId: "peso"
      },
      comprimento: {
        id: "ped-04-proc-comp",
        titulo: "Comprimento",
        descricao: "Comprimento: 73 cm, aferido e integrado à avaliação do crescimento.",
        procedimentoId: "comprimento"
      },
      curva_crescimento: {
        id: "ped-04-proc-curva",
        titulo: "Curva de Crescimento",
        descricao: "Dados antropométricos registrados para correlação com crescimento longitudinal, sem interpretação automática de percentil.",
        procedimentoId: "curva_crescimento"
      },
      desenvolvimento_neuropsicomotor: {
        id: "ped-04-proc-dnpm",
        titulo: "Desenvolvimento Neuropsicomotor",
        descricao: "DNPM avaliado: senta com apoio/estabilidade, interage, emite sons responsivos e responde a estímulos, sem atraso grosseiro evidente no exame.",
        procedimentoId: "desenvolvimento_neuropsicomotor"
      }
    },

    // ===== PED-05: INSUFICIÊNCIA CARDÍACA / SOBRECARGA =====
    "ped-05": {
      perimetro_cefalico: {
        id: "ped-05-proc-pc",
        titulo: "Perímetro Cefálico",
        descricao: "PC aferido: 42 cm, durante exame físico pediátrico, sem alteração grosseira observada no momento.",
        procedimentoId: "perimetro_cefalico"
      },
      frequencia_respiratoria: {
        id: "ped-05-proc-fr",
        titulo: "Frequência Respiratória",
        descricao: "FR: 62 irpm, elevada para a idade no contexto do caso, associada a discreto aumento do esforço respiratório.",
        procedimentoId: "frequencia_respiratoria"
      },
      tempo_enchimento_capilar: {
        id: "ped-05-proc-tec",
        titulo: "Tempo de Enchimento Capilar",
        descricao: "TEC: 3 segundos, discretamente aumentado, no contexto do exame.",
        procedimentoId: "tempo_enchimento_capilar"
      },
      frequencia_cardiaca: {
        id: "ped-05-proc-fc",
        titulo: "Frequência Cardíaca",
        descricao: "FC: 168 bpm, elevada para a idade durante o exame, associada a sinais de maior esforço clínico.",
        procedimentoId: "frequencia_cardiaca"
      },
      saturacao_pre_ductal: {
        id: "ped-05-proc-sat-pre",
        titulo: "Saturação Pré-ductal",
        descricao: "SatO₂ pré-ductal: 94% em membro superior direito durante avaliação cardiorrespiratória.",
        procedimentoId: "saturacao_pre_ductal"
      },
      saturacao_pos_ductal: {
        id: "ped-05-proc-sat-pos",
        titulo: "Saturação Pós-ductal",
        descricao: "SatO₂ pós-ductal: 94% em membro inferior durante avaliação cardiorrespiratória.",
        procedimentoId: "saturacao_pos_ductal"
      },
      comparar_saturacoes: {
        id: "ped-05-proc-comp-sat",
        titulo: "Comparação de Saturações",
        descricao: "Pré 94% / pós 94%, diferença 0%, sem diferença significativa entre membros, no contexto de avaliação cardiorrespiratória.",
        procedimentoId: "comparar_saturacoes"
      },
      pressao_arterial: {
        id: "ped-05-proc-pa",
        titulo: "Pressão Arterial",
        descricao: "PA: 82/50 mmHg, aferida com manguito adequado durante avaliação cardiovascular, em lactente com sinais de maior esforço clínico.",
        procedimentoId: "pressao_arterial"
      },
      peso: {
        id: "ped-05-proc-peso",
        titulo: "Peso",
        descricao: "Peso: 5,9 kg, dado importante para correlação com história de ganho ponderal e esforço durante alimentação.",
        procedimentoId: "peso"
      },
      comprimento: {
        id: "ped-05-proc-comp",
        titulo: "Comprimento",
        descricao: "Comprimento: 62 cm, aferido durante avaliação pediátrica, para comparação com peso e evolução ponderal.",
        procedimentoId: "comprimento"
      },
      curva_crescimento: {
        id: "ped-05-proc-curva",
        titulo: "Curva de Crescimento",
        descricao: "Dados antropométricos registrados para avaliação longitudinal do crescimento e possível prejuízo ponderal relatado.",
        procedimentoId: "curva_crescimento"
      },
      desenvolvimento_neuropsicomotor: {
        id: "ped-05-proc-dnpm",
        titulo: "Desenvolvimento Neuropsicomotor",
        descricao: "DNPM observado durante exame, com menor atividade espontânea no contexto clínico do caso, sem conclusão diagnóstica de atraso.",
        procedimentoId: "desenvolvimento_neuropsicomotor"
      }
    },

    // ===== PED-07: CARDIOPATIA ACIANÓTICA / SOPRO =====
    "ped-07": {
      perimetro_cefalico: {
        id: "ped-07-proc-pc",
        titulo: "Perímetro Cefálico",
        descricao: "PC aferido: 43,5 cm, durante exame físico pediátrico, sem alteração grosseira observada no momento.",
        procedimentoId: "perimetro_cefalico"
      },
      frequencia_respiratoria: {
        id: "ped-07-proc-fr",
        titulo: "Frequência Respiratória",
        descricao: "FR: 36 irpm, contada por 1 minuto, sem tiragens importantes durante o exame.",
        procedimentoId: "frequencia_respiratoria"
      },
      tempo_enchimento_capilar: {
        id: "ped-07-proc-tec",
        titulo: "Tempo de Enchimento Capilar",
        descricao: "TEC < 2 segundos, com pulsos periféricos palpáveis.",
        procedimentoId: "tempo_enchimento_capilar"
      },
      frequencia_cardiaca: {
        id: "ped-07-proc-fc",
        titulo: "Frequência Cardíaca",
        descricao: "FC: 132 bpm, ritmo regular, com sopro sistólico audível à ausculta.",
        procedimentoId: "frequencia_cardiaca"
      },
      saturacao_pre_ductal: {
        id: "ped-07-proc-sat-pre",
        titulo: "Saturação Pré-ductal",
        descricao: "SatO₂ pré-ductal: 98% em membro superior direito, sem cianose central observada.",
        procedimentoId: "saturacao_pre_ductal"
      },
      saturacao_pos_ductal: {
        id: "ped-07-proc-sat-pos",
        titulo: "Saturação Pós-ductal",
        descricao: "SatO₂ pós-ductal: 98% em membro inferior, sem cianose central observada.",
        procedimentoId: "saturacao_pos_ductal"
      },
      comparar_saturacoes: {
        id: "ped-07-proc-comp-sat",
        titulo: "Comparação de Saturações",
        descricao: "Pré 98% / pós 98%, diferença 0%, sem cianose central ao exame.",
        procedimentoId: "comparar_saturacoes"
      },
      pressao_arterial: {
        id: "ped-07-proc-pa",
        titulo: "Pressão Arterial",
        descricao: "PA: 86/52 mmHg, aferida com técnica adequada durante investigação de sopro.",
        procedimentoId: "pressao_arterial"
      },
      peso: {
        id: "ped-07-proc-peso",
        titulo: "Peso",
        descricao: "Peso: 7,2 kg, aferido durante avaliação pediátrica, importante para acompanhamento clínico.",
        procedimentoId: "peso"
      },
      comprimento: {
        id: "ped-07-proc-comp",
        titulo: "Comprimento",
        descricao: "Comprimento: 66 cm, aferido durante avaliação clínica do lactente.",
        procedimentoId: "comprimento"
      },
      curva_crescimento: {
        id: "ped-07-proc-curva",
        titulo: "Curva de Crescimento",
        descricao: "Dados antropométricos registrados para acompanhamento longitudinal.",
        procedimentoId: "curva_crescimento"
      },
      desenvolvimento_neuropsicomotor: {
        id: "ped-07-proc-dnpm",
        titulo: "Desenvolvimento Neuropsicomotor",
        descricao: "DNPM observado durante avaliação, com interação preservada com cuidador.",
        procedimentoId: "desenvolvimento_neuropsicomotor"
      }
    },

    // ===== PED-08: CARDIOPATIA CIANÓTICA =====
    "ped-08": {
      perimetro_cefalico: {
        id: "ped-08-proc-pc",
        titulo: "Perímetro Cefálico",
        descricao: "PC aferido: 42,5 cm, durante exame físico pediátrico, sem alteração grosseira observada no momento.",
        procedimentoId: "perimetro_cefalico"
      },
      frequencia_respiratoria: {
        id: "ped-08-proc-fr",
        titulo: "Frequência Respiratória",
        descricao: "FR: 48 irpm, contada por 1 minuto, com desconforto leve ao manuseio, sem tiragem universal.",
        procedimentoId: "frequencia_respiratoria"
      },
      tempo_enchimento_capilar: {
        id: "ped-08-proc-tec",
        titulo: "Tempo de Enchimento Capilar",
        descricao: "TEC: 2 a 3 segundos, avaliado, com perfusão periférica presente e cianose periférica discreta.",
        procedimentoId: "tempo_enchimento_capilar"
      },
      frequencia_cardiaca: {
        id: "ped-08-proc-fc",
        titulo: "Frequência Cardíaca",
        descricao: "FC: 152 bpm, elevada para a idade no contexto de coloração cutaneomucosa alterada.",
        procedimentoId: "frequencia_cardiaca"
      },
      saturacao_pre_ductal: {
        id: "ped-08-proc-sat-pre",
        titulo: "Saturação Pré-ductal",
        descricao: "SatO₂ pré-ductal: 84% em membro superior direito, no contexto de cianose central.",
        procedimentoId: "saturacao_pre_ductal"
      },
      saturacao_pos_ductal: {
        id: "ped-08-proc-sat-pos",
        titulo: "Saturação Pós-ductal",
        descricao: "SatO₂ pós-ductal: 83% em membro inferior, no contexto de cianose central.",
        procedimentoId: "saturacao_pos_ductal"
      },
      comparar_saturacoes: {
        id: "ped-08-proc-comp-sat",
        titulo: "Comparação de Saturações",
        descricao: "Pré 84% / pós 83%, diferença de 1%, ambas reduzidas no contexto de cianose central.",
        procedimentoId: "comparar_saturacoes"
      },
      pressao_arterial: {
        id: "ped-08-proc-pa",
        titulo: "Pressão Arterial",
        descricao: "PA: 84/50 mmHg, aferida com técnica adequada durante avaliação de coloração cutaneomucosa alterada.",
        procedimentoId: "pressao_arterial"
      },
      peso: {
        id: "ped-08-proc-peso",
        titulo: "Peso",
        descricao: "Peso: 6,8 kg, aferido durante avaliação pediátrica, importante para acompanhamento do crescimento.",
        procedimentoId: "peso"
      },
      comprimento: {
        id: "ped-08-proc-comp",
        titulo: "Comprimento",
        descricao: "Comprimento: 64 cm, aferido durante avaliação clínica do lactente.",
        procedimentoId: "comprimento"
      },
      curva_crescimento: {
        id: "ped-08-proc-curva",
        titulo: "Curva de Crescimento",
        descricao: "Dados antropométricos registrados para acompanhamento longitudinal.",
        procedimentoId: "curva_crescimento"
      },
      desenvolvimento_neuropsicomotor: {
        id: "ped-08-proc-dnpm",
        titulo: "Desenvolvimento Neuropsicomotor",
        descricao: "DNPM observado durante avaliação, com interação preservada apesar de coloração cutaneomucosa alterada.",
        procedimentoId: "desenvolvimento_neuropsicomotor"
      }
    }
  };

  if (achadosPorCasoProcedimento[casoId] && achadosPorCasoProcedimento[casoId][procedimentoId]) {
    return achadosPorCasoProcedimento[casoId][procedimentoId];
  }

  return null;
}
