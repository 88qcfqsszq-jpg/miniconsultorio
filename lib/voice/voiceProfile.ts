/**
 * Perfil LÓGICO de voz do Paciente Virtual (Etapa 2).
 *
 * Camada puramente de MODELAGEM e DERIVAÇÃO — não fala com a OpenAI, não abre
 * WebRTC, não toca microfone/áudio e não conhece nomes reais de vozes. Apenas
 * transforma os dados já existentes do caso em um VoiceProfile que uma etapa
 * FUTURA usará para escolher a voz.
 *
 * Convenção de modelagem: o VoiceProfile descreve o FALANTE (a voz).
 *   - speakerRole: quem fala (paciente, acompanhante/responsável, companion);
 *   - ageGroup: faixa etária do PACIENTE (informação clínica);
 *   - genderPresentation: gênero do FALANTE (paciente adulto → sexo; pediatria →
 *     responsável; ausência → neutral);
 *   - emotionalState / respiratoryEffort: derivados apenas de sinais OBJETIVOS e
 *     apenas quando o PACIENTE fala (um acompanhante não está dispneico).
 */

import type { Caso } from "@/lib/types";
import { normalizarFaixaEtariaPediatrica } from "@/lib/prompts";
import {
  resolverVoiceId,
  isVoiceIdValido,
  type VoiceSpeakerRole,
  type VoiceGenderPresentation,
  type VoiceAgeGroup,
} from "@/lib/voice/voiceCatalog";

export type VoiceEmotionalState =
  | "calm"
  | "anxious"
  | "fearful"
  | "in_pain"
  | "dyspneic"
  | "confused"
  | "tired";

export type VoiceSpeakingPace = "slow" | "normal" | "fast";

export type VoiceRespiratoryEffort = "none" | "mild" | "moderate" | "severe";

export interface VoiceProfile {
  speakerRole: VoiceSpeakerRole;
  genderPresentation: VoiceGenderPresentation;
  ageGroup: VoiceAgeGroup;
  emotionalState: VoiceEmotionalState;
  speakingPace: VoiceSpeakingPace;
  respiratoryEffort: VoiceRespiratoryEffort;
  regionalAccent: string;
  voiceId: string;
}

/** Sotaque regional padrão (configurável no futuro). */
export const REGIONAL_ACCENT_DEFAULT = "neutral_br";

// ── Auxiliares de derivação (puros) ──────────────────────────────────────────

function isPediatricoCaso(caso: Caso): boolean {
  return (
    caso.tipoPaciente === "pediatrico" ||
    caso.paciente?.tipoPaciente === "pediatrico"
  );
}

/** Gênero do RESPONSÁVEL a partir do parentesco (pediatria). */
function generoDoResponsavel(parentesco?: string): VoiceGenderPresentation {
  switch ((parentesco || "").trim().toLowerCase()) {
    case "mãe":
    case "mae":
    case "avó":
    case "avo":
      return "female";
    case "pai":
    case "avô":
    case "avo ": // tolerância a variações
      return "male";
    default:
      return "neutral"; // "responsável" ou desconhecido
  }
}

/** Gênero do PACIENTE a partir de sexo "M"/"F". */
function generoDoPaciente(sexo?: string): VoiceGenderPresentation {
  const s = (sexo || "").trim().toUpperCase();
  if (s === "M") return "male";
  if (s === "F") return "female";
  return "neutral";
}

/** Lê os sinais vitais do caso pelas três formas existentes no projeto. */
function obterSinaisVitais(
  caso: Caso
): { spo2?: number; fr?: number } {
  const anyCaso = caso as any;
  const sv =
    anyCaso?.sinaisVitais?.entrada ||
    anyCaso?.sinaisVitaisCorretos ||
    anyCaso?.sinais_vitais?.corretos ||
    null;
  if (!sv) return {};
  const spo2 = Number(sv.saturacaoOxigenio);
  const fr = Number(sv.frequenciaRespiratoria);
  return {
    spo2: Number.isFinite(spo2) ? spo2 : undefined,
    fr: Number.isFinite(fr) ? fr : undefined,
  };
}

const NIVEL: Record<VoiceRespiratoryEffort, number> = {
  none: 0,
  mild: 1,
  moderate: 2,
  severe: 3,
};
const POR_NIVEL: VoiceRespiratoryEffort[] = ["none", "mild", "moderate", "severe"];

/**
 * Esforço respiratório a partir de sinais OBJETIVOS. SpO2 vale para todas as
 * idades; FR só é considerada para faixas com norma adulta (evita marcar como
 * grave a taquipneia fisiológica de lactentes). Sem sinais → "none".
 */
function derivarRespiratoryEffort(
  caso: Caso,
  ageGroup: VoiceAgeGroup
): VoiceRespiratoryEffort {
  const { spo2, fr } = obterSinaisVitais(caso);
  let nivel = 0;

  if (spo2 !== undefined) {
    if (spo2 < 88) nivel = Math.max(nivel, NIVEL.severe);
    else if (spo2 < 92) nivel = Math.max(nivel, NIVEL.moderate);
    else if (spo2 < 95) nivel = Math.max(nivel, NIVEL.mild);
  }

  // FR só para faixas com referência adulta (adult/elderly/adolescent).
  if (fr !== undefined && ageGroup !== "child") {
    if (fr >= 30) nivel = Math.max(nivel, NIVEL.severe);
    else if (fr >= 24) nivel = Math.max(nivel, NIVEL.moderate);
    else if (fr >= 21) nivel = Math.max(nivel, NIVEL.mild);
  }

  return POR_NIVEL[nivel];
}

// ── Derivação principal ──────────────────────────────────────────────────────

/**
 * Deriva automaticamente o VoiceProfile de um caso, usando apenas dados já
 * existentes. Um override opcional (`caso.voiceProfile`, Partial<VoiceProfile>)
 * é aplicado por merge sobre o perfil derivado (o override vence). Nenhum caso é
 * modificado.
 */
export function derivarVoiceProfile(caso: Caso): VoiceProfile {
  const paciente = caso.paciente;
  const pediatrico = isPediatricoCaso(caso);
  const faixa = pediatrico
    ? normalizarFaixaEtariaPediatrica(paciente?.dadosPediatricos?.faixaEtaria)
    : null;

  // speakerRole: quem fala.
  let speakerRole: VoiceSpeakerRole;
  if (pediatrico) {
    // Adolescente fala por si; demais faixas (e faixa desconhecida) → responsável.
    speakerRole = faixa === "adolescente" ? "patient" : "caregiver";
  } else {
    speakerRole = "patient";
  }

  // ageGroup: faixa etária do PACIENTE.
  let ageGroup: VoiceAgeGroup;
  if (pediatrico) {
    ageGroup = faixa === "adolescente" ? "adolescent" : "child";
  } else {
    const idade = Number(paciente?.idade);
    ageGroup = Number.isFinite(idade) && idade >= 65 ? "elderly" : "adult";
  }

  // genderPresentation: gênero do FALANTE. A derivação nunca produz "companion"
  // (esse papel só chega via override, já mesclado depois).
  const genderPresentation: VoiceGenderPresentation =
    speakerRole === "caregiver"
      ? generoDoResponsavel(paciente?.dadosPediatricos?.responsavel?.parentesco)
      : generoDoPaciente(paciente?.sexo);

  // respiratoryEffort / emotionalState: só quando o PACIENTE fala.
  const respiratoryEffort: VoiceRespiratoryEffort =
    speakerRole === "patient" ? derivarRespiratoryEffort(caso, ageGroup) : "none";

  const emotionalState: VoiceEmotionalState =
    respiratoryEffort === "moderate" || respiratoryEffort === "severe"
      ? "dyspneic"
      : "calm";

  const derivado: VoiceProfile = {
    speakerRole,
    genderPresentation,
    ageGroup,
    emotionalState,
    speakingPace: "normal", // default seguro
    respiratoryEffort,
    regionalAccent: REGIONAL_ACCENT_DEFAULT,
    voiceId: resolverVoiceId(speakerRole, ageGroup, genderPresentation),
  };

  // Override opcional por merge (campo ainda não presente no tipo Caso).
  // Não muta o caso nem o objeto de override (spread cria um novo objeto).
  const override = (caso as any)?.voiceProfile as Partial<VoiceProfile> | undefined;
  if (!override || typeof override !== "object") {
    return derivado;
  }
  const mesclado: VoiceProfile = { ...derivado, ...override };
  // Um voiceId inválido vindo do override NÃO é aceito silenciosamente:
  // recai no resolvedor do catálogo a partir dos campos já mesclados,
  // garantindo que o perfil final permaneça dentro do catálogo.
  if (!isVoiceIdValido(mesclado.voiceId)) {
    mesclado.voiceId = resolverVoiceId(
      mesclado.speakerRole,
      mesclado.ageGroup,
      mesclado.genderPresentation
    );
  }
  return mesclado;
}
