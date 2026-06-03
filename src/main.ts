import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  await app.listen(3000);
  console.log('✅ Restaurant ChatBot is running on http://localhost:3000');
  console.log('🌐 Access chatbot at http://localhost:3000/chatbot.html');
}
bootstrap();
