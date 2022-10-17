import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit
{
  constructor(private configService: ConfigService) {
    super({
      log:
        configService.get<string>('NODE_ENV') === 'development'
          ? [
              {
                emit: 'event',
                level: 'query',
              },
              {
                emit: 'stdout',
                level: 'error',
              },
              {
                emit: 'stdout',
                level: 'info',
              },
              {
                emit: 'stdout',
                level: 'warn',
              },
            ]
          : undefined,
    });

    this.$on('query', (e) => {
      console.info('Query: ' + e.query);
      console.info('Params: ' + e.params);
      console.info('Duration: ' + e.duration + 'ms');
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
