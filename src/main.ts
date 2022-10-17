import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const corsOptions: CorsOptions = {
  origin: '*',
  maxAge: 300,
  methods: 'GET,HEAD,POST',
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: corsOptions });
  await app.listen(3000);
}
bootstrap();
