import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { Logger, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // * using prefix api without versioning will conflict with swagger ui
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // enable swagger
  const config = new DocumentBuilder()
    .setTitle('PEK:fresh API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  saveSwaggerConfig(document);

  // start server
  await app.listen(3000);
  Logger.log(`Listening at ${await app.getUrl()}`)
}
bootstrap();

/**
 * This function is used to check if the swagger.yaml file is up to date.
 * - In development mode, the file is updated automatically.
 * - In production mode the server will not start if the file is not up to date.
 */
function saveSwaggerConfig(config: OpenAPIObject) {
  const path = join(__dirname, '..', '..', 'swagger.json');
  const oldConfig = readFileSync(path, 'utf-8');
  const newConfig = JSON.stringify(config, null, 2);
  if (oldConfig === newConfig) return;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('swagger.yaml is not up to date');
  }

  console.log('Updating swagger.yaml');
  writeFileSync(path, newConfig);
}
