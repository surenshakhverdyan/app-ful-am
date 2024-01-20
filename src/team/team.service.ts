import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { extname } from 'path';
import * as fs from 'fs';

import { CreateTeamDto } from 'src/dtos';
import { Team, User } from 'src/schemas';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Team.name) private teamModel: Model<Team>,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async createTeam(
    token: string,
    avatar: Express.Multer.File,
    dto: CreateTeamDto,
  ): Promise<boolean> {
    const { sub } = await this.jwtService.verifyAsync(token.split(' ')[1], {
      secret: this.configService.get<string>('JWT_AUTH_SECRET'),
    });

    try {
      const user = await this.userModel.findById(sub);
      if (avatar !== undefined) {
        const fileName = `${Date.now()}${extname(avatar.originalname)}`;
        fs.writeFileSync(`uploads/${fileName}`, avatar.buffer);
        dto.avatar = fileName;
      }
      dto.user = user._id;

      const team = await this.teamModel.create(dto);
      if (dto.players.length > 8) {
        team.status = true;
        team.save();
      }

      await user.updateOne({ $set: { team: team._id } });
    } catch (error: any) {
      if (dto.avatar) await fs.promises.unlink(`uploads/${dto.avatar}`);
      if (error.code === 11000)
        throw new HttpException('You already have created a team', 403);
      throw new HttpException(error.message, error.code);
    }

    return true;
  }

  async updateTeamAvatar(
    token: string,
    avatar: Express.Multer.File,
  ): Promise<boolean> {
    const { sub } = await this.jwtService.verifyAsync(token.split(' ')[1], {
      secret: this.configService.get<string>('JWT_AUTH_SECRET'),
    });

    const userId = new Types.ObjectId(sub);
    const team = await this.teamModel.findOne({ user: userId });
    if (team.avatar) {
      fs.promises.unlink(`uploads/${team.avatar}`);
    }

    const fileName = `${Date.now()}${extname(avatar.originalname)}`;
    fs.writeFileSync(`uploads/${fileName}`, avatar.buffer);

    team.avatar = fileName;
    team.save();

    return true;
  }
}
