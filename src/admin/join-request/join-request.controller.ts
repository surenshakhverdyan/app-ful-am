import { Controller, Get, UseGuards } from '@nestjs/common';

import { AdminGuard } from 'src/guards';
import { JoinRequestService } from './join-request.service';
import { JoinRequest } from 'src/schemas';

@UseGuards(AdminGuard)
@Controller('admin')
export class JoinRequestController {
  constructor(private joinRequestService: JoinRequestService) {}

  @Get('join-requests')
  getJoinRequests(): Promise<JoinRequest[]> {
    return this.joinRequestService.getJoinRequests();
  }
}
