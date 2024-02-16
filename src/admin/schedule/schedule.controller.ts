import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';

import { AdminGuard } from 'src/guards';
import { ScheduleService } from './schedule.service';
import { Game, Schedule } from 'src/schemas';
import { SetGameDto } from 'src/dtos';

@UseGuards(AdminGuard)
@Controller('admin')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get('get-game-schedule-list/:id')
  getScheduleList(): Promise<Schedule[]> {
    return this.scheduleService.getGameScheduleList();
  }

  @Put('set-game')
  setGame(@Body() dto: SetGameDto): Promise<Game> {
    return this.scheduleService.setGame(dto);
  }
}
