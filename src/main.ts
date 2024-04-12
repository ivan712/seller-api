import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
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

  //only for dev !!!
  app.enableCors({
    origin: '*',
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
}
bootstrap();
