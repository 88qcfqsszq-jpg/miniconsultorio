// ============================================================================
// TreatmentResponseEngine — DICIONÁRIO DE SINÔNIMOS (pt-BR)
// ----------------------------------------------------------------------------
// Mapeia cada intervenção para termos reconhecíveis no texto da conduta.
// Os termos já estão normalizados (minúsculas, sem acento). O casamento de
// AINE/AAS (perigoso em dengue) e do "evitar AINE/AAS" é tratado à parte em
// extractInterventions, pois depende de contexto (ressalva de evitar).
// ============================================================================

import type { Interventions } from "@/src/treatment/treatmentTypes";

/** Chaves diretas por substring/palavra (não incluem aas/avoidNsaid/dangerous...). */
export const KEYWORDS: Partial<Record<keyof Interventions, string[]>> = {
  oxygen: ["oxigenio", "oxigenoterapia", "cateter nasal", "cateter de o2", "mascara de o2", "mascara facial", "venturi", "suplementacao de o2", "o2 suplementar", "\\bo2\\b"],
  bronchodilator: ["salbutamol", "fenoterol", "aerolin", "berotec", "broncodilatador", "nebulizacao", "nebulizar", "beta agonista", "beta-agonista", "b2 agonista", "ipratropio", "atrovent"],
  corticosteroid: ["prednisona", "prednisolona", "dexametasona", "hidrocortisona", "metilprednisolona", "betametasona", "corticoide", "corticosteroide", "corticoterapia"],
  antibiotic: ["antibiotico", "amoxicilina", "clavulanato", "ceftriaxona", "azitromicina", "claritromicina", "levofloxacino", "moxifloxacino", "penicilina", "cefalexina", "cefuroxima", "\\batb\\b"],
  antipyretic: ["antitermico", "antipiretico", "dipirona", "novalgina", "paracetamol", "acetaminofeno", "tylenol", "ibuprofeno", "aine", "anti-inflamator", "antiinflamator", "nimesulida", "diclofenaco", "naproxeno", "cetoprofeno"],
  analgesic: ["analgesico", "analgesia", "tramadol", "morfina", "opioide", "codeina", "escopolamina"],
  oralHydration: ["hidratacao oral", "soro oral", "reidratacao oral", "soro de reidratacao", "ingestao de liquidos", "ingerir liquidos", "hidratar via oral", "\\btro\\b", "hidratacao", "hidratar", "iniciar hidratacao", "oferecer liquidos"],
  ivFluids: ["hidratacao venosa", "hidratacao endovenosa", "soro venoso", "soro fisiologico", "sf 0,9", "sf0,9", "sf 0.9", "cristaloide", "ringer", "reposicao volemica", "volemica", "endovenos", "fluido venoso", "expansao volemica"],
  insulin: ["insulina", "insulinoterapia"],
  glucose: ["glicose", "glicosado", "glicosada", "dextrose", "\\bg50\\b", "glicose hipertonica", "glicose 50", "glicose 25", "glicose oral", "acucar", "sacarose", "carboidrato de acao rapida"],
  potassium: ["potassio", "\\bkcl\\b", "cloreto de potassio", "reposicao de eletrolito", "eletrolitos", "reposicao eletrolitica"],
  nitrate: ["nitrato", "nitroglicerina", "isordil", "dinitrato", "mononitrato", "tridil"],
  anticoagulation: ["anticoagula", "heparina", "enoxaparina", "clexane", "\\bhbpm\\b", "varfarina", "rivaroxabana", "apixabana", "dabigatrana"],
  monitoring: ["monitorizacao", "monitorar", "monitoramento", "monitor cardiaco", "observacao", "manter em observacao", "reavaliar", "reavaliacao", "oximetria", "ecg seriado", "curva de troponina"],
  hospitalization: ["hospital", "internar", "internacao", "emergencia", "\\bupa\\b", "encaminhar", "pronto socorro", "pronto-socorro", "\\buti\\b", "referenciar", "transferir", "sala de emergencia"],
  returnPrecautions: ["sinais de alarme", "sinais de gravidade", "orientar retorno", "retornar se", "voltar se", "retorno em", "reavaliacao em", "orientacoes de retorno"],
};

/** Ressalva explícita de EVITAR AINE/AAS. */
export const AVOID_NSAID_RE =
  /(evitar|nao usar|não usar|sem uso|nao prescrever|não prescrever|nao administrar|não administrar|contraindic|suspend|proscrever|nao dar|não dar)[^.;\n]{0,40}(aine|anti[\s-]?inflamat|ibuprofeno|nimesulida|diclofenaco|naproxeno|cetoprofeno|\baas\b|aspirina|acido acetilsalicilico|acetilsalicilico)/;

/** AINE (anti-inflamatório não esteroidal). */
export const NSAID_RE =
  /(aine|anti[\s-]?inflamat|ibuprofeno|nimesulida|diclofenaco|naproxeno|cetoprofeno|piroxicam)/;

/** AAS / aspirina. */
export const ASPIRIN_RE = /(\baas\b|aspirina|acido acetilsalicilico|acetilsalicilico)/;
