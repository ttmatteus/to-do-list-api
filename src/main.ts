import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativar o ValidationPipe globalmente
  app.useGlobalPipes(new ValidationPipe({
    transform: true,  
    whitelist: true,  
    forbidNonWhitelisted: true,  
  }));

  await app.listen(3000);
}
bootstrap();
