// Knowledge — Sintomas (seed). Aditivo, sem runtime.
import { KNOWLEDGE_SCHEMA_VERSION, type KnowledgeSymptom } from "../types/knowledge";

const V = KNOWLEDGE_SCHEMA_VERSION;
const m = { curadoria: "curado" as const };

export const SYMPTOMS: KnowledgeSymptom[] = [
  { id: "sym-febre", slug: "febre", nome: "Febre", categoria: "symptom", version: V, metadata: m,
    descricao: "Elevação da temperatura corporal; marcador de resposta inflamatória/infecciosa.",
    sistemas: ["infectologia", "geral"], tags: ["febre", "infeccao", "sirs"],
    refs: { diagnosticos: ["dx-pneumonia"], fluxos: ["flow-febre"], exames: ["lab-hemograma"] } },
  { id: "sym-tosse", slug: "tosse", nome: "Tosse", categoria: "symptom", version: V, metadata: m,
    descricao: "Mecanismo de defesa das vias aéreas; caracterizar seca vs produtiva.",
    sistemas: ["respiratorio"], tags: ["tosse", "respiratorio"],
    refs: { diagnosticos: ["dx-pneumonia", "dx-dpoc"], achados: ["ls-crepitacoes"] } },
  { id: "sym-dispneia", slug: "dispneia", nome: "Dispneia", categoria: "symptom", version: V, metadata: m, redFlag: true,
    descricao: "Sensação subjetiva de falta de ar; avaliar gravidade (SpO₂, FR, esforço).",
    sistemas: ["respiratorio", "cardiovascular"], tags: ["dispneia", "falta de ar", "gravidade"],
    refs: { fluxos: ["flow-dispneia"], diagnosticos: ["dx-asma", "dx-dpoc", "dx-ic", "dx-tep", "dx-pneumonia"] } },
  { id: "sym-dor-toracica", slug: "dor-toracica", nome: "Dor torácica", categoria: "symptom", version: V, metadata: m, redFlag: true,
    descricao: "Sintoma de alto risco; diferenciar isquêmica, pleurítica, mecânica e outras.",
    sistemas: ["cardiovascular", "respiratorio"], tags: ["dor toracica", "red flag"],
    refs: { fluxos: ["flow-dor-toracica"], diagnosticos: ["dx-sca", "dx-tep"], exames: ["ecg-supra-st", "lab-troponina"] } },
  { id: "sym-palpitacoes", slug: "palpitacoes", nome: "Palpitações", categoria: "symptom", version: V, metadata: m,
    descricao: "Percepção incômoda dos batimentos; investigar arritmias.",
    sistemas: ["cardiovascular"], tags: ["palpitacoes", "arritmia"], refs: { ecg: ["ecg-taquicardia-sinusal"] } },
  { id: "sym-sincope", slug: "sincope", nome: "Síncope", categoria: "symptom", version: V, metadata: m, redFlag: true,
    descricao: "Perda transitória de consciência por hipoperfusão cerebral; estratificar risco.",
    sistemas: ["cardiovascular", "neurologico"], tags: ["sincope", "red flag"],
    refs: { exames: ["ecg-supra-st"], diagnosticos: ["dx-tep", "dx-sca"] } },
  { id: "sym-hemoptise", slug: "hemoptise", nome: "Hemoptise", categoria: "symptom", version: V, metadata: m, redFlag: true,
    descricao: "Eliminação de sangue pelas vias aéreas; alerta para causas graves.",
    sistemas: ["respiratorio"], tags: ["hemoptise", "red flag"],
    refs: { diagnosticos: ["dx-tep", "dx-pneumonia"], imagens: ["img-tc-torax"] } },
];

export default SYMPTOMS;
