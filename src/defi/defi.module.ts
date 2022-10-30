import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsService } from 'src/transactions/transactions.service';
import { BlocksService } from '../blocks/blocks.service';
import { DefiController } from './defi.controller';
import { DefiService } from './defi.service';
import {
  PoolBalanceAtDate,
  PoolBalanceSchema,
} from './schemas/balances.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PoolBalanceAtDate.name, schema: PoolBalanceSchema },
    ]),
  ],
  controllers: [DefiController],
  providers: [DefiService, BlocksService, TransactionsService],
})
export class DefiModule {}
