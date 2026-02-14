import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { NatsLoggingService } from '../../nats/nats-logging.service';

@Catch()
@Injectable()
export class NatsExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(NatsExceptionFilter.name);

  constructor(private readonly nats: NatsLoggingService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message
        : exception instanceof Error
          ? exception.message
          : String(exception);
    const stack = exception instanceof Error ? exception.stack : undefined;

    this.nats
      .logError({
        message,
        stack,
        context: 'NatsExceptionFilter',
        statusCode: status,
        path: req.url,
        method: req.method,
      })
      .catch((err) => this.logger.warn('NATS log failed', err));

    if (!res.headersSent) {
      res.status(status).json({
        statusCode: status,
        message,
      });
    }
  }
}
