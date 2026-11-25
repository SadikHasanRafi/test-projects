// Entry point: create the app from the root module and start listening.
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // NestJS runs on top of Express by default
  const app = await NestFactory.create(AppModule);

  // Validate every @Body() against its DTO class.
  // whitelist: drop unknown fields. transform: turn the JSON into a DTO instance.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = app.get(ConfigService).get('PORT', 4002);
  await app.listen(port);
  console.log(`NestJS running on http://localhost:${port}`);
}
void bootstrap();
