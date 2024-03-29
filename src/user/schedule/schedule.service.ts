import { HttpException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model, Types } from 'mongoose';

import { CreateScheduleDto } from 'src/dtos';
import { Status } from 'src/enums';
import { Schedule, Team } from 'src/schemas';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @Inject(REQUEST) private request: Request,
    private jwtService: JwtService,
  ) {}

  async getScheduler(): Promise<Team> {
    const token = this.request.params.token;
    const payload = this.jwtService.decode(token);
    const [teamId, gameId] = payload.sub.split(' ');

    const schedule = await this.scheduleModel.findOne({
      team: teamId,
      game: gameId,
    });

    if (schedule)
      throw new HttpException('You have already scheduled the game', 403);

    const team = await this.teamModel.findById(teamId).populate({
      path: 'players',
      model: 'Player',
      match: { status: Status.Active },
      select: '_id name number',
    });

    return team;
  }

  async createSchedule(dto: CreateScheduleDto): Promise<boolean> {
    const token = this.request.params.token;
    const payload = this.jwtService.decode(token);
    const [teamId, gameId] = payload.sub.split(' ');

    const schedule = await this.scheduleModel.findOne({
      team: teamId,
      game: gameId,
    });

    if (schedule)
      throw new HttpException('You have already scheduled the game', 403);

    dto.game = new Types.ObjectId(gameId);
    dto.team = new Types.ObjectId(teamId);
    const players: Array<Types.ObjectId> = [];

    dto.players.map((id) => {
      const element = new Types.ObjectId(id);
      players.push(element);
    });

    try {
      await this.scheduleModel.create({
        game: dto.game,
        team: dto.team,
        date: dto.date,
        players,
      });

      return true;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
