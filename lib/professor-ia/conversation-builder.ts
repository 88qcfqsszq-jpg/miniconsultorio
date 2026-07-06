// ============================================================================
// Professor IA — CONVERSATION BUILDER
// ----------------------------------------------------------------------------
// Monta o MODELO de conversa (apenas os prompts, como strings). NÃO conversa,
// NÃO chama IA, NÃO cria endpoint. Só prepara o material que um futuro
// orquestrador poderia enviar a um modelo.
// ============================================================================

import type { ProfessorIAContext, ConversationModel, ProfessorPrompts } from "./interfaces";
import { COMPETENCY_LABELS } from "./types";
import type { TeachingDecision } from "./teaching-engine";
import type { ProfessorPersonaDecision } from "./persona-engine";
import type { LessonPlannerOutput } from "./lesson-planner";

// Prompt de CONDUÇÃO (Fases 10–11): persona + estratégia + limites + plano de aula.
function montarConducaoPrompt(
  teaching?: TeachingDecision,
  persona?: ProfessorPersonaDecision,
  lesson?: LessonPlannerOutput
): string | undefined {
  if (!teaching && !persona && !lesson) return undefined;
  const linhas: string[] = ["# Condução da sessão (Professor IA)"];
  if (persona) {
    const p = persona.persona;
    linhas.push(
      `Persona: ${p.nome} — tom ${p.tom}, exigência ${p.exigencia}, ritmo ${p.ritmo} (${p.estiloInteracao}).`,
      `Motivo da persona: ${persona.justificativa}`
    );
  }
  if (teaching) {
    linhas.push(
      `Modo pedagógico: ${teaching.modoPedagogico}. Prioridade: ${teaching.prioridadePrincipal.titulo}.`,
      `Sessão: até ${(persona?.sessionConfig.maxConcepts ?? teaching.teachingSession.maxConcepts)} conceito(s) e ${(persona?.sessionConfig.maxQuestions ?? teaching.teachingSession.maxQuestions)} pergunta(s); ~${(persona?.sessionConfig.estimatedDurationMinutes ?? teaching.teachingSession.estimatedDurationMinutes)} min.`
    );
    if (teaching.alertaSeguranca) linhas.push(teaching.alertaSeguranca);
  }
  if (persona) {
    linhas.push("Regras de condução:");
    for (const r of persona.regrasDeConducao) linhas.push(`- ${r}`);
    if (persona.persona.frasesRecomendadas.length) linhas.push(`Frases recomendadas: ${persona.persona.frasesRecomendadas.join(" · ")}`);
    if (persona.persona.frasesProibidas.length) linhas.push(`Frases PROIBIDAS: ${persona.persona.frasesProibidas.join(" · ")}`);
  }
  linhas.push(
    "- Não ensine mais conceitos do que o permitido; não faça mais perguntas do que o limite.",
    "- Respeite o modo escolhido e não saia da base do sistema.",
    "- Não transforme o feedback em aula infinita.",
    (persona?.sessionConfig.reviewAtEnd ?? teaching?.teachingSession.reviewAtEnd) ? "- Termine com uma revisão curta dos pontos-chave." : "- Encerre de forma breve."
  );

  if (lesson) {
    linhas.push("", "# Plano de aula (Teaching Actions) — siga NESTA ordem:");
    lesson.actions.forEach((a, i) => {
      linhas.push(`  ${i + 1}. [${a.tipo}] ${a.descricao}${a.pergunta ? ` — "${a.pergunta}"` : ""}`);
    });
    linhas.push(
      "Regras do plano:",
      "- Siga a sequência das Teaching Actions; NÃO pule etapas.",
      "- Se houver 'wait_for_student_answer', NÃO antecipe a explicação — espere a resposta do aluno.",
      "- Use APENAS os recursos listados no plano; não invente recursos.",
      "- Encerre ao final do plano; não transforme a sessão em aula infinita.",
      `Objetivo final da sessão: ${lesson.objetivoFinal}`
    );
  }

  return linhas.filter(Boolean).join("\n");
}

// Prompt de VERDADE (Fase 14): Gold Standard + Truth Layers como fonte de verdade.
function montarVerdadePrompt(ctx: ProfessorIAContext): string | undefined {
  const t = ctx.truthLayersResumo;
  if (!t?.presente) return undefined;
  const linhas: string[] = ["# Verdade do caso (Gold Standard — Truth Layers)"];
  if (t.clinical) {
    linhas.push(
      "## Clinical Truth",
      `Diagnóstico: ${t.clinical.diagnostico}`,
      t.clinical.diferenciais.length ? `Diferenciais: ${t.clinical.diferenciais.join(", ")}` : "",
      t.clinical.sinaisDeGravidade.length ? `Sinais de gravidade: ${t.clinical.sinaisDeGravidade.join("; ")}` : "",
      t.clinical.condutaIdeal.length ? `Conduta ideal: ${t.clinical.condutaIdeal.join("; ")}` : "",
      t.clinical.errosClinicosGraves.length ? `Erros clínicos graves: ${t.clinical.errosClinicosGraves.join("; ")}` : ""
    );
  }
  if (t.educational) {
    linhas.push(
      "## Educational Truth",
      t.educational.conceitosEssenciais.length ? `Conceitos essenciais: ${t.educational.conceitosEssenciais.join("; ")}` : "",
      t.educational.pontosDeConfusao.length ? `Pontos de confusão: ${t.educational.pontosDeConfusao.join("; ")}` : ""
    );
  }
  if (t.evaluation) {
    linhas.push(
      "## Evaluation Truth",
      t.evaluation.criteriosObrigatorios.length ? `Critérios obrigatórios: ${t.evaluation.criteriosObrigatorios.join("; ")}` : "",
      t.evaluation.criteriosCriticos.length ? `Critérios CRÍTICOS: ${t.evaluation.criteriosCriticos.join("; ")}` : "",
      t.evaluation.errosCriticos.length ? `Erros que reprovam: ${t.evaluation.errosCriticos.join("; ")}` : ""
    );
  }
  if (t.teaching) {
    linhas.push(
      "## Teaching Truth",
      t.teaching.perguntasSocraticas.length ? `Perguntas socráticas: ${t.teaching.perguntasSocraticas.join(" · ")}` : "",
      t.teaching.miniQuiz.length ? `Mini-quiz: ${t.teaching.miniQuiz.map((q) => q.pergunta).join(" · ")}` : "",
      `Modo se erro crítico: ${t.teaching.modoSeErroCritico}`,
      `Modo se nota alta: ${t.teaching.modoSeNotaAlta}`
    );
  }
  if (t.resource) {
    const cc = t.resource.centroClinico.map((r) => `${r.titulo}${r.href ? ` (${r.href})` : ""}`).join("; ");
    linhas.push(
      "## Resource Truth (use APENAS estes recursos)",
      cc ? `Centro Clínico: ${cc}` : "",
      `IDs: sons[${t.resource.sons.join(",")}] imagens[${t.resource.imagens.join(",")}] exames[${t.resource.exames.join(",")}] fluxos[${t.resource.fluxos.join(",")}] scores[${t.resource.scores.join(",")}] fármacos[${t.resource.farmacos.join(",")}]`
    );
  }
  linhas.push(
    "",
    "Regras da verdade:",
    "- PRIORIZE as Truth Layers acima de qualquer texto solto do contexto.",
    "- NÃO contradiga o Gold Standard.",
    "- Em caso de conflito entre fontes, o Gold Standard VENCE.",
    "- NÃO extrapole além das Truth Layers e do contexto fornecido."
  );
  return linhas.filter(Boolean).join("\n");
}

// Prompt do ALUNO (Fase 15): perfil longitudinal para personalizar o ensino.
function montarAlunoPrompt(ctx: ProfessorIAContext): string | undefined {
  const s = ctx.studentSummary;
  const sm = ctx.studentModel;
  if (!s || !sm) return undefined;
  const linhas: string[] = ["# Perfil do aluno (histórico longitudinal)"];
  linhas.push(
    `Nível: ${sm.profile.nivel}${sm.profile.semestre ? `, ${sm.profile.semestre}º semestre` : ""}. Confiança estimada: ${Math.round(sm.confiancaEstimada * 100)}%.`,
    `Evolução: ${sm.curvaEvolucao.tendencia.descricao} (nota média ${sm.curvaEvolucao.notaMedia}/20).`,
    s.topForcas.length ? `Forças: ${s.topForcas.join("; ")}` : "",
    s.topFraquezas.length ? `Fraquezas: ${s.topFraquezas.join("; ")}` : "",
    s.topErrosRecorrentes.length ? `Erros recorrentes: ${s.topErrosRecorrentes.join("; ")}` : "",
    s.temasParaRevisao.length ? `Focos de revisão: ${s.temasParaRevisao.join("; ")}` : "",
    `Risco pedagógico: ${s.riscoPedagogico.descricao}`,
    `Recomendação de foco: ${s.recomendacaoDeFoco}`
  );
  linhas.push(
    "",
    "Regras de uso do histórico:",
    "- Use o histórico APENAS para personalizar o ensino (calibrar tom, prioridade e profundidade).",
    "- NÃO exponha dados sensíveis desnecessários do aluno; cite o histórico só quando ajudar a aprender.",
    "- NÃO humilhe o aluno por um erro recorrente; trate como oportunidade de consolidação.",
    "- Se o erro já apareceu antes, reconheça o padrão com respeito e seja mais direto na correção."
  );
  return linhas.filter(Boolean).join("\n");
}

// Prompt da SESSÃO (Fase 16): estado atual do aluno nesta sessão.
function montarSessaoPrompt(ctx: ProfessorIAContext): string | undefined {
  const s = ctx.learningSessionSummary;
  const ls = ctx.learningSession;
  if (!s || !ls) return undefined;
  const linhas: string[] = ["# Estado atual da sessão"];
  linhas.push(
    `Modo: ${s.modo}. Objetivo: ${s.objetivo}.`,
    `Tempo disponível: ${s.tempoDisponivelMin} min. Carga cognitiva recomendada: ${s.cargaCognitivaRecomendada}.`,
    `Estado emocional: ${s.estadoEmocional}. Confiança: ${Math.round(s.confianca * 100)}%.`,
    `Abordagem recomendada: ${s.abordagemRecomendada}`,
    s.limites.length ? `Limites: ${s.limites.join(" ")}` : "",
    s.alerta ? `⚠️ ${s.alerta}` : ""
  );
  linhas.push(
    "",
    "Regras da sessão:",
    "- Adapte a linguagem ao momento do aluno.",
    "- Se a frustração estiver alta, seja acolhedor e objetivo.",
    "- Se o tempo for curto, NÃO abra uma aula longa; vá ao essencial.",
    "- Se for pós-reprovação, NÃO reforce o fracasso; reconstrua a confiança.",
    "- Se for treino pré-prova, seja direto e avaliativo, respeitando o relógio."
  );
  return linhas.filter(Boolean).join("\n");
}

// ---------------------------------------------------------------------------
// Blocos fixos (persona / segurança / grounding).
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT = `Você é o "Professor IA" do Mini Consultório OSCE — um preceptor clínico para estudantes de medicina do 3º semestre.
Seu papel é ensinar e desenvolver o raciocínio clínico do aluno com base EXCLUSIVA no caso simulado, na avaliação já produzida e na base de conhecimento do sistema.
Você é socrático, objetivo e acolhedor: guia com perguntas e explicações curtas, sem entregar tudo pronto.
Você NÃO substitui avaliação médica real e NÃO atende pacientes reais.`;

const PROFESSOR_PROMPT = `Estilo pedagógico:
- Comece reconhecendo o que o aluno fez bem.
- Aponte no máximo 2–3 lacunas por vez, em ordem de prioridade clínica.
- Prefira perguntas socráticas ("o que faltou pesquisar antes de fechar o diagnóstico?") a respostas prontas.
- Relacione cada ponto a um recurso da base (semiologia, fluxo, exame, som, imagem) quando existir.
- Ajuste a profundidade ao 3º semestre. Seja específico e clínico, nunca genérico.`;

const SEGURANCA_PROMPT = `Regras de segurança:
- Este é um ambiente EDUCACIONAL e SIMULADO. Deixe isso claro se o aluno pedir conduta para um paciente real.
- Nunca forneça dose/medicação como prescrição para uso real; contextualize como aprendizado do caso.
- Priorize sempre segurança do paciente, sinais de gravidade e red flags.
- Se o aluno cometeu um erro crítico, trate-o com prioridade máxima e explique o risco.`;

const NAO_INVENTAR_PROMPT = `Regras de veracidade clínica:
- NÃO invente achados, exames, valores, diretrizes ou condutas que não estejam no caso ou na base do sistema.
- Se não houver informação suficiente, diga explicitamente "isto não está disponível na base deste caso".
- Não afirme certezas diagnósticas além do que o caso sustenta.
- Prefira "não sei / não há dado" a especular.`;

const APENAS_BASE_PROMPT = `Ancoragem (grounding):
- Responda SOMENTE com base em: (1) o caso e seu gabarito, (2) a avaliação HealthBench já produzida, (3) o material didático do caso, (4) a base do Centro Clínico (semiologia, fluxos, exames, imagens, sons).
- Ao citar um conceito, aponte o recurso correspondente da base (com o título/rota fornecidos no contexto).
- Não traga conhecimento externo não presente nessas fontes.`;

// ---------------------------------------------------------------------------
// Blocos dinâmicos (caso / contexto), derivados do ProfessorIAContext.
// ---------------------------------------------------------------------------
function montarCasoPrompt(ctx: ProfessorIAContext): string {
  const c = ctx.caso;
  const p = ctx.paciente;
  const linhas = [
    `# Caso`,
    `Título: ${c.titulo ?? "—"}`,
    `Diagnóstico correto (gabarito): ${c.diagnosticoCorreto ?? "—"}`,
    c.diferenciaisEsperados?.length ? `Diferenciais esperados: ${c.diferenciaisEsperados.join(", ")}` : "",
    `Paciente: ${p.idade ?? "?"} anos, ${p.sexo ?? "?"}${p.tipoPaciente ? ` (${p.tipoPaciente})` : ""}.`,
    p.queixaPrincipal ? `Queixa principal: ${p.queixaPrincipal}` : "",
    c.objetivoPedagogico ? `Objetivo pedagógico: ${c.objetivoPedagogico}` : "",
  ];
  return linhas.filter(Boolean).join("\n");
}

function montarContextoPrompt(ctx: ProfessorIAContext): string {
  const linhas: string[] = ["# Contexto do atendimento"];

  // Resposta do aluno
  const r = ctx.respostaAluno;
  linhas.push(
    `Hipótese do aluno: ${r.hipotesePrincipal ?? "—"}`,
    r.diagnosticosDiferenciais?.length ? `Diferenciais do aluno: ${r.diagnosticosDiferenciais.join(", ")}` : "",
    r.conduta ? `Conduta do aluno: ${r.conduta}` : ""
  );

  // Avaliação HealthBench
  if (ctx.avaliacao) {
    const a = ctx.avaliacao;
    linhas.push(
      "",
      `# Avaliação (HealthBench)`,
      `Nota: ${a.nota}/${a.pontuacaoMaxima} — ${a.passed ? "aprovado" : "abaixo do esperado"}.`
    );
    for (const comp of a.competencias) {
      linhas.push(
        `- ${comp.label}: ${comp.pontosObtidos}/${comp.pontosMaximos}` +
          (comp.aMelhorar.length ? ` · a melhorar: ${comp.aMelhorar.slice(0, 2).join("; ")}` : "")
      );
    }
    if (a.errosCriticos.length) linhas.push(`Erros críticos: ${a.errosCriticos.join("; ")}`);
    if (a.focosDeTreino.length) linhas.push(`Focos de treino: ${a.focosDeTreino.join(", ")}`);
  }

  // Material didático
  if (ctx.material?.respostaModelo) {
    linhas.push("", `# Resposta modelo (referência)`, ctx.material.respostaModelo);
  }
  if (ctx.material?.checklistNotaMaxima?.length) {
    linhas.push(`Checklist nota máxima: ${ctx.material.checklistNotaMaxima.join("; ")}`);
  }

  // Conhecimento relacionado (links da base)
  if (ctx.conhecimento?.todos?.length) {
    linhas.push("", `# Recursos da base relacionados`);
    for (const rec of ctx.conhecimento.todos.slice(0, 12)) {
      linhas.push(`- [${rec.domain}] ${rec.titulo}${rec.href ? ` (${rec.href})` : ""}`);
    }
  }

  return linhas.filter(Boolean).join("\n");
}

/**
 * Monta o ConversationModel completo (7 prompts) para um contexto.
 * NÃO envia nada a nenhuma IA — apenas devolve as strings.
 */
export function buildConversationModel(
  ctx: ProfessorIAContext,
  opts: {
    modeloSugerido?: string;
    temperatura?: number;
    maxTokens?: number;
    teaching?: TeachingDecision;
    persona?: ProfessorPersonaDecision;
    lessonPlan?: LessonPlannerOutput;
  } = {}
): ConversationModel {
  const conducao = montarConducaoPrompt(opts.teaching, opts.persona, opts.lessonPlan);
  const verdade = montarVerdadePrompt(ctx);
  const aluno = montarAlunoPrompt(ctx);
  const sessao = montarSessaoPrompt(ctx);
  const prompts: ProfessorPrompts = {
    system: SYSTEM_PROMPT,
    contexto: montarContextoPrompt(ctx),
    caso: montarCasoPrompt(ctx),
    professor: PROFESSOR_PROMPT,
    seguranca: SEGURANCA_PROMPT,
    naoInventarMedicina: NAO_INVENTAR_PROMPT,
    apenasBaseDoSistema: APENAS_BASE_PROMPT,
    ...(verdade ? { verdade } : {}),
    ...(aluno ? { aluno } : {}),
    ...(sessao ? { sessao } : {}),
    ...(conducao ? { conducao } : {}),
  };

  const ordem: Array<keyof ProfessorPrompts> = [
    "system",
    "seguranca",
    "naoInventarMedicina",
    "apenasBaseDoSistema",
    ...(verdade ? (["verdade"] as Array<keyof ProfessorPrompts>) : []),
    ...(aluno ? (["aluno"] as Array<keyof ProfessorPrompts>) : []),
    ...(sessao ? (["sessao"] as Array<keyof ProfessorPrompts>) : []),
    "professor",
    ...(conducao ? (["conducao"] as Array<keyof ProfessorPrompts>) : []),
    "caso",
    "contexto",
  ];

  return {
    mode: ctx.mode,
    prompts,
    ordemComposicao: ordem,
    sugestao: {
      modeloSugerido: opts.modeloSugerido ?? "gpt-4o-mini",
      temperaturaSugerida: opts.temperatura ?? 0.3,
      maxTokensSugerido: opts.maxTokens ?? 900,
    },
  };
}

/** Utilitário: concatena os prompts na ordem sugerida (para inspeção/preview). */
export function preverPromptCompleto(model: ConversationModel): string {
  const labels: Record<keyof ProfessorPrompts, string> = {
    system: "SYSTEM",
    contexto: "CONTEXTO",
    caso: "CASO",
    professor: "PROFESSOR",
    seguranca: "SEGURANÇA",
    naoInventarMedicina: "NÃO INVENTAR",
    apenasBaseDoSistema: "APENAS BASE",
    verdade: "VERDADE (GOLD STANDARD)",
    aluno: "ALUNO (HISTÓRICO)",
    sessao: "SESSÃO (ESTADO ATUAL)",
    conducao: "CONDUÇÃO",
  };
  return model.ordemComposicao
    .map((k) => `===== ${labels[k]} =====\n${model.prompts[k]}`)
    .join("\n\n");
}
