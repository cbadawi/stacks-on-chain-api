import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlocksModule } from '../blocks/blocks.module';
import { DefiService } from '../defi/defi.service';
import {
  PoolBalanceAtDate,
  PoolBalanceSchema,
} from 'src/defi/schemas/balances.schema';
import { TasksService } from './tasks.service';
import { BlocksService } from '../blocks/blocks.service';
import { TransactionsService } from '../transactions/transactions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PoolBalanceAtDate.name, schema: PoolBalanceSchema },
    ]),
  ],
  providers: [TasksService, BlocksService, TransactionsService, DefiService],
})
export class TasksModule {}
