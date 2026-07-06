// ============================================================================
// LaboratoryEngine — RESOLUÇÃO CLÍNICA do caso → tag única + contexto
// ----------------------------------------------------------------------------
// Uma ÚNICA tag clínica é resolvida do caso e usada por TODOS os painéis, o que
// garante coerência (ex.: IAM → cardíaco alterado, demais painéis coerentes).
// ============================================================================

import type { ClinicalTag, NivelAlteracao, Sexo } from "@/src/lab/labTypes";
import { normalizarSexo } from "@/src/lab/labUtils";

function norm(s: unknown): string {
  return String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Texto pesquisável do caso (diagnóstico/categoria/título). */
function textoDoCaso(caso: any): string {
  return norm([
    caso?.diagnosticoCorreto,
    caso?.categoria,
    caso?.titulo,
    caso?.dados_ocultos_do_sistema?.diagnostico_principal,
    caso?.sistema,
  ].filter(Boolean).join(" | "));
}

/** Resolve a tag clínica principal do caso (específica antes de genérica). */
export function resolveClinicalTag(caso: any): ClinicalTag {
  const t = textoDoCaso(caso);
  const regras: Array<[RegExp, ClinicalTag]> = [
    [/sepse|choque septico|septico/, "sepse"],
    [/cetoacidose|\bdka\b|cetoacidotic/, "dka"],
    [/dengue.*(alarme|grave|hemorrag)|(alarme|grave).*dengue/, "dengue_alarme"],
    [/febre amarela/, "febre_amarela"],
    [/dengue|chikungunya|\bzika\b|arbovirose/, "dengue"],
    [/coagulacao intravascular|\bcivd\b/, "civd"],
    [/purpura trombocitopenica|trombocitopenia imune|\bpti\b/, "pti"],
    [/policitemia|eritrocitose/, "policitemia"],
    [/lupus|\bles\b|hiv|aids|pneumocist/, "les_hiv"],
    [/pielonefrite/, "pielonefrite"],
    [/infeccao (do|de) trato urinario|\bitu\b|cistite/, "itu"],
    [/insuficiencia renal|renal cronica|\birc\b|nefrite|doenca renal/, "irc"],
    [/colestase|coledoco|obstrucao biliar|colangite/, "colestase"],
    [/hepatite|lesao hepatocelular|hepatop/, "hepatite"],
    [/tuberculose/, "tuberculose"],
    [/tromboembol|\btep\b|embolia pulmonar/, "tep"],
    [/insuficiencia cardiaca|\bic\b|cardiaca sistolica|congestiva/, "ic"],
    [/pericardite|miocardite/, "pericardite"],
    [/sindrome coronariana|infarto|\biam\b|angina|\bsca\b/, "iam_sca"],
    [/pneumonia|endocardite|rinossinusite|meningite bacteriana|celulite/, "pneumonia"],
    [/dpoc|enfisema|bronquite cronica/, "dpoc"],
    [/asma|bronquiolite|alerg|rinite/, "asma"],
    [/anemia|talassemia|ferropriva|megaloblastica|hemolitica|leucemia|mieloma|vitamina b12/, "anemia"],
    [/desidratacao|vomito|diarreia|gastroenterite/, "desidratacao"],
    [/virose|viral|infeccao viral inespecifica/, "virose"],
  ];
  for (const [re, tag] of regras) if (re.test(t)) return tag;
  return "normal";
}

const GRAVE: ClinicalTag[] = ["sepse", "dengue_alarme", "dka", "civd", "febre_amarela"];
const MODERADO: ClinicalTag[] = ["pneumonia", "iam_sca", "ic", "tep", "irc", "dengue", "hepatite", "colestase", "pielonefrite", "les_hiv", "anemia", "pti", "policitemia"];

export function gravidadeDaTag(tag: ClinicalTag): NivelAlteracao {
  if (GRAVE.includes(tag)) return "grave";
  if (MODERADO.includes(tag)) return "moderado";
  if (tag === "normal") return "normal";
  return "leve";
}

export function dadosPaciente(caso: any): { idade?: number; sexo: Sexo; nome?: string } {
  const idade = caso?.paciente?.idade ?? caso?.dados_visiveis_ao_estudante?.idade;
  const sexo = normalizarSexo(caso?.paciente?.sexo ?? caso?.sexo);
  const nome = caso?.paciente?.nome ?? caso?.dados_visiveis_ao_estudante?.nome;
  return { idade: idade != null ? Number(idade) : undefined, sexo, nome };
}
