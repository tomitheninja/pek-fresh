import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';

export const VALIDATE_ONLY = process.argv.includes('--validate-only');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );

  process.env.NODE_ENV !== 'production' &&
    app.enableCors({
      origin: 'http://localhost:3000',
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
  generateOpenAPIConfig(document);

  // start server
  if (VALIDATE_ONLY) {
    Logger.log('Validation successful');
    await app.close();
    process.exit(0);
  }
  await app.listen(process.env['API_PORT'] ?? 4000);
  Logger.log(`Listening at ${await app.getUrl()}`);
}
bootstrap();

/**
 * This function is used to check if the swagger.yaml file is up to date.
 * - In development mode, the file is updated automatically.
 * - In production or validate-only mode the process will exit if the file is not up to date.
 * @returns true if the file was updated, false otherwise
 */
function generateOpenAPIConfig(config: OpenAPIObject) {
  const deepEqual = <T>(a: T, b: T) => JSON.stringify(a) === JSON.stringify(b);

  const configPath = join(__dirname, '..', 'openapi.json');
  const oldConfig = readFileSync(configPath, 'utf-8');

  if (deepEqual(JSON.parse(oldConfig), config)) {
    Logger.log('OpenAPI config file is up to date');
    return false;
  }

  // fail in production or validate only mode
  if (process.env.NODE_ENV === 'production' || VALIDATE_ONLY) {
    Logger.error(`${configPath} is not up to date`);
    process.exit(1);
  }

  // update in development mode
  const newConfig = JSON.stringify(config, null, 2);
  console.log(`Updating ${configPath}`);
  writeFileSync(configPath, newConfig);
  return true;
}
