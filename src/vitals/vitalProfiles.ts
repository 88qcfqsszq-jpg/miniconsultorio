// ============================================================================
// Reavaliação de Sinais Vitais — PERFIS por padrão clínico + resolvedor
// ----------------------------------------------------------------------------
// Cada perfil define como os sinais tendem a evoluir na reavaliação e a
// orientação de disposição. Casos graves têm `nuncaAltaDireta = true`.
// ============================================================================

import type { VitalProfile } from "@/src/vitals/vitalTypes";

function norm(s: unknown): string {
  return String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export const VITAL_PROFILES: Record<string, VitalProfile> = {
  normal_inespecifico: { key: "normal_inespecifico", descricao: "Sem instabilidade — evolução estável.", pa: "estavel", fc: "estavel", fr: "estavel", temp: "estavel", spo2: "estavel", dor: "estavel", podeAlta: true, provavelObservacao: false, provavelHospital: false, nuncaAltaDireta: false, nota: "Paciente estável; alta possível com orientações." },
  asma_leve_moderada: { key: "asma_leve_moderada", descricao: "Asma leve/moderada — boa resposta ao broncodilatador.", pa: "estavel", fc: "melhora", fr: "melhora_forte", temp: "estavel", spo2: "melhora_forte", dor: "melhora", podeAlta: true, provavelObservacao: true, provavelHospital: false, nuncaAltaDireta: false, nota: "Se SatO₂ e FR normalizarem e mantiverem após observação, considerar alta." },
  asma_grave: { key: "asma_grave", descricao: "Asma grave/estado de mal asmático — resposta parcial.", pa: "estavel", fc: "estavel", fr: "melhora", temp: "estavel", spo2: "melhora", dor: "estavel", podeAlta: false, provavelObservacao: true, provavelHospital: true, nuncaAltaDireta: false, nota: "Resposta incompleta — manter observação/UTI conforme evolução." },
  dpoc_exacerbado: { key: "dpoc_exacerbado", descricao: "DPOC exacerbado — melhora lenta.", pa: "estavel", fc: "melhora", fr: "melhora", temp: "estavel", spo2: "melhora", dor: "estavel", podeAlta: false, provavelObservacao: true, provavelHospital: true, nuncaAltaDireta: false, nota: "Alvo de SatO₂ 88–92%; observar retenção de CO₂." },
  pneumonia_leve: { key: "pneumonia_leve", descricao: "Pneumonia leve — boa resposta.", pa: "estavel", fc: "melhora", fr: "melhora", temp: "melhora_forte", spo2: "melhora", dor: "melhora", podeAlta: true, provavelObservacao: true, provavelHospital: false, nuncaAltaDireta: false, nota: "Se estável (CURB-65 baixo), alta com antibiótico e retorno." },
  pneumonia_grave: { key: "pneumonia_grave", descricao: "Pneumonia grave — melhora parcial da oxigenação.", pa: "estavel", fc: "estavel", fr: "melhora", temp: "melhora", spo2: "melhora", dor: "estavel", podeAlta: false, provavelObservacao: true, provavelHospital: true, nuncaAltaDireta: true, nota: "Não indicar alta automática — internação/observação (gravidade)." },
  sepse: { key: "sepse", descricao: "Sepse — melhora parcial com ressuscitação.", pa: "melhora", fc: "melhora", fr: "estavel", temp: "melhora", spo2: "melhora", dor: "estavel", podeAlta: false, provavelObservacao: false, provavelHospital: true, nuncaAltaDireta: true, nota: "Encaminhamento hospitalar mesmo com melhora — risco de deterioração." },
  dengue_sem_alarme: { key: "dengue_sem_alarme", descricao: "Dengue sem sinais de alarme.", pa: "estavel", fc: "melhora", fr: "estavel", temp: "melhora", spo2: "estavel", dor: "melhora", podeAlta: true, provavelObservacao: false, provavelHospital: false, nuncaAltaDireta: false, nota: "Se hidratado e estável, alta com hidratação e sinais de alarme." },
  dengue_com_alarme: { key: "dengue_com_alarme", descricao: "Dengue com sinais de alarme.", pa: "estavel", fc: "estavel", fr: "estavel", temp: "melhora", spo2: "estavel", dor: "estavel", podeAlta: false, provavelObservacao: true, provavelHospital: true, nuncaAltaDireta: true, nota: "Observação/internação obrigatória — risco de extravasamento plasmático." },
  iam_sca: { key: "iam_sca", descricao: "SCA/IAM — sinais podem estar aceitáveis.", pa: "estavel", fc: "estavel", fr: "estavel", temp: "estavel", spo2: "estavel", dor: "melhora", podeAlta: false, provavelObservacao: false, provavelHospital: true, nuncaAltaDireta: true, nota: "Encaminhamento hospitalar imediato mesmo com sinais aceitáveis." },
  insuficiencia_cardiaca: { key: "insuficiencia_cardiaca", descricao: "IC descompensada.", pa: "estavel", fc: "melhora", fr: "melhora", temp: "estavel", spo2: "melhora", dor: "estavel", podeAlta: false, provavelObservacao: true, provavelHospital: true, nuncaAltaDireta: true, nota: "Descompensação — internação/observação; não indicar alta direta." },
  tep: { key: "tep", descricao: "TEP — risco elevado.", pa: "estavel", fc: "estavel", fr: "melhora", temp: "estavel", spo2: "melhora", dor: "estavel", podeAlta: false, provavelObservacao: false, provavelHospital: true, nuncaAltaDireta: true, nota: "Encaminhamento hospitalar — anticoagulação e estratificação de risco." },
  crise_hipertensiva: { key: "crise_hipertensiva", descricao: "Urgência hipertensiva (sem lesão de órgão-alvo).", pa: "melhora", fc: "melhora", fr: "estavel", temp: "estavel", spo2: "estavel", dor: "melhora", podeAlta: false, provavelObservacao: true, provavelHospital: false, nuncaAltaDireta: false, nota: "Reduzir PA de forma controlada; observação; hospital se surgir lesão de órgão-alvo." },
  emergencia_hipertensiva: { key: "emergencia_hipertensiva", descricao: "Emergência hipertensiva (lesão de órgão-alvo).", pa: "melhora", fc: "melhora", fr: "estavel", temp: "estavel", spo2: "estavel", dor: "melhora", podeAlta: false, provavelObservacao: false, provavelHospital: true, nuncaAltaDireta: true, nota: "Lesão de órgão-alvo — internação e redução controlada da PA; nunca alta direta." },
  cetoacidose: { key: "cetoacidose", descricao: "Cetoacidose diabética.", pa: "melhora", fc: "melhora", fr: "melhora", temp: "estavel", spo2: "estavel", dor: "estavel", glicemia: "melhora", podeAlta: false, provavelObservacao: false, provavelHospital: true, nuncaAltaDireta: true, nota: "Nunca alta direta — internação para insulina/hidratação/eletrólitos." },
  hipoglicemia: { key: "hipoglicemia", descricao: "Hipoglicemia — resposta rápida à reposição de glicose.", pa: "estavel", fc: "melhora", fr: "estavel", temp: "estavel", spo2: "estavel", dor: "estavel", glicemia: "melhora_forte", podeAlta: true, provavelObservacao: true, provavelHospital: false, nuncaAltaDireta: false, nota: "Corrigida a glicemia e mantida a ingesta, alta com orientação; observar recorrência." },
  desidratacao: { key: "desidratacao", descricao: "Desidratação — resposta à hidratação.", pa: "melhora", fc: "melhora_forte", fr: "estavel", temp: "estavel", spo2: "estavel", dor: "melhora", glicemia: "estavel", podeAlta: true, provavelObservacao: true, provavelHospital: false, nuncaAltaDireta: false, nota: "Se reidratado e estável, alta com orientação de hidratação." },
  febre_virose: { key: "febre_virose", descricao: "Febre/virose autolimitada.", pa: "estavel", fc: "melhora", fr: "estavel", temp: "melhora_forte", spo2: "estavel", dor: "melhora", podeAlta: true, provavelObservacao: false, provavelHospital: false, nuncaAltaDireta: false, nota: "Sintomático e estável — alta com sinais de alarme." },
  dor_aguda_sem_instabilidade: { key: "dor_aguda_sem_instabilidade", descricao: "Dor aguda sem instabilidade.", pa: "estavel", fc: "melhora", fr: "estavel", temp: "estavel", spo2: "estavel", dor: "melhora_forte", podeAlta: true, provavelObservacao: false, provavelHospital: false, nuncaAltaDireta: false, nota: "Controlada a dor e estável, alta com analgesia e retorno." },
  choque: { key: "choque", descricao: "Choque (hipovolêmico/cardiogênico/distributivo) — melhora parcial.", pa: "melhora", fc: "melhora", fr: "estavel", temp: "estavel", spo2: "melhora", dor: "estavel", podeAlta: false, provavelObservacao: false, provavelHospital: true, nuncaAltaDireta: true, nota: "Choque — ressuscitação e internação imediata; nunca alta direta." },
  hemorragia: { key: "hemorragia", descricao: "Hemorragia importante — risco de instabilidade.", pa: "estavel", fc: "estavel", fr: "estavel", temp: "estavel", spo2: "estavel", dor: "estavel", podeAlta: false, provavelObservacao: false, provavelHospital: true, nuncaAltaDireta: true, nota: "Sangramento importante — controle do foco e internação; nunca alta direta." },
};

/** Resolve o perfil de reavaliação (específico antes de genérico). */
export function resolveVitalProfileKey(caso: any): string {
  const t = norm([caso?.diagnosticoCorreto, caso?.categoria, caso?.titulo, caso?.dados_ocultos_do_sistema?.diagnostico_principal, caso?.sistema].filter(Boolean).join(" | "));
  const regras: Array<[RegExp, string]> = [
    [/sepse|choque septico/, "sepse"],
    [/hemorrag|sangramento (importante|ativo|volumoso)|hematemese|melena|hemoptise macic/, "hemorragia"],
    [/\bchoque\b|hipovolem|cardiogenico|distributivo/, "choque"],
    [/cetoacidose|\bdka\b/, "cetoacidose"],
    [/hipoglicemi/, "hipoglicemia"],
    [/dengue.*(alarme|grave|hemorrag)|(alarme|grave).*dengue/, "dengue_com_alarme"],
    [/dengue|chikungunya|\bzika\b|febre amarela/, "dengue_sem_alarme"],
    [/tromboembol|\btep\b|embolia pulmonar/, "tep"],
    [/insuficiencia cardiaca|cardiaca sistolica|congestiva|\bic\b/, "insuficiencia_cardiaca"],
    [/sindrome coronariana|infarto|\biam\b|angina|\bsca\b/, "iam_sca"],
    [/emergencia hipertensiva|encefalopatia hipertensiva|hipertensiv.*(encefalopat|lesao de orgao|edema agudo|dissec|avc|acidente vascular)/, "emergencia_hipertensiva"],
    [/urgencia hipertensiva|crise hipertensiva|pico hipertensivo/, "crise_hipertensiva"],
    [/status asthmaticus|asma.*grave|crise asmatica grave/, "asma_grave"],
    [/asma/, "asma_leve_moderada"],
    [/dpoc|enfisema|bronquite cronica/, "dpoc_exacerbado"],
    [/pneumonia.*grave|grave.*pneumonia|pneumonia.*(sepse|hipoxem)/, "pneumonia_grave"],
    [/pneumonia/, "pneumonia_leve"],
    [/desidratacao|vomito|diarreia|gastroenterite/, "desidratacao"],
    [/tuberculose|febre|virose|viral|infeccao viral/, "febre_virose"],
    [/dor toracica|dor abdominal|colica|dor aguda|lombalgia|cefaleia/, "dor_aguda_sem_instabilidade"],
  ];
  for (const [re, key] of regras) if (re.test(t)) return key;
  return "normal_inespecifico";
}

export function getVitalProfile(caso: any): VitalProfile {
  return VITAL_PROFILES[resolveVitalProfileKey(caso)] ?? VITAL_PROFILES.normal_inespecifico;
}
