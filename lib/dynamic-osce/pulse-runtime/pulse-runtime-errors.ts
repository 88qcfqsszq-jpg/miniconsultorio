import type {
  PulseRuntimeResponse,
  PulseRuntimeOperation,
} from './pulse-runtime-protocol'

export class PulseRuntimeError extends Error {
  readonly code: string
  readonly details?: unknown
  readonly requestId?: string
  readonly sessionId?: string
  readonly operation?: PulseRuntimeOperation

  constructor(params: {
    code: string
    message: string
    details?: unknown
    requestId?: string
    sessionId?: string
    operation?: PulseRuntimeOperation
    cause?: unknown
  }) {
    super(params.message, { cause: params.cause })
    this.name = 'PulseRuntimeError'
    this.code = params.code
    this.details = params.details
    this.requestId = params.requestId
    this.sessionId = params.sessionId
    this.operation = params.operation
  }

  static fromResponse(
    response: PulseRuntimeResponse,
    operation: PulseRuntimeOperation,
  ): PulseRuntimeError {
    return new PulseRuntimeError({
      code: response.error?.code ?? 'PROTOCOL_ERROR',
      message: response.error?.message ?? 'Pulse runtime returned an error.',
      details: response.error?.details,
      requestId: response.requestId,
      sessionId: response.sessionId,
      operation,
    })
  }
}

export function toPulseRuntimeError(
  error: unknown,
  fallback: { code: string; message: string; operation?: PulseRuntimeOperation },
): PulseRuntimeError {
  if (error instanceof PulseRuntimeError) return error
  return new PulseRuntimeError({
    ...fallback,
    cause: error,
  })
}
