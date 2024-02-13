import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateGameDto } from 'src/dtos';
import { Basket, Game } from 'src/schemas';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(Basket.name) private basketModel: Model<Basket>,
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async createGame(dto: CreateGameDto): Promise<Game> {
    try {
      const game = await this.gameModel.create({
        ligue: new Types.ObjectId(dto.ligue),
      });

      const basket = await this.basketModel.findById(dto.basket).populate({
        path: 'teams',
        model: 'Team',
        populate: {
          path: 'user',
          model: 'User',
          select: 'email',
        },
      });

      basket.teams.map(async (team) => {
        await this.mailerService.sendMail({
          from: this.configService.get<string>('EMAIL_ADDRESS'),
          to: team.user.email,
          subject: 'Schedule the Game',
          html: '',
        });
      });

      return game;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
