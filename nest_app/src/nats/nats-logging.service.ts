import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export const NATS_SUBJECT_PREFIX = 'nest_app';

@Injectable()
export class NatsLoggingService implements OnModuleInit {
  constructor(
    @Inject('NATS_CLIENT') private readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  /**
   * Publish an event to NATS. Subject will be prefixed with nest_app.
   */
  async publish(subject: string, payload: Record<string, unknown>): Promise<void> {
    const fullSubject = subject.startsWith(NATS_SUBJECT_PREFIX)
      ? subject
      : `${NATS_SUBJECT_PREFIX}.${subject}`;
    const envelope = {
      ...payload,
      _timestamp: new Date().toISOString(),
      _service: 'nest_app',
    };
    try {
      await firstValueFrom(this.client.emit(fullSubject, envelope));
    } catch (err) {
      // Log but don't throw - logging should not break the app
      console.error('[NatsLoggingService] Publish failed:', err);
    }
  }

  /** Log an HTTP request (call from interceptor). */
  async logRequest(payload: {
    method: string;
    path: string;
    statusCode?: number;
    durationMs?: number;
    ip?: string;
  }): Promise<void> {
    await this.publish('request', payload);
  }

  /** Log an error (call from exception filter or catch blocks). */
  async logError(payload: {
    message: string;
    stack?: string;
    context?: string;
    [key: string]: unknown;
  }): Promise<void> {
    await this.publish('error', payload);
  }
}
