// ============================================================================
// Utilitários de detecção textual para rubricas por diagnóstico
// ----------------------------------------------------------------------------
// Funções tolerantes a acentuação/variações, reutilizáveis por todas as
// rubricas. Operam sobre o ContextoAvaliacaoOSCE (= ContextoConsistencia).
// ============================================================================

import type { ContextoAvaliacaoOSCE } from "./tipos";
import { temSinaisVitaisCompletos, radiografiaSolicitadaOuVista } from "../feedback-consistency";

export function normalizarTexto(input: unknown): string {
  return (input ?? "")
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Junta todo o contexto textual do atendimento em uma string normalizada. */
export function juntarContextoTexto(ctx: ContextoAvaliacaoOSCE): string {
  const partes = [
    ctx.anamneseTexto,
    ctx.correlacaoTexto,
    ctx.examesTexto,
    ctx.achadosTexto,
    ctx.condutaTexto,
    ctx.diagnosticoEsperado,
    (ctx.diferenciaisInformados ?? []).join(" "),
  ];
  return normalizarTexto(partes.filter(Boolean).join(" "));
}

export function contemAlgum(texto: string, termos: string[]): boolean {
  const t = normalizarTexto(texto);
  return termos.some((termo) => t.includes(normalizarTexto(termo)));
}

export function evidenciasEncontradas(texto: string, termos: string[]): string[] {
  const t = normalizarTexto(texto);
  return termos.filter((termo) => t.includes(normalizarTexto(termo)));
}

export function contarTermos(texto: string, termos: string[]): number {
  return evidenciasEncontradas(texto, termos).length;
}

// --------------------------------------------------------------------------
// Detectores clínicos específicos
// --------------------------------------------------------------------------
export function detectarSinaisVitaisCompletos(ctx: ContextoAvaliacaoOSCE): boolean {
  if (temSinaisVitaisCompletos(ctx.sinaisVitais)) return true;
  // fallback textual: PA + FC + FR + Temp + SpO₂ mencionados
  const t = juntarContextoTexto(ctx);
  const pa = /\bpa\b|press[ãa]o|press[ãa]o arterial/.test(t);
  const fc = /\bfc\b|frequencia cardiaca|batimentos/.test(t);
  const fr = /\bfr\b|frequencia respiratoria/.test(t);
  const temp = /\btemp\b|temperatura|febre|\b3[5-9][.,]?\d?\b/.test(t);
  const spo2 = /spo2|\bsat\b|satura|oximetria/.test(t);
  return pa && fc && fr && temp && spo2;
}

export function detectarRXTorax(ctx: ContextoAvaliacaoOSCE): boolean {
  if (radiografiaSolicitadaOuVista(ctx)) return true;
  const t = juntarContextoTexto(ctx);
  return contemAlgum(t, [
    "rx", "raio x", "raio-x", "radiografia", "radiografia de torax",
    "chest x-ray", "x-ray chest", "opacidade", "infiltrado", "consolidacao",
    "imagem de torax", "exame de imagem visualizado", "open-i", "openi",
  ]);
}

export function detectarECG(ctx: ContextoAvaliacaoOSCE): boolean {
  return contemAlgum(juntarContextoTexto(ctx), [
    "ecg", "eletrocardiograma", "eletro", "12 derivacoes", "doze derivacoes",
    "supradesnivelamento", "supra de st", "infra de st", "alteracao de st",
    "inversao de t", "onda t", "bre novo", "ritmo cardiaco",
  ]);
}

export function detectarTroponina(ctx: ContextoAvaliacaoOSCE): boolean {
  return contemAlgum(juntarContextoTexto(ctx), [
    "troponina", "enzimas cardiacas", "marcador cardiaco", "ck-mb", "ckmb",
    "cpk-mb", "cpkmb", "necrose miocardica", "curva enzimatica",
  ]);
}

export function detectarAAS(ctx: ContextoAvaliacaoOSCE): boolean {
  return contemAlgum(juntarContextoTexto(ctx), [
    "aas", "aspirina", "acido acetilsalicilico", "antiagregante", "antiagregacao",
    "clopidogrel", "ticagrelor",
  ]);
}

export function detectarNitrato(ctx: ContextoAvaliacaoOSCE): boolean {
  return contemAlgum(juntarContextoTexto(ctx), [
    "nitrato", "nitroglicerina", "isordil", "dinitrato", "mononitrato", "isossorbida",
  ]);
}

export function detectarAnticoagulacaoSCA(ctx: ContextoAvaliacaoOSCE): boolean {
  return contemAlgum(juntarContextoTexto(ctx), [
    "heparina", "anticoagulacao", "anticoagulante", "enoxaparina", "fondaparinux",
    "clexane", "terapia antitrombotica", "antitrombotic",
  ]);
}

export function detectarEmergenciaEncaminhamento(ctx: ContextoAvaliacaoOSCE): boolean {
  return contemAlgum(juntarContextoTexto(ctx), [
    "emergencia", "hospital", "pronto-socorro", "pronto socorro", "encaminhar",
    "samu", "upa", "internar", "internacao", "monitorizacao", "monitorizar",
    "sala vermelha", "unidade coronariana", "nao liberar", "observacao", "acesso venoso",
  ]);
}

export function detectarOxigenioSeHipoxemia(ctx: ContextoAvaliacaoOSCE): boolean {
  return contemAlgum(juntarContextoTexto(ctx), [
    "oxigenio", "\bo2\b", "cateter nasal", "mascara", "saturacao baixa",
    "hipoxemia", "spo2 baixa",
  ]);
}

/** Orientação de sinais de alarme / gravidade respiratória + retorno (linguagem prática). */
export function detectarOrientacaoSinaisAlarmeRespiratorio(
  ctx: ContextoAvaliacaoOSCE
): boolean {
  const t = juntarContextoTexto(ctx);
  return contemAlgum(t, [
    "sinais de piora", "sinais de alarme", "persistencia da febre", "febre persistente",
    "aumento da falta de ar", "falta de ar intensa", "piora da falta de ar",
    "piora clinica", "piora dos sintomas", "se piorar", "se piorarem",
    "saturacao baixa", "oxigenacao baixa", "labios roxos", "cianose", "tontura",
    "desmaio", "confusao", "escarro com sangue", "sangue no escarro", "hemoptise",
    "procurar hospital", "procurar emergencia", "procure a emergencia",
    "emergencia imediatamente", "pronto-socorro", "pronto socorro",
    "retornar se piorar", "reavaliar se piora", "procure imediatamente",
  ]);
}
