import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';

import { TransferService } from './transfer.service';
import { AdminGuard } from 'src/guards';
import { AcceptTransferDto, SetTransferDto } from 'src/dtos';

@UseGuards(AdminGuard)
@Controller('admin')
export class TransferController {
  constructor(private transferService: TransferService) {}

  @Post('set-transfers-date')
  setTransfer(@Body() dto: SetTransferDto): Promise<boolean> {
    return this.transferService.setTransfer(dto);
  }

  @Put('transfer')
  transfer(@Body() dto: AcceptTransferDto): Promise<boolean> {
    return this.transferService.transfer(dto);
  }
}
