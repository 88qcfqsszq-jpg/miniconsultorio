import { randomUUID } from 'node:crypto'

export const PULSE_RUNTIME_PROTOCOL_VERSION = '1' as const

export const PULSE_RUNTIME_OPERATIONS = [
  'PING',
  'GET_ENGINE_INFO',
  'CREATE_SESSION',
  'APPLY_CONDITION',
  'APPLY_ACTION',
  'CANCEL_ACTION',
  'ADVANCE_TIME',
  'GET_SNAPSHOT',
  'GET_EVENTS',
  'TERMINATE_SESSION',
  'SHUTDOWN',
] as const

export type PulseRuntimeOperation = (typeof PULSE_RUNTIME_OPERATIONS)[number]

export interface PulseRuntimeRequest<T = unknown> {
  protocolVersion: '1'
  requestId: string
  operation: PulseRuntimeOperation
  sessionId?: string
  payload?: T
}

export interface PulseRuntimeRemoteError {
  code: string
  message: string
  details?: unknown
}

export interface PulseRuntimeResponse<T = unknown> {
  protocolVersion: '1'
  requestId: string
  sessionId?: string
  ok: boolean
  data?: T
  error?: PulseRuntimeRemoteError
  warnings: string[]
  engineVersion?: string
  simulationTimeSeconds?: number
}

export function createPulseRuntimeRequestId(): string {
  return randomUUID()
}

export function createPulseRuntimeRequest<T>(params: {
  operation: PulseRuntimeOperation
  sessionId?: string
  payload?: T
  requestId?: string
}): PulseRuntimeRequest<T> {
  return {
    protocolVersion: PULSE_RUNTIME_PROTOCOL_VERSION,
    requestId: params.requestId ?? createPulseRuntimeRequestId(),
    operation: params.operation,
    ...(params.sessionId === undefined ? {} : { sessionId: params.sessionId }),
    ...(params.payload === undefined ? {} : { payload: params.payload }),
  }
}

export function serializePulseRuntimeRequest(request: PulseRuntimeRequest): string {
  return `${JSON.stringify(request)}\n`
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parsePulseRuntimeResponseLine(
  line: string,
): PulseRuntimeResponse<unknown> {
  let parsed: unknown
  try {
    parsed = JSON.parse(line)
  } catch (cause) {
    throw new Error('Pulse runtime stdout contained invalid JSON.', { cause })
  }

  if (!isObject(parsed)) {
    throw new Error('Pulse runtime response must be a JSON object.')
  }
  if (parsed.protocolVersion !== PULSE_RUNTIME_PROTOCOL_VERSION) {
    throw new Error('Pulse runtime returned an unsupported protocol version.')
  }
  if (typeof parsed.requestId !== 'string' || parsed.requestId.length === 0) {
    throw new Error('Pulse runtime response has no valid requestId.')
  }
  if (typeof parsed.ok !== 'boolean') {
    throw new Error('Pulse runtime response has no boolean ok field.')
  }
  if (
    !Array.isArray(parsed.warnings)
    || !parsed.warnings.every((warning) => typeof warning === 'string')
  ) {
    throw new Error('Pulse runtime response warnings must be an array of strings.')
  }
  if (
    parsed.sessionId !== undefined
    && (typeof parsed.sessionId !== 'string' || parsed.sessionId.length === 0)
  ) {
    throw new Error('Pulse runtime response has an invalid sessionId.')
  }
  if (parsed.simulationTimeSeconds !== undefined
    && (typeof parsed.simulationTimeSeconds !== 'number'
      || !Number.isFinite(parsed.simulationTimeSeconds))) {
    throw new Error('Pulse runtime response has an invalid simulation time.')
  }
  if (!parsed.ok) {
    if (
      !isObject(parsed.error)
      || typeof parsed.error.code !== 'string'
      || typeof parsed.error.message !== 'string'
    ) {
      throw new Error('Pulse runtime error response has no structured error.')
    }
  }

  return parsed as unknown as PulseRuntimeResponse<unknown>
}

export function isPulseRuntimeOperation(value: unknown): value is PulseRuntimeOperation {
  return typeof value === 'string'
    && (PULSE_RUNTIME_OPERATIONS as readonly string[]).includes(value)
}
