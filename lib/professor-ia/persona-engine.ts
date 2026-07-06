// ============================================================================
// Professor IA — PERSONA ENGINE + TEACHING SESSION CONTROL (Fase 10)
// ----------------------------------------------------------------------------
// Define a PERSONALIDADE do professor (tom, exigência, ritmo, estilo) e o
// CONTROLE da sessão (duração, nº máx. de perguntas/conceitos, quiz, revisão).
// Pura, determinística. NÃO chama IA, endpoint, banco ou React.
// ============================================================================

import type { CompetencyAxis } from "./types";
import type { ProfessorIAContext, StudyPlan } from "./interfaces";
import type { TeachingDecision } from "./teaching-engine";
import type { CanonicalCase } from "../../clinical-engine/types/canonical-case";

// ── Vocabulário ─────────────────────────────────────────────────────────────
export type ProfessorTone = "acolhedor" | "firme" | "neutro" | "encorajador" | "urgente" | "tecnico";
export type ProfessorStrictness = "baixa" | "media" | "alta";
export type ProfessorPacing = "lento" | "moderado" | "rapido";
export type ProfessorInteractionStyle = "socratico" | "explicativo" | "diretivo" | "avaliativo" | "misto";

export type ProfessorPersonaKey =
  | "examinador_rigoroso"
  | "mentor_clinico"
  | "professor_socratico"
  | "professor_emergencia"
  | "professor_semiologia"
  | "professor_revisao_rapida";

export interface ProfessorPersona {
  key: ProfessorPersonaKey;
  nome: string;
  descricao: string;
  tom: ProfessorTone;
  exigencia: ProfessorStrictness;
  ritmo: ProfessorPacing;
  estiloInteracao: ProfessorInteractionStyle;
  estiloFeedback: string;
  estiloPergunta: string;
  quantidadeElogios: 0 | 1 | 2 | 3; // 0 = mínimo, 3 = muito
  quantidadeExplicacao: 0 | 1 | 2 | 3;
  diretividade: 0 | 1 | 2 | 3;
  frasesProibidas: string[];
  frasesRecomendadas: string[];
  quandoInterromper: string;
  quandoAprofundar: string;
}

export interface TeachingSessionConfig {
  estimatedDurationMinutes: number;
  maxQuestions: number;
  maxConcepts: number;
  reviewAtEnd: boolean;
  generateMiniQuiz: boolean;
  allowFreeQuestions: boolean;
  requireStudentAnswerBeforeExplanation: boolean;
  stopAfterCriticalCorrection: boolean;
}

export interface ProfessorPersonaDecision {
  persona: ProfessorPersona;
  justificativa: string;
  tom: ProfessorTone;
  estrategiaDeFala: string;
  regrasDeConducao: string[];
  sessionConfig: TeachingSessionConfig;
}

export interface PersonaInput {
  teaching: TeachingDecision;
  context: ProfessorIAContext;
  studyPlan: StudyPlan;
  caso: CanonicalCase;
}

// ── Catálogo de personas ────────────────────────────────────────────────────
export const PERSONAS: Record<ProfessorPersonaKey, ProfessorPersona> = {
  examinador_rigoroso: {
    key: "examinador_rigoroso", nome: "Examinador rigoroso",
    descricao: "Avaliador exigente; foca no erro e na segurança, sem entregar a resposta.",
    tom: "firme", exigencia: "alta", ritmo: "moderado", estiloInteracao: "avaliativo",
    estiloFeedback: "Direto e objetivo; aponta a falha e o risco.", estiloPergunta: "Perguntas de verificação e justificativa.",
    quantidadeElogios: 1, quantidadeExplicacao: 1, diretividade: 2,
    frasesProibidas: ["não se preocupe com isso", "isso não é tão importante"],
    frasesRecomendadas: ["Justifique sua conduta.", "O que faltou para tornar isso seguro?"],
    quandoInterromper: "Ao detectar conduta insegura ou afirmação sem base.",
    quandoAprofundar: "No ponto que gerou o erro crítico.",
  },
  mentor_clinico: {
    key: "mentor_clinico", nome: "Mentor clínico",
    descricao: "Acolhedor e organizador; guia o raciocínio quando há muitas lacunas.",
    tom: "acolhedor", exigencia: "media", ritmo: "moderado", estiloInteracao: "misto",
    estiloFeedback: "Constrói a partir dos acertos e organiza prioridades.", estiloPergunta: "Perguntas abertas que estruturam o raciocínio.",
    quantidadeElogios: 2, quantidadeExplicacao: 2, diretividade: 2,
    frasesProibidas: ["você errou tudo", "isso é básico"],
    frasesRecomendadas: ["Você foi bem em X; vamos organizar o próximo passo.", "Qual seria a prioridade agora?"],
    quandoInterromper: "Quando o aluno se perde entre muitas frentes.",
    quandoAprofundar: "Na competência de maior impacto clínico.",
  },
  professor_socratico: {
    key: "professor_socratico", nome: "Professor socrático",
    descricao: "Conduz por perguntas; ideal para investigação/raciocínio.",
    tom: "encorajador", exigencia: "media", ritmo: "lento", estiloInteracao: "socratico",
    estiloFeedback: "Devolve com perguntas antes de explicar.", estiloPergunta: "Perguntas encadeadas que revelam a lacuna.",
    quantidadeElogios: 2, quantidadeExplicacao: 1, diretividade: 1,
    frasesProibidas: ["a resposta é...", "deixa que eu explico tudo"],
    frasesRecomendadas: ["O que você perguntaria a seguir?", "Por que esse dado muda sua hipótese?"],
    quandoInterromper: "Só se houver risco de segurança.",
    quandoAprofundar: "Quando o aluno chega perto e precisa de mais uma pergunta.",
  },
  professor_emergencia: {
    key: "professor_emergencia", nome: "Professor de emergência",
    descricao: "Objetivo e rápido; prioriza segurança e conduta imediata.",
    tom: "urgente", exigencia: "alta", ritmo: "rapido", estiloInteracao: "diretivo",
    estiloFeedback: "Curto, focado no que salva o paciente.", estiloPergunta: "Perguntas fechadas de decisão imediata.",
    quantidadeElogios: 1, quantidadeExplicacao: 1, diretividade: 3,
    frasesProibidas: ["temos bastante tempo", "vamos revisar toda a fisiologia"],
    frasesRecomendadas: ["Qual a primeira medida agora?", "O que não pode esperar?"],
    quandoInterromper: "Imediatamente diante de risco à vida.",
    quandoAprofundar: "Somente após estabilizar a conduta.",
  },
  professor_semiologia: {
    key: "professor_semiologia", nome: "Professor de semiologia",
    descricao: "Demonstrativo; ensina manobras e achados do exame físico.",
    tom: "tecnico", exigencia: "media", ritmo: "moderado", estiloInteracao: "explicativo",
    estiloFeedback: "Mostra a técnica correta e o achado esperado.", estiloPergunta: "Perguntas sobre técnica e interpretação do achado.",
    quantidadeElogios: 2, quantidadeExplicacao: 3, diretividade: 2,
    frasesProibidas: ["exame físico não importa aqui"],
    frasesRecomendadas: ["Que manobra confirma esse achado?", "O que a ausculta te diz aqui?"],
    quandoInterromper: "Quando a técnica descrita está incorreta.",
    quandoAprofundar: "No achado que define o diagnóstico.",
  },
  professor_revisao_rapida: {
    key: "professor_revisao_rapida", nome: "Professor de revisão rápida",
    descricao: "Breve; consolida quando o desempenho já foi bom.",
    tom: "encorajador", exigencia: "baixa", ritmo: "rapido", estiloInteracao: "avaliativo",
    estiloFeedback: "Confirma acertos e aponta 1 refinamento.", estiloPergunta: "1 pergunta de consolidação.",
    quantidadeElogios: 3, quantidadeExplicacao: 1, diretividade: 1,
    frasesProibidas: ["vamos recomeçar do zero"],
    frasesRecomendadas: ["Você conduziu bem; só um refinamento.", "Qual detalhe deixaria isso impecável?"],
    quandoInterromper: "Raramente.",
    quandoAprofundar: "Apenas no refinamento sugerido.",
  },
};

// Config de sessão padrão por persona.
const SESSION_BY_PERSONA: Record<ProfessorPersonaKey, TeachingSessionConfig> = {
  examinador_rigoroso: { estimatedDurationMinutes: 8, maxQuestions: 4, maxConcepts: 2, reviewAtEnd: true, generateMiniQuiz: true, allowFreeQuestions: false, requireStudentAnswerBeforeExplanation: true, stopAfterCriticalCorrection: true },
  professor_emergencia: { estimatedDurationMinutes: 6, maxQuestions: 3, maxConcepts: 2, reviewAtEnd: true, generateMiniQuiz: false, allowFreeQuestions: false, requireStudentAnswerBeforeExplanation: false, stopAfterCriticalCorrection: true },
  professor_socratico: { estimatedDurationMinutes: 10, maxQuestions: 5, maxConcepts: 3, reviewAtEnd: true, generateMiniQuiz: true, allowFreeQuestions: true, requireStudentAnswerBeforeExplanation: true, stopAfterCriticalCorrection: false },
  professor_semiologia: { estimatedDurationMinutes: 10, maxQuestions: 4, maxConcepts: 3, reviewAtEnd: true, generateMiniQuiz: true, allowFreeQuestions: true, requireStudentAnswerBeforeExplanation: false, stopAfterCriticalCorrection: false },
  mentor_clinico: { estimatedDurationMinutes: 12, maxQuestions: 4, maxConcepts: 3, reviewAtEnd: true, generateMiniQuiz: false, allowFreeQuestions: true, requireStudentAnswerBeforeExplanation: false, stopAfterCriticalCorrection: false },
  professor_revisao_rapida: { estimatedDurationMinutes: 4, maxQuestions: 2, maxConcepts: 2, reviewAtEnd: false, generateMiniQuiz: false, allowFreeQuestions: true, requireStudentAnswerBeforeExplanation: false, stopAfterCriticalCorrection: false },
};

const PERSONA_POR_EIXO: Partial<Record<CompetencyAxis, ProfessorPersonaKey>> = {
  condutaSeguranca: "professor_emergencia",
  anamnese: "professor_socratico",
  exameFisico: "professor_semiologia",
  comunicacao: "mentor_clinico",
  examesComplementares: "mentor_clinico",
  raciocinioDiagnostico: "mentor_clinico",
};

function casoEhUrgencia(caso: CanonicalCase): boolean {
  const t = `${caso.identificacao.sistema} ${caso.identificacao.especialidade} ${caso.identificacao.sindromePrincipal} ${caso.identificacao.titulo}`
    .toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  return /urgenc|emerg|isquem|tromboembol|choque|iam|sca|coronarian/.test(t);
}

/**
 * Decide a persona + configuração de sessão. Pura, determinística.
 */
export function buildProfessorPersona(input: PersonaInput): ProfessorPersonaDecision {
  const { teaching, context, caso } = input;
  const competencias = context.avaliacao?.competencias ?? [];
  const nota = context.avaliacao?.nota ?? 0;
  const muitosGaps = competencias.filter((c) => c.score01 < 0.6).length >= 4;
  const temErroCritico = teaching.modoPedagogico === "reforco_de_erro_critico" || !!teaching.alertaSeguranca;
  const urgencia = casoEhUrgencia(caso);
  const eixoPrincipal = teaching.prioridadePrincipal.eixo;

  let key: ProfessorPersonaKey;
  let justificativa: string;

  if (temErroCritico) {
    if (urgencia) { key = "professor_emergencia"; justificativa = "Erro crítico em caso de urgência → objetividade e segurança imediatas."; }
    else { key = "examinador_rigoroso"; justificativa = "Erro crítico de segurança → rigor na correção, sem entregar a resposta."; }
  } else if (urgencia) {
    key = "professor_emergencia"; justificativa = "Caso de urgência → prioridade em decisão rápida e segura.";
  } else if (muitosGaps) {
    key = "mentor_clinico"; justificativa = "Muitas lacunas simultâneas → organizar prioridades com foco diretivo.";
  } else if (nota >= 17) {
    key = "professor_revisao_rapida"; justificativa = "Desempenho alto → consolidação breve.";
  } else if (eixoPrincipal && eixoPrincipal !== "erro_critico" && PERSONA_POR_EIXO[eixoPrincipal]) {
    key = PERSONA_POR_EIXO[eixoPrincipal]!;
    justificativa = `Lacuna principal em ${eixoPrincipal} → persona ${key}.`;
  } else {
    key = "mentor_clinico"; justificativa = "Padrão: acompanhamento estruturado.";
  }

  // Fase 15: ajuste da persona pelo perfil longitudinal do aluno (Student Model).
  const sm = context.studentModel;
  if (sm) {
    const erroRecorrenteGrave = sm.riscos.some((r) => r.tipo === "erro_critico_recorrente");
    const inseguro = sm.confiancaEstimada < 0.4 || sm.riscos.some((r) => r.tipo === "inseguranca");
    const avancado = sm.profile.nivel === "avancado";
    const evoluindo = sm.curvaEvolucao.tendencia.direcao === "melhorando";
    if (erroRecorrenteGrave) {
      key = urgencia ? "professor_emergencia" : "examinador_rigoroso";
      justificativa = "Erro crítico recorrente no histórico → rigor/objetividade na correção.";
    } else if (inseguro) {
      key = "mentor_clinico"; justificativa = "Aluno com confiança baixa → mentor acolhedor que organiza o raciocínio.";
    } else if (avancado && !temErroCritico) {
      key = nota >= 17 ? "professor_revisao_rapida" : "examinador_rigoroso";
      justificativa = "Aluno avançado → avaliação exigente / revisão rápida.";
    } else if (evoluindo && !temErroCritico) {
      key = "mentor_clinico"; justificativa = "Evolução positiva → mentor clínico com reforço dos ganhos.";
    }
  }

  // Fase 16: ajuste da persona pelo estado atual da sessão (o "agora" tem prioridade
  // para o tom emocional, sem abrir mão da correção do conteúdo em outras camadas).
  const ls = context.learningSession;
  if (ls && !urgencia) {
    if (ls.contexto.ehPosReprovacao) {
      key = "mentor_clinico"; justificativa = "Sessão pós-reprovação → mentor acolhedor (não reforçar o fracasso).";
    } else if (ls.nivelFrustracao >= 0.6) {
      key = "mentor_clinico"; justificativa = "Frustração alta na sessão → mentor acolhedor e objetivo.";
    } else if (ls.modo === "treino_pre_prova") {
      key = "examinador_rigoroso"; justificativa = "Treino pré-prova → avaliação exigente e direta.";
    } else if (ls.timeBox.curto) {
      key = "professor_revisao_rapida"; justificativa = "Tempo curto na sessão → revisão rápida e objetiva.";
    } else if (ls.confiancaAtual >= 0.75 && nota >= 16) {
      key = "professor_revisao_rapida"; justificativa = "Confiança e nota altas → revisão rápida com desafio.";
    }
  }

  const persona = PERSONAS[key];

  // Config de sessão: base da persona, refinada pela estratégia.
  const base = SESSION_BY_PERSONA[key];
  const sessionConfig: TeachingSessionConfig = {
    ...base,
    stopAfterCriticalCorrection: base.stopAfterCriticalCorrection || temErroCritico,
    // Não ensinar tudo de uma vez: nº de conceitos ≤ nº de prioridades de foco.
    maxConcepts: Math.max(1, Math.min(base.maxConcepts, 1 + teaching.prioridadesSecundarias.length + (temErroCritico ? 1 : 0))),
  };

  // Fase 16: a sessão calibra os limites (tempo, energia, carga, mini-quiz).
  if (ls) {
    sessionConfig.estimatedDurationMinutes = Math.min(sessionConfig.estimatedDurationMinutes, ls.timeBox.tempoDisponivelMin);
    if (ls.energia === "baixa" || ls.constraints.reduzirCargaCognitiva) {
      sessionConfig.maxQuestions = Math.max(1, Math.min(sessionConfig.maxQuestions, 2));
      sessionConfig.maxConcepts = Math.max(1, Math.min(sessionConfig.maxConcepts, 2));
    }
    if (ls.timeBox.curto) {
      sessionConfig.maxQuestions = Math.min(sessionConfig.maxQuestions, 2);
      sessionConfig.maxConcepts = 1;
    }
    if (ls.constraints.fazerMiniQuiz) sessionConfig.generateMiniQuiz = true;
    if (ls.constraints.encerrarCedo) sessionConfig.reviewAtEnd = false;
  }

  const regrasDeConducao = [
    `Adotar o tom "${persona.tom}" (exigência ${persona.exigencia}, ritmo ${persona.ritmo}).`,
    `Ensinar no máximo ${sessionConfig.maxConcepts} conceito(s) e fazer no máximo ${sessionConfig.maxQuestions} pergunta(s).`,
    `Respeitar o modo pedagógico "${teaching.modoPedagogico}".`,
    sessionConfig.requireStudentAnswerBeforeExplanation ? "Pedir a resposta do aluno antes de explicar." : "Pode explicar diretamente quando fizer sentido.",
    sessionConfig.stopAfterCriticalCorrection ? "Após corrigir o erro crítico, parar e verificar a compreensão." : "Prosseguir pelas prioridades sem alongar.",
    sessionConfig.reviewAtEnd ? "Terminar com uma revisão curta dos pontos-chave." : "Encerrar de forma breve.",
    sessionConfig.generateMiniQuiz ? "Propor 1 mini-quiz de verificação." : "Sem mini-quiz.",
    "Não transformar o feedback em aula infinita; ser objetivo e ancorado na base do sistema.",
  ];

  const estrategiaDeFala = `${persona.nome}: ${persona.estiloFeedback} ${persona.estiloPergunta} Aprofundar ${persona.quandoAprofundar.toLowerCase()}`;

  return { persona, justificativa, tom: persona.tom, estrategiaDeFala, regrasDeConducao, sessionConfig };
}
