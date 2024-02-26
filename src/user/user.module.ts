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
  Config,
  ConfigSchema,
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
import { TeamService } from './team.service';
import { ScheduleController } from './schedule/schedule.controller';
import { ScheduleService } from './schedule/schedule.service';
import { TransferController } from './transfer/transfer.controller';
import { TransferService } from './transfer/transfer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Team.name, schema: TeamSchema },
      { name: Player.name, schema: PlayerSchema },
      { name: Schedule.name, schema: ScheduleSchema },
      { name: Transfer.name, schema: TransferSchema },
      { name: Config.name, schema: ConfigSchema },
    ]),
  ],
  controllers: [
    UserController,
    TeamController,
    ScheduleController,
    TransferController,
  ],
  providers: [
    UpdateUserService,
    JwtService,
    TokenService,
    TeamService,
    DeletePlayerService,
    ScheduleService,
    TransferService,
  ],
})
export class UserModule {}
