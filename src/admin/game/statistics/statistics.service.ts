import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UpdateGameStatisticsDto } from 'src/dtos';
import { Game, Player } from 'src/schemas';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(Player.name) private playerModel: Model<Player>,
  ) {}

  async updateGameStatistics(dto: UpdateGameStatisticsDto): Promise<Game> {
    try {
      const data = {
        cards: dto.cards,
        goals: dto.goals,
      };

      const game = await this.gameModel
        .findByIdAndUpdate(
          dto.game,
          {
            $set: {
              $cond: {
                if: { $eq: ['$team1.team', dto.team] },
                then: { team1: data },
                else: { team2: data },
              },
            },
          },
          { new: true },
        )
        .exec();

      return game;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
