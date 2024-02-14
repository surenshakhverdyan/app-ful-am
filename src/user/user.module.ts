import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { UserController } from './user.controller';
import { TeamController } from './team.controller';
import {
  DeletePlayerService,
  TokenService,
  UpdateUserService,
} from 'src/services';
import {
  Player,
  PlayerSchema,
  Schedule,
  ScheduleSchema,
  Team,
  TeamSchema,
  User,
  UserSchema,
} from 'src/schemas';
import { TeamService } from './team.service';
import { ScheduleController } from './schedule/schedule.controller';
import { ScheduleService } from './schedule/schedule.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Team.name, schema: TeamSchema },
      { name: Player.name, schema: PlayerSchema },
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
  ],
  controllers: [UserController, TeamController, ScheduleController],
  providers: [
    UpdateUserService,
    JwtService,
    TokenService,
    TeamService,
    DeletePlayerService,
    ScheduleService,
  ],
})
export class UserModule {}
