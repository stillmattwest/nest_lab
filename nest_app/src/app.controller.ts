import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // This catches the 'monolith.status_checked' broadcast from Laravel
  @EventPattern('monolith.status_checked')
  handleMonolithStatus(@Payload() data: any) {
    console.log('--- STRANGLER OVERHEARD MONOLITH ---');
    console.log('Payload:', data);
  }
}