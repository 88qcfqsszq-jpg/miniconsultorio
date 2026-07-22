import { deriveGoldAsthmaPresentation } from './presentation'
import type {
  GoldAsthmaEvidence,
  GoldAsthmaInterpretationInput,
  GoldAsthmaPhysicalExam,
  GoldAsthmaPhysicalFinding,
} from './types'

function finite(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function ratio(current: number | undefined, baseline: number | undefined): number | undefined {
  if (!finite(current) || !finite(baseline) || baseline === 0) return undefined
  return current / baseline
}

function pulseEvidence(
  id: string,
  path: string,
  value: number,
  rationale: string,
): GoldAsthmaEvidence {
  return { id, source: 'pulse', path, value, rationale }
}

function derivedEvidence(
  id: string,
  path: string,
  value: number | string | boolean,
  rationale: string,
): GoldAsthmaEvidence {
  return { id, source: 'medix-derived', path, value, rationale }
}

function finding(
  id: string,
  label: string,
  description: string,
  source: GoldAsthmaPhysicalFinding['source'],
  evidence: GoldAsthmaEvidence[],
): GoldAsthmaPhysicalFinding {
  return { id, label, description, source, evidence }
}

export function deriveGoldAsthmaPhysicalExam(
  input: GoldAsthmaInterpretationInput,
  sessionId: string,
): GoldAsthmaPhysicalExam {
  const presentation = deriveGoldAsthmaPresentation(input)
  const { snapshot, snapshotHistory, actions } = input
  const baseline = snapshotHistory[0] ?? snapshot
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
  const respiratoryRate = snapshot.vitals.respiratoryRate
  const heartRate = snapshot.vitals.heartRate
  const systolic = snapshot.vitals.systolicPressure
  const diastolic = snapshot.vitals.diastolicPressure
  const map = snapshot.vitals.meanArterialPressure
  const paco2 = snapshot.respiratory.paco2MmHg
  const pH = snapshot.respiratory.pH
  const spo2 = snapshot.vitals.spo2
  const lastAsthmaAction = [...actions]
    .reverse()
    .find((action) => action.action === 'asthma_attack')
  const asthmaActive = lastAsthmaAction?.status === 'applied'

  const general: GoldAsthmaPhysicalFinding[] = []
  const respiratory: GoldAsthmaPhysicalFinding[] = []
  const cardiovascular: GoldAsthmaPhysicalFinding[] = []
  const neurologic: GoldAsthmaPhysicalFinding[] = []
  const perfusion: GoldAsthmaPhysicalFinding[] = []

  general.push(finding(
    'general-appearance',
    'Estado geral',
    presentation.appearance,
    'medix-derived',
    presentation.evidence.filter((item) => [
      'derived-severity-score',
      'pulse-spo2',
      'pulse-respiratory-rate',
    ].includes(item.id)),
  ))
  general.push(finding(
    'general-speech',
    'Fala',
    presentation.speech,
    'medix-derived',
    presentation.evidence.filter((item) => [
      'derived-severity-score',
      'derived-ventilation-ratio',
      'pulse-respiratory-rate',
    ].includes(item.id)),
  ))

  if (finite(respiratoryRate) && respiratoryRate > 20) {
    respiratory.push(finding(
      'respiratory-tachypnea',
      'Taquipneia',
      `Frequência respiratória de ${respiratoryRate.toFixed(1)} irpm.`,
      'medix-derived',
      [pulseEvidence('exam-pulse-rr', 'snapshot.vitals.respiratoryRate', respiratoryRate, 'Valor direto do Pulse; a classificação clínica é derivada.')],
    ))
  }
  if (finite(resistanceRatio) && resistanceRatio >= 1.35) {
    respiratory.push(finding(
      'respiratory-prolonged-expiration',
      'Expiração prolongada',
      'Padrão expiratório prolongado compatível com aumento sustentado da resistência das vias aéreas.',
      'medix-derived',
      [derivedEvidence('exam-resistance-ratio', 'snapshot.respiratory.airwayResistance/baseline', resistanceRatio, 'Razão de resistência contra o baseline da mesma sessão.')],
    ))
  }
  if (presentation.severity === 'severe' || presentation.severity === 'life-threatening') {
    respiratory.push(finding(
      'respiratory-accessory-muscles',
      'Uso de musculatura acessória',
      'Retrações e recrutamento de musculatura acessória são prováveis pelo conjunto fisiológico atual.',
      'medix-derived',
      presentation.evidence.filter((item) => [
        'derived-severity-score',
        'derived-resistance-ratio',
        'pulse-respiratory-rate',
      ].includes(item.id)),
    ))
  }

  const silentChest = presentation.severity === 'life-threatening'
    && finite(resistanceRatio) && resistanceRatio >= 2
    && (
      (finite(ventilationRatio) && ventilationRatio < 0.5)
      || (finite(tidalRatio) && tidalRatio < 0.5)
    )
  if (silentChest) {
    respiratory.push(finding(
      'respiratory-silent-chest',
      'Silêncio auscultatório',
      'Entrada de ar criticamente reduzida; eventual redução de sibilos não representa melhora.',
      'medix-derived',
      [
        derivedEvidence('exam-silent-resistance', 'snapshot.respiratory.airwayResistance/baseline', resistanceRatio, 'Obstrução marcada contra o baseline.'),
        derivedEvidence('exam-silent-ventilation', 'snapshot.respiratory.minuteVentilationLMin/baseline', ventilationRatio ?? tidalRatio ?? 0, 'Ventilação ou volume corrente criticamente reduzido.'),
      ],
    ))
  } else if (asthmaActive) {
    respiratory.push(finding(
      'respiratory-wheeze',
      'Sibilância difusa',
      'Sibilos expiratórios difusos bilaterais definidos pela apresentação narrativa da crise ativa.',
      'case-fixed',
      [{
        id: 'exam-case-wheeze',
        source: 'case-fixed',
        path: 'case.narrative.priorDiagnosis',
        value: input.config.narrative.priorDiagnosis,
        rationale: 'Achado narrativo do Caso Ouro; não é uma saída acústica do Pulse.',
      }],
    ))
  }
  if (
    (finite(tidalRatio) && tidalRatio < 0.75)
    || (finite(ventilationRatio) && ventilationRatio < 0.75)
  ) {
    respiratory.push(finding(
      'respiratory-reduced-air-entry',
      'Entrada de ar reduzida',
      'Murmúrio vesicular globalmente reduzido, inferido da queda de volume/ventilação contra o baseline.',
      'medix-derived',
      [derivedEvidence(
        'exam-air-entry',
        'snapshot.respiratory.ventilationRelativeToBaseline',
        Math.min(tidalRatio ?? 1, ventilationRatio ?? 1),
        'Combinação conservadora das razões de volume corrente e ventilação minuto.',
      )],
    ))
  }

  if (finite(heartRate) && heartRate > 100) {
    cardiovascular.push(finding(
      'cardiovascular-tachycardia',
      'Taquicardia',
      `Frequência cardíaca de ${heartRate.toFixed(1)} bpm.`,
      'medix-derived',
      [pulseEvidence('exam-pulse-heart-rate', 'snapshot.vitals.heartRate', heartRate, 'Valor direto do Pulse; a classificação clínica é derivada.')],
    ))
  }
  if (finite(systolic) && finite(diastolic)) {
    cardiovascular.push(finding(
      'cardiovascular-pressure',
      'Pressão arterial',
      `Pressão arterial ${systolic.toFixed(0)}/${diastolic.toFixed(0)} mmHg no instante do exame.`,
      'pulse',
      [
        pulseEvidence('exam-pulse-systolic', 'snapshot.vitals.systolicPressure', systolic, 'Pressão sistólica direta do Pulse.'),
        pulseEvidence('exam-pulse-diastolic', 'snapshot.vitals.diastolicPressure', diastolic, 'Pressão diastólica direta do Pulse.'),
      ],
    ))
  }

  const alteredResponsiveness = (
    finite(paco2) && paco2 >= 60
  ) || (
    finite(pH) && pH < 7.25
  ) || presentation.severity === 'life-threatening'
  if (alteredResponsiveness) {
    neurologic.push(finding(
      'neurologic-reduced-responsiveness',
      'Responsividade reduzida',
      'Sonolência ou redução da responsividade é possível no contexto de falência ventilatória; confirmar ao contato.',
      'medix-derived',
      presentation.evidence.filter((item) => [
        'pulse-paco2',
        'pulse-ph',
        'derived-severity-score',
      ].includes(item.id)),
    ))
  } else {
    neurologic.push(finding(
      'neurologic-anxiety',
      'Ansiedade',
      'Alerta e ansioso diante do desconforto respiratório.',
      'case-fixed',
      [{
        id: 'exam-case-anxiety',
        source: 'case-fixed',
        path: 'case.narrative.crisisDuration',
        value: input.config.narrative.crisisDuration,
        rationale: 'Componente narrativo fixo, mantido separado da fisiologia Pulse.',
      }],
    ))
  }

  const reducedPerfusion = (finite(map) && map < 65)
    || (finite(systolic) && systolic < 90)
    || (finite(spo2) && spo2 < 85)
  perfusion.push(finding(
    'perfusion-current',
    reducedPerfusion ? 'Perfusão reduzida' : 'Perfusão preservada',
    presentation.perfusion,
    'medix-derived',
    presentation.evidence.filter((item) => [
      'pulse-spo2',
      'derived-severity-score',
    ].includes(item.id)).concat(
      finite(map)
        ? [pulseEvidence('exam-pulse-map', 'snapshot.vitals.meanArterialPressure', map, 'Pressão arterial média direta do Pulse.')]
        : [],
    ),
  ))

  return {
    caseId: input.config.id,
    sessionId,
    simulationTimeSeconds: snapshot.simulationTimeSeconds,
    requestedAt: new Date().toISOString(),
    sections: { general, respiratory, cardiovascular, neurologic, perfusion },
  }
}
