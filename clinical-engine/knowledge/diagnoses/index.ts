// Knowledge — Diagnósticos (seed aditivo). Cruzam com casos canônicos (futureRefs).
import { KNOWLEDGE_SCHEMA_VERSION, type KnowledgeDiagnosis } from "../types/knowledge";
const V = KNOWLEDGE_SCHEMA_VERSION;
const mm = (canon: string) => ({ curadoria: "curado" as const, futureRefs: { casosCanonicos: [canon] } });

export const DIAGNOSES: KnowledgeDiagnosis[] = [
  { id: "dx-pneumonia", slug: "pneumonia", nome: "Pneumonia adquirida na comunidade", categoria: "diagnosis", sistema: "respiratorio", sindrome: "Consolidativa", version: V, metadata: mm("pac"),
    descricao: "Infecção do parênquima pulmonar; tosse produtiva, febre, dispneia, crepitações.",
    criterios: ["Tosse produtiva + febre", "Crepitações/consolidação", "Infiltrado no RX"], tags: ["pneumonia", "respiratorio"],
    refs: { sintomas: ["sym-tosse", "sym-febre", "sym-dispneia"], achados: ["ls-crepitacoes", "pf-submacicez"], imagens: ["img-rx-torax"], exames: ["lab-hemograma"], guidelines: ["guide-pneumonia"], scores: ["score-curb65"], fluxos: ["flow-dispneia", "flow-febre"] } },
  { id: "dx-asma", slug: "asma", nome: "Asma aguda", categoria: "diagnosis", sistema: "respiratorio", sindrome: "Obstrutiva reversível", version: V, metadata: mm("asma"),
    descricao: "Broncoespasmo reversível; sibilância expiratória difusa.",
    criterios: ["Sibilância difusa", "História de asma", "Reversibilidade"], tags: ["asma", "broncoespasmo"],
    refs: { sintomas: ["sym-dispneia"], achados: ["ls-sibilos"], guidelines: ["guide-asma"], fluxos: ["flow-dispneia"] } },
  { id: "dx-dpoc", slug: "dpoc", nome: "DPOC exacerbado", categoria: "diagnosis", sistema: "respiratorio", sindrome: "Obstrutiva crônica", version: V, metadata: mm("dpoc"),
    descricao: "Obstrução crônica exacerbada em tabagista; sibilos/roncos, risco de hipercapnia.",
    criterios: ["Tabagismo + piora da dispneia/escarro", "Sibilos/roncos", "Hipoxemia"], tags: ["dpoc"],
    refs: { sintomas: ["sym-dispneia", "sym-tosse"], achados: ["ls-sibilos", "ls-roncos"], exames: ["lab-gasometria"], guidelines: ["guide-dpoc"], fluxos: ["flow-dispneia"] } },
  { id: "dx-ic", slug: "insuficiencia-cardiaca", nome: "Insuficiência cardíaca (congestão)", categoria: "diagnosis", sistema: "cardiovascular", sindrome: "Congestão", version: V, metadata: mm("insuficiencia-cardiaca"),
    descricao: "Síndrome de congestão; ortopneia/DPN, B3, crepitações bibasais, turgência, edema.",
    criterios: ["Ortopneia/DPN", "B3 + crepitações bibasais", "FEVE reduzida ao eco"], tags: ["ic", "congestao"],
    refs: { sintomas: ["sym-dispneia"], achados: ["hs-b3", "ls-crepitacoes", "pf-turgencia-jugular", "pf-edema-mmii"], imagens: ["img-rx-torax"], guidelines: ["guide-ic"], fluxos: ["flow-dispneia"] } },
  { id: "dx-sca", slug: "sindrome-coronariana", nome: "Síndrome coronariana aguda (IAMCSST)", categoria: "diagnosis", sistema: "cardiovascular", sindrome: "Isquemia miocárdica", version: V, metadata: mm("sindrome-coronariana"),
    descricao: "Isquemia miocárdica aguda com supra de ST; reperfusão urgente.",
    criterios: ["Dor opressiva em repouso", "Supra de ST", "Troponina elevada"], tags: ["sca", "iam"],
    refs: { sintomas: ["sym-dor-toracica"], exames: ["ecg-supra-st", "lab-troponina"], guidelines: ["guide-sca"], fluxos: ["flow-dor-toracica"] } },
  { id: "dx-tep", slug: "tep", nome: "Tromboembolismo pulmonar", categoria: "diagnosis", sistema: "respiratorio", sindrome: "Tromboembolia", version: V, metadata: mm("tep"),
    descricao: "Dispneia/dor pleurítica súbita + fatores de risco; ausculta/RX podem ser normais.",
    criterios: ["Início súbito + fator de risco", "Taquicardia/hipoxemia", "Angio-TC com falha de enchimento"], tags: ["tep"],
    refs: { sintomas: ["sym-dispneia", "sym-dor-toracica", "sym-hemoptise"], exames: ["lab-ddimero", "ecg-s1q3t3"], imagens: ["img-tc-torax"], scores: ["score-wells"], guidelines: ["guide-tep"], fluxos: ["flow-dispneia", "flow-dor-toracica"] } },
  { id: "dx-edema-pulmonar", slug: "edema-pulmonar", nome: "Edema agudo de pulmão", categoria: "diagnosis", sistema: "cardiovascular", sindrome: "Congestão", version: V, metadata: { curadoria: "curado" },
    descricao: "Congestão pulmonar aguda; crepitações bibasais, padrão peri-hilar no RX.",
    criterios: ["Crepitações bibasais", "Congestão no RX", "Contexto cardíaco"], tags: ["edema pulmonar", "congestao"],
    refs: { achados: ["ls-crepitacoes"], imagens: ["img-rx-torax"], diagnosticos: ["dx-ic"] } },
];
export default DIAGNOSES;
