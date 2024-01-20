import {
  Body,
  Controller,
  FileTypeValidator,
  Headers,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from 'src/guards';
import { TeamService } from './team.service';
import {
  CreateTeamDto,
  UpdatePlayerAvatarDto,
  UpdateTeamAvatarDto,
} from 'src/dtos';

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

  @Patch('update-team-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  updateTeamAvatar(
    @Body() dto: UpdateTeamAvatarDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'jpg|jpeg|png' })],
        fileIsRequired: true,
      }),
    )
    avatar: Express.Multer.File,
  ): Promise<boolean> {
    return this.teamService.updateTeamAvatar(dto, avatar);
  }

  @Patch('update-player-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  updatePlayerAvatar(
    @Body() dto: UpdatePlayerAvatarDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'jpg|jpeg|png' })],
        fileIsRequired: true,
      }),
    )
    avatar: Express.Multer.File,
  ): Promise<boolean> {
    return this.teamService.updatePlayerAvatar(dto, avatar);
  }
}
