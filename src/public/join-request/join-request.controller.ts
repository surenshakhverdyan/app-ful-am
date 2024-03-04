import { Body, Controller, Post } from '@nestjs/common';

import { JoinRequestService } from './join-request.service';
import { CreateJoinRequestDto } from 'src/dtos';

@Controller('join-request')
export class JoinRequestController {
  constructor(private joinRequestService: JoinRequestService) {}

  @Post('create')
  createJoinRequest(@Body() dto: CreateJoinRequestDto): Promise<boolean> {
    return this.joinRequestService.createJoinRequest(dto);
  }
}
