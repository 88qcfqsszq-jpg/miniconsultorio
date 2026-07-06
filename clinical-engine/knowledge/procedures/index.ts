// Knowledge — Procedimentos (seed aditivo).
import { KNOWLEDGE_SCHEMA_VERSION, type KnowledgeProcedure } from "../types/knowledge";
const V = KNOWLEDGE_SCHEMA_VERSION; const m = { curadoria: "curado" as const };

export const PROCEDURES: KnowledgeProcedure[] = [
  { id: "proc-oxigenoterapia", slug: "oxigenoterapia", nome: "Oxigenoterapia", categoria: "procedure", version: V, metadata: m,
    descricao: "Suplementação de O₂; titular conforme SpO₂ (cuidado na DPOC: alvo 88–92%).",
    indicacoes: ["Hipoxemia", "Insuficiência respiratória"], tags: ["oxigenio", "suporte"],
    refs: { diagnosticos: ["dx-dpoc", "dx-asma", "dx-ic"], sintomas: ["sym-dispneia"] } },
  { id: "proc-nebulizacao", slug: "nebulizacao", nome: "Nebulização", categoria: "procedure", version: V, metadata: m,
    descricao: "Administração inalatória de broncodilatador (± ipratrópio).",
    indicacoes: ["Broncoespasmo (asma/DPOC)"], tags: ["nebulizacao", "broncodilatador"],
    refs: { diagnosticos: ["dx-asma", "dx-dpoc"], drogas: ["drug-salbutamol"] } },
  { id: "proc-acesso-venoso", slug: "acesso-venoso", nome: "Acesso venoso periférico", categoria: "procedure", version: V, metadata: m,
    descricao: "Punção venosa para medicação/hidratação/coletas.", indicacoes: ["Necessidade de terapia IV"],
    tags: ["acesso venoso"], refs: {} },
  { id: "proc-intubacao", slug: "intubacao", nome: "Intubação orotraqueal", categoria: "procedure", version: V, metadata: m,
    descricao: "Via aérea definitiva em insuficiência respiratória/rebaixamento.",
    indicacoes: ["Insuficiência respiratória grave", "Rebaixamento do nível de consciência"], tags: ["intubacao", "via aerea"],
    refs: { diagnosticos: ["dx-dpoc"] } },
];
export default PROCEDURES;
