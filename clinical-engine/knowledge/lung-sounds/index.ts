// Knowledge — Sons pulmonares (seed), ancorados no soundsCatalog. Aditivo.
import { KNOWLEDGE_SCHEMA_VERSION, type KnowledgeSound } from "../types/knowledge";

const V = KNOWLEDGE_SCHEMA_VERSION;
const m = { curadoria: "curado" as const, fonte: "HLS-CMDS / soundsCatalog" };

export const LUNG_SOUNDS: KnowledgeSound[] = [
  { id: "ls-crepitacoes", slug: "crepitacoes", nome: "Crepitações", categoria: "lung_sound", version: V, metadata: m,
    descricao: "Estalidos inspiratórios (finas/grossas); consolidação, congestão ou fibrose.",
    tipoOficial: "Fine/Coarse Crackles", foco: "Bases", arquivo: "M_CC_LLA.wav", audioUrl: "/HLS-CMDS/LS/M_CC_LLA.wav", soundCatalogRef: "M_G_LLA",
    tags: ["crepitacoes", "estertores", "consolidacao"],
    refs: { diagnosticos: ["dx-pneumonia", "dx-ic", "dx-edema-pulmonar"], imagens: ["img-rx-torax"], fluxos: ["flow-dispneia"] } },
  { id: "ls-roncos", slug: "roncos", nome: "Roncos", categoria: "lung_sound", version: V, metadata: m,
    descricao: "Ruído grave e contínuo por secreção em vias aéreas maiores; muda com a tosse.",
    tipoOficial: "Rhonchi", arquivo: "M_R_LUA.wav", audioUrl: "/HLS-CMDS/LS/M_R_LUA.wav", soundCatalogRef: "M_R_LUA",
    tags: ["roncos", "secrecao"], refs: { diagnosticos: ["dx-dpoc"] } },
  { id: "ls-sibilos", slug: "sibilos", nome: "Sibilos", categoria: "lung_sound", version: V, metadata: m,
    descricao: "Som musical expiratório por estreitamento das vias aéreas (broncoespasmo).",
    tipoOficial: "Wheezing", arquivo: "M_W_RUA.wav", audioUrl: "/HLS-CMDS/LS/M_W_RUA.wav", soundCatalogRef: "M_W_RUA",
    tags: ["sibilos", "broncoespasmo"], refs: { diagnosticos: ["dx-asma", "dx-dpoc"], fluxos: ["flow-dispneia"] } },
  { id: "ls-atrito-pleural", slug: "atrito-pleural", nome: "Atrito pleural", categoria: "lung_sound", version: V, metadata: m,
    descricao: "Som áspero (em couro), inspiratório e expiratório, por inflamação pleural.",
    tipoOficial: "Pleural Rub", arquivo: "M_PR_LMA.wav", audioUrl: "/HLS-CMDS/LS/M_PR_LMA.wav", soundCatalogRef: "M_PR_LMA",
    tags: ["atrito pleural", "pleurite"], refs: { diagnosticos: ["dx-tep"] } },
  { id: "ls-mv-reduzido", slug: "mv-reduzido", nome: "Murmúrio vesicular reduzido", categoria: "lung_sound", version: V, metadata: m,
    descricao: "Redução do MV (derrame/atelectasia); SEM áudio real na base — silêncio didático.",
    tipoOficial: "MV reduzido", arquivo: null, audioUrl: null, silencioDidatico: true,
    tags: ["mv reduzido", "derrame", "silencio didatico"], refs: { imagens: ["img-rx-torax"] } },
  { id: "ls-mv-abolido", slug: "mv-abolido", nome: "Murmúrio vesicular abolido", categoria: "lung_sound", version: V, metadata: m,
    descricao: "Abolição do MV (pneumotórax); SEM áudio real na base — silêncio didático.",
    tipoOficial: "MV abolido", arquivo: null, audioUrl: null, silencioDidatico: true,
    tags: ["mv abolido", "pneumotorax", "silencio didatico"], refs: { imagens: ["img-rx-torax"] } },
];

export default LUNG_SOUNDS;
