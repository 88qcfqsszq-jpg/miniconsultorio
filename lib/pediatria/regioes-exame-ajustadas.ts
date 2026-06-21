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
  hitbox?: CoordenadaHotspot; // Área clicável separada (se diferente de coordenadas)
  targetZone?: string; // Para drag-and-drop validation
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
    coordenadas: { x: 49, y: 10, width: 10, height: 8 },
    targetZone: "head",
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
    targetZone: "face",
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
    coordenadas: { x: 51, y: 25, width: 9, height: 6 },
    targetZone: "mouth",
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
    coordenadas: { x: 51, y: 29, width: 10, height: 8 },
    targetZone: "neck",
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
    coordenadas: { x: 50, y: 37, width: 10, height: 8 },
    targetZone: "thorax",
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
    coordenadas: { x: 57, y: 40, width: 10, height: 8 },
    targetZone: "precordium",
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
    coordenadas: { x: 51, y: 50, width: 10, height: 8 },
    targetZone: "abdomen",
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
    coordenadas: { x: 42, y: 43, width: 10, height: 8 },
    targetZone: "right-hypochondrium",
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
    coordenadas: { x: 61, y: 43, width: 10, height: 8 },
    targetZone: "left-hypochondrium",
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
    coordenadas: { x: 65, y: 69, width: 11, height: 9 },
    targetZone: "limbs",
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
    coordenadas: { x: 38, y: 65, width: 11, height: 9 },
    targetZone: "skin",
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
    coordenadas: { x: 72, y: 30, width: 10, height: 8 },
    targetZone: "development",
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
    coordenadas: { x: 33, y: 30, width: 10, height: 8 },
    targetZone: "general-state",
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
    coordenadas: { x: 10, y: 25, width: 12, height: 35 },
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
    coordenadas: { x: 5, y: 15, width: 10, height: 70 },
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
    coordenadas: { x: 20, y: 92, width: 32, height: 8 },
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
