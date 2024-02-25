import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import {
  Basket,
  BasketSchema,
  Game,
  GameSchema,
  League,
  LeagueSchema,
  Player,
  PlayerSchema,
  Schedule,
  ScheduleSchema,
  Team,
  TeamSchema,
  Transfer,
  TransferSchema,
  User,
  UserSchema,
} from 'src/schemas';
import {
  DeletePlayerService,
  TeamService,
  TokenService,
  UpdateUserService,
} from 'src/services';
import { UserService } from './user.service';
import { AdminController } from './admin.controller';
import { LeagueController } from './league/league.controller';
import { LeagueService } from './league/league.service';
import { GameController } from './game/game.controller';
import { GameService } from './game/game.service';
import { ScheduleController } from './schedule/schedule.controller';
import { ScheduleService } from './schedule/schedule.service';
import { BasketService } from './league/basket.service';
import { StatisticsController } from './game/statistics/statistics.controller';
import { StatisticsService } from './game/statistics/statistics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Team.name, schema: TeamSchema },
      { name: Player.name, schema: PlayerSchema },
      { name: League.name, schema: LeagueSchema },
      { name: Game.name, schema: GameSchema },
      { name: Basket.name, schema: BasketSchema },
      { name: Schedule.name, schema: ScheduleSchema },
      { name: Transfer.name, schema: TransferSchema },
    ]),
  ],
  providers: [
    UserService,
    TokenService,
    JwtService,
    UpdateUserService,
    DeletePlayerService,
    TeamService,
    LeagueService,
    GameService,
    ScheduleService,
    BasketService,
    StatisticsService,
  ],
  controllers: [
    AdminController,
    LeagueController,
    GameController,
    ScheduleController,
    StatisticsController,
  ],
})
export class AdminModule {}
