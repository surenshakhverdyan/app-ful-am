import { Body, Controller, Get, Post } from '@nestjs/common';

import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from 'src/dtos';

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
