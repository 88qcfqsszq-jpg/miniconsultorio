// ============================================================================
// Mapeamento clínico: diagnóstico → padrão de ausculta CARDÍACA.
// Cada caso cardíaco define UM tipo + foco, usando apenas sons existentes no
// catálogo. Pericardite = sem áudio (atrito pericárdico não existe na base).
// Determinístico; não altera HealthBench/feedback.
// ============================================================================

import type { HeartFocus, HeartSoundType } from "./cardiaco-sounds";

export interface CardiacAuscultationPattern {
  key: string;
  label: string;
  descricao: string;
  tipo: HeartSoundType;
  foco: HeartFocus;
  achadoEsperado: string;
  interpretacoesAceitas: string[];
  semAudio?: boolean;
  avisoSemAudio?: string;
}

function normalizar(s: string): string {
  return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

export function obterPadraoAuscultaCardiacaPorCaso(input: {
  diagnostico?: string;
  casoTitulo?: string;
  casoId?: string;
}): CardiacAuscultationPattern {
  const t = normalizar(`${input.diagnostico ?? ""} ${input.casoTitulo ?? ""}`);

  // Estenose aórtica — sopro mesossistólico (ejeção) em foco aórtico
  if (/estenose aortica|estenose valvar aortica/.test(t)) {
    return {
      key: "estenose_aortica", label: "Estenose aórtica",
      descricao: "Sopro sistólico de ejeção em foco aórtico",
      tipo: "mid_systolic_murmur", foco: "RUSB",
      achadoEsperado: "Sopro mesossistólico de ejeção em foco aórtico, com irradiação para carótidas.",
      interpretacoesAceitas: ["mid_systolic_murmur", "early_systolic_murmur", "late_systolic_murmur"],
    };
  }
  // Insuficiência mitral — sopro sistólico em foco mitral (ápice)
  if (/insuficiencia mitral|regurgitacao mitral|insuf.* mitral/.test(t)) {
    return {
      key: "insuficiencia_mitral", label: "Insuficiência mitral",
      descricao: "Sopro sistólico em foco mitral, irradiando para axila",
      tipo: "mid_systolic_murmur", foco: "Apex",
      achadoEsperado: "Sopro sistólico em foco mitral (ápice), com irradiação para a axila.",
      interpretacoesAceitas: ["mid_systolic_murmur", "early_systolic_murmur", "late_systolic_murmur"],
    };
  }
  // Estenose mitral (inclui + FA) — sopro diastólico (ruflar) em foco mitral
  if (/estenose mitral/.test(t)) {
    return {
      key: "estenose_mitral", label: "Estenose mitral",
      descricao: "Sopro diastólico (ruflar) em foco mitral",
      tipo: "late_diastolic_murmur", foco: "Apex",
      achadoEsperado: "Ruflar diastólico em foco mitral (ápice).",
      interpretacoesAceitas: ["late_diastolic_murmur"],
    };
  }
  // Endocardite — sopro (regurgitante) novo/variável
  if (/endocardite/.test(t)) {
    return {
      key: "endocardite", label: "Endocardite infecciosa",
      descricao: "Sopro regurgitante (novo ou em mudança)",
      tipo: "mid_systolic_murmur", foco: "Apex",
      achadoEsperado: "Sopro cardíaco (regurgitante), novo ou em mudança, no contexto febril.",
      interpretacoesAceitas: ["mid_systolic_murmur", "late_diastolic_murmur"],
    };
  }
  // Fibrilação atrial — ritmo irregularmente irregular
  if (/fibrilacao atrial|\bfa\b/.test(t)) {
    return {
      key: "fibrilacao_atrial", label: "Fibrilação atrial",
      descricao: "Ritmo irregularmente irregular",
      tipo: "atrial_fibrillation", foco: "Apex",
      achadoEsperado: "Ritmo cardíaco irregularmente irregular, sem onda 'a', compatível com FA.",
      interpretacoesAceitas: ["atrial_fibrillation"],
    };
  }
  // Insuficiência cardíaca — B3 (galope)
  if (/insuficiencia cardiaca|\bicc\b|\bic\b|edema pulmonar|congestao/.test(t)) {
    return {
      key: "insuficiencia_cardiaca", label: "Insuficiência cardíaca",
      descricao: "B3 (galope) em foco mitral",
      tipo: "s3", foco: "Apex",
      achadoEsperado: "Terceira bulha (B3), galope, em foco mitral — sobrecarga de volume.",
      interpretacoesAceitas: ["s3"],
    };
  }
  // Pericardite — atrito pericárdico NÃO existe na base → silêncio didático
  if (/pericardite/.test(t)) {
    return {
      key: "pericardite", label: "Pericardite",
      descricao: "Atrito pericárdico",
      tipo: "pericardial_rub", foco: "LLSB",
      achadoEsperado: "Atrito pericárdico (áspero, trifásico), em borda esternal esquerda.",
      interpretacoesAceitas: ["pericardial_rub"],
      semAudio: true,
      avisoSemAudio: "Atrito pericárdico não disponível nesta biblioteca.",
    };
  }

  // Normal (default)
  return {
    key: "normal", label: "Ausculta cardíaca normal",
    descricao: "Bulhas normais (B1/B2), sem sopros",
    tipo: "normal", foco: "Apex",
    achadoEsperado: "Bulhas rítmicas, normofonéticas, sem sopros.",
    interpretacoesAceitas: ["normal"],
  };
}
