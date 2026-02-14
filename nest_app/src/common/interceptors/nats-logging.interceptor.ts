import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NatsLoggingService } from '../../nats/nats-logging.service';

@Injectable()
export class NatsLoggingInterceptor implements NestInterceptor {
  constructor(private readonly nats: NatsLoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<{ method: string; url: string; ip?: string }>();
    const res = http.getResponse();
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Date.now() - start;
          const statusCode = res.statusCode;
          this.nats
            .logRequest({
              method: req.method,
              path: req.url,
              statusCode,
              durationMs,
              ip: req.ip,
            })
            .catch(() => {});
        },
        error: (err) => {
          const durationMs = Date.now() - start;
          this.nats
            .logRequest({
              method: req.method,
              path: req.url,
              statusCode: 500,
              durationMs,
              ip: req.ip,
            })
            .catch(() => {});
          this.nats
            .logError({
              message: err?.message ?? String(err),
              stack: err?.stack,
              context: 'NatsLoggingInterceptor',
              path: req.url,
              method: req.method,
            })
            .catch(() => {});
        },
      }),
    );
  }
}
