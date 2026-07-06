// ============================================================================
// CAMADA GLOBAL POR COMPETÊNCIA — helpers reutilizáveis por qualquer diagnóstico
// ----------------------------------------------------------------------------
// Lógica estrutural comum (NÃO clínica de uma doença específica). Cada helper
// recebe o contexto + listas de termos da doença e lê o diálogo/anamnese,
// exames, exame físico, conduta e SOAP — sem depender de campos formais.
// Reutilizáveis por PAC, SCA e novos diagnósticos (via template).
// ============================================================================

import type { ContextoAvaliacaoOSCE } from "./tipos";
import {
  normalizarTexto,
  contemAlgum,
  contarTermos,
  juntarContextoTexto,
  detectarSinaisVitaisCompletos,
} from "./utils-deteccao";

export { detectarSinaisVitaisCompletos };

// ---- Textos por canal (normalizados) ---------------------------------------
const anamneseDe = (ctx: ContextoAvaliacaoOSCE) => normalizarTexto(ctx.anamneseTexto);
const correlacaoDe = (ctx: ContextoAvaliacaoOSCE) => normalizarTexto(ctx.correlacaoTexto);
const examesDe = (ctx: ContextoAvaliacaoOSCE) =>
  normalizarTexto(`${ctx.examesTexto ?? ""} ${ctx.condutaTexto ?? ""} ${ctx.correlacaoTexto ?? ""}`);
const condutaDe = (ctx: ContextoAvaliacaoOSCE) =>
  normalizarTexto(`${ctx.condutaTexto ?? ""} ${ctx.correlacaoTexto ?? ""}`);
const achadosDe = (ctx: ContextoAvaliacaoOSCE) =>
  normalizarTexto(`${ctx.achadosTexto ?? ""} ${ctx.correlacaoTexto ?? ""}`);

// ===========================================================================
// COMUNICAÇÃO
// ===========================================================================
export function detectarApresentacaoOuAcolhimento(ctx: ContextoAvaliacaoOSCE): boolean {
  return contemAlgum(`${anamneseDe(ctx)} ${condutaDe(ctx)}`, [
    "bom dia", "boa tarde", "boa noite", "sou o", "sou a", "dr ", "dra ",
    "meu nome", "vou te atender", "vou atender", "como voce esta", "como se sente",
    "prazer", "fique tranquil", "vou te ajudar", "pode ficar calm",
  ]);
}

export function detectarExplicacaoHipoteseAcessivel(
  ctx: ContextoAvaliacaoOSCE,
  termosHipotese: string[]
): boolean {
  const t = `${anamneseDe(ctx)} ${correlacaoDe(ctx)} ${condutaDe(ctx)}`;
  return contemAlgum(t, termosHipotese) ||
    contemAlgum(t, ["voce esta com", "voce tem", "pode ser", "suspeita", "quadro de"]);
}

export function detectarOrientacaoTratamentoOuReavaliacao(ctx: ContextoAvaliacaoOSCE): boolean {
  return contemAlgum(condutaDe(ctx), [
    "tratamento", "vamos tratar", "vou receitar", "vou prescrever", "medicacao",
    "retorno", "reavalia", "voltar", "acompanhamento", "seguimento",
  ]);
}

export function detectarSinaisAlarmeOuRetorno(ctx: ContextoAvaliacaoOSCE): boolean {
  return contemAlgum(juntarContextoTexto(ctx), [
    "sinais de piora", "sinais de alarme", "se piorar", "se piorarem",
    "procurar hospital", "procurar emergencia", "procure a emergencia",
    "emergencia imediatamente", "pronto-socorro", "pronto socorro",
    "retornar se piorar", "reavaliar se piora", "procure imediatamente",
    "sinais de gravidade", "volte se",
  ]);
}

// ===========================================================================
// EXAME FÍSICO
// ===========================================================================
export function detectarSpo2OuOximetria(ctx: ContextoAvaliacaoOSCE): boolean {
  if (detectarSinaisVitaisCompletos(ctx)) return true;
  return contemAlgum(juntarContextoTexto(ctx), ["spo2", "satura", "oximetria", "saturacao"]);
}

/** Exame do sistema principal realizado (ausculta/palpação/inspeção do alvo). */
export function detectarExameSistemaPrincipal(
  ctx: ContextoAvaliacaoOSCE,
  termos: string[]
): boolean {
  return contemAlgum(achadosDe(ctx), termos);
}

export function detectarGravidadeOuInstabilidade(
  ctx: ContextoAvaliacaoOSCE,
  termos: string[]
): boolean {
  return contemAlgum(`${achadosDe(ctx)} ${correlacaoDe(ctx)}`, termos);
}

// ===========================================================================
// EXAMES COMPLEMENTARES (regra global: solicitado OU visualizado OU interpretado)
// ===========================================================================
export function detectarExameSolicitadoVisualizadoOuInterpretado(
  ctx: ContextoAvaliacaoOSCE,
  termosExame: string[]
): boolean {
  // Solicitado/visualizado: examesTexto inclui imagem visualizada (Open-i) e pedidos.
  // Interpretado: correlacaoTexto inclui falas do aluno sobre o exame.
  return contemAlgum(examesDe(ctx), termosExame) || contemAlgum(correlacaoDe(ctx), termosExame);
}

export function detectarInterpretacaoExame(
  ctx: ContextoAvaliacaoOSCE,
  termos: string[]
): boolean {
  return contemAlgum(correlacaoDe(ctx), termos);
}

// ===========================================================================
// RACIOCÍNIO DIAGNÓSTICO (lê o diálogo, não exige campo formal)
// ===========================================================================
export function detectarHipotesePrincipal(
  ctx: ContextoAvaliacaoOSCE,
  termosDiagnostico: string[]
): boolean {
  const t = `${correlacaoDe(ctx)} ${normalizarTexto(ctx.diagnosticoEsperado)}`;
  return contemAlgum(t, termosDiagnostico) ||
    contemAlgum(normalizarTexto((ctx.diferenciaisInformados ?? []).join(" ")), termosDiagnostico);
}

/** Conta diferenciais pertinentes verbalizados (diálogo) ou no campo formal. */
export function detectarDiferenciaisVerbalizados(
  ctx: ContextoAvaliacaoOSCE,
  termosDiferenciais: string[]
): number {
  const t = `${correlacaoDe(ctx)} ${normalizarTexto((ctx.diferenciaisInformados ?? []).join(" "))}`;
  return contarTermos(t, termosDiferenciais);
}

export function detectarRaciocinioVerbalizado(
  ctx: ContextoAvaliacaoOSCE,
  termosCorrelacao: string[]
): boolean {
  return contemAlgum(correlacaoDe(ctx), termosCorrelacao);
}

export function detectarAvaliacaoGravidadeLocalCuidado(
  ctx: ContextoAvaliacaoOSCE,
  termos: string[]
): number {
  return contarTermos(correlacaoDe(ctx), termos);
}

// ===========================================================================
// CONDUTA E SEGURANÇA
// ===========================================================================
export function detectarCondutaEspecifica(
  ctx: ContextoAvaliacaoOSCE,
  termosConduta: string[]
): boolean {
  return contemAlgum(condutaDe(ctx), termosConduta);
}

export function detectarMedidasSuporte(
  ctx: ContextoAvaliacaoOSCE,
  termos: string[]
): boolean {
  return contemAlgum(condutaDe(ctx), termos);
}

export function detectarDoseDuracaoPosologia(ctx: ContextoAvaliacaoOSCE): {
  dose: boolean;
  duracao: boolean;
} {
  const t = condutaDe(ctx);
  const dose =
    /\d+\s*\/\s*\d+|\d+\s*mg|\d+\s*g\b|\d+\s*\/\s*\d+\s*h|\d+\s*em\s*\d+|de \d+ em \d+|duas vezes ao dia|tres vezes ao dia|uma vez ao dia|\d+x ao dia|\d+\/\d+h/.test(
      t
    );
  const duracao =
    /\b\d+\s*(a\s*\d+\s*)?dias?\b|sete dias|cinco dias|dez dias|por \d+ dias|por .* dias/.test(
      t
    );
  return { dose, duracao };
}
