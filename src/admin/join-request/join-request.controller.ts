import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AdminGuard } from 'src/guards';
import { JoinRequestService } from './join-request.service';
import { JoinRequest } from 'src/schemas';
import { JoinRequestDto } from 'src/dtos';

@UseGuards(AdminGuard)
@Controller('admin')
export class JoinRequestController {
  constructor(private joinRequestService: JoinRequestService) {}

  @Get('join-requests')
  getJoinRequests(): Promise<JoinRequest[]> {
    return this.joinRequestService.getJoinRequests();
  }

  @Post('join-request')
  joinRequest(@Body() dto: JoinRequestDto): Promise<boolean> {
    return this.joinRequestService.joinRequest(dto);
  }
}
