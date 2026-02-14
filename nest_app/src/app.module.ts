import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NatsModule } from './nats/nats.module';
import { NatsLoggingInterceptor } from './common/interceptors/nats-logging.interceptor';
import { NatsExceptionFilter } from './common/filters/nats-exception.filter';

@Module({
  imports: [NatsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: NatsLoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: NatsExceptionFilter,
    },
  ],
})
export class AppModule {}
