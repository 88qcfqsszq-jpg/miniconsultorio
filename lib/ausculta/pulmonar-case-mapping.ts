// ============================================================================
// Mapeamento clínico: diagnóstico → padrão de ausculta pulmonar por ponto
// ----------------------------------------------------------------------------
// Define qual tipo de som cada um dos 6 pontos toca, conforme o caso, cobrindo
// todos os tipos do CSV (incluindo normal). Determinístico, sem alterar
// HealthBench/rubricas. Fallback = normal em todos os pontos.
// ============================================================================

import type {
  LungAuscultationLocation,
  LungSoundType,
} from "./pulmonar-sounds";

export interface PulmonaryAuscultationPattern {
  key: string;
  label: string;
  descricao: string;
  sonsPorPonto: Record<LungAuscultationLocation, LungSoundType>;
  achadoEsperado: string;
  interpretacoesAceitas: string[];
  // Aviso exibido quando o áudio é apenas uma aproximação (proxy).
  avisoProxy?: string;
}

const TODOS_PONTOS: LungAuscultationLocation[] = ["RUA", "LUA", "RMA", "LMA", "RLA", "LLA"];

function preencher(
  base: LungSoundType,
  overrides: Partial<Record<LungAuscultationLocation, LungSoundType>> = {}
): Record<LungAuscultationLocation, LungSoundType> {
  const mapa = {} as Record<LungAuscultationLocation, LungSoundType>;
  for (const p of TODOS_PONTOS) mapa[p] = overrides[p] ?? base;
  return mapa;
}

function normalizar(s: string): string {
  return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

export function obterPadraoAuscultaPulmonarPorCaso(input: {
  diagnostico?: string;
  casoTitulo?: string;
  casoId?: string;
}): PulmonaryAuscultationPattern {
  const t = normalizar(`${input.diagnostico ?? ""} ${input.casoTitulo ?? ""}`);
  const esquerda = /esquerd|lobo inferior esquerdo|hemitorax esquerdo/.test(t);

  // Asma / broncoespasmo
  if (/asma|asmatic|broncoespasmo|sibilancia/.test(t)) {
    return {
      key: "asma",
      label: "Asma / broncoespasmo",
      descricao: "Sibilos expiratórios difusos",
      sonsPorPonto: preencher("wheezing"),
      achadoEsperado: "Sibilos expiratórios difusos bilateralmente, compatíveis com broncoespasmo.",
      interpretacoesAceitas: ["wheezing"],
    };
  }
  // DPOC exacerbado
  if (/dpoc|doenca pulmonar obstrutiva|enfisema|bronquite cronica/.test(t)) {
    return {
      key: "dpoc",
      label: "DPOC exacerbado",
      descricao: "Sibilos e roncos difusos",
      sonsPorPonto: preencher("wheezing", { RMA: "rhonchi", LMA: "rhonchi" }),
      achadoEsperado: "Sibilos e roncos difusos, compatíveis com obstrução crônica exacerbada.",
      interpretacoesAceitas: ["wheezing", "rhonchi"],
    };
  }
  // Insuficiência cardíaca / edema pulmonar (antes de pneumonia)
  if (/insuficiencia cardiaca|edema pulmonar|congestao pulmonar|\bicc\b|\bic\b|feve/.test(t)) {
    return {
      key: "edema_pulmonar",
      label: "Insuficiência cardíaca / edema pulmonar",
      descricao: "Crepitações finas bibasais",
      sonsPorPonto: preencher("normal", {
        RMA: "fine_crackles", LMA: "fine_crackles", RLA: "fine_crackles", LLA: "fine_crackles",
      }),
      achadoEsperado: "Crepitações finas bibasais, compatíveis com congestão pulmonar.",
      interpretacoesAceitas: ["fine_crackles"],
    };
  }
  // Pneumonia (base direita por padrão; esquerda se indicado)
  if (/pneumonia|\bpac\b|consolidacao/.test(t)) {
    return esquerda
      ? {
          key: "pneumonia_esquerda",
          label: "Pneumonia (base esquerda)",
          descricao: "Crepitações grossas em base esquerda",
          sonsPorPonto: preencher("normal", { LLA: "coarse_crackles" }),
          achadoEsperado:
            "Crepitações grossas em base esquerda, compatíveis com processo infeccioso/consolidação focal.",
          interpretacoesAceitas: ["coarse_crackles", "fine_crackles"],
        }
      : {
          key: "pneumonia_direita",
          label: "Pneumonia (base direita)",
          descricao: "Crepitações grossas em base direita",
          sonsPorPonto: preencher("normal", { RLA: "coarse_crackles" }),
          achadoEsperado:
            "Crepitações grossas em base direita, compatíveis com processo infeccioso/consolidação focal.",
          interpretacoesAceitas: ["coarse_crackles", "fine_crackles"],
        };
  }
  // Bronquite / secreção
  if (/bronquite|secrecao|secrecoes|hipersecre|tosse produtiva/.test(t)) {
    return {
      key: "bronquite",
      label: "Bronquite / secreção",
      descricao: "Roncos em campos médios/inferiores",
      sonsPorPonto: preencher("normal", {
        RMA: "rhonchi", LMA: "rhonchi", RLA: "rhonchi", LLA: "rhonchi",
      }),
      achadoEsperado: "Roncos predominantes em campos médios e inferiores, sugerindo secreção em vias aéreas.",
      interpretacoesAceitas: ["rhonchi"],
    };
  }
  // Pleurite / atrito pleural
  if (/pleurite|pleuris|atrito pleural|dor pleuritic/.test(t)) {
    const ponto: LungAuscultationLocation = esquerda ? "LLA" : "RLA";
    return {
      key: "pleurite",
      label: "Pleurite / atrito pleural",
      descricao: "Atrito pleural focal",
      sonsPorPonto: preencher("normal", { [ponto]: "pleural_rub" } as any),
      achadoEsperado: `Atrito pleural focal em ${esquerda ? "base esquerda" : "base direita"}.`,
      interpretacoesAceitas: ["pleural_rub"],
    };
  }
  // Atelectasia — proxy: crepitações finas (não há áudio de MV reduzido na base)
  if (/atelectasia|atelectas/.test(t)) {
    return {
      key: "atelectasia",
      label: "Atelectasia pós-operatória",
      descricao: "Redução focal em base (áudio aproximado por crepitações finas)",
      sonsPorPonto: preencher("normal", { RLA: "fine_crackles" }),
      achadoEsperado:
        "Redução ventilatória focal em base direita, compatível com atelectasia basal.",
      interpretacoesAceitas: ["fine_crackles", "mv_reduzido"],
      avisoProxy:
        "Áudio utilizado como aproximação (crepitações finas). A biblioteca HLS-CMDS não possui som específico de murmúrio vesicular reduzido.",
    };
  }
  // Pneumotórax — MV ABOLIDO no hemitórax acometido → silêncio didático (sem áudio)
  if (/pneumotorax/.test(t)) {
    const lado: LungAuscultationLocation[] = esquerda
      ? ["LUA", "LMA", "LLA"]
      : ["RUA", "RMA", "RLA"];
    const overrides: Partial<Record<LungAuscultationLocation, LungSoundType>> = {};
    for (const p of lado) overrides[p] = "mv_abolido";
    return {
      key: "pneumotorax",
      label: "Pneumotórax",
      descricao: "Murmúrio vesicular abolido no hemitórax acometido",
      sonsPorPonto: preencher("normal", overrides),
      achadoEsperado: `Murmúrio vesicular abolido no hemitórax ${esquerda ? "esquerdo" : "direito"}.`,
      interpretacoesAceitas: ["mv_abolido"],
    };
  }
  // Derrame pleural — MV REDUZIDO em base → silêncio didático (sem áudio)
  if (/derrame pleural|efusao pleural|liquido pleural/.test(t)) {
    const base: LungAuscultationLocation = esquerda ? "LLA" : "RLA";
    return {
      key: "derrame_pleural",
      label: "Derrame pleural",
      descricao: "Murmúrio vesicular reduzido em base",
      sonsPorPonto: preencher("normal", { [base]: "mv_reduzido" } as Partial<
        Record<LungAuscultationLocation, LungSoundType>
      >),
      achadoEsperado: `Murmúrio vesicular reduzido em base ${esquerda ? "esquerda" : "direita"}, compatível com derrame pleural.`,
      interpretacoesAceitas: ["mv_reduzido"],
    };
  }
  // Tuberculose — crepitações focais em campo superior direito
  if (/tuberculose|\btb\b/.test(t)) {
    return {
      key: "tuberculose",
      label: "Tuberculose pulmonar",
      descricao: "Crepitações focais em campo superior",
      sonsPorPonto: preencher("normal", { RUA: "coarse_crackles" }),
      achadoEsperado: "Crepitações focais em campo superior, compatíveis com acometimento pulmonar focal.",
      interpretacoesAceitas: ["coarse_crackles", "fine_crackles"],
    };
  }

  // Normal (default)
  return {
    key: "normal",
    label: "Ausculta normal",
    descricao: "Murmúrio vesicular normal",
    sonsPorPonto: preencher("normal"),
    achadoEsperado: "Murmúrio vesicular presente bilateralmente, sem ruídos adventícios.",
    interpretacoesAceitas: ["normal"],
  };
}
