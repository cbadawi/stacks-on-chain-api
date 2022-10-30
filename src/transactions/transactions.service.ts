import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { decodeClarityValueList } from 'stacks-encoding-native-js';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async getDecodedFunctionArgs(txHashes: string[], arg?: string) {
    const txRes = await this.prisma.txs.findMany({
      select: { contract_call_function_args: true, tx_id: true },
      where: {
        tx_id: { in: txHashes.map((hash) => Buffer.from(hash, 'hex')) },
      },
    });

    const decodedTxArgs = txRes.map((tx) => {
      const args = decodeClarityValueList(tx['contract_call_function_args']);
      return { ...tx, args };
    });

    console.log(decodedTxArgs[0].args);
    return { decodedTxArgs };
  }
}
