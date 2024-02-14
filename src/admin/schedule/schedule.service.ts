import { HttpException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model, Types } from 'mongoose';

import { UpdateGameTeamsDto } from 'src/dtos';
import { Game, Schedule } from 'src/schemas';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @Inject(REQUEST) private request: Request,
  ) {}

  async getGameScheduleList(): Promise<Schedule[]> {
    const id = this.request.params.id;
    try {
      const scheduleList = await this.scheduleModel
        .find({
          game: new Types.ObjectId(id),
        })
        .populate({
          path: 'team',
          model: 'Team',
          select: 'avatar name _id',
          populate: {
            path: 'user',
            model: 'User',
            select: 'email -_id',
          },
        })
        .select('-createdAt -updatedAt -__v');

      return scheduleList;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }

  async acceptGameSchedule(dto: UpdateGameTeamsDto): Promise<Game> {
    try {
      const team1 = await this.scheduleModel.findById(dto.team1);
      console.log(team1);
      const team2 = await this.scheduleModel.findById(dto.team2);
      const game = await this.gameModel.findByIdAndUpdate(
        team1.game,
        {
          $set: { team1: team1, team2: team2 },
        },
        { new: true },
      );

      return game;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
