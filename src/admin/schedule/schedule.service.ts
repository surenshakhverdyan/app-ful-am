import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model, Types } from 'mongoose';

import { SetGameDto } from 'src/dtos';
import { GameStatus, Status } from 'src/enums';
import { Game, Player, Schedule, Team } from 'src/schemas';
import { gameDateTimeTemplate } from 'src/templates';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(Player.name) private playerModel: Model<Player>,
    @Inject(REQUEST) private request: Request,
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async getGameScheduleList(): Promise<Schedule[]> {
    const id = new Types.ObjectId(this.request.params.id);
    try {
      const scheduleList = await this.scheduleModel
        .find({
          game: id,
        })
        .populate({
          path: 'team',
          model: 'Team',
          select: 'avatar name _id',
        })
        .select('-createdAt -updatedAt -__v');

      return scheduleList;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }

  async setGame(dto: SetGameDto): Promise<Game> {
    try {
      const team1 = await this.scheduleModel.findById(dto.team1).populate({
        path: 'team',
        model: 'Team',
        select: 'name',
        populate: {
          path: 'user',
          model: 'User',
          select: 'email',
        },
      });
      const team1players = await this.teamModel
        .findById(team1.team)
        .populate({
          path: 'players',
          model: 'Player',
          match: { status: Status.Inactive },
          select: '_id',
        })
        .select('_id');
      team1players.players.map(async (player) => {
        await this.playerModel.findByIdAndUpdate(
          player._id,
          { $set: { status: Status.Active } },
          { new: true },
        );
      });
      const team2 = await this.scheduleModel.findById(dto.team2).populate({
        path: 'team',
        model: 'Team',
        select: 'name',
        populate: {
          path: 'user',
          model: 'User',
          select: 'email',
        },
      });
      const team2players = await this.teamModel
        .findById(team2.team)
        .populate({
          path: 'players',
          model: 'Player',
          match: { status: Status.Inactive },
          select: '_id',
        })
        .select('_id');
      team2players.players.map(async (player) => {
        await this.playerModel.findByIdAndUpdate(
          player._id,
          { $set: { status: Status.Active } },
          { new: true },
        );
      });

      const game = await this.gameModel.findByIdAndUpdate(
        new Types.ObjectId(team1.game),
        {
          $set: {
            team1: team1,
            team2: team2,
            dateTime: new Date(dto.dateTime),
            status: GameStatus.Active,
          },
        },
        { new: true },
      );

      const data = {
        dateTime: game.dateTime,
        team1: team1.team.name,
        team2: team2.team.name,
      };

      const emails = [team1.team.user.email, team2.team.user.email];
      for (let i = 0; i < emails.length; i++) {
        const element = emails[i];
        const template = gameDateTimeTemplate(data);

        await this.mailerService.sendMail({
          from: this.configService.get<string>('EMAIL_ADDRESS'),
          to: element,
          subject: 'Game Date',
          html: template,
        });
      }

      return game;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
