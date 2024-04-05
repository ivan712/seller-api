import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Auth Service')
    .setDescription('Auth API description')
    .setVersion('1.0')
    .addTag('Auth Api')
    .addBearerAuth()
    .addBasicAuth({
      type: 'apiKey',
      name: 'authorization',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  writeFileSync('./swagger.json', JSON.stringify(document), {
    encoding: 'utf8',
  });

  app.enableCors({
    // add multiple origins here
    origin: ['https://learn.javascript.ru', 'https://habr.co'],
  });

  await app.listen(3000);
}
bootstrap();
