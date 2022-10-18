import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import {
  BadRequestExceptionFilter,
  NotFoundExceptionFilter,
} from '../common/exceptions';
import {
  NftsQueryParams,
  NftsWrapper,
  NftWrapper,
} from '../common/interfaces/nft.interfaces';
import { NftService } from './nft.service';
import { NftsValidationPipe } from './pipes/NftsValidation.pipe';

@UseFilters(NotFoundExceptionFilter, BadRequestExceptionFilter)
@Controller({ path: 'nfts', version: '1' })
export class NftController {
  constructor(private nftService: NftService) {}

  @Get(':id')
  async getNftHandler(
    @Param('id') id: string,
    @Query() query: { include: string },
  ): Promise<NftWrapper> {
    const nft = await this.nftService.getNft(id);
    return { nft };
  }

  @Get()
  async getNftsHandler(@Query() query: NftsQueryParams): Promise<NftsWrapper> {
    const { id, contractId, owner } = query;
    const nfts = await this.nftService.getNfts({
      id,
      contractId,
      owner,
    });
    if (nfts.length) return { nfts };
    return { nfts: [] };
  }

  @Get(':collectionContractId/floor')
  async getFloorHandler(
    @Param('collectionContractId') collectionContractId: string,
  ) {
    const floor = await this.nftService.getFloor(
      collectionContractId.split('::')[0],
    );

    if (floor.length) return floor;
    throw new NotFoundException();
  }
}
