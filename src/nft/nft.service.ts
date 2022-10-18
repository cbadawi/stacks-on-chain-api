import { Injectable } from '@nestjs/common';
import { BlocksService } from '../blocks/blocks.service';
import { Nft, NftsQueryParams } from '../common/interfaces/nft.interfaces';
import buildNftFilter from '../common/utils/buildNftFilter';
import { nftMapperWithEvents } from '../common/utils/nftMapper';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NftService {
  constructor(private prisma: PrismaService) {}

  async nft(id: string): Promise<Nft> {
    const filter = buildNftFilter(id);
    return nftMapperWithEvents(
      await this.prisma.nftCustody.findFirstOrThrow({
        where: filter,
        include: {
          nftEvents: true,
        },
      }),
    );
  }

  async nfts({ id, contractId, owner }: NftsQueryParams): Promise<Nft[]> {
    const filter = buildNftFilter(id, contractId, owner);
    return (
      await this.prisma.nftCustody.findMany({
        where: filter,
        include: {
          nftEvents: true,
        },
      })
    ).map((item) => nftMapperWithEvents(item));
  }
}
