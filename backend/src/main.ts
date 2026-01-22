import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

interface PackageJson {
  name: string;
  description?: string;
  version: string;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        exposeUnsetFields: false,
      },
    }),
  );

  const packageJson: PackageJson = JSON.parse(
    readFileSync(join(process.cwd(), 'package.json'), 'utf8'),
  ) as PackageJson;

  const config = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description || 'App description NOT included')
    .setVersion(packageJson.version)
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [],
  });

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
