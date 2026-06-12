// Regiões arrastáveis do lactente com suas zonas de drop correspondentes
export const LACTENTE_REGIONS = [
  {
    id: 'cabeca',
    label: 'Cabeça / Perímetro Cefálico',
    targetZone: 'head',
  },
  {
    id: 'olhos_face',
    label: 'Olhos / Face',
    targetZone: 'face',
  },
  {
    id: 'orofaringe',
    label: 'Orofaringe',
    targetZone: 'mouth',
  },
  {
    id: 'pescoco_linfonodos',
    label: 'Pescoço / Linfonodos',
    targetZone: 'neck',
  },
  {
    id: 'torax_respiratorio',
    label: 'Tórax',
    targetZone: 'thorax',
  },
  {
    id: 'precordio',
    label: 'Precórdio',
    targetZone: 'precordium',
  },
  {
    id: 'abdome',
    label: 'Abdome',
    targetZone: 'abdomen',
  },
  {
    id: 'figado',
    label: 'Fígado / Hipocôndrio D',
    targetZone: 'right-hypochondrium',
  },
  {
    id: 'baco',
    label: 'Baço / Hipocôndrio E',
    targetZone: 'left-hypochondrium',
  },
  {
    id: 'membros_perfusao',
    label: 'Membros / Perfusão / Pulsos / TEC',
    targetZone: 'limbs',
  },
  {
    id: 'pele_mucosas',
    label: 'Pele / Mucosas',
    targetZone: 'skin',
  },
  {
    id: 'desenvolvimento_interacao',
    label: 'Desenvolvimento / Interação',
    targetZone: 'development',
  },
  {
    id: 'estado_geral',
    label: 'Estado Geral',
    targetZone: 'general-state',
  },
];

// Zonas de drop invisíveis para validação (percentuais em relação à imagem)
export const DROP_ZONES: Record<string, {
  label: string;
  left: number;
  top: number;
  width: number;
  height: number;
}> = {
  head: {
    label: 'Cabeça',
    left: 35,
    top: 5,
    width: 30,
    height: 18,
  },
  face: {
    label: 'Face',
    left: 38,
    top: 8,
    width: 24,
    height: 12,
  },
  mouth: {
    label: 'Boca/Orofaringe',
    left: 40,
    top: 18,
    width: 20,
    height: 8,
  },
  neck: {
    label: 'Pescoço',
    left: 38,
    top: 23,
    width: 24,
    height: 8,
  },
  thorax: {
    label: 'Tórax',
    left: 30,
    top: 33,
    width: 40,
    height: 18,
  },
  precordium: {
    label: 'Precórdio',
    left: 42,
    top: 38,
    width: 16,
    height: 12,
  },
  abdomen: {
    label: 'Abdome',
    left: 30,
    top: 45,
    width: 40,
    height: 18,
  },
  'right-hypochondrium': {
    label: 'Hipocôndrio Direito',
    left: 30,
    top: 48,
    width: 12,
    height: 15,
  },
  'left-hypochondrium': {
    label: 'Hipocôndrio Esquerdo',
    left: 58,
    top: 43,
    width: 12,
    height: 15,
  },
  limbs: {
    label: 'Membros',
    left: 20,
    top: 73,
    width: 60,
    height: 22,
  },
  skin: {
    label: 'Pele/Mucosas',
    left: 20,
    top: 20,
    width: 60,
    height: 55,
  },
  development: {
    label: 'Desenvolvimento',
    left: 20,
    top: 5,
    width: 60,
    height: 90,
  },
  'general-state': {
    label: 'Estado Geral',
    left: 20,
    top: 5,
    width: 60,
    height: 90,
  },
};

export interface PlacedRegion {
  id: string;
  label: string;
  targetZone: string;
  x: number;
  y: number;
}
