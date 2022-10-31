import 'cross-fetch/polyfill';
import { contractPrincipalCV, uintCV } from 'micro-stacks/clarity';
import { fetchReadOnlyFunction } from 'micro-stacks/api';
import { StacksMainnet } from 'micro-stacks/network';
import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlocksService } from '../blocks/blocks.service';
import { ConfigService } from '@nestjs/config';
import { poolHelper, tokensHelper } from '../common/helpers/defi-helpers';
import {
  DailyPoolDetails,
  PoolDetailsDocument,
} from './schemas/balances.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TransactionsService } from '../transactions/transactions.service';
import { poolBalances } from './interfaces/poolBalances';

@Injectable()
export class DefiService implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    private blockService: BlocksService,
    private prisma: PrismaService,
    private transactionsService: TransactionsService,
    @InjectModel(DailyPoolDetails.name)
    private readonly balancesModel: Model<PoolDetailsDocument>,
  ) {}

  VALID_POOL_TRAITS = [
    'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.fwp-wstx-wbtc-50-50-v1-01',
    'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.fwp-wstx-alex-50-50-v1-01',
  ];

  REWARD_TOKEN =
    'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.age000-governance-token::alex';

  async onModuleInit() {
    const NODE_ENV = this.configService.get<string>('NODE_ENV');
    if (NODE_ENV === 'localhost') return;

    const latestInsertedDate = (await this.getLastBalancesDate())?.date;
    const dailyBlocks = (await this.blockService.getFirstBlockperDay())?.blocks;
    const validBlocks = dailyBlocks.filter(
      (block) => !latestInsertedDate || latestInsertedDate < block.day,
    );

    let balances: DailyPoolDetails[] = [];

    await Promise.all(
      validBlocks.map(async (block) => {
        const traitDetails = await this.getAllTraitDetails(block);
        if (traitDetails) balances.push(...traitDetails);
        return traitDetails;
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

  async getActiveFarms(addressesArray: string[]) {
    const history = (await this.getHistory(addressesArray))?.history;
    if (!history.length) return [];

    const stakingHistory = history.filter(
      (h) => h.contract_call_function_name === 'stake-tokens',
    );

    const helper = poolHelper.map((pool) => ({
      ...pool,
      tokenXImage: tokensHelper.find((t) => t.token === pool.tokenX)?.image,
      tokenYImage: tokensHelper.find((t) => t.token === pool.tokenY)?.image,
    }));

    // get staking period length
    const txHashes = stakingHistory.map((h) => h['tx_hash']);
    const decodedTx = (
      await this.transactionsService.getDecodedFunctionArgs(
        txHashes,
        'lock-period',
      )
    ).decodedTxArgs;

    const txsLockPeriod = decodedTx.map((tx) => {
      return {
        txHash: tx.tx_id.toString(),
        lockPeriod: parseInt(tx.args[2].repr.replace('u', '')),
      };
    });
    const tipHeight = await this.blockService.getTipHeight();

    const stakingDetails = stakingHistory.map((stake) => ({
      ...stake,
      ...txsLockPeriod.find((p) => stake['tx_hash'] === p['tx_hash']),
      ...helper.find(
        (b) =>
          b.trait === stake['trait_reference'] ||
          `'`.concat(b.trait) === stake['trait_reference'],
      ),
    }));

    const activePools = stakingDetails
      .map((stake) => {
        const blocksTillFirstCycle =
          (stake['block_height'] - stake.genesisBlock) % stake.blocksInCycle;
        const nextCycleStartBlock =
          blocksTillFirstCycle + stake['block_height'];
        return {
          ...stake,
          cycle: Math.floor(
            (tipHeight - nextCycleStartBlock) / stake.blocksInCycle,
          ),
        };
      })
      .filter((stake) => stake.cycle <= stake.lockPeriod);

    return { activePools };
  }

  async getRewards(addressesArray: string[]) {
    const history = (await this.getHistory(addressesArray))?.history;

    const rewards = history.filter(
      (h) =>
        h.contract_call_function_name === 'claim-staking-reward' &&
        h.asset_identifier === this.REWARD_TOKEN,
    );

    return { rewards };
  }

  async getAllTraitDetails(block: {
    day: Date;
    blockHeight: number;
    indexBlockHash: Buffer;
  }) {
    const blockHeight = block.blockHeight;
    const indexBlockHash = block.indexBlockHash;
    const blockBalances = await Promise.all(
      this.VALID_POOL_TRAITS.map(async (trait) => {
        const helper = poolHelper.find((pool) => trait === pool.trait);

        if (!helper) throw new NotFoundException(trait);

        if (blockHeight >= helper.genesisBlock) {
          const poolDetails = await this.getPoolDetails(trait, indexBlockHash);
          if (
            poolDetails &&
            poolDetails['balance-x'] &&
            poolDetails.lpTokenSupply
          )
            return {
              trait,
              date: block.day as Date,
              balanceX: poolDetails['balance-x'].toString(),
              balanceY: poolDetails['balance-y'].toString(),
              lpTokenSupply: poolDetails.lpTokenSupply.toString(),
            };
        }
      }),
    );
    if (!blockBalances.includes(undefined) && blockBalances)
      return blockBalances;
    else return [];
  }

  async getLastBalancesDate() {
    const lastInsertedDate = await this.balancesModel
      .findOne()
      .sort({ date: -1 })
      .limit(1);
    return { date: lastInsertedDate?.date };
  }

  async getPoolDetails(trait: string, indexBlockHash?: Buffer) {
    const network = new StacksMainnet({
      url: this.configService.get<string>('NODE_BASE_URL'),
    });

    const balancesFunctionName = 'get-balances';
    const supplyFunctionName = 'get-total-supply';

    let tip: string;
    if (indexBlockHash) tip = indexBlockHash.toString('hex');

    const { contractId, tokenX, tokenY, weightX, weightY } = poolHelper.find(
      (pool) => pool.trait === trait,
    );

    const [poolPrincipal, poolName] = contractId.split('.');
    const [traitPrincipal, traitName] = trait.split('.');
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
    let lpTokenSupply: bigint;
    try {
      balances = await fetchReadOnlyFunction({
        contractAddress: poolPrincipal,
        contractName: poolName,
        functionName: balancesFunctionName,
        functionArgs,
        network,
        tip,
      });

      lpTokenSupply = await fetchReadOnlyFunction({
        contractAddress: traitPrincipal,
        contractName: traitName,
        functionName: supplyFunctionName,
        functionArgs: [],
        network,
        tip,
      });
    } catch (err) {
      Logger.error(indexBlockHash, trait, err);
    }

    return { ...balances, lpTokenSupply };
  }
}
