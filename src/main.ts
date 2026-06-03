import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Serve static files
  app.use('/public', require('express').static('public'));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Restaurant ChatBot running on http://localhost:${port}`);
}

bootstrap();