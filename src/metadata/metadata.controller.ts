import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MetadataRefresh } from './dto/metadataRefresh.interfaces';
import { MetadataService } from './metadata.service';

@Controller({ path: 'metadatarefresh', version: '1' })
@ApiTags('metadatarefresh')
export class MetadataController {
  constructor(private metadataService: MetadataService) {}

  @Post()
  async refreshMetadataHandler(@Body() payload: MetadataRefresh) {
    return await this.metadataService.refreshMetadata(
      payload?.completeTokenIds || [],
    );
  }
}
