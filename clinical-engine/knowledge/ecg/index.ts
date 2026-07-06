// Knowledge — ECG (seed aditivo).
import { KNOWLEDGE_SCHEMA_VERSION, type KnowledgeECG } from "../types/knowledge";
const V = KNOWLEDGE_SCHEMA_VERSION; const m = { curadoria: "curado" as const };

export const ECG_NODES: KnowledgeECG[] = [
  { id: "ecg-supra-st", slug: "supra-de-st", nome: "Supradesnivelamento de ST", categoria: "ecg", padrao: "Supra de ST", version: V, metadata: m,
    descricao: "Supra de ST → IAMCSST; indica reperfusão urgente.", achados: ["Supra de ST", "Ondas Q", "Imagem em espelho"],
    tags: ["ecg", "iam", "supra st"], refs: { diagnosticos: ["dx-sca"], exames: ["lab-troponina"], sintomas: ["sym-dor-toracica"] } },
  { id: "ecg-taquicardia-sinusal", slug: "taquicardia-sinusal", nome: "Taquicardia sinusal", categoria: "ecg", padrao: "Taquicardia sinusal", version: V, metadata: m,
    descricao: "Ritmo sinusal com FC elevada; reativa (febre, dor, hipovolemia, TEP).", achados: ["FC > 100", "Onda P sinusal"],
    tags: ["ecg", "taquicardia"], refs: { sintomas: ["sym-palpitacoes"], diagnosticos: ["dx-tep"] } },
  { id: "ecg-s1q3t3", slug: "s1q3t3", nome: "Padrão S1Q3T3", categoria: "ecg", padrao: "S1Q3T3", version: V, metadata: m,
    descricao: "Sinal clássico (pouco sensível) de sobrecarga de VD no TEP.", achados: ["S em D1", "Q em D3", "T invertida em D3"],
    tags: ["ecg", "tep", "sobrecarga vd"], refs: { diagnosticos: ["dx-tep"] } },
];
export default ECG_NODES;
