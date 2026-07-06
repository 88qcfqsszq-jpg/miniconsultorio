// Knowledge — Escores clínicos (seed aditivo).
import { KNOWLEDGE_SCHEMA_VERSION, type KnowledgeScore } from "../types/knowledge";
const V = KNOWLEDGE_SCHEMA_VERSION; const m = { curadoria: "curado" as const };

export const SCORES: KnowledgeScore[] = [
  { id: "score-curb65", slug: "curb-65", nome: "CURB-65", categoria: "score", version: V, metadata: m,
    descricao: "Gravidade da pneumonia adquirida na comunidade e decisão de local de tratamento.",
    variaveis: ["Confusão", "Ureia", "FR ≥ 30", "PA baixa", "Idade ≥ 65"], interpretacao: "Quanto maior, maior a gravidade/indicação de internação.",
    tags: ["curb-65", "pneumonia", "gravidade"], refs: { diagnosticos: ["dx-pneumonia"], guidelines: ["guide-pneumonia"] } },
  { id: "score-wells", slug: "wells", nome: "Escore de Wells (TEP)", categoria: "score", version: V, metadata: m,
    descricao: "Probabilidade pré-teste de TEP; orienta uso de D-dímero vs angio-TC.",
    variaveis: ["Sinais de TVP", "TEP mais provável", "FC > 100", "Imobilização/cirurgia", "TEP/TVP prévios", "Hemoptise", "Câncer"],
    interpretacao: "Baixa/intermediária → D-dímero; alta → angio-TC.", tags: ["wells", "tep"],
    refs: { diagnosticos: ["dx-tep"], exames: ["lab-ddimero", "img-tc-torax"] } },
  { id: "score-killip", slug: "killip", nome: "Classificação de Killip", categoria: "score", version: V, metadata: m,
    descricao: "Gravidade da IC no contexto do IAM.", variaveis: ["Sem IC", "Estertores/B3", "Edema agudo", "Choque cardiogênico"],
    interpretacao: "Maior classe → pior prognóstico.", tags: ["killip", "iam", "ic"], refs: { diagnosticos: ["dx-sca", "dx-ic"] } },
  { id: "score-news2", slug: "news2", nome: "NEWS2", categoria: "score", version: V, metadata: m,
    descricao: "Escore de alerta precoce por sinais vitais; deterioração clínica.",
    variaveis: ["FR", "SpO₂", "PA", "FC", "Consciência", "Temperatura"], interpretacao: "Escores altos indicam risco de deterioração.",
    tags: ["news2", "deterioracao"], refs: { sintomas: ["sym-dispneia"] } },
  { id: "score-qsofa", slug: "qsofa", nome: "qSOFA", categoria: "score", version: V, metadata: m,
    descricao: "Triagem rápida de risco em suspeita de sepse.", variaveis: ["FR ≥ 22", "Alteração mental", "PAS ≤ 100"],
    interpretacao: "≥ 2 sugere maior risco na sepse.", tags: ["qsofa", "sepse"], refs: { sintomas: ["sym-febre"] } },
];
export default SCORES;
