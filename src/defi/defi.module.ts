import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppModule } from 'src/app.module';
import { TransactionsService } from 'src/transactions/transactions.service';
import { BlocksService } from '../blocks/blocks.service';
import { DefiController } from './defi.controller';
import { DefiService } from './defi.service';
import {
  DailyPoolDetails,
  PoolDetailsSchema,
} from './schemas/poolDetails.schema';

@Module({
  imports: [
    forwardRef(() => AppModule),
    MongooseModule.forFeature([
      { name: DailyPoolDetails.name, schema: PoolDetailsSchema },
    ]),
  ],
  exports: [DefiService],
  controllers: [DefiController],
  providers: [DefiService, BlocksService, TransactionsService],
})
export class DefiModule {}
