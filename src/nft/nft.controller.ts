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
  async getNft(
    @Param('id') id: string,
    @Query() query: { include: string },
  ): Promise<NftWrapper> {
    const include = query?.include;
    const nft = await this.nftService.nft(id);
    return { nft };
  }

  @Get()
  async getNfts(@Query() query: NftsQueryParams): Promise<NftsWrapper> {
    const { id, contractId, owner } = query;
    const nfts = await this.nftService.nfts({
      id,
      contractId,
      owner,
    });
    if (nfts.length) return { nfts };
    return { nfts: [] };
  }
}
