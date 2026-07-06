// Knowledge — Fluxos clínicos (seed aditivo). Espelham /centro-clinico/fluxos.
import { KNOWLEDGE_SCHEMA_VERSION, type KnowledgeFlow } from "../types/knowledge";
const V = KNOWLEDGE_SCHEMA_VERSION;
const m = { curadoria: "curado" as const, futureRefs: { centroClinico: ["/centro-clinico/fluxos"] } };

export const FLOWS: KnowledgeFlow[] = [
  { id: "flow-dispneia", slug: "dispneia", nome: "Fluxo da Dispneia", categoria: "flow", queixa: "Dispneia", version: V, metadata: m,
    descricao: "Abordagem estruturada da falta de ar.", etapas: ["ABCDE", "Oxigênio se indicado", "Sinais vitais", "Ausculta", "RX de tórax", "Gasometria se grave", "Hipóteses", "Conduta"],
    tags: ["dispneia", "fluxo"], refs: { sintomas: ["sym-dispneia"], diagnosticos: ["dx-asma", "dx-dpoc", "dx-ic", "dx-pneumonia", "dx-tep"] } },
  { id: "flow-dor-toracica", slug: "dor-toracica", nome: "Fluxo da Dor Torácica", categoria: "flow", queixa: "Dor torácica", version: V, metadata: m,
    descricao: "Abordagem da dor torácica com estratificação de risco.", etapas: ["ABCDE", "Sinais vitais", "ECG em ≤10 min", "Troponina", "Hipóteses", "Conduta inicial"],
    tags: ["dor toracica", "fluxo"], refs: { sintomas: ["sym-dor-toracica"], exames: ["ecg-supra-st", "lab-troponina"], diagnosticos: ["dx-sca", "dx-tep"] } },
  { id: "flow-febre", slug: "febre", nome: "Fluxo da Febre", categoria: "flow", queixa: "Febre", version: V, metadata: m,
    descricao: "Abordagem da febre com busca de foco e sinais de gravidade.", etapas: ["Estado geral", "Sinais vitais", "Pesquisar foco", "Hemograma", "Culturas se indicado", "Hipóteses", "Antibiótico se indicado", "Reavaliação"],
    tags: ["febre", "fluxo"], refs: { sintomas: ["sym-febre"], exames: ["lab-hemograma"], diagnosticos: ["dx-pneumonia"], scores: ["score-qsofa"] } },
];
export default FLOWS;
