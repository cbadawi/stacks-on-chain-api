import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlocksService {
  constructor(private prisma: PrismaService) {}

  async getTipHeight(): Promise<number> {
    const blockHeaightRes = await this.prisma.blocks.findFirst({
      select: { block_height: true },
      where: { canonical: true },
      orderBy: { block_height: 'desc' },
    });
    return blockHeaightRes?.block_height;
  }

  async getIndexBlockHash(tip: number): Promise<Buffer> {
    const indexBlockHashRes = await this.prisma.blocks.findFirst({
      select: { index_block_hash: true },
      where: { canonical: true, block_height: tip },
    });
    return indexBlockHashRes?.index_block_hash;
  }

  async getFirstBlockperDay() {
    const blocks = (await this.prisma.$queryRaw`
    select day, block_height, index_block_hash
    from blocks b 
    join 
      (select to_timestamp(burn_block_time)::date as day,
      min(block_height) as block_height
      from blocks
      where canonical
      group by 1) as daily_blocks using (block_height)
    where b.canonical
    order by 1 desc
    `) as { day: Date; block_height: number; index_block_hash: Buffer }[];
    return {
      blocks: blocks.map((block) => ({
        day: block.day,
        blockHeight: block.block_height,
        indexBlockHash: block.index_block_hash,
      })),
    };
  }
}
