// Mapeamento de ações para achados brutos do exame físico pediátrico visual
// Os achados são específicos por caso e sem diagnóstico

import { Caso } from "@/lib/types";
import { AcaoPediatricaId } from "./regioes-exame";

export interface AchadoVisualPediatrico {
  id: string;
  titulo: string;
  descricao: string;
  regiao: string;
  acaoRealizada: string;
}

// Função central para obter achado bruto baseado na ação e no caso
export function obterAchadoVisualPediatrico(
  casoId: string,
  acaoId: AcaoPediatricaId,
  caso?: Caso
): AchadoVisualPediatrico | null {
  // Mapeamento de achados por caso
  const achadosPorCaso: Record<string, Record<AcaoPediatricaId, AchadoVisualPediatrico>> = {
    // ===== CASO PED-01: FEBRE EM CRIANÇA DE 4 ANOS =====
    "ped-01": {
      estado_geral: {
        id: "ped-01-estado-geral",
        titulo: "Estado Geral",
        descricao: "Criança apática, em repouso, com leve desconforto.",
        regiao: "estado_geral",
        acaoRealizada: "Avaliar estado geral",
      },
      nivel_atividade: {
        id: "ped-01-nivel-atividade",
        titulo: "Nível de Atividade",
        descricao: "Criança hipoativa, responsiva aos estímulos.",
        regiao: "estado_geral",
        acaoRealizada: "Avaliar nível de atividade",
      },
      irritabilidade: {
        id: "ped-01-irritabilidade",
        titulo: "Irritabilidade",
        descricao: "Sem irritabilidade exagerada, responde adequadamente.",
        regiao: "estado_geral",
        acaoRealizada: "Avaliar irritabilidade",
      },
      interacao_responsavel: {
        id: "ped-01-interacao",
        titulo: "Interação com Responsável",
        descricao: "Criança interage com mãe, mantém contato visual.",
        regiao: "estado_geral",
        acaoRealizada: "Interação com responsável",
      },
      palidez: {
        id: "ped-01-palidez",
        titulo: "Palidez",
        descricao: "Palidez leve, sem alterações significativas.",
        regiao: "pele_mucosas",
        acaoRealizada: "Avaliar palidez",
      },
      cianose: {
        id: "ped-01-cianose",
        titulo: "Cianose",
        descricao: "Sem cianose central ou periférica.",
        regiao: "pele_mucosas",
        acaoRealizada: "Avaliar cianose",
      },
      hidratacao_mucosas: {
        id: "ped-01-hidratacao",
        titulo: "Hidratação de Mucosas",
        descricao: "Mucosas úmidas, turgor normal.",
        regiao: "pele_mucosas",
        acaoRealizada: "Hidratação de mucosas",
      },
      exantema: {
        id: "ped-01-exantema",
        titulo: "Exantema",
        descricao: "Sem exantema visível.",
        regiao: "pele_mucosas",
        acaoRealizada: "Avaliar exantema",
      },
      petequias: {
        id: "ped-01-petequias",
        titulo: "Petéquias",
        descricao: "Sem petéquias.",
        regiao: "pele_mucosas",
        acaoRealizada: "Avaliar petéquias",
      },
      equimoses: {
        id: "ped-01-equimoses",
        titulo: "Equimoses",
        descricao: "Sem equimoses.",
        regiao: "pele_mucosas",
        acaoRealizada: "Avaliar equimoses",
      },
      perimetro_cefalico: {
        id: "ped-01-perimetro",
        titulo: "Perímetro Cefálico",
        descricao: "Não aplicável para esta faixa etária (criança 4 anos).",
        regiao: "cabeca_perimetro",
        acaoRealizada: "Medir perímetro cefálico",
      },
      fontanela: {
        id: "ped-01-fontanela",
        titulo: "Fontanela",
        descricao: "Não aplicável em criança de 4 anos (fontanelas fechadas).",
        regiao: "cabeca_perimetro",
        acaoRealizada: "Avaliar fontanela",
      },
      formato_craniano: {
        id: "ped-01-formato",
        titulo: "Formato Craniano",
        descricao: "Simétrico, sem deformidades aparentes.",
        regiao: "cabeca_perimetro",
        acaoRealizada: "Formato craniano",
      },
      cianose_central: {
        id: "ped-01-cianose-central",
        titulo: "Cianose Central",
        descricao: "Lábios e língua com coloração normal, sem cianose.",
        regiao: "face_olhos",
        acaoRealizada: "Cianose central",
      },
      palidez_conjuntival: {
        id: "ped-01-palidez-conjuntival",
        titulo: "Palidez Conjuntival",
        descricao: "Conjuntivas coradas, sem palidez significativa.",
        regiao: "face_olhos",
        acaoRealizada: "Palidez conjuntival",
      },
      sinais_desidratacao: {
        id: "ped-01-desidratacao",
        titulo: "Sinais de Desidratação",
        descricao: "Olhos normais, sem depressão, turgor normal.",
        regiao: "face_olhos",
        acaoRealizada: "Sinais de desidratação",
      },
      mucosa_oral: {
        id: "ped-01-mucosa-oral",
        titulo: "Mucosa Oral",
        descricao: "Mucosa oral úmida, corada, sem lesões.",
        regiao: "orofaringe",
        acaoRealizada: "Mucosa oral",
      },
      hiperemia_orofaringe: {
        id: "ped-01-hiperemia",
        titulo: "Hiperemia de Orofaringe",
        descricao: "Orofaringe ligeiramente hiperemiada, compatível com febre.",
        regiao: "orofaringe",
        acaoRealizada: "Hiperemia de orofaringe",
      },
      lesoes_orais: {
        id: "ped-01-lesoes",
        titulo: "Lesões Orais",
        descricao: "Sem aftas ou lesões orais.",
        regiao: "orofaringe",
        acaoRealizada: "Lesões orais",
      },
      linfonodos_cervicais: {
        id: "ped-01-linfonodos",
        titulo: "Linfonodos Cervicais",
        descricao: "Linfonodos cervicais não palpáveis ou discretamente palpáveis (<1 cm).",
        regiao: "pescoco_linfonodos",
        acaoRealizada: "Linfonodos cervicais",
      },
      descricao_linfonodos: {
        id: "ped-01-descricao-linf",
        titulo: "Descrição de Linfonodos",
        descricao: "Se palpáveis: móveis, de consistência fibroelástica, indolores.",
        regiao: "pescoco_linfonodos",
        acaoRealizada: "Descrever linfonodos",
      },
      rigidez_nuca: {
        id: "ped-01-rigidez",
        titulo: "Rigidez de Nuca",
        descricao: "Sem rigidez de nuca.",
        regiao: "pescoco_linfonodos",
        acaoRealizada: "Rigidez de nuca",
      },
      frequencia_respiratoria: {
        id: "ped-01-fr",
        titulo: "Frequência Respiratória",
        descricao: "FR = 28 irpm, contada por 1 minuto completo, ligeiramente elevada para idade.",
        regiao: "torax_respiratorio",
        acaoRealizada: "Frequência respiratória",
      },
      tiragens: {
        id: "ped-01-tiragens",
        titulo: "Tiragens",
        descricao: "Sem tiragens intercostais, subcostais ou supraesternais.",
        regiao: "torax_respiratorio",
        acaoRealizada: "Tiragens",
      },
      batimento_asa_nasal: {
        id: "ped-01-asa-nasal",
        titulo: "Batimento de Asa Nasal",
        descricao: "Sem batimento de asa nasal.",
        regiao: "torax_respiratorio",
        acaoRealizada: "Batimento de asa nasal",
      },
      expansibilidade: {
        id: "ped-01-expansibilidade",
        titulo: "Expansibilidade Torácica",
        descricao: "Expansão simétrica bilateral.",
        regiao: "torax_respiratorio",
        acaoRealizada: "Expansibilidade torácica",
      },
      ausculta_pulmonar: {
        id: "ped-01-ausculta-pulm",
        titulo: "Ausculta Pulmonar",
        descricao: "Murmúrio vesicular presente bilateralmente, sem roncos, sibilos ou crepitações.",
        regiao: "torax_respiratorio",
        acaoRealizada: "Ausculta pulmonar",
      },
      ausculta_focos: {
        id: "ped-01-ausculta-focos",
        titulo: "Ausculta de Focos Cardíacos",
        descricao: "Bulhas normofonéticas, ritmo regular, FC = 118 bpm (taquicardia leve compatível com febre).",
        regiao: "precordio",
        acaoRealizada: "Ausculta de focos cardíacos",
      },
      sopro: {
        id: "ped-01-sopro",
        titulo: "Sopro Cardíaco",
        descricao: "Sem sopros cardíacos detectados.",
        regiao: "precordio",
        acaoRealizada: "Sopro cardíaco",
      },
      ritmo_cardiaco: {
        id: "ped-01-ritmo",
        titulo: "Ritmo Cardíaco",
        descricao: "Ritmo regular, frequência aumentada compatível com febre.",
        regiao: "precordio",
        acaoRealizada: "Ritmo cardíaco",
      },
      cianose_cardiaca: {
        id: "ped-01-cianose-card",
        titulo: "Cianose Associada",
        descricao: "Sem cianose ao examinar precórdio.",
        regiao: "precordio",
        acaoRealizada: "Cianose associada",
      },
      inspecao_abdome: {
        id: "ped-01-inspecao-abd",
        titulo: "Inspeção Abdominal",
        descricao: "Abdome plano, sem abaulamentos, cicatrizes ou alterações visíveis.",
        regiao: "abdome",
        acaoRealizada: "Inspeção abdominal",
      },
      palpacao_abdome: {
        id: "ped-01-palpacao-abd",
        titulo: "Palpação Abdominal",
        descricao: "Abdome flácido, indolor, sem defesa abdominal.",
        regiao: "abdome",
        acaoRealizada: "Palpação abdominal",
      },
      dor_abdominal: {
        id: "ped-01-dor-abd",
        titulo: "Dor Abdominal",
        descricao: "Sem dor à palpação.",
        regiao: "abdome",
        acaoRealizada: "Dor abdominal",
      },
      distensao: {
        id: "ped-01-distensao",
        titulo: "Distensão Abdominal",
        descricao: "Abdome não distendido.",
        regiao: "abdome",
        acaoRealizada: "Distensão abdominal",
      },
      palpacao_figado: {
        id: "ped-01-palp-figado",
        titulo: "Palpação Hepática",
        descricao: "Fígado não palpável abaixo da margem costal direita.",
        regiao: "figado",
        acaoRealizada: "Palpação hepática",
      },
      hepatomegalia: {
        id: "ped-01-hepatomegalia",
        titulo: "Hepatomegalia",
        descricao: "Sem hepatomegalia.",
        regiao: "figado",
        acaoRealizada: "Hepatomegalia",
      },
      sensibilidade_hipocondrio_d: {
        id: "ped-01-sensibilidade-d",
        titulo: "Sensibilidade Hipocondrial D",
        descricao: "Sem dor ao palpar hipocôndrio direito.",
        regiao: "figado",
        acaoRealizada: "Sensibilidade hipocondrial D",
      },
      palpacao_baco: {
        id: "ped-01-palp-baco",
        titulo: "Palpação Esplênica",
        descricao: "Baço não palpável.",
        regiao: "baco",
        acaoRealizada: "Palpação esplênica",
      },
      esplenomegalia: {
        id: "ped-01-esplenomegalia",
        titulo: "Esplenomegalia",
        descricao: "Sem esplenomegalia.",
        regiao: "baco",
        acaoRealizada: "Esplenomegalia",
      },
      pulsos_perifericos: {
        id: "ped-01-pulsos",
        titulo: "Pulsos Periféricos",
        descricao: "Pulsos radiais, braquiais e femorais presentes, simétricos e de amplitude normal.",
        regiao: "membros_perfusao",
        acaoRealizada: "Pulsos periféricos",
      },
      tempo_enchimento_capilar: {
        id: "ped-01-tec",
        titulo: "TEC (Tempo Enchimento Capilar)",
        descricao: "Tempo de enchimento capilar <2 segundos, perfusão normal.",
        regiao: "membros_perfusao",
        acaoRealizada: "TEC",
      },
      extremidades_frias: {
        id: "ped-01-extremidades",
        titulo: "Extremidades Frias",
        descricao: "Extremidades quentes ao toque.",
        regiao: "membros_perfusao",
        acaoRealizada: "Extremidades frias",
      },
      edema: {
        id: "ped-01-edema",
        titulo: "Edema em Membros",
        descricao: "Sem edema em membros inferiores.",
        regiao: "membros_perfusao",
        acaoRealizada: "Edema em membros",
      },
      petequias_equimoses_membros: {
        id: "ped-01-petequias-membros",
        titulo: "Petéquias/Equimoses",
        descricao: "Sem petéquias ou equimoses em membros.",
        regiao: "membros_perfusao",
        acaoRealizada: "Petéquias/equimoses",
      },
      marcos_desenvolvimento: {
        id: "ped-01-marcos",
        titulo: "Marcos do Desenvolvimento",
        descricao: "Fala clara, coordenação motora adequada para idade de 4 anos.",
        regiao: "desenvolvimento",
        acaoRealizada: "Marcos do desenvolvimento",
      },
      postura: {
        id: "ped-01-postura",
        titulo: "Postura",
        descricao: "Postura ereta, sem deformidades óbvias.",
        regiao: "desenvolvimento",
        acaoRealizada: "Postura",
      },
      resposta_social: {
        id: "ped-01-resposta-social",
        titulo: "Resposta Social",
        descricao: "Criança mantém contato visual, sorri quando solicitado, responde a nomes.",
        regiao: "desenvolvimento",
        acaoRealizada: "Resposta social",
      },
      fala_interacao: {
        id: "ped-01-fala",
        titulo: "Fala e Interação",
        descricao: "Linguagem clara, apropriada para idade, comunica-se adequadamente.",
        regiao: "desenvolvimento",
        acaoRealizada: "Fala e interação",
      },
    },
  };

  // Retornar achado específico do caso e ação, ou null se não encontrado
  if (achadosPorCaso[casoId] && achadosPorCaso[casoId][acaoId]) {
    return achadosPorCaso[casoId][acaoId];
  }

  // Achado padrão genérico se caso não mapeado
  return null;
}

// Função para converter achado visual em formato compatível com o sistema geral
export function converterAchadoVisualParaSistema(achado: AchadoVisualPediatrico): any {
  return {
    id: achado.id,
    titulo: achado.titulo,
    descricao: achado.descricao,
    categoria: "exame_fisico_visual",
    regiao: achado.regiao,
    acaoRealizada: achado.acaoRealizada,
    sistema: "pediatria",
  };
}
