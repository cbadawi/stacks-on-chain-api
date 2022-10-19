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
  FloorWrapper,
} from './interfaces/nft.interfaces';
import { NftService } from './nft.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { NftsValidationPipe } from './pipes/NftsValidation.pipe';

@UseFilters(NotFoundExceptionFilter, BadRequestExceptionFilter)
@Controller({ path: 'nfts', version: '1' })
@ApiTags('Nfts')
export class NftController {
  constructor(private nftService: NftService) {}

  @Get(':id')
  @UsePipes(NftsValidationPipe)
  async getNftHandler(@Param('id') id: string): Promise<NftWrapper> {
    const nft = await this.nftService.getNft(id);
    return { nft };
  }

  @Get()
  @UsePipes(NftsValidationPipe)
  async getNftsHandler(
    @Query() searchParams: NftsQueryParams,
  ): Promise<NftsWrapper> {
    const { id, contractId, owner } = searchParams;
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
  ): Promise<FloorWrapper> {
    const floor = await this.nftService.getFloor(
      collectionContractId.split('::')[0],
    );

    if (floor.length) return { floor };
    throw new NotFoundException();
  }
}
