import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AdminGuard } from 'src/guards';
import { ScheduleService } from './schedule.service';
import { Game, Schedule } from 'src/schemas';
import { UpdateGameTeamsDto } from 'src/dtos';

@UseGuards(AdminGuard)
@Controller('admin')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get('get-game-schedule-list/:id')
  getScheduleList(): Promise<Schedule[]> {
    return this.scheduleService.getGameScheduleList();
  }

  @Post('set-game')
  setGame(@Body() dto: UpdateGameTeamsDto): Promise<Game> {
    return this.scheduleService.setGame(dto);
  }
}
