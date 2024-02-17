import { Body, Controller, Patch, Put, UseGuards } from '@nestjs/common';

import { AdminGuard } from 'src/guards';
import { StatisticsService } from './statistics.service';
import { Game } from 'src/schemas';
import { ChangeGameStatusDto, UpdateGameStatisticsDto } from 'src/dtos';

@UseGuards(AdminGuard)
@Controller('admin')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Put('update-game-statistics')
  updateGameStatistics(@Body() dto: UpdateGameStatisticsDto): Promise<Game> {
    return this.statisticsService.updateGameStatistics(dto);
  }

  @Patch('change-game-status')
  changeGameStatus(@Body() dto: ChangeGameStatusDto): Promise<Game> {
    return this.statisticsService.changeGameStatus(dto);
  }
}
