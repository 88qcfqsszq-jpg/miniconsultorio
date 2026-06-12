// Coordenadas dinâmicas para regiões anatômicas pediátricas
// Diferentes conforme a faixa etária (lactente vs criança)

import { CoordenadaHotspot, RegiaoPediatricaId } from './regioes-exame';

/**
 * Mapa de coordenadas por faixa etária
 * Lactentes e crianças têm proporções diferentes
 */

// Coordenadas para LACTENTE (neonato, lactente)
const COORDENADAS_LACTENTE: Record<RegiaoPediatricaId, CoordenadaHotspot> = {
  estado_geral: { x: 20, y: 8, width: 60, height: 82 },
  pele_mucosas: { x: 25, y: 12, width: 50, height: 72 },
  cabeca_perimetro: { x: 44, y: 8, width: 14, height: 10 },
  face_olhos: { x: 38, y: 15, width: 24, height: 10 },
  orofaringe: { x: 43, y: 23, width: 14, height: 6 },
  pescoco_linfonodos: { x: 42, y: 28, width: 16, height: 8 },
  torax_respiratorio: { x: 32, y: 34, width: 36, height: 18 },
  precordio: { x: 50, y: 38, width: 16, height: 12 },
  abdome: { x: 34, y: 50, width: 32, height: 18 },
  figado: { x: 34, y: 51, width: 16, height: 12 },
  baco: { x: 52, y: 51, width: 16, height: 12 },
  membros_perfusao: { x: 25, y: 68, width: 50, height: 25 },
  desenvolvimento: { x: 20, y: 8, width: 60, height: 82 },
};

// Coordenadas para CRIANÇA (pré-escolar, escolar, adolescente)
const COORDENADAS_CRIANCA: Record<RegiaoPediatricaId, CoordenadaHotspot> = {
  estado_geral: { x: 20, y: 8, width: 60, height: 84 },
  pele_mucosas: { x: 25, y: 10, width: 50, height: 78 },
  cabeca_perimetro: { x: 39, y: 7, width: 20, height: 10 },
  face_olhos: { x: 38, y: 13, width: 24, height: 10 },
  orofaringe: { x: 42, y: 20, width: 16, height: 6 },
  pescoco_linfonodos: { x: 40, y: 25, width: 20, height: 8 },
  torax_respiratorio: { x: 32, y: 32, width: 36, height: 18 },
  precordio: { x: 47, y: 35, width: 16, height: 12 },
  abdome: { x: 34, y: 48, width: 32, height: 16 },
  figado: { x: 34, y: 50, width: 16, height: 10 },
  baco: { x: 52, y: 50, width: 16, height: 10 },
  membros_perfusao: { x: 22, y: 65, width: 56, height: 28 },
  desenvolvimento: { x: 20, y: 8, width: 60, height: 84 },
};

/**
 * Obtém as coordenadas ajustadas conforme a faixa etária
 *
 * @param regioId - ID da região
 * @param faixaEtaria - Faixa etária do paciente
 * @returns Coordenadas ajustadas
 */
export function obterCoordenadas(
  regioId: RegiaoPediatricaId,
  faixaEtaria?: string
): CoordenadaHotspot {
  const ehLactente = faixaEtaria === 'neonato' || faixaEtaria === 'lactente';

  if (ehLactente) {
    return COORDENADAS_LACTENTE[regioId] || { x: 0, y: 0, width: 0, height: 0 };
  }

  return COORDENADAS_CRIANCA[regioId] || { x: 0, y: 0, width: 0, height: 0 };
}

/**
 * Obtém a altura recomendada do container conforme a faixa etária
 * Lactentes são mais curtos proporcionalmente
 *
 * @param faixaEtaria - Faixa etária do paciente
 * @returns Classe Tailwind para altura
 */
export function obterAlturaContainer(faixaEtaria?: string): string {
  const ehLactente = faixaEtaria === 'neonato' || faixaEtaria === 'lactente';
  return ehLactente ? 'h-[500px]' : 'h-[680px]';
}

/**
 * Obtém a proporção aspect-ratio da imagem conforme faixa etária
 *
 * @param faixaEtaria - Faixa etária do paciente
 * @returns Proporção em pixels ou string
 */
export function obterAspectRatioImagem(faixaEtaria?: string): number {
  const ehLactente = faixaEtaria === 'neonato' || faixaEtaria === 'lactente';
  if (ehLactente) {
    // lactente-frente.png: 1149 x 1369
    return 1149 / 1369;
  }
  // crianca-frente.png: 1024 x 1536
  return 1024 / 1536;
}
