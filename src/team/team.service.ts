import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { extname } from 'path';
import * as fs from 'fs';

import {
  AddPlayerDto,
  CreateTeamDto,
  UpdatePlayerDto,
  UpdateTeamAvatarDto,
} from 'src/dtos';
import { DeletedPlayer, Team, User } from 'src/schemas';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(DeletedPlayer.name)
    private deletedPlayerModel: Model<DeletedPlayer>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async createTeam(
    token: string,
    avatars: Express.Multer.File[],
    dto: CreateTeamDto,
  ): Promise<Team> {
    const { sub } = await this.jwtService.verifyAsync(token.split(' ')[1], {
      secret: this.configService.get<string>('JWT_AUTH_SECRET'),
    });

    try {
      const user = await this.userModel.findById(sub);
      if (avatars['avatar'][0] !== undefined) {
        const fileName = `${Date.now() + Math.floor(Math.random() * 9999)}${extname(avatars['avatar'][0].originalname)}`;
        fs.writeFileSync(`uploads/${fileName}`, avatars['avatar'][0].buffer);
        dto.avatar = fileName;
      }
      dto.user = user._id;

      for (let i = 0; i < dto.players.length; i++) {
        if (avatars[`players[${i}][avatar]`] !== undefined) {
          const filename = `${Date.now() + Math.floor(Math.random() * 9999)}${extname(avatars[`players[${i}][avatar]`][0].originalname)}`;
          fs.writeFileSync(
            `uploads/${filename}`,
            avatars[`players[${i}][avatar]`][0].buffer,
          );
          dto.players[i].avatar = filename;
        }
      }

      const team = await this.teamModel.create(dto);
      if (dto.players.length > 8) {
        team.status = true;
        team.save();
      }

      await user.updateOne({ $set: { team: team._id } });
      return team;
    } catch (error: any) {
      if (dto.avatar) await fs.promises.unlink(`uploads/${dto.avatar}`);
      for (let i = 0; i < dto.players.length; i++) {
        if (dto.players[i].avatar) {
          await fs.promises.unlink(`uploads/${dto.players[i].avatar}`);
        }
      }
      if (error.code === 11000)
        throw new HttpException('You already have created a team', 403);
      throw new HttpException(error.message, error.code);
    }
  }

  async updateTeamAvatar(
    dto: UpdateTeamAvatarDto,
    avatar: Express.Multer.File,
  ): Promise<boolean> {
    const team = await this.teamModel.findById(dto.teamId);
    if (team.avatar) {
      fs.promises.unlink(`uploads/${team.avatar}`);
    }

    const fileName = `${Date.now()}${extname(avatar.originalname)}`;
    fs.writeFileSync(`uploads/${fileName}`, avatar.buffer);

    team.avatar = fileName;
    team.save();

    return true;
  }

  async updatePlayer(
    dto: UpdatePlayerDto,
    avatar: Express.Multer.File,
  ): Promise<boolean> {
    const { players } = await this.teamModel.findOne(
      { _id: dto.teamId, 'players._id': dto.playerId },
      { 'players.$': 1 },
    );

    if (players) {
      if (avatar !== undefined) {
        if (players[0].avatar)
          fs.promises.unlink(`uploads/${players[0].avatar}`);
        const fileName = `${Date.now()}${extname(avatar.originalname)}`;
        fs.writeFileSync(`uploads/${fileName}`, avatar.buffer);

        try {
          await this.teamModel.findByIdAndUpdate(
            dto.teamId,
            {
              $set: { 'players.$[elem].avatar': fileName },
            },
            {
              arrayFilters: [{ 'elem._id': dto.playerId }],
              new: true,
            },
          );
        } catch (error: any) {
          if (avatar !== undefined) fs.promises.unlink(`uploads/${fileName}`);
          throw new HttpException(error.message, error.code);
        }
      }
    }

    if (dto.name) {
      await this.teamModel.findByIdAndUpdate(
        dto.teamId,
        {
          $set: { 'players.$[elem].name': dto.name },
        },
        {
          arrayFilters: [{ 'elem._id': dto.playerId }],
        },
      );
    }

    if (dto.number) {
      await this.teamModel.findByIdAndUpdate(
        dto.teamId,
        {
          $set: { 'players.$[elem].number': dto.number },
        },
        {
          arrayFilters: [{ 'elem._id': dto.playerId }],
        },
      );
    }

    if (dto.position) {
      await this.teamModel.findByIdAndUpdate(
        dto.teamId,
        {
          $set: { 'players.$[elem].position': dto.position },
        },
        {
          arrayFilters: [{ 'elem._id': dto.playerId }],
        },
      );
    }
    return true;
  }

  async addPlayer(
    avatar: Express.Multer.File,
    dto: AddPlayerDto,
  ): Promise<Team> {
    const team = await this.teamModel.findById(dto.teamId);

    try {
      if (avatar !== undefined) {
        const fileName = `${Date.now()}${extname(avatar.originalname)}`;
        fs.writeFileSync(`uploads/${fileName}`, avatar.buffer);
        dto.avatar = fileName;
      }

      team.players.push(dto);

      if (team.players.length > 8) team.status = true;

      await team.save();
    } catch (error: any) {
      if (dto.avatar) fs.promises.unlink(`uploads/${dto.avatar}`);
      throw new HttpException(error.message, error.code);
    }

    return team;
  }

  async deletePlayer(dto: UpdatePlayerDto): Promise<boolean> {
    const { players } = await this.teamModel.findOne(
      {
        _id: dto.teamId,
        'players._id': dto.playerId,
      },
      { 'players.$': 1 },
    );

    await this.deletedPlayerModel.create({
      name: players[0].name,
      number: players[0].number,
      position: players[0].position,
      avatar: players[0].avatar,
      goals: players[0].goals,
      cards: players[0].cards,
      assist: players[0].assist,
      teamId: new Types.ObjectId(dto.teamId),
      _id: players[0]._id,
    });

    const team = await this.teamModel.findByIdAndUpdate(
      dto.teamId,
      {
        $pull: { players: { _id: dto.playerId } },
      },
      { new: true },
    );

    if (team.players.length < 9) {
      team.status = false;
      await team.save();
    }

    return true;
  }
}
