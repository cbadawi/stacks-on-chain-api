import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const corsOptions: CorsOptions = {
  origin: '*',
  maxAge: 300,
  methods: 'GET,HEAD,POST',
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: corsOptions });
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT');

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Stacks on Chain API')
    .setDescription('DEFI & NFT Analytics.')
    .setVersion('1.0')
    .addTag('Nfts')
    .addTag('Blocks')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup(`/v1/api-docs`, app, document);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(PORT);
  console.log(`server started on port ${PORT}`);
}
bootstrap();
