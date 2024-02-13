import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { GameService } from './game.service';
import { Game } from 'src/schemas';
import { CreateGameDto } from 'src/dtos';
import { AdminGuard } from 'src/guards';

@UseGuards(AdminGuard)
@Controller('admin')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post('create-game')
  createGame(@Body() dto: CreateGameDto): Promise<Game> {
    return this.gameService.createGame(dto);
  }
}
