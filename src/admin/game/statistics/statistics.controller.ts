import { Body, Controller, Put, UseGuards } from '@nestjs/common';

import { AdminGuard } from 'src/guards';
import { StatisticsService } from './statistics.service';
import { Game } from 'src/schemas';
import { UpdateGameStatisticsDto } from 'src/dtos';

@UseGuards(AdminGuard)
@Controller('admin')
export class StatisticsController {
  constructor(private ststisticsService: StatisticsService) {}

  @Put('update-game-statistics')
  updateGameStatistics(@Body() dto: UpdateGameStatisticsDto): Promise<Game> {
    return this.ststisticsService.updateGameStatistics(dto);
  }
}
