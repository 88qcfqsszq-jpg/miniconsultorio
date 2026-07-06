// ============================================================================
// Professor IA — STUDENT MODEL (Fase 15)
// ----------------------------------------------------------------------------
// Perfil LONGITUDINAL do aluno: consolida tentativas/avaliações passadas num
// modelo estrutural (forças, fraquezas, erros recorrentes, evolução, risco).
// PURO e determinístico. NÃO chama IA, NÃO acessa banco, NÃO cria login nem
// persistência. Preparação para o Professor IA personalizar o ensino no futuro.
// ============================================================================

import type { CompetencyAxis } from "./types";

export const STUDENT_MODEL_SCHEMA_VERSION = "1.0.0" as const;

export type StudentLevel = "iniciante" | "intermediario" | "avancado";
export type TrendDirection = "melhorando" | "estavel" | "piorando";

// ── Perfil ───────────────────────────────────────────────────────────────────
export interface StudentProfile {
  userId?: string;
  nome?: string;
  nivel: StudentLevel;
  semestre?: number;
  objetivos: string[];
}

// ── Snapshot de competência (longitudinal) ───────────────────────────────────
export interface StudentCompetencySnapshot {
  eixo: CompetencyAxis;
  scoreMedio: number; // 0..1 média das tentativas
  ultimaScore?: number; // 0..1 da tentativa mais recente
  tendencia: TrendDirection;
  amostras: number;
}

// ── Desempenho longitudinal / curva de evolução ──────────────────────────────
export interface StudentProgressTrend {
  direcao: TrendDirection;
  delta: number; // variação de nota (atual - inicial), em pontos (0..20)
  descricao: string;
}

export interface StudentLongitudinalPerformance {
  pontos: Array<{ ordem: number; casoId?: string | number; titulo?: string; nota: number; data?: string }>;
  notaMedia: number;
  notaInicial?: number;
  notaAtual?: number;
  tendencia: StudentProgressTrend;
}

// ── Erros recorrentes ────────────────────────────────────────────────────────
export interface StudentRecurringError {
  chave: string;
  descricao: string;
  eixo?: CompetencyAxis;
  ocorrencias: number;
  persistente: boolean; // >= 2 ocorrências
  exemplos: string[];
  ultimaOcorrenciaCasoId?: string | number;
}

// ── Resumo de uma tentativa ──────────────────────────────────────────────────
export interface StudentCaseAttemptSummary {
  casoId: string | number;
  titulo?: string;
  sistema?: string;
  nota: number; // 0..20
  passou: boolean;
  data?: string;
  errosCriticos: string[];
  eixosFracos: CompetencyAxis[];
  tags: string[];
}

// ── Dificuldades por dimensão ────────────────────────────────────────────────
export interface StudentSystemWeakness {
  sistema: string;
  scoreMedio: number; // 0..1
  ocorrencias: number;
}
export interface StudentExamWeakness {
  exame: string;
  ocorrencias: number;
  descricao?: string;
}

// ── Preferências / revisão / risco ───────────────────────────────────────────
export interface StudentLearningPreference {
  estilo: "socratico" | "explicativo" | "diretivo" | "misto";
  ritmo: "lento" | "moderado" | "rapido";
  prefereExemplos: boolean;
  observacao?: string;
}

export interface StudentReviewNeed {
  tema: string;
  motivo: string;
  prioridade: 1 | 2 | 3;
  eixo?: CompetencyAxis;
}

export interface StudentRiskPattern {
  tipo: "erro_critico_recorrente" | "queda_desempenho" | "estagnacao" | "inseguranca" | "sem_risco";
  descricao: string;
  severidade: "alta" | "media" | "baixa";
}

// ── Modelo consolidado ───────────────────────────────────────────────────────
export interface StudentModel {
  schemaVersion: string;
  geradoEm: string;
  profile: StudentProfile;
  competencias: StudentCompetencySnapshot[];
  competenciasFortes: StudentCompetencySnapshot[];
  competenciasFracas: StudentCompetencySnapshot[];
  errosRecorrentes: StudentRecurringError[];
  casosRealizados: StudentCaseAttemptSummary[];
  casosReprovados: StudentCaseAttemptSummary[];
  dificuldadePorSistema: StudentSystemWeakness[];
  dificuldadePorExame: StudentExamWeakness[];
  dificuldadePorRaciocinio: number; // 0..1 (score médio do eixo raciocínio)
  dificuldadePorConduta: number; // 0..1 (score médio do eixo conduta)
  tempoMedioSegundos?: number;
  curvaEvolucao: StudentLongitudinalPerformance;
  revisaoPendente: StudentReviewNeed[];
  confiancaEstimada: number; // 0..1
  historicoResumido: string;
  preferencias: StudentLearningPreference;
  riscos: StudentRiskPattern[];
}

export interface StudentModelSummary {
  topForcas: string[];
  topFraquezas: string[];
  topErrosRecorrentes: string[];
  temasParaRevisao: string[];
  riscoPedagogico: StudentRiskPattern;
  recomendacaoDeFoco: string;
}

// ── Entrada do builder ───────────────────────────────────────────────────────
export interface StudentAttemptInput {
  casoId: string | number;
  titulo?: string;
  sistema?: string;
  nota: number; // 0..20
  passou?: boolean;
  data?: string;
  tempoSegundos?: number;
  competencias?: Array<{ eixo: CompetencyAxis; score01: number }>;
  errosCriticos?: string[];
  examesFracos?: string[];
  tags?: string[];
}

export interface StudentModelInput {
  profile?: Partial<StudentProfile>;
  attempts: StudentAttemptInput[];
  preferencias?: Partial<StudentLearningPreference>;
}

// ── Utilitários ──────────────────────────────────────────────────────────────
const EIXOS: CompetencyAxis[] = [
  "comunicacao", "anamnese", "exameFisico", "examesComplementares", "raciocinioDiagnostico", "condutaSeguranca",
];
const EIXO_LABEL: Record<CompetencyAxis, string> = {
  comunicacao: "Comunicação", anamnese: "Anamnese", exameFisico: "Exame físico",
  examesComplementares: "Exames complementares", raciocinioDiagnostico: "Raciocínio diagnóstico", condutaSeguranca: "Conduta e segurança",
};

function media(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

function tendenciaDe(valores: number[], limiar = 0.06): TrendDirection {
  if (valores.length < 2) return "estavel";
  const metade = Math.floor(valores.length / 2);
  const ini = media(valores.slice(0, Math.max(1, metade)));
  const fim = media(valores.slice(metade));
  if (fim - ini > limiar) return "melhorando";
  if (ini - fim > limiar) return "piorando";
  return "estavel";
}

/** Normaliza o texto de um erro numa chave estável para detectar recorrência. */
function chaveErro(texto: string): { chave: string; eixo?: CompetencyAxis } {
  const t = texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  if (/dose|antibi|antimicrob|prescri/.test(t)) return { chave: "antibiotico_dose", eixo: "condutaSeguranca" };
  if (/rx|radiograf|imagem|torax/.test(t)) return { chave: "exame_imagem", eixo: "examesComplementares" };
  if (/spo2|satura|oximetr|sinais vitais|hipox/.test(t)) return { chave: "sinais_vitais", eixo: "exameFisico" };
  if (/alarme|retorno|orient|seguimento/.test(t)) return { chave: "orientacao_alarme", eixo: "condutaSeguranca" };
  if (/diferencial|hipotese|raciocin/.test(t)) return { chave: "raciocinio_diferencial", eixo: "raciocinioDiagnostico" };
  if (/anamnese|investig|antecedent|alergia/.test(t)) return { chave: "anamnese_incompleta", eixo: "anamnese" };
  return { chave: t.slice(0, 40).replace(/\s+/g, "_"), eixo: undefined };
}

// ── Builder principal ────────────────────────────────────────────────────────
/**
 * Consolida tentativas passadas num StudentModel. Puro e determinístico
 * (exceto `geradoEm`). Sem banco, sem IA, sem persistência.
 */
export function buildStudentModel(input: StudentModelInput): StudentModel {
  const attempts = [...input.attempts].sort((a, b) => {
    if (a.data && b.data) return a.data.localeCompare(b.data);
    return 0;
  });

  // Snapshots por eixo.
  const competencias: StudentCompetencySnapshot[] = EIXOS.map((eixo) => {
    const serie = attempts
      .map((a) => a.competencias?.find((c) => c.eixo === eixo)?.score01)
      .filter((v): v is number => typeof v === "number");
    return {
      eixo,
      scoreMedio: Math.round(media(serie) * 100) / 100,
      ultimaScore: serie.length ? serie[serie.length - 1] : undefined,
      tendencia: tendenciaDe(serie),
      amostras: serie.length,
    };
  }).filter((s) => s.amostras > 0);

  const competenciasFortes = [...competencias].filter((c) => c.scoreMedio >= 0.75).sort((a, b) => b.scoreMedio - a.scoreMedio);
  const competenciasFracas = [...competencias].filter((c) => c.scoreMedio < 0.6).sort((a, b) => a.scoreMedio - b.scoreMedio);

  // Erros recorrentes.
  const mapaErros = new Map<string, StudentRecurringError>();
  for (const a of attempts) {
    for (const e of a.errosCriticos ?? []) {
      const { chave, eixo } = chaveErro(e);
      const atual = mapaErros.get(chave) ?? { chave, descricao: e, eixo, ocorrencias: 0, persistente: false, exemplos: [] as string[] };
      atual.ocorrencias += 1;
      if (!atual.exemplos.includes(e)) atual.exemplos.push(e);
      atual.ultimaOcorrenciaCasoId = a.casoId;
      mapaErros.set(chave, atual);
    }
  }
  const errosRecorrentes = [...mapaErros.values()]
    .map((e) => ({ ...e, persistente: e.ocorrencias >= 2 }))
    .sort((a, b) => b.ocorrencias - a.ocorrencias);

  // Tentativas.
  const casosRealizados: StudentCaseAttemptSummary[] = attempts.map((a) => ({
    casoId: a.casoId,
    titulo: a.titulo,
    sistema: a.sistema,
    nota: a.nota,
    passou: a.passou ?? a.nota >= 12,
    data: a.data,
    errosCriticos: a.errosCriticos ?? [],
    eixosFracos: (a.competencias ?? []).filter((c) => c.score01 < 0.6).map((c) => c.eixo),
    tags: a.tags ?? [],
  }));
  const casosReprovados = casosRealizados.filter((c) => !c.passou);

  // Dificuldade por sistema.
  const sistemaMap = new Map<string, number[]>();
  for (const a of attempts) {
    if (!a.sistema) continue;
    const arr = sistemaMap.get(a.sistema) ?? [];
    arr.push(a.nota / 20);
    sistemaMap.set(a.sistema, arr);
  }
  const dificuldadePorSistema: StudentSystemWeakness[] = [...sistemaMap.entries()]
    .map(([sistema, notas]) => ({ sistema, scoreMedio: Math.round(media(notas) * 100) / 100, ocorrencias: notas.length }))
    .sort((a, b) => a.scoreMedio - b.scoreMedio);

  // Dificuldade por exame.
  const exameMap = new Map<string, number>();
  for (const a of attempts) for (const ex of a.examesFracos ?? []) exameMap.set(ex, (exameMap.get(ex) ?? 0) + 1);
  const dificuldadePorExame: StudentExamWeakness[] = [...exameMap.entries()]
    .map(([exame, ocorrencias]) => ({ exame, ocorrencias }))
    .sort((a, b) => b.ocorrencias - a.ocorrencias);

  const scoreEixo = (eixo: CompetencyAxis) => competencias.find((c) => c.eixo === eixo)?.scoreMedio ?? 1;
  const dificuldadePorRaciocinio = scoreEixo("raciocinioDiagnostico");
  const dificuldadePorConduta = scoreEixo("condutaSeguranca");

  const temposValidos = attempts.map((a) => a.tempoSegundos).filter((v): v is number => typeof v === "number");
  const tempoMedioSegundos = temposValidos.length ? Math.round(media(temposValidos)) : undefined;

  // Curva de evolução.
  const notas = attempts.map((a) => a.nota);
  const notaInicial = notas[0];
  const notaAtual = notas[notas.length - 1];
  const delta = notaInicial != null && notaAtual != null ? Math.round((notaAtual - notaInicial) * 10) / 10 : 0;
  const direcao = tendenciaDe(notas, 0.8);
  const curvaEvolucao: StudentLongitudinalPerformance = {
    pontos: attempts.map((a, i) => ({ ordem: i + 1, casoId: a.casoId, titulo: a.titulo, nota: a.nota, data: a.data })),
    notaMedia: Math.round(media(notas) * 10) / 10,
    notaInicial,
    notaAtual,
    tendencia: {
      direcao,
      delta,
      descricao: direcao === "melhorando" ? `Evolução positiva (+${delta} pontos).` : direcao === "piorando" ? `Queda de desempenho (${delta} pontos).` : "Desempenho estável.",
    },
  };

  // Revisão pendente (erros persistentes + sistemas fracos).
  const revisaoPendente: StudentReviewNeed[] = [];
  for (const e of errosRecorrentes.filter((x) => x.persistente)) {
    revisaoPendente.push({ tema: e.descricao, motivo: `Erro recorrente (${e.ocorrencias}x) — revisão longitudinal necessária.`, prioridade: 1, eixo: e.eixo });
  }
  for (const s of dificuldadePorSistema.filter((x) => x.scoreMedio < 0.6)) {
    revisaoPendente.push({ tema: `Sistema ${s.sistema}`, motivo: `Desempenho baixo repetido no sistema (${Math.round(s.scoreMedio * 100)}%).`, prioridade: 2 });
  }

  // Confiança estimada (nota média + tendência).
  let confiancaEstimada = media(notas) / 20;
  if (direcao === "melhorando") confiancaEstimada = Math.min(1, confiancaEstimada + 0.08);
  if (direcao === "piorando") confiancaEstimada = Math.max(0, confiancaEstimada - 0.08);
  confiancaEstimada = Math.round(confiancaEstimada * 100) / 100;

  // Preferências.
  const preferencias: StudentLearningPreference = {
    estilo: input.preferencias?.estilo ?? "misto",
    ritmo: input.preferencias?.ritmo ?? "moderado",
    prefereExemplos: input.preferencias?.prefereExemplos ?? true,
    observacao: input.preferencias?.observacao,
  };

  // Riscos pedagógicos.
  const riscos: StudentRiskPattern[] = [];
  const erroCriticoRecorrente = errosRecorrentes.find((e) => e.persistente && e.eixo === "condutaSeguranca");
  if (erroCriticoRecorrente) riscos.push({ tipo: "erro_critico_recorrente", descricao: `Erro crítico de segurança recorrente: ${erroCriticoRecorrente.descricao} (${erroCriticoRecorrente.ocorrencias}x).`, severidade: "alta" });
  if (direcao === "piorando") riscos.push({ tipo: "queda_desempenho", descricao: curvaEvolucao.tendencia.descricao, severidade: "media" });
  if (direcao === "estavel" && curvaEvolucao.notaMedia < 12) riscos.push({ tipo: "estagnacao", descricao: "Desempenho estável abaixo do esperado.", severidade: "media" });
  if (confiancaEstimada < 0.4) riscos.push({ tipo: "inseguranca", descricao: "Confiança estimada baixa.", severidade: "media" });
  if (riscos.length === 0) riscos.push({ tipo: "sem_risco", descricao: "Sem padrão de risco relevante.", severidade: "baixa" });

  // Perfil.
  const profile: StudentProfile = {
    userId: input.profile?.userId,
    nome: input.profile?.nome,
    nivel: input.profile?.nivel ?? (curvaEvolucao.notaMedia >= 16 ? "avancado" : curvaEvolucao.notaMedia >= 11 ? "intermediario" : "iniciante"),
    semestre: input.profile?.semestre,
    objetivos: input.profile?.objetivos ?? [],
  };

  const historicoResumido =
    `${casosRealizados.length} caso(s) realizado(s), ${casosReprovados.length} abaixo do esperado. ` +
    `Nota média ${curvaEvolucao.notaMedia}/20 (${curvaEvolucao.tendencia.direcao}). ` +
    `${errosRecorrentes.filter((e) => e.persistente).length} erro(s) recorrente(s).`;

  return {
    schemaVersion: STUDENT_MODEL_SCHEMA_VERSION,
    geradoEm: new Date().toISOString(),
    profile,
    competencias,
    competenciasFortes,
    competenciasFracas,
    errosRecorrentes,
    casosRealizados,
    casosReprovados,
    dificuldadePorSistema,
    dificuldadePorExame,
    dificuldadePorRaciocinio,
    dificuldadePorConduta,
    tempoMedioSegundos,
    curvaEvolucao,
    revisaoPendente,
    confiancaEstimada,
    historicoResumido,
    preferencias,
    riscos,
  };
}

// ── Resumo ───────────────────────────────────────────────────────────────────
/** Gera um resumo estruturado do StudentModel (para o Professor IA). */
export function summarizeStudentModel(sm: StudentModel): StudentModelSummary {
  const topForcas = sm.competenciasFortes.slice(0, 3).map((c) => `${EIXO_LABEL[c.eixo]} (${Math.round(c.scoreMedio * 100)}%)`);
  const topFraquezas = sm.competenciasFracas.slice(0, 3).map((c) => `${EIXO_LABEL[c.eixo]} (${Math.round(c.scoreMedio * 100)}%)`);
  const topErrosRecorrentes = sm.errosRecorrentes.slice(0, 3).map((e) => `${e.descricao}${e.persistente ? ` (${e.ocorrencias}x)` : ""}`);
  const temasParaRevisao = sm.revisaoPendente.slice(0, 4).map((r) => r.tema);

  const riscoPedagogico = [...sm.riscos].sort((a, b) => sev(b.severidade) - sev(a.severidade))[0];

  const foco =
    riscoPedagogico.tipo === "erro_critico_recorrente"
      ? "Priorizar a correção do erro crítico recorrente de segurança com abordagem diretiva."
      : riscoPedagogico.tipo === "queda_desempenho"
        ? "Revisão guiada para reverter a queda de desempenho."
        : sm.competenciasFracas[0]
          ? `Reforçar ${EIXO_LABEL[sm.competenciasFracas[0].eixo]} e consolidar os pontos fortes.`
          : "Consolidação e refinamento — desempenho consistente.";

  return { topForcas, topFraquezas, topErrosRecorrentes, temasParaRevisao, riscoPedagogico, recomendacaoDeFoco: foco };
}

function sev(s: StudentRiskPattern["severidade"]): number {
  return s === "alta" ? 3 : s === "media" ? 2 : 1;
}
