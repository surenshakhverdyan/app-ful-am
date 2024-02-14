import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateBasketDto } from 'src/dtos';
import { Basket } from 'src/schemas';

@Injectable()
export class BasketService {
  constructor(@InjectModel(Basket.name) private basketModel: Model<Basket>) {}

  async createBasket(dto: CreateBasketDto): Promise<Basket> {
    try {
      const basket = await this.basketModel.create(dto);

      return basket;
    } catch (error: any) {
      throw new HttpException(error.message, 500);
    }
  }
}
