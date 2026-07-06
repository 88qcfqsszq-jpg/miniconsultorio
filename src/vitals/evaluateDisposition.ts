// ============================================================================
// Reavaliação de Sinais Vitais — AVALIAÇÃO DE ESTABILIDADE / DISPOSIÇÃO
// ----------------------------------------------------------------------------
// Analisa os sinais de saída + o perfil clínico e orienta a decisão:
// alta segura / observação / encaminhamento hospitalar. Puro e determinístico.
// NUNCA sugere alta simples para quadros de alto risco (perfil.nuncaAltaDireta
// ou perfil.podeAlta=false). Orienta, não substitui o raciocínio clínico.
// ============================================================================

import type { DispositionResult, VitalSet } from "@/src/vitals/vitalTypes";
import { getVitalProfile } from "@/src/vitals/vitalProfiles";

export interface EvaluateDispositionInput {
  caso: any;
  exitVitals: VitalSet;
  /**
   * Contexto opcional da conduta/tempo (calibração clínica). Permite considerar
   * a resposta ao tratamento e a persistência de sintomas, além dos limites dos
   * sinais. Retrocompatível: quando omitido, avalia só pelos sinais + perfil.
   */
  context?: {
    elapsedMinutes?: number;
    antipyretic?: boolean;
    /** adequação da conduta (ex.: "ausente", "inadequada", "adequada"...). */
    treatmentAdequacy?: string;
  };
}

const LABEL: Record<DispositionResult["disposition"], string> = {
  alta_segura: "Estável para alta",
  observacao: "Parcialmente estável — manter em observação",
  encaminhamento_hospitalar: "Instável / risco clínico — encaminhar ao hospital",
};

export function evaluateDisposition({ caso, exitVitals: v, context }: EvaluateDispositionInput): DispositionResult {
  const perfil = getVitalProfile(caso);
  const warnings: string[] = [];
  const reasons: string[] = [];
  let sev = 0; // 0 = alta, 1 = observação, 2 = hospital
  const marcar = (nivel: number) => { sev = Math.max(sev, nivel); };
  const elapsed = context?.elapsedMinutes ?? 0;

  // ── Critérios gerais de alerta (sobre os sinais de SAÍDA) — calibrados ──
  // SpO₂: alta exige ≥94%; 90–93% → observação; <90% → hospital.
  if (v.spo2 < 90) { marcar(2); warnings.push(`SpO₂ baixa (${v.spo2}%) — insuficiência respiratória.`); }
  else if (v.spo2 < 94) { marcar(1); warnings.push(`SpO₂ limítrofe (${v.spo2}%) — manter oximetria.`); }

  // FR: >30 → hospital; 24–30 → observação.
  if (v.fr > 30) { marcar(2); warnings.push(`FR muito elevada (${v.fr} irpm).`); }
  else if (v.fr >= 24) { marcar(1); warnings.push(`FR elevada (${v.fr} irpm).`); }

  if (v.fc > 130) { marcar(2); warnings.push(`FC muito elevada (${v.fc} bpm).`); }
  else if (v.fc < 45) { marcar(2); warnings.push(`Bradicardia importante (${v.fc} bpm).`); }
  else if (v.fc >= 115) { marcar(1); warnings.push(`Taquicardia (${v.fc} bpm).`); }

  if (v.paSys < 90) { marcar(2); warnings.push(`Hipotensão (${v.paSys}/${v.paDia} mmHg).`); }
  else if (v.paSys > 210 || v.paDia > 130) { marcar(2); warnings.push(`Emergência hipertensiva (${v.paSys}/${v.paDia} mmHg).`); }
  else if (v.paSys > 180 || v.paDia > 120) { marcar(1); warnings.push(`PA elevada (${v.paSys}/${v.paDia} mmHg).`); }

  // ── Temperatura (regra calibrada) ──
  // <38,0 → não penaliza; 38,0–38,4 → observação (avaliar contexto);
  // ≥38,5 → nunca alta simples (mínimo observação) + "Febre persistente".
  if (v.temp >= 38.5) {
    marcar(1);
    warnings.push(`Febre persistente (${v.temp.toFixed(1)} °C).`);
    reasons.push("Febre persistente após reavaliação.");
    if (context?.antipyretic && elapsed >= 60) {
      reasons.push("Resposta insuficiente ao antitérmico — reavaliar diagnóstico/foco infeccioso.");
    }
  } else if (v.temp >= 38.0) {
    marcar(1);
    warnings.push(`Febre (${v.temp.toFixed(1)} °C) — avaliar contexto clínico antes da alta.`);
  }

  if (v.glicemia != null) {
    if (v.glicemia > 400 || v.glicemia < 50) { marcar(2); warnings.push(`Glicemia muito alterada (${v.glicemia} mg/dL).`); }
    else if (v.glicemia > 250 || v.glicemia < 70) { marcar(1); warnings.push(`Glicemia alterada (${v.glicemia} mg/dL).`); }
  }

  if (v.dor >= 8) { marcar(1); warnings.push(`Dor intensa (${v.dor}/10).`); }

  // ── Disposição pelos sinais ──
  let disposition: DispositionResult["disposition"] =
    sev >= 2 ? "encaminhamento_hospitalar" : sev === 1 ? "observacao" : "alta_segura";

  // ── Regra clínica: quadros de alto risco NUNCA recebem alta simples ──
  const elegivelAlta = perfil.podeAlta && !perfil.nuncaAltaDireta;
  if (perfil.nuncaAltaDireta && perfil.provavelHospital) {
    // IAM/SCA, sepse, TEP, dengue com alarme, cetoacidose, IC, pneumonia grave:
    // encaminhamento hospitalar SEMPRE, mesmo com sinais melhorando.
    if (disposition !== "encaminhamento_hospitalar") {
      disposition = "encaminhamento_hospitalar";
      reasons.push(`O quadro (${perfil.descricao}) exige avaliação hospitalar mesmo com sinais vitais melhorando — risco de deterioração.`);
    }
  } else if (disposition === "alta_segura" && !elegivelAlta) {
    // DPOC grave / crise asmática grave e afins: não dar alta simples.
    disposition = perfil.provavelHospital ? "encaminhamento_hospitalar" : "observacao";
    reasons.push(
      `O quadro (${perfil.descricao}) exige ${disposition === "encaminhamento_hospitalar" ? "avaliação hospitalar" : "observação"} mesmo com sinais vitais aceitáveis.`
    );
  }

  // ── Justificativas ──
  if (disposition === "alta_segura") {
    reasons.push("Sinais vitais estáveis e quadro de baixo risco — alta com orientações e sinais de alarme.");
  } else if (disposition === "observacao") {
    if (warnings.length) reasons.push("Sinais ainda não plenamente estáveis — reavaliar após período de observação.");
  } else {
    if (warnings.length) reasons.push("Instabilidade e/ou risco clínico — não indicar alta; encaminhar/internar.");
  }
  reasons.push(perfil.nota);

  return { disposition, stabilityLabel: LABEL[disposition], reasons: reasons.filter(Boolean), warnings };
}
