import { Module } from '@nestjs/common';
import { BlocksService } from 'src/blocks/blocks.service';
import { NftController } from './nft.controller';
import { NftService } from './nft.service';

@Module({
  controllers: [NftController],
  providers: [NftService, BlocksService],
  exports: [NftService],
})
export class NftModule {}
