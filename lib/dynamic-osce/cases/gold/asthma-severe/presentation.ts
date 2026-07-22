import { activePulseEventNames, hasHighRiskPulseEvent } from './events'
import type {
  GoldAsthmaEvidence,
  GoldAsthmaInterpretationInput,
  GoldAsthmaPresentation,
  GoldAsthmaSeverity,
} from './types'

function finite(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function ratio(current: number | undefined, baseline: number | undefined): number | undefined {
  if (!finite(current) || !finite(baseline) || baseline === 0) return undefined
  return current / baseline
}

function delta(current: number | undefined, previous: number | undefined): number | undefined {
  if (!finite(current) || !finite(previous)) return undefined
  return current - previous
}

function severityFromScore(score: number, lifeThreatening: boolean): GoldAsthmaSeverity {
  if (lifeThreatening || score >= 9) return 'life-threatening'
  if (score >= 5) return 'severe'
  if (score >= 2) return 'moderate'
  return 'mild'
}

export function deriveGoldAsthmaPresentation(
  input: GoldAsthmaInterpretationInput,
): GoldAsthmaPresentation {
  const { snapshot, snapshotHistory, events } = input
  const baseline = snapshotHistory[0] ?? snapshot
  const previous = snapshotHistory.length > 1
    ? snapshotHistory[snapshotHistory.length - 2]
    : baseline
  const evidence: GoldAsthmaEvidence[] = []
  const warnings: string[] = []
  let score = 0

  const addEvidence = (
    id: string,
    source: GoldAsthmaEvidence['source'],
    path: string,
    value: GoldAsthmaEvidence['value'],
    rationale: string,
  ) => evidence.push({ id, source, path, value, rationale })

  const spo2 = snapshot.vitals.spo2
  const pao2 = snapshot.respiratory.pao2MmHg
  const paco2 = snapshot.respiratory.paco2MmHg
  const respiratoryRate = snapshot.vitals.respiratoryRate
  const heartRate = snapshot.vitals.heartRate
  const systolic = snapshot.vitals.systolicPressure
  const map = snapshot.vitals.meanArterialPressure
  const pH = snapshot.respiratory.pH
  const resistanceRatio = ratio(
    snapshot.respiratory.airwayResistance,
    baseline.respiratory.airwayResistance,
  )
  const tidalRatio = ratio(
    snapshot.respiratory.tidalVolumeMl,
    baseline.respiratory.tidalVolumeMl,
  )
  const ventilationRatio = ratio(
    snapshot.respiratory.minuteVentilationLMin,
    baseline.respiratory.minuteVentilationLMin,
  )
  const paco2Trend = delta(paco2, previous.respiratory.paco2MmHg)
  const ventilationTrend = delta(
    snapshot.respiratory.minuteVentilationLMin,
    previous.respiratory.minuteVentilationLMin,
  )

  if (finite(spo2)) {
    addEvidence('pulse-spo2', 'pulse', 'snapshot.vitals.spo2', spo2, 'Oximetria atual fornecida pelo Pulse.')
    if (spo2 < 88) score += 4
    else if (spo2 < 92) score += 3
    else if (spo2 < 95) score += 1
  }
  if (finite(pao2)) {
    addEvidence('pulse-pao2', 'pulse', 'snapshot.respiratory.pao2MmHg', pao2, 'Pressão arterial de oxigênio atual do Pulse.')
    if (pao2 < 60) score += 4
    else if (pao2 < 65) score += 3
    else if (pao2 < 80) score += 1
  }
  if (finite(paco2)) {
    addEvidence('pulse-paco2', 'pulse', 'snapshot.respiratory.paco2MmHg', paco2, 'PaCO₂ atual informa adequação ventilatória.')
    if (paco2 >= 60) score += 4
    else if (paco2 >= 50) score += 3
    else if (paco2 >= 45) score += 1
  }
  if (finite(paco2Trend) && Math.abs(paco2Trend) >= 1) {
    addEvidence('derived-paco2-trend', 'medix-derived', 'history.respiratory.paco2MmHg.delta', paco2Trend, 'Tendência desde o snapshot anterior, não um evento nativo.')
    if (paco2Trend >= 5) score += 2
  }
  if (finite(respiratoryRate)) {
    addEvidence('pulse-respiratory-rate', 'pulse', 'snapshot.vitals.respiratoryRate', respiratoryRate, 'Frequência respiratória atual do Pulse.')
    if (respiratoryRate >= 30) score += 2
    else if (respiratoryRate > 20) score += 1
  }
  if (finite(resistanceRatio)) {
    addEvidence('derived-resistance-ratio', 'medix-derived', 'snapshot.respiratory.airwayResistance/baseline', resistanceRatio, 'Razão calculada contra o baseline da mesma sessão.')
    if (resistanceRatio >= 3) score += 3
    else if (resistanceRatio >= 2) score += 2
    else if (resistanceRatio >= 1.35) score += 1
  }
  if (finite(tidalRatio)) {
    addEvidence('derived-tidal-ratio', 'medix-derived', 'snapshot.respiratory.tidalVolumeMl/baseline', tidalRatio, 'Volume corrente relativo ao baseline da mesma sessão.')
    if (tidalRatio < 0.5) score += 4
    else if (tidalRatio < 0.7) score += 2
  }
  if (finite(ventilationRatio)) {
    addEvidence('derived-ventilation-ratio', 'medix-derived', 'snapshot.respiratory.minuteVentilationLMin/baseline', ventilationRatio, 'Ventilação minuto relativa ao baseline da mesma sessão.')
    if (ventilationRatio < 0.5) score += 4
    else if (ventilationRatio < 0.7) score += 3
  }
  if (finite(ventilationTrend) && Math.abs(ventilationTrend) >= 0.5) {
    addEvidence('derived-ventilation-trend', 'medix-derived', 'history.respiratory.minuteVentilationLMin.delta', ventilationTrend, 'Mudança da ventilação minuto desde o snapshot anterior.')
  }
  if (finite(pH)) {
    addEvidence('pulse-ph', 'pulse', 'snapshot.respiratory.pH', pH, 'pH sanguíneo atual do Pulse.')
    if (pH < 7.25) score += 4
    else if (pH < 7.35) score += 2
  }

  const activeNames = activePulseEventNames(events)
  for (const event of events.activeEvents) {
    addEvidence(
      `pulse-event-${event.id}`,
      'pulse',
      `events.active.${event.pulseName}`,
      true,
      `Evento nativo Pulse ativo há ${event.durationSeconds?.toFixed(1) ?? '0'} s.`,
    )
  }
  if (activeNames.has('Hypoxia')) score += 3
  if (activeNames.has('Hypercapnia')) score += 3
  if (activeNames.has('RespiratoryAcidosis')) score += 3
  if (activeNames.has('MaximumPulmonaryVentilationRate')) score += 2

  const ventilationFailure = (
    (finite(ventilationRatio) && ventilationRatio < 0.55)
    || (finite(tidalRatio) && tidalRatio < 0.5)
  ) && (
    (finite(paco2Trend) && paco2Trend > 2)
    || (finite(paco2) && paco2 >= 50)
    || activeNames.has('Hypercapnia')
  )
  const lifeThreatening = ventilationFailure
    || activeNames.has('IrreversibleState')
    || activeNames.has('CriticalBrainOxygenDeficit')
    || (hasHighRiskPulseEvent(events) && finite(spo2) && spo2 < 85)
  const severity = severityFromScore(score, lifeThreatening)

  if (ventilationFailure) {
    warnings.push('Possível falência ventilatória: ventilação/volume corrente baixos com retenção ou elevação de CO₂.')
    warnings.push('Redução de sibilos não deve ser interpretada como melhora diante de entrada de ar ou ventilação criticamente reduzidas.')
  }
  if (activeNames.has('Hypoxia')) warnings.push('Evento nativo Pulse de hipoxia está ativo.')
  if (activeNames.has('Hypercapnia')) warnings.push('Evento nativo Pulse de hipercapnia está ativo.')
  if (finite(pH) && pH < 7.35) warnings.push('Acidemia atual aumenta a preocupação com descompensação respiratória.')

  const appearance = severity === 'life-threatening'
    ? 'Criticamente dispneico, com sinais combinados de possível exaustão.'
    : severity === 'severe'
      ? 'Dispneico, ansioso e com sofrimento respiratório importante.'
      : severity === 'moderate'
        ? 'Dispneico e ansioso, mantendo resposta adequada ao contato.'
        : 'Alerta, com desconforto respiratório discreto.'
  const speech = severity === 'life-threatening'
    ? 'Palavras isoladas ou incapacidade de sustentar fala.'
    : severity === 'severe'
      ? 'Frases curtas e entrecortadas.'
      : severity === 'moderate'
        ? 'Frases breves, com pausas respiratórias.'
        : 'Frases completas.'
  const respiratoryEffort = severity === 'life-threatening'
    ? 'Esforço extremo ou em queda por exaustão; interpretar junto à ventilação.'
    : severity === 'severe'
      ? 'Muito aumentado, com provável uso de musculatura acessória.'
      : severity === 'moderate'
        ? 'Aumentado.'
        : 'Discretamente aumentado ou próximo do basal.'
  const cyanosis = finite(spo2) && finite(pao2) && spo2 < 88 && pao2 < 60
    ? 'Cianose clinicamente possível pela hipoxemia combinada; requer inspeção direta.'
    : 'Cianose não sustentada pelos dados fisiológicos atuais.'
  const poorPerfusion = (
    (finite(map) && map < 65)
    || (finite(systolic) && systolic < 90)
  ) && finite(heartRate) && heartRate > 100
  const perfusion = poorPerfusion
    ? 'Perfusão possivelmente reduzida por hipotensão associada a taquicardia.'
    : 'Sem evidência fisiológica combinada de hipoperfusão no snapshot atual.'

  addEvidence(
    'derived-severity-score',
    'medix-derived',
    'presentation.score',
    score,
    'Escore composto por oxigenação, ventilação, mecânica, tendência e eventos; não é um evento Pulse.',
  )

  return {
    simulationTimeSeconds: snapshot.simulationTimeSeconds,
    severity,
    score,
    appearance,
    speech,
    respiratoryEffort,
    cyanosis,
    perfusion,
    warnings,
    evidence,
  }
}

export function goldAsthmaPresentationSignature(
  presentation: GoldAsthmaPresentation,
): string {
  return JSON.stringify({
    severity: presentation.severity,
    appearance: presentation.appearance,
    speech: presentation.speech,
    respiratoryEffort: presentation.respiratoryEffort,
    cyanosis: presentation.cyanosis,
    perfusion: presentation.perfusion,
    warnings: presentation.warnings,
  })
}
