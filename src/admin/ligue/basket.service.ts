import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateBasketDto } from 'src/dtos';
import { Basket } from 'src/schemas';

@Injectable()
export class BasketService {
  constructor(@InjectModel(Basket.name) private basketModel: Model<Basket>) {}

  async createBasket(dto: CreateBasketDto): Promise<Basket> {
    const ligue = new Types.ObjectId(dto.ligue);
    const teams: Array<Types.ObjectId> = [];
    dto.teams.map((team) => {
      const element = new Types.ObjectId(team);
      teams.push(element);
    });

    try {
      const basket = await this.basketModel.create({
        ligue,
        teams,
      });

      return basket;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
