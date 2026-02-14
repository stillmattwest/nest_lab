import { Module, Global } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NatsLoggingService } from './nats-logging.service';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NATS_CLIENT',
        transport: Transport.NATS,
        options: {
          servers: ['nats://nats:4222'],
        },
      },
    ]),
  ],
  providers: [NatsLoggingService],
  exports: [NatsLoggingService],
})
export class NatsModule {}
