import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/guards';
import { TeamService } from './team.service';
import { CreateTeamDto } from 'src/dtos';

@UseGuards(AuthGuard)
@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Post('create-team')
  createTeam(
    @Headers('authorization') token: string,
    @Body() dto: CreateTeamDto,
  ): Promise<boolean> {
    return this.teamService.createTeam(token, dto);
  }
}
