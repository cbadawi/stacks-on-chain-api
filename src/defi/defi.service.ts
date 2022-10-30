import 'cross-fetch/polyfill';
import { contractPrincipalCV, uintCV } from 'micro-stacks/clarity';
import { fetchReadOnlyFunction } from 'micro-stacks/api';
import { StacksMainnet } from 'micro-stacks/network';
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlocksService } from '../blocks/blocks.service';
import { ConfigService } from '@nestjs/config';
import { poolHelper, tokensHelper } from '../common/helpers/defi-helpers';
import {
  PoolBalanceAtDate,
  PoolBalancesDocument,
} from './schemas/balances.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BalancesDto } from './dto/balances.dto';
import { getFunctionArgs } from 'src/common/utils/functionArgs';

export interface poolBalances {
  'balance-x': bigint;
  'balance-y': bigint;
}

@Injectable()
export class DefiService implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    private blockService: BlocksService,
    private prisma: PrismaService,
    @InjectModel(PoolBalanceAtDate.name)
    private readonly balancesModel: Model<PoolBalancesDocument>,
  ) {}

  VALID_POOL_TRAITS = [
    'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.fwp-wstx-wbtc-50-50-v1-01',
    'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.fwp-wstx-alex-50-50-v1-01',
  ];

  async onModuleInit() {
    const NODE_ENV = this.configService.get<string>('NODE_ENV');
    if (NODE_ENV === 'localhost') return;

    const latestInsertedDate = (await this.getLastBalancesDate())?.date;
    const dailyBlocks = (await this.blockService.getFirstBlockperDay())?.blocks;
    const validBlocks = dailyBlocks.filter(
      (block) => !latestInsertedDate || latestInsertedDate < block.day,
    );

    let balances: PoolBalanceAtDate[] = [];

    await Promise.all(
      validBlocks.map(async (block) => {
        const blockBalance = await this.getBlockPoolBalances(block);
        if (blockBalance) balances.push(...blockBalance.blockBalances);
        return blockBalance;
      }),
    );
    await this.balancesModel.insertMany(balances);
  }

  async getHistory(addressesArray: string[]) {
    const history = await this.prisma.defiFarmingHistory.findMany({
      where: {
        address: { in: addressesArray },
        trait_reference: { in: this.VALID_POOL_TRAITS },
      },
    });

    return { history };
  }

  async getRewards(addressesArray: string[]) {
    const rewards = await this.prisma.defiFarmingHistory.findMany({
      where: {
        address: { in: addressesArray },
        trait_reference: { in: this.VALID_POOL_TRAITS },
        contract_call_function_name: 'claim-staking-reward',
        asset_identifier:
          'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.age000-governance-token::alex',
      },
    });

    return { rewards };
  }

  async getBlockPoolBalances(block: { day: Date; blockHeight: number }) {
    const blockHeight = block['block_height'];
    const indexBlockHash = block['index_block_hash'];
    const blockBalances = await Promise.all(
      this.VALID_POOL_TRAITS.map(async (trait) => {
        const helper = poolHelper.find((pool) => trait === pool.trait);
        if (!helper) throw new NotFoundException(trait);
        if (blockHeight >= helper.genesisBlock) {
          const poolBalances = await this.getPoolBalances(
            trait,
            indexBlockHash,
          );
          return {
            trait,
            date: block.day as Date,
            balanceX: poolBalances['balance-x'].toString(),
            balanceY: poolBalances['balance-y'].toString(),
          };
        }
      }),
    );
    if (!blockBalances.includes(undefined)) return { blockBalances };
  }

  async getLastBalancesDate() {
    const lastInsertedDate = await this.balancesModel
      .findOne()
      .sort({ date: -1 })
      .limit(1);
    return { date: lastInsertedDate?.date };
  }

  async getPoolBalances(
    trait: string,
    indexBlockHash?: Buffer,
  ): Promise<poolBalances> {
    const network = new StacksMainnet({
      url: this.configService.get<string>('NODE_BASE_URL'),
    });
    const functionName = 'get-balances';

    let tip: string;

    if (indexBlockHash) tip = indexBlockHash.toString('hex');

    const { contractId, tokenX, tokenY, weightX, weightY } = poolHelper.find(
      (pool) => pool.trait === trait,
    );

    const [poolPrincipal, poolName] = contractId.split('.');
    const [contractIdTokenX, assetX] = tokenX.split('::');
    const [contractIdTokenY, assetY] = tokenY.split('::');
    const [principalX, contractNameX] = contractIdTokenX.split('.');
    const [principalY, contractNameY] = contractIdTokenY.split('.');

    const functionArgs = [
      contractPrincipalCV(principalX, contractNameX),
      contractPrincipalCV(principalY, contractNameY),
      uintCV(weightX),
      uintCV(weightY),
    ];
    let balances: poolBalances;
    try {
      balances = await fetchReadOnlyFunction({
        contractAddress: poolPrincipal,
        contractName: poolName,
        functionName,
        functionArgs,
        network,
        tip,
      });
    } catch (err) {
      console.error(indexBlockHash, trait, err);
    }

    return balances;
  }
}
