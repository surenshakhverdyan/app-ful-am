import {
  Body,
  Controller,
  FileTypeValidator,
  Headers,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from 'src/guards';
import { TeamService } from './team.service';
import { CreateTeamDto } from 'src/dtos';

@UseGuards(AuthGuard)
@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Post('create-team')
  @UseInterceptors(FileInterceptor('avatar'))
  createTeam(
    @Headers('authorization') token: string,
    @Body() dto: CreateTeamDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'jpg|jpeg|png' })],
        fileIsRequired: false,
      }),
    )
    avatar: Express.Multer.File,
  ): Promise<boolean> {
    return this.teamService.createTeam(token, avatar, dto);
  }
}
