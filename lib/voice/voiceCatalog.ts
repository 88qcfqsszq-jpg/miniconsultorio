/**
 * Catálogo LÓGICO de vozes do Medix (Etapa 2 — camada de perfil de voz).
 *
 * Estes são identificadores internos e independentes de qualquer provedor. NÃO
 * representam nomes reais de vozes da OpenAI, não contêm URLs, chaves nem qualquer
 * integração. O mapeamento voiceId lógico → voz real de um provedor será uma
 * camada FUTURA e separada (após teste auditivo das vozes disponíveis).
 *
 * Cada entrada carrega apenas METADADOS: papel típico do falante, faixa etária do
 * timbre e apresentação de gênero.
 */

export type VoiceSpeakerRole = "patient" | "caregiver" | "companion";
export type VoiceGenderPresentation = "female" | "male" | "neutral";
export type VoiceAgeGroup = "child" | "adolescent" | "adult" | "elderly";

export interface VoiceCatalogEntry {
  /** ID lógico do Medix (não é a voz do provedor). */
  id: string;
  /** Papel típico do falante representado por este timbre. */
  speakerRole: VoiceSpeakerRole;
  /** Faixa etária do TIMBRE (do falante), não necessariamente do paciente. */
  ageGroup: VoiceAgeGroup;
  genderPresentation: VoiceGenderPresentation;
  descricao: string;
}

const GENEROS: VoiceGenderPresentation[] = ["female", "male", "neutral"];

// Timbres de PACIENTE por faixa etária (criança inclusa para casos de override em
// que a própria criança fala; na derivação padrão, crianças usam o acompanhante).
const GRUPOS_PACIENTE: Array<{ grupo: VoiceAgeGroup; rotulo: string }> = [
  { grupo: "child", rotulo: "Criança" },
  { grupo: "adolescent", rotulo: "Adolescente" },
  { grupo: "adult", rotulo: "Adulto" },
  { grupo: "elderly", rotulo: "Idoso(a)" },
];

const rotuloGenero: Record<VoiceGenderPresentation, string> = {
  female: "feminino",
  male: "masculino",
  neutral: "neutro",
};

/**
 * Catálogo completo e SIMÉTRICO: garante que toda combinação
 * (papel × faixa × gênero) usada pela derivação tenha um voiceId válido.
 */
export const VOICE_CATALOG: VoiceCatalogEntry[] = [
  // Vozes de paciente (child/adolescent/adult/elderly × female/male/neutral)
  ...GRUPOS_PACIENTE.flatMap(({ grupo, rotulo }) =>
    GENEROS.map((g): VoiceCatalogEntry => ({
      id: `${grupo}-${g}`,
      speakerRole: "patient",
      ageGroup: grupo,
      genderPresentation: g,
      descricao: `${rotulo} — voz ${rotuloGenero[g]} (paciente)`,
    }))
  ),
  // Vozes de acompanhante/responsável (timbre adulto)
  ...GENEROS.map((g): VoiceCatalogEntry => ({
    id: `caregiver-${g}`,
    speakerRole: "caregiver",
    ageGroup: "adult",
    genderPresentation: g,
    descricao: `Acompanhante/responsável — voz ${rotuloGenero[g]} (adulto)`,
  })),
];

const CATALOGO_POR_ID: Record<string, VoiceCatalogEntry> = Object.fromEntries(
  VOICE_CATALOG.map((e) => [e.id, e])
);

/** IDs lógicos disponíveis. */
export const voiceCatalogIds: string[] = VOICE_CATALOG.map((e) => e.id);

/** Retorna a entrada do catálogo ou undefined. */
export function getVoiceCatalogEntry(id: string): VoiceCatalogEntry | undefined {
  return CATALOGO_POR_ID[id];
}

/** Indica se um voiceId lógico existe no catálogo. */
export function isVoiceIdValido(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(CATALOGO_POR_ID, id);
}

/**
 * Resolve o voiceId lógico a partir do papel do falante, da faixa etária do
 * paciente e do gênero do falante. Total: sempre retorna um ID existente
 * (fallback final "adult-neutral"), nunca vazio.
 */
export function resolverVoiceId(
  speakerRole: VoiceSpeakerRole,
  ageGroup: VoiceAgeGroup,
  genderPresentation: VoiceGenderPresentation
): string {
  // Acompanhante/companion falam com timbre adulto de acompanhante.
  if (speakerRole === "caregiver" || speakerRole === "companion") {
    const id = `caregiver-${genderPresentation}`;
    return isVoiceIdValido(id) ? id : "caregiver-neutral";
  }
  // Paciente fala: timbre pela faixa etária do paciente.
  const id = `${ageGroup}-${genderPresentation}`;
  if (isVoiceIdValido(id)) return id;
  return "adult-neutral";
}
