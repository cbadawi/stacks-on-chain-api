import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import commaSeperatedToArray from '../common/utils/commaSeperatedToArray';
import { DefiService } from './defi.service';

@Controller({ path: 'defi', version: '1' })
@ApiTags('Defi')
export class DefiController {
  constructor(private defiService: DefiService) {}

  @Get('/history/:addresses')
  async getHistoryHandler(@Param('addresses') addresses: string) {
    const addressesArray = commaSeperatedToArray(addresses);
    const history = await this.defiService.getHistory(addressesArray);
    return { history };
  }
}
