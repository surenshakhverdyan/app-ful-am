import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ChangeGameStatusDto, UpdateGameStatisticsDto } from 'src/dtos';
import { GameStatus } from 'src/enums';
import { Game, Ligue, Player } from 'src/schemas';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(Player.name) private playerModel: Model<Player>,
    @InjectModel(Ligue.name) private ligueModel: Model<Ligue>,
  ) {}

  async updateGameStatistics(dto: UpdateGameStatisticsDto): Promise<Game> {
    try {
      const game = await this.gameModel.findById(dto.game);

      if (game.status !== GameStatus.Active)
        throw new HttpException('The game will be active', 403);

      if (game.team1.team.equals(dto.team)) {
        if (dto.cards && dto.cards.length > 0) {
          for (let i = 0; i < dto.cards.length; i++) {
            const element = dto.cards[i];
            game.team1.cards.push(element);
            if (element.red !== undefined)
              await this.playerModel.findByIdAndUpdate(
                element.player,
                { $inc: { redCards: 1 } },
                { new: true },
              );
            else
              await this.playerModel.findByIdAndUpdate(
                element.player,
                { $inc: { yellowCards: 1 } },
                { new: true },
              );
          }
        }

        if (dto.goals && dto.goals.length > 0) {
          for (let i = 0; i < dto.goals.length; i++) {
            const element = dto.goals[i];
            game.team1.goals.push(element);
            if (element.assist !== undefined)
              await this.playerModel.findByIdAndUpdate(
                element.assist,
                { $inc: { assists: 1 } },
                { new: true },
              );

            await this.playerModel.findByIdAndUpdate(
              element.goal,
              { $inc: { goals: 1 } },
              { new: true },
            );
          }
        }
      } else {
        if (dto.cards && dto.cards.length > 0) {
          for (let i = 0; i < dto.cards.length; i++) {
            const element = dto.cards[i];
            game.team2.cards.push(element);
            if (element.red !== undefined)
              await this.playerModel.findByIdAndUpdate(
                element.player,
                { $inc: { redCards: 1 } },
                { new: true },
              );
            else
              await this.playerModel.findByIdAndUpdate(
                element.player,
                { $inc: { yellowCards: 1 } },
                { new: true },
              );
          }
        }

        if (dto.goals && dto.goals.length > 0) {
          for (let i = 0; i < dto.goals.length; i++) {
            const element = dto.goals[i];
            game.team2.goals.push(element);
            if (element.assist !== undefined)
              await this.playerModel.findByIdAndUpdate(
                element.assist,
                { $inc: { assists: 1 } },
                { new: true },
              );

            await this.playerModel.findByIdAndUpdate(
              element.goal,
              { $inc: { goals: 1 } },
              { new: true },
            );
          }
        }
      }

      await game.save();

      return game;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }

  async changeGameStatus(dto: ChangeGameStatusDto): Promise<Game> {
    try {
      const game = await this.gameModel.findById(dto.gameId);

      if (game.team1.goals.length > game.team2.goals.length) {
        game.winner = game.team1.team;
        await this.ligueModel.updateOne(
          { _id: game.ligue, 'teams.team': game.team1.team },
          { $inc: { 'teams.$.points': 3 } },
        );
      } else if (game.team2.goals.length > game.team1.goals.length) {
        game.winner = game.team2.team;
        await this.ligueModel.updateOne(
          { _id: game.ligue, 'teams.team': game.team2.team },
          { $inc: { 'teams.$.points': 3 } },
        );
      } else {
        await this.ligueModel.updateOne(
          { _id: game.ligue, 'teams.team': game.team1.team },
          { $inc: { 'teams.$.points': 1 } },
        );
        await this.ligueModel.updateOne(
          { _id: game.ligue, 'teams.team': game.team2.team },
          { $inc: { 'teams.$.points': 1 } },
        );
      }

      game.status = GameStatus.Ended;
      await game.save();

      return game;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
