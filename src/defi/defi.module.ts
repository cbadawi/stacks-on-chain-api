import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BlocksService } from 'src/blocks/blocks.service';
import { DefiController } from './defi.controller';
import { DefiService } from './defi.service';
import { PoolBalance, PoolBalanceSchema } from './schemas/balances.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PoolBalance.name, schema: PoolBalanceSchema },
    ]),
  ],
  controllers: [DefiController],
  providers: [DefiService, BlocksService],
})
export class DefiModule {}
