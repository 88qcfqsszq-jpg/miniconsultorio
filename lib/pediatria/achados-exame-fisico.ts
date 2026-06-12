// Mapeamento de ações para achados brutos de exame físico pediátrico
// Os achados são específicos por caso (tipoPaciente e id do caso)

import { Caso } from "@/lib/types";

export interface AchadoExameFisicoPed {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  sistema: string;
  acaoRealizada: string;
}

// Função geral para obter achado bruto baseado na ação e no caso
export function obterAchadoExameFisicoPed(
  casoId: string,
  acaoId: string,
  caso?: Caso
): AchadoExameFisicoPed | null {
  // Mapeamento por caso
  const achadosPorCaso: Record<string, Record<string, AchadoExameFisicoPed>> = {
    // ===== CASO PED-01: FEBRE EM CRIANÇA DE 4 ANOS =====
    "ped-01": {
      "ped-estado-geral": {
        id: "ped-01-estado-geral",
        titulo: "Estado Geral",
        descricao: "Criança apática, em repouso, com leve desconforto.",
        categoria: "geral",
        sistema: "pediatria",
        acaoRealizada: "Avaliar estado geral",
      },
      "ped-nivel-atividade": {
        id: "ped-01-nivel-atividade",
        titulo: "Nível de Atividade/Irritabilidade",
        descricao: "Criança hipoativa, responsiva aos estímulos, sem irritabilidade exagerada.",
        categoria: "geral",
        sistema: "pediatria",
        acaoRealizada: "Avaliar nível de atividade/irritabilidade",
      },
      "ped-hidratacao": {
        id: "ped-01-hidratacao",
        titulo: "Hidratação",
        descricao: "Mucosas úmidas, turgor normal, sem sinais de desidratação.",
        categoria: "geral",
        sistema: "pediatria",
        acaoRealizada: "Avaliar hidratação",
      },
      "ped-perfusao-tec": {
        id: "ped-01-perfusao",
        titulo: "Perfusão Periférica/TEC",
        descricao: "Extremidades quentes, TEC <2 segundos, coloração normal.",
        categoria: "geral",
        sistema: "pediatria",
        acaoRealizada: "Avaliar perfusão/TEC",
      },
      "ped-cianose": {
        id: "ped-01-cianose",
        titulo: "Cianose",
        descricao: "Sem cianose central ou periférica.",
        categoria: "geral",
        sistema: "pediatria",
        acaoRealizada: "Avaliar cianose",
      },
      "ped-palidez": {
        id: "ped-01-palidez",
        titulo: "Palidez",
        descricao: "Palidez leve, sem alterações significativas.",
        categoria: "geral",
        sistema: "pediatria",
        acaoRealizada: "Avaliar palidez",
      },
      "ped-frequencia-respiratoria": {
        id: "ped-01-fr",
        titulo: "Frequência Respiratória",
        descricao: "FR = 28 irpm (ligeiramente elevada para idade).",
        categoria: "respiratorio",
        sistema: "pediatria",
        acaoRealizada: "Contar frequência respiratória",
      },
      "ped-tiragens": {
        id: "ped-01-tiragens",
        titulo: "Tiragens",
        descricao: "Sem tiragens intercostais, subcostais ou supraesternais.",
        categoria: "respiratorio",
        sistema: "pediatria",
        acaoRealizada: "Avaliar tiragens",
      },
      "ped-batimento-asa-nasal": {
        id: "ped-01-asa-nasal",
        titulo: "Batimento de Asa Nasal",
        descricao: "Sem batimento de asa nasal.",
        categoria: "respiratorio",
        sistema: "pediatria",
        acaoRealizada: "Avaliar batimento de asa nasal",
      },
      "ped-expansibilidade": {
        id: "ped-01-expansibilidade",
        titulo: "Expansibilidade Torácica",
        descricao: "Expansão simétrica bilateral.",
        categoria: "respiratorio",
        sistema: "pediatria",
        acaoRealizada: "Avaliar expansibilidade torácica",
      },
      "ped-ausculta-pulmonar": {
        id: "ped-01-ausculta-pulm",
        titulo: "Ausculta Pulmonar",
        descricao: "Murmúrio vesicular presente bilateralmente, sem roncos, sibilos ou crepitações.",
        categoria: "respiratorio",
        sistema: "pediatria",
        acaoRealizada: "Auscultar pulmões",
      },
      "ped-ausculta-focos": {
        id: "ped-01-ausculta-focos",
        titulo: "Ausculta de Focos Cardíacos",
        descricao: "Bulhas normofonéticas, ritmo regular, FC = 118 bpm (taquicardia leve).",
        categoria: "cardiovascular",
        sistema: "pediatria",
        acaoRealizada: "Auscultar focos cardíacos",
      },
      "ped-sopro": {
        id: "ped-01-sopro",
        titulo: "Avaliação de Sopro",
        descricao: "Sem sopros cardíacos detectados.",
        categoria: "cardiovascular",
        sistema: "pediatria",
        acaoRealizada: "Avaliar presença de sopro",
      },
      "ped-pulsos-perifericos": {
        id: "ped-01-pulsos",
        titulo: "Pulsos Periféricos",
        descricao: "Pulsos radiais, braquiais e femorais presentes, simétricos e de amplitude normal.",
        categoria: "cardiovascular",
        sistema: "pediatria",
        acaoRealizada: "Avaliar pulsos periféricos",
      },
      "ped-perfusao-card": {
        id: "ped-01-perfusao-card",
        titulo: "Perfusão Sistêmica",
        descricao: "Extremidades quentes, cor normal, TEC <2 segundos.",
        categoria: "cardiovascular",
        sistema: "pediatria",
        acaoRealizada: "Avaliar perfusão sistêmica",
      },
      "ped-hepatomegalia": {
        id: "ped-01-hepatomegalia",
        titulo: "Palpação Hepática",
        descricao: "Fígado não palpável ou discretamente palpável na margem costal.",
        categoria: "cardiovascular",
        sistema: "pediatria",
        acaoRealizada: "Palpar fígado (congestão)",
      },
      "ped-inspecao-abdome": {
        id: "ped-01-inspecao-abd",
        titulo: "Inspeção do Abdome",
        descricao: "Abdome plano, sem abaulamentos, cicatrizes ou alterações visíveis.",
        categoria: "abdome",
        sistema: "pediatria",
        acaoRealizada: "Inspecionar abdome",
      },
      "ped-palpacao-abdome": {
        id: "ped-01-palpacao-abd",
        titulo: "Palpação Superficial",
        descricao: "Abdome flácido, indolor, sem defesa abdominal.",
        categoria: "abdome",
        sistema: "pediatria",
        acaoRealizada: "Palpar abdome superficial",
      },
      "ped-palpar-figado": {
        id: "ped-01-figado",
        titulo: "Palpação Hepática",
        descricao: "Fígado não palpável abaixo da margem costal direita.",
        categoria: "abdome",
        sistema: "pediatria",
        acaoRealizada: "Palpar fígado",
      },
      "ped-palpar-baco": {
        id: "ped-01-baco",
        titulo: "Palpação Esplênica",
        descricao: "Baço não palpável.",
        categoria: "abdome",
        sistema: "pediatria",
        acaoRealizada: "Palpar baço",
      },
      "ped-verificar-peso": {
        id: "ped-01-peso",
        titulo: "Verificação de Peso",
        descricao: "Peso = 16 kg (percentil 50 para idade).",
        categoria: "crescimento",
        sistema: "pediatria",
        acaoRealizada: "Verificar peso",
      },
      "ped-verificar-comprimento": {
        id: "ped-01-comprimento",
        titulo: "Verificação de Comprimento/Estatura",
        descricao: "Estatura = 103 cm (percentil 50 para idade).",
        categoria: "crescimento",
        sistema: "pediatria",
        acaoRealizada: "Verificar comprimento/estatura",
      },
      "ped-perimetro-cefalico": {
        id: "ped-01-pc",
        titulo: "Perímetro Cefálico",
        descricao: "Não aplicável para esta faixa etária (criança 4 anos).",
        categoria: "crescimento",
        sistema: "pediatria",
        acaoRealizada: "Medir perímetro cefálico",
      },
      "ped-marcos-desenvolvimento": {
        id: "ped-01-marcos",
        titulo: "Marcos do Desenvolvimento",
        descricao: "Fala clara, coordenação motora adequada para idade, comportamento social esperado.",
        categoria: "crescimento",
        sistema: "pediatria",
        acaoRealizada: "Avaliar marcos do desenvolvimento",
      },
      "ped-alimentacao": {
        id: "ped-01-alimentacao",
        titulo: "Avaliação de Alimentação",
        descricao: "Alimentação reduzida por causa da febre, aceitação baixa no momento.",
        categoria: "crescimento",
        sistema: "pediatria",
        acaoRealizada: "Avaliar alimentação",
      },
      "ped-linfonodos-cervicais": {
        id: "ped-01-linfonodos",
        titulo: "Palpação de Linfonodos Cervicais",
        descricao: "Linfonodos cervicais não palpáveis ou discretamente palpáveis (<1 cm), móveis, indolores.",
        categoria: "hemolinfopoietico",
        sistema: "pediatria",
        acaoRealizada: "Palpar linfonodos cervicais",
      },
      "ped-figado-espleno": {
        id: "ped-01-figado-espleno",
        titulo: "Avaliação de Fígado e Baço",
        descricao: "Hepatomegalia e esplenomegalia ausentes.",
        categoria: "hemolinfopoietico",
        sistema: "pediatria",
        acaoRealizada: "Avaliar fígado e baço",
      },
      "ped-equimoses-petequias": {
        id: "ped-01-equimoses",
        titulo: "Avaliação de Equimoses/Petéquias",
        descricao: "Sem equimoses ou petéquias.",
        categoria: "hemolinfopoietico",
        sistema: "pediatria",
        acaoRealizada: "Avaliar equimoses/petéquias",
      },
      "ped-palidez-mucosas": {
        id: "ped-01-palidez-mucosas",
        titulo: "Palidez Cutaneomucosa",
        descricao: "Palidez discreta, mucosas levemente pálidas.",
        categoria: "hemolinfopoietico",
        sistema: "pediatria",
        acaoRealizada: "Avaliar palidez cutaneomucosa",
      },
      "ped-exantema": {
        id: "ped-01-exantema",
        titulo: "Avaliação de Exantema",
        descricao: "Sem exantema visível.",
        categoria: "pele",
        sistema: "pediatria",
        acaoRealizada: "Avaliar exantema",
      },
      "ped-petequias": {
        id: "ped-01-petequias",
        titulo: "Avaliação de Petéquias",
        descricao: "Sem petéquias.",
        categoria: "pele",
        sistema: "pediatria",
        acaoRealizada: "Avaliar petéquias",
      },
      "ped-equimoses-pele": {
        id: "ped-01-equimoses-pele",
        titulo: "Avaliação de Equimoses",
        descricao: "Sem equimoses.",
        categoria: "pele",
        sistema: "pediatria",
        acaoRealizada: "Avaliar equimoses",
      },
      "ped-mucosas": {
        id: "ped-01-mucosas",
        titulo: "Avaliação de Mucosas",
        descricao: "Mucosas úmidas, sem lesões, aftas ou alterações significativas.",
        categoria: "pele",
        sistema: "pediatria",
        acaoRealizada: "Avaliar mucosas",
      },
    },
  };

  // Retornar achado específico do caso e ação, ou null se não encontrado
  if (achadosPorCaso[casoId] && achadosPorCaso[casoId][acaoId]) {
    return achadosPorCaso[casoId][acaoId];
  }

  // Se não encontrou achado específico, retornar null
  // (será implementado em casos futuros)
  return null;
}

// Função para converter achado em formato compatível com o sistema de achados geral
export function converterAchadoParaSistema(achado: AchadoExameFisicoPed): any {
  return {
    id: achado.id,
    titulo: achado.titulo,
    descricao: achado.descricao,
    categoria: "exame_fisico",
    regiao: achado.categoria,
    acaoRealizada: achado.acaoRealizada,
  };
}
