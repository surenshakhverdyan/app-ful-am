import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateGameDto } from 'src/dtos';
import { Role, TokenType } from 'src/enums';
import { IPopulatedBasket } from 'src/interfaces';
import { Basket, Game } from 'src/schemas';
import { TokenService } from 'src/services';
import { scheduleGameTemplate } from 'src/templates';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(Basket.name) private basketModel: Model<Basket>,
    private tokenService: TokenService,
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async createGame(dto: CreateGameDto): Promise<Game> {
    try {
      const game = await this.gameModel.create({
        ligue: new Types.ObjectId(dto.ligue),
      });

      const basket: IPopulatedBasket = await this.basketModel
        .findById(dto.basket)
        .populate({
          path: 'teams',
          model: 'Team',
          match: { status: 'active' },
          select: '_id',
          populate: {
            path: 'user',
            model: 'User',
            select: 'email',
          },
        })
        .select('-createdAt -updatedAt -__v');

      basket.teams.map(async (team) => {
        const payload = {
          sub: `${team._id} ${game._id}`,
          role: Role.User,
          type: TokenType.GameScheduleToken,
        };
        const token = this.tokenService.jwtGameScheduleSign(payload);
        const link = `${this.configService.get<string>('BASE_URL')}/game-scheduler/${token}`;
        const template = scheduleGameTemplate(link);

        await this.mailerService.sendMail({
          from: this.configService.get<string>('EMAIL_ADDRESS'),
          to: team.user.email,
          subject: 'Schedule the Game',
          html: template,
        });
      });

      return game;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
