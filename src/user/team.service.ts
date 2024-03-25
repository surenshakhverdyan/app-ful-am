import { HttpException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Connection, Model, Types } from 'mongoose';
import { extname } from 'path';
import * as fs from 'fs';

import { CreateTeamDto, UpdatePlayerDto, AddPlayerDto } from 'src/dtos';
import { Player, Team, User } from 'src/schemas';
import { TokenService } from 'src/services';
import { Status } from 'src/enums';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(Player.name) private playerModel: Model<Player>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private connection: Connection,
    @Inject(REQUEST) private request: Request,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async createTeam(
    avatars: Express.Multer.File[],
    dto: CreateTeamDto,
  ): Promise<Team> {
    const token = this.tokenService.extractJwtFromHeaders(this.request);
    const { sub } = this.jwtService.decode(token);
    const user = await this.userModel.findById(sub);
    const savedImages: Array<string> = [];

    const session = await this.connection.startSession();

    try {
      session.startTransaction();

      if (avatars['avatar'] !== undefined) {
        const fileName = `${Date.now() + Math.floor(Math.random() * 99999)}${extname(avatars['avatar'][0].originalname)}`;
        fs.writeFileSync(`uploads/${fileName}`, avatars['avatar'][0].buffer);
        dto.avatar = fileName;
        savedImages.push(fileName);
      }
      dto.user = user._id;

      const [team] = await this.teamModel.create(
        [
          {
            name: dto.name,
            avatar: dto.avatar,
            user: dto.user,
          },
        ],
        { session },
      );

      user.team = team._id;
      await user.save({ session });

      for (let i = 0; i < dto.players.length; i++) {
        if (avatars[`players[${i}][avatar]`] !== undefined) {
          const fileName = `${Date.now() + Math.floor(Math.random() * 99999)}${extname(avatars[`players[${i}][avatar]`][0].originalname)}`;
          fs.writeFileSync(
            `uploads/${fileName}`,
            avatars[`players[${i}][avatar]`][0].buffer,
          );
          dto.players[i].avatar = fileName;
          savedImages.push(fileName);
        }
        dto.players[i].team = team._id;
        const [player] = await this.playerModel.create(
          [{ ...dto.players[i] }],
          { session },
        );
        team.players.push(player._id);
        await team.save({ session });
      }

      if (dto.players.length > 8) {
        team.status = Status.Active;
        await team.save({ session });
      }

      await session.commitTransaction();
      session.endSession();

      return team.populate({
        path: 'players',
        model: 'Player',
        select: '-updatedAt -createdAt -__v -team',
      });
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      for (let i = 0; i < savedImages.length; i++) {
        const element = savedImages[i];
        fs.promises.unlink(`uploads/${element}`);
      }

      throw new HttpException(error.message, 500);
    }
  }

  async updateTeamAvatar(avatar: Express.Multer.File): Promise<Team> {
    const token = this.tokenService.extractJwtFromHeaders(this.request);
    const { sub } = this.jwtService.decode(token);
    const savedImage: Array<string> = [];

    const team = await this.teamModel.findOne({
      user: new Types.ObjectId(sub),
    });

    if (team.avatar !== undefined) fs.promises.unlink(`uploads/${team.avatar}`);

    const fileName = `${Date.now() + Math.floor(Math.random() * 99999)}${extname(avatar.originalname)}`;
    fs.writeFileSync(`uploads/${fileName}`, avatar.buffer);
    savedImage.push(fileName);

    try {
      team.avatar = fileName;
      await team.save();

      return team;
    } catch (error: any) {
      for (let i = 0; i < savedImage.length; i++) {
        const element = savedImage[i];
        fs.promises.unlink(`uploads/${element}`);
      }

      throw new HttpException(error.message, 500);
    }
  }

  async updatePlayer(
    dto: UpdatePlayerDto,
    avatar: Express.Multer.File,
  ): Promise<Player> {
    const savedImage: Array<string> = [];
    const player = await this.playerModel.findById(dto.playerId);

    if (avatar !== undefined) {
      if (player.avatar) fs.promises.unlink(`uploads/${player.avatar}`);

      const fileName = `${Date.now() + Math.floor(Math.random() * 99999)}${extname(avatar.originalname)}`;
      fs.writeFileSync(`uploads/${fileName}`, avatar.buffer);

      dto.avatar = fileName;
      savedImage.push(fileName);
    }

    try {
      const player = this.playerModel.findByIdAndUpdate(
        dto.playerId,
        { $set: dto },
        { new: true },
      );

      return player;
    } catch (error: any) {
      for (let i = 0; i < savedImage.length; i++) {
        const element = savedImage[i];
        fs.promises.unlink(`uploads/${element}`);
      }

      throw new HttpException(error.message, 500);
    }
  }

  async addPlayer(
    dto: AddPlayerDto,
    avatar: Express.Multer.File,
  ): Promise<Player> {
    const token = this.tokenService.extractJwtFromHeaders(this.request);
    const { sub } = this.jwtService.decode(token);
    const savedImage: Array<string> = [];

    const session = await this.connection.startSession();

    try {
      session.startTransaction();

      const team = await this.teamModel.findOne({
        user: new Types.ObjectId(sub),
      });
      if (avatar !== undefined) {
        const fileName = `${Date.now() + Math.floor(Math.random() * 99999)}${extname(avatar.originalname)}`;
        fs.writeFileSync(`uploads/${fileName}`, avatar.buffer);
        dto.avatar = fileName;
        savedImage.push(fileName);
      }
      dto.team = team._id;

      const [player] = await this.playerModel.create({ ...dto }, { session });
      team.players.push(player._id);
      await team.save({ session });

      if (team.players.length > 8) {
        team.status = Status.Active;
        await team.save({ session });
      }

      await session.commitTransaction();
      session.endSession();

      return player;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      for (let i = 0; i < savedImage.length; i++) {
        const element = savedImage[i];
        fs.promises.unlink(`uploads/${element}`);
      }

      throw new HttpException(error.message, 500);
    }
  }
}
