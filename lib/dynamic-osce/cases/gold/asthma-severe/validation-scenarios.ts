import type { PulseProcessManager } from '../../../pulse-runtime/pulse-process-manager'
import type { PulseSnapshot } from '../../../pulse-runtime/pulse-runtime-types'
import { GoldAsthmaTechnicalService } from './technical-service'
import type { GoldAsthmaScenarioResult } from './types'

export type GoldAsthmaScenarioName =
  | 'untreated'
  | 'oxygen'
  | 'albuterol'
  | 'combined'
  | 'late-treatment'
  | 'lifecycle'

interface RunScenarioOptions {
  manager: PulseProcessManager
  severity: number
  environment?: Record<string, string | undefined>
}

async function advanceSequence(
  service: GoldAsthmaTechnicalService,
  durations: readonly number[],
): Promise<void> {
  for (const seconds of durations) await service.advanceTime(seconds)
}

async function finishScenario(
  service: GoldAsthmaTechnicalService,
  scenario: string,
): Promise<GoldAsthmaScenarioResult> {
  const events = await service.collectEvents()
  const finalPresentation = service.getPresentation()
  const finalExam = service.requestPhysicalExam()
  const snapshots = service.getSnapshots()
  const actions = service.getActions()
  await service.terminate()
  return {
    scenario,
    severity: service.severity,
    snapshots,
    events: events.changes,
    activeEvents: events.activeEvents,
    actions,
    finalPresentation,
    finalExam,
    timeline: service.getTimeline(),
  }
}

export async function runGoldAsthmaScenario(
  scenario: GoldAsthmaScenarioName,
  options: RunScenarioOptions,
): Promise<GoldAsthmaScenarioResult> {
  const service = await GoldAsthmaTechnicalService.create(options)
  try {
    await service.applyAsthma()
    switch (scenario) {
      case 'untreated':
        await advanceSequence(service, [30, 60, 120, 90])
        break
      case 'oxygen':
        await advanceSequence(service, [30, 60])
        await service.applyOxygen()
        await advanceSequence(service, [30, 60, 120])
        break
      case 'albuterol':
        await advanceSequence(service, [30, 60])
        await service.applyAlbuterol()
        await advanceSequence(service, [30, 60, 120])
        break
      case 'combined':
        await advanceSequence(service, [30, 60])
        await service.applyOxygen()
        await service.applyAlbuterol()
        await advanceSequence(service, [30, 60, 120])
        break
      case 'late-treatment':
        await advanceSequence(service, [30, 60, 120])
        await service.applyOxygen()
        await service.applyAlbuterol()
        await advanceSequence(service, [30, 60])
        break
      case 'lifecycle':
        await service.advanceTime(30)
        await service.applyOxygen()
        await service.applyAlbuterol()
        await service.advanceTime(60)
        await service.collectEvents()
        service.requestPhysicalExam()
        await service.cancelAction('supplemental_oxygen')
        await service.cancelAction('asthma_attack')
        await service.advanceTime(5)
        break
    }
    return await finishScenario(service, scenario)
  } catch (error) {
    await service.terminate().catch(() => undefined)
    throw error
  }
}

export async function runGoldAsthmaCalibration(
  options: RunScenarioOptions,
): Promise<GoldAsthmaScenarioResult> {
  const service = await GoldAsthmaTechnicalService.create(options)
  try {
    await service.applyAsthma()
    for (const seconds of [30, 60, 120, 90]) {
      await service.advanceTime(seconds)
      const events = await service.collectEvents()
      if (events.activeEvents.some((event) => event.pulseName === 'IrreversibleState')) break
    }
    return await finishScenario(service, `calibration-${options.severity}`)
  } catch (error) {
    await service.terminate().catch(() => undefined)
    throw error
  }
}

export async function runGoldAsthmaCalibrationMatrix(options: {
  manager: PulseProcessManager
  severities: readonly number[]
  environment?: Record<string, string | undefined>
}): Promise<GoldAsthmaScenarioResult[]> {
  const results: GoldAsthmaScenarioResult[] = []
  for (const severity of options.severities) {
    results.push(await runGoldAsthmaCalibration({ ...options, severity }))
  }
  return results
}

export function snapshotAtOrAfter(
  snapshots: readonly PulseSnapshot[],
  seconds: number,
): PulseSnapshot | undefined {
  return snapshots.find((snapshot) => snapshot.simulationTimeSeconds >= seconds)
}
