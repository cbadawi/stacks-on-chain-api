import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { poolHelper } from '../common/helpers/defi-helpers';
import { DefiService } from '../defi/defi.service';
import {
  DailyPoolDetails,
  PoolDetailsDocument,
} from '../defi/schemas/balances.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(DailyPoolDetails.name)
    private readonly balancesModel: Model<PoolDetailsDocument>,
    private defiService: DefiService,
  ) {}

  @Cron('0 0 0 * * *') // every day
  async handleFloorRefresh() {
    const poolTaits = [...new Set(poolHelper.map((pool) => pool.trait))];
    poolTaits.forEach(async (trait) => {
      const newBalances = await this.defiService.getPoolDetails(trait);

      const detailsDoc: DailyPoolDetails = {
        trait,
        date: new Date(),
        balanceX: newBalances['balance-x'].toString(),
        balanceY: newBalances['balance-y'].toString(),
        lpTokenSupply: newBalances.lpTokenSupply.toString(),
      };
      await this.balancesModel.create(detailsDoc);
    });
  }
}
