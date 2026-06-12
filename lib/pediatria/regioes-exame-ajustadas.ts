// Regiões anatômicas pediátricas com coordenadas ajustadas por imagem
// Lactente e criança têm proporções e posicionamentos diferentes
// Hotspots alinhados aos círculos coloridos nas imagens

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
// Imagem: lactente-frente.png
// Hotspots alinhados aos círculos coloridos
// ============================================================================

export const REGIOES_PEDIATRICAS_LACTENTE: RegiaoPediatricaAjustada[] = [
  {
    id: "cabeca_perimetro",
    label: "Cabeça / Perímetro Cefálico",
    descricao: "Avaliação craniana",
    coordenadas: { x: 46, y: 10, width: 10, height: 8 },
    acoes: [
      "perimetro_cefalico",
      "fontanela",
      "formato_craniano",
    ],
    zIndex: 50,
  },
  {
    id: "face_olhos",
    label: "Olhos / Face",
    descricao: "Avaliação facial",
    coordenadas: { x: 56, y: 19, width: 9, height: 7 },
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
    coordenadas: { x: 45, y: 25, width: 9, height: 6 },
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
    coordenadas: { x: 51, y: 32, width: 10, height: 8 },
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
    coordenadas: { x: 35, y: 37, width: 28, height: 18 },
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
    coordenadas: { x: 54, y: 44, width: 10, height: 8 },
    acoes: [
      "ausculta_focos",
      "sopro",
      "ritmo_cardiaco",
      "cianose_cardiaca",
    ],
    zIndex: 48,
  },
  {
    id: "abdome",
    label: "Abdome",
    descricao: "Avaliação abdominal geral",
    coordenadas: { x: 36, y: 53, width: 26, height: 15 },
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
    coordenadas: { x: 34, y: 57, width: 10, height: 8 },
    acoes: [
      "palpacao_figado",
      "hepatomegalia",
      "sensibilidade_hipocondrio_d",
    ],
    zIndex: 49,
  },
  {
    id: "baco",
    label: "Baço / Hipocôndrio E",
    descricao: "Avaliação esplênica",
    coordenadas: { x: 58, y: 57, width: 10, height: 8 },
    acoes: [
      "palpacao_baco",
      "esplenomegalia",
    ],
    zIndex: 49,
  },
  {
    id: "membros_perfusao",
    label: "Membros / Perfusão / Pulsos / TEC",
    descricao: "Avaliação de extremidades",
    coordenadas: { x: 28, y: 77, width: 36, height: 15 },
    acoes: [
      "pulsos_perifericos",
      "tempo_enchimento_capilar",
      "extremidades_frias",
      "edema",
      "petequias_equimoses_membros",
    ],
    zIndex: 40,
  },
  {
    id: "pele_mucosas",
    label: "Pele / Mucosas",
    descricao: "Avaliação cutânea geral",
    coordenadas: { x: 25, y: 13, width: 55, height: 72 },
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
    coordenadas: { x: 20, y: 8, width: 60, height: 86 },
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
    coordenadas: { x: 20, y: 8, width: 60, height: 86 },
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
// Imagem: crianca-frente.png
// Hotspots alinhados aos círculos coloridos
// ============================================================================

export const REGIOES_PEDIATRICAS_CRIANCA: RegiaoPediatricaAjustada[] = [
  {
    id: "cabeca_perimetro",
    label: "Cabeça / Perímetro Cefálico",
    descricao: "Avaliação craniana",
    coordenadas: { x: 30, y: 12, width: 11, height: 8 },
    acoes: [
      "perimetro_cefalico",
      "fontanela",
      "formato_craniano",
    ],
    zIndex: 50,
  },
  {
    id: "face_olhos",
    label: "Olhos / Face",
    descricao: "Avaliação facial",
    coordenadas: { x: 36, y: 20, width: 9, height: 7 },
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
    coordenadas: { x: 35, y: 27, width: 9, height: 7 },
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
    coordenadas: { x: 32, y: 33, width: 10, height: 8 },
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
    coordenadas: { x: 20, y: 39, width: 26, height: 18 },
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
    coordenadas: { x: 36, y: 43, width: 10, height: 8 },
    acoes: [
      "ausculta_focos",
      "sopro",
      "ritmo_cardiaco",
      "cianose_cardiaca",
    ],
    zIndex: 48,
  },
  {
    id: "abdome",
    label: "Abdome",
    descricao: "Avaliação abdominal geral",
    coordenadas: { x: 25, y: 52, width: 24, height: 15 },
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
    coordenadas: { x: 20, y: 61, width: 10, height: 8 },
    acoes: [
      "palpacao_figado",
      "hepatomegalia",
      "sensibilidade_hipocondrio_d",
    ],
    zIndex: 49,
  },
  {
    id: "baco",
    label: "Baço / Hipocôndrio E",
    descricao: "Avaliação esplênica",
    coordenadas: { x: 40, y: 61, width: 10, height: 8 },
    acoes: [
      "palpacao_baco",
      "esplenomegalia",
    ],
    zIndex: 49,
  },
  {
    id: "membros_perfusao",
    label: "Membros / Perfusão / Pulsos / TEC",
    descricao: "Avaliação de extremidades",
    coordenadas: { x: 20, y: 80, width: 32, height: 12 },
    acoes: [
      "pulsos_perifericos",
      "tempo_enchimento_capilar",
      "extremidades_frias",
      "edema",
      "petequias_equimoses_membros",
    ],
    zIndex: 40,
  },
  {
    id: "pele_mucosas",
    label: "Pele / Mucosas",
    descricao: "Avaliação cutânea geral",
    coordenadas: { x: 24, y: 18, width: 28, height: 60 },
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
    coordenadas: { x: 18, y: 8, width: 36, height: 82 },
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
    coordenadas: { x: 18, y: 8, width: 36, height: 82 },
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
