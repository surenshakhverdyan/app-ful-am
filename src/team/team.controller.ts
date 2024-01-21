import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Headers,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from 'src/guards';
import { TeamService } from './team.service';
import {
  AddPlayerDto,
  CreateTeamDto,
  UpdatePlayerDto,
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
    @Body() dto: UpdatePlayerDto,
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

  @Delete('delete-player')
  deletePlayer(@Body() dto: UpdatePlayerDto): Promise<boolean> {
    return this.teamService.deletePlayer(dto);
  }

  @Put('add-player')
  @UseInterceptors(FileInterceptor('avatar'))
  addPlayer(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'jpg|jpeg|png' })],
        fileIsRequired: false,
      }),
    )
    avatar: Express.Multer.File,
    @Body() dto: AddPlayerDto,
  ): Promise<boolean> {
    return this.teamService.addPlayer(avatar, dto);
  }
}
