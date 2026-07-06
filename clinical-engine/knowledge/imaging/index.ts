// Knowledge — Imagens (seed aditivo, multimodalidade + termo Open-i).
import { KNOWLEDGE_SCHEMA_VERSION, type KnowledgeImage } from "../types/knowledge";
const V = KNOWLEDGE_SCHEMA_VERSION; const m = { curadoria: "curado" as const, fonte: "Open-i / NLM" };

export const IMAGING: KnowledgeImage[] = [
  { id: "img-rx-torax", slug: "rx-torax", nome: "Radiografia de tórax", categoria: "imaging", modalidade: "RX", regiaoAnatomica: "Tórax", version: V, metadata: m,
    descricao: "Exame de imagem inicial do tórax; consolidação, congestão, pneumotórax, derrame.",
    termoOpenI: "pneumonia chest xray consolidation", achados: ["Consolidação", "Congestão", "Pneumotórax", "Derrame", "Cardiomegalia"],
    tags: ["rx", "torax"], refs: { diagnosticos: ["dx-pneumonia", "dx-ic", "dx-edema-pulmonar"], achados: ["ls-crepitacoes"], fluxos: ["flow-dispneia"] } },
  { id: "img-tc-torax", slug: "tc-torax", nome: "Tomografia de tórax / Angio-TC", categoria: "imaging", modalidade: "Angio-TC", regiaoAnatomica: "Tórax", version: V, metadata: m,
    descricao: "TC de tórax; angio-TC é padrão-ouro para TEP (falha de enchimento arterial).",
    termoOpenI: "pulmonary embolism ct", achados: ["Falha de enchimento arterial", "Consolidação", "Massa"],
    tags: ["tc", "angio-tc", "tep"], refs: { diagnosticos: ["dx-tep"], exames: ["lab-ddimero"] } },
];
export default IMAGING;
