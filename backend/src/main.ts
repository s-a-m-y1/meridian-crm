import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createNestApp } from './app-bootstrap';

async function bootstrap() {
  const app = await createNestApp();
  const config = app.get(ConfigService);
  const port = config.get<number>('port') ?? 4000;
  await app.listen(port);
}

void bootstrap();
