import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import commaSeperatedToArray from 'src/common/utils/commaSeperatedToArray';
import { DefiService } from './defi.service';

@Controller({ path: 'defi', version: '1' })
@ApiTags('Defi')
export class DefiController {
  constructor(private defiService: DefiService) {}

  @Get('/history')
  async getHistoryHandler(addresses: string) {
    const addressesArray = commaSeperatedToArray(addresses);
    const history = await this.defiService.getHistory(addressesArray);
    return { history };
  }
}
