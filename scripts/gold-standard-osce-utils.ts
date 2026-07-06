// ============================================================================
// Gold Standard OSCE Validator — utilitários (AUDITORIA, não altera produção)
// ----------------------------------------------------------------------------
// Importa (sem modificar) funções reais de produção para:
//  1) extrair a rubrica interna de cada caso (os critérios que viram cards);
//  2) gerar uma "consulta perfeita" sintética (grader ideal + contexto rico);
//  3) rodar pelo MESMO builder real de cards (construirFeedbackViewDeHealthBench);
//  4) classificar a causa provável quando um card não fecha o peso.
//
// Fronteira da auditoria: o grader IA (OpenAI) é SUBSTITUÍDO por um "grader
// ideal" (todos os critérios positivos cumpridos, nenhum negativo ativado).
// Assim, testamos a MONTAGEM dos cards (partição de eixo, scoring, recalibração
// das rubricas específicas) assumindo reconhecimento perfeito — sem custo nem
// não-determinismo do LLM. NÃO testa o NLP do grader em si.
// ============================================================================

import { adaptarRubricaDoCaso } from "../lib/healthbench/rubric-adapter";
import { construirFeedbackViewDeHealthBench } from "../lib/healthbench/feedback-view-builder";
import { CARDS_CONFIG } from "../lib/healthbench/cards-config";
import type { Caso } from "../lib/types";
import type {
  HealthBenchRubricItem,
  HealthBenchEvaluationResult,
  HealthBenchCriterionGrade,
} from "../lib/healthbench/types";

export interface GoldStandardCard {
  cardId: string;
  titulo: string;
  peso: number;
  criteriosPositivos: string[];
  criteriosNegativos: string[];
  penalidadesCriticas: string[];
}

export interface GoldStandardRubric {
  casoId: string;
  diagnostico: string;
  cards: GoldStandardCard[];
  itens: HealthBenchRubricItem[];
}

const AXIS_NOME: Record<string, string> = {
  "axis:comunicacao": "Comunicação e postura médica",
  "axis:anamnese": "Anamnese dirigida",
  "axis:exame_fisico": "Exame físico",
  "axis:exames_complementares": "Exames complementares",
  "axis:raciocinio_clinico": "Raciocínio diagnóstico",
  "axis:conduta_seguranca": "Conduta e Segurança",
};

function axisDoItem(tags: string[]): string {
  // mesma prioridade do builder: conduta/segurança primeiro
  const t = tags || [];
  if (t.some((x) => /conduta|seguranca/.test(x))) return "axis:conduta_seguranca";
  for (const ax of [
    "axis:comunicacao",
    "axis:anamnese",
    "axis:exame_fisico",
    "axis:exames_complementares",
    "axis:raciocinio_clinico",
  ]) {
    if (t.includes(ax)) return ax;
  }
  return "axis:raciocinio_clinico";
}

// TAREFA 1 — extrair a rubrica interna do caso, separando positivo de negativo.
export function extrairRubricaDoCaso(caso: Caso): GoldStandardRubric {
  const itens = adaptarRubricaDoCaso(caso);
  const porCard = new Map<string, GoldStandardCard>();
  for (const cfg of CARDS_CONFIG) {
    porCard.set(cfg.axis, {
      cardId: cfg.axis,
      titulo: cfg.nome,
      peso: cfg.pesoVisual,
      criteriosPositivos: [],
      criteriosNegativos: [],
      penalidadesCriticas: [],
    });
  }
  for (const item of itens) {
    const ax = axisDoItem(item.tags);
    const card = porCard.get(ax) ?? porCard.get("axis:raciocinio_clinico")!;
    if (item.type === "negative" || item.points < 0) {
      card.criteriosNegativos.push(item.criterion);
      if (item.critical) card.penalidadesCriticas.push(item.criterion);
    } else {
      card.criteriosPositivos.push(item.criterion);
    }
  }
  return {
    casoId: String((caso as any).id),
    diagnostico:
      (caso as any)?.dados_ocultos_do_sistema?.diagnostico_principal ||
      (caso as any)?.titulo ||
      "",
    cards: CARDS_CONFIG.map((c) => porCard.get(c.axis)!),
    itens,
  };
}

// Léxico clínico amplo para que a "consulta perfeita" verbalize termos que os
// recalibradores específicos (PAC, SCA) detectam por regex.
const LEXICO_PERFEITO = [
  "bom dia sou o dr vou te atender como voce esta",
  "voce esta com uma infeccao pulmonar pneumonia em linguagem acessivel",
  "apresentou-se postura acolhedora explicou hipotese orientou tratamento e reavaliacao",
  "fique atento a sinais de piora falta de ar intensa escarro com sangue procure a emergencia se piorar",
  // anamnese geral
  "ha quanto tempo inicio duracao evolucao febre tosse com escarro catarro dispneia dor toracica pleuritica",
  "sudorese noturna febre vespertina perda de peso hemoptise contato com tuberculose tb",
  "dor no peito em aperto retroesternal irradia braco esquerdo mandibula piora ao esforco sudorese nausea",
  "fatores de risco hipertensao diabetes tabagismo dislipidemia infarto previo idade comorbidades imunossupressao hiv",
  "alergias medicacoes em uso antibiotico previo tratamento previo abandono",
  // exame físico
  "sinais vitais completos pa fc fr temperatura spo2 saturacao estado geral perfusao hidratacao consciencia",
  "ausculta pulmonar anterior e posterior crepitacoes sibilos roncos murmurio reduzido expansibilidade fremito percussao macicez",
  "ausculta cardiaca bulhas ritmo sopro b3 ictus cordis turgencia jugular pulsos edema linfonodos",
  // exames
  "radiografia de torax opacidade consolidacao ecg 12 derivacoes supra de st troponina enzimas cardiacas",
  "hemograma leucograma leucocitose pcr funcao renal eletrolitos gasometria baciloscopia cultura de escarro teste rapido molecular trm-tb tcr-tb d-dimero angiotc ecocardiograma bnp",
  "interpretou exames de forma coerente leucocitose opacidade isquemia",
  // raciocínio
  "hipotese principal pneumonia sca infarto tuberculose insuficiencia cardiaca asma dpoc tep pneumotorax dengue",
  "relacionou sintomas exame fisico exames imagem diferenciais gravidade risco local de tratamento",
  "diagnosticos diferenciais tuberculose virose dengue tep disseccao pericardite pneumotorax",
  // conduta
  "encaminhar emergencia monitorizar internacao observacao acesso venoso nao liberar",
  "antibiotico amoxicilina com clavulanato 875/125 12/12h por 7 dias dose duracao hidratacao dipirona antitermico suporte",
  "aas antiagregacao heparina anticoagulacao nitrato analgesia oxigenio se hipoxemia ecg e troponina seriados",
  "mascara etiqueta respiratoria isolamento ripe notificacao vigilancia investigacao de contatos adesao retorno",
  "diuretico terapia descongestiva broncodilatador corticoide",
];

// TAREFA 2 — consulta perfeita: hb sintético "grader ideal" + contexto rico.
export interface ConsultaPerfeita {
  hb: HealthBenchEvaluationResult;
  ctx: any;
}

export function gerarConsultaPerfeitaDoCaso(
  caso: Caso,
  rubrica: GoldStandardRubric
): ConsultaPerfeita {
  // grader ideal: positivos cumpridos, negativos NÃO cometidos
  const grades: HealthBenchCriterionGrade[] = rubrica.itens.map((item) => ({
    criterion: item.criterion,
    criteria_met: item.type === "negative" || item.points < 0 ? false : true,
    points: item.points,
    tags: item.tags,
    type: item.type,
    explanation: "",
  })) as any;

  const hb: HealthBenchEvaluationResult = {
    casoId: Number((caso as any).id) || 0,
    score01: 1,
    notaFinal: 20,
    pontuacaoMaxima: 20,
    passed: true,
    grades,
    competencyScores: {},
    themeScores: {},
    criticalErrors: [],
    professorFeedback: "Consulta perfeita sintética.",
    nextTrainingFocus: [],
    disclaimer: "avaliação educacional simulada (gold standard)",
  };

  // contexto perfeito (lido pelas rubricas específicas/consistência)
  const positivos = rubrica.cards.flatMap((c) => c.criteriosPositivos).join(" . ");
  const textoRico = `${positivos} . ${LEXICO_PERFEITO.join(" . ")}`;
  const diferenciais =
    (caso as any)?.dados_ocultos_do_sistema?.diagnosticos_diferenciais ?? [];

  const ctx = {
    diagnosticoInformado:
      (caso as any)?.dados_ocultos_do_sistema?.diagnostico_principal || "",
    tempoAtendimento: 600,
    sinaisVitais: {
      solicitado: true,
      dados: {
        pressaoArterial: "120/80",
        frequenciaCardiaca: 96,
        frequenciaRespiratoria: 22,
        temperatura: 37.8,
        saturacaoOxigenio: 95,
        glicemia: 99,
      },
    },
    condutaTexto: textoRico,
    examesTexto: textoRico,
    anamneseTexto: textoRico,
    correlacaoTexto: textoRico,
    achadosTexto: textoRico,
    diferenciaisInformados: diferenciais,
  };

  return { hb, ctx };
}

// TAREFA 3 — rodar pelo builder real
export interface ResultadoCard {
  titulo: string;
  pontosObtidos: number;
  peso: number;
  criteriosPresentesNaConsulta: string[];
  criteriosNaoReconhecidos: string[];
  possivelCausa: string;
}

export interface ResultadoCaso {
  casoId: string;
  diagnosticoEsperado: string;
  notaObtida: number;
  aprovado: boolean;
  cards: ResultadoCard[];
}

// TAREFA 5 — classificar causa provável
export function classificarCausa(
  card: ResultadoCard,
  temRubricaEspecifica: boolean
): string {
  if (card.peso === 0) return "n/a";
  if (card.pontosObtidos === 0 && card.criteriosPresentesNaConsulta.length > 0)
    return "scoring_bug (card com critérios e 0 ponto)";
  if (card.criteriosPresentesNaConsulta.length === 0)
    return "rubric_gap (card sem critério positivo na rubrica do caso)";
  if (card.pontosObtidos < card.peso) {
    if (temRubricaEspecifica)
      return "normalization_missing/alias_missing (rubrica específica não reconheceu termo no contexto)";
    return "wrong_card_axis/normalization_missing (critério reconhecido não somou ao peso)";
  }
  return "ok";
}

export function avaliarCasoGold(caso: Caso): ResultadoCaso {
  const rubrica = extrairRubricaDoCaso(caso);
  const { hb, ctx } = gerarConsultaPerfeitaDoCaso(caso, rubrica);
  const fb: any = construirFeedbackViewDeHealthBench(hb as any, caso as any, ctx);
  const nota = Number(fb.nota) || 0;

  const diag = (rubrica.diagnostico || "").toLowerCase();
  const temRubricaEspecifica = /pneumonia|\bpac\b|sca|infarto|dor toracica|angina|coronarian|iam/.test(diag);

  const cards: ResultadoCard[] = (fb.rubricaAvaliacao || []).map((c: any) => {
    const goldCard = rubrica.cards.find(
      (g) => g.titulo.toLowerCase() === String(c.nome).toLowerCase()
    );
    const presentes = goldCard?.criteriosPositivos ?? [];
    const naoReconhecidos = (c.melhorias || []).filter(
      (m: string) => m !== "Nenhuma pendência identificada."
    );
    const card: ResultadoCard = {
      titulo: c.nome,
      pontosObtidos: c.pontosObtidos,
      peso: c.pontosMaximos,
      criteriosPresentesNaConsulta: presentes,
      criteriosNaoReconhecidos: naoReconhecidos,
      possivelCausa: "",
    };
    card.possivelCausa = classificarCausa(card, temRubricaEspecifica);
    return card;
  });

  return {
    casoId: rubrica.casoId,
    diagnosticoEsperado: rubrica.diagnostico,
    notaObtida: Math.round(nota * 10) / 10,
    aprovado: nota >= 19.5,
    cards,
  };
}
