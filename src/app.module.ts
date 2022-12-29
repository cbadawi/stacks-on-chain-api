import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import configuration from './config/configuration';
import { BlocksModule } from './blocks/blocks.module';
import { NftModule } from './nft/nft.module';
import { DefiModule } from './defi/defi.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/MongooseConfigService';
import { TasksModule } from './tasks/tasks.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    PrismaModule,
    BlocksModule,
    NftModule,
    forwardRef(() => DefiModule),
    TasksModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService,
    }),
    TransactionsModule,
  ],
  exports: [BlocksModule, NftModule, DefiModule, TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
