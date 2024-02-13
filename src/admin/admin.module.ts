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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Team.name, schema: TeamSchema },
      { name: Player.name, schema: PlayerSchema },
      { name: Ligue.name, schema: LigueSchema },
      { name: Game.name, schema: GameSchema },
      { name: Basket.name, schema: BasketSchema },
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
  ],
  controllers: [AdminController, LigueController, GameController],
})
export class AdminModule {}
