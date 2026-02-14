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

  // Catches the 'monolith.status_checked' broadcast from Laravel (e.g. GET /api/status)
  @EventPattern('monolith.status_checked')
  handleMonolithStatus(@Payload() data: any) {
    console.log('--- STRANGLER OVERHEARD MONOLITH ---');
    console.log('Subject: monolith.status_checked');
    console.log('Payload:', data);
  }

  // Catches every API request from Laravel (middleware publishes after each request)
  @EventPattern('monolith.request')
  handleMonolithRequest(@Payload() data: any) {
    console.log('--- STRANGLER OVERHEARD MONOLITH ---');
    console.log('Subject: monolith.request');
    console.log('Payload:', data);
  }
}