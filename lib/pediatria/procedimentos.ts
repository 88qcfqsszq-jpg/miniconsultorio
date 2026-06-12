// Definições de procedimentos pediátricos de OSCE

import { Caso } from "@/lib/types";

export type ProcedimentoPediatricoId =
  | "perimetro_cefalico"
  | "pa_pediatrica"
  | "interpretar_pa_pediatrica"
  | "frequencia_respiratoria"
  | "interpretar_fr_idade"
  | "teste_coracaozinho"
  | "interpretar_teste_coracaozinho";

export interface PassoProcedimento {
  numero: number;
  descricao: string;
}

export interface ProcedimentoPediatrico {
  id: ProcedimentoPediatricoId;
  titulo: string;
  descricao: string;
  categoria: "crescimento" | "cardiovascular" | "respiratorio" | "neonatal";
  passos: PassoProcedimento[];
  achadoBrutoPadrao: string;
  faixaEtariaIndicada?: string;
  temInterpretacao?: boolean;
  procedimentoRelacionado?: ProcedimentoPediatricoId;
}

export const PROCEDIMENTOS_PEDIATRICOS: ProcedimentoPediatrico[] = [
  {
    id: "perimetro_cefalico",
    titulo: "Medir perímetro cefálico",
    descricao: "Técnica antropométrica usada principalmente em lactentes para avaliação do crescimento craniano.",
    categoria: "crescimento",
    faixaEtariaIndicada: "Principalmente lactentes",
    passos: [
      {
        numero: 1,
        descricao: "Higienizar as mãos e explicar o procedimento ao responsável.",
      },
      {
        numero: 2,
        descricao: "Posicionar a criança adequadamente, preferencialmente em decúbito dorsal ou sentada.",
      },
      {
        numero: 3,
        descricao: "Colocar a fita métrica acima das sobrancelhas, na região supraorbital.",
      },
      {
        numero: 4,
        descricao: "Passar a fita pela maior proeminência occipital (ponto mais posterior do crânio).",
      },
      {
        numero: 5,
        descricao: "Manter a fita ajustada e nivelada sem comprimir os tecidos.",
      },
      {
        numero: 6,
        descricao: "Realizar a leitura em centímetros, registrando com precisão de 0,1 cm.",
      },
      {
        numero: 7,
        descricao: "Registrar o valor no prontuário e comparar com a curva de crescimento para a idade.",
      },
    ],
    achadoBrutoPadrao: "Perímetro cefálico aferido com fita posicionada acima das sobrancelhas e passando pela maior proeminência occipital.",
  },

  {
    id: "pa_pediatrica",
    titulo: "Aferir pressão arterial pediátrica",
    descricao: "Aferição de pressão arterial com técnica correta e manguito adequado para a idade.",
    categoria: "cardiovascular",
    passos: [
      {
        numero: 1,
        descricao: "Explicar o procedimento à criança e ao responsável de forma clara e tranquilizadora.",
      },
      {
        numero: 2,
        descricao: "Garantir repouso prévio de pelo menos 5 minutos em ambiente tranquilo.",
      },
      {
        numero: 3,
        descricao: "Posicionar a criança sentada com as costas apoiadas, ou em repouso em leito.",
      },
      {
        numero: 4,
        descricao: "Apoiar o braço na altura do coração, sem tensão muscular.",
      },
      {
        numero: 5,
        descricao: "Usar preferencialmente o braço direito para padronização.",
      },
      {
        numero: 6,
        descricao: "Escolher manguito adequado ao tamanho do braço.",
      },
      {
        numero: 7,
        descricao: "Conferir se a largura da bolsa corresponde a aproximadamente 40% da circunferência braquial.",
      },
      {
        numero: 8,
        descricao: "Conferir se o comprimento da bolsa envolve 80 a 100% da circunferência do braço.",
      },
      {
        numero: 9,
        descricao: "Posicionar o manguito 2 a 3 cm acima da fossa cubital.",
      },
      {
        numero: 10,
        descricao: "Alinhar a marca da artéria braquial sobre a artéria ao palpar.",
      },
      {
        numero: 11,
        descricao: "Realizar a aferição e registrar PAS e PAD com precisão.",
      },
    ],
    achadoBrutoPadrao: "Pressão arterial aferida em membro superior direito, com manguito adequado para idade e braço apoiado na altura do coração.",
    temInterpretacao: true,
    procedimentoRelacionado: "interpretar_pa_pediatrica",
  },

  {
    id: "interpretar_pa_pediatrica",
    titulo: "Interpretar PA pediátrica",
    descricao: "Classificar a pressão arterial conforme percentil para idade, sexo e estatura.",
    categoria: "cardiovascular",
    passos: [
      {
        numero: 1,
        descricao: "Obter os valores de PAS e PAD já aferidos.",
      },
      {
        numero: 2,
        descricao: "Consultar curva de percentil de PA para idade, sexo e estatura.",
      },
      {
        numero: 3,
        descricao: "Classificar conforme o componente mais elevado (PAS ou PAD).",
      },
      {
        numero: 4,
        descricao: "Registrar a classificação de forma bruta, sem sugerir conduta.",
      },
    ],
    achadoBrutoPadrao: "PA interpretada conforme percentil para idade, sexo e estatura.",
  },

  {
    id: "frequencia_respiratoria",
    titulo: "Contar frequência respiratória",
    descricao: "Aferição de FR por 1 minuto completo em criança em repouso.",
    categoria: "respiratorio",
    passos: [
      {
        numero: 1,
        descricao: "Observar movimentos torácicos ou abdominais da criança sem aviá-la.",
      },
      {
        numero: 2,
        descricao: "Evitar alertar a criança sobre a contagem, pois pode modificar o padrão respiratório.",
      },
      {
        numero: 3,
        descricao: "Evitar contar se a criança estiver chorando, agitada ou com febre muito alta.",
      },
      {
        numero: 4,
        descricao: "Contar cada movimento respiratório (inspiração + expiração) por 1 minuto completo.",
      },
      {
        numero: 5,
        descricao: "Registrar o valor em irpm (incursões respiratórias por minuto).",
      },
    ],
    achadoBrutoPadrao: "Frequência respiratória contada por 1 minuto completo, em repouso.",
    temInterpretacao: true,
    procedimentoRelacionado: "interpretar_fr_idade",
  },

  {
    id: "interpretar_fr_idade",
    titulo: "Interpretar FR pela idade",
    descricao: "Classificar se a frequência respiratória está adequada para a faixa etária.",
    categoria: "respiratorio",
    passos: [
      {
        numero: 1,
        descricao: "Obter o valor de FR já contado.",
      },
      {
        numero: 2,
        descricao: "Comparar com os valores de referência para a faixa etária.",
      },
      {
        numero: 3,
        descricao: "Considerar taquipneia se elevada para a idade.",
      },
      {
        numero: 4,
        descricao: "Registrar a interpretação de forma bruta.",
      },
    ],
    achadoBrutoPadrao: "FR comparada com a faixa etária.",
  },

  {
    id: "teste_coracaozinho",
    titulo: "Teste do coraçãozinho",
    descricao: "Triagem neonatal de cardiopatia congênita cianótica usando oximetria pré-ductal e pós-ductal.",
    categoria: "neonatal",
    faixaEtariaIndicada: "Principalmente neonatos (24 a 48 horas de vida)",
    passos: [
      {
        numero: 1,
        descricao: "Explicar o procedimento ao responsável.",
      },
      {
        numero: 2,
        descricao: "Realizar preferencialmente entre 24 e 48 horas de vida, antes da alta hospitalar.",
      },
      {
        numero: 3,
        descricao: "Posicionar oxímetro de pulso no membro superior direito (pré-ductal).",
      },
      {
        numero: 4,
        descricao: "Posicionar oxímetro de pulso em um dos membros inferiores (pós-ductal).",
      },
      {
        numero: 5,
        descricao: "Aguardar estabilização das leituras (aproximadamente 1 minuto).",
      },
      {
        numero: 6,
        descricao: "Registrar saturação em ambas as localizações.",
      },
      {
        numero: 7,
        descricao: "Calcular a diferença entre os valores (SatO2 MSD - SatO2 MI).",
      },
    ],
    achadoBrutoPadrao: "Teste do coraçãozinho realizado com oximetria em membro superior direito e membro inferior.",
    temInterpretacao: true,
    procedimentoRelacionado: "interpretar_teste_coracaozinho",
  },

  {
    id: "interpretar_teste_coracaozinho",
    titulo: "Interpretar teste do coraçãozinho",
    descricao: "Classificar resultado do teste conforme critérios de normalidade e risco.",
    categoria: "neonatal",
    passos: [
      {
        numero: 1,
        descricao: "Obter os valores de SatO2 MSD e SatO2 MI.",
      },
      {
        numero: 2,
        descricao: "Calcular a diferença entre os dois valores.",
      },
      {
        numero: 3,
        descricao: "Considerar normal: SatO2 ≥ 95% em ambos os locais E diferença < 3%.",
      },
      {
        numero: 4,
        descricao: "Considerar alterado: SatO2 < 95% em qualquer local OU diferença ≥ 3%.",
      },
      {
        numero: 5,
        descricao: "Registrar resultado de forma bruta, sem sugerir diagnóstico.",
      },
    ],
    achadoBrutoPadrao: "Teste do coraçãozinho interpretado conforme critérios de normalidade.",
  },
];

// Obter procedimento por ID
export function obterProcedimento(id: ProcedimentoPediatricoId): ProcedimentoPediatrico | undefined {
  return PROCEDIMENTOS_PEDIATRICOS.find((p) => p.id === id);
}

// Obter lista de procedimentos principais (sem interpretações)
export function obterProcedimentosPrincipais(): ProcedimentoPediatrico[] {
  return PROCEDIMENTOS_PEDIATRICOS.filter(
    (p) =>
      p.id !== "interpretar_pa_pediatrica" &&
      p.id !== "interpretar_fr_idade" &&
      p.id !== "interpretar_teste_coracaozinho"
  );
}

// Obter interpretações relacionadas a um procedimento
export function obterInterpretacaoRelacionada(procedimentoId: ProcedimentoPediatricoId): ProcedimentoPediatrico | undefined {
  const procedimento = obterProcedimento(procedimentoId);
  if (procedimento?.procedimentoRelacionado) {
    return obterProcedimento(procedimento.procedimentoRelacionado);
  }
  return undefined;
}

// Gerar achado bruto com dados do caso
export function gerarAchadoProcedimento(
  procedimentoId: ProcedimentoPediatricoId,
  caso: Caso
): string {
  const procedimento = obterProcedimento(procedimentoId);
  if (!procedimento) {
    return "Procedimento não encontrado.";
  }

  // Achados específicos por caso e procedimento
  const achadosPorCaso: Record<string, Record<ProcedimentoPediatricoId, string>> = {
    "ped-01": {
      perimetro_cefalico: "Não aplicável para esta faixa etária (criança de 4 anos).",
      pa_pediatrica: "PA aferida: 100/65 mmHg em membro superior direito.",
      interpretar_pa_pediatrica:
        "PAS e PAD dentro dos percentis esperados para idade e sexo.",
      frequencia_respiratoria: "FR = 28 irpm, contada em repouso por 1 minuto completo.",
      interpretar_fr_idade: "FR ligeiramente elevada para a idade, compatível com febre.",
      teste_coracaozinho: "Não indicado para esta faixa etária (teste neonatal).",
      interpretar_teste_coracaozinho: "Não aplicável.",
    },
  };

  // Retornar achado específico ou padrão
  if (achadosPorCaso[caso.id]?.[procedimentoId]) {
    return achadosPorCaso[caso.id][procedimentoId];
  }

  return procedimento.achadoBrutoPadrao;
}

// Converter achado em formato compatível com o sistema geral
export function converterAchadoProcedimento(
  procedimentoId: ProcedimentoPediatricoId,
  descricao: string
): any {
  const procedimento = obterProcedimento(procedimentoId);

  if (!procedimento) {
    return null;
  }

  return {
    id: `proc-${procedimentoId}-${Date.now()}`,
    titulo: procedimento.titulo,
    descricao: descricao,
    categoria: "procedimento_pediatrico",
    regiao: procedimento.categoria,
    acaoRealizada: procedimento.titulo,
    sistema: "pediatria",
  };
}
