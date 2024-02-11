import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
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

import { TeamService } from './team.service';
import {
  CreateTeamDto,
  UpdatePlayerDto,
  AddPlayerDto,
  DeletePlayerDto,
} from 'src/dtos';
import { AuthGuard } from 'src/guards';
import { Player, Team } from 'src/schemas';
import { DeletePlayerService } from 'src/services';

@UseGuards(AuthGuard)
@Controller('team')
export class TeamController {
  constructor(
    private teamService: TeamService,
    private deletePlayerService: DeletePlayerService,
  ) {}

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
    @Body() dto: CreateTeamDto,
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: false,
      }),
    )
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

    return this.teamService.createTeam(avatars, dto);
  }

  @Patch('update-team-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  updateTeamAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'jpg|jpeg|png' })],
        fileIsRequired: false,
      }),
    )
    avatar: Express.Multer.File,
  ): Promise<Team> {
    return this.teamService.updateTeamAvatar(avatar);
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
  ): Promise<Player> {
    return this.teamService.updatePlayer(dto, avatar);
  }

  @Post('add-player')
  @UseInterceptors(FileInterceptor('avatar'))
  addPlayer(
    @Body() dto: AddPlayerDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'jpg|jpeg|png' })],
        fileIsRequired: false,
      }),
    )
    avatar: Express.Multer.File,
  ): Promise<Player> {
    return this.teamService.addPlayer(dto, avatar);
  }

  @Delete('delete-player')
  deletePlayer(@Body() dto: DeletePlayerDto): Promise<boolean> {
    return this.deletePlayerService.DeletePlayer(dto);
  }
}
