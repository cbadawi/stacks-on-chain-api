import { Controller, Get } from '@nestjs/common';
import { BlocksService } from './blocks.service';

@Controller({ path: 'blocks', version: '1' })
export class BlocksController {
  constructor(private blocksService: BlocksService) {}

  @Get('/tip')
  async getBlocks() {
    return { tipHeight: await this.blocksService.getTipHeight() };
  }
}
