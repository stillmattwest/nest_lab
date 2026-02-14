import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Connect to the Nervous System (NATS)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: ['nats://nats:4222'],
    },
  });

  // 2. Start all microservices (NATS) and then start the HTTP server
  await app.startAllMicroservices();
  await app.listen(3000); // Internal port mapped to 3001 on your Mac
  
  console.log('Strangler is active: Listening for HTTP and NATS events.');
}
bootstrap();
