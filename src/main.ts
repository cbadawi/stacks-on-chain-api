import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

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
