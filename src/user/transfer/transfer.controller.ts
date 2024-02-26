import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/guards';
import { TransferService } from './transfer.service';
import { TransferDto } from 'src/dtos';
import { Transfer } from 'src/schemas';

@UseGuards(AuthGuard)
@Controller('transfer')
export class TransferController {
  constructor(private transferService: TransferService) {}

  @Post('create-transfer')
  createTransfer(@Body() dto: TransferDto): Promise<Transfer> {
    return this.transferService.createTransfer(dto);
  }
}
