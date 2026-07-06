// Knowledge — Guidelines/condutas (seed aditivo).
import { KNOWLEDGE_SCHEMA_VERSION, type KnowledgeGuideline } from "../types/knowledge";
const V = KNOWLEDGE_SCHEMA_VERSION; const m = { curadoria: "curado" as const };

export const GUIDELINES: KnowledgeGuideline[] = [
  { id: "guide-pneumonia", slug: "guia-pneumonia", nome: "Conduta na Pneumonia (PAC)", categoria: "guideline", condicao: "Pneumonia adquirida na comunidade", version: V, metadata: m,
    descricao: "Diagnóstico + gravidade (CURB-65) + antibioticoterapia empírica + seguimento.",
    pontosChave: ["Confirmar com RX + leucograma", "Avaliar gravidade (CURB-65/SpO₂)", "Betalactâmico + macrolídeo", "Reavaliar em 48–72h"],
    tags: ["pneumonia", "antibiotico"], refs: { diagnosticos: ["dx-pneumonia"], scores: ["score-curb65"], drogas: ["drug-amoxicilina"] } },
  { id: "guide-asma", slug: "guia-asma", nome: "Conduta na Crise Asmática", categoria: "guideline", condicao: "Asma aguda", version: V, metadata: m,
    descricao: "Classificar gravidade; β2-agonista seriado + corticosteroide sistêmico + O₂ titulado.",
    pontosChave: ["SpO₂/fala classificam gravidade", "Salbutamol seriado", "Corticosteroide sistêmico", "O₂ para SpO₂ > 94%"],
    tags: ["asma", "broncoespasmo"], refs: { diagnosticos: ["dx-asma"], drogas: ["drug-salbutamol", "drug-corticosteroide"] } },
  { id: "guide-dpoc", slug: "guia-dpoc", nome: "Conduta na Exacerbação de DPOC", categoria: "guideline", condicao: "DPOC exacerbado", version: V, metadata: m,
    descricao: "O₂ titulado 88–92%, broncodilatador nebulizado, corticosteroide, antibiótico se purulência, VNI se acidose.",
    pontosChave: ["Alvo SpO₂ 88–92%", "Broncodilatador nebulizado", "Corticosteroide sistêmico", "Considerar antibiótico/VNI"],
    tags: ["dpoc"], refs: { diagnosticos: ["dx-dpoc"], drogas: ["drug-salbutamol", "drug-corticosteroide"] } },
  { id: "guide-ic", slug: "guia-ic", nome: "Conduta na IC Descompensada", categoria: "guideline", condicao: "Insuficiência cardíaca", version: V, metadata: m,
    descricao: "Terapia descongestiva (diurético), IECA/BB, O₂ se hipoxemia; confirmar FEVE ao eco.",
    pontosChave: ["Diurético IV", "IECA/BB conforme fase", "Ecocardiograma (FEVE)", "Restrição hídrica/sódio"],
    tags: ["ic", "congestao"], refs: { diagnosticos: ["dx-ic"], drogas: ["drug-diuretico"] } },
  { id: "guide-sca", slug: "guia-sca", nome: "Conduta na SCA / IAMCSST", categoria: "guideline", condicao: "Síndrome coronariana aguda", version: V, metadata: m,
    descricao: "ECG ≤10 min, AAS + antitrombótico, reperfusão urgente; não aguardar troponina no supra de ST.",
    pontosChave: ["ECG em ≤10 min", "AAS precoce", "Reperfusão urgente", "Monitorização/transferência"],
    tags: ["sca", "iam"], refs: { diagnosticos: ["dx-sca"], exames: ["ecg-supra-st", "lab-troponina"], drogas: ["drug-aas"] } },
  { id: "guide-tep", slug: "guia-tep", nome: "Conduta no TEP", categoria: "guideline", condicao: "Tromboembolismo pulmonar", version: V, metadata: m,
    descricao: "Probabilidade (Wells) → D-dímero/angio-TC; anticoagular na suspeita; trombólise se instável.",
    pontosChave: ["Estimar probabilidade (Wells)", "Anticoagular já na suspeita", "Angio-TC confirma", "Trombólise se instável"],
    tags: ["tep", "anticoagulacao"], refs: { diagnosticos: ["dx-tep"], scores: ["score-wells"], drogas: ["drug-anticoagulante"] } },
];
export default GUIDELINES;
