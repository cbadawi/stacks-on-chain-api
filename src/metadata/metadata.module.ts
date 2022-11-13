import { Module } from '@nestjs/common';
import { NftModule } from '../nft/nft.module';
import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';

@Module({
  controllers: [MetadataController],
  providers: [MetadataService],
  imports: [NftModule],
})
export class MetadataModule {}
