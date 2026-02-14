import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('NATS event handlers', () => {
    it('handleMonolithStatus processes payload without throwing', () => {
      const payload = { status: 'success', database: 'connected' };
      expect(() =>
        appController.handleMonolithStatus(payload),
      ).not.toThrow();
    });

    it('handleMonolithRequest processes payload without throwing', () => {
      const payload = {
        method: 'GET',
        path: 'api/posts',
        status: 200,
        timestamp: '2024-01-01T00:00:00+00:00',
      };
      expect(() =>
        appController.handleMonolithRequest(payload),
      ).not.toThrow();
    });
  });
});
