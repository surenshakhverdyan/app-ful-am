import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { LigueService } from './ligue.service';
import { AdminGuard } from 'src/guards';
import { CreateLigueDto, CreateBasketDto } from 'src/dtos';
import { Basket, Ligue } from 'src/schemas';
import { BasketService } from './basket.service';

@UseGuards(AdminGuard)
@Controller('admin')
export class LigueController {
  constructor(
    private ligueService: LigueService,
    private basketService: BasketService,
  ) {}

  @Post('create-ligue')
  createLigue(@Body() dto: CreateLigueDto): Promise<Ligue> {
    return this.ligueService.createLigue(dto);
  }

  @Post('create-basket')
  createBasket(@Body() dto: CreateBasketDto): Promise<Basket> {
    return this.basketService.createBasket(dto);
  }
}
