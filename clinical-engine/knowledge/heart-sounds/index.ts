// Knowledge — Sons cardíacos (seed), ancorados no soundsCatalog. Aditivo.
import { KNOWLEDGE_SCHEMA_VERSION, type KnowledgeSound } from "../types/knowledge";

const V = KNOWLEDGE_SCHEMA_VERSION;
const m = { curadoria: "curado" as const, fonte: "HLS-CMDS / soundsCatalog" };

export const HEART_SOUNDS: KnowledgeSound[] = [
  { id: "hs-b3", slug: "b3", nome: "B3 (terceira bulha)", categoria: "heart_sound", version: V, metadata: m,
    descricao: "Som protodiastólico de baixa frequência; sobrecarga de volume (IC).",
    tipoOficial: "S3", foco: "Apex", arquivo: "F_S3_A.wav", audioUrl: "/HLS-CMDS/HS/F_S3_A.wav", soundCatalogRef: "F_S3_A",
    tags: ["b3", "galope", "insuficiencia cardiaca"], refs: { diagnosticos: ["dx-ic"], achados: ["ls-crepitacoes"] } },
  { id: "hs-b4", slug: "b4", nome: "B4 (quarta bulha)", categoria: "heart_sound", version: V, metadata: m,
    descricao: "Som pré-sistólico; ventrículo pouco complacente (HAS/isquemia).",
    tipoOficial: "S4", foco: "LUSB", arquivo: "M_S4_LUSB.wav", audioUrl: "/HLS-CMDS/HS/M_S4_LUSB.wav", soundCatalogRef: "M_S4_LUSB",
    tags: ["b4", "hipertrofia"], refs: { diagnosticos: ["dx-sca"] } },
  { id: "hs-sopro-sistolico", slug: "sopro-sistolico", nome: "Sopro sistólico", categoria: "heart_sound", version: V, metadata: m,
    descricao: "Sopro entre B1 e B2; estenose aórtica, insuficiência mitral ou funcional.",
    tipoOficial: "Mid Systolic Murmur", foco: "Apex", arquivo: "M_MSM_A.wav", audioUrl: "/HLS-CMDS/HS/M_MSM_A.wav", soundCatalogRef: "M_MSM_A",
    tags: ["sopro sistolico", "valvopatia"], refs: { exames: ["ecg-taquicardia-sinusal"] } },
  { id: "hs-sopro-diastolico", slug: "sopro-diastolico", nome: "Sopro diastólico", categoria: "heart_sound", version: V, metadata: m,
    descricao: "Sopro entre B2 e B1; sempre patológico (insuficiência aórtica/estenose mitral).",
    tipoOficial: "Late Diastolic Murmur", foco: "Apex", arquivo: "F_LDM_A.wav", audioUrl: "/HLS-CMDS/HS/F_LDM_A.wav", soundCatalogRef: "F_LDM_A",
    tags: ["sopro diastolico", "valvopatia"], refs: {} },
];

export default HEART_SOUNDS;
