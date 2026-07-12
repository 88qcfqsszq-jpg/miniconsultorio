// ============================================================================
// MEDIX Learn — tipos centrais
// ============================================================================

export interface LearnMiniCase {
  id: string;
  titulo: string;
  cenario: string;
  dadosChave: { label: string; valor: string }[];
  mecanismo: string;
  perguntaCentral: string;
  respostaEsperada: string;
  erroComum: string;
  ponteOSCE: string;
  accentColor: string;
  accentBg: string;
}

export interface LearnQuestion {
  id: string;
  pergunta: string;
  resposta: string;
}

export interface LearnBridge {
  modulo: "ciclo-basico" | "clinico";
  titulo: string;
  subtitulo: string;
  casosRecomendados: string[];
  competencias: string[];
  href: string;
  cor: string;
  corBg: string;
}

export interface LearnSection {
  id: string;
  titulo: string;
  paragrafos: string[];
  items?: string[];
  destaque?: string;
}

export interface LearnTrailData {
  id: string;
  titulo: string;
  subtitulo: string;
  publicoAlvo: string;
  badges: string[];
  objetivos: string[];
  competencias: string[];
  secoes: LearnSection[];
  miniCasos: LearnMiniCase[];
  questoesAtivas: LearnQuestion[];
  mapaLinhas: string[];
  pontes: LearnBridge[];
}

export interface LearnTrailItem {
  id: string;
  titulo: string;
  descricao: string;
  disponivel: boolean;
  href: string;
}

export interface LearnSystem {
  id: string;
  titulo: string;
  descricao: string;
  disponivel: boolean;
  href: string;
  trilhas: LearnTrailItem[];
}
