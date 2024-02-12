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
  ],
  controllers: [AdminController],
})
export class AdminModule {}
