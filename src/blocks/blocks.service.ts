import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlocksService {
  constructor(private prisma: PrismaService) {}

  async getTipHeight() {
    return (
      await this.prisma.blocks.findFirst({
        where: { canonical: true },
        orderBy: { block_height: 'desc' },
      })
    )?.block_height;
  }
}
