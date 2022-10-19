import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlocksService } from './blocks.service';
import { blocksTip } from './interfaces/blocks.interfaces';

@Controller({ path: 'blocks', version: '1' })
@ApiTags('Blocks')
export class BlocksController {
  constructor(private blocksService: BlocksService) {}

  @Get('/tip')
  async getBlocks(): Promise<blocksTip> {
    return { tip: await this.blocksService.getTipHeight() };
  }
}
