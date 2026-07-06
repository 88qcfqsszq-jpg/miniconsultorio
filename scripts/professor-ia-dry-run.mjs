// ============================================================================
// Professor IA — Dry Run runner (Fase 8)
// ----------------------------------------------------------------------------
// Runner AUTOCONTIDO (Node ESM não executa os módulos .ts sem extensão/loader).
// Reproduz o MESMO pipeline de lib/professor-ia/dry-run.ts (que é a prova
// type-checked da arquitetura real) com dados inline: Caso Canônico PAC +
// Knowledge Graph + HealthBench MOCK → contexto + plano + prompts.
// NÃO chama IA, NÃO cria endpoint, NÃO cria UI. Só assembla e imprime dados.
// Uso: node scripts/professor-ia-dry-run.mjs
// ============================================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// ── Nós do Knowledge Graph referenciados pelo PAC (nome/categoria reais) ──
const KG = {
  "ls-crepitacoes": { nome: "Crepitações", categoria: "lung_sound" },
  "img-rx-torax": { nome: "Radiografia de tórax", categoria: "imaging" },
  "lab-hemograma": { nome: "Hemograma completo", categoria: "laboratory" },
  "flow-dispneia": { nome: "Fluxo da Dispneia", categoria: "flow" },
  "flow-febre": { nome: "Fluxo da Febre", categoria: "flow" },
  "score-curb65": { nome: "CURB-65", categoria: "score" },
  "guide-pneumonia": { nome: "Conduta na Pneumonia (PAC)", categoria: "guideline" },
  "dx-pneumonia": { nome: "Pneumonia adquirida na comunidade", categoria: "diagnosis" },
  "drug-amoxicilina": { nome: "Amoxicilina (± clavulanato)", categoria: "drug" },
};
const resolver = (ids) => (ids ?? []).map((id) => ({ id, ...(KG[id] ?? { nome: "(ausente)", categoria: "?" }) }));

// ── HealthBench MOCK (idêntico a lib/professor-ia/dry-run.ts) ──
const hb = {
  casoId: 2, attemptId: "dryrun_pac_0001", notaFinal: 11.8, score01: 0.588, passed: false, pontuacaoMaxima: 20,
  competencyScores: {
    comunicacao: 0.5, anamnese: 0.33, exameFisico: 0.85, examesComplementares: 1.0, raciocinioDiagnostico: 1.0, condutaSeguranca: 0.35,
  },
  competencias: [
    { axis: "comunicacao", label: "Comunicação e postura médica", score01: 0.5, acertos: [], aMelhorar: ["Apresentar-se e explicar a hipótese em linguagem acessível"] },
    { axis: "anamnese", label: "Anamnese dirigida", score01: 0.33, acertos: ["Caracterizou a tosse (seca vs produtiva)"], aMelhorar: ["Investigar antecedentes, medicamentos e alergias", "Pesquisar sinais de gravidade"] },
    { axis: "exameFisico", label: "Exame físico", score01: 0.85, acertos: ["Mediu sinais vitais completos, incluindo SpO₂", "Auscultou o tórax e identificou crepitações"], aMelhorar: [] },
    { axis: "examesComplementares", label: "Exames complementares", score01: 1.0, acertos: ["Solicitou radiografia de tórax", "Solicitou hemograma"], aMelhorar: [] },
    { axis: "raciocinioDiagnostico", label: "Raciocínio diagnóstico", score01: 1.0, acertos: ["Formulou hipótese de PAC coerente com os achados", "Considerou diagnósticos diferenciais"], aMelhorar: [] },
    { axis: "condutaSeguranca", label: "Conduta e Segurança", score01: 0.35, acertos: [], aMelhorar: ["Prescreveu antibiótico apropriado COM dose", "Orientou sinais de alarme e retorno em 48–72h"] },
  ],
  errosCriticos: ["Prescreveu antibiótico apropriado COM dose"],
  nextTrainingFocus: ["Conduta", "Anamnese", "Conduta e Segurança"],
  professorFeedback: "Nota: 11.8/20 (59% da rubrica). Pontos fortes: diagnóstico e exames. A melhorar: dose do antibiótico, anamnese e orientações.",
};

// ── PAC (essenciais do Caso Canônico) ──
const pac = {
  canonicalId: "pac", legacyId: 2, titulo: "Pneumonia Adquirida na Comunidade", diagnostico: "Pneumonia Adquirida na Comunidade (PAC)",
  refs: { soundRefs: ["ls-crepitacoes"], imageRefs: ["img-rx-torax"], examRefs: ["lab-hemograma"], flowRefs: ["flow-dispneia", "flow-febre"] },
  professorObjectives: ["Sempre medir SpO₂ e FR (gravidade da PAC).", "Justificar o antibiótico e a dose.", "Relacionar ausculta + RX + leucograma ao diagnóstico."],
  perguntasSocraticas: ["Quais achados no exame físico apontam para consolidação, e não broncoespasmo?", "Como a SpO₂ e a FR mudam a sua conduta?", "Por que este quadro é PAC e não asma, IC ou TEP?", "Qual antibiótico e por quê? Qual a dose?"],
  centroClinico: [
    { dominio: "semiologia", titulo: "Semiologia — Pneumologia", href: "/centro-clinico/semiologia" },
    { dominio: "fluxo", titulo: "Fluxo da Dispneia / Febre", href: "/centro-clinico/fluxos" },
    { dominio: "exame", titulo: "RX de tórax · Hemograma", href: "/centro-clinico/exames" },
    { dominio: "imagem", titulo: "Pneumonia (RX)", href: "/centro-clinico/imagens" },
    { dominio: "som", titulo: "Crepitações", href: "/centro-clinico/sons" },
    { dominio: "escore", titulo: "CURB-65", href: undefined },
  ],
};

// ── Gold Standard PAC — Truth Layers (resumo inline; Fase 14) ──
const truthLayers = {
  presente: true,
  camadas: ["clinical", "educational", "evaluation", "teaching", "resource"],
  clinical: { diagnostico: "Pneumonia Adquirida na Comunidade (PAC)", diferenciais: ["asma", "DPOC", "TEP", "IC", "tuberculose", "bronquite"], sinaisDeGravidade: ["SpO₂ < 92%", "FR > 24", "confusão", "hipotensão", "comorbidades"] },
  educational: { conceitosEssenciais: ["Diferenciar consolidação de broncoespasmo", "Correlacionar ausculta + RX + clínica", "SpO₂/FR", "Antibiótico com dose", "CURB-65"] },
  evaluation: { criteriosObrigatorios: ["Pedir RX", "Medir SpO₂", "Auscultar pulmão", "Diagnosticar PAC", "Antibiótico com dose", "Sinais de alarme", "Reavaliação"], criteriosCriticos: ["RX", "SpO₂/sinais vitais", "Antibiótico com dose"] },
  teaching: { miniQuiz: ["Por que antibiótico sem dose é inseguro?", "Por que o RX muda a conduta?", "Por que asma não explica consolidação?", "Por que o TEP pode ter RX normal?", "Qual escore avalia gravidade (CURB-65)?"], modoSeErroCritico: "reforco_de_erro_critico", modoSeNotaAlta: "revisao_rapida" },
  resource: { sons: ["ls-crepitacoes"], imagens: ["img-rx-torax"], exames: ["lab-hemograma"], fluxos: ["flow-febre", "flow-dispneia"], guidelines: ["guide-pneumonia"], scores: ["score-curb65"], farmacos: ["drug-amoxicilina"], referencias: ["ref-open-i", "ref-hls-cmds"] },
};

// ── buildStudyPlan (lógica equivalente) ──
const COMP_RECURSOS = {
  comunicacao: [], anamnese: ["/centro-clinico/semiologia"], exameFisico: ["/centro-clinico/sons"],
  examesComplementares: ["/centro-clinico/exames"], raciocinioDiagnostico: ["/centro-clinico/fluxos"], condutaSeguranca: ["/centro-clinico/fluxos"],
};
const studyItens = [];
for (const e of hb.errosCriticos) studyItens.push({ prioridade: 1, titulo: `Corrigir erro crítico: ${e}`, severidade: "critica" });
for (const c of [...hb.competencias].sort((a, b) => a.score01 - b.score01)) {
  if (c.score01 >= 0.85) continue;
  const prio = c.score01 < 0.5 ? 1 : c.score01 < 0.75 ? 2 : 3;
  studyItens.push({ prioridade: prio, competencia: c.axis, titulo: `Reforçar: ${c.label}`, severidade: prio === 1 ? "importante" : "leve", recursos: COMP_RECURSOS[c.axis] ?? [] });
}
const studyPlan = {
  casoId: 2,
  prioridade1: studyItens.filter((i) => i.prioridade === 1),
  prioridade2: studyItens.filter((i) => i.prioridade === 2),
  prioridade3: studyItens.filter((i) => i.prioridade === 3),
  itens: studyItens,
  resumo: `Plano com ${studyItens.length} itens.`,
};

// ── buildTeachingStrategy (mesma lógica de teaching-engine.ts) ──
const STRAT = {
  comunicacao: { titulo: "Fala médica clara", modo: "demonstrativo" },
  anamnese: { titulo: "Investigação dirigida", modo: "socratico" },
  exameFisico: { titulo: "Semiologia direcionada", modo: "demonstrativo" },
  examesComplementares: { titulo: "Justificativa dos exames", modo: "socratico" },
  raciocinioDiagnostico: { titulo: "Hipóteses e diferenciais", modo: "demonstrativo" },
  condutaSeguranca: { titulo: "Conduta segura", modo: "diretivo" },
};
const peso = (axis, s) => 1 - s + (axis === "condutaSeguranca" ? 0.15 : 0);
const temErro = hb.errosCriticos.length > 0;
const ranking = hb.competencias.filter((c) => c.score01 < 0.85).map((c) => ({ c, p: peso(c.axis, c.score01) })).sort((a, b) => b.p - a.p);
const muitosGaps = ranking.filter((r) => r.c.score01 < 0.6).length >= 4;
const prioEixo = ranking.map(({ c }) => ({ eixo: c.axis, titulo: STRAT[c.axis].titulo, modo: STRAT[c.axis].modo, motivo: c.aMelhorar.slice(0, 2).join("; ") || `${Math.round(c.score01 * 100)}%`, severidade: c.score01 < 0.5 ? "alta" : "media" }));
const prioErro = temErro ? { eixo: "erro_critico", titulo: "Corrigir erro crítico", modo: "reforco_de_erro_critico", motivo: hb.errosCriticos.slice(0, 2).join("; "), severidade: "critica" } : null;
const foco = [prioErro, ...prioEixo].filter(Boolean).slice(0, 3);
const principal = foco[0];
const modoPedagogico = temErro ? "reforco_de_erro_critico" : muitosGaps ? "diretivo" : principal.modo;
const objetivosSessao = [...foco.map((p) => p.titulo), ...pac.professorObjectives.slice(0, 2)].slice(0, 5);
const plano3 = [
  "1) Reconhecer acertos: " + hb.competencias.filter((c) => c.score01 >= 0.8).map((c) => c.label).join(", "),
  `2) Prioridade 1 (modo ${principal.modo}): ${principal.titulo} — ${principal.motivo}`,
  foco[1] ? `3) Avançar: ${foco[1].titulo} (modo ${foco[1].modo}) e consolidar` : "3) Consolidar com pergunta socrática",
];
const teaching = {
  prioridadePrincipal: principal, prioridadesSecundarias: foco.slice(1), modoPedagogico, objetivos: objetivosSessao,
  errosParaExplorar: [...hb.errosCriticos, ...foco.filter((p) => p.eixo !== "erro_critico").map((p) => p.motivo)].slice(0, 5),
  errosParaIgnorarAgora: prioEixo.filter((p) => !foco.some((f) => f.eixo === p.eixo)).map((p) => `${p.titulo}: ${p.motivo}`),
  planoTresPassos: plano3,
  alertaSeguranca: temErro ? `⚠️ ERRO CRÍTICO — prioridade máxima: ${hb.errosCriticos.join("; ")}` : undefined,
};

// ── buildProfessorPersona (mesma lógica de persona-engine.ts) ──
const casoUrgencia = /urgenc|emerg|isquem|tromboembol|choque|iam|sca|coronarian/.test((pac.diagnostico + " " + pac.titulo).toLowerCase());
const PERSONA_EIXO = { condutaSeguranca: "professor_emergencia", anamnese: "professor_socratico", exameFisico: "professor_semiologia", comunicacao: "mentor_clinico", examesComplementares: "mentor_clinico", raciocinioDiagnostico: "mentor_clinico" };
const SESS = { examinador_rigoroso: { d: 8, q: 4, c: 2, rev: true, quiz: true }, professor_emergencia: { d: 6, q: 3, c: 2, rev: true, quiz: false }, professor_socratico: { d: 10, q: 5, c: 3, rev: true, quiz: true }, professor_semiologia: { d: 10, q: 4, c: 3, rev: true, quiz: true }, mentor_clinico: { d: 12, q: 4, c: 3, rev: true, quiz: false }, professor_revisao_rapida: { d: 4, q: 2, c: 2, rev: false, quiz: false } };
const PERSONA_NOME = { examinador_rigoroso: "Examinador rigoroso", professor_emergencia: "Professor de emergência", professor_socratico: "Professor socrático", professor_semiologia: "Professor de semiologia", mentor_clinico: "Mentor clínico", professor_revisao_rapida: "Professor de revisão rápida" };
const PERSONA_TOM = { examinador_rigoroso: "firme", professor_emergencia: "urgente", professor_socratico: "encorajador", professor_semiologia: "tecnico", mentor_clinico: "acolhedor", professor_revisao_rapida: "encorajador" };
const muitos = hb.competencias.filter((c) => c.score01 < 0.6).length >= 4;
let personaKey, personaJust;
if (temErro) { if (casoUrgencia) { personaKey = "professor_emergencia"; personaJust = "Erro crítico em caso de urgência → objetividade e segurança."; } else { personaKey = "examinador_rigoroso"; personaJust = "Erro crítico de segurança → rigor na correção."; } }
else if (casoUrgencia) { personaKey = "professor_emergencia"; personaJust = "Caso de urgência → decisão rápida e segura."; }
else if (muitos) { personaKey = "mentor_clinico"; personaJust = "Muitas lacunas → foco diretivo."; }
else if (hb.notaFinal >= 17) { personaKey = "professor_revisao_rapida"; personaJust = "Desempenho alto → consolidação breve."; }
else if (principal.eixo && principal.eixo !== "erro_critico") { personaKey = PERSONA_EIXO[principal.eixo] || "mentor_clinico"; personaJust = `Lacuna principal em ${principal.eixo}.`; }
else { personaKey = "mentor_clinico"; personaJust = "Padrão."; }
const sB = SESS[personaKey];
const sessionConfig = {
  estimatedDurationMinutes: sB.d, maxQuestions: sB.q,
  maxConcepts: Math.max(1, Math.min(sB.c, 1 + foco.slice(1).length + (temErro ? 1 : 0))),
  reviewAtEnd: sB.rev, generateMiniQuiz: sB.quiz,
  allowFreeQuestions: personaKey !== "examinador_rigoroso" && personaKey !== "professor_emergencia",
  requireStudentAnswerBeforeExplanation: personaKey === "examinador_rigoroso" || personaKey === "professor_socratico",
  stopAfterCriticalCorrection: temErro || personaKey === "examinador_rigoroso" || personaKey === "professor_emergencia",
};
const personaDecision = { persona: { key: personaKey, nome: PERSONA_NOME[personaKey], tom: PERSONA_TOM[personaKey] }, tom: PERSONA_TOM[personaKey], justificativa: personaJust, sessionConfig };

// ── buildLessonPlan (mesma lógica de lesson-planner.ts, Fase 11) ──
const knw = {
  exames: pac.centroClinico.filter((r) => r.dominio === "exame").map((r) => ({ titulo: r.titulo, href: r.href })),
  sons: pac.centroClinico.filter((r) => r.dominio === "som").map((r) => ({ titulo: r.titulo, href: r.href })),
  imagens: pac.centroClinico.filter((r) => r.dominio === "imagem").map((r) => ({ titulo: r.titulo, href: r.href })),
};
function buildLessonPlanInline() {
  const sc = sessionConfig;
  const temErroCritico = !!teaching.alertaSeguranca || teaching.modoPedagogico === "reforco_de_erro_critico";
  const errosCriticos = hb.errosCriticos ?? [];
  const steps = [], conceitosIncluidos = [], perguntasIncluidas = [], recursosUsados = [], checkpoints = [];
  let questionsUsed = 0, conceptsUsed = 0, ordem = 0;
  const push = (fase, a) => { steps.push({ ordem: ++ordem, fase, action: a }); if (a.checkpoint) checkpoints.push(a.descricao); if (a.recursoTitulo) recursosUsados.push({ titulo: a.recursoTitulo, href: a.recursoRef }); };
  const jaUsado = (rec) => recursosUsados.some((x) => (x.href || x.titulo) === (rec.href || rec.titulo));
  const addQuestion = (fase, pergunta) => { if (questionsUsed >= sc.maxQuestions) return; push(fase, { tipo: "ask_socratic_question", descricao: `Pergunta socrática: ${pergunta}`, pergunta }); push(fase, { tipo: "wait_for_student_answer", descricao: "Aguardar a resposta do aluno antes de explicar.", checkpoint: true }); perguntasIncluidas.push(pergunta); questionsUsed++; };
  const addConcept = (fase, titulo, desc) => { if (conceptsUsed >= sc.maxConcepts) return; push(fase, { tipo: "explain_concept", descricao: `Explicar: ${desc}` }); conceitosIncluidos.push(titulo); conceptsUsed++; };
  const addResourceOnce = (fase, tipo, r, rotulo) => { if (!r || jaUsado(r)) return; push(fase, { tipo, descricao: `${rotulo}: ${r.titulo}`, recursoRef: r.href, recursoTitulo: r.titulo }); };

  const acerto = hb.competencias.filter((c) => c.score01 >= 0.8).flatMap((c) => c.acertos)[0] || "os pontos que o aluno conduziu bem no atendimento";
  push("abertura", { tipo: "acknowledge_strength", descricao: `Reconhecer o acerto: ${acerto}` });

  if (temErroCritico && errosCriticos.length > 0) {
    const erro = errosCriticos[0];
    push("correcao_critica", { tipo: "correct_critical_error", descricao: `Corrigir o erro crítico e explicar o risco: ${erro}`, checkpoint: true });
    if (sc.requireStudentAnswerBeforeExplanation) {
      const perg = pac.perguntasSocraticas.find((q) => /dose|antibi|antimicrob/i.test(q)) || `Como corrigir: ${erro}?`;
      addQuestion("correcao_critica", perg);
    }
    addConcept("correcao_critica", "Segurança / erro crítico", `a importância de ${erro.toLowerCase()} e o risco à segurança do paciente`);
    addResourceOnce("correcao_critica", "show_exam_reference", knw.exames[0], "Exame de referência");
    addResourceOnce("correcao_critica", "show_sound_reference", knw.sons[0], "Som de referência");
  }

  const podeDesenvolver = !(sc.stopAfterCriticalCorrection && temErroCritico);
  if (podeDesenvolver) {
    const prioridades = [teaching.prioridadePrincipal, ...teaching.prioridadesSecundarias].filter((p) => p.eixo !== "erro_critico").slice(0, 3);
    for (const p of prioridades) {
      if (conceptsUsed >= sc.maxConcepts) break;
      push("desenvolvimento", { tipo: "identify_error", descricao: `Apontar a lacuna: ${p.titulo} — ${p.motivo}` });
      if (sc.requireStudentAnswerBeforeExplanation) addQuestion("desenvolvimento", pac.perguntasSocraticas[perguntasIncluidas.length] || `Sobre ${p.titulo.toLowerCase()}, o que faltou?`);
      addConcept("desenvolvimento", p.titulo, `${p.titulo} — ${p.motivo}`);
    }
    addResourceOnce("desenvolvimento", "show_image_reference", knw.imagens[0], "Imagem de referência");
    if (!temErroCritico) addResourceOnce("desenvolvimento", "show_sound_reference", knw.sons[0], "Som de referência");
    push("pratica", { tipo: "compare_with_model_answer", descricao: "Comparar a resposta do aluno com a resposta modelo do caso." });
  }

  if (sc.generateMiniQuiz) push("pratica", { tipo: "mini_quiz", descricao: "Mini-quiz de verificação (1 item objetivo).", checkpoint: true });
  if (sc.reviewAtEnd) push("fechamento", { tipo: "summarize_session", descricao: "Resumir os pontos-chave da sessão." });
  const proximo = teaching.prioridadesSecundarias[0]?.titulo || hb.nextTrainingFocus?.[0] || "revisar o tema no Centro Clínico";
  push("fechamento", { tipo: "assign_next_step", descricao: `Definir o próximo passo de treino: ${proximo}` });

  const objetivoFinal = temErroCritico
    ? `Corrigir com segurança: ${errosCriticos[0] ?? "o erro crítico"} e consolidar a conduta correta.`
    : `Elevar o desempenho em ${teaching.prioridadePrincipal.titulo.toLowerCase()} com raciocínio ancorado na base.`;
  const actions = steps.map((s) => s.action);
  return { lessonPlan: { titulo: `Plano de aula — ${pac.titulo}`, objetivoFinal, steps, duracaoEstimadaMin: sc.estimatedDurationMinutes, conceitosIncluidos, perguntasIncluidas, recursosUsados, checkpoints }, actions, duracaoEstimadaMin: sc.estimatedDurationMinutes, conceitosIncluidos, perguntasIncluidas, recursosUsados, checkpoints, objetivoFinal };
}
const lessonPlan = buildLessonPlanInline();

// ── Student Model (resumo inline; Fase 15) ──
const studentModel = {
  profile: { nome: "Aluno(a) demo", nivel: "intermediario", semestre: 3 },
  confiancaEstimada: 0.63,
  evolucao: "melhorando",
  notaMedia: 11,
  casosRealizados: 3,
  topForcas: ["Raciocínio diagnóstico (89%)"],
  topFraquezas: ["Conduta e segurança (37%)", "Anamnese (55%)"],
  errosRecorrentes: [{ descricao: "Antibiótico sem dose", ocorrencias: 3, persistente: true, eixo: "condutaSeguranca" }],
  riscoPedagogico: { tipo: "erro_critico_recorrente", descricao: "Erro crítico de segurança recorrente: Antibiótico sem dose (3x)." },
  recomendacaoDeFoco: "Priorizar a correção do erro crítico recorrente de segurança com abordagem diretiva.",
};
// Fase 15: erro recorrente detectado → ajuste do modo (mais diretivo) e persona rigorosa.
const erroRecorrente = studentModel.errosRecorrentes.find((e) => e.persistente);
teaching.erroAtualEhRepeticao = !!erroRecorrente;
teaching.errosRecorrentesDetectados = erroRecorrente ? [`${erroRecorrente.descricao} (${erroRecorrente.ocorrencias}x)`] : [];
teaching.ajustePorHistorico = "Erro recorrente de segurança → modo mais DIRETIVO (não é a primeira vez).";
// Fase 15: injeta as 3 actions longitudinais no plano (reforço, revisão de recorrente, comparação).
lessonPlan.actions.splice(1, 0, { tipo: "reinforce_progress", descricao: `Reforçar a evolução: ${studentModel.evolucao} (nota média ${studentModel.notaMedia}/20).` });
lessonPlan.actions.splice(2, 0, { tipo: "review_recurring_error", descricao: `Revisar erro RECORRENTE (${erroRecorrente.ocorrencias}x): ${erroRecorrente.descricao} — não é a primeira vez.`, checkpoint: true });
lessonPlan.actions.splice(lessonPlan.actions.length - 1, 0, { tipo: "compare_with_previous_attempts", descricao: `Comparar com o histórico (${studentModel.casosRealizados} casos; evolução ${studentModel.evolucao}).` });

// ── Learning Session (resumo inline; Fase 16) ──
const learningSession = {
  modo: "pos_reprovacao", objetivo: "Corrigir o erro recorrente de dose do antibiótico com segurança.",
  tempoDisponivelMin: 8, curto: false, energia: "media", emocao: "ansioso", confianca: 0.45, frustracao: 0.5,
  cargaCognitivaRecomendada: "baixa", maxPrioridades: 2,
  abordagem: "Acolher, reforçar 1 acerto e corrigir 1 ponto por vez (sem reforçar o fracasso).",
  alerta: "Pós-reprovação: acolher e reconstruir confiança; não reforçar o fracasso.",
};
// Fase 16: sessão pós-reprovação → modo diretivo com reforço positivo, persona mentor, carga reduzida.
teaching.ajustePorSessao = "Pós-reprovação → começar com reforço positivo antes de corrigir.";
teaching.maxPrioridadesSessao = learningSession.maxPrioridades;
teaching.reforcoPositivo = true;
personaDecision.persona = { key: "mentor_clinico", nome: "Mentor clínico", tom: "acolhedor" };
personaDecision.tom = "acolhedor";
personaDecision.justificativa = "Sessão pós-reprovação → mentor acolhedor (não reforçar o fracasso).";
// Fase 16: injeta as actions de sessão (calibrar objetivo, reforço de confiança, reduzir carga).
lessonPlan.actions.splice(0, 0, { tipo: "calibrate_session_goal", descricao: `Calibrar o objetivo da sessão: ${learningSession.objetivo} (modo ${learningSession.modo}, ${learningSession.tempoDisponivelMin} min).` });
lessonPlan.actions.splice(2, 0, { tipo: "reinforce_confidence", descricao: "Reforçar a confiança: retomar 1 acerto e enquadrar o erro como aprendizado (não reforçar o fracasso)." });
lessonPlan.actions.splice(3, 0, { tipo: "reduce_cognitive_load", descricao: "Reduzir a carga cognitiva: 1 ponto por vez, linguagem simples." });

// ── buildProfessorLesson (roteiro único inline; Fase 18) ──
const ACTION_LABEL = {
  acknowledge_strength: "Reconhecer acerto", correct_critical_error: "Corrigir erro crítico", ask_socratic_question: "Pergunta socrática",
  wait_for_student_answer: "Esperar resposta", explain_concept: "Explicar conceito", show_exam_reference: "Mostrar exame",
  show_sound_reference: "Mostrar som", show_image_reference: "Mostrar imagem", mini_quiz: "Mini-quiz", summarize_session: "Revisão final",
  assign_next_step: "Próximo passo", reinforce_progress: "Reforçar evolução", review_recurring_error: "Revisar erro recorrente",
  compare_with_previous_attempts: "Comparar com histórico", calibrate_session_goal: "Calibrar objetivo da sessão",
  reduce_cognitive_load: "Reduzir carga cognitiva", reinforce_confidence: "Reforçar confiança",
};
const professorLesson = {
  status: "ok",
  header: { titulo: "Professor IA", subtitulo: "Sessão de tutoria personalizada baseada no seu desempenho", aviso: "Prévia estrutural — o chat generativo será ativado em fase futura." },
  diagnostico: { caso: pac.titulo, diagnostico: pac.diagnostico, nota: hb.notaFinal, prioridadePrincipal: teaching.prioridadePrincipal.titulo, persona: personaDecision.persona.nome, modoPedagogico: teaching.modoPedagogico, duracaoEstimadaMin: sessionConfig.estimatedDurationMinutes, modoSessao: learningSession.modo },
  objetivo: { objetivoFinal: lessonPlan.objetivoFinal, objetivos: teaching.objetivos },
  openingLine: { texto: `Você foi bem em ${(hb.competencias.find((c) => c.score01 >= 0.8)?.acertos[0]) || "vários pontos"}. Agora vamos corrigir um ponto crítico: ${(hb.errosCriticos[0] || "a conduta").toLowerCase()}.`, origem: "estatico_do_plano" },
  actions: lessonPlan.actions.map((a, i) => ({ ordem: i + 1, tipo: a.tipo, rotulo: ACTION_LABEL[a.tipo] || a.tipo, descricao: a.descricao })),
  recursos: [
    ...truthLayers.resource.sons.map((r) => ({ dominio: "som", titulo: r })),
    ...truthLayers.resource.exames.map((r) => ({ dominio: "exame", titulo: r })),
    ...truthLayers.resource.fluxos.map((r) => ({ dominio: "fluxo", titulo: r })),
  ],
  proximoPasso: { descricao: teaching.prioridadesSecundarias[0]?.titulo || "revisar o tema no Centro Clínico" },
};

// ── buildLessonFlow/Steps (inline; Fase 19) — ProfessorLesson → LessonFlow → LessonStep ──
const MAP_STEP = {
  acknowledge_strength: "acknowledge_strength", correct_critical_error: "correct_critical_error", ask_socratic_question: "ask_question",
  wait_for_student_answer: "wait_student_answer", explain_concept: "explain_concept", show_exam_reference: "show_exam",
  show_sound_reference: "show_sound", show_image_reference: "show_image", mini_quiz: "mini_quiz", summarize_session: "summarize",
  assign_next_step: "assign_next_step", reinforce_progress: "reinforce_confidence", review_recurring_error: "identify_error",
  compare_with_previous_attempts: "compare_model_answer", calibrate_session_goal: "calibrate_goal", reduce_cognitive_load: "reinforce_confidence",
};
const stepBrutos = [{ type: "opening", desc: professorLesson.openingLine.texto }, ...professorLesson.actions.map((a) => ({ type: MAP_STEP[a.tipo] || "explain_concept", desc: a.descricao, act: a })), { type: "closing", desc: `Próximo passo: ${professorLesson.proximoPasso.descricao}` }];
const steps = stepBrutos.map((b, i) => {
  const requiresInput = b.type === "wait_student_answer" || b.type === "mini_quiz";
  return { id: `step-${i + 1}`, order: i + 1, type: b.type, title: b.type, requiresInput, isCheckpoint: requiresInput || b.type === "correct_critical_error", nextStepId: i < stepBrutos.length - 1 ? `step-${i + 2}` : undefined, resources: b.act?.recursoTitulo ? [{ titulo: b.act.recursoTitulo }] : [], fallbackIfNoAnswer: requiresInput ? "Dar dica e reformular; não entregar a resposta." : undefined };
});
const branches = [];
for (const s of steps.filter((x) => x.requiresInput)) {
  branches.push({ from: s.id, cond: "on_correct", to: s.nextStepId }, { from: s.id, cond: "on_incorrect", to: (steps.find((x) => x.order > s.order && x.type === "explain_concept") || {}).id || s.nextStepId }, { from: s.id, cond: "on_no_answer", to: s.id }, { from: s.id, cond: "on_request_explanation", to: (steps.find((x) => x.type === "explain_concept") || {}).id });
}
const lessonFlow = {
  flowId: "flow-pac", lessonId: "lesson-pac", steps, firstStepId: steps[0]?.id, finalStepId: steps[steps.length - 1]?.id, currentStepId: steps[0]?.id,
  totalSteps: steps.length, interactiveSteps: steps.filter((s) => s.requiresInput).length, resourceSteps: steps.filter((s) => s.resources.length > 0).length,
  checkpoints: steps.filter((s) => s.isCheckpoint), navigationRules: ["Execução sequencial", "Parar em wait_student_answer", "Não pular checkpoints", "Sem resposta → fallback", "Só recursos anexados"],
  branches, canResume: true, canPause: true, canSkipOptionalSteps: true, requiresSequentialExecution: true,
};
professorLesson.lessonFlow = lessonFlow;

// ── buildConversationModel (prompts + condução) ──
const prompts = {
  system: "Você é o \"Professor IA\" do Mini Consultório OSCE — preceptor clínico socrático, baseado EXCLUSIVAMENTE no caso, na avaliação e na base do sistema.",
  contexto: `Hipótese do aluno: Pneumonia adquirida na comunidade\nNota: 11.8/20 (abaixo do esperado)\nA melhorar: dose do antibiótico; anamnese; orientações\nRecursos: ${pac.centroClinico.map((r) => r.titulo).join("; ")}`,
  caso: `Caso: ${pac.titulo}\nDiagnóstico correto: ${pac.diagnostico}\nPaciente: 38 anos, F. Queixa: tosse com catarro e febre há 5 dias.`,
  professor: "Estilo: reconhecer o que foi bem; apontar 2–3 lacunas por prioridade; perguntas socráticas; ligar a recursos da base.",
  seguranca: "Ambiente educacional/simulado; sem prescrição real; priorizar segurança e red flags.",
  naoInventarMedicina: "Não inventar achados/exames/condutas fora do caso ou da base; dizer quando não há dado.",
  apenasBaseDoSistema: "Responder só com base no caso, avaliação HealthBench, material do caso e Centro Clínico.",
  verdade: `# Verdade do caso (Gold Standard — Truth Layers)\n## Clinical Truth\nDiagnóstico: ${truthLayers.clinical.diagnostico}\nDiferenciais: ${truthLayers.clinical.diferenciais.join(", ")}\nSinais de gravidade: ${truthLayers.clinical.sinaisDeGravidade.join("; ")}\n## Evaluation Truth\nCritérios obrigatórios: ${truthLayers.evaluation.criteriosObrigatorios.join("; ")}\nCritérios CRÍTICOS: ${truthLayers.evaluation.criteriosCriticos.join("; ")}\n## Teaching Truth\nMini-quiz: ${truthLayers.teaching.miniQuiz.join(" · ")}\n## Resource Truth (use APENAS estes recursos)\nsons[${truthLayers.resource.sons}] imagens[${truthLayers.resource.imagens}] exames[${truthLayers.resource.exames}] fluxos[${truthLayers.resource.fluxos}] scores[${truthLayers.resource.scores}] fármacos[${truthLayers.resource.farmacos}]\n\nRegras da verdade: priorize as Truth Layers; não contradiga o Gold Standard; em conflito, o Gold Standard VENCE; não extrapole além das Truth Layers.`,
  sessao: `# Estado atual da sessão\nModo: ${learningSession.modo}. Objetivo: ${learningSession.objetivo}.\nTempo disponível: ${learningSession.tempoDisponivelMin} min. Carga cognitiva recomendada: ${learningSession.cargaCognitivaRecomendada}.\nEstado emocional: ${learningSession.emocao} (frustração ${Math.round(learningSession.frustracao * 100)}%, energia ${learningSession.energia}). Confiança: ${Math.round(learningSession.confianca * 100)}%.\nAbordagem: ${learningSession.abordagem}\n⚠️ ${learningSession.alerta}\n\nRegras da sessão: adapte a linguagem ao momento; se frustração alta, seja acolhedor e objetivo; se tempo curto, não abra aula longa; se pós-reprovação, não reforce o fracasso; se treino pré-prova, seja direto e avaliativo.`,
  aluno: `# Perfil do aluno (histórico longitudinal)\nNível: ${studentModel.profile.nivel}, ${studentModel.profile.semestre}º semestre. Confiança: ${Math.round(studentModel.confiancaEstimada * 100)}%. Evolução: ${studentModel.evolucao}.\nForças: ${studentModel.topForcas.join("; ")}\nFraquezas: ${studentModel.topFraquezas.join("; ")}\nErros recorrentes: ${studentModel.errosRecorrentes.map((e) => `${e.descricao} (${e.ocorrencias}x)`).join("; ")}\nRisco: ${studentModel.riscoPedagogico.descricao}\nFoco: ${studentModel.recomendacaoDeFoco}\n\nRegras: use o histórico só para personalizar; não exponha dados sensíveis desnecessários; NÃO humilhe o aluno por erro recorrente; se o erro já apareceu antes, reconheça o padrão com respeito e seja mais direto.`,
  conducao: `# Condução da sessão\nPersona: ${personaDecision.persona.nome} — tom ${personaDecision.tom}.\nModo: ${teaching.modoPedagogico}. Prioridade: ${teaching.prioridadePrincipal.titulo}.\nSessão: até ${sessionConfig.maxConcepts} conceito(s) e ${sessionConfig.maxQuestions} pergunta(s); ~${sessionConfig.estimatedDurationMinutes} min.\n- Não ensine mais do que o permitido; respeite o modo e o tom.\n- Não saia da base do sistema; não vire aula infinita.\n${sessionConfig.stopAfterCriticalCorrection ? "- Após corrigir o erro crítico, pare e verifique compreensão.\n" : ""}${sessionConfig.reviewAtEnd ? "- Termine com revisão curta." : "- Encerre de forma breve."}\n\n# Plano de aula (Teaching Actions) — siga NESTA ordem:\n${lessonPlan.actions.map((a, i) => `  ${i + 1}. [${a.tipo}] ${a.descricao}${a.pergunta ? ` — "${a.pergunta}"` : ""}`).join("\n")}\nRegras do plano: siga a sequência; não pule etapas; se houver 'wait_for_student_answer' espere a resposta; use APENAS os recursos listados; encerre ao final.\nObjetivo final: ${lessonPlan.objetivoFinal}`,
};
const ordemComposicao = ["system", "seguranca", "naoInventarMedicina", "apenasBaseDoSistema", "verdade", "aluno", "sessao", "professor", "conducao", "caso", "contexto"];

// ── Montagem do resultado ──
const principaisFalhas = hb.competencias.filter((c) => c.score01 < 0.6).flatMap((c) => c.aMelhorar.slice(0, 2)).concat(hb.errosCriticos);
const pontosFortes = hb.competencias.filter((c) => c.score01 >= 0.8).flatMap((c) => c.acertos.slice(0, 2));
const camposAusentes = ["ecg (não indicado no caso)", "sinaisVitais.detalhados (mock parcial)"];
const riscos = [
  "Prompt 'não inventar medicina': proíbe achados/condutas fora do caso e da base.",
  "Prompt 'apenas base do sistema': ancoragem em caso + HealthBench + material + Centro Clínico.",
  "Prompt de segurança: contexto educacional/simulado; sem prescrição real.",
];

const result = {
  caso: { canonicalId: pac.canonicalId, legacyId: pac.legacyId, titulo: pac.titulo },
  diagnostico: pac.diagnostico, nota: hb.notaFinal, passou: hb.passed,
  principaisFalhas, pontosFortes,
  recursosCentroClinico: pac.centroClinico,
  sonsRelacionados: resolver(pac.refs.soundRefs),
  imagensRelacionadas: resolver(pac.refs.imageRefs),
  examesRelacionados: resolver(pac.refs.examRefs),
  fluxosRelacionados: resolver(pac.refs.flowRefs),
  objetivosProfessor: pac.professorObjectives,
  perguntasSocraticas: pac.perguntasSocraticas,
  planoDeEstudo: studyPlan,
  teachingStrategy: teaching,
  personaDecision,
  lessonPlan,
  goldStandardTruthLayers: truthLayers,
  studentModel,
  learningSession,
  professorLesson,
  prompts, ordemComposicaoPrompts: ordemComposicao,
  riscosAlucinacaoEvitados: riscos, camposAusentes,
  contextoResumo: { conversaMsgs: 4, exameFisicoEventos: 2, exames: 3, recursosConhecimento: pac.centroClinico.length, temAvaliacao: true, temMaterial: true },
};

// ── Resumo legível ──
const L = "─".repeat(64);
console.log(L);
console.log("PROFESSOR IA — DRY RUN (sem IA, sem endpoint, sem chat)");
console.log(L);
console.log(`Caso usado    : ${result.caso.titulo} (canonicalId=${result.caso.canonicalId}, legado=${result.caso.legacyId})`);
console.log(`Diagnóstico   : ${result.diagnostico}`);
console.log(`Nota simulada : ${result.nota}/20  (${result.passou ? "aprovado" : "abaixo do esperado"})`);
console.log("\nFocos de estudo:");
result.planoDeEstudo.prioridade1.forEach((i) => console.log(`  [P1] ${i.titulo}`));
result.planoDeEstudo.prioridade2.forEach((i) => console.log(`  [P2] ${i.titulo}`));
console.log("\nPrincipais falhas:");
principaisFalhas.slice(0, 5).forEach((f) => console.log(`  - ${f}`));
console.log("Pontos fortes:");
pontosFortes.slice(0, 4).forEach((f) => console.log(`  + ${f}`));
console.log("\nRecursos ligados (Knowledge Graph):");
console.log(`  sons    : ${result.sonsRelacionados.map((s) => s.nome).join(", ") || "—"}`);
console.log(`  imagens : ${result.imagensRelacionadas.map((s) => s.nome).join(", ") || "—"}`);
console.log(`  exames  : ${result.examesRelacionados.map((s) => s.nome).join(", ") || "—"}`);
console.log(`  fluxos  : ${result.fluxosRelacionados.map((s) => s.nome).join(", ") || "—"}`);
console.log(`  Centro Clínico: ${result.recursosCentroClinico.length} recursos`);
console.log("\n── TEACHING STRATEGY ──");
if (teaching.alertaSeguranca) console.log(teaching.alertaSeguranca);
console.log(`Prioridade principal : ${teaching.prioridadePrincipal.titulo} (${teaching.prioridadePrincipal.severidade})`);
console.log(`Modo pedagógico       : ${teaching.modoPedagogico}`);
console.log("Objetivos da sessão   :");
teaching.objetivos.slice(0, 3).forEach((o) => console.log(`  • ${o}`));
console.log("Plano em 3 passos     :");
teaching.planoTresPassos.forEach((p) => console.log(`  ${p}`));
console.log("Erros a ignorar agora :", teaching.errosParaIgnorarAgora.join(" | ") || "nenhum");

console.log("\n── PROFESSOR PERSONA + SESSÃO ──");
console.log(`Persona escolhida : ${personaDecision.persona.nome} (${personaDecision.persona.key})`);
console.log(`Justificativa     : ${personaDecision.justificativa}`);
console.log(`Tom               : ${personaDecision.tom}`);
console.log(`Duração estimada  : ${sessionConfig.estimatedDurationMinutes} min`);
console.log(`Máx. perguntas    : ${sessionConfig.maxQuestions}`);
console.log(`Máx. conceitos    : ${sessionConfig.maxConcepts}`);
console.log(`Mini-quiz         : ${sessionConfig.generateMiniQuiz ? "sim" : "não"}`);
console.log(`Revisão final     : ${sessionConfig.reviewAtEnd ? "sim" : "não"}`);
console.log(`Parar após correção crítica: ${sessionConfig.stopAfterCriticalCorrection ? "sim" : "não"}`);

console.log("\n── LESSON PLAN + TEACHING ACTIONS ──");
console.log(`Objetivo final    : ${lessonPlan.objetivoFinal}`);
console.log(`Duração estimada  : ${lessonPlan.duracaoEstimadaMin} min`);
console.log(`Nº de actions     : ${lessonPlan.actions.length}`);
console.log("Ordem das actions :");
lessonPlan.actions.forEach((a, i) => console.log(`  ${String(i + 1).padStart(2, " ")}. ${a.tipo}${a.checkpoint ? "  ⏸" : ""}`));
console.log("Sequência (resumo):", lessonPlan.actions.map((a) => a.tipo).join(" → "));
console.log(`Conceitos incluídos: ${lessonPlan.conceitosIncluidos.join("; ") || "—"}`);
console.log(`Perguntas incluídas: ${lessonPlan.perguntasIncluidas.length}`);
lessonPlan.perguntasIncluidas.forEach((q) => console.log(`  ? ${q}`));
console.log(`Recursos usados    : ${lessonPlan.recursosUsados.map((r) => r.titulo).join(", ") || "—"}`);
console.log(`Checkpoints        : ${lessonPlan.checkpoints.length}`);
lessonPlan.checkpoints.forEach((c) => console.log(`  ⏸ ${c}`));

console.log("\n── GOLD STANDARD — TRUTH LAYERS (Fase 14) ──");
console.log("Camadas carregadas :", truthLayers.camadas.join(", "));
console.log("Clinical    : dx=" + truthLayers.clinical.diagnostico + " | diferenciais=" + truthLayers.clinical.diferenciais.length + " | gravidade=" + truthLayers.clinical.sinaisDeGravidade.length);
console.log("Educational : conceitos essenciais=" + truthLayers.educational.conceitosEssenciais.length);
console.log("Evaluation  : obrigatórios=" + truthLayers.evaluation.criteriosObrigatorios.length + " | críticos=" + truthLayers.evaluation.criteriosCriticos.length);
console.log("Teaching    : mini-quiz=" + truthLayers.teaching.miniQuiz.length + " | modoErroCritico=" + truthLayers.teaching.modoSeErroCritico);
console.log("Resource    : sons=" + truthLayers.resource.sons + " imagens=" + truthLayers.resource.imagens + " exames=" + truthLayers.resource.exames + " fluxos=" + truthLayers.resource.fluxos + " scores=" + truthLayers.resource.scores);
console.log("Influência no Teaching Engine : perguntas socráticas e erros a explorar vêm da Teaching/Evaluation Truth.");
console.log("Influência no Lesson Planner  : recursos (show_*_reference) vêm da Resource Truth; mini-quiz vem da Teaching Truth.");

console.log("\n── STUDENT MODEL — PERFIL LONGITUDINAL (Fase 15) ──");
console.log("Nível/confiança   :", studentModel.profile.nivel, "| confiança", Math.round(studentModel.confiancaEstimada * 100) + "% | evolução", studentModel.evolucao);
console.log("Forças            :", studentModel.topForcas.join("; "));
console.log("Fraquezas         :", studentModel.topFraquezas.join("; "));
console.log("Erro recorrente   :", studentModel.errosRecorrentes.map((e) => `${e.descricao} (${e.ocorrencias}x)`).join("; "));
console.log("Risco pedagógico  :", studentModel.riscoPedagogico.tipo, "-", studentModel.riscoPedagogico.descricao);
console.log("Prioridade modificada pelo histórico:", teaching.ajustePorHistorico);
console.log("Persona escolhida :", personaDecision.persona.nome, "(reforçada pelo erro recorrente de segurança)");
const actionsHist = lessonPlan.actions.filter((a) => ["reinforce_progress", "review_recurring_error", "compare_with_previous_attempts"].includes(a.tipo)).map((a) => a.tipo);
console.log("Actions add. por histórico:", actionsHist.join(", "));
console.log("Sequência do plano:", lessonPlan.actions.map((a) => a.tipo).join(" → "));

console.log("\n── LEARNING SESSION — ESTADO ATUAL (Fase 16) ──");
console.log("Modo da sessão    :", learningSession.modo, "| tempo", learningSession.tempoDisponivelMin + "min | curto:", learningSession.curto);
console.log("Estado emocional  :", learningSession.emocao, "| frustração", Math.round(learningSession.frustracao * 100) + "% | confiança", Math.round(learningSession.confianca * 100) + "%");
console.log("Carga cognitiva   :", learningSession.cargaCognitivaRecomendada, "| máx prioridades:", learningSession.maxPrioridades);
console.log("Prioridade modificada pela sessão:", teaching.ajustePorSessao);
console.log("Persona escolhida :", personaDecision.persona.nome, "(" + personaDecision.justificativa + ")");
const actionsSessao = lessonPlan.actions.filter((a) => ["calibrate_session_goal", "reduce_cognitive_load", "reinforce_confidence", "timeboxed_review", "challenge_student", "close_session_early"].includes(a.tipo)).map((a) => a.tipo);
console.log("Actions add. pela sessão:", actionsSessao.join(", "));
console.log("Alerta            :", learningSession.alerta);

console.log("\n── PROFESSOR LESSON — ROTEIRO ÚNICO (Fase 18) ──");
console.log("Título      :", professorLesson.header.titulo);
console.log("Prioridade  :", professorLesson.diagnostico.prioridadePrincipal);
console.log("Persona     :", professorLesson.diagnostico.persona, "| modo", professorLesson.diagnostico.modoPedagogico, "| ~" + professorLesson.diagnostico.duracaoEstimadaMin + "min");
console.log("Nº actions  :", professorLesson.actions.length);
console.log("Opening line:", professorLesson.openingLine.texto);
console.log("Recursos    :", professorLesson.recursos.map((r) => `${r.dominio}:${r.titulo}`).join(", "));
console.log("Próximo passo:", professorLesson.proximoPasso.descricao);

console.log("\n── LESSON FLOW → LESSON STEPS (Fase 19) ──");
console.log("Total de steps    :", lessonFlow.totalSteps, "| interativos:", lessonFlow.interactiveSteps, "| c/recurso:", lessonFlow.resourceSteps, "| checkpoints:", lessonFlow.checkpoints.length);
console.log("Navegação         : seq=" + lessonFlow.requiresSequentialExecution, "| pause=" + lessonFlow.canPause, "| resume=" + lessonFlow.canResume, "| skipOpt=" + lessonFlow.canSkipOptionalSteps, "| branches=" + lessonFlow.branches.length);
console.log("Primeiro step     :", lessonFlow.firstStepId, "→", lessonFlow.steps[0].type);
const wait = lessonFlow.steps.find((s) => s.requiresInput);
console.log("Step exige resposta:", wait ? `${wait.id} (${wait.type}) — fallback: ${wait.fallbackIfNoAnswer}` : "(nenhum neste plano)");
console.log("Último step        :", lessonFlow.finalStepId, "→", lessonFlow.steps[lessonFlow.steps.length - 1].type);
console.log("Sequência          :", lessonFlow.steps.map((s) => s.type).join(" → "));

console.log("\nPrompts gerados:", Object.keys(prompts).join(", "));
console.log("Ordem:", ordemComposicao.join(" → "));
console.log(`Tamanho total dos prompts: ${Object.values(prompts).join("").length} chars`);
console.log("Campos ausentes:", camposAusentes.join(", "));

const suficiente = result.contextoResumo.temAvaliacao && result.contextoResumo.recursosConhecimento > 0 && studyPlan.itens.length > 0 && Object.values(prompts).every((p) => p.length > 0);
console.log("\n" + L);
console.log(`CONTEXTO SUFICIENTE PARA CHAMAR UMA IA NO FUTURO? ${suficiente ? "✅ SIM" : "❌ NÃO"}`);
console.log(L);

// ── Salvar JSON ──
const out = path.join(root, "docs/professor-ia-dry-run-pac.json");
fs.writeFileSync(out, JSON.stringify({ geradoEm: new Date().toISOString(), observacao: "Dry run estrutural (sem IA/endpoint/chat). HealthBench é MOCK. dry-run.ts é a prova type-checked da arquitetura real.", contextoSuficienteParaIA: suficiente, result }, null, 2), "utf8");
console.log("JSON salvo em:", path.relative(root, out));
