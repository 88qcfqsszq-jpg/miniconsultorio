// Gabarito (Answer Key) - Posições corretas de todas as regiões do exame físico do lactente
// Coordenadas em percentual (0-100) relativas ao container da imagem
// IDs devem corresponder a regioes-exame-ajustadas.ts

export interface AnswerKeyRegion {
  id: string;
  label: string;
  x: number; // percentual horizontal
  y: number; // percentual vertical
}

export const LACTENTE_ANSWER_KEY: AnswerKeyRegion[] = [
  {
    id: 'cabeca_perimetro',
    label: 'Cabeça / Perímetro Cefálico',
    x: 46,
    y: 10,
  },
  {
    id: 'face_olhos',
    label: 'Olhos / Face',
    x: 56,
    y: 19,
  },
  {
    id: 'orofaringe',
    label: 'Orofaringe',
    x: 45,
    y: 25,
  },
  {
    id: 'pescoco_linfonodos',
    label: 'Pescoço / Linfonodos',
    x: 51,
    y: 32,
  },
  {
    id: 'torax_respiratorio',
    label: 'Tórax Respiratório',
    x: 35,
    y: 37,
  },
  {
    id: 'precordio',
    label: 'Precórdio',
    x: 54,
    y: 44,
  },
  {
    id: 'abdome',
    label: 'Abdome',
    x: 36,
    y: 53,
  },
  {
    id: 'figado',
    label: 'Fígado / Hipocôndrio D',
    x: 48,
    y: 45,
  },
  {
    id: 'baco',
    label: 'Baço / Hipocôndrio E',
    x: 58,
    y: 57,
  },
  {
    id: 'membros_perfusao',
    label: 'Membros / Perfusão / Pulsos / TEC',
    x: 28,
    y: 77,
  },
  {
    id: 'pele_mucosas',
    label: 'Pele / Mucosas',
    x: 25,
    y: 13,
  },
  {
    id: 'desenvolvimento',
    label: 'Desenvolvimento / Interação',
    x: 20,
    y: 8,
  },
  {
    id: 'estado_geral',
    label: 'Estado Geral',
    x: 20,
    y: 8,
  },
];
