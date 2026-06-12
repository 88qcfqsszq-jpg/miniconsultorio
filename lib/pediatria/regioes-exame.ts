// Definição de regiões anatômicas e ações para exame físico pediátrico visual

export type RegiaoPediatricaId =
  | "estado_geral"
  | "pele_mucosas"
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
  | "desenvolvimento";

export type AcaoPediatricaId =
  | "estado_geral"
  | "nivel_atividade"
  | "irritabilidade"
  | "interacao_responsavel"
  | "palidez"
  | "cianose"
  | "hidratacao_mucosas"
  | "exantema"
  | "petequias"
  | "equimoses"
  | "perimetro_cefalico"
  | "fontanela"
  | "formato_craniano"
  | "cianose_central"
  | "palidez_conjuntival"
  | "sinais_desidratacao"
  | "mucosa_oral"
  | "hiperemia_orofaringe"
  | "lesoes_orais"
  | "linfonodos_cervicais"
  | "descricao_linfonodos"
  | "rigidez_nuca"
  | "frequencia_respiratoria"
  | "tiragens"
  | "batimento_asa_nasal"
  | "expansibilidade"
  | "ausculta_pulmonar"
  | "ausculta_focos"
  | "sopro"
  | "ritmo_cardiaco"
  | "cianose_cardiaca"
  | "inspecao_abdome"
  | "palpacao_abdome"
  | "dor_abdominal"
  | "distensao"
  | "palpacao_figado"
  | "hepatomegalia"
  | "sensibilidade_hipocondrio_d"
  | "palpacao_baco"
  | "esplenomegalia"
  | "pulsos_perifericos"
  | "tempo_enchimento_capilar"
  | "extremidades_frias"
  | "edema"
  | "petequias_equimoses_membros"
  | "marcos_desenvolvimento"
  | "postura"
  | "resposta_social"
  | "fala_interacao";

export interface CoordenadaHotspot {
  x: number; // percentual 0-100
  y: number; // percentual 0-100
  width: number; // percentual 0-100
  height: number; // percentual 0-100
}

export interface AcaoPediatrica {
  id: AcaoPediatricaId;
  label: string;
  descricao: string;
}

export interface RegiaoPediatrica {
  id: RegiaoPediatricaId;
  label: string;
  descricao: string;
  coordenadas: CoordenadaHotspot;
  acoes: AcaoPediatricaId[];
  corHover?: string; // Tailwind color class
}

// Definição de ações disponíveis
export const ACOES_PEDIATRICAS: Record<AcaoPediatricaId, AcaoPediatrica> = {
  estado_geral: { id: "estado_geral", label: "Avaliar estado geral", descricao: "Observar nível de consciência e bem-estar" },
  nivel_atividade: { id: "nivel_atividade", label: "Avaliar nível de atividade", descricao: "Observar reatividade e responsividade" },
  irritabilidade: { id: "irritabilidade", label: "Avaliar irritabilidade", descricao: "Verificar se há choro exagerado ou prostração" },
  interacao_responsavel: { id: "interacao_responsavel", label: "Interação com responsável", descricao: "Observar contato visual e aproximação" },
  palidez: { id: "palidez", label: "Avaliar palidez", descricao: "Verificar coloração de pele e mucosas" },
  cianose: { id: "cianose", label: "Avaliar cianose", descricao: "Verificar coloração azulada" },
  hidratacao_mucosas: { id: "hidratacao_mucosas", label: "Hidratação de mucosas", descricao: "Avaliar umidade da boca" },
  exantema: { id: "exantema", label: "Avaliar exantema", descricao: "Verificar presença de rash/erupção" },
  petequias: { id: "petequias", label: "Avaliar petéquias", descricao: "Verificar pequenas manchas avermelhadas" },
  equimoses: { id: "equimoses", label: "Avaliar equimoses", descricao: "Verificar roxos/hematomas" },
  perimetro_cefalico: { id: "perimetro_cefalico", label: "Medir perímetro cefálico", descricao: "Técnica com fita métrica" },
  fontanela: { id: "fontanela", label: "Avaliar fontanela", descricao: "Avaliar se lactente" },
  formato_craniano: { id: "formato_craniano", label: "Formato craniano", descricao: "Verificar simetria e deformidades" },
  cianose_central: { id: "cianose_central", label: "Cianose central", descricao: "Verificar lábios e língua" },
  palidez_conjuntival: { id: "palidez_conjuntival", label: "Palidez conjuntival", descricao: "Avaliar coloração das conjuntivas" },
  sinais_desidratacao: { id: "sinais_desidratacao", label: "Sinais de desidratação", descricao: "Verificar olhos fundos, fontanela" },
  mucosa_oral: { id: "mucosa_oral", label: "Mucosa oral", descricao: "Inspecionar boca" },
  hiperemia_orofaringe: { id: "hiperemia_orofaringe", label: "Hiperemia de orofaringe", descricao: "Verificar se há avermelhamento" },
  lesoes_orais: { id: "lesoes_orais", label: "Lesões orais", descricao: "Verificar aftas ou feridas" },
  linfonodos_cervicais: { id: "linfonodos_cervicais", label: "Linfonodos cervicais", descricao: "Palpar pescoço" },
  descricao_linfonodos: { id: "descricao_linfonodos", label: "Descrever linfonodos", descricao: "Tamanho, consistência, mobilidade" },
  rigidez_nuca: { id: "rigidez_nuca", label: "Rigidez de nuca", descricao: "Se indicado, avaliar" },
  frequencia_respiratoria: { id: "frequencia_respiratoria", label: "Frequência respiratória", descricao: "Contar por 1 minuto" },
  tiragens: { id: "tiragens", label: "Tiragens", descricao: "Verificar intercostais, subcostais, supraeesternais" },
  batimento_asa_nasal: { id: "batimento_asa_nasal", label: "Batimento de asa nasal", descricao: "Sinal de desconforto respiratório" },
  expansibilidade: { id: "expansibilidade", label: "Expansibilidade torácica", descricao: "Simetria de movimento" },
  ausculta_pulmonar: { id: "ausculta_pulmonar", label: "Ausculta pulmonar", descricao: "Verificar sons respiratórios" },
  ausculta_focos: { id: "ausculta_focos", label: "Ausculta de focos cardíacos", descricao: "Avaliar bulhas" },
  sopro: { id: "sopro", label: "Sopro cardíaco", descricao: "Verificar presença de sopro" },
  ritmo_cardiaco: { id: "ritmo_cardiaco", label: "Ritmo cardíaco", descricao: "Regular ou irregular" },
  cianose_cardiaca: { id: "cianose_cardiaca", label: "Cianose associada", descricao: "Avaliar cianose ao examinar coração" },
  inspecao_abdome: { id: "inspecao_abdome", label: "Inspeção abdominal", descricao: "Observar forma e simetria" },
  palpacao_abdome: { id: "palpacao_abdome", label: "Palpação abdominal", descricao: "Avaliar dor e consistência" },
  dor_abdominal: { id: "dor_abdominal", label: "Dor abdominal", descricao: "Verificar se há dor à palpação" },
  distensao: { id: "distensao", label: "Distensão abdominal", descricao: "Verificar abdominal inchado" },
  palpacao_figado: { id: "palpacao_figado", label: "Palpação hepática", descricao: "Palpar fígado" },
  hepatomegalia: { id: "hepatomegalia", label: "Hepatomegalia", descricao: "Fígado aumentado" },
  sensibilidade_hipocondrio_d: { id: "sensibilidade_hipocondrio_d", label: "Sensibilidade hipocondrial D", descricao: "Dor ao palpar fígado" },
  palpacao_baco: { id: "palpacao_baco", label: "Palpação esplênica", descricao: "Palpar baço" },
  esplenomegalia: { id: "esplenomegalia", label: "Esplenomegalia", descricao: "Baço aumentado" },
  pulsos_perifericos: { id: "pulsos_perifericos", label: "Pulsos periféricos", descricao: "Radial, femoral, etc" },
  tempo_enchimento_capilar: { id: "tempo_enchimento_capilar", label: "TEC (tempo enchimento capilar)", descricao: "Pressionar e soltar dedo" },
  extremidades_frias: { id: "extremidades_frias", label: "Extremidades frias", descricao: "Avaliar temperatura" },
  edema: { id: "edema", label: "Edema em membros", descricao: "Verificar inchaço" },
  petequias_equimoses_membros: { id: "petequias_equimoses_membros", label: "Petéquias/equimoses", descricao: "Verificar manchas e roxos" },
  marcos_desenvolvimento: { id: "marcos_desenvolvimento", label: "Marcos do desenvolvimento", descricao: "Conforme faixa etária" },
  postura: { id: "postura", label: "Postura", descricao: "Observar como a criança se posiciona" },
  resposta_social: { id: "resposta_social", label: "Resposta social", descricao: "Sorrir, contato visual, etc" },
  fala_interacao: { id: "fala_interacao", label: "Fala e interação", descricao: "Linguagem conforme idade" },
};

// Definição de regiões com coordenadas percentuais
export const REGIOES_PEDIATRICAS: RegiaoPediatrica[] = [
  {
    id: "estado_geral",
    label: "Estado Geral",
    descricao: "Observação geral da criança",
    coordenadas: { x: 20, y: 5, width: 60, height: 88 },
    acoes: ["estado_geral", "nivel_atividade", "irritabilidade", "interacao_responsavel"],
    corHover: "border-blue-400",
  },
  {
    id: "pele_mucosas",
    label: "Pele e Mucosas",
    descricao: "Avaliação cutânea geral",
    coordenadas: { x: 25, y: 10, width: 50, height: 75 },
    acoes: ["palidez", "cianose", "hidratacao_mucosas", "exantema", "petequias", "equimoses"],
    corHover: "border-orange-400",
  },
  {
    id: "cabeca_perimetro",
    label: "Cabeça / Perímetro Cefálico",
    descricao: "Avaliação craniana",
    coordenadas: { x: 39, y: 5, width: 22, height: 14 },
    acoes: ["perimetro_cefalico", "fontanela", "formato_craniano"],
    corHover: "border-green-400",
  },
  {
    id: "face_olhos",
    label: "Face / Olhos",
    descricao: "Avaliação facial",
    coordenadas: { x: 40, y: 8, width: 20, height: 10 },
    acoes: ["cianose_central", "palidez_conjuntival", "sinais_desidratacao"],
    corHover: "border-purple-400",
  },
  {
    id: "orofaringe",
    label: "Orofaringe",
    descricao: "Avaliação da boca e garganta",
    coordenadas: { x: 43, y: 14, width: 14, height: 6 },
    acoes: ["mucosa_oral", "hiperemia_orofaringe", "lesoes_orais"],
    corHover: "border-pink-400",
  },
  {
    id: "pescoco_linfonodos",
    label: "Pescoço / Linfonodos",
    descricao: "Avaliação cervical",
    coordenadas: { x: 38, y: 18, width: 24, height: 8 },
    acoes: ["linfonodos_cervicais", "descricao_linfonodos", "rigidez_nuca"],
    corHover: "border-indigo-400",
  },
  {
    id: "torax_respiratorio",
    label: "Tórax Respiratório",
    descricao: "Avaliação respiratória",
    coordenadas: { x: 32, y: 25, width: 36, height: 20 },
    acoes: ["frequencia_respiratoria", "tiragens", "batimento_asa_nasal", "expansibilidade", "ausculta_pulmonar"],
    corHover: "border-cyan-400",
  },
  {
    id: "precordio",
    label: "Precórdio",
    descricao: "Avaliação cardiovascular",
    coordenadas: { x: 42, y: 28, width: 18, height: 16 },
    acoes: ["ausculta_focos", "sopro", "ritmo_cardiaco", "cianose_cardiaca"],
    corHover: "border-red-400",
  },
  {
    id: "abdome",
    label: "Abdome",
    descricao: "Avaliação abdominal geral",
    coordenadas: { x: 34, y: 45, width: 32, height: 20 },
    acoes: ["inspecao_abdome", "palpacao_abdome", "dor_abdominal", "distensao"],
    corHover: "border-yellow-400",
  },
  {
    id: "figado",
    label: "Fígado / Hipocôndrio D",
    descricao: "Avaliação hepática",
    coordenadas: { x: 34, y: 46, width: 16, height: 12 },
    acoes: ["palpacao_figado", "hepatomegalia", "sensibilidade_hipocondrio_d"],
    corHover: "border-amber-400",
  },
  {
    id: "baco",
    label: "Baço / Hipocôndrio E",
    descricao: "Avaliação esplênica",
    coordenadas: { x: 50, y: 46, width: 16, height: 12 },
    acoes: ["palpacao_baco", "esplenomegalia"],
    corHover: "border-teal-400",
  },
  {
    id: "membros_perfusao",
    label: "Membros / Perfusão",
    descricao: "Avaliação de extremidades",
    coordenadas: { x: 20, y: 58, width: 60, height: 35 },
    acoes: ["pulsos_perifericos", "tempo_enchimento_capilar", "extremidades_frias", "edema", "petequias_equimoses_membros"],
    corHover: "border-lime-400",
  },
  {
    id: "desenvolvimento",
    label: "Desenvolvimento / Interação",
    descricao: "Avaliação neurodesenvolvimento",
    coordenadas: { x: 20, y: 5, width: 60, height: 88 },
    acoes: ["marcos_desenvolvimento", "postura", "resposta_social", "fala_interacao"],
    corHover: "border-violet-400",
  },
];

// Função auxiliar para obter região por ID
export function obterRegiaoPediatrica(id: RegiaoPediatricaId): RegiaoPediatrica | undefined {
  return REGIOES_PEDIATRICAS.find((r) => r.id === id);
}

// Função auxiliar para obter ação por ID
export function obterAcaoPediatrica(id: AcaoPediatricaId): AcaoPediatrica | undefined {
  return ACOES_PEDIATRICAS[id];
}

// Função para obter ações de uma região
export function obterAcoesDaRegiao(regioId: RegiaoPediatricaId): AcaoPediatrica[] {
  const regiao = obterRegiaoPediatrica(regioId);
  if (!regiao) return [];
  return regiao.acoes
    .map((acaoId) => ACOES_PEDIATRICAS[acaoId])
    .filter((acao) => acao !== undefined);
}
