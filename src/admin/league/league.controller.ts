import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { LeagueService } from './league.service';
import { AdminGuard } from 'src/guards';
import { CreateLeagueDto, CreateBasketDto } from 'src/dtos';
import { Basket, League } from 'src/schemas';
import { BasketService } from './basket.service';

@UseGuards(AdminGuard)
@Controller('admin')
export class LeagueController {
  constructor(
    private leagueService: LeagueService,
    private basketService: BasketService,
  ) {}

  @Post('create-league')
  createLeague(@Body() dto: CreateLeagueDto): Promise<League> {
    return this.leagueService.createLeague(dto);
  }

  @Post('create-basket')
  createBasket(@Body() dto: CreateBasketDto): Promise<Basket> {
    return this.basketService.createBasket(dto);
  }
}
