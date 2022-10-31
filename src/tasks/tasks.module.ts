import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DailyPoolDetails,
  PoolDetailsSchema,
} from 'src/defi/schemas/balances.schema';
import { TasksService } from './tasks.service';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    forwardRef(() => AppModule),
    MongooseModule.forFeature([
      { name: DailyPoolDetails.name, schema: PoolDetailsSchema },
    ]),
  ],
  providers: [TasksService],
})
export class TasksModule {}
