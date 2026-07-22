import { disposePulseProcessManager, getPulseProcessManager } from '../pulse-runtime/pulse-process-manager'
import {
  GOLD_ASTHMA_CONFIG,
  assertGoldAsthmaFeatureEnabled,
  runGoldAsthmaCalibrationMatrix,
  runGoldAsthmaScenario,
  type GoldAsthmaScenarioName,
  type GoldAsthmaScenarioResult,
} from '../cases/gold/asthma-severe/index'

interface CliOptions {
  scenario: GoldAsthmaScenarioName | 'calibration' | 'all'
  severity?: number
  full: boolean
}

const SCENARIOS: readonly GoldAsthmaScenarioName[] = [
  'untreated',
  'oxygen',
  'albuterol',
  'combined',
  'late-treatment',
  'lifecycle',
]

function parseOptions(argv: readonly string[]): CliOptions {
  let scenario: CliOptions['scenario'] = 'lifecycle'
  let severity: number | undefined
  let full = false
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === '--full') {
      full = true
      continue
    }
    if (argument === '--scenario') {
      const value = argv[index + 1]
      if (!value || !([...SCENARIOS, 'calibration', 'all'] as string[]).includes(value)) {
        throw new Error(`--scenario must be one of: ${[...SCENARIOS, 'calibration', 'all'].join(', ')}`)
      }
      scenario = value as CliOptions['scenario']
      index += 1
      continue
    }
    if (argument === '--severity') {
      const value = Number(argv[index + 1])
      if (!Number.isFinite(value) || value <= 0 || value > 1) {
        throw new Error('--severity must be greater than 0 and no more than 1.')
      }
      severity = value
      index += 1
      continue
    }
    throw new Error(`Unknown argument: ${argument}`)
  }
  return { scenario, severity, full }
}

function summarizeSnapshot(snapshot: GoldAsthmaScenarioResult['snapshots'][number]) {
  return {
    simulationTimeSeconds: snapshot.simulationTimeSeconds,
    vitals: snapshot.vitals,
    respiratory: snapshot.respiratory,
    unavailableFields: snapshot.unavailableFields,
    warnings: snapshot.warnings,
  }
}

function summarizeResult(result: GoldAsthmaScenarioResult) {
  return {
    scenario: result.scenario,
    severity: result.severity,
    snapshots: result.snapshots.map(summarizeSnapshot),
    actions: result.actions.map((action) => ({
      action: action.action,
      status: action.status,
      simulationTimeSeconds: action.simulationTimeSeconds,
    })),
    events: result.events.map((event) => ({
      pulseName: event.pulseName,
      active: event.active,
      simulationTimeSeconds: event.simulationTimeSeconds,
      source: event.source,
    })),
    activeEvents: result.activeEvents.map((event) => ({
      pulseName: event.pulseName,
      durationSeconds: event.durationSeconds,
      source: event.source,
    })),
    finalPresentation: {
      simulationTimeSeconds: result.finalPresentation.simulationTimeSeconds,
      severity: result.finalPresentation.severity,
      score: result.finalPresentation.score,
      appearance: result.finalPresentation.appearance,
      speech: result.finalPresentation.speech,
      respiratoryEffort: result.finalPresentation.respiratoryEffort,
      cyanosis: result.finalPresentation.cyanosis,
      perfusion: result.finalPresentation.perfusion,
      warnings: result.finalPresentation.warnings,
      evidenceCount: result.finalPresentation.evidence.length,
    },
    physicalExamFindingCount: Object.values(result.finalExam.sections)
      .reduce((sum, findings) => sum + findings.length, 0),
    timelineEntryCount: result.timeline.length,
  }
}

async function main(): Promise<void> {
  const options = parseOptions(process.argv.slice(2))
  assertGoldAsthmaFeatureEnabled()
  const manager = getPulseProcessManager()
  const selectedSeverity = options.severity ?? GOLD_ASTHMA_CONFIG.selectedAsthmaSeverity
  let results: GoldAsthmaScenarioResult[]
  if (options.scenario === 'calibration') {
    results = await runGoldAsthmaCalibrationMatrix({
      manager,
      severities: GOLD_ASTHMA_CONFIG.calibrationSeverities,
    })
  } else {
    if (selectedSeverity === null || selectedSeverity === undefined) {
      throw new Error('No selected severity exists yet; run --scenario calibration or pass --severity.')
    }
    const scenarios = options.scenario === 'all' ? SCENARIOS : [options.scenario]
    results = []
    for (const scenario of scenarios) {
      results.push(await runGoldAsthmaScenario(scenario, {
        manager,
        severity: selectedSeverity,
      }))
    }
  }
  const output = options.full ? results : results.map(summarizeResult)
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`)
}

try {
  await main()
} catch (error) {
  const safeError = {
    name: error instanceof Error ? error.name : 'UnknownError',
    code: typeof error === 'object' && error !== null && 'code' in error
      ? String(error.code)
      : 'GOLD_ASTHMA_CLI_FAILED',
    message: error instanceof Error ? error.message : 'Unknown failure',
  }
  process.stderr.write(`${JSON.stringify(safeError)}\n`)
  process.exitCode = 1
} finally {
  await disposePulseProcessManager()
}
