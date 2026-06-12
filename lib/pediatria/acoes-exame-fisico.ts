// Definições de ações de exame físico pediátrico

export type SistemaPediatrico = "geral" | "respiratorio" | "cardiovascular" | "abdome" | "crescimento" | "hemolinfopoietico" | "pele";

export interface AcaoExameFisicoPed {
  id: string;
  sistema: SistemaPediatrico;
  titulo: string;
  descricao: string;
  icone?: string;
}

export const ACOES_EXAME_FISICO_PEDIATRICO: AcaoExameFisicoPed[] = [
  // GERAL
  {
    id: "ped-estado-geral",
    sistema: "geral",
    titulo: "Avaliar estado geral",
    descricao: "Observar nível de atividade, reatividade e bem-estar geral",
    icone: "👁️",
  },
  {
    id: "ped-nivel-atividade",
    sistema: "geral",
    titulo: "Avaliar nível de atividade/irritabilidade",
    descricao: "Criança ativa, letárgica, irritável, chorosa",
    icone: "😊",
  },
  {
    id: "ped-hidratacao",
    sistema: "geral",
    titulo: "Avaliar hidratação",
    descricao: "Mucosas, turgor da pele, depressão de fontanela se aplicável",
    icone: "💧",
  },
  {
    id: "ped-perfusao-tec",
    sistema: "geral",
    titulo: "Avaliar perfusão/TEC",
    descricao: "Tempo de enchimento capilar, extremidades frias/quentes, cor",
    icone: "🫀",
  },
  {
    id: "ped-cianose",
    sistema: "geral",
    titulo: "Avaliar cianose",
    descricao: "Cianose central (lábios, língua) ou periférica (dedos, extremidades)",
    icone: "💙",
  },
  {
    id: "ped-palidez",
    sistema: "geral",
    titulo: "Avaliar palidez",
    descricao: "Palidez cutaneomucosa, palidez palmar",
    icone: "👤",
  },

  // RESPIRATÓRIO
  {
    id: "ped-frequencia-respiratoria",
    sistema: "respiratorio",
    titulo: "Contar frequência respiratória",
    descricao: "Observar por 1 minuto completo, em repouso se possível",
    icone: "🌬️",
  },
  {
    id: "ped-tiragens",
    sistema: "respiratorio",
    titulo: "Avaliar tiragens",
    descricao: "Intercostal, subcostal, supraclavicular, supraesternal",
    icone: "🫁",
  },
  {
    id: "ped-batimento-asa-nasal",
    sistema: "respiratorio",
    titulo: "Avaliar batimento de asa nasal",
    descricao: "Batimento de asa nasal presente ou ausente",
    icone: "👃",
  },
  {
    id: "ped-expansibilidade",
    sistema: "respiratorio",
    titulo: "Avaliar expansibilidade torácica",
    descricao: "Simetria de expansão entre hemitóraces",
    icone: "📏",
  },
  {
    id: "ped-ausculta-pulmonar",
    sistema: "respiratorio",
    titulo: "Auscultar pulmões",
    descricao: "Murmúrio vesicular, roncos, sibilos, crepitações",
    icone: "🔊",
  },

  // CARDIOVASCULAR
  {
    id: "ped-ausculta-focos",
    sistema: "cardiovascular",
    titulo: "Auscultar focos cardíacos",
    descricao: "Ritmo regular/irregular, bulhas normofonéticas/hipofonéticas",
    icone: "❤️",
  },
  {
    id: "ped-sopro",
    sistema: "cardiovascular",
    titulo: "Avaliar presença de sopro",
    descricao: "Sopro sistólico/diastólico, pansistólico, timing e irradiação",
    icone: "🎼",
  },
  {
    id: "ped-pulsos-perifericos",
    sistema: "cardiovascular",
    titulo: "Avaliar pulsos periféricos",
    descricao: "Radial, braquial, femoral, pedioso: presença, simetria, amplitude",
    icone: "💪",
  },
  {
    id: "ped-perfusao-card",
    sistema: "cardiovascular",
    titulo: "Avaliar perfusão sistêmica",
    descricao: "Extremidades quentes/frias, cor, TEC, pressão de pulso",
    icone: "🌡️",
  },
  {
    id: "ped-hepatomegalia",
    sistema: "cardiovascular",
    titulo: "Palpar fígado (congestão)",
    descricao: "Fígado palpável a X cm do rebordo costal direito",
    icone: "🏥",
  },

  // ABDOME
  {
    id: "ped-inspecao-abdome",
    sistema: "abdome",
    titulo: "Inspecionar abdome",
    descricao: "Abaulamento, cicatrizes, equimoses, exantema, respiração abdominal",
    icone: "👀",
  },
  {
    id: "ped-palpacao-abdome",
    sistema: "abdome",
    titulo: "Palpar abdome superficial",
    descricao: "Defesa, distensão, dor, locais específicos",
    icone: "🤚",
  },
  {
    id: "ped-palpar-figado",
    sistema: "abdome",
    titulo: "Palpar fígado",
    descricao: "Fígado palpável sim/não, a quantos cm, consistência, dor",
    icone: "🏠",
  },
  {
    id: "ped-palpar-baco",
    sistema: "abdome",
    titulo: "Palpar baço",
    descricao: "Baço palpável sim/não, tamanho, consistência",
    icone: "⭐",
  },

  // CRESCIMENTO E DESENVOLVIMENTO
  {
    id: "ped-verificar-peso",
    sistema: "crescimento",
    titulo: "Verificar peso",
    descricao: "Peso em kg, percentil para idade",
    icone: "⚖️",
  },
  {
    id: "ped-verificar-comprimento",
    sistema: "crescimento",
    titulo: "Verificar comprimento/estatura",
    descricao: "Comprimento (lactente) ou estatura (criança), percentil para idade",
    icone: "📏",
  },
  {
    id: "ped-perimetro-cefalico",
    sistema: "crescimento",
    titulo: "Medir perímetro cefálico",
    descricao: "Perímetro cefálico em cm, percentil para idade, se lactente",
    icone: "🧠",
  },
  {
    id: "ped-marcos-desenvolvimento",
    sistema: "crescimento",
    titulo: "Avaliar marcos do desenvolvimento",
    descricao: "Fala, motor, social/afetivo conforme faixa etária",
    icone: "🧩",
  },
  {
    id: "ped-alimentacao",
    sistema: "crescimento",
    titulo: "Avaliar alimentação",
    descricao: "Tipo de alimento, ganho ponderal, aceitação",
    icone: "🍼",
  },

  // HEMOLINFOPOIÉTICO
  {
    id: "ped-linfonodos-cervicais",
    sistema: "hemolinfopoietico",
    titulo: "Palpar linfonodos cervicais",
    descricao: "Tamanho, consistência, mobilidade, dor, localização",
    icone: "🫨",
  },
  {
    id: "ped-figado-espleno",
    sistema: "hemolinfopoietico",
    titulo: "Avaliar fígado e baço",
    descricao: "Hepatomegalia e/ou esplenomegalia sim/não",
    icone: "🏛️",
  },
  {
    id: "ped-equimoses-petequias",
    sistema: "hemolinfopoietico",
    titulo: "Avaliar equimoses/petéquias",
    descricao: "Presença, distribuição, tamanho, coloração",
    icone: "🔵",
  },
  {
    id: "ped-palidez-mucosas",
    sistema: "hemolinfopoietico",
    titulo: "Avaliar palidez cutaneomucosa",
    descricao: "Palidez palmar, conjuntival, de mucosas",
    icone: "😶",
  },

  // PELE
  {
    id: "ped-exantema",
    sistema: "pele",
    titulo: "Avaliar exantema",
    descricao: "Tipo, distribuição, localização, acompanhamento (pápulas, vesículas, etc)",
    icone: "🔴",
  },
  {
    id: "ped-petequias",
    sistema: "pele",
    titulo: "Avaliar petéquias",
    descricao: "Pequenas manchas vermelhas não branqueáveis",
    icone: "🔴",
  },
  {
    id: "ped-equimoses-pele",
    sistema: "pele",
    titulo: "Avaliar equimoses",
    descricao: "Roxos, em diferentes estágios de coloração",
    icone: "🟣",
  },
  {
    id: "ped-mucosas",
    sistema: "pele",
    titulo: "Avaliar mucosas",
    descricao: "Hidratação, coloração, lesões, aftas",
    icone: "👅",
  },
];

// Mapear sistemas para labels em português
export const SISTEMAS_LABELS: Record<SistemaPediatrico, string> = {
  geral: "Geral",
  respiratorio: "Respiratório",
  cardiovascular: "Cardiovascular",
  abdome: "Abdome",
  crescimento: "Crescimento/Desenvolvimento",
  hemolinfopoietico: "Hemolinfopoiético",
  pele: "Pele",
};

// Obter ações por sistema
export function obterAcoesPorSistema(sistema: SistemaPediatrico): AcaoExameFisicoPed[] {
  return ACOES_EXAME_FISICO_PEDIATRICO.filter((acao) => acao.sistema === sistema);
}

// Obter todos os sistemas únicos
export function obterSistemas(): SistemaPediatrico[] {
  const sistemas = new Set(ACOES_EXAME_FISICO_PEDIATRICO.map((acao) => acao.sistema));
  return Array.from(sistemas).sort() as SistemaPediatrico[];
}
