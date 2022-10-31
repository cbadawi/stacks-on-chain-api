import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DailyPoolBalances,
  PoolBalanceSchema,
} from 'src/defi/schemas/balances.schema';
import { TasksService } from './tasks.service';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    forwardRef(() => AppModule),
    MongooseModule.forFeature([
      { name: DailyPoolBalances.name, schema: PoolBalanceSchema },
    ]),
  ],
  providers: [TasksService],
})
export class TasksModule {}
