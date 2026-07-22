import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { EventEmitter } from 'node:events'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createInterface, type Interface as ReadLineInterface } from 'node:readline'

import {
  createPulseRuntimeRequest,
  parsePulseRuntimeResponseLine,
  serializePulseRuntimeRequest,
  type PulseRuntimeOperation,
  type PulseRuntimeResponse,
} from './pulse-runtime-protocol'
import { PulseRuntimeError, toPulseRuntimeError } from './pulse-runtime-errors'
import {
  assertPulseRuntimeServerEnvironment,
  resolvePulseRuntimeConfig,
  type PulseRuntimeConfig,
  type PulseRuntimeConfigOverrides,
} from './pulse-runtime-config'
import type {
  PulseRuntimeOperationPayloads,
  PulseRuntimeOperationResults,
} from './pulse-runtime-types'

export type PulseProcessState =
  | 'idle'
  | 'starting'
  | 'ready'
  | 'stopping'
  | 'stopped'
  | 'failed'

export interface PulseProcessManagerOptions {
  config?: PulseRuntimeConfigOverrides
  environment?: Record<string, string | undefined>
}

interface PendingRequest {
  operation: PulseRuntimeOperation
  resolve: (response: PulseRuntimeResponse<unknown>) => void
  reject: (error: PulseRuntimeError) => void
  timer: NodeJS.Timeout
}

interface RequestOptions<Payload> {
  sessionId?: string
  payload?: Payload
  timeoutMs?: number
}

const MAX_STDERR_LINES = 200

export class PulseProcessManager extends EventEmitter {
  readonly config: PulseRuntimeConfig
  private readonly environment: Record<string, string | undefined>
  private child: ChildProcessWithoutNullStreams | null = null
  private stdoutReader: ReadLineInterface | null = null
  private stderrReader: ReadLineInterface | null = null
  private pending = new Map<string, PendingRequest>()
  private recentStderr: string[] = []
  private runtimeDirectory: string | null = null
  private startPromise: Promise<void> | null = null
  private exitPromise: Promise<void> | null = null
  private resolveExit: (() => void) | null = null
  private exitHandled = false
  private parentExitHandler: (() => void) | null = null
  private _state: PulseProcessState = 'idle'

  constructor(options: PulseProcessManagerOptions = {}) {
    super()
    this.config = resolvePulseRuntimeConfig(options.config)
    this.environment = options.environment ?? {}
  }

  get state(): PulseProcessState {
    return this._state
  }

  get processId(): number | undefined {
    return this.child?.pid
  }

  get isRunning(): boolean {
    return this.child !== null
      && this.child.exitCode === null
      && !this.child.killed
      && (this._state === 'starting' || this._state === 'ready')
  }

  getRecentStderr(): readonly string[] {
    return [...this.recentStderr]
  }

  async start(): Promise<void> {
    if (this._state === 'ready' && this.isRunning) return
    if (this.startPromise) return this.startPromise
    if (this._state === 'failed') {
      throw new PulseRuntimeError({
        code: 'PROCESS_FAILED',
        message: 'Pulse runtime manager is failed; create a new manager explicitly.',
      })
    }
    if (this._state === 'stopped') {
      throw new PulseRuntimeError({
        code: 'PROCESS_STOPPED',
        message: 'Pulse runtime manager is stopped; create a new manager explicitly.',
      })
    }

    this.startPromise = this.startInternal()
    try {
      await this.startPromise
    } finally {
      this.startPromise = null
    }
  }

  private async startInternal(): Promise<void> {
    try {
      assertPulseRuntimeServerEnvironment(this.config)
    } catch (error) {
      throw toPulseRuntimeError(error, {
        code: 'RUNTIME_CONFIGURATION_ERROR',
        message: error instanceof Error ? error.message : 'Invalid Pulse runtime configuration.',
      })
    }

    this._state = 'starting'
    this.exitHandled = false
    this.runtimeDirectory = mkdtempSync(join(tmpdir(), 'medix-pulse-runtime-'))

    const child = spawn(
      this.config.pythonExecutable,
      ['-u', this.config.runtimeScript],
      {
        cwd: this.config.workingDirectory,
        env: {
          ...process.env,
          ...this.environment,
          PYTHONPATH: this.config.pythonPath,
          PYTHONDONTWRITEBYTECODE: '1',
          MEDIX_PULSE_ROOT: this.config.pulseRoot,
          MEDIX_PULSE_RUNTIME_DIR: this.runtimeDirectory,
        },
        shell: false,
        stdio: ['pipe', 'pipe', 'pipe'],
      },
    )
    this.child = child
    this.exitPromise = new Promise<void>((resolve) => {
      this.resolveExit = resolve
    })
    this.attachChildListeners(child)
    this.attachParentExitGuard()

    await new Promise<void>((resolve, reject) => {
      const onSpawn = () => {
        child.off('error', onError)
        resolve()
      }
      const onError = (error: Error) => {
        child.off('spawn', onSpawn)
        reject(new PulseRuntimeError({
          code: 'PROCESS_SPAWN_FAILED',
          message: `Could not start Pulse Python runtime: ${error.message}`,
          cause: error,
        }))
      }
      child.once('spawn', onSpawn)
      child.once('error', onError)
    })

    try {
      const ping = await this.sendRaw<'PING'>('PING', {})
      if (!ping.ok || ping.data?.status !== 'ready') {
        throw new PulseRuntimeError({
          code: 'READINESS_FAILED',
          message: 'Pulse Python runtime did not report ready.',
          operation: 'PING',
        })
      }
      this._state = 'ready'
    } catch (error) {
      const runtimeError = toPulseRuntimeError(error, {
        code: 'READINESS_FAILED',
        message: 'Pulse Python runtime readiness check failed.',
        operation: 'PING',
      })
      this.failProcess(runtimeError)
      throw runtimeError
    }
  }

  private attachChildListeners(child: ChildProcessWithoutNullStreams): void {
    this.stdoutReader = createInterface({ input: child.stdout, crlfDelay: Infinity })
    this.stderrReader = createInterface({ input: child.stderr, crlfDelay: Infinity })

    this.stdoutReader.on('line', (line) => this.handleStdoutLine(line))
    this.stderrReader.on('line', (line) => {
      this.recentStderr.push(line)
      if (this.recentStderr.length > MAX_STDERR_LINES) this.recentStderr.shift()
      this.emit('stderr', line)
    })
    child.on('error', (error) => {
      this.failProcess(new PulseRuntimeError({
        code: 'PROCESS_ERROR',
        message: `Pulse Python process error: ${error.message}`,
        cause: error,
      }))
    })
    child.on('exit', (code, signal) => this.handleChildExit(code, signal))
    child.on('close', (code, signal) => this.handleChildExit(code, signal))
    child.stdin.on('error', (error) => {
      if (this._state !== 'stopping' && this._state !== 'stopped') {
        this.failProcess(new PulseRuntimeError({
          code: 'STDIN_ERROR',
          message: `Pulse runtime stdin failed: ${error.message}`,
          cause: error,
        }))
      }
    })
  }

  private attachParentExitGuard(): void {
    this.detachParentExitGuard()
    this.parentExitHandler = () => {
      if (this.child && this.child.exitCode === null) this.child.kill('SIGTERM')
    }
    process.once('exit', this.parentExitHandler)
  }

  private detachParentExitGuard(): void {
    if (this.parentExitHandler) process.off('exit', this.parentExitHandler)
    this.parentExitHandler = null
  }

  private handleStdoutLine(line: string): void {
    let response: PulseRuntimeResponse<unknown>
    try {
      response = parsePulseRuntimeResponseLine(line)
    } catch (error) {
      this.failProcess(new PulseRuntimeError({
        code: 'INVALID_STDOUT',
        message: error instanceof Error ? error.message : 'Invalid Pulse runtime stdout.',
        cause: error,
      }))
      return
    }

    const pending = this.pending.get(response.requestId)
    if (!pending) {
      this.failProcess(new PulseRuntimeError({
        code: 'UNKNOWN_RESPONSE_ID',
        message: `Pulse runtime returned unknown or duplicate requestId ${response.requestId}.`,
        requestId: response.requestId,
      }))
      return
    }

    clearTimeout(pending.timer)
    this.pending.delete(response.requestId)
    if (response.ok) pending.resolve(response)
    else pending.reject(PulseRuntimeError.fromResponse(response, pending.operation))
  }

  private handleChildExit(code: number | null, signal: NodeJS.Signals | null): void {
    if (this.exitHandled) return
    this.exitHandled = true
    this.resolveExit?.()
    this.resolveExit = null

    if (this._state === 'stopping') {
      this._state = 'stopped'
      this.rejectAllPending(new PulseRuntimeError({
        code: 'PROCESS_STOPPED',
        message: 'Pulse runtime stopped before completing a pending request.',
      }))
      return
    }
    if (this._state === 'failed') {
      this.cleanupChildReferences()
      return
    }
    if (this._state === 'stopped') return

    this.failProcess(new PulseRuntimeError({
      code: 'PROCESS_EXITED',
      message: `Pulse runtime exited unexpectedly (code=${String(code)}, signal=${String(signal)}).`,
      details: { code, signal },
    }), false)
    this.cleanupChildReferences()
  }

  private rejectAllPending(error: PulseRuntimeError): void {
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer)
      pending.reject(error)
    }
    this.pending.clear()
  }

  private failProcess(error: PulseRuntimeError, terminate = true): void {
    if (this._state === 'failed' || this._state === 'stopped') return
    this._state = 'failed'
    this.rejectAllPending(error)
    this.emit('failure', error)
    if (terminate && this.child && this.child.exitCode === null) {
      this.child.kill('SIGTERM')
      const child = this.child
      const forceTimer = setTimeout(() => {
        if (child.exitCode === null) child.kill('SIGKILL')
      }, 1_000)
      forceTimer.unref()
    }
  }

  async request<Operation extends PulseRuntimeOperation>(
    operation: Operation,
    options: RequestOptions<PulseRuntimeOperationPayloads[Operation]> = {},
  ): Promise<PulseRuntimeResponse<PulseRuntimeOperationResults[Operation]>> {
    await this.start()
    if (this._state !== 'ready') {
      throw new PulseRuntimeError({
        code: 'PROCESS_NOT_READY',
        message: 'Pulse runtime process is not ready.',
        operation,
      })
    }
    return this.sendRaw(operation, options)
  }

  private sendRaw<Operation extends PulseRuntimeOperation>(
    operation: Operation,
    options: RequestOptions<PulseRuntimeOperationPayloads[Operation]>,
  ): Promise<PulseRuntimeResponse<PulseRuntimeOperationResults[Operation]>> {
    const child = this.child
    if (!child || child.exitCode !== null || child.stdin.destroyed) {
      return Promise.reject(new PulseRuntimeError({
        code: 'PROCESS_NOT_RUNNING',
        message: 'Pulse runtime process is not running.',
        operation,
      }))
    }

    const request = createPulseRuntimeRequest({
      operation,
      sessionId: options.sessionId,
      payload: options.payload,
    })
    const timeoutMs = options.timeoutMs ?? this.config.timeoutMs

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.failProcess(new PulseRuntimeError({
          code: 'REQUEST_TIMEOUT',
          message: `Pulse runtime ${operation} timed out after ${timeoutMs}ms.`,
          requestId: request.requestId,
          sessionId: options.sessionId,
          operation,
        }))
      }, timeoutMs)
      this.pending.set(request.requestId, {
        operation,
        resolve: resolve as (response: PulseRuntimeResponse<unknown>) => void,
        reject,
        timer,
      })

      child.stdin.write(serializePulseRuntimeRequest(request), 'utf8', (error) => {
        if (!error) return
        const pending = this.pending.get(request.requestId)
        if (!pending) return
        clearTimeout(pending.timer)
        this.pending.delete(request.requestId)
        const runtimeError = new PulseRuntimeError({
          code: 'STDIN_ERROR',
          message: `Could not write ${operation} to Pulse runtime stdin.`,
          requestId: request.requestId,
          sessionId: options.sessionId,
          operation,
          cause: error,
        })
        pending.reject(runtimeError)
        this.failProcess(runtimeError)
      })
    })
  }

  async stop(): Promise<void> {
    const child = this.child
    if (!child) {
      this._state = 'stopped'
      this.cleanupChildReferences()
      return
    }
    if (child.exitCode !== null) {
      this._state = 'stopped'
      this.cleanupChildReferences()
      return
    }

    this._state = 'stopping'
    try {
      await this.sendRaw('SHUTDOWN', { timeoutMs: this.config.timeoutMs })
      await this.waitForExit(this.config.timeoutMs)
    } catch {
      if (child.exitCode === null) child.kill('SIGTERM')
      try {
        await this.waitForExit(1_000)
      } catch {
        if (child.exitCode === null) child.kill('SIGKILL')
        await this.waitForExit(1_000).catch(() => undefined)
      }
    } finally {
      this._state = 'stopped'
      this.cleanupChildReferences()
    }
  }

  private async waitForExit(timeoutMs: number): Promise<void> {
    if (!this.child || this.child.exitCode !== null || this.exitHandled) return
    const exitPromise = this.exitPromise ?? Promise.resolve()
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Timed out waiting for process exit.')), timeoutMs)
      exitPromise.then(() => {
        clearTimeout(timer)
        resolve()
      }, reject)
    })
  }

  private cleanupChildReferences(): void {
    this.stdoutReader?.close()
    this.stderrReader?.close()
    this.stdoutReader = null
    this.stderrReader = null
    this.child = null
    this.exitPromise = null
    this.resolveExit = null
    this.exitHandled = false
    this.detachParentExitGuard()
    if (this.runtimeDirectory) {
      rmSync(this.runtimeDirectory, { recursive: true, force: true })
      this.runtimeDirectory = null
    }
  }
}

const GLOBAL_MANAGER_KEY = Symbol.for('medix.pulse-runtime.process-manager')
type PulseRuntimeGlobal = typeof globalThis & {
  [GLOBAL_MANAGER_KEY]?: PulseProcessManager
}

export function getPulseProcessManager(
  options: PulseProcessManagerOptions = {},
): PulseProcessManager {
  const runtimeGlobal = globalThis as PulseRuntimeGlobal
  const current = runtimeGlobal[GLOBAL_MANAGER_KEY]
  if (current && current.state !== 'failed' && current.state !== 'stopped') return current
  const manager = new PulseProcessManager(options)
  runtimeGlobal[GLOBAL_MANAGER_KEY] = manager
  return manager
}

export async function disposePulseProcessManager(): Promise<void> {
  const runtimeGlobal = globalThis as PulseRuntimeGlobal
  const manager = runtimeGlobal[GLOBAL_MANAGER_KEY]
  delete runtimeGlobal[GLOBAL_MANAGER_KEY]
  await manager?.stop()
}
