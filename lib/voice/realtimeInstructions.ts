/**
 * Combinador de instruções para a sessão Realtime (Etapa 3).
 *
 * Função PEQUENA e PURA — sem HTTP, sem React, sem WebRTC, sem chamadas de rede.
 * Reutiliza a FONTE ÚNICA de regras clínicas (construirInstrucoesBasePaciente,
 * de lib/prompts.ts) e acrescenta apenas METADADOS COMPORTAMENTAIS do VoiceProfile
 * (papel do falante, faixa etária, estado emocional, ritmo, esforço respiratório)
 * mais a regra de áudio de não iniciar cumprimento espontaneamente.
 *
 * NÃO duplica nenhuma regra clínica já presente na base (revelação controlada,
 * anti-repetição, proibição de diagnóstico, interlocutor pediátrico) — essas
 * seguem existindo em um único lugar: lib/prompts.ts.
 */

import { construirInstrucoesBasePaciente } from "@/lib/prompts";
import { derivarVoiceProfile, type VoiceProfile } from "@/lib/voice/voiceProfile";
import type { Caso } from "@/lib/types";

export interface RealtimeInstructionsResult {
  /** Instruções completas para instructions da sessão Realtime (base + metadados de voz). */
  instructions: string;
  /** Perfil de voz derivado — usado pelo endpoint para escolher voiceId lógico. */
  voiceProfile: VoiceProfile;
}

const ROTULO_PAPEL: Record<VoiceProfile["speakerRole"], string> = {
  patient: "o próprio paciente",
  caregiver: "o responsável/acompanhante do paciente (mãe, pai ou cuidador)",
  companion: "um acompanhante do paciente",
};

const ROTULO_FAIXA: Record<VoiceProfile["ageGroup"], string> = {
  child: "criança",
  adolescent: "adolescente",
  adult: "adulto",
  elderly: "idoso(a)",
};

const ROTULO_EMOCAO: Record<VoiceProfile["emotionalState"], string> = {
  calm: "calmo(a)",
  anxious: "ansioso(a)",
  fearful: "amedrontado(a)",
  in_pain: "com dor perceptível na voz",
  dyspneic: "com esforço respiratório perceptível na voz (fala entrecortada)",
  confused: "confuso(a)",
  tired: "cansado(a)",
};

const ROTULO_RITMO: Record<VoiceProfile["speakingPace"], string> = {
  slow: "lento",
  normal: "normal",
  fast: "rápido",
};

const ROTULO_ESFORCO: Record<VoiceProfile["respiratoryEffort"], string> = {
  none: "nenhum",
  mild: "leve",
  moderate: "moderado",
  severe: "importante",
};

/**
 * Combina uma BASE já pronta (a saída de construirInstrucoesBasePaciente para
 * o caminho legado/completo, OU uma base reduzida — ex.: só os fatos de
 * abertura, Fase 4D.1 — para o gate manual do Realtime) com os metadados de
 * voz. Extraído de construirInstrucoesRealtime para permitir uma base
 * alternativa sem duplicar a lógica de metadados — mesmo padrão já usado em
 * lib/prompts.ts (montarPromptPacienteComBase) para o modo texto.
 */
export function combinarBaseComMetadadosDeVoz(base: string, caso: Caso): RealtimeInstructionsResult {
  const voiceProfile = derivarVoiceProfile(caso);

  const metadadosVoz = `
═══════════════════════════════════════════════════════════
METADADOS DE VOZ (SESSÃO REALTIME) — comportamento de áudio, não regra clínica nova
═══════════════════════════════════════════════════════════
- Quem fala: ${ROTULO_PAPEL[voiceProfile.speakerRole]}
- Faixa etária do paciente: ${ROTULO_FAIXA[voiceProfile.ageGroup]}
- Tom de voz (apenas prosódia, não é novo dado clínico): ${ROTULO_EMOCAO[voiceProfile.emotionalState]}
- Ritmo de fala: ${ROTULO_RITMO[voiceProfile.speakingPace]}
- Esforço respiratório perceptível na voz: ${ROTULO_ESFORCO[voiceProfile.respiratoryEffort]}

REGRA DE ÁUDIO (específica à voz, complementa — não substitui — a regra acima
de aguardar a pergunta do médico): não emita nenhuma fala, som ou cumprimento
antes que o aluno fale primeiro. Não inicie a sessão falando sozinho(a).

REGRA DE ESCOPO DA RESPOSTA (FASE 4E, específica à voz): responda apenas ao
que foi perguntado na fala atual, usando somente a informação diretamente
necessária. Não antecipe, resuma nem acrescente outros dados clínicos. Se não
houver uma pergunta inteligível — apenas ruído, pigarro ou fala
incompreensível — peça brevemente para repetir e não revele nenhuma
informação nova.
═══════════════════════════════════════════════════════════`.trim();

  return {
    instructions: `${base}\n\n${metadadosVoz}`,
    voiceProfile,
  };
}

/**
 * Constrói as instruções completas para a sessão Realtime de um caso: a base
 * clínica (fonte única, idêntica ao modo texto) + um bloco de metadados de voz
 * que NÃO repete regra clínica alguma — apenas orienta tom/ritmo/comportamento
 * de áudio e reforça (de forma específica ao áudio) que a fala não deve começar
 * antes do aluno.
 */
export function construirInstrucoesRealtime(caso: Caso): RealtimeInstructionsResult {
  const instructionsBase = construirInstrucoesBasePaciente(caso);
  return combinarBaseComMetadadosDeVoz(instructionsBase, caso);
}
