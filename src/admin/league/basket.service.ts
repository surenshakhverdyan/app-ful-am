import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateBasketDto } from 'src/dtos';
import { Basket } from 'src/schemas';

@Injectable()
export class BasketService {
  constructor(@InjectModel(Basket.name) private basketModel: Model<Basket>) {}

  async createBasket(dto: CreateBasketDto): Promise<Basket> {
    try {
      const teams: Array<Types.ObjectId> = [];
      dto.teams.map((id) => {
        const element = new Types.ObjectId(id);
        teams.push(element);
      });
      const basket = await this.basketModel.create({
        league: new Types.ObjectId(dto.league),
        teams: teams,
      });

      return basket;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
