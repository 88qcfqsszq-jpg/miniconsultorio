import { existsSync } from 'node:fs'
import { delimiter, isAbsolute, join, resolve } from 'node:path'

const XCODE_PYTHON_39 = '/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/bin/python3.9'

export interface PulseRuntimeConfig {
  repositoryRoot: string
  pythonExecutable: string
  pulseRoot: string
  runtimeScript: string
  workingDirectory: string
  pythonPath: string
  timeoutMs: number
}

export type PulseRuntimeConfigOverrides = Partial<PulseRuntimeConfig>

function configuredPath(value: string | undefined, base: string): string | undefined {
  if (!value) return undefined
  return isAbsolute(value) ? value : resolve(base, value)
}

function parseTimeout(value: string | undefined): number {
  if (!value) return 45_000
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 100 || parsed > 300_000) {
    throw new Error('MEDIX_PULSE_RUNTIME_TIMEOUT_MS must be an integer from 100 to 300000.')
  }
  return parsed
}

function defaultPython(): string {
  const explicit = process.env.MEDIX_PULSE_PYTHON ?? process.env.PULSE_PYTHON_BIN
  if (explicit) return explicit
  if (existsSync(XCODE_PYTHON_39)) return XCODE_PYTHON_39
  return 'python3.9'
}

export function resolvePulseRuntimeConfig(
  overrides: PulseRuntimeConfigOverrides = {},
): PulseRuntimeConfig {
  const repositoryRoot = overrides.repositoryRoot ?? process.cwd()
  const pulseRoot = overrides.pulseRoot
    ?? configuredPath(process.env.MEDIX_PULSE_ROOT, repositoryRoot)
    ?? join(repositoryRoot, '.reference-local', 'engine-stable')
  const runtimeScript = overrides.runtimeScript
    ?? join(
      repositoryRoot,
      'lib',
      'dynamic-osce',
      'pulse-runtime',
      'python',
      'pulse_runtime_server.py',
    )
  const workingDirectory = overrides.workingDirectory
    ?? join(pulseRoot, 'bin')
  const pulsePythonPaths = [
    join(pulseRoot, 'build', 'install', 'lib'),
    join(pulseRoot, 'build', 'install', 'python'),
    join(pulseRoot, 'build', 'install', 'bin'),
  ]
  const inheritedPythonPath = process.env.PYTHONPATH
  const pythonPath = overrides.pythonPath
    ?? [...pulsePythonPaths, inheritedPythonPath].filter(Boolean).join(delimiter)

  return {
    repositoryRoot,
    pythonExecutable: overrides.pythonExecutable ?? defaultPython(),
    pulseRoot,
    runtimeScript,
    workingDirectory,
    pythonPath,
    timeoutMs: overrides.timeoutMs ?? parseTimeout(process.env.MEDIX_PULSE_RUNTIME_TIMEOUT_MS),
  }
}

export function assertPulseRuntimeServerEnvironment(config: PulseRuntimeConfig): void {
  if (typeof window !== 'undefined') {
    throw new Error('Pulse runtime process management is server-only.')
  }
  if (!existsSync(config.runtimeScript)) {
    throw new Error(`Pulse runtime script not found: ${config.runtimeScript}`)
  }
  if (!existsSync(config.pulseRoot)) {
    throw new Error(`Pulse root not found: ${config.pulseRoot}`)
  }
  if (!existsSync(config.workingDirectory)) {
    throw new Error(`Pulse working directory not found: ${config.workingDirectory}`)
  }
  if (isAbsolute(config.pythonExecutable) && !existsSync(config.pythonExecutable)) {
    throw new Error(`Pulse Python executable not found: ${config.pythonExecutable}`)
  }
}

