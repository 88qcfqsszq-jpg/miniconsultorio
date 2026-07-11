// ============================================================================
// Casos OSCE Dinâmicos — Beta · VALIDADOR DE CASO (contrato Fase 2)
// ----------------------------------------------------------------------------
// Verifica a forma completa de um DynamicCase. Puro; retorna lista de erros.
// ============================================================================

import type { DynamicCase, InterventionId } from "../types";
import {
  GRUPOS_OBRIGATORIOS_CASO,
  LIMITES_VITAIS,
  ehPatientState,
} from "../dynamic-case-contract";
import { CATALOGO_INTERVENCOES } from "../dynamic-intervention-engine";
import { linkRubrica } from "../dynamic-rubric-link";

export interface ResultadoValidacao {
  ok: boolean;
  erros: string[];
}

function idsIntervencoesDoCaso(caso: DynamicCase): InterventionId[] {
  const i = caso.intervencoes;
  return [
    ...i.intervencoesEssenciais,
    ...i.intervencoesAceitas,
    ...i.intervencoesContraindicadas,
    ...i.intervencoesDeResgate,
    ...i.respostaEsperadaPorIntervencao.map((r) => r.intervencao),
  ];
}

export function validarDynamicCase(caso: DynamicCase): ResultadoValidacao {
  const erros: string[] = [];

  // Grupos obrigatórios de topo presentes
  for (const grupo of GRUPOS_OBRIGATORIOS_CASO) {
    if ((caso as any)[grupo] === undefined || (caso as any)[grupo] === null) {
      erros.push(`Grupo obrigatório ausente: ${String(grupo)}`);
    }
  }
  if (erros.length > 0) return { ok: false, erros };

  // Estado inicial válido + faixas
  if (!ehPatientState(caso.fisiologia.estadoInicial)) {
    erros.push("fisiologia.estadoInicial não é um PatientState válido.");
  } else {
    const v = caso.fisiologia.estadoInicial.vitals;
    (Object.keys(LIMITES_VITAIS) as Array<keyof typeof LIMITES_VITAIS>).forEach((k) => {
      const val = (v as any)[k];
      const { min, max } = LIMITES_VITAIS[k];
      if (typeof val !== "number" || val < min || val > max) {
        erros.push(`Vital fora da faixa plausível: ${k}=${val} (esperado ${min}-${max}).`);
      }
    });
  }

  // Critérios de alta/internação/UTI existem
  if (!caso.fisiologia.criteriosAltaSegura?.length) erros.push("fisiologia.criteriosAltaSegura vazio.");
  if (!caso.fisiologia.criteriosInternacao?.length) erros.push("fisiologia.criteriosInternacao vazio.");
  if (!caso.fisiologia.criteriosUTI?.length) erros.push("fisiologia.criteriosUTI vazio.");

  // Anamnese/exame/exames essenciais não vazios
  if (!caso.anamnese.perguntasObrigatorias?.length) erros.push("anamnese.perguntasObrigatorias vazio.");
  if (!caso.exameFisico.manobrasObrigatorias?.length) erros.push("exameFisico.manobrasObrigatorias vazio.");
  if (!caso.exames.examesEssenciais?.length) erros.push("exames.examesEssenciais vazio.");
  if (!caso.comunicacao.itensEsperados?.length) erros.push("comunicacao.itensEsperados vazio.");

  // Intervenções essenciais existem
  if (!caso.intervencoes.intervencoesEssenciais?.length) {
    erros.push("intervencoes.intervencoesEssenciais vazio.");
  }

  // Motor reconhece TODAS as intervenções referenciadas pelo caso
  for (const id of idsIntervencoesDoCaso(caso)) {
    if (!(id in CATALOGO_INTERVENCOES)) {
      erros.push(`Intervenção não reconhecida pelo motor: ${id}.`);
    }
  }

  // Erros críticos não vazios (segurança do caso grave)
  const ec = caso.errosCriticos;
  if (!ec.errosCriticosConduta?.length) erros.push("errosCriticos.errosCriticosConduta vazio.");
  if (!ec.errosCriticosAlta?.length) erros.push("errosCriticos.errosCriticosAlta vazio.");
  if (!ec.errosCriticosSeguranca?.length) erros.push("errosCriticos.errosCriticosSeguranca vazio.");

  // Consistência da simulação (Pulse)
  const sim = caso.simulacao;
  if (sim.simulationProvider === "pulse") {
    if (!sim.pulseReady) erros.push("simulationProvider='pulse' exige pulseReady=true.");
    if (!sim.pulseScenarioId) erros.push("simulationProvider='pulse' exige pulseScenarioId.");
    if (caso.identificacao.tipo === "pediatrico" && sim.pediatricSafetyAdapterRequired !== true) {
      erros.push("Caso pediátrico com Pulse exige pediatricSafetyAdapterRequired=true.");
    }
  }
  // Se pulseReady=false, NÃO exigir pulseScenarioId (nenhum erro) — comportamento correto.

  // Rubrica registrada
  if (!linkRubrica(caso.rubricaId)) {
    erros.push(`rubricaId sem rubrica registrada: ${caso.rubricaId}.`);
  }

  return { ok: erros.length === 0, erros };
}
