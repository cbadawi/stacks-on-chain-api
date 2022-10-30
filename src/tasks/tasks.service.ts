import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { poolHelper } from '../common/helpers/defi-helpers';
import { DefiService } from '../defi/defi.service';
import {
  PoolBalanceAtDate,
  PoolBalancesDocument,
} from '../defi/schemas/balances.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(PoolBalanceAtDate.name)
    private readonly balancesModel: Model<PoolBalancesDocument>,
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
