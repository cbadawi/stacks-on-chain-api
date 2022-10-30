import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { BlocksService } from 'src/blocks/blocks.service';
import { poolHelper } from 'src/common/helpers/defi-helpers';
import { DefiService } from 'src/defi/defi.service';
import {
  PoolBalanceAtDate,
  PoolBalancesDocument,
} from 'src/defi/schemas/balances.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(PoolBalanceAtDate.name)
    private readonly balancesModel: Model<PoolBalancesDocument>,
    private blockService: BlocksService,
    private defiService: DefiService,
  ) {}

  @Cron('0 0 0 * * *') // every day
  async handleFloorRefresh() {
    const poolTaits = [...new Set(poolHelper.map((pool) => pool.trait))];
    poolTaits.forEach(async (trait) => {
      const newBalances = await this.defiService.getPoolBalances(trait);

      const balancesDoc: PoolBalanceAtDate = {
        trait,
        date: new Date(),
        balanceX: newBalances['balance-x'].toString(),
        balanceY: newBalances['balance-y'].toString(),
      };
      await this.balancesModel.create(balancesDoc);
    });
  }
}
