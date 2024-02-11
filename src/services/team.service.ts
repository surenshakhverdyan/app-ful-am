import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Team } from 'src/schemas';

@Injectable()
export class TeamService {
  constructor(@InjectModel(Team.name) private teamModel: Model<Team>) {}

  async getTeams(): Promise<Team[]> {
    const teams = await this.teamModel.find().populate({
      path: 'players',
      model: 'Player',
      select: '-updatedAt -createdAt -__v -team',
    });
    return teams;
  }
}
