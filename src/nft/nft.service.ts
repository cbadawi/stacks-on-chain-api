import { Injectable, UseFilters } from '@nestjs/common';
import { FloorPrice, Nft, NftsQueryParams } from './interfaces/nft.interfaces';
import buildNftFilter from '../common/utils/builders/buildNftFilter';
import { nftMapperWithEvents } from '../common/utils/nftMapper';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NftService {
  constructor(private prisma: PrismaService) {}

  async getNft(id: string): Promise<Nft> {
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

  async getNfts({ id, contractId, owner }: NftsQueryParams): Promise<Nft[]> {
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

  async getFloor(id: string): Promise<FloorPrice[]> {
    const floor = await this.prisma.nftFloor.findMany({
      select: { date: true, floor: true },
      where: { collection_contract_id: id },
    });

    const json = floor.map((f) => {
      return { floor: f.floor.toString(), date: f.date };
    });
    return json;
  }
}
