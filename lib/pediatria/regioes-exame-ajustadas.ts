// Regiões anatômicas pediátricas com coordenadas ajustadas por imagem
// Lactente e criança têm proporções e posicionamentos diferentes

import { CoordenadaHotspot } from './regioes-exame';

export type RegiaoPediatricaId =
  | "cabeca_perimetro"
  | "face_olhos"
  | "orofaringe"
  | "pescoco_linfonodos"
  | "torax_respiratorio"
  | "precordio"
  | "abdome"
  | "figado"
  | "baco"
  | "membros_perfusao"
  | "pele_mucosas"
  | "desenvolvimento"
  | "estado_geral";

export interface RegiaoPediatricaAjustada {
  id: RegiaoPediatricaId;
  label: string;
  descricao: string;
  coordenadas: CoordenadaHotspot;
  acoes: string[];
  zIndex: number; // Prioridade de clique (maior = maior prioridade)
}

// ============================================================================
// COORDENADAS PARA LACTENTE (neonato, lactente)
// Imagem: lactente-frente.png (1149 x 1369 px)
// ============================================================================

export const REGIOES_PEDIATRICAS_LACTENTE: RegiaoPediatricaAjustada[] = [
  {
    id: "cabeca_perimetro",
    label: "Cabeça / Perímetro Cefálico",
    descricao: "Avaliação craniana",
    coordenadas: { x: 43, y: 8, width: 15, height: 9 },
    acoes: [
      "perimetro_cefalico",
      "fontanela",
      "formato_craniano",
    ],
    zIndex: 50,
  },
  {
    id: "face_olhos",
    label: "Face / Olhos",
    descricao: "Avaliação facial",
    coordenadas: { x: 36, y: 15, width: 28, height: 10 },
    acoes: [
      "cianose_central",
      "palidez_conjuntival",
      "sinais_desidratacao",
    ],
    zIndex: 50,
  },
  {
    id: "orofaringe",
    label: "Orofaringe",
    descricao: "Avaliação da boca e garganta",
    coordenadas: { x: 42, y: 23, width: 16, height: 6 },
    acoes: [
      "mucosa_oral",
      "hiperemia_orofaringe",
      "lesoes_orais",
    ],
    zIndex: 50,
  },
  {
    id: "pescoco_linfonodos",
    label: "Pescoço / Linfonodos",
    descricao: "Avaliação cervical",
    coordenadas: { x: 41, y: 28, width: 18, height: 7 },
    acoes: [
      "linfonodos_cervicais",
      "descricao_linfonodos",
      "rigidez_nuca",
    ],
    zIndex: 50,
  },
  {
    id: "torax_respiratorio",
    label: "Tórax Respiratório",
    descricao: "Avaliação respiratória",
    coordenadas: { x: 31, y: 34, width: 38, height: 18 },
    acoes: [
      "frequencia_respiratoria",
      "tiragens",
      "batimento_asa_nasal",
      "expansibilidade",
      "ausculta_pulmonar",
    ],
    zIndex: 40,
  },
  {
    id: "precordio",
    label: "Precórdio",
    descricao: "Avaliação cardiovascular",
    coordenadas: { x: 50, y: 38, width: 16, height: 12 },
    acoes: [
      "ausculta_focos",
      "sopro",
      "ritmo_cardiaco",
      "cianose_cardiaca",
    ],
    zIndex: 45,
  },
  {
    id: "abdome",
    label: "Abdome",
    descricao: "Avaliação abdominal geral",
    coordenadas: { x: 33, y: 50, width: 34, height: 18 },
    acoes: [
      "inspecao_abdome",
      "palpacao_abdome",
      "dor_abdominal",
      "distensao",
    ],
    zIndex: 35,
  },
  {
    id: "figado",
    label: "Fígado / Hipocôndrio D",
    descricao: "Avaliação hepática",
    coordenadas: { x: 34, y: 51, width: 16, height: 12 },
    acoes: [
      "palpacao_figado",
      "hepatomegalia",
      "sensibilidade_hipocondrio_d",
    ],
    zIndex: 48,
  },
  {
    id: "baco",
    label: "Baço / Hipocôndrio E",
    descricao: "Avaliação esplênica",
    coordenadas: { x: 52, y: 51, width: 16, height: 12 },
    acoes: [
      "palpacao_baco",
      "esplenomegalia",
    ],
    zIndex: 48,
  },
  {
    id: "membros_perfusao",
    label: "Membros / Perfusão",
    descricao: "Avaliação de extremidades",
    coordenadas: { x: 20, y: 66, width: 60, height: 27 },
    acoes: [
      "pulsos_perifericos",
      "tempo_enchimento_capilar",
      "extremidades_frias",
      "edema",
      "petequias_equimoses_membros",
    ],
    zIndex: 30,
  },
  {
    id: "pele_mucosas",
    label: "Pele e Mucosas",
    descricao: "Avaliação cutânea geral",
    coordenadas: { x: 23, y: 12, width: 54, height: 75 },
    acoes: [
      "palidez",
      "cianose",
      "hidratacao_mucosas",
      "exantema",
      "petequias",
      "equimoses",
    ],
    zIndex: 10,
  },
  {
    id: "desenvolvimento",
    label: "Desenvolvimento / Interação",
    descricao: "Avaliação neurodesenvolvimento",
    coordenadas: { x: 18, y: 7, width: 64, height: 86 },
    acoes: [
      "marcos_desenvolvimento",
      "postura",
      "resposta_social",
      "fala_interacao",
    ],
    zIndex: 5,
  },
  {
    id: "estado_geral",
    label: "Estado Geral",
    descricao: "Observação geral da criança",
    coordenadas: { x: 20, y: 7, width: 60, height: 85 },
    acoes: [
      "estado_geral",
      "nivel_atividade",
      "irritabilidade",
      "interacao_responsavel",
    ],
    zIndex: 3,
  },
];

// ============================================================================
// COORDENADAS PARA CRIANÇA (pré-escolar, escolar, adolescente)
// Imagem: crianca-frente.png (1024 x 1536 px)
// ============================================================================

export const REGIOES_PEDIATRICAS_CRIANCA: RegiaoPediatricaAjustada[] = [
  {
    id: "cabeca_perimetro",
    label: "Cabeça / Perímetro Cefálico",
    descricao: "Avaliação craniana",
    coordenadas: { x: 38, y: 7, width: 22, height: 10 },
    acoes: [
      "perimetro_cefalico",
      "fontanela",
      "formato_craniano",
    ],
    zIndex: 50,
  },
  {
    id: "face_olhos",
    label: "Face / Olhos",
    descricao: "Avaliação facial",
    coordenadas: { x: 37, y: 13, width: 26, height: 10 },
    acoes: [
      "cianose_central",
      "palidez_conjuntival",
      "sinais_desidratacao",
    ],
    zIndex: 50,
  },
  {
    id: "orofaringe",
    label: "Orofaringe",
    descricao: "Avaliação da boca e garganta",
    coordenadas: { x: 42, y: 20, width: 16, height: 6 },
    acoes: [
      "mucosa_oral",
      "hiperemia_orofaringe",
      "lesoes_orais",
    ],
    zIndex: 50,
  },
  {
    id: "pescoco_linfonodos",
    label: "Pescoço / Linfonodos",
    descricao: "Avaliação cervical",
    coordenadas: { x: 40, y: 25, width: 20, height: 7 },
    acoes: [
      "linfonodos_cervicais",
      "descricao_linfonodos",
      "rigidez_nuca",
    ],
    zIndex: 50,
  },
  {
    id: "torax_respiratorio",
    label: "Tórax Respiratório",
    descricao: "Avaliação respiratória",
    coordenadas: { x: 31, y: 32, width: 38, height: 18 },
    acoes: [
      "frequencia_respiratoria",
      "tiragens",
      "batimento_asa_nasal",
      "expansibilidade",
      "ausculta_pulmonar",
    ],
    zIndex: 40,
  },
  {
    id: "precordio",
    label: "Precórdio",
    descricao: "Avaliação cardiovascular",
    coordenadas: { x: 47, y: 35, width: 16, height: 12 },
    acoes: [
      "ausculta_focos",
      "sopro",
      "ritmo_cardiaco",
      "cianose_cardiaca",
    ],
    zIndex: 45,
  },
  {
    id: "abdome",
    label: "Abdome",
    descricao: "Avaliação abdominal geral",
    coordenadas: { x: 33, y: 48, width: 34, height: 16 },
    acoes: [
      "inspecao_abdome",
      "palpacao_abdome",
      "dor_abdominal",
      "distensao",
    ],
    zIndex: 35,
  },
  {
    id: "figado",
    label: "Fígado / Hipocôndrio D",
    descricao: "Avaliação hepática",
    coordenadas: { x: 33, y: 50, width: 17, height: 10 },
    acoes: [
      "palpacao_figado",
      "hepatomegalia",
      "sensibilidade_hipocondrio_d",
    ],
    zIndex: 48,
  },
  {
    id: "baco",
    label: "Baço / Hipocôndrio E",
    descricao: "Avaliação esplênica",
    coordenadas: { x: 51, y: 50, width: 17, height: 10 },
    acoes: [
      "palpacao_baco",
      "esplenomegalia",
    ],
    zIndex: 48,
  },
  {
    id: "membros_perfusao",
    label: "Membros / Perfusão",
    descricao: "Avaliação de extremidades",
    coordenadas: { x: 20, y: 65, width: 60, height: 30 },
    acoes: [
      "pulsos_perifericos",
      "tempo_enchimento_capilar",
      "extremidades_frias",
      "edema",
      "petequias_equimoses_membros",
    ],
    zIndex: 30,
  },
  {
    id: "pele_mucosas",
    label: "Pele e Mucosas",
    descricao: "Avaliação cutânea geral",
    coordenadas: { x: 23, y: 10, width: 54, height: 80 },
    acoes: [
      "palidez",
      "cianose",
      "hidratacao_mucosas",
      "exantema",
      "petequias",
      "equimoses",
    ],
    zIndex: 10,
  },
  {
    id: "desenvolvimento",
    label: "Desenvolvimento / Interação",
    descricao: "Avaliação neurodesenvolvimento",
    coordenadas: { x: 18, y: 7, width: 64, height: 86 },
    acoes: [
      "marcos_desenvolvimento",
      "postura",
      "resposta_social",
      "fala_interacao",
    ],
    zIndex: 5,
  },
  {
    id: "estado_geral",
    label: "Estado Geral",
    descricao: "Observação geral da criança",
    coordenadas: { x: 20, y: 7, width: 60, height: 86 },
    acoes: [
      "estado_geral",
      "nivel_atividade",
      "irritabilidade",
      "interacao_responsavel",
    ],
    zIndex: 3,
  },
];

/**
 * Obtém as regiões pediátricas ajustadas conforme a faixa etária
 *
 * @param faixaEtaria - Faixa etária do paciente
 * @returns Array de regiões ajustadas
 */
export function obterRegioesPediatricas(faixaEtaria?: string): RegiaoPediatricaAjustada[] {
  const ehLactente = faixaEtaria === 'neonato' || faixaEtaria === 'lactente';
  return ehLactente ? REGIOES_PEDIATRICAS_LACTENTE : REGIOES_PEDIATRICAS_CRIANCA;
}

/**
 * Obtém uma região específica conforme a faixa etária
 *
 * @param regioId - ID da região
 * @param faixaEtaria - Faixa etária do paciente
 * @returns Região ajustada ou undefined
 */
export function obterRegiaoPediatricaAjustada(
  regioId: RegiaoPediatricaId,
  faixaEtaria?: string
): RegiaoPediatricaAjustada | undefined {
  const regioes = obterRegioesPediatricas(faixaEtaria);
  return regioes.find((r) => r.id === regioId);
}
