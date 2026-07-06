// Knowledge — Exames laboratoriais (seed aditivo).
import { KNOWLEDGE_SCHEMA_VERSION, type KnowledgeExam } from "../types/knowledge";
const V = KNOWLEDGE_SCHEMA_VERSION; const m = { curadoria: "curado" as const };

export const LABORATORY: KnowledgeExam[] = [
  { id: "lab-hemograma", slug: "hemograma", nome: "Hemograma completo", categoria: "laboratory", tipoExame: "laboratorio", version: V, metadata: m,
    descricao: "Série vermelha/branca/plaquetas; avalia anemia, infecção e plaquetopenia.",
    valoresReferencia: "Leucócitos 4.500–11.000/mm³", oQueProcurar: ["Leucocitose", "Neutrofilia", "Anemia", "Plaquetopenia"],
    tags: ["hemograma", "infeccao"], refs: { diagnosticos: ["dx-pneumonia"], sintomas: ["sym-febre"] } },
  { id: "lab-troponina", slug: "troponina", nome: "Troponina", categoria: "laboratory", tipoExame: "laboratorio", version: V, metadata: m,
    descricao: "Marcador de lesão miocárdica; curva ascendente na SCA.",
    oQueProcurar: ["Elevação", "Curva de elevação/queda"], tags: ["troponina", "sca"],
    refs: { diagnosticos: ["dx-sca"], exames: ["ecg-supra-st"], sintomas: ["sym-dor-toracica"] } },
  { id: "lab-gasometria", slug: "gasometria", nome: "Gasometria arterial", categoria: "laboratory", tipoExame: "laboratorio", version: V, metadata: m,
    descricao: "pH, pO₂, pCO₂, HCO₃, lactato; oxigenação, ventilação e ácido-base.",
    oQueProcurar: ["Hipoxemia", "Retenção de CO₂", "Acidose/alcalose"], tags: ["gasometria", "dpoc"],
    refs: { diagnosticos: ["dx-dpoc"], sintomas: ["sym-dispneia"] } },
  { id: "lab-ddimero", slug: "d-dimero", nome: "D-dímero", categoria: "laboratory", tipoExame: "laboratorio", version: V, metadata: m,
    descricao: "Sensível para tromboembolismo; útil em probabilidade baixa/intermediária.",
    oQueProcurar: ["Elevação"], tags: ["d-dimero", "tep"],
    refs: { diagnosticos: ["dx-tep"], scores: ["score-wells"], imagens: ["img-tc-torax"] } },
];
export default LABORATORY;
