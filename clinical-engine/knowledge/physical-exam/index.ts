// Knowledge — Achados de exame físico (não-sonoros). Seed aditivo.
import { KNOWLEDGE_SCHEMA_VERSION, type KnowledgePhysicalFinding } from "../types/knowledge";
const V = KNOWLEDGE_SCHEMA_VERSION; const m = { curadoria: "curado" as const };

export const PHYSICAL_FINDINGS: KnowledgePhysicalFinding[] = [
  { id: "pf-taquipneia", slug: "taquipneia", nome: "Taquipneia", categoria: "physical_finding", version: V, metadata: m,
    descricao: "Frequência respiratória elevada; marcador de gravidade respiratória.", sistema: "respiratorio", tecnica: "geral",
    tags: ["taquipneia", "gravidade"], refs: { sintomas: ["sym-dispneia"], fluxos: ["flow-dispneia"] } },
  { id: "pf-submacicez", slug: "submacicez", nome: "Submacicez à percussão", categoria: "physical_finding", version: V, metadata: m,
    descricao: "Redução do som à percussão; consolidação ou derrame.", sistema: "respiratorio", tecnica: "percussao",
    tags: ["percussao", "consolidacao"], refs: { diagnosticos: ["dx-pneumonia"], achados: ["ls-crepitacoes"] } },
  { id: "pf-fremito-aumentado", slug: "fremito-aumentado", nome: "Frêmito toracovocal aumentado", categoria: "physical_finding", version: V, metadata: m,
    descricao: "Aumento da transmissão vibratória; consolidação pulmonar.", sistema: "respiratorio", tecnica: "palpacao",
    tags: ["fremito", "consolidacao"], refs: { diagnosticos: ["dx-pneumonia"] } },
  { id: "pf-turgencia-jugular", slug: "turgencia-jugular", nome: "Turgência jugular", categoria: "physical_finding", version: V, metadata: m,
    descricao: "Estase jugular; sinal de congestão/pressão venosa central elevada.", sistema: "cardiovascular", tecnica: "inspecao",
    tags: ["turgencia jugular", "congestao"], refs: { diagnosticos: ["dx-ic"], achados: ["hs-b3"] } },
  { id: "pf-edema-mmii", slug: "edema-mmii", nome: "Edema de membros inferiores", categoria: "physical_finding", version: V, metadata: m,
    descricao: "Acúmulo de líquido em MMII; congestão sistêmica.", sistema: "cardiovascular", tecnica: "inspecao",
    tags: ["edema", "congestao"], refs: { diagnosticos: ["dx-ic"] } },
];
export default PHYSICAL_FINDINGS;
