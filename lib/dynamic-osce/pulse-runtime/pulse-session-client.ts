import { PulseRuntimeError } from './pulse-runtime-errors'
import {
  getPulseProcessManager,
  type PulseProcessManager,
} from './pulse-process-manager'
import type {
  CreateSessionPayload,
  ApplyActionPayload,
  ApplyConditionPayload,
  CancelActionPayload,
  PulseActionApplicationResult,
  PulseActionCancellationResult,
  PulseEventsResult,
  PulsePatientProfile,
  PulseSnapshot,
} from './pulse-runtime-types'

export class PulseSessionClient {
  readonly sessionId: string
  readonly patient: PulsePatientProfile
  private readonly manager: PulseProcessManager
  private terminated = false

  private constructor(params: {
    manager: PulseProcessManager
    sessionId: string
    patient: PulsePatientProfile
  }) {
    this.manager = params.manager
    this.sessionId = params.sessionId
    this.patient = params.patient
  }

  static async create(
    payload?: CreateSessionPayload,
    manager: PulseProcessManager = getPulseProcessManager(),
  ): Promise<{ client: PulseSessionClient; snapshot: PulseSnapshot }> {
    const response = await manager.request('CREATE_SESSION', { payload })
    if (!response.data) {
      throw new PulseRuntimeError({
        code: 'PROTOCOL_ERROR',
        message: 'CREATE_SESSION response did not contain data.',
        requestId: response.requestId,
        operation: 'CREATE_SESSION',
      })
    }
    return {
      client: new PulseSessionClient({
        manager,
        sessionId: response.data.sessionId,
        patient: response.data.patient,
      }),
      snapshot: response.data.snapshot,
    }
  }

  private requireActive(): void {
    if (this.terminated) {
      throw new PulseRuntimeError({
        code: 'SESSION_ALREADY_TERMINATED',
        message: 'Session is already terminated.',
        sessionId: this.sessionId,
      })
    }
  }

  async getSnapshot(): Promise<PulseSnapshot> {
    this.requireActive()
    const response = await this.manager.request('GET_SNAPSHOT', {
      sessionId: this.sessionId,
    })
    if (!response.data) {
      throw new PulseRuntimeError({
        code: 'PROTOCOL_ERROR',
        message: 'GET_SNAPSHOT response did not contain data.',
        requestId: response.requestId,
        sessionId: this.sessionId,
        operation: 'GET_SNAPSHOT',
      })
    }
    return response.data
  }

  async advanceTime(seconds: number): Promise<PulseSnapshot> {
    this.requireActive()
    const response = await this.manager.request('ADVANCE_TIME', {
      sessionId: this.sessionId,
      payload: { seconds },
    })
    if (!response.data) {
      throw new PulseRuntimeError({
        code: 'PROTOCOL_ERROR',
        message: 'ADVANCE_TIME response did not contain data.',
        requestId: response.requestId,
        sessionId: this.sessionId,
        operation: 'ADVANCE_TIME',
      })
    }
    return response.data
  }

  async applyCondition(payload: ApplyConditionPayload): Promise<never> {
    this.requireActive()
    const response = await this.manager.request('APPLY_CONDITION', {
      sessionId: this.sessionId,
      payload,
    })
    throw new PulseRuntimeError({
      code: 'PROTOCOL_ERROR',
      message: 'APPLY_CONDITION unexpectedly returned success.',
      requestId: response.requestId,
      sessionId: this.sessionId,
      operation: 'APPLY_CONDITION',
    })
  }

  async applyAction(
    payload: ApplyActionPayload,
  ): Promise<PulseActionApplicationResult> {
    this.requireActive()
    const response = await this.manager.request('APPLY_ACTION', {
      sessionId: this.sessionId,
      payload,
    })
    if (!response.data) {
      throw new PulseRuntimeError({
        code: 'PROTOCOL_ERROR',
        message: 'APPLY_ACTION response did not contain data.',
        requestId: response.requestId,
        sessionId: this.sessionId,
        operation: 'APPLY_ACTION',
      })
    }
    return response.data
  }

  async cancelAction(
    payload: CancelActionPayload,
  ): Promise<PulseActionCancellationResult> {
    this.requireActive()
    const response = await this.manager.request('CANCEL_ACTION', {
      sessionId: this.sessionId,
      payload,
    })
    if (!response.data) {
      throw new PulseRuntimeError({
        code: 'PROTOCOL_ERROR',
        message: 'CANCEL_ACTION response did not contain data.',
        requestId: response.requestId,
        sessionId: this.sessionId,
        operation: 'CANCEL_ACTION',
      })
    }
    return response.data
  }

  async getEvents(): Promise<PulseEventsResult> {
    this.requireActive()
    const response = await this.manager.request('GET_EVENTS', {
      sessionId: this.sessionId,
    })
    if (!response.data) {
      throw new PulseRuntimeError({
        code: 'PROTOCOL_ERROR',
        message: 'GET_EVENTS response did not contain data.',
        requestId: response.requestId,
        sessionId: this.sessionId,
        operation: 'GET_EVENTS',
      })
    }
    return response.data
  }

  async terminate(): Promise<void> {
    this.requireActive()
    await this.manager.request('TERMINATE_SESSION', {
      sessionId: this.sessionId,
    })
    this.terminated = true
  }
}
