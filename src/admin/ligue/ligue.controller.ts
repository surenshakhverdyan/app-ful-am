import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { LigueService } from './ligue.service';
import { AdminGuard } from 'src/guards';
import { CreateLigueDto } from 'src/dtos';
import { Ligue } from 'src/schemas';

@UseGuards(AdminGuard)
@Controller('admin')
export class LigueController {
  constructor(private ligueService: LigueService) {}

  @Post('create-ligue')
  createLigue(@Body() dto: CreateLigueDto): Promise<Ligue> {
    return this.ligueService.createLigue(dto);
  }
}
