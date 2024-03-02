import { HttpException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import { ChangeGameStatusDto, UpdateGameStatisticsDto } from 'src/dtos';
import { GameStatus, Status } from 'src/enums';
import { Game, League, Player } from 'src/schemas';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(Player.name) private playerModel: Model<Player>,
    @InjectModel(League.name) private leagueModel: Model<League>,
    @InjectConnection() private connection: Connection,
  ) {}

  async updateGameStatistics(dto: UpdateGameStatisticsDto): Promise<Game> {
    const session = await this.connection.startSession();
    try {
      const game = await this.gameModel.findById(dto.gameId);

      if (game.status !== GameStatus.Active)
        throw new HttpException('The game will be active', 403);

      session.startTransaction();

      if (game.team1.team.equals(dto.teamId)) {
        if (dto.cards && dto.cards.length > 0) {
          for (let i = 0; i < dto.cards.length; i++) {
            const element = dto.cards[i];
            game.team1.cards.push(element);
            if (element.red)
              await this.playerModel
                .findByIdAndUpdate(
                  element.player,
                  { $inc: { redCards: 1 }, $set: { status: Status.Inactive } },
                  { new: true },
                )
                .session(session);
            else
              await this.playerModel
                .findByIdAndUpdate(
                  element.player,
                  { $inc: { yellowCards: 1 } },
                  { new: true },
                )
                .session(session);
          }
        }

        if (dto.goals && dto.goals.length > 0) {
          for (let i = 0; i < dto.goals.length; i++) {
            const element = dto.goals[i];
            game.team1.goals.push(element);
            if (element.assist !== undefined)
              await this.playerModel
                .findByIdAndUpdate(
                  element.assist,
                  { $inc: { assists: 1 } },
                  { new: true },
                )
                .session(session);

            await this.playerModel
              .findByIdAndUpdate(
                element.goal,
                { $inc: { goals: 1 } },
                { new: true },
              )
              .session(session);
          }
        }
      } else {
        if (dto.cards && dto.cards.length > 0) {
          for (let i = 0; i < dto.cards.length; i++) {
            const element = dto.cards[i];
            game.team2.cards.push(element);
            if (element.red)
              await this.playerModel
                .findByIdAndUpdate(
                  element.player,
                  { $inc: { redCards: 1 }, $set: { status: Status.Inactive } },
                  { new: true },
                )
                .session(session);
            else
              await this.playerModel
                .findByIdAndUpdate(
                  element.player,
                  { $inc: { yellowCards: 1 } },
                  { new: true },
                )
                .session(session);
          }
        }

        if (dto.goals && dto.goals.length > 0) {
          for (let i = 0; i < dto.goals.length; i++) {
            const element = dto.goals[i];
            game.team2.goals.push(element);
            if (element.assist !== undefined)
              await this.playerModel
                .findByIdAndUpdate(
                  element.assist,
                  { $inc: { assists: 1 } },
                  { new: true },
                )
                .session(session);

            await this.playerModel
              .findByIdAndUpdate(
                element.goal,
                { $inc: { goals: 1 } },
                { new: true },
              )
              .session(session);
          }
        }
      }

      await game.save({ session });

      await session.commitTransaction();
      session.endSession();

      return game;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      throw new HttpException(error.message, 500);
    }
  }

  async changeGameStatus(dto: ChangeGameStatusDto): Promise<Game> {
    const session = await this.connection.startSession();

    try {
      const game = await this.gameModel.findById(dto.gameId).session(session);

      session.startTransaction();

      if (game.team1.goals.length > game.team2.goals.length) {
        await this.leagueModel
          .updateOne(
            { _id: game.league, 'teams.team': game.team1.team },
            { $inc: { 'teams.$.points': 3 } },
          )
          .session(session);
      } else if (game.team2.goals.length > game.team1.goals.length) {
        await this.leagueModel
          .updateOne(
            { _id: game.league, 'teams.team': game.team2.team },
            { $inc: { 'teams.$.points': 3 } },
          )
          .session(session);
      } else {
        await this.leagueModel
          .updateOne(
            { _id: game.league, 'teams.team': game.team1.team },
            { $inc: { 'teams.$.points': 1 } },
          )
          .session(session);
        await this.leagueModel
          .updateOne(
            { _id: game.league, 'teams.team': game.team2.team },
            { $inc: { 'teams.$.points': 1 } },
          )
          .session(session);
      }

      game.status = GameStatus.Ended;
      await game.save({ session });

      await session.commitTransaction();
      session.endSession();

      return game;
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      throw new HttpException(error.message, 500);
    }
  }
}
