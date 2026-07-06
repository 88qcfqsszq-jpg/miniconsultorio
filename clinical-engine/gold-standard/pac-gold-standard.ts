// ============================================================================
// Clinical Engine — GOLD STANDARD do PAC
// ----------------------------------------------------------------------------
// GABARITO PERFEITO da Pneumonia Adquirida na Comunidade. É GERADO a partir do
// CANONICAL_PAC pelo Gold Standard Engine e, em cima disso, aplica uma CURADORIA
// explícita (listas obrigatórias completas exigidas pela estação de PAC).
//
// Também expõe o registro por canonicalId e o helper de lookup.
// Puro, aditivo, sem IA, sem runtime.
// ============================================================================

import { CANONICAL_PAC } from "../cases/pac";
import { buildGoldStandardFromCanonicalCase, montarSecoes } from "./gold-standard-engine";
import type {
  GoldStandardCase,
  GoldStandardCriticalError,
  GoldStandardDifferential,
  GoldStandardExamRequest,
  GoldStandardTeachingPoint,
  GoldStandardTruthLayers,
} from "./types";

// Base gerada 100% a partir do Caso Canônico PAC.
const base = buildGoldStandardFromCanonicalCase(CANONICAL_PAC);

// ── Curadoria da estação de PAC (listas obrigatórias completas) ──────────────
const ANAMNESE_OBRIGATORIA = [
  "Duração da tosse",
  "Presença de febre",
  "Expectoração (aspecto/cor)",
  "Dispneia",
  "Dor torácica pleurítica",
  "Comorbidades",
  "Tabagismo",
  "Alergias",
  "Uso prévio de antibiótico",
  "Sinais de gravidade",
];

const EXAME_FISICO_OBRIGATORIO = [
  "Sinais vitais completos",
  "SpO₂ (oximetria)",
  "Frequência respiratória",
  "Estado geral",
  "Ausculta pulmonar",
  "Pesquisa de sinais de consolidação (frêmito/percussão/crepitações)",
  "Avaliação cardiovascular básica",
  "Hidratação / perfusão",
];

const EXAMES_OBRIGATORIOS: GoldStandardExamRequest[] = [
  { nome: "Radiografia de tórax PA e perfil", obrigatoriedade: "obrigatorio", resultadoEsperado: "Infiltrado consolidativo (lobo inferior esquerdo).", justificativa: "Confirma o foco pulmonar e avalia extensão/complicações.", categoria: "imagem", ref: "img-rx-torax" },
  { nome: "Hemograma completo", obrigatoriedade: "obrigatorio", resultadoEsperado: "Leucocitose com neutrofilia.", justificativa: "Avalia resposta inflamatória/infecciosa e gravidade.", categoria: "laboratorio", ref: "lab-hemograma" },
  { nome: "Saturação / oximetria de pulso", obrigatoriedade: "obrigatorio", resultadoEsperado: "SpO₂ 92% (hipoxemia limítrofe).", justificativa: "Rastreia hipoxemia e apoia a decisão de gravidade/local de tratamento.", categoria: "procedimento" },
];

const EXAMES_COMPLEMENTARES: GoldStandardExamRequest[] = [
  { nome: "Gasometria arterial", obrigatoriedade: "complementar", resultadoEsperado: "A considerar se hipoxemia/sinais de gravidade.", justificativa: "Quantifica troca gasosa quando há hipoxemia ou gravidade.", categoria: "laboratorio" },
  ...base.exames.complementares, // ex.: procalcitonina (do canônico)
];

const DIFERENCIAIS: GoldStandardDifferential[] = [
  { diagnostico: "Exacerbação de asma", porQueNaoE: "Predomínio seria de sibilos expiratórios difusos, não crepitações focais.", achadosQueDescartam: ["Ausência de sibilos", "Consolidação focal"] },
  { diagnostico: "DPOC (exacerbação)", porQueNaoE: "Sem história de tabagismo pesado/obstrução crônica prévia; quadro agudo febril consolidativo.", achadosQueDescartam: ["Ausência de DPOC prévia", "Consolidação focal com febre"] },
  { diagnostico: "TEP", porQueNaoE: "Sem fator de risco/quadro súbito dominante; há febre e escarro purulento com consolidação.", achadosQueDescartam: ["Febre + escarro purulento", "Consolidação no RX"] },
  { diagnostico: "Insuficiência cardíaca", porQueNaoE: "Crepitações seriam bibasais simétricas com congestão; aqui é focal com febre.", achadosQueDescartam: ["Ausência de turgência jugular/edema", "Febre + neutrofilia"] },
  { diagnostico: "Tuberculose", porQueNaoE: "Quadro agudo (5 dias) e consolidação basal, sem cronicidade/apical.", achadosQueDescartam: ["Evolução aguda", "Localização basal"] },
  { diagnostico: "Bronquite aguda", porQueNaoE: "Não cursa com consolidação no RX.", achadosQueDescartam: ["Infiltrado em RX", "Submacicez/frêmito aumentado"] },
];

const CONDUTA_IDEAL = [
  "Avaliar gravidade (SpO₂, FR, CURB-65)",
  "Definir local de tratamento (ambulatorial vs internação)",
  "Iniciar antibiótico adequado com dose, via e duração",
  "Orientar sinais de alarme",
  "Programar reavaliação em 48–72h",
  "Considerar internação se critérios de gravidade",
];

const ERROS_CRITICOS: GoldStandardCriticalError[] = [
  { id: "err-1", erro: "Não solicitar radiografia de tórax", descricao: "RX é essencial para confirmar a consolidação e avaliar extensão/complicações.", penalidade: 1.5 },
  { id: "err-2", erro: "Prescrever antibiótico inadequado", descricao: "PAC exige cobertura empírica apropriada (ex.: betalactâmico + macrolídeo).", penalidade: 2 },
  { id: "err-3", erro: "Não especificar a dose do antibiótico", descricao: "Prescrever sem dose/via/duração compromete a segurança e a eficácia.", penalidade: 1.5 },
  { id: "err-4", erro: "Ignorar hipoxemia", descricao: "Não medir/valorizar SpO₂ (92%) subestima a gravidade.", penalidade: 1.5 },
  { id: "err-5", erro: "Dar alta sem critérios", descricao: "Alta sem estabilidade clínica/saturação/tolerância oral é insegura.", penalidade: 1.5 },
  { id: "err-6", erro: "Não avaliar sinais vitais", descricao: "Sinais vitais completos (com SpO₂ e FR) são indispensáveis.", penalidade: 1.5 },
];

const PONTOS_DE_ENSINO: GoldStandardTeachingPoint[] = [
  { id: "tp-1", ponto: "Correlacionar febre + tosse + crepitações + RX", perguntaSocratica: "Como a combinação febre + tosse + crepitações + RX fecha o diagnóstico de PAC?" },
  { id: "tp-2", ponto: "Diferenciar consolidação de broncoespasmo", perguntaSocratica: "Quais achados no exame físico apontam para consolidação, e não broncoespasmo?" },
  { id: "tp-3", ponto: "Importância da SpO₂ e da FR", perguntaSocratica: "Como a SpO₂ e a FR mudam a sua conduta e o local de tratamento?" },
  { id: "tp-4", ponto: "Antibiótico com dose", perguntaSocratica: "Qual antibiótico e por quê? Qual a dose, via e duração?" },
  { id: "tp-5", ponto: "Critérios de gravidade", perguntaSocratica: "Que critérios (SpO₂/FR/CURB-65) indicam internação?" },
];

// ── Truth Layers CURADAS do PAC (Fase 13) ────────────────────────────────────
const PAC_TRUTH_LAYERS: GoldStandardTruthLayers = {
  clinical: {
    diagnosticoPrincipal: "Pneumonia Adquirida na Comunidade (PAC)",
    fisiopatologiaEssencial:
      "Inflamação/infecção do parênquima pulmonar com preenchimento alveolar (consolidação), tipicamente bacteriana (S. pneumoniae).",
    diferenciais: DIFERENCIAIS,
    justificativaDiagnostica: [
      "Febre + tosse produtiva + dispneia + dor pleurítica (síndrome clínica típica).",
      "Crepitações focais + frêmito aumentado + submacicez (síndrome consolidativa).",
      "Consolidação no RX + leucocitose com neutrofilia.",
    ],
    achadosClinicosChave: ["Febre", "Tosse produtiva", "Dispneia", "Crepitações focais em base", "Frêmito aumentado / submacicez", "Consolidação no RX"],
    sinaisDeGravidade: ["SpO₂ baixa (< 92%)", "FR elevada (> 24 ipm)", "Confusão mental", "Hipotensão", "Comorbidades descompensadas"],
    condutaClinicaIdeal: CONDUTA_IDEAL,
    tratamento: base.conduta.condutaIdeal,
    criteriosInternacao: base.conduta.criteriosInternacao,
    criteriosAlta: base.conduta.criteriosAlta,
    errosClinicosGraves: ERROS_CRITICOS.map((e) => e.erro),
  },
  educational: {
    objetivosDeAprendizagem: base.objetivosEstacao,
    conceitosEssenciais: [
      "Diferenciar consolidação de broncoespasmo",
      "Correlacionar ausculta + RX + clínica",
      "Importância da SpO₂ e da FR",
      "Antibiótico com dose",
      "CURB-65 como ferramenta de gravidade",
    ],
    sequenciaDidatica: [
      "Reconhecer a síndrome consolidativa nos achados do aluno",
      "Confirmar com RX + hemograma",
      "Avaliar gravidade (SpO₂/FR/CURB-65)",
      "Definir antibiótico com dose e orientar seguimento",
    ],
    pegadinhas: base.feedbackModelo.pegadinhas,
    errosComuns: base.feedbackModelo.errosComuns,
    analogiasPermitidas: ["Consolidação = 'esponja encharcada': transmite melhor o som (frêmito↑, submacicez, crepitações)."],
    pontosDeConfusao: [
      "Crepitações basais também ocorrem em congestão (IC) — correlacionar com febre/consolidação.",
      "RX inicial pode ser pouco evidente na fase precoce.",
      "Leucograma normal não exclui infecção grave.",
    ],
    perguntasParaRaciocinio: base.professor.perguntasSocraticas,
  },
  evaluation: {
    checklistNotaMaxima: base.checklistNotaMaxima,
    criteriosObrigatorios: [
      "Pedir RX de tórax",
      "Medir SpO₂",
      "Auscultar o pulmão",
      "Diagnosticar PAC",
      "Prescrever antibiótico adequado com dose",
      "Orientar sinais de alarme",
      "Programar reavaliação",
    ],
    criteriosCriticos: base.checklistNotaMaxima.filter((c) => c.critico).map((c) => c.item),
    microcriteriosPorEixo: CANONICAL_PAC.rubrica.microcriteriosPorEixo ?? {},
    pesos: CANONICAL_PAC.rubrica.rubricaCorrecao.map((r) => ({ criterio: r.criterio, peso: r.peso, pontuacaoMaxima: r.pontuacaoMaxima })),
    errosCriticos: ERROS_CRITICOS,
    eixosHealthBench: ["comunicacao", "anamnese", "exameFisico", "examesComplementares", "raciocinioDiagnostico", "condutaSeguranca"],
    criteriosQueReprovam: ERROS_CRITICOS.map((e) => e.erro),
    objetivosAvaliaveis: base.objetivosEstacao,
  },
  teaching: {
    objetivosDoProfessor: base.professor.objetivos,
    perguntasSocraticas: base.professor.perguntasSocraticas,
    miniAulas: [CANONICAL_PAC.professorIA.miniAulaSugerida],
    modoSeErroCritico: "reforco_de_erro_critico: corrigir o antibiótico sem dose / hipoxemia ignorada ANTES de qualquer aula longa; explicar o risco à segurança.",
    modoSeNotaAlta: "revisao_rapida: valorizar o raciocínio correto e apontar 1 refinamento (ex.: precisar dose/duração do antibiótico).",
    feedbackEsperado: base.feedbackModelo.respostaModelo,
    planoDeTreino: base.professor.planoDeTreino,
    miniQuiz: [
      { pergunta: "Por que prescrever antibiótico sem dose é inseguro?", resposta: "Sem dose/via/duração não há como garantir eficácia nem segurança (sub ou superdosagem); a prescrição fica incompleta e não executável." },
      { pergunta: "Por que o RX de tórax muda a conduta na suspeita de PAC?", resposta: "Confirma a consolidação, avalia extensão e complicações (derrame) e sustenta a indicação de antibiótico." },
      { pergunta: "Por que asma não explica uma consolidação focal?", resposta: "Asma cursa com broncoespasmo difuso (sibilos), não com consolidação focal com frêmito aumentado/submacicez." },
      { pergunta: "Por que o TEP pode ter RX de tórax normal?", resposta: "No TEP o RX é frequentemente normal ou inespecífico; o diagnóstico depende de probabilidade clínica e angio-TC, não da consolidação." },
      { pergunta: "Qual escore avalia a gravidade e o local de tratamento da PAC?", resposta: "CURB-65 (confusão, ureia, FR, PA, idade ≥ 65)." },
    ],
    explicacoesCurtas: [
      "Antibiótico sem dose é inseguro (prescrição incompleta/não executável).",
      "RX muda a conduta (confirma consolidação e sustenta o antibiótico).",
      "Asma não explica consolidação focal (é broncoespasmo difuso).",
      "TEP pode ter RX normal (diagnóstico por probabilidade + angio-TC).",
    ],
    explicacoesAprofundadas: [CANONICAL_PAC.professorIA.miniAulaSugerida],
  },
  resource: {
    centroClinico: base.recursos.centroClinico,
    knowledgeGraph: base.recursos.knowledgeGraph,
    sons: ["ls-crepitacoes"],
    imagens: ["img-rx-torax"],
    exames: ["lab-hemograma"],
    fluxos: ["flow-febre", "flow-dispneia"],
    guidelines: ["guide-pneumonia"],
    scores: ["score-curb65"],
    farmacos: ["drug-amoxicilina"],
    referencias: ["ref-open-i", "ref-hls-cmds"],
  },
};

// ── Gold Standard PAC final (base do engine + curadoria da estação) ──────────
export const PAC_GOLD_STANDARD: GoldStandardCase = (() => {
  const gs: GoldStandardCase = {
    ...base,
    anamnese: { ...base.anamnese, obrigatoria: ANAMNESE_OBRIGATORIA },
    exameFisico: { ...base.exameFisico, obrigatorio: EXAME_FISICO_OBRIGATORIO },
    exames: { obrigatorios: EXAMES_OBRIGATORIOS, complementares: EXAMES_COMPLEMENTARES },
    diagnostico: { ...base.diagnostico, diferenciais: DIFERENCIAIS },
    conduta: { ...base.conduta, condutaIdeal: CONDUTA_IDEAL },
    errosCriticos: ERROS_CRITICOS,
    pontosDeEnsino: PONTOS_DE_ENSINO,
    truthLayers: PAC_TRUTH_LAYERS,
  };
  gs.secoes = montarSecoes(gs);
  return gs;
})();

// ── Registro por canonicalId + helper de lookup ──────────────────────────────
export const GOLD_STANDARD_REGISTRY: Record<string, GoldStandardCase> = {
  [PAC_GOLD_STANDARD.geradoDe.canonicalId]: PAC_GOLD_STANDARD,
};

/** Retorna o Gold Standard de um caso pelo canonicalId (ex.: "pac"). */
export function getGoldStandardByCanonicalId(canonicalId: string): GoldStandardCase | undefined {
  return GOLD_STANDARD_REGISTRY[canonicalId];
}

export default PAC_GOLD_STANDARD;
