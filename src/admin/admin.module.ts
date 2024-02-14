import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import {
  Basket,
  BasketSchema,
  Game,
  GameSchema,
  Ligue,
  LigueSchema,
  Player,
  PlayerSchema,
  Schedule,
  ScheduleSchema,
  Team,
  TeamSchema,
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
import { LigueController } from './ligue/ligue.controller';
import { LigueService } from './ligue/ligue.service';
import { GameController } from './game/game.controller';
import { GameService } from './game/game.service';
import { ScheduleController } from './schedule/schedule.controller';
import { ScheduleService } from './schedule/schedule.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Team.name, schema: TeamSchema },
      { name: Player.name, schema: PlayerSchema },
      { name: Ligue.name, schema: LigueSchema },
      { name: Game.name, schema: GameSchema },
      { name: Basket.name, schema: BasketSchema },
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
  ],
  providers: [
    UserService,
    TokenService,
    JwtService,
    UpdateUserService,
    DeletePlayerService,
    TeamService,
    LigueService,
    GameService,
    ScheduleService,
  ],
  controllers: [
    AdminController,
    LigueController,
    GameController,
    ScheduleController,
  ],
})
export class AdminModule {}
