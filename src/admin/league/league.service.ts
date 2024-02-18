import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateLeagueDto } from 'src/dtos';
import { League } from 'src/schemas';

@Injectable()
export class LeagueService {
  constructor(@InjectModel(League.name) private leagueModel: Model<League>) {}

  async createLeague(dto: CreateLeagueDto): Promise<League> {
    try {
      const league = await this.leagueModel.create(dto);

      return league;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
