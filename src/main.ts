import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // allows use of dto pipes globally - the whitelist property prevents unspecified data properties from be accepted and strips them from POST requests
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))
  await app.listen(3333);
}
bootstrap();
