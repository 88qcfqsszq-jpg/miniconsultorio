// Knowledge — Fármacos (seed aditivo). Educacional; NÃO é prescrição real.
import { KNOWLEDGE_SCHEMA_VERSION, type KnowledgeDrug } from "../types/knowledge";
const V = KNOWLEDGE_SCHEMA_VERSION; const m = { curadoria: "curado" as const };

export const DRUGS: KnowledgeDrug[] = [
  { id: "drug-amoxicilina", slug: "amoxicilina", nome: "Amoxicilina (± clavulanato)", categoria: "drug", classe: "Betalactâmico", version: V, metadata: m,
    descricao: "Antibiótico betalactâmico; cobertura empírica na PAC (com macrolídeo).", indicacoes: ["Pneumonia adquirida na comunidade"],
    observacaoDose: "Especificar dose no OSCE (educacional).", tags: ["antibiotico", "pac"], refs: { diagnosticos: ["dx-pneumonia"], guidelines: ["guide-pneumonia"] } },
  { id: "drug-salbutamol", slug: "salbutamol", nome: "Salbutamol", categoria: "drug", classe: "β2-agonista de curta ação", version: V, metadata: m,
    descricao: "Broncodilatador de resgate; base do tratamento do broncoespasmo.", indicacoes: ["Asma", "DPOC exacerbado"],
    tags: ["broncodilatador"], refs: { diagnosticos: ["dx-asma", "dx-dpoc"], procedimentos: ["proc-nebulizacao"] } },
  { id: "drug-corticosteroide", slug: "corticosteroide-sistemico", nome: "Corticosteroide sistêmico", categoria: "drug", classe: "Corticosteroide", version: V, metadata: m,
    descricao: "Reduz inflamação e duração da exacerbação (asma/DPOC).", indicacoes: ["Crise asmática", "Exacerbação de DPOC"],
    tags: ["corticoide"], refs: { diagnosticos: ["dx-asma", "dx-dpoc"] } },
  { id: "drug-diuretico", slug: "diuretico", nome: "Diurético de alça (furosemida)", categoria: "drug", classe: "Diurético", version: V, metadata: m,
    descricao: "Terapia descongestiva na IC congestiva.", indicacoes: ["IC descompensada com congestão"],
    tags: ["diuretico", "congestao"], refs: { diagnosticos: ["dx-ic"], guidelines: ["guide-ic"] } },
  { id: "drug-aas", slug: "aas", nome: "Ácido acetilsalicílico (AAS)", categoria: "drug", classe: "Antiagregante", version: V, metadata: m,
    descricao: "Antiagregante precoce na SCA.", indicacoes: ["Síndrome coronariana aguda"], tags: ["aas", "sca"],
    refs: { diagnosticos: ["dx-sca"], guidelines: ["guide-sca"] } },
  { id: "drug-anticoagulante", slug: "anticoagulante", nome: "Anticoagulante (HBPM/heparina)", categoria: "drug", classe: "Anticoagulante", version: V, metadata: m,
    descricao: "Anticoagulação precoce na suspeita de TEP.", indicacoes: ["Tromboembolismo pulmonar"], tags: ["anticoagulante", "tep"],
    refs: { diagnosticos: ["dx-tep"], guidelines: ["guide-tep"] } },
];
export default DRUGS;
