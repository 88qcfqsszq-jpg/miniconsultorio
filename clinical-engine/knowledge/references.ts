// Knowledge — Fontes/Referências (seed aditivo).
import { KNOWLEDGE_SCHEMA_VERSION, type KnowledgeReference } from "./types/knowledge";
const V = KNOWLEDGE_SCHEMA_VERSION; const m = { curadoria: "curado" as const };

export const REFERENCES: KnowledgeReference[] = [
  { id: "ref-open-i", slug: "open-i", nome: "Open-i / NLM", categoria: "reference", tipoFonte: "atlas", version: V, metadata: m,
    descricao: "Coleção de imagens (Indiana University Chest X-ray) usada no Atlas de Imagens.",
    url: "https://openi.nlm.nih.gov/", tags: ["open-i", "imagem"], refs: { imagens: ["img-rx-torax"] } },
  { id: "ref-hls-cmds", slug: "hls-cmds", nome: "HLS-CMDS (Heart & Lung Sounds)", categoria: "reference", tipoFonte: "base_interna", version: V, metadata: m,
    descricao: "Base local de áudios de ausculta pulmonar/cardíaca (soundsCatalog).",
    tags: ["hls-cmds", "sons"], refs: { sons: ["ls-crepitacoes", "hs-b3"] } },
  { id: "ref-centro-clinico", slug: "centro-clinico", nome: "Centro Clínico (base interna)", categoria: "reference", tipoFonte: "base_interna", version: V, metadata: { curadoria: "curado", futureRefs: { centroClinico: ["/centro-clinico"] } },
    descricao: "Semiologia, fluxos, exames, imagens e sons do Centro Clínico.",
    tags: ["centro clinico"], refs: { fluxos: ["flow-dispneia"] } },
];
export default REFERENCES;
