// ============================================================================
// Casos OSCE Dinâmicos — Beta · VALIDADOR DO MOTOR (contrato Fase 2)
// ----------------------------------------------------------------------------
// Confere compatibilidade caso × motor: intervenções essenciais/resgate
// reconhecidas, respostas esperadas com efeito/mensagem, direção fisiológica
// correta e erro crítico de alta insegura. Puro; não lança.
// ============================================================================

import type { DynamicCase } from "../types";
import { applyIntervention } from "../dynamic-state-engine";
import { CATALOGO_INTERVENCOES } from "../dynamic-intervention-engine";

export interface ResultadoValidacaoMotor {
  ok: boolean;
  erros: string[];
}

export function validarDynamicEngine(caso: DynamicCase): ResultadoValidacaoMotor {
  const erros: string[] = [];
  const estadoInicial = caso.fisiologia.estadoInicial;

  // Toda intervenção essencial é reconhecida pelo motor
  for (const id of caso.intervencoes.intervencoesEssenciais) {
    if (!(id in CATALOGO_INTERVENCOES)) {
      erros.push(`Intervenção essencial não reconhecida pelo motor: ${id}.`);
    }
  }
  // Toda intervenção de resgate é reconhecida pelo motor
  for (const id of caso.intervencoes.intervencoesDeResgate) {
    if (!(id in CATALOGO_INTERVENCOES)) {
      erros.push(`Intervenção de resgate não reconhecida pelo motor: ${id}.`);
    }
  }

  // Toda resposta esperada produz efeito fisiológico ou mensagem clínica
  for (const re of caso.intervencoes.respostaEsperadaPorIntervencao) {
    if (!(re.intervencao in CATALOGO_INTERVENCOES)) {
      erros.push(`respostaEsperadaPorIntervencao referencia intervenção desconhecida: ${re.intervencao}.`);
      continue;
    }
    const r = applyIntervention(estadoInicial, re.intervencao, 1);
    const mudouEstado = JSON.stringify(r.novoEstado.vitals) !== JSON.stringify(estadoInicial.vitals) ||
      r.novoEstado.broncoespasmo !== estadoInicial.broncoespasmo ||
      r.novoEstado.oxigenioSuplementar !== estadoInicial.oxigenioSuplementar ||
      r.novoEstado.corticoideAdministrado !== estadoInicial.corticoideAdministrado;
    if (!mudouEstado && !(r.mensagem && r.mensagem.trim().length > 0)) {
      erros.push(`Intervenção "${re.intervencao}" não produz efeito fisiológico nem mensagem clínica.`);
    }
  }

  // Direção genérica: oxigênio deve elevar (ou manter) a SpO₂.
  const rO2 = applyIntervention(estadoInicial, "oxigenio", 1);
  if (rO2.novoEstado.vitals.spo2 < estadoInicial.vitals.spo2) {
    erros.push("Oxigênio reduziu a SpO₂ (esperado elevar).");
  }

  // Checagens específicas de asma só quando há broncoespasmo (não valem p/ pneumotórax).
  if (estadoInicial.broncoespasmo > 0) {
    const rSaba = applyIntervention(estadoInicial, "salbutamol", 2);
    if (rSaba.novoEstado.broncoespasmo >= estadoInicial.broncoespasmo) {
      erros.push("Salbutamol não reduziu o broncoespasmo.");
    }
    const rCort = applyIntervention(estadoInicial, "corticoide", 4);
    if (rCort.novoEstado.vitals.spo2 !== estadoInicial.vitals.spo2) {
      erros.push("Corticoide alterou a SpO₂ imediatamente (esperado efeito tardio).");
    }
  }

  // Descompressão deve melhorar quando há tensão de pneumotórax.
  if (typeof estadoInicial.tensaoPneumotorax === "number" && estadoInicial.tensaoPneumotorax > 0) {
    const rDesc = applyIntervention(estadoInicial, "descompressao_toracica", 2);
    if (rDesc.novoEstado.vitals.spo2 <= estadoInicial.vitals.spo2) {
      erros.push("Descompressão não melhorou a SpO₂ no pneumotórax.");
    }
  }

  // Alta insegura (critérios de alta não atingidos no estado inicial grave) → erro crítico.
  const rAlta = applyIntervention(estadoInicial, "alta", 3);
  const rAltaPrecoce = applyIntervention(estadoInicial, "alta_precoce", 3);
  if (!rAlta.erroCritico && !rAltaPrecoce.erroCritico) {
    erros.push("Alta com paciente instável não gerou erro crítico.");
  }

  // ---- Compatibilidade Pulse (contrato Fase 2.5) --------------------------
  const sim = caso.simulacao;
  const pc = sim.pulseCompatibility;

  // pulseReady=true exige declaração de compatibilidade
  if (sim.pulseReady && !pc) {
    erros.push("pulseReady=true exige simulacao.pulseCompatibility declarada.");
  }
  if (pc) {
    // compatibility='not-supported' não pode sugerir provider 'pulse'
    if (pc.compatibility === "not-supported" && pc.suggestedSimulationProvider === "pulse") {
      erros.push("compatibility='not-supported' não pode ter suggestedSimulationProvider='pulse'.");
    }
    // pediátrico com provider sugerido 'pulse' exige adaptador de segurança
    if (
      caso.identificacao.tipo === "pediatrico" &&
      pc.suggestedSimulationProvider === "pulse" &&
      pc.pediatricSafetyAdapterRequired !== true
    ) {
      erros.push("Caso pediátrico com suggestedSimulationProvider='pulse' exige pediatricSafetyAdapterRequired=true.");
    }
  }
  // pulseScenarioId com cara de placeholder deve estar marcado como placeholder
  if (sim.pulseScenarioId && /placeholder|todo|xxx|fixme/i.test(sim.pulseScenarioId) && sim.pulseScenarioIsPlaceholder !== true) {
    erros.push("pulseScenarioId parece placeholder mas não está marcado (pulseScenarioIsPlaceholder=true).");
  }

  return { ok: erros.length === 0, erros };
}
