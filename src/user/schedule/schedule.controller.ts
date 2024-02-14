import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from 'src/dtos';
import { UserScheduleGuard } from 'src/guards';

@UseGuards(UserScheduleGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get('get-scheduler/:token')
  getScheduler() {
    return this.scheduleService.getScheduler();
  }

  @Post('create-schedule/:token')
  createSchedule(@Body() dto: CreateScheduleDto): Promise<boolean> {
    return this.scheduleService.createSchedule(dto);
  }
}
