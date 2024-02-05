import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Headers,
  HttpException,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

import { AuthGuard } from 'src/guards';
import { TeamService } from './team.service';
import {
  AddPlayerDto,
  CreateTeamDto,
  UpdatePlayerDto,
  UpdateTeamAvatarDto,
} from 'src/dtos';
import { Team } from 'src/schemas';

@UseGuards(AuthGuard)
@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Post('create-team')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar' },
      ...Array.from({ length: 21 }, (_, index) => ({
        name: `players[${index}][avatar]`,
        maxCount: 1,
      })),
    ]),
  )
  createTeam(
    @Headers('authorization') token: string,
    @Body() dto: CreateTeamDto,
    @UploadedFiles(new ParseFilePipe({ fileIsRequired: false }))
    avatars: Express.Multer.File[],
  ): Promise<Team> {
    const flatAvatarArray = Object.values(
      avatars,
    ).flat() as Express.Multer.File[];
    const fileTypeValidator = new FileTypeValidator({
      fileType: 'jpg|jpeg|png',
    });
    flatAvatarArray.map((avatar) => {
      const isValid = fileTypeValidator.isValid(avatar);
      if (!isValid) {
        throw new HttpException('Invalid file type', 403);
      }
    });

    return this.teamService.createTeam(token, avatars, dto);
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

  @Patch('update-player')
  @UseInterceptors(FileInterceptor('avatar'))
  updatePlayer(
    @Body() dto: UpdatePlayerDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'jpg|jpeg|png' })],
        fileIsRequired: false,
      }),
    )
    avatar: Express.Multer.File,
  ): Promise<Team> {
    return this.teamService.updatePlayer(dto, avatar);
  }

  @Delete('delete-player')
  deletePlayer(@Body() dto: UpdatePlayerDto): Promise<boolean> {
    return this.teamService.deletePlayer(dto);
  }

  @Patch('add-player')
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
  ): Promise<Team> {
    return this.teamService.addPlayer(avatar, dto);
  }
}
